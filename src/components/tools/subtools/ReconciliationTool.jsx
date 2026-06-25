import React, { useState } from 'react';
import Papa from 'papaparse';
import ToolResult from '../ToolResult';

const ReconciliationTool = () => {
    const [f1, setF1] = useState(null);
    const [f2, setF2] = useState(null);
    const [key, setKey] = useState('id');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const run = async () => {
        if (!f1 || !f2) return setResult({ error: 'Select files.' });
        setLoading(true);
        try {
            const readAsJson = (file) => new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => Papa.parse(e.target.result, { header: true, complete: (res) => resolve(res.data) });
                reader.readAsText(file);
            });
            const data1 = await readAsJson(f1);
            const data2 = await readAsJson(f2);
            const ids1 = new Set(data1.map(r => r[key]));
            const ids2 = new Set(data2.map(r => r[key]));
            const onlyIn1 = data1.filter(r => !ids2.has(r[key])).length;
            const onlyIn2 = data2.filter(r => !ids1.has(r[key])).length;
            const common = data1.filter(r => ids2.has(r[key])).length;
            setResult({ text: JSON.stringify({ summary: { only_in_file1: onlyIn1, only_in_file2: onlyIn2, matches: common }, details: "Reconciliation complete using key: " + key }, null, 2) });
        } catch (e) { setResult({ error: e.message }); } finally { setLoading(false); }
    };

    return (
        <div className="card p-30 glass-card grid gap-15">
            <h3>Data Reconciliation (Diff Engine)</h3>
            <div className="file-input-wrapper"><input type="file" id="f1" onChange={e => setF1(e.target.files[0])} /><label htmlFor="f1" className="file-input-label">{f1?f1.name:'Base File'}</label></div>
            <div className="file-input-wrapper"><input type="file" id="f2" onChange={e => setF2(e.target.files[0])} /><label htmlFor="f2" className="file-input-label">{f2?f2.name:'Target File'}</label></div>
            <input className="pill w-full" placeholder="Key Column (e.g. id)" value={key} onChange={e => setKey(e.target.value)} />
            <button className="btn-primary" onClick={run} disabled={loading}>Compare & Reconcile</button>
            <ToolResult result={result} />
        </div>
    );
};

export default ReconciliationTool;
