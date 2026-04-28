import React, { useState } from 'react';
import { Calculator as CalcIcon, X, Delete } from 'lucide-react';

export const CalculatorWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  const handleNum = (num: string) => {
    if (display === '0' || display === 'Error') {
      setDisplay(num);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOp = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const calculate = () => {
    try {
      // safe eval for basic math
      const safeEq = (equation + display).replace(/[^0-9+\-*/.]/g, '');
      const result = new Function('return ' + safeEq)();
      setDisplay(String(Math.round(result * 100) / 100)); // Round to 2 decimals
      setEquation('');
    } catch (e) {
      setDisplay('Error');
      setEquation('');
    }
  };

  const clearAll = () => {
    setDisplay('0');
    setEquation('');
  };

  const clearEntry = () => {
    setDisplay('0');
  };

  const toggleCalculator = () => setIsOpen(!isOpen);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      <button
        onClick={toggleCalculator}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-105 active:scale-95 ${isOpen ? 'bg-slate-700' : 'bg-blue-600'}`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <CalcIcon className="w-6 h-6" />}
      </button>

      {/* Calculator Popup */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-72 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Display */}
          <div className="p-5 bg-slate-50 border-b border-slate-100 text-right">
            <div className="text-sm text-slate-400 h-5 mb-1 font-mono tracking-wider overflow-hidden">{equation}</div>
            <div className="text-4xl font-light text-slate-800 tracking-tight overflow-x-auto custom-scrollbar whitespace-nowrap">{display}</div>
          </div>

          {/* Keypad */}
          <div className="p-4 grid grid-cols-4 gap-2 bg-white">
            <button onClick={clearAll} className="col-span-2 py-3 rounded-xl bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-colors">AC</button>
            <button onClick={clearEntry} className="py-3 rounded-xl bg-slate-100 text-slate-600 font-semibold hover:bg-slate-200 transition-colors">C</button>
            <button onClick={() => handleOp('/')} className="py-3 rounded-xl bg-blue-50 text-blue-600 font-semibold hover:bg-blue-100 transition-colors">÷</button>

            <button onClick={() => handleNum('7')} className="py-3 rounded-xl bg-white border border-slate-100 text-slate-700 font-semibold hover:bg-slate-50 transition-colors shadow-sm">7</button>
            <button onClick={() => handleNum('8')} className="py-3 rounded-xl bg-white border border-slate-100 text-slate-700 font-semibold hover:bg-slate-50 transition-colors shadow-sm">8</button>
            <button onClick={() => handleNum('9')} className="py-3 rounded-xl bg-white border border-slate-100 text-slate-700 font-semibold hover:bg-slate-50 transition-colors shadow-sm">9</button>
            <button onClick={() => handleOp('*')} className="py-3 rounded-xl bg-blue-50 text-blue-600 font-semibold hover:bg-blue-100 transition-colors">×</button>

            <button onClick={() => handleNum('4')} className="py-3 rounded-xl bg-white border border-slate-100 text-slate-700 font-semibold hover:bg-slate-50 transition-colors shadow-sm">4</button>
            <button onClick={() => handleNum('5')} className="py-3 rounded-xl bg-white border border-slate-100 text-slate-700 font-semibold hover:bg-slate-50 transition-colors shadow-sm">5</button>
            <button onClick={() => handleNum('6')} className="py-3 rounded-xl bg-white border border-slate-100 text-slate-700 font-semibold hover:bg-slate-50 transition-colors shadow-sm">6</button>
            <button onClick={() => handleOp('-')} className="py-3 rounded-xl bg-blue-50 text-blue-600 font-semibold hover:bg-blue-100 transition-colors">−</button>

            <button onClick={() => handleNum('1')} className="py-3 rounded-xl bg-white border border-slate-100 text-slate-700 font-semibold hover:bg-slate-50 transition-colors shadow-sm">1</button>
            <button onClick={() => handleNum('2')} className="py-3 rounded-xl bg-white border border-slate-100 text-slate-700 font-semibold hover:bg-slate-50 transition-colors shadow-sm">2</button>
            <button onClick={() => handleNum('3')} className="py-3 rounded-xl bg-white border border-slate-100 text-slate-700 font-semibold hover:bg-slate-50 transition-colors shadow-sm">3</button>
            <button onClick={() => handleOp('+')} className="py-3 rounded-xl bg-blue-50 text-blue-600 font-semibold hover:bg-blue-100 transition-colors">+</button>

            <button onClick={() => handleNum('0')} className="col-span-2 py-3 rounded-xl bg-white border border-slate-100 text-slate-700 font-semibold hover:bg-slate-50 transition-colors shadow-sm">0</button>
            <button onClick={() => handleNum('.')} className="py-3 rounded-xl bg-white border border-slate-100 text-slate-700 font-semibold hover:bg-slate-50 transition-colors shadow-sm">.</button>
            <button onClick={calculate} className="py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-md">=</button>
          </div>
        </div>
      )}
    </div>
  );
};
