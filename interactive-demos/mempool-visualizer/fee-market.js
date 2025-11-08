/**
 * FEE MARKET VISUALIZATION
 * Interactive fee histogram and transaction estimator
 */

class FeeMarketVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.simulation = null;
    }

    /**
     * Set the mempool simulation instance
     */
    setSimulation(simulation) {
        this.simulation = simulation;
    }

    /**
     * Draw fee distribution histogram
     */
    drawHistogram() {
        if (!this.ctx || !this.simulation) return;

        const ctx = this.ctx;
        const canvas = this.canvas;
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Get fee distribution
        const distribution = this.simulation.getFeeDistribution();
        const maxCount = Math.max(...distribution.map(bin => bin.count), 1);

        // Calculate bar dimensions
        const barWidth = width / distribution.length;
        const padding = 10;
        const chartHeight = height - 60;

        // Draw bars
        distribution.forEach((bin, index) => {
            const barHeight = (bin.count / maxCount) * chartHeight;
            const x = index * barWidth + padding;
            const y = height - barHeight - 40;

            // Gradient fill
            const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);

            // Color based on fee range
            if (bin.max <= 10) {
                gradient.addColorStop(0, '#66bb6a');
                gradient.addColorStop(1, '#4caf50');
            } else if (bin.max <= 50) {
                gradient.addColorStop(0, '#ffb74d');
                gradient.addColorStop(1, '#ff9800');
            } else {
                gradient.addColorStop(0, '#ff6b6b');
                gradient.addColorStop(1, '#f44336');
            }

            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, barWidth - padding * 2, barHeight);

            // Draw count on bar
            if (bin.count > 0) {
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 14px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(bin.count, x + (barWidth - padding * 2) / 2, y - 5);
            }

            // Draw label
            ctx.fillStyle = '#a0a0a0';
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(bin.label + ' sat/vB', x + (barWidth - padding * 2) / 2, height - 20);
        });

        // Draw title
        ctx.fillStyle = '#e0e0e0';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Transactions by Fee Rate', padding, 20);

        // Draw y-axis label
        ctx.save();
        ctx.translate(15, height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#a0a0a0';
        ctx.fillText('Transaction Count', 0, 0);
        ctx.restore();
    }

    /**
     * Draw position indicator
     */
    drawPositionIndicator(canvasId, feeRate, txSize) {
        const canvas = document.getElementById(canvasId);
        if (!canvas || !this.simulation) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        const estimation = this.simulation.estimateConfirmation(feeRate, txSize);

        // Draw mempool bar
        const barHeight = 40;
        const barY = (height - barHeight) / 2;

        // Background bar
        ctx.fillStyle = '#3a3a3a';
        ctx.fillRect(0, barY, width, barHeight);

        // Position indicator
        const position = Math.max(0, Math.min(100, parseFloat(estimation.percentile)));
        const indicatorX = (position / 100) * width;

        // Gradient fill for position
        const gradient = ctx.createLinearGradient(0, barY, width, barY);
        gradient.addColorStop(0, '#f44336');
        gradient.addColorStop(0.5, '#ff9800');
        gradient.addColorStop(1, '#4caf50');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, barY, indicatorX, barHeight);

        // Draw position marker
        ctx.fillStyle = '#f7931a';
        ctx.beginPath();
        ctx.moveTo(indicatorX, barY - 10);
        ctx.lineTo(indicatorX + 8, barY);
        ctx.lineTo(indicatorX - 8, barY);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(indicatorX, barY + barHeight + 10);
        ctx.lineTo(indicatorX + 8, barY + barHeight);
        ctx.lineTo(indicatorX - 8, barY + barHeight);
        ctx.closePath();
        ctx.fill();

        // Draw labels
        ctx.fillStyle = '#e0e0e0';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Lowest Fees', 10, barY + barHeight / 2 + 5);

        ctx.textAlign = 'right';
        ctx.fillText('Highest Fees', width - 10, barY + barHeight / 2 + 5);

        // Draw percentile label
        ctx.fillStyle = '#f7931a';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${position}th percentile`, indicatorX, barY - 15);
    }

    /**
     * Update fee recommendations display
     */
    updateRecommendations() {
        if (!this.simulation) return;

        const fees = this.simulation.getRecommendedFees();

        const nextBlockEl = document.getElementById('fee-next-block');
        const sixBlocksEl = document.getElementById('fee-6-blocks');
        const twentyFourHoursEl = document.getElementById('fee-24h');

        if (nextBlockEl) nextBlockEl.textContent = `${fees.nextBlock} sat/vB`;
        if (sixBlocksEl) sixBlocksEl.textContent = `${fees.within6Blocks} sat/vB`;
        if (twentyFourHoursEl) twentyFourHoursEl.textContent = `${fees.within24Hours} sat/vB`;
    }

    /**
     * Update transaction estimation
     */
    updateEstimation(feeRate, txSize) {
        if (!this.simulation) return;

        const totalFee = feeRate * txSize;
        const estimation = this.simulation.estimateConfirmation(feeRate, txSize);

        // Update total fee
        const totalFeeEl = document.getElementById('total-fee');
        if (totalFeeEl) {
            totalFeeEl.textContent = `${MempoolSimulation.formatNumber(totalFee)} sats`;
        }

        // Update estimated time
        const estimatedTimeEl = document.getElementById('estimated-time');
        if (estimatedTimeEl) {
            const blocks = estimation.blocksUntilConfirmation;
            const minutes = estimation.minutesEstimate;

            if (minutes < 60) {
                estimatedTimeEl.textContent = `~${minutes} minutes (${blocks} ${blocks === 1 ? 'block' : 'blocks'})`;
            } else {
                const hours = (minutes / 60).toFixed(1);
                estimatedTimeEl.textContent = `~${hours} hours (${blocks} blocks)`;
            }
        }

        // Update priority level
        const priorityEl = document.getElementById('priority-level');
        if (priorityEl) {
            let priority, priorityClass;

            if (feeRate >= 50) {
                priority = 'High';
                priorityClass = 'high';
            } else if (feeRate >= 10) {
                priority = 'Medium';
                priorityClass = 'medium';
            } else {
                priority = 'Low';
                priorityClass = 'low';
            }

            priorityEl.textContent = priority;
            priorityEl.className = `value priority ${priorityClass}`;
        }

        // Update position text
        const positionTextEl = document.getElementById('position-text');
        if (positionTextEl) {
            const percentile = estimation.percentile;
            let description;

            if (percentile >= 75) {
                description = 'top 25%';
            } else if (percentile >= 50) {
                description = 'top 50%';
            } else if (percentile >= 25) {
                description = 'bottom 50%';
            } else {
                description = 'bottom 25%';
            }

            positionTextEl.innerHTML = `Your transaction is in the <strong>${description}</strong> of the mempool`;
        }

        // Update position indicator
        this.drawPositionIndicator('position-indicator', feeRate, txSize);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FeeMarketVisualizer;
}
