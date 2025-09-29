#!/usr/bin/env node

/**
 * Bitcoin Sovereign Academy - Domain Testing Suite
 * Automated testing for domain health, performance, and reliability
 */

import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';
import https from 'https';
import http from 'http';
import dns from 'dns/promises';
import { performance } from 'perf_hooks';

class DomainTestSuite {
    constructor() {
        this.config = {
            domains: {
                primary: 'bitcoinsovereign.academy',
                alternatives: [
                    'bitcoinsovereign.education',
                    'btcsovereign.academy',
                    'learnbitcoin.academy'
                ],
                subdomains: [
                    'www',
                    'api',
                    'cdn'
                ]
            },
            tests: {
                connectivity: { enabled: true, timeout: 10000 },
                dns: { enabled: true, timeout: 5000 },
                ssl: { enabled: true, timeout: 10000 },
                performance: { enabled: true, samples: 5 },
                content: { enabled: true, timeout: 15000 },
                seo: { enabled: true, timeout: 10000 },
                security: { enabled: true, timeout: 10000 }
            },
            thresholds: {
                responseTime: 3000,  // ms
                certificateExpiry: 30,  // days
                uptime: 99.0  // percentage
            }
        };

        this.results = {};
        this.startTime = Date.now();
    }

    /**
     * Run all tests
     */
    async runAllTests(options = {}) {
        console.log('🧪 Bitcoin Sovereign Academy - Domain Testing Suite\n');
        console.log(`⏰ Started at: ${new Date().toISOString()}\n`);

        const domains = this.getDomainList(options);
        
        for (const domain of domains) {
            console.log(`🔍 Testing domain: ${domain}`);
            console.log('─'.repeat(50));
            
            this.results[domain] = {
                timestamp: new Date().toISOString(),
                tests: {}
            };

            try {
                if (this.config.tests.connectivity.enabled) {
                    this.results[domain].tests.connectivity = await this.testConnectivity(domain);
                }

                if (this.config.tests.dns.enabled) {
                    this.results[domain].tests.dns = await this.testDNS(domain);
                }

                if (this.config.tests.ssl.enabled) {
                    this.results[domain].tests.ssl = await this.testSSL(domain);
                }

                if (this.config.tests.performance.enabled) {
                    this.results[domain].tests.performance = await this.testPerformance(domain);
                }

                if (this.config.tests.content.enabled) {
                    this.results[domain].tests.content = await this.testContent(domain);
                }

                if (this.config.tests.seo.enabled) {
                    this.results[domain].tests.seo = await this.testSEO(domain);
                }

                if (this.config.tests.security.enabled) {
                    this.results[domain].tests.security = await this.testSecurity(domain);
                }

            } catch (error) {
                console.log(`❌ Error testing ${domain}: ${error.message}`);
                this.results[domain].error = error.message;
            }

            console.log('');
        }

        await this.generateReport();
        await this.saveResults();
    }

    /**
     * Get list of domains to test
     */
    getDomainList(options) {
        if (options.domain) {
            return [options.domain];
        }

        let domains = [this.config.domains.primary];
        
        if (options.all) {
            domains = domains.concat(this.config.domains.alternatives);
        }

        if (options.subdomains) {
            const primaryWithSubdomains = this.config.domains.subdomains.map(
                sub => `${sub}.${this.config.domains.primary}`
            );
            domains = domains.concat(primaryWithSubdomains);
        }

        return domains;
    }

    /**
     * Test basic connectivity
     */
    async testConnectivity(domain) {
        console.log('  🌐 Connectivity...');
        
        const results = {
            http: null,
            https: null,
            redirect: null
        };

        // Test HTTP (should redirect to HTTPS)
        results.http = await this.makeRequest(domain, 80, false);
        
        // Test HTTPS
        results.https = await this.makeRequest(domain, 443, true);

        // Check if HTTP redirects to HTTPS
        if (results.http && results.http.statusCode >= 300 && results.http.statusCode < 400) {
            const location = results.http.headers?.location;
            if (location && location.startsWith('https://')) {
                results.redirect = { 
                    hasRedirect: true, 
                    location,
                    secure: true
                };
            }
        }

        const success = results.https && results.https.success;
        const message = success ? 
            `✅ HTTPS responsive (${results.https.responseTime}ms)` :
            '❌ HTTPS connection failed';

        console.log(`     ${message}`);

        return {
            success,
            message,
            details: results
        };
    }

