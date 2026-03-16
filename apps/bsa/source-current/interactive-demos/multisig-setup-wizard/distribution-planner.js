/**
 * DISTRIBUTION PLANNER
 * Drag-and-drop key distribution interface
 */

class DistributionPlanner {
    constructor(containerEl, keyCount) {
        this.container = containerEl;
        this.keyCount = keyCount;
        this.distribution = {};
        this.init();
    }

    init() {
        this.createKeys();
        this.setupDropZones();
    }

    createKeys() {
        const keyPool = document.getElementById('key-pool');
        if (!keyPool) return;

        keyPool.innerHTML = '';
        for (let i = 1; i <= this.keyCount; i++) {
            const key = document.createElement('div');
            key.className = 'draggable-key';
            key.textContent = `Key ${i}`;
            key.draggable = true;
            key.dataset.keyId = `key-${i}`;

            key.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', e.target.dataset.keyId);
                e.target.style.opacity = '0.5';
            });

            key.addEventListener('dragend', (e) => {
                e.target.style.opacity = '1';
            });

            keyPool.appendChild(key);
        }
    }

    setupDropZones() {
        const dropZones = document.querySelectorAll('.drop-zone');

        dropZones.forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.classList.add('drag-over');
            });

            zone.addEventListener('dragleave', () => {
                zone.classList.remove('drag-over');
            });

            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('drag-over');

                const keyId = e.dataTransfer.getData('text/plain');
                const location = zone.dataset.zone;

                this.placeKey(keyId, location, zone);
            });
        });
    }

    placeKey(keyId, location, zoneEl) {
        // Remove key from previous location
        Object.keys(this.distribution).forEach(loc => {
            this.distribution[loc] = (this.distribution[loc] || []).filter(k => k !== keyId);
        });

        // Add to new location
        if (!this.distribution[location]) {
            this.distribution[location] = [];
        }
        this.distribution[location].push(keyId);

        // Update UI
        zoneEl.innerHTML = `<div class="placed-key">${keyId.replace('-', ' ').toUpperCase()}</div>`;
        zoneEl.classList.add('has-key');

        // Provide feedback
        this.updateFeedback();
    }

    updateFeedback() {
        const feedbackEl = document.getElementById('distribution-feedback');
        if (!feedbackEl) return;

        const distributedCount = Object.values(this.distribution).flat().length;
        const locations = Object.keys(this.distribution).length;

        let feedback = '';

        if (distributedCount === 0) {
            feedback = '<p>👆 Drag keys from the left to location slots to plan your distribution.</p>';
        } else if (distributedCount < this.keyCount) {
            feedback = `<p>✅ ${distributedCount} of ${this.keyCount} keys placed. <strong>${this.keyCount - distributedCount} remaining.</strong></p>`;
        } else {
            feedback = `<div class="success-feedback">
                <p>✅ All ${this.keyCount} keys distributed!</p>
                <p>📍 Using ${locations} different locations</p>
            `;

            if (locations >= 3) {
                feedback += '<p>✅ Good geographic diversity!</p>';
            } else if (locations === 2) {
                feedback += '<p>⚠️ Consider adding a third location for better redundancy.</p>';
            } else {
                feedback += '<p>❌ All keys in one location is risky! Distribute across multiple locations.</p>';
            }

            feedback += '</div>';
        }

        feedbackEl.innerHTML = feedback;
    }

    getDistribution() {
        return this.distribution;
    }

    reset() {
        this.distribution = {};
        this.init();
        this.updateFeedback();
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = DistributionPlanner;
}
