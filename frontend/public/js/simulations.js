(function () {
  'use strict';

  const SATS_PER_BTC = 100_000_000;

  class SimulationManager {
    constructor(client) {
      this.client = client;
      this.elements = {};

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.initialize());
      } else {
        this.initialize();
      }
    }

    initialize() {
      this.cacheElements();
      this.attachModalListeners();
    }

    cacheElements() {
      this.elements = {
        txContainer: document.getElementById('tx-simulator'),
        feeContainer: document.getElementById('fee-calculator'),
        securityContainer: document.getElementById('security-trainer'),
        modal: document.getElementById('learning-modal'),
        modalContent: document.getElementById('learning-content'),
        loadingOverlay: document.getElementById('loading-overlay'),
        loadingMessage: document.getElementById('loading-message')
      };
    }

    attachModalListeners() {
      if (!this.elements.modal) return;

      this.elements.modal.addEventListener('click', (event) => {
        if (event.target === this.elements.modal) {
          this.closeModal();
        }
      });

      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && this.isModalOpen()) {
          this.closeModal();
        }
      });
    }

    async loadSimulation(type) {
      this.showLoading(`Loading ${this.formatLabel(type)} simulation...`);

      try {
        const data = this.client
          ? await this.client.loadSimulation(type)
          : this.getFallbackSimulation(type);

        switch (type) {
          case 'transaction':
            this.renderTransactionSimulation(data);
            break;
          case 'fees':
            this.renderFeeSimulation(data);
            break;
          case 'security':
            this.renderSecuritySimulation(data);
            break;
          default:
            console.warn(`Unknown simulation type: ${type}`);
        }
      } catch (error) {
        console.error(`Failed to load simulation ${type}:`, error);
        this.renderSimulationError(type);
      } finally {
        this.hideLoading();
      }
    }

    renderTransactionSimulation(data) {
      if (!this.elements.txContainer) return;
      const size = data.averageSize || 225;

      // Educational address examples with context
      const addresses = [
        {
          name: 'Alice (Friend)',
          address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
          type: 'Native SegWit (bc1...)',
          description: 'Your friend Alice - Modern, low-fee address'
        },
        {
          name: 'Bob (Family)',
          address: '3J98t1WpEZ73CNmYviecrnyiWrnqRhWNLy',
          type: 'P2SH (3...)',
          description: 'Your family member Bob - Common multi-sig address'
        },
        {
          name: 'Charlie (Merchant)',
          address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
          type: 'Legacy (1...)',
          description: 'A merchant - Original Bitcoin address format'
        },
        {
          name: 'Diana (Exchange)',
          address: 'bc1qeklep85ntjz4605drds6aww9u0qr46qzrv5xswd35uhjuj8ahfcqgf6hak',
          type: 'Taproot (bc1p...)',
          description: 'Exchange deposit - Newest, most efficient format'
        },
        {
          name: 'Custom Address',
          address: '',
          type: 'Enter manually',
          description: 'Type your own Bitcoin address'
        }
      ];

      const senders = [
        { name: 'Your Wallet', balance: 0.5, type: 'Main wallet' },
        { name: 'Savings', balance: 2.5, type: 'Cold storage' },
        { name: 'Trading', balance: 0.15, type: 'Hot wallet' }
      ];

      this.elements.txContainer.innerHTML = `
        <div class="simulation-panel">
          <div class="simulation-header">
            <h4>${data.title || 'Transaction Builder'}</h4>
            <p>${data.description || 'Build and simulate a Bitcoin transaction with real address formats.'}</p>
          </div>

          <!-- Transaction Flow Visualization -->
          <div class="tx-flow-visual" style="background: linear-gradient(135deg, #f7931a15, #f7931a05); padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;">
              <div style="flex: 1; min-width: 150px; text-align: center;">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">👤</div>
                <div style="font-weight: 600;" id="tx-sender-display">Your Wallet</div>
                <div style="font-size: 0.85rem; color: #666;" id="tx-sender-balance">0.5 BTC available</div>
              </div>
              <div style="flex: 0; font-size: 2rem; color: #f7931a;">→</div>
              <div style="flex: 1; min-width: 150px; text-align: center;">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">📬</div>
                <div style="font-weight: 600;" id="tx-recipient-display">Select recipient</div>
                <div style="font-size: 0.85rem; color: #666;" id="tx-recipient-type">Choose from dropdown</div>
              </div>
              <div style="flex: 0; font-size: 2rem; color: #f7931a;">⛏️</div>
              <div style="flex: 1; min-width: 150px; text-align: center;">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">⚡</div>
                <div style="font-weight: 600;">Miners</div>
                <div style="font-size: 0.85rem; color: #666;" id="tx-miner-fee">Fee: calculating...</div>
              </div>
            </div>
          </div>

          <form class="simulation-form" id="tx-form">
            <label>
              <strong>From (Sender)</strong>
              <select id="tx-sender" style="width: 100%; padding: 0.5rem; margin-top: 0.25rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem;">
                ${senders.map((sender, idx) =>
                  `<option value="${idx}" ${idx === 0 ? 'selected' : ''}>${sender.name} - ${sender.balance} BTC (${sender.type})</option>`
                ).join('')}
              </select>
              <small style="display: block; margin-top: 0.25rem; color: #666;">💡 Choose which wallet to send from</small>
            </label>

            <label style="margin-top: 1rem;">
              <strong>To (Recipient)</strong>
              <select id="tx-recipient" style="width: 100%; padding: 0.5rem; margin-top: 0.25rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem;">
                ${addresses.map((addr, idx) =>
                  `<option value="${idx}">${addr.name} - ${addr.type}</option>`
                ).join('')}
              </select>
              <small style="display: block; margin-top: 0.25rem; color: #666;">💡 Select who to send Bitcoin to</small>
            </label>

            <div id="tx-custom-address" style="display: none; margin-top: 0.5rem;">
              <input type="text" id="tx-custom-address-input" placeholder="Enter Bitcoin address (bc1..., 3..., or 1...)" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem;">
              <div id="tx-address-validation" style="margin-top: 0.5rem; font-size: 0.9rem;"></div>
            </div>

            <div id="tx-address-info" style="margin-top: 0.5rem; padding: 0.75rem; background: #f0f8ff; border-left: 3px solid #2196F3; border-radius: 4px; font-size: 0.9rem;">
              <div style="font-weight: 600; margin-bottom: 0.25rem;" id="tx-address-type">Native SegWit (bc1...)</div>
              <div style="color: #666;" id="tx-address-desc">Modern, low-fee address format</div>
              <code style="display: block; margin-top: 0.5rem; word-break: break-all; background: white; padding: 0.5rem; border-radius: 3px; font-size: 0.85rem;" id="tx-address-display">bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh</code>
            </div>

            <label style="margin-top: 1rem;">
              <strong>Amount to Send</strong>
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.25rem;">
                <input type="number" id="tx-amount" min="0" step="0.0001" value="0.01" style="flex: 1; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem;">
                <span class="unit" style="font-weight: 600;">BTC</span>
              </div>
              <div style="margin-top: 0.5rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <button type="button" class="quick-amount" data-amount="0.001" style="padding: 0.25rem 0.75rem; background: #e3f2fd; border: 1px solid #2196F3; border-radius: 4px; cursor: pointer; font-size: 0.85rem;">0.001 BTC</button>
                <button type="button" class="quick-amount" data-amount="0.01" style="padding: 0.25rem 0.75rem; background: #e3f2fd; border: 1px solid #2196F3; border-radius: 4px; cursor: pointer; font-size: 0.85rem;">0.01 BTC</button>
                <button type="button" class="quick-amount" data-amount="0.1" style="padding: 0.25rem 0.75rem; background: #e3f2fd; border: 1px solid #2196F3; border-radius: 4px; cursor: pointer; font-size: 0.85rem;">0.1 BTC</button>
              </div>
              <small style="display: block; margin-top: 0.5rem; color: #666;">💡 Quick amounts for common transactions</small>
            </label>

            <label style="margin-top: 1rem;">
              <strong>Transaction Priority</strong>
              <select id="tx-priority" style="width: 100%; padding: 0.5rem; margin-top: 0.25rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem;">
                <option value="1">⚡ High Priority - ~10 min (25 sats/vB)</option>
                <option value="15" selected>📦 Standard - ~30 min (15 sats/vB)</option>
                <option value="8">💰 Low Priority - ~1 hour (8 sats/vB)</option>
                <option value="custom">⚙️ Custom Fee Rate</option>
              </select>
            </label>

            <div id="tx-custom-fee" style="display: none; margin-top: 0.5rem;">
              <label>
                Custom Fee Rate
                <input type="number" id="tx-fee-rate" min="1" step="1" value="15" style="width: 100%; padding: 0.5rem; margin-top: 0.25rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem;">
                <span class="unit">sats/vB</span>
              </label>
            </div>

            <label style="margin-top: 1rem;">
              <strong>Transaction Size</strong>
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.25rem;">
                <input type="number" id="tx-size" min="50" step="10" value="${size}" style="flex: 1; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem;"/>
                <span class="unit" style="font-weight: 600;">vBytes</span>
              </div>
              <small style="display: block; margin-top: 0.25rem; color: #666;">💡 Size depends on inputs/outputs. Typical: 225 vB</small>
            </label>
          </form>

          <div class="simulation-results" id="tx-results" style="margin-top: 1.5rem; padding: 1rem; background: #f9f9f9; border-radius: 8px;">
            <h4 style="margin-bottom: 1rem; color: #333;">📊 Transaction Summary</h4>
            <div class="result-item" style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #e0e0e0;">
              <span style="color: #666;">Network Fee</span>
              <strong id="tx-fee" style="color: #f7931a;">–</strong>
            </div>
            <div class="result-item" style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #e0e0e0;">
              <span style="color: #666;">Total Amount to Send</span>
              <strong id="tx-total" style="color: #333; font-size: 1.1rem;">–</strong>
            </div>
            <div class="result-item" style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #e0e0e0;">
              <span style="color: #666;">Change Returned</span>
              <strong id="tx-change" style="color: #4CAF50;">–</strong>
            </div>
            <div class="result-item" style="display: flex; justify-content: space-between; padding: 0.5rem 0;">
              <span style="color: #666;">Remaining Balance</span>
              <strong id="tx-remaining" style="color: #2196F3;">–</strong>
            </div>
          </div>

          <div class="simulation-footnote" style="margin-top: 1rem; padding: 1rem; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px; font-size: 0.9rem;">
            <strong>💡 Educational Tips:</strong><br>
            ${(data.tips && data.tips.join('<br>')) || '• Different address formats have different fee costs<br>• Native SegWit (bc1...) is cheapest<br>• Always verify addresses before sending!'}
          </div>
        </div>
      `;

      const senderSelect = document.getElementById('tx-sender');
      const recipientSelect = document.getElementById('tx-recipient');
      const customAddressDiv = document.getElementById('tx-custom-address');
      const customAddressInput = document.getElementById('tx-custom-address-input');
      const amountInput = document.getElementById('tx-amount');
      const prioritySelect = document.getElementById('tx-priority');
      const customFeeDiv = document.getElementById('tx-custom-fee');
      const rateInput = document.getElementById('tx-fee-rate');
      const sizeInput = document.getElementById('tx-size');

      // Handle sender selection
      senderSelect.addEventListener('change', () => {
        const senderIdx = parseInt(senderSelect.value);
        const sender = senders[senderIdx];
        document.getElementById('tx-sender-display').textContent = sender.name;
        document.getElementById('tx-sender-balance').textContent = `${sender.balance} BTC available`;
        update();
      });

      // Handle recipient selection
      recipientSelect.addEventListener('change', () => {
        const recipientIdx = parseInt(recipientSelect.value);
        const recipient = addresses[recipientIdx];

        if (recipient.name === 'Custom Address') {
          customAddressDiv.style.display = 'block';
          document.getElementById('tx-recipient-display').textContent = 'Custom';
          document.getElementById('tx-recipient-type').textContent = 'Enter address below';
        } else {
          customAddressDiv.style.display = 'none';
          document.getElementById('tx-recipient-display').textContent = recipient.name;
          document.getElementById('tx-recipient-type').textContent = recipient.type;
          document.getElementById('tx-address-type').textContent = recipient.type;
          document.getElementById('tx-address-desc').textContent = recipient.description;
          document.getElementById('tx-address-display').textContent = recipient.address;
        }
        update();
      });

      // Handle custom address validation
      customAddressInput.addEventListener('input', () => {
        const addr = customAddressInput.value.trim();
        const validation = document.getElementById('tx-address-validation');

        if (!addr) {
          validation.innerHTML = '';
          return;
        }

        let isValid = false;
        let type = '';
        let message = '';

        if (addr.startsWith('bc1') || addr.startsWith('tb1')) {
          isValid = addr.length >= 42 && addr.length <= 90;
          type = addr.startsWith('bc1q') ? 'Native SegWit' : 'Taproot';
          message = isValid ? `✅ Valid ${type} address` : `❌ Invalid ${type} format`;
        } else if (addr.startsWith('3') || addr.startsWith('2')) {
          isValid = addr.length >= 34 && addr.length <= 35;
          type = 'P2SH';
          message = isValid ? `✅ Valid ${type} address` : `❌ Invalid ${type} format`;
        } else if (addr.startsWith('1') || addr.startsWith('m') || addr.startsWith('n')) {
          isValid = addr.length >= 26 && addr.length <= 35;
          type = 'Legacy';
          message = isValid ? `✅ Valid ${type} address` : `❌ Invalid ${type} format`;
        } else {
          message = '❌ Unknown address format';
        }

        validation.innerHTML = `<div style="color: ${isValid ? '#4CAF50' : '#F44336'};">${message}</div>`;

        if (isValid) {
          document.getElementById('tx-address-display').textContent = addr;
          document.getElementById('tx-address-type').textContent = type;
        }
      });

      // Quick amount buttons
      document.querySelectorAll('.quick-amount').forEach(btn => {
        btn.addEventListener('click', () => {
          amountInput.value = btn.dataset.amount;
          update();
        });
      });

      // Handle priority selection
      prioritySelect.addEventListener('change', () => {
        if (prioritySelect.value === 'custom') {
          customFeeDiv.style.display = 'block';
        } else {
          customFeeDiv.style.display = 'none';
          rateInput.value = prioritySelect.value;
        }
        update();
      });

      const update = () => {
        const senderIdx = parseInt(senderSelect.value);
        const sender = senders[senderIdx];
        const amount = Number(amountInput.value || 0);
        const rate = prioritySelect.value === 'custom'
          ? Number(rateInput.value || 0)
          : Number(prioritySelect.value);
        const estSize = Number(sizeInput.value || size);

        const feeInSats = Math.max(rate * estSize, 0);
        const feeInBTC = feeInSats / SATS_PER_BTC;
        const total = amount + feeInBTC;
        const change = Math.max(amount - (amount * 0.02), 0); // assume 2% reserved for change output

        document.getElementById('tx-fee').textContent = `${feeInSats.toFixed(0)} sats (${feeInBTC.toFixed(6)} BTC)`;
        document.getElementById('tx-total').textContent = `${total.toFixed(6)} BTC`;
        document.getElementById('tx-change').textContent = `${change.toFixed(6)} BTC`;
      };

      [amountInput, rateInput, sizeInput].forEach((input) => {
        input.addEventListener('input', update);
      });

      update();
    }

    renderFeeSimulation(data) {
      if (!this.elements.feeContainer) return;

      this.elements.feeContainer.innerHTML = `
        <div class="simulation-panel">
          <div class="simulation-header">
            <h4>${data.title || 'Smart Fee Calculator'}</h4>
            <p>${data.description || 'Compare fee tiers using live mempool data.'}</p>
          </div>
          <div class="fee-table" id="fee-table">
            <div class="fee-row">
              <span>Fastest</span>
              <strong id="fee-fastest">Loading…</strong>
            </div>
            <div class="fee-row">
              <span>30 min</span>
              <strong id="fee-fast">Loading…</strong>
            </div>
            <div class="fee-row">
              <span>1 hour</span>
              <strong id="fee-medium">Loading…</strong>
            </div>
            <div class="fee-row">
              <span>Economy</span>
              <strong id="fee-slow">Loading…</strong>
            </div>
          </div>
          <form class="simulation-form" id="fee-form">
            <label>
              Transaction size
              <input type="number" id="fee-size" min="100" step="10" value="225">
              <span class="unit">vBytes</span>
            </label>
            <label>
              Target speed
              <select id="fee-target">
                <option value="fastest">Fastest</option>
                <option value="fast">30 min</option>
                <option value="medium">1 hour</option>
                <option value="slow">Economy</option>
              </select>
            </label>
          </form>
          <div class="simulation-results">
            <div class="result-item">
              <span>Estimated fee</span>
              <strong id="fee-estimate">–</strong>
            </div>
          </div>
          <div class="simulation-footnote">
            ${(data.notes && data.notes.join('<br>')) || 'Adjust the virtual size based on the number of inputs and outputs.'}
          </div>
        </div>
      `;

      this.populateFeeTable();
      this.attachFeeCalculator();
    }

    async populateFeeTable() {
      if (!this.client || typeof this.client.getFeeEstimates !== 'function') {
        this.updateFeeTable(this.getFallbackFees());
        return;
      }

      try {
        const fees = await this.client.getFeeEstimates();
        this.updateFeeTable(fees);
      } catch (error) {
        console.error('Failed to load fee estimates:', error);
        this.updateFeeTable(this.getFallbackFees());
      }
    }

    updateFeeTable(fees) {
      const map = {
        fastest: document.getElementById('fee-fastest'),
        fast: document.getElementById('fee-fast'),
        medium: document.getElementById('fee-medium'),
        slow: document.getElementById('fee-slow')
      };

      Object.entries(map).forEach(([key, element]) => {
        if (!element) return;
        const value = fees[key];
        element.textContent = value ? `${value} sats/vB` : 'N/A';
      });

      this.calculateFeeEstimate();
    }

    attachFeeCalculator() {
      const sizeInput = document.getElementById('fee-size');
      const targetSelect = document.getElementById('fee-target');
      if (!sizeInput || !targetSelect) return;

      ['input', 'change'].forEach((event) => {
        sizeInput.addEventListener(event, () => this.calculateFeeEstimate());
        targetSelect.addEventListener(event, () => this.calculateFeeEstimate());
      });
    }

    calculateFeeEstimate() {
      const sizeInput = document.getElementById('fee-size');
      const targetSelect = document.getElementById('fee-target');
      const output = document.getElementById('fee-estimate');
      if (!sizeInput || !targetSelect || !output) return;

      const size = Number(sizeInput.value || 0);
      const tier = targetSelect.value;
      const rateElement = document.getElementById(`fee-${tier}`);
      const rate = rateElement ? Number(rateElement.textContent.replace(/[^0-9.]/g, '')) : 0;

      if (!size || !rate) {
        output.textContent = '—';
        return;
      }

      const sats = size * rate;
      const btc = sats / SATS_PER_BTC;
      output.textContent = `${sats.toFixed(0)} sats (${btc.toFixed(6)} BTC)`;
    }

    renderSecuritySimulation(data) {
      if (!this.elements.securityContainer) return;
      const scenarios = data.scenarios || [
        { title: 'Seed phrase mishap', action: 'Practice secure backups' },
        { title: 'Phishing attempt', action: 'Identify red flags' },
        { title: 'Wrong address', action: 'Verify with hardware wallet' }
      ];

      const scenarioHtml = scenarios
        .map((scenario, index) => `
          <div class="scenario">
            <strong>${index + 1}. ${scenario.title}</strong>
            <p>${scenario.description || 'Identify the risk and choose the safest response.'}</p>
            <button data-action="${scenario.action || 'Learn more'}" class="scenario-action">${scenario.action || 'Practice response'}</button>
          </div>
        `)
        .join('');

      this.elements.securityContainer.innerHTML = `
        <div class="simulation-panel">
          <div class="simulation-header">
            <h4>${data.title || 'Wallet Security Trainer'}</h4>
            <p>${data.description || 'Work through real-world custody scenarios.'}</p>
          </div>
          <div class="scenario-list">
            ${scenarioHtml}
          </div>
          <div class="simulation-footnote">
            ${(data.guidelines && data.guidelines.join('<br>')) || 'Use multisig for large holdings and test your backups regularly.'}
          </div>
        </div>
      `;

      this.elements.securityContainer
        .querySelectorAll('.scenario-action')
        .forEach((button) => {
          button.addEventListener('click', () => this.openScenarioChecklist(button.dataset.action));
        });
    }

    openScenarioChecklist(action) {
      const checklist = `
        <h3>${action}</h3>
        <ol class="scenario-checklist">
          <li>Identify the assets and wallets at risk.</li>
          <li>Verify communication channels and device integrity.</li>
          <li>Apply the recommended mitigation or recovery steps.</li>
          <li>Document what you learned for future incidents.</li>
        </ol>
        <button class="modal-close" onclick="closeLearningModal()">Close</button>
      `;

      this.openModal(checklist);
    }

    async startModule(name) {
      const moduleName = name || 'fundamentals';
      this.showLoading('Generating personalized learning module...');

      try {
        const moduleData = this.client
          ? await this.client.getSocraticModule(moduleName)
          : this.getFallbackModule(moduleName);

        const html = this.renderModuleContent(moduleData);
        this.openModal(html);
      } catch (error) {
        console.error('Failed to load module:', error);
        this.openModal('<p>Unable to load module right now. Please try again later.</p>');
      } finally {
        this.hideLoading();
      }
    }

    renderModuleContent(moduleData) {
      const questions = (moduleData.questions || [])
        .map((q) => `<li>${q}</li>`)
        .join('');

      const activities = (moduleData.activities || [])
        .map((a) => `<li>${a}</li>`)
        .join('');

      const assessments = (moduleData.assessments || [])
        .map((a) => `<li>${a}</li>`)
        .join('');

      const resources = (moduleData.resources || [])
        .map((r) => `<li><a href="${r.url || '#'}" target="_blank" rel="noopener">${r.title || r}</a></li>`)
        .join('');

      return `
        <article class="module-detail">
          <header>
            <h2>${moduleData.title || 'Bitcoin Learning Module'}</h2>
            <p>${moduleData.description || 'Socratic prompts and hands-on activities generated by your agents.'}</p>
          </header>
          ${questions ? `<section><h3>Guiding Questions</h3><ul>${questions}</ul></section>` : ''}
          ${activities ? `<section><h3>Hands-on Activities</h3><ul>${activities}</ul></section>` : ''}
          ${assessments ? `<section><h3>Knowledge Checks</h3><ul>${assessments}</ul></section>` : ''}
          ${resources ? `<section><h3>Suggested Resources</h3><ul>${resources}</ul></section>` : ''}
          <footer>
            <button class="modal-close" onclick="closeLearningModal()">Close</button>
          </footer>
        </article>
      `;
    }

    openModal(content) {
      if (!this.elements.modal || !this.elements.modalContent) return;
      this.elements.modalContent.innerHTML = content;
      this.elements.modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    closeModal() {
      if (!this.elements.modal || !this.elements.modalContent) return;
      this.elements.modal.classList.remove('open');
      this.elements.modalContent.innerHTML = '';
      document.body.style.overflow = '';
    }

    isModalOpen() {
      return this.elements.modal?.classList.contains('open');
    }

    showLoading(message) {
      if (!this.elements.loadingOverlay) return;
      if (this.elements.loadingMessage && message) {
        this.elements.loadingMessage.textContent = message;
      }
      this.elements.loadingOverlay.classList.add('active');
    }

    hideLoading() {
      if (!this.elements.loadingOverlay) return;
      this.elements.loadingOverlay.classList.remove('active');
    }

    renderSimulationError(type) {
      const container = {
        transaction: this.elements.txContainer,
        fees: this.elements.feeContainer,
        security: this.elements.securityContainer
      }[type];

      if (!container) return;
      container.innerHTML = '<p class="error">Unable to load simulation right now. Please try again later.</p>';
    }

    getFallbackSimulation(type) {
      if (this.client && typeof this.client.getFallbackSimulation === 'function') {
        return this.client.getFallbackSimulation(type);
      }
      return { title: 'Simulation', description: 'Interactive learning experience.' };
    }

    getFallbackModule(name) {
      if (this.client && typeof this.client.getFallbackModule === 'function') {
        return this.client.getFallbackModule(name);
      }
      return {
        title: 'Bitcoin Fundamentals',
        questions: ['What is Bitcoin?', 'Why is supply capped at 21 million?'],
        activities: ['Explore a block explorer', 'Practice sending testnet BTC']
      };
    }

    getFallbackFees() {
      return { fastest: 25, fast: 18, medium: 12, slow: 6 };
    }

    formatLabel(type) {
      return type.charAt(0).toUpperCase() + type.slice(1);
    }
  }

  const manager = new SimulationManager(window.mcpClient);

  window.loadSimulation = (type) => manager.loadSimulation(type);
  window.startModule = (name) => manager.startModule(name);
  window.startInteractiveLearning = () => manager.startModule('fundamentals');
  window.exploreSimulations = () => {
    const section = document.getElementById('simulate');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      section.classList.add('highlight');
      setTimeout(() => section.classList.remove('highlight'), 1500);
    }
  };
  window.closeLearningModal = () => manager.closeModal();
})();
