import React from 'react';
import { 
  Sparkles, RefreshCw, Smartphone, Phone, MessageSquare, Camera, 
  Compass, Settings, ShieldCheck, Sun, HardDrive, Zap, ChevronRight 
} from 'lucide-react';

interface TecnoHiosModeProps {
  onSwitchBackToMayui: () => void;
  onOpenDownloadModal: () => void;
}

export const TecnoHiosMode: React.FC<TecnoHiosModeProps> = ({
  onSwitchBackToMayui,
  onOpenDownloadModal,
}) => {
  return (
    <div className="relative w-full h-full bg-gradient-to-b from-emerald-950 via-teal-950 to-slate-950 text-white flex flex-col justify-between p-5 font-sans select-none animate-fadeIn">
      {/* Top HiOS Status & 1-Tap Switch Banner */}
      <div className="space-y-3 z-10 pt-1">
        {/* Prominent One-Tap Switcher Banner */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-teal-500/20 via-cyan-500/20 to-teal-500/20 border-2 border-teal-400 backdrop-blur-xl shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500 text-slate-950 font-black flex items-center justify-center text-sm shadow-md">
              M
            </div>
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                MAYUI 2.6 Ready <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              </p>
              <p className="text-[11px] text-teal-200/90">Tap to activate 90Hz custom OS</p>
            </div>
          </div>

          <button
            onClick={onSwitchBackToMayui}
            className="px-3.5 py-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-extrabold text-xs shadow-lg shadow-teal-400/30 transition transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Switch to MAYUI
          </button>
        </div>

        {/* HiOS Standard Weather & Clock Widget */}
        <div className="p-4 rounded-3xl bg-black/30 backdrop-blur-md border border-emerald-500/20 text-white space-y-1">
          <div className="flex items-center justify-between text-xs text-emerald-300 font-mono">
            <span>HiOS 13.0 • TECNO</span>
            <span className="text-white/60">SPARK Go 2024</span>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <h1 className="text-5xl font-extralight tracking-tight font-sans">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
            </h1>
            <div className="text-right">
              <span className="text-2xl font-light">26°C</span>
              <p className="text-[11px] text-white/70">Clear Sky</p>
            </div>
          </div>
          <p className="text-xs text-white/70">
            {new Date().toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* HiOS Grid & Phone Master / Palm Store / Carlcare Cards */}
      <div className="flex-1 my-4 space-y-3 overflow-y-auto no-scrollbar">
        {/* TECNO Phone Master Widget */}
        <div className="p-3.5 rounded-2xl bg-black/25 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/30 text-emerald-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">TECNO Phone Master</p>
              <p className="text-[11px] text-white/60">Optimized by Unisoc T606</p>
            </div>
          </div>
          <span className="text-xs text-emerald-400 font-mono font-bold">Safe</span>
        </div>

        {/* Simulated HiOS Apps Grid */}
        <div className="grid grid-cols-4 gap-y-4 gap-x-2 pt-2">
          <div className="flex flex-col items-center gap-1.5 cursor-pointer">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-md">
              <Phone className="w-6 h-6" />
            </div>
            <span className="text-[11px] text-white/90">Phone</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 cursor-pointer">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <MessageSquare className="w-6 h-6" />
            </div>
            <span className="text-[11px] text-white/90">Messages</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 cursor-pointer">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md">
              <Camera className="w-6 h-6" />
            </div>
            <span className="text-[11px] text-white/90">Camera</span>
          </div>

          <div 
            onClick={onSwitchBackToMayui}
            className="flex flex-col items-center gap-1.5 cursor-pointer group"
          >
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg ring-2 ring-teal-400 group-hover:scale-105 transition">
              M
            </div>
            <span className="text-[11px] text-teal-300 font-bold">MAYUI</span>
          </div>
        </div>

        {/* Direct APK Link Action inside HiOS */}
        <div 
          onClick={onOpenDownloadModal}
          className="mt-4 p-3.5 rounded-2xl bg-slate-900/80 border border-teal-500/30 flex items-center justify-between cursor-pointer hover:border-teal-400 transition"
        >
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-teal-400" />
            <div>
              <p className="text-xs font-semibold text-white">MAYUI APK Download Package</p>
              <p className="text-[11px] text-slate-400">Get offline .apk installer file</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-teal-400" />
        </div>
      </div>

      {/* HiOS Bottom Dock */}
      <div className="z-10 pt-2 border-t border-white/10 flex items-center justify-around">
        <div className="w-12 h-12 rounded-2xl bg-green-600 flex items-center justify-center text-white shadow-md">
          <Phone className="w-5 h-5" />
        </div>
        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div className="w-12 h-12 rounded-2xl bg-cyan-600 flex items-center justify-center text-white shadow-md">
          <Compass className="w-5 h-5" />
        </div>
        <div 
          onClick={onSwitchBackToMayui}
          className="w-12 h-12 rounded-2xl bg-teal-500 text-slate-950 flex items-center justify-center font-black text-lg shadow-lg cursor-pointer hover:scale-105 transition"
          title="Return to MAYUI"
        >
          M
        </div>
      </div>
    </div>
  );
};
