# Demo truthfulness audit — Economics batch (2026-04-24)

Reference: `/Users/dalia/projects/bitcoin-sovereign-academy/SOURCES.md`
Baseline reality (April 2026): block height ~887,000, 4th halving complete (Apr 2024), block subsidy 3.125 BTC, circulating supply ~19.87M, next halving expected ~April 2028, network hashrate ~850–950 EH/s, US national debt ~$36.5T.

## Summary
- Demos audited: 16
- 🔴 Wrong: 18 findings across 9 demos
- 🟡 Misleading: 17 findings across 10 demos
- 🟢 Could be sharper: 11 findings across 8 demos

## Findings

### 30-day-money-plan
**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/30-day-money-plan/index.html`
**One-line pitch:** Personal budgeting walkthrough that produces a 30-day action plan with optional Bitcoin-savings rule.

No factual Bitcoin/economics issues found. The page is largely personal-finance scaffolding with one neutral `"bitcoin savings"` option in a windfall-goal dropdown (L1739). No quantitative claims about BTC, supply, or history.

---

### bitcoin-dca-time-machine
**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/bitcoin-dca-time-machine/index.html`
**One-line pitch:** Shows what a weekly DCA strategy would be worth today using historical weekly close prices.

🔴 **Wrong**
- L443–454: Start-year dropdown stops at 2024. In April 2026 this demo silently skips 15+ months of real price history. Add `2025` and `2026` entries and populate the `historicalPrices` object (L547–559) through the most recent complete week.
- L562: `let currentPrice = 97000;` fallback — reasonable for Jan 2025, stale for April 2026. Either rely exclusively on the CoinGecko fetch (already present at L567) or bump the fallback to a neutral $100K so the "before fetch" render is less anchoring.
- L451: "2021 - ATH Year ($29k–$69k)" — correct for 2021, but label should clarify it was the prior ATH (current ATH is ~$126K per the Price Timeline demo).

🟡 **Misleading**
- L454: "2024 - ETF Era ($39k–$100k+)" — factually ok, but there's no 2025 context, giving the impression that the ETF era peaked near $100K when it actually ran to $126K+ in Oct 2025.

---

### bitcoin-ira-decision-tool
**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/bitcoin-ira-decision-tool.html`
**One-line pitch:** Guided questionnaire that recommends whether a Bitcoin IRA fits and which account type.

🔴 **Wrong**
- L879: "For 2025, these limits begin at $161,000 for single filers or $240,000 for married couples filing jointly." The actual 2025 Roth IRA MAGI phase-out *begins* at $150,000 single / $236,000 MFJ (full phase-out at $165,000 / $246,000). $161,000/$240,000 were never the correct start-of-phase-out. For 2026 (IRS, Nov 2025) it's $153,000 / $242,000. Replace with the current year's correct start-of-phase-out and link to IRS Pub 590-A.

🟢 **Could be sharper**
- L1280, L1938: "Traditional IRA RMDs start at age 73" — correct under SECURE 2.0 for those born 1951–1959, but RMDs move to age 75 starting in 2033 (those born 1960+). Add a one-liner note to avoid misinforming learners under ~65.
- L1958: "Bitcoin ETFs (IBIT, FBTC, BTC)" — "BTC" as a ticker is Grayscale's Bitcoin Mini Trust; spelling it out (or swapping for ARKB/BITB) avoids confusion with the asset itself. Fee range "0.15–0.25%" is fair; IBIT is 0.12% (after the introductory 0.12% waiver expires it reverts to 0.25%), FBTC 0.25%.

---

### bitcoin-price-timeline
**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/bitcoin-price-timeline/index.html`
**One-line pitch:** Annotated timeline of Bitcoin price milestones with "why" explanations.

🟡 **Misleading**
- L1042: "$112,000 New ATH … ranking among the top 5 most valuable assets globally." At ~$2.2T market cap, Bitcoin typically ranks around 7th–9th among global assets (behind NVIDIA, Microsoft, Apple, Google, Amazon, Saudi Aramco; sometimes Meta). "Top 10" is defensible; "top 5" is a stretch. Rephrase as "top 10 most valuable global assets" or cite 8thMarketCap.com with a date.
- L770: "Mt. Gox is hacked and Bitcoin crashes to $0.01 briefly." This happened in a single hacked-account sell transaction on the Gox orderbook; the broader market never touched $0.01. A fairer phrasing: "a hacked Mt. Gox account flash-crashed Gox's order book to $0.01 for minutes before trading was halted and rolled back."
- L818: "850,000 BTC stolen from Mt. Gox" — roughly correct for the amount *lost* at the time of filing, but ~200,000 BTC were later recovered and are now being distributed to creditors (Trustee reports, 2024–2025). Add "; ~200K BTC were later recovered."

