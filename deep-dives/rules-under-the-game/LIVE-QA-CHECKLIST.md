# Live QA Checklist: The Rules Under the Game

Run `npm run dev`, then open `http://localhost:3000`. Work through the ten pages in order.
For each page, check four lenses: mobile (~375px), desktop, keyboard-only, and EN/ES where it applies.

In Chrome, toggle mobile width with DevTools device toolbar (Cmd+Shift+M) set to 375px wide.
Open the Console tab (Cmd+Option+J) and keep it visible the whole time. It should stay empty.

---

## Global checks (apply to every page)

- [ ] No horizontal overflow. Nothing is cut off at 375px; no sideways scroll on the page body.
- [ ] All buttons and controls are visible and not clipped.
- [ ] Keyboard: Tab moves through controls in a sensible order; every focused control shows a clear gold focus ring; Enter or Space activates buttons; selects open with arrow keys.
- [ ] No console errors or warnings appear during load or interaction.
- [ ] Footer reads `Created by Dalia · bitcoinsovereign.academy` and the back link works.
- [ ] No completion bars, no badges, no points, no streaks, no "X% complete," no "unlock" language.
- [ ] No links or buttons to The Bitcoin Adviser, "book a consult," or any advisory offer.
- [ ] Text is readable on mobile (no tiny fonts, comfortable line length, good contrast).
- [ ] The page feels calm, serious, and teen-appropriate, not childish and not a crypto ad.
- [ ] EN and ES: the language toggle (top right of the activity) switches the whole page; the choice sticks when you move between pages.

---

## 1. Homepage, Find Your Path
`http://localhost:3000/` then scroll to the "Find Your Path" section.

- [ ] Under the "Pick the path that fits how you learn" heading, you see the line: "Younger learner, ages 13 to 18? Start with The Rules Under the Game ..."
- [ ] The link points to `/deep-dives/rules-under-the-game/` and opens the hub.
- [ ] 375px: the line wraps cleanly and does not crowd the path cards below.
- [ ] Keyboard: the link is reachable by Tab and shows a focus state.

## 2. Rules Under the Game, hub
`http://localhost:3000/deep-dives/rules-under-the-game/`

- [ ] Hero title shows "The Rules" with "Under the Game" in the gold gradient.
- [ ] Six module cards render, each with module number, title, and a question.
- [ ] Glossary (15 items), misconception lab (8 cards), synthesis panel, and "Where to go next" list all appear.
- [ ] The opening dilemma and "How this works" notes are present; "How this works" explicitly says no quizzes, grades, points, or badges.
- [ ] Each module card is a single focusable link; Tab reaches all six.
- [ ] 375px: cards stack to one column; nothing overflows.
- [ ] Next-steps links all resolve (first-principles, money-banking, why-money-fails, digital-scarcity, demos, and the older-student branch).

## 3. Module 1, Friday Night Simulator
`.../module-1.html`

- [ ] Three budget meters (money, time, battery) show and update as you add activities.
- [ ] Clicking an activity you cannot afford shows a plain-text reason and the control is disabled, not silently dead.
- [ ] "See how the night went" reveals three blocks (gained, gave up, showed up later) and a line stating there is no score.
- [ ] The lesson section (pattern, the idea, connect to money, takeaway) appears only after you click, not before.
- [ ] 375px: budget meters and activity buttons stack to one column; no overflow.
- [ ] Keyboard: you can Tab to each activity, toggle with Enter/Space, and reach the two buttons.

## 4. Module 2, Value Swap Game
`.../module-2.html`

- [ ] Two dropdowns (object, situation); the situation list changes when you change the object.
- [ ] You can pick a prediction pill, then "Reveal the reading" shows the value and the why.
- [ ] The seed phrase object shows a clear "example only, never enter a real one" style note. There is no field that accepts a seed phrase.
- [ ] Lesson appears only after reveal.
- [ ] 375px: dropdowns and pills wrap cleanly.

## 5. Module 3, Incentive Machine
`.../module-3.html`

