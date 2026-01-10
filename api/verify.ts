import { VercelRequest, VercelResponse } from '@vercel/node';
import { requireAccess } from './entitlements';
import { APIError } from './types';
import { isValidJWT, isValidLength, sanitizeText } from './validators';
import { checkRateLimit } from './rate-limiter';

// 📋 SECURITY: Only allow requests from OUR website
// Never use '*' in production - that lets anyone in!
const ALLOWED_ORIGINS = [
  'https://bitcoinsovereign.academy',
  'https://www.bitcoinsovereign.academy',
  'https://bitcoin-sovereign-academy.vercel.app',
  process.env.ALLOWED_ORIGIN, // For local development
  'http://localhost:3000', // For local testing
].filter(Boolean); // Remove undefined values

function getCORSHeaders(origin?: string): Record<string, string> {
  // Check if the request is from an allowed origin
  const isAllowed = origin && ALLOWED_ORIGINS.includes(origin);

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true', // Allow cookies
    'Access-Control-Max-Age': '86400', // Cache preflight for 24 hours
  };
}

function handleCORS(req: VercelRequest, res: VercelResponse): boolean {
  // Get the origin from the request
  const origin = req.headers.origin as string | undefined;

  // Set CORS headers based on the origin
  const headers = getCORSHeaders(origin);
  Object.entries(headers).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Handle preflight requests (browsers check if they're allowed to make the request)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  return false;
}

function errorResponse(res: VercelResponse, status: number, message: string, code?: string) {
  const error: APIError = { error: 'Error', message, code };
  res.status(status).json(error);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCORS(req, res)) return;

  // 🚪 SECURITY: Check rate limit (bouncer check!)
  const allowed = await checkRateLimit(req, res, 'auth');
  if (!allowed) return; // Bouncer says "no way!"

  if (req.method !== 'GET') {
    return errorResponse(res, 405, 'Method not allowed');
  }

  try {
    // 🛡️ SECURITY: Validate the token format
    const authHeader = req.headers.authorization;
    let token: string | null = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const rawToken = authHeader.replace('Bearer ', '');

      // Check if token looks like a real JWT
      if (rawToken && isValidJWT(rawToken)) {
        token = rawToken;
      } else {
        return errorResponse(res, 401, 'Invalid token format', 'INVALID_TOKEN');
      }
    }

    // 🛡️ SECURITY: Validate and clean moduleId and pathId
    let moduleId: string | undefined;
    let pathId: string | undefined;

    if (req.query.module) {
      const rawModule = String(req.query.module);
      if (!isValidLength(rawModule, 100)) {
        return errorResponse(res, 400, 'Module ID too long', 'INVALID_INPUT');
      }
      moduleId = sanitizeText(rawModule);
    }

    if (req.query.path) {
      const rawPath = String(req.query.path);
      if (!isValidLength(rawPath, 100)) {
        return errorResponse(res, 400, 'Path ID too long', 'INVALID_INPUT');
      }
      pathId = sanitizeText(rawPath);
    }

    // requireAccess is now async - must await it
    const result = await requireAccess(token, moduleId, pathId);

    if (!result.authorized) {
      return errorResponse(res, 403, result.error || 'Access denied', 'FORBIDDEN');
    }

    res.status(200).json({
      authorized: true,
      entitlement: result.entitlement,
    });
  } catch (err: any) {
    return errorResponse(res, 400, err.message);
  }
}
