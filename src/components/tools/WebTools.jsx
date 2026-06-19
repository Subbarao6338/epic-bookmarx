import React, { useState, useEffect } from 'react';
import ToolResult from './ToolResult';

const WebTools = ({ toolId, onSubtoolChange }) => {
  const tabs = [
    { id: 'social', label: 'Social Tools' },
    { id: 'archive', label: 'Web Archiver' },
    { id: 'url2pdf', label: 'URL to PDF' },
    { id: 'userscripts', label: 'Userscripts' },
    { id: 'bookmarklets', label: 'Bookmarklets' }
  ].sort((a, b) => a.label.localeCompare(b.label));

  const [activeTab, setActiveTab] = useState('social');

  useEffect(() => {
    const current = tabs.find(t => t.id === activeTab);
    if (current && onSubtoolChange) onSubtoolChange(current.label);
  }, [activeTab]);

  useEffect(() => {
    if (toolId) {
        if (toolId === 'url-to-pdf') setActiveTab('url2pdf');
        else if (['social-downloader', 'web-to-md', 'web-mhtml'].includes(toolId)) setActiveTab('social');
        else if (toolId === 'userscripts') setActiveTab('userscripts');
        else if (toolId === 'bookmarklets') setActiveTab('bookmarklets');
    }
  }, [toolId]);

  return (
    <div className="tool-form mt-20">
      <div className="pill-group mb-20 scrollable-x">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`pill ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="hub-content animate-fadeIn">
        {activeTab === 'social' && <SocialTools />}
        {activeTab === 'archive' && <WebArchiver />}
        {activeTab === 'url2pdf' && <UrlToPdf />}
        {activeTab === 'userscripts' && <UserscriptsTool />}
        {activeTab === 'bookmarklets' && <BookmarkletsTool />}
      </div>
    </div>
  );
};

const UrlToPdf = () => {
    const [url, setUrl] = useState('');
    const [isConverting, setIsConverting] = useState(false);
    const [result, setResult] = useState(null);

    const handleConvert = async () => {
        if (!url) return;
        setIsConverting(true);
        try {
            // Using html2pdf.app API (public endpoint example)
            const response = await fetch(`https://api.html2pdf.app/v1/generate?url=${encodeURIComponent(url)}`);
            if (!response.ok) throw new Error("Conversion failed");
            const blob = await response.blob();
            setResult({ text: `PDF generated for ${url}`, blob, filename: 'webpage.pdf' });
        } catch (err) {
            setResult({ error: "Conversion failed. Please try a different URL or check your connection." });
        } finally {
            setIsConverting(false);
        }
    };
    return (
        <div className="card p-30 glass-card grid gap-15">
            <div className="form-group">
                <label>Web URL</label>
            <input type="text" className="pill w-full" value={url} onChange={e=>setUrl(e.target.value)} placeholder="Enter Web URL..." />
            </div>
            <button className="btn-primary w-full" onClick={handleConvert} disabled={isConverting || !url}>
                {isConverting ? 'Converting...' : 'Convert URL to PDF'}
            </button>
            <div className="opacity-6 smallest text-center">
                Captures a high-quality PDF of the webpage.
            </div>
            <ToolResult result={result} />
        </div>
    );
};

const WebArchiver = () => {
    const [url, setUrl] = useState('');
    const [result, setResult] = useState(null);
    const openArchive = (mode) => {
        if (!url) return;
        let target = '';
        if (mode === 'search') target = `https://web.archive.org/web/*/${url}`;
        else if (mode === 'save') target = `https://web.archive.org/save/${url}`;
        window.open(target, '_blank');
        setResult({ text: `Opened Wayback Machine (${mode}) for ${url}` });
    };
    return (
        <div className="card p-30 glass-card grid gap-15">
            <div className="form-group">
                <label>Web URL</label>
                <input type="text" className="pill w-full" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com" />
            </div>
            <div className="flex-gap">
                <button className="btn-primary flex-1" onClick={() => openArchive('search')}>
                    <span className="material-icons">search</span> Search Archive
                </button>
                <button className="pill flex-1" onClick={() => openArchive('save')}>
                    <span className="material-icons">save</span> Save Page
                </button>
            </div>
            <div className="opacity-6 smallest text-center">
                Powered by the Wayback Machine.
            </div>
            <ToolResult result={result} />
        </div>
    );
};

const SocialTools = () => {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);

  const handleDownload = async () => {
    setStatus('downloading');
    try {
      const response = await fetch('https://cobalt.tools/api/json', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
          },
          body: JSON.stringify({ url: url })
      });
      const data = await response.json();
      if (data.status === 'stream' || data.status === 'redirect') {
          setResult({ text: `Download link: ${data.url}`, url: data.url, filename: 'media' });
      } else if (data.status === 'picker') {
          setResult({ text: `Multiple options found. Please use the first one: ${data.picker[0].url}`, url: data.picker[0].url });
      } else {
          throw new Error(data.text || "Download failed");
      }
      setStatus('idle');
    } catch (err) {
        setStatus('error');
        setResult({ error: "Download failed: " + err.message });
    }
  };

  return (
    <div className="grid gap-12 card p-30 glass-card">
      <div className="form-group">
        <label>Media URL</label>
        <input type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="YouTube, Twitter, Instagram URL..." className="pill w-full" />
      </div>
      <button className="btn-primary w-full" onClick={handleDownload} disabled={status === 'downloading' || !url}>
        <span className="material-icons mr-10">{status === 'downloading' ? 'sync' : 'download'}</span>
        {status === 'downloading' ? 'Processing...' : 'Process Media'}
      </button>
      <ToolResult result={result} />
    </div>
  );
};

