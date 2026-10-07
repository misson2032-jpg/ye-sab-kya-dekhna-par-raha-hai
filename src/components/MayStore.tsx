import React, { useState } from 'react';
import { 
  Search, ArrowLeft, Star, Download, Check, ShieldCheck, HardDrive, RefreshCw, 
  Trash2, ExternalLink, Trophy, Clock4, Activity, Flame, Disc3, Film, Gamepad2, 
  Layers, ChevronRight, CheckCircle2, AlertCircle
} from 'lucide-react';
import { AppDefinition } from '../types/os';
import { STORE_CATALOG } from '../data/systemData';

interface MayStoreProps {
  installedApps: AppDefinition[];
  onInstallApp: (app: AppDefinition) => void;
  onUninstallApp: (appId: string) => void;
  onClose: () => void;
}

export const MayStore: React.FC<MayStoreProps> = ({
  installedApps,
  onInstallApp,
  onUninstallApp,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'featured' | 'categories' | 'installed'>('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<AppDefinition | null>(null);
  const [downloadingAppId, setDownloadingAppId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);

  const categories = ['All', 'Sports', 'Fitness', 'Productivity', 'Music', 'Games', 'Utilities'];

  const renderIcon = (iconName: string, className = 'w-6 h-6') => {
    switch (iconName) {
      case 'Trophy': return <Trophy className={className} />;
      case 'Clock4': return <Clock4 className={className} />;
      case 'Activity': return <Activity className={className} />;
      case 'Flame': return <Flame className={className} />;
      case 'Disc3': return <Disc3 className={className} />;
      case 'Film': return <Film className={className} />;
      case 'Gamepad2': return <Gamepad2 className={className} />;
      default: return <Layers className={className} />;
    }
  };

  const handleInstallClick = (app: AppDefinition) => {
    setDownloadingAppId(app.id);
    setDownloadProgress(10);

    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          setTimeout(() => {
            onInstallApp({
              ...app,
              isInstalled: true,
              storageUsageMb: app.sizeMb * 1.4,
            });
            setDownloadingAppId(null);
            setDownloadProgress(0);
          }, 400);
          return 100;
        }
        return prev + 25;
      });
    }, 250);
  };

  const isAppInstalled = (appId: string) => {
    return installedApps.some(a => a.id === appId);
  };

  const filteredCatalog = STORE_CATALOG.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.developer?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="relative w-full h-full bg-slate-950 text-white flex flex-col font-sans select-none animate-fadeIn">
      {/* Store Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-teal-500 text-slate-950 font-black flex items-center justify-center text-xs">
                M
              </span>
              <h2 className="font-bold text-base text-white">MAY Store</h2>
            </div>
          </div>
          <span className="text-[11px] font-mono text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full">
            TECNO Spark Verified
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search verified apps, games, tools..."
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 transition"
          />
        </div>

        {/* Sub Tabs */}
        <div className="flex gap-2 text-xs border-b border-slate-800/60 pb-1">
          <button
            onClick={() => setActiveTab('featured')}
            className={`pb-1.5 font-medium transition ${
              activeTab === 'featured'
                ? 'text-teal-400 border-b-2 border-teal-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Featured
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`pb-1.5 font-medium transition ${
              activeTab === 'categories'
                ? 'text-teal-400 border-b-2 border-teal-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab('installed')}
            className={`pb-1.5 font-medium transition ${
              activeTab === 'installed'
                ? 'text-teal-400 border-b-2 border-teal-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Manage Apps ({installedApps.length})
          </button>
        </div>
      </div>

      {/* Main Catalog View */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {selectedApp ? (
          /* DETAILED APP VIEW */
          <div className="space-y-4 animate-fadeIn">
            <button
              onClick={() => setSelectedApp(null)}
              className="text-xs text-teal-400 hover:underline flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Store
            </button>

            {/* App Header Banner */}
            <div className="flex items-start gap-4">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${selectedApp.bgGradient} flex items-center justify-center text-white shadow-lg`}>
                {renderIcon(selectedApp.icon, 'w-8 h-8')}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">{selectedApp.name}</h3>
                <p className="text-xs text-slate-400">{selectedApp.developer}</p>
                <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                  <span className="flex items-center gap-1 text-amber-400 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {selectedApp.rating || '4.7'}
                  </span>
                  <span>•</span>
                  <span>{selectedApp.sizeMb} MB</span>
                  <span>•</span>
                  <span className="text-teal-400 font-mono">v{selectedApp.version || '1.0'}</span>
                </div>
              </div>
            </div>

            {/* Install / Uninstall Button */}
            <div>
              {downloadingAppId === selectedApp.id ? (
                <div className="w-full bg-slate-800 rounded-xl p-3 border border-teal-500/30 space-y-1.5">
                  <div className="flex justify-between text-xs text-teal-300">
                    <span>Downloading & Verifying...</span>
                    <span>{downloadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-teal-400 h-full transition-all duration-200"
                      style={{ width: `${downloadProgress}%` }}
                    />
                  </div>
                </div>
              ) : isAppInstalled(selectedApp.id) ? (
                <div className="flex gap-2">
                  <div className="flex-1 py-2.5 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-300 font-bold text-xs flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Installed on TECNO
                  </div>
                  <button
                    onClick={() => {
                      onUninstallApp(selectedApp.id);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-rose-500/20 text-rose-300 text-xs font-semibold hover:bg-rose-500/30 transition flex items-center gap-1 border border-rose-500/30"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleInstallClick(selectedApp)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 transition"
                >
                  <Download className="w-4 h-4" /> Install Application ({selectedApp.sizeMb} MB)
                </button>
              )}
            </div>

            {/* Hardware badge */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-teal-400 flex-shrink-0" />
              <span>Optimized for Unisoc T606 GPU & 90Hz HD+ display. Sandbox verified.</span>
            </div>

            {/* Description */}
            <div className="space-y-1.5 text-xs">
              <h4 className="font-semibold text-white">About this application</h4>
              <p className="text-slate-300 leading-relaxed">
                {selectedApp.description}
              </p>
            </div>

            {/* Permissions */}
            <div className="space-y-1.5 text-xs">
              <h4 className="font-semibold text-white">Permissions Requested</h4>
              <div className="flex flex-wrap gap-1.5">
                {(selectedApp.permissions || ['Internet', 'Storage']).map((perm, idx) => (
                  <span key={idx} className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded text-[11px]">
                    {perm}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* CATALOG LISTING */
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Verified Flagship Ecosystem Apps</span>
              <span>{filteredCatalog.length} available</span>
            </div>

            {filteredCatalog.map(app => {
              const installed = isAppInstalled(app.id);
              const isDownloading = downloadingAppId === app.id;

              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between gap-3 cursor-pointer transition hover:bg-slate-900"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${app.bgGradient} flex items-center justify-center text-white flex-shrink-0 shadow-md`}>
                      {renderIcon(app.icon, 'w-6 h-6')}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-sm text-white truncate">{app.name}</h4>
                      <p className="text-xs text-slate-400 truncate">{app.category} • {app.developer}</p>
                      <div className="flex items-center gap-2 text-[11px] text-amber-400 mt-0.5">
                        <span className="flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-amber-400" /> {app.rating}
                        </span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400">{app.sizeMb} MB</span>
                      </div>
                    </div>
                  </div>

                  <div onClick={(e) => e.stopPropagation()}>
                    {isDownloading ? (
                      <div className="w-16 text-right">
                        <RefreshCw className="w-4 h-4 text-teal-400 animate-spin inline" />
                      </div>
                    ) : installed ? (
                      <span className="text-xs text-teal-400 font-medium px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20">
                        Installed
                      </span>
                    ) : (
                      <button
                        onClick={() => handleInstallClick(app)}
                        className="px-3.5 py-1.5 rounded-full bg-slate-800 hover:bg-teal-500 hover:text-slate-950 text-teal-300 text-xs font-semibold border border-slate-700 transition"
                      >
                        Get
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
