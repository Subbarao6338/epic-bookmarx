import React, { useState } from 'react';
import Papa from 'papaparse';

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

export default DataViewer;
