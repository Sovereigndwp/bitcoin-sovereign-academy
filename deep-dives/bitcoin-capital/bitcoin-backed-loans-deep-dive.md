# Bitcoin-Backed Loans: A First-Principles Deep Dive

*Centralized Bitcoin-only lending — the providers, the structures, and how to pick the right product for your situation. Plus options strategies as a comparative hedge. ~30 min read.*

---

> **Heads-up before you read.** BSA's founder Dalia advises at The Bitcoin Adviser (TBA), the company behind **Loan My Coins** — one of the nine BTC-backed lenders compared in this piece. We've made a deliberate choice to scrutinize LMC the same way we scrutinize every other product, including pointing out where it isn't the right fit. The math is the math regardless of who built the product.

---

## Part I. The ontology

A Bitcoin-backed loan is, structurally, a secured loan with three essential design choices baked into its DNA:

1. **The loan denominator.** What is the borrower's obligation denominated in? If it's USD, the borrower owes a fixed dollar amount and the collateral's USD value is the variable that creates margin-call dynamics. If it's BTC, the obligation is in BTC and price-based liquidation is mathematically impossible.

2. **The custody model.** Who holds the keys to the pledged Bitcoin during the loan term? This single choice determines whether the borrower is a creditor with claims (pooled lender custody) or a co-owner with cryptographic veto power (multisig with borrower-held key). 2022 made the cost of getting this wrong unambiguous.

3. **The rehypothecation policy.** Can the lender lend out the pledged collateral while the loan is outstanding? This is the structural feature that took down Celsius, BlockFi, Voyager, and Genesis in 2022 — collateral that was supposed to back loans got vaporized in counterparty cascades.

Most public coverage focuses on rates and LTV. Those matter, but they're downstream of the three structural choices. A 9% loan from a rehypothecating lender holding your BTC in a pooled wallet is a fundamentally different product from a 14% loan with no rehypothecation and 2-of-3 multisig custody. **Comparing them on rate alone is the kind of mistake the 2022 cohort's customers made.**

The remainder of this deep dive treats these three axes as primary and rates/LTV as secondary.

---

## Part II. Taxonomy — two axes, every product fits

Two independent design choices give us a 2×4 matrix that every BTC-backed lending product sits in cleanly.

**Axis 1 — Loan denominator:**
- **BTC-denominated** (you pledge BTC, receive BTC, owe BTC)
- **Fiat-denominated** (you pledge BTC, receive USD/USDC, owe USD)

**Axis 2 — Custody model (ranked from most to least sovereign):**
- **Self-custody DLC** (borrower retains sole key authority via on-chain contracts)
- **Collaborative 2-of-3 / 3-of-4 multisig** (borrower holds 1 of N keys, no single-party control)
- **Qualified custodian** (regulated third party holds the keys; borrower has no key)
- **Pooled lender custody** (lender holds collateral directly; the 2022 failure pattern)

| Custody / Denominator | BTC-Denominated | Fiat-Denominated |
|---|---|---|
| Self-custody DLC | — | **Lava** |
| Collaborative multisig | **LMC** (2-of-3) | **Unchained** (2-of-3), **Debifi** (3-of-4) |
| Qualified custodian (no rehypo) | — | **Ledn Custodied**, **Arch** |
| Qualified custodian (rehypo) | — | **Ledn Standard**, **SALT** |
| Exchange / hybrid / pooled | — | **Bitfinex** (exchange), **Coinbase/Morpho** (hybrid wrapped) |

The taxonomy makes one thing immediately obvious: **only LMC is BTC-denominated.** Every other provider issues fiat-denominated loans, which creates margin-call dynamics by design. This is the structural reason LMC has no margin calls — not generosity, mathematics.

The second observation: there is no Bitcoin-denominated, self-custody DLC option in the market today. That's a gap somebody will fill within 24 months. Watch for it.

---

## Part III. The 2026 provider landscape

Nine providers worth knowing, organized by depth of treatment.

**Tier 1 — Four distinct structural archetypes (deep coverage in Part IV):**
- **Ledn** — BTC-for-fiat, qualified custodian, regulated mainstream
- **Unchained Capital** — BTC-for-fiat, collaborative multisig, sovereignty-leaning centralized
- **Lava** — BTC-for-fiat, self-custody DLC, newest model
- **Loan My Coins (LMC)** — BTC-for-BTC, TBA collaborative multisig, 5% upfront fee — *the most specialized product, presented last*

Every other BTC-backed lender is a variant of one of these. We present them in order of mainstream familiarity to specialized use case — LMC last because it is structurally different from the other three and works in a narrower set of borrower profiles.

**Tier 2 — Matrix-only coverage:**
- **Coinbase via Morpho** — hybrid centralized custody + DeFi smart contract; $2.17B originated by April 2026
- **SALT Lending** — multi-asset; rehypothecation explicitly permitted in terms; longest track record (2016)
- **Arch Lending** — Anchorage Digital custody, no rehypothecation, $100M Lloyd's insurance
- **Bitfinex Borrow** — exchange margin lending; 2–120 day terms; 2016 hack precedent
- **Debifi** — non-custodial 3-of-4 multisig; institutional focus; Sygnum Bank partnership (MultiSYG, H1 2026)

**Out of scope and why:**
- Multi-asset crypto lenders (Nexo, Binance Loans) — dilute the Bitcoin focus
- DeFi BTC lending (Sovryn Zero, flash loans) — separate deep dive eventually
- Institutional undercollateralized credit (TrueFi, Maple, Goldfinch, Clearpool) — not retail-relevant

