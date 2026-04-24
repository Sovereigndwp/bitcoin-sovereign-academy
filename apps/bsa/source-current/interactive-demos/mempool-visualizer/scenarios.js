/**
 * PRACTICE SCENARIOS
 * Quiz scenarios for fee estimation practice
 */

const SCENARIOS = {
    1: {
        correctAnswer: 'c',
        explanation: {
            correct: "✅ Excellent choice! For non-urgent transactions like opening a Lightning channel for coffee, choosing the lowest fee (2 sat/vB) saves you money while still getting confirmation within 24 hours. The $12 difference between highest and lowest fee is significant for a coffee purchase!",
            incorrect: {
                a: "❌ 50 sat/vB is way too high for a non-urgent transaction. You'd pay $12.50 in fees when you could pay just $0.50 and still get confirmed within 24 hours. Save your money for more coffee!",
                b: "⚠️ 8 sat/vB would work, but you're still overpaying. Since you're not in a rush, the 2 sat/vB option saves you $1.50 with only a slightly longer wait."
            }
        }
    },
    2: {
        correctAnswer: 'a',
        explanation: {
            correct: "✅ Perfect! When time is critical and you're in a congested mempool, paying a premium fee (100 sat/vB) guarantees next-block confirmation. The $25 fee is justified when you need speed for a time-sensitive trading opportunity.",
            incorrect: {
                a: "This is actually the correct answer!",
                b: "❌ During high congestion, 40 sat/vB might not get you in the next block. With time-sensitive trading, waiting an hour could cost you more than the $15 fee difference. When urgency is critical, pay for priority!",
                c: "❌ 20 sat/vB during high demand means you could wait 24+ hours. For an emergency withdrawal to catch a trading opportunity, this completely defeats the purpose. The $20 you save in fees could cost you much more in missed gains."
            }
        }
    },
    3: {
        correctAnswer: 'c',
        explanation: {
            correct: "✅ Smart! When consolidating UTXOs to cold storage with no time pressure and a clear mempool, 1 sat/vB is perfect. You save maximum fees ($2.50 vs. $0.50) and you're not in a rush. This is exactly when to use the minimum fee!",
            incorrect: {
                a: "⚠️ 5 sat/vB works, but you're overpaying 5x! Since you have no urgency and the mempool is clearing, you could use 1 sat/vB and save $2. Over time, these savings add up, especially for large consolidations.",
                b: "⚠️ 2 sat/vB is better, but still 2x higher than needed. In low-demand periods, 1 sat/vB transactions usually confirm within hours. Save that extra $0.50!"
            }
        }
    }
};

class ScenarioQuiz {
    constructor() {
        this.answers = {};
        this.setupListeners();
    }

    setupListeners() {
        // Check answer buttons
        document.querySelectorAll('.btn-check').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const scenario = e.target.dataset.scenario;
                this.checkAnswer(scenario);
            });
        });
    }

    checkAnswer(scenarioNum) {
        const selectedInput = document.querySelector(`input[name="scenario${scenarioNum}"]:checked`);

        if (!selectedInput) {
            alert('Please select an answer first!');
            return;
        }

        const selectedAnswer = selectedInput.value;
        const scenario = SCENARIOS[scenarioNum];
        const feedbackEl = document.getElementById(`feedback-${scenarioNum}`);

        if (!feedbackEl) return;

        const isCorrect = selectedAnswer === scenario.correctAnswer;

        feedbackEl.style.display = 'block';
        feedbackEl.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;

        if (isCorrect) {
            feedbackEl.textContent = scenario.explanation.correct;
            this.answers[scenarioNum] = true;
        } else {
            feedbackEl.textContent = scenario.explanation.incorrect[selectedAnswer];
            this.answers[scenarioNum] = false;
        }

        // Disable further changes
        document.querySelectorAll(`input[name="scenario${scenarioNum}"]`).forEach(input => {
            input.disabled = true;
        });

        // Check if all scenarios completed
        this.checkCompletion();
    }

    checkCompletion() {
        const totalScenarios = Object.keys(SCENARIOS).length;
        const completedScenarios = Object.keys(this.answers).length;

        if (completedScenarios === totalScenarios) {
            const correctCount = Object.values(this.answers).filter(a => a).length;
            const score = ((correctCount / totalScenarios) * 100).toFixed(0);

            let message = '';

            if (score === 100) {
                message = `🎉 Perfect score! You've mastered fee estimation. You understand when to prioritize speed vs. cost.`;
            } else if (score >= 66) {
                message = `👍 Good job! You got ${correctCount}/${totalScenarios} correct. Review the feedback to improve your understanding.`;
            } else {
                message = `📚 Keep learning! You got ${correctCount}/${totalScenarios} correct. The key is matching fee urgency to your actual needs.`;
            }

            setTimeout(() => {
                if (confirm(message + '\n\nWould you like to continue to the summary?')) {
                    document.querySelector('[data-next="5"]').click();
                }
            }, 1000);
        }
    }

    reset() {
        this.answers = {};

        // Reset all radio buttons and feedback
        for (let i = 1; i <= Object.keys(SCENARIOS).length; i++) {
            document.querySelectorAll(`input[name="scenario${i}"]`).forEach(input => {
                input.disabled = false;
                input.checked = false;
            });

            const feedbackEl = document.getElementById(`feedback-${i}`);
            if (feedbackEl) {
                feedbackEl.style.display = 'none';
            }
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScenarioQuiz;
}
