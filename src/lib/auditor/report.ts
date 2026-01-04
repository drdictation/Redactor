import { PDFDocument, rgb, StandardFonts, PDFPage } from 'pdf-lib';
import type { ScanResult } from './types';

/**
 * Sanitize text for PDF generation - remove non-printable characters
 * that WinAnsi encoding cannot handle
 */
function sanitizeText(text: string): string {
    // Remove control characters (0x00-0x1F except tab/newline/carriage return)
    // and other non-printable chars that WinAnsi can't encode
    return text
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Control chars
        .replace(/[^\x20-\x7E\xA0-\xFF]/g, '?'); // Replace other non-WinAnsi with ?
}

/**
 * Generate a comprehensive multi-page PDF Audit Report from scan results
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
    const orange = rgb(0.8, 0.5, 0.2);

    // Page dimensions
    const PAGE_WIDTH = 612;
    const PAGE_HEIGHT = 792;
    const MARGIN_LEFT = 50;
    const MARGIN_TOP = 50;
    const MARGIN_BOTTOM = 60;
    const LINE_HEIGHT = 16;

    // Helper to add a new page
    const addPage = (): { page: PDFPage; y: number } => {
        const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        return { page, y: PAGE_HEIGHT - MARGIN_TOP };
    };

    // Helper to check if we need a new page
    const checkNewPage = (currentY: number, needed: number, currentPage: PDFPage): { page: PDFPage; y: number } => {
        if (currentY - needed < MARGIN_BOTTOM) {
            // Add footer to current page
            drawFooter(currentPage);
            return addPage();
        }
        return { page: currentPage, y: currentY };
    };

    // Draw footer on a page
    const drawFooter = (page: PDFPage) => {
        const pageNum = pdfDoc.getPageCount();
        page.drawLine({
            start: { x: MARGIN_LEFT, y: 45 },
            end: { x: PAGE_WIDTH - MARGIN_LEFT, y: 45 },
            thickness: 0.5,
            color: gray,
        });
        page.drawText(`Page ${pageNum} | Certified by ReactPDF.com | ${new Date().toLocaleDateString()}`, {
            x: MARGIN_LEFT,
            y: 30,
            size: 8,
            font: helvetica,
            color: gray,
        });
    };

    // Start first page
    let { page, y } = addPage();

    // ========== HEADER ==========
    page.drawText('CERTIFIED DOCUMENT AUDIT REPORT', {
        x: MARGIN_LEFT,
        y,
        size: 20,
        font: helveticaBold,
        color: blue,
    });
    y -= 30;

    page.drawText(`Generated: ${new Date().toLocaleString()}`, {
        x: MARGIN_LEFT,
        y,
        size: 10,
        font: helvetica,
        color: gray,
    });
    y -= 25;

    page.drawText(`Document: ${sanitizeText(fileName)}`, {
        x: MARGIN_LEFT,
        y,
        size: 11,
        font: helveticaBold,
        color: black,
    });
    y -= 40;

    // ========== SUMMARY BOX ==========
    page.drawText('EXECUTIVE SUMMARY', {
        x: MARGIN_LEFT,
        y,
        size: 14,
        font: helveticaBold,
        color: black,
    });
    y -= 25;

    const criticalLeaks = result.leaks.filter(l => l.severity === 'CRITICAL').length;
    const highLeaks = result.leaks.filter(l => l.severity === 'HIGH').length;
    const mediumLeaks = result.leaks.filter(l => l.severity === 'MEDIUM').length;

    const summaryItems = [
        { label: 'Total Vulnerabilities:', value: String(result.leaks.length), color: result.leaks.length > 0 ? red : green },
        { label: 'Critical (Ghost Text):', value: String(criticalLeaks), color: criticalLeaks > 0 ? red : green },
        { label: 'High Severity:', value: String(highLeaks), color: highLeaks > 0 ? orange : green },
        { label: 'Medium Severity:', value: String(mediumLeaks), color: mediumLeaks > 0 ? orange : green },
        { label: 'Redaction Zones Found:', value: String(result.redactionCount), color: gray },
        { label: 'Names Detected:', value: String(result.namesFound?.length ?? 0), color: (result.namesFound?.length ?? 0) > 0 ? red : green },
        { label: 'Security Score:', value: `${result.score}/100`, color: result.score >= 80 ? green : result.score >= 50 ? orange : red },
    ];

    for (const item of summaryItems) {
        page.drawText(item.label, { x: MARGIN_LEFT, y, size: 10, font: helvetica, color: black });
        page.drawText(item.value, { x: 180, y, size: 10, font: helveticaBold, color: item.color });
        y -= LINE_HEIGHT;
    }
    y -= 20;

    // ========== NAMES DETECTED SECTION ==========
    if (result.namesFound && result.namesFound.length > 0) {
        ({ page, y } = checkNewPage(y, 60, page));

        page.drawText('IDENTITY FINGERPRINTS DETECTED', {
            x: MARGIN_LEFT,
            y,
            size: 14,
            font: helveticaBold,
            color: red,
        });
        y -= 5;
        page.drawLine({
            start: { x: MARGIN_LEFT, y },
            end: { x: 300, y },
            thickness: 1,
            color: red,
        });
        y -= 20;

        page.drawText('The following names/identifiers were found in document metadata or text layers:', {
            x: MARGIN_LEFT,
            y,
            size: 9,
            font: helvetica,
            color: gray,
        });
        y -= 18;

        for (const nameMatch of result.namesFound) {
            ({ page, y } = checkNewPage(y, LINE_HEIGHT + 5, page));

            page.drawText('•', { x: MARGIN_LEFT, y, size: 10, font: helvetica, color: red });
            page.drawText(sanitizeText(nameMatch.match), { x: MARGIN_LEFT + 15, y, size: 10, font: helveticaBold, color: black });

            const sourceText = `(Type: ${nameMatch.type}, Page ${nameMatch.pageNumber})`;
            page.drawText(sourceText, { x: 300, y, size: 8, font: helvetica, color: gray });
            y -= LINE_HEIGHT;
        }
        y -= 15;
    }

    // ========== DETAILED FINDINGS SECTION ==========
    ({ page, y } = checkNewPage(y, 60, page));

    page.drawText('DETAILED VULNERABILITY FINDINGS', {
        x: MARGIN_LEFT,
        y,
        size: 14,
        font: helveticaBold,
        color: black,
    });
    y -= 5;
    page.drawLine({
        start: { x: MARGIN_LEFT, y },
        end: { x: 350, y },
        thickness: 1,
        color: gray,
    });
    y -= 20;

    // Group by severity for better readability
    const groupedLeaks = {
        CRITICAL: result.leaks.filter(l => l.severity === 'CRITICAL'),
        HIGH: result.leaks.filter(l => l.severity === 'HIGH'),
        MEDIUM: result.leaks.filter(l => l.severity === 'MEDIUM'),
        LOW: result.leaks.filter(l => l.severity === 'LOW'),
    };

    for (const [severity, leaks] of Object.entries(groupedLeaks)) {
        if (leaks.length === 0) continue;

        ({ page, y } = checkNewPage(y, 40, page));

        const severityColor = severity === 'CRITICAL' ? red : severity === 'HIGH' ? orange : gray;

        page.drawText(`${severity} (${leaks.length} items)`, {
            x: MARGIN_LEFT,
            y,
            size: 11,
            font: helveticaBold,
            color: severityColor,
        });
        y -= 18;

        for (const leak of leaks) {
            ({ page, y } = checkNewPage(y, LINE_HEIGHT + 5, page));

            // Truncate description if too long
            let desc = sanitizeText(leak.description);
            if (desc.length > 80) {
                desc = desc.slice(0, 77) + '...';
            }

            page.drawText('•', { x: MARGIN_LEFT + 10, y, size: 9, font: helvetica, color: severityColor });
            page.drawText(desc, { x: MARGIN_LEFT + 25, y, size: 9, font: helvetica, color: black });

            if (leak.pageNumber && leak.pageNumber > 0) {
                page.drawText(`Page ${leak.pageNumber}`, {
                    x: PAGE_WIDTH - MARGIN_LEFT - 50,
                    y,
                    size: 8,
                    font: helvetica,
                    color: gray,
                });
            }

            y -= LINE_HEIGHT;
        }
        y -= 10;
    }

    // ========== CERTIFICATION STATEMENT ==========
    ({ page, y } = checkNewPage(y, 80, page));
    y -= 20;

    page.drawRectangle({
        x: MARGIN_LEFT - 10,
        y: y - 60,
        width: PAGE_WIDTH - (MARGIN_LEFT * 2) + 20,
        height: 70,
        borderColor: green,
        borderWidth: 1,
        color: rgb(0.95, 1, 0.95),
    });

    page.drawText('CERTIFICATION STATEMENT', {
        x: MARGIN_LEFT,
        y: y - 15,
        size: 11,
        font: helveticaBold,
        color: green,
    });

    page.drawText('This document has been analyzed using automated security scanning technology.', {
        x: MARGIN_LEFT,
        y: y - 32,
        size: 9,
        font: helvetica,
        color: black,
    });

    page.drawText('This report serves as proof of due diligence for compliance and legal purposes.', {
        x: MARGIN_LEFT,
        y: y - 45,
        size: 9,
        font: helvetica,
        color: black,
    });

    // Add footer to last page
    drawFooter(page);

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
}
