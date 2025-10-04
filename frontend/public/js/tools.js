(function () {
  'use strict';

  class ToolsController {
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
      this.attachInputShortcuts();
    }

    cacheElements() {
      this.elements = {
        addressInput: document.getElementById('address-input'),
        addressResult: document.getElementById('address-result'),
        amountInput: document.getElementById('amount-input'),
        fromUnit: document.getElementById('from-unit'),
        toUnit: document.getElementById('to-unit'),
        conversionResult: document.getElementById('conversion-result'),
        txInput: document.getElementById('txid-input'),
        txResult: document.getElementById('tx-result')
      };
    }

    attachInputShortcuts() {
      if (this.elements.addressInput) {
        this.elements.addressInput.addEventListener('keydown', (event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            this.validateAddress();
          }
        });
      }

      if (this.elements.txInput) {
        this.elements.txInput.addEventListener('keydown', (event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            this.exploreTransaction();
          }
        });
      }

      if (this.elements.amountInput) {
        this.elements.amountInput.addEventListener('keydown', (event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            this.convertUnits();
          }
        });
      }
    }

    async validateAddress() {
      const input = this.elements.addressInput?.value?.trim();
      if (!input) {
        this.showAddressResult('Please enter a Bitcoin address.', 'warning');
        return;
      }

      this.showAddressResult('Validating address...', 'loading');

      if (!this.client) {
        this.showAddressResult('Offline: unable to validate address.', 'error');
        return;
      }

      try {
        const result = await this.client.validateAddress(input);
        if (!result.isValid) {
          this.showAddressResult('Address is invalid or unsupported. Double-check the network and format.', 'error');
          return;
        }

        const details = this.formatAddressDetails(result);
        this.showAddressResult(details, 'success');
      } catch (error) {
        console.error('Address validation failed:', error);
        this.showAddressResult('Unable to validate address right now.', 'error');
      }
    }

    formatAddressDetails(result) {
      const parts = [
        `<strong>Network:</strong> ${result.network || 'Unknown'}`,
        `<strong>Type:</strong> ${result.type || 'N/A'}`
      ];

      if (result.details?.isP2SH) {
        parts.push('<strong>Detected script:</strong> P2SH');
      }
      if (result.details?.isSegwit) {
        parts.push('<strong>SegWit:</strong> Yes');
      }
      if (result.details?.warnings?.length) {
        parts.push(`<strong>Warnings:</strong> ${result.details.warnings.join(', ')}`);
      }

      return `<div class="address-info">${parts.join('<br>')}</div>`;
    }

    showAddressResult(message, state) {
      if (!this.elements.addressResult) return;
      this.elements.addressResult.className = `tool-result ${state || ''}`;
      this.elements.addressResult.innerHTML = message;
    }

    convertUnits() {
      const amount = Number(this.elements.amountInput?.value || 0);
      const fromUnit = this.elements.fromUnit?.value || 'btc';
      const toUnit = this.elements.toUnit?.value || 'sats';

      if (!amount) {
        this.showConversionResult('Enter an amount to convert.', 'warning');
        return;
      }

      let converted = 0;
      if (this.client && typeof this.client.convertUnits === 'function') {
        converted = this.client.convertUnits(amount, fromUnit, toUnit);
      } else {
        converted = this.localConvert(amount, fromUnit, toUnit);
      }

      this.showConversionResult(`${amount} ${fromUnit.toUpperCase()} = ${converted} ${toUnit.toUpperCase()}`, 'success');
    }

    localConvert(amount, fromUnit, toUnit) {
      const toSats = {
        btc: (value) => value * 100_000_000,
        sats: (value) => value,
        mbtc: (value) => value * 100_000
      };

      const fromSats = {
        btc: (value) => value / 100_000_000,
        sats: (value) => value,
        mbtc: (value) => value / 100_000
      };

      const sats = toSats[fromUnit]?.(amount) ?? amount;
      return fromSats[toUnit]?.(sats) ?? sats;
    }

    showConversionResult(message, state) {
      if (!this.elements.conversionResult) return;
      this.elements.conversionResult.className = `tool-result ${state || ''}`;
      this.elements.conversionResult.textContent = message;
    }

    async exploreTransaction() {
      const txid = this.elements.txInput?.value?.trim();
      if (!txid) {
        this.showTxResult('Enter a transaction ID to explore.', 'warning');
        return;
      }

      this.showTxResult('Loading transaction details...', 'loading');

      if (!this.client) {
        this.showTxResult('Offline: unable to fetch transaction.', 'error');
        return;
      }

      try {
        const data = await this.client.exploreTransaction(txid);
        if (data.error) {
          this.showTxResult(data.error, 'error');
          return;
        }

        this.showTxResult(this.formatTransaction(data), 'success');
      } catch (error) {
        console.error('Transaction lookup failed:', error);
        this.showTxResult('Unable to fetch transaction data. Try another txid.', 'error');
      }
    }

    formatTransaction(data) {
      const inputs = (data.inputs || [])
        .slice(0, 5)
        .map((input, index) => `<li>#${index + 1} ${input.address || input.prev_out?.addr || 'Unknown'} (${this.formatValue(input.value || input.prev_out?.value)})</li>`)
        .join('');

      const outputs = (data.outputs || [])
        .slice(0, 5)
        .map((output, index) => `<li>#${index + 1} ${output.address || output.scriptpubkey_address || 'Unknown'} (${this.formatValue(output.value)})</li>`)
        .join('');

      return `
        <div class="tx-summary">
          <p><strong>Block height:</strong> ${data.blockHeight || data.status?.block_height || 'Unconfirmed'}</p>
          <p><strong>Confirmations:</strong> ${data.confirmations ?? data.status?.confirmations ?? 0}</p>
          <p><strong>Fee:</strong> ${this.formatValue(data.fee)}</p>
        </div>
        <div class="tx-io">
          <div>
            <h4>Inputs</h4>
            <ul>${inputs || '<li>No inputs parsed.</li>'}</ul>
          </div>
          <div>
            <h4>Outputs</h4>
            <ul>${outputs || '<li>No outputs parsed.</li>'}</ul>
          </div>
        </div>
      `;
    }

    formatValue(value) {
      if (value === undefined || value === null) return 'N/A';
      const sats = Number(value);
      if (!Number.isFinite(sats)) return value;
      const btc = sats / 100_000_000;
      return `${sats} sats (${btc.toFixed(8)} BTC)`;
    }

    showTxResult(content, state) {
      if (!this.elements.txResult) return;
      this.elements.txResult.className = `tool-result ${state || ''}`;
      this.elements.txResult.innerHTML = content;
    }
  }

  const controller = new ToolsController(window.mcpClient);

  window.validateAddress = () => controller.validateAddress();
  window.convertUnits = () => controller.convertUnits();
  window.exploreTx = () => controller.exploreTransaction();
})();
