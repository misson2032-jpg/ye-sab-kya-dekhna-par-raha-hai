/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Download, Sparkles, Smartphone, Power, RefreshCw, 
  ShieldCheck, Zap, Layers, Bell, Sliders, CheckCircle2, 
  ExternalLink, Copy, HelpCircle 
} from 'lucide-react';
import { SystemState, AppDefinition, UIMode } from './types/os';
import { INITIAL_APPS, INITIAL_NOTIFICATIONS, WALLPAPERS } from './data/systemData';
import { PhoneFrame } from './components/PhoneFrame';
import { LockScreen } from './components/LockScreen';
import { HomeScreen } from './components/HomeScreen';
import { AppLibrary } from './components/AppLibrary';
import { MayStore } from './components/MayStore';
import { ApkInstaller } from './components/ApkInstaller';
import { QuickPanel } from './components/QuickPanel';
import { NotificationCenter } from './components/NotificationCenter';
import { Multitasking } from './components/Multitasking';
import { SettingsApp } from './components/SettingsApp';
import { TecnoHiosMode } from './components/TecnoHiosMode';
import { DownloadModal } from './components/DownloadModal';
import { VoiceAgentOverlay } from './components/VoiceAgentOverlay';
import { PlayStoreApp } from './components/PlayStoreApp';
import { WallpaperPickerModal } from './components/WallpaperPickerModal';
import { VoiceCommandResult } from './types/os';

// Interactive App Windows
import { BoosterApp } from './components/Apps/BoosterApp';
import { CameraApp } from './components/Apps/CameraApp';
import { CalculatorApp } from './components/Apps/CalculatorApp';
import { Mic, Palette } from 'lucide-react';

