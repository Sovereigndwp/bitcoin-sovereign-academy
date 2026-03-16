/**
 * MAIN CONTROLLER
 * Orchestrates all interactive components
 */

// Global instances
let simulation;
let feeVisualizer;
let scenarioQuiz;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeDemo();
});

function initializeDemo() {
    // Create simulation instance
    simulation = new MempoolSimulation();
    simulation.setScenario('low'); // Start with low demand

    // Create fee visualizer
    feeVisualizer = new FeeMarketVisualizer('fee-histogram');
    feeVisualizer.setSimulation(simulation);

    // Create scenario quiz
    scenarioQuiz = new ScenarioQuiz();

    // Setup all event listeners
    setupNavigationListeners();
    setupStep1Listeners();
    setupStep2Listeners();
    setupStep3Listeners();
    setupStep5Listeners();

    // Initialize first step
    renderStep1();
}

/**
 * NAVIGATION LISTENERS
 */
function setupNavigationListeners() {
    // Next buttons
    document.querySelectorAll('.btn-next').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const nextStep = parseInt(e.target.dataset.next);
            navigateToStep(nextStep);
        });
    });

    // Back buttons
    document.querySelectorAll('.btn-back').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const prevStep = parseInt(e.target.dataset.prev);
            navigateToStep(prevStep);
        });
    });

    // Progress step clicks
    document.querySelectorAll('.step').forEach(step => {
        step.addEventListener('click', (e) => {
            const stepNum = parseInt(step.dataset.step);
            navigateToStep(stepNum);
        });
    });
}

