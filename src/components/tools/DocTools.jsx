import React, { useState, useEffect } from 'react';
import ToolResult from './ToolResult';

const DOC_TABS = [
  { id: 'pdf', label: 'PDF Hub' },
  { id: 'image', label: 'Image Hub' },
  { id: 'text', label: 'Text Hub' },
  { id: 'md-editor', label: 'Markdown Editor' },
  { id: 'doc-translator', label: 'Doc Translator' },
  { id: 'batch', label: 'Batch Converter' }
].sort((a, b) => a.label.localeCompare(b.label));

const DocTools = ({ toolId, onSubtoolChange }) => {
  const [activeTab, setActiveTab] = useState('pdf');

  useEffect(() => {
    const current = DOC_TABS.find(t => t.id === activeTab);
    if (current && onSubtoolChange) onSubtoolChange(current.label);
  }, [activeTab, onSubtoolChange]);

  useEffect(() => {
    if (toolId) {
        const mapping = {
            'pdf': 'pdf', 'image': 'image', 'text': 'text',
            'md-editor': 'md-editor', 'doc-translator': 'doc-translator',
            'batch': 'batch'
        };
        if (mapping[toolId]) setActiveTab(mapping[toolId]);
    }
  }, [toolId]);

  return (
    <div className="tool-form mt-20">
      <div className="pill-group mb-20 scrollable-x">
        {DOC_TABS.map(tab => (
          <button key={tab.id} className={`pill ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="hub-content animate-fadeIn">
        {activeTab === 'pdf' && <PdfHub />}
        {activeTab === 'image' && <ImageHub />}
        {activeTab === 'text' && <TextHub />}
        {activeTab === 'md-editor' && <MarkdownEditor />}
        {activeTab === 'doc-translator' && <DocTranslator />}
        {activeTab === 'batch' && <BatchConverter />}
      </div>
    </div>
  );
};

const PdfHub = () => (
    <div className="card p-30 glass-card text-center grid gap-15">
        <h3>PDF Hub</h3>
        <p className="smallest opacity-6">26 tools integrated: Merge, Split, Compress, OCR, and more.</p>
        <button className="btn-primary w-full">Open PDF Suite</button>
    </div>
);

const ImageHub = () => (
    <div className="card p-30 glass-card text-center grid gap-15">
        <h3>Image Hub</h3>
        <p className="smallest opacity-6">Resize, Crop, Optimize, and convert formats.</p>
        <button className="btn-primary w-full">Launch Image Tools</button>
    </div>
);

const TextHub = () => {
    const [input, setInput] = useState('');
    const [res, setRes] = useState(null);
    const run = () => {
        if (!input) return;
        setRes({ text: `Lines: ${input.split('\n').length}\nWords: ${input.split(/\s+/).length}\nChars: ${input.length}` });
    };
    return (
        <div className="card p-20 glass-card grid gap-15">
            <h3>Text Analytics</h3>
            <textarea className="pill w-full" rows="6" value={input} onChange={e=>setInput(e.target.value)} placeholder="Paste text..." />
            <button className="btn-primary" onClick={run}>Analyze</button>
            <ToolResult result={res} />
        </div>
    );
};

const MarkdownEditor = () => (
    <div className="card p-30 glass-card text-center grid gap-15">
        <h3>Markdown Editor</h3>
        <p className="smallest opacity-6">WYSIWYG Markdown with live preview and PDF export.</p>
        <button className="btn-primary w-full">Open Editor</button>
    </div>
);

const DocTranslator = () => {
    const [file, setFile] = useState(null);
    const [targetLang, setTargetLang] = useState('telugu');

    return (
        <div className="card p-30 glass-card text-center grid gap-15">
            <h3>Document Translator</h3>
            <p className="smallest opacity-6">Translate PDF, DOCX, EPUB with layout preservation.</p>
            <div className="form-group">
                <input type="file" className="pill w-full" onChange={e => setFile(e.target.files[0])} accept=".pdf,.docx,.epub" />
            </div>
            <div className="form-group">
                <select className="pill w-full" value={targetLang} onChange={e => setTargetLang(e.target.value)}>
                    <option value="telugu">Telugu</option>
                    <option value="hindi">Hindi</option>
                    <option value="spanish">Spanish</option>
                </select>
            </div>
            <button className="btn-primary w-full" disabled={!file}>Translate Document</button>
        </div>
    );
};

const BatchConverter = () => (
    <div className="card p-30 glass-card text-center grid gap-15">
        <h3>Batch Converter</h3>
        <p className="smallest opacity-6">Bulk format conversion for Documents and Images.</p>
        <button className="btn-primary w-full">Choose Files</button>
    </div>
);

export default DocTools;
