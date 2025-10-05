/**
 * Privacy-Compliant A/B Testing Framework
 *
 * Features:
 * - Client-side variant assignment (no server tracking required)
 * - localStorage-based persistence (no cookies)
 * - Plausible Analytics integration for results
 * - GDPR compliant (no PII stored)
 */
export class ABTestingFramework {
    constructor() {
        this.tests = new Map();
        this.storageKey = 'btc_academy_ab_tests';
    }
    /**
     * Register a new A/B test
     */
    registerTest(test) {
        // Validate weights sum to 1
        const totalWeight = test.variants.reduce((sum, v) => sum + v.weight, 0);
        if (Math.abs(totalWeight - 1) > 0.01) {
            throw new Error(`Variant weights must sum to 1.0, got ${totalWeight}`);
        }
        this.tests.set(test.testId, test);
    }
    /**
     * Get or assign a variant for a user
     */
    getVariant(testId) {
        const test = this.tests.get(testId);
        if (!test || !test.enabled) {
            return null;
        }
        // Check if test is active
        if (test.startDate && new Date() < test.startDate) {
            return null;
        }
        if (test.endDate && new Date() > test.endDate) {
            return null;
        }
        // Check existing assignment
        const existingAssignment = this.getExistingAssignment(testId);
        if (existingAssignment) {
            const variant = test.variants.find(v => v.variantId === existingAssignment.variantId);
            if (variant) {
                return variant;
            }
        }
        // Check traffic allocation
        if (Math.random() > test.trafficAllocation) {
            return null; // User not in test
        }
        // Assign new variant based on weights
        const variant = this.selectVariant(test.variants);
        this.saveAssignment({
            testId,
            variantId: variant.variantId,
            assignedAt: Date.now(),
            sessionId: this.getOrCreateSessionId()
        });
        return variant;
    }
    /**
     * Track conversion event for A/B test
     */
    trackConversion(testId, eventName, metadata) {
        const assignment = this.getExistingAssignment(testId);
        if (!assignment) {
            return;
        }
        // Send to Plausible as custom event
        this.trackEvent('Conversion', {
            test: testId,
            variant: assignment.variantId,
            event: eventName,
            ...metadata
        });
    }
    /**
     * Generate A/B testing JavaScript for HTML injection
     */
    generateClientScript(testId) {
        const test = this.tests.get(testId);
        if (!test) {
            return '';
        }
        return `
<script>
(function() {
  // A/B Test: ${test.testName}
  const TEST_ID = '${testId}';
  const STORAGE_KEY = 'btc_academy_ab_tests';

  function getStoredTests() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  }

  function storeTestAssignment(testId, variantId) {
    try {
      const tests = getStoredTests();
      tests[testId] = {
        variantId: variantId,
        assignedAt: Date.now(),
        sessionId: getSessionId()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tests));
    } catch (e) {
      console.error('Failed to store A/B test assignment:', e);
    }
  }

  function getSessionId() {
    let sessionId = sessionStorage.getItem('btc_academy_session');
    if (!sessionId) {
      sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('btc_academy_session', sessionId);
    }
    return sessionId;
  }

  function selectVariant(variants) {
    const random = Math.random();
    let cumulative = 0;

    for (const variant of variants) {
      cumulative += variant.weight;
      if (random <= cumulative) {
        return variant;
      }
    }

    return variants[variants.length - 1];
  }

  function trackEvent(eventName, props) {
    if (window.plausible) {
      window.plausible(eventName, { props: props });
    }
  }

  // Check existing assignment
  const stored = getStoredTests();
  let variant;

  if (stored[TEST_ID]) {
    const variantId = stored[TEST_ID].variantId;
    variant = ${JSON.stringify(test.variants)}.find(v => v.variantId === variantId);
  }

  // Assign new variant if needed
  if (!variant) {
    // Check traffic allocation
    if (Math.random() > ${test.trafficAllocation}) {
      return; // User not in test
    }

    variant = selectVariant(${JSON.stringify(test.variants)});
    storeTestAssignment(TEST_ID, variant.variantId);

    // Track assignment
    trackEvent('AB_Test_Assignment', {
      test: TEST_ID,
      variant: variant.variantId
    });
  }

  // Apply variant configuration
  window.ABTest_${testId.replace(/-/g, '_')} = {
    variant: variant.variantId,
    config: variant.config,
    trackConversion: function(eventName, metadata) {
      trackEvent('AB_Test_Conversion', {
        test: TEST_ID,
        variant: variant.variantId,
        event: eventName,
        ...metadata
      });
    }
  };

  // Expose configuration
  console.log('[A/B Test] Active variant:', variant.variantId, variant.config);
})();
</script>
`;
    }
    /**
     * Generate CSS for variant-specific styling
     */
    generateVariantStyles(testId) {
        const test = this.tests.get(testId);
        if (!test) {
            return '';
        }
        let styles = '<style>\n';
        test.variants.forEach(variant => {
            if (variant.config.cssClass) {
                styles += `  [data-ab-${testId}="${variant.variantId}"] { /* Variant: ${variant.variantName} */ }\n`;
            }
        });
        styles += '</style>\n';
        return styles;
    }
    /**
     * Create a simple A/B test configuration
     */
    static createSimpleTest(testId, testName, variantAConfig, variantBConfig, options = {}) {
        const split = options.split ?? 0.5;
        return {
            testId,
            testName,
            variants: [
                {
                    variantId: 'control',
                    variantName: 'Control (A)',
                    weight: split,
                    config: variantAConfig
                },
                {
                    variantId: 'variant',
                    variantName: 'Variant (B)',
                    weight: 1 - split,
                    config: variantBConfig
                }
            ],
            trafficAllocation: options.trafficAllocation ?? 1.0,
            enabled: options.enabled ?? true
        };
    }
    // Private helper methods
    getExistingAssignment(testId) {
        if (typeof window === 'undefined' || !window.localStorage) {
            return null;
        }
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (!stored)
                return null;
            const tests = JSON.parse(stored);
            return tests[testId] || null;
        }
        catch (e) {
            return null;
        }
    }
    saveAssignment(assignment) {
        if (typeof window === 'undefined' || !window.localStorage) {
            return;
        }
        try {
            const stored = localStorage.getItem(this.storageKey);
            const tests = stored ? JSON.parse(stored) : {};
            tests[assignment.testId] = assignment;
            localStorage.setItem(this.storageKey, JSON.stringify(tests));
        }
        catch (e) {
            console.error('Failed to save A/B test assignment:', e);
        }
    }
    selectVariant(variants) {
        const random = Math.random();
        let cumulative = 0;
        for (const variant of variants) {
            cumulative += variant.weight;
            if (random <= cumulative) {
                return variant;
            }
        }
        return variants[variants.length - 1];
    }
    getOrCreateSessionId() {
        if (typeof window === 'undefined' || !window.sessionStorage) {
            return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }
        let sessionId = sessionStorage.getItem('btc_academy_session');
        if (!sessionId) {
            sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('btc_academy_session', sessionId);
        }
        return sessionId;
    }
    trackEvent(eventName, props) {
        if (typeof window !== 'undefined' && window.plausible) {
            window.plausible(eventName, { props });
        }
    }
}
// Export singleton instance
export const abTesting = new ABTestingFramework();
// Example test configurations
export const EXAMPLE_TESTS = {
    // Test different CTA button colors
    ctaButtonColor: ABTestingFramework.createSimpleTest('cta-button-color', 'CTA Button Color Test', { color: 'orange', bgColor: '#f7931a' }, // Control
    { color: 'blue', bgColor: '#3b82f6' }, // Variant
    { split: 0.5, trafficAllocation: 1.0 }),
    // Test different course intro styles
    courseIntroStyle: ABTestingFramework.createSimpleTest('course-intro-style', 'Course Introduction Style', { style: 'text', showVideo: false }, // Control
    { style: 'video', showVideo: true }, // Variant
    { split: 0.5, trafficAllocation: 0.5 } // Only 50% of traffic
    ),
    // Test assessment difficulty
    assessmentDifficulty: ABTestingFramework.createSimpleTest('assessment-difficulty', 'Initial Assessment Difficulty', { difficulty: 'beginner', questionCount: 5 }, { difficulty: 'intermediate', questionCount: 8 }, { split: 0.5, trafficAllocation: 1.0 }),
    // Test pricing display
    pricingDisplay: ABTestingFramework.createSimpleTest('pricing-display', 'Course Pricing Display', { showPrice: true, showDiscount: false, emphasis: 'features' }, { showPrice: true, showDiscount: true, emphasis: 'savings' }, { split: 0.5, trafficAllocation: 1.0 })
};