🟢 **Could be sharper**
- L686: "4-year halving cycles" — technically every 210,000 blocks (~4 years, variable because of difficulty adjustments). Spell that out for Builder/Principled learners.
- L652: "4 Halvings Completed — April 2024." Correct but the subtext should acknowledge that the timeline stops in Oct 2025; in April 2026 several months of post-$126K action exist and should be added (notably the early 2026 pullback and any 2026 ATH attempts).

---

### bitcoin-supply-schedule
**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/bitcoin-supply-schedule/index.html`
**One-line pitch:** Canvas-visualization of Bitcoin's full 2009–2140 emission schedule plus a halving table.

🔴 **Wrong**
- L449: `"Current Supply: 19.6M"` — hard-coded. Actual circulating supply in April 2026 is ~19.87M BTC (≈94.6% of 21M). Either wire this into the live `current-supply` element (which already has an ID) or update the static value to `~19.87M`.
- L457: `"Years Until Final Coin: 116"`. With the last satoshi mined around year 2140, from April 2026 that's ~114 years, not 116. Fix the initial hardcode or compute from `new Date().getFullYear()`.

🟡 **Misleading**
- L538: "Currently at ~1.7% per year" inflation. Pre-2024 halving, annual issuance inflation was ~1.7%; post-halving (April 2024 onward) it's ~0.83% per year. Replace with "~0.83% per year post-halving, decreasing to ~0.4% after the 2028 halving."
- L531: "Every 210,000 blocks (approximately 4 years)" — correct precision here, but pair with a one-line "…because block intervals vary, actual halvings have landed anywhere from 3.7 to 4.2 years apart" for Principled-level learners.

🟢 **Could be sharper**
- L591: `year = GENESIS_YEAR + (halvingNumber * 4)` generates the halving table using a flat 4-year multiplier. The real dates were Nov 28 2012, Jul 9 2016, May 11 2020, Apr 20 2024. Hardcode the historical dates for the first four halvings and extrapolate only from the fifth onward.

---

### bitcoin-vs-banking
**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/bitcoin-vs-banking/index.html`
**One-line pitch:** Side-by-side comparison of Bitcoin and traditional banking with a remittance-cost calculator.

🟡 **Misleading**
- L446, L720: Bitcoin cost hardcoded to `$2.50`. On-chain fees swung from <$0.50 to >$50 across 2023–2025 (Ordinals/Runes peaks). A flat "$2.50" understates volatility. Either pull mempool.space recommended fee (the page already uses live APIs elsewhere) or label it "median on-chain fee in quiet mempool conditions."
- L496: "Transaction Fees: $1–10 flat." Two issues: (1) Bitcoin base-layer fees are volume-independent but *not* amount-independent in any economic sense that beginners grasp — better framing is "priced per transaction weight, not per dollar amount"; (2) the $1–10 band is a calm-mempool snapshot. Add "(varies with mempool congestion)".
- L491: "International Transfers: Bitcoin 10–60 minutes." On-chain confirmations at 1-sat/vB during quiet periods can take hours; at 3+ confirmations the "settlement" claim is more like 30–180 minutes. Lightning is near-instant — worth mentioning as the fast-rail alternative to avoid flattening on-chain into an unrealistic single figure.

🟢 **Could be sharper**
- L516: "Inflation Protection: Fixed 21M supply." True at the protocol level, but the learner already knows Bitcoin is volatile. A short caveat ("protocol caps supply; short-term prices still swing with demand") would square the circle for Builder/Sovereign readers.

---

