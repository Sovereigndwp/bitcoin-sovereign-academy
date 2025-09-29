#!/usr/bin/env node

/**
 * Bitcoin Sovereign Academy - Content Validator
 * HTML validation, accessibility checks, and content optimization
 */

import fs from 'fs/promises';
import path from 'path';
import { JSDOM } from 'jsdom';

class ContentValidator {
    constructor() {
        this.config = {
            accessibility: {
                checkAltText: true,
                checkHeadingStructure: true,
                checkColorContrast: false,
                checkFormLabels: true,
                checkAriaLabels: true
            },
            html: {
                checkDoctype: true,
                checkMetaTags: true,
                checkStructure: true,
                checkValidation: true
            },
            content: {
                checkSpelling: false,
                checkReadability: true,
                checkLinks: true,
                minWordCount: 100
            }
        };
        this.results = {};
    }

    async validate(options = {}) {
        console.log('🔍 Bitcoin Sovereign Academy - Content Validator\n');

        const files = await this.findHTMLFiles(options.directory || '.');
        console.log(`📄 Found ${files.length} HTML files to validate\n`);

        for (const file of files) {
            console.log(`🔍 Validating: ${path.basename(file)}`);
            await this.validateFile(file, options);
        }

        await this.generateReport();
        console.log('\n✅ Content validation completed!');
    }

