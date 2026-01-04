import { ShieldCheck, Download, Lock } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PaywallModal } from '../modals/PaywallModal';

import type { Redaction } from '../../types';

interface HeaderProps {
    onExport?: () => void;
    isPaid?: boolean;
    hasFile?: boolean;
    file?: File | null;
    redactions?: Redaction[];
}

export function Header({ onExport, isPaid, hasFile, file, redactions }: HeaderProps) {
    const [showPaywall, setShowPaywall] = useState(false);

    // Check if we are on the auditor subdomain
    const isAuditor = typeof window !== 'undefined' && window.location.hostname.startsWith('audit.');
    const MAIN_URL = 'https://redactpdf.app';
    const AUDITOR_URL = 'https://audit.redactpdf.app';

    // Status text logic
    const statusText = isPaid
        ? "Session Active · Valid until tab closed"
        : "Preview Mode · Watermark Applied";

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        {/* Logo Link Logic:
                            - If on Auditor: Link back to Main App (external/absolute)
                            - If on Main App: Link to Home (internal)
                        */}
                        {isAuditor ? (
                            <a href={MAIN_URL} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                                <div className="p-2 bg-gray-900 rounded-lg">
                                    <ShieldCheck className="w-5 h-5 text-green-400" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900 tracking-tight">RedactPDF</h1>
                                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block -mt-1">Auditor</span>
                                </div>
                            </a>
                        ) : (
                            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                                <div className="p-2 bg-gray-900 rounded-lg">
                                    <ShieldCheck className="w-5 h-5 text-green-400" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900 tracking-tight">RedactPDF</h1>
                                </div>
                            </Link>
                        )}

                        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full border border-green-100">
                            <Lock className="w-3 h-3 text-green-600" />
                            <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">Secure Mode: Offline</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Navigation Links */}
                        {!isAuditor ? (
                            <a
                                href={AUDITOR_URL}
                                className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50"
                            >
                                <ShieldCheck className="w-4 h-4" />
                                Verify / Audit PDF
                            </a>
                        ) : (
                            // Link back to Redactor from Auditor
                            <a
                                href={MAIN_URL}
                                className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100"
                            >
                                ← Back to Redactor
                            </a>
                        )}

                        <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

                        <div className="hidden sm:block text-sm text-gray-500">
                            {isPaid ? (
                                <span className="text-green-600 font-medium flex items-center gap-1">
                                    {statusText}
                                </span>
                            ) : (
                                <span>{statusText}</span>
                            )}
                        </div>

                        {/* CTA Buttons - Only show on Main App (Redactor) */}
                        {!isAuditor && (
                            !isPaid ? (
                                <button
                                    onClick={() => setShowPaywall(true)}
                                    className="px-4 py-2 rounded-lg font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm flex items-center gap-2"
                                >
                                    <Lock className="w-4 h-4" />
                                    Unlock Export
                                </button>
                            ) : (
                                hasFile && (
                                    <button
                                        onClick={onExport}
                                        className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all flex items-center gap-2 shadow-sm"
                                    >
                                        <Download className="w-4 h-4" />
                                        <span className="hidden sm:inline">Export PDF</span>
                                    </button>
                                )
                            )
                        )}
                    </div>
                </div>
            </header>

            <PaywallModal
                isOpen={showPaywall}
                onClose={() => setShowPaywall(false)}
                file={file || null}
                redactions={redactions || []}
            />
        </>
    );
}