### debt-crisis
**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/debt-crisis/index.html`
**One-line pitch:** Live counter + historical chart + projection timeline for US federal debt.

🔴 **Wrong**
- L532, L553, L716: "$35 trillion" / `currentDebt = 35_000_000_000_000`. US total public debt crossed $36T in Nov 2024 and is ~$36.5T as of April 2026. The page *does* fetch live Treasury data (good) but the banner, initial value, and chart legend are anchored to 2024. Update the fallback to ~$36.5T and regenerate the alert banner dynamically from the fetched number.
- L589: "2025: $35.0+ trillion (Current)." Outdated — add a 2026 row (~$36.5T) or better, compute the "current" entry from the live fetch.
- L622: "$870 Billion Annual interest payments (2025)." Net interest for FY2024 was ~$882B; gross interest ~$1.1T. Estimates for FY2025 landed around $950B–$1.0T net (CBO, Sept 2025). $870B is roughly FY2023's figure. Replace with current-year CBO/Treasury number.
- L629: "130% Debt-to-GDP ratio." Total public debt / GDP in 2025 is ~122–124%. Publicly-held debt / GDP is ~99–100%. "130%" is neither. Replace with the specific ratio you're citing and its source, or drop to "~123% (total) / ~100% (held by public)."

🟡 **Misleading**
- L540: "Adding $1 trillion every 100 days." This held in mid-2023 and again in early 2024, but the pace has varied (some quarters have been slower). As a *current* statement it's shaky; reframe as "Treasury has added $1T to the debt in as little as ~100 days during recent periods" or tie it to a specific reference window.
- L597–609: Projected timeline (2026 $38T, 2028 $45T, 2030 $55T, 2035 $80T). These are aggressive straight-line extrapolations; CBO's June 2025 baseline projects $45T by FY2035, not $80T. The probabilities on L684/695/706 (25/50/25) are editorial, not sourced. Label the whole timeline "Illustrative scenario, not CBO baseline" or replace with CBO's actual projections.

🟢 **Could be sharper**
- L631: "Highest since WWII." WWII US debt/GDP peaked at ~119% in 1946 under the old GNP basis; by current total-debt/GDP measure, 2024–2025 figures have *surpassed* the WWII peak. Rephrase as "Now at or above WWII peak."

---

### energy-bucket
**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/energy-bucket/index.html`
**One-line pitch:** Metaphorical five-frame storyboard teaching that money stores human energy/effort.

🟢 **Could be sharper**
- Entire demo: no specific quantitative claims. The fiat-bucket-leaks vs Bitcoin-bucket-sealed framing is a strong metaphor but presented as if uniform across time. A single line — "Bitcoin preserves purchasing power over *multi-year* horizons; short-term drawdowns of 50–80% have happened in every cycle" — would keep the metaphor honest for Builder-level learners without breaking the beginner flow.

No other factual issues found.

---

### inflation-impact-calculator
**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/inflation-impact-calculator/index.html`
**One-line pitch:** Shows annual and multi-year loss of purchasing power given user income, expenses, savings, and an inflation rate slider.

🔴 **Wrong**
- L567: "1% (Official target)". The Federal Reserve's formal target is **2%** (PCE, symmetric, set Jan 2012; restated Aug 2020). Replace "1%" with "2% (Fed PCE target)" and cite the FOMC statement.

🟡 **Misleading**
- L568: "15% (Historical high)." US CPI peaked at ~14.8% (Mar 1980). "15%" is fine as a slider ceiling but label it "US post-WWII peak ~14.8% (1980)" to be precise. If you want a real "historical high" you'd have to cite hyperinflation cases (Weimar, Zimbabwe) which are off the scale — better to stick with US post-WWII.

🟢 **Could be sharper**
- L555/L564: Default 3.2% is a reasonable late-2024/early-2025 CPI estimate, but March 2026 CPI has come down further (~2.5–3.0% range in recent prints). Pull from a live BLS endpoint or at minimum attach a "(last updated: …)" caption.

---

### mining-economics-demo
**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/mining-economics-demo/index.html`
**One-line pitch:** Teaches why miners mine and runs a profitability calculator for a user-supplied rig.

