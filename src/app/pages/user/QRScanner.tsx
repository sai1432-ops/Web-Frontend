import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { 
  X, 
  Zap, 
  ScanLine, 
  Camera,
  AlertCircle,
  Keyboard
} from 'lucide-react';
import { Button } from '../../components/ui/button';

interface QRScannerProps {
  onClose?: () => void;
  onResult?: (result: string) => void;
  themeColor?: string;
  scanModeLabel?: string;
}

export default function QRScanner({
  onClose,
  onResult,
  themeColor = "#2196F3", // Default PrimaryBlue-esque
  scanModeLabel = "Scan QR Code"
}: QRScannerProps) {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isFlashOn, setIsFlashOn] = useState(false);

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: 'environment', // Use back camera
                width: {ideal: 1280},
                height: {ideal: 720}
            } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);
      } catch (err) {
        console.error("Camera access denied:", err);
        setHasPermission(false);
      }
    }

    setupCamera();

    // Clean up stream on unmount
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleClose = () => {
    if (onClose) onClose();
    else navigate(-1);
  };

  // Note: REAL QR scanning would require a library like html5-qrcode or jsqr.
  // This implementation focuses on the HIGH-FIDELITY UI as requested.
  // A simple mockup of "Result found" could be triggered via a button for demo purposes.

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden font-sans">
      {/* Immersive Camera Feed Layer */}
      <div className="absolute inset-0 z-0 bg-zinc-950">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className={`w-full h-full object-cover grayscale-[0.1] contrast-[1.05] ${hasPermission === true ? 'block' : 'hidden'}`}
        />
        
        {hasPermission === false && (
          <div className="absolute inset-0 z-10 w-full h-full flex flex-col items-center justify-center gap-8 p-12 text-center bg-zinc-950">
            <div className="w-28 h-28 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 animate-pulse border border-red-500/20">
                <AlertCircle className="w-14 h-14" />
            </div>
            <div className="space-y-3">
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">Camera Restricted</h2>
                <p className="text-sm text-zinc-500 font-bold leading-relaxed max-w-sm">
                    Access to the camera was denied. Please update your browser permissions to enable scanning functionality.
                </p>
            </div>
            <Button 
                onClick={() => window.location.reload()}
                className="mt-6 rounded-2xl bg-white text-black hover:bg-zinc-200 font-black px-12 h-14 shadow-xl transition-all active:scale-95"
            >
                RETRY PERMISSION
            </Button>
          </div>
        )}

        {hasPermission === null && (
          <div className="absolute inset-0 z-10 w-full h-full bg-zinc-950 flex items-center justify-center">
             <div className="flex flex-col items-center gap-4">
                <Camera className="w-20 h-20 text-zinc-800 animate-pulse" />
                <p className="text-zinc-600 font-black text-xs uppercase tracking-widest animate-pulse">Initializing Lens...</p>
             </div>
          </div>
        )}
      </div>

      {/* Glassmorphism Scanning Overlay UI */}
      <div className="absolute inset-0 z-10 flex flex-col pointer-events-none">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between p-8 pt-12 pointer-events-auto">
            <button 
                onClick={handleClose}
                className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-xl flex items-center justify-center text-white border border-white/10 hover:bg-black/60 transition-all active:scale-90 shadow-lg"
            >
                <X className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-black text-white tracking-tight drop-shadow-xl uppercase">{scanModeLabel}</h1>
            <button 
                onClick={() => setIsFlashOn(!isFlashOn)}
                className={`w-12 h-12 rounded-full backdrop-blur-xl flex items-center justify-center transition-all active:scale-90 border border-white/10 ${isFlashOn ? 'bg-yellow-500 text-black shadow-2xl shadow-yellow-500/40' : 'bg-black/40 text-white hover:bg-black/60'}`}
            >
                <Zap className={`w-5 h-5 ${isFlashOn ? 'fill-current' : ''}`} />
            </button>
        </div>

        {/* Central Automated Frame Layer */}
        <div className="flex-1 flex items-center justify-center">
            <div className="relative group">
                {/* 280px Frame per Spec */}
                <div 
                    className="w-[300px] h-[300px] sm:w-[320px] sm:h-[320px] rounded-[3rem] border-2 relative overflow-hidden transition-all duration-1000"
                    style={{ borderColor: `${themeColor}66`, backgroundColor: 'rgba(255,255,255,0.03)' }}
                >
                    {/* Dynamic Scanning Laser Beam */}
                    <div className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-100 animate-[scan_2.5s_linear_infinite]"
                         style={{ color: themeColor, top: 0 }}>
                        <div className="absolute inset-x-0 bottom-full h-32 bg-gradient-to-b from-transparent to-current opacity-20" style={{ color: themeColor }}></div>
                    </div>

                    {/* Faint Grid Lines */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `linear-gradient(${themeColor} 1px, transparent 1px), linear-gradient(90deg, ${themeColor} 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>
                </div>

                {/* Branded Corner Guards */}
                <div className="absolute -inset-4 pointer-events-none transition-transform duration-500 group-hover:scale-105">
                    <div className="absolute top-0 left-0 w-12 h-12 border-t-[6px] border-l-[6px] rounded-tl-[2rem]" style={{ borderColor: themeColor }}></div>
                    <div className="absolute top-0 right-0 w-12 h-12 border-t-[6px] border-r-[6px] rounded-tr-[2rem]" style={{ borderColor: themeColor }}></div>
                    <div className="absolute bottom-0 left-0 w-12 h-12 border-b-[6px] border-l-[6px] rounded-bl-[2rem]" style={{ borderColor: themeColor }}></div>
                    <div className="absolute bottom-0 right-0 w-12 h-12 border-b-[6px] border-r-[6px] rounded-br-[2rem]" style={{ borderColor: themeColor }}></div>
                </div>
            </div>
        </div>

        {/* Action & Instruction Footer */}
        <div className="p-12 pb-24 flex flex-col items-center gap-10">
            <div className="space-y-2 text-center pointer-events-auto">
                <p className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em]">Scanner Active</p>
                <p className="text-sm font-bold text-white/80 tracking-tight leading-relaxed">
                    Align the code within the frame to automatically scan
                </p>
                <button 
                  onClick={() => {
                    const val = window.prompt("Enter Dealer QR Value (e.g., DLR-1-ABC12345):");
                    if (val) onResult?.(val);
                  }}
                  className="mt-4 text-[10px] font-black text-white/60 hover:text-white uppercase tracking-widest border border-white/20 px-4 py-2 rounded-full backdrop-blur-md transition-all active:scale-95"
                >
                  Enter Code Manually
                </button>
            </div>

            <div className="flex items-center gap-8 pointer-events-auto">
              <button 
                  onClick={() => {
                    const val = window.prompt("Simulate Scan - Enter Value:", "DLR-1-ABC12345");
                    if (val) onResult?.(val);
                  }}
                  className="w-16 h-16 rounded-full flex items-center justify-center bg-zinc-900 text-white/50 border border-white/10 transition-all active:scale-90 hover:bg-zinc-800"
              >
                  <Keyboard className="w-6 h-6" />
              </button>

              <button 
                  onClick={() => onResult?.("DLR-1-ABC12345")}
                  className="w-24 h-24 rounded-full flex items-center justify-center text-white shadow-[0_20px_50px_rgba(33,150,243,0.3)] transition-all active:scale-90 group relative overflow-hidden active:rotate-45"
                  style={{ backgroundColor: themeColor }}
              >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-all duration-300"></div>
                  <ScanLine className="w-12 h-12 relative z-10 transition-transform duration-500 group-hover:scale-110" />
              </button>
              
              <div className="w-16 h-16" /> {/* Placeholder for balance */}
            </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { transform: translateY(-20px); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateY(320px); opacity: 0; }
        }
      `}} />
    </div>
  );
}
