import React, { useState, useEffect, useCallback } from 'react';
import ToolResult from './ToolResult';

const AgentTools = ({ toolId, onSubtoolChange }) => {
    const tabs = [
        { id: 'ingest', label: 'Code Ingestion' },
        { id: 'generate', label: 'Test Generation' },
        { id: 'results', label: 'View Results' },
        { id: 'setup', label: 'API Setup' }
    ];

    const [activeTab, setActiveTab] = useState('ingest');
    const [apiKey, setApiKey] = useState(localStorage.getItem('agent_openai_key') || '');
    const [knowledgeBase, setKnowledgeBase] = useState(JSON.parse(localStorage.getItem('agent_knowledge_base') || '[]'));
    const [status, setStatus] = useState({ status: 'idle', message: '' });

    useEffect(() => {
        const current = tabs.find(t => t.id === activeTab);
        if (current && onSubtoolChange) onSubtoolChange(current.label);
    }, [activeTab, onSubtoolChange, tabs]);

    useEffect(() => {
        if (toolId) {
            const mapping = { 'ingest': 'ingest', 'generate': 'generate', 'results': 'results', 'setup': 'setup' };
            if (mapping[toolId]) setActiveTab(mapping[toolId]);
        }
    }, [toolId]);

    const handleClearKnowledge = () => {
        setKnowledgeBase([]);
        localStorage.removeItem('agent_knowledge_base');
    };

    return (
        <div className="tool-form mt-20">
            <div className="pill-group mb-20 scrollable-x">
                {tabs.map(tab => (
                    <button key={tab.id} className={`pill ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="hub-content animate-fadeIn">
                {activeTab === 'setup' && (
                    <div className="card p-30 glass-card grid gap-15">
                        <h3>Agent Intelligence Setup</h3>
                        <p className="smallest opacity-6">Required for embedding and generating test cases (gpt-4o).</p>
                        <div className="form-group">
                            <label>OpenAI API Key</label>
                            <input type="password" title="API Key" className="pill w-full" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="sk-..." />
                        </div>
                        <button className="btn-primary w-full" onClick={() => { localStorage.setItem('agent_openai_key', apiKey); alert('Saved!'); }}>Save API Key</button>
                    </div>
                )}
                {activeTab === 'ingest' && <AgentIngest setKB={setKnowledgeBase} onClear={handleClearKnowledge} currentKB={knowledgeBase} />}
                {activeTab === 'generate' && <AgentGenerate apiKey={apiKey} knowledgeBase={knowledgeBase} />}
                {activeTab === 'results' && <AgentResults />}
            </div>
        </div>
    );
};

const AgentIngest = ({ setKB, onClear, currentKB }) => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
    };

    const processFiles = async () => {
        if (files.length === 0) return alert('Select files first.');
        setLoading(true);
        setResult(null);

        const formData = new FormData();
        files.forEach(file => formData.append('files', file));

        try {
            const response = await fetch('/api/agent/ingest', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (data.success) {
                const updatedKB = [...currentKB, ...data.chunks];
                setKB(updatedKB);
                localStorage.setItem('agent_knowledge_base', JSON.stringify(updatedKB));
                setResult({ text: `Ingested ${files.length} files with full format support (PDF, DOCX, PPTX, OCR, etc.). Total chunks: ${updatedKB.length}` });
            } else {
                throw new Error(data.detail || 'Ingestion failed');
            }
        } catch (e) {
            setResult({ error: e.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid gap-15">
            <div className="card p-30 glass-card grid gap-15">
                <h3>Multi-Format Knowledge Ingestion</h3>
                <p className="smallest opacity-6">Upload Code, PDF, DOCX, PPTX, or Images. Our backend engine will extract and chunk the content for RAG.</p>
                <div className="file-input-wrapper">
                    <input type="file" id="agent-files" multiple onChange={handleFileChange} />
                    <label htmlFor="agent-files" className="file-input-label">{files.length > 0 ? `${files.length} files selected` : 'Select Files'}</label>
                </div>
                <div className="flex-gap">
                    <button className="btn-primary flex-1" onClick={processFiles} disabled={loading}>{loading ? 'Indexing...' : 'Scan & Index Knowledge'}</button>
                    <button className="pill" onClick={onClear} disabled={loading}>Clear Knowledge</button>
                </div>
                <ToolResult result={result} />
            </div>
            {currentKB.length > 0 && (
                <div className="card p-20 glass-card animate-fadeIn">
                    <div className="small font-bold mb-10">Knowledge Base Status</div>
                    <div className="flex-between smallest">
                        <span>Indexed Chunks:</span>
                        <span className="badge badge-primary">{currentKB.length}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

const AgentGenerate = ({ apiKey, knowledgeBase }) => {
    const [req, setReq] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleGenerate = async () => {
        if (!apiKey) return alert('API Key required in Setup.');
        setLoading(true);

        try {
            const keywords = req.toLowerCase().split(/\s+/).filter(w => w.length > 3);
            const context = knowledgeBase
                .filter(chunk => keywords.some(k => chunk.pageContent.toLowerCase().includes(k)))
                .slice(0, 8)
                .map(c => `[Context: ${c.metadata.filename || 'Unknown'}]\n${c.pageContent}`)
                .join('\n---\n');

            const prompt = `
Context from Knowledge Base:
${context || 'No specific context found.'}

User Requirement:
${req}

Task:
Generate a comprehensive Test Plan in Markdown format.
            `.trim();

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
                body: JSON.stringify({
                    model: "gpt-4o",
                    messages: [
                        { role: "system", content: "You are a Senior QA Engineer and Test Architect." },
                        { role: "user", content: prompt }
                    ]
                })
            });

            const data = await response.json();
            if (data.error) throw new Error(data.error.message);

            const content = data.choices[0].message.content;
            const history = JSON.parse(localStorage.getItem('agent_results') || '[]');
            const newRes = { requirement: req, test_cases: content, timestamp: new Date().toISOString() };
            localStorage.setItem('agent_results', JSON.stringify([newRes, ...history]));
            setResult({ text: content, filename: 'test_plan.md' });
        } catch (e) {
            setResult({ error: e.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card p-30 glass-card grid gap-15">
            <h3>Generate Test Plan (RAG-Enabled)</h3>
            <textarea className="pill w-full" rows="6" placeholder="Describe the feature..." value={req} onChange={e=>setReq(e.target.value)} />
            <button className="btn-primary w-full" onClick={handleGenerate} disabled={loading}>{loading ? 'Thinking...' : 'Generate Tests'}</button>
            <ToolResult result={result} />
        </div>
    );
};

const AgentResults = () => {
    const [results, setResults] = useState([]);
    useEffect(() => { setResults(JSON.parse(localStorage.getItem('agent_results') || '[]')); }, []);
    return (
        <div className="grid gap-15">
            {results.length > 0 && <button className="pill w-fit ml-auto" onClick={() => { localStorage.removeItem('agent_results'); setResults([]); }}>Clear</button>}
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
        </div>
    );
};

export default AgentTools;
