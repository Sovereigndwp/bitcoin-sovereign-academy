# Broken Links Report - Bitcoin Sovereign Academy

**Generated:** 2025-10-25
**Total Links Tested:** 824
**Broken Links Found:** 85
**Actionable Fixes Required:** ~30 (excluding false positives and archived files)

---

## Categories of Broken Links

### 1. False Positives (Can be Ignored)

**Data URLs** - These are inline base64-encoded images, not actual links:
```
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==
```
- **Location:** index.html, backup files
- **Action:** None needed (script should ignore data: URIs)

**Query Parameters** - Links with `?level=` parameters are being incorrectly flagged:
```
/interactive-demos/wallet-security-workshop/index.html?level=beginner&path=curious
```
- **Actual Path:** `/interactive-demos/wallet-security-workshop/index.html` (EXISTS)
- **Action:** None needed (script should strip query params before checking)

---

### 2. Archived/Backup Files (Low Priority)

**File:** `index-backup-20251015-143702.html`
- Old backup file with outdated links
- **Action:** Consider deleting backup files or moving to `/backups/` directory

**File:** `paths/curious/stage-1/archived/module-4.html`
- Archived module with broken navigation
- **Action:** Fix breadcrumb links OR add "ARCHIVED - NOT IN USE" notice

Broken links in archived module:
```
../../../index.html → Should be: /index.html
../../curious/index.html → Should be: /paths/curious/index.html
../stage-1/index.html → Should be: /paths/curious/stage-1/index.html
../stage-2/module-1.html → Should be: /paths/curious/stage-2/module-1.html
```

---

### 3. Missing Interactive Demos (High Priority)

The `/interactive-demos/index.html` directory page lists demos that don't exist as standalone `.html` files.
They exist as **directories with `/index.html`** inside them.

**Problem:** Links point to `.html` files instead of directories

| Listed Link | Actual Location | Status |
|-------------|-----------------|--------|
| `/interactive-demos/lightning-lab.html` | `/interactive-demos/lightning-network-demo/index.html` | ❌ FIX NEEDED |
| `/interactive-demos/utxo-visualizer-enhanced.html` | `/interactive-demos/utxo-visualizer-enhanced/index.html` | ❌ FIX NEEDED |
| `/interactive-demos/security-dojo.html` | `/interactive-demos/security-dojo-enhanced/index.html` | ❌ FIX NEEDED |
| `/interactive-demos/lightning-instant-demo.html` | `/interactive-demos/lightning-network-demo/index.html` | ❌ FIX NEEDED |
| `/interactive-demos/lightning-routing-sim.html` | Does not exist | ❌ CREATE OR REMOVE |
| `/interactive-demos/time-machine.html` | `/interactive-demos/bitcoin-price-timeline/index.html`? | ❌ FIX NEEDED |
| `/interactive-demos/quiz-demo.html` | Does not exist | ❌ CREATE OR REMOVE |
| `/interactive-demos/fee-master-tool.html` | `/interactive-demos/fee-master-tool/index.html` | ❌ FIX NEEDED |
| `/interactive-demos/stock-to-flow.html` | Does not exist | ❌ CREATE OR REMOVE |
| `/interactive-demos/mempool-peace-of-mind.html` | Does not exist | ❌ CREATE OR REMOVE |
| `/interactive-demos/fee-timing-helper.html` | `/interactive-demos/fee-master-tool/index.html`? | ❌ FIX NEEDED |
| `/interactive-demos/account-freeze-scenario` | `/interactive-demos/account-freeze-locked-out/index.html` | ❌ FIX NEEDED |

**Recommendation:**
1. Update all references to use directory paths: `/interactive-demos/demo-name/` or `/interactive-demos/demo-name/index.html`
2. Remove listings for demos that don't exist
3. Create missing demos OR remove references

---

### 4. Missing CSS/JS Resources (Medium Priority)

**Missing Shared Stylesheets:**
```
interactive-demos/bitcoin-vs-banking/index.html → ../css/brand.css
interactive-demos/bitcoin-vs-banking/index.html → ../css/widgets.css
interactive-demos/fee-master-tool/index.html → ../css/brand.css
interactive-demos/fee-master-tool/index.html → ../css/widgets.css
interactive-demos/sat-stacking-calculator/index.html → ../css/brand.css
interactive-demos/sat-stacking-calculator/index.html → ../css/widgets.css
```

**Expected Path:** `/interactive-demos/css/brand.css` and `/interactive-demos/css/widgets.css`

**Action Required:**
- Create `/interactive-demos/css/brand.css` with shared brand styles
- Create `/interactive-demos/css/widgets.css` with reusable widget components
- OR update references to use absolute paths to existing CSS

**Missing JavaScript:**
```
interactive-demos/fee-master-tool/index.html → ../js/widgets/api-handler.js
interactive-demos/sat-stacking-calculator/index.html → ../js/widgets/api-handler.js
interactive-demos/security-dojo-enhanced/index.html → ../ai-agents/advanced-agents.js
```

**Expected Paths:**
- `/interactive-demos/js/widgets/api-handler.js`
- `/interactive-demos/ai-agents/advanced-agents.js`

**Action Required:**
- Create missing JS files
- OR update demos to use existing JavaScript utilities
- OR comment out references if not critical

---

### 5. Missing Assets (Low Priority)

**Certificates (probably test/template files):**
```
certificates/branded_certificate_page.html → /assets/oakwood-high/favicon.ico
certificates/branded_certificate_page.html → /assets/oakwood-high/logo-light.png
```

**Action:** Either create assets or remove certificate template (appears to be test/example)

---

### 6. Missing Modules in Observer Path (Medium Priority)

