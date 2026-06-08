/* ==========================================================================
   youth-engine.js — the youth-track interactive engine.

   Implements the signature learning loop PREDICT -> VERIFY -> KEEP -> SHARE
   (spec: docs/superpowers/specs/2026-06-08-youth-pedagogy-differentiation-spec.md)
   as reusable, data-attribute-mounted primitives + a branching-scenario engine
   generalized from the proven interactive-demos/emergency-fifty-scenario.

   No dependencies, no build step. Auto-inits on DOM ready + via MutationObserver
   (matches the reflect-widget pattern). Styling lives in /css/youth-engine.css.

   localStorage convention: yf-w<N>-<slug>  (e.g. yf-w3-goal). The Week-10
   aggregator (YouthPlan) reads every yf-w* artifact to build the family plan.
   ========================================================================== */
(function () {
  'use strict';

  /* ----------------------------------- store ----------------------------------- */
  const Store = {
    get(key, fallback = null) {
      try { const v = localStorage.getItem(key); return v == null ? fallback : JSON.parse(v); }
      catch { return fallback; }
    },
    set(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} },
    artifacts() {
      const out = {};
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (/^yf-w\d+-/.test(k)) out[k] = Store.get(k);
        }
      } catch {}
      return out;
    }
  };

  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const num = (v) => { const n = parseFloat(String(v).replace(/[^0-9.\-]/g, '')); return isFinite(n) ? n : 0; };
  const money = (n) => '$' + (Math.round(num(n) * 100) / 100).toLocaleString('en-US');

  /* =====================================================================
     1) PREDICT — commit a guess BEFORE the reveal (prediction-before-reveal).
        <div class="yf-predict" data-key="yf-w3-predict"
             data-question="How many days to save for it?" data-unit="days"></div>
        Reveal the truth from code: YouthLoop.reveal('yf-w3-predict', actualNumber)
     ===================================================================== */
  function mountPredict(el) {
    if (el.dataset.mounted) return; el.dataset.mounted = '1';
    const key = el.dataset.key || ('yf-predict-' + Math.abs(hash(el.dataset.question || '')));
    const q = el.dataset.question || 'Make your prediction first:';
    const unit = el.dataset.unit || '';
    const saved = Store.get(key);
    el.classList.add('yf-card', 'yf-predict-card');
    el.innerHTML =
      '<div class="yf-kicker">① Predict first</div>' +
      '<p class="yf-predict-q">' + esc(q) + '</p>' +
      '<div class="yf-predict-input">' +
        '<input type="text" inputmode="numeric" class="yf-input" placeholder="your guess"' +
          (saved ? ' value="' + esc(saved.guess) + '"' : '') + ' aria-label="' + esc(q) + '">' +
        (unit ? '<span class="yf-unit">' + esc(unit) + '</span>' : '') +
        '<button type="button" class="yf-btn yf-lock">Lock it in</button>' +
      '</div>' +
      '<div class="yf-reveal" hidden></div>';
    const input = el.querySelector('.yf-input');
    const lockBtn = el.querySelector('.yf-lock');
    lockBtn.addEventListener('click', () => {
      const guess = input.value.trim();
      if (!guess) { input.focus(); return; }
      Store.set(key, { guess, ts: Date.now() });
      el.classList.add('yf-locked');
      input.setAttribute('readonly', '');
      lockBtn.textContent = 'Locked ✓';
      lockBtn.disabled = true;
      el.dispatchEvent(new CustomEvent('yf:predicted', { bubbles: true, detail: { key, guess } }));
    });
    if (saved) { input.setAttribute('readonly', ''); el.classList.add('yf-locked'); lockBtn.textContent = 'Locked ✓'; lockBtn.disabled = true; }
  }

  /* =====================================================================
     2) VERIFY — don't trust, check. Surface a live number the learner audits
        against our claim. Reuses window.bitcoinData / [data-btc-live].
        <div class="yf-verify" data-claim="~19.7 million bitcoin exist today"
             data-live="supply" data-source="mempool.space"></div>
     ===================================================================== */
  function mountVerify(el) {
    if (el.dataset.mounted) return; el.dataset.mounted = '1';
    const claim = el.dataset.claim || 'our claim';
    const liveKey = el.dataset.live || '';
    const source = el.dataset.source || 'a public source';
    el.classList.add('yf-card', 'yf-verify-card');
    el.innerHTML =
      '<div class="yf-kicker">② Verify it yourself</div>' +
      '<p class="yf-verify-claim">We claim: <strong>' + esc(claim) + '</strong></p>' +
      '<p class="yf-verify-sub">Don’t take our word for it. Check it against ' + esc(source) + ':</p>' +
      '<div class="yf-verify-live">' +
        (liveKey
          ? 'Live now: <span class="yf-live" data-btc-live="' + esc(liveKey) + '">…</span>'
          : '<button type="button" class="yf-btn yf-checked-btn">I checked the source</button>') +
      '</div>' +
      '<label class="yf-verify-verdict' + (liveKey ? '' : ' hidden') + '">' +
        '<input type="checkbox" class="yf-verify-box"> Our claim holds up' +
      '</label>';
    // Let the live-data binder fill the [data-btc-live] span if present.
    try { if (window.bitcoinData && typeof window.bitcoinData.updateLiveElements === 'function') window.bitcoinData.updateLiveElements(); } catch {}
  }

  /* =====================================================================
     3) KEEP — the real artifact the learner owns. Save inputs + render a
        printable one-pager. The KEY differentiator (real-artifact 1.50).
        API: YouthArtifact.save('yf-w3-goal', {...});
             YouthArtifact.mountSheet(el)  // <div class="yf-artifact" data-key=...>
     ===================================================================== */
  const YouthArtifact = {
    save(key, data) {
      const rec = Object.assign({}, data, { _key: key, _saved: Date.now() });
      Store.set(key, rec);
      document.dispatchEvent(new CustomEvent('yf:artifact-saved', { detail: { key, data: rec } }));
      return rec;
    },
    get(key) { return Store.get(key); },
    /* Render a saved record into a branded, printable sheet element. `fields`
       is [{label, value}] OR a function(record)->[{label,value}]. */
    mountSheet(el) {
      if (el.dataset.mounted) return; el.dataset.mounted = '1';
      const key = el.dataset.key;
      const title = el.dataset.title || 'My Plan';
      const rec = Store.get(key);
      el.classList.add('yf-artifact-sheet');
      const render = () => {
        const r = Store.get(key);
        if (!r) { el.innerHTML = '<p class="yf-muted">Complete the activity above to create your keepsake.</p>'; return; }
        const rows = Object.keys(r).filter(k => !k.startsWith('_'))
          .map(k => '<tr><th>' + esc(prettify(k)) + '</th><td>' + esc(r[k]) + '</td></tr>').join('');
        el.innerHTML =
          '<div class="yf-sheet" id="' + esc(key) + '-sheet">' +
            '<div class="yf-sheet-head"><span class="yf-sheet-brand">Bitcoin Sovereign Academy</span>' +
              '<span class="yf-sheet-kicker">③ Keep this</span></div>' +
            '<h3 class="yf-sheet-title">' + esc(title) + '</h3>' +
            '<table class="yf-sheet-table">' + rows + '</table>' +
            '<div class="yf-sheet-foot">Created by Dalia · bitcoinsovereign.academy</div>' +
          '</div>' +
          '<div class="yf-sheet-actions">' +
            '<button type="button" class="yf-btn yf-print-btn">⎙ Print / Save PDF</button>' +
          '</div>';
        el.querySelector('.yf-print-btn').addEventListener('click', () => YouthArtifact.print(key + '-sheet'));
      };
      render();
      document.addEventListener('yf:artifact-saved', (e) => { if (e.detail.key === key) render(); });
    },
    print(sheetId) {
      const node = document.getElementById(sheetId);
      if (!node) { window.print(); return; }
      const w = window.open('', '_blank', 'width=720,height=900');
      w.document.write('<!doctype html><html><head><title>My Plan</title>' +
        '<link rel="stylesheet" href="/css/youth-engine.css">' +
        '<style>body{background:#fff;margin:24px;font-family:Inter,system-ui,sans-serif}</style></head>' +
        '<body class="yf-print-page">' + node.outerHTML + '</body></html>');
      w.document.close();
      w.focus();
      setTimeout(() => { try { w.print(); } catch {} }, 350);
    }
  };

  /* =====================================================================
     4) SHARE — pass-the-phone family protocol (family-conversation 1.90).
        <div class="yf-share" data-prompt="Ask a parent: ..."></div>
        Won't mark done until both the teen taps "I asked" and confirms a reply.
     ===================================================================== */
  function mountShare(el) {
    if (el.dataset.mounted) return; el.dataset.mounted = '1';
    const key = el.dataset.key || ('yf-share-' + Math.abs(hash(el.dataset.prompt || '')));
    const prompt = el.dataset.prompt || 'Share what you made with a parent or guardian.';
    const done = Store.get(key);
    el.classList.add('yf-card', 'yf-share-card');
    const paint = () => {
      const d = Store.get(key);
      el.innerHTML =
        '<div class="yf-kicker">④ Pass the phone</div>' +
        '<p class="yf-share-prompt">' + esc(prompt) + '</p>' +
        (d
          ? '<p class="yf-share-done">✓ Shared with family' + (d.note ? ': “' + esc(d.note) + '”' : '') + '</p>'
          : '<div class="yf-share-actions">' +
              '<input type="text" class="yf-input" placeholder="What did they say? (optional)" aria-label="Family response">' +
              '<button type="button" class="yf-btn yf-share-btn">We talked about it</button>' +
            '</div>');
      const btn = el.querySelector('.yf-share-btn');
      if (btn) btn.addEventListener('click', () => {
        const note = el.querySelector('.yf-input').value.trim();
        Store.set(key, { note, ts: Date.now() });
        paint();
        el.dispatchEvent(new CustomEvent('yf:shared', { bubbles: true, detail: { key } }));
      });
    };
    paint();
  }

  /* =====================================================================
     5) SCENARIO — branching consequence engine (generalized from the proven
        emergency-fifty-scenario). Author a scene graph; render text + choices;
        outcomes show a "what you just experienced" box + restart.
        Usage: new YouthScenario(mountEl, graph, {start:'intro'}).start();
        or <div class="yf-scenario" data-graph="WindowVarName"></div>
     ===================================================================== */
  class YouthScenario {
    constructor(mount, graph, opts = {}) {
      this.mount = typeof mount === 'string' ? document.querySelector(mount) : mount;
      this.graph = graph || {};
      this.startKey = opts.start || Object.keys(this.graph)[0];
      this.path = [];
    }
    start() { this.path = [this.startKey]; this.render(this.startKey); return this; }
    choose(next) { this.path.push(next); this.render(next); }
    restart() { this.start(); }
    render(key) {
      const scene = this.graph[key];
      if (!scene || !this.mount) return;
      let html = '';
      if (scene.outcome) {
        html += '<div class="yf-outcome yf-outcome-' + esc(scene.outcome) + '">' +
          (scene.title ? '<h3 class="yf-outcome-title">' + esc(scene.title) + '</h3>' : '') +
          '<div class="yf-outcome-body">' + (scene.text || '') + '</div></div>';
        if (scene.learning && scene.learning.length) {
          html += '<div class="yf-learning"><h4>What you just experienced</h4><ul>' +
            scene.learning.map(li => '<li>' + li + '</li>').join('') + '</ul></div>';
        }
        html += '<button type="button" class="yf-btn yf-restart">↺ Try a different path</button>';
      } else {
        html += '<div class="yf-scene">' + (scene.text || '') + '</div>';
        if (scene.choices && scene.choices.length) {
          html += '<div class="yf-choices">' + scene.choices.map((c, i) =>
            '<button type="button" class="yf-choice" data-next="' + esc(c.next) + '">' +
              '<span class="yf-choice-title">' + esc(c.title) + '</span>' +
              (c.desc ? '<span class="yf-choice-desc">' + esc(c.desc) + '</span>' : '') +
            '</button>').join('') + '</div>';
        }
      }
      this.mount.innerHTML = html;
      this.mount.querySelectorAll('.yf-choice').forEach(b =>
        b.addEventListener('click', () => this.choose(b.dataset.next)));
      const rb = this.mount.querySelector('.yf-restart');
      if (rb) rb.addEventListener('click', () => this.restart());
    }
  }

  /* =====================================================================
     6) PLAN — Week-10 aggregator. Reads every yf-w* artifact into one
        "My Sovereign Money Plan" the family keeps.
        <div class="yf-plan"></div>  or  YouthPlan.render(el)
     ===================================================================== */
  const WEEK_LABELS = {
    'yf-w1': 'My Money Rule', 'yf-w2': 'Where My Money Goes', 'yf-w3': 'Savings Goal',
    'yf-w4': 'Emergency-Fund Target', 'yf-w5': 'First Paycheck Plan', 'yf-w6': 'Spending Decisions',
    'yf-w7': 'Money-Safety Setup', 'yf-w8': 'College Cost Comparison', 'yf-w9': 'Move-Out Readiness'
  };
  const YouthPlan = {
    collect() {
      const all = Store.artifacts(); const byWeek = {};
      Object.keys(all).forEach(k => { const m = k.match(/^(yf-w\d+)/); if (m) (byWeek[m[1]] = byWeek[m[1]] || []).push({ key: k, data: all[k] }); });
      return byWeek;
    },
    mount(el) {
      if (el.dataset.mounted) return; el.dataset.mounted = '1';
      const data = YouthPlan.collect();
      const weeks = Object.keys(WEEK_LABELS);
      const done = weeks.filter(w => data[w]);
      const rows = weeks.map(w => {
        const has = !!data[w];
        const summary = has ? summarize(data[w][0].data) : '<span class="yf-muted">not done yet</span>';
        return '<tr class="' + (has ? 'yf-row-done' : 'yf-row-todo') + '">' +
          '<th>' + esc(WEEK_LABELS[w]) + '</th><td>' + summary + '</td>' +
          '<td>' + (has ? '✓' : '<a href="../' + w.replace('yf-', 'week-0').replace('w', '') + '/">do it</a>') + '</td></tr>';
      }).join('');
      el.classList.add('yf-artifact-sheet');
      el.innerHTML =
        '<div class="yf-sheet" id="yf-plan-sheet">' +
          '<div class="yf-sheet-head"><span class="yf-sheet-brand">Bitcoin Sovereign Academy</span>' +
            '<span class="yf-sheet-kicker">' + done.length + ' / ' + weeks.length + ' built</span></div>' +
          '<h3 class="yf-sheet-title">My Sovereign Money Plan</h3>' +
          '<table class="yf-sheet-table yf-plan-table">' + rows + '</table>' +
          '<div class="yf-sheet-foot">Created by Dalia · bitcoinsovereign.academy</div>' +
        '</div>' +
        '<div class="yf-sheet-actions"><button type="button" class="yf-btn yf-print-btn">⎙ Print / Save PDF</button></div>';
      el.querySelector('.yf-print-btn').addEventListener('click', () => YouthArtifact.print('yf-plan-sheet'));
    }
  };

  /* ----------------------------------- helpers ----------------------------------- */
  function hash(s) { let h = 0; for (let i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0; } return h; }
  function prettify(k) { return k.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()); }
  function summarize(d) {
    if (!d || typeof d !== 'object') return esc(String(d));
    const keys = Object.keys(d).filter(k => !k.startsWith('_'));
    return keys.slice(0, 2).map(k => '<strong>' + esc(prettify(k)) + ':</strong> ' + esc(d[k])).join(' · ') || '✓';
  }

  /* ----------------------------------- public API ----------------------------------- */
  const YouthLoop = {
    reveal(predictKey, actual, opts = {}) {
      const el = document.querySelector('.yf-predict[data-key="' + cssEsc(predictKey) + '"]');
      if (!el) return;
      const rec = Store.get(predictKey);
      const box = el.querySelector('.yf-reveal');
      const guess = rec ? num(rec.guess) : null;
      const a = num(actual);
      const unit = el.dataset.unit || '';
      let verdict = '';
      if (guess != null) {
        const off = Math.abs(guess - a);
        const close = a !== 0 ? off / Math.abs(a) <= 0.15 : off === 0;
        verdict = close
          ? '<span class="yf-good">Nice call — you were close.</span>'
          : '<span class="yf-gap">You guessed <strong>' + esc(rec.guess) + '</strong>. The gap is the lesson.</span>';
      }
      box.hidden = false;
      box.innerHTML = '<div class="yf-reveal-actual">Actual: <strong>' + esc(opts.display || (a.toLocaleString('en-US') + (unit ? ' ' + unit : ''))) + '</strong></div>' + verdict +
        (opts.note ? '<p class="yf-reveal-note">' + opts.note + '</p>' : '');
    },
    Store, money, num
  };
  function cssEsc(s) { return String(s).replace(/"/g, '\\"'); }

  /* ----------------------------------- auto-init ----------------------------------- */
  const MOUNTERS = [
    ['.yf-predict', mountPredict],
    ['.yf-verify', mountVerify],
    ['.yf-artifact', (el) => YouthArtifact.mountSheet(el)],
    ['.yf-share', mountShare],
    ['.yf-plan', (el) => YouthPlan.mount(el)],
    ['.yf-scenario', (el) => {
      if (el.dataset.mounted) return; el.dataset.mounted = '1';
      const g = window[el.dataset.graph];
      if (g) new YouthScenario(el, g, { start: el.dataset.start }).start();
    }]
  ];
  function scan(root) { MOUNTERS.forEach(([sel, fn]) => (root.querySelectorAll ? root.querySelectorAll(sel) : []).forEach(fn)); }
  function init() {
    scan(document);
    new MutationObserver(muts => muts.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1) scan(n); })))
      .observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

  /* expose */
  window.YouthScenario = YouthScenario;
  window.YouthArtifact = YouthArtifact;
  window.YouthPlan = YouthPlan;
  window.YouthLoop = YouthLoop;
})();
