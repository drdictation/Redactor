import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist';
import { loadPDF } from '../../lib/pdf-engine';
import { findSuggestions } from '../../lib/auto-suggest';
import { exportRedactedPDF } from '../../lib/export';
import { getRouteConfig } from '../../lib/landingCopy';
import type { Redaction } from '../../types';
import { PDFUploader } from './PDFUploader';
import { PageCanvas } from '../canvas/PageCanvas';
import { Header } from './Header';
import { Loader2, MousePointerClick, X, ShieldCheck, Lock, Download } from 'lucide-react';
import { loadAppState, clearAppState } from '../../lib/storage';
import { Footer } from './Footer';
import { TrustMarquee } from './TrustMarquee';

import {
    trackLandingPageView,
    trackUploadStarted,
    trackUploadCompleted,
    trackPreviewRendered,
    trackPurchaseCompleted,
} from '../../lib/analytics';

export function Workspace() {
    const location = useLocation();
    const routeConfig = getRouteConfig(location.pathname);

    const [file, setFile] = useState<File | null>(null);
    const [pages, setPages] = useState<pdfjsLib.PDFPageProxy[]>([]);

    const [redactions, setRedactions] = useState<Redaction[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [isPaid, setIsPaid] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [showInstruction, setShowInstruction] = useState(true);

    useEffect(() => {
        const init = async () => {
            const params = new URLSearchParams(window.location.search);
            const sessionId = params.get('session_id');

            if (sessionId) {
                console.log('[Workspace] Session ID detected, verifying...', sessionId);
                try {
                    const res = await fetch(`/api/verify-payment?session_id=${sessionId}`);
                    const data = await res.json();

                    if (res.ok && data.verified) {
                        console.log('[Workspace] Payment verified by server.');
                        setIsPaid(true);

                        // Fire purchase conversion (GA4 + Google Ads, deduplicated)
                        trackPurchaseCompleted(sessionId, 5.0);

                        // Restore state
                        const { file: savedFile, redactions: savedRedactions } = await loadAppState();

                        if (savedFile) {
                            console.log('[Workspace] Saved file found, restoring...');
                            await handleFileSelect(savedFile);
                            if (savedRedactions) {
                                console.log('[Workspace] Restoring redactions:', savedRedactions.length);
                                setRedactions(savedRedactions);
                            }
                        } else {
                            console.warn('[Workspace] No saved file found in storage.');
                        }
                        // Clear state after restoring
                        await clearAppState();

                        // Clean URL
                        window.history.replaceState({}, '', window.location.pathname);
                    } else {
                        console.error('[Workspace] Payment verification failed:', data.error);
                        alert('Payment verification failed. Please contact support if you were charged.');
                    }
                } catch (err) {
                    console.error('[Workspace] Error verifying payment:', err);
                }
            }
        };
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // Warning before leaving if paid session is active
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isPaid) {
                e.preventDefault();
                e.returnValue = ''; // Required for most browsers
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isPaid]);

    const handleFileSelect = async (selectedFile: File) => {
        setIsProcessing(true);

        // Track upload started
        trackUploadStarted(selectedFile.size, selectedFile.type);

        try {
            setFile(selectedFile);
            const doc = await loadPDF(selectedFile);

            const loadedPages: pdfjsLib.PDFPageProxy[] = [];
            for (let i = 1; i <= doc.numPages; i++) {
                loadedPages.push(await doc.getPage(i));
            }
            setPages(loadedPages);

            // Track upload completed and preview rendered
            trackUploadCompleted(loadedPages.length);
            trackPreviewRendered(loadedPages.length);

            runAutoSuggest(loadedPages);

        } catch (err) {
            console.error(err);
            alert('Failed to load PDF.');
            setFile(null);
        } finally {
            setIsProcessing(false);
        }
    };

    const runAutoSuggest = async (loadedPages: pdfjsLib.PDFPageProxy[]) => {
        const newRedactions: Redaction[] = [];

        for (let i = 0; i < loadedPages.length; i++) {
            const suggestions = await findSuggestions(loadedPages[i], i);
            newRedactions.push(...suggestions);
        }

        if (newRedactions.length > 0) {
            setRedactions(prev => [...prev, ...newRedactions]);
        }
    };

    // Auto-dismiss instruction when redactions are added
    useEffect(() => {
        if (redactions.length > 0) {
            setShowInstruction(false);
        }
    }, [redactions]);

    const handleExport = async () => {
        if (!isPaid) return; // Security check: Prevent export for unpaid users
        if (!file || exporting) return;
        setExporting(true);
        try {
            console.log('[Workspace] Starting export...', {
                fileName: file.name,
                fileType: file.type,
                fileSize: file.size,
                redactionCount: redactions.length,
                isPaid
            });
            const pdfBytes = await exportRedactedPDF(file, redactions, isPaid);

            const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `redacted-${file.name}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            console.log('[Workspace] Export successful');

        } catch (err: any) {
            console.error('[Workspace] Export error:', err);
            alert(`Export failed: ${err.message || err}`);
        } finally {
            setExporting(false);
        }
    };

    const addRedaction = (r: Redaction) => {
        setRedactions(prev => [...prev, r]);
    };

    const removeRedaction = (id: string) => {
        setRedactions(prev => prev.filter(r => r.id !== id));
    };

    // Track landing page view when no file is loaded (landing state)
    useEffect(() => {
        if (!file) {
            trackLandingPageView(location.pathname);
        }
    }, [file, location.pathname]);

    if (!file) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Header isPaid={isPaid} hasFile={false} />
                <div className="flex-1 flex flex-col items-center justify-center p-4 gap-6">
                    <div className="text-center space-y-3 max-w-3xl mx-auto mt-4 sm:mt-8">
                        {/* Security Hero Banner */}
                        {routeConfig.securityHero && (
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-full text-green-800 text-sm font-semibold animate-in slide-in-from-top-4 duration-700">
                                <ShieldCheck className="w-4 h-4" />
                                {routeConfig.securityHero}
                            </div>
                        )}

                        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                            {routeConfig.h1}
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            {routeConfig.subhead}
                        </p>

                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border shadow-sm text-sm text-gray-600">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            {routeConfig.trustSignals}
                        </div>
                    </div>


                    <PDFUploader onFileSelect={handleFileSelect} isProcessing={isProcessing} ctaText={routeConfig.ctaText} />

                    <div className="w-full">
                        <TrustMarquee />
                    </div>

                    <div className="grid sm:grid-cols-3 gap-6 max-w-5xl w-full px-4 text-center">
                        {routeConfig.items.map((bullet, idx) => (
                            <div key={idx} className="space-y-3 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="font-bold text-gray-900 text-lg flex items-center justify-center gap-2">
                                    {idx === 0 && <Lock className="w-5 h-5 text-blue-500" />}
                                    {idx === 1 && <ShieldCheck className="w-5 h-5 text-green-500" />}
                                    {idx === 2 && <Download className="w-5 h-5 text-purple-500" />}
                                    {bullet.title}
                                </div>
                                <p className="text-sm text-gray-500 leading-relaxed">{bullet.text}</p>
                            </div>
                        ))}
                    </div>

                    {/* Unique Content Section - SEO: Avoids doorway page penalty */}
                    {routeConfig.uniqueContent && (
                        <div className="w-full max-w-4xl mx-auto px-4 py-12 space-y-8">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {routeConfig.uniqueContent.title}
                                </h2>
                                <div className="prose prose-gray max-w-none">
                                    {routeConfig.uniqueContent.paragraphs.map((paragraph, idx) => (
                                        <p key={idx} className="text-gray-600 leading-relaxed mb-4">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </div>

                            {/* FAQ Section */}
                            {routeConfig.uniqueContent.faq && routeConfig.uniqueContent.faq.length > 0 && (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Frequently Asked Questions
                                    </h2>
                                    <div className="space-y-6">
                                        {routeConfig.uniqueContent.faq.map((item, idx) => (
                                            <div key={idx} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                                <h3 className="font-semibold text-gray-900 mb-2">
                                                    {item.question}
                                                </h3>
                                                <p className="text-gray-600 text-sm leading-relaxed">
                                                    {item.answer}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex-1" /> {/* Spacer */}
                    <Footer />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-100/50 relative">
            <Header
                isPaid={isPaid}
                hasFile={true}
                onExport={handleExport}
                file={file}
                redactions={redactions}
            />

            <div className="sticky top-16 z-40 bg-white/90 backdrop-blur border-b px-4 py-2 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{file.name}</span>
                    <span className="text-gray-300">|</span>
                    <span>{pages.length} Pages</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-xs text-gray-500">Limits: up to 10 pages, 10MB</span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowResetConfirm(true)}
                        className="text-sm text-red-600 hover:text-red-700 font-medium px-3 py-1"
                    >
                        Reset
                    </button>
                    {showResetConfirm && (
                        <div className="fixed inset-0 z-[70] bg-black/20 backdrop-blur-sm flex items-center justify-center p-4">
                            <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full space-y-4">
                                <h3 className="text-lg font-bold text-gray-900">Clear all redactions?</h3>
                                <p className="text-gray-600">This will remove all redaction boxes and return to the upload screen.</p>
                                <div className="flex gap-3 justify-end">
                                    <button
                                        onClick={() => setShowResetConfirm(false)}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            setRedactions([]);
                                            setFile(null);
                                            setPages([]);
                                            setShowResetConfirm(false);
                                        }}
                                        className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg font-medium"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-4 sm:p-8 flex flex-col items-center gap-8">
                {pages.map((page, index) => (
                    <div key={index} className="relative w-full">
                        <div className="absolute -left-8 sm:-left-12 top-0 text-xs text-gray-400 font-mono hidden sm:block">
                            Page {index + 1}
                        </div>

                        <div className="flex justify-center">
                            <PageCanvas
                                page={page}
                                pageIndex={index}
                                redactions={redactions}
                                onAddRedaction={addRedaction}
                                onRemoveRedaction={removeRedaction}
                                isPaid={isPaid}
                            />
                        </div>
                    </div>
                ))}

                <div className="h-20" /> {/* Spacer */}
            </div>

            {/* Teaching Toast */}
            {showInstruction && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 fade-in duration-700">
                    <div className="bg-gray-900 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-4 border border-gray-700">
                        <div className="p-2 bg-blue-600 rounded-full animate-pulse">
                            <MousePointerClick className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-sm">Start Redacting</span>
                            <span className="text-xs text-gray-300">Click & drag anywhere to hide text</span>
                        </div>
                        <button
                            onClick={() => setShowInstruction(false)}
                            className="ml-2 hover:bg-gray-800 p-1 rounded-full transition-colors"
                        >
                            <X className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>
                </div>
            )}

            {exporting && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-2xl shadow-2xl flex flex-col items-center gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                        <div className="text-center">
                            <h3 className="text-lg font-bold text-gray-900">Flattening Document</h3>
                            <p className="text-gray-500">Converting to flattened images...</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
