import React, { useState } from 'react';
import { 
  FolderArchive, ArrowLeft, ShieldAlert, ShieldCheck, CheckCircle2, 
  Download, FileCheck, X, HardDrive, RefreshCw, Send, Swords, Film, 
  ExternalLink, Terminal, AlertTriangle
} from 'lucide-react';
import { ApkPackage, AppDefinition } from '../types/os';
import { SAMPLE_APK_PACKAGES } from '../data/systemData';

interface ApkInstallerProps {
  onInstallApk: (app: AppDefinition) => void;
  onLaunchApp: (appId: string) => void;
  onClose: () => void;
}

export const ApkInstaller: React.FC<ApkInstallerProps> = ({
  onInstallApk,
  onLaunchApp,
  onClose,
}) => {
  const [currentFolder, setCurrentFolder] = useState<'downloads' | 'installer'>('downloads');
  const [selectedApk, setSelectedApk] = useState<ApkPackage | null>(null);
  const [installStatus, setInstallStatus] = useState<'idle' | 'warning' | 'installing' | 'completed'>('idle');
  const [progress, setProgress] = useState<number>(0);
  const [newAppId, setNewAppId] = useState<string>('');

  const renderApkIcon = (icon: string) => {
    switch (icon) {
      case 'Send': return <Send className="w-6 h-6 text-sky-400" />;
      case 'Swords': return <Swords className="w-6 h-6 text-rose-400" />;
      case 'Film': return <Film className="w-6 h-6 text-orange-400" />;
      default: return <FolderArchive className="w-6 h-6 text-teal-400" />;
    }
  };

  const handleStartInstall = (apk: ApkPackage) => {
    setSelectedApk(apk);
    setInstallStatus('warning');
  };

  const handleConfirmInstall = () => {
    if (!selectedApk) return;
    setInstallStatus('installing');
    setProgress(15);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          setTimeout(() => {
            const installedAppDef: AppDefinition = {
              id: selectedApk.id.replace('apk-', 'custom-'),
              name: selectedApk.appName,
              icon: selectedApk.icon,
              category: 'Utilities',
              color: selectedApk.iconColor,
              bgGradient: 'from-slate-700 to-slate-900',
              sizeMb: selectedApk.sizeMb,
              isSystem: false,
              isInstalled: true,
              version: selectedApk.version,
              developer: selectedApk.developer,
              description: `Sideloaded APK package (${selectedApk.fileName}) installed via MAYUI Native Package Installer.`,
              permissions: selectedApk.permissions,
              storageUsageMb: selectedApk.sizeMb * 1.5,
            };

            onInstallApk(installedAppDef);
            setNewAppId(installedAppDef.id);
            setInstallStatus('completed');
          }, 450);
          return 100;
        }
        return prev + 25;
      });
    }, 280);
  };

  return (
    <div className="relative w-full h-full bg-slate-950 text-white flex flex-col font-sans select-none animate-fadeIn">
      {/* File Explorer Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-bold text-base text-white">Files • Downloads</h2>
            <p className="text-[11px] text-slate-400">/storage/emulated/0/Download/</p>
          </div>
        </div>
        <span className="text-[11px] font-mono bg-teal-500/10 text-teal-300 border border-teal-500/20 px-2 py-0.5 rounded-full">
          Package Manager
        </span>
      </div>

      {/* Main Files View: Downloads containing APKs */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3 flex items-center justify-between text-xs text-slate-300">
          <span className="flex items-center gap-1.5">
            <HardDrive className="w-4 h-4 text-teal-400" /> Sideload Directory
          </span>
          <span className="text-slate-400 font-mono">3 Packages Found</span>
        </div>

        <div className="space-y-2.5">
          {SAMPLE_APK_PACKAGES.map(apk => (
            <div
              key={apk.id}
              onClick={() => handleStartInstall(apk)}
              className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/90 hover:border-teal-500/40 flex items-center justify-between gap-3 cursor-pointer transition hover:bg-slate-900 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0">
                  {renderApkIcon(apk.icon)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm text-white truncate">{apk.appName}</h4>
                    <span className="text-[10px] bg-teal-500/15 text-teal-300 border border-teal-500/30 px-1.5 py-0.2 rounded font-mono">
                      APK
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">{apk.fileName}</p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5 font-mono">
                    <span>{apk.sizeMb} MB</span>
                    <span>•</span>
                    <span>v{apk.version}</span>
                    <span>•</span>
                    <span>{apk.downloadDate}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartInstall(apk);
                }}
                className="px-3 py-1.5 rounded-lg bg-teal-500/20 hover:bg-teal-500 text-teal-300 hover:text-slate-950 font-bold text-xs transition border border-teal-500/30"
              >
                Install
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* APK SECURITY CONFIRMATION & INSTALL DIALOG */}
      {selectedApk && installStatus !== 'idle' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-white space-y-4">
            {/* STAGE 1: SECURITY WARNING */}
            {installStatus === 'warning' && (
              <>
                <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                    {renderApkIcon(selectedApk.icon)}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">{selectedApk.appName}</h3>
                    <p className="text-xs text-slate-400">{selectedApk.developer}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{selectedApk.sizeMb} MB • v{selectedApk.version}</p>
                  </div>
                </div>

                {/* Explicit Security Warning from brief */}
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-semibold text-amber-300">
                    <ShieldAlert className="w-4 h-4" /> Security Notice
                  </div>
                  <p className="leading-relaxed">
                    "This application was downloaded outside MAY Store. Only install APK files from sources you trust."
                  </p>
                </div>

                {/* Permissions Breakdown */}
                <div className="space-y-1.5 text-xs">
                  <span className="font-semibold text-slate-300">Requested Permissions:</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedApk.permissions.map((p, idx) => (
                      <span key={idx} className="bg-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-300">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      setInstallStatus('idle');
                      setSelectedApk(null);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmInstall}
                    className="flex-1 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-teal-500/20"
                  >
                    Install Package
                  </button>
                </div>
              </>
            )}

            {/* STAGE 2: INSTALLING PROGRESS */}
            {installStatus === 'installing' && (
              <div className="py-6 flex flex-col items-center justify-center space-y-4 text-center">
                <RefreshCw className="w-8 h-8 text-teal-400 animate-spin" />
                <div>
                  <h4 className="font-bold text-base text-white">Installing {selectedApk.appName}...</h4>
                  <p className="text-xs text-slate-400">Verifying signature & sandboxing permissions</p>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-teal-400 h-full transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-teal-400">{progress}%</span>
              </div>
            )}

            {/* STAGE 3: INSTALLED SUCCESS */}
            {installStatus === 'completed' && (
              <>
                <div className="flex flex-col items-center justify-center py-3 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="font-bold text-base text-white">App installed successfully.</h4>
                  <p className="text-xs text-slate-300">
                    {selectedApk.appName} has been registered and added to your MAYUI App Library.
                  </p>
                </div>

                <div className="flex gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setInstallStatus('idle');
                      setSelectedApk(null);
                      onClose();
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition"
                  >
                    Done
                  </button>
                  <button
                    onClick={() => {
                      setInstallStatus('idle');
                      setSelectedApk(null);
                      onClose();
                      onLaunchApp(newAppId);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition"
                  >
                    Open
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
