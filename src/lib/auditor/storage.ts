import { set, get, del } from 'idb-keyval';
import type { ScanResult } from './types';

const STORE_KEY_AUDIT_FILE = 'audit_file';
const STORE_KEY_AUDIT_RESULT = 'audit_result';

/**
 * Save audit state to IndexedDB before Stripe redirect
 */
export async function saveAuditState(file: File, result: ScanResult) {
    console.log('[AuditStorage] Saving audit state...', { fileName: file.name, leakCount: result.leaks.length });
    try {
        const arrayBuffer = await file.arrayBuffer();
        await set(STORE_KEY_AUDIT_FILE, {
            data: arrayBuffer,
            name: file.name,
            type: file.type
        });
        await set(STORE_KEY_AUDIT_RESULT, result);
        console.log('[AuditStorage] Audit state saved successfully');
    } catch (err) {
        console.error('[AuditStorage] Failed to save audit state:', err);
    }
}

/**
 * Load audit state from IndexedDB after payment return
 */
export async function loadAuditState(): Promise<{ file: File | undefined; result: ScanResult | undefined }> {
    console.log('[AuditStorage] Loading audit state...');
    try {
        const savedData = await get<{ data: ArrayBuffer; name: string; type: string }>(STORE_KEY_AUDIT_FILE);
        const result = await get<ScanResult>(STORE_KEY_AUDIT_RESULT);

        if (savedData) {
            const file = new File([savedData.data], savedData.name, { type: savedData.type });
            console.log('[AuditStorage] Audit state loaded:', { fileName: file.name, leakCount: result?.leaks?.length });
            return { file, result };
        }

        return { file: undefined, result: undefined };
    } catch (err) {
        console.error('[AuditStorage] Failed to load audit state:', err);
        return { file: undefined, result: undefined };
    }
}

/**
 * Clear audit state from IndexedDB after restoration
 */
export async function clearAuditState() {
    console.log('[AuditStorage] Clearing audit state...');
    try {
        await del(STORE_KEY_AUDIT_FILE);
        await del(STORE_KEY_AUDIT_RESULT);
    } catch (err) {
        console.error('[AuditStorage] Failed to clear audit state:', err);
    }
}
