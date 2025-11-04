/**
 * Checkout Page Logic
 *
 * Handles:
 * - Shopping cart display
 * - Payment provider selection
 * - Checkout form
 * - Payment processing
 */

(function() {
    'use strict';

    // ============================================
    // State Management
    // ============================================

    const state = {
        cart: [],
        selectedProvider: 'stripe',
        userEmail: '',
        isProcessing: false
    };

    // ============================================
    // Cart Management
    // ============================================

    function loadCart() {
        const cartData = localStorage.getItem('bsa_cart');
        if (cartData) {
            try {
                state.cart = JSON.parse(cartData);
            } catch (e) {
                console.error('Failed to parse cart data:', e);
                state.cart = [];
            }
        }
    }

    function saveCart() {
        localStorage.setItem('bsa_cart', JSON.stringify(state.cart));
    }

    function addToCart(item) {
        // Check if item already exists
        const exists = state.cart.find(i => i.id === item.id && i.type === item.type);
        if (!exists) {
            state.cart.push(item);
            saveCart();
        }
    }

    function removeFromCart(itemId, itemType) {
        state.cart = state.cart.filter(i => !(i.id === itemId && i.type === itemType));
        saveCart();
        renderCheckout();
    }

    function clearCart() {
        state.cart = [];
        saveCart();
    }

    // Export cart functions globally
    window.BSACart = {
        add: addToCart,
        remove: removeFromCart,
        clear: clearCart,
        get: () => state.cart
    };

    // ============================================
    // API Calls
    // ============================================

    async function calculatePricing() {
        if (state.cart.length === 0) return null;

        try {
            const response = await fetch('/api/cart/price', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: state.cart })
            });

            if (!response.ok) {
                throw new Error('Pricing calculation failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Pricing error:', error);
            showError('Failed to calculate pricing. Please try again.');
            return null;
        }
    }

    async function createCheckoutSession(email, provider) {
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: state.cart,
                    provider,
                    email
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Checkout failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Checkout error:', error);
            throw error;
        }
    }

    // ============================================
    // Rendering
    // ============================================

    function renderCheckout() {
        const container = document.getElementById('checkout-content');

        if (state.cart.length === 0) {
            renderEmptyCart(container);
            return;
        }

        container.innerHTML = `
            <div class="checkout-layout">
                ${renderPaymentForm()}
                ${renderCartSummary()}
            </div>
        `;

        attachEventListeners();
        loadPricing();
    }

    function renderEmptyCart(container) {
        container.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h2>Your cart is empty</h2>
                <p>Browse our learning paths and add modules to get started</p>
                <a href="/" class="btn btn-primary" style="display: inline-block; max-width: 300px;">
                    Explore Learning Paths
                </a>
            </div>
        `;
    }

    function renderPaymentForm() {
        return `
            <div class="payment-form">
                <h2>Payment Information</h2>

                <div id="error-message"></div>

                <!-- Email -->
                <div class="form-section">
                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="your@email.com"
                            required
                            value="${state.userEmail}"
                        >
                        <small style="color: var(--text-dim); font-size: 0.85rem; margin-top: 0.5rem; display: block;">
                            We'll send your access token to this email
                        </small>
                    </div>
                </div>

                <!-- Payment Provider -->
                <div class="form-section">
                    <h3>Choose Payment Method</h3>
                    <div class="provider-selection">
                        <label class="provider-option">
                            <input
                                type="radio"
                                name="provider"
                                value="stripe"
                                ${state.selectedProvider === 'stripe' ? 'checked' : ''}
                            >
                            <div class="provider-card">
                                <h4>💳 Credit Card</h4>
                                <p>Pay with Stripe</p>
                                <small style="color: var(--text-dim); font-size: 0.75rem; margin-top: 0.5rem; display: block;">
                                    Card • Apple Pay • Google Pay
                                </small>
                            </div>
                        </label>

                        <label class="provider-option">
                            <input
                                type="radio"
                                name="provider"
                                value="btcpay"
                                ${state.selectedProvider === 'btcpay' ? 'checked' : ''}
                            >
                            <div class="provider-card">
                                <h4>₿ Bitcoin</h4>
                                <p>Pay with BTC</p>
                                <small style="color: var(--text-dim); font-size: 0.75rem; margin-top: 0.5rem; display: block;">
                                    On-chain • Lightning
                                </small>
                            </div>
                        </label>
                    </div>
                </div>

                <!-- Submit Button -->
                <button
                    type="button"
                    id="checkout-button"
                    class="btn btn-primary"
                    ${state.isProcessing ? 'disabled' : ''}
                >
                    ${state.isProcessing ? 'Processing...' : 'Continue to Payment'}
                    ${state.isProcessing ? '<span class="spinner"></span>' : ''}
                </button>

                <div class="security-badge">
                    🔒 Secure checkout powered by ${state.selectedProvider === 'stripe' ? 'Stripe' : 'BTCPay Server'}
                </div>
            </div>
        `;
    }

    function renderCartSummary() {
        return `
            <div class="cart-summary">
                <h2>Order Summary</h2>
                <div id="cart-items">
                    ${state.cart.map(item => `
                        <div class="cart-item" data-item-id="${item.id}" data-item-type="${item.type}">
                            <div class="cart-item-info">
                                <h3>${item.name || item.id}</h3>
                                <p>${item.type === 'path' ? 'Learning Path' : 'Module'}</p>
                            </div>
                            <div style="display: flex; align-items: center;">
                                <div class="cart-item-price">$${(item.price || 0).toFixed(2)}</div>
                                <button
                                    class="cart-remove"
                                    onclick="window.BSACart.remove('${item.id}', '${item.type}')"
                                    title="Remove item"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="cart-totals" id="cart-totals">
                    <div class="total-row">
                        <span>Calculating...</span>
                        <span><span class="spinner" style="width: 20px; height: 20px;"></span></span>
                    </div>
                </div>
            </div>
        `;
    }

    function renderCartTotals(pricing) {
        const totalsContainer = document.getElementById('cart-totals');
        if (!totalsContainer) return;

        totalsContainer.innerHTML = `
            <div class="total-row">
                <span>Subtotal</span>
                <span>$${pricing.subtotal.toFixed(2)}</span>
            </div>
            ${pricing.bundleDiscount > 0 ? `
                <div class="total-row" style="color: var(--accent-green);">
                    <span>Bundle Discount</span>
                    <span>-$${pricing.bundleDiscount.toFixed(2)}</span>
                </div>
            ` : ''}
            ${pricing.volumeDiscount > 0 ? `
                <div class="total-row" style="color: var(--accent-green);">
                    <span>Volume Discount (10%)</span>
                    <span>-$${pricing.volumeDiscount.toFixed(2)}</span>
                </div>
            ` : ''}
            <div class="total-row final">
                <span>Total</span>
                <span>$${pricing.total.toFixed(2)}</span>
            </div>
        `;
    }

    // ============================================
    // Event Handlers
    // ============================================

    function attachEventListeners() {
        // Provider selection
        const providerInputs = document.querySelectorAll('input[name="provider"]');
        providerInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                state.selectedProvider = e.target.value;
                renderCheckout(); // Re-render to update security badge
            });
        });

        // Email input
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('input', (e) => {
                state.userEmail = e.target.value;
            });
        }

        // Checkout button
        const checkoutButton = document.getElementById('checkout-button');
        if (checkoutButton) {
            checkoutButton.addEventListener('click', handleCheckout);
        }
    }

    async function loadPricing() {
        const pricing = await calculatePricing();
        if (pricing) {
            renderCartTotals(pricing);
        }
    }

    async function handleCheckout() {
        // Validate email
        const email = document.getElementById('email').value.trim();
        if (!email || !isValidEmail(email)) {
            showError('Please enter a valid email address');
            return;
        }

        // Get selected provider
        const provider = state.selectedProvider;

        // Set processing state
        state.isProcessing = true;
        renderCheckout();

        try {
            // Create checkout session
            const session = await createCheckoutSession(email, provider);

            // Redirect to payment provider
            if (session.url) {
                // Save email for later
                localStorage.setItem('bsa_checkout_email', email);

                // Redirect
                window.location.href = session.url;
            } else {
                throw new Error('No payment URL received');
            }
        } catch (error) {
            state.isProcessing = false;
            showError(error.message || 'Checkout failed. Please try again.');
            renderCheckout();
        }
    }

    // ============================================
    // Helpers
    // ============================================

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showError(message) {
        const errorContainer = document.getElementById('error-message');
        if (errorContainer) {
            errorContainer.innerHTML = `
                <div class="alert alert-error">
                    <strong>Error:</strong> ${message}
                </div>
            `;
        } else {
            alert(message);
        }
    }

    function showSuccess(message) {
        const errorContainer = document.getElementById('error-message');
        if (errorContainer) {
            errorContainer.innerHTML = `
                <div class="alert alert-success">
                    ${message}
                </div>
            `;
        }
    }

    // ============================================
    // URL Parameter Handling
    // ============================================

    function checkPaymentStatus() {
        const params = new URLSearchParams(window.location.search);

        // Check for success
        if (params.get('success') === 'true') {
            const sessionId = params.get('session_id');
            const invoiceId = params.get('invoice_id');
            const token = params.get('token'); // JWT token from email link

            // If token is provided, save it
            if (token) {
                try {
                    localStorage.setItem('bsa_access_token', token);
                    console.log('✅ Access token saved from payment success');

                    // Show success with access granted message
                    showSuccess('Payment successful! Access granted. Redirecting to your courses...');

                    // Redirect to member area after 2 seconds
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 2000);
                } catch (e) {
                    console.error('Error saving token:', e);
                    showSuccess('Payment successful! Check your email for access instructions.');
                }
            } else {
                showSuccess('Payment successful! Check your email for access instructions.');
            }

            clearCart();

            // Clean URL
            window.history.replaceState({}, '', '/checkout.html');
        }

        // Check for cancellation
        if (params.get('canceled') === 'true') {
            showError('Payment was canceled. Your cart has been preserved.');

            // Clean URL
            window.history.replaceState({}, '', '/checkout.html');
        }
    }

    // ============================================
    // Initialize
    // ============================================

    function init() {
        loadCart();
        checkPaymentStatus();
        renderCheckout();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
