import React, { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

export default function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(() =>
    typeof navigator !== "undefined" ? !navigator.onLine : false
  );

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div
      className={`fixed bottom-4 left-1/2 z-50 -translate-x-1/2 transition-all duration-200 ${
        isOffline
          ? "opacity-100 translate-y-0"
          : "pointer-events-none opacity-0 translate-y-2"
      }`}
      aria-live="polite"
      aria-hidden={!isOffline}
    >
      <div className="inline-flex items-center gap-2 rounded-full border bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm">
        <WifiOff className="h-3.5 w-3.5" />
        <span>Offline</span>
      </div>
    </div>
  );
}
