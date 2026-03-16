# Principled Path Module Template Guide

## Overview

This guide documents the structure and patterns used in Module 1 (`stage-1/module-1.html`), which serves as the exemplar template for all 14 remaining modules in the Principled Path.

---

## File Structure

### Module File Location
```
/paths/principled/stage-{N}/module-{N}.html
```

Example:
- `/paths/principled/stage-1/module-1.html` ✅ (exemplar)
- `/paths/principled/stage-1/module-2.html` (next to build)
- `/paths/principled/stage-2/module-1.html` (future)

### Stage Index Location
```
/paths/principled/stage-{N}/index.html
```

---

## CSS Variables & Theme

The Principled Path uses a **gold/bronze color scheme** distinct from other paths:

```css
:root {
    --primary-orange: #f7931a;        /* Bitcoin orange */
    --primary-dark: #1a1a1a;          /* Dark background */
    --secondary-dark: #2d2d2d;        /* Card backgrounds */
    --accent-gold: #DAA520;           /* Primary accent (gold) */
    --accent-bronze: #8B6F47;         /* Secondary accent (bronze) */
    --text-light: #e0e0e0;            /* Main text color */
    --text-dim: #999;                 /* Dimmed text */
    --border-color: rgba(218, 165, 32, 0.2); /* Subtle gold borders */
    --accent-green: #4caf50;          /* Success states */
    --accent-red: #ef4444;            /* Error/danger states */
}
```

### When to Use Each Color:
- **Gold** (`--accent-gold`): Headers, titles, CTA buttons, highlights
- **Bronze** (`--accent-bronze`): Gradients, secondary elements
- **Orange** (`--primary-orange`): Bitcoin-specific elements, special emphasis
- **Green/Red**: Demo feedback states (healthy/crisis)

---

## Module Structure Template

Every module should follow this 7-section structure:

### 1. **Navigation Header**
```html
<div class="nav-buttons">
    <a href="/paths/principled/stage-{N}/" class="back-button">
        ← Back to Stage {N}
    </a>
</div>
```

### 2. **Module Header**
```html
<header class="module-header">
    <div class="module-number">Stage {N} • Module {M}</div>
    <h1>[Module Title]</h1>
    <p class="module-subtitle">[Pithy one-liner]</p>
</header>
```

**Examples:**
- Module 1: "You can't get something for nothing"
- Module 2: "Everything decays without constant energy"

### 3. **Introduction Section**
```html
<section class="content-section">
    <h2>[Conceptual Title]</h2>
    <p>
        Start with a first-principles explanation.
        Connect physics/thermodynamics to economics/Bitcoin.
    </p>

    <div class="key-insight">
        <div class="key-insight-title">⚡ Core Principle</div>
        <p>
            The key takeaway. One powerful insight that anchors the module.
        </p>
    </div>
</section>
```

### 4. **Problem Section**
```html
<section class="content-section">
    <h2>[The Problem/Illusion/Paradox]</h2>
    <p>
        Use a concrete analogy or historical example.
        Show why the traditional approach fails.
    </p>

    <div class="key-insight">
        <div class="key-insight-title">🌾 [Analogy Title]</div>
        <p>
            A memorable metaphor that makes the concept stick.
        </p>
    </div>
</section>
```

### 5. **Interactive Demo Section** ⭐
```html
<section class="demo-section">
    <div class="demo-header">
        <h3>🎮 Interactive Lab: [Demo Name]</h3>
        <p class="demo-description">
            Clear instructions on what the user will explore.
        </p>
    </div>

    <div class="demo-canvas">
        <!-- Demo controls, visualizations, meters -->
    </div>

    <div class="key-insight">
        <div class="key-insight-title">💡 What You're Seeing</div>
        <p>
            Explain the behavior and what it reveals.
        </p>
    </div>
</section>
```

**Interactive Demo Patterns:**

#### Pattern A: Slider-Based Converter
```html
<div class="control-row">
    <label for="energySlider">⚡ Energy Input:</label>
    <input type="range" id="energySlider" min="0" max="100" value="50">
    <span id="energyValue">50</span>
</div>
```

#### Pattern B: Button-Triggered Events
```html
<button class="demo-button" onclick="addProduction()">
    🌾 Add Real Production
</button>
<button class="demo-button danger" onclick="printMoney()">
    🖨️ Print New Money
</button>
```

#### Pattern C: Meters/Progress Bars
```html
<div class="energy-meter">
    <div class="meter-label">Energy Input (Sunlight/Labor)</div>
    <div class="meter-bar">
        <div class="meter-fill" id="energyMeter" style="width: 50%;">50</div>
    </div>
</div>
```

