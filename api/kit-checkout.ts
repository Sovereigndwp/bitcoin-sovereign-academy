import { VercelRequest, VercelResponse } from '@vercel/node';
import { appendLiteralQueryParam, resolveAllowedRedirectUrl, setCorsHeaders } from './lib/origin';
import { checkRateLimit } from './rate-limiter';

/**
 * Fiat (card) checkout for the standalone PDF kits.
 *
 * Server-side source of truth for kit prices — never trust the client amount.
 * Creates a Stripe Checkout Session with dynamic price_data (no pre-created
 * Stripe products needed). Stripe collects the buyer's email. Fulfillment is
 * manual (PDF emailed after payment), matching the Lightning flow.
 */
const KITS: Record<string, { name: string; priceUSD: number }> = {
  'self-custody-starter-kit':   { name: 'Bitcoin Self-Custody Starter Kit', priceUSD: 49 },
  'family-bitcoin-recovery-kit':{ name: 'Family Bitcoin Recovery Kit',       priceUSD: 149 },
  'advisor-bitcoin-client-kit': { name: 'Bitcoin Continuity Operational Packet', priceUSD: 499 },
};

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
    const { kit, successUrl, cancelUrl } = req.body || {};
    const product = kit && KITS[kit];
    if (!product) return res.status(400).json({ error: 'Unknown kit' });

    const stripeKey = process.env.STRIPE_SECRET;
    if (!stripeKey) return res.status(500).json({ error: 'Stripe not configured' });

    const defaultReturn = `/products/${kit}/`;
    const successResolved = appendLiteralQueryParam(
      resolveAllowedRedirectUrl(successUrl, `${defaultReturn}?paid=1`, req),
      'session_id',
      '{CHECKOUT_SESSION_ID}'
    );
    const cancelResolved = resolveAllowedRedirectUrl(cancelUrl, defaultReturn, req);

    const params: Record<string, string> = {
      'mode': 'payment',
      'success_url': successResolved,
      'cancel_url': cancelResolved,
      'allow_promotion_codes': 'true',
      'metadata[kit]': kit,
      'line_items[0][price_data][currency]': 'usd',
      'line_items[0][price_data][product_data][name]': product.name,
      'line_items[0][price_data][product_data][description]': 'Bitcoin Sovereign Academy — digital kit (PDF, emailed after payment)',
      'line_items[0][price_data][unit_amount]': String(product.priceUSD * 100),
      'line_items[0][quantity]': '1',
    };

    const session = await stripePost('/checkout/sessions', params, stripeKey);
    return res.status(200).json({ url: session.url || '' });
  } catch (err: any) {
    console.error('Kit checkout error:', err);
    return res.status(500).json({ error: err.message || 'Checkout failed' });
  }
}
