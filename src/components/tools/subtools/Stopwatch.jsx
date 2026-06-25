import React, { useState, useEffect } from 'react';

const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    let interval;
    if (running) interval = setInterval(() => setTime(t => t + 10), 10);
    return () => clearInterval(interval);
  }, [running]);
  const format = (t) => {
    const ms = ("0" + (Math.floor(t / 10) % 100)).slice(-2);
    const s = ("0" + (Math.floor(t / 1000) % 60)).slice(-2);
    const m = ("0" + (Math.floor(t / 60000) % 60)).slice(-2);
    return `${m}:${s}.${ms}`;
  };
  return (
    <div className="card p-30 glass-card text-center grid gap-20">
      <h3>Stopwatch</h3>
      <div className="text-5xl font-mono">{format(time)}</div>
      <div className="flex-gap">
        <button className={`btn-${running?'warning':'primary'} flex-1`} onClick={()=>setRunning(!running)}>{running?'Stop':'Start'}</button>
        <button className="pill" onClick={()=>{setTime(0); setRunning(false);}}>Reset</button>
      </div>
    </div>
  );
};

export default Stopwatch;