const UserscriptsTool = () => {
    const scripts = [
        { name: 'Next Page / Auto Pager', desc: 'Automatically loads the next page when scrolling.', url: 'https://greasyfork.org/scripts/438684-pagetual/code/Pagetual.user.js' },
        { name: 'Web to Markdown', desc: 'Copy any webpage as Markdown text.', url: 'https://greasyfork.org/scripts/406852-web-to-markdown/code/Web%20to%20Markdown.user.js' },
        { name: 'Dark Mode Everywhere', desc: 'Enforce dark mode on all websites.', url: 'https://greasyfork.org/scripts/18028-google-hit-hider-by-domain-search-filter-block-sites/code/Google%20Hit%20Hider%20by%20Domain%20(Search%20Filter%20%20Block%20Sites).user.js' }
    ];

    return (
        <div className="grid gap-15">
            <div className="card p-20 glass-card">
                <h3>Userscripts Hub</h3>
                <p className="small opacity-6">Install these scripts in a supported browser (using Tampermonkey, Violentmonkey, etc.)</p>
            </div>
            {scripts.map((s, i) => (
                <div key={i} className="card p-20 glass-card flex-between">
                    <div>
                        <div className="font-bold">{s.name}</div>
                        <div className="smallest opacity-6">{s.desc}</div>
                    </div>
                    <a href={s.url} target="_blank" className="btn-primary" style={{padding: '8px 16px', fontSize: '0.8rem'}}>
                        <span className="material-icons mr-10">download</span> Install
                    </a>
                </div>
            ))}
        </div>
    );
};

const BookmarkletsTool = () => {
    const bookmarklets = [
        { name: 'Print Friendly', desc: 'Optimize the current page for printing.', code: "javascript:(function(){var%20js=document.createElement('script');js.setAttribute('type','text/javascript');js.setAttribute('src','https://www.printfriendly.com/assets/printfriendly.js');document.getElementsByTagName('head')[0].appendChild(js);})();" },
        { name: 'Extract Images', desc: 'Open all images on the page in a new tab.', code: "javascript:(function(){var%20imgs=document.getElementsByTagName('img');var%20out='';for(var%20i=0;i<imgs.length;i++){out+='<img%20src=%22'+imgs[i].src+'%22%20style=%22max-width:300px;margin:10px%22>';}var%20w=window.open();w.document.write(out);})();" },
        { name: 'Editable Page', desc: 'Toggle designMode to edit any webpage text.', code: "javascript:document.body.contentEditable='true';%20document.designMode='on';%20void%200" }
    ];

    const [result, setResult] = useState(null);

    const copyCode = (b) => {
        setResult({
            text: b.code,
            filename: `${b.name.toLowerCase().replace(/\s+/g, '_')}.js`,
            info: "Bookmarklet code copied! Create a new bookmark and paste this into the URL field."
        });
        navigator.clipboard.writeText(b.code);
    };

    return (
        <div className="grid gap-15">
            <div className="card p-20 glass-card">
                <h3>Bookmarklets Hub</h3>
                <p className="small opacity-6">Drag these to your bookmarks bar or copy the code to use them on any page.</p>
            </div>
            {bookmarklets.map((b, i) => (
                <div key={i} className="card p-20 glass-card flex-between">
                    <div style={{flex: 1}}>
                        <div className="font-bold">{b.name}</div>
                        <div className="smallest opacity-6">{b.desc}</div>
                    </div>
                    <div className="flex-gap">
                        <a href={b.code} className="pill" onClick={(e) => e.preventDefault()} style={{cursor: 'grab'}} title="Drag this to your bookmarks bar">
                           <span className="material-icons">bookmark_add</span> Drag Me
                        </a>
                        <button className="pill" onClick={() => copyCode(b)}>
                           <span className="material-icons">content_copy</span> Copy
                        </button>
                    </div>
                </div>
            ))}
    {result?.info && (
        <div className="alert-info p-10 smallest mt-10 mb-10" style={{background: 'var(--primary-glow)', borderRadius: '8px', borderLeft: '4px solid var(--primary)'}}>
            <div className="flex-center gap-10" style={{justifyContent: 'flex-start'}}>
                <span className="material-icons" style={{fontSize: '1.2rem'}}>info</span>
                <span>{result.info}</span>
            </div>
        </div>
    )}
            <ToolResult result={result} title="Last Copied Bookmarklet" />
        </div>
    );
};

export default WebTools;
