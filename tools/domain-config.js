#!/usr/bin/env node

/**
 * Bitcoin Sovereign Academy - Domain Configuration Tool
 * Advanced domain setup, verification, and management
 */

import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';
import https from 'https';
import dns from 'dns/promises';

class DomainConfigTool {
    constructor() {
        this.config = {
            domains: {
                primary: 'bitcoinsovereign.academy',
                alternatives: [
                    'bitcoinsovereign.education',
                    'btcsovereign.academy',
                    'learnbitcoin.academy'
                ]
            },
            githubPages: {
                ips: [
                    '185.199.108.153',
                    '185.199.109.153',
                    '185.199.110.153',
                    '185.199.111.153'
                ]
            },
            cloudflare: {
                nameservers: [
                    'ns1.cloudflare.com',
                    'ns2.cloudflare.com'
                ]
            }
        };
        
        this.results = {
            dns: {},
            ssl: {},
            connectivity: {},
            performance: {}
        };
    }

    /**
     * Main configuration function
     */
    async configure(options = {}) {
        console.log('🚀 Bitcoin Sovereign Academy - Domain Configuration\n');
        
        try {
            if (options.verify) {
                await this.verifyAllDomains();
            }
            
            if (options.setup) {
                await this.setupDomain(options.domain);
            }
            
            if (options.ssl) {
                await this.checkSSL(options.domain || this.config.domains.primary);
            }
            
            if (options.dns) {
                await this.checkDNS(options.domain || this.config.domains.primary);
            }
            
            if (options.performance) {
                await this.testPerformance(options.domain || this.config.domains.primary);
            }
            
            if (options.report) {
                await this.generateReport();
            }
            
        } catch (error) {
            console.error('❌ Configuration failed:', error.message);
            process.exit(1);
        }
    }

    /**
     * Verify all configured domains
     */
    async verifyAllDomains() {
        console.log('🔍 Verifying all domains...\n');
        
        const domains = [this.config.domains.primary, ...this.config.domains.alternatives];
        
        for (const domain of domains) {
            console.log(`📋 Checking ${domain}:`);
            
            try {
                // DNS Check
                const dnsResult = await this.checkDNS(domain, false);
                console.log(`  DNS: ${dnsResult.configured ? '✅' : '❌'} ${dnsResult.message}`);
                
                // Connectivity Check
                const connResult = await this.testConnectivity(domain, false);
                console.log(`  HTTP: ${connResult.success ? '✅' : '❌'} ${connResult.message}`);
                
                // SSL Check
                const sslResult = await this.checkSSL(domain, false);
                console.log(`  SSL: ${sslResult.valid ? '✅' : '❌'} ${sslResult.message}`);
                
                console.log('');
                
            } catch (error) {
                console.log(`  Error: ❌ ${error.message}\n`);
            }
        }
    }

    /**
     * Setup domain configuration
     */
    async setupDomain(domain) {
        domain = domain || this.config.domains.primary;
        console.log(`⚙️ Setting up domain: ${domain}\n`);
        
        // 1. Create/Update CNAME file
        await this.updateCNAME(domain);
        
        // 2. Generate DNS configuration
        await this.generateDNSConfig(domain);
        
        // 3. Create deployment scripts
        await this.createDeploymentScripts(domain);
        
        console.log('✅ Domain setup completed!\n');
    }

    /**
     * Update CNAME file
     */
    async updateCNAME(domain) {
        console.log('📝 Updating CNAME file...');
        
        const cnamePath = path.resolve('CNAME');
        await fs.writeFile(cnamePath, domain);
        
        console.log(`   ✅ CNAME updated with ${domain}`);
    }

