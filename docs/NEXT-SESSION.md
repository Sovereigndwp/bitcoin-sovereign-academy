# 🧭 Next-session guideline — BSA (post Phase 3)

_Last updated: 2026-06-06. Phase 3 content-accuracy audit complete and merged (PR #48/#49)._

## ✅ Shipped (on `main`)
- **Phase 3 content-accuracy audit** — 92 premium pages, 291 findings. Report: `reports/content-audit-premium-2026-06-06.md`.
- **22 verified mechanical fixes** + **5 flagged procedure/version fixes** + **all 4 cross-cutting patterns** (subsidy, hashrate, defunct/links, live-data bindings).
- **Preview-key flow** live + hardened (`api/preview-access.ts`, PR #46/#47).
- **Phase 4 (youth pedagogy) spec + plan + scoring anchors** — staged, not yet run.
- **API bundle fully hardened (2026-06-06).** `api/package.json` now declares all four external runtime deps (`jsonwebtoken`, `pg`, `stripe`, `@supabase/supabase-js`) so `@vercel/nft` traces them deterministically. Closes the `FUNCTION_INVOCATION_FAILED` class flagged as a follow-up in PR #47. (Commits `7e0ea61` + `561701f`.)

## 🔴 Do first (housekeeping)
1. **Rotate `PREVIEW_ACCESS_KEY`** — ✅ new key set in Vercel (2026-06-06). **Last confirm:** hit your own buyer link (`…/api/preview-access?key=<NEW_KEY>&next=/`) and check it 302-redirects; the old/leaked key now returns 403. (Note: the rotation redeploy was a cache-reuse "Redeploy" that briefly dropped `pg` and 500'd all db-backed endpoints — fixed by the API bundle hardening above. **Going forward, redeploy with build cache OFF, or push an empty commit, never plain "Redeploy."**)
2. **Branch cleanup** — merged branches pruned 2026-06-06. Re-check periodically with `git branch --merged main`.

## 🟢 Biggest next move
3. **Launch Phase 4 — Youth Pedagogy & Readiness Audit.** Everything's ready:
   - Spec: `docs/superpowers/specs/2026-06-06-phase-4-pedagogy-youth-readiness-audit-design.md`
   - Plan + 1–5 anchors: `docs/superpowers/plans/2026-06-06-phase-4-pedagogy-youth-readiness-audit-plan.md`
   - Scope: ~27 youth-funnel pages · 15 criteria · 3 age bands (12–14 / 15–17 / adult) · calibration pass · scorecard deliverable (no auto-fix).
   - **Kickoff prompt:** _"Execute the Phase 4 pedagogy plan — run the classify/score workflow and produce the scorecard report."_

## 🟡 Phase 3 follow-ups (optional, report-only)
4. **159 🟡 + 79 🟢 findings** — batched cleanup pass (esp. remaining stale-data); see the report.
5. **2 flagged JS-wiring items** — mining-demo live price (display vs `* 43000` desync) in `deep-dives/first-principles/index.html` + `original-question-everything.html`. Only if you want those calculators to use live price.
6. **Audit scope gap** — the audit covered each deep-dive's `index.html` only; **deep-dive sub-pages** (e.g. `original-question-everything.html`, `digital-scarcity.html`, austrian/bitcoin-capital sub-pages) were never fully audited. Worth a focused pass.

## 🩹 CI hygiene (pre-existing, red on `main`)
7. **`quality-check` "404s"** — 12 broken internal links in untouched files: `articles/bitcoin-complete-guide.html` (→ `/answers/*`), `principled/stage-5/module-2&3` (→ missing `css/main.css`), `sovereign/stage-3/monetary-alternatives.html` (→ missing `module-previous/next.html`, `/js/path-module.js`), `paths/curious/stage-1/es/module-2.html` (→ non-existent `deep-dives/money-creation.html` & `fractional-reserve.html`), 2 interactive-demos (missing js). Fixable cleanup.
8. **`Broken Link Detection`** — mostly markdown-link-check false-positives (`fred.stlouisfed.org`, `bls.gov`, `federalreservehistory.org`, `canva.com`, `coinbase`, `coingecko` return 403/0 to CI bots) + a literal `github.com/your-org/...` placeholder. Fix = allowlist those domains in the markdown-link-check config + fix the placeholder.

## ⚠️ Watch-outs (carried lessons)
- **Vercel "Redeploy" can drop bundled deps** (caused a `jsonwebtoken` 500). After any rotation/redeploy, verify `/api/preview-access?key=wrong` returns **403**, not 500. (Also recorded in `~/.claude/rules/ca-errors.md`.)
- **Don't blind-sweep content.** Many "6.25 BTC" / "$X price" instances are *correct historical/illustrative* — classify before editing. Phase 3 used adversarial verification + per-instance classification for exactly this reason (of 71 hardcoded live values, only 8 were truly current-live).
- **Push after every commit**; verify `git status -b` is not ahead of origin before claiming shipped.
- **`brand.css` is not linked from `index.html`**; demos use absolute CSS paths only.
