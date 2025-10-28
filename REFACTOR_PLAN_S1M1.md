# S1M1 Refactoring Plan - Curious Path Module 1

## Overview
Refactor `paths/curious/stage-1/module-1.html` to use shared CSS and JS frameworks while preserving ALL content, links, and functionality.

## File Statistics
- **Original**: 2,125 lines
- **Estimated after refactoring**: ~1,300 lines (38% reduction)
- **Backup created**: `module-1.html.backup`

## Changes Summary

### 1. CSS Replacement (Lines 9-469 → 1 line)

**REMOVE** (460 lines of inline CSS):
- CSS variables definition (lines 10-18)
- Reset and base styles (lines 20-31)
- Module header styles (lines 39-82)
- Content section styles (lines 84-104)
- Timeline styles (lines 105-138)
- Property comparison styles (lines 139-213)
- Quiz/retention activity styles (lines 214-318)
- Navigation styles (lines 320-362)
- Takeaways, tooltips, responsive (lines 363-468)

**REPLACE WITH**:
```html
<link rel="stylesheet" href="/css/curious-modules.css">
```

**KEEP** (Module-specific styles):
- Energy demo container styles (lines 543-828)
- Interactive timeline styles (lines 1135-1426)
- Property tile styles (lines 1681-1820)

### 2. JavaScript Replacement (Lines 1932-2122 → ~40 lines)

**REMOVE** (190 lines of inline retention activity JS):
- Activity 1: Drag-to-Order (lines 1936-1992) - 57 lines
- Activity 2: Tap-to-Reveal (lines 1994-2014) - 21 lines
- Activity 3: Confidence Meter (lines 2016-2049) - 34 lines
- checkAllActivitiesComplete() (lines 2051-2074) - 24 lines
- Progress tracking functions (lines 2076-2121) - 46 lines

**REPLACE WITH**:
```html
<script src="/js/retention-activities.js"></script>
<script>
// Initialize retention activities on page load
document.addEventListener('DOMContentLoaded', () => {
    // Activity 1: Drag-to-Order
    initDragToOrder(
        'order-evolution',
        ['1', '2', '3', '4'],
        'retention.curious.s1.m1.dragOrder.v1'
    );

    // Activity 2: Tap-to-Reveal Cards
    initTapCards(
        '.tapcard',
        'retention.curious.s1.m1.tapcard'
    );

    // Activity 3: Confidence Meter
    initConfidenceMeter(
        'conf-barter-slider',
        'conf-barter-val',
        'get-barter-hint',
        'barter-hint',
        (value) => {
            if (value < 34) {
                return '💭 Think about a farmer scenario: You have wheat, you need shoes. The shoemaker wants milk, not wheat. You\'re stuck! That\'s the double coincidence problem. Money solves this by being universally accepted.';
            } else if (value < 67) {
                return '💡 You\'re getting there! Example: Instead of finding someone who wants wheat AND has shoes, you sell wheat for money, then buy shoes with money. Money breaks the chain of needing exact matches.';
            } else {
                return '🎯 You\'ve got it! The key insight: Barter requires BOTH people to want what the other has (double coincidence). Money only requires ONE person to want what you have. You can then use money to buy what you want from anyone.';
            }
        },
        'retention.curious.s1.m1.confMeter.v1'
    );

    // Check completion and enable next module
    enableNextModule(
        'next-module',
        [
            'retention.curious.s1.m1.dragOrder.v1',
            'retention.curious.s1.m1.tapcard.0',
            'retention.curious.s1.m1.tapcard.1',
            'retention.curious.s1.m1.tapcard.2',
            'retention.curious.s1.m1.tapcard.3',
            'retention.curious.s1.m1.confMeter.v1'
        ],
        'Great job engaging with the material. You can now proceed to Module 2.'
    );

    // Save module progress on completion
    const completionKey = 'completion.next-module';
    if (checkAllActivitiesComplete([
        'retention.curious.s1.m1.dragOrder.v1',
        'retention.curious.s1.m1.tapcard.0',
        'retention.curious.s1.m1.tapcard.1',
        'retention.curious.s1.m1.tapcard.2',
        'retention.curious.s1.m1.tapcard.3',
        'retention.curious.s1.m1.confMeter.v1'
    ])) {
        saveModuleProgress('curious', 1, 1);
    }

    // Show completion notice if already done
    showCompletionNotice('curious', 1, 1, 'next-module');
});
</script>
```

### 3. localStorage Key Migration

**OLD KEYS** (will continue to work for backward compatibility):
- `retention.orderEvolution.v1`
- `retention.tapcard.0`, `retention.tapcard.1`, `retention.tapcard.2`, `retention.tapcard.3`
- `retention.confBarter.v1`
- `retention.s1m1.completed`

**NEW STANDARDIZED KEYS**:
- `retention.curious.s1.m1.dragOrder.v1`
- `retention.curious.s1.m1.tapcard.0`, `.1`, `.2`, `.3`
- `retention.curious.s1.m1.confMeter.v1`
- `completion.next-module`

**Migration Strategy**: Shared JS will use new keys, but we'll add a one-time migration script to copy old data to new keys for existing users.

## Content Preservation Checklist

