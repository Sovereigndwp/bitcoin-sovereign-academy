/**
 * Membership Gating System
 * Controls access to premium content based on membership tier
 * 
 * Features:
 * - Integrates with lightning-payment.js and stripe-checkout.js
 * - Shows upgrade modal when non-members access premium content
 * - Owner bypass with secret key
 * - Graceful degradation for free content
 */

(function() {
    'use strict';

    const CONFIG = {
        // Owner bypass - add ?owner=YOUR_SECRET to URL to get full access
        // Change this to your own secret key
        ownerSecret: 'dalia2024bsa',
        
        // Storage keys
        storageKeys: {
            membership: 'bsa-membership',
            ownerMode: 'bsa-owner-mode'
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
            '/pricing.html'
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
            this.isOwner = false;
        }

        init() {
            if (this.initialized) return;
            
            // Check for owner bypass first
            this.checkOwnerMode();
            
            // Load membership status
            this.membership = this.getMembership();
            
            // Check if current page needs gating
            if (!this.isOwner && this.shouldGatePage()) {
                this.applyGate();
            }

            this.initialized = true;
        }

        /**
         * Check for owner mode via URL param or stored session
         */
        checkOwnerMode() {
            const params = new URLSearchParams(window.location.search);
            const ownerParam = params.get('owner');

            // Activate owner mode
            if (ownerParam === CONFIG.ownerSecret) {
                sessionStorage.setItem(CONFIG.storageKeys.ownerMode, 'active');
                this.isOwner = true;
                this.showOwnerBadge();
                // Clean URL
                params.delete('owner');
                const cleanUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
                window.history.replaceState({}, '', cleanUrl);
                return;
            }

            // Deactivate owner mode
            if (ownerParam === 'exit') {
                sessionStorage.removeItem(CONFIG.storageKeys.ownerMode);
                this.isOwner = false;
                params.delete('owner');
                const cleanUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
                window.history.replaceState({}, '', cleanUrl);
                return;
            }

            // Check stored owner mode
            this.isOwner = sessionStorage.getItem(CONFIG.storageKeys.ownerMode) === 'active';
            if (this.isOwner) {
                this.showOwnerBadge();
            }
        }

        /**
         * Show owner badge in corner
         */
        showOwnerBadge() {
            if (document.getElementById('owner-badge')) return;
            
            const badge = document.createElement('div');
            badge.id = 'owner-badge';
            badge.innerHTML = '👑 Owner Mode';
            badge.style.cssText = `
                position: fixed;
                top: 10px;
                left: 10px;
                background: linear-gradient(135deg, #9333ea 0%, #a855f7 100%);
                color: white;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                z-index: 99999;
                cursor: pointer;
                box-shadow: 0 2px 10px rgba(147, 51, 234, 0.4);
            `;
            badge.title = 'Click to exit owner mode';
            badge.addEventListener('click', () => {
                if (confirm('Exit owner mode?')) {
                    sessionStorage.removeItem(CONFIG.storageKeys.ownerMode);
                    window.location.reload();
                }
            });
            document.body.appendChild(badge);
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
        hasPremiumAccess() {
            if (this.isOwner) return true;
            const tier = this.membership?.tier;
            return tier === 'apprentice' || tier === 'sovereign';
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
            return isPremium && !this.hasPremiumAccess();
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
            // Inject styles
            this.injectStyles();

            // Create overlay
            const overlay = document.createElement('div');
            overlay.id = 'membership-gate-overlay';
            overlay.innerHTML = `
                <div class="gate-content">
                    <div class="gate-icon">🔐</div>
                    <h2>Premium Content</h2>
                    <p class="gate-subtitle">This content is available to members only.</p>
                    
                    <div class="gate-options">
                        <div class="gate-option apprentice">
                            <div class="option-badge">Popular</div>
                            <h3>⚡ Apprentice</h3>
                            <div class="option-price">50,000 sats</div>
                            <p>Deposit sats, earn up to 80% back as you learn</p>
                            <button class="gate-btn primary" onclick="window.location.href='/membership.html#apprentice'">
                                Start Earning
                            </button>
                        </div>
                        
                        <div class="gate-option sovereign">
                            <h3>👑 Sovereign</h3>
                            <div class="option-price">$399</div>
                            <p>Lifetime access to everything. No hoops.</p>
                            <button class="gate-btn secondary" onclick="window.location.href='/membership.html#sovereign'">
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
                        <span class="gate-divider">|</span>
                        <a href="/interactive-demos/" class="gate-link">Browse Free Content</a>
                    </div>
                </div>
            `;

            document.body.appendChild(overlay);
            document.body.style.overflow = 'hidden';
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
