/**
 * Bitcoin Sovereign Academy - Interactive Quiz Widget
 *
 * Reusable quiz component for testing knowledge and reinforcing learning.
 *
 * Features:
 * - Multiple choice, true/false, and multi-select questions
 * - Immediate feedback with explanations
 * - Score tracking and progress persistence
 * - Beautiful animations and visual feedback
 * - Mobile-responsive design
 *
 * Usage:
 *
 * <div class="quiz-container" data-quiz-id="bitcoin-basics-1"></div>
 * <script src="/js/widgets/quiz.js"></script>
 * <script>
 *   new BitcoinQuiz('bitcoin-basics-1', {
 *     title: 'Bitcoin Basics Quiz',
 *     questions: [
 *       {
 *         type: 'multiple-choice',
 *         question: 'What is Bitcoin?',
 *         options: [
 *           'A company',
 *           'A digital currency',
 *           'A person',
 *           'A government program'
 *         ],
 *         correctAnswer: 1, // Index of correct option
 *         explanation: 'Bitcoin is a decentralized digital currency that operates without a central authority.'
 *       }
 *     ]
 *   });
 * </script>
 */

class BitcoinQuiz {
    constructor(quizId, config) {
        this.quizId = quizId;
        this.config = {
            title: config.title || 'Knowledge Check',
            description: config.description || '',
            questions: config.questions || [],
            passingScore: config.passingScore || 70, // Percentage
            showScoreOnCompletion: config.showScoreOnCompletion !== false,
            allowRetry: config.allowRetry !== false,
            shuffleQuestions: config.shuffleQuestions || false,
            shuffleOptions: config.shuffleOptions || false,
            onComplete: config.onComplete || null,
            path: config.path || 'general', // For progress tracking
            module: config.module || null
        };

        this.state = {
            currentQuestion: 0,
            answers: {},
            score: 0,
            completed: false,
            startTime: null,
            endTime: null
        };

        this.container = document.querySelector(`[data-quiz-id="${quizId}"]`);

        if (!this.container) {
            console.error(`Quiz container not found for ID: ${quizId}`);
            return;
        }

        this.init();
    }

