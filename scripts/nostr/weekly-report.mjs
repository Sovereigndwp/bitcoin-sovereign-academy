#!/usr/bin/env node
// weekly-report.mjs — pull the last 7 days of BSA-authored events + zaps + replies
// from the configured relays, aggregate, and write a markdown report.
//
// Read-only. Does not publish. Does not sign. No keys needed except the BSA
// pubkey (read from .env.local NOSTR_PUBLIC_KEY_HEX — if not set, falls back
// to the test pubkey).

import 'dotenv/config';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { makePool, collectEvents } from './lib/nostr-client.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..', '..');
const CONFIG = JSON.parse(readFileSync(join(ROOT, 'config', 'nostr.json'), 'utf8'));
const REPORTS_DIR = join(ROOT, 'content', 'nostr', 'analytics');

const PUBKEY = (process.env.NOSTR_PUBLIC_KEY_HEX
  || process.env.NOSTR_TEST_PUBLIC_KEY_HEX
  || '').trim().toLowerCase();

if (!/^[0-9a-f]{64}$/.test(PUBKEY)) {
  console.error('Missing NOSTR_PUBLIC_KEY_HEX (or NOSTR_TEST_PUBLIC_KEY_HEX) in .env.local.');
  process.exit(2);
}

const now = Math.floor(Date.now() / 1000);
const since = now - 7 * 24 * 60 * 60;

async function main() {
  const pool = makePool();
  const relays = CONFIG.relays.read;

  console.log(`Collecting events from ${relays.length} relays for ${PUBKEY.slice(0, 12)}…`);

  // Authored events
  const own = await collectEvents(pool, relays, [{ authors: [PUBKEY], since, limit: 500 }], 6000);

  // Replies to your events: kind 1 events with #e tag = your event ids
  const ownIds = own.filter((e) => e.kind === 1 || e.kind === 30023).map((e) => e.id);
  const replies = ownIds.length
    ? await collectEvents(pool, relays, [{ kinds: [1], '#e': ownIds, since, limit: 1000 }], 6000)
    : [];

  // Reposts (kind 6)
  const reposts = ownIds.length
    ? await collectEvents(pool, relays, [{ kinds: [6], '#e': ownIds, since, limit: 500 }], 4000)
    : [];

  // Zap receipts (kind 9735) — receipts are tagged with #p = recipient
  const zaps = await collectEvents(pool, relays, [{ kinds: [9735], '#p': [PUBKEY], since, limit: 500 }], 6000);

  let totalSats = 0;
  for (const z of zaps) {
    totalSats += extractZapAmountSats(z);
  }

  // Followers (rough count via contact lists referencing this pubkey)
  // Heavy query; cap window to 24h to avoid pulling the entire kind 3 corpus.
  const dayAgo = now - 24 * 60 * 60;
  const followerLists = await collectEvents(pool, relays, [{ kinds: [3], '#p': [PUBKEY], since: dayAgo, limit: 500 }], 4000);

  // Engagement scoring per post
  const engagement = new Map();
  for (const id of ownIds) engagement.set(id, { replies: 0, reposts: 0, zaps: 0, sats: 0 });
  for (const r of replies) {
    for (const t of r.tags) {
      if (t[0] === 'e' && engagement.has(t[1])) engagement.get(t[1]).replies++;
    }
  }
  for (const r of reposts) {
    for (const t of r.tags) {
      if (t[0] === 'e' && engagement.has(t[1])) engagement.get(t[1]).reposts++;
    }
  }
  for (const z of zaps) {
    const eTag = (z.tags.find((t) => t[0] === 'e') || [])[1];
    if (eTag && engagement.has(eTag)) {
      const sats = extractZapAmountSats(z);
      engagement.get(eTag).zaps++;
      engagement.get(eTag).sats += sats;
    }
  }

  const ownById = new Map(own.map((e) => [e.id, e]));
  const ranked = [...engagement.entries()]
    .map(([id, m]) => ({ id, ...m, score: m.replies + m.reposts * 2 + m.zaps * 3, content: ownById.get(id)?.content || '' }))
    .sort((a, b) => b.score - a.score);

  const topFive = ranked.slice(0, 5);
  const ignored = ranked.filter((r) => r.score === 0).slice(0, 10);

  if (!existsSync(REPORTS_DIR)) mkdirSync(REPORTS_DIR, { recursive: true });
  const stamp = new Date().toISOString().slice(0, 10);
  const file = join(REPORTS_DIR, `${stamp}-weekly.md`);
  const md = renderReport({
    stamp,
    pubkey: PUBKEY,
    own: own.length,
    replies: replies.length,
    reposts: reposts.length,
    zapsCount: zaps.length,
    totalSats,
    followerListsObserved: followerLists.length,
    topFive,
    ignored,
  });
  writeFileSync(file, md, 'utf8');
  console.log(`Wrote ${file}`);

  try { pool.close(relays); } catch {}
}

