import React, { useState } from 'react';
import { 
  Wifi, Battery, BatteryCharging, ArrowLeft, Circle, Square, 
  Smartphone, Volume2, Power, Sparkles, Download, Layers, ShieldCheck, Mic 
} from 'lucide-react';
import { SystemState } from '../types/os';

interface PhoneFrameProps {
  systemState: SystemState;
  onPowerButton: () => void;
  onHomeButton: () => void;
  onBackButton: () => void;
  onRecentsButton: () => void;
  onOpenQuickPanel: () => void;
  onOpenNotifications: () => void;
  onOpenDownloadModal: () => void;
  onOpenVoiceAgent: () => void;
  children: React.ReactNode;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  systemState,
  onPowerButton,
  onHomeButton,
  onBackButton,
  onRecentsButton,
  onOpenQuickPanel,
  onOpenNotifications,
  onOpenDownloadModal,
  onOpenVoiceAgent,
  children,
}) => {
  const [dynamicPortExpanded, setDynamicPortExpanded] = useState(false);

  const currentTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <div className="relative flex flex-col items-center justify-center p-2 sm:p-6 min-h-screen">
      {/* Outer Phone Enclosure (TECNO SPARK Go 2024 Dimensions & Style) */}
      <div className="relative w-full max-w-[390px] h-[812px] bg-slate-900 rounded-[50px] p-[10px] shadow-[0_25px_70px_rgba(0,0,0,0.85)] border-[4px] border-slate-700/80 ring-1 ring-white/10 flex flex-col select-none overflow-hidden">
        
        {/* Physical hardware buttons on right edge (simulated) */}
        <div 
          onClick={onPowerButton}
          className="absolute -right-[7px] top-[180px] w-[5px] h-[52px] bg-slate-600 rounded-r-md cursor-pointer hover:bg-teal-400 transition"
          title="Power / Lock Key"
        />
        <div 
          className="absolute -right-[7px] top-[110px] w-[5px] h-[55px] bg-slate-600 rounded-r-md cursor-pointer hover:bg-slate-400 transition"
          title="Volume Rocker"
        />

        {/* Display Glass / Screen */}
        <div className="relative w-full h-full bg-slate-950 rounded-[42px] overflow-hidden flex flex-col border border-white/5 shadow-inner">
          
          {/* Specular Mirror Glass Sheen Layer */}
          {systemState.mirrorEffect && (
            <div 
              className="absolute inset-0 pointer-events-none z-40 transition-opacity duration-500"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.02) 28%, transparent 48%, rgba(255,255,255,0.05) 75%, rgba(255,255,255,0.12) 100%)'
              }}
            />
          )}

          {/* Status Bar (Always present at top) */}
          <div className="relative z-30 h-10 px-6 flex items-center justify-between text-white text-[12px] font-sans font-medium bg-black/20 backdrop-blur-sm select-none">
            {/* Left: Time & Carrier / Notifications swipe target */}
            <div 
              onClick={onOpenNotifications}
              className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition"
              title="Swipe / Click for Notifications"
            >
              <span>{currentTimeStr}</span>
              <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 px-1 rounded">4G</span>
            </div>

            {/* Center: Dynamic Port Punch-Hole (TECNO SPARK Go 2024 Feature) */}
            <div 
              onClick={() => {
                if (!dynamicPortExpanded) {
                  setDynamicPortExpanded(true);
                }
              }}
              className={`absolute left-1/2 -translate-x-1/2 top-2 rounded-full bg-black border border-slate-800 flex items-center justify-center transition-all duration-300 cursor-pointer shadow-md ${
                dynamicPortExpanded 
                  ? 'w-48 h-7 px-3 gap-2 bg-slate-900 border-teal-500/40 text-[10px] text-teal-300' 
                  : 'w-7 h-7'
              }`}
              title="TECNO Dynamic Port Camera Cutout"
            >
              {dynamicPortExpanded ? (
                <div className="flex items-center justify-between w-full">
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenVoiceAgent();
                      setDynamicPortExpanded(false);
                    }}
                    className="flex items-center gap-1 hover:text-white"
                  >
                    <Mic className="w-3 h-3 text-teal-400 animate-pulse" />
                    <span className="truncate font-semibold">Talk to MAY AI</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-white/80">
                    <span>{systemState.batteryLevel}%</span>
                    <span 
                      onClick={(e) => {
                        e.stopPropagation();
                        setDynamicPortExpanded(false);
                      }} 
                      className="text-white/40 hover:text-white cursor-pointer ml-1 text-xs"
                    >
                      ×
                    </span>
                  </div>
                </div>
              ) : (
                /* Camera lens reflection */
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenVoiceAgent();
                  }}
                  className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:scale-125 transition"
                  title="Click to talk to Voice AI"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-400/80" />
                </div>
              )}
            </div>

            {/* Right: Hardware Icons & Quick Panel swipe target */}
            <div 
              onClick={onOpenQuickPanel}
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
              title="Swipe / Click for Control Center"
            >
              {/* Privacy Indicator (Green dot when camera/mic is active) */}
              {(systemState.cameraActive || systemState.micActive) && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Camera/Mic in use" />
              )}
              {systemState.wifi && <Wifi className="w-3.5 h-3.5" />}
              <div className="flex items-center gap-1 font-mono text-[11px]">
                {systemState.isCharging ? (
                  <BatteryCharging className="w-3.5 h-3.5 text-teal-300" />
                ) : (
                  <Battery className="w-3.5 h-3.5" />
                )}
                <span>{systemState.batteryLevel}%</span>
              </div>
            </div>
          </div>

          {/* Phone Display Content Area */}
          <div className="flex-1 relative overflow-hidden flex flex-col">
            {children}
          </div>

          {/* Bottom System Navigation Area */}
          {!systemState.isLocked && (
            <div className="relative z-30 h-8 flex items-center justify-center bg-black/10 backdrop-blur-sm">
              {systemState.navigationMode === 'gestures' ? (
                /* Gesture Bar Pill */
                <div
                  onClick={onHomeButton}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    onRecentsButton();
                  }}
                  className="w-32 h-1.5 rounded-full bg-white/40 hover:bg-white/80 active:bg-teal-400 cursor-pointer transition transform active:scale-95"
                  title="Click: Home | Right-click: Recents"
                />
              ) : (
                /* 3-Button Navigation (Back, Home, Recents) */
                <div className="w-full px-8 flex items-center justify-between text-white/60">
                  <button
                    onClick={onBackButton}
                    className="p-1 hover:text-white transition"
                    title="Back"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={onHomeButton}
                    className="p-1 hover:text-white transition"
                    title="Home"
                  >
                    <Circle className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={onRecentsButton}
                    className="p-1 hover:text-white transition"
                    title="Recent Apps"
                  >
                    <Square className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
