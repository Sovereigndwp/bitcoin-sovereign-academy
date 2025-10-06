# Deployment Architecture - Bitcoin Sovereign Academy
**Date**: October 6, 2025
**Issue**: Multiple deployment targets with inconsistent functionality

---

## 🎯 The Problem

You're experiencing different functionality across different locations:
1. **Localhost** (http://localhost:3000) - Development version
2. **GitHub Pages** (https://sovereigndwp.github.io/bitcoin-sovereign-academy/) - Production
3. **Vercel app** (mentioned) - Unknown deployment
4. **Links provided** - Unclear which deployment they point to

**Result**: Changes work in one place but not another, causing confusion.

---

## 📊 Current Deployment Locations

### 1. **Local Development** (localhost:3000)
**What it is**: Your development server running on your computer
**Powered by**: `npm run dev` command
**Files served from**: `/Users/dalia/projects/bitcoin-sovereign-academy/`
**Updates when**: You save files locally
**Git status**: May have uncommitted changes

**Characteristics**:
- ✅ Always has latest code you're working on
- ✅ Updates instantly when you edit files
- ❌ Only accessible from your computer
- ❌ Not suitable for sharing with others

### 2. **GitHub Pages** (Production)
**URL**: https://sovereigndwp.github.io/bitcoin-sovereign-academy/
**Powered by**: GitHub Actions workflow
**Files served from**: GitHub repository `main` branch
**Updates when**: You push commits to `main` branch
**Deploy time**: ~2-5 minutes after push

**Characteristics**:
- ✅ Publicly accessible
- ✅ Automatically deploys on git push
- ✅ Free hosting from GitHub
- ⚠️ Requires 2-5 minute build/deploy time
- ⚠️ Only updates when you commit AND push

### 3. **Vercel App** (Status Unknown)
**URL**: Unknown (you mentioned "Vercel app")
**Status**: Need to verify if this exists and what it's connected to

**Possible scenarios**:
- **A) Connected to same GitHub repo**: Would auto-deploy on push (similar to GitHub Pages)
- **B) Separate deployment**: Would need manual updates
- **C) Stale/abandoned**: Old version no longer updated

---

## 🔍 Why They're Different

### Scenario 1: You're Testing Locally Before Committing
```
1. You edit files locally
2. Localhost shows changes immediately ✅
3. GitHub Pages still shows old version ❌ (not committed yet)
4. Vercel shows old version ❌ (not committed yet)
```

### Scenario 2: You Committed But Didn't Push
```
1. You commit changes locally (git commit)
2. Localhost shows latest ✅
3. GitHub Pages shows old ❌ (not pushed to GitHub)
4. Vercel shows old ❌ (not pushed to GitHub)
```

### Scenario 3: You Pushed But Deployment Not Complete
```
1. You push to GitHub (git push)
2. Localhost shows latest ✅
3. GitHub Pages building... ⏳ (2-5 min wait)
4. Vercel deploying... ⏳ (if connected to repo)
```

### Scenario 4: Browser Cache
```
1. Everything deployed correctly
2. But browser cached old version
3. Need hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
```

---

## ✅ Solution: Unified Deployment Strategy

### Step 1: Identify All Deployment Targets

**Run these commands to check:**

```bash
# 1. Check for Vercel configuration
ls -la | grep vercel

# 2. Check for Netlify configuration
ls -la | grep netlify

# 3. Check GitHub repository settings
gh repo view --web
# Go to Settings → Pages to see GitHub Pages config

# 4. Check for any deployment webhooks
cat .git/config | grep url
```

### Step 2: Choose ONE Primary Production Deployment

**Recommendation: Use GitHub Pages**

Why?
- ✅ Already configured and working
- ✅ Auto-deploys on push to main
- ✅ Free and reliable
- ✅ Integrated with your GitHub workflow

**If keeping Vercel:**
- Connect it to the same GitHub repo
- Set it to auto-deploy on push to `main`
- Use as staging environment (deploy from different branch)

