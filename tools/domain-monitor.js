#!/usr/bin/env node

/**
 * Bitcoin Sovereign Academy - Domain Monitor
 * Continuous monitoring for domain health, SSL certificates, and performance
 */

import fs from 'fs/promises';
import path from 'path';
import https from 'https';
import dns from 'dns/promises';
import { EventEmitter } from 'events';
import DomainConfigTool from './domain-config.js';

class DomainMonitor extends EventEmitter {
    constructor(config = {}) {
        super();
        
        this.config = {
            domains: {
                primary: 'bitcoinsovereign.academy',
                alternatives: [
                    'bitcoinsovereign.education',
                    'btcsovereign.academy',
                    'learnbitcoin.academy'
                ]
            },
            monitoring: {
                interval: 5 * 60 * 1000,  // 5 minutes
                retryAttempts: 3,
                retryDelay: 10000,  // 10 seconds
                timeout: 30000  // 30 seconds
            },
            thresholds: {
                responseTime: 5000,  // ms
                certificateExpiry: 7,  // days warning
                certificateCritical: 1,  // days critical
                uptime: 95.0,  // percentage
                errorRate: 10.0  // percentage
            },
            alerts: {
                enabled: true,
                channels: ['console', 'file', 'webhook'],
                webhook: {
                    url: null,  // Set to enable webhook alerts
                    timeout: 10000
                },
                email: {
                    enabled: false,
                    smtp: null  // SMTP configuration
                }
            },
            storage: {
                directory: 'monitoring-data',
                retentionDays: 30
            },
            ...config
        };

        this.state = {
            running: false,
            startTime: null,
            lastCheck: null,
            results: new Map(),
            alerts: [],
            metrics: {
                totalChecks: 0,
                successfulChecks: 0,
                failedChecks: 0,
                averageResponseTime: 0
            }
        };

        this.domainTool = new DomainConfigTool();
        this.intervals = new Map();
    }

    /**
     * Start monitoring
     */
    async start() {
        if (this.state.running) {
            console.log('⚠️ Monitoring is already running');
            return;
        }

        console.log('🚀 Starting Bitcoin Sovereign Academy Domain Monitor\n');
        
        this.state.running = true;
        this.state.startTime = new Date();
        
        // Create storage directory
        await this.ensureStorageDirectory();
        
        // Load historical data
        await this.loadHistoricalData();
        
        // Start monitoring each domain
        const domains = [this.config.domains.primary, ...this.config.domains.alternatives];
        
        for (const domain of domains) {
            await this.startDomainMonitoring(domain);
        }

        // Start cleanup routine
        this.startCleanupRoutine();

        console.log(`✅ Monitoring started for ${domains.length} domains`);
        console.log(`⏱️ Check interval: ${this.config.monitoring.interval / 1000}s`);
        console.log(`📊 Results will be saved to: ${this.config.storage.directory}/\n`);

        // Emit start event
        this.emit('start', { domains, startTime: this.state.startTime });
    }

    /**
     * Stop monitoring
     */
    async stop() {
        if (!this.state.running) {
            console.log('⚠️ Monitoring is not running');
            return;
        }

        console.log('🛑 Stopping domain monitoring...');
        
        this.state.running = false;
        
        // Clear all intervals
        for (const [domain, intervalId] of this.intervals) {
            clearInterval(intervalId);
            console.log(`   ✅ Stopped monitoring ${domain}`);
        }
        this.intervals.clear();

        // Save final state
        await this.saveState();
        
        const uptime = Date.now() - this.state.startTime.getTime();
        console.log(`📊 Monitoring stopped after ${Math.round(uptime / 1000)}s`);
        
        // Emit stop event
        this.emit('stop', { uptime, metrics: this.state.metrics });
    }

    /**
     * Start monitoring a specific domain
     */
    async startDomainMonitoring(domain) {
        console.log(`📡 Starting monitoring for ${domain}...`);
        
        // Initial check
        await this.checkDomain(domain);
        
        // Schedule recurring checks
        const intervalId = setInterval(async () => {
            if (this.state.running) {
                await this.checkDomain(domain);
            }
        }, this.config.monitoring.interval);
        
        this.intervals.set(domain, intervalId);
        console.log(`   ✅ Monitoring active (${this.config.monitoring.interval / 1000}s interval)`);
    }

