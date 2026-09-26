import React, { useState, useMemo } from 'react';
import ToolResult from '../ToolResult';
import { copyToClipboard } from '../../../utils/helpers';

const EXTENSION_SOURCES = [
  // Streaming Section
  {
    id: 'cs-official',
    name: 'Cloudstream Official Repository',
    platform: 'Cloudstream',
    section: 'Streaming',
    category: 'Movie & Series Providers',
    description: 'Official repository index for Cloudstream provider extensions.',
    url: 'https://github.com/recloudstream/cloudstream-extensions',
    repoUrl: 'https://raw.githubusercontent.com/recloudstream/cloudstream-extensions/builds/repo.json',
    tags: ['cloudstream', 'video', 'streaming', 'providers']
  },
  {
    id: 'cs-megarepo',
    name: 'Cloudstream Community Mega Repository',
    platform: 'Cloudstream',
    section: 'Streaming',
    category: 'Movie & Series Providers',
    description: 'Multi-source community repository for Cloudstream extensions and plugins.',
    url: 'https://github.com/cloudstream-community/extensions-manifest',
    repoUrl: 'https://raw.githubusercontent.com/cloudstream-community/extensions-manifest/builds/repo.json',
    tags: ['cloudstream', 'community', 'movies', 'series']
  },
  {
    id: 'stremio-official',
    name: 'Stremio Official Addons Registry',
    platform: 'Stremio',
    section: 'Streaming',
    category: 'Movie & Series Providers',
    description: 'Official registry of community and official Stremio streaming addons.',
    url: 'https://stremio-addons.netlify.app/',
    repoUrl: 'https://stremio-addons.netlify.app/manifest.json',
    tags: ['stremio', 'addons', 'torrents', 'streams', 'catalogs']
  },
  {
    id: 'stremio-torrentio',
    name: 'Torrentio Stremio Addon',
    platform: 'Stremio',
    section: 'Streaming',
    category: 'Movie & Series Providers',
    description: 'Popular Stremio addon providing torrent stream links from multiple providers.',
    url: 'https://torrentio.strem.fun/',
    repoUrl: 'https://torrentio.strem.fun/manifest.json',
    tags: ['stremio', 'torrentio', 'torrents', 'movies', 'series']
  },
  {
    id: 'zangetsu-extensions',
    name: 'Zangetsu Media Sources Repository',
    platform: 'Zangetsu',
    section: 'Streaming',
    category: 'Movie & Series Providers',
    description: 'Repository for Zangetsu media extensions and content provider scripts.',
    url: 'https://github.com/zangetsu-app/zangetsu-extensions',
    repoUrl: 'https://raw.githubusercontent.com/zangetsu-app/zangetsu-extensions/main/sources.json',
    tags: ['zangetsu', 'media', 'stream', 'providers']
  },
  {
    id: 'nuvio-sources',
    name: 'Nuvio Streaming Plugins',
    platform: 'Nuvio',
    section: 'Streaming',
    category: 'Movie & Series Providers',
    description: 'Plugin and provider source index for Nuvio streaming platform.',
    url: 'https://github.com/nuvio-app/nuvio-plugins',
    repoUrl: 'https://raw.githubusercontent.com/nuvio-app/nuvio-plugins/main/plugins.json',
    tags: ['nuvio', 'plugins', 'streams', 'video']
  },

  // Anime Section
  {
    id: 'aniyomi-extensions',
    name: 'Aniyomi Anime Extensions Repo',
    platform: 'Aniyomi',
    section: 'Anime',
    category: 'Anime Streaming',
    description: 'Extension repository for Aniyomi anime streaming and video sources.',
    url: 'https://github.com/aniyomiorg/aniyomi-extensions',
    repoUrl: 'https://raw.githubusercontent.com/aniyomiorg/aniyomi-extensions/repo/index.min.json',
    tags: ['aniyomi', 'anime', 'streaming', 'video']
  },
  {
    id: 'hiki-anime-extensions',
    name: 'Hiki Anime Sources',
    platform: 'Hiki',
    section: 'Anime',
    category: 'Anime Streaming',
    description: 'Collection of anime video provider extensions for Hiki player.',
    url: 'https://github.com/hiki-app/hiki-extensions',
    repoUrl: 'https://raw.githubusercontent.com/hiki-app/hiki-extensions/main/anime.json',
    tags: ['hiki', 'anime', 'streams', 'javascript']
  },

  // Manga Section
  {
    id: 'mangayomi-extensions',
    name: 'Mangayomi Manga Sources',
    platform: 'Mangayomi',
    section: 'Manga',
    category: 'Manga & Comics',
    description: 'Official extension index for Mangayomi manga and comic sources.',
    url: 'https://github.com/mangayomiorg/mangayomi-extensions',
    repoUrl: 'https://raw.githubusercontent.com/mangayomiorg/mangayomi-extensions/main/manga_index.json',
    tags: ['mangayomi', 'manga', 'comics', 'sources']
  },
  {
    id: 'mihan-manga-sources',
    name: 'Mihan Manga Reader Extensions',
    platform: 'Mihan',
    section: 'Manga',
    category: 'Manga & Comics',
    description: 'Source extensions repository for Mihan manga reader application.',
    url: 'https://github.com/mihan-app/mihan-sources',
    repoUrl: 'https://raw.githubusercontent.com/mihan-app/mihan-sources/main/manga.json',
    tags: ['mihan', 'manga', 'reader', 'extensions']
  },

  // Light Novels Section
  {
    id: 'shosetsu-extensions',
    name: 'Shosetsu Light Novel Extensions',
    platform: 'Shosetsu',
    section: 'Light Novels',
    category: 'Novels & Web Novels',
    description: 'Extension repository for Shosetsu Android Light Novel reader.',
    url: 'https://github.com/shosetsuorg/extensions',
    repoUrl: 'https://raw.githubusercontent.com/shosetsuorg/extensions/master/index.json',
    tags: ['shosetsu', 'light-novels', 'web-novels', 'reader']
  },
  {
    id: 'lnreader-extensions',
    name: 'LNReader Novel Sources Repository',
    platform: 'LNReader',
    section: 'Light Novels',
    category: 'Novels & Web Novels',
    description: 'Source plugins for LNReader light novel and web novel reading platform.',
    url: 'https://github.com/LNReader/lnreader-sources',
    repoUrl: 'https://raw.githubusercontent.com/LNReader/lnreader-sources/main/plugins.json',
    tags: ['lnreader', 'light-novels', 'plugins', 'epubs']
  },
  {
    id: 'mangayomi-novel-extensions',
    name: 'Mangayomi Novel Extension Repository',
    platform: 'Mangayomi',
    section: 'Light Novels',
    category: 'Novels & Web Novels',
    description: 'Extension index for novel and light novel sources on Mangayomi.',
    url: 'https://github.com/mangayomiorg/mangayomi-extensions',
    repoUrl: 'https://raw.githubusercontent.com/mangayomiorg/mangayomi-extensions/main/novel_index.json',
    tags: ['mangayomi', 'light-novels', 'sources']
  },

  // JavaScript Sources Section
  {
    id: 'stream-js-providers',
    name: 'JS Stream Extractors Repository',
    platform: 'JavaScript',
    section: 'JavaScript Sources',
    category: 'JS Extractors & Modules',
    description: 'Collection of JavaScript video link extractors and stream resolvers.',
    url: 'https://github.com/stream-link-resolvers/js-extractors',
    repoUrl: 'https://raw.githubusercontent.com/stream-link-resolvers/js-extractors/main/index.js',
    tags: ['javascript', 'extractors', 'resolvers']
  },
  {
    id: 'greasyfork-stream',
    name: 'GreasyFork JavaScript Video Scripts',
    platform: 'JavaScript',
    section: 'JavaScript Sources',
    category: 'Userscripts',
    description: 'Community user scripts repository for web video player enhancements.',
    url: 'https://greasyfork.org/en/scripts/by-site',
    repoUrl: 'https://greasyfork.org/scripts.json',
    tags: ['javascript', 'userscripts', 'greasyfork']
  }
];

