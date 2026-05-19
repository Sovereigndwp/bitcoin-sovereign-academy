# The Symbiotic-Sovereign Thesis — Falsification Framework v4

### Seventeen specific, dated, sourced claims that would invalidate the thesis if they fail. v4 rewrites every falsifier for operational clarity following the v4 audit.

*The Sovereign Academy · v4 · May 2026 · v4 supersedes v3 (May 2026)*

---

## Change log

**v1** — May 18, 2026 (morning). 12 falsifiers.

**v2** — May 18, 2026 (afternoon). 15 falsifiers. Added F13 (Tron displacement), F14 (Eth L2 scale), F15 (TON consumer reach). Verdict rubric retuned: 5+ fired = rejected.

**v2.1** — May 18, 2026 (evening). 16 falsifiers. F9 sharpened with current miner-economics pressure. F16 added in PRESSURE status. Verdict rubric retuned: 6+ fired = rejected.

**v3** — May 2026. 17 falsifiers. Added F17 (quantum threat materialization) in INDETERMINATE status — covers the only single-event risk that could unilaterally invalidate Bitcoin's SoV claim. Verdict rubric maintained at 6+ fired = rejected.

**v4** — May 2026. **Same 17 falsifiers; substantive rewrite of falsifier definitions and measurement protocols** following a structured five-expert red-team audit (privacy maximalist, Ethereum/DeFi analyst, regulatory lawyer, Bitcoin mining operator, mainstream macro). v4 verdict rubric, deadlines, and methodology-immutability rule are unchanged. v4 changes are definitional, not threshold-loosening.

Twelve definitional rewrites:

1. **F1.** Disambiguate "dominant non-state digital monetary asset" — clarify share-of-crypto-native-monetary-supply, not share-of-global-SoV.
2. **F2.** Split self-custodial from operator-assisted volume; report separately; threshold applies to combined but interpretation must distinguish.
3. **F3.** Categorize Bitcoin-rail stablecoin volume by trust tier (Bitcoin-native overlay vs federated sidechain vs bridge/peg vs custodial wrapper).
4. **F4.** Apply v4 four-way taxonomy to the L3 stack (Bitcoin-native / Bitcoin-secured / Bitcoin-adjacent / Bitcoin-branded). TVL is reported by tier, not aggregated without it.
5. **F5.** Add an emergency-pause condition. A pause-and-recover does not count as exploit if user funds are fully recovered; a pause-with-loss does count. Specify which BitVM-class systems are pause-capable.
6. **F6.** Define "escape hatch" operationally. Either (a) deployable covenant primitive on mainnet, OR (b) user-side unilateral L1 exit demonstrated under load for two of three counted L2 systems.
7. **F7.** Specify the stablecoin universe explicitly — USDT, USDC, USAT, ctUSD, USDB, EURC, FDUSD, PYUSD; exclude algorithmic and reflexive designs.
8. **F8.** Operationalize "materially adopts" with six tests; a sovereign counts if it meets any three.
9. **F9 / F16 separation cleaned up.** F9 is the post-2028-halving security-budget assessment. F16 is the trajectory through end-2027 that determines whether F9 will fire. No double-counting. F9 fires from data measurable only after April 2028; F16 fires from data measurable through end-2027.
10. **F10.** Expand beyond US/EU. Test set is US, EU, UK, Japan, Singapore, plus FATF gray-list status. Threshold counts qualifying events across this expanded set.
11. **F13.** Humility softening. "10% of corridor stablecoin flow" stands as the threshold; v4 adds that the falsifier is *expected* to fire, and firing is not by itself thesis-disqualifying; it confirms a structural disadvantage v4 explicitly names rather than denies.
12. **F17.** Reconcile BIP-360 and BIP-361 — they are separate proposals with separate roles. BIP-360 (P2MR, quantum-resistant address type) is the activation that matters for F17(a). BIP-361 (freeze proposal for quantum-vulnerable coins) is contested and is *not* required for F17 to stay INTACT. Source URL updated to point to the BIP-360 repository, not the BitVM bridge paper.

Methodology-immutability rule preserved: thresholds, once committed, can only be tightened. v4 definitions are tightened or clarified; none are loosened.

---

## Reading guide

Each falsifier has seven fields: **Claim · Falsification threshold · Measurement source · Why it matters · Status as of May 2026 · Confidence · Contested.** Source tier system: `[DEV]` `[DATA]` `[INST]` `[PRESS]` `[PROJ]` `[ANEC]`.

**Confidence** (new in v4) is the framework author's confidence that the data the falsifier depends on is measurable and uncontested enough to settle the question by its deadline. **High** = primary on-chain or institutional data, multiple independent sources. **Medium** = institutional research with method gaps. **Low** = community estimates, single-source, or definition-dependent. Confidence is not a probability the falsifier will fire.

---

## The seventeen falsifiers

### 1. Bitcoin retains dominant share of crypto-native non-state monetary supply

**Claim.** BTC remains the dominant *crypto-native* non-state monetary asset. v4 disambiguation: the claim is about Bitcoin's share of *crypto-native monetary supply* (BTC + non-state crypto assets credibly held as savings), not share of *global store-of-value markets* (gold, Treasuries, real estate, M2). Bitcoin can lose share-of-global-SoV without firing F1; F1 is about the within-crypto contest.