    /**
     * Check domain health
     */
    async checkDomain(domain) {
        const checkTime = new Date();
        const result = {
            domain,
            timestamp: checkTime.toISOString(),
            checks: {},
            alerts: [],
            overall: { success: true, issues: [] }
        };

        try {
            this.state.metrics.totalChecks++;
            
            console.log(`🔍 Checking ${domain}... [${checkTime.toLocaleTimeString()}]`);

            // DNS Check
            result.checks.dns = await this.checkDNS(domain);
            
            // SSL Check
            result.checks.ssl = await this.checkSSL(domain);
            
            // Connectivity Check
            result.checks.connectivity = await this.checkConnectivity(domain);
            
            // Performance Check
            result.checks.performance = await this.checkPerformance(domain);

            // Analyze results and generate alerts
            const alerts = this.analyzeResults(result);
            result.alerts = alerts;

            // Update overall status
            const hasFailures = Object.values(result.checks).some(check => !check.success);
            if (hasFailures) {
                result.overall.success = false;
                result.overall.issues = Object.entries(result.checks)
                    .filter(([, check]) => !check.success)
                    .map(([name, check]) => `${name}: ${check.message}`);
                
                this.state.metrics.failedChecks++;
            } else {
                this.state.metrics.successfulChecks++;
            }

            // Store results
            this.storeResult(domain, result);
            
            // Handle alerts
            if (alerts.length > 0) {
                await this.handleAlerts(domain, alerts);
            }

            // Update metrics
            this.updateMetrics(result);

            // Emit result event
            this.emit('check', result);

        } catch (error) {
            console.log(`❌ Error checking ${domain}: ${error.message}`);
            result.overall.success = false;
            result.overall.error = error.message;
            this.state.metrics.failedChecks++;
            
            this.emit('error', { domain, error: error.message, timestamp: checkTime });
        }

        this.state.lastCheck = checkTime;
        return result;
    }

    /**
     * Check DNS resolution
     */
    async checkDNS(domain) {
        try {
            const startTime = Date.now();
            const records = await dns.resolve4(domain);
            const responseTime = Date.now() - startTime;

            // Check if pointing to GitHub Pages
            const githubIPs = [
                '185.199.108.153', '185.199.109.153',
                '185.199.110.153', '185.199.111.153'
            ];
            const isGitHubPages = records.some(ip => githubIPs.includes(ip));

            return {
                success: records.length > 0,
                responseTime,
                records,
                isGitHubPages,
                message: isGitHubPages ? 'DNS OK (GitHub Pages)' : `DNS OK (${records.join(', ')})`
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: `DNS failed: ${error.message}`
            };
        }
    }

    /**
     * Check SSL certificate
     */
    async checkSSL(domain) {
        return new Promise((resolve) => {
            const startTime = Date.now();
            const options = {
                hostname: domain,
                port: 443,
                method: 'HEAD',
                timeout: this.config.monitoring.timeout
            };

            const req = https.request(options, (res) => {
                const responseTime = Date.now() - startTime;
                const cert = res.socket.getPeerCertificate();

                if (!cert || Object.keys(cert).length === 0) {
                    resolve({
                        success: false,
                        responseTime,
                        message: 'No SSL certificate found'
                    });
                    return;
                }

                const now = new Date();
                const validTo = new Date(cert.valid_to);
                const daysToExpiry = Math.ceil((validTo - now) / (1000 * 60 * 60 * 24));

                const isValid = validTo > now;
                const isExpiring = daysToExpiry <= this.config.thresholds.certificateExpiry;
                const isCritical = daysToExpiry <= this.config.thresholds.certificateCritical;

                resolve({
                    success: isValid,
                    responseTime,
                    certificate: {
                        issuer: cert.issuer?.O || 'Unknown',
                        subject: cert.subject?.CN || domain,
                        validTo: cert.valid_to,
                        daysToExpiry,
                        isExpiring,
                        isCritical
                    },
                    message: isValid ? 
                        `SSL OK (expires in ${daysToExpiry} days)` :
                        'SSL certificate expired'
                });
            });

            req.on('error', (error) => {
                resolve({
                    success: false,
                    responseTime: Date.now() - startTime,
                    error: error.message,
                    message: `SSL check failed: ${error.message}`
                });
            });

            req.on('timeout', () => {
                req.destroy();
                resolve({
                    success: false,
                    responseTime: Date.now() - startTime,
                    error: 'Timeout',
                    message: 'SSL check timed out'
                });
            });

            req.end();
        });
    }

