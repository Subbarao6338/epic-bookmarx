import React, { useState } from 'react';
import ToolResult from '../ToolResult';

const SocialAudit = () => {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const runAudit = async () => {
        if (!url) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/social/info?url=${encodeURIComponent(url)}`);
            const data = await res.json();
            if (res.ok) {
                setResult({ text: JSON.stringify(data, null, 2) });
            } else {
                throw new Error(data.detail || 'Audit failed. (Online backend required)');
            }
        } catch (e) {
            setResult({ error: e.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card p-30 glass-card text-center grid gap-15">
            <h3>Social Media Audit</h3>
            <p className="smallest opacity-6">Extract metadata, duration, and formats from social media URLs.</p>
            <input className="pill w-full" placeholder="Paste Video/Profile URL..." value={url} onChange={e=>setUrl(e.target.value)} />
            <button className="btn-primary w-full" onClick={runAudit} disabled={loading}>{loading ? 'Analyzing...' : 'Analyze Media'}</button>
            <ToolResult result={result} />
        </div>
    );
};

export default SocialAudit;
