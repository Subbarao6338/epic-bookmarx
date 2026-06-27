import React, { useState } from 'react';
import ToolResult from '../ToolResult';

const XmlTools = () => {
    const [input, setInput] = useState('');
    const [result, setResult] = useState(null);

    const formatXml = () => {
        if (!input) return;
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(input, 'text/xml');

            const errorNode = xmlDoc.querySelector('parsererror');
            if (errorNode) throw new Error(errorNode.textContent);

            const formatNode = (node, level = 0) => {
                const indent = '  '.repeat(level);
                let result = '';

                if (node.nodeType === 1) { // Element
                    result += `\n${indent}<${node.nodeName}`;
                    for (let i = 0; i < node.attributes.length; i++) {
                        const attr = node.attributes[i];
                        result += ` ${attr.nodeName}="${attr.nodeValue}"`;
                    }

                    if (node.childNodes.length === 0) {
                        result += '/>';
                    } else {
                        result += '>';
                        let hasElements = false;
                        for (let i = 0; i < node.childNodes.length; i++) {
                            const child = node.childNodes[i];
                            if (child.nodeType === 1) {
                                hasElements = true;
                                result += formatNode(child, level + 1);
                            } else if (child.nodeType === 3 && child.nodeValue.trim()) {
                                result += child.nodeValue.trim();
                            } else if (child.nodeType === 8) { // Comment
                                result += `\n${'  '.repeat(level + 1)}<!--${child.nodeValue}-->`;
                            }
                        }
                        if (hasElements) result += `\n${indent}`;
                        result += `</${node.nodeName}>`;
                    }
                } else if (node.nodeType === 9) { // Document
                    for (let i = 0; i < node.childNodes.length; i++) {
                        result += formatNode(node.childNodes[i], level);
                    }
                } else if (node.nodeType === 7) { // Processing Instruction
                    result += `<?${node.target} ${node.data}?>`;
                }

                return result;
            };

            let formatted = formatNode(xmlDoc).trim();
            if (input.trim().startsWith('<?xml')) {
                const xmlDeclaration = input.match(/<\?xml.*?\?>/)[0];
                formatted = xmlDeclaration + '\n' + formatted;
            }

            setResult({ text: formatted, filename: 'formatted.xml' });
        } catch (e) {
            setResult({ error: 'XML Format error: ' + e.message });
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
