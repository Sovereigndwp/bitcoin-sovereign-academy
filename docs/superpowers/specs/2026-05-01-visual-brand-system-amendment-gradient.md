# Visual Brand System — Amendment: Gradient permitted in 3 surfaces

**Status:** Draft, awaiting sign-off
**Date:** 2026-05-01
**Amends:** [`docs/superpowers/specs/2026-05-01-visual-brand-system-design.md`](2026-05-01-visual-brand-system-design.md) §3.1
**Scope:** Cross-repo — BSA, FSA, hub
**Predecessor:** Live prototype on `about.html` (commit `642657f9`, deployed 2026-05-01) — user-reviewed and approved

---

## 1. Why this amendment exists

User feedback 2026-05-01 on solid-orange brand: *"my pages look too similar to every other created webpage."* The original locked spec §3.1 prohibits gradients in standard usage:

> "No gradients in the standard system. Gradient reserved for future ceremonial moments (course completion, milestone unlocks) — not standard ornament."

That prohibition was driven by Principle 3 (*"Restraint over saturation"*) and a real design risk — gradients are the 2020-2024 SaaS visual cliché. But solid orange alone is the de-facto Bitcoin-education visual default; every Bitcoin site looks similar.

This amendment relaxes the gradient prohibition for **3 specific surfaces** while preserving Principle 3 everywhere else. Gradient becomes a "brand signal," not a "brand wash."

## 2. The rule (replaces §3.1 paragraph 2)

| | Old (locked 2026-05-01) | New (this amendment) |
|---|---|---|
| Standard gradient usage | Prohibited everywhere | **Permitted on 3 surfaces only** — card outlines, icon strokes/fills, headline text (h1/h2/h3) |
| Ceremonial gradient usage | Permitted (course completion, milestones) | Permitted (unchanged) |
| Solid accent usage | Everywhere except ceremonial | Everywhere except the 3 permitted gradient surfaces |

**Explicit prohibitions remain (§5 below).** Gradient is NEVER used for backgrounds, body text, links, buttons, or dividers.

## 3. Gradient values (locked)

### 3.1 Bitcoin contexts (BSA)

```css
--brand-gradient: linear-gradient(135deg, #f7931a 0%, #ffd700 100%);
```

- **`#f7931a`** — Bitcoin orange, anchors Bitcoin identity (already locked accent in §3.2 of original spec)
- **`#ffd700`** — gold, NEW endpoint introduced by this amendment. Not a primary palette token; only used as gradient terminus.
- **135°** — diagonal top-left to bottom-right. Most natural for icons, cards, and reading flow.

### 3.2 Financial contexts (FSA)

```css
--brand-gradient-financial: linear-gradient(135deg, #0d9668 0%, #6ee7b7 100%);
```

- **`#0d9668`** — financial emerald (locked decorative in §3.2 of original spec)
- **`#6ee7b7`** — mint (locked text-on-dark in §3.2 of original spec)
- Symmetric structure to BSA gradient. Both endpoints already in palette — no new color introduced.

### 3.3 Hub (umbrella)

- **Default:** uses BSA gradient on hub-level surfaces (Bitcoin orange anchors the umbrella per existing convention)
- **Per-section override:** within hub's BSA card, use BSA gradient. Within hub's FSA card, use FSA gradient. Reinforces brand-domain separation.

## 4. Permitted surfaces (whitelist)

### 4.1 Card outlines

Use the **layered-backgrounds** technique. `border-image` doesn't play with `border-radius` cleanly — this technique does:

```css
.gradient-card {
  border: 1.5px solid transparent;
  background:
    linear-gradient(var(--card-bg), var(--card-bg)) padding-box,
    var(--brand-gradient) border-box;
  border-radius: 0.75rem;
}
```

- Border weight: **1.5px–2px** (1.5px on smaller cards, 2px on hero/feature cards)
- The `--card-bg` token must match the card's solid background — different per surface (dark mode vs. light mode)
- Inner card content uses normal solid styling. Gradient appears only as the visible border.

### 4.2 Icon strokes / fills

Define gradient ONCE per page in a hidden SVG `<defs>` block at the start of `<body>`:

```html
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <defs>
    <linearGradient id="brand-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f7931a"/>
      <stop offset="100%" stop-color="#ffd700"/>
    </linearGradient>
  </defs>
</svg>
```

Then each visible SVG icon references it:

```html
<svg viewBox="0 0 24 24" fill="none" stroke="url(#brand-gradient)" stroke-width="1.5" ...>
```

For filled shapes within an icon (e.g., Security First inner diamond): `fill="url(#brand-gradient)"`.

For FSA pages: same pattern with `#brand-gradient-financial` defs and reference.

### 4.3 Headline text (h1, h2, h3)

Use **`background-clip: text`** with transparent fill:

```css
h1, h2, h3 {
  background: var(--brand-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: var(--primary-orange); /* fallback for browsers without bg-clip:text */
}
```

- **Apply to h1, h2, h3 only.** Not h4–h6 (typographic hierarchy preserved by keeping smaller headings solid).
- **Always provide a solid fallback color** matching the surface (BSA: `var(--primary-orange)`; FSA: `var(--fsa-green-dark)`).
- **Eyebrow / label text** (uppercase 0.7–0.875rem above h1) stays solid — gradient text on small caps loses readability.

