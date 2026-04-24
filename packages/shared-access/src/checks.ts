import type { AccessTier, UserAccessContext } from './types.js';

export function hasTierAccess(
  ctx: UserAccessContext,
  requiredTier: AccessTier
): boolean {
  return ctx.activeTiers.includes(requiredTier);
}

export function hasEntitlement(
  ctx: UserAccessContext,
  entitlementKey: string
): boolean {
  return ctx.entitlementKeys.includes(entitlementKey);
}
