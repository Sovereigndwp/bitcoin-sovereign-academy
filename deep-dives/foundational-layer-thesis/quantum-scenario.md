# Quantum Computing & Bitcoin — Scenario Analysis (v4 update)

### How likely is a quantum break of Bitcoin's cryptography, on what timeline, and what does Bitcoin's response look like? Probability bands with explicit error margins. v4 reconciles BIP-360 and BIP-361 as separate proposals with separate roles, and updates source URLs.

*The Sovereign Academy · v4 companion · May 2026*

---

## Why this document exists

The original v1 and v2 of this deep dive treated quantum computing as a footnote. That was an analytical mistake. Quantum is the only existential cryptographic risk Bitcoin faces, and the 2026 evidence is that the threat window has shortened materially. v3 elevated quantum to its own scenario analysis with explicit probability bands, response timeline, and a new falsifier (F17) in the framework. v4 reconciles the BIP-360 and BIP-361 framing across the framework (F17), this document, and the dashboard.

The honest framing: **quantum is the lowest-probability, highest-impact scenario on Bitcoin's risk map.** Probabilities are wide and contested; the consequences if it materializes are categorical. The right response is to track the threat seriously, support BIP-360 P2MR development (the quantum-resistant address type — required for any meaningful migration), evaluate BIP-361 (the contested freeze proposal — not required for F17 to stay INTACT) on its own merits separately, and avoid both complacency and panic.

---

## The threat in one paragraph

Bitcoin signatures use elliptic curve cryptography (ECDSA for legacy addresses, Schnorr for Taproot/P2TR). A sufficiently powerful quantum computer running Shor's algorithm could derive private keys from public keys in minutes. Once a private key is exposed, the BTC at that address can be stolen. **In early 2026, Google researchers published findings suggesting a sufficiently powerful quantum computer could break Bitcoin's ECDSA in approximately 10 minutes** — though "sufficiently powerful" remains the load-bearing qualifier, and current quantum hardware is many orders of magnitude away from that threshold. `[PRESS]`

## What's vulnerable, what's not

| Address type | Vulnerable when? | Approx % of supply |
|---|---|---|
| **P2PK (Pay-to-Public-Key)** — early Satoshi-era | Always — public key exposed at creation | ~5% (~1M BTC, mostly dormant) |
| **P2PKH with reuse** | Once any spend exposes the public key | ~20% (estimates vary) |
| **P2PKH, never spent** | Only at spend time | ~30% |
| **P2SH and P2WPKH/P2WSH** | Similar — public key revealed on spend | ~25% |
| **P2TR (Taproot)** | Public key visible on-chain; Schnorr same quantum exposure as ECDSA | ~5% (growing) |
| **P2MR (BIP-360, new)** | Post-quantum signatures — resistant by design | 0% (not yet activated) |

The single most-cited concern is the **~1 million BTC believed to be in early Satoshi-era P2PK addresses.** These public keys are visible on-chain today, meaning a quantum computer powerful enough to break ECDSA could begin attacking them immediately. **BIP-361** (a separate proposal from BIP-360 — see below) addresses this specific subset by proposing a mechanism to *freeze* quantum-vulnerable coins via a deadline-based commitment so they cannot be stolen post-quantum-break — at the cost of permanently locking up ~5% of Bitcoin supply, including Satoshi's coins. This is one of the most contested proposals in Bitcoin's history; reasonable people across the community disagree on whether freezing is the right response or whether voluntary migration is sufficient. `[DEV]`

## Bitcoin's response: BIP-360 (the activation that matters for F17) and BIP-361 (contested freeze proposal)

**These are separate proposals with separate roles.** v3 of this document framed them together in a way that made F17 harder to evaluate. v4 reconciliation:

**BIP-360 — quantum-resistant address type. The activation that matters for F17(a).**

