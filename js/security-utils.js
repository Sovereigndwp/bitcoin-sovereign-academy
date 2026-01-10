/**
 * 🛡️ Security Utilities for Client-Side XSS Prevention
 * 
 * Provides safe HTML escaping and sanitization functions
 * to prevent XSS attacks when using innerHTML
 */

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} - Escaped HTML-safe text
 */
export function escapeHTML(text) {
    if (typeof text !== 'string') {
        return String(text);
    }
    
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Safely set innerHTML with automatic escaping
 * @param {HTMLElement} element - DOM element to update
 * @param {string} html - HTML content (will be escaped if unsafe)
 * @param {boolean} allowHTML - If true, allows HTML (use with caution)
 */
export function safeSetHTML(element, html, allowHTML = false) {
    if (!element) {
        console.warn('safeSetHTML: element is null or undefined');
        return;
    }
    
    if (allowHTML) {
        // If HTML is allowed, still sanitize dangerous scripts
        // Remove script tags and event handlers
        html = html
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
            .replace(/on\w+\s*=\s*[^\s>]*/gi, '');
        element.innerHTML = html;
    } else {
        // Default: escape all HTML
        element.textContent = html;
    }
}

/**
 * Create a safe HTML string from template with automatic escaping
 * @param {TemplateStringsArray} strings - Template literal strings
 * @param {...any} values - Values to interpolate (will be escaped)
 * @returns {string} - Safe HTML string
 */
export function safeHTML(strings, ...values) {
    return strings.reduce((result, str, i) => {
        const value = values[i] !== undefined ? escapeHTML(String(values[i])) : '';
        return result + str + value;
    }, '');
}

/**
 * Validate and sanitize URL to prevent open redirects
 * @param {string} url - URL to validate
 * @param {string} allowedOrigin - Allowed origin (default: current origin)
 * @returns {string|null} - Sanitized URL or null if invalid
 */
export function sanitizeRedirectURL(url, allowedOrigin = null) {
    if (!url || typeof url !== 'string') {
        return null;
    }
    
    try {
        // If relative URL, make it absolute
        const urlObj = url.startsWith('/') 
            ? new URL(url, window.location.origin)
            : new URL(url);
        
        // Get allowed origin
        const origin = allowedOrigin || window.location.origin;
        const allowedUrl = new URL(origin);
        
        // Only allow same-origin redirects
        if (urlObj.origin !== allowedUrl.origin) {
            console.warn('sanitizeRedirectURL: Blocked cross-origin redirect', url);
            return null;
        }
        
        // Return the safe URL
        return urlObj.href;
    } catch (error) {
        console.warn('sanitizeRedirectURL: Invalid URL', url, error);
        return null;
    }
}

/**
 * Sanitize error messages before displaying
 * @param {Error|string} error - Error object or message
 * @returns {string} - Sanitized error message
 */
export function sanitizeErrorMessage(error) {
    if (!error) {
        return 'An unknown error occurred';
    }
    
    const message = error instanceof Error ? error.message : String(error);
    
    // Escape HTML and limit length to prevent XSS
    const sanitized = escapeHTML(message);
    
    // Limit length to prevent DoS
    return sanitized.length > 500 ? sanitized.substring(0, 500) + '...' : sanitized;
}

/**
 * Validate and sanitize URL parameter value
 * @param {string} value - URL parameter value
 * @param {Object} options - Validation options
 * @param {number} options.maxLength - Maximum length (default: 500)
 * @param {RegExp} options.pattern - Allowed pattern (optional)
 * @param {string[]} options.whitelist - Allowed values (optional)
 * @returns {string|null} - Sanitized value or null if invalid
 */
export function sanitizeURLParam(value, options = {}) {
    if (!value || typeof value !== 'string') {
        return null;
    }
    
    const {
        maxLength = 500,
        pattern = null,
        whitelist = null
    } = options;
    
    // Trim and decode
    let sanitized = decodeURIComponent(value).trim();
    
    // Check length
    if (sanitized.length > maxLength) {
        console.warn('sanitizeURLParam: Value too long', sanitized.length);
        return null;
    }
    
    // Check whitelist if provided
    if (whitelist && !whitelist.includes(sanitized)) {
        console.warn('sanitizeURLParam: Value not in whitelist', sanitized);
        return null;
    }
    
    // Check pattern if provided
    if (pattern && !pattern.test(sanitized)) {
        console.warn('sanitizeURLParam: Value does not match pattern', sanitized);
        return null;
    }
    
    // Remove dangerous characters
    sanitized = sanitized.replace(/[<>'"&]/g, '');
    
    return sanitized;
}

/**
 * Get and validate URL parameter with whitelist
 * @param {string} paramName - Parameter name
 * @param {Object} options - Validation options
 * @returns {string|null} - Sanitized parameter value or null
 */
export function getSafeURLParam(paramName, options = {}) {
    if (!paramName || typeof paramName !== 'string') {
        return null;
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const value = urlParams.get(paramName);
    
    if (!value) {
        return null;
    }
    
    return sanitizeURLParam(value, options);
}

/**
 * Validate JWT token from URL parameter
 * @param {string} token - JWT token string
 * @returns {boolean} - True if token format is valid
 */
export function isValidJWTFormat(token) {
    if (!token || typeof token !== 'string') {
        return false;
    }
    
    // Check length
    if (token.length < 20 || token.length > 2000) {
        return false;
    }
    
    // Check JWT structure (3 parts separated by dots)
    const parts = token.split('.');
    if (parts.length !== 3) {
        return false;
    }
    
    // Each part should have content
    return parts.every(part => part.length > 0);
}

/**
 * Validate product ID from URL parameter
 * @param {string} productId - Product ID
 * @returns {boolean} - True if product ID is valid
 */
export function isValidProductId(productId) {
    if (!productId || typeof productId !== 'string') {
        return false;
    }
    
    // Whitelist of valid product IDs
    const validProducts = [
        'curious',
        'builder',
        'sovereign',
        'principled',
        'all-paths',
        'full-academy'
    ];
    
    return validProducts.includes(productId);
}

/**
 * Validate order ID format
 * @param {string} orderId - Order ID
 * @returns {boolean} - True if order ID format is valid
 */
export function isValidOrderId(orderId) {
    if (!orderId || typeof orderId !== 'string') {
        return false;
    }
    
    // Order IDs should be alphanumeric with dashes/underscores, max 100 chars
    return /^[a-zA-Z0-9_-]{1,100}$/.test(orderId);
}

// Make functions available globally for non-module scripts
if (typeof window !== 'undefined') {
    window.BSASecurity = {
        escapeHTML,
        safeSetHTML,
        safeHTML,
        sanitizeRedirectURL,
        sanitizeErrorMessage,
        sanitizeURLParam,
        getSafeURLParam,
        isValidJWTFormat,
        isValidProductId,
        isValidOrderId
    };
}
