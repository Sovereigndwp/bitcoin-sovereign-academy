/**
 * Admin Payments Management API
 * GET /api/admin/payments - Get recent payments
 * GET /api/admin/payments/export - Export payments to CSV
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAdminToken } from './auth';

/**
 * CORS headers
 */
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || 'https://bitcoinsovereign.academy',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
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
 * Mock payment data
 * In production, this would query the payments table from the database
 */
function getMockPayments() {
  return {
    recent: [],
    stats: {
      total: 0,
      completed: 0,
      pending: 0,
      failed: 0,
    },
  };
}

/**
 * GET - Retrieve payments
 */
async function handleGet(req: VercelRequest, res: VercelResponse, path: string) {
  if (path === '/api/admin/payments/export') {
    // Export to CSV
    const payments = getMockPayments();

    const csvHeaders = 'Email,Amount,Provider,Status,Date,Items\n';
    const csvRows = payments.recent
      .map((p: any) =>
        `${p.email},${p.amount},${p.provider},${p.status},${p.date},"${JSON.stringify(p.items).replace(/"/g, '""')}"`
      )
      .join('\n');

    const csv = csvHeaders + csvRows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="payments-${Date.now()}.csv"`);
    return res.status(200).send(csv);
  }

  // Regular payment list
  const { limit = '50', offset = '0', status, email } = req.query;

  // TODO: Query real database
  const payments = getMockPayments();

  return res.status(200).json({
    success: true,
    payments: payments.recent,
    stats: payments.stats,
    pagination: {
      limit: parseInt(limit as string, 10),
      offset: parseInt(offset as string, 10),
      total: payments.recent.length,
    },
  });
}

/**
 * Main handler
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCORS(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify authentication
  if (!requireAuth(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const path = req.url?.split('?')[0] || '';
    return handleGet(req, res, path);
  } catch (err: any) {
    console.error('Payments error:', err);
    return res.status(500).json({ error: 'Failed to retrieve payments' });
  }
}
