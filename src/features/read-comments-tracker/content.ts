import type { Settings } from '../../shared/types/settings';
import { initPRDetails } from './pr-details';
import { initPRList } from './pr-list';

/**
 * Initialize the feature
 */
export async function initialize(_settings: Settings): Promise<void> {
    const path = window.location.pathname;

    // Check if we are on a PR details page
    // /owner/repo/pull/number
    if (path.includes('/pull/')) {
        await initPRDetails();
    }

    // Check if we are on a PR list page
    // /owner/repo/pulls
    // /pulls (global)
    // /dashboard/pulls (dashboard)
    if (path.includes('/pulls')) {
        await initPRList();
    }
}

/**
 * Cleanup (optional)
 */
export async function cleanup(): Promise<void> {
    // Remove event listeners if any were added
    // For now, we don't have persistent listeners that need cleanup
}
