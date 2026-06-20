# BSA Interactive Tools

Six reusable, framework-free choice-and-consequence widgets, extracted from the
deep dive *The Rules Under the Game* so any BSA or FSA lesson can mount them.

Each tool teaches a tradeoff: the learner makes a choice and sees a consequence.
There are no scores, no badges, no completion state, and nothing is ever asked for
or stored that could identify a learner. No em dashes appear in anything the library emits.

## Files

- `interactive-tools.js` defines the global `BSAInteractive` (no dependencies).
- `interactive-tools.css` styles the widgets, scoped under a `.bsa-int` wrapper.
- `example.html` is a runnable standalone demo (open it through the dev server).

## Quick start

```html
<link rel="stylesheet" href="/css/tokens.css">            <!-- optional: BSA color tokens -->
<link rel="stylesheet" href="/js/interactive-tools/interactive-tools.css">

<div class="bsa-int">
  <div id="my-tool"></div>
</div>

<script src="/js/interactive-tools/interactive-tools.js"></script>
<script>
  BSAInteractive.mount(document.getElementById("my-tool"), {
    tool: "incentive-machine",
    spec: { rules: [ /* ... */ ] },
    t: { /* the strings this tool uses, see below */ },
    onComplete: function () { /* reveal the lesson, log, scroll, whatever you like */ }
  });
</script>
```

The wrapper element must carry the class `bsa-int` so the stylesheet applies.
`onComplete` fires once, when the learner finishes the tool's core action. The library
never reveals or hides anything itself; the host decides what happens next.

## The mount contract

```
BSAInteractive.mount(container, { tool, spec, t, onComplete })
```

- `container` is the element to render into.
- `tool` is one of: `friday-night`, `value-swap`, `incentive-machine`, `broken-scoreboard`, `trust-map`, `rule-change-lab`.
- `spec` is the tool's data (shapes below).
- `t` is a flat object of UI strings the tool uses (keys below). You own these, so you control language and wording. Provide them in whatever language you need.
- `onComplete` is an optional callback fired once after the core action.

## Tools, their `spec`, and the string keys they use

**friday-night** budget allocator.
`spec`: `{ activities: [{id,label,cost:{money,time,battery},requires?,value_rank,sets_flags?,gained,gave_up}], consequences: [{missing_flag?|if_flag?, needs_min_battery_left?, and_no_flag?, text?, fail_text?}], base?: {money,time,battery} }`.
`t` keys: `fridayInfo, seeNight, startOver, moneyName, timeName, batteryName, minutes, batteryUnit, costsPrefix, costsNothing, inPlan, reasonMoney, reasonTime, reasonDead, reasonBattery, gained, gaveUp, gaveUpSuffix, doingNothing, showedLater, noScoreFriday`.

**value-swap** predict-then-reveal.
`spec`: `{ matrix: { objects:[{id,label}], contexts:[{id,label}], cells:{objId:{ctxId:{magnitude,note}}}, magnitude_labels:["",l1,l2,l3,l4,l5] } }`.
`t` keys: `pickObject, pickSituation, valuePredictHint, predict, reveal, readingPrefix, predictedPrefix, predictClose, predictFar, noScoreValue`.

**incentive-machine** rule selector with predict box.
`spec`: `{ rules: [{id,label,immediate,hidden_cost,benefits,pays,over_time}] }`.
`t` keys: `switchRule, predict, incentivePredict, guessPlaceholder, runRule, rightAway, hiddenCost, whoBenefits, whoPays, overTimeLabel, incentiveHint`.

**broken-scoreboard** reported vs true signal.
`spec`: `{ scenarios: [{id,label,reported_signal,true_signal,behavior,real_outcome}] }`.
`t` keys: `pickScenario, adjust, scoreboardSays, actuallyHappening, howRespond, leadsTo, scoreboardHint`.

**trust-map** multi-select comparison table.
`spec`: `{ custodians:[{id,label,answers:{questionId:text}}], questions:[{id,label}], highlight?:{custodian,question} }`. The optional `highlight` styles one honest cell (used in the deep dive to keep self-custody honest about loss).
`t` keys: `chooseHolders, compareThem, questionCol, pickTwo, trustHint`.

**rule-change-lab** two-system comparison across dimensions.
`spec`: `{ dimensions:[{id,label,system_a,system_b,tradeoff}] }`.
`t` keys: `systemA, systemB, systemADesc, systemBDesc, runComparison, tradeoffLabel, rulelabHint`.

## Accessibility

All controls are native `button` and `select` elements, reachable by keyboard, with
`aria-pressed` on toggles, `aria-live` on output regions, scoped `th` headers on the
comparison table, and focus-visible outlines from the stylesheet. The library adds no
positive `tabindex`, so tab order follows DOM order.

## Relationship to the deep dive

*The Rules Under the Game* (`/deep-dives/rules-under-the-game/`) is the first consumer.
Its engine passes its own strings and a `specFor()` slice of its data into
`BSAInteractive.mount`, and supplies its own `.rutg`-scoped stylesheet, so it does not
need `interactive-tools.css`. New lessons should use this library plus
`interactive-tools.css` rather than copying tool code.
