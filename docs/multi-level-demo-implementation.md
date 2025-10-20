# Multi-Level Demo Implementation Guide

**Purpose**: Technical guide for retrofitting existing demos to support beginner/intermediate/advanced modes for multi-path reuse.

**Last Updated**: 2025-10-20

---

## Overview

Instead of building separate demos for each path, we build **one comprehensive demo** with **3 difficulty levels**. Paths link to the same demo with different parameters.

### Benefits
- ✅ **Single source of truth** — one demo to maintain
- ✅ **Consistent UX** — learners recognize the interface across paths
- ✅ **Graduated complexity** — learners can revisit demos at higher levels
- ✅ **Reduced maintenance** — fix bugs once, not 3× times

---

## Implementation Pattern

### 1. URL Parameter-Based Levels

Use query params to control difficulty:

```
/interactive-demos/concepts/utxo-model/?level=beginner
/interactive-demos/concepts/utxo-model/?level=intermediate
/interactive-demos/concepts/utxo-model/?level=advanced
```

Optionally track context:
```
?level=beginner&path=curious&stage=2&module=1
```

### 2. JavaScript Level Detection

```javascript
// Detect level from URL
const urlParams = new URLSearchParams(window.location.search);
const level = urlParams.get('level') || 'beginner'; // Default to beginner
const path = urlParams.get('path') || 'unknown';

// Store for analytics
const context = {
  level: level,
  path: path,
  stage: urlParams.get('stage'),
  module: urlParams.get('module'),
  startTime: Date.now()
};

// Apply level-specific settings
applyLevelSettings(level);
```

### 3. Level Configuration Object

Define all level-specific behavior in one place:

```javascript
const LEVEL_CONFIG = {
  beginner: {
    name: "Beginner",
    description: "Guided exploration with pre-filled examples",
    preload: true,           // Pre-fill wallet with UTXOs
    tooltips: "verbose",     // Show all tooltips automatically
    hints: "always",         // Always show hints
    validation: "strict",    // Validate every step, show errors immediately
    challenges: [
      "Send 0.01 BTC to Alice",
      "Notice what happens to your change",
      "Try to spend the same coin twice"
    ],
    helpText: {
      inputs: "These are the coins you can spend. Each one has an amount and an address it's locked to.",
      outputs: "Where you want to send bitcoin. You can have multiple outputs in one transaction.",
      change: "If you don't spend all the input, the leftover goes to your change address."
    }
  },

  intermediate: {
    name: "Intermediate",
    description: "Real-world scenarios with optional hints",
    preload: false,          // Blank slate
    tooltips: "on-hover",    // Show tooltips only on hover
    hints: "on-request",     // User must click for hints
    validation: "relaxed",   // Allow mistakes, warn but don't block
    challenges: [
      "Import UTXOs from a mempool transaction",
      "Create a payment with optimal privacy (no address reuse)",
      "Manually calculate and set the fee"
    ],
    helpText: {
      inputs: "Select UTXOs carefully. Combining inputs from different addresses harms privacy.",
      outputs: "Avoid address reuse. Generate fresh addresses for change.",
      fees: "Check current mempool to estimate appropriate fee rate."
    }
  },

  advanced: {
    name: "Advanced",
    description: "Raw transaction construction with technical details",
    preload: false,          // Blank slate
    tooltips: "minimal",     // Only critical tooltips
    hints: "none",           // No hints
    validation: "manual",    // User must validate themselves
    challenges: [
      "Construct a 3-input, 2-output transaction",
      "Include one P2SH input and calculate witness discount",
      "Manually compute transaction ID and verify against consensus rules"
    ],
    showRawData: true,       // Expose hex, scripts, etc.
    exposeTechnical: {
      hex: true,
      script: true,
      witness: true,
      vsize: true,
      txid: true
    },
    helpText: {
      // Minimal or none
    }
  }
};
```

### 4. Apply Level Settings

```javascript
function applyLevelSettings(level) {
  const config = LEVEL_CONFIG[level];

  // Update UI title
  document.getElementById('demo-title').textContent =
    `UTXO Visualizer — ${config.name} Mode`;

  // Show level description
  document.getElementById('demo-description').textContent = config.description;

  // Pre-load data if beginner
  if (config.preload) {
    loadExampleWallet();
  }

  // Set tooltip behavior
  if (config.tooltips === 'verbose') {
    enableAutoTooltips();
  } else if (config.tooltips === 'on-hover') {
    enableHoverTooltips();
  } else {
    disableTooltips();
  }

  // Show/hide technical panels
  if (config.showRawData) {
    document.getElementById('raw-data-panel').style.display = 'block';
    document.getElementById('hex-output').style.display = 'block';
  } else {
    document.getElementById('raw-data-panel').style.display = 'none';
  }

  // Load challenges
  loadChallenges(config.challenges);

  // Set validation mode
  validationMode = config.validation;
}
```

