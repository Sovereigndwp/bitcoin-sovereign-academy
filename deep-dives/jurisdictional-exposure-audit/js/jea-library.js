/* jea-library.js — renders a jurisdiction profile JSON into a country page.
   Shows per-section confidence, sourced claims (resolving source_ids to the source
   ledger), open questions / counsel panel, and direction of travel.
   Hides any claim with public_safe === false. */
(function () {
  'use strict';
  var BASE = '/deep-dives/jurisdictional-exposure-audit/';
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); };
  // Only http(s) URLs may become links. Anything else (javascript:, data:, etc.) returns ''
  // and the caller renders plain text instead. Guards against a malicious source URL in profile data.
  var safeUrl = function (u) { return /^https?:\/\//i.test(String(u || '').trim()) ? String(u).trim() : ''; };

  var SECTION_LABELS = {
    basic_profile: 'Basic profile', tax_overview: 'Tax overview', bitcoin_regulation: 'Bitcoin regulation',
    reporting_profile: 'Reporting', estate_profile: 'Estate & succession', banking_profile: 'Banking reality',
    asset_protection_profile: 'Asset protection', mobility_profile: 'Mobility & residency',
    bitcoin_holder_implications: 'Bitcoin holder implications', direction_of_travel: 'Direction of travel'
  };
  var SECTION_ORDER = ['basic_profile', 'tax_overview', 'bitcoin_regulation', 'reporting_profile', 'estate_profile', 'banking_profile', 'asset_protection_profile', 'mobility_profile', 'bitcoin_holder_implications'];

  function chip(conf) {
    var c = (conf || 'unknown').toLowerCase();
    return '<span class="jea-chip ' + c + '"><span class="dot"></span>' + esc(c) + '</span>';
  }

  function renderProfile(profilePath) {
    var rootEl = document.getElementById('jea-library-root');
    Promise.all([
      fetch(profilePath).then(function (r) { return r.json(); }),
      fetch(BASE + 'data/jurisdiction-source-ledger.json').then(function (r) { return r.json(); }).catch(function () { return { sources: [] }; })
    ]).then(function (res) {
      var p = res[0]; var srcMap = {};
      (res[1].sources || []).forEach(function (s) { srcMap[s.source_id] = s; });
      rootEl.innerHTML = renderHtml(p, srcMap);
    }).catch(function () {
      rootEl.innerHTML = '<p class="jea-disclaimer">This profile could not be loaded.</p>';
    });
  }

  function sourceLinks(ids, srcMap) {
    if (!ids || !ids.length) return '';
    var parts = ids.map(function (id) {
      var s = srcMap[id];
      if (!s) return esc(id);
      var url = safeUrl(s.url);
      var label = esc(s.publisher) + ' (T' + s.tier + ')';
      // Non-http(s) URLs are not linked; render the label as plain text.
      return url ? '<a href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' + label + '</a>' : label;
    });
    return '<div style="font-size:12px;color:var(--jea-muted);margin-top:4px;">Source: ' + parts.join(', ') + '</div>';
  }

  function renderField(key, field, srcMap) {
    if (!field || typeof field !== 'object') return '';
    if (field.public_safe === false) return ''; // never render non-public-safe claims
    var label = key.replace(/_/g, ' ');
    var counsel = field.requires_local_counsel ? ' <span class="jea-state needs_review">requires local counsel</span>' : '';
    return '<tr><th style="width:34%;text-transform:capitalize;">' + esc(label) + ' ' + chip(field.confidence) + counsel + '</th><td>' + esc(field.value) + sourceLinks(field.source_ids, srcMap) + '</td></tr>';
  }

  function renderHtml(p, srcMap) {
    var h = '';
    h += '<div class="jea-eyebrow">COUNTRY PROFILE</div>';
    h += '<h1 style="font-size:34px;margin-bottom:6px;">' + esc(p.country_name) + '</h1>';
    h += '<p style="color:var(--jea-muted);">' + esc(p.region || '') + ' · Last reviewed ' + esc(p.last_reviewed) + ' · Next review ' + esc(p.next_review) + '</p>';

    if (p.status && p.status !== 'published') {
      h += '<div class="jea-disclaimer"><strong>Review status: ' + esc(p.status.replace(/-/g, ' ')) + '.</strong> Tax, estate, exit-tax, reporting, and self-custody-legality claims are pending human review. Treat everything here as orientation, not advice, and confirm with a professional.</div>';
    }

    // confidence summary
    h += '<h3 style="margin-top:22px;">Confidence by section</h3><div style="margin:10px 0;">';
    var cs = p.confidence_summary || {};
    Object.keys(SECTION_LABELS).forEach(function (k) {
      if (cs[k]) h += '<span class="jea-chip ' + cs[k] + '"><span class="dot"></span>' + esc(SECTION_LABELS[k]) + ': ' + esc(cs[k]) + '</span>';
    });
    h += '</div>';

    // sections
    SECTION_ORDER.forEach(function (sk) {
      var sec = p[sk];
      if (!sec) return;
      var rows = '';
      Object.keys(sec).forEach(function (key) { rows += renderField(key, sec[key], srcMap); });
      if (!rows) return;
      h += '<section class="jea-mod"><h2 style="font-size:22px;">' + esc(SECTION_LABELS[sk]) + ' ' + chip(cs[sk]) + '</h2><table class="jea-table">' + rows + '</table></section>';
    });

    // direction of travel
    if (p.direction_of_travel && p.direction_of_travel.length) {
      h += '<section class="jea-mod"><h2 style="font-size:22px;">Direction of travel ' + chip(cs.direction_of_travel) + '</h2><table class="jea-table"><tr><th>Label</th><th>Why · for whom · counterevidence</th></tr>';
      p.direction_of_travel.forEach(function (d) {
        var whom = (d.friendly_for_whom && d.friendly_for_whom.length) ? ' Friendly for: ' + d.friendly_for_whom.join(', ') + '.' : '';
        h += '<tr><td><span class="jea-state unclear">' + esc(d.label) + '</span> ' + chip(d.confidence) + '</td><td>' + esc(d.rationale) + whom + (d.counterevidence ? ' <em>Counterevidence: ' + esc(d.counterevidence) + '</em>' : '') + '</td></tr>';
      });
      h += '</table></section>';
    }

    // open questions / counsel
    if (p.open_questions && p.open_questions.length) {
      h += '<section class="jea-mod"><h2 style="font-size:22px;">Open questions for local counsel</h2><table class="jea-table"><tr><th>Question</th><th>Who should answer</th></tr>';
      p.open_questions.forEach(function (q) {
        h += '<tr><td>' + esc(q.question) + '</td><td>' + esc((q.who_should_answer || []).join(', ')) + '</td></tr>';
      });
      h += '</table></section>';
    }

    h += '<div class="jea-disclaimer">This profile is educational and is not legal, tax, investment, or financial advice. Laws change; confirm with a qualified professional in the relevant jurisdiction.</div>';
    h += '<div class="jea-actions"><a class="jea-btn" href="' + BASE + 'library/">All countries</a><a class="jea-btn primary" href="' + BASE + 'audit/">Start the audit</a></div>';
    return h;
  }

  window.JEALibrary = { renderProfile: renderProfile };
})();
