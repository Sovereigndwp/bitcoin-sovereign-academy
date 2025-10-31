(function () {
    // ============================================
    // 🔓 FULLY UNLOCKED VERSION
    // All gating disabled - all content accessible
    // ============================================

    const storageKey = 'bsa_full_access';
    const previewParam = 'unlock';
    const previewLimit = 2;

    // Preview mode for investors/demos
    const previewKey = 'UILpVhRGw62d0jPe9GPk';  // Secure key - share only with trusted parties
    const previewStorageKey = 'bsa_preview_mode';

    const alwaysOpen = new Set([
        '/paths/curious/stage-1/module-1.html',
        '/paths/builder/stage-1/module-1.html',
        '/paths/pragmatist/stage-1/module-1.html'
    ]);

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

    // 🔓 FULLY UNLOCKED - Exit early, no gating applied
    console.log('🔓 Bitcoin Sovereign Academy - Fully Unlocked Version');
    return;

    // The code below is disabled in this version
    // ============================================

    const params = new URLSearchParams(window.location.search);
    const unlockParam = params.get(previewParam);
    const previewParam_value = params.get('preview');

    // Check for preview mode
    if (previewParam_value === previewKey) {
        sessionStorage.setItem(previewStorageKey, 'active');
        showPreviewBanner();
        return; // Bypass all gating in preview mode
    } else if (previewParam_value === 'reset') {
        sessionStorage.removeItem(previewStorageKey);
    }

    // If preview mode is active, bypass gating
    if (sessionStorage.getItem(previewStorageKey) === 'active') {
        showPreviewBanner();
        return;
    }

    if (unlockParam === 'true') {
        localStorage.setItem(storageKey, 'yes');
    } else if (unlockParam === 'reset') {
        localStorage.removeItem(storageKey);
    }

    if (localStorage.getItem(storageKey) === 'yes') {
        return;
    }

    if (alwaysOpen.has(pathName)) {
        return;
    }

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
        const main = document.querySelector('main');
        if (!main) {
            return;
        }

        const sections = Array.from(main.querySelectorAll('.content-section'));
        if (sections.length <= limit) {
            return;
        }

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
            '<p>Join the Bitcoin Sovereign Academy cohort to keep going. The rest of this journey includes hands-on practice, Socratic deep dives, and mastery checkpoints.</p>',
            '<ul>',
            '<li>✔️ Full module content and interactive exercises</li>',
            '<li>✔️ Guided progression through every stage</li>',
            '<li>✔️ Access to advanced demos and tutors</li>',
            '</ul>',
            '<button type="button" class="module-lock-cta">Unlock My Path</button>',
            '<small>Already enrolled? <a href="#" class="module-lock-login">Sign in to continue</a></small>'
        ].join('');

        lockedWrapper.appendChild(innerWrapper);
        lockedWrapper.appendChild(overlay);

        const ctaButton = overlay.querySelector('.module-lock-cta');
        ctaButton.addEventListener('click', () => {
            window.location.href = '/#unlock';
        });

        const loginLink = overlay.querySelector('.module-lock-login');
        loginLink.addEventListener('click', event => {
            event.preventDefault();
            window.location.href = '/#login';
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

    function showPreviewBanner() {
        window.addEventListener('DOMContentLoaded', () => {
            // Check if banner already exists
            if (document.getElementById('preview-mode-banner')) {
                return;
            }

            // Create banner
            const banner = document.createElement('div');
            banner.id = 'preview-mode-banner';
            banner.innerHTML = `
                <div style="background: linear-gradient(135deg, #f7931a, #ffb347); color: #121212; padding: 0.75rem 1.5rem; text-align: center; font-weight: 600; position: fixed; top: 0; left: 0; right: 0; z-index: 10000; box-shadow: 0 2px 10px rgba(0,0,0,0.3);">
                    <span style="font-size: 1.1rem;">👁️ Preview Mode Active</span>
                    <span style="margin: 0 1rem; opacity: 0.7;">|</span>
                    <span style="font-size: 0.9rem;">All content unlocked for viewing</span>
                    <button onclick="sessionStorage.removeItem('bsa_preview_mode'); location.reload();" style="margin-left: 1.5rem; background: rgba(18,18,18,0.8); color: white; border: none; padding: 0.4rem 1rem; border-radius: 4px; cursor: pointer; font-size: 0.85rem; font-weight: 600;">Exit Preview</button>
                </div>
            `;

            document.body.insertBefore(banner, document.body.firstChild);

            // Add padding to body to account for banner
            document.body.style.paddingTop = '60px';
        });
    }

    window.BSAModuleGate = {
        unlock() {
            localStorage.setItem(storageKey, 'yes');
            window.location.reload();
        },
        reset() {
            localStorage.removeItem(storageKey);
            window.location.reload();
        },
        enablePreview() {
            sessionStorage.setItem(previewStorageKey, 'active');
            window.location.reload();
        },
        disablePreview() {
            sessionStorage.removeItem(previewStorageKey);
            window.location.reload();
        }
    };
})();
