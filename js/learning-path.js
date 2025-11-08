/**
 * Progressive Learning Path UI Component
 * Implements step-by-step guided learning with checkpoints, achievements, and contextual help
 */

class ProgressiveLearningPath {
    constructor() {
        this.currentPath = null;
        this.currentStep = 0;
        this.checkpoints = [];
        this.achievements = [];
        this.learningPaths = this.initializeLearningPaths();
        this.breadcrumbs = [];
        this.mcpService = window.mcpService;
        this.init();
    }

    /**
     * Initialize the learning path system
     */
    init() {
        this.createLearningPathUI();
        this.setupEventListeners();
        this.loadUserProgress();
        console.log('Progressive Learning Path initialized');
    }

    /**
     * Initialize learning paths for different personas
     */
    initializeLearningPaths() {
        return {
            'bitcoin-curious': {
                name: 'Bitcoin Curious Explorer',
                description: 'Start your Bitcoin journey with fundamentals',
                totalSteps: 8,
                estimatedTime: '2-3 hours',
                difficulty: 'Beginner',
                steps: [
                    {
                        id: 'what-is-bitcoin',
                        title: 'What is Bitcoin?',
                        description: 'Learn the basic concept of Bitcoin as digital money',
                        type: 'reading',
                        duration: '10 min',
                        content: 'Understanding Bitcoin basics',
                        prerequisites: [],
                        resources: ['article', 'video'],
                        checkpoint: true
                    },
                    {
                        id: 'why-bitcoin-matters',
                        title: 'Why Bitcoin Matters',
                        description: 'Discover the problems Bitcoin solves',
                        type: 'interactive-demo',
                        duration: '15 min',
                        demoPath: '/interactive-demos/bitcoin-sovereign-game/',
                        prerequisites: ['what-is-bitcoin'],
                        resources: ['game', 'tutorial'],
                        checkpoint: false
                    },
                    {
                        id: 'money-history',
                        title: 'History of Money',
                        description: 'From barter to digital currency',
                        type: 'reading',
                        duration: '20 min',
                        content: 'Evolution of monetary systems',
                        prerequisites: ['why-bitcoin-matters'],
                        resources: ['article', 'timeline'],
                        checkpoint: true
                    },
                    {
                        id: 'first-transaction',
                        title: 'Your First Bitcoin Transaction',
                        description: 'Learn how Bitcoin transactions work',
                        type: 'interactive-demo',
                        duration: '25 min',
                        demoPath: '/interactive-demos/transaction-builder/',
                        prerequisites: ['money-history'],
                        resources: ['demo', 'guide'],
                        checkpoint: true
                    },
                    {
                        id: 'wallet-security',
                        title: 'Securing Your Bitcoin',
                        description: 'Learn about wallets and security',
                        type: 'interactive-demo',
                        duration: '30 min',
                        demoPath: '/interactive-demos/wallet-security-workshop/',
                        prerequisites: ['first-transaction'],
                        resources: ['workshop', 'checklist'],
                        checkpoint: true
                    },
                    {
                        id: 'network-consensus',
                        title: 'How Bitcoin Stays Secure',
                        description: 'Understanding consensus and mining',
                        type: 'interactive-demo',
                        duration: '20 min',
                        demoPath: '/interactive-demos/consensus-game/',
                        prerequisites: ['wallet-security'],
                        resources: ['game', 'explanation'],
                        checkpoint: false
                    },
                    {
                        id: 'economic-impact',
                        title: 'Bitcoin\'s Economic Impact',
                        description: 'How Bitcoin affects the global economy',
                        type: 'reading',
                        duration: '25 min',
                        content: 'Economic implications and adoption',
                        prerequisites: ['network-consensus'],
                        resources: ['analysis', 'data'],
                        checkpoint: true
                    },
                    {
                        id: 'next-steps',
                        title: 'Your Bitcoin Journey Continues',
                        description: 'Where to go from here',
                        type: 'planning',
                        duration: '15 min',
                        content: 'Advanced learning paths and resources',
                        prerequisites: ['economic-impact'],
                        resources: ['roadmap', 'community'],
                        checkpoint: true,
                        completion: true
                    }
                ]
            },
            'investor': {
                name: 'Traditional Investor',
                description: 'Bitcoin as an investment asset',
                totalSteps: 7,
                estimatedTime: '2-4 hours',
                difficulty: 'Intermediate',
                steps: [
                    {
                        id: 'bitcoin-as-asset',
                        title: 'Bitcoin as Digital Gold',
                        description: 'Understanding Bitcoin\'s investment thesis',
                        type: 'reading',
                        duration: '15 min',
                        content: 'Store of value properties',
                        prerequisites: [],
                        resources: ['analysis', 'comparison'],
                        checkpoint: true
                    },
                    {
                        id: 'market-analysis',
                        title: 'Bitcoin Market Analysis',
                        description: 'Analyzing Bitcoin price movements and metrics',
                        type: 'analysis-tool',
                        duration: '30 min',
                        content: 'Technical and fundamental analysis',
                        prerequisites: ['bitcoin-as-asset'],
                        resources: ['charts', 'data'],
                        checkpoint: false
                    },
                    {
                        id: 'portfolio-allocation',
                        title: 'Portfolio Integration',
                        description: 'How much Bitcoin should you own?',
                        type: 'calculator',
                        duration: '20 min',
                        content: 'Allocation strategies and risk management',
                        prerequisites: ['market-analysis'],
                        resources: ['calculator', 'examples'],
                        checkpoint: true
                    },
                    {
                        id: 'dca-strategy',
                        title: 'Dollar-Cost Averaging',
                        description: 'Systematic Bitcoin investing',
                        type: 'calculator',
                        duration: '25 min',
                        content: 'DCA strategy and backtesting',
                        prerequisites: ['portfolio-allocation'],
                        resources: ['calculator', 'historical-data'],
                        checkpoint: true
                    },
                    {
                        id: 'custody-solutions',
                        title: 'Secure Storage Solutions',
                        description: 'Self-custody vs custodial services',
                        type: 'interactive-demo',
                        duration: '35 min',
                        demoPath: '/interactive-demos/wallet-security-workshop/',
                        prerequisites: ['dca-strategy'],
                        resources: ['workshop', 'comparison'],
                        checkpoint: true
                    },
                    {
                        id: 'tax-implications',
                        title: 'Tax and Regulatory Considerations',
                        description: 'Understanding Bitcoin taxation',
                        type: 'reading',
                        duration: '30 min',
                        content: 'Tax strategies and compliance',
                        prerequisites: ['custody-solutions'],
                        resources: ['guide', 'tools'],
                        checkpoint: false
                    },
                    {
                        id: 'advanced-strategies',
                        title: 'Advanced Investment Strategies',
                        description: 'Beyond buy and hold',
                        type: 'planning',
                        duration: '25 min',
                        content: 'Advanced techniques and next steps',
                        prerequisites: ['tax-implications'],
                        resources: ['strategies', 'resources'],
                        checkpoint: true,
                        completion: true
                    }
                ]
            },
            'developer': {
                name: 'Tech Developer',
                description: 'Bitcoin technical deep-dive',
                totalSteps: 10,
                estimatedTime: '4-6 hours',
                difficulty: 'Advanced',
                steps: [
                    {
                        id: 'bitcoin-protocol',
                        title: 'Bitcoin Protocol Basics',
                        description: 'Understanding the technical foundation',
                        type: 'reading',
                        duration: '20 min',
                        content: 'Protocol specifications and design',
                        prerequisites: [],
                        resources: ['whitepaper', 'documentation'],
                        checkpoint: true
                    },
                    {
                        id: 'transaction-structure',
                        title: 'Transaction Structure Deep-Dive',
                        description: 'Anatomy of Bitcoin transactions',
                        type: 'interactive-demo',
                        duration: '30 min',
                        demoPath: '/interactive-demos/transaction-builder/',
                        prerequisites: ['bitcoin-protocol'],
                        resources: ['demo', 'code-examples'],
                        checkpoint: false
                    },
                    {
                        id: 'cryptographic-primitives',
                        title: 'Cryptographic Foundations',
                        description: 'Hash functions, digital signatures, and more',
                        type: 'reading',
                        duration: '35 min',
                        content: 'Cryptographic building blocks',
                        prerequisites: ['transaction-structure'],
                        resources: ['documentation', 'examples'],
                        checkpoint: true
                    },
                    {
                        id: 'consensus-mechanisms',
                        title: 'Proof of Work and Consensus',
                        description: 'How Bitcoin achieves agreement',
                        type: 'interactive-demo',
                        duration: '40 min',
                        demoPath: '/interactive-demos/consensus-game/',
                        prerequisites: ['cryptographic-primitives'],
                        resources: ['simulation', 'analysis'],
                        checkpoint: true
                    },
                    {
                        id: 'scripting-system',
                        title: 'Bitcoin Script Programming',
                        description: 'Bitcoin\'s programming language',
                        type: 'coding',
                        duration: '45 min',
                        content: 'Script examples and programming',
                        prerequisites: ['consensus-mechanisms'],
                        resources: ['code-editor', 'examples'],
                        checkpoint: true
                    },
                    {
                        id: 'network-protocol',
                        title: 'Peer-to-Peer Network',
                        description: 'How Bitcoin nodes communicate',
                        type: 'reading',
                        duration: '25 min',
                        content: 'Network architecture and protocols',
                        prerequisites: ['scripting-system'],
                        resources: ['specifications', 'tools'],
                        checkpoint: false
                    },
                    {
                        id: 'lightning-network',
                        title: 'Lightning Network Development',
                        description: 'Layer 2 scaling solutions',
                        type: 'interactive-demo',
                        duration: '50 min',
                        demoPath: '/interactive-demos/lightning-lab/',
                        prerequisites: ['network-protocol'],
                        resources: ['demo', 'tutorials'],
                        checkpoint: true
                    },
                    {
                        id: 'wallet-development',
                        title: 'Building Bitcoin Wallets',
                        description: 'Wallet architecture and implementation',
                        type: 'coding',
                        duration: '60 min',
                        content: 'Wallet development tutorial',
                        prerequisites: ['lightning-network'],
                        resources: ['code-tutorial', 'libraries'],
                        checkpoint: true
                    },
                    {
                        id: 'node-operation',
                        title: 'Running a Bitcoin Node',
                        description: 'Node setup and maintenance',
                        type: 'hands-on',
                        duration: '45 min',
                        content: 'Node deployment and management',
                        prerequisites: ['wallet-development'],
                        resources: ['setup-guide', 'monitoring'],
                        checkpoint: true
                    },
                    {
                        id: 'contributing',
                        title: 'Contributing to Bitcoin',
                        description: 'Join the Bitcoin development community',
                        type: 'planning',
                        duration: '30 min',
                        content: 'How to contribute to Bitcoin projects',
                        prerequisites: ['node-operation'],
                        resources: ['guidelines', 'community'],
                        checkpoint: true,
                        completion: true
                    }
                ]
            }
        };
    }

