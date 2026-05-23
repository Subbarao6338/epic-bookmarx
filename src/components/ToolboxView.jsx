import React, { useState, useEffect, useMemo, memo, lazy, Suspense } from 'react';
import { storage } from '../utils/storage';
import CategoryNav from './CategoryNav';
import EmptyState from './EmptyState';
import ErrorBoundary from './ErrorBoundary';
import { highlightText } from '../utils/helpers';

// Consolidated Lazy Loaded Hubs
const DocTools = lazy(() => import('./tools/DocTools'));
const NetworkTools = lazy(() => import('./tools/NetworkTools'));
const DataTools = lazy(() => import('./tools/DataTools'));
const DateTimeTools = lazy(() => import('./tools/DateTimeTools'));
const DevTools = lazy(() => import('./tools/DevTools'));
const WebTools = lazy(() => import('./tools/WebTools'));
const AiTools = lazy(() => import('./tools/AiTools'));

const TOOLS = [
    { id: 'web-main', title: 'Web & Social Tools', icon: 'public', category: 'Web', component: WebTools, subTools: ['social-downloader', 'web-to-md', 'web-mhtml', 'url-to-pdf', 'userscripts', 'bookmarklets'] },
    { id: 'network-main', title: 'Network Hub', icon: 'router', category: 'Web', component: NetworkTools, subTools: ['ip-info', 'ping', 'dns', 'whois', 'speed', 'geo', 'ssl', 'subnet', 'bluetooth'] },
    { id: 'ai-main', title: 'AI Hub', icon: 'auto_awesome', category: 'Web', component: AiTools, subTools: ['ai-chat', 'ai-image', 'ai-text'] },
    { id: 'dev-main', title: 'Dev Hub', icon: 'terminal', category: 'Developer', component: DevTools, subTools: ['json-formatter', 'jwt-decoder', 'sql-formatter', 'diff-viewer', 'regex-tester', 'length-conv', 'weight-conv', 'temp-conv', 'data-conv', 'color-picker', 'password-gen', 'hash-gen', 'base64', 'cron-helper', 'uuid-gen', 'url-tool', 'yaml-conv', 'minifier', 'xml-json', 'xml-formatter', 'json-to-ts'] },
    { id: 'doc-main', title: 'Document Tools', icon: 'description', category: 'Developer', component: DocTools, subTools: ['md-editor', 'doc-translator', 'pdf-merge', 'pdf-split', 'pdf-rotate', 'pdf-lock', 'pdf-unlock', 'pdf2img', 'ocr', 'img-format', 'img-resize', 'case-converter', 'word-counter'] },
    { id: 'data-main', title: 'Data Science', icon: 'insights', category: 'Data', component: DataTools, subTools: ['csv-viewer', 'data-visualizer', 'anomaly-detect', 'stat-calc', 'data-anonymizer', 'currency-conv', 'compound-int', 'loan-calc', 'mock-gen'] },
    { id: 'time-main', title: 'Date & Time Tools', icon: 'schedule', category: 'Productivity', component: DateTimeTools, subTools: ['stopwatch', 'pomodoro', 'worldclock', 'age', 'timestamp', 'panchangam', 'datediff', 'countdown', 'timezone'] },
];

