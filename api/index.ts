/**
 * Main API router for Bitcoin Sovereign Academy
 *
 * This file provides Vercel serverless function endpoints:
 * - POST /api/cart/price - Calculate cart pricing
 * - POST /api/checkout - Create payment session (Stripe or BTCPay)
 * - POST /api/webhooks/stripe - Handle Stripe payment webhooks
 * - POST /api/webhooks/btcpay - Handle BTCPay payment webhooks
 * - GET /api/verify - Verify user access token
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { calculatePricing } from './pricing';
import { createStripeCheckout, verifyStripeWebhook, handleStripePaymentSuccess } from './stripe';
import { createBTCPayInvoice, verifyBTCPayWebhook, handleBTCPayPaymentSuccess } from './btcpay';
import { grantEntitlement, generateAccessToken, verifyAccessToken, requireAccess } from './entitlements';
import { PricingRequest, CheckoutRequest, APIError } from './types';

/**
 * CORS headers for API responses
 */
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || 'https://bitcoinsovereign.academy',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

/**
 * Handle OPTIONS requests for CORS preflight
 */
function handleCORS(req: VercelRequest, res: VercelResponse): boolean {
  if (req.method === 'OPTIONS') {
    res.status(200).json({});
    return true;
  }
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  return false;
}

/**
 * Error response helper
 */
function errorResponse(res: VercelResponse, status: number, message: string, code?: string) {
  const error: APIError = { error: 'Error', message, code };
  res.status(status).json(error);
}

/**
 * POST /api/cart/price
 * Calculate cart pricing with discounts
 */
export async function price(req: VercelRequest, res: VercelResponse) {
  if (handleCORS(req, res)) return;

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

/**
 * POST /api/checkout
 * Create a checkout session (Stripe or BTCPay)
 */
export async function checkout(req: VercelRequest, res: VercelResponse) {
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

/**
 * POST /api/webhooks/stripe
 * Handle Stripe payment webhooks
 */
export async function webhookStripe(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return errorResponse(res, 405, 'Method not allowed');
  }

  try {
    const signature = req.headers['stripe-signature'] as string;
    const payload = JSON.stringify(req.body);

    const event = verifyStripeWebhook(payload, signature);

    // Handle successful payment
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const { email, items } = await handleStripePaymentSuccess(session);

      // Grant entitlement
      const entitlement = grantEntitlement(email, items);
      const token = generateAccessToken(entitlement);

      // Send email with access token
      const { sendAccessTokenEmail } = await import('./email');
      const emailSent = await sendAccessTokenEmail({
        email,
        token,
        modules: entitlement.modules,
        paths: entitlement.paths,
        totalPaid: session.amount_total ? session.amount_total / 100 : 0
      });

      if (!emailSent) {
        console.error(`Failed to send access token email to ${email}`);
      } else {
        console.log(`Access token email sent to ${email}`);
      }

      res.status(200).json({ received: true, email, token });
    } else {
      res.status(200).json({ received: true });
    }
  } catch (err: any) {
    return errorResponse(res, 400, err.message);
  }
}

/**
 * POST /api/webhooks/btcpay
 * Handle BTCPay payment webhooks
 */
export async function webhookBTCPay(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return errorResponse(res, 405, 'Method not allowed');
  }

  try {
    const signature = req.headers['btcpay-sig'] as string;
    const payload = JSON.stringify(req.body);

    const verification = verifyBTCPayWebhook(payload, signature);

    if (!verification.valid || !verification.event) {
      return errorResponse(res, 400, 'Invalid webhook signature');
    }

    const event = verification.event;

    // Handle invoice settled (payment confirmed)
    if (event.type === 'InvoiceSettled') {
      const { email, items } = await handleBTCPayPaymentSuccess(event.invoiceId);
      const amount = items.reduce((sum, item) => sum + item.priceUSD, 0);

      // Grant entitlement
      const entitlement = grantEntitlement(email, items);
      const token = generateAccessToken(entitlement);

      // Send email with access token
      const { sendAccessTokenEmail } = await import('./email');
      const emailSent = await sendAccessTokenEmail({
        email,
        token,
        modules: entitlement.modules,
        paths: entitlement.paths,
        totalPaid: amount
      });

      if (!emailSent) {
        console.error(`Failed to send access token email to ${email}`);
      } else {
        console.log(`Access token email sent to ${email}`);
      }

      res.status(200).json({ received: true, email, token });
    } else {
      res.status(200).json({ received: true });
    }
  } catch (err: any) {
    return errorResponse(res, 400, err.message);
  }
}

/**
 * GET /api/verify
 * Verify user access token and check module/path access
 */
export async function verify(req: VercelRequest, res: VercelResponse) {
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

/**
 * Default export for Vercel serverless functions
 * Route to appropriate handler based on path
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const path = req.url?.split('?')[0];

  switch (path) {
    case '/api/cart/price':
      return price(req, res);
    case '/api/checkout':
      return checkout(req, res);
    case '/api/webhooks/stripe':
      return webhookStripe(req, res);
    case '/api/webhooks/btcpay':
      return webhookBTCPay(req, res);
    case '/api/verify':
      return verify(req, res);
    default:
      return errorResponse(res, 404, 'Not found');
  }
}
