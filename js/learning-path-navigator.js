/**
 * Learning Path Navigator
 * 
 * Provides persistent navigation for users to return to their learning path
 * Shows current progress and next recommended step
 * Persists across all pages
 */

(function() {
    'use strict';

    // ============================================
    // Configuration
    // ============================================

    const CONFIG = {
        storageKey: 'bsa-learning-context',
        assessmentKey: 'bsa-assessment',
        progressKey: 'bsa-progress',
        barId: 'learning-path-nav-bar',
        hidePages: ['/start/', '/my-learning/'] // Don't show on these pages
    };

    // ============================================
    // Learning Context Management
    // ============================================

    function getLearningContext() {
        try {
            const context = localStorage.getItem(CONFIG.storageKey);
            return context ? JSON.parse(context) : null;
        } catch (e) {
            return null;
        }
    }

    function saveLearningContext(context) {
        try {
            localStorage.setItem(CONFIG.storageKey, JSON.stringify(context));
        } catch (e) {
            console.warn('Could not save learning context');
        }
    }

    function updateLearningContext(currentPage) {
        const context = getLearningContext() || {};
        context.lastVisitedPage = currentPage;
        context.lastVisitedTime = new Date().toISOString();
        saveLearningContext(context);
    }

    // ============================================
    // Progress Tracking
    // ============================================

    function getProgress() {
        try {
            const progress = localStorage.getItem(CONFIG.progressKey);
            return progress ? JSON.parse(progress) : {};
        } catch (e) {
            return {};
        }
    }

    function getRecommendedPath() {
        try {
            const assessment = localStorage.getItem(CONFIG.assessmentKey);
            if (!assessment) return null;

            const answers = JSON.parse(assessment);
            
            // Simple path determination based on assessment
            const pathMapping = {
                'curious': {
                    name: 'The Curious Path',
                    color: '#4caf50',
                    next: '/paths/curious/stage-1/module-1.html',
                    dashboard: '/my-learning/'
                },
                'pragmatist': {
                    name: 'The Pragmatist Path',
                    color: '#00bcd4',
                    next: '/paths/pragmatist/stage-1/module-1.html',
                    dashboard: '/my-learning/'
                },
                'principled': {
                    name: 'The Principled Path',
                    color: '#9c27b0',
                    next: '/paths/principled/stage-1/module-1.html',
                    dashboard: '/my-learning/'
                },
                'sovereign': {
                    name: 'The Sovereign Path',
                    color: '#ff9800',
                    next: '/paths/sovereign/stage-1/module-1.html',
                    dashboard: '/my-learning/'
                },
                'hurried': {
                    name: 'The Hurried Path',
                    color: '#ffa726',
                    next: '/paths/hurried/index.html',
                    dashboard: '/my-learning/'
                }
            };

            // Determine which path based on answers (simplified)
            // In production, this would use the same logic as my-learning/index.html
            const determined = determinePrimaryPath(answers);
            return pathMapping[determined] || pathMapping['curious'];

        } catch (e) {
            return null;
        }
    }

    function determinePrimaryPath(answers) {
        // Simplified path determination
        // Real logic would mirror my-learning/index.html
        const hasAssessment = answers && Object.keys(answers).length > 0;
        if (!hasAssessment) return 'curious';

        // Default to curious for now
        // TODO: Implement proper path determination
        return 'curious';
    }

    // ============================================
    // Navigation Bar Creation
    // ============================================

    function shouldShowBar() {
        const currentPath = window.location.pathname;
        
        // Don't show on excluded pages
        if (CONFIG.hidePages.some(page => currentPath.includes(page))) {
            return false;
        }

        // Don't show on homepage
        if (currentPath === '/' || currentPath === '/index.html') {
            return false;
        }

        // Only show if user has completed assessment
        const hasAssessment = localStorage.getItem(CONFIG.assessmentKey);
        return !!hasAssessment;
    }

    function createNavigationBar() {
        // Check if already exists
        if (document.getElementById(CONFIG.barId)) {
            return;
        }

        if (!shouldShowBar()) {
            return;
        }

        const path = getRecommendedPath();
        if (!path) {
            return;
        }

        const progress = getProgress();
        const completedModules = Object.keys(progress.completed || {}).length;

        // Create bar element
        const bar = document.createElement('div');
        bar.id = CONFIG.barId;
        bar.innerHTML = `
            <div class="lpn-container">
                <div class="lpn-info">
                    <div class="lpn-path-name" style="color: ${path.color};">
                        ${path.name}
                    </div>
                    <div class="lpn-progress-text">
                        ${completedModules > 0 ? `${completedModules} completed` : 'Get started'}
                    </div>
                </div>
                <div class="lpn-actions">
                    <a href="${path.dashboard}" class="lpn-btn lpn-btn-secondary">
                        <span>📚</span> My Learning
                    </a>
                    <a href="${path.next}" class="lpn-btn lpn-btn-primary">
                        Continue Learning →
                    </a>
                    <button class="lpn-close" onclick="this.closest('#${CONFIG.barId}').remove()" aria-label="Close navigation bar">
                        ✕
                    </button>
                </div>
            </div>
        `;

        // Add styles
        addStyles();

        // Insert at top of body
        document.body.insertBefore(bar, document.body.firstChild);

        // Add body padding to prevent content overlap
        document.body.style.paddingTop = '80px';
    }

    function addStyles() {
        // Don't add if already exists
        if (document.getElementById('lpn-styles')) {
            return;
        }

        const styles = document.createElement('style');
        styles.id = 'lpn-styles';
        styles.textContent = `
            #${CONFIG.barId} {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                z-index: 9999;
                background: linear-gradient(135deg, rgba(26, 26, 26, 0.98) 0%, rgba(45, 45, 45, 0.98) 100%);
                backdrop-filter: blur(10px);
                border-bottom: 2px solid rgba(247, 147, 26, 0.3);
                padding: 1rem 2rem;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
                animation: slideDown 0.3s ease;
            }

            @keyframes slideDown {
                from {
                    transform: translateY(-100%);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }

            .lpn-container {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 2rem;
                max-width: 1400px;
                margin: 0 auto;
            }

            .lpn-info {
                display: flex;
                align-items: center;
                gap: 1rem;
            }

            .lpn-path-name {
                font-weight: 600;
                font-size: 1rem;
                white-space: nowrap;
            }

            .lpn-progress-text {
                color: #b3b3b3;
                font-size: 0.9rem;
                white-space: nowrap;
            }

            .lpn-actions {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }

            .lpn-btn {
                padding: 0.6rem 1.25rem;
                border-radius: 8px;
                font-weight: 600;
                font-size: 0.9rem;
                text-decoration: none;
                transition: all 0.3s ease;
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                white-space: nowrap;
            }

            .lpn-btn-primary {
                background: linear-gradient(135deg, #f7931a, #ffb347);
                color: white;
                box-shadow: 0 2px 10px rgba(247, 147, 26, 0.3);
            }

            .lpn-btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(247, 147, 26, 0.4);
            }

            .lpn-btn-secondary {
                background: rgba(255, 255, 255, 0.05);
                color: #e0e0e0;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .lpn-btn-secondary:hover {
                background: rgba(255, 255, 255, 0.1);
                border-color: rgba(255, 255, 255, 0.2);
            }

            .lpn-close {
                background: transparent;
                border: none;
                color: #b3b3b3;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0.5rem;
                transition: all 0.3s ease;
                margin-left: 0.5rem;
            }

            .lpn-close:hover {
                color: #f7931a;
            }

            /* Mobile Responsive */
            @media (max-width: 768px) {
                #${CONFIG.barId} {
                    padding: 1rem;
                }

                .lpn-container {
                    flex-direction: column;
                    gap: 1rem;
                    align-items: stretch;
                }

                .lpn-info {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 0.25rem;
                }

                .lpn-actions {
                    flex-direction: column;
                }

                .lpn-btn {
                    width: 100%;
                    justify-content: center;
                }

                .lpn-close {
                    position: absolute;
                    top: 0.5rem;
                    right: 0.5rem;
                }

                body {
                    padding-top: 140px !important;
                }
            }

            /* Reduced motion preference */
            @media (prefers-reduced-motion: reduce) {
                #${CONFIG.barId} {
                    animation: none;
                }
                
                .lpn-btn {
                    transition: none;
                }
            }
        `;

        document.head.appendChild(styles);
    }

    // ============================================
    // Initialization
    // ============================================

    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createNavigationBar);
        } else {
            createNavigationBar();
        }

        // Update context
        updateLearningContext(window.location.pathname);
    }

    // Run initialization
    init();

    // Export for testing
    window.LearningPathNavigator = {
        getLearningContext,
        getRecommendedPath,
        getProgress
    };

})();
