# TOOLS-QA-REPORT

Audit date: 2026-06-23. Lightweight static QA across the 25 Tools Library entries. Checks were performed by reading source and route resolution on disk, plus targeted scans (em-dash byte counts, API references, DOM-target sanity). No dev server runtime was driven for every tool; "mounts cleanly" reflects static inspection of script references and DOM target IDs, not a live console capture for all 25. Items that warrant a live console check are flagged.

## Summary

| Check | Result |
|-------|--------|
| Route exists (resolves on disk) | 25 / 25 pass |
| Mounts cleanly (static: DOM targets + script refs present) | 25 / 25 pass, no broken refs found |
| No literal em dash (U+2014) in file | 18 / 25 pass, **7 files fail** (see below) |
| No obvious missing DOM target | 25 / 25 pass |
| Mobile layout: no high risk | 21 / 25 low, **4 flagged** |
| ES translation present | 0 / 25 (systemic gap) |
| Dedicated test coverage | 0 / 25 |
| Uses live data / external API | 6 / 25 |

No P0 runtime breakage was found. The recurring real problems are: em dashes, zero Spanish coverage, stale hardcoded data shown as current, and a couple of safety/labeling issues.

## 1. Route exists

All 25 card targets resolve to a file on disk (verified 2026-06-23). Standalone pages confirmed: `/emergency-kit.html`, `/multisig-security-demo.html`, `/interactive-demos/security-risk-simulator.html`. Directory tools resolve via `index.html`. The Advisor Readiness Kit card resolves to `/institutional/wealth-advisors/kit/index.html`.

## 2. Mounts cleanly / DOM targets

Static inspection found no broken script `src` references and no JS `getElementById` / query targets missing from the markup across the 25 tools. Shared dependencies referenced and present include `/js/icon-library.js`, `/js/widgets/api-handler.js`, `/js/bitcoin-data-reliable.js`, `/js/reflect-widget.js`, `/js/membership-gate.js`, and the subdomain/demo-lock scripts.

Recommend a live console pass (preview server) for the API-driven tools specifically, since their happy path depends on network responses: Unit Converter, Fee Master Tool, Address Format Explorer, DCA Time Machine, and the three `bitcoin-data-reliable.js` consumers (Supply Schedule, Time Chain, Difficulty Calculator).

## 3. Em dashes (U+2014) — FAIL on 7 files

Authoritative count via Python (U+2014 only; en dashes U+2013 excluded). The no-em-dash rule applies to shipped strings, comments, and specs, so JS-comment occurrences count.

| File | Tool | U+2014 count | Where |
|------|------|--------------|-------|
| multisig-security-demo.html | Multisig Security Demo | 14 | data attributes + explanatory text |
| interactive-demos/bitcoin-key-generator-visual/bitcoin-crypto.js | Key Generator Visual | 13 | code comments |
| emergency-kit.html | Emergency Kit | 10 | body copy (user-facing) |
| institutional/wealth-advisors/kit/index.html | Advisor Readiness Kit | 4 | title, subtitle, headers |
| interactive-demos/sovereign-vault/templates/emergency-doc.html | Sovereign Vault | 2 | generated-document template (user-facing) |
| interactive-demos/transaction-builder/transaction-builder-enhanced.js | Transaction Builder | 1 | string/comment |
| interactive-demos/mining-simulator/mining-enhanced.js | Mining Simulator | 1 | user-facing stat string |

Total: 45 em dashes across 7 files. Highest priority for cleanup are the user-facing ones: Emergency Kit (10), Sovereign Vault template (2), Mining Simulator (1). Replace with comma, colon, parentheses, or period; preserve en dashes in numeric ranges.

The other 18 tool files are clean of U+2014.

## 4. Missing DOM target

None found. Where tools build UI from data arrays (UTXO Visualizer scenarios, Money Properties cards, Security Dojo stations), the container targets exist and the JS guards are present.

## 5. Mobile layout risk — 4 flagged

Most tools are responsive (media queries, 44px touch targets, single-column reflow under 768px). Flagged for a mobile pass:

- **Lightning Network Lab** (P3): SVG network diagram is a fixed 350px height with no responsive `viewBox`; risk of horizontal scroll on small screens.
- **Supply Schedule & Halvings** (P2): canvas chart relies on mouse pan/zoom; no touch gesture support.
- **Time Chain Explorer** (P2): scrollable block-stream is narrow and busy on small screens.
- **Bitcoin Key Generator Visual** (P2): bit grid reflows, but the curve canvas (~350px) is not tuned for landscape mobile.
- Minor: **Sovereign Vault** sticky sidebar can overlap content under 600px (watch during any rework).

