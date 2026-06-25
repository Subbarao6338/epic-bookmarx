import React, { useState, useRef, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import JsBarcode from 'jsbarcode';
import ToolResult from '../ToolResult';

const QrBarcodeGen = () => {
    const [input, setInput] = useState('https://github.com');
    const [type, setType] = useState('qr');
    const barcodeRef = useRef(null);
    const [result, setResult] = useState(null);

    useEffect(() => {
        if (type === 'barcode' && barcodeRef.current) {
            try {
                JsBarcode(barcodeRef.current, input, { format: "CODE128", displayValue: true });
            } catch (e) {}
        }
    }, [input, type]);

    const handleDownload = () => {
        const svg = document.getElementById('gen-output');
        if (!svg) return;
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL("image/png");
            setResult({ text: `Generated ${type}`, url: pngFile, filename: `${type}.png` });
        };
        img.src = "data:image/svg+xml;base64," + btoa(svgData);
    };

    return (
        <div className="grid gap-15 text-center">
            <div className="pill-group">
                <button className={`pill ${type==='qr'?'active':''}`} onClick={()=>setType('qr')}>QR Code</button>
                <button className={`pill ${type==='barcode'?'active':''}`} onClick={()=>setType('barcode')}>Barcode</button>
            </div>
            <input className="pill w-full" placeholder="Enter text or URL..." value={input} onChange={e=>setInput(e.target.value)} />

            <div className="card p-20 bg-white flex-center" style={{minHeight: '200px'}}>
                {type === 'qr' ? (
                    <QRCodeSVG id="gen-output" value={input} size={200} level="H" />
                ) : (
                    <svg id="gen-output" ref={barcodeRef}></svg>
                )}
            </div>

            <button className="btn-primary w-full" onClick={handleDownload}>Export as PNG</button>
            <ToolResult result={result} />
        </div>
    );
};

export default QrBarcodeGen;
