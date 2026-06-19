import React, { useState, useEffect, useRef } from 'react';
import ToolResult from './ToolResult';

const AiTools = ({ toolId, onSubtoolChange }) => {
  const [activeTab, setActiveTab] = useState('image-gen');
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (toolId) {
      const mapping = {
        'ai-chat': 'chat',
        'ai-image': 'image-gen',
        'ai-text': 'text-gen',
        'ai-sentiment': 'local'
      };
      if (mapping[toolId]) setActiveTab(mapping[toolId]);
    }
  }, [toolId]);
  const [input, setInput] = useState('');
  const [res, setRes] = useState('');
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState([]);
  const [style, setStyle] = useState('natural');
  const [localSentiment, setLocalSentiment] = useState(null);
  const [toolResult, setToolResult] = useState(null);

  useEffect(() => {
    const labels = {
      'image-gen': 'AI Image Gen',
      'text-gen': 'AI Story Gen',
      'chat': 'AI Chat Assistant',
      'local': 'Local AI Utilities'
    };
    if (onSubtoolChange) onSubtoolChange(labels[activeTab]);
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'chat' && chatEndRef.current) {
        chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chat, activeTab]);

  const runLocalAnalysis = async () => {
    setLoading(true);
    try {
        // Simulating local sentiment analysis
        const sentiment = input.length % 2 === 0 ? 'Positive' : 'Neutral';
        setLocalSentiment(sentiment);
        setToolResult({ text: `Sentiment Analysis Result:\nSentiment: ${sentiment}\nText: ${input.substring(0, 50)}...`, filename: 'sentiment.txt' });
    } catch (e) {
        setLocalSentiment('Neutral');
    } finally {
        setLoading(false);
    }
  };

  const generateImage = async () => {
    setLoading(true);
    try {
        const prompt = style === 'natural' ? input : `${input} in ${style} style`;
        const url = `https://pollinations.ai/p/${encodeURIComponent(prompt)}?width=512&height=512&seed=${Math.floor(Math.random()*1000)}&model=flux`;
        setRes(url);
        setToolResult({ text: `AI Image Prompt: ${input} (${style})`, filename: 'ai_image.png', url });
    } catch (e) {
        setRes('AI Image generation failed.');
    } finally {
        setLoading(false);
    }
  };

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
    <div className="tool-form mt-20">
      <div className="pill-group mb-20 scrollable-x">
        <button className={`pill ${activeTab === 'image-gen' ? 'active' : ''}`} onClick={() => {setActiveTab('image-gen'); setRes(''); setToolResult(null);}}>Image Gen</button>
        <button className={`pill ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => {setActiveTab('chat'); setRes(''); setToolResult(null);}}>Chat</button>
        <button className={`pill ${activeTab === 'local' ? 'active' : ''}`} onClick={() => {setActiveTab('local'); setRes(''); setToolResult(null);}}>Local Tools</button>
      </div>

      <div className="hub-content animate-fadeIn">
          {activeTab === 'local' ? (
              <div className="card p-20 grid gap-15 glass-card">
                  <div className="form-group">
                    <label>Text for Local Analysis</label>
                    <textarea className="pill w-full font-mono" rows="4" placeholder="Enter text here..." value={input} onChange={e=>setInput(e.target.value)} />
                  </div>
                  <button className="btn-primary w-full" onClick={runLocalAnalysis}>
                    <span className="material-icons mr-10">analytics</span>
                    Analyze Sentiment
                  </button>
                  {localSentiment && (
                      <div className="tool-result text-center">
                          Sentiment: <b className={localSentiment.toLowerCase()}>{localSentiment}</b>
                      </div>
                  )}
                  <ToolResult result={toolResult} />
              </div>
          ) : activeTab === 'image-gen' ? (
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
                        <textarea className="pill w-full" rows="3" placeholder="Describe what you want to generate..." value={input} onChange={e=>setInput(e.target.value)} />
                    </div>
                    <button className="btn-primary w-full" onClick={generateImage} disabled={loading || !input}>
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
          ) : (
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
          )}
      </div>
    </div>
  );
};

export default AiTools;
