
/**
 * Extract PR info from URL
 */
function getPRInfo(): { owner: string; repo: string; number: number } | null {
    const pathParts = window.location.pathname.split('/');
    // Expected format: /owner/repo/pull/number
    if (pathParts.length >= 5 && pathParts[3] === 'pull') {
        return {
            owner: pathParts[1],
            repo: pathParts[2],
            number: parseInt(pathParts[4], 10),
        };
    }
    return null;
}

/**
 * Get comment count from DOM
 */
function getCommentCount(): number | null {
    // Try to find the conversation tab counter
    // User provided ID: conversation_tab_counter
    const counter = document.getElementById('conversation_tab_counter');
    if (counter) {
        const countText = counter.getAttribute('title') || counter.textContent || '0';
        // Remove commas if present (e.g. "1,234")
        return parseInt(countText.replace(/,/g, ''), 10);
    }

    // Fallback: try to find the span inside the tab
    const tab = document.querySelector('a[href$="/conversation"]');
    if (tab) {
        const countSpan = tab.querySelector('.Counter');
        if (countSpan) {
            const countText = countSpan.getAttribute('title') || countSpan.textContent || '0';
            return parseInt(countText.replace(/,/g, ''), 10);
        }
    }

    return null;
}

/**
 * Initialize PR details tracking
 */
export async function initPRDetails(): Promise<void> {
    const browser = (await import('webextension-polyfill')).default;
    const { settings } = await browser.storage.sync.get('settings') as { settings: any };
    const debug = settings?.debug;

    const prInfo = getPRInfo();
    if (!prInfo) {
        if (debug) console.log('[BetterHub] Failed to parse PR info from URL');
        return;
    }

    const count = getCommentCount();
    if (count !== null) {
        const key = `pr-comments-${prInfo.owner}-${prInfo.repo}-${prInfo.number}`;
        // Use local storage for this as it can be voluminous and doesn't need to sync across devices necessarily,
        // but the requirement didn't specify. Using the shared storage utility which maps to sync by default
        // might be risky for quota. Let's use browser.storage.local directly if possible or add local support to storage util.
        // For now, I'll use the storage utility but we might want to switch to local storage later if quota is an issue.
        // Actually, the requirement says "store in local storage".
        // The shared storage utility wraps browser.storage.sync.
        // I should probably use browser.storage.local directly here for capacity reasons.

        // Dynamic import to avoid circular deps if any, though unlikely here.
        await browser.storage.local.set({ [key]: count });

        if (debug) {
            console.log(`[BetterHub] Stored comment count for ${prInfo.owner}/${prInfo.repo} PR #${prInfo.number}: ${count}`);
        }
    } else {
        if (debug) console.log('[BetterHub] Failed to find comment count on page');
    }
}
