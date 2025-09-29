/**
 * MCP-Powered Content Loader
 * Dynamically extracts and applies Bitcoin educational content based on user personas
 */

class MCPContentLoader {
    constructor() {
        this.baseUrl = '/api/mcp';
        this.contentCache = new Map();
        this.loadingStates = new Set();
    }

    /**
     * Extract personalized Bitcoin content via MCP
     */
    async extractPersonalizedContent(persona, contentType) {
        const cacheKey = `${persona}-${contentType}`;
        
        if (this.contentCache.has(cacheKey)) {
            return this.contentCache.get(cacheKey);
        }

        if (this.loadingStates.has(cacheKey)) {
            return null; // Already loading
        }

        this.loadingStates.add(cacheKey);

        try {
            const response = await fetch(`${this.baseUrl}/generate-content`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    persona: persona,
                    contentType: contentType,
                    sources: [
                        'bitcoin.org',
                        'learnmeabitcoin.com',
                        'bitcoinwiki.org',
                        'river.com/learn',
                        'unchained.com/blog'
                    ],
                    preferences: {
                        technical_level: this.getTechnicalLevel(persona),
                        focus_areas: this.getFocusAreas(persona),
                        learning_style: this.getLearningStyle(persona)
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`MCP request failed: ${response.status}`);
            }

            const data = await response.json();
            this.contentCache.set(cacheKey, data);
            return data;

        } catch (error) {
            console.error('MCP content extraction failed:', error);
            return this.getFallbackContent(persona, contentType);
        } finally {
            this.loadingStates.delete(cacheKey);
        }
    }

    /**
     * Get technical level based on persona
     */
    getTechnicalLevel(persona) {
        const levels = {
            curious: 'beginner',
            investor: 'intermediate', 
            developer: 'advanced',
            libertarian: 'intermediate',
            business: 'intermediate',
            student: 'intermediate',
            retiree: 'beginner',
            entrepreneur: 'intermediate',
            skeptic: 'intermediate',
            maximalist: 'advanced',
            parent: 'beginner',
            global: 'beginner'
        };
        return levels[persona] || 'intermediate';
    }

    /**
     * Get focus areas based on persona
     */
    getFocusAreas(persona) {
        const areas = {
            curious: ['basics', 'history', 'practical'],
            investor: ['economics', 'markets', 'risk'],
            developer: ['technical', 'protocols', 'development'],
            libertarian: ['philosophy', 'sovereignty', 'economics'],
            business: ['integration', 'payments', 'legal'],
            student: ['theory', 'research', 'academic'],
            retiree: ['security', 'storage', 'inheritance'],
            entrepreneur: ['innovation', 'business', 'opportunities'],
            skeptic: ['evidence', 'criticism', 'analysis'],
            maximalist: ['advanced', 'technical', 'ecosystem'],
            parent: ['education', 'family', 'simple'],
            global: ['freedom', 'remittances', 'censorship-resistance']
        };
        return areas[persona] || ['basics'];
    }

    /**
     * Get learning style based on persona
     */
    getLearningStyle(persona) {
        const styles = {
            curious: 'story-driven',
            investor: 'data-driven',
            developer: 'hands-on',
            libertarian: 'conceptual',
            business: 'practical',
            student: 'structured',
            retiree: 'step-by-step',
            entrepreneur: 'case-studies',
            skeptic: 'evidence-based',
            maximalist: 'deep-dive',
            parent: 'analogies',
            global: 'real-world'
        };
        return styles[persona] || 'balanced';
    }

    /**
     * Populate AI agent descriptions with persona-specific content
     */
    async populateAgentContent(persona) {
        const agentCards = document.querySelectorAll('.agent-card');
        
        for (const card of agentCards) {
            const agentName = card.querySelector('.agent-name').textContent;
            const agentKey = agentName.toLowerCase().replace(/\s+/g, '-');
            
            try {
                const content = await this.extractPersonalizedContent(persona, `agent-${agentKey}`);
                if (content && content.description) {
                    const descElement = card.querySelector('.agent-description');
                    descElement.textContent = content.description;
                    
                    // Add interaction capability
                    card.addEventListener('click', () => {
                        this.showAgentInteraction(agentName, content, persona);
                    });
                }
            } catch (error) {
                console.warn(`Failed to load content for agent ${agentName}:`, error);
            }
        }
    }

