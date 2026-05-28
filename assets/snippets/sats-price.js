/* BSA dual-price snippet
 * Reads every <span class="usd" data-usd="49"></span> on the page
 * and writes the sats equivalent into its sibling <span class="sats"></span>.
 *
 * Source: mempool.space — same provider already used by the live network strip.
 * No tracking, no cookies. One fetch per page load. Cached for the session.
 */
(function () {
  var CACHE_KEY = 'bsa_btc_usd_v1';
  var CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

  function format(n) {
    return n.toLocaleString(undefined, { maximumFractionDigits: 0 }) + ' sats';
  }
  function writePrices(btcUsd) {
    var sats = 1e8 / btcUsd; // sats per 1 USD
    document.querySelectorAll('span.usd[data-usd]').forEach(function (el) {
      var usd = parseFloat(el.dataset.usd);
      if (!isFinite(usd) || usd <= 0) return;
      var sib = el.parentElement && el.parentElement.querySelector('span.sats');
      if (sib) sib.textContent = format(usd * sats);
    });
  }
  function getCached() {
    try {
      var raw = sessionStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      var p = JSON.parse(raw);
      if (Date.now() - p.t > CACHE_TTL_MS) return null;
      return p.v;
    } catch (e) { return null; }
  }
  function setCached(v) {
    try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), v: v })); } catch (e) {}
  }
  function fetchPrice() {
    var cached = getCached();
    if (cached) { writePrices(cached); return; }
    fetch('https://mempool.space/api/v1/prices')
      .then(function (r) { return r.json(); })
      .then(function (d) {
        var usd = d && d.USD;
        if (!usd || !isFinite(usd)) return;
        setCached(usd);
        writePrices(usd);
      })
      .catch(function () { /* silent — USD already shown */ });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fetchPrice);
  } else { fetchPrice(); }
})();
