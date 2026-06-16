# Spec — TBA Inversion on `collaborative-security.html`

**Date:** 2026-06-16
**Page:** `paths/sovereign/stage-3/collaborative-security.html` (826 lines, consumer / Sovereign-path Stage 3)
**Status:** DRAFT — awaiting Dalia's sign-off. No code written.
**Source rules:** `memory/project_tba_monetization_boundary` · `memory/feedback_collaborative_security_framing` · CLAUDE.md voice spec.

---

## 1. Why this page needs an inversion

The page currently presents collaborative security as a **vendor you go shopping for** ("Research providers: TBA by Choice, Onramp, or attorney-based solutions") and as a **tier you upgrade to when your stack grows**. Both framings violate locked rules, and the page never discloses the thing that actually distinguishes the model: with a collaborative-security *service*, the family education / inheritance docs / ongoing support are **included in the fee, not sold separately**.

"Inversion" = flip the ending from *"here is a list of vendors, including TBA, go research them"* → *"here is how to think about it; if you want help deciding, book a call with Dalia"* + an honest free-inclusion disclosure, with TBA named only as **one example** carrying the conflict disclosure.

## 2. Concrete violations found (with line refs)

| # | Line(s) | Problem | Locked rule broken |
|---|---------|---------|--------------------|
| V1 | 672, 724, title region | Body says "Collaborative **Custody**" | Term must be "collaborative **security**" (one "often marketed as collaborative custody" gloss allowed) |
| V2 | 674, 737 | "Research providers: **TBA by Choice**, Onramp, or attorney-based solutions" | (a) Wrong name — it's **The Bitcoin Adviser**; (b) public-referral policy: CTAs route to **Dalia's calendar**, don't list TBA as a vendor to shop |
| V3 | whole page | **No free-inclusion disclosure** (education/docs/inheritance/support included in a service fee, not an add-on; DIY kits are the separate self-custody route) | Messaging rule #1 — never imply TBA charges extra for education or that a kit is a prerequisite |
| V4 | whole page | **No consumer disclosure** ("one example of a collaborative security model, not the only qualified option") and no "I advise at The Bitcoin Adviser" COI line | Disclosure rule for any page naming/recommending TBA |
| V5 | 743, 753, 770 | "upgrade to collaborative security as your holdings grow" / "Either model could work" / scoring by holdings size | Banned **middle-ground / upgrade-tier** framing — must be "self-custody with guardrails," not "halfway to custody" |
| V6 | 313–396 | Page teaches **two** models (Assisted Multisig vs Collaborative Custody) | Locked **three-model rule** — must teach single-sig / DIY-self-managed multisig (humanly centralized) / collaborative security with independent keyholders; never collapse to two |
| V7 | quiz results 722–771 | Delivers a prescriptive verdict ("X Recommended") keyed to dollar holdings | Inform-not-convince; "no perfect setup, only tradeoffs" |

## 3. The scope decision (A–D) — **needs your pick**

How far to take this in one pass:

- **A. Minimal inversion.** Fix terminology (V1), replace vendor lines + quiz "Next Step" with a calendar-first CTA (V2), add free-inclusion + consumer disclosure blocks (V3, V4). *Leaves V5/V6/V7 (two-model structure + upgrade framing) live.*
- **B. Inversion + three-model alignment (RECOMMENDED).** Everything in A, **plus** rebuild the comparison to the three locked models (V6), and replace holdings-based "upgrade" language with the guardrails framing (V5). Quiz reframed from "which vendor tier" to "which model fits, and what to bring to a conversation" (V7). Honors every locked rule; moderate effort.
- **C. Full "discover-not-convince" rebuild.** Rebuild the page like the skeptic path — predict→measure, no verdict, unbounded, calendar-first. Highest effort; likely over-scoped for this task.
- **D. CTA band-aid only.** Swap just the two "research TBA/Onramp" lines for a calendar CTA + one-line disclosure. Defers terminology + three-model. Stopgap.

