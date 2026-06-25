import React, { useState } from 'react';
import ToolResult from '../ToolResult';

const YamlJsonConverter = () => {
    const [input, setInput] = useState('');
    const [result, setResult] = useState(null);

    const toYaml = () => {
        try {
            const parsed = JSON.parse(input);
            const stringify = (obj, indent = '') => {
                return Object.entries(obj).map(([k, v]) => {
                    if (typeof v === 'object' && v !== null) {
                        return `${indent}${k}:\n${stringify(v, indent + '  ')}`;
                    }
                    return `${indent}${k}: ${v}`;
                }).join('\n');
            };
            setResult({ text: stringify(parsed), filename: 'converted.yaml' });
        } catch (e) {
            setResult({ error: 'Invalid JSON for conversion: ' + e.message });
        }
    };

    return (
        <div className="card p-30 glass-card grid gap-15">
            <textarea className="pill w-full font-mono" rows="8" placeholder="Paste JSON here to convert to YAML..." value={input} onChange={e=>setInput(e.target.value)} />
            <button className="btn-primary w-full" onClick={toYaml}>Convert to YAML</button>
            <ToolResult result={result} />
        </div>
    );
};

export default YamlJsonConverter;
