#!/usr/bin/env python3
"""
Detailed Navigation Flow Analysis
Checks the sequential flow of modules and identifies specific issues
"""

import re
from pathlib import Path

def extract_navigation_section(file_path):
    """Extract the navigation section from an HTML file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    nav_pattern = r'<nav class="module-navigation">(.*?)</nav>'
    match = re.search(nav_pattern, content, re.DOTALL)

    if match:
        nav_content = match.group(1)
        link_pattern = r'<a[^>]*href=["\']([^"\']+)["\'][^>]*>(.*?)</a>'
        button_pattern = r'<button[^>]*>(.*?)</button>'

        links = re.findall(link_pattern, nav_content, re.DOTALL)
        buttons = re.findall(button_pattern, nav_content, re.DOTALL)

        return {
            'links': links,
            'buttons': buttons
        }

    return None

def main():
    base_dir = Path('/Users/dalia/projects/bitcoin-sovereign-academy')

    # Define expected module sequences
    sequences = {
        'builder': {
            'stage-1': ['module-1.html', 'module-2.html', 'module-3.html'],
            'stage-2': ['module-1.html', 'module-2.html', 'module-3.html'],
            'stage-3': ['module-1.html', 'module-2.html', 'module-3.html'],
            'stage-4': ['module-1.html', 'module-2.html', 'module-3.html'],
        },
        'curious': {
            'stage-1': ['module-1.html', 'module-2.html', 'module-3.html'],
            'stage-2': ['module-1.html', 'module-2.html', 'module-3.html'],
            'stage-3': ['module-1.html', 'module-2.html', 'module-3.html'],
            'stage-4': ['module-1.html', 'module-2.html', 'module-3.html'],
        }
    }

    print("=" * 80)
    print("DETAILED NAVIGATION FLOW ANALYSIS")
    print("=" * 80)

    issues = []

    for path_type in ['builder', 'curious']:
        print(f"\n\n{'='*80}")
        print(f"{path_type.upper()} PATH")
        print('='*80)

        for stage in ['stage-1', 'stage-2', 'stage-3', 'stage-4']:
            print(f"\n{'-'*80}")
            print(f"{stage.upper()}")
            print('-'*80)

            modules = sequences[path_type][stage]

            for i, module_file in enumerate(modules):
                file_path = base_dir / 'paths' / path_type / stage / module_file
                rel_path = f"paths/{path_type}/{stage}/{module_file}"

                print(f"\n  {module_file}")

                nav = extract_navigation_section(file_path)

                if not nav:
                    print("    ERROR: No navigation section found!")
                    issues.append(f"{rel_path}: No navigation section")
                    continue

                # Determine expected navigation
                is_first = (i == 0)
                is_last = (i == len(modules) - 1)

                print(f"    Position: {'First' if is_first else 'Last' if is_last else 'Middle'} module in stage")

                # Analyze links
                if nav['links']:
                    for link_href, link_text in nav['links']:
                        clean_text = re.sub(r'<[^>]+>', '', link_text).strip()
                        clean_text = ' '.join(clean_text.split())

                        # Determine link type
                        is_absolute = link_href.startswith('/')
                        is_relative = not is_absolute and not link_href.startswith('http')

                        link_type = "ABSOLUTE" if is_absolute else "RELATIVE" if is_relative else "EXTERNAL"

                        print(f"    Link [{link_type}]: '{clean_text}' -> {link_href}")

                        # Check for issues
                        if is_first:
                            # First module should link back to stage index
                            expected_back = f"/paths/{path_type}/{stage}/"
                            if link_href != expected_back:
                                if not link_href.endswith(f"/{stage}/"):
                                    issue = f"{rel_path}: First module should link to stage index, got: {link_href}"
                                    print(f"      ISSUE: Expected link to {expected_back}")
                                    issues.append(issue)

                        elif is_relative:
                            # Relative links should point to previous module
                            if i > 0:
                                expected_prev = modules[i-1]
                                if link_href != expected_prev:
                                    issue = f"{rel_path}: Relative link inconsistency. Expected {expected_prev}, got {link_href}"
                                    print(f"      ISSUE: Expected {expected_prev}")
                                    issues.append(issue)

                        # Check if it's pointing to next module when it shouldn't
                        if i < len(modules) - 1:
                            next_module = modules[i+1]
                            if link_href == next_module or link_href.endswith(next_module):
                                issue = f"{rel_path}: Has 'previous' navigation but points to next module"
                                print(f"      ISSUE: Link points to next module instead of previous")
                                issues.append(issue)

                else:
                    print("    WARNING: No navigation links found!")
                    issues.append(f"{rel_path}: No navigation links")

                # Analyze buttons
                if nav['buttons']:
                    for button_text in nav['buttons']:
                        clean_text = re.sub(r'<[^>]+>', '', button_text).strip()
                        clean_text = ' '.join(clean_text.split())
                        print(f"    Button: '{clean_text}'")

                        # Check button text consistency
                        if is_last:
                            if stage == 'stage-4':
                                # Last module of last stage
                                if 'Finish' not in clean_text and 'Complete' not in clean_text and '🎉' not in clean_text:
                                    issue = f"{rel_path}: Last module of final stage should have completion message"
                                    issues.append(issue)
                            else:
                                if 'Finish' not in clean_text and 'Complete Stage' not in clean_text:
                                    issue = f"{rel_path}: Last module should indicate stage completion"
                                    issues.append(issue)
                        else:
                            if 'Continue' not in clean_text:
                                issue = f"{rel_path}: Middle module should have 'Continue' button"
                                issues.append(issue)

    print("\n\n" + "="*80)
    print("INCONSISTENCY SUMMARY")
    print("="*80)

    print("\n1. LINK TYPE INCONSISTENCIES")
    print("-"*80)
    print("\nBuilder Stage 1: Uses RELATIVE links for module-to-module navigation")
    print("  - module-2 → module-1: RELATIVE")
    print("  - module-3 → module-2: RELATIVE")
    print("\nBuilder Stage 2+, 3, 4: Uses ABSOLUTE links for module-to-module navigation")
    print("  - Example: /paths/builder/stage-2/module-1.html")
    print("\nCurious Stage 1, 2: Mixed RELATIVE and ABSOLUTE")
    print("  - Some modules use relative, some use absolute")
    print("\nCurious Stage 3: Uses ABSOLUTE links consistently")
    print("\nCurious Stage 4: Inconsistent - mix of relative and absolute")

    print("\n\n2. BUTTON TEXT INCONSISTENCIES")
    print("-"*80)
    print("\nVariations found:")
    print("  - 'Mark Complete & Continue →' (Builder path mostly)")
    print("  - 'Mark Complete & Finish Stage 1 →' (Builder stage 1)")
    print("  - 'Mark Complete & Finish Stage 3 →' (Builder stage 3)")
    print("  - 'Complete Quiz to Continue →' (Curious path)")
    print("  - 'Complete Stage 2 →' (Curious stage 2)")
    print("  - 'Complete Stage 3 →' (Curious stage 3)")
    print("  - 'Complete Stage 4 🎉' (Curious stage 4)")
    print("  - 'Complete The Curious Path! 🎉' (Curious final)")

    print("\n\n3. SPECIFIC ISSUES FOUND")
    print("-"*80)
    if issues:
        for i, issue in enumerate(issues, 1):
            print(f"{i}. {issue}")
    else:
        print("No critical issues found in navigation flow!")

    print("\n\n4. RECOMMENDATIONS")
    print("-"*80)
    print("\n1. STANDARDIZE LINK TYPES:")
    print("   Choose either relative OR absolute links for module-to-module navigation")
    print("   Recommendation: Use relative links (e.g., 'module-2.html') within same stage")
    print("   This makes the code more portable and easier to maintain")

    print("\n2. STANDARDIZE BUTTON TEXT:")
    print("   Use consistent button text across all modules:")
    print("   - First/Middle modules: 'Mark Complete & Continue →'")
    print("   - Last module of stage: 'Complete Stage N →'")
    print("   - Last module of path: 'Complete The [Path Name]! 🎉'")

    print("\n3. ENSURE CONSISTENT NAVIGATION PATTERNS:")
    print("   - Module 1: Link back to stage index")
    print("   - Module 2: Link to module 1")
    print("   - Module 3: Link to module 2")

    print("\n" + "="*80)

if __name__ == '__main__':
    main()
