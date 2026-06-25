import React, { useState } from 'react';
import ToolResult from '../ToolResult';

const Base64Tool = () => {
    const [input, setInput] = useState('');
    const [result, setResult] = useState(null);

    const encode = () => {
        try {
            setResult({ text: btoa(input), filename: 'encoded.txt' });
        } catch (e) {
            setResult({ error: e.message });
        }
    };

    const decode = () => {
        try {
            setResult({ text: atob(input), filename: 'decoded.txt' });
        } catch (e) {
            setResult({ error: e.message });
        }
    };

    return (
        <div className="card p-30 glass-card grid gap-15">
            <textarea className="pill w-full font-mono" rows="8" placeholder="Enter text..." value={input} onChange={e=>setInput(e.target.value)} />
            <div className="grid grid-2-cols gap-10">
                <button className="btn-primary" onClick={encode}>Base64 Encode</button>
                <button className="pill" onClick={decode}>Base64 Decode</button>
            </div>
            <ToolResult result={result} />
        </div>
    );
};

export default Base64Tool;
