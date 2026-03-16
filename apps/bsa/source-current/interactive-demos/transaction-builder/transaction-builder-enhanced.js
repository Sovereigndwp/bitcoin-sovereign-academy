/**
 * Enhanced Transaction Builder with Socratic Questions and Visualizations
 * Adds educational depth to basic transaction building
 *
 * Multi-Level Support:
 * - Detects ?level= parameter from URL
 * - Maps to internal difficulty modes
 * - Integrates with learning path system
 */

class TransactionBuilderEnhanced {
  constructor() {
    this.selectedUTXOs = [];
    this.outputCount = 1;
    this.currentFeeRate = 10;

    // Multi-level support: detect level from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const urlLevel = urlParams.get('level');
    const pathName = urlParams.get('path') || 'unknown';

    // Map URL level to internal difficulty mode
    const levelToDifficulty = {
      'beginner': 'guided',
      'intermediate': 'interactive',
      'advanced': 'expert'
    };

    this.difficulty = levelToDifficulty[urlLevel] || 'guided';
    this.urlLevel = urlLevel; // Store for reference
    this.pathName = pathName;

    console.log(`🔧 Transaction Builder Level: ${urlLevel || 'default'} (${this.difficulty} mode)`);
    console.log(`📊 Path: ${pathName}`);

    this.socraticQuestionsRevealed = [];

    this.init();
  }

  init() {
    this.addDifficultySelector();
    this.addSocraticQuestions();
    this.addTransactionFlowVisualization();
    this.enhanceExistingFunctionality();
  }

