# Bitcoin Sovereign Academy — Full Repository Audit

> Read-only audit, 2026-06-08. No files changed. Objective: a cleaner, more focused, more profitable site — not a more feature-rich one.
> Method: codebase map (`.ca/map.md`) + the 208-page scored content inventory (`reports/bsa-content-inventory-2026-06-08.xlsx`) + 5 parallel evidence-based scans (dead code, link graph, unused assets, path strategy, conversion/homepage). Link graph honored `vercel.json` `cleanUrls` + rewrites (a naive disk checker over-reports ~245 false breaks).

---

## Executive summary — the 8 highest-leverage moves

| # | Move | Type | Why it matters |
|---|------|------|----------------|
| 1 | **Fix the broken revenue links** — `field-manual/`, `learn/self-custody-master/`, `tools/multisig-demo/` are linked from all 3 paid-kit pages and **404** | Critical / Revenue | The money pages point at pages that don't exist |
| 2 | **Reframe the homepage hero to the positioning** — it reads "learn Bitcoin," not "custody & inheritance for families and advisors"; **no bilingual affordance at all** | Revenue / Positioning | The #1 entry point contradicts the locked identity |
| 3 | **Collapse 7 learning paths → 3 + 1 essay collection** (merge Hurried into Curious; demote Principled + Builder) | Consolidation / UX | Kills the system's biggest redundancy and refocuses on the funnel |
| 4 | **Finish Sovereign's 3 live "Content in development" stage indexes** (incl. Inheritance) | Critical | A credibility leak on the single most monetizable, on-positioning path |
| 5 | **Add products / youth-families / programa-colombia / institutional to `sitemap.xml`** (3 months stale, omits all of them) | Revenue / SEO | The monetization pages and the entire LATAM surface are invisible to search |
| 6 | **Correct the stale "Dead Code" note in `CLAUDE.md` + memory** before anyone acts on it | Critical / Safety | It lists live checkout JS as "dead" — deleting per the note breaks payments |
| 7 | **Delete the confirmed dead assets** (~17 JS + 3 CSS + all untracked backups/mockups) | Deletion / Maintenance | ~360 KB of dead code; 3 parallel header-config files are a foot-gun |
| 8 | **Give the homepage + 88 dead-end education pages one next step each** (capture or offer) | Revenue / UX | The widest part of the funnel currently leaks |

---

## 1. Critical fixes (do first — broken/blocking)

1. **Paid-kit dead links (revenue-blocking).** All three `products/*` pages link to pages that 404:
   - `products/self-custody-starter-kit/` → `/field-manual/` and `/learn/self-custody-master/`
   - `products/advisor-bitcoin-client-kit/` → `/field-manual/?tier=advisor`
   - `products/family-bitcoin-recovery-kit/` → `/tools/multisig-demo/` (a real multisig demo exists at `/paths/sovereign/stage-2/module-1.html` — the link points at a dead path)
   → Build the targets or repoint the links. These are on the pages where money changes hands.

2. **`bitcoin-security-review/` — 16 broken inbound links** (highest-fanout missing target). Every `answers/*` page + `articles/bitcoin-complete-guide.html` links to it; it doesn't exist. Create it or redirect.

3. **`answers/` cluster — ~90 broken links from slug truncation.** Files saved with truncated slugs; cross-links use the full slug. Regenerate filenames to match (or fix the generator) + create the 7 missing topic pages (`what-is-a-seed-phrase`, `how-to-set-up-hardware-wallet`, `bitcoin-inheritance-planning`, …). Clears the majority of the 112 broken links in one pass.

4. **`paths/pragmatist/stage-1` nav chain is broken.** module-1 "next" and module-3 links point to bogus root-absolute URLs (`https://bitcoinsovereign.academy/module-1.html`), so **modules 2 & 4 are unreachable** — a learner literally cannot progress. (Pragmatist is slated for demotion anyway, but this is a live break today.)

