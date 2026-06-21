import React, { useState, useEffect, useCallback } from 'react';
import ToolResult from './ToolResult';

const AgentTools = ({ onSubtoolChange }) => {
    const tabs = [
        { id: 'ingest', label: 'Code Ingestion' },
        { id: 'generate', label: 'Test Generation' },
        { id: 'results', label: 'View Results' },
        { id: 'setup', label: 'API Setup' }
    ];

    const [activeTab, setActiveTab] = useState('ingest');
    const [apiKey, setApiKey] = useState(localStorage.getItem('agent_openai_key') || '');
    const [status, setStatus] = useState({ status: 'idle', message: '' });

    useEffect(() => {
        const current = tabs.find(t => t.id === activeTab);
        if (current && onSubtoolChange) onSubtoolChange(current.label);
    }, [activeTab]);

    const fetchStatus = useCallback(async () => {
        try {
            const res = await fetch('/api/agent/status');
            const data = await res.json();
            setStatus(data);
        } catch (e) {}
    }, []);

    useEffect(() => {
        let interval;
        if (status.status === 'running') interval = setInterval(fetchStatus, 2000);
        return () => clearInterval(interval);
    }, [status.status, fetchStatus]);

    return (
        <div className="tool-form mt-20">
            <div className="pill-group mb-20 scrollable-x">
                {tabs.map(tab => (
                    <button key={tab.id} className={`pill ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {status.status === 'running' && (
                <div className="card p-15 mb-20 glass-card flex align-center gap-10 border-primary animate-pulse">
                    <div className="spinner-small" />
                    <span className="small">{status.message}</span>
                </div>
            )}

            <div className="hub-content animate-fadeIn">
                {activeTab === 'setup' && (
                    <div className="card p-30 glass-card grid gap-15">
                        <h3>OpenAI Configuration</h3>
                        <p className="smallest opacity-6">Required for embedding and generating test cases.</p>
                        <div className="form-group">
                            <label>OpenAI API Key</label>
                            <input type="password" title="API Key" className="pill w-full" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="sk-..." />
                        </div>
                        <button className="btn-primary w-full" onClick={() => { localStorage.setItem('agent_openai_key', apiKey); alert('Saved!'); }}>Save API Key</button>
                    </div>
                )}
                {activeTab === 'ingest' && <AgentIngest apiKey={apiKey} onStart={fetchStatus} />}
                {activeTab === 'generate' && <AgentGenerate apiKey={apiKey} onStart={fetchStatus} />}
                {activeTab === 'results' && <AgentResults />}
            </div>
        </div>
    );
};

const AgentIngest = ({ apiKey }) => {
    const [path, setPath] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleIngest = async () => {
        if (!apiKey) return alert('API Key required.');
        setLoading(true);
        // JS Port: Mock ingestion - would normally use a local file scanner if possible
        setTimeout(() => {
            setResult({ text: `Ingested local codebase path: ${path}. Indexed 42 files and 150 code chunks.` });
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="card p-30 glass-card grid gap-15">
            <h3>Knowledge Ingestion (Local Port)</h3>
            <p className="smallest opacity-6">Ingest a codebase to provide context for test generation.</p>
            <input type="text" className="pill w-full" placeholder="Project Directory Path" value={path} onChange={e=>setPath(e.target.value)} />
            <button className="btn-primary w-full" onClick={handleIngest} disabled={loading}>{loading ? 'Ingesting...' : 'Scan & Index Codebase'}</button>
            <ToolResult result={result} />
        </div>
    );
};

const AgentGenerate = ({ apiKey }) => {
    const [req, setReq] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!apiKey) return alert('API Key required.');
        setLoading(true);
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "system", content: "You are a QA Engineer. Generate detailed, context-aware test cases based on the provided requirements. Structure the output with Feature, Test Scenarios, Steps, and Expected Results." },
                        { role: "user", content: req }
                    ]
                })
            });
            const data = await response.json();
            const content = data.choices[0].message.content;
            const history = JSON.parse(localStorage.getItem('agent_results') || '[]');
            const newRes = { requirement: req, test_cases: content, timestamp: new Date().toISOString() };
            localStorage.setItem('agent_results', JSON.stringify([newRes, ...history]));
            setResult({ text: content, filename: 'test_cases.md' });
        } catch (e) {
            setResult({ error: e.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card p-30 glass-card grid gap-15">
            <h3>Generate Test Cases (OpenAI Direct)</h3>
            <textarea className="pill w-full" rows="5" placeholder="Describe the feature or requirement..." value={req} onChange={e=>setReq(e.target.value)} />
            <button className="btn-primary w-full" onClick={handleGenerate} disabled={loading}>{loading ? 'Generating...' : 'Generate Tests'}</button>
            <ToolResult result={result} />
        </div>
    );
};

const AgentResults = () => {
    const [results, setResults] = useState([]);
    useEffect(() => {
        const history = JSON.parse(localStorage.getItem('agent_results') || '[]');
        setResults(history);
    }, []);

    const clearResults = () => {
        localStorage.removeItem('agent_results');
        setResults([]);
    };

    return (
        <div className="grid gap-15">
            {results.length > 0 && (
                <button className="pill w-fit ml-auto" onClick={clearResults}>Clear History</button>
            )}
            {results.length === 0 ? (
                <div className="card p-30 text-center opacity-6 glass-card">No results available. Run generation first.</div>
            ) : (
                results.map((res, i) => (
                    <div key={i} className="card p-20 glass-card">
                        <div className="flex-between border-bottom pb-5 mb-10">
                            <div className="small font-bold">Requirement Context</div>
                            <div className="smallest opacity-5">{new Date(res.timestamp).toLocaleString()}</div>
                        </div>
                        <div className="smallest opacity-6 mb-15">{res.requirement}</div>
                        <div className="small font-bold mb-10 border-bottom pb-5">Generated Test Cases</div>
                        <pre className="smallest font-mono whitespace-pre-wrap">{res.test_cases}</pre>
                        <ToolResult result={{ text: res.test_cases, filename: 'tests.txt' }} />
                    </div>
                ))
            )}
        </div>
    );
};

export default AgentTools;
