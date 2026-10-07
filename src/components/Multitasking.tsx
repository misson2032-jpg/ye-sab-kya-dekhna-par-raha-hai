import React, { useState } from 'react';
import { 
  X, Lock, Unlock, SplitSquareVertical, Trash2, ArrowLeft, 
  Sparkles, Layers, Zap, CheckCircle2 
} from 'lucide-react';
import { AppDefinition, SystemState } from '../types/os';

interface MultitaskingProps {
  recentAppIds: string[];
  apps: AppDefinition[];
  systemState: SystemState;
  onSelectApp: (appId: string) => void;
  onCloseApp: (appId: string) => void;
  onClearAll: () => void;
  onClose: () => void;
}

export const Multitasking: React.FC<MultitaskingProps> = ({
  recentAppIds,
  apps,
  systemState,
  onSelectApp,
  onCloseApp,
  onClearAll,
  onClose,
}) => {
  const [lockedApps, setLockedApps] = useState<string[]>(['settings']);
  const [freedMessage, setFreedMessage] = useState<string | null>(null);

  const toggleLock = (appId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLockedApps(prev => 
      prev.includes(appId) ? prev.filter(id => id !== appId) : [...prev, appId]
    );
  };

  const handleClearAll = () => {
    onClearAll();
    setFreedMessage('RAM Optimized: 420 MB released');
    setTimeout(() => {
      setFreedMessage(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="relative w-full h-full bg-slate-950/95 backdrop-blur-3xl text-white flex flex-col justify-between font-sans select-none animate-fadeIn p-4 overflow-hidden">
      {/* Top Bar: RAM Monitor & Dismiss */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-teal-400" />
          <span className="text-xs font-semibold text-white">Multitasking Engine</span>
          <span className="text-[10px] text-teal-300 font-mono bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
            {recentAppIds.length} Active in RAM
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Freed message toast */}
      {freedMessage && (
        <div className="mx-auto my-2 px-4 py-2 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{freedMessage}</span>
        </div>
      )}

      {/* Recent App Cards (Horizontal Carousels) */}
      <div className="flex-1 flex items-center gap-4 overflow-x-auto py-6 px-2 no-scrollbar snap-x">
        {recentAppIds.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center text-slate-500 space-y-2">
            <Layers className="w-10 h-10 text-slate-700" />
            <p className="text-sm font-medium text-slate-400">No background applications</p>
            <p className="text-xs text-slate-500">Your Unisoc T606 memory is 100% clean.</p>
          </div>
        ) : (
          recentAppIds.map(appId => {
            const app = apps.find(a => a.id === appId);
            if (!app) return null;
            const isLocked = lockedApps.includes(appId);

            return (
              <div
                key={appId}
                onClick={() => onSelectApp(appId)}
                className="w-56 h-80 flex-shrink-0 bg-slate-900 border border-slate-700/80 rounded-3xl p-3 shadow-2xl flex flex-col justify-between cursor-pointer hover:border-teal-500/60 transition group snap-center relative overflow-hidden"
              >
                {/* App Card Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-6 h-6 rounded-lg bg-gradient-to-tr ${app.bgGradient} flex items-center justify-center text-[10px] font-bold`}>
                      {app.name.charAt(0)}
                    </div>
                    <span className="text-xs font-semibold text-white truncate">{app.name}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => toggleLock(appId, e)}
                      className={`p-1 rounded-md text-xs transition ${
                        isLocked ? 'text-teal-400 bg-teal-500/20' : 'text-slate-400 hover:text-white'
                      }`}
                      title={isLocked ? 'App locked in RAM' : 'Lock in RAM'}
                    >
                      {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                    </button>
                    {!isLocked && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onCloseApp(appId);
                        }}
                        className="p-1 rounded-md text-slate-400 hover:text-rose-400"
                        title="Close app"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Simulated App Snapshot / Thumbnail */}
                <div className="flex-1 my-2 rounded-2xl bg-slate-950/80 border border-slate-800/80 p-3 flex flex-col justify-between text-xs text-slate-400">
                  <div className="space-y-1">
                    <div className="w-16 h-2 bg-slate-800 rounded" />
                    <div className="w-28 h-2 bg-slate-800/60 rounded" />
                  </div>
                  <div className="text-center font-mono text-[11px] text-teal-400/80">
                    RAM Footprint: {app.sizeMb} MB
                  </div>
                  <div className="w-full bg-slate-800 h-1 rounded" />
                </div>

                {/* Footer Split-Screen / Quick Launch */}
                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                  <span className="group-hover:text-teal-400 transition">Tap to resume</span>
                  <SplitSquareVertical className="w-3.5 h-3.5 text-slate-500 hover:text-teal-400" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Action Bar: Clear All Button */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-center">
        {recentAppIds.length > 0 && (
          <button
            onClick={handleClearAll}
            className="px-6 py-2.5 rounded-full bg-slate-800 hover:bg-rose-500/20 hover:text-rose-300 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition text-slate-200"
          >
            <Trash2 className="w-4 h-4 text-rose-400" /> Clear all background tasks
          </button>
        )}
      </div>
    </div>
  );
};
