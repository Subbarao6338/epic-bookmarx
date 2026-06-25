import React, { useState } from 'react';
import ToolResult from '../ToolResult';

const PingTester = () => {
    const [target, setTarget] = useState('8.8.8.8');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const ping = async () => {
        setLoading(true);
        const start = Date.now();
        try {
            await fetch(`https://${target}`, { mode: 'no-cors' }).catch(() => {});
            const end = Date.now();
            setResult({ text: `Target: ${target}\nResponse Time: ${end - start}ms\n(Note: This is an application-level latency check)` });
        } catch (e) {
            setResult({ error: 'Ping failed: ' + e.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card p-30 glass-card text-center grid gap-15">
            <h3>HTTP Ping Tester</h3>
            <input className="pill w-full" value={target} onChange={e=>setTarget(e.target.value)} placeholder="IP or Hostname" />
            <button className="btn-primary w-full" onClick={ping} disabled={loading}>{loading ? 'Pinging...' : 'Send Ping'}</button>
            <ToolResult result={result} />
        </div>
    );
};

export default PingTester;