- Entered the Bitcoin BIPs repository **February 10, 2026**.
- Introduces **Pay-to-Merkle-Root (P2MR)**, a new Bitcoin output type that preserves Taproot-style script trees while removing the quantum-vulnerable key-path spend. P2MR uses post-quantum signatures (likely Dilithium / ML-DSA, NIST-standardized as part of the post-quantum cryptography standardization process).
- Source: [github.com/bitcoin/bips — BIP-0360](https://github.com/bitcoin/bips/blob/master/bip-0360.mediawiki) `[DEV]`.
- **F17(a) tracks BIP-360 activation specifically.** A demonstrated CRQC before end of 2032, combined with BIP-360 *not* having activated on mainnet, fires F17(a).

**BIP-361 — freeze quantum-vulnerable coins. Contested. Not part of the F17 threshold.**

- A separately-numbered proposal for a soft-fork mechanism to *freeze* coins at quantum-vulnerable addresses (notably the early P2PK addresses) on a deadline, forcing migration to BIP-360-style addresses before the quantum threat materializes.
- Highly contested. Permanently locking up ~5% of Bitcoin supply — including Satoshi's coins — has strong technical-and-philosophical proponents and equally strong opponents.
- **BIP-361 is *not* required for F17 to stay INTACT.** A reasonable migration path without BIP-361 is voluntary user-driven migration from quantum-vulnerable to BIP-360 addresses; coins that don't move would remain exposed but the supply-impact is bounded. `[DEV]` `[PRESS]`

**BTQ Technologies** released **Bitcoin Quantum testnet v0.3.0 in March 2026** with a full working implementation of BIP-360 (P2MR). P2MR transactions are being created and spent on the live test network. `[PROJ]`

**Activation timeline.** Neither BIP-360 nor BIP-361 has activation parameters as of May 2026. The covenant debate alone (CTV with March 2026 deployment parameters) has taken multiple years to reach this stage. Quantum-resistance soft forks would likely follow a similar multi-year activation process — meaning practical migration to BIP-360 quantum-resistant addresses is a **2028–2032 window** under reasonable assumptions.

## Probability bands

These bands are deliberately wide because the underlying physics, engineering, and political-economy variables have wide error margins. The bands draw on **Google, IBM, and academic estimates of quantum hardware progress; NIST's post-quantum cryptography standardization process; Bitcoin community estimates of soft-fork timing; and Ripple's stated 2028 target for quantum-proof XRP Ledger plus Ethereum's 2030 Strawmap target as reference points for competing-chain readiness.**

### By 2030

- **Probability of a cryptographically relevant quantum computer (CRQC) breaking ECDSA in production:** **5–15%.** Most quantum hardware roadmaps target millions of physical qubits and meaningful error correction by ~2030. Production CRQC capable of attacking 256-bit ECDSA requires roughly 20 million physical qubits with high-fidelity error correction; current state-of-the-art (IBM Condor, Google Willow) is in the low thousands. Achieving 1000x scale-up in 4 years is ambitious but not impossible if a fundamental breakthrough lands.
- **Probability of Bitcoin's quantum-resistant soft fork activating:** **20–40%.** BIP-360 needs to advance from draft to deployment; political consensus required; ecosystem migration time.

### By 2035

- **Probability of CRQC:** **30–60%.** Roadmap timelines converge here. Multiple quantum approaches (superconducting, trapped ion, topological) reach maturity in different fashion. Most academic forecasts cluster in this band.
- **Probability of Bitcoin quantum-resistance active:** **65–85%.** Multiple soft-fork attempts; ecosystem readiness for P2MR; mass-migration to QR addresses underway.

### By 2040

- **Probability of CRQC:** **70–90%.** Hardware progress plus algorithmic improvements compound. Few credible roadmaps say "never."
- **Probability of Bitcoin quantum-resistance active:** **90%+.** Existential pressure for activation by this point.

### The race condition

The critical question is the relative position of two curves: **quantum hardware capability** and **Bitcoin's quantum-resistance activation + migration**. If hardware moves faster than expected, or if Bitcoin's soft-fork timeline slips, there is a window where ~25% of BTC supply (vulnerable P2PK + reused-P2PKH) could be at risk before migration completes.

**This is the only existential cryptographic risk in the entire deep dive that could invalidate Bitcoin's SoV claim independently of any other variable.** Every other risk (regulation, security budget, competition) erodes Bitcoin's position; a successful quantum attack could in principle destroy it.

## What Bitcoin holders should do today

1. **Use P2TR (Taproot) addresses where possible.** Taproot's Schnorr signatures use public keys that are not revealed on-chain until spend — meaning unspent Taproot UTXOs are not directly exposed to quantum attack the way P2PK is. This is not a quantum-resistance fix, but it removes the always-on attack surface.

2. **Avoid address reuse.** Once a public key is revealed on a P2PKH spend, that address becomes quantum-vulnerable. Generate a fresh address per receive. (Standard practice for privacy reasons too.)

3. **Plan for migration.** When P2MR (BIP-360) activates, move BTC to quantum-resistant addresses. Cost will be a single on-chain transaction per UTXO.

4. **Do not panic-sell on quantum news.** Probability bands above show even the 2030 scenario is 5–15% likely. Quantum hardware progress is publicly tracked; the community will have warning before an active threat.

5. **Track BIP-360 progress as the activation that matters.** BIP-361 is a separate, contested freeze proposal — track it on its own merits, but a Bitcoin migration path is viable without BIP-361. The covenant debate's CTV timeline (start March 30, 2026; minimum activation height May 2027) is a reference point. Quantum proposals are roughly 12–24 months behind covenants in maturity.

## F17 — the quantum falsifier in the framework (v4 reconciliation)

**Claim.** Bitcoin's quantum-resistance migration tracks ahead of cryptographically relevant quantum computing capability, with sufficient margin that no material BTC supply is stolen via quantum attack.

**Falsification threshold.** Either:

- **(a)** A cryptographically relevant quantum computer capable of breaking ECDSA in production is publicly demonstrated before end of 2032 **AND BIP-360 (P2MR) quantum-resistant addresses have not yet activated on Bitcoin mainnet**. BIP-361 status is *not* part of this threshold.
- **(b)** Any successful quantum-attack-based theft of BTC from a previously-secure address occurs, at any scale, before end of 2032.

**Measurement source.** IBM / Google / academic quantum hardware roadmaps. Bitcoin BIPs repository and Bitcoin Core release notes for BIP-360 activation tracking. NIST post-quantum cryptography standardization announcements. On-chain forensics of any theft event. `[DEV]` `[INST]`

- Primary BIP-360 reference: [github.com/bitcoin/bips — BIP-0360](https://github.com/bitcoin/bips/blob/master/bip-0360.mediawiki)
- BIP-361 status tracked separately (contested freeze proposal — not a F17 input)

**Why it matters.** This is the only single-event falsifier that could *unilaterally* invalidate Bitcoin's SoV claim. Most other falsifiers (Tron displacement, L2 scale, regulatory) erode position; quantum could destroy it.

**Status as of May 2026: INDETERMINATE.** No CRQC exists; no Bitcoin quantum-resistance soft fork has activated; BIP-360 is in draft (entered repository February 10, 2026); BIP-361 contested; BTQ testnet running with BIP-360 implementation. Status moves to PRESSURE if either: hardware progress accelerates materially (>10x year-over-year qubit growth with error correction), or BIP-360 activation timeline slips past end of 2030.

**Deadline:** End of 2032.

**Contested.** Probability bands above carry wide error margins. Methodology will be re-published at each quarterly review with current hardware-progress data and BIP-360 status. **v4 confidence rating: Low for the probability bands (wide error margins acknowledged); High for the binary "has BIP-360 activated on mainnet" check that drives F17(a).**

## Bottom line for the thesis

The symbiotic-sovereign thesis assumes Bitcoin's L0 cryptographic foundations remain secure. Quantum is the one risk that could break that assumption. v3 incorporated this risk explicitly via F17 and via this scenario document; v4 keeps the structure and reconciles the BIP-360 / BIP-361 framing.

**Honest scoring:** quantum is unlikely to invalidate the thesis within the 5-year horizon the v2 Counter-Map operates on. By the 10-year horizon, the probability rises materially — meaning the thesis's longer-term claims about Bitcoin's monetary dominance (the F1 BTC dominance falsifier, the F12 Solana SoV-gap falsifier, the F8 sovereign-adoption falsifier all running to 2030) are conditional on the quantum race going in Bitcoin's favor.

The right response is not to remove these long-horizon claims; it is to mark them as **conditional on F17 staying INDETERMINATE or moving toward INTACT.** If F17 fires, the entire long-horizon thesis is rebuilt.

---

## Sources

- [Bitcoin BIPs repository — BIP-0360 (P2MR, primary source)](https://github.com/bitcoin/bips/blob/master/bip-0360.mediawiki) `[DEV]`
- [CoinDesk: Bitcoin's $1.3 trillion security race against quantum](https://www.coindesk.com/tech/2026/04/04/bitcoin-s-usd1-3-trillion-security-race-key-initiatives-aimed-at-quantum-proofing-the-world-s-largest-blockchain) `[PRESS]`
- [Cointelegraph: BIP-360 explained, hash-based signatures](https://cointelegraph.com/news/bitcoin-quantum-resistant-bip-360-post-quantum-signatures-taproot) `[PRESS]`
- [Datawallet: BIP-360 Explained](https://www.datawallet.com/crypto/bip-360-explained) `[PRESS]`
- [Phemex: BIP-360 P2MR address type](https://phemex.com/blogs/bitcoin-quantum-resistant-address-bip-360) `[PRESS]`
- [Crypto.news: Is Bitcoin quantum-safe 2026](https://crypto.news/is-bitcoin-quantum-safe/) `[PRESS]`
- [KuCoin: BIP-361 freezing quantum-vulnerable coins (contested freeze proposal — separate from BIP-360)](https://www.kucoin.com/blog/bip-361-explained-bitcoin-new-plan-to-survive-quantum-computing) `[PRESS]`
- [The Quantum Space: Bitcoin's first quantum step](https://thequantumspace.org/2026/02/24/bitcoins-first-quantum-step/) `[ANEC]`

*Companion to v4 of "Bitcoin Is No Longer Just the Foundational Layer." Probability bands will be revised quarterly as quantum hardware progress and BIP-360 status evolve. The methodology-immutability rule applies: probability bands can be tightened (narrower error), never widened to save the thesis. v4 update: BIP-360 and BIP-361 reconciled as separate proposals — F17(a) tracks BIP-360 only; BIP-361 status reported for context but is not a falsifier input.*
