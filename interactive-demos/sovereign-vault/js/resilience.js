/**
 * Sovereign Vault - Resilience Scoring Engine
 * 
 * Calculates a comprehensive resilience score based on:
 * - Backup redundancy (multiple copies)
 * - Geographic distribution (different locations)
 * - Media diversity (different backup formats)
 * - Verification recency (recently checked backups)
 * - Inheritance plan completeness
 * - Single point of failure analysis
 */

const VaultResilience = (function() {
    'use strict';

    // Scoring weights (total = 100)
    const WEIGHTS = {
        backupRedundancy: 25,      // Multiple backup copies
        geographicDistribution: 20, // Spread across locations
        mediaDiversity: 15,         // Different backup media types
        verificationRecency: 15,    // Recently verified backups
        inheritancePlan: 15,        // Complete inheritance setup
        singlePointAnalysis: 10     // No single points of failure
    };

    // Scoring thresholds
    const THRESHOLDS = {
        backups: {
            excellent: 3,  // 3+ backups per wallet
            good: 2,       // 2 backups
            fair: 1        // 1 backup
        },
        locations: {
            excellent: 3,  // 3+ unique locations
            good: 2,       // 2 locations
            fair: 1        // 1 location
        },
        mediaTypes: {
            excellent: 3,  // 3+ different media types
            good: 2,       // 2 types
            fair: 1        // 1 type
        },
        verificationDays: {
            excellent: 90,  // Within 3 months
            good: 180,      // Within 6 months
            fair: 365       // Within 1 year
        }
    };

    // Risk levels for single point of failure
    const RISK_LEVELS = {
        critical: { label: 'Critical', color: '#ef4444', weight: 0 },
        high: { label: 'High', color: '#f97316', weight: 25 },
        medium: { label: 'Medium', color: '#eab308', weight: 50 },
        low: { label: 'Low', color: '#22c55e', weight: 100 }
    };

    /**
     * Calculate backup redundancy score
     */
    function calculateBackupRedundancy(wallets, backups) {
        if (wallets.length === 0) return { score: 0, details: 'No wallets configured' };

        let totalScore = 0;
        const walletDetails = [];

        wallets.forEach(wallet => {
            const walletBackups = backups.filter(b => b.walletId === wallet.id);
            const backupCount = walletBackups.length;

            let walletScore;
            if (backupCount >= THRESHOLDS.backups.excellent) {
                walletScore = 100;
            } else if (backupCount >= THRESHOLDS.backups.good) {
                walletScore = 75;
            } else if (backupCount >= THRESHOLDS.backups.fair) {
                walletScore = 40;
            } else {
                walletScore = 0;
            }

            totalScore += walletScore;
            walletDetails.push({
                wallet: wallet.name,
                backupCount,
                score: walletScore
            });
        });

        const averageScore = totalScore / wallets.length;

        return {
            score: averageScore,
            details: walletDetails,
            recommendation: averageScore < 75 ? 
                'Add more backup copies for better redundancy' : null
        };
    }

    /**
     * Calculate geographic distribution score
     */
    function calculateGeographicDistribution(backups, locations) {
        if (backups.length === 0) return { score: 0, details: 'No backups configured' };

        // Get unique location IDs from backups
        const usedLocationIds = [...new Set(backups.map(b => b.locationId).filter(Boolean))];
        const usedLocations = locations.filter(l => usedLocationIds.includes(l.id));

        // Count unique geographic regions
        const regions = [...new Set(usedLocations.map(l => l.geographicRegion))];
        const regionCount = regions.length;

        // Count unique location categories
        const categories = [...new Set(usedLocations.map(l => l.category))];

        let score;
        if (regionCount >= THRESHOLDS.locations.excellent) {
            score = 100;
        } else if (regionCount >= THRESHOLDS.locations.good) {
            score = 70;
        } else if (regionCount >= THRESHOLDS.locations.fair) {
            score = 40;
        } else {
            score = 0;
        }

        // Bonus for having international locations
        if (regions.includes('international')) {
            score = Math.min(100, score + 10);
        }

        return {
            score,
            details: {
                locationCount: usedLocations.length,
                regionCount,
                regions,
                categories
            },
            recommendation: regionCount < 2 ? 
                'Store backups in multiple geographic regions' : null
        };
    }

    /**
     * Calculate media diversity score
     */
    function calculateMediaDiversity(backups) {
        if (backups.length === 0) return { score: 0, details: 'No backups configured' };

        // Get unique media types
        const mediaTypes = [...new Set(backups.map(b => b.mediaType))];
        const typeCount = mediaTypes.length;

        // Check for fireproof backups
        const hasFireproof = backups.some(b => 
            ['steel', 'cryptosteel'].includes(b.mediaType)
        );

        // Check for hardware wallets
        const hasHardwareWallet = mediaTypes.includes('hardware_wallet');

        let score;
        if (typeCount >= THRESHOLDS.mediaTypes.excellent) {
            score = 100;
        } else if (typeCount >= THRESHOLDS.mediaTypes.good) {
            score = 70;
        } else if (typeCount >= THRESHOLDS.mediaTypes.fair) {
            score = 40;
        } else {
            score = 0;
        }

        // Bonuses
        if (hasFireproof) score = Math.min(100, score + 10);
        if (hasHardwareWallet) score = Math.min(100, score + 5);

        return {
            score,
            details: {
                mediaTypes,
                typeCount,
                hasFireproof,
                hasHardwareWallet
            },
            recommendation: !hasFireproof ? 
                'Consider adding a fireproof backup (steel/cryptosteel)' : null
        };
    }

    /**
     * Calculate verification recency score
     */
    function calculateVerificationRecency(backups) {
        if (backups.length === 0) return { score: 0, details: 'No backups configured' };

        const now = new Date();
        let totalScore = 0;
        const backupDetails = [];

        backups.forEach(backup => {
            let daysSinceVerification;
            let backupScore;

            if (!backup.lastVerified) {
                daysSinceVerification = Infinity;
                backupScore = 0;
            } else {
                const lastVerified = new Date(backup.lastVerified);
                daysSinceVerification = Math.floor((now - lastVerified) / (1000 * 60 * 60 * 24));

                if (daysSinceVerification <= THRESHOLDS.verificationDays.excellent) {
                    backupScore = 100;
                } else if (daysSinceVerification <= THRESHOLDS.verificationDays.good) {
                    backupScore = 75;
                } else if (daysSinceVerification <= THRESHOLDS.verificationDays.fair) {
                    backupScore = 50;
                } else {
                    backupScore = 20;
                }
            }

            totalScore += backupScore;
            backupDetails.push({
                backupId: backup.id,
                daysSinceVerification,
                score: backupScore,
                needsVerification: daysSinceVerification > THRESHOLDS.verificationDays.fair
            });
        });

        const averageScore = totalScore / backups.length;
        const needsVerification = backupDetails.filter(b => b.needsVerification).length;

        return {
            score: averageScore,
            details: backupDetails,
            needsVerificationCount: needsVerification,
            recommendation: needsVerification > 0 ? 
                `${needsVerification} backup(s) need verification` : null
        };
    }

    /**
     * Calculate inheritance plan completeness score
     */
    function calculateInheritancePlan(heirs, inheritancePlan, wallets) {
        let score = 0;
        const checklist = [];

        // Has at least one heir defined (25 points)
        if (heirs.length > 0) {
            score += 25;
            checklist.push({ item: 'Heirs defined', complete: true });
        } else {
            checklist.push({ item: 'Heirs defined', complete: false });
        }

        // Has instructions (25 points)
        if (inheritancePlan.instructions && inheritancePlan.instructions.length > 100) {
            score += 25;
            checklist.push({ item: 'Recovery instructions written', complete: true });
        } else {
            checklist.push({ item: 'Recovery instructions written', complete: false });
        }

        // Access mode configured (15 points)
        if (inheritancePlan.accessMode) {
            score += 15;
            checklist.push({ item: 'Access mode configured', complete: true });
        } else {
            checklist.push({ item: 'Access mode configured', complete: false });
        }

        // Dead man's switch configured (20 points)
        if (inheritancePlan.deadManSwitch && inheritancePlan.deadManSwitch.enabled) {
            score += 20;
            checklist.push({ item: "Dead man's switch enabled", complete: true });
        } else {
            checklist.push({ item: "Dead man's switch enabled", complete: false });
        }

        // All wallets have heir access defined (15 points)
        if (wallets.length > 0 && heirs.length > 0) {
            const walletsWithHeirAccess = wallets.filter(w => 
                heirs.some(h => h.walletAccess && h.walletAccess.includes(w.id))
            );
            if (walletsWithHeirAccess.length === wallets.length) {
                score += 15;
                checklist.push({ item: 'All wallets assigned to heirs', complete: true });
            } else {
                checklist.push({ item: 'All wallets assigned to heirs', complete: false });
            }
        } else {
            checklist.push({ item: 'All wallets assigned to heirs', complete: false });
        }

        const incompleteItems = checklist.filter(c => !c.complete);

        return {
            score,
            details: checklist,
            recommendation: incompleteItems.length > 0 ? 
                `Complete: ${incompleteItems[0].item}` : null
        };
    }

    /**
     * Analyze single points of failure
     */
    function analyzeSinglePointsOfFailure(wallets, backups, locations, heirs) {
        const issues = [];

        // Check for wallets with no backups
        wallets.forEach(wallet => {
            const walletBackups = backups.filter(b => b.walletId === wallet.id);
            if (walletBackups.length === 0) {
                issues.push({
                    type: 'no_backup',
                    severity: 'critical',
                    message: `Wallet "${wallet.name}" has no backups`,
                    walletId: wallet.id
                });
            } else if (walletBackups.length === 1) {
                issues.push({
                    type: 'single_backup',
                    severity: 'high',
                    message: `Wallet "${wallet.name}" has only one backup`,
                    walletId: wallet.id
                });
            }
        });

        // Check for all backups in single location
        const usedLocationIds = [...new Set(backups.map(b => b.locationId).filter(Boolean))];
        if (usedLocationIds.length === 1 && backups.length > 1) {
            issues.push({
                type: 'single_location',
                severity: 'high',
                message: 'All backups are stored in a single location'
            });
        }

        // Check for all backups using same media
        const usedMediaTypes = [...new Set(backups.map(b => b.mediaType))];
        if (usedMediaTypes.length === 1 && backups.length > 1) {
            issues.push({
                type: 'single_media',
                severity: 'medium',
                message: 'All backups use the same media type'
            });
        }

        // Check for no fireproof backups
        const hasFireproof = backups.some(b => ['steel', 'cryptosteel'].includes(b.mediaType));
        if (!hasFireproof && backups.length > 0) {
            issues.push({
                type: 'no_fireproof',
                severity: 'medium',
                message: 'No fireproof backup media configured'
            });
        }

        // Check for no heirs
        if (heirs.length === 0 && wallets.length > 0) {
            issues.push({
                type: 'no_heirs',
                severity: 'high',
                message: 'No heirs configured for inheritance'
            });
        }

        // Check for single heir (potential SPOF)
        if (heirs.length === 1) {
            issues.push({
                type: 'single_heir',
                severity: 'medium',
                message: 'Only one heir configured - consider adding backup heir'
            });
        }

        // Calculate score based on issues
        let score = 100;
        issues.forEach(issue => {
            switch (issue.severity) {
                case 'critical':
                    score -= 40;
                    break;
                case 'high':
                    score -= 25;
                    break;
                case 'medium':
                    score -= 15;
                    break;
            }
        });

        score = Math.max(0, score);

        // Determine overall risk level
        let riskLevel;
        if (issues.some(i => i.severity === 'critical')) {
            riskLevel = RISK_LEVELS.critical;
        } else if (issues.some(i => i.severity === 'high')) {
            riskLevel = RISK_LEVELS.high;
        } else if (issues.some(i => i.severity === 'medium')) {
            riskLevel = RISK_LEVELS.medium;
        } else {
            riskLevel = RISK_LEVELS.low;
        }

        return {
            score,
            issues,
            riskLevel,
            recommendation: issues.length > 0 ? issues[0].message : null
        };
    }

    /**
     * Calculate overall resilience score
     */
    function calculateResilienceScore() {
        // Get current vault data
        const vaultData = VaultCore.getVaultData();
        if (!vaultData) {
            return {
                totalScore: 0,
                breakdown: {},
                recommendations: ['Unlock vault to calculate resilience score']
            };
        }

        const { wallets, backups, locations, heirs, inheritancePlan } = vaultData;

        // Calculate individual scores
        const backupRedundancy = calculateBackupRedundancy(wallets, backups);
        const geographicDist = calculateGeographicDistribution(backups, locations);
        const mediaDiversity = calculateMediaDiversity(backups);
        const verificationRecency = calculateVerificationRecency(backups);
        const inheritancePlanScore = calculateInheritancePlan(heirs, inheritancePlan, wallets);
        const spofAnalysis = analyzeSinglePointsOfFailure(wallets, backups, locations, heirs);

        // Calculate weighted total
        const totalScore = Math.round(
            (backupRedundancy.score * WEIGHTS.backupRedundancy +
             geographicDist.score * WEIGHTS.geographicDistribution +
             mediaDiversity.score * WEIGHTS.mediaDiversity +
             verificationRecency.score * WEIGHTS.verificationRecency +
             inheritancePlanScore.score * WEIGHTS.inheritancePlan +
             spofAnalysis.score * WEIGHTS.singlePointAnalysis) / 100
        );

        // Collect recommendations
        const recommendations = [
            backupRedundancy.recommendation,
            geographicDist.recommendation,
            mediaDiversity.recommendation,
            verificationRecency.recommendation,
            inheritancePlanScore.recommendation,
            spofAnalysis.recommendation
        ].filter(Boolean);

        // Determine score label and color
        let scoreLabel, scoreColor;
        if (totalScore >= 80) {
            scoreLabel = 'Excellent';
            scoreColor = '#22c55e';
        } else if (totalScore >= 60) {
            scoreLabel = 'Good';
            scoreColor = '#84cc16';
        } else if (totalScore >= 40) {
            scoreLabel = 'Fair';
            scoreColor = '#eab308';
        } else if (totalScore >= 20) {
            scoreLabel = 'Poor';
            scoreColor = '#f97316';
        } else {
            scoreLabel = 'Critical';
            scoreColor = '#ef4444';
        }

        return {
            totalScore,
            scoreLabel,
            scoreColor,
            breakdown: {
                backupRedundancy: {
                    ...backupRedundancy,
                    weight: WEIGHTS.backupRedundancy,
                    weightedScore: Math.round(backupRedundancy.score * WEIGHTS.backupRedundancy / 100)
                },
                geographicDistribution: {
                    ...geographicDist,
                    weight: WEIGHTS.geographicDistribution,
                    weightedScore: Math.round(geographicDist.score * WEIGHTS.geographicDistribution / 100)
                },
                mediaDiversity: {
                    ...mediaDiversity,
                    weight: WEIGHTS.mediaDiversity,
                    weightedScore: Math.round(mediaDiversity.score * WEIGHTS.mediaDiversity / 100)
                },
                verificationRecency: {
                    ...verificationRecency,
                    weight: WEIGHTS.verificationRecency,
                    weightedScore: Math.round(verificationRecency.score * WEIGHTS.verificationRecency / 100)
                },
                inheritancePlan: {
                    ...inheritancePlanScore,
                    weight: WEIGHTS.inheritancePlan,
                    weightedScore: Math.round(inheritancePlanScore.score * WEIGHTS.inheritancePlan / 100)
                },
                singlePointAnalysis: {
                    ...spofAnalysis,
                    weight: WEIGHTS.singlePointAnalysis,
                    weightedScore: Math.round(spofAnalysis.score * WEIGHTS.singlePointAnalysis / 100)
                }
            },
            recommendations,
            riskLevel: spofAnalysis.riskLevel
        };
    }

    /**
     * Get score class for UI display
     */
    function getScoreClass(score) {
        if (score >= 80) return 'excellent';
        if (score >= 60) return 'good';
        if (score >= 40) return 'warning';
        return 'poor';
    }

    /**
     * Generate resilience report
     */
    function generateReport() {
        const score = calculateResilienceScore();
        const stats = VaultCore.getStatistics();

        return {
            generatedAt: new Date().toISOString(),
            summary: {
                overallScore: score.totalScore,
                label: score.scoreLabel,
                riskLevel: score.riskLevel.label
            },
            statistics: stats,
            breakdown: score.breakdown,
            recommendations: score.recommendations,
            actions: generateActionItems(score)
        };
    }

    /**
     * Generate prioritized action items
     */
    function generateActionItems(score) {
        const actions = [];

        // Critical actions from SPOF analysis
        if (score.breakdown.singlePointAnalysis.issues) {
            score.breakdown.singlePointAnalysis.issues
                .filter(i => i.severity === 'critical')
                .forEach(issue => {
                    actions.push({
                        priority: 'critical',
                        action: issue.message,
                        category: 'security'
                    });
                });
        }

        // Verification actions
        if (score.breakdown.verificationRecency.needsVerificationCount > 0) {
            actions.push({
                priority: 'high',
                action: `Verify ${score.breakdown.verificationRecency.needsVerificationCount} backup(s) that haven't been checked recently`,
                category: 'maintenance'
            });
        }

        // Redundancy actions
        if (score.breakdown.backupRedundancy.score < 60) {
            actions.push({
                priority: 'high',
                action: 'Add additional backup copies for your wallets',
                category: 'redundancy'
            });
        }

        // Geographic distribution actions
        if (score.breakdown.geographicDistribution.score < 60) {
            actions.push({
                priority: 'medium',
                action: 'Store backups in additional geographic locations',
                category: 'distribution'
            });
        }

        // Media diversity actions
        if (score.breakdown.mediaDiversity.score < 60) {
            actions.push({
                priority: 'medium',
                action: 'Use different types of backup media for redundancy',
                category: 'diversity'
            });
        }

        // Inheritance actions
        if (score.breakdown.inheritancePlan.score < 60) {
            const incomplete = score.breakdown.inheritancePlan.details
                .filter(c => !c.complete)
                .map(c => c.item);
            actions.push({
                priority: 'medium',
                action: `Complete inheritance plan: ${incomplete.join(', ')}`,
                category: 'inheritance'
            });
        }

        return actions;
    }

    // Public API
    return {
        calculateResilienceScore,
        generateReport,
        getScoreClass,
        
        // Individual calculations (for detailed views)
        calculateBackupRedundancy,
        calculateGeographicDistribution,
        calculateMediaDiversity,
        calculateVerificationRecency,
        calculateInheritancePlan,
        analyzeSinglePointsOfFailure,

        // Constants
        WEIGHTS,
        THRESHOLDS,
        RISK_LEVELS
    };
})();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VaultResilience;
}
