import React, { useState, useEffect } from 'react';
import { storage } from '../../../utils/storage';
import { TOOLS } from '../../../utils/tools';

const OpsLineage = () => {
    const [lineage, setLineage] = useState([]);

    useEffect(() => {
        const recent = storage.getJSON('hub_recent_tools', []);

        const flow = recent.map(id => {
            const tool = TOOLS.find(t => t.id === id);
            return tool ? tool.title : id;
        });
        setLineage(flow);
    }, []);

    return (
        <div className="card p-20 glass-card">
            <h3>Recent Data Lineage</h3>
            <p className="smallest opacity-6 mb-15">Dynamic visualization of your recent tool navigation path.</p>

            {lineage.length > 0 ? (
                <div className="p-20 bg-surface rounded-lg border mt-15">
                    <div className="flex-center flex-column gap-10">
                        <div className="p-10 bg-primary color-white rounded-lg w-full text-center shadow-sm">Toolbox Entry</div>

                        {lineage.map((hub, idx) => (
                            <React.Fragment key={idx}>
                                <span className="material-icons opacity-4" style={{fontSize: '1.2rem'}}>south</span>
                                <div className="p-12 bg-surface border rounded-lg w-full text-center font-bold animate-fadeIn" style={{animationDelay: `${idx * 0.1}s`}}>
                                    {hub}
                                </div>
                            </React.Fragment>
                        ))}

                        <span className="material-icons opacity-4" style={{fontSize: '1.2rem'}}>south</span>
                        <div className="p-10 bg-accent color-white rounded-lg w-full text-center shadow-sm">Current Context</div>
                    </div>
                </div>
            ) : (
                <div className="p-40 text-center opacity-4">
                    <span className="material-icons" style={{fontSize: '3rem'}}>account_tree</span>
                    <p>No recent tool lineage found.</p>
                </div>
            )}

            <div className="mt-15 p-10 bg-surface-variant rounded-lg smallest opacity-8 flex-center gap-10">
                <span className="material-icons" style={{fontSize: '1rem'}}>info</span>
                <span>Tracked via encrypted local navigation state.</span>
            </div>
        </div>
    );
};

export default OpsLineage;
