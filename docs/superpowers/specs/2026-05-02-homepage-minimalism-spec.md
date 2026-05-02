# BSA Homepage — Minimalism + Truth Spec

**Date:** 2026-05-02
**Status:** Draft (awaiting sign-off)
**Scope:** `index.html` (BSA homepage) — structural redesign + content audit
**Driving rules:**
- "Always verify truth of content in platform" (user)
- "Color carries meaning" ([feedback memory](../../../../.claude/projects/-Users-dalia-projects-bitcoin-sovereign-academy/memory/feedback_color_carries_meaning.md))
- Voice spec: first-principles, inform-not-convince ([docs/marketing/voice-spec.md](../../marketing/voice-spec.md))
- Identity: "Bitcoin custody and inheritance for families and advisors. Bilingual. LATAM-fluent."
- Tagline: "Don't Trust, Verify."

---

## 1. Critical findings (must-fix regardless of view chosen)

| Claim on homepage | Reality | Action |
|---|---|---|
| `Why 50,000+ People Choose Us` (proof section h2) | ~190 sessions/month | **Remove** |
| `50,000+ Demos Completed` (stats row) | No analytics back this | **Remove** |
| `Sarah K., Complete Beginner → Bitcoin User` testimonial | Fabricated | **Remove** |
| `8 AI Tutors` (welcome modal `js/onboarding-flow.js:58`) | 1 (just an `index.html`) | **Remove or fix** |
| `100+ Learning Modules` (welcome modal) | 69 actual modules | **Update to "60+"** |
| `25+ Interactive Demos` (welcome modal) | 48 actual demos | **Update to "45+"** |
| `50+ demos` (meta description) | 48 actual | OK (rounds correctly) |
| `6 paths` (meta description) | 7 actual paths | **Update to "7"** |

**These edits ship regardless of which structural view is chosen.**

---

## 2. Section-by-section verdict (apply to all views)

| # | Section | Verdict | Notes |
|---|---|---|---|
| 0 | Welcome popup modal (`js/onboarding-flow.js`) | **CUT from homepage** | Move to `/start/`. No pre-context popups. |
| 1 | Hero | **KEEP** | Already cleaned (commits 873df6c8, 21a1d2f6) |
| 2 | Proof Section ("Why 50,000+...") | **REWRITE** or CUT | Drop fabricated content. Decision per view below. |
| 3 | Sticky anchor nav | View-dependent | Header already covers this; keep only if it adds value |
| 4 | Choose Your Path quiz | **KEEP** (just cleaned) | Plus decision on inline grid below |
| 5 | Hidden all-paths grid (under quiz) | **CUT from homepage** | Move to `/paths/` (already exists) |
| 6 | Emergency Kit banner | **DEMOTE** | Header has Emergency link; banner duplicates. Reduce to inline link or footer entry. |
| 7 | Quick Tools Strip | **KEEP** (tighten) | Reduce to 4 most-used tools |
| 8 | Featured Experiences ("Ready to Start Learning?") | **CUT** | Redundant with hero + path quiz + header dropdowns |
| 9 | Footer | **TIGHTEN** | 5 cols → 4 cols (merge "Quick Access" into "Learn") |

---

## 3. Three structural views

### VIEW A — "Bold Minimalist" (3 sections + footer)

**Philosophy:** the homepage is a routing layer. Every section earns its place. Header dropdowns and `/paths/` carry the depth.

**Structure:**
```
┌─ Hero ────────────────────────────────  ~600px
│   Eyebrow • H1 (gradient) • Subtitle
│   3 proof blocks (zero-risk · private · interactive)
│   Primary CTA: "Start Here"
│   Secondary CTA: "Take Path Assessment"
│   Trust signal: No wallet, no downloads, no PII
│
├─ Path Quiz ──────────────────────────  ~400px
│   "Find Your Learning Path"
│   2 questions, neutral .option-btn
│   Result: recommended path + "See all 7 paths →" (links to /paths/)
│
├─ Quick Tools Strip ──────────────────  ~80px
│   4 tools: Risk Simulator · DCA Calc · Fee Master · Converter
│
└─ Footer ─────────────────────────────  4 cols
    Learn · Resources · About · Legal
```

**Cut:** welcome modal · proof section · sticky anchor nav · all-paths inline grid · emergency banner · featured experiences

**Strengths:**
- Fastest time-to-value
- Most aligned with "inform, not convince"
- Hero does 90% of the persuasion work; everything else is quiet routing
- ~50% scroll reduction vs current

