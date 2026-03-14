/**
 * Safety Assessment Gate - Bitcoin Sovereign Academy
 * 
 * Prevents users from accessing custody/financial content without
 * completing a safety readiness assessment.
 */

(function() {
    'use strict';
    
    const SAFETY_STORAGE_KEY = 'bsa_safety_assessment_completed';
    const SAFETY_SCORE_KEY = 'bsa_safety_score';
    const ASSESSMENT_VERSION = '1.0';
    
    // Topics that require safety assessment
    const PROTECTED_TOPICS = [
        'wallet', 'custody', 'seed-phrase', 'private-key', 'hardware-wallet',
        'multisig', 'exchange', 'buying', 'selling', 'storing', 'inheritance',
        'security', 'backup', 'recovery'
    ];
    
    let assessmentModal = null;
    let currentScore = 0;
    let assessmentData = {};
    
    const assessmentQuestions = [
        {
            id: 'emergency_fund',
            question: 'Do you have an emergency fund that covers 3-6 months of expenses in traditional savings?',
            type: 'radio',
            required: true,
            weight: 3,
            options: [
                { value: 'yes', label: 'Yes, I have 3-6 months saved', points: 3 },
                { value: 'partial', label: 'I have 1-2 months saved', points: 1 },
                { value: 'no', label: 'No emergency fund', points: 0 }
            ]
        },
        {
            id: 'risk_tolerance',
            question: 'How much money can you afford to lose without affecting your daily life?',
            type: 'radio',
            required: true,
            weight: 3,
            options: [
                { value: 'comfortable', label: '5-10% of my savings', points: 3 },
                { value: 'moderate', label: '1-5% of my savings', points: 2 },
                { value: 'minimal', label: 'Less than 1%', points: 1 },
                { value: 'none', label: 'I cannot afford to lose any money', points: 0 }
            ]
        },
        {
            id: 'tech_comfort',
            question: 'How comfortable are you with technology and digital security?',
            type: 'radio',
            required: true,
            weight: 2,
            options: [
                { value: 'expert', label: 'Very comfortable - I manage passwords, backups, and security tools', points: 3 },
                { value: 'good', label: 'Comfortable - I can learn new tech with some guidance', points: 2 },
                { value: 'basic', label: 'Basic - I use email and apps but avoid complex tech', points: 1 },
                { value: 'minimal', label: 'Uncomfortable with technology', points: 0 }
            ]
        },
        {
            id: 'learning_stage',
            question: 'Where are you in your Bitcoin learning journey?',
            type: 'radio',
            required: true,
            weight: 2,
            options: [
                { value: 'research', label: 'Just researching and learning', points: 3 },
                { value: 'considering', label: 'Considering making a small purchase', points: 2 },
                { value: 'ready', label: 'Ready to buy but want to be safe', points: 1 },
                { value: 'urgent', label: 'Need to buy immediately', points: 0 }
            ]
        },
        {
            id: 'pressure_source',
            question: 'What is driving your interest in Bitcoin?',
            type: 'checkbox',
            required: true,
            weight: 2,
            options: [
                { value: 'education', label: 'Curiosity and education', points: 2 },
                { value: 'inflation', label: 'Protection against inflation', points: 2 },
                { value: 'sovereignty', label: 'Financial independence', points: 2 },
                { value: 'investment', label: 'Long-term investment strategy', points: 1 },
                { value: 'price', label: 'Fear of missing out on price gains', points: -1 },
                { value: 'social', label: 'Social media or friend recommendations', points: -1 },
                { value: 'urgent', label: 'Need quick profits', points: -2 }
            ]
        }
    ];
    
    function hasCompletedAssessment() {
        const completed = localStorage.getItem(SAFETY_STORAGE_KEY);
        return completed === ASSESSMENT_VERSION;
    }
    
    function getSafetyScore() {
        const score = localStorage.getItem(SAFETY_SCORE_KEY);
        return score ? parseInt(score, 10) : 0;
    }
    
    function shouldShowAssessment(pageContent) {
        if (hasCompletedAssessment()) {
            return false;
        }
        
        // Check if page contains protected content
        const content = pageContent.toLowerCase();
        return PROTECTED_TOPICS.some(topic => content.includes(topic));
    }
    
    function createAssessmentModal() {
        const modal = document.createElement('div');
        modal.id = 'safety-assessment-modal';
        modal.className = 'safety-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'assessment-title');
        
        modal.innerHTML = `
            <div class="safety-modal-overlay"></div>
            <div class="safety-modal-content">
                <div class="safety-header">
                    <h2 id="assessment-title">⚠️ Bitcoin Safety Assessment</h2>
                    <p class="safety-subtitle">
                        Before learning about Bitcoin custody and security, let's make sure you're ready to handle this information safely.
                    </p>
                </div>
                
                <div class="safety-warning">
                    <strong>Important:</strong> Bitcoin is not a get-rich-quick scheme. Poor security practices can lead to permanent loss of funds.
                    This assessment helps ensure you're prepared.
                </div>
                
                <form id="safety-assessment-form" class="assessment-form">
                    <div class="progress-indicator">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 0%"></div>
                        </div>
                        <span class="progress-text">Question 1 of ${assessmentQuestions.length}</span>
                    </div>
                    
                    <div id="questions-container"></div>
                    
                    <div class="assessment-nav">
                        <button type="button" id="prev-question" class="btn btn-secondary" disabled>Previous</button>
                        <button type="button" id="next-question" class="btn btn-primary">Next</button>
                        <button type="submit" id="complete-assessment" class="btn btn-primary" style="display: none;">Complete Assessment</button>
                    </div>
                </form>
                
                <button class="safety-modal-close" aria-label="Close assessment">×</button>
            </div>
        `;
        
        return modal;
    }
    
    function renderQuestion(questionIndex) {
        const question = assessmentQuestions[questionIndex];
        const container = document.getElementById('questions-container');
        
        let optionsHTML = '';
        
        if (question.type === 'radio') {
            optionsHTML = question.options.map(option => `
                <label class="option-label">
                    <input type="radio" name="${question.id}" value="${option.value}" data-points="${option.points}" required>
                    <span class="option-text">${option.label}</span>
                </label>
            `).join('');
        } else if (question.type === 'checkbox') {
            optionsHTML = question.options.map(option => `
                <label class="option-label checkbox-option">
                    <input type="checkbox" name="${question.id}" value="${option.value}" data-points="${option.points}">
                    <span class="option-text">${option.label}</span>
                </label>
            `).join('');
        }
        
        container.innerHTML = `
            <div class="question-card active">
                <h3 class="question-text">${question.question}</h3>
                <div class="options-group">
                    ${optionsHTML}
                </div>
                ${question.required ? '<p class="question-note">* This question is required</p>' : ''}
            </div>
        `;
        
        // Update progress
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        const progress = ((questionIndex + 1) / assessmentQuestions.length) * 100;
        
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `Question ${questionIndex + 1} of ${assessmentQuestions.length}`;
    }
    
    function showAssessmentResults(score, maxScore) {
        const modal = document.getElementById('safety-assessment-modal');
        const content = modal.querySelector('.safety-modal-content');
        
        let resultClass, resultIcon, resultTitle, resultMessage, recommendation;
        
        const percentage = (score / maxScore) * 100;
        
        if (percentage >= 80) {
            resultClass = 'result-green';
            resultIcon = '✅';
            resultTitle = 'Good to Go!';
            resultMessage = 'You demonstrate strong readiness for Bitcoin security topics.';
            recommendation = 'You can proceed to learn about custody and security practices.';
        } else if (percentage >= 60) {
            resultClass = 'result-yellow';
            resultIcon = '⚠️';
            resultTitle = 'Proceed with Caution';
            resultMessage = 'You show some readiness, but consider strengthening your foundation first.';
            recommendation = 'We recommend starting with basic Bitcoin concepts before advanced security topics.';
        } else {
            resultClass = 'result-red';
            resultIcon = '🛑';
            resultTitle = 'Build Your Foundation First';
            resultMessage = 'For your financial safety, we recommend building more preparation before handling Bitcoin.';
            recommendation = 'Focus on building an emergency fund and learning basic Bitcoin concepts first.';
        }
        
        content.innerHTML = `
            <div class="safety-header">
                <h2 class="result-title ${resultClass}">
                    ${resultIcon} ${resultTitle}
                </h2>
                <p class="result-message">${resultMessage}</p>
            </div>
            
            <div class="result-details">
                <div class="score-display">
                    <div class="score-circle ${resultClass}">
                        <span class="score-text">${Math.round(percentage)}%</span>
                    </div>
                    <p class="score-description">Safety Readiness Score</p>
                </div>
                
                <div class="recommendation-box ${resultClass}">
                    <h3>Our Recommendation:</h3>
                    <p>${recommendation}</p>
                </div>
                
                <div class="next-steps">
                    <h3>Next Steps:</h3>
                    ${percentage >= 80 ? `
                        <ul>
                            <li>✅ Continue with advanced Bitcoin security topics</li>
                            <li>✅ Learn about different custody options</li>
                            <li>✅ Practice with small amounts first</li>
                        </ul>
                    ` : percentage >= 60 ? `
                        <ul>
                            <li>📚 Start with "Why Bitcoin Matters" basics</li>
                            <li>🏦 Strengthen your emergency fund</li>
                            <li>🎓 Complete beginner topics first</li>
                            <li>🔄 Retake this assessment later</li>
                        </ul>
                    ` : `
                        <ul>
                            <li>💰 Build a 3-6 month emergency fund</li>
                            <li>📖 Learn Bitcoin basics without pressure</li>
                            <li>🎯 Focus on education, not buying</li>
                            <li>⏰ Come back when you're better prepared</li>
                        </ul>
                    `}
                </div>
            </div>
            
            <div class="result-actions">
                <button type="button" id="continue-learning" class="btn btn-primary">
                    ${percentage >= 80 ? 'Continue Learning' : 'Start with Basics'}
                </button>
                <button type="button" id="retake-assessment" class="btn btn-secondary">
                    Retake Assessment
                </button>
            </div>
        `;
        
        // Store results
        localStorage.setItem(SAFETY_STORAGE_KEY, ASSESSMENT_VERSION);
        localStorage.setItem(SAFETY_SCORE_KEY, score.toString());
        
        // Add event listeners for result actions
        document.getElementById('continue-learning').addEventListener('click', () => {
            closeAssessmentModal();
            if (percentage < 80) {
                // Redirect to beginner content
                window.location.href = '/paths/curious/';
            }
        });
        
        document.getElementById('retake-assessment').addEventListener('click', () => {
            localStorage.removeItem(SAFETY_STORAGE_KEY);
            localStorage.removeItem(SAFETY_SCORE_KEY);
            closeAssessmentModal();
            setTimeout(() => showSafetyAssessment(), 100);
        });
    }
    
    function calculateScore() {
        let totalScore = 0;
        let maxScore = 0;
        
        assessmentQuestions.forEach(question => {
            const weight = question.weight;
            
            if (question.type === 'radio') {
                const selected = document.querySelector(`input[name="${question.id}"]:checked`);
                if (selected) {
                    totalScore += parseInt(selected.dataset.points) * weight;
                }
                maxScore += 3 * weight; // Assuming max points per question is 3
            } else if (question.type === 'checkbox') {
                const selected = document.querySelectorAll(`input[name="${question.id}"]:checked`);
                selected.forEach(checkbox => {
                    totalScore += parseInt(checkbox.dataset.points) * weight;
                });
                // For checkboxes, max score is the sum of positive options
                const positiveOptions = question.options.filter(opt => opt.points > 0);
                maxScore += positiveOptions.reduce((sum, opt) => sum + opt.points, 0) * weight;
            }
        });
        
        return { totalScore: Math.max(0, totalScore), maxScore };
    }
    
    function showSafetyAssessment() {
        if (assessmentModal) {
            document.body.removeChild(assessmentModal);
        }
        
        assessmentModal = createAssessmentModal();
        document.body.appendChild(assessmentModal);
        
        let currentQuestion = 0;
        
        // Render first question
        renderQuestion(currentQuestion);
        
        // Navigation handlers
        const nextBtn = document.getElementById('next-question');
        const prevBtn = document.getElementById('prev-question');
        const completeBtn = document.getElementById('complete-assessment');
        const form = document.getElementById('safety-assessment-form');
        
        nextBtn.addEventListener('click', () => {
            if (validateCurrentQuestion(currentQuestion)) {
                currentQuestion++;
                if (currentQuestion >= assessmentQuestions.length) {
                    // Show completion
                    nextBtn.style.display = 'none';
                    completeBtn.style.display = 'block';
                } else {
                    renderQuestion(currentQuestion);
                }
                
                prevBtn.disabled = currentQuestion === 0;
                nextBtn.disabled = currentQuestion >= assessmentQuestions.length;
            }
        });
        
        prevBtn.addEventListener('click', () => {
            if (currentQuestion > 0) {
                currentQuestion--;
                renderQuestion(currentQuestion);
                
                nextBtn.style.display = 'block';
                completeBtn.style.display = 'none';
                prevBtn.disabled = currentQuestion === 0;
                nextBtn.disabled = false;
            }
        });
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const { totalScore, maxScore } = calculateScore();
            showAssessmentResults(totalScore, maxScore);
        });
        
        // Close button
        const closeBtn = document.querySelector('.safety-modal-close');
        closeBtn.addEventListener('click', closeAssessmentModal);
        
        // Prevent closing by clicking overlay for this critical assessment
        const overlay = document.querySelector('.safety-modal-overlay');
        overlay.addEventListener('click', (e) => {
            e.stopPropagation();
            // Show warning instead of closing
            alert('Please complete the safety assessment to proceed with Bitcoin security topics.');
        });
        
        // Focus the modal
        assessmentModal.focus();
    }
    
    function validateCurrentQuestion(questionIndex) {
        const question = assessmentQuestions[questionIndex];
        if (!question.required) return true;
        
        const inputs = document.querySelectorAll(`input[name="${question.id}"]`);
        
        if (question.type === 'radio') {
            const checked = Array.from(inputs).some(input => input.checked);
            if (!checked) {
                alert('Please select an answer before continuing.');
                return false;
            }
        }
        
        return true;
    }
    
    function closeAssessmentModal() {
        if (assessmentModal) {
            document.body.removeChild(assessmentModal);
            assessmentModal = null;
        }
    }
    
    function checkPageContent() {
        // Check if current page contains protected topics
        const bodyText = document.body.textContent;
        const urlPath = window.location.pathname;
        
        const protectedPaths = ['/paths/', '/wallet', '/custody', '/security', '/hardware'];
        const isProtectedPath = protectedPaths.some(path => urlPath.includes(path));
        
        if (isProtectedPath || shouldShowAssessment(bodyText)) {
            // Add a small delay to ensure page is fully loaded
            setTimeout(() => {
                if (!hasCompletedAssessment()) {
                    showSafetyAssessment();
                }
            }, 1000);
        }
    }
    
    // Auto-check when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkPageContent);
    } else {
        checkPageContent();
    }
    
    // Expose methods for manual triggering
    window.BSASafety = {
        showAssessment: showSafetyAssessment,
        hasCompleted: hasCompletedAssessment,
        getScore: getSafetyScore,
        reset: () => {
            localStorage.removeItem(SAFETY_STORAGE_KEY);
            localStorage.removeItem(SAFETY_SCORE_KEY);
        }
    };
})();