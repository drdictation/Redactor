import React from 'react';
import { Layers, FileCode, History } from 'lucide-react';

/**
 * SEO content section explaining how "unredact" attacks work.
 * Each method targets specific keywords for search intent capture.
 */
export const UnredactHowItWorks: React.FC = () => {
    const methods = [
        {
            icon: Layers,
            title: 'Method 1: The "Layer Peel"',
            keyword: 'remove redaction from pdf',
            description: `Most "black box" redaction tools simply draw a rectangle on top of your text—like putting a Post-it note over a word. The text is still there, just hidden. Attackers use scripts to delete these top layers, instantly revealing everything underneath.`,
            technical: 'PDF files store content in layers. If your redaction tool added a layer instead of removing text, the original data remains in the file structure.',
        },
        {
            icon: FileCode,
            title: 'Method 2: The "Metadata Leak"',
            keyword: 'pdf sanitization check',
            description: `Even if you redact visible text, your PDF's hidden metadata often survives. Author names, edit history, keywords, and even GPS coordinates can be extracted in seconds with basic forensic tools.`,
            technical: 'PDF metadata includes XMP streams, document info dictionaries, and embedded file properties that most redaction tools ignore.',
        },
        {
            icon: History,
            title: 'Method 3: The "Incremental Save"',
            keyword: 'is pdf redaction permanent',
            description: `PDF files can store multiple versions of a document. When you "save" after redacting, the original version may still be embedded inside the file. This is why redacted PDFs are sometimes larger than the originals.`,
            technical: 'Incremental updates append new data without removing old data. Previous versions remain accessible through PDF structure analysis.',
        },
    ];

    return (
        <section className="py-16">
            <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-green-400 mb-4">
                    How Hackers <span className="text-red-400">Un-Redact</span> Your PDFs
                </h2>
                <p className="text-green-600/80 max-w-2xl mx-auto">
                    These are the exact techniques our scanner simulates. Understanding them helps you
                    recognize why basic "black box" redaction fails.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {methods.map((method, idx) => (
                    <div
                        key={idx}
                        className="bg-slate-900/50 border border-green-900/30 rounded-lg p-6 hover:border-green-700/50 transition-colors group"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-green-950/50 border border-green-800/30 flex items-center justify-center text-green-500 group-hover:text-green-400 transition-colors">
                                <method.icon className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-green-400">{method.title}</h3>
                        </div>

                        <p className="text-slate-400 text-sm leading-relaxed mb-4">
                            {method.description}
                        </p>

                        <div className="bg-black/40 rounded p-3 border border-green-900/20">
                            <p className="text-xs text-green-600/70 font-mono leading-relaxed">
                                <span className="text-green-500">// Technical:</span> {method.technical}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
