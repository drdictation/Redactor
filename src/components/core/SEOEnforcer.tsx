import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { getRouteConfig } from '../../lib/landingCopy';

// HowTo schema steps for intent-based landing pages
const HOWTO_STEPS = [
    { text: "Drag and drop your PDF document into the secure browser tool." },
    { text: "Draw black boxes over any sensitive information you want to redact." },
    { text: "Click 'Export' to download a flattened, permanently redacted PDF." },
];

export function SEOEnforcer() {
    const location = useLocation();
    const routeConfig = getRouteConfig(location.pathname);

    // 1. Hostname Protection (Preview Indexing Mitigation)
    // Replace 'reactpdf.app' with your actual production domain when known
    // For now, we assume anything with 'vercel.app' is a preview/staging env
    const isVercel = window.location.hostname.includes('vercel.app');
    // If we had a known prod domain, we'd act more strictly: 
    // const isProduction = window.location.hostname === 'reactpdf.app';
    // const shouldNoIndex = !isProduction && isVercel;

    // Since we don't know the prod domain yet, we'll aggressively protect vercel.app domains
    // UNLESS it's the specific production deployment (which user should configure env vars for eventually).
    // For MVP safety: default to noindex on vercel.app
    const shouldNoIndex = isVercel;

    // 2. Soft-404 Dev Warning (Process Risk Mitigation)
    if (import.meta.env.DEV && routeConfig.path === '/' && location.pathname !== '/') {
        console.warn(`[SEO-CRITICAL] Route "${location.pathname}" missing from ROUTE_CONFIG. Falling back to Homepage Canonical.`);
    }

    // 3. Check if this is an intent-based landing page (not homepage or auditor)
    const isIntentPage = routeConfig.path.startsWith('/redact-');

    // Generate HowTo schema for intent pages
    const howToSchema = isIntentPage ? {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": `How to ${routeConfig.h1}`,
        "description": routeConfig.metaDescription,
        "step": HOWTO_STEPS.map((step, index) => ({
            "@type": "HowToStep",
            "position": index + 1,
            "text": step.text,
        })),
        "tool": {
            "@type": "HowToTool",
            "name": "ReactPDF Redaction Tool"
        }
    } : null;

    // Generate FAQ schema for pages with FAQ content
    const faqSchema = routeConfig.uniqueContent?.faq && routeConfig.uniqueContent.faq.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": routeConfig.uniqueContent.faq.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
            }
        }))
    } : null;

    return (
        <Helmet>
            {/* Canonical Logic */}
            <link rel="canonical" href={`${window.location.origin}${routeConfig.path === '/' ? '' : routeConfig.path}`} />

            {/* Preview Enforced NoIndex */}
            {shouldNoIndex && <meta name="robots" content="noindex" />}

            {/* Default Meta from Config */}
            <title>{routeConfig.metaTitle}</title>
            <meta name="description" content={routeConfig.metaDescription} />
            <meta property="og:title" content={routeConfig.metaTitle} />
            <meta property="og:description" content={routeConfig.metaDescription} />
            <meta property="og:url" content={`${window.location.origin}${routeConfig.path}`} />
            <meta property="og:image" content={`${window.location.origin}/og-image.png`} />

            {/* Basic Open Graph */}
            <meta property="og:type" content="website" />

            {/* HowTo Schema for Intent Pages */}
            {howToSchema && (
                <script type="application/ld+json">
                    {JSON.stringify(howToSchema)}
                </script>
            )}

            {/* FAQ Schema for Pages with FAQ Content */}
            {faqSchema && (
                <script type="application/ld+json">
                    {JSON.stringify(faqSchema)}
                </script>
            )}
        </Helmet>
    );
}
