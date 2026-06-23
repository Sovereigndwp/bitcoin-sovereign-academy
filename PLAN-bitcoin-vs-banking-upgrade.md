# IMPLEMENTATION PLAN: Bitcoin vs Banking tradeoff simulator (v1)

Status: plan for sign-off. No code written. No tool modified. Nothing staged or committed.

Companion to `SPEC-bitcoin-vs-banking-upgrade.md` (now revised to keep cash out of v1). This plan describes how to build the three-rail tradeoff simulator inside the existing page without touching routes, gates, or surrounding infrastructure. It is a plan only; implementation waits for approval.

Scope reminder: V1 rails are Bank or card, Bitcoin self-custody, Bitcoin with a service provider. No cash. No altcoins. No advice. No real-time price or fee claims. No seed or key fields. No em dashes in shipped strings. EN/ES parity from the start.

---

## 1. Git branch recommendation

- Branch: `feat/bitcoin-vs-banking-tradeoff-sim`, created from a fresh `origin/main`.
- Because the repo runs many parallel worktrees on one checkout, create an isolated worktree off origin/main rather than editing the shared tree:
  - `git fetch origin`
  - `git worktree add .worktrees/btc-vs-banking -b feat/bitcoin-vs-banking-tradeoff-sim origin/main`
- One writer per working tree. Commit early on the feature branch so the work survives any parallel session. Do not branch or checkout on the shared tree while another session is active.
- No pushing, staging, or committing until the user asks.

## 2. File(s) to change

Primary, and ideally only:

- `interactive-demos/bitcoin-vs-banking/index.html` — rebuild the content inside `<main id="main-content" class="container">` and replace the inline `<script>` that currently runs `calculateCosts()`. Everything else in the file stays byte-for-byte.

Approach: keep the tool self-contained in `index.html` exactly as it is today (inline `<style>`, inline logic). This is the lowest-risk path because it adds no new file, no new route, and no new external `src`, so the mount contract and the QA "no external API / no hidden route" checks pass by construction. A sibling `simulator.js` is possible but rejected for v1 to avoid widening the surface; revisit only if the inline script grows hard to maintain.

New file (tests, additive, not part of the page):

- `tests/interactive-tools.bitcoin-vs-banking.test.mjs` — new `node:test` + jsdom test file (section 11).

Explicitly not changed: `vercel.json`, any gate or membership script, analytics, email, tip, demo-nav, reflect-widget, navigation-context, icon-library, config, demo-lock, subdomain-access-control. No CSS token files. No new design tokens.

## 3. Component structure

All within `#main-content`. Sections top to bottom, replacing the current header / level-switcher / calculator / table / pros-cons / use-cases / conclusion stack:

1. **Header** (reuse existing `.header`): new title and subtitle strings, and the core-question line. Keep the gradient style already in the file.
2. **Level switcher** (reuse existing `.level-switcher` and its `?level=` script verbatim). Only the per-level visibility of inputs and the matrix changes (section 8 of spec).
3. **Situation panel** (`#situation-form`): the ten input controls, grouped "The transfer" and "What you need" (section 4 below). Pure form, no submit button.
4. **Result header** (`#fit-summary`): one calm sentence naming the fit per rail, plus the persistent `no_winner_note` line.
5. **Rail scorecards** (`#rail-cards`): three cards, one per rail, each with band chip, "meets N of your M priorities" line, the per-priority met/partial/missed list, the explanation sentence, what-you-gain, what-you-give-up.
6. **Risk flags** (`#risk-flags`): zero or more short warnings for the current situation.
7. **Capability matrix** (`#capability-matrix`, advanced level only): the static three-rail matrix shown verbatim so a curious learner can audit the logic.
8. **Illustrative note** (`#illustrative-note`): the one-line disclaimer, always visible if any monetary figure is shown.
9. **Reflect widget**: existing block, only `data-title` copy updated (keep `data-topic="money"` unless a matching seed already exists).
10. **Back link** and all footer blocks: unchanged.

Internal logic modules (conceptual, all inside the inline script):

- `STATE`: current input values.
- `DIMENSIONS`: the eleven dimension keys.
- `CAPABILITY`: the rail-by-dimension matrix (section 6).
- `deriveActivePriorities(STATE)`: returns the active priorities with importance (section 5).
- `scoreRail(rail, priorities)`: returns band, metCount, partialCount, per-priority results.
- `buildExplanation(rail, result, lang)`, `buildFlags(STATE)`, `buildGainGiveUp(rail)`: string builders pulling from the dictionary.
- `render()`: reads STATE, recomputes, writes the DOM. Called on every input event and once on load.

