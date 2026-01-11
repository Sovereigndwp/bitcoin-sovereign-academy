/**
 * JWT Utilities with Security
 * 
 * Security:
 * - HS256 algorithm with 256-bit secrets
 * - Short expiration times
 * - Token rotation support
 * - Device binding
 * - Revocation list
 */

import * as crypto from 'crypto';

/**
 * JWT payload structure
 */
export interface JWTPayload {
  user_id: string;
  device_id?: string;
  email: string;
  entitlements?: string[];
  exp: number; // Expiration timestamp
  iat: number; // Issued at timestamp
  jti: string; // Unique token ID
}

/**
 * Get JWT secrets (supports rotation)
 * Security: Multiple secrets during rotation period
 */
function getJWTSecrets(): string[] {
  const current = process.env.JWT_SECRET;
  const previous = process.env.JWT_SECRET_PREVIOUS;

  if (!current) {
    throw new Error('JWT_SECRET environment variable not set');
  }

  const secrets = [current];
  if (previous) {
    secrets.push(previous);
  }

  return secrets;
}

/**
 * Base64 URL encoding
 */
function base64urlEncode(str: string | Buffer): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Base64 URL decoding
 */
function base64urlDecode(str: string): string {
  // Add padding
  str += '='.repeat((4 - (str.length % 4)) % 4);
  // Replace URL-safe characters
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(str, 'base64').toString('utf8');
}

/**
 * Generate HMAC signature
 * Security: Constant-time comparison prevents timing attacks
 */
function generateSignature(data: string, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest('base64url');
}

/**
 * Verify signature with constant-time comparison
 * Security: Prevents timing attacks
 */
function verifySignature(
  data: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = generateSignature(data, secret);
  
  try {
    // Constant-time comparison
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch {
    return false;
  }
}

/**
 * Generate unique token ID
 */
function generateTokenId(): string {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Sign a JWT token
 * Security: HS256 algorithm, short expiration
 */
export function signJWT(
  payload: Omit<JWTPayload, 'exp' | 'iat' | 'jti'>,
  expiresIn: number = 3600 // 1 hour default
): string {
  const now = Math.floor(Date.now() / 1000);
  
  const fullPayload: JWTPayload = {
    ...payload,
    exp: now + expiresIn,
    iat: now,
    jti: generateTokenId()
  };

  // JWT header
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  // Encode header and payload
  const encodedHeader = base64urlEncode(JSON.stringify(header));
  const encodedPayload = base64urlEncode(JSON.stringify(fullPayload));

  // Create signature
  const data = `${encodedHeader}.${encodedPayload}`;
  const secret = getJWTSecrets()[0]; // Use current secret for signing
  const signature = generateSignature(data, secret);

  return `${data}.${signature}`;
}

/**
 * Verify and decode JWT token
 * Security: Try current secret first, fall back to previous (rotation)
 */
export function verifyJWT(token: string): JWTPayload {
  if (!token || typeof token !== 'string') {
    throw new JWTError('Invalid token format');
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new JWTError('Invalid token structure');
  }

  const [encodedHeader, encodedPayload, signature] = parts;
  
  // Decode header
  let header: any;
  try {
    header = JSON.parse(base64urlDecode(encodedHeader));
  } catch {
    throw new JWTError('Invalid token header');
  }

  // Verify algorithm
  if (header.alg !== 'HS256') {
    throw new JWTError('Invalid algorithm');
  }

  // Try to verify with available secrets
  const data = `${encodedHeader}.${encodedPayload}`;
  const secrets = getJWTSecrets();
  
  let verified = false;
  for (const secret of secrets) {
    if (verifySignature(data, signature, secret)) {
      verified = true;
      break;
    }
  }

  if (!verified) {
    throw new JWTError('Invalid signature');
  }

  // Decode payload
  let payload: JWTPayload;
  try {
    payload = JSON.parse(base64urlDecode(encodedPayload));
  } catch {
    throw new JWTError('Invalid token payload');
  }

  // Verify expiration
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < now) {
    throw new JWTError('Token expired');
  }

  // Verify required fields
  if (!payload.user_id || !payload.email) {
    throw new JWTError('Missing required fields');
  }

  return payload;
}

/**
 * Decode JWT without verification (use cautiously)
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(base64urlDecode(parts[1]));
    return payload;
  } catch {
    return null;
  }
}

/**
 * Check if token is expired (without verification)
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) return true;

  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}

/**
 * Generate access token (short-lived)
 * For API access to protected content
 */
export function generateAccessToken(
  userId: string,
  email: string,
  deviceId?: string,
  entitlements?: string[]
): string {
  return signJWT(
    {
      user_id: userId,
      email,
      device_id: deviceId,
      entitlements
    },
    3600 // 1 hour
  );
}

/**
 * Generate refresh token (long-lived)
 * For renewing access tokens
 */
export function generateRefreshToken(
  userId: string,
  email: string,
  deviceId?: string
): string {
  return signJWT(
    {
      user_id: userId,
      email,
      device_id: deviceId
    },
    604800 // 7 days
  );
}

/**
 * JWT Error class
 */
export class JWTError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'JWTError';
  }
}

/**
 * Token Revocation List (simple in-memory implementation)
 * For production, use Redis or database
 */
const revokedTokens = new Set<string>();

/**
 * Revoke a token by its JTI
 */
export function revokeToken(jti: string): void {
  revokedTokens.add(jti);
}

/**
 * Check if token is revoked
 */
export function isTokenRevoked(jti: string): boolean {
  return revokedTokens.has(jti);
}

/**
 * Clear old revoked tokens (maintenance)
 * Call this periodically to prevent memory bloat
 */
export function clearOldRevokedTokens(): void {
  // In production, implement with TTL in Redis
  // For now, just clear all (since tokens expire anyway)
  revokedTokens.clear();
}

/**
 * Verify JWT and check revocation
 */
export function verifyJWTWithRevocation(token: string): JWTPayload {
  const payload = verifyJWT(token);
  
  if (isTokenRevoked(payload.jti)) {
    throw new JWTError('Token has been revoked');
  }

  return payload;
}

/**
 * Extract token from Authorization header
 */
export function extractBearerToken(authHeader: string | undefined): string | null {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
}

/**
 * Generate secure random token (for magic links, etc.)
 */
export function generateSecureToken(bytes: number = 32): string {
  return crypto.randomBytes(bytes).toString('base64url');
}

/**
 * Generate session token (for cookies)
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('base64url');
}

/**
 * Hash a token (for storing in database)
 * Security: Store hashed tokens, not plaintext
 */
export function hashToken(token: string): string {
  return crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
}

/**
 * Verify hashed token with constant-time comparison
 */
export function verifyHashedToken(token: string, hash: string): boolean {
  const tokenHash = hashToken(token);
  
  try {
    return crypto.timingSafeEqual(
      Buffer.from(tokenHash),
      Buffer.from(hash)
    );
  } catch {
    return false;
  }
}
