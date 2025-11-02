/**
 * Bitcoin Sovereign Academy - Main Script
 * Handles homepage interactions and functionality
 */

(function() {
    'use strict';

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        console.log('🚀 Bitcoin Sovereign Academy - Homepage Loaded');

        // Add smooth scrolling to anchor links
        setupSmoothScrolling();

        // Initialize any interactive elements
        setupInteractiveElements();
    }

    /**
     * Set up smooth scrolling for anchor links
     */
    function setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    /**
     * Set up interactive elements (buttons, cards, etc.)
     */
    function setupInteractiveElements() {
        // Add hover effects to path cards if needed
        const pathCards = document.querySelectorAll('.path-card, .featured-card');
        pathCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px)';
            });
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });

        // Handle CTA button clicks
        const ctaButtons = document.querySelectorAll('[data-action="start-learning"]');
        ctaButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                const path = this.getAttribute('data-path');
                if (path) {
                    console.log(`Starting learning path: ${path}`);
                    // Navigation handled by href attribute
                }
            });
        });
    }

    // Export global utility functions if needed
    window.BSAHomepage = {
        scrollTo: function(elementId) {
            const element = document.getElementById(elementId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

})();
