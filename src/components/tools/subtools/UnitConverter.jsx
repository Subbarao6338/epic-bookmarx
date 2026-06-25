import React, { useState } from 'react';
import ToolResult from '../ToolResult';

const UnitConverter = () => {
    const [value, setValue] = useState(1);
    const [fromUnit, setFromUnit] = useState('meters');
    const [toUnit, setToUnit] = useState('kilometers');
    const [category, setCategory] = useState('length');
    const [result, setResult] = useState(null);

    const units = {
        length: { meters: 1, kilometers: 0.001, miles: 0.000621371, feet: 3.28084 },
        weight: { kilograms: 1, grams: 1000, pounds: 2.20462, ounces: 35.274 },
        temp: { celsius: 'c', fahrenheit: 'f', kelvin: 'k' }
    };

    const convert = () => {
        let res;
        if (category === 'temp') {
            let celsius;
            if (fromUnit === 'celsius') celsius = value;
            else if (fromUnit === 'fahrenheit') celsius = (value - 32) * 5/9;
            else celsius = value - 273.15;

            if (toUnit === 'celsius') res = celsius;
            else if (toUnit === 'fahrenheit') res = (celsius * 9/5) + 32;
            else res = celsius + 273.15;
        } else {
            const base = value / units[category][fromUnit];
            res = base * units[category][toUnit];
        }
        setResult({ text: `${value} ${fromUnit} = ${res.toFixed(4)} ${toUnit}` });
    };

    return (
        <div className="grid gap-15">
            <select className="pill w-full" value={category} onChange={e=>{setCategory(e.target.value); setFromUnit(Object.keys(units[e.target.value])[0]); setToUnit(Object.keys(units[e.target.value])[1]);}}>
                <option value="length">Length</option>
                <option value="weight">Weight</option>
                <option value="temp">Temperature</option>
            </select>
            <div className="grid grid-3 gap-10">
                <input type="number" className="pill w-full" value={value} onChange={e=>setValue(parseFloat(e.target.value))} />
                <select className="pill w-full" value={fromUnit} onChange={e=>setFromUnit(e.target.value)}>
                    {Object.keys(units[category]).map(u=><option key={u} value={u}>{u}</option>)}
                </select>
                <select className="pill w-full" value={toUnit} onChange={e=>setToUnit(e.target.value)}>
                    {Object.keys(units[category]).map(u=><option key={u} value={u}>{u}</option>)}
                </select>
            </div>
            <button className="btn-primary w-full" onClick={convert}>Convert</button>
            <ToolResult result={result} />
        </div>
    );
};

export default UnitConverter;