🔴 **Wrong**
- L447, L527: `networkHashrate = 400000000 TH/s (400 EH/s)`. Network hashrate in April 2026 is ~850–950 EH/s (Mempool.space, CoinWarz). 400 EH/s was accurate for late 2023. A 2x-too-low hashrate makes every mining profitability estimate ~2x too optimistic. Raise to ~900 EH/s or better, fetch live from mempool.space (this demo already links to it at L244).
- L283: "Avg Transaction Fees (BTC) 0.15." Post-Runes-peak, average fees per block are closer to 0.03–0.08 BTC in quiet mempools and 0.15–0.4 BTC during busy periods. 0.15 is a reasonable *upper-middle* estimate; label it as "during moderate mempool activity" or swap for a live value.
- L291, L429, L450: BTC price hardcoded to `$100,000`. Use the existing live-data pipeline or update to a current number.

🟡 **Misleading**
- L339 (beginner): "Every 4 years, the block reward gets cut in half." True ballpark, but the halving is triggered every 210,000 blocks — strict time-based framing confuses learners when the fifth halving lands a few months early or late. Intermediate mode (L340) handles this better; mirror that in beginner.
- L398 (advanced): "Attacking costs > 50% hashrate (~$20B hardware + $1M/hr electricity)." At ~900 EH/s, 51% control would require purchasing ~450 EH/s of modern ASICs — at ~$15–20/TH rough street price that's $7–9B hardware, plus energizing it (~$3M/hr at $0.07/kWh). Numbers in the demo are stale but same order of magnitude; update or drop the specific dollar figures.

🟢 **Could be sharper**
- L387: "~33rd halving" for the final BTC — Bitcoin actually stops issuing after the 33rd halving (subsidy rounds to 0 satoshi). Correct, just worth pairing with "final block reward drops to 0 because satoshi-level truncation hits zero around block 6,930,000."

---

### money-properties-comparison
**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/money-properties-comparison/index.html`
**One-line pitch:** Side-by-side scoring of shells, gold, fiat, and Bitcoin across six monetary properties.

🔴 **Wrong**
- L453: "Gold: Very heavy ($1M = 25kg)." At gold ~$3,300/oz (April 2026), $1M = ~303 troy oz = ~9.4 kg. At $2,500/oz it's ~12.4 kg. 25 kg corresponds to gold at ~$1,250/oz (c. 2014–2015). Replace with "$1M ≈ 9–12 kg at current gold price" or compute from live spot.
- L531: "M2 money supply grew 400%+ since 1971." From ~$717B (Dec 1971, FRED M2SL) to ~$22T (Feb 2026), that's a **~30x increase, i.e. ~2,900%**. "400%+" is an order of magnitude understatement. Replace with "~30x (2,900%+) since 1971."

🟡 **Misleading**
- L461: "M2 grew 40% in 2020-2021." FRED M2SL: Feb 2020 $15.4T → Feb 2022 $21.8T = +41.5%. The claim is defensible if the period runs Feb 2020 to Feb 2022; over *calendar* 2020 it grew ~25%, 2020–2021 combined ~35%. Pin the window ("Feb 2020–Feb 2022") or drop to "~27% in 2020 alone" to avoid ambiguity.
- L450: "Gold Stock-to-flow ~60" — closer to 62–65 using current WGC estimates (~216kt above-ground stock / ~3.3kt annual production). Not wrong, just behind the WGC 2024 numbers.

🟢 **Could be sharper**
- L388: "Gold Standard 1792." US adopted bimetallism in 1792 (Coinage Act); the *classical* gold standard (gold-only) ran roughly 1879–1933 in the US and 1870s–1914 globally. Pair 1792 with a one-line clarification for Builder/Principled learners.
- L476: "Cryptographically verifiable by anyone in seconds (SPV proofs)." SPV is about wallet-side verification of inclusion, not full validation. Full validation (by a node) is what makes Bitcoin trustless. Tighten the phrasing so learners don't conflate SPV with full verification.

---

### sat-stacking-calculator
**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/sat-stacking-calculator/index.html`
**One-line pitch:** DCA results calculator that advertises "historical backtesting."

🔴 **Wrong**
- L303, L350: Marketing copy promises "historical results" / "Historical Backtest." L463–485 (`simulateHistoricalPrices`) actually generates **random prices around a $30,000 base with an upward trend** — not historical data at all. This is the single most load-bearing truth issue in the batch: users entering "start date 2014" get fabricated prices. Either (a) replace with a real weekly price dataset (the bitcoin-dca-time-machine demo already has one that could be shared) or (b) rename all copy to "DCA simulator (synthetic price path)" and disclose the model assumptions.
- L351: `max="2025-10-22"` on the start-date input — users in April 2026 cannot select any 2026 date, so the calculator caps their "historical" window at Oct 2025 while computing against fabricated data anyway. Update to `max` = today (or compute dynamically).
- L436: Fallback price `$97,000`. Stale; align with live-fetch or neutral value.

