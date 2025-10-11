#!/usr/bin/env python3
"""
Extract all href links from all module HTML files
Creates a comprehensive listing for reference
"""

import re
from pathlib import Path
import json

def extract_all_hrefs(file_path):
    """Extract all href links from an HTML file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all href attributes with surrounding context
    href_pattern = r'<a[^>]*href=["\']([^"\']+)["\'][^>]*>([^<]*)</a>'
    hrefs = re.findall(href_pattern, content)

    return hrefs

def categorize_href(href):
    """Categorize href by type"""
    if href.startswith('#'):
        return 'anchor'
    elif href.startswith('http://') or href.startswith('https://'):
        return 'external'
    elif href.startswith('mailto:'):
        return 'email'
    elif href.startswith('/'):
        return 'absolute-internal'
    else:
        return 'relative'

def main():
    base_dir = Path('/Users/dalia/projects/bitcoin-sovereign-academy')

    # Find all module HTML files
    module_files = []
    for pattern in ['paths/builder/stage-*/module-*.html', 'paths/curious/stage-*/module-*.html']:
        module_files.extend(sorted(base_dir.glob(pattern)))

    print("=" * 100)
    print("COMPLETE HREF EXTRACTION - ALL MODULE FILES")
    print("=" * 100)

    all_data = {}

    for module_file in module_files:
        rel_path = str(module_file.relative_to(base_dir))
        print(f"\n{'='*100}")
        print(f"File: {rel_path}")
        print('='*100)

        hrefs = extract_all_hrefs(module_file)

        if not hrefs:
            print("  No links found!")
            continue

        # Group by category
        by_category = {}
        for href, text in hrefs:
            category = categorize_href(href)
            if category not in by_category:
                by_category[category] = []
            by_category[category].append((href, text.strip() if text else ''))

        # Store for JSON output
        all_data[rel_path] = {
            'total_links': len(hrefs),
            'by_category': {}
        }

        # Print by category
        for category in ['absolute-internal', 'relative', 'anchor', 'external', 'email']:
            if category in by_category:
                links = by_category[category]
                all_data[rel_path]['by_category'][category] = [
                    {'href': h, 'text': t} for h, t in links
                ]

                print(f"\n  {category.upper()} ({len(links)} links):")
                print("  " + "-" * 96)

                for href, text in links:
                    text_display = text[:70] + "..." if len(text) > 70 else text
                    if text_display:
                        print(f"    [{text_display}]")
                        print(f"      → {href}")
                    else:
                        print(f"    → {href}")

    # Save JSON output
    json_file = base_dir / 'all_hrefs_data.json'
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(all_data, f, indent=2)

    print(f"\n\n{'='*100}")
    print(f"Complete data saved to: {json_file}")
    print('='*100)

    # Print summary statistics
    print("\n\nSUMMARY STATISTICS")
    print("="*100)

    total_files = len(all_data)
    total_links = sum(data['total_links'] for data in all_data.values())

    category_totals = {}
    for data in all_data.values():
        for category, links in data['by_category'].items():
            category_totals[category] = category_totals.get(category, 0) + len(links)

    print(f"\nTotal module files analyzed: {total_files}")
    print(f"Total links found: {total_links}")
    print(f"Average links per file: {total_links / total_files:.1f}")

    print("\nLinks by category:")
    for category, count in sorted(category_totals.items()):
        print(f"  {category}: {count}")

if __name__ == '__main__':
    main()
