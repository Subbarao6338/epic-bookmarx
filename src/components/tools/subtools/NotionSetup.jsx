import React, { useState } from 'react';

const NotionSetup = () => {
    const [token, setToken] = useState(localStorage.getItem('hub_notion_token') || '');
    const [workspace, setWorkspace] = useState(localStorage.getItem('hub_notion_workspace') || '');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/notion/validate?token=${token}`);
            const data = await res.json();
            if (data.valid) {
                localStorage.setItem('hub_notion_token', token);
                localStorage.setItem('hub_notion_workspace', workspace);
                alert('Connection validated and saved!');
            } else {
                alert('Invalid Token: ' + (data.error || 'Check your token.'));
            }
        } catch (e) {
            alert('Validation failed. Please check backend connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card p-30 glass-card grid gap-15">
            <h3>Notion Integration Setup</h3>
            <div className="form-group">
                <label>Internal Integration Token</label>
                <input type="password" value={token} onChange={e=>setToken(e.target.value)} className="pill w-full" placeholder="secret_..." />
            </div>
            <div className="form-group">
                <label>Workspace ID (Optional)</label>
                <input value={workspace} onChange={e=>setWorkspace(e.target.value)} className="pill w-full" placeholder="my-workspace" />
            </div>
            <button className="btn-primary w-full" onClick={handleSave} disabled={loading}>{loading ? 'Validating...' : 'Connect & Save'}</button>
            <p className="smallest opacity-6 text-center">Create a token at <a href="https://www.notion.so/my-integrations" target="_blank" rel="noreferrer">notion.so/my-integrations</a></p>
        </div>
    );
};

export default NotionSetup;
