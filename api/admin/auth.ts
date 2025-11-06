/**
 * Admin Authentication API
 * POST /api/admin/auth - Verify admin credentials
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import * as crypto from 'crypto';

/**
 * CORS headers
 */
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || 'https://bitcoinsovereign.academy',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

/**
 * Handle CORS preflight
 */
function handleCORS(req: VercelRequest, res: VercelResponse): boolean {
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  if (req.method === 'OPTIONS') {
    res.status(200).json({});
    return true;
  }
  return false;
}

/**
 * Verify admin password
 */
function verifyAdminPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error('ADMIN_PASSWORD environment variable not set');
    return false;
  }

  // Use constant-time comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(password),
      Buffer.from(adminPassword)
    );
  } catch (err) {
    return false;
  }
}

/**
 * Generate admin session token
 */
function generateAdminToken(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('FATAL: JWT_SECRET not configured');
  }

  const token = crypto.randomBytes(32).toString('hex');
  const timestamp = Date.now();
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${token}:${timestamp}`)
    .digest('hex');

  return `${token}:${timestamp}:${signature}`;
}

/**
 * Verify admin session token
 */
export function verifyAdminToken(token: string | null | undefined): boolean {
  if (!token) return false;

  try {
    const [tokenPart, timestampStr, signature] = token.split(':');
    const timestamp = parseInt(timestampStr, 10);

    // Check token age (24 hours max)
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    if (Date.now() - timestamp > maxAge) {
      return false;
    }

    // Verify signature
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('FATAL: JWT_SECRET not configured');
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${tokenPart}:${timestamp}`)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (err) {
    return false;
  }
}

/**
 * Main handler
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCORS(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password required' });
    }

    // Verify password
    if (!verifyAdminPassword(password)) {
      // Add delay to prevent brute force
      await new Promise(resolve => setTimeout(resolve, 1000));
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate session token
    const token = generateAdminToken();

    res.status(200).json({
      success: true,
      token,
      expiresIn: '24h'
    });
  } catch (err: any) {
    console.error('Admin auth error:', err);
    res.status(500).json({ error: 'Authentication failed' });
  }
}