const ToolboxView = ({ searchQuery, groupToolbox, showStats, recentTools, setRecentTools, hideRecentTools, hideIcons }) => {
  const [activeToolId, setActiveToolId] = useState(null);
  const [activeSubtoolLabel, setActiveSubtoolLabel] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [pinnedTools, setPinnedTools] = useState(storage.getJSON('hub_pinned_tools', []));
  const [collapsedCategories, setCollapsedCategories] = useState({});

  const stats = useMemo(() => {
    const s = {};
    TOOLS.forEach(t => {
      s[t.category] = (s[t.category] || 0) + 1;
    });
    return s;
  }, []);

  useEffect(() => { storage.setJSON('hub_pinned_tools', pinnedTools); }, [pinnedTools]);

  const toggleCategoryCollapse = (cat) => {
    setCollapsedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const collapseAll = (cats) => {
    const newCollapsed = {};
    cats.forEach(cat => newCollapsed[cat] = true);
    setCollapsedCategories(newCollapsed);
  };

  const expandAll = () => {
    setCollapsedCategories({});
  };

  const togglePin = (e, id) => {
    e.stopPropagation();
    let newPinned = pinnedTools.includes(id) ? pinnedTools.filter(t => t !== id) : [id, ...pinnedTools];
    setPinnedTools(newPinned);
  };

  const openTool = (id, skipHistory = false) => {
    if (activeToolId === id) return;
    setActiveToolId(id);
    setActiveSubtoolLabel(null);
    if (TOOLS.find(t => t.id === id)) {
      const newRecents = [id, ...recentTools.filter(t => t !== id)].slice(0, 4);
      setRecentTools(newRecents);
      storage.setJSON('hub_recent_tools', newRecents);
    }
    if (!skipHistory) {
      const url = new URL(window.location);
      url.searchParams.set('tab', 'toolbox');
      url.searchParams.set('tool', id);
      window.history.pushState({ toolId: id, tab: 'toolbox' }, '', url.toString());
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const toolId = params.get('tool');
      if (params.get('tab') === 'toolbox' && toolId) setActiveToolId(toolId);
      else setActiveToolId(null);
    };
    window.addEventListener('popstate', handlePopState);
    const params = new URLSearchParams(window.location.search);
    const toolId = params.get('tool');
    if (toolId) setActiveToolId(toolId);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleShare = async (e, tool) => {
    e.stopPropagation();
    const url = window.location.origin + window.location.pathname + `?tab=toolbox&tool=${tool.id}`;
    if (navigator.share) { try { await navigator.share({ title: `Epic Toolbox - ${tool.title}`, url }); } catch (err) {} }
    else { navigator.clipboard.writeText(url); alert("Link copied!"); }
  };

  const filteredTools = useMemo(() => TOOLS.filter(t => {
    let matchesSearch = true, matchesCat = true;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (query.startsWith('cat:')) matchesCat = t.category.toLowerCase().includes(query.replace('cat:', '').trim());
      else {
          matchesSearch = t.title.toLowerCase().includes(query) ||
                         t.category.toLowerCase().includes(query) ||
                         t.subTools?.some(st => st.toLowerCase().includes(query));
      }
    }
    if (!searchQuery || !searchQuery.toLowerCase().startsWith('cat:')) {
      if (activeCategory === 'Pinned') matchesCat = pinnedTools.includes(t.id);
      else if (activeCategory !== 'All') matchesCat = t.category === activeCategory;
    }
    return matchesSearch && matchesCat;
  }).sort((a, b) => a.title.localeCompare(b.title)), [searchQuery, activeCategory, pinnedTools]);

  const toolboxCategories = useMemo(() => {
    const cats = {};
    [...new Set(TOOLS.map(t => t.category))].forEach(cat => {
        if (cat) cats[cat] = getCategoryIcon(cat);
    });
    return cats;
  }, []);

  const groupedTools = useMemo(() => {
    if (!groupToolbox || (activeCategory !== 'All' && !searchQuery)) return null;
    const grouped = {};
    filteredTools.forEach(t => {
      if (!grouped[t.category]) grouped[t.category] = [];
      grouped[t.category].push(t);
    });
    return grouped;
  }, [filteredTools, groupToolbox, activeCategory, searchQuery]);

  const matchedSubtools = useMemo(() => {
    if (!searchQuery || searchQuery.toLowerCase().startsWith('cat:')) return [];
    const query = searchQuery.toLowerCase();
    const matches = [];
    TOOLS.forEach(tool => {
        tool.subTools?.forEach(sub => {
            if (sub.toLowerCase().includes(query)) {
                matches.push({
                    id: sub,
                    label: sub.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
                    hubId: tool.id,
                    hubTitle: tool.title
                });
            }
        });
    });
    return matches;
  }, [searchQuery]);

  if (activeToolId) {
    let tool = TOOLS.find(t => t.id === activeToolId);
    let effectiveToolId = activeToolId;

    if (!tool) {
        tool = TOOLS.find(t => t.subTools?.includes(activeToolId));
    }

    if (!tool) return <div className="text-center p-20"><button className="pill" onClick={() => setActiveToolId(null)}>Back</button><h2>Not Found</h2></div>;

    return (
      <div className="tool-view">
        <div className="tool-view-header">
          <div className="breadcrumb-nav">
              <div className="breadcrumb-item cursor-pointer" onClick={() => { setActiveToolId(null); window.history.back(); }}>
                  <span className="material-icons">home</span>
                  <span>Toolbox</span>
              </div>
              <span className="breadcrumb-separator material-icons">chevron_right</span>
              <div className={`breadcrumb-item ${!activeSubtoolLabel ? 'active' : ''}`} onClick={() => { if(activeSubtoolLabel) { setActiveSubtoolLabel(null); setActiveToolId(tool.id); } }}>
                  <span className="material-icons" style={{fontSize: '1.2rem'}}>{tool.icon}</span>
                  <span>{tool.title}</span>
              </div>
              {activeSubtoolLabel && (
                  <>
                      <span className="breadcrumb-separator material-icons">chevron_right</span>
                      <div className="breadcrumb-item active">
                          <span>{activeSubtoolLabel}</span>
                      </div>
                  </>
              )}
          </div>
        </div>
        <div className="tool-container-inner">
          <ErrorBoundary>
            <Suspense fallback={<div className="text-center p-20 rotating material-icons">refresh</div>}>
                <tool.component toolId={effectiveToolId} onSubtoolChange={setActiveSubtoolLabel} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    );
  }

  const cats = groupedTools ? Object.keys(groupedTools).sort() : [];

  const handleSubtoolClick = (match) => {
    openTool(match.id);
  };

  return (
    <>
      <CategoryNav
        categories={toolboxCategories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        showStats={showStats}
        stats={stats}
        totalCount={TOOLS.length}
        extraCategories={[{ name: 'Pinned', icon: 'push_pin', count: pinnedTools.length }]}
      />
      <div className="toolbox-page-header">
        {searchQuery ? (
           <>
            <h2>Search Results</h2>
            {matchedSubtools.length > 0 && (
              <div className="matched-subtools-bar animate-fadeIn">
                <div className="matched-subtools-label">Instant Hub Access:</div>
                <div className="scrollable-x" style={{padding: '5px 0'}}>
                  {matchedSubtools.map(match => (
                    <button
                      key={match.id}
                      className="pill active"
                      style={{fontSize: '0.8rem', background: 'var(--brand-accent)', borderColor: 'var(--brand-accent)'}}
                      onClick={() => handleSubtoolClick(match)}
                    >
                      {match.label}
                      <span style={{opacity: 0.7, fontSize: '0.7rem', marginLeft: '5px'}}>in {match.hubTitle}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
           </>
        ) : (
           <p>Your essential tools, simplified and unified.</p>
        )}

        {activeCategory === 'All' && !searchQuery && pinnedTools.length > 0 && (
          <div className="p-0-10 mb-20 text-left">
            <h3 className="uppercase tracking-wider opacity-6 mb-10 flex-center gap-10" style={{ fontSize: '0.9rem', justifyContent: 'flex-start' }}>
              <span className="material-icons" style={{ fontSize: '1.2rem' }}>push_pin</span> Pinned Hubs
            </h3>
            <div className="category-grid">
              {TOOLS.filter(t => pinnedTools.includes(t.id)).map((tool, idx) => (
                <ToolCard key={`pinned-${tool.id}`} tool={tool} idx={idx} isPinned={true} togglePin={togglePin} handleShare={handleShare} openTool={openTool} searchQuery={searchQuery} highlightText={highlightText} noAnimation={!!searchQuery} hideIcons={hideIcons} />
              ))}
            </div>
          </div>
        )}

        {groupedTools && cats.length > 0 && (
          <div className="pill-group" style={{justifyContent: 'center', marginTop: '1rem'}}>
            <button className="pill" onClick={() => collapseAll(cats)} style={{padding: '8px 16px', fontSize: '0.8rem'}}>
              <span className="material-icons" style={{fontSize: '1.1rem'}}>unfold_less</span> Collapse All
            </button>
            <button className="pill" onClick={expandAll} style={{padding: '8px 16px', fontSize: '0.8rem'}}>
              <span className="material-icons" style={{fontSize: '1.1rem'}}>unfold_more</span> Expand All
            </button>
          </div>
        )}
      </div>

      {!groupedTools ? (
        <div className="category-grid p-0-10">
          {filteredTools.map((tool, idx) => (
            <ToolCard key={tool.id} tool={tool} idx={idx} isPinned={pinnedTools.includes(tool.id)} togglePin={togglePin} handleShare={handleShare} openTool={openTool} searchQuery={searchQuery} highlightText={highlightText} noAnimation={!!searchQuery} hideIcons={hideIcons} />
          ))}
        </div>
      ) : (
        cats.map(cat => (
          <div key={cat} className={`category-section ${collapsedCategories[cat] ? 'collapsed' : ''}`}>
            <div className="category-header" onClick={() => toggleCategoryCollapse(cat)}>
              <div className="category-title">
                <span className="material-icons">{toolboxCategories[cat] || 'folder'}</span>
                {cat}
                {showStats && <span className="count">{groupedTools[cat].length}</span>}
              </div>
              <span className="material-icons expand-icon">expand_more</span>
            </div>
            <div className="category-grid">
              {groupedTools[cat].map((tool, idx) => (
                <ToolCard key={tool.id} tool={tool} idx={idx} isPinned={pinnedTools.includes(tool.id)} togglePin={togglePin} handleShare={handleShare} openTool={openTool} searchQuery={searchQuery} highlightText={highlightText} noAnimation={!!searchQuery} hideIcons={hideIcons} />
              ))}
            </div>
          </div>
        ))
      )}
    </>
  );
};

const ToolCard = memo(({ tool, idx, isPinned, togglePin, handleShare, openTool, searchQuery, highlightText, noAnimation, hideIcons }) => {
    const onKeyDown = React.useCallback(e => {
        if (e.key === 'Enter') openTool(tool.id);
    }, [openTool, tool.id]);

    return (
        <div id={`card-${tool.id}`} className={`card ${noAnimation ? 'no-animation' : ''}`} style={{'--delay': idx}} onClick={() => openTool(tool.id)} tabIndex="0" onKeyDown={onKeyDown}>
            <div className="card-body">
                {!hideIcons && (
                  <div className="card-icon flex-center"><span className="material-icons">{tool.icon}</span></div>
                )}
                <div className="card-title-group">
                    <div className="card-title" dangerouslySetInnerHTML={{ __html: highlightText(tool.title, searchQuery) }} />
                </div>
            </div>
            <div className="card-footer">
                <span className="fallback-badge" title={`${tool.subTools?.length || 0} sub-tools available`}>
                    <span className="material-icons">apps</span>
                    {tool.subTools?.length || 0}
                </span>
                <button className={`pin-btn ${isPinned ? 'active' : ''}`} onClick={(e) => togglePin(e, tool.id)} aria-label={isPinned ? 'Unpin tool' : 'Pin tool'}>
                    <span className="material-icons">push_pin</span>
                </button>
            </div>
        </div>
    );
});

const getCategoryIcon = (cat) => {
    const icons = {
        'Productivity': 'assignment',
        'Web': 'public',
        'Developer': 'terminal',
        'Data': 'insights'
    };
    return icons[cat] || 'folder';
};

export default ToolboxView;
