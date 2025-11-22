import browser from 'webextension-polyfill';
import type { Settings } from '../../shared/types/settings';

/**
 * Parse PR info from a list item
 */
function getPRInfoFromItem(element: Element): { owner: string; repo: string; number: number; commentCount: number } | null {
    // This depends on the structure of the PR list item
    // Usually id is like "issue_12345" but that's the database ID, not PR number.
    // We need to find the link to the PR.

    const link = element.querySelector('a[href*="/pull/"]');
    if (!link) return null;

    const href = link.getAttribute('href');
    if (!href) return null;

    const parts = href.split('/');
    // href might be relative (/owner/repo/pull/123) or absolute
    // If relative and starts with /, parts[1] is owner

    let owner, repo, number;

    if (href.startsWith('/')) {
        owner = parts[1];
        repo = parts[2];
        number = parseInt(parts[4], 10);
    } else {
        // Handle full URL if necessary, but usually it's relative in the list
        return null;
    }

    // Find comment count
    // It's usually in a span with specific class or icon
    const commentIcon = element.querySelector('svg.octicon-comment');
    let commentCount = 0;

    if (commentIcon) {
        // The count is usually next to the icon in a span or just text
        const parent = commentIcon.parentElement;
        if (parent) {
            const text = parent.textContent?.trim() || '0';
            // Sometimes text includes the icon text, so we need to be careful.
            // Usually it's just the number.
            const match = text.match(/\d+/);
            if (match) {
                commentCount = parseInt(match[0], 10);
            }
        }
    }

    return { owner, repo, number, commentCount };
}

/**
 * Update PR list item styles
 */
async function updatePRItem(element: Element, storedCounts: Record<string, number>, settings: Settings): Promise<void> {
    const info = getPRInfoFromItem(element);
    if (!info) return;

    const key = `pr-comments-${info.owner}-${info.repo}-${info.number}`;
    const storedCount = storedCounts[key];

    // Find the comment icon to color
    const commentIcon = element.querySelector('svg.octicon-comment');
    if (!commentIcon) return;

    if (storedCount === undefined) {
        // No stored count, do nothing
        return;
    }

    const readColor = settings.readCommentsTracker?.readColor || '#2da44e';
    const unreadColor = settings.readCommentsTracker?.unreadColor || '#bc8c00';

    if (settings.debug) {
        console.log(`[BetterHub] Processing PR #${info.number}: stored=${storedCount}, current=${info.commentCount}`);
    }

    if (info.commentCount === storedCount) {
        // Counts match - read
        commentIcon.setAttribute('style', `fill: ${readColor} !important; color: ${readColor} !important;`);
        // Also color the text
        if (commentIcon.parentElement) {
            commentIcon.parentElement.style.color = readColor;
        }
        // Color the sibling span (the number)
        const countSpan = commentIcon.nextElementSibling;
        if (countSpan) {
            countSpan.setAttribute('style', `color: ${readColor} !important;`);
        }
    } else {
        // Counts differ - unread
        commentIcon.setAttribute('style', `fill: ${unreadColor} !important; color: ${unreadColor} !important;`);
        if (commentIcon.parentElement) {
            commentIcon.parentElement.style.color = unreadColor;
        }
        // Color the sibling span (the number)
        const countSpan = commentIcon.nextElementSibling;
        if (countSpan) {
            countSpan.setAttribute('style', `color: ${unreadColor} !important;`);
        }
    }
}

/**
 * Initialize PR list tracking
 */
export async function initPRList(): Promise<void> {
    // Get all PR list items
    // Selector for PR list items: .js-issue-row
    const items = document.querySelectorAll('.js-issue-row');
    if (items.length === 0) return;

    // Fetch all relevant keys from storage to minimize calls
    // We can't easily filter by key pattern in standard chrome.storage API without getting everything
    // or getting specific keys. Since we don't know the keys beforehand without parsing,
    // we'll parse first then fetch.

    const prInfos: { key: string; element: Element }[] = [];
    const keysToFetch: string[] = [];

    items.forEach(item => {
        const info = getPRInfoFromItem(item);
        if (info) {
            const key = `pr-comments-${info.owner}-${info.repo}-${info.number}`;
            prInfos.push({ key, element: item });
            keysToFetch.push(key);
        }
    });

    if (keysToFetch.length === 0) return;

    const storedData = await browser.storage.local.get(keysToFetch);
    const { settings } = await browser.storage.sync.get('settings') as { settings: Settings };

    // Log stored items for the current project if debug is enabled
    if (settings?.debug) {
        const currentProjectItems = Object.entries(storedData).filter(([key]) => keysToFetch.includes(key));
        console.log('[BetterHub] Stored items for current project:', currentProjectItems);
    }

    for (const { element } of prInfos) {
        // We pass the whole storedData but typed as Record<string, number>
        await updatePRItem(element, storedData as Record<string, number>, settings);
    }
}
