#!/usr/bin/env node
// validate-social-drafts.mjs
//
// Validates every JSON draft under content/social/{nostr,linkedin,substack-notes,x,approved}
// against the shared rules (banned phrases, links, hashtags, char limits, secret-
// exposure language, financial claims) and runs set-level checks per platform
// (CTA frequency, repeated CTAs).
//
// Read-only. Exits non-zero if any per-post error is found.
//
// Usage:
//   node scripts/social/validate-social-drafts.mjs
//   node scripts/social/validate-social-drafts.mjs --dir content/social/approved

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateDraft, validateBatch } from './lib/validate.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..', '..');
const SOCIAL = join(ROOT, 'content', 'social');

const flags = parseFlags(process.argv.slice(2));
const SCAN_DIRS = flags.dir
  ? [resolve(flags.dir)]
  : ['nostr', 'linkedin', 'substack-notes', 'x', 'approved'].map((d) => join(SOCIAL, d));

let totalErrors = 0;
let totalWarnings = 0;
let totalChecked = 0;
const byPlatform = {};

for (const dir of SCAN_DIRS) {
  if (!existsSync(dir)) continue;
  const files = readdirSync(dir).filter((f) => f.endsWith('.json') && !f.startsWith('.'));
  for (const f of files) {
    const path = join(dir, f);
    let draft;
    try {
      draft = JSON.parse(readFileSync(path, 'utf8'));
    } catch (err) {
      console.error(`[ERROR] ${rel(path)}: invalid JSON — ${err.message}`);
      totalErrors++;
      continue;
    }
    totalChecked++;
    (byPlatform[draft.platform] = byPlatform[draft.platform] || []).push(draft);

    const { ok, errors, warnings } = validateDraft(draft);
    if (!ok) {
      console.error(`[ERROR] ${rel(path)}`);
      for (const e of errors) console.error(`        - ${e}`);
      totalErrors += errors.length;
    }
    if (warnings.length) {
      console.warn(`[warn]  ${rel(path)}`);
      for (const w of warnings) console.warn(`        - ${w}`);
      totalWarnings += warnings.length;
    }
  }
}

// Set-level checks per platform
console.log('\n— Set-level checks (per platform) —');
for (const [platform, drafts] of Object.entries(byPlatform)) {
  const { warnings } = validateBatch(drafts);
  if (warnings.length) {
    console.warn(`[warn]  ${platform} (${drafts.length} posts)`);
    for (const w of warnings) console.warn(`        - ${w}`);
    totalWarnings += warnings.length;
  } else {
    console.log(`[ok]    ${platform} (${drafts.length} posts) — CTA cadence within guidelines`);
  }
}

console.log(`\nChecked ${totalChecked} draft(s): ${totalErrors} error(s), ${totalWarnings} warning(s).`);
process.exit(totalErrors > 0 ? 1 : 0);

function rel(p) { return p.replace(ROOT + '/', ''); }
function parseFlags(argv) {
  const f = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dir') { f.dir = argv[++i]; }
    else if (a.startsWith('--')) { const [k, v] = a.slice(2).split('='); f[k] = v === undefined ? true : v; }
  }
  return f;
}
