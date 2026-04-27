# Redesign spec — coinjoin-simulator

Target file: [interactive-demos/coinjoin-simulator/index.html](interactive-demos/coinjoin-simulator/index.html)
Status: **DRAFT — awaiting sign-off, no code shipped yet**
Date: 2026-04-27

## What's actually wrong (correcting the audit)

The audit agent flagged this as "tools defunct — embarrasses on review." That's **partially wrong**. The tools section was already updated in commit [d07753be](https://github.com/Sovereigndwp/bitcoin-sovereign-academy/commit/d07753be) (Feb 2026): it lists JoinMarket, Sparrow (with the 1.9.0 Whirlpool removal flagged), and Ginger Wallet, plus a "Recent history" panel about Samourai/Wasabi shutdowns.

**The real problems:**

1. **Stale post-shutdown landscape.** The fix from Feb 2026 is now itself out of date. Active 2026 coordinators (Kruw, WabiSabi-listed coordinators, JAM/Jam.bitcoin for JoinMarket on Umbrel/Start9) are missing. The page acts like the post-shutdown era is the *current* state when in fact the ecosystem has rebuilt around independent coordinators.
2. **No "as of" timestamp.** The "Recent history" panel reads as evergreen but is point-in-time.
3. **Audience mismatch.** Defaults to "Bitcoin privacy is important for everyone" framing. The real audience is segment 2 (Bitcoin holder with weak custody), 3 (HNW), and 7 (family inheritance OPSEC). Beginners (segment 1) shouldn't be the default voice.
4. **Tone breaches.** 11 distinct emojis on the page (🎭🏪💼🎁🌀⚠️🛠️📜🏆🎓📚) — clashes with "premium-but-accessible, slightly skeptical of fake simplicity."
5. **Applicability dead-end.** Phase 4 of the simulator ends with "Anonymity Set: 5" then "Next: Summary →". No bridge to "now do this in real life with Sparrow's coin-control on testnet" or "talk to your wealth advisor about your disclosure surface."
6. **A11y gaps.** `<input type="range">` and the participant slider don't have explicit `aria-label`s; the mix-amount `<select>` has no associated `<label for="...">`; emoji-only icons in cards have no text alternative.

## Page job-to-be-done

**Primary:** Help a Bitcoin holder understand that on-chain transparency is a *real* surveillance/security risk to their family and counterparties — not an abstract concept — and give them a credible, current path to reduce that exposure. Move them from "I should look into privacy someday" to "here's the next concrete thing I will do this week."

**Secondary:** Give a wealth advisor a clean reference page they can send a client *who is anxious about being doxed by their on-chain footprint*. The advisor doesn't need to teach CoinJoin — they need a credible explainer with current tooling.

## Target audience (in priority order)

| # | Segment | Real risk this page reduces |
|---|---|---|
| 2 | Bitcoin holder with weak custody | Disclosing balance/spending to merchants, employers, counterparties; future targeting risk |
| 3 | HNW Bitcoin holder | Concentrated wealth visible on-chain → physical-security risk, kidnapping risk, social-engineering surface |
| 7 | Family doing inheritance | Heirs inherit not just keys but a public spending history; counterparties learn family wealth structure |
| 4 | Wealth advisor | Need a defensible, current reference for the "is my client safe?" conversation |

**Out of scope for this page:** segment 1 (beginner without Bitcoin — privacy is not their immediate problem), 5/6 (Colombia — handled by ES localization track later, not in this redesign).

## Brand-voice tone (this page)

- **Sharp, not sensational.** "Public by default" framing — but no "WARNING ⚠️" boxes, no fear-mongering.
- **Skeptical of fake simplicity.** Explicitly call out that one mix doesn't make you private; that timing/amount correlation undoes most users; that the post-2024 coordinator market has tradeoffs.
- **Practical.** Every claim should map to "what would I actually do?"
- **Cut emojis dramatically.** Replace 11 emojis with at most 2 (one in `<h1>`, optionally one for the "this is current as of" date stamp). Use typographic hierarchy and the existing brand orange instead.
- **Socratic moments stay** (reflect-widget) — already aligned with project principles.

## Applicability test — pass/fail

Does this page help users take a real next step? **Currently: weak.** Phase 4 ends in stats; summary lists tools but doesn't say "go do X now."

**Redesigned answer per audience:**

| Audience | Concrete next step the redesign must enable |
|---|---|
| Holder w/ weak custody | "Install Sparrow → label your UTXOs → identify your top 3 most-doxxed coins" (1 link, 1 worksheet) |
| HNW | "Run a 30-day disclosure audit: list every counterparty who has seen one of your addresses" (downloadable checklist) |
| Family / inheritance | "When passing keys, also pass a privacy-context note: which addresses have been seen by whom" (template link) |
| Wealth advisor | "Use this page in a client conversation; here's the 3-question pre-discovery you can send first" (advisor-toolkit link) |

