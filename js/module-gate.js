(function () {
    // ============================================
    // Configuration Check (Highest Priority)
    // ============================================

    // Check configuration for full access or disabled gating
    if (window.BSA_CONFIG?.FULL_ACCESS || !window.BSA_CONFIG?.ENABLE_MODULE_GATING) {
        if (window.BSA_CONFIG?.DEBUG) {
            console.log('[Module Gate] Gating disabled by configuration');
        }
        return; // Bypass all gating logic
    }


    // ============================================
    // Preview Key Unlock (for private sharing)
    // ============================================
    const PREVIEW_KEYS = {
        'dalia-beta-2026': { expires: '2026-12-31' }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const urlKey = urlParams.get('preview');

    const urlParams = new URLSearchParams(window.location.search);
    const urlKey = urlParams.get('preview');
    if (urlKey && PREVIEW_KEYS[urlKey]) {
        const expiry = PREVIEW_KEYS[urlKey].expires;
        if (new Date(expiry) > new Date()) {
            localStorage.setItem('bsa_preview_unlock', urlKey);
            localStorage.setItem('bsa_preview_expires', expiry);
            console.log('🔓 Preview access granted until ' + expiry);
        }
    }

    const storedKey = localStorage.getItem('bsa_preview_unlock');
    const storedExpiry = localStorage.getItem('bsa_preview_expires');
    if (storedKey && storedExpiry && new Date(storedExpiry) > new Date()) {
        return;
    } else if (storedKey) {
        localStorage.removeItem('bsa_preview_unlock');
        localStorage.removeItem('bsa_preview_expires');
    }

    const previewLimit = window.BSA_CONFIG?.FREE_MODULES_LIMIT || 2;

    const pathName = normalizePath(window.location.pathname);

    // Only Stage 1, Module 1 is free for all paths
    const alwaysOpen = new Set([
        '/paths/curious/stage-1/module-1.html',
        '/paths/builder/stage-1/module-1.html',
        '/paths/pragmatist/stage-1/module-1.html',
        '/paths/principled/stage-1/module-1.html',
        '/paths/sovereign/stage-1/module-1.html',
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

    clearLegacyAccessState();

    if (shouldDeferToServer()) {
        return;
    }

    if (alwaysOpen.has(pathName)) {
        return;
    }

    window.addEventListener('DOMContentLoaded', () => {
        void initializeGate();
    });

    function normalizePath(path) {
        if (!path.startsWith('/')) {
            return '/' + path;
        }
        return path;
    }

    function getAccessVerifier() {
        if (window.BSAAccessVerifier) {
            return window.BSAAccessVerifier;
        }

        window.BSAAccessVerifier = {
            getStoredToken() {
                return localStorage.getItem('bsa_access_token') ||
                    localStorage.getItem('bsa_jwt_token');
            },
            clearStoredToken() {
                localStorage.removeItem('bsa_access_token');
                localStorage.removeItem('bsa_jwt_token');
            },
            getPayload(token) {
                if (!token) {
                    return null;
                }

                try {
                    const parts = token.split('.');
                    if (parts.length !== 3) {
                        return null;
                    }

                    const normalizedPayload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
                    const paddedPayload = normalizedPayload + '='.repeat((4 - normalizedPayload.length % 4) % 4);
                    const payload = JSON.parse(atob(paddedPayload));

                    if (payload.exp && payload.exp * 1000 < Date.now()) {
                        this.clearStoredToken();
                        return null;
                    }

                    return payload;
                } catch {
                    return null;
                }
            },
            async verifyToken(token, body = {}) {
                if (!token || !this.getPayload(token)) {
                    return false;
                }

                if (this.verifiedToken === token) {
                    return true;
                }

                if (this.pendingVerification?.token === token) {
                    return this.pendingVerification.promise;
                }

                const promise = fetch('/api/verify-access', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(body)
                })
                    .then((response) => {
                        if (!response.ok) {
                            if (response.status === 401 || response.status === 403) {
                                this.clearStoredToken();
                            }
                            return false;
                        }

                        this.verifiedToken = token;
                        return true;
                    })
                    .catch((error) => {
                        console.warn('[Module Gate] Token verification failed:', error);
                        return false;
                    })
                    .finally(() => {
                        if (this.pendingVerification?.token === token) {
                            delete this.pendingVerification;
                        }
                    });

                this.pendingVerification = { token, promise };
                return promise;
            },
            async verifyStoredToken(body = {}) {
                return this.verifyToken(this.getStoredToken(), body);
            }
        };

        return window.BSAAccessVerifier;
    }

    async function initializeGate() {
        if (await hasTrustedAccess()) {
            return;
        }

        applyGate(previewLimit);
    }

    async function hasTrustedAccess() {
        if (window.BSASubdomainAccess?.hasFullAccess?.()) {
            return true;
        }

        if (isDevelopmentHost()) {
            return true;
        }

        return getAccessVerifier().verifyStoredToken();
    }

    function isDevelopmentHost() {
        const hostname = window.location.hostname.toLowerCase();
        return hostname === 'localhost' ||
            hostname === '127.0.0.1' ||
            hostname === '0.0.0.0' ||
            hostname.endsWith('.localhost') ||
            hostname.endsWith('.vercel.app');
    }

    function isServerEnforcedHost() {
        const hostname = window.location.hostname.toLowerCase();
        return hostname === 'bitcoinsovereign.academy' ||
            hostname === 'www.bitcoinsovereign.academy' ||
            hostname === 'localhost' ||
            hostname === '127.0.0.1' ||
            hostname === '0.0.0.0' ||
            hostname.endsWith('.localhost') ||
            hostname.endsWith('.vercel.app');
    }

    function isServerProtectedRoute() {
        const path = pathName.replace(/\/+$/, '') || '/';

        if (path === '/deep-dives' || path === '/deep-dives/index.html' || path.startsWith('/deep-dives/')) {
            return true;
        }

        if (!path.startsWith('/paths/')) {
            return false;
        }

        const segments = path.split('/').filter(Boolean);
        const [, , section, child] = segments;

        if (section === 'capstone') {
            return true;
        }

        if (section === 'stage-1') {
            if (child === 'deep-dives') {
                return true;
            }

            if (!child || child === 'index.html') {
                return false;
            }

            return child.startsWith('module-') && child !== 'module-1' && child !== 'module-1.html';
        }

        const stageMatch = /^stage-(\d+)$/.exec(section || '');
        return Boolean(stageMatch && Number(stageMatch[1]) >= 2);
    }

    function shouldDeferToServer() {
        return isServerEnforcedHost() && isServerProtectedRoute();
    }

    function hasValidAccessToken() {
        const token = getAccessVerifier().getStoredToken();
        return Boolean(getAccessVerifier().getPayload(token));
    }

    function clearLegacyAccessState() {
        localStorage.removeItem('bsa_full_access');
        sessionStorage.removeItem('bsa_preview_mode');
    }

    function addPaywallWarning(lastFreeSection) {
        const warning = document.createElement('div');
        warning.className = 'paywall-warning';
        warning.setAttribute('role', 'status');
        warning.setAttribute('aria-live', 'polite');
        warning.innerHTML = `
            <div class="paywall-warning-icon">⚠️</div>
            <div class="paywall-warning-content">
                <h4>You're about to reach the paywall</h4>
                <p>This is the last free section. Ready to continue your Bitcoin journey?</p>
                <div class="paywall-warning-cta">
                    <a href="/membership.html" class="btn-primary-small">Unlock Full Access</a>
                    <span class="paywall-warning-or">or</span>
                    <a href="#" class="paywall-warning-continue">Continue reading anyway →</a>
                </div>
            </div>
        `;

        // Insert after the last free section
        lastFreeSection.insertAdjacentElement('afterend', warning);

        // Add click handler for "continue anyway" link
        const continueLink = warning.querySelector('.paywall-warning-continue');
        continueLink.addEventListener('click', (e) => {
            e.preventDefault();
            warning.style.opacity = '0';
            setTimeout(() => warning.remove(), 300);
        });
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

        // Add paywall warning at section 2 (right before the lock)
        if (sections.length > limit && sections[limit - 1]) {
            addPaywallWarning(sections[limit - 1]);
        }

        // Track gate view in analytics
        if (window.bsaAnalytics) window.bsaAnalytics.trackGateView(pathName);

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

        // Get path name from URL
        const pathMatch = pathName.match(/\/paths\/(\w+)\//);
        const currentPath = pathMatch ? pathMatch[1].charAt(0).toUpperCase() + pathMatch[1].slice(1) : 'Bitcoin';

        const remainingSections = lockedSections.length;

        const overlay = document.createElement('div');
        overlay.className = 'module-lock-overlay';
        overlay.innerHTML = [
            '<button type="button" class="module-lock-dismiss" aria-label="Go back to previous page">×</button>',
            '<div class="module-lock-icon">🔐</div>',
            `<h3>Continue Your ${currentPath} Journey</h3>`,
            `<p class="module-lock-subtitle">You have completed ${limit} free sections. ${remainingSections} more sections await in this module.</p>`,

            '<div class="module-unlock-benefits">',
            '  <h4>Earn While You Learn:</h4>',
            '  <ul>',
            '    <li><span class="benefit-icon">⚡</span> Deposit 50,000 sats — earn up to 80% back via Lightning</li>',
            '    <li><span class="benefit-icon">✓</span> Complete this module + 94 more across all paths</li>',
            '    <li><span class="benefit-icon">✓</span> Unlimited AI Tutor access</li>',
            '    <li><span class="benefit-icon">✓</span> Completion certificates & progress tracking</li>',
            '  </ul>',
            '</div>',

            '<div class="module-social-proof">',
            '  <div class="testimonial-short">',
            '    <div class="stars">⭐⭐⭐⭐⭐</div>',
            '    <p>"Depositing sats and earning them back completely changed my motivation."</p>',
            '    <span class="author">— Apprentice Member</span>',
            '  </div>',
            '  <div class="enrollment-stats">',
            '    <span class="stat">44+ interactive demos</span>',
            '    <span class="stat-separator">•</span>',
            '    <span class="stat">8 learning paths</span>',
            '  </div>',
            '</div>',

            '<div class="module-pricing">',
            '  <span class="price">50,000 sats</span>',
            '  <span class="price-detail">Deposit via Lightning · Earn 80% back by completing modules</span>',
            '</div>',

            '<button type="button" class="module-lock-cta">⚡ Deposit & Start Earning</button>',
            '<small>Or get <a href="/membership.html" style="color:#9333ea;">Sovereign lifetime access</a> · Already enrolled? <a href="#" class="module-lock-login">Sign in</a></small>'
        ].join('');

        lockedWrapper.appendChild(innerWrapper);
        lockedWrapper.appendChild(overlay);

        // Dismiss button
        const dismissButton = overlay.querySelector('.module-lock-dismiss');
        dismissButton.addEventListener('click', () => {
            window.history.back();
        });

        // CTA button
        const ctaButton = overlay.querySelector('.module-lock-cta');
        ctaButton.addEventListener('click', () => {
            if (window.bsaAnalytics) window.bsaAnalytics.track('gate_cta_click', { path: pathName });
            window.location.href = '/membership.html';
        });

        // Login link
        const loginLink = overlay.querySelector('.module-lock-login');
        loginLink.addEventListener('click', event => {
            event.preventDefault();
            window.location.href = '/account.html';
        });
    }

    function injectStyles() {
        if (document.getElementById('module-gate-styles')) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'module-gate-styles';
        style.textContent = `
            /* Paywall Warning Styles */
            .paywall-warning {
                background: linear-gradient(135deg, rgba(247, 147, 26, 0.15), rgba(255, 179, 71, 0.1));
                border: 2px solid rgba(247, 147, 26, 0.4);
                border-radius: 12px;
                padding: 1.5rem;
                margin: 2rem 0;
                display: flex;
                align-items: flex-start;
                gap: 1rem;
                transition: opacity 0.3s ease;
            }
            .paywall-warning-icon {
                font-size: 2rem;
                flex-shrink: 0;
                line-height: 1;
            }
            .paywall-warning-content {
                flex: 1;
            }
            .paywall-warning-content h4 {
                margin: 0 0 0.5rem 0;
                color: #f7931a;
                font-size: 1.2rem;
            }
            .paywall-warning-content p {
                margin: 0 0 1rem 0;
                color: #e0e0e0;
                line-height: 1.5;
            }
            .paywall-warning-cta {
                display: flex;
                align-items: center;
                gap: 1rem;
                flex-wrap: wrap;
            }
            .btn-primary-small {
                background: linear-gradient(135deg, #f7931a, #ffb347);
                color: #121212;
                font-weight: 600;
                padding: 0.6rem 1.25rem;
                border-radius: 999px;
                text-decoration: none;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
                display: inline-block;
            }
            .btn-primary-small:hover {
                transform: translateY(-1px);
                box-shadow: 0 8px 20px rgba(247, 147, 26, 0.3);
            }
            .paywall-warning-or {
                color: #9aa4b2;
                font-size: 0.9rem;
            }
            .paywall-warning-continue {
                color: #f7931a;
                text-decoration: none;
                font-size: 0.95rem;
                transition: color 0.2s ease;
            }
            .paywall-warning-continue:hover {
                color: #ffb347;
                text-decoration: underline;
            }

            /* Lock Overlay Styles */
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
                max-width: 560px;
                max-height: 90vh;
                overflow-y: auto;
                padding: 2.5rem;
                background: rgba(18, 18, 18, 0.98);
                border: 1px solid rgba(247, 147, 26, 0.65);
                border-radius: 16px;
                display: flex;
                flex-direction: column;
                gap: 1.25rem;
                align-items: stretch;
                justify-content: flex-start;
                text-align: center;
                box-shadow: 0 20px 45px rgba(0, 0, 0, 0.5);
            }
            .module-lock-dismiss {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: rgba(255, 255, 255, 0.1);
                border: none;
                color: #e0e0e0;
                font-size: 1.8rem;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.2s ease, transform 0.2s ease;
                line-height: 1;
                padding: 0;
            }
            .module-lock-dismiss:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: scale(1.1);
            }
            .module-lock-icon {
                font-size: 3rem;
                margin-bottom: 0.5rem;
            }
            .module-lock-overlay h3 {
                font-size: 1.8rem;
                color: #f7931a;
                margin: 0;
                line-height: 1.3;
            }
            .module-lock-subtitle {
                margin: 0;
                color: #b3b3b3;
                font-size: 1rem;
                line-height: 1.5;
            }
            .module-unlock-benefits {
                background: rgba(247, 147, 26, 0.05);
                border: 1px solid rgba(247, 147, 26, 0.2);
                border-radius: 12px;
                padding: 1.5rem;
                text-align: left;
            }
            .module-unlock-benefits h4 {
                margin: 0 0 1rem 0;
                color: #f7931a;
                font-size: 1.1rem;
                text-align: center;
            }
            .module-unlock-benefits ul {
                list-style: none;
                margin: 0;
                padding: 0;
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
            }
            .module-unlock-benefits li {
                color: #e0e0e0;
                font-size: 0.95rem;
                display: flex;
                align-items: flex-start;
                gap: 0.75rem;
                line-height: 1.5;
            }
            .benefit-icon {
                color: #4caf50;
                font-weight: 700;
                flex-shrink: 0;
                margin-top: 0.1rem;
            }
            .module-social-proof {
                background: rgba(255, 255, 255, 0.03);
                border-radius: 12px;
                padding: 1.25rem;
            }
            .testimonial-short {
                margin-bottom: 1rem;
            }
            .stars {
                font-size: 1rem;
                margin-bottom: 0.5rem;
            }
            .testimonial-short p {
                margin: 0 0 0.5rem 0;
                color: #e0e0e0;
                font-style: italic;
                font-size: 0.95rem;
                line-height: 1.5;
            }
            .author {
                color: #9aa4b2;
                font-size: 0.85rem;
            }
            .enrollment-stats {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.75rem;
                color: #9aa4b2;
                font-size: 0.9rem;
            }
            .stat-separator {
                color: rgba(255, 255, 255, 0.3);
            }
            .module-pricing {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.25rem;
                padding: 1rem 0;
            }
            .price {
                font-size: 2.5rem;
                font-weight: 700;
                color: #f7931a;
                line-height: 1;
            }
            .price-detail {
                color: #9aa4b2;
                font-size: 0.9rem;
            }
            .module-lock-cta {
                background: linear-gradient(135deg, #f7931a, #ffb347);
                color: #121212;
                font-weight: 700;
                font-size: 1.1rem;
                border: none;
                border-radius: 999px;
                padding: 1rem 2rem;
                cursor: pointer;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
                margin-top: 0.5rem;
            }
            .module-lock-cta:hover {
                transform: translateY(-2px);
                box-shadow: 0 12px 30px rgba(247, 147, 26, 0.4);
            }
            .module-lock-overlay small {
                font-size: 0.85rem;
                color: #b0bec5;
                margin-top: 0.5rem;
            }
            .module-lock-overlay a {
                color: #f7931a;
                text-decoration: underline;
            }

            @media (max-width: 768px) {
                .paywall-warning {
                    flex-direction: column;
                    padding: 1.25rem;
                }
                .paywall-warning-icon {
                    font-size: 1.5rem;
                }
                .paywall-warning-content h4 {
                    font-size: 1.1rem;
                }
                .paywall-warning-cta {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 0.75rem;
                }

                .module-lock-overlay {
                    inset: 5%;
                    padding: 2rem 1.5rem;
                    max-height: 85vh;
                }
                .module-lock-overlay h3 {
                    font-size: 1.4rem;
                }
                .module-lock-icon {
                    font-size: 2.5rem;
                }
                .price {
                    font-size: 2rem;
                }
                .module-unlock-benefits {
                    padding: 1.25rem;
                }
            }
        `;

        document.head.appendChild(style);
    }


    window.BSAModuleGate = {
        unlock() {
            console.warn('[Module Gate] unlock() is disabled. Use a valid access token or a development host.');
            return false;
        },
        reset() {
            clearLegacyAccessState();
            window.location.reload();
        },
        getStatus() {
            return {
                path: pathName,
                hasVerifiedToken: window.BSAAccessVerifier?.verifiedToken === getAccessVerifier().getStoredToken(),
                hasValidToken: hasValidAccessToken(),
                isDevelopmentHost: isDevelopmentHost(),
                isServerEnforcedHost: isServerEnforcedHost(),
                isServerProtectedRoute: isServerProtectedRoute(),
                isAlwaysOpen: alwaysOpen.has(pathName),
                gatingApplies: !alwaysOpen.has(pathName)
            };
        }
    };
})();
