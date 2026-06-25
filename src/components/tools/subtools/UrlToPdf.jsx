import React, { useState } from 'react';
import ToolResult from '../ToolResult';

const UrlToPdf = () => {
    const [url, setUrl] = useState('');
    const [result, setResult] = useState(null);

    const printToPdf = () => {
        const win = window.open(url, '_blank');
        if (win) {
            win.onload = () => {
                win.print();
            };
            setResult({ text: 'Opening URL for PDF print. Use browser Print to PDF.' });
        } else {
            setResult({ error: 'Popup blocked. Please allow popups.' });
        }
    };

    return (
        <div className="card p-30 glass-card text-center grid gap-15">
            <h3>URL to PDF (Offline)</h3>
            <p className="smallest opacity-6">Uses browser print engine for high-fidelity conversion.</p>
            <input className="pill w-full" placeholder="https://example.com" value={url} onChange={e=>setUrl(e.target.value)} />
            <button className="btn-primary w-full" onClick={printToPdf}>Generate PDF</button>
            <ToolResult result={result} />
        </div>
    );
};

export default UrlToPdf;
