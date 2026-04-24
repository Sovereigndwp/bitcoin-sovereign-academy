/**
 * COINJOIN ENGINE
 * Simulates CoinJoin privacy mixing
 */

class CoinJoinEngine {
    constructor(participantCount, amount) {
        this.participantCount = participantCount;
        this.amount = amount;
        this.participants = [];
        this.currentPhase = 0;
        this.generateParticipants();
    }

    generateParticipants() {
        const names = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve', 'Frank', 'Grace', 'Hank', 'Ivy', 'Jack'];
        for (let i = 0; i < this.participantCount; i++) {
            this.participants.push({
                id: i + 1,
                name: names[i] || `User ${i + 1}`,
                inputAddress: this.generateAddress('input'),
                outputAddress: this.generateAddress('output'),
                amount: this.amount,
                signed: false
            });
        }
    }

    generateAddress(type) {
        const prefix = 'bc1q';
        const chars = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
        let addr = prefix;
        for (let i = 0; i < 38; i++) {
            addr += chars[Math.floor(Math.random() * chars.length)];
        }
        return addr;
    }

    getAnonymitySet() {
        return this.participantCount;
    }

    getAnalysisProbability() {
        return (100 / this.participantCount).toFixed(1);
    }

    nextPhase() {
        this.currentPhase++;
        return this.currentPhase;
    }

    signAll() {
        this.participants.forEach(p => p.signed = true);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CoinJoinEngine;
}
