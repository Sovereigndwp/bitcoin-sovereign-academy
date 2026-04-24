# Demo truthfulness audit — Protocol batch (2026-04-24)

## Summary
- Demos audited: 18
- 🔴 Wrong: 12 findings across 7 demos
- 🟡 Misleading / stale: 24 findings across 14 demos
- 🟢 Could be sharper: 10 findings across 8 demos

Audit cross-references `SOURCES.md` (April 2026) and canonical BIP specs. "Post-2023" = Ordinals/BRC-20/Runes era fee-market framing. Per SOURCES.md, block time is ~10 minutes, difficulty adjustment every 2,016 blocks, halving every 210,000 blocks — these were checked throughout.

---

## Findings

### address-format-explorer

**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/address-format-explorer/index.html`
**One-line pitch:** Interactive comparison of Legacy/P2SH/SegWit/Taproot address formats with fee-savings calculator.

🟡 **Misleading**
- L62: Timeline labels P2SH (2012) as "Multi-sig support." P2SH (BIP16) enables arbitrary redeem scripts, not only multisig. Fix: "Arbitrary script support (inc. multisig)".
- L276: "Taproot ~52% fee savings vs Legacy" — only for single-key 1-in-1-out spends. For multi-sig spends (where Taproot's biggest gain is), the percentage is different. Fix: qualify as "for typical 1-in-2-out single-key spends."
- L491: "Most modern wallets (2020+) support all formats" — Taproot wallet support was mostly added in 2022-2023; claiming 2020 overstates readiness. Fix: "(2022+)".

🟢 **Could be sharper**
- Fee examples assume BTC=$100k flat — with April 2026 prices, the calculator still computes correctly but example banner "Save $550/year" depends on fee rate 20 sat/vB which is low vs typical post-Ordinals conditions.
- No mention that Taproot addresses (bc1p) are now the recommended default for privacy-conscious users; demo still recommends SegWit as "default for most users." Could be updated.

---

### bitcoin-key-generator-visual

**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/bitcoin-key-generator-visual/index.html`
**One-line pitch:** Visual pipeline entropy → mnemonic → seed → master key → public key → addresses.

🟡 **Misleading**
- L283: "2²⁵⁶ Possible keys" — strictly, valid secp256k1 private keys are in [1, n-1] where n < 2²⁵⁶ (about 2²⁵⁶ − 2³², negligible). The "2²⁵⁶" framing is standard shorthand but slightly inexact. Fix: add footnote "(practically 2²⁵⁶; precisely n ≈ 2²⁵⁶ − 2³²)".
- L371: "PBKDF2 (2048 iter) HMAC-SHA-512" — correct per BIP39 (matches SOURCES.md on BIP specs). No fix needed.

