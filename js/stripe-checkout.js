/**
 * Stripe Checkout Integration
 * Handles Sovereign tier ($399) payments
 * 
 * Setup:
 * 1. Create Stripe account at stripe.com
 * 2. Create a Payment Link for $399 (one-time)
 * 3. Add success_url parameter: ?session_id={CHECKOUT_SESSION_ID}
 * 4. Update STRIPE_PAYMENT_LINK below with your link
 * 
 * When BTCPay pays for itself, you can add it as an alternative
 */

(function() {
    'use strict';

    const CONFIG = {
        // Replace with your Stripe Payment Link
        // Create at: https://dashboard.stripe.com/payment-links
        stripePaymentLink: 'https://buy.stripe.com/test_XXXXXXXX', // TODO: Replace
        
        // Price in cents for verification
        sovereignPriceUSD: 39900, // $399.00
        
        // Success redirect URL (where Stripe sends after payment)
        successUrl: '/membership-success.html',
        
        // Cancel redirect URL
        cancelUrl: '/membership.html',
        
        // LocalStorage keys
        storageKeys: {
            membership: 'bsa-membership',
            stripeSession: 'bsa-stripe-session'
        },

        // BTCPay Server config (for when you're ready)
        btcpay: {
            enabled: false,
            storeId: '', // Your BTCPay store ID
            serverUrl: '', // e.g., 'https://btcpay.yourdomain.com'
        }
    };

    class StripeCheckout {
        constructor() {
            this.checkForSuccessfulPayment();
        }

        /**
         * Redirect to Stripe Checkout for Sovereign tier
         */
        purchaseSovereign() {
            // Generate a simple client reference ID
            const clientReferenceId = 'bsa_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            
            // Store reference for verification on return
            localStorage.setItem(CONFIG.storageKeys.stripeSession, JSON.stringify({
                referenceId: clientReferenceId,
                initiated: Date.now()
            }));

            // Build Stripe Payment Link URL with parameters
            const url = new URL(CONFIG.stripePaymentLink);
            url.searchParams.set('client_reference_id', clientReferenceId);
            
            // Redirect to Stripe
            window.location.href = url.toString();
        }

        /**
         * Check URL for successful payment return
         */
        checkForSuccessfulPayment() {
            const urlParams = new URLSearchParams(window.location.search);
            
            // Check if returning from Stripe success
            if (urlParams.has('payment_success') || urlParams.has('session_id')) {
                this.handleSuccessfulPayment();
            }
        }

        /**
         * Handle successful payment return
         */
        handleSuccessfulPayment() {
            const storedSession = localStorage.getItem(CONFIG.storageKeys.stripeSession);
            
            if (storedSession) {
                const session = JSON.parse(storedSession);
                
                // Verify session is recent (within 1 hour)
                if (Date.now() - session.initiated < 3600000) {
                    this.activateSovereignMembership(session.referenceId);
                }
                
                // Clean up
                localStorage.removeItem(CONFIG.storageKeys.stripeSession);
            }

            // Clean URL
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
        }

        /**
         * Activate Sovereign membership
         */
        activateSovereignMembership(referenceId = null) {
            const membership = {
                tier: 'sovereign',
                activated: Date.now(),
                method: 'stripe',
                referenceId: referenceId,
                verified: false // Can be verified via webhook if you add a backend
            };

            localStorage.setItem(CONFIG.storageKeys.membership, JSON.stringify(membership));
            
            // Dispatch event for UI updates
            window.dispatchEvent(new CustomEvent('membershipChanged', { detail: membership }));

            return membership;
        }

        /**
         * Get current membership
         */
        getMembership() {
            try {
                const data = localStorage.getItem(CONFIG.storageKeys.membership);
                return data ? JSON.parse(data) : { tier: 'explorer', activated: null };
            } catch {
                return { tier: 'explorer', activated: null };
            }
        }

        /**
         * Check if user has Sovereign access
         */
        isSovereign() {
            return this.getMembership().tier === 'sovereign';
        }

        // ===== BTCPay Server Integration (Future) =====

        /**
         * Purchase via BTCPay Server
         * Enable this when BTCPay is set up
         */
        async purchaseSovereignBTC() {
            if (!CONFIG.btcpay.enabled) {
                console.warn('[Stripe] BTCPay not enabled. Use purchaseSovereign() instead.');
                return this.purchaseSovereign();
            }

            try {
                // Create BTCPay invoice
                const response = await fetch(`${CONFIG.btcpay.serverUrl}/api/v1/stores/${CONFIG.btcpay.storeId}/invoices`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        amount: CONFIG.sovereignPriceUSD / 100,
                        currency: 'USD',
                        metadata: {
                            orderId: 'bsa_sovereign_' + Date.now(),
                            tier: 'sovereign'
                        },
                        checkout: {
                            redirectURL: window.location.origin + CONFIG.successUrl + '?btcpay_success=true',
                            redirectAutomatically: true
                        }
                    })
                });

                if (!response.ok) throw new Error('Failed to create BTCPay invoice');

                const invoice = await response.json();
                
                // Store for verification
                localStorage.setItem(CONFIG.storageKeys.stripeSession, JSON.stringify({
                    referenceId: invoice.id,
                    initiated: Date.now(),
                    method: 'btcpay'
                }));

                // Redirect to BTCPay checkout
                window.location.href = invoice.checkoutLink;

            } catch (error) {
                console.error('[BTCPay] Error:', error);
                // Fallback to Stripe
                this.purchaseSovereign();
            }
        }

        /**
         * Show payment method selector (when both are enabled)
         */
        showPaymentOptions() {
            if (!CONFIG.btcpay.enabled) {
                // Only Stripe available, go directly
                return this.purchaseSovereign();
            }

            // Return options for UI to display
            return {
                stripe: {
                    label: 'Pay with Card',
                    description: '$399 USD',
                    action: () => this.purchaseSovereign()
                },
                btcpay: {
                    label: 'Pay with Bitcoin',
                    description: '~8,000,000 sats',
                    action: () => this.purchaseSovereignBTC()
                }
            };
        }
    }

    // Create singleton
    const stripeCheckout = new StripeCheckout();

    // Expose globally
    window.stripeCheckout = stripeCheckout;
    window.STRIPE_CONFIG = CONFIG;

    // Export for module use
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { StripeCheckout, CONFIG };
    }

})();
