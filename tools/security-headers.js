#!/usr/bin/env node

/**
 * Bitcoin Sovereign Academy - Security Headers Tool
 * Analyze and implement security headers for web applications
 */

import fs from 'fs/promises';
import path from 'path';
import https from 'https';
import http from 'http';

class SecurityHeadersAnalyzer {
    constructor() {
        this.config = {
            headers: {
                'strict-transport-security': {
                    required: true,
                    recommended: 'max-age=31536000; includeSubDomains; preload',
                    description: 'Enforces HTTPS connections',
                    severity: 'high'
                },
                'content-security-policy': {
                    required: true,
                    recommended: "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:",
                    description: 'Prevents XSS attacks and data injection',
                    severity: 'high'
                },
                'x-frame-options': {
                    required: true,
                    recommended: 'DENY',
                    description: 'Prevents clickjacking attacks',
                    severity: 'medium'
                },
                'x-content-type-options': {
                    required: true,
                    recommended: 'nosniff',
                    description: 'Prevents MIME type sniffing',
                    severity: 'medium'
                },
                'referrer-policy': {
                    required: false,
                    recommended: 'strict-origin-when-cross-origin',
                    description: 'Controls referrer information',
                    severity: 'low'
                },
                'permissions-policy': {
                    required: false,
                    recommended: 'camera=(), microphone=(), geolocation=(), payment=()',
                    description: 'Controls browser features access',
                    severity: 'low'
                },
                'x-xss-protection': {
                    required: false,
                    recommended: '1; mode=block',
                    description: 'Legacy XSS protection (deprecated)',
                    severity: 'low'
                }
            },
            server: {
                timeout: 10000,
                userAgent: 'Bitcoin-Sovereign-Academy-Security-Scanner/1.0'
            }
        };

        this.results = {};
    }

    /**
     * Analyze security headers for domain or URL
     */
    async analyze(options = {}) {
        console.log('🛡️ Bitcoin Sovereign Academy - Security Headers Analyzer\n');

        try {
            const targets = this.getTargets(options);
            
            for (const target of targets) {
                console.log(`🔍 Analyzing: ${target}`);
                await this.analyzeTarget(target);
            }

            await this.generateReport();
            
            if (options.fix) {
                await this.generateSecurityConfig();
            }

            console.log('\n✅ Security analysis completed!');

        } catch (error) {
            console.error('❌ Security analysis failed:', error.message);
            process.exit(1);
        }
    }

    /**
     * Get list of targets to analyze
     */
    getTargets(options) {
        if (options.url) {
            return [options.url];
        }

        // Default domains to check
        return [
            'https://bitcoinsovereign.academy',
            'https://sovereigndwp.github.io/bitcoin-sovereign-academy'
        ];
    }

    /**
     * Analyze security headers for a single target
     */
    async analyzeTarget(url) {
        try {
            const headers = await this.fetchHeaders(url);
            const analysis = this.analyzeHeaders(headers, url);
            
            this.results[url] = analysis;
            this.printAnalysis(analysis);

        } catch (error) {
            console.log(`   ❌ Failed to analyze: ${error.message}`);
            this.results[url] = {
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Fetch HTTP headers from URL
     */
    async fetchHeaders(url) {
        return new Promise((resolve, reject) => {
            const urlObj = new URL(url);
            const protocol = urlObj.protocol === 'https:' ? https : http;
            
            const options = {
                hostname: urlObj.hostname,
                port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
                path: urlObj.pathname + urlObj.search,
                method: 'HEAD',
                timeout: this.config.server.timeout,
                headers: {
                    'User-Agent': this.config.server.userAgent
                }
            };

            const req = protocol.request(options, (res) => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers
                });
            });

            req.on('error', reject);
            req.on('timeout', () => {
                req.destroy();
                reject(new Error('Request timeout'));
            });

            req.end();
        });
    }

    /**
     * Analyze security headers
     */
    analyzeHeaders(response, url) {
        const analysis = {
            url,
            timestamp: new Date().toISOString(),
            statusCode: response.statusCode,
            score: 0,
            maxScore: 0,
            grade: 'F',
            headers: {},
            missing: [],
            recommendations: [],
            issues: []
        };

        // Analyze each security header
        for (const [headerName, config] of Object.entries(this.config.headers)) {
            const headerValue = response.headers[headerName.toLowerCase()];
            const headerAnalysis = this.analyzeHeader(headerName, headerValue, config);
            
            analysis.headers[headerName] = headerAnalysis;
            analysis.score += headerAnalysis.score;
            analysis.maxScore += headerAnalysis.maxScore;

            if (!headerValue && config.required) {
                analysis.missing.push(headerName);
            }

            analysis.recommendations.push(...headerAnalysis.recommendations);
            analysis.issues.push(...headerAnalysis.issues);
        }

        // Calculate grade
        const percentage = analysis.maxScore > 0 ? (analysis.score / analysis.maxScore) * 100 : 0;
        analysis.grade = this.calculateGrade(percentage);
        analysis.percentage = Math.round(percentage);

        return analysis;
    }

