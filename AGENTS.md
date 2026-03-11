# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Before creating something new, check whether the same goal is already being served somewhere else and whether this should extend, replace, or connect to that existing asset.

## Project Overview

Bitcoin Sovereign Academy is an interactive Bitcoin education platform. The frontend is a static HTML/CSS/JS site deployed to **Vercel** (primary) and **GitHub Pages** (secondary). A local Express server (`server-local.js`) provides API endpoints for development. The `/api` directory contains Vercel serverless functions (TypeScript, CommonJS) for payments, auth, and webhooks.

## Commands

### Local Development

```bash
npm run dev              # Start Express server at http://localhost:3000 (opens browser)
npm run start            # Production mode (NODE_ENV=production)
npm run serve:static     # Static-only via Python http.server on port 8080
npm run dev:api          # Run Vercel dev for serverless function testing
```

### Testing

```bash
npm run test             # Smoke test: curls /api/health on localhost:3000
npm run test:modules     # Unit tests for module gating (node --test tests/module-gate.test.mjs)
```

Tests use Node's built-in test runner (`node:test`) and `jsdom` — there is no Jest/Mocha. To run a single test file: `node --test path/to/test.mjs`.

### Auditing and Linting

```bash
npm run audit:all        # SEO + security + content validation
npm run audit:html       # html-validate on all .html files
npm run audit:seo        # Lighthouse CI via lighthouserc.json
npm run seo:fix          # Auto-fix SEO issues
npm run security:fix     # Auto-fix security headers
npm run build:utils      # Compile TypeScript utils (js/utils/*.ts → frontend/public/js/utils)
```

There is no single `lint` command. Use `npm run audit:html` for HTML validation and `npm run build:utils` (or `tsc -p tsconfig.utils.json`) to typecheck utility TypeScript.

### Deployment

```bash
bash deploy.sh           # Interactive: commits, pushes to main, triggers Vercel + GitHub Pages
npm run deploy           # Programmatic deploy via tools/deploy-automation.js
npm run deploy:preview   # vercel --prod
```

### MCP Agent Audits

```bash
node mcp-integration/agents/planner/run.js --mode=plan --dry-run  # Preview audit tasks
node mcp-integration/agents/perf-seo/run.js                       # Run perf/SEO agent
node mcp-integration/agents/a11y/run.js                            # Run accessibility agent
```

All MCP agents support `--dry-run` to preview without side effects.

## Architecture

### Two-Layer Server Model

- **Static site**: Plain HTML pages served from the repo root. Vercel serves these directly; locally, `server-local.js` (Express) handles static serving with fallback to `index.html`.
- **Serverless API** (`/api`): TypeScript files deployed as Vercel serverless functions. Uses CommonJS (`"type": "commonjs"` in `api/package.json`). The root `package.json` uses ES modules (`"type": "module"`).

### Key Directories

- `js/` — Client-side JavaScript (ES modules loaded by HTML pages). Key files:
  - `module-gate.js` / `module-gate-subdomain.js` — Content gating and paywall logic
  - `bitcoin-data-fallback.js` — Live Bitcoin data with multi-source failover (CoinGecko, Mempool.space, Blockchain.info, Kraken)
  - `learning-path.js` / `learning-path-navigator.js` — Progress tracking and path navigation
  - `onboarding-flow.js` — Persona-based learner onboarding
  - `stripe-checkout.js` / `lightning-payment.js` — Payment UI integration
- `js/utils/` — TypeScript utilities compiled via `tsconfig.utils.json` (AB testing, certification, event tracking, persona selection, white-label)
- `css/` — Stylesheets; `design-tokens.css` defines the design system variables. `brand.css` for brand rules. CI checks for hardcoded hex colors outside `design-tokens.css`.
- `api/` — Vercel serverless functions:
  - `api/webhooks/` — Stripe, BTCPay, Alby, Zaprite webhook handlers
  - `api/auth/` — Magic link authentication
  - `api/lib/` — Shared utilities (db, email, jwt, validation)
  - `api/entitlements.ts` — JWT-based access control
  - `api/pricing.ts` — Product catalog and discount logic
- `paths/` — Learning paths (curious, builder, sovereign, principled, skeptic, hurried, pragmatist), each with stage/module HTML files
- `interactive-demos/` — 50+ standalone interactive demo pages (each in its own subdirectory with `index.html`)
- `deep-dives/` — Long-form content sections (austrian-economics, first-principles, money-banking, philosophy-economics, sovereign-tools)
- `mcp-integration/` — Automated audit agents (planner, perf-seo, content, a11y, security, dx, curriculum, analytics). Task contracts in `contracts/`, reports in `reports/`.
- `database/` — PostgreSQL/Supabase schema (`schema.sql`). Tables: users, devices, sessions, entitlements, purchases, subscriptions, referrals, webhook_events, promo_codes. RLS policies included.
- `tools/` — CLI utilities for domain management, deployment, SEO, security headers, content validation

