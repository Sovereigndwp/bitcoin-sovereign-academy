import { VercelRequest, VercelResponse } from '@vercel/node';
import { appendLiteralQueryParam, resolveAllowedRedirectUrl, setCorsHeaders } from './lib/origin';
import { checkRateLimit } from './rate-limiter';

const SOVEREIGN_PRICE_CENTS = 39_900;

async function stripePost(endpoint: string, body: Record<string, string>, apiKey: string) {
  const resp = await fetch(`https://api.stripe.com/v1${endpoint}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
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
  setCorsHeaders(req, res, 'POST, OPTIONS', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST required' });

  if (!(await checkRateLimit(req, res, 'payment'))) return;

  try {
    const { successUrl: requestedSuccessUrl, cancelUrl: requestedCancelUrl } = req.body || {};

    const stripeKey = process.env.STRIPE_SECRET;
    if (!stripeKey) {
      return res.status(500).json({ error: 'Stripe not configured' });
    }

    const successUrl = appendLiteralQueryParam(
      resolveAllowedRedirectUrl(requestedSuccessUrl, '/membership-success.html', req),
      'session_id',
      '{CHECKOUT_SESSION_ID}'
    );
    const cancelUrl = resolveAllowedRedirectUrl(requestedCancelUrl, '/membership.html', req);

    const params: Record<string, string> = {
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      'line_items[0][price_data][currency]': 'usd',
      'line_items[0][price_data][product_data][name]': 'BSA Sovereign Lifetime Access',
      'line_items[0][price_data][product_data][description]':
        'Bitcoin Sovereign Academy — lifetime access to all premium content and future updates.',
      'line_items[0][price_data][unit_amount]': String(SOVEREIGN_PRICE_CENTS),
      'line_items[0][quantity]': '1',
      'metadata[tier]': 'sovereign',
      'metadata[membership]': 'true',
      'metadata[source]': 'sovereign-checkout',
      allow_promotion_codes: 'true',
    };

    const session = await stripePost('/checkout/sessions', params, stripeKey);

    return res.status(200).json({
      sessionId: session.id,
      url: session.url || '',
      priceCents: SOVEREIGN_PRICE_CENTS,
    });
  } catch (err: any) {
    console.error('[sovereign-checkout] Error:', err);
    return res.status(500).json({ error: err.message || 'Checkout failed' });
  }
}