    /**
     * Create the learning path UI elements
     */
    createLearningPathUI() {
        // Create breadcrumb navigation
        this.createBreadcrumbsUI();
        
        // Create progress indicator
        this.createProgressIndicator();
        
        // Create step navigation
        this.createStepNavigation();
        
        // Create achievement system
        this.createAchievementSystem();
        
        // Create contextual help
        this.createContextualHelp();
    }

    /**
     * Create breadcrumb navigation
     */
    createBreadcrumbsUI() {
        const breadcrumbContainer = document.createElement('div');
        breadcrumbContainer.id = 'learning-breadcrumbs';
        breadcrumbContainer.className = 'learning-breadcrumbs';
        breadcrumbContainer.innerHTML = `
            <div class="breadcrumb-wrapper">
                <nav class="breadcrumb-nav" aria-label="Learning path breadcrumbs">
                    <ol class="breadcrumb-list" id="breadcrumb-list">
                        <!-- Breadcrumbs will be populated dynamically -->
                    </ol>
                </nav>
            </div>
        `;
        
        // Insert after header
        const header = document.querySelector('.header');
        if (header) {
            header.insertAdjacentElement('afterend', breadcrumbContainer);
        }
    }

    /**
     * Create progress indicator
     */
    createProgressIndicator() {
        const progressContainer = document.createElement('div');
        progressContainer.id = 'learning-progress-indicator';
        progressContainer.className = 'learning-progress-indicator';
        progressContainer.innerHTML = `
            <div class="progress-wrapper">
                <div class="progress-info">
                    <div class="progress-title" id="progress-title">Learning Path</div>
                    <div class="progress-stats">
                        <span id="progress-current">0</span> of <span id="progress-total">0</span> steps
                    </div>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar">
                        <div class="progress-fill" id="progress-fill" style="width: 0%"></div>
                    </div>
                    <div class="progress-percentage" id="progress-percentage">0%</div>
                </div>
                <div class="progress-actions">
                    <button class="progress-btn" id="prev-step-btn" disabled>← Previous</button>
                    <button class="progress-btn primary" id="next-step-btn" disabled>Next →</button>
                </div>
            </div>
        `;
        
        // Insert in learning path content area
        const learningPathContent = document.getElementById('learning-path-content');
        if (learningPathContent) {
            learningPathContent.prepend(progressContainer);
        }
    }

