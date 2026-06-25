import React, { useState, useEffect } from 'react';
import ToolResult from './ToolResult';

// Import subtools
import OpsStatus from './subtools/OpsStatus';
import OpsTelemetry from './subtools/OpsTelemetry';
import OpsLineage from './subtools/OpsLineage';

const OPS_TABS = [
  { id: 'status', label: 'System Status', icon: 'health_and_safety' },
  { id: 'telemetry', label: 'Live Telemetry', icon: 'monitoring' },
  { id: 'lineage', label: 'Data Lineage', icon: 'account_tree' }
];

const OpsTools = ({ toolId, onSubtoolChange }) => {
    const [activeTab, setActiveTab] = useState(null);

    useEffect(() => {
        if (activeTab) {
            const current = OPS_TABS.find(t => t.id === activeTab);
            if (current && onSubtoolChange) onSubtoolChange(current.label);
        } else {
            if (onSubtoolChange) onSubtoolChange(null);
        }
    }, [activeTab, onSubtoolChange]);

    useEffect(() => {
        if (toolId && OPS_TABS.some(t => t.id === toolId)) {
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
          {OPS_TABS.map(tab => (
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
                {activeTab === 'status' && <OpsStatus />}
                {activeTab === 'telemetry' && <OpsTelemetry />}
                {activeTab === 'lineage' && <OpsLineage />}
            </div>
        </div>
    );
};

export default OpsTools;
