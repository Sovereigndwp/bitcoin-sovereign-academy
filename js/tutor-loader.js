/**
 * Unified Tutor Loader
 * Include this single script on any page to enable the AI tutor
 * with automatic context detection.
 * 
 * Usage: <script src="/js/tutor-loader.js"></script>
 */

(function() {
    'use strict';

    // Paths to tutor dependencies
    const TUTOR_SCRIPTS = [
        '/js/gemini-service.js',
        '/js/gemini-tutor-ui.js'
    ];

    // Check if tutor is already loaded
    if (window.geminiTutorUI || window.__tutorLoading) {
        return;
    }
    window.__tutorLoading = true;

    /**
     * Load a script and return a promise
     */
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            // Check if already loaded
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = resolve;
            script.onerror = () => reject(new Error(`Failed to load ${src}`));
            document.head.appendChild(script);
        });
    }

    /**
     * Initialize the tutor after scripts are loaded
     */
    async function initTutor() {
        try {
            // Load scripts sequentially (service must load before UI)
            for (const script of TUTOR_SCRIPTS) {
                await loadScript(script);
            }

            // Tutor is now available globally
            delete window.__tutorLoading;
            
            // Dispatch event for other scripts that might be waiting
            window.dispatchEvent(new CustomEvent('tutorReady', {
                detail: { tutor: window.geminiTutorUI }
            }));

        } catch (error) {
            console.error('[TutorLoader] Failed to load tutor:', error);
            delete window.__tutorLoading;
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTutor);
    } else {
        initTutor();
    }

    // ===== DEMO INTEGRATION HELPERS =====

    /**
     * Create an "Ask AI" button that can be placed near demos
     * @param {string} question - Pre-filled question for context
     * @param {object} options - Button options
     */
    window.createAskAIButton = function(question, options = {}) {
        const {
            text = '🤖 Ask AI Tutor',
            style = 'inline', // 'inline' or 'floating'
            autoSend = false,
            className = ''
        } = options;

        const button = document.createElement('button');
        button.className = `ask-ai-btn ${className}`;
        button.innerHTML = text;
        button.setAttribute('aria-label', `Ask AI: ${question}`);

        // Apply styles based on type
        if (style === 'floating') {
            button.style.cssText = `
                position: absolute;
                top: 10px;
                right: 10px;
                padding: 8px 16px;
                background: linear-gradient(135deg, #f7931a 0%, #ffb347 100%);
                color: white;
                border: none;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                box-shadow: 0 2px 8px rgba(247, 147, 26, 0.4);
                transition: all 0.2s ease;
                z-index: 100;
            `;
        } else {
            button.style.cssText = `
                padding: 8px 16px;
                background: rgba(247, 147, 26, 0.1);
                color: #f7931a;
                border: 1px solid rgba(247, 147, 26, 0.3);
                border-radius: 8px;
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
            `;
        }

        // Hover effects
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-1px)';
            button.style.boxShadow = style === 'floating' 
                ? '0 4px 12px rgba(247, 147, 26, 0.5)'
                : '0 2px 8px rgba(247, 147, 26, 0.3)';
        });
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = style === 'floating'
                ? '0 2px 8px rgba(247, 147, 26, 0.4)'
                : 'none';
        });

        // Click handler
        button.addEventListener('click', () => {
            // Wait for tutor to be ready if needed
            if (window.geminiTutorUI) {
                window.geminiTutorUI.askQuestion(question, autoSend);
            } else {
                window.addEventListener('tutorReady', () => {
                    window.geminiTutorUI.askQuestion(question, autoSend);
                }, { once: true });
            }
        });

        return button;
    };

    /**
     * Add contextual "Ask AI" buttons to common demo elements
     * Call this after your demo is initialized
     */
    window.addDemoAIButtons = function(demoContainer, contextQuestions = []) {
        if (!demoContainer) return;

        // Make container position relative if not already
        const computedStyle = window.getComputedStyle(demoContainer);
        if (computedStyle.position === 'static') {
            demoContainer.style.position = 'relative';
        }

        // Add floating button to demo container
        const defaultQuestion = contextQuestions[0] || 'Can you explain what I\'m seeing in this demo?';
        const floatingBtn = window.createAskAIButton(defaultQuestion, {
            text: '💡 Ask AI',
            style: 'floating',
            autoSend: false
        });
        demoContainer.appendChild(floatingBtn);

        // Add inline question buttons if provided
        if (contextQuestions.length > 1) {
            const questionContainer = document.createElement('div');
            questionContainer.className = 'ai-question-bar';
            questionContainer.style.cssText = `
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
                margin-top: 16px;
                padding: 12px;
                background: rgba(247, 147, 26, 0.05);
                border-radius: 8px;
                border: 1px solid rgba(247, 147, 26, 0.1);
            `;

            const label = document.createElement('span');
            label.textContent = '🎓 Learn more:';
            label.style.cssText = 'font-size: 12px; color: #999; margin-right: 8px;';
            questionContainer.appendChild(label);

            contextQuestions.forEach(q => {
                const btn = window.createAskAIButton(q, {
                    text: q,
                    style: 'inline'
                });
                questionContainer.appendChild(btn);
            });

            demoContainer.parentNode.insertBefore(questionContainer, demoContainer.nextSibling);
        }
    };

})();
