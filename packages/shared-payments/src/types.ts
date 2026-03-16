export type AppId = 'bsa' | 'fsa' | 'institutional';

export type AccessTier =
  | 'free'
  | 'starter'
  | 'pro'
  | 'advisor'
  | 'school'
  | 'enterprise';

export type ProductType =
  | 'demo'
  | 'workshop'
  | 'path_monthly'
  | 'path_annual'
  | 'path_lifetime'
  | 'all_access_monthly'
  | 'all_access_annual'
  | 'institutional_program'
  | 'toolkit'
  | 'course'
  | 'bundle';

export interface ProductConfig {
  productId: string;
  displayName: string;
  description: string;
  app: AppId;
  tier: AccessTier;
  type: ProductType;
  priceUsd: number;
  entitlementType: string;
  entitlementKeys: string[];
  itemId?: string;
  durationHours?: number;
  features: string[];
  isRecurring: boolean;
  stripePriceId?: string;
  btcpayEnabled: boolean;
}
