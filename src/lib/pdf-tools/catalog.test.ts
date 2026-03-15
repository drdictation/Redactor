import { describe, expect, it } from 'vitest';

import { PDF_TOOLS, getPdfToolById, getPdfToolByPath } from './catalog';

describe('PDF tool catalog', () => {
    it('defines canonical tools plus long-tail route variants', () => {
        expect(PDF_TOOLS.length).toBeGreaterThanOrEqual(25);
        expect(PDF_TOOLS.map((tool) => tool.path)).toEqual(expect.arrayContaining([
            '/tools/remove-pdf-metadata',
            '/tools/remove-pdf-comments',
            '/tools/remove-hidden-text',
            '/tools/scan-pdf-for-pii',
            '/tools/flatten-fillable-pdf',
            '/tools/remove-author-from-pdf',
            '/tools/remove-sticky-notes-from-pdf',
            '/tools/flatten-pdf-to-remove-hidden-text',
            '/tools/scan-pdf-for-personal-information',
            '/tools/flatten-signed-pdf',
        ]));
    });

    it('maps each tool to at least one follow-up destination', () => {
        for (const tool of PDF_TOOLS) {
            expect(tool.funnelTargets.length).toBeGreaterThan(0);
        }
    });

    it('looks up canonical and long-tail variants by path and id', () => {
        const metadataTool = getPdfToolByPath('/tools/remove-pdf-metadata/');
        expect(metadataTool?.id).toBe('metadata-stripper');

        const aliasTool = getPdfToolByPath('/tools/remove-author-from-pdf');
        expect(aliasTool?.mode).toBe('metadata_strip');
        expect(aliasTool?.funnelTargets[0]).toBe('/tools/remove-pdf-metadata');

        const piiScanner = getPdfToolById('pii-scanner');
        expect(piiScanner?.path).toBe('/tools/scan-pdf-for-pii');

        const flattenSigned = getPdfToolById('flatten-signed-pdf');
        expect(flattenSigned?.mode).toBe('form_flatten');
    });
});
