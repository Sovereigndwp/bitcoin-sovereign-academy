# Bitcoin-Backed Mortgages: A First-Principles Deep Dive

*Building the category from primitives — what Bitcoin is, what a mortgage is, what their combination actually creates — then running the numbers, the projections, and the risk surface honestly.*

---

## Part I. The ontology

Most writing on this product starts with the marketing label ("Bitcoin mortgage") and works outward. That is backwards. The label encodes assumptions you should derive, not import. Start from the primitives.

### What Bitcoin is, structurally

Bitcoin is a digital bearer instrument with five essential properties:

1. **Scarce** — supply is capped at 21M units by consensus rule, asymptotically issued on a fixed schedule.
2. **Bearer** — control of the private key is control of the asset. There is no registry, no court that can reverse a transfer.
3. **Liquid** — 24/7 markets, global, deep, with price discovery in seconds.
4. **Volatile** — realized annualized volatility has averaged 60–80% over Bitcoin's history, an order of magnitude above broad equities (typically 15–20%) and two orders of magnitude above prime real estate (typically 2–5%).
5. **Non-sovereign** — no issuer, no central counterparty, no nation-state-controlled clearing layer.

These properties are not equally important for understanding the mortgage product. The two that matter most are **bearer** and **volatile**. Bearer is what makes custody the central design question. Volatile is what makes the loan structure exotic.

### What a mortgage is, structurally

A mortgage is a long-duration secured loan with four essential properties:

1. **Long-duration** — typically 15–30 years, far longer than the lender's borrowing cost.
2. **Secured** — backed by a specific asset (collateral) the lender can foreclose on.
3. **Amortizing** — payments scheduled to reduce principal over the term.
4. **Recorded** — the lien is filed with a public registry (county recorder, land titles office), making the lender's claim enforceable against third parties.

A residential mortgage's collateral — real estate — has its own essential properties: **illiquid, slow-moving in price, recorded title, geographically fixed, and use-coupled** (the borrower lives in or rents out the asset while the lien is active).

### What collateral is, abstractly

Collateral is an asset whose control transfers conditionally — the borrower retains beneficial ownership unless they breach the obligation, at which point control transfers to the lender. The lender's risk on a collateralized loan reduces to two questions:

- Can I take possession of the collateral if I need to?
- Can I sell it for enough to cover the unpaid balance, fast enough to matter?

For residential real estate, the answer to the first question is yes but slow (foreclosure timelines range from months in non-judicial states to years in judicial states). The answer to the second is usually yes (real estate markets clear, eventually).

For Bitcoin, the answer to the first question depends entirely on custody arrangement. The answer to the second is yes and instantly — but at whatever price the market offers, including in the middle of a drawdown.

### What a Bitcoin-backed mortgage is, derived

Combining the primitives: a Bitcoin-backed mortgage is a long-duration, amortizing loan secured by **two collateral assets with maximally different liquidity and volatility profiles**. The lender holds:

- Illiquid, slow-moving real estate with a recorded lien
- Liquid, fast-moving Bitcoin with conditional custody control

This combination is genuinely novel — not because of marketing, but because no traditional secured loan structure pairs two collateral assets with such different time constants. The fast-moving collateral (BTC) absorbs price shocks the slow-moving collateral (real estate) cannot, but creates margin-call dynamics absent from a pure-real-estate mortgage.

That dual-collateral structure is the thing to understand. Everything else — rates, terms, lender choice, tax treatment — is downstream.

---

## Part II. The taxonomy

Three products get blurred under the "Bitcoin mortgage" label. They are different from first principles.

| Property | Crypto-Assisted Mortgage | Bitcoin-Collateralized Loan | Bitcoin-Backed Mortgage |
|---|---|---|---|
| Taxable event at origination | Yes (sale) | No (pledge) | No (pledge) |
| BTC retained by borrower | No | Yes (custody varies) | Yes (custody varies) |
| Secured by real estate | Yes | No | Yes |
| Secured by BTC | No | Yes | Yes (both) |
| Typical term | 15–30 yr | 1–3 yr | 30 yr |
| Typical LTV (vs. collateral) | 80–95% | 30–50% | up to 100% (vs. BTC value) |
| Margin call possible | No | Yes | Yes |
| Forced liquidation of BTC possible | No | Yes | Yes |
| Counterparty risk on BTC | None | Yes | Yes |

