import React, { useState } from 'react';

const DateDifference = () => {
    const [d1, setD1] = useState('');
    const [d2, setD2] = useState('');
    const [diff, setDiff] = useState(null);
    const calc = () => {
        if (!d1 || !d2) return;
        const ms = Math.abs(new Date(d2) - new Date(d1));
        setDiff(Math.ceil(ms / (1000 * 60 * 60 * 24)));
    };
    return (
        <div className="card p-30 glass-card grid gap-15 text-center">
            <h3>Date Difference</h3>
            <input type="date" className="pill w-full" onChange={e=>setD1(e.target.value)} />
            <input type="date" className="pill w-full" onChange={e=>setD2(e.target.value)} />
            <button className="btn-primary" onClick={calc}>Calculate</button>
            {diff !== null && <div className="text-2xl font-bold">{diff} Days</div>}
        </div>
    );
};

export default DateDifference;
