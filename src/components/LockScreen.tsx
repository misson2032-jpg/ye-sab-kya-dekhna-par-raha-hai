import React, { useState, useEffect } from 'react';
import { Camera, Flashlight, Play, Pause, SkipForward, SkipBack, Fingerprint, Lock, ShieldCheck, Sun, CloudRain, Battery, BatteryCharging, Sparkles, Volume2, Mic } from 'lucide-react';
import { SystemState } from '../types/os';

interface LockScreenProps {
  systemState: SystemState;
  onUnlock: () => void;
  onOpenQuickPanel: () => void;
  onOpenNotifications: () => void;
  onLaunchCamera: () => void;
  onOpenVoiceAgent: () => void;
  toggleFlashlight: () => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({
  systemState,
  onUnlock,
  onOpenQuickPanel,
  onOpenNotifications,
  onLaunchCamera,
  onOpenVoiceAgent,
  toggleFlashlight,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [fingerprintScanning, setFingerprintScanning] = useState(false);
  const [faceUnlocked, setFaceUnlocked] = useState(false);
  const [clockStyle, setClockStyle] = useState<'modern' | 'stacked' | 'minimal'>('modern');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    // Face unlock simulation
    const faceTimer = setTimeout(() => {
      setFaceUnlocked(true);
    }, 1200);

    return () => {
      clearInterval(timer);
      clearTimeout(faceTimer);
    };
  }, []);

  const handleFingerprintDown = () => {
    setFingerprintScanning(true);
    setTimeout(() => {
      setFingerprintScanning(false);
      onUnlock();
    }, 450);
  };

