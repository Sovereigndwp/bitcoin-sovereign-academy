#!/usr/bin/env node
// weekly-report.mjs (social)
//
// Summarizes what's in the social pipeline and produces a weekly-review markdown
// template with manual-metrics slots. Cross-platform engagement (LinkedIn / X /
// Substack) has no free API here, so this is a structured template you fill in,
// plus automatic counts from the local pipeline.
//
// Read-only. No keys. No network.
//
// Usage: node scripts/social/weekly-report.mjs

import { readFileSync, readdirSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..', '..');
const SOCIAL = join(ROOT, 'content', 'social');

function countJson(dir) {
  const p = join(SOCIAL, dir);
  if (!existsSync(p)) return 0;
  return readdirSync(p).filter((f) => f.endsWith('.json') && !f.startsWith('.')).length;
}

function byPlatform(dir) {
  const p = join(SOCIAL, dir);
  const out = {};
  if (!existsSync(p)) return out;
  for (const f of readdirSync(p).filter((x) => x.endsWith('.json') && !x.startsWith('.'))) {
    try {
      const d = JSON.parse(readFileSync(join(p, f), 'utf8'));
      out[d.platform] = (out[d.platform] || 0) + 1;
    } catch {}
  }
  return out;
}

const drafts = {
  nostr: countJson('nostr'),
  linkedin: countJson('linkedin'),
  substack: countJson('substack-notes'),
  x: countJson('x'),
};
const approved = countJson('approved');
const published = countJson('published');
const publishedBy = byPlatform('published');

const stamp = new Date().toISOString().slice(0, 10);
const lines = [];
lines.push(`# BSA social — weekly review — ${stamp}`);
lines.push('');
lines.push('## Pipeline snapshot (auto)');
lines.push('');
lines.push('| Stage | Count |');
lines.push('|---|---|');
lines.push(`| Drafts · Nostr | ${drafts.nostr} |`);
lines.push(`| Drafts · LinkedIn | ${drafts.linkedin} |`);
lines.push(`| Drafts · Substack Notes | ${drafts.substack} |`);
lines.push(`| Drafts · X | ${drafts.x} |`);
lines.push(`| Approved (awaiting manual publish) | ${approved} |`);
lines.push(`| Published (archived) | ${published} |`);
lines.push('');
if (Object.keys(publishedBy).length) {
  lines.push('Published by platform: ' + Object.entries(publishedBy).map(([k, v]) => `${k}:${v}`).join('  '));
  lines.push('');
}
lines.push('## Engagement this week (fill in manually)');
lines.push('');
lines.push('| Platform | Posts | Followers + | Replies | Reposts/Shares | Zaps | Sats | Site clicks |');
lines.push('|---|---|---|---|---|---|---|---|');
lines.push('| Nostr | | | | | | | |');
lines.push('| LinkedIn | | | | | n/a | n/a | |');
lines.push('| Substack | | | | | n/a | n/a | |');
lines.push('| X | | | | | n/a | n/a | |');
lines.push('');
lines.push('Total sats received (Alby Hub, sovereigndwp@getalby.com): ____');
lines.push('');
lines.push('## Learning (answer in 1–2 lines each)');
lines.push('');
lines.push('1. What got the most engagement, and on which platform? Why?');
lines.push('2. What got zapped? What did that post have in common with last week\'s zapped post?');
lines.push('3. What was ignored? Topic, framing, or timing?');
lines.push('4. Which question came up more than once in replies/comments?');
lines.push('5. Which post should become a full BSA article or deep-dive?');
lines.push('6. What should the Academy publish next as a result?');
lines.push('');
lines.push('## CTA discipline check');
lines.push('');
lines.push('- Meeting CTA used: ___ (guideline ≤1/week)');
lines.push('- Zap CTA used: ___ (guideline ≤2/week)');
lines.push('- BSA lesson link used: ___ (guideline 3–4/week)');
lines.push('- Any post feel like a sales funnel? If yes, which — and rewrite it.');
lines.push('');

const dir = join(SOCIAL);
const outPath = join(dir, 'weekly-review.md');
// Append a dated section if weekly-review.md already exists, else create.
let existing = '';
if (existsSync(outPath)) existing = readFileSync(outPath, 'utf8');
const block = lines.join('\n');
const combined = existing
  ? existing.replace(/\n## Latest auto-generated review[\s\S]*$/, '') + `\n## Latest auto-generated review\n\n${block}\n`
  : `${block}\n`;
writeFileSync(outPath, combined, 'utf8');
console.log(`Wrote/updated ${outPath}`);
console.log(`Pipeline: nostr=${drafts.nostr} linkedin=${drafts.linkedin} substack=${drafts.substack} x=${drafts.x} approved=${approved} published=${published}`);
