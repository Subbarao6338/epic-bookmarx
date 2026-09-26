import React, { useState, useEffect, lazy, Suspense } from 'react';
import ErrorBoundary from '../ErrorBoundary';
import ToolResult from './ToolResult';

// Lazy load subtools
const ExtensionSources = lazy(() => import('./subtools/ExtensionSources'));
const SocialAudit = lazy(() => import('./subtools/SocialAudit'));
const SocialDownloader = lazy(() => import('./subtools/SocialDownloader'));
const WebArchive = lazy(() => import('./subtools/WebArchive'));
const UrlToPdf = lazy(() => import('./subtools/UrlToPdf'));
const UserScripts = lazy(() => import('./subtools/UserScripts'));
const Bookmarklets = lazy(() => import('./subtools/Bookmarklets'));
const UrlToMarkdown = lazy(() => import('./subtools/UrlToMarkdown'));

const WEB_TABS = [
  { id: 'extension-sources', label: 'Extension Sources', icon: 'extension' },
  { id: 'social', label: 'Social Audit', icon: 'share' },
  { id: 'social-downloader', label: 'Social Downloader', icon: 'download' },
  { id: 'archive', label: 'Web Archive', icon: 'history' },
  { id: 'url2pdf', label: 'URL to PDF', icon: 'picture_as_pdf' },
  { id: 'userscripts', label: 'User Scripts', icon: 'code' },
  { id: 'bookmarklets', label: 'Bookmarklets', icon: 'bookmarks' },
  { id: 'url2markdown', label: 'Web URL to Markdown', icon: 'summarize' }
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
    window.history.pushState({ tab: 'toolbox' }, '', url.toString());
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
        <ErrorBoundary>
          <Suspense fallback={<div className="text-center p-20 rotating material-icons">refresh</div>}>
            {activeTab === 'extension-sources' && <ExtensionSources />}
            {activeTab === 'social' && <SocialAudit />}
            {activeTab === 'social-downloader' && <SocialDownloader />}
            {activeTab === 'archive' && <WebArchive />}
            {activeTab === 'url2pdf' && <UrlToPdf />}
            {activeTab === 'userscripts' && <UserScripts />}
            {activeTab === 'bookmarklets' && <Bookmarklets />}
            {activeTab === 'url2markdown' && <UrlToMarkdown />}
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default WebTools;
