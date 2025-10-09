#!/bin/bash

# Bitcoin Sovereign Academy - Push Script
# Pushes your cleaned repository to GitHub

echo "🚀 Bitcoin Sovereign Academy - Push to GitHub"
echo "=============================================="
echo ""

# Navigate to repository
cd ~/projects/bitcoin-sovereign-academy || {
    echo "❌ Error: Could not find repository at ~/projects/bitcoin-sovereign-academy"
    echo "   Please update the path in this script to match your repository location."
    exit 1
}

echo "📍 Repository: bitcoin-sovereign-academy"
echo ""

# Show current status
echo "📊 Current Status:"
git status --short
echo ""

# Show commits to be pushed
echo "📝 Commits to push:"
git log origin/main..HEAD --oneline
echo ""

# Confirm with user
read -p "🤔 Push these changes to GitHub? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "⏳ Pushing to GitHub..."
    echo ""

    # Push to main branch
    if git push origin main; then
        echo ""
        echo "✅ Success! Your changes have been pushed to GitHub."
        echo ""
        echo "🌐 Your site should deploy automatically:"
        echo "   - GitHub Pages: https://bitcoinsovereign.academy"
        echo "   - Vercel: https://bitcoin-sovereign-academy.vercel.app"
        echo ""
        echo "⏱️  Deployment usually takes 1-2 minutes."
        echo ""
        echo "🔍 Next steps:"
        echo "   1. Wait 2 minutes for deployment"
        echo "   2. Visit your live site"
        echo "   3. Verify Bitcoin data loads"
        echo "   4. Check that buttons are styled correctly (orange/white)"
        echo "   5. Test on mobile"
        echo ""
    else
        echo ""
        echo "❌ Push failed!"
        echo ""
        echo "Common reasons:"
        echo "   1. Changes on GitHub you don't have locally"
        echo "      Fix: Run 'git pull origin main' then try again"
        echo ""
        echo "   2. Authentication error"
        echo "      Fix: Make sure you're logged into GitHub"
        echo ""
        echo "   3. No internet connection"
        echo "      Fix: Check your internet and try again"
        echo ""
        exit 1
    fi
else
    echo ""
    echo "❌ Push cancelled. No changes were pushed to GitHub."
    echo ""
    echo "You can push later by running:"
    echo "   cd ~/projects/bitcoin-sovereign-academy"
    echo "   git push origin main"
    echo ""
fi
