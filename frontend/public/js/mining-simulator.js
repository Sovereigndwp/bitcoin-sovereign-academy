/**
 * Bitcoin Mining Simulator
 * User-friendly proof-of-work demonstration with educational features
 */

(function() {
  'use strict';

  class MiningSimulator {
    constructor() {
      this.attempts = 0;
      this.isAutoSolving = false;
      this.autoSolveInterval = null;
      this.startTime = null;
      this.successfulHashes = [];

      // Configuration for user-friendly experience
      this.config = {
        easyMode: true,           // Start in easy mode
        showHints: true,          // Show educational hints
        animateProgress: true,    // Animate mining progress
        celebrateSuccess: true    // Celebrate when block is mined
      };

      this.init();
    }

    init() {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.attachEventListeners());
      } else {
        this.attachEventListeners();
      }
    }

    attachEventListeners() {
      // Main mining controls
      const tryButton = document.querySelector('[onclick="tryNonce()"]');
      const autoButton = document.querySelector('[onclick="autoSolve()"]');
      const resetButton = document.querySelector('[onclick="resetPow()"]');

      if (tryButton) {
        tryButton.onclick = () => this.tryNonce();
      }
      if (autoButton) {
        autoButton.onclick = () => this.autoSolve();
      }
      if (resetButton) {
        resetButton.onclick = () => this.resetPow();
      }

      // Difficulty slider for easy adjustment
      const difficultyInput = document.getElementById('pow-difficulty');
      if (difficultyInput) {
        difficultyInput.addEventListener('input', (e) => {
          this.updateDifficultyDisplay(e.target.value);
        });
      }

      // Message input
      const messageInput = document.getElementById('pow-message');
      if (messageInput) {
        messageInput.addEventListener('input', () => {
          if (this.isAutoSolving) {
            this.stopAutoSolve();
          }
        });
      }

      // Add easy mode toggle
      this.addEasyModeControls();

      // Initialize display
      this.updateDifficultyDisplay(difficultyInput?.value || 4);
    }

    addEasyModeControls() {
      const controlsDiv = document.querySelector('.pow-controls');
      if (!controlsDiv) return;

      // Check if controls already exist
      if (document.getElementById('easy-mode-toggle')) return;

      const easyModeHTML = `
        <div class="mining-mode-selector" style="margin-top: 1rem; padding: 1rem; background: #f5f5f5; border-radius: 8px;">
          <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
              <input type="checkbox" id="easy-mode-toggle" checked style="cursor: pointer;">
              <strong>Easy Mode</strong>
            </label>
            <span class="mode-badge" style="background: #4CAF50; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.85rem;">Beginner Friendly</span>
          </div>
          <p style="margin: 0; font-size: 0.9rem; color: #666;">
            <strong>Easy Mode:</strong> Lower difficulties (1-3 zeros) mine instantly. Perfect for learning!<br>
            <strong>Realistic Mode:</strong> Experience actual mining difficulty with variable solve times.
          </p>
        </div>
      `;

      controlsDiv.insertAdjacentHTML('beforeend', easyModeHTML);

      const toggle = document.getElementById('easy-mode-toggle');
      if (toggle) {
        toggle.addEventListener('change', (e) => {
          this.config.easyMode = e.target.checked;
          const badge = document.querySelector('.mode-badge');
          if (badge) {
            if (this.config.easyMode) {
              badge.textContent = 'Beginner Friendly';
              badge.style.background = '#4CAF50';
            } else {
              badge.textContent = 'Realistic Mining';
              badge.style.background = '#FF9800';
            }
          }
          this.resetPow();
        });
      }
    }

    updateDifficultyDisplay(difficulty) {
      const diffValue = parseInt(difficulty);
      const powControls = document.querySelector('.pow-controls');

      // Remove existing explanation
      const existingExplanation = document.querySelector('.difficulty-explanation');
      if (existingExplanation) {
        existingExplanation.remove();
      }

      const explanations = {
        1: {
          text: 'Very Easy - Hash must start with 1 zero (0...)',
          color: '#4CAF50',
          time: 'Instant',
          realistic: '~10 seconds on a regular computer'
        },
        2: {
          text: 'Easy - Hash must start with 2 zeros (00...)',
          color: '#8BC34A',
          time: 'Very Fast',
          realistic: '~2-3 minutes on a regular computer'
        },
        3: {
          text: 'Medium - Hash must start with 3 zeros (000...)',
          color: '#FFC107',
          time: 'Fast',
          realistic: '~30-45 minutes on a regular computer'
        },
        4: {
          text: 'Hard - Hash must start with 4 zeros (0000...)',
          color: '#FF9800',
          time: 'Moderate',
          realistic: '~8-12 hours on a regular computer'
        },
        5: {
          text: 'Very Hard - Hash must start with 5 zeros (00000...)',
          color: '#FF5722',
          time: 'Slow',
          realistic: '~1-2 weeks on a regular computer'
        },
        6: {
          text: 'Extreme - Hash must start with 6 zeros (000000...)',
          color: '#F44336',
          time: 'Very Slow',
          realistic: '~4-6 months on a regular computer'
        }
      };

      const explanation = explanations[diffValue] || explanations[4];

      const explanationHTML = `
        <div class="difficulty-explanation" style="margin-top: 0.75rem; padding: 0.75rem; background: ${explanation.color}15; border-left: 4px solid ${explanation.color}; border-radius: 4px;">
          <div style="font-weight: 600; color: ${explanation.color}; margin-bottom: 0.5rem;">
            ${explanation.text}
          </div>
          ${this.config.easyMode ? `
            <div style="font-size: 0.9rem; color: #666;">
              ⚡ Easy Mode: ${explanation.time}<br>
              ⛏️ Realistic: ${explanation.realistic}
            </div>
          ` : `
            <div style="font-size: 0.9rem; color: #666;">
              ⛏️ Expected time: ${explanation.realistic}
            </div>
          `}
          <div style="margin-top: 0.5rem; font-size: 0.85rem; color: #888;">
            <strong>💡 What this means:</strong> Bitcoin miners try billions of nonces per second.<br>
            Real Bitcoin difficulty requires ~19 leading zeros! Mining requires specialized hardware (ASICs).
          </div>
        </div>
      `;

      powControls.insertAdjacentHTML('beforeend', explanationHTML);
    }

    async sha256(message) {
      const msgBuffer = new TextEncoder().encode(message);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex;
    }

    countLeadingZeros(hash) {
      let count = 0;
      for (let char of hash) {
        if (char === '0') count++;
        else break;
      }
      return count;
    }

    async tryNonce() {
      const messageInput = document.getElementById('pow-message');
      const nonceInput = document.getElementById('pow-nonce');
      const difficultyInput = document.getElementById('pow-difficulty');
      const hashDisplay = document.getElementById('pow-hash');
      const statusDisplay = document.getElementById('pow-status');

      if (!messageInput || !nonceInput || !difficultyInput) return;

      const message = messageInput.value;
      const nonce = parseInt(nonceInput.value) || 0;
      const difficulty = parseInt(difficultyInput.value);

      const data = `${message}${nonce}`;
      const hash = await this.sha256(data);
      const leadingZeros = this.countLeadingZeros(hash);

      if (hashDisplay) {
        hashDisplay.textContent = hash;
        hashDisplay.style.wordBreak = 'break-all';
      }

      this.attempts++;

      const isValid = leadingZeros >= difficulty;

      if (statusDisplay) {
        if (isValid) {
          statusDisplay.innerHTML = `
            <div style="padding: 1rem; background: linear-gradient(135deg, #4CAF50, #8BC34A); color: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">✅ Block Mined Successfully!</div>
              <div style="font-size: 1.1rem;">Found valid nonce: <strong>${nonce}</strong></div>
              <div style="margin-top: 0.5rem; font-size: 0.95rem;">Leading zeros: ${leadingZeros} (required: ${difficulty})</div>
              <div style="margin-top: 0.5rem; font-size: 0.9rem; opacity: 0.9;">Attempts: ${this.attempts}</div>
            </div>
          `;

          if (this.config.celebrateSuccess) {
            this.celebrate();
          }

          this.successfulHashes.push({ nonce, hash, difficulty, attempts: this.attempts });

          if (this.isAutoSolving) {
            this.stopAutoSolve();
          }
        } else {
          const target = '0'.repeat(difficulty);
          const actual = hash.substring(0, difficulty);

          statusDisplay.innerHTML = `
            <div style="padding: 0.75rem; background: #fff3cd; border: 1px solid #ffc107; border-radius: 6px;">
              <div style="font-weight: 600; color: #856404; margin-bottom: 0.5rem;">❌ Invalid - Keep Mining!</div>
              <div style="font-size: 0.9rem; color: #666;">
                Expected: <code style="background: #f5f5f5; padding: 0.2rem 0.4rem; border-radius: 3px;">${target}...</code><br>
                Got: <code style="background: #f5f5f5; padding: 0.2rem 0.4rem; border-radius: 3px;">${actual}...</code>
              </div>
              <div style="margin-top: 0.5rem; font-size: 0.85rem; color: #888;">
                Leading zeros: ${leadingZeros}/${difficulty} | Attempts: ${this.attempts}
              </div>
            </div>
          `;
        }
      }

      // Auto-increment nonce for next attempt
      if (!isValid) {
        nonceInput.value = nonce + 1;
      }

      return isValid;
    }

    async autoSolve() {
      const autoButton = document.querySelector('[onclick="autoSolve()"]');

      if (this.isAutoSolving) {
        this.stopAutoSolve();
        return;
      }

      this.isAutoSolving = true;
      this.startTime = Date.now();

      if (autoButton) {
        autoButton.textContent = '⏸️ Stop Mining';
        autoButton.style.background = '#FF5722';
      }

      const difficultyInput = document.getElementById('pow-difficulty');
      const difficulty = parseInt(difficultyInput?.value || 4);

      // In easy mode, use faster mining for difficulties 1-3
      const delay = this.config.easyMode && difficulty <= 3 ? 1 : 10;

      const mine = async () => {
        if (!this.isAutoSolving) return;

        const found = await this.tryNonce();

        if (found) {
          const elapsedTime = ((Date.now() - this.startTime) / 1000).toFixed(2);
          const statusDisplay = document.getElementById('pow-status');

          if (statusDisplay && statusDisplay.innerHTML.includes('Block Mined')) {
            statusDisplay.innerHTML = statusDisplay.innerHTML.replace(
              'Attempts:',
              `Time: ${elapsedTime}s | Attempts:`
            );
          }

          this.stopAutoSolve();
        } else {
          this.autoSolveInterval = setTimeout(mine, delay);
        }
      };

      mine();
    }

    stopAutoSolve() {
      this.isAutoSolving = false;

      if (this.autoSolveInterval) {
        clearTimeout(this.autoSolveInterval);
        this.autoSolveInterval = null;
      }

      const autoButton = document.querySelector('[onclick="autoSolve()"]');
      if (autoButton) {
        autoButton.textContent = '⛏️ Auto-Mine';
        autoButton.style.background = '';
      }
    }

    resetPow() {
      this.stopAutoSolve();
      this.attempts = 0;
      this.startTime = null;

      const nonceInput = document.getElementById('pow-nonce');
      const hashDisplay = document.getElementById('pow-hash');
      const statusDisplay = document.getElementById('pow-status');

      if (nonceInput) nonceInput.value = '0';
      if (hashDisplay) hashDisplay.textContent = '-';
      if (statusDisplay) {
        statusDisplay.innerHTML = `
          <div style="padding: 0.75rem; background: #e3f2fd; border: 1px solid #2196F3; border-radius: 6px; color: #1565C0;">
            <strong>ℹ️ Ready to Mine</strong><br>
            <div style="font-size: 0.9rem; margin-top: 0.5rem;">
              Click "Try Nonce" to test a single nonce, or "Auto-Mine" to find a valid block automatically.
            </div>
          </div>
        `;
      }

      // Update difficulty display
      const difficultyInput = document.getElementById('pow-difficulty');
      if (difficultyInput) {
        this.updateDifficultyDisplay(difficultyInput.value);
      }
    }

    celebrate() {
      // Simple celebration animation
      const statusDisplay = document.getElementById('pow-status');
      if (!statusDisplay) return;

      // Add confetti-like effect
      statusDisplay.style.animation = 'pulse 0.5s ease-in-out';

      setTimeout(() => {
        statusDisplay.style.animation = '';
      }, 500);

      // Haptic feedback on supported devices
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
    }
  }

  // Initialize the mining simulator
  const miningSimulator = new MiningSimulator();

  // Expose functions globally for onclick handlers
  window.tryNonce = () => miningSimulator.tryNonce();
  window.autoSolve = () => miningSimulator.autoSolve();
  window.resetPow = () => miningSimulator.resetPow();

  // Add CSS animation
  if (!document.getElementById('mining-simulator-styles')) {
    const style = document.createElement('style');
    style.id = 'mining-simulator-styles';
    style.textContent = `
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }

      .pow-controls label {
        display: block;
        margin-bottom: 1rem;
      }

      .pow-controls input[type="text"],
      .pow-controls input[type="number"] {
        width: 100%;
        padding: 0.5rem;
        margin-top: 0.25rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
      }

      .pow-controls button {
        padding: 0.75rem 1.5rem;
        margin: 0.5rem 0.5rem 0.5rem 0;
        border: none;
        border-radius: 6px;
        background: #f7931a;
        color: white;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .pow-controls button:hover {
        background: #c77808;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      }

      .pow-controls button:active {
        transform: translateY(0);
      }

      .pow-output {
        margin-top: 1.5rem;
        padding: 1rem;
        background: #f9f9f9;
        border-radius: 8px;
      }

      .pow-output code {
        font-family: 'Courier New', monospace;
        font-size: 0.9rem;
        word-break: break-all;
      }
    `;
    document.head.appendChild(style);
  }
})();
