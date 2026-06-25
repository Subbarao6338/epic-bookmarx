import React from 'react';

const UserScripts = () => {
    const scripts = [
        { name: 'Dark Mode Everywhere', code: "document.body.style.filter = 'invert(1) hue-rotate(180deg)';" },
        { name: 'Speed Up Videos', code: "document.querySelectorAll('video').forEach(v => v.playbackRate = 2.0);" },
        { name: 'Remove Sticky Headers', code: "document.querySelectorAll('*').forEach(el => { if(getComputedStyle(el).position === 'fixed') el.style.display = 'none'; });" }
    ];

    return (
        <div className="card p-30 glass-card text-center grid gap-15">
            <h3>User Scripts Gallery</h3>
            <p className="smallest opacity-6">Click to copy and run in your browser console.</p>
            <div className="grid gap-10">
                {scripts.map(s => (
                    <div key={s.name} className="flex-between p-10 bg-surface rounded-lg">
                        <span className="small">{s.name}</span>
                        <button className="pill" style={{fontSize: '0.7rem'}} onClick={() => { navigator.clipboard.writeText(s.code); alert('Copied to clipboard!'); }}>Copy</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserScripts;
