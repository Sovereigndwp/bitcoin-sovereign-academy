# Content Mapping: Learning Paths ↔ Existing Demos & Content

This document maps existing interactive demos, games, and content to the appropriate modules in each learning path.

## Philosophy & Economics Content

### Location
- **First Principles**: Available at `/philosophy/first-principles.html` (or similar)
- **Core Economics**: Needs to be created or mapped
- **Ethics & Sovereignty**: Needs to be created or mapped

### Recommended Integration

**THE CURIOUS PATH - Stage 1**
- **Module 1** (What is Money?): Integrate First Principles content
  - Money solves barter problems
  - Properties of good money (scarce, durable, portable, divisible, verifiable)
  - SHOULD LINK TO: First Principles reading

- **Module 2** (Problems with Fiat): Integrate Core Economics
  - Scarcity concept
  - Time preference
  - SHOULD LINK TO: Sovereign Game (economic history 2005-2025)

- **Module 3** (Enter Bitcoin): Integrate Ethics & Sovereignty
  - Censorship resistance
  - Self-custody principles
  - SHOULD LINK TO: Security Dojo

---

## Interactive Demos & Games Mapping

### 🎮 Sovereign Journey
**Current Location**: `/interactive-demos/sovereign-game/` or similar
**Description**: 20 years of economic history (2005-2025), crisis decisions

**RECOMMENDED PLACEMENT**:
- ✅ **Curious Path - Stage 1 - Module 2** (Problems with Fiat Money)
  - Perfect fit: Shows inflation, bank runs, currency devaluation
  - Currently: NOT INTEGRATED
  - Action needed: Embed or link to game

### 🔨 Transaction Builder
**Current Location**: `/interactive-demos/transaction-builder/`
**Description**: Build Bitcoin transactions, learn UTXOs, fees, change outputs

**RECOMMENDED PLACEMENT**:
- ✅ **Curious Path - Stage 2 - Module 1** (How Bitcoin Works: Blockchain & Transactions)
  - Currently: NOT INTEGRATED
  - Action needed: Embed transaction builder demo

- ✅ **Builder Path - Stage 1 - Module 1** (Bitcoin Protocol Deep Dive)
  - Currently: PARTIALLY INTEGRATED (UTXO Visualizer embedded)
  - Action needed: ALSO embed Transaction Builder for hands-on practice

### ⛏️ Mining Simulator
**Current Location**: `/interactive-demos/mining-simulator/`
**Description**: Mining difficulty, block rewards, hashrate dynamics, PoW visualization

**RECOMMENDED PLACEMENT**:
- ✅ **Curious Path - Stage 2 - Module 1** (How Bitcoin Works: Blockchain & Transactions)
  - Currently: NOT INTEGRATED
  - Action needed: Embed mining simulator

