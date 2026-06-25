import React, { useState } from 'react';
import ToolResult from '../ToolResult';

const MockDataGenerator = () => {
    const [res, setRes] = useState(null);
    const gen = () => {
        const d = Array.from({length:10}, (_,i)=>({id:i+1, name:`User ${i+1}`, email:`user${i+1}@example.com`, status: ['Active', 'Pending', 'Inactive'][i%3]}));
        setRes({ text: JSON.stringify(d, null, 2), filename: 'mock_users.json' });
    };
    return (<div className="card p-30 glass-card text-center grid gap-15"><h3>Mock Data Generation</h3><button className="btn-primary" onClick={gen}>Generate Sample Users</button><ToolResult result={res} /></div>);
};

export default MockDataGenerator;
