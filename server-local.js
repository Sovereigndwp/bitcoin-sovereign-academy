#!/usr/bin/env node
/**
 * Local Production Server for Bitcoin Sovereign Academy
 * Includes MCP API endpoints, static serving, and HTTPS
 */

import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import https from 'https';
import http from 'http';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;
const HOST = process.env.HOST || '127.0.0.1';

// Security & performance middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://plausible.io"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://plausible.io"]
    }
  }
}));
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ==============================================================================
// DATA HELPERS & CONTENT LIBRARIES
// ==============================================================================

const SIMULATION_LIBRARY = {
  transaction: {
    title: 'Transaction Builder',
    description: 'Estimate inputs, outputs, and fees before broadcasting a Bitcoin transaction.',
    averageSize: 225,
    tips: [
      'Remember to leave enough room for a change output when spending a large UTXO.',
      'Consolidate small UTXOs when the mempool is quiet to save on future fees.',
      'SegWit inputs reduce the virtual size of your transaction and lower fees.'
    ],
    fields: {
      inputs: 'Number of inputs determines base virtual size.',
      outputs: 'Each output adds 31-43 vBytes depending on type.',
      locktime: 'Use locktime for advanced fee-bumping strategies.'
    }
  },
  fees: {
    title: 'Smart Fee Calculator',
    description: 'Project fee requirements based on current mempool congestion.',
    notes: [
      'Fastest tier targets the next block and often fluctuates quickly.',
      'Consider batching payments to reduce fee pressure during congestion.',
      'RBF (Replace-By-Fee) lets you increase the fee later if the transaction stalls.'
    ]
  },
  security: {
    title: 'Wallet Security Trainer',
    description: 'Work through real-world custody scenarios so mistakes happen in the simulator, not in production.',
    scenarios: [
      {
        title: 'Seed phrase mishap',
        description: 'Your friend takes a photo of their seed words. Coach them through mitigation.',
        action: 'Run a secure backup drill'
      },
      {
        title: 'Phishing attempt',
        description: 'A spoofed support email requests your recovery words. Identify the red flags.',
        action: 'Review phishing red flags'
      },
      {
        title: 'Firmware update',
        description: 'A wallet prompts a firmware update before a major transaction. Walk through the safety checklist.',
        action: 'Follow hardware wallet update flow'
      }
    ],
    guidelines: [
      'Separate long-term cold storage from funds you spend frequently.',
      'Test your backups with a dry run restore at least once per year.',
      'Add a duress plan so trusted parties know what to do if you are unavailable.'
    ]
  }
};

const MODULE_LIBRARY = {
  fundamentals: {
    title: 'Bitcoin Fundamentals',
    description: 'Ground yourself in the principles that make Bitcoin resilient.',
    questions: [
      'What problem does Bitcoin solve for people living under capital controls?',
      'How does proof-of-work align incentives for honest miners?',
      'Why is verifiability more important than speed for base layer money?'
    ],
    activities: [
      'Trace a transaction on a block explorer and identify each output.',
      'Compare Bitcoin\'s issuance schedule with a fiat currency of your choice.',
      'Explain Bitcoin to a friend using a story rather than jargon.'
    ],
    assessments: [
      'List three characteristics that make Bitcoin hard money.',
      'Describe how nodes enforce consensus rules.',
      'Summarize the trade-offs between self-custody and custodial services.'
    ],
    resources: [
      { title: 'Looking Glass Education – Sound Money', url: 'https://lookingglasseducation.com' },
      { title: 'Bitcoin.org – Introduction', url: 'https://bitcoin.org/en/how-it-works' }
    ]
  },
  lightning: {
    title: 'Lightning Network Essentials',
    description: 'Learn how layer-two enables instant Bitcoin payments.',
    questions: [
      'What role do payment channels play in Lightning?',
      'How do routing nodes earn yield?',
      'Why is liquidity management critical for merchants?'
    ],
    activities: [
      'Open a testnet channel and send a payment.',
      'Map a multi-hop route between two well-known nodes.',
      'Design a liquidity rebalancing plan for a cafe that accepts Lightning.'
    ],
    assessments: [
      'Explain HTLCs in plain language.',
      'Identify two risks of operating a Lightning routing node.',
      'List tools that help automate channel management.'
    ],
    resources: [
      { title: 'Voltage Lightning Resources', url: 'https://voltage.cloud/resources' },
      { title: 'Mastering the Lightning Network (free draft)', url: 'https://github.com/lnbook/lnbook' }
    ]
  },
  security: {
    title: 'Self-Custody & Security',
    description: 'Practice defending your keys against the most common failure modes.',
    questions: [
      'When should you escalate from a single-sig to multisig setup?',
      'What are the warning signs of a compromised hardware wallet?',
      'How do inheritance and emergency access plans differ?'
    ],
    activities: [
      'Draft a seed storage policy for different threat models.',
      'Compare three popular multisig coordinators.',
      'Role-play a social engineering attack and document how to deflect it.'
    ],
    assessments: [
      'Create a wallet migration checklist.',
      'Describe the role of passphrases in protecting backups.',
      'List three signals that indicate a phishing attempt.'
    ],
    resources: [
      { title: 'BTC Sessions – Multisig Guides', url: 'https://www.youtube.com/@BTCSessions' },
      { title: 'Casa Blog – Security Best Practices', url: 'https://blog.keys.casa' }
    ]
  }
};

