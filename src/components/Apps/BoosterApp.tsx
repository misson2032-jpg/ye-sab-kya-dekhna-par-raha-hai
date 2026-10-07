import React, { useState } from 'react';
import { 
  ArrowLeft, Zap, Cpu, HardDrive, Battery, ShieldCheck, 
  RefreshCw, CheckCircle2, Flame, Thermometer, Sparkles 
} from 'lucide-react';
import { SystemState } from '../../types/os';

interface BoosterAppProps {
  systemState: SystemState;
  onUpdateSystem: (updates: Partial<SystemState>) => void;
  onClose: () => void;
}

export const BoosterApp: React.FC<BoosterAppProps> = ({
  systemState,
  onUpdateSystem,
  onClose,
}) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimized, setOptimized] = useState(false);

  const runFullOptimization = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      onUpdateSystem({
        ramUsedMb: 980,
        batterySaver: false,
      });
      setIsOptimizing(false);
      setOptimized(true);
      setTimeout(() => setOptimized(false), 3000);
    }, 1400);
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
          <div>
            <h2 className="font-bold text-base text-white">Speed & RAM Tuner</h2>
            <p className="text-[11px] text-teal-400 font-mono">TECNO SPARK Go 2024 Engine</p>
          </div>
        </div>
        <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-full font-mono">
          Unisoc T606
        </span>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Core Score Circular Gauge */}
        <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center space-y-3 shadow-xl">
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* Gauge ring */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="currentColor"
                strokeWidth="7"
                fill="transparent"
                className="text-slate-800"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="currentColor"
                strokeWidth="7"
                fill="transparent"
                strokeDasharray="264"
                strokeDashoffset={isOptimizing ? '60' : '40'}
                className="text-teal-400 transition-all duration-700"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black text-white">
                {isOptimizing ? '...' : optimized ? '99' : '88'}
              </span>
              <span className="text-[10px] text-teal-300 uppercase tracking-widest font-mono">Score</span>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="font-bold text-base text-white">
              {optimized ? 'Optimal 90Hz Performance' : 'Background RAM Ready to Optimize'}
            </h3>
            <p className="text-xs text-slate-400">
              MemFusion: 3.0 GB virtual + 3.0 GB physical LPDDR4X
            </p>
          </div>

          <button
            onClick={runFullOptimization}
            disabled={isOptimizing}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-teal-500/25 transition active:scale-95 disabled:opacity-75"
          >
            {isOptimizing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Tuning Memory & Cache...
              </>
            ) : optimized ? (
              <>
                <CheckCircle2 className="w-4 h-4" /> System Optimized!
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" /> One-Tap Speed Boost
              </>
            )}
          </button>
        </div>

        {/* Real-time Hardware Metrics Cards */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-teal-400" /> CPU Core Clock
            </span>
            <p className="text-sm font-bold text-white font-mono">8 Cores @ 1.6 GHz</p>
            <p className="text-[10px] text-teal-300">Unisoc T606 (12nm)</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-amber-400" /> Temp & Thermal
            </span>
            <p className="text-sm font-bold text-white font-mono">31.4 °C Normal</p>
            <p className="text-[10px] text-emerald-400">Low thermal throttles</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400 flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-cyan-400" /> Free Memory
            </span>
            <p className="text-sm font-bold text-white font-mono">
              {(3072 - systemState.ramUsedMb)} MB Free
            </p>
            <p className="text-[10px] text-slate-400">Total: 3,072 MB RAM</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Battery className="w-3.5 h-3.5 text-emerald-400" /> Battery Health
            </span>
            <p className="text-sm font-bold text-white font-mono">100% Good</p>
            <p className="text-[10px] text-emerald-400">5,000 mAh Capacity</p>
          </div>
        </div>

        {/* Feature info */}
        <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400 space-y-1.5">
          <div className="flex items-center gap-1.5 text-teal-300 font-semibold">
            <ShieldCheck className="w-4 h-4" /> Hardware Integrity Policy
          </div>
          <p>
            MAYUI Tuner works strictly within Unisoc T606 hardware limits. No unrealistic overclocking or fake RAM claims; only verified background task trimming and cache compaction.
          </p>
        </div>
      </div>
    </div>
  );
};