### Step 3: Establish Clear Workflow

**Recommended Workflow:**

```
┌─────────────────┐
│  Local Changes  │ ← You edit files here
│  (localhost)    │
└────────┬────────┘
         │ Save files
         ▼
┌─────────────────┐
│  Test Locally   │ ← Verify it works at localhost:3000
└────────┬────────┘
         │ git add, git commit
         ▼
┌─────────────────┐
│ Commit to Git   │ ← Changes saved locally
└────────┬────────┘
         │ git push origin main
         ▼
┌─────────────────┐
│ Push to GitHub  │ ← Code uploaded to GitHub
└────────┬────────┘
         │ GitHub Actions triggered
         ▼
┌─────────────────┐
│ GitHub Pages    │ ← Auto-deploy (2-5 min)
│ (Production)    │ ← https://sovereigndwp.github.io/...
└─────────────────┘
         │ (if Vercel connected)
         ▼
┌─────────────────┐
│ Vercel Deploy   │ ← Auto-deploy (1-2 min)
│ (Optional)      │ ← Your Vercel URL
└─────────────────┘
```

---

## 🛠️ How to Ensure Everything Stays in Sync

### Daily Workflow Commands

**Every time you make changes:**

```bash
# 1. Test locally first
npm run dev
# Open http://localhost:3000
# Test your changes

# 2. Commit your changes
git add .
git commit -m "description of changes"

# 3. Push to GitHub (triggers all deployments)
git push origin main

# 4. Wait 2-5 minutes for deployment

# 5. Verify production (hard refresh!)
# Visit: https://sovereigndwp.github.io/bitcoin-sovereign-academy/
# Press: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

# 6. Check deployment status
gh run list --limit 3
```

### Checking Deployment Status

**GitHub Pages:**
```bash
# Check latest deployment
gh run list --limit 3

# Or visit GitHub Actions tab
gh repo view --web
# Click "Actions" tab
```

**Vercel (if you have it):**
```bash
# Install Vercel CLI if needed
npm i -g vercel

# Check deployments
vercel ls

# Check current production URL
vercel inspect
```

---

## 🔧 Fixing Current Inconsistencies

### Problem: Mining Simulator Works Differently Everywhere

**Root Cause**: Different versions deployed to different locations

**Solution Steps:**

1. **Ensure latest code is committed and pushed:**
```bash
# Check if you have uncommitted changes
git status

# If there are changes, commit them
git add .
git commit -m "fix: sync all enhancements"
git push origin main
```

2. **Verify GitHub is updated:**
```bash
# Check latest commit on GitHub
gh repo view

# Should show your latest commit hash
git log -1 --oneline
```

3. **Trigger fresh deployment:**
```bash
# Empty commit to force rebuild
git commit --allow-empty -m "chore: force deployment refresh"
git push origin main
```

4. **Wait for deployment:**
```bash
# Check GitHub Actions
gh run watch

# Wait for "✓" success indicator
```

5. **Hard refresh browser:**
```
Mac: Cmd+Shift+R
Windows: Ctrl+Shift+R
Linux: Ctrl+Shift+R
```

6. **Clear all cache if still issues:**
```
Chrome: Settings → Privacy → Clear browsing data → Cached images
Firefox: Settings → Privacy → Clear Data → Cached Web Content
Safari: Develop → Empty Caches
```

---

## 📋 Deployment Checklist

Use this every time you deploy:

- [ ] **1. Test locally**: http://localhost:3000
- [ ] **2. Commit changes**: `git add . && git commit -m "message"`
- [ ] **3. Push to GitHub**: `git push origin main`
- [ ] **4. Check GitHub Actions**: `gh run list` (should show "in_progress" or "completed")
- [ ] **5. Wait 2-5 minutes**: Get coffee ☕
- [ ] **6. Hard refresh browser**: Cmd+Shift+R
- [ ] **7. Test production**: Visit GitHub Pages URL
- [ ] **8. Verify all features work**: Click through each demo
- [ ] **9. If issues, check console**: F12 to see errors

