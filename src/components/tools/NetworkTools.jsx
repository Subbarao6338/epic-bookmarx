import React, { useState, useEffect } from 'react';
import ToolResult from './ToolResult';
import { copyToClipboard } from '../../utils/helpers';

const NetworkTools = ({ toolId, onSubtoolChange }) => {
  const tabs = [
    { id: 'ip-info', label: 'IP Info' },
    { id: 'ping', label: 'Ping' },
    { id: 'dns', label: 'DNS' },
    { id: 'whois', label: 'Whois' },
    { id: 'speed', label: 'Speed' },
    { id: 'geo', label: 'Geo' },
    { id: 'ssl', label: 'SSL' },
    { id: 'subnet', label: 'Subnet' },
    { id: 'bluetooth', label: 'Bluetooth' }
  ].sort((a, b) => a.label.localeCompare(b.label));

  const [activeTab, setActiveTab] = useState('ip-info');

  useEffect(() => {
    const current = tabs.find(t => t.id === activeTab);
    if (current && onSubtoolChange) onSubtoolChange(current.label);
  }, [activeTab]);

  useEffect(() => {
    if (toolId) {
      const mapping = {
        'ip-info': 'ip-info',
        'ping': 'ping',
        'dns': 'dns',
        'whois': 'whois',
        'speed': 'speed',
        'geo': 'geo',
        'ssl': 'ssl',
        'subnet': 'subnet',
        'bluetooth': 'bluetooth'
      };
      if (mapping[toolId]) setActiveTab(mapping[toolId]); else if (tabs.length > 0) setActiveTab(tabs[0].id);
    }
  }, [toolId]);

  return (
    <div className="tool-form mt-20">
      <div className="pill-group mb-20 scrollable-x">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`pill ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="hub-content animate-fadeIn">
        {activeTab === 'ip-info' && <IpInfoTool />}
        {activeTab === 'ping' && <PingTool />}
        {activeTab === 'dns' && <DnsTool />}
        {activeTab === 'whois' && <WhoisTool />}
        {activeTab === 'speed' && <SpeedTestTool />}
        {activeTab === 'geo' && <GeoTool />}
        {activeTab === 'ssl' && <SslTool />}
        {activeTab === 'subnet' && <SubnetCalculator />}
        {activeTab === 'bluetooth' && <BluetoothTool />}
      </div>
    </div>
  );
};

const IpInfoTool = () => {
  const [publicIp, setPublicIp] = useState('Loading...');
  const [localIp, setLocalIp] = useState('Detecting...');
  const [geoInfo, setGeoInfo] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  const handleCopy = (text, field) => {
    copyToClipboard(text, () => {
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    });
  };

  useEffect(() => {
    fetch('https://ipapi.co/json/').then(res => res.json()).then(data => {
      setPublicIp(data.ip);
      setGeoInfo(data);
    }).catch(() => setPublicIp('Failed to fetch'));

    const pc = new RTCPeerConnection({ iceServers: [] });
    pc.createDataChannel('');
    pc.createOffer().then(offer => pc.setLocalDescription(offer));
    pc.onicecandidate = (ice) => {
      if (!ice || !ice.candidate || !ice.candidate.candidate) return;
      const match = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate);
      if (match) setLocalIp(match[1]);
      pc.onicecandidate = () => {};
    };
  }, []);

  const resultText = `Public IP: ${publicIp}\nLocal IP: ${localIp}\nCity: ${geoInfo?.city || 'N/A'}\nISP: ${geoInfo?.org || 'N/A'}`;

  return (
    <div className="grid gap-15">
      <div className="grid grid-2 gap-15">
        <div className="card p-20 glass-card" onClick={() => handleCopy(publicIp, 'public')}>
            <div className="flex-between mb-10">
                <div className="opacity-6 smallest uppercase font-bold">Public Address</div>
                <span className="material-icons smallest color-primary">{copiedField === 'public' ? 'check' : 'content_copy'}</span>
            </div>
            <div className="font-mono h2 color-primary text-center">{publicIp}</div>
        </div>
        <div className="card p-20 glass-card" onClick={() => handleCopy(localIp, 'local')}>
            <div className="flex-between mb-10">
                <div className="opacity-6 smallest uppercase font-bold">Local Address</div>
                <span className="material-icons smallest opacity-6">{copiedField === 'local' ? 'check' : 'content_copy'}</span>
            </div>
            <div className="font-mono h2 opacity-8 text-center">{localIp}</div>
        </div>
      </div>
      {geoInfo && (
          <div className="card p-20 glass-card grid grid-2-cols gap-10">
              <div>ISP: <b>{geoInfo.org}</b></div>
              <div>City: <b>{geoInfo.city}</b></div>
              <div>Country: <b>{geoInfo.country_name}</b></div>
              <div>Region: <b>{geoInfo.region}</b></div>
          </div>
      )}
      <ToolResult result={{ text: resultText, filename: 'ip_info.txt' }} />
    </div>
  );
};

const PingTool = () => {
  const [host, setHost] = useState('google.com');
  const [results, setResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const runPing = async () => {
    setIsRunning(true);
    setResults([`Pinging ${host}...`]);

    const url = host.startsWith('http') ? host : `https://${host}`;
    const start = Date.now();

    try {
        await fetch(url, { mode: 'no-cors' });
        const latency = Date.now() - start;
        const msg = `Reply from ${host}: time=${latency}ms`;
        setResults([msg]);
    } catch (err) {
        setResults([`Error: Could not reach ${host}`, err.message]);
    } finally {
        setIsRunning(false);
    }
  };

  return (
    <div className="grid gap-15">
      <div className="flex-gap glass-card card p-10">
        <input type="text" value={host} onChange={e => setHost(e.target.value)} className="pill flex-1 border-none shadow-none" placeholder="google.com" />
        <button className="btn-primary" onClick={runPing} disabled={isRunning}>{isRunning ? '...' : 'Ping'}</button>
      </div>
      <div className="text-center opacity-6 smallest uppercase font-bold">
        Uses HTTPS-based latency detection
      </div>
      <div className="tool-result font-mono" style={{ background: '#1a1a1a', color: '#00ff00' }}>
        {results.map((r, i) => <div key={i}>{r}</div>)}
      </div>
      <ToolResult result={{ text: results.join('\n'), filename: 'ping_results.txt' }} />
    </div>
  );
};