    init() {
        // Load previous state if exists
        this.loadState();

        // Shuffle questions if configured
        if (this.config.shuffleQuestions) {
            this.shuffleArray(this.config.questions);
        }

        // Shuffle options if configured
        if (this.config.shuffleOptions) {
            this.config.questions.forEach(q => {
                if (q.options && q.type !== 'true-false') {
                    const correct = q.options[q.correctAnswer];
                    this.shuffleArray(q.options);
                    q.correctAnswer = q.options.indexOf(correct);
                }
            });
        }

        this.render();
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    render() {
        if (this.state.completed) {
            this.renderResults();
        } else {
            this.renderQuestion();
        }
    }

    renderQuestion() {
        const question = this.config.questions[this.state.currentQuestion];
        const progress = ((this.state.currentQuestion) / this.config.questions.length) * 100;
        const questionNumber = this.state.currentQuestion + 1;
        const totalQuestions = this.config.questions.length;

        this.container.innerHTML = `
            <div class="quiz-widget">
                <div class="quiz-header">
                    <h3 class="quiz-title">${this.config.title}</h3>
                    ${this.config.description ? `<p class="quiz-description">${this.config.description}</p>` : ''}
                    <div class="quiz-progress-bar">
                        <div class="quiz-progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <div class="quiz-progress-text">Question ${questionNumber} of ${totalQuestions}</div>
                </div>

                <div class="quiz-question-container">
                    <div class="quiz-question">
                        <span class="question-number">Q${questionNumber}:</span>
                        ${question.question}
                    </div>

                    ${this.renderQuestionType(question, questionNumber - 1)}

                    <div class="quiz-navigation">
                        ${this.state.currentQuestion > 0 ?
                            `<button class="quiz-btn quiz-btn-secondary" onclick="quizInstances['${this.quizId}'].previousQuestion()">← Previous</button>` :
                            '<div></div>'
                        }
                        <button class="quiz-btn quiz-btn-primary" id="quiz-submit-${this.quizId}" disabled>
                            ${this.state.currentQuestion === this.config.questions.length - 1 ? 'Submit Quiz' : 'Next Question →'}
                        </button>
                    </div>
                </div>

                <div class="quiz-feedback" id="quiz-feedback-${this.quizId}" style="display: none;"></div>
            </div>
        `;

        // Add event listeners
        this.attachEventListeners();
    }

    renderQuestionType(question, index) {
        switch (question.type) {
            case 'multiple-choice':
                return this.renderMultipleChoice(question, index);
            case 'true-false':
                return this.renderTrueFalse(question, index);
            case 'multi-select':
                return this.renderMultiSelect(question, index);
            default:
                return this.renderMultipleChoice(question, index);
        }
    }

    renderMultipleChoice(question, questionIndex) {
        return `
            <div class="quiz-options">
                ${question.options.map((option, i) => `
                    <label class="quiz-option">
                        <input
                            type="radio"
                            name="quiz-q-${questionIndex}"
                            value="${i}"
                            ${this.state.answers[questionIndex] === i ? 'checked' : ''}
                            onchange="quizInstances['${this.quizId}'].selectAnswer(${questionIndex}, ${i})"
                        >
                        <span class="option-text">${option}</span>
                        <span class="option-radio"></span>
                    </label>
                `).join('')}
            </div>
        `;
    }

    renderTrueFalse(question, questionIndex) {
        return `
            <div class="quiz-options quiz-options-tf">
                <label class="quiz-option quiz-option-tf">
                    <input
                        type="radio"
                        name="quiz-q-${questionIndex}"
                        value="true"
                        ${this.state.answers[questionIndex] === true ? 'checked' : ''}
                        onchange="quizInstances['${this.quizId}'].selectAnswer(${questionIndex}, true)"
                    >
                    <span class="option-text">✓ True</span>
                    <span class="option-radio"></span>
                </label>
                <label class="quiz-option quiz-option-tf">
                    <input
                        type="radio"
                        name="quiz-q-${questionIndex}"
                        value="false"
                        ${this.state.answers[questionIndex] === false ? 'checked' : ''}
                        onchange="quizInstances['${this.quizId}'].selectAnswer(${questionIndex}, false)"
                    >
                    <span class="option-text">✗ False</span>
                    <span class="option-radio"></span>
                </label>
            </div>
        `;
    }

    renderMultiSelect(question, questionIndex) {
        const currentAnswers = this.state.answers[questionIndex] || [];
        return `
            <div class="quiz-options">
                <p class="quiz-hint">Select all that apply:</p>
                ${question.options.map((option, i) => `
                    <label class="quiz-option">
                        <input
                            type="checkbox"
                            name="quiz-q-${questionIndex}"
                            value="${i}"
                            ${currentAnswers.includes(i) ? 'checked' : ''}
                            onchange="quizInstances['${this.quizId}'].selectMultiAnswer(${questionIndex}, ${i})"
                        >
                        <span class="option-text">${option}</span>
                        <span class="option-checkbox"></span>
                    </label>
                `).join('')}
            </div>
        `;
    }

    attachEventListeners() {
        const submitBtn = document.getElementById(`quiz-submit-${this.quizId}`);
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                this.submitAnswer();
            });
        }
    }

    selectAnswer(questionIndex, answerIndex) {
        this.state.answers[questionIndex] = answerIndex;
        this.saveState();

        // Enable submit button
        const submitBtn = document.getElementById(`quiz-submit-${this.quizId}`);
        if (submitBtn) {
            submitBtn.disabled = false;
        }
    }

    selectMultiAnswer(questionIndex, optionIndex) {
        if (!this.state.answers[questionIndex]) {
            this.state.answers[questionIndex] = [];
        }

        const answers = this.state.answers[questionIndex];
        const index = answers.indexOf(optionIndex);

        if (index > -1) {
            answers.splice(index, 1);
        } else {
            answers.push(optionIndex);
        }

        this.saveState();

        // Enable submit button if at least one option selected
        const submitBtn = document.getElementById(`quiz-submit-${this.quizId}`);
        if (submitBtn) {
            submitBtn.disabled = answers.length === 0;
        }
    }

    submitAnswer() {
        const question = this.config.questions[this.state.currentQuestion];
        const userAnswer = this.state.answers[this.state.currentQuestion];
        const isCorrect = this.checkAnswer(question, userAnswer);

        this.showFeedback(isCorrect, question);

        if (isCorrect) {
            this.state.score++;
        }

        // Move to next question after delay
        setTimeout(() => {
            if (this.state.currentQuestion < this.config.questions.length - 1) {
                this.state.currentQuestion++;
                this.render();
            } else {
                this.completeQuiz();
            }
        }, 2500);
    }

    checkAnswer(question, userAnswer) {
        if (question.type === 'multi-select') {
            const correct = question.correctAnswer.sort();
            const user = (userAnswer || []).sort();
            return JSON.stringify(correct) === JSON.stringify(user);
        } else if (question.type === 'true-false') {
            return userAnswer === question.correctAnswer;
        } else {
            return userAnswer === question.correctAnswer;
        }
    }

    showFeedback(isCorrect, question) {
        const feedbackEl = document.getElementById(`quiz-feedback-${this.quizId}`);

        feedbackEl.className = `quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
        feedbackEl.innerHTML = `
            <div class="feedback-icon">${isCorrect ? '✓' : '✗'}</div>
            <div class="feedback-content">
                <div class="feedback-title">${isCorrect ? 'Correct!' : 'Not quite right'}</div>
                <div class="feedback-explanation">${question.explanation || ''}</div>
            </div>
        `;
        feedbackEl.style.display = 'flex';

        // Disable all inputs
        const inputs = this.container.querySelectorAll('input');
        inputs.forEach(input => input.disabled = true);

        // Disable submit button
        const submitBtn = document.getElementById(`quiz-submit-${this.quizId}`);
        if (submitBtn) {
            submitBtn.disabled = true;
        }
    }

    previousQuestion() {
        if (this.state.currentQuestion > 0) {
            this.state.currentQuestion--;
            this.render();
        }
    }

    completeQuiz() {
        this.state.completed = true;
        this.state.endTime = Date.now();

        if (!this.state.startTime) {
            this.state.startTime = this.state.endTime - (this.config.questions.length * 30000); // Estimate
        }

        this.saveState();
        this.saveToProgress();
        this.render();

        if (this.config.onComplete) {
            this.config.onComplete(this.getResults());
        }
    }

    renderResults() {
        const percentage = Math.round((this.state.score / this.config.questions.length) * 100);
        const passed = percentage >= this.config.passingScore;
        const timeTaken = this.state.endTime && this.state.startTime ?
            Math.round((this.state.endTime - this.state.startTime) / 1000) : 0;

        this.container.innerHTML = `
            <div class="quiz-widget quiz-results">
                <div class="quiz-results-header ${passed ? 'passed' : 'failed'}">
                    <div class="results-icon">${passed ? '🎉' : '📚'}</div>
                    <h3 class="results-title">${passed ? 'Congratulations!' : 'Keep Learning!'}</h3>
                    <p class="results-subtitle">
                        ${passed ?
                            "You've demonstrated solid understanding of the material." :
                            "Review the material and try again to master the concepts."
                        }
                    </p>
                </div>

                <div class="quiz-results-stats">
                    <div class="result-stat">
                        <div class="stat-value">${percentage}%</div>
                        <div class="stat-label">Score</div>
                    </div>
                    <div class="result-stat">
                        <div class="stat-value">${this.state.score}/${this.config.questions.length}</div>
                        <div class="stat-label">Correct</div>
                    </div>
                    ${timeTaken > 0 ? `
                        <div class="result-stat">
                            <div class="stat-value">${Math.floor(timeTaken / 60)}:${(timeTaken % 60).toString().padStart(2, '0')}</div>
                            <div class="stat-label">Time</div>
                        </div>
                    ` : ''}
                </div>

                <div class="quiz-results-actions">
                    ${this.config.allowRetry ? `
                        <button class="quiz-btn quiz-btn-primary" onclick="quizInstances['${this.quizId}'].retryQuiz()">
                            Try Again
                        </button>
                    ` : ''}
                    ${this.config.module ? `
                        <a href="../" class="quiz-btn quiz-btn-secondary">
                            Back to Module
                        </a>
                    ` : ''}
                </div>

                ${passed ? `
                    <div class="quiz-achievement">
                        <span class="achievement-badge">✓</span>
                        <span class="achievement-text">Quiz Completed</span>
                    </div>
                ` : ''}
            </div>
        `;
    }

    retryQuiz() {
        this.state = {
            currentQuestion: 0,
            answers: {},
            score: 0,
            completed: false,
            startTime: Date.now(),
            endTime: null
        };
        this.saveState();
        this.render();
    }

    getResults() {
        return {
            quizId: this.quizId,
            score: this.state.score,
            totalQuestions: this.config.questions.length,
            percentage: Math.round((this.state.score / this.config.questions.length) * 100),
            passed: (this.state.score / this.config.questions.length) >= (this.config.passingScore / 100),
            timeTaken: this.state.endTime && this.state.startTime ?
                this.state.endTime - this.state.startTime : null
        };
    }

    saveState() {
        try {
            localStorage.setItem(`quiz_${this.quizId}`, JSON.stringify(this.state));
        } catch (e) {
            console.warn('Failed to save quiz state:', e);
        }
    }

    loadState() {
        try {
            const saved = localStorage.getItem(`quiz_${this.quizId}`);
            if (saved) {
                const savedState = JSON.parse(saved);
                // Only load if not completed or if retry is allowed
                if (!savedState.completed || this.config.allowRetry) {
                    this.state = savedState;
                }
            }
        } catch (e) {
            console.warn('Failed to load quiz state:', e);
        }

        if (!this.state.startTime && !this.state.completed) {
            this.state.startTime = Date.now();
        }
    }

    saveToProgress() {
        // Integrate with existing progress tracking systems
        try {
            // Check if PragmatistProgress exists
            if (window.pragmatistProgress && this.config.path === 'pragmatist') {
                window.pragmatistProgress.completeQuiz(this.quizId, this.getResults());
            }

            // Store in general progress tracker
            const allQuizzes = JSON.parse(localStorage.getItem('quiz_results') || '{}');
            allQuizzes[this.quizId] = {
                ...this.getResults(),
                path: this.config.path,
                module: this.config.module,
                completedAt: new Date().toISOString()
            };
            localStorage.setItem('quiz_results', JSON.stringify(allQuizzes));
        } catch (e) {
            console.warn('Failed to save to progress tracker:', e);
        }
    }
}

// Global registry for quiz instances
window.quizInstances = window.quizInstances || {};

// Auto-initialize quizzes from data attributes
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-quiz-config]').forEach(container => {
        try {
            const config = JSON.parse(container.getAttribute('data-quiz-config'));
            const quizId = container.getAttribute('data-quiz-id');

            if (quizId && config) {
                const quiz = new BitcoinQuiz(quizId, config);
                window.quizInstances[quizId] = quiz;
            }
        } catch (e) {
            console.error('Failed to initialize quiz:', e);
        }
    });
});

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BitcoinQuiz;
}
