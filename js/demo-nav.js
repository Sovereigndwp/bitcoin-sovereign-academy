/**
 * demo-nav.js — context-aware navigation for interactive demos + deep-dive pages.
 *
 * Injects a small top bar with two links:
 *   • "← Back"  — returns to the originating page when the visitor arrived from a
 *                 path module or deep-dive (via ?from=<internal-url>, falling back
 *                 to document.referrer when it is a same-origin /paths/ or
 *                 /deep-dives/ page). Hidden when no internal origin is known.
 *   • "Home"    — always present, points to "/".
 *
 * Self-contained: injects its own styles, uses absolute paths, no dependencies.
 */
(function () {
  'use strict';

  function internalPath(rawUrl) {
    if (!rawUrl) return null;
    try {
      var u = new URL(rawUrl, window.location.origin);
      if (u.origin !== window.location.origin) return null;
      return u.pathname + u.search;
    } catch (e) {
      return null;
    }
  }

  function backTarget() {
    var fromParam = new URLSearchParams(window.location.search).get('from');
    var fromInternal = internalPath(fromParam);
    if (fromInternal) return fromInternal;
    var ref = internalPath(document.referrer);
    if (ref && (/^\/paths\//.test(ref) || /^\/deep-dives\//.test(ref))) return ref;
    return null;
  }

  function injectStyles() {
    if (document.getElementById('bsa-demo-nav-styles')) return;
    var css =
      '.bsa-demo-nav{display:flex;gap:18px;align-items:center;padding:8px 16px;' +
      'background:var(--color-bg,#16181C);border-bottom:1px solid var(--color-border,#2D2F35);' +
      'font:14px/1 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;position:relative;z-index:50}' +
      '.bsa-demo-nav a{color:var(--color-muted,#B8B8B0);text-decoration:none;' +
      'transition:color .15s ease}' +
      '.bsa-demo-nav a:hover{color:var(--color-brand,#FF8A00)}';
    var style = document.createElement('style');
    style.id = 'bsa-demo-nav-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function mount() {
    if (!document.body || document.querySelector('.bsa-demo-nav')) return;
    injectStyles();

    var nav = document.createElement('nav');
    nav.className = 'bsa-demo-nav';
    nav.setAttribute('aria-label', 'Demo navigation');

    var back = backTarget();
    if (back) {
      var backLink = document.createElement('a');
      backLink.href = back; // validated same-origin path
      backLink.textContent = '← Back';
      nav.appendChild(backLink);
    }

    var homeLink = document.createElement('a');
    homeLink.href = '/';
    homeLink.textContent = 'Home';
    nav.appendChild(homeLink);

    document.body.insertBefore(nav, document.body.firstChild);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
