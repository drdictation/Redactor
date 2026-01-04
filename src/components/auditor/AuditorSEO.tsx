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

            {/* NoIndex for preview deployments */}
            {isVercel && <meta name="robots" content="noindex" />}
        </Helmet>
    );
}
