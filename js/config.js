/**
 * Bitcoin Sovereign Academy - Configuration
 *
 * This file controls feature flags for different deployment modes.
 * Change these settings to enable/disable features without code changes.
 *
 * Deployment Modes:
 * - PRODUCTION: Full gating, monetization enabled
 * - DEVELOPMENT: No gating, all content accessible
 * - PREVIEW: Limited preview access for demos
 * - FULLY_UNLOCKED: All content free (for testing/review)
 */

(function() {
    // Check for URL parameter overrides first
    const urlParams = new URLSearchParams(window.location.search);
    const modeParam = urlParams.get('mode');
    const unlockParam = urlParams.get('unlock');

    // Environment detection
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
    const isPreviewDomain = hostname.includes('preview') || hostname.includes('demo');
    const isDevDomain = hostname.includes('dev') || hostname.includes('staging');

    // Default configuration (PRODUCTION mode)
    const defaultConfig = {
        // Core feature flags
        ENABLE_MODULE_GATING: true,      // Lock modules behind paywall
        ENABLE_DEMO_LOCKS: true,         // Lock interactive demos
        ENABLE_PREVIEW_MODE: false,      // Allow limited preview access
        FULL_ACCESS: false,              // Bypass all locks (dev/testing)

        // Access limits
        FREE_MODULES_LIMIT: 1,           // How many modules free per path (Stage 1, Module 1)
        PREVIEW_DEMOS_LIMIT: 2,          // How many demos in preview mode

        // Environment
        ENVIRONMENT: 'production',       // 'production' | 'development' | 'preview' | 'unlocked'
        DEBUG: false                     // Enable console logging
    };

    // Mode presets
    const modePresets = {
        production: {
            ENABLE_MODULE_GATING: true,
            ENABLE_DEMO_LOCKS: true,
            ENABLE_PREVIEW_MODE: false,
            FULL_ACCESS: false,
            ENVIRONMENT: 'production',
            DEBUG: false
        },
        development: {
            ENABLE_MODULE_GATING: false,
            ENABLE_DEMO_LOCKS: false,
            ENABLE_PREVIEW_MODE: false,
            FULL_ACCESS: true,
            ENVIRONMENT: 'development',
            DEBUG: true
        },
        preview: {
            ENABLE_MODULE_GATING: true,
            ENABLE_DEMO_LOCKS: true,
            ENABLE_PREVIEW_MODE: true,
            FULL_ACCESS: false,
            ENVIRONMENT: 'preview',
            DEBUG: false
        },
        unlocked: {
            ENABLE_MODULE_GATING: false,
            ENABLE_DEMO_LOCKS: false,
            ENABLE_PREVIEW_MODE: false,
            FULL_ACCESS: true,
            ENVIRONMENT: 'unlocked',
            DEBUG: false
        }
    };

    // Auto-detect environment and apply preset
    let config = { ...defaultConfig };

    if (isLocalhost) {
        config = { ...config, ...modePresets.development };
    } else if (isPreviewDomain) {
        config = { ...config, ...modePresets.preview };
    } else if (isDevDomain) {
        config = { ...config, ...modePresets.development };
    }

    // URL parameter overrides (highest priority)
    if (modeParam && modePresets[modeParam]) {
        config = { ...config, ...modePresets[modeParam] };
    }

    if (unlockParam === 'true' || unlockParam === '1') {
        config.FULL_ACCESS = true;
        config.ENABLE_MODULE_GATING = false;
        config.ENABLE_DEMO_LOCKS = false;
    }

    // Manual override from localStorage (for testing)
    try {
        const manualOverride = localStorage.getItem('bsa_config_override');
        if (manualOverride) {
            const override = JSON.parse(manualOverride);
            config = { ...config, ...override };
            if (config.DEBUG) {
                console.log('[BSA Config] Manual override applied:', override);
            }
        }
    } catch (e) {
        console.warn('[BSA Config] Failed to load manual override:', e);
    }

    // Expose globally
    window.BSA_CONFIG = Object.freeze(config);

    // Debug logging
    if (config.DEBUG) {
        console.log('[BSA Config] Active configuration:', config);
        console.log('[BSA Config] Hostname:', hostname);
        console.log('[BSA Config] Mode:', config.ENVIRONMENT);
    }
})();
