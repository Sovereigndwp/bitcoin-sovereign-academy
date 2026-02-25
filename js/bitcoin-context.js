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
            return {
                blockHeight: blockTip,
                fastFee: fees.fastestFee,
                hourFee: fees.hourFee,
                econFee: fees.economyFee,
                mempoolCount: mempoolInfo.count,
                mempoolVsize: Math.round(mempoolInfo.vsize / 1e6 * 10) / 10, // MB
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
        const bar = document.createElement('div');
        bar.id = 'btc-context-bar';
        bar.innerHTML = `
            <div class="ctx-inner">
                <span class="ctx-brand">₿ Live Network</span>
                <div class="ctx-items" id="ctx-items">
                    <span class="ctx-item ctx-loading">Loading…</span>
                </div>
                <a class="ctx-explorer" href="https://mempool.space" target="_blank" rel="noopener">
                    mempool.space ↗
                </a>
                <button class="ctx-close" aria-label="Close" onclick="document.getElementById('btc-context-bar').style.display='none'">✕</button>
            </div>`;
        return bar;
    }

    function renderItems(data) {
        const container = document.getElementById('ctx-items');
        if (!container) return;

        if (data.error) {
            container.innerHTML = `<span class="ctx-item ctx-err">Network data unavailable</span>`;
            return;
        }

        const { blockHeight, fastFee, hourFee, econFee, mempoolCount, mempoolVsize } = data;
        const halving = halvingCountdown(blockHeight);
        const fl = feeLabel(hourFee);

        container.innerHTML = `
            <span class="ctx-item" title="Current Bitcoin block height">
                <span class="ctx-icon">⛏</span>
                Block <strong>#${blockHeight.toLocaleString()}</strong>
            </span>
            <span class="ctx-sep">·</span>
            <span class="ctx-item ${fl.cls}" title="Recommended fee to confirm within ~1 hour">
                <span class="ctx-icon">⚡</span>
                Fees: <strong>${hourFee} sat/vB</strong>
                <span class="ctx-sub">${fl.text}</span>
            </span>
            <span class="ctx-sep">·</span>
            <span class="ctx-item" title="Unconfirmed transactions in mempool">
                <span class="ctx-icon">⏳</span>
                Mempool: <strong>${mempoolCount.toLocaleString()} txs</strong>
                <span class="ctx-sub">${mempoolVsize} MB</span>
            </span>
            <span class="ctx-sep">·</span>
            <span class="ctx-item ctx-halving" title="Next halving block">
                <span class="ctx-icon">🎯</span>
                Halving: <strong>${halving.blocksLeft.toLocaleString()} blocks</strong>
                <span class="ctx-sub">~${halving.daysLeft} days</span>
            </span>`;
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
.ctx-sub {
    color: #888;
    font-size: 0.88em;
    margin-left: 0.15rem;
}
.ctx-sep { color: #444; }
.ctx-fee-low strong  { color: #4ade80; }
.ctx-fee-mid strong  { color: #facc15; }
.ctx-fee-high strong { color: #f87171; }
.ctx-halving strong  { color: #c084fc; }
.ctx-loading { color: #666; font-style: italic; }
.ctx-err     { color: #f87171; }
.ctx-explorer {
    color: #f7931a;
    text-decoration: none;
    opacity: 0.75;
    margin-left: auto;
    white-space: nowrap;
    transition: opacity 0.2s;
}
.ctx-explorer:hover { opacity: 1; }
.ctx-close {
    background: none;
    border: none;
    color: #555;
    cursor: pointer;
    font-size: 0.85rem;
    padding: 0 0.2rem;
    transition: color 0.2s;
}
.ctx-close:hover { color: #aaa; }
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
