import { lazy } from 'react';

// Consolidated Lazy Loaded Hubs
const DocTools = lazy(() => import('../components/tools/DocTools'));
const NetworkTools = lazy(() => import('../components/tools/NetworkTools'));
const DataTools = lazy(() => import('../components/tools/DataTools'));
const DateTimeTools = lazy(() => import('../components/tools/DateTimeTools'));
const DevTools = lazy(() => import('../components/tools/DevTools'));
const WebTools = lazy(() => import('../components/tools/WebTools'));
const AiAgentHub = lazy(() => import('../components/tools/AiAgentHub'));
const NotionTools = lazy(() => import('../components/tools/NotionTools'));
const OpsTools = lazy(() => import('../components/tools/OpsTools'));
const FashionTools = lazy(() => import('../components/tools/FashionTools'));

export const TOOLS = [
    // 1. AI
    { id: 'image-gen', title: 'AI Image Gen', icon: 'image', category: 'AI', component: AiAgentHub, subTools: [] },
    { id: 'chat', title: 'AI Chat Assistant', icon: 'chat', category: 'AI', component: AiAgentHub, subTools: [] },
    { id: 'local', title: 'Local AI Utilities', icon: 'analytics', category: 'AI', component: AiAgentHub, subTools: [] },

    // 2. Automation
    { id: 'agent-ingest', title: 'Code Ingestion', icon: 'upload_file', category: 'Automation', component: AiAgentHub, subTools: [] },
    { id: 'agent-generate', title: 'Test Generation', icon: 'smart_toy', category: 'Automation', component: AiAgentHub, subTools: [] },
    { id: 'agent-results', title: 'View Results', icon: 'list_alt', category: 'Automation', component: AiAgentHub, subTools: [] },
    { id: 'agent-setup', title: 'API Setup', icon: 'settings', category: 'Automation', component: AiAgentHub, subTools: [] },
    { id: 'notion-ingest', title: 'Notion Ingest', icon: 'sync', category: 'Automation', component: NotionTools, subTools: [] },
    { id: 'notion-folder', title: 'Folder Sync', icon: 'folder', category: 'Automation', component: NotionTools, subTools: [] },
    { id: 'notion-scraper', title: 'Web Scraper', icon: 'web', category: 'Automation', component: NotionTools, subTools: [] },
    { id: 'notion-history', title: 'Sync History', icon: 'history', category: 'Automation', component: NotionTools, subTools: [] },
    { id: 'notion-setup', title: 'Integration Setup', icon: 'settings', category: 'Automation', component: NotionTools, subTools: [] },

    // 3. Calculators
    { id: 'age', title: 'Age Calculator', icon: 'cake', category: 'Calculators', component: DateTimeTools, subTools: [] },
    { id: 'datediff', title: 'Date Difference', icon: 'date_range', category: 'Calculators', component: DateTimeTools, subTools: [] },
    { id: 'subnet', title: 'Subnet Calculator', icon: 'view_list', category: 'Calculators', component: NetworkTools, subTools: [] },
    { id: 'word-rank', title: 'Word Rank Calculator', icon: 'sort_by_alpha', category: 'Calculators', component: DateTimeTools, subTools: [] },

    // 6. Converters
    { id: 'converter', title: 'Unit Converter', icon: 'straighten', category: 'Converters', component: DevTools, subTools: [] },
    { id: 'currency', title: 'Currency Converter', icon: 'currency_exchange', category: 'Converters', component: DevTools, subTools: [] },
    { id: 'json-csv', title: 'JSON ↔ CSV Converter', icon: 'swap_calls', category: 'Converters', component: DataTools, subTools: [] },
    { id: 'xml-json', title: 'XML ↔ JSON Converter', icon: 'transform', category: 'Converters', component: DevTools, subTools: [] },
    { id: 'yaml', title: 'YAML ↔ JSON Converter', icon: 'swap_horiz', category: 'Converters', component: DevTools, subTools: [] },
    { id: 'base64', title: 'Base64 Converter', icon: 'code', category: 'Converters', component: DevTools, subTools: [] },
    { id: 'timezone', title: 'Timezone Converter', icon: 'event_repeat', category: 'Converters', component: DateTimeTools, subTools: [] },
    { id: 'batch', title: 'Batch Converter', icon: 'layers', category: 'Converters', component: DocTools, subTools: [] },

    // 7. Data Lab
    { id: 'viewer', title: 'Data Viewer', icon: 'table_view', category: 'Data Lab', component: DataTools, subTools: [] },
    { id: 'science', title: 'Data Science Hub', icon: 'science', category: 'Data Lab', component: DataTools, subTools: [] },
    { id: 'adv-data', title: 'Advanced Data Hub', icon: 'analytics', category: 'Data Lab', component: DataTools, subTools: [] },
    { id: 'reconcile', title: 'Reconciliation Tool', icon: 'rule', category: 'Data Lab', component: DataTools, subTools: [] },
    { id: 'mock', title: 'Mock Data Generator', icon: 'reorder', category: 'Data Lab', component: DataTools, subTools: [] },
    { id: 'synthetic', title: 'Synthetic Data Tool', icon: 'dns', category: 'Data Lab', component: DataTools, subTools: [] },

    // 8. Date & Time
    { id: 'timestamp', title: 'Timestamp Tool', icon: 'timer', category: 'Date & Time', component: DateTimeTools, subTools: [] },
    { id: 'stopwatch', title: 'Stopwatch', icon: 'timer_10', category: 'Date & Time', component: DateTimeTools, subTools: [] },
    { id: 'pomodoro', title: 'Pomodoro Timer', icon: 'hourglass_empty', category: 'Date & Time', component: DateTimeTools, subTools: [] },
    { id: 'worldclock', title: 'World Clock', icon: 'public', category: 'Date & Time', component: DateTimeTools, subTools: [] },
    { id: 'countdown', title: 'Countdown Timer', icon: 'event', category: 'Date & Time', component: DateTimeTools, subTools: [] },
    { id: 'panchangam', title: 'Telugu Panchangam', icon: 'auto_stories', category: 'Date & Time', component: DateTimeTools, subTools: [] },

    // 9. Design & Creative
    { id: 'color', title: 'Color Picker', icon: 'palette', category: 'Design & Creative', component: DevTools, subTools: [] },

    // 10. Developer
    { id: 'api-tester', title: 'REST API Tester', icon: 'api', category: 'Developer', component: DevTools, subTools: [] },
    { id: 'json-fmt', title: 'JSON Formatter', icon: 'data_object', category: 'Developer', component: DevTools, subTools: [] },
    { id: 'sql', title: 'SQL Formatter', icon: 'storage', category: 'Developer', component: DevTools, subTools: [] },
    { id: 'xml-fmt', title: 'XML Formatter', icon: 'format_align_left', category: 'Developer', component: DevTools, subTools: [] },
    { id: 'json-ts', title: 'JSON to TS Interface', icon: 'code', category: 'Developer', component: DevTools, subTools: [] },
    { id: 'kusto', title: 'KQL Formatter', icon: 'filter_alt', category: 'Developer', component: DevTools, subTools: [] },
    { id: 'diff', title: 'Diff Viewer', icon: 'difference', category: 'Developer', component: DevTools, subTools: [] },
    { id: 'regex', title: 'Regex Tester', icon: 'find_replace', category: 'Developer', component: DevTools, subTools: [] },
    { id: 'jwt', title: 'JWT Debugger', icon: 'verified_user', category: 'Developer', component: DevTools, subTools: [] },
    { id: 'url', title: 'URL Tool', icon: 'link', category: 'Developer', component: DevTools, subTools: [] },
    { id: 'cron', title: 'Cron Parser', icon: 'today', category: 'Developer', component: DevTools, subTools: [] },
    { id: 'minifier', title: 'Code Minifier', icon: 'compress', category: 'Developer', component: DevTools, subTools: [] },
    { id: 'qr-barcode', title: 'QR & Barcode Generator', icon: 'qr_code', category: 'Developer', component: DevTools, subTools: [] },
    { id: 'inspiration', title: 'Code Inspiration', icon: 'lightbulb', category: 'Developer', component: DevTools, subTools: [] },
    { id: 'md-table', title: 'Markdown Table', icon: 'grid_on', category: 'Developer', component: DevTools, subTools: [] },
    { id: 'sql-builder', title: 'SQL Builder', icon: 'build', category: 'Developer', component: DevTools, subTools: [] },

    // 11. Documents
    { id: 'pdf', title: 'PDF Hub', icon: 'picture_as_pdf', category: 'Documents', component: DocTools, subTools: [] },
    { id: 'docx-md', title: 'Word to MD Converter', icon: 'description', category: 'Documents', component: DocTools, subTools: [] },
    { id: 'doc-translator', title: 'Doc Translator', icon: 'translate', category: 'Documents', component: DocTools, subTools: [] },
    { id: 'ocr', title: 'Image OCR', icon: 'document_scanner', category: 'Documents', component: DocTools, subTools: [] },
    { id: 'text', title: 'Text Hub', icon: 'text_fields', category: 'Documents', component: DocTools, subTools: [] },
    { id: 'md-editor', title: 'Markdown Editor', icon: 'edit_note', category: 'Documents', component: DocTools, subTools: [] },

    // 13. Finance
    { id: 'finance', title: 'Finance Hub', icon: 'payments', category: 'Finance', component: DataTools, subTools: [] },

    // 19. Image Lab
    { id: 'image', title: 'Image Hub', icon: 'image', category: 'Image Lab', component: DocTools, subTools: [] },
    { id: 'image-lab', title: 'Image Lab', icon: 'biotech', category: 'Image Lab', component: DataTools, subTools: [] },

    // 20. Lifestyle
    { id: 'fashion-guide', title: 'Fashion Styling Guide', icon: 'checkroom', category: 'Lifestyle', component: FashionTools, subTools: [] },
    { id: 'clothes-guide', title: 'Clothes & Care Guide', icon: 'dry_cleaning', category: 'Lifestyle', component: FashionTools, subTools: [] },
    { id: 'traditional-guide', title: 'Traditional & Ethnic Guide', icon: 'temple_hindu', category: 'Lifestyle', component: FashionTools, subTools: [] },
    { id: 'worldwide', title: 'World Fashion Guide', icon: 'public', category: 'Lifestyle', component: FashionTools, subTools: [] },

    // 26. Network
    { id: 'ping', title: 'Ping Tester', icon: 'network_check', category: 'Network', component: NetworkTools, subTools: [] },
    { id: 'speed', title: 'Speed Test', icon: 'speed', category: 'Network', component: NetworkTools, subTools: [] },
    { id: 'dns', title: 'DNS Lookup', icon: 'language', category: 'Network', component: NetworkTools, subTools: [] },
    { id: 'whois', title: 'WHOIS Record', icon: 'person_search', category: 'Network', component: NetworkTools, subTools: [] },
    { id: 'ip-info', title: 'IP Information', icon: 'info', category: 'Network', component: NetworkTools, subTools: [] },
    { id: 'geo', title: 'Geolocation Tool', icon: 'my_location', category: 'Network', component: NetworkTools, subTools: [] },
    { id: 'ssl', title: 'SSL Checker', icon: 'verified_user', category: 'Network', component: NetworkTools, subTools: [] },

    // 28. Privacy & Security
    { id: 'anonymizer', title: 'PII Anonymizer', icon: 'fingerprint', category: 'Privacy & Security', component: DataTools, subTools: [] },
    { id: 'security', title: 'Hash & HMAC Generator', icon: 'security', category: 'Privacy & Security', component: DevTools, subTools: [] },
    { id: 'password', title: 'Password Tool', icon: 'lock', category: 'Privacy & Security', component: DevTools, subTools: [] },
    { id: 'rsa', title: 'RSA Key Generator', icon: 'vpn_key', category: 'Privacy & Security', component: DevTools, subTools: [] },
    { id: 'otp', title: 'OTP Generator', icon: 'password', category: 'Privacy & Security', component: DevTools, subTools: [] },

    // 30. Shopping
    { id: 'size-guide', title: 'Size & Body Guide', icon: 'straighten', category: 'Shopping', component: FashionTools, subTools: [] },
    { id: 'shoes', title: 'Footwear Guide', icon: 'run_circle', category: 'Shopping', component: FashionTools, subTools: [] },
    { id: 'accessories', title: 'Accessories Guide', icon: 'watch', category: 'Shopping', component: FashionTools, subTools: [] },

    // 31. Social
    { id: 'social', title: 'Social Audit', icon: 'share', category: 'Social', component: WebTools, subTools: [] },
    { id: 'social-downloader', title: 'Social Downloader', icon: 'download', category: 'Social', component: WebTools, subTools: [] },

    // 33. System Tools
    { id: 'status', title: 'System Status', icon: 'health_and_safety', category: 'System Tools', component: OpsTools, subTools: [] },
    { id: 'telemetry', title: 'Live Telemetry', icon: 'query_stats', category: 'System Tools', component: OpsTools, subTools: [] },
    { id: 'lineage', title: 'Data Lineage', icon: 'account_tree', category: 'System Tools', component: OpsTools, subTools: [] },

    // 38. Web Tools
    { id: 'extension-sources', title: 'Extension Sources', icon: 'extension', category: 'Web Tools', component: WebTools, subTools: [] },
    { id: 'archive', title: 'Web Archive', icon: 'history', category: 'Web Tools', component: WebTools, subTools: [] },
    { id: 'url2pdf', title: 'URL to PDF', icon: 'picture_as_pdf', category: 'Web Tools', component: WebTools, subTools: [] },
    { id: 'userscripts', title: 'User Scripts', icon: 'code', category: 'Web Tools', component: WebTools, subTools: [] },
    { id: 'bookmarklets', title: 'Bookmarklets', icon: 'bookmarks', category: 'Web Tools', component: WebTools, subTools: [] },
    { id: 'url2markdown', title: 'Web URL to Markdown', icon: 'summarize', category: 'Web Tools', component: WebTools, subTools: [] },

    // 39. Sensors
    { id: 'bluetooth', title: 'Bluetooth Scanner', icon: 'bluetooth', category: 'Sensors', component: NetworkTools, subTools: [] }
];
