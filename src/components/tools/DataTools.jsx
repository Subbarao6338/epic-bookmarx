import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import ToolResult from './ToolResult';

const DataTools = ({ toolId, onSubtoolChange }) => {
  const tabs = [
    { id: 'viewer', label: 'Data Viewer' },
    { id: 'science', label: 'Statistics' },
    { id: 'adv-data', label: 'Anomaly Detection' },
    { id: 'reconcile', label: 'Reconciliation' },
    { id: 'synthetic', label: 'Synthetic Lab' },
    { id: 'image-lab', label: 'Image Lab' },
    { id: 'anonymizer', label: 'Anonymizer' },
    { id: 'json-csv', label: 'JSON ↔ CSV' },
    { id: 'mock', label: 'Mock Data Gen' },
    { id: 'finance', label: 'Finance Hub' }
  ].sort((a, b) => a.label.localeCompare(b.label));

  const [activeTab, setActiveTab] = useState('viewer');
  const [uploadedData, setUploadedData] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);

  useEffect(() => {
    const current = tabs.find(t => t.id === activeTab);
    if (current && onSubtoolChange) onSubtoolChange(current.label);
  }, [activeTab]);

  return (
    <div className="tool-form mt-20">
      <div className="pill-group mb-20 scrollable-x">
        {tabs.map(tab => (
          <button key={tab.id} className={`pill ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="hub-content animate-fadeIn">
        {activeTab === 'viewer' && <DataViewer setGlobalData={setUploadedData} setRawFile={setCurrentFile} />}
        {activeTab === 'adv-data' && <AdvancedDataHub file={currentFile} />}
        {activeTab === 'reconcile' && <ReconciliationTool />}
        {activeTab === 'synthetic' && <SyntheticDataTool file={currentFile} />}
        {activeTab === 'image-lab' && <ImageLab />}
        {activeTab === 'finance' && <FinanceHub subtool={toolId} />}
        {activeTab === 'science' && <DataScienceHub data={uploadedData} />}
        {activeTab === 'anonymizer' && <DataAnonymizer data={uploadedData} />}
        {activeTab === 'mock' && <MockDataGenerator />}
        {activeTab === 'json-csv' && <JsonCsvConverter />}
      </div>
    </div>
  );
};

const DataViewer = ({ setGlobalData, setRawFile }) => {
    const [data, setData] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [fileName, setFileName] = useState('');
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setFileName(file.name);
        setRawFile(file);
        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target.result;
            if (file.name.endsWith('.csv')) {
                Papa.parse(content, { header: true, complete: (results) => {
                    setHeaders(results.meta.fields || []);
                    setData(results.data);
                    setGlobalData(results.data);
                }});
            } else if (file.name.endsWith('.json')) {
                try {
                    const jsonData = JSON.parse(content);
                    const formattedData = Array.isArray(jsonData) ? jsonData : [jsonData];
                    if (formattedData.length > 0) {
                        setHeaders(Object.keys(formattedData[0]));
                        setData(formattedData);
                        setGlobalData(formattedData);
                    }
                } catch (e) {}
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="grid gap-15">
            <div className="card p-30 glass-card grid gap-15 text-center">
                <div className="file-input-wrapper">
                    <input type="file" id="data-file" onChange={handleFileUpload} accept=".csv,.json" />
                    <label htmlFor="data-file" className="file-input-label">{fileName || 'Choose CSV or JSON'}</label>
                </div>
            </div>
            {data.length > 0 && (
                <div className="card p-0 overflow-auto glass-card" style={{ maxHeight: '300px' }}>
                    <table className="w-full text-xs">
                        <thead className="bg-surface sticky top-0">
                            <tr>{headers.map(h => <th key={h} className="p-10 text-left">{h}</th>)}</tr>
                        </thead>
                        <tbody>
                            {data.slice(0, 20).map((row, i) => (
                                <tr key={i} className="border-top">
                                    {headers.map(h => <td key={h} className="p-8">{String(row[h])}</td>)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const AdvancedDataHub = ({ file }) => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const run = async (type) => {
        if (!file) return alert('Upload file in Viewer first.');
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch(`/api/data-adv/${type}`, { method: 'POST', body: formData });
            const data = await res.json();
            setResult({ text: JSON.stringify(data, null, 2) });
        } catch (e) { setResult({ error: e.message }); } finally { setLoading(false); }
    };
    return (
        <div className="grid gap-15 card p-30 glass-card">
            <h3>Advanced Analysis</h3>
            <div className="grid grid-2-cols gap-10">
                <button className="btn-primary" onClick={() => run('anomaly-detect')} disabled={loading}>Detect Anomalies</button>
                <button className="pill" onClick={() => run('data-quality')} disabled={loading}>Data Quality</button>
            </div>
            <ToolResult result={result} />
        </div>
    );
};

const ReconciliationTool = () => {
    const [f1, setF1] = useState(null);
    const [f2, setF2] = useState(null);
    const [key, setKey] = useState('id');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const run = async () => {
        if (!f1 || !f2) return alert('Select files.');
        setLoading(true);
        const fd = new FormData();
        fd.append('file1', f1); fd.append('file2', f2); fd.append('key_column', key);
        try {
            const res = await fetch('/api/data-adv/reconcile', { method: 'POST', body: fd });
            const data = await res.json();
            setResult({ text: JSON.stringify(data.result, null, 2) });
        } catch (e) { setResult({ error: e.message }); } finally { setLoading(false); }
    };
    return (
        <div className="card p-30 glass-card grid gap-15">
            <h3>Data Reconciliation</h3>
            <div className="file-input-wrapper"><input type="file" id="f1" onChange={e => setF1(e.target.files[0])} /><label htmlFor="f1" className="file-input-label">{f1?f1.name:'Base File'}</label></div>
            <div className="file-input-wrapper"><input type="file" id="f2" onChange={e => setF2(e.target.files[0])} /><label htmlFor="f2" className="file-input-label">{f2?f2.name:'Target File'}</label></div>
            <input className="pill w-full" placeholder="Key Column (e.g. id)" value={key} onChange={e => setKey(e.target.value)} />
            <button className="btn-primary" onClick={run} disabled={loading}>Compare & Reconcile</button>
            <ToolResult result={result} />
        </div>
    );
};

const SyntheticDataTool = ({ file }) => {
    const [rows, setRows] = useState(100);
    const [advanced, setAdvanced] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const run = async () => {
        if (!file) return alert('Upload seed file in Viewer.');
        setLoading(true);
        const fd = new FormData();
        fd.append('file', file); fd.append('num_rows', rows); fd.append('advanced', advanced);
        try {
            const res = await fetch('/api/data-adv/generate-synthetic', { method: 'POST', body: fd });
            const data = await res.json();
            setResult({ text: Papa.unparse(data.data), filename: 'synthetic.csv' });
        } catch (e) { setResult({ error: e.message }); } finally { setLoading(false); }
    };
    return (
        <div className="card p-30 glass-card grid gap-15">
            <h3>Synthetic Data Generation</h3>
            <input type="number" className="pill w-full" value={rows} onChange={e=>setRows(e.target.value)} placeholder="Number of rows" />
            <label className="flex align-center gap-10 pointer">
                <input type="checkbox" checked={advanced} onChange={e=>setAdvanced(e.target.checked)} />
                <span className="small">Use Gaussian Copula (SDV High-Fidelity)</span>
            </label>
            <button className="btn-primary w-full" onClick={run} disabled={loading}>{loading?'Synthesizing...':'Generate Synthetic Dataset'}</button>
            <ToolResult result={result} />
        </div>
    );
};

const ImageLab = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const run = async (type, transform = '') => {
        if (!file) return alert('Select image.');
        setLoading(true);
        const fd = new FormData();
        fd.append('file', file);
        if (transform) fd.append('transform', transform);
        try {
            const res = await fetch(`/api/data-adv/image-${type}`, { method: 'POST', body: fd });
            const data = await res.json();
            setResult({ text: data.message + (data.detected_count !== undefined ? ` (Detected: ${data.detected_count})` : '') });
        } catch (e) { setResult({ error: e.message }); } finally { setLoading(false); }
    };
    return (
        <div className="card p-30 glass-card grid gap-15">
            <h3>Image Privacy Lab</h3>
            <div className="file-input-wrapper"><input type="file" id="img-in" onChange={e=>setFile(e.target.files[0])} accept="image/*" /><label htmlFor="img-in" className="file-input-label">{file?file.name:'Choose Image'}</label></div>
            <button className="btn-primary w-full" onClick={()=>run('anonymize')} disabled={loading}>Anonymize Faces & Plates</button>
            <div className="grid grid-3 gap-10">
                <button className="pill" onClick={()=>run('simulate', 'rotate')} disabled={loading}>Rotate 45°</button>
                <button className="pill" onClick={()=>run('simulate', 'flip')} disabled={loading}>Flip Horiz</button>
                <button className="pill" onClick={()=>run('simulate', 'grayscale')} disabled={loading}>Grayscale</button>
            </div>
            <ToolResult result={result} />
        </div>
    );
};

const DataScienceHub = ({ data }) => {
    const stats = useMemo(() => {
        if (!data || data.length === 0) return null;
        const keys = Object.keys(data[0]);
        const res = {};
        keys.forEach(k => {
            const vals = data.map(row => parseFloat(row[k])).filter(v => !isNaN(v));
            if (vals.length > 0) res[k] = { min: Math.min(...vals), max: Math.max(...vals), avg: (vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(2) };
        });
        return res;
    }, [data]);
    if (!data) return <div className="p-30 opacity-6 text-center">No data uploaded in Viewer.</div>;
    return (
        <div className="card p-20 glass-card">
            <table className="w-full">
                <thead><tr className="smallest uppercase opacity-6"><th className="p-10 text-left">Column</th><th className="p-10">Min</th><th className="p-10">Max</th><th className="p-10">Avg</th></tr></thead>
                <tbody>{Object.entries(stats || {}).map(([k,s])=>(<tr key={k} className="border-top"><td className="p-10 font-bold">{k}</td><td className="p-10 text-center">{s.min}</td><td className="p-10 text-center">{s.max}</td><td className="p-10 text-center">{s.avg}</td></tr>))}</tbody>
            </table>
        </div>
    );
};

const FinanceHub = ({ subtool }) => {
    const [amt, setAmt] = useState(100000); const [rate, setRate] = useState(7.5); const [yrs, setYrs] = useState(15);
    const emi = (amt * (rate/1200) * Math.pow(1+rate/1200, yrs*12)) / (Math.pow(1+rate/1200, yrs*12)-1);
    return (<div className="card p-30 glass-card grid gap-15"><h3>Loan EMI Calculator</h3><input type="number" className="pill w-full" value={amt} onChange={e=>setAmt(e.target.value)} /><div className="h2 color-primary text-center">EMI: {emi.toFixed(0)}</div></div>);
};

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
            <h3>Field Masking</h3>
            <div className="flex-gap flex-wrap">{Object.keys(data[0]).map(c => <button key={c} className={`pill ${cols.includes(c)?'active':''}`} onClick={()=>setCols(p=>p.includes(c)?p.filter(x=>x!==c):[...p,c])}>{c}</button>)}</div>
            <button className="btn-primary w-full" onClick={run}>Apply Masking</button>
            <ToolResult result={res} />
        </div>
    );
};

const MockDataGenerator = () => {
    const [res, setRes] = useState(null);
    const gen = () => {
        const d = Array.from({length:10}, (_,i)=>({id:i+1, name:`User ${i+1}`, email:`user${i+1}@example.com`, status: ['Active', 'Pending', 'Inactive'][i%3]}));
        setRes({ text: JSON.stringify(d, null, 2), filename: 'mock_users.json' });
    };
    return (<div className="card p-30 glass-card text-center grid gap-15"><h3>Mock Data Generation</h3><button className="btn-primary" onClick={gen}>Generate Sample Users</button><ToolResult result={res} /></div>);
};

const JsonCsvConverter = () => {
    const [val, setVal] = useState(''); const [res, setRes] = useState(null);
    const toCsv = () => { try { setRes({text: Papa.unparse(JSON.parse(val)), filename:'converted.csv'}); } catch(e) {} };
    return (<div className="card p-20 glass-card grid gap-15"><h3>Format Conversion</h3><textarea className="pill font-mono w-full" rows="6" value={val} onChange={e=>setVal(e.target.value)} placeholder='Paste JSON array here...' /><button className="btn-primary" onClick={toCsv}>Convert to CSV</button><ToolResult result={res} /></div>);
};

export default DataTools;
