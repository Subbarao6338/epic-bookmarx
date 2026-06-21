import React, { useState, useEffect, useMemo, useRef } from 'react';
import { diffLines } from 'diff';
import { create, all } from 'mathjs';
import { QRCodeSVG } from 'qrcode.react';
import JsBarcode from 'jsbarcode';
import ToolResult from './ToolResult';

const math = create(all);

const DevTools = ({ toolId, onSubtoolChange }) => {
  const tabs = [
    { id: 'json-fmt', label: 'JSON Formatter' },
    { id: 'sql', label: 'SQL Formatter' },
    { id: 'diff', label: 'Diff Viewer' },
    { id: 'converter', label: 'Unit Converter' },
    { id: 'security', label: 'Security Hub' },
    { id: 'regex', label: 'Regex Tester' },
    { id: 'otp', label: 'OTP Generator' },
    { id: 'kusto', label: 'Kusto Query Gen' },
    { id: 'base64', label: 'Base64' },
    { id: 'jwt', label: 'JWT Decoder' },
    { id: 'cron', label: 'Cron Helper' },
    { id: 'url', label: 'URL Tool' },
    { id: 'yaml', label: 'YAML Conv' },
    { id: 'minifier', label: 'Minifier' },
    { id: 'xml-json', label: 'XML ↔ JSON' },
    { id: 'xml-fmt', label: 'XML Formatter' },
    { id: 'json-ts', label: 'JSON to TS' },
    { id: 'color', label: 'Color Picker' },
    { id: 'qr-barcode', label: 'QR & Barcode' }
  ].sort((a, b) => a.label.localeCompare(b.label));

  const [activeTab, setActiveTab] = useState('json-fmt');
  useEffect(() => { if (onSubtoolChange) onSubtoolChange(tabs.find(t=>t.id===activeTab).label); }, [activeTab]);

  return (
    <div className="tool-form mt-20">
      <div className="pill-group mb-20 scrollable-x">
        {tabs.map(tab => (
          <button key={tab.id} className={`pill ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>
        ))}
      </div>
      <div className="hub-content animate-fadeIn">
        {activeTab === 'json-fmt' && <JsonFormatter />}
        {activeTab === 'sql' && <SqlFormatter />}
        {activeTab === 'diff' && <DiffViewer />}
        {activeTab === 'converter' && <UnitConverterHub />}
        {activeTab === 'security' && <SecurityHub />}
        {activeTab === 'regex' && <RegexTester />}
        {activeTab === 'otp' && <OtpGenerator />}
        {activeTab === 'kusto' && <KustoGenerator />}
        {activeTab === 'base64' && <Base64Tool />}
        {activeTab === 'jwt' && <JwtDecoder />}
        {activeTab === 'cron' && <CronHelper />}
        {activeTab === 'url' && <UrlTool />}
        {activeTab === 'yaml' && <YamlConverter />}
        {activeTab === 'minifier' && <Minifier />}
        {activeTab === 'xml-json' && <XmlJsonConverter />}
        {activeTab === 'xml-fmt' && <XmlFormatter />}
        {activeTab === 'json-ts' && <JsonToTs />}
        {activeTab === 'color' && <ColorPicker />}
        {activeTab === 'qr-barcode' && <QrBarcodeGenerator />}
      </div>
    </div>
  );
};

const KustoGenerator = () => {
    const [table, setTable] = useState('MyLogs');
    const [fields, setFields] = useState('TimeGenerated, Level, Message');
    const [query, setQuery] = useState('');
    const handleGen = () => {
        const fieldList = fields.split(',').map(f => f.trim()).filter(f => f);
        const q = `${table}\n| where TimeGenerated > ago(24h)\n| project ${fieldList.join(', ')}\n| take 100`;
        setQuery(q);
    };
    return (
        <div className="card p-30 glass-card grid gap-15">
            <h3>Kusto Query Generator</h3>
            <input className="pill" value={table} onChange={e=>setTable(e.target.value)} placeholder="Table Name" />
            <input className="pill" value={fields} onChange={e=>setFields(e.target.value)} placeholder="Fields (comma separated)" />
            <button className="btn-primary" onClick={handleGen}>Generate Query</button>
            {query && <ToolResult result={{ text: query, filename: 'query.kql' }} />}
        </div>
    );
};

const OtpGenerator = () => {
    const [otp, setOtp] = useState('');
    const gen = () => {
        const val = Math.floor(100000 + Math.random() * 900000).toString();
        setOtp(val);
    };
    return (
        <div className="card p-30 glass-card text-center grid gap-15">
            <h3>OTP Generator</h3>
            <button className="btn-primary" onClick={gen}>Generate 6-Digit OTP</button>
            {otp && <div className="h1 tracking-widest font-bold color-primary" style={{ fontSize: '3rem', margin: '20px 0' }}>{otp}</div>}
            {otp && <ToolResult result={{ text: otp }} />}
        </div>
    );
};

const RegexTester = () => {
    const [p, setP] = useState('[a-z]+');
    const [s, setS] = useState('test string');
    const [matchResult, setMatchResult] = useState(null);

    const patterns = {
        email: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
        url: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)',
        phone: '\\+?\\d{1,4}?[-.\\s]?\\(?\\d{1,3}?\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}',
        ipv4: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$'
    };

    useEffect(() => {
        try {
            const regex = new RegExp(p, 'g');
            const matches = [...s.matchAll(regex)];
            if (matches.length > 0) {
                setMatchResult(`Found ${matches.length} matches:\n` + matches.map(m => m[0]).join('\n'));
            } else {
                setMatchResult('No matches found.');
            }
        } catch (e) {
            setMatchResult('Invalid Regex');
        }
    }, [p, s]);

    return (
        <div className="card p-20 glass-card grid gap-15">
            <h3>Regex Tester</h3>
            <div className="pill-group scrollable-x">
                {Object.keys(patterns).map(key => (
                    <button key={key} className="pill" onClick={() => setP(patterns[key])} style={{ textTransform: 'capitalize' }}>{key}</button>
                ))}
            </div>
            <div className="form-group">
                <label>Pattern</label>
                <input className="pill font-mono w-full" value={p} onChange={e => setP(e.target.value)} placeholder="Regex pattern" />
            </div>
            <div className="form-group">
                <label>Test String</label>
                <textarea className="pill font-mono w-full" rows="4" value={s} onChange={e => setS(e.target.value)} placeholder="Text to test against" />
            </div>
            <ToolResult result={{ text: matchResult }} title="Match Result" />
        </div>
    );
};

const JsonFormatter = () => {
    const [v, setV] = useState('');
    const formatted = useMemo(() => { try { return v ? JSON.stringify(JSON.parse(v), null, 2) : ''; } catch(e) { return 'Invalid JSON'; } }, [v]);
    return (<div className="card p-20 glass-card grid gap-15"><h3>JSON Formatter</h3><textarea className="pill font-mono" rows="8" value={v} onChange={e=>setV(e.target.value)} /><ToolResult result={{text: formatted}} /></div>);
};

const SqlFormatter = () => {
    const [v, setV] = useState('');
    const formatted = useMemo(() => {
        if (!v) return '';
        let sql = v.toUpperCase();
        const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'GROUP BY', 'ORDER BY', 'LIMIT', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INSERT INTO', 'UPDATE', 'DELETE', 'VALUES', 'SET'];
        keywords.forEach(k => {
            const regex = new RegExp(`\\b${k}\\b`, 'g');
            sql = sql.replace(regex, `\n${k}`);
        });
        return sql.trim();
    }, [v]);
    return (
        <div className="card p-20 glass-card grid gap-15">
            <h3>SQL Formatter</h3>
            <textarea className="pill font-mono" rows="6" value={v} onChange={e => setV(e.target.value)} placeholder="SELECT * FROM table WHERE id = 1" />
            <ToolResult result={{ text: formatted, filename: 'query.sql' }} />
        </div>
    );
};

const UnitConverterHub = () => {
    const [val, setVal] = useState(1);
    const [res, setRes] = useState(0);
    useEffect(() => { setRes(val * 1000); }, [val]); // Simplified
    return (<div className="card p-30 glass-card grid gap-15"><h3>Unit Converter</h3><input type="number" className="pill" value={val} onChange={e=>setVal(e.target.value)} /><div className="h2 text-center">{res}</div></div>);
};

const Base64Tool = () => {
    const [i, setI] = useState('');
    const [r, setR] = useState('');
    return (<div className="card p-20 glass-card grid gap-10"><h3>Base64</h3><textarea className="pill" value={i} onChange={e=>setI(e.target.value)} /><div className="flex-gap"><button className="pill" onClick={()=>setR(btoa(i))}>Encode</button><button className="pill" onClick={()=>setR(atob(i))}>Decode</button></div><div className="p-10 bg-surface rounded">{r}</div></div>);
};

const SecurityHub = () => {
    const [password, setPassword] = useState('');
    const [length, setLength] = useState(16);
    const [includeSymbols, setIncludeSymbols] = useState(true);
    const [strength, setStrength] = useState('');

    const generatePassword = () => {
        let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        if (includeSymbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";
        let res = "";
        const array = new Uint32Array(length);
        window.crypto.getRandomValues(array);
        for (let i = 0; i < length; i++) {
            res += charset[array[i] % charset.length];
        }
        setPassword(res);
        checkStrength(res);
    };

    const checkStrength = (pw) => {
        let score = 0;
        if (pw.length > 8) score++;
        if (pw.length > 12) score++;
        if (/[A-Z]/.test(pw)) score++;
        if (/[0-9]/.test(pw)) score++;
        if (/[^A-Za-z0-9]/.test(pw)) score++;
        const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
        setStrength(labels[Math.min(score, 4)]);
    };

    return (
        <div className="card p-20 glass-card grid gap-20">
            <h3>Security Hub</h3>
            <div className="grid gap-15">
                <div className="flex-between">
                    <label>Password Length: {length}</label>
                    <input type="range" min="8" max="64" value={length} onChange={e => setLength(e.target.value)} />
                </div>
                <label className="flex-center gap-10 cursor-pointer">
                    <input type="checkbox" checked={includeSymbols} onChange={e => setIncludeSymbols(e.target.checked)} />
                    <span>Include Symbols</span>
                </label>
                <button className="btn-primary" onClick={generatePassword}>Generate Secure Password</button>
                {password && (
                    <div className="grid gap-10">
                        <div className="flex-between font-bold">
                            <span>Strength:</span>
                            <span className={`color-${strength.toLowerCase() === 'excellent' ? 'success' : strength.toLowerCase() === 'strong' ? 'primary' : 'warning'}`}>{strength}</span>
                        </div>
                        <ToolResult result={{ text: password }} title="Generated Password" />
                    </div>
                )}
                <div className="border-top pt-15 mt-10">
                    <button className="pill w-full" onClick={() => alert(crypto.randomUUID())}>Generate UUID v4</button>
                </div>
            </div>
        </div>
    );
};

const JwtDecoder = () => {
    const [token, setToken] = useState('');
    const [result, setResult] = useState(null);

    useEffect(() => {
        if (!token) return setResult(null);
        try {
            const parts = token.split('.');
            if (parts.length !== 3) throw new Error('Invalid JWT format');
            const header = JSON.parse(atob(parts[0]));
            const payload = JSON.parse(atob(parts[1]));
            setResult({
                text: JSON.stringify({ header, payload }, null, 2),
                filename: 'decoded_jwt.json'
            });
        } catch (e) {
            setResult({ error: 'Failed to decode JWT: ' + e.message });
        }
    }, [token]);

    return (
        <div className="card p-20 glass-card grid gap-15">
            <h3>JWT Decoder</h3>
            <textarea className="pill font-mono w-full" rows="4" value={token} onChange={e => setToken(e.target.value)} placeholder="Paste JWT here..." />
            <ToolResult result={result} title="Decoded Token" />
        </div>
    );
};

const CronHelper = () => {
    const [cron, setCron] = useState('* * * * *');
    const [explanation, setExplanation] = useState('');

    const explain = (expr) => {
        const parts = expr.split(' ');
        if (parts.length < 5) return 'Invalid expression';
        const units = ['minute', 'hour', 'day of month', 'month', 'day of week'];
        return parts.map((p, i) => `${units[i]}: ${p === '*' ? 'every' : p}`).join(', ');
    };

    useEffect(() => {
        setExplanation(explain(cron));
    }, [cron]);

    return (
        <div className="card p-20 glass-card grid gap-15">
            <h3>Cron Helper</h3>
            <input className="pill font-mono w-full" value={cron} onChange={e => setCron(e.target.value)} placeholder="* * * * *" />
            <div className="p-15 bg-surface rounded"><strong>Explanation:</strong> {explanation}</div>
            <div className="pill-group">
                <button className="pill" onClick={() => setCron('0 0 * * *')}>Every midnight</button>
                <button className="pill" onClick={() => setCron('*/15 * * * *')}>Every 15 mins</button>
            </div>
            <ToolResult result={{ text: cron }} title="Cron Expression" />
        </div>
    );
};

const UrlTool = () => {
    const [url, setUrl] = useState('');
    const [result, setResult] = useState(null);

    const handleAction = (type) => {
        try {
            if (type === 'encode') setResult({ text: encodeURIComponent(url) });
            else if (type === 'decode') setResult({ text: decodeURIComponent(url) });
            else if (type === 'parse') {
                const parsed = new URL(url);
                const params = {};
                parsed.searchParams.forEach((v, k) => params[k] = v);
                setResult({ text: JSON.stringify({
                    protocol: parsed.protocol,
                    host: parsed.host,
                    pathname: parsed.pathname,
                    params
                }, null, 2) });
            }
        } catch (e) { setResult({ error: e.message }); }
    };

    return (
        <div className="card p-20 glass-card grid gap-15">
            <h3>URL Tool</h3>
            <textarea className="pill font-mono w-full" rows="3" value={url} onChange={e => setUrl(e.target.value)} placeholder="Enter URL or text..." />
            <div className="pill-group">
                <button className="btn-primary" onClick={() => handleAction('encode')}>Encode</button>
                <button className="pill" onClick={() => handleAction('decode')}>Decode</button>
                <button className="pill" onClick={() => handleAction('parse')}>Parse URL</button>
            </div>
            <ToolResult result={result} />
        </div>
    );
};
const YamlConverter = () => {
    const [val, setVal] = useState('');
    const [result, setResult] = useState(null);

    const convert = () => {
        try {
            // Very basic YAML-like logic as we don't have a full YAML lib
            const obj = JSON.parse(val);
            const toYaml = (o, indent = 0) => {
                return Object.entries(o).map(([k, v]) => {
                    const prefix = '  '.repeat(indent);
                    if (typeof v === 'object' && v !== null) return `${prefix}${k}:\n${toYaml(v, indent + 1)}`;
                    return `${prefix}${k}: ${v}`;
                }).join('\n');
            };
            setResult({ text: toYaml(obj), filename: 'converted.yaml' });
        } catch (e) { setResult({ error: 'Invalid JSON input for conversion' }); }
    };

    return (
        <div className="card p-20 glass-card grid gap-15">
            <h3>YAML Converter (JSON to YAML)</h3>
            <textarea className="pill font-mono w-full" rows="6" value={val} onChange={e => setVal(e.target.value)} placeholder="Paste JSON here..." />
            <button className="btn-primary" onClick={convert}>Convert to YAML</button>
            <ToolResult result={result} />
        </div>
    );
};

const Minifier = () => {
    const [val, setVal] = useState('');
    const [type, setType] = useState('js');
    const [result, setResult] = useState(null);

    const minify = () => {
        let res = val;
        if (type === 'js' || type === 'css') {
            res = val.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1') // Remove comments
                     .replace(/\s+/g, ' ') // Collapse whitespace
                     .replace(/\s?([\{\}\[\]\(\)\+\-\*\/\=\,\;\:\>])\s?/g, '$1') // Remove spaces around operators
                     .trim();
        } else if (type === 'html') {
            res = val.replace(/<!--[\s\S]*?-->/g, '') // Remove comments
                     .replace(/>\s+</g, '><') // Remove space between tags
                     .replace(/\s+/g, ' ') // Collapse whitespace
                     .trim();
        }
        setResult({ text: res, filename: `minified.${type}` });
    };

    return (
        <div className="card p-20 glass-card grid gap-15">
            <h3>Minifier</h3>
            <div className="pill-group">
                <button className={`pill ${type === 'js' ? 'active' : ''}`} onClick={() => setType('js')}>JS</button>
                <button className={`pill ${type === 'css' ? 'active' : ''}`} onClick={() => setType('css')}>CSS</button>
                <button className={`pill ${type === 'html' ? 'active' : ''}`} onClick={() => setType('html')}>HTML</button>
            </div>
            <textarea className="pill font-mono w-full" rows="6" value={val} onChange={e => setVal(e.target.value)} placeholder={`Paste ${type.toUpperCase()} here...`} />
            <button className="btn-primary" onClick={minify}>Minify Code</button>
            <ToolResult result={result} />
        </div>
    );
};

const XmlJsonConverter = () => {
    const [val, setVal] = useState('');
    const [result, setResult] = useState(null);

    const toJson = () => {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(val, "text/xml");
            const elementToObj = (el) => {
                const obj = {};
                if (el.attributes.length > 0) {
                    obj["@attributes"] = {};
                    for (let i = 0; i < el.attributes.length; i++) {
                        const attr = el.attributes.item(i);
                        obj["@attributes"][attr.nodeName] = attr.nodeValue;
                    }
                }
                if (el.children.length > 0) {
                    for (let i = 0; i < el.children.length; i++) {
                        const child = el.children.item(i);
                        const nodeName = child.nodeName;
                        if (obj[nodeName] === undefined) obj[nodeName] = elementToObj(child);
                        else {
                            if (!Array.isArray(obj[nodeName])) obj[nodeName] = [obj[nodeName]];
                            obj[nodeName].push(elementToObj(child));
                        }
                    }
                } else obj["#text"] = el.textContent;
                return obj;
            };
            const res = elementToObj(xmlDoc.documentElement);
            setResult({ text: JSON.stringify(res, null, 2), filename: 'converted.json' });
        } catch (e) { setResult({ error: 'Invalid XML: ' + e.message }); }
    };

    return (
        <div className="card p-20 glass-card grid gap-15">
            <h3>XML to JSON Converter</h3>
            <textarea className="pill font-mono w-full" rows="6" value={val} onChange={e => setVal(e.target.value)} placeholder="Paste XML here..." />
            <button className="btn-primary" onClick={toJson}>Convert to JSON</button>
            <ToolResult result={result} />
        </div>
    );
};

const XmlFormatter = () => {
    const [val, setVal] = useState('');
    const [result, setResult] = useState(null);

    const format = () => {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(val, "text/xml");
            if (xmlDoc.getElementsByTagName("parsererror").length > 0) throw new Error("Invalid XML");

            const formatXml = (node, level = 0) => {
                const indent = "  ".repeat(level);
                let xml = "";
                if (node.nodeType === 1) { // Element
                    xml += indent + "<" + node.nodeName;
                    for (let i = 0; i < node.attributes.length; i++) {
                        const attr = node.attributes.item(i);
                        xml += " " + attr.nodeName + '="' + attr.nodeValue + '"';
                    }
                    if (node.childNodes.length === 0) xml += " />\n";
                    else {
                        xml += ">\n";
                        for (let i = 0; i < node.childNodes.length; i++) xml += formatXml(node.childNodes[i], level + 1);
                        xml += indent + "</" + node.nodeName + ">\n";
                    }
                } else if (node.nodeType === 3) { // Text
                    const text = node.nodeValue.trim();
                    if (text) xml += indent + text + "\n";
                }
                return xml;
            };
            setResult({ text: formatXml(xmlDoc.documentElement), filename: 'formatted.xml' });
        } catch (e) { setResult({ error: e.message }); }
    };

    return (
        <div className="card p-20 glass-card grid gap-15">
            <h3>XML Formatter</h3>
            <textarea className="pill font-mono w-full" rows="6" value={val} onChange={e => setVal(e.target.value)} placeholder="Paste XML here..." />
            <button className="btn-primary" onClick={format}>Format XML</button>
            <ToolResult result={result} />
        </div>
    );
};

const JsonToTs = () => {
    const [val, setVal] = useState('');
    const [result, setResult] = useState(null);

    const generate = () => {
        try {
            const obj = JSON.parse(val);
            const getTsType = (v) => {
                if (Array.isArray(v)) return v.length > 0 ? `${getTsType(v[0])}[]` : 'any[]';
                if (typeof v === 'object' && v !== null) return '{ ' + Object.entries(v).map(([k, val]) => `${k}: ${getTsType(val)}`).join('; ') + ' }';
                return typeof v;
            };
            const ts = `interface RootObject {\n` + Object.entries(obj).map(([k, v]) => `  ${k}: ${getTsType(v)};`).join('\n') + `\n}`;
            setResult({ text: ts, filename: 'types.ts' });
        } catch (e) { setResult({ error: 'Invalid JSON' }); }
    };

    return (
        <div className="card p-20 glass-card grid gap-15">
            <h3>JSON to TypeScript</h3>
            <textarea className="pill font-mono w-full" rows="6" value={val} onChange={e => setVal(e.target.value)} placeholder="Paste JSON here..." />
            <button className="btn-primary" onClick={generate}>Generate Interface</button>
            <ToolResult result={result} />
        </div>
    );
};
const ColorPicker = () => {
    const [color, setColor] = useState('#6366f1');

    const hexToRgb = (hex) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgb(${r}, ${g}, ${b})`;
    };

    return (
        <div className="card p-20 glass-card grid gap-20">
            <h3>Color Picker</h3>
            <div className="flex-center gap-20">
                <input type="color" value={color} onChange={e => setColor(e.target.value)} style={{ width: '100px', height: '100px', padding: 0, border: 'none', borderRadius: '12px', cursor: 'pointer' }} />
                <div className="grid gap-10 flex-1">
                    <div className="flex-between p-10 bg-surface rounded">
                        <span>HEX</span>
                        <code className="font-bold">{color.toUpperCase()}</code>
                    </div>
                    <div className="flex-between p-10 bg-surface rounded">
                        <span>RGB</span>
                        <code className="font-bold">{hexToRgb(color)}</code>
                    </div>
                </div>
            </div>
            <ToolResult result={{ text: color.toUpperCase() }} title="Selected Color" />
        </div>
    );
};

const DiffViewer = () => {
    const [oldText, setOldText] = useState('');
    const [newText, setNewText] = useState('');
    const [diff, setDiff] = useState([]);

    const compare = () => {
        const result = diffLines(oldText, newText);
        setDiff(result);
    };

    return (
        <div className="card p-20 glass-card grid gap-20">
            <h3>Diff Viewer</h3>
            <div className="grid grid-2-cols gap-15">
                <textarea className="pill font-mono w-full" rows="8" value={oldText} onChange={e => setOldText(e.target.value)} placeholder="Original text..." />
                <textarea className="pill font-mono w-full" rows="8" value={newText} onChange={e => setNewText(e.target.value)} placeholder="Modified text..." />
            </div>
            <button className="btn-primary" onClick={compare}>Compare Texts</button>
            {diff.length > 0 && (
                <div className="tool-result font-mono" style={{ whiteSpace: 'pre-wrap', maxHeight: '400px', overflow: 'auto' }}>
                    {diff.map((part, i) => (
                        <div key={i} style={{
                            backgroundColor: part.added ? 'rgba(0, 255, 0, 0.1)' : part.removed ? 'rgba(255, 0, 0, 0.1)' : 'transparent',
                            color: part.added ? '#2e7d32' : part.removed ? '#c62828' : 'inherit',
                            padding: '2px 4px'
                        }}>
                            {part.added ? '+ ' : part.removed ? '- ' : '  '}{part.value}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const QrBarcodeGenerator = () => {
    const [val, setVal] = useState('https://epic-toolbox.vercel.app');
    const [type, setType] = useState('qr');
    const barcodeRef = useRef(null);

    useEffect(() => {
        if (type === 'barcode' && barcodeRef.current) {
            try {
                JsBarcode(barcodeRef.current, val, { format: "CODE128", width: 2, height: 100, displayValue: true });
            } catch (e) {}
        }
    }, [val, type]);

    return (
        <div className="card p-20 glass-card grid gap-20">
            <h3>QR & Barcode Generator</h3>
            <div className="pill-group">
                <button className={`pill ${type === 'qr' ? 'active' : ''}`} onClick={() => setType('qr')}>QR Code</button>
                <button className={`pill ${type === 'barcode' ? 'active' : ''}`} onClick={() => setType('barcode')}>Barcode</button>
            </div>
            <input className="pill w-full" value={val} onChange={e => setVal(e.target.value)} placeholder="Enter content..." />
            <div className="flex-center p-20 bg-white rounded-xl" style={{ minHeight: '200px' }}>
                {type === 'qr' ? (
                    <QRCodeSVG value={val} size={200} level="H" includeMargin={true} />
                ) : (
                    <svg ref={barcodeRef}></svg>
                )}
            </div>
            <ToolResult result={{ text: val }} title="Generator Data" />
        </div>
    );
};

export default DevTools;
