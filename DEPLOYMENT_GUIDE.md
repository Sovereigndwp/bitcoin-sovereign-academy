# Deployment Guide - Quick Reference
**Updated**: October 6, 2025

---

## 🌐 Your Deployment URLs

### Production Sites (Both Auto-Deploy!)

**Primary (Vercel):**
- URL: https://bitcoin-sovereign-academy.vercel.app
- Deploy time: 1-2 minutes
- Status: Active ✅

**Secondary (GitHub Pages):**
- URL: https://sovereigndwp.github.io/bitcoin-sovereign-academy/
- Deploy time: 2-5 minutes
- Status: Active ✅

**Development (Local):**
- URL: http://localhost:3000
- Command: `npm run dev`
- Updates: Instantly on file save

---

## 🚀 Quick Deploy (One Command)

```bash
./deploy.sh
```

This script will:
1. Check for uncommitted changes
2. Prompt you to commit them
3. Push to GitHub
4. Trigger both Vercel and GitHub Pages deployments
5. Show you the status

---

## 📝 Manual Deploy Steps

If you prefer to do it manually:

```bash
# 1. Test locally first
npm run dev
# Visit http://localhost:3000 and test

# 2. Commit your changes
git add .
git commit -m "your message here"

# 3. Push to GitHub (triggers BOTH deployments)
git push origin main

# 4. Wait 2-5 minutes

# 5. Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R)

# 6. Test both production URLs
```

---

## ⚠️ Why You See Different Functionality

### Common Scenarios:

**Scenario 1: Just saved files**
- ✅ Localhost: Shows changes immediately
- ❌ Vercel: Still old version (not committed/pushed)
- ❌ GitHub Pages: Still old version (not committed/pushed)

**Scenario 2: Committed but not pushed**
- ✅ Localhost: Shows latest
- ❌ Vercel: Still old (waiting for push)
- ❌ GitHub Pages: Still old (waiting for push)

**Scenario 3: Just pushed**
- ✅ Localhost: Shows latest
- ⏳ Vercel: Deploying... (1-2 min wait)
- ⏳ GitHub Pages: Deploying... (2-5 min wait)

**Scenario 4: Deployments complete but browser cached**
- ✅ Everything deployed correctly
- ❌ Browser showing old cached version
- 🔧 Solution: Hard refresh (Cmd+Shift+R)

---

## 🔍 Checking Deployment Status

### Vercel
```bash
# If you have Vercel CLI installed
vercel ls

# Or visit dashboard
open https://vercel.com/dashboard
```

### GitHub Pages
```bash
# Check GitHub Actions
gh run list --limit 5

# Or visit GitHub Actions page
gh repo view --web
# Click "Actions" tab
```

---

## 🛠️ Troubleshooting

### Problem: "Changes not showing on production"

**Solution:**
```bash
# 1. Verify you pushed to GitHub
git log origin/main -1
# Should show your latest commit

# 2. Check deployment status
gh run list --limit 1
# Should show "completed ✓"

# 3. Hard refresh browser
# Mac: Cmd+Shift+R
# Windows: Ctrl+Shift+R

# 4. If still old, clear ALL cache
# Chrome: Settings → Privacy → Clear browsing data
```

### Problem: "Mining Simulator button doesn't work"

**Possible causes:**
1. **Browser cache** - Hard refresh
2. **Deployment in progress** - Wait 5 minutes
3. **JavaScript error** - Check console (F12)

**Solution:**
```bash
# Force fresh deployment
git commit --allow-empty -m "chore: force rebuild"
git push origin main

# Wait 5 minutes
# Clear browser cache completely
# Hard refresh
# Test again
```

### Problem: "Vercel shows different version than GitHub Pages"

**Cause**: Timing - they deploy at different speeds

**Solution:**
```bash
# Wait 5-10 minutes for BOTH to finish
# Then compare:
# 1. Open Vercel URL
# 2. Open GitHub Pages URL
# 3. Both should match

# If they don't match after 10 minutes:
git commit --allow-empty -m "chore: sync deployments"
git push origin main
```

---

## ✅ Deployment Checklist

Use this every time:

- [ ] Test locally at http://localhost:3000
- [ ] Changes work as expected
- [ ] Run `./deploy.sh` (or manual steps)
- [ ] Wait 5 minutes for deployments
- [ ] Hard refresh browser (Cmd+Shift+R)
- [ ] Test Vercel: https://bitcoin-sovereign-academy.vercel.app
- [ ] Test GitHub Pages: https://sovereigndwp.github.io/bitcoin-sovereign-academy/
- [ ] Both URLs show same content
- [ ] All features work on both sites

---

## 🎯 Which URL Should You Use?

**Recommend using Vercel as your primary:**
- ✅ Faster deployment (1-2 min vs 2-5 min)
- ✅ Better analytics
- ✅ Easier to configure
- ✅ Custom domain support

**Keep GitHub Pages as backup:**
- ✅ Free and reliable
- ✅ No configuration needed
- ✅ Integrated with GitHub

**Share this URL with students:**
```
https://bitcoin-sovereign-academy.vercel.app
```

---

## 📊 Deployment Times

| Action | Localhost | Vercel | GitHub Pages |
|--------|-----------|--------|--------------|
| File save | Instant | No change | No change |
| Git commit | No change | No change | No change |
| Git push | No change | Triggers deploy | Triggers deploy |
| Deploy time | N/A | 1-2 minutes | 2-5 minutes |
| Total time | Instant | 1-2 min | 2-5 min |

---

## 💡 Pro Tips

1. **Always test locally first** - Catch errors before deploying
2. **Use the deploy script** - Ensures you don't forget steps
3. **Wait for both deployments** - Don't test immediately after push
4. **Hard refresh always** - Browser cache is sneaky
5. **Check both URLs** - Ensure consistency
6. **Bookmark Vercel URL** - It's your primary site

---

## 🔗 Quick Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Repo**: https://github.com/Sovereigndwp/bitcoin-sovereign-academy
- **GitHub Actions**: https://github.com/Sovereigndwp/bitcoin-sovereign-academy/actions

---

**Remember**: Both sites auto-deploy when you push to `main`!
No manual deployment needed - just push and wait! 🚀
