import React, { useState } from 'react';
import ToolResult from '../ToolResult';

const BluetoothScanner = () => {
    const [result, setResult] = useState(null);
    const scan = async () => {
        try {
            const device = await navigator.bluetooth.requestDevice({ acceptAllDevices: true });
            setResult({ text: `Device Found: ${device.name || 'Unnamed'}\nID: ${device.id}` });
        } catch (e) {
            setResult({ error: e.message });
        }
    };
    return (
        <div className="card p-30 glass-card text-center grid gap-15">
            <h3>Bluetooth Scanner</h3>
            <button className="btn-primary w-full" onClick={scan}>Scan for Devices</button>
            <ToolResult result={result} />
        </div>
    );
};

export default BluetoothScanner;
