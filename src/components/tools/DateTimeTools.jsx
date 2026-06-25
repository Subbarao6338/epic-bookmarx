import React, { useState, useEffect } from 'react';
import ToolResult from './ToolResult';

// Import subtools
import AgeCalculator from './subtools/AgeCalculator';
import TimestampTool from './subtools/TimestampTool';
import Stopwatch from './subtools/Stopwatch';
import Pomodoro from './subtools/Pomodoro';
import WorldClock from './subtools/WorldClock';
import TimezoneConverter from './subtools/TimezoneConverter';
import DateDifference from './subtools/DateDifference';
import Countdown from './subtools/Countdown';
import PanchangamTool from './subtools/PanchangamTool';

const DATETIME_TABS = [
  { id: 'age', label: 'Age Calculator', icon: 'cake' },
  { id: 'timestamp', label: 'Timestamp', icon: 'timer' },
  { id: 'stopwatch', label: 'Stopwatch', icon: 'timer_10' },
  { id: 'pomodoro', label: 'Pomodoro', icon: 'hourglass_empty' },
  { id: 'worldclock', label: 'World Clock', icon: 'public' },
  { id: 'timezone', label: 'TZ Converter', icon: 'event_repeat' },
  { id: 'datediff', label: 'Date Diff', icon: 'date_range' },
  { id: 'countdown', label: 'Countdown', icon: 'event' },
  { id: 'panchangam', label: 'Telugu Panchangam', icon: 'auto_stories' }
].sort((a, b) => a.label.localeCompare(b.label));

const DateTimeTools = ({ toolId, onSubtoolChange }) => {
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    if (activeTab) {
      const current = DATETIME_TABS.find(t => t.id === activeTab);
      if (current && onSubtoolChange) onSubtoolChange(current.label);
    } else {
      if (onSubtoolChange) onSubtoolChange(null);
    }
  }, [activeTab, onSubtoolChange]);

  useEffect(() => {
    if (toolId && DATETIME_TABS.some(t => t.id === toolId)) {
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
          {DATETIME_TABS.map(tab => (
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
        {activeTab === 'age' && <AgeCalculator />}
        {activeTab === 'timestamp' && <TimestampTool />}
        {activeTab === 'stopwatch' && <Stopwatch />}
        {activeTab === 'pomodoro' && <Pomodoro />}
        {activeTab === 'worldclock' && <WorldClock />}
        {activeTab === 'timezone' && <TimezoneConverter />}
        {activeTab === 'datediff' && <DateDifference />}
        {activeTab === 'countdown' && <Countdown />}
        {activeTab === 'panchangam' && <PanchangamTool />}
      </div>
    </div>
  );
};

export default DateTimeTools;
