#!/usr/bin/env node

/**
 * Bitcoin Sovereign Academy - Emoji to Icon Migration Script
 * This script replaces static emoji characters with animated SVG icon data attributes
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
    '🚀': 'rocket',
    '🚨': 'alert',
    '📈': 'trending-up',
    '💵': 'dollar',
    '💸': 'money-flow',
    '💧': 'water-drop',
    '🔍': 'search',
};

// Track statistics
const stats = {
    filesProcessed: 0,
    filesModified: 0,
    emojisReplaced: 0,
    iconLinksAdded: 0,
};

function hasIconLibrary(content) {
    return content.includes('/css/icons.css') && content.includes('/js/icon-library.js');
}

function addIconLibrary(content) {
    if (!content.includes('/css/icons.css')) {
        const lastStylesheet = content.lastIndexOf('</head>');
        if (lastStylesheet !== -1) {
            content = content.slice(0, lastStylesheet) +
                '    <link rel="stylesheet" href="/css/icons.css">\n' +
                content.slice(lastStylesheet);
            stats.iconLinksAdded++;
        }
    }

    if (!content.includes('/js/icon-library.js')) {
        const bodyCloseMatch = content.lastIndexOf('</body>');
        if (bodyCloseMatch !== -1) {
            const scriptTag = `
    <!-- Animated Icon Library -->
    <script src="/js/icon-library.js"></script>
    <script>
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

function replaceEmojis(content) {
    let modified = false;

    for (const [emoji, iconName] of Object.entries(EMOJI_MAP)) {
        const regex = new RegExp(emoji, 'g');

        if (regex.test(content)) {
            const matches = content.match(regex);
            if (matches) {
                stats.emojisReplaced += matches.length;
                modified = true;
            }

            content = content.replace(
                new RegExp(`(<(?:span|li|p|h[1-6]|div)[^>]*>)\\s*${emoji}\\s*`, 'g'),
                `$1<span data-icon="${iconName}"></span> `
            );

            content = content.replace(
                new RegExp(`>${emoji}\\s+([^<]+)`, 'g'),
                `><span data-icon="${iconName}"></span> $1`
            );

            content = content.replace(
                new RegExp(`\\s${emoji}\\s`, 'g'),
                ` <span data-icon="${iconName}"></span> `
            );
        }
    }

    return { content, modified };
}

function processFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        stats.filesProcessed++;

        const needsLibrary = !hasIconLibrary(content);
        const result = replaceEmojis(content);

        if (result.modified || needsLibrary) {
            if (needsLibrary && result.modified) {
                result.content = addIconLibrary(result.content);
            }

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

function main() {
    console.log('🚀 Starting emoji to icon migration...\n');

    const patterns = [
        'interactive-demos/**/*.html',
        'paths/**/*.html',
        'tools/**/*.html',
        'ai-agents/**/*.html',
        'ai-tutors/**/*.html',
        'challenges/**/*.html',
        'demos/**/*.html',
        '*.html',
    ];

    let allFiles = [];
    patterns.forEach(pattern => {
        const files = glob.sync(pattern, {
            cwd: process.cwd(),
            ignore: ['**/node_modules/**', '**/.*/**']
        });
        allFiles = allFiles.concat(files);
    });

    allFiles = [...new Set(allFiles)];

    console.log(`Found ${allFiles.length} HTML files to process\n`);

    allFiles.forEach(processFile);

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

main();
