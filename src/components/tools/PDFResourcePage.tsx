import { useEffect } from 'react';
import { ArrowRight, CheckCircle2, FileText, ShieldCheck } from 'lucide-react';
import { Link, Navigate, useLocation } from 'react-router-dom';

import { Footer } from '../core/Footer';
import { getPdfToolByPath } from '../../lib/pdf-tools/catalog';
import { getPdfResourceByPath } from '../../lib/pdf-resources/catalog';
import { trackGuidePageView, trackGuidePrimaryClick } from '../../lib/analytics';

export function PDFResourcePage() {
    const location = useLocation();
    const resource = getPdfResourceByPath(location.pathname);

    useEffect(() => {
        if (resource) {
            trackGuidePageView(resource.path, resource.kind);
        }
    }, [resource]);

    if (!resource) {
        return <Navigate to="/tools" replace />;
    }

    const primaryTool = getPdfToolByPath(resource.primaryToolPath);
    const getDirectLabel = (target: string) => {
        if (target === '/auditor') return 'Open PDF Auditor';
        if (target === '/') return 'Open Redaction Tool';
        return 'Open recommended page';
    };

    const secondaryTool = resource.secondaryToolPath ? getPdfToolByPath(resource.secondaryToolPath) : undefined;
    const relatedEntries = resource.relatedPaths
        .map((path) => getPdfToolByPath(path) ?? getPdfResourceByPath(path))
        .filter((item): item is NonNullable<typeof item> => Boolean(item));

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900">
            <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
                <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-4">
                    <Link to="/tools" className="flex items-center gap-3 transition-opacity hover:opacity-90">
                        <div className="rounded-xl bg-slate-900 p-2">
                            <ShieldCheck className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div>
                            <div className="text-lg font-bold tracking-tight">ReactPDF</div>
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">PDF Guides</div>
                        </div>
                    </Link>
                    <div className="flex items-center gap-2 text-sm">
                        <Link to="/tools" className="rounded-lg border border-slate-200 px-3 py-2 font-medium text-slate-700 hover:bg-slate-100">
                            All Tools
                        </Link>
                        <Link to="/auditor" className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 font-medium text-indigo-700 hover:bg-indigo-100">
                            PDF Auditor
                        </Link>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-10">
                <div className="mx-auto max-w-5xl space-y-8">
                    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
                        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">
                            <FileText className="h-3.5 w-3.5" />
                            {resource.eyebrow}
                        </div>
                        <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">{resource.title}</h1>
                        <p className="mt-4 text-lg leading-8 text-slate-600">{resource.summary}</p>
                    </section>

                    <section className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                            <h2 className="text-2xl font-bold text-slate-900">Why this page exists</h2>
                            <p className="mt-4 text-base leading-7 text-slate-600">{resource.problem}</p>
                            <div className="mt-6 space-y-4">
                                {resource.whyItMatters.map((paragraph) => (
                                    <p key={paragraph} className="text-sm leading-7 text-slate-600">{paragraph}</p>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-slate-900 p-8 text-white shadow-sm">
                            <h2 className="text-2xl font-bold">Recommended tools</h2>
                            <div className="mt-6 space-y-3">
                                {primaryTool ? (
                                    <Link to={primaryTool.path} onClick={() => trackGuidePrimaryClick(resource.path, primaryTool.path)} className="flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-800 px-4 py-4 text-sm font-medium hover:border-indigo-400 hover:bg-slate-700">
                                        <span>{primaryTool.name}</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                ) : (
                                    <Link to={resource.primaryToolPath} onClick={() => trackGuidePrimaryClick(resource.path, resource.primaryToolPath)} className="flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-800 px-4 py-4 text-sm font-medium hover:border-indigo-400 hover:bg-slate-700">
                                        <span>{getDirectLabel(resource.primaryToolPath)}</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                )}
                                {secondaryTool && (
                                    <Link to={secondaryTool.path} onClick={() => trackGuidePrimaryClick(resource.path, secondaryTool.path)} className="flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-800 px-4 py-4 text-sm font-medium hover:border-indigo-400 hover:bg-slate-700">
                                        <span>{secondaryTool.name}</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </section>

                    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                        <h2 className="text-2xl font-bold text-slate-900">Quick checklist</h2>
                        <div className="mt-6 grid gap-4 md:grid-cols-3">
                            {resource.checklist.map((item) => (
                                <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-700">
                                    <div className="mb-3 inline-flex rounded-full bg-emerald-100 p-2 text-emerald-700">
                                        <CheckCircle2 className="h-4 w-4" />
                                    </div>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </section>

                    {relatedEntries.length > 0 && (
                        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                            <h2 className="text-2xl font-bold text-slate-900">Related pages</h2>
                            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {relatedEntries.map((entry) => (
                                    <Link key={entry.path} to={entry.path} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-indigo-300 hover:bg-indigo-50">
                                        <div className="text-sm font-semibold text-slate-900">{'title' in entry ? entry.title : entry.name}</div>
                                        <div className="mt-2 text-sm leading-6 text-slate-600">{'summary' in entry ? entry.summary : entry.headline}</div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
