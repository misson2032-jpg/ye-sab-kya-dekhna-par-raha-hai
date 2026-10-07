export type UIMode = 'mayui' | 'hios';

export interface AppDefinition {
  id: string;
  name: string;
  icon: string;
  category: 'System' | 'Productivity' | 'Social' | 'Music' | 'Sports' | 'Utilities' | 'Games';
  color: string;
  bgGradient: string;
  sizeMb: number;
  isSystem?: boolean;
  isInstalled?: boolean;
  version?: string;
  developer?: string;
  rating?: number;
  reviewsCount?: number;
  description?: string;
  permissions?: string[];
  lastUsed?: string;
  storageUsageMb?: number;
}

export interface NotificationItem {
  id: string;
  appId: string;
  appName: string;
  appIcon: string;
  appColor: string;
  title: string;
  message: string;
  time: string;
  priority: 'high' | 'normal' | 'silent';
  actions?: { label: string; action: string }[];
  isRead?: boolean;
}

export interface WidgetConfig {
  id: string;
  type: 'clock-weather' | 'battery-hardware' | 'fitness' | 'calendar' | 'quick-tools';
  title: string;
}

export interface SystemState {
  uiMode: UIMode;
  isLocked: boolean;
  activeAppId: string | null;
  recentApps: string[];
  isQuickPanelOpen: boolean;
  isNotificationsOpen: boolean;
  isAppDrawerOpen: boolean;
  isMultitaskingOpen: boolean;
  isHomeScreenEditMode: boolean;
  currentHomeScreenPage: number;
  
  // Voice AI Agent State & Settings
  isVoiceAgentOpen: boolean;
  voiceSecretCodeWord: string; // e.g., "open sesame" or custom password
  voiceFeedbackSpeechEnabled: boolean;
  lastVoiceCommand: string | null;
  lastVoiceFeedback: string | null;
  
  // Hardware & Connectivity Toggles
  wifi: boolean;
  bluetooth: boolean;
  mobileData: boolean;
  airplaneMode: boolean;
  flashlight: boolean;
  location: boolean;
  hotspot: boolean;
  screenRecording: boolean;
  doNotDisturb: boolean;
  darkMode: boolean;
  autoRotate: boolean;
  batterySaver: boolean;
  nfc: boolean;
  
  // Display & Volume
  brightness: number; // 0-100
  volume: number; // 0-100
  
  // Performance Modes for TECNO SPARK Go 2024
  performanceMode: 'battery-saver' | 'balanced' | 'performance';
  refreshRate: '60hz' | '90hz' | 'adaptive';
  reduceAnimations: boolean;
  navigationMode: 'gestures' | '3-button';
  accentColor: string;
  wallpaperId: string;
  
  // Battery & Memory stats
  batteryLevel: number;
  isCharging: boolean;
  ramUsedMb: number;
  ramTotalMb: number; // 3072 MB
  storageUsedGb: number;
  storageTotalGb: number; // 64 GB
  
  // Security & Privacy
  cameraActive: boolean;
  micActive: boolean;
  locationActive: boolean;

  // Mirror & Visual Effects
  mirrorEffect: boolean; // Specular glass mirror reflection overlay
}

export interface ApkPackage {
  id: string;
  fileName: string;
  appName: string;
  icon: string;
  iconColor: string;
  developer: string;
  version: string;
  sizeMb: number;
  sha256: string;
  permissions: string[];
  isVerified: boolean;
  alreadyInstalled: boolean;
  downloadDate: string;
}

export interface VoiceCommandResult {
  action: string;
  appId?: string;
  state?: boolean;
  targetMode?: string;
  level?: number;
  spokenFeedback: string;
}
