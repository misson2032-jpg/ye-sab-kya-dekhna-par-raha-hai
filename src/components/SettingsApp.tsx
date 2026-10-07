import React, { useState } from 'react';
import { 
  ArrowLeft, Wifi, Bluetooth, AppWindow, Bell, Sun, Palette, Volume2, 
  BatteryCharging, HardDrive, Shield, Lock, UserCheck, Eye, Sparkles, 
  Info, Smartphone, Zap, RefreshCw, CheckCircle2, ChevronRight, AlertTriangle, 
  Sliders, ShieldCheck, Check, ToggleLeft, ToggleRight, Download, Mic
} from 'lucide-react';
import { SystemState, UIMode } from '../types/os';
import { WALLPAPERS } from '../data/systemData';

interface SettingsAppProps {
  systemState: SystemState;
  onUpdateSystem: (updates: Partial<SystemState>) => void;
  onSwitchUIMode: (mode: UIMode) => void;
  onOpenDownloadModal: () => void;
  onClose: () => void;
}

export const SettingsApp: React.FC<SettingsAppProps> = ({
  systemState,
  onUpdateSystem,
  onSwitchUIMode,
  onOpenDownloadModal,
  onClose,
}) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showSwitchConfirm, setShowSwitchConfirm] = useState(false);
  const [ramBoosted, setRamBoosted] = useState(false);
  const [storageCleaned, setStorageCleaned] = useState(false);

  const handleBoostRam = () => {
    setRamBoosted(true);
    onUpdateSystem({ ramUsedMb: 1100 });
    setTimeout(() => setRamBoosted(false), 2500);
  };

  const handleCleanStorage = () => {
    setStorageCleaned(true);
    onUpdateSystem({ storageUsedGb: Math.max(12, systemState.storageUsedGb - 1.8) });
    setTimeout(() => setStorageCleaned(false), 2500);
  };

  const menuSections = [
    {
      id: 'voice-agent',
      title: 'AI Voice Agent & Code Word Password',
      subtitle: `Code Word: "${systemState.voiceSecretCodeWord}" • Full Voice Control`,
      icon: <Mic className="w-5 h-5 text-teal-400" />,
      color: 'bg-teal-500/15',
      badge: 'Voice AI',
    },
    {
      id: 'ui-mode',
      title: 'UI Mode & HiOS Switcher',
      subtitle: systemState.uiMode === 'mayui' ? 'Active: MAYUI 2.6' : 'Active: TECNO HiOS',
      icon: <Sparkles className="w-5 h-5 text-teal-400" />,
      color: 'bg-teal-500/15',
      badge: '1-Tap Switch',
    },
    {
      id: 'download-apk',
      title: 'Download MAYUI Launcher APK',
      subtitle: 'Official v2.6.2 package for TECNO SPARK Go 2024',
      icon: <Download className="w-5 h-5 text-cyan-400" />,
      color: 'bg-cyan-500/15',
      badge: 'APK File',
      isAction: true,
    },
    {
      id: 'battery-performance',
      title: 'Performance & Battery',
      subtitle: `${systemState.performanceMode.toUpperCase()} • MemFusion 3GB+3GB`,
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      color: 'bg-amber-500/15',
    },
    {
      id: 'display',
      title: 'Display & 90Hz Refresh',
      subtitle: `Refresh: ${systemState.refreshRate.toUpperCase()} • HD+ 720p`,
      icon: <Sun className="w-5 h-5 text-sky-400" />,
      color: 'bg-sky-500/15',
    },
    {
      id: 'wallpaper-style',
      title: 'Wallpaper & Style',
      subtitle: 'Adaptive themes & icon shapes',
      icon: <Palette className="w-5 h-5 text-purple-400" />,
      color: 'bg-purple-500/15',
    },
    {
      id: 'storage',
      title: 'Storage & Junk Cleaner',
      subtitle: `${systemState.storageUsedGb} GB used of ${systemState.storageTotalGb} GB`,
      icon: <HardDrive className="w-5 h-5 text-emerald-400" />,
      color: 'bg-emerald-500/15',
    },
    {
      id: 'privacy-security',
      title: 'Privacy & Security',
      subtitle: 'Camera/Mic shield, Sandboxing',
      icon: <ShieldCheck className="w-5 h-5 text-teal-400" />,
      color: 'bg-teal-500/15',
    },
    {
      id: 'network',
      title: 'Network & Internet',
      subtitle: systemState.wifi ? 'Wi-Fi: Connected' : 'Wi-Fi: Disconnected',
      icon: <Wifi className="w-5 h-5 text-blue-400" />,
      color: 'bg-blue-500/15',
    },
    {
      id: 'connected-devices',
      title: 'Connected Devices',
      subtitle: systemState.bluetooth ? 'Bluetooth On' : 'Bluetooth Off',
      icon: <Bluetooth className="w-5 h-5 text-indigo-400" />,
      color: 'bg-indigo-500/15',
    },
    {
      id: 'sound',
      title: 'Sound & Vibration',
      subtitle: `Volume: ${systemState.volume}% • DTS Audio`,
      icon: <Volume2 className="w-5 h-5 text-pink-400" />,
      color: 'bg-pink-500/15',
    },
    {
      id: 'about-phone',
      title: 'About Phone',
      subtitle: 'TECNO SPARK Go 2024 (BG6)',
      icon: <Smartphone className="w-5 h-5 text-slate-300" />,
      color: 'bg-slate-700/30',
    },
  ];

  return (
    <div className="relative w-full h-full bg-slate-950 text-white flex flex-col font-sans select-none animate-fadeIn overflow-hidden">
      {/* Settings Top Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (activeSection) {
                setActiveSection(null);
              } else {
                onClose();
              }
            }}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-bold text-base text-white">
              {activeSection ? activeSection.replace('-', ' ').toUpperCase() : 'Settings'}
            </h2>
            <p className="text-[11px] text-teal-400 font-mono">TECNO SPARK Go 2024</p>
          </div>
        </div>

        <span className="text-[10px] font-mono bg-teal-500/15 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-full">
          MAYUI v2.6
        </span>
      </div>

      {/* Main Settings Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* SECTION: AI VOICE AGENT & CODE WORD PASSWORD */}
        {activeSection === 'voice-agent' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-950/60 to-slate-900 border border-teal-500/30 text-white space-y-2">
              <div className="flex items-center gap-2 text-teal-300 font-bold text-sm">
                <Mic className="w-4 h-4" /> MAY AI Voice Engine
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Control your TECNO SPARK Go 2024 entirely with voice commands. Set a secret voice code word or spoken password to unlock your phone, launch apps, manage hardware, and lock the device.
              </p>
            </div>

            {/* Secret Code Word / Password Customization Card */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-white">Voice Password / Code Word</h4>
                  <p className="text-xs text-slate-400">Speak this phrase or word to unlock your phone</p>
                </div>
                <Lock className="w-4 h-4 text-teal-400" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-slate-300">Secret Phrase:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={systemState.voiceSecretCodeWord}
                    onChange={(e) => onUpdateSystem({ voiceSecretCodeWord: e.target.value })}
                    placeholder="Enter secret code word (e.g. open sesame)..."
                    className="flex-1 bg-slate-950 border border-teal-500/40 rounded-xl px-3 py-2 text-xs font-mono text-teal-300 focus:outline-none focus:border-teal-400"
                  />
                </div>
                <p className="text-[10px] text-slate-400">
                  Tip: Use distinct phrases like <span className="text-teal-300 font-mono">open sesame</span>, <span className="text-teal-300 font-mono">spark 2024</span>, or <span className="text-teal-300 font-mono">unlock mayui</span>.
                </p>
              </div>
            </div>

            {/* Voice Audio Feedback Toggle */}
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-semibold text-xs text-white">Spoken Voice Responses</p>
                <p className="text-[11px] text-slate-400">Agent speaks confirmation aloud via speaker</p>
              </div>
              <button
                onClick={() => onUpdateSystem({ voiceFeedbackSpeechEnabled: !systemState.voiceFeedbackSpeechEnabled })}
                className="p-1 text-teal-400"
              >
                {systemState.voiceFeedbackSpeechEnabled ? (
                  <ToggleRight className="w-8 h-8 text-teal-400" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-slate-600" />
                )}
              </button>
            </div>

            {/* Supported Voice Commands Directory */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5 text-xs">
              <h4 className="font-semibold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" /> Supported Voice Commands
              </h4>
              <ul className="space-y-1.5 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="font-mono text-teal-300 font-bold min-w-[120px]">"Open sesame"</span>
                  <span className="text-slate-400">Unlocks phone with your code word</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-teal-300 font-bold min-w-[120px]">"Lock phone"</span>
                  <span className="text-slate-400">Closes and turns off screen into standby</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-teal-300 font-bold min-w-[120px]">"Open Camera"</span>
                  <span className="text-slate-400">Launches 13MP Dual Camera</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-teal-300 font-bold min-w-[120px]">"Turn on torch"</span>
                  <span className="text-slate-400">Enables rear LED flashlight</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-teal-300 font-bold min-w-[120px]">"Boost RAM"</span>
                  <span className="text-slate-400">Cleans background Unisoc T606 memory</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-teal-300 font-bold min-w-[120px]">"Switch to HiOS"</span>
                  <span className="text-slate-400">Toggles to original TECNO HiOS mode</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-teal-300 font-bold min-w-[120px]">"Open Settings"</span>
                  <span className="text-slate-400">Opens system settings</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* SECTION: UI MODE SWITCHER (Core Requirement) */}
        {activeSection === 'ui-mode' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-950/60 to-slate-900 border border-teal-500/30 text-white space-y-2">
              <div className="flex items-center gap-2 text-teal-300 font-bold text-sm">
                <Sparkles className="w-4 h-4" /> 1-Tap UI Switcher
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                MAYUI runs on top of your TECNO SPARK Go 2024 as a lightweight custom OS layer. You can switch between MAYUI and the original TECNO HiOS launcher in one tap anytime without losing any files or apps.
              </p>
            </div>

            {/* Current Mode Cards */}
            <div className="space-y-3">
              <div
                onClick={() => onSwitchUIMode('mayui')}
                className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                  systemState.uiMode === 'mayui'
                    ? 'bg-teal-500/20 border-teal-400 text-white shadow-lg shadow-teal-500/10'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500 text-slate-950 font-black flex items-center justify-center">
                    M
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">MAYUI Flagship Mode</h4>
                    <p className="text-xs text-slate-300">Modern minimalist launcher, 90Hz fluid animations, 0% bloat</p>
                  </div>
                </div>
                {systemState.uiMode === 'mayui' && <CheckCircle2 className="w-5 h-5 text-teal-400" />}
              </div>

              <div
                onClick={() => setShowSwitchConfirm(true)}
                className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                  systemState.uiMode === 'hios'
                    ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-lg'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                    HiOS
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">TECNO HiOS Original Mode</h4>
                    <p className="text-xs text-slate-300">Default factory TECNO launcher & widgets</p>
                  </div>
                </div>
                {systemState.uiMode === 'hios' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-500" />
                )}
              </div>
            </div>

            {/* Switch to HiOS Big Button */}
            <button
              onClick={() => setShowSwitchConfirm(true)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition"
            >
              <RefreshCw className="w-4 h-4" /> Switch to TECNO HiOS
            </button>

            {/* Safety & Non-Destructive Guarantee Box */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 space-y-1.5">
              <span className="font-semibold text-teal-300 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Zero Data Loss Guarantee
              </span>
              <p>
                Switching does not factory-reset your device, delete photos, or modify your personal files. It simply adjusts the default Android Home launcher.
              </p>
            </div>
          </div>
        )}

        {/* SECTION: PERFORMANCE & BATTERY (TECNO SPARK Go 2024 Tuned) */}
        {activeSection === 'battery-performance' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Battery Status Banner */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Battery Status (5,000 mAh Li-Po)</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-light text-white">{systemState.batteryLevel}%</span>
                  <span className="text-xs text-teal-400">~ 28 hours remaining</span>
                </div>
              </div>
              <BatteryCharging className="w-10 h-10 text-teal-400" />
            </div>

            {/* Performance Mode Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Device Power Profile:</label>
              <div className="grid grid-cols-3 gap-2">
                {(['battery-saver', 'balanced', 'performance'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => onUpdateSystem({ performanceMode: mode })}
                    className={`p-3 rounded-xl border text-center transition ${
                      systemState.performanceMode === mode
                        ? 'bg-teal-500 text-slate-950 font-bold border-teal-400 shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <div className="text-xs capitalize">{mode.replace('-', ' ')}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* MemFusion RAM Booster */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-white">MemFusion RAM Booster</h4>
                  <p className="text-xs text-slate-400">Unisoc T606: 3 GB Physical + 3 GB Virtual Extended</p>
                </div>
                <span className="text-xs font-mono text-teal-400">
                  {systemState.ramUsedMb} / 3072 MB
                </span>
              </div>

              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-teal-400 to-emerald-400 h-full"
                  style={{ width: `${(systemState.ramUsedMb / 3072) * 100}%` }}
                />
              </div>

              <button
                onClick={handleBoostRam}
                className="w-full py-2.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 text-xs font-bold border border-teal-500/40 flex items-center justify-center gap-2 transition"
              >
                <Zap className="w-4 h-4" /> {ramBoosted ? 'RAM Freed & Cached Reset!' : 'Boost Active RAM'}
              </button>
            </div>

            {/* Reduce Animations Toggle */}
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-semibold text-xs text-white">Reduce Animations</p>
                <p className="text-[11px] text-slate-400">Maximize budget GPU responsiveness & speed</p>
              </div>
              <button
                onClick={() => onUpdateSystem({ reduceAnimations: !systemState.reduceAnimations })}
                className="p-1 text-teal-400"
              >
                {systemState.reduceAnimations ? (
                  <ToggleRight className="w-8 h-8 text-teal-400" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-slate-600" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* SECTION: DISPLAY & 90Hz */}
        {activeSection === 'display' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <h4 className="font-semibold text-sm text-white">Refresh Rate</h4>
              <p className="text-xs text-slate-400">TECNO SPARK Go 2024 features a smooth 90Hz Dot-in screen.</p>
              
              <div className="grid grid-cols-3 gap-2 pt-2">
                {(['60hz', '90hz', 'adaptive'] as const).map(rate => (
                  <button
                    key={rate}
                    onClick={() => onUpdateSystem({ refreshRate: rate })}
                    className={`py-2 rounded-xl border text-xs font-semibold uppercase transition ${
                      systemState.refreshRate === rate
                        ? 'bg-teal-500 text-slate-950 border-teal-400'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    {rate}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation Mode */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <h4 className="font-semibold text-sm text-white">System Navigation</h4>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => onUpdateSystem({ navigationMode: 'gestures' })}
                  className={`py-2.5 rounded-xl border text-xs font-semibold transition ${
                    systemState.navigationMode === 'gestures'
                      ? 'bg-teal-500 text-slate-950 border-teal-400'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  Swipe Gestures
                </button>
                <button
                  onClick={() => onUpdateSystem({ navigationMode: '3-button' })}
                  className={`py-2.5 rounded-xl border text-xs font-semibold transition ${
                    systemState.navigationMode === '3-button'
                      ? 'bg-teal-500 text-slate-950 border-teal-400'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  3-Button Nav
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SECTION: STORAGE */}
        {activeSection === 'storage' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex justify-between items-baseline">
                <div>
                  <h4 className="font-semibold text-sm text-white">Internal Storage</h4>
                  <p className="text-xs text-slate-400">eMMC 5.1 Flash Memory</p>
                </div>
                <span className="text-sm font-mono text-teal-400">
                  {systemState.storageUsedGb.toFixed(1)} / {systemState.storageTotalGb} GB
                </span>
              </div>

              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden flex">
                <div className="bg-teal-400 h-full w-[20%]" title="Apps" />
                <div className="bg-cyan-400 h-full w-[10%]" title="System" />
                <div className="bg-amber-400 h-full w-[8%]" title="Media" />
              </div>

              <button
                onClick={handleCleanStorage}
                className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                <HardDrive className="w-4 h-4" />
                {storageCleaned ? '1.8 GB Temporary APK Cache Cleaned!' : 'Clean Junk & Cache (1.8 GB)'}
              </button>
            </div>
          </div>
        )}

        {/* SECTION: ABOUT PHONE (TECNO SPARK Go 2024) */}
        {activeSection === 'about-phone' && (
          <div className="space-y-3 animate-fadeIn text-xs">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black text-xl">
                  M
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">TECNO SPARK Go 2024</h4>
                  <p className="text-slate-400">Model: TECNO BG6 / BG6s</p>
                  <p className="text-teal-400 font-mono text-[11px]">MAYUI Spark Edition v2.6.2</p>
                </div>
              </div>

              <div className="space-y-2 text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Processor:</span>
                  <span className="font-medium text-white">Unisoc Tiger T606 (8-Core 1.6 GHz)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Memory (RAM):</span>
                  <span className="font-medium text-white">3 GB + 3 GB MemFusion Extended</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Storage (ROM):</span>
                  <span className="font-medium text-white">64 GB (eMMC 5.1)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Display:</span>
                  <span className="font-medium text-white">6.6" HD+ IPS LCD, 90Hz Refresh</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Battery:</span>
                  <span className="font-medium text-white">5000 mAh (10W Type-C Charging)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Base System:</span>
                  <span className="font-medium text-white">Android 13 (Go Edition) / HiOS 13</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DEFAULT: ROOT LIST OF SECTIONS */}
        {!activeSection && (
          <div className="space-y-2">
            {menuSections.map(sec => (
              <div
                key={sec.id}
                onClick={() => {
                  if (sec.id === 'download-apk') {
                    onOpenDownloadModal();
                  } else {
                    setActiveSection(sec.id);
                  }
                }}
                className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between cursor-pointer transition hover:bg-slate-900 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl ${sec.color} flex items-center justify-center flex-shrink-0`}>
                    {sec.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-xs text-white truncate">{sec.title}</h4>
                      {sec.badge && (
                        <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/30 px-1.5 py-0.2 rounded font-mono">
                          {sec.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">{sec.subtitle}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CONFIRMATION POPUP FOR SWITCHING TO TECNO HiOS */}
      {showSwitchConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-5 max-w-sm w-full shadow-2xl text-white space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <RefreshCw className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h4 className="font-bold text-base text-white">Switch to TECNO HiOS?</h4>
              <p className="text-xs text-slate-300">
                This will safely return your phone to the original TECNO Home/HiOS interface.
              </p>
            </div>

            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[11px] text-emerald-300 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> All files, apps & photos are safe
              </div>
              <p className="text-emerald-300/80">
                You can return to MAYUI anytime with one tap from the HiOS home screen.
              </p>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setShowSwitchConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowSwitchConfirm(false);
                  onSwitchUIMode('hios');
                  onClose();
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-emerald-500/20"
              >
                Confirm Switch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
