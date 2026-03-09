import React, { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { loadPDF } from '../../lib/pdf-engine';
import { scanPDF } from '../../lib/auditor/scanner';
import type { ScanResult } from '../../lib/auditor/types';
import { UnredactDropZone } from './UnredactDropZone';
import { AuditPaywallModal } from '../modals/AuditPaywallModal';
import { loadAuditState, clearAuditState } from '../../lib/auditor/storage';
import { trackPurchaseCompleted } from '../../lib/analytics';
import { trackPaywallCTAClick } from '../analytics/GoogleAdsTracker';
import {
    ShieldAlert, ShieldCheck, AlertTriangle, Terminal,
    Lock, Download, Zap
} from 'lucide-react';
import { clsx } from 'clsx';

const AUDIT_SESSION_KEY = 'audit_session_paid';

// Console log messages for the typewriter effect
const CONSOLE_MESSAGES = [
    '> Initializing forensics engine...',
    '> Analyzing PDF layer structure...',
    '> Checking for incremental save history...',
    '> Scanning XMP metadata streams...',
    '> Extracting hidden XML properties...',
    '> Attempting text recovery from redaction layers...',
    '> Running layer peel simulation...',
    '> Finalizing vulnerability assessment...',
];

/**
 * Main scanner UI for the Unredact page.
 * Features terminal-style console output during scanning.
 */
export const UnredactScanner: React.FC = () => {
    const [isScanning, setIsScanning] = useState(false);
    const [result, setResult] = useState<ScanResult | null>(null);
    const [_pdfProxy, setPdfProxy] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [consoleLines, setConsoleLines] = useState<string[]>([]);
    const [isPaywallOpen, setIsPaywallOpen] = useState(false);
    const [isPaid, setIsPaid] = useState(() => {
        return sessionStorage.getItem(AUDIT_SESSION_KEY) === 'true';
    });

    // Payment return handler
    useEffect(() => {
        const init = async () => {
            const params = new URLSearchParams(window.location.search);
            const sessionId = params.get('session_id');
            const product = params.get('product');

            if (sessionId && product === 'audit_report_29') {
                try {
                    const res = await fetch(`/api/verify-payment?session_id=${sessionId}`);
                    const data = await res.json();

                    if (res.ok && data.verified) {
                        setIsPaid(true);
                        sessionStorage.setItem(AUDIT_SESSION_KEY, 'true');
                        trackPurchaseCompleted(sessionId, 29.0);

                        const { file: savedFile, result: savedResult } = await loadAuditState();
                        if (savedFile && savedResult) {
                            setFile(savedFile);
                            setResult(savedResult);
                            const proxy = await loadPDF(savedFile);
                            setPdfProxy(proxy);
                        }
                        await clearAuditState();
                        window.history.replaceState({}, '', window.location.pathname);
                    }
                } catch (err) {
                    console.error('[UnredactScanner] Payment verification error:', err);
                }
            }
        };
        init();
    }, []);

    // Console animation effect
    useEffect(() => {
        if (!isScanning) return;

        let currentIndex = 0;
        setConsoleLines([CONSOLE_MESSAGES[0]]);

        const interval = setInterval(() => {
            currentIndex++;
            if (currentIndex < CONSOLE_MESSAGES.length) {
                setConsoleLines(prev => [...prev, CONSOLE_MESSAGES[currentIndex]]);
            }
        }, 400);

        return () => clearInterval(interval);
    }, [isScanning]);

    const handleFileSelect = async (selectedFile: File) => {
        setIsScanning(true);
        setResult(null);
        setPdfProxy(null);
        setFile(selectedFile);
        setConsoleLines([]);

        try {
            const proxy = await loadPDF(selectedFile);
            setPdfProxy(proxy);

            // Wait for console animation to complete
            await new Promise(r => setTimeout(r, CONSOLE_MESSAGES.length * 400 + 500));

            const scanResult = await scanPDF(proxy);
            setResult(scanResult);
        } catch (error) {
            console.error(error);
            setConsoleLines(prev => [...prev, '> ERROR: Failed to parse PDF structure.']);
        } finally {
            setIsScanning(false);
        }
    };

    const handleReset = () => {
        setResult(null);
        setPdfProxy(null);
        setFile(null);
        setConsoleLines([]);
    };

    // Determine vulnerability status
    const isVulnerable = result && (
        (result.leaks?.some(l => l.severity === 'CRITICAL')) ||
        (result.leaks?.length ?? 0) > 0 ||
        (result.namesFound?.length ?? 0) > 0
    );
    const vulnerabilityCount = (result?.leaks?.length ?? 0) + (result?.namesFound?.length ?? 0);

    return (
        <div className="space-y-8">
            <AuditPaywallModal
                isOpen={isPaywallOpen}
                onClose={() => setIsPaywallOpen(false)}
                file={file ?? undefined}
                scanResult={result ?? undefined}
            />

            {/* Hero Section */}
            {!result && !isScanning && (
                <>
                    <div className="text-center space-y-6 mb-10">
                        {/* Product Label */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-950/30 rounded-full border border-green-800/30 text-xs font-mono text-green-500 uppercase tracking-wider">
                            <Terminal className="w-3 h-3" />
                            PDF Redaction Reversibility Tester
                        </div>

                        {/* Main Headline - H1 for SEO */}
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                            <span className="text-slate-200">Hackers use scripts to </span>
                            <span className="text-red-500">un-redact</span>
                            <span className="text-slate-200"> PDFs.</span>
                            <br />
                            <span className="text-green-400">Is your file vulnerable?</span>
                        </h1>

                        {/* Subtext */}
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            Many "black box" tools only draw a layer on top of the text.
                            This tool attempts to <strong className="text-green-400">strip those layers</strong> to
                            see if the original data remains. <strong className="text-slate-300">100% Client-Side.</strong>
                        </p>

                        {/* Trust Indicators */}
                        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                            <div className="flex items-center gap-2 text-sm text-green-500 bg-green-950/30 px-3 py-1.5 rounded-full border border-green-800/30 font-mono">
                                <Lock className="w-4 h-4" />
                                <span>No Upload</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-green-500 bg-green-950/30 px-3 py-1.5 rounded-full border border-green-800/30 font-mono">
                                <Terminal className="w-4 h-4" />
                                <span>Browser-Only</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-amber-500 bg-amber-950/30 px-3 py-1.5 rounded-full border border-amber-800/30 font-mono">
                                <Zap className="w-4 h-4" />
                                <span>Forensics-Grade</span>
                            </div>
                        </div>
                    </div>

                    <UnredactDropZone onFileSelect={handleFileSelect} />

                    <div className="mt-6 text-center">
                        <p className="text-xs text-green-700 font-mono">
                            🔒 Your file never leaves your browser. Zero server upload. Works offline.
                        </p>
                    </div>
                </>
            )}

            {/* Console Animation During Scan */}
            {isScanning && (
                <div className="bg-black rounded-lg border border-green-900/50 overflow-hidden shadow-2xl">
                    {/* Terminal Header */}
                    <div className="bg-slate-900 px-4 py-2 border-b border-green-900/30 flex items-center gap-2">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
                        </div>
                        <span className="text-xs text-slate-500 font-mono ml-2">unredact-forensics.sh</span>
                    </div>

                    {/* Console Output */}
                    <div className="p-6 font-mono text-sm min-h-[300px]">
                        {consoleLines.map((line, idx) => (
                            <div
                                key={idx}
                                className={clsx(
                                    "mb-2 animate-in fade-in slide-in-from-left-2 duration-200",
                                    line.includes('ERROR') ? 'text-red-400' : 'text-green-400'
                                )}
                            >
                                {line}
                            </div>
                        ))}
                        <div className="flex items-center gap-1 text-green-400">
                            <span>{'>'}</span>
                            <span className="w-2 h-4 bg-green-400 animate-pulse"></span>
                        </div>
                    </div>
                </div>
            )}

            {/* Results Section */}
            {result && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Result Banner */}
                    <div className={clsx(
                        "rounded-xl p-8 border-l-8 text-center",
                        isVulnerable
                            ? "bg-red-950/50 border-red-500"
                            : "bg-green-950/50 border-green-500"
                    )}>
                        <div className="flex flex-col items-center gap-4">
                            {isVulnerable ? (
                                <>
                                    <div className="w-20 h-20 rounded-full bg-red-900/50 flex items-center justify-center animate-pulse">
                                        <ShieldAlert className="w-10 h-10 text-red-400" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-red-400">
                                        VULNERABLE
                                    </h2>
                                    <p className="text-red-300 max-w-md">
                                        <strong>{vulnerabilityCount} hidden layer{vulnerabilityCount !== 1 ? 's' : ''}</strong> detected.
                                        Your redacted data may be recoverable.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <div className="w-20 h-20 rounded-full bg-green-900/50 flex items-center justify-center">
                                        <ShieldCheck className="w-10 h-10 text-green-400" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-green-400">
                                        PASSED
                                    </h2>
                                    <p className="text-green-300 max-w-md">
                                        Text appears properly flattened. No obvious recovery vectors detected.
                                    </p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Detected Issues (if vulnerable) */}
                    {isVulnerable && (
                        <div className="bg-slate-900/70 rounded-xl border border-red-900/30 overflow-hidden">
                            <div className="px-5 py-4 border-b border-red-900/30 bg-red-950/30 flex items-center justify-between">
                                <h3 className="font-semibold text-red-400 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    Detected Vulnerabilities
                                </h3>
                                <span className="text-xs font-mono text-red-500 bg-red-950/50 px-2 py-1 rounded">
                                    {vulnerabilityCount} ISSUE{vulnerabilityCount !== 1 ? 'S' : ''}
                                </span>
                            </div>
                            <div className="p-5 space-y-3 font-mono text-sm">
                                {result.leaks?.slice(0, isPaid ? 10 : 3).map((leak, idx) => {
                                    // Mask leak descriptions for unpaid users to prevent giving away paid content
                                    const maskedDescription = (() => {
                                        if (isPaid) return leak.description;
                                        // Mask any quoted text in the description (e.g. 'Ghost Text detected: "John Smith"')
                                        return leak.description.replace(/"([^"]{3})[^"]*"/g, '"$1•••••"');
                                    })();
                                    return (
                                    <div key={idx} className="flex items-start gap-3 text-slate-400">
                                        <span className="text-red-500">✗</span>
                                        <div>
                                            <span className="text-slate-300">{maskedDescription}</span>
                                            {leak.pageNumber && (
                                                <span className="text-slate-500"> (Page {leak.pageNumber})</span>
                                            )}
                                            {!isPaid && idx === 2 && (result.leaks?.length ?? 0) > 3 && (
                                                <div className="mt-2 text-slate-500 flex items-center gap-1">
                                                    <Lock className="w-3 h-3" />
                                                    + {(result.leaks?.length ?? 0) - 3} more hidden
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    );
                                })}
                                {result.namesFound?.slice(0, isPaid ? 5 : 2).map((name, idx) => (
                                    <div key={`name-${idx}`} className="flex items-start gap-3 text-slate-400">
                                        <span className="text-amber-500">⚠</span>
                                        <span>
                                            Metadata identity: {isPaid ? name.match : `${name.match.slice(0, 3)}•••••`}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* CTA Section */}
                    <div className={clsx(
                        "rounded-xl p-8 text-center border",
                        isVulnerable
                            ? "bg-gradient-to-b from-red-950/50 to-slate-900 border-red-900/30"
                            : "bg-gradient-to-b from-green-950/50 to-slate-900 border-green-900/30"
                    )}>
                        {isPaid ? (
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-green-400">Full Report Unlocked</h3>
                                <p className="text-slate-400 text-sm max-w-md mx-auto">
                                    Download your certified audit report or get a sanitized PDF copy.
                                </p>
                                <button className="inline-flex items-center gap-2 bg-green-600 text-black font-bold py-3 px-6 rounded-lg hover:bg-green-500 transition-colors">
                                    <Download className="w-5 h-5" />
                                    Download Audit Report
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-slate-200">
                                    {isVulnerable ? 'Secure This File' : 'Get Certified Proof'}
                                </h3>
                                <p className="text-slate-400 text-sm max-w-md mx-auto">
                                    {isVulnerable
                                        ? 'Unlock the full vulnerability report and get a sanitized, forensics-proof copy.'
                                        : 'Generate official audit documentation for compliance or legal records.'}
                                </p>
                                <button
                                    onClick={() => {
                                        trackPaywallCTAClick();
                                        setIsPaywallOpen(true);
                                    }}
                                    className={clsx(
                                        "inline-flex items-center gap-2 font-bold py-4 px-8 rounded-lg transition-all transform hover:-translate-y-0.5",
                                        isVulnerable
                                            ? "bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-900/50"
                                            : "bg-green-600 text-black hover:bg-green-500 shadow-lg shadow-green-900/50"
                                    )}
                                >
                                    {isVulnerable ? 'Emergency Clean ($29)' : 'Certify Document ($29)'}
                                </button>
                                <p className="text-xs text-slate-500">
                                    Unlimited audits this session • Sanitized PDF included
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Scan Another */}
                    <div className="text-center">
                        <button
                            onClick={handleReset}
                            className="text-green-600 hover:text-green-400 font-mono text-sm"
                        >
                            {'>'} Scan Another Document
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
