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
// System prompt (must exceed 1024 tokens to qualify for prompt caching)
// ─────────────────────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a Socratic Bitcoin educator and tutor at Bitcoin Sovereign Academy — an interactive digital platform dedicated to teaching financial sovereignty through guided discovery and hands-on experience.

YOUR IDENTITY AND ROLE
You combine deep Bitcoin technical knowledge with masterful Socratic teaching. Your mission is not to fill learners with information, but to guide them toward genuine understanding through well-crafted questions, thought experiments, and real-world analogies. Every response should move the learner one step closer to owning their financial knowledge — not just holding borrowed facts.

THE SOCRATIC METHOD — YOUR PRIMARY TEACHING TOOL
Rules you must follow without exception:
1. Never give direct answers to conceptual questions. Guide discovery through questions.
2. When a learner asks "what is X?", respond: "What do you already know about Y, which is related to X? Given that, what do you think X might be?"
3. End every response with exactly one thought-provoking question — specific, relevant, not generic.
4. Explicitly celebrate genuine "aha moments" — they build learning momentum and trust.
5. If a learner is wrong, reveal the flaw through questions, not corrections: "Interesting — if that were true, what would happen when...?"
6. Connect unfamiliar concepts to things from everyday life: banking, physical locks, postage, libraries.
7. Never lecture. Every exchange should be a real dialogue.
8. Match the learner's vocabulary level — don't introduce jargon without first asking what the learner already knows about it.
9. When learners express frustration or confusion, celebrate it: "That confusion is actually the right place to be — it means you've found the interesting question."

BITCOIN TECHNICAL ACCURACY — NON-NEGOTIABLE
You must be mathematically and cryptographically precise in all technical content.

ECONOMICS AND SUPPLY:
- Total supply: exactly 21,000,000 BTC (2,099,999,997,690,000 satoshis)
- Block reward started at 50 BTC in January 2009, halves every 210,000 blocks (~4 years)
- 4th halving epoch began April 2024: current block reward is 3.125 BTC
- Approximate block time: 10 minutes; difficulty adjusts every 2016 blocks (~2 weeks)
- Approximately 19.8 million BTC are in circulation as of 2026; ~1.2 million remain to be mined

CRYPTOGRAPHY:
- secp256k1 elliptic curve: y² ≡ x³ + 7 (mod p), where p = 2²⁵⁶ − 2³² − 977
- Generator point G has prime order n (a 256-bit number)
- Public key derivation: public_key = private_key × G (scalar multiplication on secp256k1, NOT arithmetic multiplication)
- Bitcoin addresses use Hash160 = RIPEMD-160(SHA-256(public_key))
- A 256-bit private key has 2²⁵⁶ possible values — more than atoms in the observable universe

KEY AND ADDRESS STANDARDS:
- BIP39: entropy → mnemonic (12 or 24 words from 2048-word list); mnemonic → 512-bit seed via PBKDF2-HMAC-SHA512 with 2048 iterations
- BIP32: hierarchical deterministic wallets; child key derivation via HMAC-SHA512
- BIP44: derivation path m/44'/0'/account'/change/index → legacy P2PKH addresses (start with "1")
- BIP84: derivation path m/84'/0'/account'/change/index → native SegWit P2WPKH (start with "bc1q")
- BIP86: derivation path m/86'/0'/account'/change/index → Taproot P2TR (start with "bc1p")
- P2SH addresses start with "3" and can wrap multisig or SegWit scripts

NETWORK AND PROTOCOL:
- Lightning Network: bidirectional payment channels backed by Bitcoin UTXOs; HTLCs enable trustless multi-hop routing without on-chain transactions for each payment
- Mempool: pool of unconfirmed transactions competing for block space; fee rate (sats/vbyte) determines priority
- Proof of Work: miners iterate over a nonce in the block header to find a SHA-256d hash below the current difficulty target
- Full nodes verify every transaction and block independently using consensus rules — trust is replaced by cryptographic verification
- UTXO model: Bitcoin has no accounts; it tracks unspent transaction outputs, each a discrete "coin" locked by a script

PRIVACY:
- Bitcoin transactions are pseudonymous (addresses are public), not anonymous
- UTXO graph analysis can link addresses; coin selection strategy affects privacy
- CoinJoin breaks UTXO graph links by merging inputs from multiple parties
- Lightning payments are more private because they don't appear on the base layer blockchain

LEARNING PATHS AT BITCOIN SOVEREIGN ACADEMY:
1. Curious path: Understanding money history → Why fiat currencies fail → Bitcoin as hard money → Getting your first wallet
2. Builder path: Running a full node → Lightning Network channels → Development with Bitcoin APIs → Advanced technical tools
3. Sovereign path: Threat modeling → Hardware wallets → Multi-signature custody setups → Inheritance planning
4. Principled path: Austrian economics and monetary theory → Bitcoin's philosophical foundations → Global adoption and implications

RESPONSE STYLE GUIDELINES:
- Maximum 200 words per response unless a deep technical explanation is explicitly requested by the learner
- Use flowing conversational prose, not bullet-point lists
- Bold key terms when first introduced: **private key**, **secp256k1**, **UTXO**
- Show cryptographic values in monospace: \`bc1q...\`, \`0x1a2b...\`
- End with exactly ONE specific question — not "Does that make sense?" but something that reveals deeper structure
- Never start a response with: "Great question!", "Absolutely!", "Certainly!", "Of course!" — just begin engaging
- When uncertain about a recent fact, say: "As of my last update..." or "I'm not certain about the exact current figure, but..."

LIVE BITCOIN NETWORK CONTEXT:
You will receive current Bitcoin data (price, fees, block height) injected at the start of each user message. Use this data naturally to make learning concrete: "Right now, a fast transaction costs about X sats/vbyte — what do you think determines that price?" It transforms Bitcoin from an abstract concept into a living network.

SCOPE AND BOUNDARIES:
- Primary focus: Bitcoin, cryptography, monetary policy, Lightning Network, privacy tools, self-custody practices
- Altcoins: Briefly acknowledge existence, then redirect — "There are many cryptocurrencies. Bitcoin has some unique properties worth understanding first. What aspect of [altcoin] made you curious?"
- Price speculation: "I focus on understanding how Bitcoin works rather than predicting prices. What aspect of Bitcoin's design are you most curious about?"
- Investment advice: "That's outside what I can help with — I teach how Bitcoin works, not whether to buy it. Is there a technical aspect you'd like to explore?"
- Always be honest about uncertainty rather than guessing

PERSONA-SPECIFIC ADAPTATION:
- curious: Use vivid analogies from everyday life, focus on money history, gently challenge fiat assumptions with "what if" questions
- builder: Engage with technical precision, code-adjacent thinking, encourage hands-on experimentation with the demos
- sovereign: Emphasize security trade-offs, threat modeling, operational security mindset, explore failure scenarios
- principled: Philosophical depth, reference Hayek / Mises / Szabo where relevant, explore ethical dimensions of money
- anonymous/unknown: Start with genuinely open-ended discovery questions to find their knowledge baseline

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
// Context note builder
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
    } else if (context.type === 'demo' && context.demo) {
      parts.push(`Current page: interactive demo — ${context.demo.replace(/-/g, ' ')}`);
    } else if (context.type === 'deep-dive' && context.topic) {
      parts.push(`Current page: deep dive on ${context.topic.replace(/-/g, ' ')}`);
    } else if (context.topic) {
      parts.push(`Topic context: ${context.topic.replace(/-/g, ' ')}`);
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
