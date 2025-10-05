/**
 * Bitcoin MCP Agent Kit Client
 * Connects website to production-ready Bitcoin MCP agents
 */

class BitcoinMCPClient {
    constructor() {
        // Prefer env override if provided via ?mcp=http://host:port or window.__MCP_BASE__
        const urlParam = (typeof window !== 'undefined') ? new URLSearchParams(window.location.search).get('mcp') : null;
        this.baseURL = (window && window.__MCP_BASE__) || urlParam || 'http://localhost:3000'; // Default to MCP web server
        this.cache = new Map();
        this.cacheTimeout = 60000; // 1 minute cache
        this.retryAttempts = 3;
        this.retryDelay = 1000;
        this.isConnected = false;
        this.eventListeners = new Map();
        
        this.initialize();
    }

    async initialize() {
        console.log('Initializing Bitcoin MCP Client...');
        await this.testConnection();
        this.setupHeartbeat();
    }

    /**
     * Test connection to MCP Agent Kit
     */
    async testConnection() {
        try {
            const response = await this.makeRequest('/api/health', 'GET');
            if (response && (response.status === 'ok' || response.status === 'healthy' || response.success)) {
                this.isConnected = true;
                console.log('✅ Connected to Bitcoin MCP Agent Kit at', this.baseURL);
                this.emit('connected');
            }
        } catch (error) {
            console.warn('⚠️ MCP Agent Kit not available, using fallback mode');
            this.isConnected = false;
            this.emit('disconnected');
        }
    }

    /**
     * Setup heartbeat to monitor connection
     */
    setupHeartbeat() {
        setInterval(async () => {
            if (!this.isConnected) {
                await this.testConnection();
            }
        }, 30000); // Check every 30 seconds
    }

    /**
     * Make HTTP request with retry logic and caching
     */
    async makeRequest(endpoint, method = 'GET', data = null, skipCache = false) {
        const cacheKey = `${method}:${endpoint}:${JSON.stringify(data)}`;
        
        // Check cache first
        if (!skipCache && method === 'GET' && this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }

        let lastError;
        
        for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
            try {
                const requestOptions = {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                };

                if (data && method !== 'GET') {
                    requestOptions.body = JSON.stringify(data);
                }

                const response = await fetch(`${this.baseURL}${endpoint}`, requestOptions);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const result = await response.json();
                
                // Cache successful GET requests
                if (method === 'GET') {
                    this.cache.set(cacheKey, {
                        data: result,
                        timestamp: Date.now()
                    });
                }

                return result;
                
            } catch (error) {
                lastError = error;
                console.warn(`Attempt ${attempt}/${this.retryAttempts} failed:`, error.message);
                
                if (attempt < this.retryAttempts) {
                    await this.delay(this.retryDelay * attempt);
                }
            }
        }

