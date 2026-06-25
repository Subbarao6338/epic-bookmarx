import React, { useState, useEffect } from 'react';
import ToolResult from './ToolResult';

// Import subtools
import SubnetCalc from './subtools/SubnetCalc';
import SpeedTest from './subtools/SpeedTest';
import IpInfo from './subtools/IpInfo';
import DnsLookup from './subtools/DnsLookup';
import WhoisLookup from './subtools/WhoisLookup';
import SslChecker from './subtools/SslChecker';
import PingTester from './subtools/PingTester';
import GeoTool from './subtools/GeoTool';
import BluetoothScanner from './subtools/BluetoothScanner';

const NETWORK_TABS = [
  { id: 'ip-info', label: 'IP Information', icon: 'info' },
  { id: 'ping', label: 'Ping Tester', icon: 'network_check' },
  { id: 'dns', label: 'DNS Lookup', icon: 'language' },
  { id: 'whois', label: 'WHOIS Record', icon: 'person_search' },
  { id: 'speed', label: 'Speed Test', icon: 'speed' },
  { id: 'geo', label: 'Geolocation', icon: 'my_location' },
  { id: 'ssl', label: 'SSL Checker', icon: 'verified_user' },
  { id: 'subnet', label: 'Subnet Calc', icon: 'view_list' },
  { id: 'bluetooth', label: 'BT Scanner', icon: 'bluetooth' }
].sort((a, b) => a.label.localeCompare(b.label));

const NetworkTools = ({ toolId, onSubtoolChange }) => {
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    if (activeTab) {
      const current = NETWORK_TABS.find(t => t.id === activeTab);
      if (current && onSubtoolChange) onSubtoolChange(current.label);
    } else {
      if (onSubtoolChange) onSubtoolChange(null);
    }
  }, [activeTab, onSubtoolChange]);

  useEffect(() => {
    if (toolId && NETWORK_TABS.some(t => t.id === toolId)) {
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
          {NETWORK_TABS.map(tab => (
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
        {activeTab === 'ip-info' && <IpInfo />}
        {activeTab === 'dns' && <DnsLookup />}
        {activeTab === 'whois' && <WhoisLookup />}
        {activeTab === 'ssl' && <SslChecker />}
        {activeTab === 'subnet' && <SubnetCalc />}
        {activeTab === 'speed' && <SpeedTest />}
        {activeTab === 'ping' && <PingTester />}
        {activeTab === 'geo' && <GeoTool />}
        {activeTab === 'bluetooth' && <BluetoothScanner />}
      </div>
    </div>
  );
};

export default NetworkTools;
