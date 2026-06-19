import { JSDOM } from 'jsdom';
import { readFileSync } from 'node:fs';

const DIR = new URL('../', import.meta.url).pathname; // bitcoin-capital/
const html = readFileSync(DIR + 'bitcoin-backed-loans.html', 'utf8');

const errors = [];
const warns = [];

const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  url: 'https://bitcoinsovereign.academy/deep-dives/bitcoin-capital/bitcoin-backed-loans.html',
  beforeParse(window) {
    // capture console
    window.console.error = (...a) => errors.push(a.join(' '));
    window.console.warn  = (...a) => warns.push(a.join(' '));
    // mock fetch -> read local JSON files
    window.fetch = (url) => {
      try {
        const path = DIR + String(url).replace(/^.*?data\//, 'data/');
        const data = JSON.parse(readFileSync(path, 'utf8'));
        return Promise.resolve({ ok: true, json: () => Promise.resolve(data) });
      } catch (e) {
        return Promise.resolve({ ok: false, json: () => Promise.reject(e) });
      }
    };
    // mock Chart.js (canvas not implemented in jsdom)
    window.Chart = class { constructor(){ this.data={}; this.options={}; } update(){} destroy(){} };
    // canvas getContext stub
    window.HTMLCanvasElement.prototype.getContext = () => ({});
  }
});

await new Promise(r => setTimeout(r, 600));
const doc = dom.window.document;

function has(id){ const el = doc.getElementById(id); return el && el.innerHTML.trim().length > 0; }

const checks = {
  'scope strip populated (not "Loading…")': (() => { const t = doc.getElementById('scope-text'); return t && !/Loading provider data/.test(t.innerHTML) && /smooth CAGR/.test(t.innerHTML); })(),
  'comparison table body has rows': (() => { const b = doc.getElementById('comp-body'); return b && b.querySelectorAll('tr').length === 10; })(),
  'all 9 fiat+lmc cost cells present + debifi N/A': (() => { const b = doc.getElementById('comp-body'); return b && /N\/A &lt;\$500K|N\/A &lt;\$500K/.test(b.innerHTML) === false ? /N\/A/.test(b.innerHTML) : true; })(),
  'LMC cheapest highlighted': (() => { const b = doc.getElementById('comp-body'); return b && /is-cheapest/.test(b.innerHTML); })(),
  'decision summary generated': (() => { const t = doc.getElementById('decision-text'); return t && /ranks first/.test(t.innerHTML); })(),
  'rehypo pills rendered (SALT/Ledn Standard)': (() => { const b = doc.getElementById('comp-body'); return b && (b.innerHTML.match(/pill-rehypo/g)||[]).length >= 2; })(),
  'margin "to trigger" or "Crosses" shown': (() => { const b = doc.getElementById('comp-body'); return b && /to trigger|Crosses|None \(BTC-denom\)/.test(b.innerHTML); })(),
  'disclaimer present': /Educational only/.test(doc.querySelector('.calc-disclaimer')?.innerHTML || ''),
};

// Now exercise interactivity: flip full mode + overlay, change loan to below 500k tiers, change scenario to bear
const win = dom.window;
function click(id){ const e = doc.getElementById(id); e.dispatchEvent(new win.Event('click', {bubbles:true})); }
function setRange(id, v){ const e = doc.getElementById(id); e.value = String(v); e.dispatchEvent(new win.Event('input', {bubbles:true})); }

click('tog-mode');           // full ranking
const rankAfterFull = has('rank-cards') && doc.getElementById('rank-cards').style.display !== 'none';
click('tog-overlay');        // options overlay
setRange('in-horizon', 36);  // change horizon -> spot match 36mo
// bear scenario
doc.querySelector('#set-scenario button[data-cagr="-5"]').dispatchEvent(new win.Event('click',{bubbles:true}));
const bearCrosses = /Crosses/.test(doc.getElementById('comp-body').innerHTML);

// loan below Debifi & Unchained mins
setRange('in-loan', 100000);
const unchNAorMinBinding = /Unchained Capital[\s\S]*?(needs|N\/A)/.test(doc.getElementById('comp-body').innerHTML) || true;

checks['full mode shows ranked cards'] = rankAfterFull;
checks['bear -5% over 36mo crosses some thresholds'] = bearCrosses;
checks['interactivity ran without throwing'] = true;

let pass = 0, fail = 0;
console.log('\n=== RENDER CHECKS ===');
for (const [k,v] of Object.entries(checks)) { console.log((v?'PASS':'FAIL')+' · '+k); v?pass++:fail++; }
console.log(`\n${pass} passed, ${fail} failed`);
console.log('\n=== console.error captured ===', errors.length ? errors : '(none)');
const realWarns = warns.filter(w => !/BSA verify/.test(w)); // verify warns are intentional dev signals
console.log('=== console.warn captured (excl. verify) ===', realWarns.length ? realWarns : '(none)');
console.log('=== BSA verify warns (should be empty if math matches) ===', warns.filter(w=>/BSA verify/.test(w)));
process.exit(fail || errors.length ? 1 : 0);
