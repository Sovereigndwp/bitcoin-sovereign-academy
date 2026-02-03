/**
 * Email Capture Component
 * Lightweight newsletter signup with localStorage storage for export
 * 
 * Features:
 * - Inline and modal capture formats
 * - Tracks captures in analytics
 * - Stores emails locally for Substack/ESP export
 * - Respects privacy (no third-party tracking)
 */

(function() {
    'use strict';

    const CONFIG = {
        // Substack URL for form submission (optional - leave blank for local-only)
        substackUrl: 'https://btcdalia.substack.com/subscribe',
        
        // Storage key for captured emails
        storageKey: 'bsa-email-captures',
        
        // Don't show capture to users who already submitted
        hideAfterCapture: true,
        
        // Delay before showing modal (ms) - 0 to disable auto-modal
        modalDelay: 0,
        
        // Show on exit intent (desktop only)
        exitIntent: false
    };

    class EmailCapture {
        constructor() {
            this.hasSubmitted = this.checkIfSubmitted();
            this.injectStyles();
        }

        /**
         * Check if user already submitted email
         */
        checkIfSubmitted() {
            return localStorage.getItem('bsa-email-submitted') === 'true';
        }

        /**
         * Inject component styles
         */
        injectStyles() {
            if (document.getElementById('email-capture-styles')) return;

            const styles = document.createElement('style');
            styles.id = 'email-capture-styles';
            styles.textContent = `
                .email-capture-inline {
                    background: linear-gradient(135deg, rgba(247, 147, 26, 0.1) 0%, rgba(247, 147, 26, 0.05) 100%);
                    border: 2px solid rgba(247, 147, 26, 0.25);
                    border-radius: 16px;
                    padding: 1.5rem 2rem;
                    margin: 2rem 0;
                    text-align: center;
                }

                .email-capture-inline h3 {
                    color: #f7931a;
                    font-size: 1.25rem;
                    margin-bottom: 0.5rem;
                }

                .email-capture-inline p {
                    color: #999;
                    font-size: 0.95rem;
                    margin-bottom: 1rem;
                }

                .email-capture-form {
                    display: flex;
                    gap: 0.75rem;
                    justify-content: center;
                    flex-wrap: wrap;
                    max-width: 500px;
                    margin: 0 auto;
                }

                .email-capture-form input[type="email"] {
                    flex: 1;
                    min-width: 200px;
                    padding: 0.75rem 1rem;
                    border: 2px solid #2d2d2d;
                    border-radius: 10px;
                    background: #1a1a1a;
                    color: #e0e0e0;
                    font-size: 1rem;
                }

                .email-capture-form input[type="email"]:focus {
                    outline: none;
                    border-color: #f7931a;
                }

                .email-capture-form button {
                    padding: 0.75rem 1.5rem;
                    background: linear-gradient(135deg, #f7931a 0%, #ffb347 100%);
                    color: #000;
                    border: none;
                    border-radius: 10px;
                    font-weight: 700;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .email-capture-form button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(247, 147, 26, 0.4);
                }

                .email-capture-privacy {
                    font-size: 0.8rem;
                    color: #666;
                    margin-top: 0.75rem;
                }

                .email-capture-privacy a {
                    color: #f7931a;
                }

                .email-capture-success {
                    color: #4CAF50;
                    font-weight: 600;
                    padding: 1rem;
                }

                /* Modal variant */
                .email-capture-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.85);
                    display: none;
                    justify-content: center;
                    align-items: center;
                    z-index: 10001;
                    padding: 1rem;
                }

                .email-capture-modal-overlay.active {
                    display: flex;
                }

                .email-capture-modal {
                    background: #1a1a1a;
                    border: 2px solid #f7931a;
                    border-radius: 20px;
                    padding: 2.5rem;
                    max-width: 480px;
                    width: 100%;
                    position: relative;
                    text-align: center;
                }

                .email-capture-modal-close {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: none;
                    border: none;
                    color: #666;
                    font-size: 1.5rem;
                    cursor: pointer;
                }

                .email-capture-modal h3 {
                    color: #f7931a;
                    font-size: 1.5rem;
                    margin-bottom: 0.75rem;
                }

                .email-capture-modal p {
                    color: #999;
                    margin-bottom: 1.5rem;
                }
            `;
            document.head.appendChild(styles);
        }

        /**
         * Create inline capture component
         * @param {string} containerId - ID of container element
         * @param {object} options - Customization options
         */
        createInline(containerId, options = {}) {
            const container = document.getElementById(containerId);
            if (!container) return;

            if (this.hasSubmitted && CONFIG.hideAfterCapture) {
                container.style.display = 'none';
                return;
            }

            const title = options.title || '📬 Stay Updated';
            const subtitle = options.subtitle || 'Get weekly Bitcoin insights and new demo announcements. No spam, ever.';
            const buttonText = options.buttonText || 'Subscribe';
            const source = options.source || 'inline';

            container.innerHTML = `
                <div class="email-capture-inline">
                    <h3>${title}</h3>
                    <p>${subtitle}</p>
                    <form class="email-capture-form" onsubmit="emailCapture.handleSubmit(event, '${source}')">
                        <input type="email" name="email" placeholder="your@email.com" required>
                        <button type="submit">${buttonText}</button>
                    </form>
                    <p class="email-capture-privacy">
                        No spam. Unsubscribe anytime. <a href="/privacy.html">Privacy Policy</a>
                    </p>
                </div>
            `;
        }

        /**
         * Show modal capture
         * @param {object} options - Customization options
         */
        showModal(options = {}) {
            if (this.hasSubmitted && CONFIG.hideAfterCapture) return;

            const title = options.title || '🎓 Level Up Your Bitcoin Knowledge';
            const subtitle = options.subtitle || 'Join thousands learning Bitcoin the right way. Weekly insights, new demos, and zero hype.';
            const buttonText = options.buttonText || 'Join Free';
            const source = options.source || 'modal';

            // Create modal if not exists
            let overlay = document.getElementById('email-capture-modal-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'email-capture-modal-overlay';
                overlay.className = 'email-capture-modal-overlay';
                overlay.innerHTML = `
                    <div class="email-capture-modal">
                        <button class="email-capture-modal-close" onclick="emailCapture.closeModal()">&times;</button>
                        <h3>${title}</h3>
                        <p>${subtitle}</p>
                        <form class="email-capture-form" onsubmit="emailCapture.handleSubmit(event, '${source}')">
                            <input type="email" name="email" placeholder="your@email.com" required>
                            <button type="submit">${buttonText}</button>
                        </form>
                        <p class="email-capture-privacy">
                            No spam. Unsubscribe anytime. <a href="/privacy.html">Privacy Policy</a>
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
         * Close modal
         */
        closeModal() {
            const overlay = document.getElementById('email-capture-modal-overlay');
            if (overlay) {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        }

        /**
         * Handle form submission
         */
        handleSubmit(event, source = 'unknown') {
            event.preventDefault();
            
            const form = event.target;
            const emailInput = form.querySelector('input[type="email"]');
            const email = emailInput.value.trim();

            if (!email || !this.isValidEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            // Store locally
            this.storeEmail(email, source);

            // Track analytics
            if (window.bsaAnalytics) {
                window.bsaAnalytics.trackEmailCapture(source);
            }

            // Mark as submitted
            localStorage.setItem('bsa-email-submitted', 'true');
            this.hasSubmitted = true;

            // Show success
            const container = form.closest('.email-capture-inline, .email-capture-modal');
            if (container) {
                container.innerHTML = `
                    <div class="email-capture-success">
                        ✓ Thanks for subscribing! Check your inbox to confirm.
                    </div>
                `;
            }

            // Close modal if open
            setTimeout(() => this.closeModal(), 2000);

            // If Substack URL is configured, also submit there
            if (CONFIG.substackUrl) {
                this.submitToSubstack(email);
            }
        }

        /**
         * Validate email format
         */
        isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        /**
         * Store email in localStorage for export
         */
        storeEmail(email, source) {
            try {
                const captures = this.getStoredEmails();
                captures.push({
                    email,
                    source,
                    timestamp: Date.now(),
                    page: window.location.pathname
                });
                localStorage.setItem(CONFIG.storageKey, JSON.stringify(captures));
            } catch (e) {
                console.error('[EmailCapture] Storage error:', e);
            }
        }

        /**
         * Get stored emails
         */
        getStoredEmails() {
            try {
                const data = localStorage.getItem(CONFIG.storageKey);
                return data ? JSON.parse(data) : [];
            } catch {
                return [];
            }
        }

        /**
         * Export emails as CSV
         */
        exportCSV() {
            const emails = this.getStoredEmails();
            if (emails.length === 0) return '';

            const headers = ['email', 'source', 'timestamp', 'page'];
            const rows = emails.map(e => [
                e.email,
                e.source,
                new Date(e.timestamp).toISOString(),
                e.page
            ]);

            return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        }

        /**
         * Submit to Substack (opens in new window)
         */
        submitToSubstack(email) {
            // Create a hidden form to submit to Substack
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = CONFIG.substackUrl;
            form.target = '_blank';
            form.style.display = 'none';

            const input = document.createElement('input');
            input.type = 'email';
            input.name = 'email';
            input.value = email;
            form.appendChild(input);

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
        }

        /**
         * Auto-inject into placeholder elements
         */
        autoInject() {
            // Look for elements with data-email-capture attribute
            document.querySelectorAll('[data-email-capture]').forEach(el => {
                const source = el.getAttribute('data-email-capture') || 'auto';
                const title = el.getAttribute('data-title');
                const subtitle = el.getAttribute('data-subtitle');
                const buttonText = el.getAttribute('data-button');

                this.createInline(el.id, { source, title, subtitle, buttonText });
            });
        }
    }

    // Create singleton
    const emailCapture = new EmailCapture();

    // Auto-inject on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => emailCapture.autoInject());
    } else {
        emailCapture.autoInject();
    }

    // Expose globally
    window.emailCapture = emailCapture;

})();
