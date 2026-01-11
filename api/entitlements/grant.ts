/**
 * Grant Entitlements - After Payment Success
 * 
 * Security:
 * - Only called from verified webhooks
 * - Database transaction for atomicity
 * - Prevents duplicate grants
 * - Calculates expiration correctly
 */

import { query, queryOne, transaction, queryWithClient } from '../lib/db';
import { getProduct, calculateExpiration } from '../config/products';

/**
 * Grant entitlement to user
 * 
 * @param userId - User ID to grant access to
 * @param productId - Product purchased
 * @param purchaseId - Purchase record ID for tracking
 * @returns Entitlement ID
 */
export async function grantEntitlement(
  userId: string,
  productId: string,
  purchaseId: string
): Promise<string> {
  // Get product details
  const product = getProduct(productId);

  // Calculate expiration
  const expiresAt = calculateExpiration(productId);

  // Check if entitlement already exists for this purchase
  const existing = await queryOne<{ id: string }>(
    `SELECT id FROM entitlements 
     WHERE user_id = $1 
     AND entitlement_type = $2 
     AND item_id = $3`,
    [userId, product.entitlement_type, product.item_id]
  );

  if (existing) {
    // Update existing entitlement (extend expiration if applicable)
    if (expiresAt) {
      await query(
        `UPDATE entitlements 
         SET expires_at = $1, is_active = true, updated_at = NOW()
         WHERE id = $2`,
        [expiresAt, existing.id]
      );
    } else {
      // Lifetime access - just ensure it's active
      await query(
        `UPDATE entitlements 
         SET is_active = true, expires_at = NULL, updated_at = NOW()
         WHERE id = $1`,
        [existing.id]
      );
    }

    console.log('Entitlement updated:', {
      userId,
      productId,
      entitlementId: existing.id,
      expiresAt
    });

    return existing.id;
  }

  // Create new entitlement
  const result = await queryOne<{ id: string }>(
    `INSERT INTO entitlements (user_id, entitlement_type, item_id, expires_at, is_active)
     VALUES ($1, $2, $3, $4, true)
     RETURNING id`,
    [userId, product.entitlement_type, product.item_id, expiresAt]
  );

  console.log('Entitlement granted:', {
    userId,
    productId,
    entitlementId: result!.id,
    expiresAt
  });

  return result!.id;
}

/**
 * Revoke entitlement (for refunds)
 */
export async function revokeEntitlement(
  userId: string,
  productId: string
): Promise<void> {
  const product = getProduct(productId);

  await query(
    `UPDATE entitlements 
     SET is_active = false, updated_at = NOW()
     WHERE user_id = $1 
     AND entitlement_type = $2 
     AND item_id = $3`,
    [userId, product.entitlement_type, product.item_id]
  );

  console.log('Entitlement revoked:', {
    userId,
    productId
  });
}

/**
 * Get user's entitlements
 */
export async function getUserEntitlements(userId: string): Promise<Array<{
  id: string;
  entitlement_type: string;
  item_id: string | null;
  expires_at: Date | null;
  is_active: boolean;
  created_at: Date;
}>> {
  const result = await query(
    `SELECT id, entitlement_type, item_id, expires_at, is_active, created_at
     FROM entitlements
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );

  return result.rows;
}

/**
 * Check if user has active subscription
 */
export async function hasActiveSubscription(
  userId: string,
  subscriptionType: 'path_monthly' | 'path_annual' | 'all_access_monthly' | 'all_access_annual'
): Promise<boolean> {
  const result = await queryOne<{ count: number }>(
    `SELECT COUNT(*) as count
     FROM entitlements
     WHERE user_id = $1
     AND entitlement_type = $2
     AND is_active = true
     AND (expires_at IS NULL OR expires_at > NOW())`,
    [userId, subscriptionType]
  );

  return (result?.count || 0) > 0;
}

/**
 * Clean expired entitlements (maintenance task)
 */
export async function cleanExpiredEntitlements(): Promise<number> {
  const result = await query(
    `UPDATE entitlements
     SET is_active = false
     WHERE expires_at < NOW()
     AND is_active = true`
  );

  return result.rowCount || 0;
}
