import React, { useState } from 'react';
import ToolResult from '../ToolResult';

const SpeedTest = () => {
    const [status, setStatus] = useState('ready');
    const [speed, setSpeed] = useState(null);

    const runTest = () => {
        setStatus('testing');
        const start = Date.now();
        // Simulate speed test by fetching a medium size image or just timing a fetch
        fetch('https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png', { cache: 'no-store' })
            .then(res => res.blob())
            .then(blob => {
                const end = Date.now();
                const duration = (end - start) / 1000;
                const sizeBits = blob.size * 8;
                const mbps = (sizeBits / duration) / 1000000;
                setSpeed(mbps.toFixed(2));
                setStatus('done');
            })
            .catch(() => setStatus('error'));
    };

    return (
        <div className="card p-30 glass-card text-center grid gap-20">
            <h3>Download Speed Test</h3>
            <div className="text-5xl font-mono">{speed ? `${speed} Mbps` : status === 'testing' ? '...' : '--'}</div>
            <button className="btn-primary w-full" onClick={runTest} disabled={status === 'testing'}>
                {status === 'testing' ? 'Testing...' : 'Run Speed Test'}
            </button>
            {status === 'error' && <div className="text-error">Speed test failed. Try again.</div>}
        </div>
    );
};

export default SpeedTest;
