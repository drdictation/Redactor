import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

import { getRouteConfig } from '../../lib/landingCopy';
import { PDF_TOOLS } from '../../lib/pdf-tools/catalog';

const HOWTO_STEPS = [
    { text: 'Drag and drop your PDF document into the secure browser tool.' },
    { text: 'Choose the relevant cleanup, redaction, or scan option for the file.' },
    { text: 'Download the cleaned copy or continue into a deeper review if needed.' },
];

export function SEOEnforcer() {
    const location = useLocation();
    const routeConfig = getRouteConfig(location.pathname);
    const isVercel = window.location.hostname.includes('vercel.app');
    const shouldNoIndex = isVercel;

    if (import.meta.env.DEV && routeConfig.path === '/' && location.pathname !== '/') {
        console.warn(`[SEO-CRITICAL] Route "${location.pathname}" missing from ROUTE_CONFIG. Falling back to Homepage Canonical.`);
    }

    const isIntentPage = routeConfig.path.startsWith('/redact-') || routeConfig.path.startsWith('/guides/') || routeConfig.path.startsWith('/use-cases/');

    const howToSchema = isIntentPage ? {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: routeConfig.h1,
        description: routeConfig.metaDescription,
        step: HOWTO_STEPS.map((step, index) => ({
            '@type': 'HowToStep',
            position: index + 1,
            text: step.text,
        })),
    } : null;

    const faqSchema = routeConfig.uniqueContent?.faq && routeConfig.uniqueContent.faq.length > 0 ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: routeConfig.uniqueContent.faq.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
            },
        })),
    } : null;

    const collectionSchema = routeConfig.path === '/tools' ? {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: routeConfig.h1,
        description: routeConfig.metaDescription,
        mainEntity: {
            '@type': 'ItemList',
            itemListElement: PDF_TOOLS.slice(0, 20).map((tool, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                url: `${window.location.origin}${tool.path}`,
                name: tool.name,
            })),
        },
    } : null;

    return (
        <Helmet>
            <link rel="canonical" href={`${window.location.origin}${routeConfig.path === '/' ? '' : routeConfig.path}`} />
            {shouldNoIndex && <meta name="robots" content="noindex" />}
            <title>{routeConfig.metaTitle}</title>
            <meta name="description" content={routeConfig.metaDescription} />
            <meta property="og:title" content={routeConfig.metaTitle} />
            <meta property="og:description" content={routeConfig.metaDescription} />
            <meta property="og:url" content={`${window.location.origin}${routeConfig.path}`} />
            <meta property="og:image" content={`${window.location.origin}/og-image.png`} />
            <meta property="og:type" content="website" />
            {howToSchema && <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>}
            {faqSchema && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}
            {collectionSchema && <script type="application/ld+json">{JSON.stringify(collectionSchema)}</script>}
        </Helmet>
    );
}
