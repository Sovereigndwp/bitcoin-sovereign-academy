# Money & Banking Deep Dive — Audit & Redesign Plan

**Scope:** `deep-dives/money-banking/` — `index.html`, `history-of-money.html`, `central-banking-explained.html`, `cantillon-effect.html`
**Date:** 2026-06-20
**Verdict:** Currently a *bundle of four good lessons*, not one deep dive. Needs a **major upgrade** — primarily structural (connect the four into one investigation) and depth (add tradeoffs, objections, real interactivity, and a claim ledger).

---

## 1. The core problem in one sentence

You have four well-written, attractively-styled explainer pages sitting in the same folder, but they **don't share a question, don't reference each other, and never make the learner test a claim** — so the whole thing reads as a long lesson with a Bitcoin conclusion bolted onto the end of each page, instead of a single investigation the learner works through.

The Deep Dive Standard arc is:

> research question → current system → failure mode → design pressure → Bitcoin mechanism → tradeoffs → interactive test → evidence → objections → reflection

Right now the pages cover *current system → failure mode → "Bitcoin fixes this"* and stop. The last four steps of the arc — **tradeoffs, a real interactive test, steelman objections, reflection** — are mostly missing.

---

## 2. Structural audit (why the four sections feel disconnected)

**Finding A — The hub advertises five tiles but two point *outside* the deep dive.**
The canonical deep dive is the four files in `deep-dives/money-banking/` (confirmed: it is *not* under `paths/`). Yet `index.html` advertises **five** module cards, and two of them link away to `/paths/curious/stage-1/deep-dives/` — pages that are not part of this deep dive:

| Card on hub | Links to | Part of this deep dive? |
|---|---|---|
| How Money Is Created | `/paths/curious/stage-1/deep-dives/money-creation.html` | ❌ off-site / not in `money-banking/` |
| Fractional Reserve Banking | `/paths/curious/stage-1/deep-dives/fractional-reserve.html` | ❌ off-site / not in `money-banking/` |
| The Cantillon Effect | `/deep-dives/money-banking/cantillon-effect.html` | ✅ |
| Central Banking Explained | `/deep-dives/money-banking/central-banking-explained.html` | ✅ |
| The History of Money | `/deep-dives/money-banking/history-of-money.html` | ✅ |

So the hub for *this* deep dive is sending learners to two pages that live in a different content tree (the Curious path). Either those two foundational mechanics need to be **brought into `money-banking/`** so the deep dive is self-contained, or the hub should stop presenting them as tiles of this dive. This split is the single biggest source of the "disconnected" feeling — the hub promises a five-part journey but only three parts actually live here, and the two it leans on most (how money is created, fractional reserve) aren't here at all.

**Finding B — No sequence.** The cards are a flat grid. Nothing tells the learner there's an order, or that the sections build on each other. History, Cantillon, and Central Banking can each be entered cold, and each assumes the learner already understands money creation — which lives on a different page.

**Finding C — The sections are one-way streets.** Every child page links only `← Back to Money & Banking`. There is **no "next section" progression and no cross-linking** between siblings. A learner who finishes History has no path forward except back to the menu. This is the literal disconnection.

**Finding D — The guiding question only fits one section.** The hub's framing question — *"If new money always enters at specific points, who gets the advantage?"* — is the **Cantillon** question. It doesn't frame History or the Fed toolkit. There is no through-line question that earns all four sections.

**Finding E — Three different interaction engines, three hand-rolled toggle scripts.** History uses accordion "eras," Cantillon uses accordion sections + a waterfall, Central Banking uses accordion sections + sliders + a timeline. Each page reimplements `toggle…()`. No shared component, inconsistent UX.

---

## 3. Depth audit (why it's "not really that deep")

