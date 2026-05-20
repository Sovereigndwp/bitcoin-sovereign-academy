#!/usr/bin/env node
// set-profile.mjs — publish a kind 0 (metadata) event built from config/nostr.json.
//
// Use this when:
//   • Setting up the BSA profile for the first time
//   • Updating the about / picture / lud16 / nip05 fields
//
// Same safety gates as publish-approved.mjs.

import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { makeSigner, assertLivePublishAuthorized, isTestAccount } from './lib/sign.mjs';
import { makePool, publishToRelays } from './lib/nostr-client.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..', '..');
const CONFIG = JSON.parse(readFileSync(join(ROOT, 'config', 'nostr.json'), 'utf8'));

const DRY_RUN = process.argv.includes('--dry-run');

async function main() {
  if (!DRY_RUN) assertLivePublishAuthorized();

  // Build the metadata object. Only include fields that are non-empty.
  const p = CONFIG.profile || {};
  const metadata = {};
  for (const k of ['name', 'display_name', 'about', 'picture', 'banner', 'website', 'nip05', 'lud16']) {
    if (typeof p[k] === 'string' && p[k].length > 0) metadata[k] = p[k];
  }

  const template = {
    kind: 0,
    created_at: Math.floor(Date.now() / 1000),
    content: JSON.stringify(metadata),
    tags: [],
  };

  const signer = await makeSigner();
  const event = await signer.sign(template);

  console.log(`[profile] ${isTestAccount() ? 'TEST' : 'MAIN'} account npub=${signer.npub}`);
  console.log(`[profile] metadata:`);
  console.log(JSON.stringify(metadata, null, 2));

  if (DRY_RUN || signer.mode === 'dry-run') {
    console.log('[dry-run] would publish the kind 0 event above');
    await signer.close();
    return;
  }

  const pool = makePool();
  const relays = CONFIG.relays.write;
  const result = await publishToRelays(pool, relays, event, CONFIG.limits?.publish_timeout_ms ?? 8000);

  console.log(`[profile] published to ${result.ok.length}/${relays.length} relays`);
  if (result.failed.length) {
    console.warn('[profile] failed relays:');
    for (const f of result.failed) console.warn(`  - ${f.relay}: ${f.error}`);
  }
  console.log(`[profile] event id: ${event.id}`);

  await signer.close();
  try { pool.close(relays); } catch {}
}

main().catch((err) => {
  console.error('set-profile failed:', err.message);
  process.exit(2);
});
