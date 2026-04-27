# Redesign spec — kyc-best-practices

Target file: [interactive-demos/kyc-best-practices/index.html](interactive-demos/kyc-best-practices/index.html)
Status: **DRAFT — awaiting sign-off, no code shipped yet**
Date: 2026-04-27

## What's actually wrong (correcting the audit, again)

The audit agent flagged this as "broken links — references demos that don't exist (`onramp-chooser`, `testnet-practice-guide`)." I verified — **both targets do exist**. The audit was wrong about the P0.

Two false-positive audits in two demos. Worth flagging as a calibration issue: the agents extrapolated from prompt context rather than checking the filesystem. Future audits should be required to grep for files before claiming they're missing.

**The real problems with this page:**

1. **Pretending to be a demo, but it's a static reference card.** 285 lines, no interactivity, no decision tool. The audit verdict (RETARGET) is correct for a different reason: this content belongs in `/guides/` or as a sidebar in another demo, not under `/interactive-demos/`.
2. **US-centric exchange list with no jurisdiction context.** "Coinbase, Kraken, Strike" — useful for US, near-useless for EU (where MiCA created new requirements), and irrelevant for Colombia (where local options like Bitso, Buda, Lemon dominate). For audience segments 5 and 6 (Colombia) this is a wasted page.
3. **"Stick to established exchanges with security track records" violates the brand voice.** Mt. Gox was established. Celsius was established. FTX was established. The "skeptical of fake simplicity" tone constraint says we don't tell users that "regulated = safe" without acknowledging the counter-evidence.
4. **No 2026 timestamp.** Like the original coinjoin page, the recommendations are time-sensitive but read as evergreen. Needs a "Verified: 2026-04-27" stamp.
5. **No applicability bridge for the actual decision.** The "KYC vs no-KYC" comparison is a list of pros/cons, not a decision aid. A user with a specific situation (e.g. "I'm in Colombia, want to put $200/month into Bitcoin, privacy-conscious but not paranoid") still has to translate the pros/cons to their context.
6. **No CTA-footer pattern** (the shared component shipped with demo #1 is unused here).
7. **No reflect-widget.** Surprising for a content-heavy page; the project's standard educational component is missing.

## Page job-to-be-done

**Primary:** Help someone about to buy Bitcoin pick the right approach for their actual context — by jurisdiction, by amount, by urgency, and by privacy preference. Convert a generic "KYC pros/cons" page into a decision aid.

**Secondary:** Position the page as a clearance gate before `/interactive-demos/onramp-chooser/`. By the time a user lands on the on-ramp chooser, they should already know whether they want KYC, no-KYC, or hybrid.

## Target audience (priority)

| # | Segment | Why this page matters to them |
|---|---|---|
| 1 | Beginner without Bitcoin | About to make their first purchase; needs to understand what KYC commits them to before clicking through to an on-ramp |
| 5 | Colombia employer | Needs jurisdiction-specific guidance (Bitso, Buda, Lemon — not Coinbase) |
| 6 | Spanish-speaking employee | Same — and currently completely unserved |
| 2 | Bitcoin holder with weak custody | May be over-trusting "established" exchanges as a custody substitute |

**Out of scope:** segments 3 (HNW), 4 (advisor), 7 (family inheritance) — those have richer custody pages elsewhere.

## Brand-voice tone (this page)

- **Practical, not legalistic.** No "consult an attorney"–style disclaimers. Just clear tradeoffs.
- **Skeptical of "established."** Acknowledge Mt. Gox / Celsius / FTX briefly. "Regulated" reduces some risks; it does not eliminate them.
- **Short, declarative.** Each tip is one sentence. The redesign should be shorter than the current page, not longer.
- **Cut emojis where they're used as bullet markers.** Numbered list is fine.
- **No fear-mongering.** KYC is not a privacy apocalypse for most users; treat the choice as an honest tradeoff.

## Information architecture

Restructure from the current 4 sections to 5 tighter ones:

| # | Section | Current | Proposed |
|---|---|---|---|
| 1 | Title + framing | "KYC Best Practices / Quick guide for Bitcoin buyers" | Same title, sharper framing: "What you're agreeing to — and what you're not — when you buy Bitcoin through a regulated exchange." |
| 2 | The decision tool | (missing) | **NEW:** 3 questions → recommendation. Q1: Where are you (US / EU / Colombia / other)? Q2: How much per month? Q3: Privacy weight (low / medium / high). Output: KYC, no-KYC, or hybrid recommendation, with 1–2 specific platform suggestions for the user's jurisdiction. |
| 3 | KYC vs no-KYC honest comparison | "+/–" pros/cons table | Keep the table, but add a **third column: "What this actually means in 2026"** — e.g. "+ Higher purchase limits → in Colombia: Bitso supports 50M COP/month verified; in US: Strike $5K/day default" |
| 4 | The 5 practices | Generic list | Tightened to 4 (drop "track records" claim) + add a new one: "Withdraw promptly. The exchange is not your custody." |
| 5 | Verified-as-of stamp + CTA-footer + reflect-widget | (missing) | New "Verified: 2026-04-27" panel. Audience-tagged CTA-footer with 3 tracks (US-buyer, EU-buyer, Colombia-buyer). Reflect-widget topic="kyc". |

## The decision tool — concrete spec

Pure HTML/CSS/JS, no API. Three `<select>`s, one button, one `<div>` for the result.

```html
<div class="kyc-decider">
  <h3>Which approach fits your situation?</h3>
  <div class="kyc-decider__row">
    <label>I'm in:
      <select id="kyc-jurisdiction">
        <option value="us">the United States</option>
        <option value="eu">the EU</option>
        <option value="co">Colombia</option>
        <option value="latam">Latin America (other)</option>
        <option value="other">somewhere else</option>
      </select>
    </label>
  </div>
  <div class="kyc-decider__row">
    <label>I'm planning to buy:
      <select id="kyc-amount">
        <option value="small">under $200/month</option>
        <option value="medium">$200–$2,000/month</option>
        <option value="large">over $2,000/month</option>
      </select>
    </label>
  </div>
  <div class="kyc-decider__row">
    <label>Privacy is:
      <select id="kyc-privacy">
        <option value="low">a nice-to-have</option>
        <option value="medium">important</option>
        <option value="high">a hard requirement</option>
      </select>
    </label>
  </div>
  <button class="btn-primary" id="kyc-decide">Show my recommendation</button>
  <div class="kyc-decider__result" id="kyc-result" hidden></div>
</div>
```

JS lookup table (in-page, no external dep). Decision matrix:

| Privacy | Amount | Recommendation |
|---|---|---|
| low / medium | any | **Regulated exchange** in your jurisdiction. List 1–2 specific platforms. |
| high | small | **No-KYC P2P** (Hodl Hodl, RoboSats, Bisq). Mention liquidity tradeoffs. |
| high | medium | **Hybrid:** small no-KYC for privacy practice + larger amounts via regulated. |
| high | large | **Hybrid + custody first.** Don't optimize privacy until you can self-custody at scale. |

Jurisdiction-specific platform names (verified April 2026):
- **US:** Strike, Kraken, Cash App
- **EU:** Bitstamp, Kraken (post-MiCA registered), Relai (regional)
- **Colombia:** Bitso, Buda, Lemon Cash
- **LatAm other:** Lemon Cash, Bitso, Ripio
- **Other:** "Look for an exchange registered with your local financial regulator. P2P alternatives below work in most jurisdictions."

P2P fallback list (works globally): Hodl Hodl, RoboSats, Bisq.

## CTA-footer (new)

Three audience-tagged tracks, 1 single concrete action each:

```html
<div class="demo-cta-footer"
     data-demo-id="kyc-best-practices"
     data-heading="What to do this week"
     data-tracks='[
       {"audience":"us-buyer","time":"10 min","action":"Open the On-Ramp Chooser with your jurisdiction filtered","href":"/interactive-demos/onramp-chooser/?region=us"},
       {"audience":"eu-buyer","time":"10 min","action":"Open the On-Ramp Chooser with EU filter","href":"/interactive-demos/onramp-chooser/?region=eu"},
       {"audience":"colombia","time":"10 min","action":"Practice with testnet first, then pick a Colombian exchange","href":"/interactive-demos/testnet-practice-guide/"}
     ]'>
</div>
```

Note: the `?region=us` etc. params don't yet do anything in `onramp-chooser` — they'd need to be wired up there. For this redesign, links work without the param (the param is forward-compatible for when onramp-chooser ships filtering).

## Reflect-widget

Add the standard widget with `data-topic="kyc"` and `data-path="curious"`. The reflect-widget already has 15 seeded topic categories per the project memory; if `kyc` isn't seeded yet, the widget will gracefully fall back to free-form. Either way, it provides Socratic depth that's currently missing.

## A11y / mobile

- Decision-tool: all 3 `<select>`s have `<label for="...">` — already in the spec markup above
- "Show my recommendation" button: `aria-controls="kyc-result"`
- Result panel uses `<div role="region" aria-live="polite">` so screen readers announce the recommendation
- Mobile: select rows stack to single column at ≤640px (existing pattern in coinjoin styles works)
- All interactive elements get focus rings (already enforced by `/css/global.css`)

## Out of scope

- Spanish localization (separate ES track)
- Wiring `?region=*` filtering in `onramp-chooser` (separate small ticket — flagged as a forward-compat assumption)
- Decision-tool quizzing the user about specific exchanges they're considering (could add later)
- Educational deep-dive on what KYC data is collected, how it's stored, breaches, etc. (separate page worth it)

## Risks / open questions

1. **Jurisdiction-specific platform list goes stale.** Mitigation: dated "Verified: 2026-04-27" stamp + the same 6-month staleness hedge as coinjoin.
2. **The decision tree is opinionated.** Some users with "high privacy / large amount" will disagree with the "custody first" recommendation. Mitigation: state the reasoning briefly in the result panel; let users self-override.
3. **`onramp-chooser` doesn't yet support `?region=` query param.** The CTA-footer link works without it, but won't pre-filter. Either accept that and add it later, or hold this redesign until onramp-chooser supports the param. **Recommend accepting** — the redesign isn't blocked, and the next coinjoin-style redesign of onramp-chooser will pick up the param.

## Verification checklist

- [ ] Page loads, all 3 `<select>`s present
- [ ] Decision tool returns a result for at least 4 input combinations (low/small/us, high/large/co, etc.)
- [ ] Result panel shows the right recommendation per the matrix above
- [ ] Existing CTA buttons (On-Ramp Chooser, Testnet) replaced with shared `demo-cta-footer`
- [ ] Reflect-widget mounts (visible at bottom of page)
- [ ] Mobile (375×812): no horizontal overflow; selects stack
- [ ] No console errors
- [ ] Diff: net page is *shorter* than original (smaller line count, fewer claims)
- [ ] Brand-voice check: 0 emojis used as bullet markers; "Mt. Gox / Celsius / FTX" callout present in tone-fix section

## Estimated effort

- Spec sign-off + tweaks: 15 min
- HTML/CSS/JS rewrite (incl. decision tool): 60 min
- Verification + screenshots: 20 min
- Commit + push: 5 min
- **Total: ~100 min from green light to merged commit**

Smaller than the coinjoin redesign because the page is 285 lines vs 473, and the shared CTA-footer + reflect-widget are already built (just configure).
