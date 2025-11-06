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

      // Store token for potential redirect (if session has return_url metadata)
      // Note: Stripe redirects happen on client-side after checkout completion
      // We'll need to append the token in the success_url query params
      console.log(`Token generated for ${email}: ${token}`);

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
 * GET /api/get-token
 * Retrieve access token after successful payment
 */
export async function getToken(req: VercelRequest, res: VercelResponse) {
  if (handleCORS(req, res)) return;

  if (req.method !== 'GET') {
    return errorResponse(res, 405, 'Method not allowed');
  }

  try {
    const { session_id, invoice_id, provider = 'stripe' } = req.query;

    let email: string;
    let items: any[];

    if (provider === 'stripe') {
      if (!session_id || typeof session_id !== 'string') {
        return errorResponse(res, 400, 'Missing or invalid session_id parameter');
      }

      // Retrieve Stripe session
      const Stripe = (await import('stripe')).default;
      const stripe = new Stripe(process.env.STRIPE_SECRET || '', {
        apiVersion: '2025-02-24.acacia',
      });
      const session = await stripe.checkout.sessions.retrieve(session_id);

      // Verify payment was successful
      if (session.payment_status !== 'paid') {
        return errorResponse(res, 400, 'Payment not completed');
      }

      // Extract email and items from session
      email = session.customer_email || session.metadata?.email || '';
      if (!email) {
        return errorResponse(res, 400, 'No email found in session');
      }

      const itemsData = session.metadata?.items;
      if (!itemsData) {
        return errorResponse(res, 400, 'No items found in session');
      }

      items = JSON.parse(itemsData);
    } else if (provider === 'btcpay') {
      if (!invoice_id || typeof invoice_id !== 'string') {
        return errorResponse(res, 400, 'Missing or invalid invoice_id parameter');
      }

      // Retrieve BTCPay invoice
      const { getBTCPayInvoiceStatus } = await import('./btcpay');
      const invoice = await getBTCPayInvoiceStatus(invoice_id);

      // Verify payment was successful
      if (invoice.status !== 'Settled') {
        return errorResponse(res, 400, `Payment not completed. Status: ${invoice.status}`);
      }

      // Extract email and items from invoice
      email = invoice.metadata?.buyerEmail || '';
      if (!email) {
        return errorResponse(res, 400, 'No email found in invoice');
      }

      const itemsData = invoice.metadata?.items;
      if (!itemsData) {
        return errorResponse(res, 400, 'No items found in invoice');
      }

      items = JSON.parse(itemsData);
    } else {
      return errorResponse(res, 400, 'Invalid payment provider');
    }

    // Grant entitlement and generate token
    const entitlement = grantEntitlement(email, items);
    const token = generateAccessToken(entitlement);

    // Return token and entitlement info
    res.status(200).json({
      success: true,
      token,
      email,
      modules: entitlement.modules,
      paths: entitlement.paths,
      purchaseDate: entitlement.purchaseDate,
    });
  } catch (err: any) {
    console.error('Error retrieving token:', err);
    return errorResponse(res, 500, err.message);
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
    case '/api/get-token':
      return getToken(req, res);
    default:
      return errorResponse(res, 404, 'Not found');
  }
}
