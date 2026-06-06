# Shareable Catalog + Demo Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `main` serve a clean, on-brand, buyer-shareable catalog of demos + deep dives, unlockable in full via a server-issued preview key, with duplicates feature-merged-then-archived and consistent navigation.

**Architecture:** One codebase, two audiences. A key-gated serverless endpoint mints the existing `bsa_premium_route` JWT cookie (reusing `api/lib/premium-route-access.ts`) so the buyer unlocks server-protected paths/deep-dives; a readable marker cookie unlocks client-gated demos. The Demos + Deep Dives index pages are de-flashed to the homepage look. Duplicate demos get their best features merged into the keeper, then the loser is archived (not deleted). A parallel workflow adds context-aware navigation and verifies every demo loads.

**Tech Stack:** Static HTML/CSS/JS, Vercel serverless (TypeScript, `@vercel/node`), `node:test`, html-validate, preview tools.

**Branch:** `feat/shareable-catalog` (off `main`). Spec: `docs/superpowers/specs/2026-06-04-demo-cleanup-shared-access-design.md`.

**Checkpoints (pause for Dalia):** ① card A–D mockups → ② archive decisions → ③ index goes live → ④ final review.

---

## Phase 1 — Shared access (server preview key)

### Task 1: Inspect the premium-route lib signatures (read-only)

**Files:**
- Read: `api/lib/premium-route-access.ts`, `api/dev/unlock-all.ts`, `api/lib/origin.ts`

- [ ] **Step 1:** Confirm exact signatures used below: `buildPremiumRouteClaims({userId, tier, allPremium, pathIds, deepDives, source})`, `signPremiumRouteToken(claims, {maxAgeSeconds}) -> {token, maxAgeSeconds}`, `serializePremiumRouteCookie(token, {isSecure, maxAgeSeconds})`, `ALL_PREMIUM_PATH_IDS`, `setCorsHeaders(req,res,methods,headers)`. If any differ, adjust Task 2 code to match. No commit.

### Task 2: Create the key-gated preview-access endpoint

**Files:**
- Create: `api/preview-access.ts`
- Reference (copy structure from): `api/dev/unlock-all.ts`

- [ ] **Step 1: Write the endpoint**

```ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import { timingSafeEqual } from 'node:crypto';
import { setCorsHeaders } from './lib/origin';
import {
  ALL_PREMIUM_PATH_IDS,
  buildPremiumRouteClaims,
  serializePremiumRouteCookie,
  signPremiumRouteToken
} from './lib/premium-route-access';

// Default 30-day buyer preview window; override with PREVIEW_ACCESS_MAX_AGE_DAYS.
const DEFAULT_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

function getMaxAgeSeconds(): number {
  const days = Number(process.env.PREVIEW_ACCESS_MAX_AGE_DAYS);
  return Number.isFinite(days) && days > 0 ? Math.floor(days * 24 * 60 * 60) : DEFAULT_MAX_AGE_SECONDS;
}

function keysMatch(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function getSafeNext(input: unknown): string {
  if (typeof input === 'string' && input.startsWith('/') && !input.startsWith('//')) return input;
  return '/';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(req, res, 'GET, POST, OPTIONS', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const expected = process.env.PREVIEW_ACCESS_KEY;
  const provided = (req.query.key as string | undefined) || (req.body?.key as string | undefined);

  if (!expected || !provided || !keysMatch(provided, expected)) {
    return res.status(403).json({ error: 'Invalid preview key' });
  }

  const maxAgeSeconds = getMaxAgeSeconds();
  const claims = buildPremiumRouteClaims({
    userId: 'preview-buyer',
    tier: 'developer',
    allPremium: true,
    pathIds: [...ALL_PREMIUM_PATH_IDS],
    deepDives: true,
    source: 'preview-key'
  });
  const { token, maxAgeSeconds: cookieMaxAge } = signPremiumRouteToken(claims, { maxAgeSeconds });

  // Server cookie (httpOnly) unlocks server-protected paths/deep-dives.
  const serverCookie = serializePremiumRouteCookie(token, { isSecure: true, maxAgeSeconds: cookieMaxAge });
  // Readable marker cookie unlocks client-gated demos (membership-gate.js reads it).
  const markerCookie = `bsa_preview=1; Path=/; Max-Age=${cookieMaxAge}; SameSite=Lax; Secure`;
  res.setHeader('Set-Cookie', [serverCookie, markerCookie]);
  res.setHeader('Cache-Control', 'no-store');

  const next = getSafeNext((req.query.next as string | undefined) || req.body?.next);
  return res.redirect(302, next);
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit api/preview-access.ts` (or `npm run build:utils` if it covers `api/`)
Expected: no type errors. Fix import paths/signatures against Task 1 findings if needed.

