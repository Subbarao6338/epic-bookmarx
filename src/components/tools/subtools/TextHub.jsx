import React, { useState } from 'react';
import ToolResult from '../ToolResult';

const TextHub = () => {
    const [input, setInput] = useState('');
    const [res, setRes] = useState(null);
    const run = () => {
        if (!input) return;
        setRes({ text: `Lines: ${input.split('\n').length}\nWords: ${input.trim().split(/\s+/).length}\nChars: ${input.length}` });
    };
    return (
        <div className="card p-20 glass-card grid gap-15">
            <h3>Text Analytics (Offline)</h3>
            <textarea className="pill w-full" rows="6" value={input} onChange={e=>setInput(e.target.value)} placeholder="Paste text..." />
            <button className="btn-primary" onClick={run}>Analyze</button>
            <ToolResult result={res} />
        </div>
    );
};

export default TextHub;
