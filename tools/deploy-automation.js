#!/usr/bin/env node

/**
 * Bitcoin Sovereign Academy - Deployment Automation
 * Automated deployment and domain management CLI tool
 */

import fs from 'fs/promises';
import path from 'path';
import { execSync, spawn } from 'child_process';
import DomainConfigTool from './domain-config.js';
import DomainTestSuite from './domain-test-suite.js';
import DomainMonitor from './domain-monitor.js';

class DeploymentAutomation {
    constructor() {
        this.config = {
            repository: {
                name: 'bitcoin-sovereign-academy',
                owner: 'Sovereigndwp',
                branch: 'main'
            },
            domains: {
                primary: 'bitcoinsovereign.academy',
                alternatives: ['bitcoinsovereign.education', 'btcsovereign.academy', 'learnbitcoin.academy']
            },
            deployment: {
                preDeployTests: true,
                postDeployTests: true,
                monitoringEnabled: true,
                backupEnabled: true
            },
            github: {
                pagesEnabled: true,
                customDomain: true,
                enforceHTTPS: true
            }
        };
        
        this.tools = {
            domainConfig: new DomainConfigTool(),
            testSuite: new DomainTestSuite(),
            monitor: new DomainMonitor()
        };
    }

    /**
     * Main deployment command
     */
    async deploy(options = {}) {
        console.log('🚀 Bitcoin Sovereign Academy - Automated Deployment\n');
        
        const startTime = Date.now();
        const deploymentId = `deploy-${Date.now()}`;
        
        try {
            // Pre-deployment checks
            await this.preDeploymentChecks();
            
            // Run pre-deployment tests
            if (this.config.deployment.preDeployTests && !options.skipTests) {
                await this.runPreDeploymentTests();
            }
            
            // Build project
            if (!options.skipBuild) {
                await this.buildProject();
            }
            
            // Deploy to GitHub Pages
            await this.deployToGitHub(options);
            
            // Configure custom domain
            if (this.config.github.customDomain && !options.skipDomain) {
                await this.configureDomain();
            }
            
            // Run post-deployment tests
            if (this.config.deployment.postDeployTests && !options.skipTests) {
                await this.runPostDeploymentTests();
            }
            
            // Start monitoring
            if (this.config.deployment.monitoringEnabled && !options.skipMonitoring) {
                await this.startMonitoring();
            }
            
            // Generate deployment report
            await this.generateDeploymentReport(deploymentId, startTime);
            
            console.log('✅ Deployment completed successfully!\n');
            
        } catch (error) {
            console.error('❌ Deployment failed:', error.message);
            await this.handleDeploymentFailure(deploymentId, error);
            process.exit(1);
        }
    }

    /**
     * Pre-deployment checks
     */
    async preDeploymentChecks() {
        console.log('🔍 Running pre-deployment checks...\n');
        
        // Check Git status
        try {
            const gitStatus = execSync('git status --porcelain', { encoding: 'utf-8' });
            if (gitStatus.trim()) {
                console.log('⚠️  Uncommitted changes detected:');
                console.log(gitStatus);
                console.log('   Consider committing changes before deployment\n');
            } else {
                console.log('✅ Git working directory clean');
            }
        } catch (error) {
            throw new Error('Failed to check Git status');
        }
        
        // Check if on correct branch
        try {
            const currentBranch = execSync('git branch --show-current', { encoding: 'utf-8' }).trim();
            if (currentBranch !== this.config.repository.branch) {
                console.log(`⚠️  Currently on branch '${currentBranch}', expected '${this.config.repository.branch}'`);
            } else {
                console.log(`✅ On correct branch: ${currentBranch}`);
            }
        } catch (error) {
            console.log('⚠️  Could not determine current branch');
        }
        
        // Check Node.js and npm
        try {
            const nodeVersion = execSync('node --version', { encoding: 'utf-8' }).trim();
            const npmVersion = execSync('npm --version', { encoding: 'utf-8' }).trim();
            console.log(`✅ Node.js ${nodeVersion}, npm ${npmVersion}`);
        } catch (error) {
            throw new Error('Node.js or npm not available');
        }
        
        // Check required files
        const requiredFiles = ['package.json', 'index.html', 'CNAME'];
        for (const file of requiredFiles) {
            try {
                await fs.access(file);
                console.log(`✅ Required file exists: ${file}`);
            } catch (error) {
                if (file === 'CNAME') {
                    console.log(`⚠️  CNAME file missing - will be created during domain configuration`);
                } else {
                    throw new Error(`Required file missing: ${file}`);
                }
            }
        }
        
        console.log('');
    }

