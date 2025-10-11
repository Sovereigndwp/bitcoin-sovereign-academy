# 🎯 YOUR STANDARDIZATION CHECKLIST - OPTION C

**Status:** 📋 Ready to Start
**Priority:** High - Improves UX consistency
**Estimated Time:** 2-3 hours

---

## ✅ What's Already Done

These critical issues have been **fixed and pushed**:

1. ✓ **Builder Stage 3 Navigation Fixed** - All 3 modules now have proper navigation
2. ✓ **CSS Paths Standardized** - index.html now uses consistent absolute paths
3. ✓ **Sovereign Path Created** - Complete structure with 12 placeholder modules
4. ✓ **Navigation Standards Defined** - Clear guidelines documented
5. ✓ **Platform Audit Complete** - Comprehensive report generated

---

## 📋 REMAINING TASKS - YOUR RESPONSIBILITY

### Task 1: Standardize Navigation Link Types Across ALL Modules
**Status:** ⬜ Not Started
**Time Estimate:** 1-1.5 hours
**Priority:** High

**What to do:**
Go through ALL modules in Curious and Builder paths and standardize the link format:

**Standard to follow:**
- ✓ Relative paths for same-stage navigation: `module-2.html`
- ✓ Absolute paths for cross-stage navigation: `/paths/curious/stage-2/`
- ✗ Never mix both in the same file

**Files to check (48 modules total):**

**Curious Path (12 modules):**
- [ ] `paths/curious/stage-1/module-1.html`
- [ ] `paths/curious/stage-1/module-2.html`
- [ ] `paths/curious/stage-1/module-3.html`
- [ ] `paths/curious/stage-2/module-1.html`
- [ ] `paths/curious/stage-2/module-2.html`
- [ ] `paths/curious/stage-2/module-3.html`
- [ ] `paths/curious/stage-3/module-1.html`
- [ ] `paths/curious/stage-3/module-2.html`
- [ ] `paths/curious/stage-3/module-3.html`
- [ ] `paths/curious/stage-4/module-1.html`
- [ ] `paths/curious/stage-4/module-2.html`
- [ ] `paths/curious/stage-4/module-3.html`

**Builder Path (12 modules):**
- [ ] `paths/builder/stage-1/module-1.html`
- [ ] `paths/builder/stage-1/module-2.html`
- [ ] `paths/builder/stage-1/module-3.html`
- [ ] `paths/builder/stage-2/module-1.html`
- [ ] `paths/builder/stage-2/module-2.html`
- [ ] `paths/builder/stage-2/module-3.html`
- [ ] `paths/builder/stage-3/module-1.html` ✓ Already fixed
- [ ] `paths/builder/stage-3/module-2.html` ✓ Already fixed
- [ ] `paths/builder/stage-3/module-3.html` ✓ Already fixed
- [ ] `paths/builder/stage-4/module-1.html`
- [ ] `paths/builder/stage-4/module-2.html`
- [ ] `paths/builder/stage-4/module-3.html`

**How to check:**
```bash
# Search for navigation links in a module
grep -n "href=" paths/curious/stage-1/module-1.html | grep -E "(module-|stage-)"

# Look for inconsistencies (both relative and absolute in same file)
```

**When done:**
- [ ] All modules use relative paths for same-stage navigation
- [ ] All modules use absolute paths for cross-stage navigation
- [ ] Commit with message: "Standardize navigation link types across all modules"

---

### Task 2: Standardize Button Text Across ALL Modules
**Status:** ⬜ Not Started
**Time Estimate:** 45 minutes - 1 hour
**Priority:** Medium-High

**What to do:**
Make button text consistent across all modules.

**Standard to follow:**

| Position | Button Text | Example |
|----------|------------|---------|
| First Module | No "Previous" button | `"Continue to Next Module →"` or `"Next: [Module Title] →"` |
| Middle Modules | `"← Previous: [Module Title]"` | `"Next: [Module Title] →"` |
| Last Module in Stage | `"← Previous: [Module Title]"` | `"Mark Complete & Finish Stage N →"` |
| Back to Overview | `"Back to Stage [N] Overview"` | Secondary style |

