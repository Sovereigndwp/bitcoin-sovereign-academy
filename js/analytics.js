/**
 * BSA Analytics Service
 * Lightweight event tracking for funnel analytics
 * 
 * Events are stored locally and can be exported to Notion/Plausible later.
 * No external dependencies, privacy-first approach.
 */

(function() {
    'use strict';

    const CONFIG = {
        storageKey: 'bsa-analytics-events',
        sessionKey: 'bsa-session',
        maxStoredEvents: 500,
        // Enable debug logging
        debug: false
    };

    class AnalyticsService {
        constructor() {
            this.sessionId = this.getOrCreateSession();
            this.queue = [];
            this.initialized = false;
        }

        /**
         * Initialize analytics (call on page load)
         */
        init() {
            if (this.initialized) return;

            // Track page view
            this.track('page_view', {
                path: window.location.pathname,
                referrer: document.referrer || 'direct'
            });

            this.initialized = true;
            this.log('Analytics initialized', { sessionId: this.sessionId });
        }

        /**
         * Get or create session ID
         */
        getOrCreateSession() {
            let session = sessionStorage.getItem(CONFIG.sessionKey);
            if (!session) {
                session = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                sessionStorage.setItem(CONFIG.sessionKey, session);
            }
            return session;
        }

        /**
         * Track an event
         * @param {string} eventName - Name of the event
         * @param {object} properties - Additional properties
         */
        track(eventName, properties = {}) {
            const event = {
                event: eventName,
                timestamp: Date.now(),
                sessionId: this.sessionId,
                path: window.location.pathname,
                ...properties
            };

            // Store locally
            this.storeEvent(event);

            // Dispatch custom event for real-time listeners
            window.dispatchEvent(new CustomEvent('bsa:analytics', { detail: event }));

            this.log('Event tracked:', event);
        }

        /**
         * Store event in localStorage
         */
        storeEvent(event) {
            try {
                const events = this.getStoredEvents();
                events.push(event);

                // Keep only recent events
                if (events.length > CONFIG.maxStoredEvents) {
                    events.splice(0, events.length - CONFIG.maxStoredEvents);
                }

                localStorage.setItem(CONFIG.storageKey, JSON.stringify(events));
            } catch (e) {
                this.log('Failed to store event:', e);
            }
        }

        /**
         * Get stored events
         */
        getStoredEvents() {
            try {
                const data = localStorage.getItem(CONFIG.storageKey);
                return data ? JSON.parse(data) : [];
            } catch {
                return [];
            }
        }

        /**
         * Get events filtered by type
         */
        getEventsByType(eventName) {
            return this.getStoredEvents().filter(e => e.event === eventName);
        }

        /**
         * Get funnel metrics
         */
        getFunnelMetrics() {
            const events = this.getStoredEvents();
            const now = Date.now();
            const last7Days = now - (7 * 24 * 60 * 60 * 1000);
            const last30Days = now - (30 * 24 * 60 * 60 * 1000);

            const recentEvents = events.filter(e => e.timestamp > last7Days);
            const monthlyEvents = events.filter(e => e.timestamp > last30Days);

            const count = (arr, type) => arr.filter(e => e.event === type).length;

            return {
                last7Days: {
                    pageViews: count(recentEvents, 'page_view'),
                    gateViews: count(recentEvents, 'gate_view'),
                    membershipClicks: count(recentEvents, 'membership_click'),
                    stripeSuccess: count(recentEvents, 'stripe_success'),
                    lightningSuccess: count(recentEvents, 'lightning_success'),
                    tipClicks: count(recentEvents, 'tip_click'),
                    tipSuccess: count(recentEvents, 'tip_success'),
                    emailCaptures: count(recentEvents, 'email_capture')
                },
                last30Days: {
                    pageViews: count(monthlyEvents, 'page_view'),
                    gateViews: count(monthlyEvents, 'gate_view'),
                    membershipClicks: count(monthlyEvents, 'membership_click'),
                    stripeSuccess: count(monthlyEvents, 'stripe_success'),
                    lightningSuccess: count(monthlyEvents, 'lightning_success'),
                    tipClicks: count(monthlyEvents, 'tip_click'),
                    tipSuccess: count(monthlyEvents, 'tip_success'),
                    emailCaptures: count(monthlyEvents, 'email_capture')
                },
                conversions: {
                    gateToClick: recentEvents.length > 0 
                        ? (count(recentEvents, 'membership_click') / Math.max(count(recentEvents, 'gate_view'), 1) * 100).toFixed(1) + '%'
                        : 'N/A',
                    clickToPurchase: recentEvents.length > 0
                        ? ((count(recentEvents, 'stripe_success') + count(recentEvents, 'lightning_success')) / Math.max(count(recentEvents, 'membership_click'), 1) * 100).toFixed(1) + '%'
                        : 'N/A'
                }
            };
        }

        /**
         * Export events as JSON (for Notion/external tools)
         */
        exportEvents() {
            return JSON.stringify(this.getStoredEvents(), null, 2);
        }

        /**
         * Export events as CSV
         */
        exportCSV() {
            const events = this.getStoredEvents();
            if (events.length === 0) return '';

            const headers = ['timestamp', 'event', 'sessionId', 'path'];
            const rows = events.map(e => [
                new Date(e.timestamp).toISOString(),
                e.event,
                e.sessionId,
                e.path
            ]);

            return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        }

        /**
         * Clear stored events
         */
        clearEvents() {
            localStorage.removeItem(CONFIG.storageKey);
        }

        /**
         * Debug logging
         */
        log(...args) {
            if (CONFIG.debug) {
                console.log('[BSA Analytics]', ...args);
            }
        }

        // ========== Specific Event Helpers ==========

        trackGateView(pagePath) {
            this.track('gate_view', { pagePath });
        }

        trackMembershipClick(tier, source) {
            this.track('membership_click', { tier, source });
        }

        trackStripeSuccess(referenceId) {
            this.track('stripe_success', { referenceId });
        }

        trackLightningSuccess(paymentHash, amount) {
            this.track('lightning_success', { paymentHash, amount });
        }

        trackMembershipSet(tier, method) {
            this.track('membership_set', { tier, method });
        }

        trackTipClick(location) {
            this.track('tip_click', { location });
        }

        trackTipSuccess(amount, method) {
            this.track('tip_success', { amount, method });
        }

        trackEmailCapture(source) {
            this.track('email_capture', { source });
        }

        trackDemoView(demoId) {
            this.track('demo_view', { demoId });
        }

        trackModuleComplete(moduleId) {
            this.track('module_complete', { moduleId });
        }
    }

    // Create singleton
    const analytics = new AnalyticsService();

    // Auto-init on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => analytics.init());
    } else {
        analytics.init();
    }

    // Expose globally
    window.bsaAnalytics = analytics;

    // Export for module use
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { AnalyticsService };
    }

})();
