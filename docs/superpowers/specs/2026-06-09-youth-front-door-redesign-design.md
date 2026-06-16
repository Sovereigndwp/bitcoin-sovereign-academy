# Design Spec — Youth Front-Door Redesign (`youth-families/index.html`)

> **Status:** approved through brainstorming; ready for plan. **Date:** 2026-06-09.
> Implements the brief `docs/superpowers/specs/2026-06-07-youth-front-door-redesign-brief.md`.
> **Spec → sign-off → plan → code.** Do not ship code before Dalia signs off on this spec.

---

## 1. Problem statement + measurable success criteria

The Phase-4 youth-pedagogy audit (`reports/pedagogy-youth-audit-2026-06-06.md`) ranked `youth-families/index.html` the **#1 highest-leverage page** on the youth funnel (leverage 17.9). It scores **1/5** on Discovery, Curiosity, Retention, Capability-gain, Real-artifact, and Family-catalyst. Honest capability sentence today: *"the learner can browse and navigate to individual weeks but gains no new financial knowledge."* It is a **directory**: hero → stats → 10 week-cards → educator section. It routes but teaches nothing, and **fails the bright-12-year-old-solo test**.

**Goal:** the front door should **teach one thing and deliver a 60-second micro-win before it routes** — turning a table-of-contents into a reason to care — and work for a 12-year-old alone.

### Success criteria (what "good" looks like)

| Audit criterion | Now | Target after redesign | How the redesign delivers it |
|---|---|---|---|
| Discovery | 1 | ≥3 | A live, visceral experiment is the first interactive thing on the page |
| Curiosity | 1 | ≥3 | Predict→reveal gap ("you guessed X, here's what really happens") |
| Capability-gain | 1 | ≥3 | Learner leaves knowing *money loses value over time, and why scarcity matters* — a real, sticky mental model |
| Real-artifact | 1 | ≥3 | The experiment produces a personal result ("$1,040 → buys ~$X") the learner generated |
| Family-catalyst | 1 (≈1.90 cross-page) | ≥3 | First-class family + educator band with a take-home conversation prompt |
| Age-fit 12–14 | 2 | ≥4 | Grade-6 reading level; one decision at a time; no jargon before it's earned |

**Non-goals for this spec (scope guard):** this redesigns the **front-door page only**. It does **not** rewrite the 10 week lessons, cut/merge weeks, or physically migrate anything to FSA. Those are captured in §9 as the documented next phase. All 10 week routes and progress tracking are **preserved unchanged**.

---

## 2. Brand-architecture decision (context — approved)

The youth program is ~90% generic personal finance; only Week 3 is Bitcoin-native. It shares DNA with `programa-colombia` (already slated to move BSA→FSA per the 2026-06-09 content inventory). Decision (approved A–D, option **D**):

- **Canonical home = FSA** (beside programa-colombia, as the LATAM/family financial-literacy pillar), **fronted by TSA** (the umbrella router).
- **BSA keeps the Bitcoin bridge** — the inflation→hard-money moment is the on-ramp from the youth track into BSA's Bitcoin content.
- **Phasing:** redesign **in place in BSA now**, built **migration-ready**; the physical move to FSA + 301 redirects happens later, alongside programa-colombia, when FSA scaffolds. Nothing moves or breaks in this phase.

**Migration-ready requirements (so the later move is a lift-and-shift, not a rewrite):**
- Absolute CSS paths only (`/css/brand.css`, `/css/tokens.css`, `/css/design-tokens.css`) — never relative.
- No BSA-only runtime dependency in the front door. The micro-win's live data uses the public mempool.space endpoint directly (already how Week 3 does it), not a BSA-internal API.
- Self-contained page; localStorage keys namespaced `yf-*` (already are) carry over.

---

## 3. Visual system (approved: Dark)

Use the **homepage/TSA dark system** — already what this page, TSA, and the BSA homepage use. No new design tokens; extend existing.

