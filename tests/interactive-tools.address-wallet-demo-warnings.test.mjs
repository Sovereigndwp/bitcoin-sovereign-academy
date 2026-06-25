// Tests for demo-safety warnings on Address Format Explorer and Wallet Security Workshop.
// Run: node --test tests/interactive-tools.address-wallet-demo-warnings.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const AFE = path.join(ROOT, "interactive-demos/address-format-explorer/index.html");
const WSW = path.join(ROOT, "interactive-demos/wallet-security-workshop/index.html");
const AFE_HTML = readFileSync(AFE, "utf8");
const WSW_HTML = readFileSync(WSW, "utf8");

test("Address Format Explorer shows a prominent demo-address warning", () => {
  assert.ok(/demo-address-banner/.test(AFE_HTML), "demo-address banner element present");
  assert.ok(/Demo addresses only/i.test(AFE_HTML), "states demo addresses only");
  assert.ok(/never send bitcoin to any address/i.test(AFE_HTML), "warns not to send Bitcoin to shown addresses");
});

test("Wallet Security Workshop relabels the passphrase field as demo-only", () => {
  assert.ok(/Passphrase \(Demo 25th Word\)/.test(WSW_HTML), "passphrase label marked demo");
  assert.ok(
    /do not enter a real wallet passphrase, seed phrase, or private key/i.test(WSW_HTML),
    "explicit no-real-secrets helper present"
  );
  assert.ok(/autocomplete="off"/.test(WSW_HTML), "passphrase field disables autocomplete");
  assert.ok(/Practice seed only/i.test(WSW_HTML), "practice-seed warning present near seed display");
});

test("no em dash (U+2014) in either changed file", () => {
  assert.equal(AFE_HTML.indexOf("—"), -1, "no U+2014 in Address Format Explorer");
  assert.equal(WSW_HTML.indexOf("—"), -1, "no U+2014 in Wallet Security Workshop");
});

test("no new network send introduced by the warning markup", () => {
  const addedAfe = AFE_HTML.match(/<div class="demo-address-banner"[\s\S]*?<\/div>/);
  const addedWsw = WSW_HTML.match(/<small class="help-text">Practice field only[\s\S]*?<\/small>/);
  assert.ok(addedAfe, "AFE banner block found");
  assert.ok(addedWsw, "WSW helper block found");
  [addedAfe[0], addedWsw[0]].forEach((block) => {
    assert.equal(/fetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon/.test(block), false, "no network call in added markup");
  });
});

test("mount contract preserved: Address Format Explorer", () => {
  const required = [
    'address-generator.js', 'fee-calculator.js', 'main.js',
    '/js/icon-library.js', '/js/navigation-context.js', '/js/reflect-widget.js',
    '/js/membership-gate.js', '/js/analytics.js', '/js/email-capture.js',
    '/js/tip-cta.js', '/js/demo-nav.js'
  ];
  required.forEach((r) => assert.ok(AFE_HTML.includes('"' + r + '"'), `preserved: ${r}`));
  assert.ok(AFE_HTML.includes('id="main-content"'), "#main-content preserved");
  assert.ok(AFE_HTML.includes('class="reflect-widget"'), "reflect widget preserved");
  assert.ok(AFE_HTML.includes('data-tip-cta="compact"'), "tip block preserved");
});

test("mount contract preserved: Wallet Security Workshop", () => {
  const required = [
    '/js/config.js', '/js/demo-lock-subdomain.js', '/js/subdomain-access-control.js',
    '/js/icon-library.js', '/js/navigation-context.js', '/js/reflect-widget.js',
    '/js/membership-gate.js', '/js/analytics.js', '/js/email-capture.js',
    '/js/tip-cta.js', '/js/demo-nav.js'
  ];
  required.forEach((r) => assert.ok(WSW_HTML.includes('"' + r + '"'), `preserved: ${r}`));
  assert.ok(WSW_HTML.includes('id="main-content"'), "#main-content preserved");
  assert.ok(WSW_HTML.includes('class="reflect-widget"'), "reflect widget preserved");
  assert.ok(WSW_HTML.includes('data-tip-cta="compact"'), "tip block preserved");
  assert.ok(WSW_HTML.includes('id="passphrase"'), "passphrase field still present (relabeled)");
});
