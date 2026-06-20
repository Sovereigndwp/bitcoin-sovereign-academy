import { JSDOM } from 'jsdom';
import { readFileSync } from 'node:fs';

const DIR = new URL('../', import.meta.url).pathname; // first-principles/
let failures = 0;
const ok = (c, m) => { console.log((c ? '  ok   ' : '  FAIL ') + m); if (!c) failures++; };

async function load(file) {
  const html = readFileSync(DIR + file, 'utf8');
  const errors = [];
  const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    url: 'https://bitcoinsovereign.academy/deep-dives/first-principles/' + file,
    beforeParse(window) {
      window.console.error = (...a) => errors.push(a.join(' '));
      window.onerror = (msg) => errors.push('onerror: ' + msg);
      window.fetch = (url) => {
        try {
          const path = DIR + String(url).replace(/^.*?data\//, 'data/');
          const data = JSON.parse(readFileSync(path, 'utf8'));
          return Promise.resolve({ ok: true, json: () => Promise.resolve(data) });
        } catch (e) { return Promise.resolve({ ok: false, json: () => Promise.reject(e) }); }
      };
      window.Chart = class { constructor(){ this.data={datasets:[{}]}; this.options={}; } update(){} destroy(){} };
      window.HTMLCanvasElement.prototype.getContext = () => ({});
      window.Element.prototype.scrollIntoView = () => {};
    }
  });
  await new Promise(r => setTimeout(r, 700));
  return { doc: dom.window.document, win: dom.window, errors };
}
const txt = (doc,id) => (doc.getElementById(id)?.textContent || '').trim();

console.log('\n# why-money-fails.html');
{
  const { doc, win, errors } = await load('why-money-fails.html');
  ok(errors.length === 0, 'no JS console errors' + (errors.length?': '+errors.join(' | '):''));
  // defaults: 4%/yr, $100,000 -> reconcile with worksheet (pp_after_30y 4% = 30.83%)
  ok(txt(doc,'pp-double').includes('17.7'), 'doubling time 17.7yr at 4% (got "'+txt(doc,'pp-double')+'")');
  ok(txt(doc,'pp-30') === '$30,832', 'real value after 30y = $30,832 (got "'+txt(doc,'pp-30')+'")');
  ok(txt(doc,'pp-10') === '$67,556', 'real value after 10y = $67,556 (got "'+txt(doc,'pp-10')+'")');
  ok(doc.querySelectorAll('#hyper-table tbody tr').length === 3, 'hyperinflation table has 3 rows');
  ok(doc.querySelectorAll('#pp-presets .preset-btn').length >= 4, 'presets rendered');
}

console.log('\n# digital-scarcity.html');
{
  const { doc, errors } = await load('digital-scarcity.html');
  ok(errors.length === 0, 'no JS console errors' + (errors.length?': '+errors.join(' | '):''));
  ok(txt(doc,'iss-subsidy') === '3.125', 'epoch-4 subsidy 3.125 (got "'+txt(doc,'iss-subsidy')+'")');
  ok(txt(doc,'iss-s2f') === '120', 'epoch-4 S2F rounds to 120 (got "'+txt(doc,'iss-s2f')+'")');
  ok(txt(doc,'iss-infl') === '0.83%', 'epoch-4 annual new supply 0.83% (got "'+txt(doc,'iss-infl')+'")');
  ok(txt(doc,'iss-cum').length > 0, 'cumulative supply populated (got "'+txt(doc,'iss-cum')+'")');
}

console.log('\n# original-question-everything.html');
{
  const { doc, win, errors } = await load('original-question-everything.html');
  ok(errors.length === 0, 'no JS console errors' + (errors.length?': '+errors.join(' | '):''));
  ok(typeof win.openNext === 'function', 'openNext defined');
  ok(typeof win.collapseAll === 'function', 'collapseAll defined');
  ok(!/0\/10 Principles Understood/.test(doc.body.innerHTML), 'no completion-percentage tracker');
  ok(doc.querySelectorAll('[onclick^="openNext"]').length === 10, '10 neutral Continue buttons wired');
}

console.log('\n' + (failures ? `RESULT: ${failures} FAILURE(S)` : 'RESULT: ALL CHECKS PASSED'));
process.exit(failures ? 1 : 0);
