import { X, Loader2, Shield, Check } from 'lucide-react';
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
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative animate-in fade-in zoom-in duration-200">
                {/* Header / Close */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
                    <div>
                        <div className="flex items-center gap-2 text-blue-600 mb-2">
                            <Shield className="w-5 h-5" />
                            <span className="font-bold text-xs tracking-wide uppercase">Professional Export</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Remove Watermark</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Value Props */}
                    <div className="space-y-4">
                        <div className="flex gap-3 items-start">
                            <div className="mt-1 p-0.5 bg-green-100 rounded-full">
                                <Check className="w-3 h-3 text-green-600" />
                            </div>
                            <p className="text-gray-600 text-sm"><strong>Clean Export:</strong> Remove "ReactPDF" watermarks.</p>
                        </div>
                        <div className="flex gap-3 items-start">
                            <div className="mt-1 p-0.5 bg-green-100 rounded-full">
                                <Check className="w-3 h-3 text-green-600" />
                            </div>
                            <p className="text-gray-600 text-sm"><strong>Legal Ready:</strong> Flattened, non-reversible edits.</p>
                        </div>
                        <div className="flex gap-3 items-start">
                            <div className="mt-1 p-0.5 bg-green-100 rounded-full">
                                <Check className="w-3 h-3 text-green-600" />
                            </div>
                            <p className="text-gray-600 text-sm"><strong>Secure:</strong> Files processed 100% locally.</p>
                        </div>
                        <div className="flex gap-3 items-start">
                            <div className="mt-1 p-0.5 bg-green-100 rounded-full">
                                <Check className="w-3 h-3 text-green-600" />
                            </div>
                            <p className="text-gray-600 text-sm"><strong>Unlimited Session:</strong> Redact & export multiple files in this tab.</p>
                        </div>
                    </div>

                    {/* Pricing Box */}
                    <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 text-center space-y-1">
                        <p className="text-gray-400 text-xs font-medium line-through">Standard Price: $19.00</p>
                        <div className="flex items-center justify-center gap-2 text-gray-900">
                            <span className="text-3xl font-bold tracking-tight">$5.00</span>
                            <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-200 uppercase tracking-wide">
                                Launch Offer
                            </span>
                        </div>
                        <p className="text-blue-600/80 text-sm font-medium pt-1">One-time payment • <strong>Unlimited session exports</strong></p>
                    </div>

                    {/* Action */}
                    <div className="space-y-3">
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
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ productId: 'redactor' }),
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
                            className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-lg shadow-lg shadow-blue-600/20 hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                            Unlock Export Now ($5)
                        </button>

                        <div className="flex items-center justify-center gap-4 text-[10px] text-gray-400">
                            <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Secure Payment</span>
                            <span className="flex items-center gap-1">Money-back Guarantee</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
