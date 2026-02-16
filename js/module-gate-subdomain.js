/**
 * Module Gating with Subdomain Integration
 *
 * This version works with subdomain-access-control.js to provide
 * content gating based on the subdomain being accessed
 */

(function () {
    'use strict';

    // ============================================
    // Configuration Check (Highest Priority)
    // ============================================

    // Check configuration for full access or disabled gating
    if (window.BSA_CONFIG?.FULL_ACCESS || !window.BSA_CONFIG?.ENABLE_MODULE_GATING) {
        if (window.BSA_CONFIG?.DEBUG) {
            console.log('[Module Gate Subdomain] Gating disabled by configuration');
        }
        return; // Bypass all gating logic
    }

    const previewLimit = window.BSA_CONFIG?.FREE_MODULES_LIMIT || 2; // Number of free sections before gate (for allowed modules)

    const pathName = normalizePath(window.location.pathname);

    // Only Stage 1, Module 1 is free for all paths
    const alwaysOpen = new Set([
        '/paths/curious/stage-1/module-1.html',
        '/paths/builder/stage-1/module-1.html',
        '/paths/pragmatist/stage-1/module-1.html',
        '/paths/principled/stage-1/module-1.html',
        '/paths/sovereign/stage-1/module-1.html',
        '/paths/observer/stage-1/module-1.html',
        '/paths/hurried/stage-1/module-1.html'
    ]);

    // Everything beyond Stage 1, Module 1 should be completely locked
    const shouldLockEntireModule = !alwaysOpen.has(pathName);

    // Advanced modules that should be gated
    const advancedModules = [
        '/modules/cbdc-vs-bitcoin.html'
    ];

    const isAdvancedModule = advancedModules.some(path => pathName.endsWith(path));
    const isPathModule = /\/module-\d+\.html$/.test(pathName);

    if (!isPathModule && !isAdvancedModule) {
        return;
    }

    // ============================================
    // Check subdomain access control
    // ============================================

    function checkSubdomainAccess() {
        // Wait for subdomain access control to initialize
        if (typeof window.BSASubdomainAccess !== 'undefined') {
            const accessLevel = window.BSASubdomainAccess.getAccessLevel();

            // If user has full access or preview access, bypass gating
            if (window.BSASubdomainAccess.hasFullAccess() ||
                window.BSASubdomainAccess.hasPreviewAccess()) {
                console.log('✅ Subdomain access detected - bypassing module gate');
                return true;
            }

            // Public access - apply gating
            return false;
        }

        // Fallback: check if we're on a member/preview subdomain directly
        const hostname = window.location.hostname.toLowerCase();
        if (hostname.includes('learn.') || hostname.includes('preview.') ||
            hostname === 'localhost') {
            console.log('✅ Access subdomain detected - bypassing module gate');
            return true;
        }

        return false;
    }

    // ============================================
    // Legacy parameter-based access (backwards compatibility)
    // ============================================

    const params = new URLSearchParams(window.location.search);
    const unlockParam = params.get('unlock');
    const previewParam = params.get('preview');
    const storageKey = 'bsa_full_access';

    if (unlockParam === 'true') {
        localStorage.setItem(storageKey, 'yes');
    } else if (unlockParam === 'reset') {
        localStorage.removeItem(storageKey);
    }

    if (localStorage.getItem(storageKey) === 'yes') {
        console.log('✅ Legacy unlock parameter detected');
        return;
    }

    if (previewParam === 'demo2024' || previewParam === 'UILpVhRGw62d0jPe9GPk') {
        console.log('✅ Legacy preview key detected');
        return;
    }

    // ============================================
    // Check subdomain access
    // ============================================

    if (checkSubdomainAccess()) {
        return; // Bypass gating
    }

    // ============================================
    // Check if module is always open
    // ============================================

    if (alwaysOpen.has(pathName)) {
        return;
    }

    // ============================================
    // Apply content gating
    // ============================================

    window.addEventListener('DOMContentLoaded', () => {
        if (shouldLockEntireModule) {
            // Lock the ENTIRE module (no preview sections)
            lockEntireModule();
        } else {
            // Show first 2 sections, then gate (for Stage 1, Module 1)
            applyGate(previewLimit);
        }
    });

    function normalizePath(path) {
        if (!path.startsWith('/')) {
            return '/' + path;
        }
        return path;
    }

    function lockEntireModule() {
        console.log('🔒 Locking entire module - this is not Stage 1, Module 1');

        // Hide entire page content and show upgrade message
        const container = document.querySelector('main') || document.querySelector('.container') || document.body;

        // Create full-page lock overlay
        const lockOverlay = document.createElement('div');
        lockOverlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.95);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        `;

        lockOverlay.innerHTML = `
            <div style="max-width: 500px; text-align: center; color: white; font-family: system-ui;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🔒</div>
                <h2 style="font-size: 2rem; margin: 0 0 1rem; color: #f7931a;">Module Locked</h2>
                <p style="font-size: 1.1rem; color: #e0e0e0; line-height: 1.6; margin-bottom: 2rem;">
                    This module is available to Bitcoin Sovereign Academy members.
                    <br><br>
                    <strong>Free Access:</strong> Stage 1, Module 1 of each path
                </p>
                <div style="display: flex; flex-direction: column; gap: 1rem; align-items: center;">
                    <a href="https://learn.bitcoinsovereign.academy${window.location.pathname}"
                       style="display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: white; text-decoration: none; font-weight: 600; font-size: 1.1rem; padding: 1rem 2rem; border-radius: 999px; transition: transform 0.2s;">
                        Access as Member →
                    </a>
                    <a href="/"
                       style="display: inline-block; color: #f7931a; text-decoration: none; font-weight: 600; padding: 0.75rem 1.5rem; border: 2px solid #f7931a; border-radius: 999px;">
                        ← Back to Home
                    </a>
                    <p style="color: #888; font-size: 0.9rem; margin-top: 1rem;">
                        Not a member? <a href="/#unlock" style="color: #f7931a; text-decoration: underline;">Join now</a>
                    </p>
                </div>
            </div>
        `;

        document.body.appendChild(lockOverlay);
    }

    function applyGate(limit) {
        // Try to find main tag, but fallback to entire document if not found
        const container = document.querySelector('main') || document.body;
        if (!container) {
            console.warn('No container found for gating');
            return;
        }

        const sections = Array.from(container.querySelectorAll('.content-section'));
        if (sections.length <= limit) {
            console.log(`Only ${sections.length} sections found, no gating needed (limit: ${limit})`);
            return;
        }

        console.log(`Applying gate: ${sections.length} sections found, locking ${sections.length - limit}`);

        injectStyles();

        const lockedSections = sections.slice(limit);
        if (!lockedSections.length) {
            return;
        }

        // Show warning before the section that PRECEDES the lock
        const warningIndex = Math.max(0, limit - 1);
        if (sections[warningIndex]) {
            showUpcomingGateWarning(sections[warningIndex]);
        }

        const lockedWrapper = document.createElement('div');
        lockedWrapper.className = 'module-locked-zone';

        const innerWrapper = document.createElement('div');
        innerWrapper.className = 'module-locked-inner';

        const firstLocked = lockedSections[0];
        const parentNode = firstLocked.parentNode;
        parentNode.insertBefore(lockedWrapper, firstLocked);

        lockedSections.forEach(section => {
            innerWrapper.appendChild(section);
        });

        const overlay = document.createElement('div');
        overlay.className = 'module-lock-overlay';
        
        // Dynamic content based on path
        const pathName = getPathName();
        const completedSections = limit;
        const totalSections = sections.length;
        const remainingSections = totalSections - completedSections;
        
        overlay.innerHTML = `
            <div class="lock-overlay-content">
                <div class="lock-icon">🔐</div>
                <h3>Continue Your ${pathName} Journey</h3>
                <p class="lock-subtitle">
                    You've explored ${completedSections} sections.
                    ${remainingSections} more chapters await.
                </p>

                <div class="unlock-preview">
                    <h4>What's Next in This Module:</h4>
                    <ul class="preview-topics">
                        <li>
                            <span class="topic-icon">📖</span>
                            <span>Interactive Demonstrations</span>
                        </li>
                        <li>
                            <span class="topic-icon">🧠</span>
                            <span>Knowledge Check & Quiz</span>
                        </li>
                        <li>
                            <span class="topic-icon">🛠️</span>
                            <span>Practical Exercises</span>
                        </li>
                    </ul>
                </div>

                <div class="social-proof">
                    <div class="testimonial">
                        <div class="stars">⭐⭐⭐⭐⭐</div>
                        <p>"Best Bitcoin course I've taken. Worth every satoshi!"</p>
                    </div>
                    <div class="stats">
                        <span>✓ 2,847 students enrolled</span>
                    </div>
                </div>

                <div class="pricing-preview">
                    <span class="price-detail">One-time payment • Lifetime access</span>
                </div>

                <button type="button" class="module-lock-cta">
                    Unlock Full Access
                </button>

                <div class="lock-footer">
                    <small>Already enrolled? <a href="https://learn.bitcoinsovereign.academy${window.location.pathname}" class="module-lock-login">Sign in</a></small>
                </div>
            </div>
        `;

        lockedWrapper.appendChild(innerWrapper);
        lockedWrapper.appendChild(overlay);

        const ctaButton = overlay.querySelector('.module-lock-cta');
        ctaButton.addEventListener('click', () => {
            window.location.href = '/#unlock';
        });
    }

    function getPathName() {
        const path = window.location.pathname;
        if (path.includes('curious')) return 'Curious Path';
        if (path.includes('builder')) return 'Builder Path';
        if (path.includes('sovereign')) return 'Sovereign Path';
        if (path.includes('principled')) return 'Principled Path';
        if (path.includes('pragmatist')) return 'Pragmatist Path';
        if (path.includes('observer')) return 'Observer Path';
        if (path.includes('hurried')) return 'Hurried Path';
        return 'Bitcoin';
    }

    function showUpcomingGateWarning(targetElement) {
        if (!targetElement || targetElement.querySelector('.gate-warning')) return;

        const warning = document.createElement('div');
        warning.className = 'gate-warning';
        warning.innerHTML = `
            <div class="warning-content">
                <div class="warning-header">
                    <span class="warning-icon">🔓</span>
                    <h4>One more free section, then...</h4>
                </div>
                <p>The next sections dive deeper into Bitcoin's technical architecture.</p>
                <div class="warning-cta-area">
                    <a href="/#pricing" class="warning-cta-small">View Pricing</a>
                    <small>One-time payment • No subscription</small>
                </div>
            </div>
        `;
        
        targetElement.parentNode.insertBefore(warning, targetElement);
    }

    function injectStyles() {
        if (document.getElementById('module-gate-styles')) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'module-gate-styles';
        style.textContent = `
            .module-locked-zone {
                position: relative;
                margin-top: 2rem;
                padding: 2rem 0;
            }
            .module-locked-inner {
                filter: blur(6px);
                pointer-events: none;
                user-select: none;
                opacity: 0.35;
                transform: scale(0.98);
                transition: opacity 0.3s ease;
            }
            .module-lock-overlay {
                position: absolute;
                inset: 10%;
                margin: auto;
                max-width: 520px;
                padding: 2rem;
                background: rgba(18, 18, 18, 0.95);
                border: 1px solid rgba(247, 147, 26, 0.65);
                border-radius: 16px;
                display: flex;
                flex-direction: column;
                gap: 1.15rem;
                align-items: stretch;
                justify-content: center;
                text-align: center;
                box-shadow: 0 20px 45px rgba(0, 0, 0, 0.45);
            }
            .module-lock-overlay h3 {
                font-size: 1.6rem;
                color: #f7931a;
                margin: 0;
            }
            .module-lock-overlay p {
                margin: 0;
                color: #e0e0e0;
                line-height: 1.55;
            }
            .module-lock-overlay ul {
                list-style: none;
                margin: 0;
                padding: 0;
                color: #e0e0e0;
                display: grid;
                gap: 0.35rem;
            }
            .module-lock-overlay li {
                font-size: 0.95rem;
            }
            .module-lock-cta {
                background: linear-gradient(135deg, #f7931a, #ffb347);
                color: #121212;
                font-weight: 700;
                border: none;
                border-radius: 999px;
                padding: 0.9rem 1.5rem;
                cursor: pointer;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
            }
            .module-lock-cta:hover {
                transform: translateY(-1px);
                box-shadow: 0 12px 25px rgba(247, 147, 26, 0.35);
            }
            .module-lock-overlay small {
                font-size: 0.8rem;
                color: #b0bec5;
            }
            .module-lock-overlay a {
                color: #f7931a;
                text-decoration: underline;
            }
            
            /* Gate Warning Banner */
            .gate-warning {
                background: rgba(45, 45, 45, 0.6);
                border: 1px dashed rgba(247, 147, 26, 0.4);
                border-radius: 12px;
                padding: 1.5rem;
                margin-bottom: 2rem;
                display: flex;
                align-items: center;
                gap: 1.5rem;
            }
            .gate-warning .warning-content {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                width: 100%;
            }
            .gate-warning .warning-header {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            .gate-warning h4 {
                margin: 0;
                color: #e0e0e0;
                font-size: 1.1rem;
            }
            .gate-warning p {
                margin: 0;
                color: #9aa4b2;
                font-size: 0.95rem;
            }
            .gate-warning .warning-cta-area {
                display: flex;
                align-items: center;
                gap: 1rem;
                margin-top: 0.5rem;
            }
            .warning-cta-small {
                color: #f7931a;
                font-weight: bold;
                text-decoration: none;
                border: 1px solid #f7931a;
                padding: 0.4rem 1rem;
                border-radius: 20px;
                font-size: 0.9rem;
                transition: all 0.2s;
            }
            .warning-cta-small:hover {
                background: rgba(247, 147, 26, 0.1);
            }
            .gate-warning small {
                color: #666;
                font-size: 0.85rem;
            }

            /* Enhanced Lock Overlay */
            .lock-icon {
                font-size: 3.5rem;
                margin-bottom: 1rem;
                animation: float 3s ease-in-out infinite;
            }
            @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
            .lock-subtitle {
                font-size: 1.1rem;
                margin-bottom: 2rem;
                opacity: 0.9;
            }
            .unlock-preview {
                background: rgba(255, 255, 255, 0.05);
                padding: 1.5rem;
                border-radius: 12px;
                margin-bottom: 2rem;
                text-align: left;
            }
            .unlock-preview h4 {
                color: #f7931a;
                margin: 0 0 1rem 0;
                font-size: 1rem;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            .preview-topics {
                list-style: none;
                padding: 0;
                margin: 0;
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
            }
            .preview-topics li {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                color: #e0e0e0;
                font-size: 1rem;
            }
            .topic-icon {
                font-size: 1.2rem;
            }
            .social-proof {
                margin-bottom: 2rem;
                padding-bottom: 1.5rem;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            .testimonial p {
                font-style: italic;
                color: #ccc;
                margin: 0.5rem 0 0;
            }
            .stats span {
                display: inline-block;
                background: rgba(16, 185, 129, 0.2);
                color: #10b981;
                padding: 0.25rem 0.75rem;
                border-radius: 12px;
                font-size: 0.85rem;
                font-weight: bold;
                margin-top: 1rem;
            }
            .pricing-preview {
                margin-bottom: 1.5rem;
            }
            .price-detail {
                color: #f7931a;
                font-weight: bold;
                font-size: 1.1rem;
            }
            .lock-footer {
                margin-top: 1.5rem;
            }

            @media (max-width: 768px) {
                .gate-warning {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 1rem;
                }
                .module-lock-overlay {
                    inset: 1rem;
                    padding: 1.5rem;
                    max-height: 90vh;
                    overflow-y: auto;
                }
            }
        `;

        document.head.appendChild(style);
    }

    window.BSAModuleGate = {
        unlock() {
            localStorage.setItem(storageKey, 'yes');
            window.location.reload();
        },
        reset() {
            localStorage.removeItem(storageKey);
            window.location.reload();
        }
    };
})();
