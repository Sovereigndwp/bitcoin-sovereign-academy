# SPEC: Bitcoin vs Banking upgrade

Status: draft for sign-off. No code written. No files modified. Nothing staged or committed.

Route (unchanged): `/interactive-demos/bitcoin-vs-banking/`
Source (unchanged location): `interactive-demos/bitcoin-vs-banking/index.html`
Audit reference: `TOOLS-INVENTORY-AUDIT.md` (item 24, Needs repair, P1) and `TOOLS-UPGRADE-QUEUE.md` (rank 1).

Goal: turn the current persuasion table into a first-principles tradeoff simulator. The learner chooses a situation, sets what they need, and sees which rail fits and what they give up to get it. The tool never declares a universal winner.

## Mount contract to preserve (do not change)

The rebuild is content-internal only. These stay exactly as they are:

- Route and directory; the page remains a single `index.html` at the same path.
- Main container `<main id="main-content" class="container">` and the `#main-content` skip-link target.
- Level switcher driven by the `?level=` URL param (`beginner` / `intermediate` / `advanced`) and the `.level-btn` / `#current-level-name` / `#level-description` elements.
- Stylesheet links: `/css/tokens.css`, `/css/brand.css`, `/css/widgets.css`, `/css/icons.css`, `/css/interactive-demos.css`, `/css/demo-shell.css`.
- Reflect widget block (`.reflect-widget`, `/js/reflect-widget.js`). Only its `data-title` copy changes; see section 8. Topic key may move from `money` to a more specific seed only if a matching `SEED_QUESTIONS` entry already exists; otherwise leave `data-topic="money"`.
- All footer infrastructure untouched: `/js/config.js`, `/js/demo-lock-subdomain.js`, `/js/subdomain-access-control.js`, `/js/icon-library.js`, `/js/navigation-context.js`, `/js/membership-gate.js`, `/js/analytics.js`, `/js/email-capture.js`, `/js/tip-cta.js`, `/js/demo-nav.js`, and the email-capture and tip-CTA placeholder divs.
- Back link to `../index.html`.

Out of scope by rule: no route, gate, membership, analytics, email, payment, or TBA changes.

---

## 1. Current problem

The existing page is a verdict, not a tool. Three things make it too persuasive and not interactive enough:

1. **The feature table pre-loads the conclusion.** Twelve rows of check / cross marks score Bitcoin ahead in roughly nine of twelve. Bank-only strengths (chargebacks, FDIC insurance, support) are shown as crosses against Bitcoin rather than as legitimate reasons a learner might choose a bank. The learner reads a scoreboard someone else filled in.
2. **The only interactive piece is a remittance calculator rigged to one answer.** It hardcodes a flat `$2.50` Bitcoin fee against a `3% + $15 + 3% FX` bank cost and always prints "Savings with Bitcoin." There is no situation in which the bank comes out ahead, so the interaction teaches nothing the table did not already assert.
3. **No situation, no tradeoff, no reflection.** The learner never states what they are trying to do, so they never discover that the right rail depends on the goal. This conflicts directly with the locked voice spec (inform, do not convince) on a page beginners often meet early.

The result reads as advocacy. It also leans on a fixed fee figure presented as if current, which is the kind of unlabeled claim the brand rules forbid.

## 2. Learning goal

After using the upgraded tool, a beginner should be able to say, in their own words:

- Different money rails are good at different things. None is best at everything.
- Bitcoin is strongest for final settlement, holding your own keys, resisting censorship, predictable issuance, borderless transfer, and long-horizon sovereignty.
- Banks and cards are strongest for reversible payments, familiar everyday use, short-term convenience, credit, payroll, and a regulated dispute process.
- Choosing a rail means accepting a tradeoff. The honest question is not "which is better" but "which fits this situation, and what am I giving up."

## 3. Core learner question

> "Which rail fits this situation best, and what tradeoff am I accepting?"

This sentence is shown near the top of the tool and framed as the thing the tool helps answer. It replaces the current "The Best Approach?" conclusion block.

