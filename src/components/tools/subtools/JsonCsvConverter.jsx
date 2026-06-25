import React, { useState } from 'react';
import Papa from 'papaparse';
import ToolResult from '../ToolResult';

const JsonCsvConverter = () => {
    const [val, setVal] = useState(''); const [res, setRes] = useState(null);
    const toCsv = () => { try { setRes({text: Papa.unparse(JSON.parse(val)), filename:'converted.csv'}); } catch(e) {} };
    return (<div className="card p-20 glass-card grid gap-15"><h3>Format Conversion</h3><textarea className="pill font-mono w-full" rows="6" value={val} onChange={e=>setVal(e.target.value)} placeholder='Paste JSON array here...' /><button className="btn-primary" onClick={toCsv}>Convert to CSV</button><ToolResult result={res} /></div>);
};

export default JsonCsvConverter;
