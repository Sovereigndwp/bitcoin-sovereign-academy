/**
 * Content Access (Entitlements) API
 * 
 * GET /api/account/entitlements
 * 
 * Returns user's content access with expiration info
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from '../lib/db';
import { verifyJWTWithRevocation, extractBearerToken } from '../lib/jwt';
import { FREE_DEMOS } from '../config/products';

interface Entitlement {
  id: string;
  type: string;
  typeName: string;
  itemId: string | null;
  itemName: string | null;
  isActive: boolean;
  expiresAt: string | null;
  isExpired: boolean;
  createdAt: string;
}

/**
 * Get type display name
 */
function getTypeName(type: string): string {
  const names: Record<string, string> = {
    demo: 'Demo Access',
    workshop: 'Workshop Access',
    path_monthly: 'Path Monthly',
    path_annual: 'Path Annual',
    path_lifetime: 'Path Lifetime',
    all_access_monthly: 'All Access Monthly',
    all_access_annual: 'All Access Annual'
  };
  return names[type] || type;
}

/**
 * Get item display name
 */
function getItemName(itemId: string | null, type: string): string | null {
  if (!itemId) return null;
  
  const pathNames: Record<string, string> = {
    curious: 'Curious Path',
    pragmatist: 'Pragmatist Path',
    builder: 'Builder Path',
    sovereign: 'Sovereign Path'
  };
  
  if (type.startsWith('path_')) {
    return pathNames[itemId] || itemId;
  }
  
  // Demo/workshop names
  const demoNames: Record<string, string> = {
    'bitcoin-basics': 'Bitcoin Basics',
    'hash-puzzle': 'Hash Puzzle',
    'double-spending': 'Double Spending Demo',
    'wallet-types': 'Wallet Types',
    'transaction-simulator': 'Transaction Simulator',
    'key-generator': 'Key Generator'
  };
  
  return demoNames[itemId] || itemId;
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

    // Fetch entitlements
    const result = await query<{
      id: string;
      entitlement_type: string;
      item_id: string | null;
      is_active: boolean;
      expires_at: Date | null;
      created_at: Date;
    }>(
      `SELECT id, entitlement_type, item_id, is_active, expires_at, created_at
       FROM entitlements
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    const now = new Date();
    
    const entitlements: Entitlement[] = result.rows.map(e => {
      const isExpired = e.expires_at ? e.expires_at < now : false;
      
      return {
        id: e.id,
        type: e.entitlement_type,
        typeName: getTypeName(e.entitlement_type),
        itemId: e.item_id,
        itemName: getItemName(e.item_id, e.entitlement_type),
        isActive: e.is_active && !isExpired,
        expiresAt: e.expires_at?.toISOString() || null,
        isExpired,
        createdAt: e.created_at.toISOString()
      };
    });

    // Also return free demos available to everyone
    const freeDemos = FREE_DEMOS.map(demoId => ({
      id: `free_${demoId}`,
      type: 'free',
      typeName: 'Free Demo',
      itemId: demoId,
      itemName: getItemName(demoId, 'demo'),
      isActive: true,
      expiresAt: null,
      isExpired: false,
      createdAt: new Date().toISOString()
    }));

    return res.status(200).json({ 
      entitlements,
      freeDemos,
      hasAllAccess: entitlements.some(e => 
        e.isActive && e.type.startsWith('all_access')
      )
    });
  } catch (error: any) {
    console.error('Entitlements API error:', error);
    return res.status(500).json({ error: 'Failed to fetch entitlements' });
  }
}
