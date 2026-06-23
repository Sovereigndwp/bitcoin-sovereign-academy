# TOOLS-BRAINSTORMING-PASS

Brainstorming pass on the learner experience for every P1 and P2 tool. Input: `TOOLS-INVENTORY-AUDIT.md`, `TOOLS-UPGRADE-QUEUE.md`, `TOOLS-QA-REPORT.md`. No code written, no files modified, nothing staged.

Lens applied to each tool: Understandability (clear in 10 seconds), Usability (desktop and mobile), Relatability (connects to a felt situation), Learning outcome (clearer mental model, not click-through), First-principles (reason from scarcity, tradeoffs, incentives, trust, custody, verification, time, risk, rules).

Voice rules honored throughout: Bitcoin-positive but honest, Bitcoin does not win every situation, no altcoin framing, no investment advice, no real-time data unless justified, no field that could lead a learner to paste a seed phrase, no em dashes, EN/ES parity considered from the start, calm and concrete.

Effort key: cleanup = copy and small UI, days. medium = new state model or consequence rendering, ~1 to 2 weeks. full rebuild = new experience or data integration.

---

# P1 tools

## 1. Bitcoin vs Banking (P1)
URL: /interactive-demos/bitcoin-vs-banking/ . A full design spec already exists at `SPEC-bitcoin-vs-banking-upgrade.md`; this block is a summary so the set is complete.

- Current learner confusion: The check-vs-cross table looks like a settled scoreboard, so a beginner does not learn to reason, they just absorb a verdict.
- Best first-principles question: "Which rail fits this situation best, and what tradeoff am I accepting?"
- Learner should control: amount, domestic vs cross-border, urgency, reversibility need, self-custody need, privacy, counterparty trust, political risk, time horizon, technical comfort.
- Should change live: a fit ranking (Strong fit, Workable, Poor fit) per rail, tradeoff scorecards, an honest explanation sentence, risk flags, what you gain, what you give up.
- Misconception to correct: "Bitcoin is strictly better than a bank." Replace with "different rails have different failure modes; the right one depends on what you are protecting against."
- Relatable scenario: sending money to family across a border quickly, versus buying coffee with a card you can dispute.
- Better title: "Bitcoin and banking: which rail fits?"
- Better opening sentence: "Pick a situation. See which rail fits and what you give up to get it."
- Cleanup idea: relabel the fixed fee as illustrative and soften the table copy.
- Medium upgrade idea: replace the rigged calculator with a situation form that can rank a bank first.
- Full rebuild idea: the situation-driven tradeoff simulator in the spec.
- Recommendation: full rebuild (per spec).

## 2. Sovereign Vault (P1)
URL: /interactive-demos/sovereign-vault/

- Current learner confusion: It looks like it might be a wallet, and a free-text field can tempt a learner to type a real seed location or phrase. The "zero-knowledge encryption" label also overstates what the tool does.
- Best first-principles question: "If you disappeared today, could the people you trust actually recover your bitcoin?"
- Learner should control: their documented setup (wallets, backups, heirs), then a set of failure events thrown at it.
- Should change live: a recovery outcome and a resilience reading that is explained factor by factor, not asserted.
- Misconception to correct: "Writing my setup down is the plan" and "one backup is enough."
- Relatable scenario: the only paper backup is in a drawer at home, and there is a house fire while you are traveling.
- Better title: "Could your family recover your bitcoin?"
- Better opening sentence: "Map your setup, then watch what happens when one piece fails."
- Cleanup idea (do first, safety and accuracy): reword "zero-knowledge" to "client-side encrypted," add input validation and a clear warning so no real seed is ever entered.
- Medium upgrade idea: a recovery stress test (fire, lost device, sudden death) that shows single points of failure.
- Full rebuild idea: a custody scenario lab where the resilience score is the visible sum of survived failures.
- Recommendation: medium upgrade, but ship the safety and wording cleanup immediately regardless of the larger rebuild timeline.

## 3. Difficulty Calculator (P1)
URL: /interactive-demos/difficulty-calculator/

