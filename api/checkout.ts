import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items, provider, email, successUrl, cancelUrl } = req.body || {};

    if (!items || !provider || !email || !successUrl || !cancelUrl) {
      return res.status(400).json({
        error: 'Missing required fields: items, provider, email, successUrl, cancelUrl'
      });
    }

    if (provider === 'stripe') {
      const Stripe = (await import('stripe')).default;
      const stripe = new Stripe(process.env.STRIPE_SECRET || '', {
        apiVersion: '2025-02-24.acacia' as any,
      });

      // Validate items against catalog
      const { validateCartItems, calculatePricing } = await import('./pricing');
      const validation = validateCartItems(items);
      if (!validation.valid) {
        return res.status(400).json({ error: `Invalid cart: ${validation.errors.join(', ')}` });
      }

      const pricing = calculatePricing({ items });

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

      const successUrlWithSession = successUrl.includes('?')
        ? `${successUrl}&session_id={CHECKOUT_SESSION_ID}`
        : `${successUrl}?session_id={CHECKOUT_SESSION_ID}`;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: successUrlWithSession,
        cancel_url: cancelUrl,
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
    }

    return res.status(400).json({ error: 'Only stripe provider is currently supported' });
  } catch (err: any) {
    console.error('Checkout error:', err);
    return res.status(500).json({ error: err.message || 'Checkout failed' });
  }
}