**Falsification threshold.** BTC's share of total crypto market capitalization falls below 35% on a 12-month moving average before December 31, 2030. Stablecoins are excluded from the denominator (they are dollar liabilities, not crypto-native monetary supply).

**Measurement source.** CoinGecko dominance index, computed monthly, with stablecoin market cap subtracted from the denominator. CMC dominance is reported alongside as cross-check. `[DATA]`

**Why it matters.** The entire thesis assumes Bitcoin's monetary properties translate to sustained dominance within the crypto-native asset class. Outside that class, Bitcoin is competing with sovereign balance sheets — a different falsification scope handled in Part V of the main thesis, not by F1.

**Status May 2026.** 50–60% range with stablecoins excluded. Comfortably INTACT.

**Confidence.** High. Measurement is a public daily series; the denominator-disambiguation just needs to be reported consistently.

**Contested.** Dominance is relative and sensitive to which assets are counted. Excluding stablecoins is the v4 choice; sensitivity reported in each quarterly review.

---

### 2. Non-custodial AND operator-assisted Lightning/L2 volume scales

**Claim.** Combined volume across Lightning + Ark + Spark + Arkade reaches mid-tier remittance scale by Q4 2028.

**Falsification threshold.** Combined monthly volume fails to exceed $20B by Q4 2028.

**v4 measurement protocol.** Report split:

- **Self-custodial volume** — Phoenix, Zeus, Sparrow, Breez SDK, Arkade with unilateral-exit configurations, Wallet of Satoshi-on-Spark in configurations where the user controls the signing key
- **Operator-assisted volume** — Strike, Cash App Lightning, Lightspark Grid, custodial wallets, federated mints, threshold-signed wallets where the user does not unilaterally sign

The $20B threshold applies to the combined number. The narrative interpretation must report the split. A scenario where the combined number meets the threshold but is 90%+ operator-assisted is materially different from one where 50%+ is self-custodial. v4 reporting commits to publishing both fractions.

**Measurement source.** River, Lightning Labs, Spark, Ark Labs, Arkade, Lightspark, Strike published metrics; Cash App segment reporting where available. `[DATA]` `[PROJ]`

**Why it matters.** Bitcoin's MoE surface must escape niche status. But "escapes niche" looks different if it does so through self-custodial mass adoption vs. through operator-assisted scaling that recreates the bank/fintech architecture on top of Bitcoin rails.

**Status May 2026.** River >$1B/month, total network estimated $1.5–2B/month. Public Lightning capacity 5,637 BTC December 2025 high; +266% YoY volume in 2025. `[DATA]` Path to $20B requires ~10x in 30 months. Estimated split today: ~30% self-custodial, ~70% operator-assisted (rough public-data estimate; better disclosure needed).

**Confidence.** Medium. Combined volume is observable; the self-custodial / operator-assisted split currently rests on operator self-reporting and is imperfect.

**Contested.** Private-channel volume difficult to measure precisely. The self-custodial / operator-assisted boundary is not always clean (e.g., LSP-managed channels with user-side keys).

---

### 3. Bitcoin-rail stablecoin volume grows — reported by trust tier

**Claim.** USDT + USDC + ctUSD + USAT + USDB on Bitcoin rails reach material share of global stablecoin flow.

**v4 measurement protocol.** Report Bitcoin-rail stablecoin volume by trust tier:

- **Bitcoin-native overlay** — Taproot Assets on Lightning, RGB
- **Bitcoin-secured federated sidechain** — Liquid USDT, Liquid USDC
- **Bitcoin-adjacent execution** — ctUSD on Citrea, sBTC-denominated stables, Botanix stables
- **Bridge/swap** — Boltz routed USDT/USDC, Lightning Loop USDC
- **Custodial wrapper** — ETF-related dollar exposure where applicable

**Falsification threshold.** Combined monthly volume across all tiers fails to exceed $15B by Q4 2028.

**Measurement source.** Liquid explorer, Lightning Labs Taproot Assets, Boltz, Citrea, RGB explorers, Botanix dashboards. `[DATA]` `[DEV]`

**Why it matters.** The custody-spine thesis. v4's trust-tier reporting prevents a future "Bitcoin captures stablecoin volume!" claim from collapsing distinct trust models into a single number. A reader needs to know whether the growth is Taproot Assets on Lightning (Bitcoin-native overlay) or ctUSD on Citrea (Bitcoin-adjacent with bridge risk).

**Status May 2026.** Combined single-digit billions monthly, growing fast off small base. **v4 note: F3 is directly exposed to Tether/Circle SPOF risk.** Tether's MiCA non-compliance and USAT bifurcation strategy concentrate dependency on Anchorage Digital Bank. **A Tether enforcement action would fire F3 alongside F7 and F10 simultaneously** — see Correlated Failures Scenario 2 in [main thesis](thesis-v4.md#part-vii--correlated-failures-preserved-from-v3-threshold-tightened).

**Confidence.** Medium. Per-rail data quality varies; Liquid is well-instrumented, RGB is opaque, ctUSD is reported by issuer.

**Contested.** Methodology for counting cross-rail flow (USDT minted on Liquid then bridged to Lightning then to a custodial venue) needs careful disclosure.

---

### 4. Bitcoin-anchored L3 reaches material TVL — by taxonomy tier

**Claim.** Programmable execution anchored to Bitcoin reaches scale.

**v4 measurement protocol.** Apply the v4 four-way taxonomy. TVL is reported by tier; the threshold applies to combined but the verdict narrative must distinguish:

