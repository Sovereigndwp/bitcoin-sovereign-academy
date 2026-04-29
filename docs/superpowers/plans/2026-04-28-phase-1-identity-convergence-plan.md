# Phase 1 — Identity Convergence + Asset Surfacing — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the substrate (identity hub + surfaced asset library + voice spec doc + complete Foundations 1–5 series) that any Phase 2 funnel decision will rely on. Ship in 2–3 weeks at ~10–15h focused work.

**Architecture:** A static-site-friendly addition to the existing BSA repo: one HTML hub at `/dalia/`, three markdown tracking docs (`voice-spec.md`, `asset-audit.md`, `handle-migration-plan.md`), one new infographic, and bio/footer/visual-mark updates to 6 external platforms. No new infrastructure (Resend, Supabase, drip cron, etc. all stay deferred to Phase 2). The plan is **user-execution-heavy**: most tasks require the user's logged-in access to LinkedIn, Substack, X, BSA admin, etc. AI assists with: voice spec drafting, identity hub HTML, Phase 2 spec drafting.

**Tech Stack:** Static HTML/CSS for the hub (no JS framework, no CMS). Markdown for tracking docs. Existing BSA brand kit (colors, fonts, design tokens). Pandoc not needed in Phase 1. Resend / Supabase / cron not needed in Phase 1.

**Spec reference:** `docs/superpowers/specs/2026-04-28-phase-1-identity-convergence.md` (committed `554e0686`).

**Locked decisions (per spec §3, §4.1, §8.2):**
- Brand thesis (T3a): *"Bitcoin custody and inheritance for families and advisors. Bilingual. LATAM-fluent."*
- Hub URL: `bitcoinsovereign.academy/dalia`
- Foundation #2 title: *"Anatomy of a Bitcoin Wallet"*

**Open items addressed as plan steps:** audit format (Task 2), Substack URL change risk decision (Task 12), profile photo selection (Task 13).

---

## File Structure

**Files to create:**
- `docs/marketing/voice-spec.md` — single source of truth for brand voice (Task 1)
- `docs/marketing/asset-audit.md` — 6-year content catalog (Tasks 2, 5)
- `docs/marketing/handle-migration-plan.md` — track migrations + outcomes (Task 11)
- `docs/marketing/foundation-2-content.md` — content brief for the infographic (Task 3)
- `dalia/index.html` — identity hub, 4 doors + bio + thesis + visual mark (Task 8)
- `dalia/styles.css` — hub-specific styling extending BSA brand kit (Task 8)
- `docs/superpowers/specs/2026-05-XX-phase-2-funnel-selection.md` — Phase 2 selection spec (Task 15)

**Files to modify:**
- `vercel.json` — only if `/dalia/` routing needs explicit config (Task 9)
- Possibly `index.html` (BSA homepage) to add a small "About Dalia" link in the footer (Task 10, optional)

**Files NOT to create (deferred to Phase 2):**
- `api/subscribe.ts`, `api/cron/drip.ts` — capture/drip infra
- `scripts/syndicate.mjs` — repurposer
- `content/lead-magnets/*` — Spanish PDF chapters
- `content/drip/*` — drip emails
- Any Supabase migrations

---

## Task 1: Voice Spec Doc

**Files:**
- Create: `docs/marketing/voice-spec.md`

This is the canonical brand-voice reference cited from every other spec. It bundles the work already done in the Plan A spec (composability + first-principles + epistemic stance + 5 named pairs + 3-part synthesis check + 7+7 rules) into a single user-readable document.

- [ ] **Step 1: Read the source material**

The voice spec content is fully defined in:
- `docs/superpowers/specs/2026-04-28-distribution-engine-phase-1-design.md` §1.5 (composability + synthesis check) and §1.6 (first-principles, 7 rules) and §1.7 (editorial stance, 7 rules) — these are the authoritative content blocks.

Read those three sections. They are the substance of the voice spec doc.

- [ ] **Step 2: Create the file with required structure**

Create `docs/marketing/voice-spec.md` with the following 9 sections (per Phase 1 spec §9 + the original Plan A spec §8.2):

