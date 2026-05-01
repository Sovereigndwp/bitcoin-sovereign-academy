# Tokens Migration — design spec

**Status:** Draft, awaiting sign-off
**Date:** 2026-05-01
**Sub-project:** #1 of the makeover arc (foundational — consumed by #2 onward)
**Scope:** Cross-repo — BSA, FSA, hub
**References (locked):**
- [`2026-05-01-visual-brand-system-design.md`](2026-05-01-visual-brand-system-design.md) — primary value source
- [`2026-05-01-visual-brand-system-amendment-gradient.md`](2026-05-01-visual-brand-system-amendment-gradient.md) — gradient values
- [`2026-05-01-icon-system-design.md`](2026-05-01-icon-system-design.md) — SVG gradient defs pattern
**Predecessor:** about.html prototype (commit `10283148`) — patterns tested live, ready to extract into shared tokens

---

## 1. Why this exists

The about.html prototype has these values **inline** in its `<style>` block:

```css
html { font-size: 13px; }
:root { --brand-gradient: linear-gradient(135deg, #f7931a 0%, #ffd700 100%); }
.values-grid { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
.mission-section { grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }
/* ... etc */
```

If I cascade the gradient + compact-layout pattern across the BSA homepage, FSA homepage, hub homepage, dalia/, institutional/, etc., these inline values get **copy-pasted 8+ times**. Drift inevitable.

This spec defines the shared `tokens.css` that:
1. Encodes every locked value as a CSS custom property (`--*` variable)
2. Replaces the existing fragmented BSA `brand.css` + `design-tokens.css` + inline-styles with a single source of truth
3. Migrates FSA's `--fsa-*` prefixed tokens to unprefixed shared names with backwards-compat aliases
4. Hub's all-inline-styling gets one shared CSS file via copied tokens

## 2. File structure decision

### 2.1 The choice: shared file with per-repo brand override

Three options were considered:

| Option | Description | Trade-off |
|---|---|---|
| **A** | Single `tokens.css` at hub repo, imported via CDN to BSA + FSA | No CDN dependency desired; hub becomes load-bearing |
| **B** ✓ | Each repo holds an identical copy of `tokens.css` + thin brand-override layer (`tokens-bsa.css`, `tokens-fsa.css`) | Source of truth in hub; sync via script |
| **C** | `tokens.css` per repo, drift accepted | Defeats unification (rejected) |

**Going with Option B.** Source-of-truth lives in hub repo at `sovereign-academy-hub/css/tokens.css`. BSA and FSA copy on update via `scripts/sync-tokens.sh`. Each consuming repo loads:

```html
<link rel="stylesheet" href="/css/tokens.css">              <!-- shared base -->
<link rel="stylesheet" href="/css/tokens-brand.css">        <!-- per-repo overrides -->
<link rel="stylesheet" href="/css/components.css">          <!-- consumes tokens (sub-project #2) -->
```

### 2.2 Sync script

`scripts/sync-tokens.sh` (lives in BSA + FSA, points to hub repo):

```bash
#!/bin/bash
# Copy hub canonical tokens.css into this repo
HUB_PATH="${1:-../sovereign-academy-hub}"
cp "$HUB_PATH/css/tokens.css" css/tokens.css
echo "✓ tokens.css synced from $HUB_PATH"
```

