# Visual Brand System — design spec

**Status:** Draft, awaiting sign-off
**Date:** 2026-05-01
**Sub-project:** #0 of 8 (foundation for the makeover arc)
**Scope:** Cross-repo — `bitcoin-sovereign-academy` (BSA), `financially-sovereign-academy` (FSA), `sovereign-academy-hub` (thesovereign.academy)
**Supersedes (partial):** ad-hoc CSS tokens currently in `css/brand.css`, `css/design-tokens.css` (BSA), `css/fsa-theme.css` (FSA)
**References (locked, not modified):** `docs/marketing/voice-spec.md` (voice T3a), `assets/dalia/` (logo system), `docs/superpowers/specs/2026-05-01-footer-convention.md` (footer convention, deferred)

---

## 1. Why this exists

The three sites under "The Sovereign Academy" umbrella — bitcoinsovereign.academy, financiallysovereign.academy, thesovereign.academy — currently have:

- **A locked voice** (`voice-spec.md`)
- **A locked logo system** (`assets/dalia/`)
- **A locked identity line** (*"Bitcoin custody and inheritance for families and advisors. Bilingual. LATAM-fluent."*)
- **A locked footer convention** (deferred until after makeover)
- **No documented visual brand system.** Each repo has improvised tokens independently. BSA has two parallel token files (`brand.css` and `design-tokens.css`) with different vocabularies for the same concepts. FSA uses `--fsa-` prefixed tokens with a fuller scale than BSA. The hub uses ad-hoc inline styling.

This spec defines the visual leg of the brand. Sub-projects #1–7 consume it.

## 2. Brand thesis & visual personality

The visual system renders the locked voice — *"Bitcoin custody and inheritance for families and advisors. Bilingual. LATAM-fluent."* — into design.

**Four design principles** (all derived from the voice spec):

1. **Editorial-financial premium** — for the institutional credibility advisors and HNW families need.
2. **Technical credibility through density** (not whitespace alone) — for sovereignty-curious readers.
3. **Restraint over saturation** — warm color confidence, not vivid gradient noise; LATAM-fluent without falling into stock-template territory.
4. **Inform-not-convince rendered visually** — diagrams as design objects, motion that teaches, accent restraint over decorative ornament.

