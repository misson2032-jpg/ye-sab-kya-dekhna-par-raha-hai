import React, { useState } from 'react';
import { 
  Phone, MessageSquare, Camera, Image as ImageIcon, ShoppingBag, Settings, FolderArchive, 
  Zap, Clock, Calculator, Music2, BookOpen, Compass, Trophy, Clock4, Activity, Flame, 
  Disc3, Film, Gamepad2, Send, Swords, Search, Sun, CloudRain, Battery, BatteryCharging, 
  Cpu, Heart, CheckCircle2, ChevronRight, Layers, Sliders, Palette, Plus, X, Folder, Mic, Sparkles, Play
} from 'lucide-react';
import { AppDefinition, SystemState } from '../types/os';

interface HomeScreenProps {
  systemState: SystemState;
  apps: AppDefinition[];
  onLaunchApp: (appId: string) => void;
  onOpenAppDrawer: () => void;
  onOpenQuickPanel: () => void;
  onOpenNotifications: () => void;
  onOpenWallpaperSelector: () => void;
  onTriggerApkInstaller: () => void;
  onOpenVoiceAgent: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  systemState,
  apps,
  onLaunchApp,
  onOpenAppDrawer,
  onOpenQuickPanel,
  onOpenNotifications,
  onOpenWallpaperSelector,
  onTriggerApkInstaller,
  onOpenVoiceAgent,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [openFolder, setOpenFolder] = useState<string | null>(null);

  // Dynamic Lucide icon mapper
  const renderAppIcon = (iconName: string, className = 'w-6 h-6') => {
    switch (iconName) {
      case 'Phone': return <Phone className={className} />;
      case 'MessageSquare': return <MessageSquare className={className} />;
      case 'Camera': return <Camera className={className} />;
      case 'Image': return <ImageIcon className={className} />;
      case 'ShoppingBag': return <ShoppingBag className={className} />;
      case 'Settings': return <Settings className={className} />;
      case 'FolderArchive': return <FolderArchive className={className} />;
      case 'Zap': return <Zap className={className} />;
      case 'Clock': return <Clock className={className} />;
      case 'Calculator': return <Calculator className={className} />;
      case 'Music2': return <Music2 className={className} />;
      case 'BookOpen': return <BookOpen className={className} />;
      case 'Compass': return <Compass className={className} />;
      case 'Trophy': return <Trophy className={className} />;
      case 'Clock4': return <Clock4 className={className} />;
      case 'Activity': return <Activity className={className} />;
      case 'Flame': return <Flame className={className} />;
      case 'Disc3': return <Disc3 className={className} />;
      case 'Film': return <Film className={className} />;
      case 'Gamepad2': return <Gamepad2 className={className} />;
      case 'Send': return <Send className={className} />;
      case 'Swords': return <Swords className={className} />;
      case 'Play': return <Play className={className} />;
      default: return <Compass className={className} />;
    }
  };

  // Dock apps
  const dockAppIds = ['phone', 'messages', 'browser', 'camera', 'maystore'];
  const dockApps = apps.filter(a => dockAppIds.includes(a.id));

  // Folder content definitions
  const foldersData: Record<string, { name: string; appIds: string[]; color: string }> = {
    tools: {
      name: 'Tools & Utilities',
      appIds: ['files', 'calculator', 'clock', 'notes'],
      color: 'bg-amber-500/20 text-amber-300',
    },
    performance: {
      name: 'TECNO Tuner',
      appIds: ['booster', 'settings'],
      color: 'bg-teal-500/20 text-teal-300',
    },
  };

  // Filter apps for page grids
  const page1AppIds = ['gallery', 'music', 'booster', 'notes'];
  const page2Apps = apps.filter(a => !dockAppIds.includes(a.id) && !page1AppIds.includes(a.id));

  return (
    <div 
      className="relative w-full h-full flex flex-col justify-between p-4 select-none overflow-hidden font-sans"
      onContextMenu={(e) => {
        e.preventDefault();
        setIsEditing(true);
      }}
    >
      {/* Top Quick Status & Search Header */}
      <div className="z-10 pt-1 space-y-2">
        {/* Search & Suggestions pill with Voice Mic */}
        <div 
          className="flex items-center justify-between px-3.5 py-2 rounded-2xl bg-black/35 backdrop-blur-xl border border-white/10 text-white/70 shadow-md transition"
        >
          <div 
            onClick={onOpenAppDrawer}
            className="flex items-center gap-2.5 flex-1 cursor-pointer"
          >
            <Search className="w-4 h-4 text-teal-400" />
            <span className="text-xs font-normal">Search apps, files & web...</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenVoiceAgent}
              className="p-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500 text-teal-300 hover:text-slate-950 transition active:scale-90 flex items-center gap-1 cursor-pointer"
              title="Activate MAY Voice Agent"
            >
              <Mic className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/60">
              90Hz
            </span>
          </div>
        </div>
      </div>

