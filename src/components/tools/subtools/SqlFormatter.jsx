import React, { useState } from 'react';
import ToolResult from '../ToolResult';

const SqlFormatter = () => {
    const [input, setInput] = useState('');
    const [result, setResult] = useState(null);

    const formatSql = () => {
        if (!input.trim()) return;
        try {
            let sql = input.replace(/\s+/g, ' ').trim();
            const keywords = [
                'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'GROUP BY', 'ORDER BY',
                'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM',
                'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'ON', 'LIMIT', 'OFFSET',
                'HAVING', 'JOIN', 'UNION'
            ];

            // Basic indentation logic
            let indent = 0;
            const lines = [];

            // Uppercase keywords and add newlines
            keywords.forEach(key => {
                const regex = new RegExp(`\\b${key}\\b`, 'gi');
                sql = sql.replace(regex, `\n${key.toUpperCase()}\n`);
            });

            const parts = sql.split('\n').map(p => p.trim()).filter(p => p);

            parts.forEach(part => {
                if (keywords.includes(part)) {
                    lines.push('  '.repeat(indent) + part);
                    if (['SELECT', 'FROM', 'WHERE', 'SET', 'VALUES'].includes(part)) {
                        // next part indented?
                    }
                } else {
                    lines.push('  '.repeat(indent + 1) + part);
                }
            });

            const formatted = lines.join('\n');
            setResult({ text: formatted, filename: 'formatted.sql' });
        } catch (e) {
            setResult({ error: e.message });
        }
    };

    return (
        <div className="grid gap-15">
            <textarea className="pill w-full font-mono text-sm" rows="10" style={{lineHeight: '1.5'}} placeholder="Paste SQL query here..." value={input} onChange={e=>setInput(e.target.value)} />
            <div className="flex gap-10">
                <button className="btn-primary flex-1" onClick={formatSql}>Format SQL</button>
                <button className="pill" onClick={() => setInput('')}>Clear</button>
            </div>
            <ToolResult result={result} />
        </div>
    );
};

export default SqlFormatter;
