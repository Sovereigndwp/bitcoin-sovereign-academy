/**
 * Email Subscription API
 * POST /api/subscribe
 *
 * Persists email captures to Supabase so they aren't lost
 * when users clear their browser. The frontend still stores in
 * localStorage as a fallback and still submits to Substack.
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { sendWelcomeEmail } from './email';
import { setCorsHeaders } from './lib/origin';
import { rateLimit } from './rate-limiter';

// 5 signups per IP per hour — list-stuffing deterrent. Uses the shared rate-limiter
// with a custom config because the standard presets ('auth', 'payment', 'api', 'public')
// don't fit the "very low rate over a long window" intent.
const subscribeRateLimit = rateLimit({
  maxRequests: 5,
  windowMs: 60 * 60 * 1000,
  message: 'Too many subscription attempts. Try again in an hour.',
});

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(req, res, 'POST, OPTIONS', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!(await subscribeRateLimit(req, res))) return;

  // Validate
  const { email, source, page } = req.body || {};
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  const cleanEmail = email.toLowerCase().trim();

  // Write to Supabase
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return res.status(200).json({ success: true });
  }

  try {
    // Upsert — if email exists, update source/page but don't duplicate
    const response = await fetch(`${supabaseUrl}/rest/v1/email_subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Prefer': 'return=minimal,resolution=merge-duplicates',
      },
      body: JSON.stringify({
        email: cleanEmail,
        source: String(source || 'unknown').slice(0, 50),
        page: String(page || '').slice(0, 500),
        subscribed_at: new Date().toISOString(),
        status: 'active',
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('[subscribe] Supabase upsert failed:', response.status, err);
    }
  } catch (err) {
    console.error('[subscribe] Supabase error:', err);
  }

  // Send welcome email (fire-and-forget — don't block response)
  sendWelcomeEmail(cleanEmail, String(source || '')).catch(err => {
    console.error('[subscribe] Welcome email failed:', err);
  });

  return res.status(200).json({ success: true });
}
