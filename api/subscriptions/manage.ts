/**
 * Subscription Management API
 * 
 * Endpoints:
 * - GET /api/subscriptions/manage?action=status
 * - POST /api/subscriptions/manage (cancel, reactivate)
 * 
 * Security:
 * - JWT authentication required
 * - User can only manage their own subscriptions
 * - Validates Stripe subscription before canceling
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { query, queryOne, logSecurityEvent } from '../lib/db';
import { verifyJWTWithRevocation, extractBearerToken } from '../lib/jwt';
import { sanitizeIPAddress, sanitizeUserAgent } from '../lib/validation';

interface SubscriptionResponse {
  subscriptions: Array<{
    id: string;
    productId: string;
    productName: string;
    status: string;
    currentPeriodEnd: string;
    cancelAt?: string;
    canceledAt?: string;
    cancelAtPeriodEnd: boolean;
    price: number;
    interval: string;
  }>;
}

interface ManageRequest {
  action: 'cancel' | 'reactivate';
  subscriptionId: string;
  reason?: string;
}

/**
 * Get Stripe client
 */
function getStripe(): Stripe {
  const secret = process.env.STRIPE_SECRET;
  if (!secret) {
    throw new Error('STRIPE_SECRET not configured');
  }
  return new Stripe(secret, {
    apiVersion: '2025-02-24.acacia',
  });
}

/**
 * Get product name from ID
 */
function getProductName(productId: string): string {
  const names: Record<string, string> = {
    path_monthly_curious: 'Curious Path Monthly',
    path_monthly_pragmatist: 'Pragmatist Path Monthly',
    path_monthly_builder: 'Builder Path Monthly',
    path_monthly_sovereign: 'Sovereign Path Monthly',
    path_annual_curious: 'Curious Path Annual',
    path_annual_pragmatist: 'Pragmatist Path Annual',
    path_annual_builder: 'Builder Path Annual',
    path_annual_sovereign: 'Sovereign Path Annual',
    all_access_monthly: 'All Access Monthly',
    all_access_annual: 'All Access Annual'
  };
  return names[productId] || productId;
}

/**
 * Get user's subscriptions
 */
