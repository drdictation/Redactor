import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface FAQItem {
    question: string;
    answer: string;
}

const faqItems: FAQItem[] = [
    {
        question: "Can you unredact a PDF locally?",
        answer: "This tool simulates common 'unredact' techniques that attackers use—like layer peeling and metadata extraction—directly in your browser. It checks whether your redaction method left any recoverable data. Crucially, no file is ever uploaded to any server. The entire analysis runs client-side using JavaScript and WebAssembly, meaning your sensitive documents stay completely private."
    },
    {
        question: "Is blacking out text in Mac Preview sufficient for redaction?",
        answer: "No, and this is one of the most common mistakes. Mac Preview's annotation tools—including the 'Redact' feature in older versions—often only draw a black box over text without removing the underlying data. Anyone with a PDF editor (even free ones like PDF-XChange) can delete the annotation layer and reveal the original text instantly. True redaction requires permanently removing the text data, not just visually covering it."
    },
    {
        question: "How do I make PDF redaction permanent and irreversible?",
        answer: "Permanent, forensics-grade redaction requires three steps: 1) Remove the actual text data from the PDF structure (not just cover it), 2) Strip all document metadata including author, edit history, and embedded files, and 3) Flatten or rasterize the document to eliminate hidden layers. Our audit tool can verify if your redaction is truly permanent. If vulnerabilities are detected, we can generate a sanitized copy that passes forensic scrutiny."
    },
    {
        question: "What does 'incremental save vulnerability' mean?",
        answer: "PDF files support 'incremental saves'—a way to append changes without rewriting the entire file. This is efficient for large documents but creates a security risk: previous versions of the document (including pre-redaction content) may remain embedded in the file. This is why redacted PDFs are sometimes larger than originals. Our scanner checks for these embedded historical versions."
    },
    {
        question: "Is this tool actually running locally in my browser?",
        answer: "Yes, 100%. You can verify this by: 1) Opening your browser's Network tab and watching for zero uploads during the scan, 2) Disconnecting from the internet after the page loads—the scanner will still work perfectly, or 3) Inspecting our open-source code. We use PDF.js (Mozilla's PDF library) for parsing and all analysis runs in your browser's JavaScript engine."
    }
];

/**
 * FAQ accordion component for the Unredact page.
 * Dark-themed with terminal aesthetics.
 */
export const UnredactFAQ: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-16">
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-950/30 rounded-full border border-green-800/30 text-xs font-mono text-green-500 uppercase tracking-wider mb-4">
                    <HelpCircle className="w-3 h-3" />
                    Frequently Asked Questions
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-green-400">
                    PDF Redaction Security FAQ
                </h2>
            </div>

            <div className="max-w-3xl mx-auto space-y-3">
                {faqItems.map((item, idx) => (
                    <div
                        key={idx}
                        className={clsx(
                            "border rounded-lg overflow-hidden transition-all",
                            openIndex === idx
                                ? "border-green-700/50 bg-slate-900/70"
                                : "border-green-900/30 bg-slate-900/30 hover:border-green-800/50"
                        )}
                    >
                        <button
                            onClick={() => toggleFAQ(idx)}
                            className="w-full px-5 py-4 flex items-center justify-between text-left"
                        >
                            <span className={clsx(
                                "font-semibold transition-colors",
                                openIndex === idx ? "text-green-400" : "text-slate-300"
                            )}>
                                {item.question}
                            </span>
                            <div className={clsx(
                                "flex-shrink-0 ml-4 transition-colors",
                                openIndex === idx ? "text-green-400" : "text-green-700"
                            )}>
                                {openIndex === idx ? (
                                    <ChevronUp className="w-5 h-5" />
                                ) : (
                                    <ChevronDown className="w-5 h-5" />
                                )}
                            </div>
                        </button>

                        {openIndex === idx && (
                            <div className="px-5 pb-5">
                                <div className="border-t border-green-900/30 pt-4">
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        {item.answer}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};
