/**
 * Centralized Analytics Helper
 * 
 * Provides deduplication, debug logging, and consistent event tracking
 * for both GA4 and Google Ads conversions.
 */

// Track fired events to prevent duplicates
const firedEvents = new Set<string>();

// Debug mode - enable in dev or via URL param
const DEBUG = import.meta.env.DEV ||
    (typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('debug_analytics'));

interface EventParams {
    [key: string]: string | number | boolean | undefined;
}

/**
 * Fire an analytics event (can fire multiple times)
 */
export function track(eventName: string, params?: EventParams): void {
    if (DEBUG) {
        console.log(`[Analytics] track: ${eventName}`, params || {});
    }

    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', eventName, params);
    }
}

/**
 * Fire an analytics event only once per session (deduplicated)
 * Use for events that should only fire once per user journey
 */
export function trackOnce(eventName: string, params?: EventParams): boolean {
    // Create unique key including relevant params for deduplication
    const dedupeKey = params?.transaction_id
        ? `${eventName}_${params.transaction_id}`
        : eventName;

    if (firedEvents.has(dedupeKey)) {
        if (DEBUG) {
            console.log(`[Analytics] trackOnce SKIPPED (duplicate): ${eventName}`);
        }
        return false;
    }

    firedEvents.add(dedupeKey);

    if (DEBUG) {
        console.log(`[Analytics] trackOnce: ${eventName}`, params || {});
    }

    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', eventName, params);
    }

    return true;
}

/**
 * Fire a Google Ads conversion event (deduplicated by transaction_id)
 */
export function trackConversion(
    sendTo: string,
    value: number,
    currency: string,
    transactionId: string
): boolean {
    return trackOnce('conversion', {
        send_to: sendTo,
        value,
        currency,
        transaction_id: transactionId,
    });
}

/**
 * Reset tracking state (useful for testing)
 */
export function resetTracking(): void {
    firedEvents.clear();
    if (DEBUG) {
        console.log('[Analytics] Tracking state reset');
    }
}

// ============================================
// FUNNEL EVENT HELPERS
// ============================================

export function trackLandingPageView(route: string): void {
    trackOnce('view_landing_page', { page_path: route });
}

export function trackUploadCTAClick(): void {
    track('click_upload_cta');
}

export function trackUploadStarted(fileSize: number, fileType: string): void {
    trackOnce('upload_started', { file_size: fileSize, file_type: fileType });
}

export function trackUploadCompleted(pageCount: number): void {
    trackOnce('upload_completed', { page_count: pageCount });
}

export function trackPreviewRendered(pageCount: number): void {
    trackOnce('preview_rendered', { page_count: pageCount });
}

export function trackPaywallShown(): void {
    trackOnce('paywall_shown');
}

export function trackPurchaseInitiated(value: number): void {
    trackOnce('purchase_initiated', { value, currency: 'USD' });
}

export function trackPurchaseCompleted(transactionId: string, value: number): void {
    // Fire GA4 event
    trackOnce('purchase_completed', {
        transaction_id: transactionId,
        value,
        currency: 'USD'
    });

    // Fire Google Ads conversion
    trackConversion(
        'AW-17755885311/rtPjCMC9rNcbEP-d1ZJC',
        value,
        'USD',
        transactionId
    );
}
