# Bitcoin Sovereign Academy — Restructure Summary & Next Steps

**Date**: 2025-10-20
**Status**: Planning complete, ready for execution

---

## What We Discovered

### Your Current Architecture
- **4 Learning Paths**: Curious (🌱), Builder (⚙️), Sovereign (👑), Hurried (⚡)
- **Paths have overlapping concepts** but teach them at different depths/focus
- **Content scattered across**:
  - `/paths/` (4 persona-based learning journeys)
  - `/interactive-demos/` (15+ interactive demos)
  - `/curriculum/` (first-principles, philosophy, sovereign-tools)
  - `../Learn-bitcoin-by-doing/` (cloned React modules with additional content)
  - `../bitcoin-first-principles-site/` (standalone HTML with embedded demos)

### Key Problems Identified
1. **Demo duplication**: 3 versions of UTXO visualizer, 2 Lightning demos
2. **Embedded interactives**: First-principles has inline demos that should be extracted for reuse
3. **Missing integrations**: Learn-bitcoin-by-doing has Hashing, Keys, Script, Merkle modules not yet integrated
4. **No multi-level support**: Demos don't adapt to beginner/intermediate/advanced
5. **No single source of truth**: Same concept explained differently across paths

---

## Documents Created for You

### 1. **Demo Audit & Consolidation Plan**
**File**: `/docs/demo-audit-consolidation.md`

**What it does**:
- Inventories ALL interactive demos (standalone + directory-based)
- Identifies duplicates (3× UTXO visualizers, 2× Lightning demos)
- Proposes consolidation strategy (keep enhanced versions, archive old)
- Maps demos to concepts for multi-path reuse

**Key recommendations**:
- Keep `utxo-visualizer-enhanced.html` as canonical, deprecate v1/v2
- Review Lightning demos: merge or clarify which teaches what
- Extract embedded demos from curriculum for reusability

---

### 2. **Multi-Level Demo Implementation Guide**
**File**: `/docs/multi-level-demo-implementation.md`

**What it does**:
- Technical guide for retrofitting demos to support 3 difficulty levels
- URL parameter pattern: `?level=beginner|intermediate|advanced`
- JavaScript code examples for level detection and UI adaptation
- CSS patterns for showing/hiding beginner vs. advanced UI elements

**How it works**:
- Same demo, different experience:
  - **Beginner** (Curious): Pre-filled examples, verbose tooltips, simple challenges
  - **Intermediate** (Sovereign): Blank slate, hints on request, real-world scenarios
  - **Advanced** (Builder): Raw mode, technical panels, no hand-holding

**Rollout plan**:
- Prototype on UTXO Visualizer first (Week 1)
- Refine pattern based on feedback (Week 2)
- Scale to all demos (Weeks 3-5)

---

### 3. **Comprehensive Resource Database**
**File**: `/docs/comprehensive-resource-database.md`

**What it does**:
- Master inventory of ALL content across repo + cloned sources
- Maps which Learn-bitcoin-by-doing modules are integrated vs. missing
- Identifies embedded demos in `/curriculum/first-principles/` to extract
- Proposes unified content library structure

**Key findings**:
- ✅ **Integrated**: Transactions, Mining, Consensus, Wallets (from Learn-bitcoin-by-doing)
- ❌ **Missing**: Hashing, Keys, Script, Merkle, Numbers modules (still in Learn-bitcoin-by-doing)
- 🔍 **Needs review**: First-principles content (compare repo version vs. cloned version)

**Proposed structure**:
```
/content-library/concepts/
  ├── utxo-model/
  │   ├── module.html       # Canonical text
  │   ├── demo.html         # Interactive (multi-level)
  │   └── metadata.json     # Concepts, prereqs, paths using
  └── ... (one folder per concept)
```

---

### 4. **Canonical Concept Index (Multi-Path Edition)**
**File**: `/docs/concepts-revised.md`

**What it does**:
- Maps EVERY Bitcoin concept to ONE canonical resource
- Shows which paths use which concepts (Curious S2, Builder S1, etc.)
- Tracks integration status (✅ complete, ⚠️ partial, ❌ missing)
- Defines how paths reference shared content at different levels

**Example entry**:
| Concept | Canonical Demo | Used In Paths |
|---------|----------------|---------------|
| UTXO model | `utxo-visualizer-enhanced.html` | 🌱 Curious S2, ⚙️ Builder S1, 👑 Sovereign S1 |

