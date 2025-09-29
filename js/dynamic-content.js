/**
 * Dynamic Content Loader
 * Integrates MCP service with homepage to populate content dynamically based on persona
 */

class DynamicContentLoader {
    constructor() {
        this.mcpService = window.mcpService;
        this.contentContainers = new Map();
        this.initialized = false;
        this.setupEventListeners();
    }

    /**
     * Initialize dynamic content loading
     */
    async initialize() {
        if (this.initialized) return;
        
        // Wait for MCP service to be ready
        if (!this.mcpService) {
            console.warn('MCP Service not available, retrying...');
            setTimeout(() => this.initialize(), 100);
            return;
        }
        
        this.initialized = true;
        
        // Map content containers on the page
        this.mapContentContainers();
        
        // Load initial content
        await this.loadInitialContent();
        
        // Set up dynamic updates
        this.setupDynamicUpdates();
        
        console.log('Dynamic Content Loader initialized');
    }

    /**
     * Map content containers that should be dynamically populated
     */
    mapContentContainers() {
        // Main content sections
        this.contentContainers.set('learning-path', {
            selector: '#learning-path-content',
            type: 'learning-path',
            limit: 4
        });
        
        this.contentContainers.set('featured-content', {
            selector: '#featured-content',
            type: 'featured',
            limit: 3
        });
        
        this.contentContainers.set('recommendations', {
            selector: '#recommendations-container',
            type: 'recommendations',
            limit: 5
        });
        
        this.contentContainers.set('progress-section', {
            selector: '#progress-section',
            type: 'progress',
            limit: 1
        });

        // AI Agent integration points
        this.contentContainers.set('ai-suggestions', {
            selector: '#ai-suggestions',
            type: 'ai-powered',
            limit: 6
        });
    }

    /**
     * Load initial content based on current persona
     */
    async loadInitialContent() {
        try {
            // Get user info and personalized content
            const userInfo = this.mcpService.getUserInfo();
            const content = await this.mcpService.getPersonalizedContent('all', 20);
            
            // Update each content container
            for (const [containerId, config] of this.contentContainers) {
                await this.updateContentContainer(containerId, config, content, userInfo);
            }
            
        } catch (error) {
            console.error('Failed to load initial content:', error);
        }
    }

    /**
     * Update specific content container
     */
    async updateContentContainer(containerId, config, content = null, userInfo = null) {
        const container = document.querySelector(config.selector);
        if (!container) {
            console.warn(`Container not found: ${config.selector}`);
            return;
        }
        
        // Get content if not provided
        if (!content) {
            content = await this.mcpService.getPersonalizedContent('all', config.limit);
        }
        
        if (!userInfo) {
            userInfo = this.mcpService.getUserInfo();
        }
        
        // Generate content based on type
        let html = '';
        switch (config.type) {
            case 'learning-path':
                html = this.generateLearningPathContent(content, userInfo, config.limit);
                break;
            case 'featured':
                html = this.generateFeaturedContent(content, userInfo, config.limit);
                break;
            case 'recommendations':
                html = this.generateRecommendationsContent(content, userInfo, config.limit);
                break;
            case 'progress':
                html = this.generateProgressContent(content, userInfo);
                break;
            case 'ai-powered':
                html = this.generateAIPoweredContent(content, userInfo, config.limit);
                break;
            default:
                html = this.generateGenericContent(content, userInfo, config.limit);
        }
        
        // Update container with animation
        this.updateWithAnimation(container, html);
    }

