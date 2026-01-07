import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { renderPageToCanvas } from '../pdf-engine';

/**
 * Sanitizes a PDF by:
 * 1. Rasterizing all pages (eliminates ghost text / hidden text layers)
 * 2. Stripping all metadata (Author, Title, Creator, Producer, etc.)
 * 
 * Returns a new PDF as Uint8Array that is "clean" and safe to share.
 */
export async function sanitizePDF(
    file: File,
    options: {
        scale?: number;           // Render quality (default 2.0 = ~150 DPI)
        anonymizeMetadata?: boolean; // If true, sets metadata to 'Anonymous' instead of empty
    } = {}
): Promise<Uint8Array> {
    const { scale = 2.0, anonymizeMetadata = true } = options;

    console.log('[Sanitizer] Starting PDF sanitization...');

    // 1. Load original PDF with pdfjs-dist
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    const numPages = pdf.numPages;
    console.log(`[Sanitizer] Loaded PDF with ${numPages} pages.`);

    // 2. Create new PDF with pdf-lib
    const newPdf = await PDFDocument.create();

    // 3. Create an off-screen canvas for rendering
    const canvas = document.createElement('canvas');

    // 4. For each page: rasterize and embed as image
    for (let i = 1; i <= numPages; i++) {
        console.log(`[Sanitizer] Processing page ${i}/${numPages}...`);

        const page = await pdf.getPage(i);

        // Render page to canvas (this destroys the text layer)
        await renderPageToCanvas(page, canvas, scale);

        // Convert canvas to PNG data URL
        const imageDataUrl = canvas.toDataURL('image/png');

        // Embed PNG in new PDF
        const pngImage = await newPdf.embedPng(imageDataUrl);
        const newPage = newPdf.addPage([pngImage.width, pngImage.height]);
        newPage.drawImage(pngImage, {
            x: 0,
            y: 0,
            width: pngImage.width,
            height: pngImage.height,
        });
    }

    // 5. Strip/anonymize metadata
    const anonymousValue = anonymizeMetadata ? 'Anonymous' : '';
    newPdf.setTitle(anonymousValue);
    newPdf.setAuthor(anonymousValue);
    newPdf.setSubject(anonymousValue);
    newPdf.setKeywords([]);
    newPdf.setCreator(anonymousValue);
    newPdf.setProducer(anonymousValue);

    // Optional: Set creation/modification dates to epoch
    // newPdf.setCreationDate(new Date(0));
    // newPdf.setModificationDate(new Date(0));

    console.log('[Sanitizer] Metadata stripped. Saving PDF...');

    // 6. Save and return
    const pdfBytes = await newPdf.save();
    console.log(`[Sanitizer] Complete. Output size: ${pdfBytes.byteLength} bytes.`);

    return pdfBytes;
}
