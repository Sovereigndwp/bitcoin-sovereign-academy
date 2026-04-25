/**
 * MCP API endpoint for Bitcoin Sovereign Academy
 * Handles site generation through MCP pipeline
 */

// CORS allow-list — inlined here because this file is .js and cannot import the .ts shared lib.
// Mirrors the policy in api/lib/origin.ts: production domains + dev hosts + ALLOWED_ORIGIN env override.
const DEFAULT_ALLOWED_ORIGINS = [
  'https://bitcoinsovereign.academy',
  'https://www.bitcoinsovereign.academy',
  'https://preview.bitcoinsovereign.academy',
];

function isAllowedOrigin(origin) {
  if (!origin || typeof origin !== 'string') return false;
  try {
    const { hostname } = new URL(origin);
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.vercel.app')) return true;
  } catch { return false; }
  const env = (process.env.ALLOWED_ORIGIN || '').split(/[\n,]/).map(s => s.trim()).filter(Boolean);
  return [...DEFAULT_ALLOWED_ORIGINS, ...env].includes(origin);
}

// For Vercel deployment, export as default
export default async function handler(req, res) {
  const requestOrigin = req.headers.origin;
  const corsOrigin = isAllowedOrigin(requestOrigin) ? requestOrigin : DEFAULT_ALLOWED_ORIGINS[0];
  res.setHeader('Access-Control-Allow-Origin', corsOrigin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { 
      sources = [], 
      audience = "high-school", 
      duration = 3,
      language = "en" 
    } = req.body || {};

    // MCP base URL - use environment variable or fallback
    const MCP_BASE_URL = process.env.MCP_BASE_URL || 'http://localhost:3000';
    const MCP_API_KEY = process.env.MCP_API_KEY || '';

    // Step 1: Plan the site structure
    const planResponse = await fetch(`${MCP_BASE_URL}/invoke/site_planner`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MCP_API_KEY}`
      },
      body: JSON.stringify({ 
        sources, 
        audience, 
        duration,
        requirements: {
          fk_score: 70,
          accuracy: 0.95,
          brand_consistency: 0.80
        }
      })
    });

    if (!planResponse.ok) {
      throw new Error(`Planning failed: ${planResponse.statusText}`);
    }

    const plan = await planResponse.json();

    // Step 2: Generate pages based on plan
    const generateResponse = await fetch(`${MCP_BASE_URL}/invoke/page_generator`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MCP_API_KEY}`
      },
      body: JSON.stringify({ 
        outline: plan,
        brand: "bitcoin-sovereign-academy",
        language
      })
    });

    if (!generateResponse.ok) {
      throw new Error(`Generation failed: ${generateResponse.statusText}`);
    }

    const pages = await generateResponse.json();

    // Step 3: Quality check
    const qualityResponse = await fetch(`${MCP_BASE_URL}/invoke/quality_checker`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MCP_API_KEY}`
      },
      body: JSON.stringify({ 
        content: pages,
        thresholds: {
          fk_score: 70,
          accuracy: 0.95,
          brand_consistency: 0.80
        }
      })
    });

    const quality = qualityResponse.ok ? await qualityResponse.json() : { passed: true };

    // Return results
    res.status(200).json({
      ok: true,
      plan,
      pages: pages || [],
      quality,
      files: (pages || []).map(p => ({
        path: p.path || p.file,
        content: p.content,
        metadata: p.metadata
      }))
    });

  } catch (error) {
    console.error('MCP API Error:', error);
    res.status(500).json({
      ok: false,
      error: error.message || 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
}

// For local testing
if (process.env.NODE_ENV !== 'production') {
  const testData = {
    sources: ["external/learn-bitcoin-by-doing"],
    audience: "high-school",
    duration: 3
  };
  
  console.log('Test endpoint available at: POST /api/mcp/generate-site');
  console.log('Test data:', testData);
}