5. **Sovereign ships drafts in production.** `paths/sovereign/stage-2/index.html`, `stage-3/index.html`, `stage-4/index.html` show "▇ Content in development" placeholders — including **Inheritance Planning**, the heart of the positioning. Finish or hide until ready.

6. **Stale "Dead Code" memory is dangerous.** `CLAUDE.md` + `MEMORY.md` list `js/checkout.js` and `js/stripe-checkout.js` as "superseded by /api/pay," but both are still `<script>`-loaded by live pages (`checkout.html`, `membership.html`, `membership-success.html`). The `gemini-*` files are also live (the Claude tutor aliases `window.geminiService` and reuses the gemini UI). **Correct the note before any cleanup agent acts on it.**

---

## 2. Revenue opportunities (ranked)

1. **Surface the actual positioning on the homepage.** Hero says "Bitcoin education, without the confusion" / title "Learn Bitcoin." "Families" and "advisors" appear nowhere above the fold; custody/inheritance only as a mid-sentence list item. The meta description is on-positioning but the visible hero isn't. Rewrite the hero around custody + inheritance + a clear families/advisors split. (See §5.)
2. **Open the advisor on-ramp.** The advisor/family value prop is half the positioning, but the only booking CTA (`meetings.hubspot.com/dalia-platt`) is buried in the Institutional dropdown. Put a "For Advisors" / "Book a custody consult" path in the main flow.
3. **Make the site bilingual where it claims to be.** Homepage is `lang="en"`, no `hreflang`, no switcher, no link to `/programa-colombia/` or `/es/`. A LATAM visitor gets zero Spanish signal on the front door. Add a language switcher + hreflang; link the Colombia program.
4. **Fix SEO discoverability of money + LATAM pages.** `sitemap.xml` (stale, Mar 8) omits **all 3 kits, youth-families, programa-colombia, institutional**. Regenerate it. Free revenue/traffic.
5. **Continue the kit-routing layer (PR #55) but go wider.** Even with PR #55, only ~20 of 145 education pages link to a kit. The DIY self-custody → $49-kit pattern is proven; extend it (script-driven) to the rest of the eligible pages.
6. **Re-add email capture to the homepage.** Capture is on 177 pages — but not the #1 entry point (removed 2026-05-02). The highest-traffic page has the weakest capture.
7. **Resolve the membership-vs-kit muddle.** Membership tiers (Free / Sats-earn-back ~$37 / Sovereign Lifetime $399) still carry pre-"unbounded-mode" badge/earn-back framing that conflicts with the no-badges convention and competes with the cleaner one-time kits. Pick the primary monetization spine (recommend: kits + advisor consults; demote earn-back).

---

## 3. Conversion map

```
ENTRY (SEO/social)                AWARENESS            EDUCATION (70% of site)        CAPTURE              OFFER                     CONVERSION
─────────────────                 ─────────            ──────────────────────        ───────              ─────                     ──────────
Homepage (no capture, generic) ─┐  7 path landings ──┐  ~110 path modules ──────────┐  email-capture on    kits linked from        3 kit pages
50 demos (strong SEO) ──────────┤  demo catalog ─────┤  50 demos ───────────────────┤  177 pages + exit-   8 pages (main) /         + onramp-chooser
10 deep-dives ──────────────────┤  (route inward,    │  10 deep-dives               │  intent modal        ~20 (PR #55)             + 2 path modules
youth-families (DEAD END) ──────┘   rarely to offers) │                              │  (NOT on homepage)   membership (muddy)       = 6 of 208 pages
programa-colombia (orphan,                            │  88 pages: no offer,         │                      advisor booking:         convert
 not in sitemap) ─────────────────────────────────────┘  no next step ──────────────┘                      1 dropdown link only
```

**Entry points:** homepage, 50-demo catalog (strongest indexed surface), 7 path landings, deep-dives. **Email capture:** broadly deployed (177 pages, `/api/subscribe`, local store; Substack URL blank) — but absent on the homepage. **Membership:** 3 tiers via `membership.html` + 2-section free gate (`js/module-gate.js`). **Products:** 3 kits ($49 / $149 / $499), card + Lightning, in the homepage "Kits" dropdown but thinly linked from content. **Advisor:** 17 "Adviser Referral" pages + a single HubSpot booking link in the Institutional dropdown; family kit correctly frames TBA collaborative custody (not an upsell). **Conversion stage:** only **6 of 208 pages**.

**Biggest leaks:** (a) `youth-families/index.html` — zero capture/offer/next-step on a named entry page; (b) homepage — no capture, no bilingual, generic hero; (c) 88 education pages with no offer; (d) sitemap omits the money + LATAM surfaces.

---

## 4. Learning-path evaluation → consolidate 7 to 3 (+1 collection)

Business-value engines: **Curious** (Q3.87 / BV4.70) and **Sovereign** (Q3.39 / BV4.26) map straight to the priority funnels. **Builder** (BV2.83) and **Principled** (BV3.00) are the lowest value and off the custody/advisor core.

**Overlap matrix (High cells):** Curious↔Hurried = **High** (identical beginner job, only pacing differs — the system's strongest redundancy). Curious↔Sovereign / Curious↔Pragmatist / Hurried↔Pragmatist / Builder↔Sovereign = Med.

| Path | Verdict | Rationale |
|------|---------|-----------|
| **Curious** | **Keep — flagship** | Best-scored, only bilingual path, the beginner funnel. Strip gamification (6 badge/% flags). |
| **Sovereign** | **Keep — core, finish drafts** | The positioning made literal (custody/inheritance/multisig). Crown-jewel assets (collaborative-security Q5, scam-defense, proofs-not-promises). Fix 3 draft stage indexes. |
| **Hurried** | **Merge into Curious** as a "Fast Track" pace | High overlap; keep the BV-4.12 content, drop the standalone path. |
| **Pragmatist** | **Simplify / fold** | Lowest quality (3.27); fold generic modules into Curious, keep ~3 business-owner modules as a lens. Rewrite `bank-friction` (Q2). |
| **Principled** | **Demote to a deep-dives essay collection** | High-quality but off-core (BV3.00, teaches no custody). Keep content, pull from the primary path lineup. |
| **Skeptic** | **Keep but reposition** as a top-of-funnel objection hook that routes into Curious | Unique job (myth-rebuttal); thin funnel footprint. |
| **Builder** | **Demote — maintain only** | Developer funnel = non-priority; lowest BV (2.83); heaviest gamification debt. Keep live, stop investing. |

**End state: Curious (beginner, bilingual) + Sovereign (family/advisor/custody) + Skeptic (awareness hook) + a Deep-Dives essay collection (Principled + the 3 Pragmatist business modules). Builder demoted to maintain-only.**

---

## 5. Homepage: gaps vs positioning + recommended architecture

**Positioning:** *"Bitcoin custody and inheritance for families and advisors. Bilingual. LATAM-fluent."*

**Gaps found:** generic hero ("learn Bitcoin"); no "families"/"advisors" above the fold; **no bilingual/ES affordance at all**; two split primary CTAs (`/start-simple.html` vs `/start/`); generic `<title>`; advisor on-ramp buried; 6 nav items → 17 dropdown links with a Learn/Paths taxonomy overlap; `/programa-colombia/` linked from neither homepage nor sitemap. Positives: the "Find Your Path" widget is a clean progressive 2-question flow (not 7-options overload); readability/design tokens are on-brand; mobile nav is ARIA-wired.

**Recommended homepage architecture (single-decision, audience-routed):**

```
[ Language switcher EN | ES ]  ← top-right, persistent (positioning requirement)

HERO (one promise, on-positioning)
  H1: "Protect your Bitcoin — and pass it on."
  Sub: Custody, recovery, and inheritance for families and advisors. Bilingual. LATAM-fluent.
  ONE primary CTA + one audience split:
    → "I hold my own Bitcoin"  (families/self-custody → Sovereign path + Self-Custody Kit)
    → "I advise clients"        (advisors → consult booking + Advisor Packet)

TRUST STRIP: Don't Trust, Verify · No personal data · Open source · TBA collaborative custody

3 DOORS (not 7 paths, not 6 dropdowns):
  1. Learn Bitcoin (Curious, bilingual)      → beginner funnel
  2. Secure & inherit it (Sovereign)         → family custody + kits
  3. For advisors                            → consult + Advisor Packet

PROOF: interactive demos (the strongest SEO surface) — 3 featured + "see all"
EMAIL CAPTURE (re-add): one honest offer (e.g. the scam-defense / verify checklist lead magnet)
FOOTER: Created by Dalia · bilingual · Colombia program link
```

Collapse the 5 dropdowns to **3 doors + a thin utility nav**. Kill the Learn/Paths taxonomy overlap. Surface the kits and the Colombia program. Make the bilingual switch the first thing a LATAM visitor sees.

---

## 6. UX simplifications

- **Nav:** 6 items / 17 dropdown links → 3 doors + utility. Remove the Learn-vs-Paths duplication.
- **One start flow, not two:** `/start-simple.html` and `/start/` both exist as "start" CTAs — pick one.
- **Strip gamification platform-wide** to honor unbounded mode: 14 badge/"X Modules Completed"/"% Progress"/"Congratulations!" instances, concentrated in Curious (6) and Builder (5), plus the membership earn-back framing.
- **Give interactive demos a forward step:** 24 of 26 dead-end pages are demos — they have a JS back-link but no "next demo / back to your path" CTA. (The kit-routing PR #55 already adds one to ~10; extend to the rest.)
- **Fix the ~19 "crypto"-blur term instances** flagged across paths (no-crypto-blur convention).

---

## 7. Content consolidations (merge, with redirects)

- `paths/sovereign/stage-3/alternatives-to-bitcoin.html` (45KB) **↔** `monetary-alternatives.html` (28KB) — same topic → **merge**.
- `deep-dives/first-principles/original-question-everything.html` (132KB) **↔** `first-principles/index.html` (136KB) — near-identical journey → **merge** (also a dead-end + orphan).
- `deep-dives/philosophy-economics/time-preference.html` (thin) **↔** `austrian-economics/time-preference-fundamentals.html` (deeper) → **merge**.
- `interactive-demos/sat-stacking-calculator/` **↔** the stronger DCA calculator → **merge**.
- 7 truncated/missing `answers/*` topics → consolidate the generator output.

---

## 8. Recommended deletions (3 confidence tiers)

**SAFE (untracked, gitignored, zero refs):**
- All 21 `*.backup` files (root + `interactive-demos/*/` + `community/`, `fsa/`)
- `apps/` (stale `.html.backup` snapshot dir), the `… _files/` "Save Page As" dir
- `_compare-*.html` (3), `_mockup-sovereign-style.html`, `youth-families/_engine-playground.html`
- `interactive-demos/bitcoin-key-generator-visual/index-backup.html` + `enhancements.html`
- Confirmed-dead JS: `js/bitcoin-data-fallback.js`, `js/bitcoin-data-simple.js`, `mcp-integration/agent-bridge.js`
- **Confirmed-dead JS (zero refs, no runtime loader)** — ~17 files / ~328KB: `ab-home.js`, `dynamic-content.js`, `i18n.js`, `learning-path.js`, `learning-path-navigator.js`, `link-normalizer.js`, `mcp-content-loader.js`, `mcp-service.js`, `mobile-interactions.js`, `onboarding-flow.js`, `payment-access-control.js`, `site-nav.js`, `widgets/quiz.js`, and the dead pair `path-bsa-brand-fix.js` + `css/path-bsa-brand-fix.css`
- **Confirmed-dead CSS:** `css/homepage-bsa-brand-fix.css`, `css/onboarding-flow.css`

**PROBABLY (tracked, unreferenced — verify intent):**
- Root `dashboard.html` (an orphan "Productivity" page unrelated to BSA), `0001-*.patch`, `_headers` (stale Netlify config Vercel ignores), `vercel-subdomain.json` ("backup"), `vercel-security.json` + `nginx-security.conf` (generator outputs, not deployed)
- ~37 root-level report `.md` files (CONTENT_AUDIT_*, DATABASE_* ×4, SECURITY_* ×3, DEPLOYMENT_* ×3, …) → triage into `docs/archive/`, not the repo root

**NEEDS-REVIEW (decide the page first, then the asset):**
- `checkout.html` + `js/checkout.js` (page is orphaned; product pages moved to `/assets/snippets/kit-checkout.js`)
- `js/stripe-checkout.js` (LIVE on membership pages — retire only if you retire the Stripe-on-membership flow)
- `ai-agents/index.html` + `mcp-integration/mcp-client.js` (page orphaned; script still referenced by it)
- `js/widgets/network-stats.js` + `news-ticker.js` (only on `tests/widget-demo.html`), `js/gemini-service.js` (only on `admin/content-generator.html`)
- ⚠️ **Do NOT delete** `start-simple.html` — it's a live homepage CTA target. **Do NOT delete** `js/membership-btcpay.js` or `css/youth-engine.css` — runtime-injected, live.

**Maintenance risk to fix:** three parallel header configs (`vercel.json` = authoritative; `_headers` = dead Netlify; `nginx-security.conf` = dead nginx). `tools/security-headers.js` regenerates `vercel-security.json` + `nginx-security.conf` into the root — so running it spawns stale duplicates. Consolidate to `vercel.json`.

---

## 9. Unused JS / CSS (summary)

~17 JS files (~328KB) and 3 CSS files (~32KB) confirmed dead (no `<script>`/`<link>`, no runtime loader, not referenced by another JS). Largest payoff: `onboarding-flow.js` (40K), `learning-path.js` (40K), `mobile-interactions.js` (36K). **Watch-outs (do not delete):** `membership-btcpay.js` (injected by `lightning-payment.js`), `youth-engine.css` (`document.write`), `widgets/api-handler.js` (loaded by widget JS). **Mismatch to check:** `css/dynamic-content.css` is linked by `index.html` but its companion `js/dynamic-content.js` is dead — screenshot the homepage to see if the CSS styles anything live before keeping. Full file-by-file table in the agent findings.

---

## 10. Broken links / missing / orphans (counts)

- **112 broken internal links → 27 distinct missing targets** (≈90 in the `answers/` cluster). Plus 3 broken assets (incl. `dalia/index.html` → its own missing `profile.jpg`).
- **27 missing pages** — top: `bitcoin-security-review/` (16 inbound), 7 `answers/*` topics, `field-manual/`, `learn/self-custody-master/`, `tools/multisig-demo/`, `guides/` index.
- **50 orphaned pages** — concerning content orphans: `articles/bitcoin-complete-guide.html`, `deep-dives/bitcoin-capital/bitcoin-backed-loans.html`, `paths/sovereign-journey-intro.html`, `programa-colombia/semana-1/` + `experimento-dos-economias/`, the 4 `guides/*` pages, several `institutional/*`. (Admin/cert/utility orphans are intentional.)
- **26 dead-end content pages** (no forward link) — 24 are interactive demos; 17 confirmed "none found" Primary CTA in the inventory.

---

## Suggested sequencing

**Week 1 (stop the bleeding):** §1 critical fixes — kit dead links, `bitcoin-security-review`, pragmatist nav, sovereign drafts, correct the dead-code memory. Regenerate `sitemap.xml`.
**Week 2 (focus):** Homepage hero + bilingual switch + 3-door nav (spec-first, A–D mockups per the locked convention — do not code blind). Merge Hurried→Curious; demote Principled/Builder.
**Week 3 (profit):** Extend kit-routing; re-add homepage capture; open the advisor on-ramp; strip gamification.
**Ongoing:** deletions (SAFE tier first), content merges, root-dir triage.

*All recommendations stop at the plan. No site changes made.*
