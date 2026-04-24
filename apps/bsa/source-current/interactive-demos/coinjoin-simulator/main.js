/**
 * MAIN CONTROLLER
 */

let engine;
let currentStep = 1;

document.addEventListener('DOMContentLoaded', init);

function init() {
    setupNavigation();
    setupSimulator();
}

function setupNavigation() {
    document.querySelectorAll('.btn-next').forEach(btn => {
        btn.addEventListener('click', (e) => {
            goToStep(parseInt(e.target.dataset.next));
        });
    });

    document.querySelectorAll('.btn-back').forEach(btn => {
        btn.addEventListener('click', (e) => {
            goToStep(parseInt(e.target.dataset.prev));
        });
    });
}

function goToStep(step) {
    document.querySelectorAll('.demo-step').forEach(s => s.classList.remove('active'));
    document.getElementById(`step-${step}`).classList.add('active');

    document.querySelectorAll('.step').forEach((s, i) => {
        s.classList.remove('active', 'completed');
        if (i + 1 === step) s.classList.add('active');
        else if (i + 1 < step) s.classList.add('completed');
    });

    currentStep = step;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setupSimulator() {
    const startBtn = document.getElementById('start-coinjoin');
    const participantSlider = document.getElementById('participant-count');
    const participantDisplay = document.getElementById('participant-display');
    const nextPhaseBtn = document.getElementById('next-phase');
    const restartBtn = document.getElementById('restart-demo');

    if (participantSlider && participantDisplay) {
        participantSlider.addEventListener('input', (e) => {
            participantDisplay.textContent = e.target.value;
        });
    }

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            const count = parseInt(document.getElementById('participant-count').value);
            const amount = parseFloat(document.getElementById('mix-amount').value);
            engine = new CoinJoinEngine(count, amount);

            document.getElementById('coinjoin-viz').style.display = 'block';
            renderPhase1();
        });
    }

    if (nextPhaseBtn) {
        nextPhaseBtn.addEventListener('click', () => {
            const phase = engine.nextPhase();
            if (phase === 2) renderPhase2();
            else if (phase === 3) renderPhase3();
            else if (phase === 4) renderPhase4();
        });
    }

    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            location.reload();
        });
    }
}

function renderPhase1() {
    const container = document.getElementById('participants');
    container.innerHTML = '';

    engine.participants.forEach(p => {
        const div = document.createElement('div');
        div.className = 'participant';
        div.textContent = `${p.name}: ${p.amount} BTC`;
        container.appendChild(div);
    });

    document.querySelector('[data-phase="1"]').style.display = 'block';
}

function renderPhase2() {
    document.querySelector('[data-phase="1"]').style.display = 'none';
    document.querySelector('[data-phase="2"]').style.display = 'block';

    const inputsContainer = document.getElementById('tx-inputs');
    const outputsContainer = document.getElementById('tx-outputs');

    inputsContainer.innerHTML = '';
    outputsContainer.innerHTML = '';

    engine.participants.forEach(p => {
        const input = document.createElement('div');
        input.className = 'tx-input';
        input.textContent = `${p.name}: ${p.amount} BTC`;
        inputsContainer.appendChild(input);

        const output = document.createElement('div');
        output.className = 'tx-output';
        output.textContent = `Unknown: ${p.amount} BTC`;
        outputsContainer.appendChild(output);
    });
}

function renderPhase3() {
    document.querySelector('[data-phase="2"]').style.display = 'none';
    document.querySelector('[data-phase="3"]').style.display = 'block';

    const container = document.getElementById('signing-status');
    container.innerHTML = '<p>All participants signing...</p>';

    setTimeout(() => {
        engine.signAll();
        container.innerHTML = '<p class="success">✅ All signatures collected!</p>';
    }, 1000);
}

function renderPhase4() {
    document.querySelector('[data-phase="3"]').style.display = 'none';
    document.querySelector('[data-phase="4"]').style.display = 'block';

    document.getElementById('anon-set').textContent = engine.getAnonymitySet();
    document.getElementById('anon-set-2').textContent = engine.getAnonymitySet();
    document.getElementById('analysis-prob').textContent = engine.getAnalysisProbability() + '%';

    document.getElementById('next-phase').style.display = 'none';
}
