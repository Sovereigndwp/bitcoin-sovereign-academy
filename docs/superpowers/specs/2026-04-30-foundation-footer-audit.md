# Footer Convention Audit — Spec

**Date:** 2026-04-30
**Phase 1 reference:** `docs/superpowers/specs/2026-04-28-phase-1-identity-convergence.md` §5.3
**Plan reference:** `docs/superpowers/plans/2026-04-28-phase-1-identity-convergence-plan.md` Task 14
**Status:** Draft. Awaiting sign-off before audit work begins.

---

## 1. Goal

Verify the footer convention (per §5.3) is applied consistently across every Dalia-authored artifact that ships under the Bitcoin Sovereign Academy brand. Record gaps. Backfill the cheap ones; defer the expensive ones with a documented reason.

This is **not** a redesign pass. It is a *consistency* pass: same closing line, same attribution, same logo where it's already present.

## 2. Why now

Foundation #2 just shipped with the new locked logo (commit `4cb45938`) and a refined footer line. The next time we cite "the Foundations 1–5 series" externally (lead magnet, hub, syndication), they need to look like one body of work. If a viewer scrolls from #1 to #5 and sees five different footer styles, the brand reads as drift, not intent.

The footer convention is also the *cheapest* possible test of whether the brand identity has actually converged. If we can't get one line of text consistent across five infographics, no other Phase 1 deliverable means much.

## 3. Open decision: canonical footer text

The Phase 1 spec §5.3 and the Foundation #2 production diverged. Resolve this **before** auditing siblings.

| Source | Footer text on visual artifacts |
|---|---|
| Phase 1 spec §5.3 | `Dalia \| bitcoinsovereign.academy` |
| Foundation #2 (shipped 2026-04-30) | `Created by Dalia · bitcoinsovereign.academy` |
| Brief `foundation-2-content.md` §"Footer line" | `Created by Dalia \| bitcoinsovereign.academy` |

Three slightly different versions exist. The Foundation #2 ship used `·` (interpunct) instead of `|`. The brief said `Created by` prefix; the spec dropped it.

**Proposed resolution:** lock to **`Created by Dalia · bitcoinsovereign.academy`** (the version that actually shipped on the most recent artifact, which has the new logo).

**Why:**
- "Created by" makes the attribution explicit for new viewers (mild composability win — bridges authority pair without overclaiming).
- The interpunct `·` reads cleaner in small footer type than a vertical bar `|`, especially on dark backgrounds.
- The version is already inlined in `content/foundations/foundation-2.{en,es}.json` and is what 2026-04-30+ artifacts will inherit.