- **Bitcoin-native programmability** (covenant-based, BitVM-style without bridges) — currently empty pending CTV / OP_PAIRCOMMIT activation
- **Bitcoin-secured execution** (BitVM-class bridges, single-honest-operator security) — Citrea via Clementine, Bitlayer
- **Bitcoin-adjacent execution** (federated/multisig bridge, separate consensus) — Stacks sBTC, Botanix Spiderchain, BOB
- **Bitcoin-branded execution** (anything claiming "Bitcoin DeFi" without trust-minimized exit) — excluded from F4 TVL; counted only in narrative

**Falsification threshold.** Combined TVL across the first three tiers stays below $5B by Q4 2027.

**Measurement source.** DefiLlama Bitcoin section + project dashboards + tier-coded labels published with each quarterly review. `[DATA]`

**Why it matters.** If programmability fails to scale, the symbiotic-sovereign frame's claim on credit and conservative DeFi is empirically wrong. v4's tier-reporting prevents counting bridge-secured TVL as if it were base-layer security.

**Status May 2026.** Stacks sBTC $437M Q1 close (peak $545M) — Bitcoin-adjacent tier. Citrea $5.6M — Bitcoin-secured tier. Botanix undisclosed at granular level — Bitcoin-adjacent tier. Combined ~$600–800M. Path to $5B = ~7-8x growth in 18 months.

**Confidence.** Medium. DefiLlama reporting is consistent for Stacks; weak for Citrea and Botanix at granularity Ethereum L2s report.

**Contested.** TVL is a partial metric; will publish protocol-economic-activity proxies alongside.

---

### 5. Trust-minimized bridges survive adversarial pressure

**Claim.** BitVM-class bridges achieve production-grade security without catastrophic exploits.

**v4 measurement protocol — emergency-pause clarified.**

- **Exploit with loss** — funds drained, attacker retains funds at 30 days post-incident. **Counts as exploit value.**
- **Exploit detected, pause triggered, full recovery within 30 days** — does *not* count toward the cumulative threshold but is reported as a "pause-and-recover" incident in the quarterly review. Repeat pause-and-recovers fold into a separate metric.
- **Pause-with-partial-loss** — counts at the value of unrecovered funds.
- **Pause-without-exploit (precautionary)** — does not count; reported for transparency.

The pause-capability is a real security primitive; v3's exploit threshold did not distinguish a pause-and-recover from a drain-and-disappear. v4 fixes this.

**Falsification threshold.** Single exploit > $50M (value not recovered within 30 days), OR cumulative > $200M (value not recovered) by end 2028, OR no 24-month survival at $500M+ TVL without exploit.

**Pause-capable systems (May 2026).** Bitlayer BitVM Bridge — operator-coordinated pause capability via Bitlayer multisig. Clementine (Citrea) — pause governance per Citrea documentation `[VERIFY]`. BitVM2 framework allows fraud-proof challenge windows that function as on-chain pauses for individual peg-out attempts but not for the system as a whole.

**Measurement source.** Project announcements, Rekt News, Chainalysis, project post-mortems. `[INST]` `[PRESS]`

**Why it matters.** Bridge exploits are the largest historical attack surface in crypto (~$2.8B cumulative). The pause-capability distinction matters because mature financial infrastructure routinely uses circuit breakers; treating every pause as a "failure" would misclassify mature operational hygiene as falsifier-firing.

**Status May 2026.** Bitlayer mid-2025; Clementine (Citrea) January 27, 2026. No major exploits. No pause incidents to date. Exposure still small.

**Confidence.** Medium-High. Post-incident value-recovered numbers are reportable from public on-chain forensics; the pause-vs-precautionary distinction depends on project disclosure quality.

**Contested.** Defining "BitVM-class" requires judgment. Boundary between Bitcoin-secured and Bitcoin-adjacent bridges depends on bridge security model, not branding.

---

### 6. Covenant OR L2-scale escape hatch — operational definition

**Claim.** Either a major covenant activates by end 2028, OR the L2 ecosystem demonstrably scales without one.

**v4 measurement protocol — "escape hatch" defined operationally.**

The original F6 was a vague compound condition. v4 specifies what counts:

- **(a) Major covenant activates.** OP_CTV (BIP-119), LNHANCE bundle, OP_CAT (BIP-347), OP_PAIRCOMMIT, or BIP-448 reaches activation parameters and miner-signaling threshold. Activation, not deployment-readiness.
- **(b) L2-scale escape hatch demonstrated without covenant activation.** Defined as: in any 30-day window, at least two of the following three counted L2 systems (Lightning, Ark/Arkade, Spark) demonstrate >10,000 user-initiated unilateral L1 exits under non-degenerate fee conditions (L1 fees below 100 sat/vB median). "Unilateral exit" means the user can produce a valid L1 transaction without operator cooperation.

**Falsification threshold.** Neither (a) nor (b) achieved by end of 2028.

**Measurement source.** Bitcoin Core release notes for (a); Amboss, project metrics, Mempool.space, and operator disclosures for (b). `[DEV]` `[DATA]`

**Why it matters.** The coordination-failure scenario — L2s build around the absence of expressive script primitives, and the resulting accumulation of operator-side complexity makes covenant activation harder over time, while also leaving the L2 ecosystem vulnerable to operator capture. F6 asks: did Bitcoin develop either the protocol expressivity or the operational track record to credibly preserve user exit?

