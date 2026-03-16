import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';
import { getPremiumPathIds, getProtectedRouteDetails } from '../packages/shared-access/src/premium-routes.js';

export const PREMIUM_ROUTE_COOKIE_NAME = 'bsa_premium_route';
export const SESSION_COOKIE_NAME = 'session';
export const PREMIUM_ROUTE_TIERS = Object.freeze([
  'explorer',
  'path',
  'apprentice',
  'sovereign',
  'developer'
]);

const PREMIUM_ROUTE_TOKEN_KIND = 'premium-route-access';
const DEFAULT_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
export const ALL_PREMIUM_PATH_IDS = Object.freeze(getPremiumPathIds());

let pool = null;

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable not set');
  }
  return secret;
}

function getPool() {
  if (pool) {
    return pool;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return null;
  }

  pool = new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
    max: 5,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 5_000
  });

  pool.on('error', (error) => {
    console.error('[premium-route-access] Database pool error:', error);
  });

  return pool;
}

function toDate(value) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function sanitizePathIds(pathIds = []) {
  return [...new Set(pathIds.filter((pathId) => ALL_PREMIUM_PATH_IDS.includes(pathId)))];
}

function isPremiumRouteTier(tier) {
  return PREMIUM_ROUTE_TIERS.includes(tier);
}

function inferPremiumRouteTier({ tier = null, allPremium = false, pathIds = [] } = {}) {
  if (isPremiumRouteTier(tier)) {
    return tier;
  }

  if (allPremium) {
    return 'apprentice';
  }

  if (pathIds.length > 0) {
    return 'path';
  }

  return 'explorer';
}

export function getPremiumRouteTierAccess(tier, pathIds = []) {
  switch (tier) {
    case 'developer':
    case 'apprentice':
    case 'sovereign':
      return {
        allPremium: true,
        deepDives: true,
        pathIds: [...ALL_PREMIUM_PATH_IDS]
      };
    case 'path':
      return {
        allPremium: false,
        deepDives: false,
        pathIds: sanitizePathIds(pathIds)
      };
    case 'explorer':
    default:
      return {
        allPremium: false,
        deepDives: false,
        pathIds: []
      };
  }
}

function getCookieMaxAgeSeconds(expiresAt, fallbackSeconds = DEFAULT_COOKIE_MAX_AGE_SECONDS) {
  const expiration = toDate(expiresAt);
  if (!expiration) {
    return fallbackSeconds;
  }

  return Math.max(60, Math.floor((expiration.getTime() - Date.now()) / 1000));
}

export function parseCookies(cookieHeader = '') {
  return cookieHeader
    .split(';')
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .reduce((cookies, entry) => {
      const separatorIndex = entry.indexOf('=');
      if (separatorIndex === -1) {
        return cookies;
      }

      const name = entry.slice(0, separatorIndex).trim();
      const value = entry.slice(separatorIndex + 1).trim();
      cookies[name] = decodeURIComponent(value);
      return cookies;
    }, {});
}

function hashSessionToken(token) {
  return crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
}

export function buildPremiumRouteClaims({
  userId = null,
  tier = null,
  allPremium = false,
  pathIds = [],
  deepDives = false,
  expiresAt = null,
  source = 'unknown'
} = {}) {
  const sanitizedPathIds = sanitizePathIds(pathIds);
  const inferredTier = inferPremiumRouteTier({
    tier,
    allPremium: Boolean(allPremium),
    pathIds: sanitizedPathIds
  });
  const tierAccess = getPremiumRouteTierAccess(inferredTier, sanitizedPathIds);
  const allowAllPremium = Boolean(allPremium) || tierAccess.allPremium;

  return {
    kind: PREMIUM_ROUTE_TOKEN_KIND,
    tier: inferredTier,
    userId,
    allPremium: allowAllPremium,
    pathIds: allowAllPremium
      ? [...ALL_PREMIUM_PATH_IDS]
      : (sanitizedPathIds.length > 0 ? sanitizedPathIds : tierAccess.pathIds),
    deepDives: allowAllPremium || Boolean(deepDives) || tierAccess.deepDives,
    expiresAt: toDate(expiresAt)?.toISOString() || null,
    source
  };
}

export function signPremiumRouteToken(claims, options = {}) {
  const normalizedClaims = buildPremiumRouteClaims(claims);
  const expiresAt = toDate(options.expiresAt || normalizedClaims.expiresAt);
  const maxAgeSeconds = options.maxAgeSeconds || getCookieMaxAgeSeconds(expiresAt);

  const token = jwt.sign(normalizedClaims, getJwtSecret(), {
    algorithm: 'HS256',
    expiresIn: maxAgeSeconds
  });

  return { token, maxAgeSeconds };
}