Run on demand. Failure mode: tokens drift if not run. CI check (sub-project #2 follow-up) can fail if `tokens.css` differs from hub canonical.

### 2.3 What NOT in tokens.css

- No component rules (those belong in `components.css`, sub-project #2)
- No `body { … }` defaults beyond `html { font-size: 13px }` (host repos own page-level mode setup)
- No font `@import` (loaded in repo `<head>` for preconnect control)
- No selectors beyond `:root` and `html` (everything else lives in components/page CSS)

## 3. Naming convention

### 3.1 Prefixed groups

| Prefix | Meaning | Example |
|---|---|---|
| `--lm-*` | Light marketing palette | `--lm-canvas`, `--lm-text-primary` |
| `--dm-*` | Dark learning palette | `--dm-canvas`, `--dm-text-primary` |
| `--accent-bitcoin-*` | Bitcoin orange family | `--accent-bitcoin-decorative`, `--accent-bitcoin-text-on-light` |
| `--accent-financial-*` | Financial emerald family | `--accent-financial-decorative`, `--accent-financial-text-on-light` |
| `--brand-gradient` | BSA gradient | `--brand-gradient` (BSA orange→gold) |
| `--brand-gradient-financial` | FSA gradient | `--brand-gradient-financial` (FSA emerald→mint) |
| `--type-*` | Typography | `--type-h1-marketing`, `--type-body`, `--type-eyebrow` |
| `--space-*` | Spacing scale | `--space-1` through `--space-24`, plus semantic aliases |
| `--width-*` | Layout max-widths | `--width-prose`, `--width-content`, `--width-default`, `--width-wide` |
| `--radius-*` | Border radius | `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-pill` |
| `--bp-*` | Breakpoints | `--bp-sm`, `--bp-md`, `--bp-lg`, `--bp-xl` |
| `--motion-*` | Transitions | `--motion-default`, `--motion-step` |

### 3.2 Backwards-compat aliases (deprecation window)

The cascade phase needs the OLD token names to keep working until consuming code is migrated. Aliases live alongside new tokens:

```css
:root {
  /* New canonical */
  --accent-bitcoin-decorative: #f7931a;

  /* Legacy aliases — REMOVE in cleanup phase post-cascade */
  --primary-orange: var(--accent-bitcoin-decorative);    /* BSA legacy */
  --color-brand: var(--accent-bitcoin-decorative);       /* BSA brand.css legacy */
  --fsa-green: var(--accent-financial-decorative);       /* FSA legacy */
}
```

Aliases marked with `LEGACY ALIAS` comment. Removal is a sub-project #6 (cascade) follow-on task.

## 4. Token categories — full token list

### 4.1 Typography baseline (NEW — amendment to original spec)

```css
html {
  font-size: 13px;  /* was 16px in original spec; reduced 2026-05-01 per user feedback */
}
```

**Effect:** every `rem`-based size in the type scale renders 19% smaller than the original spec's clamp() values resolve to. Headlines stay impactful but feel less heavy. Body close to the conventional 16px reading benchmark when viewed at default browser zoom.

### 4.2 Color — primitive

| Token | Value | Use |
|---|---|---|
| `--lm-canvas` | `#fafaf7` | Light marketing page bg (warm off-white) |
| `--lm-surface` | `#ffffff` | Cards, inputs, raised surfaces |
| `--lm-subtle` | `#f5f5f1` | Alt rows, code blocks |
| `--lm-border-subtle` | `#e5e7eb` | Default dividers |
| `--lm-border-strong` | `#d1d5db` | Input borders |
| `--lm-text-primary` | `#1a1f2e` | Body + headings |
| `--lm-text-secondary` | `#374151` | Supporting copy |
| `--lm-text-muted` | `#6b7280` | Eyebrows, captions |
| `--lm-text-faint` | `#9ca3af` | Placeholders, disabled |
| `--dm-canvas` | `#0b0e14` | Dark learning page bg |
| `--dm-surface` | `#121723` | Cards, raised surfaces |
| `--dm-subtle` | `#1b2433` | Alt rows, code blocks |
| `--dm-border-subtle` | `#202938` | Default dividers |
| `--dm-border-strong` | `#2d3748` | Input borders |
| `--dm-text-primary` | `#e6edf3` | Body + headings |
| `--dm-text-secondary` | `#cbd2da` | Supporting copy |
| `--dm-text-muted` | `#9aa4b2` | Eyebrows, captions |
| `--dm-text-faint` | `#6b7280` | Placeholders, disabled |

### 4.3 Color — accents

| Token | Value | Use |
|---|---|---|
| `--accent-bitcoin-decorative` | `#f7931a` | Bitcoin orange ≥3px non-text |
| `--accent-bitcoin-text-on-light` | `#b45309` | Bitcoin orange body text on light |
| `--accent-bitcoin-text-on-dark` | `#ffb347` | Bitcoin orange body text on dark |
| `--accent-financial-decorative` | `#0d9668` | Financial emerald ≥3px non-text |
| `--accent-financial-text-on-light` | `#047857` | Financial emerald body text on light |
| `--accent-financial-text-on-dark` | `#6ee7b7` | Financial emerald body text on dark |

### 4.4 Color — semantic alerts

| Role | Light | Dark |
|---|---|---|
| `--semantic-success` | `#059669` | `#10b981` |
| `--semantic-warning` | `#d97706` | `#f59e0b` |
| `--semantic-error` | `#dc2626` | `#ef4444` |
| `--semantic-info` | `#2563eb` | `#3b82f6` |

(Mode-specific value chosen at runtime via separate light/dark variant; defer mechanism to sub-project #2.)

### 4.5 Gradients

```css
--brand-gradient: linear-gradient(135deg, #f7931a 0%, #ffd700 100%);
--brand-gradient-financial: linear-gradient(135deg, #0d9668 0%, #6ee7b7 100%);
```

`#ffd700` is the new gradient terminus (gold) — only used as gradient endpoint, not as a primary palette token.

### 4.6 Typography scale

| Token | Value | Family | Weight |
|---|---|---|---|
| `--font-serif` | `'Source Serif 4', Georgia, serif` | — | — |
| `--font-sans` | `'Inter', system-ui, sans-serif` | — | — |
| `--font-mono` | `'JetBrains Mono', monospace` | — | — |
| `--type-h1-marketing` | `clamp(1.85rem, 4.5vw, 2.6rem)` | serif | 600 |
| `--type-h2-marketing` | `clamp(1.5rem, 3.5vw, 1.95rem)` | serif | 600 |
| `--type-h3` | `1.4rem` | sans | 600 |
| `--type-h4` | `1.1rem` | sans | 600 |
| `--type-lede` | `clamp(1.05rem, 1.8vw, 1.15rem)` | sans | 400 |
| `--type-body` | `1rem` | sans | 400 |
| `--type-small` | `0.875rem` | sans | 400 |
| `--type-caption` | `0.8rem` | sans | 400 |
| `--type-eyebrow` | `0.7rem` | sans | 500 |
| `--type-mono` | `0.85rem` | mono | 400 |
| `--type-h1-learning` | `1.85rem` | serif | 600 |
| `--type-h2-learning` | `1.5rem` | serif | 600 |
| `--type-h3-learning` | `1.2rem` | sans | 600 |
| `--type-body-learning` | `1rem` | sans | 400 |

(All `rem` values resolve at the new 13px html base — see §4.1.)

### 4.7 Spacing

| Token | px | rem |
|---|---|---|
| `--space-1` | 4 | 0.25 |
| `--space-2` | 8 | 0.5 |
| `--space-3` | 12 | 0.75 |
| `--space-4` | 16 | 1.0 |
| `--space-5` | 20 | 1.25 |
| `--space-6` | 24 | 1.5 |
| `--space-8` | 32 | 2.0 |
| `--space-10` | 40 | 2.5 |
| `--space-12` | 48 | 3.0 |
| `--space-16` | 64 | 4.0 |
| `--space-20` | 80 | 5.0 |
| `--space-24` | 96 | 6.0 |

Semantic aliases:

```css
--space-section-marketing: clamp(2.5rem, 5vw, 4rem);
--space-section-learning: clamp(1.5rem, 3vw, 2rem);
--space-component: var(--space-6);
--space-element: var(--space-4);
```

### 4.8 Layout

| Token | Value |
|---|---|
| `--width-prose` | `640px` |
| `--width-content` | `720px` |
| `--width-default` | `1100px` |
| `--width-wide` | `1280px` |
| `--bp-sm` | `480px` |
| `--bp-md` | `768px` |
| `--bp-lg` | `1024px` |
| `--bp-xl` | `1280px` |

**NEW grid minmax tokens** (from about.html prototype):

```css
--grid-mission-minmax: 260px;   /* 3-card mission rows */
--grid-values-minmax: 200px;    /* 4-card value rows */
--grid-card-gap: 1rem;           /* default card-grid gap */
--grid-section-gap: 1.5rem;      /* section-level grid gap */
```

### 4.9 Radius

| Token | Value |
|---|---|
| `--radius-sm` | `4px` |
| `--radius-md` | `6px` |
| `--radius-lg` | `12px` |
| `--radius-pill` | `999px` |

### 4.10 Motion

```css
--motion-default: 200ms cubic-bezier(0.4, 0, 0.2, 1);
--motion-step: 350ms cubic-bezier(0.4, 0, 0.2, 1);
```

## 5. Migration strategy

### 5.1 BSA dual-file consolidation

BSA has two parallel token files:
- `css/brand.css` — defines `--color-brand`, `--color-bg`, etc. (139 lines, includes some non-token rules)
- `css/design-tokens.css` — defines `--color-text-primary`, `--color-bg-primary`, etc. (225 lines)

Migration path:
1. **New file** `css/tokens.css` ships with all canonical tokens + legacy aliases pointing at new names.
2. **Existing files modified:**
   - `css/brand.css` — keep non-token rules (focus indicators, skip-link, demo-link). Remove `:root { ... }` block (now in tokens.css). Add `--color-bg: var(--dm-canvas)` etc. as aliases inside tokens.css instead.
   - `css/design-tokens.css` — remove `:root` token definitions, keep utility classes (`.text-primary`, `.shadow-sm`, etc.) — those are component-style, move them to `components.css` in sub-project #2.
3. **Page-level edits:** every `<head>` adds `<link rel="stylesheet" href="/css/tokens.css">` BEFORE other CSS files. Sub-project #6 cascade handles bulk.

### 5.2 FSA `--fsa-*` prefix migration

FSA uses fully prefixed tokens (`--fsa-green`, `--fsa-bg-dark`, etc.). The unprefixed canonical tokens go in tokens.css. Legacy aliases preserve backwards compatibility:

```css
:root {
  /* Canonical */
  --accent-financial-decorative: #0d9668;
  --dm-canvas: #0a1f1a; /* FSA-specific dark — keeps current FSA bg */

  /* FSA legacy aliases */
  --fsa-green: var(--accent-financial-decorative);
  --fsa-bg-dark: var(--dm-canvas);
  /* ... */
}
```

After cascade phase removes consuming code's reliance on `--fsa-*`, the aliases get dropped.

### 5.3 Hub all-inline migration

Hub currently has zero external CSS files (per visual brand spec §1: "ad-hoc inline styling"). Migration:
1. Create `sovereign-academy-hub/css/tokens.css` (canonical source)
2. Each hub HTML file adds `<link rel="stylesheet" href="/css/tokens.css">` to head
3. Inline `<style>` blocks reference tokens (`var(--accent-bitcoin-decorative)`) instead of hardcoded hex
4. Cleanup phase optionally extracts inline styles into a hub-specific `components.css` (defer)

## 6. Implementation order

| Step | Action | Risk |
|---|---|---|
| 1 | Create `sovereign-academy-hub/css/tokens.css` with all canonical tokens + aliases | None (additive) |
| 2 | Copy to `bitcoin-sovereign-academy/css/tokens.css` and `financially-sovereign-academy/css/tokens.css` via sync script | None (additive) |
| 3 | Add `<link rel="stylesheet" href="/css/tokens.css">` to about.html (the prototype page) — verify it loads + tokens render correctly | Low — about.html already has inline tokens that should match |
| 4 | Migrate about.html inline tokens to use `var(--*)` references | Low — values match canonical |
| 5 | Verify about.html visually unchanged | Critical |
| 6 | Cascade sub-project #2.7 Phase 2 with token-based CSS instead of inline | Phase 2 work |
| 7 | Sub-project #6 cascade migrates remaining 387 files | Bulk operation |

Steps 1–5 are tokens migration (this spec). Steps 6–7 are downstream sub-projects.

## 7. CSS implementation — `tokens.css` skeleton

```css
/* The Sovereign Academy — tokens.css
 * Canonical source: sovereign-academy-hub/css/tokens.css
 * Synced to bitcoin-sovereign-academy/ and financially-sovereign-academy/
 * via scripts/sync-tokens.sh
 */

html {
  font-size: 13px;
}

:root {
  /* === Light marketing palette === */
  --lm-canvas: #fafaf7;
  --lm-surface: #ffffff;
  /* ... full §4.2 list ... */

  /* === Dark learning palette === */
  --dm-canvas: #0b0e14;
  --dm-surface: #121723;
  /* ... full §4.2 list ... */

  /* === Accents === */
  --accent-bitcoin-decorative: #f7931a;
  --accent-bitcoin-text-on-light: #b45309;
  --accent-bitcoin-text-on-dark: #ffb347;
  --accent-financial-decorative: #0d9668;
  --accent-financial-text-on-light: #047857;
  --accent-financial-text-on-dark: #6ee7b7;

  /* === Gradients (per §4.5) === */
  --brand-gradient: linear-gradient(135deg, #f7931a 0%, #ffd700 100%);
  --brand-gradient-financial: linear-gradient(135deg, #0d9668 0%, #6ee7b7 100%);

  /* === Type === */
  /* ... full §4.6 list ... */

  /* === Spacing === */
  /* ... full §4.7 list ... */

  /* === Layout === */
  /* ... full §4.8 list ... */

  /* === Radius === */
  /* ... full §4.9 list ... */

  /* === Motion === */
  --motion-default: 200ms cubic-bezier(0.4, 0, 0.2, 1);
  --motion-step: 350ms cubic-bezier(0.4, 0, 0.2, 1);

  /* ============================================
     LEGACY ALIASES — to remove after sub-project #6 cascade
     ============================================ */
  /* BSA legacy */
  --primary-orange: var(--accent-bitcoin-decorative);
  --color-brand: var(--accent-bitcoin-decorative);
  --color-bg: var(--dm-canvas);
  /* ... etc ... */

  /* FSA legacy */
  --fsa-green: var(--accent-financial-decorative);
  --fsa-bg-dark: var(--dm-canvas);
  /* ... etc ... */
}
```

## 8. SVG gradient defs as a separate include

The icon system (sub-project #2.7 spec §4.2) requires SVG `<defs>` for gradient strokes. Tokens.css can't define SVG. Pattern:

Every page that uses gradient icons adds at start of `<body>`:

```html
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <defs>
    <linearGradient id="brand-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f7931a"/>
      <stop offset="100%" stop-color="#ffd700"/>
    </linearGradient>
    <linearGradient id="brand-gradient-financial" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0d9668"/>
      <stop offset="100%" stop-color="#6ee7b7"/>
    </linearGradient>
  </defs>
</svg>
```

Future optimization: extract to `/svg/brand-gradients.svg` and reference via `<use href="/svg/brand-gradients.svg#brand-gradient" />`. Defer to sub-project #6.

## 9. Cascade dependencies

| Sub-project | Inputs from this spec |
|---|---|
| **#2 Components** | Consumes all tokens. Builds card / button / hero / pull-quote / form-field components on top. |
| **#2.7 Icon system Phase 2** | Uses `--brand-gradient` token + SVG defs include. |
| **#3 Hub homepage** | Loads tokens.css; consumes color/type/spacing tokens. |
| **#4 BSA homepage** | Same. |
| **#5 FSA homepage** | Same; uses `--brand-gradient-financial` and `--accent-financial-*` tokens. |
| **#6 Cascade** | Migrates 387 files to consume tokens; removes legacy aliases at the end. |
| **#7 Footer rollout** | Uses `--lm-text-muted` + `--space-component` for footer styling. |

## 10. Risks

- **BSA's existing CSS files have non-token rules mixed with `:root`.** Step 5.1's separation must be careful — focus indicators and skip-link rules in `brand.css` need to stay (they consume new tokens).
- **`:root` redefinition order.** If tokens.css is loaded after a page-level `<style>` that defines `:root { --foo: ... }`, the page-level wins (later cascade). Mitigation: load tokens.css FIRST in `<head>`.
- **Sync script drift.** If BSA edits its own copy of tokens.css instead of the hub canonical, hub becomes stale. Mitigation: commit message convention ("tokens edits ONLY in hub repo") + CI check (sub-project #2 follow-up).
- **Breaking 387 files at once.** Aliases prevent this — old token names continue working until cascade phase rewrites consumers.
- **html { font-size: 13px } affects rem-based images / icons too.** Verify SVG icons set in rem don't shrink unexpectedly. (`width: 24px` on SVG is px-anchored — safe. `width: 1.5rem` would scale. Audit during cascade.)
- **Mobile / responsive interaction.** With 13px html base, text on mobile (already smaller per `@media (max-width: 640px) { html { font-size: 14px } }` in FSA) needs verification. May need to remove conflicting media queries.

## 11. What this spec doesn't cover (out of scope)

- Component CSS (cards, buttons, etc.) — sub-project #2
- Per-mode (light/dark) automatic switching mechanism — sub-project #2
- Custom font loading strategy beyond `--font-*` tokens — already in original brand spec §4.1
- Build / preprocessor (Sass, PostCSS) — none used; tokens.css is hand-authored CSS
- Theme switcher UI — locked spec defers user toggle to Phase 2

## 12. Sign-off checklist

- [ ] §2.1 file structure (Option B — synced per repo from hub canonical) approved
- [ ] §3 naming convention approved
- [ ] §4 full token list verified against locked specs (visual brand, gradient amendment, icon system)
- [ ] §4.1 typography baseline change (16px → 13px) explicitly accepted as third amendment to original spec
- [ ] §4.5 gradient tokens match the locked amendment
- [ ] §4.8 NEW grid minmax tokens (200/260px from prototype) accepted
- [ ] §5 migration strategy (alias-during-transition + cleanup-after-cascade) approved
- [ ] §6 implementation order approved
- [ ] §7 tokens.css skeleton format approved
- [ ] §8 SVG defs include pattern approved
- [ ] §10 risks acknowledged
- [ ] Green light to start Step 1 (create canonical `sovereign-academy-hub/css/tokens.css`)

Once signed off, Step 1 begins. Steps 1–5 are bounded scope (~1 day, no risk to live production until step 4 modifies about.html). Steps 6–7 are downstream sub-projects.
