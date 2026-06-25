import React, { useState } from 'react';
import ToolResult from '../ToolResult';

const NotionFolderSync = () => {
    const [path, setPath] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);

    const startSync = async () => {
        const token = localStorage.getItem('hub_notion_token');
        const workspaceId = localStorage.getItem('hub_notion_workspace');
        if (!token) return alert('Setup Notion Token first.');
        if (!path) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('folder_path', path);
        formData.append('token', token);
        formData.append('workspace_id', workspaceId || '');

        try {
            const res = await fetch('/api/notion/scan-folder', { method: 'POST', body: formData });
            const data = await res.json();
            setStatus(data.started ? "Synchronization started in background." : data.message);
        } catch (e) {
            setStatus("Error starting sync.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card p-30 glass-card text-center grid gap-15">
            <h3>Folder Sync Engine</h3>
            <p className="smallest opacity-6">Mirror a local or network directory into a Notion database.</p>
            <input className="pill w-full font-mono" placeholder="/path/to/my/documents" value={path} onChange={e=>setPath(e.target.value)} />
            <button className="btn-primary w-full" onClick={startSync} disabled={loading}>Run Folder Sync</button>
            {status && <div className="smallest opacity-6 mt-10">{status}</div>}
        </div>
    );
};

export default NotionFolderSync;