const DnsTool = () => {
    const [domain, setDomain] = useState('github.com');
    const [records, setRecords] = useState(null);
    const [isRunning, setIsRunning] = useState(false);

    const lookup = async () => {
        setIsRunning(true);
        try {
            const res = await fetch(`https://dns.google/resolve?name=${domain}`);
            const data = await res.json();
            if (data.Answer) {
                const formatted = {};
                data.Answer.forEach(ans => {
                    // Mapping common DNS type numbers to labels
                    const types = { 1: 'A', 28: 'AAAA', 15: 'MX', 16: 'TXT', 2: 'NS', 5: 'CNAME', 6: 'SOA' };
                    const type = types[ans.type] || `TYPE_${ans.type}`;
                    (formatted[type] || (formatted[type] = [])).push(ans.data);
                });
                setRecords(formatted);
            } else setRecords({'Error': ['No records found']});
        } catch(e) {
            setRecords({'Error': ['Lookup failed: ' + e.message]});
        } finally {
            setIsRunning(false);
        }
    };

    const resultText = records ? Object.entries(records).map(([t,v]) => `${t}:\n  ${v.join('\n  ')}`).join('\n\n') : '';

    return (
        <div className="grid gap-15">
            <div className="flex-gap card p-10 glass-card">
                <input type="text" value={domain} onChange={e => setDomain(e.target.value)} className="pill flex-1 border-none shadow-none" placeholder="github.com" />
                <button className="btn-primary" onClick={lookup} disabled={isRunning}>{isRunning ? '...' : 'Lookup'}</button>
            </div>
            {records && (
                <div className="tool-result font-mono">
                    {Object.entries(records).map(([t,v])=>(
                        <div key={t} className="mb-10">
                            <div className="font-bold color-primary">{t}</div>
                            {v.map((val,i)=><div key={i} style={{paddingLeft: '10px'}}>{val}</div>)}
                        </div>
                    ))}
                </div>
            )}
            <ToolResult result={{ text: resultText, filename: 'dns_records.txt' }} />
        </div>
    );
};

