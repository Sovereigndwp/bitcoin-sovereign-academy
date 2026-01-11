/**
 * BTCPay Server Webhook Handler
 * 
 * Security:
 * - HMAC signature verification (constant-time comparison)
 * - Idempotency checking (prevent duplicate processing)
 * - Input validation on all fields
 * - Atomic transactions for database operations
 * - Security event logging
 * - Rate limiting (TODO: Add rate limiter)
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { verifyBTCPayWebhook, getBTCPayInvoiceStatus } from '../btcpay';
import { grantEntitlement } from '../entitlements/grant';
import { query, queryOne, transaction, logSecurityEvent } from '../lib/db';
import { validateEmail, validateInvoiceId, validateAmount, assertValid, sanitizeIPAddress, sanitizeUserAgent } from '../lib/validation';
import { getProduct, isValidProductId } from '../config/products';

interface WebhookResponse {
  received: boolean;
  processed?: boolean;
  error?: string;
}

/**
 * Get BTCPay config
 */
function getBTCPayConfig() {
  const url = process.env.BTCPAY_URL;
  const apiKey = process.env.BTCPAY_API_KEY;
  const storeId = process.env.BTCPAY_STORE_ID;
  const webhookSecret = process.env.BTCPAY_WEBHOOK_SECRET;

  if (!url || !apiKey || !storeId || !webhookSecret) {
    throw new Error('BTCPay Server configuration incomplete');
  }

  return { url, apiKey, storeId, webhookSecret };
}

/**
 * Verify webhook signature with constant-time comparison
 */
function verifyWebhookSignature(payload: string, signature: string): boolean {
  const config = getBTCPayConfig();
  
  // BTCPay signature format: sha256=<hex>
  if (!signature || !signature.startsWith('sha256=')) {
    return false;
  }

  const hmac = crypto.createHmac('sha256', config.webhookSecret);
  hmac.update(payload);
  const expectedSignature = `sha256=${hmac.digest('hex')}`;

  try {
    // Constant-time comparison prevents timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch {
    return false;
  }
}

/**
 * Check if webhook event was already processed (idempotency)
 */
async function isWebhookProcessed(invoiceId: string, eventType: string): Promise<boolean> {
  const result = await queryOne<{ id: string }>(
    `SELECT id FROM webhook_events 
     WHERE provider = 'btcpay' 
     AND event_type = $1 
     AND payload->>'invoiceId' = $2 
     AND processed = true
     LIMIT 1`,
    [eventType, invoiceId]
  );

  return result !== null;
}

/**
 * Store webhook event for debugging and idempotency
 */
async function storeWebhookEvent(
  eventType: string,
  payload: any,
  processed: boolean,
  error?: string
): Promise<string> {
  const result = await queryOne<{ id: string }>(
    `INSERT INTO webhook_events (provider, event_type, payload, processed, processed_at, error)
     VALUES ('btcpay', $1, $2, $3, $4, $5)
     RETURNING id`,
    [
      eventType,
      JSON.stringify(payload),
      processed,
      processed ? new Date() : null,
      error || null
    ]
  );

  return result!.id;
}

/**
 * Process successful payment
 */
async function processPaymentSuccess(invoiceId: string, webhookEventId: string): Promise<void> {
  // Validate invoice ID
  assertValid(validateInvoiceId(invoiceId));

  // Get invoice details from BTCPay
  const invoice = await getBTCPayInvoiceStatus(invoiceId);

  // Verify invoice is settled
  if (invoice.status !== 'Settled') {
    throw new Error(`Invoice not settled. Status: ${invoice.status}`);
  }

  // Extract and validate metadata
  const email = invoice.metadata?.buyerEmail;
  assertValid(validateEmail(email));

  const productId = invoice.metadata?.productId;
  if (!productId || !isValidProductId(productId)) {
    throw new Error('Invalid or missing product ID in invoice metadata');
  }

  // Validate amount matches product price
  const product = getProduct(productId);
  const expectedAmount = product.price_usd;
  const paidAmount = parseFloat(invoice.amount);

  assertValid(validateAmount(paidAmount));

  if (Math.abs(paidAmount - expectedAmount) > 0.01) {
    // Log security event for price mismatch
    await logSecurityEvent({
      event_type: 'PAYMENT_MISMATCH',
      severity: 'HIGH',
      metadata: {
        invoiceId,
        productId,
        expectedAmount,
        paidAmount,
        email
      }
    });

    throw new Error('Payment amount mismatch');
  }

  // Use transaction for atomicity
  await transaction(async (client) => {
    // 1. Find or create user
    let user = await queryOne<{ id: string }>(
      `SELECT id FROM users WHERE email = $1`,
      [email]
    );

    if (!user) {
      user = await queryOne<{ id: string }>(
        `INSERT INTO users (email, is_email_verified, created_at)
         VALUES ($1, true, NOW())
         RETURNING id`,
        [email]
      );
    }

    const userId = user!.id;

    // 2. Check if purchase already exists (idempotency)
    const existingPurchase = await queryOne<{ id: string }>(
      `SELECT id FROM purchases 
       WHERE provider = 'btcpay' 
       AND provider_payment_id = $1`,
      [invoiceId]
    );

    let purchaseId: string;

    if (existingPurchase) {
      // Update existing purchase
      purchaseId = existingPurchase.id;
      await query(
        `UPDATE purchases 
         SET status = 'completed', paid_at = NOW(), updated_at = NOW()
         WHERE id = $1`,
        [purchaseId]
      );
    } else {
      // Create new purchase record
      const purchaseResult = await queryOne<{ id: string }>(
        `INSERT INTO purchases (user_id, email, product_id, amount_usd, provider, provider_payment_id, status, paid_at, metadata)
         VALUES ($1, $2, $3, $4, 'btcpay', $5, 'completed', NOW(), $6)
         RETURNING id`,
        [
          userId,
          email,
          productId,
          paidAmount,
          invoiceId,
          JSON.stringify({ invoice_metadata: invoice.metadata })
        ]
      );

      purchaseId = purchaseResult!.id;
    }

    // 3. Grant entitlement
    await grantEntitlement(userId, productId, purchaseId);

    // 4. Mark webhook as processed
    await query(
      `UPDATE webhook_events 
       SET processed = true, processed_at = NOW()
       WHERE id = $1`,
      [webhookEventId]
    );

    console.log('Payment processed successfully:', {
      userId,
      email,
      productId,
      purchaseId,
      invoiceId
    });
  });

  // Send payment receipt email (don't block on email sending)
  try {
    const { sendPaymentReceipt } = await import('../lib/email');
    await sendPaymentReceipt({
      email,
      productName: product.name,
      amount: paidAmount,
      currency: 'USD',
      date: new Date(),
      invoiceId
    });
  } catch (emailError) {
    console.error('Failed to send receipt email:', emailError);
    // Don't fail the webhook - payment is already processed
  }
}

