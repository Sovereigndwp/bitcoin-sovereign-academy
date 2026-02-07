/**
 * Sovereign Vault - Export/Import Module
 * 
 * Handles:
 * - Encrypted vault export for backup
 * - Import from encrypted backup
 * - Emergency document generation
 * - Data portability (standard format)
 */

const VaultExport = (function() {
    'use strict';

    // Export format version
    const EXPORT_VERSION = '1.0';

    // Export types
    const EXPORT_TYPES = {
        FULL_ENCRYPTED: 'full_encrypted',      // Complete encrypted vault backup
        EMERGENCY_DOC: 'emergency_document',    // Printable emergency document
        SUMMARY: 'summary_report',              // Human-readable summary (no secrets)
        RESILIENCE_REPORT: 'resilience_report'  // Resilience analysis
    };

    /**
     * Export full encrypted vault
     * Can be imported back with correct password
     */
    async function exportEncryptedVault() {
        if (!VaultCrypto.isUnlocked()) {
            throw new Error('Vault must be unlocked to export');
        }

        const exportData = await VaultCrypto.exportVault();
        const blob = new Blob([exportData], { type: 'application/json' });
        
        return {
            blob,
            filename: `sovereign-vault-backup-${formatDate(new Date())}.json`,
            type: EXPORT_TYPES.FULL_ENCRYPTED
        };
    }

    /**
     * Import encrypted vault from backup
     */
    async function importEncryptedVault(file, password) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = async (e) => {
                try {
                    const exportedJson = e.target.result;
                    await VaultCrypto.importVault(exportedJson, password);
                    await VaultCore.loadVault();
                    resolve(true);
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    /**
     * Generate emergency document data
     * Returns data to populate the emergency document template
     */
    function generateEmergencyDocumentData(options = {}) {
        const vaultData = VaultCore.getVaultData();
        if (!vaultData) {
            throw new Error('Vault not loaded');
        }

        const { showFullLocations = false, includeContacts = true } = options;

        // Prepare wallets data (no sensitive info)
        const wallets = vaultData.wallets.map(w => ({
            name: w.name,
            type: w.type === 'multisig' ? `${w.requiredSignatures}-of-${w.totalKeys} Multisig` : 'Single Signature',
            purpose: w.purpose || 'General',
            backupLocations: getWalletBackupLocations(w.id, vaultData, showFullLocations)
        }));

        // Prepare locations data
        const locations = vaultData.locations.map(l => ({
            alias: l.alias,
            category: VaultCore.LOCATION_CATEGORIES[l.category]?.label || l.category,
            items: getLocationItems(l.id, vaultData),
            accessInstructions: showFullLocations ? l.accessInstructions : 'Contact trusted advisor',
            security: l.securityFeatures?.join(', ') || 'Standard'
        }));

        // Prepare heirs data
        const heirs = vaultData.heirs.map(h => ({
            name: h.name,
            relationship: h.relationship,
            contact: includeContacts ? (h.email || h.phone) : 'See secure document',
            accessLevel: h.accessLevel
        }));

        // Prepare trusted contacts
        const contacts = includeContacts ? vaultData.trustedContacts.map(c => ({
            name: c.name,
            role: c.role,
            phone: c.phone,
            email: c.email,
            notes: c.notes
        })) : [];

        // Get instructions
        const instructions = vaultData.inheritancePlan.instructions || '';

        // Get multisig info for the template
        const multisigWallets = vaultData.wallets.filter(w => w.type === 'multisig');
        const multisigConfig = multisigWallets.length > 0 ? {
            m: multisigWallets[0].requiredSignatures,
            n: multisigWallets[0].totalKeys
        } : null;

        return {
            documentId: 'VAULT-' + generateShortId(),
            version: EXPORT_VERSION,
            date: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            purpose: `Emergency recovery document for ${vaultData.wallets.length} Bitcoin wallet(s)`,
            wallets,
            locations,
            heirs,
            contacts,
            instructions,
            multisigConfig
        };
    }

    /**
     * Open emergency document in new window
     */
    function openEmergencyDocument(options = {}) {
        const docData = generateEmergencyDocumentData(options);
        const encodedData = btoa(JSON.stringify(docData));
        
        // Get the base path for the template
        const basePath = window.location.pathname.replace(/\/[^/]*$/, '');
        const templatePath = `${basePath}/templates/emergency-doc.html#${encodedData}`;
        
        window.open(templatePath, '_blank');
    }

    /**
     * Generate summary report (no sensitive data)
     */
    function generateSummaryReport() {
        const vaultData = VaultCore.getVaultData();
        if (!vaultData) {
            throw new Error('Vault not loaded');
        }

        const stats = VaultCore.getStatistics();
        const resilience = VaultResilience.calculateResilienceScore();

        const report = {
            generatedAt: new Date().toISOString(),
            version: EXPORT_VERSION,
            summary: {
                wallets: stats.walletCount,
                backups: stats.backupCount,
                locations: stats.locationCount,
                heirs: stats.heirCount,
                resilienceScore: resilience.totalScore,
                resilienceLabel: resilience.scoreLabel
            },
            walletOverview: vaultData.wallets.map(w => ({
                name: w.name,
                type: w.type,
                backupCount: vaultData.backups.filter(b => b.walletId === w.id).length,
                purpose: w.purpose
            })),
            backupStatus: {
                total: stats.backupCount,
                needsVerification: stats.backupsNeedingVerification,
                mediaTypes: stats.uniqueMediaTypes,
                regions: stats.uniqueRegions
            },
            inheritanceStatus: {
                hasHeirs: stats.heirCount > 0,
                hasInstructions: stats.hasInheritancePlan,
                accessMode: vaultData.inheritancePlan.accessMode,
                deadManSwitchEnabled: vaultData.inheritancePlan.deadManSwitch?.enabled || false
            },
            recommendations: resilience.recommendations
        };

        return report;
    }

    /**
     * Export summary report as text
     */
    function exportSummaryReport() {
        const report = generateSummaryReport();
        
        const lines = [
            '═══════════════════════════════════════════════════════════════',
            '                    SOVEREIGN VAULT SUMMARY',
            '═══════════════════════════════════════════════════════════════',
            '',
            `Generated: ${new Date(report.generatedAt).toLocaleString()}`,
            '',
            '───────────────────────────────────────────────────────────────',
            '                        OVERVIEW',
            '───────────────────────────────────────────────────────────────',
            '',
            `Resilience Score: ${report.summary.resilienceScore}/100 (${report.summary.resilienceLabel})`,
            '',
            `Wallets:   ${report.summary.wallets}`,
            `Backups:   ${report.summary.backups}`,
            `Locations: ${report.summary.locations}`,
            `Heirs:     ${report.summary.heirs}`,
            '',
            '───────────────────────────────────────────────────────────────',
            '                        WALLETS',
            '───────────────────────────────────────────────────────────────',
            ''
        ];

        report.walletOverview.forEach(w => {
            lines.push(`• ${w.name}`);
            lines.push(`  Type: ${w.type}, Backups: ${w.backupCount}, Purpose: ${w.purpose}`);
            lines.push('');
        });

        lines.push('───────────────────────────────────────────────────────────────');
        lines.push('                     BACKUP STATUS');
        lines.push('───────────────────────────────────────────────────────────────');
        lines.push('');
        lines.push(`Total Backups: ${report.backupStatus.total}`);
        lines.push(`Need Verification: ${report.backupStatus.needsVerification}`);
        lines.push(`Media Types Used: ${report.backupStatus.mediaTypes}`);
        lines.push(`Geographic Regions: ${report.backupStatus.regions}`);
        lines.push('');
        lines.push('───────────────────────────────────────────────────────────────');
        lines.push('                   INHERITANCE STATUS');
        lines.push('───────────────────────────────────────────────────────────────');
        lines.push('');
        lines.push(`Heirs Configured: ${report.inheritanceStatus.hasHeirs ? 'Yes' : 'No'}`);
        lines.push(`Instructions Written: ${report.inheritanceStatus.hasInstructions ? 'Yes' : 'No'}`);
        lines.push(`Access Mode: ${report.inheritanceStatus.accessMode}`);
        lines.push(`Dead Man's Switch: ${report.inheritanceStatus.deadManSwitchEnabled ? 'Enabled' : 'Disabled'}`);
        lines.push('');

        if (report.recommendations.length > 0) {
            lines.push('───────────────────────────────────────────────────────────────');
            lines.push('                    RECOMMENDATIONS');
            lines.push('───────────────────────────────────────────────────────────────');
            lines.push('');
            report.recommendations.forEach((rec, i) => {
                lines.push(`${i + 1}. ${rec}`);
            });
            lines.push('');
        }

        lines.push('═══════════════════════════════════════════════════════════════');
        lines.push('                    END OF REPORT');
        lines.push('═══════════════════════════════════════════════════════════════');

        const text = lines.join('\n');
        const blob = new Blob([text], { type: 'text/plain' });

        return {
            blob,
            filename: `sovereign-vault-summary-${formatDate(new Date())}.txt`,
            type: EXPORT_TYPES.SUMMARY
        };
    }

    /**
     * Export resilience report as JSON
     */
    function exportResilienceReport() {
        const report = VaultResilience.generateReport();
        const json = JSON.stringify(report, null, 2);
        const blob = new Blob([json], { type: 'application/json' });

        return {
            blob,
            filename: `sovereign-vault-resilience-${formatDate(new Date())}.json`,
            type: EXPORT_TYPES.RESILIENCE_REPORT
        };
    }

    /**
     * Download a blob as file
     */
    function downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Export and download encrypted vault
     */
    async function downloadEncryptedVault() {
        const exported = await exportEncryptedVault();
        downloadBlob(exported.blob, exported.filename);
    }

    /**
     * Export and download summary report
     */
    function downloadSummaryReport() {
        const exported = exportSummaryReport();
        downloadBlob(exported.blob, exported.filename);
    }

    /**
     * Export and download resilience report
     */
    function downloadResilienceReport() {
        const exported = exportResilienceReport();
        downloadBlob(exported.blob, exported.filename);
    }

    // ==========================================
    // HELPER FUNCTIONS
    // ==========================================

    /**
     * Format date for filenames
     */
    function formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    /**
     * Generate short ID for documents
     */
    function generateShortId() {
        return Math.random().toString(36).substring(2, 6).toUpperCase() + 
               '-' + 
               Math.random().toString(36).substring(2, 6).toUpperCase();
    }

    /**
     * Get backup locations for a wallet
     */
    function getWalletBackupLocations(walletId, vaultData, showFull) {
        const backups = vaultData.backups.filter(b => b.walletId === walletId);
        const locationIds = [...new Set(backups.map(b => b.locationId).filter(Boolean))];
        
        return locationIds.map(id => {
            const location = vaultData.locations.find(l => l.id === id);
            return location ? (showFull ? location.fullAddress || location.alias : location.alias) : 'Unknown';
        });
    }

    /**
     * Get items stored at a location
     */
    function getLocationItems(locationId, vaultData) {
        const backups = vaultData.backups.filter(b => b.locationId === locationId);
        
        return backups.map(b => {
            const wallet = vaultData.wallets.find(w => w.id === b.walletId);
            const mediaType = VaultCore.BACKUP_MEDIA_TYPES[b.mediaType]?.label || b.mediaType;
            return `${wallet?.name || 'Unknown'} (${mediaType})`;
        }).join(', ') || 'No items';
    }

    /**
     * Validate import file
     */
    function validateImportFile(file) {
        // Check file type
        if (!file.name.endsWith('.json')) {
            return { valid: false, error: 'File must be a JSON file' };
        }

        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            return { valid: false, error: 'File too large (max 10MB)' };
        }

        return { valid: true };
    }

    /**
     * Preview import file (returns metadata without importing)
     */
    async function previewImportFile(file) {
        const validation = validateImportFile(file);
        if (!validation.valid) {
            throw new Error(validation.error);
        }

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    // Extract preview info without decrypting
                    resolve({
                        version: data.version || 'Unknown',
                        exportDate: data.exportDate || 'Unknown',
                        hasData: !!data.data,
                        hasSalt: !!data.salt,
                        hasVerification: !!data.verification,
                        isValid: !!(data.salt && data.verification)
                    });
                } catch (error) {
                    reject(new Error('Invalid JSON file'));
                }
            };
            
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    // Public API
    return {
        // Export types
        EXPORT_TYPES,

        // Encrypted export/import
        exportEncryptedVault,
        importEncryptedVault,
        downloadEncryptedVault,

        // Emergency document
        generateEmergencyDocumentData,
        openEmergencyDocument,

        // Reports
        generateSummaryReport,
        exportSummaryReport,
        exportResilienceReport,
        downloadSummaryReport,
        downloadResilienceReport,

        // Utilities
        downloadBlob,
        validateImportFile,
        previewImportFile
    };
})();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VaultExport;
}
