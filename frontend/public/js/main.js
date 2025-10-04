/**
 * Bitcoin Sovereign Academy - Mobile Interactions
 * Touch gestures, mobile navigation, and PWA functionality
 */

class MobileExperience {
    constructor() {
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.isMenuOpen = false;
        this.isPullRefresh = false;
        this.deferredPrompt = null;
        
        this.init();
    }

    init() {
        this.setupMobileNav();
        this.setupTouchGestures();
        this.setupSwipeCards();
        this.setupBottomSheets();
        this.setupPullToRefresh();
        this.setupPWA();
        this.setupFloatingActionButton();
        this.optimizePerformance();
        this.detectDevice();
    }

    // ============================================================================
    // MOBILE NAVIGATION
    // ============================================================================
    
    setupMobileNav() {
        const hamburger = document.querySelector('.hamburger');
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileMenuItems = document.querySelectorAll('.mobile-menu-item');
        
        if (hamburger) {
            hamburger.addEventListener('click', () => {
                this.toggleMenu();
            });
            
            // Add touch feedback
            hamburger.addEventListener('touchstart', () => {
                hamburger.classList.add('active-touch');
            });
            
            hamburger.addEventListener('touchend', () => {
                setTimeout(() => {
                    hamburger.classList.remove('active-touch');
                }, 300);
            });
        }
        
        // Close menu when clicking menu items
        mobileMenuItems.forEach(item => {
            item.addEventListener('click', () => {
                this.closeMenu();
            });
        });
        
        // Close menu on swipe up
        if (mobileMenu) {
            this.addSwipeListener(mobileMenu, (direction) => {
                if (direction === 'up' || direction === 'left') {
                    this.closeMenu();
                }
            });
        }
    }
    
    toggleMenu() {
        const hamburger = document.querySelector('.hamburger');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        this.isMenuOpen = !this.isMenuOpen;
        
        if (hamburger) {
            hamburger.classList.toggle('active');
        }
        
        if (mobileMenu) {
            mobileMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (this.isMenuOpen) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }
        
        // Haptic feedback on supported devices
        if ('vibrate' in navigator) {
            navigator.vibrate(10);
        }
    }
    
    closeMenu() {
        const hamburger = document.querySelector('.hamburger');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        this.isMenuOpen = false;
        
        if (hamburger) {
            hamburger.classList.remove('active');
        }
        
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
        }
        
