/* jea-audit.js — the interactive audit engine.
   Loads questionnaire.json, walks sections, builds a non-sensitive response,
   then calls JEAClassify + JEARouting and renders the exposure map.
   No network calls beyond loading the local questionnaire. Nothing is persisted. */
(function () {
  'use strict';

  var BASE = '/deep-dives/jurisdictional-exposure-audit/';
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); };

  // Minimal country list for the country selector (extend as the library grows).
  var COUNTRIES = [
    { id: 'us', name: 'United States' }, { id: 'co', name: 'Colombia' }, { id: 'pa', name: 'Panama' },
    { id: 'sv', name: 'El Salvador' }, { id: 'au', name: 'Australia' }, { id: 'ch', name: 'Switzerland' },
    { id: 'ca', name: 'Canada' }, { id: 'mx', name: 'Mexico' }, { id: 'ar', name: 'Argentina' },
    { id: 'es', name: 'Spain' }, { id: 'gb', name: 'United Kingdom' }, { id: 'pt', name: 'Portugal' },
    { id: 'ae', name: 'UAE' }, { id: 'sg', name: 'Singapore' }, { id: 'de', name: 'Germany' }, { id: 'other', name: 'Somewhere else' }
  ];

  // Narratives for each primary exposure type.
  var NARRATIVES = {
    documentation_leak: { title: 'Your documents may create a security leak', mean: 'Some sensitive items appear to be concentrated in one place or stored where they should not be.', matter: 'A leak turns a strong custody setup into a single weak point that someone could exploit.', notdo: 'Do not move secrets into cloud storage or a shared note to "organize" them.', next: 'Separate secrets from the map of what exists; keep the recovery sequence without the secrets in it.', who: ['bitcoin-custody-specialist'] },
    custody_concentration: { title: 'Your setup may depend on one person or one point', mean: 'Control of your Bitcoin appears to rest with a single person or a single process.', matter: 'If that person or process is unavailable, recovery may be slow or impossible.', notdo: 'Do not solve this by writing the seed somewhere "just in case" without a plan.', next: 'Document who could act and how, without exposing secrets; consider how a second party would help.', who: ['bitcoin-custody-specialist', 'estate-attorney'] },
    estate_mismatch: { title: 'Your Bitcoin may be technically secure but legally undefined', mean: 'There appears to be a gap between who has legal authority and who can actually access the keys.', matter: 'Authority without access, or access without authority, can stall or break an inheritance.', notdo: 'Do not assume a will alone solves key access. It usually does not.', next: 'Map authority and access side by side; bring the gap to an estate attorney and a custody specialist.', who: ['estate-attorney', 'bitcoin-custody-specialist'] },
    cross_border_family_gap: { title: 'Your family plan may break at the border', mean: 'Heirs, documents, keys, or advisors appear to sit in different countries.', matter: 'A plan that works in one country can fail when documents are not recognized or are in the wrong language.', notdo: 'Do not rely on one document being valid everywhere.', next: 'Confirm where documents are valid and in which language; map who holds which piece.', who: ['estate-attorney', 'tax-counsel'] },
    banking_fragility: { title: 'Your banking rails may be more fragile than they look', mean: 'Your ability to move money appears to depend on a single bank, exchange, or app.', matter: 'A freeze or closure could disrupt essentials with little warning.', notdo: 'Do not wait for a freeze to discover the dependency.', next: 'Test your 90-day resilience; organize source-of-funds records; reduce single points.', who: ['banking-specialist', 'accountant'] },
    jurisdictional_concentration: { title: 'Your life may be concentrated in one jurisdiction', mean: 'Most of your roles and assets appear tied to a single country.', matter: 'A change there, or a move away, can affect everything at once.', notdo: 'Do not treat a move as a clean reset; it can trigger tax and residence consequences.', next: 'Before any move, check what changes about tax residence and obligations.', who: ['tax-counsel', 'immigration-attorney'] },
    advisor_coordination_gap: { title: 'Your advisors may not be coordinated', mean: 'Different advisors appear to hold different pieces, with no one seeing the whole.', matter: 'Gaps between advisors are where mistakes and missed obligations live.', notdo: 'Do not assume each advisor knows what the others know.', next: 'Create one overview that each advisor can work from, without exposing secrets.', who: ['family-office-advisor', 'tax-counsel'] },
    business_governance_gap: { title: 'Your business treasury may have a governance gap', mean: 'Signer authority or treasury policy appears informal or dependent on one person.', matter: 'Key-person risk and unclear authority can halt operations or create disputes.', notdo: 'Do not run a treasury on undocumented, single-person authority.', next: 'Write a signer-authority and treasury policy; plan for key-person absence.', who: ['corporate-counsel', 'accountant'] },
    tax_visibility_issue: { title: 'You may be tax exposed in more places than you think', mean: 'Records appear thin, or obligations may overlap across more than one country.', matter: 'Thin records meeting overlapping obligations is the most common quiet exposure.', notdo: 'Do not guess at cost basis or assume one country has the only claim.', next: 'Organize acquisition, cost-basis, and disposal records; list every country that may tax you.', who: ['tax-counsel', 'accountant'] },
    unknown_missing_information: { title: 'Your map is incomplete', mean: 'Too many sections were skipped to identify a primary exposure.', matter: 'A partial map can hide the exposure that matters most.', notdo: 'Do not treat this as an all-clear.', next: 'Answer the remaining sections for a clearer picture.', who: [] }
  };

  var PRO_LABEL = { 'tax-counsel': 'Tax counsel', 'estate-attorney': 'Estate attorney', 'immigration-attorney': 'Immigration attorney', 'corporate-counsel': 'Corporate counsel', 'bitcoin-custody-specialist': 'Bitcoin custody specialist', 'accountant': 'Accountant', 'family-office-advisor': 'Family-office advisor', 'banking-specialist': 'Banking specialist' };

  var state = { q: null, sections: [], idx: 0, answers: {}, flags: {}, answeredSections: {}, countries: [], roles: {}, docs: {} };
  var rootEl;

  function start() {
    rootEl = document.getElementById('jea-audit-root');
    fetch(BASE + 'data/questionnaire.json').then(function (r) { return r.json(); }).then(function (q) {
      state.q = q;
      // Drop the entry ack section into a single intro screen handled separately.
      state.sections = q.sections.filter(function (s) { return s.section !== 'entry'; });
      renderIntro(q.data_safety_notice);
    }).catch(function () {
      rootEl.innerHTML = '<p class="jea-disclaimer">The audit could not load its questions. Please refresh.</p>';
    });
  }

  function renderIntro(notice) {
    rootEl.innerHTML =
      '<h1 style="font-size:30px;margin-bottom:12px;">Build your exposure map</h1>' +
      '<div class="jea-disclaimer">' + esc(notice) + '</div>' +
      '<div class="jea-actions"><button class="jea-btn primary" id="jea-begin">Begin</button>' +
      '<a class="jea-btn" href="' + BASE + '">Back to the modules</a></div>';
    document.getElementById('jea-begin').addEventListener('click', function () { state.idx = 0; renderSection(); });
  }

  function visibleQuestions(section) {
    var userTypes = (state.answers['ut.role'] || []);
    return section.questions.filter(function (qq) {
      if (!qq.applies_when) return true;
      var aw = qq.applies_when;
      if (aw.user_type_any) { return aw.user_type_any.some(function (t) { return userTypes.indexOf(t) !== -1; }); }
      return true;
    });
  }

  function renderSection() {
    var section = state.sections[state.idx];
    var qs = visibleQuestions(section);
    if (qs.length === 0) { return advance(1); }
    var html = '<div class="jea-progress">SECTION ' + (state.idx + 1) + ' OF ' + state.sections.length + '</div>';
    html += '<h2 class="jea-section-title">' + esc(section.title) + '</h2>';
    qs.forEach(function (qq) { html += renderQuestion(qq); });
    html += '<div class="jea-nav-btns">' +
      (state.idx > 0 ? '<button class="jea-btn" id="jea-back">Back</button>' : '<span></span>') +
      '<button class="jea-btn primary" id="jea-next">' + (state.idx === state.sections.length - 1 ? 'See my map' : 'Next') + '</button></div>';
    rootEl.innerHTML = html;
    wireQuestions(qs);
    if (document.getElementById('jea-back')) document.getElementById('jea-back').addEventListener('click', function () { advance(-1); });
    document.getElementById('jea-next').addEventListener('click', function () { commitSection(section, qs); if (state.idx === state.sections.length - 1) { finish(); } else { advance(1); } });
    window.scrollTo(0, 0);
  }

  function renderQuestion(qq) {
    var saved = state.answers[qq.id];
    var h = '<div class="jea-q" data-qid="' + qq.id + '" data-qtype="' + qq.type + '">';
    h += '<div class="prompt">' + esc(qq.prompt) + '</div>';
    if (qq.help_text) h += '<div class="help">' + esc(qq.help_text) + '</div>';
    if (qq.privacy_note) h += '<div class="help">' + esc(qq.privacy_note) + '</div>';

    if (qq.type === 'single_select' || qq.type === 'boolean') {
      var opts = qq.type === 'boolean' ? [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] : qq.options;
      opts.forEach(function (o) {
        var checked = saved === o.value ? ' checked' : '';
        h += '<label class="jea-opt"><input type="radio" name="' + qq.id + '" value="' + esc(o.value) + '"' + checked + '><span>' + esc(o.label) + '</span></label>';
      });
    } else if (qq.type === 'multi_select') {
      qq.options.forEach(function (o) {
        var checked = (saved && saved.indexOf(o.value) !== -1) ? ' checked' : '';
        h += '<label class="jea-opt"><input type="checkbox" name="' + qq.id + '" value="' + esc(o.value) + '"' + checked + '><span>' + esc(o.label) + '</span></label>';
      });
    } else if (qq.type === 'country_multi_select') {
      COUNTRIES.forEach(function (c) {
        var checked = (state.countries.indexOf(c.id) !== -1) ? ' checked' : '';
        h += '<label class="jea-opt"><input type="checkbox" name="' + qq.id + '" value="' + c.id + '"' + checked + '><span>' + esc(c.name) + '</span></label>';
      });
    } else if (qq.type === 'per_country_roles') {
      if (state.countries.length === 0) {
        h += '<div class="help">Add at least one country in the previous question to map roles.</div>';
      } else {
        state.countries.forEach(function (cid) {
          var cname = (COUNTRIES.filter(function (c) { return c.id === cid; })[0] || { name: cid }).name;
          h += '<div style="margin:10px 0;"><strong>' + esc(cname) + '</strong><div class="jea-grid" style="margin-top:8px;">';
          qq.options.forEach(function (o) {
            var on = state.roles[cid] && state.roles[cid].indexOf(o.value) !== -1;
            h += '<label class="jea-opt" style="margin:0;"><input type="checkbox" data-country="' + cid + '" name="role-' + cid + '" value="' + o.value + '"' + (on ? ' checked' : '') + '><span style="font-size:13px;">' + esc(o.label) + '</span></label>';
          });
          h += '</div></div>';
        });
      }
    } else if (qq.type === 'per_item_class') {
      var classes = [
        ['written_in_one_place', 'Written in one place'], ['split', 'Split across places'], ['in_password_manager', 'In a password manager'],
        ['in_cloud', 'In cloud storage'], ['only_in_my_head', 'Only in my head'], ['with_a_person', 'With a person'],
        ['with_attorney', 'With my attorney'], ['not_handled', 'Not handled'], ['unknown', 'Not sure']
      ];
      qq.options.forEach(function (o) {
        var cur = state.docs[o.value] || '';
        h += '<div class="jea-opt" style="justify-content:space-between;align-items:center;"><span style="font-size:13px;">' + esc(o.label) + '</span><select data-item="' + o.value + '" style="background:var(--jea-surface-2);color:var(--jea-text);border:1px solid var(--jea-border);border-radius:7px;padding:6px;">';
        h += '<option value="">choose…</option>';
        classes.forEach(function (cc) { h += '<option value="' + cc[0] + '"' + (cur === cc[0] ? ' selected' : '') + '>' + esc(cc[1]) + '</option>'; });
        h += '</select></div>';
      });
    }
    h += '</div>';
    return h;
  }

  function wireQuestions(qs) {
    // live-capture country selection so the per_country_roles question can use it within the same section render
    var countryInputs = rootEl.querySelectorAll('input[name="jm.countries"]');
    countryInputs.forEach(function (inp) {
      inp.addEventListener('change', function () {
        var sel = [];
        rootEl.querySelectorAll('input[name="jm.countries"]:checked').forEach(function (i) { sel.push(i.value); });
        state.countries = sel;
      });
    });
  }

  function commitSection(section, qs) {
    qs.forEach(function (qq) {
      if (qq.type === 'single_select' || qq.type === 'boolean') {
        var sel = rootEl.querySelector('input[name="' + qq.id + '"]:checked');
        if (sel) { state.answers[qq.id] = sel.value; applyOptionFlags(qq, sel.value); markHelper(qq.id, sel.value); markAnswered(section.section); }
      } else if (qq.type === 'multi_select') {
        var vals = [];
        rootEl.querySelectorAll('input[name="' + qq.id + '"]:checked').forEach(function (i) { vals.push(i.value); applyOptionFlags(qq, i.value); });
        if (vals.length) { state.answers[qq.id] = vals; markAnswered(section.section); }
      } else if (qq.type === 'country_multi_select') {
        var c = [];
        rootEl.querySelectorAll('input[name="' + qq.id + '"]:checked').forEach(function (i) { c.push(i.value); });
        state.countries = c; if (c.length) markAnswered(section.section);
      } else if (qq.type === 'per_country_roles') {
        state.countries.forEach(function (cid) {
          var roles = [];
          rootEl.querySelectorAll('input[name="role-' + cid + '"]:checked').forEach(function (i) { roles.push(i.value); });
          state.roles[cid] = roles;
        });
        markAnswered(section.section);
      } else if (qq.type === 'per_item_class') {
        rootEl.querySelectorAll('select[data-item]').forEach(function (sel) {
          if (sel.value) { state.docs[sel.getAttribute('data-item')] = sel.value; }
        });
        markAnswered(section.section);
      }
    });
  }

  function applyOptionFlags(qq, value) {
    var opt = (qq.options || []).filter(function (o) { return o.value === value; })[0];
    if (opt && opt.flags) opt.flags.forEach(function (f) { state.flags[f] = true; });
  }
  function markHelper(qid, value) {
    if (qid === 'cm.if_unavailable' && value === 'no_one') state.flags['__ifUnavailableNoOne'] = true;
    if (qid === 'ss.bank_freeze' && value === 'serious') state.flags['__bankFreezeSerious'] = true;
  }
  function markAnswered(sectionId) { state.answeredSections[sectionId] = true; }

  function advance(d) {
    state.idx += d;
    if (state.idx < 0) state.idx = 0;
    renderSection();
  }

  function buildResponse() {
    var countriesConnected = state.countries.map(function (cid) { return { country_id: cid, roles: state.roles[cid] || [] }; });
    var rawFlags = Object.keys(state.flags).filter(function (f) { return f.indexOf('__') !== 0; });
    return {
      user_type: state.answers['ut.role'] || [],
      amount_band: state.answers['ut.amount_band'],
      countries_connected: countriesConnected,
      bitcoin_exposure_types: state.answers['cm.types'] || [],
      documentation_classification: state.docs,
      _rawFlags: rawFlags,
      _answeredSections: Object.keys(state.answeredSections),
      _ifUnavailableNoOne: !!state.flags['__ifUnavailableNoOne'],
      _bankFreezeSerious: !!state.flags['__bankFreezeSerious']
    };
  }

  function finish() {
    var resp = buildResponse();
    var out = window.JEAClassify.classify(resp);
    window.JEARouting.route(out, resp);
    renderResult(out, resp);
  }

  function renderResult(out, resp) {
    var n = NARRATIVES[out.primary_exposure_type] || NARRATIVES.unknown_missing_information;
    var h = '<div class="jea-progress">YOUR JURISDICTIONAL EXPOSURE MAP</div>';
    if (out.result_confidence !== 'clear') {
      h += '<div class="jea-disclaimer">This map is ' + (out.result_confidence === 'partial' ? 'partial' : 'incomplete') + ' because some sections were skipped. Treat it as a starting point, not an all-clear.</div>';
    }
    h += '<div class="jea-result-primary"><div class="modnum" style="color:var(--jea-orange);font-family:\'JetBrains Mono\',monospace;font-size:12px;letter-spacing:2px;">PRIMARY EXPOSURE</div>';
    h += '<h3>' + esc(n.title) + '</h3><p>' + esc(n.mean) + '</p>';
    h += '<table class="jea-table">';
    h += '<tr><th>Why it matters</th><td>' + esc(n.matter) + '</td></tr>';
    h += '<tr><th>What not to do</th><td>' + esc(n.notdo) + '</td></tr>';
    h += '<tr><th>What to document next</th><td>' + esc(n.next) + '</td></tr>';
    h += '</table></div>';

    if (out.secondary_exposure_types.length) {
      h += '<p style="margin-top:18px;"><strong>Also worth reviewing:</strong> ';
      h += out.secondary_exposure_types.map(function (t) { return esc((NARRATIVES[t] || {}).title || t); }).join('; ') + '.</p>';
    }

    // documentation classifier output
    if (out.documentation && out.documentation.items.length) {
      h += '<h3 style="margin-top:26px;" id="docs">Documentation review</h3><table class="jea-table"><tr><th>Item</th><th>Recommended handling</th><th>Status</th></tr>';
      out.documentation.items.forEach(function (it) {
        var st = it.status === 'leak' ? '<span class="jea-state mismatch">possible leak</span>' : (it.status === 'gap' ? '<span class="jea-state missing">gap</span>' : '<span class="jea-state stable">ok</span>');
        h += '<tr><td>' + esc(it.item.replace(/_/g, ' ')) + '</td><td>' + esc(it.rec) + '</td><td>' + st + '</td></tr>';
      });
      h += '</table>';
    }

    // professional questions
    if (n.who && n.who.length) {
      h += '<h3 style="margin-top:26px;">Questions to bring to a professional</h3>';
      n.who.forEach(function (w) { h += '<p><strong>' + esc(PRO_LABEL[w] || w) + '.</strong> Ask them to review the exposure above for your specific facts.</p>'; });
    }

    // resources + pathway
    if (out.recommended_resources && out.recommended_resources.length) {
      h += '<h3 style="margin-top:26px;">Recommended reading</h3><ul style="margin-left:20px;color:var(--jea-text-2);">';
      out.recommended_resources.forEach(function (r) { h += '<li><a href="' + esc(r.url) + '">' + esc(r.title) + '</a></li>'; });
      h += '</ul>';
    }
    var pw = out.recommended_pathway;
    if (pw && pw.product_id !== 'none') {
      h += '<div class="jea-pathway"><div class="tag" style="font-family:\'JetBrains Mono\',monospace;font-size:11px;color:var(--jea-muted);letter-spacing:1px;">A POSSIBLE NEXT STEP</div>';
      h += '<h4 style="margin:6px 0;">' + esc(pw.label) + (pw.cta_style === 'priced' ? ' · $' + pw.price_usd : '') + '</h4>';
      h += '<p style="color:var(--jea-text-2);font-size:14px;">' + esc(pw.rationale || '') + '</p>';
      if (pw.url) h += '<div class="jea-actions"><a class="jea-btn" href="' + esc(pw.url) + '">' + (pw.cta_style === 'contact' ? 'Learn more' : (pw.cta_style === 'priced' ? 'See the kit' : 'Learn more')) + '</a></div>';
      h += '</div>';
    } else if (pw && pw.rationale) {
      h += '<div class="jea-pathway"><p style="color:var(--jea-text-2);">' + esc(pw.rationale) + '</p></div>';
    }

    h += '<div class="jea-disclaimer">' + esc(out.disclaimer) + '</div>';
    h += '<div class="jea-actions"><a class="jea-btn" href="' + BASE + '">Back to the modules</a><a class="jea-btn" href="' + BASE + 'library/">Open the country library</a></div>';
    rootEl.innerHTML = h;
    window.scrollTo(0, 0);
  }

  if (document.readyState !== 'loading') start(); else document.addEventListener('DOMContentLoaded', start);
})();
