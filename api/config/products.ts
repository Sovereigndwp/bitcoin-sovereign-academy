/**
 * Product Catalog - Single Source of Truth for Pricing
 * 
 * Security: All prices are defined here and NEVER trusted from client
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  price_usd: number;
  type: 'demo' | 'workshop' | 'path_monthly' | 'path_annual' | 'path_lifetime' | 'all_access_monthly' | 'all_access_annual';
  duration_hours?: number; // For time-limited access
  entitlement_type: string;
  item_id?: string; // Specific item this unlocks (null for all-access)
  features: string[];
  is_recurring: boolean;
  stripe_price_id?: string; // Set after creating in Stripe
  btcpay_enabled: boolean;
}

/**
 * Product Catalog
 * WARNING: Changing prices here affects what users are charged
 * Always deploy price changes carefully and test thoroughly
 */
export const PRODUCTS: Record<string, Product> = {
  // ==================== MICRO UNLOCKS ====================
  
  demo_single: {
    id: 'demo_single',
    name: 'Single Lab Pass',
    description: '48-hour access to one interactive demo',
    price_usd: 3.00,
    type: 'demo',
    duration_hours: 48,
    entitlement_type: 'demo',
    // item_id set dynamically based on which demo
    features: [
      '48 hours of access',
      'Full interactivity',
      'Progress saved',
      'Mobile friendly'
    ],
    is_recurring: false,
    btcpay_enabled: true
  },
  
  workshop_bundle: {
    id: 'workshop_bundle',
    name: 'Workshop Bundle Pass',
    description: '7-day access to a workshop bundle (Wallet Workshop + Security Dojo)',
    price_usd: 7.00,
    type: 'workshop',
    duration_hours: 168, // 7 days
    entitlement_type: 'workshop',
    // item_id set dynamically based on which workshop
    features: [
      '7 days of access',
      'Multiple workshops',
      'Hands-on exercises',
      'Certificate of completion'
    ],
    is_recurring: false,
    btcpay_enabled: true
  },

  // ==================== PATH ACCESS ====================

  path_monthly_curious: {
    id: 'path_monthly_curious',
    name: 'Curious Path Monthly',
    description: 'Monthly subscription to the Curious Path learning track',
    price_usd: 9.00,
    type: 'path_monthly',
    entitlement_type: 'path_monthly',
    item_id: 'curious',
    features: [
      'All Curious Path modules',
      'Beginner-friendly demos',
      'Hash puzzles & games',
      'Money history lessons',
      'Progress tracking',
      'Cancel anytime'
    ],
    is_recurring: true,
    btcpay_enabled: false, // Subscriptions require Stripe
    stripe_price_id: '' // Set this after creating in Stripe
  },

  path_monthly_pragmatist: {
    id: 'path_monthly_pragmatist',
    name: 'Pragmatist Path Monthly',
    description: 'Monthly subscription to the Pragmatist Path learning track',
    price_usd: 9.00,
    type: 'path_monthly',
    entitlement_type: 'path_monthly',
    item_id: 'pragmatist',
    features: [
      'All Pragmatist Path modules',
      'Practical Bitcoin skills',
      'Real-world scenarios',
      'Problem-solving focus',
      'Progress tracking',
      'Cancel anytime'
    ],
    is_recurring: true,
    btcpay_enabled: false,
    stripe_price_id: ''
  },

  path_monthly_builder: {
    id: 'path_monthly_builder',
    name: 'Builder Path Monthly',
    description: 'Monthly subscription to the Builder Path learning track',
    price_usd: 9.00,
    type: 'path_monthly',
    entitlement_type: 'path_monthly',
    item_id: 'builder',
    features: [
      'All Builder Path modules',
      'Lightning Network demos',
      'Wallet setup guides',
      'Node operation basics',
      'UTXO visualizer',
      'Cancel anytime'
    ],
    is_recurring: true,
    btcpay_enabled: false,
    stripe_price_id: ''
  },

  path_monthly_sovereign: {
    id: 'path_monthly_sovereign',
    name: 'Sovereign Path Monthly',
    description: 'Monthly subscription to the Sovereign Path learning track',
    price_usd: 9.00,
    type: 'path_monthly',
    entitlement_type: 'path_monthly',
    item_id: 'sovereign',
    features: [
      'All Sovereign Path modules',
      'Security deep dives',
      'Multi-sig setup wizard',
      'Privacy techniques',
      'Cold storage mastery',
      'Cancel anytime'
    ],
    is_recurring: true,
    btcpay_enabled: false,
    stripe_price_id: ''
  },

  path_annual_curious: {
    id: 'path_annual_curious',
    name: 'Curious Path Annual',
    description: 'Annual subscription to the Curious Path (save $29)',
    price_usd: 79.00,
    type: 'path_annual',
    entitlement_type: 'path_annual',
    item_id: 'curious',
    features: [
      'All Curious Path modules',
      'Save $29 vs monthly',
      '2 months free',
      'All monthly features',
      'Priority support'
    ],
    is_recurring: true,
    btcpay_enabled: true,
    stripe_price_id: ''
  },

  path_annual_pragmatist: {
    id: 'path_annual_pragmatist',
    name: 'Pragmatist Path Annual',
    description: 'Annual subscription to the Pragmatist Path (save $29)',
    price_usd: 79.00,
    type: 'path_annual',
    entitlement_type: 'path_annual',
    item_id: 'pragmatist',
    features: [
      'All Pragmatist Path modules',
      'Save $29 vs monthly',
      '2 months free',
      'All monthly features',
      'Priority support'
    ],
    is_recurring: true,
    btcpay_enabled: true,
    stripe_price_id: ''
  },

  path_annual_builder: {
    id: 'path_annual_builder',
    name: 'Builder Path Annual',
    description: 'Annual subscription to the Builder Path (save $29)',
    price_usd: 79.00,
    type: 'path_annual',
    entitlement_type: 'path_annual',
    item_id: 'builder',
    features: [
      'All Builder Path modules',
      'Save $29 vs monthly',
      '2 months free',
      'All monthly features',
      'Priority support'
    ],
    is_recurring: true,
    btcpay_enabled: true,
    stripe_price_id: ''
  },

  path_annual_sovereign: {
    id: 'path_annual_sovereign',
    name: 'Sovereign Path Annual',
    description: 'Annual subscription to the Sovereign Path (save $29)',
    price_usd: 79.00,
    type: 'path_annual',
    entitlement_type: 'path_annual',
    item_id: 'sovereign',
    features: [
      'All Sovereign Path modules',
      'Save $29 vs monthly',
      '2 months free',
      'All monthly features',
      'Priority support'
    ],
    is_recurring: true,
    btcpay_enabled: true,
    stripe_price_id: ''
  },

  path_lifetime_curious: {
    id: 'path_lifetime_curious',
    name: 'Curious Path Lifetime',
    description: 'Lifetime access to the Curious Path',
    price_usd: 149.00,
    type: 'path_lifetime',
    entitlement_type: 'path_lifetime',
    item_id: 'curious',
    features: [
      'Lifetime access',
      'All Curious Path modules',
      'All future updates',
      'One-time payment',
      'Priority support'
    ],
    is_recurring: false,
    btcpay_enabled: true
  },

  path_lifetime_pragmatist: {
    id: 'path_lifetime_pragmatist',
    name: 'Pragmatist Path Lifetime',
    description: 'Lifetime access to the Pragmatist Path',
    price_usd: 149.00,
    type: 'path_lifetime',
    entitlement_type: 'path_lifetime',
    item_id: 'pragmatist',
    features: [
      'Lifetime access',
      'All Pragmatist Path modules',
      'All future updates',
      'One-time payment',
      'Priority support'
    ],
    is_recurring: false,
    btcpay_enabled: true
  },

  path_lifetime_builder: {
    id: 'path_lifetime_builder',
    name: 'Builder Path Lifetime',
    description: 'Lifetime access to the Builder Path',
    price_usd: 149.00,
    type: 'path_lifetime',
    entitlement_type: 'path_lifetime',
    item_id: 'builder',
    features: [
      'Lifetime access',
      'All Builder Path modules',
      'All future updates',
      'One-time payment',
      'Priority support'
    ],
    is_recurring: false,
    btcpay_enabled: true
  },

  path_lifetime_sovereign: {
    id: 'path_lifetime_sovereign',
    name: 'Sovereign Path Lifetime',
    description: 'Lifetime access to the Sovereign Path',
    price_usd: 149.00,
    type: 'path_lifetime',
    entitlement_type: 'path_lifetime',
    item_id: 'sovereign',
    features: [
      'Lifetime access',
      'All Sovereign Path modules',
      'All future updates',
      'One-time payment',
      'Priority support'
    ],
    is_recurring: false,
    btcpay_enabled: true
  },

  // ==================== ALL ACCESS ====================

  all_access_monthly: {
    id: 'all_access_monthly',
    name: 'All Access Monthly',
    description: 'Monthly access to everything',
    price_usd: 19.00,
    type: 'all_access_monthly',
    entitlement_type: 'all_access_monthly',
    item_id: null, // null = all content
    features: [
      'Unlock everything',
      'All 4 learning paths',
      '35+ interactive demos',
      'All workshops',
      'Future content included',
      'Cancel anytime'
    ],
    is_recurring: true,
    btcpay_enabled: false,
    stripe_price_id: ''
  },

  all_access_annual: {
    id: 'all_access_annual',
    name: 'All Access Annual',
    description: 'Annual access to everything (best value)',
    price_usd: 149.00,
    type: 'all_access_annual',
    entitlement_type: 'all_access_annual',
    item_id: null,
    features: [
      'Unlock everything',
      'All 4 learning paths',
      '35+ interactive demos',
      'All workshops',
      'Save $79 vs monthly',
      'Future content included',
      'Priority support'
    ],
    is_recurring: true,
    btcpay_enabled: true,
    stripe_price_id: ''
  }
};