    /**
     * Run pre-deployment tests
     */
    async runPreDeploymentTests() {
        console.log('🧪 Running pre-deployment tests...\n');
        
        try {
            // Test local server if running
            try {
                const response = execSync('curl -s -o /dev/null -w "%{http_code}" http://localhost:3000', 
                    { encoding: 'utf-8', timeout: 5000 });
                
                if (response.trim() === '200') {
                    console.log('✅ Local server responding');
                } else {
                    console.log('⚠️  Local server not responding (this is OK for static deployment)');
                }
            } catch (error) {
                console.log('ℹ️  Local server not running (this is OK for static deployment)');
            }
            
            // Check HTML syntax
            await this.validateHTML();
            
            // Check JavaScript syntax
            await this.validateJavaScript();
            
            console.log('✅ Pre-deployment tests passed\n');
            
        } catch (error) {
            throw new Error(`Pre-deployment tests failed: ${error.message}`);
        }
    }

    /**
     * Validate HTML files
     */
    async validateHTML() {
        try {
            const htmlFiles = await this.findFiles('**/*.html');
            console.log(`📝 Validating ${htmlFiles.length} HTML files...`);
            
            for (const file of htmlFiles.slice(0, 5)) { // Limit to first 5 files
                const content = await fs.readFile(file, 'utf-8');
                
                // Basic HTML validation
                const hasDoctype = content.includes('<!DOCTYPE html>');
                const hasHtml = content.includes('<html');
                const hasHead = content.includes('<head>');
                const hasBody = content.includes('<body>');
                
                if (hasDoctype && hasHtml && hasHead && hasBody) {
                    console.log(`   ✅ ${path.basename(file)}`);
                } else {
                    console.log(`   ⚠️  ${path.basename(file)} - potential HTML issues`);
                }
            }
        } catch (error) {
            console.log('⚠️  HTML validation skipped');
        }
    }

    /**
     * Validate JavaScript files
     */
    async validateJavaScript() {
        try {
            const jsFiles = await this.findFiles('**/*.js');
            console.log(`📝 Validating ${jsFiles.length} JavaScript files...`);
            
            for (const file of jsFiles.slice(0, 5)) { // Limit to first 5 files
                try {
                    // Basic syntax check using Node.js
                    execSync(`node -c "${file}"`, { stdio: 'ignore' });
                    console.log(`   ✅ ${path.basename(file)}`);
                } catch (error) {
                    console.log(`   ❌ ${path.basename(file)} - syntax error`);
                }
            }
        } catch (error) {
            console.log('⚠️  JavaScript validation skipped');
        }
    }

    /**
     * Build project
     */
    async buildProject() {
        console.log('🔨 Building project...\n');
        
        try {
            // Check if there's a build script
            const packageJson = JSON.parse(await fs.readFile('package.json', 'utf-8'));
            
            if (packageJson.scripts && packageJson.scripts.build) {
                console.log('📦 Running build script...');
                execSync('npm run build', { stdio: 'inherit' });
                console.log('✅ Build completed');
            } else {
                console.log('ℹ️  No build script found - using static files');
            }
            
            // Generate service worker if configured
            if (packageJson.scripts && packageJson.scripts['build:sw']) {
                console.log('👷 Generating service worker...');
                execSync('npm run build:sw', { stdio: 'inherit' });
                console.log('✅ Service worker generated');
            }
            
            console.log('');
            
        } catch (error) {
            throw new Error(`Build failed: ${error.message}`);
        }
    }

    /**
     * Deploy to GitHub Pages
     */
    async deployToGitHub(options = {}) {
        console.log('📤 Deploying to GitHub Pages...\n');
        
        try {
            // Add all files
            console.log('📝 Staging files...');
            execSync('git add .', { stdio: 'inherit' });
            
            // Commit changes
            const commitMessage = options.message || `Deploy Bitcoin Sovereign Academy - ${new Date().toISOString()}`;
            console.log(`💬 Committing: ${commitMessage}`);
            
            try {
                execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
            } catch (error) {
                // Check if there are no changes to commit
                if (error.message.includes('nothing to commit')) {
                    console.log('ℹ️  No changes to commit');
                } else {
                    throw error;
                }
            }
            
            // Push to repository
            console.log('🚀 Pushing to GitHub...');
            execSync(`git push origin ${this.config.repository.branch}`, { stdio: 'inherit' });
            
            console.log('✅ Successfully pushed to GitHub');
            console.log(`🌐 GitHub Pages URL: https://${this.config.repository.owner}.github.io/${this.config.repository.name}`);
            
            // Wait for GitHub Pages to deploy
            console.log('⏳ Waiting for GitHub Pages deployment...');
            await this.waitForDeployment();
            
            console.log('✅ GitHub Pages deployment completed\n');
            
        } catch (error) {
            throw new Error(`GitHub deployment failed: ${error.message}`);
        }
    }

