import React, { useState } from 'react';
import ToolResult from '../ToolResult';

const JsonToTs = () => {
    const [input, setInput] = useState('');
    const [result, setResult] = useState(null);

    const convert = () => {
        if (!input.trim()) return;
        try {
            const obj = JSON.parse(input);
            let ts = 'interface RootObject {\n';

            const processObj = (o, indent = '  ') => {
                let str = '';
                Object.entries(o).forEach(([key, val]) => {
                    let type = typeof val;
                    if (val === null) type = 'any';
                    else if (Array.isArray(val)) {
                        type = val.length > 0 ? `${typeof val[0]}[]` : 'any[]';
                    } else if (type === 'object') {
                        type = '{\n' + processObj(val, indent + '  ') + indent + '}';
                    }
                    str += `${indent}${key}: ${type};\n`;
                });
                return str;
            };

            ts += processObj(obj) + '}';
            setResult({ text: ts, filename: 'types.ts' });
        } catch (e) {
            setResult({ error: 'Invalid JSON: ' + e.message });
        }
    };

    return (
        <div className="grid gap-15">
            <textarea className="pill w-full font-mono" rows="8" placeholder="Paste JSON here..." value={input} onChange={e=>setInput(e.target.value)} />
            <button className="btn-primary w-full" onClick={convert}>Convert to TS Interface</button>
            <ToolResult result={result} />
        </div>
    );
};

export default JsonToTs;
