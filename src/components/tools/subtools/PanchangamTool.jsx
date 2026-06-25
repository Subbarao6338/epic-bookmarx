import React, { useState } from 'react';
import { calculatePanchangam, CITIES } from '../../../utils/panchangam';

const PanchangamTool = () => {
    const now = new Date();
    const [date, setDate] = useState(now.toISOString().split('T')[0]);
    const [time, setTime] = useState(now.toTimeString().split(' ')[0].substring(0, 5));
    const [city, setCity] = useState('Hyderabad');
    const [lat, setLat] = useState('17.3850');
    const [lng, setLng] = useState('78.4867');
    const [tz, setTz] = useState('5.5');
    const [res, setRes] = useState(null);

    const handleCityChange = (e) => {
        const val = e.target.value;
        setCity(val);
        const found = CITIES.find(c => c.name === val);
        if (found) {
            setLat(found.lat.toString());
            setLng(found.lng.toString());
            setTz(found.tz.toString());
        }
    };

    const getPanchangam = () => {
        if (!date || !time) return;
        const results = calculatePanchangam(date, time, parseFloat(lat), parseFloat(lng), parseFloat(tz));
        setRes(results);
    };

    return (
        <div className="card p-20 glass-card grid gap-15">
            <h3 className="text-center">Telugu Panchangam</h3>
            <div className="grid grid-2-cols gap-10">
                <div className="form-group">
                    <label className="smallest opacity-6 uppercase ml-10">Date</label>
                    <input type="date" className="pill w-full" value={date} onChange={e=>setDate(e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="smallest opacity-6 uppercase ml-10">Time</label>
                    <input type="time" className="pill w-full" value={time} onChange={e=>setTime(e.target.value)} />
                </div>
            </div>

            <div className="form-group">
                <label className="smallest opacity-6 uppercase ml-10">Location / City</label>
                <select className="pill w-full" value={city} onChange={handleCityChange}>
                    <option value="Custom">Custom Location</option>
                    {CITIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
            </div>

            {city === 'Custom' && (
                <div className="grid grid-3-cols gap-10 animate-fadeIn">
                    <div className="form-group">
                        <label className="smallest opacity-6 uppercase ml-10">Lat</label>
                        <input type="number" step="0.0001" className="pill w-full px-5" value={lat} onChange={e=>setLat(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="smallest opacity-6 uppercase ml-10">Lng</label>
                        <input type="number" step="0.0001" className="pill w-full px-5" value={lng} onChange={e=>setLng(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="smallest opacity-6 uppercase ml-10">TZ</label>
                        <input type="number" step="0.5" className="pill w-full px-5" value={tz} onChange={e=>setTz(e.target.value)} />
                    </div>
                </div>
            )}

            <button className="btn-primary w-full" onClick={getPanchangam}>Calculate Panchangam</button>

            {res && (
                <div className="grid grid-2-cols gap-10 smallest mt-10 animate-slide-up">
                    <div className="p-10 bg-surface rounded-lg">
                        <div className="opacity-5 uppercase mb-2">Samvatsara</div>
                        <div className="font-bold">{res.samvatsara}</div>
                    </div>
                    <div className="p-10 bg-surface rounded-lg">
                        <div className="opacity-5 uppercase mb-2">Vara</div>
                        <div className="font-bold">{res.vara}</div>
                    </div>
                    <div className="p-10 bg-surface rounded-lg col-span-2">
                        <div className="opacity-5 uppercase mb-2">Tithi</div>
                        <div className="font-bold text-lg">{res.tithi}</div>
                    </div>
                    <div className="p-10 bg-surface rounded-lg">
                        <div className="opacity-5 uppercase mb-2">Nakshatra</div>
                        <div className="font-bold">{res.nakshatra}</div>
                    </div>
                    <div className="p-10 bg-surface rounded-lg">
                        <div className="opacity-5 uppercase mb-2">Padam</div>
                        <div className="font-bold">{res.pada}</div>
                    </div>
                    <div className="p-10 bg-surface rounded-lg">
                        <div className="opacity-5 uppercase mb-2">Rasi</div>
                        <div className="font-bold">{res.rasi}</div>
                    </div>
                    <div className="p-10 bg-surface rounded-lg">
                        <div className="opacity-5 uppercase mb-2">Yoga</div>
                        <div className="font-bold">{res.yoga}</div>
                    </div>
                    <div className="p-10 bg-surface rounded-lg border-primary-light col-span-2 text-center">
                        <div className="opacity-5 uppercase mb-2">Sunrise / Sunset</div>
                        <div className="font-bold text-lg">{res.sunrise} / {res.sunset}</div>
                    </div>
                    <div className="p-10 bg-surface rounded-lg">
                        <div className="opacity-5 uppercase mb-2">Rahu Kalam</div>
                        <div className="font-bold text-error">{res.rahukalam}</div>
                    </div>
                    <div className="p-10 bg-surface rounded-lg">
                        <div className="opacity-5 uppercase mb-2">Yamagandam</div>
                        <div className="font-bold">{res.yamagandam}</div>
                    </div>
                    <div className="p-10 bg-surface rounded-lg border-accent">
                        <div className="opacity-5 uppercase mb-2">Lucky Color</div>
                        <div className="font-bold">{res.luckyColor}</div>
                    </div>
                    <div className="p-10 bg-surface rounded-lg border-accent">
                        <div className="opacity-5 uppercase mb-2">Lucky Number</div>
                        <div className="font-bold">{res.luckyNumber}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PanchangamTool;
