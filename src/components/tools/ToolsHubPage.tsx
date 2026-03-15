import { ArrowRight, FileSearch, FileText, Lock, ScanSearch, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Footer } from '../core/Footer';
import { PDF_TOOLS } from '../../lib/pdf-tools/catalog';
import type { PdfToolDefinition, PdfToolMode } from '../../lib/pdf-tools/catalog';

interface ToolCluster {
    mode: PdfToolMode;
    title: string;
    description: string;
    icon: typeof FileText;
}

const CLUSTERS: ToolCluster[] = [
    {
        mode: 'metadata_strip',
        title: 'Metadata Cleanup',
        description: 'Remove author names, producer details, creator fields, and other hidden document properties before sharing.',
        icon: FileText,
    },
    {
        mode: 'comments_remove',
        title: 'Comments & Markup Removal',
        description: 'Delete notes, highlights, sticky notes, and review markup left behind by common PDF editors.',
        icon: Sparkles,
    },
    {
        mode: 'hidden_text_remove',
        title: 'Flattening & Hidden Text Removal',
        description: 'Create image-based PDFs that are easier to share safely when layered text or redaction leaks are a concern.',
        icon: Lock,
    },
    {
        mode: 'pii_scan',
        title: 'PII & Leak Scanning',
        description: 'Scan for names, dates, metadata, and likely sensitive-data exposure before the PDF leaves your control.',
        icon: ScanSearch,
    },
    {
        mode: 'form_flatten',
        title: 'Form Finalization',
        description: 'Flatten editable form fields so completed PDFs behave like finalized copies instead of working drafts.',
        icon: FileSearch,
    },
];

function getToolsForMode(mode: PdfToolMode): PdfToolDefinition[] {
    return PDF_TOOLS.filter((tool) => tool.mode === mode);
}

export function ToolsHubPage() {
    const featuredPaths = new Set([
        '/tools/remove-pdf-metadata',
        '/tools/remove-pdf-comments',
        '/tools/remove-hidden-text',
        '/tools/scan-pdf-for-pii',
        '/tools/flatten-fillable-pdf',
    ]);

    const featuredTools = PDF_TOOLS.filter((tool) => featuredPaths.has(tool.path));

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900">
            <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
                <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-4">
                    <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
                        <div className="rounded-xl bg-slate-900 p-2">
                            <Lock className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div>
                            <div className="text-lg font-bold tracking-tight">ReactPDF</div>
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">PDF Tools Library</div>
                        </div>
                    </Link>
                    <div className="flex items-center gap-2 text-sm">
                        <Link to="/auditor" className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 font-medium text-indigo-700 hover:bg-indigo-100">
                            PDF Auditor
                        </Link>
                        <Link to="/" className="rounded-lg border border-slate-200 px-3 py-2 font-medium text-slate-700 hover:bg-slate-100">
                            Redaction Tool
                        </Link>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-10">
                <div className="mx-auto max-w-6xl space-y-10">
                    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
                        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">
                            <Sparkles className="h-3.5 w-3.5" />
                            Browse all PDF tools
                        </div>
                        <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                            PDF tools for cleanup, review, flattening, and safer sharing.
                        </h1>
                        <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-600">
                            Explore focused tools for removing metadata, clearing comments, flattening text layers, scanning for sensitive data,
                            and finalizing filled PDFs. Every tool runs in your browser without uploading the file.
                        </p>
                        <div className="mt-8 grid gap-4 md:grid-cols-5">
                            {featuredTools.map((tool) => (
                                <Link
                                    key={tool.id}
                                    to={tool.path}
                                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-indigo-300 hover:bg-indigo-50"
                                >
                                    <div className="text-sm font-semibold text-slate-900">{tool.name}</div>
                                    <div className="mt-2 text-sm leading-6 text-slate-600">{tool.headline}</div>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {CLUSTERS.map((cluster) => {
                        const Icon = cluster.icon;
                        const tools = getToolsForMode(cluster.mode);

                        return (
                            <section key={cluster.mode} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                    <div>
                                        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                                            <Icon className="h-3.5 w-3.5" />
                                            {cluster.title}
                                        </div>
                                        <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{cluster.title}</h2>
                                        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">{cluster.description}</p>
                                    </div>
                                </div>

                                <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                    {tools.map((tool) => (
                                        <Link
                                            key={tool.id}
                                            to={tool.path}
                                            className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-indigo-300 hover:bg-indigo-50"
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <span className="text-sm font-semibold text-slate-900">{tool.name}</span>
                                                <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:text-indigo-600" />
                                            </div>
                                            <p className="mt-3 text-sm leading-6 text-slate-600">{tool.headline}</p>
                                            <p className="mt-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">{tool.badge}</p>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        );
                    })}
                </div>
            </main>

            <Footer />
        </div>
    );
}