- Current learner confusion: It shows Jan-2025 numbers as if current and a "live data..." placeholder that never resolves, so a beginner cannot tell what is real, and the payout math hides the actual lesson.
- Best first-principles question: "If more miners join and blocks would come faster, how does Bitcoin keep them near 10 minutes?"
- Learner should control: add or remove network hashrate, then advance time.
- Should change live: the difficulty response and how long the network takes to settle back toward 10-minute blocks.
- Misconception to correct: "Someone sets the difficulty" and "blocks are always 10 minutes."
- Relatable scenario: after a price rise many new miners switch on; blocks speed up for a while, then the network corrects.
- Better title: "Why Bitcoin blocks stay near 10 minutes."
- Better opening sentence: "Add miners and watch the network defend its rhythm."
- Cleanup idea: fetch current difficulty with a clearly labeled fallback, and remove the misleading placeholder string.
- Medium upgrade idea: a feedback-loop visual where the learner moves hashrate and sees the 2016-block adjustment respond.
- Full rebuild idea: not needed; the medium upgrade carries the idea.
- Recommendation: medium upgrade (with the stale-data cleanup folded in).

## 4. UTXO Visualizer (P1)
URL: /interactive-demos/utxo-visualizer-enhanced/

- Current learner confusion: A beginner does not know what a UTXO is or why a wallet is not just one balance, and the privacy score moves without explaining why.
- Best first-principles question: "Your wallet is not one balance, it is a pile of separate coins. Which ones do you spend, and what does that reveal?"
- Learner should control: which coins to combine to make a payment.
- Should change live: fee, change created, and a privacy reading that shows the actual reason (combining coins from different sources links them).
- Misconception to correct: "A wallet is a single balance like a bank account."
- Relatable scenario: paying rent from a wallet holding many small gift amounts, deciding whether to combine them.
- Better title: keep "UTXO Visualizer," add a plain subtitle: "How your wallet really holds coins."
- Better opening sentence: "Your balance is really many separate coins. Pick which to spend."
- Cleanup idea: surface the privacy calculation inline instead of an unexplained bar.
- Medium upgrade idea: add short "why" annotations to each consequence (fee, change, privacy) as the learner selects coins.
- Full rebuild idea: a consequence-narrated scenario set where each choice explains its tradeoff aloud.
- Recommendation: medium upgrade (surface the reasoning; the interaction is already strong).

## 5. Address Format Explorer (P1)
URL: /interactive-demos/address-format-explorer/

- Current learner confusion: It is unclear why there are four address types, and whether the generated addresses are real (they are intentionally fake, but weakly labeled, which is a safety gap).
- Best first-principles question: "Same keys, different envelopes. Why does the format change the fee and what can receive it?"
- Learner should control: pick a format, see its fee and compatibility tradeoff.
- Should change live: fee comparison and a plain "which to use and why" readout.
- Misconception to correct: "There is one real Bitcoin address type" or "the format is random."
- Relatable scenario: your wallet shows a bc1 address, but a sender's older service only lets them paste an address starting with 1.
- Better title: "Bitcoin address formats: same keys, different envelopes."
- Better opening sentence: "These are demo addresses for learning. See why the format changes the fee."
- Cleanup idea (safety): a prominent "demo addresses, do not fund" banner near the generator.
- Medium upgrade idea: a short "which format should I use" decision with reasons.
- Full rebuild idea: not needed.
- Recommendation: cleanup (safety label first), then the small decision add.

## 6. Security Risk Simulator (P1)
URL: /interactive-demos/security-risk-simulator.html

- Current learner confusion: Little; it is already strong. The main gap is no Spanish for a high-value tool.
- Best first-principles question: "Every security choice trades convenience for control. What are you actually optimizing for, and against which threat?"
- Learner should control: storage method, backup strategy, and operational habits, as now.
- Should change live: the risk profile, as now, with outcomes that distinguish a spending stash from life savings.
- Misconception to correct: "More security is always better" and "one setup fits everyone."
- Relatable scenario: protecting a small everyday amount versus protecting a decade of savings calls for different setups.
- Better title: keep it.
- Better opening sentence: "Make security choices and see the risk you are accepting."
- Cleanup idea: minor copy polish only.
- Medium upgrade idea: Spanish localization, plus a few more granular outcome combinations (for example multisig paired with a weak backup).
- Full rebuild idea: not warranted.
- Recommendation: medium upgrade (primarily EN/ES parity).

## 7. Multisig Security Demo (P1)
URL: /multisig-security-demo.html

