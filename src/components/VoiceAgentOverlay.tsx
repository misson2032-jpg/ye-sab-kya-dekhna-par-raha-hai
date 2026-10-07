import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Volume2, VolumeX, Sparkles, X, Check, Lock, Unlock, 
  ArrowRight, ShieldCheck, Zap, Radio, RefreshCw, Smartphone 
} from 'lucide-react';
import { SystemState, VoiceCommandResult } from '../types/os';
import { VoiceAgentService } from '../services/voiceAgentService';

interface VoiceAgentOverlayProps {
  systemState: SystemState;
  onExecuteCommand: (result: VoiceCommandResult) => void;
  onClose: () => void;
}

export const VoiceAgentOverlay: React.FC<VoiceAgentOverlayProps> = ({
  systemState,
  onExecuteCommand,
  onClose,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [inputText, setInputText] = useState('');
  const [feedback, setFeedback] = useState<string>('Listening for voice commands...');
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Initialize Web Speech Recognition if available
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setFeedback('Listening... speak your command or secret code word.');
        };

        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const transcriptText = event.results[current][0].transcript;
          setTranscript(transcriptText);

          if (event.results[current].isFinal) {
            handleProcessCommand(transcriptText);
          }
        };

        recognition.onerror = (err: any) => {
          console.warn('Speech recognition error:', err);
          setIsListening(false);
          setFeedback('Mic error or permissions denied. You can tap command chips below.');
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } catch (e) {
        console.warn('Could not initialize SpeechRecognition:', e);
      }
    }

    // Auto-start listening on mount
    startListening();

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

  const startListening = () => {
    setTranscript('');
    setFeedback('Listening... speak now.');
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        setIsListening(true);
      }
    } else {
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
  };

  const handleProcessCommand = async (commandText: string) => {
    if (!commandText.trim()) return;

    setIsProcessing(true);
    setTranscript(commandText);
    setFeedback(`Processing: "${commandText}"...`);

    const result = await VoiceAgentService.processCommand(
      commandText,
      systemState.isLocked,
      systemState.voiceSecretCodeWord
    );

    setFeedback(result.spokenFeedback);
    setIsProcessing(false);

    // Speak aloud if sound enabled
    if (systemState.voiceFeedbackSpeechEnabled) {
      VoiceAgentService.speak(result.spokenFeedback);
    }

    // Execute the action on phone OS
    setTimeout(() => {
      onExecuteCommand(result);
    }, 450);
  };

  const sampleVoiceCommands = [
    { label: `🔓 Code Word: "${systemState.voiceSecretCodeWord}"`, cmd: systemState.voiceSecretCodeWord },
    { label: '🔒 Lock phone', cmd: 'Lock phone' },
    { label: '▶️ Open Play Store', cmd: 'Open Play Store' },
    { label: '🔍 Scan QR code', cmd: 'Scan QR code' },
    { label: '🖼️ Change wallpaper', cmd: 'Change wallpaper' },
    { label: '🪞 Toggle Mirror', cmd: 'Mirror effect' },
    { label: '📷 Open Camera', cmd: 'Open Camera' },
    { label: '🔦 Turn on flashlight', cmd: 'Turn on flashlight' },
    { label: '⚡ Boost RAM', cmd: 'Boost RAM' },
    { label: '🔄 Switch to TECNO HiOS', cmd: 'Switch to TECNO HiOS' },
    { label: '🛒 Open MAY Store', cmd: 'Open MAY Store' },
    { label: '⚙️ Open Settings', cmd: 'Open Settings' },
    { label: '📁 Open Files', cmd: 'Open Files' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex flex-col justify-end sm:justify-center items-center p-4 animate-fadeIn select-none font-sans">
      <div className="bg-slate-900 border border-teal-500/40 rounded-3xl p-6 max-w-sm w-full shadow-[0_20px_60px_rgba(20,184,166,0.3)] text-white flex flex-col space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500 flex items-center justify-center text-slate-950 font-black shadow-md shadow-teal-500/20">
              <Sparkles className="w-4 h-4 text-slate-950" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">MAY Voice Agent</h3>
              <p className="text-[11px] text-teal-300 font-mono">
                {systemState.isLocked ? 'Phone Locked • Awaiting Code Word' : 'Phone Unlocked • System Ready'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Audio Wave Visualizer & Microphone Center */}
        <div className="py-2 flex flex-col items-center justify-center space-y-3">
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* Pulsing Voice Waves */}
            {isListening && (
              <>
                <span className="absolute inset-0 rounded-full border-2 border-teal-400/40 animate-ping opacity-60" />
                <span className="absolute -inset-3 rounded-full border border-teal-500/20 animate-pulse" />
              </>
            )}

            <button
              onClick={isListening ? stopListening : startListening}
              className={`w-18 h-18 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shadow-xl ${
                isListening
                  ? 'bg-gradient-to-tr from-teal-400 to-cyan-400 text-slate-950 scale-105 shadow-teal-500/40'
                  : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-teal-400'
              }`}
              title={isListening ? 'Stop listening' : 'Start microphone'}
            >
              {isListening ? <Mic className="w-8 h-8" /> : <MicOff className="w-7 h-7" />}
            </button>
          </div>

          {/* Sound wave bars simulation */}
          {isListening && (
            <div className="flex items-center gap-1.5 h-6">
              {[60, 100, 40, 80, 50, 95, 30, 70, 45].map((height, i) => (
                <div
                  key={i}
                  className="w-1 bg-teal-400 rounded-full animate-pulse"
                  style={{
                    height: `${height}%`,
                    animationDelay: `${i * 90}ms`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Transcript / Spoken Output Display */}
          <div className="w-full text-center space-y-1">
            <p className="text-xs font-mono text-teal-300 min-h-[18px]">
              {transcript ? `"${transcript}"` : isListening ? 'Listening...' : 'Tap mic or say command'}
            </p>
            <p className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 leading-relaxed">
              {feedback}
            </p>
          </div>
        </div>

        {/* Current Secret Code Word Badge */}
        <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-between text-xs text-teal-300">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Secret Code Word:
          </span>
          <span className="font-mono font-bold bg-teal-500/20 px-2 py-0.5 rounded text-white">
            "{systemState.voiceSecretCodeWord}"
          </span>
        </div>

        {/* Text Input Fallback (for testing on devices without mic access) */}
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleProcessCommand(inputText);
                setInputText('');
              }
            }}
            placeholder="Type voice command (e.g. open sesame)..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-400"
          />
          <button
            onClick={() => {
              handleProcessCommand(inputText);
              setInputText('');
            }}
            disabled={!inputText.trim() || isProcessing}
            className="p-2 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 rounded-xl font-bold transition"
            title="Execute Command"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Voice Command Chips (Click to test instantly) */}
        <div className="space-y-1.5">
          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
            Quick Voice Commands:
          </span>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto no-scrollbar">
            {sampleVoiceCommands.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleProcessCommand(item.cmd)}
                disabled={isProcessing}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-teal-500 hover:text-slate-950 text-slate-300 text-[11px] border border-slate-700/80 transition active:scale-95 text-left"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
