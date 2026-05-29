(function () {
  'use strict';

  const PENDING_KEY = 'bsa-btcpay-session';
  const MEMBERSHIP_KEY = 'bsa-membership';

  function readPending() {
    try {
      const raw = localStorage.getItem(PENDING_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function savePending(data) {
    localStorage.setItem(PENDING_KEY, JSON.stringify({ ...data, createdAt: Date.now() }));
  }

  function clearPending() {
    localStorage.removeItem(PENDING_KEY);
  }

  function showStatus(message, state) {
    let node = document.getElementById('btcpay-membership-status');
    if (!node) {
      node = document.createElement('div');
      node.id = 'btcpay-membership-status';
      node.style.maxWidth = '760px';
      node.style.margin = '1.5rem auto';
      node.style.padding = '0.9rem 1.1rem';
      node.style.borderRadius = '12px';
      node.style.fontWeight = '600';
      node.style.textAlign = 'center';
      const container = document.querySelector('main') || document.body;
      container.insertBefore(node, container.firstChild);
    }

    const palette = {
      success: ['rgba(76, 175, 80, 0.12)', '#4caf50', 'rgba(76, 175, 80, 0.35)'],
      error: ['rgba(239, 68, 68, 0.12)', '#f87171', 'rgba(239, 68, 68, 0.35)'],
      pending: ['rgba(255, 122, 0, 0.12)', '#FF7A00', 'rgba(255, 122, 0, 0.35)']
    };
    const [bg, color, border] = palette[state] || palette.pending;
    node.style.background = bg;
    node.style.color = color;
    node.style.border = '1px solid ' + border;
    node.textContent = message;
  }

  function setMembership(membership, token) {
    localStorage.setItem(MEMBERSHIP_KEY, JSON.stringify(membership));
    if (token) localStorage.setItem('bsa_access_token', token);
    window.dispatchEvent(new CustomEvent('membershipChanged', { detail: membership }));
  }

  async function verifyReturn() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('provider') !== 'btcpay') return;
    const invoiceId = params.get('invoice_id');
    if (!invoiceId) return;

    const pending = readPending();
    showStatus('Verifying Bitcoin or Lightning payment...', 'pending');

    try {
      const response = await fetch('/api/verify-btcpay-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ invoiceId, expectedTier: pending && pending.tier })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.verified || !data.membership) {
        throw new Error(data.error || 'Payment not verified yet.');
      }
      setMembership(data.membership, data.accessToken);
      clearPending();
      window.history.replaceState({}, document.title, window.location.pathname);
      showStatus('Payment verified. Access is active.', 'success');
    } catch (error) {
      showStatus(error.message || 'Payment not verified yet.', 'error');
    }
  }

  function getEmail(tier) {
    const email = window.prompt('Enter the email for this ' + tier + ' purchase.');
    if (!email) return null;
    const clean = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      alert('Please enter a valid email.');
      return null;
    }
    return clean;
  }

  async function startCheckout(tier) {
    const email = getEmail(tier);
    if (!email) return;

    const successPath = tier === 'sovereign' ? '/membership-success.html' : '/membership.html';
    savePending({ tier, email });

    try {
      const response = await fetch('/api/membership-btcpay-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier,
          email,
          successUrl: window.location.origin + successPath,
          cancelUrl: window.location.origin + '/membership.html'
        })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.checkoutUrl) {
        throw new Error(data.error || 'Could not start checkout.');
      }
      window.location.href = data.checkoutUrl;
    } catch (error) {
      clearPending();
      alert(error.message || 'Could not start checkout.');
    }
  }

  function injectButtons() {
    const apprentice = document.getElementById('btn-apprentice');
    if (apprentice) {
      apprentice.textContent = '⚡ Pay with Bitcoin or Lightning';
      apprentice.removeAttribute('onclick');
      apprentice.onclick = function () { startCheckout('apprentice'); };
    }

    const sovereignStripe = document.querySelector('a[href="https://buy.stripe.com/dRmeVc9uc4K147B9ZQ1oI03"]');
    if (sovereignStripe && !document.getElementById('btn-sovereign-btcpay')) {
      const btn = document.createElement('button');
      btn.id = 'btn-sovereign-btcpay';
      btn.type = 'button';
      btn.className = 'btn-secondary';
      btn.textContent = '⚡ Pay $399 with Bitcoin or Lightning';
      btn.style.marginTop = '0.75rem';
      btn.onclick = function () { startCheckout('sovereign'); };
      sovereignStripe.insertAdjacentElement('afterend', btn);
    }
  }

  function boot() {
    verifyReturn();
    injectButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  window.BSAMembershipBTCPay = {
    startCheckout,
    verifyReturn,
    injectButtons
  };
})();
