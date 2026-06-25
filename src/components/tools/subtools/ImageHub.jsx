import React, { useState, useRef } from 'react';
import ToolResult from '../ToolResult';

const ImageHub = () => {
    const [file, setFile] = useState(null);
    const [filter, setFilter] = useState('none');
    const [result, setResult] = useState(null);
    const canvasRef = useRef(null);

    const processImage = () => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.filter = filter === 'grayscale' ? 'grayscale(100%)' : filter === 'sepia' ? 'sepia(100%)' : filter === 'invert' ? 'invert(100%)' : 'none';
                ctx.drawImage(img, 0, 0);
                const dataUrl = canvas.toDataURL('image/png');
                setResult({ text: `Applied ${filter} filter`, url: dataUrl, filename: 'processed.png' });
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="card p-30 glass-card text-center grid gap-15">
            <h3>Image Hub (Offline Filters)</h3>
            <div className="file-input-wrapper">
                <input type="file" id="img-file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
                <label htmlFor="img-file" className="file-input-label">{file ? file.name : 'Select Image'}</label>
            </div>
            <select className="pill w-full" value={filter} onChange={e => setFilter(e.target.value)}>
                <option value="none">No Filter</option>
                <option value="grayscale">Grayscale</option>
                <option value="sepia">Sepia</option>
                <option value="invert">Invert</option>
            </select>
            <button className="btn-primary w-full" onClick={processImage}>Process Image</button>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <ToolResult result={result} />
        </div>
    );
};

export default ImageHub;
