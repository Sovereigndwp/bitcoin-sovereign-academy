/**
 * Live Market Data Widget
 * Displays real-time Bitcoin price and market statistics
 * Version: 1.0.0
 * Dependencies: api-handler.js
 */

class LiveMarketData {
    constructor(options = {}) {
        // Configuration
        this.config = {
            container: options.container || '#live-market-data',
            view: options.view || 'full', // 'compact', 'full', 'minimal'
            refreshInterval: options.refreshInterval || 60000, // 1 minute
            showChange: options.showChange !== false,
            showVolume: options.showVolume !== false,
            showMarketCap: options.showMarketCap !== false,
            showDominance: options.showDominance !== false,
            animateChanges: options.animateChanges !== false,
            onUpdate: options.onUpdate || null,
            onError: options.onError || null
        };

        // State
        this.data = null;
        this.previousPrice = null;
        this.refreshTimer = null;
        this.isLoading = false;

        // Initialize API handler
        this.api = options.apiHandler || new BitcoinAPIHandler({
            enableLogging: options.enableLogging || false
        });

        // Initialize
        this.init();
    }

    /**
     * Initialize the widget
     */
    async init() {
        this.container = document.querySelector(this.config.container);

        if (!this.container) {
            console.error(`Container ${this.config.container} not found`);
            return;
        }

        // Render initial skeleton
        this.renderSkeleton();

        // Fetch initial data
        await this.fetchData();

        // Start auto-refresh
        this.startAutoRefresh();
    }

