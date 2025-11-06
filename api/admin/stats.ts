/**
 * Admin Statistics API
 * GET /api/admin/stats - Get dashboard statistics
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAdminToken } from './auth';
import { getAllEntitlements } from '../entitlements';

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
 * Calculate statistics from entitlements
 */
function calculateStats(entitlements: any) {
  const users = Object.values(entitlements) as any[];

  // Total users
  const totalUsers = users.length;

  // Total modules and paths granted
  let totalModules = 0;
  let totalPaths = 0;
  const moduleCount: { [key: string]: number } = {};
  const pathCount: { [key: string]: number } = {};

  users.forEach(user => {
    totalModules += user.modules?.length || 0;
    totalPaths += user.paths?.length || 0;

    user.modules?.forEach((mod: string) => {
      moduleCount[mod] = (moduleCount[mod] || 0) + 1;
    });

    user.paths?.forEach((path: string) => {
      pathCount[path] = (pathCount[path] || 0) + 1;
    });
  });

  // Most popular content
  const popularModules = Object.entries(moduleCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([id, count]) => ({ id, count }));

  const popularPaths = Object.entries(pathCount)
    .sort(([, a], [, b]) => b - a)
    .map(([id, count]) => ({ id, count }));

  // Recent users (last 10)
  const recentUsers = users
    .sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime())
    .slice(0, 10)
    .map(user => ({
      email: user.email,
      purchaseDate: user.purchaseDate,
      modulesCount: user.modules?.length || 0,
      pathsCount: user.paths?.length || 0,
    }));

  return {
    overview: {
      totalUsers,
      totalModulesGranted: totalModules,
      totalPathsGranted: totalPaths,
    },
    popularContent: {
      modules: popularModules,
      paths: popularPaths,
    },
    recentUsers,
  };
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
    // Get all entitlements
    const entitlements = getAllEntitlements();

    // Calculate statistics
    const stats = calculateStats(entitlements);

    // Mock revenue data (since we're using in-memory storage)
    // In production, this would query the database
    const mockRevenue = {
      allTime: 0, // Would come from payments table
      thisMonth: 0, // Would come from payments table
      lastMonth: 0, // Would come from payments table
      averageOrderValue: 0, // Would come from payments table
    };

    res.status(200).json({
      success: true,
      stats: {
        ...stats,
        revenue: mockRevenue,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Failed to retrieve statistics' });
  }
}