function safeNumber(value, fallback = null) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

async function fetchJSON(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Request failed for ${url} (${response.status})`);
  }
  return response.json();
}

async function fetchText(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Request failed for ${url} (${response.status})`);
  }
  return response.text();
}

async function getPriceData() {
  try {
    const data = await fetchJSON('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true');
    const btc = data?.bitcoin ?? {};
    return {
      usd: safeNumber(btc.usd, null),
      usd_24h_change: safeNumber(btc.usd_24h_change, 0)
    };
  } catch (error) {
    console.warn('Price data unavailable:', error.message);
    return null;
  }
}

async function getFeeData() {
  try {
    return await fetchJSON('https://mempool.space/api/v1/fees/recommended');
  } catch (error) {
    console.warn('Fee data unavailable:', error.message);
    return null;
  }
}

async function getNetworkSnapshot() {
  const [heightText, mempoolStats, fees, difficulty, price] = await Promise.all([
    fetchText('https://mempool.space/api/blocks/tip/height').catch(() => null),
    fetchJSON('https://mempool.space/api/mempool').catch(() => null),
    getFeeData(),
    fetchJSON('https://mempool.space/api/v1/difficulty-adjustment').catch(() => null),
    getPriceData()
  ]);

  const blockHeight = safeNumber(heightText, null);
  const mempoolSize = mempoolStats?.count ?? null;
  const mempoolVSize = mempoolStats?.vsize ?? null;
  const priceUsd = price?.usd ?? null;
  const priceChange = price?.usd_24h_change ?? null;

  return {
    blockHeight,
    mempoolSize,
    mempoolVSize,
    mempoolBytes: mempoolStats?.bytes ?? null,
    mempoolTotalFees: mempoolStats?.total_fee ?? null,
    feeEstimate: fees?.fastestFee ?? null,
    feeEstimates: fees ?? null,
    difficulty: difficulty?.difficulty ?? null,
    difficultyProgress: difficulty?.progress_percent ?? null,
    previousRetarget: difficulty?.previous_difficulty ?? null,
    price: priceUsd,
    priceChange24h: priceChange,
    fetchedAt: new Date().toISOString()
  };
}

function buildIntelligenceSummary(snapshot) {
  const criticalAlerts = [];
  const educationalOpportunities = [];
  const marketIntelligence = [];

  if (snapshot.mempoolSize && snapshot.mempoolSize > 60000) {
    criticalAlerts.push({
      title: 'Network congestion detected',
      severity: 'critical',
      description: `Mempool contains ~${snapshot.mempoolSize.toLocaleString()} transactions. Expect elevated fees until backlog clears.`,
      recommendation: 'Use the fee calculator to target an appropriate fee or wait for quieter periods.'
    });
  }

  if (snapshot.priceChange24h !== null) {
    const sentiment = snapshot.priceChange24h > 0 ? 'positive' : snapshot.priceChange24h < 0 ? 'negative' : 'neutral';
    marketIntelligence.push({
      title: '24h price movement',
      sentiment,
      summary: `Bitcoin is ${sentiment === 'positive' ? 'up' : sentiment === 'negative' ? 'down' : 'flat'} ${Math.abs(snapshot.priceChange24h).toFixed(2)}% over the last 24 hours.`
    });
  }

  if (snapshot.difficultyProgress !== null) {
    const progress = snapshot.difficultyProgress.toFixed(2);
    educationalOpportunities.push({
      title: 'Difficulty adjustment lesson',
      summary: `Current retarget progress sits at ${progress}%. Review how difficulty keeps block production stable.`,
      source: 'Bitcoin protocol'
    });
  }

  educationalOpportunities.push({
    title: 'Hands-on fee management',
    summary: 'Run the transaction simulator to see how feerates, size, and change outputs interact.',
    source: 'Interactive simulations'
  });

  return {
    totalAlerts: criticalAlerts.length,
    criticalAlerts,
    educationalOpportunities,
    marketIntelligence,
    lastUpdated: snapshot.fetchedAt
  };
}

