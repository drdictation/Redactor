import { PDFArray, PDFDocument, PDFName } from 'pdf-lib';

function toUint8Array(input: ArrayBuffer | Uint8Array): Uint8Array {
    return input instanceof Uint8Array ? input : new Uint8Array(input);
}

async function loadPdfBytesForScan(input: ArrayBuffer | Uint8Array) {
    const pdfjsLib = await import('pdfjs-dist');
    const data = toUint8Array(input);
    return pdfjsLib.getDocument({ data }).promise;
}

export async function countSensitiveMetadataFieldsBytes(input: ArrayBuffer | Uint8Array): Promise<number> {
    const pdfDoc = await PDFDocument.load(toUint8Array(input), { updateMetadata: false });
    const keywords = pdfDoc.getKeywords();

    return [
        pdfDoc.getTitle(),
        pdfDoc.getAuthor(),
        pdfDoc.getSubject(),
        pdfDoc.getCreator(),
        pdfDoc.getProducer(),
        Array.isArray(keywords) && keywords.length > 0 ? keywords.join(',') : undefined,
    ].filter((value) => typeof value === 'string' && value.trim().length > 0).length;
}

export async function stripPdfMetadataBytes(input: ArrayBuffer | Uint8Array): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.load(toUint8Array(input), { updateMetadata: false });

    pdfDoc.setTitle('');
    pdfDoc.setAuthor('');
    pdfDoc.setSubject('');
    pdfDoc.setKeywords([]);
    pdfDoc.setCreator('');
    pdfDoc.setProducer('');
    pdfDoc.setCreationDate(new Date(0));
    pdfDoc.setModificationDate(new Date(0));

    return pdfDoc.save();
}

export async function countPdfAnnotationsBytes(input: ArrayBuffer | Uint8Array): Promise<number> {
    const pdfDoc = await PDFDocument.load(toUint8Array(input), { updateMetadata: false });

    return pdfDoc.getPages().reduce((total, page) => {
        const annots = (page.node as any).lookupMaybe?.(PDFName.of('Annots'), PDFArray);
        return total + (annots && typeof annots.size === 'function' ? annots.size() : 0);
    }, 0);
}

export async function removePdfCommentsAndMarkupBytes(input: ArrayBuffer | Uint8Array): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.load(toUint8Array(input), { updateMetadata: false });

    for (const page of pdfDoc.getPages()) {
        (page.node as any).delete(PDFName.of('Annots'));
    }

    return pdfDoc.save();
}

export async function countPdfFormFieldsBytes(input: ArrayBuffer | Uint8Array): Promise<number> {
    const pdfDoc = await PDFDocument.load(toUint8Array(input), { updateMetadata: false });
    return pdfDoc.getForm().getFields().length;
}

export async function flattenPdfFormFieldsBytes(input: ArrayBuffer | Uint8Array): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.load(toUint8Array(input), { updateMetadata: false });
    const form = pdfDoc.getForm();

    if (form.getFields().length > 0) {
        form.flatten();
    }

    return pdfDoc.save();
}

export async function removePdfMetadataFromFile(file: File): Promise<Uint8Array> {
    return stripPdfMetadataBytes(await file.arrayBuffer());
}

export async function removePdfCommentsFromFile(file: File): Promise<Uint8Array> {
    return removePdfCommentsAndMarkupBytes(await file.arrayBuffer());
}

export async function removePdfHiddenTextFromFile(file: File): Promise<Uint8Array> {
    const { sanitizePDF } = await import('../auditor/sanitizer');
    return sanitizePDF(file, { anonymizeMetadata: false });
}

export async function flattenPdfFormFieldsFromFile(file: File): Promise<Uint8Array> {
    return flattenPdfFormFieldsBytes(await file.arrayBuffer());
}

export async function scanPdfForPii(file: File) {
    const { scanPDF } = await import('../auditor/scanner');
    const pdf = await loadPdfBytesForScan(await file.arrayBuffer());
    return scanPDF(pdf);
}

export async function scanPdfBytes(input: ArrayBuffer | Uint8Array) {
    const { scanPDF } = await import('../auditor/scanner');
    const pdf = await loadPdfBytesForScan(input);
    return scanPDF(pdf);
}

export function downloadPdfBytes(bytes: Uint8Array, fileName: string) {
    const blob = new Blob([bytes as unknown as BlobPart], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
