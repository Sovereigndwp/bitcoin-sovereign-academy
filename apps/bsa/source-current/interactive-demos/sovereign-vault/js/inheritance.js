/**
 * Sovereign Vault - Inheritance Planning Module
 * 
 * Handles:
 * - Inheritance wizard workflow
 * - Heir management
 * - Dead man's switch configuration
 * - Access control modes
 * - Instruction templates
 */

const VaultInheritance = (function() {
    'use strict';

    // Wizard steps
    const WIZARD_STEPS = [
        { id: 'heirs', label: 'Define Heirs' },
        { id: 'access', label: 'Access Plan' },
        { id: 'instructions', label: 'Instructions' },
        { id: 'deadman', label: "Dead Man's Switch" }
    ];

    // Access modes
    const ACCESS_MODES = {
        immediate: {
            id: 'immediate',
            name: 'Immediate Access',
            description: 'Heirs can access funds immediately upon verification of death/incapacity',
            icon: '⚡',
            recommended: false
        },
        delayed: {
            id: 'delayed',
            name: 'Delayed Access',
            description: 'Access is granted after a waiting period, giving time to verify and cancel if needed',
            icon: '⏱️',
            recommended: true,
            defaultDays: 30
        },
        multiparty: {
            id: 'multiparty',
            name: 'Multi-Party Confirmation',
            description: 'Multiple heirs or trusted parties must confirm before access is granted',
            icon: '👥',
            recommended: false,
            requiresMultipleHeirs: true
        }
    };

    // Instruction templates
    const INSTRUCTION_TEMPLATES = {
        basic: {
            name: 'Basic Recovery',
            content: `# Bitcoin Recovery Instructions

## Important First Steps
1. Do not panic - Bitcoin on the blockchain is secure indefinitely
2. Contact the trusted advisor listed below to verify this document
3. Gather all materials listed before attempting recovery

## Recovery Process

### For Single-Signature Wallets
1. Locate the seed phrase backup from the documented location
2. Use a hardware wallet (Coldcard, Trezor, Ledger) to restore
3. Enter the 12 or 24 words exactly as written
4. Verify the balance matches expectations before transacting

### For Multi-Signature Wallets
1. You will need access to multiple keys (see wallet details)
2. Locate the wallet configuration file (descriptor)
3. Use compatible software (Sparrow, Nunchuk) to import
4. Coordinate with other keyholders if necessary

## Security Warnings
- NEVER enter seed phrases on websites
- NEVER share seed phrases via email, text, or phone
- NEVER trust unsolicited "support" contacts
- Test with small amounts first

## Trusted Contacts
[Listed in this document - verify their identity before sharing information]

## Additional Notes
[Add any specific instructions for your situation]`
        },
        technical: {
            name: 'Technical (Detailed)',
            content: `# Bitcoin Custody Recovery - Technical Guide

## Document Overview
This document provides detailed technical instructions for recovering Bitcoin held in self-custody wallets. Follow all steps carefully.

## Wallet Architecture

### Derivation Paths
- Native SegWit (Recommended): m/84'/0'/0'
- Nested SegWit: m/49'/0'/0'
- Legacy: m/44'/0'/0'

### Address Types
- bc1q... = Native SegWit (bech32)
- 3... = Nested SegWit (P2SH)
- 1... = Legacy (P2PKH)

## Recovery Procedures

### Single-Signature Recovery
1. **Verify Seed Integrity**
   - Check all words are from BIP39 wordlist
   - Verify checksum is valid (word 12 or 24)
   - If passphrase is used, ensure you have it

2. **Hardware Wallet Recovery**
   - Initialize device in recovery mode
   - Enter words in exact order
   - Set new PIN
   - Verify first receiving address matches records

3. **Software Wallet Recovery (if needed)**
   - Use open-source wallets only (Sparrow, Electrum)
   - Verify software signatures before installing
   - Never use online/web wallets for recovery

### Multi-Signature Recovery
1. **Gather Required Materials**
   - Wallet descriptor/configuration file
   - Required number of seed phrases (M of N)
   - Hardware devices if applicable

2. **Reconstruct Wallet**
   - Import descriptor into coordinator software
   - Connect/import signing keys
   - Verify addresses match records

3. **Transaction Signing**
   - Create unsigned transaction (PSBT)
   - Circulate for required signatures
   - Broadcast only when fully signed

## UTXO Management
- Review UTXOs before spending
- Consider coin control for privacy
- Be aware of fee implications

## Verification Steps
Before any transaction:
- Verify receiving address character by character
- Send small test amount first
- Wait for confirmation before larger amounts

## Emergency Contacts
[Technical advisor contacts here]

## Appendix: Wallet Details
[Specific wallet configurations]`
        },
        family: {
            name: 'Family (Non-Technical)',
            content: `# Bitcoin Recovery Guide for Family

Dear Family Member,

I've prepared this guide to help you recover Bitcoin that I hold in self-custody. Please read this entire document before taking any action. Bitcoin is secure - there is no rush.

## First Things First

**Do not panic.** Bitcoin stored properly doesn't expire or disappear. Take your time to understand these instructions.

**Contact our trusted advisor first.** Before doing anything with Bitcoin recovery, please contact:
[Add trusted advisor name and contact]

They can help verify this document is current and guide you through the process.

## What You'll Need

1. **The seed phrase backup** - This is a list of 12 or 24 English words that can restore the wallet. It's stored at:
   [Location details in this document]

2. **A hardware wallet device** - A small device that keeps Bitcoin keys secure. If you don't have one, our trusted advisor can help you get one.

3. **A computer** - Preferably one you trust and control.

## Step-by-Step Recovery

### Step 1: Get Help
Contact our trusted advisor. They will:
- Verify your identity
- Confirm this document is current
- Help you obtain a hardware wallet if needed
- Guide you through the process

### Step 2: Gather Materials
Collect the seed phrase from the documented location. Handle it carefully - anyone who sees these words can take the Bitcoin.

### Step 3: Recover the Wallet
With guidance from the advisor:
1. Set up the hardware wallet
2. Choose "recover existing wallet"
3. Enter the seed words exactly as written
4. Create a new PIN code

### Step 4: Verify and Secure
- Check that the balance appears
- Make note of the recovery date
- Store the seed phrase backup securely again

## Very Important Security Rules

🚫 **NEVER enter the seed words on any website**
🚫 **NEVER share the words by email, text, or phone**
🚫 **NEVER trust someone who contacts you offering "help"**
🚫 **NEVER give remote access to your computer**

If anyone asks for your seed phrase, they are trying to steal the Bitcoin. Legitimate helpers will guide you - they never need to see the words themselves.

## If You Need More Help

The Bitcoin community has resources:
- Bitcoin Support groups (verify legitimacy)
- Our trusted advisor
- The wallet manufacturer's official support

## A Note About Taxes and Legal

Bitcoin may have tax implications. Consider consulting with:
- A tax professional familiar with cryptocurrency
- An estate attorney if needed

## Final Thoughts

I've worked to set up this custody system to protect our family's Bitcoin. Trust the process, take your time, and don't hesitate to ask our trusted advisor for help.

With love,
[Your name]`
        },
        minimal: {
            name: 'Minimal',
            content: `# Recovery Instructions

## Quick Reference

1. Contact trusted advisor: [Name/Phone]
2. Seed phrase location: [See backup registry]
3. Hardware wallet: [Type/Location]

## Recovery Steps
1. Get hardware wallet
2. Select "Recover wallet"
3. Enter seed words from backup
4. Set new PIN
5. Verify balance

## Security Rules
- Never share seed phrase
- Never enter on websites
- Test with small amount first

## Additional Notes:
[Add your notes here]`
        }
    };

    // Wizard state
    let _currentStep = 0;
    let _wizardData = {
        heirs: [],
        accessMode: 'delayed',
        delayDays: 30,
        instructions: '',
        deadManSwitch: {
            enabled: false,
            checkInDays: 90,
            gracePeriodDays: 30
        }
    };

    /**
     * Initialize wizard with existing data
     */
    function initializeWizard() {
        const inheritancePlan = VaultCore.getInheritancePlan();
        const heirs = VaultCore.getHeirs();

        if (inheritancePlan) {
            _wizardData.accessMode = inheritancePlan.accessMode || 'delayed';
            _wizardData.delayDays = inheritancePlan.delayDays || 30;
            _wizardData.instructions = inheritancePlan.instructions || '';
            _wizardData.deadManSwitch = inheritancePlan.deadManSwitch || {
                enabled: false,
                checkInDays: 90,
                gracePeriodDays: 30
            };
        }

        if (heirs) {
            _wizardData.heirs = heirs;
        }

        _currentStep = 0;
    }

    /**
     * Get current wizard step
     */
    function getCurrentStep() {
        return {
            index: _currentStep,
            step: WIZARD_STEPS[_currentStep],
            isFirst: _currentStep === 0,
            isLast: _currentStep === WIZARD_STEPS.length - 1,
            totalSteps: WIZARD_STEPS.length
        };
    }

    /**
     * Navigate to next step
     */
    function nextStep() {
        if (_currentStep < WIZARD_STEPS.length - 1) {
            _currentStep++;
            return getCurrentStep();
        }
        return null;
    }

    /**
     * Navigate to previous step
     */
    function previousStep() {
        if (_currentStep > 0) {
            _currentStep--;
            return getCurrentStep();
        }
        return null;
    }

    /**
     * Go to specific step
     */
    function goToStep(stepIndex) {
        if (stepIndex >= 0 && stepIndex < WIZARD_STEPS.length) {
            _currentStep = stepIndex;
            return getCurrentStep();
        }
        return null;
    }

    /**
     * Get wizard data
     */
    function getWizardData() {
        return { ..._wizardData };
    }

    /**
     * Update wizard data
     */
    function updateWizardData(updates) {
        Object.assign(_wizardData, updates);
        return _wizardData;
    }

    /**
     * Validate current step
     */
    function validateStep(stepIndex = _currentStep) {
        const step = WIZARD_STEPS[stepIndex];
        const errors = [];

        switch (step.id) {
            case 'heirs':
                if (_wizardData.heirs.length === 0) {
                    errors.push('Add at least one heir');
                }
                _wizardData.heirs.forEach((heir, i) => {
                    if (!heir.name || heir.name.trim() === '') {
                        errors.push(`Heir ${i + 1}: Name is required`);
                    }
                });
                break;

            case 'access':
                if (!_wizardData.accessMode) {
                    errors.push('Select an access mode');
                }
                if (_wizardData.accessMode === 'delayed' && 
                    (!_wizardData.delayDays || _wizardData.delayDays < 1)) {
                    errors.push('Specify delay period (minimum 1 day)');
                }
                if (_wizardData.accessMode === 'multiparty' && 
                    _wizardData.heirs.length < 2) {
                    errors.push('Multi-party mode requires at least 2 heirs');
                }
                break;

            case 'instructions':
                if (!_wizardData.instructions || _wizardData.instructions.length < 50) {
                    errors.push('Provide detailed recovery instructions (minimum 50 characters)');
                }
                break;

            case 'deadman':
                if (_wizardData.deadManSwitch.enabled) {
                    if (_wizardData.deadManSwitch.checkInDays < 7) {
                        errors.push('Check-in interval must be at least 7 days');
                    }
                    if (_wizardData.deadManSwitch.gracePeriodDays < 7) {
                        errors.push('Grace period must be at least 7 days');
                    }
                }
                break;
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Save wizard data to vault
     */
    async function saveWizard() {
        // Validate all steps
        for (let i = 0; i < WIZARD_STEPS.length; i++) {
            const validation = validateStep(i);
            if (!validation.valid) {
                throw new Error(`Step ${i + 1} (${WIZARD_STEPS[i].label}): ${validation.errors[0]}`);
            }
        }

        // Save heirs
        const existingHeirs = VaultCore.getHeirs();
        const existingIds = existingHeirs.map(h => h.id);
        const newIds = _wizardData.heirs.filter(h => h.id).map(h => h.id);

        // Delete removed heirs
        for (const existing of existingHeirs) {
            if (!newIds.includes(existing.id)) {
                await VaultCore.deleteHeir(existing.id);
            }
        }

        // Add or update heirs
        for (const heir of _wizardData.heirs) {
            if (heir.id && existingIds.includes(heir.id)) {
                await VaultCore.updateHeir(heir.id, heir);
            } else {
                const newHeir = await VaultCore.addHeir(heir);
                heir.id = newHeir.id;
            }
        }

        // Save inheritance plan
        await VaultCore.updateInheritancePlan({
            accessMode: _wizardData.accessMode,
            delayDays: _wizardData.delayDays,
            instructions: _wizardData.instructions,
            deadManSwitch: _wizardData.deadManSwitch
        });

        return true;
    }

    /**
     * Get instruction template
     */
    function getInstructionTemplate(templateId) {
        return INSTRUCTION_TEMPLATES[templateId] || null;
    }

    /**
     * Get all instruction templates
     */
    function getInstructionTemplates() {
        return Object.keys(INSTRUCTION_TEMPLATES).map(key => ({
            id: key,
            name: INSTRUCTION_TEMPLATES[key].name
        }));
    }

    /**
     * Apply instruction template
     */
    function applyInstructionTemplate(templateId) {
        const template = INSTRUCTION_TEMPLATES[templateId];
        if (template) {
            _wizardData.instructions = template.content;
            return template.content;
        }
        return null;
    }

    /**
     * Calculate dead man's switch status display
     */
    function getDeadManSwitchDisplay() {
        const status = VaultCore.getDeadManSwitchStatus();
        if (!status || !status.enabled) {
            return {
                enabled: false,
                statusText: 'Disabled',
                statusClass: 'neutral'
            };
        }

        let statusText, statusClass, actionText;

        switch (status.status) {
            case 'ok':
                statusText = `Active - ${status.daysRemaining} days until check-in due`;
                statusClass = 'good';
                actionText = 'Check In Now';
                break;
            case 'warning':
                statusText = `Warning - ${status.daysRemaining} days remaining in grace period`;
                statusClass = 'warning';
                actionText = 'Check In Urgently';
                break;
            case 'triggered':
                statusText = 'Triggered - Heirs may be notified';
                statusClass = 'danger';
                actionText = 'Reset Now';
                break;
        }

        return {
            enabled: true,
            status: status.status,
            statusText,
            statusClass,
            actionText,
            lastCheckIn: status.lastCheckIn,
            daysSinceCheckIn: status.daysSinceCheckIn,
            daysRemaining: status.daysRemaining
        };
    }

    /**
     * Perform check-in
     */
    async function performCheckIn() {
        await VaultCore.recordCheckIn();
        return getDeadManSwitchDisplay();
    }

    /**
     * Add heir to wizard
     */
    function addHeirToWizard(heirData) {
        const heir = {
            name: heirData.name || '',
            relationship: heirData.relationship || '',
            email: heirData.email || '',
            phone: heirData.phone || '',
            isPrimary: heirData.isPrimary || false,
            sharePercentage: heirData.sharePercentage || null,
            accessLevel: heirData.accessLevel || 'full',
            walletAccess: heirData.walletAccess || [],
            notes: heirData.notes || ''
        };

        _wizardData.heirs.push(heir);
        return heir;
    }

    /**
     * Update heir in wizard
     */
    function updateHeirInWizard(index, updates) {
        if (index >= 0 && index < _wizardData.heirs.length) {
            Object.assign(_wizardData.heirs[index], updates);
            return _wizardData.heirs[index];
        }
        return null;
    }

    /**
     * Remove heir from wizard
     */
    function removeHeirFromWizard(index) {
        if (index >= 0 && index < _wizardData.heirs.length) {
            return _wizardData.heirs.splice(index, 1)[0];
        }
        return null;
    }

    /**
     * Get completion status
     */
    function getCompletionStatus() {
        const steps = WIZARD_STEPS.map((step, index) => {
            const validation = validateStep(index);
            return {
                ...step,
                index,
                complete: validation.valid,
                errors: validation.errors
            };
        });

        const completedCount = steps.filter(s => s.complete).length;
        const percentage = Math.round((completedCount / steps.length) * 100);

        return {
            steps,
            completedCount,
            totalSteps: steps.length,
            percentage,
            isComplete: completedCount === steps.length
        };
    }

    /**
     * Generate inheritance checklist for UI
     */
    function generateChecklist() {
        const heirs = VaultCore.getHeirs();
        const plan = VaultCore.getInheritancePlan();
        const wallets = VaultCore.getWallets();

        const items = [];

        // Heirs check
        items.push({
            id: 'heirs_defined',
            label: 'At least one heir defined',
            complete: heirs.length > 0,
            action: heirs.length === 0 ? 'Add your first heir' : null
        });

        // Primary heir check
        items.push({
            id: 'primary_heir',
            label: 'Primary heir designated',
            complete: heirs.some(h => h.isPrimary),
            action: !heirs.some(h => h.isPrimary) ? 'Designate a primary heir' : null
        });

        // Access mode check
        items.push({
            id: 'access_mode',
            label: 'Access mode configured',
            complete: !!plan?.accessMode,
            action: !plan?.accessMode ? 'Configure access mode' : null
        });

        // Instructions check
        items.push({
            id: 'instructions',
            label: 'Recovery instructions written',
            complete: plan?.instructions?.length > 100,
            action: !plan?.instructions || plan.instructions.length <= 100 ? 
                'Write detailed instructions' : null
        });

        // Wallet assignments check
        const walletsAssigned = wallets.every(w => 
            heirs.some(h => h.walletAccess?.includes(w.id))
        );
        items.push({
            id: 'wallet_assignments',
            label: 'All wallets assigned to heirs',
            complete: walletsAssigned && wallets.length > 0,
            action: !walletsAssigned ? 'Assign wallet access to heirs' : null
        });

        // Dead man's switch check (optional but recommended)
        items.push({
            id: 'dead_man_switch',
            label: "Dead man's switch configured",
            complete: plan?.deadManSwitch?.enabled,
            action: !plan?.deadManSwitch?.enabled ? 'Enable dead man\'s switch' : null,
            optional: true
        });

        // Contact info check
        const allHeirsHaveContact = heirs.every(h => h.email || h.phone);
        items.push({
            id: 'heir_contacts',
            label: 'All heirs have contact information',
            complete: allHeirsHaveContact && heirs.length > 0,
            action: !allHeirsHaveContact ? 'Add contact info for all heirs' : null
        });

        return items;
    }

    // Public API
    return {
        // Constants
        WIZARD_STEPS,
        ACCESS_MODES,
        INSTRUCTION_TEMPLATES,

        // Wizard lifecycle
        initializeWizard,
        getCurrentStep,
        nextStep,
        previousStep,
        goToStep,
        validateStep,
        saveWizard,

        // Wizard data
        getWizardData,
        updateWizardData,

        // Heirs in wizard
        addHeirToWizard,
        updateHeirInWizard,
        removeHeirFromWizard,

        // Instructions
        getInstructionTemplate,
        getInstructionTemplates,
        applyInstructionTemplate,

        // Dead man's switch
        getDeadManSwitchDisplay,
        performCheckIn,

        // Status
        getCompletionStatus,
        generateChecklist
    };
})();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VaultInheritance;
}
