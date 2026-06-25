import React, { useState } from 'react';
import ToolResult from '../ToolResult';

const RegexTester = () => {
    const [regex, setRegex] = useState('');
    const [flags, setFlags] = useState('g');
    const [text, setText] = useState('');
    const [result, setResult] = useState(null);

    const testRegex = () => {
        if (!regex) return;
        try {
            const re = new RegExp(regex, flags);
            const matches = [...text.matchAll(re)];
            const info = matches.map((m, i) => `Match ${i + 1}: ${m[0]} (Index: ${m.index})`).join('\n');
            setResult({ text: info || 'No matches found.' });
        } catch (e) {
            setResult({ error: e.message });
        }
    };

    return (
        <div className="grid gap-15">
            <div className="flex-gap">
                <input className="pill flex-1 font-mono" placeholder="Regex pattern (e.g. [a-z]+)" value={regex} onChange={e=>setRegex(e.target.value)} />
                <input className="pill" style={{width: '60px'}} placeholder="flags" value={flags} onChange={e=>setFlags(e.target.value)} />
            </div>
            <textarea className="pill w-full font-mono" rows="6" placeholder="Test text..." value={text} onChange={e=>setText(e.target.value)} />
            <button className="btn-primary w-full" onClick={testRegex}>Test Regex</button>
            <ToolResult result={result} />
        </div>
    );
};

export default RegexTester;
