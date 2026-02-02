/**
 * Gemini AI Tutor UI Component
 * Interactive chat interface for Bitcoin education
 * Enhanced with context awareness and improved UX
 */

class GeminiTutorUI {
    constructor() {
        this.gemini = window.geminiService;
        this.container = null;
        this.chatWindow = null;
        this.isOpen = false;
        this.isMinimized = false;
        this.currentContext = {
            level: 'beginner',
            topic: 'bitcoin-basics',
            persona: 'curious'
        };

        // Wait for gemini service to be ready
        if (!this.gemini) {
            window.addEventListener('load', () => {
                this.gemini = window.geminiService;
                this.init();
            });
        } else {
            this.init();
        }
    }

    init() {
        this.createTutorButton();
        this.createChatInterface();
        this.bindEvents();
        this.updateContextDisplay();
    }

    createTutorButton() {
        const button = document.createElement('button');
        button.id = 'gemini-tutor-btn';
        button.setAttribute('aria-label', 'Open AI Tutor');
        button.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span class="tutor-btn-text">Ask AI Tutor</span>
            <span class="tutor-btn-badge" style="display: none;"></span>
        `;
        button.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 10000;
            padding: 14px 24px;
            background: linear-gradient(135deg, #f7931a 0%, #ffb347 100%);
            color: white;
            border: none;
            border-radius: 50px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(247, 147, 26, 0.4);
            display: flex;
            align-items: center;
            gap: 10px;
            transition: all 0.3s ease;
            min-height: 48px;
        `;

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px) scale(1.02)';
            button.style.boxShadow = '0 6px 25px rgba(247, 147, 26, 0.6)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0) scale(1)';
            button.style.boxShadow = '0 4px 20px rgba(247, 147, 26, 0.4)';
        });

        document.body.appendChild(button);
        this.tutorButton = button;
    }

    createChatInterface() {
        const container = document.createElement('div');
        container.id = 'gemini-tutor-chat';
        container.setAttribute('role', 'dialog');
        container.setAttribute('aria-label', 'AI Bitcoin Tutor Chat');
        container.style.cssText = `
            position: fixed;
            bottom: 90px;
            right: 24px;
            width: 420px;
            max-width: calc(100vw - 48px);
            height: 600px;
            max-height: calc(100vh - 140px);
            background: #1a1a1a;
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(247, 147, 26, 0.2);
            z-index: 9999;
            display: none;
            flex-direction: column;
            overflow: hidden;
            border: 2px solid rgba(247, 147, 26, 0.3);
        `;

        container.innerHTML = `
            <div class="chat-header" style="
                padding: 16px 20px;
                background: linear-gradient(135deg, rgba(247, 147, 26, 0.15) 0%, rgba(247, 147, 26, 0.05) 100%);
                border-bottom: 1px solid rgba(247, 147, 26, 0.2);
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
                <div>
                    <h3 style="margin: 0; font-size: 16px; color: #f7931a; font-weight: 700;">🎓 AI Bitcoin Tutor</h3>
                    <p id="tutor-context-display" style="margin: 4px 0 0 0; font-size: 12px; color: #999;">Bitcoin Learning</p>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button id="clear-chat" aria-label="Clear conversation" title="Clear conversation" style="
                        background: rgba(255,255,255,0.05);
                        border: 1px solid rgba(255,255,255,0.1);
                        color: #999;
                        font-size: 14px;
                        cursor: pointer;
                        width: 32px;
                        height: 32px;
                        border-radius: 8px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">🗑️</button>
                    <button id="close-tutor" aria-label="Close tutor" style="
                        background: rgba(255,255,255,0.05);
                        border: 1px solid rgba(255,255,255,0.1);
                        color: #e0e0e0;
                        font-size: 18px;
                        cursor: pointer;
                        width: 32px;
                        height: 32px;
                        border-radius: 8px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">&times;</button>
                </div>
            </div>

            <div class="chat-messages" id="chat-messages" style="
                flex: 1;
                overflow-y: auto;
                padding: 16px;
                display: flex;
                flex-direction: column;
                gap: 12px;
                scroll-behavior: smooth;
            "></div>

            <div class="chat-quick-questions" id="quick-questions" style="
                padding: 12px 16px;
                border-top: 1px solid rgba(255,255,255,0.1);
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
                background: rgba(0,0,0,0.2);
            "></div>

            <div class="chat-input-area" style="
                padding: 16px;
                border-top: 1px solid rgba(255,255,255,0.1);
                background: #2d2d2d;
            ">
                <div style="display: flex; gap: 10px;">
                    <input
                        type="text"
                        id="chat-input"
                        placeholder="Ask me anything about Bitcoin..."
                        aria-label="Chat message input"
                        style="
                            flex: 1;
                            padding: 12px 16px;
                            border: 2px solid rgba(247, 147, 26, 0.2);
                            border-radius: 12px;
                            background: #1a1a1a;
                            color: #e0e0e0;
                            font-size: 14px;
                            transition: border-color 0.2s ease;
                        "
                    />
                    <button id="send-btn" aria-label="Send message" style="
                        padding: 12px 20px;
                        background: linear-gradient(135deg, #f7931a 0%, #ffb347 100%);
                        border: none;
                        border-radius: 12px;
                        color: white;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        min-width: 70px;
                    ">Send</button>
                </div>
                <div id="api-key-notice" style="margin-top: 10px; font-size: 11px; color: #666; display: none;">
                    <a href="#" id="api-key-link" style="color: #f7931a;">⚙️ Configure API Key</a> to enable AI responses
                </div>
            </div>
        `;

        document.body.appendChild(container);
        this.container = container;
        this.chatMessages = container.querySelector('#chat-messages');
        this.chatInput = container.querySelector('#chat-input');
        this.sendBtn = container.querySelector('#send-btn');
        this.contextDisplay = container.querySelector('#tutor-context-display');
        this.apiKeyNotice = container.querySelector('#api-key-notice');

        // Add welcome message
        this.addWelcomeMessage();
        this.addQuickQuestions();
        this.checkApiKeyStatus();
    }

    bindEvents() {
        // Toggle chat
        this.tutorButton.addEventListener('click', () => this.toggleChat());
        this.container.querySelector('#close-tutor').addEventListener('click', () => this.toggleChat());

        // Clear chat
        this.container.querySelector('#clear-chat').addEventListener('click', () => this.clearChat());

        // Send message
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Input focus styling
        this.chatInput.addEventListener('focus', () => {
            this.chatInput.style.borderColor = 'rgba(247, 147, 26, 0.5)';
        });
        this.chatInput.addEventListener('blur', () => {
            this.chatInput.style.borderColor = 'rgba(247, 147, 26, 0.2)';
        });

        // API key link
        this.container.querySelector('#api-key-link').addEventListener('click', (e) => {
            e.preventDefault();
            this.promptForApiKey();
        });

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.toggleChat();
            }
        });
    }

    updateContextDisplay() {
        if (this.gemini && this.contextDisplay) {
            this.contextDisplay.textContent = this.gemini.getContextSummary();
        }
    }

    checkApiKeyStatus() {
        if (this.gemini && !this.gemini.hasApiKey()) {
            this.apiKeyNotice.style.display = 'block';
        } else {
            this.apiKeyNotice.style.display = 'none';
        }
    }

    clearChat() {
        if (confirm('Clear conversation history?')) {
            this.chatMessages.innerHTML = '';
            if (this.gemini) {
                this.gemini.clearHistory();
            }
            this.addWelcomeMessage();
            this.addQuickQuestions();
        }
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        this.container.style.display = this.isOpen ? 'flex' : 'none';

        if (this.isOpen) {
            this.chatInput.focus();
        }
    }

    addWelcomeMessage() {
        const contextSummary = this.gemini ? this.gemini.getContextSummary() : 'Bitcoin Learning';
        const isOnDemo = this.gemini?.pageContext?.type === 'demo';
        const topic = this.gemini?.pageContext?.topic || '';

        let welcomeText = `Welcome! 👋 I'm your Bitcoin tutor.

I use the Socratic method - I'll ask questions to help you discover insights yourself rather than just giving answers.`;

        if (isOnDemo && topic) {
            welcomeText += `\n\nI see you're exploring **${topic}**. What aspect interests you most, or what question brought you here?`;
        } else {
            welcomeText += `\n\nWhat would you like to explore today?`;
        }

        const message = this.createMessage(welcomeText, 'assistant');
        this.chatMessages.appendChild(message);
    }

    addQuickQuestions() {
        // Get context-aware questions from the service
        const questions = this.gemini?.getSuggestedQuestions() || [
            "What is Bitcoin?",
            "Why does this matter?",
            "How do I get started?"
        ];

        const container = this.container.querySelector('#quick-questions');
        container.innerHTML = '<div style="width: 100%; font-size: 11px; color: #666; margin-bottom: 6px;">💡 Suggested:</div>';

        questions.forEach(q => {
            const btn = document.createElement('button');
            btn.textContent = q;
            btn.setAttribute('aria-label', `Ask: ${q}`);
            btn.style.cssText = `
                padding: 6px 12px;
                background: rgba(247, 147, 26, 0.1);
                border: 1px solid rgba(247, 147, 26, 0.2);
                border-radius: 16px;
                color: #e0e0e0;
                font-size: 11px;
                cursor: pointer;
                transition: all 0.2s ease;
                white-space: nowrap;
            `;
            btn.addEventListener('click', () => {
                this.chatInput.value = q;
                this.sendMessage();
            });
            btn.addEventListener('mouseenter', () => {
                btn.style.background = 'rgba(247, 147, 26, 0.2)';
                btn.style.borderColor = 'rgba(247, 147, 26, 0.4)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.background = 'rgba(247, 147, 26, 0.1)';
                btn.style.borderColor = 'rgba(247, 147, 26, 0.2)';
            });
            container.appendChild(btn);
        });
    }

    async sendMessage() {
        const text = this.chatInput.value.trim();
        if (!text) return;

        // Check if API key is set, prompt if not
        if (!this.gemini.apiKey) {
            const key = prompt('Please enter your Gemini API key to use the AI Tutor.\n\nGet a free key at: https://makersuite.google.com/app/apikey');
            if (key) {
                this.gemini.setApiKey(key);
            } else {
                // User cancelled, show message
                const infoMsg = this.createMessage(
                    'To use the AI Tutor, you need a Gemini API key. Get one free at https://makersuite.google.com/app/apikey, then click the "Set API Key" link below.',
                    'assistant'
                );
                this.chatMessages.appendChild(infoMsg);
                return;
            }
        }

        // Add user message
        const userMsg = this.createMessage(text, 'user');
        this.chatMessages.appendChild(userMsg);
        this.chatInput.value = '';

        // Scroll to bottom
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;

        // Show typing indicator
        const typingIndicator = this.createTypingIndicator();
        this.chatMessages.appendChild(typingIndicator);

        try {
            // Get AI response
            const response = await this.gemini.generateTutorResponse(text, this.currentContext);

            // Remove typing indicator
            typingIndicator.remove();

            // Add AI response
            const aiMsg = this.createMessage(response, 'assistant');
            this.chatMessages.appendChild(aiMsg);

            // Scroll to bottom
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;

        } catch (error) {
            typingIndicator.remove();
            const errorMsg = this.createMessage(`Error: ${error.message}`, 'error');
            this.chatMessages.appendChild(errorMsg);
        }
    }

    createMessage(text, role) {
        const msg = document.createElement('div');
        msg.className = `message message-${role}`;

        const isUser = role === 'user';
        const isError = role === 'error';

        msg.style.cssText = `
            padding: 12px 16px;
            border-radius: ${isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px'};
            max-width: 88%;
            align-self: ${isUser ? 'flex-end' : 'flex-start'};
            background: ${isUser ? 'linear-gradient(135deg, #f7931a 0%, #e88a17 100%)' : isError ? 'rgba(244, 67, 54, 0.15)' : 'rgba(255, 255, 255, 0.05)'};
            color: ${isUser ? 'white' : isError ? '#ff6b6b' : '#e0e0e0'};
            word-wrap: break-word;
            line-height: 1.6;
            font-size: 14px;
            border: ${isUser ? 'none' : isError ? '1px solid rgba(244, 67, 54, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)'};
        `;

        // Support basic markdown: **bold** and *italic*
        let formattedText = text
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\*([^*]+)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');

        msg.innerHTML = formattedText;
        return msg;
    }

    createTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.style.cssText = `
            padding: 12px 16px;
            border-radius: 12px;
            max-width: 85%;
            align-self: flex-start;
            background: #2d2d2d;
            color: #e0e0e0;
        `;
        indicator.innerHTML = `
            <div style="display: flex; gap: 5px;">
                <div class="dot" style="width: 8px; height: 8px; background: #f7931a; border-radius: 50%; animation: typing 1.4s infinite;"></div>
                <div class="dot" style="width: 8px; height: 8px; background: #f7931a; border-radius: 50%; animation: typing 1.4s infinite 0.2s;"></div>
                <div class="dot" style="width: 8px; height: 8px; background: #f7931a; border-radius: 50%; animation: typing 1.4s infinite 0.4s;"></div>
            </div>
        `;

        // Add keyframe animation
        if (!document.getElementById('typing-animation')) {
            const style = document.createElement('style');
            style.id = 'typing-animation';
            style.textContent = `
                @keyframes typing {
                    0%, 60%, 100% { transform: translateY(0); }
                    30% { transform: translateY(-10px); }
                }
            `;
            document.head.appendChild(style);
        }

        return indicator;
    }

    promptForApiKey() {
        const key = prompt('Enter your Gemini API key to enable AI responses.\n\nGet a free key at: https://aistudio.google.com/app/apikey\n\nYour key is stored locally and never sent to our servers.');
        if (key && key.trim()) {
            this.gemini.setApiKey(key.trim());
            this.checkApiKeyStatus();
            const successMsg = this.createMessage('✅ API key configured! I\'m ready to help you learn. What would you like to explore?', 'assistant');
            this.chatMessages.appendChild(successMsg);
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }
    }

    setContext(level, topic, persona) {
        this.currentContext = { level, topic, persona };
        if (this.gemini) {
            this.gemini.refreshContext();
        }
        this.updateContextDisplay();
        this.addQuickQuestions(); // Refresh suggestions
    }

    /**
     * Show the tutor panel (can be called externally)
     */
    show() {
        if (!this.isOpen) {
            this.toggleChat();
        }
    }

    /**
     * Hide the tutor panel
     */
    hide() {
        if (this.isOpen) {
            this.toggleChat();
        }
    }

    /**
     * Pre-fill a question and optionally send it
     */
    askQuestion(question, autoSend = false) {
        this.show();
        this.chatInput.value = question;
        if (autoSend) {
            this.sendMessage();
        } else {
            this.chatInput.focus();
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.geminiTutorUI = new GeminiTutorUI();
    });
} else {
    window.geminiTutorUI = new GeminiTutorUI();
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GeminiTutorUI;
}
