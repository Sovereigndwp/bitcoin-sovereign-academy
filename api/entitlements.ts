import jwt from 'jsonwebtoken';
import { Entitlement, JWTPayload, CartItem } from './types';

/**
 * Entitlement system for managing user access to purchased content
 */

interface EntitlementStore {
  [email: string]: Entitlement;
}

// In-memory store (replace with database in production)
const entitlements: EntitlementStore = {};

/**
 * Get JWT secret from environment
 */
function getJWTSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable not set');
  }
  return secret;
}

/**
 * Create or update entitlement for a user after successful payment
 */
export function grantEntitlement(email: string, purchasedItems: CartItem[]): Entitlement {
  const existing = entitlements[email];

  const modules = new Set(existing?.modules || []);
  const paths = new Set(existing?.paths || []);

  // Process purchased items
  for (const item of purchasedItems) {
    if (item.type === 'module') {
      modules.add(item.id);
    } else if (item.type === 'path') {
      paths.add(item.id);
      // Add all modules from this path
      const pathModules = getModulesForPath(item.id);
      pathModules.forEach(moduleId => modules.add(moduleId));
    } else if (item.type === 'bundle') {
      // Add all paths and modules from bundle
      if (item.id === 'all-paths') {
        paths.add('curious');
        paths.add('builder');
        paths.add('sovereign');
        paths.add('principled');
      }
    }
  }

  const entitlement: Entitlement = {
    userId: existing?.userId || generateUserId(email),
    email,
    modules: Array.from(modules),
    paths: Array.from(paths),
    purchaseDate: existing?.purchaseDate || new Date().toISOString(),
  };

  entitlements[email] = entitlement;
  return entitlement;
}

/**
 * Generate a unique user ID from email
 */
function generateUserId(email: string): string {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(email).digest('hex').substring(0, 16);
}

/**
 * Get entitlement for a user
 */
export function getEntitlement(email: string): Entitlement | null {
  return entitlements[email] || null;
}

/**
 * Check if user has access to a specific module
 */
export function hasModuleAccess(email: string, moduleId: string): boolean {
  const entitlement = entitlements[email];
  if (!entitlement) return false;

  // Check if user purchased this specific module
  if (entitlement.modules.includes(moduleId)) return true;

  // Check if user purchased the entire path
  const pathId = moduleId.split('-')[0]; // Extract path from module ID (e.g., "curious" from "curious-s1m1")
  if (entitlement.paths.includes(pathId)) return true;

  return false;
}

/**
 * Check if user has access to a specific path
 */
export function hasPathAccess(email: string, pathId: string): boolean {
  const entitlement = entitlements[email];
  if (!entitlement) return false;

  return entitlement.paths.includes(pathId);
}

/**
 * Generate JWT token for authenticated access
 */
export function generateAccessToken(entitlement: Entitlement): string {
  const payload: JWTPayload = {
    ...entitlement,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60, // 1 year expiry
  };

  return jwt.sign(payload, getJWTSecret(), { algorithm: 'HS256' });
}

/**
 * Verify and decode JWT token
 */
export function verifyAccessToken(token: string): Entitlement {
  try {
    const decoded = jwt.verify(token, getJWTSecret()) as JWTPayload;

    return {
      userId: decoded.userId,
      email: decoded.email,
      modules: decoded.modules,
      paths: decoded.paths,
      purchaseDate: decoded.purchaseDate,
      expiresAt: decoded.exp ? new Date(decoded.exp * 1000).toISOString() : undefined,
    };
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
}

/**
 * Middleware to protect content routes
 */
export function requireAccess(
  token: string | null,
  requiredModuleId?: string,
  requiredPathId?: string
): { authorized: boolean; entitlement?: Entitlement; error?: string } {
  if (!token) {
    return { authorized: false, error: 'No access token provided' };
  }

  try {
    const entitlement = verifyAccessToken(token);

    // Check specific module access
    if (requiredModuleId && !hasModuleAccess(entitlement.email, requiredModuleId)) {
      return { authorized: false, error: 'No access to this module' };
    }

    // Check specific path access
    if (requiredPathId && !hasPathAccess(entitlement.email, requiredPathId)) {
      return { authorized: false, error: 'No access to this path' };
    }

    return { authorized: true, entitlement };
  } catch (err) {
    return { authorized: false, error: 'Invalid token' };
  }
}

/**
 * Export entitlements to JSON (for backup/migration)
 */
export function exportEntitlements(): string {
  return JSON.stringify(entitlements, null, 2);
}

/**
 * Import entitlements from JSON (for backup/migration)
 */
export function importEntitlements(data: string): void {
  const imported = JSON.parse(data);
  Object.assign(entitlements, imported);
}

/**
 * Get all entitlements (admin function)
 */
export function getAllEntitlements(): EntitlementStore {
  return entitlements;
}

/**
 * Get all module IDs for a given path
 */
function getModulesForPath(pathId: string): string[] {
  const pathModules: { [key: string]: string[] } = {
    'curious': [
      'curious-what-is-money',
      'curious-history-of-money',
      'curious-bitcoin-basics',
      'curious-why-bitcoin-matters'
    ],
    'builder': [
      'builder-setting-up-wallet',
      'builder-running-a-node',
      'builder-lightning-network',
      'builder-coinjoin-privacy'
    ],
    'sovereign': [
      'sovereign-advanced-security',
      'sovereign-multisig-custody',
      'sovereign-inheritance-planning',
      'sovereign-operational-security'
    ],
    'principled': [
      'principled-money-ethics',
      'principled-austrian-economics',
      'principled-sound-money',
      'principled-bitcoin-philosophy'
    ],
    'pragmatist': [
      'pragmatist-business-adoption',
      'pragmatist-tax-compliance',
      'pragmatist-treasury-management'
    ],
    'observer': [
      'observer-bitcoin-overview',
      'observer-use-cases',
      'observer-getting-started'
    ]
  };

  return pathModules[pathId] || [];
}
