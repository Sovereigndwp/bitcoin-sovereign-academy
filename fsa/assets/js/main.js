/**
 * FSA Platform - Main JavaScript
 * Handles global interactions and navigation
 */

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeButtons();
    initializeSmoothScroll();
});

/**
 * Navigation functionality
 */
function initializeNavigation() {
    // Mobile menu toggle (if needed in future)
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add shadow to header on scroll
        if (currentScroll > 0) {
            header.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });
}

/**
 * Button click handlers
 */
function initializeButtons() {
    // Get Started buttons
    const getStartedBtns = document.querySelectorAll('#get-started, #start-learning, #cta-start');
    getStartedBtns.forEach(btn => {
        btn.addEventListener('click', handleGetStarted);
    });
    
    // Take Assessment button
    const assessmentBtn = document.getElementById('take-assessment');
    if (assessmentBtn) {
        assessmentBtn.addEventListener('click', handleTakeAssessment);
    }
    
    // Path selection buttons
    const pathBtns = document.querySelectorAll('.path-card button');
    pathBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const pathCard = e.target.closest('.path-card');
            const pathType = pathCard.getAttribute('data-path');
            handlePathSelection(pathType);
        });
    });
}

/**
 * Smooth scrolling for anchor links
 */
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Handle Get Started action
 */
function handleGetStarted() {
    // Check if user has existing progress
    const userData = getUserData();
    
    if (userData && userData.currentModule) {
        // Resume learning
        window.location.href = `curriculum/modules/module-${userData.currentModule}/index.html`;
    } else {
        // New user - show persona selection
        showPersonaModal();
    }
}

/**
 * Handle Take Assessment action
 */
function handleTakeAssessment() {
    showPersonaModal();
}

/**
 * Handle path selection
 */
function handlePathSelection(pathType) {
    console.log('Selected path:', pathType);
    
    // Save persona selection
    saveUserData({
        persona: pathType,
        startDate: new Date().toISOString()
    });
    
    // Show confirmation and redirect
    showAlert('success', `Great choice! Starting your ${getPathName(pathType)} learning journey...`);
    
    setTimeout(() => {
        // Redirect to Module 1 (or persona-specific first module)
        const firstModule = getPersonaFirstModule(pathType);
        window.location.href = `curriculum/modules/module-${firstModule}/index.html`;
    }, 1500);
}

/**
 * Show persona selection modal
 */
function showPersonaModal() {
    // In a real implementation, this would show a modal
    // For now, scroll to paths section
    const pathsSection = document.getElementById('paths');
    if (pathsSection) {
        pathsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // Highlight path cards
        const pathCards = document.querySelectorAll('.path-card');
        pathCards.forEach(card => {
            card.style.animation = 'pulse 1s ease-in-out';
        });
    }
}

/**
 * Get persona display name
 */
function getPathName(pathType) {
    const names = {
        'debt-burdened': 'Debt Freedom Path',
        'fresh-graduate': 'Fresh Start Path',
        'mid-career': 'Wealth Building Path',
        'pre-retiree': 'Retirement Ready Path',
        'entrepreneur': 'Business Owner Path'
    };
    return names[pathType] || pathType;
}

/**
 * Get first module for persona
 */
function getPersonaFirstModule(pathType) {
    const firstModules = {
        'debt-burdened': '01',
        'fresh-graduate': '01',
        'mid-career': '07',
        'pre-retiree': '10',
        'entrepreneur': '01'
    };
    return firstModules[pathType] || '01';
}

/**
 * LocalStorage helper functions
 */
function getUserData() {
    const data = localStorage.getItem('fsa_user_data');
    return data ? JSON.parse(data) : null;
}

function saveUserData(data) {
    const existing = getUserData() || {};
    const updated = { ...existing, ...data };
    localStorage.setItem('fsa_user_data', JSON.stringify(updated));
}

/**
 * Show alert message
 */
function showAlert(type, message) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alert.style.position = 'fixed';
    alert.style.top = '80px';
    alert.style.left = '50%';
    alert.style.transform = 'translateX(-50%)';
    alert.style.zIndex = '1000';
    alert.style.minWidth = '300px';
    alert.style.textAlign = 'center';
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.style.transition = 'opacity 0.3s';
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 300);
    }, 3000);
}

/**
 * Utility: Format currency
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

/**
 * Utility: Format percentage
 */
function formatPercentage(value) {
    return `${(value * 100).toFixed(1)}%`;
}

/**
 * Utility: Calculate percentage
 */
function calculatePercentage(part, whole) {
    return whole === 0 ? 0 : (part / whole) * 100;
}

// Export for use in other modules
window.FSA = {
    getUserData,
    saveUserData,
    showAlert,
    formatCurrency,
    formatPercentage,
    calculatePercentage
};