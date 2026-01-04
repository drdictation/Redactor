import React, { useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { renderPageToCanvas } from '../../lib/pdf-engine';
import { Lock, AlertTriangle } from 'lucide-react';

interface LockedLeakViewerProps {
    pdf: pdfjsLib.PDFDocumentProxy;
    pageNumber: number;
    leakCount: number;
    onUnlock: () => void;
}

/**
 * A deliberately blurred/locked version of the LeakViewer.
 * Shows the PDF page with a heavy blur and lock overlay.
 * Users must pay to see the actual details.
 */
export const LockedLeakViewer: React.FC<LockedLeakViewerProps> = ({ pdf, pageNumber, leakCount, onUnlock }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let active = true;
        const render = async () => {
            if (!canvasRef.current || !pdf) return;

            try {
                const page = await pdf.getPage(pageNumber);
                if (!active) return;

                const unscaledViewport = page.getViewport({ scale: 1.0 });
                const wrapperWidth = wrapperRef.current?.clientWidth || 600;
                const newScale = Math.min(1.0, (wrapperWidth - 32) / unscaledViewport.width);

                await renderPageToCanvas(page, canvasRef.current, newScale);
            } catch (err) {
                console.error("Error rendering locked leak page:", err);
            }
        };
        render();
        return () => { active = false; };
    }, [pdf, pageNumber]);

    return (
        <div ref={wrapperRef} className="relative overflow-hidden rounded-xl border-2 border-dashed border-red-300 bg-slate-50 inline-block max-w-full">
            {/* Blurred Canvas */}
            <div className="relative">
                <canvas
                    ref={canvasRef}
                    className="block blur-lg opacity-60 scale-95"
                    style={{ filter: 'blur(12px) grayscale(30%)' }}
                />

                {/* Scattered Red "Leak" Indicators (fake, for effect) */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[15%] left-[20%] w-24 h-4 bg-red-500/40 rounded animate-pulse" />
                    <div className="absolute top-[35%] left-[10%] w-32 h-5 bg-red-500/50 rounded animate-pulse" />
                    <div className="absolute top-[45%] left-[25%] w-20 h-4 bg-red-500/40 rounded animate-pulse" />
                    <div className="absolute top-[60%] left-[15%] w-28 h-5 bg-red-500/50 rounded animate-pulse" />
                    <div className="absolute top-[75%] left-[30%] w-16 h-4 bg-red-500/40 rounded animate-pulse" />
                </div>
            </div>

            {/* Lock Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-white/80 via-white/60 to-white/80 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm text-center border border-slate-200">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-red-600" />
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                        {leakCount} Vulnerability Locations Detected
                    </h3>

                    <p className="text-slate-600 text-sm mb-4">
                        We've identified exactly where your document is leaking data.
                        <br />
                        <span className="font-semibold text-red-600">Unlock the full report to see what's exposed.</span>
                    </p>

                    <div className="flex items-center justify-center gap-2 text-xs text-orange-700 bg-orange-50 rounded-lg p-2 mb-4 border border-orange-100">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Actual leaked content hidden for security</span>
                    </div>

                    <button
                        onClick={onUnlock}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg shadow-indigo-600/20"
                    >
                        Unlock Unlimited Audits ($29)
                    </button>
                </div>
            </div>
        </div>
    );
};
