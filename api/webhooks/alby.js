/**
 * Alby Hub Webhook Handler
 * Processes Lightning payment confirmations from Alby Hub
 * 
 * POST /api/webhooks/alby
 * Headers: X-Alby-Signature (HMAC-SHA256)
 */

import crypto from 'crypto';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const signature = req.headers['x-alby-signature'];
  const webhookSecret = process.env.ALBY_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('ALBY_WEBHOOK_SECRET not configured');
    return res.status(500).json({ error: 'Webhook not configured' });
  }

  try {
    // Verify webhook signature using constant-time comparison to prevent timing attacks
    const payload = JSON.stringify(req.body);
    const expectedSignature = `sha256=${crypto
      .createHmac('sha256', webhookSecret)
      .update(payload, 'utf8')
      .digest('hex')}`;

    if (!signature || signature.length !== expectedSignature.length ||
        !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      console.error('Invalid webhook signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const event = req.body;
    console.log('Alby webhook received:', event.type);

    // Handle different event types
    switch (event.type) {
      case 'invoice.settled':
        await handleInvoiceSettled(event.data);
        break;
      
      case 'invoice.expired':
        await handleInvoiceExpired(event.data);
        break;
        
      case 'payment.sent':
        // For future refund processing
        console.log('Payment sent event:', event.data);
        break;
        
      default:
        console.log('Unhandled event type:', event.type);
    }

    return res.status(200).json({ received: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}

/**
 * Handle invoice settlement (payment received)
 * Writes the confirmed payment to Supabase so verify-invoice.ts can read it.
 */
async function handleInvoiceSettled(invoiceData) {
  const paymentHash = invoiceData.payment_hash;
  const settledAt = invoiceData.settled_at || new Date().toISOString();
  const amount = invoiceData.amount;

  console.log('Invoice settled:', { paymentHash, amount, settledAt });

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('[Alby webhook] Supabase not configured — payment confirmed but not stored');
    return;
  }

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/lightning_payments`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        payment_hash: paymentHash,
        amount_sats: amount,
        settled: true,
        settled_at: settledAt
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('[Alby webhook] Failed to store payment in Supabase:', err);
    } else {
      console.log('[Alby webhook] Payment stored in Supabase:', paymentHash);
    }
  } catch (error) {
    console.error('[Alby webhook] Error storing payment:', error);
  }
}

/**
 * Handle invoice expiration
 */
async function handleInvoiceExpired(invoiceData) {
  console.log('Invoice expired:', {
    paymentHash: invoiceData.payment_hash,
    amount: invoiceData.amount,
    expiredAt: invoiceData.expires_at
  });
  
  // Cleanup or notification logic can go here
}

/**
 * Update user membership status (placeholder)
 */
async function updateUserMembership(paymentHash, tier) {
  // This would connect to your database to update membership
  console.log(`Updating membership for payment ${paymentHash} to ${tier}`);
}