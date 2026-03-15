import { describe, expect, it } from 'vitest';

import { PDF_TOOLS } from '../../lib/pdf-tools/catalog';

const modes = ['metadata_strip', 'comments_remove', 'hidden_text_remove', 'pii_scan', 'form_flatten'];

describe('tools hub coverage', () => {
    it('has tools in every cluster shown on the hub page', () => {
        for (const mode of modes) {
            expect(PDF_TOOLS.some((tool) => tool.mode === mode)).toBe(true);
        }
    });

    it('keeps canonical tool routes available for featured cards', () => {
        expect(PDF_TOOLS.map((tool) => tool.path)).toEqual(expect.arrayContaining([
            '/tools/remove-pdf-metadata',
            '/tools/remove-pdf-comments',
            '/tools/remove-hidden-text',
            '/tools/scan-pdf-for-pii',
            '/tools/flatten-fillable-pdf',
        ]));
    });
});