---

## 🎯 Recommended Setup Going Forward

### Option A: Single Deployment (Simplest)

**Use only GitHub Pages:**
- ✅ One deployment target
- ✅ Auto-deploys on push
- ✅ Easy to understand
- ✅ No confusion

**Remove Vercel:**
```bash
# If Vercel is connected, disconnect it
vercel unlink
# Or just ignore it and use GitHub Pages
```

### Option B: Dual Deployment (Advanced)

**GitHub Pages = Production**
- Deploys from `main` branch
- Public-facing URL
- Stable, tested code only

**Vercel = Staging**
- Deploys from `develop` branch
- Testing new features
- Before merging to main

**Workflow:**
```bash
# Work on feature
git checkout -b feature/new-demo
# ... make changes ...
git commit -m "feat: new demo"

# Push to develop for staging
git checkout develop
git merge feature/new-demo
git push origin develop
# Vercel auto-deploys → test at staging URL

# Once tested, merge to main for production
git checkout main
git merge develop
git push origin main
# GitHub Pages auto-deploys → live in production
```

---

## 🚨 Common Issues & Solutions

### Issue 1: "Changes work on localhost but not production"

**Cause**: Not committed or not pushed

**Solution**:
```bash
git status  # Check for uncommitted changes
git add .
git commit -m "fix: apply changes"
git push origin main
# Wait 2-5 minutes
# Hard refresh browser
```

### Issue 2: "Production shows old version after push"

**Cause**: Browser cache or deployment delay

**Solution**:
```bash
# Check deployment finished
gh run list --limit 1
# Should show "completed ✓"

# Hard refresh browser
# Mac: Cmd+Shift+R
# Windows: Ctrl+Shift+R

# If still old, clear all cache
```

### Issue 3: "Different demos work in different places"

**Cause**: Partial deployment or mixed versions

**Solution**:
```bash
# Force complete rebuild
git commit --allow-empty -m "chore: force rebuild"
git push origin main

# Clear browser cache completely
# Restart browser
# Wait 5 minutes for deployment
# Test again
```

### Issue 4: "Not sure which URL is production"

**Cause**: Multiple deployments

**Solution**:
```bash
# Check GitHub Pages URL
gh repo view --web
# Go to Settings → Pages
# Note the URL

# Check Vercel (if exists)
vercel ls
# Note the URL

# Pick ONE as production
# Update all links to use that one
```

---

## 📝 Action Items for You

### Immediate (Do Now):

1. **Find out if Vercel exists:**
```bash
ls -la | grep vercel
cat package.json | grep vercel
```

2. **Check what URL you're sharing:**
   - What URL do you give to students?
   - Is it GitHub Pages or Vercel?

3. **Ensure everything is pushed:**
```bash
git status
git push origin main
```

4. **Wait 5 minutes and test production**

### This Week:

1. **Choose primary deployment** (GitHub Pages recommended)
2. **Document the production URL** in README
3. **Set up deployment status checks** (GitHub Actions badge)
4. **Create deployment script** for one-command deploy

---

## 🎉 Future: Automated Deployment

Create a simple deploy script:

```bash
#!/bin/bash
# deploy.sh

echo "🚀 Deploying Bitcoin Sovereign Academy..."

# 1. Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    echo "⚠️  You have uncommitted changes!"
    git status -s
    read -p "Commit them now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        read -p "Commit message: " msg
        git commit -m "$msg"
    fi
fi

# 2. Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main

# 3. Wait for deployment
echo "⏳ Waiting for GitHub Actions..."
sleep 10
gh run watch

# 4. Show production URL
echo "✅ Deployment complete!"
echo "🌐 Production: https://sovereigndwp.github.io/bitcoin-sovereign-academy/"
echo "💡 Don't forget to hard refresh: Cmd+Shift+R"
```

Make it executable:
```bash
chmod +x deploy.sh
./deploy.sh
```

---

**Next Step**: Tell me if you have a Vercel deployment so I can help you consolidate!
