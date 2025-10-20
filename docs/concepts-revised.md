# Bitcoin Sovereign Academy — Canonical Concept Index (Multi-Path Edition)

**Purpose**: Single source of truth for all Bitcoin concepts. Maps each concept to ONE canonical resource (module + demo). All 4 learning paths reference these shared concepts at appropriate difficulty levels.

**Last Updated**: 2025-10-20

---

## How Multi-Path Architecture Works

### The Four Paths

1. **🌱 Curious Path** (Beginners) — 4 stages, focus on understanding
2. **⚙️ Builder Path** (Developers) — 4 stages, technical depth
3. **👑 Sovereign Path** (Advanced custody/privacy) — 4-5 stages, operational focus
4. **⚡ Hurried Path** (Action-first) — Interactive-heavy, minimal theory

### Shared Content, Different Levels

All paths teach the same **core concepts**, but with different:
- **Depth**: Curious gets high-level, Builder gets technical details
- **Focus**: Sovereign emphasizes privacy/security, Builder emphasizes development
- **Order**: Paths introduce concepts in different sequences based on persona goals
- **Difficulty**: Same demo supports beginner/intermediate/advanced modes

**Example**: UTXO Model
- **Curious Stage 2** → Learn UTXOs with pre-filled beginner demo
- **Builder Stage 1** → Learn UTXOs with raw transaction construction
- **Sovereign Stage 1** → Learn UTXOs with privacy/coin-control focus

All three use the SAME canonical demo (`utxo-visualizer-enhanced.html`) with different `?level=` parameters.

---

## Core Concepts & Canonical Resources

### Concept Category 0: Foundational Premises

| Concept | Canonical Module | Canonical Demo | Used In Paths |
|---------|------------------|----------------|---------------|
| **Why money exists** | `/curriculum/first-principles/` or TBD | `/interactive-demos/concepts/money-evolution/` (TBD) | 🌱 Curious S1, ⚡ Hurried |
| **Functions of money** | `/curriculum/first-principles/` | (Embedded in first-principles) | 🌱 Curious S1 |
| **Properties of sound money** | `/curriculum/first-principles/` | (Embedded in first-principles) | 🌱 Curious S1, 👑 Sovereign S1 |
| **Trust vs. trustless** | `/curriculum/first-principles/` | (Embedded: trust cards demo) | 🌱 Curious S1, ⚙️ Builder S1 |
| **History of money failures** | `/curriculum/philosophy-economics/` | N/A (text only) | 🌱 Curious S1 |
| **Inflation & debt spiral** | `/curriculum/philosophy-economics/` | `/interactive-demos/debt-crisis.html` | 🌱 Curious S1, ⚡ Hurried |

**Status**: ⚠️ First-principles content needs extraction — embedded demos should be standalone

---

### Concept Category 1: Cryptography Primitives

| Concept | Canonical Module | Canonical Demo | Used In Paths |
|---------|------------------|----------------|---------------|
| **Hash functions** | TBD (missing - in Learn-bitcoin-by-doing) | TBD (missing) | ⚙️ Builder S1, 🌱 Curious S2 |
| **SHA-256 properties** | TBD | TBD | ⚙️ Builder S1 |
| **Digital signatures (ECDSA)** | TBD (missing - in Learn-bitcoin-by-doing KeysModule) | TBD (missing) | ⚙️ Builder S1, 👑 Sovereign S1 |
| **Public/private keypairs** | `/interactive-demos/wallet-workshop/` (partial) | `/interactive-demos/wallet-workshop/` | 🌱 Curious S3, ⚙️ Builder S1, 👑 Sovereign S1 |

**Status**: ❌ Major gap — Hashing and Keys modules from Learn-bitcoin-by-doing need integration

---

### Concept Category 2: Distributed Systems & Consensus

| Concept | Canonical Module | Canonical Demo | Used In Paths |
|---------|------------------|----------------|---------------|
| **Byzantine Generals Problem** | TBD (create canonical text) | `/interactive-demos/consensus-game/` | 🌱 Curious S2, ⚙️ Builder S1 |
| **Nakamoto consensus** | TBD (create canonical text) | `/interactive-demos/consensus-game/` | 🌱 Curious S2, ⚙️ Builder S1 |
| **51% attack** | TBD | `/interactive-demos/consensus-game/` | 🌱 Curious S2, ⚙️ Builder S1 |
| **Longest-chain rule** | TBD | `/interactive-demos/consensus-game/` | ⚙️ Builder S1 |

**Status**: ✅ Demo exists, ⚠️ Needs companion canonical text module

---

### Concept Category 3: Bitcoin Mechanics

