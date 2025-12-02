// Bitcoin On-Ramp Chooser Logic

let currentQuestion = 0;
let userAnswers = {};

function startQuiz() {
    document.getElementById('screen-start').classList.remove('active');
    document.getElementById('progress-container').style.display = 'block';
    showQuestion(0);
}

function showQuestion(index) {
    currentQuestion = index;
    updateProgress();

    const question = QUESTIONS[index];
    const container = document.getElementById('screen-questions');

    const optionsHTML = question.options.map(option => `
        <button class="option-btn"
                data-value="${option.value}"
                onclick="selectOption('${question.id}', '${option.value}', ${question.type === 'multiple'})">
            <span class="option-icon">${option.icon}</span>
            <div class="option-content">
                <span class="option-label">${option.label}</span>
                ${option.detail ? `<span class="option-detail">${option.detail}</span>` : ''}
            </div>
            ${question.type === 'multiple' ? '<span class="option-checkbox"></span>' : ''}
        </button>
    `).join('');

    container.innerHTML = `
        <div class="question-screen">
            <div class="question-number">Question ${question.number} of ${QUESTIONS.length}</div>
            <h2 class="question-title">${question.title}</h2>
            <p class="question-subtitle">${question.subtitle}</p>

            <div class="options" id="options-${question.id}">
                ${optionsHTML}
            </div>

            <div class="navigation">
                ${index > 0 ? '<button class="btn-nav" onclick="prevQuestion()">← Back</button>' : '<div></div>'}
                <button class="btn-nav btn-next" id="btn-next" onclick="nextQuestion()" disabled>
                    ${index === QUESTIONS.length - 1 ? 'See Results →' : 'Next →'}
                </button>
            </div>
        </div>
    `;

    container.classList.add('active');

    // Restore previous answers if going back
    if (userAnswers[question.id]) {
        const answers = Array.isArray(userAnswers[question.id])
            ? userAnswers[question.id]
            : [userAnswers[question.id]];

        answers.forEach(value => {
            const btn = container.querySelector(`[data-value="${value}"]`);
            if (btn) btn.classList.add('selected');
        });

        document.getElementById('btn-next').disabled = false;
    }
}

