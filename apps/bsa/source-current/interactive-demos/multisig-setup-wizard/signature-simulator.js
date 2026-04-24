/**
 * SIGNATURE SIMULATOR
 * Simulates multisig transaction signing process
 */

class SignatureSimulator {
    constructor(m, n) {
        this.m = m;
        this.n = n;
        this.signatures = [];
        this.keys = [];
        this.generateKeys();
    }

    generateKeys() {
        for (let i = 1; i <= this.n; i++) {
            this.keys.push({
                id: i,
                name: `Key ${i}`,
                signed: false
            });
        }
    }

    addSignature(keyId) {
        if (this.signatures.length >= this.m) {
            return { success: false, message: 'Already have enough signatures' };
        }

        if (this.signatures.includes(keyId)) {
            return { success: false, message: 'Key already used' };
        }

        this.signatures.push(keyId);
        const key = this.keys.find(k => k.id === keyId);
        if (key) key.signed = true;

        return {
            success: true,
            complete: this.signatures.length >= this.m,
            progress: this.signatures.length,
            required: this.m
        };
    }

    canBroadcast() {
        return this.signatures.length >= this.m;
    }

    reset() {
        this.signatures = [];
        this.keys.forEach(k => k.signed = false);
    }

    getProgress() {
        return {
            current: this.signatures.length,
            required: this.m,
            total: this.n,
            percentage: (this.signatures.length / this.m) * 100
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SignatureSimulator;
}
