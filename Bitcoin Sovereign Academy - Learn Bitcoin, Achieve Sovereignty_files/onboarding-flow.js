/**
 * Smart Onboarding Flow System
 * Creates an engaging onboarding sequence that identifies user goals, experience level, and interests
 */

class SmartOnboardingFlow {
    constructor() {
        this.currentStep = 0;
        this.onboardingData = {};
        this.onboardingSteps = this.initializeOnboardingSteps();
        this.isActive = false;
        this.mcpService = window.mcpService;
        this.learningPath = window.learningPath;
        this.init();
    }

    /**
     * Initialize the onboarding system
     */
    init() {
        this.createOnboardingUI();
        this.setupEventListeners();
        this.checkIfShouldShowOnboarding();
        console.log('Smart Onboarding Flow initialized');
    }

    /**
     * Check if onboarding should be shown
     */
    checkIfShouldShowOnboarding() {
        const hasSeenOnboarding = localStorage.getItem('btc-academy-onboarding-completed');
        const hasSelectedPersona = localStorage.getItem('btc-academy-persona');
        
        // Show onboarding if user hasn't seen it or hasn't selected a persona
        if (!hasSeenOnboarding && !hasSelectedPersona) {
            setTimeout(() => {
                this.startOnboarding();
            }, 2000); // Slight delay for page to load
        }
    }

