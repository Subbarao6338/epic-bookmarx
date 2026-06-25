import React, { useState } from 'react';
import ToolResult from '../ToolResult';

const XmlTools = () => {
    const [input, setInput] = useState('');
    const [result, setResult] = useState(null);

    const formatXml = () => {
        if (!input) return;
        try {
            let formatted = '';
            let indent = '';
            const tab = '  ';
            input.split(/>\s*</).forEach(node => {
                if (node.match(/^\/\w/)) indent = indent.substring(tab.length);
                formatted += indent + '<' + node + '>\n';
                if (node.match(/^<?\w[^>]*[^\/]$/) && !node.startsWith('?')) indent += tab;
            });
            setResult({ text: formatted.substring(1, formatted.length - 2), filename: 'formatted.xml' });
        } catch (e) {
            setResult({ error: e.message });
        }
    };

    const xmlToJson = () => {
        if (!input) return;
        try {
            const parser = new DOMParser();
            const xml = parser.parseFromString(input, "text/xml");

            const parseNode = (node) => {
                const obj = {};
                if (node.nodeType === 1) { // element
                    if (node.attributes.length > 0) {
                        obj["@attributes"] = {};
                        for (let j = 0; j < node.attributes.length; j++) {
                            const attribute = node.attributes.item(j);
                            obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                        }
                    }
                } else if (node.nodeType === 3) { // text
                    return node.nodeValue;
                }

                if (node.hasChildNodes()) {
                    for (let i = 0; i < node.childNodes.length; i++) {
                        const item = node.childNodes.item(i);
                        const nodeName = item.nodeName;
                        if (obj[nodeName] === undefined) {
                            obj[nodeName] = parseNode(item);
                        } else {
                            if (obj[nodeName].push === undefined) {
                                const old = obj[nodeName];
                                obj[nodeName] = [];
                                obj[nodeName].push(old);
                            }
                            obj[nodeName].push(parseNode(item));
                        }
                    }
                }
                return obj;
            };

            const json = parseNode(xml.documentElement);
            setResult({ text: JSON.stringify(json, null, 2), filename: 'converted.json' });
        } catch (e) {
            setResult({ error: 'XML to JSON conversion failed: ' + e.message });
        }
    };

    return (
        <div className="card p-30 glass-card grid gap-15">
            <textarea className="pill w-full font-mono" rows="8" placeholder="Paste XML here..." value={input} onChange={e=>setInput(e.target.value)} />
            <div className="grid grid-2-cols gap-10">
                <button className="btn-primary" onClick={formatXml}>Format XML</button>
                <button className="pill" onClick={xmlToJson}>XML to JSON</button>
            </div>
            <ToolResult result={result} />
        </div>
    );
};

export default XmlTools;
