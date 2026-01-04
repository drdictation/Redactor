
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';

async function createVulnerablePDF() {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 24;

    const text = 'SENSITIVE DATA';
    const x = 50;
    const y = 300;

    // 1. Draw the "Hidden" Text
    page.drawText(text, {
        x,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
    });

    // 2. Draw a Black Rectangle over it (Redaction)
    // We need to cover the text exactly or slightly more
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    const textHeight = fontSize;

    page.drawRectangle({
        x: x - 2,
        y: y - 2,
        width: textWidth + 4,
        height: textHeight + 4,
        color: rgb(0, 0, 0),
    });

    // 3. Add some visible text
    page.drawText('This document contains hidden text under the black box below:', {
        x: 50,
        y: 350,
        size: 12,
        font,
        color: rgb(0, 0, 0),
    });

    page.drawText('Use the Auditor to reveal it!', {
        x: 50,
        y: 100,
        size: 12,
        font,
        color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync('vulnerable_test.pdf', pdfBytes);
    console.log('vulnerable_test.pdf created successfully!');
}

createVulnerablePDF().catch(err => console.error(err));