    /**
     * Initialize onboarding steps
     */
    initializeOnboardingSteps() {
        return [
            {
                id: 'welcome',
                title: 'Welcome to Bitcoin Sovereign Academy! 🚀',
                type: 'welcome',
                content: `
                    <div class="onboarding-hero">
                        <div class="onboarding-icon">₿</div>
                        <h2>Your Bitcoin Journey Starts Here</h2>
                        <p>We're going to personalize your learning experience in just a few quick questions.</p>
                        <div class="onboarding-stats">
                            <div class="stat-item">
                                <strong>8</strong><br>AI Tutors
                            </div>
                            <div class="stat-item">
                                <strong>25+</strong><br>Interactive Demos
                            </div>
                            <div class="stat-item">
                                <strong>100+</strong><br>Learning Modules
                            </div>
                        </div>
                        <p class="onboarding-promise">✨ <em>Completely free, no signup required</em></p>
                    </div>
                `,
                buttons: [
                    { text: 'Get Started', action: 'next', primary: true },
                    { text: 'Skip Setup', action: 'skip', primary: false }
                ]
            },
            {
                id: 'experience-level',
                title: 'What\'s your Bitcoin experience? 📊',
                type: 'single-choice',
                content: `
                    <div class="onboarding-question">
                        <p>This helps us recommend the right starting point for you.</p>
                        <div class="choice-grid">
                            <div class="choice-card" data-value="complete-beginner">
                                <div class="choice-icon">🌱</div>
                                <h4>Complete Beginner</h4>
                                <p>I've heard of Bitcoin but don't really understand what it is</p>
                            </div>
                            <div class="choice-card" data-value="some-knowledge">
                                <div class="choice-icon">📚</div>
                                <h4>Some Knowledge</h4>
                                <p>I know the basics but want to learn more</p>
                            </div>
                            <div class="choice-card" data-value="intermediate">
                                <div class="choice-icon">⚡</div>
                                <h4>Intermediate</h4>
                                <p>I understand Bitcoin but want to deepen my knowledge</p>
                            </div>
                            <div class="choice-card" data-value="advanced">
                                <div class="choice-icon">🎓</div>
                                <h4>Advanced</h4>
                                <p>I'm well-versed but want to master specific areas</p>
                            </div>
                        </div>
                    </div>
                `,
                buttons: [
                    { text: 'Continue', action: 'next', primary: true, requiresSelection: true }
                ]
            },
            {
                id: 'primary-goal',
                title: 'What brings you to Bitcoin? 🎯',
                type: 'single-choice',
                content: `
                    <div class="onboarding-question">
                        <p>Understanding your motivation helps us customize your experience.</p>
                        <div class="choice-grid">
                            <div class="choice-card" data-value="curiosity">
                                <div class="choice-icon">🤔</div>
                                <h4>Pure Curiosity</h4>
                                <p>I want to understand what all the hype is about</p>
                            </div>
                            <div class="choice-card" data-value="investment">
                                <div class="choice-icon">📈</div>
                                <h4>Investment Interest</h4>
                                <p>I'm considering Bitcoin as an investment</p>
                            </div>
                            <div class="choice-card" data-value="technical">
                                <div class="choice-icon">⚙️</div>
                                <h4>Technical Learning</h4>
                                <p>I want to understand how Bitcoin works technically</p>
                            </div>
                            <div class="choice-card" data-value="business">
                                <div class="choice-icon">💼</div>
                                <h4>Business Use</h4>
                                <p>I want to integrate Bitcoin into my business</p>
                            </div>
                            <div class="choice-card" data-value="philosophy">
                                <div class="choice-icon">💡</div>
                                <h4>Philosophy & Freedom</h4>
                                <p>I'm interested in Bitcoin's impact on society</p>
                            </div>
                            <div class="choice-card" data-value="skeptical">
                                <div class="choice-icon">🧐</div>
                                <h4>Skeptical but Open</h4>
                                <p>I have doubts but want to learn more</p>
                            </div>
                        </div>
                    </div>
                `,
                buttons: [
                    { text: 'Continue', action: 'next', primary: true, requiresSelection: true }
                ]
            },
            {
                id: 'learning-style',
                title: 'How do you prefer to learn? 🧠',
                type: 'multiple-choice',
                content: `
                    <div class="onboarding-question">
                        <p>Select all that apply - we'll adapt our recommendations.</p>
                        <div class="choice-grid multi-select">
                            <div class="choice-card" data-value="hands-on">
                                <div class="choice-icon">🎮</div>
                                <h4>Hands-on Practice</h4>
                                <p>Interactive demos and simulations</p>
                            </div>
                            <div class="choice-card" data-value="reading">
                                <div class="choice-icon">📖</div>
                                <h4>Reading & Articles</h4>
                                <p>In-depth written content</p>
                            </div>
                            <div class="choice-card" data-value="visual">
                                <div class="choice-icon">📊</div>
                                <h4>Visual Learning</h4>
                                <p>Charts, diagrams, and infographics</p>
                            </div>
                            <div class="choice-card" data-value="discussion">
                                <div class="choice-icon">💬</div>
                                <h4>Discussion & Debate</h4>
                                <p>Exploring different viewpoints</p>
                            </div>
                            <div class="choice-card" data-value="step-by-step">
                                <div class="choice-icon">📋</div>
                                <h4>Step-by-step Guides</h4>
                                <p>Structured learning paths</p>
                            </div>
                            <div class="choice-card" data-value="quick-facts">
                                <div class="choice-icon">⚡</div>
                                <h4>Quick Facts</h4>
                                <p>Bite-sized information</p>
                            </div>
                        </div>
                    </div>
                `,
                buttons: [
                    { text: 'Continue', action: 'next', primary: true, requiresSelection: true }
                ]
            },
            {
                id: 'time-commitment',
                title: 'How much time can you dedicate? ⏰',
                type: 'single-choice',
                content: `
                    <div class="onboarding-question">
                        <p>We'll suggest learning paths that fit your schedule.</p>
                        <div class="choice-grid">
                            <div class="choice-card" data-value="casual">
                                <div class="choice-icon">🌙</div>
                                <h4>Casual Explorer</h4>
                                <p>15-30 minutes occasionally</p>
                                <small>Perfect for busy schedules</small>
                            </div>
                            <div class="choice-card" data-value="regular">
                                <div class="choice-icon">📅</div>
                                <h4>Regular Learner</h4>
                                <p>30-60 minutes a few times per week</p>
                                <small>Steady progress</small>
                            </div>
                            <div class="choice-card" data-value="intensive">
                                <div class="choice-icon">🔥</div>
                                <h4>Intensive Student</h4>
                                <p>1+ hours daily or several times per week</p>
                                <small>Fast-track learning</small>
                            </div>
                            <div class="choice-card" data-value="immersive">
                                <div class="choice-icon">🏃‍♂️</div>
                                <h4>Full Immersion</h4>
                                <p>Multiple hours daily</p>
                                <small>Complete mastery focus</small>
                            </div>
                        </div>
                    </div>
                `,
                buttons: [
                    { text: 'Continue', action: 'next', primary: true, requiresSelection: true }
                ]
            },
            {
                id: 'persona-recommendation',
                title: 'Perfect! Here\'s your personalized path 🎉',
                type: 'recommendation',
                content: `
                    <div class="onboarding-recommendation">
                        <div class="recommendation-result">
                            <div class="recommended-persona" id="recommended-persona">
                                <!-- Generated based on answers -->
                            </div>
                            <div class="recommendation-details" id="recommendation-details">
                                <!-- Generated recommendation details -->
                            </div>
                            <div class="quick-stats" id="quick-stats">
                                <!-- Quick stats about the recommended path -->
                            </div>
                        </div>
                    </div>
                `,
                buttons: [
                    { text: 'Start My Journey!', action: 'complete', primary: true },
                    { text: 'Let Me Choose Different', action: 'persona-select', primary: false }
                ]
            }
        ];
    }

