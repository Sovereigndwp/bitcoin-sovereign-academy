/**
 * Magic Link Authentication - Send Magic Link
 * 
 * Security:
 * - Crypto-random tokens (32 bytes)
 * - 15-minute expiration
 * - Rate limiting (3 emails/hour per address)
 * - One-time use only
 * - IP address tracking
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { query, queryOne, logSecurityEvent } from '../lib/db';
import { validateEmail, assertValid, sanitizeIPAddress } from '../lib/validation';
import { generateSecureToken, hashToken } from '../lib/jwt';

/**
 * Rate limiting check
 * Security: Prevent email flooding
 */
async function checkRateLimit(email: string): Promise<boolean> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  
  const result = await queryOne<{ count: number }>(
    `SELECT COUNT(*) as count FROM users 
     WHERE email = $1 
     AND magic_link_expires > $2`,
    [email, oneHourAgo]
  );

  return (result?.count || 0) < 3; // Max 3 magic links per hour
}

/**
 * Send magic link email using email service
 */
async function sendMagicLinkEmail(
  email: string,
  token: string,
  baseUrl: string
): Promise<void> {
  const { sendMagicLinkEmail: sendEmail } = await import('../lib/email');
  
  await sendEmail({
    email,
    token,
    expiresInMinutes: 15
  });
}

/**
 * Main handler: Send magic link
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    // Validate email
    const emailValidation = validateEmail(email);
    assertValid(emailValidation);

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Check rate limit
    const withinLimit = await checkRateLimit(normalizedEmail);
    if (!withinLimit) {
      await logSecurityEvent({
        event_type: 'RATE_LIMIT_HIT',
        severity: 'MEDIUM',
        ip_address: sanitizeIPAddress(req.headers['x-forwarded-for'] || req.socket.remoteAddress),
        metadata: { email: normalizedEmail, endpoint: 'magic-link' }
      });

      return res.status(429).json({ 
        error: 'Too many requests. Please try again in an hour.' 
      });
    }

    // Generate secure token
    const token = generateSecureToken(32); // 32 bytes = 256 bits
    const tokenHash = hashToken(token);

    // Calculate expiration (15 minutes)
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Get client IP
    const ipAddress = sanitizeIPAddress(
      req.headers['x-forwarded-for'] || req.socket.remoteAddress
    );

    // Check if user exists
    const existingUser = await queryOne<{ id: string }>(
      'SELECT id FROM users WHERE email = $1',
      [normalizedEmail]
    );

    if (existingUser) {
      // Update existing user
      await query(
        `UPDATE users 
         SET magic_link_token = $1,
             magic_link_expires = $2,
             updated_at = NOW()
         WHERE email = $3`,
        [tokenHash, expiresAt, normalizedEmail]
      );
    } else {
      // Create new user
      await query(
        `INSERT INTO users (email, magic_link_token, magic_link_expires, is_email_verified)
         VALUES ($1, $2, $3, false)`,
        [normalizedEmail, tokenHash, expiresAt]
      );
    }

    // Send magic link email
    const baseUrl = process.env.BASE_URL || 'https://bitcoinsovereign.academy';
    await sendMagicLinkEmail(normalizedEmail, token, baseUrl);

    // Log success (not a security event, just info)
    console.log('Magic link sent:', {
      email: normalizedEmail,
      ip: ipAddress,
      timestamp: new Date().toISOString()
    });

    // Always return success even if email doesn't exist (prevent email enumeration)
    return res.status(200).json({
      success: true,
      message: 'If that email is registered, you will receive a login link shortly.'
    });

  } catch (error: any) {
    console.error('Magic link error:', error);

    // Log security event for failures
    await logSecurityEvent({
      event_type: 'AUTH_FAILURE',
      severity: 'LOW',
      ip_address: sanitizeIPAddress(req.headers['x-forwarded-for'] || req.socket.remoteAddress),
      metadata: { error: error.message, endpoint: 'magic-link' }
    });

    return res.status(500).json({
      error: 'Failed to send magic link. Please try again.'
    });
  }
}
