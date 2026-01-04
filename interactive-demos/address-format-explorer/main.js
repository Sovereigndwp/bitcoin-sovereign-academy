/**
 * MAIN CONTROLLER
 * Orchestrates address generation, fee calculation, and UI interactions
 */

let addressGen;
let feeCalc;
let currentAddresses;
let currentFeeRate = 20; // Default fallback

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    init();
});

function init() {
    addressGen = new AddressGenerator();
    feeCalc = new FeeCalculator();

    // Initialize 3D icons
    if (typeof IconLibrary !== 'undefined') {
        IconLibrary.initIcons();
    }

    // Generate initial addresses
    currentAddresses = addressGen.generateAddresses();
    displayAddresses(currentAddresses);

    // Setup event listeners
    setupEventListeners();

    // Fetch current fee rate from mempool.space
    fetchCurrentFeeRate().then(() => {
        // Calculate initial fees with live rate
        updateFeeCalculator();
    });
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Generate new seed button
    const generateBtn = document.getElementById('generate-new-seed');
    if (generateBtn) {
        generateBtn.addEventListener('click', generateNewSeed);
    }

    // Copy buttons
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.currentTarget.dataset.target;
            copyToClipboard(target, e.currentTarget);
        });
    });

    // Fee calculator inputs
    const feeRateInput = document.getElementById('fee-rate');
    const txCountInput = document.getElementById('tx-count');
    const btcPriceInput = document.getElementById('btc-price');

    if (feeRateInput) {
        feeRateInput.addEventListener('input', updateFeeCalculator);
    }

    if (txCountInput) {
        txCountInput.addEventListener('input', updateFeeCalculator);
    }

    if (btcPriceInput) {
        btcPriceInput.addEventListener('input', updateFeeCalculator);
    }

    // Decision tool
    const recommendBtn = document.getElementById('get-recommendation');
    if (recommendBtn) {
        recommendBtn.addEventListener('click', getRecommendation);
    }
}

/**
 * Generate new seed phrase and addresses
 */
function generateNewSeed() {
    const newSeed = addressGen.generateRandomSeed();
    currentAddresses = addressGen.generateAddresses(newSeed);

    // Update seed display
    const seedDisplay = document.getElementById('seed-phrase');
    if (seedDisplay) {
        seedDisplay.textContent = newSeed;
    }

    // Update addresses
    displayAddresses(currentAddresses);

    // Visual feedback
    const btn = document.getElementById('generate-new-seed');
    if (btn) {
        const checkIcon = IconLibrary ? IconLibrary.get('check', 16, true) : '✓';
        btn.innerHTML = checkIcon + ' New Addresses Generated!';
        btn.style.background = 'var(--color-segwit)';

        setTimeout(() => {
            btn.textContent = 'Generate Random Seed';
            btn.style.background = '';
        }, 2000);
    }
}

/**
 * Display generated addresses
 */
function displayAddresses(addresses) {
    const legacyEl = document.getElementById('legacy-address');
    const p2shEl = document.getElementById('p2sh-address');
    const segwitEl = document.getElementById('segwit-address');
    const taprootEl = document.getElementById('taproot-address');

    if (legacyEl) legacyEl.textContent = addresses.legacy;
    if (p2shEl) p2shEl.textContent = addresses.p2sh;
    if (segwitEl) segwitEl.textContent = addresses.segwit;
    if (taprootEl) taprootEl.textContent = addresses.taproot;
}

/**
 * Copy address to clipboard
 */
function copyToClipboard(targetId, button) {
    const element = document.getElementById(targetId);
    if (!element) return;

    const text = element.textContent;

    // Use modern clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showCopyFeedback(button);
        }).catch(err => {
            console.error('Failed to copy:', err);
            fallbackCopy(text, button);
        });
    } else {
        fallbackCopy(text, button);
    }
}

/**
 * Fallback copy method for older browsers
 */
function fallbackCopy(text, button) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();

    try {
        document.execCommand('copy');
        showCopyFeedback(button);
    } catch (err) {
        console.error('Fallback copy failed:', err);
    }

    document.body.removeChild(textarea);
}

/**
 * Show visual feedback after copying
 */
function showCopyFeedback(button) {
    const originalHTML = button.innerHTML;
    const checkIcon = IconLibrary ? IconLibrary.get('check', 16, true) : '✓';
    button.innerHTML = checkIcon;
    button.classList.add('copied');

    setTimeout(() => {
        button.innerHTML = originalHTML;
        button.classList.remove('copied');
    }, 2000);
}

/**
 * Update fee calculator
 */
