# Content Audit - Fix Implementation Guide

Quick reference for implementing the 4 HIGH severity fixes identified in the content audit.

---

## Fix #1: Builder Path Module 1 - Add Blockchain Prerequisite

**File:** `/paths/builder/stage-1/module-1.html`
**Issue:** UTXO introduced before blockchain concept explained
**Severity:** HIGH

### Option A: Add Prerequisite Warning (Fastest)
Add to top of module after breadcrumb:

```html
<div style="background: rgba(255, 152, 0, 0.1); border-left: 4px solid #FF9800; padding: 1rem; margin-bottom: 2rem; border-radius: 0.5rem;">
    <h4 style="color: #FF9800; margin-bottom: 0.5rem;">⚠️ Prerequisites</h4>
    <p>This module assumes you understand basic blockchain concepts. If you're new to Bitcoin:</p>
    <a href="/paths/curious/stage-2/module-1.html" style="display: inline-block; margin-top: 0.5rem; padding: 0.5rem 1rem; background: #FF9800; color: white; text-decoration: none; border-radius: 0.5rem;">
        Start with Curious Path Stage 2: How Bitcoin Works →
    </a>
</div>
```

### Option B: Add Brief Blockchain Primer (Better UX)
Add new section before "The UTXO Model" section:

```html
<section class="content-section">
    <h2>Quick Recap: Bitcoin's Ledger</h2>
    <p>
        Bitcoin is a distributed ledger—a shared record of all transactions that everyone can verify.
        Unlike a bank account with a balance, Bitcoin tracks individual pieces of value called
        <strong>UTXOs (Unspent Transaction Outputs)</strong>.
    </p>
    <p>
        Think of it like cash in your wallet. You don't have a "bank account balance"—you have
        specific bills: a $20, two $5s, and some coins. Bitcoin works the same way.
    </p>
    <p style="font-size: 0.9rem; color: var(--text-dim);">
        💡 New to blockchain? <a href="/paths/curious/stage-2/module-1.html">Start here for full explanation</a>
    </p>
</section>
```

### Option C: Reorder Modules (Most Work, Best Flow)
1. Rename current `module-1.html` → `module-2-utxo-deep-dive.html`
2. Move current `module-3.html` (blockchain) → new `module-1.html`
3. Update stage-1 index navigation
4. Update progress tracking in JavaScript

**Recommended:** Option B (quick primer + link for deep dive)

---

## Fix #2: Builder Path Module 1 - Move Advanced Script Content

**File:** `/paths/builder/stage-1/module-1.html` (lines 541-555)
**Issue:** Bitcoin Script opcodes too advanced for Module 1
**Severity:** HIGH

### Implementation
1. **Keep in Module 1 (Basic):**
```html
<h3>Bitcoin Address Types</h3>
<p>When you send bitcoin, it's locked to a specific address type:</p>
<ul>
    <li><strong>Legacy (P2PKH):</strong> Starts with "1" - Original Bitcoin addresses</li>
    <li><strong>SegWit (P2WPKH):</strong> Starts with "bc1q" - Lower fees, widely supported</li>
    <li><strong>Taproot (P2TR):</strong> Starts with "bc1p" - Most private and efficient</li>
</ul>
<p style="font-size: 0.9rem; color: var(--text-dim);">
    💡 Want to understand the technical details behind these address types?
    <a href="/paths/builder/stage-3/bitcoin-script-deep-dive.html">Learn about Bitcoin Script in Stage 3 →</a>
</p>
```

2. **Move to Stage 3 (Advanced):**
Create new file: `/paths/builder/stage-3/bitcoin-script-deep-dive.html`
Move lines 541-555 (Script opcodes, P2SH, etc.) to this new advanced module.

3. **Update Stage 3 Index:**
Add to `/paths/builder/stage-3/index.html`:
```html
<div class="module-item">
    Optional: Bitcoin Script Deep Dive (Understanding locking conditions)
</div>
```

**Timeline:** 2-3 hours to implement

---

## Fix #3: Sovereign Path Module 1 - Add Wallet Basics Check

**File:** `/paths/sovereign/stage-1/module-1.html`
**Issue:** Hardware wallet comparison assumes wallet knowledge
**Severity:** HIGH

### Implementation
Add prerequisite check modal at page load:

```html
<!-- Add before closing </body> tag -->
<div id="prerequisite-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; align-items: center; justify-content: center;">
    <div style="background: var(--secondary-dark); border: 3px solid var(--primary-orange); border-radius: 1rem; padding: 2rem; max-width: 500px; margin: 2rem;">
        <h2 style="color: var(--primary-orange); margin-bottom: 1rem;">Before We Start...</h2>
        <p style="margin-bottom: 1.5rem;">
            The Sovereign Path covers advanced security topics. Have you already learned the basics of Bitcoin wallets?
        </p>
        <div style="display: flex; gap: 1rem; flex-direction: column;">
            <button onclick="closePrereqModal()" style="padding: 1rem; background: var(--accent-green); color: white; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer;">
                ✓ Yes, I understand wallet basics
            </button>
            <a href="/paths/curious/stage-3/module-1.html" style="padding: 1rem; background: transparent; border: 2px solid var(--primary-orange); color: var(--primary-orange); text-align: center; text-decoration: none; border-radius: 0.5rem; font-weight: 600;">
                No, teach me wallet basics first →
            </a>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-dim); margin-top: 1rem; text-align: center;">
            Recommended: Complete <a href="/paths/curious/">Curious Path</a> first
        </p>
    </div>
</div>

<script>
// Check if user has completed Curious Path or dismissed modal before
window.addEventListener('DOMContentLoaded', function() {
    const hasSeenModal = localStorage.getItem('sovereign-prereq-check');
    const curiousCompleted = localStorage.getItem('curious-path-complete');

    if (!hasSeenModal && !curiousCompleted) {
        document.getElementById('prerequisite-modal').style.display = 'flex';
    }
});

function closePrereqModal() {
    localStorage.setItem('sovereign-prereq-check', 'true');
    document.getElementById('prerequisite-modal').style.display = 'none';
}
</script>
```

