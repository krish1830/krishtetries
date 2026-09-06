import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      id="pwa-offline-indicator"
      className="fixed bottom-3 right-3 z-50 flex items-center gap-2 rounded bg-red-950/90 border border-red-500/60 px-3 py-1.5 text-[10px] font-orbitron font-bold uppercase tracking-wider text-red-200 shadow-[0_0_12px_rgba(239,68,68,0.3)] backdrop-blur-sm"
    >
      <span className="h-2 w-2 rounded-full bg-red-400 animate-ping" />
      <span>OFFLINE MODE — CACHED ASSETS ACTIVE</span>
    </div>
  );
};
export default OfflineIndicator;
