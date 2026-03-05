/**
 * Referral Program Component
 * Renders a referral section for paid members (Apprentice/Sovereign).
 * Shows shareable link, copy button, stats, and reward tiers.
 */
(function () {
    'use strict';

    const API_BASE = '/api/referrals';
    const REWARDS = { apprentice: '5,000', sovereign: '10,000' };

    function getAuthToken() {
        return localStorage.getItem('auth_token') || '';
    }

    function getMembershipTier() {
        try {
            const m = JSON.parse(localStorage.getItem('bsa-membership') || '{}');
            return m.tier || 'explorer';
        } catch { return 'explorer'; }
    }

    /** Store referral code from URL param when a visitor lands */
    function captureReferralFromURL() {
        const params = new URLSearchParams(window.location.search);
        const ref = params.get('ref');
        if (ref) {
            localStorage.setItem('bsa-referral-code', ref);
        }
    }

    /** Fetch or generate the user's referral code */
    async function fetchReferralLink() {
        const token = getAuthToken();
        if (!token) return null;

        try {
            const res = await fetch(`${API_BASE}?action=generate`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            });
            if (!res.ok) return null;
            return res.json();
        } catch { return null; }
    }

    /** Fetch referral stats */
    async function fetchStats() {
        const token = getAuthToken();
        if (!token) return null;

        try {
            const res = await fetch(`${API_BASE}?action=stats`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) return null;
            return res.json();
        } catch { return null; }
    }

    /** Copy text to clipboard and flash feedback */
    function copyToClipboard(text, btn) {
        navigator.clipboard.writeText(text).then(() => {
            const orig = btn.textContent;
            btn.textContent = '✓ Copied!';
            setTimeout(() => (btn.textContent = orig), 2000);
        });
    }

    /** Inject styles (scoped to .referral-section) */
    function injectStyles() {
        if (document.getElementById('referral-program-styles')) return;
        const style = document.createElement('style');
        style.id = 'referral-program-styles';
        style.textContent = `
            .referral-section {
                background: linear-gradient(135deg, rgba(147, 51, 234, 0.08) 0%, rgba(247, 147, 26, 0.08) 100%);
                border: 2px solid rgba(247, 147, 26, 0.25);
                border-radius: 20px;
                padding: 2.5rem;
                margin: 3rem 0;
            }
            .referral-section h2 {
                font-size: 1.5rem;
                margin-bottom: 0.5rem;
                color: #f7931a;
            }
            .referral-section .subtitle {
                color: #999;
                margin-bottom: 1.5rem;
                font-size: 0.95rem;
            }
            .referral-link-box {
                display: flex;
                gap: 0.5rem;
                margin-bottom: 1.5rem;
            }
            .referral-link-box input {
                flex: 1;
                background: #0f0f0f;
                border: 1px solid #2d2d2d;
                border-radius: 10px;
                padding: 0.75rem 1rem;
                color: #e0e0e0;
                font-family: monospace;
                font-size: 0.85rem;
            }
            .referral-link-box button {
                background: linear-gradient(135deg, #f7931a 0%, #ffb347 100%);
                color: #000;
                border: none;
                padding: 0.75rem 1.25rem;
                border-radius: 10px;
                font-weight: 700;
                cursor: pointer;
                white-space: nowrap;
                transition: transform 0.2s, box-shadow 0.2s;
            }
            .referral-link-box button:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 16px rgba(247, 147, 26, 0.3);
            }
            .referral-stats {
                display: flex;
                gap: 1.5rem;
                flex-wrap: wrap;
                margin-bottom: 1.5rem;
            }
            .referral-stat {
                background: #1a1a1a;
                border: 1px solid #2d2d2d;
                border-radius: 12px;
                padding: 1.25rem 1.5rem;
                flex: 1;
                min-width: 140px;
                text-align: center;
            }
            .referral-stat .num {
                font-size: 1.75rem;
                font-weight: 800;
                color: #f7931a;
                display: block;
            }
            .referral-stat .lbl {
                font-size: 0.8rem;
                color: #999;
                margin-top: 0.25rem;
            }
            .referral-rewards {
                background: rgba(76, 175, 80, 0.08);
                border: 1px solid rgba(76, 175, 80, 0.25);
                border-radius: 12px;
                padding: 1rem 1.25rem;
                font-size: 0.9rem;
                color: #4CAF50;
            }
            .referral-rewards strong { color: #66bb6a; }
            .referral-loading {
                text-align: center;
                padding: 2rem;
                color: #999;
            }
            @media (max-width: 600px) {
                .referral-section { padding: 1.5rem; }
                .referral-link-box { flex-direction: column; }
                .referral-stats { flex-direction: column; }
            }
        `;
        document.head.appendChild(style);
    }

    /** Build and mount the referral UI into the given container */
    async function mount(container) {
        const tier = getMembershipTier();
        if (tier !== 'apprentice' && tier !== 'sovereign') return;

        injectStyles();

        container.innerHTML = `
            <section class="referral-section">
                <h2>🔗 Refer Friends, Earn Sats</h2>
                <p class="subtitle">Share your link. When a friend joins, you both benefit.</p>
                <div class="referral-loading">Loading your referral link…</div>
            </section>
        `;

        const section = container.querySelector('.referral-section');

        // Fetch data in parallel
        const [linkData, statsData] = await Promise.all([fetchReferralLink(), fetchStats()]);

        // Remove loading
        const loading = section.querySelector('.referral-loading');
        if (loading) loading.remove();

        if (!linkData && !getAuthToken()) {
            section.innerHTML += `
                <p style="color:#999;text-align:center;padding:1rem;">
                    <a href="/account.html" style="color:#f7931a;text-decoration:underline;">Sign in</a> to get your personal referral link.
                </p>`;
            return;
        }

        // Referral link
        const link = linkData?.link || '';
        const linkBox = document.createElement('div');
        linkBox.className = 'referral-link-box';
        linkBox.innerHTML = `
            <input type="text" value="${link}" readonly id="referral-link-input">
            <button id="referral-copy-btn">📋 Copy Link</button>
        `;
        section.appendChild(linkBox);

        const copyBtn = linkBox.querySelector('#referral-copy-btn');
        copyBtn.addEventListener('click', () => {
            copyToClipboard(link, copyBtn);
            if (window.bsaAnalytics) window.bsaAnalytics.trackReferralShare(linkData?.code);
        });

        // Stats
        const stats = statsData || { totalReferrals: 0, conversions: 0, totalSatsEarned: 0 };
        const statsEl = document.createElement('div');
        statsEl.className = 'referral-stats';
        statsEl.innerHTML = `
            <div class="referral-stat">
                <span class="num">${stats.totalReferrals}</span>
                <span class="lbl">Invites Sent</span>
            </div>
            <div class="referral-stat">
                <span class="num">${stats.conversions}</span>
                <span class="lbl">Conversions</span>
            </div>
            <div class="referral-stat">
                <span class="num">${stats.totalSatsEarned.toLocaleString()}</span>
                <span class="lbl">Sats Earned</span>
            </div>
        `;
        section.appendChild(statsEl);

        // Reward tiers
        const rewards = document.createElement('div');
        rewards.className = 'referral-rewards';
        rewards.innerHTML = `
            ⚡ <strong>${REWARDS.apprentice} sats</strong> per Apprentice referral &nbsp;·&nbsp;
            👑 <strong>${REWARDS.sovereign} sats</strong> per Sovereign referral
        `;
        section.appendChild(rewards);
    }

    // Auto-capture referral code from URL on any page
    captureReferralFromURL();

    // Expose for manual mounting
    window.referralProgram = { mount };

    // Auto-mount if container exists
    document.addEventListener('DOMContentLoaded', () => {
        const el = document.getElementById('referral-program');
        if (el) mount(el);
    });
})();
