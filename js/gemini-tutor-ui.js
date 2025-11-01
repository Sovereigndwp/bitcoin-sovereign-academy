/**
 * Gemini AI Tutor UI Component
 * Interactive chat interface for Bitcoin education
 */

class GeminiTutorUI {
    constructor() {
        this.gemini = window.geminiService;
        this.container = null;
        this.chatWindow = null;
        this.isOpen = false;
        this.currentContext = {
            level: 'beginner',
            topic: 'bitcoin-basics',
            persona: 'curious'
        };

        this.init();
    }

    init() {
        this.createTutorButton();
        this.createChatInterface();
        this.bindEvents();
        console.log('[GeminiTutor] UI initialized');
    }

    createTutorButton() {
        const button = document.createElement('button');
        button.id = 'gemini-tutor-btn';
        button.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>Ask AI Tutor</span>
        `;
        button.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 1000;
            padding: 15px 25px;
            background: linear-gradient(135deg, #f7931a 0%, #ffb347 100%);
            color: white;
            border: none;
            border-radius: 50px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(247, 147, 26, 0.4);
            display: flex;
            align-items: center;
            gap: 10px;
            transition: all 0.3s ease;
        `;

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 6px 25px rgba(247, 147, 26, 0.6)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 4px 20px rgba(247, 147, 26, 0.4)';
        });

        document.body.appendChild(button);
        this.tutorButton = button;
    }

    createChatInterface() {
        const container = document.createElement('div');
        container.id = 'gemini-tutor-chat';
        container.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 30px;
            width: 400px;
            max-width: calc(100vw - 60px);
            height: 600px;
            max-height: calc(100vh - 150px);
            background: #1a1a1a;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
            z-index: 999;
            display: none;
            flex-direction: column;
            overflow: hidden;
            border: 2px solid #f7931a;
        `;

        container.innerHTML = `
            <div class="chat-header" style="
                padding: 20px;
                background: linear-gradient(135deg, #f7931a 0%, #ffb347 100%);
                color: white;
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
                <div>
                    <h3 style="margin: 0; font-size: 18px;">AI Bitcoin Tutor</h3>
                    <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.9;">Powered by Gemini</p>
                </div>
                <button id="close-tutor" style="
                    background: none;
                    border: none;
                    color: white;
                    font-size: 24px;
                    cursor: pointer;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">&times;</button>
            </div>

            <div class="chat-messages" id="chat-messages" style="
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                display: flex;
                flex-direction: column;
                gap: 15px;
            "></div>

            <div class="chat-quick-questions" id="quick-questions" style="
                padding: 10px 20px;
                border-top: 1px solid #333;
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            "></div>

            <div class="chat-input-area" style="
                padding: 20px;
                border-top: 2px solid #333;
                background: #2d2d2d;
            ">
                <div style="display: flex; gap: 10px;">
                    <input
                        type="text"
                        id="chat-input"
                        placeholder="Ask me anything about Bitcoin..."
                        style="
                            flex: 1;
                            padding: 12px 15px;
                            border: 2px solid #444;
                            border-radius: 10px;
                            background: #1a1a1a;
                            color: #e0e0e0;
                            font-size: 14px;
                        "
                    />
                    <button id="send-btn" style="
                        padding: 12px 20px;
                        background: #f7931a;
                        border: none;
                        border-radius: 10px;
                        color: white;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">Send</button>
                </div>
                <div style="margin-top: 10px; font-size: 11px; color: #999;">
                    Press Enter to send • <a href="#" id="api-key-link" style="color: #f7931a;">Set API Key</a>
                </div>
            </div>
        `;

        document.body.appendChild(container);
        this.container = container;
        this.chatMessages = container.querySelector('#chat-messages');
        this.chatInput = container.querySelector('#chat-input');
        this.sendBtn = container.querySelector('#send-btn');

        // Add welcome message
        this.addWelcomeMessage();
        this.addQuickQuestions();
    }

    bindEvents() {
        // Toggle chat
        this.tutorButton.addEventListener('click', () => this.toggleChat());
        this.container.querySelector('#close-tutor').addEventListener('click', () => this.toggleChat());

        // Send message
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // API key link
        this.container.querySelector('#api-key-link').addEventListener('click', (e) => {
            e.preventDefault();
            this.promptForApiKey();
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        this.container.style.display = this.isOpen ? 'flex' : 'none';

        if (this.isOpen) {
            this.chatInput.focus();
        }
    }

    addWelcomeMessage() {
        const message = this.createMessage(
            `Welcome to your AI Bitcoin Tutor! 👋

I'm here to help you understand Bitcoin through personalized conversations. Ask me anything - from basics like "What is Bitcoin?" to advanced topics like "How does the Lightning Network work?"

I use the Socratic method, so I'll often answer your questions with questions to help you discover insights yourself.

What would you like to learn today?`,
            'assistant'
        );
        this.chatMessages.appendChild(message);
    }

    addQuickQuestions() {
        const questions = [
            "What is Bitcoin?",
            "How does mining work?",
            "Why use Bitcoin?",
            "What are UTXOs?"
        ];

        const container = this.container.querySelector('#quick-questions');
        container.innerHTML = '<div style="width: 100%; font-size: 12px; color: #999; margin-bottom: 5px;">Quick questions:</div>';

        questions.forEach(q => {
            const btn = document.createElement('button');
            btn.textContent = q;
            btn.style.cssText = `
                padding: 8px 12px;
                background: #2d2d2d;
                border: 1px solid #444;
                border-radius: 8px;
                color: #e0e0e0;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
            `;
            btn.addEventListener('click', () => {
                this.chatInput.value = q;
                this.sendMessage();
            });
            btn.addEventListener('mouseenter', () => {
                btn.style.background = '#3d3d3d';
                btn.style.borderColor = '#f7931a';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.background = '#2d2d2d';
                btn.style.borderColor = '#444';
            });
            container.appendChild(btn);
        });
    }

    async sendMessage() {
        const text = this.chatInput.value.trim();
        if (!text) return;

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
            border-radius: 12px;
            max-width: 85%;
            align-self: ${isUser ? 'flex-end' : 'flex-start'};
            background: ${isUser ? '#f7931a' : isError ? '#f44336' : '#2d2d2d'};
            color: ${isUser || isError ? 'white' : '#e0e0e0'};
            word-wrap: break-word;
            line-height: 1.5;
        `;

        msg.textContent = text;
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
        const key = prompt('Enter your Gemini API key (get one at https://makersuite.google.com/app/apikey):');
        if (key) {
            this.gemini.setApiKey(key);
            alert('API key saved! You can now chat with the AI tutor.');
        }
    }

    setContext(level, topic, persona) {
        this.currentContext = { level, topic, persona };
        console.log('[GeminiTutor] Context updated:', this.currentContext);
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
