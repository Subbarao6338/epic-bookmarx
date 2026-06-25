import React, { useState } from 'react';
import * as Diff from 'diff';
import ToolResult from '../ToolResult';

const DiffViewer = () => {
    const [oldText, setOldText] = useState('');
    const [newText, setNewText] = useState('');
    const [result, setResult] = useState(null);

    const compare = () => {
        const diff = Diff.createTwoFilesPatch('Original', 'Modified', oldText, newText);
        setResult({ text: diff, filename: 'diff.patch' });
    };

    return (
        <div className="grid gap-15">
            <div className="grid grid-2-cols gap-10">
                <textarea className="pill w-full font-mono" rows="8" placeholder="Original Text..." value={oldText} onChange={e=>setOldText(e.target.value)} />
                <textarea className="pill w-full font-mono" rows="8" placeholder="Modified Text..." value={newText} onChange={e=>setNewText(e.target.value)} />
            </div>
            <button className="btn-primary w-full" onClick={compare}>Compare Texts</button>
            <ToolResult result={result} />
        </div>
    );
};

export default DiffViewer;
