import React, { useState, useEffect } from 'react';
import ToolResult from './ToolResult';

// Import subtools
import AiImageGen from './subtools/AiImageGen';
import AiChat from './subtools/AiChat';
import AiLocal from './subtools/AiLocal';

const AI_TABS = [
  { id: 'image-gen', label: 'AI Image Gen', icon: 'image' },
  { id: 'chat', label: 'AI Chat Assistant', icon: 'chat' },
  { id: 'local', label: 'Local AI Utilities', icon: 'analytics' }
].sort((a, b) => a.label.localeCompare(b.label));

const AiTools = ({ toolId, onSubtoolChange }) => {
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    if (activeTab) {
      const current = AI_TABS.find(t => t.id === activeTab);
      if (current && onSubtoolChange) onSubtoolChange(current.label);
    } else {
      if (onSubtoolChange) onSubtoolChange(null);
    }
  }, [activeTab, onSubtoolChange]);

  useEffect(() => {
    if (toolId) {
      const mapping = {
        'ai-chat': 'chat',
        'chat': 'chat',
        'ai-image': 'image-gen',
        'image-gen': 'image-gen',
        'ai-sentiment': 'local',
        'local': 'local'
      };
      if (mapping[toolId]) setActiveTab(mapping[toolId]);
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
          {AI_TABS.map(tab => (
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
        {activeTab === 'image-gen' && <AiImageGen />}
        {activeTab === 'chat' && <AiChat />}
        {activeTab === 'local' && <AiLocal />}
      </div>
    </div>
  );
};

export default AiTools;
