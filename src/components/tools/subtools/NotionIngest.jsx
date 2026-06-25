import React, { useState } from 'react';
import ToolResult from '../ToolResult';

const NotionIngest = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleUpload = async () => {
        const token = localStorage.getItem('hub_notion_token');
        const workspaceId = localStorage.getItem('hub_notion_workspace');
        if (!token) return alert('Configure Notion Token in Setup first.');
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('token', token);
        formData.append('workspace_id', workspaceId || '');

        try {
            const res = await fetch('/api/notion/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (res.ok) {
                setResult({ text: `Successfully ingested "${file.name}" into Notion.\nPage ID: ${data.page_id}` });
            } else {
                throw new Error(data.detail || 'Upload failed');
            }
        } catch (e) {
            setResult({ error: e.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card p-30 glass-card text-center grid gap-15">
            <h3>Notion Document Ingest</h3>
            <p className="smallest opacity-6">Convert any document (PDF, DOCX, etc.) into a structured Notion page.</p>
            <div className="file-input-wrapper">
                <input type="file" id="notion-file" onChange={e => setFile(e.target.files[0])} />
                <label htmlFor="notion-file" className="file-input-label">{file ? file.name : 'Choose Document'}</label>
            </div>
            <button className="btn-primary w-full" onClick={handleUpload} disabled={loading}>{loading ? 'Ingesting...' : 'Import to Notion'}</button>
            <ToolResult result={result} />
        </div>
    );
};

export default NotionIngest;
