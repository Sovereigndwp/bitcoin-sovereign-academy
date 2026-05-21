#!/usr/bin/env node
// generate-from-pages.mjs — walk a list of BSA pages, extract structure,
// emit draft skeletons into content/nostr/drafts/.
//
// This script does NOT call an LLM. It does a deterministic extraction:
//   - <h1> → slug suggestion
//   - First paragraph → "lede"
//   - <ul>/<ol> items → "checklist" candidates
//   - <blockquote> / .callout-warning → "mistake" candidates
//
// The output is a *skeleton*, not a finished post. A human still has to:
//   1. Pick the angle (mistake / clarity / question)
//   2. Cut to 1–6 lines
//   3. Run the voice-spec filter
//
// Usage:
//   node scripts/nostr/generate-from-pages.mjs --out content/nostr/drafts/

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..', '..');

const PAGES = [
  'index.html',
  'start/index.html',
  'start-simple.html',
  'interactive-demos/index.html',
  'paths/curious/index.html',
  'paths/hurried/index.html',
  'paths/pragmatist/index.html',
  'paths/principled/index.html',
  'paths/sovereign/index.html',
  'paths/builder/index.html',
  'deep-dives/index.html',
  'glossary.html',
];

const flags = parseFlags(process.argv.slice(2));
const OUT = resolve(flags.out || join(ROOT, 'content', 'nostr', 'drafts'));

if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

let drafted = 0;
for (const rel of PAGES) {
  const abs = join(ROOT, rel);
  if (!existsSync(abs)) {
    console.warn(`[skip] missing: ${rel}`);
    continue;
  }
  const html = readFileSync(abs, 'utf8');
  const extracted = extract(html);
  if (!extracted.h1) {
    console.warn(`[skip] no <h1>: ${rel}`);
    continue;
  }

  const slug = slugify(extracted.h1);
  const draftPath = join(OUT, `__skeleton-${slug}.json`);

  const draft = {
    version: 1,
    slug,
    status: 'draft',
    scheduled_for: null,
    pillar: guessPillar(rel, extracted.h1),
    audience: 'all',
    lang: 'en',
    cta: 'soft-site',
    zap_ok: false,
    source_page: '/' + rel.replace(/index\.html$/, ''),
    tags: ['skeleton'],
    kind: 1,
    body: [
      `[REPLACE] One sentence stating the misconception or first principle related to: ${extracted.h1}.`,
      '',
      `[REPLACE] One sentence stating the more useful belief or the structural point.`,
      '',
      `[REPLACE] 1–3 short lines of contrast or example, drawn from: ${truncate(extracted.lede || '(no lede found)', 280)}.`,
      '',
      `https://bitcoinsovereign.academy/${rel.replace(/index\.html$/, '')}`,
    ].join('\n'),
    links: [`https://bitcoinsovereign.academy/${rel.replace(/index\.html$/, '')}`],
    _extracted: {
      h1: extracted.h1,
      lede: extracted.lede,
      bullets: extracted.bullets.slice(0, 8),
      callouts: extracted.callouts.slice(0, 4),
    },
  };

  writeFileSync(draftPath, JSON.stringify(draft, null, 2) + '\n', 'utf8');
  drafted++;
  console.log(`[draft] ${draftPath}`);
}

console.log(`\nWrote ${drafted} skeleton(s) into ${OUT}`);
console.log('Edit each to BSA voice, set scheduled_for, then move to content/nostr/approved/.');

function extract(html) {
  const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '').replace(/<[^>]+>/g, '').trim();
  const firstP = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i)?.[1] || '';
  const lede = firstP.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

  const bullets = [];
  const li = html.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];
  for (const item of li) {
    const txt = item.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (txt && txt.length < 280) bullets.push(txt);
  }

  const callouts = [];
  const bq = html.match(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi) || [];
  for (const c of bq) {
    const txt = c.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (txt) callouts.push(txt);
  }
  return { h1, lede, bullets, callouts };
}

function slugify(s) {
  return s.toLowerCase()
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}

function guessPillar(rel, h1) {
  const s = (rel + ' ' + h1).toLowerCase();
  if (/inherit|family/.test(s)) return 'inheritance';
  if (/custody|wallet|multisig/.test(s)) return 'custody-mistake';
  if (/lightning|node|utxo|seed|begin|hurried/.test(s)) return 'beginner';
  if (/sovereign|builder|principled|advisor/.test(s)) return 'sovereignty';
  return 'bsa-distribution';
}

function truncate(s, n) { return s.length > n ? s.slice(0, n - 1) + '…' : s; }

function parseFlags(argv) {
  const f = {};
  for (const a of argv) {
    if (a.startsWith('--')) {
      const [k, v] = a.slice(2).split('=');
      f[k] = v === undefined ? true : v;
    }
  }
  return f;
}
