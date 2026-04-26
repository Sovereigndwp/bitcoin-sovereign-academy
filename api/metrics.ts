/**
 * Site-wide learning metrics — aggregated read endpoint.
 *
 * GET /api/metrics                 → public summary, counts < 10 suppressed (privacy floor)
 * GET /api/metrics?detail=1        → admin-only, full numbers (requires Bearer admin token)
 *
 * Source of truth: Supabase `analytics_events` table (written by /api/track).
 * Aggregation: in-memory over the last 30 days of rows. JS-side group-by avoids a
 * Postgres RPC migration; revisit if event volume passes ~100k/30d.
 *
 * Privacy posture: returns counts only — no session IDs, no IPs, no per-user paths.
 * The < 10 suppression floor reduces re-identification risk on small modules.
 *
 * Caching: Vercel applies a default `Cache-Control: public, max-age=0,
 * must-revalidate` to serverless function responses, and overriding the standard
 * Cache-Control header is unreliable. We use `CDN-Cache-Control` (Vercel-specific,
 * not stripped) to set s-maxage=300 + stale-while-revalidate=600 — the CDN absorbs
 * repeat hits while browsers always revalidate. Admin detail responses are private.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCorsHeaders } from './lib/origin';
import { rateLimit } from './rate-limiter';
import { verifyAdminToken } from './admin/auth';

const metricsRateLimit = rateLimit({
  maxRequests: 30,
  windowMs: 60_000,
  message: 'Metrics rate limit exceeded',
});

const SMALL_COUNT_THRESHOLD = 10;
const MAX_ROWS = 50_000;

interface RawEvent {
  event_type: string;
  page_path: string | null;
  props: Record<string, unknown> | null;
  created_at: string;
}

interface WindowMetrics {
  modulesStarted: number | null;
  modulesCompleted: number | null;
  moduleCompletionRate: string | null;
  labsCompleted: number | null;
  byPath: Record<string, number>;
  topModules: Array<{ id: string; count: number }>;
  topLabs: Array<{ id: string; count: number }>;
}

interface MetricsResponse {
  last7Days: WindowMetrics;
  last30Days: WindowMetrics;
  totalEvents: number;
  rangeStart: string;
  rangeEnd: string;
  detail: boolean;
  truncated?: boolean;
  _note?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(req, res, 'GET, OPTIONS', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (!(await metricsRateLimit(req, res))) return;

  // Detail mode requires a valid admin token.
  const wantsDetail = req.query.detail === '1';
  let isAdmin = false;
  if (wantsDetail) {
    const auth = String(req.headers.authorization || '');
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!verifyAdminToken(token)) {
      return res.status(401).json({ error: 'Admin token required for detail mode' });
    }
    isAdmin = true;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return res.status(503).json({ error: 'Backend not configured' });
  }

  const now = Date.now();
  const cutoff = new Date(now - 30 * 86_400_000).toISOString();

  const url =
    `${supabaseUrl}/rest/v1/analytics_events` +
    `?select=event_type,page_path,props,created_at` +
    `&created_at=gte.${encodeURIComponent(cutoff)}` +
    `&order=created_at.desc&limit=${MAX_ROWS + 1}`;

  let rows: RawEvent[];
  try {
    const r = await fetch(url, {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
    });
    if (!r.ok) {
      const errText = await r.text();
      console.error('[metrics] Supabase fetch failed:', r.status, errText.slice(0, 300));
      return res.status(502).json({ error: 'Upstream error' });
    }
    rows = (await r.json()) as RawEvent[];
  } catch (err) {
    console.error('[metrics] fetch error:', err);
    return res.status(502).json({ error: 'Upstream error' });
  }

  const truncated = rows.length > MAX_ROWS;
  if (truncated) rows = rows.slice(0, MAX_ROWS);

  const sevenDaysAgo = now - 7 * 86_400_000;
  const thirtyDaysAgo = now - 30 * 86_400_000;

  const last7 = computeWindow(rows, sevenDaysAgo, now);
  const last30 = computeWindow(rows, thirtyDaysAgo, now);

  const response: MetricsResponse = {
    last7Days: isAdmin ? last7 : suppressSmallCounts(last7),
    last30Days: isAdmin ? last30 : suppressSmallCounts(last30),
    totalEvents: rows.length,
    rangeStart: new Date(thirtyDaysAgo).toISOString(),
    rangeEnd: new Date(now).toISOString(),
    detail: isAdmin,
  };
  if (truncated) response.truncated = true;
  if (!isAdmin) {
    response._note = `Counts under ${SMALL_COUNT_THRESHOLD} are suppressed for privacy.`;
  }

  // Caching: use CDN-Cache-Control (Vercel-specific; not stripped by the
  // platform's serverless-function default that overrides standard Cache-Control).
  // Browser always revalidates; CDN absorbs repeat hits for 5 min.
  if (isAdmin) {
    res.setHeader('Cache-Control', 'private, no-store');
    res.setHeader('CDN-Cache-Control', 'private, no-store');
  } else {
    res.setHeader('CDN-Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
  }
  return res.status(200).json(response);
}

function computeWindow(rows: RawEvent[], sinceMs: number, untilMs: number): WindowMetrics {
  let started = 0;
  let completed = 0;
  let labCompleted = 0;
  const byPath = new Map<string, number>();
  const moduleCounts = new Map<string, number>();
  const labCounts = new Map<string, number>();

  for (const row of rows) {
    const ts = Date.parse(row.created_at);
    if (!Number.isFinite(ts) || ts < sinceMs || ts > untilMs) continue;
    const props = (row.props || {}) as Record<string, unknown>;

    switch (row.event_type) {
      case 'module_started': {
        started++;
        const pathId = stringProp(props.pathId);
        if (pathId) byPath.set(pathId, (byPath.get(pathId) || 0) + 1);
        const moduleId = stringProp(props.moduleId);
        if (moduleId) moduleCounts.set(moduleId, (moduleCounts.get(moduleId) || 0) + 1);
        break;
      }
      case 'module_completed': {
        completed++;
        break;
      }
      case 'lab_completed': {
        labCompleted++;
        const labId = stringProp(props.labId);
        if (labId) labCounts.set(labId, (labCounts.get(labId) || 0) + 1);
        break;
      }
    }
  }

  const completionRate =
    started > 0 ? `${((completed / started) * 100).toFixed(1)}%` : null;

  return {
    modulesStarted: started,
    modulesCompleted: completed,
    moduleCompletionRate: completionRate,
    labsCompleted: labCompleted,
    byPath: Object.fromEntries(byPath),
    topModules: topN(moduleCounts, 5),
    topLabs: topN(labCounts, 5),
  };
}

function stringProp(v: unknown): string | null {
  return typeof v === 'string' && v.length > 0 ? v.slice(0, 200) : null;
}

function topN(counts: Map<string, number>, n: number): Array<{ id: string; count: number }> {
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([id, count]) => ({ id, count }));
}

// Apply the small-count suppression floor: any aggregate < SMALL_COUNT_THRESHOLD
// is replaced with `null` (numeric scalars) or filtered out (top-N lists, byPath
// entries). Completion rate is also nulled when its inputs are suppressed —
// otherwise the rate would silently leak the suppressed count.
function suppressSmallCounts(w: WindowMetrics): WindowMetrics {
  const sup = (n: number | null) =>
    n == null || n < SMALL_COUNT_THRESHOLD ? null : n;

  const startedSup = sup(w.modulesStarted);
  const completedSup = sup(w.modulesCompleted);
  const labsSup = sup(w.labsCompleted);
  const rateSup = startedSup == null || completedSup == null ? null : w.moduleCompletionRate;

  const byPathFiltered: Record<string, number> = {};
  for (const [k, v] of Object.entries(w.byPath)) {
    if (v >= SMALL_COUNT_THRESHOLD) byPathFiltered[k] = v;
  }

  return {
    modulesStarted: startedSup,
    modulesCompleted: completedSup,
    moduleCompletionRate: rateSup,
    labsCompleted: labsSup,
    byPath: byPathFiltered,
    topModules: w.topModules.filter((m) => m.count >= SMALL_COUNT_THRESHOLD),
    topLabs: w.topLabs.filter((l) => l.count >= SMALL_COUNT_THRESHOLD),
  };
}