```
paths/observer/stage-1/index.html → module-2.html
paths/observer/stage-1/index.html → module-3.html
paths/observer/stage-1/module-1.html → module-2.html
```

**Action:**
- Create missing Observer Path modules
- OR mark as "Under Development" with disabled links
- OR remove Observer Path if not in active use

---

### 7. Hurried Path References (High Priority)

**File:** `paths/hurried/index.html` and `emergency-kit.html`

Missing demos referenced:
```
/interactive-demos/lightning-instant-demo.html
/interactive-demos/mempool-peace-of-mind.html
/interactive-demos/fee-timing-helper.html
```

**Action:** Update to correct paths or create demos

---

## Fix Priority Matrix

### Priority 1: Critical (Active User-Facing Pages)

1. **Interactive Demos Index** (`interactive-demos/index.html`)
   - Fix 8 broken demo links
   - Update to use directory paths

2. **Hurried Path** (`paths/hurried/index.html`)
   - Fix 3 broken demo references
   - Critical because it's the fast-track entry point

3. **Curious Path Stage 2** (`paths/curious/stage-2/module-2.html`)
   - Fix stock-to-flow link

### Priority 2: Medium (Functional but Less Visible)

1. **Observer Path** - Create missing modules OR disable path
2. **Shared CSS/JS** - Create `/interactive-demos/css/` and `/interactive-demos/js/widgets/` resources
3. **Curriculum Pages** - Fix demo references in `curriculum/sovereign-tools/index.html`

### Priority 3: Low (Cleanup)

1. **Archived Files** - Fix navigation in `paths/curious/stage-1/archived/module-4.html`
2. **Backup Files** - Move or delete `index-backup-20251015-143702.html`
3. **Certificates** - Create assets or remove template
4. **Emergency Kit** - Update or remove `emergency-kit.html` if deprecated

---

## Recommended Immediate Actions

### Step 1: Update Interactive Demos Index

**File:** `/interactive-demos/index.html`

Replace broken links:
```html
<!-- BEFORE -->
<a href="/interactive-demos/lightning-lab.html">Lightning Lab</a>
<a href="/interactive-demos/utxo-visualizer-enhanced.html">UTXO Visualizer</a>
<a href="/interactive-demos/security-dojo.html">Security Dojo</a>

<!-- AFTER -->
<a href="/interactive-demos/lightning-network-demo/">Lightning Lab</a>
<a href="/interactive-demos/utxo-visualizer-enhanced/">UTXO Visualizer</a>
<a href="/interactive-demos/security-dojo-enhanced/">Security Dojo</a>
```

Remove non-existent demos:
```html
<!-- REMOVE THESE (don't exist) -->
<a href="/interactive-demos/lightning-routing-sim.html">Lightning Routing Sim</a>
<a href="/interactive-demos/quiz-demo.html">Quiz Demo</a>
```

### Step 2: Update Hurried Path

**File:** `paths/hurried/index.html`

```html
<!-- BEFORE -->
<iframe src="/interactive-demos/mempool-peace-of-mind.html"></iframe>

<!-- AFTER - Use existing alternative OR comment out -->
<!-- Mempool demo under development -->
```

### Step 3: Fix Curious Path References

**File:** `paths/curious/stage-2/module-2.html`

```html
<!-- BEFORE -->
<a href="/interactive-demos/stock-to-flow.html">Stock-to-Flow Model</a>

<!-- AFTER - Use bitcoin-supply-schedule OR remove -->
<a href="/interactive-demos/bitcoin-supply-schedule/">Bitcoin Supply Schedule</a>
```

### Step 4: Create Missing Shared Resources

**Option A:** Create files
```bash
mkdir -p interactive-demos/css
mkdir -p interactive-demos/js/widgets
touch interactive-demos/css/brand.css
touch interactive-demos/css/widgets.css
touch interactive-demos/js/widgets/api-handler.js
```

**Option B:** Update references to existing CSS
```html
<!-- Change from relative to absolute -->
<link rel="stylesheet" href="/css/dynamic-content.css">
```

---

## Script Improvements Needed

The link checker script should be updated to:

1. **Ignore data: URIs**
   ```python
   if link.startswith(('http://', 'https://', 'mailto:', 'tel:', 'javascript:', 'data:')):
       continue
   ```

2. **Strip query parameters before checking**
   ```python
   link_without_params = link.split('?')[0].split('#')[0]
   ```

3. **Check for directory/index.html alternatives**
   ```python
   if not target.exists():
       # Try directory with index.html
       alt_target = target.parent / target.stem / 'index.html'
       if alt_target.exists():
           continue  # Valid link
   ```

---

## Summary Statistics

| Category | Count | Priority |
|----------|-------|----------|
| False Positives (data URIs, query params) | ~25 | N/A |
| Archived/Backup Files | ~10 | Low |
| Missing Interactive Demos | ~15 | **High** |
| Missing CSS/JS Resources | ~10 | Medium |
| Missing Assets | ~2 | Low |
| Missing Modules (Observer Path) | ~3 | Medium |
| Hurried Path References | ~3 | **High** |
| **Actionable Fixes** | **~30** | **Mixed** |

---

## Next Steps

1. ✅ **Completed:** Link testing script created
2. ⏳ **In Progress:** Documentation of broken links
3. 📋 **TODO:** Fix Priority 1 broken links (Interactive Demos Index, Hurried Path)
4. 📋 **TODO:** Create missing shared CSS/JS resources
5. 📋 **TODO:** Clean up archived/backup files
6. 📋 **TODO:** Update link checker script to reduce false positives

---

**Document Version:** 1.0
**Last Updated:** 2025-10-25
