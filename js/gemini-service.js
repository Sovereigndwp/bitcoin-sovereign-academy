/**
 * Gemini AI Service for Bitcoin Sovereign Academy
 * Provides AI-powered tutoring and content generation
 * Enhanced with context awareness, learning progress integration, and Socratic methodology
 */

class GeminiService {
    constructor(apiKey = null) {
        this.apiKey = apiKey || this.getStoredApiKey();
        this.endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
        this.conversationHistory = this.loadConversationHistory();
        this.initialized = false;
        
        // Learning context detection
        this.pageContext = this.detectPageContext();
        this.userProgress = this.loadUserProgress();
        this.userProfile = this.loadUserProfile();

        // Enhanced Bitcoin education context with strong Socratic emphasis
        this.systemContext = {
            role: 'Bitcoin education expert and Socratic tutor at Bitcoin Sovereign Academy',
            principles: [
                'Truth over trust - verify, don\'t believe',
                'Financial sovereignty - your keys, your Bitcoin',
                'Education through experience - learn by doing',
                'Privacy as a right - protect personal information',
                'Open access - education should be free and accessible'
            ],
            socraticMethod: [
                'NEVER just give answers - guide discovery through questions',
                'When asked "what is X?" respond with "What do you think X might be, based on...?"',
                'After explaining, always end with a thought-provoking question',
                'Celebrate "aha moments" and build on them',
                'Connect new concepts to what the learner already knows',
                'Use real-world analogies from everyday life'
            ],
            style: 'Warm but challenging. Ask questions that make learners think. Never lecture.',
            focus: 'Empower learners to discover Bitcoin\'s value through guided inquiry'
        };
    }

    /**
     * Detect context from current page URL
     */
    detectPageContext() {
        if (typeof window === 'undefined') return { type: 'unknown' };
        
        const path = window.location.pathname;
        const context = {
            type: 'general',
            path: path,
            module: null,
            stage: null,
            demo: null,
            topic: null
        };

        // Detect learning path context
        const pathMatch = path.match(/\/paths\/([^\/]+)(?:\/stage-(\d+))?(?:\/module-(\d+))?/);
        if (pathMatch) {
            context.type = 'learning-path';
            context.learningPath = pathMatch[1];
            context.stage = pathMatch[2] ? parseInt(pathMatch[2]) : null;
            context.module = pathMatch[3] ? parseInt(pathMatch[3]) : null;
        }

        // Detect interactive demo context
        const demoMatch = path.match(/\/interactive-demos\/([^\/]+)/);
        if (demoMatch) {
            context.type = 'demo';
            context.demo = demoMatch[1];
            context.topic = this.demoToTopic(demoMatch[1]);
        }

        // Detect deep dive context
        const deepDiveMatch = path.match(/\/deep-dives\/([^\/]+)/);
        if (deepDiveMatch) {
            context.type = 'deep-dive';
            context.topic = deepDiveMatch[1];
        }

        return context;
    }

    /**
     * Map demo names to educational topics
     */
    demoToTopic(demoName) {
        const topicMap = {
            'wallet-security-workshop': 'wallet security and seed phrase management',
            'bitcoin-key-generator-visual': 'cryptographic keys and address generation',
            'mining-simulator': 'proof of work and mining',
            'mempool-visualizer': 'transaction fees and mempool dynamics',
            'utxo-visualizer': 'UTXO model and transaction structure',
            'lightning-network-demo': 'Lightning Network and payment channels',
            'address-format-explorer': 'Bitcoin address formats and encoding',
            'coinjoin-simulator': 'privacy and CoinJoin transactions',
            'multisig-setup-wizard': 'multisignature security',
            'inflation-lab': 'monetary inflation and purchasing power',
            'bitcoin-supply-schedule': 'Bitcoin\'s fixed supply and halving'
        };
        return topicMap[demoName] || demoName.replace(/-/g, ' ');
    }

    /**
     * Load user progress from localStorage
     */
    loadUserProgress() {
        try {
            const progress = localStorage.getItem('bsa-progress');
            return progress ? JSON.parse(progress) : { completed: {}, current: null };
        } catch {
            return { completed: {}, current: null };
        }
    }

    /**
     * Load user profile from localStorage
     */
    loadUserProfile() {
        try {
            const profile = localStorage.getItem('bsa-assessment');
            const learningProgress = localStorage.getItem('learningProgress');
            return {
                assessment: profile ? JSON.parse(profile) : null,
                progress: learningProgress ? JSON.parse(learningProgress) : null
            };
        } catch {
            return { assessment: null, progress: null };
        }
    }

