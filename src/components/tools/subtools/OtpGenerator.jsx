import React, { useState } from 'react';
import ToolResult from '../ToolResult';

const OtpGenerator = () => {
    const [length, setLength] = useState(6);
    const [result, setResult] = useState(null);

    const generate = () => {
        const otp = Math.floor(Math.pow(10, length-1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length-1))).toString();
        setResult({ text: `Generated OTP: ${otp}` });
    };

    return (
        <div className="card p-30 glass-card text-center grid gap-15">
            <h3>OTP Generator</h3>
            <div className="flex-center gap-10">
                <label>Length:</label>
                <input type="number" className="pill" style={{width: '60px'}} value={length} onChange={e=>setLength(parseInt(e.target.value))} min="4" max="10" />
            </div>
            <button className="btn-primary w-full" onClick={generate}>Generate OTP</button>
            <ToolResult result={result} />
        </div>
    );
};

export default OtpGenerator;
