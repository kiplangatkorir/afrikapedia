"use client";

import { useEffect, useState } from "react";

export default function PWAProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);

      setTimeout(() => {
        setShowInstallPrompt(true);
      }, 3000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    (deferredPrompt as any).prompt();
    const { outcome } = await (deferredPrompt as any).userChoice;

    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const dismissInstall = () => {
    setShowInstallPrompt(false);
  };

  return (
    <>
      {children}

      {!isOnline && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg z-50 flex items-center gap-2">
          <span>📡</span>
          <span>You&apos;re offline</span>
        </div>
      )}

      {showInstallPrompt && deferredPrompt && (
        <div className="fixed bottom-0 left-0 right-0 bg-kente-black p-4 z-50 sw-slide-up">
          <div className="max-w-md mx-auto flex items-center gap-4">
            <div className="text-3xl">📱</div>
            <div className="flex-1">
              <p className="text-white font-medium">Install Afrikapedia</p>
              <p className="text-gray-400 text-sm">
                Read offline, get notifications
              </p>
            </div>
            <button
              onClick={handleInstall}
              className="bg-kente-gold text-kente-black px-4 py-2 rounded font-medium text-sm"
            >
              Install
            </button>
            <button
              onClick={dismissInstall}
              className="text-gray-400 hover:text-white p-2"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
