import React, { useState } from 'react';
import ToolResult from '../ToolResult';

const JwtDebugger = () => {
    const [jwt, setJwt] = useState('');
    const [result, setResult] = useState(null);

    const decodeJwt = () => {
        if (!jwt) return;
        try {
            const parts = jwt.split('.');
            if (parts.length !== 3) throw new Error('Invalid JWT format');

            const header = JSON.parse(atob(parts[0]));
            const payload = JSON.parse(atob(parts[1]));

            setResult({
                text: JSON.stringify({ header, payload }, null, 2),
                filename: 'jwt_decoded.json'
            });
        } catch (e) {
            setResult({ error: e.message });
        }
    };

    return (
        <div className="grid gap-15">
            <textarea className="pill w-full font-mono" rows="4" placeholder="Paste JWT here..." value={jwt} onChange={e=>setJwt(e.target.value)} />
            <button className="btn-primary w-full" onClick={decodeJwt}>Decode JWT</button>
            <ToolResult result={result} />
        </div>
    );
};

export default JwtDebugger;