**Status tracking**:
- ✅ **Complete**: Philosophy, Economics (text + demos exist)
- ⚠️ **Partial**: UTXOs, Transactions, Mining (demos exist, need canonical text)
- ❌ **Missing**: Hashing, Keys, Script, Merkle (need integration from Learn-bitcoin-by-doing)

---

### 5. **Original Planning Docs** (From Initial Misunderstanding)
**Files**:
- `/docs/concepts.md` (original, single-path assumption)
- `/docs/bridges.md` (bridge modules between stages)
- `/docs/module-template.md` (standardized module structure)
- `/docs/restructure-checklist.md` (10-week implementation plan)
- `/docs/audit-template.csv` (content inventory spreadsheet)

**Status**: These are still useful but need adaptation for multi-path architecture. The revised docs supersede them where there's overlap.

---

## Immediate Action Items (Prioritized)

### 🔴 Phase 1: Quick Wins (Week 1)

#### 1. Consolidate UTXO Visualizers
- [ ] Confirm `utxo-visualizer-enhanced.html` is feature-complete
- [ ] Move v1 and v2 to `/interactive-demos/legacy/`
- [ ] Update all path links to use enhanced version
- [ ] Add 301 redirects (if site is live)

#### 2. Compare First-Principles Content
```bash
diff ../bitcoin-first-principles-site/index.html curriculum/first-principles/index.html
```
- [ ] Determine if they're identical or if features were lost
- [ ] Keep canonical version, archive or merge the other

#### 3. Extract One Embedded Demo
- [ ] Pick the Trust Demo from `/curriculum/first-principles/index.html`
- [ ] Extract to `/interactive-demos/concepts/trust-demo.html`
- [ ] Replace inline code with `<iframe>` or link
- [ ] Test across paths

---

### 🟡 Phase 2: Demo Multi-Level Retrofit (Weeks 2-4)

#### 4. Prototype Multi-Level on UTXO Visualizer
- [ ] Implement URL parameter parsing (`?level=beginner|intermediate|advanced`)
- [ ] Create 3 configurations (beginner/intermediate/advanced)
- [ ] Add CSS classes for show/hide based on level
- [ ] Test with 3 users (one per persona)
- [ ] Document learnings and adjust pattern

#### 5. Scale Multi-Level to All Demos
- [ ] Transaction Builder
- [ ] Mining Simulator
- [ ] Consensus Game
- [ ] Wallet Workshop
- [ ] Lightning (after consolidation decision)
- [ ] Security Dojo

#### 6. Update Path Links
- [ ] Update all path modules to link with `?level=beginner|intermediate|advanced`
- [ ] Test full path flows

---

### 🟢 Phase 3: Content Integration (Weeks 5-8)

#### 7. Audit Learn-bitcoin-by-doing Integration
For each module in `../Learn-bitcoin-by-doing/src/modules/`:
- [ ] Check if content exists in current repo
- [ ] If missing, decide: integrate or skip?
- [ ] Priority integrations:
  - [ ] HashingModule.js → Create `/interactive-demos/concepts/hashing/`
  - [ ] KeysModule.js → Enhance `/interactive-demos/wallet-workshop/` or create new
  - [ ] ScriptsModule.js → Create `/interactive-demos/concepts/script/`
  - [ ] MerkleModule.js → Create `/interactive-demos/concepts/merkle/`

#### 8. Lightning Demo Consolidation
- [ ] Compare `lightning-lab.html` vs. `lightning-routing-sim.html` feature-by-feature
- [ ] **Decision**: Merge into one comprehensive demo with tabs, OR keep separate with clear distinctions
- [ ] If merge: Create `lightning-lab-enhanced.html` with:
  - Tab 1: Channel basics
  - Tab 2: Routing & pathfinding
  - Tab 3: Advanced (channel factories, splicing)
- [ ] Update all path links

#### 9. Create Canonical Text Modules
For concepts that have demos but no text:
- [ ] UTXO Model → Write canonical explanation
- [ ] Transactions → Write canonical explanation
- [ ] Mining & PoW → Write canonical explanation
- [ ] Consensus → Write canonical explanation
- [ ] etc.

Use `/docs/module-template.md` as structure guide.

---

### ⚪ Phase 4: Content Library Restructure (Weeks 9-12)

#### 10. Build Content Library Structure
- [ ] Create `/content-library/concepts/` directory
- [ ] Move consolidated demos into concept folders
- [ ] Add `metadata.json` to each concept
- [ ] Build master `index.json`

#### 11. Migrate Paths to Reference Library
- [ ] Update path modules to link to `/content-library/concepts/...`
- [ ] Test all 4 paths end-to-end
- [ ] Ensure old URLs redirect properly

