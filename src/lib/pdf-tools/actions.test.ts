import { describe, expect, it } from 'vitest';
import { PDFDocument, PDFName } from 'pdf-lib';

import {
    countPdfAnnotationsBytes,
    countPdfFormFieldsBytes,
    countSensitiveMetadataFieldsBytes,
    flattenPdfFormFieldsBytes,
    removePdfCommentsAndMarkupBytes,
    stripPdfMetadataBytes,
} from './actions';

async function createPdfWithMetadata() {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.addPage([300, 300]);
    pdfDoc.setTitle('Quarterly Payroll');
    pdfDoc.setAuthor('Jane Analyst');
    pdfDoc.setSubject('Confidential');
    pdfDoc.setKeywords(['finance', 'salary']);
    pdfDoc.setCreator('Internal Tool');
    pdfDoc.setProducer('Preview');
    return pdfDoc.save();
}

async function createPdfWithAnnotation() {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([300, 300]);
    const annotation = pdfDoc.context.obj({
        Type: 'Annot',
        Subtype: 'Text',
        Rect: [20, 20, 120, 80],
        Contents: 'Internal note',
    });

    (page.node as any).set(PDFName.of('Annots'), pdfDoc.context.obj([annotation]));

    return pdfDoc.save();
}

async function createPdfWithForm() {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([400, 400]);
    const form = pdfDoc.getForm();
    const textField = form.createTextField('employee_name');
    textField.setText('Alice');
    textField.addToPage(page, { x: 40, y: 280, width: 160, height: 28 });
    return pdfDoc.save();
}

describe('PDF tool transforms', () => {
    it('strips sensitive metadata fields', async () => {
        const source = await createPdfWithMetadata();
        expect(await countSensitiveMetadataFieldsBytes(source)).toBeGreaterThan(0);

        const output = await stripPdfMetadataBytes(source);

        expect(await countSensitiveMetadataFieldsBytes(output)).toBe(0);
    });

    it('removes page annotations used for comments and markup', async () => {
        const source = await createPdfWithAnnotation();
        expect(await countPdfAnnotationsBytes(source)).toBe(1);

        const output = await removePdfCommentsAndMarkupBytes(source);

        expect(await countPdfAnnotationsBytes(output)).toBe(0);
    });

    it('flattens interactive form fields', async () => {
        const source = await createPdfWithForm();
        expect(await countPdfFormFieldsBytes(source)).toBe(1);

        const output = await flattenPdfFormFieldsBytes(source);

        expect(await countPdfFormFieldsBytes(output)).toBe(0);
    });
});
