import Stripe from 'stripe';
import { CheckoutRequest, StripeCheckoutResponse, CartItem } from './types';
import { validateCartItems, calculatePricing } from './pricing';

// Initialize Stripe (will use STRIPE_SECRET from environment)
let stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripe) {
    const secret = process.env.STRIPE_SECRET;
    if (!secret) {
      throw new Error('STRIPE_SECRET environment variable not set');
    }
    stripe = new Stripe(secret, {
      apiVersion: '2025-02-24.acacia',
    });
  }
  return stripe;
}

/**
 * Create a Stripe checkout session for purchasing modules/paths
 */
export async function createStripeCheckout(
  request: CheckoutRequest
): Promise<StripeCheckoutResponse> {
  // Validate cart items
  const validation = validateCartItems(request.items);
  if (!validation.valid) {
    throw new Error(`Invalid cart items: ${validation.errors.join(', ')}`);
  }

  // Calculate final pricing
  const pricing = calculatePricing({ items: request.items });

  const stripe = getStripe();

  // Create line items for Stripe
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = request.items.map((item) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.title,
        description: `Bitcoin Sovereign Academy - ${item.type}`,
        metadata: {
          type: item.type,
          id: item.id,
        },
      },
      unit_amount: Math.round(item.priceUSD * 100), // Stripe uses cents
    },
    quantity: 1,
  }));

  // Add discount line item if applicable
  if (pricing.discount > 0) {
    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Volume Discount',
          description: 'Bundle savings',
        },
        unit_amount: -Math.round(pricing.discount * 100), // Negative for discount
      },
      quantity: 1,
    });
  }

  // Create checkout session
  // Append session_id to success URL for token retrieval
  const successUrlWithSession = request.successUrl.includes('?')
    ? `${request.successUrl}&session_id={CHECKOUT_SESSION_ID}`
    : `${request.successUrl}?session_id={CHECKOUT_SESSION_ID}`;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: successUrlWithSession,
    cancel_url: request.cancelUrl,
    customer_email: request.email,
    metadata: {
      email: request.email,
      items: JSON.stringify(
        request.items.map((i) => ({ type: i.type, id: i.id, title: i.title }))
      ),
    },
    allow_promotion_codes: true,
  });

  return {
    provider: 'stripe',
    sessionId: session.id,
    url: session.url || '',
  };
}

/**
 * Verify Stripe webhook signature
 */
export function verifyStripeWebhook(payload: string, signature: string): Stripe.Event {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET not configured');
  }

  try {
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    throw new Error(`Webhook signature verification failed: ${err}`);
  }
}

/**
 * Handle successful Stripe payment
 */
export async function handleStripePaymentSuccess(session: Stripe.Checkout.Session): Promise<{
  email: string;
  items: CartItem[];
}> {
  const email = session.customer_email || session.metadata?.email;
  if (!email) {
    throw new Error('No email found in session');
  }

  const itemsData = session.metadata?.items;
  if (!itemsData) {
    throw new Error('No items found in session metadata');
  }

  const items: CartItem[] = JSON.parse(itemsData);

  return { email, items };
}

/**
 * Create a Stripe customer portal session for managing subscriptions
 * (Future use if you add subscription-based access)
 */
export async function createCustomerPortalSession(
  customerId: string,
  returnUrl: string
): Promise<string> {
  const stripe = getStripe();

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session.url;
}