  addDifficultySelector() {
    const header = document.querySelector('.header');
    if (!header) return;

    const difficultyHTML = `
      <div class="difficulty-selector" style="margin-top: 1.5rem;">
        <h3 style="font-size: 1.1rem; margin-bottom: 0.75rem; color: var(--text-light);">Choose Your Learning Mode</h3>
        <div class="difficulty-buttons" style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
          <button class="difficulty-btn active" data-difficulty="guided" style="background: rgba(247, 147, 26, 0.2); border: 2px solid var(--primary-orange); color: var(--text-light); padding: 0.75rem 1.25rem; border-radius: 10px; cursor: pointer; transition: all 0.3s; font-size: 0.9rem;">
            🎓 Guided
            <div style="font-size: 0.75rem; opacity: 0.8; margin-top: 0.25rem;">Step-by-step with hints</div>
          </button>
          <button class="difficulty-btn" data-difficulty="interactive" style="background: rgba(0, 0, 0, 0.3); border: 2px solid rgba(247, 147, 26, 0.3); color: var(--text-light); padding: 0.75rem 1.25rem; border-radius: 10px; cursor: pointer; transition: all 0.3s; font-size: 0.9rem;">
            🔧 Interactive
            <div style="font-size: 0.75rem; opacity: 0.8; margin-top: 0.25rem;">Hands-on learning</div>
          </button>
          <button class="difficulty-btn" data-difficulty="challenge" style="background: rgba(0, 0, 0, 0.3); border: 2px solid rgba(247, 147, 26, 0.3); color: var(--text-light); padding: 0.75rem 1.25rem; border-radius: 10px; cursor: pointer; transition: all 0.3s; font-size: 0.9rem;">
            🏆 Challenge
            <div style="font-size: 0.75rem; opacity: 0.8; margin-top: 0.25rem;">Quiz mode</div>
          </button>
          <button class="difficulty-btn" data-difficulty="expert" style="background: rgba(0, 0, 0, 0.3); border: 2px solid rgba(247, 147, 26, 0.3); color: var(--text-light); padding: 0.75rem 1.25rem; border-radius: 10px; cursor: pointer; transition: all 0.3s; font-size: 0.9rem;">
            ⚡ Expert
            <div style="font-size: 0.75rem; opacity: 0.8; margin-top: 0.25rem;">Full control</div>
          </button>
        </div>
      </div>
    `;

    header.insertAdjacentHTML('afterend', difficultyHTML);

    // Add event listeners
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.difficulty-btn').forEach(b => {
          b.classList.remove('active');
          b.style.background = 'rgba(0, 0, 0, 0.3)';
          b.style.borderColor = 'rgba(247, 147, 26, 0.3)';
        });
        e.currentTarget.classList.add('active');
        e.currentTarget.style.background = 'rgba(247, 147, 26, 0.2)';
        e.currentTarget.style.borderColor = 'var(--primary-orange)';
        this.difficulty = e.currentTarget.dataset.difficulty;
        this.updateForDifficulty();
      });
    });

    // Set initial active button based on difficulty from URL
    const initialBtn = document.querySelector(`[data-difficulty="${this.difficulty}"]`);
    if (initialBtn) {
      document.querySelectorAll('.difficulty-btn').forEach(b => {
        b.classList.remove('active');
        b.style.background = 'rgba(0, 0, 0, 0.3)';
        b.style.borderColor = 'rgba(247, 147, 26, 0.3)';
      });
      initialBtn.classList.add('active');
      initialBtn.style.background = 'rgba(247, 147, 26, 0.2)';
      initialBtn.style.borderColor = 'var(--primary-orange)';
      this.updateForDifficulty(); // Apply initial difficulty settings
    }
  }

  addSocraticQuestions() {
    const questions = [
      {
        id: 'utxo-selection',
        position: 'after-inputs',
        question: 'Why can\'t you spend "part" of a UTXO?',
        answer: `Bitcoin UTXOs work like physical bills. Just as you can't tear a $20 bill in half to pay $10, you can't partially spend a UTXO. You must spend the entire UTXO as an input, and if you don't need all of it, you create a "change" output back to yourself.

**Example:**
• You have a 0.05 BTC UTXO
• You want to send 0.02 BTC
• You MUST spend the entire 0.05 BTC as input
• Create two outputs:
  - 0.02 BTC to recipient
  - 0.03 BTC back to yourself as "change"

This is why Bitcoin transactions often have a "change" output—it's the leftover amount from spending whole UTXOs.`
      },
      {
        id: 'change-output',
        position: 'after-outputs',
        question: 'What happens if you forget to create a change output?',
        answer: `If you don't create a change output, the leftover amount becomes the MINER FEE! This is a common and expensive mistake.

**Example of Costly Mistake:**
• Input: 1.0 BTC UTXO
• Output: 0.5 BTC to recipient
• Forgot change output
• Result: 0.5 BTC goes to miners as fee! 💸

**Correct Way:**
• Input: 1.0 BTC
• Output 1: 0.5 BTC to recipient
• Output 2: 0.4999 BTC back to yourself (change)
• Fee: 0.0001 BTC to miners

**Real Story:** In 2016, someone accidentally paid 291 BTC ($150,000+) in fees because they forgot the change output. Always double-check!`
      },
      {
        id: 'fee-priority',
        position: 'after-fee',
        question: 'How do miners decide which transactions to include in a block?',
        answer: `Miners prioritize transactions by **fee rate** (satoshis per vByte), not total fee amount. They're trying to maximize profit within the 4MB block size limit.

**Fee Rate = Total Fee ÷ Transaction Size (in vBytes)**

**Example:**
• Transaction A: 0.0001 BTC fee, 250 vBytes = 40 sat/vB
• Transaction B: 0.001 BTC fee, 5,000 vBytes = 20 sat/vB

Miners will include Transaction A first, even though B has a higher total fee!

**Current Network Conditions:**
• Low congestion: 1-5 sat/vB (cheap, slow)
• Medium congestion: 10-50 sat/vB (balanced)
• High congestion: 100+ sat/vB (expensive, fast)

Use https://mempool.space to check current fee rates.`
      },
      {
        id: 'transaction-size',
        position: 'after-preview',
        question: 'What determines the size (and therefore cost) of a Bitcoin transaction?',
        answer: `Transaction size in vBytes (virtual bytes) determines the cost. Larger transactions = higher fees at the same sat/vB rate.

**What Increases Transaction Size:**

1. **Number of Inputs:**
   - Each UTXO input ≈ 148 vBytes
   - More inputs = larger transaction
   - This is why consolidating UTXOs when fees are low is smart!

2. **Number of Outputs:**
   - Each output ≈ 34 vBytes
   - Multiple recipients = larger transaction

3. **Script Type:**
   - Legacy (P2PKH): Largest size
   - SegWit (P2WPKH): Medium size (~30% smaller)
   - Native SegWit (Bech32): Smallest size (~45% smaller)

**Example Sizes:**
• 1 input, 2 outputs (payment + change): ~225 vBytes
• 10 inputs, 2 outputs: ~1,500 vBytes

**Fee Calculation:**
• 225 vBytes × 10 sat/vB = 2,250 sats ≈ $1.50
• 1,500 vBytes × 10 sat/vB = 15,000 sats ≈ $10

This is why selecting fewer, larger UTXOs saves on fees!`
      }
    ];

    questions.forEach(q => {
      const html = `
        <div class="socratic-question" data-id="${q.id}" style="background: rgba(33, 150, 243, 0.1); border-left: 4px solid #2196F3; padding: 1.25rem; margin: 1.5rem 0; border-radius: 8px;">
          <h4 style="color: #2196F3; margin-bottom: 0.75rem; font-size: 1.05rem; display: flex; align-items: center; gap: 0.5rem;">
            🤔 Socratic Question
          </h4>
          <p style="font-weight: 600; margin-bottom: 0.75rem; color: var(--text-light);">${q.question}</p>
          <button onclick="window.transactionBuilder.revealAnswer('${q.id}')" style="background: #2196F3; color: white; border: none; padding: 0.5rem 1.25rem; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.3s;">
            Reveal Answer
          </button>
          <div class="socratic-answer" data-id="${q.id}" style="display: none; margin-top: 1rem; padding: 1rem; background: rgba(0, 0, 0, 0.3); border-radius: 6px; line-height: 1.6; white-space: pre-wrap;">${q.answer}</div>
        </div>
      `;

      let insertPoint;
      switch(q.position) {
        case 'after-inputs':
          insertPoint = document.querySelector('.builder-interface .panel:first-child');
          break;
        case 'after-outputs':
          insertPoint = document.querySelector('.builder-interface .panel:last-child');
          break;
        case 'after-fee':
        case 'after-preview':
          insertPoint = document.querySelector('.transaction-preview');
          break;
      }

      if (insertPoint) {
        insertPoint.insertAdjacentHTML('beforeend', html);
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
        button.style.cursor = 'default';
      }
      this.socraticQuestionsRevealed.push(questionId);
    }
  }

  addTransactionFlowVisualization() {
    const previewContainer = document.querySelector('.transaction-preview');
    if (!previewContainer) return;

    const vizHTML = `
      <div class="transaction-flow-viz" style="background: rgba(0, 0, 0, 0.2); padding: 1.5rem; border-radius: 10px; margin: 1.5rem 0;">
        <h4 style="color: var(--primary-orange); margin-bottom: 1rem; text-align: center;">📊 Transaction Flow Visualization</h4>
        <div style="display: flex; align-items: center; justify-content: space-around; gap: 1rem; flex-wrap: wrap;">
          <!-- Inputs -->
          <div style="flex: 1; min-width: 200px;">
            <div style="text-align: center; margin-bottom: 0.5rem; color: var(--text-light); font-weight: 600;">INPUTS (UTXOs)</div>
            <div id="viz-inputs" style="background: rgba(76, 175, 80, 0.2); border: 2px solid #4CAF50; padding: 1rem; border-radius: 8px; min-height: 100px; display: flex; flex-direction: column; gap: 0.5rem; align-items: center; justify-content: center;">
              <div style="color: var(--text-dim); font-size: 0.9rem;">No UTXOs selected</div>
            </div>
          </div>

          <!-- Arrow -->
          <div style="font-size: 2rem; color: var(--primary-orange);">→</div>

          <!-- Transaction -->
          <div style="flex: 1; min-width: 150px;">
            <div style="text-align: center; margin-bottom: 0.5rem; color: var(--text-light); font-weight: 600;">TRANSACTION</div>
            <div style="background: rgba(247, 147, 26, 0.2); border: 2px solid var(--primary-orange); padding: 1rem; border-radius: 8px; text-align: center; min-height: 100px; display: flex; flex-direction: column; justify-content: center;">
              <div style="font-size: 0.85rem; color: var(--text-light);">
                <div id="viz-tx-size">~0 vBytes</div>
                <div id="viz-tx-fee" style="margin-top: 0.25rem;">Fee: 0 sats</div>
              </div>
            </div>
          </div>

          <!-- Arrow -->
          <div style="font-size: 2rem; color: var(--primary-orange);">→</div>

          <!-- Outputs -->
          <div style="flex: 1; min-width: 200px;">
            <div style="text-align: center; margin-bottom: 0.5rem; color: var(--text-light); font-weight: 600;">OUTPUTS</div>
            <div id="viz-outputs" style="background: rgba(33, 150, 243, 0.2); border: 2px solid #2196F3; padding: 1rem; border-radius: 8px; min-height: 100px; display: flex; flex-direction: column; gap: 0.5rem;">
              <div id="viz-output-recipient" style="font-size: 0.85rem; color: var(--text-dim);">No outputs yet</div>
              <div id="viz-output-change" style="font-size: 0.85rem; color: var(--text-dim); display: none;">Change: 0 BTC</div>
            </div>
          </div>
        </div>

        <!-- Balance equation -->
        <div style="margin-top: 1.5rem; text-align: center; padding: 1rem; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
          <div style="font-family: monospace; font-size: 1rem; color: var(--text-light);">
            <span id="viz-equation-inputs" style="color: #4CAF50;">Inputs</span> =
            <span id="viz-equation-outputs" style="color: #2196F3;">Outputs</span> +
            <span id="viz-equation-fee" style="color: var(--primary-orange);">Fee</span>
          </div>
          <div id="viz-equation-values" style="margin-top: 0.5rem; font-size: 0.9rem; color: var(--text-dim);">
            0 BTC = 0 BTC + 0 BTC
          </div>
        </div>
      </div>
    `;

    const firstChild = previewContainer.firstElementChild;
    if (firstChild) {
      previewContainer.insertBefore(
        document.createRange().createContextualFragment(vizHTML),
        firstChild
      );
    }
  }

  updateVisualization() {
    // Update inputs visualization
    const vizInputs = document.getElementById('viz-inputs');
    if (vizInputs) {
      if (this.selectedUTXOs.length === 0) {
        vizInputs.innerHTML = '<div style="color: var(--text-dim); font-size: 0.9rem;">No UTXOs selected</div>';
      } else {
        vizInputs.innerHTML = this.selectedUTXOs.map(utxo =>
          `<div style="background: rgba(76, 175, 80, 0.3); padding: 0.4rem 0.75rem; border-radius: 5px; font-size: 0.85rem; color: var(--text-light);">
            ${utxo.amount.toFixed(4)} BTC
          </div>`
        ).join('');
      }
    }

    // Update outputs visualization
    let totalOutput = 0;
    const outputs = [];
    document.querySelectorAll('.amount-input').forEach(input => {
      if (input.value && !isNaN(parseFloat(input.value))) {
        const amount = parseFloat(input.value);
        totalOutput += amount;
        outputs.push(amount);
      }
    });

    const vizOutputRecipient = document.getElementById('viz-output-recipient');
    const vizOutputChange = document.getElementById('viz-output-change');

    if (vizOutputRecipient) {
      if (outputs.length === 0) {
        vizOutputRecipient.innerHTML = '<div style="color: var(--text-dim); font-size: 0.85rem;">No outputs yet</div>';
      } else {
        vizOutputRecipient.innerHTML = outputs.map(amt =>
          `<div style="background: rgba(33, 150, 243, 0.3); padding: 0.4rem 0.75rem; border-radius: 5px; font-size: 0.85rem; color: var(--text-light);">
            Recipient: ${amt.toFixed(4)} BTC
          </div>`
        ).join('');
      }
    }

    // Update change output
    const totalInput = this.selectedUTXOs.reduce((sum, utxo) => sum + utxo.amount, 0);
    const estimatedFee = 0.00001 * this.currentFeeRate;
    const changeAmount = totalInput - totalOutput - estimatedFee;

    if (vizOutputChange && changeAmount > 0.00001) {
      vizOutputChange.style.display = 'block';
      vizOutputChange.innerHTML = `<div style="background: rgba(255, 193, 7, 0.3); padding: 0.4rem 0.75rem; border-radius: 5px; font-size: 0.85rem; color: var(--text-light);">
        Change: ${changeAmount.toFixed(4)} BTC
      </div>`;
    } else if (vizOutputChange) {
      vizOutputChange.style.display = 'none';
    }

    // Update transaction info
    const estimatedSize = 10 + (this.selectedUTXOs.length * 148) + (outputs.length * 34) + (changeAmount > 0 ? 34 : 0);
    const vizTxSize = document.getElementById('viz-tx-size');
    const vizTxFee = document.getElementById('viz-tx-fee');

    if (vizTxSize) vizTxSize.textContent = `~${estimatedSize} vBytes`;
    if (vizTxFee) vizTxFee.textContent = `Fee: ${(estimatedFee * 100000000).toFixed(0)} sats`;

    // Update equation
    const vizEquationValues = document.getElementById('viz-equation-values');
    if (vizEquationValues) {
      vizEquationValues.textContent = `${totalInput.toFixed(5)} BTC = ${totalOutput.toFixed(5)} BTC + ${estimatedFee.toFixed(5)} BTC`;
    }
  }

  enhanceExistingFunctionality() {
    // Wrap existing selectUTXO function
    const originalSelectUTXO = window.selectUTXO;
    window.selectUTXO = (element) => {
      originalSelectUTXO(element);

      // Update our tracking
      const amount = parseFloat(element.dataset.amount);
      const isSelected = element.classList.contains('selected');

      if (isSelected) {
        if (!this.selectedUTXOs.find(u => u.amount === amount)) {
          this.selectedUTXOs.push({
            element: element,
            amount: amount,
            id: element.querySelector('small')?.textContent || 'unknown'
          });
        }
      } else {
        this.selectedUTXOs = this.selectedUTXOs.filter(utxo => utxo.amount !== amount);
      }

      this.updateVisualization();
    };

    // Wrap updateTransactionPreview
    const originalUpdate = window.updateTransactionPreview;
    window.updateTransactionPreview = () => {
      originalUpdate();
      this.updateVisualization();
    };

    // Wrap updateFee
    const originalUpdateFee = window.updateFee;
    window.updateFee = (value) => {
      this.currentFeeRate = parseInt(value);
      originalUpdateFee(value);
      this.updateVisualization();
    };
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
        tips.forEach(tip => tip.style.display = 'none');
        questions.forEach(q => q.style.display = 'block');
        // Could add quiz mode here
        break;
      case 'expert':
        tips.forEach(tip => tip.style.display = 'none');
        questions.forEach(q => q.style.display = 'none');
        break;
    }

    // Update address input mode based on difficulty
    this.updateAddressInputMode();
  }

  updateAddressInputMode() {
    const useDropdown = (this.difficulty === 'guided' || this.difficulty === 'interactive');

    // Update all existing outputs
    document.querySelectorAll('.output').forEach(output => {
      const selectElement = output.querySelector('.address-select');
      const textElement = output.querySelector('.address-text');

      if (selectElement && textElement) {
        if (useDropdown) {
          // Show dropdown, hide text input
          selectElement.style.display = 'block';
          textElement.style.display = 'none';
          // Copy value from text to select if it matches an option
          if (textElement.value) {
            const matchingOption = selectElement.querySelector(`option[value="${textElement.value}"]`);
            if (matchingOption) {
              selectElement.value = textElement.value;
            }
          }
        } else {
          // Show text input, hide dropdown
          selectElement.style.display = 'none';
          textElement.style.display = 'block';
          // Copy value from select to text if something is selected
          if (selectElement.value) {
            textElement.value = selectElement.value;
          }
        }
      }
    });
  }
}

// Initialize enhanced features when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.transactionBuilder = new TransactionBuilderEnhanced();
  });
} else {
  window.transactionBuilder = new TransactionBuilderEnhanced();
}
