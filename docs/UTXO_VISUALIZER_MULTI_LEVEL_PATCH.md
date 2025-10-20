# UTXO Visualizer Multi-Level Enhancement — Implementation Guide

**File**: `interactive-demos/utxo-visualizer-enhanced.html`
**Purpose**: Add beginner/intermediate/advanced level support
**Date**: 2025-10-20

---

## Overview

This patch adds three difficulty levels to the UTXO Visualizer:
- **Beginner** (Curious Path) — Pre-selected scenarios, verbose instructions, hints always visible
- **Intermediate** (Sovereign Path) — All scenarios available, instructions on demand, optional hints
- **Advanced** (Builder Path) — Raw mode, technical details exposed, no hand-holding

---

## Changes Required

### 1. Add Level Detection (Insert at line 837, before existing `<script>`)

```html
<script>
    // ===== MULTI-LEVEL SUPPORT =====
    // Detect level from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const currentLevel = urlParams.get('level') || 'beginner'; // Default to beginner
    const currentPath = urlParams.get('path') || 'unknown';

    // Apply body class for CSS targeting
    document.body.classList.add(`level-${currentLevel}`);

    // Level configuration
    const LEVEL_CONFIG = {
        beginner: {
            name: "Beginner Mode",
            description: "Guided exploration with pre-selected scenarios and helpful tooltips",
            defaultScenario: 'intro',
            scenariosAvailable: ['intro', 'consolidation', 'feeOptimization'],
            instructionsVisible: true,
            hintsAutoShow: true,
            validationStrict: true,
            showTechnicalDetails: false,
            preloadScenario: true
        },
        intermediate: {
            name: "Intermediate Mode",
            description: "All scenarios available with optional hints and guidance",
            defaultScenario: null, // User chooses
            scenariosAvailable: ['intro', 'consolidation', 'feeOptimization', 'privacy', 'dust'],
            instructionsVisible: true,
            hintsAutoShow: false, // User must click for hints
            validationStrict: true,
            showTechnicalDetails: false,
            preloadScenario: false
        },
        advanced: {
            name: "Advanced Mode",
            description: "All scenarios plus expert challenges with technical details exposed",
            defaultScenario: null,
            scenariosAvailable: ['intro', 'consolidation', 'feeOptimization', 'privacy', 'dust', 'challenge'],
            instructionsVisible: false, // Hidden by default
            hintsAutoShow: false,
            validationStrict: false, // Allow experimentation
            showTechnicalDetails: true, // Show raw data, scripts, etc.
            preloadScenario: false
        }
    };

    const levelConfig = LEVEL_CONFIG[currentLevel];

    console.log(`🎯 UTXO Visualizer Level: ${levelConfig.name}`);
    console.log(`📊 Path: ${currentPath}`);
</script>
```

---

### 2. Add Level Switcher UI (Insert after header, around line 40)

```html
<!-- Level Switcher -->
<div class="level-switcher">
    <div class="level-info">
        <span class="level-label">Difficulty:</span>
        <span class="level-current" id="current-level-name">Beginner Mode</span>
    </div>
    <div class="level-buttons">
        <button class="level-btn" data-level="beginner" id="btn-beginner">Beginner</button>
        <button class="level-btn" data-level="intermediate" id="btn-intermediate">Intermediate</button>
        <button class="level-btn" data-level="advanced" id="btn-advanced">Advanced</button>
    </div>
</div>
```

---

### 3. Add CSS for Level-Specific Elements (Insert in `<style>` section, around line 300)