No tool uses a fixed pixel-width layout that traps content.

## 6. Missing translation keys / ES parity — systemic

0 of 25 tools have a Spanish version or any i18n keying (no `data-i18n`, no `es/` subdir, no language toggle). There are therefore no "missing translation keys" in the technical sense, because no tool is wired for translation at all. Given the locked "Bilingual. LATAM-fluent." identity, the highest-value ES candidates are the beginner/LATAM-facing tools: On-Ramp Chooser, KYC Best Practices, Money Properties Comparison, Bitcoin vs Banking (post-rebuild), Unit Converter, and the Security Risk Simulator.

## 7. Test coverage

No dedicated test exists for any of the 25 tools. Related tests in `tests/` cover other surfaces: `interactive-tools.measure-drift.test.mjs` (a different interactive tool), `wealth-advisor-course.test.mjs` and `check-wealth-advisor-module.mjs` (advisor course/module gating, not the kit-preview page), plus `module-gate`, `premium-routes`, `premium-route-access`, and `youth-engine` tests. The interactive tools are entirely uncovered. Lightweight smoke tests worth adding: data-fetch success/fallback for the API tools, and score-calculation determinism for the assessment tools (Security Dojo, Security Risk Simulator, Sovereign Vault resilience score).

## 8. Live data / external APIs

| Tool | Source | Fallback behavior |
|------|--------|-------------------|
| Bitcoin Unit Converter | CoinGecko (5-min refresh) | Labeled hardcoded fallback prices |
| Fee Master Tool | mempool.space + CoinGecko (via api-handler, 30s) | Hardcoded ~$95k price fallback, not user-prominent |
| Address Format Explorer | mempool.space + Blockstream (fee rate) | 5s timeout to 20 sat/vB default |
| DCA Time Machine | CryptoCompare histoday (24h localStorage cache) | Retry button; no fake prices shown |
| Sat Stacking Calculator | bundled blockchain.info monthly JSON (24h cache) | Labeled stale fallback ($97k) |
| Supply Schedule / Time Chain / Difficulty Calculator | attempt bitcoin-data-reliable.js | **Falls back to stale hardcoded values shown as current** (see below) |

The first five degrade gracefully and label fallbacks. The three `bitcoin-data-reliable.js` consumers do not: they display stale snapshots (Supply "19.6M", height 880k, Jan-2025 difficulty, ~400 EH/s) as if current. This is the main accuracy QA concern.

## 9. Bitcoin accuracy and safety flags

No altcoin or generic-crypto framing found in any of the 25 tools. No financial advice found; risk-bearing tools carry disclaimers. Collaborative-security framing in the Multisig Demo and Security Risk Simulator is correct ("self-custody with guardrails", "no single party moves funds alone"), not framed as a path toward custody. Specific items to address:

- **Sovereign Vault — accuracy + safety (P1):** "zero-knowledge encryption" is an overclaim; the implementation is client-side AES-GCM with PBKDF2, which is not zero-knowledge. Reword to "client-side encrypted." Separately, free-text fields could tempt a learner to paste a real seed phrase; add input validation and an explicit warning. Vault data stays in localStorage (no network send observed), which is good.
- **Address Format Explorer — safety (P1):** generated addresses are intentionally fake (acknowledged in code) but the "demo only, do not fund" warning is weak; make it prominent so a learner cannot mistake them for real addresses.
- **Wallet Security Workshop — UX/safety (P2):** the passphrase field (`type="password"`, client-side only, no exfiltration risk) reads ambiguously as a real-entry field; relabel as demo-only or add a banner.
- **Stale-data accuracy (P1/P2):** Difficulty Calculator (P1), Supply Schedule, Time Chain, Mining Simulator show outdated figures as current. Fix via live fetch with a clearly labeled fallback.

## Suggested QA follow-ups (not done in this pass)

1. Run a live preview console-error sweep on the 6 API-driven tools (and confirm fallback paths render without throwing).
2. Em-dash cleanup across the 7 files in section 3, user-facing strings first.
3. Add data-fetch and score-determinism smoke tests for the API and assessment tools.
4. Decide ES rollout order for the LATAM-facing beginner tools.