## 4. Interactive model

The learner describes one situation at a time using ten inputs. Each input is a plain control with a short label and a one-line helper. Inputs are grouped so the form does not feel long.

Group A, the transfer:
1. **Amount** (number, illustrative units, default 1000). Helper: "Roughly how much, in your local currency."
2. **Domestic vs cross-border** (toggle: Same country / Across borders).
3. **Urgency** (3-step: Can wait days / Within a day / Right now).
4. **Time horizon** (3-step: Spend soon / Hold months / Hold years). Frames whether this is a payment or savings.

Group B, what you need:
5. **Need for reversibility** (3-step: Not important / Nice to have / Essential). "Can a mistaken or disputed payment be undone."
6. **Need for self-custody** (3-step: Not important / Nice to have / Essential). "Do you want to hold the keys yourself, with no one able to freeze it."
7. **Privacy sensitivity** (3-step: Low / Medium / High). "How much you want to limit what third parties can see."
8. **Counterparty trust** (3-step: I trust the institutions involved / Mixed / I do not trust them). "How much you trust the bank, exchange, or custodian in this situation."
9. **Political or banking risk** (3-step: Low / Medium / High). "Risk of account freezes, capital controls, or an unstable local banking system."
10. **Technical comfort** (3-step: New to this / Some experience / Very comfortable). "How comfortable you are managing keys and backups."

All inputs have sensible defaults so the tool shows a coherent result on first load with zero clicks. Changing any input recomputes outputs live (no submit button). Inputs map cleanly to the EN/ES key table in section 8.

Level switcher behavior:
- Beginner: shows inputs 1, 2, 3, 6 and a simplified result. Hides privacy, counterparty trust, political risk, time-horizon nuance.
- Intermediate: all ten inputs, full scorecards.
- Advanced: all ten inputs plus the per-dimension capability matrix (section 7) shown openly so the learner can inspect the reasoning.

## 5. Outputs

Everything below updates live on input change.

1. **Suggested fit by situation, not a universal winner.** A short ranked list of the three rails for this situation, each labeled with a qualitative band: **Strong fit**, **Workable**, or **Poor fit**. Ties are allowed and expected. The header reads, for example, "For this situation: Bitcoin self-custody is a strong fit; a bank or card is workable." Never "Bitcoin wins."
2. **Tradeoff scorecards**, one card per rail. Each card lists the learner's stated priorities and marks, per priority, whether the rail satisfies it (met / partial / not met), using the transparent matrix. The card shows "meets N of your M priorities" with the list visible. No hidden percentage.
3. **Explanation sentence**, one calm sentence per rail explaining the fit in plain language, generated from which priorities were met or missed. Example: "A bank fits because you need reversibility and fast familiar support, but it cannot give you self-custody or protect against account freezes."
4. **Risk flags**, zero or more short warnings triggered by the situation. Examples: high political risk plus bank rail flags "Accounts can be frozen under capital controls." Self-custody plus low technical comfort flags "Holding your own keys means no one can recover them for you." Essential reversibility plus any Bitcoin rail flags "On-chain payments cannot be charged back."
5. **What you gain** and **What you give up**, two short lists for the top-fit rail, phrased as accepted tradeoffs rather than wins and losses.

No output ever shows a fabricated live price or live fee. Any monetary illustration is labeled "illustrative" (section 9).

## 6. Rails compared

V1 compares exactly three rails, no more:

1. **Bank or card rail.** Checking account, debit, credit card, wire, ACH, card networks.
2. **Bitcoin, self-custody.** The learner holds the keys. On-chain or Lightning from a wallet they control.
3. **Bitcoin, with a service provider.** A custodial exchange or payment app holds keys on the learner's behalf. This is the honest middle: easier and with some recourse, but custodial and more exposed to freezes and KYC.

These three match the tool title and the learning goal, and keep the first rebuild focused. No altcoins. No "crypto" framing anywhere. The word is Bitcoin.

