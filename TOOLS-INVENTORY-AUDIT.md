# TOOLS-INVENTORY-AUDIT

Audit date: 2026-06-23. Audit only, no code changed. Branch at audit time: `feat/m4-measure-drift-clean`.

## Scope

The "Tools Library" page at `/tools/index.html` is a curated catalog of 25 learner-facing tool cards. Those 25 cards are the audit scope. They point mostly to `/interactive-demos/<name>/` plus a handful of standalone pages.

Out of scope (noted, not audited as learner tools): the other files in `/tools/` are devops and build scripts, not learner experiences: `deploy-automation.js`, `domain-config.js`, `domain-monitor.js`, `domain-test-suite.js`, `seo-optimizer.js`, `security-headers.js`, `site-enhancer.js`, `content-validator.js`, `registry.js`, `bundle-assets.js`, `check-unique-ids.js`, `test-tenants.js`, `test-domain.sh`, `vercel-weekly-maintenance.sh`, plus `domain-dashboard.html` and `bitcoin-recovery-binder.html` (the binder is a standalone utility, not linked from the Tools Library grid).

## Scoring rubric

Each tool scored 1 to 5. For the three RISK dimensions, **5 means highest risk** (worst). For the other five, **5 means best**.

- Ped = Pedagogical strength
- Int = Interactivity
- Acc = Bitcoin accuracy
- Clar = Beginner clarity
- MobR = Mobile usability RISK (5 = most likely to break on mobile)
- SafeR = Safety / advice RISK (5 = most concerning)
- ESR = EN/ES parity RISK (5 = bilingual audience most underserved by missing ES)
- Reuse = Reuse potential across BSA / FSA / TSA

Classification key: **Strong** = learner makes meaningful choices, sees consequences, understands the mechanism. **Useful but shallow** = mostly calculates, compares, reveals, or explains without making the learner reason. **Needs repair** = broken behavior, weak/persuasive copy, stale assumptions, or unclear outcome. **Upgrade candidate** = teaches an important idea but should be rebuilt into choice to consequence to reflection.

Priority key: **P0** broken/wrong/safety blocker · **P1** high value (fix or upgrade soon) · **P2** useful cleanup or mid upgrade · **P3** already strong, leave alone.

## Headline counts

- 25 tools, all 25 routes resolve on disk.
- Classification: **Strong 12**, **Useful but shallow 9**, **Needs repair 2**, **Upgrade candidate 2**.
- Priority: **P0 0**, **P1 9**, **P2 12**, **P3 4**.
- 0 of 25 have a Spanish (ES) version or any i18n keying. This is the single most systemic gap given the locked "Bilingual. LATAM-fluent." identity.
- 0 of 25 have a dedicated test file. (`tests/interactive-tools.measure-drift.test.mjs` covers a different tool; `tests/wealth-advisor-course.test.mjs` and `tests/check-wealth-advisor-module.mjs` touch the advisor area but not the kit-preview page directly.)

## Master table

