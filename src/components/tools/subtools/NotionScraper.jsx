import React, { useState, useEffect } from 'react';
import ToolResult from '../ToolResult';

const NotionScraper = () => {
    const [url, setUrl] = useState('');
    const [status, setStatus] = useState({ status: 'idle', message: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let interval;
        if (loading) {
            interval = setInterval(async () => {
                const res = await fetch('/api/notion/status');
                const data = await res.json();
                setStatus(data);
                if (data.status !== 'running') {
                    setLoading(false);
                    clearInterval(interval);
                }
            }, 2000);
        }
        return () => clearInterval(interval);
    }, [loading]);

    const startScrape = async () => {
        const token = localStorage.getItem('hub_notion_token');
        const workspaceId = localStorage.getItem('hub_notion_workspace');
        if (!token) return alert('Setup Notion Token first.');
        if (!url) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('url', url);
        formData.append('token', token);
        formData.append('workspace_id', workspaceId || '');

        try {
            await fetch('/api/notion/start-scrape', { method: 'POST', body: formData });
        } catch (e) {
            setLoading(false);
        }
    };

    const stopScrape = async () => {
        await fetch('/api/notion/stop', { method: 'POST' });
    };

    return (
        <div className="card p-30 glass-card text-center grid gap-15">
            <h3>Web to Notion Scraper</h3>
            <p className="smallest opacity-6">Crawl websites and automatically save content into your Notion workspace.</p>
            <input className="pill w-full" placeholder="https://example.com/blog" value={url} onChange={e=>setUrl(e.target.value)} />
            <div className="flex-gap">
                <button className="btn-primary flex-1" onClick={startScrape} disabled={loading}>Start Crawling</button>
                {loading && <button className="btn-warning" onClick={stopScrape}>Stop</button>}
            </div>
            {status.message && (
                <div className="p-10 bg-surface rounded-lg smallest font-mono mt-10">
                    <div className="flex-between mb-5">
                        <span className="uppercase opacity-6">Status: {status.status}</span>
                        {loading && <span className="rotating material-icons" style={{fontSize: '1rem'}}>sync</span>}
                    </div>
                    {status.message}
                </div>
            )}
        </div>
    );
};

export default NotionScraper;
