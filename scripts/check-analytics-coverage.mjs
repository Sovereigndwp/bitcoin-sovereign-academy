#!/usr/bin/env node
/**
 * Analytics-coverage lint.
 *
 * Fails if any HTML page in an enforced directory does not load
 * /js/analytics.js. Prevents content shipping into a measurement void.
 *
 * History: the entire institutional/ tree was discovered to be untracked
 * for ~6 weeks (built Mar 8 → audited Apr 27 2026). This rule locks in
 * institutional coverage and is the template for expansion to other trees
 * (articles/, answers/, calculators/, etc.) as their authors confirm
 * each tree should be measured.
 *
 * To expand scope: add the new prefix to ENFORCE_PREFIXES below, then run
 * `npm run lint:analytics` locally to see what needs to be patched.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const ROOT = process.cwd();
const ANALYTICS_TAG = 'src="/js/analytics.js"';

// Directories whose HTML pages MUST load analytics.js.
// Each entry is a path prefix relative to repo root, with trailing slash.
const ENFORCE_PREFIXES = [
  'institutional/',
];

// Per-file exemptions inside an enforced directory.
// Keep this list small. Add a comment for each entry explaining why.
const EXEMPT_PATHS = new Set([
  // (none currently — every institutional/ page is user-facing)
]);

const SKIP_DIRS = new Set(['node_modules', '.git', '.next', 'dist', 'build']);

function walkHtml(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      walkHtml(full, out);
    } else if (entry.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

function toPosix(p) {
  return p.split(sep).join('/');
}

const allHtml = walkHtml(ROOT);
const enforced = [];
const violations = [];

for (const fp of allHtml) {
  const rel = toPosix(relative(ROOT, fp));
  if (!ENFORCE_PREFIXES.some((p) => rel.startsWith(p))) continue;
  if (EXEMPT_PATHS.has(rel)) continue;
  enforced.push(rel);
  const content = readFileSync(fp, 'utf8');
  if (!content.includes(ANALYTICS_TAG)) {
    violations.push(rel);
  }
}

if (violations.length === 0) {
  console.log(
    `✅ analytics-coverage: all ${enforced.length} enforced HTML pages load /js/analytics.js`,
  );
  console.log(`   Enforced prefixes: ${ENFORCE_PREFIXES.join(', ')}`);
  process.exit(0);
}

console.error(
  `❌ analytics-coverage: ${violations.length} of ${enforced.length} enforced pages missing /js/analytics.js:`,
);
for (const v of violations) console.error(`  - ${v}`);
console.error('');
console.error('Fix: add this line before </body> in each file:');
console.error('  <script src="/js/analytics.js" defer></script>');
console.error('');
console.error(
  'Or, if a page is intentionally not tracked, add its path to',
);
console.error('EXEMPT_PATHS in scripts/check-analytics-coverage.mjs (with a reason comment).');
process.exit(1);
