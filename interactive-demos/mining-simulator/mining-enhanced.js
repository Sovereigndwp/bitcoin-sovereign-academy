/**
 * Mining Simulator Enhancements
 * Adds Socratic questions, difficulty levels, and enhanced visualizations
 */

class MiningSimulatorEnhanced {
  constructor() {
    this.difficulty = 'guided'; // guided, interactive, challenge, expert
    this.miningMode = 'easy'; // easy, realistic
    this.socraticQuestionsRevealed = [];
    this.totalHashAttempts = 0;
    this.successfulNonces = [];

    this.init();
  }

  init() {
    console.log('⛏️ Mining Simulator Enhanced: Initializing...');
    try {
      this.addDifficultySelector();
      console.log('  ✅ Difficulty selector added');
      this.addMiningModeToggle();
      console.log('  ✅ Mining mode toggle added');
      this.addSocraticQuestions();
      console.log('  ✅ Socratic questions added');
      this.addProofOfWorkVisualization();
      console.log('  ✅ PoW visualization added');
      this.enhanceExistingFunctionality();
      console.log('  ✅ Enhanced existing functionality');
      console.log('✅ Mining Simulator Enhanced: Initialization complete');
    } catch (error) {
      console.error('❌ Mining Simulator Enhanced: Initialization failed', error);
    }
  }