    async validateFile(filePath, options = {}) {
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            const dom = new JSDOM(content);
            const document = dom.window.document;

            const validation = {
                file: path.basename(filePath),
                score: 0,
                maxScore: 0,
                issues: [],
                warnings: [],
                recommendations: []
            };

            // HTML Structure validation
            const htmlCheck = this.validateHTML(document);
            this.updateValidation(validation, htmlCheck);

            // Accessibility validation
            const a11yCheck = this.validateAccessibility(document);
            this.updateValidation(validation, a11yCheck);

            // Content quality validation
            const contentCheck = this.validateContent(document);
            this.updateValidation(validation, contentCheck);

            validation.percentage = validation.maxScore > 0 ? 
                Math.round((validation.score / validation.maxScore) * 100) : 0;

            this.results[filePath] = validation;
            console.log(`   📊 Score: ${validation.score}/${validation.maxScore} (${validation.percentage}%)`);

        } catch (error) {
            console.log(`   ❌ Error: ${error.message}`);
            this.results[filePath] = { error: error.message };
        }
    }

    validateHTML(document) {
        const validation = { score: 0, maxScore: 40, issues: [], warnings: [], recommendations: [] };

        // Check DOCTYPE
        const doctype = document.doctype;
        if (!doctype || doctype.name !== 'html') {
            validation.issues.push('Missing or invalid HTML5 DOCTYPE');
        } else {
            validation.score += 5;
        }

        // Check required meta tags
        const charset = document.querySelector('meta[charset]');
        const viewport = document.querySelector('meta[name="viewport"]');
        const title = document.querySelector('title');

        if (!charset) {
            validation.issues.push('Missing charset meta tag');
        } else {
            validation.score += 5;
        }

        if (!viewport) {
            validation.issues.push('Missing viewport meta tag');
        } else {
            validation.score += 5;
        }

        if (!title || !title.textContent.trim()) {
            validation.issues.push('Missing or empty page title');
        } else {
            validation.score += 10;
        }

        // Check HTML structure
        const html = document.documentElement;
        const head = document.head;
        const body = document.body;

        if (!html.getAttribute('lang')) {
            validation.warnings.push('Missing lang attribute on html element');
        } else {
            validation.score += 5;
        }

        if (head && body) {
            validation.score += 10;
        } else {
            validation.issues.push('Invalid HTML structure - missing head or body');
        }

        return validation;
    }

    validateAccessibility(document) {
        const validation = { score: 0, maxScore: 60, issues: [], warnings: [], recommendations: [] };

        // Check images for alt text
        const images = document.querySelectorAll('img');
        let imagesWithAlt = 0;
        images.forEach(img => {
            const alt = img.getAttribute('alt');
            if (alt !== null) {
                imagesWithAlt++;
            }
        });

        if (images.length === 0) {
            validation.score += 10;
        } else {
            const altPercentage = (imagesWithAlt / images.length) * 100;
            if (altPercentage === 100) {
                validation.score += 10;
            } else if (altPercentage >= 80) {
                validation.score += 7;
                validation.warnings.push(`${images.length - imagesWithAlt} images missing alt text`);
            } else {
                validation.issues.push(`${images.length - imagesWithAlt} images missing alt text`);
                validation.score += Math.round(altPercentage / 10);
            }
        }

        // Check heading structure
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const h1s = document.querySelectorAll('h1');
        
        if (h1s.length === 0) {
            validation.warnings.push('No H1 heading found');
        } else if (h1s.length === 1) {
            validation.score += 10;
        } else {
            validation.warnings.push(`Multiple H1 headings (${h1s.length})`);
            validation.score += 5;
        }

        // Check heading hierarchy
        if (headings.length > 0) {
            validation.score += 10;
        } else {
            validation.recommendations.push('Add headings to structure content');
        }

        // Check form labels
        const forms = document.querySelectorAll('input, select, textarea');
        let formsWithLabels = 0;
        forms.forEach(form => {
            const id = form.getAttribute('id');
            const ariaLabel = form.getAttribute('aria-label');
            const label = id ? document.querySelector(`label[for="${id}"]`) : null;
            
            if (label || ariaLabel) {
                formsWithLabels++;
            }
        });

        if (forms.length === 0) {
            validation.score += 15;
        } else {
            const labelPercentage = (formsWithLabels / forms.length) * 100;
            if (labelPercentage === 100) {
                validation.score += 15;
            } else {
                validation.issues.push(`${forms.length - formsWithLabels} form elements missing labels`);
                validation.score += Math.round((labelPercentage / 100) * 15);
            }
        }

        // Check links
        const links = document.querySelectorAll('a');
        let validLinks = 0;
        links.forEach(link => {
            const href = link.getAttribute('href');
            const text = link.textContent.trim();
            
            if (href && text && text !== 'click here' && text !== 'read more') {
                validLinks++;
            }
        });

        if (links.length === 0) {
            validation.score += 15;
        } else {
            const linkPercentage = (validLinks / links.length) * 100;
            validation.score += Math.round((linkPercentage / 100) * 15);
            
            if (linkPercentage < 100) {
                validation.recommendations.push('Improve link text to be more descriptive');
            }
        }

        return validation;
    }

    validateContent(document) {
        const validation = { score: 0, maxScore: 30, issues: [], warnings: [], recommendations: [] };

        // Check content length
        const bodyText = document.body ? document.body.textContent.trim() : '';
        const wordCount = bodyText.split(/\s+/).filter(word => word.length > 0).length;

        if (wordCount >= this.config.content.minWordCount) {
            validation.score += 10;
        } else {
            validation.warnings.push(`Low word count: ${wordCount} words (minimum: ${this.config.content.minWordCount})`);
            validation.score += Math.round((wordCount / this.config.content.minWordCount) * 10);
        }

        // Check for proper paragraph structure
        const paragraphs = document.querySelectorAll('p');
        if (paragraphs.length > 0) {
            validation.score += 10;
        } else {
            validation.recommendations.push('Use paragraph tags for better content structure');
        }

        // Check for lists when appropriate
        const lists = document.querySelectorAll('ul, ol');
        if (lists.length > 0) {
            validation.score += 5;
        }

        // Check internal links
        const internalLinks = document.querySelectorAll('a[href^="/"], a[href^="#"], a[href^="./"]');
        if (internalLinks.length >= 2) {
            validation.score += 5;
        } else {
            validation.recommendations.push('Add more internal links for better navigation');
        }

        return validation;
    }

    updateValidation(validation, check) {
        validation.score += check.score;
        validation.maxScore += check.maxScore;
        validation.issues.push(...check.issues);
        validation.warnings.push(...check.warnings);
        validation.recommendations.push(...check.recommendations);
    }

    async findHTMLFiles(directory) {
        const files = [];
        async function scan(dir) {
            const entries = await fs.readdir(dir, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
                    await scan(fullPath);
                } else if (entry.isFile() && entry.name.endsWith('.html')) {
                    files.push(fullPath);
                }
            }
        }
        await scan(directory);
        return files;
    }

    async generateReport() {
        console.log('\n📊 Generating content validation report...');

        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                totalFiles: Object.keys(this.results).length,
                averageScore: 0,
                totalIssues: 0,
                totalWarnings: 0,
                totalRecommendations: 0
            },
            files: this.results
        };

        const validResults = Object.values(this.results).filter(r => !r.error);
        if (validResults.length > 0) {
            report.summary.averageScore = Math.round(
                validResults.reduce((sum, r) => sum + r.percentage, 0) / validResults.length
            );
            
            validResults.forEach(result => {
                report.summary.totalIssues += result.issues.length;
                report.summary.totalWarnings += result.warnings.length;
                report.summary.totalRecommendations += result.recommendations.length;
            });
        }

        const reportsDir = 'reports';
        await fs.mkdir(reportsDir, { recursive: true });
        
        const reportFile = path.join(reportsDir, `content-validation-report-${Date.now()}.json`);
        await fs.writeFile(reportFile, JSON.stringify(report, null, 2));
        
        console.log(`✅ Report saved to: ${reportFile}`);
        console.log(`📈 Summary: ${report.summary.totalFiles} files, ${report.summary.averageScore}% avg score`);
        console.log(`📋 Issues: ${report.summary.totalIssues}, Warnings: ${report.summary.totalWarnings}, Recommendations: ${report.summary.totalRecommendations}`);

        return report;
    }
}

// CLI Interface
if (import.meta.url === `file://${process.argv[1]}`) {
    const validator = new ContentValidator();
    const args = process.argv.slice(2);
    const options = {};
    
    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--directory':
                options.directory = args[++i];
                break;
            case '--help':
                console.log(`
Bitcoin Sovereign Academy - Content Validator

Usage: node tools/content-validator.js [options]

Options:
  --directory <path>   Target directory (default: current)
  --help              Show this help message

Examples:
  node tools/content-validator.js
  node tools/content-validator.js --directory ./docs
`);
                process.exit(0);
        }
    }
    
    await validator.validate(options);
}

export default ContentValidator;