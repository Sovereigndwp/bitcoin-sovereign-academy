/**
 * Primary KPI Tracking System
 *
 * Captures homepage conversion-funnel events (hero CTA clicks, demo previews,
 * path recommendations, scroll milestones, etc.) and routes them through the
 * shared bsaAnalytics queue defined in js/analytics.js — which batches and
 * persists to /api/track → Supabase analytics_events.
 *
 * No own batching / unload listeners / endpoints — all of that is owned by
 * js/analytics.js. This module only DECIDES which events to fire.
 */

class KPITracker {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        this.funnelSteps = {};
        this.init();
    }

    init() {
        this.trackPageLoad();
        this.setupEventListeners();
        this.trackUserBehavior();
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    trackPageLoad() {
        const loadEvent = {
            event: 'page_load',
            timestamp: Date.now(),
            url: window.location.href,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            screenSize: `${window.screen.width}x${window.screen.height}`,
            viewportSize: `${window.innerWidth}x${window.innerHeight}`,
            sessionId: this.sessionId
        };

        this.recordEvent(loadEvent);
        this.funnelSteps.homepage_visit = Date.now();

        // Track if user is returning visitor
        const isReturning = localStorage.getItem('bsa-visitor-id');
        if (!isReturning) {
            localStorage.setItem('bsa-visitor-id', this.sessionId);
            this.recordEvent({
                event: 'new_visitor',
                timestamp: Date.now(),
                sessionId: this.sessionId
            });
        } else {
            this.recordEvent({
                event: 'returning_visitor',
                timestamp: Date.now(),
                previousVisitorId: isReturning,
                sessionId: this.sessionId
            });
        }
    }

    setupEventListeners() {
        // KPI 1: Homepage → Demo Start conversion rate
        this.trackDemoStarts();
        
        // KPI 2: Demo completion rate  
        this.trackDemoCompletions();
        
        // KPI 3: Path recommendation acceptance rate
        this.trackPathRecommendations();
        
        // KPI 4: Return visitor engagement
        this.trackReturnVisitorEngagement();
        
        // Time to first meaningful action
        this.trackFirstMeaningfulAction();
    }

    trackDemoStarts() {
        // Track clicks on demo/course start buttons
        document.addEventListener('click', (e) => {
            const target = e.target;
            
            // Hero CTA clicks
            if (target.matches('.hero-primary-cta, .start-here-cta')) {
                this.recordFunnelStep('hero_cta_click', {
                    buttonText: target.textContent.trim(),
                    buttonType: target.className,
                    timeFromPageLoad: Date.now() - this.startTime
                });
            }
            
            // Featured learning cards
            if (target.closest('.featured-primary, .featured-secondary')) {
                const card = target.closest('.featured-primary, .featured-secondary');
                const cardType = card.classList.contains('featured-primary') ? 'guided_courses' : 'tools_practice';
                
                this.recordFunnelStep('featured_card_click', {
                    cardType: cardType,
                    timeFromPageLoad: Date.now() - this.startTime
                });
            }
            
            // Demo preview triggers
            if (target.matches('.demo-preview-trigger')) {
                this.recordFunnelStep('demo_preview_start', {
                    demoType: target.dataset.demo,
                    timeFromPageLoad: Date.now() - this.startTime
                });
            }
            
            // Path card clicks
            if (target.closest('.path-card')) {
                const pathCard = target.closest('.path-card');
                const pathType = this.extractPathType(pathCard);
                
                this.recordFunnelStep('path_card_click', {
                    pathType: pathType,
                    timeFromPageLoad: Date.now() - this.startTime,
                    discoveryMethod: this.getDiscoveryMethod()
                });
            }
            
            // Quick tools clicks
            if (target.matches('.quick-tool-pill')) {
                this.recordFunnelStep('quick_tool_click', {
                    toolName: target.textContent.trim(),
                    timeFromPageLoad: Date.now() - this.startTime
                });
            }
        });
    }

    trackDemoCompletions() {
        // Track demo completion events
        document.addEventListener('demo-completed', (e) => {
            this.recordFunnelStep('demo_completed', {
                demoId: e.detail.demoId,
                duration: e.detail.duration,
                completionRate: e.detail.completionRate,
                timeFromStart: Date.now() - (this.funnelSteps.demo_start || this.startTime)
            });
        });

        // Track progress indicators
        window.addEventListener('beforeunload', () => {
            const progressData = localStorage.getItem('bsa-progress');
            if (progressData) {
                const progress = JSON.parse(progressData);
                this.recordEvent({
                    event: 'session_progress_snapshot',
                    demosCompleted: progress.demosCompleted?.length || 0,
                    toolsUsed: progress.toolsUsed?.length || 0,
                    pathsStarted: progress.pathsStarted?.length || 0,
                    sessionDuration: Date.now() - this.startTime,
                    timestamp: Date.now()
                });
            }
        });
    }

    trackPathRecommendations() {
        // Track path discovery interaction
        document.addEventListener('click', (e) => {
            // Path discovery question responses
            if (e.target.matches('#question-experience .option-btn')) {
                this.recordFunnelStep('path_discovery_q1', {
                    answer: e.target.dataset.answer,
                    timeFromPageLoad: Date.now() - this.startTime
                });
            }
            
            if (e.target.matches('#question-style .option-btn')) {
                this.recordFunnelStep('path_discovery_q2', {
                    answer: e.target.dataset.answer,
                    timeFromPageLoad: Date.now() - this.startTime
                });
            }
            
            // Recommendation acceptance
            if (e.target.matches('#start-recommended')) {
                this.recordFunnelStep('path_recommendation_accepted', {
                    recommendedPath: this.getCurrentRecommendation(),
                    timeFromRecommendation: Date.now() - (this.funnelSteps.path_discovery_q2 || this.startTime)
                });
            }
            
            // Show all paths (recommendation rejected)
            if (e.target.matches('#show-all-paths')) {
                this.recordFunnelStep('path_recommendation_rejected', {
                    recommendedPath: this.getCurrentRecommendation(),
                    timeFromRecommendation: Date.now() - (this.funnelSteps.path_discovery_q2 || this.startTime)
                });
            }
        });
        
        // Track smart suggestions
        document.addEventListener('click', (e) => {
            if (e.target.matches('.notification-cta')) {
                try {
                    const suggestion = JSON.parse(e.target.dataset.suggestion);
                    this.recordFunnelStep('smart_suggestion_accepted', {
                        suggestionType: suggestion.type,
                        suggestionTitle: suggestion.title,
                        timeFromPageLoad: Date.now() - this.startTime
                    });
                } catch (error) {
                    // Ignore parsing errors
                }
            }
        });
    }

    trackReturnVisitorEngagement() {
        const isReturning = localStorage.getItem('bsa-visitor-id') !== this.sessionId;
        
        if (isReturning) {
            // Track returning visitor specific behaviors
            const lastVisit = localStorage.getItem('bsa-last-visit');
            const daysSinceLastVisit = lastVisit ? 
                Math.floor((Date.now() - parseInt(lastVisit)) / (1000 * 60 * 60 * 24)) : 0;
            
            this.recordEvent({
                event: 'returning_visitor_session',
                daysSinceLastVisit: daysSinceLastVisit,
                hasProgress: !!localStorage.getItem('bsa-progress'),
                hasProfile: !!localStorage.getItem('bsa-user-profile'),
                timestamp: Date.now()
            });
            
            // Track multiple session rate
            setTimeout(() => {
                this.recordFunnelStep('return_visitor_engagement', {
                    timeOnPage: Date.now() - this.startTime,
                    daysSinceLastVisit: daysSinceLastVisit,
                    engagementLevel: this.calculateEngagementLevel()
                });
            }, 30000); // After 30 seconds
        }
        
        // Update last visit timestamp
        localStorage.setItem('bsa-last-visit', Date.now().toString());
    }

    trackFirstMeaningfulAction() {
        const meaningfulActions = [
            'hero_cta_click',
            'demo_preview_start', 
            'path_card_click',
            'path_discovery_q1',
            'featured_card_click',
            'quick_tool_click'
        ];
        
        // Track first meaningful action
        const originalRecordStep = this.recordFunnelStep.bind(this);
        this.recordFunnelStep = (step, data) => {
            if (meaningfulActions.includes(step) && !this.funnelSteps.first_meaningful_action) {
                this.funnelSteps.first_meaningful_action = Date.now();
                this.recordEvent({
                    event: 'first_meaningful_action',
                    action: step,
                    timeFromPageLoad: Date.now() - this.startTime,
                    data: data,
                    timestamp: Date.now()
                });
            }
            return originalRecordStep(step, data);
        };
    }

    recordFunnelStep(step, data = {}) {
        this.funnelSteps[step] = Date.now();
        
        this.recordEvent({
            event: 'funnel_step',
            step: step,
            data: data,
            timestamp: Date.now(),
            sessionId: this.sessionId
        });
        
        // Calculate conversion rates for key funnels
        this.calculateConversions();
    }

    calculateConversions() {
        const conversions = {};
        
        // Homepage → Demo Start conversion
        if (this.funnelSteps.homepage_visit) {
            const demoStarts = ['hero_cta_click', 'demo_preview_start', 'featured_card_click', 'path_card_click']
                .some(step => this.funnelSteps[step]);
            
            if (demoStarts) {
                conversions.homepage_to_demo_start = true;
            }
        }
        
        // Path recommendation acceptance
        if (this.funnelSteps.path_discovery_q2 && this.funnelSteps.path_recommendation_accepted) {
            conversions.path_recommendation_accepted = true;
        }
        
        if (Object.keys(conversions).length > 0) {
            this.recordEvent({
                event: 'conversion_milestone',
                conversions: conversions,
                timestamp: Date.now()
            });
        }
    }

    recordEvent(eventData) {
        // Route through the shared analytics pipeline (js/analytics.js).
        // bsaAnalytics.track() batches and POSTs to /api/track → Supabase.
        // If bsaAnalytics isn't ready yet (race on initial page load), the
        // event is dropped — analytics.js loads with `defer` and KPITracker
        // initializes on DOMContentLoaded, so this should be rare.
        if (typeof window === 'undefined' || !window.bsaAnalytics || typeof window.bsaAnalytics.track !== 'function') {
            return;
        }
        const { event, timestamp, sessionId, ...rest } = eventData;
        window.bsaAnalytics.track(event, rest);
    }

    extractPathType(pathCard) {
        const classList = pathCard.className;
        const pathTypes = ['curious', 'skeptic', 'hurried', 'pragmatist', 'principled', 'sovereign'];
        return pathTypes.find(type => classList.includes(type)) || 'unknown';
    }

    getDiscoveryMethod() {
        if (this.funnelSteps.path_discovery_q2) return 'progressive_discovery';
        if (this.funnelSteps.path_recommendation_rejected) return 'show_all_paths';
        return 'direct_browse';
    }

    getCurrentRecommendation() {
        // Try to get current recommendation from the page
        const recommendedPath = document.querySelector('#recommended-path');
        return recommendedPath ? recommendedPath.textContent.trim() : 'unknown';
    }

    calculateEngagementLevel() {
        const timeOnPage = Date.now() - this.startTime;
        const actionCount = Object.keys(this.funnelSteps).length;
        const scrollDepth = window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight);
        
        if (timeOnPage > 120000 && actionCount >= 3 && scrollDepth > 0.5) return 'high';
        if (timeOnPage > 60000 && actionCount >= 2) return 'medium';
        return 'low';
    }

    trackUserBehavior() {
        let maxScrollDepth = 0;
        let lastScrollTime = Date.now();
        
        window.addEventListener('scroll', () => {
            const scrollDepth = window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight);
            maxScrollDepth = Math.max(maxScrollDepth, scrollDepth);
            lastScrollTime = Date.now();
        });
        
        // Track scroll milestones
        const scrollMilestones = [0.25, 0.5, 0.75, 0.9];
        scrollMilestones.forEach(milestone => {
            const checkScroll = () => {
                if (maxScrollDepth >= milestone && !this.funnelSteps[`scroll_${milestone * 100}`]) {
                    this.recordFunnelStep(`scroll_${milestone * 100}`, {
                        scrollDepth: maxScrollDepth,
                        timeFromPageLoad: Date.now() - this.startTime
                    });
                }
            };
            
            window.addEventListener('scroll', checkScroll);
        });
    }

    // Manual tracking methods for specific events
    trackDemoStart(demoId) {
        this.recordFunnelStep('demo_start', {
            demoId: demoId,
            timeFromPageLoad: Date.now() - this.startTime
        });
    }

    trackDemoComplete(demoId, duration, completionRate) {
        this.recordFunnelStep('demo_completed', {
            demoId: demoId,
            duration: duration,
            completionRate: completionRate
        });
        
        // Dispatch custom event for other systems
        window.dispatchEvent(new CustomEvent('demo-completed', {
            detail: { demoId, duration, completionRate }
        }));
    }

    // Get current session analytics summary
    getSessionSummary() {
        return {
            sessionId: this.sessionId,
            duration: Date.now() - this.startTime,
            funnelSteps: Object.keys(this.funnelSteps),
            conversions: this.getConversions()
        };
    }

    getConversions() {
        const conversions = {};
        
        // Calculate all conversion rates
        if (this.funnelSteps.homepage_visit) {
            conversions.homepageToDemoStart = !![
                'hero_cta_click', 'demo_preview_start', 'featured_card_click', 'path_card_click'
            ].find(step => this.funnelSteps[step]);
        }
        
        if (this.funnelSteps.path_discovery_q2) {
            conversions.pathRecommendationAccepted = !!this.funnelSteps.path_recommendation_accepted;
        }
        
        if (this.funnelSteps.first_meaningful_action) {
            conversions.firstActionTime = this.funnelSteps.first_meaningful_action - this.startTime;
        }
        
        return conversions;
    }
}

// Initialize KPI tracking when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.kpiTracker = new KPITracker();
    
    // Expose tracking methods globally for other scripts
    window.trackDemoStart = (demoId) => window.kpiTracker.trackDemoStart(demoId);
    window.trackDemoComplete = (demoId, duration, completionRate) => 
        window.kpiTracker.trackDemoComplete(demoId, duration, completionRate);
});

// Export for other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KPITracker;
}