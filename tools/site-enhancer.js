#!/usr/bin/env node

/**
 * Bitcoin Sovereign Academy - Site Enhancement Suite
 * Integrated Security & SEO optimization tool
 */

import fs from 'fs/promises';
import path from 'path';
import SEOOptimizer from './seo-optimizer.js';
import SecurityHeadersAnalyzer from './security-headers.js';

class SiteEnhancer {
    constructor() {
        this.seoOptimizer = new SEOOptimizer();
        this.securityAnalyzer = new SecurityHeadersAnalyzer();
        this.results = {
            seo: null,
            security: null,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Run comprehensive site enhancement
     */
    async enhance(options = {}) {
        console.log('🚀 Bitcoin Sovereign Academy - Site Enhancement Suite\n');
        console.log('🔍 Running comprehensive SEO & Security analysis...\n');

        try {
            const startTime = Date.now();

            // Run SEO analysis
            if (!options.skipSeo) {
                console.log('📈 SEO Analysis Phase');
                console.log('====================');
                await this.runSEOAnalysis(options);
                console.log('');
            }

            // Run Security analysis  
            if (!options.skipSecurity) {
                console.log('🛡️ Security Analysis Phase');
                console.log('=========================');
                await this.runSecurityAnalysis(options);
                console.log('');
            }

            // Generate combined report
            await this.generateCombinedReport(options);

            // Apply fixes if requested
            if (options.fix) {
                await this.applyEnhancements(options);
            }

            const duration = Math.round((Date.now() - startTime) / 1000);
            console.log(`✅ Site enhancement completed in ${duration}s`);

            return this.results;

        } catch (error) {
            console.error('❌ Site enhancement failed:', error.message);
            process.exit(1);
        }
    }

    /**
     * Run SEO analysis
     */
    async runSEOAnalysis(options) {
        try {
            const seoOptions = {
                directory: options.directory || '.',
                fix: options.fix,
                skipImages: options.skipImages,
                verbose: options.verbose
            };

            this.results.seo = await this.seoOptimizer.optimize(seoOptions);
            
        } catch (error) {
            console.error('⚠️ SEO analysis failed:', error.message);
            this.results.seo = { error: error.message };
        }
    }

    /**
     * Run security headers analysis
     */
    async runSecurityAnalysis(options) {
        try {
            const securityOptions = {
                url: options.url,
                fix: options.fix
            };

            this.results.security = await this.securityAnalyzer.analyze(securityOptions);
            
        } catch (error) {
            console.error('⚠️ Security analysis failed:', error.message);
            this.results.security = { error: error.message };
        }
    }

    /**
     * Generate combined enhancement report
     */
    async generateCombinedReport(options) {
        console.log('📊 Generating Combined Enhancement Report');
        console.log('========================================');

        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                seo: this.getSEOSummary(),
                security: this.getSecuritySummary(),
                overallScore: this.calculateOverallScore(),
                recommendations: this.generateCombinedRecommendations()
            },
            details: {
                seo: this.results.seo,
                security: this.results.security
            },
            metadata: {
                directory: options.directory || '.',
                url: options.url,
                fixesApplied: !!options.fix,
                toolVersion: '1.0.0'
            }
        };

        // Save combined report
        const reportsDir = 'reports';
        await fs.mkdir(reportsDir, { recursive: true });
        
        const reportFile = path.join(reportsDir, `site-enhancement-report-${Date.now()}.json`);
        await fs.writeFile(reportFile, JSON.stringify(report, null, 2));
        
        console.log(`✅ Combined report saved to: ${reportFile}`);
        
        // Print executive summary
        this.printExecutiveSummary(report);

        return report;
    }

    /**
     * Get SEO summary
     */
    getSEOSummary() {
        if (!this.results.seo || this.results.seo.error) {
            return { status: 'error', score: 0, issues: [] };
        }

        const stats = this.results.seo.summary;
        return {
            status: 'success',
            filesProcessed: stats.totalFiles,
            issuesFound: stats.totalIssues,
            issuesFixed: stats.issuesFixed,
            score: this.calculateSEOScore(stats),
            topIssues: this.getTopSEOIssues()
        };
    }

    /**
     * Get Security summary
     */
    getSecuritySummary() {
        if (!this.results.security || this.results.security.error) {
            return { status: 'error', score: 0, issues: [] };
        }

        // Extract security summary from results
        const securityResults = Object.values(this.results.security).filter(r => r && !r.error);
        
        if (securityResults.length === 0) {
            return { status: 'no_data', score: 0, issues: [] };
        }

        const avgScore = securityResults.reduce((sum, r) => sum + (r.percentage || 0), 0) / securityResults.length;
        
        return {
            status: 'success',
            targetsAnalyzed: securityResults.length,
            averageScore: Math.round(avgScore),
            criticalIssues: this.getCriticalSecurityIssues(securityResults),
            recommendations: this.getTopSecurityRecommendations(securityResults)
        };
    }

