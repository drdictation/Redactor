import { X, Loader2, ShieldCheck, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { trackPurchaseInitiated, trackPaywallShown } from '../../lib/analytics';
import { clsx } from 'clsx';

interface AuditPaywallModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AuditPaywallModal({ isOpen, onClose }: AuditPaywallModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            trackPaywallShown(); // You might want a specific event for this later, e.g., trackAuditPaywallShown
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative animate-in fade-in zoom-in duration-200 border border-slate-200">

                {/* Header */}
                <div className="p-6 border-b border-slate-100 bg-slate-50/80">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2 text-indigo-700 mb-1">
                            <ShieldCheck className="w-5 h-5" />
                            <span className="font-bold text-xs tracking-wide uppercase">Certified Security Audit</span>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mt-2">Unlock Certified Report</h2>
                </div>

                <div className="p-6 space-y-6">
                    {/* Compliance/Value Props */}
                    <div className="space-y-4">
                        <p className="text-slate-600 text-sm leading-relaxed">
                            To view the full contents of the hidden text leaks and generate a <strong>Certified Sanitization Report</strong> for your compliance records, please complete your purchase.
                        </p>

                        <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 flex gap-3">
                            <Lock className="w-5 h-5 text-amber-600 shrink-0" />
                            <div className="text-xs text-amber-800">
                                <strong>Why is this locked?</strong><br />
                                Detailed leak content is sensitive. We require verified access to generate the official legal/HR compliance receipt.
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 text-center space-y-1">
                        <div className="flex items-center justify-center gap-2 text-slate-900">
                            <span className="text-3xl font-bold tracking-tight">$29.00</span>
                        </div>
                        <p className="text-indigo-600/80 text-sm font-medium">One-time audit fee • <strong>Official Receipt Included</strong></p>
                    </div>

                    {/* Action */}
                    <button
                        onClick={async () => {
                            setIsLoading(true);
                            trackPurchaseInitiated(29.0);
                            try {
                                const response = await fetch('/api/create-checkout-session', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        productId: 'audit_report_29', // Make sure backend handles this!
                                        // If backend is generic, you might need to adjust or rely on price lookup
                                    }),
                                });
                                const { url, error } = await response.json();
                                if (url) {
                                    window.location.href = url;
                                } else {
                                    throw new Error(error || 'Failed to create checkout session');
                                }
                            } catch (err: any) {
                                console.error(err);
                                alert('Payment service unavailable. Please try again later.');
                            } finally {
                                setIsLoading(false);
                            }
                        }}
                        disabled={isLoading}
                        className={clsx(
                            "w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-lg shadow-lg shadow-indigo-600/20 hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2",
                            isLoading && "opacity-75 cursor-wait"
                        )}
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Get Certified Report"}
                    </button>

                    <div className="text-center">
                        <p className="text-[10px] text-slate-400">
                            Secure Payment via Stripe • 100% Money-back Guarantee
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