**Recommendation: B.** A and D leave live violations of locked rules (three-model, upgrade framing); C is a bigger rebuild than the inversion calls for. B is the right altitude — it makes the page fully compliant and on-message without turning into a pedagogy project.

## 4. Proposed copy (for your voice-check — applies under A or B)

### 4a. Replace the two "Next Steps" provider lists (lines 671–680) and both quiz "Next Step" lines with ONE calendar-first block:

> **Deciding between these on your own is the hard part.**
> There's no universally "best" setup — only tradeoffs that fit one family and not another. The keys, the documentation, the recovery test, and who you trust to hold a key are decisions worth talking through before you move real funds.
>
> **Need help thinking through a real multisig or inheritance setup?** [Book a call with Dalia →](https://meetings.hubspot.com/dalia-platt)

### 4b. Add a free-inclusion disclosure block (new, near the collaborative-security explanation):

> **A note on how collaborative-security services are priced.**
> With a collaborative-security service — for example, The Bitcoin Adviser, where I advise — the setup, the estate/inheritance protocol, **education for you *and* your family**, and ongoing support are **included in the service fee**, not sold as separate add-ons. That's a different path from BSA's self-custody kits, which are for people doing it themselves (single-sig, or multisig where you hold every key). One is *done-with-you*; the other is *do-it-yourself*. Neither is a step toward the other.

### 4c. Consumer + conflict disclosure (verbatim from the locked ruleset):

> The Bitcoin Adviser is **one example of a collaborative-security model, but it is not the only qualified option.** I advise there, so treat this as disclosure, not a recommendation — compare any provider against others before you commit.

### 4d. Terminology + framing find-replace (V1, V5):
- "Collaborative Custody" → "Collaborative Security" (headings, body, quiz labels). Keep at most one "often marketed as collaborative custody" gloss.
- "upgrade to collaborative security as your holdings grow" → "collaborative security is **self-custody with guardrails** — you keep custody and hold a key; it removes the one-person, one-mistake fragility a DIY plan still carries." Drop holdings-size as the deciding axis.
- Any "eliminates single points of failure" → "designed to **reduce** single points of failure" (audit during implementation).

### 4e. (B only) Three-model restructure of §"Model Comparison" (lines 313+):
Replace the two-column Assisted-vs-Collaborative table with three columns:
1. **Single-sig self-custody** — one key, full control, full fragility (one mistake = loss).
2. **DIY / self-managed multisig** — *technically* multisig, but one person may still control the whole human system (key count ≠ key control). Honest credit: survives one lost/stolen key, full sovereignty, fine for careful users who document **and test** recovery.
3. **Collaborative security (independent keyholders)** — e.g. TBA's 2-of-3: client is legal owner and initiates transactions; no single party (including the client) can move funds alone. Honest tradeoffs: less unilateral control, coordination, fees, provider selection. Required line: *"still depends on assumptions — the outside keyholders must be independent, reachable, and not aligned against the client."*

## 5. Out of scope / do-not-touch
- TBA fee numbers (don't quote tier %s on a consumer page).
- Hardware-wallet matrix (543–656) — accurate, leave it.
- Don't claim inheritance/recovery is "certain" or "guaranteed."
- Don't say the client has "majority control" or can "transact/recover independently."

## 6. Verification plan (at implementation, after sign-off)
- `grep` the page for `custody`, `TBA by Choice`, `eliminates`, `upgrade`, `?` → confirm zero banned strings.
- Confirm exactly one `<main>` landmark (page already balanced).
- Confirm the only outbound CTA is the calendar link (no TBA-vendor link).
- Voice-check the three copy blocks against `docs/marketing/voice-spec.md`.
- Auth/gating not involved — static content; rendered check in preview is meaningful here.

---

**Decision needed:** (1) pick A / B / C / D; (2) approve or edit the §4 copy blocks (esp. 4a/4b wording in your voice); (3) confirm the consumer disclosure vs. adding the first-person "I advise at The Bitcoin Adviser" COI line (§4c includes both — keep both or trim).