        throw lastError;
    }

    /**
     * Get live Bitcoin network data
     */
    async getBitcoinNetworkData() {
        try {
            const data = await this.makeRequest('/api/bitcoin/network-status');
            return {
                blockHeight: data.blockHeight || 'N/A',
                mempoolSize: data.mempoolSize || 'N/A',
                feeEstimate: data.feeEstimate || 'N/A',
                difficulty: data.difficulty || 'N/A',
                price: data.price || 'N/A'
            };
        } catch (error) {
            console.error('Failed to get network data:', error);
            return this.getFallbackNetworkData();
        }
    }

    /**
     * Get Bitcoin price data
     */
    async getBitcoinPrice() {
        try {
            const res = await this.makeRequest('/api/bitcoin/price');
            // Support both {success,data:{price_usd}} and coingecko-style shapes
            const data = res?.data || res || {};
            const usd = data.price_usd ?? data.usd ?? data.price ?? data.bitcoin?.usd;
            const change24h = data.usd_24h_change ?? data.change24h ?? 0;
            return { usd: usd ?? 'N/A', change24h };
        } catch (error) {
            console.error('Failed to get price data:', error);
            return { usd: 'N/A', change24h: 0 };
        }
    }

    /**
     * Get mempool fee estimates
     */
    async getFeeEstimates() {
        try {
            const res = await this.makeRequest('/api/bitcoin/fees');
            const data = res?.data || res || {};
            const est = data.estimates || data;
            return {
                fastest: est.fastestFee ?? est.fastest ?? 'N/A',
                fast: est.halfHourFee ?? est.fast ?? 'N/A',
                medium: est.hourFee ?? est.medium ?? 'N/A',
                slow: est.economyFee ?? est.slow ?? 'N/A',
                congestion: data.congestion ?? undefined
            };
        } catch (error) {
            console.error('Failed to get fee estimates:', error);
            return { fastest: 'N/A', fast: 'N/A', medium: 'N/A', slow: 'N/A' };
        }
    }

    /**
     * Generate Socratic course using MCP agents
     */
    async generateCourse(options) {
        try {
            const payload = {
                topic: options.topic,
                audience: options.level || 'beginner',
                duration: options.duration || 3,
                style: 'socratic',
                includeSimulations: true,
                includeAssessments: true
            };

            const course = await this.makeRequest('/api/course/generate', 'POST', payload, true);
            return this.formatCourseData(course);
        } catch (error) {
            console.error('Failed to generate course:', error);
            return this.getFallbackCourse(options);
        }
    }

    /**
     * Get Bitcoin intelligence summary
     */
    async getIntelligenceSummary() {
        try {
            // Prefer dedicated endpoint if present; otherwise synthesize from news
            const res = await this.makeRequest('/api/intelligence/summary');
            const data = res?.data || res || {};
            return {
                totalAlerts: data.total_alerts || 0,
                criticalAlerts: data.critical_alerts || [],
                educationalOpportunities: data.educational_opportunities || [],
                marketIntelligence: data.market_intelligence || [],
                lastUpdated: data.generated_at || new Date().toISOString()
            };
        } catch (_) {
            try {
                const news = await this.getNews('bitcoin', 20);
                return {
                    totalAlerts: news.headlines?.length || 0,
                    criticalAlerts: [],
                    educationalOpportunities: [],
                    marketIntelligence: [{ title: 'News sentiment', sentiment: news.sentiment?.overall }],
                    lastUpdated: new Date().toISOString()
                };
            } catch (error) {
                console.error('Failed to get intelligence:', error);
                return this.getFallbackIntelligence();
            }
        }
    }

    /**
     * Validate Bitcoin address
     */
    async validateAddress(address) {
        try {
            const data = await this.makeRequest(`/api/tools/validate-address?address=${encodeURIComponent(address)}`);
            return {
                isValid: data.isValid || false,
                type: data.type || 'Unknown',
                network: data.network || 'Unknown',
                details: data.details || {}
            };
        } catch (error) {
            console.error('Failed to validate address:', error);
            return { isValid: false, type: 'Error', network: 'Unknown', details: {} };
        }
    }

    /**
     * Convert Bitcoin units
     */
    convertUnits(amount, fromUnit, toUnit) {
        const satoshisPerBTC = 100000000;
        const conversions = {
            'btc': {
                'sats': amount * satoshisPerBTC,
                'mbtc': amount * 1000,
                'btc': amount
            },
            'sats': {
                'btc': amount / satoshisPerBTC,
                'mbtc': amount / 100000,
                'sats': amount
            },
            'mbtc': {
                'btc': amount / 1000,
                'sats': amount * 100000,
                'mbtc': amount
            }
        };

        return conversions[fromUnit]?.[toUnit] || 0;
    }

    /**
     * Explore Bitcoin transaction
     */
    async getNews(query = 'bitcoin', limit = 10) {
        const res = await this.makeRequest(`/api/news?query=${encodeURIComponent(query)}&limit=${limit}`);
        return res?.data || res || {};
    }

    async exploreTransaction(txid) {
        try {
            const data = await this.makeRequest(`/api/tools/transaction?txid=${encodeURIComponent(txid)}`);
            return {
                txid: data.txid || txid,
                blockHeight: data.block_height || 'Unconfirmed',
                fee: data.fee || 'N/A',
                size: data.size || 'N/A',
                inputs: data.inputs || [],
                outputs: data.outputs || [],
                confirmations: data.confirmations || 0
            };
        } catch (error) {
            console.error('Failed to explore transaction:', error);
            return { error: 'Failed to load transaction data' };
        }
    }

    /**
     * Load simulation data
     */
    async loadSimulation(type) {
        try {
            const data = await this.makeRequest(`/api/simulations/${type}`, 'GET', null, true);
            return data;
        } catch (error) {
            console.error(`Failed to load ${type} simulation:`, error);
            return this.getFallbackSimulation(type);
        }
    }

    /**
     * Get Socratic learning module
     */
    async getSocraticModule(moduleName) {
        try {
            const data = await this.makeRequest(`/api/learning/module/${moduleName}`);
            return {
                title: data.title || moduleName,
                questions: data.socratic_questions || [],
                activities: data.hands_on_activities || [],
                assessments: data.assessments || [],
                resources: data.additional_resources || []
            };
        } catch (error) {
            console.error(`Failed to load module ${moduleName}:`, error);
            return this.getFallbackModule(moduleName);
        }
    }

    // === FALLBACK METHODS ===

    getFallbackNetworkData() {
        return {
            blockHeight: '800,000+',
            mempoolSize: '~1,500',
            feeEstimate: '15-25',
            difficulty: 'High',
            price: '$40,000+'
        };
    }

    getFallbackCourse(options) {
        const topics = {
            lightning: {
                title: 'Lightning Network Fundamentals',
                description: 'Learn Bitcoin\'s payment layer',
                modules: ['Lightning Basics', 'Channel Management', 'Routing'],
                duration: '4 hours'
            },
            mining: {
                title: 'Bitcoin Mining Deep Dive', 
                description: 'Understand Bitcoin\'s security model',
                modules: ['Hash Functions', 'Proof of Work', 'Mining Economics'],
                duration: '5 hours'
            }
        };

        return topics[options.topic] || {
            title: 'Bitcoin Fundamentals',
            description: 'Master Bitcoin basics',
            modules: ['What is Bitcoin', 'Digital Scarcity', 'Network Security'],
            duration: '3 hours'
        };
    }

    getFallbackIntelligence() {
        return {
            totalAlerts: 0,
            criticalAlerts: [],
            educationalOpportunities: [
                { title: 'Interactive Transaction Visualizer', source: 'Learn Me A Bitcoin' }
            ],
            marketIntelligence: [
                { title: 'Bitcoin Adoption Growing', sentiment: 'positive' }
            ],
            lastUpdated: new Date().toISOString()
        };
    }

    getFallbackSimulation(type) {
        const simulations = {
            transaction: {
                title: 'Transaction Builder',
                description: 'Build Bitcoin transactions step by step',
                interface: 'interactive'
            },
            fees: {
                title: 'Fee Calculator',
                description: 'Calculate optimal transaction fees',
                interface: 'calculator'
            },
            security: {
                title: 'Security Trainer',
                description: 'Practice Bitcoin security scenarios',
                interface: 'guided'
            }
        };

        return simulations[type] || { title: 'Simulation', description: 'Learning simulation' };
    }

    getFallbackModule(moduleName) {
        const modules = {
            fundamentals: {
                title: 'Bitcoin Fundamentals',
                questions: [
                    'What problem does Bitcoin solve?',
                    'How does Bitcoin create digital scarcity?',
                    'Why is Bitcoin often called "digital gold"?'
                ],
                activities: [
                    'Explore a Bitcoin block explorer',
                    'Calculate Bitcoin\'s total supply',
                    'Compare Bitcoin to traditional money'
                ]
            },
            transactions: {
                title: 'Transaction Mechanics',
                questions: [
                    'What is a UTXO?',
                    'How do transaction fees work?',
                    'What happens when you send Bitcoin?'
                ],
                activities: [
                    'Analyze a real Bitcoin transaction',
                    'Calculate transaction fees',
                    'Understand different address types'
                ]
            },
            security: {
                title: 'Security & Custody',
                questions: [
                    'What is a private key?',
                    'How do seed phrases work?',
                    'What are the risks of poor security?'
                ],
                activities: [
                    'Generate a test wallet',
                    'Practice seed phrase security',
                    'Identify security threats'
                ]
            }
        };

        return modules[moduleName] || modules.fundamentals;
    }

    // === UTILITY METHODS ===

    formatCourseData(course) {
        return {
            id: course.course_id || Date.now(),
            title: course.title || 'Bitcoin Course',
            description: course.description || 'Learn Bitcoin concepts',
            modules: course.modules || [],
            duration: course.estimated_duration || '3 hours',
            difficulty: course.difficulty || 'beginner',
            createdAt: new Date().toISOString()
        };
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // === EVENT SYSTEM ===

    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }

    emit(event, data = null) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Event listener error for ${event}:`, error);
                }
            });
        }
    }

    // === CLEANUP ===

    clearCache() {
        this.cache.clear();
        console.log('MCP Client cache cleared');
    }
}

// Initialize global MCP client
window.mcpClient = new BitcoinMCPClient();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BitcoinMCPClient;
}