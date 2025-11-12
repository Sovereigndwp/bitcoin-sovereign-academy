/**
 * Zaprite Webhook Handler
 * Receives payment notifications from Zaprite
 *
 * POST /api/webhooks/zaprite
 * Handles: order.paid, order.expired, order.cancelled events
 */

import crypto from 'crypto';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const webhookPayload = req.body;
    const signature = req.headers['x-zaprite-signature'] || req.headers['signature'];

    // Log incoming webhook (for debugging in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('Webhook received:', {
        event: webhookPayload.event,
        orderId: webhookPayload.order_id,
        timestamp: new Date().toISOString()
      });
    }

    // Verify webhook signature
    const webhookSecret = process.env.ZAPRITE_WEBHOOK_SECRET;
    if (webhookSecret && signature) {
      const isValid = verifyWebhookSignature(webhookPayload, signature, webhookSecret);
      if (!isValid) {
        console.error('Invalid webhook signature');
        return res.status(401).json({ error: 'Invalid signature' });
      }
    } else if (process.env.NODE_ENV === 'production') {
      // In production, always require signature verification
      console.error('Missing webhook signature or secret');
      return res.status(401).json({ error: 'Signature verification required' });
    }

    // Extract webhook data
    const {
      event,
      order_id,
      external_uniq_id,
      amount,
      currency,
      paid_at,
      payment_method,
      metadata
    } = webhookPayload;

    // Handle different webhook events
    switch (event) {
      case 'order.paid':
        return await handleOrderPaid({
          orderId: order_id,
          externalUniqId: external_uniq_id,
          amount,
          currency,
          paidAt: paid_at,
          paymentMethod: payment_method,
          metadata
        }, res);

      case 'order.expired':
        return handleOrderExpired(order_id, res);

      case 'order.cancelled':
        return handleOrderCancelled(order_id, res);

      default:
        console.log(`Unhandled webhook event: ${event}`);
        return res.status(200).json({ received: true, event });
    }

  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({
      error: 'Webhook processing failed',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

/**
 * Verify webhook signature using HMAC SHA256
 */
function verifyWebhookSignature(payload, signature, secret) {
  try {
    const hmac = crypto.createHmac('sha256', secret);
    const payloadString = JSON.stringify(payload);
    const computedSignature = hmac.update(payloadString).digest('hex');

    // Timing-safe comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(computedSignature)
    );
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

/**
 * Handle order.paid webhook event
 * This is the main event - user has successfully paid!
 */
async function handleOrderPaid(orderData, res) {
  const {
    orderId,
    externalUniqId,
    amount,
    currency,
    paidAt,
    paymentMethod,
    metadata
  } = orderData;

  try {
    // Extract product and user info from metadata or external_uniq_id
    const product = metadata?.product || extractProductFromId(externalUniqId);
    const userId = metadata?.user_id || extractUserFromId(externalUniqId);

    if (!product || !userId) {
      console.error('Missing product or userId in webhook data');
      return res.status(400).json({ error: 'Invalid webhook data' });
    }

    // Verify payment with Zaprite API (double-check for security)
    const isVerified = await verifyPaymentStatus(orderId);
    if (!isVerified) {
      console.error('Payment verification failed:', orderId);
      return res.status(400).json({ error: 'Payment not verified' });
    }

    // Generate access token (JWT) for the user
    const accessToken = generateAccessToken({
      userId,
      product,
      orderId,
      paidAt,
      paymentMethod
    });

    // Log successful payment
    console.log('Payment verified:', {
      orderId,
      product,
      userId,
      amount,
      currency,
      paymentMethod,
      paidAt
    });

    // In a real system, you'd store this in a database
    // For now, we return the access token for client-side storage

    return res.status(200).json({
      success: true,
      orderId,
      accessToken,
      product,
      message: 'Payment verified and access granted'
    });

  } catch (error) {
    console.error('Error handling order.paid:', error);
    return res.status(500).json({ error: 'Failed to process payment' });
  }
}

/**
 * Handle order.expired webhook event
 */
function handleOrderExpired(orderId, res) {
  console.log('Order expired:', orderId);
  return res.status(200).json({
    received: true,
    event: 'order.expired',
    orderId
  });
}

/**
 * Handle order.cancelled webhook event
 */
function handleOrderCancelled(orderId, res) {
  console.log('Order cancelled:', orderId);
  return res.status(200).json({
    received: true,
    event: 'order.cancelled',
    orderId
  });
}

/**
 * Verify payment status with Zaprite API
 */
async function verifyPaymentStatus(orderId) {
  try {
    const ZAPRITE_API_KEY = process.env.ZAPRITE_API_KEY;
    if (!ZAPRITE_API_KEY) {
      throw new Error('ZAPRITE_API_KEY not configured');
    }

    const response = await fetch(`https://api.zaprite.com/v1/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Authorization': ZAPRITE_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('Zaprite API error:', response.status);
      return false;
    }

    const orderData = await response.json();
    return orderData.status === 'paid';

  } catch (error) {
    console.error('Error verifying payment:', error);
    return false;
  }
}

/**
 * Generate access token (JWT) for user
 * This token proves they paid and grants access to content
 */
function generateAccessToken(data) {
  const { userId, product, orderId, paidAt, paymentMethod } = data;

  // Create a simple token structure
  // In production, use a proper JWT library like 'jsonwebtoken'
  const tokenData = {
    userId,
    product,
    orderId,
    paidAt,
    paymentMethod,
    grantedAt: new Date().toISOString(),
    expiresAt: null // Lifetime access
  };

  // Sign the token
  const secret = process.env.JWT_SECRET || process.env.ZAPRITE_API_KEY;
  const payload = JSON.stringify(tokenData);
  const signature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  // Return base64-encoded token with signature
  const token = Buffer.from(JSON.stringify({
    data: tokenData,
    signature
  })).toString('base64');

  return token;
}

/**
 * Helper: Extract product from external_uniq_id
 * Format: bsa_{product}_{userId}_{timestamp}
 */
function extractProductFromId(externalUniqId) {
  const parts = externalUniqId.split('_');
  return parts[1]; // Should be 'curious_path', 'builder_path', etc.
}

/**
 * Helper: Extract userId from external_uniq_id
 */
function extractUserFromId(externalUniqId) {
  const parts = externalUniqId.split('_');
  return parts[2]; // Should be the userId
}