    /**
     * Test DNS configuration
     */
    async testDNS(domain) {
        console.log('  🌐 DNS Resolution...');
        
        const results = {};

        try {
            // A Records
            results.a = await dns.resolve4(domain);
            
            // AAAA Records (IPv6)
            try {
                results.aaaa = await dns.resolve6(domain);
            } catch (error) {
                results.aaaa = [];
            }

            // MX Records
            try {
                results.mx = await dns.resolveMx(domain);
            } catch (error) {
                results.mx = [];
            }

            // TXT Records
            try {
                results.txt = await dns.resolveTxt(domain);
            } catch (error) {
                results.txt = [];
            }

            // Check if pointing to GitHub Pages
            const githubIPs = [
                '185.199.108.153',
                '185.199.109.153', 
                '185.199.110.153',
                '185.199.111.153'
            ];
            
            const isGitHubPages = results.a.some(ip => githubIPs.includes(ip));

            const message = isGitHubPages ?
                `✅ DNS configured for GitHub Pages (${results.a.length} A records)` :
                `⚠️ DNS not pointing to GitHub Pages (${results.a.join(', ')})`;

            console.log(`     ${message}`);

            return {
                success: results.a.length > 0,
                isGitHubPages,
                message,
                records: results
            };

        } catch (error) {
            const message = `❌ DNS resolution failed: ${error.message}`;
            console.log(`     ${message}`);
            
            return {
                success: false,
                message,
                error: error.message
            };
        }
    }

    /**
     * Test SSL certificate
     */
    async testSSL(domain) {
        console.log('  🔒 SSL Certificate...');

        return new Promise((resolve) => {
            const options = {
                hostname: domain,
                port: 443,
                method: 'HEAD',
                timeout: this.config.tests.ssl.timeout
            };

            const req = https.request(options, (res) => {
                const cert = res.socket.getPeerCertificate();
                
                if (!cert || Object.keys(cert).length === 0) {
                    const result = {
                        success: false,
                        message: '❌ No SSL certificate found'
                    };
                    console.log(`     ${result.message}`);
                    resolve(result);
                    return;
                }

                const now = new Date();
                const validFrom = new Date(cert.valid_from);
                const validTo = new Date(cert.valid_to);
                const daysToExpiry = Math.ceil((validTo - now) / (1000 * 60 * 60 * 24));
                
                const isValid = validFrom <= now && now <= validTo;
                const isExpiringSoon = daysToExpiry <= this.config.thresholds.certificateExpiry;

                let message;
                if (!isValid) {
                    message = '❌ SSL certificate is invalid or expired';
                } else if (isExpiringSoon) {
                    message = `⚠️ SSL certificate expires in ${daysToExpiry} days`;
                } else {
                    message = `✅ SSL certificate valid (expires in ${daysToExpiry} days)`;
                }

                console.log(`     ${message}`);

                resolve({
                    success: isValid,
                    message,
                    certificate: {
                        issuer: cert.issuer?.O || 'Unknown',
                        subject: cert.subject?.CN || domain,
                        validFrom: cert.valid_from,
                        validTo: cert.valid_to,
                        daysToExpiry,
                        isExpiringSoon
                    }
                });
            });

            req.on('error', (error) => {
                const result = {
                    success: false,
                    message: `❌ SSL check failed: ${error.message}`,
                    error: error.message
                };
                console.log(`     ${result.message}`);
                resolve(result);
            });

            req.on('timeout', () => {
                req.destroy();
                const result = {
                    success: false,
                    message: '❌ SSL check timed out',
                    error: 'Timeout'
                };
                console.log(`     ${result.message}`);
                resolve(result);
            });

            req.end();
        });
    }