| Concept | Canonical Module | Canonical Demo | Used In Paths |
|---------|------------------|----------------|---------------|
| **UTXO model** | TBD (create canonical text) | `/interactive-demos/utxo-visualizer-enhanced.html` | 🌱 Curious S2, ⚙️ Builder S1, 👑 Sovereign S1 |
| **Transaction structure** | TBD (create canonical text) | `/interactive-demos/transaction-builder/` | 🌱 Curious S2/S3, ⚙️ Builder S1 |
| **Inputs & outputs** | (Same as transaction structure) | `/interactive-demos/transaction-builder/` | 🌱 Curious S2, ⚙️ Builder S1 |
| **Change addresses** | (Same as UTXO model) | `/interactive-demos/utxo-visualizer-enhanced.html` | 🌱 Curious S2, 👑 Sovereign S2 |
| **Bitcoin Script basics** | TBD (missing - in Learn-bitcoin-by-doing ScriptsModule) | TBD (missing) | ⚙️ Builder S2 |
| **Mempool & propagation** | TBD (create canonical text) | TBD (consider adding to transaction-builder) | 🌱 Curious S3, ⚙️ Builder S2 |
| **Transaction fees** | TBD (create canonical text) | `/interactive-demos/transaction-builder/` (has fee calc) | 🌱 Curious S3, ⚙️ Builder S1 |
| **Blocks & block headers** | TBD (create canonical text) | `/interactive-demos/mining-simulator/` | 🌱 Curious S2, ⚙️ Builder S1 |
| **Mining & Proof-of-Work** | TBD (create canonical text) | `/interactive-demos/mining-simulator/` | 🌱 Curious S2, ⚙️ Builder S1 |
| **Difficulty adjustment** | TBD (create canonical text) | `/interactive-demos/mining-simulator/` (may have) | 🌱 Curious S2, ⚙️ Builder S1 |
| **Merkle trees & SPV** | TBD (missing - in Learn-bitcoin-by-doing MerkleModule) | TBD (missing) | ⚙️ Builder S2 |

**Status**: ✅ Demos exist for core concepts, ⚠️ Missing canonical text modules, ❌ Scripts & Merkle missing

---

### Concept Category 4: Network & Security

| Concept | Canonical Module | Canonical Demo | Used In Paths |
|---------|------------------|----------------|---------------|
| **Nodes & node types** | TBD (create canonical text) | TBD (consider adding to security-dojo) | 🌱 Curious S2, ⚙️ Builder S2, 👑 Sovereign S2 |
| **P2P network & gossip** | TBD (create canonical text) | TBD | ⚙️ Builder S2 |
| **Eclipse attacks** | TBD (create canonical text) | `/interactive-demos/security-dojo.html` | ⚙️ Builder S2, 👑 Sovereign S2 |
| **Sybil attacks** | TBD (create canonical text) | `/interactive-demos/security-dojo.html` | ⚙️ Builder S2, 👑 Sovereign S2 |
| **Privacy leaks (address reuse, clustering)** | TBD (create canonical text) | TBD (consider adding to wallet-workshop) | 👑 Sovereign S2 |
| **Chain analysis heuristics** | TBD (create canonical text) | TBD | 👑 Sovereign S2 |
| **Coin control** | TBD (create canonical text) | TBD (add to utxo-visualizer?) | 👑 Sovereign S2 |

**Status**: ✅ Security-dojo demo exists, ⚠️ Needs canonical text, ❌ Privacy demos missing

---

### Concept Category 5: Scaling & Layer 2

| Concept | Canonical Module | Canonical Demo | Used In Paths |
|---------|------------------|----------------|---------------|
| **Blocksize debate & SegWit** | TBD (create canonical text) | N/A (historical context) | ⚙️ Builder S2 |
| **Transaction batching** | TBD (create canonical text) | TBD | ⚙️ Builder S2 |
| **Lightning Network basics** | TBD (create canonical text) | `/interactive-demos/lightning-lab.html` | 🌱 Curious S3?, ⚙️ Builder S2, 👑 Sovereign S3 |
| **Lightning channels** | TBD (create canonical text) | `/interactive-demos/lightning-routing-sim.html` OR merged | ⚙️ Builder S2, 👑 Sovereign S3 |
| **HTLCs** | TBD (create canonical text) | `/interactive-demos/lightning-routing-sim.html` | ⚙️ Builder S2 |
| **Lightning routing** | TBD (create canonical text) | `/interactive-demos/lightning-routing-sim.html` | ⚙️ Builder S2, 👑 Sovereign S3 |
| **Channel liquidity** | TBD (create canonical text) | TBD | 👑 Sovereign S3 |

**Status**: ✅ Lightning demos exist, 🔄 Review: merge lightning-lab + lightning-routing-sim?, ⚠️ Needs canonical text

---

### Concept Category 6: Self-Custody & Operations