- [ ] **Step 3: Commit**

```bash
git add api/preview-access.ts
git commit -m "feat(access): key-gated preview-access endpoint mints full-access cookie"
```

### Task 3: Teach the client demo gate to recognize the preview cookie

**Files:**
- Modify: `js/membership-gate.js` (top of IIFE / start of `init()`, around line 58)

- [ ] **Step 1: Add a cookie helper + bypass near the top of `init()`**

Insert at the very start of `async init()` (before `this.clearLegacyOwnerState();`):

```js
// Preview-key sessions (set by /api/preview-access) bypass client demo gating.
if (document.cookie.split('; ').some(c => c === 'bsa_preview=1')) {
    this.initialized = true;
    return;
}
```

- [ ] **Step 2: Verify locally**

Run: `npm run dev` (server on :3000). In the browser console set `document.cookie='bsa_preview=1; path=/'`, load a premium demo, confirm no gate overlay. Clear cookie, reload, confirm gate returns.

- [ ] **Step 3: Run gating tests**

Run: `npm run test:modules`
Expected: PASS (no regressions).

- [ ] **Step 4: Commit**

```bash
git add js/membership-gate.js
git commit -m "feat(access): client demo gate honors bsa_preview marker cookie"
```

### Task 4: Confirm subdomain gate leftovers are inert

**Files:**
- Read: `js/module-gate-subdomain.js`, `js/demo-lock-subdomain.js`

- [ ] **Step 1:** Determine whether either still gates on `bitcoinsovereign.academy` (vs. only the deprecated `learn.` subdomain). If inert, note it. If they still gate premium content, add the same `bsa_preview` bypass at their entry point. Commit only if a change was needed:

```bash
git add js/module-gate-subdomain.js js/demo-lock-subdomain.js
git commit -m "fix(access): honor preview cookie in legacy subdomain gates"
```

### Task 5: Document the buyer link + env var

**Files:**
- Modify: `docs/superpowers/specs/2026-06-04-demo-cleanup-shared-access-design.md` (append a "Buyer handoff" note) OR a new `docs/preview-access.md`

- [ ] **Step 1:** Write: set `PREVIEW_ACCESS_KEY` (and optional `PREVIEW_ACCESS_MAX_AGE_DAYS`) in Vercel env. Buyer link = `https://bitcoinsovereign.academy/api/preview-access?key=<KEY>&next=/`. Revoke by rotating/removing the env var. Commit.

> **CHECKPOINT (access):** Confirm with Dalia the key string + expiry window before going to production. Dalia sets the env var in Vercel (agent cannot).

---

## Phase 2a — Catalog redesign (Demos + Deep Dives)

### Task 6: Build A–D card mockups (CHECKPOINT ①)

**Files:**
- Create (throwaway): `mockups/catalog-card-a.html` … `catalog-card-d.html` (or one file with 4 sections)

- [ ] **Step 1:** Read current card markup + styles in `interactive-demos/index.html` (note the `body::before` radial glow and `linear-gradient` card/button fills to remove).
- [ ] **Step 2:** Build 4 small mockups of the catalog grid using **real** demo titles/descriptions, all on the homepage look (`/css/design-tokens.css` + `/css/brand.css`), varying: card size, density, where the gold accent lands, whether a category tag shows. No gradients/glow in any.
- [ ] **Step 3:** Serve via `npm run dev` and screenshot each with preview tools.
- [ ] **Step 4: STOP.** Present A–D side by side with a recommendation. Dalia picks. The chosen design drives Tasks 7–8. Do not proceed without a pick.

### Task 7: Apply chosen card design to the Demos catalog

**Files:**
- Modify: `interactive-demos/index.html`
- Possibly modify: `css/interactive-demos.css`

- [ ] **Step 1:** Remove `body::before` radial glow and replace `linear-gradient(...)` card/button fills with neutral `var(--color-surface)` + 1px `var(--color-border)`; reserve `var(--color-brand)` for category tag / primary CTA only.
- [ ] **Step 2:** Apply the chosen card sizing/grid from Task 6. Ensure each card shows title · one-line · time · category.
- [ ] **Step 3: Verify** via preview tools: screenshot at desktop + mobile widths (`preview_resize`); confirm no console errors; confirm gold appears only on tags/CTAs.
- [ ] **Step 4: Commit** `git commit -m "style(catalog): de-flash demos index to homepage look, smaller neutral cards"`

### Task 8: Apply the same card system to Deep Dives

**Files:**
- Modify: `deep-dives/index.html`