## Information architecture (5 steps stay; content rotates)

The 5-step skeleton works. Don't restructure. Rewrite the *contents* of each step.

| Step | Current title | Proposed title | Change |
|---|---|---|---|
| 1 | Why Privacy? | Why this matters more than you think | Replace generic "track your spending" list with **3 audience-specific scenarios** (holder, HNW, family) — each tied to a concrete real-world incident (sourced) |
| 2 | The Problem | How chain analysis actually works | Keep tracking-timeline UX (good); cut emoji noise; add "Try it on your own address" link to a public chain-analysis demo (mempool.space + an OXT-style explainer) |
| 3 | CoinJoin Solution | The CoinJoin idea, and what it doesn't solve | Keep before/after diagram; **add a "what CoinJoin does NOT fix" panel** (timing, amount correlation, post-mix consolidation) — anti-fake-simplicity move |
| 4 | Practice | Run a round | Keep the existing simulator engine; add an **"anonymity-set vs. effort"** explainer (more participants = better, but slower; multiple rounds = exponential, but costlier) |
| 5 | Summary | Tools, tradeoffs, and what to do this week | **Major rewrite** — see Tools Section below |

## Tools section rewrite (Step 5)

**Verified for April 2026** via 2026-04-27 web search.

### "Recent history" panel — keep, but add timestamp + add 2026 update line

```
Source check: April 2026

What changed in 2024:
- Samourai Wallet & Whirlpool: servers seized, founders indicted by US DOJ (April 24, 2024). App and Whirlpool coordinator inactive since.
- Sparrow Whirlpool integration: removed in Sparrow 1.9.0 (April 24, 2024).
- Wasabi (zkSNACKs coordinator): shut down June 1, 2024 over sanctions-compliance risk. Wasabi 2.x still ships but ships with no default coordinator.

What's happened since:
- Independent coordinators have repopulated the ecosystem. Wasabi-compatible coordinators are listed at wabisabi.io.
- Kruw runs an independent WabiSabi coordinator that gained traction post-shutdown.
- JoinMarket added user-friendly self-hosting via Jam (jam.bitcoin), which installs in two clicks on Umbrel and Start9 nodes.

This page was last verified on 2026-04-27. If you're reading it more than 6 months later, treat the tool list as a starting point and verify each project's current status.
```

### Tool cards — replace the current 3 with 4 (current as of April 2026)

| Card | Type | One-line | Link |
|---|---|---|---|
| **JoinMarket via Jam** | Decentralized, node-based | Most censorship-resistant option. Two-click install on Umbrel/Start9, runs through your own node. Higher friction, no central point to take down. | jam.bitcoin |
| **Wasabi 2.x with WabiSabi coordinator** | Desktop, choose-your-coordinator | Mainstream UX. Ships without a default coordinator since June 2024 — you pick one (e.g., Kruw, others at wabisabi.io). Coordinator chooses you back; vet before use. | wasabiwallet.io |
| **Ginger Wallet** | Desktop, Wasabi fork | Community-maintained Wasabi fork that runs its own coordinator. Pragmatic option for users who want defaults that work. | gingerwallet.io |
| **Sparrow Wallet (no Whirlpool)** | Desktop, manual privacy | Strong UTXO labeling and coin control. **No** built-in CoinJoin since 1.9.0 — the value here is *manual* privacy hygiene, not mixing. | sparrowwallet.com |

**Tone in tool cards:** state the tradeoff explicitly. No "best" / "easiest" superlatives. No emoji.

### "What to do this week" — NEW SECTION (replaces "Best Practices" Do/Don't list)

Three audience-tagged tracks. User picks one. Each is a 5-minute commitment with one link.

```
HOLDER track — 5 min
  Install Sparrow Wallet (read-only mode is fine).
  Add your existing wallet by xpub.
  Open the UTXOs view and label your 5 largest UTXOs with where they came from.
  You now have a UTXO map — the prerequisite for any privacy decision.

HNW track — 30 min
  Run a personal disclosure audit. Open the worksheet [link].
  List: every exchange, merchant, counterparty, and individual who has seen one of your receive addresses.
  This is your "doxxing surface." Privacy work targets this list.

FAMILY / INHERITANCE track — 30 min
  Open the inheritance privacy template [link].
  For each address in your inheritance plan, note: who has seen it, what they know.
  Heirs need this context, not just keys.

ADVISOR track — 10 min
  Send your client the pre-discovery questions [link].
  Use their answers to determine whether they need a custody review or a privacy review.
```

(Worksheet/template links can be `#TODO` placeholders for now — those are separate deliverables, not blockers for this redesign.)

## Shared component: `demo-cta-footer`

This component is built as part of this redesign and back-portable to all other demos in the queue. Spec for the shared component:

### Behavior

- A footer block injected at the end of every demo's `<main>` (after Step 5 / summary, before reflect-widget).
- Renders 1–4 audience-tagged "next step" tracks (configurable via data attributes).
- Each track is a single concrete action with a single link. No multi-link CTA grids.
- Tone: short, declarative, no emoji.
- Falls back gracefully (single track) when the demo doesn't have audience-specific actions.

### API (HTML data attributes)

```html
<div class="demo-cta-footer"
     data-tracks='[
       {"audience":"holder","time":"5 min","action":"Install Sparrow and map your UTXOs","href":"/guides/sparrow-utxo-map/"},
       {"audience":"hnw","time":"30 min","action":"Run a personal disclosure audit","href":"/guides/disclosure-audit/"},
       {"audience":"family","time":"30 min","action":"Add a privacy context note to your inheritance plan","href":"/guides/inheritance-privacy/"},
       {"audience":"advisor","time":"10 min","action":"Send your client the pre-discovery questions","href":"/guides/advisor-pre-discovery/"}
     ]'>
</div>
```

### CSS

- New file: `/css/demo-cta-footer.css`
- Uses existing brand tokens (`--color-brand`, `--color-surface`, etc.)
- Each track is a row with: audience label (caps, dim), action (large), time-tag (right-aligned, dim), arrow link
- Mobile: stacks vertically; audience label becomes a chip
- A11y: each track is an `<a>` with descriptive text; no orphan icons

### JS

- New file: `/js/demo-cta-footer.js`
- Reads `data-tracks` JSON, renders the rows
- Adds analytics event on click (uses existing `bsaAnalytics.track('demo_cta_click', {audience, demo})` from the project's existing `analytics.js`)
- Defer-loaded; ~80 LoC, no dependencies

### Where it slots

In `coinjoin-simulator/index.html`, replace the entire current Step-5 "Best Practices" + "Important Privacy Considerations" + "Continue Learning" sections (lines 374–432) with one `<div class="demo-cta-footer">…</div>` plus a slim "Continue learning" 2-link list (kept for navigation but not a CTA).

## A11y / mobile

- Add `aria-label` to participant range slider; associate `<label for="mix-amount">` properly with `<select id="mix-amount">`
- Replace emoji-only headers (e.g., `<h3>🛠️ CoinJoin Tools & Services</h3>`) with text only — emojis in headers don't get spoken consistently by screen readers
- Verify `tx-diagram` and `transaction-builder` grid collapse cleanly at 360px (current breakpoint is 768 — confirmed in styles.css line 2)
- Skip-link already present; preserve
- All buttons keep existing keyboard focus states

## Out of scope for this redesign

- Spanish localization (separate ES track per orchestration plan)
- Building the `/guides/sparrow-utxo-map/`, `/guides/disclosure-audit/`, `/guides/inheritance-privacy/`, `/guides/advisor-pre-discovery/` pages (links can be `#TODO` placeholders or 404 to start; those are separate spec items)
- Replacing the simulator engine (`coinjoin-engine.js`) — current engine is fine for the educational purpose
- Adding live mempool/coordinator data — interesting but not load-bearing for this page's job

## Risks / open questions

1. **Linked guide pages don't exist yet.** Two options: (a) ship redesign with `#TODO` placeholders and queue the guides as follow-up tickets; (b) hold the redesign until at least 2 of the 4 guides exist. **Recommend (a)** — the redesign already creates the slot, and the empty links pressure-test which guides are actually load-bearing.
2. **Tool list will rot again.** Mitigation: the "verified on 2026-04-27" stamp + the "if you're reading this 6 months later" hedge. Stronger mitigation would be a quarterly reverification scheduled task (`/schedule` candidate after this lands).
3. **"Pick a coordinator" advice is judgment-heavy.** Wabisabi.io coordinator listings change. Stating "Kruw is one example" rather than "use Kruw" keeps the page from becoming an endorsement.

## Verification checklist (post-implementation, before commit)

- [ ] Local preview renders all 5 steps; phase animation works
- [ ] Tool cards: 4 cards, no broken links, no emoji-only labels
- [ ] CTA footer renders 4 audience tracks; each clickable; analytics event fires
- [ ] Reflect-widget still mounts (data-topic="privacy" preserved)
- [ ] A11y: tab through entire page, every interactive element gets focus ring
- [ ] Mobile (375×812): no horizontal scroll, no overflow, tx-diagram stacks
- [ ] No console errors
- [ ] Screenshot Step 1 + Step 5 saved for the user

## Estimated effort

- Spec sign-off + back-and-forth: 30 min
- HTML/CSS rewrite: 90 min
- Shared `demo-cta-footer` component: 60 min
- A11y + mobile verification: 30 min
- Total: ~3.5 hours from green light to merged commit
