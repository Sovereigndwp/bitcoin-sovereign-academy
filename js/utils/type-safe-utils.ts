/**
 * Type-safe utility functions for common operations
 * Helps prevent runtime errors by handling edge cases
 */

export function safeAccess<T, K extends keyof T>(obj: T | null | undefined, key: K, fallback: T[K]): T[K] {
  return obj && typeof obj === 'object' && key in obj ? obj[key] : fallback;
}

export function isValidDate(date: string | undefined): boolean {
  if (!date) return false;
  const parsed = new Date(date);
  return !isNaN(parsed.getTime());
}

export function safeParseDate(dateString: string | undefined): Date {
  if (!dateString) return new Date();
  const parsed = new Date(dateString);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
}

export function safeDateFormat(dateString: string | undefined): string {
  return safeParseDate(dateString).toLocaleDateString();
}

export function hasProperty<T, K extends string>(
  obj: T,
  prop: K
): obj is T & Record<K, unknown> {
  return obj !== null && typeof obj === 'object' && prop in obj;
}

export function safeNumberAccess(obj: any, path: string, fallback: number = 0): number {
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (!current || typeof current !== 'object' || !(key in current)) {
      return fallback;
    }
    current = current[key];
  }
  
  return typeof current === 'number' && !isNaN(current) ? current : fallback;
}

export function safeStringAccess(obj: any, path: string, fallback: string = ''): string {
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (!current || typeof current !== 'object' || !(key in current)) {
      return fallback;
    }
    current = current[key];
  }
  
  return typeof current === 'string' ? current : fallback;
}

export function safeArrayAccess<T>(obj: any, path: string, fallback: T[] = []): T[] {
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (!current || typeof current !== 'object' || !(key in current)) {
      return fallback;
    }
    current = current[key];
  }
  
  return Array.isArray(current) ? current : fallback;
}

// Bitcoin-specific utilities
export interface SafeBitcoinData {
  price: number;
  change24h?: number;
  volume24h?: number;
  marketCap?: number;
  timestamp: number;
}

export function safeBitcoinDataAccess(data: any): SafeBitcoinData {
  return {
    price: safeNumberAccess(data, 'price', 0),
    change24h: data.change24h ? safeNumberAccess(data, 'change24h') : undefined,
    volume24h: data.volume24h ? safeNumberAccess(data, 'volume24h') : undefined,
    marketCap: data.marketCap ? safeNumberAccess(data, 'marketCap') : undefined,
    timestamp: safeNumberAccess(data, 'timestamp', Date.now())
  };
}

export interface SafeFeeData {
  fast: number;
  medium: number;
  slow: number;
  timestamp: number;
}

export function safeFeeDataAccess(data: any): SafeFeeData {
  return {
    fast: safeNumberAccess(data, 'fast') || safeNumberAccess(data, 'fastestFee', 10),
    medium: safeNumberAccess(data, 'medium') || safeNumberAccess(data, 'halfHourFee', 5),
    slow: safeNumberAccess(data, 'slow') || safeNumberAccess(data, 'economyFee', 2),
    timestamp: safeNumberAccess(data, 'timestamp', Date.now())
  };
}

// News and content utilities
export interface SafeNewsItem {
  title: string;
  link: string;
  pubDate: string;
  content?: string;
}

export function safeNewsItemAccess(item: any): SafeNewsItem {
  return {
    title: safeStringAccess(item, 'title', 'No title'),
    link: safeStringAccess(item, 'link', '#'),
    pubDate: item.pubDate || new Date().toISOString(),
    content: item.content ? safeStringAccess(item, 'content') : undefined
  };
}

export function safeNewsArrayAccess(data: any): SafeNewsItem[] {
  const items = Array.isArray(data) ? data : safeArrayAccess(data, 'items', []);
  return items.map(safeNewsItemAccess);
}
