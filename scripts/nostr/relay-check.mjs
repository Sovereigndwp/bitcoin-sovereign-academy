#!/usr/bin/env node
// relay-check.mjs — verify connectivity + latency to every configured relay.
// No keys, no publishing. Safe to run anywhere.

import { readFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pingRelay } from './lib/nostr-client.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..', '..');
const CONFIG = JSON.parse(readFileSync(join(ROOT, 'config', 'nostr.json'), 'utf8'));

const relays = Array.from(new Set([
  ...CONFIG.relays.write,
  ...CONFIG.relays.read,
  ...(CONFIG.relays.paid_optional || []),
]));

const results = await Promise.all(relays.map((url) => pingRelay(url, 4000)));

let badCount = 0;
for (const r of results) {
  if (r.ok) {
    console.log(`[ok]   ${r.url}  ${r.ms}ms`);
  } else {
    console.log(`[fail] ${r.url}  ${r.error}`);
    badCount++;
  }
}

console.log(`\n${results.length - badCount}/${results.length} relays reachable.`);
process.exit(badCount > 0 ? 1 : 0);
