# A/B Testing Framework Guide

## Overview

Privacy-compliant A/B testing framework for Bitcoin Sovereign Academy. Features:

- ✅ **Privacy-first**: Uses localStorage (no cookies), no PII stored
- ✅ **GDPR compliant**: Client-side assignment, no server tracking
- ✅ **Plausible integration**: Results tracked via privacy-friendly analytics
- ✅ **Session persistence**: Consistent experience across page views
- ✅ **Weighted distribution**: Control traffic split per variant

## Quick Start

### 1. Define an A/B Test

```typescript
import { ABTestingFramework } from './utils/ab-testing';

const abTesting = new ABTestingFramework();

// Simple 50/50 split test
const buttonColorTest = ABTestingFramework.createSimpleTest(
  'cta-button-color',
  'CTA Button Color Test',
  { color: 'orange', bgColor: '#f7931a' }, // Control (50%)
  { color: 'blue', bgColor: '#3b82f6' },   // Variant (50%)
  { split: 0.5, trafficAllocation: 1.0 }
);

abTesting.registerTest(buttonColorTest);
```

### 2. Add to HTML Template

```html
<!-- In <head> section -->
<script defer data-domain="bitcoinsovereign.academy" src="https://plausible.io/js/script.js"></script>

<!-- A/B Testing Script -->
${abTesting.generateClientScript('cta-button-color')}
```

### 3. Apply Variant Configuration

```javascript
// Apply styling based on variant
window.addEventListener('load', () => {
  if (window.ABTest_cta_button_color) {
    const variant = window.ABTest_cta_button_color;

    // Apply variant config
    const ctaSection = document.getElementById('cta-section');
    ctaSection.style.background = variant.config.bgColor;

    console.log('Active variant:', variant.variant);
  }
});
```

### 4. Track Conversions

```javascript
function trackCTAClick(action) {
  // Track conversion in A/B test
  if (window.ABTest_cta_button_color) {
    window.ABTest_cta_button_color.trackConversion('cta_click', {
      action: action
    });
  }

  // Also track regular event
  if (window.plausible) {
    window.plausible('CTA_Click', { props: { action: action } });
  }
}
```

## Advanced Configuration

### Multi-Variant Testing (A/B/C)

```typescript
const multiVariantTest: ABTest = {
  testId: 'pricing-display',
  testName: 'Pricing Page Layout Test',
  variants: [
    {
      variantId: 'control',
      variantName: 'Standard Layout',
      weight: 0.33,
      config: { layout: 'vertical', emphasis: 'features' }
    },
    {
      variantId: 'variant_a',
      variantName: 'Horizontal Layout',
      weight: 0.33,
      config: { layout: 'horizontal', emphasis: 'features' }
    },
    {
      variantId: 'variant_b',
      variantName: 'Comparison Table',
      weight: 0.34,
      config: { layout: 'table', emphasis: 'comparison' }
    }
  ],
  trafficAllocation: 0.8, // Only 80% of users in test
  startDate: new Date('2025-01-01'),
  endDate: new Date('2025-02-01'),
  enabled: true
};

abTesting.registerTest(multiVariantTest);
```

### Traffic Allocation

Control what percentage of users see the test:

```typescript
const test = ABTestingFramework.createSimpleTest(
  'experimental-feature',
  'Experimental Feature Test',
  { showFeature: false },
  { showFeature: true },
  {
    split: 0.5,
    trafficAllocation: 0.2  // Only 20% of users see this test
  }
);
```

### Time-Limited Tests

```typescript
const test: ABTest = {
  testId: 'holiday-promotion',
  testName: 'Holiday Promotion Banner',
  variants: [/* ... */],
  trafficAllocation: 1.0,
  startDate: new Date('2025-12-01'),
  endDate: new Date('2025-12-31'),
  enabled: true
};
```

## Example Tests

### 1. CTA Button Color

**Hypothesis**: Blue buttons increase conversions over orange

```typescript
const ctaButtonColor = ABTestingFramework.createSimpleTest(
  'cta-button-color',
  'CTA Button Color Test',
  { color: 'orange', bgColor: '#f7931a' },
  { color: 'blue', bgColor: '#3b82f6' },
  { split: 0.5, trafficAllocation: 1.0 }
);
```

**Apply variant:**
```javascript
if (window.ABTest_cta_button_color) {
  const bg = window.ABTest_cta_button_color.config.bgColor;
  document.querySelector('.cta-section').style.background = bg;
}
```

### 2. Course Introduction Style

**Hypothesis**: Video intros increase engagement over text

```typescript
const courseIntroStyle = ABTestingFramework.createSimpleTest(
  'course-intro-style',
  'Course Introduction Style',
  { style: 'text', showVideo: false },
  { style: 'video', showVideo: true },
  { split: 0.5, trafficAllocation: 0.5 }
);
```

**Apply variant:**
```javascript
if (window.ABTest_course_intro_style) {
  const config = window.ABTest_course_intro_style.config;

  if (config.showVideo) {
    document.getElementById('intro-video').style.display = 'block';
    document.getElementById('intro-text').style.display = 'none';
  }
}
```

### 3. Assessment Difficulty

**Hypothesis**: Slightly harder assessments improve retention

```typescript
const assessmentDifficulty = ABTestingFramework.createSimpleTest(
  'assessment-difficulty',
  'Initial Assessment Difficulty',
  { difficulty: 'beginner', questionCount: 5 },
  { difficulty: 'intermediate', questionCount: 8 },
  { split: 0.5, trafficAllocation: 1.0 }
);
```