  addDifficultySelector() {
    const header = document.querySelector('.header p');
    if (!header) return;

    const difficultyHTML = `
      <div class="difficulty-selector" style="margin-top: 1.5rem;">
        <h3 style="font-size: 1.1rem; margin-bottom: 0.75rem; color: var(--text-light);">Choose Your Learning Mode</h3>
        <div class="difficulty-buttons" style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
          <button class="difficulty-btn active" data-difficulty="guided">
            🎓 Guided
            <div style="font-size: 0.75rem; opacity: 0.8; margin-top: 0.25rem;">All explanations</div>
          </button>
          <button class="difficulty-btn" data-difficulty="interactive">
            🔧 Interactive
            <div style="font-size: 0.75rem; opacity: 0.8; margin-top: 0.25rem;">Hands-on learning</div>
          </button>
          <button class="difficulty-btn" data-difficulty="challenge">
            🏆 Challenge
            <div style="font-size: 0.75rem; opacity: 0.8; margin-top: 0.25rem;">Quiz mode</div>
          </button>
          <button class="difficulty-btn" data-difficulty="expert">
            ⚡ Expert
            <div style="font-size: 0.75rem; opacity: 0.8; margin-top: 0.25rem;">Minimal guidance</div>
          </button>
        </div>
      </div>
    `;

    header.insertAdjacentHTML('afterend', difficultyHTML);

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .difficulty-btn {
        background: rgba(0, 0, 0, 0.3);
        border: 2px solid rgba(247, 147, 26, 0.3);
        color: var(--text-light);
        padding: 0.75rem 1.25rem;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.3s;
        font-size: 0.9rem;
        font-weight: 600;
      }
      .difficulty-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(247, 147, 26, 0.3);
      }
      .difficulty-btn.active {
        background: rgba(247, 147, 26, 0.2);
        border-color: var(--primary-orange);
      }
    `;
    document.head.appendChild(style);

    // Event listeners
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.difficulty = e.currentTarget.dataset.difficulty;
        this.updateForDifficulty();
      });
    });
  }

  addMiningModeToggle() {
    const controls = document.querySelector('.mining-controls');
    if (!controls) return;

    const modeHTML = `
      <div class="mining-mode-toggle" style="background: rgba(0, 0, 0, 0.3); padding: 1.5rem; border-radius: 10px; margin-bottom: 1.5rem;">
        <h4 style="color: var(--primary-orange); margin-bottom: 1rem;">⚙️ Mining Mode</h4>
        <div style="display: flex; gap: 1rem; justify-content: center;">
          <button class="mode-btn active" data-mode="easy" style="flex: 1; background: rgba(76, 175, 80, 0.2); border: 2px solid #4CAF50; color: var(--text-light); padding: 1rem; border-radius: 8px; cursor: pointer; font-weight: 600;">
            😊 Easy Mode
            <div style="font-size: 0.85rem; margin-top: 0.5rem; opacity: 0.9;">See every hash attempt, find blocks quickly</div>
          </button>
          <button class="mode-btn" data-mode="realistic" style="flex: 1; background: rgba(0, 0, 0, 0.3); border: 2px solid rgba(244, 67, 54, 0.5); color: var(--text-light); padding: 1rem; border-radius: 8px; cursor: pointer; font-weight: 600;">
            ⚡ Realistic Mode
            <div style="font-size: 0.85rem; margin-top: 0.5rem; opacity: 0.9;">True Bitcoin difficulty, billions of attempts</div>
          </button>
        </div>
        <div id="mode-explanation" style="margin-top: 1rem; padding: 1rem; background: rgba(76, 175, 80, 0.1); border-radius: 6px; font-size: 0.9rem;">
          <strong>Easy Mode:</strong> Simplified for learning. You'll find blocks in seconds to understand the process.
        </div>
      </div>
    `;

    controls.insertAdjacentHTML('afterbegin', modeHTML);

    // Event listeners
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.mode-btn').forEach(b => {
          b.classList.remove('active');
          b.style.background = 'rgba(0, 0, 0, 0.3)';
        });
        e.currentTarget.classList.add('active');
        e.currentTarget.style.background = e.currentTarget.dataset.mode === 'easy'
          ? 'rgba(76, 175, 80, 0.2)'
          : 'rgba(244, 67, 54, 0.2)';

        this.miningMode = e.currentTarget.dataset.mode;
        this.updateModeExplanation();
      });
    });
  }

  updateModeExplanation() {
    const explanation = document.getElementById('mode-explanation');
    if (!explanation) return;

    if (this.miningMode === 'easy') {
      explanation.innerHTML = '<strong>Easy Mode:</strong> Simplified for learning. You\'ll find blocks in seconds to understand the process.';
      explanation.style.background = 'rgba(76, 175, 80, 0.1)';
    } else {
      explanation.innerHTML = '<strong>Realistic Mode:</strong> True Bitcoin difficulty. Finding a block requires billions of hash attempts. This shows the real computational challenge of mining.';
      explanation.style.background = 'rgba(244, 67, 54, 0.1)';
    }
  }

  addSocraticQuestions() {
    const questions = [
      {
        id: 'proof-of-work',
        position: 'after-controls',
        question: 'Why does Bitcoin mining require so much computational work?',
        answer: `Bitcoin's Proof-of-Work serves THREE critical purposes:

**1. Security Through Cost**
Mining difficulty makes attacking Bitcoin economically unfeasible. To rewrite history (51% attack):
- You'd need to control more computing power than all honest miners combined
- Cost: Billions of dollars in hardware + electricity
- Even if successful, you'd destroy Bitcoin's value, making your attack worthless
- It's cheaper to mine honestly and earn block rewards!

**2. Decentralized Consensus Without Trust**
Without a central authority, how do thousands of nodes worldwide agree on which transactions are valid?
- Proof-of-Work provides objective proof that computational work was done
- The longest chain with the most cumulative work is accepted as truth
- No voting, no committees, no trust required
- Pure mathematics and energy expenditure

**3. Fair, Predictable Distribution**
Mining is the ONLY way new bitcoins are created:
- No pre-mine or founder's reserve
- Anyone can participate (permissionless)
- Issuance rate is predictable (halving every 4 years)
- Distribution favors those who invest most in securing the network

**Historical Context:**
Before Bitcoin, all previous digital currency attempts failed because they couldn't solve the "double-spend problem" without a trusted third party. Satoshi's breakthrough was using Proof-of-Work to create consensus without trust.`
      },
      {
        id: 'difficulty-adjustment',
        position: 'after-dashboard',
        question: 'How does Bitcoin maintain a 10-minute block time despite changing hashrate?',
        answer: `Bitcoin has a brilliant self-regulating mechanism called the **Difficulty Adjustment Algorithm**.

**How It Works:**

Every 2,016 blocks (~2 weeks), Bitcoin:
1. Measures actual time taken to mine those 2,016 blocks
2. Compares to target time: 2,016 blocks × 10 minutes = 20,160 minutes (2 weeks)
3. Adjusts difficulty proportionally

**Formula:**
\`\`\`
New Difficulty = Old Difficulty × (Actual Time / Target Time)
\`\`\`

**Real Examples:**

**Example 1: Hashrate Increased (2021)**
- Actual time for 2,016 blocks: 12 days (faster than 14 days)
- Calculation: Old Difficulty × (12/14) = Old Difficulty × 0.857
- Result: Difficulty INCREASED by ~16.7% to slow down blocks back to 10 min

**Example 2: China Mining Ban (2021)**
- China banned Bitcoin mining → ~50% of global hashrate went offline overnight!
- Actual time for 2,016 blocks: ~19 days (slower than 14 days)
- Calculation: Old Difficulty × (19/14) = Old Difficulty × 1.357
- Result: Difficulty DECREASED by ~28% to speed up blocks back to 10 min

**Why 10 Minutes?**
- Fast enough: Reasonably quick confirmations
- Slow enough: Allows blocks to propagate globally before next block
- Prevents chain splits from network latency
- Balances security vs usability

**Fun Fact:**
Bitcoin's hashrate has grown from ~10 MH/s (2009) to ~400 EH/s (2024) — that's a 40 QUADRILLION times increase! Yet blocks still come every ~10 minutes thanks to difficulty adjustment.`
      },
      {
        id: 'hash-function',
        position: 'after-animation',
        question: 'What makes SHA-256 hashing perfect for mining?',
        answer: `SHA-256 (Secure Hash Algorithm 256-bit) has special properties that make it ideal for Bitcoin mining:

**Key Properties:**

**1. Deterministic**
- Same input ALWAYS produces same output
- Hash of "Hello" is always: 185f8db32271fe25f561a6fc938b2e264306ec304eda518007d1764826381969
- Allows anyone to verify work

**2. One-Way Function (Preimage Resistance)**
- Easy to compute: Data → Hash (milliseconds)
- IMPOSSIBLE to reverse: Hash → Data
- Given hash "00000abc...", you can't calculate which nonce produced it
- Only way to find it: Try billions of nonces

**3. Avalanche Effect**
- Change ONE bit of input → Completely different hash
- "Hello" → 185f8db3...
- "hello" → 2cf24dba... (entirely different!)
- Makes patterns impossible to find

**4. Unpredictable**
- No correlation between input and output
- Nonce 1,234 might give: ff3c2a...
- Nonce 1,235 might give: 0000ab...
- Can't "get close" to a valid hash

**5. Fixed Output Size**
- Always exactly 256 bits (64 hex characters)
- Whether input is 1 byte or 1 gigabyte

**Mining Example:**

Block Header (inputs):
\`\`\`
Version: 1
Previous Block Hash: 000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f
Merkle Root: 4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b
Timestamp: 1231006505
Difficulty: 486604799
Nonce: ??????
\`\`\`

Miners try nonces:
- Nonce 0 → SHA-256 → fe3a92... (doesn't start with enough zeros, invalid)
- Nonce 1 → SHA-256 → b3f88d... (doesn't start with enough zeros, invalid)
- ...
- Nonce 2,083,236,893 → SHA-256 → 00000000839a8e6886ab5951d76f411475428afc90947ee320161bbf18eb6048 ✅

Found it! This hash has enough leading zeros to meet the difficulty target.

**Why This Works for Mining:**
- Can't predict which nonce will work (must try them all)
- Can't work backwards from target hash
- Easy for others to verify (one hash calculation)
- Requires massive computational effort to succeed

This is why mining is often called "SHA-256 lottery" — you're essentially generating random numbers until you get lucky!`
      },
      {
        id: 'mining-economics',
        position: 'after-chart',
        question: 'Is Bitcoin mining profitable for individuals, or only for big companies?',
        answer: `Bitcoin mining economics have evolved dramatically since 2009:

**The Evolution:**

**2009-2012: The CPU Era**
- Anyone could mine on a laptop
- Satoshi mined blocks on his computer
- Block reward: 50 BTC (~$0.05 value)
- Electricity cost was main expense

**2013-2015: GPU & FPGA Era**
- Graphics cards 10-100x more efficient than CPUs
- Hobbyists building mining rigs
- Block reward: 25 BTC (after first halving)
- Home mining still profitable in some regions

**2013-Present: ASIC Era**
- Application-Specific Integrated Circuits (ASICs)
- Designed ONLY for SHA-256 hashing
- Millions of times more efficient than CPUs
- Changed mining from hobby to industrial operation

**2024 Reality Check:**

**Small-Scale Mining (Home Setup):**
- **Hardware**: Antminer S19 XP (~$5,000)
  - Hashrate: 140 TH/s
  - Power: 3,010 watts (3 kW)

- **Electricity Cost** (key variable):
  - $0.05/kWh (cheap): Possibly profitable
  - $0.10/kWh (average US): Barely profitable
  - $0.15/kWh (expensive): Losing money

- **Your Network Share**: 140 TH/s ÷ 400 EH/s = 0.000000035%
  - Expected blocks per year: ~0.0018 (you'd find a block every ~555 years!)
  - Solution: Join a mining pool

**Mining Pools:**
- Combine hashrate with thousands of miners
- Share block rewards proportionally
- Get consistent small payouts instead of rare jackpots
- Pool fees: 1-3% of earnings

**Industrial Mining (Big Companies):**
- Advantages:
  - Bulk hardware discounts (30-50% off retail)
  - Negotiated electricity rates ($0.02-0.04/kWh)
  - Economies of scale (cheaper infrastructure per TH)
  - Access to stranded energy (flare gas, curtailed renewables)

- Examples:
  - Marathon Digital: 23 EH/s
  - Riot Platforms: 12 EH/s
  - Use warehouses with thousands of ASICs

**The Harsh Truth:**

Unless you have:
1. ✅ Cheap electricity (<$0.05/kWh)
2. ✅ Access to latest ASICs at good prices
3. ✅ Technical knowledge for maintenance
4. ✅ Tolerance for noise and heat

...home mining is more of a hobby/learning experience than a business.

**Better Alternatives for Individuals:**
- **Learn by mining altcoins**: Some can still be mined on GPUs
- **Cloud mining**: Rent hashrate (watch for scams!)
- **Just buy Bitcoin**: Often better ROI than mining equipment
- **Contribute to network**: Run a full node instead (no profit, but helps decentralization)

**Fun Fact:**
In 2024, Bitcoin miners collectively spend ~$15 billion/year on electricity. That's more than the entire country of Portugal!`
      }
    ];

    questions.forEach(q => {
      const html = `
        <div class="socratic-question" data-id="${q.id}" style="background: rgba(33, 150, 243, 0.1); border-left: 4px solid #2196F3; padding: 1.25rem; margin: 1.5rem 0; border-radius: 8px;">
          <h4 style="color: #2196F3; margin-bottom: 0.75rem; font-size: 1.05rem;">🤔 Socratic Question</h4>
          <p style="font-weight: 600; margin-bottom: 0.75rem; color: var(--text-light);">${q.question}</p>
          <button onclick="window.miningEnhanced.revealAnswer('${q.id}')" style="background: #2196F3; color: white; border: none; padding: 0.5rem 1.25rem; border-radius: 6px; cursor: pointer; font-weight: 600;">
            Reveal Answer
          </button>
          <div class="socratic-answer" data-id="${q.id}" style="display: none; margin-top: 1rem; padding: 1rem; background: rgba(0, 0, 0, 0.3); border-radius: 6px; line-height: 1.6; white-space: pre-wrap;">${q.answer}</div>
        </div>
      `;

      let insertPoint;
      switch(q.position) {
        case 'after-controls':
          insertPoint = document.querySelector('.mining-controls');
          break;
        case 'after-dashboard':
          insertPoint = document.querySelector('.mining-dashboard');
          break;
        case 'after-animation':
          insertPoint = document.querySelector('.mining-animation');
          break;
        case 'after-chart':
          insertPoint = document.querySelector('.difficulty-chart');
          break;
      }

      if (insertPoint) {
        insertPoint.insertAdjacentHTML('afterend', html);
      }
    });
  }

  revealAnswer(questionId) {
    const answer = document.querySelector(`.socratic-answer[data-id="${questionId}"]`);
    if (answer) {
      answer.style.display = 'block';
      const button = answer.previousElementSibling;
      if (button) {
        button.textContent = '✅ Answer Revealed';
        button.disabled = true;
        button.style.opacity = '0.6';
      }
      this.socraticQuestionsRevealed.push(questionId);
    }
  }

  addProofOfWorkVisualization() {
    const animation = document.querySelector('.mining-animation');
    if (!animation) return;

    const vizHTML = `
      <div class="pow-visualization" style="background: rgba(0, 0, 0, 0.3); padding: 1.5rem; border-radius: 10px; margin-top: 1.5rem;">
        <h4 style="color: var(--primary-orange); margin-bottom: 1rem;">🔍 Proof-of-Work Attempts</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div style="background: rgba(0, 0, 0, 0.2); padding: 1rem; border-radius: 8px;">
            <div style="color: var(--text-dim); font-size: 0.9rem; margin-bottom: 0.5rem;">Total Hash Attempts</div>
            <div id="totalAttempts" style="font-size: 1.5rem; font-weight: bold; color: var(--primary-orange);">0</div>
          </div>
          <div style="background: rgba(0, 0, 0, 0.2); padding: 1rem; border-radius: 8px;">
            <div style="color: var(--text-dim); font-size: 0.9rem; margin-bottom: 0.5rem;">Current Nonce</div>
            <div id="currentNonce" style="font-size: 1.5rem; font-weight: bold; color: #2196F3;">0</div>
          </div>
        </div>
        <div style="margin-top: 1rem; padding: 1rem; background: rgba(76, 175, 80, 0.1); border-radius: 6px;">
          <div style="color: var(--text-dim); font-size: 0.85rem; margin-bottom: 0.25rem;">Target (hash must be less than):</div>
          <div id="target" style="font-family: monospace; font-size: 0.9rem; word-break: break-all; color: #4CAF50;">0000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff</div>
        </div>
        <div style="margin-top: 1rem; padding: 1rem; background: rgba(0, 0, 0, 0.2); border-radius: 6px;">
          <div style="color: var(--text-dim); font-size: 0.85rem; margin-bottom: 0.25rem;">Current Hash:</div>
          <div id="currentHash" style="font-family: monospace; font-size: 0.9rem; word-break: break-all;" class="hash-comparison">Waiting to start mining...</div>
        </div>
      </div>
    `;

    animation.insertAdjacentHTML('afterend', vizHTML);

    // Add hash comparison style
    const style = document.createElement('style');
    style.textContent = `
      .hash-comparison.valid {
        color: #4CAF50 !important;
        font-weight: bold;
        animation: hashSuccess 0.5s ease;
      }
      .hash-comparison.invalid {
        color: #f44336 !important;
      }
      @keyframes hashSuccess {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
    `;
    document.head.appendChild(style);
  }

  updateVisualization(nonce, hash, isValid) {
    const totalAttemptsEl = document.getElementById('totalAttempts');
    const currentNonceEl = document.getElementById('currentNonce');
    const currentHashEl = document.getElementById('currentHash');

    if (totalAttemptsEl) {
      this.totalHashAttempts++;
      totalAttemptsEl.textContent = this.totalHashAttempts.toLocaleString();
    }

    if (currentNonceEl) {
      currentNonceEl.textContent = nonce.toLocaleString();
    }

    if (currentHashEl) {
      currentHashEl.textContent = hash;
      currentHashEl.className = 'hash-comparison ' + (isValid ? 'valid' : 'invalid');
    }

    if (isValid) {
      this.successfulNonces.push({ nonce, hash, attempts: this.totalHashAttempts });
    }
  }

  enhanceExistingFunctionality() {
    console.log('  → Checking for existing functions...');

    // Check if startMining exists
    if (typeof window.startMining === 'function') {
      console.log('  ✅ startMining function found');
    } else {
      console.warn('  ⚠️ startMining function NOT found - mining button may not work!');
    }

    // Hook into existing findBlock function
    const originalFindBlock = window.findBlock;
    if (originalFindBlock) {
      console.log('  ✅ findBlock function found, hooking into it');
      window.findBlock = () => {
        originalFindBlock();
        // Reset attempts counter for next block
        this.totalHashAttempts = 0;
      };
    } else {
      console.warn('  ⚠️ findBlock function NOT found');
    }
  }

  updateForDifficulty() {
    const tips = document.querySelectorAll('.educational-tip');
    const questions = document.querySelectorAll('.socratic-question');

    switch(this.difficulty) {
      case 'guided':
        tips.forEach(tip => tip.style.display = 'block');
        questions.forEach(q => q.style.display = 'block');
        break;
      case 'interactive':
        tips.forEach(tip => tip.style.display = 'none');
        questions.forEach(q => q.style.display = 'block');
        break;
      case 'challenge':
      case 'expert':
        tips.forEach(tip => tip.style.display = 'none');
        questions.forEach(q => q.style.display = 'none');
        break;
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.miningEnhanced = new MiningSimulatorEnhanced();
  });
} else {
  window.miningEnhanced = new MiningSimulatorEnhanced();
}
