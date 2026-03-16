import type { ProductConfig } from './types.js';

export const PRODUCTS: ProductConfig[] = [
  {
    productId: 'bsa-demo-single',
    displayName: 'Single Lab Pass',
    description: '48 hour access to one interactive demo',
    app: 'bsa',
    tier: 'starter',
    type: 'demo',
    priceUsd: 3,
    entitlementType: 'demo',
    entitlementKeys: ['bsa.demo.single'],
    durationHours: 48,
    features: [
      '48 hours of access',
      'Full interactivity',
      'Progress saved',
      'Mobile friendly'
    ],
    isRecurring: false,
    btcpayEnabled: true
  },
  {
    productId: 'bsa-path-monthly-curious',
    displayName: 'Curious Path Monthly',
    description: 'Monthly subscription to the Curious Path learning track',
    app: 'bsa',
    tier: 'pro',
    type: 'path_monthly',
    priceUsd: 9,
    entitlementType: 'path_monthly',
    entitlementKeys: ['bsa.paths.curious'],
    itemId: 'curious',
    features: [
      'All Curious Path modules',
      'Beginner friendly demos',
      'Progress tracking',
      'Cancel anytime'
    ],
    isRecurring: true,
    stripePriceId: '',
    btcpayEnabled: false
  },
  {
    productId: 'fsa-pro-monthly',
    displayName: 'FSA Pro',
    description: 'Monthly access to premium Financially Sovereign Academy tools and modules',
    app: 'fsa',
    tier: 'pro',
    type: 'all_access_monthly',
    priceUsd: 9,
    entitlementType: 'fsa_all_access',
    entitlementKeys: ['fsa.modules.pro', 'fsa.tools.pro'],
    features: [
      'Premium modules',
      'Premium tools',
      'Progress tracking',
      'Cancel anytime'
    ],
    isRecurring: true,
    stripePriceId: '',
    btcpayEnabled: false
  },
  {
    productId: 'institutional-advisor',
    displayName: 'Institutional Advisor Program',
    description: 'Access to the wealth advisor institutional program',
    app: 'institutional',
    tier: 'advisor',
    type: 'institutional_program',
    priceUsd: 0,
    entitlementType: 'institutional_program',
    entitlementKeys: ['institutional.advisor.program'],
    features: [
      'Advisor program access',
      'Institutional materials',
      'Client education resources'
    ],
    isRecurring: false,
    btcpayEnabled: false
  }
];