    /**
     * Show interactive agent dialog
     */
    showAgentInteraction(agentName, content, persona) {
        const modal = document.createElement('div');
        modal.className = 'agent-interaction-modal';
        modal.innerHTML = `
            <div class="agent-modal-content">
                <div class="agent-modal-header">
                    <h3>🤖 ${agentName}</h3>
                    <button class="close-agent-modal">×</button>
                </div>
                <div class="agent-modal-body">
                    <p class="agent-intro">${content.personalizedIntro || content.description}</p>
                    <div class="agent-suggestions">
                        <h4>What would you like to explore?</h4>
                        <div class="suggestion-buttons">
                            ${content.suggestions?.map(suggestion => 
                                `<button class="suggestion-btn" data-suggestion="${suggestion}">${suggestion}</button>`
                            ).join('') || '<p>Loading personalized suggestions...</p>'}
                        </div>
                    </div>
                    <div class="agent-chat">
                        <div class="chat-messages" id="chatMessages"></div>
                        <div class="chat-input">
                            <input type="text" placeholder="Ask ${agentName} anything about Bitcoin..." id="chatInput">
                            <button id="sendChat">Send</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Setup modal interactions
        this.setupAgentModal(modal, agentName, persona);
    }

    /**
     * Setup agent modal interactions
     */
    setupAgentModal(modal, agentName, persona) {
        const closeBtn = modal.querySelector('.close-agent-modal');
        const chatInput = modal.querySelector('#chatInput');
        const sendBtn = modal.querySelector('#sendChat');
        const chatMessages = modal.querySelector('#chatMessages');

        closeBtn.addEventListener('click', () => {
            modal.remove();
        });

        const sendMessage = async () => {
            const message = chatInput.value.trim();
            if (!message) return;

            // Add user message
            this.addChatMessage(chatMessages, message, 'user');
            chatInput.value = '';

            // Get AI response via MCP
            try {
                const response = await this.getAgentResponse(agentName, message, persona);
                this.addChatMessage(chatMessages, response, 'agent');
            } catch (error) {
                this.addChatMessage(chatMessages, 'Sorry, I encountered an error. Please try again.', 'agent');
            }
        };

        sendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });

        // Handle suggestion clicks
        modal.querySelectorAll('.suggestion-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const suggestion = btn.dataset.suggestion;
                this.addChatMessage(chatMessages, suggestion, 'user');
                
                try {
                    const response = await this.getAgentResponse(agentName, suggestion, persona);
                    this.addChatMessage(chatMessages, response, 'agent');
                } catch (error) {
                    this.addChatMessage(chatMessages, 'Let me help you with that...', 'agent');
                }
            });
        });
    }

    /**
     * Add message to chat
     */
    addChatMessage(container, message, sender) {
        const messageEl = document.createElement('div');
        messageEl.className = `chat-message ${sender}`;
        messageEl.innerHTML = `
            <div class="message-bubble">
                ${sender === 'agent' ? '🤖' : '👤'} ${message}
            </div>
        `;
        container.appendChild(messageEl);
        container.scrollTop = container.scrollHeight;
    }

    /**
     * Get AI agent response via MCP
     */
    async getAgentResponse(agentName, question, persona) {
        try {
            const response = await fetch(`${this.baseUrl}/agent-chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    agent: agentName,
                    question: question,
                    persona: persona,
                    context: {
                        previous_interactions: [],
                        learning_progress: window.guidanceSystem?.progress || 0
                    }
                })
            });

            if (!response.ok) {
                throw new Error('Agent response failed');
            }

            const data = await response.json();
            return data.response || data.message;

        } catch (error) {
            console.error('Agent response error:', error);
            return this.getFallbackAgentResponse(agentName, question);
        }
    }

    /**
     * Populate interactive demo content
     */
    async populateDemoContent(persona) {
        const demoCards = document.querySelectorAll('.feature-card');
        
        for (const card of demoCards) {
            const title = card.querySelector('.feature-title').textContent;
            const demoKey = title.toLowerCase().replace(/\s+/g, '-');
            
            try {
                const content = await this.extractPersonalizedContent(persona, `demo-${demoKey}`);
                if (content && content.personalizedDescription) {
                    const descElement = card.querySelector('.feature-description');
                    descElement.textContent = content.personalizedDescription;
                }
                
                if (content && content.badge) {
                    const badgeElement = card.querySelector('.feature-badge');
                    if (badgeElement) {
                        badgeElement.textContent = content.badge;
                        badgeElement.className = `feature-badge ${content.badgeClass || 'badge-live'}`;
                    }
                }
            } catch (error) {
                console.warn(`Failed to load demo content for ${title}:`, error);
            }
        }
    }

    /**
     * Get fallback content when MCP fails
     */
    getFallbackContent(persona, contentType) {
        const fallbacks = {
            'curious-agent-philosophy-guide': {
                description: 'Explore the philosophical foundations of Bitcoin and understand why decentralized money matters.',
                suggestions: ['Why was Bitcoin created?', 'What makes money valuable?', 'How does Bitcoin relate to freedom?']
            },
            'investor-demo-utxo-visualizer': {
                personalizedDescription: 'Understand Bitcoin transactions from an investment perspective - see how UTXOs affect liquidity and portfolio management.',
                badge: 'ESSENTIAL',
                badgeClass: 'badge-live'
            }
            // Add more fallbacks as needed
        };
        
        return fallbacks[`${persona}-${contentType}`] || {
            description: 'Personalized content is loading...',
            suggestions: ['Tell me more about this topic']
        };
    }

    /**
     * Get fallback agent response
     */
    getFallbackAgentResponse(agentName, question) {
        const responses = {
            'Philosophy Guide': 'That\'s a great philosophical question about Bitcoin. Let me help you explore the deeper implications...',
            'Strategy Advisor': 'From a strategic perspective, here\'s what you should consider...',
            'Data Poet': 'The blockchain data reveals an interesting pattern related to your question...'
        };
        
        return responses[agentName] || 'That\'s an excellent question! Let me help you understand this Bitcoin concept better.';
    }

    /**
     * Initialize content loading for a specific persona
     */
    async initializePersonaContent(persona) {
        console.log(`Loading personalized content for: ${persona}`);
        
        // Show loading indicators
        this.showLoadingIndicators();
        
        try {
            // Load content in parallel
            await Promise.all([
                this.populateAgentContent(persona),
                this.populateDemoContent(persona),
                this.loadPersonalizedTips(persona)
            ]);
            
            console.log(`Content loaded successfully for: ${persona}`);
        } catch (error) {
            console.error('Failed to load personalized content:', error);
        } finally {
            this.hideLoadingIndicators();
        }
    }

    /**
     * Load personalized learning tips
     */
    async loadPersonalizedTips(persona) {
        try {
            const tips = await this.extractPersonalizedContent(persona, 'learning-tips');
            if (tips && tips.tips) {
                // Update help system with personalized tips
                window.guidanceSystem.updatePersonalizedTips(tips.tips);
            }
        } catch (error) {
            console.warn('Failed to load personalized tips:', error);
        }
    }

    /**
     * Show loading indicators
     */
    showLoadingIndicators() {
        document.querySelectorAll('.agent-description, .feature-description').forEach(el => {
            if (!el.dataset.originalText) {
                el.dataset.originalText = el.textContent;
                el.innerHTML = '<span class="loading-dots">Loading personalized content<span>.</span><span>.</span><span>.</span></span>';
            }
        });
    }

    /**
     * Hide loading indicators
     */
    hideLoadingIndicators() {
        document.querySelectorAll('.agent-description, .feature-description').forEach(el => {
            if (el.dataset.originalText && el.innerHTML.includes('loading-dots')) {
                el.textContent = el.dataset.originalText;
                delete el.dataset.originalText;
            }
        });
    }
}