**Future extension (not in v1):** a fourth rail, **cash**, could be added later to teach the privacy and in-person settlement tradeoff (strong for local privacy and in-person finality, useless across borders, exposed to physical loss and inflation). It is intentionally out of v1 so the first implementation stays scoped to the three rails above. The capability matrix and scoring in this spec are written for three rails; adding cash later means adding one matrix column and one rail card, with no change to the input model.

## 7. Scoring logic

Simple, additive, and fully inspectable. No machine-learning, no opaque weights, no false precision.

**Step 1, a fixed capability matrix.** Each rail has a known capability on each dimension: `full`, `partial`, or `none`. This is editorial and honest, and at advanced level it is shown to the learner verbatim. V1 matrix (three rails):

| Dimension | Bank / card | BTC self-custody | BTC w/ provider |
|-----------|-------------|------------------|-----------------|
| Reversibility / chargebacks | full | none | partial |
| Familiar everyday UX | full | partial | full |
| Short-term convenience | full | partial | full |
| Settlement finality | partial | full | partial |
| Self-custody (you hold keys) | none | full | none |
| Censorship resistance | none | full | partial |
| Borderless transfer | partial | full | full |
| Predictable monetary policy | none | full | full |
| Privacy from third parties | none | partial | none |
| Regulated recourse / support | full | none | partial |
| Low cost across borders | partial | full | full |

(A future cash column would slot in here without changing any other rule.)

**Step 2, learner priorities select the dimensions that count.** The ten inputs turn specific dimensions on or off and set their importance to "matters" or "essential":
- Need for reversibility -> Reversibility dimension.
- Need for self-custody -> Self-custody, and raises Censorship resistance and Settlement finality.
- Privacy sensitivity -> Privacy dimension.
- Political or banking risk -> Censorship resistance and Self-custody.
- Counterparty trust low -> raises Self-custody and Settlement finality, lowers value of provider and bank recourse.
- Cross-border -> Borderless transfer and Low cost across borders.
- Urgency high -> weights Short-term convenience and Settlement-speed reading.
- Time horizon years -> Predictable monetary policy.
- Time horizon spend soon -> Familiar UX, Short-term convenience.
- Technical comfort low -> penalizes rails whose self-custody dimension is `full` unless the learner marked self-custody essential (then it becomes a risk flag, not a silent penalty).

**Step 3, fit per rail.** For each rail, count how many of the learner's active priorities it meets. `full` meets the priority, `partial` half-meets (counts toward "partial" display, not a full point), `none` misses. The displayed number is "meets N of your M priorities," with the per-priority list shown. Bands derive from the ratio with named thresholds, stated in the UI:
- Strong fit: meets all or all-but-one essential priority and the majority of the rest.
- Workable: meets the essentials but misses several nice-to-haves, or meets most with one essential only partially.
- Poor fit: misses one or more essential priorities.

**Transparency rules:**
- No decimal scores. No "92% vs 48%." If a numeric appears it is an integer count of the learner's own priorities ("3 of 5"), with the list visible.
- The bands and thresholds are written on the page (intermediate and advanced).
- The full matrix is viewable at advanced level so a curious learner can audit every judgment.
- Editorial honesty check: the matrix must keep at least one dimension where the bank rail is the sole `full` (Reversibility, Regulated recourse) so the bank genuinely wins some situations.

## 8. Copy rules

Calm, honest, specific. No hype. No em dashes (use comma, colon, parentheses, or period). No "banks are evil." No "Bitcoin solves everything." Bitcoin-positive means showing Bitcoin's real strengths plainly, not stacking the deck.

EN and ES must reach parity: every visible string has both. Below is the seed string set with paired keys. Implementation should keep these in a single in-file dictionary keyed by language, mirroring how other bilingual demos store copy, so a parity test can diff the key sets.