1. Wedge (W3) — verbatim from Plan A §1.2
2. The 5 named domain pairs — the palette
3. Synthesis check — composability + first-principles + epistemic, all three required
4. First-principles reasoning — the 7 rules (from Plan A §1.6)
5. Editorial stance — the 7 rules of inform-not-convince (from Plan A §1.7)
6. Brand asset stack — the 5 deployable lines (from Plan A §1.4)
7. Language tracks table — adapted for Phase 1 (Spanish + English co-equal; Plan A's table updated since Phase 1 is not running drips)
8. Funnel terminus CTAs — the 2 track-specific phrases (from Plan A §1.9)
9. WhatsApp content-sourcing rule — reactive only (from Plan A §1.8)
10. L1 outline — the 9-chapter PDF map (referenced from Plan A §2.2) — present here as a Phase 2 candidate artifact, not active

Use H2 headings (`## 1. Wedge (W3)`, etc.). The doc should be ~800–1,200 words. Cite Plan A spec sections in footnotes for any reader who wants the full derivation.

- [ ] **Step 3: Verify content matches synthesis-check rules from Plan A**

Open the new `voice-spec.md` and check:
- Wedge text exactly matches Plan A §1.2 W3.
- The 5 pair labels exactly match Plan A §1.5.
- The 7 first-principles rules and 7 editorial rules are reproduced (or referenced clearly) from Plan A §1.6 and §1.7.
- The 3-part synthesis check (composability + first-principles + epistemic) is explicit.

Run: `grep -c "creo que" docs/marketing/voice-spec.md` → expect ≥1 (the editorial stance §2 *"use 'creo que' / 'based on what I've seen'"* rule).

Run: `grep -c "named pair" docs/marketing/voice-spec.md` → expect ≥3 (the synthesis check uses this term).

- [ ] **Step 4: Commit**

```bash
git add docs/marketing/voice-spec.md
git commit -m "Add voice spec doc — single source of truth for brand voice (Phase 1 Task 1)"
```

---

## Task 2: Asset Audit Schema + Format

**Files:**
- Create: `docs/marketing/asset-audit.md`

This task creates the empty audit table. The audit itself (filling it in) happens in Task 5.

- [ ] **Step 1: Decide audit format (open item from spec §14.4)**

Default recommendation: **markdown at `docs/marketing/asset-audit.md`** — git-tracked, no vendor lock-in, integrates with the rest of the marketing docs.

Alternatives considered: Notion (visual filtering, but vendor lock-in, requires login), Airtable (filterable but heavy for ~100–200 rows), Google Sheets (familiar but lives outside repo).

**Decision rule:** unless you already have a content-tracking system in Notion/Airtable that you actively use, pick markdown. The audit benefits from being where the rest of the brand decisions live.

If you choose markdown: continue to Step 2.
If you choose Notion/Airtable/Sheets: still create `docs/marketing/asset-audit.md` as a stub that points to the external source, and skip Steps 2–3 below (they apply to markdown).

- [ ] **Step 2: Create the audit table with the schema from spec §6.3**

Create `docs/marketing/asset-audit.md`:

```markdown
# Asset Audit — Six Years of Dalia's Bitcoin Content

> Phase 1 deliverable. Hard cap: 4 focused hours. Target: ≥100 items catalogued.
> Schema per `docs/superpowers/specs/2026-04-28-phase-1-identity-convergence.md` §6.3.
> Decisions on what to surface (top 20) happen in Task 6 of the plan.

## Status

- Audit started: <YYYY-MM-DD>
- Audit closed: <YYYY-MM-DD>
- Items catalogued: <N>
- Items marked `surface_to_hub=yes`: <N>
- Items marked `quality=gold`: <N>

## Audit table

| title | platform | url | topic | audience | language | format | status | quality | surface_to_hub | notes |
|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |  |  |

## Schema reference

- **platform:** X / LinkedIn / Substack / BSA / FSA / drafts-folder / slides / talks / comments / other
- **topic:** custody / inheritance / privacy / biometrics / stablecoins / family-planning / Bitcoin-fundamentals / regulation / sovereignty / digital-id / CBDCs / other
- **audience:** beginner / intermediate / advanced / family / advisor / professional / mixed
- **language:** EN / ES / bilingual
- **format:** essay / infographic / video / deck / thread / comment-reply / draft
- **status:** published / draft / never-published
- **quality:** gold / silver / needs-work
- **surface_to_hub:** yes / no / maybe
- **notes:** one-line context — what makes it gold or where it lives if hidden
```

- [ ] **Step 3: Verify the file structure**

Run: `head -30 docs/marketing/asset-audit.md` → expect schema reference visible.

Run: `grep -c "^|" docs/marketing/asset-audit.md` → expect ≥3 (header row + alignment row + 1 data row stub).

- [ ] **Step 4: Commit**

```bash
git add docs/marketing/asset-audit.md
git commit -m "Add asset audit table schema (Phase 1 Task 2)"
```

---

## Task 3: Foundation #2 Content Brief

**Files:**
- Create: `docs/marketing/foundation-2-content.md`

This is the *content* brief for the *Anatomy of a Bitcoin Wallet* infographic. The actual graphic design (PNG/SVG export) happens in Task 4. Splitting content from production keeps the writing focused before the design tool absorbs the day.

- [ ] **Step 1: Draft the content brief**

Create `docs/marketing/foundation-2-content.md` with the following structure (mirroring the existing Foundations 1, 3, 4, 5 layouts):

```markdown
# Foundation 2 of 5: Anatomy of a Bitcoin Wallet — Content Brief

## Hook (top of infographic)
Title: **Anatomy of a Bitcoin Wallet**
Subtitle: *A wallet is not one thing. It's a small system that does five jobs at once.*

## Lead paragraph (~30 words)
A Bitcoin wallet is software (or hardware) that holds the parts you need to prove ownership and move bitcoin. Look inside and you'll find five components doing distinct work.

## The 5 components (the anatomy)

1. **Random number generator (RNG)** — produces the entropy that becomes your seed
2. **Seed phrase storage** — the human-readable backup (12 or 24 words)
3. **Key derivation** — turns the seed into a tree of private keys (BIP32/BIP39)
4. **Signing engine** — uses a private key to sign transactions (proof of spending right)
5. **Network interface** — broadcasts signed transactions, queries balances, watches addresses

For each, include 1 sentence about what it does and 1 sentence about what fails if it's broken (mirrors the structure of Foundation 3v2).

## How they combine
A 1-paragraph derivation: *RNG → seed → key tree → signing → broadcast.* This is the first-principles arc — defining each part, then showing the chain.

## Common misconceptions section (4 entries, mirroring Foundation 3v2 layout)

1. *"My wallet stores bitcoin."* → No. Bitcoin lives on the network. Your wallet stores the keys.
2. *"Hot wallet vs cold wallet is the only safety distinction that matters."* → No. The components matter more — a cold wallet with a weak RNG is not safe; a hot wallet with strong key isolation can be.
3. *"All wallets that take 12 words are equivalent."* → No. Different wallets implement different derivation paths, address types, and passphrase models. Same words ≠ same wallet.
4. *"My wallet's password protects my bitcoin."* → No. The password protects access to the wallet *software*; the seed phrase is what protects the bitcoin.

## Key takeaway (footer)
*Five parts. One job: prove you can move bitcoin without giving away how.*

## Footer line (every infographic, brand convention)
*Created by Dalia | bitcoinsovereign.academy*

## Visual constraints (for Task 4)
- Same color palette as Foundations 1, 3, 4, 5 — orange `#f7931a` accents on dark `#1a1a1a` background
- Same font family
- Same overall composition (header → 5-component grid → derivation arc → misconceptions → key takeaway → footer)
- Aspect ratio: 1024 × 1536 (matches Foundations 1, 4, 5)

## Source-of-truth derivation references
- BIP32 (HD wallets): https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki
- BIP39 (seed phrase encoding): https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki
- Reader-friendly walkthroughs: learnmeabitcoin.com (cite where applicable)
```

- [ ] **Step 2: Verify the brief passes the 3-part synthesis check**

Apply the synthesis check from `docs/marketing/voice-spec.md`:
- **Composability:** does this brief bridge ≥1 of the 5 named pairs? → Yes — pair #2 (MPB pedagogy × HNW client psychology) and pair #4 (cypherpunk ethics × consumer-grade understanding).
- **First-principles:** does the brief derive from primitives (RNG → seed → keys → signing → broadcast) rather than from authority? → Yes, the entire arc is derivation-based.
- **Epistemic:** does the brief include alternative perspectives or contested points? → Yes — the "common misconceptions" section explicitly addresses received wisdom.

If any of the three checks fails, revise the brief before continuing.

- [ ] **Step 3: Commit**

```bash
git add docs/marketing/foundation-2-content.md
git commit -m "Add Foundation #2 content brief: Anatomy of a Bitcoin Wallet (Phase 1 Task 3)"
```

---

## Task 4: Foundation #2 Infographic Production

**Files:**
- Create: `assets/foundations/foundation-2-anatomy-of-a-bitcoin-wallet.png` (or .svg if vector source preferred)

This task is **graphic design work**, not code. The user produces the PNG in Figma / Canva / Affinity / Adobe / similar.

- [ ] **Step 1: Open the previous Foundations files as visual reference**

Open Foundations 1, 3, 4, 5 (already produced — paths in BSA's existing assets folder, or attached files). Pick one as the structural template; *Foundation 3v2 (Seed Phrase vs Private Keys, improved version)* is the most polished — best template.

- [ ] **Step 2: Produce the new infographic from the content brief**

Using the content brief from Task 3, design the infographic. Required elements (per `docs/marketing/foundation-2-content.md` §"Visual constraints"):

- "FOUNDATION 2 OF 5" tag, top-left
- Title "ANATOMY OF A BITCOIN WALLET" — orange and white, top
- Subtitle in yellow
- Same color palette, fonts, composition as previous Foundations
- Footer: *Created by Dalia | bitcoinsovereign.academy* with the BSA Bitcoin-shield logo
- Aspect ratio 1024×1536

Time budget: ~3–4 hours of focused design work.

- [ ] **Step 3: Export to PNG and add to repo**

Export at 2× resolution for retina display. Save to `assets/foundations/foundation-2-anatomy-of-a-bitcoin-wallet.png`.

If the BSA repo doesn't yet have an `assets/foundations/` folder, create it. Also save to wherever the existing infographics live (audit existing Foundations placement first):

Run: `find . -name "foundation-*.png" -not -path "*/node_modules/*" 2>/dev/null` → see where existing Foundations PNGs live, then place #2 alongside them.

- [ ] **Step 4: Visual diff against siblings**

Open #1, #2, #3, #4, #5 side by side. Verify:
- Same fonts, color palette, footer
- Same overall structure (header → main content → key takeaway → footer)
- Title style consistent
- Visual rhythm consistent across the 5

If any of the 5 looks off-brand from the others, revise before shipping.

- [ ] **Step 5: Commit**

```bash
git add assets/foundations/foundation-2-anatomy-of-a-bitcoin-wallet.png
git commit -m "Ship Foundation #2: Anatomy of a Bitcoin Wallet — completes 1-5 series (Phase 1 Task 4)"
```

---

## Task 5: Asset Audit Execution

**Files:**
- Modify: `docs/marketing/asset-audit.md`

The forcing function: **4 focused hours, then close the audit even if incomplete.** Spec §6.4.

- [ ] **Step 1: Set a 4-hour timer, block calendar**

Block 4 hours on calendar. Audit is a deep-work task — interruptions destroy it.

- [ ] **Step 2: Sweep the platforms in this order, filling rows in `asset-audit.md`**

Order is by signal density (highest-signal platforms first; if you run out of time, the lower-signal ones are less important):

1. **Substack** (`sovereigndwp`) — every published post. ~10–60 items.
2. **BSA published modules and demos** — every learning-path module that is high-quality, every interactive demo with a strong reflection question. Not all 70+ — just the ≥quality=silver ones. ~20–40 items.
3. **FSA published content** — same filter. ~5–20 items.
4. **LinkedIn** (`layer-d`) — your own posts (not just reshares). Use LinkedIn search to filter to your authored posts. ~10–40 items.
5. **X / Twitter** (`dalia_platt`) — original threads (not just one-off tweets). Use Twitter advanced search. ~5–30 threads.
6. **Drafts folder / unpublished work** — locally on your laptop, in iCloud, in Notion drafts, in Substack drafts. ~5–30 items.
7. **Slides + talks** — any deck you've ever made for a workshop, panel, or talk. ~5–20 items.

For each item, fill the row's columns. Be ruthless on quality classification:
- `gold` = you would be proud to surface this on the identity hub today, no edits required
- `silver` = strong content but needs minor edits or context
- `needs-work` = good idea but the execution isn't there

- [ ] **Step 3: When 4 hours is up, stop**

Even if you haven't covered every platform. The audit is *good enough* if you've catalogued ≥100 items. Mark the closing date in the Status section of `asset-audit.md`.

- [ ] **Step 4: Verify volume**

Run: `grep -c "^| " docs/marketing/asset-audit.md` → expect ≥100 data rows (table-row count, not header count).

If <100, decide: extend by 1 hour OR accept and continue. Per spec §13 risk row, "audit balloons past 4-hour cap" is a real risk; do not over-extend.

- [ ] **Step 5: Commit**

```bash
git add docs/marketing/asset-audit.md
git commit -m "Complete asset audit — N items catalogued over 6 years (Phase 1 Task 5)"
```

(Replace `N` with the actual count.)

---

## Task 6: Identify Top 30 + Surface Top 20

**Files:**
- Modify: `docs/marketing/asset-audit.md` (mark surfaced items)

- [ ] **Step 1: Filter audit table to top 30**

Within `asset-audit.md`, identify all rows where `quality=gold` AND `surface_to_hub=yes`. There may be more than 30 (great) or fewer (also fine — see Step 2).

If you have a markdown viewer with table filtering, use it. Otherwise, search the file for `gold` and visually pick.

- [ ] **Step 2: From those, pick the top 20 to surface in Phase 1**

Selection criteria (in priority order):
1. **Audience coverage** — pick at least 5 pieces per door (so the hub doesn't have one over-stuffed door and three empty ones).
   - Door 1 (Start Learning Bitcoin): 5+ pieces, audience=beginner OR intermediate
   - Door 2 (For Families with Bitcoin): 5+ pieces, audience=family
   - Door 3 (For Advisors and Institutions): 5+ pieces, audience=advisor OR professional
   - Door 4 (Read My Latest Writing): 5+ Substack pieces (any audience)
2. **Language coverage** — at least 5 of the 20 should be Spanish (per spec §7.3)
3. **Format diversity** — at least 1 essay, 1 infographic, 1 deck/talk, 1 thread

If you have <30 golds, either lower the bar to silver-with-edits or accept that surfacing fewer than 20 is the honest state of Phase 1 (revise §12 verification target down accordingly and document the gap).

- [ ] **Step 3: Update audit table — mark surfaced items**

In `asset-audit.md`, add a column or annotation marking the 20 surfaced. Suggested: append a "**[SURFACED]**" tag in the `notes` column, OR add a new column `surfaced_in_phase_1`.

- [ ] **Step 4: Commit**

```bash
git add docs/marketing/asset-audit.md
git commit -m "Select top 20 surfaced pieces — door coverage and language balance verified (Phase 1 Task 6)"
```

---

## Task 7: Permanent Homes for Surfaced Pieces

For each of the 20 surfaced pieces, ensure it has a **permanent URL that you control**. Pieces that live only on rented platforms (X, LinkedIn) need to be re-published on BSA or FSA at a stable URL.

- [ ] **Step 1: Audit current homes**

For each of the 20 surfaced items in `asset-audit.md`, classify:
- ✅ **Already at permanent URL** (BSA, FSA, owned blog) → no migration needed
- ⚠️ **Lives only on rented platform** (X thread, LinkedIn post, Substack post) → migration needed
- ⚠️ **Lives in a draft folder** → publish needed

Substack-published pieces are technically rented, but they have permanent URLs. Decision: count Substack URLs as "permanent" for Phase 1 unless the Substack URL change in Task 12 is in flight (in which case wait for migration).

- [ ] **Step 2: For each ⚠️ item: re-publish or publish to BSA/FSA**

Pick the right home:
- BSA Bitcoin-fundamentals or path-related content → `paths/<path>/...` or `interactive-demos/...` or a new `dalia/articles/<slug>.html`
- FSA financial-literacy content → corresponding FSA path
- Substack-only essay you want a BSA copy of → `dalia/articles/<slug>.html` with a "First published on Substack [link]" attribution

For each republished piece:
- Apply the brand asset stack (Plan A §1.4) at the bottom
- Apply the footer convention: *"I write about Bitcoin, custody, privacy, and financial sovereignty at bitcoinsovereign.academy."*
- Cross-link to ≥1 related piece in the library (per spec §7.1.5)

- [ ] **Step 3: Verify each surfaced piece has a permanent URL**

Run a verification pass: for each row in `asset-audit.md` marked surfaced, the `url` column contains a URL on `bitcoinsovereign.academy`, `financiallysovereign.academy`, or a Substack URL stable enough for Phase 1.

- [ ] **Step 4: Commit (after each batch — don't make this one giant commit)**

Suggested cadence: commit after every 5 items republished. Example:

```bash
git add dalia/articles/<5-new-files>
git commit -m "Republish 5 surfaced pieces with footer convention (Phase 1 Task 7 batch 1/4)"
```

---

## Task 8: Identity Hub HTML

**Files:**
- Create: `dalia/index.html`
- Create: `dalia/styles.css` (optional — or inline the styles)

This is the centerpiece of Phase 1. Static HTML, no CMS, no JS framework. ~4 hours focused work to ship V1.

- [ ] **Step 1: Inspect the BSA brand kit**

Run: `cat /Users/dalia/projects/bitcoin-sovereign-academy/css/brand.css | head -100` → identify the canonical CSS variables (`--primary-orange`, `--primary-dark`, etc.) and design tokens.

The hub will reuse these variables — do not introduce new design tokens. Consistency with BSA is important (the hub lives at `bitcoinsovereign.academy/dalia` and should feel like part of BSA).

- [ ] **Step 2: Write the HTML scaffold**

Create `dalia/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dalia — Bitcoin Sovereign Academy</title>
  <meta name="description" content="Bitcoin custody and inheritance for families and advisors. Bilingual. LATAM-fluent.">
  <meta property="og:title" content="Dalia — Bitcoin Sovereign Academy">
  <meta property="og:description" content="Bitcoin custody and inheritance for families and advisors. Bilingual. LATAM-fluent.">
  <meta property="og:image" content="https://bitcoinsovereign.academy/assets/og/dalia-og.png">
  <meta property="og:url" content="https://bitcoinsovereign.academy/dalia/">
  <link rel="canonical" href="https://bitcoinsovereign.academy/dalia/">
  <link rel="alternate" hreflang="en" href="https://bitcoinsovereign.academy/dalia/">
  <link rel="alternate" hreflang="es" href="https://bitcoinsovereign.academy/dalia/?lang=es">
  <link rel="stylesheet" href="/css/brand.css">
  <link rel="stylesheet" href="/dalia/styles.css">
</head>
<body>
  <header class="hub-header">
    <img src="/assets/dalia/profile.jpg" alt="Dalia" class="hub-photo">
    <h1 class="hub-name">Dalia</h1>
    <p class="hub-thesis">Bitcoin custody and inheritance for families and advisors. Bilingual. LATAM-fluent.</p>
    <ul class="hub-socials">
      <li><a href="https://x.com/dalia_platt">X</a></li>
      <li><a href="https://www.linkedin.com/in/dalia-platt/">LinkedIn</a></li>
      <li><a href="https://sovereigndwp.substack.com/">Substack</a></li>
    </ul>
  </header>

  <section class="hub-bio">
    <p>I write the curriculum for The Bitcoin Diploma (Mi Primer Bitcoin). I founded Bitcoin Sovereign Academy and Financially Sovereign Academy. I advise families and institutions on Bitcoin custody at <a href="https://thebitcoinadviser.com">The Bitcoin Adviser</a>.</p>
    <p>What I do: help families, advisors, and institutions design Bitcoin custody and inheritance that survives stress, time, and jurisdictions — without trading away ownership, privacy, or responsibility for convenience.</p>
  </section>

  <main class="hub-doors">
    <article class="hub-door hub-door--primary">
      <h2>Start Learning Bitcoin</h2>
      <p>Begin from first principles. The five Foundations cover everything before everything.</p>
      <a class="hub-door-link" href="/paths/curious/">Open BSA Curious path →</a>
      <ul class="hub-door-list">
        <!-- 5 surfaced beginner pieces, links + 1-line teasers -->
      </ul>
    </article>

    <article class="hub-door">
      <h2>For Families with Bitcoin</h2>
      <p>Custody, inheritance, family governance. The questions to ask before you need the answers.</p>
      <a class="hub-door-link" href="/paths/sovereign/">Custody path →</a>
      <ul class="hub-door-list">
        <!-- 5 surfaced family-audience pieces -->
      </ul>
      <p class="hub-door-aside">When custody becomes serious, I help families implement collaborative 1-of-3 multisig at <a href="https://thebitcoinadviser.com">The Bitcoin Adviser</a>.</p>
    </article>

    <article class="hub-door">
      <h2>For Advisors and Institutions</h2>
      <p>For wealth managers, family offices, law firms, and tax firms. How custody intersects with the work you already do.</p>
      <a class="hub-door-link" href="https://financiallysovereign.academy/">Open FSA →</a>
      <ul class="hub-door-list">
        <!-- 5 surfaced professional/advisor-audience pieces -->
      </ul>
    </article>

    <article class="hub-door">
      <h2>Read My Latest Writing</h2>
      <p>Long-form essays. Bilingual. Inform-not-convince.</p>
      <a class="hub-door-link" href="https://sovereigndwp.substack.com/">Open Substack →</a>
      <ul class="hub-door-list">
        <!-- 5 most recent Substack posts (or 5 highest-quality from audit) -->
      </ul>
    </article>
  </main>

  <footer class="hub-footer">
    <p>Dalia — Bitcoin Sovereign Academy · Financially Sovereign Academy · The Bitcoin Adviser</p>
    <p><small>Bitcoin custody and inheritance for families and advisors. Bilingual. LATAM-fluent.</small></p>
  </footer>
</body>
</html>
```

Replace each `<!-- 5 surfaced ... -->` comment with actual `<li><a>` entries from the 20 surfaced pieces (Task 7).

- [ ] **Step 3: Write the CSS**

Create `dalia/styles.css`:

```css
/* Dalia identity hub — extends BSA brand kit (css/brand.css) */

.hub-header {
  text-align: center;
  padding: 4rem 1.5rem 2rem;
  max-width: 720px;
  margin: 0 auto;
}

.hub-photo {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--primary-orange);
  margin-bottom: 1rem;
}

