/**
 * Robust Bitcoin Data Fetching System
 * Multi-source APIs with automatic fallbacks and caching
 * Version: 2.0.0
 * 
 * Primary APIs:
 * - CoinGecko (price, ATH, historical)
 * - mempool.space (blocks, mempool, fees)
 * - CoinDesk (price backup)
 * 
 * Features:
 * - Multiple fallbacks for each data point
 * - Smart caching (30-60s for live data, 1h for historical)
 * - Rate limit protection
 * - Graceful degradation
 */

(function() {
    'use strict';

    class BitcoinDataService {
        constructor() {
            this.cache = new Map();
            this.cacheExpiry = new Map();
            
            // Cache durations (milliseconds)
            this.cacheDurations = {
                price: 30000,          // 30 seconds
                blockHeight: 300000,   // 5 minutes
                mempool: 60000,        // 1 minute
                fees: 60000,           // 1 minute
                difficulty: 600000,    // 10 minutes
                ath: 3600000,          // 1 hour
                historical: 86400000   // 24 hours
            };
            
            // Request timeout
            this.timeout = 10000; // 10 seconds
            
            // Genesis date for calculations
            this.genesisDate = new Date('2009-01-03T00:00:00Z');
            
            this.log('BitcoinDataService initialized');
        }
        
        log(message, level = 'info') {
            const prefix = '[BitcoinData]';
            if (level === 'error') console.error(prefix, message);
            else if (level === 'warn') console.warn(prefix, message);
            else console.log(prefix, message);
        }
        
        /**
         * Check if cached data is still valid
         */
        isValidCache(key) {
            if (!this.cache.has(key)) return false;
            const expiry = this.cacheExpiry.get(key);
            return expiry && Date.now() < expiry;
        }
        
        /**
         * Set cache with expiry
         */
        setCache(key, value, duration) {
            this.cache.set(key, value);
            this.cacheExpiry.set(key, Date.now() + duration);
        }
        
        /**
         * Fetch with timeout and error handling
         */
        async fetchWithTimeout(url, options = {}) {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);
            
            try {
                const response = await fetch(url, {
                    ...options,
                    signal: controller.signal,
                    headers: {
                        'Accept': 'application/json',
                        ...options.headers
                    }
                });
                
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    return await response.json();
                }
                return await response.text();
                
            } catch (error) {
                clearTimeout(timeoutId);
                throw error;
            }
        }
        
        /**
         * Get current BTC price with multiple fallbacks
         */
        async getPrice() {
            const cacheKey = 'price';
            if (this.isValidCache(cacheKey)) {
                return this.cache.get(cacheKey);
            }
            
            const sources = [
                {
                    name: 'CoinGecko',
                    url: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true',
                    parse: (data) => ({
                        price: Math.round(data.bitcoin.usd),
                        change24h: data.bitcoin.usd_24h_change || 0
                    })
                },
                {
                    name: 'Coinbase',
                    url: 'https://api.coinbase.com/v2/prices/BTC-USD/spot',
                    parse: (data) => ({
                        price: Math.round(parseFloat(data.data.amount)),
                        change24h: null
                    })
                },
                {
                    name: 'CoinDesk',
                    url: 'https://api.coindesk.com/v1/bpi/currentprice/BTC.json',
                    parse: (data) => ({
                        price: Math.round(data.bpi.USD.rate_float),
                        change24h: null
                    })
                },
                {
                    name: 'Blockchain.info',
                    url: 'https://blockchain.info/ticker',
                    parse: (data) => ({
                        price: Math.round(data.USD.last),
                        change24h: null
                    })
                }
            ];
            
            for (const source of sources) {
                try {
                    const data = await this.fetchWithTimeout(source.url);
                    const result = source.parse(data);
                    
                    if (result.price > 0) {
                        this.setCache(cacheKey, result, this.cacheDurations.price);
                        this.log(`Price fetched from ${source.name}: $${result.price.toLocaleString()}`);
                        return result;
                    }
                } catch (error) {
                    this.log(`${source.name} price failed: ${error.message}`, 'warn');
                }
            }
            
            this.log('All price sources failed', 'error');
            return { price: null, change24h: null };
        }
        
        /**
         * Get all-time high with date
         */
        async getATH() {
            const cacheKey = 'ath';
            if (this.isValidCache(cacheKey)) {
                return this.cache.get(cacheKey);
            }
            
            try {
                const data = await this.fetchWithTimeout(
                    'https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false'
                );
                
                const result = {
                    price: Math.round(data.market_data.ath.usd),
                    date: new Date(data.market_data.ath_date.usd)
                };
                
                this.setCache(cacheKey, result, this.cacheDurations.ath);
                this.log(`ATH fetched: $${result.price.toLocaleString()} on ${result.date.toLocaleDateString()}`);
                return result;
                
            } catch (error) {
                this.log(`ATH fetch failed: ${error.message}`, 'error');
                // Fallback to known ATH
                return {
                    price: 108135,
                    date: new Date('2024-12-17')
                };
            }
        }
        
        /**
         * Get block height with fallbacks
         */
        async getBlockHeight() {
            const cacheKey = 'blockHeight';
            if (this.isValidCache(cacheKey)) {
                return this.cache.get(cacheKey);
            }
            
            const sources = [
                {
                    name: 'mempool.space',
                    url: 'https://mempool.space/api/blocks/tip/height',
                    parse: (data) => parseInt(data, 10)
                },
                {
                    name: 'Blockstream',
                    url: 'https://blockstream.info/api/blocks/tip/height',
                    parse: (data) => parseInt(data, 10)
                },
                {
                    name: 'Blockchain.info',
                    url: 'https://blockchain.info/q/getblockcount',
                    parse: (data) => parseInt(data, 10)
                }
            ];
            
            for (const source of sources) {
                try {
                    const data = await this.fetchWithTimeout(source.url);
                    const height = source.parse(data);
                    
                    if (height > 0) {
                        this.setCache(cacheKey, height, this.cacheDurations.blockHeight);
                        this.log(`Block height from ${source.name}: ${height.toLocaleString()}`);
                        return height;
                    }
                } catch (error) {
                    this.log(`${source.name} block height failed: ${error.message}`, 'warn');
                }
            }
            
            this.log('All block height sources failed', 'error');
            return null;
        }
        
        /**
         * Calculate halvings completed from block height
         */
        getHalvingsCompleted(blockHeight) {
            if (!blockHeight) return null;
            return Math.floor(blockHeight / 210000);
        }
        
        /**
         * Calculate days since genesis
         */
        getDaysSinceGenesis() {
            const now = new Date();
            const diffMs = now - this.genesisDate;
            return Math.floor(diffMs / (1000 * 60 * 60 * 24));
        }
        
        /**
         * Get mempool data
         */
        async getMempoolData() {
            const cacheKey = 'mempool';
            if (this.isValidCache(cacheKey)) {
                return this.cache.get(cacheKey);
            }
            
            const sources = [
                {
                    name: 'mempool.space',
                    url: 'https://mempool.space/api/mempool',
                    parse: (data) => ({
                        count: data.count,
                        vsize: data.vsize,
                        totalFee: data.total_fee
                    })
                },
                {
                    name: 'Blockchain.info',
                    url: 'https://blockchain.info/q/unconfirmedcount',
                    parse: (data) => ({
                        count: parseInt(data, 10),
                        vsize: null,
                        totalFee: null
                    })
                }
            ];
            
            for (const source of sources) {
                try {
                    const data = await this.fetchWithTimeout(source.url);
                    const result = source.parse(data);
                    
                    if (result.count > 0) {
                        this.setCache(cacheKey, result, this.cacheDurations.mempool);
                        this.log(`Mempool from ${source.name}: ${result.count.toLocaleString()} tx`);
                        return result;
                    }
                } catch (error) {
                    this.log(`${source.name} mempool failed: ${error.message}`, 'warn');
                }
            }
            
            return { count: null, vsize: null, totalFee: null };
        }
        
        /**
         * Get recommended fees
         */
        async getFees() {
            const cacheKey = 'fees';
            if (this.isValidCache(cacheKey)) {
                return this.cache.get(cacheKey);
            }
            
            try {
                const data = await this.fetchWithTimeout('https://mempool.space/api/v1/fees/recommended');
                
                const result = {
                    fastest: data.fastestFee,
                    halfHour: data.halfHourFee,
                    hour: data.hourFee,
                    economy: data.economyFee,
                    minimum: data.minimumFee
                };
                
                this.setCache(cacheKey, result, this.cacheDurations.fees);
                this.log(`Fees: ${result.fastest} sat/vB (fastest)`);
                return result;
                
            } catch (error) {
                this.log(`Fee fetch failed: ${error.message}`, 'error');
                return { fastest: null, halfHour: null, hour: null, economy: null, minimum: null };
            }
        }
        
        /**
         * Get difficulty and adjustment data
         */
        async getDifficulty() {
            const cacheKey = 'difficulty';
            if (this.isValidCache(cacheKey)) {
                return this.cache.get(cacheKey);
            }
            
            try {
                const data = await this.fetchWithTimeout('https://mempool.space/api/v1/difficulty-adjustment');
                
                const result = {
                    difficulty: data.difficulty,
                    progressPercent: data.progressPercent,
                    remainingBlocks: data.remainingBlocks,
                    estimatedRetargetDate: data.estimatedRetargetDate
                };
                
                this.setCache(cacheKey, result, this.cacheDurations.difficulty);
                this.log(`Difficulty: ${(result.difficulty / 1e12).toFixed(2)}T`);
                return result;
                
            } catch (error) {
                this.log(`Difficulty fetch failed: ${error.message}`, 'error');
                return { difficulty: null, progressPercent: null, remainingBlocks: null };
            }
        }
        
        /**
         * Get historical price for a specific date (for gain calculations)
         */
        async getHistoricalPrice(date) {
            const cacheKey = `historical_${date}`;
            if (this.isValidCache(cacheKey)) {
                return this.cache.get(cacheKey);
            }
            
            try {
                // CoinGecko format: DD-MM-YYYY
                const formattedDate = date.split('-').reverse().join('-');
                const data = await this.fetchWithTimeout(
                    `https://api.coingecko.com/api/v3/coins/bitcoin/history?date=${formattedDate}`
                );
                
                const price = data.market_data?.current_price?.usd;
                if (price) {
                    this.setCache(cacheKey, price, this.cacheDurations.historical);
                    this.log(`Historical price for ${date}: $${price.toFixed(2)}`);
                    return price;
                }
            } catch (error) {
                this.log(`Historical price fetch failed: ${error.message}`, 'error');
            }
            
            // Fallback: known Feb 2011 price when BTC first hit $1
            if (date === '09-02-2011') {
                return 1.0;
            }
            
            return null;
        }
        
        /**
         * Calculate gain from $1 (Feb 2011)
         */
        async getGainFromDollar() {
            try {
                const [currentPrice, historicalPrice] = await Promise.all([
                    this.getPrice(),
                    this.getHistoricalPrice('09-02-2011')
                ]);
                
                if (currentPrice.price && historicalPrice) {
                    const multiple = currentPrice.price / historicalPrice;
                    return {
                        multiple: multiple,
                        percentage: ((multiple - 1) * 100).toFixed(0),
                        formatted: `${Math.round(multiple)}x`
                    };
                }
            } catch (error) {
                this.log(`Gain calculation failed: ${error.message}`, 'error');
            }
            
            return { multiple: null, percentage: null, formatted: null };
        }
        
        /**
         * Update all DOM elements with fresh data
         */
        async updateAllData() {
            this.log('Starting data update...');
            
            try {
                // Fetch all data in parallel
                const [
                    priceData,
                    athData,
                    blockHeight,
                    mempoolData,
                    fees,
                    difficulty
                ] = await Promise.all([
                    this.getPrice(),
                    this.getATH(),
                    this.getBlockHeight(),
                    this.getMempoolData(),
                    this.getFees(),
                    this.getDifficulty()
                ]);
                
                // Update price
                if (priceData.price) {
                    const priceStr = `$${priceData.price.toLocaleString()}`;
                    this.updateElement('btc-price', priceStr);
                    this.updateElement('bar-btc-price', priceStr);
                    
                    if (priceData.change24h !== null) {
                        const changeEl = document.getElementById('btc-change');
                        if (changeEl) {
                            const isPositive = priceData.change24h >= 0;
                            changeEl.textContent = `${isPositive ? '+' : ''}${priceData.change24h.toFixed(2)}% (24h)`;
                            changeEl.className = `data-change ${isPositive ? 'positive' : 'negative'}`;
                        }
                    }
                }
                
                // Update ATH
                if (athData.price) {
                    this.updateElement('ath-price', `$${athData.price.toLocaleString()}`);
                    this.updateElement('ath-date', athData.date.toLocaleDateString());
                }
                
                // Update block height
                if (blockHeight) {
                    const heightStr = blockHeight.toLocaleString();
                    this.updateElement('block-height', heightStr);
                    this.updateElement('bar-block-height', heightStr);
                    
                    // Update halvings
                    const halvings = this.getHalvingsCompleted(blockHeight);
                    if (halvings !== null) {
                        this.updateElement('halvings-completed', halvings.toString());
                    }
                }
                
                // Update days since genesis
                const days = this.getDaysSinceGenesis();
                this.updateElement('days-since-genesis', days.toLocaleString());
                
                // Update mempool
                if (mempoolData.count) {
                    const mempoolStr = `${mempoolData.count.toLocaleString()} tx`;
                    this.updateElement('mempool-size', mempoolStr);
                    this.updateElement('bar-mempool-count', mempoolStr);
                }
                
                // Update fees
                if (fees.fastest) {
                    this.updateElement('bar-fee-estimate', `${fees.fastest} sat/vB`);
                    this.updateElement('fee-fastest', `${fees.fastest} sat/vB`);
                }
                if (fees.hour) {
                    this.updateElement('fee-hour', `${fees.hour} sat/vB`);
                }
                if (fees.economy) {
                    this.updateElement('fee-economy', `${fees.economy} sat/vB`);
                }
                
                // Update difficulty
                if (difficulty.difficulty) {
                    const diffStr = (difficulty.difficulty / 1e12).toFixed(2) + 'T';
                    this.updateElement('bar-difficulty', diffStr);
                    this.updateElement('difficulty', diffStr);
                }
                
                this.log('Data update complete');
                
            } catch (error) {
                this.log(`Data update error: ${error.message}`, 'error');
            }
        }
        
        /**
         * Helper to safely update DOM elements
         */
        updateElement(id, text) {
            const el = document.getElementById(id);
            if (el && text !== null && text !== undefined) {
                el.textContent = text;
            }
        }
    }
    
    // Initialize and expose globally
    window.BitcoinDataService = BitcoinDataService;
    
    // Auto-initialize if DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBitcoinData);
    } else {
        initBitcoinData();
    }
    
    function initBitcoinData() {
        const dataService = new BitcoinDataService();
        window.bitcoinData = dataService;
        
        // Initial update
        dataService.updateAllData();
        
        // Update every 60 seconds
        setInterval(() => dataService.updateAllData(), 60000);
        
        console.log('[BitcoinData] Service ready. Access via window.bitcoinData');
    }
    
})();
