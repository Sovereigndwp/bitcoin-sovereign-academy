/**
 * BSA Site Navigation
 * Lightweight persistent navigation bar injected across all pages.
 * Also auto-fires analytics events for demo views and path starts.
 *
 * Include via: <script src="/js/site-nav.js" defer></script>
 */
(function () {
    'use strict';

    // Don't inject on pages that already have custom full-page layouts
    const SKIP_PAGES = ['/membership-success.html'];
    if (SKIP_PAGES.includes(window.location.pathname)) return;

    // --- Styles ---
    const STYLES = `
    .bsa-nav {
        position: sticky; top: 0; z-index: 9990;
        background: rgba(11, 14, 20, 0.95);
        backdrop-filter: blur(12px);
        border-bottom: 1px solid #202938;
        height: 48px;
        display: flex; align-items: center;
        padding: 0 1.5rem;
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 0.9rem;
    }
    .bsa-nav__inner {
        max-width: 1400px; width: 100%; margin: 0 auto;
        display: flex; align-items: center; justify-content: space-between;
    }
    .bsa-nav__brand {
        display: flex; align-items: center; gap: 0.5rem;
        text-decoration: none; color: #C8922A; font-weight: 700; font-size: 1rem;
        white-space: nowrap;
    }
    .bsa-nav__brand:hover { color: #ffb347; }
    .bsa-nav__links {
        display: flex; align-items: center; gap: 1.25rem;
        list-style: none; margin: 0; padding: 0;
    }
    .bsa-nav__links a {
        color: #9aa4b2; text-decoration: none; font-weight: 500;
        transition: color 0.2s;
    }
    .bsa-nav__links a:hover, .bsa-nav__links a.active { color: #C8922A; }
    .bsa-nav__cta {
        background: linear-gradient(135deg, #C8922A, #ffb347);
        color: #000 !important; font-weight: 700 !important;
        padding: 0.35rem 1rem; border-radius: 999px;
        font-size: 0.85rem; white-space: nowrap;
    }
    .bsa-nav__cta:hover { box-shadow: 0 2px 12px rgba(200, 146, 42,0.4); color: #000 !important; }
    .bsa-nav__progress {
        display: flex; align-items: center; gap: 0.5rem;
        font-size: 0.8rem; color: #9aa4b2;
    }
    .bsa-nav__progress-bar {
        width: 60px; height: 6px; background: #202938; border-radius: 3px; overflow: hidden;
    }
    .bsa-nav__progress-fill {
        height: 100%; background: linear-gradient(90deg, #C8922A, #ffb347); border-radius: 3px;
        transition: width 0.3s;
    }
    .bsa-nav__hamburger {
        display: none; background: none; border: none; color: #9aa4b2; font-size: 1.5rem;
        cursor: pointer; padding: 0.25rem;
    }
    @media (max-width: 768px) {
        .bsa-nav__links { display: none; position: absolute; top: 48px; left: 0; right: 0;
            flex-direction: column; background: rgba(11,14,20,0.98); padding: 1rem;
            border-bottom: 1px solid #202938; gap: 0.75rem; }
        .bsa-nav__links.open { display: flex; }
        .bsa-nav__hamburger { display: block; }
        .bsa-nav__progress { display: none; }
    }`;

    function injectNav() {
        // Inject styles
        const style = document.createElement('style');
        style.id = 'bsa-nav-styles';
        style.textContent = STYLES;
        document.head.appendChild(style);

        const path = window.location.pathname;

        // Determine active page
        const isHome = path === '/' || path === '/index.html';
        const isPaths = path.startsWith('/paths/');
        const isDemos = path.startsWith('/interactive-demos/');
        const isDeep = path.startsWith('/deep-dives/');
        const isMembership = path === '/membership.html';

        function activeClass(condition) { return condition ? ' active' : ''; }

        // Build progress indicator
        let progressHTML = '';
        try {
            if (window.ProgressManager) {
                const pm = new ProgressManager();
                const data = pm.init();
                if (data && data.paths) {
                    let totalCompleted = 0, totalModules = 0;
                    for (const [, pathData] of Object.entries(data.paths)) {
                        if (pathData.modules) {
                            for (const mod of Object.values(pathData.modules)) {
                                totalModules++;
                                if (mod.completed) totalCompleted++;
                            }
                        }
                    }
                    if (totalCompleted > 0) {
                        const pct = Math.round((totalCompleted / Math.max(totalModules, 1)) * 100);
                        progressHTML = `<div class="bsa-nav__progress">
                            <div class="bsa-nav__progress-bar"><div class="bsa-nav__progress-fill" style="width:${pct}%"></div></div>
                            <span>${totalCompleted} done</span>
                        </div>`;
                    }
                }
            }
        } catch (e) { /* progress tracking optional */ }

        const nav = document.createElement('nav');
        nav.className = 'bsa-nav';
        nav.setAttribute('aria-label', 'Main navigation');
        nav.innerHTML = `<div class="bsa-nav__inner">
            <a href="/" class="bsa-nav__brand">₿ BSA</a>
            <button class="bsa-nav__hamburger" aria-label="Toggle menu" aria-expanded="false">☰</button>
            <ul class="bsa-nav__links">
                <li><a href="/"${activeClass(isHome)}>Home</a></li>
                <li><a href="/paths/curious/"${activeClass(isPaths)}>Paths</a></li>
                <li><a href="/interactive-demos/"${activeClass(isDemos)}>Demos</a></li>
                <li><a href="/deep-dives/"${activeClass(isDeep)}>Deep Dives</a></li>
                <li><a href="https://financiallysovereign.academy/" target="_blank" rel="noopener">Financial Literacy ↗</a></li>
                <li><a href="/membership.html" class="bsa-nav__cta${activeClass(isMembership)}">Membership</a></li>
            </ul>
            ${progressHTML}
        </div>`;

        // Hamburger toggle
        const hamburger = nav.querySelector('.bsa-nav__hamburger');
        const links = nav.querySelector('.bsa-nav__links');
        hamburger.addEventListener('click', () => {
            const isOpen = links.classList.toggle('open');
            hamburger.setAttribute('aria-expanded', isOpen);
            hamburger.textContent = isOpen ? '✕' : '☰';
        });

        // Insert at top of body
        document.body.insertBefore(nav, document.body.firstChild);
    }

    // --- Auto Analytics ---
    function fireAutoAnalytics() {
        const path = window.location.pathname;

        // Wait for analytics to load
        if (!window.bsaAnalytics) return;

        // Auto-track demo views
        if (path.startsWith('/interactive-demos/') && path !== '/interactive-demos/' && path !== '/interactive-demos/index.html') {
            const demoId = path.replace('/interactive-demos/', '').replace(/\/$/, '').replace('/index.html', '');
            if (demoId) window.bsaAnalytics.trackDemoView(demoId);
        }

        // Auto-track path starts (visiting a path index page)
        const pathMatch = path.match(/^\/paths\/([^/]+)\/?(index\.html)?$/);
        if (pathMatch) {
            window.bsaAnalytics.track('path_start', { pathId: pathMatch[1] });
        }

    }

    // Init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => { injectNav(); fireAutoAnalytics(); });
    } else {
        injectNav();
        fireAutoAnalytics();
    }
})();
