import { VercelRequest, VercelResponse } from '@vercel/node';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Error', message: 'Method not allowed' });
  }

  try {
    const { items, provider, email, successUrl, cancelUrl } = req.body || {};

    if (!items || !provider || !email || !successUrl || !cancelUrl) {
      return res.status(400).json({
        error: 'Error',
        message: 'Missing required fields: items, provider, email, successUrl, cancelUrl'
      });
    }

    const request = { items, provider, email, successUrl, cancelUrl };

    let response;
    if (provider === 'stripe') {
      // Dynamic import to avoid bundling issues
      const { createStripeCheckout } = await import('./stripe');
      response = await createStripeCheckout(request);
    } else if (provider === 'btcpay') {
      const { createBTCPayInvoice } = await import('./btcpay');
      response = await createBTCPayInvoice(request);
    } else {
      return res.status(400).json({ error: 'Error', message: 'Invalid payment provider' });
    }

    return res.status(200).json(response);
  } catch (err: any) {
    console.error('Checkout error:', err);
    return res.status(400).json({ error: 'Error', message: err.message || 'Checkout failed' });
  }
}
