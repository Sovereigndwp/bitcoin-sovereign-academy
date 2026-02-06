/**
 * Mempool Visualizer - Live Data Integration & Interactive Exercises
 * Fetches real-time mempool data from mempool.space API
 * Handles transaction selection and batch analysis exercises
 */

// ===== LIVE MEMPOOL DATA FETCHING =====
let liveFeeData = {
    fastestFee: 0,
    halfHourFee: 0,
    hourFee: 0,
    mempoolSize: 0
};

async function fetchLiveMempoolData() {
    try {
        // Fetch recommended fees from mempool.space API
        const feesResponse = await fetch('https://mempool.space/api/v1/fees/recommended');
        const feesData = await feesResponse.json();
        
        // Fetch mempool stats
        const mempoolResponse = await fetch('https://mempool.space/api/mempool');
        const mempoolData = await mempoolResponse.json();
        
        // Store data globally
        liveFeeData = {
            fastestFee: feesData.fastestFee,
            halfHourFee: feesData.halfHourFee,
            hourFee: feesData.hourFee,
            mempoolSize: mempoolData.count
        };
        
        // Update UI
        updateLiveStatsUI();
        return true;
    } catch (error) {
        console.error('Failed to fetch live mempool data:', error);
        showFallbackData();
        return false;
    }
}

function updateLiveStatsUI() {
    document.getElementById('live-high-priority').textContent = `${liveFeeData.fastestFee} sat/vB`;
    document.getElementById('live-medium-priority').textContent = `${liveFeeData.hourFee} sat/vB`;
    document.getElementById('live-low-priority').textContent = `${Math.max(1, Math.floor(liveFeeData.hourFee / 2))} sat/vB`;
    document.getElementById('live-mempool-size').textContent = liveFeeData.mempoolSize.toLocaleString();
}

function showFallbackData() {
    document.getElementById('live-high-priority').textContent = '20 sat/vB';
    document.getElementById('live-medium-priority').textContent = '10 sat/vB';
    document.getElementById('live-low-priority').textContent = '3 sat/vB';
    document.getElementById('live-mempool-size').textContent = 'API offline';
}

// Fetch data when reaching the summary section
document.addEventListener('DOMContentLoaded', function() {
    // Initial fetch after 2 seconds (give page time to load)
    setTimeout(fetchLiveMempoolData, 2000);
    
    // Refresh every 60 seconds
    setInterval(fetchLiveMempoolData, 60000);
});

// ===== LIVE QUIZ FUNCTIONS =====
function checkLiveQuiz(questionNum) {
    const feedbackDiv = document.getElementById(`live-feedback-${questionNum}`);
    
    if (questionNum === 1) {
        const selected = document.querySelector('input[name="liveQ1"]:checked');
        if (!selected) {
            feedbackDiv.innerHTML = '<p class="incorrect">❌ Please select an answer.</p>';
            feedbackDiv.style.display = 'block';
            return;
        }
        
        if (selected.value === 'medium') {
            feedbackDiv.innerHTML = `<p class="correct">✅ Correct! Use the Medium Priority rate (${liveFeeData.hourFee} sat/vB) for confirmation within 1 hour. The High Priority rate would be overkill and waste money.</p>`;
        } else if (selected.value === 'high') {
            feedbackDiv.innerHTML = '<p class="incorrect">❌ While this would work, you would be overpaying. High Priority is for urgent (next block) transactions. Medium Priority is sufficient for 1-hour confirmation.</p>';
        } else {
            feedbackDiv.innerHTML = '<p class="incorrect">❌ Low Priority might take 24+ hours. Since you need confirmation within 1 hour, use Medium Priority.</p>';
        }
        feedbackDiv.style.display = 'block';
    }
    
    if (questionNum === 2) {
        const selected = document.querySelector('input[name="liveQ2"]:checked');
        if (!selected) {
            feedbackDiv.innerHTML = '<p class="incorrect">❌ Please select an answer.</p>';
            feedbackDiv.style.display = 'block';
            return;
        }
        
        const size = liveFeeData.mempoolSize;
        let correct = '';
        if (size < 50000) correct = 'low';
        else if (size < 150000) correct = 'medium';
        else correct = 'high';
        
        if (selected.value === correct) {
            feedbackDiv.innerHTML = `<p class="correct">✅ Correct! With ${size.toLocaleString()} pending transactions, the network congestion is ${correct}.</p>`;
        } else {
            feedbackDiv.innerHTML = `<p class="incorrect">❌ Incorrect. With ${size.toLocaleString()} pending transactions, the congestion is actually ${correct}. Low: <50k, Medium: 50-150k, High: >150k.</p>`;
        }
        feedbackDiv.style.display = 'block';
    }
    
    if (questionNum === 3) {
        const input = document.getElementById('feeCalcInput');
        const userAnswer = parseInt(input.value);
        const correctAnswer = 400 * liveFeeData.hourFee; // 400 bytes * medium priority rate
        
        if (!userAnswer || isNaN(userAnswer)) {
            feedbackDiv.innerHTML = '<p class="incorrect">❌ Please enter a number.</p>';
            feedbackDiv.style.display = 'block';
            return;
        }
        
        if (userAnswer === correctAnswer) {
            feedbackDiv.innerHTML = `<p class="correct">✅ Perfect! 400 bytes × ${liveFeeData.hourFee} sat/vB = ${correctAnswer} sats</p>`;
        } else {
            feedbackDiv.innerHTML = `<p class="incorrect">❌ Not quite. The correct calculation is:<br>400 bytes × ${liveFeeData.hourFee} sat/vB = <strong>${correctAnswer} sats</strong><br>Your answer: ${userAnswer} sats</p>`;
        }
        feedbackDiv.style.display = 'block';
    }
}