    /**
     * Generate learning path content
     */
    generateLearningPathContent(content, userInfo, limit) {
        const persona = userInfo.persona;
        const relevantContent = content.content.slice(0, limit);
        
        if (!persona) {
            return `
                <div class="persona-prompt">
                    <div class="persona-prompt-content">
                        <h3>🎯 Choose Your Learning Journey</h3>
                        <p>Select your persona to get a personalized Bitcoin education experience</p>
                        <button class="cta-button" onclick="document.getElementById('personaModal').style.display='block'">
                            Select Your Persona
                        </button>
                    </div>
                </div>
            `;
        }
        
        let html = `
            <div class="learning-path-header">
                <h3>📚 Your Learning Path - ${persona.name}</h3>
                <div class="progress-indicator">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${userInfo.completionRate}%"></div>
                    </div>
                    <span class="progress-text">${userInfo.completionRate}% Complete</span>
                </div>
            </div>
            <div class="learning-path-grid">
        `;
        
        relevantContent.forEach((item, index) => {
            const isCompleted = item.completed;
            const isRecommended = index < 2; // First 2 are highly recommended
            
            html += `
                <div class="learning-path-item ${isCompleted ? 'completed' : ''} ${isRecommended ? 'recommended' : ''}"
                     onclick="handleContentInteraction('${item.title}', '${item.interactionType}', '${item.demoPath || ''}')">
                    <div class="learning-item-header">
                        <div class="learning-item-icon">
                            ${isCompleted ? '✅' : isRecommended ? '⭐' : '📖'}
                        </div>
                        <div class="learning-item-category">${item.category}</div>
                    </div>
                    <h4>${item.title}</h4>
                    <p>${item.content.substring(0, 120)}...</p>
                    <div class="learning-item-footer">
                        <span class="interaction-type ${item.interactionType}">
                            ${this.getInteractionTypeIcon(item.interactionType)} ${this.formatInteractionType(item.interactionType)}
                        </span>
                        ${isRecommended ? '<span class="recommended-badge">Recommended</span>' : ''}
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        
        return html;
    }

    /**
     * Generate featured content section
     */
    generateFeaturedContent(content, userInfo, limit) {
        const featuredItems = content.content
            .filter(item => item.relevanceScore > 8)
            .slice(0, limit);
        
        if (featuredItems.length === 0) {
            return '<div class="no-content">No featured content available</div>';
        }
        
        let html = '<div class="featured-content-grid">';
        
        featuredItems.forEach(item => {
            html += `
                <div class="featured-content-card" 
                     onclick="handleContentInteraction('${item.title}', '${item.interactionType}', '${item.demoPath || ''}')">
                    <div class="featured-card-header">
                        <div class="featured-category">${item.category}</div>
                        <div class="featured-score">⚡ ${item.relevanceScore}/10</div>
                    </div>
                    <h4>${item.title}</h4>
                    <p>${item.content}</p>
                    <div class="featured-tags">
                        ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <button class="featured-cta">
                        ${item.interactionType === 'interactive-demo' ? 'Try Demo' : 'Learn More'}
                    </button>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }

    /**
     * Generate recommendations content
     */
    generateRecommendationsContent(content, userInfo, limit) {
        const recommendations = content.recommendations || [];
        
        if (recommendations.length === 0) {
            return '<div class="no-recommendations">All caught up! 🎉</div>';
        }
        
        let html = '<div class="recommendations-list">';
        
        recommendations.slice(0, limit).forEach(rec => {
            html += `
                <div class="recommendation-item priority-${rec.priority}">
                    <div class="recommendation-icon">
                        ${this.getRecommendationIcon(rec.type)}
                    </div>
                    <div class="recommendation-content">
                        <h4>${rec.title}</h4>
                        <p>${rec.description}</p>
                        <button class="recommendation-cta" onclick="handleRecommendationAction('${rec.type}')">
                            ${rec.action}
                        </button>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }

    /**
     * Generate progress content
     */
    generateProgressContent(content, userInfo) {
        const progress = userInfo.progress;
        const persona = userInfo.persona;
        
        if (!persona) {
            return '<div class="progress-placeholder">Select a persona to track progress</div>';
        }
        
        return `
            <div class="progress-dashboard">
                <div class="progress-stats">
                    <div class="stat-item">
                        <div class="stat-number">${progress.completedContent.length}</div>
                        <div class="stat-label">Completed</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${userInfo.completionRate}%</div>
                        <div class="stat-label">Progress</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${progress.achievements.length}</div>
                        <div class="stat-label">Achievements</div>
                    </div>
                </div>
                <div class="recent-achievements">
                    <h4>Recent Achievements</h4>
                    ${progress.achievements.length > 0 ? 
                        progress.achievements.slice(-3).map(achievement => 
                            `<div class="achievement-badge">${this.getAchievementIcon(achievement)} ${this.formatAchievement(achievement)}</div>`
                        ).join('') : 
                        '<div class="no-achievements">Complete your first module to earn achievements!</div>'
                    }
                </div>
            </div>
        `;
    }

    /**
     * Generate AI-powered content suggestions
     */
    generateAIPoweredContent(content, userInfo, limit) {
        const aiContent = content.content
            .slice(0, limit)
            .map(item => ({
                ...item,
                aiReason: this.generateAIReason(item, userInfo.persona)
            }));
        
        let html = '<div class="ai-suggestions-grid">';
        
        aiContent.forEach(item => {
            html += `
                <div class="ai-suggestion-card">
                    <div class="ai-badge">🤖 AI Recommended</div>
                    <h4>${item.title}</h4>
                    <p class="ai-reason">${item.aiReason}</p>
                    <div class="suggestion-footer">
                        <span class="relevance-score">${item.relevanceScore}/10 match</span>
                        <button class="try-suggestion" onclick="handleContentInteraction('${item.title}', '${item.interactionType}', '${item.demoPath || ''}')">
                            Try It
                        </button>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }

    /**
     * Generate AI reasoning for content recommendation
     */
    generateAIReason(item, persona) {
        if (!persona) return 'Great starting point for Bitcoin learning';
        
        const reasons = [
            `Perfect for ${persona.name.toLowerCase()}s interested in ${item.tags[0]}`,
            `Matches your ${persona.level} level and ${persona.interests[0]} focus`,
            `Recommended based on your progress in ${item.category}`,
            `Highly relevant to your ${persona.interests.join(' and ')} interests`,
            `Next logical step in your ${persona.name} learning journey`
        ];
        
        return reasons[Math.floor(Math.random() * reasons.length)];
    }

    /**
     * Helper functions for icons and formatting
     */
    getInteractionTypeIcon(type) {
        const icons = {
            'reading': '📖',
            'interactive-demo': '🎮',
            'calculator': '🧮',
            'analysis-tool': '📊',
            'video': '🎥',
            'quiz': '🧠'
        };
        return icons[type] || '📄';
    }

    formatInteractionType(type) {
        return type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    getRecommendationIcon(type) {
        const icons = {
            'getting-started': '🚀',
            'interactive': '🎮',
            'advanced': '🎓',
            'persona-selection': '🎯'
        };
        return icons[type] || '💡';
    }

    getAchievementIcon(achievement) {
        // Simple mapping - in real app would have full achievement data
        return '🏆';
    }

    formatAchievement(achievement) {
        return achievement.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    /**
     * Update container content with smooth animation
     */
    updateWithAnimation(container, html) {
        // Fade out
        container.style.opacity = '0.3';
        container.style.transition = 'opacity 0.3s ease';
        
        setTimeout(() => {
            container.innerHTML = html;
            // Remove skeleton state if present
            try {
                container.classList.remove('skel');
                container.removeAttribute('aria-busy');
            } catch {}
            // Fade in
            container.style.opacity = '1';
        }, 300);
    }

    /**
     * Set up event listeners for dynamic updates
     */
    setupEventListeners() {
        // Listen for MCP content refresh events
        window.addEventListener('mcpContentRefresh', async (event) => {
            console.log('MCP content refresh triggered', event.detail);
            await this.loadInitialContent();
        });
        
        // Listen for persona changes
        window.addEventListener('personaChanged', async (event) => {
            console.log('Persona changed', event.detail);
            await this.loadInitialContent();
        });
    }

    /**
     * Set up dynamic content updates (polling for changes)
     */
    setupDynamicUpdates() {
        // Check for content updates every 30 seconds
        setInterval(async () => {
            if (this.mcpService && this.mcpService.currentPersona) {
                // Only update if user has been active
                const lastActivity = localStorage.getItem('btc-academy-last-activity');
                if (lastActivity && Date.now() - parseInt(lastActivity) < 300000) { // 5 minutes
                    await this.updateRecommendations();
                }
            }
        }, 30000);
    }

    /**
     * Update just recommendations (lighter update)
     */
    async updateRecommendations() {
        const config = this.contentContainers.get('recommendations');
        if (config) {
            const userInfo = this.mcpService.getUserInfo();
            const content = await this.mcpService.getPersonalizedContent('all', 5);
            await this.updateContentContainer('recommendations', config, content, userInfo);
        }
    }
}

// Global functions for handling interactions
window.handleContentInteraction = async function(title, type, demoPath) {
    // Track interaction
    if (window.mcpService) {
        window.mcpService.trackEvent('content-interaction', {
            title,
            type,
            demoPath
        });
    }
    
    // Handle different interaction types
    if (type === 'interactive-demo' && demoPath) {
        window.location.href = demoPath;
    } else if (type === 'calculator' || type === 'analysis-tool') {
        // Open relevant tool
        alert(`Opening ${title} tool (demo)`);
    } else {
        // Default: open reading material
        alert(`Opening ${title} content (demo)`);
    }
    
    // Mark as completed after interaction
    if (window.mcpService) {
        await window.mcpService.markContentCompleted(title);
    }
};

window.handleRecommendationAction = function(type) {
    if (type === 'persona-selection') {
        document.getElementById('personaModal').style.display = 'block';
    } else if (type === 'interactive') {
        // Scroll to demos section
        document.getElementById('interactive-demos').scrollIntoView({ behavior: 'smooth' });
    } else if (type === 'getting-started') {
        // Scroll to learning path
        document.getElementById('learning-path-content').scrollIntoView({ behavior: 'smooth' });
    }
};

// Initialize dynamic content loader
const dynamicLoader = new DynamicContentLoader();

// Auto-initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        dynamicLoader.initialize();
    });
} else {
    dynamicLoader.initialize();
}

// Export for module use
export default DynamicContentLoader;