/**
 * Bitcoin Sovereign Academy - Payment Access Control
 * Client-side content unlocking based on Zaprite payments
 *
 * Usage:
 * 1. Include this script in your HTML
 * 2. Add data-premium="product_id" to locked content
 * 3. Call AccessControl.init() on page load
 */

const AccessControl = (function() {
  'use strict';

  // Product tier definitions
  const PRODUCTS = {
    free: {
      id: 'free',
      name: 'Free Explorer',
      demos: [
        'hash-puzzle-game',
        'signature-demo',
        'blockchain-game',
        'double-spending-demo',
        'building-the-chain-demo',
        'time-chain-explorer'
      ]
    },
    curious_path: {
      id: 'curious_path',
      name: 'Curious Path',
      price: 19,
      sats: 50000,
      demos: [
        // All free demos plus:
        'money-properties-comparison',
        'time-preference-explorer',
        'us-debt-crisis',
        'computational-puzzles-demo',
        'bitcoin-layers-map'
      ]
    },
    builder_path: {
      id: 'builder_path',
      name: 'Builder Path',
      price: 39,
      sats: 100000,
      includes: ['curious_path'],
      demos: [
        // All curious_path demos plus:
        'lightning-network-demo',
        'utxo-visualizer-enhanced',
        'wallet-security-workshop',
        'transaction-builder',
        'fee-master-tool',
        'mempool-visualizer',
        'address-format-explorer'
      ]
    },
    sovereign_path: {
      id: 'sovereign_path',
      name: 'Sovereign Path',
      price: 79,
      sats: 200000,
      includes: ['curious_path', 'builder_path'],
      demos: [
        // All builder_path demos plus:
        'security-dojo-enhanced',
        'multisig-setup-wizard',
        'coinjoin-simulator',
        'node-setup-sandbox',
        'account-freeze-locked-out',
        'emergency-fifty-scenario',
        'savings-disappear-scenario',
        'ledger-keeper-dilemma'
      ]
    },
    full_academy: {
      id: 'full_academy',
      name: 'Full Academy',
      price: 149,
      sats: 400000,
      includes: ['curious_path', 'builder_path', 'sovereign_path'],
      demos: ['*'] // All demos
    }
  };

  // Storage keys
  const STORAGE_KEYS = {
    ACCESS: 'bsa_access',
    USER_ID: 'bsa_user_id',
    PENDING_ORDER: 'bsa_pending_order'
  };

  /**
   * Initialize access control system
   */
  function init() {
    // Generate user ID if not exists
    ensureUserId();

    // Check for payment success callback
    handlePaymentCallback();

    // Apply access control to all premium content
    applyAccessControl();

    // Log access status (development only)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      logAccessStatus();
    }
  }

  /**
   * Ensure user has a unique ID
   */
  function ensureUserId() {
    let userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
    if (!userId) {
      userId = 'user_' + generateRandomId();
      localStorage.setItem(STORAGE_KEYS.USER_ID, userId);
    }
    return userId;
  }

  /**
   * Generate random ID
   */
  function generateRandomId() {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  /**
   * Handle payment callback after successful Zaprite payment
   */
  function handlePaymentCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('order');
    const product = urlParams.get('product');

    if (orderId && product) {
      // Verify payment with backend
      verifyPayment(orderId, product);
    }
  }

  /**
   * Verify payment with backend and store access token
   */
  async function verifyPayment(orderId, product) {
    try {
      const response = await fetch(`/api/verify-payment?order=${orderId}&product=${product}`);

      if (!response.ok) {
        console.error('Payment verification failed');
        return;
      }

      const data = await response.json();

      if (data.success && data.accessToken) {
        // Store access token
        storeAccessToken(data.accessToken, product, orderId);

        // Show success message
        showSuccessMessage(product);

        // Reload to apply access control
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      }

    } catch (error) {
      console.error('Error verifying payment:', error);
    }
  }

  /**
   * Store access token in localStorage
   */
  function storeAccessToken(token, product, orderId) {
    const accessData = JSON.parse(localStorage.getItem(STORAGE_KEYS.ACCESS) || '{}');

    // Add new purchase
    if (!accessData.purchases) {
      accessData.purchases = [];
    }

    accessData.purchases.push({
      token,
      product,
      orderId,
      grantedAt: new Date().toISOString(),
      expiresAt: null // Lifetime access
    });

    // Update unlocked demos list
    accessData.unlockedDemos = getAllUnlockedDemos(accessData.purchases);

    localStorage.setItem(STORAGE_KEYS.ACCESS, JSON.stringify(accessData));
  }

  /**
   * Get all unlocked demos based on purchases
   */
  function getAllUnlockedDemos(purchases) {
    const unlocked = new Set(PRODUCTS.free.demos);

    purchases.forEach(purchase => {
      const product = PRODUCTS[purchase.product];
      if (!product) return;

      // Add demos from this product
      if (product.demos) {
        product.demos.forEach(demo => unlocked.add(demo));
      }

      // Add demos from included products
      if (product.includes) {
        product.includes.forEach(includedProductId => {
          const includedProduct = PRODUCTS[includedProductId];
          if (includedProduct && includedProduct.demos) {
            includedProduct.demos.forEach(demo => unlocked.add(demo));
          }
        });
      }

      // Full academy gets everything
      if (purchase.product === 'full_academy') {
        Object.values(PRODUCTS).forEach(p => {
          if (p.demos && Array.isArray(p.demos)) {
            p.demos.forEach(demo => unlocked.add(demo));
          }
        });
      }
    });

    return Array.from(unlocked);
  }

  /**
   * Check if user has access to specific content
   */
  function hasAccess(demoId) {
    // Free demos always accessible
    if (PRODUCTS.free.demos.includes(demoId)) {
      return true;
    }

    // Check purchased access
    const accessData = JSON.parse(localStorage.getItem(STORAGE_KEYS.ACCESS) || '{}');

    if (!accessData.unlockedDemos) {
      return false;
    }

    // Full academy has access to everything
    if (accessData.purchases && accessData.purchases.some(p => p.product === 'full_academy')) {
      return true;
    }

    return accessData.unlockedDemos.includes(demoId);
  }

  /**
   * Apply access control to all premium content on page
   */
  function applyAccessControl() {
    // Find all elements with data-premium attribute
    document.querySelectorAll('[data-premium]').forEach(element => {
      const demoId = element.getAttribute('data-premium');

      if (!hasAccess(demoId)) {
        lockContent(element, demoId);
      } else {
        unlockContent(element);
      }
    });

    // Handle demo cards in index pages
    document.querySelectorAll('.card[href*="/interactive-demos/"]').forEach(card => {
      const href = card.getAttribute('href');
      const demoId = extractDemoIdFromUrl(href);

      if (demoId && !hasAccess(demoId)) {
        lockDemoCard(card, demoId);
      }
    });
  }

  /**
   * Lock premium content
   */
  function lockContent(element, demoId) {
    element.style.position = 'relative';
    element.style.opacity = '0.5';
    element.style.pointerEvents = 'none';
    element.style.filter = 'blur(2px)';

    // Add lock overlay
    const overlay = document.createElement('div');
    overlay.className = 'premium-lock-overlay';
    overlay.innerHTML = `
      <div class="lock-content">
        <div class="lock-icon">🔒</div>
        <h3>Premium Content</h3>
        <p>Unlock this demo with any paid tier</p>
        <button class="btn-unlock-premium" onclick="window.location.href='/pricing'">
          View Pricing
        </button>
      </div>
    `;

    element.style.position = 'relative';
    element.appendChild(overlay);
  }

  /**
   * Unlock content
   */
  function unlockContent(element) {
    element.style.opacity = '1';
    element.style.pointerEvents = 'auto';
    element.style.filter = 'none';

    // Remove lock overlay if exists
    const overlay = element.querySelector('.premium-lock-overlay');
    if (overlay) {
      overlay.remove();
    }
  }

  /**
   * Lock demo card in index page
   */
  function lockDemoCard(card, demoId) {
    // Keep the existing lock badge system from index page
    // This function ensures consistency
    const product = getRequiredProduct(demoId);

    const lockBadge = document.createElement('div');
    lockBadge.className = 'premium-badge';
    lockBadge.innerHTML = `🔒 ${product ? PRODUCTS[product].name : 'Premium'}`;
    lockBadge.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      background: linear-gradient(135deg, #f7931a, #ff8c00);
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      z-index: 10;
      text-transform: uppercase;
    `;

    card.style.position = 'relative';
    card.appendChild(lockBadge);

    // Make card clickable to pricing page
    card.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '/pricing';
    });
  }

  /**
   * Get required product tier for demo
   */
  function getRequiredProduct(demoId) {
    // Check each product tier
    for (const [productId, product] of Object.entries(PRODUCTS)) {
      if (product.demos && product.demos.includes(demoId)) {
        return productId;
      }
    }
    return 'curious_path'; // Default to lowest paid tier
  }

  /**
   * Extract demo ID from URL
   */
  function extractDemoIdFromUrl(url) {
    const match = url.match(/\/interactive-demos\/([^\/]+)/);
    return match ? match[1] : null;
  }

  /**
   * Show success message after payment
   */
  function showSuccessMessage(product) {
    const productName = PRODUCTS[product]?.name || product;

    const successOverlay = document.createElement('div');
    successOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      animation: fadeIn 0.3s ease;
    `;

    successOverlay.innerHTML = `
      <div style="
        background: linear-gradient(135deg, #4CAF50, #45a049);
        color: white;
        padding: 3rem;
        border-radius: 24px;
        text-align: center;
        max-width: 500px;
        box-shadow: 0 20px 60px rgba(76, 175, 80, 0.5);
      ">
        <div style="font-size: 5rem; margin-bottom: 1rem;">✓</div>
        <h2 style="font-size: 2rem; margin-bottom: 1rem;">Payment Successful!</h2>
        <p style="font-size: 1.25rem; margin-bottom: 2rem;">
          Welcome to <strong>${productName}</strong>
        </p>
        <p style="opacity: 0.9;">
          Your content is now unlocked. Redirecting...
        </p>
      </div>
    `;

    document.body.appendChild(successOverlay);

    // Add confetti effect
    createConfetti();
  }

  /**
   * Create confetti celebration effect
   */
  function createConfetti() {
    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div');
      confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${['#f7931a', '#4CAF50', '#9333ea'][Math.floor(Math.random() * 3)]};
        top: -10px;
        left: ${Math.random() * 100}vw;
        animation: confettiFall ${2 + Math.random() * 3}s linear forwards;
        z-index: 999999;
      `;
      document.body.appendChild(confetti);

      setTimeout(() => confetti.remove(), 5000);
    }
  }

  /**
   * Log access status (development only)
   */
  function logAccessStatus() {
    const accessData = JSON.parse(localStorage.getItem(STORAGE_KEYS.ACCESS) || '{}');

    console.log('🔐 Access Control Status:');
    console.log('User ID:', localStorage.getItem(STORAGE_KEYS.USER_ID));

    if (accessData.purchases && accessData.purchases.length > 0) {
      console.log('Purchases:', accessData.purchases.map(p => p.product));
      console.log('Unlocked Demos:', accessData.unlockedDemos?.length || 0);
    } else {
      console.log('No purchases (Free tier)');
    }
  }

  // Public API
  return {
    init,
    hasAccess,
    getUserId: ensureUserId,
    getAccessData: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.ACCESS) || '{}'),
    PRODUCTS
  };
})();

// Add required CSS
const style = document.createElement('style');
style.textContent = `
  .premium-lock-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(15, 15, 15, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    border-radius: 12px;
  }

  .lock-content {
    text-align: center;
    padding: 2rem;
    max-width: 400px;
  }

  .lock-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    animation: pulse 2s infinite;
  }

  .lock-content h3 {
    font-size: 1.75rem;
    color: #f7931a;
    margin-bottom: 0.5rem;
  }

  .lock-content p {
    color: #b3b3b3;
    margin-bottom: 1.5rem;
  }

  .btn-unlock-premium {
    background: linear-gradient(135deg, #f7931a, #ff8c00);
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 12px;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn-unlock-premium:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(247, 147, 26, 0.5);
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes confettiFall {
    to {
      transform: translateY(100vh) rotate(720deg);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', AccessControl.init);
} else {
  AccessControl.init();
}

// Export for use in other scripts
window.AccessControl = AccessControl;