    /**
     * Load conversation history from localStorage
     */
    loadConversationHistory() {
        try {
            const history = localStorage.getItem('bsa-tutor-history');
            return history ? JSON.parse(history) : [];
        } catch {
            return [];
        }
    }

    /**
     * Save conversation history to localStorage
     */
    saveConversationHistory() {
        try {
            // Keep last 20 messages to avoid storage bloat
            const recentHistory = this.conversationHistory.slice(-20);
            localStorage.setItem('bsa-tutor-history', JSON.stringify(recentHistory));
        } catch (e) {
            console.warn('[Gemini] Could not save conversation history:', e);
        }
    }

    /**
     * Clear conversation history from memory and localStorage
     */
    clearHistory() {
        this.conversationHistory = [];
        try {
            localStorage.removeItem('bsa-tutor-history');
        } catch (e) {
            console.warn('[Gemini] Could not clear conversation history:', e);
        }
    }

    /**
     * Get suggested questions based on current context
     */
    getSuggestedQuestions() {
        const context = this.pageContext;
        const questions = [];

        if (context.type === 'demo' && context.topic) {
            questions.push(
                `Why does ${context.topic} matter for Bitcoin?`,
                `How does this relate to financial sovereignty?`,
                `What could go wrong if I don't understand this?`
            );
        } else if (context.type === 'learning-path') {
            questions.push(
                `What should I focus on in this module?`,
                `How does this connect to what I learned before?`,
                `What's the most important takeaway here?`
            );
        } else {
            questions.push(
                `What is Bitcoin, really?`,
                `Why should I learn about Bitcoin?`,
                `Where should I start my learning journey?`
            );
        }

        return questions;
    }

    getStoredApiKey() {
        // Only get from localStorage, don't prompt
        return localStorage.getItem('gemini-api-key');
    }

    getApiKey() {
        // Try to get from localStorage first
        const storedKey = localStorage.getItem('gemini-api-key');
        if (storedKey) return storedKey;

        // Prompt user if not found (only when explicitly called)
        const key = prompt('Please enter your Gemini API key (get one at https://makersuite.google.com/app/apikey):');
        if (key) {
            localStorage.setItem('gemini-api-key', key);
            return key;
        }

        return null;
    }

    setApiKey(key) {
        this.apiKey = key;
        localStorage.setItem('gemini-api-key', key);
        this.initialized = true;
        console.log('[Gemini] API key updated');
    }

    /**
     * Generate AI tutor response
     * @param {string} userMessage - User's question or input
     * @param {object} context - Additional context (level, topic, persona)
     * @returns {Promise<string>} - AI response
     */
    async generateTutorResponse(userMessage, context = {}) {
        if (!this.apiKey) {
            return "Please set your Gemini API key first. You can get one at https://makersuite.google.com/app/apikey";
        }

        try {
            // Build the prompt with context
            const systemPrompt = this.buildSystemPrompt(context);
            const fullPrompt = `${systemPrompt}\n\nUser: ${userMessage}\n\nAI Tutor:`;

            const response = await this.callGeminiAPI(fullPrompt);

            // Store in conversation history
            this.conversationHistory.push({
                role: 'user',
                content: userMessage,
                timestamp: Date.now(),
                context: this.pageContext
            });
            this.conversationHistory.push({
                role: 'assistant',
                content: response,
                timestamp: Date.now()
            });

            // Persist to localStorage
            this.saveConversationHistory();

            return response;

        } catch (error) {
            console.error('[Gemini] Error generating response:', error);
            return `Sorry, I encountered an error: ${error.message}`;
        }
    }

