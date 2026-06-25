import React, { useState } from 'react';
import ToolResult from '../ToolResult';

const CronParser = () => {
    const [cron, setCron] = useState('* * * * *');
    const [result, setResult] = useState(null);

    const parseCron = () => {
        const parts = cron.split(' ');
        if (parts.length !== 5) {
            setResult({ error: 'Invalid Cron: Expected 5 parts (min hour day month dow)' });
            return;
        }

        const explain = [
            `Minute: ${parts[0] === '*' ? 'Every minute' : parts[0]}`,
            `Hour: ${parts[1] === '*' ? 'Every hour' : parts[1]}`,
            `Day of Month: ${parts[2] === '*' ? 'Every day' : parts[2]}`,
            `Month: ${parts[3] === '*' ? 'Every month' : parts[3]}`,
            `Day of Week: ${parts[4] === '*' ? 'Every day' : parts[4]}`
        ].join('\n');

        setResult({ text: explain });
    };

    return (
        <div className="grid gap-15 text-center">
            <h3>Cron Expression Parser</h3>
            <input className="pill w-full font-mono text-center" value={cron} onChange={e=>setCron(e.target.value)} />
            <button className="btn-primary w-full" onClick={parseCron}>Explain Cron</button>
            <ToolResult result={result} />
        </div>
    );
};

export default CronParser;
