/* BSA kit card-checkout — wires "Pay with card (USD)" buttons to /api/kit-checkout.
 * Button markup: <button class="bsa-btn bsa-btn-card" data-kit="family-bitcoin-recovery-kit">...</button>
 * On success Stripe returns to ?paid=1 — we reveal the "payment received" banner.
 */
(function () {
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
            alert('Card checkout is temporarily unavailable: ' + err.message + '\nYou can still pay with Lightning below.');
          });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { onPaid(); wireButtons(); });
  } else { onPaid(); wireButtons(); }
})();
