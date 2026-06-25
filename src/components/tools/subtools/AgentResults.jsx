import React, { useState, useEffect } from 'react';
import ToolResult from '../ToolResult';

const AgentResults = () => {
    const [results, setResults] = useState([]);
    useEffect(() => { setResults(JSON.parse(localStorage.getItem('agent_results') || '[]')); }, []);
    return (
        <div className="grid gap-15">
            {results.length > 0 && <button className="pill w-fit ml-auto" onClick={() => { localStorage.removeItem('agent_results'); setResults([]); }}>Clear History</button>}
            {results.map((res, i) => (
                <div key={i} className="card p-20 glass-card">
                    <div className="flex-between border-bottom pb-5 mb-10">
                        <div className="small font-bold">{res.requirement.slice(0, 50)}...</div>
                        <div className="smallest opacity-5">{new Date(res.timestamp).toLocaleString()}</div>
                    </div>
                    <pre className="smallest font-mono whitespace-pre-wrap" style={{maxHeight:'300px', overflow:'auto'}}>{res.test_cases}</pre>
                    <ToolResult result={{ text: res.test_cases, filename: `test_plan_${i}.md` }} />
                </div>
            ))}
            {results.length === 0 && <div className="text-center p-40 opacity-5">No generated plans yet.</div>}
        </div>
    );
};

export default AgentResults;
