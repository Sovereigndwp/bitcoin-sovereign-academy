#!/usr/bin/env python3
"""
Bitcoin Sovereign Academy - Emoji to Icon Migration Script

This script replaces static emoji characters with animated SVG icon data attributes
across all HTML files in the platform.

Usage: python3 scripts/replace-emojis.py
"""

import os
import re
from pathlib import Path

# Emoji to icon name mapping
EMOJI_MAP = {
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
}

# Statistics
stats = {
    'files_processed': 0,
    'files_modified': 0,
    'emojis_replaced': 0,
    'icon_links_added': 0,
}

def has_icon_library(content):
    """Check if file already has icon library linked"""
    return '/css/icons.css' in content and '/js/icon-library.js' in content

def add_icon_library(content):
    """Add icon library links to HTML file"""
    modified = False

    # Add CSS link before </head>
    if '/css/icons.css' not in content:
        head_close = content.rfind('</head>')
        if head_close != -1:
            css_link = '    <link rel="stylesheet" href="/css/icons.css">\n'
            content = content[:head_close] + css_link + content[head_close:]
            stats['icon_links_added'] += 1
            modified = True

    # Add JS script before </body>
    if '/js/icon-library.js' not in content:
        body_close = content.rfind('</body>')
        if body_close != -1:
            script_tag = '''
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
'''
            content = content[:body_close] + script_tag + content[body_close:]
            stats['icon_links_added'] += 1
            modified = True

    return content, modified

def replace_emojis(content):
    """Replace emojis in content with data-icon attributes"""
    modified = False
    original_content = content

    for emoji, icon_name in EMOJI_MAP.items():
        if emoji in content:
            # Count occurrences before replacement
            count = content.count(emoji)
            stats['emojis_replaced'] += count
            modified = True

            # Pattern 1: Emoji at start of element content
            # <span>🎮 Text</span> -> <span data-icon="game">Text</span>
            pattern1 = re.compile(
                rf'(<(?:span|li|p|h[1-6]|a|div)[^>]*>)\s*{re.escape(emoji)}\s+',
                re.MULTILINE
            )
            content = pattern1.sub(rf'\1<span data-icon="{icon_name}"></span> ', content)

            # Pattern 2: Emoji in plain text after >
            # >🎮 Text -> ><span data-icon="game"></span> Text
            pattern2 = re.compile(
                rf'>{re.escape(emoji)}\s+([^<]+)',
                re.MULTILINE
            )
            content = pattern2.sub(rf'><span data-icon="{icon_name}"></span> \1', content)

            # Pattern 3: Standalone emoji with spaces
            # " 🎮 " -> " <span data-icon="game"></span> "
            pattern3 = re.compile(
                rf'\s{re.escape(emoji)}\s',
                re.MULTILINE
            )
            content = pattern3.sub(rf' <span data-icon="{icon_name}"></span> ', content)

            # Pattern 4: Emoji followed by colon (common in labels)
            # 🎮: -> <span data-icon="game"></span>:
            pattern4 = re.compile(
                rf'{re.escape(emoji)}:',
                re.MULTILINE
            )
            content = pattern4.sub(rf'<span data-icon="{icon_name}"></span>:', content)

    return content, modified

def process_file(file_path):
    """Process a single HTML file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        stats['files_processed'] += 1

        # Check if file needs icon library
        needs_library = not has_icon_library(content)

        # Replace emojis
        content, emoji_modified = replace_emojis(content)

        # Add icon library if emojis were replaced
        if emoji_modified and needs_library:
            content, lib_added = add_icon_library(content)
        else:
            lib_added = False

        if emoji_modified or lib_added:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)

            stats['files_modified'] += 1
            print(f"✓ Modified: {file_path}")
        else:
            print(f"  Skipped: {file_path} (no changes needed)")

    except Exception as e:
        print(f"✗ Error processing {file_path}: {e}")

def main():
    """Main execution"""
    print("🚀 Starting emoji to icon migration...\n")

    # Define patterns to search
    patterns = [
        'interactive-demos/**/*.html',
        'paths/**/*.html',
        'tools/**/*.html',
        'ai-agents/**/*.html',
        'ai-tutors/**/*.html',
        'challenges/**/*.html',
        'demos/**/*.html',
    ]

    # Find all HTML files
    all_files = []
    base_dir = Path('.')

    for pattern in patterns:
        # Convert glob pattern to Path.rglob pattern
        if '**' in pattern:
            dir_part = pattern.split('/**')[0]
            ext_part = pattern.split('/')[-1]

            dir_path = base_dir / dir_part
            if dir_path.exists():
                all_files.extend(dir_path.rglob(ext_part))

    print(f"Found {len(all_files)} HTML files to process\n")

    # Process each file
    for file_path in all_files:
        process_file(file_path)

    # Print summary
    print('\n' + '=' * 60)
    print('📊 Migration Summary:')
    print('=' * 60)
    print(f"Files processed:     {stats['files_processed']}")
    print(f"Files modified:      {stats['files_modified']}")
    print(f"Emojis replaced:     {stats['emojis_replaced']}")
    print(f"Icon links added:    {stats['icon_links_added']}")
    print('=' * 60)
    print('\n✅ Migration complete!')

if __name__ == '__main__':
    main()
