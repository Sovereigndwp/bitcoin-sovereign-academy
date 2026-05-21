#!/usr/bin/env node
/**
 * daily-export.mjs
 *
 * Safe autonomous social workflow for Bitcoin Sovereign Academy.
 * This script does NOT publish to Nostr, LinkedIn, Substack, or X.
 * It selects one publish-ready post from content/nostr/post-bank.jsonl,
 * audits it against BSA voice rules, and writes copy-paste-ready exports.
 *
 * No private keys. No nsec. No API tokens. No live publishing.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..', '..');

const POST_BANK = join(ROOT, 'content', 'nostr', 'post-bank.jsonl');
const OUT_DIR = join(ROOT, 'content', 'social', 'daily');
const INDEX_FILE = join(ROOT, 'content', 'social', 'daily-index.json');

const OFFICIAL = {
  site: 'https://bitcoinsovereign.academy',
  start: 'https://bitcoinsovereign.academy/start/',
  demos: 'https://bitcoinsovereign.academy/interactive-demos/',
  support: 'https://bitcoinsovereign.academy/support/',
  meeting: 'https://meetings.hubspot.com/dalia-platt',
  lightning: 'sovereigndwp@getalby.com',
  nostr: '_@bitcoinsovereign.academy',
  npub: 'npub1fn3afycdlus5u495ge45ajvzrwm2mxt2sxc07yckme5al3kvs97qag2y5c'
};

const BANNED = [
  'few understand',
  'wake up',
  'orange pill',
  'have fun staying poor',
  'web3',
  'bitcoin fixes this',
  'gm',
  'to the moon',
  'number go up',
  'crypto revolution',
  'financial revolution',
  'future of finance'
];

const args = parseArgs(process.argv.slice(2));
const date = args.date || new Date().toISOString().slice(0, 10);
const dryRun = Boolean(args['dry-run']);
const offset = Number(args.offset || 0);

main();

function main() {
  const posts = loadPosts();
  if (!posts.length) throw new Error('No posts found in post bank.');

  const selected = selectPost(posts, date, offset);
  const audit = auditPost(selected);

  if (!audit.ok) {
    console.error(`[fail] selected post ${selected.id || selected.slug || '(unknown)'} failed audit:`);
    for (const error of audit.errors) console.error(`  - ${error}`);
    process.exit(1);
  }

  const exportRecord = buildExport(selected, date);

  if (dryRun) {
    console.log('[dry-run] would export daily social post');
    console.log(JSON.stringify(exportRecord, null, 2));
    return;
  }

  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

  const jsonPath = join(OUT_DIR, `${date}.json`);
  const mdPath = join(OUT_DIR, `${date}.md`);

  writeFileSync(jsonPath, JSON.stringify(exportRecord, null, 2) + '\n', 'utf8');
  writeFileSync(mdPath, toMarkdown(exportRecord), 'utf8');
  writeIndex(date, exportRecord);

  console.log(`[ok] exported ${date}`);
  console.log(`  - ${relative(jsonPath)}`);
  console.log(`  - ${relative(mdPath)}`);
}

function loadPosts() {
  const raw = readFileSync(POST_BANK, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  return raw.map((line, i) => {
    try {
      return JSON.parse(line);
    } catch (error) {
      throw new Error(`Invalid JSONL line ${i + 1}: ${error.message}`);
    }
  });
}

function selectPost(posts, dateString, manualOffset = 0) {
  const dayIndex = daysSinceEpoch(dateString) + manualOffset;
  const index = mod(dayIndex, posts.length);
  return posts[index];
}

function auditPost(post) {
  const errors = [];
  const body = String(post.body || '').trim();
  const lower = body.toLowerCase();

  if (!body) errors.push('body is required');
  if (body.length > 2000) errors.push('body exceeds 2,000 characters');
  if ((body.match(/https?:\/\//g) || []).length > 2) errors.push('more than 2 links');
  if ((body.match(/#/g) || []).length > 2) errors.push('more than 2 hashtags');

  for (const phrase of BANNED) {
    if (lower.includes(phrase)) errors.push(`banned phrase: ${phrase}`);
  }

  if (/nsec1/i.test(body)) errors.push('private key pattern nsec1 must never appear');
  if (/guaranteed return|risk-free return|will definitely/i.test(body)) errors.push('investment guarantee language is not allowed');
  if (/investment advice/i.test(body)) errors.push('investment advice language is not allowed');

  return { ok: errors.length === 0, errors };
}

function buildExport(post, dateString) {
  const body = normalizeBody(post.body);

  const nostr = body;
  const linkedin = buildLinkedIn(body, post);
  const substackNote = buildSubstackNote(body, post);
  const xDraft = buildX(body, post);

  return {
    version: 1,
    status: 'ready_to_publish_manually',
    date: dateString,
    source_id: post.id || null,
    title: post.title || '',
    pillar: post.pillar || 'unknown',
    audience: post.audience || 'all',
    language: post.lang || post.language || 'en',
    zap_ok: Boolean(post.zap_ok),
    cta: post.cta || 'none',
    official: OFFICIAL,
    platforms: {
      nostr: { body: nostr, max_chars: 2000, publish: 'manual' },
      linkedin: { body: linkedin, publish: 'manual' },
      substack_notes: { body: substackNote, publish: 'manual' },
      x: { body: xDraft, publish: 'manual' }
    },
    audit: {
      passed: true,
      banned_phrases_checked: BANNED,
      private_key_check: 'passed',
      live_publish: false
    }
  };
}

function buildLinkedIn(body, post) {
  const suffix = post.cta === 'meeting'
    ? `\n\nFor families or advisors who need a custody review:\n${OFFICIAL.meeting}`
    : `\n\nFree Bitcoin education:\n${OFFICIAL.site}`;

  const intro = post.audience === 'advisors'
    ? 'For advisors and families thinking seriously about Bitcoin custody:\n\n'
    : '';

  return `${intro}${body}${suffix}`;
}

function buildSubstackNote(body, post) {
  if (post.zap_ok) {
    return `${body}\n\nValue for value: ${OFFICIAL.lightning}`;
  }
  return `${body}\n\nMore free lessons: ${OFFICIAL.site}`;
}

function buildX(body) {
  const compact = body.replace(/\n{3,}/g, '\n\n').trim();
  if (compact.length <= 280) return compact;
  return compact.slice(0, 260).replace(/\s+\S*$/, '') + '…';
}

function toMarkdown(record) {
  return `# Daily Social Export — ${record.date}\n\n` +
`Status: ${record.status}\n\n` +
`Source: ${record.source_id || 'unknown'}\n\n` +
`Pillar: ${record.pillar}\n\n` +
`Audience: ${record.audience}\n\n` +
`Lightning: ${record.official.lightning}\n\n` +
`NIP-05: ${record.official.nostr}\n\n` +
`## Nostr\n\n${record.platforms.nostr.body}\n\n` +
`## LinkedIn\n\n${record.platforms.linkedin.body}\n\n` +
`## Substack Notes\n\n${record.platforms.substack_notes.body}\n\n` +
`## X\n\n${record.platforms.x.body}\n\n` +
`## Audit\n\nPassed. No live publishing. No private keys used.\n`;
}

function writeIndex(dateString, record) {
  let index = [];
  if (existsSync(INDEX_FILE)) {
    try { index = JSON.parse(readFileSync(INDEX_FILE, 'utf8')); } catch { index = []; }
  }
  index = index.filter((item) => item.date !== dateString);
  index.push({
    date: dateString,
    source_id: record.source_id,
    title: record.title,
    pillar: record.pillar,
    audience: record.audience,
    file: `content/social/daily/${dateString}.md`,
    status: record.status
  });
  index.sort((a, b) => a.date.localeCompare(b.date));
  writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2) + '\n', 'utf8');
}

function normalizeBody(value) {
  return String(value || '')
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .trim();
}

function daysSinceEpoch(dateString) {
  const date = new Date(`${dateString}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) throw new Error(`Invalid date: ${dateString}`);
  return Math.floor(date.getTime() / 86400000);
}

function mod(n, m) { return ((n % m) + m) % m; }

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith('--')) continue;
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith('--')) out[key] = true;
    else { out[key] = next; i++; }
  }
  return out;
}

function relative(path) {
  return path.replace(ROOT + '/', '');
}