const SpeedTestTool = () => {
    const [speed, setSpeed] = useState(null);
    const [loading, setLoading] = useState(false);
    const run = async () => {
        setLoading(true); const start = Date.now();
        try {
            // Using a large image from Wikimedia for speed test
            const res = await fetch('https://upload.wikimedia.org/wikipedia/commons/3/3f/Fronalpstock_big.jpg', { cache: 'no-store' });
            const blob = await res.blob();
            const duration = (Date.now() - start) / 1000;
            const mbps = ((blob.size * 8) / (duration * 1024 * 1024)).toFixed(2);
            setSpeed(mbps);
        } catch(e) { alert("Test failed. Check connection."); }
        finally { setLoading(false); }
    };
    return (
        <div className="card p-30 text-center glass-card">
            <span className="material-icons" style={{fontSize: '4rem', color: 'var(--primary)'}}>speed</span>
            <div style={{fontSize: '3rem', fontWeight: 800}} className="mb-20">{speed ? `${speed} Mbps` : '---'}</div>
            <button className="btn-primary w-full" onClick={run} disabled={loading}>{loading ? 'Testing...' : 'Start Test'}</button>
            <ToolResult result={speed ? `Download Speed: ${speed} Mbps` : null} />
        </div>
    );
};

const WhoisTool = () => {
    const [domain, setDomain] = useState('example.com');
    const [out, setOut] = useState('');
    const [isRunning, setIsRunning] = useState(false);

    const run = async () => {
        setIsRunning(true);
        try {
            const res = await fetch(`https://rdap.org/domain/${domain}`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();

            let formatted = `Domain: ${data.handle}\n`;
            if (data.status) formatted += `Status: ${data.status.join(', ')}\n`;

            if (data.events) {
                data.events.forEach(e => {
                    formatted += `${e.eventAction}: ${new Date(e.eventDate).toLocaleString()}\n`;
                });
            }

            if (data.entities) {
                const registrar = data.entities.find(e => e.roles.includes('registrar'));
                if (registrar) {
                    const vcard = registrar.vcardArray?.[1];
                    const fn = vcard?.find(item => item[0] === 'fn')?.[3];
                    if (fn) formatted += `Registrar: ${fn}\n`;
                }
            }

            setOut(formatted || JSON.stringify(data, null, 2));
        } catch(e) {
            setOut('WHOIS (RDAP) query failed: ' + e.message);
        } finally {
            setIsRunning(false);
        }
    };
    return (
        <div className="grid gap-15">
            <div className="flex-gap card p-10 glass-card">
                <input type="text" value={domain} onChange={e=>setDomain(e.target.value)} className="pill flex-1 border-none shadow-none" placeholder="example.com" />
                <button className="btn-primary" onClick={run} disabled={isRunning}>{isRunning ? '...' : 'Whois'}</button>
            </div>
            <pre className="tool-result font-mono" style={{fontSize: '0.75rem', maxHeight: '300px', overflow: 'auto'}}>{out}</pre>
            <ToolResult result={{ text: out, filename: 'whois.txt' }} />
        </div>
    );
};

const GeoTool = () => {
    const [ip, setIp] = useState('');
    const [info, setInfo] = useState(null);
    const run = async () => {
        try {
            const res = await fetch(`https://ipapi.co/${ip}/json/`);
            const data = await res.json();
            setInfo(data);
        } catch(e) { alert("Geo lookup failed"); }
    };
    const resultText = info ? `IP: ${info.ip}\nCity: ${info.city}\nRegion: ${info.region}\nCountry: ${info.country_name}\nISP: ${info.org}` : '';
    return (
        <div className="grid gap-15">
            <div className="flex-gap card p-10 glass-card">
                <input type="text" value={ip} onChange={e=>setIp(e.target.value)} className="pill flex-1 border-none shadow-none" placeholder="IP Address" />
                <button className="btn-primary" onClick={run}>Locate</button>
            </div>
            {info && <div className="tool-result"><b>{info.city}, {info.country_name}</b><br/>{info.org}</div>}
            <ToolResult result={{ text: resultText, filename: 'geo_info.txt' }} />
        </div>
    );
};

const SslTool = () => {
    const [host, setHost] = useState('google.com');
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(false);

    const check = async () => {
        setLoading(true);
        try {
            // SSL verification usually requires a backend.
            // In a purely client-side app, we can try to check if we can connect via HTTPS.
            const start = Date.now();
            const res = await fetch(`https://${host}`, { mode: 'no-cors' });
            setInfo({
                valid: true,
                host: host,
                note: "Host is reachable via HTTPS. Native SSL details require server-side verification."
            });
        } catch(e) {
            setInfo({ valid: false, error: "Connection failed or SSL invalid." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid gap-15">
            <div className="flex-gap card p-10 glass-card">
                <input className="pill flex-1 border-none shadow-none" value={host} onChange={e=>setHost(e.target.value)} placeholder="google.com" />
                <button className="btn-primary" onClick={check} disabled={loading}>{loading ? '...' : 'Check'}</button>
            </div>
            {info && (
                <div className={`tool-result ${info.valid ? '' : 'danger-box'}`}>
                    {info.valid ? (
                        <>
                            <div className="font-bold text-lg mb-5">HTTPS Connectivity: OK</div>
                            <div>Host: {info.host}</div>
                            <div className="mt-10 smallest opacity-6">{info.note}</div>
                        </>
                    ) : (
                        <div>Error: {info.error}</div>
                    )}
                </div>
            )}
            <ToolResult result={info ? JSON.stringify(info, null, 2) : null} />
        </div>
    );
};

const SubnetCalculator = () => {
  const [ip, setIp] = useState('192.168.1.1');
  const [mask, setMask] = useState('24');
  const [res, setRes] = useState(null);
  const calc = () => {
    try {
      const parts = ip.split('.').map(Number);
      if (parts.length !== 4 || parts.some(p => p < 0 || p > 255)) throw new Error("Invalid IP");
      const m = parseInt(mask);
      if (isNaN(m) || m < 0 || m > 32) throw new Error("Invalid Mask");

      const ipNum = ((parts[0]<<24)|(parts[1]<<16)|(parts[2]<<8)|parts[3])>>>0;
      const maskNum = m===0?0:(-1<<(32-m))>>>0;
      const netNum = (ipNum & maskNum)>>>0;
      const brNum = (netNum | ~maskNum)>>>0;
      const toIp = n => [(n>>>24)&255, (n>>>16)&255, (n>>>8)&255, n&255].join('.');
      setRes({ net: toIp(netNum), br: toIp(brNum), hosts: m === 32 ? 1 : m === 31 ? 2 : Math.pow(2, 32-m)-2 });
    } catch(e) {
        alert(e.message);
    }
  };
  const resultText = res ? `Network: ${res.net}\nBroadcast: ${res.br}\nUsable Hosts: ${res.hosts}` : '';
  return (
    <div className="grid gap-15">
      <div className="flex-gap card p-10 glass-card">
        <input value={ip} onChange={e=>setIp(e.target.value)} className="pill flex-1 border-none shadow-none" placeholder="192.168.1.1" />
        <input value={mask} onChange={e=>setMask(e.target.value)} className="pill border" style={{width: '80px'}} placeholder="24" />
      </div>
      <button className="btn-primary" onClick={calc}>Calculate</button>
      {res && <div className="tool-result font-mono">Net: {res.net}<br/>Broadcast: {res.br}<br/>Hosts: {res.hosts}</div>}
      <ToolResult result={{ text: resultText, filename: 'subnet.txt' }} />
    </div>
  );
};

const BluetoothTool = () => (
    <div className="card p-30 text-center glass-card">
        <span className="material-icons" style={{fontSize: '4rem', color: 'var(--primary)'}}>bluetooth</span>
        <div className="mt-15 opacity-6">Web Bluetooth requires secure context and user interaction.</div>
        <button className="btn-primary mt-20" onClick={async () => {
            if (!navigator.bluetooth) {
                alert("Web Bluetooth is not supported in this browser.");
                return;
            }
            try {
                const device = await navigator.bluetooth.requestDevice({acceptAllDevices: true});
                alert(`Connected to ${device.name || 'Unnamed Device'}`);
            } catch(e) { alert("Access denied or unsupported."); }
        }}>Scan Devices</button>
    </div>
);

export default NetworkTools;
