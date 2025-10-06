#!/bin/bash
# Bitcoin Sovereign Academy - Unified Deployment Script
# Ensures all deployment targets stay in sync

set -e  # Exit on error

echo "🚀 Bitcoin Sovereign Academy - Deployment Script"
echo "================================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 1. Check for uncommitted changes
echo -e "${BLUE}📋 Checking for uncommitted changes...${NC}"
if [[ -n $(git status -s) ]]; then
    echo -e "${YELLOW}⚠️  You have uncommitted changes:${NC}"
    git status -s
    echo ""
    read -p "Would you like to commit them now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        echo ""
        read -p "Enter commit message: " msg
        git commit -m "$msg

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
        echo -e "${GREEN}✅ Changes committed${NC}"
    else
        echo -e "${RED}❌ Deployment cancelled - please commit your changes first${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Working directory clean${NC}"
fi

echo ""

# 2. Push to GitHub
echo -e "${BLUE}📤 Pushing to GitHub...${NC}"
git push origin main
echo -e "${GREEN}✅ Pushed to GitHub${NC}"

echo ""

# 3. Show deployment status
echo -e "${BLUE}⏳ Deployments triggered:${NC}"
echo ""
echo -e "${YELLOW}1. Vercel:${NC}"
echo "   URL: https://bitcoin-sovereign-academy.vercel.app"
echo "   Status: Auto-deploying (1-2 minutes)"
echo ""
echo -e "${YELLOW}2. GitHub Pages:${NC}"
echo "   URL: https://sovereigndwp.github.io/bitcoin-sovereign-academy/"
echo "   Status: Auto-deploying (2-5 minutes)"
echo ""

# 4. Wait and check status
echo -e "${BLUE}⏳ Waiting 30 seconds before checking deployment status...${NC}"
sleep 30

echo ""
echo -e "${BLUE}📊 Checking GitHub Actions status...${NC}"
gh run list --limit 3 || echo "Install gh CLI for status: brew install gh"

echo ""
echo ""
echo -e "${GREEN}✅ Deployment initiated successfully!${NC}"
echo ""
echo -e "${YELLOW}📝 Next Steps:${NC}"
echo "1. Wait 2-5 minutes for both deployments to complete"
echo "2. Hard refresh your browser:"
echo "   Mac: Cmd+Shift+R"
echo "   Windows: Ctrl+Shift+R"
echo "3. Test both URLs:"
echo "   - https://bitcoin-sovereign-academy.vercel.app"
echo "   - https://sovereigndwp.github.io/bitcoin-sovereign-academy/"
echo ""
echo -e "${BLUE}💡 Tip:${NC} Bookmark the Vercel URL - it's your primary production site!"
echo ""
