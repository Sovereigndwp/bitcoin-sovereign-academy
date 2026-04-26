import { VercelRequest, VercelResponse } from '@vercel/node';
import { appendLiteralQueryParam, resolveAllowedRedirectUrl, setCorsHeaders } from './lib/origin';
import { checkRateLimit } from './rate-limiter';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!(await checkRateLimit(req, res, 'payment'))) return;

  try {
    const { items, provider, email, successUrl, cancelUrl } = req.body || {};

    if (!items || !provider || !email) {
      return res.status(400).json({
        error: 'Missing required fields: items, provider, email'
      });
    }

    if (provider !== 'stripe') {
      return res.status(400).json({ error: 'Only stripe provider is currently supported' });
    }

    // Validate items against catalog
    const { validateCartItems, calculatePricing } = await import('./pricing');
    const validation = validateCartItems(items);
    if (!validation.valid) {
      return res.status(400).json({ error: `Invalid cart: ${validation.errors.join(', ')}` });
    }

    const pricing = calculatePricing({ items });

    // Initialize Stripe
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET || '', {
      apiVersion: '2025-02-24.acacia' as any,
    });

    // Build line items
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.title,
          description: `Bitcoin Sovereign Academy - ${item.type}`,
          metadata: { type: item.type, id: item.id },
        },
        unit_amount: Math.round(item.priceUSD * 100),
      },
      quantity: 1,
    }));

    if (pricing.discount > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Volume Discount',
            description: 'Bundle savings',
            metadata: {},
          },
          unit_amount: -Math.round(pricing.discount * 100),
        },
        quantity: 1,
      });
    }

    // Build success URL with session ID
    const successUrlWithSession = appendLiteralQueryParam(
      resolveAllowedRedirectUrl(successUrl, '/pricing.html?payment=success', req),
      'session_id',
      '{CHECKOUT_SESSION_ID}'
    );
    const cancelRedirectUrl = resolveAllowedRedirectUrl(cancelUrl, '/pricing.html?payment=cancelled', req);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrlWithSession,
      cancel_url: cancelRedirectUrl,
      customer_email: email,
      metadata: {
        email,
        items: JSON.stringify(items.map((i: any) => ({ type: i.type, id: i.id, title: i.title }))),
      },
      allow_promotion_codes: true,
    });

    return res.status(200).json({
      provider: 'stripe',
      sessionId: session.id,
      url: session.url || '',
    });
  } catch (err: any) {
    console.error('Payment error:', err);
    return res.status(500).json({ error: err.message || 'Payment session creation failed' });
  }
}
