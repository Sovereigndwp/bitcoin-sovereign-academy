/**
 * Sovereign Vault - Core Data Management Module
 * 
 * Manages vault data structures including:
 * - Wallets (singlesig, multisig)
 * - Backups and locations
 * - Heirs and inheritance plans
 * - Audit trail
 */

const VaultCore = (function() {
    'use strict';

    // Default data structure
    const DEFAULT_VAULT_DATA = {
        version: 1,
        createdAt: null,
        updatedAt: null,
        wallets: [],
        backups: [],
        locations: [],
        heirs: [],
        inheritancePlan: {
            accessMode: 'immediate', // immediate | delayed | multiparty
            delayDays: 0,
            instructions: '',
            deadManSwitch: {
                enabled: false,
                checkInDays: 90,
                gracePeriodDays: 30,
                lastCheckIn: null,
                notifyHeirs: true
            }
        },
        trustedContacts: [],
        settings: {
            autoLockMinutes: 15,
            showDetailedLocations: false,
            enableNotifications: false
        },
        auditLog: []
    };

    // Wallet templates
    const WALLET_TEMPLATES = {
        singlesig: {
            name: 'Single Signature',
            type: 'singlesig',
            description: 'Standard wallet with one key',
            requiredSignatures: 1,
            totalKeys: 1
        },
        multisig_2of3: {
            name: '2-of-3 Multisig',
            type: 'multisig',
            description: 'Requires 2 of 3 keys to spend',
            requiredSignatures: 2,
            totalKeys: 3
        },
        multisig_3of5: {
            name: '3-of-5 Multisig',
            type: 'multisig',
            description: 'Requires 3 of 5 keys to spend',
            requiredSignatures: 3,
            totalKeys: 5
        },
        custom: {
            name: 'Custom Setup',
            type: 'custom',
            description: 'Define your own configuration',
            requiredSignatures: null,
            totalKeys: null
        }
    };

    // Backup media types
    const BACKUP_MEDIA_TYPES = {
        paper: { label: 'Paper', icon: '📝', durability: 'Low', fireproof: false },
        steel: { label: 'Steel Plate', icon: '🔩', durability: 'High', fireproof: true },
        hardware_wallet: { label: 'Hardware Wallet', icon: '🔐', durability: 'Medium', fireproof: false },
        cryptosteel: { label: 'Cryptosteel/Metal', icon: '🛡️', durability: 'Very High', fireproof: true },
        encrypted_file: { label: 'Encrypted File', icon: '💾', durability: 'Medium', fireproof: false },
        split_seed: { label: 'Split Seed (SLIP39)', icon: '🧩', durability: 'Varies', fireproof: false },
        other: { label: 'Other', icon: '📦', durability: 'Unknown', fireproof: false }
    };

    // Location categories
    const LOCATION_CATEGORIES = {
        home: { label: 'Home', icon: '🏠' },
        office: { label: 'Office', icon: '🏢' },
        bank: { label: 'Bank/Safety Deposit', icon: '🏦' },
        relative: { label: "Family/Friend's Home", icon: '👨‍👩‍👧' },
        safe: { label: 'Safe/Vault', icon: '🔒' },
        geographic: { label: 'Separate Geographic Location', icon: '🌍' },
        other: { label: 'Other', icon: '📍' }
    };

    // Current vault data
    let _vaultData = null;

    /**
     * Generate unique ID
     */
    function generateId() {
        return 'sv_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9);
    }

    /**
     * Get current timestamp
     */
    function timestamp() {
        return new Date().toISOString();
    }

    /**
     * Deep clone object
     */
    function deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    /**
     * Add entry to audit log
     */
    function addAuditEntry(action, details = {}) {
        if (!_vaultData) return;

        const entry = {
            id: generateId(),
            timestamp: timestamp(),
            action,
            details
        };

        _vaultData.auditLog.unshift(entry);

        // Keep only last 1000 entries
        if (_vaultData.auditLog.length > 1000) {
            _vaultData.auditLog = _vaultData.auditLog.slice(0, 1000);
        }
    }

    /**
     * Initialize vault with default data
     */
    function initializeVault() {
        _vaultData = deepClone(DEFAULT_VAULT_DATA);
        _vaultData.createdAt = timestamp();
        _vaultData.updatedAt = timestamp();
        addAuditEntry('vault_created', { message: 'Vault initialized' });
        return _vaultData;
    }

    /**
     * Load vault data from encrypted storage
     */
    async function loadVault() {
        if (!VaultCrypto.isUnlocked()) {
            throw new Error('Vault is locked');
        }

        const data = await VaultCrypto.loadData();
        
        if (data) {
            _vaultData = data;
        } else {
            _vaultData = initializeVault();
            await saveVault();
        }

        return _vaultData;
    }

    /**
     * Save vault data to encrypted storage
     */
    async function saveVault() {
        if (!VaultCrypto.isUnlocked()) {
            throw new Error('Vault is locked');
        }

        if (!_vaultData) {
            throw new Error('No vault data to save');
        }

        _vaultData.updatedAt = timestamp();
        await VaultCrypto.saveData(_vaultData);
        return true;
    }

    /**
     * Get current vault data (read-only copy)
     */
    function getVaultData() {
        return _vaultData ? deepClone(_vaultData) : null;
    }

    // ==========================================
    // WALLET MANAGEMENT
    // ==========================================

    /**
     * Add a new wallet
     */
    async function addWallet(walletData) {
        if (!_vaultData) throw new Error('Vault not loaded');

        const wallet = {
            id: generateId(),
            createdAt: timestamp(),
            updatedAt: timestamp(),
            name: walletData.name || 'Untitled Wallet',
            type: walletData.type || 'singlesig',
            description: walletData.description || '',
            purpose: walletData.purpose || 'general',
            requiredSignatures: walletData.requiredSignatures || 1,
            totalKeys: walletData.totalKeys || 1,
            xpubs: walletData.xpubs || [],
            derivationPath: walletData.derivationPath || "m/84'/0'/0'",
            scriptType: walletData.scriptType || 'native_segwit',
            hardwareDevices: walletData.hardwareDevices || [],
            notes: walletData.notes || '',
            backupIds: walletData.backupIds || [],
            threatModel: walletData.threatModel || [],
            estimatedValue: walletData.estimatedValue || null, // Optional: for resilience scoring
            lastVerified: null
        };

        _vaultData.wallets.push(wallet);
        addAuditEntry('wallet_added', { walletId: wallet.id, name: wallet.name, type: wallet.type });
        await saveVault();

        return wallet;
    }

    /**
     * Update a wallet
     */
    async function updateWallet(walletId, updates) {
        if (!_vaultData) throw new Error('Vault not loaded');

        const index = _vaultData.wallets.findIndex(w => w.id === walletId);
        if (index === -1) throw new Error('Wallet not found');

        const wallet = _vaultData.wallets[index];
        const oldName = wallet.name;

        // Apply updates
        Object.assign(wallet, updates, { updatedAt: timestamp() });
        
        // Don't allow overwriting id or createdAt
        wallet.id = walletId;

        addAuditEntry('wallet_updated', { walletId, oldName, newName: wallet.name });
        await saveVault();

        return wallet;
    }

    /**
     * Delete a wallet
     */
    async function deleteWallet(walletId) {
        if (!_vaultData) throw new Error('Vault not loaded');

        const index = _vaultData.wallets.findIndex(w => w.id === walletId);
        if (index === -1) throw new Error('Wallet not found');

        const wallet = _vaultData.wallets[index];
        _vaultData.wallets.splice(index, 1);

        addAuditEntry('wallet_deleted', { walletId, name: wallet.name });
        await saveVault();

        return true;
    }

    /**
     * Get wallet by ID
     */
    function getWallet(walletId) {
        if (!_vaultData) return null;
        return _vaultData.wallets.find(w => w.id === walletId) || null;
    }

    /**
     * Get all wallets
     */
    function getWallets() {
        return _vaultData ? [..._vaultData.wallets] : [];
    }

    // ==========================================
    // BACKUP MANAGEMENT
    // ==========================================

    /**
     * Add a new backup
     */
    async function addBackup(backupData) {
        if (!_vaultData) throw new Error('Vault not loaded');

        const backup = {
            id: generateId(),
            createdAt: timestamp(),
            updatedAt: timestamp(),
            walletId: backupData.walletId || null,
            locationId: backupData.locationId || null,
            mediaType: backupData.mediaType || 'paper',
            format: backupData.format || 'bip39', // bip39, slip39, xpub, descriptor
            wordCount: backupData.wordCount || 24,
            hasPassphrase: backupData.hasPassphrase || false,
            isComplete: backupData.isComplete !== false,
            splitInfo: backupData.splitInfo || null, // For split backups: { part: 1, totalParts: 3, threshold: 2 }
            securityFeatures: backupData.securityFeatures || [],
            lastVerified: backupData.lastVerified || null,
            verificationSchedule: backupData.verificationSchedule || 'annually',
            notes: backupData.notes || ''
        };

        _vaultData.backups.push(backup);
        addAuditEntry('backup_added', { backupId: backup.id, mediaType: backup.mediaType });
        await saveVault();

        return backup;
    }

    /**
     * Update a backup
     */
    async function updateBackup(backupId, updates) {
        if (!_vaultData) throw new Error('Vault not loaded');

        const index = _vaultData.backups.findIndex(b => b.id === backupId);
        if (index === -1) throw new Error('Backup not found');

        const backup = _vaultData.backups[index];
        Object.assign(backup, updates, { updatedAt: timestamp() });
        backup.id = backupId;

        addAuditEntry('backup_updated', { backupId });
        await saveVault();

        return backup;
    }

    /**
     * Verify a backup (update lastVerified)
     */
    async function verifyBackup(backupId) {
        return await updateBackup(backupId, { lastVerified: timestamp() });
    }

    /**
     * Delete a backup
     */
    async function deleteBackup(backupId) {
        if (!_vaultData) throw new Error('Vault not loaded');

        const index = _vaultData.backups.findIndex(b => b.id === backupId);
        if (index === -1) throw new Error('Backup not found');

        _vaultData.backups.splice(index, 1);

        addAuditEntry('backup_deleted', { backupId });
        await saveVault();

        return true;
    }

    /**
     * Get backup by ID
     */
    function getBackup(backupId) {
        if (!_vaultData) return null;
        return _vaultData.backups.find(b => b.id === backupId) || null;
    }

    /**
     * Get all backups
     */
    function getBackups() {
        return _vaultData ? [..._vaultData.backups] : [];
    }

    /**
     * Get backups for a wallet
     */
    function getBackupsForWallet(walletId) {
        if (!_vaultData) return [];
        return _vaultData.backups.filter(b => b.walletId === walletId);
    }

    // ==========================================
    // LOCATION MANAGEMENT
    // ==========================================

    /**
     * Add a new location
     */
    async function addLocation(locationData) {
        if (!_vaultData) throw new Error('Vault not loaded');

        const location = {
            id: generateId(),
            createdAt: timestamp(),
            updatedAt: timestamp(),
            alias: locationData.alias || 'Location ' + (_vaultData.locations.length + 1),
            category: locationData.category || 'other',
            fullAddress: locationData.fullAddress || '', // Stored encrypted
            accessInstructions: locationData.accessInstructions || '',
            securityFeatures: locationData.securityFeatures || [],
            contactPerson: locationData.contactPerson || null,
            geographicRegion: locationData.geographicRegion || 'local', // local, regional, international
            notes: locationData.notes || ''
        };

        _vaultData.locations.push(location);
        addAuditEntry('location_added', { locationId: location.id, alias: location.alias });
        await saveVault();

        return location;
    }

    /**
     * Update a location
     */
    async function updateLocation(locationId, updates) {
        if (!_vaultData) throw new Error('Vault not loaded');

        const index = _vaultData.locations.findIndex(l => l.id === locationId);
        if (index === -1) throw new Error('Location not found');

        const location = _vaultData.locations[index];
        Object.assign(location, updates, { updatedAt: timestamp() });
        location.id = locationId;

        addAuditEntry('location_updated', { locationId, alias: location.alias });
        await saveVault();

        return location;
    }

    /**
     * Delete a location
     */
    async function deleteLocation(locationId) {
        if (!_vaultData) throw new Error('Vault not loaded');

        const index = _vaultData.locations.findIndex(l => l.id === locationId);
        if (index === -1) throw new Error('Location not found');

        // Check if any backups use this location
        const backupsAtLocation = _vaultData.backups.filter(b => b.locationId === locationId);
        if (backupsAtLocation.length > 0) {
            throw new Error(`Cannot delete location: ${backupsAtLocation.length} backup(s) stored here`);
        }

        _vaultData.locations.splice(index, 1);

        addAuditEntry('location_deleted', { locationId });
        await saveVault();

        return true;
    }

    /**
     * Get location by ID
     */
    function getLocation(locationId) {
        if (!_vaultData) return null;
        return _vaultData.locations.find(l => l.id === locationId) || null;
    }

    /**
     * Get all locations
     */
    function getLocations() {
        return _vaultData ? [..._vaultData.locations] : [];
    }

    // ==========================================
    // HEIR MANAGEMENT
    // ==========================================

    /**
     * Add a new heir
     */
    async function addHeir(heirData) {
        if (!_vaultData) throw new Error('Vault not loaded');

        const heir = {
            id: generateId(),
            createdAt: timestamp(),
            updatedAt: timestamp(),
            name: heirData.name || '',
            relationship: heirData.relationship || '',
            email: heirData.email || '',
            phone: heirData.phone || '',
            isPrimary: heirData.isPrimary || false,
            sharePercentage: heirData.sharePercentage || null,
            accessLevel: heirData.accessLevel || 'full', // full, partial, instructions-only
            walletAccess: heirData.walletAccess || [], // List of wallet IDs this heir can access
            notes: heirData.notes || '',
            verificationMethod: heirData.verificationMethod || null // For identity verification
        };

        _vaultData.heirs.push(heir);
        addAuditEntry('heir_added', { heirId: heir.id, name: heir.name });
        await saveVault();

        return heir;
    }

    /**
     * Update an heir
     */
    async function updateHeir(heirId, updates) {
        if (!_vaultData) throw new Error('Vault not loaded');

        const index = _vaultData.heirs.findIndex(h => h.id === heirId);
        if (index === -1) throw new Error('Heir not found');

        const heir = _vaultData.heirs[index];
        Object.assign(heir, updates, { updatedAt: timestamp() });
        heir.id = heirId;

        addAuditEntry('heir_updated', { heirId, name: heir.name });
        await saveVault();

        return heir;
    }

    /**
     * Delete an heir
     */
    async function deleteHeir(heirId) {
        if (!_vaultData) throw new Error('Vault not loaded');

        const index = _vaultData.heirs.findIndex(h => h.id === heirId);
        if (index === -1) throw new Error('Heir not found');

        const heir = _vaultData.heirs[index];
        _vaultData.heirs.splice(index, 1);

        addAuditEntry('heir_deleted', { heirId, name: heir.name });
        await saveVault();

        return true;
    }

    /**
     * Get heir by ID
     */
    function getHeir(heirId) {
        if (!_vaultData) return null;
        return _vaultData.heirs.find(h => h.id === heirId) || null;
    }

    /**
     * Get all heirs
     */
    function getHeirs() {
        return _vaultData ? [..._vaultData.heirs] : [];
    }

    // ==========================================
    // INHERITANCE PLAN
    // ==========================================

    /**
     * Update inheritance plan
     */
    async function updateInheritancePlan(planData) {
        if (!_vaultData) throw new Error('Vault not loaded');

        Object.assign(_vaultData.inheritancePlan, planData);

        addAuditEntry('inheritance_plan_updated', { 
            accessMode: _vaultData.inheritancePlan.accessMode 
        });
        await saveVault();

        return _vaultData.inheritancePlan;
    }

    /**
     * Get inheritance plan
     */
    function getInheritancePlan() {
        return _vaultData ? deepClone(_vaultData.inheritancePlan) : null;
    }

    /**
     * Record dead man's switch check-in
     */
    async function recordCheckIn() {
        if (!_vaultData) throw new Error('Vault not loaded');

        _vaultData.inheritancePlan.deadManSwitch.lastCheckIn = timestamp();

        addAuditEntry('dead_man_switch_checkin', { timestamp: timestamp() });
        await saveVault();

        return true;
    }

    /**
     * Get dead man's switch status
     */
    function getDeadManSwitchStatus() {
        if (!_vaultData) return null;

        const dms = _vaultData.inheritancePlan.deadManSwitch;
        if (!dms.enabled) {
            return { enabled: false, status: 'disabled' };
        }

        const lastCheckIn = dms.lastCheckIn ? new Date(dms.lastCheckIn) : new Date(_vaultData.createdAt);
        const now = new Date();
        const daysSinceCheckIn = Math.floor((now - lastCheckIn) / (1000 * 60 * 60 * 24));
        
        const checkInDue = dms.checkInDays;
        const gracePeriod = dms.gracePeriodDays;

        let status, daysRemaining;

        if (daysSinceCheckIn < checkInDue) {
            status = 'ok';
            daysRemaining = checkInDue - daysSinceCheckIn;
        } else if (daysSinceCheckIn < checkInDue + gracePeriod) {
            status = 'warning';
            daysRemaining = checkInDue + gracePeriod - daysSinceCheckIn;
        } else {
            status = 'triggered';
            daysRemaining = 0;
        }

        return {
            enabled: true,
            status,
            lastCheckIn: dms.lastCheckIn,
            daysSinceCheckIn,
            daysRemaining,
            checkInDays: checkInDue,
            gracePeriodDays: gracePeriod
        };
    }

    // ==========================================
    // TRUSTED CONTACTS
    // ==========================================

    /**
     * Add trusted contact
     */
    async function addTrustedContact(contactData) {
        if (!_vaultData) throw new Error('Vault not loaded');

        const contact = {
            id: generateId(),
            createdAt: timestamp(),
            name: contactData.name || '',
            role: contactData.role || '',
            phone: contactData.phone || '',
            email: contactData.email || '',
            notes: contactData.notes || ''
        };

        _vaultData.trustedContacts.push(contact);
        addAuditEntry('trusted_contact_added', { contactId: contact.id, name: contact.name });
        await saveVault();

        return contact;
    }

    /**
     * Update trusted contact
     */
    async function updateTrustedContact(contactId, updates) {
        if (!_vaultData) throw new Error('Vault not loaded');

        const index = _vaultData.trustedContacts.findIndex(c => c.id === contactId);
        if (index === -1) throw new Error('Contact not found');

        Object.assign(_vaultData.trustedContacts[index], updates);

        addAuditEntry('trusted_contact_updated', { contactId });
        await saveVault();

        return _vaultData.trustedContacts[index];
    }

    /**
     * Delete trusted contact
     */
    async function deleteTrustedContact(contactId) {
        if (!_vaultData) throw new Error('Vault not loaded');

        const index = _vaultData.trustedContacts.findIndex(c => c.id === contactId);
        if (index === -1) throw new Error('Contact not found');

        _vaultData.trustedContacts.splice(index, 1);

        addAuditEntry('trusted_contact_deleted', { contactId });
        await saveVault();

        return true;
    }

    /**
     * Get all trusted contacts
     */
    function getTrustedContacts() {
        return _vaultData ? [..._vaultData.trustedContacts] : [];
    }

    // ==========================================
    // SETTINGS
    // ==========================================

    /**
     * Update settings
     */
    async function updateSettings(settings) {
        if (!_vaultData) throw new Error('Vault not loaded');

        Object.assign(_vaultData.settings, settings);

        addAuditEntry('settings_updated', { settings: Object.keys(settings) });
        await saveVault();

        return _vaultData.settings;
    }

    /**
     * Get settings
     */
    function getSettings() {
        return _vaultData ? deepClone(_vaultData.settings) : null;
    }

    // ==========================================
    // AUDIT LOG
    // ==========================================

    /**
     * Get audit log entries
     */
    function getAuditLog(limit = 100) {
        if (!_vaultData) return [];
        return _vaultData.auditLog.slice(0, limit);
    }

    /**
     * Clear old audit log entries
     */
    async function clearAuditLog(keepLast = 100) {
        if (!_vaultData) throw new Error('Vault not loaded');

        const removed = _vaultData.auditLog.length - keepLast;
        _vaultData.auditLog = _vaultData.auditLog.slice(0, keepLast);

        addAuditEntry('audit_log_cleared', { entriesRemoved: removed });
        await saveVault();

        return true;
    }

    // ==========================================
    // STATISTICS
    // ==========================================

    /**
     * Get vault statistics
     */
    function getStatistics() {
        if (!_vaultData) return null;

        return {
            walletCount: _vaultData.wallets.length,
            backupCount: _vaultData.backups.length,
            locationCount: _vaultData.locations.length,
            heirCount: _vaultData.heirs.length,
            uniqueMediaTypes: [...new Set(_vaultData.backups.map(b => b.mediaType))].length,
            uniqueRegions: [...new Set(_vaultData.locations.map(l => l.geographicRegion))].length,
            backupsNeedingVerification: _vaultData.backups.filter(b => {
                if (!b.lastVerified) return true;
                const lastVerified = new Date(b.lastVerified);
                const monthsAgo = new Date();
                monthsAgo.setMonth(monthsAgo.getMonth() - 12);
                return lastVerified < monthsAgo;
            }).length,
            hasInheritancePlan: _vaultData.heirs.length > 0 && 
                               _vaultData.inheritancePlan.instructions.length > 0
        };
    }

    // Public API
    return {
        // Vault lifecycle
        initializeVault,
        loadVault,
        saveVault,
        getVaultData,

        // Templates and constants
        WALLET_TEMPLATES,
        BACKUP_MEDIA_TYPES,
        LOCATION_CATEGORIES,

        // Wallet operations
        addWallet,
        updateWallet,
        deleteWallet,
        getWallet,
        getWallets,

        // Backup operations
        addBackup,
        updateBackup,
        verifyBackup,
        deleteBackup,
        getBackup,
        getBackups,
        getBackupsForWallet,

        // Location operations
        addLocation,
        updateLocation,
        deleteLocation,
        getLocation,
        getLocations,

        // Heir operations
        addHeir,
        updateHeir,
        deleteHeir,
        getHeir,
        getHeirs,

        // Inheritance plan
        updateInheritancePlan,
        getInheritancePlan,
        recordCheckIn,
        getDeadManSwitchStatus,

        // Trusted contacts
        addTrustedContact,
        updateTrustedContact,
        deleteTrustedContact,
        getTrustedContacts,

        // Settings
        updateSettings,
        getSettings,

        // Audit log
        getAuditLog,
        clearAuditLog,

        // Statistics
        getStatistics,

        // Utilities
        generateId
    };
})();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VaultCore;
}
