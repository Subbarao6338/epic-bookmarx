import React, { useState } from 'react';
import { copyToClipboard, downloadFile } from '../../utils/helpers';

const ToolResult = ({ result, title = 'Result', showPreview = true, onClear }) => {
    const [copySuccess, setCopySuccess] = useState(false);

    if (!result) return null;

    const text = typeof result === 'string' ? result : (result.text || '');
    const filename = result.filename || 'result';
    const blob = result.blob;
    const url = result.url;
    const error = result.error;

    const handleCopy = () => {
        copyToClipboard(text, () => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        });
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Epic Toolbox - ${title}`,
                    text: text.length > 200 ? text.substring(0, 200) + '...' : text,
                    url: url || window.location.href
                });
            } catch (err) {
                if (err.name !== 'AbortError') handleCopy();
            }
        } else {
            handleCopy();
        }
    };

    const handleDownload = (format) => {
        if (blob && format === 'pdf' && filename.endsWith('.pdf')) {
            downloadFile(blob, filename, 'pdf');
        } else {
            downloadFile(text, filename, format);
        }
    };

    return (
        <div className="tool-result-container animate-fadeIn mt-20">
            <div className="flex-between mb-10">
                <div className="opacity-6 smallest uppercase font-bold">{title}</div>
                <div className="flex-gap">
                    {onClear && (
                        <button
                            className="icon-btn"
                            onClick={onClear}
                            title="Clear Result"
                            style={{ width: '32px', height: '32px' }}
                        >
                            <span className="material-icons" style={{ fontSize: '1.1rem' }}>delete_outline</span>
                        </button>
                    )}
                    <button
                        className="icon-btn"
                        onClick={handleShare}
                        title="Share Result"
                        style={{ width: '32px', height: '32px' }}
                    >
                        <span className="material-icons" style={{ fontSize: '1.1rem' }}>share</span>
                    </button>
                    <button
                        className={`icon-btn ${copySuccess ? 'copy-success' : ''}`}
                        onClick={handleCopy}
                        title="Copy Result"
                        style={{ width: '32px', height: '32px' }}
                    >
                        <span className="material-icons" style={{ fontSize: '1.1rem' }}>{copySuccess ? 'check' : 'content_copy'}</span>
                    </button>
                    <div className="dropdown-container">
                        <button
                            className="icon-btn"
                            title="Download Result"
                            style={{ width: '32px', height: '32px' }}
                        >
                            <span className="material-icons" style={{ fontSize: '1.1rem' }}>download</span>
                        </button>
                        <div className="dropdown-menu">
                            <button onClick={() => handleDownload('txt')}>.TXT</button>
                            <button onClick={() => handleDownload('md')}>.MD</button>
                            <button onClick={() => handleDownload('pdf')}>.PDF</button>
                        </div>
                    </div>
                </div>
            </div>

            {error ? (
                <div className="tool-result danger-box" style={{ margin: 0 }}>
                    <div className="flex-center gap-10" style={{ justifyContent: 'flex-start' }}>
                        <span className="material-icons">error_outline</span>
                        <span className="font-bold">{error}</span>
                    </div>
                </div>
            ) : showPreview && url ? (
                <div className="card p-15 text-center glass-card overflow-hidden">
                    <img src={url} alt="Result Preview" style={{ width: '100%', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }} />
                </div>
            ) : (
                <pre className="tool-result" style={{ margin: 0 }}>{text}</pre>
            )}
        </div>
    );
};

export default ToolResult;
