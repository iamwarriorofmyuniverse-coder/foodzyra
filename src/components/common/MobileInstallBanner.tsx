import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Sparkles, CheckCircle2 } from 'lucide-react';

export const MobileInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already running in standalone mode (installed)
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setIsVisible(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // For iOS or browsers without native prompt, display guide
      alert('To install Foodzyra on iOS:\n1. Tap the Share button in Safari (box with arrow)\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add"');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  if (!isVisible || isInstalled) return null;

  return (
    <div className="fixed top-16 left-3 right-3 z-40 md:hidden animate-in slide-in-from-top-4 duration-300">
      <div className="bg-gradient-to-r from-forest-800 via-emerald-800 to-forest-900 text-white p-3.5 rounded-2xl shadow-xl border border-forest-600/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shrink-0">
            <Smartphone className="w-5 h-5 text-sprout-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white">Install Foodzyra App</span>
              <span className="text-[9px] uppercase font-extrabold bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full">
                Native PWA
              </span>
            </div>
            <p className="text-[11px] text-forest-200 line-clamp-1">Fast camera scanner, offline access & live surplus alerts</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleInstallClick}
            className="px-3 py-1.5 bg-sprout-400 hover:bg-sprout-300 text-forest-950 font-black text-xs rounded-xl shadow-md transition-transform active:scale-95 flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 text-forest-300 hover:text-white rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
