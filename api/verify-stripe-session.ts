import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { generateAccessToken } from './entitlements';
import { isAllowedOrigin, setCorsHeaders } from './lib/origin';
import {
    ALL_PREMIUM_PATH_IDS,
    buildPremiumRouteClaims,
    serializePremiumRouteCookie,
    signPremiumRouteToken
} from './lib/premium-route-access';

const EXPECTED_TIERS = new Set(['apprentice', 'sovereign']);
const SESSION_ID_PATTERN = /^cs_(test|live)_[A-Za-z0-9_]+$/;
const SOVEREIGN_PRICE_CENTS = 39_900;
const PREMIUM_ROUTE_COOKIE_MAX_AGE_SECONDS = 365 * 24 * 60 * 60;

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

function inferTier(session: Stripe.Checkout.Session, expectedTier?: string): 'apprentice' | 'sovereign' | null {
  const metadataTier = session.metadata?.tier;
  if (metadataTier === 'apprentice' || metadataTier === 'sovereign') {
    return metadataTier;
  }

  if (
    expectedTier === 'sovereign' &&
    session.amount_total === SOVEREIGN_PRICE_CENTS &&
    session.currency?.toLowerCase() === 'usd'
  ) {
    return 'sovereign';
  }

  return null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(req, res, 'POST, OPTIONS', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionId, expectedTier } = req.body || {};

    if (!sessionId || typeof sessionId !== 'string' || !SESSION_ID_PATTERN.test(sessionId)) {
      return res.status(400).json({ error: 'Invalid Stripe session ID' });
    }

    if (expectedTier && (!EXPECTED_TIERS.has(expectedTier) || typeof expectedTier !== 'string')) {
      return res.status(400).json({ error: 'Invalid expected tier' });
    }

    const session = await getStripe().checkout.sessions.retrieve(sessionId);

    if (session.mode !== 'payment') {
      return res.status(400).json({ error: 'Unsupported checkout session type' });
    }

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Payment has not completed yet' });
    }

    if (session.success_url) {
      const successOrigin = new URL(session.success_url).origin;
      if (!isAllowedOrigin(successOrigin)) {
        return res.status(400).json({ error: 'Session success URL is not allowed' });
      }
    }

    if (session.cancel_url) {
      const cancelOrigin = new URL(session.cancel_url).origin;
      if (!isAllowedOrigin(cancelOrigin)) {
        return res.status(400).json({ error: 'Session cancel URL is not allowed' });
      }
    }

    const tier = inferTier(session, expectedTier);
    if (!tier) {
      return res.status(400).json({ error: 'Unable to verify membership tier for this session' });
    }

    if (expectedTier && tier !== expectedTier) {
      return res.status(400).json({ error: 'Stripe session tier does not match the pending checkout' });
    }

    const email = session.customer_details?.email || session.customer_email || '';
    if (!email) {
      return res.status(400).json({ error: 'No customer email found for this session' });
    }

    const purchaseDate = new Date((session.created || Math.floor(Date.now() / 1000)) * 1000).toISOString();
    const accessToken = generateAccessToken({
      userId: String(session.customer || session.id),
      email,
      modules: ['*'],
      paths: ['*'],
      purchaseDate,
    });
    const premiumRouteClaims = buildPremiumRouteClaims({
      userId: String(session.customer || session.id),
      allPremium: true,
      pathIds: [...ALL_PREMIUM_PATH_IDS],
      deepDives: true,
      expiresAt: new Date(Date.now() + PREMIUM_ROUTE_COOKIE_MAX_AGE_SECONDS * 1000),
      source: 'stripe-membership'
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
        method: 'stripe',
        verified: true,
        referenceId: session.id,
        activated: purchaseDate,
      },
    });
  } catch (err: any) {
    console.error('[verify-stripe-session] Error:', err);

    const status = err?.type === 'StripeInvalidRequestError' ? 400 : 500;
    return res.status(status).json({
      error: status === 400 ? 'Unknown Stripe session' : 'Failed to verify Stripe session'
    });
  }
}
