# The Rules Under the Game: Planning Pack

> Teen-facing interactive deep dive. Public title: **The Rules Under the Game**. Subtitle: *Choices, incentives, money, and Bitcoin.*
> Internal framework: the physics of economics (scarcity meeting human action, incentives, trust, time, money, feedback, and Bitcoin).
> Status: planning pack (v1). Build deferred to a follow-up pass. Author: Dalia. Date: 2026-06-20.

This pack is the planning layer only: product brief, six-module curriculum map, full interactive tool specs, ontology map, and misconception lab, plus a short page-structure / graph-edge / boundary / integration section so the build pass can start cleanly. No student-facing copy is final here; copy gets drafted and voice-checked in the build pass.

A house style runs through every student-facing string in this document and the eventual build: no em dashes, no hype, no crypto slang, no badges or points, no moralizing. Periods, commas, and parentheses only.

---

## 0. How this pack maps to BSA conventions

A few decisions were locked against the existing repo before writing, so the build pass does not have to relitigate them.

**File shape.** The original spec proposed four flat files (`deep-dives/physics-of-economics-teen.html`, plus a js/css/json). The repo does not build deep dives that way. Every deep dive is a *folder* under `/deep-dives/` containing an `index.html` hub plus topic pages (see `deep-dives/first-principles/`, which also carries a `data/` directory and a vendored `chart.umd.js`). So this deep dive becomes a folder: `deep-dives/rules-under-the-game/`. Final file layout is in §7.

**Deep Dive Standard.** A deep dive is a research-based learning lab, not a longer lesson. It must move through the arc: research question, current system, failure mode, design pressure, Bitcoin mechanism, tradeoffs, interactive test, evidence, objections, reflection. Each of the six modules below is built to satisfy that arc at teen depth. An interactive must teach a tradeoff; a reveal box or flip card does not count.

**Voice spec.** Three checks apply to every artifact: composability (bridge at least one of the five named domain pairs), first-principles (derive from primitives, not authority or analogy), and epistemic (present two or more perspectives, title as a question or frame, source the hard claims). This deep dive bridges pair #2 (Mi Primer Bitcoin pedagogy x client psychology, here re-aimed at teen psychology) and pair #3 (sovereignty maximalism x collaborative-custody pragmatism, surfaced in Modules 5 and 6).

**Operating frame.** Unbounded mode. No quizzes with binary right/wrong answers as the primary teaching tool, no XP, no completion percentages, no "complete X to unlock Y." Assessment is reflection-based (predict, explain, compare). The student leaves with reasoning they can reuse on situations we never wrote about, not a score.

---

## 1. Teen product brief

**Purpose.** Give a teenager a working mental model of how choice, value, incentives, money, and trust actually operate, starting from their own daily life, and end with a precise, non-hyped understanding of the one rule Bitcoin changes. The goal is reasoning the student can reuse, not facts to memorize.

**Audience.** Ages 13 to 18. Smart, quick to detect being talked down to, quick to disengage from abstract lectures. Assume no economics background and no Bitcoin background. Assume strong intuitions about scarcity, status, fairness, and incentives from lived experience (battery, time, money, grades, group chats, group projects).

**Learning goals.** By the end the student can explain, in their own words: scarcity means choice; every choice has a cost; value depends on the person and the situation; people respond to incentives; bad systems often produce bad behavior from ordinary people; money is a scoreboard for economic life; if the scoreboard can be quietly changed, people make distorted decisions; trust is useful but needs limits; Bitcoin changes one rule, the supply rule, so no one can easily create new units to hide a cost today and push it onto someone else later; and Bitcoin does not remove scarcity or responsibility, it moves responsibility back to the holder.

**Tone.** Clear, direct, curious, a little playful, never childish. Calm and serious in layout. Socratic: the student predicts and chooses *before* any principle is named.

**What makes it different.** Three things. First, it starts in teenage life, not in banks or charts, and earns its way to money. Second, the value lives in the tools, not the prose: six choice-and-consequence simulators where the student acts and then sees what they gave up. Third, it informs instead of convincing. Bitcoin is introduced only when the reasoning has earned it (Module 6), and even then with tradeoffs and objections attached.