**Trade-offs:**
- Users who DON'T want to take the quiz have no quick way to scan all paths on the homepage — must use header dropdown or click through to `/paths/`
- No social proof (acceptable: "Don't Trust, Verify" is the tagline)
- Returning users still get the tools strip; first-timers go quiz → path

**Best for:** users who arrive with intent, want to start fast, don't need persuasion. The "quietly competent" homepage.

---

### VIEW B — "Paths-Forward" (5 sections + footer)

**Philosophy:** paths are the heart of BSA. Show them, don't make users hunt. The homepage IS the path picker.

**Structure:**
```
┌─ Hero ────────────────────────────────  ~600px
│   Same as View A
│
├─ Path Quiz ──────────────────────────  ~300px
│   2 questions; result inline; "Show all 7 paths below ↓"
│
├─ Path Cards Grid ────────────────────  ~900px
│   All 7 path cards visible (curious / hurried / pragmatist /
│   principled / builder / sovereign / skeptic)
│   Path-color borders preserved per "color carries meaning" rule
│
├─ Honest Trust Strip ─────────────────  ~250px
│   3 verifiable cards: Zero-Risk · Privacy First · Open Source
│   No stats, no testimonial, no "50,000+"
│   Tiny line: "View the code on GitHub →"
│
├─ Quick Tools Strip ──────────────────  ~80px
│   Same as View A
│
└─ Footer ─────────────────────────────  4 cols
```

**Cut:** welcome modal · "Why 50,000+" h2 · fabricated stats · Sarah K testimonial · sticky anchor nav · emergency banner (→ footer link) · featured experiences · all-paths toggle (now always shown)

**Strengths:**
- Path cards visible above-the-fold-of-quiz scroll = at-a-glance offer
- Anyone can pick a path without quizzing
- Trust strip preserves the 3 real claims that DO verify
- Closer to current shape, lower change risk

**Trade-offs:**
- ~70% of current scroll length (still significant)
- Path grid + path quiz feels redundant (quiz exists to filter; if all paths visible, quiz is just decoration)
- More content = more maintenance surface

**Best for:** users who scan rather than commit; pages that need to "show the goods" up front. The "trust me, here's everything" homepage.

---

### VIEW C — "Audience-Segmented" (different shape)

**Philosophy:** BSA is positioned for families + advisors specifically (per locked identity 2026-04-28). Segment from the door. Stop pretending the audience is "everyone."

**Structure:**
```
┌─ Hero ────────────────────────────────  ~500px
│   Eyebrow "DON'T TRUST, VERIFY"
│   H1: Bitcoin custody and inheritance.
│       For families. For advisors. Bilingual.
│   Subtitle (1 line, tighter)
│   NO proof blocks here (moved into segment branches)
│   NO CTAs here (segment picker is below)
│
├─ Audience Picker ────────────────────  ~400px
│   "Who is this for?"
│   Two large interactive cards:
│
│   ┌─ "I'm protecting my family's Bitcoin" ─┐
│   │   • Inheritance & multisig             │
│   │   • Recovery drills                    │
│   │   → Start with: Curious or Sovereign   │
│   └────────────────────────────────────────┘
│
│   ┌─ "I'm an advisor helping clients" ─────┐
│   │   • Collaborative custody              │
│   │   • Compliance + paperwork             │
│   │   → Start with: Institutional         │
│   └────────────────────────────────────────┘
│
│   Tertiary text link: "Just curious? Browse all 7 paths →"
│
├─ "What's at stake" / Risks block ────  ~400px
│   Per strategic-positioning rule ("risks people don't see")
│   3 short paragraphs naming real failure modes:
│     - Lost seeds, no recovery plan
│     - Single-sig single point of failure
│     - Heirs locked out forever
│   Each ends in: "→ See it simulated" link to a relevant demo
│
├─ Quick Tools Strip ──────────────────  ~80px
│   Tools relevant to BOTH audiences (Risk Sim, Inheritance Drill)
│
└─ Footer ─────────────────────────────  4 cols
```

**Cut:** welcome modal · proof section (replaced by Risks block) · path quiz (replaced by Audience Picker) · sticky anchor nav · all-paths inline · emergency banner (→ footer) · featured experiences

**Strengths:**
- **Genuinely differentiated.** No other Bitcoin education site segments by audience first.
- Maps directly to locked identity statement
- "What's at stake" replaces fabricated social proof with real, verifiable consequence framing — leverages the strategic positioning ("risks people don't see")
- Forces clarity: every visitor learns within 5 seconds whether this site is for them
- Strongest brand differentiation of the three options