### 5. Conditional UI Elements

Use CSS classes to show/hide elements based on level:

```html
<div class="tooltip beginner-only">
  💡 <strong>What's a UTXO?</strong><br>
  Think of UTXOs like physical coins in your pocket. Each coin has a specific value,
  and you combine them to make payments.
</div>

<div class="technical-panel advanced-only">
  <h4>Raw Transaction Hex</h4>
  <pre id="tx-hex"></pre>
  <button onclick="decodeTransaction()">Decode →</button>
</div>

<div class="challenge-panel">
  <h3>Your Challenge</h3>
  <div id="challenge-list"></div>
</div>

<div class="hint-panel intermediate-only">
  <button onclick="showHint()" class="hint-btn">💡 Show Hint</button>
  <div id="hint-text" style="display: none;"></div>
</div>
```

CSS:
```css
/* Default: show everything */
.beginner-only { display: block; }
.intermediate-only { display: block; }
.advanced-only { display: block; }

/* Beginner mode: hide advanced */
body.level-beginner .advanced-only { display: none; }
body.level-beginner .intermediate-only { display: none; }

/* Intermediate mode: hide beginner and advanced */
body.level-intermediate .beginner-only { display: none; }
body.level-intermediate .advanced-only { display: none; }

/* Advanced mode: hide beginner and intermediate */
body.level-advanced .beginner-only { display: none; }
body.level-advanced .intermediate-only { display: none; }
```

JavaScript to apply body class:
```javascript
document.body.classList.add(`level-${level}`);
```

---

## Example: UTXO Visualizer Multi-Level

### Beginner Mode
**URL**: `/interactive-demos/concepts/utxo-model/?level=beginner&path=curious`

**Initial State**:
- Wallet pre-loaded with 3 UTXOs: 0.05 BTC, 0.03 BTC, 0.02 BTC
- Alice's address shown in recipient field
- Amount pre-filled: 0.01 BTC

**Challenges**:
1. ✅ "Click 'Create Transaction' to send 0.01 BTC to Alice"
2. ⏸️ "Notice the 'Change Output' created automatically"
3. ⏸️ "Try spending the same UTXO twice (spoiler: it won't work!)"

**Tooltips** (auto-show on first load):
- Hovers over UTXO → "This is a coin you can spend. It's worth 0.05 BTC."
- Hovers over Outputs → "Where you're sending money. Output 1 is Alice, Output 2 is your change."
- Hovers over Fee → "A small tip to miners to include your transaction in a block."

**Validation**:
- Strict: Can't create invalid transaction
- Shows error: "❌ You must select at least one UTXO to spend"
- Shows success: "✅ Transaction valid! Ready to broadcast."

---

### Intermediate Mode
**URL**: `/interactive-demos/concepts/utxo-model/?level=intermediate&path=sovereign`

**Initial State**:
- Blank wallet (no UTXOs)
- Instruction: "Import UTXOs from mempool or create custom ones"

**Challenges**:
1. ⏸️ "Create a transaction that doesn't reuse addresses"
2. ⏸️ "Use coin control to avoid linking unrelated UTXOs"
3. ⏸️ "Manually set fee based on current mempool conditions"

**Tooltips**:
- On-hover only
- Privacy-focused: "Combining UTXOs from different sources harms privacy"

**Validation**:
- Relaxed: Warns about privacy leaks but allows transaction
- Shows warning: "⚠️ Combining these UTXOs may link your addresses"

**Hints** (on request):
- "💡 Hint: Check if any UTXOs share a common address history"
- "💡 Hint: Use the 'Privacy Score' indicator to optimize coin selection"

---

### Advanced Mode
**URL**: `/interactive-demos/concepts/utxo-model/?level=advanced&path=builder`

**Initial State**:
- Blank wallet
- Raw transaction editor visible

**Challenges**:
1. ⏸️ "Construct a 3-input, 2-output transaction from scratch"
2. ⏸️ "Include one P2SH input (2-of-3 multisig)"
3. ⏸️ "Calculate witness discount and verify txid"

