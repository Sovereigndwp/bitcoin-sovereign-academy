/**
 * Admin User Management API
 * GET /api/admin/users?email=xxx - Search user by email
 * POST /api/admin/users - Manually grant access
 * DELETE /api/admin/users?email=xxx - Revoke access
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAdminToken } from './auth';
import {
  getEntitlement,
  grantEntitlement,
  generateAccessToken,
  getAllEntitlements
} from '../entitlements';
import { CartItem } from '../types';

/**
 * CORS headers
 */
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || 'https://bitcoinsovereign.academy',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
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
 * Verify admin authentication
 */
function requireAuth(req: VercelRequest): boolean {
  const token = req.headers.authorization?.replace('Bearer ', '');
  return verifyAdminToken(token);
}

/**
 * GET - Search users
 */
async function handleGet(req: VercelRequest, res: VercelResponse) {
  const { email, search } = req.query;

  if (email && typeof email === 'string') {
    // Get specific user
    const entitlement = getEntitlement(email);

    if (!entitlement) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      user: entitlement,
    });
  } else if (search && typeof search === 'string') {
    // Search all users
    const allUsers = getAllEntitlements();
    const searchLower = search.toLowerCase();

    const results = Object.values(allUsers)
      .filter((user: any) => user.email.toLowerCase().includes(searchLower))
      .slice(0, 20); // Limit to 20 results

    return res.status(200).json({
      success: true,
      users: results,
      count: results.length,
    });
  } else {
    // Return all users (paginated)
    const allUsers = Object.values(getAllEntitlements());
    const page = parseInt(req.query.page as string || '1', 10);
    const limit = 50;
    const offset = (page - 1) * limit;

    const paginatedUsers = allUsers.slice(offset, offset + limit);

    return res.status(200).json({
      success: true,
      users: paginatedUsers,
      page,
      totalPages: Math.ceil(allUsers.length / limit),
      totalUsers: allUsers.length,
    });
  }
}

/**
 * POST - Manually grant access
 */
async function handlePost(req: VercelRequest, res: VercelResponse) {
  const { email, items } = req.body;

  if (!email || !items || !Array.isArray(items)) {
    return res.status(400).json({
      error: 'Invalid request. Required: email (string) and items (array)',
    });
  }

  try {
    // Grant entitlement
    const entitlement = grantEntitlement(email, items as CartItem[]);
    const token = generateAccessToken(entitlement);

    // Optionally send email
    const sendEmail = req.body.sendEmail || false;

    if (sendEmail) {
      const { sendAccessTokenEmail } = await import('../email');
      await sendAccessTokenEmail({
        email,
        token,
        modules: entitlement.modules,
        paths: entitlement.paths,
        totalPaid: 0, // Manual grant, no payment
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Access granted successfully',
      user: entitlement,
      token,
      emailSent: sendEmail,
    });
  } catch (err: any) {
    console.error('Grant access error:', err);
    return res.status(500).json({ error: err.message });
  }
}

/**
 * DELETE - Revoke access
 */
async function handleDelete(req: VercelRequest, res: VercelResponse) {
  const { email } = req.query;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email required' });
  }

  try {
    const entitlements = getAllEntitlements();

    if (!entitlements[email]) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove entitlement
    delete entitlements[email];

    return res.status(200).json({
      success: true,
      message: 'Access revoked successfully',
      email,
    });
  } catch (err: any) {
    console.error('Revoke access error:', err);
    return res.status(500).json({ error: err.message });
  }
}

/**
 * Main handler
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCORS(req, res)) return;

  // Verify authentication
  if (!requireAuth(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    switch (req.method) {
      case 'GET':
        return handleGet(req, res);
      case 'POST':
        return handlePost(req, res);
      case 'DELETE':
        return handleDelete(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err: any) {
    console.error('User management error:', err);
    return res.status(500).json({ error: 'Operation failed' });
  }
}
