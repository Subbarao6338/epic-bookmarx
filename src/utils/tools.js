import { lazy } from 'react';

// Consolidated Lazy Loaded Hubs
const DocTools = lazy(() => import('../components/tools/DocTools'));
const NetworkTools = lazy(() => import('../components/tools/NetworkTools'));
const DataTools = lazy(() => import('../components/tools/DataTools'));
const DateTimeTools = lazy(() => import('../components/tools/DateTimeTools'));
const DevTools = lazy(() => import('../components/tools/DevTools'));
const WebTools = lazy(() => import('../components/tools/WebTools'));
const AiTools = lazy(() => import('../components/tools/AiTools'));
const AgentTools = lazy(() => import('../components/tools/AgentTools'));
const NotionTools = lazy(() => import('../components/tools/NotionTools'));
const OpsTools = lazy(() => import('../components/tools/OpsTools'));

export const TOOLS = [
    { id: 'ai-main', title: 'AI Hub', icon: 'auto_awesome', category: 'AI & Agents', component: AiTools, subTools: ['image-gen', 'chat', 'local'] },
    { id: 'agent-main', title: 'Agent Lab', icon: 'psychology', category: 'AI & Agents', component: AgentTools, subTools: ['ingest', 'generate', 'results', 'setup'] },
    { id: 'doc-main', title: 'Media & Docs', icon: 'description', category: 'Media & Documents', component: DocTools, subTools: ['pdf', 'image', 'text', 'md-editor', 'doc-translator', 'batch'] },
    { id: 'web-main', title: 'Web Tools', icon: 'public', category: 'Web Tools', component: WebTools, subTools: ['social', 'social-downloader', 'archive', 'url2pdf', 'userscripts', 'bookmarklets'] },
    { id: 'data-main', title: 'Data Science', icon: 'insights', category: 'Data & Analytics', component: DataTools, subTools: ['viewer', 'science', 'adv-data', 'reconcile', 'synthetic', 'image-lab', 'anonymizer', 'json-csv', 'mock', 'finance'] },
    { id: 'dev-main', title: 'Dev Hub', icon: 'terminal', category: 'Developer Tools', component: DevTools, subTools: ['json-fmt', 'sql', 'diff', 'converter', 'security', 'regex', 'otp', 'kusto', 'base64', 'jwt', 'cron', 'url', 'word-rank', 'yaml', 'minifier', 'xml-json', 'xml-fmt', 'json-ts', 'color', 'qr-barcode'] },
    { id: 'network-main', title: 'Network Hub', icon: 'router', category: 'Networking & Ops', component: NetworkTools, subTools: ['ip-info', 'ping', 'dns', 'whois', 'speed', 'geo', 'ssl', 'subnet', 'bluetooth'] },
    { id: 'ops-main', title: 'Ops Center', icon: 'settings_input_component', category: 'Networking & Ops', component: OpsTools, subTools: ['status', 'telemetry', 'lineage'] },
    { id: 'notion-main', title: 'Notion Hub', icon: 'auto_stories', category: 'Productivity', component: NotionTools, subTools: ['ingest', 'folder', 'scraper', 'history', 'setup'] },
    { id: 'time-main', title: 'Date & Time', icon: 'schedule', category: 'Productivity', component: DateTimeTools, subTools: ['age', 'timestamp', 'stopwatch', 'pomodoro', 'worldclock', 'timezone', 'datediff', 'countdown', 'panchangam'] },
];
