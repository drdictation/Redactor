import React, { useEffect, useState } from 'react';
import { ShieldCheck, WifiOff } from 'lucide-react';

export const TrustSignal: React.FC = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center justify-center gap-3 text-sm text-emerald-800 mb-6">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span className="font-medium">
                Security Mode Active: 100% Local Sandbox.
            </span>
            <span className="hidden sm:inline opacity-75">
                Your sensitive data remains on this machine.
            </span>
            {!isOnline && (
                <div className="flex items-center gap-1 text-xs bg-emerald-100 px-2 py-0.5 rounded-full">
                    <WifiOff className="w-3 h-3" />
                    Offline
                </div>
            )}
        </div>
    );
};
