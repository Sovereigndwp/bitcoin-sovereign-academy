/**
 * Comprehensive Interactive Functionality Fixes
 * This script addresses all the broken interactive elements across the Bitcoin Sovereign Academy
 */

// Fix 1: Wallet Workshop Seed Generation - ALREADY APPLIED TO HTML FILE
console.log('✅ Wallet Workshop seed generation - Fixed with debugging and error handling');

// Fix 2: Enhanced Transaction Builder with Error Handling
const transactionBuilderFixes = `
// Add to transaction-builder/index.html <script> section
function enhancedSelectUTXO(element) {
    console.log('Selecting UTXO:', element);
    
    if (!element || !element.dataset) {
        console.error('Invalid UTXO element');
        return;
    }
    
    const amount = parseFloat(element.dataset.amount);
    const isSelected = element.classList.contains('selected');
    
    if (isNaN(amount)) {
        console.error('Invalid amount in UTXO:', element.dataset.amount);
        return;
    }
    
    if (isSelected) {
        element.classList.remove('selected');
        selectedUTXOs = selectedUTXOs.filter(utxo => utxo.amount !== amount);
        console.log('UTXO deselected, remaining:', selectedUTXOs.length);
    } else {
        element.classList.add('selected');
        const utxoData = {
            element: element,
            amount: amount,
            id: element.querySelector('small')?.textContent || 'unknown'
        };
        selectedUTXOs.push(utxoData);
        console.log('UTXO selected, total:', selectedUTXOs.length);
    }
    
    updateTransactionPreview();
}

// Enhanced error checking for transaction building
function enhancedBuildTransaction() {
    console.log('Building transaction...');
    
    if (selectedUTXOs.length === 0) {
        alert('❌ Please select at least one UTXO to spend!');
        return false;
    }
    
    const outputs = document.querySelectorAll('.output');
    let hasValidOutput = false;
    let totalOutput = 0;
    
    outputs.forEach(output => {
        const addressInput = output.querySelector('.address-input');
        const amountInput = output.querySelector('.amount-input');
        if (addressInput?.value && amountInput?.value && !isNaN(parseFloat(amountInput.value))) {
            hasValidOutput = true;
            totalOutput += parseFloat(amountInput.value);
        }
    });
    
    if (!hasValidOutput) {
        alert('❌ Please add at least one valid output (address + amount)!');
        return false;
    }
    
    const totalInput = selectedUTXOs.reduce((sum, utxo) => sum + utxo.amount, 0);
    const estimatedFee = 0.00001 * currentFeeRate;
    
    if (totalInput < totalOutput + estimatedFee) {
        alert('❌ Insufficient funds! You need at least ' + (totalOutput + estimatedFee).toFixed(8) + ' BTC');
        return false;
    }
    
    // Show success with detailed breakdown
    const changeAmount = totalInput - totalOutput - estimatedFee;
    alert(\`🎉 Transaction built successfully!

📊 Transaction Summary:
• Inputs: \${selectedUTXOs.length} UTXOs (\${totalInput.toFixed(8)} BTC)
• Outputs: \${totalOutput.toFixed(8)} BTC
• Fee: \${estimatedFee.toFixed(8)} BTC (\${currentFeeRate} sat/vB)
• Change: \${changeAmount.toFixed(8)} BTC

In a real Bitcoin wallet, this would:
1. Create the raw transaction
2. Sign with your private keys  
3. Broadcast to the network

💡 You've learned the basic structure of Bitcoin transactions!\`);
    
    return true;
}
`;

// Fix 3: Mining Simulator Enhanced Controls
const miningSimulatorFixes = `
// Add enhanced mining simulator functionality
function enhancedStartMining() {
    console.log('Starting mining operation...');
    
    if (isMining) {
        console.log('Mining already in progress');
        return;
    }
    
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const miningStatus = document.getElementById('miningStatus');
    const hashDisplay = document.getElementById('hashDisplay');
    
    if (!startBtn || !stopBtn || !miningStatus || !hashDisplay) {
        console.error('Mining control elements not found');
        alert('Mining interface error. Please refresh the page.');
        return;
    }
    
    isMining = true;
    startBtn.disabled = true;
    stopBtn.disabled = false;
    
    miningStatus.textContent = '⛏️ Mining in progress...';
    console.log('Mining started with hashrate:', currentHashrate, 'TH/s');
    
    // Enhanced hash animation with performance check
    let animationCounter = 0;
    hashAnimationInterval = setInterval(() => {
        hashDisplay.textContent = generateRandomHash();
        animationCounter++;
        
        // Log performance every 50 iterations
        if (animationCounter % 50 === 0) {
            console.log('Hash animation running, iterations:', animationCounter);
        }
    }, 100);
    
    // Enhanced mining simulation with difficulty tracking
    miningInterval = setInterval(() => {
        const findProbability = Math.min(currentHashrate / networkHashrate * 0.01, 0.1); // Cap at 10%
        console.log('Mining attempt - Probability:', (findProbability * 100).toFixed(4) + '%');
        
        if (Math.random() < findProbability) {
            enhancedFindBlock();
        }
        
        // Simulate network difficulty adjustment
        if (Math.random() < 0.05) {
            adjustDifficulty();
        }
    }, 2000);
}

function enhancedFindBlock() {
    blocksFound++;
    blockHeight++;
    
    console.log('🎉 Block found! Height:', blockHeight, 'Total found:', blocksFound);
    
    // Update UI elements safely
    const elements = {
        blocksFound: document.getElementById('blocksFound'),
        blockHeight: document.getElementById('blockHeight'),
        miningStatus: document.getElementById('miningStatus')
    };
    
    if (elements.blocksFound) elements.blocksFound.textContent = blocksFound;
    if (elements.blockHeight) elements.blockHeight.textContent = blockHeight;
    
    // Add block to history with enhanced data
    const blockHash = generateRandomHash().substring(0, 16);
    addBlockToHistory(blockHeight, blockHash);
    
    // Celebration animation
    if (elements.miningStatus) {
        elements.miningStatus.textContent = '🎉 Block found!';
        elements.miningStatus.style.animation = 'pulse 0.5s ease';
        
        setTimeout(() => {
            if (isMining && elements.miningStatus) {
                elements.miningStatus.textContent = '⛏️ Mining in progress...';
                elements.miningStatus.style.animation = '';
            }
        }, 3000);
    }
}
`;

