import React, { useState } from 'react';
import ToolResult from '../ToolResult';

const DICTIONARY = {
    "hello": "namaskaram (నమస్కారం)",
    "world": "prapancham (ప్రపంచం)",
    "friend": "snehitudu (స్నేహితుడు)",
    "work": "panu (పని)",
    "book": "pustakam (పుస్తకం)",
    "water": "neeru (నీరు)",
    "food": "aharam (ఆహారం)",
    "good": "manchi (మంచి)",
    "bad": "chedu (చెడు)",
    "time": "samayam (సమయం)",
    "day": "roju (రోజు)",
    "night": "ratri (రాత్రి)",
    "love": "prema (ప్రేమ)",
    "peace": "shanti (శాంతి)",
    "happiness": "santosham (సంతోషం)",
    "thank you": "dhanyavadalu (ధన్యవాదాలు)",
    "please": "dayachesi (దయచేసి)",
    "yes": "avunu (అవును)",
    "no": "kadu (కాదు)",
    "how are you": "ela unnavu? (ఎలా ఉన్నావు?)"
};

const DocTranslator = () => {
    const [input, setInput] = useState('');
    const [result, setResult] = useState(null);

    const offlineTranslate = () => {
        if (!input.trim()) return;

        let text = input.toLowerCase();
        let translated = text;

        // Sort keys by length descending to match longest phrases first
        const sortedKeys = Object.keys(DICTIONARY).sort((a, b) => b.length - a.length);

        sortedKeys.forEach(key => {
            const regex = new RegExp(`\\b${key}\\b`, 'g');
            translated = translated.replace(regex, DICTIONARY[key]);
        });

        if (translated === text) {
            setResult({ text: "No matching phrases found in offline dictionary. Try words like 'hello', 'world', 'thank you', or 'how are you'.", isNote: true });
        } else {
            setResult({ text: translated, filename: 'translation.txt' });
        }
    };

    return (
        <div className="card p-30 glass-card text-center grid gap-15">
            <h3>Common Phrase Translator (Offline)</h3>
            <p className="smallest opacity-6">Instant English to Telugu phrase mapping. Powered by local dictionary.</p>
            <textarea className="pill w-full" rows="4" value={input} onChange={e=>setInput(e.target.value)} placeholder="Type 'hello world, how are you'..." />
            <div className="flex-center gap-10">
                <button className="btn-primary flex-1" onClick={offlineTranslate}>Translate Offline</button>
                <button className="pill" onClick={() => setInput('')}>Clear</button>
            </div>
            <ToolResult result={result} />
            <div className="mt-10 p-10 bg-surface rounded-lg border text-left">
                <span className="smallest uppercase opacity-6 block mb-5">Supported Phrases:</span>
                <div className="flex-wrap gap-5 flex">
                    {Object.keys(DICTIONARY).slice(0, 10).map(k => <span key={k} className="badge smallest">{k}</span>)}
                    <span className="badge smallest">...and more</span>
                </div>
            </div>
        </div>
    );
};

export default DocTranslator;
