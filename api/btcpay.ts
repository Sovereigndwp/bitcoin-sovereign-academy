import { CheckoutRequest, BTCPayCheckoutResponse, CartItem, BTCPayWebhookEvent } from './types';
import { validateCartItems, calculatePricing } from './pricing';

/**
 * BTCPay Server API client
 * Documentation: https://docs.btcpayserver.org/API/Greenfield/v1/
 */

interface BTCPayConfig {
  url: string;
  apiKey: string;
  storeId: string;
  webhookSecret: string;
}

function getBTCPayConfig(): BTCPayConfig {
  const url = process.env.BTCPAY_URL;
  const apiKey = process.env.BTCPAY_API_KEY;
  const storeId = process.env.BTCPAY_STORE_ID;
  const webhookSecret = process.env.BTCPAY_WEBHOOK_SECRET;

  if (!url || !apiKey || !storeId || !webhookSecret) {
    throw new Error('BTCPay Server configuration incomplete. Check environment variables.');
  }

  return { url, apiKey, storeId, webhookSecret };
}

/**
 * Create a BTCPay invoice for purchasing modules/paths
 */
export async function createBTCPayInvoice(
  request: CheckoutRequest
): Promise<BTCPayCheckoutResponse> {
  // Validate cart items
  const validation = validateCartItems(request.items);
  if (!validation.valid) {
    throw new Error(`Invalid cart items: ${validation.errors.join(', ')}`);
  }

  // Calculate final pricing
  const pricing = calculatePricing({ items: request.items });

  const config = getBTCPayConfig();

  // Prepare invoice ID for token retrieval
  const invoiceIdPrefix = `BSA-${Date.now()}`;

  // Append invoice_id to success URL for token retrieval
  const successUrlWithInvoice = request.successUrl.includes('?')
    ? `${request.successUrl}&provider=btcpay&invoice_id={invoiceId}`
    : `${request.successUrl}?provider=btcpay&invoice_id={invoiceId}`;

  // Build invoice request
  // Note: For single product purchases, include productId in metadata
  const invoiceData = {
    amount: pricing.total.toString(),
    currency: 'USD',
    metadata: {
      buyerEmail: request.email,
      orderId: invoiceIdPrefix,
      itemDesc: request.items.map((i) => i.title).join(', '),
      // For new payment flow: store productId for validation
      productId: request.items[0]?.id || null,
      items: JSON.stringify(
        request.items.map((i) => ({ type: i.type, id: i.id, title: i.title }))
      ),
    },
    checkout: {
      redirectURL: successUrlWithInvoice,
      redirectAutomatically: true,
      defaultLanguage: 'en',
    },
  };

  // Make API request to BTCPay Server
  const response = await fetch(`${config.url}/api/v1/stores/${config.storeId}/invoices`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `token ${config.apiKey}`,
    },
    body: JSON.stringify(invoiceData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`BTCPay invoice creation failed: ${response.status} ${errorText}`);
  }

  const invoice = await response.json();

  return {
    provider: 'btcpay',
    invoiceId: invoice.id,
    url: invoice.checkoutLink,
    btcAddress: invoice.addresses?.BTC, // Optional BTC address
    amount: invoice.cryptoInfo?.[0]?.cryptoCode === 'BTC' ? invoice.cryptoInfo[0].due : undefined,
  };
}

/**
 * Get invoice status from BTCPay Server
 */
export async function getBTCPayInvoiceStatus(invoiceId: string): Promise<{
  status: string;
  amount: string;
  currency: string;
  metadata: any;
}> {
  const config = getBTCPayConfig();

  const response = await fetch(
    `${config.url}/api/v1/stores/${config.storeId}/invoices/${invoiceId}`,
    {
      headers: {
        Authorization: `token ${config.apiKey}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch invoice: ${response.status}`);
  }

  const invoice = await response.json();

  return {
    status: invoice.status, // New, Processing, Expired, Invalid, Settled
    amount: invoice.amount,
    currency: invoice.currency,
    metadata: invoice.metadata,
  };
}

/**
 * Verify BTCPay webhook signature
 * BTCPay uses HMAC-SHA256 for webhook signatures
 */
export function verifyBTCPayWebhook(
  payload: string,
  signature: string
): { valid: boolean; event?: BTCPayWebhookEvent } {
  const config = getBTCPayConfig();

  // Create HMAC signature
  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha256', config.webhookSecret);
  hmac.update(payload);
  const expectedSignature = `sha256=${hmac.digest('hex')}`;

  // Constant-time comparison to prevent timing attacks
  const valid = crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );

  if (!valid) {
    return { valid: false };
  }

  try {
    const event: BTCPayWebhookEvent = JSON.parse(payload);
    return { valid: true, event };
  } catch (err) {
    return { valid: false };
  }
}

/**
 * Handle successful BTCPay payment
 */
export async function handleBTCPayPaymentSuccess(invoiceId: string): Promise<{
  email: string;
  items: CartItem[];
}> {
  const invoice = await getBTCPayInvoiceStatus(invoiceId);

  if (invoice.status !== 'Settled') {
    throw new Error(`Invoice not settled. Current status: ${invoice.status}`);
  }

  const email = invoice.metadata?.buyerEmail;
  if (!email) {
    throw new Error('No email found in invoice metadata');
  }

  const itemsData = invoice.metadata?.items;
  if (!itemsData) {
    throw new Error('No items found in invoice metadata');
  }

  const items: CartItem[] = JSON.parse(itemsData);

  return { email, items };
}

/**
 * Create a BTCPay webhook (one-time setup)
 */
export async function createBTCPayWebhook(webhookUrl: string): Promise<{ id: string }> {
  const config = getBTCPayConfig();

  const webhookData = {
    url: webhookUrl,
    automaticRedelivery: true,
    secret: config.webhookSecret,
    authorizedEvents: {
      everything: false,
      specificEvents: ['InvoiceSettled', 'InvoiceExpired', 'InvoiceInvalid'],
    },
  };

  const response = await fetch(`${config.url}/api/v1/stores/${config.storeId}/webhooks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `token ${config.apiKey}`,
    },
    body: JSON.stringify(webhookData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create webhook: ${response.status}`);
  }

  const webhook = await response.json();
  return { id: webhook.id };
}
