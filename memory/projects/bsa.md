# Bitcoin Sovereign Academy (BSA) — Project Memory

**Domain:** bitcoinsovereign.academy (primary, Vercel) · GitHub Pages secondary
**Repo:** `/Users/dalia/projects/bitcoin-sovereign-academy`
**Owner:** Dalia (solo)
**Identity (locked 2026-04-28):** *"Bitcoin custody and inheritance for families and advisors. Bilingual. LATAM-fluent."*

## What it is

Interactive Bitcoin education platform. Static site + serverless functions. No build step for the main site. Free, content-led, English-primary with Spanish (LATAM/Colombia) secondary.

## Architecture (short)

- **Frontend:** HTML/CSS/JS at repo root + `/paths/`, `/interactive-demos/`, `/deep-dives/`, `/dalia/`.
- **`api/`:** Vercel serverless functions in TypeScript — payments, auth, analytics, tutor, webhooks.
- **`server-local.js`:** Express dev server mirroring the same content + API.
- **Live data:** mempool.space, CoinGecko, Blockchain.info, Kraken — multi-source fallback in `js/bitcoin-data-reliable.js`. Bind via `data-btc-live="<key>"`.
- **Analytics:** First-party only via `/api/track` → Supabase. Canonical entry `js/analytics.js`. Legacy `track()` / `trackEvent()` / `abVariant()` shimmed in `e9ca8b1f`.
- **Iframes:** `vercel.json` sets `X-Frame-Options: SAMEORIGIN` for `/paths/` (same-domain demo embedding); other paths `DENY`. Demos use absolute CSS paths (`/css/brand.css`) always.

## URL surface

| Path | What |
|------|------|
| `/` | Homepage. Uses `css/tokens.css` + `css/design-tokens.css` (NOT `brand.css`). |
| `/paths/<name>/` | Learning tracks: curious, builder, sovereign, principled, hurried, pragmatist, observer. 4 stages × N modules. |
| `/paths/curious/stage-1/es/` | Spanish localization of Curious Stage 1 (modules 1, 2, 3 shipped). |
| `/interactive-demos/` | 50+ standalone demos. Audited 2026-04-24 — 135 findings across 52 demos. |
| `/deep-dives/` | Long-form explainers. Includes `foundational-layer-thesis/`. |
| `/dalia/` | Identity hub (Phase 1). |
| `/weekly/` | Per-user learning dashboard + site-wide aggregated metrics. |
| `/api/` | Vercel serverless functions. |

## 7 audience segments (drive routing)

curious · builder · sovereign · principled · hurried · pragmatist · observer

Homepage "Find Your Path" widget routes among them.

## Key components

| Component | Where | Notes |
|-----------|-------|-------|
| **Tutor** | `/api/tutor` (SSE), `js/gemini-tutor-ui.js` | Claude-backed. Persona-aware (1 per segment). 20 req/min/IP rate limit. CORS allow-list. Live in production. |
| **Reflect widget** | `js/reflect-widget.js` | Socratic micro-prompts. Auto-init via MutationObserver. Lives on all 50 demos / 10 deep dives / 110 path modules. Add with `<div class="reflect-widget" data-topic="X" data-path="Y" data-title="Z">`. |
| **Lab guide** | `css/lab-guide.css` + `js/lab-guide.js` | 16 labs. `bsa_lab_completions` in localStorage. Add with `<div class="lab-card" data-lab="<id>" onclick="openLab('<id>')">`. |
| **Live context bar** | `js/bitcoin-context.js` | Sticky bar — block height, fees, mempool, halving countdown. 90s refresh. |
| **Find Your Path quiz** | Homepage | Routes to one of 7 audience segments. |

## Active context (snapshot from CLAUDE.md)

- **Active spec:** `docs/superpowers/specs/2026-04-28-phase-1-identity-convergence.md` (Identity Convergence + Asset Surfacing).
- **Active plan:** `docs/superpowers/plans/2026-04-28-phase-1-identity-convergence-plan.md` — 16 tasks; 1/2/3/8 shipped; 4–7 + 9–16 user-execution pending.
- **Phase 2 candidates:** Plan A (Spanish consumer) and Plan B (English professional) — `2026-04-28-distribution-engine-phase-1-design[-plan-b].md`.
- **Funnel context:** `reports/funnel-diagnosis-2026-04-27.md` — ~190 sessions/month; traffic is the upstream bottleneck.
- **Foundational-layer thesis:** v4 canonical (May 2026). See `memory/projects/foundational-layer-thesis.md`.

## TBA boundary + safe-CTA workstream (C3, June 2026)

