import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  QrCode,
  Camera,
  RefreshCw,
  ArrowRight,
  SwitchCamera
} from 'lucide-react';
import jsQR from 'jsqr';
import { useFoodLoop } from '../../context/FoodLoopContext';

interface PickupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PickupModal: React.FC<PickupModalProps> = ({ isOpen, onClose }) => {
  const { verifyPickupCode, reservations, claims } = useFoodLoop();
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Active pending codes for quick testing
  const pendingCustomerCodes = reservations
    .filter(r => r.status === 'pending_pickup')
    .map(r => ({ code: r.pickupCode, title: r.listing.title, user: r.userName, type: 'customer' }));

  const pendingNgoCodes = claims
    .filter(c => c.status === 'approved')
    .map(c => ({ code: c.pickupCode, title: c.listing.title, user: c.ngoName, type: 'ngo' }));

  const activeCodes = [...pendingCustomerCodes, ...pendingNgoCodes];

  const stopCamera = useCallback(() => {
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  const handleVerify = useCallback(async (pickupCodeToUse?: string) => {
    const targetCode = pickupCodeToUse || code;
    if (!targetCode) return;

    setIsVerifying(true);
    try {
      await verifyPickupCode(targetCode);
      setCode('');
      stopCamera();
    } catch (e) {
      console.error(e);
    } finally {
      setIsVerifying(false);
    }
  }, [code, stopCamera, verifyPickupCode]);

  const scanFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const qrResult = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert'
        });

        if (qrResult && qrResult.data) {
          const rawData = qrResult.data.trim();
          // Extract FL-XXXX, FZ-XXXX, NGO-XXXX or direct code
          const codeMatch = rawData.match(/(?:FL|FZ|NGO)-\d+/i) || rawData.match(/[A-Z0-9-]{4,10}/i);
          const detectedCode = codeMatch ? codeMatch[0].toUpperCase() : rawData.toUpperCase();

          if (detectedCode && detectedCode !== lastScannedCode) {
            setLastScannedCode(detectedCode);
            setCode(detectedCode);
            handleVerify(detectedCode);
            return;
          }
        }
      }
    }

    animFrameIdRef.current = requestAnimationFrame(scanFrame);
  }, [handleVerify, lastScannedCode]);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    stopCamera();

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: cameraFacing,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setCameraActive(true);
        animFrameIdRef.current = requestAnimationFrame(scanFrame);
      }
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Camera permission denied. Please allow camera permissions in your browser or enter the code manually.'
          : 'Unable to start camera. Please verify device camera access or type the code below.'
      );
      setCameraActive(false);
    }
  }, [cameraFacing, scanFrame, stopCamera]);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, startCamera, stopCamera]);

  const toggleCameraFacing = () => {
    setCameraFacing(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-forest-600 text-white flex items-center justify-center shadow-xs">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Verify Pickup Token</h3>
              <p className="text-[11px] text-slate-500">Live Camera Scanner & QR Code Reader</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          
          {/* Live Camera Viewport */}
          <div className="relative rounded-2xl bg-slate-950 overflow-hidden aspect-[4/3] flex items-center justify-center border-2 border-slate-800 shadow-inner">
            <video
              ref={videoRef}
              className={`w-full h-full object-cover ${!cameraActive ? 'hidden' : ''}`}
              autoPlay
              muted
              playsInline
            />
            <canvas ref={canvasRef} className="hidden" />

            {cameraActive ? (
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                {/* Viewfinder Overlay Box */}
                <div className="w-52 h-52 sm:w-60 sm:h-60 border-2 border-sprout-400 rounded-2xl relative shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]">
                  {/* Scanner Animation Bar */}
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-sprout-300 to-transparent shadow-[0_0_8px_#4ade80] animate-bounce" />
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-white rounded-tl" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-white rounded-tr" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-white rounded-bl" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-white rounded-br" />
                </div>
                <span className="mt-4 text-[11px] font-bold text-white bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">
                  Align customer QR code inside frame
                </span>
              </div>
            ) : (
              <div className="p-6 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                  <Camera className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Camera Standby / Off</p>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                    {cameraError || 'Allow camera permission to scan QR code in real-time.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={startCamera}
                  className="px-4 py-2 rounded-xl bg-forest-600 hover:bg-forest-500 text-white text-xs font-bold shadow-md transition-all inline-flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Start Live Camera</span>
                </button>
              </div>
            )}

            {/* Camera Floating Controls */}
            {cameraActive && (
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleCameraFacing}
                  className="p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-md text-xs border border-white/20 transition-all shadow-md"
                  title="Switch Camera (Front / Back)"
                >
                  <SwitchCamera className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Manual Input Form */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <label className="text-xs font-bold text-slate-700 block">
              Or Enter 6-Digit Pickup Code Manually
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. FL-9421 or FZ-8924"
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-base font-mono font-bold tracking-wider uppercase text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
              <button
                type="button"
                onClick={() => handleVerify()}
                disabled={isVerifying || !code}
                className="px-5 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white text-xs font-bold shadow-sm disabled:opacity-40 transition-colors flex items-center gap-1.5 shrink-0"
              >
                <span>{isVerifying ? 'Verifying...' : 'Verify'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Clickable Demo Codes */}
          {activeCodes.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Pending Active Tokens in System (Tap to Test Hand-Off):
              </span>
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {activeCodes.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleVerify(item.code)}
                    className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-forest-50 border border-slate-200 text-xs flex items-center justify-between transition-colors group shadow-2xs"
                  >
                    <div className="truncate pr-2">
                      <span className="font-mono font-black text-forest-800 bg-forest-100 px-2 py-0.5 rounded mr-2">
                        {item.code}
                      </span>
                      <span className="text-slate-600 font-medium truncate">{item.title}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-forest-600 text-white shrink-0 group-hover:bg-forest-700">
                      Confirm
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