| Concept | Canonical Module | Canonical Demo | Used In Paths |
|---------|------------------|----------------|---------------|
| **Hot vs. cold wallets** | TBD (create canonical text) | `/interactive-demos/wallet-workshop/` | 🌱 Curious S3, 👑 Sovereign S1 |
| **Seed phrases & BIP39** | TBD (create canonical text) | `/interactive-demos/wallet-workshop/` | 🌱 Curious S3, 👑 Sovereign S1, ⚡ Hurried |
| **HD wallets & derivation paths** | TBD (create canonical text) | TBD (consider adding to wallet-workshop) | 👑 Sovereign S1, ⚙️ Builder S3 |
| **Multisig** | TBD (create canonical text) | TBD (missing demo) | 👑 Sovereign S1, ⚙️ Builder S3 |
| **Hardware wallets** | TBD (create canonical text) | N/A (product comparison) | 🌱 Curious S4, 👑 Sovereign S1 |
| **Backup & recovery** | TBD (create canonical text) | `/interactive-demos/wallet-workshop/` (partial) | 🌱 Curious S4, 👑 Sovereign S1 |
| **Inheritance planning** | TBD (create canonical text) | TBD (missing) | 👑 Sovereign S4 |

**Status**: ✅ Wallet-workshop demo exists, ⚠️ Needs canonical text, ❌ Multisig & inheritance demos missing

---

### Concept Category 7: Builder-Specific (Advanced Technical)

| Concept | Canonical Module | Canonical Demo | Used In Paths |
|---------|------------------|----------------|---------------|
| **PSBT (BIP174)** | TBD (create canonical text) | TBD (missing) | ⚙️ Builder S3 |
| **Miniscript** | TBD (create canonical text) | TBD (missing) | ⚙️ Builder S3 |
| **Output Descriptors** | TBD (create canonical text) | TBD (missing) | ⚙️ Builder S3 |
| **Timelocks (nLockTime, CSV, CLTV)** | TBD (create canonical text) | TBD (missing) | ⚙️ Builder S3 |
| **Taproot & Schnorr** | TBD (missing - may be in Learn-bitcoin-by-doing AdvancedTopicsModule) | TBD (missing) | ⚙️ Builder S4 |

**Status**: ❌ All missing — low priority (advanced builder content)

---

### Concept Category 8: Philosophy & Economics

| Concept | Canonical Module | Canonical Demo | Used In Paths |
|---------|------------------|----------------|---------------|
| **Incentive structure & game theory** | TBD (create canonical text) | N/A (text/analysis) | 🌱 Curious S4, ⚙️ Builder S3 |
| **Stock-to-flow & scarcity** | `/curriculum/philosophy-economics/` | N/A (charts/analysis) | 🌱 Curious S1 |
| **Austrian economics & time preference** | `/curriculum/philosophy-economics/` | `/interactive-demos/time-machine.html` | 🌱 Curious S4 |
| **Cantillon effect** | `/curriculum/philosophy-economics/` | `/interactive-demos/debt-crisis.html` | 🌱 Curious S1, ⚡ Hurried |
| **CBDCs vs. Bitcoin** | `/modules/cbdc-vs-bitcoin.html` | N/A (comparison table) | 🌱 Curious S4, 👑 Sovereign S4 |
| **Sovereignty playbook** | `/curriculum/sovereign-tools/` | N/A (guide/checklist) | 👑 Sovereign S4 |
| **Regulation & compliance** | TBD (create canonical text) | N/A (legal context) | 👑 Sovereign S4 |

**Status**: ✅ Philosophy content exists, ⚠️ May need consolidation

---

## Path-to-Concept Mapping (Quick Reference)

### 🌱 Curious Path (4 stages, 13 modules)

**Stage 1: Understanding Money**
- Why money exists, properties, problems
- Concepts: Money basics, inflation, trust vs. trustless

**Stage 2: Bitcoin Fundamentals**
- How Bitcoin works, UTXOs, transactions, mining, consensus
- Concepts: UTXO model, transactions, PoW, Byzantine Generals, blocks

**Stage 3: Your First Bitcoin**
- Wallets, buying, sending transactions
- Concepts: Hot/cold wallets, seed phrases, transaction fees

**Stage 4: Staying Safe**
- Security, backups, recovery, inheritance basics
- Concepts: Backup strategies, hardware wallets

---

### ⚙️ Builder Path (4 stages)

**Stage 1: Bitcoin Protocol Deep Dive**
- UTXO model, transaction structure, mining, consensus (technical)
- Concepts: Same as Curious S2 but at **advanced level**

**Stage 2: Network & Layer 2**
- P2P network, Lightning channels, routing, security
- Concepts: Nodes, Eclipse/Sybil, Lightning HTLCs, routing

**Stage 3: Development Tools**
- PSBT, Miniscript, Descriptors, Timelocks
- Concepts: Builder-specific advanced tools

**Stage 4: Advanced Topics**
- Taproot, Schnorr, cutting-edge features
- Concepts: Latest protocol upgrades