    /**
     * Create step navigation with checkpoints
     */
    createStepNavigation() {
        const stepNavContainer = document.createElement('div');
        stepNavContainer.id = 'step-navigation';
        stepNavContainer.className = 'step-navigation';
        stepNavContainer.innerHTML = `
            <div class="step-nav-wrapper">
                <div class="step-timeline" id="step-timeline">
                    <!-- Steps will be populated dynamically -->
                </div>
            </div>
        `;
        
        // Insert in learning path content area
        const learningPathContent = document.getElementById('learning-path-content');
        if (learningPathContent) {
            learningPathContent.appendChild(stepNavContainer);
        }
    }

    /**
     * Create achievement system UI
     */
    createAchievementSystem() {
        const achievementContainer = document.createElement('div');
        achievementContainer.id = 'achievement-system';
        achievementContainer.className = 'achievement-system';
        achievementContainer.innerHTML = `
            <div class="achievement-wrapper">
                <h4 class="achievement-title">🏆 Achievements</h4>
                <div class="achievement-list" id="achievement-list">
                    <div class="no-achievements">Complete steps to unlock achievements!</div>
                </div>
            </div>
        `;
        
        // Insert in progress section
        const progressSection = document.getElementById('progress-section');
        if (progressSection) {
            progressSection.appendChild(achievementContainer);
        }
    }

