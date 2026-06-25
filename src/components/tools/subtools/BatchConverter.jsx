import React, { useState } from 'react';
import JSZip from 'jszip';
import ToolResult from '../ToolResult';

const BatchConverter = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const processBatch = async () => {
        if (files.length === 0) return;
        setLoading(true);
        try {
            const zip = new JSZip();
            for (const file of files) {
                zip.file(file.name, file);
            }
            const content = await zip.generateAsync({ type: 'blob' });
            setResult({ text: `Processed ${files.length} files into a ZIP.`, blob: content, filename: 'batch_output.zip' });
        } catch (e) {
            setResult({ error: e.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card p-30 glass-card text-center grid gap-15">
            <h3>Batch Converter (Offline)</h3>
            <div className="file-input-wrapper">
                <input type="file" id="batch-files" multiple onChange={e => setFiles(Array.from(e.target.files))} />
                <label htmlFor="batch-files" className="file-input-label">{files.length > 0 ? `${files.length} files selected` : 'Select Files'}</label>
            </div>
            <button className="btn-primary w-full" onClick={processBatch} disabled={loading}>{loading ? 'Processing...' : 'Start Batch'}</button>
            <ToolResult result={result} />
        </div>
    );
};

export default BatchConverter;
