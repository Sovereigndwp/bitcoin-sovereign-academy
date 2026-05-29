import { VercelRequest, VercelResponse } from '@vercel/node';
import { appendLiteralQueryParam, resolveAllowedRedirectUrl, setCorsHeaders } from './lib/origin';
import { checkRateLimit } from './rate-limiter';

const MEMBERSHIP_PRICES: Record<string, { amount: number; name: string; description: string }> = {
  apprentice: {
    amount: 37,
    name: 'BSA Apprentice Access',
    description: 'Bitcoin Sovereign Academy Apprentice access. Bitcoin or Lightning payment through BTCPay.'
  },
  sovereign: {
    amount: 399,
    name: 'BSA Sovereign Lifetime Access',
    description: 'Bitcoin Sovereign Academy lifetime access. Bitcoin or Lightning payment through BTCPay.'
  }
};

function getBTCPayConfig() {
  const url = process.env.BTCPAY_URL;
  const apiKey = process.env.BTCPAY_API_KEY;
  const storeId = process.env.BTCPAY_STORE_ID;

  if (!url || !apiKey || !storeId) {
    throw new Error('BTCPay Server configuration incomplete. Check BTCPAY_URL, BTCPAY_API_KEY, and BTCPAY_STORE_ID.');
  }

  return { url: url.replace(/\/$/, ''), apiKey, storeId };
}

function isValidEmail(email: unknown): email is string {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(req, res, 'POST, OPTIONS', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST required' });
  if (!(await checkRateLimit(req, res, 'payment'))) return;

  try {
    const { tier, email, successUrl: requestedSuccessUrl, cancelUrl: requestedCancelUrl } = req.body || {};

    if (tier !== 'apprentice' && tier !== 'sovereign') {
      return res.status(400).json({ error: 'Invalid membership tier' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'A valid email is required for Bitcoin or Lightning checkout' });
    }

    const product = MEMBERSHIP_PRICES[tier];
    const config = getBTCPayConfig();
    const successPath = tier === 'sovereign' ? '/membership-success.html' : '/membership.html';
    const successUrl = appendLiteralQueryParam(
      resolveAllowedRedirectUrl(requestedSuccessUrl, successPath, req),
      'provider',
      'btcpay'
    );
    const redirectUrl = appendLiteralQueryParam(successUrl, 'invoice_id', '{invoiceId}');
    const cancelUrl = resolveAllowedRedirectUrl(requestedCancelUrl, '/membership.html', req);

    const invoiceBody = {
      amount: product.amount.toString(),
      currency: 'USD',
      metadata: {
        buyerEmail: email.trim(),
        tier,
        membership: 'true',
        source: 'membership-btcpay-checkout',
        orderId: `BSA-${tier}-${Date.now()}`,
        itemDesc: product.name
      },
      checkout: {
        redirectURL: redirectUrl,
        redirectAutomatically: true,
        defaultLanguage: 'en',
        expirationMinutes: 60,
        paymentMethods: ['BTC', 'BTC-LightningNetwork']
      },
      receipt: {
        enabled: true,
        showQR: true,
        showPayments: true
      }
    };

    const response = await fetch(`${config.url}/api/v1/stores/${config.storeId}/invoices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `token ${config.apiKey}`
      },
      body: JSON.stringify(invoiceBody)
    });

    const invoice = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(invoice?.message || invoice?.error || `BTCPay invoice creation failed with ${response.status}`);
    }

    return res.status(200).json({
      provider: 'btcpay',
      tier,
      invoiceId: invoice.id,
      checkoutUrl: invoice.checkoutLink || invoice.url,
      amountUsd: product.amount
    });
  } catch (err: any) {
    console.error('[membership-btcpay-checkout] Error:', err);
    return res.status(500).json({ error: err.message || 'Failed to create Bitcoin or Lightning checkout' });
  }
}