    /**
     * Calculate overall enhancement score
     */
    calculateOverallScore() {
        const seoWeight = 0.6;
        const securityWeight = 0.4;

        const seoScore = this.getSEOSummary().score || 0;
        const securityScore = this.getSecuritySummary().averageScore || 0;

        return Math.round((seoScore * seoWeight) + (securityScore * securityWeight));
    }

    /**
     * Calculate SEO score from stats
     */
    calculateSEOScore(stats) {
        if (stats.totalIssues === 0) return 100;
        
        const fixedRatio = stats.issuesFixed / stats.totalIssues;
        const baseScore = 100 - (stats.totalIssues * 2); // Deduct 2 points per issue
        
        return Math.max(Math.round(baseScore + (fixedRatio * 20)), 0); // Bonus for fixes
    }

    /**
     * Get top SEO issues
     */
    getTopSEOIssues() {
        if (!this.results.seo || !this.results.seo.files) return [];
        
        const issues = [];
        Object.values(this.results.seo.files).forEach(file => {
            if (file.issues) {
                issues.push(...file.issues);
            }
        });

        // Group by type and count
        const issueMap = {};
        issues.forEach(issue => {
            const type = issue.type || 'general';
            issueMap[type] = (issueMap[type] || 0) + 1;
        });

        // Return top 5 issues
        return Object.entries(issueMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([type, count]) => ({ type, count }));
    }

    /**
     * Get critical security issues
     */
    getCriticalSecurityIssues(securityResults) {
        const criticalIssues = [];
        
        securityResults.forEach(result => {
            if (result.issues) {
                const critical = result.issues.filter(issue => 
                    issue.includes('required') || 
                    issue.includes('security risk') ||
                    issue.includes('Missing required')
                );
                criticalIssues.push(...critical);
            }
        });

        return criticalIssues.slice(0, 10); // Top 10 critical issues
    }

    /**
     * Get top security recommendations
     */
    getTopSecurityRecommendations(securityResults) {
        const recommendations = [];
        
        securityResults.forEach(result => {
            if (result.recommendations) {
                recommendations.push(...result.recommendations);
            }
        });

        // Return unique recommendations (limit to top 5)
        return [...new Set(recommendations)].slice(0, 5);
    }

    /**
     * Generate combined recommendations
     */
    generateCombinedRecommendations() {
        const recommendations = [];

        // High priority recommendations
        recommendations.push({
            category: 'Security',
            priority: 'high',
            title: 'Implement Complete Security Headers',
            description: 'Ensure all critical security headers are properly configured',
            impact: 'Prevents XSS, clickjacking, and other security vulnerabilities'
        });

        recommendations.push({
            category: 'SEO',
            priority: 'high', 
            title: 'Optimize Core Web Vitals',
            description: 'Focus on page loading performance and user experience metrics',
            impact: 'Improves search engine rankings and user satisfaction'
        });

        // Medium priority recommendations
        recommendations.push({
            category: 'Content',
            priority: 'medium',
            title: 'Enhance Structured Data',
            description: 'Add comprehensive schema markup for better search visibility',
            impact: 'Enables rich snippets and improved search appearance'
        });

        recommendations.push({
            category: 'Security',
            priority: 'medium',
            title: 'Review Content Security Policy',
            description: 'Regularly audit and tighten CSP directives',
            impact: 'Reduces XSS attack surface while maintaining functionality'
        });

        return recommendations;
    }

    /**
     * Apply combined enhancements
     */
    async applyEnhancements(options) {
        console.log('🔧 Applying Site Enhancements');
        console.log('=============================');

        let enhancementsApplied = 0;

        try {
            // Apply SEO fixes if SEO was run
            if (this.results.seo && !this.results.seo.error) {
                console.log('📈 Applying SEO enhancements...');
                // SEO fixes are already applied during optimization
                enhancementsApplied += this.results.seo.summary?.issuesFixed || 0;
            }

            // Apply security fixes if security was run
            if (this.results.security && !this.results.security.error) {
                console.log('🛡️ Applying security enhancements...');
                // Generate security config files
                await this.securityAnalyzer.generateSecurityConfig();
                enhancementsApplied += 1;
            }

            // Generate integrated enhancement files
            await this.generateEnhancementFiles(options);

            console.log(`✅ Applied ${enhancementsApplied} site enhancements`);

        } catch (error) {
            console.error('⚠️ Some enhancements failed to apply:', error.message);
        }
    }

    /**
     * Generate integrated enhancement files
     */
    async generateEnhancementFiles(options) {
        console.log('📄 Generating integrated enhancement files...');

        // Generate comprehensive checklist
        await this.generateEnhancementChecklist();

        // Generate monitoring script
        await this.generateMonitoringScript();

        console.log('✅ Enhancement files generated');
    }

