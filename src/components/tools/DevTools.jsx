import React, { useState, useEffect } from 'react';
import ToolResult from './ToolResult';

// Import subtools
import SqlFormatter from './subtools/SqlFormatter';
import DiffViewer from './subtools/DiffViewer';
import RegexTester from './subtools/RegexTester';
import HashHmac from './subtools/HashHmac';
import QrBarcodeGen from './subtools/QrBarcodeGen';
import JsonToTs from './subtools/JsonToTs';
import ColorPicker from './subtools/ColorPicker';
import UnitConverter from './subtools/UnitConverter';
import KqlFormatter from './subtools/KqlFormatter';
import JwtDebugger from './subtools/JwtDebugger';
import CronParser from './subtools/CronParser';
import CodeMinifier from './subtools/CodeMinifier';
import XmlTools from './subtools/XmlTools';
import CodeInspiration from './subtools/CodeInspiration';
import JsonFormatter from './subtools/JsonFormatter';
import Base64Tool from './subtools/Base64Tool';
import YamlJsonConverter from './subtools/YamlJsonConverter';
import OtpGenerator from './subtools/OtpGenerator';
import WordRankCalculator from './subtools/WordRankCalculator';
import UrlTool from './subtools/UrlTool';

const DEV_TABS = [
  { id: 'json-fmt', label: 'JSON Formatter', icon: 'data_object' },
  { id: 'sql', label: 'SQL Formatter', icon: 'storage' },
  { id: 'diff', label: 'Diff Viewer', icon: 'difference' },
  { id: 'converter', label: 'Unit Converter', icon: 'straighten' },
  { id: 'security', label: 'Hash & HMAC', icon: 'security' },
  { id: 'regex', label: 'Regex Tester', icon: 'find_replace' },
  { id: 'otp', label: 'OTP Generator', icon: 'password' },
  { id: 'kusto', label: 'KQL Formatter', icon: 'filter_alt' },
  { id: 'base64', label: 'Base64', icon: 'code' },
  { id: 'jwt', label: 'JWT Debugger', icon: 'verified_user' },
  { id: 'cron', label: 'Cron Parser', icon: 'today' },
  { id: 'url', label: 'URL Tool', icon: 'link' },
  { id: 'word-rank', label: 'Word Rank', icon: 'sort_by_alpha' },
  { id: 'yaml', label: 'YAML ↔ JSON', icon: 'swap_horiz' },
  { id: 'minifier', label: 'Code Minifier', icon: 'compress' },
  { id: 'xml-json', label: 'XML ↔ JSON', icon: 'transform' },
  { id: 'xml-fmt', label: 'XML Formatter', icon: 'format_align_left' },
  { id: 'json-ts', label: 'JSON to TS', icon: 'typescript' },
  { id: 'color', label: 'Color Picker', icon: 'palette' },
  { id: 'qr-barcode', label: 'QR & Barcode', icon: 'qr_code' }
].sort((a, b) => a.label.localeCompare(b.label));

const DevTools = ({ toolId, onSubtoolChange }) => {
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    if (activeTab) {
      const current = DEV_TABS.find(t => t.id === activeTab);
      if (current && onSubtoolChange) onSubtoolChange(current.label);
    } else {
      if (onSubtoolChange) onSubtoolChange(null);
    }
  }, [activeTab, onSubtoolChange]);

  useEffect(() => {
    if (toolId && DEV_TABS.some(t => t.id === toolId)) setActiveTab(toolId);
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
          {DEV_TABS.map(tab => (
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
        {activeTab === 'json-fmt' && <JsonFormatter />}
        {activeTab === 'sql' && <SqlFormatter />}
        {activeTab === 'diff' && <DiffViewer />}
        {activeTab === 'regex' && <RegexTester />}
        {activeTab === 'security' && <HashHmac />}
        {activeTab === 'qr-barcode' && <QrBarcodeGen />}
        {activeTab === 'json-ts' && <JsonToTs />}
        {activeTab === 'color' && <ColorPicker />}
        {activeTab === 'converter' && <UnitConverter />}
        {activeTab === 'kusto' && <KqlFormatter />}
        {activeTab === 'jwt' && <JwtDebugger />}
        {activeTab === 'cron' && <CronParser />}
        {activeTab === 'minifier' && <CodeMinifier />}
        {(activeTab === 'xml-fmt' || activeTab === 'xml-json') && <XmlTools />}
        {activeTab === 'url' && <UrlTool />}
        {activeTab === 'base64' && <Base64Tool />}
        {activeTab === 'yaml' && <YamlJsonConverter />}
        {activeTab === 'otp' && <OtpGenerator />}
        {activeTab === 'word-rank' && <WordRankCalculator />}
      </div>
    </div>
  );
};

export default DevTools;