.hub-name {
  font-size: 2.5rem;
  color: var(--primary-orange);
  margin: 0 0 0.5rem;
}

.hub-thesis {
  font-size: 1.15rem;
  color: var(--text-light);
  margin: 0 0 1.5rem;
  line-height: 1.4;
}

.hub-socials {
  list-style: none;
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  padding: 0;
  margin: 0;
}
.hub-socials a {
  color: var(--primary-orange);
  text-decoration: none;
  font-weight: 600;
}

.hub-bio {
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  line-height: 1.7;
}

.hub-doors {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  max-width: 1100px;
  margin: 2rem auto;
  padding: 0 1.5rem;
}
.hub-door {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(247,147,26,0.25);
  border-radius: 12px;
  padding: 2rem;
}
.hub-door--primary {
  grid-column: 1 / -1;
  background: rgba(247,147,26,0.08);
  border-color: var(--primary-orange);
}
.hub-door h2 {
  color: var(--primary-orange);
  margin-top: 0;
}
.hub-door-link {
  color: var(--primary-orange);
  font-weight: 600;
  text-decoration: none;
  display: inline-block;
  margin: 0.5rem 0 1rem;
}
.hub-door-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0 0;
}
.hub-door-list li {
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.hub-door-list li:last-child { border-bottom: 0; }
.hub-door-list a {
  color: var(--text-light);
  text-decoration: none;
}
.hub-door-list a:hover {
  color: var(--primary-orange);
}
.hub-door-aside {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255,255,255,0.08);
  font-size: 0.95rem;
  color: var(--text-dim);
}

