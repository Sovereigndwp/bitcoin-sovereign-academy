#!/bin/bash

# Link Testing Script for Bitcoin Sovereign Academy
# Tests all HTML files for broken internal links

echo "🔍 Bitcoin Sovereign Academy - Link Testing"
echo "==========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BROKEN_LINKS=0
TOTAL_LINKS=0

# Function to check if a file exists
check_link() {
    local file="$1"
    local link="$2"
    local base_dir="/Users/dalia/projects/bitcoin-sovereign-academy"

    # Skip external links (http/https)
    if [[ "$link" =~ ^https?:// ]]; then
        return 0
    fi

    # Skip mailto links
    if [[ "$link" =~ ^mailto: ]]; then
        return 0
    fi

    # Skip anchor-only links
    if [[ "$link" =~ ^# ]]; then
        return 0
    fi

    # Remove anchor from link
    link_without_anchor="${link%%#*}"

    # Skip empty links
    if [ -z "$link_without_anchor" ]; then
        return 0
    fi

    TOTAL_LINKS=$((TOTAL_LINKS + 1))

    # Resolve relative path
    if [[ "$link_without_anchor" == /* ]]; then
        # Absolute path from root
        target="${base_dir}${link_without_anchor}"
    else
        # Relative path
        file_dir=$(dirname "$file")
        target="${file_dir}/${link_without_anchor}"
    fi

    # Normalize path
    target=$(cd "$(dirname "$target")" 2>/dev/null && pwd)/$(basename "$target") 2>/dev/null

    # Check if target exists
    if [ ! -e "$target" ]; then
        echo -e "${RED}✗ BROKEN${NC} in ${file}"
        echo "  Link: ${link_without_anchor}"
        echo "  Resolved to: ${target}"
        echo ""
        BROKEN_LINKS=$((BROKEN_LINKS + 1))
        return 1
    fi

    return 0
}

# Find all HTML files
echo "Scanning HTML files..."
html_files=$(find . -name "*.html" -type f | grep -v node_modules | grep -v ".git")

echo "Found $(echo "$html_files" | wc -l | tr -d ' ') HTML files"
echo ""
echo "Testing links..."
echo ""

# Extract and test links from each HTML file
for file in $html_files; do
    # Extract href attributes
    hrefs=$(grep -oP 'href="\K[^"]+' "$file" 2>/dev/null)

    # Extract src attributes (for iframes, scripts, etc.)
    srcs=$(grep -oP 'src="\K[^"]+' "$file" 2>/dev/null)

    # Test href links
    while IFS= read -r link; do
        [ -z "$link" ] && continue
        check_link "$file" "$link"
    done <<< "$hrefs"

    # Test src links
    while IFS= read -r link; do
        [ -z "$link" ] && continue
        # Skip CDN and external sources
        if [[ ! "$link" =~ ^https?:// ]]; then
            check_link "$file" "$link"
        fi
    done <<< "$srcs"
done

echo "==========================================="
echo "Testing Complete!"
echo ""
echo "Total internal links checked: ${TOTAL_LINKS}"

if [ $BROKEN_LINKS -eq 0 ]; then
    echo -e "${GREEN}✓ All links working!${NC}"
    exit 0
else
    echo -e "${RED}✗ Found ${BROKEN_LINKS} broken link(s)${NC}"
    exit 1
fi
