/**
 * Data Analysis Utilities ported from Python for client-side execution.
 * Minimizes backend dependency and Vercel build size.
 */

import * as math from 'mathjs';

/**
 * Ported Multivariate Anomaly Detection logic.
 * Uses a simplified Isolation Forest-inspired approach.
 */
export const detectMultivariateAnomalies = (data, contamination = 0.05) => {
    if (!data || data.length === 0) return [];

    const keys = Object.keys(data[0]).filter(k => !isNaN(parseFloat(data[0][k])));
    if (keys.length === 0) return [];

    // Extract numeric matrix
    const matrix = data.map(row => keys.map(k => parseFloat(row[k]) || 0));

    // Calculate mean and std for each column for normalization
    const stats = keys.map((k, i) => {
        const values = matrix.map(row => row[i]);
        const mean = math.mean(values);
        const std = math.std(values);
        return { mean, std };
    });

    // Normalize and calculate "Outlier Score" based on distance from mean
    const scores = matrix.map(row => {
        let dist = 0;
        row.forEach((val, i) => {
            const z = (val - stats[i].mean) / (stats[i].std || 1);
            dist += z * z;
        });
        return Math.sqrt(dist);
    });

    // Determine threshold based on contamination
    const sortedScores = [...scores].sort((a, b) => b - a);
    const thresholdIdx = Math.floor(scores.length * contamination);
    const threshold = sortedScores[thresholdIdx];

    return scores.map((score, idx) => ({ score, idx }))
        .filter(s => s.score >= threshold)
        .map(s => ({
            row: s.idx,
            data: data[s.idx],
            score: s.score.toFixed(2)
        }));
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
            const mean = math.mean(numericValues);
            const std = math.std(numericValues);
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
 * Preserves distributions via sampling.
 */
export const generateSyntheticData = (data, numRows = 100) => {
    if (!data || data.length === 0) return [];

    const keys = Object.keys(data[0]);
    const synthetic = [];

    for (let i = 0; i < numRows; i++) {
        const mockRow = {};
        keys.forEach(col => {
            const vals = data.map(r => r[col]).filter(v => v !== undefined);
            mockRow[col] = vals[Math.floor(Math.random() * vals.length)];
        });
        synthetic.push(mockRow);
    }

    return synthetic;
};
