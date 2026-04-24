# Demo truthfulness audit — 2026-04-24

**Scope:** all 52 interactive demos audited for factual accuracy against April 2026 Bitcoin reality, cross-referenced against [`SOURCES.md`](../SOURCES.md).

**Detailed reports** (source-of-truth per batch — read these for line-numbered fixes):
- [`demo-audit-economics.md`](demo-audit-economics.md) — 16 demos, 46 findings
- [`demo-audit-protocol.md`](demo-audit-protocol.md) — 18 demos, 46 findings
- [`demo-audit-custody.md`](demo-audit-custody.md) — 18 demos, 43 findings

---

## Headline numbers

| Severity | Economics | Protocol | Custody | **Total** |
|---|---:|---:|---:|---:|
| 🔴 Wrong (teaches incorrect facts) | 18 | 12 | 11 | **41** |
| 🟡 Misleading / stale | 17 | 24 | 18 | **59** |
| 🟢 Could be sharper | 11 | 10 | 14 | **35** |
| **Total findings** | **46** | **46** | **43** | **135** |

**~80% of demos have at least one finding.** Some demos have none (noted as "strong" below — use as quality bar).

---

## TOP 10 priority fixes (🔴 ship first)

Ordered by "how wrong is the thing we're teaching." These mislead learners about Bitcoin itself — not just stale numbers.