---

### savings-disappear-scenario
**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/savings-disappear-scenario/index.html`
**One-line pitch:** 10-year choose-your-own-adventure comparing savings account, index fund, and Bitcoin strategies from 2020.

🔴 **Wrong**
- L462: "2022 inflation = 6.5%." US CPI annual average for 2022 was 8.0% (BLS). 6.5% was the Dec 2022 YoY figure — a specific month, not the year. Replace with 8.0% (annual) or label as "Dec 2022 YoY."
- L782–783: "Bitcoin holdings $5,240,000 / 7.14 BTC at $734,000 per coin" presented as the 2030 outcome without any "if/then" framing. This is a projection rendered as narrative fact. Same issue at L818: "From 2020–2030, Bitcoin went from $7K to ~$734K (conservative estimate)" — that's a future price, not history. Reword the whole `bitcoin_2030` scene as "A plausible 2030 outcome if Bitcoin follows its historical CAGR" and drop "conservative estimate" (a 100x in 10 years is not conservative by any mainstream model).

🟡 **Misleading**
- L460: "2020 inflation = 1.4%." BLS annual CPI for 2020 was 1.2% average, 1.4% Dec YoY — close enough, flag the basis.
- L463: "2023 inflation = 3.4%." Annual average was 4.1%; 3.4% was Dec 2023 YoY. Again, flag basis (annual average vs YoY at year-end).
- L466–470: Inflation for 2026–2030 is **guessed** (3.8, 4.1, 4.3, 4.5, 4.7). No source. Either attach a named forecast (Fed SEP, CBO, TIPS breakevens) or label the path as "illustrative scenario."
- L717: "Over 10 years, cumulative inflation was ~45%." With the demo's own numbers (1.4 + 7 + 6.5 + 3.4 + 3.2 + 3.5 + 3.8 + 4.1 + 4.3 + 4.5 + 4.7 compounded) you land at ~52%, not 45%. Either recompute or change the summary.

🟢 **Could be sharper**
- L490: "Bitcoin: Conservative 20% annualized (historically ~200%)." Bitcoin's 2011–2024 CAGR is ~55–60%, not 200%. "20% conservative" is fine; the "(historically ~200%)" parenthetical is wrong and should be removed or rewritten as "Bitcoin's 10-year CAGR through 2024 was ~60%."

---

### stock-to-flow
**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/stock-to-flow/index.html`
**One-line pitch:** Interactive explainer of the Stock-to-Flow scarcity model with calculator and asset comparison.

🟡 **Misleading**
- L620: "Gold S2F ~59." Current WGC 2024 numbers give S2F ≈ 62–65. Minor, but since the table invites learners to compare directly to Bitcoin's 120, the gold number should be current. Cite WGC and timestamp.
- L632: "Bitcoin (2024): ~19.7M BTC." Outdated for 2026; the current row should show "~19.87M" as of April 2026.
- L676: "Price: $650 → $20,000" for Era 3 (2016–2020). Technically the $20K ATH occurred within Era 3 (Dec 2017) but Era 3 *ended* at ~$8,500 (May 2020). "$650 → $20,000 peak; closed at $8.5K" would be accurate.
- L683: "$9,000 → $69,000" for Era 4. Same framing issue; $69K was the ATH (Nov 2021); Era 4 ended at ~$64K (April 2024). Tighten wording.
- L689: "S2F ~120 (Surpasses gold)" — math checks out (19.87M / 164K ≈ 121). Fine.

🟢 **Could be sharper**
- L717–724: The disclaimer calling out S2F's predictive limits is good. Consider pointing to PlanB's own retracted/delayed price-prediction track record for Principled-level learners (e.g. "The S2F model's 2024 price target of $288K was not met").

---

