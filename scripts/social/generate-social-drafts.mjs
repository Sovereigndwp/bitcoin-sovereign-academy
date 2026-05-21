#!/usr/bin/env node
// generate-social-drafts.mjs
//
// Two modes:
//   (default)   Writes the curated 14-day cross-platform seed set into
//               content/social/<platform>/ as individual JSON drafts.
//               Idempotent: skips files that already exist unless --force.
//   --extract   Walks BSA HTML pages + content/nostr/post-bank.jsonl and emits
//               draft *skeletons* (marked _skeleton) for a human to finish.
//
// No network. No keys. No publishing. Drafts are written with status:"draft".
//
// Usage:
//   node scripts/social/generate-social-drafts.mjs
//   node scripts/social/generate-social-drafts.mjs --force
//   node scripts/social/generate-social-drafts.mjs --extract --platform=linkedin

import { writeFileSync, existsSync, mkdirSync, readFileSync, readdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateDraft } from './lib/validate.mjs';
import { SEED } from './lib/seed-14day.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..', '..');
const SOCIAL = join(ROOT, 'content', 'social');

const PLATFORM_DIR = {
  nostr: 'nostr',
  linkedin: 'linkedin',
  substack: 'substack-notes',
  x: 'x',
};

const flags = parseFlags(process.argv.slice(2));

if (flags.extract) {
  runExtract(flags);
} else {
  runSeed(flags);
}

function runSeed(flags) {
  let written = 0, skipped = 0, invalid = 0;
  for (const draft of SEED) {
    const { ok, errors } = validateDraft(draft);
    if (!ok) {
      console.error(`[invalid] ${draft.slug}: ${errors.join('; ')}`);
      invalid++;
      continue;
    }
    const dir = join(SOCIAL, PLATFORM_DIR[draft.platform]);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    const file = join(dir, `${draft.day || 'x'}-${draft.slug}.json`);
    if (existsSync(file) && !flags.force) { skipped++; continue; }
    writeFileSync(file, JSON.stringify(draft, null, 2) + '\n', 'utf8');
    written++;
  }
  console.log(`Seed: ${written} written, ${skipped} skipped (exist), ${invalid} invalid.`);
  if (invalid > 0) process.exit(1);
}

function runExtract(flags) {
  const platform = flags.platform || 'nostr';
  const dir = join(SOCIAL, PLATFORM_DIR[platform] || 'nostr');
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  // Reuse the nostr post-bank as raw material.
  const bankPath = join(ROOT, 'content', 'nostr', 'post-bank.jsonl');
  let n = 0;
  if (existsSync(bankPath)) {
    const lines = readFileSync(bankPath, 'utf8').split('\n').filter((l) => l.trim());
    for (const line of lines) {
      const p = JSON.parse(line);
      const draft = {
        version: 1,
        status: 'draft',
        platform,
        slug: `from-bank-${p.id}`,
        pillar: p.pillar,
        audience: p.audience === 'all' ? 'all' : p.audience,
        post_type: p.zap_ok ? 'zap-worthy' : 'one-idea',
        language: p.lang || 'en',
        body: p.body,
        links: p.links || [],
        cta_type: p.cta === 'soft-site' ? 'soft-site' : (p.cta || 'none'),
        zap_ok: !!p.zap_ok,
        meeting_ok: p.cta === 'meeting',
        source: 'content/nostr/post-bank.jsonl#' + p.id,
        notes: 'extracted skeleton — review + adapt to platform voice before approving',
        _skeleton: true,
      };
      const file = join(dir, `__skeleton-${platform}-${p.id}.json`);
      if (existsSync(file) && !flags.force) continue;
      writeFileSync(file, JSON.stringify(draft, null, 2) + '\n', 'utf8');
      n++;
    }
  }
  console.log(`Extract: wrote ${n} skeleton(s) for platform=${platform} into ${dir}`);
  console.log('Edit each, set status, then move into content/social/approved/.');
}

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
