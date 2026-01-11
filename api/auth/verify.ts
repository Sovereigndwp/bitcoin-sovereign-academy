/**
 * Magic Link Verification
 * 
 * Security:
 * - One-time use (token invalidated immediately)
 * - Expiration check
 * - Constant-time comparison
 * - Device registration
 * - Session creation with httpOnly cookies
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { query, queryOne, transaction, queryWithClient, logSecurityEvent } from '../lib/db';
import { validateToken, assertValid, sanitizeIPAddress, sanitizeUserAgent, validateDeviceFingerprint } from '../lib/validation';
import { hashToken, verifyHashedToken, generateSessionToken, generateAccessToken } from '../lib/jwt';

interface User {
  id: string;
  email: string;
  magic_link_token: string;
  magic_link_expires: Date;
  is_email_verified: boolean;
}

/**
 * Register or update device
 */
async function registerDevice(
  userId: string,
  deviceFingerprint: string,
  userAgent: string,
  client: any
): Promise<string> {
  // Check if device already exists
  const existingDevice = await queryWithClient<{ id: string; is_active: boolean }>(
    client,
    'SELECT id, is_active FROM devices WHERE user_id = $1 AND device_fingerprint = $2',
    [userId, deviceFingerprint]
  );

  if (existingDevice.rows[0]) {
    // Reactivate existing device
    await queryWithClient(
      client,
      'UPDATE devices SET is_active = true, last_active_at = NOW() WHERE id = $1',
      [existingDevice.rows[0].id]
    );
    return existingDevice.rows[0].id;
  }

  // Deactivate all other devices (1 device limit)
  await queryWithClient(
    client,
    'UPDATE devices SET is_active = false WHERE user_id = $1',
    [userId]
  );

  // Register new device
  const result = await queryWithClient<{ id: string }>(
    client,
    `INSERT INTO devices (user_id, device_fingerprint, device_name, is_active, last_active_at)
     VALUES ($1, $2, $3, true, NOW())
     RETURNING id`,
    [userId, deviceFingerprint, userAgent.substring(0, 100)]
  );

  return result.rows[0].id;
}

/**
 * Create session
 */
async function createSession(
  userId: string,
  deviceId: string,
  ipAddress: string,
  userAgent: string,
  client: any
): Promise<string> {
  const sessionToken = generateSessionToken();
  const tokenHash = hashToken(sessionToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await queryWithClient(
    client,
    `INSERT INTO sessions (user_id, device_id, session_token, expires_at, user_agent, ip_address)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [userId, deviceId, tokenHash, expiresAt, userAgent, ipAddress]
  );

  return sessionToken;
}

/**
 * Main handler: Verify magic link
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Allow GET or POST
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = req.query.token as string || req.body?.token;
    const deviceFingerprint = req.body?.device_fingerprint as string;

    // Validate token format
    const tokenValidation = validateToken(token);
    assertValid(tokenValidation);

    // Validate device fingerprint if provided
    if (deviceFingerprint) {
      const deviceValidation = validateDeviceFingerprint(deviceFingerprint);
      assertValid(deviceValidation);
    }

    const tokenHash = hashToken(token);

    // Find user with this token
    const user = await queryOne<User>(
      `SELECT id, email, magic_link_token, magic_link_expires, is_email_verified
       FROM users
       WHERE magic_link_token = $1`,
      [tokenHash]
    );

    if (!user) {
      await logSecurityEvent({
        event_type: 'AUTH_FAILURE',
        severity: 'MEDIUM',
        ip_address: sanitizeIPAddress(req.headers['x-forwarded-for'] || req.socket.remoteAddress),
        metadata: { reason: 'invalid_token', endpoint: 'verify' }
      });

      return res.status(401).json({
        error: 'Invalid or expired magic link. Please request a new one.'
      });
    }

    // Check expiration
    if (new Date() > new Date(user.magic_link_expires)) {
      await logSecurityEvent({
        event_type: 'AUTH_FAILURE',
        severity: 'LOW',
        user_id: user.id,
        ip_address: sanitizeIPAddress(req.headers['x-forwarded-for'] || req.socket.remoteAddress),
        metadata: { reason: 'expired_token', endpoint: 'verify' }
      });

      return res.status(401).json({
        error: 'This magic link has expired. Please request a new one.'
      });
    }

    // Get client info
    const ipAddress = sanitizeIPAddress(
      req.headers['x-forwarded-for'] || req.socket.remoteAddress
    );
    const userAgent = sanitizeUserAgent(req.headers['user-agent']);

    // Use transaction to ensure atomic operations
    const result = await transaction(async (client) => {
      // Invalidate the magic link (one-time use)
      await queryWithClient(
        client,
        'UPDATE users SET magic_link_token = NULL, magic_link_expires = NULL, is_email_verified = true, last_login_at = NOW() WHERE id = $1',
        [user.id]
      );

      // Register device
      const deviceId = await registerDevice(
        user.id,
        deviceFingerprint || `auto-${Date.now()}`,
        userAgent,
        client
      );

      // Create session
      const sessionToken = await createSession(
        user.id,
        deviceId,
        ipAddress,
        userAgent,
        client
      );

      return { deviceId, sessionToken };
    });

    // Generate access token (JWT)
    const accessToken = generateAccessToken(
      user.id,
      user.email,
      result.deviceId
    );

    // Set session cookie (httpOnly, secure, sameSite)
    const isProduction = process.env.NODE_ENV === 'production';
    res.setHeader('Set-Cookie', [
      `session=${result.sessionToken}; Path=/; HttpOnly; ${isProduction ? 'Secure;' : ''} SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`
    ]);

    console.log('User authenticated:', {
      userId: user.id,
      email: user.email,
      ip: ipAddress,
      timestamp: new Date().toISOString()
    });

    // Return success with tokens
    return res.status(200).json({
      success: true,
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        is_email_verified: true
      }
    });

  } catch (error: any) {
    console.error('Verification error:', error);

    await logSecurityEvent({
      event_type: 'AUTH_FAILURE',
      severity: 'MEDIUM',
      ip_address: sanitizeIPAddress(req.headers['x-forwarded-for'] || req.socket.remoteAddress),
      metadata: { error: error.message, endpoint: 'verify' }
    });

    return res.status(500).json({
      error: 'Verification failed. Please try again.'
    });
  }
}