export default function App() {
  // Master Operating System State
  const [systemState, setSystemState] = useState<SystemState>({
    uiMode: 'mayui',
    isLocked: false,
    activeAppId: null,
    recentApps: ['settings', 'booster', 'maystore'],
    isQuickPanelOpen: false,
    isNotificationsOpen: false,
    isAppDrawerOpen: false,
    isMultitaskingOpen: false,
    isHomeScreenEditMode: false,
    currentHomeScreenPage: 0,
    
    // Voice AI Agent State & Code Word
    isVoiceAgentOpen: false,
    voiceSecretCodeWord: 'open sesame',
    voiceFeedbackSpeechEnabled: true,
    lastVoiceCommand: null,
    lastVoiceFeedback: null,
    
    wifi: true,
    bluetooth: true,
    mobileData: true,
    airplaneMode: false,
    flashlight: false,
    location: true,
    hotspot: false,
    screenRecording: false,
    doNotDisturb: false,
    darkMode: true,
    autoRotate: true,
    batterySaver: false,
    nfc: false,
    
    brightness: 85,
    volume: 70,
    
    performanceMode: 'balanced',
    refreshRate: '90hz',
    reduceAnimations: false,
    navigationMode: 'gestures',
    accentColor: '#14b8a6',
    wallpaperId: 'neon-horizon',
    
    batteryLevel: 84,
    isCharging: false,
    ramUsedMb: 1680,
    ramTotalMb: 3072,
    storageUsedGb: 19.4,
    storageTotalGb: 64,
    
    cameraActive: false,
    micActive: false,
    locationActive: true,

    // Specular Glass Mirror Effect
    mirrorEffect: true,
  });

  const [apps, setApps] = useState<AppDefinition[]>(INITIAL_APPS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isWallpaperPickerOpen, setIsWallpaperPickerOpen] = useState(false);
  const [isSwitchingTransition, setIsSwitchingTransition] = useState<string | null>(null);

  // Partial update helper
  const updateSystem = (updates: Partial<SystemState>) => {
    setSystemState(prev => ({ ...prev, ...updates }));
  };

  // Switch between MAYUI and TECNO HiOS
  const handleSwitchUIMode = (targetMode: UIMode) => {
    const message = targetMode === 'hios' ? 'Switching to TECNO HiOS...' : 'Switching to MAYUI 2.6 (90Hz)...';
    setIsSwitchingTransition(message);

    setTimeout(() => {
      setSystemState(prev => ({
        ...prev,
        uiMode: targetMode,
        activeAppId: null,
        isAppDrawerOpen: false,
        isQuickPanelOpen: false,
        isNotificationsOpen: false,
        isMultitaskingOpen: false,
      }));
      setIsSwitchingTransition(null);
    }, 750);
  };

  // Handle AI Voice Agent executed commands
  const handleExecuteVoiceCommand = (result: VoiceCommandResult) => {
    updateSystem({
      lastVoiceCommand: result.action,
      lastVoiceFeedback: result.spokenFeedback,
      isVoiceAgentOpen: false,
    });

    switch (result.action) {
      case 'unlock':
        updateSystem({ isLocked: false, activeAppId: null });
        break;
      case 'lock':
        updateSystem({
          isLocked: true,
          activeAppId: null,
          isQuickPanelOpen: false,
          isNotificationsOpen: false,
          isAppDrawerOpen: false,
          isMultitaskingOpen: false,
        });
        break;
      case 'launch_app':
        if (result.appId) {
          updateSystem({ isLocked: false });
          handleLaunchApp(result.appId);
        }
        break;
      case 'toggle_flashlight':
        updateSystem({ flashlight: result.state ?? !systemState.flashlight });
        break;
      case 'toggle_wifi':
        updateSystem({ wifi: result.state ?? !systemState.wifi });
        break;
      case 'toggle_bluetooth':
        updateSystem({ bluetooth: result.state ?? !systemState.bluetooth });
        break;
      case 'toggle_battery_saver':
        updateSystem({ batterySaver: result.state ?? !systemState.batterySaver });
        break;
      case 'boost_ram':
        updateSystem({ ramUsedMb: 950 });
        break;
      case 'clean_storage':
        updateSystem({ storageUsedGb: Math.max(12, systemState.storageUsedGb - 1.8) });
        break;
      case 'switch_ui_mode':
        if (result.targetMode === 'hios' || result.targetMode === 'mayui') {
          handleSwitchUIMode(result.targetMode as UIMode);
        }
        break;
      case 'open_notifications':
        updateSystem({ isNotificationsOpen: true, isQuickPanelOpen: false });
        break;
      case 'clear_notifications':
        setNotifications([]);
        break;
      case 'open_quick_panel':
        updateSystem({ isQuickPanelOpen: true, isNotificationsOpen: false });
        break;
      case 'open_app_drawer':
        updateSystem({ isAppDrawerOpen: true });
        break;
      case 'download_apk':
        setIsDownloadModalOpen(true);
        break;
      case 'open_wallpaper_picker':
        setIsWallpaperPickerOpen(true);
        break;
      case 'toggle_mirror_effect':
        updateSystem({ mirrorEffect: !systemState.mirrorEffect });
        break;
      default:
        break;
    }
  };

  // Launch app
  const handleLaunchApp = (appId: string) => {
    // Add to recent apps if not present
    setSystemState(prev => {
      const recents = prev.recentApps.filter(id => id !== appId);
      return {
        ...prev,
        activeAppId: appId,
        recentApps: [appId, ...recents].slice(0, 8),
        isAppDrawerOpen: false,
        isQuickPanelOpen: false,
        isNotificationsOpen: false,
        isMultitaskingOpen: false,
        cameraActive: appId === 'camera',
      };
    });
  };

  // Close active app
  const handleCloseActiveApp = () => {
    setSystemState(prev => ({
      ...prev,
      activeAppId: null,
      cameraActive: false,
    }));
  };

  // Install app from MAY Store or APK
  const handleInstallApp = (newApp: AppDefinition) => {
    setApps(prev => {
      if (prev.some(a => a.id === newApp.id)) {
        return prev.map(a => a.id === newApp.id ? newApp : a);
      }
      return [newApp, ...prev];
    });

    // Add installation notification
    const newNotif = {
      id: `install-${Date.now()}`,
      appId: newApp.id,
      appName: newApp.name,
      appIcon: newApp.icon,
      appColor: newApp.color,
      title: `${newApp.name} installed`,
      message: 'Verified and added to MAYUI App Library and Home Screen.',
      time: 'Just now',
      priority: 'normal' as const,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Uninstall app
  const handleUninstallApp = (appId: string) => {
    setApps(prev => prev.filter(a => a.id !== appId));
    setSystemState(prev => ({
      ...prev,
      recentApps: prev.recentApps.filter(id => id !== appId),
      activeAppId: prev.activeAppId === appId ? null : prev.activeAppId,
    }));
  };

  // Background Wallpaper style getter
  const currentWallpaper = WALLPAPERS.find(w => w.id === systemState.wallpaperId) || WALLPAPERS[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start select-none font-sans overflow-x-hidden">
      
      {/* Top Banner & Quick Download Bar */}
      <header className="w-full bg-slate-900/90 border-b border-slate-800 backdrop-blur-md px-4 py-3 sticky top-0 z-40 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-slate-950 font-black text-lg shadow-md shadow-teal-500/20">
            M
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-sm sm:text-base text-white tracking-tight">MAYUI</h1>
              <span className="text-[10px] font-mono bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-full font-semibold">
                TECNO SPARK Go 2024 Edition
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Flagship ergonomics • 90Hz smoothness • 1-tap HiOS switcher • Clean 0-bloat OS
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          {/* AI Voice Agent Trigger */}
          <button
            onClick={() => updateSystem({ isVoiceAgentOpen: true })}
            className="px-3 py-2 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/40 text-teal-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            title="Talk to MAY Voice Agent (Say code word to unlock)"
          >
            <Mic className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
            <span className="hidden sm:inline">Voice:</span>
            <span className="font-mono text-white text-[11px]">"{systemState.voiceSecretCodeWord}"</span>
          </button>

          {/* Wallpaper & Style Button */}
          <button
            onClick={() => setIsWallpaperPickerOpen(true)}
            className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition border border-slate-700 cursor-pointer"
            title="Change Wallpaper & Themes"
          >
            <Palette className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden md:inline">Wallpapers</span>
          </button>

          {/* Specular Mirror Glass Effect Toggle */}
          <button
            onClick={() => updateSystem({ mirrorEffect: !systemState.mirrorEffect })}
            className={`px-2.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              systemState.mirrorEffect
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-400'
            }`}
            title="Toggle Specular Mirror Glass Reflection Effect"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Mirror Effect:</span>
            <span className="text-[10px] font-mono">{systemState.mirrorEffect ? 'ON' : 'OFF'}</span>
          </button>

          {/* Prominent Direct APK Download Link Button */}
          <button
            onClick={() => setIsDownloadModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 flex items-center gap-1.5 transition transform active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download APK</span>
          </button>

          {/* Quick UI Mode Switcher */}
          <button
            onClick={() => handleSwitchUIMode(systemState.uiMode === 'mayui' ? 'hios' : 'mayui')}
            className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-700 cursor-pointer"
            title="Switch between MAYUI and TECNO HiOS"
          >
            <RefreshCw className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden md:inline">Mode:</span>
            <span className="text-teal-300 font-mono">
              {systemState.uiMode === 'mayui' ? 'MAYUI' : 'HiOS'}
            </span>
          </button>

          {/* Lock / Unlock Toggle */}
          <button
            onClick={() => updateSystem({ isLocked: !systemState.isLocked })}
            className={`p-2 rounded-xl border transition cursor-pointer ${
              systemState.isLocked
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
            }`}
            title={systemState.isLocked ? 'Phone is Locked' : 'Lock Phone'}
          >
            <Power className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace / Phone Simulator */}
      <main className="w-full flex-1 flex flex-col items-center justify-center py-2 sm:py-6">
        <PhoneFrame
          systemState={systemState}
          onPowerButton={() => updateSystem({ isLocked: !systemState.isLocked })}
          onHomeButton={() => {
            updateSystem({
              activeAppId: null,
              isAppDrawerOpen: false,
              isQuickPanelOpen: false,
              isNotificationsOpen: false,
              isMultitaskingOpen: false,
              cameraActive: false,
            });
          }}
          onBackButton={() => {
            if (systemState.isQuickPanelOpen) updateSystem({ isQuickPanelOpen: false });
            else if (systemState.isNotificationsOpen) updateSystem({ isNotificationsOpen: false });
            else if (systemState.isAppDrawerOpen) updateSystem({ isAppDrawerOpen: false });
            else if (systemState.isMultitaskingOpen) updateSystem({ isMultitaskingOpen: false });
            else if (systemState.activeAppId) handleCloseActiveApp();
          }}
          onRecentsButton={() => updateSystem({ isMultitaskingOpen: true })}
          onOpenQuickPanel={() => updateSystem({ isQuickPanelOpen: true, isNotificationsOpen: false })}
          onOpenNotifications={() => updateSystem({ isNotificationsOpen: true, isQuickPanelOpen: false })}
          onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
          onOpenVoiceAgent={() => updateSystem({ isVoiceAgentOpen: true })}
        >
          {/* Background Wallpaper Container */}
          <div className={`relative w-full h-full bg-gradient-to-b ${currentWallpaper.preview} transition-colors duration-500 overflow-hidden`}>
            
            {/* SWITCHING ANIMATION OVERLAY */}
            {isSwitchingTransition && (
              <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center space-y-4 animate-fadeIn">
                <RefreshCw className="w-10 h-10 text-teal-400 animate-spin" />
                <h3 className="font-bold text-lg text-white">{isSwitchingTransition}</h3>
                <p className="text-xs text-slate-400">
                  Preserving all apps, files, photos and settings...
                </p>
              </div>
            )}

            {/* SCREEN 1: LOCK SCREEN */}
            {systemState.isLocked ? (
              <LockScreen
                systemState={systemState}
                onUnlock={() => updateSystem({ isLocked: false })}
                onOpenQuickPanel={() => updateSystem({ isQuickPanelOpen: true })}
                onOpenNotifications={() => updateSystem({ isNotificationsOpen: true })}
                onLaunchCamera={() => {
                  updateSystem({ isLocked: false });
                  handleLaunchApp('camera');
                }}
                onOpenVoiceAgent={() => updateSystem({ isVoiceAgentOpen: true })}
                toggleFlashlight={() => updateSystem({ flashlight: !systemState.flashlight })}
              />
            ) : systemState.uiMode === 'hios' ? (
              /* SCREEN 2: AUTHENTIC TECNO HiOS MODE */
              <TecnoHiosMode
                onSwitchBackToMayui={() => handleSwitchUIMode('mayui')}
                onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
              />
            ) : (
              /* SCREEN 3: MAYUI HOME SCREEN & APPS */
              <>
                <HomeScreen
                  systemState={systemState}
                  apps={apps}
                  onLaunchApp={handleLaunchApp}
                  onOpenAppDrawer={() => updateSystem({ isAppDrawerOpen: true })}
                  onOpenQuickPanel={() => updateSystem({ isQuickPanelOpen: true })}
                  onOpenNotifications={() => updateSystem({ isNotificationsOpen: true })}
                  onOpenWallpaperSelector={() => setIsWallpaperPickerOpen(true)}
                  onTriggerApkInstaller={() => handleLaunchApp('files')}
                  onOpenVoiceAgent={() => updateSystem({ isVoiceAgentOpen: true })}
                />

                {/* APP WINDOW OVERLAYS */}
                {systemState.activeAppId === 'maystore' && (
                  <div className="absolute inset-0 z-20">
                    <MayStore
                      installedApps={apps}
                      onInstallApp={handleInstallApp}
                      onUninstallApp={handleUninstallApp}
                      onClose={handleCloseActiveApp}
                    />
                  </div>
                )}

                {systemState.activeAppId === 'playstore' && (
                  <div className="absolute inset-0 z-20">
                    <PlayStoreApp
                      installedApps={apps}
                      onInstallApp={handleInstallApp}
                      onUninstallApp={handleUninstallApp}
                      onClose={handleCloseActiveApp}
                    />
                  </div>
                )}

                {systemState.activeAppId === 'files' && (
                  <div className="absolute inset-0 z-20">
                    <ApkInstaller
                      onInstallApk={handleInstallApp}
                      onLaunchApp={handleLaunchApp}
                      onClose={handleCloseActiveApp}
                    />
                  </div>
                )}

                {systemState.activeAppId === 'settings' && (
                  <div className="absolute inset-0 z-20">
                    <SettingsApp
                      systemState={systemState}
                      onUpdateSystem={updateSystem}
                      onSwitchUIMode={handleSwitchUIMode}
                      onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
                      onClose={handleCloseActiveApp}
                    />
                  </div>
                )}

                {systemState.activeAppId === 'booster' && (
                  <div className="absolute inset-0 z-20">
                    <BoosterApp
                      systemState={systemState}
                      onUpdateSystem={updateSystem}
                      onClose={handleCloseActiveApp}
                    />
                  </div>
                )}

                {systemState.activeAppId === 'camera' && (
                  <div className="absolute inset-0 z-20">
                    <CameraApp
                      onClose={handleCloseActiveApp}
                      onOpenGallery={() => handleLaunchApp('gallery')}
                      onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
                    />
                  </div>
                )}

                {systemState.activeAppId === 'calculator' && (
                  <div className="absolute inset-0 z-20">
                    <CalculatorApp onClose={handleCloseActiveApp} />
                  </div>
                )}

                {/* Generic App Fallback Window */}
                {systemState.activeAppId && !['maystore', 'files', 'settings', 'booster', 'camera', 'calculator'].includes(systemState.activeAppId) && (
                  <div className="absolute inset-0 z-20 bg-slate-950 text-white flex flex-col p-4 animate-fadeIn">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold">
                          {apps.find(a => a.id === systemState.activeAppId)?.name.charAt(0)}
                        </div>
                        <h3 className="font-bold text-sm">
                          {apps.find(a => a.id === systemState.activeAppId)?.name}
                        </h3>
                      </div>
                      <button
                        onClick={handleCloseActiveApp}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs"
                      >
                        Close
                      </button>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3">
                      <div className="w-16 h-16 rounded-3xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                        <Sparkles className="w-8 h-8" />
                      </div>
                      <h4 className="font-bold text-base text-white">
                        {apps.find(a => a.id === systemState.activeAppId)?.name} Running Smoothly
                      </h4>
                      <p className="text-xs text-slate-400 max-w-xs">
                        {apps.find(a => a.id === systemState.activeAppId)?.description || 'Optimized for TECNO SPARK Go 2024 at 90Hz.'}
                      </p>
                      <span className="text-[11px] font-mono text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full">
                        Memory usage: {apps.find(a => a.id === systemState.activeAppId)?.sizeMb || 18} MB RAM
                      </span>
                    </div>
                  </div>
                )}

                {/* APP LIBRARY / DRAWER OVERLAY */}
                {systemState.isAppDrawerOpen && (
                  <div className="absolute inset-0 z-30">
                    <AppLibrary
                      apps={apps}
                      onLaunchApp={handleLaunchApp}
                      onUninstallApp={handleUninstallApp}
                      onClose={() => updateSystem({ isAppDrawerOpen: false })}
                    />
                  </div>
                )}

                {/* QUICK PANEL / CONTROL CENTER OVERLAY */}
                {systemState.isQuickPanelOpen && (
                  <div className="absolute inset-0 z-30">
                    <QuickPanel
                      systemState={systemState}
                      onUpdateSystem={updateSystem}
                      onClose={() => updateSystem({ isQuickPanelOpen: false })}
                      onOpenSettings={() => {
                        updateSystem({ isQuickPanelOpen: false });
                        handleLaunchApp('settings');
                      }}
                      onOpenBooster={() => {
                        updateSystem({ isQuickPanelOpen: false });
                        handleLaunchApp('booster');
                      }}
                    />
                  </div>
                )}

                {/* NOTIFICATIONS CENTER OVERLAY */}
                {systemState.isNotificationsOpen && (
                  <div className="absolute inset-0 z-30">
                    <NotificationCenter
                      notifications={notifications}
                      onDismiss={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
                      onClearAll={() => setNotifications([])}
                      onClose={() => updateSystem({ isNotificationsOpen: false })}
                      onOpenSettings={() => {
                        updateSystem({ isNotificationsOpen: false });
                        handleLaunchApp('settings');
                      }}
                    />
                  </div>
                )}

                {/* MULTITASKING OVERVIEW OVERLAY */}
                {systemState.isMultitaskingOpen && (
                  <div className="absolute inset-0 z-30">
                    <Multitasking
                      recentAppIds={systemState.recentApps}
                      apps={apps}
                      systemState={systemState}
                      onSelectApp={(id) => {
                        updateSystem({ isMultitaskingOpen: false });
                        handleLaunchApp(id);
                      }}
                      onCloseApp={(id) => {
                        updateSystem({
                          recentApps: systemState.recentApps.filter(appId => appId !== id),
                        });
                      }}
                      onClearAll={() => {
                        updateSystem({
                          recentApps: [],
                          ramUsedMb: 950,
                        });
                      }}
                      onClose={() => updateSystem({ isMultitaskingOpen: false })}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </PhoneFrame>
      </main>

      {/* Direct APK Download Modal */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />

      {/* Wallpaper & Style Customization Modal */}
      <WallpaperPickerModal
        isOpen={isWallpaperPickerOpen}
        currentWallpaperId={systemState.wallpaperId}
        mirrorEffect={systemState.mirrorEffect}
        onSelectWallpaper={(id) => updateSystem({ wallpaperId: id })}
        onToggleMirrorEffect={(enabled) => updateSystem({ mirrorEffect: enabled })}
        onClose={() => setIsWallpaperPickerOpen(false)}
      />

      {/* AI Voice Agent Overlay */}
      {systemState.isVoiceAgentOpen && (
        <VoiceAgentOverlay
          systemState={systemState}
          onExecuteCommand={handleExecuteVoiceCommand}
          onClose={() => updateSystem({ isVoiceAgentOpen: false })}
        />
      )}
    </div>
  );
}