    /**
     * Fetch market data
     */
    async fetchData() {
        if (this.isLoading) return;

        this.isLoading = true;

        try {
            // Fetch data from API handler
            const [priceData, globalData] = await Promise.all([
                this.api.getBitcoinPrice(),
                this.config.showDominance ? this.api.getGlobalData() : Promise.resolve(null)
            ]);

            // Store previous price for comparison
            if (this.data && this.data.price) {
                this.previousPrice = this.data.price;
            }

            // Update data
            this.data = {
                ...priceData,
                dominance: globalData ? globalData.bitcoinDominance : null
            };

            // Render update
            this.render();

            // Call update callback
            if (this.config.onUpdate) {
                this.config.onUpdate(this.data);
            }

        } catch (error) {
            console.error('Failed to fetch market data:', error);

            if (this.config.onError) {
                this.config.onError(error);
            }

            // Render error state if no data exists
            if (!this.data) {
                this.renderError();
            }
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Render skeleton/loading state
     */
    renderSkeleton() {
        this.container.innerHTML = `
            <div class="live-market-data-widget loading">
                <div class="skeleton skeleton-price"></div>
                <div class="skeleton skeleton-change"></div>
                ${this.config.showMarketCap ? '<div class="skeleton skeleton-marketcap"></div>' : ''}
                ${this.config.showVolume ? '<div class="skeleton skeleton-volume"></div>' : ''}
            </div>
        `;
    }

    /**
     * Render market data based on view mode
     */
    render() {
        if (!this.data) return;

        const { price, change24h, marketCap, volume24h, dominance, isFallback } = this.data;

        // Determine price movement
        let priceMovement = 'neutral';
        if (this.previousPrice && price !== this.previousPrice) {
            priceMovement = price > this.previousPrice ? 'up' : 'down';
        }

        // Render based on view mode
        switch (this.config.view) {
            case 'minimal':
                this.renderMinimal(price, change24h, priceMovement, isFallback);
                break;
            case 'compact':
                this.renderCompact(price, change24h, priceMovement, isFallback);
                break;
            case 'full':
            default:
                this.renderFull(price, change24h, marketCap, volume24h, dominance, priceMovement, isFallback);
                break;
        }
    }

    /**
     * Render minimal view (just price)
     */
    renderMinimal(price, change24h, movement, isFallback) {
        const changeClass = change24h >= 0 ? 'positive' : 'negative';
        const changeSymbol = change24h >= 0 ? '+' : '';

        this.container.innerHTML = `
            <div class="live-market-data-widget minimal ${movement} ${isFallback ? 'fallback' : ''}">
                <div class="price-container">
                    <span class="price">${this.formatCurrency(price)}</span>
                    ${this.config.showChange ? `
                        <span class="change ${changeClass}">${changeSymbol}${change24h.toFixed(1)}%</span>
                    ` : ''}
                </div>
                ${isFallback ? '<span class="fallback-indicator" title="Using cached/fallback data">⚠️</span>' : ''}
            </div>
        `;
    }

    /**
     * Render compact view (price + market cap)
     */
    renderCompact(price, change24h, movement, isFallback) {
        const changeClass = change24h >= 0 ? 'positive' : 'negative';
        const changeSymbol = change24h >= 0 ? '+' : '';

        this.container.innerHTML = `
            <div class="live-market-data-widget compact ${movement} ${isFallback ? 'fallback' : ''}">
                <div class="price-section">
                    <div class="label">BTC/USD</div>
                    <div class="price">${this.formatCurrency(price)}</div>
                    ${this.config.showChange ? `
                        <div class="change ${changeClass}">${changeSymbol}${change24h.toFixed(1)}%</div>
                    ` : ''}
                </div>
                ${isFallback ? '<span class="fallback-indicator" title="Using cached/fallback data">⚠️</span>' : ''}
            </div>
        `;
    }

    /**
     * Render full view (all data)
     */
    renderFull(price, change24h, marketCap, volume24h, dominance, movement, isFallback) {
        const changeClass = change24h >= 0 ? 'positive' : 'negative';
        const changeSymbol = change24h >= 0 ? '+' : '';

        this.container.innerHTML = `
            <div class="live-market-data-widget full ${movement} ${isFallback ? 'fallback' : ''}">
                <div class="main-stats">
                    <div class="price-section">
                        <div class="label">Bitcoin Price</div>
                        <div class="price">${this.formatCurrency(price)}</div>
                        ${this.config.showChange ? `
                            <div class="change ${changeClass}">
                                <span class="change-icon">${change24h >= 0 ? '▲' : '▼'}</span>
                                <span class="change-value">${changeSymbol}${change24h.toFixed(2)}%</span>
                                <span class="change-label">(24h)</span>
                            </div>
                        ` : ''}
                    </div>
                </div>

                <div class="additional-stats">
                    ${this.config.showMarketCap ? `
                        <div class="stat-item">
                            <div class="stat-label">Market Cap</div>
                            <div class="stat-value">${this.formatMarketCap(marketCap)}</div>
                        </div>
                    ` : ''}

                    ${this.config.showVolume ? `
                        <div class="stat-item">
                            <div class="stat-label">24h Volume</div>
                            <div class="stat-value">${this.formatVolume(volume24h)}</div>
                        </div>
                    ` : ''}

                    ${this.config.showDominance && dominance ? `
                        <div class="stat-item">
                            <div class="stat-label">BTC Dominance</div>
                            <div class="stat-value">${dominance.toFixed(1)}%</div>
                        </div>
                    ` : ''}
                </div>

                ${isFallback ? `
                    <div class="fallback-notice">
                        <span class="fallback-icon">⚠️</span>
                        <span class="fallback-text">Using cached/fallback data</span>
                    </div>
                ` : ''}

                <div class="last-updated">
                    Last updated: ${new Date().toLocaleTimeString()}
                </div>
            </div>
        `;
    }

    /**
     * Render error state
     */
    renderError() {
        this.container.innerHTML = `
            <div class="live-market-data-widget error">
                <div class="error-icon">⚠️</div>
                <div class="error-message">Unable to load market data</div>
                <button class="retry-button" onclick="this.fetchData()">Retry</button>
            </div>
        `;
    }

    /**
     * Format currency with proper separators
     */
    formatCurrency(value) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    }

    /**
     * Format market cap (billions/trillions)
     */
    formatMarketCap(value) {
        if (value >= 1e12) {
            return `$${(value / 1e12).toFixed(2)}T`;
        } else if (value >= 1e9) {
            return `$${(value / 1e9).toFixed(1)}B`;
        }
        return this.formatCurrency(value);
    }

    /**
     * Format volume (billions)
     */
    formatVolume(value) {
        if (value >= 1e9) {
            return `$${(value / 1e9).toFixed(1)}B`;
        } else if (value >= 1e6) {
            return `$${(value / 1e6).toFixed(1)}M`;
        }
        return this.formatCurrency(value);
    }

    /**
     * Start auto-refresh timer
     */
    startAutoRefresh() {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
        }

        this.refreshTimer = setInterval(() => {
            this.fetchData();
        }, this.config.refreshInterval);
    }

    /**
     * Stop auto-refresh timer
     */
    stopAutoRefresh() {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
            this.refreshTimer = null;
        }
    }

    /**
     * Manual refresh
     */
    async refresh() {
        await this.fetchData();
    }

    /**
     * Update configuration
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };

        if (newConfig.refreshInterval) {
            this.startAutoRefresh();
        }

        this.render();
    }

    /**
     * Get current data
     */
    getData() {
        return this.data;
    }

    /**
     * Destroy widget
     */
    destroy() {
        this.stopAutoRefresh();
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LiveMarketData;
}

// Make available globally if in browser
if (typeof window !== 'undefined') {
    window.LiveMarketData = LiveMarketData;
}
