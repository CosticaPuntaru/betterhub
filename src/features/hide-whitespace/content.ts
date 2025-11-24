import type { Settings } from '../../shared/types/settings';

let navigationObserver: MutationObserver | null = null;
let lastUrl = window.location.href;

export function initialize(settings: Settings): void {
    const isEnabled = settings.features['hide-whitespace'];
    if (!isEnabled) {
        cleanup();
        return;
    }

    // Initial check
    handleHideWhitespace();

    // Watch for navigation changes (SPA)
    if (!navigationObserver) {
        navigationObserver = new MutationObserver(() => {
            if (window.location.href !== lastUrl) {
                lastUrl = window.location.href;
                handleHideWhitespace();
            }
        });

        navigationObserver.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }
}

export function cleanup(): void {
    if (navigationObserver) {
        navigationObserver.disconnect();
        navigationObserver = null;
    }
}

function handleHideWhitespace(): void {
    // Only run on PR files tab
    if (!window.location.pathname.includes('/pull/') || !window.location.pathname.includes('/files')) {
        return;
    }

    const url = new URL(window.location.href);

    // If w=1 is already present, do nothing
    if (url.searchParams.has('w')) {
        return;
    }

    // Try to find the "Hide whitespace" checkbox first to avoid reload
    const hideWhitespaceCheckbox = document.querySelector('input[name="w"]') as HTMLInputElement;

    if (hideWhitespaceCheckbox) {
        if (!hideWhitespaceCheckbox.checked) {
            // Click it to toggle without full reload if possible
            hideWhitespaceCheckbox.click();
        }
    } else {
        // If checkbox not found (maybe not loaded yet, or different view), append param and reload
        // We should be careful not to reload if the page is still loading the checkbox
        // But for now, let's just append the param as a fallback
        url.searchParams.set('w', '1');
        window.location.replace(url.toString());
    }
}
