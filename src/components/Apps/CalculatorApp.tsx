import React, { useState } from 'react';
import { ArrowLeft, Delete, Plus, Minus, X, Equal, Divide } from 'lucide-react';

interface CalculatorAppProps {
  onClose: () => void;
}

export const CalculatorApp: React.FC<CalculatorAppProps> = ({ onClose }) => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  const handleNum = (num: string) => {
    setDisplay(prev => (prev === '0' ? num : prev + num));
  };

  const handleOp = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
  };

  const handleCalculate = () => {
    try {
      const full = (equation + display).replace(/×/g, '*').replace(/÷/g, '/');
      // eslint-disable-next-line no-eval
      const res = Function(`'use strict'; return (${full})`)();
      setEquation('');
      setDisplay(String(res));
    } catch {
      setDisplay('Error');
    }
  };

  return (
    <div className="relative w-full h-full bg-slate-950 text-white flex flex-col font-sans select-none animate-fadeIn">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="font-bold text-base text-white">Calculator</h2>
        </div>
        <span className="text-[10px] text-teal-400 font-mono">Standard</span>
      </div>

      {/* Screen / Display */}
      <div className="flex-1 p-6 flex flex-col justify-end items-end space-y-2">
        <div className="text-sm font-mono text-slate-400 min-h-[20px]">{equation}</div>
        <div className="text-5xl font-light text-white tracking-tight font-sans truncate max-w-full">
          {display}
        </div>
      </div>

      {/* Keypad Grid */}
      <div className="p-4 bg-slate-900/90 rounded-t-3xl border-t border-slate-800 grid grid-cols-4 gap-2.5 pb-6">
        <button onClick={handleClear} className="p-4 rounded-2xl bg-rose-500/20 text-rose-300 font-bold text-sm">
          C
        </button>
        <button onClick={() => setDisplay(prev => prev.startsWith('-') ? prev.slice(1) : '-' + prev)} className="p-4 rounded-2xl bg-slate-800 text-slate-300 font-semibold text-sm">
          ±
        </button>
        <button onClick={() => setDisplay(prev => String(Number(prev) / 100))} className="p-4 rounded-2xl bg-slate-800 text-slate-300 font-semibold text-sm">
          %
        </button>
        <button onClick={() => handleOp('÷')} className="p-4 rounded-2xl bg-teal-500 text-slate-950 font-black text-base">
          ÷
        </button>

        <button onClick={() => handleNum('7')} className="p-4 rounded-2xl bg-slate-800/80 text-white font-medium text-lg">7</button>
        <button onClick={() => handleNum('8')} className="p-4 rounded-2xl bg-slate-800/80 text-white font-medium text-lg">8</button>
        <button onClick={() => handleNum('9')} className="p-4 rounded-2xl bg-slate-800/80 text-white font-medium text-lg">9</button>
        <button onClick={() => handleOp('×')} className="p-4 rounded-2xl bg-teal-500 text-slate-950 font-black text-base">×</button>

        <button onClick={() => handleNum('4')} className="p-4 rounded-2xl bg-slate-800/80 text-white font-medium text-lg">4</button>
        <button onClick={() => handleNum('5')} className="p-4 rounded-2xl bg-slate-800/80 text-white font-medium text-lg">5</button>
        <button onClick={() => handleNum('6')} className="p-4 rounded-2xl bg-slate-800/80 text-white font-medium text-lg">6</button>
        <button onClick={() => handleOp('-')} className="p-4 rounded-2xl bg-teal-500 text-slate-950 font-black text-base">−</button>

        <button onClick={() => handleNum('1')} className="p-4 rounded-2xl bg-slate-800/80 text-white font-medium text-lg">1</button>
        <button onClick={() => handleNum('2')} className="p-4 rounded-2xl bg-slate-800/80 text-white font-medium text-lg">2</button>
        <button onClick={() => handleNum('3')} className="p-4 rounded-2xl bg-slate-800/80 text-white font-medium text-lg">3</button>
        <button onClick={() => handleOp('+')} className="p-4 rounded-2xl bg-teal-500 text-slate-950 font-black text-base">+</button>

        <button onClick={() => handleNum('0')} className="p-4 rounded-2xl bg-slate-800/80 text-white font-medium text-lg col-span-2 text-center">0</button>
        <button onClick={() => handleNum('.')} className="p-4 rounded-2xl bg-slate-800/80 text-white font-medium text-lg">.</button>
        <button onClick={handleCalculate} className="p-4 rounded-2xl bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-black text-xl shadow-lg shadow-teal-500/20">=</button>
      </div>
    </div>
  );
};
