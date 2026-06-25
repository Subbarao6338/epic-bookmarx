import React, { useState, useEffect } from 'react';

const Pomodoro = () => {
    const [time, setTime] = useState(25 * 60);
    const [active, setActive] = useState(false);
    useEffect(() => {
        let timer;
        if (active && time > 0) timer = setInterval(() => setTime(t => t - 1), 1000);
        else if (time === 0) setActive(false);
        return () => clearInterval(timer);
    }, [active, time]);
    return (
        <div className="card p-30 glass-card text-center grid gap-15">
            <h3>Focus Timer</h3>
            <div className="text-5xl font-mono">{Math.floor(time/60)}:{("0"+(time%60)).slice(-2)}</div>
            <button className="btn-primary" onClick={()=>setActive(!active)}>{active?'Pause':'Focus'}</button>
            <div className="flex-gap">
                <button className="pill" onClick={()=>{setTime(25*60); setActive(false);}}>Work</button>
                <button className="pill" onClick={()=>{setTime(5*60); setActive(false);}}>Break</button>
            </div>
        </div>
    );
};

export default Pomodoro;
