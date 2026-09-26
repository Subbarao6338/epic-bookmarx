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
    id: 'cs-hexated',
    name: 'Cloudstream Hexated Repository',
    platform: 'Cloudstream',
    section: 'Streaming',
    category: 'Movie & Series Providers',
    description: 'Popular third-party repository providing multi-language streaming and anime plugins.',
    url: 'https://github.com/hexated/cloudstream-extensions',
    repoUrl: 'https://raw.githubusercontent.com/hexated/cloudstream-extensions/builds/repo.json',
    tags: ['cloudstream', 'hexated', 'movies', 'anime']
  },
  {
    id: 'cs-likkey',
    name: 'Cloudstream LikKey Extension Repository',
    platform: 'Cloudstream',
    section: 'Streaming',
    category: 'Movie & Series Providers',
    description: 'Community extension provider index with various streaming services and scrapers.',
    url: 'https://github.com/LikKey/cloudstream-extensions',
    repoUrl: 'https://raw.githubusercontent.com/LikKey/cloudstream-extensions/builds/repo.json',
    tags: ['cloudstream', 'likkey', 'streams', 'plugins']
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
    id: 'stremio-cyberflix',
    name: 'CyberFlix Catalog Stremio Addon',
    platform: 'Stremio',
    section: 'Streaming',
    category: 'Catalogs & Streams',
    description: 'Stremio addon offering comprehensive movie and TV show catalogs from popular streaming platforms.',
    url: 'https://cyberflix.koyeb.app/',
    repoUrl: 'https://cyberflix.koyeb.app/manifest.json',
    tags: ['stremio', 'cyberflix', 'catalogs', 'tv']
  },
  {
    id: 'stremio-comet',
    name: 'Comet Debrid & Torrent Scraper',
    platform: 'Stremio',
    section: 'Streaming',
    category: 'Torrent Scraper',
    description: 'High performance Stremio torrent scraper addon for Debrid services and torrent networks.',
    url: 'https://comet.elfhosted.com/',
    repoUrl: 'https://comet.elfhosted.com/manifest.json',
    tags: ['stremio', 'comet', 'debrid', 'torrents']
  },
  {
    id: 'stremio-knightcrawler',
    name: 'Knightcrawler Stremio Indexer',
    platform: 'Stremio',
    section: 'Streaming',
    category: 'Torrent Scraper',
    description: 'Popular Stremio torrent indexing addon for searching magnet links and streaming media.',
    url: 'https://knightcrawler.elfhosted.com/',
    repoUrl: 'https://knightcrawler.elfhosted.com/manifest.json',
    tags: ['stremio', 'knightcrawler', 'torrents', 'indexer']
  },
  {
    id: 'stremio-cinemeta',
    name: 'Stremio Cinemeta Catalog',
    platform: 'Stremio',
    section: 'Streaming',
    category: 'Metadata & Subtitles',
    description: 'Official Cinemeta catalog and metadata provider addon for Stremio.',
    url: 'https://v3-cinemeta.strem.fun/',
    repoUrl: 'https://v3-cinemeta.strem.fun/manifest.json',
    tags: ['stremio', 'cinemeta', 'metadata', 'catalogs']
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
  {
    id: 'kodi-addons',
    name: 'Kodi Official Addon Repository',
    platform: 'Kodi',
    section: 'Streaming',
    category: 'Media Center Addons',
    description: 'Official Kodi media center add-on index for video providers and scraper plugins.',
    url: 'https://kodi.tv/addons/',
    repoUrl: 'https://mirrors.kodi.tv/addons/nexus/addons.xml.gz',
    tags: ['kodi', 'addons', 'mediacenter', 'scrapers']
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
    id: 'keiyoushi-aniyomi',
    name: 'Keiyoushi Aniyomi Anime Index',
    platform: 'Aniyomi',
    section: 'Anime',
    category: 'Anime Streaming',
    description: 'Community maintained anime extension index compatible with Aniyomi and Tachiyomi forks.',
    url: 'https://github.com/keiyoushi/extensions',
    repoUrl: 'https://raw.githubusercontent.com/keiyoushi/extensions/aniyomi/index.min.json',
    tags: ['keiyoushi', 'aniyomi', 'anime', 'community']
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
    id: 'keiyoushi-manga',
    name: 'Keiyoushi Extensions (Mihon / Tachiyomi)',
    platform: 'Mihon',
    section: 'Manga',
    category: 'Manga & Comics',
    description: 'Primary extension repository for Mihon, Tachiyomi, and forks containing hundreds of manga sources.',
    url: 'https://keiyoushi.github.io/extensions/',
    repoUrl: 'https://raw.githubusercontent.com/keiyoushi/extensions/repo/index.min.json',
    tags: ['keiyoushi', 'mihon', 'tachiyomi', 'manga', 'comics']
  },
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
    id: 'suwayomi-tachidesk',
    name: 'Suwayomi (Tachidesk) Extension Index',
    platform: 'Suwayomi',
    section: 'Manga',
    category: 'Manga & Comics',
    description: 'Server-side extension repository index for Suwayomi (Tachidesk) desktop and web clients.',
    url: 'https://github.com/Suwayomi/Tachidesk-Server',
    repoUrl: 'https://raw.githubusercontent.com/Suwayomi/Tachidesk-Server/master/extensions.json',
    tags: ['suwayomi', 'tachidesk', 'manga', 'desktop']
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
  {
    id: 'mangadex-api',
    name: 'MangaDex Open API & Direct Feeds',
    platform: 'MangaDex',
    section: 'Manga',
    category: 'API & Direct Sources',
    description: 'Direct API endpoints and integration feeds for open manga reader applications.',
    url: 'https://mangadex.org/',
    repoUrl: 'https://api.mangadex.org/at-home/server',
    tags: ['mangadex', 'manga', 'api', 'direct']
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
  {
    id: 'quicknovel-extensions',
    name: 'QuickNovel Plugin Extensions',
    platform: 'QuickNovel',
    section: 'Light Novels',
    category: 'Novels & Web Novels',
    description: 'Provider extensions index for QuickNovel Android light novel and web novel reader.',
    url: 'https://github.com/LagradPv/QuickNovel',
    repoUrl: 'https://raw.githubusercontent.com/LagradPv/QuickNovel/master/plugins.json',
    tags: ['quicknovel', 'novels', 'plugins', 'webnovels']
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
  },
  {
    id: 'openuserjs-stream',
    name: 'OpenUserJS Streaming Scripts',
    platform: 'JavaScript',
    section: 'JavaScript Sources',
    category: 'Userscripts',
    description: 'Open source repository for user scripts and browser media streaming augmentations.',
    url: 'https://openuserjs.org/',
    repoUrl: 'https://openuserjs.org/meta/',
    tags: ['javascript', 'openuserjs', 'userscripts', 'media']
  }
];

const SECTIONS = ['All', 'Streaming', 'Anime', 'Manga', 'Light Novels', 'JavaScript Sources'];

const ExtensionSources = () => {
  const [activeSection, setActiveSection] = useState('All');
  const [activePlatform, setActivePlatform] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [result, setResult] = useState(null);

  // Get list of unique platforms
  const platforms = useMemo(() => {
    const list = Array.from(new Set(EXTENSION_SOURCES.map(s => s.platform)));
    return ['All', ...list];
  }, []);

  const filteredSources = useMemo(() => {
    return EXTENSION_SOURCES.filter(source => {
      const matchesSection = activeSection === 'All' || source.section.toLowerCase() === activeSection.toLowerCase();
      const matchesPlatform = activePlatform === 'All' || source.platform.toLowerCase() === activePlatform.toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        source.name.toLowerCase().includes(q) ||
        source.platform.toLowerCase().includes(q) ||
        source.section.toLowerCase().includes(q) ||
        source.category.toLowerCase().includes(q) ||
        source.description.toLowerCase().includes(q) ||
        source.url.toLowerCase().includes(q) ||
        source.repoUrl.toLowerCase().includes(q) ||
        source.tags.some(tag => tag.toLowerCase().includes(q));

      return matchesSection && matchesPlatform && matchesSearch;
    });
  }, [activeSection, activePlatform, searchQuery]);

  const groupedBySection = useMemo(() => {
    if (activeSection !== 'All' || activePlatform !== 'All' || searchQuery) {
      return null;
    }
    const grouped = {};
    SECTIONS.filter(s => s !== 'All').forEach(sec => {
      grouped[sec] = EXTENSION_SOURCES.filter(item => item.section === sec);
    });
    return grouped;
  }, [activeSection, activePlatform, searchQuery]);

  const handleCopy = (text, label, idKey) => {
    copyToClipboard(text, () => {
      setCopiedId(idKey);
      setResult({ text: `${label} copied to clipboard!` });
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const renderSourceCard = (source) => (
    <div key={source.id} className="card p-15 grid gap-12 text-left" style={{ background: 'var(--brand-bg-light)', borderRadius: '12px', border: '1px solid var(--border)' }}>
      {/* Header Badges */}
      <div className="flex-between flex-wrap gap-5">
        <div className="flex-center gap-5">
          <span
            className="pill active"
            style={{ fontSize: '0.72rem', padding: '3px 9px', background: 'var(--brand-accent)', cursor: 'pointer' }}
            onClick={() => setActivePlatform(source.platform)}
            title={`Filter by ${source.platform}`}
          >
            {source.platform}
          </span>
          <span
            className="pill"
            style={{ fontSize: '0.68rem', padding: '2px 7px', cursor: 'pointer' }}
            onClick={() => setActiveSection(source.section)}
            title={`Filter by ${source.section}`}
          >
            {source.section}
          </span>
        </div>
        <span className="smallest opacity-6 font-bold">{source.category}</span>
      </div>

      {/* Name and Description */}
      <div className="grid gap-5">
        <h4 className="font-bold text-md" style={{ margin: 0, color: 'var(--text-main)' }}>{source.name}</h4>
        <p className="smallest opacity-7" style={{ margin: 0, lineHeight: '1.45' }}>{source.description}</p>
      </div>

      {/* Visible URLs Box */}
      <div className="grid gap-6 p-10" style={{ background: 'var(--card-bg)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Repo Web URL */}
        <div className="flex-between flex-wrap gap-10" style={{ fontSize: '0.75rem' }}>
          <div className="grid gap-2 overflow-hidden" style={{ flex: 1, minWidth: 0 }}>
            <span className="smallest opacity-5 font-bold uppercase" style={{ fontSize: '0.62rem', letterSpacing: '0.5px' }}>Web Repository URL</span>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-9 hover-underline font-mono break-all"
              style={{ fontSize: '0.72rem', color: 'var(--brand-accent)', textDecoration: 'none' }}
              title={source.url}
            >
              {source.url}
            </a>
          </div>
          <button
            className="pill"
            style={{ fontSize: '0.7rem', padding: '3px 8px', height: 'fit-content', flexShrink: 0 }}
            title="Copy Web Repository URL"
            onClick={() => handleCopy(source.url, 'Repo Link', `${source.id}-url`)}
          >
            <span className="material-icons" style={{ fontSize: '0.8rem' }}>
              {copiedId === `${source.id}-url` ? 'check' : 'link'}
            </span>
            {copiedId === `${source.id}-url` ? 'Copied' : 'Copy'}
          </button>
        </div>

        {/* Source Raw URL */}
        <div className="flex-between flex-wrap gap-10 border-t pt-6" style={{ fontSize: '0.75rem', borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="grid gap-2 overflow-hidden" style={{ flex: 1, minWidth: 0 }}>
            <span className="smallest opacity-5 font-bold uppercase" style={{ fontSize: '0.62rem', letterSpacing: '0.5px' }}>Raw Manifest / Source JSON</span>
            <span
              className="opacity-8 font-mono break-all"
              style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}
              title={source.repoUrl}
            >
              {source.repoUrl}
            </span>
          </div>
          <button
            className="pill active"
            style={{ fontSize: '0.7rem', padding: '3px 8px', height: 'fit-content', flexShrink: 0 }}
            title="Copy Direct Source / Index JSON URL"
            onClick={() => handleCopy(source.repoUrl, 'Source Raw URL', `${source.id}-repourl`)}
          >
            <span className="material-icons" style={{ fontSize: '0.8rem' }}>
              {copiedId === `${source.id}-repourl` ? 'check' : 'content_copy'}
            </span>
            {copiedId === `${source.id}-repourl` ? 'Copied' : 'Copy Source URL'}
          </button>
        </div>
      </div>

      {/* Tags */}
      <div className="pill-group" style={{ gap: '4px' }}>
        {source.tags.map(tag => (
          <span
            key={tag}
            className="smallest opacity-6 hover-pill"
            style={{ background: 'var(--card-bg)', padding: '2px 7px', borderRadius: '4px', fontSize: '0.65rem', cursor: 'pointer' }}
            onClick={() => setSearchQuery(tag)}
            title={`Filter tag #${tag}`}
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Card Actions Footer */}
      <div className="border-t pt-8 flex-between gap-8 flex-wrap" style={{ borderColor: 'var(--border)' }}>
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

        <div className="flex-center gap-5">
          <a
            href={source.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="pill"
            style={{ fontSize: '0.75rem', padding: '4px 8px', textDecoration: 'none', color: 'inherit' }}
            title="Open Raw JSON in new tab"
          >
            <span className="material-icons" style={{ fontSize: '0.85rem' }}>code</span>
            Raw JSON
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="card p-20 glass-card grid gap-20">
      {/* Header */}
      <div className="text-center grid gap-5">
        <h3 className="flex-center gap-10">
          <span className="material-icons" style={{ color: 'var(--brand-accent)' }}>extension</span>
          Extension Sources Hub
        </h3>
        <p className="smallest opacity-6">
          Directory of extension repositories and source manifests for Cloudstream, Stremio, Mihon, Aniyomi, Mangayomi, LNReader, Kodi, and JavaScript.
        </p>

        {/* Stats Summary Bar */}
        <div className="flex-center gap-15 flex-wrap mt-5 opacity-8 smallest">
          <span className="pill" style={{ background: 'var(--brand-bg-light)', fontSize: '0.75rem' }}>
            📦 <strong>{EXTENSION_SOURCES.length}</strong> Repositories
          </span>
          <span className="pill" style={{ background: 'var(--brand-bg-light)', fontSize: '0.75rem' }}>
            📱 <strong>{platforms.length - 1}</strong> Platforms
          </span>
          <span className="pill" style={{ background: 'var(--brand-bg-light)', fontSize: '0.75rem' }}>
            🏷️ <strong>{SECTIONS.length - 1}</strong> Categories
          </span>
        </div>
      </div>

      {/* Controls: Search & Section / Platform Filters */}
      <div className="grid gap-12">
        {/* Search Bar */}
        <div className="search-bar-wrapper">
          <span className="material-icons search-icon">search</span>
          <input
            type="text"
            className="input-field"
            placeholder="Search sources by name, platform, URL, tag, or description..."
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
        <div className="grid gap-5">
          <span className="smallest opacity-5 font-bold text-left uppercase" style={{ fontSize: '0.65rem' }}>Media Category</span>
          <div className="scrollable-x pill-group p-2" style={{ justifyContent: 'flex-start' }}>
            {SECTIONS.map(s => (
              <button
                key={s}
                className={`pill ${activeSection === s ? 'active' : ''}`}
                onClick={() => setActiveSection(s)}
                style={{ fontSize: '0.8rem', padding: '5px 12px' }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Platform Pills */}
        <div className="grid gap-5">
          <span className="smallest opacity-5 font-bold text-left uppercase" style={{ fontSize: '0.65rem' }}>App Platform</span>
          <div className="scrollable-x pill-group p-2" style={{ justifyContent: 'flex-start' }}>
            {platforms.map(p => (
              <button
                key={p}
                className={`pill ${activePlatform === p ? 'active' : ''}`}
                onClick={() => setActivePlatform(p)}
                style={{ fontSize: '0.75rem', padding: '4px 10px' }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Filters Bar */}
      {(activeSection !== 'All' || activePlatform !== 'All' || searchQuery) && (
        <div className="flex-between p-10 align-items-center" style={{ background: 'var(--brand-bg-light)', borderRadius: '8px', fontSize: '0.8rem' }}>
          <div className="flex-center gap-8 flex-wrap">
            <span className="opacity-7">Active Filters:</span>
            {activeSection !== 'All' && (
              <span className="pill active" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                Section: {activeSection}
              </span>
            )}
            {activePlatform !== 'All' && (
              <span className="pill active" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                Platform: {activePlatform}
              </span>
            )}
            {searchQuery && (
              <span className="pill active" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                Query: "{searchQuery}"
              </span>
            )}
          </div>
          <button
            className="pill"
            style={{ fontSize: '0.7rem', padding: '3px 8px' }}
            onClick={() => {
              setActiveSection('All');
              setActivePlatform('All');
              setSearchQuery('');
            }}
          >
            Clear All
          </button>
        </div>
      )}

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
          </div>

          <div className="category-grid">
            {filteredSources.map(renderSourceCard)}

            {filteredSources.length === 0 && (
              <div className="p-30 text-center opacity-6 grid gap-10" style={{ gridColumn: '1 / -1' }}>
                <span className="material-icons" style={{ fontSize: '2.5rem' }}>search_off</span>
                <p>No extension sources found matching your criteria.</p>
                <button
                  className="pill align-self-center"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveSection('All');
                    setActivePlatform('All');
                  }}
                >
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
