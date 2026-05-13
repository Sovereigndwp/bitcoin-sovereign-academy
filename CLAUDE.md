# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Bitcoin Sovereign Academy is an interactive Bitcoin education platform.

- **Identity (canonical, locked 2026-04-28):** *"Bitcoin custody and inheritance for families and advisors. Bilingual. LATAM-fluent."*
- **Voice:** First-principles, inform-not-convince, composable. See **`docs/marketing/voice-spec.md`** (canonical, supersedes any prior voice guidance).
- **Tagline:** *Don't Trust, Verify.*
- **Languages:** English primary, Spanish secondary (LATAM / Colombia niche). Spanish content lives at `paths/curious/stage-1/es/` and other path subdirectories.

The platform is created by Dalia, who also runs Financially Sovereign Academy (`/Users/dalia/projects/financially-sovereign-academy`), advises at The Bitcoin Adviser (collaborative 1-of-3 multisig), and authored the curriculum for The Bitcoin Diploma (Mi Primer Bitcoin).

## Architecture

**Static site + serverless functions.** Frontend is HTML/CSS/JS with no build step for the main site. `api/` holds Vercel serverless functions (TypeScript) for payments, auth, analytics, tutor, webhooks. A local Express server (`server-local.js`) serves the same content + API for development.

```
/                      → homepage
/paths/<path>/         → learning paths (curious, builder, sovereign, principled, ...)
  stage-N/module-N.html  Each path: 4 stages × multiple modules
  stage-1/es/            Spanish localization (Curious Stage 1 currently)
/interactive-demos/    → 50+ standalone HTML demos
/deep-dives/           → long-form explainers
/dalia/                → identity hub (Phase 1 — voice spec referenced as canonical)
/api/                  → Vercel serverless: tutor, payments, auth, analytics, track
```

**Deployment:** Vercel auto-deploys from `main` (primary at bitcoinsovereign.academy); GitHub Pages secondary.

**Live data:** mempool.space, CoinGecko, Blockchain.info, Kraken. Multi-source fallback in `js/bitcoin-data-reliable.js`. Bind live values via `data-btc-live="<key>"` attribute.

**Analytics:** First-party only via `/api/track` → Supabase. No third-party trackers. Canonical entry: `js/analytics.js`. Legacy `track()` / `trackEvent()` / `abVariant()` revived via shim (`e9ca8b1f`). See `reports/funnel-diagnosis-2026-04-27.md` for instrumentation context.

**Iframes:** `vercel.json` sets `X-Frame-Options: SAMEORIGIN` for `/paths/` (allows same-domain demo embedding); other paths `DENY`. Demos use absolute CSS paths (`/css/brand.css`), never relative.

## Commands

### Local dev

- `npm run dev` — Express at `http://localhost:3000` (opens browser)
- `npm run start` — production mode
- `npm run serve:static` — Python static server on port 8080
- `npm run dev:api` — Vercel dev (serverless function testing)

### Tests

Node's built-in `node:test` + `jsdom`. No Jest/Mocha.

- `npm run test` — smoke test (`curl /api/health`). Requires the dev server already running on `:3000`; otherwise fails with `curl` exit 7.
- `npm run test:modules` — module gating tests
- `npm run tutor:evals` — tutor SYSTEM_PROMPT regression suite (run after every prompt change — see TASKS.md M1)
- Single test: `node --test path/to/test.mjs`

### Audits + lint

No single `lint` command.

- `npm run audit:all` — SEO + security + content validation
- `npm run audit:html` — html-validate on all `.html`
- `npm run audit:seo` — Lighthouse CI
- `npm run lint:services` — defunct-services lint (Paxful, Caravan, etc.)
- `npm run lint:analytics` — analytics-coverage lint
- `npm run build:utils` — typecheck util TS

### Deploy

- `git push origin main` — Vercel auto-deploys within ~60s
- `npm run deploy` — programmatic via `tools/deploy-automation.js`

## Conventions

**Brand voice (canonical):** `docs/marketing/voice-spec.md`. Three-part synthesis check (composability + first-principles + epistemic) applies pre-publish to every artifact. Operating frame is **unbounded mode** — no quizzes, no badges, no completion percentages.

