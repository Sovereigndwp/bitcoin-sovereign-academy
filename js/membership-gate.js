/**
 * Membership Gating System
 * Controls access to premium content based on membership tier
 * 
 * Features:
 * - Integrates with lightning-payment.js and stripe-checkout.js
 * - Shows upgrade modal when non-members access premium content
 * - Graceful degradation for free content
 */

(function() {
    'use strict';

    const CONFIG = {
        // Storage keys
        storageKeys: {
            membership: 'bsa-membership'
        },

        // Pages that are always free (no gating)
        freePages: [
            '/',
            '/index.html',
            '/about.html',
            '/contact.html',
            '/community/',
            '/membership.html',
            '/membership-success.html',
            '/membership.html'
        ],

        // Demo pages that are free (first few in each path)
        freeDemos: [
            '/interactive-demos/',
            '/interactive-demos/index.html',
            '/interactive-demos/bitcoin-unit-converter/',
            '/interactive-demos/money-properties-comparison/',
            '/interactive-demos/energy-bucket/'
        ],

        // Path module-1 pages are always free
        freeModulePattern: /\/paths\/[^/]+\/stage-1\/module-1\.html$/,

        // Premium content patterns (everything else in paths/ and most demos)
        premiumPatterns: [
            /\/paths\/[^/]+\/stage-[2-9]\//,
            /\/paths\/[^/]+\/stage-1\/module-[2-9]\./,
            /\/deep-dives\//
        ]
    };

    class MembershipGate {
        constructor() {
            this.initialized = false;
            this.membership = null;
        }

        async init() {
            if (this.initialized) return;

            this.clearLegacyOwnerState();
            if (this.shouldDeferToServer()) {
                this.initialized = true;
                return;
            }
            
            // Load membership status
            this.membership = this.getMembership();
            
            // Check if current page needs gating
            if (this.shouldGatePage() && !(await this.hasPremiumAccess())) {
                this.applyGate();
            }

            this.initialized = true;
        }

        /**
         * Remove legacy owner-mode storage so it can no longer bypass gating.
         */
        clearLegacyOwnerState() {
            sessionStorage.removeItem('bsa-owner-mode');
        }

        /**
         * Development hosts keep unrestricted access for local work.
         * NOTE: .vercel.app preview URLs are intentionally excluded — they are
         * publicly accessible and must enforce gating like production.
         */
        isDevelopmentMode() {
            const hostname = window.location.hostname.toLowerCase();
            return hostname === 'localhost' ||
                hostname === '127.0.0.1' ||
                hostname === '0.0.0.0' ||
                hostname.endsWith('.localhost');
        }

        isServerEnforcedHost() {
            const hostname = window.location.hostname.toLowerCase();
            return hostname === 'bitcoinsovereign.academy' ||
                hostname === 'www.bitcoinsovereign.academy' ||
                hostname.endsWith('.bitcoinsovereign.academy') ||
                hostname === 'localhost' ||
                hostname === '127.0.0.1' ||
                hostname === '0.0.0.0' ||
                hostname.endsWith('.localhost') ||
                hostname.endsWith('.vercel.app');
        }

        isServerProtectedRoute() {
            const path = window.location.pathname.replace(/\/+$/, '') || '/';

            if (path === '/deep-dives' || path === '/deep-dives/index.html' || path.startsWith('/deep-dives/')) {
                return true;
            }

            if (!path.startsWith('/paths/')) {
                return false;
            }

            const segments = path.split('/').filter(Boolean);
            const [, , section, child] = segments;

            if (section === 'capstone') {
                return true;
            }

            if (section === 'stage-1') {
                if (child === 'deep-dives') {
                    return true;
                }

                if (!child || child === 'index.html') {
                    return false;
                }

                return child.startsWith('module-') && child !== 'module-1' && child !== 'module-1.html';
            }

            const stageMatch = /^stage-(\d+)$/.exec(section || '');
            return Boolean(stageMatch && Number(stageMatch[1]) >= 2);
        }

        shouldDeferToServer() {
            return this.isServerEnforcedHost() && this.isServerProtectedRoute();
        }

        /**
         * Check for a signed access token issued by the server.
         */
        getAccessVerifier() {
            if (window.BSAAccessVerifier) {
                return window.BSAAccessVerifier;
            }

            window.BSAAccessVerifier = {
                getStoredToken() {
                    return localStorage.getItem('bsa_access_token') ||
                        localStorage.getItem('bsa_jwt_token');
                },
                clearStoredToken() {
                    localStorage.removeItem('bsa_access_token');
                    localStorage.removeItem('bsa_jwt_token');
                },
                getPayload(token) {
                    if (!token) {
                        return null;
                    }

                    try {
                        const parts = token.split('.');
                        if (parts.length !== 3) {
                            return null;
                        }

                        const normalizedPayload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
                        const paddedPayload = normalizedPayload + '='.repeat((4 - normalizedPayload.length % 4) % 4);
                        const payload = JSON.parse(atob(paddedPayload));

                        if (payload.exp && payload.exp * 1000 < Date.now()) {
                            this.clearStoredToken();
                            return null;
                        }

                        return payload;
                    } catch {
                        return null;
                    }
                },
                async verifyToken(token, body = {}) {
                    if (!token || !this.getPayload(token)) {
                        return false;
                    }

                    if (this.verifiedToken === token) {
                        return true;
                    }

                    if (this.pendingVerification?.token === token) {
                        return this.pendingVerification.promise;
                    }

                    const promise = fetch('/api/verify-access', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(body)
                    })
                        .then((response) => {
                            if (!response.ok) {
                                if (response.status === 401 || response.status === 403) {
                                    this.clearStoredToken();
                                }
                                return false;
                            }

                            this.verifiedToken = token;
                            return true;
                        })
                        .catch((error) => {
                            console.warn('[Membership Gate] Token verification failed:', error);
                            return false;
                        })
                        .finally(() => {
                            if (this.pendingVerification?.token === token) {
                                delete this.pendingVerification;
                            }
                        });

                    this.pendingVerification = { token, promise };
                    return promise;
                },
                async verifyStoredToken(body = {}) {
                    return this.verifyToken(this.getStoredToken(), body);
                }
            };

            return window.BSAAccessVerifier;
        }

        hasValidAccessToken() {
            const token = this.getAccessVerifier().getStoredToken();
            return Boolean(this.getAccessVerifier().getPayload(token));
        }

        /**
         * Get membership from localStorage
         */
        getMembership() {
            try {
                const data = localStorage.getItem(CONFIG.storageKeys.membership);
                return data ? JSON.parse(data) : { tier: 'explorer' };
            } catch {
                return { tier: 'explorer' };
            }
        }

        /**
         * Check if user has premium access
         */
        async hasPremiumAccess() {
            if (this.isDevelopmentMode() || window.BSASubdomainAccess?.hasFullAccess?.()) {
                return true;
            }

            return this.getAccessVerifier().verifyStoredToken();
        }

        /**
         * Determine if current page should be gated
         */
        shouldGatePage() {
            const path = window.location.pathname;

            // Always free pages
            if (CONFIG.freePages.some(p => path === p || path === p + 'index.html')) {
                return false;
            }

            // Free demos
            if (CONFIG.freeDemos.some(p => path.startsWith(p))) {
                return false;
            }

            // Free module pattern (module-1 of stage-1)
            if (CONFIG.freeModulePattern.test(path)) {
                return false;
            }

            // Check if premium content
            const isPremium = CONFIG.premiumPatterns.some(pattern => pattern.test(path));
            
            // If premium and no access, gate it
            return isPremium;
        }

        /**
         * Apply the gate overlay
         */
        applyGate() {
            // Wait for DOM
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.showGateOverlay());
            } else {
                this.showGateOverlay();
            }
        }

        /**
         * Show the full-page gate overlay
         */
        showGateOverlay() {
            // Track gate view
            if (window.bsaAnalytics) {
                window.bsaAnalytics.trackGateView(window.location.pathname);
            }

            // Inject styles
            this.injectStyles();

            // Capture the element that had focus before the gate opened so we
            // can restore it if the gate is ever dismissed.
            this._previousFocus = document.activeElement;

            // Create overlay — modal dialog with proper a11y semantics.
            const overlay = document.createElement('div');
            overlay.id = 'membership-gate-overlay';
            overlay.setAttribute('role', 'dialog');
            overlay.setAttribute('aria-modal', 'true');
            overlay.setAttribute('aria-labelledby', 'membership-gate-title');
            overlay.setAttribute('aria-describedby', 'membership-gate-subtitle');
            overlay.innerHTML = `
                <div class="gate-content" tabindex="-1">
                    <div class="gate-icon" aria-hidden="true">🔐</div>
                    <h2 id="membership-gate-title">Premium Content</h2>
                    <p class="gate-subtitle" id="membership-gate-subtitle">This content is available to members only.</p>

                    <div class="gate-options">
                        <div class="gate-option apprentice">
                            <div class="option-badge">Popular</div>
                            <h3>⚡ Apprentice</h3>
                            <div class="option-price">50,000 sats</div>
                            <p>Deposit sats, earn up to 80% back as you learn</p>
                            <button type="button" class="gate-btn primary" onclick="if(window.bsaAnalytics)window.bsaAnalytics.trackMembershipClick('apprentice','gate');window.location.href='/membership.html#apprentice'">
                                Start Earning
                            </button>
                        </div>

                        <div class="gate-option sovereign">
                            <h3>👑 Sovereign</h3>
                            <div class="option-price">$399</div>
                            <p>Lifetime access to everything. No hoops.</p>
                            <button type="button" class="gate-btn secondary" onclick="if(window.bsaAnalytics)window.bsaAnalytics.trackMembershipClick('sovereign','gate');window.location.href='/membership.html#sovereign'">
                                Get Lifetime Access
                            </button>
                        </div>
                    </div>

                    <div class="gate-benefits">
                        <span>✓ 44 interactive demos</span>
                        <span>✓ AI Tutor access</span>
                        <span>✓ All learning paths</span>
                    </div>

                    <div class="gate-footer">
                        <a href="/" class="gate-link">← Back to Home</a>
                        <span class="gate-divider" aria-hidden="true">|</span>
                        <a href="/interactive-demos/" class="gate-link">Browse Free Content</a>
                    </div>
                </div>
            `;

            document.body.appendChild(overlay);
            document.body.style.overflow = 'hidden';

            // Move focus into the dialog (focus the first primary CTA so SR users
            // immediately hear the meaningful action).
            const firstCta = overlay.querySelector('.gate-btn.primary') || overlay.querySelector('.gate-content');
            if (firstCta && typeof firstCta.focus === 'function') firstCta.focus();

            // Trap Tab / Shift+Tab inside the dialog while it's open.
            this._trapHandler = (e) => this._trapFocusOnTab(e, overlay);
            document.addEventListener('keydown', this._trapHandler);
        }

        /**
         * Focus-trap handler — keeps Tab/Shift+Tab cycling within the modal.
         */
        _trapFocusOnTab(e, overlay) {
            if (e.key !== 'Tab') return;
            const focusable = overlay.querySelectorAll(
                'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
            );
            if (focusable.length === 0) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }

        /**
         * Inject gate styles
         */
        injectStyles() {
            if (document.getElementById('membership-gate-styles')) return;

            const styles = document.createElement('style');
            styles.id = 'membership-gate-styles';
            styles.textContent = `
                #membership-gate-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(15, 15, 15, 0.97);
                    z-index: 99998;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                }

                .gate-content {
                    max-width: 600px;
                    text-align: center;
                    color: #e0e0e0;
                }

                .gate-icon {
                    font-size: 4rem;
                    margin-bottom: 1rem;
                }

                .gate-content h2 {
                    font-size: 2rem;
                    margin-bottom: 0.5rem;
                    color: #fff;
                }

                .gate-subtitle {
                    color: #999;
                    font-size: 1.1rem;
                    margin-bottom: 2rem;
                }

                .gate-options {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }

                @media (max-width: 600px) {
                    .gate-options {
                        grid-template-columns: 1fr;
                    }
                }

                .gate-option {
                    background: #1a1a1a;
                    border: 2px solid #2d2d2d;
                    border-radius: 16px;
                    padding: 1.5rem;
                    position: relative;
                    transition: all 0.3s ease;
                }

                .gate-option:hover {
                    border-color: rgba(247, 147, 26, 0.5);
                    transform: translateY(-2px);
                }

                .gate-option.apprentice {
                    border-color: rgba(247, 147, 26, 0.3);
                }

                .option-badge {
                    position: absolute;
                    top: -10px;
                    right: 15px;
                    background: #f7931a;
                    color: #000;
                    padding: 3px 10px;
                    border-radius: 10px;
                    font-size: 11px;
                    font-weight: 700;
                }

                .gate-option h3 {
                    font-size: 1.25rem;
                    margin-bottom: 0.5rem;
                    color: #fff;
                }

                .option-price {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #f7931a;
                    margin-bottom: 0.5rem;
                }

                .gate-option p {
                    color: #999;
                    font-size: 0.9rem;
                    margin-bottom: 1rem;
                }

                .gate-btn {
                    width: 100%;
                    padding: 0.75rem 1.5rem;
                    border: none;
                    border-radius: 10px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .gate-btn.primary {
                    background: linear-gradient(135deg, #f7931a 0%, #ffb347 100%);
                    color: #000;
                }

                .gate-btn.primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(247, 147, 26, 0.4);
                }

                .gate-btn.secondary {
                    background: #2d2d2d;
                    color: #e0e0e0;
                }

                .gate-btn.secondary:hover {
                    background: #3d3d3d;
                }

                .gate-benefits {
                    display: flex;
                    justify-content: center;
                    gap: 1.5rem;
                    flex-wrap: wrap;
                    margin-bottom: 2rem;
                    color: #4CAF50;
                    font-size: 0.9rem;
                }

                .gate-footer {
                    color: #666;
                    font-size: 0.9rem;
                }

                .gate-link {
                    color: #f7931a;
                    text-decoration: none;
                }

                .gate-link:hover {
                    text-decoration: underline;
                }

                .gate-divider {
                    margin: 0 1rem;
                }
            `;
            document.head.appendChild(styles);
        }
    }

    // Create and initialize
    const membershipGate = new MembershipGate();
    
    // Initialize on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => membershipGate.init());
    } else {
        membershipGate.init();
    }

    // Expose globally
    window.membershipGate = membershipGate;

})();