        document.body.style.overflow = '';
    }

    // ============================================================================
    // TOUCH GESTURES
    // ============================================================================
    
    setupTouchGestures() {
        // Add touch event listeners to the document
        document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
        document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
        
        // Add touch feedback to all interactive elements
        this.addTouchFeedback();
        
        // Handle long press for context menus
        this.setupLongPress();
        
        // Pinch to zoom for images
        this.setupPinchZoom();
    }
    
    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
        
        // Check for pull to refresh
        if (window.scrollY === 0) {
            this.isPullRefresh = true;
        }
    }
    
    handleTouchMove(e) {
        if (!this.touchStartX || !this.touchStartY) {
            return;
        }
        
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        
        // Pull to refresh logic
        if (this.isPullRefresh && currentY > this.touchStartY + 50) {
            const pullDistance = currentY - this.touchStartY;
            this.showPullToRefresh(pullDistance);
        }
        
        // Prevent horizontal scroll
        const diffX = Math.abs(currentX - this.touchStartX);
        const diffY = Math.abs(currentY - this.touchStartY);
        
        if (diffX > diffY && diffX > 10) {
            e.preventDefault();
        }
    }
    
    handleTouchEnd(e) {
        this.touchEndX = e.changedTouches[0].clientX;
        this.touchEndY = e.changedTouches[0].clientY;
        
        // Detect swipe
        this.detectSwipe();
        
        // Reset pull to refresh
        if (this.isPullRefresh) {
            this.hidePullToRefresh();
            this.isPullRefresh = false;
        }
        
        // Reset touch coordinates
        this.touchStartX = 0;
        this.touchStartY = 0;
    }
    
    detectSwipe() {
        const diffX = this.touchEndX - this.touchStartX;
        const diffY = this.touchEndY - this.touchStartY;
        const threshold = 50;
        
        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Horizontal swipe
            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    this.onSwipeRight();
                } else {
                    this.onSwipeLeft();
                }
            }
        } else {
            // Vertical swipe
            if (Math.abs(diffY) > threshold) {
                if (diffY > 0) {
                    this.onSwipeDown();
                } else {
                    this.onSwipeUp();
                }
            }
        }
    }
    
    onSwipeLeft() {
        // Navigate to next section or close menu
        if (this.isMenuOpen) {
            this.closeMenu();
        }
    }
    
    onSwipeRight() {
        // Navigate to previous section or open menu
        if (!this.isMenuOpen && this.touchStartX < 50) {
            this.toggleMenu();
        }
    }
    
    onSwipeUp() {
        // Scroll to next section
        const sections = document.querySelectorAll('section');
        const currentSection = this.getCurrentSection();
        if (currentSection < sections.length - 1) {
            sections[currentSection + 1].scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    onSwipeDown() {
        // Scroll to previous section
        const sections = document.querySelectorAll('section');
        const currentSection = this.getCurrentSection();
        if (currentSection > 0) {
            sections[currentSection - 1].scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    getCurrentSection() {
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            
            if (scrollPosition >= top && scrollPosition <= bottom) {
                return i;
            }
        }
        
        return 0;
    }
    
    addSwipeListener(element, callback) {
        let startX = 0;
        let startY = 0;
        
        element.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        element.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const diffX = endX - startX;
            const diffY = endY - startY;
            
            if (Math.abs(diffX) > Math.abs(diffY)) {
                callback(diffX > 0 ? 'right' : 'left');
            } else {
                callback(diffY > 0 ? 'down' : 'up');
            }
        }, { passive: true });
    }

    // ============================================================================
    // TOUCH FEEDBACK
    // ============================================================================
    
    addTouchFeedback() {
        const touchElements = document.querySelectorAll('.touch-card, .mobile-btn, .nav-card, button, a');
        
        touchElements.forEach(element => {
            element.addEventListener('touchstart', () => {
                element.classList.add('touch-active');
            }, { passive: true });
            
            element.addEventListener('touchend', () => {
                setTimeout(() => {
                    element.classList.remove('touch-active');
                }, 300);
            }, { passive: true });
            
            element.addEventListener('touchcancel', () => {
                element.classList.remove('touch-active');
            }, { passive: true });
        });
    }
    
    setupLongPress() {
        const longPressElements = document.querySelectorAll('[data-long-press]');
        
        longPressElements.forEach(element => {
            let pressTimer;
            
            element.addEventListener('touchstart', (e) => {
                pressTimer = setTimeout(() => {
                    this.onLongPress(element);
                    if ('vibrate' in navigator) {
                        navigator.vibrate(50);
                    }
                }, 500);
            }, { passive: true });
            
            element.addEventListener('touchend', () => {
                clearTimeout(pressTimer);
            }, { passive: true });
            
            element.addEventListener('touchmove', () => {
                clearTimeout(pressTimer);
            }, { passive: true });
        });
    }
    
    onLongPress(element) {
        const action = element.dataset.longPress;
        
        switch(action) {
            case 'copy':
                this.copyToClipboard(element.textContent);
                break;
            case 'share':
                this.shareContent(element);
                break;
            case 'info':
                this.showInfo(element);
                break;
        }
    }
    
    setupPinchZoom() {
        const zoomableImages = document.querySelectorAll('.zoomable');
        
        zoomableImages.forEach(img => {
            let initialDistance = 0;
            let currentScale = 1;
            
            img.addEventListener('touchstart', (e) => {
                if (e.touches.length === 2) {
                    initialDistance = this.getDistance(e.touches[0], e.touches[1]);
                }
            }, { passive: true });
            
            img.addEventListener('touchmove', (e) => {
                if (e.touches.length === 2) {
                    e.preventDefault();
                    const currentDistance = this.getDistance(e.touches[0], e.touches[1]);
                    const scale = currentDistance / initialDistance;
                    currentScale = Math.min(Math.max(1, scale), 3);
                    img.style.transform = `scale(${currentScale})`;
                }
            }, { passive: false });
            
            img.addEventListener('touchend', () => {
                if (currentScale === 1) {
                    img.style.transform = '';
                }
            }, { passive: true });
        });
    }
    
    getDistance(touch1, touch2) {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // ============================================================================
    // SWIPEABLE CARDS
    // ============================================================================
    
    setupSwipeCards() {
        const swipeContainers = document.querySelectorAll('.swipe-container');
        
        swipeContainers.forEach(container => {
            // Add scroll indicators
            this.addScrollIndicators(container);
            
            // Handle scroll snap
            container.addEventListener('scroll', () => {
                this.updateScrollIndicators(container);
            });
            
            // Add momentum scrolling
            this.addMomentumScrolling(container);
        });
    }
    
    addScrollIndicators(container) {
        const indicator = document.createElement('div');
        indicator.className = 'scroll-indicators';
        
        const cards = container.querySelectorAll('.swipe-card');
        cards.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.className = 'indicator-dot';
            if (index === 0) dot.classList.add('active');
            indicator.appendChild(dot);
        });
        
        container.parentNode.insertBefore(indicator, container.nextSibling);
    }
    
    updateScrollIndicators(container) {
        const cards = container.querySelectorAll('.swipe-card');
        const indicators = container.parentNode.querySelector('.scroll-indicators');
        
        if (!indicators) return;
        
        const scrollLeft = container.scrollLeft;
        const cardWidth = cards[0].offsetWidth;
        const activeIndex = Math.round(scrollLeft / cardWidth);
        
        indicators.querySelectorAll('.indicator-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === activeIndex);
        });
    }
    
    addMomentumScrolling(container) {
        let isScrolling;
        let startX;
        let scrollLeft;
        
        container.addEventListener('touchstart', (e) => {
            isScrolling = true;
            startX = e.touches[0].pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        }, { passive: true });
        
        container.addEventListener('touchmove', (e) => {
            if (!isScrolling) return;
            const x = e.touches[0].pageX - container.offsetLeft;
            const walk = (x - startX) * 2;
            container.scrollLeft = scrollLeft - walk;
        }, { passive: true });
        
        container.addEventListener('touchend', () => {
            isScrolling = false;
        }, { passive: true });
    }

    // ============================================================================
    // BOTTOM SHEETS
    // ============================================================================
    
    setupBottomSheets() {
        const bottomSheets = document.querySelectorAll('.bottom-sheet');
        
        bottomSheets.forEach(sheet => {
            const handle = sheet.querySelector('.sheet-handle');
            
            if (handle) {
                this.makeSheetDraggable(sheet, handle);
            }
            
            // Close on background click
            sheet.addEventListener('click', (e) => {
                if (e.target === sheet) {
                    this.closeBottomSheet(sheet);
                }
            });
        });
    }
    
    makeSheetDraggable(sheet, handle) {
        let startY = 0;
        let currentY = 0;
        let isDragging = false;
        
        handle.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
            isDragging = true;
            sheet.style.transition = 'none';
        }, { passive: true });
        
        handle.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            currentY = e.touches[0].clientY;
            const deltaY = currentY - startY;
            
            if (deltaY > 0) {
                sheet.style.transform = `translateY(${deltaY}px)`;
            }
        }, { passive: true });
        
        handle.addEventListener('touchend', () => {
            isDragging = false;
            sheet.style.transition = '';
            
            const deltaY = currentY - startY;
            
            if (deltaY > 100) {
                this.closeBottomSheet(sheet);
            } else {
                sheet.style.transform = '';
            }
        }, { passive: true });
    }
    
    openBottomSheet(sheetId) {
        const sheet = document.querySelector(`#${sheetId}`);
        if (sheet) {
            sheet.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    closeBottomSheet(sheet) {
        sheet.classList.remove('active');
        sheet.style.transform = '';
        document.body.style.overflow = '';
    }

    // ============================================================================
    // PULL TO REFRESH
    // ============================================================================
    
    setupPullToRefresh() {
        const refreshIndicator = document.createElement('div');
        refreshIndicator.className = 'pull-to-refresh';
        refreshIndicator.innerHTML = '↻';
        document.body.appendChild(refreshIndicator);
        
        this.refreshIndicator = refreshIndicator;
    }
    
    showPullToRefresh(distance) {
        if (!this.refreshIndicator) return;
        
        const maxPull = 150;
        const pullPercentage = Math.min(distance / maxPull, 1);
        
        this.refreshIndicator.classList.add('visible');
        this.refreshIndicator.style.transform = 
            `translateX(-50%) rotate(${pullPercentage * 360}deg)`;
        
        if (pullPercentage === 1) {
            this.refreshIndicator.classList.add('refreshing');
            this.performRefresh();
        }
    }
    
    hidePullToRefresh() {
        if (!this.refreshIndicator) return;
        
        this.refreshIndicator.classList.remove('visible', 'refreshing');
        this.refreshIndicator.style.transform = 'translateX(-50%)';
    }
    
    performRefresh() {
        // Haptic feedback
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
        
        // Simulate refresh
        setTimeout(() => {
            location.reload();
        }, 1000);
    }

    // ============================================================================
    // PWA FEATURES
    // ============================================================================
    
    setupPWA() {
        // Handle install prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallPrompt();
        });
        
        // Register service worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registered:', registration);
                })
                .catch(error => {
                    console.error('Service Worker registration failed:', error);
                });
        }
        
        // Handle app installed
        window.addEventListener('appinstalled', () => {
            console.log('PWA installed');
            this.hideInstallPrompt();
        });
        
        // Check if running as PWA
        if (window.matchMedia('(display-mode: standalone)').matches) {
            document.body.classList.add('pwa-mode');
        }
    }
    
    showInstallPrompt() {
        const promptElement = document.createElement('div');
        promptElement.className = 'pwa-install-prompt';
        promptElement.innerHTML = `
            <div class="pwa-install-content">
                <div class="pwa-install-icon">₿</div>
                <div class="pwa-install-text">
                    <h3>Install Bitcoin Sovereign Academy</h3>
                    <p>Add to your home screen for the best experience</p>
                </div>
            </div>
            <div class="pwa-install-buttons">
                <button class="pwa-install-btn primary" onclick="mobileExp.installPWA()">Install</button>
                <button class="pwa-install-btn secondary" onclick="mobileExp.hideInstallPrompt()">Not Now</button>
            </div>
        `;
        
        document.body.appendChild(promptElement);
        
        setTimeout(() => {
            promptElement.classList.add('show');
        }, 100);
    }
    
    hideInstallPrompt() {
        const prompt = document.querySelector('.pwa-install-prompt');
        if (prompt) {
            prompt.classList.remove('show');
            setTimeout(() => {
                prompt.remove();
            }, 300);
        }
    }
    
    async installPWA() {
        if (!this.deferredPrompt) return;
        
        this.deferredPrompt.prompt();
        const result = await this.deferredPrompt.userChoice;
        
        console.log('Install prompt result:', result);
        
        if (result.outcome === 'accepted') {
            console.log('User accepted the install prompt');
        }
        
        this.deferredPrompt = null;
        this.hideInstallPrompt();
    }

    // ============================================================================
    // FLOATING ACTION BUTTON
    // ============================================================================
    
    setupFloatingActionButton() {
        const fab = document.createElement('button');
        fab.className = 'fab';
        fab.innerHTML = '<span class="fab-icon">+</span>';
        
        fab.addEventListener('click', () => {
            this.showFabMenu();
        });
        
        document.body.appendChild(fab);
        
        // Hide FAB on scroll down, show on scroll up
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;
            
            if (currentScroll > lastScroll && currentScroll > 100) {
                fab.style.transform = 'translateY(100px)';
            } else {
                fab.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        });
    }
    
    showFabMenu() {
        const menu = document.createElement('div');
        menu.className = 'fab-menu';
        menu.innerHTML = `
            <button class="fab-menu-item" data-action="learn">📚 Learn</button>
            <button class="fab-menu-item" data-action="tools">🛠 Tools</button>
            <button class="fab-menu-item" data-action="agents">🤖 AI Agents</button>
            <button class="fab-menu-item" data-action="help">❓ Help</button>
        `;
        
        document.body.appendChild(menu);
        
        menu.querySelectorAll('.fab-menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.handleFabAction(action);
                menu.remove();
            });
        });
        
        // Close menu on outside click
        setTimeout(() => {
            document.addEventListener('click', function closeMenu(e) {
                if (!menu.contains(e.target)) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            });
        }, 100);
    }
    
    handleFabAction(action) {
        switch(action) {
            case 'learn':
                window.location.href = '#learning';
                break;
            case 'tools':
                window.location.href = '#tools';
                break;
            case 'agents':
                window.location.href = '#ai-agents';
                break;
            case 'help':
                this.showHelp();
                break;
        }
    }

    // ============================================================================
    // PERFORMANCE OPTIMIZATIONS
    // ============================================================================
    
    optimizePerformance() {
        // Lazy load images
        this.setupLazyLoading();
        
        // Debounce scroll events
        this.debounceScroll();
        
        // Optimize animations
        this.optimizeAnimations();
        
        // Preload critical resources
        this.preloadResources();
    }
    
    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    debounceScroll() {
        let scrollTimer;
        
        window.addEventListener('scroll', () => {
            document.body.classList.add('scrolling');
            
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                document.body.classList.remove('scrolling');
            }, 150);
        });
    }
    
    optimizeAnimations() {
        // Reduce animations on low-end devices
        if (this.isLowEndDevice()) {
            document.body.classList.add('reduce-animations');
        }
        
        // Pause animations when not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                document.body.classList.add('pause-animations');
            } else {
                document.body.classList.remove('pause-animations');
            }
        });
    }
    
    preloadResources() {
        const criticalResources = [
            '/fonts/bitcoin-font.woff2',
            '/images/bitcoin-logo.svg',
            '/css/critical.css'
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            
            if (resource.endsWith('.woff2')) {
                link.as = 'font';
                link.crossOrigin = 'anonymous';
            } else if (resource.endsWith('.css')) {
                link.as = 'style';
            } else {
                link.as = 'image';
            }
            
            document.head.appendChild(link);
        });
    }

    // ============================================================================
    // DEVICE DETECTION
    // ============================================================================
    
    detectDevice() {
        const userAgent = navigator.userAgent.toLowerCase();
        
        this.device = {
            ios: /iphone|ipad|ipod/.test(userAgent),
            android: /android/.test(userAgent),
            mobile: /mobile/.test(userAgent),
            tablet: /tablet|ipad/.test(userAgent),
            desktop: !(/mobile|tablet/.test(userAgent))
        };
        
        // Add device class to body
        if (this.device.ios) document.body.classList.add('ios');
        if (this.device.android) document.body.classList.add('android');
        if (this.device.mobile) document.body.classList.add('mobile');
        if (this.device.tablet) document.body.classList.add('tablet');
        if (this.device.desktop) document.body.classList.add('desktop');
        
        // Detect connection speed
        this.detectConnectionSpeed();
        
        // Detect battery level
        this.detectBatteryLevel();
    }
    
    isLowEndDevice() {
        // Check for low-end device indicators
        const memory = navigator.deviceMemory || 4;
        const cores = navigator.hardwareConcurrency || 4;
        const connection = navigator.connection;
        
        return memory < 4 || cores < 4 || 
               (connection && connection.effectiveType === '2g');
    }
    
    detectConnectionSpeed() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            
            connection.addEventListener('change', () => {
                this.updateConnectionUI(connection.effectiveType);
            });
            
            this.updateConnectionUI(connection.effectiveType);
        }
    }
    
    updateConnectionUI(connectionType) {
        document.body.classList.remove('connection-slow', 'connection-fast');
        
        if (connectionType === '2g' || connectionType === 'slow-2g') {
            document.body.classList.add('connection-slow');
            this.showNotification('Slow connection detected. Some features may be limited.');
        } else if (connectionType === '4g') {
            document.body.classList.add('connection-fast');
        }
    }
    
    async detectBatteryLevel() {
        if ('getBattery' in navigator) {
            try {
                const battery = await navigator.getBattery();
                
                battery.addEventListener('levelchange', () => {
                    this.updateBatteryUI(battery.level);
                });
                
                this.updateBatteryUI(battery.level);
            } catch (error) {
                console.error('Battery API error:', error);
            }
        }
    }
    
    updateBatteryUI(level) {
        if (level < 0.15) {
            document.body.classList.add('low-battery');
            this.showNotification('Low battery detected. Power saving mode activated.');
        } else {
            document.body.classList.remove('low-battery');
        }
    }

    // ============================================================================
    // UTILITY METHODS
    // ============================================================================
    
    copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                this.showNotification('Copied to clipboard!');
            });
        }
    }
    
    async shareContent(element) {
        const shareData = {
            title: 'Bitcoin Sovereign Academy',
            text: element.textContent,
            url: window.location.href
        };
        
        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                console.error('Share failed:', error);
            }
        }
    }
    
    showInfo(element) {
        const info = element.dataset.info || 'No additional information available';
        this.showNotification(info);
    }
    
    showHelp() {
        const helpSheet = document.createElement('div');
        helpSheet.className = 'bottom-sheet help-sheet';
        helpSheet.innerHTML = `
            <div class="sheet-handle"></div>
            <h3>Help & Support</h3>
            <ul>
                <li>Swipe right from left edge to open menu</li>
                <li>Swipe left/right on cards to navigate</li>
                <li>Pull down to refresh</li>
                <li>Long press to copy text</li>
                <li>Pinch to zoom on images</li>
            </ul>
            <button class="mobile-btn" onclick="mobileExp.closeBottomSheet(this.parentElement)">Got it!</button>
        `;
        
        document.body.appendChild(helpSheet);
        
        setTimeout(() => {
            helpSheet.classList.add('active');
        }, 100);
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'mobile-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--bitcoin-orange);
            color: white;
            padding: 1rem 2rem;
            border-radius: 25px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideUp 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideDown 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }
}

// Initialize mobile experience when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.mobileExp = new MobileExperience();
    });
} else {
    window.mobileExp = new MobileExperience();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileExperience;
}