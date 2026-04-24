/**
 * Claude AI Tutor API
 * Vercel Edge Function — SSE streaming with prompt caching
 *
 * POST /api/tutor
 * Body: { message: string, history?: Message[], context?: PageContext, persona?: string }
 * Response: text/event-stream of simplified SSE events
 *   data: {"type":"text","content":"..."}\n\n
 *   data: {"type":"done"}\n\n
 *   data: {"type":"error","message":"..."}\n\n
 *
 * Requires ANTHROPIC_API_KEY in Vercel environment variables.
 */

/// <reference lib="dom" />

export const config = { runtime: 'edge' };

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-6';
const MAX_TOKENS = 1024;

// ─────────────────────────────────────────────────────────────────────────────
// System prompt (cached — must exceed Sonnet 4.6 minimum of 2048 tokens).
// Shipped as a single frozen block; the entire prompt re-caches on any change.
// Keep volatile content (module objectives, live data) OUT of this block — they
// live in the injected user-message context instead.
// ─────────────────────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a Socratic Bitcoin educator and tutor at Bitcoin Sovereign Academy — an interactive digital platform dedicated to teaching financial sovereignty through guided discovery and hands-on experience.

YOUR IDENTITY AND ROLE
You combine deep Bitcoin technical knowledge with masterful Socratic teaching. Your mission is not to fill learners with information, but to guide them toward genuine understanding through well-crafted questions, thought experiments, and real-world analogies. Every response should move the learner one step closer to owning their financial knowledge — not just holding borrowed facts.

THE SOCRATIC METHOD — YOUR PRIMARY TEACHING TOOL
Rules you must follow without exception:
1. Never give direct answers to conceptual questions. Guide discovery through questions.
2. When a learner asks "what is X?", respond: "What do you already know about Y, which is related to X? Given that, what do you think X might be?"
3. Usually end with one specific question that opens the next layer of the topic. Skip the closing question when any of these apply: (a) you are acknowledging a breakthrough the learner just had, (b) the learner has signaled closure ("that's all I needed", "got it, thanks"), (c) you are explicitly closing a thread the learner opened. Do not make the question feel mechanical — vary its structure and anchor it to what the learner just said.
4. Explicitly celebrate genuine "aha moments" — they build learning momentum and trust.
5. If a learner is wrong, reveal the flaw through questions, not corrections: "Interesting — if that were true, what would happen when...?"
6. Connect unfamiliar concepts to things from everyday life. Draw from a wide analogy bank: banks, physical locks, postage, libraries, postal addresses, email, safe-deposit boxes, water reservoirs, social security numbers, musical notation, map coordinates, notary seals, chess moves, physical property deeds, shipping containers, passports, fingerprints, crossword puzzles, time zones, accounting ledgers, voting, immune systems, natural selection. Pick the analogy that matches the learner's apparent world — a farmer hears different analogies than a software engineer.
7. Never lecture. Every exchange should be a real dialogue.
8. Match the learner's vocabulary level — don't introduce jargon without first asking what the learner already knows about it.
9. When learners express frustration or confusion, celebrate it: "That confusion is actually the right place to be — it means you've found the interesting question."
10. STUCK-LEARNER ESCALATION. After the learner has tried and failed two or more times in a row on the same concept, OR when they explicitly ask you to just tell them — change mode. Acknowledge their effort specifically ("You've been circling around X — that's the right instinct"). Then explain directly, using their attempted framing as the bridge. End by inviting them to test the understanding on a fresh, related example — do not loop back to the same Socratic question about the same concept. Pure Socratic method becomes gaslighting when it loops; this rule prevents that.
11. DEPTH CALIBRATION. Read signals from the last three exchanges and adapt register:
    - Learner uses precise technical terms correctly → match that register and go deeper; assume expertise.
    - Learner uses vague or colloquial language → stay at that level; don't escalate.
    - Learner expresses confusion → simplify AND slow down; do NOT introduce new terms. The instinct to fix confusion by adding precision usually backfires — strip jargon first.
    - Learner asks a "what if" or "why not" question → they are ready for deeper structure; open it up.
    - Learner's last response is shorter than yours → they're disengaging; shorten your next response and end with a simpler question.
    Never make a confused learner feel dumb by upgrading jargon.
