#!/usr/bin/env node
// Defunct-services lint.
//
// Flags references to retired Bitcoin services (e.g., Samourai, Wasabi zkSNACKs coordinator,
// Caravan, Paxful, FTX, Celsius, Voyager, BlockFi, Mt. Gox, QuadrigaCX) when no
// historical-context phrase appears within ~300 chars of the reference.
//
// Catalog of retired services:    docs/SERVICE_STATUS.md
// Rules + allowlist (config):     scripts/check-defunct-services.config.mjs
//
// Usage:
//   node scripts/check-defunct-services.mjs           # scan, exit 1 on violations
//   node scripts/check-defunct-services.mjs --quiet   # exit code only
//   node scripts/check-defunct-services.mjs --list    # list all matches (no pass/fail)
//
// Exit codes:
//   0 — clean
//   1 — violations found
//   2 — script error

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  RULES,
  CONTEXT_PHRASES,
  FILE_ALLOWLIST,
  SKIP_DIRS,
  INCLUDE_EXTENSIONS,
  CONTEXT_WINDOW,
} from './check-defunct-services.config.mjs';

const SCRIPT_DIR = fileURLToPath(new URL('.', import.meta.url));
const REPO_ROOT = join(SCRIPT_DIR, '..');

const argv = new Set(process.argv.slice(2));
const QUIET = argv.has('--quiet');
const LIST = argv.has('--list');

// Pre-compute lowercase context phrases once.
const CONTEXT_LC = CONTEXT_PHRASES.map((p) => p.toLowerCase());

function toPosix(p) {
  return sep === '\\' ? p.split(sep).join('/') : p;
}

function shouldSkip(absPath) {
  const rel = toPosix(relative(REPO_ROOT, absPath));
  for (const dir of SKIP_DIRS) {
    if (rel === dir || rel.startsWith(dir + '/')) return true;
  }
  return false;
}

function hasIncludedExtension(name) {
  return INCLUDE_EXTENSIONS.some((ext) => name.endsWith(ext));
}

function walk(dir, out) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = join(dir, entry);
    if (shouldSkip(full)) continue;
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }
    if (st.isDirectory()) {
      walk(full, out);
    } else if (st.isFile() && hasIncludedExtension(entry)) {
      out.push(full);
    }
  }
}

function lineOf(text, index) {
  // 1-based line number for the offset.
  let line = 1;
  for (let i = 0; i < index && i < text.length; i++) {
    if (text.charCodeAt(i) === 10) line++;
  }
  return line;
}

function lineSnippet(text, index) {
  // Return the source line containing `index`, trimmed.
  let start = index;
  while (start > 0 && text.charCodeAt(start - 1) !== 10) start--;
  let end = index;
  while (end < text.length && text.charCodeAt(end) !== 10) end++;
  return text.slice(start, end).trim();
}

function windowAround(text, index, len) {
  const a = Math.max(0, index - CONTEXT_WINDOW);
  const b = Math.min(text.length, index + len + CONTEXT_WINDOW);
  return text.slice(a, b).toLowerCase();
}

function hasHistoricalContext(text, index, len) {
  const window = windowAround(text, index, len);
  for (const phrase of CONTEXT_LC) {
    if (window.includes(phrase)) return true;
  }
  return false;
}

const fileAllowSet = new Set(FILE_ALLOWLIST.map(toPosix));

function scanFile(absPath) {
  const rel = toPosix(relative(REPO_ROOT, absPath));
  if (fileAllowSet.has(rel)) return [];

  let text;
  try {
    text = readFileSync(absPath, 'utf8');
  } catch {
    return [];
  }

  const violations = [];

  for (const rule of RULES) {
    rule.pattern.lastIndex = 0;
    let m;
    while ((m = rule.pattern.exec(text)) !== null) {
      const index = m.index;
      const matchedText = m[0];
      // Defensive: zero-width match would loop forever. Skip if it happens.
      if (matchedText.length === 0) {
        rule.pattern.lastIndex = index + 1;
        continue;
      }
      if (LIST || !hasHistoricalContext(text, index, matchedText.length)) {
        violations.push({
          file: rel,
          line: lineOf(text, index),
          rule: rule.name,
          reason: rule.reason,
          match: matchedText,
          snippet: lineSnippet(text, index),
        });
      }
    }
  }

  return violations;
}

function formatViolation(v) {
  // Match the project's prevailing style — clear paths and line numbers, brief reason.
  return [
    `  ${v.file}:${v.line}`,
    `    rule:    ${v.rule}`,
    `    matched: "${v.match}"`,
    `    reason:  ${v.reason}`,
    `    line:    ${v.snippet.length > 160 ? v.snippet.slice(0, 157) + '...' : v.snippet}`,
  ].join('\n');
}

function main() {
  const files = [];
  walk(REPO_ROOT, files);

  let allViolations = [];
  for (const f of files) {
    allViolations = allViolations.concat(scanFile(f));
  }

  // Stable order: by file, then line.
  allViolations.sort((a, b) =>
    a.file === b.file ? a.line - b.line : a.file < b.file ? -1 : 1
  );

  if (LIST) {
    if (!QUIET) {
      console.log(`Found ${allViolations.length} reference(s) to retired services across ${files.length} files:\n`);
      for (const v of allViolations) console.log(formatViolation(v) + '\n');
    }
    return 0;
  }

  if (allViolations.length === 0) {
    if (!QUIET) {
      console.log(`✅ defunct-services lint: clean (${files.length} files scanned, ${RULES.length} rules)`);
    }
    return 0;
  }

  if (!QUIET) {
    console.error(`❌ defunct-services lint: ${allViolations.length} violation(s) found\n`);
    console.error('Each match below appears without historical-context phrasing within ±300 chars.');
    console.error('See docs/SERVICE_STATUS.md for the catalog.\n');
    console.error('To fix:');
    console.error('  • Replace the retired service with a current alternative, OR');
    console.error('  • Add explicit historical context (e.g., "shut down April 2024",');
    console.error('    "(historical reference)", "no longer operating") within 300 chars, OR');
    console.error('  • If the entire file is intentionally historical, add it to');
    console.error('    FILE_ALLOWLIST in scripts/check-defunct-services.config.mjs.\n');
    for (const v of allViolations) {
      console.error(formatViolation(v));
      console.error('');
    }
  }
  return 1;
}

try {
  process.exit(main());
} catch (err) {
  console.error('check-defunct-services.mjs: script error');
  console.error(err && err.stack ? err.stack : err);
  process.exit(2);
}
