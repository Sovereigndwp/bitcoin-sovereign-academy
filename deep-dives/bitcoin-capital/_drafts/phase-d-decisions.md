# Phase D — Decisions (Section 11 of the handoff brief)

*Resolved before writing code. 2026-06-18.*

---

## Q1 — Single-file or split JS?

**Decision: Embed inline.** Match the mortgages calculator pattern; keep deployment as static HTML on Vercel with no build step. The calculator JS is a self-contained IIFE appended to the existing bottom `<script>` block (after the footer-date and disclosure-dismiss handlers). If the JS exceeds ~500 lines after D2, revisit splitting into `_drafts/loans-calculator.js` — but the goal is one file.

Chart.js: load the **local `chart.umd.js` bundle** (same directory) with a CDN `onerror` fallback, copying the exact pattern from `bitcoin-backed-mortgages.html` line 104–105. No CDN in the primary path.

## Q2 — Provider weighting algorithm

**Decision: Use the brief's suggested approach, with explicit constants.**

- `cost_score` = (cheapest applicable provider's USD cost) / (this provider's USD cost), clamped to [0, 1]. For LMC (BTC-denominated), use the BTC-fee USD-equivalent at origination (`fee_usd_at_origination`) as the cost figure for ranking, *not* the negative net_cost — the negative net cost folds in tax deferral + T-bill yield, which is an apples-to-oranges comparison against fiat interest. The net-cost framing is surfaced separately in the LMC card/decision summary, not in the ranking denominator. (This avoids a divide-by-negative that would break the score.)
- `risk_score` = 1.0 if no margin call; 0.5 if margin call and no rehypo; 0.0 if margin call **and** rehypo.
- `custody_score`:
  - 1.0 — collaborative multisig with borrower key (LMC, Unchained, Debifi)
  - 0.7 — self-custody DLC (Lava)
  - 0.5 — qualified custodian, no rehypo (Ledn Custodied, Arch)
  - 0.3 — qualified custodian / hybrid-wrapped, no loan-level rehypo but weaker bankruptcy-remoteness (Coinbase/Morpho)
  - 0.3 — qualified custodian with rehypo (Ledn Standard, SALT)
  - 0.0 — exchange / pooled (Bitfinex)
- `tolerance_weights` (order = [cost, risk, custody]):
  - sovereignty: [0.2, 0.3, 0.5]
  - convenience: [0.3, 0.4, 0.3]
  - cost: [0.6, 0.2, 0.2]
- `total_score` = Σ(weight × score). Ranking is descending total_score among **applicable** providers only.

Tie-break: higher custody_score, then lower cost.

## Q3 — Options overlay: illustrative or live?

**Decision: Illustrative, from locked JSON.** No live API. Read `options_strategies` from `loans-math-output.json`. Reference bands shown:
- Long put 35% OTM — `long_put_35_otm.total_cost_usd` (~$8,594 at 5 BTC / 12mo)
- Put spread 50/25 — `put_spread_50_25.total_cost_usd` (~$22,658 at 5 BTC / 12mo)

Both scaled to the user's BTC quantity (JSON assumes 5 BTC notional; scale linearly by `btcQty / 5`). Labeled with BS assumptions (**80% IV, 4.5% risk-free, 12-month tenor**) and a *"verify with a live quote"* note. This satisfies discipline requirement #2.

## Q4 — Path-dependency modeling

**Decision: Smooth CAGR + prominent warning.** Matches the mortgages calculator scope. The scope strip carries the path-dependency warning on every render (discipline #1). Stochastic path simulation is deferred to a possible Phase G. The margin-call output is framed as *"did the smooth path cross the threshold within the term,"* and the strip explicitly states real paths cross thresholds intra-term in ways CAGR does not capture.

## Q5 — Surface the "sell outright" steelman?

**Decision: Yes, as a "consider this" callout, not an automatic dismissal.** When the cheapest applicable loan's USD cost over the horizon exceeds the LTCG tax that selling the loan-equivalent BTC would realize (computed from cost basis + the 25% default combined rate, framed as a *taxable disposition that may be a gain or loss*), the decision summary appends a callout pointing the reader to the Steelman section (Part XII½ / `#objections` steelman block). It never tells the reader to sell — it surfaces the comparison and links the steelman.

---

## Q6 (discovered) — Unchained number discrepancy

The handoff brief Section 7 lists *"Unchained (Commercial): 5 BTC pledged, ~$80,000"* and the **current placeholder table** shows `~$80,000 over 24 months (14% interest + 16.21% APR with origination)`. But the **locked `loans-math-output.json`** value for Unchained at $250K / 24mo is **$54,950 at the 10.99% tier** (the older tiered personal-loan rate). `providers.json` notes the personal product "appears to be discontinued in favor of the commercial loans product" at 14% / 16.21% APR.

**Decision: Drive the calculator from `loans-math-output.json` ($54,950), because the brief's explicit contract is "all numerical claims must reconcile with loans-math-output.json" and the reproducibility test treats the worksheet/JSON as ground truth.** To avoid misleading the reader, the Unchained card carries a "watch out for" caveat surfacing the commercial-rate reality: *"Now positioned as a commercial/B2B product; published commercial pricing is higher (14% interest, 16.21% APR with origination). The figure shown uses the locked tiered rate — verify your tier and product with Unchained."* Re-deriving Unchained to the commercial rate is a **data-layer correction** (edit the worksheet + regenerate JSON), out of scope for the Phase D calculator build; flagged here for a follow-up data task.
