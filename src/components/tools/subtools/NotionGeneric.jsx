import React from 'react';

const NotionGeneric = ({ label }) => (
    <div className="card p-30 glass-card text-center grid gap-15">
        <span className="material-icons text-5xl opacity-2">auto_stories</span>
        <h3>{label}</h3>
        <p className="smallest opacity-6">Advanced Notion utility for large scale data operations.</p>
        <button className="btn-primary w-full" onClick={() => alert('Feature requires active Notion integration.')}>Initialize</button>
    </div>
);

export default NotionGeneric;