    /**
     * Create onboarding UI
     */
    createOnboardingUI() {
        const onboardingContainer = document.createElement('div');
        onboardingContainer.id = 'smart-onboarding';
        onboardingContainer.className = 'smart-onboarding hidden';
        onboardingContainer.innerHTML = `
            <div class="onboarding-backdrop"></div>
            <div class="onboarding-modal">
                <div class="onboarding-header">
                    <div class="onboarding-progress">
                        <div class="progress-dots" id="progress-dots">
                            <!-- Progress dots will be generated -->
                        </div>
                        <div class="progress-text">
                            <span id="current-step">1</span> of <span id="total-steps">${this.onboardingSteps.length}</span>
                        </div>
                    </div>
                    <button class="onboarding-close" id="onboarding-close">×</button>
                </div>
                
                <div class="onboarding-content" id="onboarding-content">
                    <!-- Step content will be populated dynamically -->
                </div>
                
                <div class="onboarding-footer" id="onboarding-footer">
                    <div class="onboarding-buttons" id="onboarding-buttons">
                        <!-- Buttons will be populated dynamically -->
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(onboardingContainer);
        this.generateProgressDots();
    }

    /**
     * Generate progress dots
     */
    generateProgressDots() {
        const progressDots = document.getElementById('progress-dots');
        if (!progressDots) return;
        
        progressDots.innerHTML = this.onboardingSteps.map((step, index) => `
            <div class="progress-dot ${index === 0 ? 'active' : ''}" data-step="${index}"></div>
        `).join('');
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Close button
        document.getElementById('onboarding-close')?.addEventListener('click', () => {
            this.skipOnboarding();
        });
        
        // Backdrop click
        document.querySelector('.onboarding-backdrop')?.addEventListener('click', () => {
            this.skipOnboarding();
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.isActive) {
                if (e.key === 'Escape') {
                    this.skipOnboarding();
                } else if (e.key === 'Enter') {
                    this.handleEnterKey();
                }
            }
        });
    }

    /**
     * Start the onboarding flow
     */
    startOnboarding() {
        this.isActive = true;
        this.currentStep = 0;
        this.onboardingData = {};
        
        const onboardingElement = document.getElementById('smart-onboarding');
        if (onboardingElement) {
            onboardingElement.classList.remove('hidden');
            document.body.classList.add('onboarding-active');
            this.showStep(this.currentStep);
        }
    }

    /**
     * Show specific onboarding step
     */
    showStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= this.onboardingSteps.length) {
            return;
        }
        
        const step = this.onboardingSteps[stepIndex];
        this.currentStep = stepIndex;
        
        // Update progress
        this.updateProgress();
        
        // Update content
        this.updateStepContent(step);
        
        // Update buttons
        this.updateStepButtons(step);
        
        // Animate step transition
        this.animateStepTransition();
    }

    /**
     * Update progress indicators
     */
    updateProgress() {
        // Update step counter
        const currentStepEl = document.getElementById('current-step');
        const totalStepsEl = document.getElementById('total-steps');
        
        if (currentStepEl) currentStepEl.textContent = this.currentStep + 1;
        if (totalStepsEl) totalStepsEl.textContent = this.onboardingSteps.length;
        
        // Update progress dots
        const dots = document.querySelectorAll('.progress-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentStep);
            dot.classList.toggle('completed', index < this.currentStep);
        });
    }

    /**
     * Update step content
     */
    updateStepContent(step) {
        const contentElement = document.getElementById('onboarding-content');
        if (!contentElement) return;
        
        contentElement.innerHTML = `
            <div class="step-header">
                <h1 class="step-title">${step.title}</h1>
            </div>
            <div class="step-body">
                ${step.content}
            </div>
        `;
        
        // Setup choice selection for this step
        this.setupChoiceSelection(step);
        
        // Handle special step types
        if (step.id === 'persona-recommendation') {
            this.generatePersonaRecommendation();
        }
    }

    /**
     * Setup choice selection for steps
     */
    setupChoiceSelection(step) {
        const choiceCards = document.querySelectorAll('.choice-card');
        
        choiceCards.forEach(card => {
            card.addEventListener('click', () => {
                if (step.type === 'single-choice') {
                    // Single selection
                    choiceCards.forEach(c => c.classList.remove('selected'));
                    card.classList.add('selected');
                } else if (step.type === 'multiple-choice') {
                    // Multiple selection
                    card.classList.toggle('selected');
                }
                
                this.updateButtonStates(step);
            });
        });
    }

    /**
     * Update button states based on selections
     */
    updateButtonStates(step) {
        const selectedChoices = document.querySelectorAll('.choice-card.selected');
        const nextButton = document.querySelector('.onboarding-btn.primary');
        
        if (step.buttons && step.buttons[0]?.requiresSelection) {
            if (nextButton) {
                nextButton.disabled = selectedChoices.length === 0;
            }
        }
    }

    /**
     * Update step buttons
     */
    updateStepButtons(step) {
        const buttonsContainer = document.getElementById('onboarding-buttons');
        if (!buttonsContainer || !step.buttons) return;
        
        buttonsContainer.innerHTML = step.buttons.map(button => `
            <button class="onboarding-btn ${button.primary ? 'primary' : 'secondary'}" 
                    data-action="${button.action}"
                    ${button.requiresSelection ? 'disabled' : ''}>
                ${button.text}
            </button>
        `).join('');
        
        // Add button event listeners
        buttonsContainer.addEventListener('click', (e) => {
            const button = e.target.closest('.onboarding-btn');
            if (button && !button.disabled) {
                this.handleButtonAction(button.dataset.action);
            }
        });
    }

    /**
     * Handle button actions
     */
    async handleButtonAction(action) {
        switch (action) {
            case 'next':
                this.collectStepData();
                this.nextStep();
                break;
            case 'prev':
                this.previousStep();
                break;
            case 'skip':
                this.skipOnboarding();
                break;
            case 'complete':
                await this.completeOnboarding();
                break;
            case 'persona-select':
                this.showPersonaSelection();
                break;
        }
    }

    /**
     * Collect data from current step
     */
    collectStepData() {
        const currentStepData = this.onboardingSteps[this.currentStep];
        const selectedChoices = document.querySelectorAll('.choice-card.selected');
        
        if (currentStepData.type === 'single-choice') {
            const selected = selectedChoices[0];
            if (selected) {
                this.onboardingData[currentStepData.id] = selected.dataset.value;
            }
        } else if (currentStepData.type === 'multiple-choice') {
            this.onboardingData[currentStepData.id] = Array.from(selectedChoices)
                .map(choice => choice.dataset.value);
        }
    }

    /**
     * Move to next step
     */
    nextStep() {
        if (this.currentStep < this.onboardingSteps.length - 1) {
            this.showStep(this.currentStep + 1);
        }
    }

    /**
     * Move to previous step
     */
    previousStep() {
        if (this.currentStep > 0) {
            this.showStep(this.currentStep - 1);
        }
    }

    /**
     * Generate persona recommendation based on answers
     */
    generatePersonaRecommendation() {
        const recommendedPersona = this.determineRecommendedPersona();
        const personaElement = document.getElementById('recommended-persona');
        const detailsElement = document.getElementById('recommendation-details');
        const statsElement = document.getElementById('quick-stats');
        
        if (personaElement) {
            personaElement.innerHTML = `
                <div class="recommended-persona-card">
                    <div class="persona-icon">${recommendedPersona.icon}</div>
                    <h3>${recommendedPersona.name}</h3>
                    <p class="persona-description">${recommendedPersona.description}</p>
                </div>
            `;
        }
        
        if (detailsElement) {
            detailsElement.innerHTML = `
                <div class="recommendation-explanation">
                    <h4>Why this path?</h4>
                    <p>${recommendedPersona.reasoning}</p>
                    <div class="path-highlights">
                        <h5>What you'll learn:</h5>
                        <ul>
                            ${recommendedPersona.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
        }
        
        if (statsElement) {
            statsElement.innerHTML = `
                <div class="path-stats">
                    <div class="stat">
                        <div class="stat-value">${recommendedPersona.estimatedTime}</div>
                        <div class="stat-label">Estimated Time</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">${recommendedPersona.difficulty}</div>
                        <div class="stat-label">Difficulty</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">${recommendedPersona.modules}</div>
                        <div class="stat-label">Modules</div>
                    </div>
                </div>
            `;
        }
    }

