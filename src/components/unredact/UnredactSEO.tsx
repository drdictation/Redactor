import { Helmet } from 'react-helmet-async';

/**
 * SEO component for the Unredact Forensics page.
 * Targets high-anxiety keywords like "how to unredact pdf" and "recover blackout text".
 */
export function UnredactSEO() {
    const title = "Can Your PDF Be Un-Redacted? Free Redaction Reversibility Test";
    const description = "Don't rely on black boxes. Test if your redacted PDF can be reversed by hackers. Simulates common 'unredact' scripts locally in your browser.";
    const canonicalUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/unredact`;

    // FAQ Schema for rich snippets
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Can you unredact a PDF locally?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "This tool simulates common 'unredact' techniques that hackers use—like layer peeling and metadata extraction—directly in your browser. It checks if your redaction method left recoverable data. No file is uploaded to any server."
                }
            },
            {
                "@type": "Question",
                "name": "Is blacking out text in Mac Preview sufficient for redaction?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No. Mac Preview's 'Redact' annotation often only draws a black box over text without removing the underlying data. Anyone with a PDF editor can delete the annotation and reveal the original text. True redaction requires permanent text removal, not just visual covering."
                }
            },
            {
                "@type": "Question",
                "name": "How do I make PDF redaction permanent and irreversible?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Permanent redaction requires: 1) Removing the actual text data (not just covering it), 2) Stripping all metadata, and 3) Flattening or rasterizing the document. Our audit tool can verify if your redaction is truly permanent and provide a sanitized copy if vulnerabilities are found."
                }
            }
        ]
    };

    // Determine if we're on a preview/staging environment
    const isVercel = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app');

    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />

            {/* Canonical */}
            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:type" content="website" />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />

            {/* FAQ Schema */}
            <script type="application/ld+json">
                {JSON.stringify(faqSchema)}
            </script>

            {/* NoIndex for preview deployments */}
            {isVercel && <meta name="robots" content="noindex" />}
        </Helmet>
    );
}