const SECTIONS = ['All', 'Streaming', 'Anime', 'Manga', 'Light Novels', 'JavaScript Sources'];

const ExtensionSources = () => {
  const [activeSection, setActiveSection] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [result, setResult] = useState(null);

  const filteredSources = useMemo(() => {
    return EXTENSION_SOURCES.filter(source => {
      const matchesSection = activeSection === 'All' || source.section.toLowerCase() === activeSection.toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        source.name.toLowerCase().includes(q) ||
        source.platform.toLowerCase().includes(q) ||
        source.section.toLowerCase().includes(q) ||
        source.category.toLowerCase().includes(q) ||
        source.description.toLowerCase().includes(q) ||
        source.tags.some(tag => tag.toLowerCase().includes(q));

      return matchesSection && matchesSearch;
    });
  }, [activeSection, searchQuery]);

  const groupedBySection = useMemo(() => {
    if (activeSection !== 'All' || searchQuery) {
      return null;
    }
    const grouped = {};
    SECTIONS.filter(s => s !== 'All').forEach(sec => {
      grouped[sec] = EXTENSION_SOURCES.filter(item => item.section === sec);
    });
    return grouped;
  }, [activeSection, searchQuery]);

  const handleCopy = (text, label) => {
    copyToClipboard(text, () => {
      setResult({ text: `${label} copied to clipboard!` });
    });
  };

  const renderSourceCard = (source) => (
    <div key={source.id} className="card p-15 grid gap-10 text-left" style={{ background: 'var(--brand-bg-light)', borderRadius: '12px', border: '1px solid var(--border)' }}>
      <div className="flex-between">
        <span className="pill active" style={{ fontSize: '0.7rem', padding: '2px 8px', background: 'var(--brand-accent)' }}>
          {source.platform}
        </span>
        <span className="smallest opacity-6 font-bold">{source.section} • {source.category}</span>
      </div>

      <div className="grid gap-5">
        <h4 className="font-bold text-md" style={{ margin: 0 }}>{source.name}</h4>
        <p className="smallest opacity-7" style={{ margin: 0, lineHeight: '1.4' }}>{source.description}</p>
      </div>

      <div className="pill-group" style={{ gap: '4px' }}>
        {source.tags.map(tag => (
          <span key={tag} className="smallest opacity-5" style={{ background: 'var(--card-bg)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.65rem' }}>
            #{tag}
          </span>
        ))}
      </div>

      <div className="border-t pt-10 flex-between gap-5 flex-wrap mt-5">
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="pill flex-center gap-5"
          style={{ fontSize: '0.75rem', padding: '4px 10px', textDecoration: 'none' }}
        >
          <span className="material-icons" style={{ fontSize: '0.9rem' }}>open_in_new</span>
          Visit Repo
        </a>

        <div className="pill-group" style={{ gap: '5px' }}>
          <button
            className="pill"
            style={{ fontSize: '0.75rem', padding: '4px 8px' }}
            title="Copy web repository URL"
            onClick={() => handleCopy(source.url, 'Repo Link')}
          >
            <span className="material-icons" style={{ fontSize: '0.85rem' }}>link</span>
            Copy Link
          </button>
          <button
            className="pill active"
            style={{ fontSize: '0.75rem', padding: '4px 8px' }}
            title="Copy direct index / manifest source JSON URL"
            onClick={() => handleCopy(source.repoUrl, 'Source Raw URL')}
          >
            <span className="material-icons" style={{ fontSize: '0.85rem' }}>content_copy</span>
            Copy Source URL
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="card p-20 glass-card grid gap-20">
      <div className="text-center grid gap-5">
        <h3 className="flex-center gap-10">
          <span className="material-icons" style={{ color: 'var(--brand-accent)' }}>extension</span>
          Extension Sources Hub
        </h3>
        <p className="smallest opacity-6">
          Dedicated extension repositories for Streaming, Anime, Manga, Light Novels, and JavaScript sources.
        </p>
      </div>

      {/* Controls: Search & Section Navigation */}
      <div className="grid gap-10">
        <div className="search-bar-wrapper">
          <span className="material-icons search-icon">search</span>
          <input
            type="text"
            className="input-field"
            placeholder="Search sources by name, platform, tag, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-btn material-icons" onClick={() => setSearchQuery('')}>
              close
            </button>
          )}
        </div>

        {/* Section Pills */}
        <div className="scrollable-x pill-group p-5" style={{ justifyContent: 'center' }}>
          {SECTIONS.map(s => (
            <button
              key={s}
              className={`pill ${activeSection === s ? 'active' : ''}`}
              onClick={() => setActiveSection(s)}
              style={{ fontSize: '0.85rem', padding: '6px 14px' }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Grouped or Flat List */}
      {groupedBySection ? (
        <div className="grid gap-30 text-left">
          {Object.keys(groupedBySection).map(sectionName => (
            <div key={sectionName} className="grid gap-10">
              <div className="flex-between border-b pb-5">
                <h3 className="flex-center gap-10 text-md font-bold" style={{ margin: 0 }}>
                  <span className="material-icons" style={{ fontSize: '1.2rem', color: 'var(--brand-accent)' }}>
                    {sectionName === 'Streaming' ? 'live_tv' :
                     sectionName === 'Anime' ? 'movie' :
                     sectionName === 'Manga' ? 'menu_book' :
                     sectionName === 'Light Novels' ? 'auto_stories' : 'code'}
                  </span>
                  {sectionName}
                </h3>
                <span className="smallest opacity-6">{groupedBySection[sectionName].length} sources</span>
              </div>
              <div className="category-grid">
                {groupedBySection[sectionName].map(renderSourceCard)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="flex-between text-left opacity-7 smallest">
            <span>Showing <strong>{filteredSources.length}</strong> extension repositories</span>
            {activeSection !== 'All' && <span>Section: <strong>{activeSection}</strong></span>}
          </div>

          <div className="category-grid">
            {filteredSources.map(renderSourceCard)}

            {filteredSources.length === 0 && (
              <div className="p-30 text-center opacity-6 grid gap-10" style={{ gridColumn: '1 / -1' }}>
                <span className="material-icons" style={{ fontSize: '2.5rem' }}>search_off</span>
                <p>No extension sources found matching your criteria.</p>
                <button className="pill align-self-center" onClick={() => { setSearchQuery(''); setActiveSection('All'); }}>
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </>
      )}

      <ToolResult result={result} onClear={() => setResult(null)} />
    </div>
  );
};

export default ExtensionSources;
