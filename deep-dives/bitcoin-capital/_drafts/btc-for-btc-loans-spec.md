# Bitcoin-Backed Loans Deep Dive — Structure Spec (v2)

*Updated with scoping decisions from Dalia (2026-05-11).*

---

## Working title

**"Bitcoin-Backed Loans: A First-Principles Deep Dive"**

Subtitle: *"Centralized Bitcoin-only lending — the providers, the structures, and how to pick the right product for your situation. Plus options strategies as a comparative hedge."*

Alternates:
- "Borrow Against Your Bitcoin: A First-Principles Deep Dive"
- "BTC-Backed Loans: A Comparative Guide for Long-Term Hodlers"

## URL

`/deep-dives/bitcoin-capital/bitcoin-backed-loans.html`

## Audience

- BTC holders who need liquidity but don't want to sell
- Readers evaluating multiple lender options
- Borrowers worried about forced liquidation considering hedge strategies
- People who came from the mortgage deep dive and want non-mortgage liquidity options

## Estimated length

**~30 min read.** Larger than the mortgage deep dive because of the comparative scope (4 providers + options strategies + hedge analysis).

## Scope — what's in and what's out

**IN scope:**
- Centralized BTC-only lending platforms (4 providers minimum)
- BTC-for-fiat AND BTC-for-BTC structures
- Full provider comparison matrix
- Comparative calculator
- Hedge analysis including options strategy comparison
- TBA-affiliation disclosure (clear, top-of-page banner)

**OUT of scope:**
- DeFi BTC lending (Sovryn Zero, etc.) — separate deep dive eventually
- Multi-asset crypto lenders (Salt, Nexo, Binance Loans) — these dilute the Bitcoin focus
- International providers without significant US/global footprint
- BTC-backed mortgages — already covered in the mortgage deep dive

## Provider coverage — the four

Bitcoin-only centralized lenders to cover in depth:

| Provider | Structure | Disbursement | Custody | LTV | Cost |
|---|---|---|---|---|---|
| **Loan My Coins (LMC)** | BTC-for-BTC | BTC | TBA collaborative multisig | 95% | 5% upfront, 12 mo, rollable to 5 yr |
| **Ledn** | BTC-for-fiat | USD / USDC | Qualified custodian (BitGo) | 50% | Variable APR (~10–13%), monthly interest |
| **Unchained** | BTC-for-fiat | USD | Collaborative multisig (3-key) | typ. 40% | Variable APR, term loans 6–12 mo |
| **Lava** | BTC-for-fiat | USD | Self-custody multisig (DLC-based) | typ. 50% | Variable APR, instant approval |

Brief mention with reasons for exclusion: Salt Lending (multi-asset), Nexo (multi-asset), Sovryn Zero (DeFi), Block Earner (international focus).

## Calculator: COMPARATIVE (a real differentiator)

**Inputs:**
- BTC quantity to pledge
- Current BTC price + cost basis
- Liquidity need ($ or BTC denominated)
- Horizon (months)
- Risk tolerance dropdown (sovereignty / convenience / cost-minimization)
- BTC price scenario (4 paths)

**Outputs:**
- **Recommended product ranking** — top 1–3 fits with reasoning
- **Side-by-side comparison table** across the four providers for the user's inputs:
  - Total cost over horizon (BTC + fiat denominated)
  - Margin call risk
  - Forfeiture scenarios
  - Custody model match
- **Visual: cost curve over time** — interactive chart showing cumulative cost across providers
- **Toggle: "What if I add a put option for protection?"** — overlays options-hedge math

This calculator is the page's centerpiece — it turns the deep dive into a decision tool.

## Section structure (12 parts)

### Part I — The ontology

What a BTC-backed loan *is*, structurally. Bearer-asset collateral. Two disbursement choices (fiat vs. BTC). Custody as the central design question. The 2022 cohort's structural failure decoded.

### Part II — Taxonomy

Two independent axes:
- **Denominator axis**: BTC-for-fiat (loan amount fixed in USD; LTV moves with price; margin calls possible) vs. BTC-for-BTC (loan amount fixed in BTC; LTV constant; no margin calls).
- **Custody axis**: Lender-held → Qualified custodian → Collaborative multisig → Self-custody multisig.

Visualize as a 2×4 matrix. Every product sits in one cell. Discuss the trade-offs of each cell.

### Part III — The 2026 provider landscape

Brief intro to each of the four covered providers — what they do, who's behind them, what's structurally distinctive. Quick mention of why we excluded Salt, Nexo, Sovryn Zero, Block Earner.

### Part IV — Provider deep-dives

One dedicated section per provider (~400 words each):
- **LMC** — BTC-for-BTC, TBA multisig, 5-yr roll, no margin call by structure
- **Ledn** — BTC-for-fiat, regulated, qualified custody, the most mainstream
- **Unchained** — BTC-for-fiat, collaborative multisig, the "sovereignty-first centralized" play
- **Lava** — BTC-for-fiat, self-custody multisig via DLCs, the newest entrant

