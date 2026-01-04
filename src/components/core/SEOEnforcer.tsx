import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { getRouteConfig } from '../../lib/landingCopy';

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

            {/* Basic Open Graph */}
            <meta property="og:type" content="website" />
        </Helmet>
    );
}
