#!/usr/bin/env node
// export-approved.mjs
//
// Turns content/social/approved/*.json into a clean, copy-paste-ready text
// bundle grouped by platform, so you can publish manually. Validates first;
// refuses to export anything that fails validation.
//
// Does NOT publish anything. Does NOT touch keys. Manual publishing only.
//
// Usage:
//   node scripts/social/export-approved.mjs --dry-run   (print to stdout, no file)
//   node scripts/social/export-approved.mjs              (write export file)
//   node scripts/social/export-approved.mjs --out path.txt

import { readFileSync, readdirSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateDraft } from './lib/validate.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..', '..');
const APPROVED = join(ROOT, 'content', 'social', 'approved');
const EXPORT_DIR = join(ROOT, 'content', 'social', 'published');

const flags = parseFlags(process.argv.slice(2));
const DRY = !!flags['dry-run'];

const PLATFORM_LABEL = {
  nostr: 'NOSTR  (paste into Damus / Primal / Amethyst / your signer)',
  linkedin: 'LINKEDIN  (paste into LinkedIn composer)',
  substack: 'SUBSTACK NOTE  (paste into Substack Notes)',
  x: 'X / TWITTER  (paste into X; threads = one note per numbered line group)',
};

if (!existsSync(APPROVED)) {
  console.error('No content/social/approved/ directory. Move drafts there to approve them.');
  process.exit(1);
}

const files = readdirSync(APPROVED).filter((f) => f.endsWith('.json') && !f.startsWith('.'));
if (!files.length) {
  console.log('content/social/approved/ is empty. Move approved drafts here, then re-run.');
  process.exit(0);
}

const groups = {};
let invalid = 0;
for (const f of files) {
  const path = join(APPROVED, f);
  let d;
  try { d = JSON.parse(readFileSync(path, 'utf8')); }
  catch (err) { console.error(`[skip] ${f}: invalid JSON — ${err.message}`); invalid++; continue; }
  const { ok, errors } = validateDraft(d);
  if (!ok) {
    console.error(`[skip] ${f}: validation failed — ${errors.join('; ')}`);
    invalid++;
    continue;
  }
  (groups[d.platform] = groups[d.platform] || []).push(d);
}

if (invalid > 0) {
  console.error(`\n${invalid} draft(s) failed validation and were excluded. Fix them before exporting.`);
}

const out = [];
out.push('BSA SOCIAL — APPROVED POSTS FOR MANUAL PUBLISHING');
out.push(`Generated: ${new Date().toISOString()}`);
out.push('Lightning (zaps): sovereigndwp@getalby.com   ·   Site: https://bitcoinsovereign.academy');
out.push('NOTE: Manual publishing only. No keys are used. Paste each block into the platform yourself.');
out.push('');

for (const platform of ['nostr', 'linkedin', 'substack', 'x']) {
  const drafts = groups[platform];
  if (!drafts || !drafts.length) continue;
  out.push('═'.repeat(70));
  out.push(PLATFORM_LABEL[platform] || platform.toUpperCase());
  out.push('═'.repeat(70));
  out.push('');
  for (const d of drafts) {
    out.push(`──── ${d.slug}  [${d.pillar} · ${d.post_type} · ${d.language}]  ${d.body.length} chars ────`);
    out.push('');
    out.push(d.body);
    out.push('');
    if (d.cta_type === 'zap-soft' || d.zap_ok) out.push('(zap-ok: value-for-value framing)');
    if (d.cta_type === 'meeting' || d.meeting_ok) out.push('(meeting CTA: https://meetings.hubspot.com/dalia-platt)');
    out.push('');
  }
}

const text = out.join('\n');

if (DRY) {
  console.log(text);
  console.log(`\n[dry-run] ${Object.values(groups).flat().length} post(s) would be exported. No file written.`);
} else {
  if (!existsSync(EXPORT_DIR)) mkdirSync(EXPORT_DIR, { recursive: true });
  const stamp = new Date().toISOString().slice(0, 10);
  const outPath = flags.out ? resolve(flags.out) : join(EXPORT_DIR, `${stamp}-export.txt`);
  writeFileSync(outPath, text + '\n', 'utf8');
  console.log(`Wrote ${outPath}`);
  console.log('Reminder: after you publish a post manually, move its JSON from approved/ to published/ and record where/when.');
}

function parseFlags(argv) {
  const f = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--out') f.out = argv[++i];
    else if (a.startsWith('--')) { const [k, v] = a.slice(2).split('='); f[k] = v === undefined ? true : v; }
  }
  return f;
}
