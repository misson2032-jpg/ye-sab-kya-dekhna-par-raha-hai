import { VoiceCommandResult } from '../types/os';

export class VoiceAgentService {
  /**
   * Speak feedback using Web Speech API synthesis
   */
  public static speak(text: string): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }

  /**
   * Process voice command: queries Gemini endpoint or executes smart local parsing
   */
  public static async processCommand(
    transcript: string,
    isLocked: boolean,
    secretCodeWord: string
  ): Promise<VoiceCommandResult> {
    const cleanInput = transcript.trim().toLowerCase();
    const cleanCodeWord = (secretCodeWord || 'open sesame').trim().toLowerCase();

    // 1. Try server-side Gemini 3.8 Flash endpoint first
    try {
      const response = await fetch('/api/voice-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: cleanInput,
          isLocked,
          secretCodeWord: cleanCodeWord,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.action && !data.fallback) {
          return data as VoiceCommandResult;
        }
      }
    } catch (err) {
      console.log('Using local voice intelligence engine fallback...');
    }

    // 2. High-performance, offline-capable local intelligence engine
    return this.parseLocalIntent(cleanInput, isLocked, cleanCodeWord);
  }

  /**
   * Smart local intent parser (Runs instantaneously with 0ms latency)
   */
  private static parseLocalIntent(
    input: string,
    isLocked: boolean,
    codeWord: string
  ): VoiceCommandResult {
    // A. CODE WORD / PASSWORD UNLOCK LOGIC
    const isCodeWordMatch = input.includes(codeWord) || 
      input.replace(/[^a-z0-9]/g, '').includes(codeWord.replace(/[^a-z0-9]/g, '')) ||
      (codeWord === 'open sesame' && (input.includes('sesame') || input.includes('open says me') || input.includes('open sesame')));

    const hasUnlockIntent = input.includes('unlock') || input.includes('open phone') || input.includes('password');

    if (isLocked) {
      if (isCodeWordMatch || (hasUnlockIntent && input.includes(codeWord))) {
        return {
          action: 'unlock',
          spokenFeedback: `Voice code word verified. Unlocking TECNO SPARK Go 2024.`,
        };
      } else if (hasUnlockIntent) {
        return {
          action: 'unlock_failed',
          spokenFeedback: `Password or code word not recognized. Please say '${codeWord}' to unlock.`,
        };
      }
    }

    // If unlocked, check if user said code word anyway
    if (isCodeWordMatch) {
      return {
        action: 'code_word_acknowledged',
        spokenFeedback: `Code word '${codeWord}' verified. Voice agent is active and listening.`,
      };
    }

    // B. LOCKING / CLOSING PHONE LOGIC
    if (
      input.includes('lock phone') ||
      input.includes('lock screen') ||
      input.includes('turn off screen') ||
      input.includes('close phone') ||
      input.includes('go to sleep') ||
      input.includes('lock device') ||
      input.includes('shut down screen')
    ) {
      return {
        action: 'lock',
        spokenFeedback: 'Locking phone and entering secure standby.',
      };
    }

    // C. APP LAUNCHING BY VOICE
    if (input.includes('play store') || input.includes('google play') || input.includes('playstore')) {
      return {
        action: 'launch_app',
        appId: 'playstore',
        spokenFeedback: 'Opening Google Play Store.',
      };
    }

    if (input.includes('scan qr') || input.includes('qr code') || input.includes('scanner') || input.includes('scan')) {
      return {
        action: 'launch_app',
        appId: 'camera',
        spokenFeedback: 'Launching QR code scanner in Camera.',
      };
    }

    if (input.includes('wallpaper') || input.includes('change background') || input.includes('set wallpaper')) {
      return {
        action: 'open_wallpaper_picker',
        spokenFeedback: 'Opening Wallpaper & Style selector.',
      };
    }

    if (input.includes('mirror effect') || input.includes('glass reflection') || input.includes('mirror mode')) {
      return {
        action: 'toggle_mirror_effect',
        spokenFeedback: 'Toggling specular glass mirror effect.',
      };
    }

    if (input.includes('camera') || input.includes('take a photo') || input.includes('take picture')) {
      return {
        action: 'launch_app',
        appId: 'camera',
        spokenFeedback: 'Opening 13MP Dual Camera.',
      };
    }

    if (input.includes('calculator') || input.includes('calculate')) {
      return {
        action: 'launch_app',
        appId: 'calculator',
        spokenFeedback: 'Launching Calculator.',
      };
    }

    if (input.includes('settings') || input.includes('preferences') || input.includes('configure')) {
      return {
        action: 'launch_app',
        appId: 'settings',
        spokenFeedback: 'Opening MAYUI Settings.',
      };
    }

    if (input.includes('booster') || input.includes('ram') || input.includes('speed') || input.includes('clean memory')) {
      return {
        action: 'launch_app',
        appId: 'booster',
        spokenFeedback: 'Opening Speed & RAM Tuner for Unisoc T606.',
      };
    }

    if (input.includes('store') || input.includes('may store') || input.includes('app store') || input.includes('install apps')) {
      return {
        action: 'launch_app',
        appId: 'maystore',
        spokenFeedback: 'Opening MAY Store.',
      };
    }

    if (input.includes('file') || input.includes('downloads') || input.includes('apk') || input.includes('explorer')) {
      return {
        action: 'launch_app',
        appId: 'files',
        spokenFeedback: 'Opening Files and Downloads manager.',
      };
    }

    if (input.includes('phone') || input.includes('dialer') || input.includes('call')) {
      return {
        action: 'launch_app',
        appId: 'phone',
        spokenFeedback: 'Opening Phone dialer.',
      };
    }

    if (input.includes('message') || input.includes('sms') || input.includes('text')) {
      return {
        action: 'launch_app',
        appId: 'messages',
        spokenFeedback: 'Opening Messages.',
      };
    }

    if (input.includes('browser') || input.includes('chrome') || input.includes('web') || input.includes('internet')) {
      return {
        action: 'launch_app',
        appId: 'browser',
        spokenFeedback: 'Opening 90Hz Web Browser.',
      };
    }

    if (input.includes('gallery') || input.includes('photos') || input.includes('pictures')) {
      return {
        action: 'launch_app',
        appId: 'gallery',
        spokenFeedback: 'Opening Gallery.',
      };
    }

    if (input.includes('clock') || input.includes('alarm') || input.includes('timer')) {
      return {
        action: 'launch_app',
        appId: 'clock',
        spokenFeedback: 'Opening Clock and Alarms.',
      };
    }

    if (input.includes('music') || input.includes('song') || input.includes('play audio')) {
      return {
        action: 'launch_app',
        appId: 'music',
        spokenFeedback: 'Opening MAY Music.',
      };
    }

    if (input.includes('note') || input.includes('memo')) {
      return {
        action: 'launch_app',
        appId: 'notes',
        spokenFeedback: 'Opening Notes.',
      };
    }

    // D. HARDWARE & CONNECTIVITY VOICE CONTROLS
    if (input.includes('flashlight') || input.includes('torch')) {
      const turnOff = input.includes('off') || input.includes('disable') || input.includes('stop');
      return {
        action: 'toggle_flashlight',
        state: !turnOff,
        spokenFeedback: turnOff ? 'Flashlight turned off.' : 'Flashlight turned on.',
      };
    }

    if (input.includes('wifi') || input.includes('wi-fi')) {
      const turnOff = input.includes('off') || input.includes('disable');
      return {
        action: 'toggle_wifi',
        state: !turnOff,
        spokenFeedback: turnOff ? 'Wi-Fi disabled.' : 'Wi-Fi connected.',
      };
    }

    if (input.includes('bluetooth')) {
      const turnOff = input.includes('off') || input.includes('disable');
      return {
        action: 'toggle_bluetooth',
        state: !turnOff,
        spokenFeedback: turnOff ? 'Bluetooth switched off.' : 'Bluetooth switched on.',
      };
    }

    if (input.includes('battery saver') || input.includes('power saving')) {
      const turnOff = input.includes('off') || input.includes('disable');
      return {
        action: 'toggle_battery_saver',
        state: !turnOff,
        spokenFeedback: turnOff ? 'Battery Saver disabled.' : 'Battery Saver enabled.',
      };
    }

    if (input.includes('boost ram') || input.includes('free memory') || input.includes('optimize phone')) {
      return {
        action: 'boost_ram',
        spokenFeedback: 'MemFusion extended RAM optimized. 420 MB released.',
      };
    }

    if (input.includes('clean storage') || input.includes('clean cache') || input.includes('junk')) {
      return {
        action: 'clean_storage',
        spokenFeedback: '1.8 GB temporary junk and APK cache cleaned.',
      };
    }

    // E. 1-TAP UI MODE SWITCHING BY VOICE
    if (input.includes('switch to tecno') || input.includes('switch to hios') || input.includes('open hios')) {
      return {
        action: 'switch_ui_mode',
        targetMode: 'hios',
        spokenFeedback: 'Switching to original TECNO HiOS mode.',
      };
    }

    if (input.includes('switch to mayui') || input.includes('return to mayui') || input.includes('open mayui')) {
      return {
        action: 'switch_ui_mode',
        targetMode: 'mayui',
        spokenFeedback: 'Returning to MAYUI 90Hz custom OS.',
      };
    }

    // F. SYSTEM PANELS & NOTIFICATIONS
    if (input.includes('notification') || input.includes('show alerts')) {
      if (input.includes('clear')) {
        return {
          action: 'clear_notifications',
          spokenFeedback: 'All notifications cleared.',
        };
      }
      return {
        action: 'open_notifications',
        spokenFeedback: 'Showing Notification Center.',
      };
    }

    if (input.includes('control center') || input.includes('quick panel') || input.includes('quick settings')) {
      return {
        action: 'open_quick_panel',
        spokenFeedback: 'Opening Quick Panel.',
      };
    }

    if (input.includes('app drawer') || input.includes('app library') || input.includes('all apps')) {
      return {
        action: 'open_app_drawer',
        spokenFeedback: 'Opening App Library.',
      };
    }

    if (input.includes('download apk') || input.includes('get apk') || input.includes('install mayui')) {
      return {
        action: 'download_apk',
        spokenFeedback: 'Opening MAYUI Launcher APK download center.',
      };
    }

    // G. DEFAULT VOICE ASSISTANT ANSWER
    return {
      action: 'answer',
      spokenFeedback: `MAYUI Voice Agent processed: "${input}". Try saying 'Open Camera', 'Turn on flashlight', 'Lock phone', or say code word '${codeWord}' to unlock.`,
    };
  }
}
