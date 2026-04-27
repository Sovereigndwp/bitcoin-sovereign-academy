# Comprehensive Resource Database — All Bitcoin Sovereign Academy Content

**Purpose**: Master inventory of ALL educational resources across current repo, curriculum folders, and cloned source repos.

**Last Updated**: 2025-10-20

---

## Content Sources

### 1. Current Repo: `/interactive-demos/`
Location: `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/`

### 2. Current Repo: `/deep-dives/`
Location: `/Users/dalia/projects/bitcoin-sovereign-academy/deep-dives/`

### 3. Current Repo: `/paths/`
Location: `/Users/dalia/projects/bitcoin-sovereign-academy/paths/`

### 4. Cloned Repo: Learn-bitcoin-by-doing
Location: `/Users/dalia/projects/Learn-bitcoin-by-doing/`
Type: React app with modular components

### 5. Cloned Repo: bitcoin-first-principles-site
Location: `/Users/dalia/projects/bitcoin-first-principles-site/`
Type: Standalone HTML

---

## Complete Resource Inventory

### Interactive Demos (/interactive-demos/)

| Demo | Type | Concepts | Status | Clone Source |
|------|------|----------|--------|--------------|
| **utxo-visualizer.html** | Standalone HTML | UTXO basics | ⚠️ Deprecate (v1) | Unknown |
| **utxo-visualizer-v2.html** | Standalone HTML | UTXO model | ⚠️ Deprecate (v2) | Unknown |
| **utxo-visualizer-enhanced.html** | Standalone HTML | UTXO model (comprehensive) | ✅ Keep (canonical) | Unknown |
| **transaction-builder/** | Directory | Tx structure, inputs, outputs, fees | ✅ Keep | Likely from Learn-bitcoin-by-doing TransactionsModule |
| **mining-simulator/** | Directory | PoW, mining, difficulty, nonce | ✅ Keep | Likely from Learn-bitcoin-by-doing MiningModule |
| **consensus-game/** | Directory | Byzantine Generals, 51% attack, consensus | ✅ Keep | Unknown |
| **wallet-workshop/** | Directory | Wallets, seeds, backups, BIP39, testnet | ✅ Keep | Likely from Learn-bitcoin-by-doing CustodyModule |
| **lightning-lab.html** | Standalone HTML | LN basics, channels, HTLCs | 🔄 Review | Likely from Learn-bitcoin-by-doing LightningModule |
| **lightning-routing-sim.html** | Standalone HTML | LN routing, pathfinding, liquidity | 🔄 Review (merge?) | Likely from Learn-bitcoin-by-doing LightningModule |
| **security-dojo.html** | Standalone HTML | Eclipse, Sybil, network attacks | ✅ Keep | Unknown |
| **debt-crisis.html** | Standalone HTML | Inflation, Cantillon effect, debt spiral | ✅ Keep | Unknown |
| **energy-bucket.html** | Standalone HTML | PoW as energy, time | 🔄 Review | Unknown |
| **bitcoin-genesis-timeline/** | Interactive demo | Cryptographic lineage: Chaum, b-money, RPOW, Bit Gold | ✅ Keep | Unknown |
| **bitcoin-sovereign-game/** | Directory | Full gamified journey | ✅ Keep | Unknown |

---

### Curriculum Content (/deep-dives/)

| Resource | Type | Concepts | Interactive Content | Status |
|----------|------|----------|---------------------|--------|
| **first-principles/index.html** | Embedded interactives | Trust, double-spend, consensus, ledgers | ✅ YES — has inline demos: trust cards, transaction flow, consensus grid, ledger demo | 🔄 Extract or keep embedded? |
| **first-principles/original-question-everything.html** | Landing page | Philosophy, first principles | No | 🔄 Review vs. index.html |
| **philosophy-economics/index.html** | Landing page | Scarcity, incentives, time preference, ethics | No (links to demos) | ✅ Keep as landing |
| **sovereign-tools/index.html** | Landing page | Self-custody, payments, privacy | No (links to demos) | ✅ Keep as landing |

---

### Learn-bitcoin-by-doing Modules (Cloned Repo)

Location: `../Learn-bitcoin-by-doing/src/modules/`

| Module | File | Concepts | Integrated? | Status |
|--------|------|----------|-------------|--------|
| **Money Module** | `MoneyModule.js` | History of money, functions, properties | ❓ Check | 🔍 Audit |
| **Why Bitcoin Matters** | `WhyBitcoinMattersModule.js` | Bitcoin origin, problems solved | ❓ Check | 🔍 Audit |
| **Numbers Module** | `NumbersModule.js` | Bitcoin units, precision, supply | ❓ Check | 🔍 Audit |
| **Hashing Module** | `HashingModule.js` | SHA-256, hash functions, properties | ❓ Check | 🔍 Audit |
| **Keys Module** | `KeysModule.js` | Public/private keys, ECDSA, signatures | ❓ Check | 🔍 Audit |
| **Transactions Module** | `TransactionsModule.js` | Tx structure, inputs, outputs | ✅ Likely integrated into transaction-builder | 🔍 Audit |
| **Mining Module** | `MiningModule.js` | PoW, difficulty, nonce | ✅ Likely integrated into mining-simulator | 🔍 Audit |
| **Merkle Module** | `MerkleModule.js` | Merkle trees, SPV | ❓ Check | 🔍 Audit |
| **Scripts Module** | `ScriptsModule.js` | Bitcoin Script, locking conditions | ❓ Check | 🔍 Audit |
| **Lightning Module** | `LightningModule.js` | LN channels, HTLCs, routing | ⚠️ Partially integrated? | 🔍 Audit |
| **Custody Module** | `CustodyModule.js` | Wallets, seeds, backups | ✅ Likely integrated into wallet-workshop | 🔍 Audit |
| **Bitcoin Toolkit** | `BitcoinToolkitModule.js` | Tools, resources, libraries | ❓ Check | 🔍 Audit |
| **Advanced Topics** | `AdvancedTopicsModule.js` | Taproot, Schnorr, advanced features | ❓ Check | 🔍 Audit |
| **Myths Module** | `MythsModule.js` | Common misconceptions | ❓ Check | 🔍 Audit |
| **Bitcoin Basics** | `BitcoinBasicsModule.js` | General overview | ❓ Check | 🔍 Audit |

---

### Learn-bitcoin-by-doing Components (Cloned Repo)

Location: `../Learn-bitcoin-by-doing/src/components/`

| Component | File | Purpose | Integrated? | Status |
|-----------|------|---------|-------------|--------|
| **ProofOfWorkDemo** | `ProofOfWorkDemo.jsx` | Interactive PoW demo | ⚠️ Check if in mining-simulator | 🔍 Audit |
| **InteractiveIcon** | `InteractiveIcon.js` | UI element for interactives | ❓ | 🔍 Audit |
| Other components | (69 total in directory) | Various UI/demo components | ❓ | 🔍 Full scan needed |

---

### First Principles Site (Cloned Repo)

Location: `../bitcoin-first-principles-site/index.html`

**Status**: Single standalone HTML file (130KB)

**Content**: Full interactive first-principles guide with embedded demos

**Relationship to current repo**:
- Current `/deep-dives/first-principles/index.html` appears to be derived from this
- Should compare to see if they're identical or if features were lost

**Action**:
- 🔍 Compare `../bitcoin-first-principles-site/index.html` with `/deep-dives/first-principles/index.html`
- Determine if one is canonical or if they should be merged

---

## Consolidation Strategy

### Phase 1: Audit Learn-bitcoin-by-doing Integration

**Goal**: Determine which modules from Learn-bitcoin-by-doing have been integrated and which are missing.

**Actions**:
- [ ] For each module, check if content exists in current repo
- [ ] Identify missing modules that should be integrated
- [ ] Flag duplicated content for consolidation

**Suggested Process**:
```bash
# For each module, search current repo for similar concepts
grep -r "hash function" paths/ curriculum/ interactive-demos/ --include="*.html"
grep -r "Merkle tree" paths/ curriculum/ interactive-demos/ --include="*.html"
# etc.
```

---

### Phase 2: Extract Embedded Interactives from /deep-dives/

**Problem**: `/deep-dives/first-principles/index.html` has interactive demos embedded inline. These should be extracted to `/interactive-demos/` for reusability across paths.

**Embedded Demos to Extract**:
1. **Trust Demo** — Trust vs. trustless comparison cards
2. **Double-Spend Demo** — Transaction flow visualization
3. **Consensus Grid** — Node consensus simulation
4. **Ledger Demo** — Distributed ledger visualization

**Action Plan**:
- [ ] Extract each embedded demo into standalone files in `/interactive-demos/concepts/`
- [ ] Replace inline code with `<iframe>` or links to extracted demos
- [ ] Ensure extracted demos support multi-level (beginner/intermediate/advanced)

---

### Phase 3: Consolidate Duplicate Content

**Identified Duplicates**:

#### 1. UTXO Visualizers (3 versions)
- ✅ **Action**: Keep `utxo-visualizer-enhanced.html` as canonical
- ⚠️ **Action**: Archive v1 and v2

#### 2. Lightning Demos (2 versions)
- 🔍 **Action**: Compare `lightning-lab.html` vs. `lightning-routing-sim.html`
- 🔄 **Decision Needed**: Merge or keep separate?

#### 3. First Principles Content (2 versions)
- 🔍 **Action**: Compare `../bitcoin-first-principles-site/index.html` vs. `/deep-dives/first-principles/index.html`
- 🔄 **Decision Needed**: Are they identical? If not, which is canonical?

---

### Phase 4: Integrate Missing Modules

**Modules from Learn-bitcoin-by-doing NOT yet integrated**:
- Numbers Module (Bitcoin units, satoshis, precision)
- Merkle Module (Merkle trees, SPV)
- Scripts Module (Bitcoin Script)
- Myths Module (Common misconceptions)
- Advanced Topics Module (Taproot, Schnorr)

**Actions**:
- [ ] Review each module for educational value
- [ ] Decide which to integrate into paths
- [ ] Extract interactive components and adapt to multi-level pattern
- [ ] Map to appropriate path stages

---

### Phase 5: Build Unified Content Library

**Goal**: Create a path-agnostic library where every concept has:
- ✅ One canonical module (text/explanation)
- ✅ One canonical demo (interactive, multi-level)
- ✅ Metadata (concepts taught, prerequisites, difficulty, time)

**Structure**:
```
/content-library/
  ├── concepts/
  │   ├── money-basics/
  │   │   ├── module.html         # Canonical text module
  │   │   ├── demo.html            # Interactive demo (multi-level)
  │   │   └── metadata.json        # Concepts, prereqs, difficulty
  │   ├── hash-functions/
  │   │   ├── module.html
  │   │   ├── demo.html
  │   │   └── metadata.json
  │   ├── utxo-model/
  │   │   ├── module.html
  │   │   ├── demo.html            # utxo-visualizer-enhanced
  │   │   └── metadata.json
  │   └── ...
  └── index.json                    # Master index of all concepts
```

**Paths Reference the Library**:
```
/paths/curious/stage-2/module-1.html
  → Links to /content-library/concepts/utxo-model/?level=beginner&path=curious
```

**Benefits**:
- Single source of truth per concept
- Paths can reuse content with different levels/context
- Easy to maintain (update once, all paths reflect changes)
- New paths can be created by curating existing concepts

---

## Metadata Schema for Content Library

Each concept gets a `metadata.json`:

```json
{
  "concept": "utxo-model",
  "title": "Bitcoin's UTXO Model",
  "description": "How Bitcoin tracks ownership using Unspent Transaction Outputs",
  "reading_time": "12 min",
  "demo_time": "10 min",
  "difficulty_levels": ["beginner", "intermediate", "advanced"],
  "prerequisites": [
    "hash-functions",
    "public-key-crypto"
  ],
  "teaches": [
    "UTXO definition",
    "Transaction inputs and outputs",
    "Change addresses",
    "Double-spend prevention"
  ],
  "used_in_paths": [
    {
      "path": "curious",
      "stage": 2,
      "module": 1,
      "level": "beginner"
    },
    {
      "path": "builder",
      "stage": 1,
      "module": 1,
      "level": "advanced"
    },
    {
      "path": "sovereign",
      "stage": 1,
      "module": 2,
      "level": "intermediate"
    }
  ],
  "sources": [
    "Learn-bitcoin-by-doing TransactionsModule.js",
    "Original development"
  ],
  "last_updated": "2025-10-20",
  "version": "2.0"
}
```

---

## Action Items & Prioritization

### 🔴 High Priority (Do First)
- [ ] **Compare first-principles content**: `../bitcoin-first-principles-site/index.html` vs. `/deep-dives/first-principles/index.html`
- [ ] **Audit Learn-bitcoin-by-doing integration**: Map which modules are already integrated
- [ ] **Extract embedded demos**: Pull inline interactives from `/deep-dives/first-principles/` into `/interactive-demos/`
- [ ] **Consolidate UTXO demos**: Archive v1/v2, enhance `utxo-visualizer-enhanced.html` with multi-level

### 🟡 Medium Priority (Do Next)
- [ ] **Lightning demo consolidation**: Compare and decide merge vs. separate
- [ ] **Integrate missing modules**: Numbers, Merkle, Scripts from Learn-bitcoin-by-doing
- [ ] **Build content library structure**: Create `/content-library/concepts/` with metadata
- [ ] **Add metadata to existing demos**: Retroactively add metadata.json to all demos

### 🟢 Low Priority (Do Eventually)
- [ ] **Scan all 69 components**: Full audit of Learn-bitcoin-by-doing components for hidden gems
- [ ] **Other cloned repos**: Check bitcoin-learning-latest, bitcoin-learning-nextjs for unique content
- [ ] **Advanced topics integration**: Taproot, Schnorr, etc. (lower priority, advanced learners only)
- [ ] **Myths module**: Integrate misconceptions module into paths

---

## Questions for Decision

### 1. First Principles Content
**Q**: Are `../bitcoin-first-principles-site/index.html` and `/deep-dives/first-principles/index.html` identical?
- If YES → Keep one, archive the other
- If NO → Which is canonical? Or merge the best of both?

### 2. Learn-bitcoin-by-doing Integration
**Q**: Should we integrate ALL modules from Learn-bitcoin-by-doing, or only the most valuable ones?
- **Option A**: Integrate everything (comprehensive but time-consuming)
- **Option B**: Cherry-pick high-value modules (faster, focused)
- **Recommendation**: Option B — prioritize modules that fill gaps (Merkle, Scripts, Numbers)

### 3. Content Library vs. Current Structure
**Q**: Should we restructure NOW to `/content-library/`, or consolidate in-place first?
- **Option A**: Restructure immediately (clean slate, best long-term)
- **Option B**: Consolidate in current structure, restructure later (faster short-term wins)
- **Recommendation**: Option B — consolidate duplicates first, then restructure when patterns are clear

### 4. Embedded Interactives
**Q**: Should embedded demos in `/deep-dives/first-principles/` stay inline or be extracted?
- **Option A**: Extract to standalone files (reusable, multi-level capable)
- **Option B**: Keep embedded (simpler, all-in-one experience)
- **Recommendation**: Option A — extract for reusability across paths

---

## Next Steps (Immediate Actions)

1. **Run comparison script** on first-principles files:
   ```bash
   diff ../bitcoin-first-principles-site/index.html curriculum/first-principles/index.html
   ```

2. **Create Learn-bitcoin-by-doing integration checklist**:
   - For each module, check if content exists in current repo
   - Mark ✅ integrated, ⚠️ partially integrated, or ❌ missing

3. **Extract embedded demos**:
   - Start with Trust Demo from `/deep-dives/first-principles/`
   - Create `/interactive-demos/concepts/trust-demo.html`
   - Replace inline code with `<iframe>` or link

4. **Archive UTXO v1/v2**:
   - Move to `/interactive-demos/legacy/`
   - Add 301 redirects
   - Update all path links to use enhanced version

5. **Document learnings**: After first few consolidations, update this doc with lessons learned

---

## Resource Mapping Table (Quick Reference)

| Concept | Current Repo Demo | Learn-bitcoin-by-doing Module | Status |
|---------|-------------------|-------------------------------|--------|
| UTXO Model | `utxo-visualizer-enhanced.html` | TransactionsModule.js | ✅ Integrated |
| Transactions | `transaction-builder/` | TransactionsModule.js | ✅ Integrated |
| Mining/PoW | `mining-simulator/` | MiningModule.js | ✅ Integrated |
| Wallets/Keys | `wallet-workshop/` | CustodyModule.js + KeysModule.js | ⚠️ Partially |
| Lightning | `lightning-lab.html` + `lightning-routing-sim.html` | LightningModule.js | ⚠️ Review |
| Hashing | ❌ None | HashingModule.js | ❌ Missing |
| Merkle Trees | ❌ None | MerkleModule.js | ❌ Missing |
| Bitcoin Script | ❌ None | ScriptsModule.js | ❌ Missing |
| Bitcoin Units | ❌ None | NumbersModule.js | ❌ Missing |
| Consensus | `consensus-game/` | (May be original) | ✅ Integrated |
| Money Basics | `/deep-dives/first-principles/` | MoneyModule.js | ⚠️ Check overlap |
| Network Security | `security-dojo.html` | (May be original) | ✅ Integrated |
| Economics | `debt-crisis.html`, `bitcoin-genesis-timeline/` | (May be original) | ✅ Integrated |

---

**Last Updated**: 2025-10-20
**Status**: Initial audit complete, deep dive actions defined
**Owner**: [Your name/team]
