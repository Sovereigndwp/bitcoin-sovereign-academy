/**
 * Purchase History API
 * 
 * GET /api/account/purchases
 * 
 * Returns user's purchase history with product details
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from '../lib/db';
import { verifyJWTWithRevocation, extractBearerToken } from '../lib/jwt';

interface Purchase {
  id: string;
  productId: string;
  productName: string;
  amount: number;
  currency: string;
  provider: string;
  status: string;
  paidAt: string | null;
  createdAt: string;
}

/**
 * Get product name from ID
 */
function getProductName(productId: string): string {
  const names: Record<string, string> = {
    demo_single: 'Single Demo Access',
    workshop_bundle: 'Workshop Bundle',
    path_monthly_curious: 'Curious Path Monthly',
    path_monthly_pragmatist: 'Pragmatist Path Monthly',
    path_monthly_builder: 'Builder Path Monthly',
    path_monthly_sovereign: 'Sovereign Path Monthly',
    path_annual_curious: 'Curious Path Annual',
    path_annual_pragmatist: 'Pragmatist Path Annual',
    path_annual_builder: 'Builder Path Annual',
    path_annual_sovereign: 'Sovereign Path Annual',
    path_lifetime_curious: 'Curious Path Lifetime',
    path_lifetime_pragmatist: 'Pragmatist Path Lifetime',
    path_lifetime_builder: 'Builder Path Lifetime',
    path_lifetime_sovereign: 'Sovereign Path Lifetime',
    all_access_monthly: 'All Access Monthly',
    all_access_annual: 'All Access Annual'
  };
  return names[productId] || productId;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify JWT
    const token = extractBearerToken(req.headers.authorization as string);
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const payload = verifyJWTWithRevocation(token);
    const userId = payload.user_id;

    // Fetch purchases
    const result = await query<{
      id: string;
      product_id: string;
      amount_usd: number;
      provider: string;
      status: string;
      paid_at: Date | null;
      created_at: Date;
    }>(
      `SELECT id, product_id, amount_usd, provider, status, paid_at, created_at
       FROM purchases
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 100`,
      [userId]
    );

    const purchases: Purchase[] = result.rows.map(p => ({
      id: p.id,
      productId: p.product_id,
      productName: getProductName(p.product_id),
      amount: parseFloat(p.amount_usd as any),
      currency: 'USD',
      provider: p.provider,
      status: p.status,
      paidAt: p.paid_at?.toISOString() || null,
      createdAt: p.created_at.toISOString()
    }));

    return res.status(200).json({ purchases });
  } catch (error: any) {
    console.error('Purchases API error:', error);
    return res.status(500).json({ error: 'Failed to fetch purchases' });
  }
}
