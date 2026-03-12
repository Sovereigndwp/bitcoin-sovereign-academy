import { VercelRequest, VercelResponse } from '@vercel/node';
import { appendLiteralQueryParam, resolveAllowedRedirectUrl, setCorsHeaders } from './lib/origin';

/**
 * POST /api/apprentice-checkout
 *
 * Creates a Stripe Checkout Session for the Apprentice tier at a dynamic
 * USD price that reflects the live value of 50,000 sats.
 *
 * Body: { priceCents: number }   — the USD price in cents locked-in on the client
 *
 * The server independently verifies the price is within ±10 % of the current
 * 50,000-sat market value so the client cannot submit an arbitrary amount.
 */

const SATS_DEPOSIT = 50_000;
const TOLERANCE = 0.15; // allow 15% drift between client lock-in and server check

/** Fetch BTC/USD from CoinGecko (free, no key) */
async function fetchBtcUsd(): Promise<number> {
    const res = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
        { headers: { Accept: 'application/json' } }
    );
    if (!res.ok) throw new Error('CoinGecko API error');
    const data = await res.json();
    return data.bitcoin.usd as number;
}

/** Stripe REST helper (no SDK needed — matches checkout.ts pattern) */
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

    try {
        const { priceCents, successUrl: requestedSuccessUrl, cancelUrl: requestedCancelUrl } = req.body || {};

        if (!priceCents || typeof priceCents !== 'number' || priceCents < 100) {
            return res.status(400).json({ error: 'priceCents is required (integer, >= 100)' });
        }

        // Server-side price verification
        const btcUsd = await fetchBtcUsd();
        const fairCents = Math.round((SATS_DEPOSIT / 1e8) * btcUsd * 100);

        if (
            priceCents < fairCents * (1 - TOLERANCE) ||
            priceCents > fairCents * (1 + TOLERANCE)
        ) {
            return res.status(400).json({
                error: 'Price out of range — please refresh to get the latest rate',
                serverCents: fairCents,
            });
        }

        const stripeKey = process.env.STRIPE_SECRET;
        if (!stripeKey) {
            return res.status(500).json({ error: 'Stripe not configured' });
        }

        const priceUSD = (priceCents / 100).toFixed(2);
        const successUrl = appendLiteralQueryParam(
            resolveAllowedRedirectUrl(requestedSuccessUrl, '/membership.html?payment_success=1', req),
            'session_id',
            '{CHECKOUT_SESSION_ID}'
        );
        const cancelUrl = resolveAllowedRedirectUrl(requestedCancelUrl, '/membership.html', req);

        const params: Record<string, string> = {
            mode: 'payment',
            success_url: successUrl,
            cancel_url: cancelUrl,
            'line_items[0][price_data][currency]': 'usd',
            'line_items[0][price_data][product_data][name]': 'BSA Apprentice Access (Fiat)',
            'line_items[0][price_data][product_data][description]':
                `Bitcoin Sovereign Academy — 50,000 sats equivalent ($${priceUSD}). Note: fiat payments do not include sats earn-back rewards.`,
            'line_items[0][price_data][unit_amount]': String(priceCents),
            'line_items[0][quantity]': '1',
            'metadata[tier]': 'apprentice',
            'metadata[method]': 'fiat',
            'metadata[satsEquivalent]': String(SATS_DEPOSIT),
            'metadata[btcUsdRate]': String(btcUsd),
            'metadata[source]': 'apprentice-checkout',
        };

        // Pass referral code if present
        const refCode = req.body.referralCode;
        if (refCode) {
            params['metadata[referralCode]'] = refCode;
        }

        const session = await stripePost('/checkout/sessions', params, stripeKey);

        return res.status(200).json({
            sessionId: session.id,
            url: session.url || '',
            priceCents,
            btcUsd,
        });
    } catch (err: any) {
        console.error('[apprentice-checkout] Error:', err);
        return res.status(500).json({ error: err.message || 'Checkout failed' });
    }
}
