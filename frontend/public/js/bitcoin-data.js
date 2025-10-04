(function () {
  'use strict';

  const NUMBER_FORMAT = new Intl.NumberFormat('en-US');
  const PRICE_FORMAT = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });

  const STATUS_COLORS = {
    good: '#1CC88A',
    warning: '#F6C23E',
    critical: '#E74A3B',
    offline: '#858796'
  };

  class BitcoinDataController {
    constructor(client) {
      this.client = client;
      this.refreshInterval = 60_000;
      this.elements = {};
      this.timers = [];

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.initialize());
      } else {
        this.initialize();
      }
    }

    initialize() {
      this.cacheElements();
      this.updateAll();
      this.setupAutoRefresh();
      this.registerConnectionListeners();
    }

    cacheElements() {
      this.elements = {
        price: document.getElementById('btc-price'),
        status: document.getElementById('network-status'),
        blockHeight: document.getElementById('block-height'),
        mempool: document.getElementById('mempool-size'),
        feeEstimate: document.getElementById('fee-estimate'),
        difficulty: document.getElementById('difficulty')
      };
    }

    setupAutoRefresh() {
      this.timers.push(setInterval(() => this.updateAll(), this.refreshInterval));
    }

    registerConnectionListeners() {
      if (!this.client || typeof this.client.on !== 'function') return;

      this.client.on('connected', () => {
        this.setStatusIndicator('good', 'Connected to Bitcoin MCP agents');
        this.updateAll();
      });

      this.client.on('disconnected', () => {
        this.setStatusIndicator('offline', 'Offline – using cached data');
      });
    }

    async updateAll() {
      if (!this.client) {
        console.warn('MCP client unavailable; using fallback data');
        this.updateFromFallback();
        return;
      }

      this.showLoadingState();

      try {
        const [networkData, priceData, feeData] = await Promise.all([
          this.client.getBitcoinNetworkData(),
          this.client.getBitcoinPrice(),
          this.client.getFeeEstimates()
        ]);

        this.updatePrice(priceData);
        this.updateNetworkMetrics(networkData, feeData);
        this.setStatusIndicator('good', 'Live data streaming');
      } catch (error) {
        console.error('Failed to refresh bitcoin data:', error);
        this.updateFromFallback();
        this.setStatusIndicator('warning', 'Network unreachable – showing fallback data');
      } finally {
        this.clearLoadingState();
      }
    }

    updatePrice(priceData) {
      if (!this.elements.price) return;
      const usd = Number(priceData.usd);
      const formatted = Number.isFinite(usd) ? PRICE_FORMAT.format(usd) : priceData.usd || 'N/A';
      const change = Number(priceData.change24h || 0).toFixed(2);
      const direction = change > 0 ? '▲' : change < 0 ? '▼' : '▶';
      this.elements.price.textContent = `${formatted} ${direction} ${Math.abs(change)}%`;
      this.elements.price.dataset.change = change;
    }

    updateNetworkMetrics(networkData, feeData) {
      this.updateText(this.elements.blockHeight, this.formatNumber(networkData.blockHeight));
      this.updateText(this.elements.mempool, this.formatNumber(networkData.mempoolSize));

      const primaryFee = feeData && feeData.fastest ? `${feeData.fastest} sats/vB` : `${networkData.feeEstimate} sats/vB`;
      const detail = feeData && feeData.medium ? ` (1h ~ ${feeData.medium} sats/vB)` : '';
      this.updateText(this.elements.feeEstimate, `${primaryFee}${detail}`.trim());

      const difficulty = typeof networkData.difficulty === 'number'
        ? this.formatNumber(networkData.difficulty)
        : networkData.difficulty;
      this.updateText(this.elements.difficulty, difficulty || 'N/A');

      this.updateStatusFromMempool(networkData.mempoolSize);
    }

    setStatusIndicator(state, title) {
      if (!this.elements.status) return;
      const color = STATUS_COLORS[state] || STATUS_COLORS.warning;
      this.elements.status.style.background = color;
      this.elements.status.title = title;
      this.elements.status.dataset.state = state;
    }

    updateStatusFromMempool(mempoolSize) {
      if (!this.elements.status) return;
      const mempool = Number(String(mempoolSize).replace(/[^0-9.]/g, ''));
      let state = 'good';

      if (Number.isFinite(mempool)) {
        if (mempool > 50_000) {
          state = 'critical';
        } else if (mempool > 10_000) {
          state = 'warning';
        }
      }

      const messageMap = {
        good: 'Network flowing normally',
        warning: 'Network busy – expect higher fees',
        critical: 'Network congested – plan carefully'
      };

      this.setStatusIndicator(state, messageMap[state] || 'Status unavailable');
    }

    updateText(element, value) {
      if (!element) return;
      element.textContent = value || 'N/A';
    }

    formatNumber(value) {
      const numeric = Number(String(value).replace(/[^0-9.]/g, ''));
      return Number.isFinite(numeric) ? NUMBER_FORMAT.format(Math.round(numeric)) : value || 'N/A';
    }

    showLoadingState() {
      Object.values(this.elements).forEach((el) => {
        if (!el) return;
        if (!el.dataset.originalText) {
          el.dataset.originalText = el.textContent;
        }
        el.classList.add('is-loading');
      });
    }

    clearLoadingState() {
      Object.values(this.elements).forEach((el) => {
        if (!el) return;
        el.classList.remove('is-loading');
      });
    }

    updateFromFallback() {
      const fallback = (this.client && typeof this.client.getFallbackNetworkData === 'function')
        ? this.client.getFallbackNetworkData()
        : {
            blockHeight: '800,000+',
            mempoolSize: '~1,500',
            feeEstimate: '15-25',
            difficulty: 'High',
            price: '$40,000+'
          };

      this.updatePrice({ usd: fallback.price, change24h: 0 });
      this.updateNetworkMetrics(fallback, { fastest: fallback.feeEstimate });
      this.clearLoadingState();
    }
  }

  // Instantiate when MCP client is ready
  window.bitcoinDataController = new BitcoinDataController(window.mcpClient);
})();
