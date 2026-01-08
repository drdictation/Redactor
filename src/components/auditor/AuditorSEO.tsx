import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';

interface AuditorSEOMeta {
    title: string;
    description: string;
    canonicalPath: string;
}

const TARGET_SEO_MAP: Record<string, AuditorSEOMeta> = {
    legal: {
        title: 'Legal Document Redaction Auditor | Find Hidden Text in Court Filings',
        description: 'Your court documents may still be leaking hidden text. Scan FOIA requests, legal discovery, and court filings for ghost text. 100% client-side.',
        canonicalPath: '/auditor', // All variants point to main auditor canonical
    },
    finance: {
        title: 'Bank Statement Redaction Auditor | Check for Hidden Account Numbers',
        description: 'Bank statement redactions often fail. Scan for hidden account numbers and SSNs that anyone can copy. No upload required.',
        canonicalPath: '/auditor',
    },
    hr: {
        title: 'HR Document Redaction Auditor | Find Hidden SSNs & PII',
        description: 'SSN redactions often leave data behind. Audit employee records for hidden PII before sharing. 100% private, no server upload.',
        canonicalPath: '/auditor',
    },
};

const DEFAULT_SEO: AuditorSEOMeta = {
    title: 'PDF Redaction Auditor | Find Hidden Text Under Black Boxes',
    description: 'Your PDF redactions may be leaking data. Scan for hidden text and metadata that anyone can copy. 100% client-side, no uploads.',
    canonicalPath: '/auditor',
};

// FAQ Schema for rich snippets
const FAQ_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "What is ghost text in a redacted PDF?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Ghost text is hidden text that remains under black redaction boxes. While visually hidden, this text can be selected, copied, or extracted by anyone with a PDF reader. Most PDF tools only draw a black box over text without removing the underlying data."
            }
        },
        {
            "@type": "Question",
            "name": "Why do PDF redactions leak data?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Many PDF tools (including Adobe Acrobat annotations and Mac Preview) use 'overlay redaction' which draws a visual layer over text. The actual text data remains in the PDF structure. True redaction requires removing the text data and flattening the document."
            }
        },
        {
            "@type": "Question",
            "name": "Is this audit tool safe to use with sensitive documents?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. This tool runs 100% in your browser (client-side). Your PDF is never uploaded to any server. The scanning happens locally using JavaScript, and you can verify this by disconnecting from the internet and using the tool offline."
            }
        },
        {
            "@type": "Question",
            "name": "What types of documents should I audit?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Any document that has been redacted before sharing: court filings, FOIA responses, bank statements, medical records, HR documents, legal contracts, and government documents. These are common targets for data extraction attacks."
            }
        }
    ]
};

/**
 * Dynamic SEO component for the Auditor page.
 * Adjusts meta tags based on ?target= URL parameter for Google Ads campaigns.
 * All variants use canonical pointing to /auditor to consolidate SEO.
 */
export function AuditorSEO() {
    const [searchParams] = useSearchParams();
    const target = searchParams.get('target') || searchParams.get('q');

    const seo = (target && TARGET_SEO_MAP[target.toLowerCase()]) || DEFAULT_SEO;

    // Determine if we're on a preview/staging environment
    const isVercel = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app');

    return (
        <Helmet>
            <title>{seo.title}</title>
            <meta name="description" content={seo.description} />

            {/* Canonical - all ?target= variants point to main /auditor */}
            <link rel="canonical" href={`${window.location.origin}${seo.canonicalPath}`} />

            {/* Open Graph */}
            <meta property="og:title" content={seo.title} />
            <meta property="og:description" content={seo.description} />
            <meta property="og:url" content={`${window.location.origin}/auditor`} />
            <meta property="og:type" content="website" />
            <meta property="og:image" content={`${window.location.origin}/og-image.png`} />

            {/* NoIndex for preview deployments */}
            {isVercel && <meta name="robots" content="noindex" />}

            {/* FAQ Schema for Rich Snippets */}
            <script type="application/ld+json">
                {JSON.stringify(FAQ_SCHEMA)}
            </script>
        </Helmet>
    );
}

