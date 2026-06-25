import React, { useState } from 'react';
import ToolResult from '../ToolResult';

const KqlFormatter = () => {
    const [input, setInput] = useState('');
    const [result, setResult] = useState(null);

    const formatKql = () => {
        if (!input.trim()) return;
        try {
            // Normalize spaces
            let kql = input.replace(/\s+/g, ' ').trim();

            // Pipe based formatting
            const lines = kql.split('|').map((line, i) => {
                let trimmed = line.trim();
                if (i === 0) return trimmed;

                // Indent clauses
                return `| ${trimmed}`;
            });

            setResult({ text: lines.join('\n'), filename: 'formatted.kql' });
        } catch (e) {
            setResult({ error: e.message });
        }
    };

    return (
        <div className="grid gap-15">
            <textarea className="pill w-full font-mono text-sm" rows="10" style={{lineHeight: '1.6'}} placeholder="Paste KQL query here..." value={input} onChange={e=>setInput(e.target.value)} />
            <div className="flex gap-10">
                <button className="btn-primary flex-1" onClick={formatKql}>Format KQL</button>
                <button className="pill" onClick={() => setInput('')}>Clear</button>
            </div>
            <ToolResult result={result} />
        </div>
    );
};

export default KqlFormatter;