**Technical Panels** (always visible):
- **Raw Hex**: Live hex output as transaction is built
- **Script Inspector**: See locking/unlocking scripts
- **Witness Data**: Examine segregated witness structure
- **Virtual Size Calculator**: Compute vsize vs weight

**Validation**:
- Manual: User must run `Validate Transaction` button
- Detailed error output: "OP_CHECKSIG failed: signature invalid for input 2"

**No tooltips, no hints** — assumes expert knowledge.

---

## Retrofitting Existing Demos

### Step-by-Step Process

#### 1. Audit Current Demo
- List all features
- Identify which features are beginner vs. advanced
- Note any hardcoded assumptions (e.g., pre-filled data)

#### 2. Create Level Config
- Define 3 configurations (beginner/intermediate/advanced)
- Decide what's shown/hidden at each level
- Write challenge lists

#### 3. Refactor UI
- Add `level-beginner`, `level-intermediate`, `level-advanced` CSS classes
- Wrap beginner-only content in `.beginner-only` divs
- Wrap advanced-only content in `.advanced-only` divs

#### 4. Add Level Detection
- Parse `?level=` from URL
- Apply body class: `document.body.classList.add('level-beginner')`
- Load level config

#### 5. Test All 3 Levels
- Walk through each level as if you're that persona
- Verify tooltips, hints, and challenges work correctly
- Check that advanced features are hidden in beginner mode

#### 6. Add Analytics
- Track which level users enter
- Log challenge completion by level
- Measure time spent per level

---

## Level Switcher UI

Allow users to switch levels on the fly:

```html
<div class="level-switcher">
  <label>Difficulty:</label>
  <button class="level-btn active" data-level="beginner">Beginner</button>
  <button class="level-btn" data-level="intermediate">Intermediate</button>
  <button class="level-btn" data-level="advanced">Advanced</button>
</div>
```

```javascript
document.querySelectorAll('.level-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const newLevel = btn.dataset.level;

    // Update URL without reload
    const url = new URL(window.location);
    url.searchParams.set('level', newLevel);
    window.history.pushState({}, '', url);

    // Reload demo with new level
    applyLevelSettings(newLevel);

    // Update active button
    document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});
```

---

## Path-Specific Theming (Optional)

If desired, demos can adapt colors/icons based on which path the learner came from:

```javascript
const PATH_THEMES = {
  curious: {
    primaryColor: '#4caf50',  // Green
    icon: '🌱',
    name: 'The Curious Path'
  },
  builder: {
    primaryColor: '#2196f3',  // Blue
    icon: '⚙️',
    name: 'The Builder Path'
  },
  sovereign: {
    primaryColor: '#d4af37',  // Gold
    icon: '👑',
    name: 'The Sovereign Path'
  }
};

const path = urlParams.get('path') || 'curious';
const theme = PATH_THEMES[path];

document.documentElement.style.setProperty('--path-color', theme.primaryColor);
document.getElementById('path-badge').textContent = `${theme.icon} ${theme.name}`;
```

This is **optional** — might help learners feel oriented, but could also be distracting.

---

## Analytics & Tracking

Track demo usage to optimize content:

```javascript
// On demo load
analytics.track('Demo Started', {
  demo: 'utxo-visualizer',
  level: level,
  path: path,
  stage: urlParams.get('stage'),
  module: urlParams.get('module'),
  timestamp: new Date().toISOString()
});

// On challenge completion
function completeChallenge(challengeIndex) {
  const timeSpent = (Date.now() - context.startTime) / 1000; // seconds

  analytics.track('Challenge Completed', {
    demo: 'utxo-visualizer',
    level: level,
    challengeIndex: challengeIndex,
    timeSpent: timeSpent
  });
}

// On demo exit
window.addEventListener('beforeunload', () => {
  const timeSpent = (Date.now() - context.startTime) / 1000;

  analytics.track('Demo Exited', {
    demo: 'utxo-visualizer',
    level: level,
    timeSpent: timeSpent,
    challengesCompleted: completedChallenges.length
  });
});
```

### Key Metrics to Track
- **Completion rate by level** — Are advanced challenges too hard?
- **Time spent per level** — Is beginner mode too hand-holdy? Is advanced too sparse?
- **Drop-off points** — Where do users exit without completing?
- **Level switching** — Do users switch from beginner to advanced? How often?

---

## Testing Checklist

Before marking a demo as "multi-level ready":