**What not to do.** No Bitcoin in Modules 1 through 4. No politics-first framing. No "Bitcoin fixes everything," no "inevitable," no urgency. No badges, points, streaks, or completion bars. No legal, tax, or financial advice. No collection of sensitive information, and never ask a student to type a real seed phrase. No crypto-casino visuals. No em dashes. No fake teen slang.

**Why it matters for BSA / TSA.** It is a top-of-funnel asset for the youngest audience and for parents, teachers, and facilitators who want a serious, non-preachy way to open the subject. It feeds the existing first-principles and money-and-banking deep dives, and gives FSA (the mission-driven, non-monetized sister site) a natural co-host. It demonstrates the brand's editorial stance (inform, not convince) at an age where most Bitcoin content either hypes or ignores young people.

---

## 2. Six-module curriculum map

The learning loop is identical in every module: scenario, choice, consequence, pattern, name the idea, connect to money, connect to Bitcoin only when earned. Modules 1 through 4 never mention Bitcoin. Module 5 introduces custody and trust. Module 6 is the only module that argues about Bitcoin directly.

### Module 1: You Can't Have Everything
- **Hook.** You have twenty dollars, three hours, one phone battery at forty percent, and homework due tomorrow. Several things you want to do are competing for the same evening.
- **Core question.** When you can't do everything, what does choosing actually cost you?
- **Student choice.** Allocate a finite Friday night across: food, save money, go out, help a friend, charge phone, finish homework, buy something online, time with family, go home early.
- **Tool.** The Friday Night Simulator (§3.1).
- **Concept introduced.** Scarcity, and its shadow, opportunity cost. Named only after the student has spent their evening and seen the gap.
- **Reflection.** What did your choice protect, and what did it quietly give up? Would a different person with the same twenty dollars have chosen differently, and why?
- **Bitcoin connection.** None yet. Hold the line.
- **Exit takeaway.** Scarcity does not mean there is nothing. It means every choice spends something you cannot spend twice.

### Module 2: Why the Same Thing Is Worth More to One Person Than Another
- **Hook.** A phone charger is worth almost nothing at one hundred percent battery and a lot at two percent. Same charger.
- **Core question.** Does value live in the object, or in the person and the moment?
- **Student choice.** Pick an object and a context and predict its value before the tool reveals the range.
- **Tool.** The Value Swap Game (§3.2).
- **Concept introduced.** Subjective value and marginal value.
- **Reflection.** Name one thing that is worth a lot to you and little to a friend. What changed: the thing, or the situation around it?
- **Bitcoin connection.** A light, optional touch only: a saved unit of money is worth more the day a normal plan breaks. Stated as a question, not a pitch.
- **Exit takeaway.** Objects have properties. People assign value based on their situation.

### Module 3: Invisible Rules Make People Move
- **Hook.** Why do people suddenly care about grades the week before report cards?
- **Core question.** When behavior changes, is it the people who changed, or the rule they were under?
- **Student choice.** Pick a classroom rule to switch on and predict who changes behavior.
- **Tool.** The Incentive Machine (§3.3).
- **Concept introduced.** Incentives, and the gap between the immediate effect and the effect over time.
- **Reflection.** Name a rule at your school that produces a result nobody actually wants. What behavior is it quietly rewarding?
- **Bitcoin connection.** None direct. Plant the seed: bad outcomes often come from systems, not from bad people. This pays off in Modules 4 and 6.
- **Exit takeaway.** When enough people face the same incentive for long enough, a pattern appears. The pattern is the rule's fault, not the people's.

