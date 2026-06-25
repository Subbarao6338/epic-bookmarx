import React, { useState } from 'react';
import ToolResult from '../ToolResult';

const CodeInspiration = () => {
    const snippets = [
        { name: 'Debounce Function', code: "const debounce = (fn, ms) => {\n  let timeoutId;\n  return (...args) => {\n    clearTimeout(timeoutId);\n    timeoutId = setTimeout(() => fn.apply(this, args), ms);\n  };\n};" },
        { name: 'Fetch with Timeout', code: "const fetchWithTimeout = async (url, options, timeout = 5000) => {\n  const controller = new AbortController();\n  const id = setTimeout(() => controller.abort(), timeout);\n  const response = await fetch(url, {\n    ...options,\n    signal: controller.signal\n  });\n  clearTimeout(id);\n  return response;\n};" }
    ];

    return (
        <div className="card p-30 glass-card text-center grid gap-15">
            <h3>Dev Inspiration</h3>
            <div className="grid gap-10">
                {snippets.map(s => (
                    <div key={s.name} className="p-10 bg-surface rounded-lg text-left">
                        <div className="flex-between mb-5">
                            <span className="font-bold">{s.name}</span>
                            <button className="pill" style={{fontSize: '0.7rem'}} onClick={() => { navigator.clipboard.writeText(s.code); alert('Copied!'); }}>Copy</button>
                        </div>
                        <pre className="smallest font-mono opacity-8">{s.code}</pre>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CodeInspiration;
