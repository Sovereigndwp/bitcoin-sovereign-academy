/**
 * MCP API endpoint — generates site content through the MCP pipeline.
 *
 * Ported from generate-site.js so we can import the shared origin allow-list
 * (api/lib/origin.ts) and the shared rate limiter (api/rate-limiter.ts) instead
 * of duplicating their logic. Behavior unchanged.
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { setCorsHeaders } from '../lib/origin';
import { checkRateLimit } from '../rate-limiter';

interface GenerateSiteRequest {
  sources?: string[];
  audience?: string;
  duration?: number;
  language?: string;
}

interface GeneratedPage {
  path?: string;
  file?: string;
  content?: string;
  metadata?: unknown;
}

const QUALITY_THRESHOLDS = {
  fk_score: 70,
  accuracy: 0.95,
  brand_consistency: 0.80,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(req, res, 'POST, OPTIONS', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Generation is expensive — three sequential MCP RPCs per request.
  // 'api' preset (100/min/IP) is generous enough for legitimate use, low enough
  // to bound cost if abused.
  if (!(await checkRateLimit(req, res, 'api'))) return;

  try {
    const {
      sources = [],
      audience = 'high-school',
      duration = 3,
      language = 'en',
    }: GenerateSiteRequest = req.body || {};

    const MCP_BASE_URL = process.env.MCP_BASE_URL || 'http://localhost:3000';
    const MCP_API_KEY = process.env.MCP_API_KEY || '';

    const mcpHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MCP_API_KEY}`,
    };

    // Step 1: Plan the site structure
    const planResponse = await fetch(`${MCP_BASE_URL}/invoke/site_planner`, {
      method: 'POST',
      headers: mcpHeaders,
      body: JSON.stringify({ sources, audience, duration, requirements: QUALITY_THRESHOLDS }),
    });
    if (!planResponse.ok) throw new Error(`Planning failed: ${planResponse.statusText}`);
    const plan = await planResponse.json();

    // Step 2: Generate pages based on plan
    const generateResponse = await fetch(`${MCP_BASE_URL}/invoke/page_generator`, {
      method: 'POST',
      headers: mcpHeaders,
      body: JSON.stringify({ outline: plan, brand: 'bitcoin-sovereign-academy', language }),
    });
    if (!generateResponse.ok) throw new Error(`Generation failed: ${generateResponse.statusText}`);
    const pages: GeneratedPage[] = await generateResponse.json();

    // Step 3: Quality check (best-effort — non-blocking)
    const qualityResponse = await fetch(`${MCP_BASE_URL}/invoke/quality_checker`, {
      method: 'POST',
      headers: mcpHeaders,
      body: JSON.stringify({ content: pages, thresholds: QUALITY_THRESHOLDS }),
    });
    const quality = qualityResponse.ok ? await qualityResponse.json() : { passed: true };

    res.status(200).json({
      ok: true,
      plan,
      pages: pages || [],
      quality,
      files: (pages || []).map((p) => ({
        path: p.path || p.file,
        content: p.content,
        metadata: p.metadata,
      })),
    });
  } catch (error: any) {
    console.error('MCP API Error:', error);
    res.status(500).json({
      ok: false,
      error: error?.message || 'Internal server error',
      timestamp: new Date().toISOString(),
    });
  }
}
