import React, { useState, useEffect, useMemo, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { PDFDocument, rgb } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import Tesseract from 'tesseract.js';
import html2canvas from 'html2canvas';
import mammoth from 'mammoth';
import ToolResult from './ToolResult';

// Setup PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// --- TEXT TOOLS COMPONENTS ---

const LoremGenerator = ({ setInput }) => {
    const [count, setCount] = useState(3);
    const [result, setResult] = useState(null);
    const gen = () => {
        const text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ".repeat(10 * count);
        setInput(text);
        setResult({ text, filename: 'lorem.txt' });
    };
    return (
        <div className="card p-20 flex-gap glass-card">
            <input type="number" className="pill flex-1" value={count} onChange={e=>setCount(e.target.value)} min="1" max="50" />
            <button className="btn-primary flex-1" onClick={gen}>Generate</button>
            <ToolResult result={result} />
        </div>
    );
};

const WordRankCalculator = () => {
    const [word, setWord] = useState('NATURE');
    const [rank, setRank] = useState(null);

    const calculate = () => {
        const input = word.toUpperCase().replace(/[^A-Z]/g, '');
        if (!input) return;

        const factorial = (n) => {
            let res = BigInt(1);
            for (let i = 2n; i <= BigInt(n); i++) res *= i;
            return res;
        };

        const getFactorialDivisor = (counts) => {
            let divisor = BigInt(1);
            for (let key in counts) divisor *= factorial(counts[key]);
            return divisor;
        };

        const len = input.length;
        let currentRank = BigInt(1);
        let charCount = {};
        for (let ch of input) charCount[ch] = (charCount[ch] || 0) + 1;

        for (let i = 0; i < len; i++) {
            let countSmaller = 0;
            for (let key in charCount) {
                if (key < input[i]) countSmaller += charCount[key];
            }

            if (countSmaller > 0) {
                let waysAtThisPosition = BigInt(0);
                const uniqueChars = Object.keys(charCount).sort();
                for (let char of uniqueChars) {
                    if (char < input[i]) {
                        charCount[char]--;
                        waysAtThisPosition += factorial(len - 1 - i) / getFactorialDivisor(charCount);
                        charCount[char]++;
                    }
                }
                currentRank += waysAtThisPosition;
            }
            charCount[input[i]]--;
            if (charCount[input[i]] === 0) delete charCount[input[i]];
        }

        setRank(currentRank.toString());
    };

    return (
        <div className="card p-20 grid gap-15 glass-card">
            <div className="form-group">
                <label>Word (with or without duplicate letters)</label>
                <input className="pill" value={word} onChange={e => setWord(e.target.value.toUpperCase())} />
            </div>
            <button className="btn-primary" onClick={calculate}>Calculate Dictionary Rank</button>
            <ToolResult result={rank ? `Rank of "${word}": ${rank}` : null} />
        </div>
    );
};

const FindReplace = ({ input, setInput }) => {
    const [find, setFind] = useState('');
    const [replace, setReplace] = useState('');
    const [result, setResult] = useState(null);
    const handleAction = () => {
        const res = input.replaceAll(find, replace);
        setInput(res);
        setResult({ text: res, filename: 'find_replace.txt' });
    };
    return (
        <div className="card p-15 grid gap-10 glass-card">
            <div className="flex-gap">
                <input className="pill flex-1" placeholder="Find..." value={find} onChange={e=>setFind(e.target.value)} />
                <input className="pill flex-1" placeholder="Replace..." value={replace} onChange={e=>setReplace(e.target.value)} />
            </div>
            <button className="btn-primary" onClick={handleAction}>Replace All</button>
            <ToolResult result={result} />
        </div>
    );
};

const ExtractTool = ({ input }) => {
    const [results, setResults] = useState([]);
    const [resultData, setResultData] = useState(null);
    const extract = (type) => {
        let regex;
        if (type === 'email') regex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        else if (type === 'url') regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
        const found = input.match(regex) || [];
        setResults(found);
        setResultData({ text: found.join('\n'), filename: `extracted_${type}s.txt` });
    };
    return (
        <div className="card p-15 grid gap-10 glass-card">
            <div className="flex-gap">
                <button className="pill flex-1" onClick={()=>extract('email')}>Extract Emails</button>
                <button className="pill flex-1" onClick={()=>extract('url')}>Extract URLs</button>
            </div>
            {results.length > 0 && (
                <div className="tool-result font-mono" style={{maxHeight: '150px', overflow: 'auto'}}>
                    {results.map((r, i) => <div key={i}>{r}</div>)}
                </div>
            )}
            <ToolResult result={resultData} />
        </div>
    );
};

const HtmlEntities = ({ input, setInput }) => {
    const [result, setResult] = useState(null);
    const encode = () => {
        const el = document.createElement('div');
        el.textContent = input;
        const res = el.innerHTML;
        setInput(res);
        setResult({ text: res });
    };
    const decode = () => {
        const el = document.createElement('div');
        el.innerHTML = input;
        const res = el.textContent;
        setInput(res);
        setResult({ text: res });
    };
    return (
        <div className="flex-column gap-15">
            <div className="flex-gap">
                <button className="btn-primary flex-1" onClick={encode}>Encode HTML</button>
                <button className="pill flex-1" onClick={decode}>Decode HTML</button>
            </div>
            <ToolResult result={result} />
        </div>
    );
};

const TextHub = ({ subtool }) => {
    const [input, setInput] = useState('');
    const [activeSub, setActiveSub] = useState(subtool || 'modify');
    const [result, setResult] = useState(null);

    const stats = useMemo(() => ({
        chars: input.length,
        words: input.trim() ? input.trim().split(/\s+/).length : 0,
        lines: input.split('\n').filter(l => l.trim()).length
    }), [input]);

    const handleAction = (type) => {
        let res = input;
        if (type === 'upper') res = input.toUpperCase();
        else if (type === 'lower') res = input.toLowerCase();
        else if (type === 'title') res = input.split(' ').map(w=>w.charAt(0).toUpperCase()+w.slice(1).toLowerCase()).join(' ');
        else if (type === 'reverse') res = input.split('').reverse().join('');
        else if (type === 'whitespace') res = input.replace(/\s+/g, ' ').trim();
        else if (type === 'dedupe') res = [...new Set(input.split('\n').filter(l => l.trim()))].join('\n');
        else if (type === 'sort') res = input.split('\n').filter(l => l.trim()).sort().join('\n');
        setInput(res);
        setResult({ text: res, filename: 'text_processed.txt' });
    };

    return (
        <div className="grid gap-20">
            <div className="pill-group scrollable-x">
                {['modify', 'stats', 'lorem', 'rank', 'find', 'extract', 'entities'].map(t => (
                    <button key={t} className={`pill ${activeSub === t ? 'active' : ''}`} onClick={() => setActiveSub(t)} style={{textTransform: 'capitalize'}}>
                        {t === 'entities' ? 'HTML Entities' : t === 'rank' ? 'Word Rank' : t}
                    </button>
                ))}
            </div>
            <textarea rows="8" className="pill w-full font-mono glass-card" placeholder="Enter text here..." value={input} onChange={e=>setInput(e.target.value)} />

            {activeSub === 'modify' && (
                <div className="grid gap-15">
                    <button className="btn-primary w-full" onClick={() => {
                        const utterance = new SpeechSynthesisUtterance(input);
                        window.speechSynthesis.speak(utterance);
                    }}>
                        <span className="material-icons mr-10">record_voice_over</span> Read Aloud (TTS)
                    </button>
                    <div className="pill-group scrollable-x">
                        <button className="btn-primary" onClick={()=>handleAction('upper')}>UPPERCASE</button>
                        <button className="pill" onClick={()=>handleAction('lower')}>lowercase</button>
                        <button className="pill" onClick={()=>handleAction('title')}>Title Case</button>
                        <button className="pill" onClick={()=>handleAction('reverse')}>Reverse</button>
                        <button className="pill" onClick={()=>handleAction('whitespace')}>Clean Whitespace</button>
                        <button className="pill" onClick={()=>handleAction('dedupe')}>Dedupe Lines</button>
                        <button className="pill" onClick={()=>handleAction('sort')}>Sort Lines</button>
                    </div>
                </div>
            )}

            {activeSub === 'stats' && (
                <div className="grid grid-3 gap-15">
                    <div className="card p-20 text-center glass-card">
                        <div className="font-bold" style={{fontSize: '2rem'}}>{stats.chars}</div>
                        <div className="opacity-6">Characters</div>
                    </div>
                    <div className="card p-20 text-center glass-card">
                        <div className="font-bold" style={{fontSize: '2rem'}}>{stats.words}</div>
                        <div className="opacity-6">Words</div>
                    </div>
                    <div className="card p-20 text-center glass-card">
                        <div className="font-bold" style={{fontSize: '2rem'}}>{stats.lines}</div>
                        <div className="opacity-6">Lines</div>
                    </div>
                </div>
            )}

            {activeSub === 'lorem' && <LoremGenerator setInput={setInput} />}
            {activeSub === 'rank' && <WordRankCalculator />}
            {activeSub === 'find' && <FindReplace input={input} setInput={setInput} />}
            {activeSub === 'extract' && <ExtractTool input={input} />}
            {activeSub === 'entities' && <HtmlEntities input={input} setInput={setInput} />}

            {(activeSub === 'modify' || activeSub === 'stats') && <ToolResult result={result || `Stats: ${stats.words} words, ${stats.chars} characters`} />}
        </div>
    );
};

// --- IMAGE TOOLS COMPONENTS ---

const FormatConverter = ({ imgRef, image, setToolResult }) => {
    const [target, setTarget] = useState('image/png');
    const convert = () => {
        const canvas = document.createElement('canvas');
        const img = imgRef.current;
        if (!img) return;
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(blob => {
            setToolResult({ text: `Converted to ${target}`, blob, filename: `converted.${target.split('/')[1]}` });
        }, target);
    };
    return (
        <div className="card p-20 text-center glass-card">
            <div className="form-group">
                <label>Target Format</label>
                <select value={target} onChange={e => setTarget(e.target.value)} className="pill">
                    <option value="image/png">PNG (Lossless)</option>
                    <option value="image/jpeg">JPEG (Standard)</option>
                    <option value="image/webp">WEBP (Modern)</option>
                </select>
            </div>
            <button className="btn-primary w-full" onClick={convert}>Convert & Download</button>
        </div>
    );
};

const ResizeImage = ({ imgRef, image, setToolResult }) => {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [maintainAspect, setMaintainAspect] = useState(true);

    useEffect(() => {
        if (imgRef.current) {
            setWidth(imgRef.current.naturalWidth);
            setHeight(imgRef.current.naturalHeight);
        }
    }, [image]);

    const handleWidthChange = (val) => {
        const w = parseInt(val) || 0;
        setWidth(w);
        if (maintainAspect && imgRef.current) {
            const ratio = imgRef.current.naturalHeight / imgRef.current.naturalWidth;
            setHeight(Math.round(w * ratio));
        }
    };

    const handleHeightChange = (val) => {
        const h = parseInt(val) || 0;
        setHeight(h);
        if (maintainAspect && imgRef.current) {
            const ratio = imgRef.current.naturalWidth / imgRef.current.naturalHeight;
            setWidth(Math.round(h * ratio));
        }
    };

    const resize = () => {
        const canvas = document.createElement('canvas');
        const img = imgRef.current;
        if (!img) return;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(blob => {
            setToolResult({ text: `Resized to ${width}x${height}`, blob, filename: 'resized.png' });
        });
    };

    return (
        <div className="card p-20 glass-card">
            <div className="grid grid-2-cols gap-10 mb-15">
                <div className="form-group">
                    <label>Width (px)</label>
                    <input type="number" value={width} onChange={e => handleWidthChange(e.target.value)} className="pill" />
                </div>
                <div className="form-group">
                    <label>Height (px)</label>
                    <input type="number" value={height} onChange={e => handleHeightChange(e.target.value)} className="pill" />
                </div>
            </div>
            <label className="flex-center gap-10 mb-20 cursor-pointer">
                <input type="checkbox" checked={maintainAspect} onChange={e => setMaintainAspect(e.target.checked)} />
                <span className="font-bold opacity-7">Maintain Aspect Ratio</span>
            </label>
            <button className="btn-primary w-full" onClick={resize}>Apply Resize</button>
        </div>
    );
};

const PrivacyBlur = ({ imgRef, image, setToolResult }) => {
    const [intensity, setIntensity] = useState(10);
    const blur = () => {
        const canvas = document.createElement('canvas');
        const img = imgRef.current;
        if (!img) return;
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.filter = `blur(${intensity}px)`;
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(blob => {
            setToolResult({ text: `Applied ${intensity}px Privacy Blur`, blob, filename: 'blurred.png' });
        });
    };
    return (
        <div className="card p-20 text-center glass-card">
            <div className="form-group mb-15">
                <label>Blur Intensity: {intensity}px</label>
                <input type="range" min="1" max="50" value={intensity} onChange={e=>setIntensity(e.target.value)} className="w-full" />
            </div>
            <button className="btn-primary w-full" onClick={blur}>Apply Blur</button>
        </div>
    );
};

const MetadataCleaner = ({ imgRef, image, setToolResult }) => {
    const clean = () => {
        const canvas = document.createElement('canvas');
        const img = imgRef.current;
        if (!img) return;
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(blob => {
            setToolResult({ text: 'Stripped EXIF Metadata (Camera, Location, etc.)', blob, filename: 'clean.png' });
        });
    };
    return (
        <div className="card p-20 text-center glass-card">
            <p className="opacity-6 smallest mb-15">This tool re-renders the image on a canvas, which removes sensitive metadata like GPS coordinates and camera info.</p>
            <button className="btn-primary w-full" onClick={clean}>Remove All Metadata</button>
        </div>
    );
};

const ImageHub = ({ subtool }) => {
    const [activeSub, setActiveSub] = useState(subtool || 'format');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);
    const imgRef = useRef(null);

    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onload = (ev) => setPreview(ev.target.result);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="grid gap-20">
            <div className="pill-group scrollable-x">
                {['format', 'resize', 'blur', 'metadata', 'filters', 'b64'].map(t => (
                    <button key={t} className={`pill ${activeSub === t ? 'active' : ''}`} onClick={() => setActiveSub(t)} style={{textTransform: 'capitalize'}}>
                        {t === 'b64' ? 'Base64' : t}
                    </button>
                ))}
            </div>
            <div className="card p-20 text-center glass-card">
                <div className="file-input-wrapper">
                    <input type="file" onChange={handleUpload} accept="image/*" />
                    <div className="file-input-label">
                        <span className="material-icons">{image ? 'image' : 'cloud_upload'}</span>
                        <span>{image ? image.name : 'Select image to process'}</span>
                    </div>
                </div>
            </div>
            {preview && (
                <div className="card p-10 text-center glass-card" style={{ maxWidth: '400px', margin: '0 auto' }}>
                    <img ref={imgRef} src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '250px', borderRadius: '16px', display: 'block' }} />
                </div>
            )}
            {image && (
                <div className="animate-fadeIn">
                    {activeSub === 'format' && <FormatConverter imgRef={imgRef} image={image} setToolResult={setResult} />}
                    {activeSub === 'resize' && <ResizeImage imgRef={imgRef} image={image} setToolResult={setResult} />}
                    {activeSub === 'blur' && <PrivacyBlur imgRef={imgRef} image={image} setToolResult={setResult} />}
                    {activeSub === 'metadata' && <MetadataCleaner imgRef={imgRef} image={image} setToolResult={setResult} />}
                    {activeSub === 'b64' && <button className="btn-primary w-full" onClick={() => {
                        const reader = new FileReader();
                        reader.onload = (e) => setResult({ text: e.target.result, filename: 'image_b64.txt' });
                        reader.readAsDataURL(image);
                    }}>Generate Base64</button>}
                </div>
            )}
            <ToolResult result={result} />
        </div>
    );
};

