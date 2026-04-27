/**
 * Demo CTA Footer — Bitcoin Sovereign Academy
 *
 * Renders an audience-tagged "what to do next" footer for any demo or learning page.
 *
 * Usage:
 *   <div class="demo-cta-footer"
 *        data-demo-id="coinjoin-simulator"
 *        data-heading="What to do this week"
 *        data-sub="Pick the track that fits you. Each one is a single concrete action."
 *        data-tracks='[
 *          {"audience":"holder","time":"5 min","action":"Install Sparrow and map your UTXOs","href":"/guides/sparrow-utxo-map/"},
 *          {"audience":"hnw","time":"30 min","action":"Run a personal disclosure audit","href":"/guides/disclosure-audit/"}
 *        ]'>
 *   </div>
 *
 * Audience labels (rendered as caps/dim chip):
 *   holder | hnw | family | advisor | beginner | spanish-speaker
 * Free-form strings are also accepted; they render verbatim (lowercased then re-cased to title).
 *
 * If `data-tracks` is empty or missing, the widget renders nothing.
 *
 * Analytics: each click fires `bsaAnalytics.track('demo_cta_click', {demo, audience, href})`
 * if `window.bsaAnalytics` is available. Silent fallback otherwise.
 */

(function () {
  'use strict';

  var AUDIENCE_LABELS = {
    holder: 'Holder',
    hnw: 'HNW',
    family: 'Family',
    advisor: 'Advisor',
    beginner: 'Beginner',
    'spanish-speaker': 'En español',
  };

  function escHtml(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function audienceLabel(key) {
    if (!key) return '';
    var lower = String(key).toLowerCase().trim();
    if (AUDIENCE_LABELS[lower]) return AUDIENCE_LABELS[lower];
    // Free-form: title-case
    return lower.replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  function safeJSONParse(s) {
    if (!s) return null;
    try { return JSON.parse(s); } catch (e) { return null; }
  }

  function trackClick(demoId, audience, href) {
    if (typeof window === 'undefined') return;
    if (!window.bsaAnalytics || typeof window.bsaAnalytics.track !== 'function') return;
    try {
      window.bsaAnalytics.track('demo_cta_click', {
        demo: demoId || 'unknown',
        audience: audience || 'unspecified',
        href: href || '',
      });
    } catch (e) { /* silent */ }
  }

  function renderTrack(track, demoId, isSingle) {
    var audience = audienceLabel(track.audience);
    var time = track.time ? escHtml(track.time) : '';
    var action = escHtml(track.action || '');
    var href = track.href || '#';

    var classes = ['demo-cta-footer__track'];
    if (isSingle) classes.push('demo-cta-footer__track--single');

    var hrefAttr = (typeof href === 'string' && /^(https?:|\/|#)/.test(href))
      ? escHtml(href)
      : '#';

    var ariaLabel = audience
      ? audience + ': ' + action + (time ? ' (' + time + ')' : '')
      : action + (time ? ' (' + time + ')' : '');

    return (
      '<a class="' + classes.join(' ') + '" href="' + hrefAttr + '"' +
      ' data-cta-audience="' + escHtml(track.audience || '') + '"' +
      ' aria-label="' + escHtml(ariaLabel) + '">' +
      (audience ? '<span class="demo-cta-footer__audience">' + escHtml(audience) + '</span>' : '') +
      '<span class="demo-cta-footer__action">' + action + '</span>' +
      '<span class="demo-cta-footer__time">' + time + '</span>' +
      '</a>'
    );
  }

  function render(el) {
    if (!el || el.dataset.ctaRendered === '1') return;

    var tracks = safeJSONParse(el.getAttribute('data-tracks'));
    if (!Array.isArray(tracks) || tracks.length === 0) {
      el.dataset.ctaRendered = '1';
      return;
    }

    var demoId = el.getAttribute('data-demo-id') || '';
    var heading = el.getAttribute('data-heading') || 'What to do next';
    var sub = el.getAttribute('data-sub') || '';
    var isSingle = tracks.length === 1;

    var html = '';
    html += '<h3 class="demo-cta-footer__heading">' + escHtml(heading) + '</h3>';
    if (sub) html += '<p class="demo-cta-footer__sub">' + escHtml(sub) + '</p>';
    html += '<div class="demo-cta-footer__list" role="list">';
    for (var i = 0; i < tracks.length; i++) {
      html += renderTrack(tracks[i], demoId, isSingle);
    }
    html += '</div>';

    el.innerHTML = html;
    el.dataset.ctaRendered = '1';

    // Wire analytics
    var links = el.querySelectorAll('.demo-cta-footer__track');
    for (var j = 0; j < links.length; j++) {
      links[j].addEventListener('click', function (e) {
        var a = e.currentTarget;
        trackClick(demoId, a.getAttribute('data-cta-audience'), a.getAttribute('href'));
      });
    }
  }

  function renderAll() {
    var nodes = document.querySelectorAll('.demo-cta-footer:not([data-cta-rendered="1"])');
    for (var i = 0; i < nodes.length; i++) render(nodes[i]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderAll);
  } else {
    renderAll();
  }

  // Watch for late-injected widgets (per reflect-widget pattern)
  if (typeof MutationObserver !== 'undefined') {
    var mo = new MutationObserver(function () { renderAll(); });
    mo.observe(document.body || document.documentElement, { childList: true, subtree: true });
  }

  // Expose for manual re-render if needed
  window.demoCtaFooter = { render: render, renderAll: renderAll };
})();