**Status May 2026.** CTV deployment parameters in place (start March 30, 2026; end March 30, 2027; 90% miner signaling). Realistic activation odds <50%. BIP-448 announced March 20, 2026. OP_PAIRCOMMIT published March 6, 2026. No documented 30-day periods meeting (b)'s thresholds yet.

**Confidence.** Medium. Covenant activation is binary and publicly tracked. Unilateral-exit demonstration data depends on operator reporting and on someone choosing to instrument and publish it.

**Contested.** "Unilateral exit" boundary — Lightning channel close from a self-custodial wallet always qualifies; what about Spark's threshold-signature unilateral exits when the user-side signer is third-party-managed? v4 default: counts only if the user holds a key share they can use without third-party coordination.

---

### 7. Bitcoin captures meaningful share of stablecoin volume — defined universe

**Claim.** Bitcoin-anchored rails grow share of total global stablecoin volume.

**v4 measurement protocol — universe specified.** The stablecoin universe for F7 numerator and denominator is:

- **Included.** USDT, USDC, USAT, ctUSD, USDB, EURC, FDUSD, PYUSD
- **Excluded.** Algorithmic stablecoins, reflexive designs, dollar-substitute tokens not redeemable 1:1 against an issuer (e.g., DAI is included if and only if it remains predominantly USDC-backed; sUSD-style protocols are excluded)
- **Bitcoin-rail numerator.** Volume of the included stablecoins moving over Lightning (Taproot Assets), Liquid, RGB, Citrea, Botanix, Stacks, BOB, BitVM-bridge-secured rollups, or Boltz/CCTP-anchored swaps initiated from a Bitcoin-side wallet
- **Global denominator.** Total volume of the included stablecoins across all chains per Artemis / Visa Onchain Analytics

**Falsification threshold.** Bitcoin-rail share stays below 5% (12-mo MA) through end of 2028.

**Measurement source.** Artemis, DefiLlama, Visa Onchain Analytics, per-rail explorers. `[DATA]` `[INST]`

**Why it matters.** Hosting stablecoins on Bitcoin only matters if Bitcoin captures a meaningful share. The defined universe prevents apples-to-oranges comparisons (e.g., counting Tron USDT against algorithmic protocols).

**Status May 2026.** ~1–2% globally. Tron alone holds $83.9B USDT supply (~60% of total). **v4 note: Same Tether/Circle SPOF exposure as F3.**

**Confidence.** Medium. Artemis and Visa Onchain Analytics are the cleanest cross-chain volume sources; per-rail Bitcoin attribution is harder.

**Contested.** Whether wrapped stablecoins (USDT.b, ctUSD which references USDC reserves) should be deduplicated against base-issuer volume — v4 default: count once at the rail of last movement.

---

### 8. Sovereign-level BTC adoption expands — operational "materially adopts"

**Claim.** Net new sovereigns adopt BTC despite El Salvador's mandatory-acceptance rollback.

**v4 measurement protocol — six tests for "materially adopts."** A sovereign counts toward F8 if it meets *any three* of:

1. **Reserve test.** Public BTC on sovereign balance sheet > $50M USD-equivalent at six-month moving average market price.
2. **Legal-recognition test.** Formal legal recognition of Bitcoin as legal tender OR explicit recognition as a permissible reserve asset for central bank or sovereign wealth fund.
3. **Strategic-reserve test.** Public policy declaration of Bitcoin as a strategic reserve asset, with named custodian and disclosed accumulation methodology.
4. **Mining test.** State-operated or state-contracted Bitcoin mining at >100 PH/s of installed capacity with national-grid integration.
5. **Tax-and-payments test.** State-issued ability to pay taxes in Bitcoin, OR state-issued payments to citizens in Bitcoin (pensions, subsidies, salaries).
6. **Sovereign-debt test.** Sovereign issues debt instruments either Bitcoin-denominated or Bitcoin-collateralized at any scale.

**Falsification threshold.** Fewer than 3 net new sovereigns meet the three-of-six bar by end of 2030.

**Measurement source.** IMF country reports, Bitcoin Treasuries, central bank disclosures, sovereign-wealth-fund reports, national legislation. `[DATA]` `[PRESS]`

**Why it matters.** UoA pathway runs through high-inflation countries and sovereign experiments. Without operational "materially adopts," F8 could be satisfied by a trivial press release. v4 raises the bar.

**Status May 2026.** Baseline: El Salvador (post-rollback, 7,565 BTC) meets tests 1, 3, possibly 4. Bhutan (~6,000 BTC) meets tests 1, 4. **US Strategic Bitcoin Reserve formalized March 2025, ~200,000 BTC from forfeiture; total federal holdings ~328,372 BTC across agencies** meets tests 1, 3. The US reserve by itself meets the threshold. **v4 note: ETF custody concentration (Coinbase Custody + Anchorage) creates implicit risk to sovereign-level adoption** — a custody event would shake institutional confidence in a way the framework should track.

**Confidence.** Medium-High. Sovereign disclosures are publicly tracked; the three-of-six bar is a reportable judgment.

**Contested.** "Materially adopts" was the operative term needing operationalization; six tests in v4 replace the v3 single-threshold rubric. The new bar is harder to game but introduces judgment in how to weight partial test satisfaction.

---

### 9. Post-halving security budget holds — measurable only after April 2028

