/**
 * Stripe Webhook Handler
 * 
 * Security:
 * - Signature verification using Stripe SDK
 * - Idempotency checking
 * - Input validation
 * - Atomic transactions
 * - Security event logging
 * 
 * Supported Events:
 * - checkout.session.completed: One-time payments and subscription starts
 * - customer.subscription.created: New subscription
 * - customer.subscription.updated: Subscription changes (plan upgrade/downgrade)
 * - customer.subscription.deleted: Subscription cancellation
 * - invoice.payment_succeeded: Recurring payment success
 * - invoice.payment_failed: Recurring payment failure
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { verifyStripeWebhook } from '../stripe';
import { grantEntitlement, revokeEntitlement } from '../entitlements/grant';
import { query, queryOne, transaction, logSecurityEvent } from '../lib/db';
import { validateEmail, validateAmount, assertValid, sanitizeIPAddress } from '../lib/validation';
import { getProduct, isValidProductId } from '../config/products';

interface WebhookResponse {
  received: boolean;
  processed?: boolean;
  error?: string;
}

/**
 * Check if webhook event was already processed (idempotency)
 */
async function isWebhookProcessed(eventId: string): Promise<boolean> {
  const result = await queryOne<{ id: string }>(
    `SELECT id FROM webhook_events 
     WHERE provider = 'stripe' 
     AND payload->>'id' = $1 
     AND processed = true
     LIMIT 1`,
    [eventId]
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
     VALUES ('stripe', $1, $2, $3, $4, $5)
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
 * Process one-time payment success (checkout.session.completed)
 */
async function processCheckoutSuccess(
  session: Stripe.Checkout.Session,
  webhookEventId: string
): Promise<void> {
  const email = session.customer_email || session.metadata?.email;
  assertValid(validateEmail(email));

  const productId = session.metadata?.productId;
  if (!productId || !isValidProductId(productId)) {
    throw new Error('Invalid or missing product ID in session metadata');
  }

  const product = getProduct(productId);
  const paidAmount = (session.amount_total || 0) / 100; // Convert from cents

  assertValid(validateAmount(paidAmount));

  // Validate amount
  if (Math.abs(paidAmount - product.price_usd) > 0.01) {
    await logSecurityEvent({
      event_type: 'PAYMENT_MISMATCH',
      severity: 'HIGH',
      metadata: {
        sessionId: session.id,
        productId,
        expectedAmount: product.price_usd,
        paidAmount,
        email
      }
    });

    throw new Error('Payment amount mismatch');
  }

  await transaction(async (client) => {
    // Find or create user
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

    // Check if purchase already exists
    const existingPurchase = await queryOne<{ id: string }>(
      `SELECT id FROM purchases 
       WHERE provider = 'stripe' 
       AND provider_payment_id = $1`,
      [session.id]
    );

    let purchaseId: string;

    if (existingPurchase) {
      purchaseId = existingPurchase.id;
      await query(
        `UPDATE purchases 
         SET status = 'completed', paid_at = NOW(), updated_at = NOW()
         WHERE id = $1`,
        [purchaseId]
      );
    } else {
      const purchaseResult = await queryOne<{ id: string }>(
        `INSERT INTO purchases (user_id, email, product_id, amount_usd, provider, provider_payment_id, status, paid_at, metadata)
         VALUES ($1, $2, $3, $4, 'stripe', $5, 'completed', NOW(), $6)
         RETURNING id`,
        [
          userId,
          email,
          productId,
          paidAmount,
          session.id,
          JSON.stringify({
            customer_id: session.customer,
            subscription_id: session.subscription
          })
        ]
      );

      purchaseId = purchaseResult!.id;
    }

    // Grant entitlement
    await grantEntitlement(userId, productId, purchaseId);

    // Mark webhook as processed
    await query(
      `UPDATE webhook_events SET processed = true, processed_at = NOW() WHERE id = $1`,
      [webhookEventId]
    );

    console.log('Stripe payment processed:', {
      userId,
      email,
      productId,
      purchaseId,
      sessionId: session.id
    });
  });
}

/**
 * Process subscription creation
 */
async function processSubscriptionCreated(
  subscription: Stripe.Subscription,
  webhookEventId: string
): Promise<void> {
  const customerId = subscription.customer as string;
  
  // Get customer email
  // Note: In production, you'd fetch this from Stripe API or have it in metadata
  const email = subscription.metadata?.email;
  if (!email) {
    throw new Error('No email in subscription metadata');
  }

  assertValid(validateEmail(email));

  const productId = subscription.metadata?.productId;
  if (!productId || !isValidProductId(productId)) {
    throw new Error('Invalid product ID');
  }

  await transaction(async (client) => {
    let user = await queryOne<{ id: string }>(
      `SELECT id FROM users WHERE email = $1`,
      [email]
    );

    if (!user) {
      user = await queryOne<{ id: string }>(
        `INSERT INTO users (email, is_email_verified)
         VALUES ($1, true)
         RETURNING id`,
        [email]
      );
    }

    const userId = user!.id;

    // Create subscription record
    await query(
      `INSERT INTO subscriptions (user_id, product_id, stripe_subscription_id, stripe_customer_id, status, current_period_end)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (stripe_subscription_id) DO UPDATE
       SET status = $5, current_period_end = $6, updated_at = NOW()`,
      [
        userId,
        productId,
        subscription.id,
        customerId,
        subscription.status,
        new Date(subscription.current_period_end * 1000)
      ]
    );

    await query(
      `UPDATE webhook_events SET processed = true, processed_at = NOW() WHERE id = $1`,
      [webhookEventId]
    );

    console.log('Subscription created:', {
      userId,
      email,
      subscriptionId: subscription.id
    });
  });
}

/**
 * Process subscription update
 */
async function processSubscriptionUpdated(
  subscription: Stripe.Subscription,
  webhookEventId: string
): Promise<void> {
  await query(
    `UPDATE subscriptions 
     SET status = $1, 
         current_period_end = $2, 
         cancel_at = $3,
         canceled_at = $4,
         updated_at = NOW()
     WHERE stripe_subscription_id = $5`,
    [
      subscription.status,
      new Date(subscription.current_period_end * 1000),
      subscription.cancel_at ? new Date(subscription.cancel_at * 1000) : null,
      subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
      subscription.id
    ]
  );

  // If subscription is cancelled or past_due, revoke active entitlements
  if (subscription.status === 'canceled' || subscription.status === 'past_due') {
    const sub = await queryOne<{ user_id: string; product_id: string }>(
      `SELECT user_id, product_id FROM subscriptions WHERE stripe_subscription_id = $1`,
      [subscription.id]
    );

    if (sub) {
      await revokeEntitlement(sub.user_id, sub.product_id);
    }
  }

  await query(
    `UPDATE webhook_events SET processed = true, processed_at = NOW() WHERE id = $1`,
    [webhookEventId]
  );

  console.log('Subscription updated:', {
    subscriptionId: subscription.id,
    status: subscription.status
  });
}

/**
 * Process subscription deletion
 */
async function processSubscriptionDeleted(
  subscription: Stripe.Subscription,
  webhookEventId: string
): Promise<void> {
  await query(
    `UPDATE subscriptions 
     SET status = 'canceled', 
         canceled_at = NOW(), 
         updated_at = NOW()
     WHERE stripe_subscription_id = $1`,
    [subscription.id]
  );

  // Revoke entitlements
  const sub = await queryOne<{ user_id: string; product_id: string }>(
    `SELECT user_id, product_id FROM subscriptions WHERE stripe_subscription_id = $1`,
    [subscription.id]
  );

  if (sub) {
    await revokeEntitlement(sub.user_id, sub.product_id);
  }

  await query(
    `UPDATE webhook_events SET processed = true, processed_at = NOW() WHERE id = $1`,
    [webhookEventId]
  );

  console.log('Subscription deleted:', {
    subscriptionId: subscription.id
  });
}

/**
 * Process recurring invoice payment success
 */
async function processInvoicePaymentSucceeded(
  invoice: Stripe.Invoice,
  webhookEventId: string
): Promise<void> {
  const subscriptionId = invoice.subscription as string;
  if (!subscriptionId) {
    // Not a subscription invoice, ignore
    return;
  }

  // Update subscription status to active
  await query(
    `UPDATE subscriptions 
     SET status = 'active', updated_at = NOW()
     WHERE stripe_subscription_id = $1`,
    [subscriptionId]
  );

  // Ensure entitlement is active
  const sub = await queryOne<{ user_id: string; product_id: string }>(
    `SELECT user_id, product_id FROM subscriptions WHERE stripe_subscription_id = $1`,
    [subscriptionId]
  );

  if (sub) {
    await query(
      `UPDATE entitlements 
       SET is_active = true, updated_at = NOW()
       WHERE user_id = $1 
       AND entitlement_type IN ('path_monthly', 'path_annual', 'all_access_monthly', 'all_access_annual')`,
      [sub.user_id]
    );
  }

  await query(
    `UPDATE webhook_events SET processed = true, processed_at = NOW() WHERE id = $1`,
    [webhookEventId]
  );

  console.log('Invoice payment succeeded:', {
    invoiceId: invoice.id,
    subscriptionId
  });
}

/**
 * Process recurring invoice payment failure
 */
async function processInvoicePaymentFailed(
  invoice: Stripe.Invoice,
  webhookEventId: string
): Promise<void> {
  const subscriptionId = invoice.subscription as string;
  if (!subscriptionId) {
    return;
  }

  // Mark subscription as past_due
  await query(
    `UPDATE subscriptions 
     SET status = 'past_due', updated_at = NOW()
     WHERE stripe_subscription_id = $1`,
    [subscriptionId]
  );

  // Don't immediately revoke entitlements - give grace period
  // TODO: Send email notification to user

  await query(
    `UPDATE webhook_events SET processed = true, processed_at = NOW() WHERE id = $1`,
    [webhookEventId]
  );

  console.log('Invoice payment failed:', {
    invoiceId: invoice.id,
    subscriptionId
  });
}

/**
 * Main webhook handler
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      received: false,
      error: 'Method not allowed'
    } as WebhookResponse);
  }

  const startTime = Date.now();
  let webhookEventId: string | null = null;

  try {
    const ipAddress = sanitizeIPAddress(
      req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown'
    );

    // Get signature
    const signature = req.headers['stripe-signature'] as string;
    if (!signature) {
      await logSecurityEvent({
        event_type: 'WEBHOOK_FAILURE',
        severity: 'MEDIUM',
        ip_address: ipAddress,
        metadata: { reason: 'Missing Stripe signature' }
      });

      return res.status(400).json({
        received: false,
        error: 'Missing signature'
      } as WebhookResponse);
    }

    // Verify webhook signature using Stripe SDK
    const payload = JSON.stringify(req.body);
    let event: Stripe.Event;

    try {
      event = verifyStripeWebhook(payload, signature);
    } catch (error: any) {
      await logSecurityEvent({
        event_type: 'WEBHOOK_FAILURE',
        severity: 'HIGH',
        ip_address: ipAddress,
        metadata: { reason: 'Invalid Stripe signature', error: error.message }
      });

      return res.status(400).json({
        received: false,
        error: 'Invalid signature'
      } as WebhookResponse);
    }

    // Check idempotency
    const alreadyProcessed = await isWebhookProcessed(event.id);
    if (alreadyProcessed) {
      console.log('Webhook already processed:', { eventId: event.id, type: event.type });
      return res.status(200).json({
        received: true,
        processed: false,
        error: 'Already processed'
      } as WebhookResponse);
    }

    // Store webhook event
    webhookEventId = await storeWebhookEvent(event.type, event, false);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await processCheckoutSuccess(event.data.object as Stripe.Checkout.Session, webhookEventId);
        break;

      case 'customer.subscription.created':
        await processSubscriptionCreated(event.data.object as Stripe.Subscription, webhookEventId);
        break;

      case 'customer.subscription.updated':
        await processSubscriptionUpdated(event.data.object as Stripe.Subscription, webhookEventId);
        break;

      case 'customer.subscription.deleted':
        await processSubscriptionDeleted(event.data.object as Stripe.Subscription, webhookEventId);
        break;

      case 'invoice.payment_succeeded':
        await processInvoicePaymentSucceeded(event.data.object as Stripe.Invoice, webhookEventId);
        break;

      case 'invoice.payment_failed':
        await processInvoicePaymentFailed(event.data.object as Stripe.Invoice, webhookEventId);
        break;

      default:
        // Unknown event type - acknowledge but don't process
        console.log('Unknown Stripe event type:', event.type);
        await query(
          `UPDATE webhook_events SET processed = true, processed_at = NOW() WHERE id = $1`,
          [webhookEventId]
        );
        break;
    }

    const processingTime = Date.now() - startTime;
    console.log(`Stripe webhook processed in ${processingTime}ms:`, {
      eventId: event.id,
      type: event.type
    });

    return res.status(200).json({
      received: true,
      processed: true
    } as WebhookResponse);
  } catch (error: any) {
    console.error('Stripe webhook error:', error);

    if (webhookEventId) {
      await storeWebhookEvent(
        'error',
        { error: error.message },
        false,
        error.message
      ).catch(console.error);
    }

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