      {/* Main Pages Content (Horizontal Scroll or Page Toggle) */}
      <div className="flex-1 flex flex-col justify-start overflow-y-auto no-scrollbar py-2 space-y-4 z-10">
        {currentPage === 0 ? (
          /* PAGE 1: Rich Widgets + Top Apps + Folders */
          <div className="space-y-4 animate-fadeIn">
            {/* WIDGET 1: Modern Clock & Weather Dual Tile */}
            <div className="grid grid-cols-2 gap-3">
              {/* Clock & Date Widget */}
              <div 
                onClick={() => onLaunchApp('clock')}
                className="p-3.5 rounded-2xl bg-black/30 backdrop-blur-xl border border-white/10 shadow-lg text-white flex flex-col justify-between cursor-pointer hover:border-teal-400/30 transition group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-teal-300 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Local Time
                  </span>
                  <span className="text-[10px] text-white/50">GMT+3</span>
                </div>
                <div className="my-1.5">
                  <h3 className="text-3xl font-extralight tracking-tight font-sans">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                  </h3>
                  <p className="text-[11px] text-white/70">
                    {new Date().toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <div className="text-[10px] text-white/40 group-hover:text-teal-300 transition">
                  Next alarm: 07:00 AM
                </div>
              </div>

              {/* Weather Widget */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-cyan-900/40 to-blue-950/40 backdrop-blur-xl border border-white/10 shadow-lg text-white flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-cyan-300 flex items-center gap-1">
                    <Sun className="w-3.5 h-3.5 text-amber-400" /> Nairobi
                  </span>
                  <span className="text-[10px] text-white/60">Air: 32 AQI</span>
                </div>
                <div className="my-1.5 flex items-baseline justify-between">
                  <span className="text-3xl font-light">26°</span>
                  <span className="text-[11px] text-cyan-200">Sunny</span>
                </div>
                <div className="text-[10px] text-white/50 flex justify-between">
                  <span>H: 28° L: 19°</span>
                  <span>Rain: 0%</span>
                </div>
              </div>
            </div>

            {/* WIDGET 2: TECNO SPARK Go 2024 Hardware Health & RAM */}
            <div 
              onClick={() => onLaunchApp('booster')}
              className="p-3.5 rounded-2xl bg-black/30 backdrop-blur-xl border border-teal-500/20 shadow-lg text-white cursor-pointer hover:border-teal-400/40 transition"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-teal-400" />
                  <span className="text-xs font-semibold text-white">TECNO SPARK Go 2024 Engine</span>
                </div>
                <span className="text-[10px] font-mono bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full border border-teal-500/30">
                  Unisoc T606 • 90Hz
                </span>
              </div>

              {/* RAM & Battery dual gauges */}
              <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] text-white/70 mb-1">
                    <span>RAM: 3GB + 3GB Fusion</span>
                    <span className="text-teal-300 font-mono">1.2 GB Free</span>
                  </div>
                  <div className="w-full bg-white/15 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-teal-400 to-emerald-400 h-full w-[60%] rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-white/70 mb-1">
                    <span>Battery (5000 mAh)</span>
                    <span className="text-teal-300 font-mono">{systemState.batteryLevel}%</span>
                  </div>
                  <div className="w-full bg-white/15 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-400 to-teal-400 h-full w-[84%] rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* WIDGET 3: Fitness / Activity Rings */}
            <div className="p-3 rounded-2xl bg-black/25 backdrop-blur-xl border border-white/10 shadow-sm text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-emerald-400/80 flex items-center justify-center text-emerald-400 font-bold text-xs bg-emerald-500/10">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Daily Spark Activity</p>
                  <p className="text-[11px] text-white/60">6,420 / 10,000 steps • 340 kcal</p>
                </div>
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold">64%</span>
            </div>

            {/* WIDGET 4: AI Voice Assistant Quick Action Card */}
            <div 
              onClick={onOpenVoiceAgent}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-teal-950/60 via-slate-900 to-cyan-950/60 border border-teal-500/30 text-white flex items-center justify-between cursor-pointer hover:border-teal-400/60 transition group shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-500 text-slate-950 flex items-center justify-center shadow-md group-hover:scale-105 transition">
                  <Mic className="w-5 h-5 text-slate-950" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white flex items-center gap-1.5">
                    MAY AI Voice Agent <Sparkles className="w-3 h-3 text-teal-400" />
                  </p>
                  <p className="text-[11px] text-teal-200/90">
                    Control everything by voice • Say "Lock phone" or open apps
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-1 rounded-full group-hover:bg-teal-500 group-hover:text-slate-950 transition font-bold">
                Talk
              </span>
            </div>

            {/* Top Grid of Apps & Folders */}
            <div className="grid grid-cols-4 gap-y-4 gap-x-2 pt-1">
              {/* Quick apps on page 1 */}
              {apps.filter(a => page1AppIds.includes(a.id)).map(app => (
                <div
                  key={app.id}
                  onClick={() => onLaunchApp(app.id)}
                  className="flex flex-col items-center gap-1.5 cursor-pointer group active:scale-95 transition"
                >
                  <div className={`w-13 h-13 rounded-2xl bg-gradient-to-tr ${app.bgGradient} flex items-center justify-center text-white shadow-md shadow-black/30 group-hover:shadow-teal-500/20 transition transform group-hover:scale-105`}>
                    {renderAppIcon(app.icon, 'w-6 h-6')}
                  </div>
                  <span className="text-[11px] font-medium text-white/90 truncate max-w-[65px] text-center drop-shadow-sm">
                    {app.name}
                  </span>
                </div>
              ))}

              {/* App Folder: Tools */}
              <div
                onClick={() => setOpenFolder('tools')}
                className="flex flex-col items-center gap-1.5 cursor-pointer group active:scale-95 transition"
              >
                <div className="w-13 h-13 rounded-2xl bg-black/40 backdrop-blur-md border border-white/15 p-2 grid grid-cols-2 gap-1 items-center justify-center shadow-md">
                  <FolderArchive className="w-3.5 h-3.5 text-amber-400" />
                  <Calculator className="w-3.5 h-3.5 text-teal-400" />
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  <BookOpen className="w-3.5 h-3.5 text-orange-400" />
                </div>
                <span className="text-[11px] font-medium text-white/90 truncate max-w-[65px] text-center drop-shadow-sm">
                  Tools
                </span>
              </div>

              {/* App Folder: TECNO Tuner */}
              <div
                onClick={() => setOpenFolder('performance')}
                className="flex flex-col items-center gap-1.5 cursor-pointer group active:scale-95 transition"
              >
                <div className="w-13 h-13 rounded-2xl bg-black/40 backdrop-blur-md border border-white/15 p-2 grid grid-cols-2 gap-1 items-center justify-center shadow-md">
                  <Zap className="w-3.5 h-3.5 text-pink-400" />
                  <Settings className="w-3.5 h-3.5 text-slate-300" />
                  <Cpu className="w-3.5 h-3.5 text-teal-300" />
                  <Layers className="w-3.5 h-3.5 text-cyan-300" />
                </div>
                <span className="text-[11px] font-medium text-white/90 truncate max-w-[65px] text-center drop-shadow-sm">
                  Tuner
                </span>
              </div>

              {/* Fast APK Installer trigger icon */}
              <div
                onClick={onTriggerApkInstaller}
                className="flex flex-col items-center gap-1.5 cursor-pointer group active:scale-95 transition"
              >
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md group-hover:scale-105">
                  <FolderArchive className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-medium text-white/90 truncate max-w-[65px] text-center drop-shadow-sm">
                  APK Files
                </span>
              </div>

              {/* All Apps Drawer Shortcut icon */}
              <div
                onClick={onOpenAppDrawer}
                className="flex flex-col items-center gap-1.5 cursor-pointer group active:scale-95 transition"
              >
                <div className="w-13 h-13 rounded-2xl bg-black/35 backdrop-blur-md border border-white/20 flex items-center justify-center text-teal-300 shadow-md group-hover:scale-105">
                  <Layers className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-medium text-white/90 truncate max-w-[65px] text-center drop-shadow-sm">
                  All Apps
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* PAGE 2: Full System Grid */
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold text-white/80">Page 2 • Installed Applications</span>
              <span className="text-[11px] text-teal-400 font-mono">{page2Apps.length} Apps</span>
            </div>

            <div className="grid grid-cols-4 gap-y-4 gap-x-2">
              {page2Apps.map(app => (
                <div
                  key={app.id}
                  onClick={() => onLaunchApp(app.id)}
                  className="flex flex-col items-center gap-1.5 cursor-pointer group active:scale-95 transition"
                >
                  <div className={`w-13 h-13 rounded-2xl bg-gradient-to-tr ${app.bgGradient} flex items-center justify-center text-white shadow-md shadow-black/30 group-hover:shadow-teal-500/20 transition transform group-hover:scale-105`}>
                    {renderAppIcon(app.icon, 'w-6 h-6')}
                  </div>
                  <span className="text-[11px] font-medium text-white/90 truncate max-w-[65px] text-center drop-shadow-sm">
                    {app.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Page Dots Indicator */}
      <div className="flex items-center justify-center gap-1.5 py-1 z-10">
        <button
          onClick={() => setCurrentPage(0)}
          className={`h-1.5 rounded-full transition-all ${currentPage === 0 ? 'w-5 bg-teal-400' : 'w-1.5 bg-white/40'}`}
        />
        <button
          onClick={() => setCurrentPage(1)}
          className={`h-1.5 rounded-full transition-all ${currentPage === 1 ? 'w-5 bg-teal-400' : 'w-1.5 bg-white/40'}`}
        />
      </div>

      {/* Persistent Dock Bar */}
      <div className="z-10 mt-1 pt-2 pb-1 border-t border-white/5">
        <div className="p-2.5 rounded-3xl bg-black/40 backdrop-blur-2xl border border-white/15 shadow-2xl flex items-center justify-around">
          {dockApps.map(app => (
            <div
              key={app.id}
              onClick={() => onLaunchApp(app.id)}
              className="flex flex-col items-center cursor-pointer group active:scale-90 transition"
              title={app.name}
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${app.bgGradient} flex items-center justify-center text-white shadow-md transition group-hover:scale-105`}>
                {renderAppIcon(app.icon, 'w-5 h-5')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOLDER POPUP OVERLAY */}
      {openFolder && (
        <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md flex items-center justify-center p-6 animate-fadeIn">
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 max-w-xs w-full shadow-2xl text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-base">{foldersData[openFolder]?.name}</h3>
              <button
                onClick={() => setOpenFolder(null)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {foldersData[openFolder]?.appIds.map(appId => {
                const app = apps.find(a => a.id === appId);
                if (!app) return null;
                return (
                  <div
                    key={app.id}
                    onClick={() => {
                      setOpenFolder(null);
                      onLaunchApp(app.id);
                    }}
                    className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-95 transition"
                  >
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${app.bgGradient} flex items-center justify-center text-white shadow-md`}>
                      {renderAppIcon(app.icon, 'w-5 h-5')}
                    </div>
                    <span className="text-[10px] text-white/80 truncate max-w-[60px] text-center">
                      {app.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* HOME SCREEN EDITING MODE OVERLAY */}
      {isEditing && (
        <div className="fixed inset-0 z-40 bg-black/75 backdrop-blur-md flex flex-col justify-end p-4 animate-fadeIn">
          <div className="bg-slate-900/95 border border-slate-700 rounded-3xl p-5 shadow-2xl text-white space-y-4 max-w-sm mx-auto w-full">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="font-semibold text-sm">Home Screen Editing</h4>
                <p className="text-[11px] text-slate-400">Customize layout & aesthetics</p>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 bg-teal-500 text-slate-950 font-bold rounded-full text-xs"
              >
                Done
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-center">
              <button
                onClick={() => {
                  setIsEditing(false);
                  onOpenWallpaperSelector();
                }}
                className="p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl flex flex-col items-center gap-1.5 transition"
              >
                <Palette className="w-5 h-5 text-teal-400" />
                <span className="text-[11px] font-medium">Wallpaper</span>
              </button>

              <button
                onClick={() => {
                  setIsEditing(false);
                  onLaunchApp('settings');
                }}
                className="p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl flex flex-col items-center gap-1.5 transition"
              >
                <Sliders className="w-5 h-5 text-cyan-400" />
                <span className="text-[11px] font-medium">Settings</span>
              </button>

              <button
                onClick={() => {
                  setIsEditing(false);
                  onOpenAppDrawer();
                }}
                className="p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl flex flex-col items-center gap-1.5 transition"
              >
                <Plus className="w-5 h-5 text-amber-400" />
                <span className="text-[11px] font-medium">Widgets</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
