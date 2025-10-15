/**
 * MCP-Powered Content Extraction Service
 * Dynamically loads personalized Bitcoin educational content based on user personas and progress
 */

class MCPContentService {
    constructor() {
        this.baseUrl = '/api/mcp'; // Will be implemented with backend
        this.cache = new Map();
        this.currentPersona = null;
        this.userProgress = this.loadUserProgress();
        this.contentDatabase = this.initializeContentDatabase();
    }

    /**
     * Initialize the content database for different personas and topics
     */
    initializeContentDatabase() {
        return {
            personas: {
                'bitcoin-curious': {
                    name: 'Bitcoin Curious',
                    level: 'beginner',
                    interests: ['basics', 'getting-started', 'what-is-bitcoin'],
                    contentPriority: ['fundamentals', 'use-cases', 'getting-started']
                },
                'investor': {
                    name: 'Traditional Investor',
                    level: 'intermediate',
                    interests: ['investment', 'market-analysis', 'portfolio', 'risk-management'],
                    contentPriority: ['investment-strategies', 'market-analysis', 'risk-management']
                },
                'developer': {
                    name: 'Tech Developer',
                    level: 'advanced',
                    interests: ['technical', 'programming', 'blockchain', 'cryptography'],
                    contentPriority: ['technical-implementation', 'development-tools', 'protocols']
                },
                'libertarian': {
                    name: 'Libertarian',
                    level: 'intermediate',
                    interests: ['philosophy', 'decentralization', 'monetary-theory', 'freedom'],
                    contentPriority: ['philosophy', 'monetary-theory', 'decentralization']
                },
                'business-owner': {
                    name: 'Small Business Owner',
                    level: 'intermediate',
                    interests: ['payment-processing', 'business-integration', 'accounting'],
                    contentPriority: ['business-applications', 'payment-integration', 'accounting']
                },
                'student': {
                    name: 'College Student',
                    level: 'beginner',
                    interests: ['learning', 'research', 'career', 'fundamentals'],
                    contentPriority: ['educational-resources', 'career-paths', 'fundamentals']
                },
                'retiree': {
                    name: 'Retiree',
                    level: 'beginner',
                    interests: ['security', 'long-term-storage', 'estate-planning'],
                    contentPriority: ['security', 'cold-storage', 'estate-planning']
                },
                'entrepreneur': {
                    name: 'Entrepreneur',
                    level: 'advanced',
                    interests: ['innovation', 'business-models', 'startups', 'funding'],
                    contentPriority: ['business-innovation', 'startup-funding', 'new-models']
                },
                'skeptic': {
                    name: 'Bitcoin Skeptic',
                    level: 'beginner',
                    interests: ['concerns', 'debunking-myths', 'evidence', 'proof'],
                    contentPriority: ['myth-busting', 'evidence-based', 'addressing-concerns']
                },
                'maximalist': {
                    name: 'Bitcoin Maximalist',
                    level: 'advanced',
                    interests: ['deep-technical', 'philosophy', 'advocacy', 'advanced-topics'],
                    contentPriority: ['advanced-topics', 'philosophical-deep-dives', 'advocacy']
                }
            },
            
            contentTypes: {
                'fundamentals': {
                    title: 'Bitcoin Fundamentals',
                    description: 'Core concepts and basic understanding',
                    difficulty: 'beginner',
                    estimatedTime: '15-30 minutes'
                },
                'technical-implementation': {
                    title: 'Technical Implementation',
                    description: 'Deep technical details and implementation',
                    difficulty: 'advanced',
                    estimatedTime: '45-60 minutes'
                },
                'investment-strategies': {
                    title: 'Investment Strategies',
                    description: 'Investment approaches and portfolio management',
                    difficulty: 'intermediate',
                    estimatedTime: '30-45 minutes'
                },
                'security': {
                    title: 'Security Best Practices',
                    description: 'Keeping your Bitcoin safe and secure',
                    difficulty: 'all',
                    estimatedTime: '20-30 minutes'
                },
                'business-applications': {
                    title: 'Business Applications',
                    description: 'Using Bitcoin in business contexts',
                    difficulty: 'intermediate',
                    estimatedTime: '30-45 minutes'
                }
            },

            dynamicContent: {
                'fundamentals': [
                    {
                        title: 'What is Bitcoin?',
                        content: 'Bitcoin is a decentralized digital currency that operates without a central bank or single administrator.',
                        tags: ['basics', 'introduction'],
                        personas: ['bitcoin-curious', 'student', 'skeptic', 'retiree'],
                        interactionType: 'reading'
                    },
                    {
                        title: 'How Bitcoin Transactions Work',
                        content: 'Bitcoin transactions are verified by network nodes through cryptography and recorded in a public ledger called the blockchain.',
                        tags: ['transactions', 'blockchain'],
                        personas: ['bitcoin-curious', 'developer', 'business-owner'],
                        interactionType: 'interactive-demo',
                        demoPath: '/interactive-demos/transaction-builder/'
                    }
                ],
                'security': [
                    {
                        title: 'Securing Your Bitcoin Wallet',
                        content: 'Learn how to properly secure your Bitcoin using hardware wallets, seed phrases, and best practices.',
                        tags: ['wallet', 'security', 'storage'],
                        personas: ['investor', 'retiree', 'business-owner', 'student'],
                        interactionType: 'interactive-demo',
                        demoPath: '/interactive-demos/wallet-workshop/'
                    },
                    {
                        title: 'Multi-Signature Security',
                        content: 'Advanced security using multiple signatures for Bitcoin transactions.',
                        tags: ['multisig', 'advanced-security'],
                        personas: ['developer', 'business-owner', 'maximalist'],
                        interactionType: 'reading'
                    }
                ],
                'investment-strategies': [
                    {
                        title: 'Dollar-Cost Averaging',
                        content: 'A systematic approach to Bitcoin investment that reduces volatility impact.',
                        tags: ['investment', 'strategy', 'risk-management'],
                        personas: ['investor', 'retiree', 'business-owner'],
                        interactionType: 'calculator'
                    },
                    {
                        title: 'Bitcoin as Portfolio Diversification',
                        content: 'Understanding Bitcoin\'s role in a diversified investment portfolio.',
                        tags: ['portfolio', 'diversification', 'allocation'],
                        personas: ['investor', 'retiree'],
                        interactionType: 'analysis-tool'
                    }
                ]
            }
        };
    }

