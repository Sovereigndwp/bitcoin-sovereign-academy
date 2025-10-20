# Interactive Demo Audit & Consolidation Plan

**Purpose**: Map all demos, identify duplicates, propose consolidation strategy for multi-path reuse.

**Last Updated**: 2025-10-20

---

## Current Demo Inventory

### Standalone Demos (HTML files)

| Demo | File | Concepts Covered | Used By Paths | Status |
|------|------|------------------|---------------|--------|
| **UTXO Visualizer v1** | `utxo-visualizer.html` | UTXO basics | None (legacy?) | ⚠️ DEPRECATE |
| **UTXO Visualizer v2** | `utxo-visualizer-v2.html` | UTXO model, inputs/outputs | None (legacy?) | ⚠️ DEPRECATE |
| **UTXO Visualizer Enhanced** | `utxo-visualizer-enhanced.html` | UTXO model, full interactivity | None yet | ✅ KEEP (canonical) |
| **Lightning Lab** | `lightning-lab.html` | LN basics, channels, HTLCs | None yet | 🔄 REVIEW (vs routing sim) |
| **Lightning Routing Sim** | `lightning-routing-sim.html` | LN routing, pathfinding, liquidity | Builder Stage 2 | 🔄 REVIEW (vs lab) |
| **Debt Crisis** | `debt-crisis.html` | Inflation, Cantillon effect, debt spiral | None yet | ✅ KEEP |
| **Energy Bucket** | `energy-bucket.html` | PoW as stored energy, time | None yet | 🔄 REVIEW (artistic vs educational?) |
| **Time Machine** | `time-machine.html` | Time preference, scarcity, economics | None yet | 🔄 REVIEW (Stage 8 econ demo?) |
| **Security Dojo** | `security-dojo.html` | Eclipse, Sybil, network attacks | None yet | ✅ KEEP |

### Directory-Based Demos

| Demo | Directory | Concepts Covered | Used By Paths | Status |
|------|-----------|------------------|---------------|--------|
| **Transaction Builder** | `transaction-builder/` | Tx structure, inputs, outputs, fees | Curious Stage 2 & 3 | ✅ KEEP |
| **Mining Simulator** | `mining-simulator/` | PoW, mining, difficulty, nonce | Curious Stage 2 | ✅ KEEP |
| **Consensus Game** | `consensus-game/` | Byzantine Generals, 51% attack | Curious S2, Builder S1 | ✅ KEEP |
| **Wallet Workshop** | `wallet-workshop/` | Wallets, seeds, backups, BIP39 | Curious Stage 3 | ✅ KEEP |
| **Bitcoin Sovereign Game** | `bitcoin-sovereign-game/` | Full gamified journey | Linked from intro | ✅ KEEP |

---

## Identified Issues & Consolidation Opportunities

### 🔴 Critical: UTXO Visualizer Duplication

**Problem**: 3 versions of the same demo
- `utxo-visualizer.html` (v1) — 2KB, basic
- `utxo-visualizer-v2.html` — 34KB
- `utxo-visualizer-enhanced.html` — 57KB, most complete

**Recommendation**:
- ✅ **Keep**: `utxo-visualizer-enhanced.html` as canonical
- ⚠️ **Deprecate**: v1 and v2
- 🔧 **Action**: Add 301 redirects, update any links

**Multi-Path Strategy**:
- All paths use `utxo-visualizer-enhanced.html`
- Add difficulty modes: `?mode=beginner` / `?mode=advanced`
- **Beginner** (Curious): Pre-filled examples, guided tooltips
- **Advanced** (Builder): Raw mode, multi-input/output, script inspection

---

### 🟡 Moderate: Lightning Demos Overlap

**Problem**: 2 separate Lightning demos
- `lightning-lab.html` — General LN exploration
- `lightning-routing-sim.html` — Routing-specific

**Recommendation**:
- 🔄 **Audit overlap**: Do these teach different concepts or duplicate content?
- **If different**:
  - `lightning-lab.html` → Channels, HTLCs, opening/closing (Curious + Sovereign)
  - `lightning-routing-sim.html` → Pathfinding, liquidity, rebalancing (Builder + Sovereign)
- **If duplicate**:
  - Merge into one comprehensive `lightning-lab-enhanced.html` with tabs:
    - **Tab 1**: Channel basics
    - **Tab 2**: Routing & pathfinding
    - **Tab 3**: Advanced (channel factories, splicing)

**Multi-Path Strategy**:
- Curious: Starts on Tab 1 (basics)
- Builder: Starts on Tab 2 (routing)
- Sovereign: Access to all tabs + advanced challenges

---

