/**
 * Zaprite Order Creation API
 * Creates a new payment order via Zaprite API.
 *
 * POST /api/create-order
 * Body: { product, userId, amount, currency, label }
 *
 * Hardening: origin-allow-list CORS via setCorsHeaders + payment-tier rate limit
 * (10/min/IP) per the project's shared rate-limiter presets.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCorsHeaders } from './lib/origin';
import { rateLimit, RATE_LIMITS } from './rate-limiter';

const orderRateLimit = rateLimit(RATE_LIMITS.payment);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(req, res, 'POST, OPTIONS', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!(await orderRateLimit(req, res))) return;

  try {
    const { product, userId, amount, currency, label } = (req.body || {}) as {
      product?: string;
      userId?: string;
      amount?: number;
      currency?: string;
      label?: string;
    };

    if (!product || !userId || !amount || !currency) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['product', 'userId', 'amount', 'currency'],
      });
    }

    const validProducts = ['curious_path', 'builder_path', 'sovereign_path', 'full_academy'];
    if (!validProducts.includes(product)) {
      return res.status(400).json({
        error: 'Invalid product',
        validProducts,
      });
    }

    const ZAPRITE_API_KEY = process.env.ZAPRITE_API_KEY;
    if (!ZAPRITE_API_KEY) {
      console.error('ZAPRITE_API_KEY not configured');
      return res.status(500).json({ error: 'Payment system not configured' });
    }

    const externalUniqId = `bsa_${product}_${userId}_${Date.now()}`;

    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.BASE_URL || 'https://bitcoinsovereign.academy';

    const successUrl = `${baseUrl}/payment/success?order={orderId}&product=${product}`;
    const cancelUrl = `${baseUrl}/pricing`;

    const zapriteResponse = await fetch('https://api.zaprite.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: ZAPRITE_API_KEY,
        'Content-Type': 'application/json',
        'User-Agent': 'BitcoinSovereignAcademy/1.0',
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // cents
        currency: currency.toUpperCase(),
        external_uniq_id: externalUniqId,
        redirect_url: successUrl,
        cancel_url: cancelUrl,
        label: label || `Bitcoin Sovereign Academy - ${product}`,
        metadata: {
          user_id: userId,
          product,
          source: 'web',
          timestamp: new Date().toISOString(),
        },
      }),
    });

    if (!zapriteResponse.ok) {
      const errorText = await zapriteResponse.text();
      console.error('Zaprite API error:', zapriteResponse.status, errorText);
      return res.status(500).json({
        error: 'Failed to create payment order',
        details: process.env.NODE_ENV === 'development' ? errorText : undefined,
      });
    }

    const zapriteData = (await zapriteResponse.json()) as {
      id?: string;
      checkout_url?: string;
      url?: string;
    };

    console.log('Order created:', {
      orderId: zapriteData.id,
      product,
      amount,
      currency,
      externalUniqId,
    });

    return res.status(200).json({
      success: true,
      orderId: zapriteData.id,
      checkoutUrl: zapriteData.checkout_url || zapriteData.url,
      externalUniqId,
      amount,
      currency,
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message:
        process.env.NODE_ENV === 'development'
          ? error?.message || 'unknown'
          : 'Payment processing failed',
    });
  }
}
