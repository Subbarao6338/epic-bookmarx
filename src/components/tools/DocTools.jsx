import React, { useState, useEffect } from 'react';
import ToolResult from './ToolResult';

// Import subtools
import PdfHub from './subtools/PdfHub';
import ImageHub from './subtools/ImageHub';
import TextHub from './subtools/TextHub';
import MarkdownEditor from './subtools/MarkdownEditor';
import DocTranslator from './subtools/DocTranslator';
import BatchConverter from './subtools/BatchConverter';

const DOC_TABS = [
  { id: 'pdf', label: 'PDF Hub', icon: 'picture_as_pdf' },
  { id: 'image', label: 'Image Hub', icon: 'image' },
  { id: 'text', label: 'Text Hub', icon: 'text_fields' },
  { id: 'md-editor', label: 'Markdown Editor', icon: 'edit_note' },
  { id: 'doc-translator', label: 'Doc Translator', icon: 'translate' },
  { id: 'batch', label: 'Batch Converter', icon: 'layers' }
].sort((a, b) => a.label.localeCompare(b.label));

const DocTools = ({ toolId, onSubtoolChange }) => {
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    if (activeTab) {
      const current = DOC_TABS.find(t => t.id === activeTab);
      if (current && onSubtoolChange) onSubtoolChange(current.label);
    } else {
      if (onSubtoolChange) onSubtoolChange(null);
    }
  }, [activeTab, onSubtoolChange]);

  useEffect(() => {
    if (toolId && DOC_TABS.some(t => t.id === toolId)) {
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
          {DOC_TABS.map(tab => (
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
          Back to Category
        </button>
        <button className="pill" onClick={closeHub}>
          <span className="material-icons" style={{fontSize: '1.1rem'}}>close</span>
          Exit Category
        </button>
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

export default DocTools;