### time-machine
**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/time-machine/index.html`
**One-line pitch:** Genesis-to-now historical timeline of cryptographic precursors culminating in Bitcoin.

🟡 **Misleading**
- L926: "[10,000 BTC] Today, that's worth hundreds of millions of dollars." At ~$100K/BTC that's $1 **billion**. Update to "close to $1 billion" (or dynamic from live price).
- L1795: `const bitcoinPrice = 95000; // Approximate current BTC price`. Hardcoded. Replace with the existing live-price fetch used elsewhere on the site (`js/bitcoin-data-reliable.js`).

🟢 **Could be sharper**
- L877: "e-gold (1996), b-money (Wei Dai, 1998), Bit Gold (Nick Szabo, 2005)." Bit Gold was proposed by Szabo in 1998 and publicly written up in 2005. The "2005" date is the publication, not invention. Minor, but Principled/Sovereign learners will catch it.

---

### time-preference-explorer
**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/time-preference-explorer/index.html`
**One-line pitch:** Scenario-based tool comparing financial decisions across life stages and risk tolerances.

🔴 **Wrong**
- L789–793: Comparison "End Year" dropdown maxes at `2024 (Today)`. In April 2026 this is 16+ months stale and hides 2025's strong equities year (S&P 500 +24%) and BTC's Oct 2025 ATH. Add 2025 and 2026 YTD options and corresponding `assetData` rows.
- L901: `2024: bitcoin 120.0%`. BTC started 2024 at ~$42,250 and ended at ~$93,500 (+121%). Correct. Leaving this here as confirmation.
- L901: `2024: stocks 23.3%`. S&P 500 total return for 2024 was 25.0% (SPY), not 23.3%. Small but directly falsifiable.

🟡 **Misleading**
- L891–902 (whole `assetData` block): Missing 2025 row. Without it the "Asset Comparison" tab can't render the most recent complete year — material for any Dec-2025 or 2026 user.
- L1020: "Low growth (4.5% APY)" for a high-yield savings account. That was accurate through mid-2025; by April 2026 top HYSA rates are 3.8–4.3% as Fed funds drift lower. Flag as "~4% APY (varies with Fed funds)."

🟢 **Could be sharper**
- L1070: "If you'd invested: $315k in diversified portfolio" — implicit ~12% CAGR on $100k over 10 years; label the underlying assumption so learners can reason about it.
- L1057: "Housing prices just jumped 15%" — no year-tag; in 2026 this feels like a 2021-vintage scenario. Either add a year to the context or decouple the numbers from a specific era.

---

## Meta-observations

1. **Stale price/supply/hashrate anchors are the dominant failure mode.** Eight of sixteen demos hardcode BTC price ($95K–$100K), six hardcode circulating supply at 19.6–19.7M, and the mining demo hardcodes network hashrate at less than half its current value. The site already ships `js/bitcoin-data-reliable.js` and queries mempool.space in other places — rewiring these demos to use the existing live pipeline would eliminate ~30% of this audit's findings.

2. **The "2025 gap".** Multiple demos stop their data at end-2024 (bitcoin-dca-time-machine, time-preference-explorer, sat-stacking-calculator, savings-disappear) while presenting as current. A single shared "last complete year" dataset (price, S&P 500 total return, gold return, inflation) refreshed yearly would prevent drift.

3. **Fabricated-as-historical data in sat-stacking-calculator.** This is a category above all other issues in the batch — the demo advertises historical backtesting and returns synthetic randomised prices. Fix or rename immediately; it corrodes trust site-wide.

4. **"Conservative" projections framed as fact.** Savings-disappear-scenario (L782–L818) and debt-crisis (L597–L609) both render *forward projections* as part of the narrative without clear "if/then" framing. For learners who arrived from other paths, this blurs the line between educational scenario and prediction. Adopt a consistent "⏩ Scenario (not forecast)" badge.

5. **Historical event dates vs historical event tails.** Several demos (stock-to-flow halving eras, price timeline) describe eras by their ATH rather than their closing price. For Builder/Sovereign learners trying to build mental models, it would help to show both (`era peak` and `era close`).

6. **Economic claims sourced to "vibes".** Several specific numbers (US debt-to-GDP "130%", M2 growth "400% since 1971", "mining uses as much as Argentina"-style energy comparisons) are in the neighborhood of fact but either off by order of magnitude or decorated. Where SOURCES.md already lists FRED, Treasury, BLS — cite those inline at the claim site.
