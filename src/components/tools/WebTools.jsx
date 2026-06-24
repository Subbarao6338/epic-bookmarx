import React, { useState, useEffect } from 'react';
import ToolResult from './ToolResult';

const WEB_TABS = [
  { id: 'social', label: 'Social Audit' },
  { id: 'archive', label: 'Web Archive' },
  { id: 'url2pdf', label: 'URL to PDF' },
  { id: 'userscripts', label: 'User Scripts' },
  { id: 'bookmarklets', label: 'Bookmarklets' }
].sort((a, b) => a.label.localeCompare(b.label));

const WebTools = ({ toolId, onSubtoolChange }) => {
  const [activeTab, setActiveTab] = useState('social');

  useEffect(() => {
    const current = WEB_TABS.find(t => t.id === activeTab);
    if (current && onSubtoolChange) onSubtoolChange(current.label);
  }, [activeTab, onSubtoolChange]);

  useEffect(() => {
    if (toolId) {
      const mapping = {
        'social': 'social', 'archive': 'archive',
        'url2pdf': 'url2pdf', 'userscripts': 'userscripts',
        'bookmarklets': 'bookmarklets'
      };
      if (mapping[toolId]) setActiveTab(mapping[toolId]);
    }
  }, [toolId]);

  return (
    <div className="tool-form mt-20">
      <div className="pill-group mb-20 scrollable-x">
        {WEB_TABS.map(tab => (
          <button key={tab.id} className={`pill ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="hub-content animate-fadeIn">
        {activeTab === 'url2pdf' ? (
          <div className="card p-30 glass-card text-center grid gap-15">
            <span className="material-icons text-5xl opacity-2">picture_as_pdf</span>
            <h3>URL to PDF</h3>
            <p className="smallest opacity-6">Convert any website into a high-quality PDF document.</p>
            <div className="form-group">
                <input type="url" className="pill w-full" placeholder="Enter Web URL..." />
            </div>
            <button className="btn-primary w-full">Convert URL to PDF</button>
          </div>
        ) : (
          <div className="card p-30 glass-card text-center grid gap-15">
              <span className="material-icons text-5xl opacity-2">public</span>
              <h3>{WEB_TABS.find(t => t.id === activeTab)?.label}</h3>
              <p className="smallest opacity-6">Advanced web utilities and social media analysis.</p>
              <button className="btn-primary w-full">Launch Tool</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebTools;
