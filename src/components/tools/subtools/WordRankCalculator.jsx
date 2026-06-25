import React, { useState } from 'react';
import ToolResult from '../ToolResult';

const WordRankCalculator = () => {
    const [input, setInput] = useState('');
    const [result, setResult] = useState(null);

    const run = () => {
        const word = input.toUpperCase().replace(/[^A-Z]/g, '');
        if (!word) return setResult({ error: "Please enter a valid word." });
        if (word.length > 50) return setResult({ error: "Word too long for browser-side calculation." });

        try {
            const factorials = [BigInt(1)];
            for (let i = 1; i <= word.length; i++) {
                factorials[i] = factorials[i - 1] * BigInt(i);
            }

            const len = word.length;
            let rank = BigInt(1);
            let charCount = {};
            for (const ch of word) charCount[ch] = (charCount[ch] || 0n) + 1n;

            const getFactorialDivisor = (counts) => {
                let divisor = BigInt(1);
                for (const key in counts) divisor *= factorials[Number(counts[key])];
                return divisor;
            };

            for (let i = 0; i < len; i++) {
                let countSmaller = 0n;
                const sortedKeys = Object.keys(charCount).sort();
                for (const key of sortedKeys) {
                    if (key < word[i]) countSmaller += charCount[key];
                    else break;
                }

                if (countSmaller > 0n) {
                    const combinations = factorials[len - 1 - i];
                    const divisor = getFactorialDivisor(charCount);
                    rank += (countSmaller * combinations) / divisor;
                }

                charCount[word[i]]--;
                if (charCount[word[i]] === 0n) delete charCount[word[i]];
            }
            setResult({ text: `Lexicographical rank of "${word}":\n${rank.toLocaleString()}` });
        } catch (e) {
            setResult({ error: e.message });
        }
    };

    return (
        <div className="card p-30 glass-card text-center grid gap-15">
            <h3>Word Rank (Lexicographical)</h3>
            <p className="smallest opacity-6">Calculate the position of a word among all its sorted permutations.</p>
            <input className="pill w-full uppercase text-center font-bold" style={{letterSpacing: '2px'}} placeholder="Enter word..." value={input} onChange={e=>setInput(e.target.value)} />
            <div className="flex gap-10">
                <button className="btn-primary flex-1" onClick={run}>Calculate Rank</button>
                <button className="pill" onClick={() => { setInput(''); setResult(null); }}>Reset</button>
            </div>
            <ToolResult result={result} />
        </div>
    );
};

export default WordRankCalculator;