| # | Demo | Issue | Fix | Report |
|---|---|---|---|---|
| 1 | `sat-stacking-calculator` | Advertises "historical backtesting" but actually generates **random prices around $30K with an upward trend** (L463–485). Lies about what it's computing. | Either rewire to real historical price series (e.g. CoinGecko range-query endpoint) or rename + clearly label as "simulation with assumed trend." | economics |
| 2 | `bitcoin-layers-map` | L1150: invents a non-existent opcode `OP_WITHDRAWPROOFVERIFY` for BIP 300 | Use actual BIP 300 primitives (`OP_DRIVECHAIN` proposal) or drop the low-level detail | protocol |
| 3 | `network-consensus-demo` | L320: claims "6 conf ≈ 2^6 difficulty to reverse ≈ $64M" — **bogus formula**. Reorg cost is NOT exponential in confirmations. | Use the Nakamoto whitepaper formula (Section 11) or cite mempool.space confirmation cost estimator | protocol |
| 4 | `consensus-game` | Q4: claims 40%-attacker/6-conf reorg probability is ~0.09%. **Actual per whitepaper ~17.7%** — off by ~200×. | Recalculate using Nakamoto's formula and update answer key | protocol |
| 5 | `mining-simulator` | L633: "256^3 = 16,777,216 attempts" for 3 hex-leading-zero difficulty. **Should be 16^3 = 4,096.** Off by 4,000×. | Fix formula; note each hex char = 4 bits = 16 possibilities | protocol |
| 6 | `double-spending-demo` | L583: claims reorg probability = 0.5^n. **Only true at exactly 50% attacker** — misleading for any other case. | Use Poisson-based formula or explicit piecewise | protocol |
| 7 | `bitcoin-unit-converter` | L662: mBTC = "1 thousand sats" (contradicts demo's own conversion table — correct is 100,000 sats). | Single-number fix; table in same file already has correct value | protocol |
| 8 | Multiple custody demos | **Samourai / Whirlpool listed as live privacy tool** — DOJ takedown happened April 2024. Occurs across 4 demos. | Replace with current coinjoin options or flag as "no longer operating" | custody |
| 9 | Multiple custody demos | **Wasabi zkSNACKs coordinator shutdown (June 2024) missed** — still referenced as active | Update or remove references | custody |
| 10 | `bitcoin-ira-decision-tool` | 2025 Roth IRA phase-out quoted as $161K/$240K; actual $150K/$236K. Financial advice error. | Update with current IRS figures; cite source | economics |

---

## Cross-cutting architectural observations

Before fixing individual demos, consider these patterns — one architectural change resolves many findings at once.

### 1. ~30% of findings are stale hardcoded network data

Price, hashrate, difficulty, supply, block height — hardcoded at different snapshots across many demos. The site **already ships** `js/bitcoin-data-reliable.js` (multi-source fallback: CoinGecko, mempool.space, Blockchain.info, Kraken) per [`CLAUDE.md`](../CLAUDE.md). It's used on the homepage bitcoin context bar but few demos adopt it.

**Proposed fix:** audit each demo for hardcoded stats, replace with `data-btc-*` attributes that `bitcoin-data-reliable.js` populates. One PR per batch.

**Estimated impact:** resolves ~40 of 135 findings (majority of 🟡 and some 🔴).

### 2. "The 2025 gap"

Four demos stop their data at end-2024 and present it as current (April 2026). `debt-crisis`, `savings-disappear-scenario`, `mining-economics-demo`, others. Not "wrong" — frozen.

**Proposed fix:** same as #1 (wire to live data) or explicit "as of YYYY-MM" badges on each snapshot.

### 3. Defunct / restricted services listed as current

- **Samourai / Whirlpool** — DOJ takedown April 2024 (4 demos affected)
- **Wasabi (zkSNACKs coord)** — shutdown June 2024
- **Paxful** — shut down/relaunched under new ownership
- **Caravan** — archived by Unchained
- **Phoenix / Breez / Wallet of Satoshi** — restricted or left US market
- **FTX, Celsius, Voyager** — long since collapsed; any demo still listing them as onramps is a legal liability as much as a truth issue

**Proposed fix:** a single `SERVICE_STATUS.md` in `/docs/` listing current vs retired tools, with a lint script that flags demos referencing retired names. Ship once, enforce forever.

### 4. Post-2023 Bitcoin reality missing

- **Ordinals / BRC-20 / Runes** — no demo acknowledges their impact on fee markets. Pre-Ordinals fee-dynamics models are now incomplete.
- **Taproot** — live since Nov 2021; `bitcoin-key-generator-visual` missing BIP86 path `m/86'/0'/0'/0/i`
- **Lightning evolution** — BOLT12 offers, channel splicing, PTLCs — none referenced

**Proposed fix:** per-topic content refresh. Lower urgency than #1-3 but needed for "Builder" and "Sovereign" persona credibility.

### 5. Unsourced statistics everywhere

Claims like "20% of BTC lost," "95% multisig success rate," "$650M lost in exchange hacks," "99.98% Lightning uptime" — all appear without citations. Violates your own [`SOURCES.md`](../SOURCES.md) principle ("truth over trust").

**Proposed fix:** convert to `<span class="unsourced" data-needs-citation="claim-id">...</span>` via grep, generate a punchlist, cite or remove one by one.

### 6. Projection framed as history

`savings-disappear-scenario` and `debt-crisis` render forward-looking speculative values as narrative fact without "scenario" or "forecast" badges.

**Proposed fix:** visual badge component (already exists as `lab-badge` in lab-guide.css) applied consistently to forecast sections.

---

## Strong demos — use as quality bar

Per the protocol-batch audit, three demos had zero or near-zero findings:
- `digital-signatures-demo`
- `time-chain-explorer`
- `bitcoin-key-generator-visual`

Read these before authoring new content.

---

## Recommended action plan

### Tier 1 — This week (🔴 factual errors teaching wrong things)

Ship one PR per demo for the TOP 10 above. Order:

1. `sat-stacking-calculator` — rename or rewire (biggest lie of the batch)
2. `network-consensus-demo` + `consensus-game` + `double-spending-demo` — reorg/security math corrections (one PR, three files)
3. `mining-simulator` — hash-attempts formula fix
4. `bitcoin-unit-converter` — mBTC single-number fix
5. `bitcoin-layers-map` — drop invented opcode
6. Custody cluster: remove Samourai/Whirlpool, fix Wasabi references, update HW wallet models
7. `bitcoin-ira-decision-tool` — current IRS figures

**Owner:** whoever picks up TASKS.md → B1
**Effort:** ~1 day per 3-4 fixes if running in parallel

### Tier 2 — Next sprint (🟡 stale data, architectural fixes)

Two PRs:
1. **Live-data pipeline adoption** — wire all demos with hardcoded network stats to `js/bitcoin-data-reliable.js`
2. **Defunct-services lint** — ship `docs/SERVICE_STATUS.md` + a grep-based CI check

**Estimated coverage:** resolves ~60 of 135 findings in two commits.

### Tier 3 — Backlog (🟢 sharpening for Builder/Principled personas)

Individual demo refinements. Pick up during normal content-quality passes.

---

## Meta

- **Reviewer bandwidth:** the three detailed reports total ~921 lines (line-numbered fixes ready to apply). A Claude session with `Edit` can clear Tier 1 top-10 in one afternoon.
- **Coverage of your founding rule:** CLAUDE.md's #1 instruction is "always verify truth of content in platform." Pre-audit, ~80% of demos had unverified claims. This audit is the first systematic verification pass ever done; institutionalizing it (run quarterly) would keep drift bounded.
- **Next audit cadence:** quarterly, or whenever 10+ demos get meaningful edits.