.hub-footer {
  text-align: center;
  padding: 3rem 1.5rem 2rem;
  color: var(--text-dim);
  border-top: 1px solid rgba(247,147,26,0.15);
  margin-top: 3rem;
}

@media (max-width: 768px) {
  .hub-doors {
    grid-template-columns: 1fr;
  }
  .hub-name { font-size: 2rem; }
}
```

- [ ] **Step 4: Validate the HTML structurally**

Run: `python3 -c "import html.parser; html.parser.HTMLParser().feed(open('dalia/index.html').read()); print('OK')"` → expect "OK".

Or open in a browser locally if you have a dev server (the BSA repo has `scripts/dev-server.py`):

```bash
cd /Users/dalia/projects/bitcoin-sovereign-academy && python3 scripts/dev-server.py
```

Then visit `http://localhost:<port>/dalia/` — verify the page renders.

- [ ] **Step 5: Verify the synthesis check on the bio + thesis copy**

Open `dalia/index.html`. Apply the synthesis check from `docs/marketing/voice-spec.md`:
- **Composability:** does the bio bridge ≥1 named pair? → Should bridge pair #1 + pair #4 at minimum.
- **First-principles:** does the bio derive from primitives? → "Help families ... design Bitcoin custody and inheritance that survives stress, time, and jurisdictions" — yes, derived from what custody must survive.
- **Epistemic:** is the bio inform-not-convince? → Yes, no hard CTAs, no urgency, "the questions to ask before you need the answers."

