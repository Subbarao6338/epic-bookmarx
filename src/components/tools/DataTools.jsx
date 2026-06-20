import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import ToolResult from './ToolResult';

const FinanceHub = ({ subtool }) => {
    const [activeTab, setActiveTab] = useState('compound');

    useEffect(() => {
        if (subtool === 'compound-int') setActiveTab('compound');
        else if (subtool === 'loan-calc') setActiveTab('loan');
        else if (subtool === 'currency-conv') setActiveTab('currency');
    }, [subtool]);

    return (
        <div className="grid gap-20">
            <div className="pill-group scrollable-x">
                <button className={`pill ${activeTab === 'compound' ? 'active' : ''}`} onClick={() => setActiveTab('compound')}>Compound Interest</button>
                <button className={`pill ${activeTab === 'loan' ? 'active' : ''}`} onClick={() => setActiveTab('loan')}>Loan Calculator</button>
                <button className={`pill ${activeTab === 'currency' ? 'active' : ''}`} onClick={() => setActiveTab('currency')}>Currency Converter</button>
            </div>
            <div className="hub-content animate-fadeIn">
                {activeTab === 'compound' && <CompoundInterestTool />}
                {activeTab === 'loan' && <LoanCalculatorTool />}
                {activeTab === 'currency' && <CurrencyConverterTool />}
            </div>
        </div>
    );
};

const CompoundInterestTool = () => {
    const [amt, setAmt] = useState(1000);
    const [rate, setRate] = useState(10);
    const [years, setYears] = useState(5);

    const compound = amt * Math.pow((1 + (rate/100)), years);

    return (
        <div className="grid gap-15">
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
            <ToolResult result={{ text: `Principal: ${amt}\nRate: ${rate}%\nYears: ${years}\nMaturity Value: ${compound.toFixed(2)}`, filename: 'compound_interest.txt' }} />
        </div>
    );
};

