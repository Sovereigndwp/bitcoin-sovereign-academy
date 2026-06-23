// Tests for the Bitcoin vs Banking tradeoff simulator (v1, three rails).
// Run: node --test tests/interactive-tools.bitcoin-vs-banking.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { JSDOM } from "jsdom";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PAGE = path.join(ROOT, "interactive-demos/bitcoin-vs-banking/index.html");
const HTML = readFileSync(PAGE, "utf8");

// Load the page into jsdom without executing external <script src> tags, then
// eval only the simulator script so its pure logic and DOM rendering run.
function mount() {
  const dom = new JSDOM(HTML, { pretendToBeVisual: true, runScripts: "outside-only", url: "https://example.com/interactive-demos/bitcoin-vs-banking/" });
  const { window } = dom;
  const sim = window.document.getElementById("bvb-sim");
  assert.ok(sim, "simulator script #bvb-sim must exist");
  window.eval(sim.textContent);
  // The page wires init() on DOMContentLoaded. In jsdom that event may have
  // already passed before eval, so fire it to ensure the simulator mounts.
  window.document.dispatchEvent(new window.Event("DOMContentLoaded"));
  return { dom, window };
}

function fullState(overrides) {
  // Mirrors defaultState() in the page.
  return Object.assign({
    amount: 1000, scope: "domestic", urgency: "days", horizon: "spend_soon",
    reversibility: "not", selfcustody: "not", privacy: "low", trust: "trust",
    polrisk: "low", techcomfort: "new"
  }, overrides || {});
}

test("page mounts: container, inputs, and three rail cards render", () => {
  const { window } = mount();
  const doc = window.document;
  assert.ok(doc.getElementById("main-content"), "#main-content present");
  assert.ok(doc.getElementById("bvb-form"), "situation form present");
  assert.equal(doc.querySelectorAll(".bvb-toggle[data-input]").length, 9, "nine toggle inputs");
  assert.ok(doc.getElementById("bvb-amount"), "amount input present");
  assert.equal(doc.querySelectorAll("#bvb-rails .bvb-card").length, 3, "three rail cards rendered");
});

test("inputs update outputs: changing an input changes the result", () => {
  const { window } = mount();
  const before = window.document.getElementById("bvb-rails").textContent;
  window.BVB.setInput("selfcustody", "essential");
  window.BVB.setInput("polrisk", "high");
  const after = window.document.getElementById("bvb-rails").textContent;
  assert.notEqual(before, after, "rail cards re-render after input change");
});

test("bank or card can rank first (reversibility essential, domestic, spend soon)", () => {
  const { window } = mount();
  const state = fullState({ reversibility: "essential", selfcustody: "not", horizon: "spend_soon", scope: "domestic" });
  const top = window.BVB.rankRails(state).scored[0];
  assert.equal(top.rail, "bank", "bank ranks first");
  assert.equal(top.band, "strong", "bank is a strong fit here");
});

test("Bitcoin self-custody can rank first (high political risk, self-custody essential, cross-border, long hold)", () => {
  const { window } = mount();
  const state = fullState({ polrisk: "high", selfcustody: "essential", scope: "cross_border", horizon: "years", reversibility: "not" });
  const ranked = window.BVB.rankRails(state).scored;
  assert.equal(ranked[0].rail, "btc_self", "self-custody ranks first");
  assert.equal(ranked[0].band, "strong", "self-custody is a strong fit");
});

test("Bitcoin with a service provider can rank first (cross-border, urgent, easy use, no self-custody need)", () => {
  const { window } = mount();
  const state = fullState({ scope: "cross_border", urgency: "now", horizon: "spend_soon", selfcustody: "not", reversibility: "nice", techcomfort: "new" });
  const ranked = window.BVB.rankRails(state).scored;
  assert.equal(ranked[0].rail, "btc_provider", "provider ranks first in this situation");
});

test("provider is not treated as identical to self-custody when self-custody is essential", () => {
  const { window } = mount();
  const state = fullState({ selfcustody: "essential", polrisk: "high" });
  const ranked = window.BVB.rankRails(state).scored;
  const map = {};
  ranked.forEach((s) => { map[s.rail] = s.band; });
  // Provider cannot hold the user's keys, so it must fall short of an essential need.
  assert.equal(map.btc_provider, "poor", "provider cannot satisfy an essential self-custody need");
  assert.notEqual(map.btc_self, "poor", "self-custody at least covers the essential need");
  const order = ranked.map((s) => s.rail);
  assert.ok(order.indexOf("btc_self") < order.indexOf("btc_provider"), "self-custody outranks provider here");
});

