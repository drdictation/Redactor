import React, { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { loadPDF } from '../../lib/pdf-engine';
import { scanPDF } from '../../lib/auditor/scanner';
import { sanitizePDF } from '../../lib/auditor/sanitizer';
import type { ScanResult } from '../../lib/auditor/types';
import { PDFDropZone } from './PDFDropZone';
import { AuditPaywallModal } from '../modals/AuditPaywallModal';
import { LockedLeakViewer } from './LockedLeakViewer';
import { LeakViewer } from './LeakViewer';
import { loadAuditState, clearAuditState } from '../../lib/auditor/storage';
import { generateAuditReport } from '../../lib/auditor/report';
import { trackPurchaseCompleted, trackScanInitiated, trackScanCompleted } from '../../lib/analytics';
import { trackPaywallCTAClick } from '../analytics/GoogleAdsTracker';
import { useDynamicHeadline } from '../../hooks/useDynamicHeadline';
import { Search, ShieldAlert, Loader2, Lock, ShieldCheck, Download, CheckCircle, Sparkles } from 'lucide-react';

const AUDIT_SESSION_KEY = 'audit_session_paid';

export const ScannerUI: React.FC = () => {
    const headline = useDynamicHeadline();
    const [isScanning, setIsScanning] = useState(false);
    const [result, setResult] = useState<ScanResult | null>(null);
    const [pdfProxy, setPdfProxy] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState<string>('');
    const [isPaywallOpen, setIsPaywallOpen] = useState(false);
    const [isPaid, setIsPaid] = useState(() => {
        // Check sessionStorage on initial load for existing session
        return sessionStorage.getItem(AUDIT_SESSION_KEY) === 'true';
    });
    const [isDownloading, setIsDownloading] = useState(false);
    const [isSanitizing, setIsSanitizing] = useState(false);

    // On mount: check for payment return and restore state
    useEffect(() => {
        const init = async () => {
            const params = new URLSearchParams(window.location.search);
            const sessionId = params.get('session_id');
            const product = params.get('product');

            if (sessionId && product === 'audit_report_29') {
                console.log('[AuditScanner] Payment return detected, verifying...');
                try {
                    const res = await fetch(`/api/verify-payment?session_id=${sessionId}`);
                    const data = await res.json();

                    if (res.ok && data.verified) {
                        console.log('[AuditScanner] Payment verified!');
                        setIsPaid(true);
                        // Store in sessionStorage for unlimited session access
                        sessionStorage.setItem(AUDIT_SESSION_KEY, 'true');
                        trackPurchaseCompleted(sessionId, 29.0);

                        // Restore state from IndexedDB
                        const { file: savedFile, result: savedResult } = await loadAuditState();

                        if (savedFile && savedResult) {
                            console.log('[AuditScanner] Restoring saved state...');
                            setFile(savedFile);
                            setResult(savedResult);

                            // Also reload PDF proxy for LeakViewer
                            const proxy = await loadPDF(savedFile);
                            setPdfProxy(proxy);
                        }

                        // Clear storage after restore
                        await clearAuditState();

                        // Clean URL
                        window.history.replaceState({}, '', window.location.pathname);
                    } else {
                        console.error('[AuditScanner] Payment verification failed:', data.error);
                        alert('Payment verification failed. Please contact support if you were charged.');
                    }
                } catch (err) {
                    console.error('[AuditScanner] Error verifying payment:', err);
                }
            }
        };
        init();
    }, []);

    const handleFileSelect = async (selectedFile: File) => {
        setIsScanning(true);
        setResult(null);
        setPdfProxy(null);
        setFile(selectedFile);
        setProgress('Loading Document...');

        // Track scan initiation (privacy: only file size, not name)
        trackScanInitiated(selectedFile.size);
        const scanStartTime = Date.now();

        try {
            const proxy = await loadPDF(selectedFile);
            setPdfProxy(proxy);

            setProgress('Analyzing Document Layers & Metadata...');
            await new Promise(r => setTimeout(r, 100));

            const scanResult = await scanPDF(proxy);
            setResult(scanResult);

            // Track scan completion with metrics
            const hasGhostText = scanResult.leaks?.some(l => l.id.startsWith('ghost-')) ?? false;
            const hasMetadata = scanResult.leaks?.some(l => l.id.startsWith('meta-')) ?? false;
            trackScanCompleted(
                scanResult.leaks?.length ?? 0,
                hasGhostText,
                hasMetadata,
                Date.now() - scanStartTime
            );

        } catch (error) {
            console.error(error);
            alert('Error scanning PDF. Please try a different file.');
        } finally {
            setIsScanning(false);
            setProgress('');
        }
    };

    const handleDownloadReport = async () => {
        if (!file || !result) return;
        setIsDownloading(true);
        try {
            const pdfBytes = await generateAuditReport(file.name, result);
            const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Audit-Report-${file.name.replace('.pdf', '')}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Error generating report:', err);
            alert('Failed to generate report. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    const handleSanitize = async () => {
        if (!file) return;
        setIsSanitizing(true);
        try {
            const pdfBytes = await sanitizePDF(file);
            const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Sanitized-${file.name}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Error sanitizing PDF:', err);
            alert('Failed to sanitize PDF. Please try again.');
        } finally {
            setIsSanitizing(false);
        }
    };

    const hasCriticalLeaks = result?.leaks?.some(l => l.severity === 'CRITICAL');
    const ghostTextLeaks = result?.leaks?.filter(l => l.id.startsWith('ghost-')) || [];

    const hasWarnings = !hasCriticalLeaks && (
        (result?.leaks?.length ?? 0) > 0 ||
        (result?.namesFound?.length ?? 0) > 0 ||
        (result?.datesFound?.length ?? 0) > 0
    );
    const isClean = !hasCriticalLeaks && !hasWarnings;

    const leakPage = ghostTextLeaks.length > 0 ? ghostTextLeaks[0].pageNumber : null;
    const leaksOnPage = leakPage && ghostTextLeaks.length > 0
        ? ghostTextLeaks.filter(l => l.pageNumber === leakPage)
        : [];

    return (
        <div className="space-y-8">
            <AuditPaywallModal
                isOpen={isPaywallOpen}
                onClose={() => setIsPaywallOpen(false)}
                file={file ?? undefined}
                scanResult={result ?? undefined}
            />

            {!result && !isScanning && (
                <>
                    <div className="text-center space-y-6 mb-10">
                        {/* Product Label */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200 text-xs font-medium text-slate-600 uppercase tracking-wider">
                            <Search className="w-3 h-3" />
                            PDF Redaction Auditor
                        </div>

                        {/* Main Headline - Dynamic based on ?target= URL param */}
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                            {headline.mainText} <br />
                            <span className="bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">{headline.emphasisText}</span>
                        </h1>

                        {/* Subtitle - Benefits Focused */}
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                            Adobe, Word, and most tools leave <strong className="text-slate-800">hidden text</strong> behind that anyone can copy/paste.
                            Drop your PDF — we'll scan it <strong className="text-slate-800">100% locally</strong> and find what they missed.
                        </p>

                        {/* Inline Trust Indicators */}
                        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                            <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                                <ShieldCheck className="w-4 h-4" />
                                <span className="font-medium">100% Private</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200">
                                <Lock className="w-4 h-4" />
                                <span className="font-medium">No Upload</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                                <ShieldAlert className="w-4 h-4" />
                                <span className="font-medium">Ghost Text Detection</span>
                            </div>
                        </div>
                    </div>

                    <PDFDropZone onFileSelect={handleFileSelect} />

                    {/* Additional Trust Below CTA */}
                    <div className="mt-6 text-center">
                        <p className="text-xs text-slate-400">
                            🔒 Your file never leaves your browser. Zero server upload. Works offline.
                        </p>
                    </div>
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
                    {/* Success Banner for Paid Users */}
                    {isPaid && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                            <div>
                                <p className="font-bold text-green-800">Payment Verified! Full Report Unlocked.</p>
                                <p className="text-sm text-green-700">Download your certified audit report below.</p>
                            </div>
                        </div>
                    )}

                    {/* Dashboard Header */}
                    <div className={`p-6 rounded-xl border-l-8 shadow-lg ${hasCriticalLeaks ? 'bg-red-50 border-red-500' :
                        hasWarnings ? 'bg-orange-50 border-orange-500' :
                            'bg-blue-50 border-blue-500'
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
                                            : 'Sanitization checks passed. Unlock certified report to verify.'
                                    }
                                </p>

                                {(result.redactionCount > 0 || hasWarnings || isClean) && (
                                    <div className="mt-4 p-3 bg-white/60 rounded-lg border border-slate-200">
                                        <div className="flex items-center gap-2">
                                            {hasCriticalLeaks ? (
                                                <ShieldAlert className="w-5 h-5 text-red-600" />
                                            ) : hasWarnings ? (
                                                <ShieldAlert className="w-5 h-5 text-orange-500" />
                                            ) : (
                                                <Lock className="w-5 h-5 text-blue-500" />
                                            )}

                                            <span className="font-semibold text-slate-800">
                                                {hasCriticalLeaks ? 'Critical Issues Found' :
                                                    hasWarnings ? 'Metadata Risks Identified' :
                                                        isPaid ? 'Document Verified' : 'Unlock Green Tick Certification ($29)'}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Inline CTA — appears for ALL result types when unpaid */}
                                {!isPaid && (
                                    <button
                                        onClick={() => {
                                            trackPaywallCTAClick();
                                            setIsPaywallOpen(true);
                                        }}
                                        className={`mt-4 inline-flex items-center gap-2 font-bold py-2.5 px-5 rounded-lg transition-all transform hover:-translate-y-0.5 text-sm shadow-md ${
                                            hasCriticalLeaks
                                                ? 'bg-red-600 text-white hover:bg-red-700 shadow-red-600/20'
                                                : hasWarnings
                                                    ? 'bg-orange-600 text-white hover:bg-orange-700 shadow-orange-600/20'
                                                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/20'
                                        }`}
                                    >
                                        {hasCriticalLeaks ? 'Get Full Report ($29)' :
                                            hasWarnings ? 'Resolve Metadata Leaks ($29)' :
                                                'Get Certified Proof ($29)'}
                                    </button>
                                )}
                            </div>
                            {hasCriticalLeaks ? (
                                <ShieldAlert className="w-12 h-12 text-red-500" />
                            ) : hasWarnings ? (
                                <ShieldAlert className="w-12 h-12 text-orange-400" />
                            ) : (
                                <ShieldCheck className="w-12 h-12 text-blue-300" />
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
                                {result.namesFound.slice(0, isPaid ? 10 : 3).map((n, idx) => (
                                    <div key={idx} className="py-2 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-slate-500 text-sm">Match Found:</span>
                                            <span className="font-bold text-slate-800 tracking-wider">
                                                {isPaid ? n.match : (
                                                    <>
                                                        {n.match.substring(0, 3)}
                                                        <span className="blur-[4px] select-none text-slate-400 bg-slate-100 rounded ml-0.5">•••••••</span>
                                                    </>
                                                )}
                                            </span>
                                        </div>
                                        {!isPaid && <Lock className="w-3 h-3 text-slate-400" />}
                                    </div>
                                ))}
                                {!isPaid && (result.namesFound?.length ?? 0) > 3 && (
                                    <div className="py-2 text-center text-xs text-slate-500 italic">
                                        + {(result.namesFound?.length ?? 0) - 3} other identities hidden
                                    </div>
                                )}
                            </div>
                            {!isPaid && (
                                <div className="p-3 bg-slate-50 text-slate-600 text-xs border-t border-slate-100 flex items-center gap-2">
                                    <Lock className="w-3 h-3" />
                                    Full metadata report locked.
                                </div>
                            )}
                        </div>
                    )}

                    {/* Visual Proof Section - LOCKED or UNLOCKED based on payment */}
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
                                {isPaid ? (
                                    <LeakViewer pdf={pdfProxy} pageNumber={leakPage} leaks={leaksOnPage} />
                                ) : (
                                    <LockedLeakViewer
                                        pdf={pdfProxy}
                                        pageNumber={leakPage}
                                        leakCount={ghostTextLeaks.length}
                                        onUnlock={() => setIsPaywallOpen(true)}
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    {/* CTA Section - Different for paid vs unpaid */}
                    {isPaid ? (
                        <div className="bg-green-900 rounded-2xl p-8 text-center text-white shadow-xl relative overflow-hidden">
                            <div className="relative z-10 space-y-6">
                                <h3 className="text-2xl font-bold">Your Full Report is Unlocked</h3>
                                <p className="text-green-100 max-w-lg mx-auto">
                                    Download your audit certificate or get a fully sanitized copy with all leaks removed.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    {/* Audit Report Download */}
                                    <button
                                        onClick={handleDownloadReport}
                                        disabled={isDownloading}
                                        className="inline-flex items-center justify-center gap-2 bg-white text-green-900 font-bold py-4 px-6 rounded-xl text-base hover:bg-green-50 transition-colors shadow-lg"
                                    >
                                        {isDownloading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <Download className="w-5 h-5" />
                                        )}
                                        {isDownloading ? 'Generating...' : 'Audit Report (PDF)'}
                                    </button>

                                    {/* Sanitized PDF Download - Only show if leaks were found */}
                                    {(hasCriticalLeaks || hasWarnings) && (
                                        <button
                                            onClick={handleSanitize}
                                            disabled={isSanitizing}
                                            className="inline-flex items-center justify-center gap-2 bg-emerald-500 text-white font-bold py-4 px-6 rounded-xl text-base hover:bg-emerald-400 transition-colors shadow-lg"
                                        >
                                            {isSanitizing ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <Sparkles className="w-5 h-5" />
                                            )}
                                            {isSanitizing ? 'Sanitizing...' : 'Download Sanitized PDF'}
                                        </button>
                                    )}
                                </div>

                                <p className="text-xs text-green-200">
                                    Sanitized PDFs are rasterized (no hidden text) with all metadata stripped.
                                </p>
                            </div>
                            <div className="absolute top-0 right-0 p-12 opacity-10">
                                <ShieldCheck className="w-64 h-64" />
                            </div>
                        </div>
                    ) : (
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
                                    onClick={() => {
                                        trackPaywallCTAClick();
                                        setIsPaywallOpen(true);
                                    }}
                                    className="inline-flex items-center gap-2 bg-white text-indigo-900 font-bold py-4 px-8 rounded-xl text-lg hover:bg-indigo-50 transition-colors shadow-lg shadow-indigo-900/50 transform hover:-translate-y-0.5"
                                >
                                    Unlock Unlimited Audits ($29)
                                </button>
                                <p className="text-xs text-indigo-300">
                                    Scan unlimited documents this session • Official compliance receipt included
                                </p>
                            </div>
                            <div className="absolute top-0 right-0 p-12 opacity-10">
                                <ShieldCheck className="w-64 h-64" />
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pb-12">
                        <button
                            onClick={() => { setResult(null); setPdfProxy(null); setFile(null); }}
                            className="text-slate-500 hover:text-indigo-600 font-medium text-sm"
                        >
                            Scan Another Document
                        </button>

                        <div className="h-4 w-px bg-slate-300 hidden sm:block"></div>

                        <a
                            href={import.meta.env.DEV ? '/' : 'https://reactpdf.app'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-bold text-sm bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100 transition-colors"
                        >
                            {hasCriticalLeaks || hasWarnings ? (
                                <>
                                    <ShieldCheck className="w-4 h-4" />
                                    <span>Fix Leaks with Redactor</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4" />
                                    <span>Redact Another Document</span>
                                </>
                            )}
                        </a>
                    </div>
                </div>
            )}

            {/* Sticky Bottom CTA Bar — always visible while scrolling results */}
            {result && !isPaid && (
                <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] p-3 animate-in slide-in-from-bottom duration-300">
                    <div className="container mx-auto max-w-2xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-sm">
                            <ShieldAlert className={`w-4 h-4 ${hasCriticalLeaks ? 'text-red-500' : hasWarnings ? 'text-orange-500' : 'text-indigo-500'}`} />
                            <span className="text-slate-700 font-medium hidden sm:inline">
                                {hasCriticalLeaks
                                    ? `${ghostTextLeaks.length} critical leak${ghostTextLeaks.length !== 1 ? 's' : ''} found`
                                    : hasWarnings
                                        ? `${result.namesFound?.length ?? 0} metadata fingerprint${(result.namesFound?.length ?? 0) !== 1 ? 's' : ''} found`
                                        : 'Audit complete'
                                }
                            </span>
                        </div>
                        <button
                            onClick={() => {
                                trackPaywallCTAClick();
                                setIsPaywallOpen(true);
                            }}
                            className={`font-bold py-2 px-5 rounded-lg text-sm transition-all whitespace-nowrap ${
                                hasCriticalLeaks
                                    ? 'bg-red-600 text-white hover:bg-red-700'
                                    : hasWarnings
                                        ? 'bg-orange-600 text-white hover:bg-orange-700'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                            }`}
                        >
                            {hasCriticalLeaks ? 'Get Full Report — $29' :
                                hasWarnings ? 'Resolve Leaks — $29' :
                                    'Get Certified — $29'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
