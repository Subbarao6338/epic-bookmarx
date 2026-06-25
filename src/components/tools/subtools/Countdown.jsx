import React, { useState, useEffect } from 'react';

const Countdown = () => {
    const [target, setTarget] = useState('');
    const [left, setLeft] = useState('');
    useEffect(() => {
        if (!target) return;
        const t = setInterval(() => {
            const ms = new Date(target) - new Date();
            if (ms < 0) { setLeft('Expired'); clearInterval(t); }
            else {
                const d = Math.floor(ms / 86400000);
                const h = Math.floor((ms % 86400000) / 3600000);
                const m = Math.floor((ms % 3600000) / 60000);
                const s = Math.floor((ms % 60000) / 1000);
                setLeft(`${d}d ${h}h ${m}m ${s}s`);
            }
        }, 1000);
        return () => clearInterval(t);
    }, [target]);
    return (
        <div className="card p-30 glass-card text-center grid gap-15">
            <h3>Event Countdown</h3>
            <input type="datetime-local" className="pill w-full" onChange={e=>setTarget(e.target.value)} />
            <div className="text-3xl font-mono">{left || 'Set Target'}</div>
        </div>
    );
};

export default Countdown;
