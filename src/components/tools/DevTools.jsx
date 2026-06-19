import React, { useState, useEffect, useMemo, useRef } from 'react';
import { diffLines } from 'diff';
import { create, all } from 'mathjs';
import { QRCodeSVG } from 'qrcode.react';
import JsBarcode from 'jsbarcode';
import ToolResult from './ToolResult';

const math = create(all);

// --- UNIT CONVERTER HUB ---
const UnitConverterHub = ({ subtool }) => {
    const tabs = [
        { id: 'length-conv', label: 'Length' },
        { id: 'weight-conv', label: 'Weight' },
        { id: 'temp-conv', label: 'Temperature' },
        { id: 'data-conv', label: 'Data' },
        { id: 'area-conv', label: 'Area' },
        { id: 'volume-conv', label: 'Volume' },
        { id: 'energy-conv', label: 'Energy' }
    ];
    const [activeTab, setActiveTab] = useState('length-conv');
    const [value, setValue] = useState(1);
    const [fromUnit, setFromUnit] = useState('km');
    const [toUnit, setToUnit] = useState('m');
    const [result, setResult] = useState(0);

    const unitOptions = {
        'length-conv': [
            { v: 'mm', l: 'Millimeter' }, { v: 'cm', l: 'Centimeter' }, { v: 'm', l: 'Meter' },
            { v: 'km', l: 'Kilometer' }, { v: 'inch', l: 'Inch' }, { v: 'foot', l: 'Foot' },
            { v: 'yard', l: 'Yard' }, { v: 'mile', l: 'Mile' }
        ],
        'weight-conv': [
            { v: 'mg', l: 'Milligram' }, { v: 'g', l: 'Gram' }, { v: 'kg', l: 'Kilogram' },
            { v: 'oz', l: 'Ounce' }, { v: 'lb', l: 'Pound' }, { v: 'ton', l: 'Ton' }
        ],
        'temp-conv': [
            { v: 'degC', l: 'Celsius' }, { v: 'degF', l: 'Fahrenheit' }, { v: 'K', l: 'Kelvin' }
        ],
        'data-conv': [
            { v: 'b', l: 'Bit' }, { v: 'B', l: 'Byte' }, { v: 'KB', l: 'KB' },
            { v: 'MB', l: 'MB' }, { v: 'GB', l: 'GB' }, { v: 'TB', l: 'TB' }
        ],
        'area-conv': [
            { v: 'm2', l: 'Sq Meter' }, { v: 'km2', l: 'Sq Kilometer' }, { v: 'ft2', l: 'Sq Foot' },
            { v: 'mi2', l: 'Sq Mile' }, { v: 'acre', l: 'Acre' }, { v: 'hectare', l: 'Hectare' }
        ],
        'volume-conv': [
            { v: 'ml', l: 'Milliliter' }, { v: 'l', l: 'Liter' }, { v: 'm3', l: 'Cubic Meter' },
            { v: 'gal', l: 'Gallon' }, { v: 'qt', l: 'Quart' }, { v: 'pt', l: 'Pint' }
        ],
        'energy-conv': [
            { v: 'J', l: 'Joule' }, { v: 'kJ', l: 'Kilojoule' }, { v: 'cal', l: 'Calorie' },
            { v: 'kcal', l: 'Kilocalorie' }, { v: 'Wh', l: 'Watt-hour' }, { v: 'kWh', l: 'Kilowatt-hour' }
        ]
    };

    useEffect(() => {
        if (subtool) {
            if (['length-conv', 'weight-conv', 'temp-conv', 'data-conv'].includes(subtool)) {
                setActiveTab(subtool);
            }
        }
    }, [subtool]);

    useEffect(() => {
        const units = unitOptions[activeTab];
        if (units) {
            setFromUnit(units[0].v);
            setToUnit(units[1] ? units[1].v : units[0].v);
        }
    }, [activeTab]);

    useEffect(() => {
        try {
            const res = math.unit(parseFloat(value) || 0, fromUnit).toNumber(toUnit);
            setResult(res.toLocaleString(undefined, { maximumFractionDigits: 4 }));
        } catch (e) {
            setResult('Error');
        }
    }, [value, fromUnit, toUnit]);

    return (
        <div className="grid gap-15">
            <div className="pill-group scrollable-x">
                {tabs.map(t => (
                    <button key={t.id} className={`pill ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>{t.label}</button>
                ))}
            </div>
            <div className="card p-20 glass-card">
                <input type="number" className="pill mb-15 text-center h2" value={value} onChange={e => setValue(e.target.value)} />
                <div className="flex-center gap-10">
                    <select className="pill flex-1" value={fromUnit} onChange={e=>setFromUnit(e.target.value)}>
                        {unitOptions[activeTab].map(u => <option key={u.v} value={u.v}>{u.l}</option>)}
                    </select>
                    <span className="material-icons">arrow_forward</span>
                    <select className="pill flex-1" value={toUnit} onChange={e=>setToUnit(e.target.value)}>
                        {unitOptions[activeTab].map(u => <option key={u.v} value={u.v}>{u.l}</option>)}
                    </select>
                </div>
                <div className="tool-result text-center mt-20">
                    <div className="h2 color-primary">{result}</div>
                    <div className="opacity-6 font-bold">{toUnit}</div>
                </div>
            </div>
            <ToolResult result={`${value} ${fromUnit} = ${result} ${toUnit}`} />
        </div>
    );
};

// --- CORE DEV TOOLS ---
const DiffViewer = () => {
    const [oldT, setOldT] = useState('Hello World\nEpic Toolbox');
    const [newT, setNewT] = useState('Hello Epic Toolbox\nEpic Toolbox v2');
    const diff = diffLines(oldT, newT);
    const resultText = diff.map(p => (p.added ? '+ ' : p.removed ? '- ' : '  ') + p.value).join('');

    return (
        <div className="grid gap-15">
            <div className="grid grid-2 gap-10">
                <textarea className="pill font-mono" rows="6" value={oldT} onChange={e=>setOldT(e.target.value)} />
                <textarea className="pill font-mono" rows="6" value={newT} onChange={e=>setNewT(e.target.value)} />
            </div>
            <div className="card p-20 glass-card font-mono text-sm">
                {diff.map((p, i) => (
                    <div key={i} style={{ color: p.added ? 'var(--green)' : p.removed ? 'var(--danger)' : 'inherit', background: p.added ? 'rgba(var(--green-rgb), 0.1)' : p.removed ? 'rgba(var(--red-rgb), 0.1)' : 'transparent' }}>
                        {p.added ? '+ ' : p.removed ? '- ' : '  '}{p.value}
                    </div>
                ))}
            </div>
            <ToolResult result={{ text: resultText, filename: 'diff.txt' }} />
        </div>
    );
};

const SqlFormatter = () => {
    const [sql, setSql] = useState("SELECT u.id, u.name, o.order_date FROM users u JOIN orders o ON u.id = o.user_id WHERE u.active = 1 AND o.total > 100 GROUP BY u.id ORDER BY o.order_date DESC");
    const formatted = useMemo(() => {
        if (!sql) return '';
        const keywords = [
            'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY', 'LIMIT',
            'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'CROSS JOIN', 'ON',
            'HAVING', 'INSERT INTO', 'UPDATE', 'SET', 'DELETE FROM', 'VALUES',
            'CREATE TABLE', 'DROP TABLE', 'UNION', 'ALL', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END'
        ];
        const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'gi');
        let result = sql.replace(/\s+/g, ' ').trim();
        result = result.replace(regex, (m) => `\n${m.toUpperCase()}`);
        return result.split('\n').map(line => line.trim()).filter(line => line).join('\n').trim();
    }, [sql]);

    return (
        <div className="card p-20 glass-card">
            <textarea className="pill font-mono mb-15" rows="6" value={sql} onChange={e=>setSql(e.target.value)} placeholder="Paste SQL here..." />
            <ToolResult result={{ text: formatted, filename: 'formatted.sql' }} />
        </div>
    );
};

const JsonFormatter = () => {
    const [val, setVal] = useState('');
    const [result, setResult] = useState(null);

    useEffect(() => {
        try {
            if (!val) { setResult(null); return; }
            const parsed = JSON.parse(val);
            setResult({ text: JSON.stringify(parsed, null, 2), filename: 'formatted.json' });
        } catch (e) {
            setResult(null);
        }
    }, [val]);

    return (
        <div className="card p-20 glass-card">
            <textarea className="pill font-mono" rows="8" placeholder='{"key": "value"}' value={val} onChange={e => setVal(e.target.value)} />
            <ToolResult result={result} />
        </div>
    );
};

const Base64Tool = () => {
    const [input, setInput] = useState('');
    const [result, setResult] = useState(null);
    const process = (mode) => {
        try {
            let res;
            if (mode === 'encode') {
                const uint8 = new TextEncoder().encode(input);
                res = btoa(String.fromCharCode(...uint8));
            } else {
                const bin = atob(input);
                const uint8 = new Uint8Array(bin.length);
                for (let i = 0; i < bin.length; i++) uint8[i] = bin.charCodeAt(i);
                res = new TextDecoder().decode(uint8);
            }
            setResult({ text: res, filename: `base64_${mode}.txt` });
        } catch (e) { alert("Invalid input for " + mode); }
    };
    return (
        <div className="card p-20 glass-card">
            <textarea className="pill font-mono mb-15" rows="5" value={input} onChange={e => setInput(e.target.value)} placeholder="Enter text..." />
            <div className="flex-gap mb-15">
                <button className="btn-primary flex-1" onClick={() => process('encode')}>Encode</button>
                <button className="pill flex-1" onClick={() => process('decode')}>Decode</button>
            </div>
            <ToolResult result={result} />
        </div>
    );
};

const UrlTool = () => {
    const [input, setInput] = useState('');
    const [result, setResult] = useState(null);
    const encode = () => setResult({ text: encodeURIComponent(input) });
    const decode = () => { try { setResult({ text: decodeURIComponent(input) }); } catch(e) { alert("Invalid URI"); } };
    return (
        <div className="card p-20 glass-card">
            <textarea className="pill font-mono mb-15" rows="5" value={input} onChange={e => setInput(e.target.value)} placeholder="URL or text..." />
            <div className="flex-gap mb-15">
                <button className="btn-primary flex-1" onClick={encode}>Encode</button>
                <button className="pill flex-1" onClick={decode}>Decode</button>
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
            if (val.trim().startsWith('{') || val.trim().startsWith('[')) {
                const obj = JSON.parse(val);
                const toYaml = (o, indent = '') => {
                    let yaml = '';
                    for (let key in o) {
                        if (typeof o[key] === 'object' && o[key] !== null) {
                            yaml += `${indent}${key}:\n${toYaml(o[key], indent + '  ')}`;
                        } else {
                            yaml += `${indent}${key}: ${o[key]}\n`;
                        }
                    }
                    return yaml;
                };
                setResult({ text: toYaml(obj), filename: 'converted.yaml' });
            } else {
                const lines = val.split('\n');
                const obj = {};
                lines.forEach(line => {
                    const parts = line.split(':');
                    if (parts.length >= 2) obj[parts[0].trim()] = parts.slice(1).join(':').trim();
                });
                setResult({ text: JSON.stringify(obj, null, 2), filename: 'converted.json' });
            }
        } catch(e) { alert("Invalid format: " + e.message); }
    };
    return (
        <div className="card p-20 glass-card">
            <textarea className="pill font-mono mb-15" rows="8" value={val} onChange={e=>setVal(e.target.value)} placeholder="JSON or basic YAML..." />
            <button className="btn-primary w-full mb-15" onClick={convert}>Convert (Basic)</button>
            <ToolResult result={result} />
        </div>
    );
};

const XmlJsonConverter = () => {
    const [val, setVal] = useState('');
    const [result, setResult] = useState(null);
    const convert = (mode) => {
        try {
            if (mode === 'xml2json') {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(val, "text/xml");
                const toJson = (node) => {
                    const obj = {};
                    if (node.nodeType === 1) {
                        if (node.attributes.length > 0) {
                            obj["@attributes"] = {};
                            for (let i = 0; i < node.attributes.length; i++) {
                                const attr = node.attributes.item(i);
                                obj["@attributes"][attr.nodeName] = attr.nodeValue;
                            }
                        }
                    } else if (node.nodeType === 3) {
                        return node.nodeValue.trim();
                    }
                    if (node.hasChildNodes()) {
                        for (let i = 0; i < node.childNodes.length; i++) {
                            const item = node.childNodes.item(i);
                            const nodeName = item.nodeName;
                            const res = toJson(item);
                            if (res === "" && item.nodeType === 3) continue;
                            if (typeof obj[nodeName] === "undefined") {
                                obj[nodeName] = res;
                            } else {
                                if (!Array.isArray(obj[nodeName])) obj[nodeName] = [obj[nodeName]];
                                obj[nodeName].push(res);
                            }
                        }
                    }
                    return Object.keys(obj).length === 0 ? "" : obj;
                };
                const res = toJson(xmlDoc.documentElement);
                setResult({ text: JSON.stringify(res, null, 2), filename: 'converted.json' });
            } else {
                const obj = JSON.parse(val);
                const toXml = (o, name) => {
                    let xml = `<${name}>`;
                    for (let key in o) {
                        if (Array.isArray(o[key])) o[key].forEach(item => xml += toXml(item, key));
                        else if (typeof o[key] === 'object' && o[key] !== null) xml += toXml(o[key], key);
                        else xml += `<${key}>${o[key]}</${key}>`;
                    }
                    xml += `</${name}>`;
                    return xml;
                };
                setResult({ text: toXml(obj, 'root'), filename: 'converted.xml' });
            }
        } catch(e) { alert("Conversion failed: " + e.message); }
    };
    return (
        <div className="card p-20 glass-card">
            <textarea className="pill font-mono mb-15" rows="8" value={val} onChange={e=>setVal(e.target.value)} placeholder="XML or JSON..." />
            <div className="flex-gap mb-15">
                <button className="btn-primary flex-1" onClick={() => convert('xml2json')}>XML to JSON</button>
                <button className="pill flex-1" onClick={() => convert('json2xml')}>JSON to XML</button>
            </div>
            <ToolResult result={result} />
        </div>
    );
};

const XmlFormatter = () => {
    const [xml, setXml] = useState('');
    const [result, setResult] = useState(null);
    const format = () => {
        let formatted = '', indent= '';
        const nodes = xml.replace(/>\s*</g, '><').split(/(?=<)|(?<=>)/);
        nodes.forEach(node => {
            if (node.startsWith('</')) indent = indent.substring(2);
            if (node.trim()) formatted += indent + node + '\r\n';
            if (node.startsWith('<') && !node.startsWith('</') && !node.endsWith('/>') && !node.startsWith('<?')) indent += '  ';
        });
        setResult({ text: formatted.trim(), filename: 'formatted.xml' });
    };
    return (
        <div className="card p-20 glass-card">
            <textarea className="pill font-mono mb-15" rows="8" value={xml} onChange={e=>setXml(e.target.value)} placeholder="<xml>...</xml>" />
            <button className="btn-primary w-full mb-15" onClick={format}>Format XML</button>
            <ToolResult result={result} />
        </div>
    );
};

const JsonToTs = () => {
    const [json, setJson] = useState('');
    const [result, setResult] = useState(null);
    const generate = () => {
        try {
            const obj = JSON.parse(json);
            const getType = (v) => {
                if (Array.isArray(v)) return v.length > 0 ? `${getType(v[0])}[]` : 'any[]';
                if (v === null) return 'any';
                if (typeof v === 'object') return 'Record<string, any>';
                return typeof v;
            };
            let ts = "interface RootObject {\n";
            Object.keys(obj).forEach(key => {
                ts += `  ${key}: ${getType(obj[key])};\n`;
            });
            ts += "}";
            setResult({ text: ts, filename: 'types.ts' });
        } catch(e) { alert("Invalid JSON"); }
    };
    return (
        <div className="card p-20 glass-card">
            <textarea className="pill font-mono mb-15" rows="8" value={json} onChange={e=>setJson(e.target.value)} placeholder='{"id": 1}' />
            <button className="btn-primary w-full mb-15" onClick={generate}>Generate TypeScript</button>
            <ToolResult result={result} />
        </div>
    );
};

const CronHelper = () => {
    const [exp, setExp] = useState('* * * * *');

    const parseCron = (cron) => {
        const parts = cron.trim().split(/\s+/);
        if (parts.length !== 5) return 'Invalid cron expression (must be 5 parts)';

        const [min, hour, dom, mon, dow] = parts;

        const parsePart = (val, type) => {
            if (val === '*') return 'every ' + type;
            if (val.includes('/')) {
                const [range, step] = val.split('/');
                return `every ${step} ${type}s`;
            }
            if (val.includes(',')) return `at ${type}s ${val}`;
            if (val.includes('-')) return `from ${type} ${val.split('-')[0]} to ${val.split('-')[1]}`;
            return `at ${type} ${val}`;
        };

        let description = 'Runs ';
        if (min === '0' && hour === '0' && dom === '*' && mon === '*' && dow === '*') return 'Daily at midnight';
        if (min === '0' && hour === '*' && dom === '*' && mon === '*' && dow === '*') return 'Hourly at minute 0';
        if (min === '*' && hour === '*' && dom === '*' && mon === '*' && dow === '*') return 'Every minute';

        description += `${parsePart(min, 'minute')}, ${parsePart(hour, 'hour')}, ${parsePart(dom, 'day of month')}, ${parsePart(mon, 'month')}, ${parsePart(dow, 'day of week')}`;
        return description;
    };

    const desc = useMemo(() => parseCron(exp), [exp]);

    const update = (v) => setExp(v);

    return (
        <div className="card p-20 glass-card text-center">
            <input className="pill text-center h3 mb-10 w-full" value={exp} onChange={e=>update(e.target.value)} />
            <div className="opacity-6 mb-15">{desc}</div>
            <div className="pill-group mb-15" style={{justifyContent: 'center'}}>
                <button className="pill" onClick={()=>update('0 0 * * *')}>Daily</button>
                <button className="pill" onClick={()=>update('*/5 * * * *')}>5 Min</button>
                <button className="pill" onClick={()=>update('0 * * * *')}>Hourly</button>
                <button className="pill" onClick={()=>update('30 15 * * 1-5')}>Workdays 3:30 PM</button>
            </div>
            <ToolResult result={`Cron: ${exp}\nDescription: ${desc}`} />
        </div>
    );
};

const QrBarcodeGenerator = () => {
    const [text, setText] = useState('Epic Toolbox');
    const [type, setType] = useState('qr');
    const barcodeRef = useRef(null);

    useEffect(() => {
        if (type === 'barcode' && barcodeRef.current) {
            try {
                JsBarcode(barcodeRef.current, text, {
                    format: "CODE128",
                    displayValue: true,
                    fontSize: 18,
                    margin: 10
                });
            } catch (e) {
                console.error("Barcode generation failed", e);
            }
        }
    }, [text, type]);

    const download = () => {
        const svg = document.querySelector(type === 'qr' ? '.qr-container svg' : '.barcode-container svg');
        if (!svg) return;
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.download = `${type}.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
        };
        img.src = "data:image/svg+xml;base64," + btoa(svgData);
    };

    return (
        <div className="grid gap-20">
            <div className="card p-25 glass-card grid gap-15">
                <div className="pill-group mb-10">
                    <button className={`pill ${type === 'qr' ? 'active' : ''}`} onClick={() => setType('qr')}>QR Code</button>
                    <button className={`pill ${type === 'barcode' ? 'active' : ''}`} onClick={() => setType('barcode')}>Barcode (CODE128)</button>
                </div>
                <input className="pill" value={text} onChange={e => setText(e.target.value)} placeholder="Enter text or URL..." />

                <div className="flex-center p-20 bg-white rounded-lg" style={{ minHeight: '200px' }}>
                    {type === 'qr' ? (
                        <div className="qr-container">
                            <QRCodeSVG value={text} size={200} level="H" includeMargin={true} />
                        </div>
                    ) : (
                        <div className="barcode-container">
                            <svg ref={barcodeRef}></svg>
                        </div>
                    )}
                </div>

                <button className="btn-primary w-full" onClick={download}>
                    <span className="material-icons">download</span> Download PNG
                </button>
            </div>
            <ToolResult result={`Type: ${type.toUpperCase()}\nContent: ${text}`} />
        </div>
    );
};

const ColorPicker = () => {
    const [color, setColor] = useState('#00ff00');
    const hexToRgb = (hex) => {
        const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
        return `rgb(${r}, ${g}, ${b})`;
    };
    return (
        <div className="card p-20 glass-card text-center">
            <input type="color" className="w-full mb-15" style={{height: '100px', border: 'none', borderRadius: '12px'}} value={color} onChange={e=>setColor(e.target.value)} />
            <div className="h3 font-mono">{color.toUpperCase()}</div>
            <div className="opacity-6 mb-15">{hexToRgb(color)}</div>
            <ToolResult result={`HEX: ${color.toUpperCase()}\nRGB: ${hexToRgb(color)}`} />
        </div>
    );
};

const Minifier = () => {
    const [input, setInput] = useState('');
    const [mode, setMode] = useState('json');
    const [result, setResult] = useState(null);
    const minify = () => {
        let res = input;
        if (mode === 'json') { try { res = JSON.stringify(JSON.parse(input)); } catch(e) {} }
        else if (mode === 'css') res = input.replace(/\/\*[\s\S]*?\*\/|(?:\s+|(\s*\{\s*|\s*\}\s*|\s*:\s*|\s*;\s*))/g, '$1');
        else res = input.replace(/\s+/g, ' ').trim();
        setResult({ text: res, filename: `minified.${mode}` });
    };
    return (
        <div className="card p-20 glass-card">
            <div className="flex-gap mb-10">
                <select className="pill flex-1" value={mode} onChange={e=>setMode(e.target.value)}>
                    <option value="json">JSON</option>
                    <option value="css">CSS</option>
                    <option value="html">HTML</option>
                </select>
                <button className="btn-primary flex-1" onClick={minify}>Minify</button>
            </div>
            <textarea className="pill font-mono mb-15" rows="8" value={input} onChange={e=>setInput(e.target.value)} />
            <ToolResult result={result} />
        </div>
    );
};

const JwtDecoder = () => {
    const [jwt, setJwt] = useState('');
    const [result, setResult] = useState(null);
    const decode = () => {
        try {
            const parts = jwt.split('.');
            if (parts.length !== 3) throw new Error("Invalid JWT");
            const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
            const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
            setResult({ text: JSON.stringify({ header, payload }, null, 2), filename: 'jwt_decoded.json' });
        } catch (e) { alert("Invalid JWT format"); }
    };
    return (
        <div className="card p-20 glass-card">
            <textarea className="pill font-mono mb-15" rows="5" value={jwt} onChange={e => setJwt(e.target.value)} placeholder="Paste JWT here..." />
            <button className="btn-primary w-full mb-15" onClick={decode}>Decode JWT</button>
            <ToolResult result={result} />
        </div>
    );
};

const RegexTester = () => {
    const [pattern, setPattern] = useState('[a-z]+');
    const [flags, setFlags] = useState('gi');
    const [testString, setTestString] = useState('Epic Toolbox 2024');
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        try {
            const regex = new RegExp(pattern, flags);
            const found = [...testString.matchAll(regex)];
            setMatches(found.map(m => m[0]));
        } catch (e) {
            setMatches([]);
        }
    }, [pattern, flags, testString]);

    return (
        <div className="card p-20 glass-card grid gap-15">
            <div className="flex-gap">
                <div className="form-group flex-1">
                    <label>Regex Pattern</label>
                    <input className="pill font-mono" value={pattern} onChange={e => setPattern(e.target.value)} placeholder="[a-z]+" />
                </div>
                <div className="form-group" style={{ width: '80px' }}>
                    <label>Flags</label>
                    <input className="pill font-mono" value={flags} onChange={e => setFlags(e.target.value)} placeholder="gi" />
                </div>
            </div>
            <div className="form-group">
                <label>Test String</label>
                <textarea className="pill font-mono" rows="4" value={testString} onChange={e => setTestString(e.target.value)} />
            </div>
            <div className="tool-result">
                <div className="opacity-6 mb-10 small uppercase font-bold">Matches ({matches.length})</div>
                <div className="flex-gap flex-wrap">
                    {matches.length > 0 ? matches.map((m, i) => (
                        <span key={i} className="pill active" style={{ fontSize: '0.8rem' }}>{m}</span>
                    )) : <span className="opacity-4">No matches found.</span>}
                </div>
            </div>
            <ToolResult result={`Matches (${matches.length}):\n${matches.join(', ')}`} />
        </div>
    );
};

const SecurityHub = ({ subtool }) => {
    const [hashInput, setHashInput] = useState('');
    const [algo, setAlgo] = useState('SHA-256');
    const [result, setResult] = useState(null);

    const genHash = async () => {
        const msgUint8 = new TextEncoder().encode(hashInput);
        const hashBuffer = await crypto.subtle.digest(algo, msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        setResult({ text: hashHex, filename: 'hash.txt' });
    };

    return (
        <div className="grid gap-20">
            <div className="card p-25 glass-card text-center">
                <h3 className="mb-15">Quick Actions</h3>
                <div className="grid grid-2-cols gap-10">
                    <button className="btn-primary" onClick={() => setResult({text: crypto.randomUUID(), filename: 'uuid.txt'})}>Gen UUID</button>
                    <button className="pill" onClick={() => {
                        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
                        const array = new Uint32Array(16);
                        window.crypto.getRandomValues(array);
                        let password = '';
                        for (let i = 0; i < array.length; i++) {
                            password += chars[array[i] % chars.length];
                        }
                        setResult({text: password, filename: 'password.txt'});
                    }}>Gen Password</button>
                </div>
            </div>
            <div className="card p-25 glass-card">
                <h3 className="mb-15">Hash Generator</h3>
                <div className="grid gap-10">
                    <input className="pill" value={hashInput} onChange={e=>setHashInput(e.target.value)} placeholder="Text to hash..." />
                    <div className="flex-gap">
                        <select className="pill flex-1" value={algo} onChange={e=>setAlgo(e.target.value)}>
                            <option value="SHA-1">SHA-1</option>
                            <option value="SHA-256">SHA-256</option>
                            <option value="SHA-512">SHA-512</option>
                        </select>
                        <button className="btn-primary flex-1" onClick={genHash} disabled={!hashInput}>Generate Hash</button>
                    </div>
                </div>
            </div>
            <ToolResult result={result} />
        </div>
    );
};

const DevTools = ({ toolId, onSubtoolChange }) => {
  const tabs = [
    { id: 'json-fmt', label: 'JSON Formatter' },
    { id: 'sql', label: 'SQL Formatter' },
    { id: 'diff', label: 'Diff Viewer' },
    { id: 'converter', label: 'Unit Converter' },
    { id: 'security', label: 'Security Hub' },
    { id: 'regex', label: 'Regex Tester' },
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
  const subtoolRef = useRef(onSubtoolChange);

  useEffect(() => {
    subtoolRef.current = onSubtoolChange;
  }, [onSubtoolChange]);

  useEffect(() => {
    if (toolId) {
        if (toolId === 'json-formatter') setActiveTab('json-fmt');
        else if (toolId === 'sql-formatter') setActiveTab('sql');
        else if (toolId === 'diff-viewer') setActiveTab('diff');
        else if (['length-conv', 'weight-conv', 'temp-conv', 'data-conv'].includes(toolId)) setActiveTab('converter');
        else if (['password-gen', 'hash-gen', 'uuid-gen'].includes(toolId)) setActiveTab('security');
        else if (toolId === 'regex-tester') setActiveTab('regex');
        else if (toolId === 'base64') setActiveTab('base64');
        else if (toolId === 'jwt-decoder') setActiveTab('jwt');
        else if (toolId === 'cron-helper') setActiveTab('cron');
        else if (toolId === 'url-tool') setActiveTab('url');
        else if (toolId === 'yaml-conv') setActiveTab('yaml');
        else if (toolId === 'minifier') setActiveTab('minifier');
        else if (toolId === 'xml-json') setActiveTab('xml-json');
        else if (toolId === 'xml-formatter') setActiveTab('xml-fmt');
        else if (toolId === 'json-to-ts') setActiveTab('json-ts');
        else if (toolId === 'color-picker') setActiveTab('color');
        else if (toolId === 'qr-barcode') setActiveTab('qr-barcode');
    }
  }, [toolId]);

  useEffect(() => {
    const current = tabs.find(t => t.id === activeTab);
    if (current && subtoolRef.current) subtoolRef.current(current.label);
  }, [activeTab]);

  return (
    <div className="tool-form mt-20">
      <div className="pill-group mb-20 scrollable-x">
        {tabs.map(tab => (
          <button key={tab.id} className={`pill ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="hub-content animate-fadeIn">
        {activeTab === 'json-fmt' && <JsonFormatter />}
        {activeTab === 'sql' && <SqlFormatter />}
        {activeTab === 'diff' && <DiffViewer />}
        {activeTab === 'converter' && <UnitConverterHub subtool={toolId} />}
        {activeTab === 'security' && <SecurityHub subtool={toolId} />}
        {activeTab === 'regex' && <RegexTester />}
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

export default DevTools;