---

## Part IV. Provider deep-dives (Tier 1)

*Order: most mainstream → most specialized. Ledn first (the regulated reference), Unchained (collaborative multisig with US licensing), Lava (newest self-custody model), and LMC last (the most specialized product, works only in specific market conditions).*

### Ledn — BTC-for-fiat, qualified custodian

**Structurally:** the most mainstream BTC-backed lender. Qualified third-party custody (BitGo), regulated, established. Borrowers choose between two custody tiers at origination.

**Terms (verified May 2026):**
- 50% LTV (fiat-denominated)
- **Two product variants:**
  - **Custodied (13.9% APR)** — ring-fenced segregated addresses, **no rehypothecation**
  - **Standard (12.4% APR)** — same custody, **rehypothecation to institutions allowed**
- Tiered rate reductions: as low as 9.99% APR at $1M+ loans
- $1,000 USD-equivalent BTC minimum
- 24-hour typical funding time
- No credit check, no required monthly payments — interest accrues
- Cost at $250K / 24 months: **$69,500 (Custodied)** or **$62,000 (Standard)**

**The Custodied vs. Standard choice is the most important decision a Ledn borrower makes.** The 1.5% APR delta is **the price of sovereignty at Ledn.** Most borrowers default into Standard without knowing what they're trading.

**Break-even math:** The Custodied premium (≈3% of loan over 2 years) pays off if you believe the rehypothecation counterparty failure probability over 2 years exceeds 6%. Given 2022's cohort failures, that's not a stretch — it's a base rate.

**Best fit when:**
- Need USD or USDC liquidity (not BTC)
- Want regulated, mainstream BTC lender with track record
- Loan size $1M+ for best rate tier
- Comfortable with margin-call mechanics

**Wrong fit when:**
- Sovereignty-first priority (use multisig instead — LMC, Unchained, Lava, Debifi)
- Want zero margin-call exposure (use LMC instead)
- Uncomfortable with rehypothecation but unwilling to pay the Custodied premium

**Custody:** BitGo holds keys (qualified custodian, $250M insurance, audited cold storage). Borrower has no key. Proof-of-funds via periodic third-party-audited attestation, not real-time on-chain. **Single point of failure: BitGo + Ledn's funding partner.** Mitigated by ring-fenced addresses (Custodied) or insurance (always).

### Unchained Capital — BTC-for-fiat, collaborative multisig

**Structurally:** the sovereignty-leaning alternative to Ledn. Same fiat disbursement, same fiat-denominated margin-call dynamics, but custody is 2-of-3 multisig with the borrower holding 1 key.

**Terms (verified May 2026):**
- ~50% LTV (fiat-denominated)
- Tiered APR: **11.49% under $250K, 10.99% $250K–$1M, 10.49% $1M–$2M, 9.99% above $2M**
- $150,000 USD minimum (the highest entry threshold in the Tier 1 set)
- Interest-only monthly payments
- US-only jurisdiction
- No credit checks, no prepayment penalties
- Cost at $250K / 24 months: **$54,950** at 11.49% APR (monthly interest-only)

**Best fit when:**
- Need USD with sovereignty-leaning custody
- Loan size $150K+ (the minimum is binding)
- Already familiar with Unchained's collaborative-custody architecture (existing vault customers)
- Want 2-of-3 multisig with personal key authority but in a regulated US lender

**Wrong fit when:**
- Loan under $150K (the minimum is binding)
- Want fully passive (interest-only monthly payments still required)
- International borrower (US-only)

**Custody:** 2-of-3 multisig — borrower + Unchained + independent key agent. Structurally identical to LMC. Unchained pioneered this architecture for retail Bitcoin custody in 2017–18 and adapted it for the loan product. Battle-tested across nearly a decade of Bitcoin operations.

### Lava — BTC-for-fiat, self-custody via DLC

**Structurally:** the newest and most sovereignty-extreme model. Uses **Discreet Log Contracts (DLCs)** — Bitcoin-native smart contract constructs that let the borrower retain full key authority over the collateral. Lava never holds the keys.

**Terms (verified May 2026):**
- 60% LTV (fiat-denominated) — *third-party-sourced; verification email pending with Lava*
- **Step-up APR**: 5% in month 1 climbing to 11.5% by month 12 (linear ramp)
- Average year-1 APR: **8.2%**
- $100 USD minimum (lowest in category), $1B+ ceiling
- Open-ended terms; rate stays at 11.5% after year 1
- ~400ms processing time (fastest in category)
- Visa card with up to 5% BTC cashback
- $17.5M raised funding round

**Cost at $250K / 24 months:** **~$49,375** (year 1 at 8.2% average + year 2 at 11.5%).

**Best fit when:**
- Want full self-custody of BTC even during the loan term
- Plan to repay quickly to lock in low early-month rates (1–3 months optimal)
- Comfortable with DLC technology and newer protocol
- Need fast processing or small loan amounts ($100+ floor)

**Wrong fit when:**
- Want long-term low-rate borrowing (rate climbs to 11.5% by month 12)
- Want established multi-year operational track record
- Uncomfortable with DLC edge cases (oracle attacks, contract bugs)

**Custody:** Self-custody DLC. Lava never has keys. Strongest proof-of-funds in the market — fully on-chain, fully transparent. **The trade-off: if the borrower loses their key, BTC is permanently lost.** No recovery mechanism. This is the structural cost of maximum sovereignty.

