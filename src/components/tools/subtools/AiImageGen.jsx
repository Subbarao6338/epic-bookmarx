import React, { useState } from 'react';
import ToolResult from '../ToolResult';

const AiImageGen = () => {
    const [prompt, setPrompt] = useState('');
    const [style, setStyle] = useState('natural');
    const [loading, setLoading] = useState(false);
    const [res, setRes] = useState('');
    const [toolResult, setToolResult] = useState(null);

    const generateImage = async () => {
        if (!prompt) return;
        setLoading(true);
        try {
            const fullPrompt = style === 'natural' ? prompt : `${prompt} in ${style} style`;
            const url = `https://pollinations.ai/p/${encodeURIComponent(fullPrompt)}?width=512&height=512&seed=${Math.floor(Math.random()*1000)}&model=flux`;
            setRes(url);
            setToolResult({ text: `AI Image Prompt: ${prompt} (${style})`, url });
        } catch (e) {
            setRes('AI Image generation failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid gap-20">
            <div className="pill-group scrollable-x">
                {['natural', 'anime', 'cyberpunk', 'pixel-art', '3d-render', 'sketch', 'oil-painting', 'cinematic'].map(s => (
                    <button key={s} className={`pill ${style === s ? 'active' : ''}`} onClick={() => setStyle(s)} style={{fontSize: '0.75rem', padding: '6px 12px'}}>
                        {s.replace('-', ' ')}
                    </button>
                ))}
            </div>
            <div className="card p-20 grid gap-15 glass-card">
                <div className="form-group">
                    <label>Image Prompt</label>
                    <textarea className="pill w-full" rows="3" placeholder="Describe what you want to generate..." value={prompt} onChange={e=>setPrompt(e.target.value)} />
                </div>
                <button className="btn-primary w-full" onClick={generateImage} disabled={loading || !prompt}>
                    <span className="material-icons mr-10">{loading ? 'sync' : 'auto_awesome'}</span>
                    {loading ? 'Generating...' : 'Generate with AI'}
                </button>
            </div>
            {res && (
                <div className="card p-15 text-center glass-card overflow-hidden">
                    <img src={res} alt="AI Gen" style={{ width: '100%', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }} />
                </div>
            )}
            <ToolResult result={toolResult} />
        </div>
    );
};

export default AiImageGen;
