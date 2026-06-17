# Week 3 Validation Packet — "Saving Strategies" flagship

**Purpose:** decide whether the Week 3 sensory flagship is good enough to become the
**pattern replicated across the other 9 youth weeks (T2–T6).** Validate the pattern on
ONE week with real people before scaling it. Do not replicate until this passes.

**Date prepared:** 2026-06-08 · **Status:** uncommitted draft (no production/git changes)

---

## 1. Live URL (test the real thing, not localhost)

**https://bitcoinsovereign.academy/youth-families/week-03/**

- Confirmed live `200` and serving the elevated build (animated reveal-gap + Race→Melt).
- **Test on a phone first.** The page is designed mobile-first; the "pass-the-phone"
  share beat and the haptic buzz only feel real on a handset. Do at least one teen
  session on a phone.
- Have testers use a **fresh browser / private window** so a prior tester's saved goal
  isn't sitting in `localStorage`.

### What the page contains (so observers know what they're watching)
1. **Step 1 · Predict** — goal builder (what / cost / weekly) → "how many weeks?" guess
   you must *lock* → "Reveal the math →" → animated gap: *you vs. real*, "N weeks longer
   than you thought."
2. **Step 2 · Verify** — "Where do you put $1,000 for 10 years?" → drawer / savings →
   Race→Melt animation (prices outrun your money; the bill desaturates) → then a **live**
   "fewer than 21 million bitcoin" check pulling real supply data.
3. **Step 3 · Keep** — a printable **My Savings Goal** sheet (their numbers + footer).
4. **Step 4 · Share** — "Show a parent your savings goal. Ask them: what did YOU save up
   for at my age, and how long did it really take?"

### The three things we are actually measuring (the audit's weakest "moat" criteria)
- **Real-artifact (1.50)** — do they actually *keep* the Savings Goal sheet?
- **Family-conversation (1.90)** — does the share beat actually start a real parent↔teen talk?
- **Learner-derived discovery (2.11)** — does predict-before-reveal create a genuine "aha"?
- Plus a known gap: **does a 12–14-year-old get through it solo?** (track skews 15–17.)

---

## 2. Teen test script — 15 minutes (moderated, think-aloud)

> Recruit 12–17. **At least one tester must be 12–14** (that's the gap we're checking).
> Phone preferred. Record screen + audio if you can, or have a silent observer with the
> checklist in §5. Script for the moderator is in plain text; *(observe …)* lines are for you.

**0:00 — Setup (1 min)**
- "I'm testing this web page, not you. There are no wrong answers. Please **think out
  loud** — say whatever you're looking at, confused by, or reacting to."
- Open the URL in a fresh tab. Hand them the phone. Say nothing else unless they stall >20s.

**0:01 — First impression + goal (3 min)**
- "Take a look. What is this page for? What would you do first?"
- "Pick something real you actually want to save for, and fill it in."
- *(observe: do they understand the three inputs without help? what goal/price do they pick?)*

**0:04 — Predict (3 min)**
- Let them reach the "how many weeks?" question. **Do not hint.**
- *(observe: do they make a genuine guess BEFORE revealing, or try to skip/compute first?)*
- After they hit "Reveal the math," ask: "What just happened? Were you close?"
- *(observe: do they notice the gap? do they say the insight in their own words?)*

**0:07 — Consequence (3 min)**
- "Try the next part — where would you put $1,000 for 10 years?" Let them pick and watch.
- "In your own words, what did that animation just show you?"
- *(observe: do they grasp 'same dollars, buys less'? do they try the other option too?)*

**0:10 — Keep (2 min)**
- "Is there a way to keep the plan you made?" *(do NOT point at the button.)*
- *(observe: do they find Print/Save on their own? do they actually keep it?)*

**0:12 — Share (2 min)**
- Have them read the "Pass the phone" prompt aloud.
- "Would you actually do this? Who would you show? Would you ask them that question?"
- *(observe: genuine intent vs. polite "sure." Note the named person if any.)*

**0:14 — Wrap (1 min)**
- "One thing you liked, one thing that was confusing or boring?" Then §6 questions.