### Module 4: When the Scoreboard Lies
- **Hook.** Imagine a game where the referee can add points to one team while the game is still being played. Did that team get better, or did the scoreboard stop telling the truth?
- **Core question.** What happens to people's decisions when the thing they measure with can be changed by whoever runs it?
- **Student choice.** Run a scenario where a measuring tool (grade, price, savings number, money supply) gets quietly adjusted, and predict how people respond.
- **Tool.** The Broken Scoreboard Simulator (§3.4).
- **Concept introduced.** Money as a measuring tool, and what happens to decisions when the measure drifts. This is inflation, taught without starting from the word inflation.
- **Reflection.** If your savings number went up every year but bought less food each year, were you actually getting richer? How would you even know?
- **Bitcoin connection.** Still indirect. The student now feels the problem (a measure that can be changed distorts everyone's choices) before any solution is named.
- **Exit takeaway.** Money is not just stuff to spend. It is a measuring stick for time, work, savings, and plans. If the stick changes length, people misread reality and make decisions they would not otherwise make.

### Module 5: Trust, Verify, or Get Played
- **Hook.** Would you give your phone passcode to your best friend? Your locker code? Your bank app login?
- **Core question.** For anything that matters, who can help you, who can block you, who can lose it, and who can change the rules?
- **Student choice.** Compare custodians of something valuable across a fixed set of questions.
- **Tool.** The Trust Map (§3.5).
- **Concept introduced.** Trust, custody, verification, and the responsibility that comes with control.
- **Reflection.** Name one thing you are glad someone else holds for you, and one thing you would rather hold yourself. What makes the two different?
- **Bitcoin connection.** First real appearance. Bitcoin does not remove trust from life. It changes *where* the trust sits, and it hands more responsibility back to the holder. Both the gain and the cost are shown.
- **Exit takeaway.** Trust is not bad. Blind trust is fragile. Some systems let you verify instead of only trusting, and verifying has a price: the responsibility comes back to you.

### Module 6: Bitcoin Changes One Rule
- **Hook.** What if the game had a scoreboard that nobody, not even the referee, could secretly edit?
- **Core question.** If one rule of the money were fixed and public instead of adjustable, what would change downstream?
- **Student choice.** Compare two systems and watch the effects ripple.
- **Tool.** The Rule Change Lab (§3.6).
- **Concept introduced.** Bitcoin as a fixed-supply monetary system, and the honest tradeoffs that come with it.
- **Reflection.** Name one thing a fixed money rule makes better and one thing it makes harder. Who carries the new responsibility?
- **Bitcoin connection.** This is the payoff. System A: supply can change when leaders decide. System B: supply follows a fixed rule no central actor can easily change. The student sees effects on saving, borrowing, prices, bailouts, planning, trust, power, and responsibility, with the costs left in.
- **Exit takeaway.** Bitcoin does not remove scarcity. It makes scarcity harder to hide by removing the ability to quietly change the money. It also does not remove responsibility. It gives more of it back to you. Bitcoin is not an escape from economics. It is a system that respects economic reality more honestly, and asks more of the holder in return.

---

## 3. Full interactive tool specs

Each tool follows the same contract: the student makes a real choice, the tool shows a consequence that depends on that choice, a pattern is surfaced, and only then is the idea named. Consequences are deterministic and legible (the student can trace why they got the outcome), never random and never scored. All tools work without login and store nothing sensitive. Any per-session state lives in memory or in a single namespaced localStorage key (`rutg_state`), never anything identifying.

Shared accessibility baseline (applies to all six, do not repeat per tool): full keyboard operation with visible `:focus-visible` outlines, ARIA roles on interactive controls, `prefers-reduced-motion` respected for any transition, color never the sole carrier of meaning (pair every color cue with text or icon), WCAG 2.1 AA contrast on the dark surface, and a non-color text label on every choice and outcome.

### 3.1 The Friday Night Simulator (Module 1: scarcity, opportunity cost)
- **Purpose.** Make the student *feel* opportunity cost by spending a finite evening and seeing what the spend foreclosed.
- **User inputs.** Three budgets shown as live meters: money (20 units), time (3 hours), phone battery (starts ~40 percent). The student drags or clicks activities into the evening.
- **Possible choices (each activity has a money cost, time cost, battery effect, and one or more downstream flags):** buy food, save money, go out, help a friend, charge phone, finish homework, buy something online, time with family, go home early.
- **Consequence logic.** Spending any budget to zero blocks activities that need it (you cannot go out with no money and no battery to call a ride). Each activity sets flags that later activities read. Examples: skipping homework sets `hw_undone`, which surfaces a next-morning consequence; spending all money on "buy something online" sets `broke`, which blocks "buy food" and surfaces hunger; "charge phone" trades an hour now for capability later. The output is not a verdict on whether the student chose well. It reports, neutrally: what you gained, what you gave up (the highest-value thing you could not also do), and what problem showed up later.
- **Output text (templated, not graded).** Three blocks. Gained: the things you completed. Gave up: the single best alternative your last constraint blocked. Showed up later: any flag that matured into a consequence. Then one line: every one of those costs was invisible at the moment you chose.
- **Reflection prompts.** What did your evening protect? What did it quietly cost? Would someone with the same twenty dollars and a different situation have chosen differently?
- **Data structure.** `activities[]`, each `{id, label, cost:{money,time,battery}, requires:[budget], setsFlags:[], blocksIfFlag:[], laterConsequence}`. Session holds `budgets{}` and `flags[]`.
- **Edge cases.** Student does nothing (output: doing nothing is also a choice; here is what the empty evening cost). Student tries an unaffordable activity (disabled control with a text reason, not a silent no-op). Student maxes one budget and ignores others (output highlights the unspent budgets as their own kind of cost).
- **Accessibility notes.** Drag interactions must have a click or keyboard equivalent; meters announce remaining budget via `aria-live`.

### 3.2 The Value Swap Game (Module 2: subjective and marginal value)
- **Purpose.** Show the same object taking different value in different situations, so value is felt as situational, not intrinsic.
- **User inputs.** Pick one object and one context, then *predict* the value on a low-to-high scale before revealing.
- **Possible choices. Objects:** water bottle, phone charger, hoodie, concert ticket, twenty-dollar bill, a password, a Bitcoin seed phrase (handled as an idea, never a real input field), bus pass, homework answer, passport. **Contexts:** normal day, emergency, travel, social pressure, inflation, bank freeze, lost phone, family crisis.
- **Consequence logic.** A matrix maps each object-by-context pair to a short situational value note and a relative magnitude. The student predicts first; the reveal compares their prediction to the situational reading and explains *why* the situation moved the value. No score for guessing right; the point is the explanation.
- **Output text.** "Here is why this object is worth more or less here." Plus one line naming the principle once enough pairs have been explored: the object did not change, your situation did.
- **Reflection prompts.** Name something worth a lot to you and little to a friend. What changed, the thing or the moment?
- **Data structure.** `value_matrix[objectId][contextId] = {note, magnitude}`. Session holds explored pairs to decide when to surface the named principle.
- **Edge cases.** Seed phrase object: surfaces a teaching note about why you never type a real one, and the field is illustrative only. Object-context pairs that are genuinely ambiguous show two readings rather than one, which models the epistemic stance.
- **Accessibility notes.** Prediction control is a labeled slider with keyboard steps and a text readout of the chosen level.

### 3.3 The Incentive Machine (Module 3: incentives over time)
- **Purpose.** Let the student change one rule and watch behavior shift, separating "bad people" from "bad rules."
- **User inputs.** Select one rule to switch on; predict who changes behavior before running it.
- **Possible choices (rules):** no late penalty, extra credit for fastest work, everyone gets the same grade, only the top three students are rewarded, cheating is ignored, group project with one shared grade, phones allowed during tests, popularity rewarded more than effort.
- **Consequence logic.** Each rule maps to four outputs: immediate effect, hidden cost, who benefits, who pays, plus a short "over time" projection showing how the pattern compounds as more people adapt. The model is illustrative and clearly framed as a tendency, not a law.
- **Output text.** Four labeled cells plus the time projection. Closing line: notice that nobody here is evil. The rule produced the behavior.
- **Reflection prompts.** Name a real rule at your school that produces a result nobody wants. What is it quietly rewarding?
- **Data structure.** `rules[]`, each `{id, label, immediate, hiddenCost, benefits, pays, overTime}`.
- **Edge cases.** Student expects no change: the tool still shows the slow over-time drift, which is the harder and more honest lesson. Two rules that interact (same grade plus ignored cheating) can be stacked in an optional advanced view.
- **Accessibility notes.** Rule selector is a radio group; outputs render as a definition list, not a color-coded grid alone.

### 3.4 The Broken Scoreboard Simulator (Module 4: money as measure, distorted signals)
- **Purpose.** Make a drifting measuring stick feel real before the word inflation is ever used.
- **User inputs.** Pick a scenario; choose whether to "adjust the scoreboard"; observe behavior of the people inside the scenario.
- **Possible choices (scenarios):** referee adds points to one team mid-game, teacher raises everyone's grade after the test, store changes prices every hour, savings number rises while it buys less food, a country prints money to cover a promise, a bank that looks safe until everyone asks for their money at once.
- **Consequence logic.** Each scenario has a "true signal" and a "reported signal." Adjusting the scoreboard widens the gap. The tool shows how people, reading the reported signal, make choices that look smart on the scoreboard and worse in reality (stop studying, hoard, spend fast, misjudge safety). The lesson is the divergence between measured and real.
- **Output text.** Two tracks side by side: what the scoreboard says, what is actually happening. Closing line: when the measure drifts, people are not being foolish. They are reading a stick that lies.
- **Reflection prompts.** If your savings number went up but bought less each year, were you richer? How would you know?
- **Data structure.** `scenarios[]`, each `{id, label, trueSignal, reportedSignal, behaviorWhenAdjusted, realOutcome}`.
- **Edge cases.** The bank-run scenario must avoid implying any specific named institution; keep it generic and mechanism-level. The country-printing scenario states the mechanism (more units chasing the same goods) and is sourced in the claim ledger, not asserted.
- **Accessibility notes.** The two tracks must be distinguishable by label and structure, not by color alone; any animated drift respects reduced-motion.

### 3.5 The Trust Map (Module 5: trust, custody, verification)
- **Purpose.** Turn a vague feeling about trust into a five-question comparison the student can run on anything.
- **User inputs.** Pick a custodian of something valuable; answer or reveal the five questions for it; compare across custodians.
- **Possible choices (custodians):** a friend holding your phone, the school holding your grades, a bank holding your money, an exchange holding your Bitcoin, you holding your own keys, collaborative multisig where no single person controls everything, government currency, the Bitcoin protocol itself.
- **Five questions per custodian.** Who can help you? Who can block you? Who can lose it? Who can change the rules? What can you verify? Plus a sixth surfaced at the end: what responsibility comes back to you?
- **Consequence logic.** Each custodian has honest answers across the six axes. Comparing two custodians side by side surfaces the tradeoff directly: more control usually means less help and more responsibility. No custodian is labeled "best." The collaborative-multisig row exists to show a middle path (pair #3: maximalism x pragmatism), not to push one answer.
- **Output text.** A comparison card. Closing line: trust is not the enemy. Blind trust is fragile. The question is always where the trust sits and what you can check.
- **Reflection prompts.** Name one thing you are glad someone else holds, and one you would rather hold yourself. What makes them different?
- **Data structure.** `custodians[]`, each `{id, label, helps, blocks, canLose, changesRules, verifiable, responsibility}`.
- **Edge cases.** Keep "you holding your own keys" honest about loss risk; do not romanticize sole custody. Multisig row explains "no single person controls everything" in plain words before using the term.
- **Accessibility notes.** Comparison is a real table with row and column headers; selecting custodians is keyboard-operable.

### 3.6 The Rule Change Lab (Module 6: fixed-supply money, with tradeoffs)
- **Purpose.** Let the student compare an adjustable-supply system with a fixed-supply system and trace the downstream effects, costs included.
- **User inputs.** Toggle between System A (supply can change when leaders decide) and System B (supply follows a fixed rule); inspect effects across eight dimensions.
- **Possible choices.** Toggle the system; optionally stress one dimension (for example, "a crisis hits") and see how each system responds.
- **Effects shown across eight dimensions.** Saving, borrowing, prices, bailouts, planning, trust, power, responsibility.
- **Consequence logic.** Each dimension has an honest reading for both systems. System B is not shown as strictly better. It makes saving and long planning easier and makes quiet bailouts harder, and it makes the holder carry more responsibility, removes a crisis lever leaders sometimes use, and offers no undo button. The student sees both columns and the tradeoff in each row.
- **Output text.** A two-column comparison plus a synthesis line: Bitcoin changes one rule, the supply rule. That makes scarcity harder to hide. It does not remove scarcity, and it does not remove responsibility. It moves responsibility back to you.
- **Reflection prompts.** Name one thing a fixed rule makes better and one it makes harder. Who carries the new responsibility?
- **Data structure.** `dimensions[]`, each `{id, label, systemA, systemB, tradeoffNote}`; plus `stressors[]` for the optional crisis view.
- **Edge cases.** Do not let System B read as utopian. Every row must carry a real cost. The bailout row should present the steelman for *and* against a leader being able to change supply in a crisis (Module 6 objections, §5 misconception M5 and M8).
- **Accessibility notes.** System toggle announces the active system via `aria-live`; the comparison is a structured table.

---

## 4. Ontology map

A small, teen-legible object model sits under all six tools so content is reusable across BSA and TSA (the same objects can power a money-history timeline, a custody lesson, or an FSA tool later). Adult terms map to teen terms; the teen term is what the student sees, the adult term is the graph and reuse handle.

| Teen object (student sees) | Adult term (graph handle) | One-line meaning |
|---|---|---|
| Person making a choice | Actor | Someone who acts to improve their situation |
| What they want | End | The preferred state they are trying to reach |
| What they use | Means | The limited resources they spend to get there |
| What is limited | Scarcity | You cannot use the same time, money, energy, or attention twice |
| The thing they give up | Opportunity cost | The next-best option a choice forecloses |
| What it is worth to them | Subjective value | Value assigned by the person and the situation, not the object |
| What pushes behavior | Incentive | A reward or punishment that changes what people do |
| Now versus later | Time preference | Whether a person takes the reward now or waits for more later |
| What tells them if it worked | Feedback | The honest signal a system needs to correct mistakes |
| The measuring stick | Money | A tool to compare, trade, save, and plan |
| A stick that changes length | Bad money | Money that gives confusing signals because its value or supply keeps shifting |
| Relying on someone else | Trust | Depending on a person or system you do not control |
| Checking instead of trusting | Verification | Confirming a thing yourself rather than taking it on faith |
| The rule under the game | Monetary rule | The rule that governs how many units exist and who can change it |
| The rule Bitcoin fixes | Fixed supply | A supply schedule no central actor can easily change |

**Reuse note.** Each row is a node type. Tools instantiate nodes (the Friday Night Simulator instantiates `Actor`, `Means`, `Scarcity`, `Opportunity cost`; the Trust Map instantiates `Trust`, `Verification`, plus a custody axis). When the build pass writes `data/rules-under-the-game.json`, these object names are the canonical keys, so a later FSA or money-history page can pull the same definitions.

---

## 5. Misconception lab

Eight cards. Each follows the same shape: what students may think, why it feels true, what is missing, a better way to see it, and a one-line example. Cards are repair tools, not gotchas. Never shame the student, never strawman the wrong view.

**M1. "Economics is only about money."**
Feels true because the word shows up around prices and banks. What is missing: economics is about any choice under a limit, including time, attention, and energy. Better view: economics is the study of how people act when they cannot have everything. Example: deciding whether to sleep or finish a game is an economic choice with no money in it.

**M2. "Value is the same for everyone."**
Feels true because prices look like fixed labels. What is missing: a price is where two different valuations met, not a property of the object. Better view: the object has properties; people assign value based on their situation. Example: water is nearly free at lunch and precious after a two-hour practice. Same water.

**M3. "If something is free, it has no cost."**
Feels true because no money changed hands. What is missing: the cost is the next-best thing you gave up to get it. Better view: every choice has an opportunity cost, even free ones. Example: a free three-hour stream costs you the three hours you could have spent on anything else.

**M4. "If the rules sound fair, the outcomes will be fair."**
Feels true because fair-sounding rules feel good. What is missing: rules create incentives, and incentives, not intentions, drive outcomes. Better view: judge a rule by the behavior it rewards over time, not by how it sounds. Example: "everyone gets the same group grade" sounds fair and quietly rewards the people who do nothing.

**M5. "Printing money creates wealth."**
Feels true because more money looks like more resources. What is missing: money is a measuring stick, not the goods themselves; more units chasing the same goods changes the measure, not the wealth. Better view: you cannot make a class smarter by raising everyone's grade; you cannot make a country richer just by adding units. Example: if a game's referee doubles everyone's points, no one actually played better. (Sourced claim; see ledger.)

**M6. "Banks always have everyone's money ready."**
Feels true because the app shows your balance instantly. What is missing: most of the deposited money is lent out, so not everyone can withdraw at once. Better view: the balance is a promise that usually holds and occasionally does not. Example: if every student tried to grab their locker contents in the same minute, the hallway would not fit them. (Mechanism-level, no named institution.)

**M7. "Bitcoin removes all trust."**
Feels true because "trustless" gets repeated a lot. What is missing: Bitcoin removes the need to trust *certain* parties by letting you verify, but it adds responsibility you now carry yourself. Better view: Bitcoin moves trust, it does not delete it. Example: holding your own keys means no one can block you and no one will rescue you if you lose them.

**M8. "Self-custody means no risk."**
Feels true because no third party can fail you. What is missing: the risk moves to you (loss, mistakes, no undo), which is why middle paths like collaborative multisig exist. Better view: every custody choice is a tradeoff between who can help you and who can harm you. Example: a diary only you can open is also a diary only you can lose.

---

## 6. Reflection-based assessment (no quizzes)

Per the unbounded frame, there are no scored quizzes. Each module ends with three prompt types the student writes or thinks through, optionally saved to a private in-page journal (memory only, never transmitted): a **predict** prompt (before a tool runs), an **explain** prompt (name the principle in your own words after acting), and a **compare** prompt (hold two situations or systems side by side). A final synthesis screen asks the student to answer, in their own words, the nine learning-goal questions from §1. There is no pass or fail and no percentage.

---

## 7. Page structure and file layout (for the build pass)

**Folder (matches repo convention):** `deep-dives/rules-under-the-game/`
- `index.html`: hub: hero, opening dilemma, six module cards, glossary, misconception lab, synthesis, next steps.
- `module-1.html` … `module-6.html`: one page per module, each embedding its tool. (Or a single-page app inside `index.html` if the build pass prefers; folder-with-pages matches `first-principles/` more closely and is the default.)
- `data/rules-under-the-game.json`: modules, scenarios, choices, consequences, concepts (ontology keys from §4), misconceptions, reflection prompts, tool outputs.
- `js/rules-under-the-game.js`: tool engines, all data-driven (no content hard-coded in logic).
- `css/rules-under-the-game.css`: scoped styles. Reuse `--color-brand`, `--color-bg`, `--color-surface`, `--color-border`, `--color-text`, `--color-muted` from `css/brand.css`. Use absolute CSS paths (`/css/brand.css`), never relative, so embedding does not break. Introduce no new design tokens.

**Page sections (hub):** hero, student opening dilemma, module cards, interactive lab area, concept glossary (from §4), misconception lab (from §5), reflection journal prompts (from §6), final synthesis, next steps.

**Reuse hooks already in the repo.** The Reflect widget (`/js/reflect-widget.js`, Socratic AI, auto-inits via MutationObserver) should be mounted on each module with `data-topic`, `data-path`, `data-title`. The live context bar (`/js/bitcoin-context.js`) is optional here and probably omitted for the teen audience to keep the surface calm. The lab-guide system is *not* used (it implies completions and a localStorage completion key, which is bounded-mode; this deep dive stays unbounded).

---

## 8. Graph edges and boundary validation

**Graph ontology (embed in `index.html`, matching the `content_type` / `teaches` / `bridges_to` pattern used in existing deep dives):**
- `content_type: deep_dive`
- `strategic_role: top-of-funnel teen and educator entry; first-principles on-ramp`
- `teaches:` scarcity, opportunity cost, subjective value, incentives, time preference, feedback, money as measure, bad money, trust, verification, fixed supply
- `repairs:` misconceptions M1 through M8 (§5)
- `supports_decision:` none high-intent (this is a thinking asset, not an implementation asset)
- `bridges_to:` `deep-dives/first-principles/`, `deep-dives/money-banking/`, FSA money tools, BSA custody education (intro level only)
- `blocked_by_boundary:` must not route to TBA

**Boundary validation.** This is an educational asset for minors and educators. It must not funnel to The Bitcoin Adviser. TBA routing is reserved for high-intent implementation topics (custody setup, inheritance execution, recovery planning, vault design, adviser conversation, family-office or corporate-treasury implementation), none of which belong in front of a 13-to-18 audience. Module 5 may *mention* that collaborative multisig and advisers exist as concepts; it must not link to a consult. FSA pages, if they co-host this, must not route to TBA at all. Next steps point only to other free education: first principles, money history, a wallet workshop at intro depth, custody basics, the sovereignty stack overview. The Jurisdictional Exposure Audit is an adult and family asset and is offered only as an "if you are older or doing this with your family" branch, never as the default next step.

---

## 9. Evidence and claim ledger (seed)

Most of this deep dive teaches reasoning, not facts, so the sourced-claim surface is small but real. The build pass maintains a claim ledger; these are the claims that need a source before publish, with preferred primary sources from the Deep Dive Standard.

- The fixed-supply / 21-million claim and the issuance schedule: Bitcoin white paper and Bitcoin Core documentation / the relevant BIPs. State the mechanism, avoid any stale block-subsidy number; reference the current subsidy as of build date or describe it as halving on a schedule rather than quoting a figure that ages.
- "More units chasing the same goods changes the measure" (M5, Module 4): frame as the standard quantity intuition; cite a primary monetary source (for example FRED / Federal Reserve educational material) rather than asserting it.
- The bank-liquidity claim (M6, Module 4 bank-run scenario): describe fractional-reserve mechanics at the mechanism level, sourced generically, with no named institution and no crisis-mongering.
- Any price reference: avoid. If a number is unavoidable, bind it live via `data-btc-live` rather than hard-coding a stale price.

No legal, tax, or financial-advice claims appear anywhere in the student-facing content.

---

## 10. Build order (for the follow-up pass)

Per the original intent (the value is in the tools, not the prose) and the Deep Dive Standard implementation order:

1. Lock the six scenarios and their consequence logic as data (`data/rules-under-the-game.json`), tools first.
2. Build the six tool engines in `js/`, fully data-driven, one vertical slice (Module 1) end to end first to prove the pattern.
3. Draft student-facing copy and run it through the three-part synthesis check and the youth-voice pass.
4. Assemble the hub and module pages with scoped CSS and absolute paths.
5. Add the glossary (from §4) and misconception lab (from §5).
6. Wire the claim ledger and graph edges; run boundary validation.
7. QA: teen readability, mobile layout, keyboard nav, no console errors, no em dashes, no external tracking beyond site norms, no sensitive-data capture, no hype, no premature TBA routing, footer present (EN/ES).
8. Write the optional teacher and parent guide.

**MVP acceptance.** A teenager completes the experience in 20 to 35 minutes; a teacher or parent can run it as a discussion guide; the student can explain all nine learning goals in §1; and the experience feels original, interactive, and serious, not like homework, a crypto ad, or a political lecture.

---

## 11. Suggested superagent workflow (reference, for the build pass)

The original spec defined ten specialist agents. Condensed mapping for execution: a **teen-pedagogy** pass (hooks, scenarios, reflection), an **interactive-systems** pass (tool logic and data schemas, §3), a **first-principles-integrity** pass (enforce the action-to-Bitcoin chain and flag any premature Bitcoin or overclaim), a **youth-voice** pass (rewrite to sound natural, strip AI and motivational tone, strip em dashes), a **UX-flow** pass (page order, mobile, one clear next step), a **misconception** pass (§5 cards), an **assessment** pass (reflection prompts, no quizzes), an **implementation** pass (build the four-file folder), and a **QA-and-safety** pass (accuracy, tone, privacy, accessibility, boundary, minor-safety, seed-phrase handling). Each pass carries the red flags from the original spec.

---

## 12. Why this belongs in BSA (internal note)

This section is internal positioning, not student-facing copy. It exists so anyone auditing the deep dive later understands what it is and what it must never become.

This is **not a sales page.** It sells nothing, asks for nothing, and measures nothing. Its only output is a student who can reason better about choices, scarcity, incentives, trust, money, and responsibility.

This is **not a TBA lead magnet.** It must never route to The Bitcoin Adviser or any advisory offer, because the audience includes minors and because routing high-intent implementation to a 13-to-18 reader is both inappropriate and off-strategy. Module 5 may name collaborative multisig as a concept; it links to no consult. The boundary metadata in `index.html` encodes this as `blocked_by_boundary: must_not_route_to_tba`.

This is a **teen and educator first-principles on-ramp.** It is the youngest entry point into BSA, designed to feed the existing first-principles and money-and-banking deep dives, and to give parents, teachers, and facilitators a serious, non-preachy way to open the subject.

It embodies the BSA principle of **education before persuasion.** Bitcoin appears only in Modules 5 and 6, only after the reasoning has earned it, and always with its costs attached. The last module is built to make a skeptic sharper and an over-enthusiast humbler, not to win either over.

It **connects only to free education.** Every next-step link points to free BSA or FSA material. There are no paywalls, no email capture on the teen pages, and no funnel.

It must **remain safe for minors.** No sensitive data is ever requested or stored (no seed phrase, key, password, balance, or real name); the only persistence is an optional reflection journal in the browser's own localStorage. Any future change that adds data collection, gamification, a funnel, or advisory routing would break the asset's reason for existing and should be rejected.

---

*Created by Dalia · bitcoinsovereign.academy*
