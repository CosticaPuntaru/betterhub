import type { Settings } from '../../shared/types/settings';

let beforeUnloadHandler: ((e: BeforeUnloadEvent) => void) | null = null;

export function initialize(settings: Settings): void {
    const isEnabled = settings.features['prevent-close'];
    if (!isEnabled) {
        cleanup();
        return;
    }

    // Set up beforeunload listener
    if (!beforeUnloadHandler) {
        beforeUnloadHandler = (e: BeforeUnloadEvent) => {
            if (hasUnsavedContent()) {
                e.preventDefault();
                e.returnValue = ''; // Modern browsers require this
                return '';
            }
            return undefined;
        };

        window.addEventListener('beforeunload', beforeUnloadHandler);
    }
}

export function cleanup(): void {
    if (beforeUnloadHandler) {
        window.removeEventListener('beforeunload', beforeUnloadHandler);
        beforeUnloadHandler = null;
    }
}

function hasUnsavedContent(): boolean {
    // Find all textareas on the page
    const textareas = document.querySelectorAll<HTMLTextAreaElement>('textarea');

    for (const textarea of textareas) {
        // Skip hidden or disabled textareas
        if (textarea.offsetParent === null || textarea.disabled) {
            continue;
        }

        // Check if textarea has content
        const value = textarea.value.trim();
        if (value.length > 0) {
            // Additional check: skip if it's a search box or filter
            const isSearchOrFilter = textarea.placeholder?.toLowerCase().includes('search') ||
                textarea.placeholder?.toLowerCase().includes('filter') ||
                textarea.name?.toLowerCase().includes('search') ||
                textarea.name?.toLowerCase().includes('filter');

            if (!isSearchOrFilter) {
                return true;
            }
        }
    }

    return false;
}
