import type { RouteConfig } from '../landingCopy';

export type PdfToolId =
    | 'metadata-stripper'
    | 'comments-remover'
    | 'hidden-text-remover'
    | 'pii-scanner'
    | 'form-flattener';

export type PdfToolMode =
    | 'metadata_strip'
    | 'comments_remove'
    | 'hidden_text_remove'
    | 'pii_scan'
    | 'form_flatten';

export interface PdfToolDefinition {
    id: PdfToolId;
    path: string;
    name: string;
    badge: string;
    targetKeyword: string;
    mode: PdfToolMode;
    headline: string;
    description: string;
    bullets: string[];
    limitations: string[];
    resultHeading: string;
    downloadPrefix?: string;
    funnelTitle: string;
    funnelBody: string;
    funnelTargets: string[];
    relatedToolIds: PdfToolId[];
    routeConfig: RouteConfig;
}

export const PDF_TOOLS: PdfToolDefinition[] = [
    {
        id: 'metadata-stripper',
        path: '/tools/remove-pdf-metadata',
        name: 'PDF Metadata Stripper',
        badge: 'Free Utility',
        targetKeyword: 'remove hidden data from pdf free',
        mode: 'metadata_strip',
        headline: 'Remove author names, producer data, and hidden PDF metadata.',
        description: 'Strips common document-info fields while preserving the visible PDF pages. Best for cleaning obvious authoring traces before you share a file externally.',
        bullets: [
            'Removes Title, Author, Subject, Keywords, Creator, and Producer fields.',
            'Preserves visible text and page layout.',
            'Helps remove common authoring traces before you share the document.',
        ],
        limitations: [
            'Metadata stripping does not prove covered text is gone.',
            'Comments, annotations, and ghost text can still leak after metadata is removed.',
        ],
        resultHeading: 'Metadata cleanup summary',
        downloadPrefix: 'metadata-stripped',
        funnelTitle: 'Clean metadata is not the same as a safe PDF.',
        funnelBody: 'If you need a deeper verification pass, open the PDF Auditor to check for ghost text, recoverable redaction layers, or leftover annotation content.',
        funnelTargets: ['/auditor', '/'],
        relatedToolIds: ['comments-remover', 'hidden-text-remover', 'form-flattener'],
        routeConfig: {
            path: '/tools/remove-pdf-metadata',
            primarySearchIntent: 'Remove hidden metadata from PDF',
            h1: 'Remove Hidden PDF Metadata for Free',
            securityHero: 'Strip author and producer data locally in your browser.',
            subhead: 'Remove common hidden metadata from a PDF before sending it to clients, lenders, vendors, or opposing counsel.',
            items: [
                { title: 'Metadata Cleanup', text: 'Remove common authoring fields that reveal software, people, and workflow history.' },
                { title: 'Preserve Layout', text: 'Keep the visible document intact without forcing a full raster export.' },
                { title: 'Helpful Cleanup', text: 'Use it to quickly clean document properties before sharing.' },
            ],
            howThisWorks: 'Upload a PDF, strip common metadata fields, then download a cleaned copy.',
            trustSignals: 'Local Processing • No Uploads • Fast Metadata Cleanup',
            ctaText: 'Strip Metadata',
            metaTitle: 'PDF Metadata Stripper | Remove Hidden PDF Data Free',
            metaDescription: 'Remove author, creator, producer, and other hidden PDF metadata for free in your browser. Then review the file with the PDF Auditor if you want a deeper check.',
        },
    },
    {
        id: 'comments-remover',
        path: '/tools/remove-pdf-comments',
        name: 'PDF Comments & Markup Remover',
        badge: 'Free Utility',
        targetKeyword: 'remove comments from pdf free',
        mode: 'comments_remove',
        headline: 'Delete PDF comments, notes, highlights, and markup layers.',
        description: 'Removes standard page annotations across tools like Adobe Acrobat and Apple Preview by clearing the underlying PDF annotation arrays.',
        bullets: [
            'Targets standard PDF page annotations rather than vendor-specific UI labels.',
            'Keeps the visible page content intact when possible.',
            'Verifies before-and-after annotation counts so users can trust the cleanup.',
        ],
        limitations: [
            'Removing comments does not remove hidden text under black boxes.',
            'Complex vendor-specific artifacts can still justify a final audit pass.',
        ],
        resultHeading: 'Markup removal summary',
        downloadPrefix: 'comments-removed',
        funnelTitle: 'Comments removed. Review the cleaned file.',
        funnelBody: 'If you want a deeper review, open the PDF Auditor to check for ghost text, metadata, names, or dates after comment cleanup.',
        funnelTargets: ['/auditor', '/unredact'],
        relatedToolIds: ['metadata-stripper', 'hidden-text-remover', 'pii-scanner'],
        routeConfig: {
            path: '/tools/remove-pdf-comments',
            primarySearchIntent: 'Remove PDF comments and markup',
            h1: 'Remove PDF Comments & Markup Free',
            securityHero: 'Clean annotation layers without uploading the document.',
            subhead: 'Delete sticky notes, highlights, free text boxes, and markup objects before you share a working draft externally.',
            items: [
                { title: 'Cross-App Approach', text: 'Targets the PDF annotation structures used underneath Acrobat, Preview, and similar editors.' },
                { title: 'Verification Counts', text: 'Shows annotation counts before and after cleanup to build trust.' },
                { title: 'Final Review', text: 'Use the PDF Auditor if you want a final verification pass before sharing.' },
            ],
            howThisWorks: 'Upload the PDF, remove page annotations, and download a cleaned version.',
            trustSignals: 'Local Only • Annotation Verification • Draft Cleanup',
            ctaText: 'Remove Comments',
            metaTitle: 'Remove Comments from PDF Free | PDF Markup Remover',
            metaDescription: 'Remove comments, notes, highlights, and markup from a PDF for free in your browser. Review the cleaned file with the PDF Auditor if needed.',
        },
    },
    {
        id: 'hidden-text-remover',
        path: '/tools/remove-hidden-text',
        name: 'PDF Hidden Text Remover',
        badge: 'Free Utility',
        targetKeyword: 'remove hidden text from pdf',
        mode: 'hidden_text_remove',
        headline: 'Flatten the PDF into a share-safe copy with hidden text removed.',
        description: 'Rebuilds every page as an image-only PDF. That destroys copy-pasteable text layers, annotation overlays, and many common recovery vectors in one pass.',
        bullets: [
            'Rasterizes each page so hidden text layers are no longer extractable.',
            'Strips metadata as part of the rebuild.',
            'Creates an image-based copy that is easier to share safely.',
        ],
        limitations: [
            'Flattening removes searchability, selectable text, and live form fields.',
            'For compliance-sensitive sharing, you may still want a deeper verification step.',
        ],
        resultHeading: 'Flattened export summary',
        downloadPrefix: 'hidden-text-removed',
        funnelTitle: 'Flattened files still deserve a final review.',
        funnelBody: 'Open the PDF Auditor if you want to double-check the flattened file for ghost text, exposed names, or metadata leaks.',
        funnelTargets: ['/auditor', '/'],
        relatedToolIds: ['metadata-stripper', 'comments-remover', 'form-flattener'],
        routeConfig: {
            path: '/tools/remove-hidden-text',
            primarySearchIntent: 'Remove hidden text from PDF',
            h1: 'Remove Hidden Text from PDF',
            securityHero: 'Destroy recoverable text layers in the browser.',
            subhead: 'Turn a risky PDF into a flattened, image-based copy that is much harder to reverse or extract text from.',
            items: [
                { title: 'Ghost Text Defense', text: 'Flattens pages so covered text is no longer copy-pasteable.' },
                { title: 'No Cloud Upload', text: 'Processing stays local to the browser.' },
                { title: 'Extra Verification', text: 'If you want extra confidence, review the output in the PDF Auditor.' },
            ],
            howThisWorks: 'Upload the PDF, flatten every page into a new image-based PDF, and download the cleaned copy.',
            trustSignals: 'Flattened Output • Local Processing • Audit-Ready',
            ctaText: 'Remove Hidden Text',
            metaTitle: 'Remove Hidden Text from PDF | Flatten PDF Free',
            metaDescription: 'Remove hidden text from a PDF by flattening pages into an image-based copy in your browser. Then review the result in the PDF Auditor if needed.',
        },
    },
    {
        id: 'pii-scanner',
        path: '/tools/scan-pdf-for-pii',
        name: 'PDF PII Scanner',
        badge: 'Audit Preview',
        targetKeyword: 'find personal data in pdf',
        mode: 'pii_scan',
        headline: 'Scan for dates, names, metadata, and redaction leak signals.',
        description: 'Uses your existing scanner to surface likely PII exposure and hidden leak signals before a document is sent or published.',
        bullets: [
            'Surfaces names, dates, metadata traces, and ghost-text style redaction leaks.',
            'Uses the same underlying scanner logic as the Auditor.',
            'Gives you a quick way to review likely sensitive content and document risk.',
        ],
        limitations: [
            'This page is a quick triage layer, not a legal certification.',
            'For downloadable reporting and a fuller vulnerability review, open the PDF Auditor.',
        ],
        resultHeading: 'PII scan findings',
        funnelTitle: 'Want a deeper document review?',
        funnelBody: 'If the scanner finds names, dates, metadata, or ghost text, continue into the PDF Auditor for a deeper review.',
        funnelTargets: ['/auditor', '/'],
        relatedToolIds: ['metadata-stripper', 'comments-remover', 'hidden-text-remover'],
        routeConfig: {
            path: '/tools/scan-pdf-for-pii',
            primarySearchIntent: 'Scan PDF for personal data',
            h1: 'Scan a PDF for PII and Hidden Leak Signals',
            securityHero: 'Names, dates, and metadata are scanned locally only.',
            subhead: 'Quickly triage whether a PDF contains exposed names, dates, metadata, or risky redaction patterns before sending it to anyone else.',
            items: [
                { title: 'PII Signals', text: 'Find dates, names, and document fingerprints in the text and metadata.' },
                { title: 'Leak Discovery', text: 'Detect whether common redaction mistakes still expose hidden text.' },
                { title: 'Deeper Review', text: 'Open the PDF Auditor when you want more confidence or documentation.' },
            ],
            howThisWorks: 'Upload your PDF, review counts and sample findings, then open the full Auditor for remediation-grade review.',
            trustSignals: 'Client-Side Scan • No Upload • Detailed Review Available',
            ctaText: 'Scan for PII',
            metaTitle: 'Scan PDF for PII | Find Personal Data in PDF',
            metaDescription: 'Scan a PDF for names, dates, metadata, and redaction leak signals in your browser. Open the PDF Auditor for deeper review if needed.',
        },
    },
    {
        id: 'form-flattener',
        path: '/tools/flatten-fillable-pdf',
        name: 'PDF Form Field & Signature Flattener',
        badge: 'Workflow Utility',
        targetKeyword: 'flatten fillable pdf',
        mode: 'form_flatten',
        headline: 'Flatten fillable fields before you send the final PDF out.',
        description: 'Converts interactive form fields into static page content so recipients cannot casually edit the filled responses.',
        bullets: [
            'Flattens editable AcroForm fields into fixed page content.',
            'Useful for applications, intake forms, contracts, and signed packets.',
            'Works well before a final document review.',
        ],
        limitations: [
            'Flattening a form does not verify hidden metadata or recoverable redaction layers.',
            'Digitally signed workflows may still require additional review before sharing.',
        ],
        resultHeading: 'Form flattening summary',
        downloadPrefix: 'form-flattened',
        funnelTitle: 'Flattened forms are easier to share and review.',
        funnelBody: 'Open the PDF Auditor if you want to check the flattened PDF for metadata, hidden annotation text, or risky redaction artifacts.',
        funnelTargets: ['/auditor', '/'],
        relatedToolIds: ['metadata-stripper', 'comments-remover', 'hidden-text-remover'],
        routeConfig: {
            path: '/tools/flatten-fillable-pdf',
            primarySearchIntent: 'Flatten fillable PDF form',
            h1: 'Flatten a Fillable PDF',
            securityHero: 'Turn editable fields into a static final copy.',
            subhead: 'Flatten interactive form fields before sharing applications, contracts, disclosures, or signed documents externally.',
            items: [
                { title: 'Lock Final Answers', text: 'Turn live fields into fixed page content so casual edits stop.' },
                { title: 'Great for Shared Packets', text: 'Useful for HR, legal, finance, and intake workflows.' },
                { title: 'Extra Review', text: 'If you need more confidence, review the file in the PDF Auditor.' },
            ],
            howThisWorks: 'Upload the PDF, flatten live form fields, and download a static version.',
            trustSignals: 'Static Output • Local Only • Workflow-Safe',
            ctaText: 'Flatten PDF Form',
            metaTitle: 'Flatten Fillable PDF | PDF Form Field Flattener',
            metaDescription: 'Flatten a fillable PDF into a static copy in your browser. Then review the final file in the PDF Auditor if needed.',
        },
    },
];

export const PDF_TOOL_MAP = Object.fromEntries(PDF_TOOLS.map((tool) => [tool.path, tool])) as Record<string, PdfToolDefinition>;

export const PDF_TOOL_ROUTE_CONFIG = Object.fromEntries(
    PDF_TOOLS.map((tool) => [tool.path, tool.routeConfig]),
) as Record<string, RouteConfig>;

export function getPdfToolByPath(pathname: string): PdfToolDefinition | undefined {
    const normalizedPath = pathname === '/' ? pathname : pathname.replace(/\/+$/, '');
    return PDF_TOOL_MAP[normalizedPath];
}

export function getPdfToolById(id: PdfToolId): PdfToolDefinition | undefined {
    return PDF_TOOLS.find((tool) => tool.id === id);
}
