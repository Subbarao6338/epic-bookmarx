import React, { useState, useRef } from 'react';
import ToolResult from '../ToolResult';

const ImageLab = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const runTransform = (type) => {
        if (!file) return setResult({ error: 'Select image.' });
        setLoading(true);
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width; canvas.height = img.height;
                if (type === 'rotate') {
                    canvas.width = img.height; canvas.height = img.width;
                    ctx.translate(canvas.width / 2, canvas.height / 2); ctx.rotate(90 * Math.PI / 180);
                    ctx.drawImage(img, -img.width / 2, -img.height / 2);
                } else if (type === 'flip') { ctx.scale(-1, 1); ctx.drawImage(img, -img.width, 0); }
                else if (type === 'grayscale') { ctx.filter = 'grayscale(100%)'; ctx.drawImage(img, 0, 0); }
                else if (type === 'anonymize') {
                    ctx.drawImage(img, 0, 0); ctx.filter = 'blur(15px)';
                    const bx = canvas.width * 0.1, by = canvas.height * 0.1, bw = canvas.width * 0.8, bh = canvas.height * 0.8;
                    ctx.drawImage(img, bx, by, bw, bh, bx, by, bw, bh); ctx.filter = 'none';
                } else { ctx.drawImage(img, 0, 0); }
                const url = canvas.toDataURL('image/png');
                setResult({ text: `Applied ${type} transformation`, url, filename: `transformed_${type}.png` });
                setLoading(false);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="card p-30 glass-card grid gap-15">
            <h3>Image Privacy Lab (Canvas)</h3>
            <div className="file-input-wrapper"><input type="file" id="img-in" onChange={e=>setFile(e.target.files[0])} accept="image/*" /><label htmlFor="img-in" className="file-input-label">{file?file.name:'Choose Image'}</label></div>
            <button className="btn-primary w-full" onClick={()=>runTransform('anonymize')} disabled={loading}>Anonymize Image (Blur)</button>
            <div className="grid grid-3 gap-10">
                <button className="pill" onClick={()=>runTransform('rotate')} disabled={loading}>Rotate</button>
                <button className="pill" onClick={()=>runTransform('flip')} disabled={loading}>Flip</button>
                <button className="pill" onClick={()=>runTransform('grayscale')} disabled={loading}>Gray</button>
            </div>
            <ToolResult result={result} />
        </div>
    );
};

export default ImageLab;