Each provider gets the same template: terms table, custody architecture, fee structure, what makes them structurally distinctive, who they fit.

### Part V — First-principles: why denominator drives margin call structure

The structural argument. In a fiat-denominated loan, you owe a fixed USD amount; collateral USD value shifts with BTC price; ratio breaks at margin threshold. In a BTC-denominated loan, you owe a fixed BTC amount; collateral is a fixed BTC amount; ratio is constant — no fiat lens, no margin call surface.

This is why "no margin calls" isn't generous lender policy — it's mathematics.

### Part VI — Custody architectures (the 2022 lesson decoded)

Four custody models compared, ranked by counterparty risk:

1. **Lender-held** (Celsius, BlockFi pre-collapse) — highest risk
2. **Qualified third-party custodian** (Ledn → BitGo) — bankruptcy-remote in theory
3. **Collaborative multisig** (LMC, Unchained) — 2-of-3 with lender + borrower + key agent
4. **Self-custody multisig** (Lava via DLCs) — borrower retains full key control

The structural lesson from 2022: pooled custody + rehypothecation = systemic risk. Segregated multisig = survives stress events.

### Part VII — Comparative calculator (interactive)

The page's centerpiece. Described in the Calculator section above.

### Part VIII — The hedge misconception (full treatment)

Common framing in BTC capital-structure discussions: *"Use a BTC-backed loan to hedge against a BTC-backed mortgage's margin call risk."*

Walk through three structures:
1. **Direct use at margin call** — fails (need spare BTC to pledge to the loan; if you have spare BTC, send directly to Milo).
2. **Pre-positioned forward short with T-bill buffer** — technically a directional hedge, but trades away BTC upside. Full scenario analysis (drop/flat/moon) with numbers.
3. **Loan replaces mortgage entirely** — only viable for short horizons; 30-year compounding kills the math.

**Conclusion:** BTC-backed loans are not hedges. They're liquidity primitives. The structural mismatch is fundamental — a loan and a mortgage have the same directional exposure.

### Part IX — Options strategies as the hedge alternative

Comparison of options-based hedges for a Bitcoin holder worried about margin call or forced liquidation:

**Long puts.** Buy puts at strike near the margin threshold (e.g., 35% below current price). Pays off exactly when BTC drops. Cost = premium (typically 5–15% of notional for 12-month tenors). Maximum loss = premium paid. Full upside preserved. **Structurally the cleanest hedge.**

**Put spreads.** Buy a put at one strike, sell a put at a lower strike. Cheaper net premium, but capped protection — once BTC falls below the lower strike, the spread stops paying off. Good for moderate-drawdown protection at lower cost.

**Collars (zero-cost or low-cost).** Buy a put for protection, sell a call to fund the put. Net cost can approach zero. Trade-off: you cap your upside above the call strike. Suitable for hodlers who want defined downside protection and accept a defined upside cap.

**Cash-covered short calls.** Sell calls against your BTC position. Generate premium income. Caps upside but generates yield. Not really a hedge — more a yield play.

**Side-by-side comparison table:**

| Strategy | Cost | Max loss | Pays off when | Keeps upside? | Capital required | Counterparty |
|---|---|---|---|---|---|---|
| Long put | 5–15% premium | Premium | BTC drops below strike | Yes (above strike) | Premium only | Exchange (Deribit, CME) |
| Put spread | 2–6% premium | Premium | BTC drops within range | Yes (above strikes) | Premium only | Exchange |
| Collar (zero-cost) | ~$0 | Spread between strikes | BTC drops below put strike | No (capped at call strike) | Existing BTC | Exchange |
| BTC-backed loan as hedge | 5% upfront + roll | Forfeiture risk | Cash buffer at margin call (indirectly) | No (forward short equivalent) | Pledged BTC | Lender + multisig |

**The structural verdict:** for hedging margin call risk on a Model A mortgage, a put option at the margin threshold is mathematically cleaner than any loan-based structure. The loan-based forward short is "long volatility, short directionality" — it pays in the drop but loses in the moon. The put option is "long volatility, long downside, long upside" — it preserves the upside that motivated holding BTC in the first place.

### Part X — Tax considerations

- Pledging crypto as collateral: generally not a taxable event (US consensus)
- Forfeiture at term end: treated as a disposition; LTCG triggered at then-current FMV
- Cost basis tracking across LMC rolls (borrower buys BTC at term end, then delivers — no gain triggered on borrower side)
- Brief mention of state variations (FL/TX/WY favorable; CA/NY hostile)

### Part XI — Risk decomposition

Risk surface for each provider type:

- **Counterparty risk** (lender insolvency) — varies by custody model
- **Forfeiture risk** (especially LMC if BTC moons past roll capacity)
- **Margin call risk** (BTC-for-fiat structures)
- **Operational risk** (multisig key management)
- **Regulatory risk** (BTC-backed lending classification still evolving)
- **Tax cliff risk** (forced disposition triggering LTCG)

### Part XII — Decision framework

Plain-language flowchart:

```
Need liquidity from BTC, don't want to sell. Start here.
│
├─ Do you need fiat or BTC?
│  ├─ Fiat → Ledn, Unchained, or Lava (depending on custody preference)
│  └─ BTC → LMC
│
├─ How long is your horizon?
│  ├─ < 12 months → Any of the four
│  ├─ 1–5 years → LMC (rolls cleanly) or Unchained (term-renewable)
│  └─ 5+ years → Reconsider whether a loan is right; mortgage may fit
│
├─ What's your custody priority?
│  ├─ Self-custody → Lava
│  ├─ Collaborative multisig → LMC or Unchained
│  └─ Qualified custodian (regulated) → Ledn
│
└─ Worried about margin call?
   ├─ Want zero margin-call risk → LMC (structural)
   ├─ Willing to manage margin → Ledn / Unchained / Lava + monitoring
   └─ Want hedge protection → Long put or put spread (see Part IX), NOT another loan
```

### Part XIII — Open questions and what to watch

- Regulatory clarity on BTC-backed lending classification
- DLC adoption for self-custody loans (Lava's bet)
- Fannie/Freddie integration following the Better/Coinbase mortgage path
- The next stress test — will the post-2022 custody architectures hold up?
- Sovryn Zero / DeFi competitive pressure on centralized providers
- Cross-border lending — can a US borrower take a loan from a Swiss provider denominated in BTC?

## CTAs

Three placements:

1. **Top-of-page disclosure banner** (always visible): *"Disclosure: Bitcoin Sovereign Academy is created by Dalia, who advises at The Bitcoin Adviser (the parent of Loan My Coins). This deep dive covers LMC alongside three independent competitors. The analysis is structural; readers should verify all current terms directly with each provider."*

2. **Mid-page, after the comparative calculator:** *"Each of the four providers links out to their own calculators and onboarding. Always verify rates and terms directly — the figures here are illustrative."*

3. **End of piece:** *"Considering a BTC-backed loan? Use the calculator above to identify your best-fit provider, then go direct to their site for current terms. If you're also considering a mortgage, see the [BTC-backed mortgages deep dive](bitcoin-backed-mortgages.html)."*

## Cross-links

**From this deep dive to the mortgage deep dive:**
- In Part II (taxonomy)
- In Part VIII (hedge misconception — refers to Model A from the mortgage piece)
- In Part XII (decision framework — points to mortgage if horizon > 5 years)

**From mortgage deep dive to this one:**
- One-line addition to Part II (taxonomy)
- One-line addition at the end pointing to the loans piece for non-mortgage options

**From category index:**
- Promote to "featured" alongside the mortgage deep dive

## Brand & technical conventions

Same as mortgage deep dive:
- BSA dark canvas (#0b0e14), Bitcoin orange (#f7931a), gradient orange-to-gold
- Source Serif 4 headings, Inter body, JetBrains Mono numbers
- `chart.umd.js` local bundle (already in the directory)
- Same chrome (skip link, breadcrumb, header, footer)
- TBA disclosure banner at top

## Build plan once approved

1. Write the prose (markdown companion) first
2. Verify provider details via fresh web research on each (LMC, Ledn, Unchained, Lava) so all numbers are current
3. Build the HTML page with embedded prose
4. Build the comparative calculator (4-provider matrix + options overlay)
5. Test math via Python verification
6. Render-test in playwright
7. Add cross-links in mortgage deep dive
8. Update category index to feature both pieces
9. Memory: update bitcoin-adviser.md to reflect that LMC now has its own home + add notes on the three competitors

## Decisions locked in (from Dalia, 2026-05-11)

- ✅ Disclose TBA affiliation explicitly (top-of-page banner)
- ✅ Cover all BTC-only lending platforms (LMC is one of several)
- ✅ Exclude DeFi (Sovryn Zero) — separate deep dive eventually
- ✅ Comparative calculator with provider ranking
- ✅ Full treatment of hedge misconception + options strategy comparison

## Remaining ambiguities — none from your side, but I'll surface mine

- **Lava** is the newest entrant in the list. I have less verified info on their current product than the others — I'll do fresh research before writing.
- **Unchained's** loan product has historically been term-loan with collaborative multisig. I'll verify current LTV, rates, term structure.
- **Ledn's** product mix has shifted post-2022 (no more Bitcoin Yield, focus on collateralized loans). I'll verify current rates and Custody arrangement.

I'll resolve these via web research in the first pass of writing, before any provider gets into the live calculator.

---

*Ready to write? Approve this v2 spec and I'll start with the markdown prose, then build the HTML + comparative calculator + verify.*
