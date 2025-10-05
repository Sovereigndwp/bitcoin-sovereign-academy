/**
 * Type-safe utility functions for common operations
 * Helps prevent runtime errors by handling edge cases
 */
export function safeAccess(obj, key, fallback) {
    return obj && typeof obj === 'object' && key in obj ? obj[key] : fallback;
}
export function isValidDate(date) {
    if (!date)
        return false;
    const parsed = new Date(date);
    return !isNaN(parsed.getTime());
}
export function safeParseDate(dateString) {
    if (!dateString)
        return new Date();
    const parsed = new Date(dateString);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
}
export function safeDateFormat(dateString) {
    return safeParseDate(dateString).toLocaleDateString();
}
export function hasProperty(obj, prop) {
    return obj !== null && typeof obj === 'object' && prop in obj;
}
export function safeNumberAccess(obj, path, fallback = 0) {
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
export function safeStringAccess(obj, path, fallback = '') {
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
export function safeArrayAccess(obj, path, fallback = []) {
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
export function safeBitcoinDataAccess(data) {
    return {
        price: safeNumberAccess(data, 'price', 0),
        change24h: data.change24h ? safeNumberAccess(data, 'change24h') : undefined,
        volume24h: data.volume24h ? safeNumberAccess(data, 'volume24h') : undefined,
        marketCap: data.marketCap ? safeNumberAccess(data, 'marketCap') : undefined,
        timestamp: safeNumberAccess(data, 'timestamp', Date.now())
    };
}
export function safeFeeDataAccess(data) {
    return {
        fast: safeNumberAccess(data, 'fast') || safeNumberAccess(data, 'fastestFee', 10),
        medium: safeNumberAccess(data, 'medium') || safeNumberAccess(data, 'halfHourFee', 5),
        slow: safeNumberAccess(data, 'slow') || safeNumberAccess(data, 'economyFee', 2),
        timestamp: safeNumberAccess(data, 'timestamp', Date.now())
    };
}
export function safeNewsItemAccess(item) {
    return {
        title: safeStringAccess(item, 'title', 'No title'),
        link: safeStringAccess(item, 'link', '#'),
        pubDate: item.pubDate || new Date().toISOString(),
        content: item.content ? safeStringAccess(item, 'content') : undefined
    };
}
export function safeNewsArrayAccess(data) {
    const items = Array.isArray(data) ? data : safeArrayAccess(data, 'items', []);
    return items.map(safeNewsItemAccess);
}