// --- PDF TOOLS COMPONENTS ---

const ImageToPdf = ({ setToolResult }) => {
    const [images, setImages] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [fileName, setFileName] = useState('');

    const convert = async () => {
        if (images.length === 0) return;
        setIsProcessing(true);
        try {
            const pdfDoc = await PDFDocument.create();
            for (const file of images) {
                const bytes = await file.arrayBuffer();
                let img;
                if (file.type === 'image/png') img = await pdfDoc.embedPng(bytes);
                else img = await pdfDoc.embedJpg(bytes);
                const page = pdfDoc.addPage([img.width, img.height]);
                page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
            }
            const pdfBytes = await pdfDoc.save();
            setToolResult({ text: 'Converted Images to PDF', blob: new Blob([pdfBytes], { type: 'application/pdf' }), filename: 'converted.pdf' });
        } catch (e) {
            setToolResult({ error: "Error: " + e.message });
        } finally {
            setIsProcessing(false);
        }
    };
    return (
        <div className="card p-15 grid gap-10 glass-card">
            <div className="file-input-wrapper">
                <input type="file" multiple accept="image/*" onChange={e=>{
                    const files = Array.from(e.target.files);
                    setImages(files);
                    setFileName(files.length > 0 ? `${files.length} images selected` : '');
                }} />
                <div className="file-input-label">
                    <span className="material-icons">{fileName ? 'collections' : 'cloud_upload'}</span>
                    <span>{fileName || 'Select images for PDF'}</span>
                </div>
            </div>
            <button className="btn-primary" onClick={convert} disabled={images.length === 0 || isProcessing}>
                {isProcessing ? 'Converting...' : `Convert ${images.length} Images`}
            </button>
        </div>
    );
};

