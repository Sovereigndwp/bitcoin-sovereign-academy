#!/usr/bin/env node
// publish-one.mjs --file=<path> [--dry-run]
//
// Publishes a single draft (from approved/ or anywhere else). Useful when you
// want to ship one post without disturbing the rest of the approved queue.

import 'dotenv/config';
import { readFileSync, existsSync, mkdirSync, writeFileSync, renameSync } from 'node:fs';
import { join, basename, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { validateDraft } from './lib/schema.mjs';
import { draftToEventTemplate } from './lib/load-draft.mjs';
import { makeSigner, assertLivePublishAuthorized, isTestAccount } from './lib/sign.mjs';
import { makePool, publishToRelays } from './lib/nostr-client.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..', '..');
const CONFIG = JSON.parse(readFileSync(join(ROOT, 'config', 'nostr.json'), 'utf8'));
const PUBLISHED_DIR = join(ROOT, 'content', 'nostr', 'published');

const flags = parseFlags(process.argv.slice(2));
if (!flags.file) {
  console.error('Usage: node scripts/nostr/publish-one.mjs --file=<draft.json> [--dry-run]');
  process.exit(2);
}

async function main() {
  if (!flags['dry-run']) assertLivePublishAuthorized();

  const path = resolve(flags.file);
  if (!existsSync(path)) {
    console.error(`File not found: ${path}`);
    process.exit(2);
  }
  const draft = JSON.parse(readFileSync(path, 'utf8'));
  const { ok, errors } = validateDraft(draft);
  if (!ok) {
    console.error('Validation failed:');
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }

  const signer = await makeSigner();
  const template = draftToEventTemplate(draft);
  const signedEvent = await signer.sign(template);

  if (flags['dry-run'] || signer.mode === 'dry-run') {
    console.log('[dry-run] would publish:');
    console.log(JSON.stringify(signedEvent, null, 2));
    await signer.close();
    return;
  }

  const pool = makePool();
  const relays = CONFIG.relays.write;
  const result = await publishToRelays(pool, relays, signedEvent, CONFIG.limits?.publish_timeout_ms ?? 8000);

  const minOk = CONFIG.limits?.min_relays_for_publish_success ?? 2;
  if (result.ok.length < minOk) {
    console.error(`Only ${result.ok.length}/${relays.length} relays accepted (min ${minOk}). Not moving file.`);
    await signer.close();
    try { pool.close(relays); } catch {}
    process.exit(1);
  }

  if (!existsSync(PUBLISHED_DIR)) mkdirSync(PUBLISHED_DIR, { recursive: true });
  const out = {
    ...draft,
    status: 'published',
    published_at: new Date().toISOString(),
    event_id: signedEvent.id,
    pubkey: signedEvent.pubkey,
    relays_ok: result.ok,
    relays_failed: result.failed,
  };
  const outFile = join(PUBLISHED_DIR, basename(path));
  writeFileSync(outFile, JSON.stringify(out, null, 2) + '\n', 'utf8');

  console.log(`[ok] event ${signedEvent.id} on ${result.ok.length}/${relays.length} relays`);
  console.log(`    written: ${outFile}`);

  await signer.close();
  try { pool.close(relays); } catch {}
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

main().catch((err) => {
  console.error('publish-one failed:', err.message);
  process.exit(2);
});
