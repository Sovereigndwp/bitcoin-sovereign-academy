#!/usr/bin/env node
/**
 * Tutor Eval Harness — measures the Socratic quality of /api/tutor
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-ant-... node scripts/tutor-evals.mjs
 *
 * What it does:
 *   1. Extracts SYSTEM_PROMPT from api/tutor.ts (at runtime, no refactor)
 *   2. Runs 12 canonical test cases against claude-sonnet-4-6 + the prompt
 *   3. Scores each response using claude-opus-4-7 as judge (adaptive thinking)
 *   4. Writes a markdown report to reports/tutor-evals-YYYY-MM-DD.md
 *
 * The test cases target specific behaviors the SYSTEM_PROMPT claims to produce:
 *   - Stuck-learner escalation (rule 10)
 *   - Depth calibration (rule 11)
 *   - Language matching (rule 12)
 *   - Module-objective awareness
 *   - Truth-over-trust citation behavior
 *   - Persona-specific adaptation
 *
 * Cost: ~$0.05 per full run at current Sonnet/Opus prices (12 candidate +
 *       12 judge calls). Safe to run in CI on every SYSTEM_PROMPT change.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');

const CANDIDATE_MODEL = 'claude-sonnet-4-6';
const JUDGE_MODEL = 'claude-opus-4-7';
const API_URL = 'https://api.anthropic.com/v1/messages';

// ─────────────────────────────────────────────────────────────────────────────
// Extract SYSTEM_PROMPT from tutor.ts (template-literal regex, no compile step)
// ─────────────────────────────────────────────────────────────────────────────

async function loadSystemPrompt() {
  const src = await fs.readFile(path.join(REPO_ROOT, 'api/tutor.ts'), 'utf8');
  // Match `const SYSTEM_PROMPT = \`...\`;` ending with backtick-semicolon-newline
  // (the prompt itself only contains backslash-escaped backticks like \`bc1q...\`)
  const match = src.match(/const SYSTEM_PROMPT = `([\s\S]+?)`;\n/);
  if (!match) throw new Error('SYSTEM_PROMPT not found in api/tutor.ts');
  // Unescape backslash-backticks that came from template-literal escaping
  return match[1].replace(/\\`/g, '`');
}

// ─────────────────────────────────────────────────────────────────────────────
// Test cases — 12 canonical inputs covering the SYSTEM_PROMPT's claimed behaviors
// ─────────────────────────────────────────────────────────────────────────────

const TEST_CASES = [
  {
    id: 'skeptic-energy',
    name: 'Skeptic — wasted-energy objection',
    persona: 'skeptic',
    contextNote:
      'Learner persona: skeptic\nCurrent page: skeptic learning path, stage 1, module 1\nLearning objective: engage with common Bitcoin objections using data, not dogma',
    message: 'Bitcoin wastes massive amounts of energy for no real purpose. Prove me wrong.',
    rubric: {
      socratic_adherence:
        'Does it steelman the concern and invite the learner to reason with data, rather than dismissing? (0-10)',
      technical_accuracy: 'Energy claims cited or clearly flagged as estimates? (0-10)',
      persona_fit: 'Treats skeptic with respect; uses falsifiable claims? (0-10)',
      length_discipline: 'Appropriate length (100-300 words)? (0-10)',
      language_match: 'English? (bool — return true/false)',
    },
  },
  {
    id: 'hurried-secure-now',
    name: 'Hurried — move BTC off exchange NOW',
    persona: 'hurried',
    contextNote:
      'Learner persona: hurried\nCurrent page: hurried learning path, stage 1, module 2\nLearning objective: move Bitcoin from an exchange to self-custody',
    message:
      'I have Bitcoin on Coinbase and I need to move it to a hardware wallet RIGHT NOW. What do I do?',
    rubric: {
      socratic_adherence: 'Uses imperatives but still leaves one reflection hook? (0-10)',
      technical_accuracy: 'Steps correct and safe? (0-10)',
      persona_fit: 'Direct, imperative, minimal preamble per hurried persona? (0-10)',
      length_discipline: 'Under 200 words (hurried target 80-150)? (0-10)',
      language_match: 'English? (bool)',
    },
  },
  {
    id: 'spanish-privkey',
    name: 'Spanish — what is a private key?',
    persona: 'curious',
    contextNote: 'Learner persona: curious',
    message: '¿Qué es una clave privada?',
    rubric: {
      socratic_adherence: 'Asks what the learner knows before defining? (0-10)',
      technical_accuracy: 'Any technical claims correct? (0-10)',
      persona_fit: 'Curious-register analogies? (0-10)',
      length_discipline: 'Appropriate length? (0-10)',
      language_match: 'Spanish? (bool — true if entire response is in Spanish)',
    },
  },
  {
    id: 'stuck-learner-escalation',
    name: 'Stuck-learner escalation — "just tell me"',
    persona: 'curious',
    contextNote: 'Learner persona: curious',
    history: [
      { role: 'user', content: 'What is a private key?' },
      {
        role: 'assistant',
        content:
          "Before we get to private keys, think about your house. What do you own that no one else should be able to use to open your front door? If a thief photocopied the outside of your key, could they open the door?",
      },
      { role: 'user', content: 'idk, some kind of code or something?' },
      {
        role: 'assistant',
        content:
          "Getting warmer. You used the word 'code' — what makes a code hard for someone else to guess? If your code were a number between 1 and 10, would that be secure? What if it were between 1 and a million?",
      },
    ],
    message:
      "Look, just tell me what a private key is. I've tried to guess and I don't know.",
    rubric: {
      socratic_adherence:
        'CRITICAL: Does it STOP the Socratic loop (rule 10 — stuck-learner escalation)? Acknowledge effort + explain directly? (0-10)',
      technical_accuracy: 'Private-key definition accurate? (0-10)',
      persona_fit: 'Avoids being defensive or continuing to probe? (0-10)',
      length_discipline: 'Under 250 words? (0-10)',
      language_match: 'English? (bool)',
    },
  },
  {
    id: 'module-aware-custody',
    name: 'Module-aware — custodial vs self-custody',
    persona: 'curious',
    contextNote:
      'Learner persona: curious\nCurrent page: curious learning path, stage 2, module 2\nLearning objective: understand the difference between custodial and self-custody, and why it matters',
    message: 'I keep my Bitcoin on Kraken. Is that bad?',
    rubric: {
      socratic_adherence:
        'Connects to the injected module objective (custodial vs self-custody)? (0-10)',
      technical_accuracy: 'Accurate about exchange risk (FTX, Mt Gox precedent)? (0-10)',
      persona_fit: 'Curious-register? (0-10)',
      length_discipline: 'Appropriate length? (0-10)',
      language_match: 'English? (bool)',
    },
  },
  {
    id: 'altcoin-curious',
    name: 'Altcoin redirect — curious persona',
    persona: 'curious',
    contextNote: 'Learner persona: curious',
    message: 'Why not Ethereum instead of Bitcoin?',
    rubric: {
      socratic_adherence: 'Redirects curious learners to Bitcoin-first without dismissal? (0-10)',
      technical_accuracy: 'No wrong claims about ETH or BTC? (0-10)',
      persona_fit: 'Gentle redirect, not defensive? (0-10)',
      length_discipline: 'Appropriate length? (0-10)',
      language_match: 'English? (bool)',
    },
  },
  {
    id: 'altcoin-skeptic',
    name: 'Altcoin engagement — skeptic persona (different behavior!)',
    persona: 'skeptic',
    contextNote: 'Learner persona: skeptic',
    message: 'Why not Ethereum instead of Bitcoin?',
    rubric: {
      socratic_adherence:
        'CRITICAL: Skeptic gets ENGAGEMENT, not redirect — concrete technical differences (issuance, decentralization, fork history)? (0-10)',
      technical_accuracy: 'Accurate on issuance schedule, decentralization measures, fork history? (0-10)',
      persona_fit: 'Data-driven, not dismissive? (0-10)',
      length_discipline: 'Appropriate depth (topic warrants it — up to 350 words)? (0-10)',
      language_match: 'English? (bool)',
    },
  },
  {
    id: 'citation-current-supply',
    name: 'Truth-over-trust — defer to live data',
    persona: 'curious',
    contextNote:
      'Learner persona: curious\n[Current Bitcoin network data]\nPrice: $87,450 USD (24h: +1.2%)\nTransaction fees: ~12 sat/vbyte (next block), ~8 sat/vbyte (30 min), ~5 sat/vbyte (1 hr)\nBlock height: 887,023',
    message: 'How many Bitcoins exist right now?',
    rubric: {
      socratic_adherence:
        'CRITICAL: Defers to live data (block height 887,023, not stale training-data numbers like "19.8M")? (0-10)',
      technical_accuracy: 'References the injected block height OR cites mempool.space; avoids naming a stale circulating-supply number? (0-10)',
      persona_fit: 'Curious-register? (0-10)',
      length_discipline: 'Appropriate length? (0-10)',
      language_match: 'English? (bool)',
    },
  },
  {
    id: 'depth-calibration-expert',
    name: 'Depth calibration — expert BIP32 question',
    persona: 'builder',
    contextNote: 'Learner persona: builder',
    message:
      "I'm implementing BIP32 child key derivation and getting weird values for hardened vs non-hardened indices. What should I verify about the HMAC-SHA512 output handling?",
    rubric: {
      socratic_adherence: 'Matches expert register — no dumbing down; leading technical question? (0-10)',
      technical_accuracy: 'HMAC-SHA512 / BIP32 details correct (left 32 bytes for IL, right 32 for chain code, hardened indices ≥ 2^31)? (0-10)',
      persona_fit: 'Builder-register — code-adjacent, precise? (0-10)',
      length_discipline: 'Appropriate depth for the expert question (no artificial short cap)? (0-10)',
      language_match: 'English? (bool)',
    },
  },
  {
    id: 'no-lecture-opener',
    name: 'Forbidden openers — "Great question!" etc.',
    persona: 'curious',
    contextNote: 'Learner persona: curious',
    message: 'What makes Bitcoin different from fiat?',
    rubric: {
      socratic_adherence:
        'CRITICAL: Does NOT start with "Great question!" / "Absolutely!" / "Certainly!" / "Of course!"? (0 if it uses any forbidden opener, 10 if it avoids them)',
      technical_accuracy: 'Any claims accurate? (0-10)',
      persona_fit: 'Curious analogies? (0-10)',
      length_discipline: 'Appropriate length? (0-10)',
      language_match: 'English? (bool)',
    },
  },
  {
    id: 'emergency-direct',
    name: 'Emergency-kit context — direct mode',
    persona: 'curious',
    contextNote:
      "Learner persona: curious\nCurrent page: emergency kit. The learner likely has an urgent problem — stuck transaction, lost access, scam recovery. Be direct and actionable. Skip theory unless they explicitly ask. Start by asking what happened.",
    message: 'I sent Bitcoin to the wrong address and the transaction is stuck unconfirmed.',
    rubric: {
      socratic_adherence:
        'CRITICAL: Emergency context should trigger direct/actionable mode (not pure Socratic)? (0-10)',
      technical_accuracy: 'Advice about RBF / CPFP / unconfirmed txs accurate? (0-10)',
      persona_fit: 'Appropriate urgency framing? (0-10)',
      length_discipline: 'Appropriate length? (0-10)',
      language_match: 'English? (bool)',
    },
  },
  {
    id: 'bip39-citation',
    name: 'BIP39 citation behavior',
    persona: 'principled',
    contextNote: 'Learner persona: principled',
    message: 'How does BIP39 turn 12 words into a wallet?',
    rubric: {
      socratic_adherence: 'Cites BIP39 or canonical source (truth-over-trust rule)? (0-10)',
      technical_accuracy:
        'Mechanism correct (2048-word list, 11 bits per word, PBKDF2-HMAC-SHA512 with 2048 iterations producing 512-bit seed)? (0-10)',
      persona_fit: 'Principled-register — includes deeper context? (0-10)',
      length_discipline: 'Appropriate depth? (0-10)',
      language_match: 'English? (bool)',
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Candidate runner — calls Anthropic API with the same prompt the live tutor uses
// ─────────────────────────────────────────────────────────────────────────────

async function getCandidate(apiKey, systemPrompt, testCase) {
  const userContent = testCase.contextNote
    ? `[${testCase.contextNote}]\n\n${testCase.message}`
    : testCase.message;

  const messages = testCase.history
    ? [...testCase.history, { role: 'user', content: userContent }]
    : [{ role: 'user', content: userContent }];

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-beta': 'prompt-caching-2024-07-31',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: CANDIDATE_MODEL,
      max_tokens: 1024,
      system: [{ type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } }],
      messages,
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Candidate API error ${res.status}: ${errText.slice(0, 300)}`);
  }

  const data = await res.json();
  const text = (data.content || [])
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('');
  const usage = data.usage || {};
  return { text, usage };
}

// ─────────────────────────────────────────────────────────────────────────────
// Judge — scores a candidate against a rubric using Claude Opus 4.7
// ─────────────────────────────────────────────────────────────────────────────

const JUDGE_SYSTEM = `You are an impartial evaluator for a Bitcoin Sovereign Academy Socratic tutor.
Score each dimension independently. Be strict but fair. When a criterion says CRITICAL, score 0-2 if it fails the core requirement even if other dimensions are fine.
Return ONLY a JSON object — no preamble, no markdown fencing.`;

async function judge(apiKey, testCase, candidate) {
  const rubricLines = Object.entries(testCase.rubric)
    .map(([k, v]) => `  "${k}": <${v}>`)
    .join(',\n');

  const historyText = testCase.history
    ? '\nConversation history (already occurred):\n' +
      testCase.history.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join('\n')
    : '';

  const judgePrompt = `Evaluate this tutor response.

TEST: ${testCase.name}
CONTEXT INJECTED INTO USER MESSAGE: ${testCase.contextNote}${historyText}
LATEST USER MESSAGE: ${testCase.message}

CANDIDATE RESPONSE:
"""
${candidate}
"""

Return a JSON object with exactly these keys (no others):
{
${rubricLines},
  "overall_verdict": "pass | fail | marginal",
  "notes": "one sentence, under 200 chars, citing the specific strongest and weakest moment of the response"
}`;

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: JUDGE_MODEL,
      max_tokens: 2048,
      thinking: { type: 'adaptive' },
      system: JUDGE_SYSTEM,
      messages: [{ role: 'user', content: judgePrompt }],
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Judge API error ${res.status}: ${errText.slice(0, 300)}`);
  }

  const data = await res.json();
  const text = (data.content || [])
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('');

  const jsonMatch = text.match(/\{[\s\S]+\}/);
  if (!jsonMatch) {
    throw new Error(`Judge returned no JSON block: ${text.slice(0, 300)}`);
  }

  try {
    return JSON.parse(jsonMatch[0]);
  } catch (e) {
    throw new Error(`Judge JSON parse failed: ${e.message}\nRaw: ${jsonMatch[0].slice(0, 300)}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Report writer
// ─────────────────────────────────────────────────────────────────────────────

function todayStamp() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function numericScores(scores) {
  return Object.entries(scores)
    .filter(([k, v]) => typeof v === 'number' && !['overall_verdict', 'notes'].includes(k))
    .map(([k, v]) => ({ key: k, value: v }));
}

function renderReport(results, systemPromptChars) {
  const stamp = todayStamp();
  const lines = [];
  lines.push(`# Tutor eval report — ${stamp}`);
  lines.push('');
  lines.push(`**Candidate model:** \`${CANDIDATE_MODEL}\``);
  lines.push(`**Judge model:** \`${JUDGE_MODEL}\` (adaptive thinking)`);
  lines.push(`**SYSTEM_PROMPT size:** ${systemPromptChars.toLocaleString()} chars (~${Math.round(systemPromptChars / 4)} tokens)`);
  lines.push(`**Test cases:** ${results.length}`);
  lines.push('');

  // Aggregate
  const dimAvg = {};
  const dimCount = {};
  let pass = 0, fail = 0, marginal = 0, errored = 0;
  for (const r of results) {
    if (r.error) { errored++; continue; }
    const verdict = r.scores.overall_verdict;
    if (verdict === 'pass') pass++;
    else if (verdict === 'fail') fail++;
    else marginal++;
    for (const { key, value } of numericScores(r.scores)) {
      dimAvg[key] = (dimAvg[key] || 0) + value;
      dimCount[key] = (dimCount[key] || 0) + 1;
    }
  }

  lines.push('## Summary');
  lines.push('');
  lines.push(`- ✅ Pass: ${pass}`);
  lines.push(`- ⚠️ Marginal: ${marginal}`);
  lines.push(`- ❌ Fail: ${fail}`);
  if (errored) lines.push(`- 🔥 Errored: ${errored}`);
  lines.push('');

  lines.push('## Dimension averages (0-10)');
  lines.push('');
  lines.push('| Dimension | Avg | N |');
  lines.push('|---|---|---|');
  for (const [k, total] of Object.entries(dimAvg)) {
    const n = dimCount[k];
    lines.push(`| ${k} | ${(total / n).toFixed(2)} | ${n} |`);
  }
  lines.push('');

  lines.push('## Per-case results');
  lines.push('');
  for (const r of results) {
    lines.push(`### ${r.id} — ${r.name}`);
    lines.push('');
    if (r.error) {
      lines.push(`🔥 **Errored:** ${r.error}`);
      lines.push('');
      continue;
    }
    const verdict = r.scores.overall_verdict;
    const badge = verdict === 'pass' ? '✅' : verdict === 'fail' ? '❌' : '⚠️';
    lines.push(`**Verdict:** ${badge} ${verdict}`);
    lines.push('');
    lines.push('**Scores:**');
    for (const { key, value } of numericScores(r.scores)) {
      lines.push(`- ${key}: ${value}`);
    }
    // bool dimensions
    for (const [k, v] of Object.entries(r.scores)) {
      if (typeof v === 'boolean') lines.push(`- ${k}: ${v ? '✓ true' : '✗ false'}`);
    }
    lines.push('');
    if (r.scores.notes) {
      lines.push(`**Judge notes:** ${r.scores.notes}`);
      lines.push('');
    }
    lines.push('<details><summary>Candidate response</summary>');
    lines.push('');
    lines.push('```');
    lines.push(r.candidate.slice(0, 2000));
    lines.push('```');
    lines.push('');
    lines.push('</details>');
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  return lines.join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY env var is required.');
    process.exit(1);
  }

  console.log('Loading SYSTEM_PROMPT from api/tutor.ts...');
  const systemPrompt = await loadSystemPrompt();
  console.log(`  Loaded: ${systemPrompt.length.toLocaleString()} chars`);

  const results = [];
  for (const [i, tc] of TEST_CASES.entries()) {
    const label = `[${i + 1}/${TEST_CASES.length}] ${tc.id}`;
    process.stdout.write(`${label}... `);
    try {
      const { text: candidate } = await getCandidate(apiKey, systemPrompt, tc);
      const scores = await judge(apiKey, tc, candidate);
      results.push({ id: tc.id, name: tc.name, candidate, scores });
      const verdict = scores.overall_verdict || '?';
      const badge = verdict === 'pass' ? '✅' : verdict === 'fail' ? '❌' : '⚠️';
      console.log(`${badge} ${verdict}`);
    } catch (err) {
      results.push({ id: tc.id, name: tc.name, error: err.message });
      console.log(`🔥 ERROR: ${err.message.slice(0, 140)}`);
    }
  }

  const reportsDir = path.join(REPO_ROOT, 'reports');
  await fs.mkdir(reportsDir, { recursive: true });
  const reportPath = path.join(reportsDir, `tutor-evals-${todayStamp()}.md`);
  await fs.writeFile(reportPath, renderReport(results, systemPrompt.length), 'utf8');
  console.log(`\nReport written: ${reportPath}`);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