// ===== TRANSACTION SELECTION EXERCISE =====
let selectedTransactions = [];
let usedBytes = 0;
const MAX_BLOCK_SIZE = 1000; // Simplified for exercise

function initTransactionSelectionExercise() {
    const txItems = document.querySelectorAll('.tx-item');
    
    txItems.forEach(tx => {
        tx.addEventListener('click', function() {
            const txid = this.dataset.txid;
            const size = parseInt(this.dataset.size);
            const fee = parseInt(this.dataset.fee);
            
            // Check if already selected
            if (selectedTransactions.find(t => t.txid === txid)) {
                // Remove from selection
                selectedTransactions = selectedTransactions.filter(t => t.txid !== txid);
                usedBytes -= size;
                this.classList.remove('selected');
            } else {
                // Check if fits in block
                if (usedBytes + size <= MAX_BLOCK_SIZE) {
                    selectedTransactions.push({ txid, size, fee, totalFee: size * fee });
                    usedBytes += size;
                    this.classList.add('selected');
                } else {
                    alert('Block capacity exceeded! Remove some transactions first.');
                    return;
                }
            }
            
            updateBlockDisplay();
        });
    });
    
    document.getElementById('reset-selection').addEventListener('click', resetSelection);
    document.getElementById('check-selection').addEventListener('click', checkSelection);
}

function updateBlockDisplay() {
    const selectedPool = document.getElementById('selected-tx-pool');
    const capacityFill = document.getElementById('miner-capacity-fill');
    const usedBytesSpan = document.getElementById('used-bytes');
    const totalRevenueSpan = document.getElementById('total-revenue');
    
    // Update capacity bar
    const percent = (usedBytes / MAX_BLOCK_SIZE) * 100;
    capacityFill.style.width = `${percent}%`;
    usedBytesSpan.textContent = usedBytes;
    
    // Calculate total revenue
    const totalRevenue = selectedTransactions.reduce((sum, tx) => sum + tx.totalFee, 0);
    totalRevenueSpan.textContent = `${totalRevenue.toLocaleString()} sats`;
    
    // Update selected transactions display
    if (selectedTransactions.length === 0) {
        selectedPool.innerHTML = '<p class="empty-state">Click transactions to add them to your block</p>';
    } else {
        selectedPool.innerHTML = selectedTransactions
            .map(tx => `<div class="mini-tx">TX #${tx.txid} - ${tx.fee} sat/vB</div>`)
            .join('');
    }
}

function resetSelection() {
    selectedTransactions = [];
    usedBytes = 0;
    document.querySelectorAll('.tx-item').forEach(tx => tx.classList.remove('selected'));
    updateBlockDisplay();
    document.getElementById('selection-feedback').style.display = 'none';
}

function checkSelection() {
    const feedback = document.getElementById('selection-feedback');
    
    // Calculate if this was optimal
    // Optimal strategy: select highest fee/byte transactions that fit
    const optimalRevenue = getOptimalRevenue();
    const userRevenue = selectedTransactions.reduce((sum, tx) => sum + tx.totalFee, 0);
    
    const efficiency = (userRevenue / optimalRevenue) * 100;
    
    if (efficiency >= 95) {
        feedback.innerHTML = `<p class="correct">✅ Excellent! You selected ${userRevenue.toLocaleString()} sats worth of transactions, which is ${efficiency.toFixed(0)}% of the maximum possible revenue. You understand how miners prioritize!</p>`;
    } else if (efficiency >= 75) {
        feedback.innerHTML = `<p class="partial">⚠️ Good attempt! You earned ${userRevenue.toLocaleString()} sats, but the optimal selection would earn ${optimalRevenue.toLocaleString()} sats (${efficiency.toFixed(0)}% efficiency). Try prioritizing transactions with the highest sat/vB rates.</p>`;
    } else {
        feedback.innerHTML = `<p class="incorrect">❌ You earned ${userRevenue.toLocaleString()} sats, but you could earn ${optimalRevenue.toLocaleString()} sats by selecting transactions with higher fee rates. Miners maximize revenue by choosing the highest sat/vB transactions first!</p>`;
    }
    
    feedback.style.display = 'block';
}

