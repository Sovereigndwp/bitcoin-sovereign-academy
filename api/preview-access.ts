import { VercelRequest, VercelResponse } from '@vercel/node';
import { timingSafeEqual } from 'node:crypto';
import { setCorsHeaders } from './lib/origin';
import {
  ALL_PREMIUM_PATH_IDS,
  buildPremiumRouteClaims,
  serializePremiumRouteCookie,
  signPremiumRouteToken
} from './lib/premium-route-access';

const DEFAULT_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

function getMaxAgeSeconds(): number {
  const days = Number(process.env.PREVIEW_ACCESS_MAX_AGE_DAYS);
  return Number.isFinite(days) && days > 0 ? Math.floor(days * 24 * 60 * 60) : DEFAULT_MAX_AGE_SECONDS;
}

function keysMatch(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function getSafeNext(input: unknown): string {
  if (typeof input === 'string' && input.startsWith('/') && !input.startsWith('//')) return input;
  return '/';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(req, res, 'GET, POST, OPTIONS', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const expected = process.env.PREVIEW_ACCESS_KEY;
  const provided = (req.query.key as string | undefined) || (req.body?.key as string | undefined);
  if (!expected || !provided || !keysMatch(provided, expected)) {
    return res.status(403).json({ error: 'Invalid preview key' });
  }

  const maxAgeSeconds = getMaxAgeSeconds();
  const claims = buildPremiumRouteClaims({
    userId: 'preview-buyer',
    tier: 'developer',
    allPremium: true,
    pathIds: [...ALL_PREMIUM_PATH_IDS],
    deepDives: true,
    source: 'preview-key'
  });
  const { token, maxAgeSeconds: cookieMaxAge } = signPremiumRouteToken(claims, { maxAgeSeconds });
  const serverCookie = serializePremiumRouteCookie(token, { isSecure: true, maxAgeSeconds: cookieMaxAge });
  const markerCookie = `bsa_preview=1; Path=/; Max-Age=${cookieMaxAge}; SameSite=Lax; Secure`;

  res.setHeader('Set-Cookie', [serverCookie, markerCookie]);
  res.setHeader('Cache-Control', 'no-store');

  const next = getSafeNext((req.query.next as string | undefined) || req.body?.next);
  return res.redirect(302, next);
}