- Current learner confusion: Multisig is abstract, and the page carries 14 em dashes. The collaborative-security framing is already correct and should be preserved.
- Best first-principles question: "If a single key can be stolen, why trust a single key? What changes when no one key can move funds alone?"
- Learner should control: experience level and which attack to launch.
- Should change live: whether the attack drains funds, with the single-key and 2-of-3 outcomes side by side.
- Misconception to correct: "Multisig is only for experts" and "sharing key duties means giving up custody." (You still self-custody; no single party can move funds alone.)
- Relatable scenario: a laptop catches malware; a single-key wallet is emptied, a 2-of-3 setup is not.
- Better title: keep it.
- Better opening sentence: "Launch a real attack and see which setup survives it."
- Cleanup idea: remove the em dashes; keep the framing.
- Medium upgrade idea: optional, a short "build your own quorum" step.
- Full rebuild idea: not needed.
- Recommendation: cleanup.

## 8. Security Training Lab, Dojo (P1)
URL: /interactive-demos/security-dojo-enhanced/

- Current learner confusion: The security score appears without explaining how it was reached, so the learner cannot act on it.
- Best first-principles question: "Where is your setup actually weakest right now?"
- Learner should control: the assessment answers (wallet type, backup method, recovery testing, phishing response).
- Should change live: the score, broken down into the choices that moved it.
- Misconception to correct: "Owning a hardware wallet means I am safe," when an untested recovery is the real risk.
- Relatable scenario: someone confident in their hardware wallet who has never checked that the backup actually restores.
- Better title: keep it.
- Better opening sentence: "Answer a few questions and find your weakest link."
- Cleanup idea: show the score breakdown in the results.
- Medium upgrade idea: route each weak answer to the matching training station automatically.
- Full rebuild idea: not needed.
- Recommendation: cleanup (score transparency), then the small routing add.

## 9. Emergency Kit (P1)
URL: /emergency-kit.html

- Current learner confusion: Thirteen scenarios at once can overwhelm a panicking beginner, and the page carries 10 user-facing em dashes.
- Best first-principles question: "What exactly went wrong, and is the money lost or only stuck?"
- Learner should control: which emergency they are facing, answered in plain words.
- Should change live: a calm, targeted set of steps for that one situation, instead of the full menu.
- Misconception to correct: "A stuck transaction means my money is gone."
- Relatable scenario: a payment sent with too low a fee that has been pending for hours while the learner refreshes anxiously.
- Better title: keep "Bitcoin Emergency Kit."
- Better opening sentence: "Tell us what happened. We will walk you through it calmly."
- Cleanup idea: remove the em dashes and add a one-line reassurance at the top of each branch.
- Medium upgrade idea: a two-question triage that routes to the right branch (lost access vs stuck payment vs suspected scam).
- Full rebuild idea: not needed; this is already a strong reference.
- Recommendation: cleanup (it is Strong; the P1 is the em dashes and a light triage).

---

# P2 tools

## 10. On-Ramp Chooser (P2)
URL: /interactive-demos/onramp-chooser/

- Current learner confusion: Little; it is already strong. Fee and method data are hardcoded (Dec 2025) and there is no Spanish for a LATAM-critical tool.
- Best first-principles question: "Every way to buy trades off privacy, speed, cost, and who holds the coins. Which of those matters most to you?"
- Learner should control: country, amount, KYC tolerance, speed, payment method.
- Should change live: a ranked shortlist with the tradeoff each option carries.
- Misconception to correct: "All the ways to buy are basically the same."
- Relatable scenario: a first-time buyer in Colombia weighing a large exchange against a peer-to-peer option.
- Better title: keep it.
- Better opening sentence: "Answer a few questions and see which way to buy fits you."
- Cleanup idea: schedule a quarterly data refresh and label the "as of" date.
- Medium upgrade idea: Spanish localization (high value for the audience).
- Full rebuild idea: not needed.
- Recommendation: cleanup plus EN/ES (medium).

## 11. DCA Time Machine (P2)
URL: /interactive-demos/bitcoin-dca-time-machine/

- Current learner confusion: Little; it is the strongest tool. The guess-reveal mechanic is used once and the behavior question is left on the table. Network failure can leave it blank.
- Best first-principles question: "Could you have actually held through a fall of more than half?"
- Learner should control: the buying plan, and what they say they would have done at the marked drawdowns.
- Should change live: the realized outcome of their stated behavior versus disciplined buying.
- Misconception to correct: "I would obviously have held."
- Relatable scenario: someone who started buying at a peak and watched the value fall hard the next year.
- Better title: keep it.
- Better opening sentence: keep the reality-check framing.
- Cleanup idea: a clear offline and retry message so a failed fetch never strands the learner.
- Medium upgrade idea: add the behavioral hold-or-sell loop on top of the existing guess-reveal.
- Full rebuild idea: not needed.
- Recommendation: medium upgrade. (No investment advice: frame it as behavior and history, not a recommendation to buy.)

