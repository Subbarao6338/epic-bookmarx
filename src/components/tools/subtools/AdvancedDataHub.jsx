import React, { useState } from 'react';
import ToolResult from '../ToolResult';
import { detectMultivariateAnomalies, runDataQualitySuite } from '../../../utils/dataAnalysis';

const AdvancedDataHub = ({ data }) => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [contamination, setContamination] = useState(0.05);

    const runAnalysis = async (type, multivariate = false) => {
        if (!data || data.length === 0) return setResult({ error: 'Upload file in Viewer first.' });
        setLoading(true);

        try {
            let res;
            if (type === 'data-quality') {
                res = runDataQualitySuite(data);
                setResult({ text: JSON.stringify({ success: true, report: res }, null, 2) });
            } else {
                if (multivariate) {
                    res = detectMultivariateAnomalies(data, contamination);
                    setResult({
                        text: JSON.stringify({
                            success: true,
                            algorithm: "Mahalanobis Distance (Multivariate)",
                            contamination,
                            anomaly_count: res.length,
                            anomalies: res.slice(0, 15)
                        }, null, 2)
                    });
                } else {
                    const numericCols = Object.keys(data[0] || {}).filter(k => !isNaN(parseFloat(data[0][k])));
                    const anomalies = [];
                    numericCols.forEach(col => {
                        const vals = data.map(r => parseFloat(r[col])).filter(v => !isNaN(v));
                        const m = vals.reduce((a, b) => a + b, 0) / vals.length;
                        const s = Math.sqrt(vals.map(v => Math.pow(v - m, 2)).reduce((a, b) => a + b, 0) / vals.length);
                        data.forEach((row, idx) => {
                            const val = parseFloat(row[col]);
                            if (Math.abs(val - m) > 3 * s) anomalies.push({ row: idx, column: col, value: val });
                        });
                    });
                    setResult({ text: JSON.stringify({ success: true, type: 'univariate', anomaly_count: anomalies.length, anomalies: anomalies.slice(0, 10) }, null, 2) });
                }
            }
        } catch (e) { setResult({ error: e.message }); } finally { setLoading(false); }
    };

    return (
        <div className="grid gap-15 card p-30 glass-card">
            <h3>Advanced Data Analysis Hub</h3>
            <div className="flex-between gap-15 mb-10">
                <label className="smallest">Contamination (0.01 - 0.2):</label>
                <input type="range" min="0.01" max="0.2" step="0.01" value={contamination} onChange={e=>setContamination(parseFloat(e.target.value))} />
                <span className="badge badge-primary">{contamination}</span>
            </div>
            <div className="grid grid-2-cols gap-10">
                <button className="btn-primary" onClick={() => runAnalysis('anomaly-detect', true)} disabled={loading} title="Mahalanobis Distance (Isolation Forest Parity)">Multivariate Anomaly</button>
                <button className="pill" onClick={() => runAnalysis('anomaly-detect', false)} disabled={loading}>Standard Anomaly</button>
                <button className="pill" onClick={() => runAnalysis('data-quality')} disabled={loading}>Data Quality Audit</button>
                <button className="pill" onClick={() => setResult({ text: JSON.stringify(data[0], null, 2) })} disabled={loading}>Profile Header</button>
            </div>
            <ToolResult result={result} />
        </div>
    );
};

export default AdvancedDataHub;