    /**
     * Generate DNS configuration instructions
     */
    async generateDNSConfig(domain) {
        console.log('🌐 Generating DNS configuration...');
        
        const dnsConfig = {
            domain,
            records: {
                apex: {
                    type: 'A',
                    values: this.config.githubPages.ips
                },
                www: {
                    type: 'CNAME',
                    value: 'sovereigndwp.github.io'
                }
            },
            cloudflare: {
                settings: {
                    ssl: 'Full',
                    alwaysHttps: true,
                    minify: ['html', 'css', 'js'],
                    brotli: true
                }
            }
        };
        
        const configPath = path.resolve('tools/dns-config.json');
        await fs.writeFile(configPath, JSON.stringify(dnsConfig, null, 2));
        
        console.log('   ✅ DNS configuration saved to tools/dns-config.json');
    }

    /**
     * Create deployment scripts
     */
    async createDeploymentScripts(domain) {
        console.log('📦 Creating deployment scripts...');
        
        const deployScript = `#!/bin/bash
# Bitcoin Sovereign Academy - Deployment Script
# Domain: ${domain}

echo "🚀 Deploying Bitcoin Sovereign Academy..."

# Check if CNAME exists
if [ ! -f "CNAME" ]; then
    echo "❌ CNAME file not found"
    exit 1
fi

echo "📝 Current domain: \$(cat CNAME)"

# Build and deploy
echo "🔨 Building project..."
npm run build 2>/dev/null || echo "ℹ️  No build step configured"

# Git operations
echo "📤 Deploying to GitHub Pages..."
git add .
git commit -m "Deploy Bitcoin Sovereign Academy - \$(date)"
git push origin main

echo "✅ Deployment completed!"
echo "🌐 Site will be available at: https://${domain}"
echo "⏱️  DNS propagation may take up to 24 hours"
`;

        const scriptPath = path.resolve('scripts/deploy.sh');
        await fs.mkdir(path.dirname(scriptPath), { recursive: true });
        await fs.writeFile(scriptPath, deployScript);
        
        // Make script executable
        try {
            execSync(`chmod +x "${scriptPath}"`);
        } catch (error) {
            // Ignore permission errors on Windows
        }
        
        console.log('   ✅ Deployment script created at scripts/deploy.sh');
    }

    /**
     * Check DNS configuration
     */
    async checkDNS(domain, verbose = true) {
        if (verbose) console.log(`🌐 Checking DNS for ${domain}...`);
        
        try {
            // Check A records
            const aRecords = await dns.resolve4(domain);
            const expectedIPs = this.config.githubPages.ips;
            const hasCorrectIPs = expectedIPs.some(ip => aRecords.includes(ip));
            
            // Check CNAME for www subdomain
            let wwwRecord = null;
            try {
                wwwRecord = await dns.resolveCname(`www.${domain}`);
            } catch (error) {
                // www CNAME might not exist
            }
            
            const result = {
                configured: hasCorrectIPs,
                aRecords,
                wwwRecord,
                message: hasCorrectIPs ? 
                    'DNS correctly configured for GitHub Pages' : 
                    'DNS not pointing to GitHub Pages IPs'
            };
            
            this.results.dns[domain] = result;
            
            if (verbose) {
                console.log(`   A Records: ${aRecords.join(', ')}`);
                if (wwwRecord) console.log(`   WWW CNAME: ${wwwRecord.join(', ')}`);
                console.log(`   Status: ${result.configured ? '✅' : '❌'} ${result.message}\n`);
            }
            
            return result;
            
        } catch (error) {
            const result = {
                configured: false,
                error: error.message,
                message: `DNS resolution failed: ${error.code || error.message}`
            };
            
            this.results.dns[domain] = result;
            if (verbose) console.log(`   ❌ ${result.message}\n`);
            return result;
        }
    }