### Loan My Coins (LMC) — BTC-for-BTC, collaborative multisig (the specialized option)

> **Read this section carefully — LMC is structurally different from the other three Tier 1 products.** It is the only BTC-denominated loan, which removes margin-call risk by mathematics, but introduces a different risk that the other products don't have: **the 5% per-period fee is paid in BTC and compounds against BTC's appreciation.** Over multi-year horizons or in steady bull markets, the cost can substantially exceed any of the fiat-denominated alternatives. LMC works in a specific set of market conditions, not as a default choice.

**Structurally:** the only BTC-denominated product in the market. You pledge BTC, receive 95% of pledged amount back in BTC, sell that BTC for cash (or hold it), and at term end deliver the original BTC amount to LMC. Original collateral is released back to you.

**Terms (verified May 2026):**
- 95% LTV in BTC terms
- **5% fixed upfront fee** deducted from disbursement — no variable interest, no compounding *within a period*, but **compounds across rollover periods**
- 12-month base term, **rollable up to 5 years total** (each roll incurs another 5% fee)
- 1 BTC minimum
- Custody: The Bitcoin Adviser's 2-of-3 collaborative multisig (borrower + TBA + independent key agent)
- No margin calls — by structure, not policy
- No rehypothecation

**Cost in BTC terms over multiple rolls:**

| Holding period | Cumulative BTC-denominated fee |
|---|---|
| 12 months | 5% of pledged BTC |
| 24 months (1 roll) | 10% of pledged BTC |
| 36 months (2 rolls) | 15% of pledged BTC |
| 48 months (3 rolls) | 20% of pledged BTC |
| 60 months (max, 4 rolls) | 25% of pledged BTC |

**This is the critical risk frame for LMC:** if BTC appreciates 50% over 5 years (a modest assumption by historical standards), holding 5 BTC outright outperforms the LMC structure unless the borrower's strategy delivers more than 50% in BTC-equivalent returns net of the 25% cumulative fee. In a steady bull market, **simply holding wins.**

**When LMC works structurally:**

LMC's economic case rests entirely on the borrower's ability to outperform BTC by enough to cover the cumulative 5%-per-period fee. There are roughly three conditions under which this works:

1. **Significant BTC drawdowns within the term.** The "outperform BTC" strategy buys back BTC at a lower price than origination. If BTC drops 30%+ at any point during the loan and the borrower deploys cash at the dip, the gain can offset the 5% fee with margin to spare. Historically, BTC has had at least one 30%+ drawdown in roughly 60–70% of any 12-month rolling window — but this is a backward-looking statistic, not a forward guarantee.

2. **Sustained sideways markets.** If BTC trades sideways for the loan term and the borrower deploys cash into yield-bearing assets (T-bills, short-duration treasuries), the 4–5% yield offsets most or all of the 5% fee. Net cost: roughly zero. The borrower keeps BTC exposure for free.

3. **Strategic alternative investments** that outperform BTC + 5%. If the borrower has a non-BTC investment opportunity expected to return more than BTC's appreciation plus the LMC fee (say, BTC compounds 15% and the alternative returns 25%+), then taking the LMC loan to fund the alternative makes sense. **This requires high-conviction alpha that most retail borrowers don't have.**

**When LMC fails structurally:**

- **Steady BTC bull market without meaningful drawdowns.** The borrower pays 5% in BTC per period and gets no buyback gain. Over 5 years, that's 25% of the pledged BTC lost to fees. Holding outright would have outperformed.
- **BTC moons during the loan term and the borrower can't repay.** If BTC doubles and the borrower can't source the additional capital to buy back the original BTC quantity at term end, the pledged collateral is forfeited. **Forfeiture is a taxable event** — the borrower owes LTCG on the FMV-vs-cost-basis gain. Double loss.
- **High cost basis.** If the borrower's BTC was acquired at near-current prices, the tax deferral benefit (one of LMC's selling points) is small. The 5% fee dominates.

**The "outperform BTC" strategy — verified math.** Pledge 10 BTC at $100K. Receive 9.5 BTC, sell for $950K cash. T-bill yield over 12 months: ~$42K. Cash at term: ~$992K.

Three BTC paths at term end:
- **BTC drops to $50K:** Buy 10 BTC for $500K. Cash remaining $492K. End with 10 BTC + $492K cash = **effective +9.84 BTC vs. just holding (10 BTC × $50K = $500K)**. Strategy wins big.
- **BTC flat at $100K:** Buy 10 BTC for $1M. Shortfall $8K. End with 10 BTC + (-$8K) = $992K. Hold = $1M. Strategy loses $8K.
- **BTC moons to $200K:** Buy 10 BTC for $2M. Shortfall $1.008M. Borrower either forfeits collateral (worth $2M) or sources $1.008M externally. Strategy catastrophically loses **at least $1M.**

The asymmetry is real. **LMC is a directional bet on BTC drawdown timing, not a hedge.**

**Best fit when:**
- BTC holder is confident a meaningful drawdown will occur within the loan term
- Borrower has discipline to deploy cash at the dip (most people panic-sell in drawdowns instead of buying)
- Long-term BTC conviction is so strong that current BTC is "too expensive" relative to recent dips
- Cost basis is low enough that LTCG deferral has material value
- Sovereignty preference matches collaborative multisig custody

