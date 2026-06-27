import React, { useState } from 'react';
import ToolResult from '../ToolResult';

const SocialDownloader = () => {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [summarizing, setSummarizing] = useState(false);
    const [data, setData] = useState(null);
    const [result, setResult] = useState(null);
    const [summary, setSummary] = useState(null);

    const fetchInfo = async () => {
        if (!url) return;
        setLoading(true);
        setData(null);
        setResult(null);
        setSummary(null);
        try {
            const res = await fetch(`/api/social/info?url=${encodeURIComponent(url)}`);
            const json = await res.json();
            if (res.ok) {
                setData(json);
            } else {
                throw new Error(json.detail || 'Failed to fetch media info.');
            }
        } catch (e) {
            setResult({ error: e.message });
        } finally {
            setLoading(false);
        }
    };

    const downloadFormat = async (formatId, ext) => {
        try {
            const res = await fetch(`/api/social/download?url=${encodeURIComponent(url)}&format_id=${formatId}`);
            const json = await res.json();
            if (res.ok && json.url) {
                // Try to trigger download
                const link = document.createElement('a');
                link.href = json.url;
                link.download = json.filename || `video.${ext}`;
                link.target = '_blank';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                setResult({ text: `Download started for ${formatId} (${ext}). If it opens in a new tab, right-click and 'Save As'.` });
            } else {
                throw new Error(json.detail || 'Failed to get download link.');
            }
        } catch (e) {
            setResult({ error: e.message });
        }
    };

    const formatSize = (bytes) => {
        if (!bytes) return 'Unknown size';
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        return `${size.toFixed(1)} ${units[unitIndex]}`;
    };

    const summarizeVideo = async () => {
        if (!url) return;
        setSummarizing(true);
        setSummary(null);
        try {
            const res = await fetch(`/api/social/summarize?url=${encodeURIComponent(url)}`);
            const json = await res.json();
            if (json.success) {
                setSummary(json.summary);
            } else {
                setResult({ error: json.message || 'Failed to summarize video.' });
            }
        } catch (e) {
            setResult({ error: e.message });
        } finally {
            setSummarizing(false);
        }
    };

    return (
        <div className="card p-30 glass-card text-center grid gap-15">
            <h3>Social Media Downloader</h3>
            <p className="smallest opacity-6">Download videos and audio from various social platforms.</p>
            <div className="flex gap-10">
                <input className="pill w-full" placeholder="Paste Video URL (YouTube, Twitter, etc.)..." value={url} onChange={e=>setUrl(e.target.value)} />
                <button className="btn-primary" onClick={fetchInfo} disabled={loading}>{loading ? 'Fetching...' : 'Get Links'}</button>
            </div>

            {data && (
                <div className="text-left mt-20 animate-fadeIn grid gap-15">
                    <div className="flex-between">
                        <div className="flex gap-15" style={{ display: 'flex', alignItems: 'center' }}>
                            {data.thumbnail && <img src={data.thumbnail} alt="" style={{ width: '120px', borderRadius: '8px' }} />}
                            <div>
                                <h4 style={{ margin: 0 }}>{data.title}</h4>
                                <div className="smallest opacity-6">{data.uploader}</div>
                            </div>
                        </div>
                        <button className="btn-primary" onClick={summarizeVideo} disabled={summarizing}>
                            <span className="material-icons mr-10">auto_awesome</span>
                            {summarizing ? 'Summarizing...' : 'AI Summary'}
                        </button>
                    </div>

                    {summary && (
                        <div className="card p-20 bg-surface-variant border-none animate-fadeIn">
                            <h5 className="mb-10 flex-center gap-10" style={{justifyContent: 'flex-start'}}>
                                <span className="material-icons color-primary">description</span>
                                AI Video Summary
                            </h5>
                            <div className="smallest opacity-8" style={{lineHeight: '1.6', whiteSpace: 'pre-wrap'}}>
                                {summary}
                            </div>
                        </div>
                    )}

                    <div className="overflow-auto" style={{ maxHeight: '400px', border: '1px solid var(--border)', borderRadius: '12px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                            <thead style={{ background: 'var(--primary-glow)', position: 'sticky', top: 0 }}>
                                <tr>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Resolution</th>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Ext</th>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Size</th>
                                    <th style={{ padding: '10px', textAlign: 'right' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.formats.map((f, i) => (
                                    <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                                        <td style={{ padding: '10px' }}>{f.resolution || 'N/A'}</td>
                                        <td style={{ padding: '10px' }}>{f.ext}</td>
                                        <td style={{ padding: '10px' }}>{formatSize(f.filesize)}</td>
                                        <td style={{ padding: '10px', textAlign: 'right' }}>
                                            <button className="pill" style={{ padding: '4px 12px', fontSize: '0.8rem' }} onClick={() => downloadFormat(f.format_id, f.ext)}>
                                                Download
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <ToolResult result={result} />
        </div>
    );
};

export default SocialDownloader;
