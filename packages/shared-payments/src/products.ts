import type { ProductConfig } from './types.js';

export const PRODUCTS: ProductConfig[] = [
  {
    productId: 'bsa-pro-monthly',
    displayName: 'BSA Pro',
    app: 'bsa',
    tier: 'pro',
    entitlementKeys: ['bsa.paths.pro', 'bsa.tools.pro']
  },
  {
    productId: 'fsa-pro-monthly',
    displayName: 'FSA Pro',
    app: 'fsa',
    tier: 'pro',
    entitlementKeys: ['fsa.modules.pro', 'fsa.tools.pro']
  },
  {
    productId: 'institutional-advisor',
    displayName: 'Institutional Advisor Program',
    app: 'institutional',
    tier: 'advisor',
    entitlementKeys: ['institutional.advisor.program']
  }
];
