import React, { useState } from 'react';
import ToolResult from '../ToolResult';

const AgentGenerate = ({ apiKey, knowledgeBase }) => {
    const [req, setReq] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleGenerate = async () => {
        if (!apiKey) return alert('OpenAI API Key required in Setup.');
        if (!req.trim()) return;
        setLoading(true);

        try {
            const keywords = req.toLowerCase().split(/\s+/).filter(w => w.length > 3);
            const context = (knowledgeBase || [])
                .filter(chunk => keywords.some(k => chunk.pageContent.toLowerCase().includes(k)))
                .slice(0, 10)
                .map(c => `[File: ${c.metadata?.filename || 'Context'}]\n${c.pageContent}`)
                .join('\n---\n');

            const prompt = `
            Context from codebase/documents:
            ${context || 'No specific context found.'}

            User Requirement:
            ${req}

            Task:
            Generate a detailed Test Plan or Test Cases in Markdown format based on the requirement and provided context.
            `.trim();

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
                body: JSON.stringify({
                    model: "gpt-4o",
                    messages: [
                        { role: "system", content: "You are an expert Software Test Architect and Senior QA Lead." },
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
            setResult({ text: content, filename: 'generated_test_plan.md' });
        } catch (e) {
            setResult({ error: e.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card p-30 glass-card grid gap-15">
            <h3>RAG-Enabled Test Generation</h3>
            <p className="smallest opacity-6">Generates deep test plans by combining your request with ingested knowledge.</p>
            <textarea className="pill w-full" rows="6" placeholder="Describe the feature or component to test..." value={req} onChange={e=>setReq(e.target.value)} />
            <button className="btn-primary w-full" onClick={handleGenerate} disabled={loading}>{loading ? 'Analyzing & Generating...' : 'Generate Comprehensive Tests'}</button>
            <ToolResult result={result} />
        </div>
    );
};

export default AgentGenerate;