**Trade-offs:**
- Reductive: users who don't fit either bucket (curious students, hobbyists, builders) feel othered. The "Just curious?" escape hatch helps but isn't perfect.
- Higher copy-writing bar: the audience picker needs sharp, contextual copy that makes each branch feel earned
- Riskier change — biggest departure from current page; user feedback unknown
- Path persona system (curious/hurried/pragmatist/...) gets demoted to second-tier discovery

**Best for:** committing fully to the locked identity. The "we know exactly who we serve" homepage.

---

## 4. Comparison matrix

| Dimension | A (Bold Minimalist) | B (Paths-Forward) | C (Audience-Segmented) |
|---|---|---|---|
| Sections | 3 + footer | 5 + footer | 4 + footer |
| Scroll vs current | -55% | -30% | -50% |
| Path discovery | quiz → /paths/ | quiz + visible grid | audience → recommended path |
| Differentiation | low | medium | **high** |
| Risk | low | low | medium |
| Copy work needed | minimal | small (trust strip) | **significant (picker + risks)** |
| Maps to identity | yes (general) | yes (general) | **yes (literal)** |
| Maintenance surface | smallest | largest | medium |
| Voice fit | "inform, not convince" ✓ | trust strip risks "convince" tone | "first-principles" ✓ |

---

## 5. Recommendation

**A as the default.** It's the cleanest answer to "minimalist, very organized, very few pop-ups, very direct." It also defers the hardest question (what audience are we for?) to a future iteration where Distribution Engine traffic data can validate.

**C as the bold answer.** If the locked identity is genuinely the strategic frame and you want the homepage to commit to it, C is the most honest expression. But it requires real copywriting work and is the riskiest UX change. Worth doing IF you're confident in the identity AND have time to write the audience-picker + Risks copy carefully.

**B is the safe middle.** Visually clean, structurally familiar, ships easily. But the redundancy between quiz + path grid is real — it's the "I couldn't decide what to cut" homepage.

If pressed: **A now, with C as a Phase 2 candidate** once Distribution Engine data shows whether traffic is families, advisors, or general curiosity.

---

## 6. Open questions for sign-off

1. **Pick a view:** A / B / C / hybrid?
2. **Welcome modal:** kill entirely (recommended) OR keep on `/start/` only?
3. **Proof section:** rewrite to 3 honest cards (View B) OR cut entirely (View A) OR replace with Risks block (View C)?
4. **Emergency Kit:** small inline link in hero region, single line in footer, or rely on header alone?
5. **Sticky anchor nav:** keep or cut?
6. **Quick Tools Strip:** which 4 tools? (default: Risk Simulator, DCA Calc, Fee Master, Bitcoin Converter)

---

## 7. Implementation phases (post-sign-off)

**Phase 1 — Truth (independent of view choice; ship first):**
- [ ] Remove `Why 50,000+ People Choose Us` h2 + entire stats row + Sarah K testimonial from `index.html` proof section
- [ ] Update welcome modal stats in `js/onboarding-flow.js`: `8 AI Tutors → "AI tutor available"`, `100+ → "60+"`, `25+ → "45+"`
- [ ] Update meta description: `6 paths → 7 paths`

**Phase 2 — Structure (depends on view chosen):**
- [ ] Apply chosen view's section CUT/KEEP/MOVE list
- [ ] Move welcome modal flow to `/start/` only
- [ ] Demote Emergency Kit per chosen approach
- [ ] Tighten footer to 4 cols

**Phase 3 — Polish (after structure lands):**
- [ ] Resume the visual cleanup (section overlays per O2 from earlier comparison; emergency banner per chosen demote approach)
- [ ] Audit other strategic pages for similar fabricated claims

---

## 8. Out of scope (this spec)

- FSA homepage (sister project; separate audit)
- /start/ page rewrite (will need its own spec once welcome flow moves there)
- /paths/ index page tightening (will need separate audit if View A or C ships)
- Substack / content pipeline integration
- Spanish localization scope of homepage strings

---

## 9. Success criteria

- All fabricated claims removed from homepage and welcome modal
- Page passes a "30-second rule" test: a first-time visitor can identify (a) what BSA is, (b) what to do next, in <30s
- Scroll height reduced ≥30% (View B floor) up to ~55% (View A ceiling)
- Zero visual regressions on the 3 strategic surfaces (hero proof blocks, path quiz, path cards)
- All shipped commits pass `npm run audit:html` and `npm run audit:seo`
