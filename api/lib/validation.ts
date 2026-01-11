/**
 * Input Validation Utilities
 * 
 * Security: Zero Trust - validate everything, trust nothing
 */

import { isValidProductId } from '../config/products';

/**
 * Disposable email domains to block
 * Add more as needed
 */
const DISPOSABLE_EMAIL_DOMAINS = [
  'tempmail.com',
  '10minutemail.com',
  'guerrillamail.com',
  'mailinator.com',
  'throwaway.email',
  'temp-mail.org',
  'yopmail.com'
];

/**
 * Validate email address
 * Security: Strict validation + disposable email blocking
 */
export function validateEmail(email: string): {
  valid: boolean;
  error?: string;
} {
  // Type check
  if (typeof email !== 'string') {
    return { valid: false, error: 'Email must be a string' };
  }

  // Length check
  if (email.length === 0) {
    return { valid: false, error: 'Email is required' };
  }

  if (email.length > 255) {
    return { valid: false, error: 'Email too long' };
  }

  // Format validation (RFC 5322 simplified)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  // No whitespace
  if (/\s/.test(email)) {
    return { valid: false, error: 'Email cannot contain whitespace' };
  }

  // Check disposable email
  const domain = email.split('@')[1]?.toLowerCase();
  if (DISPOSABLE_EMAIL_DOMAINS.includes(domain)) {
    return { valid: false, error: 'Disposable email addresses are not allowed' };
  }

  return { valid: true };
}

/**
 * Validate product ID
 * Security: Whitelist only - prevents injection attacks
 */
export function validateProductId(productId: unknown): {
  valid: boolean;
  error?: string;
} {
  if (typeof productId !== 'string') {
    return { valid: false, error: 'Product ID must be a string' };
  }

  if (productId.length === 0) {
    return { valid: false, error: 'Product ID is required' };
  }

  if (!isValidProductId(productId)) {
    return { valid: false, error: 'Invalid product ID' };
  }

  return { valid: true };
}

/**
 * Validate content ID (demo, module, workshop, etc.)
 * Security: Only alphanumeric, underscore, hyphen allowed
 */
export function validateContentId(contentId: unknown): {
  valid: boolean;
  error?: string;
} {
  if (typeof contentId !== 'string') {
    return { valid: false, error: 'Content ID must be a string' };
  }

  if (contentId.length === 0) {
    return { valid: false, error: 'Content ID is required' };
  }

  if (contentId.length > 100) {
    return { valid: false, error: 'Content ID too long' };
  }

  // Only allow safe characters
  if (!/^[a-z0-9_-]+$/.test(contentId)) {
    return { valid: false, error: 'Content ID contains invalid characters' };
  }

  return { valid: true };
}

/**
 * Validate UUID
 * Security: Strict format check
 */
export function validateUUID(uuid: unknown): {
  valid: boolean;
  error?: string;
} {
  if (typeof uuid !== 'string') {
    return { valid: false, error: 'UUID must be a string' };
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(uuid)) {
    return { valid: false, error: 'Invalid UUID format' };
  }

  return { valid: true };
}

/**
 * Validate amount (USD)
 * Security: Prevent negative, unreasonable, or malformed amounts
 */
export function validateAmount(amount: unknown): {
  valid: boolean;
  error?: string;
} {
  if (typeof amount !== 'number') {
    return { valid: false, error: 'Amount must be a number' };
  }

  if (!Number.isFinite(amount)) {
    return { valid: false, error: 'Amount must be finite' };
  }

  if (amount <= 0) {
    return { valid: false, error: 'Amount must be positive' };
  }

  if (amount > 10000) {
    return { valid: false, error: 'Amount too large' };
  }

  // Must have max 2 decimal places
  if ((amount * 100) % 1 !== 0) {
    return { valid: false, error: 'Amount can have max 2 decimal places' };
  }

  return { valid: true };
}

/**
 * Validate invoice ID format
 * Security: Prevent injection
 */
export function validateInvoiceId(invoiceId: unknown): {
  valid: boolean;
  error?: string;
} {
  if (typeof invoiceId !== 'string') {
    return { valid: false, error: 'Invoice ID must be a string' };
  }

  if (invoiceId.length === 0) {
    return { valid: false, error: 'Invoice ID is required' };
  }

  if (invoiceId.length > 255) {
    return { valid: false, error: 'Invoice ID too long' };
  }

  // Allow alphanumeric, underscore, hyphen only
  if (!/^[a-zA-Z0-9_-]+$/.test(invoiceId)) {
    return { valid: false, error: 'Invoice ID contains invalid characters' };
  }

  return { valid: true };
}

/**
 * Validate device fingerprint
 * Security: Basic format check
 */
export function validateDeviceFingerprint(fingerprint: unknown): {
  valid: boolean;
  error?: string;
} {
  if (typeof fingerprint !== 'string') {
    return { valid: false, error: 'Device fingerprint must be a string' };
  }

  if (fingerprint.length < 32 || fingerprint.length > 128) {
    return { valid: false, error: 'Invalid device fingerprint length' };
  }

  // Should be hex or base64
  if (!/^[a-zA-Z0-9+/=]+$/.test(fingerprint)) {
    return { valid: false, error: 'Invalid device fingerprint format' };
  }

  return { valid: true };
}

