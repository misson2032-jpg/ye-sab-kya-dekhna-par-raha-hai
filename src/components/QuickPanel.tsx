import React from 'react';
import { 
  Wifi, Bluetooth, Radio, Plane, Flashlight, MapPin, 
  WifiOff, Video, Moon, RotateCcw, BatteryCharging, 
  Sliders, Sun, Volume2, Play, Pause, SkipForward, SkipBack, 
  Settings, Zap, X, Shield, RadioTower, Sparkles
} from 'lucide-react';
import { SystemState } from '../types/os';

interface QuickPanelProps {
  systemState: SystemState;
  onUpdateSystem: (updates: Partial<SystemState>) => void;
  onClose: () => void;
  onOpenSettings: () => void;
  onOpenBooster: () => void;
}

export const QuickPanel: React.FC<QuickPanelProps> = ({
  systemState,
  onUpdateSystem,
  onClose,
  onOpenSettings,
  onOpenBooster,
}) => {
  const toggles = [
    {
      id: 'wifi',
      label: 'Wi-Fi',
      active: systemState.wifi,
      icon: <Wifi className="w-5 h-5" />,
      action: () => onUpdateSystem({ wifi: !systemState.wifi }),
      color: 'bg-teal-500 text-slate-950',
    },
    {
      id: 'bluetooth',
      label: 'Bluetooth',
      active: systemState.bluetooth,
      icon: <Bluetooth className="w-5 h-5" />,
      action: () => onUpdateSystem({ bluetooth: !systemState.bluetooth }),
      color: 'bg-teal-500 text-slate-950',
    },
    {
      id: 'mobileData',
      label: 'Mobile Data',
      active: systemState.mobileData,
      icon: <RadioTower className="w-5 h-5" />,
      action: () => onUpdateSystem({ mobileData: !systemState.mobileData }),
      color: 'bg-teal-500 text-slate-950',
    },
    {
      id: 'flashlight',
      label: 'Flashlight',
      active: systemState.flashlight,
      icon: <Flashlight className="w-5 h-5" />,
      action: () => onUpdateSystem({ flashlight: !systemState.flashlight }),
      color: 'bg-amber-400 text-slate-950',
    },
    {
      id: 'batterySaver',
      label: 'Battery Saver',
      active: systemState.batterySaver,
      icon: <BatteryCharging className="w-5 h-5" />,
      action: () => onUpdateSystem({ batterySaver: !systemState.batterySaver }),
      color: 'bg-amber-400 text-slate-950',
    },
    {
      id: 'airplaneMode',
      label: 'Airplane',
      active: systemState.airplaneMode,
      icon: <Plane className="w-5 h-5" />,
      action: () => onUpdateSystem({ airplaneMode: !systemState.airplaneMode }),
      color: 'bg-indigo-400 text-slate-950',
    },
    {
      id: 'location',
      label: 'Location',
      active: systemState.location,
      icon: <MapPin className="w-5 h-5" />,
      action: () => onUpdateSystem({ location: !systemState.location }),
      color: 'bg-teal-500 text-slate-950',
    },
    {
      id: 'hotspot',
      label: 'Hotspot',
      active: systemState.hotspot,
      icon: <Radio className="w-5 h-5" />,
      action: () => onUpdateSystem({ hotspot: !systemState.hotspot }),
      color: 'bg-teal-500 text-slate-950',
    },
    {
      id: 'screenRecording',
      label: 'Record',
      active: systemState.screenRecording,
      icon: <Video className="w-5 h-5" />,
      action: () => onUpdateSystem({ screenRecording: !systemState.screenRecording }),
      color: 'bg-rose-500 text-white',
    },
    {
      id: 'doNotDisturb',
      label: 'DND',
      active: systemState.doNotDisturb,
      icon: <Moon className="w-5 h-5" />,
      action: () => onUpdateSystem({ doNotDisturb: !systemState.doNotDisturb }),
      color: 'bg-purple-500 text-white',
    },
    {
      id: 'autoRotate',
      label: 'Auto Rotate',
      active: systemState.autoRotate,
      icon: <RotateCcw className="w-5 h-5" />,
      action: () => onUpdateSystem({ autoRotate: !systemState.autoRotate }),
      color: 'bg-teal-500 text-slate-950',
    },
    {
      id: 'nfc',
      label: 'NFC',
      active: systemState.nfc,
      icon: <Shield className="w-5 h-5" />,
      action: () => onUpdateSystem({ nfc: !systemState.nfc }),
      color: 'bg-teal-500 text-slate-950',
    },
  ];

  return (
    <div className="relative w-full h-full bg-slate-950/95 backdrop-blur-3xl text-white flex flex-col font-sans select-none animate-slideDown p-4 overflow-y-auto no-scrollbar">
      {/* Top action bar: Time, Shortcuts */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="text-xl font-light text-white font-mono">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
          </span>
          <span className="text-[11px] font-mono text-teal-400 bg-teal-500/10 border border-teal-500/30 px-2 py-0.5 rounded-full">
            TECNO 90Hz
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              onClose();
              onOpenBooster();
            }}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-teal-400 transition"
            title="RAM Optimizer"
          >
            <Zap className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenSettings();
            }}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Primary Connectivity Big Cards (One-Handed Ergo) */}
      <div className="grid grid-cols-2 gap-3 my-3">
        {/* Wi-Fi Card */}
        <div 
          onClick={() => onUpdateSystem({ wifi: !systemState.wifi })}
          className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
            systemState.wifi
              ? 'bg-teal-500/15 border-teal-500/40 text-teal-300'
              : 'bg-slate-900/80 border-slate-800 text-slate-400'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              systemState.wifi ? 'bg-teal-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
            }`}>
              <Wifi className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Wi-Fi</p>
              <p className="text-[11px] truncate">{systemState.wifi ? 'TECNO_5G_Home' : 'Disconnected'}</p>
            </div>
          </div>
        </div>

        {/* Bluetooth Card */}
        <div 
          onClick={() => onUpdateSystem({ bluetooth: !systemState.bluetooth })}
          className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
            systemState.bluetooth
              ? 'bg-teal-500/15 border-teal-500/40 text-teal-300'
              : 'bg-slate-900/80 border-slate-800 text-slate-400'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              systemState.bluetooth ? 'bg-teal-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
            }`}>
              <Bluetooth className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Bluetooth</p>
              <p className="text-[11px] truncate">{systemState.bluetooth ? 'Spark Buds Pro' : 'Off'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Quick Action Toggles (4 Columns) */}
      <div className="grid grid-cols-4 gap-2.5 my-2">
        {toggles.slice(2).map(toggle => (
          <button
            key={toggle.id}
            onClick={toggle.action}
            className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition active:scale-95 ${
              toggle.active
                ? `${toggle.color} border-transparent shadow-md`
                : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:bg-slate-800'
            }`}
          >
            {toggle.icon}
            <span className={`text-[10px] font-medium truncate max-w-[60px] ${toggle.active ? 'text-inherit font-semibold' : 'text-slate-300'}`}>
              {toggle.label}
            </span>
          </button>
        ))}
      </div>

      {/* Large Ergonomic Sliders (Brightness & Volume) */}
      <div className="space-y-3 my-3">
        {/* Brightness Slider */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex items-center gap-3">
          <Sun className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Display Brightness</span>
              <span className="font-mono text-white">{systemState.brightness}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={systemState.brightness}
              onChange={(e) => onUpdateSystem({ brightness: Number(e.target.value) })}
              className="w-full accent-teal-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>
        </div>

        {/* Volume Slider */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex items-center gap-3">
          <Volume2 className="w-5 h-5 text-teal-400 flex-shrink-0" />
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Media Volume</span>
              <span className="font-mono text-white">{systemState.volume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={systemState.volume}
              onChange={(e) => onUpdateSystem({ volume: Number(e.target.value) })}
              className="w-full accent-teal-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Mini Media Player Control */}
      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800/80 flex items-center justify-between mt-1">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-xs">
            MAY
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">TECNO 90Hz Audio Profile</p>
            <p className="text-[11px] text-teal-400">DTS Sound Master Tuned</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 text-slate-400 hover:text-white">
            <SkipBack className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 rounded-full bg-teal-500 text-slate-950 flex items-center justify-center">
            <Play className="w-3.5 h-3.5 fill-slate-950 ml-0.5" />
          </button>
          <button className="p-1.5 text-slate-400 hover:text-white">
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