    /**
     * Analyze individual header
     */
    analyzeHeader(name, value, config) {
        const analysis = {
            present: !!value,
            value: value || null,
            score: 0,
            maxScore: config.required ? 10 : 5,
            recommendations: [],
            issues: []
        };

        if (!value) {
            if (config.required) {
                analysis.issues.push(`Missing required header: ${name}`);
                analysis.recommendations.push(`Add ${name}: ${config.recommended}`);
            } else {
                analysis.recommendations.push(`Consider adding ${name}: ${config.recommended}`);
            }
        } else {
            // Header is present, analyze its value
            const headerAnalysis = this.analyzeHeaderValue(name, value, config);
            analysis.score += headerAnalysis.score;
            analysis.recommendations.push(...headerAnalysis.recommendations);
            analysis.issues.push(...headerAnalysis.issues);
        }

        return analysis;
    }

    /**
     * Analyze specific header values
     */
    analyzeHeaderValue(name, value, config) {
        const analysis = { score: 0, recommendations: [], issues: [] };

        switch (name) {
            case 'strict-transport-security':
                analysis.score += this.analyzeHSTS(value, analysis);
                break;
            
            case 'content-security-policy':
                analysis.score += this.analyzeCSP(value, analysis);
                break;
            
            case 'x-frame-options':
                analysis.score += this.analyzeFrameOptions(value, analysis);
                break;
            
            case 'x-content-type-options':
                analysis.score += this.analyzeContentTypeOptions(value, analysis);
                break;
            
            case 'referrer-policy':
                analysis.score += this.analyzeReferrerPolicy(value, analysis);
                break;
            
            case 'permissions-policy':
                analysis.score += this.analyzePermissionsPolicy(value, analysis);
                break;
            
            default:
                // Basic presence check
                analysis.score += config.required ? 8 : 4;
                break;
        }

        return analysis;
    }

    /**
     * Analyze HSTS header
     */
    analyzeHSTS(value, analysis) {
        const hasMaxAge = /max-age=(\d+)/.test(value);
        const maxAge = hasMaxAge ? parseInt(value.match(/max-age=(\d+)/)[1]) : 0;
        const hasIncludeSubDomains = value.includes('includeSubDomains');
        const hasPreload = value.includes('preload');

        let score = 2; // Base score for presence

        if (hasMaxAge) {
            if (maxAge >= 31536000) { // 1 year
                score += 4;
            } else if (maxAge >= 2592000) { // 1 month
                score += 2;
                analysis.recommendations.push('Consider increasing max-age to at least 1 year');
            } else {
                score += 1;
                analysis.issues.push('HSTS max-age is too short');
            }
        } else {
            analysis.issues.push('HSTS missing max-age directive');
        }

        if (hasIncludeSubDomains) {
            score += 2;
        } else {
            analysis.recommendations.push('Consider adding includeSubDomains to HSTS');
        }

        if (hasPreload) {
            score += 2;
        } else {
            analysis.recommendations.push('Consider adding preload to HSTS (after testing)');
        }

        return score;
    }

    /**
     * Analyze Content Security Policy
     */
    analyzeCSP(value, analysis) {
        let score = 3; // Base score for presence

        const directives = value.split(';').map(d => d.trim().split(' ')[0]);
        
        const importantDirectives = [
            'default-src',
            'script-src',
            'style-src',
            'img-src'
        ];

        let hasImportantDirectives = 0;
        importantDirectives.forEach(directive => {
            if (directives.includes(directive)) {
                hasImportantDirectives++;
            }
        });

        score += Math.min(hasImportantDirectives * 1.75, 7); // Up to 7 points

        // Check for unsafe directives
        if (value.includes("'unsafe-eval'")) {
            analysis.issues.push("CSP allows 'unsafe-eval' - security risk");
            score -= 2;
        }

        if (value.includes("'unsafe-inline'")) {
            analysis.recommendations.push("Consider removing 'unsafe-inline' and using nonces/hashes");
        }

        if (!directives.includes('default-src')) {
            analysis.recommendations.push('Add default-src directive to CSP');
        }

        return Math.max(score, 0);
    }

    /**
     * Analyze X-Frame-Options
     */
    analyzeFrameOptions(value, analysis) {
        const upperValue = value.toUpperCase();
        
        if (upperValue === 'DENY') {
            return 8; // Best option
        } else if (upperValue === 'SAMEORIGIN') {
            return 6; // Good option
        } else if (upperValue.startsWith('ALLOW-FROM')) {
            analysis.recommendations.push('Consider using CSP frame-ancestors instead of ALLOW-FROM');
            return 4;
        } else {
            analysis.issues.push('Invalid X-Frame-Options value');
            return 1;
        }
    }

