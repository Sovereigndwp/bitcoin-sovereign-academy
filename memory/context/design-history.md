# Design history — locked-decision rationale

> Why the locked conventions are what they are. Salvaged from internal design-review pages before any archive moves (Cut Salvage Audit 2026-06-11). Source pages noted per section; the locked outcomes live in CLAUDE.md "Locked conventions".

## The Diamond System (logo) — rationale

**Source:** `dalia/logo-explorations.html` (Diamond System v2, noindexed internal review). **Locked outcome:** Diamond = BSA, stroke = Dalia; production SVGs at `assets/dalia/`.

**The system.** One motif, two derivative marks. Combined mark is canonical wherever both names appear (footers, hub headers, infographics, decks, social bios). Diamond solo for BSA-only contexts; stroke + ghost diamond for Dalia-only contexts. The relationship between the brands is encoded *geometrically*, not verbally.

**Diamond = BSA because:** faceted = multiple ways of looking (audiences, topics, paths); weighted = substantive, durable, generational; dark = serious, calm, not loud; gem form reads as heirloom — generational protection embodied in the shape.

**Stroke = Dalia because:** diagonal rising = sovereign ascent, looking forward; asymmetric = the human hand that cuts across; gold gradient = warmth, the "look closer" line; one decisive line = no empty slogans.

**Stroke-angle decision:** A (rising right) = aspirational, matches source motif — recommended canonical. B (level) = clearest "bridge" reading but static. C (descending right) = tightest map to Dalia's calibration ("sees the trap… points and says 'Look closer'") — reserved for provocative essays/decks. **Avoid descending-left** — reads as a "no"/cancel mark.

**Calibration mapping (Dalia's own words → mark):** "calm, sharp, impossible to distract" → geometric purity + sharp edges, no decoration. "Warm, but not soft" → dark substantive form + warm gold cut. "Allergic to empty slogans" → one shape, one line, no words in the symbol. "Education + bridges" → faceted diamond holds multiple perspectives; the stroke is the path across — education as the act of crossing.

**Known risks recorded at decision time:** gem/jewelry association can feel commercial if shading is too polished; geometric mark cooler than the hand-drawn Foundations style — final execution wanted hand-drawn refinement; wrong stroke angle can read as cancellation.

**Background behavior:** dark = BSA hub / Foundation infographics; light = Substack body, white papers, business cards, LinkedIn OG images.

## Icon system (about.html) — Phase 1 review

**Source:** `dalia/icon-explorations.html` (sub-project #2.7, round 2, noindexed internal review). **Key principle carried forward:** locked spec §7.4 — icons "used only where they reduce reading load"; for the about.html page-title slot, "no icon at all" was seriously considered the right answer since an h1 is already short and scannable. Round 1 (diamond+stroke and solid diamond in the title slot) was rejected. Scope: replace the 5 emojis stripped from about.html (title slot + 4 Core Values cards), two variants per concept, rendered at true usage sizes (48px cards / 32px title), `currentColor` inheritance.

*Implementation status vs about.html: see Cut Salvage Audit 2026-06-11 report addendum.*