### Content Gating

Modules use a freemium model. `js/module-gate.js` controls which content is gated:
- First module in each path is a free preview
- Subsequent modules show a lock overlay unless the user has `bsa_full_access` in localStorage, an `?unlock=true` query param, or a valid JWT entitlement
- `window.BSAModuleGate.unlock()` / `.reset()` are available for manual testing

### Vercel Routing

`vercel.json` defines rewrites for clean URLs (`/paths/:path` → `/paths/:path/index.html`, etc.) and security headers. **Important**: `/paths/` and `/interactive-demos/` routes use `X-Frame-Options: SAMEORIGIN` (not DENY) so demos can be embedded in iframes on the same domain. The catch-all route uses `X-Frame-Options: DENY`.

### External Data Sources

The platform fetches live Bitcoin data from multiple APIs with failover:
- CoinGecko (price)
- Mempool.space (fees, mempool stats, block height, difficulty)
- Blockchain.info (fallback)
- Kraken (fallback)

### Environment Variables

Copy `.env.example` to `.env.local`. Required secrets: `ZAPRITE_API_KEY`, `ZAPRITE_WEBHOOK_SECRET`, `JWT_SECRET`, `BASE_URL`. For Stripe/BTCPay, see `api/README.md`.

## CI / Quality Gates

- **ci.yml** — PR smoke tests: serves static files on port 8080, curls key pages
- **quality-gate.yml** — On push/PR to main: Lighthouse audit, axe accessibility, link checking, TypeScript type check, design token compliance (no hardcoded hex colors)

## Style and Voice

- Socratic tone: ask before telling, conversational and visual
- Bitcoin brand orange: `#f7931a` (use `var(--color-brand)` from design tokens)
- Dark theme: `#1a1a1a` background, `#2d2d2d` secondary
- Path-specific accent colors via CSS variables (`--path-curious`, `--path-builder`, etc.)
- Respect `prefers-reduced-motion` for animations
- Privacy-first: no invasive analytics, optional Plausible tracking only

## Project Identity

This repo powers Bitcoin Sovereign Academy.

This platform is Bitcoin only unless a page explicitly says otherwise.

The primary audience is smart beginners, curious professionals, families, students, and institutions who need Bitcoin explained clearly, practically, and credibly.

The main goal is to help users understand Bitcoin, why it matters, and how to use it responsibly through clear teaching, strong structure, practical examples, and interactive learning.

## Core Principles

- Prefer clarity over cleverness.
- Prefer practical teaching over abstract explanation.
- Prefer reusable structure over one-off solutions.
- Prefer simple explanations over jargon.
- Prefer grounded claims over hype.
- Prefer interaction, scenario-based learning, and guided discovery over passive blocks of text.

## Non-Negotiables

- Do not use generic crypto framing.
- Do not dilute the message by mixing Bitcoin with unrelated token content.
- Do not use vague claims, unsupported comparisons, or exaggerated promises.
- Do not create redundant explanations across pages, modules, tools, demos, or AI tutors unless the framing is materially different.
- Do not make the copy sound corporate, robotic, or generic.
- Do not create cluttered interfaces or dense educational pages.

## Teaching Rules

Every page must clearly do at least one of these: teach a concept, guide a decision, reduce a risk, support an action, or deepen understanding.

When possible, structure educational content in this order: problem → why the old way fails → what Bitcoin changes → tradeoffs → practical takeaway.

When explaining a technical topic, first explain what it is, then why it matters, then what the learner should do with that knowledge.

Use practical examples and clear scenarios whenever possible.

## Component and Page Rules

Before creating a new component, check whether an existing component can be reused or extended.

Prefer reusable components over page-specific one-offs.

Preserve consistency in headings, spacing, CTA structure, cards, buttons, and layout rhythm.

When building a new page, define: who it is for, what problem it solves, and what the learner should understand or do next.

Default page structure: clear headline → simple orientation → main sections in logical order → real examples or scenarios → clear next step.

## Demo Rules

Every interactive demo must begin with one learning objective.

The user should understand what the demo is teaching within seconds.

Prefer simple state and obvious user actions.

Use interaction to reveal the concept.

Do not rely on long explanatory text to carry the lesson.

## Verifiable Content

Never fabricate statistics, data points, percentages, dollar figures, or claims in published content. Every quantitative claim must be traceable to a named, verifiable source. Add source attribution where stats are displayed.

## Quality Control

Before finalizing, check for: repetition, weak structure, generic wording, unnecessary jargon, style drift, visual clutter, unclear next step, and unverified claims.