    /**
     * Determine recommended persona based on onboarding data
     */
    determineRecommendedPersona() {
        const { 
            'experience-level': experience, 
            'primary-goal': goal,
            'learning-style': learningStyle,
            'time-commitment': time 
        } = this.onboardingData;
        
        // Decision matrix for persona recommendation
        const personaRecommendations = {
            'bitcoin-curious': {
                name: 'Bitcoin Curious Explorer',
                icon: '🤔',
                description: 'Perfect starting point for Bitcoin newcomers',
                reasoning: 'Based on your curiosity and beginner level, this path introduces Bitcoin concepts gently with engaging stories and interactive demos.',
                highlights: [
                    'What is Bitcoin and why it matters',
                    'Interactive Bitcoin timeline game',
                    'Simple explanations of complex topics',
                    'Real-world use cases and examples'
                ],
                estimatedTime: '2-3 hours',
                difficulty: 'Beginner',
                modules: '8',
                score: 0
            },
            'investor': {
                name: 'Traditional Investor',
                icon: '📈',
                description: 'Bitcoin as an investment and store of value',
                reasoning: 'Your investment focus aligns perfectly with understanding Bitcoin as a digital asset, risk management, and portfolio allocation.',
                highlights: [
                    'Bitcoin as digital gold',
                    'Market analysis and metrics',
                    'Investment strategies and DCA',
                    'Risk management and security'
                ],
                estimatedTime: '2-4 hours',
                difficulty: 'Intermediate',
                modules: '7',
                score: 0
            },
            'developer': {
                name: 'Tech Developer',
                icon: '👨‍💻',
                description: 'Deep technical dive into Bitcoin',
                reasoning: 'Your technical interest and advanced level make you perfect for our comprehensive developer path with coding exercises.',
                highlights: [
                    'Bitcoin protocol deep-dive',
                    'Cryptographic foundations',
                    'Hands-on coding exercises',
                    'Lightning Network development'
                ],
                estimatedTime: '4-6 hours',
                difficulty: 'Advanced',
                modules: '10',
                score: 0
            },
            'libertarian': {
                name: 'Freedom Seeker',
                icon: '🗽',
                description: 'Bitcoin philosophy and monetary freedom',
                reasoning: 'Your philosophical interests align with understanding Bitcoin as a tool for financial sovereignty and Austrian economics.',
                highlights: [
                    'Bitcoin philosophy and ethics',
                    'Austrian economics principles',
                    'Monetary history and freedom',
                    'Decentralization benefits'
                ],
                estimatedTime: '3-4 hours',
                difficulty: 'Intermediate',
                modules: '8',
                score: 0
            },
            'business-owner': {
                name: 'Business Owner',
                icon: '🏪',
                description: 'Practical Bitcoin business integration',
                reasoning: 'Your business focus requires understanding Bitcoin payments, integration challenges, and practical implementation.',
                highlights: [
                    'Bitcoin payment processing',
                    'Business integration strategies',
                    'Legal and tax considerations',
                    'Lightning Network for commerce'
                ],
                estimatedTime: '3-5 hours',
                difficulty: 'Intermediate',
                modules: '9',
                score: 0
            },
            'skeptic': {
                name: 'Bitcoin Skeptic',
                icon: '🧐',
                description: 'Evidence-based Bitcoin exploration',
                reasoning: 'Your skeptical approach is valuable! This path addresses common concerns with evidence and balanced analysis.',
                highlights: [
                    'Addressing Bitcoin criticisms',
                    'Evidence-based analysis',
                    'Balanced risk assessment',
                    'Myth vs reality discussions'
                ],
                estimatedTime: '2-3 hours',
                difficulty: 'Beginner',
                modules: '6',
                score: 0
            }
        };
        
        // Score each persona based on answers
        if (experience === 'complete-beginner') {
            personaRecommendations['bitcoin-curious'].score += 3;
            personaRecommendations['skeptic'].score += 2;
        } else if (experience === 'advanced') {
            personaRecommendations['developer'].score += 3;
        }
        
        if (goal === 'investment') {
            personaRecommendations['investor'].score += 5;
        } else if (goal === 'technical') {
            personaRecommendations['developer'].score += 5;
        } else if (goal === 'business') {
            personaRecommendations['business-owner'].score += 5;
        } else if (goal === 'philosophy') {
            personaRecommendations['libertarian'].score += 5;
        } else if (goal === 'skeptical') {
            personaRecommendations['skeptic'].score += 5;
        } else if (goal === 'curiosity') {
            personaRecommendations['bitcoin-curious'].score += 4;
        }
        
        // Adjust based on learning style and time commitment
        if (learningStyle && learningStyle.includes('hands-on')) {
            personaRecommendations['developer'].score += 2;
            personaRecommendations['business-owner'].score += 1;
        }
        
        if (time === 'intensive' || time === 'immersive') {
            personaRecommendations['developer'].score += 1;
        } else if (time === 'casual') {
            personaRecommendations['bitcoin-curious'].score += 1;
        }
        
        // Find highest scoring persona
        const recommendedPersonaId = Object.keys(personaRecommendations)
            .reduce((a, b) => personaRecommendations[a].score > personaRecommendations[b].score ? a : b);
        
        this.recommendedPersonaId = recommendedPersonaId;
        return personaRecommendations[recommendedPersonaId];
    }