**Claim.** Miner revenue and hashrate growth sustain Bitcoin's security after the April 2028 halving.

**Falsification threshold.** In the 12 months following the April 2028 halving, **all three** must hold to fire F9: (a) real-terms miner revenue (USD, CPI-adjusted to 2025) under ~$15B 12-mo total, AND (b) hashrate negative for 6+ consecutive months, AND (c) L1 fees under 15% of total miner revenue (12-mo MA).

**v4 separation rule — F9 vs F16.** F9 fires from data measurable only *after* April 2028. F16 fires from data measurable *through end-2027*. They are not double-counts: F16 captures the trajectory; F9 captures the post-halving reality. F16 firing makes F9 firing more likely but does not satisfy F9.

**Measurement source.** mempool.space, Hashrate Index, Coin Metrics, public-miner SEC filings. `[DATA]`

**Why it matters.** Stack inherits L1's security budget. The post-2028-halving period is the structural test of whether Bitcoin's fee market plus subsidy can support security at the scale a global reserve asset requires.

**Status May 2026 — INDETERMINATE (deadline post-April 2028).** Pre-halving baseline holding at hashrate level. The economic trajectory through 2026 is what F16 measures; F9's own status moves to INTACT / PRESSURE / FIRED only after April 2028 + 12 months. v4 explicitly marks F9 as **INDETERMINATE until April 2029**.

**Confidence.** High. The three measurable inputs are standard public metrics.

**Contested.** Real-terms thresholds need BTC-price calibration before April 2028 halving. v4 commits to publishing the calibration methodology at the September 2027 quarterly review.

---

### 10. Non-custodial layer remains legal — expanded jurisdiction set

**Claim.** Non-custodial Bitcoin payment infrastructure stays viable in major jurisdictions.

**v4 measurement protocol — jurisdiction set expanded.** Test set is: **US, EU, UK, Japan, Singapore, plus FATF gray-listing status** of any G20 jurisdiction for non-implementation of crypto AML standards.

**Falsification threshold.** By end 2028, **any 2 of**:

- (a) US FinCEN or successor classifies atomic-swap operators as money transmitters with no Bitcoin-specific exemption.
- (b) MiCA enforcement (EU) forces shutdown or geofencing of a major non-custodial Lightning service (>500 BTC capacity).
- (c) UK FCA designates a non-custodial Bitcoin swap protocol or service as requiring authorisation, with enforcement.
- (d) Japan FSA extends the Payment Services Act crypto-asset definitions to non-custodial Lightning routing or swap operators.
- (e) MAS (Singapore) requires VASP licensing for non-custodial swap protocols.
- (f) Major Lightning service (>500 BTC capacity) exits 2+ jurisdictions in the test set citing regulation.
- (g) OFAC sanctions a Bitcoin-native non-custodial swap protocol (Tornado-Cash-precedent applied to Bitcoin).
- (h) FATF gray-listing of a G20 jurisdiction for non-implementation that includes specific findings on Bitcoin non-custodial infrastructure.

**Measurement source.** FinCEN, FATF, MiCA enforcement actions, OFAC list, UK FCA, JFSA, MAS, project announcements. `[DEV]` `[PRESS]`

**Why it matters.** Technical viability is moot if regulatory perimeter closes. v3's US/EU framing was too narrow — the regulatory perimeter for non-custodial Bitcoin infrastructure is increasingly global, and a Singapore or UK designation can be load-bearing.

**Status May 2026.** FinCEN ambiguous on atomic-swap operators. **Wallet of Satoshi US delisting November 2024** is the canonical early signal. MiCA enforcement ramping. Tornado Cash precedent looms; v4 frames Tornado Cash as a *multi-vector* enforcement template (operators, frontends, developers, infrastructure, liquidity providers) rather than only protocol-level sanctions. UK FCA crypto regime advancing. JFSA stable; MAS active on stablecoin authorisation but not yet on non-custodial swap protocols. **v4 note: GENIUS Act effective between January–April 2027 will materially change the US regulatory landscape for stablecoin issuers; downstream effects on Bitcoin-rail stablecoin paths are within F10 scope.**

**Confidence.** Medium. Enforcement actions and designations are publicly visible; ambiguous-enforcement scenarios require judgment.

**Contested.** Whether a service "geofencing the US" while otherwise operating counts as event (b) or (f) — v4 default: counts under (b) if MiCA-enforced, under (f) otherwise.

---

### 11. L2 tokens don't dilute BTC dominance

**Claim.** Native Bitcoin-anchored L2 tokens stay economically subordinate to BTC.

**Falsification threshold.** Combined FDV of L2 tokens (STX, CTR, BTNX, BOS, SPRK, ARK, BCT, BVM, plus future Bitcoin-anchored-L2 native tokens) exceeds 10% of BTC mcap (12-mo MA) by Q4 2028.

**Measurement source.** CoinGecko, CMC. `[DATA]`

**Why it matters.** L2 token dilution erodes Bitcoin's monetary primacy at the edges. If L2 tokens capture 10%+ of BTC's market cap, the "Bitcoin is the asset, rails are the rails" frame is empirically wrong and the rails themselves are accumulating reserve-asset properties.

**Status May 2026.** STX ~$1–1.5B; CTR airdrop snapshot May 5, 2026 (TGE pending); Botanix tokens emerging. Combined well under 1% of BTC market cap.

