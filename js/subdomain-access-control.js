/**
 * 🌐 Subdomain-Based Access Control System
 *
 * Controls content access based on subdomain:
 * - bitcoinsovereign.academy → Public (gated content)
 * - learn.bitcoinsovereign.academy → Full access (paid members)
 * - preview.bitcoinsovereign.academy → Demo access (investors/reviewers)
 * - localhost / *.vercel.app → Development mode
 */

(function() {
    'use strict';

    // ============================================
    // Configuration
    // ============================================

    const CONFIG = {
        domains: {
            public: 'bitcoinsovereign.academy',        // Main public site (gated)
            members: 'learn.bitcoinsovereign.academy', // Full access for members
            preview: 'preview.bitcoinsovereign.academy' // Preview for demos/investors
        },
        accessLevels: {
            PUBLIC: 'public',      // Limited access (gated)
            MEMBER: 'member',      // Full access (paid)
            PREVIEW: 'preview',    // Demo access (temporary)
            DEV: 'dev'            // Development (unrestricted)
        },
        storage: {
            key: 'bsa_access_level',
            sessionKey: 'bsa_session_access'
        }
    };

    // ============================================
    // Subdomain Detection
    // ============================================

    function getHostname() {
        return window.location.hostname.toLowerCase();
    }

    function getSubdomain() {
        const hostname = getHostname();
        const parts = hostname.split('.');

        // For localhost or vercel deployments
        if (hostname === 'localhost' || hostname.includes('vercel.app')) {
            return 'dev';
        }

        // For bitcoinsovereign.academy (no subdomain)
        if (hostname === CONFIG.domains.public) {
            return null;
        }

        // For learn.bitcoinsovereign.academy
        if (hostname === CONFIG.domains.members) {
            return 'learn';
        }

        // For preview.bitcoinsovereign.academy
        if (hostname === CONFIG.domains.preview) {
            return 'preview';
        }

        // Extract subdomain for other cases
        if (parts.length > 2) {
            return parts[0];
        }

        return null;
    }

    // ============================================
    // JWT Token Verification
    // ============================================

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
                        console.log('🔒 JWT token expired');
                        this.clearStoredToken();
                        return null;
                    }

                    return payload;
                } catch (error) {
                    console.warn('Error validating JWT:', error);
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
                        console.warn('⚠️ Server token verification failed:', error);
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

    function hasValidAccessToken() {
        const token = getAccessVerifier().getStoredToken();
        return Boolean(getAccessVerifier().getPayload(token));
    }

    // ============================================
    // Access Level Detection
    // ============================================

    function detectAccessLevel() {
        const hostname = getHostname();
        const subdomain = getSubdomain();

        // Development mode (localhost or Vercel preview)
        if (subdomain === 'dev') {
            console.log('🔧 Development Mode - Full Access');
            return CONFIG.accessLevels.DEV;
        }


        // Member subdomain (paid access)
        if (hostname === CONFIG.domains.members || subdomain === 'learn') {
            console.log('✅ Member Access - Full Content Unlocked');
            return CONFIG.accessLevels.MEMBER;
        }

        // Preview subdomain (demo access)
        if (hostname === CONFIG.domains.preview || subdomain === 'preview') {
            console.log('👁️ Preview Access - Demo Mode Active');
            return CONFIG.accessLevels.PREVIEW;
        }

        // Public domain (gated content)
        console.log('🔒 Public Access - Content Gated');
        return CONFIG.accessLevels.PUBLIC;
    }

    // ============================================
    // Access Control Functions
    // ============================================

    function hasFullAccess(accessLevel) {
        return accessLevel === CONFIG.accessLevels.MEMBER ||
               accessLevel === CONFIG.accessLevels.DEV;
    }

    function hasPreviewAccess(accessLevel) {
        return accessLevel === CONFIG.accessLevels.PREVIEW ||
               hasFullAccess(accessLevel);
    }

    function isPublicAccess(accessLevel) {
        return accessLevel === CONFIG.accessLevels.PUBLIC;
    }

    // ============================================
    // Content Gating Logic
    // ============================================

    function shouldApplyGating(accessLevel) {
        // Only apply gating for public access
        return isPublicAccess(accessLevel);
    }

    function shouldUnlockDemo(accessLevel, demoName) {
        // Always unlock for members and dev
        if (hasFullAccess(accessLevel)) {
            return true;
        }

        // Unlock selected demos for preview
        if (accessLevel === CONFIG.accessLevels.PREVIEW) {
            return true; // Preview has access to all demos
        }

        // Public access - check against free demo list
        const freeDemos = [
            'account-freeze-locked-out',
            'building-the-chain-demo',
            'double-spending-demo',
            'money-properties-comparison',
            'network-consensus-demo'
        ];

        return freeDemos.includes(demoName);
    }

    // ============================================
    // Banner Display
    // ============================================

    function showAccessBanner(accessLevel) {
        // Only show banners for non-public access
        if (isPublicAccess(accessLevel)) {
            return;
        }

        window.addEventListener('DOMContentLoaded', () => {
            // Check if banner already exists
            if (document.getElementById('subdomain-access-banner')) {
                return;
            }

            let bannerHTML = '';

            if (accessLevel === CONFIG.accessLevels.MEMBER) {
                bannerHTML = `
                    <div id="subdomain-access-banner" style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 0.75rem 1.5rem; text-align: center; font-weight: 600; position: fixed; top: 0; left: 0; right: 0; z-index: 10000; box-shadow: 0 2px 10px rgba(0,0,0,0.3);">
                        <span style="font-size: 1.1rem;">✅ Member Access Active</span>
                        <span style="margin: 0 1rem; opacity: 0.7;">|</span>
                        <span style="font-size: 0.9rem;">All content unlocked</span>
                        <a href="https://${CONFIG.domains.public}" style="margin-left: 1.5rem; background: rgba(255,255,255,0.2); color: white; text-decoration: none; padding: 0.4rem 1rem; border-radius: 4px; font-size: 0.85rem; font-weight: 600;">← Public Site</a>
                    </div>
                `;
            } else if (accessLevel === CONFIG.accessLevels.PREVIEW) {
                bannerHTML = `
                    <div id="subdomain-access-banner" style="background: linear-gradient(135deg, #f7931a, #ffb347); color: #121212; padding: 0.75rem 1.5rem; text-align: center; font-weight: 600; position: fixed; top: 0; left: 0; right: 0; z-index: 10000; box-shadow: 0 2px 10px rgba(0,0,0,0.3);">
                        <span style="font-size: 1.1rem;">👁️ Preview Mode Active</span>
                        <span style="margin: 0 1rem; opacity: 0.7;">|</span>
                        <span style="font-size: 0.9rem;">Demo access enabled</span>
                        <a href="https://${CONFIG.domains.public}" style="margin-left: 1.5rem; background: rgba(18,18,18,0.8); color: white; text-decoration: none; padding: 0.4rem 1rem; border-radius: 4px; font-size: 0.85rem; font-weight: 600;">← Public Site</a>
                    </div>
                `;
            } else if (accessLevel === CONFIG.accessLevels.DEV) {
                bannerHTML = `
                    <div id="subdomain-access-banner" style="background: linear-gradient(135deg, #8b5cf6, #6366f1); color: white; padding: 0.75rem 1.5rem; text-align: center; font-weight: 600; position: fixed; top: 0; left: 0; right: 0; z-index: 10000; box-shadow: 0 2px 10px rgba(0,0,0,0.3);">
                        <span style="font-size: 1.1rem;">🔧 Development Mode</span>
                        <span style="margin: 0 1rem; opacity: 0.7;">|</span>
                        <span style="font-size: 0.9rem;">Full access enabled</span>
                    </div>
                `;
            }

            if (bannerHTML) {
                const bannerContainer = document.createElement('div');
                bannerContainer.innerHTML = bannerHTML;
                document.body.insertBefore(bannerContainer.firstElementChild, document.body.firstChild);

                // Add padding to body to account for banner
                document.body.style.paddingTop = '60px';
            }
        });
    }

    // ============================================
    // Storage Management
    // ============================================

    function storeAccessLevel(accessLevel) {
        try {
            localStorage.setItem(CONFIG.storage.key, accessLevel);
            sessionStorage.setItem(CONFIG.storage.sessionKey, accessLevel);
        } catch (e) {
            console.warn('Storage not available:', e);
        }
    }

    function getStoredAccessLevel() {
        try {
            return sessionStorage.getItem(CONFIG.storage.sessionKey) ||
                   localStorage.getItem(CONFIG.storage.key);
        } catch (e) {
            return null;
        }
    }

    // ============================================
    // Server Verification
    // ============================================

    async function verifyWithServer() {
        const token = getAccessVerifier().getStoredToken();
        if (!token) return;

        try {
            const verified = await getAccessVerifier().verifyStoredToken();
            if (verified) {
                console.log('✅ Server verification passed');
            } else {
                console.warn('⚠️ Server verification failed - keeping public access until a verified token is present');
            }
        } catch (err) {
            console.error('Server verification error:', err);
        }
    }

    // ============================================
    // Initialization
    // ============================================

    function init() {
        const accessLevel = detectAccessLevel();
        storeAccessLevel(accessLevel);
        showAccessBanner(accessLevel);

        // Perform server-side verification if we think we have access
        if (hasValidAccessToken()) {
            verifyWithServer();
        }

        // Export global API
        window.BSASubdomainAccess = {
            getAccessLevel: () => accessLevel,
            hasFullAccess: () => hasFullAccess(accessLevel),
            hasPreviewAccess: () => hasPreviewAccess(accessLevel),
            isPublicAccess: () => isPublicAccess(accessLevel),
            shouldApplyGating: () => shouldApplyGating(accessLevel),
            shouldUnlockDemo: (demoName) => shouldUnlockDemo(accessLevel, demoName),
            getHostname,
            getSubdomain,
            config: CONFIG,
            // JWT Token Management
            setAccessToken: (token) => {
                localStorage.setItem('bsa_access_token', token);
                console.log('✅ Access token saved - reloading to apply access');
                window.location.reload();
            },
            clearAccessToken: () => {
                localStorage.removeItem('bsa_access_token');
                localStorage.removeItem('bsa_jwt_token');
                console.log('🔒 Access token cleared');
                window.location.reload();
            },
            hasValidToken: hasValidAccessToken,
            verifyCurrentToken: verifyWithServer
        };

        console.log('🌐 Subdomain Access Control Initialized');
        console.log('   Hostname:', getHostname());
        console.log('   Subdomain:', getSubdomain() || '(none)');
        console.log('   Access Level:', accessLevel);
    }

    // Run initialization
    init();

})();