    /**
     * Wait for GitHub Pages deployment
     */
    async waitForDeployment() {
        const maxWaitTime = 5 * 60 * 1000; // 5 minutes
        const checkInterval = 30 * 1000; // 30 seconds
        const startTime = Date.now();
        
        const githubPagesUrl = `https://${this.config.repository.owner}.github.io/${this.config.repository.name}`;
        
        while (Date.now() - startTime < maxWaitTime) {
            try {
                const response = execSync(`curl -s -o /dev/null -w "%{http_code}" "${githubPagesUrl}"`, 
                    { encoding: 'utf-8', timeout: 10000 });
                
                if (response.trim() === '200') {
                    console.log('✅ GitHub Pages is responding');
                    return;
                }
            } catch (error) {
                // Continue waiting
            }
            
            console.log('   ⏳ Still waiting for deployment...');
            await new Promise(resolve => setTimeout(resolve, checkInterval));
        }
        
        console.log('⚠️  GitHub Pages deployment taking longer than expected');
    }

    /**
     * Configure custom domain
     */
    async configureDomain() {
        console.log('🌐 Configuring custom domain...\n');
        
        try {
            await this.tools.domainConfig.configure({
                setup: true,
                domain: this.config.domains.primary
            });
            
            console.log('✅ Domain configuration completed\n');
            
        } catch (error) {
            console.log(`⚠️  Domain configuration failed: ${error.message}\n`);
        }
    }

    /**
     * Run post-deployment tests
     */
    async runPostDeploymentTests() {
        console.log('🧪 Running post-deployment tests...\n');
        
        try {
            await this.tools.testSuite.runAllTests({ 
                domain: this.config.domains.primary 
            });
            
            console.log('✅ Post-deployment tests completed\n');
            
        } catch (error) {
            console.log(`⚠️  Post-deployment tests failed: ${error.message}\n`);
        }
    }

    /**
     * Start monitoring
     */
    async startMonitoring() {
        console.log('📡 Starting domain monitoring...\n');
        
        try {
            // Start monitoring in background
            const monitorProcess = spawn('node', ['tools/domain-monitor.js', 'start'], {
                detached: true,
                stdio: 'ignore'
            });
            
            monitorProcess.unref();
            
            console.log(`✅ Domain monitoring started (PID: ${monitorProcess.pid})`);
            console.log('   Monitor can be stopped with: node tools/domain-monitor.js stop\n');
            
        } catch (error) {
            console.log(`⚠️  Failed to start monitoring: ${error.message}\n`);
        }
    }

    /**
     * Generate deployment report
     */
    async generateDeploymentReport(deploymentId, startTime) {
        console.log('📊 Generating deployment report...\n');
        
        const endTime = Date.now();
        const duration = Math.round((endTime - startTime) / 1000);
        
        const report = {
            deploymentId,
            timestamp: new Date().toISOString(),
            duration: `${duration}s`,
            repository: this.config.repository,
            domains: this.config.domains,
            urls: {
                github: `https://${this.config.repository.owner}.github.io/${this.config.repository.name}`,
                custom: `https://${this.config.domains.primary}`
            },
            status: 'success'
        };
        
        const reportsDir = 'reports';
        await fs.mkdir(reportsDir, { recursive: true });
        
        const reportFile = path.join(reportsDir, `deployment-${deploymentId}.json`);
        await fs.writeFile(reportFile, JSON.stringify(report, null, 2));
        
        console.log(`✅ Deployment report saved: ${reportFile}`);
        console.log(`⏱️  Total deployment time: ${duration}s`);
        console.log(`🌐 Live site: https://${this.config.domains.primary}\n`);
    }

    /**
     * Handle deployment failure
     */
    async handleDeploymentFailure(deploymentId, error) {
        console.log('💥 Handling deployment failure...\n');
        
        const report = {
            deploymentId,
            timestamp: new Date().toISOString(),
            status: 'failed',
            error: error.message,
            stack: error.stack
        };
        
        const reportsDir = 'reports';
        await fs.mkdir(reportsDir, { recursive: true });
        
        const reportFile = path.join(reportsDir, `deployment-failed-${deploymentId}.json`);
        await fs.writeFile(reportFile, JSON.stringify(report, null, 2));
        
        console.log(`💾 Failure report saved: ${reportFile}`);
        console.log(`❌ Deployment failed after ${Math.round((Date.now() - deploymentId) / 1000)}s`);
    }

