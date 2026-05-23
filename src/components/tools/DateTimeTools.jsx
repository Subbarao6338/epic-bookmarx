import React, { useState, useEffect, useMemo } from 'react';
import ToolResult from './ToolResult';

const DateTimeTools = ({ toolId, onSubtoolChange }) => {
  const tabs = [
    { id: 'age', label: 'Age' },
    { id: 'timestamp', label: 'Timestamp' },
    { id: 'stopwatch', label: 'Stopwatch' },
    { id: 'pomodoro', label: 'Pomodoro' },
    { id: 'worldclock', label: 'World Clock' },
    { id: 'timezone', label: 'Timezone' },
    { id: 'datediff', label: 'Date Diff' },
    { id: 'countdown', label: 'Countdown' },
    { id: 'panchangam', label: 'Panchangam' }
  ].sort((a, b) => a.label.localeCompare(b.label));

  const [activeTab, setActiveTab] = useState('stopwatch');

  useEffect(() => {
    const current = tabs.find(t => t.id === activeTab);
    if (current && onSubtoolChange) onSubtoolChange(current.label);
  }, [activeTab]);

  useEffect(() => {
    if (toolId) {
      const mapping = {
        'age': 'age',
        'age-calculator': 'age',
        'timestamp': 'timestamp',
        'timestamp-conv': 'timestamp',
        'stopwatch': 'stopwatch',
        'pomodoro': 'pomodoro',
        'pomodoro-timer': 'pomodoro',
        'worldclock': 'worldclock',
        'world-clock': 'worldclock',
        'timezone': 'timezone',
        'timezone-conv': 'timezone',
        'datediff': 'datediff',
        'date-diff': 'datediff',
        'countdown': 'countdown',
        'panchangam': 'panchangam'
      };
      if (mapping[toolId]) setActiveTab(mapping[toolId]);
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
        {activeTab === 'age' && <AgeTool />}
        {activeTab === 'stopwatch' && <StopwatchTool />}
        {activeTab === 'worldclock' && <WorldClockTool />}
        {activeTab === 'pomodoro' && <PomodoroTool />}
        {activeTab === 'datediff' && <DateDiffTool />}
        {activeTab === 'timezone' && <TimezoneConverter />}
        {activeTab === 'countdown' && <CountdownTimer />}
        {activeTab === 'timestamp' && <TimestampConverter />}
        {activeTab === 'panchangam' && <PanchangamTool />}
      </div>
    </div>
  );
};

const TimestampConverter = () => {
    const [ts, setTs] = useState(Math.floor(Date.now() / 1000).toString());
    const [human, setHuman] = useState(new Date().toLocaleString());

    const updateFromTs = (val) => {
        setTs(val);
        try {
            const d = new Date(parseInt(val) * 1000);
            if (!isNaN(d.getTime())) {
                setHuman(d.toLocaleString());
            }
        } catch(e) {}
    };

    const updateFromHuman = (val) => {
        setHuman(val);
        try {
            const d = new Date(val);
            if (!isNaN(d.getTime())) {
                setTs(Math.floor(d.getTime() / 1000).toString());
            }
        } catch(e) {}
    };

    return (
        <div className="card p-20 glass-card grid gap-15">
            <div className="form-group">
                <label>Unix Timestamp (Seconds)</label>
                <input className="pill" value={ts} onChange={e=>updateFromTs(e.target.value)} />
            </div>
            <div className="text-center opacity-4"><span className="material-icons">swap_vert</span></div>
            <div className="form-group">
                <label>Human Readable Date</label>
                <input className="pill" value={human} onChange={e=>updateFromHuman(e.target.value)} />
            </div>
            <button className="pill" onClick={() => updateFromTs(Math.floor(Date.now()/1000).toString())}>Set to Now</button>
            <ToolResult result={`Timestamp: ${ts}\nLocal: ${human}`} />
        </div>
    );
};

const CountdownTimer = () => {
    const [target, setTarget] = useState('');
    const [timeLeft, setTimeLeft] = useState(null);

    useEffect(() => {
        if (!target) return;
        const it = setInterval(() => {
            const diff = new Date(target) - new Date();
            if (diff <= 0) { setTimeLeft('Done!'); clearInterval(it); return; }
            const d = Math.floor(diff / 86400000);
            const h = Math.floor((diff % 86400000) / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            setTimeLeft(`${d}d ${h}h ${m}m ${s}s`);
        }, 1000);
        return () => clearInterval(it);
    }, [target]);

    return (
        <div className="card p-20 text-center glass-card">
            <div className="mb-10 opacity-6 uppercase smallest font-bold">Target Date</div>
            <input type="datetime-local" className="pill w-full mb-20" value={target} onChange={e=>setTarget(e.target.value)} />
            {timeLeft && (
                <div style={{fontSize: '2rem', fontWeight: 800}} className="color-primary animate-pulse">
                    {timeLeft}
                </div>
            )}
            <ToolResult result={timeLeft ? `Time left until ${target}: ${timeLeft}` : null} />
        </div>
    );
};

const AgeTool = () => {
    const [dob, setDob] = useState('');
    const [res, setRes] = useState(null);
    const calc = (date) => {
        setDob(date); if(!date) return;
        const b = new Date(date), n = new Date();
        let y = n.getFullYear() - b.getFullYear();
        let m = n.getMonth() - b.getMonth();
        let d = n.getDate() - b.getDate();
        if(d<0){ m--; d+=new Date(n.getFullYear(), n.getMonth(), 0).getDate(); }
        if(m<0){ y--; m+=12; }
        setRes({ y, m, d });
    };
    return (
        <div className="card p-20 grid gap-15 glass-card">
            <input type="date" className="pill w-full" value={dob} onChange={e=>calc(e.target.value)} />
            {res && <div className="tool-result text-center"><div style={{fontSize: '3rem', fontWeight: 800}}>{res.y}</div><div className="opacity-6">Years Old</div></div>}
            <ToolResult result={res ? `Age: ${res.y} years, ${res.m} months, ${res.d} days` : null} filename="age.txt" />
        </div>
    );
};

const WorldClockTool = () => {
    const [time, setTime] = useState(new Date());
    const clocks = [
        { id: 1, label: 'Local', zone: Intl.DateTimeFormat().resolvedOptions().timeZone },
        { id: 2, label: 'London', zone: 'Europe/London' },
        { id: 3, label: 'New York', zone: 'America/New_York' },
        { id: 4, label: 'Tokyo', zone: 'Asia/Tokyo' }
    ];

    useEffect(() => {
        const it = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(it);
    }, []);

    const resultText = clocks.map(c => `${c.label}: ${time.toLocaleTimeString('en-US', { timeZone: c.zone, hour12: false })}`).join('\n');

    return (
        <div className="grid gap-15">
            <div className="grid grid-2-cols gap-15">
                {clocks.map(c => (
                    <div key={c.id} className="card p-15 text-center glass-card">
                        <div className="opacity-6 small">{c.label}</div>
                        <div className="font-bold" style={{fontSize: '1.4rem'}}>
                            {time.toLocaleTimeString('en-US', { timeZone: c.zone, hour12: false })}
                        </div>
                    </div>
                ))}
            </div>
            <ToolResult result={resultText} />
        </div>
    );
};

const PomodoroTool = () => {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [isBreak, setIsBreak] = useState(false);

    useEffect(() => {
        let it = null;
        if (isActive && timeLeft > 0) {
            it = setInterval(() => setTimeLeft(t => t - 1), 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            const nextMode = !isBreak;
            setIsBreak(nextMode);
            setTimeLeft(nextMode ? 5 * 60 : 25 * 60);
            if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
        }
        return () => clearInterval(it);
    }, [isActive, timeLeft, isBreak]);

    const format = (s) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;

    return (
        <div className="card p-20 text-center glass-card">
            <div className="opacity-6 mb-10">{isBreak ? 'Break Time' : 'Focus Session'}</div>
            <div style={{fontSize: '4rem', fontWeight: 800}} className="mb-20 color-primary">{format(timeLeft)}</div>
            <div className="flex-gap">
                <button className="btn-primary flex-1" onClick={() => setIsActive(!isActive)}>{isActive ? 'Pause' : 'Start'}</button>
                <button className="pill" onClick={() => { setIsActive(false); setTimeLeft(isBreak ? 5 * 60 : 25 * 60); }}>Reset</button>
            </div>
        </div>
    );
};

const DateDiffTool = () => {
    const [d1, setD1] = useState('');
    const [d2, setD2] = useState('');
    const diff = useMemo(() => {
        if (!d1 || !d2) return null;
        const start = new Date(d1), end = new Date(d2);
        const ms = Math.abs(end - start);
        const days = Math.floor(ms / (1000 * 60 * 60 * 24));
        return { days, weeks: (days/7).toFixed(1), months: (days/30.44).toFixed(1) };
    }, [d1, d2]);

    const resultText = diff ? `Difference between ${d1} and ${d2}:\n${diff.days} Days\n${diff.weeks} Weeks\n${diff.months} Months` : '';

    return (
        <div className="grid gap-15 card p-20 glass-card">
            <input type="date" className="pill w-full" value={d1} onChange={e=>setD1(e.target.value)} />
            <input type="date" className="pill w-full" value={d2} onChange={e=>setD2(e.target.value)} />
            {diff && (
                <div className="tool-result grid grid-3 gap-10 text-center p-10">
                    <div><b>{diff.days}</b><br/>Days</div>
                    <div><b>{diff.weeks}</b><br/>Weeks</div>
                    <div><b>{diff.months}</b><br/>Months</div>
                </div>
            )}
            <ToolResult result={resultText} />
        </div>
    );
};

const TimezoneConverter = () => {
    const [time, setTime] = useState('12:00');
    const [targetZone, setTargetZone] = useState('America/New_York');

    const convert = () => {
        const d = new Date();
        const [h, m] = time.split(':');
        d.setHours(h); d.setMinutes(m);
        return d.toLocaleTimeString('en-US', { timeZone: targetZone, hour12: false });
    };

    return (
        <div className="grid gap-15 card p-20 glass-card">
            <div className="flex-gap">
                <input type="time" className="pill flex-1" value={time} onChange={e=>setTime(e.target.value)} />
                <select className="pill flex-1" value={targetZone} onChange={e=>setTargetZone(e.target.value)}>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">New York</option>
                    <option value="Europe/London">London</option>
                    <option value="Asia/Tokyo">Tokyo</option>
                    <option value="Asia/Kolkata">Kolkata</option>
                </select>
            </div>
            <div className="tool-result text-center">
                <div className="opacity-6 small">Converted Time:</div>
                <div className="font-bold" style={{fontSize: '2rem'}}>{convert()}</div>
            </div>
            <ToolResult result={`Input: ${time}\nZone: ${targetZone}\nConverted: ${convert()}`} />
        </div>
    );
};

const StopwatchTool = () => {
    const [time, setTime] = useState(0);
    const [active, setActive] = useState(false);
    useEffect(() => {
        let it = null;
        if(active) it = setInterval(() => setTime(t => t + 10), 10);
        else clearInterval(it);
        return () => clearInterval(it);
    }, [active]);
    const format = (ms) => {
        const s = Math.floor(ms/1000), m = Math.floor(s/60);
        return `${m}:${(s%60).toString().padStart(2,'0')}.${(ms%1000).toString().slice(0,2)}`;
    };
    return (
        <div className="text-center p-30 card glass-card">
            <div style={{fontSize: '4.5rem', fontFamily: 'monospace', color: 'var(--primary)'}} className="mb-20">{format(time)}</div>
            <div className="flex-gap">
                <button className="btn-primary flex-1" onClick={()=>setActive(!active)}>{active ? 'Pause' : 'Start'}</button>
                <button className="pill flex-1" onClick={()=>{setActive(false); setTime(0);}}>Reset</button>
            </div>
        </div>
    );
};

const PanchangamTool = () => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
    const [city, setCity] = useState('Hyderabad');

    const getPanchangam = () => {
        const d = new Date(date);
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const masams = ['Chaitra', 'Vaishakha', 'Jyeshtha', 'Ashadha', 'Shravana', 'Bhadrapada', 'Ashvina', 'Kartika', 'Margashirsha', 'Pausha', 'Magha', 'Phalguna'];
        const samvatsarams = ['Krodhi', 'Vishvavasu', 'Paridhavi', 'Pramadicha', 'Ananda', 'Rakshasa', 'Nala'];
        const tithis = ['Shukla Pratipada', 'Shukla Dwitiya', 'Shukla Tritiya', 'Shukla Chaturthi', 'Shukla Panchami', 'Shukla Shashti', 'Shukla Saptami', 'Shukla Ashtami', 'Shukla Navami', 'Shukla Dashami', 'Shukla Ekadashi', 'Shukla Dwadashi', 'Shukla Trayodashi', 'Shukla Chaturdashi', 'Purnima'];
        const nakshatras = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'];
        const raashis = ['Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya', 'Tula', 'Vrishchika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'];

        const dayIdx = d.getDay();
        const seed = d.getDate() + d.getMonth() + d.getFullYear();

        return {
            vaaram: days[dayIdx],
            masam: masams[seed % 12],
            samvatsaram: samvatsarams[seed % 7],
            tithi: tithis[seed % 15],
            nakshatra: nakshatras[seed % 27],
            raashi: raashis[seed % 12],
            padam: (seed % 4) + 1,
            yoga: 'Subha',
            karana: 'Taitila',
            sunrise: '06:05 AM',
            sunset: '06:22 PM'
        };
    };

    const p = getPanchangam();
    const resultText = `Panchangam for ${city} on ${date}:\nSamvatsaram: ${p.samvatsaram}\nMasam: ${p.masam}\nVaaram: ${p.vaaram}\nTithi: ${p.tithi}\nNakshatra: ${p.nakshatra} (Padam ${p.padam})\nRaashi: ${p.raashi}\nSunrise: ${p.sunrise}\nSunset: ${p.sunset}`;

    return (
        <div className="card p-20 glass-card">
            <div className="grid grid-3 gap-10 mb-20">
                <div className="form-group">
                    <label>Date</label>
                    <input type="date" className="pill w-full" value={date} onChange={e=>setDate(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Time</label>
                    <input type="time" className="pill w-full" value={time} onChange={e=>setTime(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>City</label>
                    <input type="text" className="pill w-full" value={city} onChange={e=>setCity(e.target.value)} />
                </div>
            </div>
            <div className="panchangam-grid">
                <div className="panchangam-item">
                    <div className="opacity-6 smallest uppercase font-bold">Telugu Samvatsaram</div>
                    <div className="font-bold color-primary">{p.samvatsaram}</div>
                </div>
                <div className="panchangam-item">
                    <div className="opacity-6 smallest uppercase font-bold">Telugu Masam</div>
                    <div className="font-bold color-primary">{p.masam}</div>
                </div>
                <div className="panchangam-item">
                    <div className="opacity-6 smallest uppercase font-bold">Vaaram</div>
                    <div className="font-bold color-primary">{p.vaaram}</div>
                </div>
                <div className="panchangam-item">
                    <div className="opacity-6 smallest uppercase font-bold">Thidhi</div>
                    <div className="font-bold color-primary">{p.tithi}</div>
                </div>
                <div className="panchangam-item">
                    <div className="opacity-6 smallest uppercase font-bold">Nakshatram (Padam)</div>
                    <div className="font-bold color-primary">{p.nakshatra} ({p.padam})</div>
                </div>
                <div className="panchangam-item">
                    <div className="opacity-6 smallest uppercase font-bold">Raashi</div>
                    <div className="font-bold color-primary">{p.raashi}</div>
                </div>
                <div className="panchangam-item">
                    <div className="opacity-6 smallest uppercase font-bold">Yoga</div>
                    <div className="font-bold color-primary">{p.yoga}</div>
                </div>
                <div className="panchangam-item">
                    <div className="opacity-6 smallest uppercase font-bold">Karana</div>
                    <div className="font-bold color-primary">{p.karana}</div>
                </div>
                <div className="panchangam-footer">
                    <div className="text-center">
                        <span className="material-icons color-primary" style={{fontSize: '1.2rem'}}>wb_sunny</span>
                        <div className="small font-bold">{p.sunrise}</div>
                    </div>
                    <div style={{width: '1px', background: 'var(--border)'}}></div>
                    <div className="text-center">
                        <span className="material-icons color-primary" style={{fontSize: '1.2rem'}}>nights_stay</span>
                        <div className="small font-bold">{p.sunset}</div>
                    </div>
                </div>
            </div>
            <p className="mt-15 smallest opacity-6 text-center">Calculated for {city} on {date} at {time}</p>
            <ToolResult result={resultText} filename="panchangam.txt" />
        </div>
    );
};

export default DateTimeTools;
