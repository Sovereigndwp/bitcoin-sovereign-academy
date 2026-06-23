# TOOLS-UPGRADE-QUEUE

Audit date: 2026-06-23. Ranked list of the top 10 tools that deserve a real interactive upgrade, that is, a rebuild toward choice to consequence to reflection. This is a prioritization pass only. No upgrades implemented.

Ranking weighs three things: how important the underlying Bitcoin idea is, how weak the current experience is at teaching it, and how much an upgrade would unlock relative to effort. Tools that are already Strong (Security Risk Simulator, Multisig Demo, UTXO Visualizer, Money Properties, Sat Stacking, Fee Master, Key Generator) are intentionally not here; they need cleanup, not rebuilds. Pure repairs with no pedagogy gain (em-dash sweeps, stale-data fixes alone) live in the QA report, not here.

Complexity key: small = copy + one interaction, days. medium = new state model + consequence rendering, ~1 to 2 weeks. large = new data integration or simulation engine.

---

## 1. Bitcoin vs Banking
URL: /interactive-demos/bitcoin-vs-banking/ · current classification: Needs repair · complexity: medium

- **Why it matters:** It is a beginner-facing, homepage-adjacent comparison and often a learner's first framing of "why Bitcoin." It shapes whether the whole platform reads as education or as a sales pitch.
- **What is weak now:** A 12-row check/cross table that scores Bitcoin ahead in roughly 9 of 12 rows, plus a calculator with a fixed ~$2.50 Bitcoin fee vs 3% + $15 + FX banking fee. It delivers a verdict instead of a question. This directly conflicts with the locked voice spec (inform, do not convince).
- **What the learner should control:** Their own priority and situation: amount, frequency, cross-border or domestic, what they value most (cost, speed, custody, reversibility, regulatory recourse).
- **What consequence should update live:** A genuine trade-off readout where banking sometimes wins (small domestic payment with chargeback protection, or a user with poor key hygiene) and Bitcoin sometimes wins (censorship resistance, cross-border, self-custody). Show "it depends," not "Bitcoin wins."
- **Misconception it should correct:** "Bitcoin is strictly better than banks." Replace with "different tools have different failure modes; the right choice depends on what you are protecting against."
- **Form:** Decision game / scenario lab.
- **Risk notes:** Must avoid financial advice and avoid the inverse strawman against banks. Keep fee figures as illustrative ranges, not fake live prices. No altcoin framing.

## 2. Supply Schedule & Halvings
URL: /interactive-demos/bitcoin-supply-schedule/ · current classification: Useful but shallow · complexity: medium

- **Why it matters:** Fixed supply is the single most important first-principles idea in Bitcoin. This tool owns it.
- **What is weak now:** A spectator chart with zoom/pan/playback and a hardcoded, already-stale "19.6M" current supply. The learner watches; they never reason.
- **What the learner should control:** A counterfactual issuance policy: let them try to "print" more, change the halving interval, or remove the cap, and run it forward.
- **What consequence should update live:** Side-by-side emission and dilution against the real 21M schedule, so the learner sees what a discretionary money supply does to holders versus a fixed one.
- **Misconception it should correct:** "21 million is an arbitrary number" and "a central issuer could just decide to be disciplined." Show why credible, enforced scarcity differs from promised scarcity.
- **Form:** Simulator (policy sandbox) plus a scarcity reflection prompt; retire the generic `data-topic="money"` for a halving-specific one.
- **Risk notes:** Keep the real schedule mathematically exact (210k-block halvings, 21M cap). Pull current supply live instead of hardcoding.

## 3. Mining Simulator
URL: /interactive-demos/mining-simulator/ · current classification: Upgrade candidate · complexity: medium to large