function updateFeeCalculator() {
    const feeRate = parseInt(document.getElementById('fee-rate')?.value || 20);
    const txCount = parseInt(document.getElementById('tx-count')?.value || 10);
    const btcPrice = parseInt(document.getElementById('btc-price')?.value || 100000);

    // Update fee rate display
    const feeRateDisplay = document.getElementById('fee-rate-display');
    if (feeRateDisplay) {
        feeRateDisplay.textContent = `${feeRate} sat/vB`;
    }

    // Calculate fees for all formats
    const comparison = feeCalc.calculateComparison(feeRate, txCount, btcPrice);

    // Update Legacy
    updateFeeCard('legacy', comparison.legacy, btcPrice);

    // Update P2SH
    updateFeeCard('p2sh', comparison.p2sh, btcPrice);

    // Update SegWit
    updateFeeCard('segwit', comparison.segwit, btcPrice);

    // Update Taproot
    updateFeeCard('taproot', comparison.taproot, btcPrice);

    // Update total savings summary
    updateSavingsSummary(comparison, btcPrice);
}

/**
 * Update individual fee card
 */
function updateFeeCard(format, data, btcPrice) {
    const feeAmountEl = document.getElementById(`${format}-fee`);
    const feeSatsEl = document.getElementById(`${format}-sats`);

    if (feeAmountEl) {
        feeAmountEl.textContent = feeCalc.formatUSD(data.feeUSD);
    }

    if (feeSatsEl) {
        feeSatsEl.textContent = feeCalc.formatSats(data.feeSats) + ' sats';
    }

    // Update savings text
    const savingsEl = feeAmountEl?.parentElement?.querySelector('.savings');
    if (savingsEl && format !== 'legacy') {
        if (data.savingsUSD > 0) {
            savingsEl.textContent = `Save ${feeCalc.formatUSD(data.savingsUSD)}/year (${data.savingsPercent}%)`;
            savingsEl.classList.add('save');
        }
    }
}

/**
 * Update savings summary
 */
function updateSavingsSummary(comparison, btcPrice) {
    const totalSavingsEl = document.getElementById('total-savings');
    const decadeSavingsEl = document.getElementById('decade-savings');

    if (totalSavingsEl) {
        const yearSavings = comparison.taproot.savingsUSD;
        totalSavingsEl.textContent = feeCalc.formatUSD(yearSavings);
    }

    if (decadeSavingsEl) {
        const decadeSavings = comparison.taproot.savingsUSD * 10;
        decadeSavingsEl.textContent = feeCalc.formatUSD(decadeSavings);
    }
}

/**
 * Get address format recommendation
 */