| Required deep-dive component | Present? | Notes |
|---|---|---|
| One clear research question | ⚠️ Partial | Hub has a question, but it's Cantillon-specific, not an arc |
| "Why this matters" | ✅ | Implicit in each intro |
| Current-system comparison | ✅ | Strong — this is the pages' best feature |
| Specific failure mode / design pressure | ✅ | Debasement, printing, ratchet effect — well done |
| Bitcoin mechanism (precise) | ⚠️ Partial | Asserted (21M, PoW, fixed schedule) but not *mechanically* explained (no issuance curve, no difficulty adjustment, no "loans create deposits") |
| **Tradeoff section** | ❌ **Missing** | Bitcoin shown with 8 green tags and zero red. No volatility, key-loss, throughput, deflation-debate, or energy tradeoffs |
| At least one **meaningful** interactive | ⚠️ Weak | Only the Fed Control Room qualifies. Waterfall + ticker are scripted animations with hardcoded numbers — they *illustrate*, they don't let the learner change inputs |
| At least one **chart / data visual** | ⚠️ Partial | Central Banking has a real timeline ✅. But there is **no actual data chart** (no money-supply, purchasing-power, or issuance curve) |
| One comparison table | ⚠️ Partial | Two-column "fiat vs Bitcoin" cards exist, but no true multi-property matrix |
| **Steelman objections** | ❌ **Missing** | No section presents the strongest case *for* central banking or *against* Bitcoin. "Rules vs Rulers" is one-sided |
| **Misconception repair** | ❌ **Missing** | None of the common myths are named and corrected |
| Socratic reflection questions | ⚠️ Hub only | The reflect-widget is on `index.html` only; the three content pages have none |
| Source trail | ⚠️ Partial | Good inline citations (BLS, Fed H.4.1, Fed DFA, IIF) but **no consolidated claim ledger**, and several figures are uncited/illustrative |
| Graph edges | ❌ Missing | No `teaches`/`repairs`/`supports_decision`/`bridges_to`/boundary metadata |
| Boundary validation | ✅ Mostly | No hard TBA funnel; email-capture + tip + membership-gate are soft (see §8) |

**Bottom line:** the pages do the *expository* half of a deep dive very well and skip the *investigative* half almost entirely. A deep dive should make the learner argue with it. These pages don't give them anything to push against — no tradeoffs, no steelman, no input they control that could produce an uncomfortable result.

---

## 4. Unsupported / weak / stale claims (needs a claim ledger)

To the pages' credit, many claims are already sourced. These are the ones that need attention. **Note:** it is now mid-2026 — figures cited "as of 2024" are ~2 years stale and should be re-pulled.

| Claim | Location | Status | Action |
|---|---|---|---|
| S&P +480%, CEO pay +1,460%, wages +18%, groceries +45%, savings 0.5% APY | cantillon ticker | ⚠️ Illustrative/uncited; "CEO pay since 1978" mismatches the "2008–2024" frame | Either cite each to a source + date, or relabel clearly as a stylized model. Fix the date-range inconsistency |
| Top 1% wealth grew "~$30 trillion since 2008" | cantillon | ⚠️ Needs current source + date | Re-pull from Fed Distributional Financial Accounts, date it |
| Dollar lost "~85% since 1971" | history | ⚠️ Inconsistent with the 96%-since-1913 figure; understated on most CPI measures | Reconcile the two figures, source both to BLS CPI with the as-of date |
| "Global debt over $300 trillion / 300% of GDP (IIF)" | history | ⚠️ IIF figure moves quarterly; undated | Add quarter/year; treat as "as of" |
| Dollar lost "~96% since 1913" | central-banking | ✅ Sourced (BLS CPI) | Keep; add as-of date |
| Fed balance sheet "~$9T, 2008 → 2022 peak (H.4.1)" | cantillon | ✅ Sourced, accurate (~$8.97T peak) | Keep |
| "Top 10% hold ~88% of corporate equities (Fed DFA 2024)" | cantillon | ✅ Sourced | Refresh to latest DFA |
| QE "$4.5T" / COVID "$5T+" | central-banking | ⚠️ Approximate | Round honestly, cite H.4.1 |
| Europeans "printed money" by importing cowrie shells | history | ⚠️ Strong claim, no source | Cite monetary-history source (e.g. Bin Yang on cowrie trade) or soften |
| Bitcoin shown with 8 green properties, 0 tradeoffs | history era 7 + both comparison cards | ❌ One-sided | Add tradeoff tags (volatility, self-custody risk, ~7 tps base layer, energy, deflation debate) |
| Fed Control Room slider→effect mapping | central-banking JS | ⚠️ Hand-tuned heuristic presented as fact | Label as a simplified directional model, not a forecast |

**Good news:** no stale block-subsidy (no "6.25 BTC") and no hardcoded live BTC price — those common BSA traps are absent here.

---

## 5. The redesign: one investigation, four moves

Reframe the whole deep dive around a single research question the four sections each advance:

> **"Who gets to create money, who receives it first — and what would it take to remove that power from anyone?"**

That question earns all four sections and forces the arc to its end (tradeoffs + objections), because the honest answer to "remove the power from anyone" is *"Bitcoin tries to — here's the mechanism, and here's what it costs."*

