import React, { useState } from 'react';

const OpsStatus = () => {
    const stats = {
        browser: navigator.userAgent.split(' ').pop(),
        language: navigator.language,
        cores: navigator.hardwareConcurrency || 'N/A',
        memory: navigator.deviceMemory ? `${navigator.deviceMemory}GB` : 'N/A',
        online: navigator.onLine ? 'YES' : 'OFFLINE',
        platform: navigator.platform
    };

    return (
        <div className="grid gap-15">
            <div className="card p-20 glass-card">
                <h3>System & Browser Health</h3>
                <div className="grid grid-2-cols gap-15 mt-15">
                    <div className="p-15 bg-surface rounded-xl border-success">
                        <div className="flex-between">
                            <span>Browser Status</span>
                            <span className="material-icons color-success">check_circle</span>
                        </div>
                        <div className="text-xl font-bold mt-5">{stats.online}</div>
                    </div>
                    <div className="p-15 bg-surface rounded-xl">
                        <div className="flex-between smallest opacity-6">
                            <span>CPU Cores</span>
                            <span className="material-icons" style={{fontSize: '1rem'}}>memory</span>
                        </div>
                        <div className="text-xl font-bold mt-5">{stats.cores}</div>
                    </div>
                    <div className="p-15 bg-surface rounded-xl">
                        <div className="flex-between smallest opacity-6">
                            <span>Device RAM</span>
                            <span className="material-icons" style={{fontSize: '1rem'}}>sd_card</span>
                        </div>
                        <div className="text-xl font-bold mt-5">{stats.memory}</div>
                    </div>
                    <div className="p-15 bg-surface rounded-xl">
                        <div className="flex-between smallest opacity-6">
                            <span>Platform</span>
                            <span className="material-icons" style={{fontSize: '1rem'}}>laptop</span>
                        </div>
                        <div className="smallest font-bold mt-5 overflow-hidden text-ellipsis">{stats.platform}</div>
                    </div>
                </div>
                <div className="mt-15 p-10 bg-surface rounded-lg smallest font-mono opacity-6 overflow-auto">
                    {navigator.userAgent}
                </div>
            </div>
        </div>
    );
};

export default OpsStatus;
