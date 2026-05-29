/**
 * Mobile Menu Functionality - Bitcoin Sovereign Academy
 * Handles mobile navigation menu toggle and accessibility
 */

(function() {
    'use strict';
    
    let mobileMenuButton;
    let navMenu;
    let isMenuOpen = false;

    function insertProductsDropdown() {
        const navList = document.getElementById('nav-links-list');
        if (!navList || document.getElementById('dd-products')) return;

        const productsDropdown = document.createElement('li');
        productsDropdown.className = 'nav-dropdown';
        productsDropdown.id = 'dd-products';
        productsDropdown.innerHTML = `
            <a href="/products/self-custody-starter-kit/" class="nav-link" aria-haspopup="true" aria-expanded="false">Products <span class="caret" aria-hidden="true">▼</span></a>
            <div class="dropdown-menu">
                <a href="/products/self-custody-starter-kit/"><span class="dd-icon">🔐</span><span class="dd-label">Self-Custody Starter Kit</span><span class="dd-badge">$49</span></a>
                <a href="/products/family-bitcoin-recovery-kit/"><span class="dd-icon">🏠</span><span class="dd-label">Family Recovery Kit</span><span class="dd-badge">$149</span></a>
                <a href="/products/advisor-bitcoin-client-kit/"><span class="dd-icon">💼</span><span class="dd-label">Continuity Operational Packet</span><span class="dd-badge">$499</span></a>
            </div>
        `;

        const pathsDropdown = document.getElementById('dd-paths');
        const institutionalDropdown = document.getElementById('dd-institutional');
        navList.insertBefore(productsDropdown, pathsDropdown || institutionalDropdown || null);
    }
    
    function initMobileMenu() {
        insertProductsDropdown();

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
        setupMenuItemClose();
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
            const trigger = dropdown.querySelector('.nav-link');
            if (trigger) trigger.setAttribute('aria-expanded', 'false');
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
                                const otherTrigger = otherDropdown.querySelector('.nav-link');
                                if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
                            }
                        });
                        
                        // Toggle current dropdown
                        const willOpen = !dropdown.classList.contains('open');
                        dropdown.classList.toggle('open', willOpen);
                        trigger.setAttribute('aria-expanded', String(willOpen));
                    }
                });
            }
        });
    }

    function setupMenuItemClose() {
        const menuLinks = navMenu.querySelectorAll('.dropdown-menu a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) closeMenu();
            });
        });
    }
    
    // Focus trap for mobile menu accessibility
    function setupFocusTrap() {
        if (!navMenu) return;

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