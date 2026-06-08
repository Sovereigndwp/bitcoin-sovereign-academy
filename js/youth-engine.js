/* ==========================================================================
   youth-engine.js — the youth-track interactive engine.

   Implements the signature learning loop PREDICT -> VERIFY -> KEEP -> SHARE
   (spec: docs/superpowers/specs/2026-06-08-youth-pedagogy-differentiation-spec.md)
   as reusable, data-attribute-mounted primitives + a branching-scenario engine
   generalized from the proven interactive-demos/emergency-fifty-scenario.

   Hardened: bilingual (en/es) UI strings, first-party analytics on every beat,
   cross-device backup-code + email export (localStorage alone is per-device, and
   "keep what you make" is the moat — so the artifact must survive a device switch).

   No dependencies, no build step. Auto-inits on DOM ready + via MutationObserver.
   Styling lives in /css/youth-engine.css. localStorage convention: yf-w<N>-<slug>.
   ========================================================================== */
(function () {
  'use strict';

  /* ----------------------------------- i18n ----------------------------------- */
  /* Only UI CHROME is translated here; author content (questions/prompts/claims)
     is passed per-page via data-attributes, so each language's page authors it. */
  const STR = {
    en: {
      predict_kicker: '① Predict first', predict_lock: 'Lock it in', predict_locked: 'Locked ✓',
      predict_default_q: 'Make your prediction first:',
      reveal_actual: 'Actual:', reveal_good: 'Nice call — you were close.', reveal_gap: 'You guessed {0}. The gap is the lesson.',
      verify_kicker: '② Verify it yourself', verify_claim_pre: 'We claim:',
      verify_sub: 'Don’t take our word for it. Check it against {0}:', verify_live: 'Live now:',
      verify_checked: 'I checked the source', verify_verdict: 'Our claim holds up', verify_source_default: 'a public source',
      keep_kicker: '③ Keep this', keep_empty: 'Complete the activity above to create your keepsake.',
      print_btn: '⎙ Print / Save PDF', email_btn: '✉ Email / share', footer: 'Created by Dalia · bitcoinsovereign.academy',
      share_kicker: '④ Pass the phone', share_default: 'Share what you made with a parent or guardian.',
      share_ph: 'What did they say? (optional)', share_btn: 'We talked about it', share_done: 'Shared with family',
      learning: 'What you just experienced', restart: '↺ Try a different path',
      plan_title: 'My Sovereign Money Plan', plan_built: '{0} / {1} built', plan_todo: 'not done yet', plan_doit: 'do it',
      plan_email: '✉ Email my plan', plan_backup: '⤓ Copy backup code', plan_restore: '⟳ Restore from code',
      plan_restore_prompt: 'Paste your backup code:', plan_copied: 'Backup code copied — paste it on any device to restore.',
      mail_outro: '— Made at bitcoinsovereign.academy'
    },
    es: {
      predict_kicker: '① Predice primero', predict_lock: 'Confirmar', predict_locked: 'Confirmado ✓',
      predict_default_q: 'Haz tu predicción primero:',
      reveal_actual: 'Real:', reveal_good: '¡Bien — estuviste cerca!', reveal_gap: 'Predijiste {0}. La diferencia es la lección.',
      verify_kicker: '② Verifícalo tú mismo', verify_claim_pre: 'Afirmamos:',
      verify_sub: 'No nos creas. Compruébalo con {0}:', verify_live: 'En vivo:',
      verify_checked: 'Revisé la fuente', verify_verdict: 'La afirmación se sostiene', verify_source_default: 'una fuente pública',
      keep_kicker: '③ Guarda esto', keep_empty: 'Completa la actividad de arriba para crear tu recuerdo.',
      print_btn: '⎙ Imprimir / Guardar PDF', email_btn: '✉ Enviar / compartir', footer: 'Creado por Dalia · bitcoinsovereign.academy',
      share_kicker: '④ Pasa el teléfono', share_default: 'Comparte lo que hiciste con tu familia.',
      share_ph: '¿Qué te dijeron? (opcional)', share_btn: 'Lo conversamos', share_done: 'Compartido con la familia',
      learning: 'Lo que acabas de experimentar', restart: '↺ Probar otro camino',
      plan_title: 'Mi Plan de Dinero Soberano', plan_built: '{0} / {1} creados', plan_todo: 'aún no', plan_doit: 'hacerlo',
      plan_email: '✉ Enviar mi plan', plan_backup: '⤓ Copiar código de respaldo', plan_restore: '⟳ Restaurar desde código',
      plan_restore_prompt: 'Pega tu código de respaldo:', plan_copied: 'Código copiado — pégalo en cualquier dispositivo para restaurar.',
      mail_outro: '— Hecho en bitcoinsovereign.academy'
    }
  };
  const WEEK_LABELS = {
    en: { 'yf-w1': 'My Money Rule', 'yf-w2': 'Where My Money Goes', 'yf-w3': 'Savings Goal', 'yf-w4': 'Emergency-Fund Target', 'yf-w5': 'First Paycheck Plan', 'yf-w6': 'Spending Decisions', 'yf-w7': 'Money-Safety Setup', 'yf-w8': 'College Cost Comparison', 'yf-w9': 'Move-Out Readiness' },
    es: { 'yf-w1': 'Mi Regla del Dinero', 'yf-w2': 'A Dónde Va Mi Dinero', 'yf-w3': 'Meta de Ahorro', 'yf-w4': 'Meta de Fondo de Emergencia', 'yf-w5': 'Plan del Primer Sueldo', 'yf-w6': 'Decisiones de Gasto', 'yf-w7': 'Configuración de Seguridad', 'yf-w8': 'Comparación de Costos Universitarios', 'yf-w9': 'Listo para Independizarte' }
  };
  function lang() {
    if (window.YF_LANG === 'es' || window.YF_LANG === 'en') return window.YF_LANG;
    const l = (document.documentElement.getAttribute('lang') || 'en').toLowerCase();
    return l.indexOf('es') === 0 ? 'es' : 'en';
  }
  function t(key) {
    const dict = STR[lang()] || STR.en;
    let s = dict[key] != null ? dict[key] : (STR.en[key] != null ? STR.en[key] : key);
    const args = Array.prototype.slice.call(arguments, 1);
    return args.length ? s.replace(/\{(\d+)\}/g, (m, i) => (args[i] != null ? args[i] : '')) : s;
  }

  /* -------------------------------- analytics --------------------------------- */
  /* First-party only (js/analytics.js track shim). Turns the moat criteria into
     a measurable, live signal instead of a one-off audit score. Always guarded. */
  function track(name, props) {
    try { if (typeof window.track === 'function') window.track(name, props || {}); } catch (e) {}
  }
  const weekOf = (key) => { const m = String(key || '').match(/^(yf-w\d+)/); return m ? m[1] : null; };

  /* ----------------------------------- store ----------------------------------- */
  const Store = {
    get(key, fallback = null) {
      try { const v = localStorage.getItem(key); return v == null ? fallback : JSON.parse(v); } catch { return fallback; }
    },
    set(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} },
    artifacts() {
      const out = {};
      try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (/^yf-w\d+-/.test(k)) out[k] = Store.get(k); } } catch {}
      return out;
    }
  };

  const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const num = (v) => { const n = parseFloat(String(v).replace(/[^0-9.\-]/g, '')); return isFinite(n) ? n : 0; };
  const money = (n) => '$' + (Math.round(num(n) * 100) / 100).toLocaleString('en-US');

  /* =====================================================================
     1) PREDICT — commit a guess BEFORE the reveal. Reveal from code:
        YouthLoop.reveal('yf-w3-predict', actualNumber, {note})
     ===================================================================== */
  function mountPredict(el) {
    if (el.dataset.mounted) return; el.dataset.mounted = '1';
    const key = el.dataset.key || ('yf-predict-' + Math.abs(hash(el.dataset.question || '')));
    const q = el.dataset.question || t('predict_default_q');
    const unit = el.dataset.unit || '';
    const saved = Store.get(key);
    el.classList.add('yf-card', 'yf-predict-card');
    el.innerHTML =
      '<div class="yf-kicker">' + esc(t('predict_kicker')) + '</div>' +
      '<p class="yf-predict-q">' + esc(q) + '</p>' +
      '<div class="yf-predict-input">' +
        '<input type="text" inputmode="numeric" class="yf-input" placeholder="…"' + (saved ? ' value="' + esc(saved.guess) + '"' : '') + ' aria-label="' + esc(q) + '">' +
        (unit ? '<span class="yf-unit">' + esc(unit) + '</span>' : '') +
        '<button type="button" class="yf-btn yf-lock">' + esc(t('predict_lock')) + '</button>' +
      '</div>' +
      '<div class="yf-reveal" hidden></div>';
    const input = el.querySelector('.yf-input');
    const lockBtn = el.querySelector('.yf-lock');
    const lock = () => { input.setAttribute('readonly', ''); el.classList.add('yf-locked'); lockBtn.textContent = t('predict_locked'); lockBtn.disabled = true; };
    lockBtn.addEventListener('click', () => {
      const guess = input.value.trim(); if (!guess) { input.focus(); return; }
      Store.set(key, { guess, ts: Date.now() }); lock();
      track('yf_predict_locked', { key, week: weekOf(key) });
      el.dispatchEvent(new CustomEvent('yf:predicted', { bubbles: true, detail: { key, guess } }));
    });
    if (saved) lock();
  }

  /* =====================================================================
     2) VERIFY — don't trust, check. Audit our claim against live data.
     ===================================================================== */
  function mountVerify(el) {
    if (el.dataset.mounted) return; el.dataset.mounted = '1';
    const claim = el.dataset.claim || '';
    const liveKey = el.dataset.live || '';
    const source = el.dataset.source || t('verify_source_default');
    el.classList.add('yf-card', 'yf-verify-card');
    el.innerHTML =
      '<div class="yf-kicker">' + esc(t('verify_kicker')) + '</div>' +
      '<p class="yf-verify-claim">' + esc(t('verify_claim_pre')) + ' <strong>' + esc(claim) + '</strong></p>' +
      '<p class="yf-verify-sub">' + esc(t('verify_sub', source)) + '</p>' +
      '<div class="yf-verify-live">' +
        (liveKey ? esc(t('verify_live')) + ' <span class="yf-live" data-btc-live="' + esc(liveKey) + '">…</span>'
                 : '<button type="button" class="yf-btn yf-checked-btn">' + esc(t('verify_checked')) + '</button>') +
      '</div>' +
      '<label class="yf-verify-verdict">' +
        '<input type="checkbox" class="yf-verify-box"> ' + esc(t('verify_verdict')) +
      '</label>';
    const box = el.querySelector('.yf-verify-box');
    if (box) box.addEventListener('change', () => track('yf_verified', { claim: String(claim).slice(0, 60), holds: box.checked }));
    const cb = el.querySelector('.yf-checked-btn');
    if (cb) cb.addEventListener('click', () => { cb.textContent = '✓'; cb.disabled = true; track('yf_verified', { claim: String(claim).slice(0, 60), holds: true }); });
    try { if (window.bitcoinData && typeof window.bitcoinData.refresh === 'function') window.bitcoinData.refresh(); } catch (e) {}
  }

  /* =====================================================================
     3) KEEP — the real artifact the learner owns (print + email export).
     ===================================================================== */
  const YouthArtifact = {
    save(key, data) {
      const rec = Object.assign({}, data, { _key: key, _saved: Date.now() });
      Store.set(key, rec);
      track('yf_artifact_saved', { key, week: weekOf(key) });
      document.dispatchEvent(new CustomEvent('yf:artifact-saved', { detail: { key, data: rec } }));
      return rec;
    },
    get(key) { return Store.get(key); },
    fields(rec) { return Object.keys(rec || {}).filter(k => !k.startsWith('_')); },
    mountSheet(el) {
      if (el.dataset.mounted) return; el.dataset.mounted = '1';
      const key = el.dataset.key;
      const title = el.dataset.title || t('plan_title');
      el.classList.add('yf-artifact-sheet');
      const render = () => {
        const r = Store.get(key);
        if (!r) { el.innerHTML = '<p class="yf-muted">' + esc(t('keep_empty')) + '</p>'; return; }
        const rows = YouthArtifact.fields(r).map(k => '<tr><th>' + esc(prettify(k)) + '</th><td>' + esc(r[k]) + '</td></tr>').join('');
        el.innerHTML =
          '<div class="yf-sheet" id="' + esc(key) + '-sheet">' +
            '<div class="yf-sheet-head"><span class="yf-sheet-brand">Bitcoin Sovereign Academy</span><span class="yf-sheet-kicker">' + esc(t('keep_kicker')) + '</span></div>' +
            '<h3 class="yf-sheet-title">' + esc(title) + '</h3>' +
            '<table class="yf-sheet-table">' + rows + '</table>' +
            '<div class="yf-sheet-foot">' + esc(t('footer')) + '</div>' +
          '</div>' +
          '<div class="yf-sheet-actions">' +
            '<button type="button" class="yf-btn yf-print-btn">' + esc(t('print_btn')) + '</button>' +
            '<button type="button" class="yf-btn yf-btn-secondary yf-email-btn">' + esc(t('email_btn')) + '</button>' +
          '</div>';
        el.querySelector('.yf-print-btn').addEventListener('click', () => YouthArtifact.print(key + '-sheet'));
        el.querySelector('.yf-email-btn').addEventListener('click', () => YouthArtifact.email(key, title));
      };
      render();
      document.addEventListener('yf:artifact-saved', (e) => { if (e.detail.key === key) render(); });
    },
    email(key, title) {
      const r = Store.get(key); if (!r) return;
      const lines = YouthArtifact.fields(r).map(k => prettify(k) + ': ' + r[k]);
      const body = encodeURIComponent(lines.join('\n') + '\n\n' + t('mail_outro') + '\nhttps://bitcoinsovereign.academy/youth-families/');
      track('yf_artifact_email', { key, week: weekOf(key) });
      window.location.href = 'mailto:?subject=' + encodeURIComponent(title || 'My Plan') + '&body=' + body;
    },
    print(sheetId) {
      const node = document.getElementById(sheetId);
      if (!node) { window.print(); return; }
      const w = window.open('', '_blank', 'width=720,height=900'); if (!w) { window.print(); return; }
      w.document.write('<!doctype html><html><head><title>My Plan</title><link rel="stylesheet" href="/css/youth-engine.css">' +
        '<style>body{background:#fff;margin:24px;font-family:Inter,system-ui,sans-serif}</style></head><body class="yf-print-page">' + node.outerHTML + '</body></html>');
      w.document.close(); w.focus();
      setTimeout(() => { try { w.print(); } catch (e) {} }, 350);
    }
  };

  /* =====================================================================
     4) SHARE — pass-the-phone family protocol.
     ===================================================================== */
  function mountShare(el) {
    if (el.dataset.mounted) return; el.dataset.mounted = '1';
    const key = el.dataset.key || ('yf-share-' + Math.abs(hash(el.dataset.prompt || '')));
    const prompt = el.dataset.prompt || t('share_default');
    el.classList.add('yf-card', 'yf-share-card');
    const paint = () => {
      const d = Store.get(key);
      el.innerHTML =
        '<div class="yf-kicker">' + esc(t('share_kicker')) + '</div>' +
        '<p class="yf-share-prompt">' + esc(prompt) + '</p>' +
        (d ? '<p class="yf-share-done">✓ ' + esc(t('share_done')) + (d.note ? ': “' + esc(d.note) + '”' : '') + '</p>'
           : '<div class="yf-share-actions"><input type="text" class="yf-input" placeholder="' + esc(t('share_ph')) + '" aria-label="' + esc(t('share_ph')) + '"><button type="button" class="yf-btn yf-share-btn">' + esc(t('share_btn')) + '</button></div>');
      const btn = el.querySelector('.yf-share-btn');
      if (btn) btn.addEventListener('click', () => {
        const note = el.querySelector('.yf-input').value.trim();
        Store.set(key, { note, ts: Date.now() }); paint();
        track('yf_shared', { key, week: weekOf(key) });
        el.dispatchEvent(new CustomEvent('yf:shared', { bubbles: true, detail: { key } }));
      });
    };
    paint();
  }

  /* =====================================================================
     5) SCENARIO — branching consequence engine.
     ===================================================================== */
  class YouthScenario {
    constructor(mount, graph, opts = {}) {
      this.mount = typeof mount === 'string' ? document.querySelector(mount) : mount;
      this.graph = graph || {}; this.startKey = opts.start || Object.keys(this.graph)[0]; this.path = [];
    }
    start() { this.path = [this.startKey]; this.render(this.startKey); return this; }
    choose(next) { this.path.push(next); track('yf_scenario_choice', { next }); this.render(next); }
    restart() { track('yf_scenario_restart', {}); this.start(); }
    render(key) {
      const scene = this.graph[key]; if (!scene || !this.mount) return;
      let html = '';
      if (scene.outcome) {
        track('yf_scenario_outcome', { outcome: scene.outcome });
        html += '<div class="yf-outcome yf-outcome-' + esc(scene.outcome) + '">' + (scene.title ? '<h3 class="yf-outcome-title">' + esc(scene.title) + '</h3>' : '') + '<div class="yf-outcome-body">' + (scene.text || '') + '</div></div>';
        if (scene.learning && scene.learning.length) html += '<div class="yf-learning"><h4>' + esc(t('learning')) + '</h4><ul>' + scene.learning.map(li => '<li>' + li + '</li>').join('') + '</ul></div>';
        html += '<button type="button" class="yf-btn yf-restart">' + esc(t('restart')) + '</button>';
      } else {
        html += '<div class="yf-scene">' + (scene.text || '') + '</div>';
        if (scene.choices && scene.choices.length) html += '<div class="yf-choices">' + scene.choices.map(c => '<button type="button" class="yf-choice" data-next="' + esc(c.next) + '"><span class="yf-choice-title">' + esc(c.title) + '</span>' + (c.desc ? '<span class="yf-choice-desc">' + esc(c.desc) + '</span>' : '') + '</button>').join('') + '</div>';
      }
      this.mount.innerHTML = html;
      this.mount.querySelectorAll('.yf-choice').forEach(b => b.addEventListener('click', () => this.choose(b.dataset.next)));
      const rb = this.mount.querySelector('.yf-restart'); if (rb) rb.addEventListener('click', () => this.restart());
    }
  }

  /* =====================================================================
     6) PLAN — Week-10 aggregator + cross-device backup (export/import).
     ===================================================================== */
  const YouthPlan = {
    collect() {
      const all = Store.artifacts(); const byWeek = {};
      Object.keys(all).forEach(k => { const m = k.match(/^(yf-w\d+)/); if (m) (byWeek[m[1]] = byWeek[m[1]] || []).push({ key: k, data: all[k] }); });
      return byWeek;
    },
    exportCode() { try { return btoa(unescape(encodeURIComponent(JSON.stringify(Store.artifacts())))); } catch { return ''; } },
    importCode(code) {
      try {
        const obj = JSON.parse(decodeURIComponent(escape(atob(String(code).trim()))));
        Object.keys(obj).forEach(k => { if (/^yf-w\d+-/.test(k)) Store.set(k, obj[k]); });
        track('yf_plan_restored', {}); return true;
      } catch { return false; }
    },
    mount(el) {
      if (el.dataset.mounted) return; el.dataset.mounted = '1';
      const labels = WEEK_LABELS[lang()] || WEEK_LABELS.en;
      const render = () => {
        const data = YouthPlan.collect(); const weeks = Object.keys(labels);
        const done = weeks.filter(w => data[w]);
        const rows = weeks.map((w, i) => {
          const has = !!data[w];
          const summary = has ? summarize(data[w][0].data) : '<span class="yf-muted">' + esc(t('plan_todo')) + '</span>';
          const link = '../week-' + String(i + 1).padStart(2, '0') + '/';
          return '<tr class="' + (has ? 'yf-row-done' : 'yf-row-todo') + '"><th>' + esc(labels[w]) + '</th><td>' + summary + '</td><td>' + (has ? '✓' : '<a href="' + link + '">' + esc(t('plan_doit')) + '</a>') + '</td></tr>';
        }).join('');
        el.classList.add('yf-artifact-sheet');
        el.innerHTML =
          '<div class="yf-sheet" id="yf-plan-sheet">' +
            '<div class="yf-sheet-head"><span class="yf-sheet-brand">Bitcoin Sovereign Academy</span><span class="yf-sheet-kicker">' + esc(t('plan_built', done.length, weeks.length)) + '</span></div>' +
            '<h3 class="yf-sheet-title">' + esc(t('plan_title')) + '</h3>' +
            '<table class="yf-sheet-table yf-plan-table">' + rows + '</table>' +
            '<div class="yf-sheet-foot">' + esc(t('footer')) + '</div>' +
          '</div>' +
          '<div class="yf-sheet-actions">' +
            '<button type="button" class="yf-btn yf-print-btn">' + esc(t('print_btn')) + '</button>' +
            '<button type="button" class="yf-btn yf-btn-secondary yf-plan-email">' + esc(t('plan_email')) + '</button>' +
            '<button type="button" class="yf-btn yf-btn-secondary yf-plan-backup">' + esc(t('plan_backup')) + '</button>' +
            '<button type="button" class="yf-btn yf-btn-secondary yf-plan-restore">' + esc(t('plan_restore')) + '</button>' +
          '</div>';
        el.querySelector('.yf-print-btn').addEventListener('click', () => YouthArtifact.print('yf-plan-sheet'));
        el.querySelector('.yf-plan-email').addEventListener('click', () => emailPlan(labels));
        el.querySelector('.yf-plan-backup').addEventListener('click', () => {
          const code = YouthPlan.exportCode();
          const done = () => { track('yf_plan_export', { via: 'code' }); alert(t('plan_copied')); };
          if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(code).then(done, () => window.prompt(t('plan_copied'), code));
          else window.prompt(t('plan_copied'), code);
        });
        el.querySelector('.yf-plan-restore').addEventListener('click', () => {
          const code = window.prompt(t('plan_restore_prompt')); if (code && YouthPlan.importCode(code)) render();
        });
      };
      render();
      track('yf_plan_viewed', { built: Object.keys(YouthPlan.collect()).length });
      function emailPlan(labels) {
        const data = YouthPlan.collect();
        const lines = Object.keys(labels).map(w => labels[w] + ': ' + (data[w] ? '✓' : '—'));
        const body = encodeURIComponent(lines.join('\n') + '\n\n' + t('mail_outro') + '\nhttps://bitcoinsovereign.academy/youth-families/');
        track('yf_plan_export', { via: 'email' });
        window.location.href = 'mailto:?subject=' + encodeURIComponent(t('plan_title')) + '&body=' + body;
      }
    }
  };

  /* ----------------------------------- helpers ----------------------------------- */
  function hash(s) { let h = 0; for (let i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0; } return h; }
  function prettify(k) { return String(k).replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()); }
  function summarize(d) {
    if (!d || typeof d !== 'object') return esc(String(d));
    const keys = Object.keys(d).filter(k => !k.startsWith('_'));
    return keys.slice(0, 2).map(k => '<strong>' + esc(prettify(k)) + ':</strong> ' + esc(d[k])).join(' · ') || '✓';
  }

  /* ----------------------------------- public API ----------------------------------- */
  const YouthLoop = {
    reveal(predictKey, actual, opts = {}) {
      const el = document.querySelector('.yf-predict[data-key="' + String(predictKey).replace(/"/g, '\\"') + '"]'); if (!el) return;
      const rec = Store.get(predictKey); const box = el.querySelector('.yf-reveal');
      const guess = rec ? num(rec.guess) : null; const a = num(actual); const unit = el.dataset.unit || '';
      let verdict = '';
      if (guess != null) {
        const close = a !== 0 ? Math.abs(guess - a) / Math.abs(a) <= 0.15 : guess === a;
        verdict = close ? '<span class="yf-good">' + esc(t('reveal_good')) + '</span>' : '<span class="yf-gap">' + esc(t('reveal_gap', rec.guess)) + '</span>';
        track('yf_predict_revealed', { key: predictKey, week: weekOf(predictKey), close });
      }
      box.hidden = false;
      box.innerHTML = '<div class="yf-reveal-actual">' + esc(t('reveal_actual')) + ' <strong>' + esc(opts.display || (a.toLocaleString('en-US') + (unit ? ' ' + unit : ''))) + '</strong></div>' + verdict + (opts.note ? '<p class="yf-reveal-note">' + opts.note + '</p>' : '');
    },
    Store, money, num, t, lang
  };

  /* ----------------------------------- auto-init ----------------------------------- */
  const MOUNTERS = [
    ['.yf-predict', mountPredict], ['.yf-verify', mountVerify], ['.yf-artifact', (el) => YouthArtifact.mountSheet(el)],
    ['.yf-share', mountShare], ['.yf-plan', (el) => YouthPlan.mount(el)],
    ['.yf-scenario', (el) => { if (el.dataset.mounted) return; el.dataset.mounted = '1'; const g = window[el.dataset.graph]; if (g) new YouthScenario(el, g, { start: el.dataset.start }).start(); }]
  ];
  function scan(root) { MOUNTERS.forEach(([sel, fn]) => (root.querySelectorAll ? root.querySelectorAll(sel) : []).forEach(fn)); }
  function init() {
    scan(document);
    try { new MutationObserver(muts => muts.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1) scan(n); }))).observe(document.body, { childList: true, subtree: true }); } catch (e) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

  window.YouthScenario = YouthScenario;
  window.YouthArtifact = YouthArtifact;
  window.YouthPlan = YouthPlan;
  window.YouthLoop = YouthLoop;
})();
