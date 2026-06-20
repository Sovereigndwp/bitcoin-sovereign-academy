# Handoff Spec: First Principles deep-dive system

Covers the four pages in `deep-dives/first-principles/` (hub + flagship + 2 dives) as built on
the canonical deep-dive system. Stack: static HTML, vanilla JS, no build step. Styling consumes
`/css/tokens.css`; interactives use the shared `.ddlab` library (`/css/deep-dive-lab.css` +
`/js/deep-dive-lab.js`). This doc also decides **what still needs to be created** (last section).

---

## Overview
Three research-style deep dives plus a lean hub. Each dive follows the arc: research question ->
why it matters -> current-system comparison -> Bitcoin mechanism -> tradeoffs -> interactive test
-> evidence -> steelman -> misconceptions -> sources -> reflect. Dark "learning surface" treatment.

## Layout
- Single centered column. `.dd .container` max-width 820px (dives) / 940px (hub), 24px/20px padding.
- One breakpoint at 680px (`@media (max-width:680px)`): container padding tightens; `.ddlab` and
  custom-lab control rows/readouts reflow to one column (engine + chrome both handle this).
- No multi-column grid except hub cards (`auto-fit, minmax(250px,1fr)`) and lab readouts
  (`auto-fit, minmax(130px,1fr)`).

## Design tokens used (all from `/css/tokens.css`, no new tokens)
| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | #16181C | Page background |
| `--color-surface` | #1F2024 | Cards, labs, ddlab body |
| `--color-border` | #2D2F35 | Hairline borders, table rules |
| `--color-text` | #F2F3F5 | Body text |
| `--color-text-strong` | #FFFFFF | Headings, strong |
| `--color-muted` | #A9AEB8 | Captions, intros, labels |
| `--color-brand` | #FF7A00 | Accent, links, eyebrows, left-borders |
| `--color-yellow` | #FFD400 | Gradient terminus, em accents |
| `--font-serif` | Source Serif 4 | h1/h2/h3, `.q`, lab/card titles |
| `--font-sans` | Inter | Body |
| `--font-mono` | JetBrains Mono | Eyebrow, labels, code, stat values |
| `--radius-sm` | 2px | All corners (cards, inputs, buttons) |
| ddlab: `--dd-good/--dd-mixed/--dd-bad` | #2FbF71 / #E8B23A / #E5564B | Matrix/calculator rating cells |

Heading gradient (h1): `linear-gradient(135deg,#FF7A00,#FF9A00 45%,#FFD400)` clipped to text.
Brand button: transparent fill, #FF7A00 text, 2px `border-image` gradient (#FF7A00->#FF9A00->#FFD400).

