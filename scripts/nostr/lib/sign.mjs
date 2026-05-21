// Signing strategy abstraction.
//
//   env      — read NSEC hex from environment, sign locally with nostr-tools
//   bunker   — NIP-46 remote signer. Private key never enters this process.
//   dry-run  — return the unsigned event without writing or signing.
//
// The mode is selected by NOSTR_SIGNER_MODE (defaults to "env").
//
// Safety: this module NEVER logs the private key or bunker secret.
// It logs the npub (public) once at startup so the operator can confirm which
// account is about to be used.

import { finalizeEvent, getPublicKey, generateSecretKey } from 'nostr-tools/pure';
import { nip19 } from 'nostr-tools';
import { BunkerSigner, parseBunkerInput } from 'nostr-tools/nip46';
import { SimplePool } from 'nostr-tools/pool';

export function getSignerMode() {
  return (process.env.NOSTR_SIGNER_MODE || 'env').toLowerCase();
}

export function isTestAccount() {
  return process.env.NOSTR_USE_TEST === '1';
}

/**
 * Confirm a live-publish has explicit operator authorization. Throws if not.
 * Test-account use bypasses this guard.
 */
export function assertLivePublishAuthorized() {
  if (isTestAccount()) return;
  const flag = process.env.NOSTR_CONFIRM_LIVE;
  if (flag !== 'YES_I_REALLY_WANT_TO_PUBLISH_FROM_MAIN') {
    throw new Error(
      'Refusing to publish from the MAIN account: set NOSTR_USE_TEST=1 for the test account, ' +
      'or NOSTR_CONFIRM_LIVE=YES_I_REALLY_WANT_TO_PUBLISH_FROM_MAIN for the main account.',
    );
  }
}

/**
 * Returns a signer object: { pubkey, sign(eventTemplate), close() }
 */
export async function makeSigner() {
  const mode = getSignerMode();
  if (mode === 'dry-run') return makeDryRunSigner();
  if (mode === 'bunker') return await makeBunkerSigner();
  return makeEnvSigner();
}

function readHexKeyFromEnv() {
  const envName = isTestAccount() ? 'NOSTR_TEST_PRIVATE_KEY_HEX' : 'NOSTR_PRIVATE_KEY_HEX';
  const hex = process.env[envName];
  if (!hex) throw new Error(`Missing ${envName} in environment (.env.local).`);
  const clean = hex.trim().toLowerCase();
  if (!/^[0-9a-f]{64}$/.test(clean)) {
    throw new Error(`${envName} must be 64 lowercase hex chars.`);
  }
  return clean;
}

function makeEnvSigner() {
  const hex = readHexKeyFromEnv();
  const sk = Uint8Array.from(Buffer.from(hex, 'hex'));
  const pubkey = getPublicKey(sk);
  const npub = nip19.npubEncode(pubkey);
  console.log(`[signer] mode=env pubkey=${pubkey} npub=${npub} ${isTestAccount() ? '(TEST)' : '(MAIN)'}`);
  return {
    mode: 'env',
    pubkey,
    npub,
    async sign(eventTemplate) {
      return finalizeEvent({ ...eventTemplate, pubkey }, sk);
    },
    async close() { /* nothing to do */ },
  };
}

async function makeBunkerSigner() {
  const uri = process.env.NOSTR_BUNKER_URI;
  if (!uri) throw new Error('NOSTR_SIGNER_MODE=bunker but NOSTR_BUNKER_URI is not set.');
  const pointer = await parseBunkerInput(uri);
  if (!pointer) throw new Error('Could not parse NOSTR_BUNKER_URI.');

  // Local app key — ephemeral per session. Stored only in memory.
  const localSk = generateSecretKey();

  const pool = new SimplePool();
  const bunker = new BunkerSigner(localSk, pointer, { pool });
  await bunker.connect();
  const pubkey = await bunker.getPublicKey();
  const npub = nip19.npubEncode(pubkey);
  console.log(`[signer] mode=bunker pubkey=${pubkey} npub=${npub} ${isTestAccount() ? '(TEST)' : '(MAIN)'}`);
  return {
    mode: 'bunker',
    pubkey,
    npub,
    async sign(eventTemplate) {
      return await bunker.signEvent({ ...eventTemplate, pubkey });
    },
    async close() {
      try { await bunker.close(); } catch {}
      try { pool.close(pointer.relays || []); } catch {}
    },
  };
}

function makeDryRunSigner() {
  // No keys touched. Returns events with placeholder pubkey + id.
  console.log('[signer] mode=dry-run — no signing, no publishing');
  return {
    mode: 'dry-run',
    pubkey: 'DRY_RUN_NO_PUBKEY',
    npub: 'DRY_RUN_NO_NPUB',
    async sign(eventTemplate) {
      return { ...eventTemplate, pubkey: 'DRY_RUN_NO_PUBKEY', id: 'DRY_RUN_NO_ID', sig: 'DRY_RUN_NO_SIG' };
    },
    async close() {},
  };
}
