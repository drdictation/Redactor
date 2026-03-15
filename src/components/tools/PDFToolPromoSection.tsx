import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

import { getPdfToolById } from '../../lib/pdf-tools/catalog';
import type { PdfToolId } from '../../lib/pdf-tools/catalog';

interface PDFToolPromoSectionProps {
    title: string;
    description: string;
    toolIds: PdfToolId[];
    eyebrow?: string;
}

export function PDFToolPromoSection({
    title,
    description,
    toolIds,
    eyebrow = 'Popular PDF utilities',
}: PDFToolPromoSectionProps) {
    const tools = toolIds
        .map((toolId) => getPdfToolById(toolId))
        .filter((tool): tool is NonNullable<typeof tool> => Boolean(tool));

    if (tools.length === 0) {
        return null;
    }

    return (
        <section className="w-full max-w-5xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">
                        <Sparkles className="h-3.5 w-3.5" />
                        {eyebrow}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h2>
                        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{description}</p>
                    </div>
                </div>
                <Link
                    to="/auditor"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-900"
                >
                    Open PDF Auditor
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
                        <p className="mt-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                            {tool.badge}
                        </p>
                    </Link>
                ))}
            </div>
        </section>
    );
}