| key | EN | ES |
|-----|----|----|
| `title` | Bitcoin and banking: which rail fits? | Bitcoin y banca: ¿qué vía encaja? |
| `subtitle` | Pick a situation. See which rail fits and what you give up to get it. | Elige una situación. Mira qué vía encaja y qué cedes a cambio. |
| `core_question` | Which rail fits this situation best, and what tradeoff am I accepting? | ¿Qué vía encaja mejor en esta situación y qué compensación estoy aceptando? |
| `input_amount` | Amount | Monto |
| `input_scope` | Same country or across borders? | ¿Mismo país o entre países? |
| `input_urgency` | How soon does it need to arrive? | ¿Qué tan pronto debe llegar? |
| `input_horizon` | Spend soon or hold for the long term? | ¿Gastar pronto o guardar a largo plazo? |
| `input_reversibility` | How much do you need to undo a payment? | ¿Cuánto necesitas poder revertir un pago? |
| `input_selfcustody` | How much do you want to hold the keys yourself? | ¿Cuánto quieres custodiar tú mismo las llaves? |
| `input_privacy` | How private does this need to be? | ¿Qué tan privado necesita ser esto? |
| `input_trust` | How much do you trust the institutions involved? | ¿Cuánto confías en las instituciones involucradas? |
| `input_polrisk` | Risk of account freezes or capital controls? | ¿Riesgo de congelamiento de cuentas o controles de capital? |
| `input_techcomfort` | How comfortable are you managing keys and backups? | ¿Qué tan cómodo te sientes gestionando llaves y respaldos? |
| `rail_bank` | Bank or card | Banco o tarjeta |
| `rail_btc_self` | Bitcoin, self-custody | Bitcoin, autocustodia |
| `rail_btc_provider` | Bitcoin, with a service provider | Bitcoin, con un proveedor de servicio |
| `rail_cash` | Cash | Efectivo |
| `band_strong` | Strong fit | Encaja bien |
| `band_workable` | Workable | Funcional |
| `band_poor` | Poor fit | Encaja mal |
| `gain_label` | What you gain | Lo que ganas |
| `give_up_label` | What you give up | Lo que cedes |
| `meets_count` | Meets {n} of your {m} priorities | Cumple {n} de tus {m} prioridades |
| `flag_freeze` | Accounts on this rail can be frozen under capital controls. | Las cuentas en esta vía pueden congelarse bajo controles de capital. |
| `flag_no_recovery` | Holding your own keys means no one can recover them for you. | Custodiar tus llaves significa que nadie puede recuperarlas por ti. |
| `flag_no_chargeback` | On-chain payments cannot be charged back if something goes wrong. | Los pagos en cadena no se pueden revertir si algo sale mal. |
| `illustrative_note` | Figures are illustrative, for learning only, not current prices or fees. | Las cifras son ilustrativas, solo para aprender, no son precios ni comisiones actuales. |
| `no_winner_note` | There is no single best rail. The right choice depends on your situation. | No hay una sola vía mejor. La elección correcta depende de tu situación. |
| `reflect_title` | Reflect: when would you choose a different rail? | Reflexiona: ¿cuándo elegirías otra vía? |

Sample generated explanation sentences (templates, both languages):
- EN bank, strong: "A bank or card fits here because you need reversibility and familiar everyday use. You give up self-custody and protection from account freezes."
- ES bank, strong: "Un banco o tarjeta encaja aquí porque necesitas reversibilidad y uso cotidiano familiar. Cedes la autocustodia y la protección frente a congelamientos de cuenta."
- EN self-custody, strong: "Bitcoin self-custody fits here because you want to hold the keys and resist censorship across borders. You give up chargebacks and a support line."
- ES self-custody, strong: "La autocustodia de Bitcoin encaja aquí porque quieres tener las llaves y resistir la censura entre países. Cedes las devoluciones de cargo y una línea de soporte."

Tone guardrails baked into copy review:
- Every rail must have at least one genuinely positive sentence somewhere in the experience.
- The bank rail is described as a reasonable choice for its strengths, never mocked.
- Bitcoin self-custody names its real costs (no recovery, no chargeback, learning curve) without softening.

## 9. Safety boundaries

