// Tests for the Sovereign Vault safety + accuracy labels.
// Run: node --test tests/interactive-tools.sovereign-vault.test.mjs
// Pure-Node: no jsdom dependency. The safety guard's detector is run via a
// minimal window/document stub so the test works even without node_modules.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const VAULT = path.join(ROOT, "interactive-demos/sovereign-vault");
const PAGE = path.join(VAULT, "index.html");
const CRYPTO = path.join(VAULT, "js/crypto.js");
const HTML = readFileSync(PAGE, "utf8");
const CRYPTO_SRC = readFileSync(CRYPTO, "utf8");

const JS_FILES = [
  "js/crypto.js", "js/vault-core.js", "js/resilience.js",
  "js/export.js", "js/inheritance.js", "js/app.js"
].map((rel) => path.join(VAULT, rel));

test("no zero-knowledge wording remains in the changed files", () => {
  assert.equal(/zero[-\s]?knowledge/i.test(HTML), false, "index.html free of zero-knowledge");
  assert.equal(/zero[-\s]?knowledge/i.test(CRYPTO_SRC), false, "crypto.js free of zero-knowledge");
  assert.ok(/client-side encryption/i.test(CRYPTO_SRC), "crypto.js says client-side encryption");
});

test("clear warning against entering real seed phrases or keys is present", () => {
  assert.ok(/not a wallet/i.test(HTML), "states it is not a wallet");
  assert.ok(/planning and documentation tool/i.test(HTML), "states it is a planning/documentation tool");
  assert.ok(
    /never enter a real seed phrase, private key, or wallet passphrase/i.test(HTML),
    "explicit no-real-secrets warning present"
  );
  assert.ok(
    /do not use a wallet seed phrase, private key, or wallet passphrase/i.test(HTML),
    "master-password helper distinguishes it from a wallet secret"
  );
});

test("no network send is introduced anywhere in the vault scripts or the inline guard", () => {
  const banned = [/\bfetch\s*\(/, /XMLHttpRequest/, /WebSocket/, /sendBeacon/, /navigator\.send/, /new\s+Image\s*\(/];
  for (const file of JS_FILES) {
    const src = readFileSync(file, "utf8");
    for (const re of banned) {
      assert.equal(re.test(src), false, `${path.basename(file)} has no ${re}`);
    }
  }
  const guard = HTML.match(/<script id="sv-safety-guard">([\s\S]*?)<\/script>/);
  assert.ok(guard, "inline safety guard present");
  for (const re of banned) {
    assert.equal(re.test(guard[1]), false, `inline guard has no ${re}`);
  }
});

test("no em dash (U+2014) in the changed files", () => {
  assert.equal(HTML.indexOf("—"), -1, "no U+2014 in index.html");
  assert.equal(CRYPTO_SRC.indexOf("—"), -1, "no U+2014 in crypto.js");
});

test("mount contract preserved: scripts, main container, and footer blocks intact", () => {
  const required = [
    'js/crypto.js', 'js/vault-core.js', 'js/resilience.js', 'js/export.js',
    'js/inheritance.js', 'js/app.js',
    '/js/navigation-context.js', '/js/reflect-widget.js',
    '/js/analytics.js', '/js/email-capture.js', '/js/tip-cta.js'
  ];
  required.forEach((r) => assert.ok(HTML.includes('"' + r + '"'), `preserved script: ${r}`));
  assert.ok(HTML.includes('id="main-content"'), "#main-content preserved");
  assert.ok(HTML.includes('class="reflect-widget"'), "reflect widget preserved");
  assert.ok(HTML.includes('data-email-capture="family-education-vault"'), "email capture block preserved");
  assert.ok(HTML.includes('data-tip-cta="compact"'), "tip block preserved");
  assert.ok(HTML.includes('class="bsa-boundary-note"'), "boundary note preserved");
});

test("seed/key detector flags real secrets and leaves ordinary notes alone", () => {
  // Run the inline guard in a minimal stub so we do not need jsdom.
  const guard = HTML.match(/<script id="sv-safety-guard">([\s\S]*?)<\/script>/);
  assert.ok(guard, "inline safety guard present");
  const win = {};
  const doc = { readyState: "complete", getElementById: () => null, addEventListener: () => {} };
  // eslint-disable-next-line no-new-func
  new Function("window", "document", guard[1])(win, doc);
  const detect = win.__svSafety && win.__svSafety.looksLikeSecret;
  assert.equal(typeof detect, "function", "detector exposed on window.__svSafety");

  // Should flag (real secrets):
  assert.equal(detect("abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"), true, "12-word mnemonic flagged");
  assert.equal(detect("legal winner thank year wave sausage worth useful legal winner thank yellow"), true, "another 12-word mnemonic flagged");
  assert.equal(detect("0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"), true, "64-char hex private key flagged");
  assert.equal(detect("5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ"), true, "WIF private key flagged");

  // Should NOT flag (ordinary planning notes / aliases):
  assert.equal(detect("Home Safe"), false, "alias not flagged");
  assert.equal(detect("Primary cold storage for long term savings"), false, "short note not flagged");
  assert.equal(detect("Location Alpha, deposit box at the downtown branch, key with my sister"), false, "ordinary note not flagged");
  assert.equal(detect(""), false, "empty not flagged");
  assert.equal(detect("   "), false, "whitespace not flagged");
});