Only the third row in the bottom block — *Bitcoin-Backed Mortgage* — is the subject of this deep dive. The other two are useful reference points for the trade-offs.

---

## Part II½. Within BTC-backed mortgages, two structural models

Not every Bitcoin-backed mortgage uses the same risk-transfer mechanism. As of 2026 there are **two distinct structural models** in the US market, and the choice between them is one of the most important decisions a borrower makes.

### Model A — Price-based margin call (Milo, Better/Coinbase)

The mortgage rate is **fixed**. The lender monitors the LTV ratio. If Bitcoin's price drops below a defined threshold (Milo: 65% drawdown from origination), the lender issues a margin call. The borrower must add collateral, pay down principal, or accept forced liquidation of pledged BTC at the bottom of the cycle.

This is the structure most US-licensed Bitcoin-backed mortgage products use today. Milo originated $100M+ on this model. Better Home and Finance + Coinbase launched a conforming variant in March 2026.

### Model B — Dynamic-rate adjustment (Peoples Reserve)

The mortgage rate is **variable**, tied to the collateral ratio and Bitcoin's price. If Bitcoin appreciates, the rate falls — rewarding the borrower with cheaper capital. If Bitcoin drops, the rate rises — compensating the lender for the added risk. There is **no price-triggered margin call**. Liquidation occurs only if the borrower defaults on payments, not on a BTC price move.

Peoples Reserve's **Bitcoin Powered Mortgage (BPM)**, founded by CJ Konstantinos, is the leading example as of 2026. Reported features:

- Rates start at prime + 1 and can fall as low as ~3.5% APR with sufficient collateral
- Custody uses multisignature wallets with no rehypothecation
- No prepayment penalties
- No price-based liquidation — the borrower never faces a forced sale of pledged BTC
- Adjacent products: **HEBLOC** (Home Equity Bitcoin Line of Credit) converting home equity into BTC exposure, and a **Bitcoin-Powered Bond** blending Treasury principal protection with BTC upside

### Structural comparison

| Property | Model A (Milo, Better/Coinbase) | Model B (Peoples Reserve) |
|---|---|---|
| Mortgage rate | Fixed | Variable (tied to BTC price + collateral ratio) |
| Margin call risk | Yes | No (price-based) |
| Forced liquidation of BTC | Possible at margin threshold | Only on borrower default |
| Monthly payment certainty | High | Low (depends on BTC path) |
| Headline APR (2026) | 6.5–8.5% | as low as ~3.5% |
| Custody model | Lender-held or qualified custodian | Multisig, no rehypothecation |
| Risk absorbed by | Borrower's collateral | Borrower's cash flow |
| Worst case for borrower | Forced sale at cycle bottom | Spike in monthly payment |

**The structural trade-off, plainly:** Model A's risk lives in the *asset* (forced liquidation). Model B's risk lives in the *cash flow* (variable payment). Neither is universally better. A holder with stable, scalable income and high BTC-price conviction may prefer Model B (lower expected rate, cash flow flexibility absorbs volatility). A holder with fixed income and lower BTC-price conviction may prefer Model A (predictable payments, accepts the tail risk).

The remainder of this deep dive — including the formal mechanics in Part III and the projection scenarios in Part V — focuses on **Model A**, because it is the structure most widely used by US-licensed lenders today and produces the cleanest closed-form math. Model B's projection requires a stochastic interest-rate model dependent on BTC's path; that math is best evaluated case-by-case with the originating lender.

---

## Part III. The mechanics, formalized

A Bitcoin-backed mortgage can be described by a small set of state variables and a few transition rules. Stating them formally clarifies what is and is not at risk.

