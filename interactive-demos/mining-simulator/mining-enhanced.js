/**
 * Mining Simulator Enhanced
 * Complete rewrite with working difficulty modes and block visualization
 */

class MiningSimulatorEnhanced {
  constructor() {
    this.difficulty = 'guided'; // guided, interactive, challenge, expert
    this.miningMode = 'easy'; // easy, realistic
    this.easyModeDifficulty = 3; // Number of leading zeros (1-4)
    this.socraticQuestionsRevealed = [];
    this.totalHashAttempts = 0;
    this.successfulNonces = [];
    this.candidateBlock = null;
    this.miningIntervalId = null;
    this.transactionPool = [];
    this.currentNonce = 0;

    this.init();
  }

  init() {
    console.log('⛏️ Mining Simulator Enhanced: Initializing...');
    try {
      this.addDifficultySelector();
      this.addMiningModeToggle();
      this.addBlockVisualization();
      this.addSocraticQuestions();
      this.addProofOfWorkVisualization();
      this.enhanceExistingFunctionality();
      this.generateTransactionPool();
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
            <div style="font-size: 0.85rem; margin-top: 0.5rem; opacity: 0.9;">Adjustable difficulty, find blocks quickly</div>
          </button>
          <button class="mode-btn" data-mode="realistic" style="flex: 1; background: rgba(0, 0, 0, 0.3); border: 2px solid rgba(244, 67, 54, 0.5); color: var(--text-light); padding: 1rem; border-radius: 8px; cursor: pointer; font-weight: 600;">
            ⚡ Realistic Mode
            <div style="font-size: 0.85rem; margin-top: 0.5rem; opacity: 0.9;">True Bitcoin difficulty, billions of attempts</div>
          </button>
        </div>

        <!-- Easy Mode Difficulty Slider -->
        <div id="easy-difficulty-controls" style="margin-top: 1.5rem; padding: 1rem; background: rgba(76, 175, 80, 0.1); border-radius: 8px;">
          <label style="color: var(--text-light); font-weight: 600; display: block; margin-bottom: 0.75rem;">
            Difficulty: <span id="difficulty-level" style="color: var(--primary-orange);">3 leading zeros</span>
          </label>
          <input type="range" id="difficulty-slider" min="1" max="4" value="3" style="width: 100%; height: 8px; border-radius: 5px; background: rgba(247, 147, 26, 0.2); outline: none; margin-bottom: 0.5rem;">
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-dim);">
            <span>1 zero (easiest)</span>
            <span>2 zeros</span>
            <span>3 zeros</span>
            <span>4 zeros (harder)</span>
          </div>
          <div style="margin-top: 0.75rem; padding: 0.75rem; background: rgba(0, 0, 0, 0.3); border-radius: 6px; font-size: 0.9rem;">
            <strong style="color: var(--primary-orange);">Target Hash:</strong><br>
            <span id="target-example" style="font-family: monospace; color: #4CAF50;">000...</span>
          </div>
        </div>

        <div id="mode-explanation" style="margin-top: 1rem; padding: 1rem; background: rgba(76, 175, 80, 0.1); border-radius: 6px; font-size: 0.9rem;">
          <strong>Easy Mode:</strong> Adjust difficulty from 1-4 leading zeros. You'll find blocks in seconds to understand the mining process.
        </div>
      </div>
    `;

    controls.insertAdjacentHTML('afterbegin', modeHTML);

    // Mode button event listeners
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
        this.updateDifficultyControls();
      });
    });

    // Difficulty slider event listener
    const difficultySlider = document.getElementById('difficulty-slider');
    if (difficultySlider) {
      difficultySlider.addEventListener('input', (e) => {
        this.easyModeDifficulty = parseInt(e.target.value);
        this.updateDifficultyDisplay();
      });
      this.updateDifficultyDisplay();
    }
  }

  updateDifficultyDisplay() {
    const levelEl = document.getElementById('difficulty-level');
    const targetEl = document.getElementById('target-example');

    if (levelEl) {
      levelEl.textContent = `${this.easyModeDifficulty} leading zero${this.easyModeDifficulty > 1 ? 's' : ''}`;
    }

    if (targetEl) {
      const zeros = '0'.repeat(this.easyModeDifficulty);
      const fs = 'f'.repeat(64 - this.easyModeDifficulty);
      targetEl.textContent = zeros + fs;
    }
  }

  updateDifficultyControls() {
    const easyControls = document.getElementById('easy-difficulty-controls');
    if (easyControls) {
      easyControls.style.display = this.miningMode === 'easy' ? 'block' : 'none';
    }
  }

  updateModeExplanation() {
    const explanation = document.getElementById('mode-explanation');
    if (!explanation) return;

    if (this.miningMode === 'easy') {
      explanation.innerHTML = '<strong>Easy Mode:</strong> Adjust difficulty from 1-4 leading zeros. You\'ll find blocks in seconds to understand the mining process.';
      explanation.style.background = 'rgba(76, 175, 80, 0.1)';
    } else {
      explanation.innerHTML = '<strong>Realistic Mode:</strong> True Bitcoin difficulty (~19 leading zeros). Finding a block requires billions of hash attempts. With 100 TH/s, you\'d expect to find a block every ~555 years! This shows the real computational challenge of mining.';
      explanation.style.background = 'rgba(244, 67, 54, 0.1)';
    }
  }

  generateTransactionPool() {
    const names = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve', 'Frank', 'Grace', 'Hank', 'Ivy', 'Jack'];
    this.transactionPool = [];

    for (let i = 0; i < 20; i++) {
      const from = names[Math.floor(Math.random() * names.length)];
      let to = names[Math.floor(Math.random() * names.length)];
      while (to === from) to = names[Math.floor(Math.random() * names.length)];

      this.transactionPool.push({
        id: `tx_${Date.now()}_${i}`,
        from,
        to,
        amount: (Math.random() * 5).toFixed(4),
        fee: (Math.random() * 0.001).toFixed(6)
      });
    }
  }

  addBlockVisualization() {
    const animation = document.querySelector('.mining-animation');
    if (!animation) return;

    const blockVizHTML = `
      <div class="block-visualization" style="background: var(--secondary-dark); border: 2px solid var(--primary-orange); border-radius: 15px; padding: 2rem; margin: 2rem 0;">
        <h3 style="color: var(--primary-orange); margin-bottom: 1.5rem; text-align: center;">📦 Candidate Block Being Mined</h3>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
          <!-- Block Header -->
          <div>
            <h4 style="color: #2196F3; margin-bottom: 1rem;">Block Header</h4>
            <div class="block-field">
              <span class="field-label">Version:</span>
              <span class="field-value" id="block-version">4</span>
            </div>
            <div class="block-field">
              <span class="field-label">Previous Hash:</span>
              <span class="field-value" id="block-prev-hash" style="font-size: 0.75rem; word-break: break-all;">0000000000000000...</span>
            </div>
            <div class="block-field">
              <span class="field-label">Merkle Root:</span>
              <span class="field-value" id="block-merkle" style="font-size: 0.75rem; word-break: break-all;">Calculating...</span>
            </div>
            <div class="block-field">
              <span class="field-label">Timestamp:</span>
              <span class="field-value" id="block-timestamp">---</span>
            </div>
            <div class="block-field">
              <span class="field-label">Difficulty Target:</span>
              <span class="field-value" id="block-difficulty">---</span>
            </div>
            <div class="block-field" style="background: rgba(247, 147, 26, 0.1); border-left: 3px solid var(--primary-orange);">
              <span class="field-label">🔢 Nonce:</span>
              <span class="field-value" id="block-nonce" style="color: var(--primary-orange); font-weight: bold; font-size: 1.2rem;">0</span>
            </div>

            <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
              <div style="color: var(--text-dim); font-size: 0.85rem; margin-bottom: 0.5rem;">Resulting Hash:</div>
              <div id="block-hash-result" style="font-family: monospace; font-size: 0.85rem; word-break: break-all; color: #f44336; transition: all 0.3s;">---</div>
            </div>
          </div>

          <!-- Transactions -->
          <div>
            <h4 style="color: #4CAF50; margin-bottom: 1rem;">Transactions in Block (<span id="tx-count">0</span>/10)</h4>
            <div id="block-transactions" style="max-height: 400px; overflow-y: auto;">
              <p style="color: var(--text-dim); text-align: center; padding: 2rem;">
                Start mining to see transactions being added...
              </p>
            </div>
          </div>
        </div>

        <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(33, 150, 243, 0.1); border-left: 4px solid #2196F3; border-radius: 0 8px 8px 0;">
          <strong style="color: #2196F3;">Mining Process:</strong>
          The miner tries different nonce values, recalculates the hash, and checks if it meets the difficulty target.
          When a valid hash is found (enough leading zeros), the block is broadcast to the network!
        </div>
      </div>
    `;

    animation.insertAdjacentHTML('afterend', blockVizHTML);

    const style = document.createElement('style');
    style.textContent = `
      .block-field {
        display: flex;
        justify-content: space-between;
        padding: 0.75rem;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 6px;
        margin-bottom: 0.5rem;
      }
      .field-label {
        color: var(--text-dim);
        font-size: 0.9rem;
      }
      .field-value {
        color: var(--text-light);
        font-family: monospace;
        font-size: 0.9rem;
      }
      .tx-item {
        padding: 0.75rem;
        background: rgba(76, 175, 80, 0.1);
        border-left: 3px solid #4CAF50;
        border-radius: 0 6px 6px 0;
        margin-bottom: 0.5rem;
        font-size: 0.85rem;
        animation: slideIn 0.3s ease;
      }
      .tx-item.pending {
        background: rgba(247, 147, 26, 0.1);
        border-left-color: var(--primary-orange);
      }
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateX(-20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      @keyframes hashValid {
        0%, 100% { background: rgba(76, 175, 80, 0.2); }
        50% { background: rgba(76, 175, 80, 0.4); }
      }
      .hash-valid {
        color: #4CAF50 !important;
        font-weight: bold;
        animation: hashValid 1s ease;
      }
    `;
    document.head.appendChild(style);
  }

  createCandidateBlock() {
    const prevHash = this.generateRandomHash().substring(0, 16) + '...';
    const timestamp = Math.floor(Date.now() / 1000);

    // Select random transactions from pool
    const selectedTxs = [];
    const txCount = Math.min(10, this.transactionPool.length);
    const shuffled = [...this.transactionPool].sort(() => Math.random() - 0.5);

    for (let i = 0; i < txCount; i++) {
      selectedTxs.push(shuffled[i]);
    }

    this.candidateBlock = {
      version: 4,
      prevHash,
      merkleRoot: 'calculating...',
      timestamp,
      difficulty: this.miningMode === 'easy' ? this.easyModeDifficulty : 19,
      nonce: 0,
      transactions: selectedTxs
    };

    this.currentNonce = 0;
    this.updateBlockVisualization();
  }

  updateBlockVisualization() {
    if (!this.candidateBlock) return;

    document.getElementById('block-version').textContent = this.candidateBlock.version;
    document.getElementById('block-prev-hash').textContent = this.candidateBlock.prevHash;

    // Calculate simplified merkle root
    const txHashes = this.candidateBlock.transactions.map(tx =>
      this.hashString(tx.from + tx.to + tx.amount).substring(0, 8)
    ).join('');
    const merkleRoot = this.hashString(txHashes).substring(0, 16) + '...';
    document.getElementById('block-merkle').textContent = merkleRoot;

    document.getElementById('block-timestamp').textContent = new Date(this.candidateBlock.timestamp * 1000).toLocaleString();
    document.getElementById('block-difficulty').textContent = this.candidateBlock.difficulty + ' leading zeros';
    document.getElementById('block-nonce').textContent = this.currentNonce.toLocaleString();

    // Update transactions list
    const txContainer = document.getElementById('block-transactions');
    if (txContainer && this.candidateBlock.transactions.length > 0) {
      txContainer.innerHTML = this.candidateBlock.transactions.map(tx => `
        <div class="tx-item">
          <strong>${tx.from}</strong> → <strong>${tx.to}</strong><br>
          <span style="color: var(--primary-orange);">${tx.amount} BTC</span>
          <span style="color: var(--text-dim); margin-left: 1rem;">Fee: ${tx.fee} BTC</span>
        </div>
      `).join('');

      document.getElementById('tx-count').textContent = this.candidateBlock.transactions.length;
    }
  }

  simulateTransactionAnimation() {
    if (!this.candidateBlock || this.candidateBlock.transactions.length >= 10) return;

    // Randomly add or remove a transaction
    if (Math.random() > 0.3 && this.candidateBlock.transactions.length < 10) {
      // Add transaction
      const available = this.transactionPool.filter(tx =>
        !this.candidateBlock.transactions.includes(tx)
      );
      if (available.length > 0) {
        const newTx = available[Math.floor(Math.random() * available.length)];
        this.candidateBlock.transactions.push(newTx);
        this.updateBlockVisualization();
      }
    }
  }

  hashString(str) {
    // Simple hash function for demo purposes
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(8, '0') + this.generateRandomHash().substring(8);
  }

  generateRandomHash() {
    const chars = '0123456789abcdef';
    let hash = '';
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  }

  checkHashValidity(hash, difficulty) {
    const requiredZeros = '0'.repeat(difficulty);
    return hash.startsWith(requiredZeros);
  }

  startEnhancedMining() {
    console.log(`🎯 Starting enhanced mining in ${this.miningMode} mode`);

    // Create candidate block
    this.createCandidateBlock();
    this.totalHashAttempts = 0;

    // Clear any existing interval
    if (this.miningIntervalId) {
      clearInterval(this.miningIntervalId);
    }

    // Mining simulation speed based on mode
    const miningSpeed = this.miningMode === 'easy' ? 50 : 20;
    const difficulty = this.miningMode === 'easy' ? this.easyModeDifficulty : 19;

    this.miningIntervalId = setInterval(() => {
      this.currentNonce++;
      this.totalHashAttempts++;

      // Generate hash for current nonce
      const blockData = `${this.candidateBlock.version}${this.candidateBlock.prevHash}${this.candidateBlock.merkleRoot}${this.candidateBlock.timestamp}${this.candidateBlock.difficulty}${this.currentNonce}`;
      const hash = this.hashString(blockData);

      // Update visualization
      const hashResultEl = document.getElementById('block-hash-result');
      if (hashResultEl) {
        hashResultEl.textContent = hash;
        hashResultEl.classList.remove('hash-valid');
        hashResultEl.style.color = '#f44336';
      }

      document.getElementById('block-nonce').textContent = this.currentNonce.toLocaleString();

      // Update attempts counter
      const totalAttemptsEl = document.getElementById('totalAttempts');
      if (totalAttemptsEl) {
        totalAttemptsEl.textContent = this.totalHashAttempts.toLocaleString();
      }

      const currentNonceEl = document.getElementById('currentNonce');
      if (currentNonceEl) {
        currentNonceEl.textContent = this.currentNonce.toLocaleString();
      }

      const currentHashEl = document.getElementById('currentHash');
      if (currentHashEl) {
        currentHashEl.textContent = hash;
      }

      // Occasionally shuffle transactions (only in easy mode)
      if (this.miningMode === 'easy' && Math.random() > 0.95) {
        this.simulateTransactionAnimation();
      }

      // Check if hash is valid
      const isValid = this.miningMode === 'easy'
        ? this.checkHashValidity(hash, difficulty)
        : Math.random() < 0.000001; // Extremely rare in realistic mode

      if (isValid) {
        console.log(`🎉 BLOCK FOUND! Nonce: ${this.currentNonce}, Hash: ${hash}`);

        // Celebrate!
        if (hashResultEl) {
          hashResultEl.classList.add('hash-valid');
          hashResultEl.style.color = '#4CAF50';
        }

        // Call original findBlock function
        if (typeof window.findBlock === 'function') {
          setTimeout(() => window.findBlock(), 500);
        }

        // Stop mining
        clearInterval(this.miningIntervalId);

        // Reset for next block
        setTimeout(() => {
          if (window.isMining) {
            this.startEnhancedMining();
          }
        }, 2000);
      }
    }, miningSpeed);
  }

  stopEnhancedMining() {
    if (this.miningIntervalId) {
      clearInterval(this.miningIntervalId);
      this.miningIntervalId = null;
    }
    console.log('⏹️ Enhanced mining stopped');
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
        <h4 style="color: var(--primary-orange); margin-bottom: 1rem;">🔍 Proof-of-Work Statistics</h4>
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
        <div style="margin-top: 1rem; padding: 1rem; background: rgba(0, 0, 0, 0.2); border-radius: 6px;">
          <div style="color: var(--text-dim); font-size: 0.85rem; margin-bottom: 0.25rem;">Current Hash:</div>
          <div id="currentHash" style="font-family: monospace; font-size: 0.9rem; word-break: break-all; color: var(--text-light);">Waiting to start mining...</div>
        </div>
      </div>
    `;

    animation.insertAdjacentHTML('afterend', vizHTML);
  }

  enhanceExistingFunctionality() {
    // Override original startMining function
    const originalStartMining = window.startMining;
    window.startMining = () => {
      console.log('🚀 Enhanced startMining called');
      if (originalStartMining) {
        originalStartMining();
      }
      this.startEnhancedMining();
    };

    // Override original stopMining function
    const originalStopMining = window.stopMining;
    window.stopMining = () => {
      console.log('🛑 Enhanced stopMining called');
      this.stopEnhancedMining();
      if (originalStopMining) {
        originalStopMining();
      }
    };

    console.log('✅ Enhanced mining functions installed');
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
