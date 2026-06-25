import React, { useState, useEffect } from 'react';
import ToolResult from './ToolResult';

// Import subtools
import SocialAudit from './subtools/SocialAudit';
import WebArchive from './subtools/WebArchive';
import UrlToPdf from './subtools/UrlToPdf';
import UserScripts from './subtools/UserScripts';
import Bookmarklets from './subtools/Bookmarklets';

const WEB_TABS = [
  { id: 'social', label: 'Social Audit', icon: 'share' },
  { id: 'archive', label: 'Web Archive', icon: 'history' },
  { id: 'url2pdf', label: 'URL to PDF', icon: 'picture_as_pdf' },
  { id: 'userscripts', label: 'User Scripts', icon: 'javascript' },
  { id: 'bookmarklets', label: 'Bookmarklets', icon: 'bookmarks' }
].sort((a, b) => a.label.localeCompare(b.label));

const WebTools = ({ toolId, onSubtoolChange }) => {
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    if (activeTab) {
      const current = WEB_TABS.find(t => t.id === activeTab);
      if (current && onSubtoolChange) onSubtoolChange(current.label);
    } else {
      if (onSubtoolChange) onSubtoolChange(null);
    }
  }, [activeTab, onSubtoolChange]);

  useEffect(() => {
    if (toolId && WEB_TABS.some(t => t.id === toolId)) {
      setActiveTab(toolId);
    }
  }, [toolId]);

  const goBack = () => setActiveTab(null);
  const closeHub = () => {
    const url = new URL(window.location);
    url.searchParams.delete('tool');
    window.history.pushState({}, '', url.toString());
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  if (!activeTab) {
    return (
      <div className="tool-form mt-20">
        <div className="flex-between mb-20">
          <div className="pill disabled" style={{opacity: 0.5}}>
            <span className="material-icons" style={{fontSize: '1.1rem'}}>dashboard</span>
            Category Grid
          </div>
          <button className="pill" onClick={closeHub}>
            <span className="material-icons" style={{fontSize: '1.1rem'}}>close</span>
            Exit Category
          </button>
        </div>
        <div className="category-grid">
          {WEB_TABS.map(tab => (
            <div key={tab.id} className="card cursor-pointer" onClick={() => setActiveTab(tab.id)}>
              <div className="card-body">
                <div className="card-icon flex-center">
                  <span className="material-icons">{tab.icon}</span>
                </div>
                <div className="card-title">{tab.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="tool-form mt-20">
      <div className="flex-between mb-20">
        <button className="pill" onClick={goBack}>
          <span className="material-icons" style={{fontSize: '1.1rem'}}>arrow_back</span>
          Back to Hub
        </button>
        <button className="pill" onClick={closeHub}>
          <span className="material-icons" style={{fontSize: '1.1rem'}}>close</span>
          Exit Category
        </button>
      </div>

      <div className="hub-content animate-fadeIn">
        {activeTab === 'social' && <SocialAudit />}
        {activeTab === 'archive' && <WebArchive />}
        {activeTab === 'url2pdf' && <UrlToPdf />}
        {activeTab === 'userscripts' && <UserScripts />}
        {activeTab === 'bookmarklets' && <Bookmarklets />}
      </div>
    </div>
  );
};

export default WebTools;
