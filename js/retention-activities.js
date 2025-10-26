/**
 * Curious Path - Retention Activities JavaScript Module
 * Bitcoin Sovereign Academy
 *
 * Reusable functions for interactive learning activities across all Curious Path modules.
 * Handles drag-to-order, tap-to-reveal, confidence meters, scenarios, and progress tracking.
 */

// ========================================
// STORAGE UTILITIES
// ========================================

/**
 * Standardized localStorage key generator
 * Pattern: retention.curious.s{stage}.m{module}.{activityType}.v1
 */
function getStorageKey(stage, module, activityType, index = null) {
    const key = `retention.curious.s${stage}.m${module}.${activityType}`;
    return index !== null ? `${key}.${index}.v1` : `${key}.v1`;
}

/**
 * Save activity state to localStorage
 */
function saveActivityState(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.warn('Failed to save activity state:', e);
    }
}

/**
 * Load activity state from localStorage
 */
function loadActivityState(key) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    } catch (e) {
        console.warn('Failed to load activity state:', e);
        return null;
    }
}

// ========================================
// DRAG-TO-ORDER ACTIVITY
// ========================================

/**
 * Initialize drag-to-order activity
 * @param {string} containerId - ID of the activity container
 * @param {Array<string>} correctOrder - Array of data-id values in correct order
 * @param {string} storageKey - localStorage key for persistence
 */
function initDragToOrder(containerId, correctOrder, storageKey) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const droplist = container.querySelector('.droplist');
    const bin = container.querySelector('.drag-bin');
    const checkBtn = container.querySelector('.check-order-btn');
    const feedback = container.querySelector('.order-feedback');
    const draggables = Array.from(container.querySelectorAll('.draggable, .chip'));

    // Shuffle chips initially
    draggables.sort(() => Math.random() - 0.5).forEach(chip => bin.appendChild(chip));

    // Enable drag functionality
    function enableDrag(element) {
        element.addEventListener('dragstart', e => {
            if (!e.target.matches('.draggable, .chip')) return;
            e.dataTransfer.setData('id', e.target.dataset.id);
            e.target.style.opacity = '0.5';
            e.target.setAttribute('aria-grabbed', 'true');
        });

        element.addEventListener('dragend', e => {
            if (e.target.matches('.draggable, .chip')) {
                e.target.style.opacity = '1';
                e.target.setAttribute('aria-grabbed', 'false');
            }
        });

        element.addEventListener('dragover', e => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });

        element.addEventListener('drop', e => {
            e.preventDefault();
            const id = e.dataTransfer.getData('id');
            const node = container.querySelector(`.draggable[data-id="${id}"], .chip[data-id="${id}"]`);

            if (e.currentTarget.classList.contains('droplist')) {
                e.currentTarget.appendChild(node);
            } else if (e.currentTarget.classList.contains('drag-bin')) {
                bin.appendChild(node);
            }
        });
    }

    enableDrag(droplist);
    enableDrag(bin);

    // Check order button
    checkBtn.addEventListener('click', () => {
        const currentOrder = Array.from(droplist.querySelectorAll('.draggable, .chip'))
            .map(n => n.dataset.id);
        const isCorrect = JSON.stringify(currentOrder) === JSON.stringify(correctOrder);

        feedback.className = 'order-feedback ' + (isCorrect ? 'correct' : 'incorrect');
        feedback.textContent = isCorrect
            ? '✓ Perfect! You got the correct order.'
            : '✗ Not quite right. Try rearranging the items.';
        feedback.style.display = 'block';
        feedback.setAttribute('role', 'alert');

        if (isCorrect) {
            saveActivityState(storageKey, { completed: true, order: currentOrder, completedAt: new Date().toISOString() });
            checkAllActivitiesComplete();
        }
    });

    // Restore saved state
    const savedState = loadActivityState(storageKey);
    if (savedState && savedState.completed) {
        feedback.className = 'order-feedback correct';
        feedback.textContent = '✓ Completed';
        feedback.style.display = 'block';
    }
}

