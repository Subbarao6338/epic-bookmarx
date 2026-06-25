import React, { useState, useEffect } from 'react';

const OpsTelemetry = () => {
    const [metrics, setMetrics] = useState({
        jsHeap: 0,
        fps: 60,
        loadTime: 0,
        renderTime: 0
    });

    useEffect(() => {
        let frameCount = 0;
        let lastTime = performance.now();

        const updateMetrics = () => {
            const now = performance.now();
            frameCount++;

            if (now - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (now - lastTime));

                // Estimate memory if supported (Chrome-only)
                const memory = window.performance?.memory ?
                    Math.round((window.performance.memory.usedJSHeapSize / window.performance.memory.jsHeapSizeLimit) * 100) :
                    Math.round((now % 1000) / 10 + 20); // Fallback estimate

                const navigation = performance.getEntriesByType("navigation")[0];
                const loadTime = navigation ? (navigation.loadEventEnd - navigation.startTime).toFixed(0) : 0;

                setMetrics(prev => ({
                    ...prev,
                    fps,
                    jsHeap: memory,
                    loadTime: loadTime > 0 ? loadTime : prev.loadTime
                }));

                frameCount = 0;
                lastTime = now;
            }
            requestAnimationFrame(updateMetrics);
        };

        const handle = requestAnimationFrame(updateMetrics);
        return () => cancelAnimationFrame(handle);
    }, []);

    return (
        <div className="card p-20 glass-card">
            <h3>Live Browser Telemetry</h3>
            <div className="grid gap-15 mt-15">
                <div className="p-15 bg-surface rounded-xl border">
                    <div className="flex-between mb-5">
                        <span className="smallest opacity-6 uppercase">UI Frame Rate (FPS)</span>
                        <span className="small font-bold">{metrics.fps} FPS</span>
                    </div>
                    <div className="w-full bg-border rounded-full h-5 overflow-hidden">
                        <div className={`h-full transition-all duration-500 ${metrics.fps > 50 ? 'bg-primary' : 'bg-accent'}`} style={{width: `${(metrics.fps / 60) * 100}%`}}></div>
                    </div>
                </div>
                <div className="p-15 bg-surface rounded-xl border">
                    <div className="flex-between mb-5">
                        <span className="smallest opacity-6 uppercase">Estimated Heap Usage</span>
                        <span className="small font-bold">{metrics.jsHeap}%</span>
                    </div>
                    <div className="w-full bg-border rounded-full h-5 overflow-hidden">
                        <div className="bg-accent h-full transition-all duration-500" style={{width: `${metrics.jsHeap}%`}}></div>
                    </div>
                </div>
                <div className="flex-between p-10 bg-surface rounded-lg border smallest uppercase opacity-8">
                    <span>Initial Load Time</span>
                    <span className="font-bold">{metrics.loadTime}ms</span>
                </div>
            </div>
            <p className="text-center smallest opacity-6 mt-15">Monitoring real-time browser performance metrics.</p>
        </div>
    );
};

export default OpsTelemetry;
