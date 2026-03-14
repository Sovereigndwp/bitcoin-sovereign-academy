/**
 * Mobile Menu Functionality - Bitcoin Sovereign Academy
 * Handles mobile navigation menu toggle and accessibility
 */

(function() {
    'use strict';
    
    let mobileMenuButton;
    let navMenu;
    let isMenuOpen = false;
    
    function initMobileMenu() {
        mobileMenuButton = document.getElementById('mobileMenu');
        navMenu = document.getElementById('nav-links-list');
        
        if (!mobileMenuButton || !navMenu) {
            console.warn('Mobile menu elements not found');
            return;
        }
        
        // Add click event listener
        mobileMenuButton.addEventListener('click', toggleMenu);
        
        // Add keyboard event listener
        mobileMenuButton.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (isMenuOpen && 
                !navMenu.contains(e.target) && 
                !mobileMenuButton.contains(e.target)) {
                closeMenu();
            }
        });
        
        // Close menu when pressing escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isMenuOpen) {
                closeMenu();
                mobileMenuButton.focus();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && isMenuOpen) {
                closeMenu();
            }
        });
        
        // Handle dropdown toggles on mobile
        setupMobileDropdowns();
    }
    
    function toggleMenu() {
        if (isMenuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }
    
    function openMenu() {
        isMenuOpen = true;
        navMenu.classList.add('active');
        mobileMenuButton.setAttribute('aria-expanded', 'true');
        mobileMenuButton.classList.add('active');
        
        // Focus the first link in the menu
        const firstLink = navMenu.querySelector('a');
        if (firstLink) {
            setTimeout(() => firstLink.focus(), 100);
        }
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = 'hidden';
    }
    
    function closeMenu() {
        isMenuOpen = false;
        navMenu.classList.remove('active');
        mobileMenuButton.setAttribute('aria-expanded', 'false');
        mobileMenuButton.classList.remove('active');
        
        // Close all open dropdowns
        const openDropdowns = navMenu.querySelectorAll('.nav-dropdown.open');
        openDropdowns.forEach(dropdown => {
            dropdown.classList.remove('open');
        });
        
        // Restore body scroll
        document.body.style.overflow = '';
    }
    
    function setupMobileDropdowns() {
        const dropdowns = navMenu.querySelectorAll('.nav-dropdown');
        
        dropdowns.forEach(dropdown => {
            const trigger = dropdown.querySelector('.nav-link');
            
            if (trigger) {
                trigger.addEventListener('click', function(e) {
                    // Only handle dropdown behavior on mobile
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        
                        // Close other dropdowns
                        dropdowns.forEach(otherDropdown => {
                            if (otherDropdown !== dropdown) {
                                otherDropdown.classList.remove('open');
                            }
                        });
                        
                        // Toggle current dropdown
                        dropdown.classList.toggle('open');
                    }
                });
            }
        });
    }
    
    // Focus trap for mobile menu accessibility
    function setupFocusTrap() {
        const focusableElements = navMenu.querySelectorAll(
            'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        navMenu.addEventListener('keydown', function(e) {
            if (!isMenuOpen) return;
            
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    // Shift + Tab
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    // Tab
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }
    
    // Initialize when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileMenu);
    } else {
        initMobileMenu();
    }
    
    // Also setup focus trap after init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupFocusTrap);
    } else {
        setupFocusTrap();
    }
})();