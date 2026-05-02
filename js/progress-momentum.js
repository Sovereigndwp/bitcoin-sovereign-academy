/**
 * Progress Momentum System
 * Visualizes user progress and creates momentum through gamification
 */

class ProgressMomentum {
    constructor() {
        this.userProgress = this.loadProgress();
        this.streakCount = 0;
        this.achievements = [];
        this.init();
    }

    init() {
        this.setupProgressIndicator();
        this.checkDailyStreak();
        this.bindEvents();
        this.showProgressOnReturn();
    }

    loadProgress() {
        const saved = localStorage.getItem('bsa-progress');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            pathsStarted: [],
            demosCompleted: [],
            toolsUsed: [],
            timeSpent: 0,
            lastVisit: null,
            achievements: []
        };
    }

    saveProgress() {
        this.userProgress.lastVisit = Date.now();
        localStorage.setItem('bsa-progress', JSON.stringify(this.userProgress));
    }

    setupProgressIndicator() {
        // Only show progress indicator if user has some activity
        if (this.userProgress.pathsStarted.length > 0 || this.userProgress.demosCompleted.length > 0) {
            this.showProgressIndicator();
        }
    }

    showProgressIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'progress-momentum-indicator';
        indicator.className = 'progress-indicator';
        indicator.innerHTML = `
            <div class="progress-indicator-content" style="
                position: fixed;
                top: 100px;
                right: 2rem;
                background: rgba(26, 26, 26, 0.95);
                border: 1px solid rgba(200, 146, 42, 0.3);
                border-radius: 12px;
                padding: 1rem;
                min-width: 200px;
                backdrop-filter: blur(10px);
                z-index: 999;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            ">
                <div class="progress-header" style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 0.75rem;
                ">
                    <h4 style="
                        color: #C8922A;
                        margin: 0;
                        font-size: 0.9rem;
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                    ">
                        <span>🎯</span> Your Progress
                    </h4>
                    <button class="toggle-progress" style="
                        background: none;
                        border: none;
                        color: rgba(224, 224, 224, 0.6);
                        cursor: pointer;
                        font-size: 0.8rem;
                        padding: 0.25rem;
                    ">−</button>
                </div>
                
                <div class="progress-stats">
                    <div class="progress-item" style="
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 0.5rem;
                        font-size: 0.85rem;
                    ">
                        <span style="color: rgba(224, 224, 224, 0.8);">Demos completed:</span>
                        <span style="color: #4CAF50; font-weight: 600;">${this.userProgress.demosCompleted.length}</span>
                    </div>
                    
                    <div class="progress-item" style="
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 0.5rem;
                        font-size: 0.85rem;
                    ">
                        <span style="color: rgba(224, 224, 224, 0.8);">Tools explored:</span>
                        <span style="color: #2196F3; font-weight: 600;">${this.userProgress.toolsUsed.length}</span>
                    </div>
                    
                    <div class="progress-item" style="
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 0.75rem;
                        font-size: 0.85rem;
                    ">
                        <span style="color: rgba(224, 224, 224, 0.8);">Learning streak:</span>
                        <span style="color: #FFC107; font-weight: 600;">${this.getStreakDays()} days</span>
                    </div>
                    
                    ${this.getLatestAchievement()}
                    
                    <div class="progress-actions" style="margin-top: 0.75rem;">
                        <a href="/my-learning/" style="
                            display: block;
                            background: rgba(200, 146, 42, 0.15);
                            border: 1px solid rgba(200, 146, 42, 0.3);
                            color: #C8922A;
                            text-decoration: none;
                            padding: 0.5rem;
                            border-radius: 6px;
                            text-align: center;
                            font-size: 0.8rem;
                            font-weight: 600;
                            transition: all 0.3s ease;
                        ">Continue Learning</a>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(indicator);

        // Slide in after a moment
        setTimeout(() => {
            indicator.firstElementChild.style.transform = 'translateX(0)';
        }, 2000);

        // Toggle functionality
        indicator.querySelector('.toggle-progress').onclick = () => {
            const content = indicator.firstElementChild;
            const isExpanded = content.style.transform === 'translateX(0px)';
            
            if (isExpanded) {
                content.style.transform = 'translateX(calc(100% - 40px))';
                indicator.querySelector('.toggle-progress').textContent = '+';
            } else {
                content.style.transform = 'translateX(0)';
                indicator.querySelector('.toggle-progress').textContent = '−';
            }
        };
    }

    getLatestAchievement() {
        const achievements = this.userProgress.achievements || [];
        if (achievements.length === 0) return '';
        
        const latest = achievements[achievements.length - 1];
        return `
            <div class="latest-achievement" style="
                background: rgba(255, 193, 7, 0.1);
                border: 1px solid rgba(255, 193, 7, 0.3);
                border-radius: 6px;
                padding: 0.5rem;
                margin-bottom: 0.75rem;
            ">
                <div style="
                    font-size: 0.75rem;
                    color: rgba(255, 193, 7, 0.8);
                    margin-bottom: 0.25rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                ">Latest Achievement</div>
                <div style="
                    font-size: 0.8rem;
                    color: #FFC107;
                    font-weight: 600;
                ">${latest.icon} ${latest.name}</div>
            </div>
        `;
    }

    getStreakDays() {
        const lastVisit = this.userProgress.lastVisit;
        if (!lastVisit) return 0;
        
        const daysSinceLastVisit = Math.floor((Date.now() - lastVisit) / (1000 * 60 * 60 * 24));
        
        // If visited within last day, maintain streak
        if (daysSinceLastVisit <= 1) {
            return this.userProgress.streakDays || 1;
        }
        
        // Streak broken
        return 0;
    }

    trackDemo(demoId) {
        if (!this.userProgress.demosCompleted.includes(demoId)) {
            this.userProgress.demosCompleted.push(demoId);
            this.checkForAchievements();
            this.saveProgress();
            this.showMomentumBoost('Demo completed! 🎉');
        }
    }

    trackTool(toolId) {
        if (!this.userProgress.toolsUsed.includes(toolId)) {
            this.userProgress.toolsUsed.push(toolId);
            this.checkForAchievements();
            this.saveProgress();
            this.showMomentumBoost('New tool explored! 🛠️');
        }
    }

    trackPathStart(pathId) {
        if (!this.userProgress.pathsStarted.includes(pathId)) {
            this.userProgress.pathsStarted.push(pathId);
            this.checkForAchievements();
            this.saveProgress();
            this.showMomentumBoost(`Started ${pathId} path! 🚀`);
        }
    }

    checkForAchievements() {
        const achievements = [];
        
        // First demo achievement
        if (this.userProgress.demosCompleted.length === 1) {
            achievements.push({
                id: 'first-demo',
                name: 'First Steps',
                icon: '🌱',
                description: 'Completed your first demo!'
            });
        }
        
        // Explorer achievement
        if (this.userProgress.toolsUsed.length >= 3) {
            achievements.push({
                id: 'explorer',
                name: 'Bitcoin Explorer',
                icon: '🧭',
                description: 'Explored multiple Bitcoin tools'
            });
        }
        
        // Dedicated learner achievement
        if (this.userProgress.demosCompleted.length >= 5) {
            achievements.push({
                id: 'dedicated-learner',
                name: 'Dedicated Learner',
                icon: '📚',
                description: 'Completed 5+ demos'
            });
        }
        
        // Add new achievements
        achievements.forEach(achievement => {
            if (!this.userProgress.achievements.some(a => a.id === achievement.id)) {
                this.userProgress.achievements.push(achievement);
                this.showAchievementUnlock(achievement);
            }
        });
    }

    showAchievementUnlock(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.5);
                background: linear-gradient(135deg, rgba(255, 193, 7, 0.95), rgba(255, 152, 0, 0.95));
                border: 2px solid #FFC107;
                border-radius: 1rem;
                padding: 2rem;
                text-align: center;
                z-index: 3000;
                opacity: 0;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 15px 35px rgba(255, 193, 7, 0.4);
                backdrop-filter: blur(15px);
            ">
                <div style="font-size: 3rem; margin-bottom: 1rem;">${achievement.icon}</div>
                <h3 style="color: #1a1a1a; margin-bottom: 0.5rem; font-size: 1.5rem;">Achievement Unlocked!</h3>
                <h4 style="color: #1a1a1a; margin-bottom: 0.75rem; font-size: 1.2rem;">${achievement.name}</h4>
                <p style="color: rgba(26, 26, 26, 0.8); margin-bottom: 1.5rem;">${achievement.description}</p>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: rgba(26, 26, 26, 0.8);
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: 600;
                ">Awesome!</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.firstElementChild.style.transform = 'translate(-50%, -50%) scale(1)';
            notification.firstElementChild.style.opacity = '1';
        });

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.firstElementChild.style.transform = 'translate(-50%, -50%) scale(0.5)';
                notification.firstElementChild.style.opacity = '0';
                setTimeout(() => notification.remove(), 400);
            }
        }, 5000);
    }

    showMomentumBoost(message) {
        const boost = document.createElement('div');
        boost.className = 'momentum-boost';
        boost.innerHTML = `
            <div style="
                position: fixed;
                bottom: 2rem;
                left: 2rem;
                background: rgba(76, 175, 80, 0.95);
                border: 1px solid #4CAF50;
                border-radius: 25px;
                padding: 0.75rem 1.25rem;
                color: white;
                font-weight: 600;
                font-size: 0.9rem;
                z-index: 1001;
                transform: translateY(100px);
                opacity: 0;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
            ">${message}</div>
        `;

        document.body.appendChild(boost);

        // Animate in
        requestAnimationFrame(() => {
            boost.firstElementChild.style.transform = 'translateY(0)';
            boost.firstElementChild.style.opacity = '1';
        });

        // Auto-remove
        setTimeout(() => {
            boost.firstElementChild.style.transform = 'translateY(100px)';
            boost.firstElementChild.style.opacity = '0';
            setTimeout(() => boost.remove(), 300);
        }, 3000);
    }

    checkDailyStreak() {
        const lastVisit = this.userProgress.lastVisit;
        const now = Date.now();
        const oneDayMs = 1000 * 60 * 60 * 24;
        
        if (lastVisit) {
            const daysSince = Math.floor((now - lastVisit) / oneDayMs);
            
            if (daysSince === 1) {
                // Visited yesterday, increment streak
                this.userProgress.streakDays = (this.userProgress.streakDays || 1) + 1;
                this.showStreakContinuation();
            } else if (daysSince > 1) {
                // Streak broken
                this.userProgress.streakDays = 1;
            }
        } else {
            // First visit
            this.userProgress.streakDays = 1;
        }
    }

    showStreakContinuation() {
        const days = this.userProgress.streakDays;
        if (days > 1) {
            setTimeout(() => {
                this.showMomentumBoost(`🔥 ${days}-day learning streak!`);
            }, 1000);
        }
    }

    bindEvents() {
        // Listen for learning activity
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-track-demo]')) {
                this.trackDemo(e.target.dataset.trackDemo);
            }
            
            if (e.target.matches('[data-track-tool]')) {
                this.trackTool(e.target.dataset.trackTool);
            }
            
            if (e.target.matches('[data-track-path]')) {
                this.trackPathStart(e.target.dataset.trackPath);
            }
        });
    }

    showProgressOnReturn() {
        // Show encouraging message for returning users
        if (this.userProgress.lastVisit && this.userProgress.demosCompleted.length > 0) {
            setTimeout(() => {
                const daysSince = Math.floor((Date.now() - this.userProgress.lastVisit) / (1000 * 60 * 60 * 24));
                
                if (daysSince >= 7) {
                    this.showMomentumBoost("Welcome back! Ready to continue learning? 🎯");
                } else if (daysSince >= 1) {
                    this.showMomentumBoost("Great to see you again! 👋");
                }
            }, 3000);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.progressMomentum = new ProgressMomentum();
});

// Export for other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProgressMomentum;
}