    /**
     * Generate educational content
     * @param {string} topic - Bitcoin topic to explain
     * @param {object} options - Generation options (length, style, level)
     * @returns {Promise<object>} - Generated content with multiple sections
     */
    async generateContent(topic, options = {}) {
        const {
            length = 'medium',
            style = 'conversational',
            level = 'beginner',
            includeAnalogy = true,
            includeExercise = true
        } = options;

        try {
            const prompt = `
You are creating educational content about "${topic}" for Bitcoin Sovereign Academy.

Audience level: ${level}
Style: ${style}
Length: ${length}

Please generate:
1. A clear, engaging explanation (2-3 paragraphs)
2. ${includeAnalogy ? 'An everyday analogy to help understand the concept' : ''}
3. Key takeaways (3-5 bullet points)
4. ${includeExercise ? 'A thought-provoking reflection question' : ''}

Remember:
- Use the Socratic method - ask questions, don't just tell
- Avoid jargon or explain it clearly
- Connect to real-world examples
- Emphasize "why" over "what"

Format as JSON with keys: explanation, analogy, keyTakeaways, reflectionQuestion
`;

            const response = await this.callGeminiAPI(prompt);

            // Try to parse as JSON, fallback to structured text
            try {
                return JSON.parse(response);
            } catch {
                return this.parseStructuredResponse(response);
            }

        } catch (error) {
            console.error('[Gemini] Error generating content:', error);
            throw error;
        }
    }

    /**
     * Generate quiz questions
     * @param {string} topic - Topic for quiz
     * @param {number} count - Number of questions
     * @param {string} difficulty - easy, medium, hard
     * @returns {Promise<Array>} - Array of quiz questions
     */
    async generateQuiz(topic, count = 5, difficulty = 'medium') {
        try {
            const prompt = `
Generate ${count} ${difficulty} quiz questions about "${topic}" for Bitcoin education.

Each question should:
- Test understanding, not just memorization
- Have 4 answer choices (A, B, C, D)
- Include one correct answer
- Include a brief explanation of why the answer is correct

Format as JSON array with objects containing: question, choices, correctAnswer, explanation
`;

            const response = await this.callGeminiAPI(prompt);

            try {
                return JSON.parse(response);
            } catch {
                // Fallback parsing if JSON fails
                return this.parseQuizResponse(response, count);
            }

        } catch (error) {
            console.error('[Gemini] Error generating quiz:', error);
            throw error;
        }
    }

    /**
     * Generate personalized learning path
     * @param {object} userProfile - User's level, interests, goals
     * @returns {Promise<object>} - Personalized learning recommendations
     */
    async generateLearningPath(userProfile) {
        try {
            const prompt = `
Based on this learner profile:
- Level: ${userProfile.level}
- Interests: ${userProfile.interests.join(', ')}
- Learning style: ${userProfile.learningStyle}
- Goals: ${userProfile.goals || 'understand Bitcoin fundamentals'}

Create a personalized 4-week learning path for Bitcoin Sovereign Academy.

For each week, provide:
1. Main theme/goal
2. 3-4 specific topics to cover
3. Recommended interactive demos
4. Reflection questions
5. Milestone achievement

Format as JSON with weeks array.
`;

            const response = await this.callGeminiAPI(prompt);

            try {
                return JSON.parse(response);
            } catch {
                return this.parseLearningPathResponse(response);
            }

        } catch (error) {
            console.error('[Gemini] Error generating learning path:', error);
            throw error;
        }
    }

    // ===== PRIVATE HELPER METHODS =====

    buildSystemPrompt(context) {
        const { level = 'beginner', topic = '', persona = 'curious' } = context;
        const pageContext = this.pageContext;
        const progress = this.userProgress;

        // Determine effective topic from context or page
        const effectiveTopic = topic || pageContext.topic || 'Bitcoin fundamentals';
        
        // Build progress context
        let progressContext = '';
        if (progress.completed && Object.keys(progress.completed).length > 0) {
            const completedCount = Object.keys(progress.completed).length;
            progressContext = `\nLearner has completed ${completedCount} modules.`;
        }

        // Build page-specific context
        let pageSpecificContext = '';
        if (pageContext.type === 'demo') {
            pageSpecificContext = `\nThe learner is currently using the "${pageContext.demo}" interactive demo about ${pageContext.topic}.`;
        } else if (pageContext.type === 'learning-path') {
            pageSpecificContext = `\nThe learner is on the "${pageContext.learningPath}" learning path${pageContext.stage ? `, Stage ${pageContext.stage}` : ''}${pageContext.module ? `, Module ${pageContext.module}` : ''}.`;
        }

        return `You are an expert Bitcoin educator and STRICT Socratic tutor at Bitcoin Sovereign Academy.

## YOUR ROLE
${this.systemContext.role}

## CORE PRINCIPLES
${this.systemContext.principles.map(p => `• ${p}`).join('\n')}

## SOCRATIC METHOD (CRITICAL - FOLLOW STRICTLY)
${this.systemContext.socraticMethod.map(s => `• ${s}`).join('\n')}

## TEACHING STYLE
${this.systemContext.style}

## CURRENT CONTEXT
• Student level: ${level}
• Current topic: ${effectiveTopic}
• Learning persona: ${persona}${progressContext}${pageSpecificContext}

## RESPONSE FORMAT
1. Acknowledge their question warmly (1 sentence)
2. Provide insight through a question or analogy (not a lecture)
3. Share key understanding if appropriate (2-3 sentences max)
4. ALWAYS end with a thought-provoking question to deepen understanding

## IMPORTANT RULES
• Keep responses concise (under 150 words unless explaining something complex)
• Use everyday analogies (kitchens, mailboxes, diaries - not technical jargon)
• If they ask "what is X?" - first ask what THEY think, then build on it
• Celebrate when they make connections or have insights
• Never be condescending - assume intelligence, not knowledge`;
    }