**CSS tokens:** `--color-brand` (#f7931a), `--color-bg` (#0b0e14), `--color-surface`, `--color-border`, `--color-text`, `--color-muted` + `--gradient-*` / `--radius-*` / `--shadow-*` / `--space-*`. Defined in `css/brand.css`. Never introduce new design tokens — extend.

**Sanitization:** All external API data sanitized before innerHTML via `safeInt()` / `safeNum()`. External URLs and labels via `escHtml()`. No `eval`. No user-controlled innerHTML except through sanitizer.

**Lab guide system:** `/css/lab-guide.css` + `/js/lab-guide.js`. 16 labs, localStorage key `bsa_lab_completions`. Add via `<div class="lab-card" data-lab="<id>" onclick="openLab('<id>')">`.

**Reflect widget (Socratic AI):** `/js/reflect-widget.js`. Auto-inits via MutationObserver. Already on all 50 demos, 10 deep dives, 110 path modules. Add via `<div class="reflect-widget" data-topic="X" data-path="Y" data-title="Z">`.

**Live context bar:** `/js/bitcoin-context.js`. Sticky bar — block height, fees, mempool, halving countdown. 90s refresh.

**Accessibility:** WCAG 2.1 AA. Keyboard nav, `prefers-reduced-motion` respected, `:focus-visible` outlines, ARIA roles on interactive components.

**Privacy:** No third-party trackers, no ad pixels. Email tracking (opens/clicks) disabled in Resend. Server-side analytics first-party + anonymized.

## Locked conventions (do not redesign without explicit ask)

- **Logo system:** Diamond = BSA, stroke = Dalia. Production SVGs at `assets/dalia/`.
- **Footer:** `Created by Dalia · bitcoinsovereign.academy` (EN) / `Creado por Dalia · …` (ES) on every visual artifact.
- **Color carries meaning.** Default to neutral surfaces/borders. Reserve colored borders for path differentiation, genuine semantic distinction, or marking something important.
- **A–D format for design decisions.** Visual/aesthetic questions default to a 4-option A–D comparison with side-by-side mockups and a recommendation.

## Audience + design references

- **7 audience segments** drive path routing: curious, builder, sovereign, principled, hurried, pragmatist, observer. The "Find Your Path" widget on the homepage routes among them.
- **Canonical design reference:** `os.thesovereign.academy` — editorial-asymmetric, left-indented column hero, sectional bg differentiation, Playfair Display headlines + JetBrains Mono labels, 2px corners, restrained gold/orange. Read before any layout/typography work on strategic pages.
- **Visual system canonical (2026-05-03, supersedes parts of the 2026-05-01 spec):** Playfair Display + Crimson Pro + JetBrains Mono, burnished gold `#C8922A`, cream paper. See `docs/superpowers/specs/2026-05-03-component-library-plan.md` + `2026-05-03-site-wide-ia-audit.md`.

## Gotchas

- **Absolute CSS paths only.** Demos and embedded pages MUST use `/css/brand.css`, never `../css/brand.css` — relative paths break under iframe embedding and at non-root URLs.
- **`brand.css` isn't linked from `index.html`.** Homepage uses `css/tokens.css` + `css/design-tokens.css`. Edits to `brand.css` won't affect the homepage unless you add the link first.
- **Data-attribute auto-init components.** Many pages mount components from empty `<div data-*>` placeholders with auto-injection scripts. Content-grep misses them — also grep for the component's data-attr and verify with a before/after screenshot when slimming any page.
- **Unscoped feature CSS.** Some feature stylesheets (e.g. `safety-assessment.css`) define global `.btn` / `.btn-primary` rules. Grep before editing button classes anywhere.
- **`curl -I` vs `curl -i`.** Method-restricted endpoints return 405 on HEAD. Use `curl -i` (GET) when diagnosing headers, or you'll mislead yourself.
- **Push after every commit.** Vercel deploys from `origin/main`, not local. Before claiming "shipped," verify `git status -b --short` shows main NOT ahead of origin.

## Active context

- **Active spec:** `docs/superpowers/specs/2026-04-28-phase-1-identity-convergence.md` (Identity Convergence + Asset Surfacing)
- **Active plan:** `docs/superpowers/plans/2026-04-28-phase-1-identity-convergence-plan.md` (16 tasks; 1/2/3/8 shipped; 4–7 + 9–16 user-execution pending)
- **Phase 2 candidates:** `2026-04-28-distribution-engine-phase-1-design.md` (Plan A: Spanish consumer) + `2026-04-28-distribution-engine-phase-1-design-plan-b.md` (Plan B: English professional)
- **Funnel context:** `reports/funnel-diagnosis-2026-04-27.md` — ~190 sessions/month, traffic is the upstream bottleneck
- **Tasks tracker:** `TASKS.md`

## Sister project

`/Users/dalia/projects/financially-sovereign-academy` → financiallysovereign.academy. Mostly mirrors BSA conventions. Distinct lab-guide green theme; localStorage key `fsa_lab_completions`. FSA is mission-driven (underbanked) and explicitly not monetized.

## Untracked items policy

`.claude/`, `.cursor/` are tooling dirs — never committed by default (TASKS.md M3). Always review `git status` before `git add`. Single-file drafts at repo root are not committed by default — review first.
