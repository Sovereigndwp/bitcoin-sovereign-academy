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
        // Server-side tracking endpoint
        trackEndpoint: '/api/track',
        // Flush interval (ms) for batching server-side events
        flushIntervalMs: 10000,
        // Enable debug logging
        debug: false
    };

    class AnalyticsService {
        constructor() {
            this.sessionId = this.getOrCreateSession();
            this.queue = [];
            this.serverQueue = [];
            this.initialized = false;
            this._flushTimer = null;
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

            // Auto-fire module_started + arm module_completed heuristic if on a path module page
            this.initLearningOutcomes();

            // Start periodic server flush
            this._flushTimer = setInterval(() => this.flushToServer(), CONFIG.flushIntervalMs);

            // Flush on page unload
            window.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'hidden') this.flushToServer();
            });

            this.initialized = true;
            this.log('Analytics initialized', { sessionId: this.sessionId });
        }

        /**
         * Detect path module pages and wire module_started + module_completed events.
         * URL pattern: /paths/{pathId}/stage-{N}/module-{M}.html (or /es/module-{M}.html for Spanish).
         * module_completed fires once per session per moduleId when 80%+ scrolled AND 30s+ on page.
         */
        initLearningOutcomes() {
            const m = window.location.pathname.match(/^\/paths\/([^/]+)\/stage-(\d+)\/(?:es\/)?module-([^/.]+)/);
            if (!m) return;
            const [, pathId, stage, moduleNum] = m;
            const lang = window.location.pathname.includes('/es/') ? 'es' : 'en';
            const moduleId = `${pathId}/stage-${stage}/module-${moduleNum}${lang === 'es' ? '/es' : ''}`;

            this.track('module_started', { pathId, stage: parseInt(stage, 10), moduleNum, moduleId, lang });

            // Completion heuristic: 80% scroll depth AND ≥30s on page (per-session, fired once)
            const sessionCompletedKey = 'bsa-completed-' + this.sessionId;
            const completed = JSON.parse(sessionStorage.getItem(sessionCompletedKey) || '{}');
            if (completed[moduleId]) return; // already fired this session

            const startTs = Date.now();
            let maxScrollPct = 0;
            let armed = true;

            const checkComplete = () => {
                if (!armed) return;
                const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
                if (scrollHeight <= 0) return;
                const pct = (window.scrollY || document.documentElement.scrollTop) / scrollHeight;
                maxScrollPct = Math.max(maxScrollPct, pct);
                const elapsedMs = Date.now() - startTs;
                if (maxScrollPct >= 0.8 && elapsedMs >= 30000) {
                    armed = false;
                    completed[moduleId] = Date.now();
                    sessionStorage.setItem(sessionCompletedKey, JSON.stringify(completed));
                    this.track('module_completed', {
                        pathId, stage: parseInt(stage, 10), moduleNum, moduleId, lang,
                        timeOnPageMs: elapsedMs,
                        maxScrollPct: Math.round(maxScrollPct * 100)
                    });
                }
            };

            window.addEventListener('scroll', checkComplete, { passive: true });
            // Also check on a slow timer in case user reads without scrolling much
            setInterval(checkComplete, 5000);
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
                referrer: document.referrer || '',
                props: properties,
                ...properties
            };

            // Store locally (fallback)
            this.storeEvent(event);

            // Queue for server-side persistence
            this.serverQueue.push(event);

            // Flush immediately for revenue/conversion events
            if (['stripe_success', 'lightning_success', 'tip_success', 'email_capture'].includes(eventName)) {
                this.flushToServer();
            }

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
         * Learning-outcomes metrics — aggregates module_started, module_completed, lab_completed.
         * Returns 7d / 30d / all-time counts plus completion rate, top lists, and per-path breakdown.
         * Reads only from this user's localStorage; site-wide aggregation requires a server endpoint.
         */
        getLearningMetrics() {
            const events = this.getStoredEvents();
            const now = Date.now();
            const d7 = now - 7 * 86400000;
            const d30 = now - 30 * 86400000;

            const inWindow = (ts, since) => ts >= since;
            const byEvent = (name, since) =>
                events.filter(e => e.event === name && inWindow(e.timestamp, since));

            const moduleStarts7 = byEvent('module_started', d7);
            const moduleStarts30 = byEvent('module_started', d30);
            const moduleCompletes7 = byEvent('module_completed', d7);
            const moduleCompletes30 = byEvent('module_completed', d30);
            const labCompletes7 = byEvent('lab_completed', d7);
            const labCompletes30 = byEvent('lab_completed', d30);

            const completionRate = (starts, completes) => {
                const s = starts.length;
                if (s === 0) return null;
                return ((completes.length / s) * 100).toFixed(1) + '%';
            };

            const topN = (arr, key, n = 5) => {
                const counts = {};
                arr.forEach(e => {
                    const k = (e.props && e.props[key]) || e[key];
                    if (k) counts[k] = (counts[k] || 0) + 1;
                });
                return Object.entries(counts)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, n)
                    .map(([id, count]) => ({ id, count }));
            };

            const byPath = (events) => {
                const counts = {};
                events.forEach(e => {
                    const p = (e.props && e.props.pathId) || e.pathId;
                    if (p) counts[p] = (counts[p] || 0) + 1;
                });
                return counts;
            };

            return {
                last7Days: {
                    modulesStarted: moduleStarts7.length,
                    modulesCompleted: moduleCompletes7.length,
                    labsCompleted: labCompletes7.length,
                    moduleCompletionRate: completionRate(moduleStarts7, moduleCompletes7),
                    topModules: topN(moduleStarts7, 'moduleId'),
                    topLabs: topN(labCompletes7, 'labId'),
                    byPath: byPath(moduleStarts7)
                },
                last30Days: {
                    modulesStarted: moduleStarts30.length,
                    modulesCompleted: moduleCompletes30.length,
                    labsCompleted: labCompletes30.length,
                    moduleCompletionRate: completionRate(moduleStarts30, moduleCompletes30),
                    topModules: topN(moduleStarts30, 'moduleId'),
                    topLabs: topN(labCompletes30, 'labId'),
                    byPath: byPath(moduleStarts30)
                },
                allTime: {
                    modulesStarted: events.filter(e => e.event === 'module_started').length,
                    modulesCompleted: events.filter(e => e.event === 'module_completed').length,
                    labsCompleted: events.filter(e => e.event === 'lab_completed').length
                },
                _note: 'Local-only metrics from this device. Site-wide aggregation requires a server-side read endpoint.'
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
         * Flush queued events to server
         */
        flushToServer() {
            if (this.serverQueue.length === 0) return;

            const batch = this.serverQueue.splice(0, 25);

            try {
                const payload = JSON.stringify({ events: batch });
                // Use sendBeacon for reliability on page unload, fetch otherwise
                if (document.visibilityState === 'hidden' && navigator.sendBeacon) {
                    navigator.sendBeacon(CONFIG.trackEndpoint, new Blob([payload], { type: 'application/json' }));
                } else {
                    fetch(CONFIG.trackEndpoint, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: payload,
                        keepalive: true
                    }).catch(() => {
                        // Re-queue on failure
                        this.serverQueue.unshift(...batch);
                    });
                }
                this.log('Flushed', batch.length, 'events to server');
            } catch (e) {
                // Re-queue on error
                this.serverQueue.unshift(...batch);
                this.log('Flush failed:', e);
            }
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

        trackGateCTAClick(path) {
            this.track('gate_cta_click', { path });
        }

        trackBridgeView(bridgeId) {
            this.track('bridge_view', { bridgeId });
        }

        trackBridgeCTAClick(bridge, destination) {
            this.track('bridge_cta_click', { bridge, destination });
        }

        trackReferralShare(method) {
            this.track('referral_share', { method });
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
