import * as pdfjsLib from 'pdfjs-dist';
import type { BoundingBox, Leak, ScanResult, Severity, DateFound, NameMatch } from './types';
import { isCommonName } from './names-db';

// DEBUG LOGGER
const DEBUG = true;
function log(msg: string, data?: any) {
    if (DEBUG) {
        if (data) console.log(`[RedactionAuditor] ${msg}`, data);
        else console.log(`[RedactionAuditor] ${msg}`);
    }
}

// -----------------------------------------------------------------------
// HELPER FUNCTIONS
// -----------------------------------------------------------------------

// Helper to calculate relative luminance
// Returns value 0-1 where 0 is black
function getLuminance(r: number, g: number, b: number): number {
    const a = [r, g, b].map(function (v) {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// Check if two boxes overlap by more than overlapThreshold (0-1)
// Box is [x, y, w, h] (pdf.js coordinate system usually needs normalization)
function getIntersectionRatio(boxA: BoundingBox, boxB: BoundingBox): number {
    const xA = Math.max(boxA.x, boxB.x);
    const yA = Math.max(boxA.y, boxB.y);
    const xB = Math.min(boxA.x + boxA.width, boxB.x + boxB.width);
    const yB = Math.min(boxA.y + boxA.height, boxB.y + boxB.height);

    if (xA < xB && yA < yB) {
        const intersectionArea = (xB - xA) * (yB - yA);
        const areaA = boxA.width * boxA.height;
        // Check ratio against the text item (boxA)
        return intersectionArea / areaA;
    }
    return 0;
}

// Extract RGB from fill style args
function getRGBFromStyle(args: any[]): { r: number, g: number, b: number } | null {
    // Check if args is null/undefined
    if (!args) return null;

    // Handle single color object (e.g. {r, g, b}) - PDF.js sometimes does this
    if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null) {
        // Not typical but defensive
        return null;
    }

    // Standard PDF-JS args handling
    // If args is a TypedArray or Array:
    // RGB (3 args)
    if (args.length === 3) {
        return { r: args[0] * 255, g: args[1] * 255, b: args[2] * 255 };
    }
    // Grayscale (1 arg)
    if (args.length === 1 && typeof args[0] === 'number') {
        const val = args[0] * 255;
        return { r: val, g: val, b: val };
    }
    // CMYK (4 args)
    if (args.length === 4) {
        const c = args[0], m = args[1], y = args[2], k = args[3];
        const r = 255 * (1 - c) * (1 - k);
        const g = 255 * (1 - m) * (1 - k);
        const b = 255 * (1 - y) * (1 - k);
        return { r, g, b };
    }
    return null;
}

// Detect black rectangles in a rasterized page by rendering to canvas and scanning pixels
async function detectBlackRectsInRaster(page: pdfjsLib.PDFPageProxy): Promise<BoundingBox[]> {
    const scale = 0.5; // Lower res for speed
    const viewport = page.getViewport({ scale });

    // Create offscreen canvas
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return [];

    // Render page
    await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;

    // Get pixel data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;

    // Create a binary mask of "black" pixels (luminance < 10)
    const blackMask: boolean[][] = [];
    for (let y = 0; y < height; y++) {
        blackMask[y] = [];
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            const r = data[idx], g = data[idx + 1], b = data[idx + 2];
            const lum = getLuminance(r, g, b);
            blackMask[y][x] = lum < 0.02; // Very dark threshold
        }
    }

    // Find rectangular black regions using simple connected component analysis
    // For simplicity, we'll scan for horizontal runs of black pixels and group them
    const minWidth = 20 / scale; // Minimum 20px wide at full scale
    const minHeight = 10 / scale; // Minimum 10px tall

    const rects: BoundingBox[] = [];
    const visited: boolean[][] = blackMask.map(row => row.map(() => false));

    for (let startY = 0; startY < height; startY++) {
        for (let startX = 0; startX < width; startX++) {
            if (!blackMask[startY][startX] || visited[startY][startX]) continue;

            // Found a black pixel, try to expand into a rectangle
            let endX = startX;
            while (endX < width && blackMask[startY][endX] && !visited[startY][endX]) {
                endX++;
            }
            const rectWidth = endX - startX;
            if (rectWidth < minWidth) {
                // Mark as visited but too small
                for (let x = startX; x < endX; x++) visited[startY][x] = true;
                continue;
            }

            // Expand downward
            let endY = startY;
            while (endY < height) {
                let rowBlack = true;
                for (let x = startX; x < endX; x++) {
                    if (!blackMask[endY][x]) { rowBlack = false; break; }
                }
                if (!rowBlack) break;
                endY++;
            }
            const rectHeight = endY - startY;

            // Mark visited
            for (let y = startY; y < endY; y++) {
                for (let x = startX; x < endX; x++) {
                    visited[y][x] = true;
                }
            }

            if (rectHeight >= minHeight) {
                // Convert back to PDF coordinates (unscale)
                const pdfViewport = page.getViewport({ scale: 1 });
                rects.push({
                    x: startX / scale,
                    y: pdfViewport.height - (endY / scale), // Flip Y axis for PDF coords
                    width: rectWidth / scale,
                    height: rectHeight / scale
                });
            }
        }
    }

    log(`Raster scan found ${rects.length} black rectangular regions.`);
    return rects;
}

// -----------------------------------------------------------------------
// PII DETECTION HELPERS
// -----------------------------------------------------------------------

// Date regex patterns for common formats
const DATE_PATTERNS = [
    // MM/DD/YYYY or MM-DD-YYYY or MM.DD.YYYY
    /\b(0?[1-9]|1[0-2])[\/\-\.](0?[1-9]|[12]\d|3[01])[\/\-\.](\d{4}|\d{2})\b/g,
    // DD/MM/YYYY or DD-MM-YYYY or DD.MM.YYYY
    /\b(0?[1-9]|[12]\d|3[01])[\/\-\.](0?[1-9]|1[0-2])[\/\-\.](\d{4}|\d{2})\b/g,
    // YYYY-MM-DD (ISO format)
    /\b(\d{4})[\/\-\.](0?[1-9]|1[0-2])[\/\-\.](0?[1-9]|[12]\d|3[01])\b/g,
    // Month DD, YYYY or Month DD YYYY
    /\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(0?[1-9]|[12]\d|3[01])(?:st|nd|rd|th)?,?\s+(\d{4})\b/gi,
    // DD Month YYYY
    /\b(0?[1-9]|[12]\d|3[01])(?:st|nd|rd|th)?\s+(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(\d{4})\b/gi,
];

// Contextual patterns for name detection (more comprehensive)
const NAME_CONTEXT_PATTERNS = [
    // Standard labels with colon: "Name: John Doe", "Patient: Jane Smith"
    /\b(?:Name|Patient|Applicant|Client|Customer|Beneficiary|Employee|Candidate|Holder|Owner|Payer)\s*[:\-]\s*([A-Za-z][A-Za-z]+(?:\s+[A-Za-z][A-Za-z]+)*)/gi,
    // First/Last name labels
    /\b(?:First\s*Name|Given\s*Name|Nama)\s*[:\-]\s*([A-Za-z][A-Za-z]+)/gi,
    /\b(?:Last\s*Name|Surname|Family\s*Name)\s*[:\-]\s*([A-Za-z][A-Za-z]+)/gi,
    /\b(?:Full\s*Name)\s*[:\-]\s*([A-Za-z][A-Za-z]+(?:\s+[A-Za-z]\.?\s*)?(?:\s+[A-Za-z][A-Za-z]+)*)/gi,
    // Honorifics: "Mr. John Smith", "Dr Jane Doe"
    /\b(?:Mr|Mrs|Ms|Miss|Dr|Prof|Sir|Madam)\\.?\\s+([A-Za-z][A-Za-z]+(?:\\s+[A-Za-z][A-Za-z]+)*)/gi,
    // ALL CAPS patterns (common in official docs)
    /\bNAME\s*[:\-]\s*([A-Z][A-Z]+(?:\s+[A-Z][A-Z]+)*)/g,
    /\bNAMA\s*[:\-]\s*([A-Z][A-Z]+(?:\s+[A-Z][A-Z]+)*)/g,
    // Patterns without colon but after common labels followed by whitespace
    /\b(?:Name|Nama)\s{2,}([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/g,
];

// Extract dates from text
function extractDates(text: string, pageNumber: number): DateFound[] {
    const found: DateFound[] = [];
    const seen = new Set<string>();

    for (const pattern of DATE_PATTERNS) {
        pattern.lastIndex = 0; // Reset regex state
        let match;
        while ((match = pattern.exec(text)) !== null) {
            const raw = match[0];
            if (seen.has(raw)) continue;
            seen.add(raw);

            // Attempt to parse the date
            const parsed = new Date(raw);
            if (!isNaN(parsed.getTime())) {
                found.push({ raw, parsed, pageNumber });
            } else {
                // Try alternate parsing for non-ISO formats
                const altParsed = parseDateFuzzy(raw);
                if (altParsed) {
                    found.push({ raw, parsed: altParsed, pageNumber });
                }
            }
        }
    }

    return found;
}

// Fuzzy date parser for common formats
function parseDateFuzzy(dateStr: string): Date | null {
    // Try various parsing strategies
    const months: { [key: string]: number } = {
        'jan': 0, 'january': 0, 'feb': 1, 'february': 1, 'mar': 2, 'march': 2,
        'apr': 3, 'april': 3, 'may': 4, 'jun': 5, 'june': 5, 'jul': 6, 'july': 6,
        'aug': 7, 'august': 7, 'sep': 8, 'sept': 8, 'september': 8,
        'oct': 9, 'october': 9, 'nov': 10, 'november': 10, 'dec': 11, 'december': 11
    };

    // Check for month name patterns
    const monthMatch = dateStr.match(/\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\b/i);
    if (monthMatch) {
        const monthName = monthMatch[1].toLowerCase().slice(0, 3);
        const month = months[monthName];
        const dayMatch = dateStr.match(/\b(\d{1,2})(?:st|nd|rd|th)?\b/);
        const yearMatch = dateStr.match(/\b(19|20)\d{2}\b/);
        if (month !== undefined && dayMatch && yearMatch) {
            return new Date(parseInt(yearMatch[0]), month, parseInt(dayMatch[1]));
        }
    }

    // Try numeric formats
    const numericMatch = dateStr.match(/(\d{1,4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,4})/);
    if (numericMatch) {
        const [, a, b, c] = numericMatch.map(Number);
        // Heuristic: if first number > 31, it's probably YYYY-MM-DD
        if (a > 31) return new Date(a, b - 1, c);
        // Otherwise try MM/DD/YYYY
        if (c > 31) return new Date(c, a - 1, b);
    }

    return null;
}

// Extract names from text using contextual patterns and common name list
function extractNames(text: string, pageNumber: number, userProvidedNames?: string[]): NameMatch[] {
    const found: NameMatch[] = [];
    const seen = new Set<string>();

    // Debug: log first 200 chars of text being scanned
    if (DEBUG && text.length > 0) {
        log(`Page ${pageNumber}: Scanning text for names (first 200 chars):`, text.slice(0, 200).replace(/\s+/g, ' '));
    }

    // 1. Check contextual patterns (e.g., "Name: John Doe")
    for (const pattern of NAME_CONTEXT_PATTERNS) {
        pattern.lastIndex = 0;
        let match;
        while ((match = pattern.exec(text)) !== null) {
            const name = match[1].trim();
            if (name.length < 2 || seen.has(name.toLowerCase())) continue;
            seen.add(name.toLowerCase());

            // Get surrounding context
            const start = Math.max(0, match.index - 20);
            const end = Math.min(text.length, match.index + match[0].length + 20);
            const context = text.slice(start, end).replace(/\s+/g, ' ').trim();

            found.push({ match: name, context, type: 'contextual', pageNumber });
        }
    }

    // 2. Check for common names in text (Title Case words: "Kate")
    const wordPattern = /\b([A-Z][a-z]{2,})\b/g;
    let wordMatch;
    while ((wordMatch = wordPattern.exec(text)) !== null) {
        const word = wordMatch[1];
        if (seen.has(word.toLowerCase())) continue;

        if (isCommonName(word)) {
            seen.add(word.toLowerCase());
            const start = Math.max(0, wordMatch.index - 20);
            const end = Math.min(text.length, wordMatch.index + word.length + 20);
            const context = text.slice(start, end).replace(/\s+/g, ' ').trim();
            found.push({ match: word, context, type: 'common_name', pageNumber });
        }
    }

    // 2b. Check for ALL CAPS words (e.g., "KATE", "SMITH") - common in official documents
    const allCapsPattern = /\b([A-Z]{3,})\b/g;
    let capsMatch;
    while ((capsMatch = allCapsPattern.exec(text)) !== null) {
        const word = capsMatch[1];
        if (seen.has(word.toLowerCase())) continue;

        // Check if this ALL CAPS word is a common name (case-insensitive)
        if (isCommonName(word)) {
            seen.add(word.toLowerCase());
            const start = Math.max(0, capsMatch.index - 20);
            const end = Math.min(text.length, capsMatch.index + word.length + 20);
            const context = text.slice(start, end).replace(/\s+/g, ' ').trim();
            found.push({ match: word, context, type: 'common_name', pageNumber });
        }
    }

    // 3. Check user-provided names
    if (userProvidedNames) {
        for (const name of userProvidedNames) {
            const regex = new RegExp(`\\b${name}\\b`, 'gi');
            let userMatch;
            while ((userMatch = regex.exec(text)) !== null) {
                if (seen.has(name.toLowerCase())) continue;
                seen.add(name.toLowerCase());
                const start = Math.max(0, userMatch.index - 20);
                const end = Math.min(text.length, userMatch.index + name.length + 20);
                const context = text.slice(start, end).replace(/\s+/g, ' ').trim();
                found.push({ match: userMatch[0], context, type: 'user_provided', pageNumber });
            }
        }
    }

    return found;
}

// -----------------------------------------------------------------------
// MAIN SCANNER LOGIC
// -----------------------------------------------------------------------

export async function scanPDF(pdf: pdfjsLib.PDFDocumentProxy): Promise<ScanResult> {
    log('Starting scan of PDF with ' + pdf.numPages + ' pages.');

    const leaks: Leak[] = [];
    let totalRedactionCandidates = 0;
    const allDatesFound: DateFound[] = [];
    const allNamesFound: NameMatch[] = [];

    // 1. Metadata Scan
    try {
        const metadata = await pdf.getMetadata().catch(() => ({ info: null, metadata: null }));
        if (metadata.info) {
            const sensitiveKeys = ['Title', 'Author', 'Subject', 'Keywords', 'Creator', 'Producer'];
            sensitiveKeys.forEach(key => {
                const value = (metadata.info as any)[key];
                if (value && typeof value === 'string' && value.trim().length > 0) {
                    // Determine severity based on key
                    let severity: Severity = 'MEDIUM';
                    if (key === 'Author' || key === 'Keywords') severity = 'HIGH';

                    leaks.push({
                        id: `meta-${key}`,
                        description: `Metadata found: ${key} = "${value}"`,
                        severity: severity,
                        pageNumber: 0 // Global
                    });
                }
            });
        }
    } catch (e) {
        console.error("Metadata scan failed", e);
    }

    // 2. Ghost Text & Hidden Layer Scan
    const numPages = pdf.numPages;
    for (let i = 1; i <= numPages; i++) {
        try {
            log(`Scanning Page ${i}...`);
            const page = await pdf.getPage(i);
            const ops = await page.getOperatorList();
            const textContent = await page.getTextContent();

            // Fetch annotations (important for tools like Preview/Acrobat)
            const annotations = await page.getAnnotations();
            log(`Page ${i}: Found ${annotations.length} annotations, ${ops.fnArray.length} operators, ${textContent.items.length} text items.`);

            const blackRects: BoundingBox[] = [];

            // A. Parse Annotations - Check ALL annotations, not just specific subtypes
            for (const ann of annotations) {
                if (DEBUG) {
                    // Log ALL annotation fields to find where Preview stores text
                    log(`Page ${i}: Checking Annotation:`, {
                        subtype: ann.subtype,
                        color: ann.color,
                        interiorColor: (ann as any).interiorColor,
                        rect: ann.rect,
                        annotationType: ann.annotationType,
                        hasPopup: ann.hasPopup,
                        title: ann.title,
                        contents: (ann as any).contents,
                        fieldValue: (ann as any).fieldValue,
                        richText: (ann as any).richText,
                        // Log all keys to see what's available
                        allKeys: Object.keys(ann)
                    });

                    // Special deep log for FreeText annotations
                    if (ann.subtype === 'FreeText') {
                        log(`Page ${i}: FreeText DEEP DUMP:`, JSON.stringify(ann, null, 2).slice(0, 1000));
                    }
                }

                // Skip if no rect
                if (!ann.rect) continue;

                let isDark = false;
                let reason = '';

                // Helper to check color array (handles TypedArrays like Uint8ClampedArray)
                const checkColor = (color: any) => {
                    // Check for array-like objects (includes TypedArrays)
                    if (color && typeof color.length === 'number') {
                        if (color.length === 3) return getLuminance(color[0], color[1], color[2]) < 0.05;
                        if (color.length === 1) return getLuminance(color[0], color[0], color[0]) < 0.05;
                        if (color.length === 4) {
                            // CMYK: simplistic conversion for check
                            const k = color[3];
                            return (1 - k) < 0.05;
                        }
                    }
                    return false;
                };

                // Check border color
                if (ann.color && checkColor(ann.color)) {
                    isDark = true;
                    reason = 'Border Color';
                }

                // Check interior color
                if (!isDark && (ann as any).interiorColor && checkColor((ann as any).interiorColor)) {
                    isDark = true;
                    reason = 'Interior Color';
                }

                // Special case: Redact annotations are always treated as redaction candidates
                // regardless of color (they're literally called "Redact")
                if (ann.subtype === 'Redact') {
                    isDark = true;
                    reason = 'Subtype is Redact';
                }

                // Special case: StrikeOut might be used for redaction
                if (ann.subtype === 'StrikeOut' && checkColor(ann.color)) {
                    isDark = true;
                    reason = 'StrikeOut with dark color';
                }

                // Accept annotation if it looks like a redaction
                if (isDark) {
                    const x = Math.min(ann.rect[0], ann.rect[2]);
                    const y = Math.min(ann.rect[1], ann.rect[3]);
                    const width = Math.abs(ann.rect[2] - ann.rect[0]);
                    const height = Math.abs(ann.rect[3] - ann.rect[1]);

                    blackRects.push({ x, y, width, height });
                    log(`Page ${i}: Accepted annotation (${reason}):`, { subtype: ann.subtype, x, y, width, height });
                } else if (DEBUG && (ann.subtype === 'Square' || ann.subtype === 'Highlight' || ann.subtype === 'Ink' || ann.subtype === 'Redact')) {
                    // Log rejection only for expected redaction-like types
                    log(`Page ${i}: REJECTED potential redaction annotation:`, {
                        subtype: ann.subtype,
                        color: ann.color,
                        interior: (ann as any).interiorColor,
                        colorType: ann.color ? ann.color.constructor.name : 'null'
                    });
                }
            }

            // B. Parse Operators to find "Redaction" candidates (Dark Fills)
            let currentFillColor = { r: 0, g: 0, b: 0 }; // Default black

            // CTM (Current Transformation Matrix) stack for tracking transforms
            // [a, b, c, d, e, f] -> transforms (x, y) to (ax + cy + e, bx + dy + f)
            let ctm = [1, 0, 0, 1, 0, 0]; // Identity matrix
            const ctmStack: number[][] = [];

            // Helper to apply CTM to a point
            const applyCtm = (x: number, y: number, matrix: number[]): [number, number] => {
                const [a, b, c, d, e, f] = matrix;
                return [a * x + c * y + e, b * x + d * y + f];
            };

            // Helper to multiply two matrices
            const multiplyCtm = (m1: number[], m2: number[]): number[] => {
                const [a1, b1, c1, d1, e1, f1] = m1;
                const [a2, b2, c2, d2, e2, f2] = m2;
                return [
                    a1 * a2 + c1 * b2,
                    b1 * a2 + d1 * b2,
                    a1 * c2 + c1 * d2,
                    b1 * c2 + d1 * d2,
                    a1 * e2 + c1 * f2 + e1,
                    b1 * e2 + d1 * f2 + f1
                ];
            };

            // Loop through ops
            if (DEBUG) {
                // Log all operator IDs to see what we're working with
                const opNames = ops.fnArray.map((fn: number) => {
                    // Find the key for this operator number
                    for (const [key, val] of Object.entries(pdfjsLib.OPS)) {
                        if (val === fn) return key;
                    }
                    return `Unknown(${fn})`;
                });
                log(`Page ${i}: Operators:`, opNames);
            }

            for (let j = 0; j < ops.fnArray.length; j++) {
                const fn = ops.fnArray[j];
                const args = ops.argsArray[j];

                // Handle CTM operations
                if (fn === pdfjsLib.OPS.save) {
                    ctmStack.push([...ctm]);
                } else if (fn === pdfjsLib.OPS.restore) {
                    ctm = ctmStack.pop() || [1, 0, 0, 1, 0, 0];
                } else if (fn === pdfjsLib.OPS.transform) {
                    // transform(a, b, c, d, e, f) - concatenate matrix
                    if (args && args.length >= 6) {
                        ctm = multiplyCtm(ctm, args);
                        if (DEBUG) log(`Page ${i}: transform applied, CTM now:`, ctm);
                    }
                }

                // setFillColor
                if (fn === pdfjsLib.OPS.setFillRGBColor || fn === pdfjsLib.OPS.setFillColor) {
                    const color = getRGBFromStyle(args);
                    if (color) {
                        currentFillColor = color;
                        if (DEBUG) log(`Page ${i}: setFillColor`, currentFillColor);
                    }
                } else if (fn === pdfjsLib.OPS.setFillGray) {
                    const gray = args[0] * 255;
                    currentFillColor = { r: gray, g: gray, b: gray };
                    if (DEBUG) log(`Page ${i}: setFillGray (Val: ${args[0]}) ->`, currentFillColor);
                } else if (fn === pdfjsLib.OPS.setFillCMYKColor) {
                    // Handle CMYK fill color
                    const c = args[0], m = args[1], y = args[2], k = args[3];
                    currentFillColor = {
                        r: 255 * (1 - c) * (1 - k),
                        g: 255 * (1 - m) * (1 - k),
                        b: 255 * (1 - y) * (1 - k)
                    };
                    if (DEBUG) log(`Page ${i}: setFillCMYKColor`, currentFillColor);
                }

                // Handle 're' (rectangle) + 'f'/'F' (fill)
                if (fn === pdfjsLib.OPS.rectangle) {
                    const x = args[0];
                    const y = args[1];
                    const w = args[2];
                    const h = args[3];

                    // Apply CTM to get actual page coordinates
                    const [tx, ty] = applyCtm(x, y, ctm);
                    const [tx2, ty2] = applyCtm(x + w, y + h, ctm);
                    const actualX = Math.min(tx, tx2);
                    const actualY = Math.min(ty, ty2);
                    const actualW = Math.abs(tx2 - tx);
                    const actualH = Math.abs(ty2 - ty);

                    // Check luminance
                    const lum = getLuminance(currentFillColor.r, currentFillColor.g, currentFillColor.b);
                    if (DEBUG) log(`Page ${i}: Rectangle found at [${x},${y},${w},${h}] -> transformed to [${actualX},${actualY},${actualW},${actualH}] with Fill Color: ${JSON.stringify(currentFillColor)} Luminance: ${lum}`);

                    if (lum < 0.05) { // < 5% luminance
                        blackRects.push({ x: actualX, y: actualY, width: actualW, height: actualH });
                        log(`Page ${i}: BLACK Rectangle accepted`, { x: actualX, y: actualY, w: actualW, h: actualH });
                    }
                }

                // Also check constructPath which is used for more complex paths
                if (fn === pdfjsLib.OPS.constructPath) {
                    if (DEBUG) log(`Page ${i}: constructPath raw args:`, JSON.stringify(args));

                    try {
                        const pathOps = args[0];
                        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
                        let hasPoints = false;

                        // Case 1: pathOps is a single integer (e.g. 22 = rectangle)
                        // Allow 22 explicitly as fallback for standard standard RE
                        if ((typeof pathOps === 'number' && pathOps === pdfjsLib.OPS.rectangle) || pathOps === 22) {

                            // Search args[1] and args[2] etc for coordinates
                            // The user logs show args[0]=22, args[1]=[...], args[2]={...}
                            // We iterate all args to find a rect-like structure
                            for (let k = 1; k < args.length; k++) {
                                let potentialRect = args[k];

                                // Handle PDF.js arguments which might be objects {0:x, 1:y...} instead of Arrays
                                if (potentialRect && typeof potentialRect === 'object') {
                                    // Try to normalize to array [x, y, w, h]
                                    // Check keys 0, 1, 2, 3
                                    if ('0' in potentialRect && '1' in potentialRect && '2' in potentialRect && '3' in potentialRect) {
                                        // It's likely a rect object
                                        const r = [
                                            Number(potentialRect['0']),
                                            Number(potentialRect['1']),
                                            Number(potentialRect['2']),
                                            Number(potentialRect['3'])
                                        ];
                                        potentialRect = r;
                                        if (DEBUG) log(`Page ${i}: Normalized rect object at args[${k}] to`, r);
                                    } else if (!Array.isArray(potentialRect)) {
                                        // Maybe it has numeric keys but not string keys?
                                        if (potentialRect[0] !== undefined && potentialRect[3] !== undefined) {
                                            const r = [
                                                Number(potentialRect[0]),
                                                Number(potentialRect[1]),
                                                Number(potentialRect[2]),
                                                Number(potentialRect[3])
                                            ];
                                            potentialRect = r;
                                        }
                                    }
                                }

                                // Now check if it's a valid rect array [x, y, w, h]
                                if (Array.isArray(potentialRect) && potentialRect.length >= 4) {
                                    const x = potentialRect[0];
                                    const y = potentialRect[1];
                                    const w = potentialRect[2];
                                    const h = potentialRect[3];

                                    if (!isNaN(x) && !isNaN(y) && !isNaN(w) && !isNaN(h)) {
                                        minX = x; minY = y; maxX = x + w; maxY = y + h;
                                        hasPoints = true;
                                        if (DEBUG) log(`Page ${i}: Found valid rect in constructPath args[${k}]`, { x, y, w, h });
                                        break; // Found the rect, stop searching args
                                    }
                                }
                            }
                        }
                        // Case 2: standard constructPath (ops array + coords array)
                        else if (Array.isArray(pathOps) && args[1]) {
                            const pathCoords = args[1];
                            if (pathCoords && pathCoords.length) {
                                for (let k = 0; k < pathCoords.length; k += 2) {
                                    const x = pathCoords[k];
                                    const y = pathCoords[k + 1];
                                    if (typeof x === 'number' && typeof y === 'number') {
                                        minX = Math.min(minX, x);
                                        minY = Math.min(minY, y);
                                        maxX = Math.max(maxX, x);
                                        maxY = Math.max(maxY, y);
                                        hasPoints = true;
                                    }
                                }
                            }
                        }

                        if (hasPoints) {
                            // Apply CTM to transform to page coordinates
                            const [tx1, ty1] = applyCtm(minX, minY, ctm);
                            const [tx2, ty2] = applyCtm(maxX, maxY, ctm);
                            const actualX = Math.min(tx1, tx2);
                            const actualY = Math.min(ty1, ty2);
                            const actualW = Math.abs(tx2 - tx1);
                            const actualH = Math.abs(ty2 - ty1);

                            // Check if it's black
                            const lum = getLuminance(currentFillColor.r, currentFillColor.g, currentFillColor.b);

                            if (DEBUG) log(`Page ${i}: Path Bounds: [${minX}, ${minY}] -> [${actualX}, ${actualY}, ${actualW}, ${actualH}], Lum: ${lum}, CTM: ${JSON.stringify(ctm)}`);

                            // Accept if dark enough
                            if (lum < 0.05 && actualW > 2 && actualH > 2) {
                                blackRects.push({ x: actualX, y: actualY, width: actualW, height: actualH });
                                log(`Page ${i}: BLACK Path accepted as Rect (transformed)`, { x: actualX, y: actualY, width: actualW, height: actualH });
                            }
                        }
                    } catch (e) {
                        console.error('Error parsing constructPath', e);
                    }
                }


                // Also check paintImageXObject (images can be used as redaction)
                if (fn === pdfjsLib.OPS.paintImageXObject || fn === pdfjsLib.OPS.paintImageXObjectRepeat) {
                    if (DEBUG) log(`Page ${i}: Image found`, args);
                }
            }

            // D. Raster fallback: If no black rects found via operators AND page is rasterized (has image, no text),
            // use pixel-level analysis to find black rectangles
            const isRasterized = textContent.items.length === 0 &&
                ops.fnArray.includes(pdfjsLib.OPS.paintImageXObject);

            if (blackRects.length === 0 && isRasterized) {
                log(`Page ${i}: Detected as rasterized image. Running pixel scan...`);
                const rasterRects = await detectBlackRectsInRaster(page);
                blackRects.push(...rasterRects);
            }

            totalRedactionCandidates += blackRects.length;
            log(`Page ${i}: Total black boxes identified: ${blackRects.length}`);

            // C. Check intersections with Text
            for (const item of textContent.items as any[]) {
                const tx = item.transform[4];
                const ty = item.transform[5];
                const w = item.width || 0;
                const h = Math.abs(item.transform[3]);

                const textBox: BoundingBox = { x: tx, y: ty, width: w, height: h };

                for (const rect of blackRects) {
                    const overlap = getIntersectionRatio(textBox, rect);
                    if (overlap > 0.01) { // Strict > 1%
                        log(`Page ${i}: Ghost Text Detected!`, { text: item.str, overlap });
                        leaks.push({
                            id: `ghost-${i}-${Math.random().toString(36).substr(2, 9)}`,
                            description: `Ghost Text detected: "${item.str}"`,
                            severity: 'CRITICAL',
                            pageNumber: i,
                            boundingBox: { x: tx, y: ty, width: w, height: h }
                        });
                        break; // Found a leak for this item, stop checking rects
                    }
                }
            }

            // E. PII Detection: Extract dates and names from page text
            // Include both main text layer AND annotation contents (text boxes, notes, etc.)
            let pageText = textContent.items.map((item: any) => item.str).join(' ');

            // Also extract text from annotations (text boxes, notes, free text, etc.)
            for (const ann of annotations) {
                // FreeText annotations (Preview text boxes) store text in contentsObj.str
                if ((ann as any).contentsObj?.str && typeof (ann as any).contentsObj.str === 'string') {
                    pageText += ' ' + (ann as any).contentsObj.str;
                    if (DEBUG) log(`Page ${i}: Found text in annotation contentsObj.str:`, (ann as any).contentsObj.str);
                }
                // Fallback: check for 'contents' field (string format)
                else if ((ann as any).contents && typeof (ann as any).contents === 'string') {
                    pageText += ' ' + (ann as any).contents;
                }
                // Also check for 'fieldValue' (used in form fields)
                if ((ann as any).fieldValue && typeof (ann as any).fieldValue === 'string') {
                    pageText += ' ' + (ann as any).fieldValue;
                }
            }

            const pageDates = extractDates(pageText, i);
            const pageNames = extractNames(pageText, i);
            allDatesFound.push(...pageDates);
            allNamesFound.push(...pageNames);
            if (pageDates.length > 0 || pageNames.length > 0) {
                log(`Page ${i}: PII found - ${pageDates.length} dates, ${pageNames.length} names`);
            }
        } catch (err) {
            console.error(`Error scanning page ${i}:`, err);
            // Don't crash the whole scan
        }
    }

    // Sort dates oldest to newest
    allDatesFound.sort((a, b) => a.parsed.getTime() - b.parsed.getTime());

    log('Scan complete.', {
        totalLeaks: leaks.length,
        datesFound: allDatesFound.length,
        namesFound: allNamesFound.length,
        score: Math.max(0, 100 - (leaks.length * 10))
    });

    return {
        leaks,
        score: Math.max(0, 100 - (leaks.length * 10)),
        timestamp: new Date().toISOString(),
        redactionCount: totalRedactionCandidates,
        datesFound: allDatesFound,
        namesFound: allNamesFound
    };
}
