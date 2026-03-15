import type { RouteConfig } from '../landingCopy';

export type PdfResourceKind = 'vertical' | 'bridge';

export interface PdfResourceDefinition {
    id: string;
    kind: PdfResourceKind;
    path: string;
    title: string;
    eyebrow: string;
    summary: string;
    problem: string;
    whyItMatters: string[];
    checklist: string[];
    primaryToolPath: string;
    secondaryToolPath?: string;
    relatedPaths: string[];
    routeConfig: RouteConfig;
}

interface ResourceInput {
    id: string;
    kind: PdfResourceKind;
    path: string;
    title: string;
    summary: string;
    problem: string;
    whyItMatters: string[];
    checklist: string[];
    primaryToolPath: string;
    secondaryToolPath?: string;
    relatedPaths: string[];
    metaTitle: string;
    metaDescription: string;
    securityHero: string;
    subhead: string;
    faq?: Array<{ question: string; answer: string }>;
}

function createResource(input: ResourceInput): PdfResourceDefinition {
    return {
        id: input.id,
        kind: input.kind,
        path: input.path,
        title: input.title,
        eyebrow: input.kind === 'vertical' ? 'Use case guide' : 'PDF guide',
        summary: input.summary,
        problem: input.problem,
        whyItMatters: input.whyItMatters,
        checklist: input.checklist,
        primaryToolPath: input.primaryToolPath,
        secondaryToolPath: input.secondaryToolPath,
        relatedPaths: input.relatedPaths,
        routeConfig: {
            path: input.path,
            primarySearchIntent: input.title,
            h1: input.title,
            securityHero: input.securityHero,
            subhead: input.subhead,
            items: [
                { title: 'Problem', text: input.problem },
                { title: 'What To Review', text: input.checklist[0] ?? 'Review the PDF carefully before sharing it.' },
                { title: 'Recommended Tool', text: input.summary },
            ],
            howThisWorks: 'Read the guidance, open the recommended PDF tool, and process the document locally in your browser.',
            trustSignals: 'Task Guidance • Local PDF Tools • Safer Sharing',
            ctaText: 'Open Recommended Tool',
            metaTitle: input.metaTitle,
            metaDescription: input.metaDescription,
            uniqueContent: {
                title: 'Why this matters',
                paragraphs: input.whyItMatters,
                faq: input.faq,
            },
        },
    };
}