| # | Tool | URL | Category | Classification | Priority | Main issue | Recommended action |
|---|------|-----|----------|----------------|----------|-----------|--------------------|
| 1 | On-Ramp Chooser | /interactive-demos/onramp-chooser/ | Essential | Strong | P2 | Fee/method data hardcoded (Dec 2025), no ES for a LATAM-critical tool | Schedule a quarterly data refresh; plan ES |
| 2 | Bitcoin Emergency Kit | /emergency-kit.html | Essential | Strong | P1 | 10 em dashes in body copy | Em-dash cleanup; otherwise keep |
| 3 | Bitcoin Unit Converter | /interactive-demos/bitcoin-unit-converter/ | Essential | Useful but shallow | P3 | Pure calculator, no reasoning | Add a reflect prompt (when sats vs BTC?) |
| 4 | Sat Stacking Calculator | /interactive-demos/sat-stacking-calculator/ | Essential | Strong | P3 | None blocking | Optional: show sats accumulated |
| 5 | DCA Time Machine | /interactive-demos/bitcoin-dca-time-machine/ | Essential | Upgrade candidate | P2 | Strong guess-reveal mechanic underused | Add behavioral "would you have held?" loop |
| 6 | KYC Best Practices | /interactive-demos/kyc-best-practices/ | Essential | Useful but shallow | P2 | Recommends, never shows consequence | Add privacy-leak consequence trace |
| 7 | Fee Master Tool | /interactive-demos/fee-master-tool/ | Transaction | Strong | P3 | Decide-tab logic opaque | Optional: expose threshold formula |
| 8 | UTXO Visualizer | /interactive-demos/utxo-visualizer-enhanced/ | Transaction | Strong | P1 | Privacy score is a black box | Surface the privacy calculation inline |
| 9 | Transaction Builder | /interactive-demos/transaction-builder/ | Transaction | Useful but shallow | P2 | Builds but shows no consequence of fee choice | Add raw-tx view or mempool placement |
| 10 | Address Format Explorer | /interactive-demos/address-format-explorer/ | Transaction | Strong | P1 | Generated addresses are fake but weakly labeled | Add a prominent "demo addresses" banner |
| 11 | Advisor Readiness Kit (preview) | /institutional/wealth-advisors/kit/ | Security | Useful but shallow | P2 | Catalog page, not a tool; 4 em dashes | Surface the free Seed-Phrase tool; em-dash cleanup |
| 12 | Security Risk Simulator | /interactive-demos/security-risk-simulator.html | Security | Strong | P1 | EN only; high-value, high reuse | Plan ES localization |
| 13 | Multisig Security Demo | /multisig-security-demo.html | Security | Strong | P1 | 14 em dashes; framing is correct | Em-dash cleanup; keep framing |
| 14 | Wallet Security Workshop | /interactive-demos/wallet-security-workshop/ | Security | Strong | P2 | Passphrase field reads ambiguously as real-entry | Relabel field as demo-only / add banner |
| 15 | Security Training Lab (Dojo) | /interactive-demos/security-dojo-enhanced/ | Security | Strong | P1 | Security score formula hidden | Add score breakdown to results |
| 16 | Bitcoin Key Generator Visual | /interactive-demos/bitcoin-key-generator-visual/ | Security | Strong | P2 | 13 em dashes in JS comments; canvas not mobile-tuned | Em-dash cleanup; mobile pass |
| 17 | Testnet Practice Guide | /interactive-demos/testnet-practice-guide/ | Security | Useful but shallow | P2 | Learn-by-reading, no embedded doing | Embed a sandbox or live explorer step |
| 18 | Sovereign Vault | /interactive-demos/sovereign-vault/ | Security | Useful but shallow | P1 | "Zero-knowledge" overclaim + a field that could tempt real seed entry | Fix claim to "client-side encrypted"; validate inputs |
| 19 | Lightning Network Lab | /interactive-demos/lightning-network-demo/ | Lightning | Useful but shallow | P3 | SVG network has no responsive viewBox | Add responsive viewBox; "what breaks?" section |
| 20 | Mining Simulator | /interactive-demos/mining-simulator/ | Mining | Upgrade candidate | P2 | Stale Nov-2024 stats; 1 user-facing em dash | Live difficulty fetch; add fee-market mini-game |
| 21 | Supply Schedule & Halvings | /interactive-demos/bitcoin-supply-schedule/ | Analysis | Useful but shallow | P2 | Hardcoded "19.6M" supply is stale; spectator-only | Live supply; add scarcity reasoning prompt |
| 22 | Time Chain Explorer | /interactive-demos/time-chain-explorer/ | Analysis | Useful but shallow | P2 | Simulated data, no live sync, no "what if" | Sync live block times; add variance reasoning |
| 23 | Difficulty Calculator | /interactive-demos/difficulty-calculator/ | Analysis | Needs repair | P1 | Stale Jan-2025 data + confusing "live data..." fallback | Live difficulty; fix fallback; add "why adjust?" |
| 24 | Bitcoin vs Banking | /interactive-demos/bitcoin-vs-banking/ | Analysis | Needs repair | P1 | Strawman comparison reads as persuasion, not information | Rebuild as a use-case decision tree (inform-not-convince) |
| 25 | Money Properties Comparison | /interactive-demos/money-properties-comparison/ | Analysis | Strong | P2 | None major; ES missing | Plan ES; optional self-score-first mode |

## Scores matrix

5 = best, except MobR / SafeR / ESR where 5 = highest risk.