    /**
     * Check connectivity
     */
    async checkConnectivity(domain) {
        return new Promise((resolve) => {
            const startTime = Date.now();
            const options = {
                hostname: domain,
                port: 443,
                path: '/',
                method: 'HEAD',
                timeout: this.config.monitoring.timeout,
                headers: {
                    'User-Agent': 'Bitcoin-Sovereign-Academy-Monitor/1.0'
                }
            };

            const req = https.request(options, (res) => {
                const responseTime = Date.now() - startTime;
                const success = res.statusCode >= 200 && res.statusCode < 400;

                resolve({
                    success,
                    responseTime,
                    statusCode: res.statusCode,
                    message: success ? 
                        `HTTP OK (${res.statusCode}, ${responseTime}ms)` :
                        `HTTP error (${res.statusCode})`
                });
            });

            req.on('error', (error) => {
                resolve({
                    success: false,
                    responseTime: Date.now() - startTime,
                    error: error.message,
                    message: `Connection failed: ${error.message}`
                });
            });

            req.on('timeout', () => {
                req.destroy();
                resolve({
                    success: false,
                    responseTime: Date.now() - startTime,
                    error: 'Timeout',
                    message: 'Connection timed out'
                });
            });

            req.end();
        });
    }

    /**
     * Check performance
     */
    async checkPerformance(domain) {
        const samples = [];
        const numSamples = 3;

        for (let i = 0; i < numSamples; i++) {
            const result = await this.checkConnectivity(domain);
            if (result.success && result.responseTime) {
                samples.push(result.responseTime);
            }
        }

        if (samples.length === 0) {
            return {
                success: false,
                message: 'Performance test failed'
            };
        }

        const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
        const isGood = avg <= this.config.thresholds.responseTime;

        return {
            success: true,
            average: Math.round(avg),
            samples: samples.length,
            threshold: this.config.thresholds.responseTime,
            isGood,
            message: isGood ? 
                `Performance OK (${Math.round(avg)}ms avg)` :
                `Performance slow (${Math.round(avg)}ms avg, threshold: ${this.config.thresholds.responseTime}ms)`
        };
    }

    /**
     * Analyze results and generate alerts
     */
    analyzeResults(result) {
        const alerts = [];
        const { domain, checks } = result;

        // DNS alerts
        if (!checks.dns.success) {
            alerts.push({
                type: 'critical',
                category: 'dns',
                message: `DNS resolution failed for ${domain}`,
                details: checks.dns.message
            });
        }

        // SSL alerts
        if (!checks.ssl.success) {
            alerts.push({
                type: 'critical',
                category: 'ssl',
                message: `SSL certificate issue for ${domain}`,
                details: checks.ssl.message
            });
        } else if (checks.ssl.certificate?.isCritical) {
            alerts.push({
                type: 'critical',
                category: 'ssl',
                message: `SSL certificate expiring very soon for ${domain}`,
                details: `Expires in ${checks.ssl.certificate.daysToExpiry} days`
            });
        } else if (checks.ssl.certificate?.isExpiring) {
            alerts.push({
                type: 'warning',
                category: 'ssl',
                message: `SSL certificate expiring soon for ${domain}`,
                details: `Expires in ${checks.ssl.certificate.daysToExpiry} days`
            });
        }

        // Connectivity alerts
        if (!checks.connectivity.success) {
            alerts.push({
                type: 'critical',
                category: 'connectivity',
                message: `Website unavailable: ${domain}`,
                details: checks.connectivity.message
            });
        }

        // Performance alerts
        if (checks.performance.success && !checks.performance.isGood) {
            alerts.push({
                type: 'warning',
                category: 'performance',
                message: `Slow response time for ${domain}`,
                details: `${checks.performance.average}ms (threshold: ${checks.performance.threshold}ms)`
            });
        }

        return alerts;
    }

