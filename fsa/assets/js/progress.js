/**
 * FSA Platform - Progress Tracking
 * Manages user learning progress and achievements
 */

const Progress = {
    /**
     * Initialize progress tracking
     */
    init() {
        this.loadProgress();
        this.updateProgressDisplay();
    },

    /**
     * Load progress from localStorage
     */
    loadProgress() {
        const data = localStorage.getItem('fsa_progress');
        return data ? JSON.parse(data) : this.getDefaultProgress();
    },

    /**
     * Get default progress structure
     */
    getDefaultProgress() {
        return {
            completedModules: [],
            currentModule: null,
            modulesProgress: {}, // module-id: { started: date, completed: date, score: number }
            badges: [],
            totalTime: 0, // minutes
            startDate: new Date().toISOString()
        };
    },

    /**
     * Save progress to localStorage
     */
    saveProgress(progress) {
        localStorage.setItem('fsa_progress', JSON.stringify(progress));
        this.updateProgressDisplay();
    },

    /**
     * Mark module as started
     */
    startModule(moduleId) {
        const progress = this.loadProgress();
        
        if (!progress.modulesProgress[moduleId]) {
            progress.modulesProgress[moduleId] = {
                started: new Date().toISOString(),
                completed: null,
                score: 0,
                timeSpent: 0
            };
        }
        
        progress.currentModule = moduleId;
        this.saveProgress(progress);
    },

    /**
     * Mark module as completed
     */
    completeModule(moduleId, score = 100) {
        const progress = this.loadProgress();
        
        if (!progress.completedModules.includes(moduleId)) {
            progress.completedModules.push(moduleId);
        }
        
        if (progress.modulesProgress[moduleId]) {
            progress.modulesProgress[moduleId].completed = new Date().toISOString();
            progress.modulesProgress[moduleId].score = score;
        }
        
        // Award badge for completion
        this.awardBadge(progress, `module-${moduleId}-complete`);
        
        // Award special badges
        if (progress.completedModules.length === 5) {
            this.awardBadge(progress, 'halfway-hero');
        }
        if (progress.completedModules.length === 10) {
            this.awardBadge(progress, 'financial-master');
        }
        
        this.saveProgress(progress);
        
        // Show celebration
        this.showCompletionCelebration(moduleId, score);
    },

    /**
     * Award a badge
     */
    awardBadge(progress, badgeId) {
        if (!progress.badges.includes(badgeId)) {
            progress.badges.push(badgeId);
            this.showBadgeNotification(badgeId);
        }
    },

    /**
     * Update time spent
     */
    updateTimeSpent(moduleId, minutes) {
        const progress = this.loadProgress();
        
        if (progress.modulesProgress[moduleId]) {
            progress.modulesProgress[moduleId].timeSpent += minutes;
        }
        
        progress.totalTime += minutes;
        this.saveProgress(progress);
    },

    /**
     * Calculate completion percentage
     */
    getCompletionPercentage() {
        const progress = this.loadProgress();
        const totalModules = 10;
        const completed = progress.completedModules.length;
        return (completed / totalModules) * 100;
    },

    /**
     * Get next module recommendation
     */
    getNextModule() {
        const progress = this.loadProgress();
        const userData = window.FSA.getUserData();
        const persona = userData ? userData.persona : null;
        
        // Get persona-specific module sequence
        const sequence = this.getPersonaSequence(persona);
        
        // Find next uncompleted module in sequence
        for (let moduleId of sequence) {
            if (!progress.completedModules.includes(moduleId)) {
                return moduleId;
            }
        }
        
        return null; // All modules completed
    },

    /**
     * Get persona-specific module sequence
     */
    getPersonaSequence(persona) {
        const sequences = {
            'debt-burdened': ['01', '05', '02', '04', '03', '06', '07', '08', '09', '10'],
            'fresh-graduate': ['01', '06', '02', '03', '04', '07', '05', '08', '09', '10'],
            'mid-career': ['07', '02', '08', '06', '10', '03', '04', '05', '09', '01'],
            'pre-retiree': ['10', '07', '08', '06', '02', '09', '03', '04', '05', '01'],
            'entrepreneur': ['01', '06', '05', '02', '07', '08', '03', '04', '09', '10']
        };
        
        return sequences[persona] || ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];
    },

    /**
     * Update progress display on page
     */
    updateProgressDisplay() {
        const progress = this.loadProgress();
        const percentage = this.getCompletionPercentage();
        
        // Update progress bar if exists
        const progressBar = document.querySelector('.progress-fill');
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }
        
        // Update progress text
        const progressText = document.querySelector('.progress-text');
        if (progressText) {
            progressText.textContent = `${progress.completedModules.length} of 10 modules completed`;
        }
        
        // Update badges display
        this.updateBadgesDisplay(progress.badges);
    },

    /**
     * Update badges display
     */
    updateBadgesDisplay(badges) {
        const badgesContainer = document.querySelector('.badges-container');
        if (!badgesContainer) return;
        
        badgesContainer.innerHTML = '';
        
        badges.forEach(badgeId => {
            const badgeEl = document.createElement('div');
            badgeEl.className = 'badge-item';
            badgeEl.innerHTML = `
                <div class="badge-icon">${this.getBadgeIcon(badgeId)}</div>
                <div class="badge-name">${this.getBadgeName(badgeId)}</div>
            `;
            badgesContainer.appendChild(badgeEl);
        });
    },

    /**
     * Get badge icon
     */
    getBadgeIcon(badgeId) {
        const icons = {
            'halfway-hero': '🌟',
            'financial-master': '🏆',
            'calculator-pro': '📊',
            'scenario-solver': '🎯'
        };
        
        if (badgeId.includes('module')) {
            return '✓';
        }
        
        return icons[badgeId] || '🎖️';
    },

    /**
     * Get badge name
     */
    getBadgeName(badgeId) {
        const names = {
            'halfway-hero': 'Halfway Hero',
            'financial-master': 'Financial Master',
            'calculator-pro': 'Calculator Pro',
            'scenario-solver': 'Scenario Solver'
        };
        
        if (badgeId.includes('module')) {
            const moduleNum = badgeId.match(/\d+/)[0];
            return `Module ${moduleNum} Complete`;
        }
        
        return names[badgeId] || badgeId;
    },

    /**
     * Show completion celebration
     */
    showCompletionCelebration(moduleId, score) {
        const celebration = document.createElement('div');
        celebration.className = 'celebration-modal';
        celebration.innerHTML = `
            <div class="celebration-content">
                <div class="celebration-icon">🎉</div>
                <h2>Module Complete!</h2>
                <p>You've completed Module ${moduleId}</p>
                <div class="celebration-score">Score: ${score}%</div>
                <button class="btn-primary" onclick="this.closest('.celebration-modal').remove()">Continue</button>
            </div>
        `;
        
        document.body.appendChild(celebration);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (celebration.parentNode) {
                celebration.remove();
            }
        }, 5000);
    },

    /**
     * Show badge notification
     */
    showBadgeNotification(badgeId) {
        const notification = document.createElement('div');
        notification.className = 'badge-notification';
        notification.innerHTML = `
            <div class="badge-notif-icon">${this.getBadgeIcon(badgeId)}</div>
            <div class="badge-notif-text">
                <strong>New Badge!</strong><br>
                ${this.getBadgeName(badgeId)}
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },

    /**
     * Export progress data
     */
    exportProgress() {
        const progress = this.loadProgress();
        const userData = window.FSA.getUserData();
        
        const exportData = {
            ...progress,
            userData,
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `fsa-progress-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
    },

    /**
     * Import progress data
     */
    importProgress(file) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.completedModules && data.modulesProgress) {
                    localStorage.setItem('fsa_progress', JSON.stringify(data));
                    this.updateProgressDisplay();
                    window.FSA.showAlert('success', 'Progress imported successfully!');
                } else {
                    throw new Error('Invalid progress file');
                }
            } catch (error) {
                window.FSA.showAlert('error', 'Failed to import progress. Invalid file format.');
            }
        };
        
        reader.readAsText(file);
    },

    /**
     * Reset progress (with confirmation)
     */
    resetProgress() {
        if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
            localStorage.removeItem('fsa_progress');
            this.updateProgressDisplay();
            window.FSA.showAlert('info', 'Progress has been reset.');
            window.location.reload();
        }
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    Progress.init();
});

// Export to window for global access
window.FSA = window.FSA || {};
window.FSA.Progress = Progress;