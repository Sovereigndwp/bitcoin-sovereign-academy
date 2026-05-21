#!/usr/bin/env node
// publish-approved.mjs — read every JSON file in content/nostr/approved/,
// validate, sign, publish to configured relays, then move successful files
// into content/nostr/published/ with the event_id + published_at appended.
//
// Defaults to the test account. Refuses to publish from the main account
// unless NOSTR_USE_TEST=0 AND NOSTR_CONFIRM_LIVE=YES_I_REALLY_WANT_TO_PUBLISH_FROM_MAIN.
//
// Supports --dry-run for a no-write trial.

import 'dotenv/config';
import { readFileSync, readdirSync, writeFileSync, mkdirSync, unlinkSync, existsSync } from 'node:fs';
import { join, basename, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { nip19 } from 'nostr-tools';

import { validateDraft } from './lib/schema.mjs';
import { draftToEventTemplate } from './lib/load-draft.mjs';
import { makeSigner, assertLivePublishAuthorized, isTestAccount } from './lib/sign.mjs';
import { makePool, publishToRelays } from './lib/nostr-client.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..', '..');
const CONFIG = JSON.parse(readFileSync(join(ROOT, 'config', 'nostr.json'), 'utf8'));

const APPROVED_DIR = join(ROOT, 'content', 'nostr', 'approved');
const PUBLISHED_DIR = join(ROOT, 'content', 'nostr', 'published');

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has('--dry-run');

async function main() {
  if (!DRY_RUN) assertLivePublishAuthorized();

  const files = listDrafts(APPROVED_DIR);
  if (!files.length) {
    console.log('No drafts in content/nostr/approved/. Nothing to publish.');
    return;
  }
  console.log(`Found ${files.length} approved draft(s).${DRY_RUN ? ' [DRY RUN]' : ''}`);

  const signer = await makeSigner();
  const pool = makePool();

  let okCount = 0;
  let failCount = 0;

  for (const file of files) {
    const path = join(APPROVED_DIR, file);
    let draft;
    try {
      draft = JSON.parse(readFileSync(path, 'utf8'));
    } catch (err) {
      console.error(`[skip] ${file}: invalid JSON — ${err.message}`);
      failCount++; continue;
    }

    const { ok, errors } = validateDraft(draft, {
      maxChars: CONFIG.limits?.per_post_max_chars ?? 2000,
      maxLinks: CONFIG.limits?.per_post_max_links ?? 2,
    });
    if (!ok) {
      console.error(`[skip] ${file}: validation failed`);
      for (const e of errors) console.error(`        - ${e}`);
      failCount++; continue;
    }

    const template = draftToEventTemplate(draft);
    const signedEvent = await signer.sign(template);

    if (DRY_RUN || signer.mode === 'dry-run') {
      console.log(`[dry-run] would publish ${file}`);
      console.log(JSON.stringify(signedEvent, null, 2));
      okCount++; continue;
    }

    const relays = CONFIG.relays.write;
    const result = await publishToRelays(pool, relays, signedEvent, CONFIG.limits?.publish_timeout_ms ?? 8000);

    const minOk = CONFIG.limits?.min_relays_for_publish_success ?? 2;
    if (result.ok.length < minOk) {
      console.error(`[fail] ${file}: only ${result.ok.length}/${relays.length} relays accepted (min ${minOk})`);
      for (const f of result.failed) console.error(`        - ${f.relay}: ${f.error}`);
      failCount++; continue;
    }

    // Persist published record
    const published = {
      ...draft,
      status: 'published',
      published_at: new Date().toISOString(),
      event_id: signedEvent.id,
      pubkey: signedEvent.pubkey,
      relays_ok: result.ok,
      relays_failed: result.failed,
      nostr_uri: `nostr:${nip19Nevent(signedEvent.id, result.ok)}`,
    };

    if (!existsSync(PUBLISHED_DIR)) mkdirSync(PUBLISHED_DIR, { recursive: true });
    const outFile = join(PUBLISHED_DIR, file);
    writeFileSync(outFile, JSON.stringify(published, null, 2) + '\n', 'utf8');

    // Delete the original approved file — the canonical record now lives in published/.
    try { unlinkSync(path); } catch (err) {
      console.warn(`[warn] failed to remove ${path}: ${err.message}`);
    }

    console.log(`[ok]   ${file} → event ${signedEvent.id.slice(0, 16)}… on ${result.ok.length}/${relays.length} relays`);
    okCount++;
  }

  await signer.close();
  try { pool.close(CONFIG.relays.write); } catch {}

  console.log(`\nDone. ok=${okCount} fail=${failCount}${DRY_RUN ? ' [DRY RUN]' : ''} account=${isTestAccount() ? 'TEST' : 'MAIN'}`);
  if (failCount > 0) process.exit(1);
}

function listDrafts(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.json') && !f.startsWith('.'))
    .sort();
}

function nip19Nevent(eventId, relays) {
  try {
    return nip19.neventEncode({ id: eventId, relays: relays.slice(0, 3) });
  } catch {
    return eventId;
  }
}

main().catch((err) => {
  console.error('publish-approved failed:', err.message);
  process.exit(2);
});
