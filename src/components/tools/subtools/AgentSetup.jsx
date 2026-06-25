import React, { useState } from 'react';

const AgentSetup = ({ apiKey, setApiKey, onClearKB }) => {
    return (
        <div className="card p-30 glass-card grid gap-15">
            <h3>Agent Intelligence Setup</h3>
            <p className="smallest opacity-6">Required for embedding and generating test cases (gpt-4o).</p>
            <div className="form-group">
                <label>OpenAI API Key</label>
                <input type="password" title="API Key" className="pill w-full" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="sk-..." />
            </div>
            <div className="flex-gap">
                <button className="btn-primary flex-1" onClick={() => { localStorage.setItem('agent_openai_key', apiKey); alert('Saved!'); }}>Save API Key</button>
                <button className="pill" onClick={onClearKB}>Clear Local KB</button>
            </div>
        </div>
    );
};

export default AgentSetup;
