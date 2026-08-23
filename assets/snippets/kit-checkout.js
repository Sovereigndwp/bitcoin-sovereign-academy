/* BSA kit card-checkout — wires "Pay with card (USD)" buttons to /api/kit-checkout.
 * Button markup: <button class="bsa-btn bsa-btn-card" data-kit="family-bitcoin-recovery-kit">...</button>
 * On success Stripe returns to ?paid=1 — we reveal the "payment received" banner.
 *
 * ---------------------------------------------------------------------------
 * CHECKOUT PAUSED — owner ruling 2026-07-25, §3.
 *
 * Reason: product status and fulfillment for the three kits are under review,
 * and no verified transaction record exists. A product cannot be an inactive
 * research artifact and remain available for public purchase at the same time.
 * This is the minimum reversible change that prevents an unintended purchase.
 *
 * TO RESUME: set PAUSED to false. Nothing else was changed. Pages, copy,
 * assets, pricing, and the /api/kit-checkout endpoint are all untouched.
 *
 * Note: this pauses the browser path only. The /api/kit-checkout endpoint
 * remains callable directly. That is deliberate and sufficient for preventing
 * an *unintended* purchase; ask if you want the endpoint gated too.
 * ---------------------------------------------------------------------------
 */
(function () {
  var PAUSED = true;

  var PAUSE_NOTICE = 'Checkout is temporarily unavailable while this kit is under review. ' +
    'No payment can be taken right now. If you were trying to buy this, email ' +
    '<a href="mailto:thesovereign.academy@proton.me">thesovereign.academy@proton.me</a> ' +
    'and you will get a reply from a person.';

  function onPaid() {
    var params = new URLSearchParams(window.location.search);
    if (params.get('paid') !== '1') return;
    var box = document.querySelector('.kit-buybox') || document.querySelector('.bsa-page');
    if (!box) return;
    var note = document.createElement('div');
    note.className = 'kit-paid';
    note.innerHTML = '<strong>Payment received — thank you.</strong> Your PDF will be emailed within the hour. ' +
      'If it has not arrived, email <a href="mailto:thesovereign.academy@proton.me">thesovereign.academy@proton.me</a>.';
    box.insertBefore(note, box.firstChild);
    note.scrollIntoView({ block: 'center' });
  }

  function pauseButtons() {
    document.querySelectorAll('.bsa-btn-card[data-kit]').forEach(function (btn) {
      btn.disabled = true;
      btn.setAttribute('aria-disabled', 'true');
      btn.textContent = 'Checkout temporarily unavailable';

      if (btn.parentNode && !btn.parentNode.querySelector('.kit-paused-note')) {
        var note = document.createElement('p');
        note.className = 'kit-paused-note';
        note.setAttribute('role', 'status');
        note.style.cssText = 'margin:10px 0 0;font-size:14px;line-height:1.5;opacity:.85';
        note.innerHTML = PAUSE_NOTICE;
        btn.parentNode.insertBefore(note, btn.nextSibling);
      }
    });
  }

  function wireButtons() {
    document.querySelectorAll('.bsa-btn-card[data-kit]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var kit = btn.getAttribute('data-kit');
        var base = window.location.origin + window.location.pathname;
        btn.disabled = true;
        var original = btn.textContent;
        btn.textContent = 'Opening secure checkout…';
        fetch('/api/kit-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ kit: kit, successUrl: base + '?paid=1', cancelUrl: base })
        })
          .then(function (r) { return r.json(); })
          .then(function (d) {
            if (d && d.url) { window.location.href = d.url; }
            else { throw new Error((d && d.error) || 'Checkout unavailable'); }
          })
          .catch(function (err) {
            btn.disabled = false;
            btn.textContent = original;
            alert('Card checkout is temporarily unavailable: ' + err.message);
          });
      });
    });
  }

  function init() {
    onPaid();
    if (PAUSED) { pauseButtons(); } else { wireButtons(); }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
