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
            'Makes metadata cleanup a top-of-funnel win before a deeper leak audit.',
        ],
        limitations: [
            'Metadata stripping does not prove covered text is gone.',
            'Comments, annotations, and ghost text can still leak after metadata is removed.',
        ],
        resultHeading: 'Metadata cleanup summary',
        downloadPrefix: 'metadata-stripped',
        funnelTitle: 'Clean metadata is not the same as a safe PDF.',
        funnelBody: 'Use the paid PDF Auditor to verify there is no ghost text, recoverable redaction layer, or annotation content still hiding in the file.',
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
                { title: 'Best First Step', text: 'Use it as fast pre-cleaning before the full audit confirms nothing else leaks.' },
            ],
            howThisWorks: 'Upload a PDF, strip common metadata fields, then download a cleaned copy.',
            trustSignals: 'Local Processing • No Uploads • Fast Metadata Cleanup',
            ctaText: 'Strip Metadata',
            metaTitle: 'PDF Metadata Stripper | Remove Hidden PDF Data Free',
            metaDescription: 'Remove author, creator, producer, and other hidden PDF metadata for free in your browser. Then verify the file with a full redaction audit.',
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
        funnelTitle: 'Comments removed. Now test the file for real leaks.',
        funnelBody: 'The paid Auditor checks whether redactions still expose ghost text, metadata, names, or dates after comment cleanup.',
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
                { title: 'Audit Follow-Up', text: 'Funnels users into the paid leak audit for final share-safe verification.' },
            ],
            howThisWorks: 'Upload the PDF, remove page annotations, and download a cleaned version.',
            trustSignals: 'Local Only • Annotation Verification • Draft Cleanup',
            ctaText: 'Remove Comments',
            metaTitle: 'Remove Comments from PDF Free | PDF Markup Remover',
            metaDescription: 'Remove comments, notes, highlights, and markup from a PDF for free in your browser. Verify the cleaned file with a deeper PDF audit.',
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
            'Acts as the direct free lead-in to your paid redaction QA workflow.',
        ],
        limitations: [
            'Flattening removes searchability, selectable text, and live form fields.',
            'For compliance-sensitive sharing, you still want the paid Auditor as final proof.',
        ],
        resultHeading: 'Flattened export summary',
        downloadPrefix: 'hidden-text-removed',
        funnelTitle: 'Flattened is safer. Audited is defensible.',
        funnelBody: 'Route users into the paid Auditor to prove the flattened file no longer contains ghost text, exposed names, or metadata leaks.',
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
                { title: 'Perfect Audit Hand-Off', text: 'The output naturally feeds the paid Auditor for final verification.' },
            ],
            howThisWorks: 'Upload the PDF, flatten every page into a new image-based PDF, and download the cleaned copy.',
            trustSignals: 'Flattened Output • Local Processing • Audit-Ready',
            ctaText: 'Remove Hidden Text',
            metaTitle: 'Remove Hidden Text from PDF | Flatten PDF Free',
            metaDescription: 'Remove hidden text from a PDF by flattening pages into an image-based copy in your browser. Then verify the result with a full PDF audit.',
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
            'Uses the same scanner family as the paid audit product.',
            'Creates a clear upgrade path into the certified paid report.',
        ],
        limitations: [
            'This page is a quick triage layer, not a legal certification.',
            'For downloadable reporting and full vulnerability review, the paid Auditor stays the main offer.',
        ],
        resultHeading: 'PII scan findings',
        funnelTitle: 'Turn this triage into a certified audit.',
        funnelBody: 'If the scanner finds names, dates, metadata, or ghost text, send users to the paid Auditor for the deeper vulnerability report and remediation proof.',
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
                { title: 'Upsell Alignment', text: 'This naturally feeds the paid audit when users need confidence or documentation.' },
            ],
            howThisWorks: 'Upload your PDF, review counts and sample findings, then open the full Auditor for remediation-grade review.',
            trustSignals: 'Client-Side Scan • No Upload • Audit Upgrade Path',
            ctaText: 'Scan for PII',
            metaTitle: 'Scan PDF for PII | Find Personal Data in PDF',
            metaDescription: 'Scan a PDF for names, dates, metadata, and redaction leak signals in your browser. Upgrade to the full PDF Auditor for deeper review.',
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
            'Creates a strong funnel into the paid audit for final outbound QA.',
        ],
        limitations: [
            'Flattening a form does not verify hidden metadata or recoverable redaction layers.',
            'Digitally signed workflows may still require the paid Auditor or redactor review before sharing.',
        ],
        resultHeading: 'Form flattening summary',
        downloadPrefix: 'form-flattened',
        funnelTitle: 'Flattened forms still deserve a final safety check.',
        funnelBody: 'Send users into the paid Auditor to verify the flattened PDF no longer exposes metadata, hidden annotation text, or risky redaction artifacts.',
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
                { title: 'Feeds Final Audit', text: 'The next step is a paid audit to verify nothing else remains exposed.' },
            ],
            howThisWorks: 'Upload the PDF, flatten live form fields, and download a static version.',
            trustSignals: 'Static Output • Local Only • Workflow-Safe',
            ctaText: 'Flatten PDF Form',
            metaTitle: 'Flatten Fillable PDF | PDF Form Field Flattener',
            metaDescription: 'Flatten a fillable PDF into a static copy in your browser. Then verify the final file with the full PDF Auditor.',
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