- [ ] **Step 1:** Apply the identical card system + de-flash to the 7 deep-dive cards.
- [ ] **Step 2: Verify** via preview screenshot (desktop + mobile).
- [ ] **Step 3: Commit** `git commit -m "style(deep-dives): apply catalog card system"`

### Task 9: Reconcile demos/ and tools/ into one menu

**Files:**
- Modify: `demos/index.html`, `tools/index.html`
- Reference: `vercel.json` (rewrites)

- [ ] **Step 1:** Decide redirect vs. thin pointer (default: make `demos/index.html` and the public-facing `tools/index.html` redirect to `interactive-demos/` via `<meta http-equiv="refresh">` or a `vercel.json` redirect; keep internal ops tools/dashboards out of the public catalog). Preserve inbound links (no 404s).
- [ ] **Step 2: Verify** both old URLs land on the canonical catalog (preview tools).
- [ ] **Step 3: Commit** `git commit -m "refactor(catalog): single canonical demos catalog; redirect legacy index pages"`

> **CHECKPOINT ③ (index live):** Present the redesigned Demos + Deep Dives catalogs to Dalia before merge/deploy.

---

## Phase 2b — Dedup via feature-merge → archive (CHECKPOINT ②)

For each cluster: compare, port the loser's valuable unique features into the keeper, verify the keeper still loads, then `git mv` the loser into `archive/`. **Present the winner + ported features to Dalia before archiving.**

### Task 10: fee-master-tool vs mempool-visualizer

**Files:**
- Compare: `interactive-demos/fee-master-tool/index.html`, `interactive-demos/mempool-visualizer/index.html`
- Likely keeper: `mempool-visualizer`; likely archive: `fee-master-tool`

- [ ] **Step 1:** Diff capabilities; list features `fee-master-tool` has that `mempool-visualizer` lacks (e.g. specific fee-calculation widgets).
- [ ] **Step 2: STOP** — present keeper choice + features-to-port to Dalia. Get approval.
- [ ] **Step 3:** Port approved features into the keeper; verify it loads (preview).
- [ ] **Step 4:** Archive the loser: `git mv interactive-demos/fee-master-tool archive/interactive-demos/fee-master-tool`. Remove its card from `interactive-demos/index.html`.
- [ ] **Step 5: Commit** `git commit -m "refactor(demos): merge fee-master into mempool-visualizer; archive duplicate"`

### Task 11: security-dojo-enhanced vs security-risk-simulator.html

**Files:**
- Compare: `interactive-demos/security-dojo-enhanced/index.html`, `interactive-demos/security-risk-simulator.html`
- Likely keeper: `security-dojo-enhanced`

- [ ] **Step 1–5:** Same flow as Task 10 (compare → CHECKPOINT → port → archive `security-risk-simulator.html` to `archive/interactive-demos/` → remove card → commit).

### Task 12: Archive wallet-workshop redundant entry point

**Files:**
- Modify: `interactive-demos/wallet-workshop/` (the `interactive.html` alt entry point)

- [ ] **Step 1:** Confirm nothing links to `wallet-workshop/interactive.html`; if links exist, repoint to `index.html`.
- [ ] **Step 2:** `git mv interactive-demos/wallet-workshop/interactive.html archive/interactive-demos/wallet-workshop-interactive.html`
- [ ] **Step 3: Commit** `git commit -m "refactor(demos): archive redundant wallet-workshop entry point"`

---

## Phase 2c — Context-aware navigation + load sweep

### Task 13: Build the shared nav helper

**Files:**
- Create: `js/demo-nav.js`
- Reference: `css/interactive-demos.css` (style the bar)

- [ ] **Step 1: Write the helper.** On DOMContentLoaded, inject a small top bar with two links:
  - **"← Back":** target = `?from=<url>` param if present and internal; else `document.referrer` if it is a same-origin `/paths/` or `/deep-dives/` URL; else hidden.
  - **"Home":** always present, `href="/"`.
  Use absolute paths only. Escape any URL via existing `escHtml()` pattern.

```js
(function () {
  function internalUrl(u) {
    try { const x = new URL(u, location.origin); return x.origin === location.origin ? x.pathname + x.search : null; }
    catch { return null; }
  }
  function backTarget() {
    const fromParam = new URLSearchParams(location.search).get('from');
    const fromInternal = fromParam && internalUrl(fromParam);
    if (fromInternal) return fromInternal;
    const ref = document.referrer && internalUrl(document.referrer);
    if (ref && (/^\/paths\//.test(ref) || /^\/deep-dives\//.test(ref))) return ref;
    return null;
  }
  function mount() {
    if (document.querySelector('.demo-nav')) return;
    const back = backTarget();
    const bar = document.createElement('nav');
    bar.className = 'demo-nav';
    bar.innerHTML =
      (back ? `<a class="demo-nav-back" href="${back}">← Back</a>` : '') +
      `<a class="demo-nav-home" href="/">Home</a>`;
    document.body.insertBefore(bar, document.body.firstChild);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
```

