import React, { useState, useEffect } from 'react';

const SearchOverlay = ({ active, setActive, query, onChange, onClear, currentTab }) => {
  const [placeholder, setPlaceholder] = useState('');
  const tips = [
    `Search ${currentTab}... [/]`,
    "Try 'cat:dev' for hubs",
    "Try 'cat:social' for links",
    "Search bookmarks...",
    "Instant hub access",
    "Press Alt+1 for Toolbox"
  ];

  useEffect(() => {
    let i = 0;
    const it = setInterval(() => {
      setPlaceholder(tips[i % tips.length]);
      i++;
    }, 4000);
    setPlaceholder(tips[0]);
    return () => clearInterval(it);
  }, [currentTab]);

  const getPlaceholder = () => {
    if (query.startsWith('cat:')) return 'Filtering by category...';
    return placeholder;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim()) {
        window.dispatchEvent(new CustomEvent('hub-search-submit', { detail: { query: query.trim() } }));
    }
  };

  return (
    <div className={`search-container ${active ? 'active' : 'mobile-only'}`}>
      <span className="material-icons-outlined search-icon">search</span>
      <input
        type="search"
        id="search"
        placeholder={getPlaceholder()}
        onKeyDown={handleKeyDown}
        value={query}
        onChange={(e) => onChange(e.target.value)}
        onFocus={(e) => {
          e.target.select();
          if (setActive) setActive(true);
        }}
      />
      {!query && (
          <div className="search-hint desktop-only" style={{position: 'absolute', right: '15px', opacity: 0.3, pointerEvents: 'none', fontSize: '0.7rem', fontWeight: 800}}>
              TRY "cat:dev"
          </div>
      )}
      {query && (
        <button id="search-clear" className="search-clear-btn" title="Clear Search" onClick={onClear}>
          <span className="material-icons">close</span>
        </button>
      )}
    </div>
  );
};

export default SearchOverlay;