    /**
     * Handle alerts
     */
    async handleAlerts(domain, alerts) {
        if (!this.config.alerts.enabled) {
            return;
        }

        for (const alert of alerts) {
            const alertData = {
                ...alert,
                domain,
                timestamp: new Date().toISOString()
            };

            // Add to state
            this.state.alerts.push(alertData);

            // Console output
            if (this.config.alerts.channels.includes('console')) {
                const icon = alert.type === 'critical' ? '🚨' : '⚠️';
                console.log(`${icon} ${alert.type.toUpperCase()}: ${alert.message}`);
                console.log(`   Details: ${alert.details}`);
            }

            // File output
            if (this.config.alerts.channels.includes('file')) {
                await this.saveAlert(alertData);
            }

            // Webhook
            if (this.config.alerts.channels.includes('webhook') && this.config.alerts.webhook.url) {
                await this.sendWebhookAlert(alertData);
            }

            // Emit alert event
            this.emit('alert', alertData);
        }
    }

    /**
     * Store monitoring result
     */
    storeResult(domain, result) {
        if (!this.state.results.has(domain)) {
            this.state.results.set(domain, []);
        }

        const domainResults = this.state.results.get(domain);
        domainResults.push(result);

        // Keep only recent results (memory optimization)
        const maxResults = 100;
        if (domainResults.length > maxResults) {
            domainResults.splice(0, domainResults.length - maxResults);
        }
    }

    /**
     * Update metrics
     */
    updateMetrics(result) {
        const responseTimes = Object.values(result.checks)
            .filter(check => check.responseTime)
            .map(check => check.responseTime);

        if (responseTimes.length > 0) {
            const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
            this.state.metrics.averageResponseTime = Math.round(
                (this.state.metrics.averageResponseTime + avgResponseTime) / 2
            );
        }
    }

    /**
     * Save alert to file
     */
    async saveAlert(alert) {
        try {
            const alertsFile = path.join(this.config.storage.directory, 'alerts.jsonl');
            const alertLine = JSON.stringify(alert) + '\n';
            await fs.appendFile(alertsFile, alertLine);
        } catch (error) {
            console.error('Failed to save alert to file:', error.message);
        }
    }

    /**
     * Send webhook alert
     */
    async sendWebhookAlert(alert) {
        try {
            const payload = {
                text: `🚨 Domain Alert: ${alert.message}`,
                attachments: [{
                    color: alert.type === 'critical' ? 'danger' : 'warning',
                    fields: [
                        { title: 'Domain', value: alert.domain, short: true },
                        { title: 'Category', value: alert.category, short: true },
                        { title: 'Details', value: alert.details, short: false }
                    ],
                    timestamp: alert.timestamp
                }]
            };

            // This would send to webhook URL (implementation depends on webhook service)
            console.log('📤 Webhook alert ready:', payload.text);
            
        } catch (error) {
            console.error('Failed to send webhook alert:', error.message);
        }
    }

    /**
     * Generate status report
     */
    async generateStatusReport() {
        const now = new Date();
        const uptime = this.state.startTime ? now - this.state.startTime : 0;
        
        const report = {
            timestamp: now.toISOString(),
            uptime: {
                seconds: Math.round(uptime / 1000),
                formatted: this.formatUptime(uptime)
            },
            metrics: { ...this.state.metrics },
            domains: {},
            recentAlerts: this.state.alerts.slice(-10),
            summary: {
                totalDomains: this.state.results.size,
                healthyDomains: 0,
                unhealthyDomains: 0,
                activeAlerts: this.state.alerts.filter(a => 
                    new Date(a.timestamp) > new Date(now - 24 * 60 * 60 * 1000)
                ).length
            }
        };

        // Domain status summary
        for (const [domain, results] of this.state.results) {
            const latestResult = results[results.length - 1];
            
            report.domains[domain] = {
                status: latestResult ? 
                    (latestResult.overall.success ? 'healthy' : 'unhealthy') : 
                    'unknown',
                lastCheck: latestResult?.timestamp,
                checksToday: results.filter(r => 
                    new Date(r.timestamp) > new Date(now - 24 * 60 * 60 * 1000)
                ).length,
                recentIssues: latestResult?.overall.issues || []
            };

            if (report.domains[domain].status === 'healthy') {
                report.summary.healthyDomains++;
            } else {
                report.summary.unhealthyDomains++;
            }
        }

        return report;
    }