const PdfHub = ({ subtool }) => {
    const [activeSub, setActiveSub] = useState('merge');
    const [files, setFiles] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [password, setPassword] = useState('');
    const [pageRange, setPageRange] = useState('1-2');
    const [fileName, setFileName] = useState('');
    const [result, setResult] = useState(null);

    useEffect(() => {
        if (subtool) {
            const map = {
                'pdf-merge': 'merge', 'pdf-split': 'split', 'pdf-rotate': 'rotate',
                'pdf-lock': 'lock', 'pdf-unlock': 'unlock', 'pdf2img': 'pdf2img', 'ocr': 'ocr'
            };
            if (map[subtool]) setActiveSub(map[subtool]);
        }
    }, [subtool]);

    const handleFileUpload = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
        setFileName(selectedFiles.length > 0 ? `${selectedFiles.length} files selected` : '');
    };

    const mergePdfs = async () => {
        if (files.length < 2) return;
        setIsProcessing(true);
        try {
            const mergedPdf = await PDFDocument.create();
            for (const file of files) {
                const pdfBytes = await file.arrayBuffer();
                const pdf = await PDFDocument.load(pdfBytes);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }
            const mergedPdfBytes = await mergedPdf.save();
            setResult({ text: 'Merged PDFs', blob: new Blob([mergedPdfBytes], { type: 'application/pdf' }), filename: 'merged.pdf' });
        } catch (e) { setResult({ error: "Error: " + e.message }); }
        finally { setIsProcessing(false); }
    };

    const splitPdf = async () => {
        if (files.length === 0) return;
        setIsProcessing(true);
        try {
            const pdfDoc = await PDFDocument.load(await files[0].arrayBuffer());
            const pageCount = pdfDoc.getPageCount();
            const newPdf = await PDFDocument.create();

            // Validation
            const parts = pageRange.split('-').map(n => parseInt(n.trim()));
            if (parts.some(isNaN)) throw new Error("Invalid page range format (e.g. 1-5)");

            const start = parts[0] - 1;
            const end = (parts[1] || parts[0]) - 1;

            if (start < 0 || start >= pageCount || end < 0 || end >= pageCount) {
                throw new Error(`Page range out of bounds. Document has ${pageCount} pages.`);
            }

            const indices = [];
            for (let i = Math.min(start, end); i <= Math.max(start, end); i++) {
                indices.push(i);
            }

            const pages = await newPdf.copyPages(pdfDoc, indices);
            pages.forEach(p => newPdf.addPage(p));
            setResult({ text: `Split pages ${pageRange} (${indices.length} pages)`, blob: new Blob([await newPdf.save()], { type: 'application/pdf' }), filename: 'split.pdf' });
        } catch (e) { setResult({ error: e.message }); }
        finally { setIsProcessing(false); }
    };

    const rotatePdf = async () => {
        if (files.length === 0) return;
        setIsProcessing(true);
        try {
            const pdfBytes = await files[0].arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBytes);
            pdfDoc.getPages().forEach(p => p.setRotation({ angle: (p.getRotation().angle + 90) % 360 }));
            setResult({ text: 'Rotated PDF', blob: new Blob([await pdfDoc.save()], { type: 'application/pdf' }), filename: 'rotated.pdf' });
        } catch (e) { setResult({ error: "Error: " + e.message }); }
        finally { setIsProcessing(false); }
    };

    const unlockPdf = async () => {
        if (files.length === 0) return;
        setIsProcessing(true);
        try {
            const pdfDoc = await PDFDocument.load(await files[0].arrayBuffer(), { password });
            setResult({ text: 'Unlocked PDF', blob: new Blob([await pdfDoc.save()], { type: 'application/pdf' }), filename: 'unlocked.pdf' });
        } catch (e) { setResult({ error: "Invalid password or error: " + e.message }); }
        finally { setIsProcessing(false); }
    };

    const pdfToImage = async () => {
        if (files.length === 0) return;
        setIsProcessing(true);
        try {
            const pdf = await pdfjsLib.getDocument(await files[0].arrayBuffer()).promise;
            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: 2 });
            const canvas = document.createElement('canvas');
            canvas.width = viewport.width; canvas.height = viewport.height;
            await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
            canvas.toBlob(blob => {
                setResult({ text: 'Rendered Page 1 to Image', blob, filename: 'page1.png' });
                setIsProcessing(false);
            });
        } catch (e) { setResult({ error: e.message }); setIsProcessing(false); }
    };

    const ocrScan = async () => {
        if (files.length === 0) return;
        setIsProcessing(true);
        try {
            // If PDF, we need to convert to image first, but let's assume image for now or use the first page of PDF
            let imageSource = files[0];
            if (files[0].type === 'application/pdf') {
                const pdf = await pdfjsLib.getDocument(await files[0].arrayBuffer()).promise;
                const page = await pdf.getPage(1);
                const viewport = page.getViewport({ scale: 2 });
                const canvas = document.createElement('canvas');
                canvas.width = viewport.width; canvas.height = viewport.height;
                await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
                imageSource = canvas.toDataURL();
            }
            const { data: { text } } = await Tesseract.recognize(imageSource, 'eng', { logger: m => setProgress(Math.round(m.progress * 100)) });
            setResult({ text, filename: 'ocr_result.txt' });
        } catch (e) { setResult({ error: e.message }); }
        finally { setIsProcessing(false); }
    };

    return (
        <div className="grid gap-20">
            <div className="pill-group scrollable-x">
                {['merge', 'split', 'rotate', 'lock', 'unlock', 'img2pdf', 'pdf2img', 'word2pdf', 'ocr'].map(t => (
                    <button key={t} className={`pill ${activeSub === t ? 'active' : ''}`} onClick={() => setActiveSub(t)} style={{textTransform: 'capitalize'}}>
                        {t === 'img2pdf' ? 'Images to PDF' : t === 'pdf2img' ? 'PDF to Image' : t === 'word2pdf' ? 'Word to PDF' : t === 'ocr' ? 'OCR Scan' : t}
                    </button>
                ))}
            </div>
            <div className="form-group">
                <label>Upload {activeSub === 'ocr' ? 'Image or PDF' : 'PDF(s)'}</label>
                <div className="file-input-wrapper">
                    <input type="file" multiple={activeSub === 'merge'} onChange={handleFileUpload} accept={activeSub === 'ocr' ? 'application/pdf,image/*' : 'application/pdf'} />
                    <div className="file-input-label">
                        <span className="material-icons">{fileName ? (activeSub === 'ocr' && !files[0]?.type.includes('pdf') ? 'image' : 'picture_as_pdf') : 'cloud_upload'}</span>
                        <span>{fileName || `Select ${activeSub === 'ocr' ? 'file' : 'PDF'} for ${activeSub}`}</span>
                    </div>
                </div>
            </div>

            {isProcessing && (
                <div className="progress-bar-container" style={{background: 'var(--border)', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '10px'}}>
                    <div style={{width: `${progress || 0}%`, height: '100%', background: 'var(--brand-accent)', transition: 'width 0.3s'}}></div>
                </div>
            )}

            <div className="animate-fadeIn">
                {activeSub === 'merge' && <button className="btn-primary w-full" onClick={mergePdfs} disabled={files.length < 2 || isProcessing}>Merge {files.length} PDFs</button>}
                {activeSub === 'split' && (
                    <div className="grid gap-10">
                        <input className="pill w-full" value={pageRange} onChange={e=>setPageRange(e.target.value)} placeholder="Range (e.g. 1-5)" />
                        <button className="btn-primary w-full" onClick={splitPdf} disabled={!files.length || isProcessing}>Split PDF</button>
                    </div>
                )}
                {activeSub === 'rotate' && <button className="btn-primary w-full" onClick={rotatePdf} disabled={files.length === 0 || isProcessing}>Rotate 90°</button>}
                {activeSub === 'lock' && (
                    <div className="grid gap-10">
                        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="pill w-full" />
                        <button className="btn-primary w-full" onClick={async () => {
                            setIsProcessing(true);
                            try {
                                const pdf = await PDFDocument.load(await files[0].arrayBuffer());
                                const bytes = await pdf.save({ userPassword: password, ownerPassword: password });
                                setResult({ text: 'Locked PDF', blob: new Blob([bytes], { type: 'application/pdf' }), filename: 'locked.pdf' });
                            } catch(e) { setResult({ error: e.message }); }
                            finally { setIsProcessing(false); }
                        }} disabled={!files.length || !password}>Lock PDF</button>
                    </div>
                )}
                {activeSub === 'unlock' && (
                    <div className="grid gap-10">
                        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password (if known)" className="pill w-full" />
                        <button className="btn-primary w-full" onClick={unlockPdf} disabled={!files.length || isProcessing}>Unlock PDF</button>
                    </div>
                )}
                {activeSub === 'pdf2img' && <button className="btn-primary w-full" onClick={pdfToImage} disabled={!files.length || isProcessing}>Convert Page 1 to Image</button>}
                {activeSub === 'ocr' && <button className="btn-primary w-full" onClick={ocrScan} disabled={!files.length || isProcessing}>{isProcessing ? `Processing... ${progress}%` : 'Start OCR Scan'}</button>}
                {activeSub === 'img2pdf' && <ImageToPdf setToolResult={setResult} />}
                {activeSub === 'word2pdf' && (
                    <div className="card p-20 text-center glass-card">
                        <div className="file-input-wrapper">
                            <input type="file" accept=".docx" onChange={async (e) => {
                                const file = e.target.files[0];
                                if(!file) return;
                                setFileName(file.name);
                                setIsProcessing(true);
                                try {
                                    const result = await mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() });
                                    const container = document.createElement('div');
                                    container.style.padding = '40px'; container.style.width = '800px'; container.style.background = 'white';
                                    container.style.position = 'absolute'; container.style.left = '-9999px';
                                    container.innerHTML = result.value;
                                    document.body.appendChild(container);
                                    const canvas = await html2canvas(container);
                                    document.body.removeChild(container);
                                    const pdf = new jsPDF('p', 'mm', 'a4');
                                    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, (canvas.height*210)/canvas.width);
                                    setResult({ text: 'Word to PDF', blob: pdf.output('blob'), filename: 'converted.pdf' });
                                } catch(e) { setResult({ error: e.message }); }
                                finally { setIsProcessing(false); }
                            }} />
                            <div className="file-input-label">
                                <span className="material-icons">{fileName ? 'description' : 'cloud_upload'}</span>
                                <span>{fileName || 'Select .docx file'}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <ToolResult result={result} />
        </div>
    );
};

