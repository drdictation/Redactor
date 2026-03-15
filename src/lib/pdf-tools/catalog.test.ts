import { describe, expect, it } from 'vitest';

import { PDF_TOOLS, getPdfToolById, getPdfToolByPath } from './catalog';

describe('PDF tool catalog', () => {
    it('defines the five SEO tools', () => {
        expect(PDF_TOOLS).toHaveLength(5);
        expect(PDF_TOOLS.map((tool) => tool.path)).toEqual([
            '/tools/remove-pdf-metadata',
            '/tools/remove-pdf-comments',
            '/tools/remove-hidden-text',
            '/tools/scan-pdf-for-pii',
            '/tools/flatten-fillable-pdf',
        ]);
    });

    it('maps each tool to a paid funnel target', () => {
        for (const tool of PDF_TOOLS) {
            expect(tool.funnelTargets.length).toBeGreaterThan(0);
            expect(tool.funnelTargets).toContain('/auditor');
        }
    });

    it('looks up tools by path and id', () => {
        const metadataTool = getPdfToolByPath('/tools/remove-pdf-metadata/');
        expect(metadataTool?.id).toBe('metadata-stripper');

        const piiScanner = getPdfToolById('pii-scanner');
        expect(piiScanner?.path).toBe('/tools/scan-pdf-for-pii');
    });
});
