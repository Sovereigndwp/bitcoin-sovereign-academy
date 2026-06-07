# Brief — Spec the Youth Front-Door Redesign (`youth-families/index.html`)

> **This is a brief, not a spec.** Its job is to set up the *next* session to **write the design spec** for the youth front door, then get sign-off **before any code**. Do not start building. Produce a spec.

**Created:** 2026-06-07 · **Status:** ready for a fresh session to pick up · **Owner decision points flagged inline**

---

## Why this page, why now

The Phase 4 youth-pedagogy audit (`reports/pedagogy-youth-audit-2026-06-06.md`) ranked **`youth-families/index.html` the #1 highest-leverage page** on the youth funnel:

- **Leverage 17.9** (lowest core score × highest funnel weight). It's the front door to the whole youth track (weight 5).
- **Scores (1–5):** Discovery **1**, Curiosity **1**, Retention **1**, Capability-gain **1**, Real-artifact **1**, Family-catalyst **1**, Socratic **1**. Progression 3; age-fit 2 / 4 / 4 (12–14 / 15–17 / adult).
- **Honest capability-gain sentence:** *"After this page, the learner can browse and navigate to individual weeks but gains no new financial knowledge, capability, or sticky mental model."*
- **Age-band readiness:** bright 12-year-old solo? **❌ No.** 15-year-old? ✅. 17-year-old prepped? 🟡.

**The problem in one line:** the front door is a *directory*. It routes but teaches nothing — so a visitor's first experience of the youth program is a table of contents, not a reason to care.

**The goal of the redesign:** the front door should **teach one thing and deliver a micro-win before it routes** — a 60-second interactive moment that gives the learner (or a parent/educator evaluating the program) an immediate "oh, *that's* what this is" — then sends them into the weeks. Lift Discovery / Curiosity / Capability-gain / Real-artifact off the floor, and make it work for a **12-year-old solo**.

---

## Process (follow this order)

1. **Brainstorm first** (`superpowers:brainstorming`) — explore the intent and options before converging. This is creative/strategic work on a strategic page; brainstorm is required.
2. **Apply the A–D option format** (locked convention): any visual/layout/aesthetic decision is presented as a **4-option A–D comparison with side-by-side mockups + a recommendation**. The "one interactive micro-win" concept and the page layout are both A–D-worthy.
3. **Write the spec** into `docs/superpowers/specs/2026-06-07-youth-front-door-redesign-design.md` (then a plan in `docs/superpowers/plans/`). Spec → sign-off → code. **Do not ship code before Dalia signs off** (locked: spec-before-code on strategic pages).

---

## What the spec must contain

1. **Problem statement + measurable success criteria**, tied to the audit: name the specific criteria to move (Discovery, Curiosity, Capability-gain, Real-artifact, 12–14 age-fit) and what "good" looks like for each.
2. **The "one thing the front door teaches"** — design the 60-second interactive micro-win. Candidate seed (from the audit): a single constrained money choice, e.g. *"here's $20/week for 4 weeks — what happens to your savings if you skip one habit?"* — something that produces a tiny insight or artifact, then routes. Explore ≥3 alternatives in brainstorming; pick via A–D.
3. **A–D layout mockups** for the page itself (hero + micro-win + routing into the 10 weeks + family/educator entry points), with a recommendation.
4. **Age-band plan**, especially **12–14**: reading level, concept load, examples. The current front door fails the 12-year-old; the redesign must not.
5. **Family + educator entry points** — this is the *family* hub; make the parent/educator path obvious (ties to the brand identity and the educator-usability gap).
6. **Benchmark-borrow** (from the audit): **Code.org** beginner onboarding + **Brilliant** curiosity hook — adapt *without* importing reward-loop mechanics.
7. **Measurement** — how we'd know it worked (engagement with the micro-win, click-through into week-01, etc.), consistent with first-party analytics (`js/analytics.js`).

---

## Constraints (locked — do not violate; call out any tension instead of breaking them)

- **Unbounded mode / voice-spec §11:** NO quizzes, badges, streaks, XP, or completion percentages. Real-accomplishment markers ("you built X") are permitted; artificial engagement loops are not. The micro-win must be intrinsic, not a points hook.
- **Voice:** first-principles, inform-not-convince, composable. See `docs/marketing/voice-spec.md` (canonical).
- **Color carries meaning:** default to neutral surfaces/borders; reserve color for genuine semantic distinction. (Note: the youth track currently uses its own dark-green + `#FF7A00` palette — `--card-bg:#1a3a2e`, `--primary-orange:#FF7A00` — which differs from the site's canonical visual system below. **Resolve which visual system the youth front door should use — this is a real A–D decision, not an assumption.**)
- **Canonical design reference:** `os.thesovereign.academy` — editorial-asymmetric, left-indented hero, sectional bg differentiation, Playfair Display headlines + JetBrains Mono labels, 2px corners, restrained gold/orange. **Read before any layout/typography work.**
- **Visual system canonical (2026-05-03):** Playfair Display + Crimson Pro + JetBrains Mono, burnished gold `#C8922A`, cream paper. See `docs/superpowers/specs/2026-05-03-component-library-plan.md` + `2026-05-03-site-wide-ia-audit.md`.
- **Footer convention:** `Created by Dalia · bitcoinsovereign.academy` on every visual artifact. (The youth pages currently *lack* a footer — fixing that can be folded into this redesign.)
- **Absolute CSS paths only** (`/css/brand.css`, never relative) — these pages embed/serve at non-root URLs.
- **Preserve functionality:** routing to all 10 week lessons must remain intact. Don't break the existing `yf-progress` localStorage tracking.
- **Data-attribute auto-init components:** the youth weeks now mount `reflect-widget` (PR #53). If the front door gains interactive components, follow the same auto-init pattern and re-verify with before/after screenshots.

---

## Inputs to read first

- `reports/pedagogy-youth-audit-2026-06-06.md` — full scorecard, the redesign shortlist (Tier 1 = this page), and the cross-cutting wins already shipped (reflect-widget + family prompts, PR #53).
- `youth-families/index.html` — the current page (the directory to replace).
- `docs/marketing/voice-spec.md` · `os.thesovereign.academy` · the 2026-05-03 visual-system specs.
- Audience: the 7 segments + the youth bands (12–14 / 15–17 / adult educators & parents).

## Already shipped (don't redo)

- **PR #53** — reflect-widget mounted on all 10 youth weeks + family-conversation prompts on 8 of them (the audit's cheap wins A + B). The front door was intentionally **excluded** from those (it's a hub, not a lesson) — which is exactly why it needs this dedicated redesign.

---

## Kickoff prompt (paste this in the new session)

> Brainstorm and then write a design spec for redesigning the youth front door (`youth-families/index.html`) per `docs/superpowers/specs/2026-06-07-youth-front-door-redesign-brief.md`. It's the #1-leverage page from the Phase 4 audit (teaches nothing, fails the 12-year-old). Goal: a 60-second interactive micro-win that teaches one thing before routing into the 10 weeks. Use the A–D mockup format for visual decisions, honor unbounded mode (no badges/streaks/%), resolve the youth-palette-vs-canonical-visual-system question, and stop at the spec for my sign-off before any code.
