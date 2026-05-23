import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import ToolResult from './ToolResult';

const FinanceHub = ({ subtool }) => {
    const [amt, setAmt] = useState(1000);
    const [rate, setRate] = useState(10);
    const [years, setYears] = useState(5);

    const compound = amt * Math.pow((1 + (rate/100)), years);

    return (
        <div className="card p-20 glass-card grid gap-15">
            <div className="form-group">
                <label>Principal Amount</label>
                <input type="number" className="pill" value={amt} onChange={e=>setAmt(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Interest Rate (%)</label>
                <input type="number" className="pill" value={rate} onChange={e=>setRate(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Time (Years)</label>
                <input type="number" className="pill" value={years} onChange={e=>setYears(e.target.value)} />
            </div>
            <div className="tool-result text-center">
                <div className="opacity-6 smallest uppercase font-bold">Maturity Value</div>
                <div className="font-bold color-primary" style={{fontSize: '2.5rem'}}>{compound.toFixed(2)}</div>
            </div>
            <ToolResult result={{ text: `Compound Interest: ${compound.toFixed(2)}`, filename: 'finance.txt' }} />
        </div>
    );
};

const DataScienceHub = ({ data }) => {
    const stats = useMemo(() => {
        if (!data || data.length === 0) return null;
        const keys = Object.keys(data[0]);
        const result = {};
        keys.forEach(key => {
            const values = data.map(row => parseFloat(row[key])).filter(v => !isNaN(v));
            if (values.length > 0) {
                const sum = values.reduce((a, b) => a + b, 0);
                const avg = sum / values.length;
                const sorted = [...values].sort((a, b) => a - b);
                result[key] = {
                    count: values.length,
                    min: Math.min(...values),
                    max: Math.max(...values),
                    avg: avg.toFixed(2),
                    median: sorted[Math.floor(sorted.length / 2)]
                };
            }
        });
        return result;
    }, [data]);

    if (!data) return <div className="text-center p-30 card glass-card opacity-6">Upload data in Viewer first.</div>;

    return (
        <div className="grid gap-20">
            <div className="card p-20 glass-card">
                <h3 className="mb-15">Statistical Analysis</h3>
                <div className="overflow-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left opacity-6 small uppercase">
                                <th className="p-10">Column</th>
                                <th className="p-10">Min</th>
                                <th className="p-10">Max</th>
                                <th className="p-10">Avg</th>
                                <th className="p-10">Median</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(stats || {}).map(([key, s]) => (
                                <tr key={key} style={{ borderTop: '1px solid var(--border)' }}>
                                    <td className="p-10 font-bold">{key}</td>
                                    <td className="p-10">{s.min}</td>
                                    <td className="p-10">{s.max}</td>
                                    <td className="p-10">{s.avg}</td>
                                    <td className="p-10">{s.median}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <ToolResult result={JSON.stringify(stats, null, 2)} />
        </div>
    );
};

const DataQualityTool = ({ data }) => {
    const quality = useMemo(() => {
        if (!data || data.length === 0) return null;
        const keys = Object.keys(data[0]);
        return keys.map(key => {
            const missing = data.filter(row => row[key] === undefined || row[key] === null || row[key] === '').length;
            const values = data.map(row => row[key]).filter(v => v !== '');
            const types = [...new Set(values.map(v => isNaN(parseFloat(v)) ? 'string' : 'number'))];
            return { column: key, missing, pctMissing: ((missing / data.length) * 100).toFixed(1), types: types.join(', ') };
        });
    }, [data]);

    if (!data) return <div className="text-center p-30 card glass-card opacity-6">Upload data in Viewer first.</div>;

    return (
        <div className="card p-20 glass-card">
            <h3 className="mb-15">Data Quality Report</h3>
            <div className="grid gap-10">
                {quality.map(q => (
                    <div key={q.column} className="flex-between p-10" style={{background: 'var(--surface)', borderRadius: '8px'}}>
                        <div>
                            <div className="font-bold">{q.column}</div>
                            <div className="smallest opacity-6">Types: {q.types}</div>
                        </div>
                        <div className="text-right">
                            <div className={q.missing > 0 ? 'color-error' : 'color-success'}>{q.missing} missing</div>
                            <div className="smallest opacity-6">{q.pctMissing}% missing</div>
                        </div>
                    </div>
                ))}
            </div>
            <ToolResult result={JSON.stringify(quality, null, 2)} />
        </div>
    );
};

const DataAnonymizer = ({ data }) => {
    const [maskCols, setMaskCols] = useState([]);
    const [result, setResult] = useState(null);

    const anonymize = () => {
        if (!data) return;
        const processed = data.map(row => {
            const newRow = { ...row };
            maskCols.forEach(col => {
                if (newRow[col]) newRow[col] = '*** MASKED ***';
            });
            return newRow;
        });
        setResult({ text: Papa.unparse(processed), filename: 'anonymized.csv' });
    };

    if (!data) return <div className="text-center p-30 card glass-card opacity-6">Upload data in Viewer first.</div>;

    return (
        <div className="card p-20 glass-card">
            <h3 className="mb-10">Anonymizer</h3>
            <p className="opacity-6 small mb-15">Select columns to mask:</p>
            <div className="pill-group mb-20">
                {Object.keys(data[0] || {}).map(col => (
                    <button key={col} className={`pill ${maskCols.includes(col) ? 'active' : ''}`} onClick={() => setMaskCols(prev => prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col])}>
                        {col}
                    </button>
                ))}
            </div>
            <button className="btn-primary w-full" onClick={anonymize}>Generate Anonymized CSV</button>
            <ToolResult result={result} />
        </div>
    );
};

const DataProfilingTool = ({ data }) => {
    if (!data) return <div className="text-center p-30 card glass-card opacity-6">Upload data in Viewer first.</div>;
    return (
        <div className="card p-20 glass-card">
            <h3 className="mb-10">Data Profiling</h3>
            <p className="mb-15">Analysis of {data.length} rows complete.</p>
            <div className="grid grid-2 gap-10">
                <div className="p-15" style={{background: 'var(--surface)', borderRadius: '12px'}}>
                    <div className="smallest opacity-6 uppercase">Total Rows</div>
                    <div className="font-bold" style={{fontSize: '1.5rem'}}>{data.length}</div>
                </div>
                <div className="p-15" style={{background: 'var(--surface)', borderRadius: '12px'}}>
                    <div className="smallest opacity-6 uppercase">Total Columns</div>
                    <div className="font-bold" style={{fontSize: '1.5rem'}}>{Object.keys(data[0] || {}).length}</div>
                </div>
            </div>
            <ToolResult result={`Rows: ${data.length}\nColumns: ${Object.keys(data[0] || {}).join(', ')}`} />
        </div>
    );
};

const DataTools = ({ toolId, onSubtoolChange }) => {
  const tabs = [
    { id: 'viewer', label: 'Data Viewer' },
    { id: 'finance', label: 'Finance Hub' },
    { id: 'science', label: 'Statistics' },
    { id: 'quality', label: 'Data Quality' },
    { id: 'profiling', label: 'Data Profiling' },
    { id: 'anonymizer', label: 'Anonymizer' },
    { id: 'json-csv', label: 'JSON ↔ CSV' },
    { id: 'mock', label: 'Mock Data Gen' }
  ].sort((a, b) => a.label.localeCompare(b.label));

  const [activeTab, setActiveTab] = useState('viewer');
  const [uploadedData, setUploadedData] = useState(null);

  useEffect(() => {
    const current = tabs.find(t => t.id === activeTab);
    if (current && onSubtoolChange) onSubtoolChange(current.label);
  }, [activeTab]);

  useEffect(() => {
    if (toolId) {
      if (['currency-conv', 'compound-int', 'loan-calc'].includes(toolId)) setActiveTab('finance');
      else if (['csv-viewer', 'data-visualizer'].includes(toolId)) setActiveTab('viewer');
      else if (toolId === 'anomaly-detect') setActiveTab('quality');
      else if (toolId === 'stat-calc') setActiveTab('science');
      else if (toolId === 'data-anonymizer') setActiveTab('anonymizer');
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
        {activeTab === 'viewer' && <DataViewer setGlobalData={setUploadedData} />}
        {activeTab === 'finance' && <FinanceHub subtool={toolId} />}
        {activeTab === 'science' && <DataScienceHub data={uploadedData} />}
        {activeTab === 'quality' && <DataQualityTool data={uploadedData} />}
        {activeTab === 'profiling' && <DataProfilingTool data={uploadedData} />}
        {activeTab === 'anonymizer' && <DataAnonymizer data={uploadedData} />}
        {activeTab === 'mock' && <MockDataGenerator />}
        {activeTab === 'json-csv' && <JsonCsvConverter />}
      </div>
    </div>
  );
};

const DataViewer = ({ setGlobalData }) => {
    const [data, setData] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState('');
    const [result, setResult] = useState(null);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setLoading(true);

        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target.result;
            if (file.name.endsWith('.csv')) {
                Papa.parse(content, {
                    header: true,
                    complete: (results) => {
                        setHeaders(results.meta.fields || []);
                        setData(results.data);
                        setGlobalData(results.data);
                        setResult({ text: content, filename: file.name });
                        setLoading(false);
                    }
                });
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="grid gap-15">
            <div className="card p-20 flex-column align-center text-center glass-card">
                <div className="file-input-wrapper">
                    <input type="file" accept=".csv" onChange={handleFileUpload} />
                    <div className="file-input-label">
                        <span className="material-icons">{fileName ? 'description' : 'cloud_upload'}</span>
                        <span>{fileName || 'Click or drag CSV file to browse'}</span>
                    </div>
                </div>
                {loading && <div className="mt-10 rotating material-icons color-primary">refresh</div>}
            </div>
            {data.length > 0 && (
                <div className="card p-0 overflow-auto glass-card" style={{ maxHeight: '400px' }}>
                    <table className="w-full">
                        <thead style={{ position: 'sticky', top: 0, background: 'var(--surface-solid)' }}>
                            <tr>{headers.map(h => <th key={h} style={{ padding: '12px', textAlign: 'left' }}>{h}</th>)}</tr>
                        </thead>
                        <tbody>
                            {data.slice(0, 50).map((row, i) => (
                                <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                                    {headers.map(h => <td key={h} style={{ padding: '10px' }}>{String(row[h])}</td>)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <ToolResult result={result} />
        </div>
    );
};

const JsonCsvConverter = () => {
    const [input, setInput] = useState('');
    const [result, setResult] = useState(null);
    const convertToCsv = () => {
        try {
            const json = JSON.parse(input);
            const csv = Papa.unparse(json);
            setResult({ text: csv, filename: 'converted.csv' });
        } catch (e) { alert("Invalid JSON input"); }
    };
    const convertToJson = () => {
        Papa.parse(input, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                setResult({ text: JSON.stringify(results.data, null, 2), filename: 'converted.json' });
            },
            error: (e) => alert("Invalid CSV input: " + e.message)
        });
    };
    return (
        <div className="card p-20 glass-card grid gap-15">
            <textarea className="pill font-mono" rows="8" value={input} onChange={e => setInput(e.target.value)} placeholder="Paste JSON or CSV here..." />
            <div className="flex-gap">
                <button className="btn-primary flex-1" onClick={convertToCsv}>JSON to CSV</button>
                <button className="pill flex-1" onClick={convertToJson}>CSV to JSON</button>
            </div>
            <ToolResult result={result} />
        </div>
    );
};

const MockDataGenerator = () => {
    const [rows, setRows] = useState(10);
    const [result, setResult] = useState(null);
    const generate = () => {
        const data = Array.from({ length: rows }, (_, i) => ({
            id: i + 1,
            name: `User ${i + 1}`,
            email: `user${i + 1}@example.com`,
            score: Math.floor(Math.random() * 100)
        }));
        setResult({ text: JSON.stringify(data, null, 2), filename: 'mock_data.json' });
    };
    return (
        <div className="card p-20 text-center glass-card">
            <div className="form-group">
                <label>Number of Rows</label>
                <input type="number" className="pill mb-15" value={rows} onChange={e=>setRows(e.target.value)} />
            </div>
            <button className="btn-primary w-full" onClick={generate}>Generate Mock Data</button>
            <ToolResult result={result} />
        </div>
    );
};

export default DataTools;
