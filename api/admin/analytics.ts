/**
 * Admin Analytics API
 * GET /api/admin/analytics - Query Supabase analytics data
 *
 * Returns: page views, top pages, email signups, event breakdown, daily trends.
 * Requires admin Bearer token (from /api/admin/auth).
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAdminToken } from './auth';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || 'https://bitcoinsovereign.academy',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function handleCORS(req: VercelRequest, res: VercelResponse): boolean {
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  return false;
}

/** Fetch rows from Supabase REST API */
async function supaQuery(path: string): Promise<any> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase not configured');

  const resp = await fetch(`${url}/rest/v1/${path}`, {
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Supabase query failed (${resp.status}): ${text}`);
  }

  return resp.json();
}

/** Run a raw SQL query via Supabase RPC (pg function) or fallback to REST */
async function supaRPC(fnName: string, params: Record<string, any> = {}): Promise<any> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase not configured');

  const resp = await fetch(`${url}/rest/v1/rpc/${fnName}`, {
    method: 'POST',
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`RPC ${fnName} failed (${resp.status}): ${text}`);
  }

  return resp.json();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCORS(req, res)) return;
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  // Auth
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!verifyAdminToken(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { range = '7d' } = req.query;
    const days = range === '30d' ? 30 : range === '90d' ? 90 : 7;
    const since = new Date(Date.now() - days * 86400000).toISOString();

    // Run queries in parallel
    const [
      recentEvents,
      subscribers,
    ] = await Promise.all([
      // Analytics events in date range (limit 10000 most recent)
      supaQuery(
        `analytics_events?created_at=gte.${since}&order=created_at.desc&limit=10000&select=event_type,page_path,referrer,session_id,props,created_at`
      ),
      // Email subscribers
      supaQuery(
        `email_subscribers?order=created_at.desc&limit=500&select=email,source,created_at`
      ),
    ]);

    // --- Compute aggregates in-memory ---

    // Total page views
    const pageViews = recentEvents.filter((e: any) => e.event_type === 'pageview').length;
    const totalEvents = recentEvents.length;

    // Unique sessions
    const uniqueSessions = new Set(recentEvents.map((e: any) => e.session_id)).size;

    // Top pages
    const pageCounts: Record<string, number> = {};
    recentEvents
      .filter((e: any) => e.event_type === 'pageview')
      .forEach((e: any) => {
        const p = e.page_path || '(unknown)';
        pageCounts[p] = (pageCounts[p] || 0) + 1;
      });
    const topPages = Object.entries(pageCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([path, views]) => ({ path, views }));

    // Event type breakdown
    const eventCounts: Record<string, number> = {};
    recentEvents.forEach((e: any) => {
      eventCounts[e.event_type] = (eventCounts[e.event_type] || 0) + 1;
    });
    const eventBreakdown = Object.entries(eventCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([type, count]) => ({ type, count }));

    // Daily page views trend
    const dailyViews: Record<string, number> = {};
    recentEvents
      .filter((e: any) => e.event_type === 'pageview')
      .forEach((e: any) => {
        const day = e.created_at.slice(0, 10);
        dailyViews[day] = (dailyViews[day] || 0) + 1;
      });
    const dailyTrend = Object.entries(dailyViews)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, views]) => ({ date, views }));

    // Top referrers
    const refCounts: Record<string, number> = {};
    recentEvents
      .filter((e: any) => e.referrer && e.referrer !== '' && e.referrer !== 'null')
      .forEach((e: any) => {
        try {
          const host = new URL(e.referrer).hostname || e.referrer;
          refCounts[host] = (refCounts[host] || 0) + 1;
        } catch {
          refCounts[e.referrer] = (refCounts[e.referrer] || 0) + 1;
        }
      });
    const topReferrers = Object.entries(refCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([source, count]) => ({ source, count }));

    // Site breakdown (BSA vs FSA)
    const siteCounts: Record<string, number> = {};
    recentEvents.forEach((e: any) => {
      const site = e.props?.site || 'bsa';
      siteCounts[site] = (siteCounts[site] || 0) + 1;
    });

    // Email subscriber stats
    const totalSubscribers = subscribers.length;
    const recentSubs = subscribers
      .filter((s: any) => new Date(s.created_at) >= new Date(since))
      .length;

    // Conversion funnel
    const emailCaptures = recentEvents.filter(
      (e: any) => e.event_type === 'email_capture' || e.event_type === 'email_submit'
    ).length;
    const tipClicks = recentEvents.filter(
      (e: any) => e.event_type === 'tip_click' || e.event_type === 'tip_cta_click'
    ).length;
    const pricingViews = recentEvents.filter(
      (e: any) => e.event_type === 'pageview' && (
        e.page_path?.includes('pricing') || e.page_path?.includes('membership')
      )
    ).length;

    res.status(200).json({
      success: true,
      range: `${days}d`,
      overview: {
        pageViews,
        totalEvents,
        uniqueSessions,
        totalSubscribers,
        recentSubscribers: recentSubs,
      },
      topPages,
      eventBreakdown,
      dailyTrend,
      topReferrers,
      siteCounts,
      funnel: {
        pageViews,
        pricingViews,
        emailCaptures,
        tipClicks,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[admin/analytics] Error:', err);
    res.status(500).json({ error: 'Failed to retrieve analytics', detail: err.message });
  }
}