```css
/* ===== LEVEL SWITCHER ===== */
.level-switcher {
    background: rgba(33, 150, 243, 0.1);
    border: 2px solid rgba(33, 150, 243, 0.3);
    border-radius: 12px;
    padding: 1rem;
    margin-bottom: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
}

.level-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.level-label {
    color: var(--color-muted);
    font-weight: 600;
}

.level-current {
    color: #2196F3;
    font-weight: 700;
    font-size: 1.1rem;
}

.level-buttons {
    display: flex;
    gap: 0.5rem;
}

.level-btn {
    background: rgba(33, 150, 243, 0.1);
    border: 2px solid rgba(33, 150, 243, 0.3);
    color: #2196F3;
    padding: 0.5rem 1.5rem;
    border-radius: 20px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
}

.level-btn:hover {
    background: rgba(33, 150, 243, 0.2);
    border-color: #2196F3;
}

.level-btn.active {
    background: #2196F3;
    color: white;
    border-color: #2196F3;
}

/* ===== LEVEL-SPECIFIC VISIBILITY ===== */
/* Beginner-only elements */
.beginner-only { display: block; }
.intermediate-only { display: none; }
.advanced-only { display: none; }

/* Intermediate mode */
body.level-intermediate .beginner-only { display: none; }
body.level-intermediate .intermediate-only { display: block; }
body.level-intermediate .advanced-only { display: none; }

/* Advanced mode */
body.level-advanced .beginner-only { display: none; }
body.level-advanced .intermediate-only { display: none; }
body.level-advanced .advanced-only { display: block; }

/* Technical details panel (advanced only) */
.technical-panel {
    background: rgba(156, 39, 176, 0.1);
    border: 2px solid rgba(156, 39, 176, 0.3);
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    display: none; /* Hidden by default */
}

body.level-advanced .technical-panel {
    display: block;
}

.technical-panel h3 {
    color: #9C27B0;
    margin-bottom: 1rem;
}

.technical-details {
    font-family: monospace;
    font-size: 0.9rem;
    background: rgba(0, 0, 0, 0.3);
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
}
```

---

### 4. Modify EnhancedUTXOVisualizer Class Constructor (Around line 840)

```javascript
constructor() {
    // Apply level configuration
    this.level = currentLevel;
    this.levelConfig = levelConfig;

    // Set default scenario based on level
    this.currentScenario = this.levelConfig.defaultScenario || 'intro';

    this.selectedUTXOs = [];
    this.availableUTXOs = [];
    this.scenarioData = this.defineScenarios();
    this.currentStep = 0;
    this.hints = [];

    // Level-specific initialization
    this.applyLevelSettings();
    this.init();
}
```

---

### 5. Add applyLevelSettings Method (Insert after constructor, around line 855)

```javascript
applyLevelSettings() {
    console.log(`Applying ${this.levelConfig.name} settings...`);

    // Update level display
    document.getElementById('current-level-name').textContent = this.levelConfig.name;

    // Set active level button
    document.querySelectorAll('.level-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.level === this.level) {
            btn.classList.add('active');
        }
    });

    // Attach level switcher listeners
    document.querySelectorAll('.level-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const newLevel = btn.dataset.level;
            const url = new URL(window.location);
            url.searchParams.set('level', newLevel);
            window.location.href = url.toString();
        });
    });

    // Filter available scenarios based on level
    this.filterScenariosByLevel();

    // Auto-show instructions for beginner
    if (this.levelConfig.instructionsVisible && this.levelConfig.preloadScenario) {
        setTimeout(() => {
            this.showInstructions();
        }, 500);
    }

    // Show/hide technical details
    if (this.levelConfig.showTechnicalDetails) {
        this.enableTechnicalMode();
    }
}
```

---

### 6. Add filterScenariosByLevel Method (Insert after applyLevelSettings)

```javascript
filterScenariosByLevel() {
    // Hide scenario cards not available at current level
    const scenarioCards = document.querySelectorAll('.scenario-card');
    scenarioCards.forEach(card => {
        const scenarioId = card.dataset.scenario; // You'll need to add data-scenario attributes
        if (!this.levelConfig.scenariosAvailable.includes(scenarioId)) {
            card.style.display = 'none';
        } else {
            card.style.display = 'block';
        }
    });
}
```

---

### 7. Add enableTechnicalMode Method

