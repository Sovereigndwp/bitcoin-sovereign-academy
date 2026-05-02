/**
 * Smart Onboarding System
 * Provides adaptive assessment, personalized recommendations, and demo previews
 */

class SmartOnboarding {
    constructor() {
        this.userProfile = {};
        this.recommendations = [];
        this.demoPreviewsShown = 0;
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkReturningUser();
        this.setupProgressTracking();
    }

    bindEvents() {
        // Listen for learning actions
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-track-learning]')) {
                this.trackLearningAction(e.target.dataset.trackLearning);
            }
            
            if (e.target.matches('.demo-preview-trigger')) {
                this.showDemoPreview(e.target.dataset.demo);
            }
        });

        // Listen for scroll depth for engagement tracking
        this.setupScrollTracking();
    }

    checkReturningUser() {
        const userData = localStorage.getItem('bsa-user-profile');
        if (userData) {
            this.userProfile = JSON.parse(userData);
            this.showPersonalizedContent();
        } else {
            // First-time visitor - set up progressive profiling
            this.startProgressiveProfiling();
        }
    }

    startProgressiveProfiling() {
        // Track user behavior to build profile
        setTimeout(() => {
            if (this.userProfile.experience === undefined && !this.hasSeenPathDiscovery()) {
                this.showSmartPathSuggestion();
            }
        }, 30000); // 30 seconds on page
    }

    hasSeenPathDiscovery() {
        return localStorage.getItem('bsa-seen-path-discovery') === 'true';
    }

    showSmartPathSuggestion() {
        const suggestion = this.createSmartSuggestion();
        this.showNotification(suggestion);
    }

    createSmartSuggestion() {
        const scrollDepth = this.getScrollDepth();
        const timeOnPage = this.getTimeOnPage();
        
        let suggestion = {};
        
        if (scrollDepth < 0.3 && timeOnPage > 60) {
            // User is reading carefully but not scrolling much
            suggestion = {
                type: 'path',
                title: '🤔 Prefer to understand before acting?',
                description: 'Based on your reading pattern, you might enjoy our theory-first approach.',
                cta: 'Try The Principled Path',
                link: '/paths/principled/',
                color: '#8B6F47'
            };
        } else if (scrollDepth > 0.8 && timeOnPage < 30) {
            // User is scrolling quickly
            suggestion = {
                type: 'tool',
                title: '⚡ Looking for something specific?',
                description: 'Jump straight to our Bitcoin tools and calculators.',
                cta: 'Browse Tools',
                link: '/tools/',
                color: '#2196F3'
            };
        } else {
            // Default suggestion
            suggestion = {
                type: 'demo',
                title: '🎯 Want to try before committing?',
                description: 'Preview how our interactive learning works.',
                cta: 'Try Demo Preview',
                action: () => this.showDemoPreview('bitcoin-basics'),
                color: '#4CAF50'
            };
        }
        
        return suggestion;
    }

    showNotification(suggestion) {
        const notification = document.createElement('div');
        notification.className = 'smart-notification';
        notification.innerHTML = `
            <div class="smart-notification-content" style="
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                max-width: 320px;
                background: rgba(26, 26, 26, 0.95);
                border: 2px solid ${suggestion.color || '#C8922A'};
                border-radius: 1rem;
                padding: 1.5rem;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
                z-index: 1000;
                transform: translateY(100px);
                opacity: 0;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                backdrop-filter: blur(10px);
            ">
                <button class="close-notification" style="
                    position: absolute;
                    top: 0.5rem;
                    right: 0.5rem;
                    background: none;
                    border: none;
                    color: rgba(224, 224, 224, 0.6);
                    cursor: pointer;
                    font-size: 1.2rem;
                    padding: 0.25rem;
                ">&times;</button>
                
                <h4 style="
                    color: #ffffff;
                    margin-bottom: 0.75rem;
                    font-size: 1.1rem;
                ">${suggestion.title}</h4>
                
                <p style="
                    color: rgba(224, 224, 224, 0.8);
                    margin-bottom: 1rem;
                    line-height: 1.4;
                    font-size: 0.9rem;
                ">${suggestion.description}</p>
                
                <button class="notification-cta" data-suggestion='${JSON.stringify(suggestion)}' style="
                    background: ${suggestion.color || '#C8922A'};
                    color: white;
                    border: none;
                    padding: 0.6rem 1.25rem;
                    border-radius: 25px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 0.9rem;
                ">${suggestion.cta}</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.firstElementChild.style.transform = 'translateY(0)';
            notification.firstElementChild.style.opacity = '1';
        });

        // Bind events
        notification.querySelector('.close-notification').onclick = () => {
            this.hideNotification(notification);
        };

        notification.querySelector('.notification-cta').onclick = (e) => {
            const suggestionData = JSON.parse(e.target.dataset.suggestion);
            this.handleSuggestionClick(suggestionData);
            this.hideNotification(notification);
        };

        // Auto-hide after 15 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                this.hideNotification(notification);
            }
        }, 15000);
    }

    hideNotification(notification) {
        notification.firstElementChild.style.transform = 'translateY(100px)';
        notification.firstElementChild.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 400);
    }

    handleSuggestionClick(suggestion) {
        if (suggestion.action) {
            suggestion.action();
        } else if (suggestion.link) {
            window.location.href = suggestion.link;
        }

        // Track the interaction
        if (typeof track === 'function') {
            track('Smart Suggestion Clicked', {
                type: suggestion.type,
                title: suggestion.title
            });
        }
    }

    showDemoPreview(demoType) {
        const preview = this.createDemoPreview(demoType);
        this.showModal(preview);
        this.demoPreviewsShown++;
    }

    createDemoPreview(demoType) {
        const demos = {
            'bitcoin-basics': {
                title: '🪙 What is Bitcoin?',
                description: 'Interactive 2-minute demo',
                iframe: '<div style="padding: 2rem; text-align: center; background: rgba(76, 175, 80, 0.1); border-radius: 0.5rem; border: 1px solid rgba(76, 175, 80, 0.3);"><h3 style="color: #4CAF50; margin-bottom: 1rem;">Bitcoin Demo Preview</h3><p style="color: rgba(224, 224, 224, 0.8); margin-bottom: 1.5rem;">This would be an interactive demo where you learn by doing, not reading.</p><div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem;"><div style="background: rgba(200, 146, 42, 0.1); padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(200, 146, 42, 0.3);"><div style="font-size: 1.5rem; margin-bottom: 0.5rem;">⚡</div><div style="font-size: 0.8rem; color: rgba(224, 224, 224, 0.7);">Instant</div></div><div style="background: rgba(33, 150, 243, 0.1); padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(33, 150, 243, 0.3);"><div style="font-size: 1.5rem; margin-bottom: 0.5rem;">🌍</div><div style="font-size: 0.8rem; color: rgba(224, 224, 224, 0.7);">Global</div></div><div style="background: rgba(229, 57, 53, 0.1); padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(229, 57, 53, 0.3);"><div style="font-size: 1.5rem; margin-bottom: 0.5rem;">🔒</div><div style="font-size: 0.8rem; color: rgba(224, 224, 224, 0.7);">Secure</div></div></div><p style="color: rgba(224, 224, 224, 0.6); font-size: 0.85rem;">This preview shows how our interactive demos work. Real demos include hands-on practice, step-by-step guidance, and immediate feedback.</p></div>',
                fullLink: '/interactive-demos/#path-your-first-bitcoin'
            }
        };

        return demos[demoType] || demos['bitcoin-basics'];
    }

    showModal(content) {
        const modal = document.createElement('div');
        modal.className = 'demo-preview-modal';
        modal.innerHTML = `
            <div class="modal-overlay" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 2rem;
                opacity: 0;
                transition: opacity 0.3s ease;
            ">
                <div class="modal-content" style="
                    background: rgba(26, 26, 26, 0.95);
                    border: 2px solid rgba(200, 146, 42, 0.3);
                    border-radius: 1rem;
                    max-width: 600px;
                    width: 100%;
                    max-height: 80vh;
                    overflow-y: auto;
                    position: relative;
                    transform: scale(0.9);
                    transition: transform 0.3s ease;
                    backdrop-filter: blur(15px);
                ">
                    <button class="close-modal" style="
                        position: absolute;
                        top: 1rem;
                        right: 1rem;
                        background: none;
                        border: none;
                        color: rgba(224, 224, 224, 0.6);
                        cursor: pointer;
                        font-size: 1.5rem;
                        z-index: 1;
                        padding: 0.25rem;
                    ">&times;</button>
                    
                    <div style="padding: 2rem;">
                        <h3 style="
                            color: #ffffff;
                            margin-bottom: 0.5rem;
                            font-size: 1.4rem;
                        ">${content.title}</h3>
                        
                        <p style="
                            color: rgba(224, 224, 224, 0.7);
                            margin-bottom: 2rem;
                            font-size: 0.9rem;
                        ">${content.description}</p>
                        
                        <div class="demo-iframe-container">
                            ${content.iframe}
                        </div>
                        
                        <div style="
                            display: flex;
                            gap: 1rem;
                            justify-content: center;
                            margin-top: 2rem;
                            flex-wrap: wrap;
                        ">
                            <a href="${content.fullLink}" style="
                                background: #C8922A;
                                color: white;
                                text-decoration: none;
                                padding: 0.75rem 1.5rem;
                                border-radius: 25px;
                                font-weight: 600;
                                transition: all 0.3s ease;
                            ">Start Full Course</a>
                            
                            <button class="close-modal-btn" style="
                                background: transparent;
                                border: 1px solid rgba(224, 224, 224, 0.3);
                                color: rgba(224, 224, 224, 0.8);
                                padding: 0.75rem 1.5rem;
                                border-radius: 25px;
                                cursor: pointer;
                                transition: all 0.3s ease;
                            ">Close Preview</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Animate in
        requestAnimationFrame(() => {
            modal.querySelector('.modal-overlay').style.opacity = '1';
            modal.querySelector('.modal-content').style.transform = 'scale(1)';
        });

        // Bind close events
        modal.querySelector('.close-modal').onclick = () => this.hideModal(modal);
        modal.querySelector('.close-modal-btn').onclick = () => this.hideModal(modal);
        modal.querySelector('.modal-overlay').onclick = (e) => {
            if (e.target === modal.querySelector('.modal-overlay')) {
                this.hideModal(modal);
            }
        };

        // Escape key
        document.addEventListener('keydown', function escapeHandler(e) {
            if (e.key === 'Escape') {
                document.removeEventListener('keydown', escapeHandler);
                this.hideModal(modal);
            }
        });
    }

    hideModal(modal) {
        modal.querySelector('.modal-overlay').style.opacity = '0';
        modal.querySelector('.modal-content').style.transform = 'scale(0.9)';
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, 300);
    }

    setupScrollTracking() {
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
            maxScroll = Math.max(maxScroll, scrollPercent);
        });

        this.getScrollDepth = () => maxScroll;
    }

    setupProgressTracking() {
        this.startTime = Date.now();
        this.getTimeOnPage = () => (Date.now() - this.startTime) / 1000;
    }

    trackLearningAction(action) {
        if (!this.userProfile.actions) {
            this.userProfile.actions = [];
        }
        
        this.userProfile.actions.push({
            action,
            timestamp: Date.now()
        });

        this.saveUserProfile();
        this.updateRecommendations();
    }

    updateRecommendations() {
        // Analyze user behavior to improve recommendations
        const actions = this.userProfile.actions || [];
        
        if (actions.length >= 3) {
            this.generateAdvancedRecommendations();
        }
    }

    generateAdvancedRecommendations() {
        const actions = this.userProfile.actions || [];
        const recentActions = actions.slice(-5);
        
        // Analyze action patterns
        const toolActions = recentActions.filter(a => a.action.includes('tool')).length;
        const courseActions = recentActions.filter(a => a.action.includes('course')).length;
        const theoryActions = recentActions.filter(a => a.action.includes('theory')).length;

        let recommendation = {};
        
        if (toolActions > courseActions && toolActions > theoryActions) {
            recommendation = {
                type: 'Advanced Tools',
                message: 'You seem to love hands-on tools! Try our Security Risk Simulator.',
                link: '/interactive-demos/security-risk-simulator.html'
            };
        } else if (theoryActions > toolActions) {
            recommendation = {
                type: 'Deep Dive',
                message: 'Ready for deeper theory? Explore Bitcoin philosophy.',
                link: '/deep-dives/philosophy-economics/'
            };
        }

        if (recommendation.type) {
            this.showAdvancedRecommendation(recommendation);
        }
    }

    showAdvancedRecommendation(rec) {
        // Only show if user hasn't seen too many suggestions
        if (this.demoPreviewsShown < 3) {
            setTimeout(() => {
                this.showNotification({
                    title: `🎯 ${rec.type} Suggestion`,
                    description: rec.message,
                    cta: 'Check it out',
                    link: rec.link,
                    color: '#9C27B0'
                });
            }, 5000);
        }
    }

    saveUserProfile() {
        localStorage.setItem('bsa-user-profile', JSON.stringify(this.userProfile));
    }

    showPersonalizedContent() {
        // Show returning user content
        const returningUserDiv = document.getElementById('returning-user-link');
        if (returningUserDiv && this.userProfile.lastPath) {
            returningUserDiv.style.display = 'block';
            returningUserDiv.innerHTML = `
                <a href="/my-learning/" style="color: rgba(200, 146, 42, 0.8); text-decoration: none; font-size: 0.9rem;">
                    ← Continue ${this.userProfile.lastPath} Path
                </a>
            `;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.smartOnboarding = new SmartOnboarding();
});

// Export for other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SmartOnboarding;
}