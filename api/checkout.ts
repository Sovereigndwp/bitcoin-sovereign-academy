import { VercelRequest, VercelResponse } from '@vercel/node';
import { appendLiteralQueryParam, resolveAllowedRedirectUrl, setCorsHeaders } from './lib/origin';
import { checkRateLimit } from './rate-limiter';

// Inline pricing catalog (avoids cross-file import issues on Vercel)
const PATHS: Record<string, { name: string; priceUSD: number }> = {
  curious:    { name: 'Curious Path',    priceUSD: 19 },
  builder:    { name: 'Builder Path',    priceUSD: 39 },
  sovereign:  { name: 'Sovereign Path',  priceUSD: 79 },
  principled: { name: 'Principled Path', priceUSD: 29 },
};
const ALL_ACCESS_PRICE = 149;

/**
 * Call Stripe REST API directly — no SDK needed.
 */
async function stripePost(endpoint: string, body: Record<string, string>, apiKey: string) {
  const resp = await fetch(`https://api.stripe.com/v1${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(body).toString(),
  });
  const data = await resp.json();
  if (!resp.ok) {
    throw new Error(data?.error?.message || `Stripe ${endpoint} failed (${resp.status})`);
  }
  return data;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(req, res);

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!(await checkRateLimit(req, res, 'payment'))) return;

  try {
    const { items, provider, email, successUrl, cancelUrl } = req.body || {};

    if (!items || !provider || !email) {
      return res.status(400).json({
        error: 'Missing required fields: items, provider, email'
      });
    }

    if (provider !== 'stripe') {
      return res.status(400).json({ error: 'Only stripe provider is currently supported' });
    }

    const stripeKey = process.env.STRIPE_SECRET;
    if (!stripeKey) {
      return res.status(500).json({ error: 'Stripe not configured' });
    }

    // Validate & price each item
    const lineItems: Array<{ name: string; amountCents: number; type: string; id: string }> = [];
    for (const item of items) {
      if (item.type === 'path') {
        const p = PATHS[item.id];
        if (!p) return res.status(400).json({ error: `Unknown path: ${item.id}` });
        lineItems.push({ name: p.name, amountCents: p.priceUSD * 100, type: item.type, id: item.id });
      } else if (item.type === 'bundle' && item.id === 'all-paths') {
        lineItems.push({ name: 'Complete Academy Bundle', amountCents: ALL_ACCESS_PRICE * 100, type: item.type, id: item.id });
      } else {
        return res.status(400).json({ error: `Unsupported item: ${item.type}/${item.id}` });
      }
    }

    // Build Stripe Checkout Session params (form-encoded)
    const successUrlWithSession = appendLiteralQueryParam(
      resolveAllowedRedirectUrl(successUrl, '/checkout.html?success=true', req),
      'session_id',
      '{CHECKOUT_SESSION_ID}'
    );
    const cancelRedirectUrl = resolveAllowedRedirectUrl(cancelUrl, '/checkout.html?canceled=true', req);

    const params: Record<string, string> = {
      'mode': 'payment',
      'success_url': successUrlWithSession,
      'cancel_url': cancelRedirectUrl,
      'customer_email': email,
      'allow_promotion_codes': 'true',
      'metadata[email]': email,
      'metadata[items]': JSON.stringify(items.map((i: any) => ({ type: i.type, id: i.id }))),
    };

    lineItems.forEach((li, idx) => {
      params[`line_items[${idx}][price_data][currency]`] = 'usd';
      params[`line_items[${idx}][price_data][product_data][name]`] = li.name;
      params[`line_items[${idx}][price_data][product_data][description]`] = `Bitcoin Sovereign Academy - ${li.type}`;
      params[`line_items[${idx}][price_data][unit_amount]`] = String(li.amountCents);
      params[`line_items[${idx}][quantity]`] = '1';
    });

    const session = await stripePost('/checkout/sessions', params, stripeKey);

    return res.status(200).json({
      provider: 'stripe',
      sessionId: session.id,
      url: session.url || '',
    });

  } catch (err: any) {
    console.error('Checkout error:', err);
    return res.status(500).json({ error: err.message || 'Checkout failed' });
  }
}