    /**
     * Complete onboarding and setup persona
     */
    async completeOnboarding() {
        // Set persona in MCP service
        if (this.mcpService && this.recommendedPersonaId) {
            await this.mcpService.setPersona(this.recommendedPersonaId);
        }
        
        // Start learning path
        if (this.learningPath && this.recommendedPersonaId) {
            await this.learningPath.startLearningPath(this.recommendedPersonaId);
        }
        
        // Mark onboarding as completed
        localStorage.setItem('btc-academy-onboarding-completed', 'true');
        localStorage.setItem('btc-academy-onboarding-data', JSON.stringify(this.onboardingData));
        
        // Close onboarding
        this.closeOnboarding();
        
        // Show success message
        this.showCompletionMessage();
        
        // Track completion
        this.trackOnboardingCompletion();
    }

    /**
     * Skip onboarding
     */
    skipOnboarding() {
        localStorage.setItem('btc-academy-onboarding-skipped', 'true');
        this.closeOnboarding();
        
        // Show persona modal instead
        setTimeout(() => {
            document.getElementById('personaModal')?.classList.remove('hidden');
        }, 500);
    }

    /**
     * Close onboarding interface
     */
    closeOnboarding() {
        this.isActive = false;
        const onboardingElement = document.getElementById('smart-onboarding');
        
        if (onboardingElement) {
            onboardingElement.classList.add('hidden');
            document.body.classList.remove('onboarding-active');
        }
    }