- Surfaces: `--dark-bg #16181C`, `--card-bg #101013`, borders `#2a2d34`.
- Accent: orange→yellow gradient (`#FF7A00`→`#FFD400`) **used sparingly** (CTA, eyebrow, the live "melt" bar). White (`#F7F7F2`) is default text.
- Type: Inter (sans) + JetBrains Mono (labels/numerics). Rectangular cards, 2px-ish corners, outline secondary buttons.
- **No green, no purple** (both prior unaccepted drift). The one exception already in the codebase: a muted "live data" status dot may use the success token — keep it subtle.
- **Cream accent:** the family/educator band is a single **cream-inversion band** (`#F4ECD8` / ink `#1a160f` / gold `#C8922A`), mirroring TSA's family-card pattern — the only cream on the page, to make the parent/educator path visually distinct.

References read: `os.thesovereign.academy` (editorial-asymmetric hero, mono labels), TSA hub `the-sovereign-academy/hub/index.html` (the family-card cream-inversion and hero split this page should echo).

---

## 4. Page layout (approved: B — editorial split)

Top-to-bottom structure:

1. **Header** — existing logo + light nav (keep; ensure logo gradient uses brand tokens, no leftover green).
2. **Hero — editorial split (2-col, stacks on mobile):**
   - **Left:** mono eyebrow (`— Money, before it costs you`) · headline *"Learn how money really works — before it costs you."* · 2-line promise (*"A 60-second experiment, then 10 weeks of real money skills you can use this week. Built so a 12-year-old can start alone."*) · primary CTA **Try the experiment →** (scrolls/focuses the micro-win) + secondary **See the 10 weeks** · trust line (*no login · nothing to install · your progress stays on your device*).
   - **Right:** the **live micro-win card** (§5), above the fold.
3. **The 10-week path** — the existing 10 week-cards, restyled to the dark system and labeled "one connected plan, not 10 pages." **All 10 routes preserved.** This replaces the current `program-stats` band (the stats add nothing — cut).
4. **Family + educator band** — cream-inversion band: *"Doing this with your family or class?"* with a take-home conversation prompt line, plus two entries: **For families** (how to do it together at home) and **For educators** (links existing `educator/` + the HubSpot training call). This satisfies the family-catalyst criterion and the brief's family-hub requirement.
5. **Footer** — corrected to the locked convention (§7).

Mobile: hero stacks promise → micro-win → CTAs; weeks become a single column; family band full-width.

---

## 5. The micro-win (approved: MW-A — inflation-melt)

A self-contained, ~60-second **predict → reveal → bridge** interaction. Reuses and adapts Week 3's working engine (`/js/youth-engine.js` + the live-supply verify card); the front-door version is a trimmed, single-screen variant.

### Interaction flow
1. **Prompt:** *"You save **$20 every week** for a year and never touch it. After a year, will it buy more, the same, or less?"*
2. **Predict:** three chips — `more` · `same` · `less`. Learner must pick before the reveal (predict-then-measure; locks engagement and creates the curiosity gap).
3. **Reveal (the "melt"):** a $1,040 "saved" amount is shown; an animated bar/desaturation shows purchasing power eroding to roughly **$1,040 × (1 − r)** over the year, where `r` is a **recent, cited inflation rate** held in a single configurable constant with a source comment (e.g. a recent US CPI YoY figure). The number is framed as illustrative, not a forecast. Result line: *"$1,040 saved → buys about $X of stuff."*
4. **Name it:** *"That's **inflation** — money slowly buying less."* (Concept is *experienced first, named second* — age-band pedagogy.)
5. **Bridge (the Bitcoin on-ramp):** a live card — *"One kind of money is built so no one can make more of it: only **21,000,000** bitcoin will ever exist."* The **21M / current-supply figure is fetched live from mempool.space** (as Week 3 already does), sanitized via `safeInt()`. CTA: *"See how that works →"* → routes to **Week 3 (Saving + scarcity)**, which holds the fuller Bitcoin/21M treatment and is the natural next step (the BSA bridge).
6. **Route on:** primary CTA becomes **Start Week 1 →**; the result persists to `localStorage` (`yf-microwin`) so a returning learner sees their prior result.

### Truth / honesty constraints (per global rule "verify truth of content")
- The inflation rate `r` must be a **real, sourced figure** (comment the source + date); never invented. Prefer framing as predict→measure with a labeled, dated rate over asserting a precise outcome.
- The 21M supply line is factual; the live current-supply number must come from a live source and be sanitized. Never hardcode a stale supply number.
- No claim that Bitcoin "beats inflation" or any investment-advice framing — inform, not convince. The bridge states the *scarcity property*, not a recommendation.

