#!/usr/bin/env node
// zap-profile-check.mjs — round-trip verifier for NIP-05 + Lightning address.
//
// Checks:
//   1. https://<domain>/.well-known/nostr.json returns 200 + CORS *
//   2. Each name → hex pubkey mapping is well-formed (lowercase 64-char hex)
//   3. The lud16 from config resolves to a working LNURL endpoint
//   4. The LNURL endpoint advertises allowsNostr=true + a valid nostrPubkey hex
//
// No keys touched. Safe to run anywhere. Good first thing to run after a deploy.

import { readFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..', '..');
const CONFIG = JSON.parse(readFileSync(join(ROOT, 'config', 'nostr.json'), 'utf8'));

const SITE = (CONFIG.links?.site || 'https://bitcoinsovereign.academy').replace(/\/$/, '');
const NIP05 = CONFIG.profile?.nip05;
const LUD16 = CONFIG.profile?.lud16;

let failures = 0;
function note(label, ok, detail = '') {
  const tag = ok ? '[ok]' : '[fail]';
  if (!ok) failures++;
  console.log(`${tag} ${label}${detail ? ' — ' + detail : ''}`);
}

async function check() {
  // 1. NIP-05 file
  const nip05Url = `${SITE}/.well-known/nostr.json`;
  let res;
  try {
    res = await fetch(nip05Url, { redirect: 'manual' });
  } catch (err) {
    note(`GET ${nip05Url}`, false, err.message);
    return;
  }
  note(`GET ${nip05Url} status ${res.status}`, res.status === 200);
  const cors = res.headers.get('access-control-allow-origin');
  note(`CORS Access-Control-Allow-Origin on /.well-known/nostr.json`, cors === '*', `got: ${cors || '<missing>'}`);

  const json = await res.json().catch(() => null);
  note(`/.well-known/nostr.json is valid JSON`, !!json);
  if (!json) return;

  const names = json.names || {};
  let placeholderCount = 0;
  for (const [name, hex] of Object.entries(names)) {
    if (typeof hex !== 'string' || !/^[0-9a-f]{64}$/.test(hex)) {
      if (/^REPLACE_WITH/i.test(hex || '')) placeholderCount++;
      note(`names.${name} is lowercase 64-char hex`, false, `got: ${hex}`);
    } else {
      note(`names.${name} is lowercase 64-char hex`, true);
    }
  }
  if (placeholderCount > 0) {
    console.log(`    (${placeholderCount} placeholder pubkey(s) detected — run go-live to fill them in)`);
  }

  // 2. LUD16 → LNURL pay endpoint
  if (!LUD16 || !LUD16.includes('@')) {
    note(`profile.lud16 looks valid`, false, `got: ${LUD16}`);
    return;
  }
  const [user, domain] = LUD16.split('@');
  const lnurlUrl = `https://${domain}/.well-known/lnurlp/${user}`;
  let lnRes;
  try {
    lnRes = await fetch(lnurlUrl);
  } catch (err) {
    note(`GET ${lnurlUrl}`, false, err.message);
    return;
  }
  note(`GET ${lnurlUrl} status ${lnRes.status}`, lnRes.status === 200);
  const ln = await lnRes.json().catch(() => null);
  if (!ln) return;
  note(`LNURL.allowsNostr === true`, ln.allowsNostr === true, `got: ${ln.allowsNostr}`);
  const npubKey = ln.nostrPubkey || '';
  note(`LNURL.nostrPubkey is 64-char hex`, /^[0-9a-f]{64}$/.test(npubKey), `got: ${npubKey ? npubKey.slice(0, 12) + '…' : '<missing>'}`);
  if (typeof ln.minSendable === 'number' && typeof ln.maxSendable === 'number') {
    note(`LNURL min/max sendable present`, true, `${ln.minSendable}–${ln.maxSendable} msat`);
  }
}

await check();
console.log(failures ? `\n${failures} failure(s).` : '\nAll checks passed.');
process.exit(failures ? 1 : 0);
