import { VercelRequest, VercelResponse } from '@vercel/node';
import { generateAccessToken } from './entitlements';
import { setCorsHeaders } from './lib/origin';
import { checkRateLimit } from './rate-limiter';
import {
  ALL_PREMIUM_PATH_IDS,
  buildPremiumRouteClaims,
  serializePremiumRouteCookie,
  signPremiumRouteToken
} from './lib/premium-route-access';

const PREMIUM_ROUTE_COOKIE_MAX_AGE_SECONDS = 365 * 24 * 60 * 60;
const SETTLED_STATUS = 'Settled';
const INVOICE_ID_PATTERN = /^[A-Za-z0-9_-]{8,128}$/;

function getBTCPayConfig() {
  const url = process.env.BTCPAY_URL;
  const apiKey = process.env.BTCPAY_API_KEY;
  const storeId = process.env.BTCPAY_STORE_ID;

  if (!url || !apiKey || !storeId) {
    throw new Error('BTCPay Server configuration incomplete. Check BTCPAY_URL, BTCPAY_API_KEY, and BTCPAY_STORE_ID.');
  }

  return { url: url.replace(/\/$/, ''), apiKey, storeId };
}

function inferTier(invoice: any, expectedTier?: string): 'apprentice' | 'sovereign' | null {
  const metadataTier = invoice?.metadata?.tier;
  if (metadataTier === 'apprentice' || metadataTier === 'sovereign') return metadataTier;

  const currency = String(invoice?.currency || '').toLowerCase();
  const amount = Number(invoice?.amount);
  if (currency === 'usd' && amount === 37) return 'apprentice';
  if (currency === 'usd' && amount === 399) return 'sovereign';

  if (expectedTier === 'apprentice' || expectedTier === 'sovereign') return expectedTier;
  return null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(req, res, 'POST, OPTIONS', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!(await checkRateLimit(req, res, 'payment'))) return;

  try {
    const { invoiceId, expectedTier } = req.body || {};

    if (!invoiceId || typeof invoiceId !== 'string' || !INVOICE_ID_PATTERN.test(invoiceId)) {
      return res.status(400).json({ error: 'Invalid BTCPay invoice ID' });
    }

    if (expectedTier && expectedTier !== 'apprentice' && expectedTier !== 'sovereign') {
      return res.status(400).json({ error: 'Invalid expected tier' });
    }

    const config = getBTCPayConfig();
    const response = await fetch(`${config.url}/api/v1/stores/${config.storeId}/invoices/${invoiceId}`, {
      headers: {
        Authorization: `token ${config.apiKey}`
      }
    });

    const invoice = await response.json().catch(() => ({}));
    if (!response.ok) {
      return res.status(400).json({ error: 'Unknown BTCPay invoice' });
    }

    if (invoice.status !== SETTLED_STATUS) {
      return res.status(400).json({ error: `Invoice not settled yet. Current status: ${invoice.status}` });
    }

    const tier = inferTier(invoice, expectedTier);
    if (!tier) {
      return res.status(400).json({ error: 'Unable to verify membership tier for this invoice' });
    }

    if (expectedTier && tier !== expectedTier) {
      return res.status(400).json({ error: 'BTCPay invoice tier does not match the pending checkout' });
    }

    const email = invoice?.metadata?.buyerEmail || invoice?.metadata?.buyerEmailAddress || '';
    if (!email) {
      return res.status(400).json({ error: 'No customer email found for this invoice' });
    }

    const purchaseDate = new Date().toISOString();
    const accessToken = generateAccessToken({
      userId: String(invoiceId),
      email,
      modules: ['*'],
      paths: ['*'],
      purchaseDate
    });

    const premiumRouteClaims = buildPremiumRouteClaims({
      userId: String(invoiceId),
      tier,
      allPremium: true,
      pathIds: [...ALL_PREMIUM_PATH_IDS],
      deepDives: true,
      expiresAt: new Date(Date.now() + PREMIUM_ROUTE_COOKIE_MAX_AGE_SECONDS * 1000),
      source: 'btcpay-membership'
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
      accessToken,
      membership: {
        tier,
        method: 'btcpay',
        verified: true,
        referenceId: invoiceId,
        activated: purchaseDate
      }
    });
  } catch (err: any) {
    console.error('[verify-btcpay-invoice] Error:', err);
    return res.status(500).json({ error: err.message || 'Failed to verify BTCPay invoice' });
  }
}