export const PDF_RESOURCES: PdfResourceDefinition[] = [
    createResource({
        id: 'remove-hidden-data-bank-statement',
        kind: 'vertical',
        path: '/use-cases/remove-hidden-data-bank-statement-pdf',
        title: 'Remove Hidden Data from Bank Statement PDF',
        summary: 'Clean metadata and hidden document traces before sending a bank statement externally.',
        problem: 'Bank statements often contain hidden document properties and identifying details that are not necessary for the recipient to see.',
        whyItMatters: [
            'Bank statements are commonly emailed to lenders, landlords, brokers, and accountants. Hidden metadata can reveal software, identity details, and document history beyond what the recipient needs.',
            'Even when balances or account numbers are redacted visually, the file can still contain authoring traces or other information in its metadata.',
        ],
        checklist: [
            'Remove hidden document properties before sharing the statement.',
            'Check that any visible redactions are flattened into the final export.',
            'Review whether names, dates, or account details still appear in text layers.',
        ],
        primaryToolPath: '/tools/remove-pdf-metadata',
        secondaryToolPath: '/auditor',
        relatedPaths: ['/redact-bank-statement', '/tools/remove-hidden-text'],
        metaTitle: 'Remove Hidden Data from Bank Statement PDF',
        metaDescription: 'Remove hidden data from a bank statement PDF before sending it to lenders, landlords, or brokers.',
        securityHero: 'Clean bank statement PDFs locally before sharing.',
        subhead: 'Remove hidden document properties from a bank statement before sending it to a lender, broker, or landlord.',
    }),
    createResource({
        id: 'remove-comments-legal-pdf',
        kind: 'vertical',
        path: '/use-cases/remove-comments-from-legal-pdf-before-filing',
        title: 'Remove Comments from Legal PDF Before Filing',
        summary: 'Clear notes, highlights, and review markup before a legal PDF is filed or shared externally.',
        problem: 'Legal drafts often carry comment layers, highlights, or note replies that should not travel with the final filing or production copy.',
        whyItMatters: [
            'Review notes and markup can expose internal thinking, negotiation history, or privileged comments if they remain attached to the final PDF.',
            'A legal filing or production copy should be cleaned of stray annotations before it leaves your team.',
        ],
        checklist: [
            'Remove sticky notes, highlights, free text, and popup replies.',
            'Check that no annotation text still appears after cleanup.',
            'Run a deeper review if the document also contains redactions.',
        ],
        primaryToolPath: '/tools/remove-pdf-comments',
        secondaryToolPath: '/auditor',
        relatedPaths: ['/redact-legal-documents', '/tools/remove-adobe-comments-from-pdf'],
        metaTitle: 'Remove Comments from Legal PDF Before Filing',
        metaDescription: 'Remove comments and markup from a legal PDF before filing or sharing the final copy.',
        securityHero: 'Clean legal review markup locally before filing.',
        subhead: 'Remove comments, highlights, and note layers before a legal PDF is filed or shared externally.',
    }),
    createResource({
        id: 'flatten-rental-application',
        kind: 'vertical',
        path: '/use-cases/flatten-rental-application-pdf-before-submission',
        title: 'Flatten Rental Application PDF Before Submission',
        summary: 'Turn a completed rental application into a more static final copy before you send it.',
        problem: 'Rental application packets often contain editable fields, comments, or extra document properties that should be cleaned before submission.',
        whyItMatters: [
            'Rental applications contain sensitive identity and financial details. A finalized copy is easier to review and safer to share than an editable draft.',
            'Flattening helps prevent casual edits to completed forms before they reach the property manager or landlord.',
        ],
        checklist: [
            'Flatten editable fields before sending the completed packet.',
            'Remove unnecessary comments or review markup.',
            'Check the final file for hidden sensitive-data exposure if needed.',
        ],
        primaryToolPath: '/tools/flatten-fillable-pdf',
        secondaryToolPath: '/auditor',
        relatedPaths: ['/redact-rental-application', '/tools/remove-editable-fields-from-pdf'],
        metaTitle: 'Flatten Rental Application PDF Before Submission',
        metaDescription: 'Flatten a rental application PDF before submission so it behaves like a final copy instead of an editable draft.',
        securityHero: 'Finalize rental application PDFs locally before submission.',
        subhead: 'Flatten editable fields before sending a rental application packet to a landlord, broker, or property manager.',
    }),
    createResource({
        id: 'scan-medical-records-hidden-identifiers',
        kind: 'vertical',
        path: '/use-cases/scan-medical-records-pdf-for-hidden-identifiers',
        title: 'Scan Medical Records PDF for Hidden Identifiers',
        summary: 'Review medical PDFs for names, dates, metadata, and other hidden identifier signals before sharing.',
        problem: 'Medical records often contain names, dates of birth, provider details, and metadata that should be reviewed carefully before disclosure.',
        whyItMatters: [
            'Medical PDFs can expose more identifiers than expected, including names in metadata and dates embedded in layered text or notes.',
            'Scanning before disclosure helps catch obvious sensitive-data exposure before the file reaches a third party.',
        ],
        checklist: [
            'Scan for names, dates, and metadata before sharing.',
            'Check whether visible redactions still sit on top of extractable text.',
            'Use the redaction tool if the document still needs cleanup.',
        ],
        primaryToolPath: '/tools/scan-pdf-for-pii',
        secondaryToolPath: '/tools/remove-hidden-text',
        relatedPaths: ['/redact-medical-records', '/auditor'],
        metaTitle: 'Scan Medical Records PDF for Hidden Identifiers',
        metaDescription: 'Scan a medical records PDF for hidden identifiers before sharing it externally.',
        securityHero: 'Scan medical PDFs locally before disclosure.',
        subhead: 'Review medical records for names, dates, metadata, and other hidden identifier signals before the file leaves your control.',
    }),
    createResource({
        id: 'remove-metadata-passport-scan',
        kind: 'vertical',
        path: '/use-cases/remove-metadata-from-passport-scan-pdf',
        title: 'Remove Metadata from Passport Scan PDF',
        summary: 'Clean hidden PDF properties from a passport scan before sending it to a hotel, visa office, or employer.',
        problem: 'A passport scan is already highly sensitive. Hidden PDF properties should not add extra identifying traces beyond the visible image.',
        whyItMatters: [
            'Passport scans can be shared in travel, visa, and HR workflows. Hidden metadata adds even more information to an already sensitive document.',
            'Cleaning metadata is a simple step before deciding whether the visible passport image itself also needs redaction.',
        ],
        checklist: [
            'Remove author, creator, and producer fields before sharing the scan.',
            'Consider redacting passport numbers or MRZ details if not required.',
            'Review the final file for extra text layers or annotations if needed.',
        ],
        primaryToolPath: '/tools/remove-pdf-metadata',
        secondaryToolPath: '/redact-passport',
        relatedPaths: ['/tools/remove-author-from-pdf', '/auditor'],
        metaTitle: 'Remove Metadata from Passport Scan PDF',
        metaDescription: 'Remove metadata from a passport scan PDF before sending it externally.',
        securityHero: 'Clean passport scan metadata locally before sharing.',
        subhead: 'Remove hidden PDF properties from a passport scan before sending it to a hotel, employer, or visa office.',
    }),
    createResource({
        id: 'clean-visa-pdf-before-emailing',
        kind: 'vertical',
        path: '/use-cases/clean-visa-pdf-before-emailing',
        title: 'Clean Visa PDF Before Emailing',
        summary: 'Remove unnecessary metadata or comments before a visa PDF is emailed to an employer, HR team, or immigration contact.',
        problem: 'Visa and immigration documents are sensitive and often passed around by email, where drafts and document properties can leak more than intended.',
        whyItMatters: [
            'Immigration PDFs can contain status details, identifiers, and traces from drafting tools that are not needed by the recipient.',
            'Cleaning the file before emailing reduces the chance of unnecessary data exposure.',
        ],
        checklist: [
            'Remove metadata before emailing the file.',
            'Flatten or redact any fields that should not remain editable or visible.',
            'Review the final file for hidden names, dates, or annotations if needed.',
        ],
        primaryToolPath: '/tools/remove-pdf-metadata',
        secondaryToolPath: '/redact-visa',
        relatedPaths: ['/tools/scan-pdf-for-pii', '/auditor'],
        metaTitle: 'Clean Visa PDF Before Emailing',
        metaDescription: 'Clean a visa PDF before emailing it by removing metadata and reviewing the file for hidden exposure.',
        securityHero: 'Clean visa PDFs locally before emailing.',
        subhead: 'Remove hidden document properties before emailing a visa PDF to an employer, HR team, or immigration contact.',
    }),
    createResource({
        id: 'flatten-signed-nda',
        kind: 'vertical',
        path: '/use-cases/flatten-signed-nda-pdf',
        title: 'Flatten Signed NDA PDF',
        summary: 'Turn a signed NDA into a more static final copy before sharing it outside your team.',
        problem: 'Signed NDAs often pass through review and signature tools that leave editable fields or draft artifacts in the final PDF.',
        whyItMatters: [
            'A final NDA should behave like a stable record, not an editable working document with live fields still attached.',
            'Flattening also helps make the final version easier to archive and circulate safely.',
        ],
        checklist: [
            'Flatten remaining form fields before sharing the signed NDA.',
            'Remove review comments if the document went through markup rounds.',
            'Check the final file for metadata and hidden text if needed.',
        ],
        primaryToolPath: '/tools/flatten-signed-pdf',
        secondaryToolPath: '/auditor',
        relatedPaths: ['/tools/remove-pdf-comments', '/tools/remove-pdf-metadata'],
        metaTitle: 'Flatten Signed NDA PDF',
        metaDescription: 'Flatten a signed NDA PDF before sharing it as a final record.',
        securityHero: 'Finalize signed NDA PDFs locally before sharing.',
        subhead: 'Flatten a signed NDA before sending it to counterparties, clients, or internal stakeholders as a final copy.',
    }),
    createResource({
        id: 'remove-comments-due-diligence',
        kind: 'vertical',
        path: '/use-cases/remove-comments-from-due-diligence-pdf',
        title: 'Remove Comments from Due Diligence PDF',
        summary: 'Clear markup and review notes before a due diligence PDF is shared with counterparties or advisors.',
        problem: 'Due diligence packets often go through multiple review rounds, and comment layers can expose internal notes that should not leave the team.',
        whyItMatters: [
            'Stray highlights, notes, and review threads can reveal negotiation posture or internal concerns in transactional documents.',
            'Cleaning the PDF before sharing the packet reduces the chance of accidental disclosure.',
        ],
        checklist: [
            'Remove all review comments and popups.',
            'Check whether attached notes or markup replies still remain.',
            'Run a deeper review if the packet also contains redacted sections.',
        ],
        primaryToolPath: '/tools/remove-pdf-comments',
        secondaryToolPath: '/auditor',
        relatedPaths: ['/tools/remove-adobe-comments-from-pdf', '/tools/remove-annotations-from-pdf'],
        metaTitle: 'Remove Comments from Due Diligence PDF',
        metaDescription: 'Remove comments and review notes from a due diligence PDF before sharing it externally.',
        securityHero: 'Clean due diligence review markup locally.',
        subhead: 'Remove review comments before a due diligence PDF is shared with counterparties, counsel, or advisors.',
    }),
    createResource({
        id: 'check-court-filing-hidden-text',
        kind: 'vertical',
        path: '/use-cases/check-redacted-court-filing-for-hidden-text',
        title: 'Check Redacted Court Filing for Hidden Text',
        summary: 'Review a redacted court filing for hidden text and metadata before it is filed or shared.',
        problem: 'A redacted court filing can still expose text, metadata, or other traces even after the visible page looks clean.',
        whyItMatters: [
            'Court filings often require a higher standard of review because once filed, exposed content may be difficult or impossible to claw back.',
            'Scanning the final PDF helps catch ghost text, names, dates, or metadata before filing.',
        ],
        checklist: [
            'Scan the filing for hidden text and metadata.',
            'Flatten the file if visible redactions still sit on top of text layers.',
            'Use the redaction workflow if the document still needs cleanup.',
        ],
        primaryToolPath: '/auditor',
        secondaryToolPath: '/tools/remove-hidden-text',
        relatedPaths: ['/redact-legal-documents', '/tools/scan-pdf-for-pii'],
        metaTitle: 'Check Redacted Court Filing for Hidden Text',
        metaDescription: 'Check a redacted court filing for hidden text and metadata before filing it.',
        securityHero: 'Review court filings locally before submission.',
        subhead: 'Check a redacted court filing for hidden text, metadata, and other leak signals before it is filed or shared.',
    }),
    createResource({
        id: 'audit-foia-pdf-redaction-leaks',
        kind: 'vertical',
        path: '/use-cases/audit-foia-pdf-for-redaction-leaks',
        title: 'Audit FOIA PDF for Redaction Leaks',
        summary: 'Review a FOIA PDF for hidden text, metadata, and other redaction leak signals before release.',
        problem: 'FOIA releases often contain many redactions, which makes it especially important to verify that the final PDF no longer exposes the covered material.',
        whyItMatters: [
            'FOIA responses are often public or widely circulated once released. A missed hidden-text leak can expose the exact information that was meant to stay redacted.',
            'Reviewing the final PDF before release helps catch ghost text, names, dates, and leftover metadata.',
        ],
        checklist: [
            'Scan the PDF for hidden text, metadata, names, and dates.',
            'Flatten the file if the redactions were added visually but the text layer remains.',
            'Use the redaction workflow if the final file still needs cleanup.',
        ],
        primaryToolPath: '/auditor',
        secondaryToolPath: '/tools/remove-hidden-text',
        relatedPaths: ['/tools/scan-pdf-for-pii', '/redact-legal-documents'],
        metaTitle: 'Audit FOIA PDF for Redaction Leaks',
        metaDescription: 'Audit a FOIA PDF for redaction leaks before releasing the final file.',
        securityHero: 'Review FOIA PDFs locally before release.',
        subhead: 'Scan a FOIA PDF for hidden text, metadata, and other redaction leak signals before the final release.',
    }),
    createResource({
        id: 'is-my-pdf-safe-to-send',
        kind: 'bridge',
        path: '/guides/is-my-pdf-safe-to-send',
        title: 'Is My PDF Safe to Send?',
        summary: 'Use a quick checklist to decide whether your PDF needs cleanup, flattening, or a deeper review before you send it.',
        problem: 'A PDF can look fine on screen and still contain hidden metadata, comments, or layered text that the recipient can access.',
        whyItMatters: [
            'Many PDF problems are invisible until someone copies text, opens the file in a different editor, or checks the document properties.',
            'A short pre-send review helps you catch the most common issues before the file leaves your control.',
        ],
        checklist: [
            'Check whether the file still contains comments or review markup.',
            'Remove metadata if the document should not reveal authoring details.',
            'Flatten or audit the file if visible redactions are involved.',
        ],
        primaryToolPath: '/tools',
        secondaryToolPath: '/auditor',
        relatedPaths: ['/tools/remove-pdf-metadata', '/tools/remove-pdf-comments', '/tools/remove-hidden-text'],
        metaTitle: 'Is My PDF Safe to Send? | PDF Sharing Checklist',
        metaDescription: 'Use this checklist to decide whether your PDF is safe to send or whether it still needs cleanup or review.',
        securityHero: 'Check PDFs locally before you send them.',
        subhead: 'Use a quick checklist to decide whether your PDF needs metadata cleanup, comment removal, flattening, or a deeper review.',
        faq: [
            { question: 'Is removing visible comments enough?', answer: 'Not always. A PDF can still contain metadata, layered text, or other hidden content even after comments are removed.' },
            { question: 'When should I flatten a PDF?', answer: 'Flattening is most useful when the file still contains selectable or layered text that you do not want to remain in the final version.' },
        ],
    }),
    createResource({
        id: 'why-text-still-copyable',
        kind: 'bridge',
        path: '/guides/why-is-text-still-copyable-in-my-pdf',
        title: 'Why Is Text Still Copyable in My PDF?',
        summary: 'Learn why a PDF can still expose copyable text even after something has been covered visually.',
        problem: 'Many PDFs keep the original text layer intact even when a black box or annotation hides the content on screen.',
        whyItMatters: [
            'If the original text layer still exists, the recipient may still be able to copy, search, or extract the hidden content.',
            'This is one of the most common causes of failed PDF redactions.',
        ],
        checklist: [
            'Check whether the text is still selectable.',
            'Flatten the PDF if the original text layer still remains.',
            'Use the auditor if you want a deeper review of hidden leak signals.',
        ],
        primaryToolPath: '/tools/remove-hidden-text',
        secondaryToolPath: '/auditor',
        relatedPaths: ['/tools/burn-in-pdf-redactions', '/'],
        metaTitle: 'Why Is Text Still Copyable in My PDF?',
        metaDescription: 'Learn why text is still copyable in a PDF and how to flatten the file before sharing it.',
        securityHero: 'Understand hidden PDF text before sending the file.',
        subhead: 'A PDF can still expose copyable text even when the page looks redacted or covered on screen.',
    }),
    createResource({
        id: 'remove-hidden-data-before-emailing',
        kind: 'bridge',
        path: '/guides/how-to-remove-hidden-data-from-pdf-before-emailing',
        title: 'How to Remove Hidden Data from PDF Before Emailing',
        summary: 'A practical guide to cleaning metadata, comments, and layered content before you email a PDF externally.',
        problem: 'Email is one of the most common ways PDFs leave your control, and hidden data often goes with them unless you clean the file first.',
        whyItMatters: [
            'A recipient can often inspect comments, metadata, or layered text more easily than you expect.',
            'A simple cleanup process before emailing reduces the chance of accidental disclosure.',
        ],
        checklist: [
            'Remove comments and review markup before sending.',
            'Strip metadata if the file should not reveal authoring details.',
            'Flatten or audit the file if redactions are involved.',
        ],
        primaryToolPath: '/tools',
        secondaryToolPath: '/auditor',
        relatedPaths: ['/tools/remove-pdf-metadata', '/tools/remove-pdf-comments', '/tools/remove-hidden-text'],
        metaTitle: 'How to Remove Hidden Data from PDF Before Emailing',
        metaDescription: 'Learn how to remove hidden data from a PDF before emailing it to someone else.',
        securityHero: 'Clean PDFs locally before they leave your inbox.',
        subhead: 'Use a simple local cleanup process before you email a PDF to clients, partners, or counterparties.',
    }),
    createResource({
        id: 'preview-redaction-unsafe',
        kind: 'bridge',
        path: '/guides/why-blacking-out-text-in-preview-is-unsafe',
        title: 'Why Blacking Out Text in Preview Is Unsafe',
        summary: 'Understand why a black box in a PDF editor may not be the same as a permanent redaction.',
        problem: 'Some PDF workflows hide content visually without removing the original text layer underneath.',
        whyItMatters: [
            'A file can still contain copyable or extractable text even though the page looks redacted on screen.',
            'Understanding the difference between visual coverage and flattening helps you avoid accidental leaks.',
        ],
        checklist: [
            'Treat visual black boxes as suspicious until the PDF is flattened or reviewed.',
            'Flatten the file if you want an image-based final copy.',
            'Use the auditor to check for hidden text if you want extra confidence.',
        ],
        primaryToolPath: '/tools/remove-hidden-text',
        secondaryToolPath: '/auditor',
        relatedPaths: ['/tools/burn-in-pdf-redactions', '/'],
        metaTitle: 'Why Blacking Out Text in Preview Is Unsafe',
        metaDescription: 'Learn why blacking out text in Preview can still leave hidden text behind in a PDF.',
        securityHero: 'Visual black boxes are not always permanent redactions.',
        subhead: 'A black box in a PDF editor is not necessarily the same thing as removing the underlying text layer.',
    }),
    createResource({
        id: 'permanently-redact-pdf',
        kind: 'bridge',
        path: '/guides/how-to-permanently-redact-a-pdf',
        title: 'How to Permanently Redact a PDF',
        summary: 'Use the redaction workflow, flatten the output, and review the final file before sharing it externally.',
        problem: 'Permanent redaction means more than hiding text visually — the underlying content must no longer remain in the final file.',
        whyItMatters: [
            'A PDF that only looks redacted can still leak text, metadata, or comment content if the underlying layers remain untouched.',
            'A better workflow is to redact, flatten, and review the final file before sharing it.',
        ],
        checklist: [
            'Add redactions in the redaction workspace.',
            'Export a flattened final copy.',
            'Review the final PDF for hidden leak signals if needed.',
        ],
        primaryToolPath: '/',
        secondaryToolPath: '/auditor',
        relatedPaths: ['/tools/remove-hidden-text', '/tools/burn-in-pdf-redactions'],
        metaTitle: 'How to Permanently Redact a PDF',
        metaDescription: 'Learn how to permanently redact a PDF by flattening the final file and reviewing it before sharing.',
        securityHero: 'Permanent PDF redaction starts with a safer workflow.',
        subhead: 'Redact the file, export a flattened copy, and review the final output before sending it to anyone else.',
    }),
    createResource({
        id: 'pdf-cleanup-checklist',
        kind: 'bridge',
        path: '/guides/pdf-cleanup-checklist-before-sharing-externally',
        title: 'PDF Cleanup Checklist Before Sharing Externally',
        summary: 'Use a practical checklist for comments, metadata, hidden text, and form fields before a PDF leaves your organization.',
        problem: 'A PDF can contain more than the visible page image, so a final review checklist helps catch common issues before the file is shared externally.',
        whyItMatters: [
            'PDFs often leave your organization by email, portal upload, court filing, or transaction room. A final checklist helps reduce surprises.',
            'A quick review of comments, metadata, hidden text, and editable fields often catches the most common issues.',
        ],
        checklist: [
            'Remove comments and review markup.',
            'Clean hidden metadata and document properties.',
            'Flatten the file if layered text or editable fields remain.',
        ],
        primaryToolPath: '/tools',
        secondaryToolPath: '/auditor',
        relatedPaths: ['/tools/remove-pdf-comments', '/tools/remove-pdf-metadata', '/tools/flatten-fillable-pdf'],
        metaTitle: 'PDF Cleanup Checklist Before Sharing Externally',
        metaDescription: 'Use this PDF cleanup checklist before sharing a file externally by email, upload, filing, or review room.',
        securityHero: 'Use a final local checklist before any PDF leaves your control.',
        subhead: 'Review the most common PDF leak points before the file is emailed, uploaded, filed, or shared externally.',
    }),
];

export const PDF_RESOURCE_MAP = Object.fromEntries(PDF_RESOURCES.map((resource) => [resource.path, resource])) as Record<string, PdfResourceDefinition>;

export const PDF_RESOURCE_ROUTE_CONFIG = Object.fromEntries(
    PDF_RESOURCES.map((resource) => [resource.path, resource.routeConfig]),
) as Record<string, RouteConfig>;

export function getPdfResourceByPath(pathname: string): PdfResourceDefinition | undefined {
    const normalizedPath = pathname === '/' ? pathname : pathname.replace(/\/+$/, '');
    return PDF_RESOURCE_MAP[normalizedPath];
}