## 12. KYC Best Practices (P2)
URL: /interactive-demos/kyc-best-practices/

- Current learner confusion: It hands a recommendation without showing any consequence, so the learner does not reason.
- Best first-principles question: "Once a company links your name to your coins, what can it, or a future data leak, see about you?"
- Learner should control: the path they pick (KYC exchange, peer-to-peer, hybrid) and what they do after buying.
- Should change live: a privacy trace of what each party can see under each choice.
- Misconception to correct: "KYC is just paperwork with no lasting effect."
- Relatable scenario: buying on a verified exchange, then sending to a friend, and seeing what the exchange can now link.
- Better title: "What buying choices reveal about you."
- Better opening sentence: "Pick how you buy and see who learns what."
- Cleanup idea: copy polish and an "as of" date on the platform notes.
- Medium upgrade idea: the privacy consequence trace.
- Full rebuild idea: a decision game over privacy hygiene.
- Recommendation: medium upgrade. (No advice to evade law; frame as informed privacy, not avoidance.)

## 13. Transaction Builder (P2)
URL: /interactive-demos/transaction-builder/

- Current learner confusion: It builds a transaction but shows no consequence for the fee choice, and "change" is unexplained.
- Best first-principles question: "A payment is not one number. Where do the leftover coins go, and what does the fee actually buy you?"
- Learner should control: which inputs to use, the outputs, and the fee rate.
- Should change live: an estimated confirmation time and queue position, plus where the change goes, plus an optional raw view.
- Misconception to correct: "The fee is an arbitrary tax" and "leftover money is lost."
- Relatable scenario: paying for something small and getting change back to your own wallet, like cash.
- Better title: keep it.
- Better opening sentence: "Assemble a payment and see what your fee buys."
- Cleanup idea: label change clearly and explain it in one line.
- Medium upgrade idea: tie the fee slider to a simulated mempool placement and confirmation estimate.
- Full rebuild idea: a build-to-mempool simulator.
- Recommendation: medium upgrade. (All data stays demo; never construct or broadcast a real transaction, no real keys.)

## 14. Advisor Readiness Kit, preview (P2)
URL: /institutional/wealth-advisors/kit/

- Current learner confusion: It reads as a sales catalog, not a tool, and carries 4 em dashes. Audience is professionals, so ES parity is a lower priority than for consumer tools.
- Best first-principles question (advisor-facing): "What do you need to ask a client before their bitcoin becomes your responsibility?"
- Learner should control: little today; it is a landing page that links two free tools.
- Should change live: not applicable in its current form.
- Misconception to correct: "An advisor can ignore a client's bitcoin."
- Relatable scenario: an advisor whose client just inherited bitcoin and has no plan for it.
- Better title: keep it.
- Better opening sentence: "Two free tools to help you serve clients who own bitcoin."
- Cleanup idea: remove the em dashes and surface the free Seed-Phrase Red-Flag tool in the hero.
- Medium upgrade idea: make the client-discovery questionnaire interactive on the page rather than a download.
- Full rebuild idea: not warranted.
- Recommendation: cleanup. (Keep the TBA boundary note; do not turn the kit into a TBA upsell.)

## 15. Wallet Security Workshop (P2)
URL: /interactive-demos/wallet-security-workshop/

- Current learner confusion: The passphrase field reads as if it might want a real passphrase, which is a safety ambiguity even though it is client-side only.
- Best first-principles question: "Your seed phrase is your wallet. What happens to it changes everything about who can spend."
- Learner should control: generating a demo seed with real randomness, then practicing a backup drill.
- Should change live: backup verification feedback (did you record it correctly).
- Misconception to correct: "The app holds my coins," and the idea that you should type a real passphrase anywhere.
- Relatable scenario: practicing the backup and recovery drill before ever funding a real wallet.
- Better title: keep it.
- Better opening sentence: "Practice the riskiest part of self-custody with nothing at stake."
- Cleanup idea (safety): relabel the passphrase field as "demo only, not saved" or add a banner.
- Medium upgrade idea: a short "what could go wrong with this backup" prompt after the drill.
- Full rebuild idea: not needed.
- Recommendation: cleanup (safety label first).

