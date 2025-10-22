/**
 * News Ticker Widget
 * Displays scrolling Bitcoin news and updates
 * Version: 1.0.0
 */

class NewsTicker {
    constructor(options = {}) {
        // Configuration
        this.config = {
            container: options.container || '#news-ticker',
            items: options.items || this.getDefaultNews(),
            speed: options.speed || 50, // pixels per second
            pauseOnHover: options.pauseOnHover !== false,
            showIcons: options.showIcons !== false,
            autoStart: options.autoStart !== false,
            direction: options.direction || 'left', // 'left' or 'right'
            loop: options.loop !== false,
            onItemClick: options.onItemClick || null
        };

        // State
        this.isRunning = false;
        this.isPaused = false;
        this.animationId = null;
        this.currentPosition = 0;

        // Initialize
        this.init();
    }

    /**
     * Get default news items
     */
    getDefaultNews() {
        return [
            { icon: '🧱', text: 'Bitcoin block height continues to grow', category: 'network' },
            { icon: '⚡', text: 'Lightning Network capacity expanding globally', category: 'lightning' },
            { icon: '🌍', text: 'Institutions increasing Bitcoin adoption', category: 'adoption' },
            { icon: '💎', text: '21 million Bitcoin cap ensures scarcity', category: 'fundamentals' },
            { icon: '🔐', text: 'Self-custody: Not your keys, not your coins', category: 'security' },
            { icon: '📈', text: 'Bitcoin dominance remains strong', category: 'market' },
            { icon: '⛏️', text: 'Mining difficulty adjusts every 2016 blocks', category: 'mining' },
            { icon: '🌟', text: 'Start your Bitcoin sovereignty journey today', category: 'education' }
        ];
    }

    /**
     * Initialize the ticker
     */
    init() {
        this.container = document.querySelector(this.config.container);

        if (!this.container) {
            console.error(`Container ${this.config.container} not found`);
            return;
        }

        // Render ticker
        this.render();

        // Add event listeners
        this.attachEventListeners();

        // Auto-start if configured
        if (this.config.autoStart) {
            this.start();
        }
    }

    /**
     * Render the ticker
     */
    render() {
        // Create ticker HTML
        const tickerContent = this.config.items.map((item, index) => 
            this.renderNewsItem(item, index)
        ).join(' • ');

        // Duplicate content for seamless loop
        const duplicatedContent = tickerContent + ' • ' + tickerContent;

        this.container.innerHTML = `
            <div class="news-ticker-widget">
                <div class="ticker-wrapper">
                    <div class="ticker-content" id="ticker-content-${Date.now()}">
                        ${duplicatedContent}
                    </div>
                </div>
            </div>
        `;

        this.contentElement = this.container.querySelector('.ticker-content');
        this.wrapperElement = this.container.querySelector('.ticker-wrapper');
    }

    /**
     * Render a single news item
     */
    renderNewsItem(item, index) {
        const icon = this.config.showIcons && item.icon ? item.icon : '';
        const category = item.category ? `category-${item.category}` : '';
        
        return `
            <span class="ticker-item ${category}" data-index="${index}">
                ${icon ? `<span class="ticker-icon">${icon}</span>` : ''}
                <span class="ticker-text">${item.text}</span>
            </span>
        `;
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        if (this.config.pauseOnHover) {
            this.container.addEventListener('mouseenter', () => this.pause());
            this.container.addEventListener('mouseleave', () => this.resume());
        }

        if (this.config.onItemClick) {
            this.container.addEventListener('click', (e) => {
                const item = e.target.closest('.ticker-item');
                if (item) {
                    const index = parseInt(item.dataset.index);
                    this.config.onItemClick(this.config.items[index], index);
                }
            });
        }
    }

    /**
     * Start the ticker animation
     */
    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.isPaused = false;
        this.animate();
    }

    /**
     * Stop the ticker animation
     */
    stop() {
        this.isRunning = false;
        this.isPaused = false;
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    /**
     * Pause the ticker animation
     */
    pause() {
        if (!this.isRunning) return;
        this.isPaused = true;
    }

    /**
     * Resume the ticker animation
     */
    resume() {
        if (!this.isRunning) return;
        this.isPaused = false;
        if (!this.animationId) {
            this.animate();
        }
    }

    /**
     * Animate the ticker
     */
    animate() {
        if (!this.isRunning || this.isPaused) {
            this.animationId = null;
            return;
        }

        const contentWidth = this.contentElement.scrollWidth / 2; // Divided by 2 because content is duplicated
        const wrapperWidth = this.wrapperElement.clientWidth;

        // Update position
        if (this.config.direction === 'left') {
            this.currentPosition -= this.config.speed / 60; // Adjust for ~60fps
            
            // Reset position for seamless loop
            if (Math.abs(this.currentPosition) >= contentWidth) {
                this.currentPosition = 0;
            }
        } else {
            this.currentPosition += this.config.speed / 60;
            
            // Reset position for seamless loop
            if (this.currentPosition >= 0) {
                this.currentPosition = -contentWidth;
            }
        }

        // Apply transform
        this.contentElement.style.transform = `translateX(${this.currentPosition}px)`;

        // Continue animation
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    /**
     * Update news items
     */
    updateItems(newItems) {
        this.config.items = newItems;
        
        // Store current state
        const wasRunning = this.isRunning;
        
        // Stop animation
        this.stop();
        
        // Re-render
        this.render();
        this.attachEventListeners();
        
        // Restart if it was running
        if (wasRunning) {
            this.start();
        }
    }

    /**
     * Add a news item
     */
    addItem(item) {
        this.config.items.push(item);
        this.updateItems(this.config.items);
    }

    /**
     * Remove a news item by index
     */
    removeItem(index) {
        if (index >= 0 && index < this.config.items.length) {
            this.config.items.splice(index, 1);
            this.updateItems(this.config.items);
        }
    }

    /**
     * Update configuration
     */
    updateConfig(newConfig) {
        const wasRunning = this.isRunning;
        
        this.config = { ...this.config, ...newConfig };
        
        if (wasRunning) {
            this.stop();
        }
        
        this.render();
        this.attachEventListeners();
        
        if (wasRunning || this.config.autoStart) {
            this.start();
        }
    }

    /**
     * Get current items
     */
    getItems() {
        return this.config.items;
    }

    /**
     * Destroy ticker
     */
    destroy() {
        this.stop();
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NewsTicker;
}

// Make available globally if in browser
if (typeof window !== 'undefined') {
    window.NewsTicker = NewsTicker;
}