    /**
     * Format uptime duration
     */
    formatUptime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `${days}d ${hours % 24}h ${minutes % 60}m`;
        } else if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    }

    /**
     * Ensure storage directory exists
     */
    async ensureStorageDirectory() {
        await fs.mkdir(this.config.storage.directory, { recursive: true });
    }

    /**
     * Load historical monitoring data
     */
    async loadHistoricalData() {
        try {
            const stateFile = path.join(this.config.storage.directory, 'monitor-state.json');
            const data = await fs.readFile(stateFile, 'utf8');
            const state = JSON.parse(data);
            
            // Restore metrics
            if (state.metrics) {
                this.state.metrics = { ...this.state.metrics, ...state.metrics };
            }
            
            console.log('📁 Loaded historical monitoring data');
        } catch (error) {
            console.log('📁 No historical data found, starting fresh');
        }
    }

    /**
     * Save current monitoring state
     */
    async saveState() {
        try {
            const stateFile = path.join(this.config.storage.directory, 'monitor-state.json');
            const state = {
                timestamp: new Date().toISOString(),
                metrics: this.state.metrics,
                lastCheck: this.state.lastCheck,
                alertsCount: this.state.alerts.length
            };
            
            await fs.writeFile(stateFile, JSON.stringify(state, null, 2));
        } catch (error) {
            console.error('Failed to save monitoring state:', error.message);
        }
    }

    /**
     * Start cleanup routine for old data
     */
    startCleanupRoutine() {
        // Run cleanup every hour
        setInterval(async () => {
            await this.cleanupOldData();
        }, 60 * 60 * 1000);
    }

    /**
     * Clean up old monitoring data
     */
    async cleanupOldData() {
        const cutoffDate = new Date(Date.now() - this.config.storage.retentionDays * 24 * 60 * 60 * 1000);
        
        // Clean alerts
        this.state.alerts = this.state.alerts.filter(alert => 
            new Date(alert.timestamp) > cutoffDate
        );
        
        console.log(`🧹 Cleaned up old monitoring data (retention: ${this.config.storage.retentionDays} days)`);
    }
}

// CLI Interface
if (import.meta.url === `file://${process.argv[1]}`) {
    const monitor = new DomainMonitor();

    const args = process.argv.slice(2);
    let command = 'start';

    // Parse command line arguments
    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case 'start':
                command = 'start';
                break;
            case 'stop':
                command = 'stop';
                break;
            case 'status':
                command = 'status';
                break;
            case '--help':
                console.log(`
Bitcoin Sovereign Academy - Domain Monitor

Usage: node tools/domain-monitor.js [command]

Commands:
  start     Start continuous monitoring (default)
  stop      Stop monitoring
  status    Show current status
  --help    Show this help message

Examples:
  node tools/domain-monitor.js start
  node tools/domain-monitor.js status
`);
                process.exit(0);
        }
    }

    // Handle process signals
    process.on('SIGINT', async () => {
        console.log('\n🛑 Received shutdown signal...');
        await monitor.stop();
        process.exit(0);
    });

    process.on('SIGTERM', async () => {
        console.log('\n🛑 Received termination signal...');
        await monitor.stop();
        process.exit(0);
    });

    // Execute command
    switch (command) {
        case 'start':
            await monitor.start();
            break;
        case 'stop':
            await monitor.stop();
            break;
        case 'status':
            const report = await monitor.generateStatusReport();
            console.log('📊 Domain Monitor Status Report\n');
            console.log(JSON.stringify(report, null, 2));
            break;
    }
}

export default DomainMonitor;