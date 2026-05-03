# Component Library — Sovereign-Editorial System

**Date:** 2026-05-03
**Status:** Draft (awaiting sign-off)
**Scope:** Extract reusable component classes from the shipped homepage, document HTML signatures, and define a migration path for the rest of the site.
**Supersedes (partial):** `docs/superpowers/specs/2026-05-01-visual-brand-system-design.md` §4 (typography), §3 (color), §3.6 (surface assignment).
**Builds on:** Brand pivot commit `86e3b5de`, homepage cream-paper commit `021dc680`, canonical reference `os.thesovereign.academy`.

---

## 0. Where to start (next session)

1. Read this spec end-to-end + `2026-05-03-site-wide-ia-audit.md` (cascade plan + decisions).
2. Audit `index.html` — list every inline `<style>` block + every class defined inline that this spec promotes to a component (eyebrow, section-tag, editorial-title, editorial-subtitle, editorial-2col, cream-section, dark-section, hero-radial-gold, inverted-card, hairline-divider, mono-pill, page-cream).
3. Propose the extraction plan **before** editing `brand.css` — which inline blocks move where, what gets renamed, what stays homepage-specific. Confirm with Dalia.
4. Then: extract → refactor `index.html` to consume the named classes → verify zero visual regression (preview before/after; pay attention to the cream-paper hero, gold-diamond section tags, and the editorial 2-col grid).
5. Commit + push. Update this spec's status from `Draft` → `Shipped`.

**Don't:** start cascading to other pages (about, dalia, start, …) in the same session. P1 cascade is its own session, gated on this extraction landing cleanly.

---

## 1. Why this exists

After the homepage cream-paper conversion (commit `021dc680`), the visual system is fully realized in one place but **not extracted as reusable components**. Every other strategic page (about, dalia, start, weekly, institutional landings) needs the same treatment. Doing it page-by-page without a shared component vocabulary will produce:

- Inconsistent margins / padding / radii
- Token drift (e.g. `--color-paper` vs `--color-cream` aliases used differently per page)
- Re-invention of the same patterns (eyebrow, section-tag, cream-card, dark-card, editorial-grid)
- Maintenance nightmare when the system needs to update

A small shared component library — 8–12 classes in `brand.css` — solves this. Each subsequent page migration becomes a 10-minute swap rather than a 60-minute reimplementation.

## 2. What we're locking from the homepage

The shipped homepage uses the following patterns. They become the canonical components.

### 2.1 Page mode

```css
body.page-cream {
  background: var(--color-cream);
  color: var(--color-ink-on-cream);
}
```

Already in `brand.css` (commit `021dc680`). Pages opt in by adding `class="page-cream"` to `<body>`.

### 2.2 Eyebrow (mono-uppercase pre-headline label)

Existing in `brand.css`:
```css
.hero-eyebrow {
  display: inline-block;
  font-size: 0.875rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-weight: 500;
  color: var(--color-brand);
  margin-bottom: 0.75rem;
}
```

**Limitation:** name implies hero-only use. **Action:** rename to `.eyebrow`, keep `.hero-eyebrow` as backwards-compat alias.

### 2.3 Section-tag (gold-diamond + mono-uppercase chip above section h2)

Currently inline in `index.html`. **Extract to `brand.css`:**
```css
.section-tag {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--color-ink-on-cream);
  margin-bottom: 1.5rem;
}
.section-tag::before {
  content: '◆';
  font-size: 7px;
  color: var(--color-gold);
}

/* On dark surfaces, flip to cream text + gold-light diamond */
.surface-dark .section-tag,
.section-dark .section-tag {
  color: var(--color-text);
}
.surface-dark .section-tag::before,
.section-dark .section-tag::before {
  color: var(--color-gold-light);
}
```

### 2.4 Editorial title (serif h2 with gold em accent)

Pattern used in `.choose-path-title`. **Extract:**
```css
.editorial-title {
  font-family: var(--font-serif);
  font-size: clamp(2rem, 3.5vw, 3rem);
  font-weight: 900;
  letter-spacing: -0.01em;
  line-height: 1.05;
  margin: 0;
  color: inherit;
}
.editorial-title em {
  font-style: italic;
  color: var(--color-gold);
}
```

### 2.5 Editorial subtitle (border-left bordered serif/body para)

Pattern used in `.choose-path-subtitle`. **Extract:**
```css
.editorial-subtitle {
  font-family: var(--font-body);
  color: var(--color-muted-on-cream);
  margin: 0;
  padding-left: 2rem;
  border-left: 1px solid rgba(12, 10, 8, 0.18);
  font-size: 1.05rem;
  line-height: 1.6;
}
.surface-dark .editorial-subtitle {
  color: var(--color-muted);
  border-left-color: rgba(245, 240, 232, 0.18);
}
```