// --- MAIN DOC TOOLS COMPONENT ---

const DocTranslator = () => {
    const [file, setFile] = useState(null);
    const [targetLang, setTargetLang] = useState('te');
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState(null);
    const [fileName, setFileName] = useState('');

    const handleTranslate = async () => {
        if (!file) return;
        setIsProcessing(true);
        setResult(null);

        try {
            const text = await file.text();
            // Using MyMemory API for translation
            const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.substring(0, 1000))}&langpair=auto|${targetLang}`);
            const data = await response.json();

            if (data.responseStatus !== 200) throw new Error(data.responseDetails);

            const translatedText = data.responseData.translatedText;
            setResult({
                text: translatedText,
                blob: new Blob([translatedText], { type: 'text/plain' }),
                filename: `translated_${file.name}.txt`
            });
        } catch (e) {
            setResult({ error: "Error: " + e.message });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="grid gap-15">
            <div className="card no-animation p-20 glass-card grid gap-15">
                <div className="form-group">
                    <label>Select Document (TXT, MD)</label>
                    <div className="file-input-wrapper">
                        <input
                            type="file"
                            onChange={e => { setFile(e.target.files[0]); setFileName(e.target.files[0]?.name || ''); }}
                            accept=".md,.txt"
                        />
                        <div className="file-input-label">
                            <span className="material-icons">{fileName ? 'description' : 'cloud_upload'}</span>
                            <span>{fileName || 'Select document to translate'}</span>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <label>Target Language</label>
                    <select
                        className="pill w-full"
                        value={targetLang}
                        onChange={e => setTargetLang(e.target.value)}
                    >
                        <option value="te">Telugu</option>
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                    </select>
                </div>
                <button
                    className="btn-primary w-full"
                    onClick={handleTranslate}
                    disabled={!file || isProcessing}
                >
                    {isProcessing ? 'Translating...' : 'Translate Document'}
                </button>
            </div>

            <ToolResult result={result} title="Translated Text" />
        </div>
    );
};

const MarkdownEditor = () => {
  const [md, setMd] = useState('# New Document\n\nStart typing...\n\n- [x] GFM Support\n- [ ] Task lists\n- Tables | Work\n---|---\nYes | True');
  const [result, setResult] = useState(null);

  const html = useMemo(() => {
    marked.setOptions({
        gfm: true,
        breaks: true,
        headerIds: true,
        mangle: false
    });
    return DOMPurify.sanitize(marked.parse(md));
  }, [md]);

  const stats = useMemo(() => ({
    words: md.trim() ? md.trim().split(/\s+/).length : 0,
    chars: md.length
  }), [md]);

  const exportPdf = () => {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(md, 180);
    doc.text(lines, 10, 10);
    const blob = doc.output('blob');
    setResult({ text: 'Exported Markdown to PDF', blob, filename: 'document.pdf' });
  };

  const exportHtml = () => {
      const content = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Document</title><style>body{font-family:sans-serif;padding:40px;line-height:1.6;max-width:800px;margin:0 auto;}</style></head><body>${html}</body></html>`;
      const blob = new Blob([content], { type: 'text/html' });
      setResult({ text: 'Exported Markdown to HTML', blob, filename: 'document.html' });
  };

  const copyHtml = () => {
      navigator.clipboard.writeText(html);
      setResult({ text: 'HTML copied to clipboard!' });
  };

  return (
    <div className="grid gap-15">
      <div className="grid grid-2-cols gap-15">
        <div className="flex-column gap-10">
            <textarea
              className="pill font-mono glass-card"
              rows="15"
              style={{height: '400px'}}
              value={md}
              onChange={e => setMd(e.target.value)}
              placeholder="Write markdown here..."
            />
            <div className="flex-center gap-15 opacity-6 smallest uppercase font-bold">
                <span>{stats.words} Words</span>
                <span>{stats.chars} Characters</span>
            </div>
        </div>
        <div className="card p-20 about-content overflow-auto glass-card" style={{ height: '400px' }} dangerouslySetInnerHTML={{ __html: html }} />
      </div>
      <div className="flex-gap">
          <button className="btn-primary flex-1" onClick={exportPdf}>Export to PDF</button>
          <button className="pill flex-1" onClick={exportHtml}>Export to HTML</button>
          <button className="pill flex-1" onClick={copyHtml}><span className="material-icons" style={{fontSize: '1rem'}}>code</span> Copy HTML</button>
      </div>
      <ToolResult result={result} />
    </div>
  );
};

