// SimplePool wrapper for the BSA Nostr automation.
//
// Hides the relay-set, applies timeouts, and surfaces a uniform publish result
// so the publisher script can decide whether to move a draft to published/.
//
// Uses nostr-tools >= 2.x (current API). If you upgrade nostr-tools and the
// publish() return shape changes, the only place to fix is this file.

import { SimplePool, useWebSocketImplementation } from 'nostr-tools/pool';
import { Relay } from 'nostr-tools/relay';
import WebSocket from 'ws';

useWebSocketImplementation(WebSocket);

export function makePool() {
  return new SimplePool();
}

/**
 * Publish a signed event to multiple relays. Returns per-relay results.
 *
 * @param {SimplePool} pool
 * @param {string[]} relays
 * @param {object} event   nostr-tools signed event
 * @param {number} timeoutMs
 * @returns {Promise<{ok: string[], failed: {relay: string, error: string}[]}>}
 */
export async function publishToRelays(pool, relays, event, timeoutMs = 8000) {
  const ok = [];
  const failed = [];

  const tasks = relays.map((url) =>
    withTimeout(pool.publish([url], event), timeoutMs, `timeout ${url}`)
      .then(() => ok.push(url))
      .catch((err) => failed.push({ relay: url, error: String(err && err.message || err) })),
  );

  await Promise.allSettled(tasks);
  return { ok, failed };
}

/**
 * Subscribe to relays for events matching filters, collect for ms, return list.
 * Used by weekly-report.mjs.
 */
export async function collectEvents(pool, relays, filters, windowMs = 4000) {
  const events = [];
  const seen = new Set();
  return new Promise((resolve) => {
    const sub = pool.subscribeMany(relays, filters, {
      onevent(ev) {
        if (seen.has(ev.id)) return;
        seen.add(ev.id);
        events.push(ev);
      },
      oneose() {
        // EOSE is not "done" across multiple relays in SimplePool; rely on window
      },
    });
    setTimeout(() => {
      try { sub.close(); } catch {}
      resolve(events);
    }, windowMs);
  });
}

/** Lightweight relay-connect test (no auth, no publish). */
export async function pingRelay(url, timeoutMs = 3000) {
  const start = Date.now();
  let relay;
  try {
    relay = await withTimeout(Relay.connect(url), timeoutMs, 'connect timeout');
    const ms = Date.now() - start;
    try { relay.close(); } catch {}
    return { url, ok: true, ms };
  } catch (err) {
    return { url, ok: false, error: String(err && err.message || err) };
  }
}

function withTimeout(promise, ms, msg) {
  return Promise.race([
    promise,
    new Promise((_, rej) => setTimeout(() => rej(new Error(msg)), ms)),
  ]);
}
