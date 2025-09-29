#!/usr/bin/env node

/**
 * Bitcoin Sovereign Academy - SEO Optimizer
 * Automated SEO analysis, optimization, and enhancement tool
 */

import fs from 'fs/promises';
import path from 'path';
import { JSDOM } from 'jsdom';

class SEOOptimizer {
    constructor() {
        this.config = {
            site: {
                title: 'Bitcoin Sovereign Academy',
                description: 'Master Bitcoin through interactive experiences, AI-powered learning, and real-world simulations. Your journey from monetary curiosity to financial sovereignty starts here.',
                url: 'https://bitcoinsovereign.academy',
                image: 'https://bitcoinsovereign.academy/assets/og-image.jpg',
                author: 'Bitcoin Sovereign Academy',
                twitter: '@BitcoinSovereign',
                type: 'website'
            },
            checks: {
                title: { min: 30, max: 60 },
                description: { min: 120, max: 160 },
                h1Count: { min: 1, max: 1 },
                imageAlt: true,
                internalLinks: { min: 3 },
                keywords: ['bitcoin', 'education', 'sovereign', 'academy', 'learning']
            },
            fixes: {
                autoFix: true,
                backupOriginal: true,
                addMissingTags: true,
                optimizeImages: true,
                generateStructuredData: true
            }
        };

        this.results = {};
    }

    /**
     * Main optimization function
     */
    async optimize(options = {}) {
        console.log('🔍 Bitcoin Sovereign Academy - SEO Optimizer\n');

        try {
            const files = await this.findHTMLFiles(options.directory || '.');
            console.log(`📄 Found ${files.length} HTML files to optimize\n`);

            for (const file of files) {
                console.log(`🔍 Analyzing: ${path.basename(file)}`);
                await this.optimizeFile(file, options);
            }

            await this.generateReport();
            
            console.log('\n✅ SEO optimization completed!');

        } catch (error) {
            console.error('❌ SEO optimization failed:', error.message);
            process.exit(1);
        }
    }

