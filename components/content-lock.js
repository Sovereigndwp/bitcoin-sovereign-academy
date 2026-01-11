/**
 * Content Lock Overlay
 * 
 * Checks if user has entitlement to access content.
 * Shows paywall overlay if not authorized.
 * 
 * Usage:
 * <script src="/components/content-lock.js"></script>
 * <script>
 *   ContentLock.init({
 *     contentId: 'bitcoin-basics',
 *     contentType: 'demo',
 *     pricing: {
 *       demo: { price: 3, duration: '48 hours' },
 *       path: { price: 9, duration: 'monthly' }
 *     }
 *   });
 * </script>
 */

(function(window) {
    'use strict';

    const ContentLock = {
        config: null,
        isChecking: false,
        hasAccess: false,

        /**
         * Initialize content lock
         */
        init(config) {
            this.config = config;
            this.checkAccess();
        },

        /**
         * Check if user has access to content
         */
        async checkAccess() {
            if (this.isChecking) return;
            this.isChecking = true;

            try {
                // Get JWT token from cookie or localStorage
                const token = this.getAuthToken();

                if (!token) {
                    this.showLockOverlay('Please sign in to access this content');
                    return;
                }

                // Call entitlements check API
                const response = await fetch('/api/entitlements/check', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        contentId: this.config.contentId,
                        contentType: this.config.contentType
                    })
                });

                const data = await response.json();

                if (response.ok && data.hasAccess) {
                    this.hasAccess = true;
                    this.hideContent(false);
                    this.trackAccess();
                } else {
                    this.hasAccess = false;
                    this.showLockOverlay(data.message || 'This content requires a subscription');
                }
            } catch (error) {
                console.error('Access check failed:', error);
                this.showLockOverlay('Unable to verify access. Please try again.');
            } finally {
                this.isChecking = false;
            }
        },

        /**
         * Get auth token from storage
         */
        getAuthToken() {
            // Try cookie first
            const cookies = document.cookie.split(';');
            for (let cookie of cookies) {
                const [name, value] = cookie.trim().split('=');
                if (name === 'auth_token') {
                    return value;
                }
            }

            // Fallback to localStorage
            return localStorage.getItem('auth_token');
        },

        /**
         * Show lock overlay
         */
        showLockOverlay(message) {
            // Hide content
            this.hideContent(true);

            // Create overlay if doesn't exist
            let overlay = document.getElementById('contentLockOverlay');
            if (!overlay) {
                overlay = this.createOverlay();
                document.body.appendChild(overlay);
            }

            // Update message
            document.getElementById('lockMessage').textContent = message;

            // Show overlay
            overlay.style.display = 'flex';
        },

        /**
         * Hide content
         */
        hideContent(hide) {
            const contentEl = document.querySelector('[data-protected-content]');
            if (contentEl) {
                contentEl.style.filter = hide ? 'blur(10px)' : 'none';
                contentEl.style.pointerEvents = hide ? 'none' : 'auto';
                contentEl.style.userSelect = hide ? 'none' : 'auto';
            }
        },

        /**
         * Create lock overlay
         */
        createOverlay() {
            const overlay = document.createElement('div');
            overlay.id = 'contentLockOverlay';
            overlay.innerHTML = `
                <style>
                    #contentLockOverlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(15, 15, 15, 0.95);
                        z-index: 9999;
                        display: none;
                        justify-content: center;
                        align-items: center;
                        backdrop-filter: blur(10px);
                    }

                    #contentLockOverlay .lock-card {
                        background: #1a1a1a;
                        border: 2px solid #f7931a;
                        border-radius: 24px;
                        padding: 3rem;
                        max-width: 500px;
                        width: 90%;
                        text-align: center;
                        box-shadow: 0 8px 32px rgba(247, 147, 26, 0.3);
                    }

                    #contentLockOverlay .lock-icon {
                        font-size: 4rem;
                        margin-bottom: 1.5rem;
                    }

                    #contentLockOverlay h2 {
                        color: #e0e0e0;
                        font-size: 2rem;
                        margin-bottom: 1rem;
                    }

                    #contentLockOverlay p {
                        color: #b3b3b3;
                        font-size: 1.1rem;
                        margin-bottom: 2rem;
                        line-height: 1.6;
                    }

                    #contentLockOverlay .pricing-options {
                        display: flex;
                        gap: 1rem;
                        margin-bottom: 2rem;
                        flex-wrap: wrap;
                    }

                    #contentLockOverlay .pricing-option {
                        flex: 1;
                        min-width: 150px;
                        background: #0f0f0f;
                        border: 2px solid #2d2d2d;
                        border-radius: 16px;
                        padding: 1.5rem;
                        cursor: pointer;
                        transition: all 0.3s;
                    }

                    #contentLockOverlay .pricing-option:hover {
                        border-color: #f7931a;
                        transform: translateY(-4px);
                    }

                    #contentLockOverlay .pricing-option .type {
                        font-size: 0.9rem;
                        color: #b3b3b3;
                        margin-bottom: 0.5rem;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }

                    #contentLockOverlay .pricing-option .price {
                        font-size: 2rem;
                        font-weight: 800;
                        color: #f7931a;
                        margin-bottom: 0.25rem;
                    }

                    #contentLockOverlay .pricing-option .duration {
                        font-size: 0.85rem;
                        color: #b3b3b3;
                    }

                    #contentLockOverlay .btn-unlock,
                    #contentLockOverlay .btn-signin {
                        padding: 1rem 2.5rem;
                        border-radius: 12px;
                        font-size: 1rem;
                        font-weight: 700;
                        cursor: pointer;
                        transition: all 0.3s;
                        border: none;
                        margin: 0.5rem;
                    }

                    #contentLockOverlay .btn-unlock {
                        background: linear-gradient(135deg, #f7931a, #ff8c00);
                        color: white;
                    }

                    #contentLockOverlay .btn-unlock:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 4px 12px rgba(247, 147, 26, 0.5);
                    }

                    #contentLockOverlay .btn-signin {
                        background: transparent;
                        color: #f7931a;
                        border: 2px solid #f7931a;
                    }

                    #contentLockOverlay .btn-signin:hover {
                        background: rgba(247, 147, 26, 0.1);
                    }

                    @media (max-width: 768px) {
                        #contentLockOverlay .lock-card {
                            padding: 2rem;
                        }

                        #contentLockOverlay h2 {
                            font-size: 1.5rem;
                        }

                        #contentLockOverlay .pricing-options {
                            flex-direction: column;
                        }
                    }
                </style>

                <div class="lock-card">
                    <div class="lock-icon">🔒</div>
                    <h2>Premium Content</h2>
                    <p id="lockMessage">This content requires a subscription</p>
                    
                    <div class="pricing-options" id="pricingOptions"></div>
                    
                    <div>
                        <button class="btn-unlock" onclick="ContentLock.goToPricing()">
                            View Pricing Options
                        </button>
                        <button class="btn-signin" onclick="ContentLock.showSignIn()">
                            Sign In
                        </button>
                    </div>
                </div>
            `;

            // Populate pricing options if provided
            if (this.config.pricing) {
                const pricingContainer = overlay.querySelector('#pricingOptions');
                for (const [type, info] of Object.entries(this.config.pricing)) {
                    const option = document.createElement('div');
                    option.className = 'pricing-option';
                    option.innerHTML = `
                        <div class="type">${type}</div>
                        <div class="price">$${info.price}</div>
                        <div class="duration">${info.duration}</div>
                    `;
                    option.onclick = () => this.goToPricing();
                    pricingContainer.appendChild(option);
                }
            }

            return overlay;
        },

        /**
         * Go to pricing page
         */
        goToPricing() {
            window.location.href = '/pricing-new.html';
        },

        /**
         * Show sign in modal
         */
        showSignIn() {
            // TODO: Implement magic link auth modal
            const email = prompt('Enter your email address:');
            if (email) {
                this.requestMagicLink(email);
            }
        },

        /**
         * Request magic link
         */
        async requestMagicLink(email) {
            try {
                const response = await fetch('/api/auth/magic-link', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email })
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Magic link sent! Check your email to sign in.');
                } else {
                    alert('Failed to send magic link: ' + (data.error || 'Unknown error'));
                }
            } catch (error) {
                console.error('Magic link error:', error);
                alert('Failed to send magic link. Please try again.');
            }
        },

        /**
         * Track content access
         */
        async trackAccess() {
            try {
                const token = this.getAuthToken();
                if (!token) return;

                await fetch('/api/usage/track', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        contentId: this.config.contentId,
                        contentType: this.config.contentType,
                        eventType: `${this.config.contentType}_view`
                    })
                });
            } catch (error) {
                // Silent fail - tracking is not critical
                console.debug('Tracking failed:', error);
            }
        }
    };

    // Expose to global scope
    window.ContentLock = ContentLock;

})(window);
