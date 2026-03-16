cat > packages/shared-payments/src/products.ts <<'EOF'
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
    productId: 'bsa-workshop-bundle',
    displayName: 'Workshop Bundle Pass',
    description: '7 day access to a workshop bundle',
    app: 'bsa',
    tier: 'starter',
    type: 'workshop',
    priceUsd: 7,
    entitlementType: 'workshop',
    entitlementKeys: ['bsa.workshop.bundle'],
    durationHours: 168,
    features: [
      '7 days of access',
      'Multiple workshops',
      'Hands on exercises',
      'Certificate of completion'
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
    productId: 'bsa-path-monthly-pragmatist',
    displayName: 'Pragmatist Path Monthly',
    description: 'Monthly subscription to the Pragmatist Path learning track',
    app: 'bsa',
    tier: 'pro',
    type: 'path_monthly',
    priceUsd: 9,
    entitlementType: 'path_monthly',
    entitlementKeys: ['bsa.paths.pragmatist'],
    itemId: 'pragmatist',
    features: [
      'All Pragmatist Path modules',
      'Practical Bitcoin skills',
      'Real world scenarios',
      'Cancel anytime'
    ],
    isRecurring: true,
    stripePriceId: '',
    btcpayEnabled: false
  },
  {
    productId: 'bsa-path-monthly-builder',
    displayName: 'Builder Path Monthly',
    description: 'Monthly subscription to the Builder Path learning track',
    app: 'bsa',
    tier: 'pro',
    type: 'path_monthly',
    priceUsd: 9,
    entitlementType: 'path_monthly',
    entitlementKeys: ['bsa.paths.builder'],
    itemId: 'builder',
    features: [
      'All Builder Path modules',
      'Lightning Network demos',
      'Wallet setup guides',
      'Cancel anytime'
    ],
    isRecurring: true,
    stripePriceId: '',
    btcpayEnabled: false
  },
  {
    productId: 'bsa-path-monthly-sovereign',
    displayName: 'Sovereign Path Monthly',
    description: 'Monthly subscription to the Sovereign Path learning track',
    app: 'bsa',
    tier: 'pro',
    type: 'path_monthly',
    priceUsd: 9,
    entitlementType: 'path_monthly',
    entitlementKeys: ['bsa.paths.sovereign'],
    itemId: 'sovereign',
    features: [
      'All Sovereign Path modules',
      'Security deep dives',
      'Cold storage mastery',
      'Cancel anytime'
    ],
    isRecurring: true,
    stripePriceId: '',
    btcpayEnabled: false
  },
  {
    productId: 'bsa-path-annual-curious',
    displayName: 'Curious Path Annual',
    description: 'Annual subscription to the Curious Path',
    app: 'bsa',
    tier: 'pro',
    type: 'path_annual',
    priceUsd: 79,
    entitlementType: 'path_annual',
    entitlementKeys: ['bsa.paths.curious'],
    itemId: 'curious',
    features: [
      'All Curious Path modules',
      'Annual access',
      'Save versus monthly'
    ],
    isRecurring: true,
    stripePriceId: '',
    btcpayEnabled: true
  },
  {
    productId: 'bsa-path-lifetime-curious',
    displayName: 'Curious Path Lifetime',
    description: 'Lifetime access to the Curious Path',
    app: 'bsa',
    tier: 'pro',
    type: 'path_lifetime',
    priceUsd: 149,
    entitlementType: 'path_lifetime',
    entitlementKeys: ['bsa.paths.curious'],
    itemId: 'curious',
    features: [
      'Lifetime access',
      'All Curious Path modules',
      'One time purchase'
    ],
    isRecurring: false,
    btcpayEnabled: true
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
EOF