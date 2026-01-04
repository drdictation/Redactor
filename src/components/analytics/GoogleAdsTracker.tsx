import { type ReactNode, useCallback } from 'react';
import { trackOnce } from '../../lib/analytics';

interface GoogleAdsTrackerProps {
    /** Google Ads conversion label (e.g., 'AW-XXXXXXX/YYYYY') */
    conversionLabel?: string;
    /** Event name for analytics tracking */
    eventName?: string;
    /** Child element(s) - typically a button */
    children: ReactNode;
    /** Optional onClick handler to chain with tracking */
    onClick?: () => void;
    /** Additional className for wrapper */
    className?: string;
}

/**
 * Wrapper component that fires Google Ads conversion events on click.
 * Wraps any clickable element (typically paywall CTA buttons).
 */
export function GoogleAdsTracker({
    conversionLabel,
    eventName = 'paywall_cta_click',
    children,
    onClick,
    className,
}: GoogleAdsTrackerProps) {
    const handleClick = useCallback(() => {
        // Fire GA4 event
        trackOnce(eventName);

        // Fire Google Ads conversion if label provided
        if (conversionLabel && typeof window !== 'undefined' && typeof window.gtag === 'function') {
            window.gtag('event', 'conversion', {
                send_to: conversionLabel,
            });
        }

        // Chain original onClick handler
        onClick?.();
    }, [conversionLabel, eventName, onClick]);

    return (
        <div className={className} onClick={handleClick}>
            {children}
        </div>
    );
}

/**
 * Simple function to track paywall CTA click without wrapper component.
 * Use this for inline tracking in existing onClick handlers.
 */
export function trackPaywallCTAClick(): void {
    trackOnce('paywall_cta_click');
}