**Current variations found (8 different!):**
- "Mark Complete & Continue →"
- "Mark Complete & Finish Stage 1 →"
- "Complete Stage 2 →"
- "Complete Quiz to Continue →"
- "Complete The Curious Path! 🎉"
- "Next: Problems with Traditional Money →"
- "← Previous: What is Money?"
- etc.

**Files to update:**
Same 48 modules as Task 1 (check both paths)

**How to check:**
```bash
# Find all button text variations
grep -r "Mark Complete\|Continue\|Next:" paths/curious/stage-* paths/builder/stage-* | grep -v node_modules
```

**When done:**
- [ ] All first modules have consistent "Continue" or "Next" buttons
- [ ] All middle modules have consistent "Previous" and "Next" text
- [ ] All last modules have consistent "Finish Stage" buttons
- [ ] Commit with message: "Standardize button text across all modules"

---

### Task 3: Verify No Other Inconsistencies
**Status:** ⬜ Not Started
**Time Estimate:** 15-30 minutes
**Priority:** Medium

**Quick verification checklist:**
- [ ] Test navigation in browser: Click through 2-3 modules in each path
- [ ] Verify all "Next" buttons work correctly
- [ ] Verify all "Previous" buttons work correctly
- [ ] Check that stage overview links work
- [ ] Test on mobile (responsive navigation)

---

## 📊 PROGRESS TRACKER

**Overall Progress:** 0% (0/3 tasks complete)

- [ ] Task 1: Standardize Navigation Link Types (0%)
- [ ] Task 2: Standardize Button Text (0%)
- [ ] Task 3: Verify No Inconsistencies (0%)

---

## 🎯 SUCCESS CRITERIA

You're done when:
1. ✓ All 48 modules use consistent link types (relative for same-stage, absolute for cross-stage)
2. ✓ All button text follows the standard format
3. ✓ You've committed your changes with clear commit messages
4. ✓ You've tested navigation in the browser

---

## 💡 HELPFUL COMMANDS

**Find all module files:**
```bash
find paths/curious paths/builder -name "module-*.html" | sort
```

**Find navigation sections:**
```bash
grep -A 5 "module-navigation" paths/curious/stage-1/module-1.html
```

**Find button text:**
```bash
grep -o "Mark Complete[^<]*" paths/*/stage-*/module-*.html | sort -u
```

**Test in browser:**
```bash
open paths/curious/stage-1/module-1.html
```

---

## 📝 COMMIT MESSAGES

When you complete each task, use these commit message templates:

**Task 1:**
```
Standardize navigation link types across all modules

- Changed all same-stage links to relative paths (module-2.html)
- Changed all cross-stage links to absolute paths (/paths/curious/stage-2/)
- Updated 45 modules (Builder Stage 3 already fixed)
- Ensures consistent navigation experience
```

**Task 2:**
```
Standardize button text across all modules

- First modules: "Continue to Next Module →"
- Middle modules: "← Previous: [Title]" / "Next: [Title] →"
- Last modules: "Mark Complete & Finish Stage N →"
- Removes confusion from 8 different button text variations
```

**Task 3:**
```
Verify and test navigation consistency

- Tested navigation in browser across all paths
- Verified mobile responsive navigation
- Confirmed all links work correctly
- Navigation standardization complete ✓
```

---

## 🚀 READY TO START?

1. Open this checklist in your editor
2. Mark tasks as you complete them
3. Commit after each major task
4. Test thoroughly before considering complete
5. Update the progress tracker

**You've got this!** The hard work (fixing critical bugs and creating structure) is done. This is just cleanup and polish. 💪

---

**Last Updated:** October 11, 2025
**Created By:** Claude Code
**For:** Dalia Platt