## 16. Bitcoin Key Generator Visual (P2)
URL: /interactive-demos/bitcoin-key-generator-visual/

- Current learner confusion: Strong tool, but jargon like "point at infinity" appears unexplained, there are 13 em dashes in the JS, and the curve canvas is not tuned for mobile.
- Best first-principles question: "How does pure randomness become an address that only you can spend from?"
- Learner should control: flipping entropy bits and watching the cascade.
- Should change live: the full pipeline from bits to key to address updating as bits change.
- Misconception to correct: "Keys are assigned by someone," or "two people could get the same key."
- Relatable scenario: understanding why a 12-word phrase is effectively impossible to guess.
- Better title: keep it.
- Better opening sentence: "Flip a few bits and watch randomness become your address."
- Cleanup idea: remove em dashes, add a one-line tooltip for jargon, and a mobile pass for the canvas.
- Medium upgrade idea: an optional "how unguessable is this" scale to make the size of the keyspace felt.
- Full rebuild idea: not needed.
- Recommendation: cleanup.

## 17. Testnet Practice Guide (P2)
URL: /interactive-demos/testnet-practice-guide/

- Current learner confusion: It is a reading checklist that sends the learner to external tools, so they read more than they do.
- Best first-principles question: "What if you could make every beginner mistake with zero money at risk?"
- Learner should control: today, only a level toggle; ideally an embedded practice step.
- Should change live: little today.
- Misconception to correct: "Practicing with Bitcoin means risking real money."
- Relatable scenario: a nervous first send, done first on testnet where a mistake costs nothing.
- Better title: "Practice Bitcoin with zero money at risk."
- Better opening sentence: "Make your first mistakes where they cost nothing."
- Cleanup idea: tighten the steps and clarify which testnet to use.
- Medium upgrade idea: embed a small sandbox or a live testnet explorer step so the learner does, not just reads.
- Full rebuild idea: an interactive testnet transaction simulator.
- Recommendation: medium upgrade.

## 18. Mining Simulator (P2)
URL: /interactive-demos/mining-simulator/

- Current learner confusion: The learner mostly watches the nonce iterate, the realistic mode is mysteriously slow, and the stats are stale (Nov 2024). One user-facing em dash.
- Best first-principles question: "Mining is guessing. What are miners actually paid for, and who decides the winner?"
- Learner should control: which transactions to include from a mempool given a block-size budget, and their share of hashrate.
- Should change live: reward plus fees earned, whether their block is found before a competitor, and how difficulty responds.
- Misconception to correct: "Miners create coins at will" and "the block subsidy is the only pay."
- Relatable scenario: choosing which pending transactions to pack into a block when space is limited and fees compete.
- Better title: keep it.
- Better opening sentence: "Mining is a guessing race. See what the winner actually earns."
- Cleanup idea: replace the em dash with a colon and fetch live difficulty with a labeled fallback.
- Medium upgrade idea: an embedded fee-market mini-game on top of the real SHA-256 engine.
- Full rebuild idea: a fuller proof-of-work plus fee-market simulator.
- Recommendation: medium upgrade.

## 19. Supply Schedule and Halvings (P2)
URL: /interactive-demos/bitcoin-supply-schedule/

- Current learner confusion: It is a spectator chart with controls, and a beginner is not told what to take away. The "19.6M" current supply is hardcoded and stale.
- Best first-principles question: "What happens to your share when more money can always be printed, versus when it cannot?"
- Learner should control: a counterfactual policy, try to print more, change the halving interval, or remove the cap, and run it forward.
- Should change live: the dilution of a holder under the learner's policy next to the real fixed 21M schedule.
- Misconception to correct: "21 million is arbitrary" and "an issuer could just promise to be disciplined." (Enforced scarcity differs from promised scarcity.)
- Relatable scenario: a savings balance that holds its share versus one quietly diluted as more units are created.
- Better title: "What fixed supply actually protects."
- Better opening sentence: "Try to print more bitcoin. See what it would do to everyone's share."
- Cleanup idea: pull current supply live and replace the generic reflect topic with a halving-specific prompt.
- Medium upgrade idea: a policy sandbox comparing the learner's issuance against the real schedule.
- Full rebuild idea: a full issuance simulator.
- Recommendation: medium upgrade.