    /**
     * Check SSL certificate
     */
    async checkSSL(domain, verbose = true) {
        if (verbose) console.log(`🔒 Checking SSL certificate for ${domain}...`);
        
        return new Promise((resolve) => {
            const options = {
                hostname: domain,
                port: 443,
                path: '/',
                method: 'HEAD',
                timeout: 10000
            };
            
            const req = https.request(options, (res) => {
                const cert = res.socket.getPeerCertificate();
                const now = new Date();
                const validFrom = new Date(cert.valid_from);
                const validTo = new Date(cert.valid_to);
                const daysToExpiry = Math.ceil((validTo - now) / (1000 * 60 * 60 * 24));
                
                const result = {
                    valid: cert && validFrom <= now && now <= validTo,
                    issuer: cert.issuer?.O || 'Unknown',
                    validFrom: cert.valid_from,
                    validTo: cert.valid_to,
                    daysToExpiry,
                    subject: cert.subject?.CN || domain,
                    message: daysToExpiry > 30 ? 
                        `Certificate valid (expires in ${daysToExpiry} days)` :
                        `Certificate expiring soon (${daysToExpiry} days)`
                };
                
                this.results.ssl[domain] = result;
                
                if (verbose) {
                    console.log(`   Issuer: ${result.issuer}`);
                    console.log(`   Valid: ${result.validFrom} - ${result.validTo}`);
                    console.log(`   Status: ${result.valid ? '✅' : '❌'} ${result.message}\n`);
                }
                
                resolve(result);
            });
            
            req.on('error', (error) => {
                const result = {
                    valid: false,
                    error: error.message,
                    message: `SSL check failed: ${error.message}`
                };
                
                this.results.ssl[domain] = result;
                if (verbose) console.log(`   ❌ ${result.message}\n`);
                resolve(result);
            });
            
            req.on('timeout', () => {
                req.destroy();
                const result = {
                    valid: false,
                    error: 'Timeout',
                    message: 'SSL check timed out'
                };
                
                this.results.ssl[domain] = result;
                if (verbose) console.log(`   ❌ ${result.message}\n`);
                resolve(result);
            });
            
            req.end();
        });
    }

    /**
     * Test connectivity
     */
    async testConnectivity(domain, verbose = true) {
        if (verbose) console.log(`🌍 Testing connectivity to ${domain}...`);
        
        return new Promise((resolve) => {
            const startTime = Date.now();
            
            const options = {
                hostname: domain,
                port: 443,
                path: '/',
                method: 'HEAD',
                timeout: 10000
            };
            
            const req = https.request(options, (res) => {
                const responseTime = Date.now() - startTime;
                
                const result = {
                    success: res.statusCode >= 200 && res.statusCode < 400,
                    statusCode: res.statusCode,
                    responseTime,
                    message: `${res.statusCode} (${responseTime}ms)`
                };
                
                this.results.connectivity[domain] = result;
                
                if (verbose) {
                    console.log(`   Status: ${result.statusCode}`);
                    console.log(`   Response: ${responseTime}ms`);
                    console.log(`   Result: ${result.success ? '✅' : '❌'} ${result.message}\n`);
                }
                
                resolve(result);
            });
            
            req.on('error', (error) => {
                const result = {
                    success: false,
                    error: error.message,
                    message: `Connection failed: ${error.message}`
                };
                
                this.results.connectivity[domain] = result;
                if (verbose) console.log(`   ❌ ${result.message}\n`);
                resolve(result);
            });
            
            req.on('timeout', () => {
                req.destroy();
                const result = {
                    success: false,
                    error: 'Timeout',
                    message: 'Connection timed out'
                };
                
                this.results.connectivity[domain] = result;
                if (verbose) console.log(`   ❌ ${result.message}\n`);
                resolve(result);
            });
            
            req.end();
        });
    }