    /**
     * Analyze X-Content-Type-Options
     */
    analyzeContentTypeOptions(value, analysis) {
        if (value.toLowerCase() === 'nosniff') {
            return 8;
        } else {
            analysis.issues.push('X-Content-Type-Options should be "nosniff"');
            return 2;
        }
    }

    /**
     * Analyze Referrer Policy
     */
    analyzeReferrerPolicy(value, analysis) {
        const validPolicies = [
            'strict-origin-when-cross-origin',
            'strict-origin',
            'same-origin',
            'no-referrer'
        ];

        if (validPolicies.includes(value)) {
            return 4;
        } else {
            analysis.recommendations.push('Consider using a more restrictive referrer policy');
            return 2;
        }
    }

    /**
     * Analyze Permissions Policy
     */
    analyzePermissionsPolicy(value, analysis) {
        // Basic presence check - permissions policy is complex
        return 3;
    }

    /**
     * Calculate letter grade from percentage
     */
    calculateGrade(percentage) {
        if (percentage >= 90) return 'A';
        if (percentage >= 80) return 'B';
        if (percentage >= 70) return 'C';
        if (percentage >= 60) return 'D';
        return 'F';
    }

    /**
     * Print analysis results
     */
    printAnalysis(analysis) {
        const gradeColor = analysis.grade === 'A' ? '✅' : 
                          analysis.grade === 'B' ? '🟡' : 
                          analysis.grade === 'C' ? '🟠' : '❌';

        console.log(`   ${gradeColor} Grade: ${analysis.grade} (${analysis.percentage}%)`);
        console.log(`   📊 Score: ${analysis.score}/${analysis.maxScore}`);
        
        if (analysis.missing.length > 0) {
            console.log(`   ❌ Missing headers: ${analysis.missing.join(', ')}`);
        }

        const criticalIssues = analysis.issues.filter(issue => 
            issue.includes('required') || issue.includes('security risk')
        );
        
        if (criticalIssues.length > 0) {
            console.log(`   🚨 Critical issues: ${criticalIssues.length}`);
        }

        console.log('');
    }