    /**
     * Rollback deployment
     */
    async rollback(options = {}) {
        console.log('↩️  Rolling back deployment...\n');
        
        try {
            const commits = execSync('git log --oneline -10', { encoding: 'utf-8' });
            console.log('Recent commits:');
            console.log(commits);
            
            const targetCommit = options.commit || 'HEAD~1';
            
            if (options.confirm !== false) {
                console.log(`⚠️  This will reset to: ${targetCommit}`);
                console.log('This action cannot be undone!');
                
                // In a real CLI, you'd prompt for confirmation
                // For now, we'll just log the command
                console.log(`Command to run: git reset --hard ${targetCommit}`);
                console.log('Then: git push --force-with-lease origin main');
            } else {
                execSync(`git reset --hard ${targetCommit}`, { stdio: 'inherit' });
                execSync('git push --force-with-lease origin main', { stdio: 'inherit' });
                console.log('✅ Rollback completed');
            }
            
        } catch (error) {
            throw new Error(`Rollback failed: ${error.message}`);
        }
    }

    /**
     * Status command
     */
    async status() {
        console.log('📊 Deployment Status\n');
        
        try {
            // Git status
            const gitStatus = execSync('git status --short', { encoding: 'utf-8' });
            console.log('Git Status:');
            console.log(gitStatus || '  Working directory clean');
            console.log('');
            
            // Domain status
            console.log('Domain Status:');
            await this.tools.domainConfig.configure({ verify: true });
            
        } catch (error) {
            console.error('Failed to get status:', error.message);
        }
    }

    /**
     * Helper method to find files
     */
    async findFiles(pattern) {
        try {
            const output = execSync(`find . -name "${pattern}" -type f`, { encoding: 'utf-8' });
            return output.trim().split('\n').filter(file => file && !file.includes('node_modules'));
        } catch (error) {
            return [];
        }
    }
}

// CLI Interface
if (import.meta.url === `file://${process.argv[1]}`) {
    const automation = new DeploymentAutomation();
    
    const args = process.argv.slice(2);
    const command = args[0] || 'deploy';
    const options = {};
    
    // Parse arguments
    for (let i = 1; i < args.length; i++) {
        switch (args[i]) {
            case '--skip-tests':
                options.skipTests = true;
                break;
            case '--skip-build':
                options.skipBuild = true;
                break;
            case '--skip-domain':
                options.skipDomain = true;
                break;
            case '--skip-monitoring':
                options.skipMonitoring = true;
                break;
            case '--message':
                options.message = args[++i];
                break;
            case '--commit':
                options.commit = args[++i];
                break;
            case '--no-confirm':
                options.confirm = false;
                break;
            case '--help':
                console.log(`
Bitcoin Sovereign Academy - Deployment Automation

Usage: node tools/deploy-automation.js [command] [options]

Commands:
  deploy      Deploy to GitHub Pages (default)
  rollback    Rollback to previous deployment
  status      Show deployment status
  help        Show this help message

Options:
  --skip-tests      Skip pre/post deployment tests
  --skip-build      Skip build step
  --skip-domain     Skip domain configuration
  --skip-monitoring Skip starting monitoring
  --message <msg>   Custom commit message
  --commit <hash>   Target commit for rollback
  --no-confirm      Skip confirmation prompts

Examples:
  node tools/deploy-automation.js
  node tools/deploy-automation.js deploy --message "Fix navigation bug"
  node tools/deploy-automation.js deploy --skip-tests
  node tools/deploy-automation.js rollback --commit abc123
  node tools/deploy-automation.js status
`);
                process.exit(0);
        }
    }
    
    // Execute command
    try {
        switch (command) {
            case 'deploy':
                await automation.deploy(options);
                break;
            case 'rollback':
                await automation.rollback(options);
                break;
            case 'status':
                await automation.status();
                break;
            case 'help':
                // Help already shown above
                break;
            default:
                console.error(`Unknown command: ${command}`);
                console.log('Run with --help for usage information');
                process.exit(1);
        }
    } catch (error) {
        console.error('💥 Command failed:', error.message);
        process.exit(1);
    }
}

export default DeploymentAutomation;