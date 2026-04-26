/**
 * Safety Warning Banner - Bitcoin Sovereign Academy
 * Shows safety warnings on pages with custody/financial content
 */

(function() {
    'use strict';
    
    const SAFETY_BANNER_DISMISSED_KEY = 'bsa_safety_banner_dismissed';
    
    function shouldShowBanner() {
        // Don't show if user has completed safety assessment
        if (window.BSASafety && window.BSASafety.hasCompleted()) {
            return false;
        }
        
        // Don't show if already dismissed this session
        if (sessionStorage.getItem(SAFETY_BANNER_DISMISSED_KEY)) {
            return false;
        }
        
        // Check if page contains sensitive content
        const bodyText = document.body.textContent.toLowerCase();
        const urlPath = window.location.pathname;
        
        const riskKeywords = [
            'wallet', 'custody', 'private key', 'seed phrase', 'bitcoin', 'buying',
            'selling', 'exchange', 'hardware wallet', 'backup', 'security'
        ];
        
        const protectedPaths = ['/paths/', '/wallet', '/custody', '/security'];
        const hasRiskKeywords = riskKeywords.some(keyword => bodyText.includes(keyword));
        const isProtectedPath = protectedPaths.some(path => urlPath.includes(path));
        
        return hasRiskKeywords || isProtectedPath;
    }
    
    function createSafetyBanner() {
        const banner = document.createElement('section');
        banner.id = 'safety-warning-banner';
        banner.className = 'safety-banner';
        // a11y: role="region" with aria-label gives this banner a proper landmark
        // for SR navigation. aria-live="polite" announces it once on first render.
        // (role="alert" was previously used but is implicitly assertive — overkill
        // for an informational safety banner.)
        banner.setAttribute('role', 'region');
        banner.setAttribute('aria-label', 'Safety advisory');
        banner.setAttribute('aria-live', 'polite');

        banner.innerHTML = `
            <div class="safety-banner-content">
                <div class="safety-banner-icon" aria-hidden="true">⚠️</div>
                <div class="safety-banner-text">
                    <strong>Safety First:</strong> This page contains Bitcoin security information.
                    Bitcoin mistakes can result in permanent loss of funds.
                    <button type="button" class="safety-banner-assess">
                        Take our 2-minute safety assessment first
                    </button>
                </div>
                <button type="button" class="safety-banner-close" aria-label="Dismiss safety advisory">
                    <span aria-hidden="true">×</span>
                </button>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .safety-banner {
                position: sticky;
                top: 0;
                background: linear-gradient(135deg, #ff9800, #f57c00);
                color: white;
                padding: 16px;
                z-index: 1000;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                border-bottom: 3px solid #e65100;
            }
            
            .safety-banner-content {
                display: flex;
                align-items: center;
                gap: 16px;
                max-width: 1200px;
                margin: 0 auto;
                font-size: 15px;
                line-height: 1.5;
            }
            
            .safety-banner-icon {
                font-size: 24px;
                flex-shrink: 0;
                filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
            }
            
            .safety-banner-text {
                flex: 1;
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                gap: 8px;
            }
            
            .safety-banner-assess {
                background: rgba(255,255,255,0.2);
                border: 2px solid rgba(255,255,255,0.5);
                color: white;
                padding: 8px 16px;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                text-decoration: underline;
            }
            
            .safety-banner-assess:hover {
                background: rgba(255,255,255,0.3);
                border-color: white;
                transform: translateY(-1px);
            }
            
            .safety-banner-close {
                background: transparent;
                border: none;
                color: white;
                font-size: 24px;
                font-weight: bold;
                cursor: pointer;
                padding: 4px 8px;
                border-radius: 4px;
                transition: background 0.2s ease;
                flex-shrink: 0;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .safety-banner-close:hover {
                background: rgba(255,255,255,0.2);
            }
            
            @media (max-width: 768px) {
                .safety-banner-content {
                    flex-direction: column;
                    text-align: center;
                    gap: 12px;
                }
                
                .safety-banner-text {
                    flex-direction: column;
                    align-items: center;
                }
                
                .safety-banner-assess {
                    margin-top: 8px;
                }
                
                .safety-banner-close {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                }
            }
        `;
        
        document.head.appendChild(style);
        
        return banner;
    }
    
    function showSafetyBanner() {
        const banner = createSafetyBanner();
        
        // Insert at top of body
        document.body.insertBefore(banner, document.body.firstChild);
        
        // Add event listeners
        const assessBtn = banner.querySelector('.safety-banner-assess');
        const closeBtn = banner.querySelector('.safety-banner-close');
        
        assessBtn.addEventListener('click', () => {
            if (window.BSASafety) {
                window.BSASafety.showAssessment();
            }
            dismissBanner(banner);
        });
        
        closeBtn.addEventListener('click', () => {
            dismissBanner(banner);
        });
        
        // Auto-dismiss after 30 seconds if user doesn't interact
        setTimeout(() => {
            if (banner.parentNode) {
                dismissBanner(banner);
            }
        }, 30000);
    }
    
    function dismissBanner(banner) {
        sessionStorage.setItem(SAFETY_BANNER_DISMISSED_KEY, 'true');
        if (banner.parentNode) {
            banner.parentNode.removeChild(banner);
        }
    }
    
    // Initialize banner when page loads
    function init() {
        if (shouldShowBanner()) {
            // Wait a moment to ensure safety assessment script is loaded
            setTimeout(showSafetyBanner, 500);
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Expose for manual control
    window.BSASafetyBanner = {
        show: showSafetyBanner,
        shouldShow: shouldShowBanner
    };
})();