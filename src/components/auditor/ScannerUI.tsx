import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { loadPDF } from '../../lib/pdf-engine';
import { scanPDF } from '../../lib/auditor/scanner';
import type { ScanResult } from '../../lib/auditor/types';
import { PDFDropZone } from './PDFDropZone';
import { TrustSignal } from './TrustSignal';
import { AuditPaywallModal } from '../modals/AuditPaywallModal';
import { LockedLeakViewer } from './LockedLeakViewer';
import { Search, ShieldAlert, Loader2, Lock, ShieldCheck } from 'lucide-react';

export const ScannerUI: React.FC = () => {
    const [isScanning, setIsScanning] = useState(false);
    const [result, setResult] = useState<ScanResult | null>(null);
    const [pdfProxy, setPdfProxy] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
    const [progress, setProgress] = useState<string>('');
    const [isPaywallOpen, setIsPaywallOpen] = useState(false);

    const handleFileSelect = async (file: File) => {
        setIsScanning(true);
        setResult(null);
        setPdfProxy(null);
        setProgress('Loading Document...');

        try {
            // Load
            const proxy = await loadPDF(file);
            setPdfProxy(proxy);

            setProgress('Analyzing Document Layers & Metadata...');

            // Scan
            // Small delay to allow UI to render the loading state
            await new Promise(r => setTimeout(r, 100)); // Non-blocking yield

            const scanResult = await scanPDF(proxy);
            setResult(scanResult);

        } catch (error) {
            console.error(error);
            alert('Error scanning PDF. Please try a different file.');
        } finally {
            setIsScanning(false);
            setProgress('');
        }
    };

    const hasCriticalLeaks = result?.leaks?.some(l => l.severity === 'CRITICAL');
    const ghostTextLeaks = result?.leaks?.filter(l => l.id.startsWith('ghost-')) || [];

    // Warning state: No critical leaks, but metadata/PII found or ANY other leaks
    const hasWarnings = !hasCriticalLeaks && (
        (result?.leaks?.length ?? 0) > 0 ||
        (result?.namesFound?.length ?? 0) > 0 ||
        (result?.datesFound?.length ?? 0) > 0
    );
    const isClean = !hasCriticalLeaks && !hasWarnings;

    // For MVP transparency, show the first page with a ghost text leak
    const leakPage = ghostTextLeaks.length > 0 ? ghostTextLeaks[0].pageNumber : null;

    return (
        <div className="space-y-8">
            <AuditPaywallModal isOpen={isPaywallOpen} onClose={() => setIsPaywallOpen(false)} />

            {!result && !isScanning && (
                <>
                    <div className="text-center space-y-4 mb-8">
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                            Your Redactions are Leaking. <br />
                            <span className="text-red-600">We'll Prove It.</span>
                        </h1>
                        <TrustSignal />
                    </div>

                    <PDFDropZone onFileSelect={handleFileSelect} />
                </>
            )}

            {isScanning && (
                <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-sm">
                    <div className="flex flex-col items-center justify-center gap-4 animate-pulse">
                        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                        <h3 className="text-xl font-semibold text-slate-800">Scanning...</h3>
                        <p className="text-slate-500">{progress}</p>
                    </div>
                </div>
            )}

            {result && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Dashboard Header */}
                    <div className={`p-6 rounded-xl border-l-8 shadow-lg ${hasCriticalLeaks ? 'bg-red-50 border-red-500' :
                        hasWarnings ? 'bg-orange-50 border-orange-500' :
                            'bg-blue-50 border-blue-500' // Neutral Blue for "Clean" (pending payment)
                        }`}>
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className={`text-2xl font-bold mb-2 ${hasCriticalLeaks ? 'text-red-700' :
                                    hasWarnings ? 'text-orange-800' :
                                        'text-blue-700'
                                    }`}>
                                    {hasCriticalLeaks ? 'Security Vulnerabilities Detected' :
                                        hasWarnings ? 'Potential Data Leaks Detected' :
                                            'Audit Complete'}
                                </h2>
                                <p className={
                                    hasCriticalLeaks ? 'text-red-600' :
                                        hasWarnings ? 'text-orange-700' :
                                            'text-blue-600'
                                }>
                                    {hasCriticalLeaks
                                        ? `We found ${ghostTextLeaks.length} instance(s) of Vulnerable Text Layers.`
                                        : hasWarnings
                                            ? 'Hidden metadata fingerprints found. This document is not fully sanitized.'
                                            : 'Sanitization checks passed. Unlock certified report to verify.' // Neutral copy
                                    }
                                </p>

                                {/* Show redaction count / warning details prominently */}
                                {(result.redactionCount > 0 || hasWarnings || isClean) && (
                                    <div className="mt-4 p-3 bg-white/60 rounded-lg border border-slate-200">
                                        <div className="flex items-center gap-2">
                                            {hasCriticalLeaks ? (
                                                <ShieldAlert className="w-5 h-5 text-red-600" />
                                            ) : hasWarnings ? (
                                                <ShieldAlert className="w-5 h-5 text-orange-500" />
                                            ) : (
                                                <Lock className="w-5 h-5 text-blue-500" /> // Lock icon instead of CheckCircle
                                            )}

                                            <span className="font-semibold text-slate-800">
                                                {hasCriticalLeaks ? 'Critical Issues Found' :
                                                    hasWarnings ? 'Metadata Risks Identified' :
                                                        'Unlock Green Tick Certification ($29)'}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {hasCriticalLeaks ? (
                                <ShieldAlert className="w-12 h-12 text-red-500" />
                            ) : hasWarnings ? (
                                <ShieldAlert className="w-12 h-12 text-orange-400" />
                            ) : (
                                <ShieldCheck className="w-12 h-12 text-blue-300" /> // Neutral Shield
                            )}
                        </div>
                    </div>

                    {/* Metadata "Scare" Factor */}
                    {(result.namesFound?.length ?? 0) > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                    👤 Hidden Identity Fingerprints Detected
                                </h3>
                                <span className="text-xs font-mono text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">
                                    Metadata Layer
                                </span>
                            </div>
                            <div className="p-4 divide-y divide-slate-100">
                                {result.namesFound.slice(0, 3).map((n, idx) => (
                                    <div key={idx} className="py-2 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-slate-500 text-sm">Match Found:</span>
                                            <span className="font-bold text-slate-800 tracking-wider">
                                                {n.match.substring(0, 3)}
                                                <span className="blur-[4px] select-none text-slate-400 bg-slate-100 rounded ml-0.5">•••••••</span>
                                            </span>
                                        </div>
                                        <Lock className="w-3 h-3 text-slate-400" />
                                    </div>
                                ))}
                                {(result.namesFound?.length ?? 0) > 3 && (
                                    <div className="py-2 text-center text-xs text-slate-500 italic">
                                        + {(result.namesFound?.length ?? 0) - 3} other identities hidden
                                    </div>
                                )}
                            </div>
                            <div className="p-3 bg-slate-50 text-slate-600 text-xs border-t border-slate-100 flex items-center gap-2">
                                <Lock className="w-3 h-3" />
                                Full metadata report locked.
                            </div>
                        </div>
                    )}

                    {/* Visual Proof / AHA Moment - LOCKED for conversion */}
                    {hasCriticalLeaks && leakPage && pdfProxy && (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-4 border-b border-slate-100 bg-red-50 flex items-center justify-between">
                                <h3 className="font-semibold text-red-900 flex items-center gap-2">
                                    <Search className="w-4 h-4" />
                                    Visual Proof (Page {leakPage})
                                </h3>
                                <div className="text-xs font-bold text-red-700 bg-red-100 px-2 py-1 rounded animate-pulse">
                                    ⚠️ {ghostTextLeaks.length} LEAK LOCATIONS IDENTIFIED
                                </div>
                            </div>
                            <div className="p-6 flex justify-center bg-slate-50 overflow-auto">
                                <LockedLeakViewer
                                    pdf={pdfProxy}
                                    pageNumber={leakPage}
                                    leakCount={ghostTextLeaks.length}
                                    onUnlock={() => setIsPaywallOpen(true)}
                                />
                            </div>
                        </div>
                    )}

                    {/* CTA Paywall Section - Valid for ALL STATES now */}
                    <div className="bg-indigo-900 rounded-2xl p-8 text-center text-white shadow-xl relative overflow-hidden">
                        <div className="relative z-10 space-y-6">
                            <h3 className="text-2xl font-bold">
                                {hasCriticalLeaks ? 'Resolve Critical Vulnerabilities' :
                                    hasWarnings ? 'Resolve Metadata Leaks' :
                                        'Verify & Certify Document Safety'}
                            </h3>
                            <p className="text-indigo-100 max-w-lg mx-auto">
                                {hasCriticalLeaks
                                    ? 'You have confirmed "Ghost Text" leaks that are invisible to the eye but readable by bots.'
                                    : hasWarnings
                                        ? 'Metadata fingerprints can reveal identities you intended to hide.'
                                        : 'Your document passed initial checks. Generate the official audit certificate for your legal/compliance records.'
                                }
                            </p>
                            <button
                                onClick={() => setIsPaywallOpen(true)}
                                className="inline-flex items-center gap-2 bg-white text-indigo-900 font-bold py-4 px-8 rounded-xl text-lg hover:bg-indigo-50 transition-colors shadow-lg shadow-indigo-900/50 transform hover:-translate-y-0.5"
                            >
                                Get Certified Audit Report ($29)
                            </button>
                            <p className="text-xs text-indigo-300">
                                Official compliance receipt included for legal/HR records.
                            </p>
                        </div>

                        {/* Decorative background effects */}
                        <div className="absolute top-0 right-0 p-12 opacity-10">
                            <ShieldCheck className="w-64 h-64" />
                        </div>
                    </div>

                    <div className="text-center pb-12">
                        <button
                            onClick={() => { setResult(null); setPdfProxy(null); }}
                            className="text-slate-500 hover:text-indigo-600 font-medium text-sm"
                        >
                            Scan Another Document
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
