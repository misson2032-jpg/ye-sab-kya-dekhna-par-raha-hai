import React, { useState } from 'react';
import { 
  ArrowLeft, Camera, RefreshCw, Zap, Sliders, Image as ImageIcon, 
  Check, Sparkles, QrCode, ExternalLink, Copy, CheckCircle2, 
  Download, Wifi, ShieldCheck, Sun, Moon 
} from 'lucide-react';

interface CameraAppProps {
  onClose: () => void;
  onOpenGallery: () => void;
  onOpenDownloadModal?: () => void;
}

export const CameraApp: React.FC<CameraAppProps> = ({ 
  onClose, 
  onOpenGallery, 
  onOpenDownloadModal 
}) => {
  const [photoCount, setPhotoCount] = useState(3);
  const [flash, setFlash] = useState(false);
  const [hdr, setHdr] = useState(true);
  const [mode, setMode] = useState<'photo' | 'video' | 'portrait' | 'qr'>('photo');
  const [isCapturing, setIsCapturing] = useState(false);
  const [isFrontMirror, setIsFrontMirror] = useState(false);
  
  // QR Scan State
  const [scannedQrData, setScannedQrData] = useState<{
    type: 'url' | 'wifi' | 'apk';
    title: string;
    payload: string;
  } | null>(null);
  const [copiedQr, setCopiedQr] = useState(false);

  const handleCapture = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
      setPhotoCount(c => c + 1);
    }, 280);
  };

  const handleSimulateQrScan = (type: 'apk' | 'url' | 'wifi') => {
    if (type === 'apk') {
      setScannedQrData({
        type: 'apk',
        title: 'MAYUI Launcher 2.6 Package',
        payload: 'https://mayui.os/sparkgo2024#download-mayui-apk',
      });
    } else if (type === 'wifi') {
      setScannedQrData({
        type: 'wifi',
        title: 'Wi-Fi: TECNO_Guest_90Hz',
        payload: 'WIFI:S:TECNO_Guest_90Hz;T:WPA;P:sparkgo2024;;',
      });
    } else {
      setScannedQrData({
        type: 'url',
        title: 'Official TECNO SPARK Go Portal',
        payload: 'https://tecno-mobile.com/spark-go-2024',
      });
    }
  };

  const handleCopyQr = () => {
    if (scannedQrData) {
      navigator.clipboard.writeText(scannedQrData.payload);
      setCopiedQr(true);
      setTimeout(() => setCopiedQr(false), 2000);
    }
  };

  return (
    <div className="relative w-full h-full bg-black text-white flex flex-col justify-between font-sans select-none animate-fadeIn overflow-hidden">
      {/* Top Controls Bar */}
      <div className="p-4 flex items-center justify-between z-20 bg-gradient-to-b from-black/80 to-transparent">
        <button
          onClick={onClose}
          className="p-1.5 rounded-full bg-black/40 backdrop-blur text-white hover:bg-black/60"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          {/* Flash */}
          <button
            onClick={() => setFlash(!flash)}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur transition ${
              flash ? 'bg-amber-400 text-slate-950' : 'bg-black/40 text-white/80'
            }`}
          >
            <Zap className="w-3.5 h-3.5 inline mr-1" /> {flash ? 'On' : 'Auto'}
          </button>

          {/* Mirror Flip toggle */}
          <button
            onClick={() => setIsFrontMirror(!isFrontMirror)}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur transition ${
              isFrontMirror ? 'bg-cyan-400 text-slate-950 font-bold' : 'bg-black/40 text-white/80'
            }`}
            title="Toggle Front Selfie Mirror"
          >
            <Sparkles className="w-3.5 h-3.5 inline mr-1" /> Mirror {isFrontMirror ? 'ON' : 'OFF'}
          </button>

          {/* QR shortcut */}
          <button
            onClick={() => setMode('qr')}
            className={`p-1.5 rounded-full text-xs backdrop-blur transition ${
              mode === 'qr' ? 'bg-teal-400 text-slate-950' : 'bg-black/40 text-white/80'
            }`}
            title="Scan QR Code"
          >
            <QrCode className="w-4 h-4" />
          </button>
        </div>

        <span className="text-[10px] font-mono text-teal-300 bg-black/50 px-2 py-0.5 rounded-full border border-teal-500/30">
          {isFrontMirror ? 'Front Mirror' : '13MP Dual'}
        </span>
      </div>

      {/* Simulated Viewfinder Canvas */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {/* Shutter flash animation */}
        {isCapturing && (
          <div className="absolute inset-0 bg-white z-30 animate-ping opacity-90" />
        )}

        {/* Viewfinder simulation canvas with mirror flip */}
        <div 
          className={`w-full h-full bg-gradient-to-tr from-slate-900 via-zinc-900 to-slate-800 flex flex-col items-center justify-center p-6 text-center space-y-4 transition-transform duration-300 ${
            isFrontMirror ? 'scale-x-[-1]' : ''
          }`}
        >
          {/* Mirror specular gloss reflection overlay */}
          {isFrontMirror && (
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none transform -skew-x-12" />
          )}

          {/* QR SCANNER MODE VIEW */}
          {mode === 'qr' ? (
            <div className={`relative flex flex-col items-center ${isFrontMirror ? 'scale-x-[-1]' : ''}`}>
              {/* QR Reticle with animated scanning laser */}
              <div className="relative w-56 h-56 border-2 border-teal-400/80 rounded-3xl overflow-hidden flex items-center justify-center bg-black/30 backdrop-blur-sm shadow-2xl">
                {/* Laser scan line */}
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-[0_0_15px_rgba(20,184,166,0.9)] animate-pulse top-1/2 -translate-y-1/2" />
                
                {/* Corner reticle highlights */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-teal-300" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-teal-300" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-teal-300" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-teal-300" />

                <div className="text-center p-4">
                  <QrCode className="w-12 h-12 text-teal-400/80 mx-auto animate-pulse" />
                  <p className="text-[11px] text-white/80 font-medium mt-2">
                    Align QR code inside frame
                  </p>
                </div>
              </div>

              {/* Quick simulation buttons to test QR detection immediately */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleSimulateQrScan('apk')}
                  className="px-2.5 py-1 rounded-lg bg-teal-500/20 hover:bg-teal-500/40 text-teal-300 text-[10px] font-mono border border-teal-500/40"
                >
                  Scan APK QR
                </button>
                <button
                  onClick={() => handleSimulateQrScan('wifi')}
                  className="px-2.5 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 text-[10px] font-mono border border-blue-500/40"
                >
                  Scan Wi-Fi QR
                </button>
                <button
                  onClick={() => handleSimulateQrScan('url')}
                  className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 text-[10px] font-mono border border-purple-500/40"
                >
                  Scan URL
                </button>
              </div>
            </div>
          ) : (
            /* STANDARD CAMERA VIEWFINDER */
            <div className={`relative w-48 h-48 border border-white/20 rounded-2xl flex items-center justify-center ${isFrontMirror ? 'scale-x-[-1]' : ''}`}>
              <div className="w-6 h-6 border-2 border-teal-400/80 rounded-full animate-pulse" />
              <div className="absolute top-2 left-2 text-[9px] font-mono text-teal-300">
                {isFrontMirror ? 'SELFIE MIRROR 90Hz' : 'AF-C 90Hz'}
              </div>
              <div className="absolute bottom-2 right-2 text-[9px] font-mono text-white/60">f/1.85 1/60s</div>
            </div>
          )}

          <p className={`text-xs text-white/70 ${isFrontMirror ? 'scale-x-[-1]' : ''}`}>
            {mode === 'qr'
              ? 'TECNO Google Lens QR Scanner active'
              : isFrontMirror
              ? 'Front Mirror Reflection Active'
              : 'TECNO SPARK Go 2024 Dual Camera • HDR Processing Ready'}
          </p>
        </div>

        {/* DETECTED QR CODE POPUP CARD */}
        {scannedQrData && (
          <div className="absolute bottom-6 inset-x-4 z-40 bg-slate-900/95 border border-teal-400 rounded-2xl p-4 shadow-2xl backdrop-blur-md animate-fadeIn text-white space-y-2.5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">{scannedQrData.title}</h4>
                  <p className="text-[11px] text-teal-300 font-mono truncate max-w-[210px]">
                    {scannedQrData.payload}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setScannedQrData(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ×
              </button>
            </div>

            <div className="flex gap-2 pt-1 border-t border-slate-800 text-xs">
              {scannedQrData.type === 'apk' ? (
                <button
                  onClick={() => {
                    setScannedQrData(null);
                    if (onOpenDownloadModal) onOpenDownloadModal();
                  }}
                  className="flex-1 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" /> Download MAYUI APK
                </button>
              ) : (
                <button
                  onClick={() => {
                    window.open(scannedQrData.payload, '_blank');
                  }}
                  className="flex-1 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Open Link
                </button>
              )}

              <button
                onClick={handleCopyQr}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center gap-1 transition"
              >
                {copiedQr ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedQr ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mode Switcher */}
      <div className="py-2 flex items-center justify-center gap-5 text-xs font-semibold z-20 bg-black/40 backdrop-blur">
        {(['photo', 'video', 'portrait', 'qr'] as const).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`uppercase tracking-wider transition ${
              mode === m ? 'text-teal-400 font-bold' : 'text-white/50'
            }`}
          >
            {m === 'qr' ? 'QR Scan' : m}
          </button>
        ))}
      </div>

      {/* Bottom Shutter & Gallery Bar */}
      <div className="p-6 pb-8 flex items-center justify-around z-20 bg-gradient-to-t from-black via-black/90 to-transparent">
        {/* Gallery thumbnail */}
        <button
          onClick={onOpenGallery}
          className="w-12 h-12 rounded-xl bg-slate-800 border border-white/20 flex items-center justify-center text-teal-300 overflow-hidden active:scale-95 transition"
        >
          <ImageIcon className="w-6 h-6" />
        </button>

        {/* Shutter Button */}
        <button
          onClick={handleCapture}
          className="w-18 h-18 rounded-full border-4 border-white flex items-center justify-center p-1 active:scale-90 transition cursor-pointer"
        >
          <div className="w-full h-full rounded-full bg-teal-400 hover:bg-teal-300 transition" />
        </button>

        {/* Switch camera sensor / Flip to Front Mirror */}
        <button
          onClick={() => setIsFrontMirror(!isFrontMirror)}
          className={`w-12 h-12 rounded-full flex items-center justify-center active:scale-95 transition ${
            isFrontMirror
              ? 'bg-cyan-400 text-slate-950 font-bold shadow-lg shadow-cyan-400/30'
              : 'bg-white/10 hover:bg-white/20 text-white'
          }`}
          title="Flip camera to selfie mirror"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