function getRecommendation() {
    const walletSupport = document.querySelector('input[name="wallet-support"]:checked')?.value;
    const privacyImportant = document.getElementById('privacy-important')?.checked;
    const feeSavings = document.getElementById('fee-savings')?.checked;
    const multisig = document.getElementById('multisig')?.checked;

    if (!walletSupport) {
        alert('Please select your wallet type first!');
        return;
    }

    let recommendation = '';
    let format = '';

    // Decision logic
    if (walletSupport === 'modern') {
        if (multisig) {
            if (privacyImportant) {
                format = 'taproot';
                const checkIcon = IconLibrary ? IconLibrary.get('check', 16, true) : '✅';
                recommendation = `
                    <div class="format-badge taproot">Taproot (bc1p...)</div>
                    <p><strong>Best choice for your needs!</strong></p>
                    <p>Taproot provides:</p>
                    <ul style="text-align: left; margin: 1rem 0;">
                        <li>${checkIcon} Maximum privacy - multi-sig looks like single-sig</li>
                        <li>${checkIcon} Lowest fees (52% savings vs Legacy)</li>
                        <li>${checkIcon} Advanced multi-sig capabilities</li>
                        <li>${checkIcon} Future-proof technology</li>
                    </ul>
                    <p><strong>Wallets that support Taproot multi-sig:</strong> Sparrow Wallet, Bitcoin Core, Electrum (recent versions)</p>
                `;
            } else {
                format = 'segwit';
                const checkIcon = IconLibrary ? IconLibrary.get('check', 16, true) : '✅';
                recommendation = `
                    <div class="format-badge segwit">Native SegWit (bc1q...)</div>
                    <p><strong>Solid choice for multi-sig!</strong></p>
                    <p>Native SegWit provides:</p>
                    <ul style="text-align: left; margin: 1rem 0;">
                        <li>${checkIcon} Good fee savings (40% vs Legacy)</li>
                        <li>${checkIcon} Wide wallet support</li>
                        <li>${checkIcon} Proven multi-sig implementation</li>
                        <li>${checkIcon} Excellent balance of features</li>
                    </ul>
                    <p><em>Consider upgrading to Taproot for privacy!</em></p>
                `;
            }
        } else {
            if (feeSavings && privacyImportant) {
                format = 'taproot';
                const checkIcon = IconLibrary ? IconLibrary.get('check', 16, true) : '✅';
                recommendation = `
                    <div class="format-badge taproot">Taproot (bc1p...)</div>
                    <p><strong>Perfect match!</strong></p>
                    <p>Taproot offers:</p>
                    <ul style="text-align: left; margin: 1rem 0;">
                        <li>${checkIcon} Maximum fee savings (52% vs Legacy)</li>
                        <li>${checkIcon} Enhanced privacy</li>
                        <li>${checkIcon} Modern wallet standard</li>
                        <li>${checkIcon} Smallest transaction size</li>
                    </ul>
                    <p><strong>Recommended wallets:</strong> Sparrow, Bitcoin Core, BlueWallet, Electrum</p>
                `;
            } else if (feeSavings) {
                format = 'segwit';
                const checkIcon = IconLibrary ? IconLibrary.get('check', 16, true) : '✅';
                recommendation = `
                    <div class="format-badge segwit">Native SegWit (bc1q...)</div>
                    <p><strong>Best default choice!</strong></p>
                    <p>Native SegWit provides:</p>
                    <ul style="text-align: left; margin: 1rem 0;">
                        <li>${checkIcon} 40% fee savings vs Legacy</li>
                        <li>${checkIcon} Universal modern wallet support</li>
                        <li>${checkIcon} Proven and reliable</li>
                        <li>${checkIcon} Error-resistant addressing</li>
                    </ul>
                    <p>This is what most people should use!</p>
                `;
            } else {
                format = 'segwit';
                recommendation = `
                    <div class="format-badge segwit">Native SegWit (bc1q...)</div>
                    <p><strong>The standard choice!</strong></p>
                    <p>Native SegWit is the modern standard - good fee savings, wide compatibility, and proven reliability.</p>
                    <p><em>You can always upgrade to Taproot later!</em></p>
                `;
            }
        }
    } else {
        // Old wallet
        if (multisig) {
            format = 'p2sh';
            const checkIcon = IconLibrary ? IconLibrary.get('check', 16, true) : '✅';
            const alertIcon = IconLibrary ? IconLibrary.get('alert', 16, true) : '⚠️';
            recommendation = `
                <div class="format-badge p2sh">P2SH (3...)</div>
                <p><strong>Transitional choice</strong></p>
                <p>For older wallets, P2SH provides:</p>
                <ul style="text-align: left; margin: 1rem 0;">
                    <li>${checkIcon} Multi-sig support</li>
                    <li>${checkIcon} Some fee savings (26% vs Legacy)</li>
                    <li>${checkIcon} Wide compatibility</li>
                </ul>
                <p><strong>${alertIcon} Recommendation:</strong> Consider upgrading to a modern wallet to use SegWit or Taproot for better fees and privacy!</p>
            `;
        } else {
            format = 'legacy';
            const closeIcon = IconLibrary ? IconLibrary.get('close', 16, true) : '❌';
            const targetIcon = IconLibrary ? IconLibrary.get('target', 16, true) : '🎯';
            recommendation = `
                <div class="format-badge legacy">Legacy (1...)</div>
                <p><strong>Only for compatibility</strong></p>
                <p>Legacy addresses work everywhere, but:</p>
                <ul style="text-align: left; margin: 1rem 0;">
                    <li>${closeIcon} Highest transaction fees</li>
                    <li>${closeIcon} Largest transaction size</li>
                    <li>${closeIcon} Missing modern features</li>
                </ul>
                <p><strong>${targetIcon} Strong Recommendation:</strong> Upgrade to a modern wallet (2020+) to use Native SegWit or Taproot. You'll save significantly on fees!</p>
            `;
        }
    }

    // Display recommendation
    const recommendBox = document.getElementById('recommendation');
    const recommendResult = document.getElementById('recommendation-result');

    if (recommendBox && recommendResult) {
        recommendResult.innerHTML = recommendation;
        recommendBox.style.display = 'block';

        // Scroll to recommendation
        recommendBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

/**
 * Format numbers with commas
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Fetch current fee rate from mempool.space API
 */
async function fetchCurrentFeeRate() {
    const feeAPIs = [
        {
            name: 'Mempool.space',
            url: 'https://mempool.space/api/v1/fees/recommended',
            parse: (data) => parseInt(data?.halfHourFee || data?.hourFee || data?.fastestFee || 20, 10)
        },
        {
            name: 'Blockstream',
            url: 'https://blockstream.info/api/fee-estimates',
            parse: (data) => Math.round(parseFloat(data?.['3'] || data?.['6'] || 20))
        }
    ];

    for (const api of feeAPIs) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        try {
            const response = await fetch(api.url, {
                cache: 'no-store',
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                const fee = api.parse(data);

                if (!isNaN(fee) && fee > 0 && fee < 1000) { // Sanity check
                    currentFeeRate = fee;
                    console.log(`✓ Current fee rate from ${api.name}: ${fee} sat/vB`);

                    // Update the slider and display
                    const feeRateInput = document.getElementById('fee-rate');
                    const feeRateDisplay = document.getElementById('fee-rate-display');

                    if (feeRateInput) {
                        feeRateInput.value = fee;
                    }

                    if (feeRateDisplay) {
                        feeRateDisplay.textContent = `${fee} sat/vB (Live)`;
                        feeRateDisplay.style.color = '#4CAF50'; // Green to indicate live data
                    }

                    return fee;
                }
            }
        } catch (error) {
            clearTimeout(timeoutId);
            console.warn(`${api.name} fee fetch failed:`, error.message);
            continue;
        }
    }

    console.warn('All fee rate APIs failed, using fallback of 20 sat/vB');
    currentFeeRate = 20;
    return 20;
}
