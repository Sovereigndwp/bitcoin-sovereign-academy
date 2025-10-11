#!/usr/bin/env python3
"""
Navigation Analysis Script
Extracts and analyzes all href links from module HTML files
"""

import re
import os
from pathlib import Path
from collections import defaultdict

def extract_hrefs(file_path):
    """Extract all href links from an HTML file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all href attributes
    href_pattern = r'href=["\']([^"\']+)["\']'
    hrefs = re.findall(href_pattern, content)

    return hrefs

def extract_navigation_section(file_path):
    """Extract the navigation section from an HTML file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find module navigation section
    nav_pattern = r'<nav class="module-navigation">(.*?)</nav>'
    match = re.search(nav_pattern, content, re.DOTALL)

    if match:
        nav_content = match.group(1)
        # Extract links and buttons
        link_pattern = r'<a[^>]*href=["\']([^"\']+)["\'][^>]*>(.*?)</a>'
        button_pattern = r'<button[^>]*>(.*?)</button>'

        links = re.findall(link_pattern, nav_content, re.DOTALL)
        buttons = re.findall(button_pattern, nav_content, re.DOTALL)

        return {
            'raw': nav_content.strip(),
            'links': links,
            'buttons': buttons
        }

    return None

def extract_breadcrumb(file_path):
    """Extract breadcrumb navigation"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    breadcrumb_pattern = r'<div class="breadcrumb">(.*?)</div>'
    match = re.search(breadcrumb_pattern, content, re.DOTALL)

    if match:
        breadcrumb_content = match.group(1)
        link_pattern = r'<a[^>]*href=["\']([^"\']+)["\'][^>]*>(.*?)</a>'
        links = re.findall(link_pattern, breadcrumb_content)
        return links

    return []

def check_file_exists(base_path, href):
    """Check if an internal href points to an existing file"""
    if href.startswith('http://') or href.startswith('https://') or href.startswith('mailto:') or href.startswith('#'):
        return None  # External link or anchor

    # Clean the href
    href_clean = href.split('#')[0].split('?')[0]

    if not href_clean:
        return None

    # Handle absolute paths from root
    if href_clean.startswith('/'):
        full_path = Path('/Users/dalia/projects/bitcoin-sovereign-academy') / href_clean.lstrip('/')
    else:
        # Relative path
        full_path = (Path(base_path).parent / href_clean).resolve()

    return full_path.exists()

def main():
    base_dir = Path('/Users/dalia/projects/bitcoin-sovereign-academy')

    # Find all HTML files
    html_files = []
    for pattern in ['paths/builder/**/*.html', 'paths/curious/**/*.html']:
        html_files.extend(sorted(base_dir.glob(pattern)))

    results = {
        'navigation_patterns': [],
        'broken_links': [],
        'missing_navigation': [],
        'inconsistencies': [],
        'all_hrefs': defaultdict(list)
    }

    print("=" * 80)
    print("NAVIGATION ANALYSIS REPORT")
    print("=" * 80)
    print()

    # Analyze each file
    for html_file in html_files:
        rel_path = html_file.relative_to(base_dir)

        # Extract all hrefs
        all_hrefs = extract_hrefs(html_file)
        results['all_hrefs'][str(rel_path)] = all_hrefs

        # Extract navigation section
        nav_section = extract_navigation_section(html_file)

        # Extract breadcrumb
        breadcrumb = extract_breadcrumb(html_file)

        # Store navigation pattern
        results['navigation_patterns'].append({
            'file': str(rel_path),
            'navigation': nav_section,
            'breadcrumb': breadcrumb
        })

        # Check for broken internal links
        for href in all_hrefs:
            exists = check_file_exists(html_file, href)
            if exists is False:  # Only if we determined it's an internal link and doesn't exist
                results['broken_links'].append({
                    'file': str(rel_path),
                    'href': href
                })

    # Analyze module files specifically (exclude index.html files)
    module_files = [p for p in results['navigation_patterns'] if 'module-' in p['file']]

    print("\n1. BROKEN INTERNAL LINKS")
    print("-" * 80)
    if results['broken_links']:
        for broken in results['broken_links']:
            print(f"  File: {broken['file']}")
            print(f"  Broken link: {broken['href']}")
            print()
    else:
        print("  No broken internal links found!")

    print("\n2. NAVIGATION PATTERNS")
    print("-" * 80)

    # Analyze navigation patterns for modules
    for pattern in module_files[:5]:  # Show first 5 as sample
        print(f"\n  File: {pattern['file']}")
        if pattern['navigation']:
            nav = pattern['navigation']
            print(f"  Navigation links:")
            for link_href, link_text in nav['links']:
                clean_text = re.sub(r'<[^>]+>', '', link_text).strip()
                clean_text = ' '.join(clean_text.split())
                print(f"    - {clean_text}: {link_href}")
            for button_text in nav['buttons']:
                clean_text = re.sub(r'<[^>]+>', '', button_text).strip()
                clean_text = ' '.join(clean_text.split())
                print(f"    - [BUTTON] {clean_text}")
        else:
            print("  No module-navigation section found!")

        if pattern['breadcrumb']:
            print(f"  Breadcrumb:")
            for bc_href, bc_text in pattern['breadcrumb']:
                print(f"    - {bc_text}: {bc_href}")

    print("\n\n3. MISSING NAVIGATION ANALYSIS")
    print("-" * 80)

    # Check for missing next/previous in modules
    missing_count = 0
    for pattern in module_files:
        file_path = pattern['file']
        nav = pattern['navigation']

        # Determine expected previous/next
        parts = file_path.split('/')
        if 'module-1.html' in file_path:
            # Module 1 should have link back to stage and next to module-2
            expected = "Link to stage index and next module"
        elif 'module-2.html' in file_path:
            # Module 2 should have previous to module-1 and next to module-3
            expected = "Previous to module-1 and next to module-3"
        elif 'module-3.html' in file_path:
            # Module 3 should have previous to module-2
            expected = "Previous to module-2"
        else:
            expected = None

        if nav is None:
            print(f"\n  {file_path}")
            print(f"    MISSING: No navigation section found!")
            missing_count += 1
        elif expected and len(nav['links']) == 0:
            print(f"\n  {file_path}")
            print(f"    WARNING: Navigation section exists but has no links")
            print(f"    Expected: {expected}")
            missing_count += 1

    if missing_count == 0:
        print("  All modules have navigation sections with links!")

    print("\n\n4. INCONSISTENCY ANALYSIS")
    print("-" * 80)

    # Check for inconsistent patterns
    inconsistencies = []

    # Group by stage
    stages = defaultdict(list)
    for pattern in module_files:
        file_path = pattern['file']
        # Extract stage info
        if 'builder/stage-1' in file_path:
            key = 'builder-stage-1'
        elif 'builder/stage-2' in file_path:
            key = 'builder-stage-2'
        elif 'builder/stage-3' in file_path:
            key = 'builder-stage-3'
        elif 'builder/stage-4' in file_path:
            key = 'builder-stage-4'
        elif 'curious/stage-1' in file_path:
            key = 'curious-stage-1'
        elif 'curious/stage-2' in file_path:
            key = 'curious-stage-2'
        elif 'curious/stage-3' in file_path:
            key = 'curious-stage-3'
        elif 'curious/stage-4' in file_path:
            key = 'curious-stage-4'
        else:
            key = 'other'
        stages[key].append(pattern)

    # Check link types (relative vs absolute)
    print("\n  Link Type Analysis (Relative vs Absolute):")
    for stage_key, patterns in sorted(stages.items()):
        print(f"\n    {stage_key}:")
        for pattern in patterns:
            file_path = pattern['file']
            nav = pattern['navigation']
            if nav and nav['links']:
                for link_href, link_text in nav['links']:
                    link_type = "absolute" if link_href.startswith('/') else "relative"
                    clean_text = re.sub(r'<[^>]+>', '', link_text).strip()
                    clean_text = ' '.join(clean_text.split())[:40]
                    print(f"      {Path(file_path).name}: {link_type} - {link_href}")

    # Check button text variations
    print("\n\n  Button Text Variations:")
    button_texts = set()
    for pattern in module_files:
        nav = pattern['navigation']
        if nav and nav['buttons']:
            for button_text in nav['buttons']:
                clean_text = re.sub(r'<[^>]+>', '', button_text).strip()
                clean_text = ' '.join(clean_text.split())
                button_texts.add(clean_text)

    for text in sorted(button_texts):
        print(f"    - '{text}'")

    print("\n\n5. SUMMARY")
    print("-" * 80)
    print(f"  Total HTML files analyzed: {len(html_files)}")
    print(f"  Total module files: {len(module_files)}")
    print(f"  Broken internal links: {len(results['broken_links'])}")
    print(f"  Files with missing navigation: {missing_count}")

    print("\n" + "=" * 80)

if __name__ == '__main__':
    main()
