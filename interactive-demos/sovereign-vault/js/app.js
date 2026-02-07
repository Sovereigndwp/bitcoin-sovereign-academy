/**
 * Sovereign Vault - Main Application Controller
 * 
 * Wires up the UI to the various modules and handles:
 * - Authentication flow (unlock/create vault)
 * - Tab navigation
 * - Form handling
 * - UI updates
 */

const VaultApp = (function() {
    'use strict';

    // State
    let _isUnlocked = false;
    let _currentTab = 'dashboard';

    // DOM Elements cache
    const elements = {};

    /**
     * Initialize the application
     */
    function init() {
        cacheElements();
        bindEvents();
        checkVaultStatus();
    }

    /**
     * Cache DOM elements for performance
     */
    function cacheElements() {
        // Screens
        elements.unlockScreen = document.getElementById('unlock-screen');
        elements.mainApp = document.getElementById('main-content');

        // Unlock form elements
        elements.modeToggle = document.querySelectorAll('.mode-btn');
        elements.unlockForm = document.getElementById('unlock-form');
        elements.passwordInput = document.getElementById('master-password');
        elements.confirmPasswordGroup = document.querySelector('.new-vault-only');
        elements.confirmPasswordInput = document.getElementById('confirm-password');
        elements.togglePasswordBtn = document.querySelector('.toggle-password');
        elements.unlockBtn = document.querySelector('.btn-unlock');
        elements.unlockError = document.getElementById('unlock-error');

        // Navigation
        elements.navTabs = document.querySelectorAll('.nav-tab');
        elements.tabContents = document.querySelectorAll('.tab-content');

        // Header
        elements.headerScore = document.getElementById('header-score');
        elements.lockBtn = document.getElementById('btn-lock');
        elements.settingsBtn = document.getElementById('settings-btn');

        // Dashboard elements
        elements.dashboardScore = document.getElementById('dashboard-score');
        elements.scoreProgress = document.getElementById('score-progress');
        elements.recommendationList = document.getElementById('recommendation-list');
        elements.walletCount = document.getElementById('stat-wallets');
        elements.backupCount = document.getElementById('stat-backups');
        elements.locationCount = document.getElementById('stat-locations');
        elements.heirCount = document.getElementById('stat-heirs');
        elements.activityList = document.getElementById('activity-list');

        // Lists
        elements.walletsList = document.getElementById('wallets-list');
        elements.backupsList = document.getElementById('backups-list');
        elements.heirsList = document.getElementById('heirs-list');

        // Modals
        elements.modalAddWallet = document.getElementById('modal-add-wallet');
        elements.modalAddBackup = document.getElementById('modal-add-backup');
        elements.modalAddHeir = document.getElementById('modal-add-heir');
        elements.modalConfirm = document.getElementById('modal-confirm');

        // Forms
        elements.formAddWallet = document.getElementById('form-add-wallet');
        elements.formAddBackup = document.getElementById('form-add-backup');
        elements.formAddHeir = document.getElementById('form-add-heir');
    }

    /**
     * Bind event listeners
     */
    function bindEvents() {
        // Mode toggle (unlock vs create)
        elements.modeToggle.forEach(btn => {
            btn.addEventListener('click', handleModeToggle);
        });

        // Unlock form
        if (elements.unlockForm) {
            elements.unlockForm.addEventListener('submit', handleUnlock);
        }

        // Toggle password visibility
        if (elements.togglePasswordBtn) {
            elements.togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
        }

        // Navigation tabs
        elements.navTabs.forEach(tab => {
            tab.addEventListener('click', handleTabClick);
        });

        // Lock button
        if (elements.lockBtn) {
            elements.lockBtn.addEventListener('click', handleLock);
        }

        // Modal close buttons
        document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
            btn.addEventListener('click', closeAllModals);
        });

        // Close modal on backdrop click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeAllModals();
            });
        });

        // Add buttons
        document.querySelectorAll('[data-action="add-wallet"]').forEach(btn => {
            btn.addEventListener('click', () => openModal('modal-add-wallet'));
        });
        document.querySelectorAll('[data-action="add-backup"]').forEach(btn => {
            btn.addEventListener('click', () => openModal('modal-add-backup'));
        });
        document.querySelectorAll('[data-action="add-heir"]').forEach(btn => {
            btn.addEventListener('click', () => openModal('modal-add-heir'));
        });

        // Form submissions
        if (elements.formAddWallet) {
            elements.formAddWallet.addEventListener('submit', handleAddWallet);
        }
        if (elements.formAddBackup) {
            elements.formAddBackup.addEventListener('submit', handleAddBackup);
        }
        if (elements.formAddHeir) {
            elements.formAddHeir.addEventListener('submit', handleAddHeir);
        }

        // Template cards
        document.querySelectorAll('.template-card').forEach(card => {
            card.addEventListener('click', handleTemplateSelect);
        });

        // Wizard navigation
        document.querySelectorAll('[data-wizard-nav]').forEach(btn => {
            btn.addEventListener('click', handleWizardNav);
        });

        // Instruction templates
        document.querySelectorAll('.template-btn').forEach(btn => {
            btn.addEventListener('click', handleInstructionTemplate);
        });

        // Export buttons
        document.querySelectorAll('[data-action="export-vault"]').forEach(btn => {
            btn.addEventListener('click', handleExportVault);
        });
        document.querySelectorAll('[data-action="generate-emergency-doc"]').forEach(btn => {
            btn.addEventListener('click', handleGenerateEmergencyDoc);
        });

        // Quick actions
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', handleQuickAction);
        });

        // Dead man's switch toggle
        const dmsToggle = document.getElementById('enable-dms');
        if (dmsToggle) {
            dmsToggle.addEventListener('change', handleDMSToggle);
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', handleKeyboard);
    }

    /**
     * Check vault status on load
     */
    function checkVaultStatus() {
        const vaultExists = VaultCrypto.vaultExists();
        
        // Update mode toggle UI
        elements.modeToggle.forEach(btn => {
            const mode = btn.dataset.mode;
            btn.classList.toggle('active', 
                (vaultExists && mode === 'existing') || 
                (!vaultExists && mode === 'new')
            );
        });

        // Update form state - show/hide confirm password for new vault
        document.querySelectorAll('.new-vault-only').forEach(el => {
            el.style.display = vaultExists ? 'none' : 'block';
        });
        
        // Update button text
        const existingText = document.querySelector('.btn-unlock .existing-text');
        const newText = document.querySelector('.btn-unlock .new-text');
        if (existingText && newText) {
            existingText.style.display = vaultExists ? 'inline' : 'none';
            newText.style.display = vaultExists ? 'none' : 'inline';
        }

        // Show unlock screen
        showScreen('unlock');
    }

    /**
     * Handle mode toggle (unlock vs create)
     */
    function handleModeToggle(e) {
        const mode = e.currentTarget.dataset.mode;
        const isNew = mode === 'new';
        
        elements.modeToggle.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });

        // Show/hide confirm password for new vault
        document.querySelectorAll('.new-vault-only').forEach(el => {
            el.style.display = isNew ? 'block' : 'none';
        });
        
        // Update button text
        const existingText = document.querySelector('.btn-unlock .existing-text');
        const newText = document.querySelector('.btn-unlock .new-text');
        if (existingText && newText) {
            existingText.style.display = isNew ? 'none' : 'inline';
            newText.style.display = isNew ? 'inline' : 'none';
        }
    }

    /**
     * Handle unlock/create form submission
     */
    async function handleUnlock(e) {
        e.preventDefault();

        const password = elements.passwordInput.value;
        // Check if we're in create mode by looking at which mode button is active
        const activeModeBtn = document.querySelector('.mode-btn.active');
        const isCreate = activeModeBtn && activeModeBtn.dataset.mode === 'new';

        if (isCreate) {
            const confirmPassword = elements.confirmPasswordInput.value;
            if (password !== confirmPassword) {
                showError('Passwords do not match');
                return;
            }
            if (password.length < 8) {
                showError('Password must be at least 8 characters');
                return;
            }

            try {
                elements.unlockBtn.disabled = true;
                setButtonText('Creating...');
                
                await VaultCrypto.createVault(password);
                await VaultCore.loadVault();
                
                _isUnlocked = true;
                showScreen('main');
                updateDashboard();
            } catch (error) {
                showError(error.message);
            } finally {
                elements.unlockBtn.disabled = false;
                restoreButtonText();
            }
        } else {
            try {
                elements.unlockBtn.disabled = true;
                setButtonText('Unlocking...');
                
                await VaultCrypto.unlockVault(password);
                await VaultCore.loadVault();
                
                _isUnlocked = true;
                showScreen('main');
                updateDashboard();
            } catch (error) {
                showError(error.message || 'Invalid password');
            } finally {
                elements.unlockBtn.disabled = false;
                restoreButtonText();
            }
        }

        // Clear password fields
        elements.passwordInput.value = '';
        if (elements.confirmPasswordInput) {
            elements.confirmPasswordInput.value = '';
        }
    }

    /**
     * Handle lock button
     */
    function handleLock() {
        VaultCrypto.lockVault();
        _isUnlocked = false;
        showScreen('unlock');
    }

    /**
     * Set button text during loading states
     */
    function setButtonText(text) {
        const existingText = elements.unlockBtn.querySelector('.existing-text');
        const newText = elements.unlockBtn.querySelector('.new-text');
        if (existingText) existingText.style.display = 'none';
        if (newText) newText.style.display = 'none';
        
        // Add loading text if not exists
        let loadingText = elements.unlockBtn.querySelector('.loading-text');
        if (!loadingText) {
            loadingText = document.createElement('span');
            loadingText.className = 'loading-text';
            elements.unlockBtn.appendChild(loadingText);
        }
        loadingText.textContent = text;
        loadingText.style.display = 'inline';
    }

    /**
     * Restore button text after loading
     */
    function restoreButtonText() {
        const loadingText = elements.unlockBtn.querySelector('.loading-text');
        if (loadingText) loadingText.style.display = 'none';
        
        const activeModeBtn = document.querySelector('.mode-btn.active');
        const isNew = activeModeBtn && activeModeBtn.dataset.mode === 'new';
        
        const existingText = elements.unlockBtn.querySelector('.existing-text');
        const newText = elements.unlockBtn.querySelector('.new-text');
        if (existingText) existingText.style.display = isNew ? 'none' : 'inline';
        if (newText) newText.style.display = isNew ? 'inline' : 'none';
    }

    /**
     * Show error message
     */
    function showError(message) {
        if (elements.unlockError) {
            elements.unlockError.textContent = message;
            elements.unlockError.style.display = 'block';
            setTimeout(() => {
                elements.unlockError.style.display = 'none';
            }, 5000);
        }
    }

    /**
     * Toggle password visibility
     */
    function togglePasswordVisibility() {
        const type = elements.passwordInput.type === 'password' ? 'text' : 'password';
        elements.passwordInput.type = type;
        if (elements.confirmPasswordInput) {
            elements.confirmPasswordInput.type = type;
        }
    }

    /**
     * Show screen (unlock or main)
     */
    function showScreen(screen) {
        if (screen === 'unlock') {
            elements.unlockScreen.style.display = 'flex';
            elements.mainApp.style.display = 'none';
        } else {
            elements.unlockScreen.style.display = 'none';
            elements.mainApp.style.display = 'block';
        }
    }

    /**
     * Handle tab navigation
     */
    function handleTabClick(e) {
        const tabId = e.currentTarget.dataset.tab;
        switchTab(tabId);
    }

    /**
     * Switch to a tab
     */
    function switchTab(tabId) {
        _currentTab = tabId;

        // Update nav buttons
        elements.navTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabId);
        });

        // Update tab content
        elements.tabContents.forEach(content => {
            content.classList.toggle('active', content.id === `tab-${tabId}`);
        });

        // Refresh tab data
        refreshTabData(tabId);
    }

    /**
     * Refresh data for a specific tab
     */
    function refreshTabData(tabId) {
        switch (tabId) {
            case 'dashboard':
                updateDashboard();
                break;
            case 'wallets':
                updateWalletsList();
                break;
            case 'backups':
                updateBackupsList();
                break;
            case 'inheritance':
                updateInheritanceTab();
                break;
            case 'emergency':
                updateEmergencyTab();
                break;
            case 'settings':
                updateSettingsTab();
                break;
        }
    }

    /**
     * Update dashboard with current data
     */
    function updateDashboard() {
        if (!VaultCrypto.isUnlocked()) return;

        // Get resilience score
        const resilience = VaultResilience.calculateResilienceScore();
        
        // Update score display
        if (elements.dashboardScore) {
            elements.dashboardScore.textContent = resilience.totalScore;
        }
        if (elements.headerScore) {
            elements.headerScore.textContent = resilience.totalScore + '/100';
        }

        // Update progress circle
        if (elements.scoreProgress) {
            const circumference = 283; // 2 * PI * 45 (radius)
            const offset = circumference - (resilience.totalScore / 100) * circumference;
            elements.scoreProgress.style.strokeDashoffset = offset;
            elements.scoreProgress.style.stroke = resilience.scoreColor;
        }

        // Update recommendations
        if (elements.recommendationList) {
            if (resilience.recommendations.length > 0) {
                elements.recommendationList.innerHTML = resilience.recommendations
                    .slice(0, 5)
                    .map(rec => `<li>${rec}</li>`)
                    .join('');
            } else {
                elements.recommendationList.innerHTML = '<li style="background: rgba(34, 197, 94, 0.1); border-color: #22c55e;">Excellent! No critical recommendations.</li>';
            }
        }

        // Update statistics
        const stats = VaultCore.getStatistics();
        if (elements.walletCount) elements.walletCount.textContent = stats.walletCount;
        if (elements.backupCount) elements.backupCount.textContent = stats.backupCount;
        if (elements.locationCount) elements.locationCount.textContent = stats.locationCount;
        if (elements.heirCount) elements.heirCount.textContent = stats.heirCount;

        // Update activity list
        updateActivityList();

        // Update breakdown
        updateScoreBreakdown(resilience.breakdown);
    }

    /**
     * Update score breakdown display
     */
    function updateScoreBreakdown(breakdown) {
        const breakdownItems = [
            { id: 'backup-redundancy', data: breakdown.backupRedundancy, label: 'Backup Redundancy' },
            { id: 'geographic-dist', data: breakdown.geographicDistribution, label: 'Geographic Distribution' },
            { id: 'media-diversity', data: breakdown.mediaDiversity, label: 'Media Diversity' },
            { id: 'verification', data: breakdown.verificationRecency, label: 'Verification Status' },
            { id: 'inheritance', data: breakdown.inheritancePlan, label: 'Inheritance Plan' }
        ];

        breakdownItems.forEach(item => {
            const element = document.getElementById(`breakdown-${item.id}`);
            if (element) {
                const score = Math.round(item.data.score);
                element.textContent = `${score}/100`;
                element.className = 'breakdown-value ' + VaultResilience.getScoreClass(score);
            }
        });
    }

    /**
     * Update activity list
     */
    function updateActivityList() {
        const auditLog = VaultCore.getAuditLog(10);
        
        if (elements.activityList) {
            if (auditLog.length === 0) {
                elements.activityList.innerHTML = '<div class="activity-item"><div class="activity-content"><div class="activity-title">No activity yet</div><div class="activity-time">Start by adding a wallet</div></div></div>';
            } else {
                elements.activityList.innerHTML = auditLog.map(entry => `
                    <div class="activity-item">
                        <div class="activity-icon">${getActivityIcon(entry.action)}</div>
                        <div class="activity-content">
                            <div class="activity-title">${formatActivityTitle(entry.action, entry.details)}</div>
                            <div class="activity-time">${formatTime(entry.timestamp)}</div>
                        </div>
                    </div>
                `).join('');
            }
        }
    }

    /**
     * Get icon for activity type
     */
    function getActivityIcon(action) {
        const icons = {
            'vault_created': '🔐',
            'wallet_added': '💰',
            'wallet_updated': '✏️',
            'wallet_deleted': '🗑️',
            'backup_added': '💾',
            'backup_updated': '✏️',
            'backup_deleted': '🗑️',
            'location_added': '📍',
            'heir_added': '👤',
            'inheritance_plan_updated': '📋',
            'dead_man_switch_checkin': '✅',
            'settings_updated': '⚙️'
        };
        return icons[action] || '📌';
    }

    /**
     * Format activity title
     */
    function formatActivityTitle(action, details) {
        const titles = {
            'vault_created': 'Vault created',
            'wallet_added': `Added wallet "${details.name || 'Unknown'}"`,
            'wallet_updated': `Updated wallet "${details.newName || details.oldName || 'Unknown'}"`,
            'wallet_deleted': `Deleted wallet "${details.name || 'Unknown'}"`,
            'backup_added': 'Added new backup',
            'backup_updated': 'Updated backup',
            'backup_deleted': 'Deleted backup',
            'location_added': `Added location "${details.alias || 'Unknown'}"`,
            'heir_added': `Added heir "${details.name || 'Unknown'}"`,
            'inheritance_plan_updated': 'Updated inheritance plan',
            'dead_man_switch_checkin': 'Checked in (dead man\'s switch)',
            'settings_updated': 'Updated settings'
        };
        return titles[action] || action.replace(/_/g, ' ');
    }

    /**
     * Format timestamp
     */
    function formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
        return date.toLocaleDateString();
    }

    /**
     * Update wallets list
     */
    function updateWalletsList() {
        const wallets = VaultCore.getWallets();
        
        if (elements.walletsList) {
            if (wallets.length === 0) {
                elements.walletsList.innerHTML = '<div class="empty-state">No wallets added yet. Click "Add Wallet" to get started.</div>';
            } else {
                elements.walletsList.innerHTML = wallets.map(wallet => {
                    const backups = VaultCore.getBackupsForWallet(wallet.id);
                    return `
                        <div class="list-item" data-wallet-id="${wallet.id}">
                            <div class="list-item-content">
                                <div class="list-item-title">${wallet.name}</div>
                                <div class="list-item-subtitle">${formatWalletType(wallet)}</div>
                                <div class="list-item-meta">
                                    <span class="meta-tag">${backups.length} backup${backups.length !== 1 ? 's' : ''}</span>
                                    <span class="meta-tag">${wallet.purpose || 'General'}</span>
                                </div>
                            </div>
                            <div class="list-item-actions">
                                <button class="btn-edit" onclick="VaultApp.editWallet('${wallet.id}')" aria-label="Edit">✏️</button>
                                <button class="btn-delete" onclick="VaultApp.deleteWallet('${wallet.id}')" aria-label="Delete">🗑️</button>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }
    }

    /**
     * Format wallet type for display
     */
    function formatWalletType(wallet) {
        if (wallet.type === 'multisig') {
            return `${wallet.requiredSignatures}-of-${wallet.totalKeys} Multi-Signature`;
        }
        return 'Single Signature';
    }

    /**
     * Update backups list
     */
    function updateBackupsList() {
        const backups = VaultCore.getBackups();
        const locations = VaultCore.getLocations();
        const wallets = VaultCore.getWallets();

        // Update distribution visual
        updateBackupDistribution(backups, locations);
        
        if (elements.backupsList) {
            if (backups.length === 0) {
                elements.backupsList.innerHTML = '<div class="empty-state">No backups documented yet. Add your backup locations to track them.</div>';
            } else {
                elements.backupsList.innerHTML = backups.map(backup => {
                    const wallet = wallets.find(w => w.id === backup.walletId);
                    const location = locations.find(l => l.id === backup.locationId);
                    const mediaType = VaultCore.BACKUP_MEDIA_TYPES[backup.mediaType];
                    const needsVerification = !backup.lastVerified || 
                        (new Date() - new Date(backup.lastVerified)) > 365 * 24 * 60 * 60 * 1000;

                    return `
                        <div class="list-item" data-backup-id="${backup.id}">
                            <div class="list-item-content">
                                <div class="list-item-title">${mediaType?.icon || '📦'} ${mediaType?.label || backup.mediaType}</div>
                                <div class="list-item-subtitle">
                                    ${wallet ? wallet.name : 'Unassigned'} • ${location ? location.alias : 'Unknown location'}
                                </div>
                                <div class="list-item-meta">
                                    <span class="meta-tag">${backup.format?.toUpperCase() || 'BIP39'}</span>
                                    <span class="meta-tag ${needsVerification ? 'warning' : 'success'}">
                                        ${needsVerification ? '⚠️ Needs verification' : '✓ Verified'}
                                    </span>
                                </div>
                            </div>
                            <div class="list-item-actions">
                                <button class="btn-edit" onclick="VaultApp.verifyBackup('${backup.id}')" aria-label="Verify" title="Mark as verified">✓</button>
                                <button class="btn-delete" onclick="VaultApp.deleteBackup('${backup.id}')" aria-label="Delete">🗑️</button>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }
    }

    /**
     * Update backup distribution visual
     */
    function updateBackupDistribution(backups, locations) {
        const usedLocationIds = [...new Set(backups.map(b => b.locationId).filter(Boolean))];
        const usedLocations = locations.filter(l => usedLocationIds.includes(l.id));

        const distribution = {
            local: 0,
            regional: 0,
            international: 0,
            unknown: 0
        };

        backups.forEach(backup => {
            const location = usedLocations.find(l => l.id === backup.locationId);
            if (location) {
                distribution[location.geographicRegion] = (distribution[location.geographicRegion] || 0) + 1;
            } else {
                distribution.unknown++;
            }
        });

        ['local', 'regional', 'international', 'unknown'].forEach(region => {
            const element = document.getElementById(`dist-${region}`);
            if (element) {
                element.textContent = distribution[region] || 0;
            }
        });
    }

    /**
     * Update inheritance tab
     */
    function updateInheritanceTab() {
        const heirs = VaultCore.getHeirs();
        
        if (elements.heirsList) {
            if (heirs.length === 0) {
                elements.heirsList.innerHTML = '<div class="empty-state">No heirs defined yet. Add heirs to create your inheritance plan.</div>';
            } else {
                elements.heirsList.innerHTML = heirs.map(heir => `
                    <div class="list-item" data-heir-id="${heir.id}">
                        <div class="list-item-content">
                            <div class="list-item-title">${heir.name}</div>
                            <div class="list-item-subtitle">${heir.relationship || 'Relationship not specified'}</div>
                            <div class="list-item-meta">
                                <span class="meta-tag">${heir.accessLevel || 'Full'} Access</span>
                                ${heir.isPrimary ? '<span class="meta-tag success">Primary</span>' : ''}
                            </div>
                        </div>
                        <div class="list-item-actions">
                            <button class="btn-edit" onclick="VaultApp.editHeir('${heir.id}')" aria-label="Edit">✏️</button>
                            <button class="btn-delete" onclick="VaultApp.deleteHeir('${heir.id}')" aria-label="Delete">🗑️</button>
                        </div>
                    </div>
                `).join('');
            }
        }

        // Update wizard progress if on inheritance tab
        VaultInheritance.initializeWizard();
    }

    /**
     * Update emergency tab
     */
    function updateEmergencyTab() {
        // Update checklist
        const checklist = VaultInheritance.generateChecklist();
        const checklistElement = document.getElementById('emergency-checklist');
        
        if (checklistElement) {
            const ul = checklistElement.querySelector('ul');
            if (ul) {
                ul.innerHTML = checklist.map(item => `
                    <li class="checklist-item ${item.complete ? 'complete' : ''}">
                        <span class="check-icon">${item.complete ? '✅' : '⬜'}</span>
                        ${item.label}
                    </li>
                `).join('');
            }
        }
    }

    /**
     * Update settings tab
     */
    function updateSettingsTab() {
        const settings = VaultCore.getSettings();
        const auditLog = VaultCore.getAuditLog(50);
        
        // Update audit log display
        const auditElement = document.getElementById('audit-log');
        if (auditElement) {
            auditElement.innerHTML = auditLog.map(entry => `
                <div class="audit-entry">
                    <span class="audit-time">${new Date(entry.timestamp).toLocaleString()}</span>
                    <span class="audit-action">${formatActivityTitle(entry.action, entry.details)}</span>
                </div>
            `).join('');
        }
    }

    /**
     * Open a modal
     */
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            // Focus first input
            const firstInput = modal.querySelector('input, select, textarea');
            if (firstInput) firstInput.focus();
        }
    }

    /**
     * Close all modals
     */
    function closeAllModals() {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
    }

    /**
     * Handle add wallet form
     */
    async function handleAddWallet(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const walletData = {
            name: document.getElementById('wallet-name').value,
            type: document.getElementById('wallet-type').value,
            purpose: document.getElementById('wallet-purpose').value,
            requiredSignatures: parseInt(document.getElementById('multisig-m')?.value) || 1,
            totalKeys: parseInt(document.getElementById('multisig-n')?.value) || 1,
            notes: document.getElementById('wallet-notes')?.value || ''
        };

        try {
            await VaultCore.addWallet(walletData);
            closeAllModals();
            e.target.reset();
            updateWalletsList();
            updateDashboard();
        } catch (error) {
            alert('Error adding wallet: ' + error.message);
        }
    }

    /**
     * Handle add backup form
     */
    async function handleAddBackup(e) {
        e.preventDefault();

        const backupData = {
            walletId: document.getElementById('backup-wallet').value,
            locationId: document.getElementById('backup-location').value,
            mediaType: document.getElementById('backup-media').value,
            format: document.getElementById('backup-format').value,
            wordCount: parseInt(document.getElementById('backup-words').value) || 24,
            hasPassphrase: document.getElementById('backup-passphrase')?.checked || false,
            notes: document.getElementById('backup-notes')?.value || ''
        };

        try {
            await VaultCore.addBackup(backupData);
            closeAllModals();
            e.target.reset();
            updateBackupsList();
            updateDashboard();
        } catch (error) {
            alert('Error adding backup: ' + error.message);
        }
    }

    /**
     * Handle add heir form
     */
    async function handleAddHeir(e) {
        e.preventDefault();

        const heirData = {
            name: document.getElementById('heir-name').value,
            relationship: document.getElementById('heir-relationship').value,
            email: document.getElementById('heir-email').value,
            accessLevel: document.getElementById('heir-access-level').value,
            notes: document.getElementById('heir-notes')?.value || ''
        };

        try {
            await VaultCore.addHeir(heirData);
            closeAllModals();
            e.target.reset();
            updateInheritanceTab();
            updateDashboard();
        } catch (error) {
            alert('Error adding heir: ' + error.message);
        }
    }

    /**
     * Delete wallet
     */
    async function deleteWallet(walletId) {
        if (confirm('Are you sure you want to delete this wallet? This cannot be undone.')) {
            try {
                await VaultCore.deleteWallet(walletId);
                updateWalletsList();
                updateDashboard();
            } catch (error) {
                alert('Error deleting wallet: ' + error.message);
            }
        }
    }

    /**
     * Delete backup
     */
    async function deleteBackup(backupId) {
        if (confirm('Are you sure you want to delete this backup record?')) {
            try {
                await VaultCore.deleteBackup(backupId);
                updateBackupsList();
                updateDashboard();
            } catch (error) {
                alert('Error deleting backup: ' + error.message);
            }
        }
    }

    /**
     * Verify backup
     */
    async function verifyBackup(backupId) {
        try {
            await VaultCore.verifyBackup(backupId);
            updateBackupsList();
            updateDashboard();
        } catch (error) {
            alert('Error verifying backup: ' + error.message);
        }
    }

    /**
     * Delete heir
     */
    async function deleteHeir(heirId) {
        if (confirm('Are you sure you want to remove this heir?')) {
            try {
                await VaultCore.deleteHeir(heirId);
                updateInheritanceTab();
                updateDashboard();
            } catch (error) {
                alert('Error removing heir: ' + error.message);
            }
        }
    }

    /**
     * Handle template selection
     */
    function handleTemplateSelect(e) {
        const template = e.currentTarget.dataset.template;
        const templateData = VaultCore.WALLET_TEMPLATES[template];
        
        if (templateData) {
            document.getElementById('wallet-type').value = templateData.type;
            if (templateData.requiredSignatures) {
                document.getElementById('multisig-m').value = templateData.requiredSignatures;
            }
            if (templateData.totalKeys) {
                document.getElementById('multisig-n').value = templateData.totalKeys;
            }
            openModal('modal-add-wallet');
        }
    }

    /**
     * Handle wizard navigation
     */
    function handleWizardNav(e) {
        const direction = e.currentTarget.dataset.wizardNav;
        if (direction === 'next') {
            VaultInheritance.nextStep();
        } else {
            VaultInheritance.previousStep();
        }
        updateWizardUI();
    }

    /**
     * Update wizard UI
     */
    function updateWizardUI() {
        const step = VaultInheritance.getCurrentStep();
        
        // Update progress indicators
        document.querySelectorAll('.progress-step').forEach((el, index) => {
            el.classList.toggle('active', index === step.index);
            el.classList.toggle('completed', index < step.index);
        });

        // Update step content
        document.querySelectorAll('.wizard-step').forEach((el, index) => {
            el.classList.toggle('active', index === step.index);
        });
    }

    /**
     * Handle instruction template selection
     */
    function handleInstructionTemplate(e) {
        const templateId = e.currentTarget.dataset.template;
        const content = VaultInheritance.applyInstructionTemplate(templateId);
        if (content) {
            document.getElementById('heir-instructions').value = content;
        }
    }

    /**
     * Handle export vault
     */
    async function handleExportVault() {
        try {
            await VaultExport.downloadEncryptedVault();
        } catch (error) {
            alert('Error exporting vault: ' + error.message);
        }
    }

    /**
     * Handle generate emergency document
     */
    function handleGenerateEmergencyDoc() {
        try {
            const showLocations = document.getElementById('show-locations')?.checked || false;
            VaultExport.openEmergencyDocument({ showFullLocations: showLocations });
        } catch (error) {
            alert('Error generating document: ' + error.message);
        }
    }

    /**
     * Handle quick action buttons
     */
    function handleQuickAction(e) {
        const action = e.currentTarget.dataset.action;
        switch (action) {
            case 'add-wallet':
                openModal('modal-add-wallet');
                break;
            case 'add-backup':
                openModal('modal-add-backup');
                break;
            case 'verify-backup':
                switchTab('backups');
                break;
            case 'emergency-doc':
                switchTab('emergency');
                break;
        }
    }

    /**
     * Handle dead man's switch toggle
     */
    async function handleDMSToggle(e) {
        const enabled = e.target.checked;
        const dmsSettings = document.getElementById('dms-settings');
        
        if (dmsSettings) {
            dmsSettings.style.display = enabled ? 'block' : 'none';
        }

        try {
            const plan = VaultCore.getInheritancePlan();
            plan.deadManSwitch.enabled = enabled;
            await VaultCore.updateInheritancePlan(plan);
            updateDashboard();
        } catch (error) {
            console.error('Error updating DMS:', error);
        }
    }

    /**
     * Handle keyboard shortcuts
     */
    function handleKeyboard(e) {
        // Escape closes modals
        if (e.key === 'Escape') {
            closeAllModals();
        }

        // Ctrl/Cmd + L locks vault
        if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
            e.preventDefault();
            handleLock();
        }
    }

    // Public API
    return {
        init,
        switchTab,
        openModal,
        closeAllModals,
        
        // Wallet actions
        editWallet: (id) => console.log('Edit wallet:', id), // TODO
        deleteWallet,
        
        // Backup actions
        verifyBackup,
        deleteBackup,
        
        // Heir actions
        editHeir: (id) => console.log('Edit heir:', id), // TODO
        deleteHeir,
        
        // For debugging
        get isUnlocked() { return _isUnlocked; }
    };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', VaultApp.init);
