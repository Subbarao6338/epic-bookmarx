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
  const [info, setInfo] = useState(null);
  const [result, setResult] = useState(null);
  const [summary, setSummary] = useState('');

  const getInfo = async () => {
    if (!url) return;
    setStatus('loading');
    setSummary('');
    try {
      const response = await fetch(`/api/social/info?url=${encodeURIComponent(url)}`);
      if (!response.ok) throw new Error("Failed to get info");
      const data = await response.json();
      setInfo(data);
      setStatus('idle');
    } catch (err) {
      setStatus('error');
      setResult({ error: err.message });
    }
  };

  const handleSummarize = async () => {
      setStatus('summarizing');
      try {
          const res = await fetch(`/api/social/summarize?url=${encodeURIComponent(url)}`);
          const data = await res.json();
          if (data.success) setSummary(data.summary);
          else throw new Error(data.message);
      } catch (e) {
          setResult({ error: e.message });
      } finally {
          setStatus('idle');
      }
  };

  const handleDownload = async (formatId) => {
    setStatus('downloading');
    try {
      const response = await fetch(`/api/social/download?url=${encodeURIComponent(url)}&format_id=${formatId || ''}`);
      if (!response.ok) throw new Error("Download failed");
      const data = await response.json();
      setResult({ text: `Direct Link: ${data.filename}`, url: data.url });
      setStatus('idle');
    } catch (err) {
      setStatus('error');
      setResult({ error: "Download failed: " + err.message });
    }
  };

  return (
    <div className="grid gap-15">
      <div className="grid gap-12 card p-30 glass-card">
        <div className="form-group">
          <label>Media URL</label>
          <input type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="YouTube, Twitter, Instagram URL..." className="pill w-full" />
        </div>
        <div className="grid grid-2-cols gap-10">
            <button className="btn-primary" onClick={getInfo} disabled={status === 'loading' || !url}>
              <span className="material-icons mr-10">{status === 'loading' ? 'sync' : 'search'}</span>
              {status === 'loading' ? 'Fetching...' : 'Fetch Media Info'}
            </button>
            <button className="pill" onClick={handleSummarize} disabled={status === 'summarizing' || !url}>
              <span className="material-icons mr-10">auto_awesome</span> AI Summary
            </button>
        </div>
      </div>

      {summary && (
          <div className="card p-20 glass-card animate-fadeIn">
              <h3>AI Video Summary</h3>
              <div className="small opacity-8" style={{ whiteSpace: 'pre-wrap' }}>{summary}</div>
          </div>
      )}

      {info && (
        <div className="card p-20 glass-card grid gap-15 animate-fadeIn">
          <div className="flex gap-15">
            <img src={info.thumbnail} alt="Thumbnail" style={{ width: '120px', borderRadius: '8px' }} />
            <div>
              <div className="font-bold">{info.title}</div>
              <div className="smallest opacity-6">By {info.uploader} • {info.duration}s</div>
            </div>
          </div>
          <div className="grid gap-10" style={{ maxHeight: '200px', overflow: 'auto' }}>
            {info.formats.slice(0, 10).map(f => (
              <div key={f.format_id} className="flex-between p-10 bg-surface rounded-lg">
                <div className="smallest">
                  <b>{f.ext.toUpperCase()}</b> • {f.resolution} • {(f.filesize / 1024 / 1024).toFixed(1)}MB
                </div>
                <button className="pill" style={{ padding: '4px 12px', fontSize: '0.7rem' }} onClick={() => handleDownload(f.format_id)}>
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
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
