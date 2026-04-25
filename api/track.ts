/**
 * Analytics Event Tracking API
 * POST /api/track
 *
 * Accepts batched analytics events from the frontend and persists them
 * to Supabase. Privacy-respecting: no cookies, no fingerprinting,
 * session IDs are ephemeral (sessionStorage-based).
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { setCorsHeaders } from './lib/origin';
import { rateLimit } from './rate-limiter';

// Per-IP, 60 events/min — analytics is high-volume; using a custom preset rather than a shared one
const trackRateLimit = rateLimit({
  maxRequests: 60,
  windowMs: 60_000,
  message: 'Analytics rate limit exceeded',
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(req, res, 'POST, OPTIONS', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!(await trackRateLimit(req, res))) return; // 429 already sent by limiter

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