## 4. Input controls

All controls are native elements (number input, button-group toggles styled as `.level-btn` siblings, or selects) for accessibility and zero dependencies. Each has a `<label>`, a one-line helper, and an `aria-describedby` to its helper. Defaults give a coherent first-load result with zero clicks.

Group A, "The transfer":
- `amount`: number input, default 1000, min 1. Units described as illustrative local currency, not a live price.
- `scope`: toggle, values `domestic` (default) and `cross_border`.
- `urgency`: 3-state, `days` (default), `within_day`, `now`.
- `horizon`: 3-state, `spend_soon` (default), `months`, `years`.

Group B, "What you need":
- `reversibility`: 3-state, `not` (default), `nice`, `essential`.
- `selfcustody`: 3-state, `not` (default), `nice`, `essential`.
- `privacy`: 3-state, `low` (default), `med`, `high`.
- `trust`: 3-state, `trust` (default), `mixed`, `distrust`.
- `polrisk`: 3-state, `low` (default), `med`, `high`.
- `techcomfort`: 3-state, `new` (default), `some`, `high`.

Level gating: beginner shows `amount`, `scope`, `urgency`, `selfcustody` and a simplified result; intermediate and advanced show all ten; advanced additionally renders the capability matrix. Hidden inputs keep their default value so scoring stays valid.

Each control fires `render()` on `input` or `change`. No `onclick="..."` inline handlers that depend on globals; attach listeners in the script for testability.

## 5. Input-to-dimension mapping

`deriveActivePriorities(STATE)` produces a set of `{ dimension, importance }` where importance is `matters` or `essential`. Rules (additive; the strongest importance wins if a dimension is set twice):

| Input and value | Activates dimension(s) | Importance |
|-----------------|------------------------|------------|
| reversibility = nice | reversibility | matters |
| reversibility = essential | reversibility | essential |
| selfcustody = nice | self_custody | matters |
| selfcustody = essential | self_custody | essential |
| selfcustody = nice or essential | censorship_resistance, settlement_finality | matters |
| privacy = med | privacy | matters |
| privacy = high | privacy | essential |
| polrisk = med | censorship_resistance, self_custody | matters |
| polrisk = high | censorship_resistance, self_custody | essential |
| trust = mixed | self_custody, settlement_finality | matters |
| trust = distrust | self_custody, settlement_finality | essential |
| scope = cross_border | borderless, low_cost_cross_border | matters |
| scope = cross_border AND amount >= 5000 (illustrative threshold) | low_cost_cross_border | essential |
| urgency = within_day | short_term | matters |
| urgency = now | short_term | essential |
| horizon = spend_soon | familiar_ux, short_term | matters |
| horizon = years | monetary_policy | essential |
| amount >= 5000 (illustrative threshold) | settlement_finality | matters |
| techcomfort = new | familiar_ux, short_term | matters |

Technical-comfort handling (no silent special-case): `techcomfort = new` simply activates `familiar_ux` and `short_term` as priorities. The self-custody rail is only `partial` on those, so its fit drops naturally. Separately, `selfcustody = essential` combined with `techcomfort = new` emits the `flag_no_recovery` risk flag rather than hiding the tension.

The illustrative amount threshold (5000) is a teaching device, documented in the UI helper as illustrative, never tied to a real fee or price.

## 6. Capability matrix

The fixed v1 matrix (`full` / `partial` / `none`), identical to the revised spec. This is the editorial core, shown verbatim at advanced level.

| Dimension | Bank / card | BTC self-custody | BTC w/ provider |
|-----------|-------------|------------------|-----------------|
| reversibility | full | none | partial |
| familiar_ux | full | partial | full |
| short_term | full | partial | full |
| settlement_finality | partial | full | partial |
| self_custody | none | full | none |
| censorship_resistance | none | full | partial |
| borderless | partial | full | full |
| monetary_policy | none | full | full |
| privacy | none | partial | none |
| recourse | full | none | partial |
| low_cost_cross_border | partial | full | full |

Honesty invariant (enforced by test): the bank rail is the sole `full` on `reversibility` and `recourse`, so situations that make those essential will rank the bank first.

## 7. Output logic

For each rail, `scoreRail` walks the active priorities:

- capability `full` on the dimension: priority is **met** (counts toward N).
- capability `partial`: priority is **partially met** (counts toward partial display; never fully satisfies an `essential`).
- capability `none`: priority is **missed**.