- **No financial advice.** The tool describes tradeoffs, never tells the learner what to do with money. No "you should," no allocation suggestions.
- **No universal winner.** The UI must be capable of ranking the bank rail first, and the test plan asserts at least one input combination where it does.
- **No real fee or price claims.** Any monetary illustration carries the `illustrative_note` string and uses round, clearly fake example figures. No live price or fee fetch (the tool makes no network calls; see section 10).
- **No custody instructions that move funds.** The tool never tells the user to send, withdraw, or transfer anything. It is a thinking aid, not a wallet.
- **No seed phrase or private key fields.** No input anywhere accepts a key, seed, address, or credential.
- **No TBA promotion.** Collaborative security is not the subject here. Do not insert TBA. The existing boundary-note convention elsewhere does not apply to this page.
- **Bitcoin-positive but honest.** Strengths shown where real; weaknesses named where real.

## 10. Test plan

Add a Node `node:test` + `jsdom` test file under `tests/` (for example `tests/interactive-tools.bitcoin-vs-banking.test.mjs`), matching the existing test style. No live server required for the logic tests. Cases:

1. **Tool mounts.** The page parses, `#main-content` exists, the inputs and three rail cards render, and no script throws during load under jsdom.
2. **Inputs update outputs.** Changing each input changes the computed fit for at least one rail. Specifically assert: setting reversibility to Essential makes the bank rail rank at least as high as both Bitcoin rails; setting political risk to High with self-custody Essential makes Bitcoin self-custody a Strong fit and triggers the freeze flag on the bank rail.
3. **No universal winner.** Assert at least one input set where the bank rail is the top fit, and at least one where Bitcoin self-custody is the top fit. This guards against regressing into a persuasion table.
4. **EN/ES key parity.** The EN and ES dictionaries have identical key sets (no key present in one and missing in the other). Fail on any asymmetry.
5. **No em dashes.** Scan the rendered strings and the source file for U+2014; assert zero. (En dashes in numeric ranges allowed.)
6. **No NaN / Infinity.** For a grid of input combinations (including amount 0, amount very large, empty amount), every numeric output is finite and every band is one of the three allowed values. No "NaN" or "Infinity" string reaches the DOM.
7. **Mobile layout.** Manual or jsdom-assisted check that at <=360px and <=968px the input groups and rail cards reflow to a single column and nothing overflows horizontally. Reuse the existing media-query breakpoints.
8. **No external API.** Assert the source contains no `fetch`, `XMLHttpRequest`, `WebSocket`, or external `src` beyond the already-approved shared scripts. The tool computes entirely client-side.
9. **No hidden route or gate changes.** Assert the preserved mount-contract scripts and links (section "Mount contract") are still present and unchanged in count and path, and that no gate, analytics, email, or payment script was added or removed.

Lightweight manual QA before merge: live preview console sweep (zero errors), keyboard-only pass (all inputs reachable, focus visible), and a screenshot at mobile and desktop widths for the sign-off thread.

## 11. Upgrade decision

**Recommendation: full interactive rebuild** of the page body, within the preserved mount contract.

Rationale: the core defect is structural, not cosmetic. The persuasion comes from the feature table and the rigged calculator, which are the page's main content. A small cleanup (softening copy, relabeling the fee as illustrative) would leave the verdict-shaped experience intact and still fail the voice spec. A medium rebuild that kept the table would keep fighting the table. The honest, on-brand version is a different artifact: a situation-driven tradeoff simulator. The rebuild is bounded and low-risk because it touches only the content inside `#main-content`, adds no network calls, and changes no routes, gates, analytics, email, payment, or TBA wiring. Estimated size: medium effort in calendar terms (new state model plus transparent scorecard rendering plus EN/ES dictionary and tests), but a full conceptual rebuild of the learner experience.

Next step after sign-off: write the implementation plan (component structure, the input-to-dimension mapping table as code, the EN/ES dictionary, and the test file), then build behind the existing route. Do not start coding until this spec is approved.
