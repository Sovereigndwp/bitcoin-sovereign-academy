import { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyBTCPayWebhook, handleBTCPayPaymentSuccess } from '../btcpay';
import { grantEntitlement, generateAccessToken } from '../entitlements';
import { APIError } from '../types';

function errorResponse(res: VercelResponse, status: number, message: string, code?: string) {
  const error: APIError = { error: 'Error', message, code };
  res.status(status).json(error);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

    if (event.type === 'InvoiceSettled') {
      const { email, items } = await handleBTCPayPaymentSuccess(event.invoiceId);

      const entitlement = grantEntitlement(email, items);
      const token = generateAccessToken(entitlement);

      console.log(`Payment successful for ${email}. Token: ${token}`);

      res.status(200).json({ received: true, email, token });
    } else {
      res.status(200).json({ received: true });
    }
  } catch (err: any) {
    return errorResponse(res, 400, err.message);
  }
}
