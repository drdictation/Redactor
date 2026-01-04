import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import type { ScanResult } from './types';

/**
 * Generate a PDF Audit Report from scan results
 */
export async function generateAuditReport(fileName: string, result: ScanResult): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Colors
    const black = rgb(0.1, 0.1, 0.1);
    const gray = rgb(0.4, 0.4, 0.4);
    const red = rgb(0.8, 0.2, 0.2);
    const green = rgb(0.2, 0.6, 0.3);
    const blue = rgb(0.2, 0.4, 0.7);

    // Page setup
    const page = pdfDoc.addPage([612, 792]); // Letter size
    const { width, height } = page.getSize();
    let y = height - 50;

    // Header
    page.drawText('CERTIFIED DOCUMENT AUDIT REPORT', {
        x: 50,
        y,
        size: 18,
        font: helveticaBold,
        color: blue,
    });
    y -= 25;

    page.drawText(`Generated: ${new Date().toLocaleString()}`, {
        x: 50,
        y,
        size: 10,
        font: helvetica,
        color: gray,
    });
    y -= 40;

    // Document Info
    page.drawText('Document Analyzed:', {
        x: 50,
        y,
        size: 12,
        font: helveticaBold,
        color: black,
    });
    y -= 18;

    page.drawText(fileName, {
        x: 50,
        y,
        size: 11,
        font: helvetica,
        color: gray,
    });
    y -= 35;

    // Summary Section
    page.drawText('AUDIT SUMMARY', {
        x: 50,
        y,
        size: 14,
        font: helveticaBold,
        color: black,
    });
    y -= 5;

    // Draw underline
    page.drawLine({
        start: { x: 50, y },
        end: { x: 250, y },
        thickness: 1,
        color: gray,
    });
    y -= 25;

    const criticalLeaks = result.leaks.filter(l => l.severity === 'CRITICAL').length;
    const highLeaks = result.leaks.filter(l => l.severity === 'HIGH').length;
    const mediumLeaks = result.leaks.filter(l => l.severity === 'MEDIUM').length;

    const summaryItems = [
        { label: 'Total Issues Found:', value: String(result.leaks.length), color: result.leaks.length > 0 ? red : green },
        { label: 'Critical (Ghost Text):', value: String(criticalLeaks), color: criticalLeaks > 0 ? red : green },
        { label: 'High Severity:', value: String(highLeaks), color: highLeaks > 0 ? red : green },
        { label: 'Medium Severity:', value: String(mediumLeaks), color: mediumLeaks > 0 ? red : green },
        { label: 'Redaction Zones Scanned:', value: String(result.redactionCount), color: gray },
        { label: 'Security Score:', value: `${result.score}/100`, color: result.score >= 80 ? green : result.score >= 50 ? rgb(0.8, 0.6, 0.2) : red },
    ];

    for (const item of summaryItems) {
        page.drawText(item.label, {
            x: 50,
            y,
            size: 11,
            font: helvetica,
            color: black,
        });
        page.drawText(item.value, {
            x: 200,
            y,
            size: 11,
            font: helveticaBold,
            color: item.color,
        });
        y -= 18;
    }
    y -= 20;

    // Findings Section
    if (result.leaks.length > 0) {
        page.drawText('DETAILED FINDINGS', {
            x: 50,
            y,
            size: 14,
            font: helveticaBold,
            color: black,
        });
        y -= 5;
        page.drawLine({
            start: { x: 50, y },
            end: { x: 250, y },
            thickness: 1,
            color: gray,
        });
        y -= 25;

        for (const leak of result.leaks.slice(0, 15)) { // Limit to 15 per page
            const severityColor = leak.severity === 'CRITICAL' ? red : leak.severity === 'HIGH' ? rgb(0.8, 0.4, 0.2) : gray;

            page.drawText(`[${leak.severity}]`, {
                x: 50,
                y,
                size: 9,
                font: helveticaBold,
                color: severityColor,
            });

            // Truncate description if too long
            const desc = leak.description.length > 60 ? leak.description.slice(0, 57) + '...' : leak.description;
            page.drawText(desc, {
                x: 110,
                y,
                size: 9,
                font: helvetica,
                color: black,
            });

            if (leak.pageNumber && leak.pageNumber > 0) {
                page.drawText(`Page ${leak.pageNumber}`, {
                    x: 520,
                    y,
                    size: 9,
                    font: helvetica,
                    color: gray,
                });
            }

            y -= 16;

            if (y < 100) break; // Stop before running off page
        }
    }

    // Footer
    y = 50;
    page.drawLine({
        start: { x: 50, y: y + 15 },
        end: { x: width - 50, y: y + 15 },
        thickness: 0.5,
        color: gray,
    });

    page.drawText('This report was generated by RedactPDF Audit. For compliance purposes only.', {
        x: 50,
        y,
        size: 8,
        font: helvetica,
        color: gray,
    });

    page.drawText('© RedactPDF.com', {
        x: width - 120,
        y,
        size: 8,
        font: helvetica,
        color: gray,
    });

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
}