**Confidence.** High. Token FDV is a standard public metric.

**Contested.** Token launches unpredictable; revise mechanically as launches occur. Some "Bitcoin L2 tokens" are explicitly utility-tokenized (governance, gas) rather than reserve-asset-positioned; v4 includes them anyway in FDV count since the falsifier is about market-cap dilution, not narrative positioning.

---

### 12. Solana doesn't close the SoV gap

**Claim.** SOL doesn't displace Bitcoin's claim to dominant non-state SoV within crypto-native assets.

**Falsification threshold.** SOL market cap exceeds 50% of BTC market cap (12-mo MA) for sustained period (4 consecutive quarters) before end of 2030.

**Measurement source.** CoinGecko, CMC. `[DATA]`

**Why it matters.** Solana is the most credible single-asset counterexample to F1's "Bitcoin retains dominant share" claim within crypto-native assets.

**Status May 2026.** SOL ~5–10% of BTC mcap. Solana TVL down 56% from $11.5B Aug 2025 peak to $5.5B May 2026; native SOL terms at ATH. Path to 50% requires extreme divergence.

**Confidence.** High. Market cap is a clean public metric.

**Contested.** Market cap understates Bitcoin's monetary properties (no inflation, no foundation premine, longer track record) but is the cleanest public measure.

---

### 13. Bitcoin captures share of Tron USDT corridors — humility-softened

**Claim.** Bitcoin-rail stablecoin volume captures measurable share of emerging-market remittance corridors currently dominated by Tron-USDT.

**Falsification threshold.** Bitcoin-rail stablecoin volume in any of {Argentina, Nigeria, Philippines, Venezuela, Turkey} corridors fails to exceed 10% of corridor's total stablecoin flow by end of 2029.

**v4 framing — humility softening.** This is the most underweighted competitive critique in v3. v4 makes it explicit: **F13 is expected to fire.** Tron's $7.9T 2025 USDT volume, deep merchant integration, near-zero fees, and entrenched corridor liquidity are real structural advantages no Bitcoin-rail can dislodge in the F13 timeframe. F13 firing does **not** disqualify the thesis; it confirms a structural disadvantage v4 explicitly names rather than denies. The verdict-narrative interpretation must treat F13 firing as expected, not as surprise.

The thesis-relevant question is not "Does Bitcoin take Tron's corridors?" but "Does Bitcoin remain the asset users in those corridors *exit to* when their stablecoin exposure feels fragile?" That question is not what F13 measures, and v4 does not pretend F13 measures it.

**Measurement source.** Chainalysis country reports, Tether transparency, Strike usage by corridor, World Bank remittance data. `[INST]` `[DATA]`

**Why it matters.** Honesty signal. A framework that hides expected-failure falsifiers behind ambitious thresholds loses credibility when those thresholds inevitably fail. v4 reports F13 as expected-to-fire and absorbs the lesson into the thesis structure, not the verdict.

**Status May 2026.** Bitcoin-rail share well under 1% in these corridors. Strike's own USDT routes through Tron in Argentina and Nigeria. 10% in any corridor by 2029 = ~30-50x flow shift, structurally unlikely given current trajectory.

**Confidence.** Medium-High. Chainalysis corridor data is the standard reference; some self-custody-flow may be undercounted.

**Contested.** Corridor-level data improving but imperfect. v4 commits to reporting F13 with the humility caveat at every quarterly review.

---

### 14. Bitcoin L2 stack reaches mid-tier ETH L2 scale

**Claim.** Bitcoin-anchored programmability layer reaches scale comparable to mid-tier Ethereum L2s.

