# Content cleanup — execution plan

**Status:** Draft, awaiting sign-off
**Date:** 2026-05-01
**Sub-project:** #2.5 of 8 (cleanup phase, post-audit)
**Inputs:** [audit findings](../specs/2026-05-01-content-audit-findings.md), [footer convention](../specs/2026-05-01-footer-convention.md), [visual brand system spec](../specs/2026-05-01-visual-brand-system-design.md)
**Decisions resolved 2026-05-01:** §6.A through §6.F of audit findings — see §1 below.

---

## 1. Locks established (recap)

These came out of audit-findings §6. They're now binding for the cleanup and the rest of the makeover. After execution, they get encoded in the relevant CLAUDE.md files (BSA, FSA, hub).

| Lock | Decision |
|---|---|
| **A. BSA tagline placement** | `Don't Trust, Verify.` as hero **eyebrow** (above page-specific h1). Both coexist on strategic pages. |
| **B. Identity-line scope** | Locked BSA identity (`Bitcoin custody and inheritance for families and advisors. Bilingual. LATAM-fluent.`) anchored on **strategic pages only** — homepage, about, dalia/, institutional/*. Path modules + demos retain broader register. |
| **C. FSA locks** | Tagline: `Keep the fees. Gain the knowledge.` Identity: `Practical financial literacy for the underbanked. Bilingual. LATAM-fluent.` |
| **D. Hub locks** | Tagline: `The Sovereign Academy \| Master Money. Master Bitcoin. Master Life.` Hub uses locked BSA + FSA identity lines **verbatim**, no paraphrase. |
| **E. Entity-name rule** | **Copyright context:** all sites use `The Sovereign Academy` (umbrella) per footer convention. **Non-copyright context** (bylines, schema publisher, body references): sub-sites use their own entity (`Bitcoin Sovereign Academy`, `Financially Sovereign Academy`). |
| **F. FSA footers** | Add locked default footer to 22 footerless FSA pages (modules ×14, calculators ×7, my-journey). |

## 2. Audit correction — footer convention is split-format

The locked footer convention has **two forms**, not one (per [footer-convention spec §1](../specs/2026-05-01-footer-convention.md#1-convention-locked)):

| Page type | Locked footer text |
|---|---|
| English default (sub-pages) | `© 2026 The Sovereign Academy · Educational content only · Not financial advice` |
| Spanish default (sub-pages) | `© 2026 The Sovereign Academy · Contenido educativo únicamente · No es consejo financiero` |
| BSA + FSA + hub homepages | `Created by Dalia · thesovereign.academy` |

**This means the audit overcounted footer violations.** Several BSA institutional/* pages already use the locked default form correctly. Below is the *corrected* violation list.

### 2.1 Actual footer violations (corrected count)

**BSA — 5 actual violations:**
- `youth-families/index.html:677` — uses `•` (bullet) instead of `·` (middle dot)
- `institutional/wealth-advisors/index.html:1090` — `© 2026 Bitcoin Sovereign Academy · Professional Bitcoin education for financial advisors · Not investment advice` — wrong entity, wrong message ("investment" → "financial" per footer-convention §8 Q4 confirmed)
- `programa-colombia/index.html:550` — `© 2026 Financially Sovereign Academy · Contenido educativo únicamente · No es consejo financiero` — wrong entity (should be `The Sovereign Academy`)
- `institutional/corporations/colombia/index.html:372` — same wrong-entity issue
- `fsa/index.html:382` — `© 2026 Financially Sovereign Academy. All rights reserved.` — wrong entity, wrong format
- `dalia/logo-explorations.html` — old format `Created by Dalia | bitcoinsovereign.academy` — replace with default form (sub-page)

**Already locked-compliant (skip):**
- `institutional/corporations.html:266` ✓
- `institutional/wealth-advisors.html:241` ✓
- `institutional/cities.html:236` ✓
- `institutional/education.html:236` ✓
- `institutional/correctional.html:236` ✓

**Homepages needing the homepage-form rewrite:**
- BSA `index.html` — currently has whatever (verify), needs `Created by Dalia · thesovereign.academy`

**FSA — 2 actual violations + 22 footerless pages:**
- `index.html:1203` — `© 2026 Sovereign Academy Network. Educational content only.` → replace with homepage form `Created by Dalia · thesovereign.academy`
- `programa-colombia/index.html:550` (FSA copy, if it exists separately from BSA's) — same wrong-entity issue
- 22 pages missing footer entirely (per audit §3.2): `modules/*.html` ×14, `calculators/*.html` ×7, `my-journey.html` ×1

**Hub — 3 actual violations:**
- `index.html:644` — `© 2026 Sovereign Academy. Educational content only. Not financial advice.` — missing "The", periods instead of middle dots → fix to default form (or homepage form — see open question §8.1)
- `directory.html` — no footer → add default form
- `bitcoin-first-principles.html` — footer status unknown; if missing, add default form

**Already locked-compliant (skip):**
- `hub/institutional/index.html:136` ✓

## 3. P0 work — must ship before homepages are redesigned

### 3.1 Footer convergence (cross-repo)

Per the corrected violation list in §2.1. Files affected:

**BSA (manual edits — strategic pages):**

| File | Change |
|---|---|
| `index.html` | Replace bottom legal line with homepage form `Created by Dalia · thesovereign.academy` |
| `youth-families/index.html:677` | Replace `•` with `·` (3 occurrences in that line) |
| `institutional/wealth-advisors/index.html:1090` | Replace with default form (sub-page): `© 2026 The Sovereign Academy · Educational content only · Not financial advice` |
| `programa-colombia/index.html:550` | Change `Financially Sovereign Academy` to `The Sovereign Academy` (keep Spanish form) |
| `institutional/corporations/colombia/index.html:372` | Same fix as programa-colombia |
| `fsa/index.html:382` | Replace `© 2026 Financially Sovereign Academy. All rights reserved.` with default form |
| `dalia/logo-explorations.html` | Replace old `Created by Dalia | bitcoinsovereign.academy` with default form |

**FSA (manual + script):**

| File | Change |
|---|---|
| `index.html:1203` | Replace `© 2026 Sovereign Academy Network. Educational content only.` with homepage form `Created by Dalia · thesovereign.academy` |
| `programa-colombia/index.html:550` (if separate from BSA copy — verify first) | Same Spanish-default form fix |
| `modules/*.html` ×14 | **Add `<footer class="legal-footer">` block** with default form before `</body>` |
| `calculators/*.html` ×7 | Same |
| `my-journey.html` | Same |

**Hub (manual):**

| File | Change |
|---|---|
| `index.html:644` | Replace `© 2026 Sovereign Academy. Educational content only. Not financial advice.` — *open question §8.1: homepage form or default form?* |
| `directory.html` | Add footer with default form |
| `bitcoin-first-principles.html` | Verify footer exists; if missing, add default form |

**Note:** The full footer-convention rollout (sub-project #7) covers ~366 files (path modules, demos, deep-dives, etc.). This cleanup pass handles only the strategic pages above. The full rollout still happens later per the footer-convention spec — but the strategic baseline gets done now.

### 3.2 Entity-name fixes (decision E)

| Repo | File pattern | Change |
|---|---|---|
| FSA | `articles/*.html` (~2 files) | Byline at line ~42 — change `Dalia Platt | The Sovereign Academy` to `Dalia Platt | Financially Sovereign Academy` |
| FSA | `answers/*.html` (~6 files) | schema.org JSON-LD — change `"name": "Dalia Platt", "publisher": "The Sovereign Academy"` (or equivalent structure) to `"publisher": "Financially Sovereign Academy"` (verify exact JSON-LD shape during execution) |
| BSA | `institutional/wealth-advisors/index.html:1090` | (already covered in §3.1 footer fix — entity changes from `Bitcoin Sovereign Academy` to `The Sovereign Academy` + message changes) |

**Not changed:** copyright contexts (footer, `<meta>` copyright tags) keep `The Sovereign Academy` per Lock E.

### 3.3 BSA `about.html` typo

| File:Line | Old | New |
|---|---|---|
| `about.html:130` | `Learn about about at Bitcoin Sovereign Academy.` | `Learn about Bitcoin Sovereign Academy — Bitcoin custody and inheritance for families and advisors.` |

The new string also seeds the locked identity into the og:description (decision B: anchor on strategic pages).

### 3.4 Hub BSA + FSA cards (decision D2 — verbatim)

**Hub `index.html:592` (BSA card body):**

Old: `Deep Bitcoin mastery. Technical fundamentals, self-custody, privacy, security, and becoming truly sovereign with Bitcoin.`

New (proposed):
```
Bitcoin custody and inheritance for families and advisors. Bilingual. LATAM-fluent. Deep technical sovereignty through 6 paths and 50+ interactive demos.
```

(First sentence = locked BSA identity verbatim. Second sentence = value-prop the previous version was carrying. ~26 words total — fits the card.)

**Hub `index.html:554` (FSA card body):**

Old: `Learn universal financial literacy. Budgeting, saving, investing, taxes, debt strategy, and building true wealth. For everyone.`

New (proposed):
```
Practical financial literacy for the underbanked. Bilingual. LATAM-fluent. 10 fundamentals taught through interactive modules and calculators. Free, no signup.
```

(First sentence = locked FSA identity verbatim. Second sentence + free-no-signup carries the existing value props.)

**Hub `directory.html:151 + :195` and `institutional/index.html:97 + :112`:**

Apply the same verbatim-rule. Drafts in §3.5 of execution checklist (§5.5 below).

### 3.5 Hub `bitcoin-first-principles.html` SEO orphan

Add to `<head>`:
- `<meta name="description" content="…">` — proposed: `Bitcoin from first principles — interactive guide covering money, scarcity, custody, and consensus. Part of The Sovereign Academy.`
- `<meta property="og:title" content="Bitcoin from First Principles | The Sovereign Academy">`
- `<meta property="og:description" content="…">` (same as description)
- `<meta name="twitter:title" content="Bitcoin from First Principles | The Sovereign Academy">`
- `<link rel="canonical" href="https://thesovereign.academy/bitcoin-first-principles">`

Verify the page has a footer; if not, add the default form per §3.1.

## 4. P1 work — strategic-page tagline + identity convergence

### 4.1 BSA homepage (`index.html`)

**Add tagline eyebrow** above current hero h1 (decision A):
```html
<div class="hero-eyebrow">Don't Trust, Verify.</div>
<h1>Master Bitcoin. Leave the Confusion Behind.</h1>
```

CSS for `.hero-eyebrow`: small caps, `color: var(--color-brand)`, `font-size: 0.875rem`, `letter-spacing: 0.14em`, `margin-bottom: 0.75rem`. Spec to confirm against §4.2 of brand system (matches `--type-eyebrow`).

**Update meta description + og:description** to seed locked identity (decision B):

Old (line 138 schema.org): `Complete Bitcoin education for beginners starting from scratch`
Old (line 31 og:description): `44 interactive demos, 6 learning paths. Master Bitcoin through hands-on simulations. No wallet or personal info required to start.`

Proposed new (consistent across `<meta name="description">`, og:description, schema description, twitter:description):
```
Bitcoin custody and inheritance for families and advisors. Bilingual. LATAM-fluent. 50+ interactive demos and 6 learning paths from monetary curiosity to sovereign self-custody.
```

(28 words. Locked identity opens; value-prop closes. Same string everywhere.)

**Audience-conflict copy fix** (`index.html:3997`):

Old: `Step-by-step interactive learning with 6 complete courses. Perfect for beginners who want structure and guidance.`
New: `Step-by-step interactive learning with 6 complete courses. Designed for sovereignty-curious learners who want structure and a clear path.`

(Drops "beginners" framing; "sovereignty-curious" matches the broader-register exception in decision B.)

### 4.2 BSA `about.html`

**Add tagline eyebrow** above hero (same pattern as homepage).

**Hero rewrite** (`about.html:162`):

Old: `Master Bitcoin through experience, not just theory. We believe in learning by doing.`
New: `Bitcoin custody and inheritance for families and advisors. Built on the principle: don't trust, verify — learn by doing, not by being told.`

**Core Values reframe** (`about.html:199`):

Old: `Free education for everyone, everywhere`
New: `Free, accessible Bitcoin education — anchored to families and advisors, open to anyone learning.`

(Decision B: locked identity is the anchor, accessibility frame stays as a *means* not the audience.)

### 4.3 BSA `dalia/index.html` and `institutional/index.html`

- `dalia/index.html`: per audit (and CLAUDE.md memory), already aligned. Spot-check before commit; no expected changes.
- `institutional/index.html` (BSA top-level institutional): verify locked identity surfaces in hero + meta. If absent, add tagline eyebrow + identity anchoring.

### 4.4 FSA homepage (`index.html`)

**Promote tagline to eyebrow** (decision C):
```html
<div class="hero-eyebrow">Keep the fees. Gain the knowledge.</div>
<h1>Take Control of Your Financial Future</h1>
<p class="hero-subtitle">Practical financial literacy for the underbanked. Bilingual. LATAM-fluent.</p>
```

(Tagline eyebrow + retained h1 + locked audience line as new subtitle. Drops the previous "Learn what financial advisors charge 1-2% annually…" subtitle — that copy migrates into a value-prop block below the hero.)

**Update meta description + og:description**:

Old: `Learn the 10 financial fundamentals everyone needs. Interactive lessons on budgeting, investing, debt, credit, taxes, and more. 100% free — no signup required.`

Proposed:
```
Practical financial literacy for the underbanked. Bilingual. LATAM-fluent. 10 interactive modules covering budgeting, investing, debt, credit, and more. Free, no signup.
```

**Schema description** (`index.html:76`):

Old: `Free financial literacy education teaching the 10 fundamentals everyone needs for financial independence.`
New: `Practical financial literacy for the underbanked. 10 interactive modules covering personal finance fundamentals. Free, no signup.`

### 4.5 FSA modules + Programa Colombia

**Modules** (`modules/*.html` ×14): defer tagline addition to cascade. Footer fix already covered in §3.1 P0.

**Programa Colombia**: already mission-aligned (Spanish underbanked frame). No copy changes needed beyond the entity-name footer fix.

### 4.6 Hub strategic pages

Already covered in §3.4 (BSA + FSA card rewrites) and §3.5 (bitcoin-first-principles SEO).

**Additional hub fixes** (D1 — document tagline + verbatim rule):
- `directory.html` `<title>`: keep current generic but add the tagline as eyebrow on the page itself (similar to homepage).
- `directory.html:151` (FSA card): rewrite using locked FSA identity verbatim.
- `directory.html:195` (BSA card): rewrite using locked BSA identity verbatim.
- `institutional/index.html:97 + :112`: same verbatim treatment.

(Exact strings drafted in execution time, mirroring §3.4 hub-homepage rewrites.)

## 5. P2 work — defer to cascade (sub-project #6)

These don't block the homepage redesigns and benefit from being batched with the visual cascade:

- FSA OG tags + canonical added to ~22 pages
- Hub `directory.html` + `institutional/index.html` OG tags
- BSA templated `Master Bitcoin…` og:descriptions across ~60 demo + path pages — update to reference locked identity (mechanical find/replace during cascade)

**Move to:** sub-project #6 cascade-inventory spec (`docs/superpowers/specs/2026-05-XX-cascade-inventory.md`) when written.

## 6. Execution order + commit strategy

5 commits, sequenced for clean rollback if any step regresses:

| # | Repo(s) | Scope | Files | Verify |
|---|---|---|---|---|
| 1 | BSA + FSA + hub | §3.1 footer convergence (strategic pages only — full rollout deferred to #7) | ~30 files | Visual check 5 representative pages per repo. Grep for old strings — should return zero. |
| 2 | BSA + FSA | §3.2 entity-name + §3.3 typo + §3.4 hub card rewrites + §3.5 bitcoin-first-principles SEO | ~12 files | Grep for `about about` (zero hits). Grep `Sovereign Academy Network` (zero hits in FSA). Visual check hub homepage cards. |
| 3 | BSA | §4.1 + §4.2 + §4.3 strategic-page tagline + identity | 4 files (`index.html`, `about.html`, `dalia/index.html` spot-check, `institutional/index.html`) | Visual check hero on all 4 pages. Verify tagline eyebrow renders correctly on mobile + desktop. Confirm meta tags update via View Source. |
| 4 | FSA | §4.4 strategic-page tagline + identity | 1 file (`index.html`) | Visual check hero. Verify meta tags. |
| 5 | Hub | §4.6 + tagline-rule documentation | 3 files (`index.html`, `directory.html`, `institutional/index.html`) | Visual check all 3 pages. Verify tagline eyebrow on each. |

**Memory updates** happen with commit 1 (footer convention rollout):
- Update `~/.claude/projects/-Users-dalia-projects-bitcoin-sovereign-academy/memory/project_footer_convention.md` to reflect the split-format reality.
- Update `~/.claude/projects/-Users-dalia-projects-bitcoin-sovereign-academy/memory/project_strategic_positioning.md` (or equivalent) with FSA + hub locks.

**CLAUDE.md updates** happen with commit 3 (after locks are visible in code):
- BSA `CLAUDE.md`: add tagline-placement rule (decision A), entity-name rule (E).
- FSA `CLAUDE.md`: add tagline + identity locks (C), inherit footer + entity rules.
- Hub `CLAUDE.md` (create if missing): tagline lock (D1), verbatim-rule (D2).

## 7. Verification approach

Per the makeover spec §10 functionality-preservation rule, no interactive logic is touched in this cleanup. Verification is content + visual only.

**Per-commit verification:**
- `git diff` review for each file before commit
- For HTML edits: open the page locally (BSA `npm run dev`, FSA equivalent) and visual-check
- For meta tag edits: View Source confirms the new strings render
- For footer edits: grep the repo for the *old* strings — should return zero hits

**Post-execution sweep:**
- Grep all 3 repos for: `made with`, `for everyone, everywhere`, `Master Bitcoin. Leave the Confusion Behind` outside of expected places, `Sovereign Academy Network`, `about about`. All should return zero.
- Confirm tagline eyebrow class exists in `brand.css` and renders.

## 8. Open questions before execution

1. **Hub homepage footer form.** Hub `index.html:644` currently uses a default-form variant (`© 2026 Sovereign Academy…`). Should the hub homepage use:
   - **Option 1:** Default form with corrected punctuation: `© 2026 The Sovereign Academy · Educational content only · Not financial advice`
   - **Option 2:** Homepage form: `Created by Dalia · thesovereign.academy` (creates a self-referencing loop — hub footer points to hub URL)
   - **Recommend Option 1.** The footer-convention spec only specifies BSA + FSA homepages. Hub = the umbrella, so the umbrella copyright entity in the default form is semantically clean.

2. **BSA `pricing.html`.** Currently a redirect with no footer. Plan: leave as-is (redirect pages are excluded from rollout per pragmatism). Confirm.

3. **FSA `programa-colombia/index.html`** vs. BSA `programa-colombia/index.html`. Audit reported the same line for both. Are they two separate copies, or is one the canonical and the other a pointer? Verify before editing — risk of editing one and missing the other.

4. **`fsa/index.html` inside the BSA repo.** What is this? A bridge page? A copy of FSA homepage? Verify before applying default-form footer fix.

5. **`.hero-eyebrow` CSS class.** Exists in either repo today? If not, add to `css/brand.css` (BSA) and `css/main.css` (FSA) and hub inline. Before commit 3.

## 9. Sign-off checklist

- [ ] §1 locks accurately reflect the 6 decisions
- [ ] §2 corrected footer interpretation reviewed
- [ ] §3 P0 file-level diffs accepted
- [ ] §4 P1 file-level diffs accepted (BSA + FSA + hub strategic-page rewrites)
- [ ] §5 P2 defer-to-cascade decision accepted
- [ ] §6 commit strategy approved (5 commits, 3 repos, ~50 files)
- [ ] §8 open questions answered
- [ ] Green light to execute

**Once signed off:** I execute commits 1–5 in order, pausing for review between commit 1 (footer rollout — the highest-risk visual change) and commit 2.