    /**
     * Create contextual help system
     */
    createContextualHelp() {
        const helpContainer = document.createElement('div');
        helpContainer.id = 'contextual-help';
        helpContainer.className = 'contextual-help';
        helpContainer.innerHTML = `
            <div class="help-toggle" id="help-toggle">
                <span class="help-icon">💡</span>
                <span class="help-text">Need Help?</span>
            </div>
            <div class="help-panel" id="help-panel">
                <div class="help-content">
                    <h4>Learning Path Guide</h4>
                    <div id="help-content-text">
                        Select a learning path to get personalized guidance and step-by-step instructions.
                    </div>
                    <div class="help-actions">
                        <button class="help-btn" onclick="this.parentElement.parentElement.parentElement.classList.remove('active')">
                            Got it!
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(helpContainer);
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Previous/Next step buttons
        document.getElementById('prev-step-btn')?.addEventListener('click', () => {
            this.previousStep();
        });
        
        document.getElementById('next-step-btn')?.addEventListener('click', () => {
            this.nextStep();
        });
        
        // Help toggle
        document.getElementById('help-toggle')?.addEventListener('click', () => {
            const helpContainer = document.getElementById('contextual-help');
            helpContainer.classList.toggle('active');
        });
        
        // Listen for persona changes
        window.addEventListener('personaChanged', (event) => {
            this.handlePersonaChange(event.detail);
        });
        
        // Listen for MCP content updates
        window.addEventListener('mcpContentRefresh', (event) => {
            this.updatePathFromMCP(event.detail);
        });
    }

    /**
     * Handle persona change and update learning path
     */
    async handlePersonaChange(detail) {
        const { personaId } = detail;
        await this.startLearningPath(personaId);
    }

    /**
     * Start a learning path for given persona
     */
    async startLearningPath(personaId) {
        if (!this.learningPaths[personaId]) {
            console.warn(`Learning path not found for persona: ${personaId}`);
            return;
        }
        
        this.currentPath = this.learningPaths[personaId];
        this.currentStep = 0;
        this.checkpoints = [];
        
        // Update UI
        this.updateProgressIndicator();
        this.updateBreadcrumbs();
        this.updateStepNavigation();
        this.updateContextualHelp();
        
        // Save progress
        this.saveProgress();
        
        console.log(`Started learning path: ${this.currentPath.name}`);
    }

    /**
     * Move to next step
     */
    async nextStep() {
        if (!this.currentPath || this.currentStep >= this.currentPath.steps.length - 1) {
            return;
        }
        
        // Mark current step as completed
        await this.markStepCompleted(this.currentStep);
        
        this.currentStep++;
        this.updateUI();
        this.checkForAchievements();
        this.saveProgress();
        
        // Track progress with MCP
        if (this.mcpService) {
            const currentStepData = this.currentPath.steps[this.currentStep - 1];
            await this.mcpService.markContentCompleted(currentStepData.title);
        }
    }

    /**
     * Move to previous step
     */
    previousStep() {
        if (!this.currentPath || this.currentStep <= 0) {
            return;
        }
        
        this.currentStep--;
        this.updateUI();
        this.saveProgress();
    }

    /**
     * Jump to specific step
     */
    async jumpToStep(stepIndex) {
        if (!this.currentPath || stepIndex < 0 || stepIndex >= this.currentPath.steps.length) {
            return;
        }
        
        const step = this.currentPath.steps[stepIndex];
        
        // Check prerequisites
        if (!this.checkPrerequisites(step)) {
            this.showPrerequisiteWarning(step);
            return;
        }
        
        this.currentStep = stepIndex;
        this.updateUI();
        this.saveProgress();
    }

    /**
     * Check if step prerequisites are met
     */
    checkPrerequisites(step) {
        if (!step.prerequisites || step.prerequisites.length === 0) {
            return true;
        }
        
        // Check if all prerequisite steps are completed
        return step.prerequisites.every(prereqId => {
            return this.checkpoints.includes(prereqId);
        });
    }

    /**
     * Mark step as completed
     */
    async markStepCompleted(stepIndex) {
        const step = this.currentPath.steps[stepIndex];
        if (step && !this.checkpoints.includes(step.id)) {
            this.checkpoints.push(step.id);
            
            if (step.checkpoint) {
                this.showCheckpointReached(step);
            }
        }
    }

    /**
     * Update all UI elements
     */
    updateUI() {
        this.updateProgressIndicator();
        this.updateBreadcrumbs();
        this.updateStepNavigation();
        this.updateContextualHelp();
    }

    /**
     * Update progress indicator
     */
    updateProgressIndicator() {
        if (!this.currentPath) return;
        
        const progressTitle = document.getElementById('progress-title');
        const progressCurrent = document.getElementById('progress-current');
        const progressTotal = document.getElementById('progress-total');
        const progressFill = document.getElementById('progress-fill');
        const progressPercentage = document.getElementById('progress-percentage');
        const prevBtn = document.getElementById('prev-step-btn');
        const nextBtn = document.getElementById('next-step-btn');
        
        if (progressTitle) progressTitle.textContent = this.currentPath.name;
        if (progressCurrent) progressCurrent.textContent = Math.min(this.currentStep + 1, this.currentPath.totalSteps);
        if (progressTotal) progressTotal.textContent = this.currentPath.totalSteps;
        
        const percentage = ((this.currentStep + 1) / this.currentPath.totalSteps) * 100;
        if (progressFill) progressFill.style.width = `${percentage}%`;
        if (progressPercentage) progressPercentage.textContent = `${Math.round(percentage)}%`;
        
        if (prevBtn) prevBtn.disabled = this.currentStep === 0;
        if (nextBtn) {
            nextBtn.disabled = this.currentStep >= this.currentPath.steps.length - 1;
            if (this.currentStep === this.currentPath.steps.length - 1) {
                nextBtn.textContent = 'Complete Path 🎉';
            } else {
                nextBtn.textContent = 'Next →';
            }
        }
    }

    /**
     * Update breadcrumb navigation
     */
    updateBreadcrumbs() {
        if (!this.currentPath) return;
        
        const breadcrumbList = document.getElementById('breadcrumb-list');
        if (!breadcrumbList) return;
        
        const currentStep = this.currentPath.steps[this.currentStep];
        
        this.breadcrumbs = [
            { label: 'Home', url: '#', active: false },
            { label: 'Learning Paths', url: '#path', active: false },
            { label: this.currentPath.name, url: '#', active: false },
            { label: currentStep?.title || 'Step', url: '#', active: true }
        ];
        
        breadcrumbList.innerHTML = this.breadcrumbs.map((crumb, index) => `
            <li class="breadcrumb-item ${crumb.active ? 'active' : ''}">
                ${crumb.active ? 
                    `<span>${crumb.label}</span>` : 
                    `<a href="${crumb.url}">${crumb.label}</a>`
                }
                ${index < this.breadcrumbs.length - 1 ? '<span class="breadcrumb-separator">></span>' : ''}
            </li>
        `).join('');
    }

    /**
     * Update step navigation timeline
     */
    updateStepNavigation() {
        if (!this.currentPath) return;
        
        const stepTimeline = document.getElementById('step-timeline');
        if (!stepTimeline) return;
        
        stepTimeline.innerHTML = this.currentPath.steps.map((step, index) => {
            const isCompleted = this.checkpoints.includes(step.id);
            const isCurrent = index === this.currentStep;
            const isAccessible = index <= this.currentStep || this.checkPrerequisites(step);
            
            return `
                <div class="step-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${!isAccessible ? 'locked' : ''}" 
                     onclick="learningPath.jumpToStep(${index})" 
                     data-step-index="${index}">
                    <div class="step-indicator">
                        <div class="step-number">
                            ${isCompleted ? '✓' : step.checkpoint ? '🏁' : index + 1}
                        </div>
                    </div>
                    <div class="step-content">
                        <div class="step-title">${step.title}</div>
                        <div class="step-description">${step.description}</div>
                        <div class="step-meta">
                            <span class="step-duration">${step.duration}</span>
                            <span class="step-type step-type-${step.type}">${this.formatStepType(step.type)}</span>
                            ${step.checkpoint ? '<span class="checkpoint-badge">Checkpoint</span>' : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Update contextual help content
     */
    updateContextualHelp() {
        if (!this.currentPath) return;
        
        const helpContent = document.getElementById('help-content-text');
        if (!helpContent) return;
        
        const currentStep = this.currentPath.steps[this.currentStep];
        if (currentStep) {
            helpContent.innerHTML = `
                <p><strong>Current Step:</strong> ${currentStep.title}</p>
                <p>${currentStep.description}</p>
                <p><strong>Estimated Duration:</strong> ${currentStep.duration}</p>
                ${currentStep.prerequisites?.length ? 
                    `<p><strong>Prerequisites:</strong> ${currentStep.prerequisites.join(', ')}</p>` : 
                    ''
                }
                <p><strong>Resources:</strong> ${currentStep.resources?.join(', ') || 'None'}</p>
            `;
        }
    }

    /**
     * Check for new achievements
     */
    checkForAchievements() {
        const newAchievements = [];
        
        // First step completion
        if (this.checkpoints.length === 1 && !this.achievements.includes('first-step')) {
            newAchievements.push({
                id: 'first-step',
                title: 'First Steps',
                description: 'Completed your first learning step',
                icon: '🎯',
                points: 10
            });
        }
        
        // First checkpoint
        const checkpointSteps = this.currentPath.steps.filter(step => step.checkpoint);
        const completedCheckpoints = checkpointSteps.filter(step => this.checkpoints.includes(step.id));
        if (completedCheckpoints.length === 1 && !this.achievements.includes('first-checkpoint')) {
            newAchievements.push({
                id: 'first-checkpoint',
                title: 'Checkpoint Champion',
                description: 'Reached your first checkpoint',
                icon: '🏁',
                points: 25
            });
        }
        
        // Halfway through path
        if (this.currentStep >= Math.floor(this.currentPath.totalSteps / 2) && !this.achievements.includes('halfway')) {
            newAchievements.push({
                id: 'halfway',
                title: 'Halfway Hero',
                description: 'Completed half of your learning path',
                icon: '📈',
                points: 50
            });
        }
        
        // Path completion
        if (this.currentStep === this.currentPath.totalSteps - 1 && !this.achievements.includes('path-complete')) {
            newAchievements.push({
                id: 'path-complete',
                title: 'Path Master',
                description: `Completed the ${this.currentPath.name} learning path`,
                icon: '🏆',
                points: 100
            });
        }
        
        // Add new achievements
        newAchievements.forEach(achievement => {
            if (!this.achievements.some(a => a.id === achievement.id)) {
                this.achievements.push(achievement);
                this.showAchievementNotification(achievement);
            }
        });
        
        this.updateAchievementDisplay();
    }

    /**
     * Show achievement notification
     */
    showAchievementNotification(achievement) {
        // Create notification popup
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-popup">
                <div class="achievement-icon-large">${achievement.icon}</div>
                <div class="achievement-details">
                    <div class="achievement-unlocked">Achievement Unlocked!</div>
                    <div class="achievement-name">${achievement.title}</div>
                    <div class="achievement-desc">${achievement.description}</div>
                    <div class="achievement-points">+${achievement.points} points</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in and out
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 4000);
    }

    /**
     * Update achievement display
     */
    updateAchievementDisplay() {
        const achievementList = document.getElementById('achievement-list');
        if (!achievementList) return;
        
        if (this.achievements.length === 0) {
            achievementList.innerHTML = '<div class="no-achievements">Complete steps to unlock achievements!</div>';
            return;
        }
        
        achievementList.innerHTML = this.achievements.map(achievement => `
            <div class="achievement-item">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                    <div class="achievement-title">${achievement.title}</div>
                    <div class="achievement-description">${achievement.description}</div>
                </div>
                <div class="achievement-points">+${achievement.points}</div>
            </div>
        `).join('');
    }

    /**
     * Utility functions
     */
    formatStepType(type) {
        const types = {
            'reading': 'Read',
            'interactive-demo': 'Demo',
            'calculator': 'Calculate',
            'analysis-tool': 'Analyze',
            'coding': 'Code',
            'hands-on': 'Hands-on',
            'planning': 'Plan'
        };
        return types[type] || type;
    }

    showPrerequisiteWarning(step) {
        alert(`Please complete the prerequisites first: ${step.prerequisites.join(', ')}`);
    }

    showCheckpointReached(step) {
        console.log(`🏁 Checkpoint reached: ${step.title}`);
    }

    /**
     * Save/load progress
     */
    saveProgress() {
        const progressData = {
            currentPath: this.currentPath?.name || null,
            currentStep: this.currentStep,
            checkpoints: this.checkpoints,
            achievements: this.achievements,
            lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem('learning-path-progress', JSON.stringify(progressData));
    }

    loadProgress() {
        const saved = localStorage.getItem('learning-path-progress');
        if (saved) {
            const data = JSON.parse(saved);
            this.currentStep = data.currentStep || 0;
            this.checkpoints = data.checkpoints || [];
            this.achievements = data.achievements || [];
            
            // Find and restore current path
            if (data.currentPath) {
                for (const [personaId, path] of Object.entries(this.learningPaths)) {
                    if (path.name === data.currentPath) {
                        this.currentPath = path;
                        break;
                    }
                }
            }
        }
    }

    loadUserProgress() {
        this.loadProgress();
        if (this.currentPath) {
            this.updateUI();
            this.updateAchievementDisplay();
        }
    }
}

// Initialize learning path system
const learningPath = new ProgressiveLearningPath();

// Export for module use
export default ProgressiveLearningPath;