### 🟢 Low Priority: Conceptual/Artistic Demos

**Demos**: `energy-bucket.html`, `time-machine.html`
- These are more philosophical/artistic than hands-on
- Useful for motivation and metaphor

**Recommendation**:
- ✅ **Keep both** but position as "Conceptual Explorations"
- Link from Stage 0 (intro) and Stage 8 (philosophy)
- Not core to learning paths, but valuable for deep understanding

---

## Multi-Level Demo Design Pattern

All major demos should support **3 difficulty levels** to serve all paths without duplication.

### Implementation Pattern

#### URL Parameters
```
/interactive-demos/demo-name.html?level=beginner
/interactive-demos/demo-name.html?level=intermediate
/interactive-demos/demo-name.html?level=advanced
```

#### Level Characteristics

| Level | Target Path | Features |
|-------|-------------|----------|
| **Beginner** | Curious | Pre-filled examples, guided tooltips, simple challenges, "Why this matters" explanations |
| **Intermediate** | Sovereign | Blank slate, hints on demand, real-world scenarios, privacy/security focus |
| **Advanced** | Builder | Raw mode, technical details exposed, multi-step challenges, code inspection |

#### Example: Transaction Builder

**Beginner Mode** (Curious):
- Pre-populated wallet with 3 UTXOs
- Challenge: "Send 0.01 BTC to Alice"
- Tooltips explain inputs, outputs, change
- Fee calculated automatically with explanation

**Intermediate Mode** (Sovereign):
- Blank wallet, must import UTXOs from mempool
- Challenge: "Create a payment with optimal privacy"
- Hints about coin control, avoiding address reuse
- Manual fee selection with market data

**Advanced Mode** (Builder):
- Raw transaction construction
- Challenge: "Build a multi-sig transaction with SegWit"
- Expose hex, inspect scripts, calculate witness discount
- Validate against consensus rules

---

## Proposed Demo Library Structure

Organize demos by **concept**, not path:

```
/interactive-demos/
  ├── index.html                    # Demo hub with filtering by concept/difficulty
  ├── concepts/
  │   ├── utxo-model/
  │   │   └── index.html           # utxo-visualizer-enhanced (multi-level)
  │   ├── transactions/
  │   │   └── index.html           # transaction-builder (multi-level)
  │   ├── mining-pow/
  │   │   └── index.html           # mining-simulator (multi-level)
  │   ├── consensus/
  │   │   └── index.html           # consensus-game (multi-level)
  │   ├── wallets-keys/
  │   │   └── index.html           # wallet-workshop (multi-level)
  │   ├── lightning/
  │   │   └── index.html           # Merged LN demo (multi-level)
  │   ├── network-security/
  │   │   └── index.html           # security-dojo (multi-level)
  │   └── economics/
  │       ├── debt-crisis.html
  │       ├── time-machine.html
  │       └── energy-bucket.html
  └── legacy/                       # Archived old versions
      ├── utxo-visualizer.html
      └── utxo-visualizer-v2.html
```

### Demo Metadata (in each demo)

Add JSON-LD or front-matter to each demo:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LearningResource",
  "name": "UTXO Visualizer",
  "description": "Interactive exploration of Bitcoin's UTXO model",
  "educationalLevel": ["beginner", "intermediate", "advanced"],
  "teaches": ["UTXO model", "Transaction inputs", "Transaction outputs", "Change addresses"],
  "timeRequired": "PT10M",
  "interactivityType": "active",
  "learningResourceType": "simulation",
  "typicalAgeRange": "16+",
  "accessibilityFeature": ["alternativeText", "longDescription"],
  "usageInfo": "Used in Curious Stage 2, Builder Stage 1, Sovereign Stage 1"
}
</script>
```

---

## Path Integration Strategy

Each path links to demos with **persona-specific context**:

### Example: Curious Path, Stage 2, Module 1 (How Bitcoin Works)

**In Module Text**:
```markdown
## Understanding UTXOs

Bitcoin doesn't use account balances like a bank. Instead, it uses **Unspent Transaction Outputs (UTXOs)**—think of them as discrete coins you can spend.

> 🎯 **Try It**: Explore how UTXOs work with our interactive visualizer.
>
> **Your Challenge** (5 min):
> 1. Create a simple transaction with 1 input and 2 outputs
> 2. Notice what happens to the change
> 3. Try spending the same UTXO twice—what happens?
>
> [Launch UTXO Visualizer →](/interactive-demos/concepts/utxo-model/?level=beginner&path=curious&module=stage-2-module-1)
```

### Example: Builder Path, Stage 1, Module 1 (Bitcoin Protocol Deep Dive)

**In Module Text**:
```markdown
## UTXO Set and Transaction Validation