function extractZapAmountSats(zapReceipt) {
  // Receipt has a bolt11 tag; amount is in msats inside the invoice.
  // Quick parse: look for `amount` (msat string) tag if present, otherwise parse the bolt11.
  const amountTag = zapReceipt.tags.find((t) => t[0] === 'amount');
  if (amountTag && /^\d+$/.test(amountTag[1])) {
    return Math.floor(Number(amountTag[1]) / 1000);
  }
  // Fall back to parsing the bolt11 (very rough — full lib not needed for ranges)
  const b11 = zapReceipt.tags.find((t) => t[0] === 'bolt11')?.[1] || '';
  const m = b11.match(/^lnbc(\d+)([munp]?)/);
  if (!m) return 0;
  const num = Number(m[1]);
  const mul = { '': 1e8, m: 1e5, u: 1e2, n: 1e-1, p: 1e-4 }[m[2]] ?? 1;
  return Math.round(num * mul);
}

function renderReport({ stamp, pubkey, own, replies, reposts, zapsCount, totalSats, followerListsObserved, topFive, ignored }) {
  const lines = [];
  lines.push(`# Nostr weekly report — ${stamp}`);
  lines.push('');
  lines.push(`Account pubkey: \`${pubkey}\``);
  lines.push('');
  lines.push('## Volume');
  lines.push('');
  lines.push(`- Own events (7d): **${own}**`);
  lines.push(`- Replies received: **${replies}**`);
  lines.push(`- Reposts: **${reposts}**`);
  lines.push(`- Zap receipts: **${zapsCount}**`);
  lines.push(`- Total sats received: **${totalSats}**`);
  lines.push(`- Contact-list mentions (24h): ${followerListsObserved}`);
  lines.push('');
  lines.push('## Top 5 posts (replies + reposts·2 + zaps·3)');
  lines.push('');
  for (const r of topFive) {
    const snippet = (r.content || '').replace(/\s+/g, ' ').slice(0, 120);
    lines.push(`- score ${r.score} — replies:${r.replies} reposts:${r.reposts} zaps:${r.zaps} (${r.sats} sats) — \`${r.id.slice(0, 12)}…\``);
    lines.push(`  > ${snippet}${(r.content || '').length > 120 ? '…' : ''}`);
  }
  lines.push('');
  lines.push('## Ignored (zero engagement)');
  lines.push('');
  if (!ignored.length) {
    lines.push('_None — every post got some signal._');
  } else {
    for (const r of ignored) {
      const snippet = (r.content || '').replace(/\s+/g, ' ').slice(0, 120);
      lines.push(`- \`${r.id.slice(0, 12)}…\` — ${snippet}${(r.content || '').length > 120 ? '…' : ''}`);
    }
  }
  lines.push('');
  lines.push('## Sunday review questions');
  lines.push('');
  lines.push('1. What got zapped this week? Why?');
  lines.push('2. Which post was ignored? Topic, framing, or timing?');
  lines.push('3. Which question came up in replies more than once?');
  lines.push('4. What should next week\'s thread cover?');
  lines.push('5. What did the data tell you that you didn\'t already know?');
  lines.push('');
  return lines.join('\n');
}

main().catch((err) => {
  console.error('weekly-report failed:', err.message);
  process.exit(2);
});
