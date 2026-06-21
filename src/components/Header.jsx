import React, { memo } from 'react';

const Header = memo(({ appName, currentProfile, profiles, setView, onSettingsClick, hideBookmarks, hideToolbox, currentTab, children }) => {
  const profile = profiles.find(p => p.name === currentProfile) || { icon: 'inbox' };

  return (
    <header className="top-bar glass-card">
      <div
        className="logo-container"
        onClick={() => {
          if (hideBookmarks) setView('toolbox');
          else if (hideToolbox) setView('bookmarks');
          else setView(currentTab === 'bookmarks' ? 'toolbox' : 'bookmarks');
        }}
      >
        <div className="logo-icon-wrapper">
            <span className="material-icons-outlined app-logo">
              {profile.icon || 'home'}
            </span>
        </div>
        <h1 className="page-title">
          {appName || 'Epic Toolbox'}
        </h1>
      </div>
      <div className="top-actions">
        {children}
        <button className="icon-btn" onClick={onSettingsClick} title="Settings">
            <span className="material-icons">settings</span>
        </button>
      </div>
    </header>
  );
});

export default Header;
