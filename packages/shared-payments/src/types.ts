import type { AppId, AccessTier } from '../../shared-access/src/types.js';

export interface ProductConfig {
  productId: string;
  displayName: string;
  app: AppId;
  tier: AccessTier;
  entitlementKeys: string[];
}
