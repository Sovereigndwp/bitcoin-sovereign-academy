/**
 * Bitcoin Sovereign Academy - Navigation Context Manager
 * 
 * Tracks where learners came from when they visit deep-dives, tools, or demos,
 * enabling them to easily return to their learning path.
 * 
 * @version 1.0.0
 * @description Provides "Return to your path" navigation across the platform
 */

class NavigationContextManager {
    constructor() {
        this.STORAGE_KEY = 'bsa-navigation-context';
        this.CONTEXT_EXPIRY = 2 * 60 * 60 * 1000; // 2 hours (increased from 30 min)
        
        // Path display names
        this.PATH_NAMES = {
            'curious': 'The Curious Path',
            'principled': 'The Principled Path',
            'hurried': 'The Hurried Path',
            'pragmatist': 'The Pragmatist Path',
            'builder': 'The Builder Path',
            'sovereign': 'The Sovereign Path',
            'skeptic': 'The Skeptic Path',
            'observer': 'The Observer Path'
        };
        
        this.demoStartTime = null;
        this.hasScrolledToBottom = false;
    }

    /**
     * Save the current navigation context
     * Call this when navigating away from a path module
     * 
     * @param {Object} context - The context to save
     * @param {string} context.pathId - The learning path (curious, principled, etc.)
     * @param {number} context.stage - The current stage number
     * @param {number} context.module - The current module number
     * @param {string} context.title - The page title for display
     * @param {string} context.returnUrl - Full URL to return to
     */
    saveContext(context) {
        try {
            const data = {
                ...context,
                savedAt: Date.now(),
                expiresAt: Date.now() + this.CONTEXT_EXPIRY
            };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
            console.log('[NavContext] Saved:', data);
        } catch (error) {
            console.warn('[NavContext] Failed to save context:', error);
        }
    }

    /**
     * Get the saved navigation context
     * Returns null if expired or not found
     * 
     * @returns {Object|null} The saved context or null
     */
    getContext() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            if (!data) return null;
            
            const context = JSON.parse(data);
            
            // Check expiry
            if (Date.now() > context.expiresAt) {
                this.clearContext();
                return null;
            }
            
