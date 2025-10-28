import { VercelRequest, VercelResponse } from '@vercel/node';
import { requireAccess } from './entitlements';
import { APIError } from './types';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function handleCORS(req: VercelRequest, res: VercelResponse): boolean {
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

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

  if (req.method !== 'GET') {
    return errorResponse(res, 405, 'Method not allowed');
  }

  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || null;
    const moduleId = req.query.module as string | undefined;
    const pathId = req.query.path as string | undefined;

    const result = requireAccess(token, moduleId, pathId);

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
