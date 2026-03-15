import { describe, expect, it } from 'vitest';

import { PDF_RESOURCES, getPdfResourceByPath } from '../../lib/pdf-resources/catalog';

describe('pdf resource catalog', () => {
    it('includes bridge and vertical routes', () => {
        expect(PDF_RESOURCES.some((resource) => resource.kind === 'bridge')).toBe(true);
        expect(PDF_RESOURCES.some((resource) => resource.kind === 'vertical')).toBe(true);
    });

    it('looks up guide and use-case routes by path', () => {
        expect(getPdfResourceByPath('/guides/is-my-pdf-safe-to-send')?.kind).toBe('bridge');
        expect(getPdfResourceByPath('/use-cases/flatten-signed-nda-pdf')?.kind).toBe('vertical');
    });
});