- **Why it matters:** Proof-of-work and the fee market are where most learners' mental models break. The SHA-256 engine here is already real, which is a strong foundation.
- **What is weak now:** The learner mostly watches the nonce iterate. Stats are hardcoded to Nov 2024 (~400 EH/s, now stale). One user-facing em dash.
- **What the learner should control:** Which transactions to include from a mempool given a block size budget, and their own hashrate share.
- **What consequence should update live:** Block reward plus fees earned, whether their block is found before a competitor's, and how difficulty responds when total hashrate changes.
- **Misconception it should correct:** "Miners get paid only the block subsidy" and "more hashrate makes blocks faster." Show fees as a real revenue line and difficulty as the regulator that holds ~10-minute spacing.
- **Form:** Simulator with an embedded fee-market mini-game.
- **Risk notes:** Fetch live difficulty (mempool.space) with a labeled fallback. Keep "real SHA-256" claim honest by explaining why browser mining is slow.

## 4. Difficulty Calculator
URL: /interactive-demos/difficulty-calculator/ · current classification: Needs repair · complexity: medium

- **Why it matters:** The difficulty adjustment is Bitcoin's self-regulating heartbeat; few tools explain it well.
- **What is weak now:** Stale Jan-2025 difficulty and hashrate are shown as if current, and a "live data..." placeholder confuses beginners. It computes payout, it does not teach the feedback loop.
- **What the learner should control:** Add or remove network hashrate and advance epochs.
- **What consequence should update live:** The resulting difficulty change and the time it takes the network to re-converge on ~10-minute blocks, plus the lag before adjustment.
- **Misconception it should correct:** "Difficulty is set by someone" and "blocks are always 10 minutes." Show it as an automatic response to hashrate over a 2016-block window.
- **Form:** Visualizer with a feedback-loop interaction.
- **Risk notes:** Replace stale snapshot with live fetch; drop the misleading fallback string. Avoid implying mining is profitable advice (omit or clearly bracket electricity cost).

## 5. DCA Time Machine
URL: /interactive-demos/bitcoin-dca-time-machine/ · current classification: Upgrade candidate · complexity: small to medium

- **Why it matters:** It already has the platform's best pedagogical mechanic (predict, then reveal) on real historical data, and it teaches behavior, not just numbers.
- **What is weak now:** The guess-reveal is used once for final value. Drawdown psychology is shown but not made consequential. Relies on a live API with thin offline messaging.
- **What the learner should control:** Not just the buy plan, but whether they would have held or sold at the marked peak-to-trough drawdowns.
- **What consequence should update live:** The realized outcome of their stated behavior versus disciplined DCA, so panic-selling shows its cost.
- **Misconception it should correct:** "I would obviously have held." Surface survivorship bias and emotional selling explicitly.
- **Form:** Scenario lab building on the existing guess-reveal.
- **Risk notes:** Strong disclaimer already present; keep "not financial advice." Preload/cache so a network failure does not strand the learner.

## 6. KYC Best Practices
URL: /interactive-demos/kyc-best-practices/ · current classification: Useful but shallow · complexity: medium

- **Why it matters:** Privacy trade-offs at the on-ramp are a genuine, consequential decision for the LATAM and privacy-conscious audience.
- **What is weak now:** The learner answers three dropdowns and reads a recommendation. No consequence, no reasoning.
- **What the learner should control:** The path they pick (KYC exchange, no-KYC P2P, hybrid) and follow-on choices about how they split and store.
- **What consequence should update live:** A traced privacy outcome, what an exchange, a chain analyst, or a data breach can see about them under each choice.
- **Misconception it should correct:** "KYC vs no-KYC is purely about convenience" and "once you are KYC'd it does not matter what you do next."
- **Form:** Decision game with a privacy-consequence trace.
- **Risk notes:** No advice to evade law; frame as informed privacy hygiene. Platform list decays fast, so keep it data-light. ES strongly wanted here.

## 7. Transaction Builder
URL: /interactive-demos/transaction-builder/ · current classification: Useful but shallow · complexity: medium

- **Why it matters:** Inputs, outputs, change, and fees are core literacy, and this tool is the place learners assemble that model.
- **What is weak now:** The learner builds with fixed demo UTXOs and a fee slider, then sees a static success summary. No consequence to the fee choice.
- **What the learner should control:** Fee rate and input selection, as now, but tied to a live or simulated mempool state.
- **What consequence should update live:** Estimated confirmation time and queue position, plus the raw transaction structure, so the fee slider has a visible payoff.
- **Misconception it should correct:** "Fee is an arbitrary tax" and "a transaction is one indivisible thing." Show fee as a bid for block space and the tx as inputs/outputs/change.
- **Form:** Simulator (build to mempool placement).
- **Risk notes:** Keep all data clearly demo; never construct or broadcast a real transaction. No real keys.

