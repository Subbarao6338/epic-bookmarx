import React, { useState } from 'react';
import ToolResult from '../ToolResult';

const JsonToTs = () => {
    const [input, setInput] = useState('');
    const [interfaceName, setInterfaceName] = useState('RootObject');
    const [result, setResult] = useState(null);

    const convert = () => {
        if (!input.trim()) return;
        try {
            const obj = JSON.parse(input);
            const interfaces = new Map();

            const deepMerge = (target, source) => {
                for (const key in source) {
                    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                        if (!target[key]) target[key] = {};
                        deepMerge(target[key], source[key]);
                    } else if (Array.isArray(source[key])) {
                        if (!target[key]) target[key] = [];
                        // For arrays, we just want to know if there's an object inside for the next step
                        if (source[key].length > 0) {
                            if (typeof source[key][0] === 'object' && source[key][0] !== null && !Array.isArray(source[key][0])) {
                                if (target[key].length === 0) target[key].push({});
                                deepMerge(target[key][0], source[key][0]);
                            } else {
                                target[key] = source[key];
                            }
                        }
                    } else {
                        target[key] = source[key];
                    }
                }
                return target;
            };

            const getTypeName = (val, key) => {
                const type = typeof val;
                if (val === null) return 'any';
                if (type === 'string') return 'string';
                if (type === 'number') return 'number';
                if (type === 'boolean') return 'boolean';
                if (Array.isArray(val)) {
                    if (val.length === 0) return 'any[]';

                    // Check if it's an array of objects (not nested arrays)
                    if (typeof val[0] === 'object' && val[0] !== null && !Array.isArray(val[0])) {
                        const merged = {};
                        val.forEach(item => {
                            if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
                                deepMerge(merged, item);
                            }
                        });
                        const subName = key.charAt(0).toUpperCase() + key.slice(1);
                        generateInterface(merged, subName, val);
                        return `${subName}[]`;
                    }

                    const subType = getTypeName(val[0], key);
                    return `${subType}[]`;
                }
                if (type === 'object') {
                    const subName = key.charAt(0).toUpperCase() + key.slice(1);
                    generateInterface(val, subName);
                    return subName;
                }
                return 'any';
            };

            const generateInterface = (o, name, originalArray = null) => {
                if (interfaces.has(name)) return;
                let str = `interface ${name} {\n`;
                Object.entries(o).forEach(([k, v]) => {
                    const type = getTypeName(v, k);
                    const isOptional = originalArray && originalArray.some(item => item && typeof item === 'object' && item[k] === undefined);
                    str += `  ${k}${isOptional ? '?' : ''}: ${type};\n`;
                });
                str += '}\n';
                interfaces.set(name, str);
            };

            if (Array.isArray(obj)) {
                if (obj.length > 0 && typeof obj[0] === 'object' && obj[0] !== null && !Array.isArray(obj[0])) {
                    const merged = {};
                    obj.forEach(item => {
                        if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
                            deepMerge(merged, item);
                        }
                    });
                    generateInterface(merged, interfaceName, obj);
                } else {
                    const type = obj.length > 0 ? (Array.isArray(obj[0]) ? 'any[]' : typeof obj[0]) : 'any';
                    setResult({ text: `type ${interfaceName} = ${type}[];`, filename: 'types.ts' });
                    return;
                }
            } else {
                generateInterface(obj, interfaceName);
            }

            let finalTs = '';
            // Sort by dependency (simple reverse map order often works for simple cases)
            Array.from(interfaces.values()).reverse().forEach(inter => {
                finalTs += inter + '\n';
            });

            setResult({ text: finalTs.trim(), filename: 'types.ts' });
        } catch (e) {
            setResult({ error: 'Invalid JSON: ' + e.message });
        }
    };

    return (
        <div className="grid gap-15">
            <div className="form-group">
                <label className="smallest opacity-6 uppercase ml-10">Interface Name</label>
                <input className="pill w-full mb-10" value={interfaceName} onChange={e=>setInterfaceName(e.target.value)} placeholder="RootObject" />
            </div>
            <textarea className="pill w-full font-mono text-sm" rows="10" style={{borderRadius: '16px', padding: '15px'}} placeholder="Paste JSON here..." value={input} onChange={e=>setInput(e.target.value)} />
            <button className="btn-primary w-full" onClick={convert}>
                <span className="material-icons mr-10">code</span>
                Generate TypeScript Interfaces
            </button>
            <ToolResult result={result} />
        </div>
    );
};

export default JsonToTs;