---

## 3. Educator test script — 15 minutes (pedagogical review)

> Recruit a teacher / youth-program facilitator. Lens = soundness, accuracy, classroom
> fit, age range. They review as a professional, not as a learner.

**0:00 — Setup (1 min)**
- "Review this as if deciding whether to use it with your students. Think out loud."

**0:01 — Full walkthrough (5 min)**
- Have them go through all four beats once, doing the activities.

**0:06 — Pedagogy probes (7 min)** — ask each:
- "Does the **predict-before-reveal** moment do real teaching work, or is it a gimmick?"
- "Is each step **one concept**, or is anything overloaded?"
- "Is the inflation framing (~3%/yr, 0.5% savings, 'same dollars buy less') **accurate and
  defensible** to a parent or colleague?"
- "Could a **12–14-year-old** do this **without you** explaining it? Where would they stall?"
- "What's the **real time-on-task** in a classroom — and does it fit a period / homework slot?"
- "What **misconception** could a student leave with after this lesson?"
- "What is **missing** that you'd need before assigning it?"

**0:13 — Fit decision (2 min)**
- "Would you use it? As in-class, homework, or a family-night activity? What would stop you?"

---

## 4. Parent review script — 10 minutes (the family hand-off)

> The parent↔teen hand-off is the locked identity of this platform — this script tests
> whether it actually fires, and whether a parent trusts the content. Ideally run this
> **right after** a teen session, using the same teen, so the hand-off is real.

**0:00 — Setup (1 min)**
- "Your teen just used a saving lesson. I want to see what happens when they bring it to you."

**0:01 — Receive the hand-off (3 min)**
- Teen shows the parent their saved Savings Goal and asks the prompt question
  ("what did YOU save up for at my age, and how long did it really take?").
- *(observe the actual conversation — does it happen naturally? does the parent engage?
  does it go beyond one sentence?)*

**0:04 — Parent review of the content (4 min)** — ask:
- "Is anything here **inaccurate, hyped, or pushing crypto** in a way that worries you?"
- "Is it **age-appropriate** for your kid?"
- "Does it **respect your role** as the parent, or try to go around you?"
- "What part of this lesson would you want your child to **remember five years from now**?"

**0:08 — Continue? (2 min)**
- "Would you go through more weeks of this **with your kid**? What, if anything, would stop you?"

---

## 5. Observation checklist (fill during the TEEN session)

Mark ✓ / ✗ / partial, and jot a note. Each line maps to a beat or a moat criterion.

