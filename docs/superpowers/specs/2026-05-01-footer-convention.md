# Footer Convention — site-wide standardization

**Status:** Draft, awaiting sign-off
**Date:** 2026-05-01
**Scope:** BSA (`bitcoin-sovereign-academy`) + FSA (`financially-sovereign-academy`)
**Supersedes:** prior footer convention (`Created by Dalia · bitcoinsovereign.academy`)

## 1. Convention (locked)

| Page type | Footer text |
|---|---|
| **English default** (everywhere except homepages) | `© 2026 The Sovereign Academy · Educational content only · Not financial advice` |
| **Spanish default** (everywhere except homepages) | `© 2026 The Sovereign Academy · Contenido educativo únicamente · No es consejo financiero` |
| **BSA homepage** (`bitcoinsovereign.academy/`) | `Created by Dalia · thesovereign.academy` |
| **FSA homepage** (`financiallysovereign.academy/`) | `Created by Dalia · thesovereign.academy` |

The convention applies to the **bottom-most legal/attribution line** of `<footer>`. Pages may keep richer content above (link columns, hub navigation, taglines).

## 2. Scope

| Repo | Total HTML files | Currently have `<footer>` | Need footer added |
|---|---|---|---|
| BSA | 330 | ~14 | ~316 |
| FSA | ~57 | 7 | ~50 |
| **Total** | **~387** | **~21** | **~366** |

BSA breakdown: 110 path modules (1 has footer), 48 demos (5), 22 deep-dives (0), 20 top-level (8), 56 section pages (institutional, dalia, weekly, fsa/, ai-tutors, youth-families, programa-colombia, certificates), plus advisor certification modules.

FSA breakdown: 13 modules, 5 calculators, 6 answers, 2 articles, 13 programa-colombia (Spanish), 7 institutional, 1 homepage, plus 404 / assessment / my-journey / admin / bridge.

## 3. Exclusions (no footer changes)

| File / pattern | Reason |
|---|---|
| `certificates/branded_certificate_page.html` | Client-branded template (Oakwood) — keeps client brand |
| `google*.html` (verification stubs) | No human reader; bare HTML for Google Search Console |
| `googleverification.html` | Same |
| `**/node_modules/**`, `**/.venv/**` | Vendored dependencies |
| `**/admin/**` | Internal-only dashboards (FSA `admin/dashboard.html`) — confirm |
| `paths/builder/stage-4/module-3.html` 3× misused `<footer>` tags | Used as quote-attribution containers (`- Bitcoin Core Contributor`); separate HTML semantic bug — flag, do not touch in this rollout |

## 4. Spanish-language pages

Spanish footer applies to:
- `paths/curious/stage-1/es/*.html` (3 files in BSA)
- `programa-colombia/**/*.html` (13 files in FSA)
- Any other `*/es/*.html` discovered during audit

## 5. Implementation

### 5.1 CSS class

Add a single shared class to BSA `css/brand.css` and FSA equivalent (`css/main.css` or whichever exists):

```css
.legal-footer {
  margin-top: 2rem;
  padding: 1.5rem 1rem;
  border-top: 1px solid var(--color-border);
  text-align: center;
  font-size: 0.85rem;
  color: var(--color-muted);
  line-height: 1.5;
}
```

(Verify token names against current `brand.css` before shipping — BSA has `--color-muted`, `--color-border`. FSA has its own palette.)

### 5.2 Markup pattern

**Pages with no `<footer>` today (default footer):**

```html
<footer class="legal-footer">
  © 2026 The Sovereign Academy · Educational content only · Not financial advice
</footer>
```

**Spanish pages with no `<footer>` today:**

```html
<footer class="legal-footer">
  © 2026 The Sovereign Academy · Contenido educativo únicamente · No es consejo financiero
</footer>
```

**Homepage exception (BSA + FSA `index.html`)** — replace bottom legal line with:

```html
<p class="legal-footer-line">
  Created by Dalia · <a href="https://thesovereign.academy">thesovereign.academy</a>
</p>
```

(Inside the existing `<footer>` after the link columns.)

**Pages with `<footer>` already** — keep upper content (links, hub nav, taglines), replace bottom legal line only. Manual edits, ~21 files.

### 5.3 Insertion point for pages without `<footer>`

- **Path modules:** after the closing `</nav>` of the module-navigation block, before `</body>`
- **Demos:** before the closing `</body>` (or before the final `<script>` block if scripts are at body-end)
- **Deep dives:** same
- **FSA modules / calculators / answers:** before closing `</body>`

A small Python script (modeled on `scripts/remap-labs.py`) inserts the block. Dry-run on 5 representative files first, diff, then full sweep.

## 6. Rollout order

1. **CSS class added** to BSA `brand.css` and FSA equivalent. Visual check on 1 page.
2. **Phase 1 — manual edits, ~21 files** (pages with existing `<footer>`):
   - BSA: `index.html`, `dalia/index.html`, `dalia/logo-explorations.html`, `weekly/index.html`, `sponsor.html`, `membership.html`, `terms.html`, `privacy.html`, `transparency.html`, `licensing.html`, `earn-back-terms.html`, `institutional/*.html`, `institutional/wealth-advisors/index.html`, plus the few demos with existing footers
   - FSA: 7 institutional + programa-colombia/index.html
3. **Phase 2 — script bulk-insertion**, dry-run on 5 path modules + 5 demos + 5 deep-dives, review diff, then full sweep across BSA (~316 files) and FSA (~50 files).
4. **Phase 3 — audit:** grep every in-scope file for `legal-footer`. Any missing → manual fix.
5. **Phase 4 — commits:** one commit per repo, descriptive message referencing this spec. Push to main.

## 7. Memory update

Update `~/.claude/projects/-Users-dalia-projects-bitcoin-sovereign-academy/memory/project_footer_convention.md` with the new locked convention. The old file currently says `Created by Dalia · bitcoinsovereign.academy` everywhere — that becomes false after this rollout.

## 8. Open questions before execution

1. **Compound footers** (BSA `index.html`, `dalia/index.html`, `weekly/index.html`): keep richer content (link columns, hub nav, taglines) above the new legal line — confirm. Alternative is to strip everything and leave only the legal line.
2. **`weekly/index.html`** currently has the tagline *"Built with truth. Maintained for sovereignty."* — keep, replace, or move into `dalia/index.html` instead?
3. **`fsa/admin/dashboard.html`** is an internal dashboard — exclude or include?
4. **Wealth-advisors page** currently reads *"Not investment advice"* (legally narrower) → unify to *"Not financial advice"* per Dalia's instruction. Confirmed.
5. **Domain string in homepage line** — `thesovereign.academy` (matches `dalia@thesovereign.academy` email and existing institutional sister-link). Confirmed.

## 9. Risks

- **Path modules use mixed nav class names** (`module-navigation` on curious/builder/sovereign vs `module-nav` on others) — script needs to be class-agnostic and just insert before `</body>`.
- **Demos with absolute vs relative CSS paths** — already standardized to absolute per `CLAUDE.md`. New `.legal-footer` class lives in `/css/brand.css`, so absolute path consumers work; verify no demo still loads a different stylesheet.
- **Spanish detection** — script uses path heuristic (`/es/` or `programa-colombia/`). Manual review of any other `lang="es"` files.
- **Locked convention diverges from prior memory** — must update memory in same commit window so no stale instruction overrides the new spec in future sessions.
