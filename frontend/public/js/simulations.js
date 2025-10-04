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

      this.elements.txContainer.innerHTML = `
        <div class="simulation-panel">
          <div class="simulation-header">
            <h4>${data.title || 'Transaction Builder'}</h4>
            <p>${data.description || 'Estimate transaction cost and visualize inputs/outputs.'}</p>
          </div>
          <form class="simulation-form" id="tx-form">
            <label>
              Amount
              <input type="number" id="tx-amount" min="0" step="0.0001" value="0.01">
              <span class="unit">BTC</span>
            </label>
            <label>
              Fee rate
              <input type="number" id="tx-fee-rate" min="1" step="1" value="15">
              <span class="unit">sats/vB</span>
            </label>
            <label>
              Estimated size
              <input type="number" id="tx-size" min="50" step="10" value="${size}"/>
              <span class="unit">vBytes</span>
            </label>
          </form>
          <div class="simulation-results" id="tx-results">
            <div class="result-item">
              <span>Network fee</span>
              <strong id="tx-fee">–</strong>
            </div>
            <div class="result-item">
              <span>Total spend</span>
              <strong id="tx-total">–</strong>
            </div>
            <div class="result-item">
              <span>Change output</span>
              <strong id="tx-change">–</strong>
            </div>
          </div>
          <div class="simulation-footnote">
            ${(data.tips && data.tips.join('<br>')) || 'Tip: keep a small UTXO handy for fast transactions.'}
          </div>
        </div>
      `;

      const amountInput = document.getElementById('tx-amount');
      const rateInput = document.getElementById('tx-fee-rate');
      const sizeInput = document.getElementById('tx-size');

      const update = () => {
        const amount = Number(amountInput.value || 0);
        const rate = Number(rateInput.value || 0);
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