const DocTools = ({ toolId, onSubtoolChange }) => {
  const tabs = [
    { id: 'pdf', label: 'PDF Hub' },
    { id: 'image', label: 'Image Hub' },
    { id: 'text', label: 'Text Hub' },
    { id: 'md-editor', label: 'Markdown Editor' },
    { id: 'doc-translator', label: 'Doc Translator' }
  ].sort((a, b) => a.label.localeCompare(b.label));

  const [activeTab, setActiveTab] = useState('pdf');

  useEffect(() => {
    const current = tabs.find(t => t.id === activeTab);
    if (current && onSubtoolChange) onSubtoolChange(current.label);
  }, [activeTab]);

  useEffect(() => {
    if (toolId) {
        if (['pdf-merge', 'pdf-split', 'pdf-rotate', 'pdf-lock', 'pdf-unlock', 'pdf2img', 'ocr'].includes(toolId)) setActiveTab('pdf');
        else if (['img-format', 'img-resize', 'img-blur'].includes(toolId)) setActiveTab('image');
        else if (['case-converter', 'word-counter'].includes(toolId)) setActiveTab('text');
        else if (toolId === 'md-editor') setActiveTab('md-editor');
        else if (toolId === 'doc-translator') setActiveTab('doc-translator');
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

      <div className="hub-content">
          {activeTab === 'pdf' && <PdfHub subtool={toolId} />}
          {activeTab === 'image' && <ImageHub subtool={toolId} />}
          {activeTab === 'text' && <TextHub subtool={toolId} />}
          {activeTab === 'md-editor' && <MarkdownEditor />}
          {activeTab === 'doc-translator' && <DocTranslator />}
      </div>
    </div>
  );
};

export default DocTools;
