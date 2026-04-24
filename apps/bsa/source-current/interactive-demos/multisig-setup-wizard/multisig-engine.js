/**
 * MULTISIG ENGINE
 * Core logic for multisig configuration and validation
 */

class MultisigEngine {
    constructor() {
        this.config = {
            m: 2,
            n: 3,
            keys: [],
            distribution: {},
            threats: []
        };
    }

    /**
     * Set multisig configuration
     */
    setConfig(m, n) {
        if (m > n) {
            throw new Error('m cannot be greater than n');
        }
        if (m < 1 || n < 1) {
            throw new Error('m and n must be positive');
        }
        if (n > 15) {
            throw new Error('n cannot exceed 15 (practical limit)');
        }

        this.config.m = m;
        this.config.n = n;
        this.generateKeys();
    }

    /**
     * Generate key identifiers
     */
    generateKeys() {
        this.config.keys = [];
        for (let i = 1; i <= this.config.n; i++) {
            this.config.keys.push({
                id: `key-${i}`,
                name: `Key ${i}`,
                location: null,
                device: null,
                signed: false
            });
        }
    }

    /**
     * Get recommended configuration based on threats
     */
    getRecommendedConfig(threats, amount) {
        const hasLoss = threats.includes('loss');
        const hasTheft = threats.includes('theft');
        const hasCoercion = threats.includes('coercion');
        const hasCollusion = threats.includes('collusion');

        // Decision matrix
        if (amount === 'very-large') {
            if (hasCollusion) {
                return { m: 4, n: 7, reason: 'Maximum security with high collusion resistance' };
            }
            return { m: 3, n: 5, reason: 'High security for large holdings' };
        }

        if (amount === 'large') {
            if (hasCollusion || hasCoercion) {
                return { m: 3, n: 5, reason: 'Enhanced security with geographic distribution' };
            }
            return { m: 2, n: 3, reason: 'Balanced security for substantial holdings' };
        }

        if (amount === 'medium') {
            if (hasLoss && hasTheft) {
                return { m: 2, n: 3, reason: 'Standard multisig provides both loss and theft protection' };
            }
            if (hasTheft) {
                return { m: 2, n: 2, reason: 'Two-party approval prevents unauthorized access' };
            }
            return { m: 2, n: 3, reason: 'Recommended for most users' };
        }

        // Small amount
        if (hasLoss || hasTheft) {
            return { m: 2, n: 3, reason: 'Entry-level multisig for learning' };
        }

        return { m: 1, n: 1, reason: 'Single-sig may be sufficient for small amounts' };
    }

    /**
     * Validate key distribution
     */
    validateDistribution(distribution) {
        const locations = Object.keys(distribution);
        const issues = [];
        const warnings = [];

        // Check all keys are distributed
        const distributedKeys = Object.values(distribution).flat();
        if (distributedKeys.length < this.config.n) {
            issues.push(`Only ${distributedKeys.length} of ${this.config.n} keys distributed`);
        }

        // Check for single location
        if (locations.length === 1) {
            warnings.push('All keys in one location - vulnerable to loss/theft at that location');
        }

        // Check for geographic diversity
        const homeKeys = distribution['home'] || [];
        if (homeKeys.length >= this.config.m) {
            warnings.push(`${homeKeys.length} keys at home - meets threshold, vulnerable to single-location attack`);
        }

        // Recommendations
        const recommendations = [];
        if (locations.length < 2) {
            recommendations.push('Distribute keys across at least 2-3 physical locations');
        }

        if (!distribution['bank'] && !distribution['attorney']) {
            recommendations.push('Consider storing one key with a trusted third party or safe deposit box');
        }

        return { issues, warnings, recommendations, valid: issues.length === 0 };
    }

    /**
     * Calculate security score
     */
    calculateSecurityScore() {
        let score = 0;

        // Base score from configuration
        const redundancy = this.config.n - this.config.m;
        score += redundancy * 15; // 15 points per redundant key

        // Threshold requirement
        if (this.config.m >= 2) score += 25;
        if (this.config.m >= 3) score += 15;

        // Distribution diversity
        const locations = Object.keys(this.config.distribution).length;
        score += Math.min(locations * 10, 30); // Up to 30 points for location diversity

        // Device diversity (placeholder - would check actual devices)
        if (this.config.n >= 3) score += 10;

        return Math.min(score, 100);
    }

    /**
     * Get configuration summary
     */
    getSummary() {
        return {
            config: `${this.config.m}-of-${this.config.n}`,
            m: this.config.m,
            n: this.config.n,
            redundancy: this.config.n - this.config.m,
            canLoseKeys: this.config.n - this.config.m,
            protectedFrom: this.config.m - 1,
            securityScore: this.calculateSecurityScore()
        };
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MultisigEngine;
}