**Proposed linear structure (with built-in progression, not a flat menu):**

| # | Section | Role in the arc | Keep / Rework |
|---|---|---|---|
| 0 | **Hub** | Pose the research question; show the 4-step path; set expectations | Rework: add the through-line question + numbered path + "what you'll be able to decide at the end" |
| 1 | **History of Money** | *Current system & failure mode over time* — establishes the recurring pattern (sound money → centralized trust → abuse → failure) | Keep content; add the missing money-creation foundation as a primer; add tradeoffs to the Bitcoin era; add reflection |
| 2 | **Central Banking** | *The current system in detail* — how money is actually created today and who controls it | Keep; **add steelman** ("the case for a central bank") + misconception repair ("the Fed prints all the money" → banks create most) |
| 3 | **The Cantillon Effect** | *The failure mode made personal* — the distributional consequence of §2 | Keep; upgrade the waterfall into an input-driven simulator; add objections |
| 4 | **Rules vs Rulers → Bitcoin's mechanism + tradeoffs** | *Design pressure → Bitcoin mechanism → tradeoffs → decision* | New/merged closing section: precise issuance mechanism, honest tradeoffs, steelman against Bitcoin, the reflection that closes the whole dive |

**Connective tissue to add to every page:**
- A persistent **progress bar / stepper** (1 of 4 … 4 of 4) so the learner always knows where they are.
- A **"← Previous / Next →"** footer on every section (not just "back to hub").
- A one-line **callback** at the top of each section linking to the prior section's takeaway ("In §1 you saw rulers always debase. Now see *how* today's version works.").
- **Decide where money-creation + fractional-reserve actually live.** Either move those two pages into this folder and make them §1.5, or have the hub clearly mark them as "foundations (separate page)." Don't advertise five tiles when three are here.

---

## 6. Interactive upgrades (each must teach a tradeoff)

| Current | Verdict | Upgrade |
|---|---|---|
| **Fed Control Room** (sliders → 6 effects) | ✅ Genuine interactive — best asset on the site | Keep. Add a "you can't win" challenge: *"Try to get 2% inflation, full employment, AND a strong dollar at once."* The impossibility **is** the lesson. Label the model as directional |
| **Money Waterfall** (scripted animation) | ❌ Decorative — fixed %s, no input | Convert to a **simulator**: learner sets the print amount + their own position in the chain (saver / homeowner / asset-owner) and sees their *real* purchasing power after the money works through. Tradeoff becomes personal |
| **Price-impact ticker** (scripted reveal) | ❌ Decorative + uncited | Replace with a **real chart**: asset prices vs. wages vs. CPI, indexed to 100 at 2008, from cited series. Let the learner toggle nominal vs. real |
| **History accordion** (reveal boxes) | ⚠️ Reveal only | Add a **property-scorecard interaction**: learner rates each era's money on the 6 monetary properties before revealing the verdict — turns reading into judging |
| (none) | ❌ Missing | Add a **Bitcoin issuance-curve explorer** for §4: drag along the timeline, watch new-supply-per-block halve toward the 21M cap. This is the mechanism the pages currently only *assert* |
| (none) | ❌ Missing | Add a **misconception tester** (2–3 true/false myths per section, with the correction as feedback) |

**Charts/visuals to add** (skill requires at least one real data visual; right now only the Fed timeline qualifies): purchasing-power-of-the-dollar line; M2 / Fed balance-sheet line; asset-vs-wage divergence; Bitcoin issuance curve. Use real cited series, dated.

---

## 7. Objections & misconceptions to add (the missing half)

**Steelman objections** (one per section, presented as the strongest honest version, then engaged — not strawmanned):
- *Central banking:* "A lender of last resort genuinely stopped 2008 and 2020 from becoming depressions; a fixed-supply money has no circuit breaker."
- *Cantillon:* "Some redistribution toward employment in a downturn may be a deliberate, defensible policy choice, not a hidden theft."
- *Bitcoin:* "Fixed supply + volatility makes it a poor unit of account; a money that can't flex in a crisis may amplify busts; lost keys are permanent; ~7 tps base-layer throughput."

**Misconceptions to repair** (name → correct):
- "Banks lend out your deposits." → In modern banking, **loans create deposits**; reserves aren't lent out one-to-one.
- "The Fed prints all the money." → Most broad money is created by **commercial banks** when they lend.
- "Inflation = greedy companies." → Distinguish monetary inflation from relative price changes.
- "Fixed supply guarantees price stability." → Fixed *supply* ≠ stable *price*; demand still moves price (this is also an honest Bitcoin tradeoff).
- "Gold standard = no inflation." → Gold discoveries (e.g. New World silver, 19th-c. gold rushes) caused inflation too.

