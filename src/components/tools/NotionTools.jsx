import React, { useState, useEffect, useCallback } from 'react';
import ToolResult from './ToolResult';

const NotionTools = ({ onSubtoolChange }) => {
    const tabs = [
        { id: 'ingest', label: 'Document Ingestion' },
        { id: 'folder', label: 'Folder Scanner' },
        { id: 'scraper', label: 'Web to Notion' },
        { id: 'history', label: 'Task History' },
        { id: 'setup', label: 'Notion Setup' }
    ];

    const [activeTab, setActiveTab] = useState('ingest');
    const [token, setToken] = useState(localStorage.getItem('hub_notion_token') || '');
    const [workspaceId, setWorkspaceId] = useState(localStorage.getItem('hub_notion_workspace') || '');
    const [dbId, setDbId] = useState(localStorage.getItem('hub_notion_db') || '');
    const [jobStatus, setJobStatus] = useState({ status: 'idle', message: '' });

    useEffect(() => {
        const current = tabs.find(t => t.id === activeTab);
        if (current && onSubtoolChange) onSubtoolChange(current.label);
    }, [activeTab]);

    const fetchStatus = useCallback(async () => {
        try {
            const res = await fetch('/api/notion/status');
            const data = await res.json();
            setJobStatus(data);
        } catch (e) {}
    }, []);

    useEffect(() => {
        let interval;
        if (jobStatus.status === 'running') {
            interval = setInterval(fetchStatus, 2000);
        }
        return () => clearInterval(interval);
    }, [jobStatus.status, fetchStatus]);

    useEffect(() => {
        fetchStatus();
    }, [fetchStatus]);

    return (
        <div className="tool-form mt-20">
            <div className="pill-group mb-20 scrollable-x">
                {tabs.map(tab => (
                    <button key={tab.id} className={`pill ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {jobStatus.status === 'running' && (
                <div className="card p-15 mb-20 glass-card flex align-center justify-between border-primary">
                    <div className="flex align-center gap-10">
                        <div className="spinner-small" />
                        <span className="small">{jobStatus.message}</span>
                    </div>
                    <button className="pill btn-danger text-xs" onClick={() => fetch('/api/notion/stop', {method:'POST'}).then(fetchStatus)}>Stop</button>
                </div>
            )}

            <div className="hub-content animate-fadeIn">
                {activeTab === 'setup' && (
                    <div className="card p-30 glass-card grid gap-15">
                        <h3>Notion Configuration</h3>
                        <div className="form-group">
                            <label>Notion API Token</label>
                            <input type="password" title="Notion Token" className="pill w-full" value={token} onChange={e => setToken(e.target.value)} placeholder="secret_..." />
                        </div>
                        <div className="form-group">
                            <label>Default Parent Page ID</label>
                            <input type="text" title="Workspace ID" className="pill w-full" value={workspaceId} onChange={e => setWorkspaceId(e.target.value)} placeholder="32-char ID" />
                        </div>
                        <div className="form-group">
                            <label>Default Database ID (Optional)</label>
                            <input type="text" className="pill w-full" value={dbId} onChange={e => setDbId(e.target.value)} placeholder="32-char ID" />
                        </div>
                        <button className="btn-primary w-full" onClick={() => {
                            localStorage.setItem('hub_notion_token', token);
                            localStorage.setItem('hub_notion_workspace', workspaceId);
                            localStorage.setItem('hub_notion_db', dbId);
                            alert('Settings Saved!');
                        }}>Save Configuration</button>
                    </div>
                )}
                {activeTab === 'ingest' && <NotionIngest token={token} workspaceId={workspaceId} defaultDb={dbId} />}
                {activeTab === 'folder' && <NotionFolderScanner token={token} workspaceId={workspaceId} defaultDb={dbId} jobRunning={jobStatus.status === 'running'} onStart={fetchStatus} />}
                {activeTab === 'scraper' && <NotionScraper token={token} workspaceId={workspaceId} jobRunning={jobStatus.status === 'running'} onStart={fetchStatus} />}
                {activeTab === 'history' && <NotionHistory />}
            </div>
        </div>
    );
};

const NotionIngest = ({ token, workspaceId, defaultDb }) => {
    const [file, setFile] = useState(null);
    const [dbId, setDbId] = useState(defaultDb);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleUpload = async () => {
        if (!file || !token || !workspaceId) return alert('Complete setup first.');
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('token', token);
        formData.append('workspace_id', workspaceId);
        if (dbId) formData.append('database_id', dbId);

        try {
            const response = await fetch('/api/notion/upload', { method: 'POST', body: formData });
            const data = await response.json();
            if (data.success) setResult({ text: `Ingested! Page ID: ${data.page_id}` });
            else throw new Error(data.detail || 'Failed');
        } catch (err) { setResult({ error: err.message }); } finally { setLoading(false); }
    };

    return (
        <div className="card p-30 glass-card grid gap-15">
            <h3>Single File Ingestion</h3>
            <div className="form-group">
                <label>Target Database ID (Optional override)</label>
                <input type="text" className="pill w-full mb-10" value={dbId} onChange={e=>setDbId(e.target.value)} placeholder="Leave blank for Page ingestion" />
            </div>
            <div className="file-input-wrapper">
                <input type="file" id="notion-file" onChange={e => setFile(e.target.files[0])} />
                <label htmlFor="notion-file" className="file-input-label">{file ? file.name : 'Choose File'}</label>
            </div>
            <button className="btn-primary w-full" onClick={handleUpload} disabled={loading}>{loading ? 'Processing...' : 'Ingest to Notion'}</button>
            <ToolResult result={result} />
        </div>
    );
};

const NotionFolderScanner = ({ token, workspaceId, defaultDb, jobRunning, onStart }) => {
    const [path, setPath] = useState('');
    const [dbId, setDbId] = useState(defaultDb);
    const [result, setResult] = useState(null);

    const handleScan = async () => {
        if (!path || !token || !workspaceId) return alert('Path and Setup required.');
        const fd = new FormData();
        fd.append('folder_path', path);
        fd.append('token', token);
        fd.append('workspace_id', workspaceId);
        if (dbId) fd.append('database_id', dbId);

        try {
            const res = await fetch('/api/notion/scan-folder', { method: 'POST', body: fd });
            const data = await res.json();
            if (data.started) {
                setResult({ text: 'Folder scan started in background.' });
                onStart();
            } else throw new Error(data.message);
        } catch (e) { setResult({ error: e.message }); }
    };

    return (
        <div className="card p-30 glass-card grid gap-15">
            <h3>Recursive Folder Scanner</h3>
            <p className="smallest opacity-6">Scans a server-side or local absolute path for all documents.</p>
            <input type="text" className="pill w-full" placeholder="Absolute Folder Path (e.g. /home/user/docs)" value={path} onChange={e=>setPath(e.target.value)} />
            <input type="text" className="pill w-full" placeholder="Target Database ID (Optional)" value={dbId} onChange={e=>setDbId(e.target.value)} />
            <button className="btn-primary w-full" onClick={handleScan} disabled={jobRunning}>{jobRunning ? 'Job in Progress' : 'Start Recursive Ingestion'}</button>
            <ToolResult result={result} />
        </div>
    );
};

const NotionScraper = ({ token, workspaceId, jobRunning, onStart }) => {
    const [url, setUrl] = useState('');
    const [loginUrl, setLoginUrl] = useState('');
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [fullCrawl, setFullCrawl] = useState(false);
    const [result, setResult] = useState(null);

    const handleScrape = async () => {
        if (!url || !token || !workspaceId) return alert('URL and Setup required.');
        const fd = new FormData();
        fd.append('url', url);
        fd.append('token', token);
        fd.append('workspace_id', workspaceId);
        fd.append('username', user);
        fd.append('password', pass);
        fd.append('login_url', loginUrl);
        fd.append('full_crawl', fullCrawl);

        try {
            const response = await fetch('/api/notion/start-scrape', { method: 'POST', body: fd });
            const data = await response.json();
            if (data.started) {
                setResult({ text: 'Scraping job started in background.' });
                onStart();
            } else throw new Error(data.message);
        } catch (err) { setResult({ error: err.message }); }
    };

    return (
        <div className="card p-30 glass-card grid gap-15">
            <h3>Advanced Web Scraper</h3>
            <input type="text" className="pill" placeholder="Target URL" value={url} onChange={e=>setUrl(e.target.value)} />

            <div className="grid grid-2-cols gap-10">
                <div className="form-group">
                    <label className="smallest">Username (Optional)</label>
                    <input type="text" className="pill w-full" value={user} onChange={e=>setUser(e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="smallest">Password (Optional)</label>
                    <input type="password" title="password" className="pill w-full" value={pass} onChange={e=>setPass(e.target.value)} />
                </div>
            </div>
            <input type="text" className="pill" placeholder="Login URL (if auth required)" value={loginUrl} onChange={e=>setLoginUrl(e.target.value)} />

            <label className="flex align-center gap-10 pointer mt-5">
                <input type="checkbox" checked={fullCrawl} onChange={e=>setFullCrawl(e.target.checked)} />
                <span className="small">Enable Full Domain Crawl (Deep Backup)</span>
            </label>

            <button className="btn-primary w-full mt-10" onClick={handleScrape} disabled={jobRunning}>{jobRunning ? 'Scraping...' : 'Start Backup to Notion'}</button>
            <ToolResult result={result} />
        </div>
    );
};

const NotionHistory = () => {
    const [history, setHistory] = useState([]);
    const fetchHistory = useCallback(async () => {
        try {
            const res = await fetch('/api/notion/history');
            const data = await res.json();
            setHistory(data);
        } catch (e) {}
    }, []);

    useEffect(() => { fetchHistory(); }, [fetchHistory]);

    return (
        <div className="grid gap-10">
            <div className="flex justify-between align-center px-10">
                <h3>Recent Tasks</h3>
                <button className="pill text-xs" onClick={() => fetch('/api/notion/clear-history', {method:'POST'}).then(fetchHistory)}>Clear</button>
            </div>
            {history.length === 0 ? (
                <div className="card p-30 text-center opacity-6 glass-card">No history available</div>
            ) : (
                history.map(item => (
                    <div key={item.id} className="card p-15 glass-card flex justify-between align-center">
                        <div>
                            <div className="flex align-center gap-10">
                                <span className={`badge ${item.status === 'success' ? 'badge-success' : item.status === 'failed' ? 'badge-danger' : ''}`}>
                                    {item.type}
                                </span>
                                <span className="small font-bold">{item.details}</span>
                            </div>
                            <div className="smallest opacity-5 mt-5">{item.timestamp}</div>
                        </div>
                        <div className={`smallest font-bold ${item.status === 'success' ? 'color-success' : 'color-danger'}`}>
                            {item.status.toUpperCase()}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default NotionTools;