If any check fails, revise.

- [ ] **Step 6: Commit**

```bash
git add dalia/index.html dalia/styles.css
git commit -m "Add identity hub at /dalia — V1 with 4 doors and surfaced pieces (Phase 1 Task 8)"
```

---

## Task 9: Identity Hub Deployment + Verification

**Files:**
- Possibly modify: `vercel.json`

- [ ] **Step 1: Verify Vercel auto-routes /dalia/**

Check existing Vercel routing. The BSA repo's `vercel.json` should auto-serve `/dalia/index.html` since it's static at the path.

Run: `cat vercel.json | grep -A2 -B2 -i "dalia\|paths\|rewrites"` → check whether /paths/* rewrites would interfere with /dalia/.

If the existing config has a catch-all rewrite that would route /dalia/* to a different file: add an explicit rule in `vercel.json` to allow /dalia/* to serve from `dalia/`. Otherwise: no config change needed.

- [ ] **Step 2: Push to a deploy preview**

If working on a branch, push to a deploy preview branch on Vercel. Verify the page renders at the preview URL `<preview>.vercel.app/dalia/`.

If working on main: push and watch the production deploy. Verify https://bitcoinsovereign.academy/dalia/ resolves.

- [ ] **Step 3: Verify all 20 surfaced pieces' links work**

Click each link in each of the 4 doors. None should 404. If any do: either fix the URL in `dalia/index.html` or temporarily replace with a working alternative from the audit.

- [ ] **Step 4: Verify the page loads in <2s on a 4G connection**

Open Chrome DevTools → Network tab → set throttling to "Fast 4G" → reload the page. Total load time should be <2s. If not: check image sizes (the profile photo should be <100KB; if it's 5MB, compress).

- [ ] **Step 5: Verify mobile rendering**

Open the page on a phone (or DevTools mobile view at iPhone 14 width). The 4-door grid should stack to single-column. The bio should be readable. The header should not overflow.

- [ ] **Step 6: Commit any deployment-related fixes**

```bash
git add vercel.json
git commit -m "Configure /dalia routing for Vercel deploy (Phase 1 Task 9)"
```

(Skip the commit if no config change was needed.)

---

## Task 10: Bio Convergence Across Platforms

**Files:**
- No code changes — these are platform-account updates

This is the most fragmented task: 6 platforms, each with its own bio field. Use the canonical bio defined in spec §5.1.

**The shared bio (paste verbatim):**

> *Dalia — Bitcoin custody education, financial sovereignty, and practical inheritance planning for families, advisors, and Spanish-speaking communities. Wrote the curriculum for The Bitcoin Diploma (Mi Primer Bitcoin). Founder of Bitcoin Sovereign Academy and Financially Sovereign Academy. Adviser at The Bitcoin Adviser.*

Some platforms have character limits — adapt:
- **X (160 char limit):** *"Bitcoin custody and inheritance for families and advisors. Bilingual. LATAM-fluent. MPB curriculum. Founder @BSA · @FSA. Adviser @TheBitcoinAdviser."*
- **LinkedIn headline (220 char):** Use the full bio.
- **LinkedIn About (2,600 char):** Use the full bio + 1–2 paragraphs from §5.1's spirit.

- [ ] **Step 1: Update X bio**

Log in to X. Profile → Edit Profile → Bio field → paste the X-adapted version → Save.

Verify the new bio is live. Visit https://x.com/dalia_platt as logged-out user (or in incognito) — see the updated bio.

- [ ] **Step 2: Update LinkedIn headline + About**

Log in to LinkedIn. Profile → Edit. Replace headline (the line under your name) with the X-adapted version. Replace About section with the full bio.

- [ ] **Step 3: Update Substack About**

Log in to Substack. Settings → About → paste the full bio.

- [ ] **Step 4: Update BSA About / footer (if not already aligned)**

If `bitcoinsovereign.academy/about` exists: update with the full bio.
If `index.html` has an "About Dalia" section in the footer: update.

If neither exists: add a footer line on the BSA homepage linking to `/dalia/` for the full bio.

Run: `grep -i "about dalia\|dalia.*founder" /Users/dalia/projects/bitcoin-sovereign-academy/index.html` → see if a bio reference already exists.

- [ ] **Step 5: Update FSA About / footer**

Same as Step 4, applied to FSA.

- [ ] **Step 6: Update TBA**

TBA is third-party (you don't own the site), but check if your adviser-profile bio there can be updated to match. If yes, update. If no: document the gap in `handle-migration-plan.md`.

- [ ] **Step 7: Verify bio consistency across platforms**

Open all 6 platform pages in tabs. Read the bio on each. Are they consistent? Any drift gets fixed now.

- [ ] **Step 8: Commit (BSA + FSA repo changes only — platform changes are external)**

```bash
git add docs/marketing/handle-migration-plan.md
# also any modified index.html / about.html files
git commit -m "Bio convergence — same canonical bio deployed across 6 platforms (Phase 1 Task 10)"
```

---

## Task 11: LinkedIn Vanity URL Change

**Files:**
- Modify: `docs/marketing/handle-migration-plan.md` (track outcome)

- [ ] **Step 1: Open LinkedIn settings**

Profile → "Edit public profile & URL" → "Edit your custom URL" (right sidebar).

Currently: `linkedin.com/in/layer-d` (or similar).

Target: `linkedin.com/in/dalia-platt` (or `dalia-platt-bitcoin` if `dalia-platt` is taken).

- [ ] **Step 2: Try the migration**

Try the new URL. If LinkedIn accepts: done. Note the result in `handle-migration-plan.md`.

If LinkedIn rejects (taken / disallowed):
- Try variants: `dalia-bitcoin-adviser`, `dalia-bsa`, `daliaplatt-bitcoin`
- Document in `handle-migration-plan.md` which were tried, which succeeded

- [ ] **Step 3: Document outcome**

Add to `handle-migration-plan.md`:

```markdown
## LinkedIn

- Old URL: linkedin.com/in/layer-d
- New URL: linkedin.com/in/<chosen-handle>
- Migration date: <YYYY-MM-DD>
- Notes: <any redirects LinkedIn provides; any external links you'll need to update separately>
```

- [ ] **Step 4: Update external references**

Anywhere that links to your old LinkedIn URL (BSA, FSA, Substack About, X bio, email signature, business cards): update to the new URL.

Run: `grep -r "linkedin.com/in/layer-d" /Users/dalia/projects/bitcoin-sovereign-academy /Users/dalia/projects/financially-sovereign-academy 2>/dev/null` → expect 0 matches after fixes.

- [ ] **Step 5: Commit**

```bash
git add docs/marketing/handle-migration-plan.md
# also any files where LinkedIn URL was updated
git commit -m "Migrate LinkedIn vanity URL — layer-d → <new> (Phase 1 Task 11)"
```

---

## Task 12: Substack URL Change Decision + Execution

**Files:**
- Modify: `docs/marketing/handle-migration-plan.md`

- [ ] **Step 1: Risk assessment for the existing 60 subscribers**

Open Substack settings → Publication → URL/handle.

Substack supports renaming a publication once. The new URL provides a redirect from the old one — but:
- External links pointing to the old URL: Substack redirect handles these.
- Search-engine cached results: take time to update.
- Existing subscribers: receive emails as normal — sender domain doesn't change immediately, but subscriber-management dashboards are affected.

**Decision rule:** Proceed in Phase 1 only if you're confident the redirect is reliable AND you can re-message the existing 60 subs to set expectations. If unsure: defer to Phase 2.

- [ ] **Step 2: Make the call (proceed in Phase 1 OR defer to Phase 2)**

If **proceed**: continue to Step 3.
If **defer**: skip to Step 5; document the deferral.

- [ ] **Step 3 (proceed only): Pick the new URL**

Target: a URL containing "dalia". Candidates (test each in Substack to see availability):
- `dalia.substack.com`
- `daliaplatt.substack.com`
- `dalia-platt.substack.com`

- [ ] **Step 4 (proceed only): Execute the rename**

Substack settings → URL change → enter new URL → confirm.

Verify:
- New URL resolves and shows your publication
- Old URL redirects to new
- One sample post URL still works (e.g., a recent post — does the old URL redirect?)

Send one **manual notification post** to existing 60 subs:

> *"Quick update: I've moved my Substack URL to <new>. Old links still work, but your bookmarks may want updating. Nothing else changes — same writing, same cadence."*

- [ ] **Step 5: Document outcome (either path)**

Add to `handle-migration-plan.md`:

```markdown
## Substack

- Old URL: sovereigndwp.substack.com
- New URL: <chosen-handle>.substack.com OR DEFERRED-TO-PHASE-2
- Migration date: <YYYY-MM-DD> OR N/A
- Subscribers at migration: 60
- Subscribers after notification email: <N>
- Notes: <any breakage observed; any external link updates needed>
```

- [ ] **Step 6: Update external references** (proceed path only)

Run: `grep -rn "sovereigndwp.substack" /Users/dalia/projects/bitcoin-sovereign-academy /Users/dalia/projects/financially-sovereign-academy 2>/dev/null` → update any matches to the new URL.

- [ ] **Step 7: Commit**

```bash
git add docs/marketing/handle-migration-plan.md
# also any files where Substack URL was updated
git commit -m "Substack URL migration: <proceeded / deferred> (Phase 1 Task 12)"
```

---

## Task 13: Profile Photo Selection + Lock

**Files:**
- Create: `assets/dalia/profile.jpg` (and `profile-2x.jpg` for retina)

- [ ] **Step 1: Pick one photo**

Criteria (per spec §5.2):
- Must be the same image that goes on every platform for 12 months
- Should be a clean headshot or environmental portrait — not a candid
- Should be sharp at 160×160 (the hub renders this size)
- Avoid: heavily filtered photos, group shots, anything time-stamped (e.g., a holiday photo from 2 years ago that will look dated by month 6)

If you don't have one ready: a 30-min iPhone session with good lighting + plain background is sufficient. Don't over-engineer.

- [ ] **Step 2: Export at 2 sizes**

- `assets/dalia/profile.jpg` — 320×320, ~50–80KB (1× display)
- `assets/dalia/profile-2x.jpg` — 640×640, ~120–180KB (retina display)

Run image optimization — `cwebp` or `imageoptim` or `tinypng.com` to keep sizes small.

- [ ] **Step 3: Update hub HTML**

Modify `dalia/index.html`:

```html
<img src="/assets/dalia/profile.jpg"
     srcset="/assets/dalia/profile.jpg 1x, /assets/dalia/profile-2x.jpg 2x"
     alt="Dalia"
     class="hub-photo"
     loading="eager">
```

- [ ] **Step 4: Deploy the photo to all 6 platforms**

- X: profile photo upload
- LinkedIn: profile photo upload
- Substack: profile photo
- BSA: footer / about photo (if any)
- FSA: footer / about photo (if any)
- TBA: adviser photo (if you can update)

Same image on all 6.

- [ ] **Step 5: Commit**

```bash
git add assets/dalia/ dalia/index.html
git commit -m "Lock profile photo across all platforms (Phase 1 Task 13)"
```

---

## Task 14: Footer Convention Audit

**Files:**
- No new files — verification pass across existing artifacts

The footer convention (spec §5.3): every infographic carries *"Created by Dalia | bitcoinsovereign.academy"*; every Substack post closes with *"I write about Bitcoin, custody, privacy, and financial sovereignty at bitcoinsovereign.academy."*

- [ ] **Step 1: Audit existing infographics**

Open Foundations 1, 2, 3 (both versions), 4, 5. Verify each shows the footer line.

If any are missing: re-export with the footer added. The Foundation #2 produced in Task 4 should already have it (per the content brief).

- [ ] **Step 2: Audit existing Substack posts**

Open the last 10 published Substack posts. Verify each ends with the footer line (or a variant of it).

For posts older than the last 10: don't backfill. New cadence applies going forward.

- [ ] **Step 3: Document any gaps**

If gaps exist (e.g., 3 infographics missing the footer): list in `handle-migration-plan.md` as follow-up tasks. They don't block Phase 1 close.

- [ ] **Step 4: Commit (only if files were modified)**

```bash
git add assets/foundations/
git commit -m "Apply footer convention to existing Foundations (Phase 1 Task 14)"
```

(Skip if nothing changed.)

---

## Task 15: Phase 2 Spec Drafting

**Files:**
- Create: `docs/superpowers/specs/2026-05-XX-phase-2-funnel-selection.md` (date filled at execution time)

This task uses the Phase 2 decision criteria from spec §10 to decide which funnel direction the audit results actually justify.

- [ ] **Step 1: Re-read the audit (Task 5 output)**

Open `docs/marketing/asset-audit.md`. Apply the §10 questions:

| Question | Answer (filled in from audit) |
|---|---|
| Which content cluster has the most depth? | <topic with most rows / most golds> |
| Which audience does the body of work serve most? | <highest count in `audience` column> |
| Which language has the most surfaceable goldens? | <EN or ES> |
| Did the audit reveal a "Family Bitcoin OS"-shaped cluster? | yes / no |
| Did the audit reveal more institutional content than expected? | yes / no |
| Is the audit dominated by Spanish-language analytical pieces? | yes / no |
| Is the audit dominated by English long-form professional pieces? | yes / no |

- [ ] **Step 2: Pick the Phase 2 direction**

Based on the answers:
- **Plan A revival** (Spanish consumer funnel, Plan A spec) — if Spanish dominates and consumer-audience pieces are gold-heavy
- **Plan B revival** (English professional briefing) — if English long-form professional pieces dominate
- **Hybrid** (A + B parallel) — if both clusters are gold-heavy and you have the focus time
- **Family Bitcoin OS workbook/course** (new Phase 2 spec) — if a custody+inheritance+family cluster jumps out as the natural product
- **FSA Employer Program funnel** (B2B) — if institutional content dominates

- [ ] **Step 3: Write the Phase 2 spec**

Create `docs/superpowers/specs/2026-05-XX-phase-2-funnel-selection.md` with:

```markdown
# Phase 2 — Funnel Selection — based on Phase 1 audit

**Date:** <YYYY-MM-DD>
**Source:** `docs/marketing/asset-audit.md` (Phase 1 Task 5)
**Phase 1 reference:** `docs/superpowers/specs/2026-04-28-phase-1-identity-convergence.md`

## Audit findings (Phase 1)

<Top 3 most-represented clusters in the audit, with counts>

## Decision

**Phase 2 direction:** <Plan A revival / Plan B revival / Hybrid / Family Bitcoin OS / FSA Employer / other>

**Why:** <2-3 paragraphs grounded in the audit findings>

## Phase 2 scope (1-page sketch)

<What the next 4-8 weeks of work looks like; full spec to be written separately>

## Risks / open questions

<Anything that could derail Phase 2; anything that needs more data>
```

This is a 1–2 page document — not the full Phase 2 spec. The full Phase 2 spec gets written next session, with this as input.

- [ ] **Step 4: Commit**

```bash
git add docs/superpowers/specs/2026-05-XX-phase-2-funnel-selection.md
git commit -m "Phase 2 funnel direction selected based on Phase 1 audit findings (Phase 1 Task 15)"
```

---

## Task 16: Phase 1 Verification Checklist

**Files:**
- No code — final verification pass against spec §12

- [ ] **Step 1: Walk through the 9-criteria checklist from spec §12**

| # | Criterion | Pass? | Notes |
|---|---|---|---|
| 1 | Identity hub live at `bitcoinsovereign.academy/dalia`, 4 doors functioning | yes / no | |
| 2 | One-breath thesis (T3a) deployed in ≥5 places (X, LinkedIn, Substack, BSA, hub) | yes / no | |
| 3 | Shared bio + visual mark deployed across ≥5 platforms | yes / no | |
| 4 | Handle convergence: LinkedIn URL changed (or documented why not); Substack URL change decision made | yes / no | |
| 5 | Asset audit complete: ≥100 items catalogued | yes (count: <N>) / no | |
| 6 | Top 20 surfaced pieces published or reorganized into hub, footer applied | yes (count: <N>) / no | |
| 7 | Foundation #2 shipped, completing 1–5 series | yes / no | |
| 8 | Voice spec doc committed at `docs/marketing/voice-spec.md` | yes / no | |
| 9 | Phase 2 spec drafted (≥1 page) selecting funnel direction | yes / no | |

- [ ] **Step 2: Calculate pass rate**

Count "yes" answers. Per spec §12: Phase 1 successful if ≥7 of 9 are met.

- [ ] **Step 3: Decide close-out action**

- **≥7 pass:** Phase 1 successful. Move to Phase 2 (which is now defined in Task 15's spec).
- **<7 pass:** Identify the blocker(s). Either extend Phase 1 by 1 week to address them, or accept the gap and document why before moving on.

- [ ] **Step 4: Final commit + Phase 1 close**

Add a Phase 1 close note to `docs/marketing/handle-migration-plan.md` (which by now has migration outcomes + photo lock + Phase 2 reference):

```markdown
## Phase 1 close

- Closed: <YYYY-MM-DD>
- Verification: <N>/9 criteria passed
- Phase 2 spec: docs/superpowers/specs/2026-05-XX-phase-2-funnel-selection.md
- Open follow-ups: <list any criteria not met>
```

```bash
git add docs/marketing/handle-migration-plan.md
git commit -m "Phase 1 close: <N>/9 criteria passed; Phase 2 begins (Phase 1 Task 16)"
```

---

## Self-review

**Spec coverage check:**

| Spec section | Covered by task |
|---|---|
| §1 Why identity not funnel | Plan goal statement |
| §2 Goal of Phase 1 | All 16 tasks |
| §3 Brand thesis (T3a locked) | Task 8 (hub deploys it), Task 10 (bio convergence) |
| §4 Identity hub | Tasks 8, 9 |
| §5 Bio + visual mark + footer | Tasks 10, 13, 14 |
| §6 Asset audit | Tasks 2, 5 |
| §7 Asset surfacing | Tasks 6, 7 |
| §8 Foundation #2 | Tasks 3, 4, 14 |
| §9 Voice spec doc | Task 1 |
| §10 Phase 2 decision criteria | Task 15 |
| §11 Out of scope | Plan-level constraint (no API, no scripts created) |
| §12 Verification | Task 16 |
| §13 Risks | Embedded in task time-budgets and decision points |
| §14 Open items 4, 5, 6 | Tasks 2, 12, 13 |
| §15 Disposition of Plans A/B | Already committed in `554e0686`; not re-touched |

All 16 spec sections are covered.

**Placeholder scan:** No "TBD", "TODO", or "implement later" in the plan. All steps have concrete content.

**Type consistency:** File paths, function names, and command examples are consistent throughout.

**Time budget sanity check:**

| Task | Time |
|---|---|
| 1. Voice spec doc | 1.5h |
| 2. Audit schema | 0.5h |
| 3. Foundation #2 brief | 1h |
| 4. Foundation #2 production | 3-4h |
| 5. Asset audit (4h cap) | 4h |
| 6. Top 30 / top 20 | 1h |
| 7. Permanent homes for surfaced | 2-3h (depends on how many need republishing) |
| 8. Identity hub HTML | 3-4h |
| 9. Hub deployment | 1h |
| 10. Bio convergence | 1h |
| 11. LinkedIn vanity URL | 0.5h |
| 12. Substack URL decision + exec | 1h (or 0.5h if deferred) |
| 13. Profile photo | 1h |
| 14. Footer audit | 1h |
| 15. Phase 2 spec | 1.5h |
| 16. Verification checklist | 0.5h |
| **Total** | **22-26h** |

This is **higher than the spec's "10–15h" estimate** (spec §TL;DR). The spec underestimated. Honest re-budget: **~20–25h focused work** spread over 2–3 weeks. Worth re-stating to the user.

---

## Plan complete and saved.

Plan saved to `docs/superpowers/plans/2026-04-28-phase-1-identity-convergence-plan.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration. *Note: most tasks are user-execution (you on platforms / you in design tools). Subagents help with the AI-doable tasks (voice spec doc draft, hub HTML, Phase 2 spec draft).*

2. **Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints. *Best for the AI-doable tasks; user actions still happen on the user's side.*

**Which approach?**
