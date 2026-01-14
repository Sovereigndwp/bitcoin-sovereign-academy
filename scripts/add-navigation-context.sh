#!/bin/bash
# Add navigation-context.js to all relevant pages for return-to-path navigation
# 
# This script adds the navigation-context.js script to:
# - All path module pages (to save context when users are learning)
# - All deep-dive pages (to show return navigation)
# - All interactive demo pages (to show return navigation)
#
# Usage: bash scripts/add-navigation-context.sh

set -e

SCRIPT_TAG='<script src="/js/navigation-context.js"></script>'
COMMENT='<!-- Navigation Context (return-to-path functionality) -->'
FULL_INSERT="$COMMENT\n    $SCRIPT_TAG"

echo "Adding navigation-context.js to all relevant pages..."

# Counter for modified files
modified=0
skipped=0

# Function to add script if not already present
add_script_to_file() {
    local file="$1"
    
    # Check if script is already included
    if grep -q 'navigation-context.js' "$file"; then
        ((skipped++)) || true
        return
    fi
    
    # Try to insert after </head> or before </body>
    # First try: after the last </script> in the <head> section
    if grep -q '<script src="/js/progress-manager.js">' "$file"; then
        # Insert after progress-manager.js
        sed -i '' 's|<script src="/js/progress-manager.js"></script>|<script src="/js/progress-manager.js"></script>\n    <!-- Navigation Context (return-to-path functionality) -->\n    <script src="/js/navigation-context.js"></script>|' "$file"
        echo "  ✓ $file (after progress-manager.js)"
        ((modified++)) || true
        return
    fi
    
    # Alternative: insert before </body>
    if grep -q '</body>' "$file"; then
        sed -i '' 's|</body>|    <!-- Navigation Context (return-to-path functionality) -->\n    <script src="/js/navigation-context.js"></script>\n</body>|' "$file"
        echo "  ✓ $file (before </body>)"
        ((modified++)) || true
        return
    fi
    
    echo "  ⚠ Could not add to: $file"
}

# Process path module pages
echo ""
echo "Processing path module pages..."
find paths -name "*.html" -type f | while read -r file; do
    add_script_to_file "$file"
done

# Process deep-dive pages
echo ""
echo "Processing deep-dive pages..."
find deep-dives -name "*.html" -type f | while read -r file; do
    add_script_to_file "$file"
done

# Process interactive demo pages
echo ""
echo "Processing interactive demo pages..."
find interactive-demos -name "*.html" -type f | while read -r file; do
    add_script_to_file "$file"
done

# Process demos pages
echo ""
echo "Processing demos pages..."
find demos -name "*.html" -type f | while read -r file; do
    add_script_to_file "$file"
done

echo ""
echo "Done! Modified: $modified files, Skipped (already has script): $skipped files"
echo ""
echo "To test:"
echo "1. Visit a path module page (e.g., /paths/curious/stage-1/module-2.html)"
echo "2. Click on a deep-dive link"
echo "3. You should see a 'Return to path' button in the bottom-left corner"