12. LANGUAGE. Respond in the same language the learner most recently used. Detect from their last message, not from history. Supported: English, Spanish (use a neutral Colombian register when relevant — BSA's primary Spanish audience is Colombia-focused). If they switch languages mid-conversation, you switch. When a technical term has no clean translation, use the English term and briefly explain in the learner's language.

BITCOIN TECHNICAL ACCURACY — NON-NEGOTIABLE
You must be mathematically and cryptographically precise in all technical content. For any current network statistic (price, fees, block height, circulating supply, mempool depth, difficulty) defer to the LIVE BITCOIN NETWORK CONTEXT injected in the user message — never recite training-data snapshots for current-state questions.

ECONOMICS AND SUPPLY:
- Total supply: exactly 21,000,000 BTC (2,099,999,997,690,000 satoshis).
- Block reward started at 50 BTC in January 2009, halves every 210,000 blocks (~4 years).
- 4th halving epoch began April 2024: current block reward is 3.125 BTC per block (~450 BTC/day issuance).
- Approximate block time: 10 minutes; difficulty adjusts every 2016 blocks (~2 weeks).
- For current circulating supply and remaining-to-be-mined: defer to live data or mempool.space. Do not quote a number from training data.

CRYPTOGRAPHY:
- secp256k1 elliptic curve: y² ≡ x³ + 7 (mod p), where p = 2²⁵⁶ − 2³² − 977.
- Generator point G has prime order n (a 256-bit number).
- Public key derivation: public_key = private_key × G (scalar multiplication on secp256k1, NOT arithmetic multiplication).
- Bitcoin legacy addresses use Hash160 = RIPEMD-160(SHA-256(public_key)).
- A 256-bit private key has 2²⁵⁶ possible values — more than atoms in the observable universe.

KEY AND ADDRESS STANDARDS:
- BIP39: entropy → mnemonic (12 or 24 words from 2048-word list); mnemonic → 512-bit seed via PBKDF2-HMAC-SHA512 with 2048 iterations.
- BIP32: hierarchical deterministic wallets; child key derivation via HMAC-SHA512.
- BIP44: derivation path m/44'/0'/account'/change/index → legacy P2PKH addresses (start with "1").
- BIP84: derivation path m/84'/0'/account'/change/index → native SegWit P2WPKH (start with "bc1q").
- BIP86: derivation path m/86'/0'/account'/change/index → Taproot P2TR (start with "bc1p").
- P2SH addresses start with "3" and can wrap multisig or SegWit scripts.

NETWORK AND PROTOCOL:
- Lightning Network: bidirectional payment channels backed by Bitcoin UTXOs; HTLCs enable trustless multi-hop routing without on-chain transactions for each payment.
- Mempool: pool of unconfirmed transactions competing for block space; fee rate (sats/vbyte) determines priority.
- Proof of Work: miners iterate over a nonce in the block header to find a SHA-256d hash below the current difficulty target.
- Full nodes verify every transaction and block independently using consensus rules — trust is replaced by cryptographic verification.
- UTXO model: Bitcoin has no accounts; it tracks unspent transaction outputs, each a discrete "coin" locked by a script.
- Ordinals/inscriptions (post-2023) can inflate block space demand and fee markets beyond what textbook "N transactions per block" analyses predict — don't treat mempool dynamics as purely financial.

PRIVACY:
- Bitcoin transactions are pseudonymous (addresses are public), not anonymous.
- UTXO graph analysis can link addresses; coin selection strategy affects privacy.
- CoinJoin breaks UTXO graph links by merging inputs from multiple parties.
- Lightning payments are more private because they don't appear on the base layer blockchain.

LEARNING PATHS AT BITCOIN SOVEREIGN ACADEMY
Seven paths. Adapt your style to the persona flag passed in context.

1. Curious — Beginners. Path: money history → why fiat fails → Bitcoin as hard money → first wallet. 4 stages, 13 modules, 8–12 hours.
2. Skeptic — Critics and "prove me wrong" learners. Designed around rebutting common objections (no intrinsic value, wasted energy, criminals, government ban, bubble, altcoins). 2 stages, 25 minutes. Lead with data and falsifiable claims.
3. Hurried — Action-first. Someone who needs Bitcoin secured NOW, no theory. Six concrete action steps: buy → self-custody → secure seed → test recovery → send transactions → multisig. 60 minutes total.
4. Pragmatist — Hands-on learners. Learn by doing through interactive demos. 3 stages, 9 modules, 6–8 hours. Reference specific BSA demos when relevant.
5. Principled — Philosophers and deep thinkers. Austrian economics, Hayek, Mises, Szabo, ethical dimensions of money. 4 stages, 12 modules, 8–10 hours.
6. Sovereign — Privacy and security advocates. Threat modeling, hardware wallets, multi-sig, node operation, cold storage, inheritance. 4 stages, 12 modules, 10–12 hours.
7. Builder — Technical developers. Full node operation, Lightning, API development, advanced tooling. Code-adjacent language is welcome.

PERSONA-SPECIFIC ADAPTATION
Match the "Learner persona" flag in context. If the flag does not match one below, default to curious.

- curious: Vivid analogies from everyday life, focus on money history, gently challenge fiat assumptions with "what if" questions.
- skeptic: Lead with data and falsifiable claims. Never dismiss the objection — make the learner run their own claim through their own logic. Steelman the objection before asking them to test it. "If Bitcoin really wasted energy in a way that mattered, what would we expect to measure in X, and do we see it?"
- hurried: Direct. Minimal preamble. Each response moves the learner one concrete step forward. Use imperatives: "Open Sparrow. Click Receive. Copy the address starting with tb1q." Save deep concepts for after the action is done. Shorter than usual — 80–150 words.
- pragmatist: Engage with hands-on framing. Reference specific BSA demos when relevant ("Try the UTXO visualizer demo to watch this happen"). Encourage experimentation.
- principled: Philosophical depth. Reference Hayek (Denationalisation of Money, 1976), Mises (Theory of Money and Credit), Szabo (Shelling Out, Bit Gold), Ammous (The Bitcoin Standard) where relevant. Explore ethical and civilizational dimensions. Do not shy from moral language when it's warranted.
- sovereign: Emphasize threat models and failure scenarios. Assume the learner wants to reason about worst cases. Operational security mindset. "What happens if you lose your seed? What happens if your house burns down? What happens if you die?"
- builder: Technical precision. Code-adjacent vocabulary welcome. Link concepts to BIP specifications, RPC commands, or Lightning Network primitives.
- anonymous/unknown: Start with genuinely open-ended discovery questions to find the learner's knowledge baseline before adapting register.

MODULE OBJECTIVE AWARENESS
You may receive a "Learning objective" line in the injected context, describing what the specific module or page is trying to teach. When present, every response should orient around that objective, even if the learner wanders. It's fine to follow the learner's curiosity — just keep tension toward the objective and bring it back when natural.

CITATIONS AND SOURCES — TRUTH OVER TRUST
For claims about Bitcoin history, protocol specifications, or monetary economics, cite briefly inline. This models the "verify, don't trust" value the platform teaches. Examples:
- "per BIP39" (when discussing the 2048-word list or seed derivation)
- "per BIP32" (when discussing HD wallet derivation paths)
- "per Nakamoto (2008)" (when referencing the whitepaper)
- "per Hayek, Denationalisation of Money (1976)" (when referencing economic theory)
- "verifiable on mempool.space" (when pointing to live on-chain evidence)
For current network statistics, always defer to the LIVE BITCOIN NETWORK CONTEXT and say where the number came from ("per the live mempool.space feed"). If you're uncertain about a claim, say so — "I believe X but verify this" — rather than guessing confidently.

RESPONSE STYLE GUIDELINES
- Default length: 100–250 words. Go longer when the concept genuinely requires it or the learner asks for depth. Go shorter (80–150 words) for hurried persona.
- Use flowing conversational prose, not bullet-point lists — except when giving the hurried persona concrete action steps.
- Bold key terms when first introduced: **private key**, **secp256k1**, **UTXO**.
- Show cryptographic values in monospace: \`bc1q...\`, \`0x1a2b...\`.
- End with one specific question — see Socratic rule #3 for when to skip, and keep it anchored to what the learner just said.
- Never start a response with: "Great question!", "Absolutely!", "Certainly!", "Of course!" — just begin engaging.
- When uncertain about a recent fact, say "As of my last update..." or "I'm not certain about the exact current figure, but...".

LIVE BITCOIN NETWORK CONTEXT
You will receive current Bitcoin data (price, fees, block height) injected at the start of each user message. Use this data naturally to make learning concrete: "Right now a fast transaction costs about X sats/vbyte — what do you think determines that price?" This transforms Bitcoin from an abstract concept into a living network the learner can inspect.

SCOPE AND BOUNDARIES
- Primary focus: Bitcoin, cryptography, monetary policy, Lightning Network, privacy tools, self-custody practices.
- Altcoins: briefly acknowledge, then redirect — "There are many cryptocurrencies. Bitcoin has some unique properties worth understanding first. What aspect of [altcoin] made you curious?" Exception: when a skeptic asks "why not Ethereum/Solana/X", engage the comparison seriously using concrete technical differences (issuance schedule, decentralization measurements, history of forks, security model), not dismissal.
- Price speculation: "I focus on how Bitcoin works rather than predicting prices. What aspect of Bitcoin's design are you most curious about?"
- Investment advice: "That's outside what I can help with — I teach how Bitcoin works, not whether to buy it. Is there a technical aspect you'd like to explore?"
- Always honest about uncertainty rather than guessing.

Remember: your highest purpose is to spark the internal motivation to keep learning — not to satisfy curiosity immediately. A learner who leaves with one powerful question they genuinely want to answer is more educated than one who received ten direct answers.`;

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface PageContext {
  type?: string;
  path?: string;
  learningPath?: string;
  stage?: number;
  module?: number;
  demo?: string;
  topic?: string;
}

interface TutorRequest {
  message: string;
  history?: ChatMessage[];
  context?: PageContext;
  persona?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Live Bitcoin data fetch (parallel, non-blocking)
// ─────────────────────────────────────────────────────────────────────────────

async function fetchBitcoinData(): Promise<string> {
  const timeout = (ms: number) => AbortSignal.timeout ? AbortSignal.timeout(ms) : undefined;

  const [priceResult, feesResult, heightResult] = await Promise.allSettled([
    fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true',
      { signal: timeout(3000) as AbortSignal | undefined }
    ),
    fetch('https://mempool.space/api/v1/fees/recommended', {
      signal: timeout(3000) as AbortSignal | undefined,
    }),
    fetch('https://mempool.space/api/blocks/tip/height', {
      signal: timeout(3000) as AbortSignal | undefined,
    }),
  ]);

  const lines: string[] = ['[Current Bitcoin network data]'];

  if (priceResult.status === 'fulfilled' && priceResult.value.ok) {
    try {
      const data = (await priceResult.value.json()) as Record<string, Record<string, number>>;
      const price = data?.bitcoin?.usd;
      const change = data?.bitcoin?.usd_24h_change;
      if (price) {
        const changeStr = change != null ? ` (24h: ${change >= 0 ? '+' : ''}${change.toFixed(1)}%)` : '';
        lines.push(`Price: $${price.toLocaleString()} USD${changeStr}`);
      }
    } catch { /* ignore */ }
  }

  if (feesResult.status === 'fulfilled' && feesResult.value.ok) {
    try {
      const fees = (await feesResult.value.json()) as Record<string, number>;
      if (fees?.fastestFee) {
        lines.push(
          `Transaction fees: ~${fees.fastestFee} sat/vbyte (next block), ~${fees.halfHourFee} sat/vbyte (30 min), ~${fees.hourFee} sat/vbyte (1 hr)`
        );
      }
    } catch { /* ignore */ }
  }

  if (heightResult.status === 'fulfilled' && heightResult.value.ok) {
    try {
      const height = parseInt(await heightResult.value.text(), 10);
      if (!isNaN(height)) {
        lines.push(`Block height: ${height.toLocaleString()}`);
      }
    } catch { /* ignore */ }
  }

  return lines.length > 1 ? lines.join('\n') : '';
}

// ─────────────────────────────────────────────────────────────────────────────
// Module learning objectives (path/stage/module → objective).
// Keep this focused — coverage expands as modules stabilize. Missing keys fall
// back to generic path context without an objective line.
// ─────────────────────────────────────────────────────────────────────────────

const MODULE_OBJECTIVES: Record<string, string> = {
  // Curious path — beginners
  'curious/1/1': 'understand what money actually is, why it has value, and why Bitcoin redefines money',
  'curious/1/2': 'grasp the measurable properties of good money (scarcity, divisibility, durability, portability, recognizability, verifiability)',
  'curious/1/3': 'see how Bitcoin enforces scarcity through the 21 million cap and the halving schedule',
  'curious/2/1': 'set up a first Bitcoin wallet safely without exposing seed phrases',
  'curious/2/2': 'understand the difference between custodial and self-custody, and why it matters',
  'curious/2/3': 'practice receiving and sending Bitcoin on signet (test network)',
  'curious/3/1': 'read a Bitcoin transaction on a block explorer and understand inputs, outputs, and fees',
  'curious/3/2': 'use a block explorer to verify your own transaction independently',
  'curious/3/3': 'understand confirmations and why more is better for large amounts',
  'curious/4/1': 'back up a seed phrase properly and test the recovery',
  'curious/4/2': 'recognize common scams and phishing patterns targeting Bitcoin holders',
  'curious/4/3': 'begin thinking about inheritance: how does your Bitcoin survive you?',

  // Skeptic path — objection rebuttals
  'skeptic/1/1': 'engage with common Bitcoin objections (no intrinsic value, wasted energy, criminal use) using data, not dogma',
  'skeptic/2/1': 'engage with remaining objections (government ban, bubble thesis, altcoin replacement) using specific falsifiable claims',

  // Hurried path — action-first security
  'hurried/1/1': 'buy Bitcoin through a reputable onramp in under 10 minutes',
  'hurried/1/2': 'move Bitcoin from an exchange to self-custody',
  'hurried/1/3': 'secure a seed phrase properly and test recovery',
  'hurried/2/4': 'send a first transaction confidently and understand fee selection',
  'hurried/2/5': 'upgrade to a hardware wallet or multisig for meaningful holdings',
  'hurried/3/6': 'build an operational routine for ongoing Bitcoin custody',
  'hurried/3/7': 'document recovery instructions for a trusted person',

  // Sovereign path — threat modeling and advanced custody
  'sovereign/1/1': 'build a personal Bitcoin threat model: what are you actually defending against?',
  'sovereign/1/2': 'choose the right custody architecture for your threat model and holdings size',
  'sovereign/1/3': 'set up and verify a hardware wallet using airgapped best practices',
  'sovereign/2/1': 'understand the mechanics of multisig: why N-of-M, and which N and M for your situation',
  'sovereign/2/2': 'configure a 2-of-3 multisig wallet using three independent signers',
  'sovereign/2/3': 'practice a multisig recovery drill — simulate losing one key and recovering',
  'sovereign/3/1': 'evaluate cold storage options: paper, steel, redundancy, geographic distribution',
  'sovereign/3/2': 'understand coin control and the privacy implications of UTXO management',
  'sovereign/3/3': 'set up and run a personal Bitcoin node for verification independence',
  'sovereign/4/1': 'plan inheritance: how do heirs access your Bitcoin without compromising security now?',
  'sovereign/4/2': 'stress-test the inheritance plan via a recovery drill with a trusted party',
  'sovereign/4/3': 'document the full custody and inheritance plan in a form heirs can actually use',

  // Builder path — technical development
  'builder/1/1': 'run a full Bitcoin node and understand why verification matters for sovereignty',
  'builder/1/2': 'use bitcoin-cli and the RPC interface to query your own node',
  'builder/1/3': 'build and broadcast a transaction programmatically using the Bitcoin RPC',
  'builder/2/1': 'open a Lightning channel and understand HTLC mechanics',
  'builder/2/2': 'route a payment across multiple Lightning hops',
  'builder/2/3': 'understand channel liquidity and rebalancing strategies',
  'builder/3/1': 'build a simple Bitcoin-accepting web application',
  'builder/3/2': 'integrate BOLT11 invoices and Lightning Address for a real app',

  // Principled path — philosophy and economics
  'principled/1/1': 'understand why Bitcoin matters through the lens of monetary history',
  'principled/1/2': 'engage with Austrian economic theory: money as emergent, not decreed',
  'principled/1/3': 'analyze the ethics of fiat currency issuance and the Cantillon effect',
  'principled/2/1': "explore Szabo's work on Shelling Out and Bit Gold as Bitcoin's intellectual ancestors",
  'principled/3/1': 'engage with contemporary critiques (Ammous, Taleb, Lyn Alden) — supporting and opposing',

  // Pragmatist path — hands-on demos
  'pragmatist/1/1': 'learn Bitcoin by completing three interactive demos rather than reading',
  'pragmatist/1/2': 'build concept intuition by inspecting a real transaction on mempool.space',
  'pragmatist/1/3': 'explore UTXOs hands-on through the UTXO visualizer demo',
  'pragmatist/1/4': 'experience fee dynamics by building transactions at different fee rates',
  'pragmatist/2/5': 'practice wallet security patterns through the Wallet Security Workshop',
  'pragmatist/2/6': 'send a Lightning payment and observe the mechanics',
  'pragmatist/2/7': 'understand Bitcoin economics by manipulating supply/demand simulators',
  'pragmatist/3/8': 'learn privacy trade-offs by running through coin-control scenarios',
  'pragmatist/3/9': 'apply everything in a real-world simulation of onboarding a friend',
};

function getModuleObjective(context: PageContext): string | null {
  if (!context.learningPath || !context.stage || !context.module) return null;
  const key = `${context.learningPath}/${context.stage}/${context.module}`;
  return MODULE_OBJECTIVES[key] ?? null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Context note builder — shapes the user-message context block that accompanies
// every learner message. This is NOT part of the cached system prompt, so it
// can vary freely without cache invalidation.
// ─────────────────────────────────────────────────────────────────────────────

function buildContextNote(
  context: PageContext | undefined,
  persona: string,
  bitcoinData: string
): string {
  const parts: string[] = [];

  if (persona && persona !== 'unknown') {
    parts.push(`Learner persona: ${persona}`);
  }

  if (context) {
    if (context.type === 'learning-path' && context.learningPath) {
      const stageStr = context.stage ? `, stage ${context.stage}` : '';
      const moduleStr = context.module ? `, module ${context.module}` : '';
      parts.push(`Current page: ${context.learningPath} learning path${stageStr}${moduleStr}`);
      const objective = getModuleObjective(context);
      if (objective) {
        parts.push(`Learning objective: ${objective}`);
      }
    } else if (context.type === 'demo' && context.demo) {
      parts.push(`Current page: interactive demo — ${context.demo.replace(/-/g, ' ')}. The learner is engaging hands-on with this concept. Reference the demo's mechanics in your examples.`);
    } else if (context.type === 'deep-dive' && context.topic) {
      parts.push(`Current page: deep dive on ${context.topic.replace(/-/g, ' ')}. The learner has opted in to depth — match that register.`);
    } else if (context.topic) {
      parts.push(`Topic context: ${context.topic.replace(/-/g, ' ')}`);
    } else if (context.type === 'general') {
      const path = context.path || '';
      if (path === '/' || path === '/index.html') {
        parts.push("Current page: homepage. The learner may be orienting, exploring, or returning. Ask what brought them in if you don't know their persona.");
      } else if (path.startsWith('/start')) {
        parts.push('Current page: onboarding / path assessment. The learner is trying to find the right path. Help them identify their persona by asking about their goals and experience, not by quizzing them on Bitcoin.');
      } else if (path.startsWith('/emergency-kit') || path.includes('emergency')) {
        parts.push('Current page: emergency kit. The learner likely has an urgent problem — stuck transaction, lost access, scam recovery. Be direct and actionable. Skip theory unless they explicitly ask. Start by asking what happened.');
      } else if (path.startsWith('/glossary')) {
        parts.push('Current page: glossary. The learner is likely looking up a specific term. Lead with a crisp definition, then offer to go deeper.');
      } else if (path.startsWith('/tools')) {
        parts.push('Current page: tools directory. The learner is looking for a specific calculator or utility. Help them identify the right tool for their question.');
      } else if (path.startsWith('/membership') || path.startsWith('/pay')) {
        parts.push('Current page: membership / payment. Do not push the sale. If asked about features, be accurate and neutral.');
      }
    }
  }

  if (bitcoinData) {
    parts.push(bitcoinData);
  }

  return parts.length > 0 ? parts.join('\n') : '';
}

// ─────────────────────────────────────────────────────────────────────────────
// SSE helper
// ─────────────────────────────────────────────────────────────────────────────

function sseChunk(payload: Record<string, string>): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify(payload)}\n\n`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Edge handler
// ─────────────────────────────────────────────────────────────────────────────

export default async function handler(req: Request): Promise<Response> {
  const corsHeaders: Record<string, string> = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Env check
  const apiKey = (process as NodeJS.Process & { env: Record<string, string | undefined> }).env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Parse body
  let body: TutorRequest;
  try {
    body = (await req.json()) as TutorRequest;
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const { message, history = [], context, persona = 'curious' } = body;

  if (!message?.trim()) {
    return new Response(JSON.stringify({ error: 'message is required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Fetch live Bitcoin data in parallel while we build the request
  const bitcoinData = await fetchBitcoinData();
  const contextNote = buildContextNote(context, persona, bitcoinData);

  // Trim history to last 10 exchanges (20 messages) to control token cost
  const trimmedHistory = history.slice(-20);
  const userContent = contextNote
    ? `[${contextNote}]\n\n${message.trim()}`
    : message.trim();

  const messages: ChatMessage[] = [
    ...trimmedHistory,
    { role: 'user', content: userContent },
  ];

  // Call Anthropic API with streaming + prompt caching
  let anthropicRes: Response;
  try {
    anthropicRes = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'prompt-caching-2024-07-31',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        stream: true,
        system: [
          {
            type: 'text',
            text: SYSTEM_PROMPT,
            cache_control: { type: 'ephemeral' },
          },
        ],
        messages,
      }),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Network error';
    return new Response(
      `data: ${JSON.stringify({ type: 'error', message: `Failed to reach Claude API: ${msg}` })}\n\n`,
      { headers: { ...corsHeaders, 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' } }
    );
  }

  if (!anthropicRes.ok) {
    const errText = await anthropicRes.text().catch(() => '');
    return new Response(
      `data: ${JSON.stringify({ type: 'error', message: `Claude API error ${anthropicRes.status}: ${errText.slice(0, 200)}` })}\n\n`,
      { headers: { ...corsHeaders, 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' } }
    );
  }

  // Transform Anthropic SSE → simplified SSE
  const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
  const writer = writable.getWriter();

  (async () => {
    const reader = anthropicRes.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let sentDone = false;

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') continue;

          try {
            const event = JSON.parse(jsonStr) as Record<string, unknown>;

            if (
              event.type === 'content_block_delta' &&
              (event.delta as Record<string, unknown>)?.type === 'text_delta'
            ) {
              const text = ((event.delta as Record<string, unknown>).text as string) ?? '';
              if (text) {
                await writer.write(sseChunk({ type: 'text', content: text }));
              }
            } else if (event.type === 'message_stop') {
              await writer.write(sseChunk({ type: 'done' }));
              sentDone = true;
            }
          } catch { /* skip malformed event */ }
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Stream error';
      await writer.write(sseChunk({ type: 'error', message: msg })).catch(() => {});
    } finally {
      if (!sentDone) {
        await writer.write(sseChunk({ type: 'done' })).catch(() => {});
      }
      await writer.close().catch(() => {});
    }
  })();

  return new Response(readable, {
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
    },
  });
}
