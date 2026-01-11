/**
 * Checkout API - Create Payment Invoices
 * 
 * Security:
 * - Input validation on all parameters
 * - Product catalog validation (server-side pricing)
 * - Rate limiting (TODO: implement)
 * - CORS configuration
 * - Email validation with disposable blocking
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { createBTCPayInvoice } from '../btcpay';
import { query, queryOne, logSecurityEvent } from '../lib/db';
import { 
  validateEmail, 
  validateProductId, 
  validateDeviceFingerprint,
  assertValid, 
  sanitizeIPAddress, 
  sanitizeUserAgent 
} from '../lib/validation';
import { getProduct, supportsBTCPay, isRecurring, getPrice } from '../config/products';

interface CheckoutRequest {
  email: string;
  productId: string;
  provider: 'btcpay' | 'stripe';
  successUrl: string;
  cancelUrl?: string;
  deviceFingerprint?: string;
}

interface CheckoutResponse {
  provider: 'btcpay' | 'stripe';
  checkoutUrl: string;
  invoiceId: string;
  expiresAt?: string;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

/**
 * Handle CORS preflight
 */
function handleCORS(req: VercelRequest, res: VercelResponse): boolean {
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  return false;
}

/**
 * Rate limiting check (simple in-memory implementation)
 * TODO: Use Redis in production
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(identifier: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || record.resetAt < now) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

/**
 * Clean up old rate limit records
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (record.resetAt < now) {
      rateLimitMap.delete(key);
    }
  }
}, 60000);

/**
 * Main checkout handler
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS
  if (handleCORS(req, res)) return;

  // Only POST allowed
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed'
    });
  }

  const startTime = Date.now();

  try {
    // Get request metadata
    const ipAddress = sanitizeIPAddress(
      req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown'
    );
    const userAgent = sanitizeUserAgent(req.headers['user-agent']);

    // Rate limiting by IP
    if (!checkRateLimit(ipAddress, 10, 60000)) {
      await logSecurityEvent({
        event_type: 'RATE_LIMIT_HIT',
        severity: 'MEDIUM',
        ip_address: ipAddress,
        metadata: { endpoint: 'checkout' }
      });

      return res.status(429).json({
        error: 'Too many requests. Please try again later.'
      });
    }

    // Parse and validate request
    const checkoutReq: CheckoutRequest = req.body;

    // Validate email
    const emailValidation = validateEmail(checkoutReq.email);
    if (!emailValidation.valid) {
      return res.status(400).json({
        error: emailValidation.error
      });
    }

    // Validate product ID
    const productValidation = validateProductId(checkoutReq.productId);
    if (!productValidation.valid) {
      return res.status(400).json({
        error: productValidation.error
      });
    }

    // Get product (throws if invalid)
    const product = getProduct(checkoutReq.productId);

    // Validate provider
    if (!checkoutReq.provider || !['btcpay', 'stripe'].includes(checkoutReq.provider)) {
      return res.status(400).json({
        error: 'Invalid payment provider'
      });
    }

    // Check if product supports selected provider
    if (checkoutReq.provider === 'btcpay' && !supportsBTCPay(checkoutReq.productId)) {
      return res.status(400).json({
        error: 'This product does not support Bitcoin payments. Please use a credit card.'
      });
    }

    // BTCPay doesn't support recurring subscriptions
    if (checkoutReq.provider === 'btcpay' && isRecurring(checkoutReq.productId) && product.type.includes('monthly')) {
      return res.status(400).json({
        error: 'Monthly subscriptions require credit card payment'
      });
    }

    // Validate URLs
    if (!checkoutReq.successUrl || !checkoutReq.successUrl.startsWith('https://')) {
      return res.status(400).json({
        error: 'Invalid success URL'
      });
    }

    // Validate device fingerprint if provided
    if (checkoutReq.deviceFingerprint) {
      const fingerprintValidation = validateDeviceFingerprint(checkoutReq.deviceFingerprint);
      if (!fingerprintValidation.valid) {
        return res.status(400).json({
          error: fingerprintValidation.error
        });
      }
    }

    // Create checkout session based on provider
    let checkoutResponse: CheckoutResponse;

    if (checkoutReq.provider === 'btcpay') {
      // Create BTCPay invoice
      const btcpayResponse = await createBTCPayInvoice({
        email: checkoutReq.email,
        items: [{
          type: product.type,
          id: checkoutReq.productId,
          title: product.name
        }],
        successUrl: checkoutReq.successUrl,
        cancelUrl: checkoutReq.cancelUrl
      });

      checkoutResponse = {
        provider: 'btcpay',
        checkoutUrl: btcpayResponse.url,
        invoiceId: btcpayResponse.invoiceId
      };

      // Log checkout initiation
      console.log('BTCPay checkout created:', {
        email: checkoutReq.email,
        productId: checkoutReq.productId,
        invoiceId: btcpayResponse.invoiceId
      });
    } else {
      // Stripe checkout (TODO: implement when Stripe is configured)
      return res.status(501).json({
        error: 'Stripe checkout not yet implemented'
      });
    }

    // Track checkout initiation in database
    await query(
      `INSERT INTO purchases (email, product_id, amount_usd, provider, provider_payment_id, status, metadata)
       VALUES ($1, $2, $3, $4, $5, 'pending', $6)
       ON CONFLICT (provider, provider_payment_id) DO NOTHING`,
      [
        checkoutReq.email,
        checkoutReq.productId,
        product.price_usd,
        checkoutReq.provider,
        checkoutResponse.invoiceId,
        JSON.stringify({
          ip_address: ipAddress,
          user_agent: userAgent,
          device_fingerprint: checkoutReq.deviceFingerprint
        })
      ]
    );

    const processingTime = Date.now() - startTime;
    console.log(`Checkout processed in ${processingTime}ms:`, {
      email: checkoutReq.email,
      productId: checkoutReq.productId,
      provider: checkoutReq.provider
    });

    return res.status(200).json(checkoutResponse);
  } catch (error: any) {
    console.error('Checkout error:', error);

    await logSecurityEvent({
      event_type: 'WEBHOOK_FAILURE',
      severity: 'MEDIUM',
      metadata: {
        error: error.message,
        endpoint: 'checkout'
      }
    }).catch(console.error);

    return res.status(500).json({
      error: 'Failed to create checkout session',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