    /**
     * Set user persona and update content recommendations
     */
    async setPersona(personaId) {
        this.currentPersona = personaId;
        localStorage.setItem('btc-academy-persona', personaId);
        
        // Clear cache to refresh content for new persona
        this.cache.clear();
        
        // Trigger content refresh
        await this.refreshPersonalizedContent();
        
        this.trackEvent('persona-selected', { persona: personaId });
    }

    /**
     * Get personalized content based on current persona and progress
     */
    async getPersonalizedContent(category = 'all', limit = 10) {
        if (!this.currentPersona) {
            return this.getDefaultContent(category, limit);
        }

        const cacheKey = `content-${this.currentPersona}-${category}-${limit}`;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            // Simulate MCP content extraction (would be real API call)
            const content = await this.extractPersonalizedContent(category, limit);
            this.cache.set(cacheKey, content);
            return content;
        } catch (error) {
            console.warn('Failed to load personalized content, falling back to defaults:', error);
            return this.getDefaultContent(category, limit);
        }
    }

    /**
     * Extract personalized content (simulates MCP backend)
     */
    async extractPersonalizedContent(category, limit) {
        return new Promise((resolve) => {
            // Simulate API delay
            setTimeout(() => {
                const persona = this.contentDatabase.personas[this.currentPersona];
                if (!persona) {
                    resolve(this.getDefaultContent(category, limit));
                    return;
                }

                let relevantContent = [];
                
                // Get content from all categories if 'all' requested
                const categories = category === 'all' ? 
                    Object.keys(this.contentDatabase.dynamicContent) : 
                    [category];

                categories.forEach(cat => {
                    if (this.contentDatabase.dynamicContent[cat]) {
                        const categoryContent = this.contentDatabase.dynamicContent[cat]
                            .filter(item => 
                                item.personas.includes(this.currentPersona) ||
                                persona.contentPriority.includes(cat)
                            )
                            .map(item => ({
                                ...item,
                                category: cat,
                                relevanceScore: this.calculateRelevanceScore(item, persona),
                                completed: this.userProgress.completedContent.includes(item.title)
                            }));
                        
                        relevantContent = relevantContent.concat(categoryContent);
                    }
                });

                // Sort by relevance and filter completed if user wants fresh content
                relevantContent.sort((a, b) => b.relevanceScore - a.relevanceScore);
                
                // Prioritize incomplete content
                const incompleteContent = relevantContent.filter(item => !item.completed);
                const completedContent = relevantContent.filter(item => item.completed);
                
                const finalContent = [...incompleteContent, ...completedContent].slice(0, limit);
                
                resolve({
                    content: finalContent,
                    persona: persona,
                    totalAvailable: relevantContent.length,
                    recommendations: this.generateRecommendations(persona)
                });
            }, 300); // Simulate network delay
        });
    }

    /**
     * Calculate relevance score for content item
     */
    calculateRelevanceScore(item, persona) {
        let score = 0;
        
        // Base score for persona match
        if (item.personas.includes(this.currentPersona)) {
            score += 10;
        }
        
        // Interest alignment
        persona.interests.forEach(interest => {
            if (item.tags.includes(interest)) {
                score += 5;
            }
        });
        
        // Adjust for user progress
        if (!this.userProgress.completedContent.includes(item.title)) {
            score += 3; // Prioritize new content
        }
        
        // Level appropriateness
        const userLevel = this.userProgress.level || persona.level;
        if (this.contentDatabase.contentTypes[item.category]?.difficulty === userLevel) {
            score += 8;
        }
        
        return score;
    }

    /**
     * Generate smart recommendations based on persona and progress
     */
    generateRecommendations(persona) {
        const recommendations = [];
        
        // Next steps based on completed content
        if (this.userProgress.completedContent.length === 0) {
            recommendations.push({
                type: 'getting-started',
                title: `Welcome, ${persona.name}!`,
                description: 'Start with the fundamentals tailored to your interests',
                action: 'Begin Learning Path',
                priority: 'high'
            });
        }
        
        // Interactive demo suggestions
        if (persona.interests.includes('hands-on') || persona.level === 'beginner') {
            recommendations.push({
                type: 'interactive',
                title: 'Try Interactive Demos',
                description: 'Learn by doing with our interactive Bitcoin tools',
                action: 'Explore Demos',
                priority: 'medium'
            });
        }
        
        // Advanced content for experienced users
        if (persona.level === 'advanced' && this.userProgress.completedContent.length > 5) {
            recommendations.push({
                type: 'advanced',
                title: 'Advanced Topics',
                description: 'Dive deeper into technical implementation and philosophy',
                action: 'Explore Advanced',
                priority: 'medium'
            });
        }
        
        return recommendations;
    }

    /**
     * Get default content when no persona is set
     */
    getDefaultContent(category, limit) {
        const allContent = [];
        const categories = category === 'all' ? 
            Object.keys(this.contentDatabase.dynamicContent) : 
            [category];
            
        categories.forEach(cat => {
            if (this.contentDatabase.dynamicContent[cat]) {
                const categoryContent = this.contentDatabase.dynamicContent[cat]
                    .map(item => ({
                        ...item,
                        category: cat,
                        relevanceScore: 5, // neutral score
                        completed: false
                    }));
                allContent.push(...categoryContent);
            }
        });
        
        return {
            content: allContent.slice(0, limit),
            persona: null,
            totalAvailable: allContent.length,
            recommendations: [{
                type: 'persona-selection',
                title: 'Choose Your Learning Path',
                description: 'Select your persona to get personalized content',
                action: 'Select Persona',
                priority: 'high'
            }]
        };
    }

    /**
     * Mark content as completed and update progress
     */
    async markContentCompleted(contentTitle) {
        if (!this.userProgress.completedContent.includes(contentTitle)) {
            this.userProgress.completedContent.push(contentTitle);
            this.userProgress.lastActivity = new Date().toISOString();
            this.saveUserProgress();
            
            // Clear relevant cache
            this.cache.clear();
            
            this.trackEvent('content-completed', { 
                content: contentTitle, 
                persona: this.currentPersona 
            });
            
            // Check for achievements
            this.checkAchievements();
        }
    }

    /**
     * Load user progress from localStorage
     */
    loadUserProgress() {
        const saved = localStorage.getItem('btc-academy-progress');
        if (saved) {
            return JSON.parse(saved);
        }
        
        return {
            completedContent: [],
            level: 'beginner',
            achievements: [],
            lastActivity: new Date().toISOString(),
            totalTimeSpent: 0
        };
    }

    /**
     * Save user progress to localStorage
     */
    saveUserProgress() {
        localStorage.setItem('btc-academy-progress', JSON.stringify(this.userProgress));
    }

    /**
     * Check for achievements based on progress
     */
    checkAchievements() {
        const achievements = [];
        const completedCount = this.userProgress.completedContent.length;
        
        // First completion
        if (completedCount === 1 && !this.userProgress.achievements.includes('first-steps')) {
            achievements.push({
                id: 'first-steps',
                title: 'First Steps',
                description: 'Completed your first learning module',
                icon: '🎯'
            });
        }
        
        // Multiple completions
        if (completedCount >= 5 && !this.userProgress.achievements.includes('knowledge-seeker')) {
            achievements.push({
                id: 'knowledge-seeker',
                title: 'Knowledge Seeker',
                description: 'Completed 5 learning modules',
                icon: '📚'
            });
        }
        
        if (completedCount >= 10 && !this.userProgress.achievements.includes('bitcoin-student')) {
            achievements.push({
                id: 'bitcoin-student',
                title: 'Bitcoin Student',
                description: 'Completed 10 learning modules',
                icon: '🎓'
            });
        }
        
        // Add new achievements
        achievements.forEach(achievement => {
            if (!this.userProgress.achievements.includes(achievement.id)) {
                this.userProgress.achievements.push(achievement.id);
                this.showAchievementNotification(achievement);
            }
        });
        
        if (achievements.length > 0) {
            this.saveUserProgress();
        }
    }

    /**
     * Show achievement notification
     */
    showAchievementNotification(achievement) {
        // Create achievement popup
        const popup = document.createElement('div');
        popup.className = 'achievement-popup';
        popup.innerHTML = `
            <div class="achievement-content">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-details">
                    <h4>Achievement Unlocked!</h4>
                    <h3>${achievement.title}</h3>
                    <p>${achievement.description}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // Auto-remove after 4 seconds
        setTimeout(() => {
            popup.remove();
        }, 4000);
    }

    /**
     * Get current user progress and persona info
     */
    getUserInfo() {
        const persona = this.currentPersona ? 
            this.contentDatabase.personas[this.currentPersona] : null;
            
        return {
            persona,
            progress: this.userProgress,
            completionRate: this.calculateCompletionRate(),
            nextRecommendations: persona ? this.generateRecommendations(persona) : []
        };
    }

    /**
     * Calculate overall completion rate
     */
    calculateCompletionRate() {
        if (!this.currentPersona) return 0;
        
        const persona = this.contentDatabase.personas[this.currentPersona];
        if (!persona) return 0;
        
        // Count total relevant content for this persona
        let totalRelevantContent = 0;
        Object.values(this.contentDatabase.dynamicContent).forEach(categoryContent => {
            categoryContent.forEach(item => {
                if (item.personas.includes(this.currentPersona)) {
                    totalRelevantContent++;
                }
            });
        });
        
        const completed = this.userProgress.completedContent.length;
        return totalRelevantContent > 0 ? Math.round((completed / totalRelevantContent) * 100) : 0;
    }

    /**
     * Refresh personalized content
     */
    async refreshPersonalizedContent() {
        this.cache.clear();
        
        // Trigger content refresh event
        window.dispatchEvent(new CustomEvent('mcpContentRefresh', {
            detail: {
                persona: this.currentPersona,
                userInfo: this.getUserInfo()
            }
        }));
    }

    /**
     * Track user events for analytics
     */
    trackEvent(eventName, data) {
        // In a real implementation, this would send to analytics
        console.log('MCP Event:', eventName, data);
        
        // Store locally for demo purposes
        const events = JSON.parse(localStorage.getItem('btc-academy-events') || '[]');
        events.push({
            event: eventName,
            data,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 100 events
        if (events.length > 100) {
            events.splice(0, events.length - 100);
        }
        
        localStorage.setItem('btc-academy-events', JSON.stringify(events));
    }

    /**
     * Initialize persona from localStorage if exists
     */
    async initialize() {
        const savedPersona = localStorage.getItem('btc-academy-persona');
        if (savedPersona && this.contentDatabase.personas[savedPersona]) {
            this.currentPersona = savedPersona;
            await this.refreshPersonalizedContent();
        }
    }
}

// Global instance
window.mcpService = new MCPContentService();

// Auto-initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.mcpService.initialize();
    });
} else {
    window.mcpService.initialize();
}

// Export for module use
export default MCPContentService;