**Apply variant:**
```typescript
// Server-side: adjust assessment generation
const variant = abTesting.getVariant('assessment-difficulty');
if (variant) {
  assessmentConfig.difficulty = variant.config.difficulty;
  assessmentConfig.questionCount = variant.config.questionCount;
}
```

## Viewing Results in Plausible

The framework automatically tracks these events to Plausible:

### 1. Assignment Events
- Event: `AB_Test_Assignment`
- Properties:
  - `test`: Test ID
  - `variant`: Variant ID

### 2. Conversion Events
- Event: `AB_Test_Conversion`
- Properties:
  - `test`: Test ID
  - `variant`: Variant ID
  - `event`: Conversion event name
  - Custom metadata

### 3. Regular Events
- Event: `CTA_Click`, `Page_View`, etc.
- Tracked separately for baseline metrics

### Example Plausible Query

In Plausible dashboard:

1. **Filter by custom property**: `test = cta-button-color`
2. **Group by**: `variant`
3. **Compare**: `AB_Test_Conversion` events

Calculate conversion rate:
```
Conversion Rate = (Conversions / Assignments) × 100
```

## Privacy & Compliance

### Data Stored Locally

```json
{
  "cta-button-color": {
    "variantId": "variant",
    "assignedAt": 1704067200000,
    "sessionId": "sess_1704067200000_abc123"
  }
}
```

**Storage location**: `localStorage.btc_academy_ab_tests`

### No PII Collected

- ❌ No user IDs
- ❌ No email addresses
- ❌ No IP tracking
- ✅ Anonymous session IDs
- ✅ Client-side assignment
- ✅ No server-side tracking

### GDPR Compliance

- User can clear localStorage anytime
- No cross-site tracking
- No cookies used
- Data stays on user's device
- Plausible is GDPR-compliant by default

## Best Practices

### 1. Test One Thing at a Time

❌ Bad:
```typescript
// Testing multiple changes at once
{ buttonColor: 'blue', fontSize: '18px', text: 'Buy Now' }
{ buttonColor: 'orange', fontSize: '16px', text: 'Get Started' }
```

✅ Good:
```typescript
// Test button color only
{ buttonColor: 'blue' }
{ buttonColor: 'orange' }
```

### 2. Set Minimum Sample Size

Wait for statistical significance:
- Minimum: 100 conversions per variant
- Recommended: 300+ conversions per variant
- Confidence level: 95%

### 3. Run Tests Long Enough

- Minimum: 1 week
- Recommended: 2-4 weeks
- Consider day-of-week effects
- Watch for novelty effects

### 4. Document Hypotheses

```typescript
const test = {
  testId: 'pricing-emphasis',
  testName: 'Pricing Page Emphasis',

  // Document your hypothesis
  hypothesis: 'Emphasizing savings over features increases conversions by 20%',
  successMetric: 'Enrollment conversions',
  minimumSampleSize: 300,

  variants: [/* ... */]
};
```

### 5. Monitor Both Metrics

Track both:
- **Primary metric**: Main conversion goal
- **Secondary metrics**: Engagement, bounce rate, time on page

## Troubleshooting

### Test Not Showing

```javascript
// Debug in browser console
console.log(localStorage.getItem('btc_academy_ab_tests'));
console.log(window.ABTest_cta_button_color);
```

### Reset Test Assignment

```javascript
// In browser console
localStorage.removeItem('btc_academy_ab_tests');
location.reload();
```

### Check Traffic Allocation

Only `trafficAllocation` percentage of users see the test:
```typescript
trafficAllocation: 0.5  // 50% of users see test
trafficAllocation: 1.0  // 100% of users see test
```

## Migration Guide

### From Cookie-Based Testing

1. **Remove cookie-setting code**
2. **Import new framework**: `import { abTesting } from './utils/ab-testing'`
3. **Register tests**: `abTesting.registerTest(myTest)`
4. **Update tracking**: Use `trackConversion()` method
5. **Update analytics**: Configure Plausible custom events

### Adding to Existing Pages

1. Add Plausible script
2. Add A/B testing script: `abTesting.generateClientScript(testId)`
3. Apply variant in page load
4. Add conversion tracking to CTAs

## Example: Full Implementation

```html
<!DOCTYPE html>
<html>
<head>
  <title>Bitcoin Sovereign Academy</title>

  <!-- Plausible Analytics -->
  <script defer data-domain="bitcoinsovereign.academy"
          src="https://plausible.io/js/script.js"></script>

  <!-- A/B Testing -->
  <script>
  (function() {
    const TEST_ID = 'cta-button-color';
    // ... A/B testing framework code ...
  })();
  </script>

  <style>
    .cta-button { padding: 12px 30px; border-radius: 25px; }
  </style>
</head>
<body>
  <button class="cta-button" id="primary-cta"
          onclick="handleCTAClick()">
    Start Learning
  </button>

  <script>
    // Apply variant styling
    window.addEventListener('load', () => {
      if (window.ABTest_cta_button_color) {
        const variant = window.ABTest_cta_button_color;
        const button = document.getElementById('primary-cta');
        button.style.background = variant.config.bgColor;
      }
    });

    // Track conversions
    function handleCTAClick() {
      if (window.ABTest_cta_button_color) {
        window.ABTest_cta_button_color.trackConversion('cta_click');
      }

      // Navigate to course
      window.location.href = '/courses';
    }
  </script>
</body>
</html>
```

## Support

Questions? Check:
- Implementation: `src/utils/ab-testing.ts`
- Examples: `src/cases/complete_system_demo.ts`
- Plausible docs: https://plausible.io/docs
