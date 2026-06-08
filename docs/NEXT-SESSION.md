# 🧭 Next-session guideline — BSA (post Phase 3)

_Last updated: 2026-06-08. Youth front-door redesign + full brand-rollout group 1 shipped live; the youth interactive **engine** is built & verified. **Next session = youth CONTENT/pedagogy upgrade** (deferred by Dalia) — ordered tasks under "🟢 Biggest next move" below._

## ✅ Shipped LIVE this session (2026-06-08, on `main`, deployed)
- **Brand rollout group 1 (youth, all 12 pages) — LIVE.** Homepage design system applied via `css/brand-consistency.css` (`<body class="bsa-skin">`) + youth-only `css/youth-skin.css`. Commits `b53e537e` → `2958a0d0`.
  - Front-door (`youth-families/index.html`) density redesign: 4 oversized stat cards → compact metric bar; editorial left-aligned hero + one `Start Week 1` CTA; accent restraint; **green killed at the `:root` source** on all 12 pages (drift `#10b981/#0a1f1a/#1a3a2e/#2a5a4e` → canonical). Semantic `--success` kept but moved to sanctioned `#28a745`.
  - **Shared-skin bug fixed (helps every future group):** the "flatten section backgrounds" rule was matching `.section-title` headings → invisible gradient text. Now containers-only.
  - Verified: 0 drift-green on any page, 0 invisible headings, WCAG-AA holds, desktop+mobile.
- **Youth interactive ENGINE built & verified (committed `5c8d43cb`, NOT yet wired to any page → no live impact).** `js/youth-engine.js` + `css/youth-engine.css`: the **Predict → Verify → Keep → Share** loop + branching `YouthScenario` + Week-10 `YouthPlan` aggregator. Dependency-free, auto-init by data-attribute, on-brand. Live VERIFY confirmed pulling real mempool.space supply. Dev harness (local, uncommitted): `youth-families/_engine-playground.html`.
- **Differentiation SPEC (signed off):** `docs/superpowers/specs/2026-06-08-youth-pedagogy-differentiation-spec.md`. Dalia approved: **engine-first** + **reuse-first**. Keep sanctioned success-green.

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

## 🟢 Biggest next move — YOUTH CONTENT/PEDAGOGY UPGRADE (deferred to next session)

**Goal:** upgrade the 10 youth weeks from "teaches but doesn't make you DO" to the signature **Predict → Verify → Keep → Share** loop, using the now-built engine. Closes the audit's 3 weakest moat criteria (real-artifact 1.50, family-conversation 1.90, discovery 2.11). Direction is **signed off** — this is build work, not re-spec.

**Read first:** the spec `docs/superpowers/specs/2026-06-08-youth-pedagogy-differentiation-spec.md` (thesis, loop, per-week upgrade specs §6, reuse map §5) + re-open the local harness `youth-families/_engine-playground.html` (`npm run dev` → `/youth-families/_engine-playground.html`) to see the engine API in action.

**Engine API (built + HARDENED — `js/youth-engine.js` + `css/youth-engine.css`, tests `tests/youth-engine.test.mjs` 9/9):** on each week page link both CSS/JS **plus `js/analytics.js`** (so the loop's first-party events fire — `yf_predict_locked/revealed`, `yf_verified`, `yf_artifact_saved`, `yf_shared`, `yf_plan_export`…). Drop in: `.yf-predict[data-key][data-question][data-unit]` (+ `YouthLoop.reveal(key, actual, {note})`), `.yf-verify[data-claim][data-live][data-source]`, `.yf-artifact[data-key][data-title]` (+ `YouthArtifact.save('yf-w<N>-…', {...})`), `.yf-share[data-prompt]`, `.yf-scenario[data-graph]`, `.yf-plan`. localStorage convention `yf-w<N>-<slug>`.
**Hardened (this session, per Dalia's "push back" challenge):** ① bilingual — UI strings auto-switch en/es from `<html lang>` or `window.YF_LANG` (author content stays per-page via data-attrs); ② first-party analytics on every beat (guarded no-op if `track()` absent); ③ artifacts have **email/share** + a **backup-code export/import** so they survive a device switch (localStorage alone is per-device — the Week-10 dashboard would otherwise be silently empty cross-device); ④ **no streak/badge/% mechanics** (violates unbounded mode + overjustification — see spec §6b). Distribution-as-pedagogy rationale in spec §6c/§6d. **Still TODO (process):** put the Week-3 flagship in front of one real teen/educator before replicating (§5 pushback).

**Ordered tasks (T1 = flagship; validate before replicating):**
- [x] **T1 — Week 3 (Saving Strategies) flagship — SHIPPED + ELEVATED.** Full Predict→Verify→Keep→Share loop built (commits `a294ff27` / `0545b64b` / `a9af2749`), then **elevated to the sensory version** (this session): animated **reveal-gap** (your guess vs. the real number, driven by the learner's own inputs — not hardcoded) + **Race→Melt** consequence (10-yr prices-vs-your-money race → the bill desaturates via an **orange→muted fade**, no green). The consequence beat is a native in-page animation — **the spec's iframe of `savings-disappear-scenario` was abandoned** (parent CSP `frame-src`=stripe-only + demo XFO DENY block it live; see `memory/.../project_youth_iframe_blocked_use_scenario.md`). Constraints: no audio · `prefers-reduced-motion`-safe · haptics mobile-only. Verified in-browser (both branches + mobile + 0 console errors); engine loop, artifact save, share, live 21M-verify, and analytics all intact. **Process gate STILL OPEN:** put the flagship in front of one real teen/educator before replicating to T2–T6.
- [ ] **T2 — Week 10 (Family Planning): the "My Sovereign Money Plan" dashboard** (`.yf-plan`) that auto-assembles every `yf-w*` artifact into one printable family keepsake. This retroactively makes all weeks "add up" — second-highest leverage.
- [ ] **T3 — Week 6 (Smart Spending):** persist the 24-hr wishlist to localStorage (its core mechanic is currently broken across reloads) + add predict-before-reveal to the lifestyle-inflation sim.
- [ ] **T4 — Week 5 (First Paycheck):** "guess your take-home first" predict step + saved **First-Paycheck-Plan artifact** (`yf-w5-paycheck`).
- [ ] **T5 — Remaining weeks (W1/2/4/7/8/9):** apply the same wrap + embed mapped demos (W4←`emergency-fifty-scenario`, W7←`bitcoin-vs-banking`+`account-freeze-locked-out`, W1←`money-properties-comparison`). W8 college flow is the only substantial net-new. Per-week upgrade specs are in the differentiation spec §6.
- [ ] **T6 — 12–14 accessibility pass:** preset chips / example-toggles so a bright 12-year-old can solo each week (audit found the track skews to 15–17).
- [ ] **Decide:** commit the dev playground as a published "engine reference," or keep it local? (currently uncommitted)

**Then resume the BRAND ROLLOUT (group 2+):** paths entry + free modules → deep-dives → demos → standalone, same `bsa-skin` standard (now with the hardened heading-flatten fix). Map-by-role, preserve semantic colors, before/after screenshots, commit per group.

### (Archived) front-door redesign — ✅ DONE this session
The audit's #1-leverage page (`youth-families/index.html`, leverage 17.9) was redesigned + shipped live 2026-06-08 (brief: `docs/superpowers/specs/2026-06-07-youth-front-door-redesign-brief.md`).

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
