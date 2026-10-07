import React, { useState } from 'react';
import { 
  Search, ArrowLeft, Star, Download, Check, ShieldCheck, CheckCircle2, 
  Trash2, RefreshCw, Layers, Gamepad2, Compass, Play, Smartphone, Sparkles, X 
} from 'lucide-react';
import { AppDefinition } from '../types/os';

interface PlayStoreAppProps {
  installedApps: AppDefinition[];
  onInstallApp: (app: AppDefinition) => void;
  onUninstallApp: (appId: string) => void;
  onClose: () => void;
}

interface PlayStoreListing {
  id: string;
  name: string;
  developer: string;
  category: 'Productivity' | 'Social' | 'Music' | 'Games' | 'Utilities';
  rating: number;
  reviewsCount: string;
  downloads: string;
  sizeMb: number;
  iconBg: string;
  iconLetter: string;
  description: string;
  verified: boolean;
}

const PLAY_STORE_LISTINGS: PlayStoreListing[] = [
  {
    id: 'whatsapp',
    name: 'WhatsApp Messenger',
    developer: 'WhatsApp LLC',
    category: 'Social',
    rating: 4.3,
    reviewsCount: '190M',
    downloads: '5B+',
    sizeMb: 34.2,
    iconBg: 'from-emerald-500 to-green-600',
    iconLetter: 'W',
    description: 'Simple. Reliable. Private. Messaging and video calling across smartphones worldwide.',
    verified: true,
  },
  {
    id: 'youtube',
    name: 'YouTube',
    developer: 'Google LLC',
    category: 'Social',
    rating: 4.1,
    reviewsCount: '150M',
    downloads: '10B+',
    sizeMb: 42.0,
    iconBg: 'from-red-600 to-rose-700',
    iconLetter: 'Y',
    description: 'Get the official YouTube app on Android. See what the world is watching in music, gaming, news, and more.',
    verified: true,
  },
  {
    id: 'subwaysurfers',
    name: 'Subway Surfers',
    developer: 'SYBO Games',
    category: 'Games',
    rating: 4.6,
    reviewsCount: '40M',
    downloads: '1B+',
    sizeMb: 89.5,
    iconBg: 'from-amber-500 to-orange-600',
    iconLetter: 'S',
    description: 'DASH as fast as you can! DODGE the oncoming trains! Help Jake escape from the grumpy Inspector.',
    verified: true,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    developer: 'Instagram',
    category: 'Social',
    rating: 4.0,
    reviewsCount: '160M',
    downloads: '5B+',
    sizeMb: 52.1,
    iconBg: 'from-pink-600 via-purple-600 to-amber-500',
    iconLetter: 'I',
    description: 'Connect with friends, share photos and reels, and see what is new from others all over the globe.',
    verified: true,
  },
  {
    id: 'googlemaps',
    name: 'Google Maps',
    developer: 'Google LLC',
    category: 'Utilities',
    rating: 4.4,
    reviewsCount: '180M',
    downloads: '10B+',
    sizeMb: 36.8,
    iconBg: 'from-blue-500 via-green-500 to-amber-500',
    iconLetter: 'M',
    description: 'Navigate your world faster and easier with real-time GPS navigation, traffic, transit, and local reviews.',
    verified: true,
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    developer: 'TikTok Pte. Ltd.',
    category: 'Social',
    rating: 4.4,
    reviewsCount: '98M',
    downloads: '1B+',
    sizeMb: 76.0,
    iconBg: 'from-slate-900 via-cyan-900 to-pink-900',
    iconLetter: 'T',
    description: 'TikTok is THE destination for short-form video. Watch and create endless personalized video feeds.',
    verified: true,
  },
];

