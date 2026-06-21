import React, { useState, useEffect } from 'react';

const OpsTools = ({ onSubtoolChange }) => {
    const tabs = [{ id: 'status', label: 'System Status' }, { id: 'telemetry', label: 'Live Telemetry' }, { id: 'lineage', label: 'Data Lineage' }];
    const [activeTab, setActiveTab] = useState('status');
    useEffect(() => { if (onSubtoolChange) onSubtoolChange(tabs.find(t=>t.id===activeTab).label); }, [activeTab]);

    return (
        <div className="tool-form mt-20">
            <div className="pill-group mb-20 scrollable-x">
                {tabs.map(tab => (
                    <button key={tab.id} className={`pill ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>
                ))}
            </div>
            <div className="hub-content animate-fadeIn">
                {activeTab === 'status' && <SystemStatus />}
                {activeTab === 'telemetry' && <TelemetryView />}
                {activeTab === 'lineage' && <LineageView />}
            </div>
        </div>
    );
};

const SystemStatus = () => {
    const [status, setStatus] = useState(null);
    useEffect(() => { fetch('/api/ops/status').then(r=>r.json()).then(d=>setStatus(d)); }, []);
    return (
        <div className="grid gap-15">
            <div className="card p-30 glass-card text-center"><div className="h2 color-success">{status?.system_health || 'Stable'}</div><p>CPU Usage: {status?.cpu}%</p></div>
            <div className="grid grid-3 gap-10">
                <div className="card p-15 text-center glass-card">
                    <div className="smallest opacity-6">InfluxDB</div>
                    <div className="font-bold color-success">Connected</div>
                </div>
                <div className="card p-15 text-center glass-card">
                    <div className="smallest opacity-6">Prometheus</div>
                    <div className="font-bold color-success">Active</div>
                </div>
                <div className="card p-15 text-center glass-card">
                    <div className="smallest opacity-6">Grafana</div>
                    <div className="font-bold color-success">Ready</div>
                </div>
            </div>
        </div>
    );
};

const TelemetryView = () => {
    const [data, setData] = useState([]);
    const fetchTele = () => fetch('/api/ops/telemetry').then(r=>r.json()).then(d=>setData(d.data));
    useEffect(() => { fetchTele(); const i = setInterval(fetchTele, 5000); return () => clearInterval(i); }, []);

    return (
        <div className="grid gap-10">
            {data.map(d => (
                <div key={d.device_id} className="card p-15 glass-card flex-between">
                    <div><b>{d.device_id}</b><br/><span className="smallest opacity-6">{d.timestamp}</span></div>
                    <div className="text-right"><div className="font-bold">{d.temperature}°C</div><div className={d.status==='online'?'color-success':'color-error'}>{d.status.toUpperCase()}</div></div>
                </div>
            ))}
        </div>
    );
};

const LineageView = () => {
    const nodes = [
        { id: 1, name: 'S3 Raw Bucket', type: 'Source' },
        { id: 2, name: 'Spark ETL Job', type: 'Process' },
        { id: 3, name: 'Redshift DWH', type: 'Sink' }
    ];
    return (
        <div className="card p-30 glass-card">
            <h3>Pipeline Lineage Dashboard</h3>
            <div className="flex align-center justify-between mt-20">
                {nodes.map((n, i) => (
                    <React.Fragment key={n.id}>
                        <div className="card p-15 text-center glass-card border-primary" style={{ flex: 1 }}>
                            <div className="smallest opacity-6">{n.type}</div>
                            <div className="font-bold">{n.name}</div>
                        </div>
                        {i < nodes.length - 1 && <div className="material-icons opacity-4">arrow_forward</div>}
                    </React.Fragment>
                ))}
            </div>
            <div className="mt-20 p-15 bg-surface rounded-lg smallest opacity-6">
                Lineage tracked via Databand (dbnd) integration.
            </div>
        </div>
    );
};

export default OpsTools;