Band assignment per rail:
- **Poor fit** if the rail has `none` on any `essential` priority.
- **Workable** if it covers every essential at least partially but misses one or more `matters`, or meets an essential only partially.
- **Strong fit** if it meets every essential at `full` and meets the majority of `matters` at `full`.

Display per card:
- Band chip (`band_strong` / `band_workable` / `band_poor`).
- `meets_count` line: "Meets N of your M priorities", where M is the active-priority count and N is the fully-met count. If partials exist, append "plus K partially" using a parallel `meets_partial` key.
- The per-priority list with a met / partial / missed marker and the dimension's plain-language label.
- Explanation sentence from `buildExplanation`: names the strongest met priority and the most important missed priority, assembled from dictionary fragments so EN and ES stay parallel.
- What you gain: the rail's `full` dimensions among active priorities. What you give up: the rail's `none` dimensions among active priorities.

Ranking for the summary header: sort rails by band (Strong, Workable, Poor), then by N met, then by fewest essential misses. Ties are allowed and surfaced honestly ("both are a strong fit here"). The summary never uses the word "winner" and always shows `no_winner_note`.

Numeric safety: `amount` parsed with a fallback to the default when empty, NaN, negative, or non-finite. No division by user input. Counts are integers. No percentage with decimals anywhere.

## 8. EN/ES dictionary plan

- A single in-file constant `STRINGS = { en: {...}, es: {...} }`, seeded from the spec section 8 table plus the dimension labels, band labels, explanation fragments, gain/give-up labels, flag strings, and the illustrative and no-winner notes.
- Language selection: read an existing site language signal if one is already present on the page or in `localStorage`; otherwise default to `en` with a simple `?lang=es` override. Do not introduce a new global i18n framework and do not touch `js/i18n.js` (noted dead in memory).
- Every visible string flows through a `t(key, vars)` helper that interpolates `{n}`, `{m}`, `{k}` placeholders. No hardcoded user-facing text in the DOM-building code.
- Parity is a build-time invariant: the test diffs `Object.keys(STRINGS.en)` against `Object.keys(STRINGS.es)` and fails on any asymmetry.
- Explanation sentences are assembled from fragment keys (subject, because-clause, give-up-clause), never by string concatenation that would force English word order onto Spanish. Each fragment has both languages.
- No em dashes in any string in either language. En dashes allowed only inside numeric ranges.

## 9. Accessibility notes (WCAG 2.1 AA, matching existing demo standards)

