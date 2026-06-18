import React, { useState, useEffect, useCallback, useMemo } from 'react';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';
import JSZip from 'jszip';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import Tesseract from 'tesseract.js';
import ToolResult from './ToolResult';

// Setup PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced'
});
turndownService.use(gfm);

const BatchConverter = () => {
    const [files, setFiles] = useState([]);
    const [results, setResults] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [globalProgress, setGlobalProgress] = useState(0);

    const handleFileUpload = (e) => {
        const uploadedFiles = Array.from(e.target.files).map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            name: file.name,
            size: (file.size / 1024).toFixed(2) + ' KB',
            status: 'pending',
            progress: 0,
            result: null
        }));
        setFiles(prev => [...prev, ...uploadedFiles]);
    };

    const removeFile = (id) => {
        setFiles(prev => prev.filter(f => f.id !== id));
        setResults(prev => {
            const newRes = { ...prev };
            delete newRes[id];
            return newRes;
        });
    };

    const updateFileStatus = (id, updates) => {
        setFiles(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
    };

    const startBatch = async () => {
        if (files.length === 0 || isProcessing) return;
        setIsProcessing(true);
        setGlobalProgress(0);

        const pendingFiles = files.filter(f => f.status !== 'done');
        let completed = 0;

        for (const fileObj of pendingFiles) {
            updateFileStatus(fileObj.id, { status: 'converting', progress: 10 });
            try {
                const result = await processFile(fileObj);
                updateFileStatus(fileObj.id, { status: 'done', progress: 100 });
                setResults(prev => ({
                    ...prev,
                    [fileObj.id]: {
                        ...result,
                        sourceName: fileObj.name
                    }
                }));
            } catch (err) {
                console.error(err);
                updateFileStatus(fileObj.id, { status: 'error', progress: 0 });
            }
            completed++;
            setGlobalProgress(Math.round((completed / pendingFiles.length) * 100));
        }
        setIsProcessing(false);
    };

    const processFile = async (fileObj) => {
        const { file, name } = fileObj;
        const ext = name.split('.').pop().toLowerCase();

        // Simulate progress for large files or complex conversions
        updateFileStatus(fileObj.id, { progress: 30 });

        if (ext === 'pdf') return await convertPdf(file, fileObj.id, true); // try ocr if no text
        if (ext === 'docx') return await convertDocx(file);
        if (ext === 'html' || ext === 'mhtml') return await convertHtml(file);
        if (ext === 'csv') return await convertCsv(file);
        if (ext === 'xlsx' || ext === 'xls') return await convertExcel(file);
        if (ext === 'pptx') return await convertPptx(file);
        if (ext === 'md' || ext === 'mdx') return await convertMarkdown(file, ext);
        if (file.type.startsWith('image/')) return await convertOcr(file, fileObj.id);

        throw new Error("Unsupported file type");
    };

    // Conversion functions
    const convertPdf = async (file, id, tryOcr = false) => {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        let fullText = '';
        let hasText = false;

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ').trim();
            if (pageText) {
                fullText += `## Page ${i}\n\n${pageText}\n\n`;
                hasText = true;
            } else if (tryOcr) {
                // Scanned PDF page
                const viewport = page.getViewport({ scale: 2 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                await page.render({ canvasContext: context, viewport }).promise;
                const { data: { text } } = await Tesseract.recognize(canvas, 'eng');
                fullText += `## Page ${i} (OCR)\n\n${text}\n\n`;
            }
            updateFileStatus(id, { progress: Math.round((i / pdf.numPages) * 100) });
        }

        return { text: fullText, filename: file.name.replace(/\.[^/.]+$/, "") + ".md" };
    };

    const convertDocx = async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        const markdown = turndownService.turndown(result.value);
        return { text: markdown, filename: file.name.replace(/\.[^/.]+$/, "") + ".md" };
    };

    const convertHtml = async (file) => {
        const text = await file.text();
        const markdown = turndownService.turndown(text);
        return { text: markdown, filename: file.name.replace(/\.[^/.]+$/, "") + ".md" };
    };
    const convertCsv = async (file) => {
        const text = await file.text();
        return new Promise((resolve, reject) => {
            Papa.parse(text, {
                header: true,
                complete: (results) => {
                    const headers = results.meta.fields;
                    let md = '| ' + headers.join(' | ') + ' |\n';
                    md += '| ' + headers.map(() => '---').join(' | ') + ' |\n';
                    results.data.forEach(row => {
                        md += '| ' + headers.map(h => row[h]).join(' | ') + ' |\n';
                    });
                    resolve({ text: md, filename: file.name.replace(/\.[^/.]+$/, "") + ".md" });
                },
                error: reject
            });
        });
    };

    const convertExcel = async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const firstSheet = workbook.SheetNames[0];
        const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet]);

        if (jsonData.length === 0) return { text: "Empty Excel file", filename: "converted.md" };

        const headers = Object.keys(jsonData[0]);
        let md = '| ' + headers.join(' | ') + ' |\n';
        md += '| ' + headers.map(() => '---').join(' | ') + ' |\n';
        jsonData.forEach(row => {
            md += '| ' + headers.map(h => row[h] || '').join(' | ') + ' |\n';
        });

        return { text: md, filename: file.name.replace(/\.[^/.]+$/, "") + ".md" };
    };

    const convertPptx = async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const zip = await JSZip.loadAsync(arrayBuffer);
        let fullText = '';
        const slideFiles = Object.keys(zip.files).filter(f => f.startsWith('ppt/slides/slide') && f.endsWith('.xml'));

        for (let i = 1; i <= slideFiles.length; i++) {
            const slideXml = await zip.file(`ppt/slides/slide${i}.xml`).async('text');
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(slideXml, 'text/xml');
            // Simplified text extraction from slide XML
            const texts = Array.from(xmlDoc.getElementsByTagName('a:t')).map(t => t.textContent).join(' ');
            fullText += `## Slide ${i}\n\n${texts}\n\n`;
        }

        if (!fullText) fullText = "No readable text found in PowerPoint slides.";

        return { text: fullText, filename: file.name.replace(/\.[^/.]+$/, "") + ".md" };
    };

    const convertMarkdown = async (file, ext) => {
        const text = await file.text();
        return { text: text, filename: file.name.replace(/\.[^/.]+$/, "") + (ext === 'mdx' ? '.md' : '.mdx') };
    };

    const convertOcr = async (file, id) => {
        const { data: { text } } = await Tesseract.recognize(file, 'eng', {
            logger: m => {
                if (m.status === 'recognizing text') {
                    updateFileStatus(id, { progress: Math.round(m.progress * 100) });
                }
            }
        });
        return { text, filename: file.name.replace(/\.[^/.]+$/, "") + "_ocr.md" };
    };

    const clearAll = () => {
        setFiles([]);
        setResults({});
        setGlobalProgress(0);
    };

    const [url, setUrl] = useState('');
    const [urlStatus, setUrlStatus] = useState('idle');

    const convertUrl = async () => {
        if (!url) return;
        setUrlStatus('loading');
        try {
            // Using a CORS proxy or direct fetch if allowed
            const response = await fetch(url);
            const html = await response.text();
            const markdown = turndownService.turndown(html);
            const id = 'url-' + Date.now();
            setResults(prev => ({
                ...prev,
                [id]: {
                    text: markdown,
                    filename: 'webpage.md',
                    sourceName: url
                }
            }));
            setUrlStatus('idle');
        } catch (err) {
            console.error(err);
            alert("Failed to fetch URL. This might be due to CORS restrictions. Try a different URL or use a browser extension.");
            setUrlStatus('error');
        }
    };

    const convertMdxToMhtml = async () => {
        const mdxFile = files.find(f => f.name.endsWith('.mdx'));
        if (!mdxFile) {
            alert("Please upload an .mdx file first.");
            return;
        }
        updateFileStatus(mdxFile.id, { status: 'converting' });
        const text = await mdxFile.file.text();
        const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${mdxFile.name}</title></head><body>${text}</body></html>`;
        setResults(prev => ({
            ...prev,
            [mdxFile.id]: {
                text: html,
                filename: mdxFile.name.replace('.mdx', '.mhtml'),
                sourceName: mdxFile.name
            }
        }));
        updateFileStatus(mdxFile.id, { status: 'done' });
    };

    return (
        <div className="grid gap-20">
            <div className="card p-20 text-center glass-card">
                <div className="file-input-wrapper">
                    <input type="file" multiple onChange={handleFileUpload} accept=".pdf,.docx,.pptx,.html,.mhtml,.csv,.xlsx,.xls,.md,.mdx,image/*" />
                    <div className="file-input-label">
                        <span className="material-icons">cloud_upload</span>
                        <span>Select or drop files for batch conversion</span>
                    </div>
                </div>
                <div className="smallest opacity-6 mt-10">
                    Supports PDF, DOCX, PPTX, HTML, CSV, Excel, MDX, and Images (OCR)
                </div>
            </div>

            {files.length > 0 && (
                <div className="card p-20 glass-card">
                    <div className="flex-between mb-15">
                        <h3 className="h3">File Queue ({files.length})</h3>
                        <div className="flex-gap">
                            <button className="pill color-error" onClick={clearAll} disabled={isProcessing}>
                                <span className="material-icons">delete_sweep</span> Clear All
                            </button>
                            <button className="btn-primary" onClick={startBatch} disabled={isProcessing}>
                                <span className="material-icons">{isProcessing ? 'sync' : 'play_arrow'}</span>
                                {isProcessing ? `Processing ${globalProgress}%` : 'Start Batch'}
                            </button>
                        </div>
                    </div>

                    <div className="grid gap-10">
                        {files.map(f => (
                            <div key={f.id} className="p-10 flex-between" style={{ background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                <div className="flex-center gap-10" style={{ flex: 1, overflow: 'hidden' }}>
                                    <span className="material-icons opacity-6">
                                        {f.name.endsWith('.pdf') ? 'picture_as_pdf' :
                                         f.name.match(/\.(docx|doc)$/) ? 'description' :
                                         f.name.match(/\.(xlsx|xls|csv)$/) ? 'table_view' :
                                         f.file.type.startsWith('image/') ? 'image' : 'insert_drive_file'}
                                    </span>
                                    <div style={{ overflow: 'hidden' }}>
                                        <div className="font-bold truncate" title={f.name}>{f.name}</div>
                                        <div className="smallest opacity-6">{f.size} • {f.status}</div>
                                    </div>
                                </div>

                                <div className="flex-center gap-15">
                                    {f.status === 'converting' && (
                                        <div style={{ width: '60px', height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
                                            <div style={{ width: `${f.progress}%`, height: '100%', background: 'var(--brand-accent)' }}></div>
                                        </div>
                                    )}
                                    {f.status === 'done' && <span className="material-icons color-success">check_circle</span>}
                                    {f.status === 'error' && <span className="material-icons color-error">error</span>}
                                    <button className="pill-icon" onClick={() => removeFile(f.id)} disabled={isProcessing}>
                                        <span className="material-icons" style={{ fontSize: '1.2rem' }}>close</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="card p-20 glass-card">
                <h3 className="h3 mb-15">Web URL to Markdown</h3>
                <div className="flex-gap">
                    <input type="text" className="pill flex-1" value={url} onChange={e => setUrl(e.target.value)} placeholder="Enter Web URL (e.g., https://example.com)" />
                    <button className="btn-primary" onClick={convertUrl} disabled={urlStatus === 'loading' || !url}>
                        {urlStatus === 'loading' ? 'Converting...' : 'Convert URL'}
                    </button>
                </div>
                <div className="alert-info mt-15 p-10 smallest opacity-7" style={{borderRadius: '8px', background: 'var(--surface)'}}>
                    <span className="material-icons" style={{fontSize: '1rem', verticalAlign: 'middle', marginRight: '5px'}}>info</span>
                    <strong>CORS Notice:</strong> Browsers block direct access to most websites. This tool works best for sites with permissive CORS headers or when using a CORS-unblocking browser extension.
                </div>
            </div>

            {Object.keys(results).length > 0 && (
                <div className="grid gap-15 animate-fadeIn">
                    <h3 className="h3">Conversion Results</h3>
                    {Object.entries(results).map(([id, res]) => (
                        <ToolResult key={id} result={res} title={res.sourceName} />
                    ))}
                </div>
            )}
        </div>
    );
};

const ConvertTools = ({ toolId, onSubtoolChange }) => {
    const tabs = [
        { id: 'batch', label: 'Batch Converter' },
        { id: 'mdx', label: 'MDX Converter' }
    ];

    const [activeTab, setActiveTab] = useState('batch');

    useEffect(() => {
        const current = tabs.find(t => t.id === activeTab);
        if (current && onSubtoolChange) onSubtoolChange(current.label);
    }, [activeTab]);

    useEffect(() => {
        if (toolId) {
            if (['mdx-to-md', 'md-to-mdx'].includes(toolId)) setActiveTab('mdx');
            else setActiveTab('batch');
        }
    }, [toolId]);

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
                {activeTab === 'batch' && <BatchConverter />}
                {activeTab === 'mdx' && (
                    <div className="grid gap-15">
                        <div className="card p-20 glass-card">
                            <h3 className="h3 mb-15">Specialized MDX Tools</h3>
                            <p className="mb-20 opacity-7">Convert MDX files to MHTML or other formats specifically.</p>
                            <button className="btn-primary w-full" onClick={convertMdxToMhtml}>
                                <span className="material-icons mr-10">html</span> Convert Uploaded .mdx to .mhtml
                            </button>
                            <p className="smallest opacity-6 mt-15">Note: PPTX conversion is currently optimized for text extraction only.</p>
                        </div>
                        <div className="card p-20 glass-card opacity-6">
                            <p>More MDX-specific options coming soon. Use Batch Converter for MDX to Markdown.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConvertTools;
