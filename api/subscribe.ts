/**
 * Email Subscription API
 * POST /api/subscribe
 *
 * Persists email captures to Supabase so they aren't lost
 * when users clear their browser. The frontend still stores in
 * localStorage as a fallback and still submits to Substack.
 */

import { VercelRequest, VercelResponse } from '@vercel/node';

// Simple rate limit (5 signups per IP per hour)
const ipCounts: Map<string, { count: number; reset: number }> = new Map();

function getClientIp(req: VercelRequest): string {
  const fwd = req.headers['x-forwarded-for'];
  return (fwd ? (Array.isArray(fwd) ? fwd[0] : fwd.split(',')[0]) : 'unknown').trim();
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const info = ipCounts.get(ip);
  if (!info || info.reset < now) {
    ipCounts.set(ip, { count: 1, reset: now + 3_600_000 });
    return false;
  }
  info.count++;
  return info.count > 5;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Rate limit
  const ip = getClientIp(req);
  if (isRateLimited(ip)) return res.status(429).json({ error: 'Too many requests' });

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

  return res.status(200).json({ success: true });
}
