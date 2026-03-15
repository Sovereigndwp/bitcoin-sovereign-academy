import { VercelRequest, VercelResponse } from '@vercel/node';
import { setCorsHeaders } from '../lib/origin';
import {
  ALL_PREMIUM_PATH_IDS,
  buildPremiumRouteClaims,
  serializePremiumRouteCookie,
  signPremiumRouteToken
} from '../lib/premium-route-access';

const DEV_UNLOCK_MAX_AGE_SECONDS = 12 * 60 * 60;

function normalizeHost(value: string | undefined): string {
  if (!value) {
    return '';
  }

  return value
    .split(',')[0]
    .trim()
    .toLowerCase()
    .replace(/:\d+$/, '');
}

function isLocalDevelopmentHost(req: VercelRequest): boolean {
  const candidates = [
    normalizeHost(req.headers.host as string | undefined),
    normalizeHost(req.headers['x-forwarded-host'] as string | undefined)
  ];

  return candidates.some((host) =>
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '0.0.0.0' ||
    host === '[::1]' ||
    host.endsWith('.localhost')
  );
}

function getSafeNext(input: unknown): string | null {
  if (typeof input !== 'string') {
    return null;
  }

  return input.startsWith('/') && !input.startsWith('//') ? input : null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(req, res, 'GET, POST, OPTIONS', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isLocalDevelopmentHost(req)) {
    return res.status(404).json({ error: 'Not found' });
  }

  const claims = buildPremiumRouteClaims({
    userId: 'developer-localhost',
    tier: 'developer',
    allPremium: true,
    pathIds: [...ALL_PREMIUM_PATH_IDS],
    deepDives: true,
    source: 'developer-localhost'
  });
  const { token, maxAgeSeconds } = signPremiumRouteToken(claims, {
    maxAgeSeconds: DEV_UNLOCK_MAX_AGE_SECONDS
  });

  res.setHeader('Set-Cookie', serializePremiumRouteCookie(token, {
    isSecure: false,
    maxAgeSeconds
  }));

  const next = getSafeNext((req.query.next as string | undefined) || req.body?.next);
  if (next) {
    res.setHeader('Cache-Control', 'no-store');
    return res.redirect(302, next);
  }

  return res.status(200).json({
    unlocked: true,
    tier: claims.tier,
    expiresInSeconds: maxAgeSeconds,
    allPremium: claims.allPremium,
    deepDives: claims.deepDives,
    pathIds: claims.pathIds
  });
}
