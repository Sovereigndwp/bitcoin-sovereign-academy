# Brand Design System — Spec (for sign-off)

**Date:** 2026-06-07 · **Status:** awaiting Dalia's sign-off · **Then:** roll out site-wide
**Trigger:** brand pages drifted into off-brand **green** (youth track) and **purple** (deep-dives/es) themes Dalia never approved. This locks ONE visual system — the homepage — and the mechanism to apply + keep it.

> Sign off on this doc and `css/brand-consistency.css`, then I roll it out page-group by page-group (youth first) with before/after screenshots. **Nothing is restyled until you approve.**

---

## 1. Canonical source

**The homepage is the standard.** Values below are *measured from the rendered homepage* (`index.html` + `css/design-tokens.css` + `css/tokens.css`), not invented. The 2026-05-03 cream/serif "visual system" is **superseded** (kit pages were reverted to the homepage 2026-06-02; reaffirmed 2026-06-07) — it will be archived so it stops causing drift.

| Role | Value | Token |
|---|---|---|
| Page background | `#16181c` (near-black) | `--color-bg-primary` (extend to `#16181c`) |
| Card / surface | `#101010` | `--color-bg-secondary`/card |
| Secondary surface | `#2d2d2d` / `#3a3a3a` | `--color-bg-tertiary` |
| Text (default) | `#F7F7F2` (near-white) | `--color-text-primary` |
| Text (muted) | `#b3b3b3` | `--color-text-secondary` |
| Accent | orange→yellow `#FF7A00 → #FFD400 → #FFE600` | `--color-primary` + gradient |
| Border | neutral `#2a2a2a`; orange (alpha) only as accent | `--color-border-*` |
| Font | **Inter** / system sans | `--font-sans` |
| Mono | JetBrains Mono | `--font-mono` |

**Semantic colors are preserved, not touched:** success `#4caf50`/`#28a745`, error `#f44336`/`#dc3545`, info `#2196f3`, warning `#ff9800`, and the path-color system. These are meaning, not drift.

---

## 2. Usage rules (the part that was being violated)

- **Surfaces are black/gray. Always.** No green, no purple, no colored card backgrounds — ever.
- **Orange→yellow is an ACCENT, used sparingly:** main titles, a few small buttons, borders, small highlights. It is **not** a fill for cards or most buttons, and **not** the color of body text or every label.
- **Text is white/near-white by default.** Body copy, card labels, list items → `#F7F7F2`/`#b3b3b3`. Reserve orange for headings/accents only.
- **Rectangular.** Cards, buttons, inputs → ~2px radius. No `0.75rem`/`1rem` rounded corners.
- **Buttons are outline style** (transparent bg + 2px orange border + white or orange text on dark). **Never** solid-orange/gradient *fill* with faint same-color text — that's the unreadable button bug (white-on-orange ≈ 2.6:1; dark-on-yellow invisible).
- **Clean & modern layout:** smaller titles (hero ≤ ~1.85rem, section ≤ ~1.3rem), wider columns, good space utilization — a mix of **two-column** sections and **full-width** text, not a narrow centered column with oversized titles and empty sides.

## 3. Type scale (smaller, consistent)

| Use | Size | Weight |
|---|---|---|
| Page/hero title | 1.75–1.9rem | 700 |
| Section title | 1.2–1.35rem | 700 |
| Body | 1rem | 400 |
| Small/label | 0.85–0.9rem | 600 |

(Backed by `--font-size-*` tokens already in `design-tokens.css`.)

## 4. Components

- **Card:** bg `#101010`, border `1px #2a2a2a`, radius 2px, padding ~1.5rem. Heading orange, body white/muted.
- **Button (primary):** transparent bg, `2px solid var(--color-primary)`, text `#F7F7F2`, radius 2px; hover = subtle orange wash. **(secondary):** same with lower-alpha border.
- **Inputs:** `#101010` bg, `#2a2a2a` border, radius 2px, white text.
- **Accent strip / title underline:** the orange→yellow gradient — sparingly.

## 5. The stylesheet — `css/brand-consistency.css`

Provides, on top of the existing tokens (does **not** duplicate them — per "never introduce new tokens, extend"):
1. **Canonical primitives** — `body` surface/text/font defaults, `.bsa-card`, `.bsa-btn`/`.bsa-btn-primary` (outline), input styling, a type-scale + spacing utility set.
2. **A drift-neutralization layer** (opt-in by loading the sheet last) — remaps the *known* off-brand page-local variables and hardcoded drift to the canonical palette so adopting pages lose their green/purple without per-line surgery:
   - youth vars `--primary-green`→accent, `--dark-bg`/`--card-bg`→surfaces, green hexes (`#10b981/#059669/#1a3a2e/#0a1f1a`) and purple (`#9C27B0/#7B1FA2`) → tokens, via targeted `!important` rules.
   - forces rectangular radius + white-text default on common card/button/section classes.

## 6. Rollout (after sign-off) — by page-group, verified

1. **Youth track (12)** — reference implementation. Shared `:root`, so adoption is clean. Screenshot each.
2. **Path entry + free modules** (`/paths/**`).
3. **Deep-dives** (incl. the purple es/money pages).
4. **Interactive demos** (50+).
5. **Standalone** (institutional, certificates, tools).

Each group: load `brand-consistency.css`, remap that group's local vars/drift to tokens, **verify computed contrast + before/after screenshots** (Dalia spots unreadable text instantly), commit per group.

## 7. Method rules (don't repeat the mistakes)

- **No blind hex find-replace.** Map by **role** (surface vs accent vs text), never one hex→one hex globally — that turns purple *cards* into orange *cards* instead of gray.
- **Preserve semantic colors** (success/error/info/warning/path).
- **Verify, don't assume** — `preview_inspect` computed colors + screenshots before claiming a page done.

## 8. Sign-off checklist

- [ ] Palette + "orange sparingly / white text default" rules correct?
- [ ] Rectangular + outline buttons correct?
- [ ] Type scale (smaller titles) + layout direction (wider, two-col + full-width) correct?
- [ ] `css/brand-consistency.css` approach (primitives + drift-neutralization) acceptable?
- [ ] Rollout order acceptable (youth first)?
