import { useMemo, useRef, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { CheckCircle2, FileSearch, FileUp, Lock, ShieldAlert, ShieldCheck, Sparkles } from 'lucide-react';

import { Footer } from '../core/Footer';
import type { ScanResult } from '../../lib/auditor/types';
import {
    countPdfAnnotationsBytes,
    countPdfFormFieldsBytes,
    countSensitiveMetadataFieldsBytes,
    downloadPdfBytes,
    flattenPdfFormFieldsFromFile,
    removePdfCommentsFromFile,
    removePdfHiddenTextFromFile,
    removePdfMetadataFromFile,
    scanPdfBytes,
    scanPdfForPii,
} from '../../lib/pdf-tools/actions';
import { getPdfToolById, getPdfToolByPath } from '../../lib/pdf-tools/catalog';

interface ResultMetric {
    label: string;
    value: string;
}

interface ToolResult {
    metrics: ResultMetric[];
    outputBytes?: Uint8Array;
    outputName?: string;
    scanResult?: ScanResult;
}

function formatOutputFileName(prefix: string | undefined, originalName: string) {
    const safeName = originalName.toLowerCase().endsWith('.pdf') ? originalName : `${originalName}.pdf`;
    return `${prefix ?? 'processed'}-${safeName}`;
}

export function PDFToolPage() {
    const location = useLocation();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const tool = useMemo(() => getPdfToolByPath(location.pathname), [location.pathname]);

    const [fileName, setFileName] = useState('');
    const [isWorking, setIsWorking] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState<ToolResult | null>(null);

    if (!tool) {
        return <Navigate to="/" replace />;
    }

    const relatedTools = tool.relatedToolIds
        .map((toolId) => getPdfToolById(toolId))
        .filter((value): value is NonNullable<typeof value> => Boolean(value));

    const processFile = async (file: File) => {
        setFileName(file.name);
        setError('');
        setResult(null);
        setIsWorking(true);

        try {
            if (tool.mode === 'metadata_strip') {
                const sourceBytes = await file.arrayBuffer();
                const before = await countSensitiveMetadataFieldsBytes(sourceBytes);
                const outputBytes = await removePdfMetadataFromFile(file);
                const after = await countSensitiveMetadataFieldsBytes(outputBytes);

                setResult({
                    outputBytes,
                    outputName: formatOutputFileName(tool.downloadPrefix, file.name),
                    metrics: [
                        { label: 'Sensitive metadata fields found', value: String(before) },
                        { label: 'Sensitive metadata fields remaining', value: String(after) },
                        { label: 'Recommended next step', value: 'Run the paid Auditor' },
                    ],
                });
                return;
            }

            if (tool.mode === 'comments_remove') {
                const sourceBytes = await file.arrayBuffer();
                const before = await countPdfAnnotationsBytes(sourceBytes);
                const outputBytes = await removePdfCommentsFromFile(file);
                const after = await countPdfAnnotationsBytes(outputBytes);

                setResult({
                    outputBytes,
                    outputName: formatOutputFileName(tool.downloadPrefix, file.name),
                    metrics: [
                        { label: 'Page annotations found before cleanup', value: String(before) },
                        { label: 'Page annotations remaining after cleanup', value: String(after) },
                        { label: 'Recommended next step', value: 'Verify with the paid Auditor' },
                    ],
                });
                return;
            }

            if (tool.mode === 'hidden_text_remove') {
                const outputBytes = await removePdfHiddenTextFromFile(file);
                const audit = await scanPdfBytes(outputBytes);
                const criticalLeaks = audit.leaks.filter((leak) => leak.severity === 'CRITICAL').length;

                setResult({
                    outputBytes,
                    outputName: formatOutputFileName(tool.downloadPrefix, file.name),
                    metrics: [
                        { label: 'Critical ghost-text leaks found after flattening', value: String(criticalLeaks) },
                        { label: 'Metadata / annotation leak findings after flattening', value: String(audit.leaks.length) },
                        { label: 'Recommended next step', value: 'Download now, then open the paid Auditor if sharing externally' },
                    ],
                });
                return;
            }

            if (tool.mode === 'form_flatten') {
                const sourceBytes = await file.arrayBuffer();
                const before = await countPdfFormFieldsBytes(sourceBytes);
                const outputBytes = await flattenPdfFormFieldsFromFile(file);
                const after = await countPdfFormFieldsBytes(outputBytes);

                setResult({
                    outputBytes,
                    outputName: formatOutputFileName(tool.downloadPrefix, file.name),
                    metrics: [
                        { label: 'Interactive form fields before flattening', value: String(before) },
                        { label: 'Interactive form fields remaining', value: String(after) },
                        { label: 'Recommended next step', value: 'Run the paid Auditor before sending the final packet' },
                    ],
                });
                return;
            }

            const scanResult = await scanPdfForPii(file);
            const criticalLeaks = scanResult.leaks.filter((leak) => leak.severity === 'CRITICAL').length;

            setResult({
                scanResult,
                metrics: [
                    { label: 'Names detected', value: String(scanResult.namesFound.length) },
                    { label: 'Dates detected', value: String(scanResult.datesFound.length) },
                    { label: 'Metadata + leak findings', value: String(scanResult.leaks.length) },
                    { label: 'Critical ghost-text findings', value: String(criticalLeaks) },
                ],
            });
        } catch (toolError) {
            console.error(toolError);
            setError('Unable to process that PDF. Please try another file.');
        } finally {
            setIsWorking(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900">
            <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
                <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-4">
                    <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
                        <div className="rounded-xl bg-slate-900 p-2">
                            <ShieldCheck className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div>
                            <div className="text-lg font-bold tracking-tight">ReactPDF</div>
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">PDF Utilities</div>
                        </div>
                    </Link>
                    <div className="flex items-center gap-2 text-sm">
                        <Link to="/auditor" className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 font-medium text-indigo-700 hover:bg-indigo-100">
                            Paid Auditor
                        </Link>
                        <Link to="/" className="rounded-lg border border-slate-200 px-3 py-2 font-medium text-slate-700 hover:bg-slate-100">
                            Redaction Tool
                        </Link>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-10">
                <div className="mx-auto max-w-6xl space-y-8">
                    <section className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                                <Sparkles className="h-3.5 w-3.5" />
                                {tool.badge}
                            </div>
                            <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                                {tool.name}
                            </h1>
                            <p className="mt-4 max-w-3xl text-lg text-slate-600">{tool.headline}</p>
                            <p className="mt-4 max-w-3xl text-base text-slate-500">{tool.description}</p>
                            <div className="mt-6 grid gap-3 sm:grid-cols-3">
                                {tool.bullets.map((bullet) => (
                                    <div key={bullet} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                                        {bullet}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-slate-900 p-8 text-white shadow-sm">
                            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
                                <Lock className="h-4 w-4" />
                                Funnel to paid tools
                            </div>
                            <h2 className="mt-4 text-2xl font-bold">{tool.funnelTitle}</h2>
                            <p className="mt-4 text-sm leading-6 text-slate-300">{tool.funnelBody}</p>
                            <div className="mt-6 space-y-3">
                                {tool.funnelTargets.map((target) => (
                                    <Link
                                        key={target}
                                        to={target}
                                        className="flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-medium text-white hover:border-indigo-400 hover:bg-slate-700"
                                    >
                                        <span>{target === '/auditor' ? 'Open the paid PDF Auditor' : 'Open the paid redaction workflow'}</span>
                                        <span>→</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 shadow-sm">
                            <div className="flex items-center gap-3 text-slate-800">
                                <FileUp className="h-5 w-5 text-indigo-600" />
                                <h2 className="text-xl font-bold">Upload a PDF</h2>
                            </div>
                            <button
                                onClick={() => inputRef.current?.click()}
                                disabled={isWorking}
                                className="mt-6 flex w-full flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center transition hover:border-indigo-400 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <FileSearch className="mb-4 h-10 w-10 text-slate-400" />
                                <span className="text-lg font-semibold text-slate-800">
                                    {isWorking ? 'Processing your PDF…' : 'Choose a PDF to process'}
                                </span>
                                <span className="mt-2 text-sm text-slate-500">
                                    Client-side processing only. Nothing is uploaded to a server.
                                </span>
                            </button>
                            <input
                                ref={inputRef}
                                type="file"
                                accept="application/pdf"
                                className="hidden"
                                onChange={(event) => {
                                    const file = event.target.files?.[0];
                                    if (file) {
                                        void processFile(file);
                                    }
                                    event.currentTarget.value = '';
                                }}
                            />
                            {fileName && (
                                <p className="mt-4 text-sm text-slate-500">
                                    Last file: <span className="font-medium text-slate-700">{fileName}</span>
                                </p>
                            )}
                            {error && (
                                <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {error}
                                </div>
                            )}
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900">{tool.resultHeading}</h2>
                            {!result ? (
                                <p className="mt-4 text-sm leading-6 text-slate-500">
                                    Process a file to see verification metrics, download output, and jump into the paid tools that close the loop.
                                </p>
                            ) : (
                                <div className="mt-6 space-y-4">
                                    {result.metrics.map((metric) => (
                                        <div key={metric.label} className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                            <span className="text-sm text-slate-600">{metric.label}</span>
                                            <span className="text-right text-sm font-semibold text-slate-900">{metric.value}</span>
                                        </div>
                                    ))}

                                    {result.outputBytes && result.outputName && (
                                        <button
                                            onClick={() => downloadPdfBytes(result.outputBytes!, result.outputName!)}
                                            className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                                        >
                                            Download {result.outputName}
                                        </button>
                                    )}

                                    {result.scanResult && (
                                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                                            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Sample findings</h3>
                                            <div className="mt-4 space-y-3 text-sm text-slate-700">
                                                {result.scanResult.leaks.slice(0, 4).map((leak) => (
                                                    <div key={leak.id} className="flex gap-3">
                                                        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                                                        <span>{leak.description}</span>
                                                    </div>
                                                ))}
                                                {result.scanResult.namesFound.slice(0, 3).map((name, index) => (
                                                    <div key={`${name.match}-${index}`} className="flex gap-3">
                                                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                                                        <span>Name found: {name.match}</span>
                                                    </div>
                                                ))}
                                                {result.scanResult.datesFound.slice(0, 3).map((date, index) => (
                                                    <div key={`${date.raw}-${index}`} className="flex gap-3">
                                                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                                                        <span>Date found: {date.raw}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900">What this tool does not replace</h2>
                            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                                {tool.limitations.map((item) => (
                                    <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900">Related tools</h2>
                            <div className="mt-4 grid gap-3">
                                {relatedTools.map((relatedTool) => (
                                    <Link
                                        key={relatedTool.id}
                                        to={relatedTool.path}
                                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-indigo-300 hover:bg-indigo-50"
                                    >
                                        <div className="text-sm font-semibold text-slate-900">{relatedTool.name}</div>
                                        <div className="mt-1 text-sm text-slate-600">{relatedTool.headline}</div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