---

## 8. Boundary & tone

**Boundary:** Acceptable. No hard funnel into TBA / custody / implementation. The hub carries `email-capture`, `tip-cta`, and `membership-gate.js` — these are soft monetization, not high-intent routing, so they're within bounds for an educational asset. One flag: `membership-gate.js` on a top-of-funnel deep dive risks gating education; confirm it isn't blocking the learning content itself.

**Tone:** This is where the pages drift from the standard. Phrases like *"the hidden tax is complete," "broken promises," "Trust us, we know what we're doing," "Rules, not rulers,"* and the all-green Bitcoin tag sets read as advocacy, not investigation. The fix is not to delete the argument — it's to **add the other side** (steelman + tradeoffs) so the learner reaches the conclusion themselves instead of being walked to it. Evenhandedness is also what makes a deep dive feel deep.

---

## 9. Graph edges to add

Add to each page's metadata (and the hub):

```
content_type: deep_dive
strategic_role: foundational-monetary-understanding
teaches: [money_properties, money_creation, central_banking, cantillon_effect,
          fiat_mechanics, bitcoin_issuance, rules_vs_discretion]
repairs: [loans_lend_deposits_myth, fed_prints_all_money_myth,
          fixed_supply_means_stable_price_myth, gold_standard_no_inflation_myth]
supports_decision: "Do I trust discretionary monetary policy or rules-based money?"
bridges_to: [curious_stage1_money_creation, curious_stage1_fractional_reserve,
             bitcoin_issuance_deepdive, sound_money_lessons]
blocked_by_boundary: [no_direct_TBA_custody_funnel]
```

Also unify the two off-folder pages (money-creation, fractional-reserve) into these edges so the graph reflects the true learning path, not the split file layout.

---

## 10. Boundary risks & open questions for you

1. **Where should money-creation + fractional-reserve live?** Move them into `money-banking/` as §1.5, or keep them in `paths/curious/` and have the hub link out clearly? (Recommend: move them in — they're the foundation the other three assume.)
2. **Audience.** The inventory tags these "Beginner, Advanced Learner." A true deep dive can assume more. Confirm the target so I can pitch the depth correctly.
3. **`membership-gate.js`** — does it gate the educational content or only premium extras? Affects the boundary verdict.
4. **Do you want real charts** (pull + cite live series, dated) or stylized illustrations clearly labeled as such? Both are defensible; pick one and be consistent.

---

## 11. Upgrade classification

**Needs major upgrade** — structurally (connect four sections into one arc; resolve the split file layout) and in depth (add tradeoffs, steelman objections, misconception repair, real interactivity + charts, per-section reflection, a claim ledger). The writing quality and visual design are already strong, so this is additive and structural, not a teardown.

---

## 12. Recommended implementation order

Following the skill's standard order:

1. **Fix structure first** — decide the home for money-creation/fractional-reserve; add the through-line question, numbered stepper, and Prev/Next progression across all pages. *(Highest leverage — this alone fixes the "disconnected" complaint.)*
2. **Reconcile & source claims** — build the claim ledger (§4), fix the 85%/96% and CEO-pay-date inconsistencies, date every figure, relabel illustrative numbers.
3. **Add the missing half** — tradeoff sections + steelman objections + misconception repair on each page.
4. **Add real charts/visuals** — purchasing power, M2/balance sheet, asset-vs-wage, Bitcoin issuance curve.
5. **Upgrade interactives** — Waterfall → input simulator; ticker → real chart; add issuance-curve explorer + misconception testers; keep/extend the Fed Control Room.
6. **Add per-section reflection** (reflect-widget on all four, not just the hub).
7. **Wire graph edges** (§9).
8. **Boundary validation pass** — confirm membership-gate isn't gating learning; keep monetization soft.

---

### Success test (how we'll know it worked)

After the upgrade, a learner finishing the dive should be able to say:
*"I understand how money is actually created today, who receives it first, and why that matters for me specifically. I can argue both sides. I tested the tradeoffs myself. I see what Bitcoin's design changes — and what it costs — and I reached my own verdict."*

Today, they'd more likely say: *"I read four pages that told me Bitcoin is better."* That gap is the work.