### ✅ ALL CONTENT PRESERVED:
- [x] Breadcrumb navigation (Home / Curious Path / Stage 1)
- [x] Module title and meta information
- [x] Socratic introduction section
- [x] Work to Money Interactive Demo (Frame 1-3 with buckets)
- [x] Socratic Reflection Question box
- [x] Conceptual Bridge section
- [x] Evolution of Money Interactive Timeline (6 eras)
- [x] Transition: From Timeline to Properties
- [x] 6 Properties Interactive Tiles
- [x] "The Story So Far" conclusion section
- [x] "But..." leak visualization
- [x] Retention Activities section:
  - Activity 1: Drag-to-Order (Evolution of Money)
  - Activity 2: Tap-to-Reveal (4 cards)
  - Activity 3: Confidence Meter (Barter problem)
- [x] Navigation buttons (Back to Stage 1 / Next Module)

### ✅ ALL INTERACTIVE ELEMENTS PRESERVED:
- [x] Work & Earn demo (Frame 1)
- [x] Time passage demo (Frame 2)
- [x] Trade across space demo (Frame 3)
- [x] Timeline era expansion (6 clickable eras)
- [x] Property tile expansion (6 tiles)
- [x] Drag-to-order chips (4 items)
- [x] Tap-to-reveal cards (4 cards)
- [x] Confidence slider with hints
- [x] Next module gating (disabled until activities complete)

### ✅ ALL LINKS PRESERVED:
```
Breadcrumb Links:
- href="/" → Home
- href="/paths/curious/" → The Curious Path
- href="/paths/curious/stage-1/" → Stage 1

Navigation Links:
- href="/paths/curious/stage-1/" → Back to Stage 1
- href="module-2.html" → Next: Problems with Traditional Money
```

### ✅ ALL SCRIPTS PRESERVED:
- [x] Energy demo JavaScript (lines 971-1100) - Module-specific, KEEP
- [x] Timeline toggle JavaScript (lines 1624-1660) - Module-specific, KEEP
- [x] Property tile toggle JavaScript (lines 1804-1818) - Module-specific, KEEP
- [x] Module gate script reference: `<script src="/js/module-gate.js" defer></script>` - KEEP

## HTML Structure Changes

### HEAD Section
**BEFORE**:
```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>What is Money? | The Curious Path</title>
    <meta name="description" content="...">

    <style>
        /* 460 lines of CSS */
    </style>
</head>
```

**AFTER**:
```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>What is Money? | The Curious Path</title>
    <meta name="description" content="...">

    <!-- Shared Curious Path Styles -->
    <link rel="stylesheet" href="/css/curious-modules.css">

    <style>
        /* Module-specific demo styles only (~260 lines) */
    </style>
</head>
```

### BODY End Scripts
**BEFORE**:
```html
    <script>
        // 190 lines of retention activity JavaScript
    </script>
    <script src="/js/module-gate.js" defer></script>
</body>
```

**AFTER**:
```html
    <!-- Shared Retention Activities -->
    <script src="/js/retention-activities.js"></script>

    <script>
        // ~40 lines initialization code
    </script>

    <script src="/js/module-gate.js" defer></script>
</body>
```

## Testing Checklist

After refactoring, verify:

### Functionality Tests:
- [ ] Drag-to-order activity works (can drag chips, check order shows feedback)
- [ ] Tap-to-reveal cards work (click reveals answer, saves to localStorage)
- [ ] Confidence slider works (updates value, hint button provides feedback)
- [ ] All activities save to localStorage correctly
- [ ] "Next Module" button unlocks after all 3 activities complete
- [ ] Completion banner appears when done
- [ ] Module progress saves to learningProgress object

### Content Tests:
- [ ] All text content displays correctly
- [ ] All interactive demos function (work & earn, timeline, property tiles)
- [ ] All sections render properly
- [ ] No broken layouts or missing styles

### Link Tests:
- [ ] Breadcrumb links work (Home, Curious Path, Stage 1)
- [ ] "Back to Stage 1" button works
- [ ] "Next Module" button links to module-2.html
- [ ] All internal section references intact

### Compatibility Tests:
- [ ] Existing localStorage keys are migrated/recognized
- [ ] Users who already completed module see completion notice
- [ ] Progress tracking continues to work with learningProgress

### Visual Tests:
- [ ] Page looks identical to original
- [ ] Responsive design works on mobile
- [ ] All colors, spacing, animations preserved
- [ ] No CSS conflicts or missing styles

## Benefits of Refactoring

1. **Code Reduction**: 825 lines removed (38% smaller file)
2. **Maintainability**: One CSS/JS source for all modules
3. **Consistency**: Same activity behavior across all Curious modules
4. **Performance**: Shared CSS/JS cached across pages
5. **Accessibility**: Built-in ARIA support from shared code
6. **Standardization**: Uniform localStorage key patterns

## Risk Mitigation

1. **Backup created**: Original saved as `module-1.html.backup`
2. **Side-by-side comparison**: New version created separately first
3. **Incremental testing**: Test each activity type individually
4. **Backward compatibility**: Old localStorage keys still work
5. **Easy rollback**: Can restore from backup instantly

## Timeline

1. **Create refactored file**: 15-20 minutes
2. **Side-by-side verification**: 10 minutes
3. **Testing**: 10 minutes
4. **Approval & replacement**: 5 minutes
5. **Commit**: 5 minutes

**Total estimated time**: 40-50 minutes

## Approval Required

Before proceeding with refactoring, please confirm:
- [ ] Plan looks accurate and comprehensive
- [ ] All content preservation points are acceptable
- [ ] Testing checklist covers all concerns
- [ ] Ready to create refactored version for comparison

---

**Status**: ⏳ Awaiting approval to proceed with refactoring
