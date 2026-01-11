/**
 * Module Progress Indicator
 * 
 * Automatically calculates reading time and tracks scroll progress
 * for educational modules.
 */

(function() {
    'use strict';

    // Only run on module pages
    if (!window.location.pathname.includes('/paths/') && !window.location.pathname.includes('/modules/')) {
        return;
    }

    // Constants
    const WORDS_PER_MINUTE = 200;

    function init() {
        injectStyles();
        injectProgressUI();
        calculateReadingTime();
        setupScrollTracking();
    }

    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .module-progress-sticky {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background: rgba(18, 23, 35, 0.95);
                backdrop-filter: blur(10px);
                border-bottom: 1px solid rgba(247, 147, 26, 0.2);
                z-index: 1000;
                transform: translateY(-100%);
                transition: transform 0.3s ease;
                padding: 0.75rem 1.5rem;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            }

            .module-progress-sticky.visible {
                transform: translateY(0);
            }

            .module-progress-inner {
                max-width: 1200px;
                margin: 0 auto;
                display: flex;
                align-items: center;
                gap: 1.5rem;
            }

            .module-progress-info {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 0.9rem;
            }

            .module-title-compact {
                font-weight: bold;
                color: #e6edf3;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 300px;
            }

            .progress-track {
                flex: 1;
                height: 6px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 3px;
                margin: 0 1rem;
                overflow: hidden;
            }

            .progress-fill-bar {
                height: 100%;
                background: linear-gradient(90deg, #f7931a, #ffb347);
                width: 0%;
                transition: width 0.1s linear;
            }

            .time-remaining-badge {
                background: rgba(247, 147, 26, 0.15);
                color: #f7931a;
                padding: 0.25rem 0.75rem;
                border-radius: 12px;
                font-size: 0.8rem;
                font-weight: 600;
                white-space: nowrap;
            }

            @media (max-width: 768px) {
                .module-title-compact {
                    display: none;
                }
                .module-progress-sticky {
                    padding: 0.5rem 1rem;
                    top: auto;
                    bottom: 0;
                    transform: translateY(100%);
                    border-bottom: none;
                    border-top: 1px solid rgba(247, 147, 26, 0.2);
                }
            }
        `;
        document.head.appendChild(style);
    }

    function injectProgressUI() {
        const title = document.querySelector('h1')?.textContent || 'Module Progress';
        
        const ui = document.createElement('div');
        ui.className = 'module-progress-sticky';
        ui.innerHTML = `
            <div class="module-progress-inner">
                <span class="module-title-compact">${title}</span>
                <div class="progress-track">
                    <div class="progress-fill-bar" id="progress-fill"></div>
                </div>
                <span class="time-remaining-badge" id="time-remaining">Calculating...</span>
            </div>
        `;
        document.body.appendChild(ui);
    }

    function calculateReadingTime() {
        const content = document.querySelector('main') || document.body;
        const text = content.innerText;
        const wordCount = text.trim().split(/\s+/).length;
        const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);
        
        // Update initial time
        updateTimeRemaining(minutes);
        
        // Store total minutes for recalculation
        window.moduleTotalMinutes = minutes;
    }

    function updateTimeRemaining(minutesLeft) {
        const badge = document.getElementById('time-remaining');
        if (badge) {
            badge.textContent = minutesLeft <= 1 ? 'Almost done' : `${minutesLeft} min left`;
        }
    }

    function setupScrollTracking() {
        const progressBar = document.getElementById('progress-fill');
        const stickyHeader = document.querySelector('.module-progress-sticky');
        const content = document.querySelector('main') || document.body;
        
        // Show sticky bar after scrolling past header (approx 200px)
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const docHeight = content.scrollHeight;
            
            // Calculate percentage
            // We use (docHeight - windowHeight) because you can't scroll past the bottom
            const maxScroll = docHeight - windowHeight;
            let percentage = (scrollY / maxScroll) * 100;
            percentage = Math.min(100, Math.max(0, percentage));
            
            // Update bar
            if (progressBar) {
                progressBar.style.width = `${percentage}%`;
            }
            
            // Update visibility
            if (scrollY > 300) {
                stickyHeader.classList.add('visible');
            } else {
                stickyHeader.classList.remove('visible');
            }
            
            // Recalculate remaining time
            if (window.moduleTotalMinutes) {
                const remaining = Math.ceil(window.moduleTotalMinutes * (1 - (percentage / 100)));
                updateTimeRemaining(remaining);
            }
        }, { passive: true });
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
