import React, { useState } from 'react';
import ToolResult from '../ToolResult';

const SslChecker = () => {
    const [domain, setDomain] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const check = async () => {
        if (!domain) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/network/ssl?domain=${domain}`);
            const data = await res.json();
            setResult({ text: JSON.stringify(data, null, 2) });
        } catch (e) {
            setResult({ error: e.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card p-30 glass-card text-center grid gap-15">
            <h3>SSL Certificate Checker</h3>
            <input className="pill w-full" placeholder="example.com" value={domain} onChange={e=>setDomain(e.target.value)} />
            <button className="btn-primary w-full" onClick={check} disabled={loading}>{loading ? 'Checking...' : 'Check SSL'}</button>
            <ToolResult result={result} />
        </div>
    );
};

export default SslChecker;
