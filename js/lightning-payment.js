/**
 * Lightning Payment Service
 * Handles sats deposits for the Apprentice tier
 * 
 * Uses @getalby/lightning-tools for invoice generation
 * Can be swapped to your own node later by changing the Lightning address
 */

(function() {
    'use strict';

    // Configuration - Change this to your Lightning address
    const CONFIG = {
        // Your Lightning address (get one free at getalby.com)
        lightningAddress: 'dulcetsurf67367@getalby.com', // TODO: Replace with your address
        
        // Deposit amount in sats
        apprenticeDeposit: 50000,
        
        // Refund percentage on completion (80% = user gets 40k back)
        refundPercentage: 0.80,
        
        // Invoice expiry in seconds (1 hour)
        invoiceExpiry: 3600,
        
        // Polling interval for payment confirmation (seconds)
        pollInterval: 3,
        
        // LocalStorage keys
        storageKeys: {
            membership: 'bsa-membership',
            depositTx: 'bsa-deposit-tx',
            completedModules: 'bsa-completed-modules',
            earnedSats: 'bsa-earned-sats'
        }
    };

    /**
     * Main Payment Service Class
     */
    class LightningPaymentService {
        constructor() {
            this.ln = null;
            this.currentInvoice = null;
            this.pollTimer = null;
            this.initialized = false;
        }

        /**
         * Initialize the service (lazy load the library)
         */
        async init() {
            if (this.initialized) return;

            // Load Alby lightning-tools from CDN
            if (!window.lightningTools) {
                await this.loadScript('https://unpkg.com/@getalby/lightning-tools@5/dist/index.browser.js');
            }

            this.initialized = true;
        }

        /**
         * Load external script
         */
        loadScript(src) {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }

        /**
         * Get current membership status
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
         * Set membership status
         */
        setMembership(tier, txData = null) {
            const membership = {
                tier,
                activated: Date.now(),
                tx: txData
            };
            localStorage.setItem(CONFIG.storageKeys.membership, JSON.stringify(membership));
            window.dispatchEvent(new CustomEvent('membershipChanged', { detail: membership }));
            return membership;
        }

        /**
         * Check if user has premium access
         */
        hasPremiumAccess() {
            const membership = this.getMembership();
            return membership.tier === 'apprentice' || membership.tier === 'sovereign';
        }

        /**
         * Create invoice for Apprentice deposit
         */
        async createApprenticeInvoice() {
            await this.init();

            try {
                // Create LightningAddress instance
                const LightningAddress = window.lightningTools?.LightningAddress || window.LightningAddress;
                
                if (!LightningAddress) {
                    throw new Error('Lightning tools not loaded');
                }

                this.ln = new LightningAddress(CONFIG.lightningAddress);
                await this.ln.fetch();

                // Request invoice
                const invoice = await this.ln.requestInvoice({
                    satoshi: CONFIG.apprenticeDeposit,
                    comment: `BSA Apprentice Deposit - ${Date.now()}`
                });

                this.currentInvoice = {
                    paymentRequest: invoice.paymentRequest,
                    paymentHash: invoice.paymentHash,
                    satoshi: CONFIG.apprenticeDeposit,
                    created: Date.now(),
                    expires: Date.now() + (CONFIG.invoiceExpiry * 1000)
                };

                return this.currentInvoice;

            } catch (error) {
                console.error('[Lightning] Invoice creation failed:', error);
                throw error;
            }
        }

        /**
         * Start polling for payment confirmation
         * Returns a promise that resolves when paid
         */
        waitForPayment(invoice, onUpdate) {
            return new Promise((resolve, reject) => {
                let attempts = 0;
                const maxAttempts = Math.floor(CONFIG.invoiceExpiry / CONFIG.pollInterval);

                const checkPayment = async () => {
                    attempts++;

                    // Check if invoice expired
                    if (Date.now() > invoice.expires) {
                        this.stopPolling();
                        reject(new Error('Invoice expired'));
                        return;
                    }

                    if (onUpdate) {
                        onUpdate({
                            status: 'waiting',
                            attempts,
                            maxAttempts,
                            remainingSeconds: Math.floor((invoice.expires - Date.now()) / 1000)
                        });
                    }

                    // For now, we use a simple verification approach
                    // In production, you'd verify via webhook or API
                    // This checks if the invoice was paid by verifying the preimage
                    try {
                        const verified = await this.verifyPayment(invoice);
                        if (verified) {
                            this.stopPolling();
                            this.setMembership('apprentice', {
                                paymentHash: invoice.paymentHash,
                                amount: invoice.satoshi,
                                paidAt: Date.now()
                            });
                            resolve({ success: true, invoice });
                            return;
                        }
                    } catch (e) {
                        // Continue polling
                    }

                    // Schedule next check
                    this.pollTimer = setTimeout(checkPayment, CONFIG.pollInterval * 1000);
                };

                checkPayment();
            });
        }

        /**
         * Verify payment (simplified - in production use webhooks)
         * For static sites, we trust the user to click "I've paid"
         * and verify on first protected content access
         */
        async verifyPayment(invoice) {
            // In a real implementation, you'd call an API endpoint
            // For now, return false to keep polling until manual confirmation
            return false;
        }

        /**
         * Manual payment confirmation (for static sites)
         * User clicks "I've paid" and we trust + verify later
         */
        confirmPaymentManually(invoice) {
            // Store the claim - can be verified later if you add a backend
            const claim = {
                paymentHash: invoice.paymentHash,
                amount: invoice.satoshi,
                claimedAt: Date.now(),
                verified: false // Flag for future verification
            };

            localStorage.setItem(CONFIG.storageKeys.depositTx, JSON.stringify(claim));
            this.setMembership('apprentice', claim);
            this.stopPolling();

            return { success: true, claim };
        }

        /**
         * Stop polling
         */
        stopPolling() {
            if (this.pollTimer) {
                clearTimeout(this.pollTimer);
                this.pollTimer = null;
            }
        }

        /**
         * Track module completion for sats earning
         */
        completeModule(moduleId) {
            const completed = this.getCompletedModules();
            
            if (!completed.includes(moduleId)) {
                completed.push(moduleId);
                localStorage.setItem(CONFIG.storageKeys.completedModules, JSON.stringify(completed));
                
                // Calculate earned sats
                const earnedPerModule = Math.floor(
                    (CONFIG.apprenticeDeposit * CONFIG.refundPercentage) / this.getTotalModules()
                );
                
                this.addEarnedSats(earnedPerModule);
                
                window.dispatchEvent(new CustomEvent('moduleCompleted', {
                    detail: { moduleId, earnedSats: earnedPerModule }
                }));
            }
        }

        /**
         * Get completed modules
         */
        getCompletedModules() {
            try {
                const data = localStorage.getItem(CONFIG.storageKeys.completedModules);
                return data ? JSON.parse(data) : [];
            } catch {
                return [];
            }
        }

        /**
         * Get total number of modules for refund calculation
         */
        getTotalModules() {
            // Adjust based on your actual module count
            return 20;
        }

        /**
         * Add earned sats
         */
        addEarnedSats(amount) {
            const current = this.getEarnedSats();
            localStorage.setItem(CONFIG.storageKeys.earnedSats, (current + amount).toString());
        }

        /**
         * Get total earned sats
         */
        getEarnedSats() {
            return parseInt(localStorage.getItem(CONFIG.storageKeys.earnedSats) || '0', 10);
        }

        /**
         * Get refund progress
         */
        getRefundProgress() {
            const membership = this.getMembership();
            if (membership.tier !== 'apprentice') {
                return null;
            }

            const completed = this.getCompletedModules().length;
            const total = this.getTotalModules();
            const maxRefund = Math.floor(CONFIG.apprenticeDeposit * CONFIG.refundPercentage);
            const earned = this.getEarnedSats();

            return {
                completedModules: completed,
                totalModules: total,
                percentComplete: Math.round((completed / total) * 100),
                earnedSats: earned,
                maxRefund,
                remainingToEarn: maxRefund - earned
            };
        }

        /**
         * Process Sovereign tier purchase ($399)
         * Opens Stripe/BTCPay checkout
         */
        async purchaseSovereign() {
            // For now, redirect to a payment page
            // You can integrate Stripe or BTCPay Server here
            const checkoutUrl = '/checkout/sovereign/';
            
            // If you have a BTCPay Server, use:
            // const checkoutUrl = 'https://your-btcpay.com/api/v1/invoices?storeId=xxx&price=399&currency=USD';
            
            window.location.href = checkoutUrl;
        }

        /**
         * Generate QR code data URL for invoice
         */
        async generateQRCode(paymentRequest) {
            // Use a simple QR library or canvas
            // For now, return a URL that can be used with QR services
            return `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(paymentRequest)}`;
        }
    }

    // Create singleton instance
    const lightningPayment = new LightningPaymentService();

    // Expose globally
    window.lightningPayment = lightningPayment;
    window.BSA_PAYMENT_CONFIG = CONFIG;

    // Export for module use
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { LightningPaymentService, CONFIG };
    }

})();
