import React, { useState } from 'react';
import ToolResult from '../ToolResult';

const IpInfo = () => {
    const [ip, setIp] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const getInfo = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/network/ip-info${ip ? `?ip=${ip}` : ''}`);
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
            <h3>IP Information</h3>
            <input className="pill w-full" placeholder="Enter IP (leave blank for yours)..." value={ip} onChange={e=>setIp(e.target.value)} />
            <button className="btn-primary w-full" onClick={getInfo} disabled={loading}>{loading ? 'Fetching...' : 'Get IP Info'}</button>
            <ToolResult result={result} />
        </div>
    );
};

export default IpInfo;
