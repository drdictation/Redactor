import { X, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { saveAppState } from '../../lib/storage';
import type { Redaction } from '../../types';
import { trackPurchaseInitiated, trackPaywallShown } from '../../lib/analytics';

interface PaywallModalProps {
    isOpen: boolean;
    onClose: () => void;
    file: File | null;
    redactions: Redaction[];
}

export function PaywallModal({ isOpen, onClose, file, redactions }: PaywallModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    // Track paywall shown when modal opens
    useEffect(() => {
        if (isOpen) {
            trackPaywallShown();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-6 relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="space-y-2 text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Ready to Share This Document?</h2>
                    <p className="text-gray-600 text-lg">
                        Your preview includes a watermarked safety layer. Remove it to export a flattened, compliance-ready PDF (visual-only data).
                    </p>
                    <p className="text-sm text-gray-500 pt-2 flex items-center justify-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Local Processing: Files are processed locally in your browser and are not uploaded to our servers.
                    </p>
                </div>

                <div className="bg-yellow-50 text-yellow-800 text-sm p-3 rounded-lg text-center font-medium">
                    Note: Watermarked previews are not intended for final use.
                </div>

                <button
                    onClick={async () => {
                        setIsLoading(true);
                        trackPurchaseInitiated(5.0);
                        try {
                            if (file) {
                                console.log('[PaywallModal] File present, saving state...');
                                await saveAppState(file, redactions);
                            } else {
                                console.warn('[PaywallModal] No file prop present, skipping save state');
                            }

                            const response = await fetch('/api/create-checkout-session', {
                                method: 'POST',
                            });
                            const { url, error } = await response.json();
                            if (url) {
                                window.location.href = url;
                            } else {
                                throw new Error(error || 'Failed to create checkout session');
                            }
                        } catch (err: any) {
                            console.error(err);
                            alert(err.message || 'Payment service unavailable. Please try again later.');
                        } finally {
                            setIsLoading(false);
                        }
                    }}
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                    Finalize & Export PDF ($5)
                </button>
            </div>
        </div>
    );
}
