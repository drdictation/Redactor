import React, { useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { renderPageToCanvas } from '../../lib/pdf-engine'; // Assumed existing
import type { Leak } from '../../lib/auditor/types';

interface LeakViewerProps {
    pdf: pdfjsLib.PDFDocumentProxy;
    pageNumber: number;
    leaks: Leak[]; // Leaks SPECIFIC to this page
}

export const LeakViewer: React.FC<LeakViewerProps> = ({ pdf, pageNumber, leaks }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    // scale removed
    const [viewport, setViewport] = React.useState<pdfjsLib.PageViewport | null>(null);

    useEffect(() => {
        let active = true;
        const render = async () => {
            if (!canvasRef.current || !pdf) return;

            try {
                const page = await pdf.getPage(pageNumber);
                if (!active) return;

                // Calculate scale to fit container width if needed, or fixed.
                // For now, fixed scale 1.5 is decent for readability.
                // Better: dynamic scale based on wrapper width.
                const unscaledViewport = page.getViewport({ scale: 1.0 });
                const wrapperWidth = wrapperRef.current?.clientWidth || 800;
                const newScale = Math.min(1.5, (wrapperWidth - 32) / unscaledViewport.width); // Padding

                // scale state was unused, removing it to fix build error
                const vp = page.getViewport({ scale: newScale });
                setViewport(vp);

                await renderPageToCanvas(page, canvasRef.current, newScale);
            } catch (err) {
                console.error("Error rendering leak page:", err);
            }
        };
        render();
        return () => { active = false; };
    }, [pdf, pageNumber]);

    return (
        <div ref={wrapperRef} className="relative bg-slate-100 overflow-hidden rounded-lg shadow-inner border border-slate-300 inline-block max-w-full">
            <canvas ref={canvasRef} className="block" />

            {viewport && leaks.map(leak => {
                if (!leak.boundingBox) return null;
                const { x, y, width, height } = leak.boundingBox;

                // Transform PDF coords to Canvas coords using the viewport
                // viewport.convertToViewportRectangle([x, y, x+w, y+h]) -> [x1, y1, x2, y2]
                // Note: pdf.js text coords are usually [x_bottom_left, y_bottom_left, ...]?
                // Our scanner returns [tx, ty, w, h] where tx,ty is translation.
                // Usually tx,ty is bottom-left of the text matrix?
                // Standard PDF: Y grows UP. Canvas: Y grows DOWN.
                // pdf.js viewport handles this conversion.

                // Input rect: [x_min, y_min, x_max, y_max]
                // Our Scan logic: x (tx), y (ty), width (w), height (h).
                // Wait, text height is tricky. 
                // Let's assume the scanner passed standard PDF user space coords for the rect.

                // We need to pass [x, y, x+w, y+h] to convertToViewportRectangle?
                // Actually convertToViewportRectangle takes [x1, y1, x2, y2].

                // Scanner logic: x=tx, y=ty (bottom left?)
                // If y is bottom-left, then y_max = y + h.

                const rect = viewport.convertToViewportRectangle([x, y, x + width, y + height]);
                // rect is [x1, y1, x2, y2] in canvas pixels.
                // Note: y1 might be less than y2 or vice-versa depending on flip.
                // pdf.js viewport usually returns [minX, minY, maxX, maxY] for the canvas? 
                // Actually it returns [x_min, y_min, x_max, y_max] but dependent on coordinate system.
                // Let's normalize.

                const styleX = Math.min(rect[0], rect[2]);
                const styleY = Math.min(rect[1], rect[3]);
                const styleW = Math.abs(rect[2] - rect[0]);
                const styleH = Math.abs(rect[3] - rect[1]);

                return (
                    <div
                        key={leak.id}
                        className="absolute bg-red-500/30 border-2 border-red-500 animate-pulse z-10 hover:bg-red-500/50 transition-colors"
                        style={{
                            left: styleX,
                            top: styleY,
                            width: styleW,
                            height: styleH,
                        }}
                        title={leak.description}
                    />
                );
            })}
        </div>
    );
};
