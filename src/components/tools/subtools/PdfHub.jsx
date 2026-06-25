import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import ToolResult from '../ToolResult';

const PdfHub = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const mergePdfs = async () => {
        if (files.length < 2) return alert('Select at least 2 PDF files to merge.');
        setLoading(true);
        try {
            const mergedPdf = await PDFDocument.create();
            for (const file of files) {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }
            const pdfBytes = await mergedPdf.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            setResult({ text: 'PDFs merged successfully', blob, filename: 'merged.pdf' });
        } catch (e) {
            setResult({ error: e.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card p-30 glass-card text-center grid gap-15">
            <h3>PDF Hub (Offline Merge)</h3>
            <div className="file-input-wrapper">
                <input type="file" id="pdf-files" multiple accept=".pdf" onChange={e => setFiles(Array.from(e.target.files))} />
                <label htmlFor="pdf-files" className="file-input-label">{files.length > 0 ? `${files.length} PDFs selected` : 'Select PDFs'}</label>
            </div>
            <button className="btn-primary w-full" onClick={mergePdfs} disabled={loading}>{loading ? 'Merging...' : 'Merge PDFs'}</button>
            <ToolResult result={result} />
        </div>
    );
};

export default PdfHub;
