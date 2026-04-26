/* ==========================================================
   Bitcoin Network Context Widget
   Bitcoin Sovereign Academy

   Renders a compact live data bar on module pages showing:
   - Latest block height
   - Recommended fee rate (sat/vB)
   - Mempool transaction count
   - Next halving countdown

   Usage: Include script; widget auto-injects on DOMContentLoaded.
   Data source: mempool.space public API (no key required)
   Respects: prefers-reduced-motion, no localStorage writes
   ========================================================== */

(function () {
    'use strict';

    const API_BASE = 'https://mempool.space/api';

    // ── Safe string helpers ───────────────────────────────────

    // Sanitize any value before injecting into innerHTML
    function safeNum(val) {
        const n = Number(val);
        if (!isFinite(n)) return '—';
        return n.toLocaleString();
    }

    function safeInt(val) {
        const n = parseInt(val, 10);
        return isFinite(n) ? n : 0;
    }

    // ── Fetch helpers ─────────────────────────────────────────

    async function fetchJSON(url) {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
    }

    async function getNetworkData() {
        try {
            const [fees, mempoolInfo, blockTip] = await Promise.all([
                fetchJSON(API_BASE + '/v1/fees/recommended'),
                fetchJSON(API_BASE + '/mempool'),
                fetchJSON(API_BASE + '/blocks/tip/height'),
            ]);
            // Coerce all API values to safe numbers — prevents any string injection
            return {
                blockHeight: safeInt(blockTip),
                fastFee: safeInt(fees.fastestFee),
                hourFee: safeInt(fees.hourFee),
                econFee: safeInt(fees.economyFee),
                mempoolCount: safeInt(mempoolInfo.count),
                mempoolVsize: Math.round(safeInt(mempoolInfo.vsize) / 1e6 * 10) / 10,
                error: null,
            };
        } catch (e) {
            return { error: e.message };
        }
    }

    // ── Halving countdown ─────────────────────────────────────

    function halvingCountdown(blockHeight) {
        const HALVING_INTERVAL = 210000;
        const nextHalving = Math.ceil(blockHeight / HALVING_INTERVAL) * HALVING_INTERVAL;
        const blocksLeft = nextHalving - blockHeight;
        // ~10 min/block
        const daysLeft = Math.round(blocksLeft * 10 / 60 / 24);
        return { nextHalving, blocksLeft, daysLeft };
    }

    // ── Fee context label ─────────────────────────────────────

    function feeLabel(satPerVb) {
        if (satPerVb <= 2) return { text: 'Very low', cls: 'ctx-fee-low' };
        if (satPerVb <= 10) return { text: 'Low', cls: 'ctx-fee-low' };
        if (satPerVb <= 50) return { text: 'Moderate', cls: 'ctx-fee-mid' };
        if (satPerVb <= 150) return { text: 'High', cls: 'ctx-fee-high' };
        return { text: 'Very high', cls: 'ctx-fee-high' };
    }

    // ── Render ────────────────────────────────────────────────

    function createWidget() {
        const bar = document.createElement('section');
        bar.id = 'btc-context-bar';
        // a11y: announce as a labeled region; first data load is announced once via
        // aria-live="polite", then we silence further updates so the 90s refresh
        // doesn't spam screen-reader users.
        bar.setAttribute('role', 'region');
        bar.setAttribute('aria-label', 'Live Bitcoin network status');
        bar.setAttribute('aria-live', 'polite');
        bar.setAttribute('aria-atomic', 'true');
        bar.setAttribute('aria-busy', 'true');
        bar.innerHTML = `
            <div class="ctx-inner">
                <span class="ctx-brand" aria-hidden="true">₿ Live Network</span>
                <div class="ctx-items" id="ctx-items">
                    <span class="ctx-item ctx-loading">Loading…</span>
                </div>
                <a class="ctx-explorer" href="https://mempool.space" target="_blank" rel="noopener">
                    mempool.space ↗
                </a>
                <button type="button" class="ctx-close" aria-label="Close live network bar">✕</button>
            </div>`;
        // Wire close button (no inline onclick — proper event listener, returns focus politely)
        const closeBtn = bar.querySelector('.ctx-close');
        closeBtn.addEventListener('click', () => {
            bar.style.display = 'none';
            // Move focus to the next focusable element so SR users don't lose place
            const nav = document.querySelector('nav, main, [role="main"]');
            const target = nav ? (nav.querySelector('a, button, [tabindex]') || nav) : document.body;
            if (target && typeof target.focus === 'function') {
                if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
                target.focus();
            }
        });
        return bar;
    }

    function renderItems(data) {
        const container = document.getElementById('ctx-items');
        if (!container) return;
        const bar = document.getElementById('btc-context-bar');

        if (data.error) {
            container.innerHTML = `<span class="ctx-item ctx-err">Network data unavailable</span>`;
            if (bar) bar.setAttribute('aria-busy', 'false');
            return;
        }

        const { blockHeight, fastFee, hourFee, econFee, mempoolCount, mempoolVsize } = data;
        const halving = halvingCountdown(blockHeight);
        const fl = feeLabel(hourFee);

        container.innerHTML = `
            <span class="ctx-item" title="Current Bitcoin block height">
                <span class="ctx-icon" aria-hidden="true">⛏</span>
                Block <strong>#${safeNum(blockHeight)}</strong>
            </span>
            <span class="ctx-sep" aria-hidden="true">·</span>
            <span class="ctx-item ${fl.cls}" title="Recommended fee to confirm within ~1 hour">
                <span class="ctx-icon" aria-hidden="true">⚡</span>
                Fees: <strong>${safeNum(hourFee)} sat/vB</strong>
                <span class="ctx-sub">${fl.text}</span>
            </span>
            <span class="ctx-sep" aria-hidden="true">·</span>
            <span class="ctx-item" title="Unconfirmed transactions in mempool">
                <span class="ctx-icon" aria-hidden="true">⏳</span>
                Mempool: <strong>${safeNum(mempoolCount)} txs</strong>
                <span class="ctx-sub">${mempoolVsize} MB</span>
            </span>
            <span class="ctx-sep" aria-hidden="true">·</span>
            <span class="ctx-item ctx-halving" title="Next halving block">
                <span class="ctx-icon" aria-hidden="true">🎯</span>
                Halving: <strong>${halving.blocksLeft.toLocaleString()} blocks</strong>
                <span class="ctx-sub">~${halving.daysLeft} days</span>
            </span>`;

        // After first successful render, silence further announcements (90s refresh)
        // so SR users aren't spammed every minute and a half.
        if (bar) {
            bar.setAttribute('aria-busy', 'false');
            bar.setAttribute('aria-live', 'off');
        }
    }

    // ── CSS (injected once) ───────────────────────────────────

    function injectCSS() {
        if (document.getElementById('btc-context-css')) return;
        const style = document.createElement('style');
        style.id = 'btc-context-css';
        style.textContent = `
#btc-context-bar {
    position: sticky;
    top: 0;
    z-index: 900;
    background: linear-gradient(90deg, #1a1a1a 0%, #212121 100%);
    border-bottom: 1px solid rgba(247,147,26,0.25);
    font-size: 0.78rem;
    font-family: 'JetBrains Mono', 'Courier New', monospace;
    color: #ccc;
    user-select: none;
}
.ctx-inner {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.45rem 1.25rem;
    flex-wrap: wrap;
    max-width: 1400px;
    margin: 0 auto;
}
.ctx-brand {
    color: #f7931a;
    font-weight: 700;
    letter-spacing: 0.03em;
    margin-right: 0.4rem;
    white-space: nowrap;
}
.ctx-items {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
    flex: 1;
}
.ctx-item {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    white-space: nowrap;
}
.ctx-icon { font-size: 0.85em; }
/* WCAG 1.4.3: was #888 (3.54:1) → #b5b5b5 (~6.5:1 on #1a1a1a) */
.ctx-sub {
    color: #b5b5b5;
    font-size: 0.88em;
    margin-left: 0.15rem;
}
/* WCAG 1.4.11 non-text: was #444 (~1.4:1) → #6b6b6b (~3.5:1 — separator is decorative + aria-hidden) */
.ctx-sep { color: #6b6b6b; }
.ctx-fee-low strong  { color: #4ade80; }
.ctx-fee-mid strong  { color: #facc15; }
.ctx-fee-high strong { color: #f87171; }
.ctx-halving strong  { color: #c084fc; }
/* WCAG 1.4.3: was #666 (2.85:1) → #a0a0a0 (~5:1) */
.ctx-loading { color: #a0a0a0; font-style: italic; }
.ctx-err     { color: #f87171; }
.ctx-explorer {
    color: #f7931a;
    text-decoration: none;
    opacity: 0.85;  /* was 0.75 — subtle bump for legibility */
    margin-left: auto;
    white-space: nowrap;
    transition: opacity 0.2s;
    padding: 0.2rem 0.4rem;  /* hit-area for focus ring */
    border-radius: 3px;
}
.ctx-explorer:hover { opacity: 1; }
.ctx-explorer:focus-visible {
    outline: 2px solid #f7931a;
    outline-offset: 2px;
    opacity: 1;
}
.ctx-close {
    background: none;
    border: none;
    /* WCAG 1.4.3: was #555 (~2.5:1) → #a0a0a0 (~5:1) */
    color: #a0a0a0;
    cursor: pointer;
    font-size: 0.95rem;
    padding: 0.25rem 0.5rem;
    transition: color 0.2s, background 0.2s;
    border-radius: 3px;
    /* WCAG 2.5.5 touch target: bring close button up from ~14px box to 32px+ */
    min-width: 32px;
    min-height: 32px;
}
.ctx-close:hover { color: #fff; background: rgba(255,255,255,0.06); }
.ctx-close:focus-visible {
    outline: 2px solid #f7931a;
    outline-offset: 2px;
    color: #fff;
}
@media (max-width: 700px) {
    .ctx-sep { display: none; }
    .ctx-halving { display: none; }
    .ctx-inner { padding: 0.4rem 0.75rem; }
}
@media (prefers-reduced-motion: no-preference) {
    #btc-context-bar { transition: opacity 0.3s; }
}`;
        document.head.appendChild(style);
    }

    // ── Mount ─────────────────────────────────────────────────

    function mount() {
        injectCSS();

        const bar = createWidget();

        // Insert after first <nav> or at top of body
        const firstNav = document.querySelector('nav');
        if (firstNav && firstNav.parentNode) {
            firstNav.parentNode.insertBefore(bar, firstNav.nextSibling);
        } else {
            document.body.insertBefore(bar, document.body.firstChild);
        }

        // Fetch data and render
        getNetworkData().then(renderItems);

        // Auto-refresh every 90 seconds
        setInterval(() => getNetworkData().then(renderItems), 90000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mount);
    } else {
        mount();
    }

})();
