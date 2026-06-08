/* Unit tests for js/youth-engine.js — the youth interactive engine's data logic
   (artifact save/aggregate, cross-device backup export/import, helpers, i18n).
   Run: node --test tests/youth-engine.test.mjs */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { JSDOM } from 'jsdom';

const SRC = fs.readFileSync(new URL('../js/youth-engine.js', import.meta.url), 'utf8');

function boot(opts = {}) {
  const dom = new JSDOM('<!doctype html><html lang="' + (opts.lang || 'en') + '"><body></body></html>',
    { url: 'https://test.local/youth-families/', runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  // Ensure legacy globals the engine uses exist on the window.
  for (const g of ['escape', 'unescape', 'btoa', 'atob']) if (typeof w[g] !== 'function' && typeof globalThis[g] === 'function') w[g] = globalThis[g];
  if (opts.YF_LANG) w.YF_LANG = opts.YF_LANG;
  w.eval(SRC);
  return w;
}

test('exposes the public API', () => {
  const w = boot();
  assert.equal(typeof w.YouthScenario, 'function');
  assert.equal(typeof w.YouthArtifact, 'object');
  assert.equal(typeof w.YouthPlan, 'object');
  assert.equal(typeof w.YouthLoop, 'object');
  assert.equal(typeof w.YouthArtifact.save, 'function');
  assert.equal(typeof w.YouthPlan.exportCode, 'function');
});

test('artifact save → get roundtrip + analytics-safe when no track()', () => {
  const w = boot();
  const rec = w.YouthArtifact.save('yf-w3-goal', { goal: 'Switch', cost: '$120' });
  assert.equal(rec.goal, 'Switch');
  assert.ok(rec._saved, 'stamps _saved');
  const got = w.YouthArtifact.get('yf-w3-goal');
  assert.equal(got.cost, '$120');
});

test('YouthPlan.collect groups artifacts by week', () => {
  const w = boot();
  w.YouthArtifact.save('yf-w3-goal', { goal: 'Bike' });
  w.YouthArtifact.save('yf-w5-paycheck', { net: '$235' });
  const byWeek = w.YouthPlan.collect();
  assert.deepEqual(Object.keys(byWeek).sort(), ['yf-w3', 'yf-w5']);
  assert.equal(byWeek['yf-w3'][0].data.goal, 'Bike');
});

test('cross-device backup: exportCode → importCode roundtrip restores artifacts', () => {
  const a = boot();
  a.YouthArtifact.save('yf-w3-goal', { goal: 'Guitar', cost: '$300' });
  a.YouthArtifact.save('yf-w9-moveout', { verdict: 'NOT YET' });
  const code = a.YouthPlan.exportCode();
  assert.ok(code && code.length > 0, 'produces a non-empty code');

  // fresh "device" with empty storage
  const b = boot();
  assert.equal(Object.keys(b.YouthPlan.collect()).length, 0, 'starts empty');
  assert.equal(b.YouthPlan.importCode(code), true);
  const restored = b.YouthPlan.collect();
  assert.equal(restored['yf-w3'][0].data.goal, 'Guitar');
  assert.equal(restored['yf-w9'][0].data.verdict, 'NOT YET');
});

test('importCode rejects garbage without throwing', () => {
  const w = boot();
  assert.equal(w.YouthPlan.importCode('not-valid-base64!!'), false);
  assert.equal(w.YouthPlan.importCode(''), false);
});

test('importCode ignores non-yf keys (no localStorage pollution)', () => {
  const w = boot();
  const evil = w.btoa(unescape(encodeURIComponent(JSON.stringify({ 'evil-key': 1, 'yf-w2-flow': { ok: true } }))));
  assert.equal(w.YouthPlan.importCode(evil), true);
  assert.equal(w.localStorage.getItem('evil-key'), null, 'did not write non-yf key');
  assert.ok(w.YouthPlan.collect()['yf-w2'], 'wrote the yf key');
});

test('num/money helpers parse messy input', () => {
  const w = boot();
  const { num, money } = w.YouthLoop;
  assert.equal(num('$1,234.50'), 1234.5);
  assert.equal(num('abc'), 0);
  assert.equal(money('1500'), '$1,500');
});

test('i18n: defaults to English, switches to Spanish via lang', () => {
  const en = boot();
  assert.equal(en.YouthLoop.t('predict_lock'), 'Lock it in');
  assert.equal(en.YouthLoop.lang(), 'en');

  const es = boot({ lang: 'es' });
  assert.equal(es.YouthLoop.lang(), 'es');
  assert.equal(es.YouthLoop.t('predict_lock'), 'Confirmar');
  // footer follows the locked EN/ES convention
  assert.equal(es.YouthLoop.t('footer'), 'Creado por Dalia · bitcoinsovereign.academy');
  // interpolation
  assert.equal(es.YouthLoop.t('plan_built', 3, 9), '3 / 9 creados');
});

test('YouthScenario renders a scene graph + outcome into a mount', () => {
  const w = boot();
  const mount = w.document.createElement('div');
  w.document.body.appendChild(mount);
  const graph = {
    intro: { text: '<p>Start</p>', choices: [{ title: 'Go', desc: '', next: 'end' }] },
    end: { outcome: 'good', title: 'Done', text: '<p>Nice</p>', learning: ['lesson one'] }
  };
  const sc = new w.YouthScenario(mount, graph, { start: 'intro' }).start();
  assert.match(mount.innerHTML, /yf-choice/);
  sc.choose('end');
  assert.match(mount.innerHTML, /yf-outcome-good/);
  assert.match(mount.innerHTML, /lesson one/);
});