/**
 * Sanitize user agent string
 * Security: Prevent header injection
 */
export function sanitizeUserAgent(userAgent: unknown): string {
  if (typeof userAgent !== 'string') {
    return 'Unknown';
  }

  // Remove any control characters or newlines
  return userAgent.replace(/[\r\n\t]/g, '').substring(0, 500);
}

/**
 * Sanitize IP address
 * Security: Basic validation
 */
export function sanitizeIPAddress(ip: unknown): string {
  if (typeof ip !== 'string') {
    return '0.0.0.0';
  }

  // IPv4
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  // IPv6 (simplified)
  const ipv6Regex = /^([0-9a-f]{0,4}:){2,7}[0-9a-f]{0,4}$/i;

  if (ipv4Regex.test(ip) || ipv6Regex.test(ip)) {
    return ip;
  }

  return '0.0.0.0';
}

/**
 * Validate webhook signature format
 * Security: Ensure signature is hex
 */
export function validateSignature(signature: unknown): {
  valid: boolean;
  error?: string;
} {
  if (typeof signature !== 'string') {
    return { valid: false, error: 'Signature must be a string' };
  }

  if (signature.length === 0) {
    return { valid: false, error: 'Signature is required' };
  }

  // BTCPay signature format: sha256=<hex>
  if (signature.startsWith('sha256=')) {
    const hex = signature.substring(7);
    if (!/^[a-f0-9]{64}$/i.test(hex)) {
      return { valid: false, error: 'Invalid signature format' };
    }
    return { valid: true };
  }

  // Stripe signature format
  if (signature.includes('t=') && signature.includes('v1=')) {
    return { valid: true };
  }

  return { valid: false, error: 'Unknown signature format' };
}

/**
 * Validate token (magic link, session, etc.)
 * Security: Check format and length
 */
export function validateToken(token: unknown): {
  valid: boolean;
  error?: string;
} {
  if (typeof token !== 'string') {
    return { valid: false, error: 'Token must be a string' };
  }

  if (token.length < 32) {
    return { valid: false, error: 'Token too short' };
  }

  if (token.length > 512) {
    return { valid: false, error: 'Token too long' };
  }

  // Should be base64url or hex
  if (!/^[a-zA-Z0-9_-]+$/.test(token)) {
    return { valid: false, error: 'Token contains invalid characters' };
  }

  return { valid: true };
}

/**
 * Validate JSON payload
 * Security: Prevent JSON injection and size attacks
 */
export function validateJSONPayload(payload: unknown): {
  valid: boolean;
  error?: string;
  data?: any;
} {
  if (typeof payload !== 'string') {
    return { valid: false, error: 'Payload must be a string' };
  }

  // Size limit (1MB)
  if (payload.length > 1024 * 1024) {
    return { valid: false, error: 'Payload too large' };
  }

  try {
    const data = JSON.parse(payload);
    return { valid: true, data };
  } catch (error) {
    return { valid: false, error: 'Invalid JSON' };
  }
}

/**
 * Validate pagination parameters
 */
export function validatePagination(params: {
  page?: unknown;
  limit?: unknown;
}): {
  valid: boolean;
  error?: string;
  page?: number;
  limit?: number;
} {
  let page = 1;
  let limit = 50;

  if (params.page !== undefined) {
    if (typeof params.page !== 'number' || !Number.isInteger(params.page)) {
      return { valid: false, error: 'Page must be an integer' };
    }
    if (params.page < 1) {
      return { valid: false, error: 'Page must be >= 1' };
    }
    if (params.page > 10000) {
      return { valid: false, error: 'Page too large' };
    }
    page = params.page;
  }

  if (params.limit !== undefined) {
    if (typeof params.limit !== 'number' || !Number.isInteger(params.limit)) {
      return { valid: false, error: 'Limit must be an integer' };
    }
    if (params.limit < 1 || params.limit > 100) {
      return { valid: false, error: 'Limit must be between 1 and 100' };
    }
    limit = params.limit;
  }

  return { valid: true, page, limit };
}

/**
 * General purpose sanitizer for text input
 * Security: Remove dangerous characters
 */
export function sanitizeText(text: unknown, maxLength: number = 1000): string {
  if (typeof text !== 'string') {
    return '';
  }

  // Remove null bytes and control characters
  let sanitized = text.replace(/[\x00-\x1F\x7F]/g, '');

  // Trim and limit length
  sanitized = sanitized.trim().substring(0, maxLength);

  return sanitized;
}

/**
 * Validation error class
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Assert validation result or throw
 */
export function assertValid(result: { valid: boolean; error?: string }): void {
  if (!result.valid) {
    throw new ValidationError(result.error || 'Validation failed');
  }
}
