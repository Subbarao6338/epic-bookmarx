import React, { useState, useRef, memo } from 'react';

const TabBar = memo(({ currentTab, setTab, onAddClick, onBookmarksLongPress, onSettingsClick, onSearchClick, searchActive, enableProfiles, hideBookmarks, hideToolbox, showProjectsTab }) => {
  const [pressTimer, setPressTimer] = useState(null);
  const isLongPress = useRef(false);

  const startPress = () => {
    if (!enableProfiles) return;
    isLongPress.current = false;
    const timer = setTimeout(() => {
      isLongPress.current = true;
      if (onBookmarksLongPress) onBookmarksLongPress();
    }, 500);
    setPressTimer(timer);
  };

  const cancelPress = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  const handleBookmarksClick = () => {
    if (isLongPress.current) {
      isLongPress.current = false;
      return;
    }
    if ('vibrate' in navigator) navigator.vibrate([10, 5, 10]);
    setTab('bookmarks');
  };

  const handleTabClick = (tab) => {
    if ('vibrate' in navigator) navigator.vibrate([10, 5, 10]);
    setTab(tab);
  };

  return (
    <nav className="tab-bar" aria-label="Main Navigation">
      <div className="tab-group glass-card" role="tablist">
        {!hideToolbox && (
          <button
            id="tab-toolbox"
            className={`tab-item ${currentTab === 'toolbox' ? 'active' : ''}`}
            onClick={() => handleTabClick('toolbox')}
            title="Toolbox"
            role="tab"
            aria-selected={currentTab === 'toolbox'}
            aria-controls="content"
          >
            <span className="material-icons-outlined" aria-hidden="true">handyman</span>
            <span className="tab-name">Toolbox</span>
          </button>
        )}

        {!hideBookmarks && (
          <button
            id="tab-bookmarks"
            className={`tab-item ${currentTab === 'bookmarks' ? 'active' : ''}`}
            onClick={handleBookmarksClick}
            onMouseDown={startPress}
            onMouseUp={cancelPress}
            onMouseLeave={cancelPress}
            onTouchStart={startPress}
            onTouchEnd={cancelPress}
            onContextMenu={(e) => e.preventDefault()}
            title="Bookmarks"
            role="tab"
            aria-selected={currentTab === 'bookmarks'}
            aria-controls="content"
          >
            <span className="material-icons-outlined" aria-hidden="true">bookmarks</span>
            <span className="tab-name">Bookmarks</span>
          </button>
        )}

        {showProjectsTab && (
          <button
            id="tab-projects"
            className={`tab-item ${currentTab === 'projects' ? 'active' : ''}`}
            onClick={() => handleTabClick('projects')}
            title="Projects"
            role="tab"
            aria-selected={currentTab === 'projects'}
            aria-controls="content"
          >
            <span className="material-icons-outlined" aria-hidden="true">architecture</span>
            <span className="tab-name">Projects</span>
          </button>
        )}

        <button
          id="tab-search"
          className={`tab-item ${searchActive ? 'active' : ''}`}
          onClick={onSearchClick}
          title="Search"
          aria-label="Toggle search"
          aria-expanded={searchActive}
        >
          <span className="material-icons-outlined" aria-hidden="true">search</span>
          <span className="tab-name">Search</span>
        </button>

        <button
          className="tab-item"
          onClick={onSettingsClick}
          title="Settings"
          aria-label="Open settings"
        >
          <span className="material-icons-outlined" aria-hidden="true">settings</span>
          <span className="tab-name">Settings</span>
        </button>
      </div>
    </nav>
  );
});

export default TabBar;
