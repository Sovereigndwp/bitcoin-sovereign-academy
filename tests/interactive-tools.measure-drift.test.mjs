// Tests for the Module 4 Measure-Drift Simulator (tool key "broken-scoreboard").
// Run: node --test tests/interactive-tools.measure-drift.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { JSDOM } from "jsdom";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LIB = readFileSync(path.join(ROOT, "js/interactive-tools/interactive-tools.js"), "utf8");
const ENGINE = readFileSync(path.join(ROOT, "deep-dives/rules-under-the-game/js/rules-under-the-game.js"), "utf8");

// Pull the UI.en / UI.es string tables out of the engine without executing the
// whole engine (it auto-boots on DOM ready). We grab the object literal that the
// `t` table for the tool draws from, by evaluating just the UI block.
function extractUI() {
  const m = ENGINE.match(/var\s+UI\s*=\s*\{[\s\S]*?\n\s{2}\};/);
  assert.ok(m, "could not locate UI table in engine");
  // eslint-disable-next-line no-eval
  const UI = eval("(" + m[0].replace(/^var\s+UI\s*=\s*/, "").replace(/;$/, "") + ")");
  return UI;
}

const SCENARIOS = [
  { id: "referee", label: "Referee", reported_signal: "Ahead", true_signal: "Even" },
  { id: "grades", label: "Grades", reported_signal: "High", true_signal: "Mixed" },
  { id: "prices", label: "Prices", reported_signal: "Different daily", true_signal: "Same goods" },
  { id: "savings", label: "Savings", reported_signal: "Number rises", true_signal: "Buys less" },
  { id: "printing", label: "Printing", reported_signal: "Feels flush", true_signal: "Same goods" }
];

function freshDom(strings) {
  const dom = new JSDOM("<!doctype html><html><body><div id='m'></div></body></html>", { pretendToBeVisual: true, runScripts: "outside-only" });
  const { window } = dom;
  // make timers + Math available; jsdom provides them. Load the library into window.
  window.eval(LIB);
  return { dom, window };
}

function mount(window, strings, onComplete) {
  const container = window.document.getElementById("m");
  window.BSAInteractive.mount(container, {
    tool: "broken-scoreboard",
    spec: { scenarios: SCENARIOS },
    t: strings,
    onComplete: onComplete || function () {}
  });
  return container;
}

function setRange(window, input, value) {
  input.value = String(value);
  input.dispatchEvent(new window.Event("input", { bubbles: true }));
}

const UI = extractUI();
const EN = UI.en;
const ES = UI.es;

test("1. renderer mounts with two sliders and a scenario select", () => {
  const { window } = freshDom();
  const c = mount(window, EN);
  const ranges = c.querySelectorAll("input[type=range]");
  assert.equal(ranges.length, 2, "two range sliders present");
  assert.ok(c.querySelector("select"), "scenario select present");
  // accessible labels
  ranges.forEach((r) => {
    const lab = c.querySelector(`label[for="${r.id}"]`);
    assert.ok(lab && lab.textContent.trim().length, "each slider has a <label for>");
    assert.ok(r.getAttribute("aria-valuetext"), "each slider has aria-valuetext");
  });
  assert.ok(c.querySelector('[aria-live="polite"]'), "decision readout is an aria-live region");
});

test("2. moving either slider recomputes the reported number and gap", () => {
  const { window } = freshDom();
  const c = mount(window, EN);
  const [dR, nR] = c.querySelectorAll("input[type=range]");
  const reportedVal = () => c.querySelector(".sim-bar-row.reported .sim-bar-val").textContent;
  const gapText = () => c.querySelector(".sim-gap").textContent;

  const before = reportedVal();
  setRange(window, dR, 12);
  const afterD = reportedVal();
  assert.notEqual(before, afterD, "raising the rate changes the reported number");

  const gapBefore = gapText();
  setRange(window, nR, 20);
  assert.notEqual(gapBefore, gapText(), "changing periods changes the gap");
});

test("3. onComplete fires exactly once after a slider moves off default", () => {
  const { window } = freshDom();
  let calls = 0;
  const c = mount(window, EN, () => { calls += 1; });
  const [dR, nR] = c.querySelectorAll("input[type=range]");
  assert.equal(calls, 0, "no fire on initial paint");
  setRange(window, dR, 9);
  setRange(window, dR, 11);
  setRange(window, nR, 4);
  assert.equal(calls, 1, "onComplete fired once, not per drag");
});

test("4. d = 0 yields reported = true and gap = 0", () => {
  const { window } = freshDom();
  const c = mount(window, EN);
  const [dR] = c.querySelectorAll("input[type=range]");
  setRange(window, dR, 0);
  const reported = c.querySelector(".sim-bar-row.reported .sim-bar-val").textContent.replace(/,/g, "");
  const truth = c.querySelector(".sim-bar-row.truth .sim-bar-val").textContent.replace(/,/g, "");
  assert.equal(reported, truth, "reported equals what is actually there at rate 0");
  assert.match(c.querySelector(".sim-gap").textContent, /\b0\b.*\(\+0%\)/, "gap reads 0 (+0%)");
});

test("5. n = 0 yields gap = 0", () => {
  const { window } = freshDom();
  const c = mount(window, EN);
  const [, nR] = c.querySelectorAll("input[type=range]");
  setRange(window, nR, 0);
  assert.match(c.querySelector(".sim-gap").textContent, /\(\+0%\)/, "no periods means no drift");
});

test("6. EN and ES skeletons are structurally identical", () => {
  function skeleton(strings) {
    const { window } = freshDom();
    const c = mount(window, strings);
    // normalize: tag + class names, drop text content and ids
    return Array.from(c.querySelectorAll("*")).map((n) => n.tagName + "." + (n.className || "")).join("|");
  }
  assert.equal(skeleton(EN), skeleton(ES), "EN and ES render the same element tree");
});

test("7. zero em dashes in shipped strings (library + engine string tables)", () => {
  const EM = "—"; // em dash, written as an escape so this file holds no literal one
  assert.ok(!LIB.includes(EM), "interactive-tools.js has no em dash");
  // check every string value in EN + ES tables
  for (const [lang, table] of [["en", EN], ["es", ES]]) {
    for (const [k, v] of Object.entries(table)) {
      if (typeof v === "string") assert.ok(!v.includes(EM), `${lang}.${k} has an em dash`);
    }
  }
});
