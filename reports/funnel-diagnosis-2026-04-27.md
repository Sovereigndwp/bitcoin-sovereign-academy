# Homepage funnel diagnosis — 2026-04-27

**TL;DR:** the homepage has been silently dropping ~all CTA clicks for an unknown
period. Inline `onclick="track(...)"` handlers across `index.html` (and two
`window.trackEvent(...)` calls in JS) call functions that are not defined
anywhere — every click threw `ReferenceError`, the `<a href>` navigation
continued, and 0 events reached `/api/track`. Fixed in commit `e9ca8b1f` with
a 26-line legacy compatibility shim in `js/analytics.js`. **All prior
"funnel" data from the homepage should be considered measurement-broken,
not learner-behavior signal.**

---

## How we got here

This investigation started as a pivot away from the per-demo redesign work
(commits `82f7aef2` DCA Reality Check, `e216dab1` Stock-to-Flow). After
shipping two reframes, the question was whether to continue picking demo
#5 by intuition, or let `/api/metrics` (B4 instrumentation) drive the choice.

We pulled 30 days of data and immediately found something more important
than the next demo to redesign.

---

## Headline numbers (last 30 days, before the fix)

```
Total events:       369
page_view events:   287
Unique sessions:    190 (≈6 sessions/day)
```

**Page view distribution:**

| Category          | Views | Share |
|-------------------|------:|------:|
| Homepage          |   159 |  55%  |
| Demos (any)       |    80 |  28%  |
| Paths/modules     |    25 |   9%  |
| Other             |    22 |   8%  |
| Deep-dives        |     1 |  <1%  |

**Path/module funnel (the apparent leak):**

```
homepage page_view   →   /paths/* page_view   →   module_started
        159                      25                    5
                       (16% conversion)        (3% to module-start)
```

**Top demos by view count (30d):**

| Views | Demo |
|------:|------|
|    12 | wallet-security-workshop |
|    10 | wallet-workshop |
|     9 | (interactive-demos index) |
|     9 | bitcoin-supply-schedule |
|     5 | security-dojo-enhanced |
|     3 | emergency-fifty-scenario |
|     3 | security-risk-simulator |

**Demos redesigned earlier this thread:**

| Demo | Views (30d) |
|------|-----------:|
| `bitcoin-dca-time-machine` (under `/time-machine` legacy slug) | 2 |
| `stock-to-flow` | 0 |

---

## What the data invalidated

The pre-investigation candidate list for "demo #5" was:

1. `savings-disappear-scenario`
2. `bitcoin-vs-banking`
3. `time-preference-explorer`

**None of these appear in the top 30 by traffic.** Each got 0 views in 30d.
The wallet/security cluster (4 demos) carries 38% of all demo views; this
cluster was not on the proposed redesign list.

Lesson: the orchestration-lens audit identifies real frame issues, but
issue-severity ≠ traffic. The two are uncorrelated in this dataset.

---

## The actual leak

A direct Supabase query for each homepage-CTA event in the last 30 days:

```sql
-- via PostgREST against analytics_events
event_type=eq.funnel_step
&props->>step=eq.<step_name>
```

Results:

| Step                  | Events (30d) |
|-----------------------|-------------:|
| `hero_cta_click`      |            0 |
| `path_card_click`     |            0 |
| `demo_preview_start`  |            0 |
| `featured_card_click` |            1 |

**Out of 159 homepage views, 1 CTA click was recorded — across 4 click
trackers covering hero CTAs, 6 path cards, demo preview triggers, and
featured cards.**

That's not a "low conversion" finding. That's a measurement bug.

---

## Root cause

Two parallel tracking systems exist on the homepage:

1. **Inline `onclick` handlers** — used 21 times in `index.html`, e.g.
   ```html
   onclick="track('Path Selected',{path:'curious',ab:abVariant()})"
   ```
2. **A delegated click handler** in `js/kpi-tracking.js` that listens
   on document and routes matched clicks into `bsaAnalytics.track()`.

System (1) was broken everywhere. The global `track()` function it calls
does not exist anywhere in the codebase:

```bash
$ grep -rn "function track\|window\.track[^A-Za-z_]" js/ index.html
# only `trackDemoStart`, `trackDemoComplete`, `trackEvent` references —
# all three are also undefined. No bare `track`.
```

`abVariant()` is also referenced in the same handlers and is also
undefined. So every path-card click executed:

```
track('Path Selected', {path:'curious', ab:abVariant()})
→ ReferenceError: track is not defined
→ caught silently by the browser's onclick error handler
→ <a href="/paths/curious/"> navigates anyway
→ 0 events to /api/track
```

System (2) (`kpi-tracking.js` delegated handler) *should* still fire
`funnel_step.step=path_card_click` because it uses `target.closest('.path-card')`
and runs in addition to the inline onclick. The dispatch path uses
`fetch(..., { keepalive: true })` plus `sendBeacon` on visibility-hidden,
so events should survive navigation. **But it recorded 0 path_card_click
events in 30 days.**

The delegated handler is loaded with `defer`, registered after
`DOMContentLoaded`. It works in preview testing — a programmatic
`.click()` on a path card produced 4 cascading events. So either:

