import React, { useState, useEffect } from 'react';

const NotionHistory = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch('/api/notion/history');
                const data = await res.json();
                setHistory(data);
            } catch (e) {}
        };
        fetchHistory();
    }, []);

    return (
        <div className="card p-20 glass-card">
            <h3>Sync & Task History</h3>
            <div className="grid gap-10 mt-15">
                {history.map(task => (
                    <div key={task.id} className="flex-between p-10 bg-surface rounded-lg">
                        <div className="grid">
                            <span className="font-bold">{task.type}: {task.details}</span>
                            <span className="smallest opacity-6">{task.timestamp}</span>
                        </div>
                        <span className={`badge badge-${task.status === 'success' ? 'success' : task.status === 'failed' ? 'danger' : 'warning'}`}>
                            {task.status.toUpperCase()}
                        </span>
                    </div>
                ))}
                {history.length === 0 && <div className="text-center p-40 opacity-5">No sync history available.</div>}
            </div>
        </div>
    );
};

export default NotionHistory;
