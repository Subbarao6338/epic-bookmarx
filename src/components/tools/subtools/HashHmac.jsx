import React, { useState } from 'react';
import ToolResult from '../ToolResult';

const HashHmac = () => {
    const [input, setInput] = useState('');
    const [key, setKey] = useState('');
    const [algo, setAlgo] = useState('SHA-256');
    const [result, setResult] = useState(null);

    const generateHash = async () => {
        if (!input) return;
        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(input);
            let hashBuffer;

            if (key) {
                const cryptoKey = await crypto.subtle.importKey(
                    'raw', encoder.encode(key),
                    { name: 'HMAC', hash: { name: algo } },
                    false, ['sign']
                );
                hashBuffer = await crypto.subtle.sign('HMAC', cryptoKey, data);
            } else {
                hashBuffer = await crypto.subtle.digest(algo, data);
            }

            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            setResult({ text: hashHex });
        } catch (e) {
            setResult({ error: e.message });
        }
    };

    return (
        <div className="grid gap-15">
            <select className="pill w-full" value={algo} onChange={e=>setAlgo(e.target.value)}>
                <option value="SHA-1">SHA-1</option>
                <option value="SHA-256">SHA-256</option>
                <option value="SHA-384">SHA-384</option>
                <option value="SHA-512">SHA-512</option>
            </select>
            <textarea className="pill w-full font-mono" rows="4" placeholder="Input text..." value={input} onChange={e=>setInput(e.target.value)} />
            <input className="pill w-full font-mono" placeholder="Key (optional for HMAC)" value={key} onChange={e=>setKey(e.target.value)} />
            <button className="btn-primary w-full" onClick={generateHash}>Generate {key ? 'HMAC' : 'Hash'}</button>
            <ToolResult result={result} />
        </div>
    );
};

export default HashHmac;