ES variant: **`Creado por Dalia · bitcoinsovereign.academy`** (already shipped on the ES Foundation #2).

**Substack/LinkedIn closing line** stays as §5.3 stated, no drift to resolve:
> *"I write about Bitcoin, custody, privacy, and financial sovereignty at bitcoinsovereign.academy."*

ES equivalent (decision needed — propose):
> *"Escribo sobre Bitcoin, custodia, privacidad y soberanía financiera en bitcoinsovereign.academy."*

**Sign-off needed on:** the visual-artifact text (`Created by Dalia · bitcoinsovereign.academy`) and the ES Substack closing line.

## 4. Scope inventory

What gets audited, in priority order:

### 4.1 Visual artifacts (in repo)

- ✅ `assets/foundations/foundation-2-{en,es}-{portrait,square,card}.png` — already shipped with locked logo + canonical footer; included in the audit only as the *reference* others get compared against.

### 4.2 Visual artifacts (NOT in repo)

The Foundation siblings (1, 3, 3v2, 4, 5) are not files in this repo. They live in Canva / Figma / wherever you produced them, and are surfaced externally (LinkedIn, Substack header images, etc.). The audit cannot run against them programmatically — it needs you to open each source file and inspect.

For each sibling, the audit asks three questions:
1. Does the footer text match `Created by Dalia · bitcoinsovereign.academy` exactly?
2. Is the BSA logo present in the footer area?
3. Is the visual treatment (font, color, position) close enough to Foundation #2 that they look like the same series?

Q1 is binary, fix-or-not. Q2 is binary. Q3 is a judgment call — flag drift, don't fix it (out of scope).

### 4.3 Written artifacts (Substack)

Last 10 published Substack posts at `sovereigndwp.substack.com` (or the new handle if Task 12 has executed by audit time). For each, verify the closing line is present in the language version that matches the post (EN closing line on EN posts, ES on ES posts).

Anything older than the last 10: out of scope. New cadence applies forward only.

### 4.4 Written artifacts (LinkedIn, X, FSA)

Out of scope for Phase 1 Task 14. Per §5.3, LinkedIn carries the closing line "when relevant" — not every post — so an audit there would be subjective. X has a 280-char limit that often won't fit the line. FSA has its own footer convention (TBD in a future task). Document these as **deferred** with reasons.

### 4.5 Identity hub footer

`/dalia/index.html` already has a footer block (per Task 8). Verify it carries the bio + the closing line variant appropriate for an identity hub (likely the bio itself, not the Substack closing line). This is a one-file diff, do it inline.

## 5. Audit method

| Surface | Tool | What to capture |
|---|---|---|
| Foundations 1, 3, 3v2, 4, 5 source files | Open in design tool, read footer | Pass/fail on text, logo present y/n, visual drift note |
| Substack last 10 | Open posts in browser | Pass/fail per post on closing line |
| Identity hub | `grep -n "bitcoinsovereign.academy" dalia/index.html` | Confirm closing line presence |

Each surface gets one row in the audit table (see §6).

## 6. Where to record results

Append a `## Footer audit` section to `docs/marketing/handle-migration-plan.md`. If that file doesn't exist (Task 11 not yet executed), create it as a stub with just this section — Task 11 will fill the rest later.

Table format:

| Surface | Type | Footer text correct? | Logo present? | Notes |
|---|---|---|---|---|
| Foundation #1 | infographic-EN | yes/no/N/A | yes/no | one line |
| Foundation #2 | infographic-EN | ✅ reference | ✅ reference | shipped 2026-04-30 |
| ... | ... | ... | ... | ... |
| Substack post 1 | written-EN | yes/no | N/A | post slug |

## 7. Gap handling rules

For each gap found:

- **Cheap fix (< 5 min, no design tool needed):** fix inline, commit, mark resolved.
  Examples: hub HTML footer text, a typo in a Substack closing line.

- **Medium fix (re-export needed in design tool):** record gap, do **not** fix in this audit. Add a follow-up task in `handle-migration-plan.md` with target date.
  Examples: Foundation #1 footer text drifted, Foundation #4 logo missing.

- **Expensive fix (visual style drift):** record only. Out of scope. The 1–5 series visual reconciliation is its own future task.

The forcing function: **the audit closes after 90 minutes of work**, regardless of fix completeness. The deliverable is the *recorded list of gaps*, not zero gaps.

## 8. Re-rendering siblings through the new pipeline (out of scope, but documented)

Now that the Path B v2 render pipeline exists (`scripts/render-foundations.mjs`), there's a *latent* option to migrate Foundations 1, 3v2, 4, 5 into JSON content + template-driven SVG, exactly as Foundation #2 ships. That would make the entire series consistent for free, in any language, at any ratio.

This is a real opportunity but **not what Task 14 is**. Task 14 is text-and-logo consistency, ~90 min. The migration is a separate spec, ~10–15 hours. Document as a Phase 2 candidate in `handle-migration-plan.md`.

## 9. Exit criteria

The audit is complete when:

1. The canonical footer text decision (§3) is signed off and reflected in `docs/marketing/voice-spec.md` §6 (brand asset stack) — one-line edit.
2. Every Foundation 1, 3, 3v2, 4, 5 has an audit row in `handle-migration-plan.md`.
3. Every cheap-fix gap is closed with a commit.
4. Every medium-fix gap has a follow-up task line with target date.
5. The 90-minute timer has expired OR all rows are filled, whichever comes first.

Phase 1 verification §12 row #14 is judged "pass" if (1)+(2)+(3) are done and ≥1 medium-fix has a target date.

## 10. Time budget

| Step | Time |
|---|---|
| Sign-off on §3 (chat round-trip) | 10 min |
| Update `voice-spec.md` §6 to reflect canonical text | 5 min |
| Audit Foundations 1, 3, 3v2, 4, 5 in design tool | 30 min |
| Audit Substack last 10 | 20 min |
| Audit `dalia/index.html` footer | 5 min |
| Record everything in `handle-migration-plan.md` | 15 min |
| Cheap fixes + commits | 15 min |
| **Total** | **~100 min** |

Within the 90-min budget if some steps run short. Over by 10 min in the worst case — accept it.

## 11. Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Sibling Foundations have drifted *visually* (font, color), not just text | high | Out of scope per §7. Record, don't fix. |
| User can't locate Foundation 1 source file | medium | If lost, mark "source not located" in audit and propose re-rendering through Path B v2 as the recovery path. |
| Substack URL change happens mid-audit (Task 12) | low | Snapshot the audit at the start; re-verify closing-line URLs at end. |
| Canonical text decision (§3) drags into a longer brand discussion | medium | Force the decision before audit starts. The audit is *blocked* until it's signed off — do not start otherwise. |

## 12. What this spec is not

- Not a rebrand of the Foundations series.
- Not a visual-consistency audit of fonts / colors / spacing.
- Not a Substack URL migration (that's Task 12).
- Not a logo-redesign verification (that's done — see `project_logo_system.md`).
- Not a backfill of LinkedIn or X posts (deferred per §4.4).

Strictly: text + logo presence, on 5 infographics + 10 Substack posts + 1 hub HTML file.

---

## Sign-off checklist

- [ ] §3 canonical footer text resolved: **`Created by Dalia · bitcoinsovereign.academy`** (visual) + EN/ES Substack closing lines as proposed.
- [ ] Sibling Foundation source files (1, 3, 3v2, 4, 5) are reachable by you in their design tool.
- [ ] 90-min time budget acceptable.
- [ ] Out-of-scope items in §12 are agreed.

When all four are checked, audit can begin.