    /**
     * Test performance metrics
     */
    async testPerformance(domain) {
        console.log('  ⚡ Performance...');

        const samples = [];
        const numSamples = this.config.tests.performance.samples;

        for (let i = 0; i < numSamples; i++) {
            const result = await this.makeRequest(domain, 443, true);
            if (result && result.success && result.responseTime) {
                samples.push(result.responseTime);
            }
        }

        if (samples.length === 0) {
            const message = '❌ Performance test failed - no successful requests';
            console.log(`     ${message}`);
            return {
                success: false,
                message
            };
        }

        const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
        const min = Math.min(...samples);
        const max = Math.max(...samples);
        const median = samples.sort((a, b) => a - b)[Math.floor(samples.length / 2)];

        const isGood = avg <= this.config.thresholds.responseTime;
        const message = isGood ?
            `✅ Average response: ${Math.round(avg)}ms` :
            `⚠️ Slow response: ${Math.round(avg)}ms (threshold: ${this.config.thresholds.responseTime}ms)`;

        console.log(`     ${message}`);

        return {
            success: true,
            message,
            metrics: {
                samples: samples.length,
                average: Math.round(avg),
                median: Math.round(median),
                min,
                max,
                threshold: this.config.thresholds.responseTime,
                isGood
            }
        };
    }

