import React from 'react';

const Bookmarklets = () => {
    const bookmarklets = [
        { name: 'Edit Page', code: "javascript:document.body.contentEditable='true';document.designMode='on';void(0);" },
        { name: 'Zap Images', code: "javascript:(function(){var%20i,t=document.images;for(i=0;i<t.length;i++)t[i].style.visibility='hidden';})();" },
        { name: 'Word Count', code: "javascript:alert(document.body.innerText.split(/\\s+/).length+' words');" }
    ];

    return (
        <div className="card p-30 glass-card text-center grid gap-15">
            <h3>Power Bookmarklets</h3>
            <p className="smallest opacity-6">Drag these to your bookmarks bar.</p>
            <div className="grid gap-10">
                {bookmarklets.map(b => (
                    <a key={b.name} href={b.code} className="p-10 bg-surface rounded-lg cursor-move border-dashed text-decoration-none color-inherit" onClick={e=>e.preventDefault()}>
                        {b.name}
                    </a>
                ))}
            </div>
        </div>
    );
};

export default Bookmarklets;
