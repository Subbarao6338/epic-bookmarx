import React, { useState } from 'react';

const AgeCalculator = () => {
  const [dob, setDob] = useState('');
  const [age, setAge] = useState(null);
  const calculate = () => {
    if (!dob) return;
    const diff = new Date() - new Date(dob);
    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
    setAge({ years, months });
  };
  return (
    <div className="card p-30 glass-card grid gap-15 text-center">
      <h3>Age Calculator</h3>
      <input type="date" className="pill w-full" value={dob} onChange={e=>setDob(e.target.value)} />
      <button className="btn-primary" onClick={calculate}>Calculate Age</button>
      {age && <div className="text-2xl font-bold">{age.years} Years, {age.months} Months</div>}
    </div>
  );
};

export default AgeCalculator;