export const PlayStoreApp: React.FC<PlayStoreAppProps> = ({
  installedApps,
  onInstallApp,
  onUninstallApp,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'foryou' | 'topcharts' | 'categories'>('foryou');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListing, setSelectedListing] = useState<PlayStoreListing | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const isInstalled = (id: string) => installedApps.some(a => a.id === id);

  const handleInstall = (listing: PlayStoreListing) => {
    setDownloadingId(listing.id);
    setDownloadProgress(10);

    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          setTimeout(() => {
            const newApp: AppDefinition = {
              id: listing.id,
              name: listing.name,
              icon: listing.iconLetter,
              category: listing.category,
              color: '#0284c7',
              bgGradient: listing.iconBg,
              sizeMb: listing.sizeMb,
              isSystem: false,
              isInstalled: true,
              developer: listing.developer,
              description: listing.description,
              storageUsageMb: listing.sizeMb * 1.3,
            };
            onInstallApp(newApp);
            setDownloadingId(null);
            setDownloadProgress(0);
          }, 350);
          return 100;
        }
        return prev + 25;
      });
    }, 220);
  };

  const filteredListings = PLAY_STORE_LISTINGS.filter(app => {
    return app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.developer.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="relative w-full h-full bg-slate-950 text-white flex flex-col font-sans select-none animate-fadeIn">
      {/* Google Play Store Top Bar */}
      <div className="p-3.5 border-b border-slate-800 bg-slate-900/95 flex flex-col gap-2.5">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Google Play search pill */}
          <div className="flex-1 bg-slate-800/80 rounded-full px-3.5 py-1.5 flex items-center gap-2 border border-slate-700/60">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search apps & games"
              className="bg-transparent flex-1 text-xs text-white placeholder-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold shadow-sm">
            G
          </div>
        </div>

        {/* Tab Strip */}
        <div className="flex gap-4 text-xs border-b border-slate-800/60 pb-1 px-1">
          <button
            onClick={() => setActiveTab('foryou')}
            className={`pb-1 font-medium transition ${
              activeTab === 'foryou'
                ? 'text-teal-400 border-b-2 border-teal-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            For you
          </button>
          <button
            onClick={() => setActiveTab('topcharts')}
            className={`pb-1 font-medium transition ${
              activeTab === 'topcharts'
                ? 'text-teal-400 border-b-2 border-teal-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Top charts
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`pb-1 font-medium transition ${
              activeTab === 'categories'
                ? 'text-teal-400 border-b-2 border-teal-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Categories
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {selectedListing ? (
          /* APP DETAILS VIEW */
          <div className="space-y-4 animate-fadeIn">
            <button
              onClick={() => setSelectedListing(null)}
              className="text-xs text-teal-400 hover:underline flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to listings
            </button>

            <div className="flex items-start gap-3.5">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${selectedListing.iconBg} flex items-center justify-center text-white text-2xl font-black shadow-lg`}>
                {selectedListing.iconLetter}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base text-white truncate">{selectedListing.name}</h3>
                <p className="text-xs text-teal-400 font-medium">{selectedListing.developer}</p>
                <p className="text-[11px] text-slate-400">{selectedListing.category} • In-app purchases</p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800 text-center text-xs">
              <div>
                <span className="font-bold text-white flex items-center justify-center gap-1">
                  {selectedListing.rating} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                </span>
                <span className="text-[10px] text-slate-400">{selectedListing.reviewsCount} reviews</span>
              </div>
              <div className="border-x border-slate-800">
                <span className="font-bold text-white">{selectedListing.sizeMb} MB</span>
                <span className="text-[10px] text-slate-400">Download size</span>
              </div>
              <div>
                <span className="font-bold text-white">{selectedListing.downloads}</span>
                <span className="text-[10px] text-slate-400">Downloads</span>
              </div>
            </div>

            {/* Install / Uninstall Button */}
            <div>
              {downloadingId === selectedListing.id ? (
                <div className="space-y-1.5 bg-slate-900 p-3 rounded-xl border border-teal-500/30">
                  <div className="flex justify-between text-xs text-teal-300">
                    <span>Installing on TECNO SPARK Go...</span>
                    <span>{downloadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-teal-400 h-full transition-all duration-200"
                      style={{ width: `${downloadProgress}%` }}
                    />
                  </div>
                </div>
              ) : isInstalled(selectedListing.id) ? (
                <div className="flex gap-2">
                  <div className="flex-1 py-2.5 rounded-xl bg-teal-500/20 text-teal-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-teal-500/40">
                    <CheckCircle2 className="w-4 h-4" /> Installed on Device
                  </div>
                  <button
                    onClick={() => onUninstallApp(selectedListing.id)}
                    className="px-4 py-2.5 rounded-xl bg-rose-500/20 text-rose-300 text-xs font-semibold hover:bg-rose-500/30 border border-rose-500/30 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleInstall(selectedListing)}
                  className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Install Application ({selectedListing.sizeMb} MB)
                </button>
              )}
            </div>

            {/* Play Protect Shield */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Verified by Google Play Protect • Safe on Unisoc T606</span>
            </div>

            {/* About */}
            <div className="space-y-1.5 text-xs text-slate-300">
              <h4 className="font-semibold text-white">About this app</h4>
              <p className="leading-relaxed">{selectedListing.description}</p>
            </div>
          </div>
        ) : (
          /* APPS LISTING */
          <div className="space-y-4">
            {/* Top Suggested Banner */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-teal-950/60 border border-teal-500/25 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full">
                  Official Android Store
                </span>
                <h3 className="font-bold text-sm text-white mt-1">Google Play Certified</h3>
                <p className="text-[11px] text-slate-400">TECNO SPARK Go 2024 Compatible</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500 via-teal-400 to-emerald-400 flex items-center justify-center font-black text-slate-950 text-base shadow-md">
                ▶
              </div>
            </div>

            {/* Listing Grid */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Top Free Applications</span>
                <span>{filteredListings.length} apps</span>
              </div>

              {filteredListings.map(app => {
                const installed = isInstalled(app.id);
                const isDownloading = downloadingId === app.id;

                return (
                  <div
                    key={app.id}
                    onClick={() => setSelectedListing(app)}
                    className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/90 hover:border-teal-500/40 flex items-center justify-between gap-3 cursor-pointer transition hover:bg-slate-900"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${app.iconBg} flex items-center justify-center text-white font-black text-lg flex-shrink-0 shadow-md`}>
                        {app.iconLetter}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-xs text-white truncate">{app.name}</h4>
                        <p className="text-[11px] text-slate-400 truncate">{app.developer}</p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                          <span className="flex items-center gap-0.5 text-amber-400 font-semibold">
                            ★ {app.rating}
                          </span>
                          <span>•</span>
                          <span>{app.sizeMb} MB</span>
                        </div>
                      </div>
                    </div>

                    <div onClick={(e) => e.stopPropagation()}>
                      {isDownloading ? (
                        <RefreshCw className="w-4 h-4 text-teal-400 animate-spin" />
                      ) : installed ? (
                        <span className="text-xs text-teal-300 font-semibold px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20">
                          Installed
                        </span>
                      ) : (
                        <button
                          onClick={() => handleInstall(app)}
                          className="px-3.5 py-1.5 rounded-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition shadow-sm"
                        >
                          Install
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