- [ ] **Step 2: Add `.demo-nav` styles** to `css/interactive-demos.css` (neutral surface, small, sticky-top optional, gold only on hover). 
- [ ] **Step 3: Commit** `git commit -m "feat(nav): shared context-aware demo/deep-dive nav helper"`

### Task 14: Parallel workflow — mount nav helper + verify load across all demos

This runs as a **Workflow** (opt-in already given). Pipeline over the surviving demos + deep-dive pages: audit → edit → verify.

- [ ] **Step 1:** Build the work-list: all `interactive-demos/*/index.html`, the standalone `interactive-demos/*.html` (minus archived), root `multisig-security-demo.html` + `emergency-kit.html`, and `deep-dives/*/index.html`. (~48 pages.)
- [ ] **Step 2:** Author + run the workflow (script below). Each page: confirm `<script src="/js/demo-nav.js">` is present before `</body>` (insert if missing, after the existing `membership-gate.js` script per the established insert convention); confirm the page loads via preview tools with no console errors.
- [ ] **Step 3:** Review the workflow's structured report; fix any failures by hand.
- [ ] **Step 4: Commit** `git commit -m "feat(nav): mount demo-nav across all demos + deep-dives; verify load"`

**Workflow script outline** (`Workflow` tool):

```js
export const meta = {
  name: 'demo-nav-sweep',
  description: 'Add /js/demo-nav.js to each demo/deep-dive and verify it loads',
  phases: [{ title: 'Audit' }, { title: 'Edit' }, { title: 'Verify' }],
};
const PAGES = args; // array of absolute file paths passed in
const SCHEMA = { type: 'object', properties: { path: {type:'string'}, hadNav:{type:'boolean'}, edited:{type:'boolean'}, loads:{type:'boolean'}, notes:{type:'string'} }, required:['path','loads'] };
const results = await pipeline(
  PAGES,
  (p) => agent(`Read ${p}. Report whether it already loads /js/demo-nav.js and whether it links to '/'. Return JSON.`, {phase:'Audit', schema: SCHEMA}),
  (audit, p) => agent(`In file ${p}: if /js/demo-nav.js is not already loaded, add <script src="/js/demo-nav.js"></script> immediately after the membership-gate.js script tag (or before </body> if absent). Do not touch anything else. Return JSON with edited=true/false.`, {phase:'Edit', schema: SCHEMA}),
  (edit, p) => agent(`Using preview tools, load the page served from ${p} on the running dev server and report loads=true if it renders with no console errors, plus any error in notes. Return JSON.`, {phase:'Verify', schema: SCHEMA})
);
return results.filter(Boolean);
```

> Run with the dev server already up (`npm run dev`). Cap concurrency is automatic. Background run; review the report.

---

## Phase: Verification + handoff

### Task 15: Full verification pass

- [ ] **Step 1:** `npm run test:modules` → PASS.
- [ ] **Step 2:** `npm run audit:html` → no new errors on changed files.
- [ ] **Step 3:** Manual: hit `/api/preview-access?key=<KEY>&next=/deep-dives/austrian-economics/` on a preview deploy → confirm deep-dive (server-protected) renders unlocked; open a premium demo → unlocked; open an incognito window without the key → gated.
- [ ] **Step 4:** Spot-check 5 demos: nav bar present, Back returns to origin when arriving from a path, Home works.

### Task 16: PR (CHECKPOINT ④)

- [ ] **Step 1:** `git push -u origin feat/shareable-catalog`
- [ ] **Step 2:** Open PR into `main` summarizing phases, archived items, and the buyer link mechanism. Present to Dalia for final review before merge. After merge, the `test` branch (gate-disable) is obsolete and can be deleted.

---

## Notes for the implementer

- **Absolute CSS/JS paths only** (`/css/…`, `/js/…`) — relative paths break under iframe embedding and at non-root URLs.
- **Never delete a demo** — archive via `git mv` into `archive/`. Files must remain runnable (sellable inventory).
- **`brand.css` is not linked from the homepage**, but the catalog pages here DO link it — safe to rely on its tokens for the catalog redesign.
- **Color carries meaning:** neutral surfaces/borders by default; gold only for category tags / CTAs / genuine emphasis.
- Footer convention on any visual artifact: `Created by Dalia · bitcoinsovereign.academy`.
