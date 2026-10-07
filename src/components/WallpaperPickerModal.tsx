import React, { useState } from 'react';
import { 
  X, Check, Palette, Sparkles, Smartphone, Eye, CheckCircle2, 
  Layers, Sun, Moon, ShieldCheck 
} from 'lucide-react';
import { WALLPAPERS } from '../data/systemData';

interface WallpaperPickerModalProps {
  isOpen: boolean;
  currentWallpaperId: string;
  mirrorEffect: boolean;
  onSelectWallpaper: (wallpaperId: string) => void;
  onToggleMirrorEffect: (enabled: boolean) => void;
  onClose: () => void;
}

export const WallpaperPickerModal: React.FC<WallpaperPickerModalProps> = ({
  isOpen,
  currentWallpaperId,
  mirrorEffect,
  onSelectWallpaper,
  onToggleMirrorEffect,
  onClose,
}) => {
  const [selectedId, setSelectedId] = useState(currentWallpaperId);
  const [applySuccess, setApplySuccess] = useState(false);

  if (!isOpen) return null;

  const currentWp = WALLPAPERS.find(w => w.id === selectedId) || WALLPAPERS[0];

  const handleApply = (target: 'home' | 'lock' | 'both') => {
    onSelectWallpaper(selectedId);
    setApplySuccess(true);
    setTimeout(() => {
      setApplySuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn select-none font-sans">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Wallpaper & Style</h3>
              <p className="text-[11px] text-slate-400">TECNO SPARK Go 2024 Theme Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Live Preview Miniature Box */}
          <div className="flex items-center justify-center">
            <div className={`relative w-40 h-64 rounded-3xl bg-gradient-to-b ${currentWp.preview} p-3 flex flex-col justify-between border-2 border-slate-700 shadow-xl overflow-hidden`}>
              {/* Optional Specular Mirror Glass sheen */}
              {mirrorEffect && (
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none transform -skew-x-12" />
              )}
              {/* Mini Status */}
              <div className="flex justify-between items-center text-[8px] text-white/80 font-mono">
                <span>09:41</span>
                <span>90Hz</span>
              </div>
              {/* Mini Clock */}
              <div className="text-center my-auto">
                <span className="text-2xl font-light text-white drop-shadow">09:41</span>
                <p className="text-[8px] text-white/70">Wednesday, Oct 7</p>
              </div>
              {/* Mini Dock */}
              <div className="w-full bg-black/40 backdrop-blur-md rounded-xl p-1.5 flex justify-around">
                <div className="w-3.5 h-3.5 rounded bg-emerald-500" />
                <div className="w-3.5 h-3.5 rounded bg-blue-500" />
                <div className="w-3.5 h-3.5 rounded bg-teal-500" />
                <div className="w-3.5 h-3.5 rounded bg-cyan-500" />
              </div>
            </div>
          </div>

          {/* Mirror Effect Toggle */}
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <div>
                <p className="text-xs font-bold text-white">Mirror Glass Reflection</p>
                <p className="text-[11px] text-slate-400">Realistic specular glass sheen & reflective depth</p>
              </div>
            </div>
            <button
              onClick={() => onToggleMirrorEffect(!mirrorEffect)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                mirrorEffect
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {mirrorEffect ? 'Active' : 'Off'}
            </button>
          </div>

          {/* Wallpaper Thumbnails Grid */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-300">Choose Wallpaper:</span>
            <div className="grid grid-cols-3 gap-2.5">
              {WALLPAPERS.map(wp => {
                const isSelected = selectedId === wp.id;
                return (
                  <div
                    key={wp.id}
                    onClick={() => setSelectedId(wp.id)}
                    className={`relative rounded-2xl p-2 cursor-pointer transition border-2 flex flex-col items-center gap-1.5 ${
                      isSelected
                        ? 'border-teal-400 bg-teal-500/10 shadow-md'
                        : 'border-slate-800 bg-slate-800/50 hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-full h-16 rounded-xl bg-gradient-to-b ${wp.preview} shadow-inner flex items-center justify-center relative overflow-hidden`}>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-teal-400 drop-shadow" />
                      )}
                    </div>
                    <span className="text-[10px] font-medium text-slate-300 truncate max-w-full text-center">
                      {wp.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Success Banner */}
          {applySuccess && (
            <div className="p-2.5 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 animate-bounce">
              <Check className="w-4 h-4" /> Wallpaper Applied Successfully!
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={() => handleApply('home')}
              className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition"
            >
              Apply to Home
            </button>
            <button
              onClick={() => handleApply('both')}
              className="py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 transition cursor-pointer"
            >
              Apply to Both
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
