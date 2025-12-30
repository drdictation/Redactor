import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { renderPageToCanvas } from '../../lib/pdf-engine';
import type { Redaction } from '../../types';
import { Trash2 } from 'lucide-react';

interface PageCanvasProps {
    page: pdfjsLib.PDFPageProxy;
    pageIndex: number;
    scale?: number;
    redactions: Redaction[];
    onAddRedaction: (redaction: Redaction) => void;
    onRemoveRedaction: (id: string) => void;
    isActive?: boolean;
    isPaid?: boolean;
}

export function PageCanvas({
    page,
    pageIndex,
    scale = 2.0, // High DPI render
    redactions,
    onAddRedaction,
    onRemoveRedaction,
    isPaid = false
}: PageCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
    const [currentRect, setCurrentRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

    // Render PDF
    useEffect(() => {
        if (canvasRef.current && page) {
            renderPageToCanvas(page, canvasRef.current, scale);
        }
    }, [page, scale]);

    // Coordinate helpers
    const getRelativeCoords = (e: React.MouseEvent | React.TouchEvent) => {
        if (!containerRef.current) return null;
        const rect = containerRef.current.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

        return {
            x: ((clientX - rect.left) / rect.width) * 100,
            y: ((clientY - rect.top) / rect.height) * 100
        };
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        const coords = getRelativeCoords(e);
        if (coords) {
            setIsDrawing(true);
            setStartPos(coords);
            setCurrentRect({ x: coords.x, y: coords.y, w: 0, h: 0 });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDrawing || !startPos) return;

        const coords = getRelativeCoords(e);
        if (!coords) return;

        const x = Math.min(coords.x, startPos.x);
        const y = Math.min(coords.y, startPos.y);
        const w = Math.abs(coords.x - startPos.x);
        const h = Math.abs(coords.y - startPos.y);

        setCurrentRect({ x, y, w, h });
    };

    const handleMouseUp = () => {
        if (isDrawing && currentRect) {
            // Only add if size is significant (> 1% roughly)
            if (currentRect.w > 0.5 && currentRect.h > 0.5) {
                onAddRedaction({
                    id: crypto.randomUUID(),
                    pageIndex,
                    x: currentRect.x,
                    y: currentRect.y,
                    width: currentRect.w,
                    height: currentRect.h
                });
            }
        }
        setIsDrawing(false);
        setStartPos(null);
        setCurrentRect(null);
    };

    return (
        <div
            ref={containerRef}
            className="relative shadow-md inline-block bg-white mb-8 select-none cursor-crosshair"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <canvas
                ref={canvasRef}
                className="block max-w-full h-auto"
                style={{ width: '100%' }} // Responsive width
            />

            {/* Watermark Overlay (Middle Layer: z-10) */}
            {!isPaid && (
                <>
                    <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-30 z-10">
                        <div className="transform -rotate-45 text-red-500 font-bold text-4xl sm:text-6xl whitespace-nowrap select-none border-4 border-red-500 p-4 rounded-xl">
                            PREVIEW - REDACTPDF.COM
                        </div>
                    </div>
                    <div className="absolute bottom-2 right-2 z-30 bg-white/80 px-2 py-1 text-[10px] text-gray-500 rounded border shadow-sm pointer-events-none">
                        Preview with watermark
                    </div>
                </>
            )}

            {/* Existing Redactions (Top Layer: z-20) */}
            {redactions.filter(r => r.pageIndex === pageIndex).map(r => (
                <div
                    key={r.id}
                    className="absolute bg-black group cursor-pointer border border-transparent hover:border-red-500/50 transition-colors z-20"
                    style={{
                        left: `${r.x}%`,
                        top: `${r.y}%`,
                        width: `${r.width}%`,
                        height: `${r.height}%`,
                    }}
                >
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemoveRedaction(r.id);
                        }}
                        className="hidden group-hover:flex absolute -top-3 -right-3 bg-red-600 text-white rounded-full p-1 shadow-sm hover:scale-110 transition-transform"
                    >
                        <Trash2 className="w-3 h-3" />
                    </button>
                </div>
            ))}

            {/* Drawing Preview (Top Layer: z-20) */}
            {currentRect && (
                <div
                    className="absolute bg-black/50 border border-black z-20"
                    style={{
                        left: `${currentRect.x}%`,
                        top: `${currentRect.y}%`,
                        width: `${currentRect.w}%`,
                        height: `${currentRect.h}%`,
                    }}
                />
            )}
        </div>
    );
}