| # | Tool | Ped | Int | Acc | Clar | MobR | SafeR | ESR | Reuse |
|---|------|-----|-----|-----|------|------|-------|-----|-------|
| 1 | On-Ramp Chooser | 5 | 5 | 5 | 5 | 1 | 1 | 5 | 4 |
| 2 | Emergency Kit | 5 | 4 | 5 | 5 | 1 | 1 | 5 | 3 |
| 3 | Unit Converter | 3 | 4 | 5 | 5 | 1 | 1 | 5 | 4 |
| 4 | Sat Stacking Calculator | 5 | 5 | 5 | 4 | 1 | 1 | 5 | 5 |
| 5 | DCA Time Machine | 4 | 5 | 5 | 4 | 1 | 1 | 5 | 4 |
| 6 | KYC Best Practices | 3 | 3 | 4 | 5 | 1 | 2 | 5 | 2 |
| 7 | Fee Master Tool | 4 | 5 | 5 | 5 | 1 | 1 | 4 | 4 |
| 8 | UTXO Visualizer | 5 | 5 | 4 | 4 | 2 | 1 | 4 | 3 |
| 9 | Transaction Builder | 3 | 4 | 4 | 4 | 1 | 2 | 4 | 3 |
| 10 | Address Format Explorer | 5 | 4 | 4 | 5 | 1 | 3 | 4 | 4 |
| 11 | Advisor Readiness Kit | 2 | 1 | 4 | 5 | 2 | 1 | 2 | 3 |
| 12 | Security Risk Simulator | 5 | 5 | 5 | 4 | 2 | 1 | 5 | 3 |
| 13 | Multisig Security Demo | 5 | 5 | 5 | 4 | 2 | 1 | 5 | 4 |
| 14 | Wallet Security Workshop | 5 | 5 | 5 | 4 | 3 | 2 | 5 | 4 |
| 15 | Security Training Lab (Dojo) | 5 | 5 | 4 | 5 | 2 | 1 | 5 | 4 |
| 16 | Bitcoin Key Generator Visual | 5 | 5 | 5 | 4 | 2 | 1 | 4 | 5 |
| 17 | Testnet Practice Guide | 3 | 3 | 4 | 5 | 2 | 2 | 5 | 2 |
| 18 | Sovereign Vault | 2 | 4 | 4 | 4 | 3 | 3 | 5 | 3 |
| 19 | Lightning Network Lab | 3 | 4 | 4 | 4 | 3 | 1 | 5 | 3 |
| 20 | Mining Simulator | 3 | 4 | 4 | 5 | 2 | 1 | 5 | 4 |
| 21 | Supply Schedule & Halvings | 2 | 4 | 5 | 3 | 3 | 1 | 5 | 3 |
| 22 | Time Chain Explorer | 2 | 3 | 4 | 4 | 3 | 1 | 5 | 2 |
| 23 | Difficulty Calculator | 2 | 3 | 4 | 3 | 2 | 2 | 5 | 3 |
| 24 | Bitcoin vs Banking | 1 | 3 | 3 | 3 | 2 | 3 | 5 | 2 |
| 25 | Money Properties Comparison | 4 | 4 | 5 | 5 | 1 | 1 | 5 | 4 |

## Files found per tool

| # | Tool | Files |
|---|------|-------|
| 1 | On-Ramp Chooser | index.html, onramp-data.js, onramp-logic.js |
| 2 | Emergency Kit | emergency-kit.html (self-contained) |
| 3 | Unit Converter | index.html (inline JS) |
| 4 | Sat Stacking Calculator | index.html, btc-monthly-history.json |
| 5 | DCA Time Machine | index.html (+ index.html.backup, stale) |
| 6 | KYC Best Practices | index.html |
| 7 | Fee Master Tool | index.html (uses /js/widgets/api-handler.js, /js/icon-library.js) |
| 8 | UTXO Visualizer | index.html (uses /js/icon-library.js) |
| 9 | Transaction Builder | index.html, transaction-builder-enhanced.js |
| 10 | Address Format Explorer | index.html, main.js, address-generator.js, fee-calculator.js, styles.css |
| 11 | Advisor Readiness Kit | kit/index.html (links tools/seed-phrase-red-flags.html, tools/client-script-builder.html) |
| 12 | Security Risk Simulator | security-risk-simulator.html (uses membership-gate.js, demo-nav.js, demo-cta-footer) |
| 13 | Multisig Security Demo | multisig-security-demo.html (uses icon-library, nav-context, demo-cta-footer) |
| 14 | Wallet Security Workshop | index.html (uses config.js, demo-lock-subdomain.js, subdomain-access-control.js, icon-library.js) |
| 15 | Security Training Lab (Dojo) | index.html (uses config.js, demo-lock-subdomain.js, subdomain-access-control.js) |
| 16 | Bitcoin Key Generator Visual | index.html, bitcoin-crypto.js |
| 17 | Testnet Practice Guide | index.html |
| 18 | Sovereign Vault | index.html, js/, css/, templates/emergency-doc.html (+ index.html.backup, stale) |
| 19 | Lightning Network Lab | index.html |
| 20 | Mining Simulator | index.html, mining-enhanced.js |
| 21 | Supply Schedule & Halvings | index.html (uses bitcoin-data-reliable.js, membership-gate.js) |
| 22 | Time Chain Explorer | index.html (uses bitcoin-data-reliable.js) |
| 23 | Difficulty Calculator | index.html (uses bitcoin-data-reliable.js) |
| 24 | Bitcoin vs Banking | index.html |
| 25 | Money Properties Comparison | index.html |

## Notes on data freshness and external APIs

Live or external data (good, keep): Unit Converter (CoinGecko), Fee Master Tool (mempool.space + CoinGecko via api-handler), Address Format Explorer (mempool.space + Blockstream fee rate), DCA Time Machine (CryptoCompare histoday), Sat Stacking (bundled blockchain.info monthly history, refreshed on load). Supply Schedule / Time Chain / Difficulty Calculator attempt live values via `bitcoin-data-reliable.js` but fall back to stale hardcoded snapshots that are user-visible.

Stale hardcoded values presented to the learner (fix in any upgrade): Supply Schedule "19.6M" current supply; Time Chain block height 880k; Difficulty Calculator Jan-2025 difficulty/hashrate with a confusing "live data..." placeholder; Mining Simulator Nov-2024 hashrate (~400 EH/s). Fallback prices in Unit Converter, Fee Master, and Sat Stacking are labeled and only show on API failure, which is acceptable.