## 5. Prohibited surfaces (preservation list)

Solid color stays. Gradient is **never** used on:

| Surface | Why |
|---|---|
| Backgrounds (cards, hero, page, sections) | Per user direction 2026-05-01: "no background gradients" |
| Body text, paragraphs | Readability + accessibility |
| Eyebrows, labels, captions | Small text on gradient = unreadable |
| Links (inline text links) | Affordance — solid color signals "click me" |
| Buttons (CTA, primary, secondary) | Solid orange button is brand-anchored; gradient button is "every SaaS" trope |
| h4, h5, h6 | Typographic hierarchy — gradient escalates visual weight |
| Dividers, horizontal rules | Decorative noise; solid line is cleaner |
| Borders that aren't card outlines | Same — solid is correct for utility borders |
| Inline icons (icons within text flow) | Use solid `currentColor` to match text |

## 6. Accessibility

- **Fallback colors** for `background-clip:text` browsers: BSA `#f7931a` (4.5:1 on dark surface ✓), FSA `#0d9668` (verify on each surface).
- **Gradient text contrast:** at large sizes (h1/h2/h3) both endpoints (`#f7931a`, `#ffd700`) pass WCAG AA on dark backgrounds. On light surfaces, the gold endpoint `#ffd700` may approach the 4.5:1 contrast threshold — verify per surface during cascade.
- **SVG gradient strokes:** stroke-width 1.5px keeps icons readable; gradient endpoints contrast adequately on both light and dark surfaces.
- **Decorative ARIA:** all gradient icons keep `aria-hidden="true"` (locked from sub-project #2.7 spec).

## 7. Cascade implications

| Sub-project | What this amendment changes |
|---|---|
| **#1 tokens.css** | Add `--brand-gradient` and `--brand-gradient-financial` as cross-repo tokens. SVG defs pattern documented as a per-page include. |
| **#2.7 Phase 2 (icon system)** | Each page added to the cascade gets the SVG `<defs>` block + the 4-CSS-class set (`.gradient-card`, gradient h1/h2/h3 rule, etc.). |
| **#3, #4, #5 (homepage redesigns)** | Designs assume gradient on the 3 permitted surfaces from day one. |
| **#6 (full visual cascade)** | Module / demo / path pages get the gradient applied to their h1/h2/h3 + any cards. The CSS pattern is portable; mostly a find/apply operation per page. |
| **#7 (footer rollout)** | No change — footers stay solid muted gray (preservation list). |

## 8. Risks

- **`#ffd700` is a new color** (BSA gradient terminus). Before cascade, audit for any place that already uses `#ffd700` for a different purpose (unlikely, but verify).
- **h4 inheriting from h3 styles.** Some pages may have `h3, h4 { ... }` shared rules. Cascade phase needs careful CSS audit so h4 doesn't accidentally pick up gradient text.
- **Card background variation.** The layered-backgrounds technique requires the inner background match the card's actual solid bg. On pages where cards sit on different surfaces (dark page section vs. light marketing section), the `--card-bg` token must adapt.
- **SVG defs id uniqueness.** If a page bundles multiple SVG systems, the id `brand-gradient` could collide. Recommend `bsa-brand-gradient` and `fsa-brand-gradient` if conflicts emerge in cascade.
- **External backlinks / printed materials.** Existing brand renderings (favicons, social images, printed materials) use solid orange. They stay — gradient is only on the 3 web surfaces. No external rebrand needed.

## 9. What stays from the original §3.1

This amendment relaxes ONE paragraph of §3.1. Everything else in §3 stays:

- §3.1 Single deep accent per content domain (Bitcoin = orange family, Financial = emerald family) ✓
- §3.1 Accent at 2–5% of visual surface (gradient counts as accent — same restraint applies) ✓
- §3.1 Three variants per accent family (decorative / text-on-light / text-on-dark) ✓
- §3.2 Semantic accents table ✓
- §3.3, §3.4 Light marketing palette + dark learning palette (unchanged) ✓
- §3.5 Semantic alerts (success / warning / error / info) — solid only, no gradient ✓
- §3.6 Surface mode assignment (light marketing vs. dark learning) ✓

## 10. Sign-off checklist

- [ ] §2 rule (gradient permitted on 3 surfaces only, replacing §3.1 paragraph 2) approved
- [ ] §3.1 BSA gradient (`#f7931a → #ffd700`, 135°) approved as locked
- [ ] §3.2 FSA gradient (`#0d9668 → #6ee7b7`, 135°) approved as locked
- [ ] §3.3 hub default (BSA gradient on umbrella surfaces, per-card override allowed) approved
- [ ] §4 permitted surfaces + implementation patterns accepted
- [ ] §5 prohibited surfaces (preservation list) accepted
- [ ] §6 accessibility plan reviewed
- [ ] §7 cascade implications acknowledged
- [ ] §8 risks acknowledged
- [ ] Green light to begin Phase 2 cascade (BSA homepage as the next highest-impact application)

Once signed off, this amendment is canonical. Future surfaces follow the gradient rule automatically. Cascade begins with BSA homepage h1/h2/h3 + path cards + proof blocks.
