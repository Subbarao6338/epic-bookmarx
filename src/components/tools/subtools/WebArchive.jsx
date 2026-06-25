import React, { useState } from 'react';
import ToolResult from '../ToolResult';

const WebArchive = () => {
    const [url, setUrl] = useState('');
    const [result, setResult] = useState(null);

    const checkArchive = async () => {
        if (!url) return;
        try {
            const res = await fetch(`https://archive.org/wayback/available?url=${encodeURIComponent(url)}`);
            const data = await res.json();
            if (data.archived_snapshots.closest) {
                setResult({ text: `Closest snapshot: ${data.archived_snapshots.closest.timestamp}`, url: data.archived_snapshots.closest.url });
            } else {
                setResult({ text: 'No snapshots found.' });
            }
        } catch (e) {
            setResult({ error: e.message });
        }
    };

    return (
        <div className="card p-30 glass-card text-center grid gap-15">
            <h3>Wayback Machine Lookup</h3>
            <input className="pill w-full" placeholder="Enter URL..." value={url} onChange={e=>setUrl(e.target.value)} />
            <button className="btn-primary w-full" onClick={checkArchive}>Check History</button>
            <ToolResult result={result} />
        </div>
    );
};

export default WebArchive;
