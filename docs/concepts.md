# Bitcoin Sovereign Academy — Canonical Concept Index

**Purpose**: This is your single source of truth. Every concept below maps to exactly **one** canonical module. Everywhere else in the curriculum, link to it instead of re-explaining.

---

## Core Concepts & Canonical Locations

### 0. Foundational Premises (Stage 0)

| Concept | Canonical Module | Path |
|---------|------------------|------|
| **Why money exists** | Problems with Traditional Money | `/curriculum/first-principles/` or `/paths/curious/stage-1/` |
| **Functions of money** (unit, medium, store) | Money Basics | TBD — merge duplicates into one |
| **Properties of sound money** | Sound Money Principles | TBD — merge duplicates |
| **Trust vs. trustless systems** | Trust & Verification | TBD |
| **History of money failures** | History of Monetary Failures | `/curriculum/philosophy-economics/` |

---

### 1. Cryptography Primitives (Stage 1)

| Concept | Canonical Module | Path |
|---------|------------------|------|
| **Hard problems** (discrete log, factorization) | Cryptographic Foundations | TBD — create if missing |
| **Hash functions** (SHA-256, collision resistance) | Hashing Deep Dive | TBD |
| **Digital signatures** (ECDSA, SECP256k1) | Signatures & Keypairs | TBD |
| **Public/private keys** | Keypair Fundamentals | TBD |

---

### 2. Distributed Systems & Consensus (Stage 2)

| Concept | Canonical Module | Path |
|---------|------------------|------|
| **Byzantine Generals Problem** | Why Consensus is Hard | TBD |
| **Nakamoto consensus** | How Bitcoin Achieves Consensus | TBD |
| **Longest-chain rule** | Chain Selection Rules | TBD |
| **51% attack** | Attack Vectors & Defenses | TBD or `/interactive-demos/consensus-game/` |

---

### 3. Bitcoin Mechanics (Stage 3)

| Concept | Canonical Module | Path |
|---------|------------------|------|
| **UTXO model** | How UTXOs Work | Link to `/interactive-demos/utxo-visualizer-enhanced.html` or create canonical text |
| **Transaction structure** | Anatomy of a Bitcoin Transaction | Link to `/interactive-demos/transaction-builder/` |
| **Script & locking conditions** | Bitcoin Script Basics | TBD |
| **Mempool** | Transaction Pool & Propagation | TBD |
| **Transaction fees** | Fee Market Mechanics | TBD |
| **Blocks & block headers** | Block Structure | TBD |
| **Mining & Proof-of-Work** | How Mining Secures Bitcoin | Link to `/interactive-demos/mining-simulator/` |
| **Difficulty adjustment** | Difficulty Retargeting | TBD |

---

### 4. Network & Security (Stage 4)

| Concept | Canonical Module | Path |
|---------|------------------|------|
| **Nodes & node types** (full, light, archive) | Running a Bitcoin Node | TBD |
| **P2P network & gossip protocol** | Bitcoin's Network Layer | TBD |
| **Eclipse attacks** | Network-Level Attacks | `/interactive-demos/security-dojo.html` or TBD |
| **Sybil attacks** | Sybil Resistance | TBD |
| **Privacy leaks** (address reuse, change, clustering) | On-Chain Privacy Risks | TBD |
| **Chain analysis heuristics** | How Your Transactions Can Be Traced | TBD |
| **Coin control** | Managing Privacy with Coin Control | TBD |

---

### 5. Scaling & Layer 2 (Stage 5)

| Concept | Canonical Module | Path |
|---------|------------------|------|
| **Blocksize debate & SegWit** | Bitcoin's Scaling Journey | TBD |
| **Transaction batching** | Efficient UTXO Management | TBD |
| **Lightning Network basics** | Introduction to Lightning | Link to `/interactive-demos/lightning-lab.html` |
| **Lightning channels** | How Payment Channels Work | Link to `/interactive-demos/lightning-routing-sim.html` |
| **HTLCs** | Hash Time-Locked Contracts | TBD |
| **Lightning routing** | How Lightning Routes Payments | Link to `/interactive-demos/lightning-routing-sim.html` |
| **Channel liquidity & management** | Running a Lightning Node | TBD |

---

### 6. Self-Custody & Operations (Stage 6)

| Concept | Canonical Module | Path |
|---------|------------------|------|
| **Hot vs. cold wallets** | Wallet Security Models | Link to `/interactive-demos/wallet-workshop/` |
| **Seed phrases & BIP39** | Seed Phrase Fundamentals | Link to `/interactive-demos/wallet-workshop/` |
| **Derivation paths (BIP32/44/49/84)** | HD Wallets & Derivation | TBD |
| **Multisig** | Multisignature Wallets | TBD |
| **Hardware wallets** | Hardware Wallet Comparison | TBD |
| **Backup & recovery strategies** | Backup Best Practices | TBD |
| **Inheritance planning** | Passing Bitcoin to Heirs | TBD |

---

### 7. Builder Track (Stage 7 – Optional)

| Concept | Canonical Module | Path |
|---------|------------------|------|
| **PSBT (BIP174)** | Partially Signed Bitcoin Transactions | TBD |
| **Miniscript** | Policy-to-Script Compilation | TBD |
| **Descriptors** | Output Descriptors | TBD |
| **Timelock (nLockTime, CSV, CLTV)** | Time-Based Conditions | TBD |
| **Taproot & Schnorr** | Advanced Bitcoin Features | TBD |

---

### 8. Philosophy & Economics (Stage 8)

| Concept | Canonical Module | Path |
|---------|------------------|------|
| **Incentive structure** | Bitcoin's Game Theory | TBD |
| **Stock-to-flow & scarcity** | Bitcoin's Economic Model | TBD |
| **Austrian economics** | Sound Money & Time Preference | `/curriculum/philosophy-economics/` |
| **Cantillon effect** | Inflation's Hidden Tax | Link to `/interactive-demos/debt-crisis.html` or `/ai-agents/story-navigator/lessons/inflation-story.html` |
| **CBDCs vs. Bitcoin** | Surveillance Money vs. Freedom Money | `/modules/cbdc-vs-bitcoin.html` |
| **Sovereignty playbook** | Achieving Financial Sovereignty | `/curriculum/sovereign-tools/` |
| **Regulation & compliance** | Navigating Legal Frameworks | TBD |

---

## How to Use This Index

1. **Before creating any new module**: Check this list. If the concept exists, link to it.
2. **When editing existing modules**: Replace redundant explanations with:
   ```markdown
   > **Quick recap**: [Concept] is [1-sentence definition]. [Read the full explanation →](link-to-canonical)
   ```
3. **When you find duplicates**: Merge them. Keep the clearest explanation, delete or redirect the rest.
4. **When a concept isn't listed**: Either (a) add it here and create the canonical module, or (b) it's too narrow and should be a subsection of an existing canonical module.

---

## Maintenance

- **Owner**: Keep this file updated as modules are created, merged, or restructured.
- **Review cadence**: After every 5 module changes, audit for drift.
- **Link validation**: Run a dead-link checker quarterly.

---

**Last updated**: 2025-10-20
**Status**: Initial draft — TBD items to be filled as restructure progresses