function navigateToStep(stepNum) {
    // Hide all steps
    document.querySelectorAll('.learning-step').forEach(step => {
        step.classList.remove('active');
    });

    // Show target step
    const targetStep = document.getElementById(`step-${stepNum}`);
    if (targetStep) {
        targetStep.classList.add('active');
    }

    // Update progress indicators
    document.querySelectorAll('.step').forEach(step => {
        const num = parseInt(step.dataset.step);
        step.classList.remove('active', 'completed');

        if (num === stepNum) {
            step.classList.add('active');
        } else if (num < stepNum) {
            step.classList.add('completed');
        }
    });

    // Render step-specific content
    switch(stepNum) {
        case 1:
            renderStep1();
            break;
        case 2:
            renderStep2();
            break;
        case 3:
            renderStep3();
            break;
        case 4:
            // Scenarios are static HTML
            break;
        case 5:
            // Summary is static HTML
            break;
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * STEP 1: MEMPOOL INTRODUCTION
 */
function setupStep1Listeners() {
    const addTxBtn = document.getElementById('add-tx-step1');
    if (addTxBtn) {
        addTxBtn.addEventListener('click', () => {
            const tx = simulation.generateTransaction();
            renderStep1();
        });
    }
}

function renderStep1() {
    const pool = document.getElementById('pool-1');
    const txCountEl = document.getElementById('tx-count-1');

    if (!pool || !txCountEl) return;

    // Clear pool
    pool.innerHTML = '';

    // Render transactions as bubbles
    simulation.transactions.forEach(tx => {
        const bubble = createTxBubble(tx);
        pool.appendChild(bubble);
    });

    // Update count
    txCountEl.textContent = simulation.transactions.length;

    // Start timer if not already running
    if (!simulation.blockInterval) {
        simulation.startBlockTimer((block) => {
            // Auto-mined block - refresh view
            renderStep1();
        });
    }
}

function createTxBubble(tx) {
    const bubble = document.createElement('div');
    bubble.className = `tx-bubble ${tx.priority}-fee`;
    bubble.title = `TX ${tx.id}\nSize: ${tx.size} bytes\nFee: ${tx.feeRate} sat/vB\nTotal: ${tx.totalFee} sats`;

    const id = document.createElement('div');
    id.className = 'tx-id';
    id.textContent = tx.id;

    const fee = document.createElement('div');
    fee.className = 'tx-fee';
    fee.textContent = `${tx.feeRate} sat/vB`;

    bubble.appendChild(id);
    bubble.appendChild(fee);

    return bubble;
}

/**
 * STEP 2: MINER SELECTION
 */
function setupStep2Listeners() {
    const mineBtn = document.getElementById('mine-block-step2');
    const addMoreBtn = document.getElementById('add-more-step2');

    if (mineBtn) {
        mineBtn.addEventListener('click', () => {
            const block = simulation.mineBlock();
            renderMinedBlock(block);

            // Add new transactions after mining
            setTimeout(() => {
                for (let i = 0; i < 10; i++) {
                    simulation.generateTransaction();
                }
                renderStep2();
            }, 1000);
        });
    }

    if (addMoreBtn) {
        addMoreBtn.addEventListener('click', () => {
            for (let i = 0; i < 5; i++) {
                simulation.generateTransaction();
            }
            renderStep2();
        });
    }
}

function renderStep2() {
    const pool = document.getElementById('pool-2');
    const blockTxs = document.getElementById('block-txs-2');

    if (!pool) return;

    // Clear and render sorted mempool
    pool.innerHTML = '';

    const sorted = simulation.sortByFeeRate();
    sorted.forEach(tx => {
        const row = createTxRow(tx);
        pool.appendChild(row);
    });
}

function createTxRow(tx) {
    const row = document.createElement('div');
    row.className = `tx-row ${tx.priority}-fee`;

    row.innerHTML = `
        <div class="tx-indicator"></div>
        <div class="tx-details">
            <span>${tx.id}</span>
            <span>${tx.size} bytes</span>
            <span><strong>${tx.feeRate} sat/vB</strong></span>
            <span>${tx.totalFee} sats</span>
        </div>
    `;

    return row;
}

function renderMinedBlock(block) {
    const blockFill = document.getElementById('block-fill-2');
    const blockPercent = document.getElementById('block-percent-2');
    const blockTxs = document.getElementById('block-txs-2');

    if (blockFill && blockPercent) {
        blockFill.style.width = block.fillPercentage + '%';
        blockPercent.textContent = block.fillPercentage + '%';
    }

    if (blockTxs) {
        blockTxs.innerHTML = '';

        block.transactions.slice(0, 10).forEach(tx => {
            const row = createTxRow(tx);
            blockTxs.appendChild(row);
        });

        if (block.transactions.length > 10) {
            const more = document.createElement('div');
            more.style.textAlign = 'center';
            more.style.color = 'var(--color-text-dim)';
            more.textContent = `... and ${block.transactions.length - 10} more transactions`;
            blockTxs.appendChild(more);
        }

        // Show block stats
        const stats = document.createElement('div');
        stats.style.marginTop = '1rem';
        stats.style.padding = '1rem';
        stats.style.background = 'var(--color-surface-light)';
        stats.style.borderRadius = '8px';
        stats.innerHTML = `
            <p><strong>Block Statistics:</strong></p>
            <p>Transactions: ${block.transactions.length}</p>
            <p>Total Fees: ${MempoolSimulation.formatNumber(block.totalFees)} sats (${MempoolSimulation.formatSats(block.totalFees)})</p>
            <p>Block Reward: ${MempoolSimulation.formatSats(block.blockReward)}</p>
            <p>Total Revenue: ${MempoolSimulation.formatSats(block.totalRevenue)}</p>
        `;
        blockTxs.appendChild(stats);
    }
}

/**
 * STEP 3: FEE MARKET DYNAMICS
 */
function setupStep3Listeners() {
    // Scenario buttons
    document.querySelectorAll('.scenario-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const scenario = e.target.dataset.scenario;

            // Update active state
            document.querySelectorAll('.scenario-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            // Change simulation scenario
            simulation.setScenario(scenario);

            // Re-render
            renderStep3();
        });
    });

    // Transaction size input
    const txSizeInput = document.getElementById('tx-size');
    if (txSizeInput) {
        txSizeInput.addEventListener('input', () => {
            updateFeeEstimation();
        });
    }

    // Fee rate slider
    const feeRateInput = document.getElementById('fee-rate');
    const feeRateDisplay = document.getElementById('fee-rate-display');

    if (feeRateInput) {
        feeRateInput.addEventListener('input', (e) => {
            const value = e.target.value;
            if (feeRateDisplay) {
                feeRateDisplay.textContent = `${value} sat/vB`;
            }
            updateFeeEstimation();
        });
    }
}

function renderStep3() {
    // Draw histogram
    feeVisualizer.drawHistogram();

    // Update recommendations
    feeVisualizer.updateRecommendations();

    // Update estimation
    updateFeeEstimation();
}

function updateFeeEstimation() {
    const txSize = parseInt(document.getElementById('tx-size')?.value || 250);
    const feeRate = parseInt(document.getElementById('fee-rate')?.value || 10);

    feeVisualizer.updateEstimation(feeRate, txSize);
}

/**
 * STEP 5: SUMMARY
 */
function setupStep5Listeners() {
    const retakeBtn = document.getElementById('retake-quiz');
    const restartBtn = document.getElementById('restart-demo');

    if (retakeBtn) {
        retakeBtn.addEventListener('click', () => {
            scenarioQuiz.reset();
            navigateToStep(4);
        });
    }

    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            // Reset simulation
            simulation.stopBlockTimer();
            simulation = new MempoolSimulation();
            simulation.setScenario('low');
            feeVisualizer.setSimulation(simulation);

            // Reset quiz
            scenarioQuiz.reset();

            // Go to step 1
            navigateToStep(1);
        });
    }
}

/**
 * UTILITY FUNCTIONS
 */
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (simulation) {
        simulation.stopBlockTimer();
    }
});
