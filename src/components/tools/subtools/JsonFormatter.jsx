import React, { useState } from 'react';
import ToolResult from '../ToolResult';

const JsonFormatter = () => {
    const [input, setInput] = useState('');
    const [result, setResult] = useState(null);

    const run = () => {
        if (!input.trim()) return;
        try {
            const parsed = JSON.parse(input);
            setResult({ text: JSON.stringify(parsed, null, 2), filename: 'formatted.json' });
        } catch (e) {
            setResult({ error: e.message });
        }
    };

    return (
        <div className="card p-30 glass-card grid gap-15">
            <textarea className="pill w-full font-mono" rows="8" placeholder="Paste JSON here..." value={input} onChange={e=>setInput(e.target.value)} />
            <button className="btn-primary w-full" onClick={run}>Format JSON</button>
            <ToolResult result={result} />
        </div>
    );
};

export default JsonFormatter;
