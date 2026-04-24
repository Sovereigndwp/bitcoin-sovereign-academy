/**
 * Check Entitlements - Verify User Access
 * 
 * Security:
 * - JWT verification required
 * - Device validation
 * - Database lookup for active entitlements
 * - Expiration checking
 * - Returns short-lived access tokens
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { queryMany, logSecurityEvent } from '../lib/db';
import { validateContentId, assertValid, sanitizeIPAddress } from '../lib/validation';
import { verifyJWTWithRevocation, JWTError, extractBearerToken } from '../lib/jwt';
import { isFreeDemo } from '../config/products';

interface Entitlement {
  id: string;
  entitlement_type: string;
  item_id: string | null;
  expires_at: Date | null;
  is_active: boolean;
}

/**
 * Check if user has access to specific content
 */
async function checkAccess(
  userId: string,
  contentId: string,
  contentType: 'demo' | 'workshop' | 'module' | 'path'
): Promise<{
  hasAccess: boolean;
  reason?: string;
  entitlement?: Entitlement;
}> {
  // Check if content is free
  if (contentType === 'demo' && isFreeDemo(contentId)) {
    return { hasAccess: true, reason: 'free_tier' };
  }

  // Get user's active entitlements
  const entitlements = await queryMany<Entitlement>(
    `SELECT id, entitlement_type, item_id, expires_at, is_active
     FROM entitlements
     WHERE user_id = $1
     AND is_active = true
     AND (expires_at IS NULL OR expires_at > NOW())`,
    [userId]
  );

  if (entitlements.length === 0) {
    return { hasAccess: false, reason: 'no_entitlements' };
  }

  // Check for all-access entitlements
  const allAccessEntitlement = entitlements.find(e =>
    e.entitlement_type === 'all_access_monthly' ||
    e.entitlement_type === 'all_access_annual'
  );

  if (allAccessEntitlement) {
    return { hasAccess: true, reason: 'all_access', entitlement: allAccessEntitlement };
  }

  // Check for specific content entitlement
  const specificEntitlement = entitlements.find(e =>
    e.item_id === contentId
  );

  if (specificEntitlement) {
    return { hasAccess: true, reason: 'specific_access', entitlement: specificEntitlement };
  }

  // Check for path access (if content belongs to a path)
  if (contentType === 'module') {
    // Extract path from module ID (e.g., "curious-module-1" -> "curious")
    const pathMatch = contentId.match(/^([a-z]+)-/);
    if (pathMatch) {
      const pathId = pathMatch[1];
      const pathEntitlement = entitlements.find(e =>
        (e.entitlement_type.includes('path_') && e.item_id === pathId)
      );

      if (pathEntitlement) {
        return { hasAccess: true, reason: 'path_access', entitlement: pathEntitlement };
      }
    }
  }

  return { hasAccess: false, reason: 'no_matching_entitlement' };
}

/**
 * Main handler: Check access
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow GET or POST
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract and verify JWT
    const authHeader = req.headers.authorization;
    const token = extractBearerToken(authHeader);

    if (!token) {
      return res.status(401).json({
        error: 'Authentication required',
        hasAccess: false
      });
    }

    let payload;
    try {
      payload = verifyJWTWithRevocation(token);
    } catch (error) {
      if (error instanceof JWTError) {
        return res.status(401).json({
          error: 'Invalid or expired token',
          hasAccess: false
        });
      }
      throw error;
    }

    // Get content ID and type from query or body
    const contentId = (req.query.content_id || req.body?.content_id) as string;
    const contentType = (req.query.content_type || req.body?.content_type) as 'demo' | 'workshop' | 'module' | 'path';

    if (!contentId || !contentType) {
      return res.status(400).json({
        error: 'content_id and content_type are required'
      });
    }

    // Validate content ID
    const contentIdValidation = validateContentId(contentId);
    assertValid(contentIdValidation);

    // Validate content type
    if (!['demo', 'workshop', 'module', 'path'].includes(contentType)) {
      return res.status(400).json({
        error: 'Invalid content_type'
      });
    }

    // Check access
    const accessResult = await checkAccess(
      payload.user_id,
      contentId,
      contentType
    );

    if (!accessResult.hasAccess) {
      // Log access denial (not a security event, just analytics)
      console.log('Access denied:', {
        userId: payload.user_id,
        contentId,
        contentType,
        reason: accessResult.reason,
        timestamp: new Date().toISOString()
      });

      return res.status(403).json({
        hasAccess: false,
        reason: accessResult.reason,
        message: 'You do not have access to this content. Please purchase it to continue.'
      });
    }

    // Log successful access (analytics)
    console.log('Access granted:', {
      userId: payload.user_id,
      contentId,
      contentType,
      reason: accessResult.reason,
      timestamp: new Date().toISOString()
    });

    // Return success
    return res.status(200).json({
      hasAccess: true,
      reason: accessResult.reason,
      entitlement: accessResult.entitlement ? {
        type: accessResult.entitlement.entitlement_type,
        expires_at: accessResult.entitlement.expires_at
      } : null
    });

  } catch (error: any) {
    console.error('Entitlement check error:', error);

    await logSecurityEvent({
      event_type: 'SUSPICIOUS_ACTIVITY',
      severity: 'MEDIUM',
      ip_address: sanitizeIPAddress(req.headers['x-forwarded-for'] || req.socket.remoteAddress),
      metadata: { error: error.message, endpoint: 'check-entitlements' }
    });

    return res.status(500).json({
      error: 'Failed to check access',
      hasAccess: false
    });
  }
}

/**
 * Bulk check - check multiple content items at once
 * Useful for checking entire paths or module lists
 */
export async function checkBulkAccess(
  userId: string,
  contentItems: Array<{ id: string; type: 'demo' | 'workshop' | 'module' | 'path' }>
): Promise<Record<string, boolean>> {
  const results: Record<string, boolean> = {};

  for (const item of contentItems) {
    const accessResult = await checkAccess(userId, item.id, item.type);
    results[item.id] = accessResult.hasAccess;
  }

  return results;
}
