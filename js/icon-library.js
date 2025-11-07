/**
 * Bitcoin Sovereign Academy - Animated SVG Icon Library
 * Replaces static emojis with scalable, animated SVG icons
 */

const IconLibrary = {
    /**
     * Get an SVG icon by name with optional size and animation
     * @param {string} name - Icon name (e.g., 'game', 'clock', 'money')
     * @param {number} size - Size in pixels (default: 24)
     * @param {boolean} animate - Whether to animate the icon (default: true)
     * @returns {string} SVG HTML string
     */
    get(name, size = 24, animate = true) {
        const icon = this.icons[name];
        if (!icon) {
            console.warn(`Icon "${name}" not found in library`);
            return '';
        }
        return icon(size, animate);
    },

    /**
     * Replace emoji in text with SVG icon
     * @param {string} text - Text containing emoji
     * @returns {string} HTML with SVG icons
     */
    replaceEmoji(text) {
        const emojiMap = {
            '🎮': 'game',
            '⏰': 'clock',
            '💰': 'money',
            '🔐': 'lock',
            '🎯': 'target',
            '📚': 'books',
            '🌍': 'globe',
            '🔧': 'tool',
            '🏛️': 'institution',
            '💡': 'lightbulb',
            '🎓': 'graduation',
            '📖': 'book',
            '🧭': 'compass',
            '🎪': 'tent',
            '🤖': 'robot',
            '✨': 'sparkles',
            '🏆': 'trophy',
            '🎁': 'gift',
            '🔄': 'refresh',
            '🎬': 'movie',
            '🛡️': 'shield',
            '⚡': 'lightning',
            '🌐': 'network',
            '📊': 'chart',
            '💬': 'chat',
            '🧠': 'brain',
            '🎨': 'palette',
            '⏱️': 'timer',
            '🗺️': 'map',
            '🚀': 'rocket',
            '🚨': 'alert',
            '📈': 'trending-up',
            '💵': 'dollar',
            '💸': 'money-flow',
            '💧': 'water-drop',
            '🔍': 'search',
        };

        let result = text;
        for (const [emoji, iconName] of Object.entries(emojiMap)) {
            if (result.includes(emoji)) {
                result = result.replace(
                    new RegExp(emoji, 'g'),
                    this.get(iconName, 20, true)
                );
            }
        }
        return result;
    },

    // Icon definitions
    icons: {
        game: (size, animate) => `
            <svg class="icon icon-game${animate ? ' icon-animate' : ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 6C7 5.44772 7.44772 5 8 5H16C16.5523 5 17 5.44772 17 6V8H19C19.5523 8 20 8.44772 20 9V17C20 17.5523 19.5523 18 19 18H17V20C17 20.5523 16.5523 21 16 21H8C7.44772 21 7 20.5523 7 20V18H5C4.44772 18 4 17.5523 4 17V9C4 8.44772 4.44772 8 5 8H7V6Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <circle cx="9" cy="12" r="1" fill="currentColor"/>
                <circle cx="15" cy="12" r="1" fill="currentColor"/>
                ${animate ? '<animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="8s" repeatCount="indefinite"/>' : ''}
            </svg>
        `,

        clock: (size, animate) => `
            <svg class="icon icon-clock${animate ? ' icon-animate' : ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
                <path d="M12 7V12L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                ${animate ? '<animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="60s" repeatCount="indefinite"/>' : ''}
            </svg>
        `,

        timer: (size, animate) => `
            <svg class="icon icon-timer${animate ? ' icon-animate' : ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="13" r="8" stroke="currentColor" stroke-width="2"/>
                <path d="M12 9V13L14 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M10 4H14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                ${animate ? '<animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite"/>' : ''}
            </svg>
        `,

        money: (size, animate) => `
            <svg class="icon icon-money${animate ? ' icon-animate' : ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
                <path d="M12 8V16M15 10C15 8.89543 13.6569 8 12 8C10.3431 8 9 8.89543 9 10C9 11.1046 10.3431 12 12 12C13.6569 12 15 12.8954 15 14C15 15.1046 13.6569 16 12 16C10.3431 16 9 15.1046 9 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                ${animate ? '<animate attributeName="opacity" values="1;0.7;1" dur="3s" repeatCount="indefinite"/>' : ''}
            </svg>
        `,

        lock: (size, animate) => `
            <svg class="icon icon-lock${animate ? ' icon-animate' : ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" stroke-width="2"/>
                <path d="M8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V11" stroke="currentColor" stroke-width="2"/>
                <circle cx="12" cy="16" r="1.5" fill="currentColor"/>
                ${animate ? '<animate attributeName="opacity" values="1;0.6;1" dur="2s" repeatCount="indefinite"/>' : ''}
            </svg>
        `,

        graduation: (size, animate) => `
            <svg class="icon icon-graduation${animate ? ' icon-animate' : ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4L3 9L12 14L21 9L12 4Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <path d="M21 9V15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M6 11V16C6 16 8 19 12 19C16 19 18 16 18 16V11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                ${animate ? '<animateTransform attributeName="transform" type="translate" values="0,0; 0,-2; 0,0" dur="2s" repeatCount="indefinite"/>' : ''}
            </svg>
        `,

        book: (size, animate) => `
            <svg class="icon icon-book${animate ? ' icon-animate' : ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 19.5C4 18.837 4.5 18 6.5 18H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6.5 4H20V22H6.5C5.5 22 4 21.5 4 19.5V6.5C4 5.5 5.5 4 6.5 4Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                ${animate ? '<animate attributeName="opacity" values="1;0.8;1" dur="4s" repeatCount="indefinite"/>' : ''}
            </svg>
        `,

        books: (size, animate) => `
            <svg class="icon icon-books${animate ? ' icon-animate' : ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 19.5C4 18.837 4.5 18 6.5 18H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M6.5 4H20V22H6.5C5.5 22 4 21.5 4 19.5V6.5C4 5.5 5.5 4 6.5 4Z" stroke="currentColor" stroke-width="2"/>
                <path d="M13 4V22" stroke="currentColor" stroke-width="1" opacity="0.5"/>
                ${animate ? '<animateTransform attributeName="transform" type="scale" values="1;1.05;1" dur="3s" repeatCount="indefinite"/>' : ''}
            </svg>
        `,

        compass: (size, animate) => `
            <svg class="icon icon-compass${animate ? ' icon-animate' : ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
                <path d="M16 8L10 14L8 16L14 10L16 8Z" fill="currentColor" opacity="0.7"/>
                <path d="M12 8V7M12 17V16M8 12H7M17 12H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                ${animate ? '<animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="20s" repeatCount="indefinite"/>' : ''}
            </svg>
        `,

        target: (size, animate) => `
            <svg class="icon icon-target${animate ? ' icon-animate' : ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
                <circle cx="12" cy="12" r="6" stroke="currentColor" stroke-width="2"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                <circle cx="12" cy="12" r="1" fill="currentColor"/>
                ${animate ? '<animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite"/>' : ''}
            </svg>
        `,

        globe: (size, animate) => `
            <svg class="icon icon-globe${animate ? ' icon-animate' : ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
                <path d="M3 12H21M12 3C9.5 6 9.5 18 12 21M12 3C14.5 6 14.5 18 12 21" stroke="currentColor" stroke-width="2"/>
                ${animate ? '<animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="30s" repeatCount="indefinite"/>' : ''}
            </svg>
        `,

        network: (size, animate) => `
            <svg class="icon icon-network${animate ? ' icon-animate' : ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
                <path d="M12 3V21M3 12H21" stroke="currentColor" stroke-width="2"/>
                <circle cx="12" cy="12" r="2" fill="currentColor"/>
                <circle cx="12" cy="5" r="1.5" fill="currentColor"/>
                <circle cx="12" cy="19" r="1.5" fill="currentColor"/>
                <circle cx="5" cy="12" r="1.5" fill="currentColor"/>
                <circle cx="19" cy="12" r="1.5" fill="currentColor"/>
                ${animate ? '<animate attributeName="opacity" values="1;0.6;1" dur="3s" repeatCount="indefinite"/>' : ''}
            </svg>
        `,

        tool: (size, animate) => `
            <svg class="icon icon-tool${animate ? ' icon-animate' : ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.7 6.3C15.4 7 15.4 8.1 14.7 8.8L12.9 10.6L13.6 11.3L19.3 5.6C20 4.9 21.1 4.9 21.8 5.6C22.5 6.3 22.5 7.4 21.8 8.1L16.1 13.8L16.8 14.5L18.6 12.7C19.3 12 20.4 12 21.1 12.7C21.8 13.4 21.8 14.5 21.1 15.2L15.4 20.9C14.7 21.6 13.6 21.6 12.9 20.9L3.1 11.1C2.4 10.4 2.4 9.3 3.1 8.6L8.8 2.9C9.5 2.2 10.6 2.2 11.3 2.9C12 3.6 12 4.7 11.3 5.4L9.5 7.2L10.2 7.9L15.9 2.2C16.6 1.5 17.7 1.5 18.4 2.2C19.1 2.9 19.1 4 18.4 4.7L12.7 10.4L13.4 11.1L15.2 9.3C15.9 8.6 17 8.6 17.7 9.3" stroke="currentColor" stroke-width="2"/>
                ${animate ? '<animateTransform attributeName="transform" type="rotate" from="0 12 12" to="15 12 12" dur="1s" repeatCount="indefinite" values="0 12 12; 15 12 12; 0 12 12; -15 12 12; 0 12 12"/>' : ''}
            </svg>
        `,

        lightbulb: (size, animate) => `
            <svg class="icon icon-lightbulb${animate ? ' icon-animate' : ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18H15M10 21H14M12 3C8.68629 3 6 5.68629 6 9C6 10.8954 6.8954 12.5863 8.28277 13.5836C8.75926 13.9334 9 14.4409 9 15V16C9 16.5523 9.44772 17 10 17H14C14.5523 17 15 16.5523 15 16V15C15 14.4409 15.2407 13.9334 15.7172 13.5836C17.1046 12.5863 18 10.8954 18 9C18 5.68629 15.3137 3 12 3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                ${animate ? '<animate attributeName="opacity" values="1;0.5;1;0.5;1" dur="3s" repeatCount="indefinite"/>' : ''}
            </svg>
        `,

        brain: (size, animate) => `
            <svg class="icon icon-brain${animate ? ' icon-animate' : ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3C10.5 3 9.5 4 9 5C8.5 4 7.5 3 6 3C4 3 3 5 3 7C3 9 4 11 6 12C4 13 3 15 3 17C3 19 4 21 6 21C7.5 21 8.5 20 9 19C9.5 20 10.5 21 12 21C13.5 21 14.5 20 15 19C15.5 20 16.5 21 18 21C20 21 21 19 21 17C21 15 20 13 18 12C20 11 21 9 21 7C21 5 20 3 18 3C16.5 3 15.5 4 15 5C14.5 4 13.5 3 12 3Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <path d="M12 7V17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                ${animate ? '<animate attributeName="opacity" values="1;0.7;1" dur="4s" repeatCount="indefinite"/>' : ''}
            </svg>
        `,

        lightning: (size, animate) => `
            <svg class="icon icon-lightning${animate ? ' icon-animate' : ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="currentColor" fill-opacity="0.2"/>
                ${animate ? '<animate attributeName="opacity" values="1;0.5;1;0.5;1" dur="2s" repeatCount="indefinite"/>' : ''}
            </svg>
        `,

        chart: (size, animate) => `
            <svg class="icon icon-chart${animate ? ' icon-animate' : ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3V21H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M7 14L10 10L14 14L20 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="20" cy="8" r="1.5" fill="currentColor"/>
                ${animate ? '<animateTransform attributeName="transform" type="translate" values="0,0; 0,-2; 0,0" dur="2s" repeatCount="indefinite"/>' : ''}
            </svg>
        `,

        shield: (size, animate) => `
            <svg class="icon icon-shield${animate ? ' icon-animate' : ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3L4 7V13C4 17 6 20 12 21C18 20 20 17 20 13V7L12 3Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                ${animate ? '<animate attributeName="opacity" values="1;0.7;1" dur="3s" repeatCount="indefinite"/>' : ''}
            </svg>
        `,

        robot: (size, animate) => `
            <svg class="icon icon-robot${animate ? ' icon-animate' : ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="5" y="9" width="14" height="11" rx="2" stroke="currentColor" stroke-width="2"/>
                <circle cx="9" cy="14" r="1.5" fill="currentColor"/>
                <circle cx="15" cy="14" r="1.5" fill="currentColor"/>
                <path d="M9 18H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M12 9V6M12 6C12 4.89543 12.8954 4 14 4H14.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <rect x="2" y="9" width="3" height="4" rx="1" stroke="currentColor" stroke-width="2"/>
                <rect x="19" y="9" width="3" height="4" rx="1" stroke="currentColor" stroke-width="2"/>
                ${animate ? '<animate attributeName="opacity" values="1;0.6;1" dur="2s" repeatCount="indefinite"/>' : ''}
            </svg>
        `,

        palette: (size, animate) => `
            <svg class="icon icon-palette${animate ? ' icon-animate' : ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C12.83 21 13.5 20.33 13.5 19.5C13.5 19.11 13.35 18.76 13.11 18.49C12.88 18.23 12.73 17.88 12.73 17.5C12.73 16.67 13.4 16 14.23 16H16C18.76 16 21 13.76 21 11C21 6.58 16.97 3 12 3Z" stroke="currentColor" stroke-width="2"/>
                <circle cx="7.5" cy="10.5" r="1.5" fill="currentColor"/>
                <circle cx="10.5" cy="7.5" r="1.5" fill="currentColor"/>
                <circle cx="15.5" cy="8.5" r="1.5" fill="currentColor"/>
                <circle cx="17" cy="13" r="1.5" fill="currentColor"/>
                ${animate ? '<animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="20s" repeatCount="indefinite"/>' : ''}
            </svg>
        `,

        map: (size, animate) => `
            <svg class="icon icon-map${animate ? ' icon-animate' : ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6L9 3L15 6L21 3V18L15 21L9 18L3 21V6Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <path d="M9 3V18M15 6V21" stroke="currentColor" stroke-width="2"/>
                ${animate ? '<animate attributeName="opacity" values="1;0.8;1" dur="3s" repeatCount="indefinite"/>' : ''}
            </svg>
        `,

        sparkles: (size, animate) => `
            <svg class="icon icon-sparkles${animate ? ' icon-animate' : ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="currentColor" fill-opacity="0.3"/>
                <path d="M18 5L18.5 6.5L20 7L18.5 7.5L18 9L17.5 7.5L16 7L17.5 6.5L18 5Z" fill="currentColor"/>
                <path d="M6 18L6.5 19.5L8 20L6.5 20.5L6 22L5.5 20.5L4 20L5.5 19.5L6 18Z" fill="currentColor"/>
                ${animate ? '<animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>' : ''}
            </svg>
        `,

        trophy: (size, animate) => `
            <svg class="icon icon-trophy${animate ? ' icon-animate' : ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 4H17M7 4V9C7 12 9 14 12 14C15 14 17 12 17 9V4M7 4H4V7C4 8.5 5 10 7 10M17 4H20V7C20 8.5 19 10 17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M12 14V17M12 17H9V20H15V17H12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                ${animate ? '<animateTransform attributeName="transform" type="scale" values="1;1.1;1" dur="3s" repeatCount="indefinite"/>' : ''}
            </svg>
        `,

        gift: (size, animate) => `
            <svg class="icon icon-gift${animate ? ' icon-animate' : ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="10" width="18" height="11" rx="1" stroke="currentColor" stroke-width="2"/>
                <path d="M12 10V21M3 14H21" stroke="currentColor" stroke-width="2"/>
                <path d="M12 10V7C12 5 10.5 3.5 9 3.5C7.5 3.5 6.5 4.5 6.5 6C6.5 7.5 7.5 8.5 9 8.5H12M12 10V7C12 5 13.5 3.5 15 3.5C16.5 3.5 17.5 4.5 17.5 6C17.5 7.5 16.5 8.5 15 8.5H12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                ${animate ? '<animate attributeName="opacity" values="1;0.7;1" dur="3s" repeatCount="indefinite"/>' : ''}
            </svg>
        `,

        refresh: (size, animate) => `
            <svg class="icon icon-refresh${animate ? ' icon-animate' : ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C14.3643 3 16.5228 3.94932 18.1208 5.48622M18.1208 5.48622L21 3V9H15L18.1208 5.48622Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                ${animate ? '<animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="4s" repeatCount="indefinite"/>' : ''}
            </svg>
        `,

        movie: (size, animate) => `
            <svg class="icon icon-movie${animate ? ' icon-animate' : ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" stroke-width="2"/>
                <path d="M2 9H22M2 12H22M2 15H22" stroke="currentColor" stroke-width="1" opacity="0.5"/>
                <circle cx="6" cy="7.5" r="0.5" fill="currentColor"/>
                <circle cx="18" cy="7.5" r="0.5" fill="currentColor"/>
                ${animate ? '<animate attributeName="opacity" values="1;0.7;1" dur="2s" repeatCount="indefinite"/>' : ''}
            </svg>
        `,

        chat: (size, animate) => `
            <svg class="icon icon-chat${animate ? ' icon-animate' : ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 11.5C21 16.7467 16.9706 21 12 21C10.4000 21 8.89996 20.6 7.59998 19.9L3 21L4.10002 16.4C3.39996 15.1 3 13.6 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 11.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 12H8.01M12 12H12.01M16 12H16.01" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
                ${animate ? '<animate attributeName="opacity" values="1;0.6;1" dur="3s" repeatCount="indefinite"/>' : ''}
            </svg>
        `,

        institution: (size, animate) => `
            <svg class="icon icon-institution${animate ? ' icon-animate' : ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 21H21M4 18H20M4 18V11M20 18V11M4 11L12 4L20 11M7 18V11M11 18V11M13 18V11M17 18V11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                ${animate ? '<animate attributeName="opacity" values="1;0.8;1" dur="4s" repeatCount="indefinite"/>' : ''}
            </svg>
        `,

        tent: (size, animate) => `
            <svg class="icon icon-tent${animate ? ' icon-animate' : ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3L3 21H21L12 3Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <path d="M12 3V21M8 14L12 10L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                ${animate ? '<animateTransform attributeName="transform" type="scale" values="1;1.05;1" dur="3s" repeatCount="indefinite"/>' : ''}
            </svg>
        `,

        rocket: (size, animate) => `
            <svg class="icon icon-rocket${animate ? ' icon-animate' : ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 15L6 18V21H9L12 18M15 9L18 6H21V9L18 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M20 4C20 4 15 5 12 8C9 11 9 15 9 15C9 15 13 15 16 12C19 9 20 4 20 4Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="currentColor" fill-opacity="0.2"/>
                <circle cx="13.5" cy="10.5" r="1.5" fill="currentColor"/>
                <path d="M5 14L3 17L7 19L10 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                ${animate ? '<animateTransform attributeName="transform" type="translate" values="0,0; -2,-2; 0,0" dur="2s" repeatCount="indefinite"/>' : ''}
            </svg>
        `,

        alert: (size, animate) => `
            <svg class="icon icon-alert${animate ? ' icon-animate' : ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.1"/>
                <path d="M12 8V12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                <circle cx="12" cy="16" r="1" fill="currentColor"/>
                ${animate ? '<animate attributeName="opacity" values="1;0.4;1;0.4;1" dur="2s" repeatCount="indefinite"/>' : ''}
            </svg>
        `,

        'trending-up': (size, animate) => `
            <svg class="icon icon-trending-up${animate ? ' icon-animate' : ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 17L9 11L13 15L21 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M21 7V13M21 7H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="21" cy="7" r="1.5" fill="currentColor"/>
                ${animate ? '<animateTransform attributeName="transform" type="translate" values="0,2; 0,-2; 0,2" dur="3s" repeatCount="indefinite"/>' : ''}
            </svg>
        `,

        dollar: (size, animate) => `
            <svg class="icon icon-dollar${animate ? ' icon-animate' : ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="7" width="16" height="10" rx="2" stroke="currentColor" stroke-width="2"/>
                <path d="M12 7V17M15 10C15 8.89543 13.6569 8 12 8C10.3431 8 9 8.89543 9 10C9 11.1046 10.3431 12 12 12C13.6569 12 15 12.8954 15 14C15 15.1046 13.6569 16 12 16C10.3431 16 9 15.1046 9 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                ${animate ? '<animate attributeName="opacity" values="1;0.7;1" dur="3s" repeatCount="indefinite"/>' : ''}
            </svg>
        `,

        'money-flow': (size, animate) => `
            <svg class="icon icon-money-flow${animate ? ' icon-animate' : ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="7" stroke="currentColor" stroke-width="2"/>
                <path d="M12 9V15M14 11C14 9.89543 13.1046 9 12 9C10.8954 9 10 9.89543 10 11C10 12.1046 10.8954 13 12 13C13.1046 13 14 13.8954 14 15C14 16.1046 13.1046 17 12 17C10.8954 17 10 16.1046 10 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M19 12H21M3 12H5M12 5V3M12 21V19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                ${animate ? '<animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="8s" repeatCount="indefinite"/>' : ''}
            </svg>
        `,

        'water-drop': (size, animate) => `
            <svg class="icon icon-water-drop${animate ? ' icon-animate' : ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3C12 3 6 9 6 14C6 17.3137 8.68629 20 12 20C15.3137 20 18 17.3137 18 14C18 9 12 3 12 3Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="currentColor" fill-opacity="0.2"/>
                <path d="M9 14C9 12.8954 9.89543 12 11 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/>
                ${animate ? '<animateTransform attributeName="transform" type="translate" values="0,0; 0,2; 0,0" dur="3s" repeatCount="indefinite"/>' : ''}
            </svg>
        `,

        search: (size, animate) => `
            <svg class="icon icon-search${animate ? ' icon-animate' : ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/>
                <path d="M16 16L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <circle cx="11" cy="11" r="4" stroke="currentColor" stroke-width="1" opacity="0.5"/>
                ${animate ? '<animateTransform attributeName="transform" type="scale" values="1;1.1;1" dur="3s" repeatCount="indefinite"/>' : ''}
            </svg>
        `,
    }
};

// Make available globally
if (typeof window !== 'undefined') {
    window.IconLibrary = IconLibrary;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IconLibrary;
}