/**
 * Main webhook handler
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      received: false,
      error: 'Method not allowed'
    } as WebhookResponse);
  }

  const startTime = Date.now();
  let webhookEventId: string | null = null;

  try {
    // Get request metadata for logging
    const ipAddress = sanitizeIPAddress(
      req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown'
    );
    const userAgent = sanitizeUserAgent(req.headers['user-agent']);

    // Get signature from header
    const signature = req.headers['btcpay-sig'] as string;
    if (!signature) {
      await logSecurityEvent({
        event_type: 'WEBHOOK_FAILURE',
        severity: 'MEDIUM',
        ip_address: ipAddress,
        metadata: { reason: 'Missing signature' }
      });

      return res.status(400).json({
        received: false,
        error: 'Missing signature'
      } as WebhookResponse);
    }

    // Get raw payload
    const payload = JSON.stringify(req.body);

    // Verify signature
    if (!verifyWebhookSignature(payload, signature)) {
      await logSecurityEvent({
        event_type: 'WEBHOOK_FAILURE',
        severity: 'HIGH',
        ip_address: ipAddress,
        metadata: { reason: 'Invalid signature' }
      });

      return res.status(400).json({
        received: false,
        error: 'Invalid signature'
      } as WebhookResponse);
    }

    // Parse event
    const event = req.body;
    const eventType = event.type || event.eventType || 'unknown';
    const invoiceId = event.invoiceId || event.invoice_id;

    if (!invoiceId) {
      return res.status(400).json({
        received: false,
        error: 'Missing invoice ID'
      } as WebhookResponse);
    }

    // Check idempotency - prevent duplicate processing
    const alreadyProcessed = await isWebhookProcessed(invoiceId, eventType);
    if (alreadyProcessed) {
      console.log('Webhook already processed:', { invoiceId, eventType });
      return res.status(200).json({
        received: true,
        processed: false,
        error: 'Already processed'
      } as WebhookResponse);
    }

    // Store webhook event
    webhookEventId = await storeWebhookEvent(eventType, event, false);

    // Handle different event types
    if (eventType === 'InvoiceSettled') {
      await processPaymentSuccess(invoiceId, webhookEventId);

      const processingTime = Date.now() - startTime;
      console.log(`Webhook processed in ${processingTime}ms:`, { invoiceId, eventType });

      return res.status(200).json({
        received: true,
        processed: true
      } as WebhookResponse);
    } else if (eventType === 'InvoiceExpired' || eventType === 'InvoiceInvalid') {
      // Log failed payment attempts
      await query(
        `UPDATE webhook_events 
         SET processed = true, processed_at = NOW()
         WHERE id = $1`,
        [webhookEventId]
      );

      console.log('Invoice failed:', { invoiceId, eventType });

      return res.status(200).json({
        received: true,
        processed: true
      } as WebhookResponse);
    } else {
      // Unknown event type - acknowledge but don't process
      console.log('Unknown event type:', eventType);

      return res.status(200).json({
        received: true,
        processed: false,
        error: 'Unknown event type'
      } as WebhookResponse);
    }
  } catch (error: any) {
    console.error('Webhook processing error:', error);

    // Update webhook event with error
    if (webhookEventId) {
      await storeWebhookEvent(
        'error',
        { error: error.message },
        false,
        error.message
      ).catch(console.error);
    }

    // Log security event
    await logSecurityEvent({
      event_type: 'WEBHOOK_FAILURE',
      severity: 'HIGH',
      metadata: {
        error: error.message,
        stack: error.stack
      }
    }).catch(console.error);

    return res.status(500).json({
      received: true,
      processed: false,
      error: error.message
    } as WebhookResponse);
  }
}
