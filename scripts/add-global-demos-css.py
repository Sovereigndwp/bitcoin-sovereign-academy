#!/usr/bin/env python3
"""
Add global interactive-demos.css stylesheet to all demo HTML files
"""

import os
import re
from pathlib import Path

# CSS link to add
CSS_LINK = '<link rel="stylesheet" href="/css/interactive-demos.css">'

# Find all HTML files in interactive-demos
demos_dir = Path('interactive-demos')
html_files = list(demos_dir.glob('**/index.html')) + list(demos_dir.glob('**/*.html'))

# Remove duplicates and exclude index.html (already has good styling)
html_files = [f for f in set(html_files) if f != demos_dir / 'index.html']

print(f"Found {len(html_files)} HTML files to update")

updated_count = 0
skipped_count = 0

for html_file in sorted(html_files):
    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check if already has the CSS link
        if '/css/interactive-demos.css' in content:
            print(f"  ⏭️  {html_file} - already has stylesheet")
            skipped_count += 1
            continue

        # Check if has a </head> tag
        if '</head>' not in content:
            print(f"  ⚠️  {html_file} - no </head> tag found")
            skipped_count += 1
            continue

        # Add CSS link before </head>
        # Place after other stylesheets if they exist
        if '<link rel="stylesheet"' in content:
            # Find the last stylesheet link
            last_css_match = None
            for match in re.finditer(r'<link[^>]*rel=["\']stylesheet["\'][^>]*>', content):
                last_css_match = match

            if last_css_match:
                # Insert after the last CSS link
                insert_pos = last_css_match.end()
                new_content = content[:insert_pos] + '\n    ' + CSS_LINK + content[insert_pos:]
            else:
                # Fallback: add before </head>
                new_content = content.replace('</head>', f'    {CSS_LINK}\n</head>')
        else:
            # No other stylesheets, add before </head>
            new_content = content.replace('</head>', f'    {CSS_LINK}\n</head>')

        # Write updated content
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(new_content)

        print(f"  ✅ {html_file} - updated")
        updated_count += 1

    except Exception as e:
        print(f"  ❌ {html_file} - error: {e}")
        skipped_count += 1

print(f"\n✨ Summary:")
print(f"   Updated: {updated_count} files")
print(f"   Skipped: {skipped_count} files")
print(f"   Total: {len(html_files)} files processed")
