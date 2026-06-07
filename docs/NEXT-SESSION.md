# 🧭 Next-session guideline — BSA (post Phase 3)

_Last updated: 2026-06-07. Phase 4 youth audit shipped (PR #50); cheap wins (PR #53) + CI hygiene (PR #51/#52) follow-ons done._

## ✅ Shipped (on `main`)
- **Phase 3 content-accuracy audit** — 92 premium pages, 291 findings. Report: `reports/content-audit-premium-2026-06-06.md`.
- **22 verified mechanical fixes** + **5 flagged procedure/version fixes** + **all 4 cross-cutting patterns** (subsidy, hashrate, defunct/links, live-data bindings).
- **Preview-key flow** live + hardened (`api/preview-access.ts`, PR #46/#47).
- **Phase 4 (youth pedagogy) spec + plan + scoring anchors** — staged, not yet run.
- **API bundle fully hardened (2026-06-06).** `api/package.json` now declares all four external runtime deps (`jsonwebtoken`, `pg`, `stripe`, `@supabase/supabase-js`) so `@vercel/nft` traces them deterministically. Closes the `FUNCTION_INVOCATION_FAILED` class flagged as a follow-up in PR #47. (Commits `7e0ea61` + `561701f`.)

## ✅ Housekeeping (done)
1. **`PREVIEW_ACCESS_KEY` rotation — DONE + confirmed (2026-06-07)** via a 302 on the buyer link. (Diagnostic lessons recorded: a **404** = wrong host, GitHub Pages/preview mirror has no `/api/`; a **403** = byte-mismatch via `timingSafeEqual` — old key in link / trailing whitespace in the env value / URL-unsafe chars; use `openssl rand -hex 32` to avoid encoding pitfalls. **Never plain "Redeploy"** — build-cache-OFF or an empty commit, since cache reuse can drop a traced dep.)
2. **Branch cleanup** — merged branches pruned 2026-06-06. Re-check periodically with `git branch --merged main`.

## ✅ Phase 4 done (2026-06-07)
3. **Phase 4 — Youth Pedagogy & Readiness Audit — shipped (PR #50).** Report: `reports/pedagogy-youth-audit-2026-06-06.md`. Headline: the funnel teaches but doesn't make learners *do* — the moat criteria (real-artifact **1.50**, family-conversation **1.90**, discovery **2.11**) are the platform's weakest. Calibration clean (mean |Δ| 0.52). Cross-cutting cheap wins **A + B shipped** in PR #53 (reflect-widget on all 10 youth weeks + family-conversation prompts on 8).

## 🟢 Biggest next move
**Spec the youth front-door redesign** (`youth-families/index.html`) — the audit's **#1-leverage page** (leverage 17.9; teaches nothing; fails the 12-year-old solo).
   - **Brief (read this):** `docs/superpowers/specs/2026-06-07-youth-front-door-redesign-brief.md` — full context, constraints, what the spec must contain, and the kickoff prompt.
   - This is **spec-first** (brainstorm → spec → sign-off → code). A–D mockup format for visual decisions; honor unbounded mode.
   - **Kickoff prompt:** _"Brainstorm and then write a design spec for redesigning the youth front door per `docs/superpowers/specs/2026-06-07-youth-front-door-redesign-brief.md` — stop at the spec for my sign-off before any code."_

## 🟡 Phase 3 follow-ups (optional, report-only)
4. **159 🟡 + 79 🟢 findings** — batched cleanup pass (esp. remaining stale-data); see the report.
5. **2 flagged JS-wiring items** — mining-demo live price (display vs `* 43000` desync) in `deep-dives/first-principles/index.html` + `original-question-everything.html`. Only if you want those calculators to use live price.
6. **Audit scope gap** — the audit covered each deep-dive's `index.html` only; **deep-dive sub-pages** (e.g. `original-question-everything.html`, `digital-scarcity.html`, austrian/bitcoin-capital sub-pages) were never fully audited. Worth a focused pass.

## ✅ CI hygiene (resolved 2026-06-07)
7. **`quality-check` GREEN (PR #51).** Fixed 12 broken internal links + malformed `manifest.json` (missing comma) + removed an accidental tracked "Save Page As" dir that crashed the perf-check step under CI's bash-5 errexit. The job was a chain of pre-existing hard-fail landmines, each masking the next.
8. **`Broken Link Detection` GREEN (PR #52).** The referenced `.github/link-check-config.json` never existed → markdown-link-check ran with no allowlist. Added the config (aliveStatusCodes for bot-blocked codes + ignorePatterns for local-path mis-resolution), made the markdown step advisory (`continue-on-error`, matching the lychee step), and fixed the `your-org` placeholder. **Carried lesson:** hard-gating external-link liveness on PRs is an anti-pattern — links rot/bot-block; keep it advisory. Genuine external 404s (cointelegraph BIP-360, ic3 PSA, sparrow AppImage, chicagofed PDF) still surface in the advisory log for later content cleanup.

## ⚠️ Watch-outs (carried lessons)
- **Vercel "Redeploy" can drop bundled deps** (caused a `jsonwebtoken` 500). After any rotation/redeploy, verify `/api/preview-access?key=wrong` returns **403**, not 500. (Also recorded in `~/.claude/rules/ca-errors.md`.)
- **Don't blind-sweep content.** Many "6.25 BTC" / "$X price" instances are *correct historical/illustrative* — classify before editing. Phase 3 used adversarial verification + per-instance classification for exactly this reason (of 71 hardcoded live values, only 8 were truly current-live).
- **Push after every commit**; verify `git status -b` is not ahead of origin before claiming shipped.
- **`brand.css` is not linked from `index.html`**; demos use absolute CSS paths only.