**Anchor audience:** family + advisor (the locked identity line's primary). Other audiences (technical, LATAM consumer) served via the same register, no compromise per audience.

**The seven foundational locks** (decided 2026-05-01 brainstorming session):

| Lock | Decision |
|---|---|
| Aesthetic direction | **D** — synthesis (bilingual sovereignty professional) |
| Color philosophy | **Restrained accent system** — single deep accent per content domain, no gradients in the standard system |
| Type system | **Source Serif 4** (h1/h2) · **Inter** (h3/body/UI) · **JetBrains Mono** (code/hashes) |
| Mode strategy | **Dual-default by context** — light marketing, dark learning |
| Density | **Considered editorial** on marketing surfaces; naturally compact on learning surfaces |
| Imagery | **Typography + diagram-as-art**; illustrations as Phase 2 enhancement |
| Motion | **B+D** — subtle functional everywhere, pedagogical motion only where it teaches |

## 3. Color system

### 3.1 Color philosophy

- Single deep accent per content domain. **Bitcoin contexts** = orange family. **Financial contexts** = emerald family.
- **No gradients** in the standard system. Gradient reserved for future ceremonial moments (course completion, milestone unlocks) — not standard ornament.
- Accent used at **2–5% of the visual surface** — rules, callout borders, icon fills, button outlines. Never large color fields.
- Three variants per accent family: **decorative** (non-text use ≥3px), **text-on-light** (deeper for AA contrast), **text-on-dark** (lighter for AA contrast).

### 3.2 Semantic accents (cross-mode)

| Domain | Decorative | Text on light | Text on dark | Use |
|---|---|---|---|---|
| Bitcoin | `#f7931a` | `#b45309` | `#ffb347` | BSA learning surfaces; Bitcoin-themed marketing sections |
| Financial | `#0d9668` | `#047857` | `#6ee7b7` | FSA learning surfaces; financial-themed marketing sections |

**Accessibility rule:** decorative variant is for non-text use only (rules, borders, icons ≥3px stroke). Body accent text uses the deeper (light mode) or lighter (dark mode) variant. All text variants pass WCAG 2.1 AA at ≥4.5:1 contrast.

### 3.3 Light marketing palette

| Token | Hex | Use |
|---|---|---|
| `--lm-canvas` | `#fafaf7` | Page background — warm off-white (not pure white) |
| `--lm-surface` | `#ffffff` | Cards, inputs, raised surfaces |
| `--lm-subtle` | `#f5f5f1` | Alt rows, code blocks |
| `--lm-border-subtle` | `#e5e7eb` | Default dividers |
| `--lm-border-strong` | `#d1d5db` | Input borders, structural dividers |
| `--lm-text-primary` | `#1a1f2e` | Body + headings |
| `--lm-text-secondary` | `#374151` | Supporting copy |
| `--lm-text-muted` | `#6b7280` | Eyebrows, captions, meta |
| `--lm-text-faint` | `#9ca3af` | Placeholders, disabled — **never body text** (fails AA at 4.5:1) |

### 3.4 Dark learning palette

The dark palette deliberately extends BSA's current tokens rather than replacing them — values refined for AA contrast over months stay. Naming + a few additions change. **No dark-mode regression.**

| Token | Hex | Use |
|---|---|---|
| `--dm-canvas` | `#0b0e14` | Page background (current BSA — kept) |
| `--dm-surface` | `#121723` | Cards, raised surfaces (current — kept) |
| `--dm-subtle` | `#1b2433` | Alt rows, code blocks |
| `--dm-border-subtle` | `#202938` | Default dividers (current — kept) |
| `--dm-border-strong` | `#2d3748` | Input borders, structural dividers |
| `--dm-text-primary` | `#e6edf3` | Body + headings (current — kept) |
| `--dm-text-secondary` | `#cbd2da` | Supporting copy |
| `--dm-text-muted` | `#9aa4b2` | Eyebrows, captions, meta (current — kept) |
| `--dm-text-faint` | `#6b7280` | Placeholders, disabled — **never body text** |

### 3.5 Semantic alerts (both modes)

| Role | Light hex | Dark hex |
|---|---|---|
| Success | `#059669` | `#10b981` |
| Warning | `#d97706` | `#f59e0b` |
| Error | `#dc2626` | `#ef4444` |
| Info | `#2563eb` | `#3b82f6` |

### 3.6 Surface mode assignment

Two principles:
- **Marketing surfaces** (presentational, advisor-facing, premium register) → light.
- **Learning surfaces** (interactive, long-session, sovereignty register) → dark.

**Light marketing pages** (32 categories):
- BSA homepage `/index.html`
- FSA homepage `/index.html`
- thesovereign.academy homepage `/index.html`
- Identity hub: `dalia/index.html`, `dalia/logo-explorations.html`
- Institutional pages: `institutional/*.html` (BSA + FSA both)
- Weekly digest: `weekly/index.html`
- BSA top-level: `about.html`, `contact.html`, `pricing.html`, `sponsor.html`, `transparency.html`, `terms.html`, `privacy.html`, `licensing.html`, `earn-back-terms.html`, `membership.html`
- FSA articles: `articles/*.html`
- FSA answers: `answers/*.html`
- FSA my-journey: `my-journey.html`
- Certificates: `certificates/*.html` (except `branded_certificate_page.html` which keeps client branding)
- 404 pages: `404.html` (BSA + FSA)
- AI tutor landing: `ai-tutors/index.html` (presentational gateway only — the actual tutor is the embedded `reflect-widget.js`, which adopts the host page's surface mode)
- Programa-colombia hub: `programa-colombia/index.html` (Spanish marketing)
- Youth-families educator landing: `youth-families/educator/index.html`
- Bitcoin-advisor-certification program landing: `institutional/wealth-advisors/bitcoin-advisor-certification/index.html` (program overview; the day-N learning modules within it are dark)

**Dark learning pages** (300+ files):
- Path modules: `paths/**/*.html` (110 files)
- Interactive demos: `interactive-demos/*/index.html` (48 files)
- Deep dives: `deep-dives/**/*.html` (22 files)
- FSA modules: `modules/*.html` (13 files)
- FSA calculators: `calculators/*.html` (5 files)
- FSA bridge pages: `fsa/bridge/*.html` (5 files)
- Programa-colombia weeks: `programa-colombia/semana-*/index.html` (10 files, Spanish)
- Programa-colombia experiments: `programa-colombia/experimento-*/index.html`
- Youth-families weeks: `youth-families/week-*/index.html` (10 files)
- Glossary: `glossary.html`
- Emergency kit: `emergency-kit.html`
- Multisig demo: `multisig-security-demo.html`
- Account: `account.html`
- Checkout: `checkout.html`
- Membership success: `membership-success.html`
- Start simple: `start-simple.html`
- Assessment: `assessment.html` (FSA)
- Advisor certification day-N learning modules: `institutional/wealth-advisors/bitcoin-advisor-certification/day-*/*.html` (the program-landing `index.html` and `advisor-toolkit.html` are light; only the day-N module pages are dark)
- BSA Spanish path modules: `paths/curious/stage-1/es/*.html` (3 files)

**Excluded** (no visual brand system applies):
- `certificates/branded_certificate_page.html` (client-branded — Oakwood)
- Google verification stubs (`google*.html`, `googleverification.html`)
- `fsa/admin/dashboard.html` (internal-only)
- `node_modules/**`, `.venv/**`, `.cursor/**`, `.claude/**`, `.superpowers/**`

## 4. Typography & spacing

### 4.1 Type system

| Family | Use | Loading |
|---|---|---|
| **Source Serif 4** | h1, h2 only — the editorial moment | Google Fonts, preconnect + `display=swap` |
| **Inter** | h3, h4, body, UI, labels, eyebrows, buttons | Google Fonts |
| **JetBrains Mono** | code, hashes, addresses, mnemonic words, technical data | Google Fonts |

System font stack as fallback (`Georgia, serif` for serif; `system-ui, sans-serif` for sans; `monospace` for mono).

### 4.2 Type scale — light marketing surfaces

| Token | Rem | Family | Weight | Line-height | Letter-spacing |
|---|---|---|---|---|---|
| `--type-h1-marketing` | `clamp(1.85, 4.5vw, 2.6)` | Source Serif 4 | 600 | 1.1 | -0.018em |
| `--type-h2-marketing` | `clamp(1.5, 3.5vw, 1.95)` | Source Serif 4 | 600 | 1.15 | -0.015em |
| `--type-h3` | 1.4 | Inter | 600 | 1.25 | -0.005em |
| `--type-h4` | 1.1 | Inter | 600 | 1.3 | normal |
| `--type-lede` | `clamp(1.05, 1.8vw, 1.15)` | Inter | 400 | 1.65 | normal |
| `--type-body` | 1.0 | Inter | 400 | 1.65 | normal |
| `--type-small` | 0.875 | Inter | 400 | 1.55 | normal |
| `--type-caption` | 0.8 | Inter | 400 | 1.5 | normal |
| `--type-eyebrow` | 0.7 | Inter | 500 | 1.4 | 0.14em (uppercase) |
| `--type-mono` | 0.85 | JetBrains Mono | 400 | 1.5 | normal |

### 4.3 Type scale — dark learning surfaces (tighter)

Headings reduce; body and below shared with marketing.

| Token | Rem | Family | Weight | Line-height |
|---|---|---|---|---|
| `--type-h1-learning` | 1.85 | Source Serif 4 | 600 | 1.18 |
| `--type-h2-learning` | 1.5 | Source Serif 4 | 600 | 1.2 |
| `--type-h3-learning` | 1.2 | Inter | 600 | 1.3 |
| `--type-body-learning` | 1.0 | Inter | 400 | 1.6 |

Other tokens (small, caption, eyebrow, mono) shared with marketing.

### 4.4 Bilingual rules

- **Spanish runs ~25% longer than English.** Line-height of 1.6–1.65 absorbs the length without re-tuning.
- Source Serif 4 + Inter both have full Latin Extended-A coverage — diacritics (á, é, í, ó, ú, ñ, ¿, ¡) render correctly without fallback.
- **Eyebrow uppercase rule waived in Spanish** if the result orphans an article (e.g., *"EL CAMINO DEL CURIOSO"* is fine; awkward cases get sentence case).
- Long Spanish technical terms (e.g., *"institucionalización"*) get `hyphens: auto` with proper `lang="es"` attribute on the page.
- Max line length (`--width-prose: 640px`) holds for both languages.

### 4.5 Spacing scale (4px base, numeric naming)

| Token | Value (px) | Value (rem) | Most-common use |
|---|---|---|---|
| `--space-1` | 4 | 0.25 | Hairline gaps |
| `--space-2` | 8 | 0.5 | Inline icon padding |
| `--space-3` | 12 | 0.75 | Tight inline |
| `--space-4` | 16 | 1.0 | **Base unit** |
| `--space-5` | 20 | 1.25 | Custom mid-spacing |
| `--space-6` | 24 | 1.5 | Component padding |
| `--space-8` | 32 | 2.0 | Between components |
| `--space-10` | 40 | 2.5 | Mobile section gap |
| `--space-12` | 48 | 3.0 | Marketing section (small) |
| `--space-16` | 64 | 4.0 | Marketing section (default) |
| `--space-20` | 80 | 5.0 | Marketing section (large) |
| `--space-24` | 96 | 6.0 | Hero / dramatic spacing |

**Semantic aliases:**

| Alias | Resolves to | Use |
|---|---|---|
| `--space-section-marketing` | `clamp(2.5rem, 5vw, 4rem)` | Marketing section padding (fluid) |
| `--space-section-learning` | `clamp(1.5rem, 3vw, 2rem)` | Learning section padding (fluid) |
| `--space-component` | `var(--space-6)` (24px) | Within sections, between components |
| `--space-element` | `var(--space-4)` (16px) | Within components, between elements |

### 4.6 Layout — max widths & radius

| Token | Value | Use |
|---|---|---|
| `--width-prose` | 640px | Long-form reading max |
| `--width-content` | 720px | Article body |
| `--width-default` | 1100px | Standard marketing sections |
| `--width-wide` | 1280px | Full grids, hero |
| `--radius-sm` | 4px | Inputs, code chips |
| `--radius-md` | 6px | Buttons, default cards |
| `--radius-lg` | 12px | Large cards, hero containers |
| `--radius-pill` | 999px | Pills, avatars |

## 5. Responsive behavior

### 5.1 Breakpoints

| Token | Min width | Audience |
|---|---|---|
| `--bp-sm` | 480px | Large phone |
| `--bp-md` | 768px | Tablet |
| `--bp-lg` | 1024px | Desktop |
| `--bp-xl` | 1280px | Wide desktop (max-width caps engage) |

### 5.2 Fluid type scaling

Display type uses `clamp()` for smooth scaling — no jarring breakpoint jumps. Body, eyebrow, caption, mono are fixed rem (readability constant).

### 5.3 Layout reflow rules

- Multi-column grids → single column below `--bp-md` (768px).
- **Diagram-as-art reflows** — diagrams running horizontally on desktop wrap to vertical stacks on mobile. Designed for both orientations from day one.
- Mono strings (Bitcoin addresses, hashes, mnemonic words) — `word-break: break-all` on mobile; `tap-to-copy` on touch.
- Tables → card view below `--bp-md` for data-heavy surfaces.

### 5.4 Touch & accessibility

- Minimum 44×44px touch targets for all interactive elements (WCAG 2.5.5). BSA's existing `mobile-touch-targets.css` stays and gets extended to FSA + hub.
- `:focus-visible` outlines at 2px solid `--accent-bitcoin` (or `--accent-financial` on financial surfaces). Never `outline: none` without a replacement focus indicator.
- `prefers-reduced-motion` honored everywhere — animations become instant transitions; pedagogical diagram animations become single-state reveals on click.
- `prefers-color-scheme` is **not** honored automatically — page mode (light marketing / dark learning) is determined by surface type, not user preference. User toggle remains a Phase 2 enhancement.

### 5.5 Bilingual + responsive intersection

- Mobile breakpoints engage one step earlier for Spanish content (longer strings → tighter mobile container).
- Long Spanish words get `hyphens: auto` with `lang="es"`.

## 6. Motion register

### 6.1 Default (B — subtle / functional)

- Transitions: `200ms cubic-bezier(0.4, 0, 0.2, 1)` for hover, focus, state changes.
- Card hover: `translateY(-2px)` + accent border + subtle shadow.
- Focus: 2px solid accent. Always visible.
- Smooth scroll for internal anchor links (`scroll-behavior: smooth`).

### 6.2 Pedagogical layer (D — motion that teaches)

- Step-through animations on diagrams (multisig signing, BIP-39 entropy, fee dynamics, ledger consensus, address derivation, debt avalanche).
- **User-triggered, not auto-playing.** "▶ Animate" button reveals the sequence.
- 350–600ms per step; total animation under 5 seconds.
- Always reversible — clicking again resets.

### 6.3 Banned moves (explicit, non-negotiable)

- Constant pulses, bouncing CTAs, rotating elements (the C-direction sales register).
- Hero parallax, scroll-triggered reveals, cursor-following effects.
- Auto-play video, marquee scrollers, ticker tape (live data tickers ok if user-paused-able).
- Any motion without a `prefers-reduced-motion` fallback.

## 7. Imagery register

### 7.1 Typography as the visual moment

Numbers, statistics, pull quotes get Source Serif 4 at display size with accent-text on key digits.

Example: *"**73%** of self-custodied bitcoin sits with no documented inheritance plan"* — `73%` rendered in Source Serif 4 at 2.6rem with `color: var(--accent-bitcoin-text)`.

### 7.2 Diagrams as design objects

Multisig flows, custody trees, fee mechanics, ledger views are designed at hero-quality SVG, not afterthought infographics. Every diagram has both desktop (horizontal) and mobile (vertical) layouts.

### 7.3 Pull quotes

`border-left: 2px solid var(--accent-bitcoin-text)` (or financial accent), Source Serif 4 italic, generous padding (1.4rem inline-start, 0.4rem block).

### 7.4 Icons

Light usage. Minimal SVG, 1.5px stroke, single accent color, 24×24 default. Used only where they reduce reading load.

### 7.5 Photos and illustrations — Phase 2

**Explicitly deferred.** No stock imagery in launch under any circumstances. Photo library + custom illustration system are a Phase 2 enhancement after the makeover ships. Phase 2 illustration direction TBD; current spec doesn't pre-commit a style.

## 8. Form & input register

| Property | Light | Dark |
|---|---|---|
| Background | `--lm-surface` (`#ffffff`) | `--dm-subtle` (`#1b2433`) |
| Border | `1px solid --lm-border-strong` | `1px solid --dm-border-strong` |
| Focus ring | `2px solid --accent-bitcoin` (or `--accent-financial`) | same |
| Hit area | min 44×44px | min 44×44px |
| Error state | border + icon + helper text in `--semantic-error` | same with dark variant |

## 9. Cascade — what this spec feeds

| Sub-project | Inputs from this spec | Output |
|---|---|---|
| **#1 Tokens** | §3, §4, §5 | Shared `tokens.css` consumable by all 3 repos with brand-specific overrides |
| **#2 Components** | §1–8 | HTML/CSS components: card, button, hero, eyebrow, accent-rule, callout, pull-quote, stat-display, diagram-frame, footer, form-field |
| **#3 hub homepage** | Full spec + #1 + #2 | Redesigned `sovereign-academy-hub/index.html` |
| **#4 BSA homepage** | Full spec + #1 + #2 | Redesigned BSA `/index.html` |
| **#5 FSA homepage** | Full spec + #1 + #2 | Redesigned FSA `/index.html` |
| **#6 Cascade** | Full spec + #1 + #2 | ~387 interior pages updated; legacy tokens (`--primary-orange`, `--text-dim`, `--fsa-green` etc.) replaced with new system; visual pass per demo |
| **#7 Footer rollout** | Full spec + #1 | Footer convention applied site-wide using new tokens (existing footer spec at `2026-05-01-footer-convention.md`) |

## 10. Functionality preservation (non-negotiable)

**This spec changes visual treatment only. No interactive behavior is touched.**

The 50+ interactive demos (random number generator, UTXO selector, mempool visualizer, fee tool, address explorer, coinjoin simulator, mining puzzle, DCA time machine, sat-stacking calculator, Bitcoin-vs-banking, sovereign-vault, and all others) retain their:
- Algorithm and entropy logic
- State and click handlers
- Math and computation
- Network calls (mempool.space, CoinGecko, Blockchain.info, Kraken)
- Storage (`localStorage` keys: `bsa_lab_completions`, `fsa_lab_completions`, `fsa-my-plan`, etc.)

Per-demo work during sub-project #6 cascade:
1. **Token consumption.** Demos using `--primary-orange`, `--text-dim`, `--fsa-green` etc. get find-replaced to new token names (mechanical).
2. **Inline-styled demos.** Light visual pass to align with new system; no logic change.
3. **Functionality test pass.** Every demo clicked through; every interactive verified.
4. **Regressions are P0.** Any tool that stops working = blocking issue, fixed before cascade merges.

This commitment is encoded here and carried into sub-project #6's plan.

## 11. Open questions / decisions deferred

- **Phase 2 illustration direction.** Style + illustrator + production pipeline decided when illustrations are added. Not pre-committed.
- **User-toggle for light/dark.** Single-mode user toggle deferred until we measure whether it's needed. Default is page-context-driven (per §3.6 + §5.4).
- **Spanish typography refinements.** `hyphens: auto` and bilingual breakpoint adjustments specified in principle (§4.4, §5.5); per-page tuning happens during cascade (§9 #6).
- **Animation quantity.** Pedagogical motion is opt-in per diagram; this spec commits to the *register*, not which specific diagrams animate. Sub-project #2 (components) and #6 (cascade) decide which diagrams get pedagogical animation first.
- **Form validation visual** beyond border + icon + helper. Multi-field validation patterns specced in sub-project #2.

## 12. Risks

- **BSA's two parallel token files** (`brand.css` and `design-tokens.css`) means consuming code may use either system. Sub-project #1 must inventory all consumers before swapping tokens — risk of breakage if find-replace is too aggressive.
- **FSA's `--fsa-` prefix shift to unprefixed token names** changes all FSA consuming code. Sub-project #1 must do a controlled migration with backwards-compat aliases during transition.
- **Spanish content rendering on the new type scale.** Source Serif 4 supports diacritics, but display-size headings on mobile may need per-string review for awkward breaks. Cascade phase audit catches this.
- **387 files cascade scope.** Bulk visual passes risk regressions in edge-case demos with custom inline CSS. Sub-project #6 plan must include a per-demo functionality test gate.
- **WCAG 2.1 AA contrast for accent text** — text variants chosen for ≥4.5:1 contrast. Any new accent usage in the cascade must be re-verified (`--accent-bitcoin` decorative ≠ AA-safe for body text on light).
- **Logo system unchanged but lives in dark surfaces today.** Logo tinting on light marketing surfaces needs a per-asset audit (`assets/dalia/`) before homepage redesigns ship.

## 13. Appendix — full file-level surface inventory (deferred to cascade)

The complete materialized inventory of all ~387 in-scope HTML files mapped to light marketing or dark learning surface is deferred to sub-project #6 cascade planning, where it will live as `docs/superpowers/specs/2026-05-XX-cascade-inventory.md`.

For sign-off on *this* spec, §3.6 enumerates surface categories with explicit file globs (e.g., `paths/**/*.html` → dark). Edge cases (single-file overrides like `branded_certificate_page.html`) are listed in the "Excluded" subsection. Per-file deviations from the category default are decided during cascade planning.

---

## Sign-off checklist

- [ ] Section 1–2 (brand thesis & visual personality) approved
- [ ] Section 3 (color system) approved — current locks: all A's per 2026-05-01 color-options brainstorm (light canvas A `#fafaf7`, dark canvas A `#0b0e14`, Bitcoin accent A `#f7931a`, financial accent A `#0d9668`)
- [ ] Section 4 (typography & spacing) approved
- [ ] Section 5 (responsive behavior) approved
- [ ] Section 6 (motion register) approved
- [ ] Section 7 (imagery register) approved — illustrations explicitly Phase 2
- [ ] Section 8 (form & input register) approved
- [ ] Section 9 (cascade dependencies) approved
- [ ] Section 10 (functionality preservation) approved — non-negotiable
- [ ] Section 11–12 (open questions + risks) reviewed

Once signed off, this spec becomes the canonical reference for sub-projects #1–7. Changes after sign-off require a new dated revision spec.