- Every input has a programmatic `<label for>` and a helper referenced via `aria-describedby`.
- Toggle button-groups use `role="radiogroup"` with `role="radio"` and `aria-checked`, keyboard operable with arrow keys and Enter or Space. Reuse the existing `.level-btn` focus-visible styling.
- Live region: the result summary (`#fit-summary`) is an `aria-live="polite"` region so screen readers announce the new fit when an input changes, without stealing focus.
- Color is never the only signal: met / partial / missed use a text label or symbol plus color, not color alone (avoids the current table's check-vs-cross color-only pattern).
- Keep the existing skip-link, `:focus-visible` outlines, 44px minimum touch targets, and `prefers-reduced-motion` block already in the file.
- Contrast: keep body text at the existing high-contrast values; do not use gradient-clipped transparent text for any result string (verify computed contrast, not screenshots).

## 10. Mobile layout notes

- Reuse the existing breakpoints (`max-width: 968px`, `max-width: 360px`) and the demo-shell styles already linked.
- Input groups: two columns on desktop, single column under 768px. Button-group toggles wrap and stay 44px tall.
- Rail scorecards: three across on wide screens, stacking to one column under 968px. No fixed pixel widths; use the existing grid `minmax` patterns.
- Capability matrix (advanced): on narrow screens, allow horizontal scroll within its own container rather than forcing the page to overflow; never let the page scroll sideways (the `overflow-x: hidden` at 360px stays).
- No canvas, no SVG diagram in v1, so there is no responsive-viewBox risk.
- Verify at 360px, 768px, and desktop that nothing overflows and the live region still reads.

## 11. Test file plan

New file `tests/interactive-tools.bitcoin-vs-banking.test.mjs`, `node:test` + jsdom, matching the style of `tests/interactive-tools.measure-drift.test.mjs`. Where the scoring logic needs to be unit-tested in isolation, expose the pure functions (`deriveActivePriorities`, `scoreRail`) on a guarded global (for example `window.__bvbTest`) only when running under test, so production behavior is unchanged. Cases:

1. **Tool mounts.** Page parses under jsdom, `#main-content` exists, the ten inputs and three rail cards render, no script throws on load.
2. **Inputs update outputs.** Changing each input changes at least one rail result. Assert specifically: `reversibility = essential` raises the bank rail to at least the band of both Bitcoin rails; `polrisk = high` plus `selfcustody = essential` makes self-custody a Strong fit and triggers `flag_freeze` on the bank rail.
3. **Bank can win (honesty invariant).** With `reversibility = essential`, `selfcustody = not`, `horizon = spend_soon`, `scope = domestic`, the bank rail ranks first. Assert it.
4. **Bitcoin self-custody can win.** With `polrisk = high`, `selfcustody = essential`, `scope = cross_border`, `horizon = years`, `reversibility = not`, self-custody ranks first. Assert it.
5. **EN/ES key parity.** `Object.keys(STRINGS.en)` equals `Object.keys(STRINGS.es)`; fail on any difference.
6. **No em dashes.** Scan every string in both language dictionaries and the rendered DOM for U+2014; assert zero. En dashes in numeric ranges permitted.
7. **No NaN / Infinity.** Across a grid of input combinations including `amount` of 0, empty, very large, and negative, every numeric output is finite, every band is one of the three allowed values, and no "NaN" or "Infinity" string reaches the DOM.
8. **No external calls.** Source contains no `fetch`, `XMLHttpRequest`, `WebSocket`, or external `src` beyond the already-approved footer scripts.
9. **Mount contract intact.** The preserved scripts and links (config, demo-lock, subdomain-access-control, icon-library, navigation-context, reflect-widget, membership-gate, analytics, email-capture, tip-cta, demo-nav, the six stylesheet links, the back link) are still present, with no gate, analytics, email, or payment script added or removed.

Manual QA before any merge request: live preview console sweep with zero errors, keyboard-only pass (all inputs reachable, focus visible, live region announces), and mobile and desktop screenshots for the sign-off thread.

## 12. Exact safety boundaries

- **No financial advice.** Output describes tradeoffs only. No "you should", no allocation guidance, no "best investment" language.
- **No universal winner.** The UI must be able to rank the bank rail first; test case 3 enforces it. The summary never says "winner".
- **No real-time or real price and fee claims.** The tool makes zero network calls. Any monetary figure is round, obviously illustrative, and carries `illustrative_note`. The amount input drives only band logic, not a fee computation.
- **No custody instructions that move funds.** The tool never tells the learner to send, withdraw, or transfer anything.
- **No seed phrase or private key fields.** No input accepts a key, seed, address, or credential. There is no place to paste one.
- **No altcoins, no "crypto" framing.** The subject is Bitcoin and banking rails only.
- **No TBA insertion.** This page is not about collaborative security; do not add a TBA mention or upsell.
- **Honest tone in both languages.** Each rail has at least one genuinely positive line; the bank is treated as a reasonable choice for its strengths; Bitcoin self-custody names its real costs (no recovery, no chargeback, learning curve) plainly.

## 13. Acceptance checklist

- [ ] Route unchanged: `/interactive-demos/bitcoin-vs-banking/` still serves the same `index.html`.
- [ ] Mount contract intact: `#main-content`, `?level=` switcher, six stylesheet links, all footer scripts, reflect widget, email and tip blocks, back link, all present and unchanged.
- [ ] Exactly three rails (bank/card, Bitcoin self-custody, Bitcoin with provider); no cash; future-extension note only.
- [ ] Bank rail can rank first in at least one situation (test passes).
- [ ] Bitcoin self-custody ranks first where it is genuinely strongest (test passes).
- [ ] No external network calls; no new route, gate, analytics, email, or payment wiring.
- [ ] EN and ES dictionaries reach full key parity (test passes).
- [ ] Zero em dashes in shipped strings, comments, and this plan's outputs (test passes).
- [ ] No NaN or Infinity reaches the DOM under edge-case inputs (test passes).
- [ ] No seed, key, address, or credential field anywhere.
- [ ] No financial advice; no "winner"; illustrative figures labeled.
- [ ] Accessibility: labels, live region, keyboard-operable toggles, non-color-only status, 44px targets, focus-visible.
- [ ] Mobile: reflows to one column under 968px, no horizontal overflow at 360px.
- [ ] Reflect widget `data-title` updated; `data-topic` left as `money` unless a matching seed exists.

Next step after sign-off: build on the `feat/bitcoin-vs-banking-tradeoff-sim` worktree, commit early to the feature branch, and open for review. Do not start coding until this plan is approved.
