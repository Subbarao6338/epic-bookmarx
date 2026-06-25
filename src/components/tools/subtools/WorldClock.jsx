import React, { useState, useEffect } from 'react';

const WorldClock = () => {
    const [time, setTime] = useState(new Date());
    useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
    const zones = [
        { name: 'London', tz: 'Europe/London' },
        { name: 'New York', tz: 'America/New_York' },
        { name: 'Tokyo', tz: 'Asia/Tokyo' },
        { name: 'India', tz: 'Asia/Kolkata' }
    ];
    return (
        <div className="grid grid-2-cols gap-15">
            {zones.map(z => (
                <div key={z.name} className="card p-20 glass-card text-center">
                    <div className="opacity-6 smallest uppercase">{z.name}</div>
                    <div className="text-xl font-mono">{time.toLocaleTimeString('en-US', { timeZone: z.tz })}</div>
                </div>
            ))}
        </div>
    );
};

export default WorldClock;