🟢 **Could be sharper**
- Only shows BIP44 (legacy, m/44'/0'/0'/0/i) and BIP84 (SegWit, m/84'/0'/0'/0/i). Missing BIP86 Taproot path (m/86'/0'/0'/0/i → bc1p…) which is important given Taproot has been live since November 2021. Fix: add a third HD table for BIP86.
- No mention of Schnorr signatures or x-only pubkeys — elliptic curve section still describes only ECDSA-style K = k·G usage (which is fine, but could note BIP340 uses x-only P).

---

### bitcoin-layers-map

**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/bitcoin-layers-map/index.html`
**One-line pitch:** Interactive map of Bitcoin layers (Base, Lightning, Liquid, Fedimint, Drivechains).

🔴 **Wrong**
- L834: "Network Capacity ~5,000 BTC" — public Lightning capacity as of April 2026 is ~4,500 BTC, declining since 2022. Fix: "~4,500 BTC (public channels only)".
- L838: "Public Channels ~50,000" — public channel count has dropped to ~40,000-45,000 as of April 2026. Fix: "~40,000 public".
- L1150: "BIP 300: OP_WITHDRAWPROOFVERIFY (hashrate escrow)" — BIP 300 does not define an opcode named `OP_WITHDRAWPROOFVERIFY`. BIP 300 specifies hashrate escrows via new block-level data structures; there is no such opcode. Fix: remove or rename to "BIP 300 defines hashrate escrows via M1-M4 commitments in coinbase outputs."

🟡 **Misleading**
- L1035: "Block size: 1-4MB (SegWit)" — technically blocks are capped at 4M weight units, not "1-4MB" range. Typical blocks are ~1.5-2MB with witness data. Fix: "Block weight: up to 4M WU (≈1-2MB typical)".
- L1332: "Lightning: >>1M tx/s" and "Fedimint: >>1M tx/s" scalability — theoretical upper bounds, not observed. Fix: "theoretical" qualifier.
- L1330: "Bitcoin Base: ~7 tx/s → ~400k transactions/day" — 7 tx/s is an older estimate based on 250-byte transactions; with SegWit/Taproot batching, effective throughput is closer to 10-15 tx/s. Fix: "5-15 tx/s depending on tx mix".

🟢 **Could be sharper**
- "Emerging Protocols" section misses BOLT12 (widely deployed by 2026), Ark (mentioned but not accurately characterized), and Taproot Assets (mentioned but conflated with RGB — they are separate protocols from Lightning Labs).

---

### bitcoin-unit-converter

**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/bitcoin-unit-converter/index.html`
**One-line pitch:** Converter between BTC/sats/mBTC/bits and fiat currencies.

🔴 **Wrong**
- L662: "mBTC (1 thousand sats)" — **internally contradicts** the reference table at L617 which correctly says mBTC = 100,000 sats. 1 mBTC = 0.001 BTC = 100,000 sats. Fix: "mBTC (100 thousand sats)".

🟢 **Could be sharper**
- Fallback price USD $100,000 is reasonable but stale for April 2026 (BTC around $110-130k range). Fallback is only used when CoinGecko fails, so low impact.

---

### bolt11-decoder

**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/bolt11-decoder/index.html`
**One-line pitch:** Educational BOLT11 Lightning invoice format decoder.

🟡 **Misleading**
- L484: "lnbc (mainnet) or lntb (testnet)" — BOLT11 also defines `lntbs` (signet) and `lnbcrt` (regtest). Fix: "…or lntbs (signet), lnbcrt (regtest)".
- L575: displayed "Payment Hash" is just the last 64 characters of the raw invoice string — not the actual bech32-decoded payment hash. Similarly L576 "Destination Node" is a placeholder. The UI labels these as if they were real decoded values. Fix: add "(simplified display — actual decoding requires bech32 parsing)" caveat, or implement real decoding.
- L573: "Expires in 1 hour (default)" — BOLT11 default expiry is 3600 seconds, correct, but this hardcoded value is displayed regardless of the actual `x` tag in the invoice. Fix: parse the expiry tag or clarify "shown as demo default".

🟢 **Could be sharper**
- Does not teach about `s` (payment secret, mandatory since late 2020), `9` (features), `r` (routing hints), or amountless invoices. These are load-bearing in real 2026 Lightning use.

---

### building-the-chain-demo

**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/building-the-chain-demo/index.html`
**One-line pitch:** Interactive chain of blocks showing how tampering breaks the chain.

🔴 **Wrong**
- L331: "For 6 confirmations: ~$250K in block rewards" — at 3.125 BTC × $110k × 6 blocks ≈ **$2M**, not $250K. Off by roughly 8×. Fix: "~$2M+ in forgone block rewards alone, plus computational cost."

🟡 **Misleading**
- L262-269: `generateHash(data)` does NOT hash; it returns `'000' + random hex chars`. A demo about hash chaining teaches the opposite of its message — the "hash" isn't derived from the data. Fix: use Web Crypto `crypto.subtle.digest('SHA-256', ...)` for real hashes so changing data visibly changes the hash.

🟢 **Could be sharper**
- No mention of block header fields (prev_hash, merkle_root, timestamp, bits, nonce, version) that actually form the chain link. Advanced-level section only hand-waves.

---

### computational-puzzles-demo

**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/computational-puzzles-demo/index.html`
**One-line pitch:** SHA-256 hash playground plus mining simulator with difficulty slider.

🔴 **Wrong**
- L244: "Current difficulty ~60 trillion" — as of April 2026 Bitcoin difficulty is ~140 T+ (see mempool.space). 60 T was the difficulty circa mid-2023. Fix: "~140 T+ (April 2026)" or use live-fetched data.
- L244: "Total network hashrate ~400 EH/s" — April 2026 network hashrate is ~800 EH/s per mempool.space. Fix: "~800 EH/s+".
- L348: "Network Hashrate: ~400 EH/s" — same stale figure. Fix as above.
- L349: "Difficulty: ~60 trillion (requires ~19-20 leading zeros)" — current ~140T requires ~20 hex zeros. Fix: update both numbers.

🟡 **Misleading**
- L351: "Energy Usage: ~120 TWh/year (mostly renewable)" — Cambridge CCAF estimates 2026 Bitcoin energy use closer to 150-180 TWh/year. "Mostly renewable" remains contested; best-available estimates put the sustainable share around 50-55%, not clearly "mostly". Fix: "~150-180 TWh/year; approximately half from sustainable sources per Cambridge CCAF."
- L241: "Real Bitcoin requires ~20 leading zeros, meaning miners globally test ~400 quintillion hashes per second" — the second claim (400 quintillion = 400 EH/s) is stale. Fix: 800+ quintillion/s.
- L261: "Real Bitcoin ≈ 19 zeros" — April 2026 is ~20 hex zeros. Fix accordingly.

🟢 **Could be sharper**
- Mining uses SHA-256 (single) in the simulator; Bitcoin mining is actually **double-SHA-256** on the block header. The advanced-level text on L187 correctly says "SHA-256(SHA-256(data))" but the simulator performs single SHA-256. Minor — could mention the simulator omits the double-hash for performance.

---

### consensus-game

**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/consensus-game/index.html`
**One-line pitch:** Simulate 51% attacks, eclipse attacks, selfish mining, and partitions.

🔴 **Wrong**
- L635: "To reorganize a chain with 6 confirmations when controlling 40% hashrate…probability ~0.09%" — per Satoshi's whitepaper (Section 11) closed-form calculation, P(catch up) for q=0.4, z=6 is ~17.7%, not 0.09%. Table in whitepaper: q=0.1 → 0.024%, q=0.2 → 1.49%, q=0.3 → 10.6%, q=0.4 → 50%+. Fix: recompute using Poisson-based whitepaper formula or cite standard table values.

🟡 **Misleading**
- L472: `blockHeight: 685000` — April 2026 block height is ~895,000-900,000. This is a hardcoded display default. Fix: live-fetch from mempool.space or at least update to 890000.
- L508: "consensus mechanism relies on honest majority hashrate. When more than 50% of mining power is controlled by honest actors, the network remains secure" — oversimplified. Even a 51% attacker cannot violate consensus rules (steal coins, inflate supply); the Q3 answer on L580-591 gets this right, so this intro could be tightened. Fix: "remains secure against reorg/double-spend attacks."
- L561-564 confirmation guidance ("1 conf risky, 3 safer, 6 very safe, 100+ for coinbase maturity") — correct numbers but glosses over that coinbase maturity is a **consensus rule** (exactly 100), not a recommendation.

🟢 **Could be sharper**
- Selfish mining description (L691) correctly says it can be profitable with <50% hashrate (Eyal & Sirer 2014 showed 33% threshold). Could cite that number.

---

### difficulty-calculator

**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/difficulty-calculator/index.html`
**One-line pitch:** Calculate mining ROI given hashrate, network difficulty, block reward.

🟡 **Misleading / stale**
- L442: `difficulty: 109780000000000` (~109.78T, January 2025 value) — April 2026 difficulty is ~140T+. Default values are 15 months stale. Fix: update or live-fetch.
- L443: `blockHeight: 880000` — April 2026 is ~895k. Fix: update.
- L444: `networkHashrate: ~1.05 ZH/s` — reasonable for January 2025; April 2026 is closer to 800-900 EH/s (has fluctuated around the 1 ZH/s mark). Minor.
- L394: "In January 2025, Bitcoin's network hashrate surpassed 1 ZH/s (zettahash per second) for the first time" — the first recorded 7-day average >1 ZH/s was actually late 2024 (mempool.space data shows crossings in November 2024 before sustained breach). Fix: "late 2024 / early 2025".

🟢 **Could be sharper**
- Formula L430 "New Difficulty = Old Difficulty × (20160 minutes / Actual Time for 2016 blocks)" — correct but doesn't mention the **4× clamp** (difficulty can change by at most ×4 or ÷4 per period). Should mention this since it's a consensus rule (Bitcoin Core `pow.cpp`).

---

### digital-signatures-demo

**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/digital-signatures-demo/index.html`
**One-line pitch:** ECDSA vs Schnorr signatures, with Taproot overview.

🟡 **Misleading**
- L399: "Nonce generation: RFC6979-style deterministic" — BIP340 uses a bespoke nonce-generation scheme (auxiliary random data + tagged hash), inspired by but not identical to RFC6979. Fix: "deterministic nonce with optional auxiliary randomness per BIP340 §3.3".
- L336: "ECDSA ~72 bytes (DER-encoded)" — typically 71-72 bytes including the sighash byte; the signature itself is 70-72 bytes DER. Minor.

🟢 **Could be sharper**
- L371: advanced section says "BIP-340…provides provable security" — technically BIP340 is provably secure under the discrete-log assumption in the random oracle model. Could add that precision.
- MuSig2 notation on L418 (`P_agg = sum of P_i with coefficient adjustments`) is correct but the "coefficient adjustments" handwave is where MuSig's novelty lies — the fact that each public key is weighted by a hash of all keys to prevent rogue-key attacks. Could mention Wagner's attack this defends against.

---

### double-spending-demo

**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/double-spending-demo/index.html`
**One-line pitch:** Coffee-shop simulation of the double-spend problem and how Bitcoin solves it.

🔴 **Wrong**
- L583: "Probabilistic Finality: Reorg probability: 0.5^n where n = confirmations" — this is only true when attacker has exactly 50% hashrate. Actual formula (Satoshi whitepaper §11) gives much smaller reorg probabilities at lower q. Fix: "0.5^n assumes 50% attacker hashrate; at q=0.1, 6-confirmation reversal is ~0.024%."
- L587-589: "At 400 EH/s network hashrate, reorganizing 6 blocks requires ~$20B ASIC investment + $6M electricity" — hashrate stale (April 2026: ~800 EH/s), numbers should roughly double. Fix: "At ~800 EH/s…~$40B ASIC investment" (order of magnitude estimate).

🟡 **Misleading**
- L564: "6 confirmations = ~$1M cost to reverse (economic finality)" — vague and low. Actual marginal cost of reorging 6 blocks (just forgone block rewards) ≈ 6 × 3.125 BTC × $110k ≈ $2M, ignoring opportunity cost of hashrate. Fix: "~$2M+ in forgone mining revenue plus attacker's own hardware/electricity cost".

---

### fee-master-tool

**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/fee-master-tool/index.html`
**One-line pitch:** Three-tab fee estimator, decision flow, and transaction tracker.

🟡 **Misleading**
- L397-399: Address types listed are `segwit (bc1)`, `wrapped SegWit (P2SH)`, `legacy (P2PKH)` — **missing Taproot (P2TR, bc1p)**. Fix: add Taproot option with input size ~57.5 vB, output ~43 vB.
- L697-705: "Low: Under 10 sat/vB (mempool clear); Medium 10-50 sat/vB; High: Over 50 sat/vB" — post-Ordinals (late 2023 onward) these brackets are often unrealistic. Ordinals/BRC-20/Runes inscriptions have made 50-100+ sat/vB fee events routine. Fix: rescale or note "pre-2023 fee regime" vs "post-inscription regime."

🟢 **Could be sharper**
- No mention of Ordinals/inscriptions or Runes as a demand driver in the fee market — a glaring omission for April 2026. Fix: add a paragraph in the Decide tab about "inscription-driven fee spikes."
- No explanation of RBF (Replace-By-Fee) or CPFP (Child-Pays-For-Parent) mechanics for bumping stuck transactions, even though the tracker tab discusses stuck transactions.

---

### lightning-network-demo

**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/lightning-network-demo/index.html`
**One-line pitch:** Interactive channels, multi-hop routing, and HTLC animation.

🟡 **Misleading**
- L848: "Download a Lightning wallet (Phoenix, Muun, or Wallet of Satoshi)" — Wallet of Satoshi **withdrew from US market in April 2024** and is custodial (not a sovereign choice); Muun is primarily an on-chain wallet with submarine swaps, not a true Lightning wallet. Fix: replace with Phoenix, Breez, Zeus (non-custodial), Aqua, or Alby Hub.
- L835: "channel reserve (typically 1% of channel capacity)" — correct per BOLTs default, but modern wallets and CLN often configure higher reserves for security.

🟢 **Could be sharper**
- No mention of **BOLT12 offers** (Payments 2.0, widely deployed by 2026), **splicing** (live in LDK/LND by 2026), or **Taproot channels / PTLCs** — all significant post-2023 Lightning developments.
- HTLC description (L745, L767) is good but doesn't mention that the future direction is PTLCs (Point Time-Locked Contracts) enabled by Schnorr.

---

### mempool-visualizer

**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/mempool-visualizer/index.html`
**One-line pitch:** 5-step walkthrough of mempool dynamics, miner selection, and fee choice.

🟡 **Misleading**
- L83: "Each block has limited space (~4 MB effective capacity)" — strictly, 4 million weight units, which maps to ~1-2MB typical and up to ~4MB only for witness-heavy blocks. Fix: "up to 4M weight units (≈1-2MB typical, up to ~4MB witness-heavy)".
- L201: "Supply: ~4 MB of block space every 10 minutes (fixed)" — same imprecision. Fix: "4M weight units".

🟢 **Could be sharper**
- No mention of Ordinals/inscriptions as a major source of mempool pressure post-2023. The "High demand/Congested" scenario should reference inscription events as a canonical example.
- RBF is referenced once (L392 "RBF Enabled" as a grouping category) but never explained.
- No mention of CPFP, package relay (BIP 331), or Ephemeral Anchors — all relevant to mempool dynamics in 2026.

---

### mining-simulator

**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/mining-simulator/index.html`
**One-line pitch:** Real SHA-256 hashing in browser, with difficulty slider (leading hex zeros).

🔴 **Wrong**
- L633: "Expected attempts = 256^(leading_zeros). At 3 zeros: 256^3 = 16,777,216 attempts." — The simulator uses hex (4-bit) leading zeros, so each zero divides probability by 16, not 256. Correct: 16^3 = 4,096 attempts for 3 hex zeros. The cited "256^3 = 16,777,216" is internally inconsistent with the simulator's own difficulty model (which uses hex zeros and earlier text says "each zero = 16x harder"). Fix: "16^(leading_zeros) for hex zeros; at 3 zeros: 16^3 = 4,096 attempts".

🟡 **Misleading / stale**
- L495: "ASICs compute ~100 TH/s; network total ~400 EH/s" — April 2026: top ASICs (Bitmain S21 Pro, Antminer S21+) hash at 200-240 TH/s; network is ~800 EH/s. Fix: "~200-240 TH/s per ASIC; network ~800 EH/s".
- L597: "Modern ASICs achieve ~100 TH/s" — same stale figure. Fix.
- L633: "Bitcoin's current difficulty requires target < 0x0000000000000000000704cb000000…" — this target corresponds to early-2024 difficulty (~60-80T). Current April 2026 target has more leading zeros. Fix: update or live-fetch.
- L467: "Network statistics (difficulty, hashrate) are estimates based on data from November 2024" — at least there's a disclaimer, but 17 months stale.

🟢 **Could be sharper**
- Demo uses single SHA-256; real Bitcoin mining uses SHA-256(SHA-256(header)). L187 of the companion computational-puzzles-demo notes this, but mining-simulator itself doesn't.

---

### network-consensus-demo

**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/network-consensus-demo/index.html`
**One-line pitch:** Small-N voting simulation to explain Nakamoto consensus.

🔴 **Wrong**
- L320: "6 confirmations ≈ 2^6 difficulty to reverse ≈ $64M cost" — reverse difficulty does **not** scale as 2^n; it scales linearly in blocks (plus the attacker's probability decay, which Satoshi's whitepaper formalizes). 2^6 = 64 is not a meaningful cost multiplier. Fix: "6 confirmations: attacker with <50% hashrate has exponentially decaying reorg probability per the whitepaper (§11); marginal cost is ~6× block reward + attacker's hashpower opportunity cost."
- L428: "global mining power (~200 EH/s)" — April 2026 is ~800 EH/s, **4× higher**. Fix: "~800 EH/s".
- L305: "~$20B in hardware plus $1M/hour in electricity" — both figures are stale. At ~800 EH/s and modern ASIC economics, 51% attack hardware cost is in the $50-100B range. Electricity cost per hour would be ~$3-5M. Fix: update.

🟡 **Misleading**
- L317: "Sybil Resistance: One-CPU-one-vote → One-hash-one-vote" — Satoshi's original phrase was "one-CPU-one-vote" in the whitepaper; the demo's rephrasing to "one-hash-one-vote" is fine as gloss but could cite the original.

---

### network-growth-demo

**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/network-growth-demo/index.html`
**One-line pitch:** Animated growth of users, hashrate, and economic security over time.

🔴 **Wrong**
- L577: "2009: ~5,256,000 BTC × $0.01 = $52,560/year security budget" — 2009 issuance was 52,560 blocks × 50 BTC = **2,628,000 BTC annualized**, not 5,256,000. The figure is off by 2× (likely double-counted). Also Bitcoin launched January 3, 2009, so actual 2009 issuance was only ~1.6M BTC. Fix: "2009 (partial year): ~1.6M BTC × $0.01 ≈ $16,000".

🟡 **Misleading**
- L578: "2015: ~1,314,000 BTC × $250 = $328M/year" — 2015 issuance was 52,560 × 25 = 1,314,000 ✓ (price $250 is reasonable mid-2015). OK.
- L579: "2020: ~328,500 BTC" — 52,560 × 6.25 = 328,500 ✓. Price $10k reasonable. OK.
- L580: "2025: ~164,250 BTC × $65,000 = $10.7B" — 52,560 × 3.125 = 164,250 ✓. Price $65k is early-2024/2025 low; by late 2025 BTC was in $100k+ range. Fix: update price to $100k+.
- L650: "const rawUsers = 1000 * Math.pow(adoptionRate, yearsSince2009)" — purely a model, not empirical. The chart labels "users" but real adoption metrics (on-chain addresses, wallet downloads, etc.) would be more honest.

🟢 **Could be sharper**
- Metcalfe's Law (n²) is cited at L468 but it's contested for Bitcoin; Clauset/Shalizi and others argue it's closer to n·log(n). Could note this is a simplification.

---

### time-chain-explorer

**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/time-chain-explorer/index.html`
**One-line pitch:** Visualize block times as Poisson/exponential process with countdown.

🟢 **Could be sharper**
- L406: "Poisson Distribution" — block discovery is a Poisson process, so block *times* are exponentially distributed (correctly modeled in L436 with `-ln(1-U) * 600`). The text conflates "Poisson distribution" with "Poisson process" — technically the number of blocks in a fixed window is Poisson-distributed; the *time between blocks* is exponentially distributed. Fix: "Poisson process (inter-block times exponentially distributed)".
- L407: "Every 2,016 blocks (~2 weeks), difficulty adjusts to maintain 10-minute average" — correct, matches SOURCES.md.

No factual errors found.

---

## Meta-observations

1. **Stale network statistics are pervasive.** Nearly every demo that displays concrete numbers for hashrate (cited as 200-400 EH/s), difficulty (60-110T), or block height (685k-880k) is 6-18 months out of date relative to April 2026 reality (~800+ EH/s, ~140T difficulty, block height ~895k). The live-data infrastructure (`js/bitcoin-context.js`, `js/bitcoin-data-reliable.js`) documented in MEMORY.md should be wired into these demos where possible.

2. **Post-2023 developments are consistently missing.** Ordinals (January 2023), BRC-20 (March 2023), Runes (April 2024), and inscription-driven fee spikes are not acknowledged in fee-market demos (fee-master-tool, mempool-visualizer). Address-format-explorer does not flag that Taproot addresses now carry meaningful inscription-traffic associations. BOLT12, splicing, and PTLCs are absent from Lightning demos despite being production-deployed by 2026.

3. **"6-confirmation cost" calculations are inconsistent across demos** (and often wrong). building-the-chain-demo says ~$250K, double-spending-demo says $20B/$6M hourly, network-consensus-demo says $64M via a bogus 2^n formula. None agree with a clean "~6 × block reward × price ≈ $2M minimum marginal cost" calculation, which is the correct framing.

4. **Satoshi whitepaper §11 reorg probabilities are misstated** in consensus-game (Q4 answer) and double-spending-demo (0.5^n claim). Both should cite the closed-form: P = 1 − Σ(k=0→z)[λᵏe⁻ˡ/k! × (1 − (q/p)^(z−k))] where λ = z(q/p), with published reference tables.

5. **Double-hash omission.** SHA-256(SHA-256(…)) is the real Bitcoin mining hash, but mining-simulator and building-the-chain-demo use single SHA-256 (or fake random). Only computational-puzzles-demo mentions this in passing.

6. **BIP86 / Taproot HD paths absent.** bitcoin-key-generator-visual shows BIP44 and BIP84 but not BIP86 — a conspicuous gap given Taproot has been live for 4+ years.

7. **Wallet recommendations are dated.** Lightning-network-demo recommends Wallet of Satoshi (withdrew from US April 2024) and Muun (not a real Lightning wallet). Should be audited across all demos.

8. **P2SH framing.** Multiple demos describe P2SH (BIP16) as "for multisig," which is historically how it was primarily used but misses the general point that P2SH enables arbitrary redeem scripts.

9. **Small but high-confidence fix opportunities:** the mBTC contradiction in bitcoin-unit-converter (L662) and the fabricated OP_WITHDRAWPROOFVERIFY opcode in bitcoin-layers-map (L1150) are both quick wins.

10. **Strong demos.** digital-signatures-demo (Schnorr/BIP340 coverage is genuinely solid), time-chain-explorer (Poisson modeling is mathematically clean), and bitcoin-key-generator-visual (full real cryptographic pipeline, no fake outputs) stand out as factually careful. They should be the quality bar for the others.