### 6. **Bitcoin's Solution Section**
```html
<section class="content-section">
    <h2>[Bitcoin Restores/Solves/Enforces X]</h2>
    <p>
        Explain how Bitcoin addresses the problem through:
        - Proof of Work
        - Fixed supply
        - Decentralization
        - Cryptographic rules
    </p>

    <div class="key-insight">
        <div class="key-insight-title">₿ Bitcoin's Elegant Solution</div>
        <p>
            Tie it back to first principles. Show the elegance.
        </p>
    </div>
</section>
```

### 7. **Socratic Questions Section** 🧠
```html
<section class="socratic-section">
    <h3>💬 Reflect on What You've Learned</h3>
    <p style="text-align: center; color: var(--text-dim); margin-bottom: 2rem;">
        Take a moment to think deeply about these questions. Your answers will be saved locally.
    </p>

    <div class="question-card">
        <div class="question-number">Question 1</div>
        <div class="question-text">
            [Deep, thought-provoking question about the concept]
        </div>
        <textarea class="reflection-area" id="question1" placeholder="Type your thoughts here..."></textarea>
    </div>

    <!-- Repeat for Questions 2 and 3 -->

    <button class="demo-button" onclick="saveReflections()" style="margin-top: 1.5rem; width: 100%;">
        💾 Save My Reflections
    </button>
</section>
```

### 8. **Navigation Footer**
```html
<nav class="module-nav">
    <a href="/paths/principled/stage-{N}/" class="nav-link">
        ← Back to Stage {N}
    </a>
    <div class="progress-indicator">
        Module {M} of {TOTAL} • Stage {N} of 5
    </div>
    <a href="/paths/principled/stage-{N}/module-{M+1}.html" class="nav-link">
        Next: [Next Module Title] →
    </a>
</nav>
```

---

## JavaScript Patterns

### Demo State Management
```javascript
let demoState = {
    variable1: defaultValue,
    variable2: defaultValue,
    calculatedValue: 0
};

function updateDemo() {
    // Get values from inputs
    const input1 = parseInt(document.getElementById('slider1').value);
    const input2 = parseInt(document.getElementById('slider2').value);

    // Update state
    demoState.variable1 = input1;
    demoState.variable2 = input2;
    demoState.calculatedValue = calculateSomething(input1, input2);

    // Update UI
    updateMeters();
    provideAnalysis();
}
```

### Progress Tracking with LocalStorage
```javascript
function saveReflections() {
    const reflections = {
        module: 'stage{N}-module{M}',
        timestamp: new Date().toISOString(),
        q1: document.getElementById('question1').value,
        q2: document.getElementById('question2').value,
        q3: document.getElementById('question3').value
    };

    // Save reflections
    localStorage.setItem('principled_stage{N}_module{M}_reflections', JSON.stringify(reflections));

    // Mark module as completed
    let progress = JSON.parse(localStorage.getItem('principled_stage{N}_progress') || '[]');
    if (!progress.includes('module-{M}')) {
        progress.push('module-{M}');
        localStorage.setItem('principled_stage{N}_progress', JSON.stringify(progress));
    }

    alert('✅ Your reflections have been saved!\n\nModule {M} marked as complete. Continue to Module {M+1}.');
}

// Load saved reflections on page load
window.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('principled_stage{N}_module{M}_reflections');
    if (saved) {
        const reflections = JSON.parse(saved);
        document.getElementById('question1').value = reflections.q1 || '';
        document.getElementById('question2').value = reflections.q2 || '';
        document.getElementById('question3').value = reflections.q3 || '';
    }
    updateDemo(); // Initialize demo
});
```

### Event Listeners
```javascript
// Attach to sliders
document.getElementById('energySlider').addEventListener('input', updateDemo);
document.getElementById('currencySlider').addEventListener('input', updateDemo);

// Attach to buttons
document.getElementById('resetBtn').addEventListener('click', resetDemo);
```

---

## Content Guidelines

### Voice & Tone
- **Socratic**: Ask before telling
- **First Principles**: Start with physics, thermodynamics, information theory
- **Concrete**: Use analogies (farmers, wheat, energy)
- **Sharp**: No fluff. Every sentence earns its place.
- **Visual**: Make abstract concepts tangible through demos

### Writing Patterns

#### Problem → Solution Structure
1. State the physical law
2. Show the violation (fiat money, centralized control)
3. Demonstrate the consequences (inflation, corruption)
4. Reveal Bitcoin's restoration of the law

#### Analogies to Reuse
- **Energy → Value**: Production requires work, not printing
- **Entropy → Corruption**: Systems decay without energy input
- **Thermodynamics → Economics**: Same laws govern both

#### Question Types for Socratic Section
1. **Cause & Effect**: "What happens when X violates Y?"
2. **Beneficiaries**: "Who benefits and who loses?"
3. **Bitcoin's Design**: "Why did Bitcoin choose this approach?"

---

## Interactive Demo Design Patterns