/**
 * Get product by ID
 * @throws Error if product doesn't exist (security: fail secure)
 */
export function getProduct(productId: string): Product {
  const product = PRODUCTS[productId];
  if (!product) {
    throw new Error(`Invalid product ID: ${productId}`);
  }
  return product;
}

/**
 * Validate product ID (whitelist approach)
 */
export function isValidProductId(productId: string): boolean {
  return productId in PRODUCTS;
}

/**
 * Get price for a product (server-side source of truth)
 */
export function getPrice(productId: string): number {
  return getProduct(productId).price_usd;
}

/**
 * Check if product supports BTCPay
 */
export function supportsBTCPay(productId: string): boolean {
  return getProduct(productId).btcpay_enabled;
}

/**
 * Check if product is recurring
 */
export function isRecurring(productId: string): boolean {
  return getProduct(productId).is_recurring;
}

/**
 * Get all products by type
 */
export function getProductsByType(type: Product['type']): Product[] {
  return Object.values(PRODUCTS).filter(p => p.type === type);
}

/**
 * Calculate expiration date for time-limited products
 */
export function calculateExpiration(productId: string): Date | null {
  const product = getProduct(productId);
  
  if (!product.duration_hours) {
    return null; // Lifetime or subscription
  }
  
  const now = new Date();
  return new Date(now.getTime() + product.duration_hours * 60 * 60 * 1000);
}

/**
 * Free tier demo IDs (hardcoded whitelist)
 */
export const FREE_DEMOS = [
  'bitcoin-basics',
  'hash-puzzle',
  'double-spending',
  'wallet-types',
  'transaction-simulator',
  'key-generator'
];

/**
 * Check if demo is free
 */
export function isFreeDemo(demoId: string): boolean {
  return FREE_DEMOS.includes(demoId);
}
