import React, { useState, useEffect, useRef } from 'react';
import ToolResult from '../ToolResult';

const AiChat = () => {
    const [input, setInput] = useState('');
    const [chat, setChat] = useState([]);
    const [loading, setLoading] = useState(false);
    const [toolResult, setToolResult] = useState(null);
    const chatEndRef = useRef(null);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chat]);

    const sendMessage = async () => {
        if (!input.trim()) return;
        setLoading(true);
        const newChat = [...chat, { role: 'user', content: input }];
        setChat(newChat);
        const currentInput = input;
        setInput('');
        try {
            const response = await fetch('https://text.pollinations.ai/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newChat })
            });
            if (!response.ok) throw new Error('API failed');
            const data = await response.text();
            setChat([...newChat, { role: 'assistant', content: data }]);
            setToolResult(null);
        } catch(e) {
            setToolResult({ error: "Chat failed. Please try again." });
            setInput(currentInput);
            setChat(chat);
        } finally { setLoading(false); }
    };

    return (
        <div className="grid gap-15">
            <div className="card p-15 overflow-auto glass-card" style={{ height: '400px', display: 'flex', flexDirection: 'column', gap: '12px', borderRadius: 'var(--radius-xl)' }}>
                {chat.length === 0 && <div className="text-center opacity-5 m-auto">Ask me anything...<br/><span className="material-icons" style={{fontSize: '3rem'}}>forum</span></div>}
                {chat.map((m, i) => (
                    <div key={i} className={`p-15 animate-slide-up ${m.role === 'user' ? 'ml-40' : 'mr-40'}`} style={{
                        borderRadius: m.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                        alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '85%',
                        background: m.role === 'user' ? 'var(--primary)' : 'var(--primary-container)',
                        color: m.role === 'user' ? 'var(--on-primary)' : 'var(--on-primary-container)',
                        border: '1px solid var(--border)',
                        boxShadow: 'var(--shadow-sm)',
                        lineHeight: '1.5'
                    }}>
                        {m.content}
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>
            <div className="flex-gap p-5 bg-surface border rounded-full shadow-sm glass-card">
                <input className="pill flex-1 border-none shadow-none" value={input} onChange={e=>setInput(e.target.value)} placeholder="Type a message..." onKeyDown={e=>e.key==='Enter' && sendMessage()} />
                <button className="icon-btn btn-primary" onClick={sendMessage} disabled={loading} style={{width: '44px', height: '44px'}}>
                    <span className="material-icons">{loading ? 'sync' : 'send'}</span>
                </button>
            </div>
            <ToolResult result={toolResult} />
        </div>
    );
};

export default AiChat;
