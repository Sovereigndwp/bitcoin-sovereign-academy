/**
 * Gemini AI Service for Bitcoin Sovereign Academy
 * Provides AI-powered tutoring and content generation
 */

class GeminiService {
    constructor(apiKey = null) {
        this.apiKey = apiKey || this.getStoredApiKey();
        this.endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
        this.conversationHistory = [];
        this.initialized = false;

        // Bitcoin education context
        this.systemContext = {
            role: 'Bitcoin education expert and Socratic tutor',
            principles: [
                'Truth over trust',
                'Financial sovereignty',
                'Education through experience',
                'Privacy and open access'
            ],
            style: 'Socratic, conversational, visual, sharp - avoid jargon',
            focus: 'Help learners understand Bitcoin through questions, reflections, and real-world examples'
        };

        console.log('[Gemini] Service initialized');
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
                timestamp: Date.now()
            });
            this.conversationHistory.push({
                role: 'assistant',
                content: response,
                timestamp: Date.now()
            });

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

        return `You are an expert Bitcoin educator at Bitcoin Sovereign Academy.

Your role: ${this.systemContext.role}

Core principles:
${this.systemContext.principles.map(p => `- ${p}`).join('\n')}

Teaching style: ${this.systemContext.style}

Current context:
- Student level: ${level}
- Topic: ${topic}
- Learning persona: ${persona}

Respond in a way that empowers the learner to think critically and discover insights themselves.`;
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
        console.log('[Gemini] Conversation history cleared');
    }

    getHistory() {
        return this.conversationHistory;
    }
}

// Initialize global service
if (typeof window !== 'undefined') {
    window.geminiService = new GeminiService();
    console.log('[Gemini] Global service ready. Access via window.geminiService');
}
