# BSA Conventions — Cross-References

> This file points to the canonical sources. Do not duplicate their content here — keep it shallow.

## Voice + identity

- **Voice spec (canonical):** [`docs/marketing/voice-spec.md`](../../docs/marketing/voice-spec.md). Supersedes any prior voice guidance.
- **Identity (locked 2026-04-28):** *"Bitcoin custody and inheritance for families and advisors. Bilingual. LATAM-fluent."*
- **Tagline:** *Don't Trust, Verify.*
- **Three-part synthesis check** (pre-publish): composability + first-principles + epistemic.
- **Operating frame:** unbounded mode — no quizzes, no badges, no completion percentages.

## Visual system

- **Canonical design reference:** `os.thesovereign.academy` — editorial-asymmetric, left-indented column hero, sectional bg differentiation, Playfair Display headlines + JetBrains Mono labels, 2px corners, restrained gold/orange. Read before any layout/typography work on strategic pages.
- **Visual system spec (2026-05-03):** Playfair Display + Crimson Pro + JetBrains Mono. Burnished gold `#C8922A`. Cream paper. See `docs/superpowers/specs/2026-05-03-component-library-plan.md` + `2026-05-03-site-wide-ia-audit.md`.
- **CSS tokens (canonical):** `css/brand.css` — `--color-brand` (`#f7931a`), `--color-bg` (`#0b0e14`), `--color-surface`, `--color-border`, `--color-text`, `--color-muted` + `--gradient-*` / `--radius-*` / `--shadow-*` / `--space-*`. Extend, never introduce new tokens.
- **Homepage CSS:** uses `css/tokens.css` + `css/design-tokens.css` (NOT `brand.css`). Edit accordingly.

## Locked conventions (do not redesign without explicit ask)

| Convention | Detail |
|-----------|--------|
| Logo system | Diamond = BSA. Stroke = Dalia. Production SVGs at `assets/dalia/`. |
| Footer | `Created by Dalia · bitcoinsovereign.academy` (EN) / `Creado por Dalia · …` (ES). On every visual artifact. |
| Color carries meaning | Default to neutral surfaces/borders. Reserve color for path differentiation or genuine semantic distinction. |
| A–D format | Visual/aesthetic decisions get 4 side-by-side mockups + a recommendation. |

## Code conventions

- **Absolute CSS paths only** on demos and embedded pages — `/css/brand.css`, not `../css/brand.css`. Relative paths break under iframe embedding and at non-root URLs.
- **Sanitization** — all external API data via `safeInt()` / `safeNum()` before innerHTML. External URLs and labels via `escHtml()`. No `eval`. No user-controlled innerHTML except through sanitizer.
- **Bilingual** — EN primary, ES secondary. Spanish lives at `paths/<path>/stage-N/es/`. EN files get hreflang alternates + breadcrumb language switcher.
- **Commits** — every non-trivial change lands in a single focused commit. Squash locally before pushing.
- **PR body** — must include test-plan checklist (at minimum: "manual smoke tested" or "ran `npm run tutor:evals`").
- **Security-relevant changes** — require before/after contrast/flow in commit body.
- **Untracked policy** — `.cursor/`, `.claude/`, `frontend/`, single-file drafts at repo root are NOT committed by default. Review before `git add`.

## Privacy + analytics

- **First-party only.** No third-party trackers, no ad pixels.
- **Server-side analytics** anonymized via `/api/track` → Supabase.
- **Email** through Resend with **open/click tracking explicitly disabled**.
- **Public metrics** (`/api/metrics`) suppress counts < 10 for privacy.

## Accessibility

- WCAG 2.1 AA floor across the platform.
- Keyboard navigable. `prefers-reduced-motion` respected. `:focus-visible` outlines. ARIA roles on interactive components.
- Shared components audited in C1–C5 (`621bf2f2`).

## Recurring maintenance (M1–M4 from TASKS.md)

| ID | Cadence | Action |
|----|---------|--------|
| M1 | Per SYSTEM_PROMPT change | Run `npm run tutor:evals`. Regressions warrant rollback. |
| M2 | Weekly | Update `weekly/index.html` changelog. Tag PRs with category + link. |
| M3 | Occasional | `git status` check for untracked `.cursor/`, `frontend/`, etc. — decide repo vs `.gitignore`. |
| M4 | Monthly | Verify `ANTHROPIC_API_KEY` quota in Anthropic Console. |