- Real navigation timing on production drops the in-memory queue
  before the next flush window can fire (the periodic timer hasn't
  hit, the visibility-hidden listener hasn't fired in time, or the
  browser is killing the page before either runs); or
- Real users genuinely aren't clicking path cards (the path cards
  exist on the homepage but maybe below the fold, or visually
  unclear as CTAs).

The 0/0/0/1 split across four CTAs strongly suggests measurement
breakage, not zero clicks. Even the most cynical click rate ≠ zero
across 159 sessions.

---

## Two equally-broken systems hid each other

For the homepage specifically, having two trackers fire on every click
provided the *appearance* of robustness ("if one breaks, the other
catches it") but actually masked the failure mode. System 1 broke
loudly (ReferenceError) but the error was swallowed by the onclick
handler. System 2 was supposed to be a backup but recorded 0 events
for reasons we don't fully understand. The combined output was
indistinguishable from "users don't click" — the worst possible
failure mode for analytics.

The lesson generalizes: **redundant trackers on the same event are
worse than a single tracker, unless the redundant one is monitored
independently.**

---

## Other dead trackers found

| File | Line | Call |
|------|------|------|
| `js/i18n.js` | 257-258 | `if (window.trackEvent) { window.trackEvent('LanguageChange', ...) }` |
| `js/onboarding-flow.js` | 950-951 | `if (window.trackEvent) { window.trackEvent('Onboarding Completed', ...) }` |

Both are guarded by `if (window.trackEvent)` so they fail safely (no
error) but produce 0 events. Now revived by the same shim.

---

## The fix (commit `e9ca8b1f`)

Added a legacy compatibility shim in `js/analytics.js`, immediately
after `window.bsaAnalytics = analytics`:

```js
function legacyTrack(eventName, properties) {
    try {
        if (window.bsaAnalytics && typeof window.bsaAnalytics.track === 'function') {
            window.bsaAnalytics.track(eventName, properties || {});
        }
    } catch (_) { /* never break user navigation on a tracking error */ }
}
if (typeof window.track !== 'function') window.track = legacyTrack;
if (typeof window.trackEvent !== 'function') window.trackEvent = legacyTrack;
if (typeof window.abVariant !== 'function') {
    window.abVariant = function () {
        try { return localStorage.getItem('bsa-ab-variant') || 'a'; }
        catch (_) { return 'a'; }
    };
}
```

**Why a shim rather than rewriting the 21 onclicks:** smallest possible
change. The shim revives all 21 call sites + 2 `trackEvent` references in
one edit. Matches the existing "don't refactor beyond what the task
requires" preference.

**Verified in preview:**
- `window.track`, `window.trackEvent`, `window.abVariant` are all
  `function` (was `undefined`).
- `abVariant()` returns `'a'` (default).
- A single path-card click via the inline-onclick path now produces
  `Path Selected` event with `{path: 'curious', ab: 'a'}` — pre-fix
  this threw `ReferenceError`.
- A real `.click()` on a different path-card produces 4 cascading
  events: `Path Selected`, `funnel_step.step=path_card_click`,
  `first_meaningful_action`, `conversion_milestone`.
- Network log shows `POST /api/track` firing (501 in local-dev because
  the static server doesn't handle POST; production routes via Vercel
  serverless function).

---

## What this unlocks

In ~1–2 weeks of real traffic, `/api/metrics?detail=1` should start
showing actual data for:

- Homepage→path conversion by path (which of the 6 paths gets clicked)
- Hero CTA click rate
- Quick-tool pill click distribution
- AB variant effect (currently always `'a'` because no harness sets
  `localStorage['bsa-ab-variant']`, but the read path is now wired)

**That data is the precondition for any future "data-driven demo
prioritization" work.** Resume the per-demo audit only after data has
accumulated.

---

## Forward-looking guardrails

**(G1) Add a CI check that scans `index.html` and other static HTML
for `onclick="<funcname>(...)"` references and verifies each
`<funcname>` is defined in a loaded JS file.** Would have caught
this years ago. Lightweight regex + grep.

**(G2) Decide whether to migrate the 21 inline onclicks to data
attributes + a single delegated handler.** Cleaner long-term, but
the shim does the same job today. Defer until either (a) the inline
events show up reliably in `/api/metrics` (then it's working — leave
it), or (b) the kpi-tracking delegated handler still records 0 events
even with the shim revived (then there's a deeper issue with the
delegated path that justifies migration).

**(G3) Treat traffic itself as a separate problem from content
quality.** With ~190 sessions/month, no demo redesign or homepage
audit will materially change absolute learner volume. The leverage
work for *reach* lives outside the codebase (distribution,
collaborations, SEO, partnerships). Worth surfacing as a separate
TASKS.md track if not already.

---

## Files touched

- `js/analytics.js` — added 26-line shim. Commit `e9ca8b1f`.

## References

- Commit: `e9ca8b1f Fix homepage tracking: revive dead window.track / trackEvent / abVariant`
- Earlier B4 instrumentation work: TASKS.md B4 (commits `a5ddca81`, `ef706f03`)
- Public metrics endpoint: `/api/metrics` (counts under 10 suppressed)
- Admin metrics endpoint: `/api/metrics?detail=1` (Bearer token required)