## 8. Time Chain Explorer
URL: /interactive-demos/time-chain-explorer/ · current classification: Useful but shallow · complexity: medium

- **Why it matters:** Block-time variance and the Poisson nature of mining are widely misunderstood ("blocks come every 10 minutes, exactly").
- **What is weak now:** Fully simulated stream with a stale hardcoded height; the learner cannot change anything or sync reality.
- **What the learner should control:** A "what if hashrate jumps or drops" lever, and a live-sync toggle.
- **What consequence should update live:** How the distribution and the next-block countdown shift, and why the average holds near 10 minutes only after difficulty adjusts.
- **Misconception it should correct:** "Each block takes 10 minutes." Replace with "10 minutes is the average of a memoryless process; individual blocks vary widely."
- **Form:** Visualizer with a variance experiment.
- **Risk notes:** Sync real block times via mempool.space; keep the simulation labeled when live data is unavailable.

## 9. Sovereign Vault
URL: /interactive-demos/sovereign-vault/ · current classification: Useful but shallow · complexity: medium to large

- **Why it matters:** Custody documentation and inheritance planning sit at the center of BSA's family-and-advisor identity.
- **What is weak now:** It is a metadata form that emits a resilience score by an opaque formula, and it does not teach why diversification matters. It also has two correctness issues that must be fixed in any rebuild (see risk).
- **What the learner should control:** Their setup, then a set of failure events to throw at it.
- **What consequence should update live:** A recovery stress test, "your house with the only backup burns; can your heirs still recover?", with the resilience score explained rather than asserted.
- **Misconception it should correct:** "Writing down my setup is the plan" and "one backup is enough." Show single points of failure concretely.
- **Form:** Scenario lab (custody stress test) layered onto the existing vault.
- **Risk notes:** Two real defects: the "zero-knowledge encryption" claim is inaccurate (it is client-side AES-GCM, not a zero-knowledge proof system) and must be reworded; and free-text fields could tempt a learner to paste a real seed phrase, so add validation and a hard warning. Keep everything client-side; no network send of vault contents.

## 10. Money Properties Comparison
URL: /interactive-demos/money-properties-comparison/ · current classification: Strong · complexity: small

- **Why it matters:** It already teaches the properties-of-money lens well; a light upgrade converts a strong explainer into active reasoning.
- **What is weak now:** The learner reads pre-assigned star ratings rather than forming their own judgment first.
- **What the learner should control:** Their own 1 to 5 rating of each asset on each property before any answer is shown.
- **What consequence should update live:** A reveal comparing the learner's scores against the reasoned baseline, with the gaps explained (this is the same predict-then-reveal pattern that makes the DCA tool strong).
- **Misconception it should correct:** "Good money is whatever I am used to." Force the learner to weigh scarcity, durability, divisibility, portability, verifiability, fungibility explicitly.
- **Form:** Decision/prediction game on top of the current comparison.
- **Risk notes:** Lowest-risk item on this list; it is already accurate and on-brand. Pair the upgrade with the ES version since this is a Curious-path concept.

---

## Cross-queue themes

- The strongest single lever across the queue is the **predict-then-reveal** pattern. It already exists in the DCA Time Machine and is the cheapest way to turn the shallow explainers (Money Properties, Supply Schedule, KYC) into reasoning tools.
- Three queue items (Mining, Difficulty, Time Chain, Supply Schedule) share a **live-data plus what-if** shape. A shared block/difficulty data helper (`bitcoin-data-reliable.js` already exists) would let several upgrades reuse one integration.
- Two items carry **correctness fixes that should not wait for the full upgrade**: Sovereign Vault's "zero-knowledge" overclaim and seed-entry risk, and Difficulty Calculator's stale data shown as current. These are also tracked in the QA report.