**Wrong fit when:**
- Sustained BTC bull market expected (the 5% fee burns through any holding-only return)
- 30-year horizon (compounding 5% rolls become prohibitive — would cost 9× the pledged stack over 30 years)
- Wants margin-call protection through hedge (LMC isn't a hedge — see Part VIII)
- Needs fiat (must sell the received BTC, introducing friction and timing risk)
- New to Bitcoin or risk-averse (the strategy requires sophisticated conviction)

**Positioning — "Terminal Bitcoin."** TBA explicitly positions LMC for the Terminal Bitcoiner — a holder who has maxed out accumulation through traditional savings, salary, and direct purchase. The framing is honest about the niche: this is not for new Bitcoiners building a position. It is for sophisticated holders past the accumulation phase who want a specific structural product matched to a specific market view (bear or sideways within the term).

**Custody:** 2-of-3 multisig. Borrower holds 1 key. TBA holds 1. Independent key agent holds 1. No single party can move funds. Borrower verifies collateral on-chain in real time — no audit-cycle dependency. TBA's collaborative custody has run since 2016 with no reported losses.

---

## Part V. Why denominator drives margin call structure (first principles)

The single most important structural fact about BTC-backed lending: **whether you have margin-call risk depends entirely on what your loan is denominated in.**

Consider a borrower pledging 5 BTC at $100K (collateral value $500K) to back a $250K loan.

**Fiat-denominated structure (Ledn, Unchained, Lava, Arch, SALT, etc.):**
- Borrower owes $250K (fixed in USD)
- Collateral value = 5 × P(t), where P(t) is BTC price in USD
- LTV(t) = $250K / (5 × P(t))
- LTV moves with BTC price. When P drops, LTV rises.
- At some threshold (e.g., LTV = 0.80 at Ledn), margin call triggers.
- The denominator is the variable. Price moves break the LTV ratio.

**BTC-denominated structure (LMC):**
- Borrower owes 2.63 BTC (fixed in BTC) — note: actual amount varies by loan size
- Collateral is 2.63 BTC (fixed)
- LTV in BTC terms: 2.63 / 2.63 = 1.0 (constant)
- LTV in USD terms: still 1.0 because numerator and denominator move together
- No price-based liquidation surface. No margin call. By mathematics, not policy.

This is why LMC's "no margin call" feature isn't generous lender policy — it's the natural consequence of denominating the loan in the same unit as the collateral.

**The corollary:** any fiat-denominated loan has margin-call risk regardless of how the lender markets the product. "We have no margin calls" claims for fiat-denominated loans should be read with skepticism — the lender is either using a different definition (e.g., "we won't liquidate without notice") or has hidden the risk somewhere else (e.g., rate adjustments that price the risk into the cost rather than triggering a liquidation event).

The Peoples Reserve mortgage Model B (covered in the [Mortgages deep dive](bitcoin-backed-mortgages.html#models)) uses this trick: rate adjusts as BTC drops, no liquidation triggered, but the borrower pays for the risk through variable monthly payments. The risk is in the cash flow rather than the asset, but it's still there.

---

## Part VI. Custody architectures, decoded

The 2022 BTC lender failures — Celsius, Voyager, BlockFi, Genesis — were not credit failures. They were **custody failures.** Each held customer collateral in pooled wallets, rehypothecated it for yield, and got crushed when counterparty cascades hit. Customers became unsecured creditors in bankruptcy proceedings that are still unwinding four years later.

Every Tier 1 provider in this deep dive has moved past that model. But the *direction* they moved matters for sovereignty-aware borrowers.

### The five custody models, ranked

| Rank | Model | Provider(s) | Borrower holds keys? | Proof of funds | Catastrophic SPOF |
|---|---|---|---|---|---|
| 1 | Self-custody DLC | **Lava** | Yes (sole) | Real-time on-chain | Borrower's own key loss |
| 2 | Collaborative 2-of-3 multisig | **LMC, Unchained** | Yes (1 of 3) | Real-time on-chain | None for movement |
| 2 | Non-custodial 3-of-4 multisig | **Debifi** | Yes (1 of 4) | Real-time on-chain | None for movement |
| 3 | Qualified custodian (ring-fenced) | **Ledn Custodied, Arch** | No | Periodic attestation | Custodian failure |
| 4 | Qualified custodian + rehypothecation | **Ledn Standard, SALT** | No | Periodic attestation | Custodian + 3rd-party institutions |
| 5 | Exchange / hybrid wrapped | **Bitfinex, Coinbase/Morpho** | No | Exchange / smart contract | Exchange / wrapper layer |
| 6 | Pooled lender custody (eliminated) | 2022 cohort | No | None / opaque | Lender failure (catastrophic) |

### What TBA's collaborative multisig actually delivers

What makes TBA's architecture (powering LMC) structurally strong:

1. **Borrower-held key is real custody, not nominal.** The borrower doesn't just "see" the BTC — they hold an actual cryptographic signing key. They can refuse to co-sign any movement. This is not theoretical authority; it's mathematical authority.

2. **Recovery without lender cooperation.** If TBA disappeared entirely tomorrow, the borrower and the independent key agent can recover the BTC using their two keys. **Independent counterparties = independent recovery paths.**

3. **Continuous on-chain proof of funds.** Not "we audit quarterly" — verifiable second-by-second on the public blockchain via any block explorer. The borrower's trust requirement collapses to "do I trust math?" rather than "do I trust LMC's audit cycle?"

4. **Operationally proven since 2016.** TBA has run this architecture for ~10 years with no reported losses. Multisig has been battle-tested across the Bitcoin space (Casa, Unchained, Onramp, Debifi) for nearly a decade.

The same architecture applies to Unchained (also 2-of-3) and to Debifi (3-of-4, where any single party including the borrower can fail without blocking the others).

### The Lava trade-off worth being honest about

DLC self-custody is *more* sovereign than multisig — Lava literally never holds keys to your BTC. The borrower retains sole authority through Bitcoin's native scripting.

But: if the borrower loses their key, **BTC is permanently lost.** No key agent. No recovery path. Multisig's 2-of-3 (LMC, Unchained) and 3-of-4 (Debifi) trade some sovereignty for recovery — if you lose your key, the other parties can co-sign to restore your access (with appropriate verification). For most borrowers, that's the right trade.

### The Ledn Custodied vs. Standard decision

For borrowers using qualified-custodian providers, the most important sovereignty decision is whether to opt into rehypothecation.

- **Ledn Custodied (13.9% APR):** Ring-fenced segregated addresses, no rehypothecation. Your specific BTC sits in a specific Bitcoin address attributable to your loan.
- **Ledn Standard (12.4% APR):** Same custodian, but Ledn can lend your BTC out to institutions while you're repaying. Your collateral may be tied up in another counterparty's loan.

The 1.5% APR delta is the price of saying "I'm not okay with my BTC being rehypothecated." Over 2 years on $250K, that's $7,500. Compared to the historical base rate of crypto-lender counterparty failures, paying $7,500 to avoid the rehypothecation chain is rational unless your time preference for cash is extreme.

**SALT Lending is the only major BTC-backed lender where rehypothecation is the default and not toggleable** — their loan agreement explicitly permits SALT to "repledge, sell or otherwise transfer or use Stored Coins." Borrowers should understand this is structurally similar to the 2022 cohort's risk profile (though SALT survived 2022).

### The 2022 lesson, restated

A lender's solvency is your risk surface, not just the price of Bitcoin. The custody architecture is what stands between you and the lender's bankruptcy estate. Multisig with a borrower-held key changes the math entirely — your BTC is never legally part of the lender's balance sheet, so it cannot be clawed into the estate.

---

## Part VII. Comparative calculator

*(In the published deep dive, this section embeds the interactive comparative calculator. Inputs: BTC quantity, current BTC price, cost basis, loan need, horizon, risk tolerance, BTC price scenario. Outputs: ranked provider recommendation with full cost breakdown across all 9 providers; toggle for options-hedge overlay. The math behind this calculator is locked in `loans-math-output.json`.)*

**Headline cost comparison at $250K loan / 24 months:**

| Provider | BTC Pledged | Direct Cost | Margin Call Risk | Custody |
|---|---|---|---|---|
| **LMC** | 2.63 BTC | $26,316 (BTC-denominated fee) | None | 2-of-3 multisig |
| **Coinbase / Morpho** | 3.33 BTC | ~$40,000 (variable) | Yes (86% LTV) | Wrapped + smart contract |
| **Lava** | 4.17 BTC | ~$49,375 (step-up) | Yes (80% LTV) | Self-custody DLC |
| **Bitfinex** | 2.78 BTC | ~$50,000 (10% mid) | Yes (95%) | Exchange |
| **Unchained** | 5.00 BTC | $54,950 (11.49%) | Yes (70% LTV) | 2-of-3 multisig |
| **SALT** | 5.00 BTC | $59,750 (mid-tier) | Yes | Qualified custodian + rehypo |
| **Ledn Standard** | 5.00 BTC | $62,000 (12.4%) | Yes | Qualified custodian + rehypo |
| **Arch** | 4.17 BTC | $66,250 (12.5% + origination) | Yes (80% LTV) | Anchorage (no rehypo) |
| **Ledn Custodied** | 5.00 BTC | $69,500 (13.9%) | Yes | Qualified custodian (no rehypo) |
| **Debifi** | N/A | N/A | — | 3-of-4 multisig (institutional only) |

LMC has the lowest direct cost. But direct cost alone is the wrong frame. The decision involves cost, margin-call risk, custody quality, term structure, and what you're using the funds for. The calculator handles all of these dimensions.

---

## Part VIII. The hedge misconception, fully decoded

A common framing in BTC capital-structure discussions: *"Use a BTC-backed loan to hedge against a BTC-backed mortgage's margin-call risk."* The argument typically goes: take an LMC loan, sell the received BTC for cash, hold the cash as a margin-call buffer for your Milo mortgage, deploy the cash to buy more BTC if BTC drops.

**This is not a hedge in any structural sense.** Let me walk through the three variations of the structure and why each fails, then show what an actual hedge looks like.

### Structure 1 — Direct use at the moment of margin call

You're already in margin call on your Milo Model A mortgage. Can you use LMC to borrow BTC to top up your collateral?

**No.** To borrow BTC from LMC, you need BTC to pledge. If you had spare BTC available to pledge to LMC, you would just send it directly to Milo and skip the 5% fee. LMC adds friction without adding capacity.

### Structure 2 — Pre-positioned forward short with T-bill buffer

This is the structurally interesting variation. At origination, pledge BTC to LMC, receive the disbursement BTC, sell it for cash, hold the cash in T-bills. If BTC drops later, deploy the cash to satisfy Milo's margin call.

**Verified scenario math** (drop, flat, moon — from `loans-math-output.json`):

| Scenario | BTC Path | Net BTC delta | Net $ delta | Winner |
|---|---|---|---|---|
| **V-shaped drop** | $100K → $35K → $100K | +4.52 BTC | +$287,101 | Hedge wins |
| **Flat** | $100K → $100K → $100K | 0.00 BTC | -$3,385 | Roughly neutral |
| **Moon** | $100K → $200K → $200K | 0.00 BTC | -$503,385 | Hedge loses big |

**The hedge works in the drop scenario.** The cash buffer ($475K from selling 4.75 BTC at $100K, growing to ~$485K via T-bills) can be deployed at the dip — buying more BTC at $35K than the same dollars would have bought at $100K. Combined with the LMC collateral returning at term end, the borrower ends up with **4.52 more BTC** than the no-hedge counterfactual.

**But the moon scenario is catastrophic.** If BTC rises to $200K, the borrower owes 5 BTC = $1M to LMC at term end. The cash buffer is $485K. **Shortfall: $515K.** Either forfeit the pledged collateral (5 BTC, now worth $1M) or source $515K externally. Forfeiture also triggers an LTCG event at FMV, so the tax bill is real.

The structure is **a directional bet on BTC volatility, not a hedge.** It pays off if BTC drops within the term; it loses big if BTC rises. A real hedge has defined max loss and asymmetric payoff. This structure has unlimited downside in the rally case.

### Structure 3 — LMC replaces the mortgage entirely

Instead of a Milo mortgage, take an LMC loan, sell the BTC for cash, buy a house in cash. No mortgage. No margin call surface.

**This works for short horizons.** A 12-month LMC structure replacing a 12-month bridge loan is clean. The 5% fee is the price.

**It fails for long horizons.** A 30-year mortgage replaced by LMC requires 30 annual rolls. Each roll costs 5% in BTC terms, compounding. (1.05)^30 = **4.32× decay of the pledged stack** over 30 years. A $1M starting position pays ~$3.3M in BTC-denominated fees over 30 years.

**Verdict:** LMC for 1–5 year liquidity. Mortgage for housing finance horizons.

### What actually hedges Model A mortgage liquidation risk

The structurally correct hedges for "BTC drops below margin threshold and I get force-liquidated":

1. **Long BTC put option at the margin threshold strike.** Defined premium, defined max loss, pays off precisely when BTC drops, **keeps all upside intact.** Cost: ~1.7–5% of notional for 12-month tenors (see Part IX).
2. **Cash reserve at origination** equal to the margin-call requirement. Simplest possible structure, zero counterparty, but capital is idle.
3. **Front-loaded principal paydown** in years 1–5 of the mortgage. Mechanically reduces L(t), so the LTV needed to trigger margin call requires a deeper drawdown. Free.
4. **Switch to Model B (Peoples Reserve)** at origination. Eliminates price-based margin-call risk entirely by trading it for variable rate risk.
5. **Reserve BTC stack outside the mortgage** held in cold storage or your own multisig. Available to send to Milo as additional collateral if needed.

**Not on the list:** any BTC-backed loan. They are not hedges; they are liquidity primitives.

---

## Part IX. Options strategies — the actual hedges

For a Bitcoin holder worried about margin-call risk or forced liquidation, the structurally correct hedge is a long put option (or a put-based spread/collar). Options give defined cost, asymmetric payoff, and upside preservation. None of those properties exist in a loan.

**Five-strategy cost comparison** (5 BTC notional at $100K, 12 months, 80% IV, risk-free 4.5%):

| Strategy | Strike(s) | Total Cost | % of Notional | Max Loss | Keeps Upside? |
|---|---|---|---|---|---|
| **Long put 35% OTM** | $35K | **$8,594** | **1.7%** | $8,594 | Yes |
| **Long put 50% OTM** | $50K | $25,357 | 5.1% | $25,357 | Yes |
| **Put spread 50/25** | $50K long, $25K short | $22,658 | 4.5% | $22,658 | Yes |
| **Collar (50/50)** | $50K put, $150K call | -$72,950 (premium received) | -14.6% | Spread between strikes | **No** (capped) |
| **LMC forward-short** | — (structural equivalent) | $25,000 | 5.0% | Forfeiture of pledged BTC | **No** (capped at zero upside) |

### Why the 35% OTM put is the headline finding

A long put at strike $35K — exactly the price level that triggers a Milo Model A margin call — costs only **1.7% of notional** for 12 months. For a $500K BTC position, that's $8,594. **One hundredth of the margin-call risk for less than two percent of the position.**

The structural logic: BTC's implied volatility skew means deep-OTM puts are surprisingly affordable. The market doesn't fully price 65%+ drawdowns because they're rare in any given 12-month window — but they happen often enough across multi-year horizons to be the central risk for a 30-year mortgage borrower.

### Why put spreads cap protection but cost less

Buying a 50% OTM put while selling a 25% OTM put creates a put spread. You're protected against drops between 50% and 75% but unprotected below 75%. Cost drops because the sold put offsets some of the bought put's premium. Good for moderate-drawdown protection; insufficient for catastrophic-drawdown protection.

### Why collars can generate premium

A collar combines a long put (downside protection) with a short call (upside cap). For BTC at high implied volatility, the call premium often exceeds the put premium for symmetric OTM strikes — meaning the collar actually generates net premium. The cost: your upside is capped at the call strike.

For a holder who is willing to accept "BTC goes from $100K to $150K is enough for me" in exchange for downside protection plus premium income, the collar is structurally compelling. But this trades away the asymmetric upside that motivates holding BTC in the first place — most long-term hodlers won't take this trade.

### The verdict on hedging Model A risk

A long put at 35% OTM is the surgical hedge. It costs 1.7% of notional, pays off exactly when the margin call would trigger, and preserves all BTC upside. **Anything else — including loan-based "hedges" — trades structure for marketing.**

---

## Part X. Tax considerations

Three things every BTC-backed-loan borrower should understand about US tax treatment.

**1. Pledging crypto as collateral is generally not a taxable event.** IRS guidance treats it similarly to pledging stock for a loan. You retain beneficial ownership; no realized gain. This is the foundation of the entire BTC-backed-loan category — without it, loans against BTC would be economically equivalent to selling and rebuying.

**2. Forfeiture is a taxable event.** If you fail to repay a BTC-backed loan and the lender liquidates your pledged BTC, that's treated as a disposition at FMV at the moment of forfeiture. You owe LTCG on the gain — at a time when your BTC has likely dropped (which is why you got force-liquidated). **The tax bill arrives in a year of impaired liquidity.** Plan for this.

**3. Buying BTC to repay an LMC loan does not trigger gains.** If you used LMC's BTC disbursement for cash purposes and need to buy back BTC at term end, the new BTC has its new cost basis. Acquiring and immediately transferring to LMC doesn't constitute a disposition on your side.

**State variations matter.** Florida, Texas, Wyoming, Tennessee — no state LTCG. California adds ~13%. New York is similarly hostile. Your state of residence at origination and at any forced liquidation event both matter.

This section is not tax advice. Run your specific situation with a CPA who has worked with Bitcoin holders.

---

## Part XI. Risk decomposition

Risk on a BTC-backed loan is not one-dimensional. Decomposing it makes evaluation tractable.

```
Total risk to BTC-backed-loan borrower
│
├── Market risk (BTC price)
│   ├── Magnitude of drawdown (margin-call trigger)
│   ├── Timing within loan term
│   └── Recovery speed
│
├── Counterparty risk
│   ├── Lender solvency
│   ├── Custodian solvency (qualified-custodian models)
│   └── Rehypothecation cascade (Standard custody models, SALT)
│
├── Custody risk
│   ├── Key compromise (self-custody DLC, multisig partial)
│   ├── Operational failure (lost device, forgotten passphrase)
│   └── Jurisdictional seizure
│
├── Tax cliff risk
│   ├── Forced liquidation triggers LTCG at FMV
│   ├── At inopportune time (BTC at low)
│   └── In a year of impaired liquidity
│
├── Cash flow risk
│   ├── Interest payments due (Unchained interest-only monthly)
│   ├── Rollover fees (LMC, every 12 months)
│   └── Term-end repayment lumps (LMC, SALT)
│
├── Protocol risk (smart contract / DLC models)
│   ├── Smart contract bugs (Coinbase/Morpho, Lava)
│   ├── Oracle compromise (Lava)
│   └── Layer 2 reliability (Coinbase/Morpho on Base)
│
└── Regulatory risk
    ├── BTC-backed lending classification (still evolving)
    ├── State-level licensing changes
    └── Cross-border tax treatment
```

The relevant question is not "is there risk?" but "which provider's risk profile matches my actual risk tolerance?" A sovereignty-first borrower fears counterparty + custody risk more than rate. A cost-minimizer fears interest cost more than custody. A protocol-skeptic avoids DLC and wrapped-BTC models. No single product wins on all dimensions.

---

## Part XII. Decision framework

A plain-language flowchart for picking the right BTC-backed loan, derived from the analysis above.

```
You have Bitcoin. You need liquidity. You don't want to sell. Start here.

│
├─ DO YOU NEED FIAT OR BITCOIN AS THE DISBURSEMENT?
│  ├─ Fiat → Continue below
│  └─ BTC → LMC (only BTC-denominated option)
│
├─ HOW LONG IS YOUR HORIZON?
│  ├─ Days to weeks → Bitfinex (short P2P margin lending)
│  ├─ 1–12 months → Lava (step-up rate optimal for short holds)
│  ├─ 1–2 years → Ledn, Unchained, Arch (term loans, ongoing interest)
│  ├─ 2–5 years → LMC (rollable to 5 years total), Debifi (5-yr term)
│  └─ 5+ years → Reconsider whether a loan is right; mortgage may fit
│
├─ WHAT'S YOUR CUSTODY PRIORITY?
│  ├─ Self-custody (you keep all keys) → Lava
│  ├─ Collaborative multisig (you hold 1 key) → LMC, Unchained, Debifi
│  ├─ Qualified custodian, no rehypothecation → Ledn Custodied, Arch
│  ├─ Qualified custodian, rehypothecation OK → Ledn Standard, SALT
│  └─ Exchange-based → Bitfinex (note: 2016 hack precedent)
│
├─ WHAT'S YOUR LOAN SIZE?
│  ├─ < $1K → Lava, Bitfinex
│  ├─ $1K–$150K → Ledn, Lava, Arch, SALT, Coinbase/Morpho
│  ├─ $150K–$500K → All Tier 1 + Unchained, Arch, SALT
│  ├─ $500K–$5M → All providers; rate tiers favor Unchained at $1M+ and Ledn at $1M+
│  └─ $5M+ → Coinbase/Morpho ($5M ceiling), Unchained, Debifi (institutional)
│
└─ WORRIED ABOUT MARGIN CALL?
   ├─ Want zero margin-call risk → LMC (BTC-denominated, no margin call by structure)
   ├─ Willing to manage margin → Any fiat-denominated provider + monitoring
   └─ Want hedge protection → Long put at margin threshold (NOT another loan, see Part VIII)
```

**The shortcut:** match the product to the most important constraint for your situation. **Ledn Custodied** for regulated mainstream with no rehypothecation — the safe default. **Unchained** for collaborative multisig with fiat liquidity. **Lava** for fast/small/self-custody where you want to retain full key authority. **LMC** as a specialized choice when you have a high-conviction view that BTC will drop within the loan term — recognize this is a directional bet, not a default product. Each Tier 2 provider fills a niche the Tier 1s don't.

---

## Part XIII. Non-collateralized crypto loans — a brief note

For completeness: not every "crypto loan" is collateralized.

**Flash loans (DeFi)** are zero-collateral loans where the borrowed amount must be repaid in the same transaction block. They exist for arbitrage and atomic-transaction strategies. Not relevant for individual hodlers seeking liquidity.

**Undercollateralized institutional credit** (TrueFi, Maple Finance, Clearpool, Goldfinch) extends credit to professional borrowers based on identity verification and credit underwriting. These are not retail products and require institutional KYC.

**The honest framing:** if you're an individual Bitcoiner reading this deep dive, you have overcollateralized loans (everything covered in Parts I–XII). Non-collateralized lending is institutional infrastructure, not consumer infrastructure. If a product promises "Bitcoin loan, no collateral" to a retail borrower, treat it with skepticism — likely either a hidden fee structure or a scam.

---

## Part XIV. Open questions and what to watch

Five things worth tracking as the category matures.

**1. Regulatory clarity on BTC-backed lending.** US state-level licensing varies wildly. Federal classification of BTC-backed loans (commercial loans vs. securities transactions vs. money transmission) is still evolving. Watch for SEC, CFTC, or state regulator guidance that materially changes operational requirements for providers.

**2. The DLC adoption curve.** Lava's bet is that DLC-based self-custody becomes the dominant model over the next 5 years. If it works, expect at least three more lenders to launch competing DLC products by 2028. If it fails (oracle compromise, smart contract bug, regulatory pushback), the multisig model wins by default.

**3. Conforming-market integration.** Better/Coinbase's mortgage product showed Fannie/Freddie acceptance is possible. If conforming mortgage standards extend to BTC-collateralized non-mortgage loans, rates on Ledn, Unchained, and Arch will compress meaningfully — possibly to single digits.

**4. The next stress test.** The 2022 cohort failures cleaned out the worst actors. The next deep bear market will reveal whether the post-2022 custody architectures (multisig, qualified custodian + no rehypothecation, DLC) actually hold under conditions worse than 2022. This is the single most informative event for the category that has not yet happened.

**5. Cross-border lending denomination.** Can a US borrower take a loan from a Swiss provider denominated in BTC? Sygnum + Debifi's MultiSYG product is the leading edge. If the regulatory questions get answered, expect international BTC-backed lending to scale dramatically — and put rate pressure on US-only providers.

---

## Bottom line

A BTC-backed loan is, structurally, a choice across three axes: **denominator** (BTC vs. fiat), **custody** (self / multisig / qualified custodian / pooled), and **rehypothecation** (yes / no). Those three choices matter more than rate or LTV for the long-term cost of being wrong.

**The default-fit decision tree:**

- For a regulated mainstream borrower wanting USD with no margin-call panic → **Ledn Custodied**
- For a sovereignty-first borrower wanting USD with personal key authority → **Unchained**
- For the maximalist who wants to never let go of their keys → **Lava**
- For an institutional borrower wanting the most redundant custody → **Debifi**

**The specialized cases:**

- For a sophisticated Terminal Bitcoiner with a high-conviction view that BTC will drop within the loan term → **LMC**. Recognize this is a directional bet: it works in bear or sideways markets, fails in steady bulls, and forfeits collateral in moon scenarios. The 5% per-period fee compounds against BTC's appreciation — over 5 years that's 25% of the pledged stack, which BTC must underperform for the strategy to make sense.

The wrong move is to optimize for rate alone. The 2022 cohort customers did that. They got 8% APR. They lost their BTC.

The right move is to match the product to your situation across all three structural axes, verify the lender's actual custody architecture (not their marketing claims), and treat margin-call protection — if you need it — as the job of options, not another loan.

---

*Educational only. Not legal, tax, or financial advice. Specific decisions require a CPA, attorney, or financial professional with Bitcoin experience.*

*Provider data verified May 2026. All figures dated and sourced in `data/providers.json` and `data/verification-log.json`. Math reproducible from `_drafts/loans-math-worksheet.py` → `data/loans-math-output.json`. Last full review: May 11, 2026.*

*Sources include Loan My Coins, Ledn, Unchained Capital, Lava, Arch Lending, SALT Lending, Coinbase via Morpho, Bitfinex Borrow, Debifi, plus The Bitcoin Adviser (TBA) for the LMC product underwriting context. The 2022 lender cohort failures (Celsius, Voyager, BlockFi, Genesis) are public-record Chapter 11 cases referenced for structural lessons.*