Active as of 2026-06-11 (PRs #67–74). Purpose: keep BSA cleanly on the education side of the line vs. The Bitcoin Adviser's commercial custody service (conflict-of-interest hygiene), while piloting safe conversion CTAs.

- **Boundary notes:** "education, not advice" disclaimers on 10+ custody-adjacent pages (Batch C `bc6f20f9`), wording corrections on TBA mentions (Batches B `fcc3708c` / B2 `6639a702`), softened to **calendar-first** phrasing (`1b446df8`, nostr line `3f992f15`).
- **Calendar-first:** the CTA standard — route readers to a qualification calendar booking, never direct referral/sign-up language.
- **CTA pilots:** D1 glossary/emergency-kit/multisig-demo (`71ed2528`), D3 Spanish/Colombia education 3 pages (`8f5cbf87`). Measure via first-party `/api/track`.
- **Retired:** family-custody email-capture segments (`38b576b5`).
- **Content-inventory re-audit (2026-06-09):** `reports/BSA-Content-Inventory-2026-06-09-REAUDIT.xlsx` — 314 items × 17 columns, supersedes `bsa-content-inventory-2026-06-08.xlsx`. Companion dashboards: `reports/bsa-transformation-dashboard-2026-06-updated.html` (monetization boundaries + priority map) and `reports/content-inventory-dashboard.html` (Phase 2 operating dashboard). P0 promotions: sovereign-vault → lead magnet, emergency-doc + 3 product kits → paid, KYC best-practices + multisig demo → lead magnets. Top cuts: internal/demo pages need noindex; key-generator backups deletable. Files are in the repo but **uncommitted** — review before `git add` per untracked-items policy.

## Youth track (C1, June 2026)

- **Engine:** `js/youth-engine.js` + `css/youth-engine.css` — Predict→Verify→Keep→Share loop, bilingual en/es, first-party `yf_*` analytics, artifacts in localStorage (`yf-w<N>-<slug>`) with cross-device backup-code export. No streaks/badges (unbounded mode).
- **T1–T4 shipped 2026-06-08:** Week-3 flagship (sensory version — reveal-gap + Race→Melt, iframe approach abandoned due to CSP/XFO), Week-10 plan dashboard, Week-6 wishlist persistence, Week-5 paycheck artifact.
- **Open:** T5 (remaining weeks), T6 (ages-12–14 pass), real-teen/educator validation (C4), playground commit decision.

## Brand rollout (C2, June 2026)

`bsa-skin` (`css/brand-consistency.css` + `<body class="bsa-skin">`): group 1 youth ✅ 06-08, group 2 paths (110 pages) ✅ 06-10, group 3 deep-dives ✅ 06-09. Remaining: 4 demos, 5 standalone. Heading-flatten bug fixed (containers-only). Largely supersedes B6.2 — reconcile B6 scope before resuming.

## Next high-leverage bets (B1–B6 from TASKS.md)

1. **B1 Tier 2/3** — act on remaining demo-truthfulness findings. Tier 1 done.
2. **B2** — tiered reflection system (3-depth ladder) on `reflect-widget.js`.
3. **B3** — Spanish localization expansion (module-2-5, Stage 2, Builder/Sovereign paths). Stage 1 modules 2 & 3 shipped.
4. **B4** — done. Learning-outcomes instrumentation + site-wide aggregation shipped.
5. **B5** — done at Phase 1+2. Phase 3+4 deliberately won't ship — see TASKS.md for residual-risk note.
6. **B6** — visual-system cascade (sovereign-editorial). Specs landed `43dc0d6f`. B6.1 (component extraction) is the next gate.

## Commands

```
npm run dev              # Express at :3000
npm run start            # production mode
npm run serve:static     # Python static :8080
npm run dev:api          # Vercel dev (serverless testing)
npm run test             # smoke test against running :3000
npm run test:modules     # module gating tests
npm run tutor:evals      # tutor SYSTEM_PROMPT regression suite (M1)
npm run audit:all        # SEO + security + content validation
npm run audit:html       # html-validate
npm run audit:seo        # Lighthouse CI
npm run lint:services    # defunct-services lint
npm run lint:analytics   # analytics-coverage lint
npm run build:utils      # typecheck util TS
git push origin main     # Vercel auto-deploys ~60s
npm run deploy           # programmatic via tools/deploy-automation.js
```

## Conventions (do not redesign without explicit ask)

- **Logo system:** Diamond = BSA, stroke = Dalia. SVGs at `assets/dalia/`.
- **Footer:** `Created by Dalia · bitcoinsovereign.academy` (EN) / `Creado por Dalia · …` (ES).
- **Color carries meaning.** Default to neutral. Reserve color for path differentiation or genuine semantic distinction.
- **A–D format** for visual/aesthetic decisions — 4 mockups + a recommendation.
- **Voice spec canonical:** `docs/marketing/voice-spec.md`. Three-part synthesis check pre-publish.
- **Operating frame:** unbounded mode — no quizzes, badges, completion percentages.
- **Tokens:** Extend, never introduce new. `css/brand.css` holds the set.

## Gotchas

- `brand.css` is NOT linked from `index.html`. Homepage uses `tokens.css` + `design-tokens.css`. Add the link first if editing `brand.css` should affect homepage.
- Absolute CSS paths only on demos and embedded pages (`/css/brand.css`).
- Data-attribute auto-init components — content-grep misses empty `<div data-*>` placeholders.
- Unscoped feature CSS (e.g. `safety-assessment.css`) defines global `.btn`, `.btn-primary`. Grep before editing button classes.
- `curl -I` vs `curl -i` — method-restricted endpoints 405 on HEAD. Use `-i` for headers.
- Push after every commit. Vercel deploys from `origin/main`, not local.