    /**
     * Generate comprehensive security report
     */
    async generateReport() {
        console.log('📊 Generating security report...');

        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                totalTargets: Object.keys(this.results).length,
                averageScore: 0,
                grades: { A: 0, B: 0, C: 0, D: 0, F: 0 },
                commonIssues: [],
                criticalCount: 0
            },
            targets: this.results,
            recommendations: this.generateGlobalRecommendations()
        };

        // Calculate summary statistics
        const validResults = Object.values(this.results).filter(r => !r.error);
        
        if (validResults.length > 0) {
            const totalPercentage = validResults.reduce((sum, r) => sum + r.percentage, 0);
            report.summary.averageScore = Math.round(totalPercentage / validResults.length);

            // Count grades
            validResults.forEach(result => {
                report.summary.grades[result.grade]++;
            });

            // Count critical issues
            validResults.forEach(result => {
                report.summary.criticalCount += result.issues.filter(issue => 
                    issue.includes('required') || issue.includes('security risk')
                ).length;
            });
        }

        // Save report
        const reportsDir = 'reports';
        await fs.mkdir(reportsDir, { recursive: true });
        
        const reportFile = path.join(reportsDir, `security-headers-report-${Date.now()}.json`);
        await fs.writeFile(reportFile, JSON.stringify(report, null, 2));
        
        console.log(`✅ Security report saved to: ${reportFile}`);
        
        // Print summary
        console.log(`\n🛡️ Security Headers Summary:`);
        console.log(`   Targets analyzed: ${report.summary.totalTargets}`);
        console.log(`   Average score: ${report.summary.averageScore}%`);
        console.log(`   Grade distribution: A:${report.summary.grades.A} B:${report.summary.grades.B} C:${report.summary.grades.C} D:${report.summary.grades.D} F:${report.summary.grades.F}`);
        console.log(`   Critical issues: ${report.summary.criticalCount}`);

        return report;
    }

    /**
     * Generate global security recommendations
     */
    generateGlobalRecommendations() {
        return [
            {
                category: 'HTTPS',
                priority: 'high',
                title: 'Implement HSTS',
                description: 'Add Strict-Transport-Security header to enforce HTTPS',
                implementation: 'Add header: Strict-Transport-Security: max-age=31536000; includeSubDomains; preload'
            },
            {
                category: 'XSS Protection',
                priority: 'high', 
                title: 'Implement Content Security Policy',
                description: 'Add CSP header to prevent XSS and data injection attacks',
                implementation: 'Add header: Content-Security-Policy with appropriate directives'
            },
            {
                category: 'Clickjacking',
                priority: 'medium',
                title: 'Implement X-Frame-Options',
                description: 'Add X-Frame-Options header to prevent clickjacking',
                implementation: 'Add header: X-Frame-Options: DENY'
            },
            {
                category: 'MIME Sniffing',
                priority: 'medium',
                title: 'Implement X-Content-Type-Options',
                description: 'Add X-Content-Type-Options header to prevent MIME sniffing',
                implementation: 'Add header: X-Content-Type-Options: nosniff'
            }
        ];
    }

    /**
     * Generate security configuration files
     */
    async generateSecurityConfig() {
        console.log('\n🔧 Generating security configuration files...');

        // Generate .htaccess for Apache
        await this.generateHtaccess();
        
        // Generate nginx.conf snippet
        await this.generateNginxConfig();
        
        // Generate _headers file for Netlify
        await this.generateNetlifyHeaders();
        
        // Generate vercel.json configuration
        await this.generateVercelConfig();

        console.log('✅ Security configuration files generated');
    }

    /**
     * Generate .htaccess file
     */
    async generateHtaccess() {
        const htaccess = `# Bitcoin Sovereign Academy - Security Headers
# Generated by Security Headers Analyzer

<IfModule mod_headers.c>
    # HSTS (HTTP Strict Transport Security)
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    
    # Content Security Policy
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:"
    
    # Prevent clickjacking
    Header always set X-Frame-Options "DENY"
    
    # Prevent MIME type sniffing
    Header always set X-Content-Type-Options "nosniff"
    
    # Referrer Policy
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    
    # Permissions Policy
    Header always set Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()"
    
    # Legacy XSS Protection
    Header always set X-XSS-Protection "1; mode=block"
</IfModule>

# Force HTTPS
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>`;

        await fs.writeFile('.htaccess', htaccess);
        console.log('   ✅ Generated .htaccess');
    }

    /**
     * Generate Nginx configuration
     */
    async generateNginxConfig() {
        const nginx = `# Bitcoin Sovereign Academy - Nginx Security Headers
# Add to your server block

# HSTS
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

# Content Security Policy
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:" always;

# Prevent clickjacking
add_header X-Frame-Options "DENY" always;

# Prevent MIME type sniffing
add_header X-Content-Type-Options "nosniff" always;

# Referrer Policy
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# Permissions Policy
add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()" always;

# Force HTTPS redirect
if ($scheme != "https") {
    return 301 https://$host$request_uri;
}`;

        await fs.writeFile('nginx-security.conf', nginx);
        console.log('   ✅ Generated nginx-security.conf');
    }

    /**
     * Generate Netlify _headers file
     */
    async generateNetlifyHeaders() {
        const netlify = `# Bitcoin Sovereign Academy - Netlify Security Headers

/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
  X-XSS-Protection: 1; mode=block`;

        await fs.writeFile('_headers', netlify);
        console.log('   ✅ Generated _headers (Netlify)');
    }

    /**
     * Generate Vercel configuration
     */
    async generateVercelConfig() {
        const vercelConfig = {
            headers: [
                {
                    source: "/(.*)",
                    headers: [
                        {
                            key: "Strict-Transport-Security",
                            value: "max-age=31536000; includeSubDomains; preload"
                        },
                        {
                            key: "Content-Security-Policy", 
                            value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:"
                        },
                        {
                            key: "X-Frame-Options",
                            value: "DENY"
                        },
                        {
                            key: "X-Content-Type-Options",
                            value: "nosniff"
                        },
                        {
                            key: "Referrer-Policy",
                            value: "strict-origin-when-cross-origin"
                        },
                        {
                            key: "Permissions-Policy",
                            value: "camera=(), microphone=(), geolocation=(), payment=()"
                        }
                    ]
                }
            ]
        };

        await fs.writeFile('vercel-security.json', JSON.stringify(vercelConfig, null, 2));
        console.log('   ✅ Generated vercel-security.json');
    }
}

// CLI Interface
if (import.meta.url === `file://${process.argv[1]}`) {
    const analyzer = new SecurityHeadersAnalyzer();
    
    const args = process.argv.slice(2);
    const options = {};
    
    // Parse command line arguments
    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--url':
                options.url = args[++i];
                break;
            case '--fix':
                options.fix = true;
                break;
            case '--help':
                console.log(`
Bitcoin Sovereign Academy - Security Headers Analyzer

Usage: node tools/security-headers.js [options]

Options:
  --url <url>         Analyze specific URL
  --fix              Generate security configuration files
  --help             Show this help message

Examples:
  node tools/security-headers.js
  node tools/security-headers.js --url https://example.com
  node tools/security-headers.js --fix
`);
                process.exit(0);
        }
    }
    
    await analyzer.analyze(options);
}

export default SecurityHeadersAnalyzer;