## 20. Time Chain Explorer (P2)
URL: /interactive-demos/time-chain-explorer/

- Current learner confusion: The data is simulated with a stale hardcoded height, so the learner cannot tell what is real or change anything.
- Best first-principles question: "Why can blocks never be exactly 10 minutes apart?"
- Learner should control: a hashrate lever and a live-sync toggle.
- Should change live: the block-time distribution and the next-block countdown as conditions change.
- Misconception to correct: "Blocks arrive every 10 minutes, exactly."
- Relatable scenario: waiting for a confirmation that takes 2 minutes one time and 40 the next, and wondering why.
- Better title: "Why blocks are not exactly 10 minutes apart."
- Better opening sentence: "Ten minutes is an average, not a clock. See the spread."
- Cleanup idea: sync real recent block times via the existing data helper, with a labeled fallback.
- Medium upgrade idea: a variance experiment where the learner changes hashrate and watches the distribution and the difficulty response.
- Full rebuild idea: not needed.
- Recommendation: medium upgrade.

## 21. Money Properties Comparison (P2)
URL: /interactive-demos/money-properties-comparison/

- Current learner confusion: Little; it is strong. The learner reads pre-filled star ratings rather than forming a judgment first, and there is no Spanish.
- Best first-principles question: "What makes something good money in the first place?"
- Learner should control: their own 1 to 5 rating of each asset on each property, before any answer is shown.
- Should change live: a reveal comparing the learner's ratings to the reasoned baseline, with the gaps explained.
- Misconception to correct: "Money is just whatever the government says," or "gold and dollars are the same kind of thing."
- Relatable scenario: why seashells once worked as money and then stopped.
- Better title: keep it.
- Better opening sentence: "Before we score them, you score them."
- Cleanup idea: add the Spanish version (Curious-path concept).
- Medium upgrade idea: the rate-it-yourself-first prediction mode (predict then reveal).
- Full rebuild idea: not needed.
- Recommendation: medium upgrade (self-score mode plus EN/ES).

---

# Summary recommendations

## 1. Top 3 to improve first for brand trust

These are where the platform currently looks biased, inaccurate, or unsafe, which is what erodes trust fastest.

1. **Bitcoin vs Banking.** The persuasion table is the clearest place the site argues instead of informs. Fixing it proves the platform reasons honestly.
2. **Sovereign Vault.** A "zero-knowledge" overclaim plus a field that could tempt real seed entry is both an accuracy and a safety problem. Reword and validate now.
3. **Difficulty Calculator.** Stale numbers shown as if current quietly tell a careful reader the site is not maintained. Live data with a labeled fallback restores credibility.

Cheap safety companions to do in the same pass: the Address Format Explorer demo-address banner and the Wallet Security Workshop passphrase relabel.

## 2. Top 3 to improve first for learning impact

The foundational first-principles trio, where a better mechanic changes the mental model the most.

1. **Supply Schedule and Halvings.** Owns scarcity, the single most important idea, and is currently spectator-only.
2. **Bitcoin vs Banking.** Teaches that money choices are tradeoffs, the reasoning habit the whole site depends on.
3. **Money Properties Comparison.** Teaches what money even is, and a small predict-then-reveal upgrade turns a strong explainer into active reasoning.

## 3. Top 3 to improve first for easiest implementation

Small effort, real gain, low risk.

1. **Money Properties Comparison.** Add a rate-it-yourself-first step to an already strong tool.
2. **Security Training Lab (Dojo).** Show the score breakdown that the logic already computes.
3. **Address Format Explorer.** Add a prominent demo-address banner and a short "which format to use" readout.

## 4. Single best template mechanic to reuse

**Predict, then reveal.** Ask the learner to commit to a guess or a choice before the tool resolves the consequence, then show the gap between their expectation and what actually happens. It already exists in the DCA Time Machine and is the cheapest way to convert the shallow explainers into reasoning tools. It maps directly onto Money Properties (rate the assets first), Supply Schedule (predict what printing more does), Difficulty Calculator (predict the effect of more miners), Bitcoin vs Banking (guess which rail fits before seeing the scorecards), KYC (predict what an exchange can see), and Mining (predict what the winner earns). Building it once as a small shared pattern, with EN/ES strings from the start, would lift many tools at once and give the library a consistent, honest learning rhythm.
