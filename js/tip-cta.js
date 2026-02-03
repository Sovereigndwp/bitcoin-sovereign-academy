/**
 * Tip CTA Component
 * Shows "Support the Academy" prompts on free content
 * 
 * Features:
 * - Inline tip CTAs for page footers
 * - Tracks tip_click events in analytics
 * - Links to Lightning tipping and other support options
 * - Non-intrusive, respects user preference
 */

(function() {
    'use strict';

    const CONFIG = {
        // Lightning address for tips
        lightningAddress: 'dulcetsurf67367@getalby.com',
        
        // Hide after user dismisses (session only)
        hideAfterDismiss: true,
        
        // Storage key
        dismissKey: 'bsa-tip-dismissed'
    };

    class TipCTA {
        constructor() {
            this.isDismissed = sessionStorage.getItem(CONFIG.dismissKey) === 'true';
            this.injectStyles();
        }

        /**
         * Inject component styles
         */
        injectStyles() {
            if (document.getElementById('tip-cta-styles')) return;

            const styles = document.createElement('style');
            styles.id = 'tip-cta-styles';
            styles.textContent = `
                .tip-cta {
                    background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%);
                    border: 2px solid rgba(76, 175, 80, 0.25);
                    border-radius: 16px;
                    padding: 1.5rem 2rem;
                    margin: 2rem 0;
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    flex-wrap: wrap;
                }

                .tip-cta-icon {
                    font-size: 2.5rem;
                    flex-shrink: 0;
                }

                .tip-cta-content {
                    flex: 1;
                    min-width: 200px;
                }

                .tip-cta-content h4 {
                    color: #4CAF50;
                    font-size: 1.1rem;
                    margin-bottom: 0.25rem;
                }

                .tip-cta-content p {
                    color: #999;
                    font-size: 0.9rem;
                    margin: 0;
                }

                .tip-cta-actions {
                    display: flex;
                    gap: 0.75rem;
                    flex-wrap: wrap;
                }

                .tip-cta-btn {
                    padding: 0.6rem 1.25rem;
                    border-radius: 10px;
                    font-weight: 600;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .tip-cta-btn.primary {
                    background: linear-gradient(135deg, #f7931a 0%, #ffb347 100%);
                    color: #000;
                    border: none;
                }

                .tip-cta-btn.primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(247, 147, 26, 0.4);
                }

                .tip-cta-btn.secondary {
                    background: transparent;
                    border: 1px solid #666;
                    color: #999;
                }

                .tip-cta-btn.secondary:hover {
                    border-color: #999;
                    color: #e0e0e0;
                }

                .tip-cta-dismiss {
                    position: absolute;
                    top: 0.5rem;
                    right: 0.5rem;
                    background: none;
                    border: none;
                    color: #666;
                    cursor: pointer;
                    font-size: 1.25rem;
                    padding: 0.25rem;
                }

                /* Compact variant */
                .tip-cta.compact {
                    padding: 1rem 1.5rem;
                    position: relative;
                }

                .tip-cta.compact .tip-cta-icon {
                    font-size: 1.75rem;
                }

                .tip-cta.compact .tip-cta-content h4 {
                    font-size: 1rem;
                }

                .tip-cta.compact .tip-cta-content p {
                    font-size: 0.85rem;
                }

                /* Footer variant */
                .tip-cta.footer {
                    background: rgba(247, 147, 26, 0.05);
                    border-color: rgba(247, 147, 26, 0.2);
                    justify-content: center;
                    text-align: center;
                    flex-direction: column;
                    gap: 1rem;
                }

                .tip-cta.footer .tip-cta-content h4 {
                    color: #f7931a;
                }

                /* Lightning QR Modal */
                .tip-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.9);
                    display: none;
                    justify-content: center;
                    align-items: center;
                    z-index: 10002;
                    padding: 1rem;
                }

                .tip-modal-overlay.active {
                    display: flex;
                }

                .tip-modal {
                    background: #1a1a1a;
                    border: 2px solid #f7931a;
                    border-radius: 20px;
                    padding: 2rem;
                    max-width: 400px;
                    width: 100%;
                    text-align: center;
                    position: relative;
                }

                .tip-modal-close {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: none;
                    border: none;
                    color: #666;
                    font-size: 1.5rem;
                    cursor: pointer;
                }

                .tip-modal h3 {
                    color: #f7931a;
                    margin-bottom: 0.5rem;
                }

                .tip-modal p {
                    color: #999;
                    margin-bottom: 1.5rem;
                    font-size: 0.95rem;
                }

                .tip-modal-qr {
                    background: white;
                    padding: 1rem;
                    border-radius: 12px;
                    display: inline-block;
                    margin-bottom: 1rem;
                }

                .tip-modal-qr img {
                    width: 200px;
                    height: 200px;
                }

                .tip-modal-address {
                    background: #0f0f0f;
                    padding: 0.75rem;
                    border-radius: 8px;
                    font-family: monospace;
                    font-size: 0.8rem;
                    color: #f7931a;
                    word-break: break-all;
                    margin-bottom: 1rem;
                }

                .tip-modal-copy {
                    background: #2d2d2d;
                    border: none;
                    color: #e0e0e0;
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .tip-modal-copy:hover {
                    background: #3d3d3d;
                }

                .tip-amounts {
                    display: flex;
                    gap: 0.5rem;
                    justify-content: center;
                    margin-bottom: 1rem;
                    flex-wrap: wrap;
                }

                .tip-amount-btn {
                    padding: 0.5rem 1rem;
                    background: #2d2d2d;
                    border: 1px solid #3d3d3d;
                    border-radius: 8px;
                    color: #e0e0e0;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .tip-amount-btn:hover {
                    border-color: #f7931a;
                    color: #f7931a;
                }

                .tip-amount-btn.selected {
                    background: rgba(247, 147, 26, 0.2);
                    border-color: #f7931a;
                    color: #f7931a;
                }
            `;
            document.head.appendChild(styles);
        }

        /**
         * Create inline tip CTA
         * @param {string} containerId - Container element ID
         * @param {object} options - Customization options
         */
        createInline(containerId, options = {}) {
            const container = document.getElementById(containerId);
            if (!container) return;

            if (this.isDismissed && CONFIG.hideAfterDismiss) return;

            const variant = options.variant || 'default';
            const title = options.title || '💡 Found this helpful?';
            const subtitle = options.subtitle || 'Tips help us create more free Bitcoin education.';
            const location = options.location || 'inline';

            container.innerHTML = `
                <div class="tip-cta ${variant}">
                    <div class="tip-cta-icon">⚡</div>
                    <div class="tip-cta-content">
                        <h4>${title}</h4>
                        <p>${subtitle}</p>
                    </div>
                    <div class="tip-cta-actions">
                        <button class="tip-cta-btn primary" onclick="tipCTA.showTipModal('${location}')">
                            ⚡ Send a Tip
                        </button>
                        <a href="/sponsor.html" class="tip-cta-btn secondary">
                            Other Ways to Support
                        </a>
                    </div>
                </div>
            `;
        }

        /**
         * Create footer tip CTA
         * @param {string} containerId - Container element ID
         */
        createFooter(containerId) {
            this.createInline(containerId, {
                variant: 'footer',
                title: '⚡ Support Bitcoin Education',
                subtitle: 'Your tips fund new demos and keep this content free for everyone.',
                location: 'footer'
            });
        }

        /**
         * Show tip modal with Lightning options
         */
        showTipModal(location = 'modal') {
            // Track click
            if (window.bsaAnalytics) {
                window.bsaAnalytics.trackTipClick(location);
            }

            // Create modal if not exists
            let overlay = document.getElementById('tip-modal-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'tip-modal-overlay';
                overlay.className = 'tip-modal-overlay';
                overlay.innerHTML = `
                    <div class="tip-modal">
                        <button class="tip-modal-close" onclick="tipCTA.closeModal()">&times;</button>
                        <h3>⚡ Send a Tip</h3>
                        <p>Scan with any Lightning wallet or copy the address below.</p>
                        
                        <div class="tip-modal-qr">
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=lightning:${CONFIG.lightningAddress}" alt="Lightning Address QR">
                        </div>
                        
                        <div class="tip-modal-address">
                            ${CONFIG.lightningAddress}
                        </div>
                        
                        <button class="tip-modal-copy" onclick="tipCTA.copyAddress()">
                            📋 Copy Address
                        </button>
                        
                        <p style="margin-top: 1rem; font-size: 0.85rem; color: #666;">
                            Tips support new demos and free education. Thank you! 🙏
                        </p>
                    </div>
                `;
                document.body.appendChild(overlay);

                // Close on overlay click
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) this.closeModal();
                });
            }

            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        /**
         * Close tip modal
         */
        closeModal() {
            const overlay = document.getElementById('tip-modal-overlay');
            if (overlay) {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        }

        /**
         * Copy Lightning address to clipboard
         */
        copyAddress() {
            navigator.clipboard.writeText(CONFIG.lightningAddress);
            const btn = document.querySelector('.tip-modal-copy');
            if (btn) {
                btn.textContent = '✓ Copied!';
                setTimeout(() => {
                    btn.textContent = '📋 Copy Address';
                }, 2000);
            }
        }

        /**
         * Dismiss tip CTA for session
         */
        dismiss() {
            sessionStorage.setItem(CONFIG.dismissKey, 'true');
            this.isDismissed = true;
            document.querySelectorAll('.tip-cta').forEach(el => {
                el.style.display = 'none';
            });
        }

        /**
         * Auto-inject into placeholder elements
         */
        autoInject() {
            // Look for elements with data-tip-cta attribute
            document.querySelectorAll('[data-tip-cta]').forEach(el => {
                const variant = el.getAttribute('data-tip-cta') || 'default';
                if (variant === 'footer') {
                    this.createFooter(el.id);
                } else {
                    this.createInline(el.id, { variant, location: el.id });
                }
            });
        }
    }

    // Create singleton
    const tipCTA = new TipCTA();

    // Auto-inject on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => tipCTA.autoInject());
    } else {
        tipCTA.autoInject();
    }

    // Expose globally
    window.tipCTA = tipCTA;

})();