export function verifyPremiumRouteToken(token) {
  const payload = jwt.verify(token, getJwtSecret(), {
    algorithms: ['HS256']
  });

  if (!payload || payload.kind !== PREMIUM_ROUTE_TOKEN_KIND) {
    throw new Error('Invalid premium route token');
  }

  return buildPremiumRouteClaims({
    tier: payload.tier || null,
    userId: payload.userId || null,
    allPremium: payload.allPremium,
    pathIds: payload.pathIds || [],
    deepDives: payload.deepDives,
    expiresAt: payload.expiresAt || (payload.exp ? new Date(payload.exp * 1000) : null),
    source: payload.source || 'cookie'
  });
}

export function serializePremiumRouteCookie(token, { isSecure = false, maxAgeSeconds = DEFAULT_COOKIE_MAX_AGE_SECONDS } = {}) {
  const parts = [
    `${PREMIUM_ROUTE_COOKIE_NAME}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${Math.max(0, Math.floor(maxAgeSeconds))}`
  ];

  if (isSecure) {
    parts.splice(3, 0, 'Secure');
  }

  return parts.join('; ');
}

export function serializeClearedPremiumRouteCookie({ isSecure = false } = {}) {
  return serializePremiumRouteCookie('', {
    isSecure,
    maxAgeSeconds: 0
  });
}

function deriveClaimsFromSessionRows(rows) {
  if (!rows.length) {
    return null;
  }

  const userId = rows[0].user_id;
  const sessionExpiresAt = toDate(rows[0].session_expires_at);
  const pathIds = new Set();
  let tier = 'explorer';

  for (const row of rows) {
    const entitlementType = row.entitlement_type;
    const itemId = row.item_id;

    if (!entitlementType) {
      continue;
    }

    if (entitlementType === 'all_access_annual') {
      tier = 'sovereign';
      continue;
    }

    if (entitlementType === 'all_access_monthly') {
      if (tier !== 'sovereign') {
        tier = 'apprentice';
      }
      continue;
    }

    if (entitlementType.startsWith('path_') && itemId && ALL_PREMIUM_PATH_IDS.includes(itemId)) {
      pathIds.add(itemId);
      if (tier === 'explorer') {
        tier = 'path';
      }
    }
  }

  if (tier === 'explorer' && pathIds.size === 0) {
    return null;
  }

  return buildPremiumRouteClaims({
    userId,
    tier,
    allPremium: tier === 'apprentice' || tier === 'sovereign',
    pathIds: [...pathIds],
    deepDives: tier === 'apprentice' || tier === 'sovereign',
    expiresAt: sessionExpiresAt,
    source: 'session'
  });
}

export async function getPremiumRouteClaimsFromSessionToken(sessionToken) {
  if (!sessionToken) {
    return null;
  }

  const dbPool = getPool();
  if (!dbPool) {
    return null;
  }

  const sessionTokenHash = hashSessionToken(sessionToken);
  const result = await dbPool.query(
    `SELECT
       s.user_id,
       s.expires_at AS session_expires_at,
       e.entitlement_type,
       e.item_id
     FROM sessions s
     LEFT JOIN entitlements e
       ON e.user_id = s.user_id
      AND e.is_active = TRUE
      AND (e.expires_at IS NULL OR e.expires_at > NOW())
     WHERE s.session_token = $1
       AND s.expires_at > NOW()`,
    [sessionTokenHash]
  );

  return deriveClaimsFromSessionRows(result.rows);
}

export function isRouteAllowedForClaims(routeDetails, claims) {
  if (!routeDetails.protected) {
    return true;
  }

  if (!claims) {
    return false;
  }

  if (claims.allPremium) {
    return true;
  }

  if (routeDetails.area === 'deep-dive') {
    return Boolean(claims.deepDives);
  }

  if (routeDetails.area === 'path') {
    return Boolean(routeDetails.pathId && claims.pathIds.includes(routeDetails.pathId));
  }

  return false;
}

export async function resolvePremiumRouteAccess(inputPathname, cookieHeader = '') {
  const routeDetails = getProtectedRouteDetails(inputPathname);
  if (!routeDetails.protected) {
    return {
      allowed: true,
      routeDetails,
      source: 'public'
    };
  }

  const cookies = parseCookies(cookieHeader);
  const premiumRouteCookie = cookies[PREMIUM_ROUTE_COOKIE_NAME];

  if (premiumRouteCookie) {
    try {
      const claims = verifyPremiumRouteToken(premiumRouteCookie);
      if (isRouteAllowedForClaims(routeDetails, claims)) {
        return {
          allowed: true,
          claims,
          routeDetails,
          source: 'premium-route-cookie'
        };
      }
    } catch (error) {
      console.warn('[premium-route-access] Ignoring invalid premium route cookie:', error);
    }
  }

  const sessionToken = cookies[SESSION_COOKIE_NAME];
  if (sessionToken) {
    try {
      const claims = await getPremiumRouteClaimsFromSessionToken(sessionToken);
      if (isRouteAllowedForClaims(routeDetails, claims)) {
        return {
          allowed: true,
          claims,
          routeDetails,
          source: 'session'
        };
      }
    } catch (error) {
      console.error('[premium-route-access] Session entitlement lookup failed:', error);
    }
  }

  return {
    allowed: false,
    routeDetails,
    source: 'none'
  };
}