function selectOption(questionId, value, isMultiple) {
    const question = QUESTIONS.find(q => q.id === questionId);
    const optionsContainer = document.getElementById(`options-${questionId}`);
    const clickedBtn = optionsContainer.querySelector(`[data-value="${value}"]`);

    if (isMultiple) {
        // Multiple selection (toggle)
        clickedBtn.classList.toggle('selected');

        // Get all selected values
        const selectedBtns = optionsContainer.querySelectorAll('.option-btn.selected');
        if (selectedBtns.length > 0) {
            userAnswers[questionId] = Array.from(selectedBtns).map(btn => btn.dataset.value);
            document.getElementById('btn-next').disabled = false;
        } else {
            delete userAnswers[questionId];
            document.getElementById('btn-next').disabled = true;
        }
    } else {
        // Single selection (replace)
        optionsContainer.querySelectorAll('.option-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        clickedBtn.classList.add('selected');
        userAnswers[questionId] = value;
        document.getElementById('btn-next').disabled = false;
    }
}

function nextQuestion() {
    if (currentQuestion < QUESTIONS.length - 1) {
        document.getElementById('screen-questions').classList.remove('active');
        setTimeout(() => showQuestion(currentQuestion + 1), 100);
    } else {
        showResults();
    }
}

function prevQuestion() {
    if (currentQuestion > 0) {
        document.getElementById('screen-questions').classList.remove('active');
        setTimeout(() => showQuestion(currentQuestion - 1), 100);
    }
}

function updateProgress() {
    const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;
    document.getElementById('progress-text').textContent = `Question ${currentQuestion + 1} of ${QUESTIONS.length}`;
}

function showResults() {
    document.getElementById('screen-questions').classList.remove('active');
    document.getElementById('progress-container').style.display = 'none';

    const results = findMatchingOnramps();
    const resultsContainer = document.getElementById('screen-results');

    // Build summary tags
    const summaryTags = [
        { key: 'country', label: getCountryLabel(userAnswers.country) },
        { key: 'amount', label: userAnswers.amount },
        { key: 'kyc', label: userAnswers.kyc === 'yes' ? 'KYC OK' : 'Prefers no-KYC' },
        { key: 'speed', label: getSpeedLabel(userAnswers.speed) },
        { key: 'payment', label: userAnswers.payment.length + ' payment methods' }
    ];

    const summaryHTML = summaryTags.map(tag =>
        `<span class="summary-tag">${tag.label}</span>`
    ).join('');

    // Build result cards
    const cardsHTML = results.map((result, index) => `
        <div class="result-card ${index === 0 ? 'recommended' : ''}">
            <div class="result-header">
                <h3 class="result-name">${result.name}</h3>
                ${index === 0 ? '<span class="result-badge">✨ Recommended</span>' : ''}
            </div>

            <p class="result-best-for">${result.bestFor}</p>

            <div class="result-details">
                <div class="result-detail">
                    <span class="result-detail-label">Fee</span>
                    <span class="result-detail-value">${result.fee}</span>
                </div>
                <div class="result-detail">
                    <span class="result-detail-label">Time</span>
                    <span class="result-detail-value">${result.time}</span>
                </div>
                <div class="result-detail">
                    <span class="result-detail-label">KYC</span>
                    <span class="result-detail-value">${result.kyc}</span>
                </div>
            </div>

            ${result.notes ? `<p style="font-size: 0.9rem; color: var(--text-dim); margin-bottom: 1rem;">💡 ${result.notes}</p>` : ''}

            <div class="result-actions">
                ${result.link !== '#'
                    ? `<a href="${result.link}" target="_blank" rel="noopener noreferrer" class="btn-result primary">Visit ${result.name} →</a>`
                    : `<button class="btn-result primary" disabled>Contact local broker</button>`
                }
                <button class="btn-result secondary" onclick="copyToClipboard('${result.name}')">📋 Copy Info</button>
            </div>
        </div>
    `).join('');

    resultsContainer.innerHTML = `
        <div class="results-screen">
            <div class="results-header">
                <h2>🎯 Your Personalized Results</h2>
                <p>Based on your answers, here are the best ways to buy Bitcoin right now:</p>
                <div class="results-summary">
                    ${summaryHTML}
                </div>
            </div>

            <div class="result-cards">
                ${cardsHTML}
            </div>

            <div class="next-steps">
                <h3>📚 Next Steps After You Buy</h3>
                <div class="next-steps-list">
                    <div class="next-step-item">
                        <span class="next-step-number">1</span>
                        <div class="next-step-content">
                            <strong>Move to Self-Custody</strong><br>
                            <span style="color: var(--text-dim);">Don't leave Bitcoin on the exchange. Learn: <a href="/interactive-demos/wallet-security-workshop/">Wallet Security Workshop</a></span>
                        </div>
                    </div>
                    <div class="next-step-item">
                        <span class="next-step-number">2</span>
                        <div class="next-step-content">
                            <strong>Practice First Withdrawal</strong><br>
                            <span style="color: var(--text-dim);">Test with a small amount: <a href="/interactive-demos/testnet-practice-guide/">Testnet Practice Guide</a></span>
                        </div>
                    </div>
                    <div class="next-step-item">
                        <span class="next-step-number">3</span>
                        <div class="next-step-content">
                            <strong>Secure Your Seed Phrase</strong><br>
                            <span style="color: var(--text-dim);">Master backup strategy: <a href="/paths/hurried/stage-1/module-3.html">Seed Phrase Security Module</a></span>
                        </div>
                    </div>
                    <div class="next-step-item">
                        <span class="next-step-number">4</span>
                        <div class="next-step-content">
                            <strong>Continue Learning</strong><br>
                            <span style="color: var(--text-dim);">Choose your path: <a href="/paths/hurried/">The Hurried</a> (60 min) or <a href="/paths/pragmatist/">The Pragmatist</a> (comprehensive)</span>
                        </div>
                    </div>
                </div>
            </div>

            <div style="text-align: center; margin-top: 2rem;">
                <button class="btn-nav" onclick="restartQuiz()">← Start Over</button>
            </div>
        </div>
    `;

    resultsContainer.classList.add('active');
}

function findMatchingOnramps() {
    // Find best matching rule
    let bestMatch = null;
    let bestScore = -1;

    for (const rule of ONRAMP_RULES) {
        const score = calculateMatchScore(rule.conditions, userAnswers);
        if (score > bestScore) {
            bestScore = score;
            bestMatch = rule;
        }
    }

    if (bestMatch && bestScore > 0) {
        return bestMatch.results.slice(0, 3); // Top 3 results
    }

    // Return fallback if no good match
    return FALLBACK_RESULTS;
}

function calculateMatchScore(conditions, answers) {
    let score = 0;
    let totalChecks = 0;

    // Country match (most important)
    if (conditions.country) {
        totalChecks += 3;
        if (conditions.country.includes(answers.country)) {
            score += 3;
        }
    }

    // Amount match
    if (conditions.amount) {
        totalChecks += 2;
        if (conditions.amount.includes(answers.amount)) {
            score += 2;
        }
    }

    // KYC match
    if (conditions.kyc) {
        totalChecks += 2;
        if (Array.isArray(conditions.kyc)) {
            if (conditions.kyc.includes(answers.kyc)) score += 2;
        } else {
            if (conditions.kyc === answers.kyc) score += 2;
        }
    }

    // Speed match
    if (conditions.speed) {
        totalChecks += 1;
        if (Array.isArray(conditions.speed)) {
            if (conditions.speed.includes(answers.speed)) score += 1;
        } else {
            if (conditions.speed === answers.speed) score += 1;
        }
    }

    // Payment method match
    if (conditions.payment) {
        totalChecks += 2;
        const userPayments = answers.payment || [];
        const hasMatch = conditions.payment.some(method => userPayments.includes(method));
        if (hasMatch) score += 2;
    }

    return totalChecks > 0 ? score / totalChecks : 0;
}

function getCountryLabel(value) {
    const labels = {
        'us': '🇺🇸 US/Canada',
        'eu': '🇪🇺 Europe',
        'latam': '🌎 Latin America',
        'oceania': '🦘 Australia/NZ',
        'asia': '🌏 Asia',
        'other': '🌍 Global'
    };
    return labels[value] || value;
}

function getSpeedLabel(value) {
    const labels = {
        'instant': '⚡ Fast',
        'week': '📅 Normal',
        'cheapest': '💡 Cheapest'
    };
    return labels[value] || value;
}

function copyToClipboard(name) {
    const text = `${name} - Check out this on-ramp recommendation from Bitcoin Sovereign Academy`;
    navigator.clipboard.writeText(text).then(() => {
        alert('✓ Copied to clipboard!');
    });
}

function restartQuiz() {
    userAnswers = {};
    currentQuestion = 0;
    document.getElementById('screen-results').classList.remove('active');
    document.getElementById('screen-start').classList.add('active');
    document.getElementById('progress-container').style.display = 'none';
    document.getElementById('progress-fill').style.width = '0%';
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Inject icons if IconLibrary is available
    if (window.IconLibrary) {
        setTimeout(() => {
            document.querySelectorAll('[data-icon]').forEach(function(element) {
                const iconName = element.getAttribute('data-icon');
                if (iconName) {
                    const iconHTML = IconLibrary.get(iconName, 20, true);
                    const span = document.createElement('span');
                    span.innerHTML = iconHTML;
                    span.className = 'icon-inline';
                    span.style.marginRight = '0.5rem';
                    span.style.display = 'inline-block';
                    span.style.verticalAlign = 'middle';
                    element.insertBefore(span, element.firstChild);
                }
            });
        }, 100);
    }
});
