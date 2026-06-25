import React, { useState } from 'react';
import Papa from 'papaparse';
import ToolResult from '../ToolResult';

const DataAnonymizer = ({ data }) => {
    const [cols, setCols] = useState([]);
    const [res, setRes] = useState(null);
    const run = () => {
        const processed = data.map(r => { let n = {...r}; cols.forEach(c => n[c] = '***'); return n; });
        setRes({ text: Papa.unparse(processed), filename: 'anonymized.csv' });
    };
    if (!data) return <div className="p-30 text-center opacity-6">No data in Viewer.</div>;
    return (
        <div className="card p-20 glass-card grid gap-15">
            <h3>Field Masking (PII Protection)</h3>
            <div className="flex-gap flex-wrap">{Object.keys(data[0]).map(c => <button key={c} className={`pill ${cols.includes(c)?'active':''}`} onClick={()=>setCols(p=>p.includes(c)?p.filter(x=>x!==c):[...p,c])}>{c}</button>)}</div>
            <button className="btn-primary w-full" onClick={run}>Apply Masking</button>
            <ToolResult result={res} />
        </div>
    );
};

export default DataAnonymizer;
