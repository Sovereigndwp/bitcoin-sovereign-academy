import { VercelRequest, VercelResponse } from '@vercel/node';
import { generateAccessToken } from '../entitlements';
import { setCorsHeaders } from '../lib/origin';
import {
  ALL_PREMIUM_PATH_IDS,
  buildPremiumRouteClaims,
  serializePremiumRouteCookie,
  signPremiumRouteToken
} from '../lib/premium-route-access';

const APPRENTICE_DEPOSIT_SATS = 50_000;
const PREMIUM_ROUTE_COOKIE_MAX_AGE_SECONDS = 365 * 24 * 60 * 60;
const PAYMENT_HASH_PATTERN = /^[a-f0-9]{32,128}$/i;

interface AlbyInvoiceResponse {
  amount?: number | string;
  amt?: number | string;
  payment_hash?: string;
  paymentHash?: string;
  settled?: boolean;
  state?: string;
  status?: string;
  settled_at?: string;
  settledAt?: string;
}

function normalizeAmount(invoice: AlbyInvoiceResponse): number | null {
  const value = invoice.amount ?? invoice.amt;
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : null;
}

function isInvoiceSettled(invoice: AlbyInvoiceResponse): boolean {
  return invoice.settled === true ||
    invoice.state === 'SETTLED' ||
    invoice.status === 'settled' ||
    invoice.status === 'SETTLED';
}

function getPaymentHash(invoice: AlbyInvoiceResponse, requestedPaymentHash: string): string {
  return String(invoice.payment_hash || invoice.paymentHash || requestedPaymentHash);
}

function buildLightningAccessToken(paymentHash: string, activatedAt: string): string {
  return generateAccessToken({
    userId: paymentHash,
    email: `lightning-${paymentHash}@access.bitcoinsovereign.academy`,
    modules: ['*'],
    paths: ['*'],
    purchaseDate: activatedAt
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(req, res, 'POST, OPTIONS', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const paymentHash = String(req.body?.paymentHash || '').trim();
  if (!PAYMENT_HASH_PATTERN.test(paymentHash)) {
    return res.status(400).json({ error: 'Valid payment hash is required' });
  }

  // Verification reads from Supabase — written there by the Alby webhook handler
  // when a payment is confirmed. This avoids needing a direct connection to the
  // local Alby Hub, which is unreachable from Vercel's servers.
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Lightning payment verification is not configured' });
  }

  try {
    const dbResponse = await fetch(
      `${supabaseUrl}/rest/v1/lightning_payments?payment_hash=eq.${encodeURIComponent(paymentHash)}&select=*&limit=1`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!dbResponse.ok) {
      const errorText = await dbResponse.text();
      console.error('[lightning verify] Supabase lookup failed:', dbResponse.status, errorText);
      return res.status(502).json({ verified: false, settled: false, error: 'Failed to verify Lightning invoice' });
    }

    const rows = await dbResponse.json() as any[];

    if (!rows || rows.length === 0) {
      return res.status(200).json({ verified: false, settled: false, state: 'pending' });
    }

    const invoice: AlbyInvoiceResponse = {
      payment_hash: rows[0].payment_hash,
      amount: rows[0].amount_sats,
      settled: rows[0].settled,
      settled_at: rows[0].settled_at
    };

    const amount = normalizeAmount(invoice);
    if (amount !== APPRENTICE_DEPOSIT_SATS) {
      return res.status(400).json({
        verified: false,
        settled: false,
        error: 'Invoice amount does not match the Apprentice deposit'
      });
    }

    if (!isInvoiceSettled(invoice)) {
      return res.status(200).json({
        verified: false,
        settled: false,
        state: invoice.state || invoice.status || null
      });
    }

    const activatedAt = invoice.settled_at || invoice.settledAt || new Date().toISOString();
    const resolvedPaymentHash = getPaymentHash(invoice, paymentHash);
    const accessToken = buildLightningAccessToken(resolvedPaymentHash, activatedAt);
    const premiumRouteClaims = buildPremiumRouteClaims({
      userId: resolvedPaymentHash,
      tier: 'apprentice',
      allPremium: true,
      pathIds: [...ALL_PREMIUM_PATH_IDS],
      deepDives: true,
      expiresAt: new Date(Date.now() + PREMIUM_ROUTE_COOKIE_MAX_AGE_SECONDS * 1000),
      source: 'lightning-invoice'
    });
    const { token: premiumRouteToken, maxAgeSeconds } = signPremiumRouteToken(premiumRouteClaims, {
      maxAgeSeconds: PREMIUM_ROUTE_COOKIE_MAX_AGE_SECONDS
    });

    res.setHeader('Set-Cookie', serializePremiumRouteCookie(premiumRouteToken, {
      isSecure: process.env.NODE_ENV === 'production',
      maxAgeSeconds
    }));

    return res.status(200).json({
      verified: true,
      settled: true,
      accessToken,
      membership: {
        tier: 'apprentice',
        activated: activatedAt,
        referenceId: resolvedPaymentHash
      }
    });
  } catch (error: any) {
    console.error('[lightning verify] Verification failed:', error);
    return res.status(500).json({
      verified: false,
      settled: false,
      error: 'Lightning invoice verification failed'
    });
  }
}
