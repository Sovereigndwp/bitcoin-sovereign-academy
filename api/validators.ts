/**
 * 🛡️ VALIDATORS - The ID Checkers at Your Door
 *
 * Think of these like bouncers at a club - they check if the data
 * coming in is safe before letting it into your website!
 */

// Check if an email address looks real
export function isValidEmail(email: string): boolean {
  // Remove extra spaces
  email = email.trim();

  // Too short or too long? No way!
  if (email.length < 3 || email.length > 254) {
    return false;
  }

  // Must have exactly one @ symbol and a dot after it
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

// Make an email safe to use (lowercase, no spaces)
export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

// Check if a string is too long (prevents memory attacks)
export function isValidLength(text: string, maxLength: number): boolean {
  return text.length <= maxLength;
}

// Check if a number is actually a number and in a safe range
export function isValidNumber(value: any, min?: number, max?: number): boolean {
  const num = Number(value);

  // Is it actually a number?
  if (isNaN(num) || !isFinite(num)) {
    return false;
  }

  // Check if it's in the allowed range
  if (min !== undefined && num < min) {
    return false;
  }
  if (max !== undefined && num > max) {
    return false;
  }

  return true;
}

// Check if a string only has letters and numbers (alphanumeric)
export function isAlphanumeric(text: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(text);
}

// Check if a URL is safe to use
export function isValidURL(url: string): boolean {
  try {
    const parsed = new URL(url);
    // Only allow https (secure) or http (for local testing)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

// Remove dangerous characters from text (like <script> tags)
export function sanitizeText(text: string): string {
  return text
    .replace(/[<>]/g, '') // Remove < and > to stop HTML injection
    .replace(/['"]/g, '')  // Remove quotes to stop SQL injection
    .trim();
}

// Check if a JWT token looks correct
export function isValidJWT(token: string): boolean {
  // JWT tokens have 3 parts separated by dots
  const parts = token.split('.');
  if (parts.length !== 3) {
    return false;
  }

  // Each part should have content
  return parts.every(part => part.length > 0);
}

// Validate Stripe session ID format
export function isValidStripeSessionId(sessionId: string): boolean {
  // Stripe session IDs start with "cs_" and have specific length
  return sessionId.startsWith('cs_') && sessionId.length > 10;
}

// Validate Bitcoin address (basic check)
export function isValidBitcoinAddress(address: string): boolean {
  // Bitcoin addresses are 26-35 characters of letters and numbers
  return /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address) || // Legacy
         /^bc1[a-z0-9]{39,59}$/.test(address); // Bech32
}

/**
 * 🚨 MAIN VALIDATION FUNCTION
 * Use this at the start of every API endpoint!
 */
export function validateInput(data: any, rules: ValidationRules): ValidationResult {
  const errors: string[] = [];

  for (const [field, rule] of Object.entries(rules)) {
    const value = data[field];

    // Required field missing?
    if (rule.required && (value === undefined || value === null || value === '')) {
      errors.push(`${field} is required`);
      continue;
    }

    // If not required and empty, skip other checks
    if (!rule.required && (value === undefined || value === null || value === '')) {
      continue;
    }

    // Type check
    if (rule.type === 'email' && !isValidEmail(value)) {
      errors.push(`${field} must be a valid email`);
    }

    if (rule.type === 'number' && !isValidNumber(value, rule.min, rule.max)) {
      errors.push(`${field} must be a valid number${rule.min !== undefined ? ` (min: ${rule.min})` : ''}${rule.max !== undefined ? ` (max: ${rule.max})` : ''}`);
    }

    if (rule.type === 'string' && typeof value !== 'string') {
      errors.push(`${field} must be a string`);
    }

    // Length check
    if (rule.maxLength && value.length > rule.maxLength) {
      errors.push(`${field} must be less than ${rule.maxLength} characters`);
    }

    // Custom validation
    if (rule.custom && !rule.custom(value)) {
      errors.push(`${field} is invalid`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Types for the validation system
export interface ValidationRule {
  type?: 'string' | 'number' | 'email' | 'boolean';
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  custom?: (value: any) => boolean;
}

export interface ValidationRules {
  [field: string]: ValidationRule;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}
