/**
 * Analytics Event Tracking API
 * POST /api/track
 *
 * Accepts batched analytics events from the frontend and persists them
 * to Supabase. Privacy-respecting: no cookies, no fingerprinting,
 * session IDs are ephemeral (sessionStorage-based).
 */

import { VercelRequest, VercelResponse } from '@vercel/node';

// Simple in-memory rate limiter (per IP, 60 events/min)
const ipCounts: Map<string, { count: number; reset: number }> = new Map();

function getClientIp(req: VercelRequest): string {
  const fwd = req.headers['x-forwarded-for'];
  return (fwd ? (Array.isArray(fwd) ? fwd[0] : fwd.split(',')[0]) : 'unknown').trim();
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const info = ipCounts.get(ip);
  if (!info || info.reset < now) {
    ipCounts.set(ip, { count: 1, reset: now + 60_000 });
    return false;
  }
  info.count++;
  return info.count > 60;
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

  // Validate payload
  const { events } = req.body || {};
  if (!Array.isArray(events) || events.length === 0) {
    return res.status(400).json({ error: 'events array required' });
  }

  // Cap batch size
  const batch = events.slice(0, 25);

  // Build rows
  const rows = batch.map((e: any) => ({
    session_id: String(e.sessionId || e.session_id || 'unknown').slice(0, 100),
    event_type: String(e.event || e.event_type || 'unknown').slice(0, 100),
    page_path: String(e.path || e.page_path || '').slice(0, 500),
    referrer: String(e.referrer || '').slice(0, 500),
    props: typeof e.props === 'object' ? e.props : {},
    created_at: e.timestamp ? new Date(e.timestamp).toISOString() : new Date().toISOString(),
  }));

  // Write to Supabase
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    // Silently accept — don't expose config state to clients
    return res.status(200).json({ received: rows.length });
  }

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/analytics_events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify(rows),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('[track] Supabase insert failed:', response.status, err);
    }
  } catch (err) {
    console.error('[track] Supabase error:', err);
  }

  return res.status(200).json({ received: rows.length });
}