Bitcoin's UTXO model enables parallel validation—nodes can verify transactions independently without locking account state.

> ⚙️ **Build Mode**: Construct a complex transaction from scratch.
>
> **Your Challenge** (10 min):
> 1. Build a transaction with 3 inputs (including one P2SH)
> 2. Create 2 outputs with custom scripts
> 3. Calculate the fee manually and inspect the witness data
>
> [Launch Transaction Builder →](/interactive-demos/concepts/utxo-model/?level=advanced&path=builder&module=stage-1-module-1)
```

---

## Implementation Roadmap

### Phase 1: Consolidate Duplicates (Week 1)
- [ ] Confirm `utxo-visualizer-enhanced.html` is feature-complete
- [ ] Archive v1 and v2 to `/interactive-demos/legacy/`
- [ ] Update all path modules to use enhanced version
- [ ] Add 301 redirects

### Phase 2: Add Multi-Level Support (Weeks 2-3)
- [ ] Implement URL parameter parsing (`?level=beginner|intermediate|advanced`)
- [ ] Add level-specific UI/tooltips/challenges to:
  - [ ] UTXO Visualizer
  - [ ] Transaction Builder
  - [ ] Mining Simulator
  - [ ] Consensus Game
  - [ ] Wallet Workshop

### Phase 3: Audit Lightning Demos (Week 4)
- [ ] Compare `lightning-lab.html` vs `lightning-routing-sim.html`
- [ ] Decide: merge or keep separate?
- [ ] If merge: Create `lightning-lab-enhanced.html` with tabs
- [ ] If separate: Clarify which teaches what, add cross-links

### Phase 4: Reorganize Demo Library (Week 5)
- [ ] Create `/interactive-demos/concepts/` structure
- [ ] Move demos into concept folders
- [ ] Update all path links
- [ ] Build filterable demo hub (`/interactive-demos/index.html`)

### Phase 5: Add Metadata & Analytics (Week 6)
- [ ] Add JSON-LD metadata to each demo
- [ ] Track which path/level users enter from
- [ ] Log completion rates by difficulty
- [ ] Identify drop-off points for improvement

---

## Success Metrics

After consolidation:
- ✅ **Zero duplicate demos** teaching the same concept
- ✅ **All major demos support 3 levels** (beginner/intermediate/advanced)
- ✅ **Each path links to optimal demo level** for persona
- ✅ **Demo completion rate increases** (less confusion from redundant versions)
- ✅ **Maintenance overhead decreases** (update one demo, not three)

---

## Demo-to-Concept Mapping (Quick Reference)

| Concept | Canonical Demo | Levels | Paths Using |
|---------|----------------|--------|-------------|
| UTXO model | `/concepts/utxo-model/` | B/I/A | Curious S2, Builder S1, Sovereign S1 |
| Transaction structure | `/concepts/transactions/` | B/I/A | Curious S2/S3, Builder S1/S2 |
| Mining & PoW | `/concepts/mining-pow/` | B/I/A | Curious S2, Builder S1 |
| Consensus | `/concepts/consensus/` | B/I/A | Curious S2, Builder S1, Sovereign S2 |
| Wallets & keys | `/concepts/wallets-keys/` | B/I/A | Curious S3, Sovereign S1 |
| Lightning Network | `/concepts/lightning/` | B/I/A | Builder S2, Sovereign S3 |
| Network security | `/concepts/network-security/` | B/I/A | Builder S2, Sovereign S2 |
| Inflation & debt | `/concepts/economics/debt-crisis.html` | Single | Curious S1, Hurried |
| Time preference | `/concepts/economics/time-machine.html` | Single | Curious S1, Builder S3 |
| PoW as energy | `/concepts/economics/energy-bucket.html` | Single | Curious S2 |

---

## Questions for Decision

1. **Lightning demos**: Merge or keep separate? (Need to compare feature sets)
2. **Artistic demos** (energy-bucket, time-machine): Core curriculum or optional enrichment?
3. **Bitcoin Sovereign Game**: Is this a standalone onboarding experience or integrated into paths?
4. **Demo hub redesign**: Organize by concept, difficulty, or keep flat list?
5. **Legacy content migration**: What happens to `/curriculum/` modules? Merge into paths or keep as reference?

---

**Next Steps**:
1. Review this audit with team
2. Decide on Lightning demo strategy (compare features side-by-side)
3. Prioritize Phase 1 (UTXO consolidation) for immediate wins
4. Prototype multi-level implementation on one demo (UTXO Visualizer)
5. Gather feedback before rolling out to all demos
