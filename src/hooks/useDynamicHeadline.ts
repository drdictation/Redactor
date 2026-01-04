import { useSearchParams } from 'react-router-dom';

export interface DynamicHeadline {
    mainText: string;
    emphasisText: string;
}

const HEADLINE_MAP: Record<string, DynamicHeadline> = {
    legal: {
        mainText: 'Your Court Filing May Still Be Leaking.',
        emphasisText: "We'll Find the Hidden Text.",
    },
    finance: {
        mainText: 'Bank Statement Redactions Fail.',
        emphasisText: "We'll Prove It With a Scan.",
    },
    hr: {
        mainText: 'SSN Redactions Often Leave Data Behind.',
        emphasisText: 'Audit Before You Share.',
    },
};

const DEFAULT_HEADLINE: DynamicHeadline = {
    mainText: 'Your Redactions are Leaking.',
    emphasisText: "We'll Prove It.",
};

/**
 * Hook for dynamic keyword insertion based on Google Ads URL parameters.
 * Reads ?target= or ?q= parameter and returns the appropriate headline.
 */
export function useDynamicHeadline(): DynamicHeadline {
    const [searchParams] = useSearchParams();

    // Support both ?target= and ?q= parameters
    const target = searchParams.get('target') || searchParams.get('q');

    if (target && HEADLINE_MAP[target.toLowerCase()]) {
        return HEADLINE_MAP[target.toLowerCase()];
    }

    return DEFAULT_HEADLINE;
}
