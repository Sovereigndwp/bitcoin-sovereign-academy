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
      // Check if MCP client exists and has required methods
      const hasMCPClient = this.client &&
                          typeof this.client.getBitcoinNetworkData === 'function' &&
                          typeof this.client.getBitcoinPrice === 'function';

      if (!hasMCPClient) {
        console.log('MCP client unavailable; using fallback data');
        this.updateFromFallback();
        this.setStatusIndicator('offline', 'Using fallback data (MCP not connected)');
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
      // Use client fallback if available, otherwise use realistic static data
      const fallback = (this.client && typeof this.client.getFallbackNetworkData === 'function')
        ? this.client.getFallbackNetworkData()
        : {
            blockHeight: 868500,        // Approximate current height (Oct 2025)
            mempoolSize: 2100,           // Typical mempool size
            feeEstimate: 8,              // Current low fee environment
            difficulty: 102.3,           // Trillions (formatted as T)
            price: '$62,500'             // Approximate BTC price
          };

      // Format fallback data properly
      const formattedFallback = {
        blockHeight: typeof fallback.blockHeight === 'number'
          ? fallback.blockHeight
          : fallback.blockHeight,
        mempoolSize: typeof fallback.mempoolSize === 'number'
          ? fallback.mempoolSize
          : fallback.mempoolSize,
        feeEstimate: typeof fallback.feeEstimate === 'number'
          ? fallback.feeEstimate
          : fallback.feeEstimate,
        difficulty: typeof fallback.difficulty === 'number'
          ? `${fallback.difficulty}T`
          : fallback.difficulty
      };

      this.updatePrice({ usd: fallback.price, change24h: 0 });
      this.updateNetworkMetrics(formattedFallback, { fastest: formattedFallback.feeEstimate });
      this.clearLoadingState();
    }
  }

  // Create a simple public API client as fallback
  class PublicBitcoinAPIClient {
    async getBitcoinPrice() {
      try {
        const response = await fetch('https://api.coinbase.com/v2/exchange-rates?currency=BTC');
        const data = await response.json();
        const usdRate = data.data.rates.USD;
        return { usd: usdRate, change24h: 0 };
      } catch (error) {
        console.log('Coinbase API failed, using fallback');
        return null;
      }
    }

    async getBitcoinNetworkData() {
      try {
        const response = await fetch('https://mempool.space/api/blocks/tip/height');
        const blockHeight = await response.text();

        const mempoolResponse = await fetch('https://mempool.space/api/mempool');
        const mempoolData = await mempoolResponse.json();

        return {
          blockHeight: parseInt(blockHeight),
          mempoolSize: mempoolData.count,
          difficulty: 'N/A'
        };
      } catch (error) {
        console.log('Mempool.space API failed, using fallback');
        return null;
      }
    }

    async getFeeEstimates() {
      try {
        const response = await fetch('https://mempool.space/api/v1/fees/recommended');
        const fees = await response.json();
        return {
          fastest: fees.fastestFee,
          medium: fees.halfHourFee,
          slow: fees.hourFee
        };
      } catch (error) {
        console.log('Fee API failed, using fallback');
        return null;
      }
    }
  }

  // Use MCP client if available, otherwise use public API client
  const client = window.mcpClient || new PublicBitcoinAPIClient();
  window.bitcoinDataController = new BitcoinDataController(client);
})();