    /**
     * Optimize a single HTML file
     */
    async optimizeFile(filePath, options = {}) {
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            const dom = new JSDOM(content);
            const document = dom.window.document;

            const analysis = await this.analyzeFile(document, filePath);
            this.results[filePath] = analysis;

            if (options.fix && this.config.fixes.autoFix) {
                const optimized = await this.applyFixes(document, analysis, filePath);
                if (optimized) {
                    if (this.config.fixes.backupOriginal) {
                        await this.backupFile(filePath);
                    }
                    await fs.writeFile(filePath, dom.serialize());
                    console.log(`   ✅ Optimized and saved`);
                } else {
                    console.log(`   ℹ️  No fixes needed`);
                }
            } else {
                console.log(`   📊 Analysis complete`);
            }

        } catch (error) {
            console.log(`   ❌ Error: ${error.message}`);
            this.results[filePath] = { error: error.message };
        }
    }

    /**
     * Analyze SEO elements in HTML document
     */
    async analyzeFile(document, filePath) {
        const analysis = {
            file: path.basename(filePath),
            score: 0,
            maxScore: 0,
            issues: [],
            recommendations: [],
            elements: {}
        };

        // Title analysis
        const titleAnalysis = this.analyzeTitle(document);
        analysis.elements.title = titleAnalysis;
        this.updateScore(analysis, titleAnalysis);

        // Meta description analysis
        const descriptionAnalysis = this.analyzeDescription(document);
        analysis.elements.description = descriptionAnalysis;
        this.updateScore(analysis, descriptionAnalysis);

        // Heading structure analysis
        const headingAnalysis = this.analyzeHeadings(document);
        analysis.elements.headings = headingAnalysis;
        this.updateScore(analysis, headingAnalysis);

        // Image optimization analysis
        const imageAnalysis = this.analyzeImages(document);
        analysis.elements.images = imageAnalysis;
        this.updateScore(analysis, imageAnalysis);

        // Meta tags analysis
        const metaAnalysis = this.analyzeMetaTags(document);
        analysis.elements.meta = metaAnalysis;
        this.updateScore(analysis, metaAnalysis);

        // Open Graph analysis
        const ogAnalysis = this.analyzeOpenGraph(document);
        analysis.elements.openGraph = ogAnalysis;
        this.updateScore(analysis, ogAnalysis);

        // Structured data analysis
        const structuredDataAnalysis = this.analyzeStructuredData(document);
        analysis.elements.structuredData = structuredDataAnalysis;
        this.updateScore(analysis, structuredDataAnalysis);

        // Internal linking analysis
        const linkAnalysis = this.analyzeInternalLinks(document);
        analysis.elements.links = linkAnalysis;
        this.updateScore(analysis, linkAnalysis);

        // Calculate final score
        analysis.scorePercentage = analysis.maxScore > 0 ? 
            Math.round((analysis.score / analysis.maxScore) * 100) : 0;

        return analysis;
    }

    /**
     * Analyze page title
     */
    analyzeTitle(document) {
        const titleElement = document.querySelector('title');
        const title = titleElement ? titleElement.textContent.trim() : '';
        
        const analysis = {
            exists: !!titleElement,
            content: title,
            length: title.length,
            score: 0,
            maxScore: 10,
            issues: [],
            recommendations: []
        };

        if (!titleElement || !title) {
            analysis.issues.push('Missing page title');
            analysis.recommendations.push('Add a descriptive page title');
        } else {
            analysis.score += 5; // Base score for having title

            if (title.length < this.config.checks.title.min) {
                analysis.issues.push(`Title too short (${title.length} chars, min ${this.config.checks.title.min})`);
                analysis.recommendations.push('Make title more descriptive');
            } else if (title.length > this.config.checks.title.max) {
                analysis.issues.push(`Title too long (${title.length} chars, max ${this.config.checks.title.max})`);
                analysis.recommendations.push('Shorten title for better display in search results');
            } else {
                analysis.score += 3; // Good length
            }

            // Check for Bitcoin-related keywords
            const hasKeywords = this.config.checks.keywords.some(keyword => 
                title.toLowerCase().includes(keyword.toLowerCase())
            );
            if (hasKeywords) {
                analysis.score += 2; // Bonus for relevant keywords
            } else {
                analysis.recommendations.push('Consider including relevant keywords like "Bitcoin" in title');
            }
        }

        return analysis;
    }

    /**
     * Analyze meta description
     */
    analyzeDescription(document) {
        const descElement = document.querySelector('meta[name="description"]');
        const description = descElement ? descElement.getAttribute('content').trim() : '';
        
        const analysis = {
            exists: !!descElement,
            content: description,
            length: description.length,
            score: 0,
            maxScore: 10,
            issues: [],
            recommendations: []
        };

        if (!descElement || !description) {
            analysis.issues.push('Missing meta description');
            analysis.recommendations.push('Add a compelling meta description');
        } else {
            analysis.score += 5; // Base score for having description

            if (description.length < this.config.checks.description.min) {
                analysis.issues.push(`Description too short (${description.length} chars, min ${this.config.checks.description.min})`);
                analysis.recommendations.push('Expand description to better explain page content');
            } else if (description.length > this.config.checks.description.max) {
                analysis.issues.push(`Description too long (${description.length} chars, max ${this.config.checks.description.max})`);
                analysis.recommendations.push('Shorten description for better display in search results');
            } else {
                analysis.score += 3; // Good length
            }

            // Check for keywords
            const hasKeywords = this.config.checks.keywords.some(keyword => 
                description.toLowerCase().includes(keyword.toLowerCase())
            );
            if (hasKeywords) {
                analysis.score += 2; // Bonus for relevant keywords
            } else {
                analysis.recommendations.push('Include relevant keywords in description');
            }
        }

        return analysis;
    }

    /**
     * Analyze heading structure
     */
    analyzeHeadings(document) {
        const h1Elements = document.querySelectorAll('h1');
        const h2Elements = document.querySelectorAll('h2');
        const h3Elements = document.querySelectorAll('h3');
        
        const analysis = {
            h1Count: h1Elements.length,
            h2Count: h2Elements.length,
            h3Count: h3Elements.length,
            score: 0,
            maxScore: 8,
            issues: [],
            recommendations: []
        };

        // H1 analysis
        if (h1Elements.length === 0) {
            analysis.issues.push('Missing H1 heading');
            analysis.recommendations.push('Add an H1 heading to define page topic');
        } else if (h1Elements.length === 1) {
            analysis.score += 4; // Perfect H1 count
        } else {
            analysis.issues.push(`Multiple H1 headings (${h1Elements.length})`);
            analysis.recommendations.push('Use only one H1 per page');
            analysis.score += 2; // Partial credit
        }

        // H2 structure analysis
        if (h2Elements.length > 0) {
            analysis.score += 2; // Good for having H2s
        } else {
            analysis.recommendations.push('Consider adding H2 headings to structure content');
        }

        // Hierarchical structure check
        if (h3Elements.length > 0 && h2Elements.length === 0) {
            analysis.issues.push('H3 elements without H2 parent headings');
            analysis.recommendations.push('Ensure proper heading hierarchy (H1 > H2 > H3)');
        } else if (h2Elements.length > 0 || h3Elements.length > 0) {
            analysis.score += 2; // Good structure
        }

        return analysis;
    }

    /**
     * Analyze images
     */
    analyzeImages(document) {
        const images = document.querySelectorAll('img');
        let imagesWithAlt = 0;
        let imagesWithoutAlt = 0;
        
        const analysis = {
            totalImages: images.length,
            withAlt: 0,
            withoutAlt: 0,
            score: 0,
            maxScore: 6,
            issues: [],
            recommendations: []
        };

        images.forEach(img => {
            const alt = img.getAttribute('alt');
            if (alt && alt.trim()) {
                imagesWithAlt++;
            } else {
                imagesWithoutAlt++;
            }
        });

        analysis.withAlt = imagesWithAlt;
        analysis.withoutAlt = imagesWithoutAlt;

        if (images.length === 0) {
            analysis.score += 3; // No images to worry about
        } else {
            const altPercentage = (imagesWithAlt / images.length) * 100;
            
            if (altPercentage === 100) {
                analysis.score += 6; // Perfect alt text coverage
            } else if (altPercentage >= 80) {
                analysis.score += 4; // Good alt text coverage
                analysis.recommendations.push(`Add alt text to remaining ${imagesWithoutAlt} images`);
            } else if (altPercentage >= 50) {
                analysis.score += 2; // Partial alt text coverage
                analysis.issues.push(`${imagesWithoutAlt} images missing alt text`);
                analysis.recommendations.push('Add descriptive alt text to all images');
            } else {
                analysis.issues.push(`Most images (${imagesWithoutAlt}/${images.length}) missing alt text`);
                analysis.recommendations.push('Add descriptive alt text to all images for accessibility');
            }
        }

        return analysis;
    }

    /**
     * Analyze meta tags
     */
    analyzeMetaTags(document) {
        const analysis = {
            viewport: !!document.querySelector('meta[name="viewport"]'),
            charset: !!document.querySelector('meta[charset]'),
            robots: !!document.querySelector('meta[name="robots"]'),
            canonical: !!document.querySelector('link[rel="canonical"]'),
            score: 0,
            maxScore: 8,
            issues: [],
            recommendations: []
        };

        // Viewport
        if (analysis.viewport) {
            analysis.score += 2;
        } else {
            analysis.issues.push('Missing viewport meta tag');
            analysis.recommendations.push('Add viewport meta tag for mobile responsiveness');
        }

        // Charset
        if (analysis.charset) {
            analysis.score += 2;
        } else {
            analysis.issues.push('Missing charset declaration');
            analysis.recommendations.push('Add charset meta tag (preferably UTF-8)');
        }

        // Robots
        if (analysis.robots) {
            analysis.score += 2;
        } else {
            analysis.recommendations.push('Consider adding robots meta tag for search engine control');
        }

        // Canonical
        if (analysis.canonical) {
            analysis.score += 2;
        } else {
            analysis.recommendations.push('Add canonical link to prevent duplicate content issues');
        }

        return analysis;
    }

    /**
     * Analyze Open Graph tags
     */
    analyzeOpenGraph(document) {
        const analysis = {
            title: !!document.querySelector('meta[property="og:title"]'),
            description: !!document.querySelector('meta[property="og:description"]'),
            image: !!document.querySelector('meta[property="og:image"]'),
            url: !!document.querySelector('meta[property="og:url"]'),
            type: !!document.querySelector('meta[property="og:type"]'),
            score: 0,
            maxScore: 10,
            issues: [],
            recommendations: []
        };

        const ogTags = Object.keys(analysis).filter(key => 
            key !== 'score' && key !== 'maxScore' && key !== 'issues' && key !== 'recommendations'
        );
        
        const presentTags = ogTags.filter(tag => analysis[tag]);
        
        if (presentTags.length === 0) {
            analysis.issues.push('No Open Graph tags found');
            analysis.recommendations.push('Add Open Graph tags for better social media sharing');
        } else if (presentTags.length === ogTags.length) {
            analysis.score += 10; // Perfect Open Graph coverage
        } else {
            analysis.score += (presentTags.length / ogTags.length) * 10;
            const missingTags = ogTags.filter(tag => !analysis[tag]);
            analysis.recommendations.push(`Add missing Open Graph tags: ${missingTags.join(', ')}`);
        }

        return analysis;
    }

    /**
     * Analyze structured data
     */
    analyzeStructuredData(document) {
        const jsonLd = document.querySelectorAll('script[type="application/ld+json"]');
        const microdata = document.querySelectorAll('[itemtype]');
        
        const analysis = {
            jsonLdCount: jsonLd.length,
            microdataCount: microdata.length,
            hasStructuredData: jsonLd.length > 0 || microdata.length > 0,
            score: 0,
            maxScore: 6,
            issues: [],
            recommendations: []
        };

        if (analysis.hasStructuredData) {
            analysis.score += 6;
        } else {
            analysis.recommendations.push('Add structured data (JSON-LD or microdata) for better search results');
        }

        return analysis;
    }

    /**
     * Analyze internal links
     */
    analyzeInternalLinks(document) {
        const allLinks = document.querySelectorAll('a[href]');
        let internalLinks = 0;
        let externalLinks = 0;

        allLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href.startsWith('/') || href.startsWith('#') || href.startsWith('./')) {
                internalLinks++;
            } else if (href.startsWith('http')) {
                externalLinks++;
            }
        });

        const analysis = {
            totalLinks: allLinks.length,
            internalLinks,
            externalLinks,
            score: 0,
            maxScore: 4,
            issues: [],
            recommendations: []
        };

        if (internalLinks >= this.config.checks.internalLinks.min) {
            analysis.score += 4;
        } else if (internalLinks > 0) {
            analysis.score += 2;
            analysis.recommendations.push(`Add more internal links (currently ${internalLinks}, recommended ${this.config.checks.internalLinks.min}+)`);
        } else {
            analysis.issues.push('No internal links found');
            analysis.recommendations.push('Add internal links to improve site navigation and SEO');
        }

        return analysis;
    }

    /**
     * Apply automated fixes to document
     */
    async applyFixes(document, analysis, filePath) {
        let hasChanges = false;

        // Fix missing title
        if (!analysis.elements.title.exists && this.config.fixes.addMissingTags) {
            const title = document.createElement('title');
            title.textContent = this.generateTitle(filePath);
            document.head.appendChild(title);
            hasChanges = true;
            console.log('   🔧 Added page title');
        }

        // Fix missing meta description
        if (!analysis.elements.description.exists && this.config.fixes.addMissingTags) {
            const meta = document.createElement('meta');
            meta.setAttribute('name', 'description');
            meta.setAttribute('content', this.generateDescription(filePath));
            document.head.appendChild(meta);
            hasChanges = true;
            console.log('   🔧 Added meta description');
        }

        // Fix missing viewport
        if (!analysis.elements.meta.viewport && this.config.fixes.addMissingTags) {
            const viewport = document.createElement('meta');
            viewport.setAttribute('name', 'viewport');
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
            document.head.appendChild(viewport);
            hasChanges = true;
            console.log('   🔧 Added viewport meta tag');
        }

        // Add canonical link
        if (!analysis.elements.meta.canonical && this.config.fixes.addMissingTags) {
            const canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            canonical.setAttribute('href', this.generateCanonicalUrl(filePath));
            document.head.appendChild(canonical);
            hasChanges = true;
            console.log('   🔧 Added canonical link');
        }

        // Add Open Graph tags
        if (this.config.fixes.addMissingTags) {
            const ogFixes = this.addOpenGraphTags(document, analysis, filePath);
            if (ogFixes) {
                hasChanges = true;
            }
        }

        // Add structured data
        if (!analysis.elements.structuredData.hasStructuredData && this.config.fixes.generateStructuredData) {
            const structuredData = this.generateStructuredData(filePath);
            const script = document.createElement('script');
            script.setAttribute('type', 'application/ld+json');
            script.textContent = JSON.stringify(structuredData, null, 2);
            document.head.appendChild(script);
            hasChanges = true;
            console.log('   🔧 Added structured data');
        }

        return hasChanges;
    }

    /**
     * Add Open Graph tags
     */
    addOpenGraphTags(document, analysis, filePath) {
        let hasChanges = false;
        const og = analysis.elements.openGraph;

        if (!og.title) {
            const meta = document.createElement('meta');
            meta.setAttribute('property', 'og:title');
            meta.setAttribute('content', this.generateTitle(filePath));
            document.head.appendChild(meta);
            hasChanges = true;
        }

        if (!og.description) {
            const meta = document.createElement('meta');
            meta.setAttribute('property', 'og:description');
            meta.setAttribute('content', this.generateDescription(filePath));
            document.head.appendChild(meta);
            hasChanges = true;
        }

        if (!og.image) {
            const meta = document.createElement('meta');
            meta.setAttribute('property', 'og:image');
            meta.setAttribute('content', this.config.site.image);
            document.head.appendChild(meta);
            hasChanges = true;
        }

        if (!og.url) {
            const meta = document.createElement('meta');
            meta.setAttribute('property', 'og:url');
            meta.setAttribute('content', this.generateCanonicalUrl(filePath));
            document.head.appendChild(meta);
            hasChanges = true;
        }

        if (!og.type) {
            const meta = document.createElement('meta');
            meta.setAttribute('property', 'og:type');
            meta.setAttribute('content', this.config.site.type);
            document.head.appendChild(meta);
            hasChanges = true;
        }

        if (hasChanges) {
            console.log('   🔧 Added Open Graph tags');
        }

        return hasChanges;
    }

    /**
     * Generate page title based on file path
     */
    generateTitle(filePath) {
        const basename = path.basename(filePath, '.html');
        
        if (basename === 'index') {
            return this.config.site.title;
        }
        
        const formatted = basename
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
        
        return `${formatted} - ${this.config.site.title}`;
    }

    /**
     * Generate meta description based on file path
     */
    generateDescription(filePath) {
        const basename = path.basename(filePath, '.html');
        
        if (basename === 'index') {
            return this.config.site.description;
        }
        
        return `Learn about ${basename.replace(/[-_]/g, ' ')} at Bitcoin Sovereign Academy. Interactive Bitcoin education with hands-on exercises and expert guidance.`;
    }

    /**
     * Generate canonical URL
     */
    generateCanonicalUrl(filePath) {
        const basename = path.basename(filePath, '.html');
        const relativePath = basename === 'index' ? '' : basename + '.html';
        return `${this.config.site.url}/${relativePath}`;
    }

    /**
     * Generate structured data
     */
    generateStructuredData(filePath) {
        const basename = path.basename(filePath, '.html');
        
        return {
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": this.config.site.title,
            "description": this.config.site.description,
            "url": this.config.site.url,
            "logo": this.config.site.image,
            "sameAs": [
                "https://github.com/Sovereigndwp/bitcoin-sovereign-academy"
            ],
            "educationalLevel": "Beginner to Advanced",
            "teaches": [
                "Bitcoin Fundamentals",
                "Cryptocurrency Technology", 
                "Financial Sovereignty",
                "Digital Asset Security"
            ],
            "audience": {
                "@type": "Audience",
                "audienceType": "Students interested in Bitcoin and cryptocurrency"
            }
        };
    }

    /**
     * Backup original file
     */
    async backupFile(filePath) {
        const backupPath = filePath + '.backup';
        const content = await fs.readFile(filePath, 'utf-8');
        await fs.writeFile(backupPath, content);
    }

    /**
     * Update analysis score
     */
    updateScore(analysis, elementAnalysis) {
        analysis.score += elementAnalysis.score;
        analysis.maxScore += elementAnalysis.maxScore;
        analysis.issues.push(...elementAnalysis.issues);
        analysis.recommendations.push(...elementAnalysis.recommendations);
    }

    /**
     * Find HTML files
     */
    async findHTMLFiles(directory) {
        const files = [];
        
        async function scanDirectory(dir) {
            const entries = await fs.readdir(dir, { withFileTypes: true });
            
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                
                if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
                    await scanDirectory(fullPath);
                } else if (entry.isFile() && entry.name.endsWith('.html')) {
                    files.push(fullPath);
                }
            }
        }
        
        await scanDirectory(directory);
        return files;
    }

    /**
     * Generate comprehensive report
     */
    async generateReport() {
        console.log('\n📊 Generating SEO report...');
        
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                totalFiles: Object.keys(this.results).length,
                averageScore: 0,
                totalIssues: 0,
                totalRecommendations: 0
            },
            files: this.results
        };

        // Calculate summary statistics
        const scores = Object.values(this.results)
            .filter(r => !r.error && r.scorePercentage !== undefined)
            .map(r => r.scorePercentage);
        
        if (scores.length > 0) {
            report.summary.averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        }

        Object.values(this.results).forEach(result => {
            if (!result.error) {
                report.summary.totalIssues += result.issues.length;
                report.summary.totalRecommendations += result.recommendations.length;
            }
        });

        // Save report
        const reportsDir = 'reports';
        await fs.mkdir(reportsDir, { recursive: true });
        
        const reportFile = path.join(reportsDir, `seo-report-${Date.now()}.json`);
        await fs.writeFile(reportFile, JSON.stringify(report, null, 2));
        
        console.log(`✅ SEO report saved to: ${reportFile}`);
        
        // Print summary
        console.log(`\n📈 SEO Analysis Summary:`);
        console.log(`   Files analyzed: ${report.summary.totalFiles}`);
        console.log(`   Average score: ${report.summary.averageScore}%`);
        console.log(`   Total issues: ${report.summary.totalIssues}`);
        console.log(`   Total recommendations: ${report.summary.totalRecommendations}`);

        return report;
    }
}

// CLI Interface
if (import.meta.url === `file://${process.argv[1]}`) {
    const optimizer = new SEOOptimizer();
    
    const args = process.argv.slice(2);
    const options = {};
    
    // Parse command line arguments
    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--fix':
                options.fix = true;
                break;
            case '--directory':
                options.directory = args[++i];
                break;
            case '--help':
                console.log(`
Bitcoin Sovereign Academy - SEO Optimizer

Usage: node tools/seo-optimizer.js [options]

Options:
  --fix                Apply automated SEO fixes
  --directory <path>   Target directory (default: current)
  --help              Show this help message

Examples:
  node tools/seo-optimizer.js
  node tools/seo-optimizer.js --fix
  node tools/seo-optimizer.js --directory ./docs --fix
`);
                process.exit(0);
        }
    }
    
    await optimizer.optimize(options);
}

export default SEOOptimizer;