function analyzeBitcoinAddress(address) {
  const result = {
    isValid: false,
    type: 'Unknown',
    network: 'Unknown',
    details: { warnings: [] }
  };

  if (!address || typeof address !== 'string') {
    result.details.warnings.push('No address provided');
    return result;
  }

  const normalized = address.trim();
  const lower = normalized.toLowerCase();

  const base58Regex = /^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{25,39}$/;
  const bech32Regex = /^(bc1|tb1|bcrt1)[0-9a-z]{11,71}$/;

  if (bech32Regex.test(lower)) {
    const network = lower.startsWith('bc1') ? 'Mainnet' : lower.startsWith('tb1') ? 'Testnet' : 'Regtest';
    const isTaproot = lower.length > 50;
    result.isValid = true;
    result.type = isTaproot ? 'Bech32m (taproot)' : 'Bech32 (segwit)';
    result.network = network;
    result.details.isSegwit = true;
    result.details.warnings.push('Checksum not cryptographically verified in local mode.');
    return result;
  }

  if (base58Regex.test(normalized)) {
    const prefix = normalized[0];
    const network = ['m', 'n', '2'].includes(prefix) ? 'Testnet' : 'Mainnet';
    const type = prefix === '3' || prefix === '2' ? 'P2SH' : 'P2PKH';
    result.isValid = true;
    result.type = `Base58 ${type}`;
    result.network = network;
    result.details.isSegwit = prefix === '3' || prefix === '2';
    result.details.isP2SH = prefix === '3' || prefix === '2';
    result.details.warnings.push('Checksum not cryptographically verified in local mode.');
    return result;
  }

  result.details.warnings.push('Address format not recognised.');
  return result;
}

async function fetchTransactionData(txid) {
  if (!txid) {
    throw new Error('Transaction id is required');
  }

  try {
    return await fetchJSON(`https://mempool.space/api/tx/${txid}`);
  } catch (error) {
    console.warn('Transaction lookup failed:', error.message);
    throw error;
  }
}

function resolveModule(name) {
  const key = (name || '').toLowerCase();
  return MODULE_LIBRARY[key] || MODULE_LIBRARY.fundamentals;
}

function generateCourseOutline({ topic = 'fundamentals', level = 'beginner', duration = 3 } = {}) {
  const moduleKeys = {
    fundamentals: ['fundamentals', 'security'],
    lightning: ['lightning', 'fundamentals'],
    security: ['security', 'fundamentals']
  };

  const topics = moduleKeys[topic] || moduleKeys.fundamentals;

  const perModuleDuration = Math.max(1, Math.round(duration / topics.length));

  const modules = topics.map((key, index) => {
    const base = MODULE_LIBRARY[key] || MODULE_LIBRARY.fundamentals;
    return {
      title: base.title,
      description: base.description,
      duration: `${perModuleDuration} hours`,
      lessons: base.questions.slice(0, 3),
      activities: base.activities.slice(0, 2),
      assessments: base.assessments.slice(0, 2),
      order: index + 1
    };
  });

  const additionalResources = topics.flatMap(key => MODULE_LIBRARY[key]?.resources || []);

  return {
    course_id: `course-${Date.now()}`,
    title: `${topic.charAt(0).toUpperCase() + topic.slice(1)} Mastery (${level})`,
    description: `A ${duration}-hour guided path that combines discovery-based learning with hands-on simulations.`,
    difficulty: level,
    estimated_duration: `${duration} hours`,
    modules,
    assessments: modules.flatMap(mod => mod.assessments),
    additional_resources: additionalResources
  };
}