**Timeline:** 1 hour to implement

---

## Fix #4: Standardize Concept Introduction Order

**Files:** Multiple across all paths
**Issue:** Core concepts introduced in different orders
**Severity:** HIGH

### Step 1: Document Canonical Order
Create `/docs/concept-prerequisite-order.md`:

```markdown
# Bitcoin Concept Prerequisite Order

Core concepts should be introduced in this order:

1. **Money Fundamentals** (Curious 1.1)
   - What is money
   - Properties of good money
   - Problems with fiat

2. **Bitcoin Basics** (Curious 1.3)
   - What is Bitcoin
   - Why it exists
   - How it's different

3. **Blockchain & Ledger** (Curious 2.1)
   - Distributed ledger concept
   - Blocks and chain
   - Immutability

4. **Transactions & UTXO** (Curious 2.1)
   - Transaction inputs/outputs
   - UTXO model
   - Transaction fees

5. **Mining & Consensus** (Curious 2.1)
   - Proof of work
   - Mining process
   - Difficulty adjustment

6. **Cryptographic Primitives** (Curious 2.1)
   - Hashing (SHA-256)
   - Public/private keys (basic)
   - Digital signatures (basic)

7. **Wallets** (Curious 3.1)
   - What is a wallet
   - Hot vs cold
   - Custodial vs non-custodial

8. **Private Key Security** (Curious 4.1)
   - Private key importance
   - Seed phrases
   - Backup strategies

9. **Bitcoin's Monetary Policy** (Curious 2.2)
   - 21M cap
   - Halving schedule
   - Inflation rate

10. **Lightning Network** (Builder 2.4)
    - Layer 2 concept
    - Payment channels
    - Use cases

11. **Advanced Security** (Sovereign 1+)
    - Hardware wallets
    - Multisig
    - Cold storage
```

### Step 2: Add "Already Know This?" Skip Links
For each concept introduction, add:

```html
<div style="background: rgba(76, 175, 80, 0.1); border: 1px solid var(--accent-green); padding: 1rem; margin-bottom: 1.5rem; border-radius: 0.5rem;">
    <p style="margin: 0; font-size: 0.9rem;">
        ✓ <strong>Already learned about blockchain?</strong>
        <a href="#next-section" style="color: var(--accent-green);">Skip to UTXO explanation →</a>
    </p>
</div>
```

### Step 3: Add Concept Cross-References
When mentioning concept taught elsewhere:

```html
<span class="vocab-tooltip">
    UTXO
    <span class="tooltip-text">
        Unspent Transaction Output - First explained in Curious 2.1
        <a href="/paths/curious/stage-2/module-1.html#utxo">Learn more →</a>
    </span>
</span>
```

**Timeline:** 1 day for documentation + 2-3 days for implementation

---

## Testing Checklist

After implementing fixes, test these user flows:

### Builder Path Entry
- [ ] New user starts Builder Module 1 → sees prerequisite warning
- [ ] User clicks prerequisite link → lands on Curious Stage 2
- [ ] User completes Curious Stage 2 → returns to Builder without repeating content

### Sovereign Path Entry
- [ ] New user starts Sovereign Path → sees prerequisite modal
- [ ] User clicks "No" → redirected to Curious Stage 3
- [ ] User clicks "Yes" → modal closes, localStorage saves choice
- [ ] User refreshes page → modal doesn't reappear

### Concept Order Consistency
- [ ] User completes Curious 2.1 (blockchain) → Builder 1.1 shows "already learned" badge
- [ ] User reads about Lightning in Curious → tooltip explains "taught in Builder 2.4"
- [ ] User switches paths → progress syncs, no repeated content

---

## Rollback Plan

If fixes cause issues, rollback steps:

1. **Builder Module 1:**
   - Remove prerequisite warning div
   - Restore original content order

2. **Sovereign Module 1:**
   - Remove prerequisite modal script
   - Clear localStorage for affected users: `localStorage.removeItem('sovereign-prereq-check')`

3. **Concept Order:**
   - No changes to existing content, only added tooltips/skip links (safe to leave)

---

## Success Metrics

Track these metrics post-implementation:

1. **Completion Rate:** Builder Stage 1 completion should increase (fewer drop-offs from confusion)
2. **Time on Page:** Builder Module 1 time should decrease (users aren't stuck re-reading basics)
3. **Support Tickets:** Fewer "I don't understand UTXO" tickets
4. **Path Switching:** More users completing multi-path journeys

---

## Questions?

- Full audit report: `/CONTENT_AUDIT_REPORT.md`
- Executive summary: `/CONTENT_AUDIT_EXECUTIVE_SUMMARY.md`
- Analysis data: `/content-audit-data.json`