    /**
     * Test content and basic functionality
     */
    async testContent(domain) {
        console.log('  📄 Content Validation...');

        const result = await this.makeRequest(domain, 443, true, '/');
        
        if (!result || !result.success) {
            const message = '❌ Content validation failed - no response';
            console.log(`     ${message}`);
            return {
                success: false,
                message
            };
        }

        const content = result.body || '';
        const checks = {
            hasTitle: /<title[^>]*>(.*?)<\/title>/i.test(content),
            hasMetaDescription: /<meta[^>]*name=["']description["'][^>]*>/i.test(content),
            hasViewport: /<meta[^>]*name=["']viewport["'][^>]*>/i.test(content),
            hasBitcoinContent: /bitcoin/i.test(content),
            hasAcademyContent: /academy|education|learn/i.test(content),
            hasNavigation: /<nav[^>]*>|<header[^>]*>/i.test(content)
        };

        const passedChecks = Object.values(checks).filter(Boolean).length;
        const totalChecks = Object.keys(checks).length;

        const message = passedChecks === totalChecks ?
            `✅ Content validation passed (${passedChecks}/${totalChecks} checks)` :
            `⚠️ Content validation partial (${passedChecks}/${totalChecks} checks)`;

        console.log(`     ${message}`);

        return {
            success: passedChecks > totalChecks / 2, // At least half should pass
            message,
            checks,
            score: `${passedChecks}/${totalChecks}`,
            contentLength: content.length
        };
    }

    /**
     * Test SEO basics
     */
    async testSEO(domain) {
        console.log('  🔍 SEO Analysis...');

        const result = await this.makeRequest(domain, 443, true, '/');
        
        if (!result || !result.success) {
            const message = '❌ SEO analysis failed - no response';
            console.log(`     ${message}`);
            return {
                success: false,
                message
            };
        }

        const content = result.body || '';
        const headers = result.headers || {};

        // Extract title
        const titleMatch = content.match(/<title[^>]*>(.*?)<\/title>/i);
        const title = titleMatch ? titleMatch[1].trim() : '';

        // Extract meta description
        const descMatch = content.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*?)["']/i);
        const description = descMatch ? descMatch[1] : '';

        const seoChecks = {
            hasTitle: title.length > 0,
            titleLength: title.length >= 30 && title.length <= 60,
            hasDescription: description.length > 0,
            descriptionLength: description.length >= 120 && description.length <= 160,
            hasH1: /<h1[^>]*>/i.test(content),
            hasStructuredData: /application\/ld\+json|microdata|RDFa/i.test(content),
            hasOpenGraph: /<meta[^>]*property=["']og:/i.test(content),
            hasCanonical: /<link[^>]*rel=["']canonical["']/i.test(content),
            hasRobotsMeta: /<meta[^>]*name=["']robots["']/i.test(content),
            hasHttpsRedirect: headers['strict-transport-security'] !== undefined
        };

        const passedSEO = Object.values(seoChecks).filter(Boolean).length;
        const totalSEO = Object.keys(seoChecks).length;

        const message = passedSEO >= totalSEO * 0.7 ?
            `✅ SEO analysis good (${passedSEO}/${totalSEO} checks)` :
            `⚠️ SEO analysis needs work (${passedSEO}/${totalSEO} checks)`;

        console.log(`     ${message}`);

        return {
            success: passedSEO >= totalSEO * 0.5,
            message,
            checks: seoChecks,
            score: `${passedSEO}/${totalSEO}`,
            details: {
                title: title.substring(0, 100),
                description: description.substring(0, 200),
                titleLength: title.length,
                descriptionLength: description.length
            }
        };
    }

    /**
     * Test security headers and configurations
     */
    async testSecurity(domain) {
        console.log('  🛡️ Security Headers...');

        const result = await this.makeRequest(domain, 443, true, '/');
        
        if (!result || !result.success) {
            const message = '❌ Security check failed - no response';
            console.log(`     ${message}`);
            return {
                success: false,
                message
            };
        }

        const headers = result.headers || {};
        
        const securityChecks = {
            hasHTTPS: result.protocol === 'https:',
            hasHSTS: headers['strict-transport-security'] !== undefined,
            hasCSP: headers['content-security-policy'] !== undefined,
            hasXFrameOptions: headers['x-frame-options'] !== undefined,
            hasXContentTypeOptions: headers['x-content-type-options'] === 'nosniff',
            hasReferrerPolicy: headers['referrer-policy'] !== undefined,
            hasPermissionsPolicy: headers['permissions-policy'] !== undefined
        };

        const passedSecurity = Object.values(securityChecks).filter(Boolean).length;
        const totalSecurity = Object.keys(securityChecks).length;

        const message = passedSecurity >= totalSecurity * 0.6 ?
            `✅ Security headers good (${passedSecurity}/${totalSecurity} checks)` :
            `⚠️ Security headers need improvement (${passedSecurity}/${totalSecurity} checks)`;

        console.log(`     ${message}`);

        return {
            success: passedSecurity >= totalSecurity * 0.4,
            message,
            checks: securityChecks,
            score: `${passedSecurity}/${totalSecurity}`,
            headers: Object.keys(headers).filter(key => 
                key.toLowerCase().includes('security') || 
                key.toLowerCase().includes('policy') ||
                key.toLowerCase().includes('frame')
            ).reduce((obj, key) => ({ ...obj, [key]: headers[key] }), {})
        };
    }

    /**
     * Make HTTP/HTTPS request
     */
    async makeRequest(domain, port, secure, path = '/', method = 'GET') {
        return new Promise((resolve) => {
            const startTime = performance.now();
            const protocol = secure ? https : http;
            
            const options = {
                hostname: domain,
                port,
                path,
                method,
                timeout: this.config.tests.connectivity.timeout,
                headers: {
                    'User-Agent': 'Bitcoin-Sovereign-Academy-Test-Suite/1.0'
                }
            };

            const req = protocol.request(options, (res) => {
                const responseTime = Math.round(performance.now() - startTime);
                
                let body = '';
                res.on('data', chunk => {
                    body += chunk;
                });

                res.on('end', () => {
                    resolve({
                        success: true,
                        statusCode: res.statusCode,
                        headers: res.headers,
                        responseTime,
                        body: body.substring(0, 50000), // Limit body size
                        protocol: secure ? 'https:' : 'http:'
                    });
                });
            });

            req.on('error', (error) => {
                resolve({
                    success: false,
                    error: error.message,
                    responseTime: Math.round(performance.now() - startTime)
                });
            });

            req.on('timeout', () => {
                req.destroy();
                resolve({
                    success: false,
                    error: 'Timeout',
                    responseTime: Math.round(performance.now() - startTime)
                });
            });

            req.end();
        });
    }

    /**
     * Generate summary report
     */
    async generateReport() {
        const totalTime = Date.now() - this.startTime;
        
        console.log('📊 Test Summary');
        console.log('═'.repeat(50));
        console.log(`⏱️ Total execution time: ${totalTime}ms`);
        console.log(`📅 Completed at: ${new Date().toISOString()}`);
        console.log('');

        const domains = Object.keys(this.results);
        let totalTests = 0;
        let passedTests = 0;

        for (const domain of domains) {
            const result = this.results[domain];
            const tests = result.tests || {};
            
            console.log(`🌐 ${domain}:`);
            
            Object.entries(tests).forEach(([testName, testResult]) => {
                totalTests++;
                const status = testResult.success ? '✅' : '❌';
                const message = testResult.message || 'No message';
                console.log(`   ${status} ${testName}: ${message}`);
                
                if (testResult.success) {
                    passedTests++;
                }
            });
            
            console.log('');
        }

        const successRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
        console.log(`📈 Overall Success Rate: ${successRate}% (${passedTests}/${totalTests} tests)`);
        console.log('');
    }

    /**
     * Save test results
     */
    async saveResults() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `domain-test-results-${timestamp}.json`;
        const filepath = path.resolve('reports', filename);

        await fs.mkdir(path.dirname(filepath), { recursive: true });

        const report = {
            timestamp: new Date().toISOString(),
            duration: Date.now() - this.startTime,
            config: this.config,
            results: this.results,
            summary: this.generateSummary()
        };

        await fs.writeFile(filepath, JSON.stringify(report, null, 2));
        console.log(`💾 Results saved to: reports/${filename}`);
    }

    /**
     * Generate summary statistics
     */
    generateSummary() {
        const domains = Object.keys(this.results);
        let totalTests = 0;
        let passedTests = 0;
        
        const summary = {
            domains: domains.length,
            tests: {},
            overall: {}
        };

        for (const domain of domains) {
            const tests = this.results[domain].tests || {};
            
            Object.entries(tests).forEach(([testName, testResult]) => {
                totalTests++;
                if (testResult.success) passedTests++;

                if (!summary.tests[testName]) {
                    summary.tests[testName] = { total: 0, passed: 0 };
                }
                summary.tests[testName].total++;
                if (testResult.success) {
                    summary.tests[testName].passed++;
                }
            });
        }

        summary.overall = {
            totalTests,
            passedTests,
            failedTests: totalTests - passedTests,
            successRate: totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0
        };

        return summary;
    }
}

// CLI Interface
if (import.meta.url === `file://${process.argv[1]}`) {
    const suite = new DomainTestSuite();
    
    const args = process.argv.slice(2);
    const options = {};
    
    // Parse command line arguments
    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--domain':
                options.domain = args[++i];
                break;
            case '--all':
                options.all = true;
                break;
            case '--subdomains':
                options.subdomains = true;
                break;
            case '--help':
                console.log(`
Bitcoin Sovereign Academy - Domain Testing Suite

Usage: node tools/domain-test-suite.js [options]

Options:
  --domain <domain>    Test specific domain only
  --all               Test all configured domains
  --subdomains        Include subdomain tests
  --help              Show this help message

Examples:
  node tools/domain-test-suite.js
  node tools/domain-test-suite.js --all
  node tools/domain-test-suite.js --domain bitcoinsovereign.academy
  node tools/domain-test-suite.js --all --subdomains
`);
                process.exit(0);
        }
    }
    
    await suite.runAllTests(options);
}

export default DomainTestSuite;