| # | Observation | ✓/✗ | Note |
|---|---|---|---|
| 1 | Understood the goal builder **without help** | | |
| 2 | Entered a **real, personal** goal (not a placeholder) | | |
| 3 | Made a **genuine prediction before** revealing (didn't skip) | | |
| 4 | **Noticed/reacted** to the guess-vs-real gap | | |
| 5 | Tried the consequence choice and **watched** the animation | | |
| 6 | Could **explain the takeaway** ("same dollars buy less") in own words | | |
| 7 | **Found Print/Save** for the Savings Goal **unprompted** | | |
| 8 | **Actually kept** the artifact (saved/printed) | | |
| 9 | Read the share prompt and expressed **real intent** to show a parent | | |
| 10 | Completed **all four beats** | | |
| 11 | *(12–14 tester only)* finished **with no adult explaining the page** | | |
| 12 | Any **dead end, bug, or confusion** (where + what) | | |
| 13 | Any **boredom / drop-off** moment (where) | | |
| 14 | Total time on page (unrushed): ____ min | | |
| 15 | **Visible surprise moment** — a noticeable surprise, realization, or prediction-error reaction (e.g. "Wait, really?", laughter, rechecking inputs, changing their estimate, visible curiosity) | | |
| 16 | **Artifact ownership** — did they seem to *care* about the artifact? Score 1–4 (legend below) | ___/4 | |

**#16 artifact-ownership scale:** 1 = saved only because prompted · 2 = saved voluntarily ·
3 = discussed or modified it · 4 = expressed a desire to revisit it later.

---

## 6. Post-test questions (ask the teen; note exact words)

1. **(Discovery)** "Before you saw the real number of weeks — how far off was your guess,
   and did that surprise you?"
2. **(Comprehension)** "If a friend kept $1,000 in a drawer for 10 years, what would you
   tell them happens to it?"
3. **(Real-artifact)** "Do you still have your savings goal saved? Where would you actually
   put it so you'd see it?"
4. **(Family-conversation)** "On a scale of 1–5, how likely are you to actually show a
   parent and ask them that question? Why that number?"
5. **(Affect / continue)** "Would you want to do the next week like this? What would make
   it better?"
6. **(Retention)** "If I asked you about this lesson next week, what do you think you'd
   remember?"
7. **(Transfer)** "Can you think of a situation in your own life where this lesson might
   matter?"

---

## 7. Pass / fail criteria — is Week 3 ready to become the pattern?

### Minimum sample before deciding
- **≥3 teens**, including **≥1 in the 12–14 band**
- **≥1 educator**
- **≥1 parent**, with at least **1 real hand-off** observed (parent + teen together)

> Small-n is fine — this is qualitative validation, not a metrics test. But do not decide
> off a single teen, and **do not skip the 12–14 tester** (that's a known risk).

### Learner mix — recruit a realistic range, not just the keen ones
**Do not recruit only highly engaged students.** If possible, include:
- one **naturally engaged** learner,
- one **average** learner,
- one learner who is **not especially interested** in money, economics, or Bitcoin.

The goal is to validate the pattern with a realistic range of learners, not only the most
motivated ones — a pattern that only works for the keenest kid won't scale to 9 weeks.

### PASS — all of these must hold
- **Discovery:** a majority of teens make a real prediction before revealing **and**
  articulate the gap insight in their own words (post-Q1).
- **Comprehension:** a majority correctly explain the Race→Melt takeaway unprompted
  (checklist #6 / Q2) — "same dollars buy less."
- **Real-artifact:** a majority **keep** the Savings Goal with no or minimal prompting
  (checklist #7–#8) — this is the weakest audit criterion (1.50); it must clearly move.
- **Family-conversation:** **≥1 genuine parent↔teen conversation actually happens** from
  the share beat, **and** the parent says they'd continue (§4 close).
- **12–14 accessibility:** the 12–14 tester completes **all four beats solo** (checklist #11).
- **Trust/accuracy:** **zero** unresolved accuracy, hype, or "goes around the parent"
  flags from the educator or parent.
- **Effort:** teens finish in **≤20 min** unrushed, with no dead ends or blocking bugs.

### FAIL / FIX-FIRST — any of these means do NOT replicate yet
- Teens routinely **skip the prediction** or treat it as busywork → the discovery beat isn't landing.
- Teens **can't explain** the consequence in their own words → the animation entertains but doesn't teach.
- Teens **don't keep** the artifact → the moat mechanic (1.50) didn't move; fix the Keep step.
- The share beat is **ignored or feels forced** → the family mechanic (1.90) didn't move.
- The **12–14 tester needs hand-holding** → the page still skews 15–17; do the age-band pass first.
- Educator or parent flags **inaccuracy or hype** → fix content before it propagates to 9 weeks.

### Decision rule
- **All PASS gates hold →** lock the pattern. Proceed to **T2 (Week 10 dashboard)** and
  replicate the Predict→Verify→Keep→Share + sensory treatment across the remaining weeks.
- **Any gate fails →** fix Week 3 first, re-test the failed gate, **then** decide.
  Replicating a flawed pattern across 9 weeks multiplies the flaw 9×; one fix here is
  cheaper than nine fixes later.

---

### Notes for the runner
- Keep the moderator quiet — silence surfaces real confusion; hints hide it.
- Capture **exact quotes**, not summaries (esp. Q2 and Q4).
- One page = one tester per session; reset the browser between testers.
- This packet validates the **pattern**, not just this page. What you confirm here is what
  you're committing to build 9 more times.
