import React, { useState } from 'react';
import { 
  Search, X, Info, Trash2, Shield, HardDrive, ArrowLeft, Layers, Check, 
  Phone, MessageSquare, Camera, Image as ImageIcon, ShoppingBag, Settings, 
  FolderArchive, Zap, Clock, Calculator, Music2, BookOpen, Compass, Trophy, 
  Clock4, Activity, Flame, Disc3, Film, Gamepad2, Send, Swords, Sparkles, Filter, Play
} from 'lucide-react';
import { AppDefinition } from '../types/os';

interface AppLibraryProps {
  apps: AppDefinition[];
  onLaunchApp: (appId: string) => void;
  onUninstallApp: (appId: string) => void;
  onClose: () => void;
}

export const AppLibrary: React.FC<AppLibraryProps> = ({
  apps,
  onLaunchApp,
  onUninstallApp,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [inspectingApp, setInspectingApp] = useState<AppDefinition | null>(null);

  const categories = ['All', 'System', 'Utilities', 'Productivity', 'Sports', 'Music', 'Games'];

  const renderIcon = (iconName: string, className = 'w-6 h-6') => {
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

  const filteredApps = apps
    .filter(app => {
      const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === 'All' || app.category === selectedCategory;
      return matchesSearch && matchesCat;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="relative w-full h-full bg-slate-950/95 backdrop-blur-3xl text-white flex flex-col font-sans select-none animate-slideUp">
      {/* Top App Drawer Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/60 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="font-bold text-lg text-white">App Library</h2>
          </div>
          <span className="text-xs font-mono text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full">
            {filteredApps.length} Apps
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search installed applications..."
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-9 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Categories scrollbar */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-[11px] whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Grid / Alphabetical list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredApps.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center text-slate-400 space-y-2">
            <Layers className="w-8 h-8 text-slate-600" />
            <p className="text-xs">No applications match "{searchQuery}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-y-4 gap-x-2">
            {filteredApps.map(app => (
              <div
                key={app.id}
                className="flex flex-col items-center gap-1.5 cursor-pointer group relative"
                onClick={() => {
                  onLaunchApp(app.id);
                  onClose();
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setInspectingApp(app);
                }}
              >
                <div className={`w-13 h-13 rounded-2xl bg-gradient-to-tr ${app.bgGradient} flex items-center justify-center text-white shadow-md shadow-black/40 group-hover:scale-105 transition transform active:scale-95 relative`}>
                  {renderIcon(app.icon, 'w-6 h-6')}
                  {/* Long press info indicator */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setInspectingApp(app);
                    }}
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-slate-950/80 border border-slate-700 flex items-center justify-center text-[9px] text-slate-300 hover:text-teal-400 transition"
                    title="App Info"
                  >
                    i
                  </button>
                </div>
                <span className="text-[11px] font-medium text-slate-200 truncate max-w-[68px] text-center">
                  {app.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* APP INSPECTION / INFO DIALOG */}
      {inspectingApp && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-5 max-w-sm w-full shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${inspectingApp.bgGradient} flex items-center justify-center text-white shadow-md`}>
                  {renderIcon(inspectingApp.icon, 'w-6 h-6')}
                </div>
                <div>
                  <h4 className="font-bold text-base text-white">{inspectingApp.name}</h4>
                  <p className="text-xs text-slate-400">{inspectingApp.developer || 'MAYUI Core'} • v{inspectingApp.version || '2.6'}</p>
                </div>
              </div>
              <button
                onClick={() => setInspectingApp(null)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-800/60 rounded-xl p-3 space-y-2 border border-slate-700/50">
                <div className="flex justify-between text-slate-300">
                  <span className="flex items-center gap-1.5"><HardDrive className="w-3.5 h-3.5 text-teal-400" /> Storage Usage</span>
                  <span className="font-mono text-white">{inspectingApp.storageUsageMb || inspectingApp.sizeMb} MB</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-cyan-400" /> Security Status</span>
                  <span className="text-teal-300">Sandboxed & Safe</span>
                </div>
              </div>

              <div>
                <p className="text-slate-400 font-semibold mb-1 text-[11px] uppercase tracking-wide">Permissions Granted:</p>
                <div className="flex flex-wrap gap-1">
                  {(inspectingApp.permissions || ['Standard Sandboxing']).map((perm, idx) => (
                    <span key={idx} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px]">
                      {perm}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-[11px] text-slate-400">
                {inspectingApp.description || 'Pre-installed application optimized for TECNO SPARK Go 2024.'}
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  const id = inspectingApp.id;
                  setInspectingApp(null);
                  onLaunchApp(id);
                  onClose();
                }}
                className="flex-1 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition"
              >
                Open App
              </button>
              {!inspectingApp.isSystem && (
                <button
                  onClick={() => {
                    onUninstallApp(inspectingApp.id);
                    setInspectingApp(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-semibold text-xs border border-rose-500/30 flex items-center gap-1.5 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Uninstall
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