    /**
     * Generate enhancement checklist
     */
    async generateEnhancementChecklist() {
        const checklist = {
            "site_enhancement_checklist": {
                "seo": {
                    "meta_tags": [
                        "Title tags (50-60 characters)",
                        "Meta descriptions (150-160 characters)", 
                        "Canonical URLs",
                        "Open Graph tags",
                        "Twitter Card tags"
                    ],
                    "content": [
                        "Header structure (H1, H2, H3)",
                        "Image alt text",
                        "Internal linking",
                        "Structured data (JSON-LD)",
                        "XML sitemap"
                    ],
                    "technical": [
                        "Page loading speed",
                        "Mobile responsiveness",
                        "Core Web Vitals",
                        "URL structure",
                        "SSL certificate"
                    ]
                },
                "security": {
                    "headers": [
                        "Content-Security-Policy",
                        "Strict-Transport-Security",
                        "X-Frame-Options",
                        "X-Content-Type-Options",
                        "Referrer-Policy"
                    ],
                    "configuration": [
                        "HTTPS enforcement",
                        "Security headers validation",
                        "CSP policy testing",
                        "Cookie security flags",
                        "Server configuration"
                    ]
                },
                "monitoring": [
                    "Regular security scans",
                    "SEO performance tracking",
                    "Core Web Vitals monitoring",
                    "Broken link checks",
                    "Site availability monitoring"
                ]
            }
        };

        await fs.writeFile('site-enhancement-checklist.json', JSON.stringify(checklist, null, 2));
        console.log('   ✅ Generated site-enhancement-checklist.json');
    }

    /**
     * Generate monitoring script
     */
    async generateMonitoringScript() {
        const script = `#!/bin/bash

# Bitcoin Sovereign Academy - Site Enhancement Monitor
# Run regular checks on SEO and Security improvements

echo "🚀 Running Site Enhancement Monitor..."
echo "======================================"

# Run SEO check
echo "📈 SEO Check:"
node tools/seo-optimizer.js --directory . --verbose

echo ""

# Run Security check  
echo "🛡️ Security Check:"
node tools/security-headers.js --url https://bitcoinsovereign.academy

echo ""

# Run combined analysis
echo "🔍 Combined Analysis:"
node tools/site-enhancer.js --directory . --url https://bitcoinsovereign.academy

echo "✅ Monitoring complete - check reports/ directory for detailed results"
`;

        await fs.writeFile('monitor-site-enhancements.sh', script);
        
        // Make executable
        await fs.chmod('monitor-site-enhancements.sh', 0o755);
        
        console.log('   ✅ Generated monitor-site-enhancements.sh');
    }

    /**
     * Print executive summary
     */
    printExecutiveSummary(report) {
        console.log(`\n🏆 Executive Summary`);
        console.log(`==================`);
        console.log(`Overall Score: ${report.summary.overallScore}/100`);
        
        const seoSummary = report.summary.seo;
        const secSummary = report.summary.security;
        
        console.log(`\n📈 SEO Status: ${seoSummary.status}`);
        if (seoSummary.status === 'success') {
            console.log(`   Files: ${seoSummary.filesProcessed}, Issues: ${seoSummary.issuesFound}, Fixed: ${seoSummary.issuesFixed}`);
        }
        
        console.log(`\n🛡️ Security Status: ${secSummary.status}`);
        if (secSummary.status === 'success') {
            console.log(`   Score: ${secSummary.averageScore}%, Critical Issues: ${secSummary.criticalIssues.length}`);
        }

        console.log(`\n🎯 Top Recommendations:`);
        report.summary.recommendations.slice(0, 3).forEach((rec, i) => {
            console.log(`   ${i + 1}. [${rec.priority.toUpperCase()}] ${rec.title}`);
        });
    }
}

// CLI Interface
if (import.meta.url === `file://${process.argv[1]}`) {
    const enhancer = new SiteEnhancer();
    
    const args = process.argv.slice(2);
    const options = {};
    
    // Parse command line arguments
    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--directory':
                options.directory = args[++i];
                break;
            case '--url':
                options.url = args[++i];
                break;
            case '--fix':
                options.fix = true;
                break;
            case '--skip-seo':
                options.skipSeo = true;
                break;
            case '--skip-security':
                options.skipSecurity = true;
                break;
            case '--skip-images':
                options.skipImages = true;
                break;
            case '--verbose':
                options.verbose = true;
                break;
            case '--help':
                console.log(`
Bitcoin Sovereign Academy - Site Enhancement Suite

Usage: node tools/site-enhancer.js [options]

Options:
  --directory <path>     Directory to analyze for SEO (default: .)
  --url <url>           URL to analyze for security headers
  --fix                 Apply fixes and generate config files
  --skip-seo           Skip SEO analysis
  --skip-security      Skip security analysis
  --skip-images        Skip image optimization in SEO
  --verbose            Show detailed output
  --help               Show this help message

Examples:
  node tools/site-enhancer.js
  node tools/site-enhancer.js --directory ./src --url https://example.com
  node tools/site-enhancer.js --fix --verbose
  node tools/site-enhancer.js --skip-seo --url https://example.com
`);
                process.exit(0);
        }
    }
    
    await enhancer.enhance(options);
}

export default SiteEnhancer;