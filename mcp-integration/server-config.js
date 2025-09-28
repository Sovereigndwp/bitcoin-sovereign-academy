/**
 * MCP Agent Kit Server Configuration
 * Production-ready configuration for Bitcoin Sovereign Academy
 */

const MCPServerConfig = {
    // Server Settings
    server: {
        development: {
            host: 'localhost',
            port: 8080,
            protocol: 'http'
        },
        production: {
            host: 'api.bitcoinsovereign.academy',
            port: 443,
            protocol: 'https'
        },
        staging: {
            host: 'staging-api.bitcoinsovereign.academy',
            port: 443,
            protocol: 'https'
        }
    },

    // API Endpoints Configuration
    endpoints: {
        // Health & Status
        health: '/health',
        status: '/status',
        
        // Bitcoin Network Data
        networkStatus: '/api/bitcoin/network-status',
        price: '/api/bitcoin/price',
        fees: '/api/bitcoin/fees',
        mempool: '/api/bitcoin/mempool',
        blocks: '/api/bitcoin/blocks',
        
        // Educational Content
        courseGenerate: '/api/course/generate',
        courseList: '/api/course/list',
        moduleGet: '/api/learning/module/:name',
        
        // AI Agents
        agents: {
            story: '/api/agents/story',
            visual: '/api/agents/visual',
            debate: '/api/agents/debate',
            scenario: '/api/agents/scenario',
            advisor: '/api/agents/advisor',
            poetry: '/api/agents/poetry',
            timeMachine: '/api/agents/time-machine',
            philosophy: '/api/agents/philosophy'
        },
        
        // Intelligence & Analytics
        intelligenceSummary: '/api/intelligence/summary',
        alerts: '/api/intelligence/alerts',
        insights: '/api/intelligence/insights',
        
        // Tools & Utilities
        validateAddress: '/api/tools/validate-address',
        exploreTransaction: '/api/tools/transaction',
        convertUnits: '/api/tools/convert',
        
        // Simulations
        simulations: '/api/simulations/:type',
        simulationsList: '/api/simulations/list'
    },

    // Authentication Configuration
    auth: {
        enabled: false, // Set to true for production
        type: 'bearer', // 'bearer' or 'api-key'
        headerName: 'Authorization',
        apiKeyHeader: 'X-API-Key'
    },

    // CORS Configuration
    cors: {
        enabled: true,
        origins: [
            'http://localhost:8010',
            'http://localhost:8080',
            'https://bitcoinsovereign.academy',
            'https://www.bitcoinsovereign.academy',
            'https://sovereigndwp.github.io'
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        headers: ['Content-Type', 'Authorization', 'X-API-Key'],
        credentials: true
    },

    // Rate Limiting
    rateLimit: {
        enabled: true,
        windowMs: 60000, // 1 minute
        maxRequests: 100, // per window
        message: 'Too many requests, please try again later'
    },

    // Caching Configuration
    cache: {
        enabled: true,
        ttl: {
            default: 60, // seconds
            networkData: 30,
            priceData: 60,
            courseData: 3600,
            staticContent: 86400
        }
    },

    // WebSocket Configuration (for real-time updates)
    websocket: {
        enabled: true,
        path: '/ws',
        pingInterval: 30000,
        reconnectDelay: 5000,
        maxReconnectAttempts: 10
    },

    // Data Sources
    dataSources: {
        blockchain: {
            mempool: 'https://mempool.space/api',
            blockstream: 'https://blockstream.info/api',
            fallback: 'https://blockchain.info'
        },
        price: {
            coingecko: 'https://api.coingecko.com/api/v3',
            coinbase: 'https://api.coinbase.com/v2'
        },
        educational: {
            learnmeabitcoin: 'https://learnmeabitcoin.com',
            bitcoinOrg: 'https://bitcoin.org',
            lookingGlass: 'https://lookingglasseducation.com'
        }
    },

    // Error Handling
    errors: {
        showStack: false, // Set to true in development
        logErrors: true,
        errorFile: './logs/errors.log'
    },

    // Performance Monitoring
    monitoring: {
        enabled: true,
        metrics: ['responseTime', 'requestCount', 'errorRate'],
        alertThresholds: {
            responseTime: 1000, // ms
            errorRate: 0.05 // 5%
        }
    },

    // Feature Flags
    features: {
        aiAgents: true,
        realTimeData: true,
        advancedSimulations: true,
        socialFeatures: false,
        gamification: false,
        nftIntegration: false
    },

    // Environment Detection
    getEnvironment() {
        if (typeof process !== 'undefined' && process.env) {
            return process.env.NODE_ENV || 'development';
        }
        if (typeof window !== 'undefined') {
            const hostname = window.location.hostname;
            if (hostname === 'localhost' || hostname === '127.0.0.1') {
                return 'development';
            }
            if (hostname.includes('staging')) {
                return 'staging';
            }
            return 'production';
        }
        return 'development';
    },

    // Get current server configuration
    getCurrentServer() {
        const env = this.getEnvironment();
        return this.server[env] || this.server.development;
    },

    // Build full URL for an endpoint
    buildUrl(endpoint, params = {}) {
        const server = this.getCurrentServer();
        let url = `${server.protocol}://${server.host}`;
        
        if (server.port && 
            !(server.protocol === 'http' && server.port === 80) &&
            !(server.protocol === 'https' && server.port === 443)) {
            url += `:${server.port}`;
        }

        // Handle parameterized endpoints
        let finalEndpoint = endpoint;
        for (const [key, value] of Object.entries(params)) {
            finalEndpoint = finalEndpoint.replace(`:${key}`, value);
        }

        return url + finalEndpoint;
    },

    // Validate configuration
    validate() {
        const errors = [];

        // Check server configuration
        if (!this.server.development.host) {
            errors.push('Development server host is required');
        }

        // Check CORS origins in production
        const env = this.getEnvironment();
        if (env === 'production' && !this.auth.enabled) {
            errors.push('Authentication should be enabled in production');
        }

        // Check data sources
        if (!this.dataSources.blockchain.mempool) {
            errors.push('Blockchain data source is required');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MCPServerConfig;
}

// Make available globally in browser
if (typeof window !== 'undefined') {
    window.MCPServerConfig = MCPServerConfig;
}