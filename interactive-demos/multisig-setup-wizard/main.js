/**
 * MAIN CONTROLLER
 * Orchestrates multisig wizard flow
 */

let engine;
let planner;
let simulator;
let currentStep = 1;

document.addEventListener('DOMContentLoaded', init);

function init() {
    engine = new MultisigEngine();
    setupNavigation();
    setupStep1();
    setupStep2();
    setupStep3();
    setupStep4();
    setupStep5();
    setupStep6();
}

function setupNavigation() {
    document.querySelectorAll('.btn-next').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const next = parseInt(e.target.dataset.next);
            goToStep(next);
        });
    });

    document.querySelectorAll('.btn-back').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const prev = parseInt(e.target.dataset.prev);
            goToStep(prev);
        });
    });
}

function goToStep(stepNum) {
    document.querySelectorAll('.wizard-step').forEach(step => step.classList.remove('active'));
    document.getElementById(`step-${stepNum}`).classList.add('active');

    document.querySelectorAll('.step').forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index + 1 === stepNum) {
            step.classList.add('active');
        } else if (index + 1 < stepNum) {
            step.classList.add('completed');
        }
    });

    currentStep = stepNum;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setupStep1() {
    const scenarioBtns = document.querySelectorAll('.scenario-btn');
    scenarioBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            scenarioBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const scenario = e.target.dataset.scenario;
            renderScenarioVisual(scenario);
        });
    });

    renderScenarioVisual('single');
}

function renderScenarioVisual(scenario) {
    const visual = document.getElementById('sig-visual-1');
    const exp = document.getElementById('scenario-exp-1');

    const configs = {
        single: { m: 1, n: 1, desc: 'Click the key to sign. Only 1 signature needed.' },
        '2of3': { m: 2, n: 3, desc: 'Click any 2 keys to sign. Need 2 out of 3 signatures.' },
        '3of5': { m: 3, n: 5, desc: 'Click any 3 keys to sign. Need 3 out of 5 signatures.' }
    };

    const config = configs[scenario];
    let html = '<div class="key-buttons">';
    for (let i = 1; i <= config.n; i++) {
        html += `<button class="visual-key" data-key="${i}">🔑 Key ${i}</button>`;
    }
    html += '</div>';
    html += `<div class="sig-status">Signatures: <span id="sig-count">0</span>/${config.m}</div>`;

    visual.innerHTML = html;
    exp.innerHTML = `<p>${config.desc}</p>`;

    let sigCount = 0;
    document.querySelectorAll('.visual-key').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('signed')) return;
            if (sigCount >= config.m) return;

            btn.classList.add('signed');
            btn.textContent = '✅ ' + btn.textContent.replace('🔑 ', '');
            sigCount++;
            document.getElementById('sig-count').textContent = sigCount;

            if (sigCount >= config.m) {
                exp.innerHTML = `<p class="success">✅ Transaction can be broadcast! You collected ${config.m} signatures.</p>`;
            }
        });
    });
}

function setupStep2() {
    const recommendBtn = document.getElementById('get-config-recommendation');
    if (recommendBtn) {
        recommendBtn.addEventListener('click', () => {
            const threats = [];
            if (document.getElementById('threat-loss')?.checked) threats.push('loss');
            if (document.getElementById('threat-theft')?.checked) threats.push('theft');
            if (document.getElementById('threat-coercion')?.checked) threats.push('coercion');
            if (document.getElementById('threat-collusion')?.checked) threats.push('collusion');

            const amount = document.querySelector('input[name="amount"]:checked')?.value || 'small';

            const recommendation = engine.getRecommendedConfig(threats, amount);

            const resultEl = document.getElementById('threat-recommendation');
            resultEl.innerHTML = `
                <h4>Recommended Configuration</h4>
                <div class="config-badge">${recommendation.m}-of-${recommendation.n}</div>
                <p><strong>Reason:</strong> ${recommendation.reason}</p>
                <p>This configuration provides protection against the threats you selected.</p>
            `;
            resultEl.style.display = 'block';

            engine.setConfig(recommendation.m, recommendation.n);
        });
    }
}

function setupStep3() {
    document.querySelectorAll('.btn-select-config').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.config-card');
            const config = card.dataset.config;

            document.querySelectorAll('.config-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');

            if (config === 'custom') {
                const m = parseInt(document.getElementById('custom-m').value);
                const n = parseInt(document.getElementById('custom-n').value);
                engine.setConfig(m, n);
            } else {
                const [m, n] = config.split('-of-').map(Number);
                engine.setConfig(m, n);
            }

            showConfigSummary();
        });
    });

    const customM = document.getElementById('custom-m');
    const customN = document.getElementById('custom-n');
    [customM, customN].forEach(input => {
        if (input) {
            input.addEventListener('input', () => {
                const m = parseInt(customM.value);
                const n = parseInt(customN.value);
                document.getElementById('custom-formula').textContent = `${m}-of-${n}`;
            });
        }
    });
}

function showConfigSummary() {
    const summary = engine.getSummary();
    const summaryEl = document.getElementById('config-summary');
    const contentEl = document.getElementById('config-summary-content');

    contentEl.innerHTML = `
        <div class="summary-badge">${summary.config}</div>
        <p><strong>Redundancy:</strong> Can lose ${summary.canLoseKeys} key(s) and still access Bitcoin</p>
        <p><strong>Theft Protection:</strong> Attacker needs ${summary.m} keys (you have ${summary.n})</p>
        <p><strong>Security Score:</strong> ${summary.securityScore}/100</p>
    `;

    summaryEl.style.display = 'block';
}

