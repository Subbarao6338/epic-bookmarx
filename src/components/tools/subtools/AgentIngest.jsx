import React, { useState, useEffect } from 'react';
import ToolResult from '../ToolResult';

const AgentIngest = ({ setKB, currentKB }) => {
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
                const updatedKB = [...(currentKB || []), ...data.chunks];
                if (setKB) setKB(updatedKB);
                localStorage.setItem('agent_knowledge_base', JSON.stringify(updatedKB));
                setResult({ text: `Ingested ${files.length} files successfully. Total indexed chunks: ${updatedKB.length}` });
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
        <div className="card p-30 glass-card grid gap-15">
            <h3>Code & Doc Ingestion</h3>
            <p className="smallest opacity-6">Upload source code, PDF, or text files to build the agent's context.</p>
            <div className="file-input-wrapper">
                <input type="file" id="agent-files" multiple onChange={handleFileChange} />
                <label htmlFor="agent-files" className="file-input-label">{files.length > 0 ? `${files.length} files selected` : 'Choose Files'}</label>
            </div>
            <button className="btn-primary w-full" onClick={processFiles} disabled={loading}>{loading ? 'Processing...' : 'Build Knowledge Base'}</button>
            <ToolResult result={result} />
        </div>
    );
};

export default AgentIngest;