### Pattern 1: Dual-Column Comparison
Use for showing **Real vs Artificial** (production vs currency, energy vs claims)

```html
<div class="demo-grid">
    <div class="demo-column">
        <h4>Real Production</h4>
        <!-- Meters, controls for real things -->
    </div>
    <div class="demo-column">
        <h4>Currency Supply</h4>
        <!-- Meters, controls for artificial claims -->
    </div>
</div>
```

### Pattern 2: Timeline/Decay Simulator
Use for **entropy, corruption over time**

```javascript
let timeStep = 0;
function advanceTime() {
    timeStep++;
    applyDecay(); // Reduce quality/trust
    updateVisualization();
}
```

### Pattern 3: Rule Enforcement Visualizer
Use for **showing rules as constraints vs suggestions**

```javascript
let ruleStrength = 100; // 100 = enforced by code, 0 = unenforced suggestion
function attemptViolation() {
    if (ruleStrength < 50) {
        // Violation succeeds, show consequences
    } else {
        // Rule prevents violation
    }
}
```

---

## Remaining Modules to Build

### Stage 1 (Foundations of Reality)
- ✅ Module 1: The Law of Conservation of Value (complete)
- ⏳ Module 2: Entropy and Corruption (pending)
- ⏳ Module 3: The Role of Rules (pending)

### Stage 2 (Incentives & Cooperation)
- ⏳ Module 1: Incentives Shape Behavior
- ⏳ Module 2: The Tragedy of the Commons
- ⏳ Module 3: Aligning Individual and Collective Good

### Stage 3 (Information & Trust)
- ⏳ Module 1: Information Asymmetry and Power
- ⏳ Module 2: The Byzantine Generals Problem
- ⏳ Module 3: Forgery Resistance

### Stage 4 (Proof of Work & Thermodynamic Anchor)
- ⏳ Module 1: Proof of Work as Thermodynamic Anchor
- ⏳ Module 2: Mining and Game Theory
- ⏳ Module 3: The Longest Chain Wins

### Stage 5 (Emergence & Consequences)
- ⏳ Module 1: Emergent Order from Simple Rules
- ⏳ Module 2: Stranded Energy as Bitcoin's Superpower
- ⏳ Module 3: The Post-State World

---

## Checklist for Building a New Module

- [ ] **Copy Module 1 HTML structure**
- [ ] **Update metadata**: title, stage/module numbers, subtitle
- [ ] **Write Introduction section**: first-principles explanation
- [ ] **Write Problem section**: historical example or analogy
- [ ] **Design Interactive Demo**: choose pattern (sliders, buttons, timeline, etc.)
- [ ] **Implement demo JavaScript**: state management, event listeners, analysis
- [ ] **Write Bitcoin's Solution section**: tie back to first principles
- [ ] **Write 3 Socratic Questions**: deep, thought-provoking
- [ ] **Update navigation**: back link, progress indicator, next link
- [ ] **Test demo functionality**: all sliders, buttons, calculations work
- [ ] **Test localStorage**: reflections save and reload correctly
- [ ] **Update Stage index**: add module card, update progress unlocking
- [ ] **Commit with descriptive message**

---

## Example Commit Message Format

```
Add [Module Title] to Principled Path Stage {N}

Complete Module {M} implementation:
- [Brief content description]
- Interactive [Demo Name] with [key features]
- Real-time [feedback/visualization] system
- [Number] Socratic reflection questions with localStorage
- [Additional features]
- [Line count] of production-ready code

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Tips for Success

### Content Tips
- Start with a strong analogy (farmer's wheat, institutional decay, etc.)
- Use emoji strategically (⚡ for energy, 🌾 for production, ₿ for Bitcoin)
- Keep paragraphs short (2-4 sentences max)
- Bold key concepts on first mention
- End each section with a "key insight" box

### Demo Tips
- Provide immediate visual feedback (meters, colors, animations)
- Include a "reset" or "try again" option
- Show healthy state first, then let user experiment
- Explain what they're seeing in real-time
- Use color coding: green = healthy, yellow = warning, red = crisis

### Testing Tips
- Test on mobile (responsive design)
- Test localStorage in incognito (ensure it works without prior state)
- Test all edge cases (sliders at min/max, rapid clicking, etc.)
- Verify links work (back button, next module, stage index)
- Check console for errors

---

## Resources

- **Exemplar Module**: `/paths/principled/stage-1/module-1.html`
- **Stage Index Example**: `/paths/principled/stage-1/index.html`
- **Main Path Index**: `/paths/principled/index.html`
- **Curriculum Document**: (reference original 5-stage curriculum provided by user)

---

**Last Updated**: 2025-10-25
**Exemplar Module**: Module 1 (Stage 1)
**Status**: Template ready for replication across 14 remaining modules
