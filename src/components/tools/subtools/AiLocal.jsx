import React, { useState } from 'react';
import ToolResult from '../ToolResult';

const AiLocal = () => {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [sentiment, setSentiment] = useState(null);
    const [toolResult, setToolResult] = useState(null);

    const runAnalysis = async () => {
        if (!input) return;
        setLoading(true);
        try {
            // Simplified offline sentiment analysis
            const positiveWords = ['good', 'great', 'awesome', 'happy', 'excellent', 'love', 'amazing', 'best'];
            const negativeWords = ['bad', 'awful', 'sad', 'hate', 'terrible', 'worst', 'poor', 'stupid'];

            const words = input.toLowerCase().split(/\s+/);
            let score = 0;
            words.forEach(w => {
                if (positiveWords.includes(w)) score++;
                if (negativeWords.includes(w)) score--;
            });

            const result = score > 0 ? 'Positive' : score < 0 ? 'Negative' : 'Neutral';
            setSentiment(result);
            setToolResult({ text: `Sentiment Analysis Result:\nSentiment: ${result}\nText: ${input.substring(0, 50)}...` });
        } catch (e) {
            setSentiment('Neutral');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card p-20 grid gap-15 glass-card">
            <div className="form-group">
            <label>Text for Local Analysis</label>
            <textarea className="pill w-full font-mono" rows="4" placeholder="Enter text here..." value={input} onChange={e=>setInput(e.target.value)} />
            </div>
            <button className="btn-primary w-full" onClick={runAnalysis}>
            <span className="material-icons mr-10">analytics</span>
            Analyze Sentiment
            </button>
            {sentiment && (
                <div className="tool-result text-center">
                    Sentiment: <b className={sentiment.toLowerCase()}>{sentiment}</b>
                </div>
            )}
            <ToolResult result={toolResult} />
        </div>
    );
};

export default AiLocal;
