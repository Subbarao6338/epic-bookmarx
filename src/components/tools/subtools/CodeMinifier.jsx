import React, { useState } from 'react';
import ToolResult from '../ToolResult';

const CodeMinifier = () => {
    const [input, setInput] = useState('');
    const [mode, setMode] = useState('js');
    const [result, setResult] = useState(null);

    const minify = () => {
        if (!input.trim()) return;
        try {
            let minified = input;

            if (mode === 'js') {
                minified = minified
                    .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1') // comments
                    .replace(/\s+/g, ' ') // whitespace
                    .replace(/ ?([=+\-*/%&|^!<>?:;{},()[\]]) ?/g, '$1') // spaces around operators
                    .trim();
            } else if (mode === 'css') {
                minified = minified
                    .replace(/\/\*[\s\S]*?\*\//g, '') // comments
                    .replace(/\s+/g, ' ') // whitespace
                    .replace(/ ?([:;{},]) ?/g, '$1') // spaces around punctuations
                    .replace(/: /g, ':')
                    .replace(/;}/g, '}') // last semicolon
                    .trim();
            }

            setResult({
                text: minified,
                filename: `minified.${mode}`,
                stats: `Reduced from ${input.length} to ${minified.length} bytes (${Math.round((1 - minified.length/input.length)*100)}% saving)`
            });
        } catch (e) {
            setResult({ error: e.message });
        }
    };

    return (
        <div className="grid gap-15">
            <div className="pill-group">
                <button className={`pill ${mode === 'js' ? 'active' : ''}`} onClick={() => setMode('js')}>JS</button>
                <button className={`pill ${mode === 'css' ? 'active' : ''}`} onClick={() => setMode('css')}>CSS</button>
            </div>
            <textarea className="pill w-full font-mono text-xs" rows="10" placeholder={`Paste ${mode.toUpperCase()} here...`} value={input} onChange={e=>setInput(e.target.value)} />
            <div className="flex gap-10">
                <button className="btn-primary flex-1" onClick={minify}>Minify {mode.toUpperCase()}</button>
                <button className="pill" onClick={() => setInput('')}>Clear</button>
            </div>
            <ToolResult result={result} />
        </div>
    );
};

export default CodeMinifier;