    /**
     * Show completion message
     */
    showCompletionMessage() {
        const message = document.createElement('div');
        message.className = 'onboarding-completion-message';
        message.innerHTML = `
            <div class="completion-popup">
                <div class="completion-icon">🎉</div>
                <h3>Welcome to your Bitcoin journey!</h3>
                <p>Your personalized learning experience is now ready.</p>
                <button onclick="this.parentElement.parentElement.remove()" class="completion-btn">
                    Start Learning
                </button>
            </div>
        `;
        
        document.body.appendChild(message);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            message.remove();
        }, 5000);
    }

    /**
     * Show persona selection
     */
    showPersonaSelection() {
        this.closeOnboarding();
        setTimeout(() => {
            document.getElementById('personaModal')?.classList.remove('hidden');
        }, 300);
    }

    /**
     * Animate step transition
     */
    animateStepTransition() {
        const content = document.getElementById('onboarding-content');
        if (content) {
            content.style.opacity = '0';
            content.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                content.style.transition = 'all 0.3s ease';
                content.style.opacity = '1';
                content.style.transform = 'translateY(0)';
            }, 100);
        }
    }

    /**
     * Handle enter key press
     */
    handleEnterKey() {
        const primaryButton = document.querySelector('.onboarding-btn.primary:not(:disabled)');
        if (primaryButton) {
            primaryButton.click();
        }
    }

    /**
     * Track onboarding completion
     */
    trackOnboardingCompletion() {
        // Analytics tracking
        if (window.trackEvent) {
            window.trackEvent('Onboarding Completed', {
                recommended_persona: this.recommendedPersonaId,
                experience_level: this.onboardingData['experience-level'],
                primary_goal: this.onboardingData['primary-goal'],
                learning_style: this.onboardingData['learning-style'],
                time_commitment: this.onboardingData['time-commitment']
            });
        }
        
        console.log('Onboarding completed:', this.onboardingData);
    }

    /**
     * Restart onboarding (for testing/admin purposes)
     */
    restartOnboarding() {
        localStorage.removeItem('btc-academy-onboarding-completed');
        localStorage.removeItem('btc-academy-onboarding-skipped');
        localStorage.removeItem('btc-academy-onboarding-data');
        this.startOnboarding();
    }
}

// Initialize smart onboarding
const smartOnboarding = new SmartOnboardingFlow();

// Global function to restart onboarding
window.restartOnboarding = () => smartOnboarding.restartOnboarding();

// Export for module use
export default SmartOnboardingFlow;