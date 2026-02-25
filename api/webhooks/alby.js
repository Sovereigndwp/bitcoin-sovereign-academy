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
    // Verify webhook signature
    const payload = JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(payload, 'utf8')
      .digest('hex');

    if (signature !== `sha256=${expectedSignature}`) {
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
 */
async function handleInvoiceSettled(invoiceData) {
  try {
    console.log('Invoice settled:', {
      paymentHash: invoiceData.payment_hash,
      amount: invoiceData.amount,
      settledAt: invoiceData.settled_at
    });

    // You can add database updates here to track payments
    // For now, we rely on frontend polling for simplicity
    
    // Example: Update user's membership status in database
    // await updateUserMembership(invoiceData.payment_hash, 'apprentice');
    
    // Example: Send confirmation email
    // await sendPaymentConfirmationEmail(invoiceData);
    
  } catch (error) {
    console.error('Error processing invoice settlement:', error);
    throw error;
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