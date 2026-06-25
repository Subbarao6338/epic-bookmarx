import React, { useState } from 'react';

const TimezoneConverter = () => {
    const [time, setTime] = useState('');
    const [res, setRes] = useState('');
    const convert = () => {
        if (!time) return;
        const d = new Date(time);
        setRes(`UTC: ${d.toUTCString()}\nIST: ${d.toLocaleString('en-US', {timeZone: 'Asia/Kolkata'})}\nPST: ${d.toLocaleString('en-US', {timeZone: 'America/Los_Angeles'})}`);
    };
    return (
        <div className="card p-30 glass-card grid gap-15">
            <h3>TZ Converter</h3>
            <input type="datetime-local" className="pill w-full" value={time} onChange={e=>setTime(e.target.value)} />
            <button className="btn-primary" onClick={convert}>Convert</button>
            <pre className="smallest font-mono p-10 bg-surface rounded-lg">{res}</pre>
        </div>
    );
};

export default TimezoneConverter;
