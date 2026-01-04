export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface Leak {
    id: string;
    description: string;
    severity: Severity;
    pageNumber?: number;
    boundingBox?: BoundingBox; // For visual overlay
}

export interface MetadataLeak extends Leak {
    key: string;
    value: string;
}

export interface GhostTextLeak extends Leak {
    hiddenText: string;
}

export interface ScanResult {
    leaks: Leak[];
    score: number; // 0-100 (100 is clean)
    timestamp: string;
    redactionCount: number; // Total black boxes found
    datesFound: DateFound[]; // Detected dates
    namesFound: NameMatch[]; // Detected names
}

export interface DateFound {
    raw: string; // Original text
    parsed: Date; // Parsed date object
    pageNumber: number;
}

export interface NameMatch {
    match: string; // The detected name
    context: string; // Surrounding text for verification
    type: 'common_name' | 'contextual' | 'user_provided';
    pageNumber: number;
}