// ========================================
// TAP-TO-REVEAL CARDS
// ========================================

/**
 * Initialize tap-to-reveal cards
 * @param {string} containerSelector - CSS selector for card container
 * @param {string} storageKeyPrefix - Prefix for localStorage keys (will append index)
 */
function initTapCards(containerSelector, storageKeyPrefix) {
    const cards = document.querySelectorAll(containerSelector);

    cards.forEach((card, index) => {
        const storageKey = `${storageKeyPrefix}.${index}`;
        const answer = card.dataset.answer;

        // Restore saved state
        const savedState = loadActivityState(storageKey);
        if (savedState && savedState.revealed) {
            card.innerHTML = '💡 ' + answer;
            card.classList.add('revealed');
        }

        // Click handler
        card.addEventListener('click', () => {
            if (card.classList.contains('revealed')) return;

            card.innerHTML = '💡 ' + answer;
            card.classList.add('revealed', 'fade-in');
            card.setAttribute('aria-expanded', 'true');

            saveActivityState(storageKey, {
                revealed: true,
                revealedAt: new Date().toISOString()
            });

            checkAllActivitiesComplete();
        });

        // Keyboard accessibility
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-expanded', savedState && savedState.revealed ? 'true' : 'false');

        card.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });
}

// ========================================
// CONFIDENCE METER / SLIDER
// ========================================

/**
 * Initialize confidence meter activity
 * @param {string} sliderId - ID of range input
 * @param {string} valueDisplayId - ID of element showing current value
 * @param {string} hintBtnId - ID of "Get Hint" button
 * @param {string} hintDisplayId - ID of hint display element
 * @param {Function} hintFunction - Function that takes confidence value (0-100) and returns hint text
 * @param {string} storageKey - localStorage key for persistence
 */
function initConfidenceMeter(sliderId, valueDisplayId, hintBtnId, hintDisplayId, hintFunction, storageKey) {
    const slider = document.getElementById(sliderId);
    const valueDisplay = document.getElementById(valueDisplayId);
    const hintBtn = document.getElementById(hintBtnId);
    const hintDisplay = document.getElementById(hintDisplayId);

    if (!slider || !valueDisplay || !hintBtn || !hintDisplay) return;

    // Update value display
    slider.addEventListener('input', () => {
        const value = parseInt(slider.value);
        valueDisplay.textContent = value + '%';

        // Color coding
        valueDisplay.className = 'confidence-value';
        if (value < 34) {
            valueDisplay.classList.add('low');
        } else if (value < 67) {
            valueDisplay.classList.add('medium');
        } else {
            valueDisplay.classList.add('high');
        }

        // Update ARIA
        slider.setAttribute('aria-valuenow', value);
    });

    // Get hint button
    hintBtn.addEventListener('click', () => {
        const value = parseInt(slider.value);
        const hint = hintFunction(value);

        hintDisplay.innerHTML = hint;
        hintDisplay.classList.add('shown', 'fade-in');
        hintDisplay.setAttribute('role', 'alert');

        saveActivityState(storageKey, {
            confidence: value,
            hint: hint,
            hintRequestedAt: new Date().toISOString()
        });

        checkAllActivitiesComplete();
    });

    // Restore saved state
    const savedState = loadActivityState(storageKey);
    if (savedState) {
        slider.value = savedState.confidence;
        valueDisplay.textContent = savedState.confidence + '%';
        hintDisplay.innerHTML = savedState.hint;
        hintDisplay.classList.add('shown');
    }

    // ARIA attributes
    slider.setAttribute('role', 'slider');
    slider.setAttribute('aria-valuemin', '0');
    slider.setAttribute('aria-valuemax', '100');
    slider.setAttribute('aria-valuenow', slider.value);
    slider.setAttribute('aria-label', 'Confidence level from 0 to 100 percent');
}

// ========================================
// SCENARIO / DECISION ACTIVITY
// ========================================