### State variables

Let:

- `P(t)` = price of Bitcoin at time t (USD per BTC)
- `Q` = quantity of BTC pledged (fixed at origination)
- `L(t)` = outstanding loan balance at time t
- `LTV(t) = L(t) / (P(t) × Q)` = current loan-to-value ratio
- `r` = mortgage APR (fixed in most products)
- `T` = loan term (typically 30 years)
- `M` = margin call LTV threshold (lender-set; Milo's translates to roughly LTV ≥ 2.86, i.e., a 65% drop in BTC price)

### Dynamics

`L(t)` decreases monotonically through amortization. `P(t)` follows a stochastic process with very wide variance. `Q` is constant unless the borrower adds collateral or the lender liquidates.

The borrower is in good standing as long as `LTV(t) < M`. When `LTV(t) ≥ M`, the lender issues a margin call. The borrower has a defined cure window to either:

- Add to `Q` (more BTC collateral)
- Reduce `L(t)` (partial paydown in cash)
- Some combination

If the cure window expires without action, the lender liquidates `ΔQ` of the pledged BTC to restore `LTV(t) < M`.

### Visualizing LTV evolution under different price paths

```
LTV over time (illustrative — 100% initial LTV, 30Y term, 7.5% APR)

LTV
  ↑
3.0 │ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─   ← M (margin call)
    │
2.5 │  ●
    │   ●●        ← Path C: BTC −60% in Y2, recovery Y5+
2.0 │     ●●
    │       ●●●
1.5 │           ●●●●●●●
    │                  ●●●●●●●●
1.0 ●●○○○○○○○○○○○○○●●●●●●●●●●●●●●●●●●  ← Path B: BTC flat
    │      ○○○○○○○○○○○●●●●●●●●●●●●●●●●
0.5 │             ○○○○○○○○○○○○●●●●●●●●  ← Path A: BTC +20%/yr
    │                    ○○○○○○○○○○○○○○
0.0 └────────────────────────────────────────────────→ years
    0    5    10   15   20   25   30
```

Three observations from the dynamics:

1. **Amortization is your friend.** Even with `P(t)` flat, `LTV(t)` improves every month because `L(t)` is falling. By year 10, `L(t)` on a 30Y at 7.5% is about 88% of original principal. By year 20, about 56%.

2. **Margin-call risk is front-loaded.** The first 3–5 years are where `LTV(t)` is highest and amortization has not yet provided meaningful cushion. A drawdown in year 1 is much more dangerous than the same drawdown in year 15.

3. **Margin-call risk falls off a cliff as time passes.** By year 10–15 of a 30-year, the loan is shrinking and the collateral has had time to compound. The only way to a margin call from there is a near-total wipeout of BTC, which has not historically occurred over a 5+ year window.

---

## Part IV. Statistics — Bitcoin's drawdown history

The 65% margin-call threshold sounds far away. Bitcoin's history says it has happened repeatedly, and that the size and timing of drawdowns matters more than the single biggest number.

### Major drawdowns (peak-to-trough)

| Period | Peak (approx.) | Trough (approx.) | Drawdown | Recovery time to prior peak |
|---|---|---|---|---|
| 2011 | $32 | $2 | −94% | ~22 months |
| 2013–15 | $1,150 | $170 | −85% | ~36 months |
| 2017–18 | $19,800 | $3,200 | −84% | ~36 months |
| 2021–22 | $69,000 | $15,500 | −77% | ~24 months |
| Median | — | — | **−85%** | **~30 months** |

Two takeaways from this distribution:

- **Every cycle has produced a drawdown larger than the 65% margin threshold.** Not "once" — every major cycle, four of four.
- **Recovery times have ranged 22–36 months.** A margin call near the bottom of a cycle would force liquidation at the worst possible price, exactly when waiting another 12–24 months would have restored the LTV organically.

The structural read: Bitcoin's price history is consistent with the 65% threshold being breached approximately once per cycle. Cycles have historically been 4 years. Anyone holding a 30-year BTC-backed mortgage should plan around the assumption that **one or more margin events will occur during the life of the loan**, not assume none will.

### Annualized volatility

Bitcoin's realized 1-year volatility has clustered between 40% and 100% annualized, varying by year. For comparison:

| Asset | Typical annualized vol |
|---|---|
| Bitcoin | 50–80% |
| Tech equities (NDX) | 20–30% |
| Broad equities (SPX) | 12–18% |
| Investment-grade bonds | 4–8% |
| Prime US residential real estate | 2–6% |

The volatility ratio between BTC and real estate is roughly **15–30×**. This is the mathematical reason the dual-collateral structure is interesting: the high-vol collateral absorbs the variance that would otherwise need to come from a much larger real-estate equity cushion.

### Probability of a margin call, illustrative

Using historical realized log-volatility and a basic geometric Brownian motion model (caveat: BTC's price history shows fat tails, regime shifts, and structural maturation — GBM under-models the real dynamics), a 65% drawdown over a 30-year horizon has cumulative probability approaching 1. The right question is not "will it happen" but "when" and "what is the LTV at that point."

Rough scenario probabilities, illustrative only:

```
Cumulative probability of a 65%+ drawdown from origination
(scaling with √t under historical vol assumptions)

  P(drawdown)
  ↑
1.0 │                                  ●●●●●●●●●●
    │                          ●●●●●●●
0.8 │                   ●●●●●●●
    │              ●●●●
0.6 │          ●●●●
    │       ●●●
0.4 │     ●●
    │   ●●
0.2 │  ●
    │ ●
0.0 ●────────────────────────────────────────→ years
    0    5    10   15   20   25   30
```

By year 5 the cumulative probability of having seen at least one 65% drawdown is high. By year 15 it approaches 1. The relevant defense is not avoiding the event — it is ensuring `L(t)` has amortized enough by the time it happens that the lender's actual exposure is below the margin threshold.

This is why **front-loading principal paydown** is the single most important risk mitigant available to a Bitcoin-backed mortgage borrower. Extra principal payments in years 1–5 are mechanically the same as buying margin-call insurance.

---

## Part V. Projections — pledge vs. sell, scenario analysis

The right way to evaluate this product is not "what is the rate" but "what is the net worth distribution under realistic scenarios."

### Setup

Baseline borrower:
- Holds 5 BTC at current price $100K = $500K
- Cost basis: $100K (so $400K unrealized gain)
- Wants to buy a $500K home

Two paths:

**Path 1 (Sell):** Liquidate 5 BTC, pay taxes, buy home cash.
- After 20% federal + 5% state LTCG on $400K gain: tax bill $100K
- Net proceeds: $400K
- Need to finance $100K additional (assume cash on hand) OR buy a smaller home
- Future BTC exposure: 0

**Path 2 (Pledge):** Pledge 5 BTC, take $500K mortgage at 7.5% APR / 30Y.
- Monthly payment: ~$3,496
- Year-1 interest: ~$37,200
- Future BTC exposure: 5 BTC (subject to margin call)

### Five-year net-worth comparison under three BTC scenarios

Assumptions: home appreciates 3%/yr in all scenarios. All amounts approximate, no tax on home appreciation, ignores property tax/insurance for clarity.

```
5-year net worth ($K)

Scenario A: BTC +20% CAGR (rough historical late-cycle)
                  Sell    Pledge
End BTC value:    $0      $1,244K
Home equity:      $579K   $539K  (Path 1 cash buy, smaller appreciation base)
Loan balance:     -       -$471K
Net worth:        $579K   $1,312K       Pledge wins by $733K

Scenario B: BTC flat at $100K
                  Sell    Pledge
End BTC value:    $0      $500K
Home equity:      $579K   $539K
Loan balance:     -       -$471K
Net worth:        $579K   $568K         Roughly tied

Scenario C: BTC -60% over 5 years (recovery only partial)
                  Sell    Pledge
End BTC value:    $0      $200K
Home equity:      $579K   $539K
Loan balance:     -       -$471K (assumes margin call survived)
Net worth:        $579K   $268K         Sell wins by $311K
  Plus: margin call risk during the drawdown could force partial
        liquidation at unfavorable prices, making this worse.
```

### What the scenarios show

- The pledge path has **asymmetric upside**. In strong BTC scenarios it dramatically outperforms the sell path. In flat scenarios it roughly ties. In bad BTC scenarios it underperforms — possibly by a lot, and possibly accompanied by forced liquidation.

- The decision is fundamentally a **bet on BTC outperforming the after-tax interest cost over the loan term**. At 7.5% APR, you need BTC to compound faster than ~6% after-tax to break even, ignoring the tax-deferral benefit on the avoided sale.

- The tax-deferral benefit is real and non-trivial. The $100K saved at origination compounds for the life of the loan. At 6% real, that becomes ~$320K over 20 years.

- **Volatility timing matters more than average return.** A flat path can be safe. A -60% / +60% / 0% path averaging to the same place is dangerous because of the margin-call episode.

### Break-even formula, simplified

Approximate decision rule, ignoring secondary effects:

```
Pledge wins if:    BTC_CAGR > r_mortgage - (tax_savings_yield + opportunity_cost_adjustment)
```

Where `tax_savings_yield` is the annualized benefit of having deferred the LTCG, typically 1.5–3% over a 30-year horizon at 20% LTCG rates. The threshold for pledging to win is generally a BTC CAGR of 4–6% above the mortgage rate, with significant downside risk if it does not happen.

For context, BTC's trailing 10-year CAGR has been roughly 60–80% through most measurement windows in the 2015–2024 period, but is widely expected to compress as the asset matures. Whether forward returns will clear a 4–6% hurdle is the central question. **No model can answer it; the borrower has to take a view.**

---

## Part VI. The risk surface, decomposed

Risk on this product is not one-dimensional. Decomposing it makes the evaluation tractable.

### Risk decomposition

```
Total risk to borrower
│
├── Market risk (BTC price)
│   ├── Magnitude of drawdown
│   ├── Timing within loan term
│   └── Recovery speed
│
├── Counterparty risk
│   ├── Lender solvency
│   ├── Custodian solvency
│   └── Rehypothecation cascade
│
├── Custody risk
│   ├── Key compromise (lender, custodian, or borrower in multisig)
│   ├── Wallet operational failure
│   └── Jurisdictional seizure
│
├── Tax cliff risk
│   ├── Forced liquidation triggers LTCG
│   ├── At an inopportune time
│   └── In a year of impaired liquidity
│
├── Cash flow risk
│   ├── Mortgage payment must be serviced regardless of BTC price
│   └── Job loss + BTC drawdown = compound stress
│
├── Regulatory risk
│   ├── State-level licensing changes
│   ├── Federal tax treatment changes
│   └── Securities/commodities classification changes
│
└── Operational risk
    ├── Margin call notification reliability
    ├── Cure-window mechanics
    └── Liquidation execution quality
```

The risks are correlated. A BTC drawdown that triggers a margin call typically arrives in the same macro environment as job-loss risk and lender-stress risk. Diversifying across them is harder than it sounds.

### Counterparty risk is the deepest cut

Market risk is publicly observable. You can model it, hedge it, watch it. Counterparty risk hides until it ruptures, and then ruptures fully. The 2022 cohort proved this.

Three structural mitigants reduce counterparty risk meaningfully:

1. **Bankruptcy-remote custody.** Collateral held by a regulated trust company in a structure where the BTC is legally segregated from the lender's balance sheet. If the lender fails, the BTC is returned to borrowers, not pulled into the estate.

2. **No rehypothecation.** The lender does not re-lend pledged collateral to third parties for yield. The contract should say this explicitly.

3. **Self-custody multisig.** A 2-of-3 multisig where the borrower holds one key removes unilateral lender control over the collateral. The lender cannot move the BTC without borrower cooperation, and cannot lose it through an internal failure that the borrower cannot see.

If a lender's product does not offer at least one of #1 and #2, the counterparty risk profile is similar to the 2022 cohort regardless of marketing claims.

---

## Part VII. The 2022 lesson, from first principles

The 2022 collapse was not bad luck. It was structurally predictable. Understanding why is the most useful single exercise for evaluating any current lender.

### What failed (Celsius, Voyager, BlockFi, Genesis)

All four shared four structural features:

1. **Maturity mismatch.** Customer deposits were on-demand or short-notice. Lender assets were long-duration loans, often to a small number of large counterparties.
2. **Rehypothecation.** Customer collateral was re-lent multiple times to chase yield. The 2022 pre-collapse leverage in the wholesale BTC lending market was estimated in the multiple billions.
3. **Counterparty concentration.** Three Arrows Capital, Alameda/FTX, and a handful of other large players were on the other side of much of the wholesale book.
4. **Pooled, non-segregated custody.** Customer collateral was not segregated. When the entity failed, the bankruptcy court treated the assets as estate property.

When 3AC failed in mid-2022, the cascade propagated through the wholesale market in days. FTX's failure in November propagated within 48 hours. Both events would have been survivable for properly-structured custodians; they were terminal for these four because the structure was wrong.

### What survived (Ledn, Milo)

Both shared structural features that the failed cohort lacked:

1. **Term matching.** Loans against term liabilities or against equity, not against on-demand deposits.
2. **No or limited and disclosed rehypothecation.** Pledged collateral was held, not re-lent.
3. **Counterparty diversification.** No single counterparty was a structural risk.
4. **Real underwriting.** Borrowers were qualified. The book was a portfolio of secured loans, not a directional bet on crypto market structure.

The lesson generalizes to a current lender evaluation: **the questions to ask are structural, not promotional**. Marketing claims about "safety" are noise. What matters is the legal structure of custody, the disclosure of rehypothecation, and the published bankruptcy-remoteness arrangements.

---

## Part VIII. Evaluating a lender — first-principles checklist

Each item below maps to a specific failure mode from the 2022 cohort or a specific risk in the decomposition above. Skip none of them.

**On custody structure:**
- Who holds the keys? (Lender / qualified custodian / multisig with borrower)
- Is the collateral segregated or pooled?
- Is the legal structure bankruptcy-remote? (Get the legal opinion in writing if possible)
- What is the proof-of-reserves cadence and methodology?

**On rehypothecation:**
- Is your pledged BTC re-lent to third parties?
- If so, to whom, on what terms, and with what disclosure?
- What is the lender's exposure if a rehypothecation counterparty fails?

**On margin-call mechanics:**
- What is the trigger threshold expressed as both LTV and BTC drawdown from origination?
- What is the cure window, in business days vs. calendar hours?
- What notification channels does the lender use, and is there a fallback if you miss the first one?
- Can the lender liquidate without you confirming receipt of the notice?

**On loan terms:**
- APR, fees, points, prepayment penalties (any prepayment penalty is a red flag — you need the right to pay down faster than amortization)
- Refinance terms
- Whether the lender reports to credit bureaus
- What happens at term end if BTC has appreciated dramatically (release mechanics)

**On regulatory standing:**
- NMLS license number (verify on the NMLS Consumer Access database)
- State-by-state licensing
- Recent enforcement actions or consent orders

**On track record:**
- How many margin calls has the lender issued, and what was the outcome?
- How many forced liquidations?
- What is the loss-given-default on the book?

If a lender will not answer any of these in writing, that itself is the answer.

---

## Part IX. Decision framework

The product fits a specific borrower profile cleanly. Outside that profile it ranges from suboptimal to catastrophic. The fit conditions, derived from the analysis above:

**The product is a good fit when:**
- Unrealized gain on the BTC is large enough that the tax cost of selling exceeds 2+ years of mortgage interest.
- The pledged BTC is a minority of the borrower's total BTC stack (so a forced liquidation is not catastrophic).
- The borrower has stable, predictable income to service the monthly payment regardless of BTC price.
- The lender offers self-custody multisig or bankruptcy-remote qualified custody with no rehypothecation.
- The borrower can make principal prepayments in years 1–5 to compress the LTV before the first cycle drawdown.

**The product is a bad fit when:**
- The borrower would be pledging most or all of their stack.
- The borrower's income is variable or BTC-correlated (working in the industry, depending on BTC-denominated revenue).
- The lender's custody arrangement is opaque or pooled.
- The borrower would be financially fragile if forced to liquidate at the bottom of a cycle.
- The borrower's cost basis is close to current price (small unrealized gain — the tax-deferral benefit is small and the risk is large).

The strongest version of the trade is for a holder who is **already past the wealth-building phase** with respect to Bitcoin, has multiple stacks across different storage arrangements, has stable income from non-Bitcoin sources, and is using the mortgage to deploy a small slice of their stack into housing without disturbing the rest.

---

## Part X. Open questions and what to watch

A few items are genuinely unresolved as of mid-2026.

1. **IRS treatment of pledged crypto.** The current "pledging is not a sale" consensus rests on inference from rules about stock pledging, not affirmative crypto-specific guidance. A future Revenue Ruling could shift this. Watch for IRS notices and any tax court cases involving forced liquidation of pledged crypto.

2. **The self-custody mortgage wave.** Milo's self-custody product, Peoples Reserve's multisig-by-default structure, and Block Earner's Australian product are the leading edge. If more lenders adopt borrower-held-key multisig, the counterparty problem is materially reduced. Expect this category to grow.

3. **The dynamic-rate model.** Peoples Reserve's Bitcoin Powered Mortgage replaces price-based margin calls with rate adjustment — a structurally different risk transfer. If this model proves out in a deep bear market, expect competitive pressure on Model A lenders to either match the structure or compete on rate. Watch for which model attracts more origination volume by 2027–28.

4. **Conforming-market integration.** Better Home and Finance launched a Coinbase-partnered conforming-style product in March 2026. If Fannie Mae or Freddie Mac formalize guidance accepting crypto as a permitted collateral type, mortgage rates on BTC-backed loans will compress toward conforming rates over time.

5. **Volatility regime.** Bitcoin's realized volatility has trended down as the asset has matured. If that continues, margin-call probability over a 30-year horizon falls. If it does not — and if cycles continue to produce 75%+ drawdowns — the structural risk profile of this product remains where it is now.

6. **The next stress test.** The next deep bear market will reveal whether the current generation of lenders priced volatility correctly and whether their bankruptcy-remote custody structures hold under conditions worse than 2022. This is the single most informative event for the category that has not yet happened.

---

## Bottom line

A Bitcoin-backed mortgage is, from first principles, a dual-collateral loan that pairs the slowest-moving collateral asset class (residential real estate) with the fastest-moving one (Bitcoin). The novelty is not marketing — it is structural. The structure transfers risk from "tax cost of selling" to "margin-call cost of holding" and replaces a one-time, certain cost with a stream of uncertain, contingent costs.

The math favors pledging over selling for a specific kind of holder: someone with large unrealized gains, stable non-BTC income, the discipline to prepay principal, and a lender whose custody arrangement survives the structural scrutiny the 2022 cohort failed. For that holder, the expected-value case is meaningfully positive.

For everyone else, the simple version — sell what you need, mortgage the rest, keep buying — is almost always the better play. Marketing pages will not tell you this. The math does.

---

*Educational only. Not legal, tax, or financial advice. Specific decisions require a CPA, attorney, or financial professional with Bitcoin experience.*

*Numerical examples are illustrative. Bitcoin drawdown history is approximate from public price data. Mortgage rates, terms, and margin-call thresholds vary by lender and time — verify with the originating lender before relying on any figure in this piece. Projections are scenario analyses, not predictions.*
