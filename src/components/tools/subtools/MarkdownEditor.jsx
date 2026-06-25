import React, { useState } from 'react';
import { marked } from 'marked';

const MarkdownEditor = () => {
    const [md, setMd] = useState('# Hello Markdown\n\nEdit me to see live preview.');
    return (
        <div className="grid grid-2-cols gap-15" style={{ minHeight: '400px' }}>
            <textarea className="card p-20 glass-card font-mono" value={md} onChange={e => setMd(e.target.value)} placeholder="Write markdown..." />
            <div className="card p-20 glass-card overflow-auto text-left markdown-preview" dangerouslySetInnerHTML={{ __html: marked.parse(md) }} />
        </div>
    );
};

export default MarkdownEditor;