---

### 👑 Sovereign Path (4-5 stages)

**Stage 1: Self-Custody Fundamentals**
- Hardware wallets, multisig, key management
- Concepts: Cold storage, multisig, HD wallets

**Stage 2: Privacy & Anonymity**
- CoinJoin, mixing, running nodes, privacy leaks
- Concepts: Privacy leaks, coin control, chain analysis

**Stage 3: Advanced Operations**
- Lightning self-hosting, Payjoin, PayNym
- Concepts: Lightning operations, privacy tools

**Stage 4: Total Sovereignty**
- Inheritance, citadel building, living on Bitcoin standard
- Concepts: Inheritance planning, sovereignty playbook

---

### ⚡ Hurried Path (Interactive-first)

**No fixed stages — learners jump straight into interactive demos:**
- Wallet setup (wallet-workshop)
- Send first transaction (transaction-builder)
- Understand inflation (debt-crisis)
- Try Lightning (lightning-lab)

---

## Content Library Structure (Target State)

Once consolidation is complete, the file structure will be:

```
/content-library/
  ├── concepts/
  │   ├── money-basics/
  │   │   ├── module.html           # Canonical text explanation
  │   │   ├── demo.html              # Interactive (if applicable)
  │   │   └── metadata.json          # Concepts, prereqs, paths using it
  │   ├── utxo-model/
  │   │   ├── module.html
  │   │   ├── demo.html              # utxo-visualizer-enhanced
  │   │   └── metadata.json
  │   ├── transactions/
  │   │   ├── module.html
  │   │   ├── demo.html              # transaction-builder
  │   │   └── metadata.json
  │   └── ... (one folder per concept)
  └── index.json                      # Master index

/paths/
  ├── curious/
  │   ├── stage-1/
  │   │   ├── index.html             # Stage landing
  │   │   └── module-1.html          # Links to /content-library/concepts/money-basics/?level=beginner&path=curious
  │   └── ...
  ├── builder/ ...
  ├── sovereign/ ...
  └── hurried/ ...
```

**Paths become thin wrappers** that link to canonical content with path-specific context.

---

## How to Use This Index

### For Content Creators

1. **Before creating a module**: Check if concept exists here
   - If YES → Link to canonical, add path-specific wrapper
   - If NO → Create canonical, add to this index, then reference from path

2. **When editing existing modules**: Replace duplicates with links
   ```markdown
   > **Quick recap**: UTXOs are Bitcoin's "coins"—discrete outputs locked to addresses.
   > [Deep dive →](/content-library/concepts/utxo-model/?level=beginner)
   ```

3. **When adding new path**: Map path stages to existing concepts
   - Don't create new modules if canonical exists
   - Just link with appropriate `?level=` parameter

### For Maintainers

1. **Every 5 concept changes**: Audit this index for drift
2. **Quarterly**: Validate all links (no dead links)
3. **When integrating Learn-bitcoin-by-doing modules**: Add to this index first, mark status

---

## Integration Status Summary

### ✅ Complete (Demo + Text)
- Philosophy & Economics (curriculum exists)
- Sovereign Tools overview (curriculum exists)

### ⚠️ Partial (Demo exists, missing canonical text)
- UTXO model (have demo, need text module)
- Transactions (have demo, need text module)
- Mining (have demo, need text module)
- Consensus (have demo, need text module)
- Wallets (have demo, need text module)
- Lightning (have demos, need text module + consolidation)
- Security (have demo, need text module)

### ❌ Missing (Need both demo + text)
- Hash functions (exists in Learn-bitcoin-by-doing)
- Keypairs & signatures (exists in Learn-bitcoin-by-doing)
- Bitcoin Script (exists in Learn-bitcoin-by-doing)
- Merkle trees (exists in Learn-bitcoin-by-doing)
- Nodes & P2P (partially exists in Learn-bitcoin-by-doing)
- Privacy tools (coin control, CoinJoin, etc.)
- Multisig (partially exists in Learn-bitcoin-by-doing)
- Timelocks (exists in Learn-bitcoin-by-doing)
- PSBT, Miniscript, Descriptors (may exist in Learn-bitcoin-by-doing)
- Taproot & Schnorr (may exist in Learn-bitcoin-by-doing)

---

## Next Steps

1. **Fill missing canonical text modules** for concepts that have demos
2. **Integrate Learn-bitcoin-by-doing modules** for missing concepts (hash, keys, script, merkle)
3. **Extract embedded demos** from `/curriculum/first-principles/`
4. **Consolidate Lightning demos** (merge or keep separate with clear distinctions)
5. **Add metadata.json** to each concept (once content library structure is built)

---

**Last updated**: 2025-10-20
**Status**: Revised for multi-path architecture
**Next Review**: After Learn-bitcoin-by-doing integration audit
