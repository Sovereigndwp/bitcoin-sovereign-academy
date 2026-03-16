/**
 * Sovereign Vault - Zero-Knowledge Encryption Module
 * 
 * All data is encrypted client-side using Web Crypto API.
 * The server (localStorage in this demo) only stores encrypted blobs.
 * Keys are derived from user's password using PBKDF2.
 * Encryption uses AES-GCM for authenticated encryption.
 */

const VaultCrypto = (function() {
    'use strict';

    // Configuration
    const CONFIG = {
        PBKDF2_ITERATIONS: 600000, // High iteration count for security
        SALT_LENGTH: 32,           // 256 bits
        IV_LENGTH: 12,             // 96 bits for GCM
        KEY_LENGTH: 256,           // AES-256
        AUTH_TAG_LENGTH: 128,      // 128-bit authentication tag
        HASH_ALGORITHM: 'SHA-256',
        KDF_ALGORITHM: 'PBKDF2',
        CIPHER_ALGORITHM: 'AES-GCM',
        VERSION: 1                 // For future migration support
    };

    // Storage keys
    const STORAGE_KEYS = {
        SALT: 'sv_salt',
        VERIFICATION: 'sv_verification',
        DATA: 'sv_encrypted_data',
        VERSION: 'sv_version'
    };

    // Private state
    let _masterKey = null;
    let _derivedKey = null;

    /**
     * Check if Web Crypto API is available
     */
    function isSupported() {
        return !!(window.crypto && window.crypto.subtle);
    }

    /**
     * Generate cryptographically secure random bytes
     */
    function getRandomBytes(length) {
        return window.crypto.getRandomValues(new Uint8Array(length));
    }

    /**
     * Convert ArrayBuffer to Base64 string
     */
    function arrayBufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    /**
     * Convert Base64 string to ArrayBuffer
     */
    function base64ToArrayBuffer(base64) {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes.buffer;
    }

    /**
     * Convert string to ArrayBuffer (UTF-8)
     */
    function stringToArrayBuffer(str) {
        return new TextEncoder().encode(str);
    }

    /**
     * Convert ArrayBuffer to string (UTF-8)
     */
    function arrayBufferToString(buffer) {
        return new TextDecoder().decode(buffer);
    }

    /**
     * Derive encryption key from password using PBKDF2
     */
    async function deriveKeyFromPassword(password, salt) {
        // Import password as raw key material
        const passwordKey = await window.crypto.subtle.importKey(
            'raw',
            stringToArrayBuffer(password),
            CONFIG.KDF_ALGORITHM,
            false,
            ['deriveKey']
        );

        // Derive AES key using PBKDF2
        const derivedKey = await window.crypto.subtle.deriveKey(
            {
                name: CONFIG.KDF_ALGORITHM,
                salt: salt,
                iterations: CONFIG.PBKDF2_ITERATIONS,
                hash: CONFIG.HASH_ALGORITHM
            },
            passwordKey,
            {
                name: CONFIG.CIPHER_ALGORITHM,
                length: CONFIG.KEY_LENGTH
            },
            false, // Not extractable
            ['encrypt', 'decrypt']
        );

        return derivedKey;
    }

    /**
     * Encrypt data using AES-GCM
     * Returns: { iv, ciphertext, tag } all in Base64
     */
    async function encryptData(data, key) {
        const iv = getRandomBytes(CONFIG.IV_LENGTH);
        const plaintext = stringToArrayBuffer(JSON.stringify(data));

        const ciphertext = await window.crypto.subtle.encrypt(
            {
                name: CONFIG.CIPHER_ALGORITHM,
                iv: iv,
                tagLength: CONFIG.AUTH_TAG_LENGTH
            },
            key,
            plaintext
        );

        return {
            version: CONFIG.VERSION,
            iv: arrayBufferToBase64(iv),
            ciphertext: arrayBufferToBase64(ciphertext)
        };
    }

    /**
     * Decrypt data using AES-GCM
     */
    async function decryptData(encryptedPackage, key) {
        const iv = new Uint8Array(base64ToArrayBuffer(encryptedPackage.iv));
        const ciphertext = base64ToArrayBuffer(encryptedPackage.ciphertext);

        try {
            const plaintext = await window.crypto.subtle.decrypt(
                {
                    name: CONFIG.CIPHER_ALGORITHM,
                    iv: iv,
                    tagLength: CONFIG.AUTH_TAG_LENGTH
                },
                key,
                ciphertext
            );

            return JSON.parse(arrayBufferToString(plaintext));
        } catch (error) {
            // Authentication failed or wrong key
            throw new Error('Decryption failed: Invalid password or corrupted data');
        }
    }

    /**
     * Generate verification token
     * This allows us to verify password correctness without storing it
     */
    async function generateVerificationToken(key) {
        const testData = { verification: 'SOVEREIGN_VAULT_V1', timestamp: Date.now() };
        return await encryptData(testData, key);
    }

    /**
     * Verify password by attempting to decrypt verification token
     */
    async function verifyPassword(key, verificationToken) {
        try {
            const decrypted = await decryptData(verificationToken, key);
            return decrypted.verification === 'SOVEREIGN_VAULT_V1';
        } catch {
            return false;
        }
    }

    /**
     * Hash data for integrity checking (not for passwords)
     */
    async function hashData(data) {
        const buffer = stringToArrayBuffer(typeof data === 'string' ? data : JSON.stringify(data));
        const hashBuffer = await window.crypto.subtle.digest(CONFIG.HASH_ALGORITHM, buffer);
        return arrayBufferToBase64(hashBuffer);
    }

    /**
     * Create a new vault with password
     * Generates salt, derives key, creates verification token
     */
    async function createVault(password) {
        if (!isSupported()) {
            throw new Error('Web Crypto API not supported in this browser');
        }

        if (!password || password.length < 8) {
            throw new Error('Password must be at least 8 characters');
        }

        // Generate random salt
        const salt = getRandomBytes(CONFIG.SALT_LENGTH);

        // Derive key from password
        const key = await deriveKeyFromPassword(password, salt);

        // Generate verification token
        const verificationToken = await generateVerificationToken(key);

        // Store salt and verification token
        localStorage.setItem(STORAGE_KEYS.SALT, arrayBufferToBase64(salt));
        localStorage.setItem(STORAGE_KEYS.VERIFICATION, JSON.stringify(verificationToken));
        localStorage.setItem(STORAGE_KEYS.VERSION, CONFIG.VERSION.toString());

        // Store derived key in memory
        _derivedKey = key;

        return true;
    }

    /**
     * Unlock existing vault with password
     */
    async function unlockVault(password) {
        if (!isSupported()) {
            throw new Error('Web Crypto API not supported in this browser');
        }

        // Get stored salt
        const saltBase64 = localStorage.getItem(STORAGE_KEYS.SALT);
        if (!saltBase64) {
            throw new Error('No vault found. Please create a new vault.');
        }

        const salt = new Uint8Array(base64ToArrayBuffer(saltBase64));

        // Derive key from password
        const key = await deriveKeyFromPassword(password, salt);

        // Verify password
        const verificationToken = JSON.parse(localStorage.getItem(STORAGE_KEYS.VERIFICATION));
        const isValid = await verifyPassword(key, verificationToken);

        if (!isValid) {
            throw new Error('Invalid password');
        }

        // Store derived key in memory
        _derivedKey = key;

        return true;
    }

    /**
     * Check if vault exists
     */
    function vaultExists() {
        return localStorage.getItem(STORAGE_KEYS.SALT) !== null;
    }

    /**
     * Check if vault is currently unlocked
     */
    function isUnlocked() {
        return _derivedKey !== null;
    }

    /**
     * Lock the vault (clear keys from memory)
     */
    function lockVault() {
        _derivedKey = null;
        _masterKey = null;
    }

    /**
     * Save encrypted data to storage
     */
    async function saveData(data) {
        if (!_derivedKey) {
            throw new Error('Vault is locked');
        }

        const encrypted = await encryptData(data, _derivedKey);
        localStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(encrypted));

        return true;
    }

    /**
     * Load and decrypt data from storage
     */
    async function loadData() {
        if (!_derivedKey) {
            throw new Error('Vault is locked');
        }

        const encryptedJson = localStorage.getItem(STORAGE_KEYS.DATA);
        if (!encryptedJson) {
            return null;
        }

        const encrypted = JSON.parse(encryptedJson);
        return await decryptData(encrypted, _derivedKey);
    }

    /**
     * Change vault password
     * Re-encrypts all data with new key
     */
    async function changePassword(currentPassword, newPassword) {
        if (!isSupported()) {
            throw new Error('Web Crypto API not supported');
        }

        if (!newPassword || newPassword.length < 8) {
            throw new Error('New password must be at least 8 characters');
        }

        // Verify current password and load data
        await unlockVault(currentPassword);
        const data = await loadData();

        // Generate new salt and key
        const newSalt = getRandomBytes(CONFIG.SALT_LENGTH);
        const newKey = await deriveKeyFromPassword(newPassword, newSalt);

        // Generate new verification token
        const newVerificationToken = await generateVerificationToken(newKey);

        // Store new salt and verification
        localStorage.setItem(STORAGE_KEYS.SALT, arrayBufferToBase64(newSalt));
        localStorage.setItem(STORAGE_KEYS.VERIFICATION, JSON.stringify(newVerificationToken));

        // Update derived key
        _derivedKey = newKey;

        // Re-encrypt and save data if exists
        if (data) {
            await saveData(data);
        }

        return true;
    }

    /**
     * Delete vault completely
     */
    function deleteVault() {
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        lockVault();
        return true;
    }

    /**
     * Export encrypted vault data for backup
     */
    async function exportVault() {
        const exportData = {
            version: CONFIG.VERSION,
            exportDate: new Date().toISOString(),
            salt: localStorage.getItem(STORAGE_KEYS.SALT),
            verification: localStorage.getItem(STORAGE_KEYS.VERIFICATION),
            data: localStorage.getItem(STORAGE_KEYS.DATA)
        };

        return JSON.stringify(exportData, null, 2);
    }

    /**
     * Import vault data from backup
     * Requires password to verify and unlock
     */
    async function importVault(exportedJson, password) {
        const importData = JSON.parse(exportedJson);

        if (!importData.salt || !importData.verification) {
            throw new Error('Invalid vault export file');
        }

        // Temporarily set the imported salt
        const salt = new Uint8Array(base64ToArrayBuffer(importData.salt));
        const key = await deriveKeyFromPassword(password, salt);

        // Verify password works with imported verification
        const verificationToken = JSON.parse(importData.verification);
        const isValid = await verifyPassword(key, verificationToken);

        if (!isValid) {
            throw new Error('Invalid password for this vault backup');
        }

        // Import verified - store the data
        localStorage.setItem(STORAGE_KEYS.SALT, importData.salt);
        localStorage.setItem(STORAGE_KEYS.VERIFICATION, importData.verification);
        localStorage.setItem(STORAGE_KEYS.VERSION, (importData.version || 1).toString());

        if (importData.data) {
            localStorage.setItem(STORAGE_KEYS.DATA, importData.data);
        }

        // Unlock with the verified key
        _derivedKey = key;

        return true;
    }

    /**
     * Encrypt arbitrary data (for emergency documents, etc.)
     * Returns encrypted package that can be decrypted with current key
     */
    async function encryptArbitraryData(data) {
        if (!_derivedKey) {
            throw new Error('Vault is locked');
        }
        return await encryptData(data, _derivedKey);
    }

    /**
     * Decrypt arbitrary data package
     */
    async function decryptArbitraryData(encryptedPackage) {
        if (!_derivedKey) {
            throw new Error('Vault is locked');
        }
        return await decryptData(encryptedPackage, _derivedKey);
    }

    /**
     * Generate secure random password
     */
    function generateSecurePassword(length = 20) {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
        const randomBytes = getRandomBytes(length);
        let password = '';

        for (let i = 0; i < length; i++) {
            password += charset[randomBytes[i] % charset.length];
        }

        return password;
    }

    /**
     * Estimate password strength
     */
    function estimatePasswordStrength(password) {
        if (!password) return { score: 0, label: 'None', color: '#ef4444' };

        let score = 0;
        const length = password.length;

        // Length scoring
        if (length >= 8) score += 1;
        if (length >= 12) score += 1;
        if (length >= 16) score += 1;
        if (length >= 20) score += 1;

        // Character variety
        if (/[a-z]/.test(password)) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^a-zA-Z0-9]/.test(password)) score += 1;

        // Normalize to 0-100
        const normalizedScore = Math.min(100, (score / 8) * 100);

        let label, color;
        if (normalizedScore < 25) {
            label = 'Weak';
            color = '#ef4444';
        } else if (normalizedScore < 50) {
            label = 'Fair';
            color = '#f97316';
        } else if (normalizedScore < 75) {
            label = 'Good';
            color = '#eab308';
        } else {
            label = 'Strong';
            color = '#22c55e';
        }

        return { score: normalizedScore, label, color };
    }

    // Public API
    return {
        // Status checks
        isSupported,
        vaultExists,
        isUnlocked,

        // Vault lifecycle
        createVault,
        unlockVault,
        lockVault,
        deleteVault,

        // Data operations
        saveData,
        loadData,

        // Password management
        changePassword,
        generateSecurePassword,
        estimatePasswordStrength,

        // Export/Import
        exportVault,
        importVault,

        // Utilities
        hashData,
        encryptArbitraryData,
        decryptArbitraryData,

        // Config (read-only)
        get config() {
            return { ...CONFIG };
        }
    };
})();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VaultCrypto;
}