function getOptimalRevenue() {
    // Get all transactions sorted by fee rate
    const allTx = [
        { txid: '1', size: 200, fee: 50, totalFee: 10000 },
        { txid: '2', size: 300, fee: 25, totalFee: 7500 },
        { txid: '3', size: 150, fee: 60, totalFee: 9000 },
        { txid: '4', size: 250, fee: 5, totalFee: 1250 },
        { txid: '5', size: 220, fee: 45, totalFee: 9900 },
        { txid: '6', size: 180, fee: 15, totalFee: 2700 }
    ].sort((a, b) => b.fee - a.fee);
    
    let total = 0;
    let used = 0;
    
    for (const tx of allTx) {
        if (used + tx.size <= MAX_BLOCK_SIZE) {
            total += tx.totalFee;
            used += tx.size;
        }
    }
    
    return total;
}

// ===== BATCH ANALYSIS EXERCISE =====
function initBatchAnalysisExercise() {
    const batchItems = document.querySelectorAll('.batch-tx-item');
    const dropzones = document.querySelectorAll('.category-dropzone');
    
    // Drag and drop handlers
    batchItems.forEach(item => {
        item.addEventListener('dragstart', function(e) {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', this.innerHTML);
            e.dataTransfer.setData('txid', this.dataset.txid);
            e.dataTransfer.setData('category', this.dataset.category);
            this.classList.add('dragging');
        });
        
        item.addEventListener('dragend', function() {
            this.classList.remove('dragging');
        });
    });
    
    dropzones.forEach(zone => {
        zone.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            this.classList.add('drag-over');
        });
        
        zone.addEventListener('dragleave', function() {
            this.classList.remove('drag-over');
        });
        
        zone.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            
            const txid = e.dataTransfer.getData('txid');
            const originalItem = document.querySelector(`.batch-tx-item[data-txid="${txid}"]`);
            
            if (originalItem) {
                this.appendChild(originalItem);
            }
        });
    });
    
    document.getElementById('check-batch').addEventListener('click', checkBatchGrouping);
    document.getElementById('reset-batch').addEventListener('click', resetBatchGrouping);
}

function checkBatchGrouping() {
    const feedback = document.getElementById('batch-feedback');
    let correct = 0;
    let total = 0;
    const errors = [];
    
    // Check each category
    const categories = ['high-priority', 'rbf-enabled', 'consolidation'];
    
    categories.forEach(cat => {
        const zone = document.getElementById(`${cat}-zone`);
        const items = zone.querySelectorAll('.batch-tx-item');
        
        items.forEach(item => {
            total++;
            const itemCategories = item.dataset.category.split(',');
            if (itemCategories.includes(cat)) {
                correct++;
            } else {
                errors.push(`TX ${item.querySelector('strong').textContent} doesn't belong in "${cat.replace('-', ' ')}"`);
            }
        });
    });
    
    const score = (correct / total) * 100;
    
    if (score === 100) {
        feedback.innerHTML = '<p class="correct">✅ Perfect! You correctly identified all transaction characteristics. You understand RBF, consolidation, and priority levels!</p>';
    } else if (score >= 60) {
        feedback.innerHTML = `<p class="partial">⚠️ Good effort! ${correct}/${total} correct.<br>Issues: ${errors.join(', ')}</p>`;
    } else {
        feedback.innerHTML = `<p class="incorrect">❌ Keep trying! ${correct}/${total} correct.<br>Remember: High priority = 50+ sat/vB, RBF = Replace-By-Fee enabled, Consolidation = many inputs (10+)</p>`;
    }
    
    feedback.style.display = 'block';
}

function resetBatchGrouping() {
    const batchPool = document.getElementById('batch-tx-pool');
    const batchItems = document.querySelectorAll('.batch-tx-item');
    
    batchItems.forEach(item => {
        batchPool.appendChild(item);
    });
    
    document.getElementById('batch-feedback').style.display = 'none';
}

// ===== INITIALIZE ALL EXERCISES =====
document.addEventListener('DOMContentLoaded', function() {
    // Wait for DOM to be fully loaded
    setTimeout(() => {
        if (document.getElementById('available-tx-pool')) {
            initTransactionSelectionExercise();
        }
        if (document.getElementById('batch-tx-pool')) {
            initBatchAnalysisExercise();
        }
    }, 500);
});
