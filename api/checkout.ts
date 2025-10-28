import { VercelRequest, VercelResponse } from '@vercel/node';
import { createStripeCheckout } from './stripe';
import { createBTCPayInvoice } from './btcpay';
import { CheckoutRequest, APIError } from './types';

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

  if (req.method !== 'POST') {
    return errorResponse(res, 405, 'Method not allowed');
  }

  try {
    const request: CheckoutRequest = req.body;

    let response;
    if (request.provider === 'stripe') {
      response = await createStripeCheckout(request);
    } else if (request.provider === 'btcpay') {
      response = await createBTCPayInvoice(request);
    } else {
      return errorResponse(res, 400, 'Invalid payment provider');
    }

    res.status(200).json(response);
  } catch (err: any) {
    return errorResponse(res, 400, err.message);
  }
}
