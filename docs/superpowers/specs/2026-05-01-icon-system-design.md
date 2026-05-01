# Icon System — design spec

**Status:** Draft, awaiting sign-off
**Date:** 2026-05-01
**Sub-project:** #2.7 of the makeover arc (replaces emoji decorations site-wide)
**Scope:** Cross-repo — BSA, FSA, hub
**References (locked):** [`docs/superpowers/specs/2026-05-01-visual-brand-system-design.md`](2026-05-01-visual-brand-system-design.md) §7.4 (icon principle), `assets/dalia/` (logo system geometry)
**Predecessor:** Track 3 step 1 stripped emojis from `about.html` as a preview (commit `2ab97bff`)

---

## 1. Why this exists

Generic emoji icons (🎓, 🎯, 📚, 🛠, 🔒, 🤝, 🌍, etc.) are the visual fingerprint of *every* tech-education site. Using them flattens the brand into the indistinguishable middle. The locked visual brand system spec §7.4 commits to **"minimal SVG, 1.5px stroke, single accent color, 24×24 default"** for icons — but the actual icons haven't been built yet. This spec defines the icon system and the cascade plan.

The user's reaction to `about.html` (2026-05-01): *"these standard emojis are not in my brand or sites."* That instinct aligns with §7.4. This sub-project executes it.

## 2. Brand language — two-tier design

### Tier 1 — Geometric primitives (brand-anchor icons)

For the highest-visibility brand moments (hero proof blocks, value-card icons, section anchors on strategic pages), icons are drawn from the **locked diamond/stroke logo geometry** (`assets/dalia/`).

The locked logo system establishes:
- **Diamond** = BSA mark
- **Stroke** = Dalia mark
- **Combined** = umbrella

Tier 1 icons use the same geometric primitives — rotated diamonds, parallel strokes, ghost shapes, internal segments — to express concepts. They become a brand-private symbol family. Nothing else on the internet has them.

**Estimated count:** 8–12 Tier-1 icons. Used sparingly — the most-visible slots.

### Tier 2 — Minimal SVG outlines (utility icons)

For utility slots (section header decorations, list bullets, callout markers, smaller UI signals), icons are clean monochromatic SVG outlines per locked spec §7.4: **24×24, 1.5px stroke, `currentColor` fill, single accent color**.

Tier 2 icons are not brand-private — they look "clean modern outline" but don't try to be unique. They're scaffolding.

**Estimated count:** 15–25 Tier-2 icons.

## 3. Tier 1 — geometric primitives (specifications)

### 3.1 Visual language

Icons are derived from the locked diamond:
- **Diamond proper** (50×4 to 50×96, with 4×50 left vertex and 96×50 right vertex)
- **Stroke** (1.5–2px lines crossing or framing the diamond)
- **Ghost diamond** (lighter-weight outline of same shape)

Concept-to-geometry mapping:
- **"Mastery"** → diamond solid + stroke through center (locked logo)
- **"Practice / Build"** → diamond outline + 3 internal vertical strokes (suggesting a workbench / hammer)
- **"Security / Custody"** → diamond outline + diamond inside (nested protection)
- **"Open / Accessible"** → diamond split into 2 halves with light gap (open seam)
- **"Community / Together"** → 3 ghost diamonds slightly overlapped
- **"Vision / Future"** → diamond with eye-shape lens (vertical ellipse) inside
- **"Approach / Method"** → diamond + 3 horizontal strokes ascending (steps)

(Specific glyph design happens during prototype, not pre-committed in this spec.)

### 3.2 Sizes

- **Hero / value-card:** 48×48 (or larger, fluid to 64px on wide displays)
- **Section anchor:** 32×32
- **All retain the diamond's 90° rotation orientation** so the family reads coherently.

### 3.3 Color treatment

- Single accent color per surface mode:
  - Light marketing → bitcoin-orange `#f7931a` (BSA contexts) or financial-emerald `#0d9668` (FSA contexts)
  - Dark learning → same accents (sit on dark surface unchanged)
- No gradients in standard usage. Gradient reserved for ceremonial moments (locked spec §3.1).

## 4. Tier 2 — minimal SVG outlines (specifications)

### 4.1 Token format

```html
<svg class="icon icon-{name}" width="24" height="24" viewBox="0 0 24 24" 
     fill="none" stroke="currentColor" stroke-width="1.5" 
     stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <!-- path data -->
</svg>
```

`aria-hidden="true"` because icons are decorative — accompanying text carries semantics.

### 4.2 CSS

```css
.icon {
  display: inline-block;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  vertical-align: middle;
  color: currentColor;
}
.icon-lg { width: 32px; height: 32px; }
.icon-xl { width: 48px; height: 48px; }
.icon-accent { color: var(--color-brand, var(--primary-orange, #f7931a)); }
.icon-financial { color: var(--accent-financial-decorative, #0d9668); }
```

`color: currentColor` makes icons inherit text color by default — drop in `.icon-accent` for the brand-orange override.

### 4.3 Source library — pinch / build / both?

- **Build all from scratch.** Reject icon libraries (Lucide, Phosphor, Heroicons, Feather) — they're recognizable. The whole point is brand uniqueness.
- **Reference for geometry** but redraw to match Tier 1's stroke weight (1.5px) and rounded line caps.
- **No third-party SVG sets** in the production repo.

## 5. Inventory — current emoji usage (categories, not exhaustive)

Audit on BSA strategic pages identified these clusters:

| Category | Examples | Tier | Action |
|---|---|---|---|
| Page-title decoration | 🎓 (about), 💰 (FSA homepage), ₿ (logos) | — | **Eliminate** (no functional value; nav already conveys page) |
| Section header | 🎯 Mission, 📚 Approach, 🌍 Vision, ⚡ Membership | T1 | Replace with Tier-1 geometric primitives |
| Value-card icon | 🔓 Open, 🛠️ Practical, 🔒 Security, 🤝 Community | T1 | Replace with Tier-1 geometric primitives |
| Hero proof block | ⚡ 20-min, 🛡️ Practice safely, 🎯 Real-world | T1 | Replace with Tier-1 geometric primitives |
| Functional UI arrow | →, ↗ | — | **Keep** (functional, not decoration) |
| Audience flag | 🇨🇴 Colombia | — | **Keep** (accuracy, not generic) |
| Brand signal | ⚡ used as Bitcoin-energy callout | T1 | Replace with Tier-1 (stylized lightning from diamond geometry) |
| List bullet | • | — | **Keep** OR replace with Tier-2 stroke variant if pattern emerges |
| Callout / asterisk | ✦ ✓ | T2 | Replace with Tier-2 outline equivalents |
| Logo emoji | ✨ 🚀 (random decorations) | — | **Eliminate** wherever they appear |

A full per-file inventory happens during cascade phase (sub-project #6 cascade-inventory spec).

## 6. Cascade order

| Phase | Files | Why this order |
|---|---|---|
| **Prototype** | `about.html` (BSA) | User-flagged page; small surface; existing emoji-stripped state ready for SVG insertion. Visual sign-off here gates the rest. |
| **Strategic homepages** | BSA `index.html`, FSA `index.html`, hub `index.html` | Highest-traffic, highest-visibility. Locked-identity meta already done in #2.5 cleanup. |
| **Strategic interior** | BSA `dalia/`, `institutional/*`, FSA `my-journey.html`, hub `directory.html`, hub `institutional/index.html` | Full strategic-page coverage. |
| **Module / demo cascade** | All `paths/*`, `interactive-demos/*`, `modules/*`, `calculators/*` | Folded into sub-project #6 (full visual cascade). |

**Phases 1–3 run as their own commits within #2.7. Phase 4 absorbs into #6.**

## 7. What gets eliminated outright

These have no semantic value and won't be replaced:

- **🎓 in page titles** — page navigation conveys the page is "About"; the emoji is pure ornament.
- **Random ✨ 🚀 ⭐** decorations in CTAs / headers — sales-pitch ornament that the brand voice rejects ("inform-not-convince").
- **Stacked emoji decorations** (e.g., "🎯 🚀 ⚡ Master Bitcoin!") — the entire pattern.

## 8. Open questions / decisions deferred

1. **Tier 1 design direction sign-off.** §3.1's concept-to-geometry mappings are sketches. Final Tier 1 icons need user review *before* the cascade ships. Recommend: Dalia (or commissioned designer) executes the 8–12 Tier 1 icons; Claude executes Tier 2.
2. **`assets/dalia/` integration.** Tier 1 icons could live alongside the logo system (`assets/dalia/icons/`) since they share geometry. Or in a separate `assets/icons/` for cleaner separation. Defer to prototype.
3. **Audience flag (🇨🇴) treatment.** Currently the only flag emoji. If more locales arrive (🇲🇽, 🇪🇸, 🇦🇷), do they stay as standard flag emojis or become custom geometric flags? Defer until 2nd locale ships.
4. **Tier 2 icon set quantity.** §2 estimates 15–25; will firm up during cascade. Build on demand, not speculatively.
5. **Animation register.** Locked spec §6.2 commits to pedagogical motion only where it teaches. Icons in this system are static by default; per-icon micro-animations (e.g., diamond unfolds on hover) are deferred to a separate sub-project if at all.

## 9. Risks

- **Tier 1 icons require design judgment beyond mechanical execution.** Geometric abstraction can become unreadable. Prototype on `about.html` value cards (4 icons) first; user signs off; THEN scale.
- **Cascade scope is large.** Estimated 50+ surfaces use emojis. Bulk find-replace is risky if any emoji is functional (e.g., 🇨🇴 must NOT be replaced). Cascade phase needs careful per-page review.
- **Performance — many inline SVGs.** Each icon is small (~200–500 bytes inline). For pages with 5+ icons, total inline cost is acceptable. For 20+, consider an SVG sprite. Defer optimization to cascade phase.
- **Accessibility.** Decorative icons get `aria-hidden="true"`. Functional icons (rare) need `<title>` or `aria-label`. Audit during cascade.

## 10. Cascade — what this spec feeds

| Sub-project | Inputs from this spec | Output |
|---|---|---|
| **#2.7 Phase 1 (prototype)** | §3, §4, §5 | 5 prototype icons applied to `about.html` value cards + page title; user sign-off |
| **#2.7 Phase 2 (strategic homepages)** | §3, §4, §6 | Cascade icons across 3 homepages |
| **#2.7 Phase 3 (strategic interior)** | §3, §4, §6 | Cascade across remaining strategic pages |
| **#6 Cascade (modules/demos)** | Token format + Tier-2 library | Module + demo + path emoji replacement folded into the visual cascade |

## 11. Sign-off checklist

- [ ] §1–2 brand language (two-tier system) approved
- [ ] §3 Tier 1 design language (geometric primitives from diamond) approved
- [ ] §4 Tier 2 token format + CSS approved
- [ ] §5 emoji inventory categories accepted
- [ ] §6 cascade order accepted (prototype → strategic homepages → strategic interior → module cascade absorbed into #6)
- [ ] §7 elimination-without-replacement list approved
- [ ] §8 open questions reviewed
- [ ] §9 risks acknowledged
- [ ] Green light to start Phase 1 prototype on `about.html`

**Once signed off:** Phase 1 begins by drafting 5 prototype icons (4 value-card + 1 page-title) for `about.html`. User reviews on local preview. Iterate. When happy, ship as a commit. THEN Phase 2 begins.
