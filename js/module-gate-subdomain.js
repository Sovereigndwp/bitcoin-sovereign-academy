/**
 * Module Gating with Subdomain Integration
 *
 * This version works with subdomain-access-control.js to provide
 * content gating based on the subdomain being accessed
 */

(function () {
    'use strict';

    const previewLimit = 2; // Number of free sections before gate

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

    const pathName = normalizePath(window.location.pathname);

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
            hostname === 'localhost' || hostname.includes('vercel.app')) {
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
        applyGate(previewLimit);
    });

    function normalizePath(path) {
        if (!path.startsWith('/')) {
            return '/' + path;
        }
        return path;
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
        overlay.innerHTML = [
            '<h3>Unlock the Full Module</h3>',
            '<p>Join the Bitcoin Sovereign Academy to continue. Get full access to all modules, interactive exercises, and advanced demos.</p>',
            '<ul>',
            '<li>✔️ Full module content and interactive exercises</li>',
            '<li>✔️ Guided progression through every stage</li>',
            '<li>✔️ Access to advanced demos and tools</li>',
            '</ul>',
            '<button type="button" class="module-lock-cta">Unlock Full Access</button>',
            '<small>Already a member? <a href="https://learn.bitcoinsovereign.academy' + window.location.pathname + '">Access member site</a></small>'
        ].join('');

        lockedWrapper.appendChild(innerWrapper);
        lockedWrapper.appendChild(overlay);

        const ctaButton = overlay.querySelector('.module-lock-cta');
        ctaButton.addEventListener('click', () => {
            window.location.href = '/#unlock';
        });
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
            @media (max-width: 768px) {
                .module-lock-overlay {
                    inset: 5%;
                    padding: 1.5rem;
                }
                .module-lock-overlay h3 {
                    font-size: 1.3rem;
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