    async callGeminiAPI(prompt) {
        const url = `${this.endpoint}?key=${this.apiKey}`;

        const requestBody = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 2048,
            }
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Gemini API request failed');
        }

        const data = await response.json();

        if (!data.candidates || data.candidates.length === 0) {
            throw new Error('No response generated');
        }

        return data.candidates[0].content.parts[0].text;
    }

    parseStructuredResponse(text) {
        // Simple parser for non-JSON responses
        const sections = {
            explanation: '',
            analogy: '',
            keyTakeaways: [],
            reflectionQuestion: ''
        };

        const lines = text.split('\n');
        let currentSection = 'explanation';

        for (const line of lines) {
            if (line.toLowerCase().includes('analogy')) {
                currentSection = 'analogy';
            } else if (line.toLowerCase().includes('key takeaway') || line.toLowerCase().includes('takeaways')) {
                currentSection = 'keyTakeaways';
            } else if (line.toLowerCase().includes('reflection') || line.toLowerCase().includes('question')) {
                currentSection = 'reflectionQuestion';
            } else if (line.trim()) {
                if (currentSection === 'keyTakeaways') {
                    if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
                        sections.keyTakeaways.push(line.trim().substring(1).trim());
                    }
                } else {
                    sections[currentSection] += line + '\n';
                }
            }
        }

        return sections;
    }

    parseQuizResponse(text, count) {
        // Simple parser for quiz questions
        const questions = [];
        const questionBlocks = text.split(/\d+\./g).filter(b => b.trim());

        for (let i = 0; i < Math.min(questionBlocks.length, count); i++) {
            questions.push({
                question: questionBlocks[i].split('\n')[0].trim(),
                choices: ['A', 'B', 'C', 'D'],
                correctAnswer: 'A',
                explanation: 'Generated explanation'
            });
        }

        return questions;
    }

    parseLearningPathResponse(text) {
        // Simple parser for learning path
        return {
            weeks: [
                {
                    theme: 'Extracted from response',
                    topics: [],
                    demos: [],
                    reflections: [],
                    milestone: ''
                }
            ]
        };
    }

    clearHistory() {
        this.conversationHistory = [];
        localStorage.removeItem('bsa-tutor-history');
    }

    getHistory() {
        return this.conversationHistory;
    }

    /**
     * Refresh context (call when page changes or after navigation)
     */
    refreshContext() {
        this.pageContext = this.detectPageContext();
        this.userProgress = this.loadUserProgress();
        this.userProfile = this.loadUserProfile();
    }

    /**
     * Get a brief context summary for UI display
     */
    getContextSummary() {
        const ctx = this.pageContext;
        if (ctx.type === 'demo') {
            return `Learning: ${ctx.topic}`;
        } else if (ctx.type === 'learning-path') {
            const pathNames = {
                curious: 'The Curious',
                pragmatist: 'The Pragmatist',
                principled: 'The Principled',
                sovereign: 'The Sovereign',
                hurried: 'The Hurried'
            };
            const name = pathNames[ctx.learningPath] || ctx.learningPath;
            return `${name} Path${ctx.stage ? ` • Stage ${ctx.stage}` : ''}`;
        }
        return 'Bitcoin Learning';
    }

    /**
     * Check if API key is configured
     */
    hasApiKey() {
        return !!this.apiKey;
    }
}

// Initialize global service
if (typeof window !== 'undefined') {
    window.geminiService = new GeminiService();
    
    // Refresh context on navigation
    window.addEventListener('popstate', () => {
        window.geminiService.refreshContext();
    });
}
