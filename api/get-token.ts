/**
 * GET /api/get-token
 * Retrieve JWT token after successful payment using session ID
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { grantEntitlement, generateAccessToken } from './entitlements';
import { CartItem } from './types';

// Initialize Stripe
let stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripe) {
    const secret = process.env.STRIPE_SECRET;
    if (!secret) {
      throw new Error('STRIPE_SECRET environment variable not set');
    }
    stripe = new Stripe(secret, {
      apiVersion: '2025-02-24.acacia',
    });
  }
  return stripe;
}

/**
 * CORS headers
 */
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || 'https://bitcoinsovereign.academy',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { session_id, provider = 'stripe' } = req.query;

    if (!session_id || typeof session_id !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid session_id parameter' });
    }

    let email: string;
    let items: CartItem[];

    if (provider === 'stripe') {
      // Retrieve Stripe session
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(session_id);

      // Verify payment was successful
      if (session.payment_status !== 'paid') {
        return res.status(400).json({ error: 'Payment not completed' });
      }

      // Extract email and items from session
      email = session.customer_email || session.metadata?.email || '';
      if (!email) {
        return res.status(400).json({ error: 'No email found in session' });
      }

      const itemsData = session.metadata?.items;
      if (!itemsData) {
        return res.status(400).json({ error: 'No items found in session' });
      }

      items = JSON.parse(itemsData);
    } else if (provider === 'btcpay') {
      // TODO: Implement BTCPay session retrieval
      return res.status(400).json({ error: 'BTCPay provider not yet implemented for token retrieval' });
    } else {
      return res.status(400).json({ error: 'Invalid payment provider' });
    }

    // Grant entitlement and generate token
    const entitlement = grantEntitlement(email, items);
    const token = generateAccessToken(entitlement);

    // Return token and entitlement info
    return res.status(200).json({
      success: true,
      token,
      email,
      modules: entitlement.modules,
      paths: entitlement.paths,
      purchaseDate: entitlement.purchaseDate,
    });
  } catch (err: any) {
    console.error('Error retrieving token:', err);
    return res.status(500).json({
      error: 'Failed to retrieve access token',
      message: err.message
    });
  }
}