- [ ] Rule dropdown, a prediction box, and "Run the rule" produce four cells (right away, hidden cost, who benefits, who pays) plus an "over time" block.
- [ ] Color is never the only signal; each cell has a text label.
- [ ] Lesson appears only after running.

## 6. Module 4, Broken Scoreboard
`.../module-4.html`

- [ ] Scenario dropdown and "Adjust the scoreboard" show two columns (what the scoreboard says vs what is actually happening) plus behavior and outcome.
- [ ] The bank-run scenario names no real institution.
- [ ] 375px: the two columns stack to one column.

## 7. Module 5, Trust Map
`.../module-5.html`

- [ ] Pick two or more holders, then "Compare them" builds a table with the six questions as rows.
- [ ] With fewer than two selected, it tells you to pick at least two.
- [ ] The self-custody row is honest about permanent loss; collaborative multisig is described as a concept with no link out to any service.
- [ ] 375px: the comparison table scrolls horizontally inside its box without breaking the page layout.
- [ ] Keyboard: holder pills are reachable and toggle with Enter/Space; table headers read correctly.

## 8. Module 6, Rule Change Lab
`.../module-6.html`

- [ ] "Run the comparison" shows all eight dimensions, each with System A, System B, and a tradeoff line.
- [ ] System B is not presented as perfect; every row carries a cost.
- [ ] The closing line states: Bitcoin does not remove scarcity, it makes scarcity harder to hide, and it gives more responsibility back to the holder.
- [ ] 375px: the long output stays readable; columns stack.

## 9. First-principles bridge link
`http://localhost:3000/deep-dives/first-principles/`

- [ ] In the "Scope of this area" note, the last sentence links to "The Rules Under the Game" with "(ages 13 to 18, English and Spanish)."
- [ ] The link opens the hub. No console errors on that page.

## 10. Spanish toggle and path
On any module or the hub, click the "Español" button (or visit `.../rules-under-the-game/?lang=es`).

- [ ] The whole page switches to Spanish: hero, cards, scenario, tool labels, buttons, lesson, reflection, footer chrome.
- [ ] Accents and ñ render correctly (for example: "batería", "decisión", "está", "número", "España/Español").
- [ ] Questions open with ¿ and any exclamations with ¡.
- [ ] No awkward or clearly machine-sounding phrasing jumps out. Note anything that reads off for a native speaker.
- [ ] The choice persists: switch to ES on the hub, click into a module, confirm it is still ES, and the prev/next links keep `?lang=es`.
- [ ] No em dashes anywhere in either language (periods, commas, parentheses only).
- [ ] Switch back to English and confirm it persists the other way.

---

## Safe diff inspection (do not commit yet)

You are on branch `audit/first-principles-upgrade`, which already has unrelated modified files. Inspect before staging.

```
git status
git diff --stat
git diff -- deep-dives/rules-under-the-game
git diff -- index.html
git diff -- deep-dives/first-principles/index.html
```

Notes on what to expect:

- `deep-dives/rules-under-the-game/` is a brand new folder, so it is untracked. `git diff -- deep-dives/rules-under-the-game` will show nothing because git does not diff untracked files. To see those files, use `git status` (they appear under "Untracked files"), or preview them with `git add -N deep-dives/rules-under-the-game && git diff -- deep-dives/rules-under-the-game` (the `-N` only marks intent-to-add, it does not stage content).
- `git diff -- index.html` should show exactly one inserted line: the teen on-ramp in Find Your Path.
- `git diff -- deep-dives/first-principles/index.html` may show nothing if the bridge link is already committed on this branch. Confirm the link is present with: `grep -n "rules-under-the-game" deep-dives/first-principles/index.html`.

## When you are ready to commit (scope it, do not sweep)

This branch has many unrelated modified files. Do NOT use `git add -A`. Stage only this work:

```
git add deep-dives/rules-under-the-game
git add index.html
git add docs/superpowers/specs/2026-06-20-rules-under-the-game-teen-planning-pack.md
git status            # confirm ONLY the above are staged
```

Also remove the stray test file before committing if it is still there:

```
rm -f rutg_test_tmp.mjs
```

Do not commit until the live QA above passes. Paste any issues back and we will fix them first.
