/**
 * Stripe Checkout Integration
 * Handles Apprentice and Sovereign card payments with server-side verification.
 */

(function() {
    'use strict';

    const CONFIG = {
        // Legacy field kept so older page checks do not throw.
        stripePaymentLink: '',
        sovereignPriceUSD: 39900, // $399.00
        sovereignCheckoutApi: '/api/sovereign-checkout',
        apprenticeCheckoutApi: '/api/apprentice-checkout',
        apprenticeSats: 50000,
        verifySessionApi: '/api/verify-stripe-session',
        successUrl: '/membership-success.html',
        cancelUrl: '/membership.html',
        storageKeys: {
            membership: 'bsa-membership',
            stripeSession: 'bsa-stripe-session',
            postAuthRedirect: 'bsa_post_auth_redirect'
        },
        btcpay: {
            enabled: false,
            storeId: '',
            serverUrl: '',
        }
    };

    class StripeCheckout {
        constructor() {
            this.checkForSuccessfulPayment();
        }

        storePendingSession(session) {
            const existing = this.getPendingSession() || {};
            localStorage.setItem(CONFIG.storageKeys.stripeSession, JSON.stringify({
                ...existing,
                ...session,
                initiated: existing.initiated || Date.now()
            }));
        }

        getPendingSession() {
            try {
                const stored = localStorage.getItem(CONFIG.storageKeys.stripeSession);
                return stored ? JSON.parse(stored) : null;
            } catch {
                return null;
            }
        }

        clearPendingSession() {
            localStorage.removeItem(CONFIG.storageKeys.stripeSession);
        }

        isSafeReturnPath(path) {
            return typeof path === 'string' &&
                path.startsWith('/') &&
                !path.startsWith('//') &&
                !path.startsWith('/membership');
        }

        getStoredReturnPath() {
            const stored = localStorage.getItem(CONFIG.storageKeys.postAuthRedirect);
            return this.isSafeReturnPath(stored) ? stored : null;
        }

        clearStoredReturnPath() {
            localStorage.removeItem(CONFIG.storageKeys.postAuthRedirect);
        }

        getPendingReturnPath(pendingSession = null) {
            const candidate = pendingSession?.returnTo || this.getStoredReturnPath();
            return this.isSafeReturnPath(candidate) ? candidate : null;
        }

        async purchaseApprentice(priceCents) {
            if (!priceCents || priceCents < 100) {
                alert('Unable to determine fiat price. Please refresh the page.');
                return;
            }
            this.storePendingSession({
                expectedTier: 'apprentice',
                returnTo: this.getStoredReturnPath()
            });
            this.storePendingSession({ expectedTier: 'apprentice' });

            try {
                const body = {
                    priceCents,
                    successUrl: window.location.origin + '/membership.html?payment_success=1',
                    cancelUrl: window.location.origin + CONFIG.cancelUrl
                };
                const refCode = localStorage.getItem('bsa-referral-code');
                if (refCode) body.referralCode = refCode;

                const res = await fetch(CONFIG.apprenticeCheckoutApi, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                });

                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.error || 'Checkout failed');
                }

                const { sessionId, url } = await res.json();
                this.storePendingSession({ expectedTier: 'apprentice', sessionId });

                if (!url) {
                    throw new Error('No checkout URL returned');
                }

                window.location.href = url;
            } catch (err) {
                this.clearPendingSession();
                console.error('[Stripe] Apprentice checkout error:', err);
                alert('Payment error: ' + err.message);
            }
        }

        async purchaseSovereign() {
            this.storePendingSession({
                expectedTier: 'sovereign',
                returnTo: this.getStoredReturnPath()
            });

            try {
                const res = await fetch(CONFIG.sovereignCheckoutApi, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        successUrl: window.location.origin + CONFIG.successUrl,
                        cancelUrl: window.location.origin + CONFIG.cancelUrl
                    })
                });

                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.error || 'Checkout failed');
                }

                const { sessionId, url } = await res.json();
                this.storePendingSession({ expectedTier: 'sovereign', sessionId });

                if (!url) {
                    throw new Error('No checkout URL returned');
                }

                window.location.href = url;
            } catch (err) {
                this.clearPendingSession();
                console.error('[Stripe] Sovereign checkout error:', err);
                alert('Payment error: ' + err.message);
            }
        }

        checkForSuccessfulPayment() {
            const urlParams = new URLSearchParams(window.location.search);
            const sessionId = urlParams.get('session_id');

            if (sessionId) {
                this.handleSuccessfulPayment(sessionId);
                return;
            }

            if (urlParams.has('payment_success')) {
                this.setVerificationState('error', 'We could not verify the Stripe session from the return URL.');
                this.cleanReturnUrl();
            }
        }

        async handleSuccessfulPayment(sessionId) {
            if (!sessionId) {
                this.setVerificationState('error', 'Missing Stripe session ID.');
                return;
            }

            const pendingSession = this.getPendingSession();
            const expectedTier = pendingSession?.expectedTier || this.inferExpectedTierFromPage();
            const returnTo = this.getPendingReturnPath(pendingSession);
            this.setVerificationState('pending', 'Verifying your payment and unlocking access…');

            try {
                const response = await fetch(CONFIG.verifySessionApi, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sessionId, expectedTier })
                });

                const data = await response.json().catch(() => ({}));
                if (!response.ok || !data.verified || !data.membership) {
                    throw new Error(data.error || 'We could not verify this payment yet.');
                }

                const membership = this.activateVerifiedMembership(data.membership, data.accessToken);
                this.clearPendingSession();
                this.cleanReturnUrl();
                this.setVerificationState(
                    'success',
                    membership.tier === 'sovereign'
                        ? returnTo
                            ? 'Payment verified. Sovereign access is now active. Redirecting you back…'
                            : 'Payment verified. Sovereign access is now active.'
                        : returnTo
                            ? 'Payment verified. Apprentice access is now active. Redirecting you back…'
                            : 'Payment verified. Apprentice access is now active.'
                );
                if (returnTo) {
                    this.clearStoredReturnPath();
                    window.setTimeout(() => {
                        window.location.assign(returnTo);
                    }, 1200);
                }
            } catch (err) {
                console.error('[Stripe] Verification error:', err);
                this.setVerificationState('error', err.message || 'We could not verify this payment yet.');
            }
        }

        inferExpectedTierFromPage() {
            return window.location.pathname.endsWith('/membership-success.html') ||
                window.location.pathname === '/membership-success.html'
                ? 'sovereign'
                : null;
        }

        activateVerifiedMembership(verifiedMembership, accessToken) {
            const membership = {
                tier: verifiedMembership.tier,
                activated: verifiedMembership.activated
                    ? new Date(verifiedMembership.activated).getTime()
                    : Date.now(),
                method: 'stripe',
                referenceId: verifiedMembership.referenceId || null,
                verified: true
            };

            localStorage.setItem(CONFIG.storageKeys.membership, JSON.stringify(membership));
            if (accessToken) {
                localStorage.setItem('bsa_access_token', accessToken);
            }

            if (window.bsaAnalytics) {
                window.bsaAnalytics.trackStripeSuccess(membership.referenceId);
                window.bsaAnalytics.trackMembershipSet(membership.tier, 'stripe');
            }

            window.dispatchEvent(new CustomEvent('membershipChanged', { detail: membership }));
            return membership;
        }

        cleanReturnUrl() {
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
        }

        ensureStatusNode() {
            this.injectStatusStyles();

            const existingStatus = document.getElementById('stripe-verification-status');
            if (existingStatus) {
                return existingStatus;
            }

            let banner = document.getElementById('stripe-verification-banner');
            if (!banner) {
                banner = document.createElement('div');
                banner.id = 'stripe-verification-banner';
                banner.className = 'stripe-verification-banner pending';

                const container = document.querySelector('main') || document.body;
                container.insertBefore(banner, container.firstChild);
            }

            return banner;
        }

        injectStatusStyles() {
            if (document.getElementById('stripe-verification-styles')) {
                return;
            }

            const styles = document.createElement('style');
            styles.id = 'stripe-verification-styles';
            styles.textContent = `
                .stripe-verification-banner {
                    max-width: 760px;
                    margin: 1.5rem auto;
                    padding: 0.9rem 1.1rem;
                    border-radius: 12px;
                    font-weight: 600;
                    text-align: center;
                }
                .stripe-verification-banner.pending {
                    background: rgba(200, 146, 42, 0.12);
                    color: #C8922A;
                    border: 1px solid rgba(200, 146, 42, 0.35);
                }
                .stripe-verification-banner.success {
                    background: rgba(76, 175, 80, 0.12);
                    color: #4caf50;
                    border: 1px solid rgba(76, 175, 80, 0.35);
                }
                .stripe-verification-banner.error {
                    background: rgba(239, 68, 68, 0.12);
                    color: #f87171;
                    border: 1px solid rgba(239, 68, 68, 0.35);
                }
                #stripe-verification-status[data-state="pending"] {
                    color: var(--accent, #C8922A);
                }
                #stripe-verification-status[data-state="success"] {
                    color: var(--success, #4CAF50);
                }
                #stripe-verification-status[data-state="error"] {
                    color: #f87171;
                }
            `;
            document.head.appendChild(styles);
        }

        setVerificationState(state, message) {
            const statusNode = this.ensureStatusNode();
            if (statusNode.id === 'stripe-verification-status') {
                statusNode.dataset.state = state;
                statusNode.textContent = message;
                return;
            }

            statusNode.className = `stripe-verification-banner ${state}`;
            statusNode.textContent = message;
        }

        getMembership() {
            try {
                const data = localStorage.getItem(CONFIG.storageKeys.membership);
                return data ? JSON.parse(data) : { tier: 'explorer', activated: null };
            } catch {
                return { tier: 'explorer', activated: null };
            }
        }

        isSovereign() {
            return this.getMembership().tier === 'sovereign';
        }

        async purchaseSovereignBTC() {
            if (!CONFIG.btcpay.enabled) {
                console.warn('[Stripe] BTCPay not enabled. Use purchaseSovereign() instead.');
                return this.purchaseSovereign();
            }

            // SECURITY: Do NOT call BTCPay directly from the browser.
            // Route through /api/btcpay-checkout instead, which keeps the
            // store credentials server-side and validates the request first.
            // This direct-call approach exposes storeId + serverUrl in client code.
            try {
                const response = await fetch('/api/btcpay-checkout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        tier: 'sovereign',
                        successUrl: window.location.origin + CONFIG.successUrl + '?btcpay_success=true',
                        cancelUrl: window.location.origin + CONFIG.cancelUrl
                    })
                });

                if (!response.ok) throw new Error('Failed to create BTCPay invoice');

                const invoice = await response.json();
                this.storePendingSession({
                    referenceId: invoice.id || invoice.invoiceId,
                    method: 'btcpay',
                    expectedTier: 'sovereign'
                });

                const checkoutUrl = invoice.checkoutLink || invoice.checkoutUrl || invoice.url;
                if (!checkoutUrl) throw new Error('No checkout URL returned from BTCPay');
                window.location.href = checkoutUrl;

            } catch (error) {
                console.error('[BTCPay] Error:', error);
                this.purchaseSovereign();
            }
        }

        showPaymentOptions() {
            if (!CONFIG.btcpay.enabled) {
                return this.purchaseSovereign();
            }

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

    const stripeCheckout = new StripeCheckout();

    window.stripeCheckout = stripeCheckout;
    window.STRIPE_CONFIG = CONFIG;

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { StripeCheckout, CONFIG };
    }
})();