#### 12. Build Demo Hub
- [ ] Create filterable demo index at `/interactive-demos/index.html`
- [ ] Filter by: concept, difficulty, time, path
- [ ] Show "Used in: Curious S2, Builder S1" badges

---

## Decision Points (Need Your Input)

### 1. Lightning Demos: Merge or Keep Separate?
**Options**:
- **A**: Merge into one comprehensive demo with tabs (cleaner, single source)
- **B**: Keep separate, clarify which teaches what (less refactoring)

**Need**: Compare feature sets to decide

---

### 2. Learn-bitcoin-by-doing Integration Scope
**Options**:
- **A**: Integrate ALL modules (comprehensive but time-consuming)
- **B**: Cherry-pick high-value modules only (faster, focused)

**Recommendation**: Option B — prioritize:
- ✅ Hashing (foundational)
- ✅ Keys & Signatures (foundational)
- ✅ Script (builder-specific)
- ✅ Merkle (builder-specific)
- ⚠️ Numbers (nice-to-have, low priority)
- ⚠️ Myths (nice-to-have, can be standalone)

---

### 3. Embedded Demos: Extract or Keep Inline?
**Options**:
- **A**: Extract all to standalone files (reusable, multi-level capable)
- **B**: Keep embedded (simpler, all-in-one experience)

**Recommendation**: Option A — extract for cross-path reuse

---

### 4. Content Library: Restructure Now or Later?
**Options**:
- **A**: Restructure to `/content-library/` immediately (clean slate, best long-term)
- **B**: Consolidate in current structure first, restructure later (faster short-term wins)

**Recommendation**: Option B — prove consolidation value first, then restructure

---

## Success Metrics

After consolidation (measure at 3 months post-launch):

- ✅ **Zero duplicate demos** teaching the same concept
- ✅ **All major demos support 3 levels** (beginner/intermediate/advanced)
- ✅ **Demo completion rate increases** by 20%+ (less confusion)
- ✅ **Maintenance time decreases** by 50%+ (update once, not thrice)
- ✅ **Missing concepts filled**: Hashing, Keys, Script, Merkle integrated
- ✅ **Path completion rates improve**: Learners reach later stages more often

---

## Tools & Scripts You Can Use

### Compare First-Principles Files
```bash
diff ../bitcoin-first-principles-site/index.html curriculum/first-principles/index.html > first-principles-diff.txt
```

### Find Demo References in Paths
```bash
grep -r "interactive-demos" paths/ --include="*.html" -n
```

### Search for Concept Mentions
```bash
grep -r "UTXO" paths/ curriculum/ --include="*.html" --include="*.md" -i
```

### List Learn-bitcoin-by-doing Modules
```bash
ls -1 ../Learn-bitcoin-by-doing/src/modules/*.js
```

---

## How to Use Claude for Implementation

### What Claude Can Do Autonomously
1. **Add front matter to modules** (pass module + template)
2. **Replace duplicate text with recap+link** (identify duplicates, Claude swaps)
3. **Normalize formatting** (pass style guide, Claude reformats)
4. **Implement multi-level pattern** (pass demo + implementation guide, Claude retrofits)
5. **Extract embedded demos** (pass HTML, Claude extracts and creates standalone)

### What You Should Do
1. **Strategic decisions**: Which module is canonical? Merge or keep separate?
2. **Quality control**: Review Claude's output before committing
3. **User testing**: Recruit fresh learners to test flow
4. **Analytics**: Track completion rates, identify drop-offs

### Example Workflow
1. You: "Extract the Trust Demo from curriculum/first-principles/index.html"
2. Claude: Extracts demo, creates `/interactive-demos/concepts/trust-demo.html`, replaces inline with iframe
3. You: Review, test, commit
4. Repeat for next embedded demo

---

## Repository Status

### Current State
- ✅ 4 learning paths operational
- ⚠️ Content duplication across paths
- ⚠️ Demos not multi-level
- ❌ Missing modules from Learn-bitcoin-by-doing

### Target State (After Restructure)
- ✅ 4 paths + canonical content library
- ✅ Zero duplication (single source of truth per concept)
- ✅ All demos multi-level (beginner/intermediate/advanced)
- ✅ All missing modules integrated
- ✅ Unified, purposeful database of resources

---

## Questions?

1. Which phase should we start with? (Recommend: Phase 1 Quick Wins)
2. Do you want me to execute Phase 1 now? (I can do items 1-3 immediately)
3. Any decisions above need clarification before proceeding?

---

**Ready to begin?** Just say which phase or specific task you'd like to tackle first, and I'll start executing.