// Add loading animation CSS
const loadingCSS = `
    <style>
    .loading-dots span {
        animation: loading 1.4s ease-in-out infinite both;
    }
    .loading-dots span:nth-child(1) { animation-delay: -0.32s; }
    .loading-dots span:nth-child(2) { animation-delay: -0.16s; }
    
    @keyframes loading {
        0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
        40% { transform: scale(1); opacity: 1; }
    }
    
    .agent-interaction-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    }
    
    .agent-modal-content {
        background: var(--secondary-dark);
        border: 2px solid var(--primary-orange);
        border-radius: 20px;
        padding: 0;
        max-width: 600px;
        max-height: 80vh;
        width: 90%;
        overflow: hidden;
    }
    
    .agent-modal-header {
        background: var(--gradient-orange);
        padding: 1rem 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .agent-modal-header h3 {
        color: white;
        margin: 0;
    }
    
    .close-agent-modal {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
    }
    
    .agent-modal-body {
        padding: 2rem;
        overflow-y: auto;
        max-height: 60vh;
    }
    
    .suggestion-buttons {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        margin: 1rem 0;
    }
    
    .suggestion-btn {
        background: rgba(247, 147, 26, 0.2);
        border: 1px solid var(--primary-orange);
        color: var(--primary-orange);
        padding: 0.5rem 1rem;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .suggestion-btn:hover {
        background: var(--primary-orange);
        color: white;
    }
    
    .chat-messages {
        max-height: 200px;
        overflow-y: auto;
        margin: 1rem 0;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 10px;
    }
    
    .chat-message {
        margin-bottom: 1rem;
    }
    
    .message-bubble {
        background: rgba(247, 147, 26, 0.1);
        padding: 0.5rem 1rem;
        border-radius: 10px;
        color: var(--text-light);
    }
    
    .chat-message.agent .message-bubble {
        background: rgba(247, 147, 26, 0.2);
    }
    
    .chat-input {
        display: flex;
        gap: 0.5rem;
    }
    
    .chat-input input {
        flex: 1;
        padding: 0.5rem;
        border: 1px solid var(--primary-orange);
        border-radius: 5px;
        background: rgba(0, 0, 0, 0.3);
        color: var(--text-light);
    }
    
    .chat-input button {
        background: var(--primary-orange);
        border: none;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        cursor: pointer;
    }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', loadingCSS);

// Export for global use
window.MCPContentLoader = MCPContentLoader;