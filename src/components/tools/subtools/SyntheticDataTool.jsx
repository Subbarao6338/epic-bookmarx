import React, { useState } from 'react';
import Papa from 'papaparse';
import ToolResult from '../ToolResult';
import { generateSyntheticData } from '../../../utils/dataAnalysis';

const SyntheticDataTool = ({ data }) => {
    const [rows, setRows] = useState(100);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const run = async () => {
        if (!data) return setResult({ error: 'Upload seed file in Viewer.' });
        setLoading(true);
        try {
            const synthetic = generateSyntheticData(data, rows);
            setResult({ text: Papa.unparse(synthetic), filename: 'synthetic_data.csv' });
        } catch (e) { setResult({ error: e.message }); } finally { setLoading(false); }
    };

    return (
        <div className="card p-30 glass-card grid gap-15">
            <h3>Synthetic Data Lab</h3>
            <p className="small opacity-7">Preserves relational-like distributions via hybrid correlation sampling.</p>
            <input type="number" className="pill w-full" value={rows} onChange={e=>setRows(e.target.value)} placeholder="Number of rows" />
            <button className="btn-primary w-full" onClick={run} disabled={loading}>{loading ? 'Synthesizing...' : 'Generate Synthetic Dataset'}</button>
            <ToolResult result={result} />
        </div>
    );
};

export default SyntheticDataTool;