function setupStep4() {
    setTimeout(() => {
        if (!planner) {
            const keyCount = engine.config.n || 3;
            planner = new DistributionPlanner(document.querySelector('.planner-interface'), keyCount);

            document.getElementById('key-count').textContent = keyCount;
        }
    }, 500);
}

function setupStep5() {
    const configSpan = document.getElementById('practice-config');
    if (configSpan) {
        configSpan.textContent = `${engine.config.m}-of-${engine.config.n}`;
    }

    const createTxBtn = document.getElementById('create-tx');
    if (createTxBtn) {
        createTxBtn.addEventListener('click', () => {
            simulator = new SignatureSimulator(engine.config.m, engine.config.n);
            updateProcessStep(1, 'completed');
            updateProcessStep(2, 'active');
            renderKeySelection(1);
            renderSigSlots();
        });
    }
}

function updateProcessStep(stepNum, status) {
    const steps = document.querySelectorAll('.process-step');
    if (steps[stepNum - 1]) {
        steps[stepNum - 1].dataset.status = status;
        const badge = steps[stepNum - 1].querySelector('.status-badge');
        if (badge) {
            badge.textContent = status === 'completed' ? 'Completed' :
                               status === 'active' ? 'Active' : 'Pending';
        }
    }
}

function renderKeySelection(sigNum) {
    const container = document.getElementById(`key-select-${sigNum}`);
    if (!container) return;

    let html = '<p>Select a key to sign with:</p><div class="key-buttons">';
    simulator.keys.forEach(key => {
        const disabled = key.signed ? 'disabled' : '';
        html += `<button class="key-select-btn" data-key="${key.id}" ${disabled}>Key ${key.id} ${key.signed ? '(Used)' : ''}</button>`;
    });
    html += '</div>';

    container.innerHTML = html;

    container.querySelectorAll('.key-select-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const keyId = parseInt(btn.dataset.key);
            const result = simulator.addSignature(keyId);

            if (result.success) {
                btn.disabled = true;
                btn.textContent += ' ✅';
                updateSigProgress();

                if (!result.complete) {
                    updateProcessStep(sigNum + 1, 'completed');
                    updateProcessStep(sigNum + 2, 'active');
                    renderKeySelection(sigNum + 1);
                } else {
                    updateProcessStep(sigNum + 1, 'completed');
                    updateProcessStep(4, 'active');
                    enableBroadcast();
                }
            }
        });
    });
}

function renderSigSlots() {
    const slotsContainer = document.getElementById('sig-slots');
    const requiredSpan = document.getElementById('sigs-required');

    if (slotsContainer) {
        slotsContainer.innerHTML = '';
        for (let i = 0; i < simulator.m; i++) {
            const slot = document.createElement('div');
            slot.className = 'sig-slot';
            slot.textContent = '🔓';
            slot.id = `sig-slot-${i}`;
            slotsContainer.appendChild(slot);
        }
    }

    if (requiredSpan) {
        requiredSpan.textContent = simulator.m;
    }
}

function updateSigProgress() {
    const progress = simulator.getProgress();
    const fill = document.getElementById('progress-fill');
    const collected = document.getElementById('sigs-collected');

    if (fill) fill.style.width = progress.percentage + '%';
    if (collected) collected.textContent = progress.current;

    for (let i = 0; i < progress.current; i++) {
        const slot = document.getElementById(`sig-slot-${i}`);
        if (slot) {
            slot.classList.add('signed');
            slot.textContent = '🔒';
        }
    }
}

function enableBroadcast() {
    const broadcastBtn = document.getElementById('broadcast-tx');
    if (broadcastBtn) {
        broadcastBtn.disabled = false;
        broadcastBtn.addEventListener('click', () => {
            const resultEl = document.getElementById('tx-result');
            const txidEl = document.getElementById('txid');
            const sigsUsedEl = document.getElementById('sigs-used');

            if (txidEl) txidEl.textContent = generateFakeTxid();
            if (sigsUsedEl) sigsUsedEl.textContent = simulator.signatures.map(id => `Key ${id}`).join(', ');

            if (resultEl) resultEl.style.display = 'block';
        });
    }
}

function generateFakeTxid() {
    return Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
}

function setupStep6() {
    const restartBtn = document.getElementById('restart-wizard');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            location.reload();
        });
    }

    const exportBtn = document.getElementById('export-plan');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            alert('PDF export feature coming soon! For now, take screenshots of your plan.');
        });
    }

    setTimeout(() => {
        const recap = document.getElementById('setup-recap');
        if (recap) {
            const summary = engine.getSummary();
            recap.innerHTML = `
                <p><strong>Configuration:</strong> ${summary.config}</p>
                <p><strong>Security Score:</strong> ${summary.securityScore}/100</p>
                <p><strong>Keys to Lose:</strong> Up to ${summary.canLoseKeys}</p>
                <p><strong>Theft Protection:</strong> ${summary.protectedFrom} key(s) can be compromised</p>
            `;
        }
    }, 500);
}
