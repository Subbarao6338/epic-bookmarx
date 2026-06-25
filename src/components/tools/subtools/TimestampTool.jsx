import React, { useState } from 'react';

const TimestampTool = () => {
  const [ts, setTs] = useState(Math.floor(Date.now() / 1000));
  return (
    <div className="card p-30 glass-card grid gap-15 text-center">
      <h3>Unix Timestamp</h3>
      <div className="text-3xl font-mono p-20 bg-surface rounded-xl">{ts}</div>
      <div className="flex-gap">
        <button className="pill flex-1" onClick={()=>setTs(Math.floor(Date.now()/1000))}>Refresh</button>
        <button className="btn-primary flex-1" onClick={()=>navigator.clipboard.writeText(ts.toString())}>Copy</button>
      </div>
      <div className="smallest opacity-6">{new Date(ts * 1000).toString()}</div>
    </div>
  );
};

export default TimestampTool;
