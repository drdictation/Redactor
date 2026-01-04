import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { loadPDF } from '../../lib/pdf-engine';
import { scanPDF } from '../../lib/auditor/scanner';
import type { ScanResult } from '../../lib/auditor/types';
import { PDFDropZone } from './PDFDropZone';
import { TrustSignal } from './TrustSignal';
import { LeakViewer } from './LeakViewer';
import { CheckCircle, Search, ShieldAlert, Loader2 } from 'lucide-react';

export const ScannerUI: React.FC = () => {
    const [isScanning, setIsScanning] = useState(false);
    const [result, setResult] = useState<ScanResult | null>(null);
    const [pdfProxy, setPdfProxy] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
    const [progress, setProgress] = useState<string>('');

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

    const hasCriticalLeaks = result?.leaks.some(l => l.severity === 'CRITICAL');
    const ghostTextLeaks = result?.leaks.filter(l => l.id.startsWith('ghost-')) || [];

    // For MVP transparency, show the first page with a ghost text leak
    const leakPage = ghostTextLeaks.length > 0 ? ghostTextLeaks[0].pageNumber : null;
    const leaksOnPage = leakPage && ghostTextLeaks.length > 0
        ? ghostTextLeaks.filter(l => l.pageNumber === leakPage)
        : [];

    return (
        <div className="space-y-8">
            <TrustSignal />

            {!result && !isScanning && (
                <PDFDropZone onFileSelect={handleFileSelect} />
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
                    <div className={`p-6 rounded-xl border-l-8 shadow-lg ${hasCriticalLeaks ? 'bg-red-50 border-red-500' : 'bg-emerald-50 border-emerald-500'}`}>
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className={`text-2xl font-bold mb-2 ${hasCriticalLeaks ? 'text-red-700' : 'text-emerald-700'}`}>
                                    {hasCriticalLeaks ? 'Security Vulnerabilities Detected' : 'Document Scan Complete'}
                                </h2>
                                <p className={hasCriticalLeaks ? 'text-red-600' : 'text-emerald-600'}>
                                    {hasCriticalLeaks
                                        ? `We found ${ghostTextLeaks.length} hidden text leak(s).`
                                        : 'No hidden text detected under redactions.'}
                                </p>
                                {/* Show redaction count prominently */}
                                {result.redactionCount > 0 && (
                                    <div className="mt-4 p-3 bg-white/60 rounded-lg border border-slate-200">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className={`w-5 h-5 ${hasCriticalLeaks ? 'text-yellow-500' : 'text-emerald-500'}`} />
                                            <span className="font-semibold text-slate-800">
                                                {result.redactionCount} redaction zone{result.redactionCount !== 1 ? 's' : ''} detected
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-600 mt-1 ml-7">
                                            {hasCriticalLeaks
                                                ? 'Some redactions contain hidden text that can be extracted.'
                                                : 'All redaction zones appear secure – no extractable text found.'}
                                        </p>
                                    </div>
                                )}
                            </div>
                            {hasCriticalLeaks ? (
                                <ShieldAlert className="w-12 h-12 text-red-500" />
                            ) : (
                                <CheckCircle className="w-12 h-12 text-emerald-500" />
                            )}
                        </div>
                    </div>

                    {/* PII Detection: Dates Found */}
                    {result.datesFound.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-4 border-b border-slate-100 bg-amber-50 flex items-center justify-between">
                                <h3 className="font-semibold text-amber-800 flex items-center gap-2">
                                    📅 Dates Detected ({result.datesFound.length})
                                </h3>
                                <span className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded">
                                    Sorted oldest → newest
                                </span>
                            </div>
                            <div className="p-4 divide-y divide-slate-100 max-h-64 overflow-y-auto">
                                {result.datesFound.map((d, idx) => (
                                    <div key={idx} className="py-2 flex items-center justify-between text-sm">
                                        <code className="font-mono text-slate-700 bg-slate-100 px-2 py-1 rounded">{d.raw}</code>
                                        <span className="text-slate-500">Page {d.pageNumber}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="p-3 bg-amber-50/50 text-amber-700 text-xs border-t border-amber-100">
                                ⚠️ Dates may include DOB, issue dates, or other sensitive information.
                            </div>
                        </div>
                    )}

                    {/* PII Detection: Names Found */}
                    {result.namesFound.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-4 border-b border-slate-100 bg-purple-50 flex items-center justify-between">
                                <h3 className="font-semibold text-purple-800 flex items-center gap-2">
                                    👤 Potential Names Detected ({result.namesFound.length})
                                </h3>
                            </div>
                            <div className="p-4 divide-y divide-slate-100 max-h-64 overflow-y-auto">
                                {result.namesFound.map((n, idx) => (
                                    <div key={idx} className="py-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-slate-800">{n.match}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded ${n.type === 'contextual' ? 'bg-blue-100 text-blue-700' :
                                                    n.type === 'common_name' ? 'bg-gray-100 text-gray-700' :
                                                        'bg-green-100 text-green-700'
                                                }`}>
                                                {n.type === 'contextual' ? 'Label Match' :
                                                    n.type === 'common_name' ? 'Common Name' : 'User Search'}
                                            </span>
                                            <span className="text-xs text-slate-400">Page {n.pageNumber}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 font-mono truncate">...{n.context}...</p>
                                    </div>
                                ))}
                            </div>
                            <div className="p-3 bg-purple-50/50 text-purple-700 text-xs border-t border-purple-100">
                                ⚠️ Names detected via contextual patterns and common name matching.
                            </div>
                        </div>
                    )}

                    {/* Visual Proof */}
                    {hasCriticalLeaks && leakPage && pdfProxy && (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                    <Search className="w-4 h-4" />
                                    Visual Proof (Page {leakPage})
                                </h3>
                                <div className="text-xs font-mono text-red-600 bg-red-100 px-2 py-1 rounded">
                                    CRITICAL: Unflattened Text
                                </div>
                            </div>
                            <div className="p-8 flex justify-center bg-slate-100/50 overflow-auto">
                                <LeakViewer pdf={pdfProxy} pageNumber={leakPage} leaks={leaksOnPage} />
                            </div>
                            <div className="p-4 bg-yellow-50 text-yellow-800 text-sm border-t border-yellow-100">
                                ⚠️ This is an X-Ray view. The red boxes show text that exists "behind" or "under" your black boxes.
                            </div>
                        </div>
                    )}

                    {/* Detailed List */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="font-bold text-lg text-slate-800">Detailed Findings</h3>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {result.leaks.length === 0 ? (
                                <div className="p-8 text-center text-slate-500">No issues found.</div>
                            ) : (
                                result.leaks.map((leak, idx) => (
                                    <div key={idx} className="p-4 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                                        <div className={`mt-1 w-2 h-2 rounded-full ${leak.severity === 'CRITICAL' ? 'bg-red-500' : leak.severity === 'HIGH' ? 'bg-orange-500' : 'bg-yellow-500'}`} />
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded ${leak.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                                                    leak.severity === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {leak.severity}
                                                </span>
                                                <span className="text-xs text-slate-400 font-mono">{leak.id}</span>
                                            </div>
                                            <p className="text-slate-700 font-medium">{leak.description}</p>
                                            {leak.pageNumber && leak.pageNumber > 0 && (
                                                <p className="text-sm text-slate-500 mt-1">Found on Page {leak.pageNumber}</p>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="text-center">
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