### Accessibility
- Keyboard-operable chips (`role="radio"` group), `prefers-reduced-motion` disables the melt animation and shows the end-state directly, AA contrast on all text (verify computed values, not screenshots), live-region announcement of the reveal.

---

## 6. Age-band plan (12–14, must pass solo)

- **Reading level grade ~6.** Short sentences, concrete nouns ($20, a year, buys less), no finance jargon before it's earned. "Inflation," "scarcity," "purchasing power" are each *experienced, then named* — never assumed.
- **One decision at a time** in the micro-win (single predict chip-set, not a form).
- **No dependence on US-specific context** in the front door (paychecks/FAFSA/credit live in later weeks, not here) — keeps it usable for the LATAM/family audience and the eventual ES port.
- Resolve the current **"ages 13–25" mismatch**: hero/meta reframed to *"for young people and their families,"* with the explicit promise *"built so a 12-year-old can start alone."* Remove the "13–25" and "schools, community centers, and libraries" framing from the hero (educator framing moves to the family/educator band).

---

## 7. Footer correction (locked convention)

Replace the current footer (`© 2026 The Sovereign Academy · Educational content only…`) with the locked convention:

> **Created by Dalia · bitcoinsovereign.academy**

Keep an "Educational content only · Not financial advice" line. Keep cross-property links if desired, but the attribution line is non-negotiable. (When the page later migrates to FSA, this becomes the FSA footer variant `Creado por Dalia · …` for ES.)

---

## 8. Benchmark-borrow + measurement

- **Code.org onboarding** — borrow the "do one real thing in the first 30 seconds" front-door pattern (the micro-win), *without* any badge/streak reward loop.
- **Brilliant curiosity hook** — borrow the predict-before-reveal mechanic (the chips), *without* importing gamified progress mechanics.
- **Unbounded mode (voice-spec §11):** NO quizzes, badges, streaks, XP, or completion %. The micro-win's "win" is intrinsic (you saw a true thing + generated a result), not a points hook. The existing Week-9 "Independence Quiz" and similar are out of scope here.

**Measurement (first-party only, `js/analytics.js`):**
- `microwin_view` (card in viewport), `microwin_predict` (chip chosen, which one), `microwin_reveal` (reached the melt), `microwin_bridge_click` (Bitcoin on-ramp), `week_start` (existing, per week).
- North-star for this page: **% of front-door visitors who complete the micro-win** and **% who then click into any week**. No third-party trackers; anonymized.

---

## 9. Downstream (NOT in this spec — documented so it isn't lost)

These were decided in brainstorming but belong to later phases:

- **Content sourcing for the weeks** (future youth-program work): keep BSA Week 3 (Bitcoin bridge), Week 1 (needs/wants game), Week 6 (spending traps) + the `youth-engine` infra; borrow FSA's compound-growth + budget-tracker + debt-payoff *engines* under a youth vocabulary wrapper; borrow Colombia's `experimento-dos-economias` (canonical copy = BSA) + the predict→consequences→reflect shell + cross-week shared-state engine.
- **Cut/merge candidates:** Week 8 (FAFSA, US-adult), Week 10 (multi-gen wealth, adult); merge Week 7; rebuild text-only Weeks 2 & 4.
- **Migration to FSA:** move youth-families + programa-colombia together to FSA, 301 from BSA, add to the TSA hub router — when FSA scaffolds.

---

## 10. Constraints honored (checklist)

- [x] `yf-progress` + `yf-visits` localStorage preserved (untouched).
- [x] All 10 week routes preserved; no path removed.
- [x] No rebuild-from-scratch; redesign the existing page.
- [x] "Ages 13–25" vs 12-year-old-solo mismatch fixed.
- [x] Footer corrected to `Created by Dalia · bitcoinsovereign.academy`.
- [x] Absolute CSS paths only; migration-ready.
- [x] Dark/homepage system; no new tokens; no green/purple.
- [x] Unbounded mode (no quizzes/badges/streaks/%).
- [x] Content truth: inflation rate sourced+dated; live supply sanitized; no investment advice.
- [x] Data-attribute auto-init pattern for any new interactive component; verify with before/after screenshots + computed-contrast checks.