### 2.6 Editorial 2-col grid (asymmetric title-left + subtitle-right)

```css
.editorial-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  max-width: 880px;
  margin: 0 0 2.5rem;
}
@media (max-width: 880px) {
  .editorial-grid { grid-template-columns: 1fr; gap: 2rem; }
}
```

### 2.7 Cream section (default content section on cream pages)

```css
.section-cream {
  padding: 6rem 6rem;
  background: var(--color-cream);
  color: var(--color-ink-on-cream);
  border-top: 1px solid rgba(12, 10, 8, 0.12);
  border-bottom: 1px solid rgba(12, 10, 8, 0.12);
  position: relative;
}
.section-cream-2 {
  background: var(--color-cream-2);
}
.section-cream-3 {
  background: var(--color-cream-3);
}
@media (max-width: 880px) {
  .section-cream { padding: 4rem 1.5rem; }
}
```

### 2.8 Dark section (inset/feature section on cream pages OR full-page on learning surfaces)

```css
.section-dark {
  padding: 6rem 6rem;
  background: var(--color-bg);
  color: var(--color-text);
  position: relative;
}
@media (max-width: 880px) {
  .section-dark { padding: 4rem 1.5rem; }
}
```

### 2.9 Hero radial-gold-glow (single signature gesture)

```css
.hero-glow::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 70% 50%, rgba(200, 146, 42, 0.08) 0%, transparent 55%);
  pointer-events: none;
  z-index: 1;
}
```

Apply to any `.section-dark` that should feel "lit from within" (hero, primary CTA section).

### 2.10 Inverted card (dark card on cream surface, OR cream card on dark surface)

```css
/* Dark card on cream — used for option-btn, dark callouts on cream pages */
.card-dark {
  background: var(--color-bg);
  border: 1px solid transparent;
  border-left: 3px solid var(--color-gold);
  border-radius: 2px;
  color: var(--color-text);
  padding: 1.1rem 1.4rem;
}

/* Cream card on dark — used for live-network-card, recommendation card */
.card-cream {
  background: var(--color-cream);
  color: var(--color-ink-on-cream);
  border: 1px solid rgba(12, 10, 8, 0.12);
  border-radius: 2px;
  padding: 1.5rem;
  box-shadow: var(--shadow-card);
}
```

### 2.11 Hairline divider (1px ink-12% above flush sections)

```css
.divider-hairline {
  border-top: 1px solid rgba(12, 10, 8, 0.12);
}
.surface-dark .divider-hairline,
.section-dark .divider-hairline {
  border-top-color: rgba(245, 240, 232, 0.12);
}
```

Used when a sub-section sits flush on the body (no boxed surface) but needs visual separation. Replaces "elevate to its own section bg" pattern.

### 2.12 Mono pill (small UI chip)

Pattern used in `.quick-tool-pill`. **Extract:**
```css
.mono-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: var(--color-cream-2);
  border: 1px solid rgba(12, 10, 8, 0.18);
  border-radius: var(--radius-button);
  color: var(--color-ink-on-cream);
  text-decoration: none;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  transition: all 0.2s ease;
  white-space: nowrap;
}
.mono-pill:hover {
  border-color: var(--color-gold);
  color: var(--color-gold);
}
.surface-dark .mono-pill,
.section-dark .mono-pill {
  background: var(--color-surface);
  border-color: var(--color-border);
  color: var(--color-text);
}
```

## 3. Token policy

### 3.1 Use existing tokens

All components use tokens already in `brand.css`:
- `--color-cream` / `--color-cream-2` / `--color-cream-3` / `--color-cream-wash`
- `--color-ink-on-cream` / `--color-muted-on-cream`
- `--color-bg` / `--color-surface` / `--color-text` / `--color-muted`
- `--color-gold` / `--color-gold-light`
- `--font-serif` (Playfair) / `--font-mono` (JetBrains) / `--font-body` (Crimson Pro)
- `--radius-sm` (2px) / `--radius-md` (4px) / `--radius-button` (2px)
- `--shadow-1` / `--shadow-2` / `--shadow-card`

### 3.2 Don't add aliases

The temptation to add `--color-paper` (alias of `--color-cream`) was rejected during the homepage spec. Same rule applies: **do not introduce alias tokens**. Two names for one hex creates maintenance burden without semantic improvement.

### 3.3 Single accent rule (locked)

