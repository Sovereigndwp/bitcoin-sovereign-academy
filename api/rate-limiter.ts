/**
 * 🚪 RATE LIMITER - The Bouncer at Your Door
 *
 * This stops people from "knocking" too many times!
 *
 * Think of it like:
 * - You can ring a doorbell 3 times
 * - But if you ring it 100 times, the door won't open!
 */

import { VercelRequest, VercelResponse } from '@vercel/node';

// Store request counts in memory (simple version)
// In production, you'd use Redis or similar
const requestCounts: Map<string, RequestInfo> = new Map();

interface RequestInfo {
  count: number;
  resetTime: number;
}

interface RateLimitConfig {
  maxRequests: number;   // How many requests allowed
  windowMs: number;       // Time window in milliseconds
  message?: string;       // Custom error message
}

// Default limits for different endpoints
export const RATE_LIMITS = {
  // Very strict - login and signup
  auth: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: 'Too many login attempts. Please try again in 15 minutes.'
  },

  // Moderate - payment and checkout
  payment: {
    maxRequests: 10,
    windowMs: 60 * 1000, // 1 minute
    message: 'Too many payment requests. Please wait a minute.'
  },

  // Relaxed - general API calls
  api: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
    message: 'Too many requests. Please slow down.'
  },

  // Very relaxed - public data (like Bitcoin price)
  public: {
    maxRequests: 300,
    windowMs: 60 * 1000, // 1 minute
    message: 'Rate limit exceeded. Please try again soon.'
  }
};

/**
 * Get a unique ID for each visitor
 * Uses their IP address (like a house address)
 */
function getClientId(req: VercelRequest): string {
  // Try to get their real IP address
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded
    ? (Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0])
    : req.socket.remoteAddress || 'unknown';

  return ip.trim();
}

/**
 * Clean up old data (garbage collection)
 * Run this occasionally to free up memory
 */
function cleanup() {
  const now = Date.now();

  for (const [key, info] of requestCounts.entries()) {
    // If the reset time has passed, delete the entry
    if (info.resetTime < now) {
      requestCounts.delete(key);
    }
  }
}

// Clean up every 5 minutes
setInterval(cleanup, 5 * 60 * 1000);

/**
 * 🚪 MAIN RATE LIMITER FUNCTION
 * Use this at the start of every API endpoint!
 */
export function rateLimit(config: RateLimitConfig = RATE_LIMITS.api) {
  return async (req: VercelRequest, res: VercelResponse, next?: () => void): Promise<boolean> => {
    const clientId = getClientId(req);
    const key = `${clientId}:${req.url}`;
    const now = Date.now();

    // Get or create request info for this client
    let info = requestCounts.get(key);

    // If no info exists OR reset time has passed, create new entry
    if (!info || info.resetTime < now) {
      info = {
        count: 1,
        resetTime: now + config.windowMs
      };
      requestCounts.set(key, info);

      // Set headers to tell the client about the limit
      res.setHeader('X-RateLimit-Limit', config.maxRequests.toString());
      res.setHeader('X-RateLimit-Remaining', (config.maxRequests - 1).toString());
      res.setHeader('X-RateLimit-Reset', new Date(info.resetTime).toISOString());

      return true; // Allow the request
    }

    // Increment the count
    info.count++;

    // Check if they've exceeded the limit
    if (info.count > config.maxRequests) {
      const retryAfter = Math.ceil((info.resetTime - now) / 1000); // seconds

      // Set headers
      res.setHeader('X-RateLimit-Limit', config.maxRequests.toString());
      res.setHeader('X-RateLimit-Remaining', '0');
      res.setHeader('X-RateLimit-Reset', new Date(info.resetTime).toISOString());
      res.setHeader('Retry-After', retryAfter.toString());

      // Block the request
      res.status(429).json({
        error: 'Too Many Requests',
        message: config.message || 'Rate limit exceeded',
        retryAfter: retryAfter
      });

      return false; // Block the request
    }

    // Update headers
    res.setHeader('X-RateLimit-Limit', config.maxRequests.toString());
    res.setHeader('X-RateLimit-Remaining', (config.maxRequests - info.count).toString());
    res.setHeader('X-RateLimit-Reset', new Date(info.resetTime).toISOString());

    return true; // Allow the request
  };
}

/**
 * Simple helper to check if a request is allowed
 * Returns true if allowed, false if blocked
 */
export async function checkRateLimit(
  req: VercelRequest,
  res: VercelResponse,
  limitType: keyof typeof RATE_LIMITS = 'api'
): Promise<boolean> {
  const limiter = rateLimit(RATE_LIMITS[limitType]);
  return await limiter(req, res);
}
