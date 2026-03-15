/**
 * Centralized Analytics Helper
 * 
 * Provides deduplication, debug logging, and consistent event tracking
 * for both GA4 and Google Ads conversions.
 */

// Track fired events to prevent duplicates
const firedEvents = new Set<string>();

// Track event counts for repeat-action visibility
const eventCounts = new Map<string, number>();

// Debug mode - enable in dev or via URL param
const DEBUG = import.meta.env.DEV ||
    (typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('debug_analytics'));

interface EventParams {
    [key: string]: any;
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

        // Still track repeat actions as a separate counted event so GA4 sees session depth
        const count = (eventCounts.get(eventName) || 1) + 1;
        eventCounts.set(eventName, count);
        track(`${eventName}_repeat`, { ...params, repeat_count: count });

        return false;
    }

    firedEvents.add(dedupeKey);
    eventCounts.set(eventName, 1);

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
    eventCounts.clear();
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

// ============================================
// AUDITOR-SPECIFIC FUNNEL EVENTS
// ============================================

/**
 * Track when user drops/selects a file to scan
 * Privacy: Only tracks file size, NOT filename
 */
export function trackScanInitiated(fileSize: number): void {
    trackOnce('scan_initiated', {
        file_size: fileSize,
        product: 'auditor'
    });
}

/**
 * Track scan completion with results
 * This is critical for understanding product quality
 */
export function trackScanCompleted(
    leaksFoundCount: number,
    hasGhostText: boolean,
    hasMetadata: boolean,
    scanDurationMs: number
): void {
    // 1. Fire generic GA4 event
    trackOnce('scan_completed', {
        leaks_found_count: leaksFoundCount,
        has_ghost_text: hasGhostText,
        has_metadata: hasMetadata,
        scan_duration_ms: scanDurationMs,
        product: 'auditor'
    });

    // 2. Google Ads Conversion for "Audit Scanned" (Lead/Engagement)
    // TODO: Create a conversion action in Google Ads for scan_completed,
    // then replace PLACEHOLDER_LABEL with the real label and uncomment:
    // if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    //     window.gtag('event', 'conversion', {
    //         send_to: 'AW-17755885311/YOUR_REAL_LABEL_HERE',
    //     });
    // }
}

/**
 * Track auditor paywall view (separate from redactor paywall)
 */
export function trackAuditPaywallShown(): void {
    trackOnce('audit_paywall_shown', { product: 'auditor' });
}

/**
 * Track $29 CTA click - THE critical conversion event for Google Ads
 * Uses event_callback to ensure event fires before Stripe redirect
 */
export function trackAuditPurchaseClick(callback?: () => void): void {
    // 1. Fire standard GA4 e-commerce event
    trackOnce('begin_checkout', {
        value: 29,
        currency: 'USD',
        items: [{
            item_id: 'audit_report_29',
            item_name: 'Certified Audit Report',
            price: 29
        }]
    });

    // 2. Fire existing custom event for backward compatibility
    trackOnce('audit_purchase_click', {
        value: 29,
        currency: 'USD',
        product: 'auditor'
    });

    // 3. Fire Google Ads conversion
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'conversion', {
            send_to: 'AW-17755885311/bdlVCLzXsdwbEP-d1ZJC',
            value: 29.0,
            currency: 'USD',
            event_callback: callback
        });
    } else if (callback) {
        callback();
    }
}



export function trackToolPageView(toolPath: string, mode: string): void {
    track('view_tool_page', { tool_path: toolPath, tool_mode: mode });
}

export function trackToolProcessed(toolPath: string, mode: string, metrics?: EventParams): void {
    track('tool_processed', { tool_path: toolPath, tool_mode: mode, ...metrics });
}

export function trackToolNextStepClick(toolPath: string, targetPath: string): void {
    track('click_tool_next_step', { tool_path: toolPath, target_path: targetPath });
}

export function trackToolsHubView(): void {
    trackOnce('view_tools_hub');
}

export function trackGuidePageView(resourcePath: string, kind: string): void {
    track('view_pdf_guide', { resource_path: resourcePath, resource_kind: kind });
}

export function trackGuidePrimaryClick(resourcePath: string, targetPath: string): void {
    track('click_pdf_guide_primary', { resource_path: resourcePath, target_path: targetPath });
}
