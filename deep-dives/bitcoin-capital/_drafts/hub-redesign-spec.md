# Bitcoin Capital Hub — Redesign Spec

*Current state: simple grid with one shipped deep dive + placeholder "Coming next" list. Goal: a structured hub for a multi-piece resource, with a Start Here flowchart routing readers to the right piece.*

---

## Information architecture — current vs. proposed

### Current (`/deep-dives/bitcoin-capital/index.html`)

```
Hero ("First-principles, run the actual numbers")
↓
Featured card: Bitcoin-Backed Mortgages
↓
Placeholder: Lightning Liquidity (Coming Next)
↓
Footer
```

Single-piece focused. Works for now but won't scale to 4+ deep dives.

### Proposed

```
Hero with disclosure banner
↓
"Start Here" routing flowchart (interactive)
↓
Featured deep dives (2-up grid for shipped pieces)
↓
Coming next (with status: drafting / planned / researching)
↓
Comparison-at-a-glance (small matrix linking to each piece's calculator)
↓
About this resource (methodology + verification + disclosure)
↓
Footer
```

---

## The "Start Here" flowchart — the routing primitive

Reader lands on the hub with a vague question ("I have Bitcoin and want to do something with it without selling"). The flowchart routes them to the right deep dive in 2–4 clicks.

```
┌──────────────────────────────────────────────────┐
│  What are you trying to do with your Bitcoin?    │
└──────────────────────────────────────────────────┘
         │           │           │           │
         ▼           ▼           ▼           ▼
  ┌───────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
  │ Buy a     │ │ Get cash │ │ Get more │ │ Hold for │
  │ house     │ │ for any  │ │ BTC      │ │ family / │
  │           │ │ purpose  │ │ liquidity│ │ legacy   │
  └───────────┘ └──────────┘ └──────────┘ └──────────┘
         │           │           │           │
         ▼           ▼           ▼           ▼
   Mortgages    BTC Loans   BTC Loans    Inheritance
   Deep Dive    Deep Dive   Deep Dive    (planned)
   (Model A     (provider   (LMC          
    or B)       comparison) section)      
```

Implementation: clickable card grid where each card represents a starting question. Hover state shows a one-line preview. Click jumps to the right deep dive at the right section anchor.

Eventually: progressive disclosure (click first card → second row of refinement questions → final landing). For v1, keep it single-level for simplicity.

---

## Featured pieces — visual treatment

Two-up grid (vs. current single-card layout):

```
┌─────────────────────────────────┐  ┌─────────────────────────────────┐
│ [FEATURED · INTERACTIVE]        │  │ [FEATURED · INTERACTIVE]        │
│                                 │  │                                 │
│ Bitcoin-Backed Mortgages        │  │ Bitcoin-Backed Loans            │
│ A First-Principles Deep Dive    │  │ A First-Principles Deep Dive    │
│                                 │  │                                 │
│ Should you pledge or sell?      │  │ Pick the right BTC lender       │
│ Model A vs Model B, calculator, │  │ across 4 providers. Calculator, │
│ 4 charts, structural risk...    │  │ hedge analysis, options...      │
│                                 │  │                                 │
│ 25 min · 4 charts · interactive │  │ 30 min · 4 providers · options  │
│                                 │  │                                 │
│ Open the deep dive →            │  │ Open the deep dive →            │
└─────────────────────────────────┘  └─────────────────────────────────┘
```

Each card shows status (Shipped / Drafting / Planned), meta (read time, chart count, interactive features), and a clear CTA.

---

## Comparison-at-a-glance section

A small unified matrix that lets readers see across deep dives at a glance:

| Topic | Best for | Read time | Calculator | Status |
|---|---|---|---|---|
| Bitcoin-Backed Mortgages | 30-yr housing finance with BTC pledged | 25 min | Yes — Model A projection | Shipped |
| Bitcoin-Backed Loans | 1–5 yr liquidity from BTC | 30 min | Yes — 4-provider comparison + options overlay | Drafting |
| Self-Custody Multisig Mortgages | Sovereignty-grade mortgage structures | TBD | TBD | Researching |
| BTC Treasury Structure | Corporate / business BTC holdings | TBD | TBD | Planned |
| BTC Inheritance Planning | Legacy and estate planning with BTC | TBD | TBD | Planned |

Each row links to the deep dive. Status bullets are clear so readers don't expect things that aren't there.

---

## About this resource section (new — earns trust)

Six paragraphs at the bottom of the hub that establish the resource's epistemic character:

1. **Why this exists.** What makes BTC capital structure interesting and underserved.
2. **What we cover and what we don't.** Honest scope statement (centralized, not DeFi; consumer, not institutional).
3. **How we verify.** Linked to `verification-log.json`. "Every claim has a date and a source."
4. **Disclosures.** TBA affiliation clearly stated, linked to full provider disclosures.
5. **Maintenance cadence.** Quarterly verification. Event-triggered updates. Last full review date.
6. **How to contribute / correct.** Email + GitHub issues link.

---

## Visual treatment changes

### Color & typography (no change from current)
- BSA dark canvas (#0b0e14), Bitcoin orange (#f7931a)
- Source Serif 4 headings, Inter body
- Card-based layout with subtle hover states

### Spacing & layout (changes)
- Hub is wider (1200px max vs. current 800px) to accommodate 2-up grid and matrix
- More breathing room between sections
- "Start Here" flowchart gets its own framed section with light orange gradient background to signal "this is the entry point"

### Iconography
- Each deep dive gets a small SVG icon (mortgage = house, loans = stacked coins, treasury = building, etc.)
- Status pills (Shipped / Drafting / Planned / Researching) with color coding

### Mobile treatment
- Flowchart collapses to vertical stacked cards on narrow screens
- Featured pieces stack 1-up below 768px
- Matrix becomes a scrollable horizontal table

---

## Build sequence

1. **HTML scaffolding** — restructure `index.html` with the new IA
2. **"Start Here" flowchart** — interactive card grid, 4 entry questions
3. **Featured pieces** — 2-up grid component, scalable to N pieces
4. **Comparison matrix** — table component pulling from manifest of pieces
5. **About this resource** — content section + verification log link
6. **Mobile responsive pass** — test under 768px
7. **A11y pass** — keyboard nav, screen reader labels, focus states

Estimated time: **1 day of focused work**.

---

## Should this happen now or after the Loans deep dive ships?

**Now (recommended).**
- The hub upgrade benefits both the existing Mortgages piece AND the upcoming Loans piece
- Once the Loans deep dive lands, the hub needs to feature it cleanly — better to have the architecture in place
- The "Start Here" flowchart explicitly routes readers, which improves discoverability of both pieces
- Doing it now avoids a later "we need to redo the hub" task that blocks the Loans launch

**Counterargument: After.**
- Loans is the higher-value content — should ship first
- Hub redesign is supporting infrastructure, not the core deliverable

**My take:** do the hub redesign first as a 1-day task. It's small enough that it doesn't materially delay the Loans deep dive, and the Loans deep dive lands more cleanly into a properly structured hub.

---

## Open question

Should the "Start Here" flowchart be a permanent feature on every Bitcoin Capital deep dive page (sticky / always accessible), or only on the hub? A persistent navigation pattern is more usable but adds visual complexity to each page.

My recommendation: **hub only**, but each deep dive has a small footer link "← Back to Bitcoin Capital Start Here" so readers who lose orientation can recover.