    /**
     * Test performance
     */
    async testPerformance(domain, verbose = true) {
        if (verbose) console.log(`⚡ Testing performance for ${domain}...`);
        
        const tests = [];
        const numTests = 3;
        
        for (let i = 0; i < numTests; i++) {
            const result = await this.testConnectivity(domain, false);
            if (result.responseTime) {
                tests.push(result.responseTime);
            }
        }
        
        if (tests.length === 0) {
            const result = {
                success: false,
                message: 'Performance test failed - no successful connections'
            };
            
            this.results.performance[domain] = result;
            if (verbose) console.log(`   ❌ ${result.message}\n`);
            return result;
        }
        
        const avg = tests.reduce((a, b) => a + b, 0) / tests.length;
        const min = Math.min(...tests);
        const max = Math.max(...tests);
        
        const result = {
            success: true,
            average: Math.round(avg),
            min: min,
            max: max,
            tests: tests.length,
            message: `Average: ${Math.round(avg)}ms (${min}-${max}ms)`
        };
        
        this.results.performance[domain] = result;
        
        if (verbose) {
            console.log(`   Tests: ${tests.length}`);
            console.log(`   Average: ${Math.round(avg)}ms`);
            console.log(`   Range: ${min}ms - ${max}ms`);
            console.log(`   Status: ✅ Performance test completed\n`);
        }
        
        return result;
    }

    /**
     * Generate comprehensive report
     */
    async generateReport() {
        console.log('📊 Generating domain report...\n');
        
        const report = {
            timestamp: new Date().toISOString(),
            domains: this.config.domains,
            results: this.results,
            summary: {
                totalDomains: Object.keys(this.results.dns).length,
                dnsConfigured: Object.values(this.results.dns).filter(r => r.configured).length,
                sslValid: Object.values(this.results.ssl).filter(r => r.valid).length,
                responsive: Object.values(this.results.connectivity).filter(r => r.success).length
            }
        };
        
        // Save detailed report
        const reportPath = path.resolve('reports/domain-report.json');
        await fs.mkdir(path.dirname(reportPath), { recursive: true });
        await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
        
        console.log('✅ Report saved to reports/domain-report.json');
        
        // Print summary
        console.log('\n📋 Summary:');
        console.log(`   Total domains tested: ${report.summary.totalDomains}`);
        console.log(`   DNS configured: ${report.summary.dnsConfigured}/${report.summary.totalDomains}`);
        console.log(`   SSL valid: ${report.summary.sslValid}/${report.summary.totalDomains}`);
        console.log(`   Responsive: ${report.summary.responsive}/${report.summary.totalDomains}`);
        
        return report;
    }
}

// CLI Interface
if (import.meta.url === `file://${process.argv[1]}`) {
    const tool = new DomainConfigTool();
    
    const args = process.argv.slice(2);
    const options = {};
    
    // Parse command line arguments
    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--verify':
                options.verify = true;
                break;
            case '--setup':
                options.setup = true;
                if (args[i + 1] && !args[i + 1].startsWith('--')) {
                    options.domain = args[++i];
                }
                break;
            case '--ssl':
                options.ssl = true;
                if (args[i + 1] && !args[i + 1].startsWith('--')) {
                    options.domain = args[++i];
                }
                break;
            case '--dns':
                options.dns = true;
                if (args[i + 1] && !args[i + 1].startsWith('--')) {
                    options.domain = args[++i];
                }
                break;
            case '--performance':
                options.performance = true;
                if (args[i + 1] && !args[i + 1].startsWith('--')) {
                    options.domain = args[++i];
                }
                break;
            case '--report':
                options.report = true;
                break;
            case '--help':
                console.log(`
Bitcoin Sovereign Academy - Domain Configuration Tool

Usage: node tools/domain-config.js [options]

Options:
  --verify              Verify all configured domains
  --setup [domain]      Setup domain configuration
  --ssl [domain]        Check SSL certificate
  --dns [domain]        Check DNS configuration  
  --performance [domain] Test domain performance
  --report              Generate comprehensive report
  --help                Show this help message

Examples:
  node tools/domain-config.js --verify
  node tools/domain-config.js --setup bitcoinsovereign.academy
  node tools/domain-config.js --ssl --performance bitcoinsovereign.academy
  node tools/domain-config.js --report
`);
                process.exit(0);
        }
    }
    
    // Default to verify if no options specified
    if (Object.keys(options).length === 0) {
        options.verify = true;
        options.report = true;
    }
    
    await tool.configure(options);
}

export default DomainConfigTool;