```javascript
enableTechnicalMode() {
    // Create technical details panel if it doesn't exist
    if (!document.getElementById('technical-panel')) {
        const panel = document.createElement('div');
        panel.id = 'technical-panel';
        panel.className = 'technical-panel';
        panel.innerHTML = `
            <h3>⚙️ Technical Details</h3>
            <div class="technical-details" id="technical-details-content">
                <p><strong>Raw Transaction Data:</strong></p>
                <pre id="raw-tx-data">Select UTXOs to see transaction details...</pre>
                <p style="margin-top: 1rem;"><strong>Fee Calculation:</strong></p>
                <pre id="fee-calc-data">No transaction built yet</pre>
            </div>
        `;

        // Insert after instructions panel
        const container = document.querySelector('.container');
        const instructionsPanel = document.querySelector('.instructions-panel');
        if (instructionsPanel) {
            instructionsPanel.after(panel);
        } else {
            container.insertBefore(panel, container.firstChild);
        }
    }
}
```

---

### 8. Modify validateTransaction Method (Around line 1305)

Add level-specific behavior:

```javascript
validateTransaction() {
    const sendAmount = parseFloat(document.getElementById('send-amount').value) || 0;
    const feeRate = parseInt(document.getElementById('fee-rate').value) || 15;

    if (this.selectedUTXOs.length === 0) {
        // Level-specific error messages
        if (this.level === 'beginner') {
            alert('❌ No UTXOs selected!\n\n💡 Tip: Click on the orange coins above to select them.');
        } else {
            alert('❌ No UTXOs selected! Please select at least one UTXO to build your transaction.');
        }
        return;
    }

    const totalInput = this.selectedUTXOs.reduce((sum, id) => {
        const utxo = this.availableUTXOs.find(u => u.id === id);
        return sum + utxo.amount;
    }, 0);

    const txSize = (this.selectedUTXOs.length * 148) + (2 * 34) + 10;
    const feeInBTC = (txSize * feeRate) / 100000000;

    // Advanced mode: Show raw technical details
    if (this.levelConfig.showTechnicalDetails) {
        this.updateTechnicalPanel(totalInput, txSize, feeRate, feeInBTC);
    }

    // Validation strictness based on level
    if (this.levelConfig.validationStrict) {
        if (totalInput < sendAmount + feeInBTC) {
            alert(`❌ Insufficient funds!\n\nSelected: ${totalInput.toFixed(8)} BTC\nNeeded: ${(sendAmount + feeInBTC).toFixed(8)} BTC\n\nPlease select more UTXOs.`);
            return;
        }
    } else {
        // Advanced mode: Allow mistakes, just warn
        if (totalInput < sendAmount + feeInBTC) {
            const proceed = confirm(`⚠️ Insufficient funds!\n\nSelected: ${totalInput.toFixed(8)} BTC\nNeeded: ${(sendAmount + feeInBTC).toFixed(8)} BTC\n\nContinue anyway to see what happens?`);
            if (!proceed) return;
        }
    }

    // Rest of validation logic...
}
```

---

### 9. Add updateTechnicalPanel Method

```javascript
updateTechnicalPanel(totalInput, txSize, feeRate, feeInBTC) {
    const rawTxData = document.getElementById('raw-tx-data');
    const feeCalcData = document.getElementById('fee-calc-data');

    if (rawTxData) {
        // Generate mock raw transaction data
        const inputs = this.selectedUTXOs.map((id, index) => {
            const utxo = this.availableUTXOs.find(u => u.id === id);
            return `Input ${index + 1}:\n  TXID: ${this.generateMockTxId()}\n  vout: ${index}\n  Amount: ${utxo.amount} BTC\n  ScriptPubKey: OP_DUP OP_HASH160 ${this.generateMockHash()} OP_EQUALVERIFY OP_CHECKSIG`;
        }).join('\n\n');

        rawTxData.textContent = inputs;
    }

    if (feeCalcData) {
        const calc = `