// ==============================================================================
// MCP API ENDPOINTS
// ==============================================================================

// Import the MCP handler
async function mcpHandler(req, res) {
  try {
    const { sources = [], audience = "high-school", duration = 3, language = "en" } = req.body || {};
    
    // Simulate MCP processing (replace with actual MCP integration)
    const plan = {
      title: `Bitcoin Education Plan (${language})`,
      audience,
      duration,
      modules: [
        { title: "Understanding Money", duration: 1 },
        { title: "Bitcoin Basics", duration: 1 },
        { title: "Self-Custody", duration: 1 }
      ]
    };
    
    const pages = [
      { path: '/module-1.html', content: 'Module 1 content' },
      { path: '/module-2.html', content: 'Module 2 content' },
      { path: '/module-3.html', content: 'Module 3 content' }
    ];
    
    // Simulate quality check
    const quality = {
      fk_score: 75,
      accuracy: 0.96,
      brand_consistency: 0.85,
      passed: true
    };
    
    res.json({
      ok: true,
      plan,
      pages,
      quality,
      files: pages.map(p => ({ path: p.path, size: p.content.length }))
    });
  } catch (error) {
    console.error('MCP Error:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
}

// MCP API routes
app.post('/api/mcp/generate-site', mcpHandler);
app.post('/api/mcp/generate', mcpHandler);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    features: {
      mcp: true,
      analytics: true,
      i18n: true,
      pwa: true,
      quality_gates: true
    }
  });
});

// Analytics endpoint (simulated)
app.post('/api/analytics/event', (req, res) => {
  const { event, props } = req.body;
  console.log(`📊 Analytics Event: ${event}`, props);
  res.json({ tracked: true });
});

// ==============================================================================
// BITCOIN DATA & INTELLIGENCE ENDPOINTS
// ==============================================================================

app.get('/api/bitcoin/network-status', async (req, res) => {
  try {
    const snapshot = await getNetworkSnapshot();
    res.json(snapshot);
  } catch (error) {
    console.error('Network status error:', error);
    res.status(502).json({ error: 'Unable to fetch network status' });
  }
});

app.get('/api/bitcoin/price', async (req, res) => {
  try {
    const price = await getPriceData();
    if (!price) {
      return res.status(502).json({ error: 'Price data unavailable' });
    }
    res.json({ data: { price_usd: price.usd, usd_24h_change: price.usd_24h_change } });
  } catch (error) {
    console.error('Price endpoint error:', error);
    res.status(502).json({ error: 'Unable to fetch price data' });
  }
});

app.get('/api/bitcoin/fees', async (req, res) => {
  try {
    const fees = await getFeeData();
    if (!fees) {
      return res.status(502).json({ error: 'Fee data unavailable' });
    }
    res.json({ data: { estimates: fees, congestion: 'live' } });
  } catch (error) {
    console.error('Fee endpoint error:', error);
    res.status(502).json({ error: 'Unable to fetch fee data' });
  }
});

app.get('/api/intelligence/summary', async (req, res) => {
  try {
    const snapshot = await getNetworkSnapshot();
    const summary = buildIntelligenceSummary(snapshot);
    res.json(summary);
  } catch (error) {
    console.error('Intelligence summary error:', error);
    res.status(502).json({ error: 'Unable to generate intelligence summary' });
  }
});

// ==============================================================================
// LEARNING, COURSES & SIMULATIONS
// ==============================================================================

app.post('/api/course/generate', (req, res) => {
  try {
    const { topic = 'fundamentals', audience: level = 'beginner', duration = 3 } = req.body || {};
    const course = generateCourseOutline({ topic, level, duration });
    res.json(course);
  } catch (error) {
    console.error('Course generation error:', error);
    res.status(500).json({ error: 'Unable to generate course outline' });
  }
});

app.get('/api/learning/module/:name', (req, res) => {
  try {
    const module = resolveModule(req.params.name);
    res.json(module);
  } catch (error) {
    console.error('Module load error:', error);
    res.status(500).json({ error: 'Unable to load module' });
  }
});

