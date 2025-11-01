/**
 * Interactive Demo Lock with Subdomain Integration
 *
 * This script should be injected into locked demos.
 * It checks subdomain access and unlocks content accordingly.
 */

(function() {
    'use strict';

    // ============================================
    // Demo Name Detection
    // ============================================

    function getDemoName() {
        const path = window.location.pathname;
        const match = path.match(/interactive-demos\/([^\/]+)/);
        return match ? match[1] : null;
    }

    // ============================================
    // Access Check
    // ============================================

    function checkAccess() {
        const demoName = getDemoName();

        // Check if subdomain access control is available
        if (typeof window.BSASubdomainAccess !== 'undefined') {
            if (window.BSASubdomainAccess.shouldUnlockDemo(demoName)) {
                console.log(`✅ Demo "${demoName}" unlocked via subdomain access`);
                return true;
            }
        }

        // Check URL parameters (legacy support)
        const params = new URLSearchParams(window.location.search);
        if (params.get('unlock') === 'all' ||
            localStorage.getItem('devUnlockAll') === 'true') {
            console.log(`✅ Demo "${demoName}" unlocked via URL parameter`);
            return true;
        }

        // Check hostname directly (fallback)
        const hostname = window.location.hostname.toLowerCase();
        if (hostname.includes('learn.') ||
            hostname.includes('preview.') ||
            hostname === 'localhost' ||
            hostname.includes('vercel.app')) {
            console.log(`✅ Demo "${demoName}" unlocked via hostname`);
            return true;
        }

        // Check against free demo list
        const freeDemos = [
            'account-freeze-locked-out',
            'building-the-chain-demo',
            'double-spending-demo',
            'money-properties-comparison',
            'network-consensus-demo'
        ];

        if (freeDemos.includes(demoName)) {
            console.log(`✅ Demo "${demoName}" is free - no lock`);
            return true;
        }

        console.log(`🔒 Demo "${demoName}" is locked for public access`);
        return false;
    }

    // ============================================
    // Lock Display
    // ============================================

    function showLockScreen() {
        document.body.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;background:#000;color:#fff;text-align:center;font-family:system-ui;padding:20px;">
                <div style="max-width:500px;">
                    <h1 style="font-size:3rem;margin:0 0 16px;">🔒</h1>
                    <h2 style="margin:0 0 12px;font-size:1.8rem;">This Demo is Locked</h2>
                    <p style="color:#aaa;font-size:1.1rem;line-height:1.6;margin-bottom:24px;">
                        This interactive demo is available to Bitcoin Sovereign Academy members
                    </p>
                    <div style="display:flex;flex-direction:column;gap:12px;align-items:center;">
                        <a href="https://learn.bitcoinsovereign.academy${window.location.pathname}"
                           style="display:inline-block;color:#fff;background:#10b981;text-decoration:none;font-weight:600;font-size:1.1rem;padding:12px 24px;border-radius:8px;transition:all 0.2s;">
                            Access as Member →
                        </a>
                        <a href="/"
                           style="display:inline-block;color:#f7931a;text-decoration:none;font-weight:600;font-size:1rem;padding:8px 16px;border:2px solid #f7931a;border-radius:8px;transition:all 0.2s;">
                            ← Back to Home
                        </a>
                        <p style="color:#666;font-size:0.85rem;margin-top:12px;">
                            Not a member? <a href="/#unlock" style="color:#f7931a;text-decoration:underline;">Learn more</a>
                        </p>
                    </div>
                </div>
            </div>
        `;
        document.title = '🔒 Demo Locked';
    }

    // ============================================
    // Initialization
    // ============================================

    function init() {
        // Wait a bit for subdomain-access-control.js to load
        setTimeout(() => {
            if (!checkAccess()) {
                showLockScreen();
            }
        }, 100);
    }

    // Run immediately
    init();

})();
