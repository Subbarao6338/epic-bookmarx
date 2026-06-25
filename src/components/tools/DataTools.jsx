import React, { useState, useEffect } from 'react';
import ToolResult from './ToolResult';

// Import subtools
import DataViewer from './subtools/DataViewer';
import SyntheticDataTool from './subtools/SyntheticDataTool';
import MockDataGenerator from './subtools/MockDataGenerator';
import DataAnonymizer from './subtools/DataAnonymizer';
import ReconciliationTool from './subtools/ReconciliationTool';
import ImageLab from './subtools/ImageLab';
import JsonCsvConverter from './subtools/JsonCsvConverter';
import DataScienceHub from './subtools/DataScienceHub';
import AdvancedDataHub from './subtools/AdvancedDataHub';
import FinanceHub from './subtools/FinanceHub';

const DATA_TABS = [
  { id: 'viewer', label: 'Data Viewer', icon: 'table_view' },
  { id: 'science', label: 'Data Science', icon: 'science' },
  { id: 'adv-data', label: 'Advanced Hub', icon: 'analytics' },
  { id: 'reconcile', label: 'Reconciliation', icon: 'rule' },
  { id: 'synthetic', label: 'Synthetic Gen', icon: 'Dns' },
  { id: 'image-lab', label: 'Image Lab', icon: 'biotech' },
  { id: 'anonymizer', label: 'Anonymizer', icon: 'fingerprint' },
  { id: 'json-csv', label: 'JSON ↔ CSV', icon: 'swap_calls' },
  { id: 'mock', label: 'Mock Generator', icon: 'reorder' },
  { id: 'finance', label: 'Finance Hub', icon: 'payments' }
].sort((a, b) => a.label.localeCompare(b.label));

const DataTools = ({ toolId, onSubtoolChange }) => {
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    if (activeTab) {
      const current = DATA_TABS.find(t => t.id === activeTab);
      if (current && onSubtoolChange) onSubtoolChange(current.label);
    } else {
      if (onSubtoolChange) onSubtoolChange(null);
    }
  }, [activeTab, onSubtoolChange]);

  useEffect(() => {
    if (toolId && DATA_TABS.some(t => t.id === toolId)) setActiveTab(toolId);
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
          {DATA_TABS.map(tab => (
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
        {activeTab === 'viewer' && <DataViewer />}
        {activeTab === 'science' && <DataScienceHub />}
        {activeTab === 'adv-data' && <AdvancedDataHub />}
        {activeTab === 'reconcile' && <ReconciliationTool />}
        {activeTab === 'synthetic' && <SyntheticDataTool />}
        {activeTab === 'image-lab' && <ImageLab />}
        {activeTab === 'anonymizer' && <DataAnonymizer />}
        {activeTab === 'json-csv' && <JsonCsvConverter />}
        {activeTab === 'mock' && <MockDataGenerator />}
        {activeTab === 'finance' && <FinanceHub />}
      </div>
    </div>
  );
};

export default DataTools;