Size Calculation:
• Inputs: ${this.selectedUTXOs.length} × 148 vBytes = ${this.selectedUTXOs.length * 148} vBytes
• Outputs: 2 × 34 vBytes = 68 vBytes
• Overhead: 10 vBytes
• Total: ${txSize} vBytes

Fee Calculation:
• Fee Rate: ${feeRate} sats/vByte
• Total Fee: ${txSize} × ${feeRate} = ${txSize * feeRate} sats
• In BTC: ${feeInBTC.toFixed(8)} BTC
        `;
        feeCalcData.textContent = calc;
    }
}

generateMockTxId() {
    return Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

generateMockHash() {
    return Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('');
}
```

---

### 10. Modify showHint Method (Around line 1295)

```javascript
showHint() {
    // Beginner: Auto-show hints
    if (this.levelConfig.hintsAutoShow) {
        // Hints already visible
        return;
    }

    // Intermediate/Advanced: Show on demand
    const scenarioHints = this.scenarioData[this.currentScenario].hints;
    if (!scenarioHints || scenarioHints.length === 0) {
        alert('No hints available for this scenario.');
        return;
    }

    const hintIndex = Math.min(this.currentStep, scenarioHints.length - 1);
    const hint = scenarioHints[hintIndex];

    if (!hint) {
        alert('You\'ve used all available hints!');
        return;
    }

    alert(`💡 Hint: ${hint}`);
}
```

---

## Testing Checklist

After applying the patch:

- [ ] **Beginner mode** (`?level=beginner`):
  - [ ] Instructions visible by default
  - [ ] Only intro, consolidation, feeOptimization scenarios shown
  - [ ] Hints auto-display
  - [ ] Strict validation (blocks invalid transactions)
  - [ ] No technical details panel

- [ ] **Intermediate mode** (`?level=intermediate`):
  - [ ] Instructions visible
  - [ ] All scenarios except 'challenge' shown
  - [ ] Hints available on button click
  - [ ] Strict validation
  - [ ] No technical details panel

- [ ] **Advanced mode** (`?level=advanced`):
  - [ ] Instructions hidden by default (user can toggle)
  - [ ] All scenarios including 'challenge' shown
  - [ ] No hints (or minimal hints)
  - [ ] Relaxed validation (allows experimentation)
  - [ ] Technical details panel visible with raw tx data

- [ ] **Level switcher**:
  - [ ] All three buttons visible
  - [ ] Active level highlighted
  - [ ] Clicking switches level (reloads page with new ?level= param)

- [ ] **Path context** (`?path=curious|builder|sovereign`):
  - [ ] Path name displayed somewhere (optional)
  - [ ] Logged to console

---

## Implementation Steps

1. **Backup current file**:
   ```bash
   cp interactive-demos/utxo-visualizer-enhanced.html interactive-demos/utxo-visualizer-enhanced-backup.html
   ```

2. **Apply changes manually**:
   - Follow each section above
   - Add code at specified line numbers
   - Test after each major addition

3. **Add data-scenario attributes** to scenario cards in HTML:
   ```html
   <div class="scenario-card" data-scenario="intro" onclick="...">
   <div class="scenario-card" data-scenario="consolidation" onclick="...">
   <!-- etc. -->
   ```

4. **Test thoroughly**:
   - Open `?level=beginner` — verify beginner experience
   - Open `?level=intermediate` — verify intermediate experience
   - Open `?level=advanced` — verify advanced experience

5. **Update path links**:
   - Curious S2: Link to `?level=beginner&path=curious`
   - Builder S1: Link to `?level=advanced&path=builder`
   - Sovereign S1: Link to `?level=intermediate&path=sovereign`

---

## Next Steps After Implementation

1. **Document pattern** for other demos
2. **Apply to transaction-builder** next
3. **Apply to mining-simulator**
4. **Apply to consensus-game**
5. **Apply to wallet-workshop**

---

**Status**: Ready to implement
**Estimated Time**: 2-3 hours for implementation + testing
**Priority**: HIGH (foundation for all multi-level demos)