  const formattedHours = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  const formattedDate = currentTime.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-6 select-none overflow-hidden text-white font-sans">
      {/* Top status & Face unlock indicator */}
      <div className="flex items-center justify-between z-10 pt-2">
        <div className="flex items-center gap-2">
          {faceUnlocked ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-[11px] text-teal-300 animate-fadeIn">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>Face recognized</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/20 backdrop-blur-md text-[11px] text-white/70">
              <Lock className="w-3 h-3" />
              <span>Swipe or touch sensor</span>
            </div>
          )}
        </div>

        {/* Clock style pill */}
        <button
          onClick={() => setClockStyle(c => (c === 'modern' ? 'stacked' : c === 'stacked' ? 'minimal' : 'modern'))}
          className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur text-white/80 transition"
          title="Change Clock Style"
        >
          Style: {clockStyle}
        </button>
      </div>

      {/* Main Lock Screen Clock & Date */}
      <div className="flex flex-col items-center mt-6 z-10 space-y-1">
        {clockStyle === 'modern' && (
          <div className="text-center">
            <h1 className="text-6xl sm:text-7xl font-extralight tracking-tight drop-shadow-md font-sans">
              {formattedHours}
            </h1>
            <p className="text-sm font-medium tracking-wide text-white/80 drop-shadow mt-1">
              {formattedDate}
            </p>
          </div>
        )}

        {clockStyle === 'stacked' && (
          <div className="text-center leading-none">
            <div className="text-6xl font-bold tracking-tighter text-teal-300 drop-shadow">
              {formattedHours.split(':')[0]}
            </div>
            <div className="text-6xl font-light tracking-tighter text-white drop-shadow">
              {formattedHours.split(':')[1]}
            </div>
            <p className="text-xs font-medium text-white/70 uppercase tracking-widest mt-2">
              {formattedDate}
            </p>
          </div>
        )}

        {clockStyle === 'minimal' && (
          <div className="text-center">
            <h1 className="text-5xl font-mono tracking-widest text-white drop-shadow">
              {formattedHours}
            </h1>
            <p className="text-xs text-white/80 font-mono tracking-wide mt-1">
              {formattedDate} • 26°C Sunny
            </p>
          </div>
        )}

        {/* Weather chip */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/25 backdrop-blur-md border border-white/10 text-xs mt-3 shadow-sm">
          <Sun className="w-3.5 h-3.5 text-amber-400" />
          <span>26°C • Nairobi, Clear</span>
          <span className="text-white/40">|</span>
          <div className="flex items-center gap-1 text-teal-300 font-mono text-[11px]">
            {systemState.isCharging ? <BatteryCharging className="w-3 h-3 text-teal-400" /> : <Battery className="w-3 h-3" />}
            <span>{systemState.batteryLevel}%</span>
          </div>
        </div>
      </div>

      {/* Middle: Music Widget & Notification preview */}
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full space-y-3 z-10 my-4">
        {/* Lock Screen Media Card */}
        <div className="p-3.5 rounded-2xl bg-black/35 backdrop-blur-xl border border-white/10 shadow-lg text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md">
              <span className="text-base font-bold">MAY</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate text-white">Midnight Horizon (90Hz Mix)</p>
              <p className="text-[11px] text-teal-300/80 truncate">MAYUI Audio Studio • Spark Hi-Res</p>
              <div className="w-full bg-white/20 h-1 rounded-full mt-2 overflow-hidden">
                <div className="bg-teal-400 h-full w-2/5 rounded-full" />
              </div>
            </div>
            <button
              onClick={() => setIsPlayingMusic(!isPlayingMusic)}
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur flex items-center justify-center text-white transition active:scale-90"
            >
              {isPlayingMusic ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
            </button>
          </div>
        </div>

        {/* Small Notification Card */}
        <div
          onClick={onOpenNotifications}
          className="p-3 rounded-2xl bg-black/25 backdrop-blur-md border border-white/10 text-white/90 text-xs flex items-center justify-between cursor-pointer hover:bg-black/35 transition"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-medium text-white">MAYUI 2.6 • TECNO SPARK Go Tuned</p>
              <p className="text-[11px] text-white/60">Tap to see 3 active notifications</p>
            </div>
          </div>
          <span className="text-[10px] text-white/40">Now</span>
        </div>

        {/* AI Voice Code Word Unlock Banner */}
        <div
          onClick={onOpenVoiceAgent}
          className="p-3 rounded-2xl bg-gradient-to-r from-teal-500/20 via-cyan-500/15 to-teal-500/20 border border-teal-400/50 backdrop-blur-md text-white flex items-center justify-between cursor-pointer hover:border-teal-300 transition group shadow-md"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-400 text-slate-950 flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition">
              <Mic className="w-4 h-4 text-slate-950" />
            </div>
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                AI Voice Unlock <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              </p>
              <p className="text-[11px] text-teal-200">
                Say: <span className="font-mono font-bold text-white">"{systemState.voiceSecretCodeWord}"</span>
              </p>
            </div>
          </div>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-teal-500/30 text-teal-200 border border-teal-500/40">
            Voice Key
          </span>
        </div>
      </div>

      {/* Bottom Unlock Area: Fingerprint sensor & Corner shortcuts */}
      <div className="flex flex-col items-center z-10 space-y-4 pb-2">
        {/* Fingerprint Sensor */}
        <div className="flex flex-col items-center">
          <button
            onMouseDown={handleFingerprintDown}
            onTouchStart={handleFingerprintDown}
            className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
              fingerprintScanning
                ? 'bg-teal-400/40 scale-110 shadow-[0_0_30px_rgba(20,184,166,0.8)] border border-teal-300'
                : 'bg-black/30 backdrop-blur-md border border-white/15 hover:border-teal-400/50 hover:bg-black/40'
            }`}
            title="Press and hold fingerprint to unlock"
          >
            {fingerprintScanning && (
              <span className="absolute inset-0 rounded-full border-2 border-teal-400 animate-ping opacity-75" />
            )}
            <Fingerprint className={`w-8 h-8 transition-colors ${fingerprintScanning ? 'text-teal-300' : 'text-white/80'}`} />
          </button>
          <span className="text-[10px] text-white/60 mt-1.5 font-medium tracking-wide">
            Hold sensor to unlock
          </span>
        </div>

        {/* Bottom Quick Action Icons */}
        <div className="w-full flex items-center justify-between px-3 pt-1">
          {/* Torch shortcut */}
          <button
            onClick={toggleFlashlight}
            className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition active:scale-90 ${
              systemState.flashlight
                ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/40'
                : 'bg-black/30 border border-white/15 text-white hover:bg-black/50'
            }`}
            title="Toggle Flashlight"
          >
            <Flashlight className="w-5 h-5" />
          </button>

          {/* Swipe indicator */}
          <button
            onClick={onUnlock}
            className="text-[11px] text-white/70 hover:text-white uppercase tracking-wider flex items-center gap-1 transition"
          >
            <span>Swipe up</span>
          </button>

          {/* Camera shortcut */}
          <button
            onClick={onLaunchCamera}
            className="w-11 h-11 rounded-full bg-black/30 border border-white/15 text-white hover:bg-black/50 backdrop-blur-md flex items-center justify-center transition active:scale-90"
            title="Launch Camera"
          >
            <Camera className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
