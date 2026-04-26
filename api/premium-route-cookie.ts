import { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAccessToken } from './entitlements';
import { extractBearerToken } from './lib/jwt';
import {
  ALL_PREMIUM_PATH_IDS,
  buildPremiumRouteClaims,
  getPremiumRouteClaimsFromSessionToken,
  PREMIUM_ROUTE_TIERS,
  serializeClearedPremiumRouteCookie,
  serializePremiumRouteCookie,
  signPremiumRouteToken
} from './lib/premium-route-access';
import { setCorsHeaders } from './lib/origin';
import { checkRateLimit } from './rate-limiter';

const YEAR_IN_SECONDS = 365 * 24 * 60 * 60;

function getValidatedTierHint(rawTier: unknown): 'apprentice' | 'sovereign' | null {
  if (typeof rawTier !== 'string' || !PREMIUM_ROUTE_TIERS.includes(rawTier as any)) {
    return null;
  }

  if (rawTier === 'apprentice' || rawTier === 'sovereign') {
    return rawTier;
  }

  return null;
}

function getSessionCookie(req: VercelRequest): string | null {
  const cookieHeader = req.headers.cookie || '';
  const cookies = cookieHeader
    .split(';')
    .map((entry) => entry.trim())
    .filter(Boolean);

  for (const cookie of cookies) {
    const separatorIndex = cookie.indexOf('=');
    if (separatorIndex === -1) {
      continue;
    }

    const name = cookie.slice(0, separatorIndex).trim();
    const value = cookie.slice(separatorIndex + 1).trim();
    if (name === 'session') {
      return decodeURIComponent(value);
    }
  }

  return null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(req, res, 'POST, OPTIONS', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!(await checkRateLimit(req, res, 'api'))) return;

  const isProduction = process.env.NODE_ENV === 'production';

  try {
    const authorizationToken = extractBearerToken(req.headers.authorization as string | undefined);
    const tierHint = getValidatedTierHint(req.body?.tierHint);
    let claims = null;
    let maxAgeSeconds = YEAR_IN_SECONDS;

    if (authorizationToken) {
      const entitlement = verifyAccessToken(authorizationToken);
      const hasWildcardAccess = entitlement.modules.includes('*') || entitlement.paths.includes('*');
      const pathIds = hasWildcardAccess
        ? [...ALL_PREMIUM_PATH_IDS]
        : entitlement.paths.filter((pathId) => ALL_PREMIUM_PATH_IDS.includes(pathId));

      claims = buildPremiumRouteClaims({
        userId: entitlement.userId,
        tier: hasWildcardAccess ? (tierHint || 'apprentice') : 'path',
        allPremium: hasWildcardAccess,
        pathIds,
        deepDives: hasWildcardAccess,
        expiresAt: entitlement.expiresAt || null,
        source: 'legacy-entitlement-token'
      });

      if (!claims.allPremium && claims.pathIds.length === 0) {
        return res.status(403).json({ error: 'Token does not grant premium route access' });
      }

      const expiresAt = claims.expiresAt ? new Date(claims.expiresAt) : null;
      const signedToken = signPremiumRouteToken(claims, {
        expiresAt,
        maxAgeSeconds: expiresAt ? undefined : YEAR_IN_SECONDS
      });
      maxAgeSeconds = signedToken.maxAgeSeconds;

      res.setHeader('Set-Cookie', serializePremiumRouteCookie(signedToken.token, {
        isSecure: isProduction,
        maxAgeSeconds: signedToken.maxAgeSeconds
      }));

      return res.status(200).json({
        authorized: true,
        tier: claims.tier,
        allPremium: claims.allPremium,
        pathIds: claims.pathIds,
        deepDives: claims.deepDives
      });
    }

    const sessionToken = getSessionCookie(req);
    if (!sessionToken) {
      res.setHeader('Set-Cookie', serializeClearedPremiumRouteCookie({ isSecure: isProduction }));
      return res.status(401).json({ error: 'No token or session cookie provided' });
    }

    claims = await getPremiumRouteClaimsFromSessionToken(sessionToken);
    if (!claims) {
      res.setHeader('Set-Cookie', serializeClearedPremiumRouteCookie({ isSecure: isProduction }));
      return res.status(403).json({ error: 'Session does not grant premium route access' });
    }

    const expiresAt = claims.expiresAt ? new Date(claims.expiresAt) : null;
    const signedToken = signPremiumRouteToken(claims, { expiresAt });
    maxAgeSeconds = signedToken.maxAgeSeconds;

    res.setHeader('Set-Cookie', serializePremiumRouteCookie(signedToken.token, {
      isSecure: isProduction,
      maxAgeSeconds
    }));

    return res.status(200).json({
      authorized: true,
      tier: claims.tier,
      allPremium: claims.allPremium,
      pathIds: claims.pathIds,
      deepDives: claims.deepDives
    });
  } catch (error: any) {
    console.error('[premium-route-cookie] Failed to issue cookie:', error);
    return res.status(401).json({ error: 'Unable to issue premium route cookie' });
  }
}