            return context;
        } catch (error) {
            console.warn('[NavContext] Failed to get context:', error);
            return null;
        }
    }

    /**
     * Clear the saved context
     */
    clearContext() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
        } catch (error) {
            console.warn('[NavContext] Failed to clear context:', error);
        }
    }

    /**
     * Detect the current page's path context from URL
     * @returns {Object|null} Context object or null
     */
    detectCurrentPathContext() {
        const path = window.location.pathname;
        
        // Match patterns like /paths/curious/stage-1/module-2.html
        const pathMatch = path.match(/\/paths\/([^\/]+)\/stage-(\d+)\/(?:module-(\d+)|index)/);
        
        if (pathMatch) {
            const [, pathId, stage, module] = pathMatch;
            return {
                pathId,
                stage: parseInt(stage),
                module: module ? parseInt(module) : 0,
                title: this.PATH_NAMES[pathId] || `${pathId} Path`,
                returnUrl: window.location.href
            };
        }
        
        return null;
    }

    /**
     * Auto-save context if we're on a path page
     * Call this on path module pages
     */
    autoSaveIfOnPath() {
        const context = this.detectCurrentPathContext();
        if (context) {
            this.saveContext(context);
        }
    }

    /**
     * Get a formatted display string for the return link
     * @returns {string|null} Display text or null
     */
    getReturnLinkText() {
        const context = this.getContext();
        if (!context) return null;
        
        const pathName = this.PATH_NAMES[context.pathId] || context.pathId;
        
        if (context.module && context.module > 0) {
            return `← Return to ${pathName}: Stage ${context.stage}, Module ${context.module}`;
        } else {
            return `← Return to ${pathName}: Stage ${context.stage}`;
        }
    }

    /**
     * Create and inject the return navigation bar
     * Call this on deep-dive, demo, and tool pages
     * 
     * @param {string} position - 'top' or 'floating' (default: 'floating')
     */
    injectReturnNav(position = 'floating') {
        const context = this.getContext();
        if (!context) return;
        
        // Don't show on path pages themselves
        if (window.location.pathname.startsWith('/paths/')) return;
        
        // Track demo start time for completion detection
        this.demoStartTime = Date.now();
        
        // Create the nav element
        const nav = document.createElement('div');
        nav.className = `bsa-return-nav bsa-return-nav--${position}`;
        nav.id = 'bsa-return-nav';
        nav.innerHTML = `
            <a href="${context.returnUrl}" class="bsa-return-nav__link">
                <span class="bsa-return-nav__icon">↩</span>
                <span class="bsa-return-nav__text">${this.getReturnLinkText()}</span>
            </a>
            <button class="bsa-return-nav__dismiss" aria-label="Dismiss" title="Dismiss">×</button>
        `;
        
        // Add dismiss functionality
        nav.querySelector('.bsa-return-nav__dismiss').addEventListener('click', (e) => {
            e.preventDefault();
            nav.classList.add('bsa-return-nav--hidden');
            setTimeout(() => nav.remove(), 300);
        });
        
        // Inject styles if not already present
        if (!document.getElementById('bsa-return-nav-styles')) {
            const styles = document.createElement('style');
            styles.id = 'bsa-return-nav-styles';
            styles.textContent = this.getStyles();
            document.head.appendChild(styles);
        }
        
        // Add to page
        if (position === 'top') {
            document.body.insertBefore(nav, document.body.firstChild);
        } else {
            document.body.appendChild(nav);
        }
        
        // Animate in
        requestAnimationFrame(() => {
            nav.classList.add('bsa-return-nav--visible');
        });
        
        // Setup completion detection
        this.setupCompletionDetection(context);
    }
    
    /**
     * Setup detection for when user has likely "completed" the demo
     * Shows a more prominent return prompt
     */
    setupCompletionDetection(context) {
        const self = this;
        
        // Detect scroll to bottom
        const checkScrollBottom = () => {
            const scrollHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY;
            const clientHeight = window.innerHeight;
            
            // Within 200px of bottom
            if (scrollTop + clientHeight >= scrollHeight - 200) {
                if (!self.hasScrolledToBottom) {
                    self.hasScrolledToBottom = true;
                    // Show completion prompt after scrolling to bottom + 3 seconds
                    setTimeout(() => {
                        self.showCompletionPrompt(context);
                    }, 3000);
                }
            }
        };
        
        window.addEventListener('scroll', checkScrollBottom, { passive: true });
        
        // Also show completion prompt after spending 2+ minutes on the demo
        setTimeout(() => {
            if (!document.getElementById('bsa-completion-prompt')) {
                self.showCompletionPrompt(context);
            }
        }, 2 * 60 * 1000);
    }
    
    /**
     * Show a more prominent completion prompt
     */
    showCompletionPrompt(context) {
        // Don't show if already dismissed or if floating nav was dismissed
        if (document.getElementById('bsa-completion-prompt')) return;
        if (!document.getElementById('bsa-return-nav')) return;
        
        const pathName = this.PATH_NAMES[context.pathId] || context.pathId;
        
        const prompt = document.createElement('div');
        prompt.id = 'bsa-completion-prompt';
        prompt.className = 'bsa-completion-prompt';
        prompt.innerHTML = `
            <div class="bsa-completion-prompt__content">
                <div class="bsa-completion-prompt__icon">✓</div>
                <div class="bsa-completion-prompt__text">
                    <strong>Ready to continue your journey?</strong>
                    <span>Return to ${pathName}</span>
                </div>
                <a href="${context.returnUrl}" class="bsa-completion-prompt__btn">
                    Continue Path →
                </a>
                <button class="bsa-completion-prompt__dismiss" aria-label="Dismiss">×</button>
            </div>
        `;
        
        prompt.querySelector('.bsa-completion-prompt__dismiss').addEventListener('click', (e) => {
            e.preventDefault();
            prompt.classList.add('bsa-completion-prompt--hidden');
            setTimeout(() => prompt.remove(), 300);
        });
        
        document.body.appendChild(prompt);
        
        requestAnimationFrame(() => {
            prompt.classList.add('bsa-completion-prompt--visible');
        });
    }

    /**
     * Get the CSS styles for the return nav
     * @returns {string} CSS styles
     */
    getStyles() {
        return `
            .bsa-return-nav {
                position: fixed;
                z-index: 9999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.3s ease, transform 0.3s ease;
            }
            
            .bsa-return-nav--visible {
                opacity: 1;
                transform: translateY(0);
            }
            
            .bsa-return-nav--hidden {
                opacity: 0;
                transform: translateY(20px);
            }
            
            .bsa-return-nav--floating {
                bottom: 24px;
                left: 24px;
                right: auto;
                max-width: calc(100vw - 48px);
            }
            
            .bsa-return-nav--top {
                top: 0;
                left: 0;
                right: 0;
                bottom: auto;
            }
            
            .bsa-return-nav--floating .bsa-return-nav__link {
                display: inline-flex;
                align-items: center;
                gap: 0.75rem;
                padding: 1rem 1.5rem;
                background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
                border: 2px solid #f7931a;
                border-radius: 50px;
                color: #f7931a;
                text-decoration: none;
                font-weight: 600;
                font-size: 0.95rem;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 16px rgba(247, 147, 26, 0.2);
                transition: all 0.3s ease;
            }
            
            .bsa-return-nav--floating .bsa-return-nav__link:hover {
                background: linear-gradient(135deg, #f7931a 0%, #ff8c00 100%);
                color: white;
                transform: translateY(-2px);
                box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5), 0 0 24px rgba(247, 147, 26, 0.4);
            }
            
            .bsa-return-nav--top .bsa-return-nav__link {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.75rem;
                padding: 0.75rem 2rem;
                background: linear-gradient(135deg, #f7931a 0%, #ff8c00 100%);
                color: white;
                text-decoration: none;
                font-weight: 600;
                font-size: 0.9rem;
                transition: all 0.3s ease;
            }
            
            .bsa-return-nav--top .bsa-return-nav__link:hover {
                background: linear-gradient(135deg, #ff8c00 0%, #f7931a 100%);
            }
            
            .bsa-return-nav__icon {
                font-size: 1.2rem;
                line-height: 1;
            }
            
            .bsa-return-nav__dismiss {
                position: absolute;
                top: -8px;
                right: -8px;
                width: 24px;
                height: 24px;
                background: #333;
                border: 2px solid #555;
                border-radius: 50%;
                color: #999;
                font-size: 14px;
                line-height: 1;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            }
            
            .bsa-return-nav__dismiss:hover {
                background: #f44336;
                border-color: #f44336;
                color: white;
            }
            
            .bsa-return-nav--top .bsa-return-nav__dismiss {
                top: 50%;
                right: 1rem;
                transform: translateY(-50%);
            }
            
            @media (max-width: 768px) {
                .bsa-return-nav--floating {
                    bottom: 16px;
                    left: 16px;
                    right: 16px;
                    max-width: none;
                }
                
                .bsa-return-nav--floating .bsa-return-nav__link {
                    width: 100%;
                    justify-content: center;
                    padding: 1rem;
                    font-size: 0.9rem;
                    border-radius: 12px;
                }
                
                .bsa-return-nav__text {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
            
            /* Respect reduced motion */
            @media (prefers-reduced-motion: reduce) {
                .bsa-return-nav,
                .bsa-completion-prompt {
                    transition: none;
                }
            }
            
            /* Completion Prompt Styles */
            .bsa-completion-prompt {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                z-index: 10000;
                background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
                border-top: 3px solid #f7931a;
                padding: 1rem 1.5rem;
                opacity: 0;
                transform: translateY(100%);
                transition: opacity 0.4s ease, transform 0.4s ease;
                box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.5);
            }
            
            .bsa-completion-prompt--visible {
                opacity: 1;
                transform: translateY(0);
            }
            
            .bsa-completion-prompt--hidden {
                opacity: 0;
                transform: translateY(100%);
            }
            
            .bsa-completion-prompt__content {
                max-width: 800px;
                margin: 0 auto;
                display: flex;
                align-items: center;
                gap: 1rem;
                flex-wrap: wrap;
                justify-content: center;
            }
            
            .bsa-completion-prompt__icon {
                width: 48px;
                height: 48px;
                background: linear-gradient(135deg, #4caf50, #66bb6a);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                color: white;
                flex-shrink: 0;
            }
            
            .bsa-completion-prompt__text {
                flex: 1;
                min-width: 200px;
            }
            
            .bsa-completion-prompt__text strong {
                display: block;
                color: #fff;
                font-size: 1.1rem;
                margin-bottom: 0.25rem;
            }
            
            .bsa-completion-prompt__text span {
                color: #b3b3b3;
                font-size: 0.95rem;
            }
            
            .bsa-completion-prompt__btn {
                padding: 0.875rem 2rem;
                background: linear-gradient(135deg, #f7931a 0%, #ff8c00 100%);
                color: white;
                text-decoration: none;
                border-radius: 50px;
                font-weight: 700;
                font-size: 1rem;
                box-shadow: 0 4px 16px rgba(247, 147, 26, 0.4);
                transition: all 0.3s ease;
                white-space: nowrap;
            }
            
            .bsa-completion-prompt__btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 24px rgba(247, 147, 26, 0.5);
            }
            
            .bsa-completion-prompt__dismiss {
                position: absolute;
                top: 0.5rem;
                right: 0.5rem;
                width: 28px;
                height: 28px;
                background: transparent;
                border: none;
                color: #666;
                font-size: 1.2rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: color 0.2s ease;
            }
            
            .bsa-completion-prompt__dismiss:hover {
                color: #f44336;
            }
            
            @media (max-width: 600px) {
                .bsa-completion-prompt__content {
                    flex-direction: column;
                    text-align: center;
                }
                
                .bsa-completion-prompt__btn {
                    width: 100%;
                }
            }
        `;
    }
}

// Create singleton instance
window.NavigationContext = window.NavigationContext || new NavigationContextManager();

// Auto-initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // On path pages, auto-save context
    if (window.location.pathname.startsWith('/paths/')) {
        window.NavigationContext.autoSaveIfOnPath();
    }
    
    // On deep-dive/demo/tool pages, inject return nav
    const isDeepDive = window.location.pathname.includes('/deep-dives/') ||
                       window.location.pathname.includes('/interactive-demos/') ||
                       window.location.pathname.includes('/demos/');
    
    if (isDeepDive) {
        // Slight delay to let page render first
        setTimeout(() => {
            window.NavigationContext.injectReturnNav('floating');
        }, 500);
    }
});
