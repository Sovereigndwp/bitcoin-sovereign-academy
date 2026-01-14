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
        this.CONTEXT_EXPIRY = 30 * 60 * 1000; // 30 minutes
        
        // Path display names
        this.PATH_NAMES = {
            'curious': 'The Curious Path',
            'principled': 'The Principled Path',
            'hurried': 'The Hurried Path',
            'pragmatist': 'The Pragmatist Path',
            'builder': 'The Builder Path',
            'sovereign': 'The Sovereign Path'
        };
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
        
        // Create the nav element
        const nav = document.createElement('div');
        nav.className = `bsa-return-nav bsa-return-nav--${position}`;
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
                .bsa-return-nav {
                    transition: none;
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
