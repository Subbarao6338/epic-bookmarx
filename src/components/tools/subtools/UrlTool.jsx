import React, { useState } from 'react';
import ToolResult from '../ToolResult';

const UrlTool = () => {
    const [input, setInput] = useState('');
    const [result, setResult] = useState(null);

    const encode = () => {
        try {
            setResult({ text: encodeURIComponent(input), filename: 'encoded_url.txt' });
        } catch (e) {
            setResult({ error: e.message });
        }
    };

    const decode = () => {
        try {
            setResult({ text: decodeURIComponent(input), filename: 'decoded_url.txt' });
        } catch (e) {
            setResult({ error: e.message });
        }
    };

    return (
        <div className="card p-30 glass-card grid gap-15">
            <h3>URL Encoder / Decoder</h3>
            <textarea className="pill w-full font-mono" rows="8" placeholder="Enter URL or text..." value={input} onChange={e=>setInput(e.target.value)} />
            <div className="grid grid-2-cols gap-10">
                <button className="btn-primary" onClick={encode}>Encode</button>
                <button className="pill" onClick={decode}>Decode</button>
            </div>
            <ToolResult result={result} />
        </div>
    );
};

export default UrlTool;