test("political risk raises a freeze flag for the bank rail", () => {
  const { window } = mount();
  assert.ok(window.BVB.buildFlags(fullState({ polrisk: "high" })).includes("flag_freeze"));
  assert.ok(!window.BVB.buildFlags(fullState({ polrisk: "low" })).includes("flag_freeze"));
});

test("EN and ES dictionaries have identical key sets", () => {
  const { window } = mount();
  const en = Object.keys(window.BVB.STRINGS.en).sort();
  const es = Object.keys(window.BVB.STRINGS.es).sort();
  assert.deepEqual(en, es, "EN/ES key parity");
});

test("no em dash (U+2014) anywhere in the page source", () => {
  assert.equal(HTML.indexOf("\u2014"), -1, "no U+2014 in index.html");
});

test("no NaN or Infinity reaches the DOM across edge-case inputs", () => {
  const { window } = mount();
  const amounts = [0, -50, 1, 1000, 5000, 999999999, NaN, Infinity];
  amounts.forEach((amt) => {
    window.BVB.setInput("amount", amt);
    ["domestic", "cross_border"].forEach((scope) => {
      window.BVB.setInput("scope", scope);
      const txt = window.document.getElementById("bvb-rails").textContent;
      assert.ok(!/NaN|Infinity/.test(txt), `no NaN/Infinity for amount=${amt} scope=${scope}`);
      window.document.querySelectorAll("#bvb-rails .bvb-band").forEach((b) => {
        assert.ok(/^(Strong fit|Workable|Poor fit|Encaja bien|Funcional|Encaja mal)$/.test(b.textContent.trim()), "band is a valid label");
      });
    });
  });
});

test("no external network calls in the simulator logic", () => {
  const sim = HTML.match(/<script id="bvb-sim">([\s\S]*?)<\/script>/);
  assert.ok(sim, "found simulator script");
  const body = sim[1];
  assert.equal(/\bfetch\s*\(/.test(body), false, "no fetch");
  assert.equal(/XMLHttpRequest/.test(body), false, "no XMLHttpRequest");
  assert.equal(/WebSocket/.test(body), false, "no WebSocket");
});

test("mount contract intact: route infrastructure scripts and links preserved", () => {
  const required = [
    '/js/config.js', '/js/demo-lock-subdomain.js', '/js/subdomain-access-control.js',
    '/js/icon-library.js', '/js/navigation-context.js', '/js/reflect-widget.js',
    '/js/membership-gate.js', '/js/analytics.js', '/js/email-capture.js',
    '/js/tip-cta.js', '/js/demo-nav.js',
    '/css/tokens.css', '/css/brand.css', '/css/widgets.css', '/css/icons.css',
    '/css/interactive-demos.css', '/css/demo-shell.css'
  ];
  required.forEach((r) => assert.ok(HTML.includes(r), `preserved: ${r}`));
  assert.ok(HTML.includes('id="main-content"'), "#main-content preserved");
  assert.ok(HTML.includes("urlParams.get('level')"), "?level= switcher preserved");
  assert.ok(HTML.includes('class="reflect-widget"'), "reflect widget preserved");
  assert.ok(HTML.includes('data-email-capture="page-footer"'), "email capture block preserved");
  assert.ok(HTML.includes('data-tip-cta="compact"'), "tip block preserved");
  assert.ok(HTML.includes('href="../index.html"'), "back link preserved");
});

test("mobile layout sanity: responsive breakpoints present", () => {
  assert.ok(/@media \(max-width: 968px\)[\s\S]*?\.bvb-rails\s*\{\s*grid-template-columns: 1fr/.test(HTML), "rails stack at 968px");
  assert.ok(/@media \(max-width: 768px\)[\s\S]*?\.bvb-fields\s*\{\s*grid-template-columns: 1fr/.test(HTML), "fields stack at 768px");
  assert.ok(/@media \(max-width: 360px\)[\s\S]*?overflow-x: hidden/.test(HTML), "no horizontal overflow at 360px");
});

test("no investment advice or price/fee claims in copy", () => {
  const { window } = mount();
  const both = JSON.stringify(window.BVB.STRINGS).toLowerCase();
  ["you should buy", "should invest", "guaranteed return", "best investment"].forEach((p) => {
    assert.equal(both.includes(p), false, `no advice phrase: ${p}`);
  });
  // No seed/key entry surface in the page.
  assert.equal(/seed phrase|private key|enter your (seed|key)/i.test(HTML), false, "no seed or key entry surface");
});
