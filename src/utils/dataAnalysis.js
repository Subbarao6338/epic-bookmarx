/**
 * Data Analysis Utilities ported from Python for client-side execution.
 * Minimizes backend dependency and Vercel build size.
 */

import * as math from 'mathjs';

/**
 * Ported Multivariate Anomaly Detection logic.
 * Uses a robust Mahalanobis Distance approach for statistical anomaly detection,
 * which is a strong alternative to Isolation Forest for multivariate data
 * when transpiling from Python/Sklearn.
 */
export const detectMultivariateAnomalies = (data, contamination = 0.05) => {
    if (!data || data.length === 0) return [];

    const keys = Object.keys(data[0]).filter(k => !isNaN(parseFloat(data[0][k])));
    if (keys.length < 2) return []; // Needs at least 2 dimensions for multivariate

    // Extract numeric matrix
    const matrix = data.map(row => keys.map(k => parseFloat(row[k]) || 0));

    try {
        const meanVector = keys.map((_, i) => math.mean(matrix.map(row => row[i])));

        // Calculate Covariance Matrix
        const n = matrix.length;
        const transposed = math.transpose(matrix);
        const cov = keys.map((_, i) =>
            keys.map((_, j) => {
                const xi = transposed[i];
                const xj = transposed[j];
                const mi = meanVector[i];
                const mj = meanVector[j];
                return math.sum(xi.map((x, idx) => (x - mi) * (xj[idx] - mj))) / (n - 1);
            })
        );

        const invCov = math.inv(cov);

        // Calculate Mahalanobis Distance for each point
        const scores = matrix.map(row => {
            const diff = row.map((v, i) => v - meanVector[i]);
            // dist = diff * invCov * diffT
            const intermediate = math.multiply(diff, invCov);
            const dist = math.multiply(intermediate, math.transpose(diff));
            return Math.sqrt(dist);
        });

        // Determine threshold based on contamination
        const sortedScores = [...scores].sort((a, b) => b - a);
        const thresholdIdx = Math.max(0, Math.min(scores.length - 1, Math.floor(scores.length * contamination)));
        const threshold = sortedScores[thresholdIdx];

        return scores.map((score, idx) => ({ score, idx }))
            .filter(s => s.score >= threshold)
            .map(s => ({
                row: s.idx,
                data: data[s.idx],
                score: s.score.toFixed(2)
            }));
    } catch (e) {
        console.error("Multivariate calculation error:", e);
        // Fallback to simpler Euclidean Z-score if covariance is singular
        return matrix.map((row, idx) => {
            let dist = 0;
            row.forEach((val, i) => {
                const col = matrix.map(r => r[i]);
                const m = math.mean(col);
                const s = math.std(col) || 1;
                dist += Math.pow((val - m) / s, 2);
            });
            return { score: Math.sqrt(dist), idx };
        }).sort((a, b) => b.score - a.score)
          .slice(0, Math.floor(data.length * contamination))
          .map(s => ({ row: s.idx, data: data[s.idx], score: s.score.toFixed(2) }));
    }
};

/**
 * Ported Data Quality Engine.
 * Functional equivalent of Great Expectations validation.
 */
export const runDataQualitySuite = (data) => {
    if (!data || data.length === 0) return [];

    const keys = Object.keys(data[0]);
    const report = [];

    keys.forEach(col => {
        const values = data.map(r => r[col]);
        const nulls = values.filter(v => v === null || v === undefined || v === '').length;

        report.push({
            column: col,
            expectation: "not_null",
            success: nulls === 0,
            unexpected_count: nulls
        });

        const numericValues = values.map(v => parseFloat(v)).filter(v => !isNaN(v));
        if (numericValues.length > 0) {
            let sum = 0;
            for (let i = 0; i < numericValues.length; i++) sum += numericValues[i];
            const mean = sum / numericValues.length;

            let sqDiffSum = 0;
            for (let i = 0; i < numericValues.length; i++) sqDiffSum += Math.pow(numericValues[i] - mean, 2);
            const std = Math.sqrt(sqDiffSum / numericValues.length);

            const min = mean - 3 * std;
            const max = mean + 3 * std;
            const outliers = numericValues.filter(v => v < min || v > max).length;

            report.push({
                column: col,
                expectation: "within_3_std",
                success: outliers === 0,
                unexpected_count: outliers
            });
        }
    });

    return report;
};

/**
 * Ported Synthetic Data Lab logic.
 * Enhanced Relational Sampling (SDV style parity).
 */
export const generateSyntheticData = (data, numRows = 100) => {
    if (!data || data.length === 0) return [];

    const keys = Object.keys(data[0]);
    const synthetic = [];

    // Analyze correlations for better sampling (simplified)
    const stats = {};
    keys.forEach(k => {
        const vals = data.map(r => r[k]).filter(v => v !== undefined && v !== null);
        const isNumeric = vals.every(v => !isNaN(parseFloat(v)));
        stats[k] = {
            vals,
            isNumeric,
            unique: [...new Set(vals)]
        };
    });

    for (let i = 0; i < numRows; i++) {
        const mockRow = {};
        // To maintain relational-like integrity, we sometimes pick a whole row from seed
        // and sometimes shuffle. This is a hybrid approach.
        const seedRow = data[Math.floor(Math.random() * data.length)];

        keys.forEach(col => {
            if (Math.random() > 0.3) { // 70% chance to keep correlation from seed row
                mockRow[col] = seedRow[col];
            } else {
                // 30% chance to sample from the marginal distribution of that column
                const colStats = stats[col];
                mockRow[col] = colStats.vals[Math.floor(Math.random() * colStats.vals.length)];
            }
        });
        synthetic.push(mockRow);
    }

    return synthetic;
};