**Falsification threshold.** Combined TVL across Bitcoin-anchored L3 (using F4's taxonomy: Bitcoin-secured + Bitcoin-adjacent tiers) stays below combined TVL of Optimism + Linea by end of 2029.

**Measurement source.** DefiLlama dashboards. `[DATA]`

**Why it matters.** Ethereum L2s hold ~$48B TVL combined; Bitcoin-anchored L3 stack ~$600-800M. The structural gap is the question; Bitcoin's L3 stack does not have to lead — but it has to be on the same chart.

**Status May 2026.** Bitcoin L3 ~35–45% of benchmark; needs to grow ~2.5x faster than benchmark to clear by 2029.

**Confidence.** High. DefiLlama is the standard reference.

**Contested.** TVL partial; publish economic-activity proxies alongside. v4 inherits this from F4.

---

### 15. TON / Telegram doesn't structurally outrun Bitcoin retail

**Claim.** Bitcoin's stack maintains relevance in consumer crypto despite TON's distribution advantage.

**Falsification threshold.** TON-native wallet user count exceeds 5x combined user count of Bitcoin-native consumer Lightning wallets (Phoenix, Zeus, Strike, Cash App Lightning, Wallet of Satoshi, Blink, Breez, Aqua) by end of 2028.

**Measurement source.** Telegram TON metrics, Lightning wallet public user counts, project disclosures. `[PROJ]` `[INST]`

**Why it matters.** TON's 900M Telegram MAU funnel is structural distribution. Bitcoin's consumer Lightning wallet base is the closest comparable surface.

**Status May 2026.** TON 10M+ wallets; Bitcoin LN consumer wallets combined 30–50M. Current ratio 1:3-5 in Bitcoin's favor. Falsifier fires if ratio inverts to 5:1 TON.

**Confidence.** Low-Medium. Wallet user counts are inconsistently disclosed; TON metrics include heavy bot/duplicate traffic; Lightning wallet counts include dormant installs.

**Contested.** User counts hard to compare across wallet methodologies. v4 commits to reporting ranges, not point estimates, and to publishing the methodology adjustments per quarterly review.

---

### 16. Miner fee revenue trajectory holds through 2027 — clean separation from F9

**Claim.** Bitcoin miner fee revenue rises enough, and public miners hold enough BTC, that the post-2028-halving security budget remains plausibly achievable.

**Falsification threshold.** Through end of 2027, **both**: (a) L1 fee revenue stays below 15% of total miner revenue (12-mo MA), AND (b) publicly listed miners cumulatively liquidate >50,000 BTC for non-mining capex (AI compute, HPC, energy assets) since January 2025.

**v4 separation rule — F16 vs F9.** F16 measures the *trajectory* through end-2027 — fee mix and miner-treasury behavior visible before the April 2028 halving. F9 measures the *post-halving reality* — the 12 months after April 2028. They are independently evaluable: F16 fires (or not) by end-2027; F9 fires (or not) by April 2029. F16 firing makes F9 firing more likely but does not satisfy F9. F9 firing does not retroactively satisfy F16.

**Measurement source.** mempool.space + Coin Metrics for fee mix; Bitcoin Treasuries + public-miner SEC filings for BTC liquidation. `[DATA]` `[DEV]` `[PRESS]`

**Why it matters.** The pre-halving trajectory is the leading indicator for the post-halving budget. v3's wording risked double-counting; v4 cleans this up.

**Status May 2026 — PRESSURE.** Fee revenue 12-mo MA roughly 10–15% — currently meeting condition (a). **Q1 2026 alone saw 32,000+ BTC liquidated by public miners** — 64% of condition (b) met in one quarter. If Q2–Q4 2026 maintain pace, F16 fires before deadline. **Next quarterly review (September 2026) is load-bearing for this falsifier.**

**Confidence.** High. Both measurement inputs are standard public series.

**Contested.** Distinguishing operational miner sales (mining-business cash flow) from diversification sales (AI/HPC/non-mining capex) requires careful methodology. v4 commits to using SEC filing disclosures of capex destination as the authoritative split, with quarterly reconciliation against on-chain treasury movements.

---

### 17. Quantum threat does not materialize before Bitcoin's quantum-resistance migration

**Claim.** Bitcoin's quantum-resistance migration tracks ahead of cryptographically relevant quantum computing capability, with sufficient margin that no material BTC supply is stolen via quantum attack.

**v4 reconciliation — BIP-360 and BIP-361 are separate proposals.**

- **BIP-360** — introduces Pay-to-Merkle-Root (P2MR), a new Bitcoin output type using post-quantum signatures (likely Dilithium / ML-DSA). **This is the activation that matters for F17(a).** Entered the Bitcoin BIPs repository February 10, 2026. Source: [github.com/bitcoin/bips — BIP-0360](https://github.com/bitcoin/bips/blob/master/bip-0360.mediawiki) `[DEV]`.
- **BIP-361** — proposes a soft-fork mechanism to *freeze* coins at quantum-vulnerable addresses on a deadline. **Contested. Not required for F17 to stay INTACT.** A reasonable migration path without BIP-361 is possible: users move funds from quantum-vulnerable to BIP-360 addresses voluntarily; coins that don't move remain exposed but the supply impact is bounded.

**Falsification threshold.** Either:

- **(a)** A cryptographically relevant quantum computer capable of breaking ECDSA in production is publicly demonstrated before end of 2032 AND **BIP-360-class quantum-resistant addresses have not yet activated on Bitcoin mainnet** (BIP-361 status is not part of this threshold);
- **(b)** any successful quantum-attack-based theft of BTC from a previously-secure address occurs, at any scale, before end of 2032.

**Measurement source.** IBM / Google / academic quantum hardware roadmaps. Bitcoin Core release notes and BIP repository. NIST post-quantum cryptography standardization. On-chain forensics of theft events. `[DEV]` `[INST]`

**Why it matters.** **The only single-event falsifier that could unilaterally invalidate Bitcoin's SoV claim.** Most other falsifiers (Tron displacement, L2 scale, regulatory) erode position; quantum could destroy it. v3's BIP-360/BIP-361 conflation made the falsifier harder to evaluate; v4 ties F17 to BIP-360 only.

**Status May 2026 — INDETERMINATE.** No CRQC exists. BIP-360 entered repository February 10, 2026; BTQ Bitcoin Quantum testnet v0.3.0 March 2026 with working P2MR. BIP-361 contested. No Bitcoin quantum-resistance soft fork has activated. Status moves to PRESSURE if either: hardware progress accelerates materially (>10x year-over-year qubit growth with error correction) OR BIP-360 activation timeline slips past end of 2030.

**Probability bands per [Quantum Scenario companion](quantum-scenario.md):** CRQC by 2030: 5–15%. By 2035: 30–60%. By 2040: 70–90%. Bitcoin quantum-resistance migration timeline: 2028–2032 under reasonable assumptions.

**Confidence.** Low for the probability bands (wide error margins acknowledged); High for the binary "has BIP-360 activated" check.

**Contested.** Probability bands carry wide error margins. Methodology re-published quarterly with current hardware-progress data.

**Deadline:** End of 2032.

---

## Scoring rubric (v4 — 17 falsifiers, unchanged from v3)

Each quarter, each falsifier is marked: INTACT · PRESSURE · FIRED · INDETERMINATE.

**Verdict thresholds:**

- **0–4 fired by end of 2028:** thesis **intact**. Quarterly affirmation with PRESSURE caveats.
- **5 fired:** thesis **partially intact**. Substantive amendment article.
- **6+ fired:** thesis **rejected**. Full retraction-and-rebuild. Original article marked rejected.

**F17 unilateral-invalidation rule:** F17 firing alone is sufficient for thesis rejection regardless of other falsifiers' status. The dashboard verdict logic enforces this.

For long-horizon falsifiers (F1, F8, F12, F13, F17), the same verdict structure applies on an extended timeline, with final assessment January 2031.

**F16 has the earliest deadline (end of 2027). F17 has the longest (end of 2032). F9 evaluates over April 2028–April 2029.**

---

## Correlated-failure scenarios (preserved from v3)

The 17 falsifiers are *not* statistically independent. The main thesis Part VII maps four correlated-failure scenarios:

1. **BTC price crash 50% over 6 months with failed adoption recovery** — fires F2, F3, F4, F11, F16 in the worst case (5 falsifiers, one short of rejection).
2. **Tether enforcement action** — fires F3, F7, F10, potentially F13 (3–4 falsifiers, below rejection threshold; substantial L4 reorganization required).
3. **Regulatory pressure on non-custodial swap operators (multi-vector enforcement)** — fires F10, F3, potentially F2 (2–3 falsifiers).
4. **ETF custody concentration event** — fires F8, F10, potentially F1 narrative damage (2–3 with reputational risk exceeding direct fires).

**Correlated fires are structurally different from independent fires.** Both can technically reach partial-intact (5 fired) or rejected (6+ fired) verdicts. The correlated version is recoverable (root cause repair); the independent version usually is not.

v4 preserves v3's commitment: **each quarterly review explicitly distinguishes correlated from independent fires** in the narrative interpretation. The verdict thresholds stay the same; the explanation makes the failure mode visible.

---

## Review cadence

- Quarterly: March, June, September, December
- Annual deep review: January
- Triggered: within 14 days of any single falsifier firing
- Methodology immutability rule preserved — thresholds can only be tightened

---

## The thesis's expected verdict path through 2028 (updated v4)

- **Highly likely INTACT:** F1 (BTC dominance, with v4 denominator clarification), F8 (sovereign adoption, with v4 six-test rubric), F12 (Solana SoV gap), F17 (quantum — long horizon)
- **Uncertain:** F2 (Lightning + L2 volume — heavily dependent on self-custodial vs operator-assisted split), F3 (Bitcoin-rail stablecoin volume by trust tier), F5 (BitVM survives), F10 (regulatory — expanded test set)
- **Genuinely contested:** F4 (L3 TVL by taxonomy tier), F6 (covenant OR operationally-defined L2 escape hatch), F9 (post-halving — INDETERMINATE until April 2029), F11 (L2 tokens)
- **Expected to fire (v4 humility flagged):** F13 (Tron displacement — v4 explicitly expects to fire and absorbs the structural disadvantage), F14 (Eth L2 scale), F15 (TON consumer reach), F16 (miner fee revenue trajectory — already PRESSURE)

**If F13 + F14 + F15 all fire (the v2 acknowledged structural disadvantages), thesis verdict: 3 fired, intact. Consistent with v4 framing.**

**If F16 also fires (high near-term probability), 4 fired — still intact, but on edge.**

**The thesis fails (6+ fired) only if:**
- F13 + F14 + F15 + F16 fire (the acknowledged disadvantages plus miner economics) — 4 fired, AND
- At least two of {F2, F3, F4, F5, F10, F11} also fire (catastrophic correlated failure across MoE/programmability/regulatory/security layers)

That combined scenario is the v4 worst case. It puts the burden on the symbiotic-sovereign architecture itself, not on any individual front.

---

## What firing F17 would mean

F17 firing is structurally different from the other falsifiers. All other fires erode Bitcoin's position; F17 could *destroy* it. A successful quantum theft of BTC from previously-secure addresses, at any scale, would shake confidence in Bitcoin's L0 cryptographic foundations — which the entire symbiotic-sovereign thesis depends on.

If F17 fires: the thesis as a whole is invalidated regardless of the other falsifiers' status. The successor article would not be a v5 of this thesis; it would be a different thesis about a different Bitcoin. The methodology-immutability rule does not require firing other falsifiers to declare F17-triggered rejection; F17 firing alone is sufficient.

This is the asymmetric risk the framework explicitly carries.

---

## Companion documents

- [Main thesis v4](thesis-v4.md)
- [Executive TL;DR](executive-tldr.md)
- [Newcomer One-Pager](newcomer-onepager.md)
- [Field Guide](field-guide.md)
- [Counter-Map](counter-map.md)
- [Competing Theses](competing-theses.md)
- [Quantum Scenario](quantum-scenario.md)
- [Regulatory Deep-Dive](regulatory-deep-dive.md)
- [Methodology & Disclosure](disclosure-methodology.md)
- [Interactive Dashboard](dashboard.html)

---

*v4 published May 2026. Methodology version 4.0. v3, v2.1, v2, v1 archived. First quarterly update under v4: September 2026.*