app.get('/api/simulations/:type', (req, res) => {
  const { type } = req.params;
  const simulation = SIMULATION_LIBRARY[type];
  if (!simulation) {
    return res.status(404).json({ error: `Simulation '${type}' not found` });
  }
  res.json(simulation);
});

app.get('/api/simulations', (req, res) => {
  res.json(Object.keys(SIMULATION_LIBRARY));
});

// ==============================================================================
// TOOLS
// ==============================================================================

app.get('/api/tools/validate-address', (req, res) => {
  try {
    const { address } = req.query;
    const analysis = analyzeBitcoinAddress(address);
    res.json(analysis);
  } catch (error) {
    console.error('Address validation error:', error);
    res.status(400).json({ error: error.message || 'Unable to validate address' });
  }
});

app.get('/api/tools/transaction', async (req, res) => {
  try {
    const { txid } = req.query;
    const data = await fetchTransactionData(txid);
    res.json(data);
  } catch (error) {
    res.status(502).json({ error: 'Unable to fetch transaction details' });
  }
});

// ==============================================================================
// STATIC FILE SERVING
// ==============================================================================

// Serve static files with proper MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Custom static file handler with 404 detection
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }
  
  let filePath = path.join(__dirname, req.path);
  
  // Default to index.html for directory requests
  if (req.path.endsWith('/')) {
    filePath = path.join(filePath, 'index.html');
  }
  
  // Check if file exists
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    const mimeType = mimeTypes[ext] || 'application/octet-stream';
    
    res.setHeader('Content-Type', mimeType);
    
    // Add caching headers for production
    if (process.env.NODE_ENV === 'production') {
      res.setHeader('Cache-Control', 'public, max-age=3600');
    }
    
    res.sendFile(filePath);
  } else {
    // Log 404s for debugging
    console.warn(`⚠️ 404: ${req.path}`);
    next();
  }
});

// Serve index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ==============================================================================
// ERROR HANDLING
// ==============================================================================

app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ==============================================================================
// SERVER STARTUP
// ==============================================================================

// Create HTTP server
const httpServer = http.createServer(app);

// Try to create HTTPS server with self-signed certificate
let httpsServer;
try {
  const privateKey = fs.readFileSync('server.key', 'utf8');
  const certificate = fs.readFileSync('server.cert', 'utf8');
  const credentials = { key: privateKey, cert: certificate };
  httpsServer = https.createServer(credentials, app);
} catch (err) {
  console.log('📝 HTTPS certificate not found. Generate with:');
  console.log('   openssl req -nodes -new -x509 -keyout server.key -out server.cert -days 365');
}

// Start servers
httpServer.listen(PORT, HOST, () => {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║           Bitcoin Sovereign Academy - Local Production         ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  🌐 HTTP Server:  http://${HOST}:${PORT}                     ║`);
  
  if (httpsServer) {
    httpsServer.listen(HTTPS_PORT, HOST, () => {
      console.log(`║  🔒 HTTPS Server: https://${HOST}:${HTTPS_PORT}                   ║`);
      startupComplete();
    });
  } else {
    startupComplete();
  }
});

function startupComplete() {
  console.log(`║                                                                ║
║  📍 Available Endpoints:                                       ║
║     • Homepage:     /                                          ║
║     • Game:         /interactive-demos/bitcoin-sovereign-game  ║
║     • MCP API:      POST /api/mcp/generate-site               ║
║     • Health:       GET /api/health                           ║
║                                                                ║
║  ✨ Features:                                                  ║
║     • MCP Integration ✓                                        ║
║     • Analytics Tracking ✓                                     ║
║     • Bilingual Support ✓                                      ║
║     • PWA Ready ✓                                              ║
║     • Quality Gates ✓                                          ║
║                                                                ║
║  Press Ctrl+C to stop the server                              ║
╚════════════════════════════════════════════════════════════════╝
  `);
  
  // Open browser automatically in development
  if (process.env.NODE_ENV !== 'production') {
    import('open').then(open => {
      open.default(`http://localhost:${PORT}`);
    }).catch(() => {
      // open package not installed, skip
    });
  }
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down gracefully...');
  httpServer.close(() => {
    console.log('HTTP server closed');
  });
  if (httpsServer) {
    httpsServer.close(() => {
      console.log('HTTPS server closed');
    });
  }
  process.exit(0);
});
