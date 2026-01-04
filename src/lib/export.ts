import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import type { Redaction } from '../types';
import { renderPageToCanvas } from './pdf-engine';

export async function exportRedactedPDF(
    originalFile: File,
    redactions: Redaction[],
    isPaid: boolean
): Promise<Uint8Array> {
    const arrayBuffer = await originalFile.arrayBuffer();
    console.log('[Export] Loaded array buffer, size:', arrayBuffer.byteLength);
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    const numPages = pdf.numPages;
    console.log('[Export] PDF loaded, pages:', numPages);

    const newPdf = await PDFDocument.create();

    // Create an off-screen canvas for rendering
    const canvas = document.createElement('canvas');

    for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const pageIndex = i - 1;

        // 1. Render page to canvas usually scale 2.0 for quality
        // Wait, exporting as image might need higher quality? 
        // 2.0 is often good enough for screen reading (150-200 DPI equivalent)
        await renderPageToCanvas(page, canvas, 2.0);
        console.log(`[Export] Page ${i} rendered to canvas`);

        const ctx = canvas.getContext('2d');
        if (!ctx) continue;

        const { width, height } = canvas;

        // 2. Draw Watermark if not paid (LAYER BEHIND)
        if (!isPaid) {
            ctx.save();
            ctx.globalAlpha = 0.3;
            ctx.font = `bold ${height / 20}px sans-serif`;
            ctx.fillStyle = 'red';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.translate(width / 2, height / 2);
            ctx.rotate(-Math.PI / 4);
            ctx.fillText('PREVIEW - REACTPDF.APP', 0, 0);
            ctx.restore();
        }

        // 3. Draw Redactions (LAYER ON TOP)
        ctx.fillStyle = '#000000';
        const pageRedactions = redactions.filter(r => r.pageIndex === pageIndex);

        pageRedactions.forEach(r => {
            const rx = (r.x / 100) * width;
            const ry = (r.y / 100) * height;
            const rw = (r.width / 100) * width;
            const rh = (r.height / 100) * height;
            ctx.fillRect(rx, ry, rw, rh);
        });

        // 4. Convert to PNG Image
        const imageDataUrl = canvas.toDataURL('image/png');

        // 5. Embed in new PDF
        const pngImage = await newPdf.embedPng(imageDataUrl);
        const newPage = newPdf.addPage([pngImage.width, pngImage.height]);
        newPage.drawImage(pngImage, {
            x: 0,
            y: 0,
            width: pngImage.width,
            height: pngImage.height,
        });
    }

    return newPdf.save();
}