## Components
| Component | Where | Notes |
|-----------|-------|-------|
| Page chrome (`.dd` + `.dd .container/.eyebrow/.rq/.card/.lab/.toc/...`) | inline `<style>` per page | Currently duplicated per page (see backlog #1) |
| `.ddlab` calculator | all dives | Config-driven; custom formulas registered via `window.DeepDiveLab.formulas` then re-scan |
| `.ddlab` comparison-matrix / tradeoff-card / claim-checker / timeline-explorer | dives | Config-driven, from the shared engine |
| Live PoW miner (`#pow`) | flagship | Bespoke. Real synchronous SHA-256, chunked mining via setTimeout |
| Live signature lab (`#sig`) | flagship | Bespoke. Real WebCrypto ECDSA P-256 generateKey/sign/verify |

## States and interactions
| Element | State | Behavior |
|---------|-------|----------|
| Nav/brand button | hover | border-image gradient brightens; text -> #FFD400 |
| ddlab range/number input | input | recomputes outputs live; output cards re-render |
| PoW "Mine" | active (mining) | button disabled, "Stop" enabled, hash region shows rolling 16-char hash, attempts/rate/time tick per 2500-hash chunk |
| PoW | found | winning hash shown with leading zeros highlighted (#2FbF71), nonce filled, buttons reset |
| PoW | guard | stops after 8M hashes with "lower the difficulty"; "Stop" halts cleanly |
| Signature | step gating | Generate -> enables Sign; Sign -> enables Verify + Tamper; Verify/Tamper show VALID/INVALID |
| Signature | no WebCrypto | if `crypto.subtle` missing (e.g. non-secure context), shows a notice and disables the lab |
| ddlab claim-checker | expand | `aria-expanded` toggled, body reveals (engine handles) |

## Responsive behavior
| Breakpoint | Changes |
|------------|---------|
| > 680px | Default single column; lab readouts and ddlab forms in auto-fit grids |
| <= 680px | Container padding 16/14px; readouts and ddlab control grids collapse to 1 column; toc to 1 column. **Verify PoW/signature button rows wrap cleanly at 360-375px (untested on device).** |

## Edge cases
- Empty/again states: PoW resets to "Press Mine to start hashing."; signature resets log on re-generate.
- Long input: PoW block-data and signature message are free text; hashes/sigs are truncated to 20 chars + ellipsis in stat cells (`word-break:break-all` prevents overflow).
- Missing data: ddlab calculators ship sensible defaults; the issuance/security-budget/denarius formulas have baked-in schedules (no fetch dependency), so they render even offline.
- Slow/again: live BTC values bind via `data-btc-live` where present; static illustrative defaults otherwise (labelled).

## Animation / motion
| Element | Trigger | Animation | Duration | Easing |
|---------|---------|-----------|----------|--------|
| `.dive` card | hover | translateY(-2px) + border color | 200ms | default |
| brand button | hover | color/border transition | 200ms | default |
| PoW hash region | mining | text updates per chunk (not a CSS transition) | ~per 2500 hashes | n/a |
ddlab components honor `prefers-reduced-motion` (2 rules in deep-dive-lab.css). The bespoke labs
currently do NOT gate their rapid text updates on it (see backlog #4).

## Accessibility notes (current)
- Skip link present and functional on every page; single `<main id="main">`.
- Headings are ordered (h1 -> h2 -> h3); principle numbers are decorative `.pnum` spans.
- ddlab inputs are wrapped in `<label>`; claim-checker uses `aria-expanded`.
- Custom labs use real `<button>` and `<label for=...>` (keyboard-operable).
- GAPS (see backlog): no `aria-live`/`role="status"` on the PoW result, signature result, or
  calculator output regions, so screen readers are not told when mining finishes or a signature
  verifies/fails. No `aria-busy` during mining. Contrast of `#7f858d` tag text on `#1F2024` is
  borderline and should be checked against WCAG AA.

---

## What still needs to be created (decision + prioritized backlog)

Ranked. Items 1-4 are the ones I'd do before cascading this look to other deep-dive areas.

1. **Extract the duplicated page chrome into `/css/deep-dive-page.css`.** The `.dd` chrome
   `<style>` block is copy-pasted across all four pages (30-56 lines each). Pull it into one
   stylesheet that consumes `tokens.css`, the same way `deep-dive-lab.css` is shared. Payoff:
   every future deep dive (money-banking, austrian-economics, philosophy-economics, sovereign-tools)
   becomes a link + markup swap instead of a chrome re-paste. **This is the highest-leverage item.**
   - Sub-decision: fold the brand gradient-border button rule into this sheet (or into
     `deep-dive-lab.css`) so it stops being a per-page `!important` override.

2. **Decide the fate of the bespoke PoW + signature labs.** They are not `.ddlab` engine types
   (the engine has 7 types; these aren't among them). If they should be reusable in other dives
   (e.g. a mining or custody dive), promote them to first-class `.ddlab` types
   (`data-ddlab="proof-of-work"` / `"key-signature"`) inside `js/deep-dive-lab.js` +
   `css/deep-dive-lab.css`. If they're one-offs, leave them inline but move their CSS into item #1.
   Note: editing the shared engine touches the bitcoin-capital dive too, so add a render test for it.

3. **Add live-region accessibility to all dynamic results.** Put `role="status" aria-live="polite"`
   on the PoW hash/stat region and the signature result/log, and `aria-busy="true"` on the miner
   while running. Add the same to the ddlab calculator `[data-outputs]` region in the engine.
   Small change, real impact for screen-reader users; currently a genuine gap.

4. **Reduced-motion + mobile-device pass.** Gate the miner's rapid text refresh behind
   `prefers-reduced-motion` (update the final hash only, skip the rolling preview). Then test all
   four pages on a real 360-375px viewport: PoW/signature button rows, `lab__out` readout grids,
   and the hub card grid. I verified media queries exist but did not screenshot on device.

5. **Clean up artifacts.** Delete `deep-dives/first-principles/chart.umd.js` (unused after the
   ddlab rebuild) and the retired `css/deep-dive-editorial.css` (untracked; either delete or
   repurpose its content as the starting point for item #1). Retire the superseded
   `_drafts/render-test.mjs` and `_drafts/transform-oqe.py` (keep as history or remove).

6. **Contrast audit.** Check `#7f858d` (tags) and `#A9AEB8` (muted) on `#1F2024`/`#16181C` against
   WCAG AA (4.5:1 for body, 3:1 for large). Bump to a lighter muted token if any fail.

7. **Wire the `bsa:` graph metadata into the content graph.** Each page carries `bsa:` JSON-LD
   (teaches/repairs/bridges_to/upgrade_status) that the education-intelligence skills can consume,
   but nothing reads it yet. Out of scope for shipping these pages; flag for the graph work.

8. **Dependency, not a task:** the `project_token_consolidation.md` memory could not be opened
   (app-internal path). If it mandates a specific stylesheet/token approach, reconcile item #1
   against it before extracting.

### Suggested next-session order
#1 (extract chrome) -> #3 (a11y live regions) -> #5 (cleanup) -> #4 (reduced-motion + device test)
-> #2 (decide PoW/sig promotion) -> #6 (contrast) -> #7 (graph wiring).