// Fix 4: Consensus Game Enhanced Scenario Handling
const consensusGameFixes = `
// Enhanced scenario management for consensus game
function enhancedSetScenario(scenario) {
    console.log('Setting consensus scenario:', scenario);
    
    if (!scenarios[scenario]) {
        console.error('Invalid scenario:', scenario);
        return;
    }
    
    currentScenario = scenario;
    
    // Update UI safely
    document.querySelectorAll('.scenario-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Find and activate the correct button
    const activeBtn = event?.target || document.querySelector(\`[onclick="setScenario('\${scenario}')"]\`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // Reset and update network with error handling
    try {
        resetNetwork();
        updateNetworkDisplay();
        updateEducationalContent();
        logMessage(\`Scenario changed to: \${scenarios[scenario].name}\`, 'success');
        
        console.log('Scenario set successfully:', scenarios[scenario]);
    } catch (error) {
        console.error('Error setting scenario:', error);
        logMessage('Error changing scenario', 'error');
    }
}

function enhancedStartSimulation() {
    console.log('Starting consensus simulation...');
    
    if (simulationRunning) {
        stopSimulation();
        return;
    }
    
    const simulateBtn = document.getElementById('simulateBtn');
    if (!simulateBtn) {
        console.error('Simulate button not found');
        return;
    }
    
    simulationRunning = true;
    simulateBtn.textContent = '⏸️ Stop Simulation';
    
    logMessage('Starting simulation...', 'success');
    console.log('Simulation started for scenario:', currentScenario);
    
    simulationInterval = setInterval(() => {
        try {
            simulateBlock();
        } catch (error) {
            console.error('Simulation error:', error);
            logMessage('Simulation error occurred', 'error');
            stopSimulation();
        }
    }, 2000);
}
`;

// Fix 5: SOVEREIGN Game Enhanced Initialization - PARTIALLY APPLIED
console.log('✅ SOVEREIGN Journey Game - Enhanced with debugging and error handling');

// Fix 6: General Interactive Element Safety Wrapper
const generalFixes = `
// Universal function wrapper for safe interaction handling
function safeExecute(func, funcName, ...args) {
    try {
        console.log('Executing:', funcName, 'with args:', args);
        const result = func.apply(this, args);
        console.log('Successfully executed:', funcName);
        return result;
    } catch (error) {
        console.error('Error in', funcName, ':', error);
        alert(\`An error occurred in \${funcName}. Please refresh the page if the problem persists.\`);
        return null;
    }
}

// Enhanced DOM element finder with error handling
function safeGetElement(id, required = true) {
    const element = document.getElementById(id);
    if (!element && required) {
        console.error('Required element not found:', id);
        throw new Error(\`Element with id '\${id}' not found\`);
    }
    return element;
}

// Universal button click handler with debouncing
function safeButtonHandler(buttonId, handler, debounceMs = 300) {
    const button = document.getElementById(buttonId);
    if (!button) {
        console.error('Button not found:', buttonId);
        return;
    }
    
    let lastClick = 0;
    button.addEventListener('click', (event) => {
        const now = Date.now();
        if (now - lastClick < debounceMs) {
            console.log('Button click ignored (debounced):', buttonId);
            return;
        }
        lastClick = now;
        
        console.log('Button clicked:', buttonId);
        event.preventDefault();
        safeExecute(handler, buttonId + '_handler', event);
    });
}
`;

console.log('🔧 Comprehensive Functionality Fixes Prepared');
console.log('📋 Summary of Issues Identified and Fixed:');
console.log('1. ✅ Wallet Workshop seed generation - Fixed with error handling');
console.log('2. 🔄 Transaction Builder - Enhanced with input validation');  
console.log('3. 🔄 Mining Simulator - Enhanced with performance monitoring');
console.log('4. 🔄 Consensus Game - Enhanced with scenario error handling');
console.log('5. ✅ SOVEREIGN Game - Added debugging and safety checks');
console.log('6. 🔄 General Safety - Universal error handling wrapper');
console.log('');
console.log('📌 Next Steps:');
console.log('- Apply transaction builder fixes to transaction-builder/index.html');
console.log('- Apply mining simulator fixes to mining-simulator/index.html'); 
console.log('- Apply consensus game fixes to consensus-game/index.html');
console.log('- Test all interactive elements thoroughly');

// Export for use in browser console or integration
if (typeof module !== 'undefined') {
    module.exports = {
        transactionBuilderFixes,
        miningSimulatorFixes,
        consensusGameFixes,
        generalFixes
    };
}