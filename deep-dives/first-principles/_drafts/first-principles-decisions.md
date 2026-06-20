# First Principles audit, decisions log (2026-06-19)

Decisions made before/while upgrading `deep-dives/first-principles/` to strong_as_is.
Branch: `audit/first-principles-upgrade`.

## 1. Architecture: lean hub + 3 dives (user-approved)
`index.html` and `original-question-everything.html` were ~95% identical 10-principle
journeys (same demos, same stale figures) under two framings ("Build the MVP" vs.
"First Principles Questions"). That's duplication + an SEO self-collision, not depth.

**Decision:** `index.html` → a true lean **hub** (orient + 3 cards + comparison-at-a-glance
+ scope note; kept the reflect/email/tip/analytics wiring it already had). The full journey
lives **only** in `original-question-everything.html`. No redirect needed, both URLs keep
working, but the hub no longer re-teaches the journey.

## 2. why-money-fails → standalone honest deep dive (user-approved), no overlap with the thesis
The old page was one-sided advocacy (each failure closed with an unqualified "Bitcoin's
Answer"). Reframed around a real research question: *is there one mechanism behind every
monetary collapse, and does Bitcoin escape it or relocate the risk?* Every failure now gets
an **honest tradeoff** (esp. self-custody = no recourse; censorship-resistance is content-neutral).

**Boundary vs. Foundational-Layer Thesis (user constraint):** this page stays on the
**historical failure modes of money** + sound-money properties. It explicitly does NOT touch
Bitcoin's *present-day role* in the layered payment stack (settlement vs. activity, Layers 0–4,
Lightning, stablecoins, treasury/sovereign frameworks), that's the thesis's lane. A scope card
+ a `bridges_to` edge point readers to the thesis for that. No content overlap.

## 3. Stock-to-Flow PRICE model removed (digital-scarcity)
The old page sold S2F as a price engine ("supply shock… price must adjust upward",
"projected ~240"). The PlanB S2F price model is falsified out-of-sample (diverged from
realized price by >500% across 2024; the $500k-by-2025 band didn't arrive). 

**Decision:** keep S2F **only as a scarcity descriptor** (stock ÷ flow), pair it with the
divergence evidence, and repair "halvings cause price" as the same error. Added the honest
case *against* a fixed cap (deflation debate, lost coins, post-subsidy security budget, the
last is flagged as genuinely unresolved).

## 4. De-gamified the flagship (locked "unbounded mode" convention)
Removed the progress bar, "X/10 Principles Understood", and the 10 "I Understand X" buttons.
Replaced with neutral "Continue ↓" navigation (`openNext`) and a "Collapse all sections"
control (`collapseAll`). No score, no completion %. Dead scoring JS removed.

## 5. Data discipline
- Reproducible math in `_drafts/first-principles-worksheet.py` → `data/first-principles-math.json`
  (issuance/S2F schedule, purchasing-power curves, denarius decay). Terminal supply derived as
  **20,999,999.9769 BTC** over 33 epochs (used as a teaching point, "21M" is a round-off).
- Sourced historical facts + claim ledger in `data/first-principles-facts.json` (source tiers T1–T4).
- Present-day facts web-verified June 2026: supply ~20.04M (~95%), subsidy 3.125, ~21k reachable
  nodes (with methodology caveat), S2F price-model falsified. Stale fallbacks ($43,000; 20,040,000;
  94.3%/19,803,000) fixed or made live-bound.

## 6. Interactives (math worth playing with)
- **why-money-fails:** purchasing-power erosion simulator (slider + presets + Chart.js).
  Honestly notes Bitcoin is *more* volatile short-term, it removes debasement, not price risk.
- **digital-scarcity:** issuance & S2F explorer stepping through halving epochs; deliberately
  shows NO price line, with the divergence critique alongside.
- **flagship:** kept its existing demos; added steelman + misconception + source block. Its
  "interactive_test" arc element = the money-properties/consensus demos (sufficient; the two
  child dives carry the heavier quantitative interactives).

## Open follow-ups (not blockers)
- Lost-coin figure in digital-scarcity steelman is cited as a range (Chainalysis/Glassnode), fine
  for an estimate, could be tightened later.
- A future pass could turn the flagship's money-properties demo into a fuller scored comparison
  matrix, but it already teaches the tradeoff and isn't required for strong_as_is.