- ✅ **Curious Path - Stage 2 - Module 2** (Bitcoin's Rules: Supply, Halving, Difficulty)
  - Currently: NOT INTEGRATED
  - Action needed: Link to mining simulator for difficulty adjustment

- ✅ **Builder Path - Stage 1 - Module 3** (Proof of Work)
  - Currently: NOT CREATED YET
  - Action needed: Embed advanced mining simulator

### ⚡ Lightning Network Lab
**Current Location**: `/interactive-demos/lightning-lab.html`
**Description**: Lightning channels, routing, liquidity, instant payments

**RECOMMENDED PLACEMENT**:
- ✅ **Builder Path - Stage 2 - Module 1** (Payment Channels)
  - Currently: STAGE NOT CREATED YET
  - Action needed: Embed Lightning Lab

- ✅ **Builder Path - Stage 2 - Module 2** (Routing & HTLCs)
  - Currently: STAGE NOT CREATED YET
  - Action needed: Link to Lightning Lab for routing practice

### 🏦 Wallet Workshop
**Current Location**: `/interactive-demos/wallet-workshop/`
**Description**: HD wallets, seed phrases, derivation paths (BIP32/39/44)

**RECOMMENDED PLACEMENT**:
- ✅ **Curious Path - Stage 3** (Your First Bitcoin) - IF THIS STAGE EXISTS
  - Currently: STAGE 3 NOT CREATED YET
  - Action needed: Create Stage 3 and embed Wallet Workshop

- ✅ **Builder Path - Stage 3 - Module 2** (Building with Bitcoin)
  - Currently: STAGE NOT CREATED YET
  - Action needed: Embed Wallet Workshop for address generation

- ✅ **Sovereign Path - Stage 1** (Setup & Security)
  - Currently: ONLY PLACEHOLDERS EXIST
  - Action needed: Embed Wallet Workshop

### 💡 UTXO Visualizer
**Current Location**: `/interactive-demos/utxo-visualizer-v2.html`
**Description**: UTXO flows, transaction building, fee optimization, coin selection

**RECOMMENDED PLACEMENT**:
- ✅ **Builder Path - Stage 1 - Module 1** (Bitcoin Protocol Deep Dive)
  - Currently: ✅ ALREADY EMBEDDED
  - Status: COMPLETE ✓

- ✅ **Curious Path - Stage 2 - Module 1** (How Bitcoin Works)
  - Currently: NOT INTEGRATED
  - Action needed: Embed UTXO Visualizer (simpler mode)

### 🔐 Security Dojo
**Current Location**: `/interactive-demos/security-dojo/` or similar
**Description**: Self-custody audit, opsec training, multi-sig

**RECOMMENDED PLACEMENT**:
- ✅ **Sovereign Path - Stage 1** (Setup & Security)
  - Currently: ONLY PLACEHOLDERS EXIST
  - Action needed: Embed Security Dojo

- ✅ **Sovereign Path - Stage 2** (Advanced Security)
  - Currently: ONLY PLACEHOLDERS EXIST
  - Action needed: Multi-sig and advanced security training

### 🎯 Consensus Game
**Current Location**: `/interactive-demos/consensus-game/`
**Description**: Play as Bitcoin node, validate blocks, handle forks

**RECOMMENDED PLACEMENT**:
- ✅ **Curious Path - Stage 2 - Module 3** (Who Controls Bitcoin?)
  - Currently: NOT INTEGRATED
  - Action needed: Embed or link to Consensus Game

- ✅ **Builder Path - Stage 1 - Module 3** (Proof of Work)
  - Currently: NOT CREATED YET
  - Action needed: Link to Consensus Game for network security

---

## Content Gaps & Priorities

### High Priority (Should exist but don't)
1. **First Principles reading content** - Philosophy foundation
2. **Sovereign Game integration** - Economic history demo
3. **Curious Path Stage 3** - "Your First Bitcoin" (wallet setup)
4. **Security Dojo** - Self-custody training

### Medium Priority (Planned but not urgent)
1. **Builder Path Stages 2-4** - Lightning, Apps, Contributing
2. **Sovereign Path Stages 1-3** - Full sovereignty journey

### Already Complete ✅
1. Curious Path Stages 1-2 (6 modules with Socratic questions + interactive governance sim)
2. Builder Path overview + Stage 1 overview + Module 1 with UTXO Visualizer

---

## Recommended Actions

### Immediate Updates Needed

#### 1. Update Curious Path Stage 2 Module 1
- Add Transaction Builder demo
- Add Mining Simulator
- Add UTXO Visualizer (basic mode)

#### 2. Update Curious Path Stage 2 Module 2
- Link to Mining Simulator for difficulty adjustment
- Add halving visualization

#### 3. Update Curious Path Stage 2 Module 3
- ✅ Already has Governance Simulator
- Add link to Consensus Game

#### 4. Update Curious Path Stage 1 Module 2
- Embed or link to Sovereign Game (economic history)

#### 5. Create Curious Path Stage 3: "Your First Bitcoin"
**Modules:**
- Module 1: Understanding Wallets → Wallet Workshop demo
- Module 2: Security Fundamentals → Security Dojo basics
- Module 3: Your First Transaction → Transaction Builder

---

## Demo Usage Strategy

### Embed vs. Link Strategy

**EMBED (iframe)** when:
- Demo is core to the lesson (UTXO Visualizer in protocol module)
- User should complete it as part of module (Wallet Workshop)
- Demo is compact and focused (Hash demo)

**LINK (separate page)** when:
- Demo is optional enrichment (Consensus Game)
- Demo is complex and needs full screen (Sovereign Game)
- Demo is referenced across multiple modules (Mining Simulator)

**REDIRECT (entire module)** when:
- Existing standalone content is comprehensive
- No additional teaching needed
- Tool is self-explanatory

---

## Philosophy & Economics Integration

### First Principles Content Should Include:
1. What is money? (barter problem, coincidence of wants)
2. Properties of good money
3. Rules without rulers concept
4. Property rights by math

### Integration Points:
- **Curious Path Module 1**: Embed First Principles reading BEFORE "What is Money?" section
- **All Paths**: Link to First Principles in overview as prerequisite

### Core Economics Content Should Include:
1. Scarcity and fixed supply
2. Incentive alignment (miners + users)
3. Time preference and saving

### Integration Points:
- **Curious Path Module 2**: Explain inflation through Core Economics lens
- **Sovereign Game**: Provides experiential learning of these concepts

### Ethics & Sovereignty Content Should Include:
1. Censorship resistance
2. Self-custody principles
3. Open access and permissionless innovation

### Integration Points:
- **Curious Path Module 3**: Ethics section before "Enter Bitcoin"
- **Sovereign Path**: Core theme throughout all stages

---

## File Structure Recommendations

```
/content/
  /philosophy/
    first-principles.html       ← First Principles reading
    core-economics.html         ← Economics concepts
    ethics-sovereignty.html     ← Ethics & values

/paths/
  /curious/
    stage-1/
      module-1.html             → Links to first-principles.html
      module-2.html             → Embeds sovereign-game
      module-3.html             → Links to ethics-sovereignty.html
    stage-2/
      module-1.html             → Embeds transaction-builder, mining-sim, utxo-viz
      module-2.html             → Links to mining-sim
      module-3.html             ✅ Has governance-sim, add consensus-game link
    stage-3/                    ← TO BE CREATED
      module-1.html             → Embeds wallet-workshop
      module-2.html             → Embeds security-dojo
      module-3.html             → Embeds transaction-builder

  /builder/
    stage-1/
      module-1.html             ✅ Has utxo-visualizer, add transaction-builder
      module-2.html             ← TO BE CREATED (crypto primitives)
      module-3.html             ← TO BE CREATED (mining-sim + consensus-game)
    stage-2/                    ← Lightning modules with lightning-lab
    stage-3/                    ← Wallet-workshop, transaction-builder
    stage-4/                    ← Contributing to Bitcoin

  /sovereign/
    stage-1/                    ← Wallet-workshop + security-dojo
    stage-2/                    ← Advanced security + multi-sig
    stage-3/                    ← Full sovereignty tools
```

---

## Next Steps Priority List

1. ✅ Create this mapping document
2. Update Curious Path modules to integrate existing demos
3. Create Philosophy & Economics content pages
4. Create Curious Path Stage 3 (Your First Bitcoin)
5. Fill in Builder Path Stage 1 remaining modules
6. Create Sovereign Path Stage 1 with security focus
7. Build out remaining Builder stages (Lightning, Apps)
8. Complete Sovereign Path stages 2-3

---

## Success Metrics

- [ ] Every interactive demo is used in at least one learning path
- [ ] No duplicate content (redirect to existing when possible)
- [ ] Philosophy & Economics foundations integrated in Curious Path
- [ ] Clear progression: Curious → Builder → Sovereign
- [ ] All demos accessible from multiple entry points
- [ ] Consistent embed vs. link strategy applied
