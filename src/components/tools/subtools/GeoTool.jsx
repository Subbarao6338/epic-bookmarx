import React, { useState } from 'react';
import ToolResult from '../ToolResult';

const GeoTool = () => {
    const [result, setResult] = useState(null);
    const getGeo = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setResult({ text: `Latitude: ${pos.coords.latitude}\nLongitude: ${pos.coords.longitude}\nAccuracy: ${pos.coords.accuracy}m` }),
                (err) => setResult({ error: err.message })
            );
        } else {
            setResult({ error: "Geolocation not supported" });
        }
    };
    return (
        <div className="card p-30 glass-card text-center grid gap-15">
            <h3>Device Geolocation</h3>
            <button className="btn-primary w-full" onClick={getGeo}>Get Current Position</button>
            <ToolResult result={result} />
        </div>
    );
};

export default GeoTool;
