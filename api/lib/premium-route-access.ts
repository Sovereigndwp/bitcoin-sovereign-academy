import * as jwt from 'jsonwebtoken';
import { queryMany } from './db';
import { hashToken } from './jwt';

export const PREMIUM_ROUTE_COOKIE_NAME = 'bsa_premium_route';
export const PREMIUM_ROUTE_TOKEN_KIND = 'premium-route-access';
export const ALL_PREMIUM_PATH_IDS = Object.freeze([
  'builder',
  'curious',
  'hurried',
  'pragmatist',
  'principled',
  'skeptic',
  'sovereign'
]);

const DEFAULT_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export interface PremiumRouteClaims {
  kind: 'premium-route-access';
  userId: string | null;
  allPremium: boolean;
  pathIds: string[];
  deepDives: boolean;
  expiresAt: string | null;
  source: string;
}

interface ActiveEntitlementRow {
  entitlement_type: string;
  item_id: string | null;
  expires_at: Date | null;
}

interface SessionEntitlementRow extends ActiveEntitlementRow {
  user_id: string;
  session_expires_at: Date;
}

function getJWTSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable not set');
  }
  return secret;
}

function toDate(value: unknown): Date | null {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function sanitizePathIds(pathIds: string[] = []): string[] {
  return [...new Set(pathIds.filter((pathId) => ALL_PREMIUM_PATH_IDS.includes(pathId)))];
}

function getCookieMaxAgeSeconds(expiresAt?: Date | string | null): number {
  const expiration = toDate(expiresAt);
  if (!expiration) {
    return DEFAULT_COOKIE_MAX_AGE_SECONDS;
  }

  return Math.max(60, Math.floor((expiration.getTime() - Date.now()) / 1000));
}

export function buildPremiumRouteClaims({
  userId = null,
  allPremium = false,
  pathIds = [],
  deepDives = false,
  expiresAt = null,
  source = 'unknown'
}: {
  userId?: string | null;
  allPremium?: boolean;
  pathIds?: string[];
  deepDives?: boolean;
  expiresAt?: Date | string | null;
  source?: string;
} = {}): PremiumRouteClaims {
  const allowAllPremium = Boolean(allPremium);

  return {
    kind: PREMIUM_ROUTE_TOKEN_KIND,
    userId,
    allPremium: allowAllPremium,
    pathIds: allowAllPremium ? [...ALL_PREMIUM_PATH_IDS] : sanitizePathIds(pathIds),
    deepDives: allowAllPremium || Boolean(deepDives),
    expiresAt: toDate(expiresAt)?.toISOString() || null,
    source
  };
}

export function signPremiumRouteToken(
  claims: PremiumRouteClaims,
  options: { expiresAt?: Date | string | null; maxAgeSeconds?: number } = {}
): { token: string; maxAgeSeconds: number } {
  const expiresAt = toDate(options.expiresAt || claims.expiresAt);
  const maxAgeSeconds = options.maxAgeSeconds || getCookieMaxAgeSeconds(expiresAt);

  const token = jwt.sign(claims, getJWTSecret(), {
    algorithm: 'HS256',
    expiresIn: maxAgeSeconds
  });

  return { token, maxAgeSeconds };
}

export function serializePremiumRouteCookie(
  token: string,
  {
    isSecure = false,
    maxAgeSeconds = DEFAULT_COOKIE_MAX_AGE_SECONDS
  }: {
    isSecure?: boolean;
    maxAgeSeconds?: number;
  } = {}
): string {
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

export function serializeClearedPremiumRouteCookie({ isSecure = false }: { isSecure?: boolean } = {}): string {
  return serializePremiumRouteCookie('', {
    isSecure,
    maxAgeSeconds: 0
  });
}

function deriveClaimsFromEntitlements(
  userId: string,
  entitlements: ActiveEntitlementRow[],
  {
    expiresAt = null,
    source = 'session'
  }: {
    expiresAt?: Date | string | null;
    source?: string;
  } = {}
): PremiumRouteClaims | null {
  const pathIds = new Set<string>();
  let allPremium = false;
  let derivedExpiresAt = toDate(expiresAt);

  for (const entitlement of entitlements) {
    const entitlementType = entitlement.entitlement_type;
    const itemId = entitlement.item_id;
    const entitlementExpiresAt = toDate(entitlement.expires_at);

    if (entitlementExpiresAt && (!derivedExpiresAt || entitlementExpiresAt < derivedExpiresAt)) {
      derivedExpiresAt = entitlementExpiresAt;
    }

    if (entitlementType === 'all_access_monthly' || entitlementType === 'all_access_annual') {
      allPremium = true;
      continue;
    }

    if (entitlementType.startsWith('path_') && itemId && ALL_PREMIUM_PATH_IDS.includes(itemId)) {
      pathIds.add(itemId);
    }
  }

  if (!allPremium && pathIds.size === 0) {
    return null;
  }

  return buildPremiumRouteClaims({
    userId,
    allPremium,
    pathIds: [...pathIds],
    deepDives: allPremium,
    expiresAt: derivedExpiresAt,
    source
  });
}

export async function getUserPremiumRouteClaims(
  userId: string,
  sessionExpiresAt?: Date | string | null
): Promise<PremiumRouteClaims | null> {
  const entitlements = await queryMany<ActiveEntitlementRow>(
    `SELECT entitlement_type, item_id, expires_at
     FROM entitlements
     WHERE user_id = $1
       AND is_active = TRUE
       AND (expires_at IS NULL OR expires_at > NOW())`,
    [userId]
  );

  return deriveClaimsFromEntitlements(userId, entitlements, {
    expiresAt: sessionExpiresAt,
    source: 'auth-session'
  });
}

export async function getPremiumRouteClaimsFromSessionToken(sessionToken: string): Promise<PremiumRouteClaims | null> {
  const sessionTokenHash = hashToken(sessionToken);
  const rows = await queryMany<SessionEntitlementRow>(
    `SELECT
       s.user_id,
       s.expires_at AS session_expires_at,
       e.entitlement_type,
       e.item_id,
       e.expires_at
     FROM sessions s
     LEFT JOIN entitlements e
       ON e.user_id = s.user_id
      AND e.is_active = TRUE
      AND (e.expires_at IS NULL OR e.expires_at > NOW())
     WHERE s.session_token = $1
       AND s.expires_at > NOW()`,
    [sessionTokenHash]
  );

  if (rows.length === 0) {
    return null;
  }

  return deriveClaimsFromEntitlements(rows[0].user_id, rows, {
    expiresAt: rows[0].session_expires_at,
    source: 'session'
  });
}
