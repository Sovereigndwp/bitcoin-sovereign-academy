import { VercelRequest, VercelResponse } from '@vercel/node';
import { calculatePricing } from '../pricing';
import { PricingRequest, APIError } from '../types';
import { setCorsHeaders } from '../lib/origin';

function errorResponse(res: VercelResponse, status: number, message: string, code?: string) {
  const error: APIError = { error: 'Error', message, code };
  res.status(status).json(error);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(req, res, 'GET, POST, OPTIONS', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return errorResponse(res, 405, 'Method not allowed');
  }

  try {
    const request: PricingRequest = req.body;
    const pricing = calculatePricing(request);
    res.status(200).json(pricing);
  } catch (err: any) {
    return errorResponse(res, 400, err.message);
  }
}
