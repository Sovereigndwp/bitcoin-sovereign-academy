import { CartItem, PricingRequest, PricingResponse, Module, Path } from './types';

/**
 * Product catalog for Bitcoin Sovereign Academy
 * This should ideally be stored in a database or CMS
 */
export const CATALOG = {
  paths: {
    curious: {
      id: 'curious',
      name: 'Curious Path',
      bundlePriceUSD: 19,
      modules: [
        { id: 'curious-s1m1', title: 'What is Money?', path: 'curious', stage: 1, priceUSD: 9 },
        { id: 'curious-s1m2', title: 'History of Money', path: 'curious', stage: 1, priceUSD: 9 },
        { id: 'curious-s2m1', title: 'Bitcoin Basics', path: 'curious', stage: 2, priceUSD: 9 },
        // Add more modules as needed
      ],
    },
    builder: {
      id: 'builder',
      name: 'Builder Path',
      bundlePriceUSD: 39,
      modules: [
        { id: 'builder-s1m1', title: 'Setting Up a Wallet', path: 'builder', stage: 1, priceUSD: 12 },
        { id: 'builder-s1m2', title: 'Running a Node', path: 'builder', stage: 1, priceUSD: 12 },
        // Add more modules as needed
      ],
    },
    sovereign: {
      id: 'sovereign',
      name: 'Sovereign Path',
      bundlePriceUSD: 79,
      modules: [
        { id: 'sovereign-s1m1', title: 'Advanced Security', path: 'sovereign', stage: 1, priceUSD: 25 },
        { id: 'sovereign-s1m2', title: 'Multi-sig Custody', path: 'sovereign', stage: 1, priceUSD: 25 },
        // Add more modules as needed
      ],
    },
    principled: {
      id: 'principled',
      name: 'Principled Path',
      bundlePriceUSD: 29,
      modules: [
        { id: 'principled-s1m1', title: 'Money Ethics', path: 'principled', stage: 1, priceUSD: 10 },
        { id: 'principled-s1m2', title: 'Austrian Economics', path: 'principled', stage: 1, priceUSD: 10 },
        // Add more modules as needed
      ],
    },
  },
  bundles: {
    'all-paths': {
      id: 'all-paths',
      name: 'Complete Academy Bundle',
      priceUSD: 149,
      savings: 37,
    },
  },
};

/**
 * Calculate pricing with volume discounts
 */
export function calculatePricing(request: PricingRequest): PricingResponse {
  let subtotal = 0;
  let discount = 0;

  // Calculate subtotal
  for (const item of request.items) {
    subtotal += item.priceUSD;
  }

  // Apply bundle discount if purchasing entire path
  const pathPurchases = new Map<string, CartItem[]>();
  for (const item of request.items) {
    if (item.type === 'module') {
      const pathId = item.id.split('-')[0]; // Extract path from module ID
      if (!pathPurchases.has(pathId)) {
        pathPurchases.set(pathId, []);
      }
      pathPurchases.get(pathId)!.push(item);
    }
  }

  // Check if user is buying all modules in a path (suggest bundle instead)
  for (const [pathId, modules] of Array.from(pathPurchases.entries())) {
    const path = CATALOG.paths[pathId as keyof typeof CATALOG.paths];
    if (path && modules.length === path.modules.length) {
      const moduleTotal = modules.reduce((sum, m) => sum + m.priceUSD, 0);
      const bundleSavings = moduleTotal - path.bundlePriceUSD;
      if (bundleSavings > 0) {
        discount += bundleSavings;
      }
    }
  }

  // Apply volume discount (10% off if buying 5+ modules)
  const moduleCount = request.items.filter((i) => i.type === 'module').length;
  if (moduleCount >= 5) {
    const volumeDiscount = subtotal * 0.1;
    discount = Math.max(discount, volumeDiscount);
  }

  const total = subtotal - discount;

  return {
    items: request.items,
    subtotal: Math.round(subtotal * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    total: Math.round(total * 100) / 100,
    currency: 'USD',
  };
}

/**
 * Find a module by ID
 */
export function findModule(moduleId: string): Module | null {
  for (const path of Object.values(CATALOG.paths)) {
    const module = path.modules.find((m) => m.id === moduleId);
    if (module) return module;
  }
  return null;
}

/**
 * Find a path by ID
 */
export function findPath(pathId: string): Path | null {
  const path = CATALOG.paths[pathId as keyof typeof CATALOG.paths];
  return path || null;
}

/**
 * Validate cart items against catalog
 */
export function validateCartItems(items: CartItem[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const item of items) {
    if (item.type === 'module') {
      const module = findModule(item.id);
      if (!module) {
        errors.push(`Module not found: ${item.id}`);
      } else if (module.priceUSD !== item.priceUSD) {
        errors.push(`Price mismatch for module ${item.id}`);
      }
    } else if (item.type === 'path') {
      const path = findPath(item.id);
      if (!path) {
        errors.push(`Path not found: ${item.id}`);
      } else if (path.bundlePriceUSD !== item.priceUSD) {
        errors.push(`Price mismatch for path ${item.id}`);
      }
    } else if (item.type === 'bundle') {
      const bundle = CATALOG.bundles[item.id as keyof typeof CATALOG.bundles];
      if (!bundle) {
        errors.push(`Bundle not found: ${item.id}`);
      } else if (bundle.priceUSD !== item.priceUSD) {
        errors.push(`Price mismatch for bundle ${item.id}`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
