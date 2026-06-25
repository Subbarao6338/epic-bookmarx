import React, { useState, useEffect } from 'react';
import ToolResult from './ToolResult';

// Import subtools
import AgentIngest from './subtools/AgentIngest';
import AgentGenerate from './subtools/AgentGenerate';
import AgentResults from './subtools/AgentResults';
import AgentSetup from './subtools/AgentSetup';

const AGENT_TABS = [
    { id: 'ingest', label: 'Code Ingestion', icon: 'upload_file' },
    { id: 'generate', label: 'Test Generation', icon: 'smart_toy' },
    { id: 'results', label: 'View Results', icon: 'list_alt' },
    { id: 'setup', label: 'API Setup', icon: 'settings' }
];

const AgentTools = ({ toolId, onSubtoolChange }) => {
    const [activeTab, setActiveTab] = useState(null);
    const [apiKey, setApiKey] = useState(localStorage.getItem('agent_openai_key') || '');
    const [knowledgeBase, setKnowledgeBase] = useState(JSON.parse(localStorage.getItem('agent_knowledge_base') || '[]'));

    useEffect(() => {
        if (activeTab) {
            const current = AGENT_TABS.find(t => t.id === activeTab);
            if (current && onSubtoolChange) onSubtoolChange(current.label);
        } else {
            if (onSubtoolChange) onSubtoolChange(null);
        }
    }, [activeTab, onSubtoolChange]);

    useEffect(() => {
        if (toolId && AGENT_TABS.some(t => t.id === toolId)) {
            setActiveTab(toolId);
        }
    }, [toolId]);

    const handleClearKnowledge = () => {
        setKnowledgeBase([]);
        localStorage.removeItem('agent_knowledge_base');
    };

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
          {AGENT_TABS.map(tab => (
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
                {activeTab === 'setup' && <AgentSetup apiKey={apiKey} setApiKey={setApiKey} onClearKB={handleClearKnowledge} />}
                {activeTab === 'ingest' && <AgentIngest setKB={setKnowledgeBase} currentKB={knowledgeBase} />}
                {activeTab === 'generate' && <AgentGenerate apiKey={apiKey} knowledgeBase={knowledgeBase} />}
                {activeTab === 'results' && <AgentResults />}
            </div>
        </div>
    );
};

export default AgentTools;
