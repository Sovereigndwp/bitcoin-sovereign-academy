/**
 * Network Stats Dashboard Widget
 * Displays real-time Bitcoin network health metrics
 * Version: 1.0.0
 * Dependencies: api-handler.js
 */

class NetworkStats {
    constructor(options = {}) {
        // Configuration
        this.config = {
            container: options.container || '#network-stats',
            metrics: options.metrics || ['blockHeight', 'hashrate', 'difficulty', 'mempool', 'fees'],
            refreshInterval: options.refreshInterval || 30000, // 30 seconds
            view: options.view || 'dashboard', // 'dashboard', 'compact', 'minimal'
            showTrends: options.showTrends !== false,
            onUpdate: options.onUpdate || null,
            onError: options.onError || null
        };

        // State
        this.data = null;
        this.previousData = null;
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
     * Fetch network statistics
     */
    async fetchData() {
        if (this.isLoading) return;

        this.isLoading = true;

        try {
            // Store previous data for trend comparison
            if (this.data) {
                this.previousData = { ...this.data };
            }

            // Fetch all metrics in parallel
            const promises = [];
            
            if (this.config.metrics.includes('blockHeight')) {
                promises.push(this.api.getBlockHeight());
            }
            
            if (this.config.metrics.includes('hashrate')) {
                promises.push(this.api.getHashRate());
            }
            
            if (this.config.metrics.includes('difficulty')) {
                promises.push(this.api.getDifficulty());
            }
            
            if (this.config.metrics.includes('mempool')) {
                promises.push(this.api.getMempoolStats());
            }
            
            if (this.config.metrics.includes('fees')) {
                promises.push(this.api.getFeeRecommendations());
            }

            const results = await Promise.allSettled(promises);

            // Process results
            this.data = {
                blockHeight: null,
                hashrate: null,
                difficulty: null,
                mempool: null,
                fees: null,
                timestamp: Date.now()
            };

            let index = 0;
            if (this.config.metrics.includes('blockHeight') && results[index]) {
                this.data.blockHeight = results[index].status === 'fulfilled' ? results[index].value : null;
                index++;
            }
            if (this.config.metrics.includes('hashrate') && results[index]) {
                this.data.hashrate = results[index].status === 'fulfilled' ? results[index].value : null;
                index++;
            }
            if (this.config.metrics.includes('difficulty') && results[index]) {
                this.data.difficulty = results[index].status === 'fulfilled' ? results[index].value : null;
                index++;
            }
            if (this.config.metrics.includes('mempool') && results[index]) {
                this.data.mempool = results[index].status === 'fulfilled' ? results[index].value : null;
                index++;
            }
            if (this.config.metrics.includes('fees') && results[index]) {
                this.data.fees = results[index].status === 'fulfilled' ? results[index].value : null;
                index++;
            }

            // Render update
            this.render();

            // Call update callback
            if (this.config.onUpdate) {
                this.config.onUpdate(this.data);
            }

        } catch (error) {
            console.error('Failed to fetch network stats:', error);

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
            <div class="network-stats-widget loading">
                <div class="skeleton skeleton-stat"></div>
                <div class="skeleton skeleton-stat"></div>
                <div class="skeleton skeleton-stat"></div>
                <div class="skeleton skeleton-stat"></div>
            </div>
        `;
    }

    /**
     * Render network stats based on view mode
     */
    render() {
        if (!this.data) return;

        switch (this.config.view) {
            case 'minimal':
                this.renderMinimal();
                break;
            case 'compact':
                this.renderCompact();
                break;
            case 'dashboard':
            default:
                this.renderDashboard();
                break;
        }
    }

    /**
     * Render minimal view (key metrics only)
     */
    renderMinimal() {
        const { blockHeight, fees } = this.data;

        this.container.innerHTML = `
            <div class="network-stats-widget minimal">
                ${blockHeight ? `
                    <div class="stat-minimal">
                        <span class="stat-label">Block:</span>
                        <span class="stat-value">${this.formatNumber(blockHeight.height)}</span>
                    </div>
                ` : ''}
                
                ${fees && !fees.isFallback ? `
                    <div class="stat-minimal">
                        <span class="stat-label">Fee:</span>
                        <span class="stat-value">${fees.fastest} sat/vB</span>
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Render compact view (grid of key stats)
     */
    renderCompact() {
        const { blockHeight, hashrate, mempool, fees } = this.data;

        this.container.innerHTML = `
            <div class="network-stats-widget compact">
                <div class="stats-grid">
                    ${blockHeight ? this.renderStatCard('Block Height', this.formatNumber(blockHeight.height), '🧱', blockHeight.isFallback) : ''}
                    ${hashrate ? this.renderStatCard('Hash Rate', this.formatHashRate(hashrate.current), '⛏️', hashrate.isFallback) : ''}
                    ${mempool ? this.renderStatCard('Mempool', `${this.formatNumber(mempool.count)} txs`, '📦', mempool.isFallback) : ''}
                    ${fees ? this.renderStatCard('Fast Fee', `${fees.fastest} sat/vB`, '⚡', fees.isFallback) : ''}
                </div>
            </div>
        `;
    }

    /**
     * Render full dashboard view
     */
    renderDashboard() {
        const { blockHeight, hashrate, difficulty, mempool, fees, timestamp } = this.data;

        const hasFallback = [blockHeight, hashrate, difficulty, mempool, fees]
            .some(item => item && item.isFallback);

        this.container.innerHTML = `
            <div class="network-stats-widget dashboard">
                <div class="widget-header">
                    <h3>Network Statistics</h3>
                    <div class="last-updated">Updated ${new Date(timestamp).toLocaleTimeString()}</div>
                </div>

                <div class="stats-dashboard">
                    ${blockHeight ? this.renderDashboardStat(
                        'Block Height',
                        this.formatNumber(blockHeight.height),
                        '🧱',
                        'Current blockchain height',
                        blockHeight.isFallback,
                        this.getTrend('blockHeight')
                    ) : ''}

                    ${hashrate ? this.renderDashboardStat(
                        'Network Hash Rate',
                        this.formatHashRate(hashrate.current),
                        '⛏️',
                        'Total mining power',
                        hashrate.isFallback,
                        this.getTrend('hashrate')
                    ) : ''}

                    ${difficulty ? this.renderDashboardStat(
                        'Mining Difficulty',
                        this.formatDifficulty(difficulty.difficulty),
                        '🎯',
                        `${difficulty.progressPercent?.toFixed(1)}% to next adjustment`,
                        difficulty.isFallback,
                        this.getTrend('difficulty')
                    ) : ''}

                    ${mempool ? this.renderDashboardStat(
                        'Mempool Size',
                        `${this.formatNumber(mempool.count)} transactions`,
                        '📦',
                        `${this.formatBytes(mempool.vsize)} total`,
                        mempool.isFallback,
                        this.getTrend('mempool')
                    ) : ''}

                    ${fees ? this.renderFeesSection(fees) : ''}
                </div>

                ${hasFallback ? `
                    <div class="fallback-notice">
                        <span class="fallback-icon">⚠️</span>
                        <span class="fallback-text">Some data is cached or estimated</span>
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Render a stat card (compact view)
     */
    renderStatCard(label, value, icon, isFallback) {
        return `
            <div class="stat-card ${isFallback ? 'fallback' : ''}">
                <div class="stat-icon">${icon}</div>
                <div class="stat-content">
                    <div class="stat-label">${label}</div>
                    <div class="stat-value">${value}</div>
                </div>
            </div>
        `;
    }

    /**
     * Render a dashboard stat (full view)
     */
    renderDashboardStat(label, value, icon, subtitle, isFallback, trend) {
        return `
            <div class="dashboard-stat ${isFallback ? 'fallback' : ''}">
                <div class="stat-header">
                    <span class="stat-icon">${icon}</span>
                    <span class="stat-label">${label}</span>
                    ${trend && this.config.showTrends ? `<span class="stat-trend ${trend}">${this.getTrendIcon(trend)}</span>` : ''}
                </div>
                <div class="stat-main-value">${value}</div>
                ${subtitle ? `<div class="stat-subtitle">${subtitle}</div>` : ''}
            </div>
        `;
    }

    /**
     * Render fees section with multiple tiers
     */
    renderFeesSection(fees) {
        return `
            <div class="fees-section ${fees.isFallback ? 'fallback' : ''}">
                <div class="stat-header">
                    <span class="stat-icon">⚡</span>
                    <span class="stat-label">Transaction Fees</span>
                </div>
                <div class="fee-tiers">
                    <div class="fee-tier fast">
                        <div class="tier-label">Fast</div>
                        <div class="tier-value">${fees.fastest || fees.fastestFee} sat/vB</div>
                        <div class="tier-time">~10 min</div>
                    </div>
                    <div class="fee-tier medium">
                        <div class="tier-label">Medium</div>
                        <div class="tier-value">${fees.halfHour || fees.hour || fees.hourFee} sat/vB</div>
                        <div class="tier-time">~30 min</div>
                    </div>
                    <div class="fee-tier economy">
                        <div class="tier-label">Economy</div>
                        <div class="tier-value">${fees.economy || fees.economyFee || fees.minimum || 1} sat/vB</div>
                        <div class="tier-time">~1 hour+</div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render error state
     */
    renderError() {
        this.container.innerHTML = `
            <div class="network-stats-widget error">
                <div class="error-icon">⚠️</div>
                <div class="error-message">Unable to load network statistics</div>
                <button class="retry-button" onclick="this.fetchData()">Retry</button>
            </div>
        `;
    }

    /**
     * Get trend for a metric
     */
    getTrend(metric) {
        if (!this.config.showTrends || !this.previousData || !this.data) {
            return null;
        }

        const current = this.data[metric];
        const previous = this.previousData[metric];

        if (!current || !previous || current.isFallback || previous.isFallback) {
            return null;
        }

        let currentValue, previousValue;

        switch (metric) {
            case 'blockHeight':
                currentValue = current.height;
                previousValue = previous.height;
                break;
            case 'hashrate':
                currentValue = current.current;
                previousValue = previous.current;
                break;
            case 'difficulty':
                currentValue = current.difficulty;
                previousValue = previous.difficulty;
                break;
            case 'mempool':
                currentValue = current.count;
                previousValue = previous.count;
                break;
            default:
                return null;
        }

        if (currentValue > previousValue) return 'up';
        if (currentValue < previousValue) return 'down';
        return 'stable';
    }

    /**
     * Get trend icon
     */
    getTrendIcon(trend) {
        switch (trend) {
            case 'up': return '▲';
            case 'down': return '▼';
            case 'stable': return '●';
            default: return '';
        }
    }

    /**
     * Format large numbers with separators
     */
    formatNumber(num) {
        return new Intl.NumberFormat('en-US').format(num);
    }

    /**
     * Format hash rate (EH/s)
     */
    formatHashRate(hashrate) {
        const eh = hashrate / 1e18;
        return `${eh.toFixed(2)} EH/s`;
    }

    /**
     * Format difficulty
     */
    formatDifficulty(difficulty) {
        if (difficulty >= 1e12) {
            return `${(difficulty / 1e12).toFixed(2)}T`;
        }
        return this.formatNumber(difficulty);
    }

    /**
     * Format bytes (MB/GB)
     */
    formatBytes(bytes) {
        if (bytes >= 1e9) {
            return `${(bytes / 1e9).toFixed(1)} GB`;
        } else if (bytes >= 1e6) {
            return `${(bytes / 1e6).toFixed(1)} MB`;
        }
        return `${(bytes / 1e3).toFixed(0)} KB`;
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
    module.exports = NetworkStats;
}

// Make available globally if in browser
if (typeof window !== 'undefined') {
    window.NetworkStats = NetworkStats;
}
