'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';

export default function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline || !showBanner) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-yellow-600/90 dark:bg-yellow-900/90 text-white dark:text-yellow-100 px-4 py-3 flex items-center justify-between backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <AlertCircle className="w-5 h-5" />
        <span className="font-medium">You&apos;re offline &mdash; saved lessons still available</span>
      </div>
      <button
        onClick={() => setShowBanner(false)}
        className="p-1 hover:bg-white/20 rounded-lg transition-all"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
