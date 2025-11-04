#!/usr/bin/env node

/**
 * Bitcoin Sovereign Academy - Emoji to Icon Migration Script
 *
 * This script replaces static emoji characters with animated SVG icon data attributes
 * across all HTML files in the platform.
 *
 * Usage: node scripts/replace-emojis.js
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Emoji to icon name mapping
const EMOJI_MAP = {
    '🎮': 'game',
    '⏰': 'clock',
    '⏱️': 'timer',
    '💰': 'money',
    '🔐': 'lock',
    '🔒': 'lock',
    '🎯': 'target',
    '📚': 'books',
    '🌍': 'globe',
    '🌐': 'network',
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
    '📊': 'chart',
    '💬': 'chat',
    '🧠': 'brain',
    '🎨': 'palette',
    '🗺️': 'map',
    '🪙': 'money',
    '🆘': 'lightning',
    '🥋': 'shield',
};

// Track statistics
const stats = {
    filesProcessed: 0,
    filesModified: 0,
    emojisReplaced: 0,
    iconLinksAdded: 0,
};

/**
 * Check if file already has icon library linked
 */
function hasIconLibrary(content) {
    return content.includes('/css/icons.css') && content.includes('/js/icon-library.js');
}

/**
 * Add icon library links to HTML file
 */
function addIconLibrary(content) {
    // Add CSS after other stylesheets
    if (!content.includes('/css/icons.css')) {
        const cssMatch = content.match(/(<link[^>]*rel="stylesheet"[^>]*>)/);
        if (cssMatch) {
            const lastStylesheet = content.lastIndexOf('</head>');
            if (lastStylesheet !== -1) {
                content = content.slice(0, lastStylesheet) +
                    '    <link rel="stylesheet" href="/css/icons.css">\n' +
                    content.slice(lastStylesheet);
                stats.iconLinksAdded++;
            }
        }
    }

    // Add JS before closing body tag
    if (!content.includes('/js/icon-library.js')) {
        const bodyCloseMatch = content.lastIndexOf('</body>');
        if (bodyCloseMatch !== -1) {
            const scriptTag = `
    <!-- Animated Icon Library -->
    <script src="/js/icon-library.js"></script>
    <script>
        // Inject icons after DOM loads
        document.addEventListener('DOMContentLoaded', function() {
            if (window.IconLibrary) {
                document.querySelectorAll('[data-icon]').forEach(function(element) {
                    var iconName = element.getAttribute('data-icon');
                    if (iconName) {
                        var iconHTML = IconLibrary.get(iconName, 20, true);
                        var span = document.createElement('span');
                        span.innerHTML = iconHTML;
                        span.className = 'icon-inline';
                        span.style.marginRight = '0.5rem';
                        span.style.display = 'inline-block';
                        span.style.verticalAlign = 'middle';
                        element.insertBefore(span, element.firstChild);
                    }
                });
            }
        });
    </script>
`;
            content = content.slice(0, bodyCloseMatch) + scriptTag + content.slice(bodyCloseMatch);
            stats.iconLinksAdded++;
        }
    }

    return content;
}

/**
 * Replace emojis in content with data-icon attributes
 */
function replaceEmojis(content) {
    let modified = false;

    for (const [emoji, iconName] of Object.entries(EMOJI_MAP)) {
        const regex = new RegExp(emoji, 'g');

        if (regex.test(content)) {
            // Count occurrences
            const matches = content.match(regex);
            if (matches) {
                stats.emojisReplaced += matches.length;
                modified = true;
            }

            // Strategy 1: Replace in common patterns
            // Pattern: <span>emoji Text</span> or <li>emoji Text</li>
            content = content.replace(
                new RegExp(`(<(?:span|li|p|h[1-6])[^>]*>)\\s*${emoji}\\s*`, 'g'),
                `$1<span data-icon="${iconName}"></span> `
            );

            // Pattern: emoji at start of text node
            content = content.replace(
                new RegExp(`>${emoji}\\s+([^<]+)`, 'g'),
                `><span data-icon="${iconName}"></span> $1`
            );

            // Pattern: Standalone emoji in text
            content = content.replace(
                new RegExp(`\\s${emoji}\\s`, 'g'),
                ` <span data-icon="${iconName}"></span> `
            );
        }
    }

    return { content, modified };
}

/**
 * Process a single HTML file
 */
function processFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        stats.filesProcessed++;

        // Check if file needs icon library
        const needsLibrary = !hasIconLibrary(content);

        // Replace emojis
        const result = replaceEmojis(content);

        if (result.modified || needsLibrary) {
            // Add icon library if needed
            if (needsLibrary && result.modified) {
                result.content = addIconLibrary(result.content);
            }

            // Write back to file
            fs.writeFileSync(filePath, result.content, 'utf8');
            stats.filesModified++;

            console.log(`✓ Modified: ${filePath}`);
        } else {
            console.log(`  Skipped: ${filePath} (no changes needed)`);
        }
    } catch (error) {
        console.error(`✗ Error processing ${filePath}:`, error.message);
    }
}

/**
 * Main execution
 */
function main() {
    console.log('🚀 Starting emoji to icon migration...\n');

    // Find all HTML files (excluding node_modules, hidden folders)
    const patterns = [
        'interactive-demos/**/*.html',
        'paths/**/*.html',
        'tools/**/*.html',
        'ai-agents/**/*.html',
        'ai-tutors/**/*.html',
        'challenges/**/*.html',
        'demos/**/*.html',
    ];

    let allFiles = [];
    patterns.forEach(pattern => {
        const files = glob.sync(pattern, {
            cwd: process.cwd(),
            ignore: ['**/node_modules/**', '**/.*/**']
        });
        allFiles = allFiles.concat(files);
    });

    console.log(`Found ${allFiles.length} HTML files to process\n`);

    // Process each file
    allFiles.forEach(processFile);

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 Migration Summary:');
    console.log('='.repeat(60));
    console.log(`Files processed:     ${stats.filesProcessed}`);
    console.log(`Files modified:      ${stats.filesModified}`);
    console.log(`Emojis replaced:     ${stats.emojisReplaced}`);
    console.log(`Icon links added:    ${stats.iconLinksAdded}`);
    console.log('='.repeat(60));
    console.log('\n✅ Migration complete!');
}

// Run the script
main();