async function getUserSubscriptions(userId: string): Promise<SubscriptionResponse> {
  const subs = await query<{
    id: string;
    product_id: string;
    stripe_subscription_id: string;
    status: string;
    current_period_end: Date;
    cancel_at: Date | null;
    canceled_at: Date | null;
    cancel_at_period_end: boolean;
  }>(
    `SELECT id, product_id, stripe_subscription_id, status, 
            current_period_end, cancel_at, canceled_at, cancel_at_period_end
     FROM subscriptions
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );

  const subscriptions = subs.rows.map(sub => {
    // Determine interval from product_id
    const interval = sub.product_id.includes('monthly') ? 'month' : 'year';
    const price = interval === 'month' 
      ? (sub.product_id.includes('all_access') ? 19 : 9)
      : (sub.product_id.includes('all_access') ? 149 : 79);

    return {
      id: sub.id,
      productId: sub.product_id,
      productName: getProductName(sub.product_id),
      status: sub.status,
      currentPeriodEnd: sub.current_period_end.toISOString(),
      cancelAt: sub.cancel_at?.toISOString(),
      canceledAt: sub.canceled_at?.toISOString(),
      cancelAtPeriodEnd: sub.cancel_at_period_end,
      price,
      interval
    };
  });

  return { subscriptions };
}

/**
 * Cancel subscription
 */
async function cancelSubscription(
  userId: string,
  subscriptionId: string,
  reason?: string
): Promise<void> {
  // Get subscription
  const sub = await queryOne<{
    stripe_subscription_id: string;
    user_id: string;
    status: string;
  }>(
    `SELECT stripe_subscription_id, user_id, status
     FROM subscriptions
     WHERE id = $1`,
    [subscriptionId]
  );

  if (!sub) {
    throw new Error('Subscription not found');
  }

  // Verify ownership
  if (sub.user_id !== userId) {
    await logSecurityEvent({
      event_type: 'SUSPICIOUS_ACTIVITY',
      severity: 'HIGH',
      user_id: userId,
      metadata: {
        action: 'cancel_subscription',
        subscriptionId,
        reason: 'User attempted to cancel another user\'s subscription'
      }
    });
    throw new Error('Unauthorized');
  }

  // Check if already canceled
  if (sub.status === 'canceled') {
    throw new Error('Subscription already canceled');
  }

  // Cancel in Stripe (at period end)
  const stripe = getStripe();
  await stripe.subscriptions.update(sub.stripe_subscription_id, {
    cancel_at_period_end: true,
    metadata: {
      cancellation_reason: reason || 'User requested',
      canceled_by: 'user'
    }
  });

  // Update database
  await query(
    `UPDATE subscriptions
     SET cancel_at_period_end = true, updated_at = NOW()
     WHERE id = $1`,
    [subscriptionId]
  );

  console.log('Subscription canceled:', {
    userId,
    subscriptionId,
    reason
  });
}

/**
 * Reactivate subscription
 */
async function reactivateSubscription(
  userId: string,
  subscriptionId: string
): Promise<void> {
  // Get subscription
  const sub = await queryOne<{
    stripe_subscription_id: string;
    user_id: string;
    cancel_at_period_end: boolean;
  }>(
    `SELECT stripe_subscription_id, user_id, cancel_at_period_end
     FROM subscriptions
     WHERE id = $1`,
    [subscriptionId]
  );

  if (!sub) {
    throw new Error('Subscription not found');
  }

  // Verify ownership
  if (sub.user_id !== userId) {
    await logSecurityEvent({
      event_type: 'SUSPICIOUS_ACTIVITY',
      severity: 'HIGH',
      user_id: userId,
      metadata: {
        action: 'reactivate_subscription',
        subscriptionId
      }
    });
    throw new Error('Unauthorized');
  }

  // Check if scheduled for cancellation
  if (!sub.cancel_at_period_end) {
    throw new Error('Subscription is not scheduled for cancellation');
  }

  // Reactivate in Stripe
  const stripe = getStripe();
  await stripe.subscriptions.update(sub.stripe_subscription_id, {
    cancel_at_period_end: false,
    metadata: {
      reactivated_by: 'user'
    }
  });

  // Update database
  await query(
    `UPDATE subscriptions
     SET cancel_at_period_end = false, cancel_at = NULL, updated_at = NOW()
     WHERE id = $1`,
    [subscriptionId]
  );

  console.log('Subscription reactivated:', {
    userId,
    subscriptionId
  });
}

/**
 * Main handler
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const ipAddress = sanitizeIPAddress(
    req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown'
  );

  try {
    // Extract and verify JWT
    const token = extractBearerToken(req.headers.authorization as string);
    if (!token) {
      return res.status(401).json({
        error: 'Authentication required'
      });
    }

    const payload = verifyJWTWithRevocation(token);
    const userId = payload.user_id;

    // Handle GET requests (get subscriptions)
    if (req.method === 'GET') {
      const subscriptions = await getUserSubscriptions(userId);
      return res.status(200).json(subscriptions);
    }

    // Handle POST requests (cancel/reactivate)
    if (req.method === 'POST') {
      const body = req.body as ManageRequest;

      if (!body.action || !body.subscriptionId) {
        return res.status(400).json({
          error: 'Missing required fields: action, subscriptionId'
        });
      }

      if (body.action === 'cancel') {
        await cancelSubscription(userId, body.subscriptionId, body.reason);
        return res.status(200).json({
          success: true,
          message: 'Subscription will be canceled at the end of the current period'
        });
      } else if (body.action === 'reactivate') {
        await reactivateSubscription(userId, body.subscriptionId);
        return res.status(200).json({
          success: true,
          message: 'Subscription reactivated successfully'
        });
      } else {
        return res.status(400).json({
          error: 'Invalid action. Must be "cancel" or "reactivate"'
        });
      }
    }

    return res.status(405).json({
      error: 'Method not allowed'
    });
  } catch (error: any) {
    console.error('Subscription management error:', error);

    await logSecurityEvent({
      event_type: 'WEBHOOK_FAILURE',
      severity: 'MEDIUM',
      ip_address: ipAddress,
      metadata: {
        error: error.message,
        endpoint: 'subscriptions/manage'
      }
    }).catch(console.error);

    const statusCode = error.message === 'Unauthorized' ? 403 : 500;
    return res.status(statusCode).json({
      error: error.message || 'Failed to manage subscription'
    });
  }
}
