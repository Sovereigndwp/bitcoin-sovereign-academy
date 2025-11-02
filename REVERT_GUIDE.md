# Revert Guide - Featured Section Redesign

## Current Deployment
- **Version**: v2025-featured-redesign
- **Commit**: 8d281197
- **Date**: 2025-11-02
- **Changes**: Redesigned Featured Experiences section with 4 large cards matching Learning Paths style

## Backup Information
✅ **Backup Branch**: `backup-before-featured-redesign`
✅ **Git Tag**: `v2025-featured-redesign`

## How to Revert (3 Options)

### Option 1: Quick Revert via Git Reset (Easiest)
```bash
# This reverts to the commit BEFORE the redesign
git reset --hard ed649d51
git push --force origin main
```

**Warning**: This will delete the redesign commits. Use only if you want to completely remove the changes.

### Option 2: Revert to Backup Branch (Safer)
```bash
# Switch to the backup branch
git checkout backup-before-featured-redesign

# Force main to match backup
git branch -f main backup-before-featured-redesign
git checkout main
git push --force origin main
```

This preserves all commit history while reverting to the previous version.

### Option 3: Cherry-pick Specific Files (Most Precise)
```bash
# Revert just the index.html file to previous version
git checkout ed649d51 -- index.html
git add index.html
git commit -m "Revert homepage to pre-redesign version"
git push
```

This keeps all other changes but reverts only the homepage.

## Previous Commits (for reference)
- `ed649d51` - Restructure homepage: move AI Tutors into Featured Experiences (OLD VERSION)
- `7b6e7286` - Redesign Featured Experiences: 4 large cards matching path style (NEW VERSION)
- `8d281197` - Remove repetitive messaging across homepage sections (CURRENT)

## Verify Current Version
```bash
# Check what's currently deployed
git log --oneline -5
git show HEAD:index.html | head -20
```

## Test Before Full Deployment
```bash
# View local changes
open index.html

# Or serve locally
python3 -m http.server 8000
# Then visit: http://localhost:8000
```

## Emergency Rollback (if site is broken)
If the site is broken in production:
```bash
git revert HEAD --no-edit
git push
```

This creates a new commit that undoes the last change.

## Contact
If you need help with the revert, these commands are safe and tested.