- [ ] **Beginner mode**: New user can complete all challenges without prior knowledge
- [ ] **Intermediate mode**: Challenges require critical thinking but hints are available
- [ ] **Advanced mode**: Challenges are technically rigorous and expose raw data
- [ ] **Level switcher works**: Can toggle between levels without page reload
- [ ] **No leakage**: Beginner users don't see advanced UI elements
- [ ] **Tooltips behave correctly**: Verbose in beginner, minimal in advanced
- [ ] **Challenges load correctly**: Each level shows appropriate challenges
- [ ] **Analytics fire**: Track events on load, challenge completion, exit
- [ ] **Mobile responsive**: All 3 levels work on small screens
- [ ] **Accessibility**: Tooltips and challenges are screen-reader friendly

---

## Rollout Plan

### Phase 1: Prototype (Week 1)
- Pick **one demo** to retrofit (UTXO Visualizer recommended — high impact, manageable scope)
- Implement all 3 levels
- Test with 3 users (one per persona)
- Gather feedback

### Phase 2: Refine Pattern (Week 2)
- Adjust based on feedback
- Document lessons learned
- Create reusable code snippets (level detection, tooltip system, etc.)

### Phase 3: Scale to All Demos (Weeks 3-5)
- Retrofit remaining demos one by one:
  - [ ] Transaction Builder
  - [ ] Mining Simulator
  - [ ] Consensus Game
  - [ ] Wallet Workshop
  - [ ] Lightning Lab (or merged demo)
  - [ ] Security Dojo

### Phase 4: Update Path Links (Week 6)
- Update all path modules to link with `?level=` param
- Ensure beginner paths use `?level=beginner`
- Ensure advanced paths use `?level=advanced`
- Test full path flows

### Phase 5: Monitor & Iterate (Ongoing)
- Review analytics weekly
- Adjust challenge difficulty based on completion rates
- Add new challenges as requested
- Fix bugs and improve UX

---

## Code Snippets Library

### Level Detector (Reusable)
```javascript
// level-detector.js
export function getLevelConfig() {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    level: urlParams.get('level') || 'beginner',
    path: urlParams.get('path') || 'unknown',
    stage: urlParams.get('stage'),
    module: urlParams.get('module')
  };
}

export function applyBodyClass(level) {
  document.body.classList.add(`level-${level}`);
}
```

### Tooltip System (Reusable)
```javascript
// tooltip-system.js
export function initTooltips(mode) {
  const tooltips = document.querySelectorAll('[data-tooltip]');

  if (mode === 'verbose') {
    // Auto-show on first visit
    tooltips.forEach(el => {
      el.classList.add('tooltip-show');
      setTimeout(() => el.classList.remove('tooltip-show'), 5000);
    });
  } else if (mode === 'on-hover') {
    // Show on hover only
    tooltips.forEach(el => {
      el.addEventListener('mouseenter', () => el.classList.add('tooltip-show'));
      el.addEventListener('mouseleave', () => el.classList.remove('tooltip-show'));
    });
  }
  // If 'minimal', do nothing (tooltips hidden by CSS)
}
```

### Challenge Tracker (Reusable)
```javascript
// challenge-tracker.js
export class ChallengeTracker {
  constructor(challenges) {
    this.challenges = challenges;
    this.completed = new Set();
  }

  render(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = this.challenges.map((challenge, i) => `
      <div class="challenge-item ${this.completed.has(i) ? 'completed' : ''}">
        <span class="challenge-icon">${this.completed.has(i) ? '✅' : '⏸️'}</span>
        <span class="challenge-text">${challenge}</span>
      </div>
    `).join('');
  }

  complete(index) {
    this.completed.add(index);
    this.render('challenge-list');

    // Fire analytics event
    if (typeof analytics !== 'undefined') {
      analytics.track('Challenge Completed', {
        challengeIndex: index,
        challenge: this.challenges[index]
      });
    }
  }
}
```

---

## Questions & Decisions Needed

1. **Should demos remember the user's level preference?**
   - Store in `localStorage` so next demo opens at same level?
   - Or always default to path-appropriate level?

2. **Should there be a "Level Up" prompt?**
   - After completing beginner challenges: "Ready to try intermediate mode?"
   - Or let users discover level switcher on their own?

3. **How to handle mixed-level groups?**
   - If a teacher assigns a demo, can they lock to one level?
   - Or should all levels always be accessible?

4. **Do we need a 4th level (Expert)?**
   - Some demos might benefit from an even more technical mode
   - Or is 3 levels sufficient?

---

**Next Steps**:
1. Review this pattern with development team
2. Choose first demo to prototype (recommend UTXO Visualizer)
3. Implement and test with real users
4. Document learnings and adjust pattern
5. Roll out to remaining demos