Per the homepage commit `021dc680`:
- **Gold `#C8922A`** for em accents in headlines, diamond bullets, UI labels on cream
- **Gold-light `#E8B84B`** for UI labels on dark only (legibility hack for small text)
- **Orange `#C4501A`** is OFF-LIMITS for typography. Reserved for warning states + emphasis SVG fills.

This rule is enforced site-wide. Any cascade page that introduces orange in typography is a regression.

## 4. Surface scoping pattern

For pages that mix cream and dark sections:

```html
<body class="page-cream">
  <header>...</header>

  <section class="section-dark hero-glow">
    <!-- content uses --color-text, --color-muted; section-tag uses gold-light diamond -->
  </section>

  <section class="section-cream">
    <div class="section-tag">CHAPTER ONE</div>
    <h2 class="editorial-title">A title with <em>accent</em>.</h2>
    <p class="editorial-subtitle">Subtitle.</p>
  </section>

  <section class="section-cream-2">
    <!-- warmer cream variant for visual rhythm -->
  </section>

  <footer>...</footer>
</body>
```

Sections explicitly declare their surface. Children inherit color via the surface scope (`.section-dark .section-tag` overrides default).

## 5. Migration approach

### 5.1 Order of operations

1. **This spec → sign-off.** Lock the component vocabulary.
2. **Extract phase (next session):** move the inline CSS from `index.html` into named classes in `brand.css`. Update homepage to use the classes. Verify zero visual regression.
3. **Strategic-pages migration phase (after IA audit signs off):** about, dalia, start, weekly use the components.
4. **Long-tail cascade phase (subsequent sessions):** institutional landings, path landings, deep-dive landings, tools.
5. **Learning-surface phase (separate spec):** path modules + interactive demos stay dark, but adopt section-tag, eyebrow, editorial-title patterns where they help. **Defer until cream-page cascade is done.**

### 5.2 Per-page migration checklist

For each page being migrated:

- [ ] Add `class="page-cream"` (or stay dark if learning surface)
- [ ] Replace inline section bg colors with `.section-cream` / `.section-dark`
- [ ] Replace inline section-tag styles with `<div class="section-tag">`
- [ ] Replace inline editorial-title styles with `<h2 class="editorial-title">`
- [ ] Replace ad-hoc grids with `.editorial-grid`
- [ ] Replace card components with `.card-dark` / `.card-cream`
- [ ] Verify computed colors with preview_inspect
- [ ] Verify zero `#C4501A` in computed styles
- [ ] Screenshot top of page + each major section
- [ ] Spot-check WCAG contrast on small text

### 5.3 Per-page time estimate

- Strategic page (about, dalia): **~30–45 min** with components
- Path landing: **~20 min** (less variation)
- Long-tail page: **~10–15 min**

Compared to **~60–90 min** without components. ROI break-even at the 4th page.

## 6. What this does NOT include

- New tokens (none added)
- New fonts (Playfair / Crimson / JetBrains already loaded)
- Changes to button system (locked in `brand.css` via `.btn .btn-primary .btn-secondary .btn-ghost`)
- Layout components beyond `.editorial-grid` (header / nav / footer have their own systems; this spec doesn't refactor them)
- Form/input components (defer to a separate spec when forms are next touched)
- Learning-surface (dark) component variants beyond surface-scoping rules — full dark-side library is a separate Phase 2 spec
- Migration of FSA — sister project gets its own spec (color/typography pivot needed: green-themed equivalent)

## 7. Sign-off checklist

- [ ] Section 2 component list complete — anything missing from the homepage?
- [ ] Naming convention OK (`.section-cream` / `.section-dark` / `.editorial-title` / `.card-dark` / `.mono-pill`)?
- [ ] Surface scoping pattern (`.section-dark .child` overrides) acceptable, or prefer BEM-style modifiers?
- [ ] Migration order acceptable: extract → strategic → long-tail → learning?
- [ ] OK to officially mark `2026-05-01-visual-brand-system-design.md` superseded for typography (§4) + color (§3) + surface assignment (§3.6)?

## 8. Open questions for the user

1. **Where does this spec live in the cascade?** Is it Sub-project #2 (Components) of the existing 8-sub-project arc, or a new Sub-project #2-revised?
2. **FSA migration** — separate spec when ready, but should we draft the green-themed token equivalents in this same session, or defer?
3. **Sub-project #6 cascade scope** — old spec said "~387 interior pages." This new component approach makes it ~190 pages (homepage system) + ~190 pages (learning-surface refresh). Acknowledge?
4. **Backwards-compat aliases** — keep `.hero-eyebrow` as alias for `.eyebrow`, or refactor all callers?

---

Once signed off, this spec drives the cascade. Each subsequent page migration cites this doc as its component vocabulary source.