/**
 * Initialize scenario-based decision activity
 * @param {string} containerId - ID of scenario container
 * @param {Object} config - Configuration object with correctAnswer, feedback mapping
 * @param {string} storageKey - localStorage key for persistence
 */
function initScenario(containerId, config, storageKey) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const options = container.querySelectorAll('.scenario-btn');
    const feedbackDiv = container.querySelector('.scenario-feedback');

    options.forEach(option => {
        const answer = option.dataset.answer;

        option.addEventListener('click', () => {
            // Clear previous selections
            options.forEach(opt => {
                opt.classList.remove('selected', 'correct', 'incorrect');
            });

            // Mark selection
            option.classList.add('selected');

            // Determine correctness
            const isCorrect = answer === config.correctAnswer;
            option.classList.add(isCorrect ? 'correct' : 'incorrect');

            // Show feedback
            const feedbackText = config.feedback[answer] || config.feedback.default;
            const feedbackType = config.feedbackType && config.feedbackType[answer] ? config.feedbackType[answer] : 'neutral';

            feedbackDiv.innerHTML = feedbackText;
            feedbackDiv.className = 'scenario-feedback show ' + feedbackType;
            feedbackDiv.setAttribute('role', 'alert');

            // Save state
            saveActivityState(storageKey, {
                selected: answer,
                correct: isCorrect,
                selectedAt: new Date().toISOString()
            });

            checkAllActivitiesComplete();
        });

        // Keyboard accessibility
        option.setAttribute('role', 'button');
        option.setAttribute('tabindex', '0');

        option.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                option.click();
            }
        });
    });

    // Restore saved state
    const savedState = loadActivityState(storageKey);
    if (savedState) {
        const selectedOption = container.querySelector(`.scenario-btn[data-answer="${savedState.selected}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected', savedState.correct ? 'correct' : 'incorrect');

            const feedbackText = config.feedback[savedState.selected] || config.feedback.default;
            const feedbackType = config.feedbackType && config.feedbackType[savedState.selected] ? config.feedbackType[savedState.selected] : 'neutral';

            feedbackDiv.innerHTML = feedbackText;
            feedbackDiv.className = 'scenario-feedback show ' + feedbackType;
        }
    }
}

// ========================================
// PREDICTION ACTIVITY
// ========================================

/**
 * Initialize prediction activity with reveal button
 * @param {string} containerId - ID of prediction container
 * @param {string} correctAnswer - Data-value of correct prediction chip
 * @param {Object} feedback - Object with feedback text for correct/incorrect
 * @param {string} storageKey - localStorage key for persistence
 */
function initPrediction(containerId, correctAnswer, feedback, storageKey) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const chips = container.querySelectorAll('.prediction-chip');
    const revealBtn = container.querySelector('.reveal-answer-btn');
    const feedbackDiv = container.querySelector('.prediction-feedback');

    let selectedAnswer = null;

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            // Clear previous selection
            chips.forEach(c => c.classList.remove('selected'));

            // Select this chip
            chip.classList.add('selected');
            selectedAnswer = chip.dataset.value;
            revealBtn.disabled = false;
        });

        // Keyboard accessibility
        chip.setAttribute('role', 'button');
        chip.setAttribute('tabindex', '0');
        chip.setAttribute('aria-pressed', 'false');

        chip.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                chip.click();
            }
        });
    });

    revealBtn.addEventListener('click', () => {
        if (!selectedAnswer) return;

        const isCorrect = selectedAnswer === correctAnswer;

        feedbackDiv.innerHTML = isCorrect ? feedback.correct : feedback.incorrect;
        feedbackDiv.className = 'prediction-feedback show ' + (isCorrect ? 'correct' : 'incorrect');
        feedbackDiv.setAttribute('role', 'alert');

        revealBtn.disabled = true;

        saveActivityState(storageKey, {
            predicted: selectedAnswer,
            correct: isCorrect,
            predictedAt: new Date().toISOString()
        });

        checkAllActivitiesComplete();
    });

    // Restore saved state
    const savedState = loadActivityState(storageKey);
    if (savedState) {
        const selectedChip = container.querySelector(`.prediction-chip[data-value="${savedState.predicted}"]`);
        if (selectedChip) {
            selectedChip.classList.add('selected');
            feedbackDiv.innerHTML = savedState.correct ? feedback.correct : feedback.incorrect;
            feedbackDiv.className = 'prediction-feedback show ' + (savedState.correct ? 'correct' : 'incorrect');
            revealBtn.disabled = true;
        }
    }
}

// ========================================
// PROGRESS TRACKING
// ========================================

/**
 * Check if all required activities are complete
 * @param {Array<string>} requiredKeys - Array of localStorage keys that must exist for completion
 * @returns {boolean} - True if all activities complete
 */
function checkAllActivitiesComplete(requiredKeys = []) {
    // If no specific keys provided, try to find them from data attributes
    if (requiredKeys.length === 0) {
        const activities = document.querySelectorAll('[data-activity-key]');
        requiredKeys = Array.from(activities).map(el => el.dataset.activityKey);
    }

    const allComplete = requiredKeys.every(key => {
        const state = loadActivityState(key);
        return state && (state.completed || state.revealed || state.confidence !== undefined || state.selected !== undefined || state.predicted !== undefined);
    });

    return allComplete;
}

/**
 * Enable next module button when all activities complete
 * @param {string} nextBtnId - ID of next module button
 * @param {Array<string>} requiredKeys - Array of localStorage keys required for completion
 * @param {string} completionMessage - Optional custom completion message
 */
function enableNextModule(nextBtnId, requiredKeys = [], completionMessage = null) {
    const allComplete = checkAllActivitiesComplete(requiredKeys);

    if (allComplete) {
        const nextBtn = document.getElementById(nextBtnId);
        if (nextBtn) {
            nextBtn.classList.remove('disabled');
            nextBtn.removeAttribute('disabled');
        }

        // Show completion banner
        const completionKey = `completion.${nextBtnId}`;
        if (!loadActivityState(completionKey)) {
            showCompletionBanner(completionMessage || '🎉 All Activities Complete! You can now proceed to the next module.');
            saveActivityState(completionKey, { shown: true, shownAt: new Date().toISOString() });
        }
    }
}

/**
 * Show completion banner with animation
 * @param {string} message - Completion message to display
 */
function showCompletionBanner(message) {
    const banner = document.createElement('div');
    banner.className = 'completion-banner';
    banner.innerHTML = `
        <h4>🎉 All Activities Complete!</h4>
        <p>${message}</p>
    `;

    const retentionSection = document.querySelector('.retention-section');
    if (retentionSection) {
        retentionSection.appendChild(banner);
    }
}

/**
 * Save module progress to learning progress tracker
 * @param {string} pathId - Path identifier (e.g., 'curious')
 * @param {number} stage - Stage number
 * @param {number} module - Module number
 * @param {Object} metadata - Additional metadata to save
 */
function saveModuleProgress(pathId, stage, module, metadata = {}) {
    const moduleId = `${pathId}-${stage}-${module}`;

    try {
        const progress = JSON.parse(localStorage.getItem('learningProgress') || '{}');

        if (!progress.completedModules) {
            progress.completedModules = [];
        }

        if (!progress.completedModules.includes(moduleId)) {
            progress.completedModules.push(moduleId);
        }

        progress.lastActivity = new Date().toISOString();
        progress.path = pathId;
        progress.currentStage = stage;
        progress.currentModule = module + 1; // Next module

        // Merge metadata
        Object.assign(progress, metadata);

        localStorage.setItem('learningProgress', JSON.stringify(progress));
    } catch (e) {
        console.warn('Failed to save module progress:', e);
    }
}

/**
 * Check if current module is already completed
 * @param {string} pathId - Path identifier
 * @param {number} stage - Stage number
 * @param {number} module - Module number
 * @returns {boolean} - True if module already completed
 */
function isModuleCompleted(pathId, stage, module) {
    try {
        const progress = JSON.parse(localStorage.getItem('learningProgress') || '{}');
        const moduleId = `${pathId}-${stage}-${module}`;
        return (progress.completedModules || []).includes(moduleId);
    } catch (e) {
        console.warn('Failed to check module completion:', e);
        return false;
    }
}

/**
 * Show "already completed" notice if module was previously finished
 * @param {string} pathId - Path identifier
 * @param {number} stage - Stage number
 * @param {number} module - Module number
 * @param {string} nextBtnId - ID of next module button to enable
 */
function showCompletionNotice(pathId, stage, module, nextBtnId) {
    if (isModuleCompleted(pathId, stage, module)) {
        const nextBtn = document.getElementById(nextBtnId);
        if (nextBtn) {
            nextBtn.classList.remove('disabled');
            nextBtn.removeAttribute('disabled');
        }

        const notice = document.createElement('div');
        notice.className = 'completion-banner';
        notice.innerHTML = `
            <h4>✓ You've Already Completed This Module</h4>
            <p>Feel free to review the material or move on to the next module.</p>
        `;

        const container = document.querySelector('.container');
        const firstSection = container.querySelector('.content-section');
        if (firstSection) {
            container.insertBefore(notice, firstSection);
        }
    }
}

// ========================================
// SOCRATIC PROMPTS (EXPANDABLE)
// ========================================

/**
 * Initialize expandable Socratic reflection prompts
 * @param {string} containerSelector - CSS selector for prompt containers
 */
function initSocraticPrompts(containerSelector) {
    const prompts = document.querySelectorAll(containerSelector);

    prompts.forEach((prompt, index) => {
        if (!prompt.classList.contains('expandable')) return;

        const hint = prompt.querySelector('.socratic-hint');
        if (!hint) return;

        prompt.addEventListener('click', () => {
            prompt.classList.toggle('expanded');
            prompt.setAttribute('aria-expanded', prompt.classList.contains('expanded'));
        });

        // Keyboard accessibility
        prompt.setAttribute('role', 'button');
        prompt.setAttribute('tabindex', '0');
        prompt.setAttribute('aria-expanded', 'false');

        prompt.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                prompt.click();
            }
        });
    });
}

// ========================================
// INITIALIZATION HELPER
// ========================================

/**
 * Auto-initialize all retention activities on page load
 * Looks for data-activity attributes and initializes accordingly
 */
function autoInitActivities() {
    // Drag-to-order activities
    document.querySelectorAll('[data-activity="drag-to-order"]').forEach(container => {
        const correctOrder = container.dataset.correctOrder.split(',');
        const storageKey = container.dataset.activityKey;
        initDragToOrder(container.id, correctOrder, storageKey);
    });

    // Tap-to-reveal cards
    const tapcardContainers = document.querySelectorAll('[data-activity="tap-cards"]');
    tapcardContainers.forEach(container => {
        const storageKeyPrefix = container.dataset.activityKey;
        initTapCards(container.dataset.cardSelector, storageKeyPrefix);
    });

    // Confidence meters
    document.querySelectorAll('[data-activity="confidence-meter"]').forEach(container => {
        const config = JSON.parse(container.dataset.config || '{}');
        // Custom hint function would need to be defined per module
    });

    // Socratic prompts
    initSocraticPrompts('.socratic-prompt.expandable');
}

// ========================================
// EXPORT FOR MODULE USAGE
// ========================================

// Auto-initialize on DOMContentLoaded if not using module pattern
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        // Auto-initialization can be enabled by adding data-auto-init attribute
        if (document.querySelector('[data-auto-init="retention-activities"]')) {
            autoInitActivities();
        }
    });
}

// Export functions for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getStorageKey,
        saveActivityState,
        loadActivityState,
        initDragToOrder,
        initTapCards,
        initConfidenceMeter,
        initScenario,
        initPrediction,
        checkAllActivitiesComplete,
        enableNextModule,
        showCompletionBanner,
        saveModuleProgress,
        isModuleCompleted,
        showCompletionNotice,
        initSocraticPrompts,
        autoInitActivities
    };
}
