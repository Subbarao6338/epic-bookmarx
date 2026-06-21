import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import ToolResult from './ToolResult';
import { detectMultivariateAnomalies, runDataQualitySuite, generateSyntheticData } from '../../utils/dataAnalysis';

const DataTools = ({ toolId, onSubtoolChange }) => {
  const tabs = [
    { id: 'viewer', label: 'Data Viewer' },
    { id: 'science', label: 'Statistics' },
    { id: 'adv-data', label: 'Advanced Analysis' },
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
  }, [activeTab, onSubtoolChange, tabs]);

  useEffect(() => {
    if (toolId) {
      const mapping = {
        'viewer': 'viewer', 'data-viewer': 'viewer',
        'science': 'science', 'data-science': 'science',
        'adv-data': 'adv-data', 'data-profiling': 'adv-data',
        'reconcile': 'reconcile', 'synthetic': 'synthetic',
        'image-lab': 'image-lab', 'anonymizer': 'anonymizer',
        'json-csv': 'json-csv', 'mock': 'mock', 'finance': 'finance'
      };
      if (mapping[toolId]) setActiveTab(mapping[toolId]);
    }
  }, [toolId]);

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
        {activeTab === 'adv-data' && <AdvancedDataHub data={uploadedData} />}
        {activeTab === 'reconcile' && <ReconciliationTool />}
        {activeTab === 'synthetic' && <SyntheticDataTool data={uploadedData} />}
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
                    // Parity with ads/Utility/multivariate_anomaly.py
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

const SyntheticDataTool = ({ data }) => {
    const [rows, setRows] = useState(100);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const run = async () => {
        if (!data) return setResult({ error: 'Upload seed file in Viewer.' });
        setLoading(true);
        try {
            const synthetic = generateSyntheticData(data, rows);
            setResult({ text: Papa.unparse(synthetic), filename: 'synthetic_data_sdv_parity.csv' });
        } catch (e) { setResult({ error: e.message }); } finally { setLoading(false); }
    };

    return (
        <div className="card p-30 glass-card grid gap-15">
            <h3>Synthetic Data Lab (SDV Port)</h3>
            <p className="small opacity-7">Preserves relational-like distributions via hybrid correlation sampling.</p>
            <input type="number" className="pill w-full" value={rows} onChange={e=>setRows(e.target.value)} placeholder="Number of rows" />
            <button className="btn-primary w-full" onClick={run} disabled={loading}>{loading?'Synthesizing...':'Generate Synthetic Dataset'}</button>
            <ToolResult result={result} />
        </div>
    );
};

const ImageLab = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const runTransform = (type) => {
        if (!file) return setResult({ error: 'Select image.' });
        setLoading(true);
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width; canvas.height = img.height;
                if (type === 'rotate') {
                    canvas.width = img.height; canvas.height = img.width;
                    ctx.translate(canvas.width / 2, canvas.height / 2); ctx.rotate(90 * Math.PI / 180);
                    ctx.drawImage(img, -img.width / 2, -img.height / 2);
                } else if (type === 'flip') { ctx.scale(-1, 1); ctx.drawImage(img, -img.width, 0); }
                else if (type === 'grayscale') { ctx.filter = 'grayscale(100%)'; ctx.drawImage(img, 0, 0); }
                else if (type === 'anonymize') {
                    ctx.drawImage(img, 0, 0); ctx.filter = 'blur(15px)';
                    const bx = canvas.width * 0.1, by = canvas.height * 0.1, bw = canvas.width * 0.8, bh = canvas.height * 0.8;
                    ctx.drawImage(img, bx, by, bw, bh, bx, by, bw, bh); ctx.filter = 'none';
                } else { ctx.drawImage(img, 0, 0); }
                const url = canvas.toDataURL('image/png');
                setResult({ text: `Applied ${type} transformation`, url, filename: `transformed_${type}.png` });
                setLoading(false);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="card p-30 glass-card grid gap-15">
            <h3>Image Privacy Lab (Canvas)</h3>
            <div className="file-input-wrapper"><input type="file" id="img-in" onChange={e=>setFile(e.target.files[0])} accept="image/*" /><label htmlFor="img-in" className="file-input-label">{file?file.name:'Choose Image'}</label></div>
            <button className="btn-primary w-full" onClick={()=>runTransform('anonymize')} disabled={loading}>Anonymize Image (Blur)</button>
            <div className="grid grid-3 gap-10">
                <button className="pill" onClick={()=>runTransform('rotate')} disabled={loading}>Rotate</button>
                <button className="pill" onClick={()=>runTransform('flip')} disabled={loading}>Flip</button>
                <button className="pill" onClick={()=>runTransform('grayscale')} disabled={loading}>Gray</button>
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
    const [activeCalc, setActiveCalc] = useState('emi');
    const [amt, setAmt] = useState(100000);
    const [rate, setRate] = useState(7.5);
    const [yrs, setYrs] = useState(15);
    const [result, setResult] = useState(null);

    const calculate = () => {
        if (activeCalc === 'emi') {
            const r = rate / 1200, n = yrs * 12;
            const emi = (amt * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            setResult({ text: `Monthly EMI: ${emi.toFixed(2)}\nTotal Payment: ${(emi * n).toFixed(2)}\nTotal Interest: ${(emi * n - amt).toFixed(2)}` });
        } else if (activeCalc === 'cagr') {
            const initial = rate, final = amt;
            const cagr = (Math.pow(final / initial, 1 / yrs) - 1) * 100;
            setResult({ text: `CAGR: ${cagr.toFixed(2)}%` });
        } else if (activeCalc === 'mortgage') {
            const r = rate / 1200, n = yrs * 12;
            const monthly = (amt * r) / (1 - Math.pow(1 + r, -n));
            setResult({ text: `Monthly Mortgage: ${monthly.toFixed(2)}` });
        }
    };

    return (
        <div className="card p-30 glass-card grid gap-15">
            <h3>Finance Hub</h3>
            <div className="pill-group">
                <button className={`pill ${activeCalc === 'emi' ? 'active' : ''}`} onClick={() => setActiveCalc('emi')}>EMI</button>
                <button className={`pill ${activeCalc === 'cagr' ? 'active' : ''}`} onClick={() => setActiveCalc('cagr')}>CAGR</button>
                <button className={`pill ${activeCalc === 'mortgage' ? 'active' : ''}`} onClick={() => setActiveCalc('mortgage')}>Mortgage</button>
            </div>
            <div className="grid gap-10">
                <div className="form-group">
                    <label>{activeCalc === 'cagr' ? 'Final Value' : 'Principal Amount'}</label>
                    <input type="number" className="pill w-full" value={amt} onChange={e => setAmt(parseFloat(e.target.value) || 0)} />
                </div>
                <div className="form-group">
                    <label>{activeCalc === 'cagr' ? 'Initial Value' : 'Interest Rate (%)'}</label>
                    <input type="number" className="pill w-full" value={rate} onChange={e => setRate(parseFloat(e.target.value) || 0)} />
                </div>
                <div className="form-group">
                    <label>Period (Years)</label>
                    <input type="number" className="pill w-full" value={yrs} onChange={e => setYrs(parseFloat(e.target.value) || 0)} />
                </div>
                <button className="btn-primary" onClick={calculate}>Calculate</button>
            </div>
            <ToolResult result={result} />
        </div>
    );
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
            <h3>Field Masking (PII Protection)</h3>
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
