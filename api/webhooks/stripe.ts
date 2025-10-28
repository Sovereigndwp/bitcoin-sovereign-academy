import { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyStripeWebhook, handleStripePaymentSuccess } from '../stripe';
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
    const signature = req.headers['stripe-signature'] as string;
    const payload = JSON.stringify(req.body);

    const event = verifyStripeWebhook(payload, signature);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const { email, items } = await handleStripePaymentSuccess(session);

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