const LoanCalculatorTool = () => {
    const [loanAmt, setLoanAmt] = useState(100000);
    const [interest, setInterest] = useState(7.5);
    const [tenure, setTenure] = useState(15);

    const calcEMI = () => {
        const r = interest / 12 / 100;
        const n = tenure * 12;
        const emi = (loanAmt * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        return emi || 0;
    };

    const emi = calcEMI();
    const totalPayment = emi * tenure * 12;
    const totalInterest = totalPayment - loanAmt;

    return (
        <div className="grid gap-15">
            <div className="form-group">
                <label>Loan Amount</label>
                <input type="number" className="pill" value={loanAmt} onChange={e=>setLoanAmt(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Interest Rate (%)</label>
                <input type="number" className="pill" value={interest} onChange={e=>setInterest(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Tenure (Years)</label>
                <input type="number" className="pill" value={tenure} onChange={e=>setTenure(e.target.value)} />
            </div>
            <div className="grid grid-2 gap-10">
                <div className="card p-15 text-center glass-card">
                    <div className="opacity-6 smallest uppercase">Monthly EMI</div>
                    <div className="font-bold h2">{emi.toFixed(0)}</div>
                </div>
                <div className="card p-15 text-center glass-card">
                    <div className="opacity-6 smallest uppercase">Total Interest</div>
                    <div className="font-bold h2">{totalInterest.toFixed(0)}</div>
                </div>
            </div>
            <ToolResult result={{ text: `Loan: ${loanAmt}\nEMI: ${emi.toFixed(2)}\nTotal Interest: ${totalInterest.toFixed(2)}`, filename: 'loan_calc.txt' }} />
        </div>
    );
};

const CurrencyConverterTool = () => {
    const [amount, setAmount] = useState(100);
    const [from, setFrom] = useState('USD');
    const [to, setTo] = useState('EUR');

    const rates = {
        'USD': 1, 'EUR': 0.92, 'GBP': 0.79, 'INR': 83.3, 'JPY': 151.8, 'CAD': 1.35, 'AUD': 1.52, 'CNY': 7.23, 'CHF': 0.9, 'SGD': 1.34
    };

    const convert = () => {
        const result = (amount / rates[from]) * rates[to];
        return result.toFixed(2);
    };

    return (
        <div className="grid gap-15">
            <input type="number" className="pill text-center h2" value={amount} onChange={e=>setAmount(e.target.value)} />
            <div className="flex-center gap-10">
                <select className="pill flex-1" value={from} onChange={e=>setFrom(e.target.value)}>
                    {Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <span className="material-icons">swap_horiz</span>
                <select className="pill flex-1" value={to} onChange={e=>setTo(e.target.value)}>
                    {Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
            <div className="tool-result text-center mt-20">
                <div className="h2 color-primary">{convert()}</div>
                <div className="opacity-6 font-bold">{to}</div>
            </div>
            <ToolResult result={`${amount} ${from} = ${convert()} ${to}`} />
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
                const median = sorted[Math.floor(sorted.length / 2)];
                const variance = values.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / values.length;
                const stdDev = Math.sqrt(variance);

                result[key] = {
                    count: values.length,
                    min: Math.min(...values),
                    max: Math.max(...values),
                    sum: sum.toFixed(2),
                    avg: avg.toFixed(2),
                    median: median.toFixed(2),
                    variance: variance.toFixed(2),
                    stdDev: stdDev.toFixed(2)
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
                                <th className="p-10">Sum</th>
                                <th className="p-10">Avg</th>
                                <th className="p-10">Median</th>
                                <th className="p-10">StdDev</th>
                                <th className="p-10">Var</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(stats || {}).map(([key, s]) => (
                                <tr key={key} style={{ borderTop: '1px solid var(--border)' }}>
                                    <td className="p-10 font-bold">{key}</td>
                                    <td className="p-10">{s.min}</td>
                                    <td className="p-10">{s.max}</td>
                                    <td className="p-10">{s.sum}</td>
                                    <td className="p-10">{s.avg}</td>
                                    <td className="p-10">{s.median}</td>
                                    <td className="p-10">{s.stdDev}</td>
                                    <td className="p-10">{s.variance}</td>
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
            <ToolResult result={result} onClear={() => setResult(null)} />
        </div>
    );
};

const DataProfilingTool = ({ data }) => {
    const [result, setResult] = useState(null);
    useEffect(() => {
        if (data) {
            setResult(`Rows: ${data.length}\nColumns: ${Object.keys(data[0] || {}).join(', ')}`);
        } else {
            setResult(null);
        }
    }, [data]);

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
            <ToolResult result={result} onClear={() => setResult(null)} />
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
    { id: 'mock', label: 'Mock Data Gen' },
    { id: 'excel', label: 'Excel Converter' }
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
      else if (toolId === 'excel-conv') setActiveTab('excel');
      else if (toolId === 'mock-gen') setActiveTab('mock');
      else if (toolId === 'json-csv') setActiveTab('json-csv');
      else if (toolId === 'data-profiling') setActiveTab('profiling');
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
        {activeTab === 'excel' && <ExcelConverter />}
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
            } else if (file.name.endsWith('.json')) {
                try {
                    const jsonData = JSON.parse(content);
                    const formattedData = Array.isArray(jsonData) ? jsonData : [jsonData];
                    if (formattedData.length > 0) {
                        setHeaders(Object.keys(formattedData[0]));
                        setData(formattedData);
                        setGlobalData(formattedData);
                    }
                    setResult({ text: JSON.stringify(jsonData, null, 2), filename: file.name });
                } catch (e) {
                    setResult({ error: "Invalid JSON file" });
                }
                setLoading(false);
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="grid gap-15">
            <div className="card p-20 flex-column align-center text-center glass-card">
                <div className="file-input-wrapper">
                    <input type="file" accept=".csv,.json" onChange={handleFileUpload} />
                    <div className="file-input-label">
                        <span className="material-icons">{fileName ? 'description' : 'cloud_upload'}</span>
                        <span>{fileName || 'Click or drag CSV/JSON file to browse'}</span>
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
    const [showPreview, setShowPreview] = useState(false);

    const convertToCsv = () => {
        try {
            const json = JSON.parse(input);
            const csv = Papa.unparse(json);
            setResult({ text: csv, filename: 'converted.csv' });
        } catch (e) {
            setResult({ error: "Invalid JSON input" });
        }
    };
    const convertToJson = () => {
        Papa.parse(input, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                setResult({ text: JSON.stringify(results.data, null, 2), filename: 'converted.json' });
            },
            error: (e) => setResult({ error: "Invalid CSV input: " + e.message })
        });
    };
    return (
        <div className="card p-20 glass-card grid gap-15">
            <textarea className="pill font-mono" rows="8" value={input} onChange={e => setInput(e.target.value)} placeholder="Paste JSON or CSV here..." />
            <div className="flex-gap">
                <button className="btn-primary flex-1" onClick={convertToCsv}>JSON to CSV</button>
                <button className="pill flex-1" onClick={convertToJson}>CSV to JSON</button>
            </div>
            {result && (
                <div className="mt-10">
                    <button className="pill w-full mb-10" onClick={() => setShowPreview(!showPreview)}>
                        <span className="material-icons">{showPreview ? 'visibility_off' : 'visibility'}</span>
                        {showPreview ? 'Hide Preview' : 'Show Preview'}
                    </button>
                    {showPreview && (
                        <div className="animate-fadeIn">
                            <ToolResult result={result} onClear={() => {setResult(null); setShowPreview(false);}} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const MockDataGenerator = () => {
    const [rows, setRows] = useState(10);
    const [fields, setFields] = useState(['id', 'name', 'email']);
    const [result, setResult] = useState(null);

    const generate = () => {
        const data = Array.from({ length: parseInt(rows) || 1 }, (_, i) => {
            const row = {};
            if (fields.includes('id')) row.id = i + 1;
            if (fields.includes('name')) row.name = `User ${i + 1}`;
            if (fields.includes('email')) row.email = `user${i + 1}@example.com`;
            if (fields.includes('phone')) row.phone = `+1-555-010${i % 10}${i % 9}`;
            if (fields.includes('address')) row.address = `${100 + i} Epic St, Tech City, 90210`;
            if (fields.includes('date')) row.date = new Date(Date.now() - i * 86400000).toISOString();
            if (fields.includes('score')) row.score = Math.floor(Math.random() * 100);
            return row;
        });
        setResult({ text: JSON.stringify(data, null, 2), filename: 'mock_data.json' });
    };

    const toggleField = (f) => setFields(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);

    return (
        <div className="card p-20 glass-card">
            <div className="form-group">
                <label>Number of Rows</label>
                <input type="number" className="pill mb-15" value={rows} onChange={e=>setRows(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Include Fields</label>
                <div className="pill-group mb-20">
                    {['id', 'name', 'email', 'phone', 'address', 'date', 'score'].map(f => (
                        <button key={f} className={`pill ${fields.includes(f) ? 'active' : ''}`} onClick={() => toggleField(f)}>{f.toUpperCase()}</button>
                    ))}
                </div>
            </div>
            <button className="btn-primary w-full" onClick={generate}>Generate Mock Data</button>
            <ToolResult result={result} onClear={() => setResult(null)} />
        </div>
    );
};

const ExcelConverter = () => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [result, setResult] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    const handleUpload = (e) => {
        const f = e.target.files[0];
        if (!f) return;
        setFile(f);
        setFileName(f.name);
        setResult(null);
        setShowPreview(false);
    };

    const convert = (format) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.SheetNames[0];
            const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet]);

            if (format === 'json') {
                setResult({ text: JSON.stringify(jsonData, null, 2), filename: file.name.replace(/\.[^/.]+$/, "") + ".json" });
            } else {
                const csv = Papa.unparse(jsonData);
                setResult({ text: csv, filename: file.name.replace(/\.[^/.]+$/, "") + ".csv" });
            }
        };
        reader.readAsArrayBuffer(file);
    };

    return (
        <div className="card p-20 glass-card grid gap-15">
            <div className="file-input-wrapper">
                <input type="file" accept=".xlsx,.xls" onChange={handleUpload} />
                <div className="file-input-label">
                    <span className="material-icons">{fileName ? 'description' : 'cloud_upload'}</span>
                    <span>{fileName || 'Select Excel (.xlsx, .xls) file'}</span>
                </div>
            </div>
            <div className="flex-gap">
                <button className="btn-primary flex-1" onClick={() => convert('json')} disabled={!file}>to JSON</button>
                <button className="pill flex-1" onClick={() => convert('csv')} disabled={!file}>to CSV</button>
            </div>
            {result && (
                <div className="mt-10">
                    <button className="pill w-full mb-10" onClick={() => setShowPreview(!showPreview)}>
                        <span className="material-icons">{showPreview ? 'visibility_off' : 'visibility'}</span>
                        {showPreview ? 'Hide Preview' : 'Show Preview'}
                    </button>
                    {showPreview && (
                        <div className="animate-fadeIn">
                            <ToolResult result={result} onClear={() => {setResult(null); setShowPreview(false);}} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DataTools;
