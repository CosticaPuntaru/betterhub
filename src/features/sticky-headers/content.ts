import type { Settings } from '../../shared/types/settings';

let navigationObserver: MutationObserver | null = null;
let lastUrl = window.location.href;
let styleElement: HTMLStyleElement | null = null;

export function initialize(settings: Settings): void {
    const isEnabled = settings.features['sticky-headers'];
    if (!isEnabled) {
        cleanup();
        return;
    }

    // Initial application
    applyStickyHeaders();

    // Watch for navigation changes (SPA)
    if (!navigationObserver) {
        navigationObserver = new MutationObserver(() => {
            if (window.location.href !== lastUrl) {
                lastUrl = window.location.href;
                applyStickyHeaders();
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

    if (styleElement && styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
        styleElement = null;
    }
}

function applyStickyHeaders(): void {
    // Only run on PR files tab
    if (!window.location.pathname.includes('/pull/') || !window.location.pathname.includes('/files')) {
        // Clean up if we're not on the right page
        if (styleElement && styleElement.parentNode) {
            styleElement.parentNode.removeChild(styleElement);
            styleElement = null;
        }
        return;
    }

    // Remove existing style element if present
    if (styleElement && styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
        styleElement = null;
    }

    // Calculate the top offset based on GitHub's header
    // GitHub's sticky header is typically around 60-65px
    const githubHeader = document.querySelector('header.Header') || document.querySelector('.js-header-wrapper');
    const headerHeight = githubHeader ? githubHeader.getBoundingClientRect().height : 60;

    // Create and inject CSS for sticky headers
    styleElement = document.createElement('style');
    styleElement.id = 'betterhub-sticky-headers';
    styleElement.textContent = `
        /* Sticky file headers for BetterHub */
        .file-header,
        .file-info {
            position: sticky !important;
            top: ${headerHeight}px !important;
            z-index: 20 !important;
            background-color: var(--color-canvas-default, #ffffff) !important;
            border-bottom: 1px solid var(--color-border-default, #d0d7de) !important;
        }

        /* Dark mode support */
        [data-color-mode="dark"] .file-header,
        [data-color-mode="dark"] .file-info {
            background-color: var(--color-canvas-default, #0d1117) !important;
        }

        /* Ensure proper layering */
        .file-header {
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
    `;

    document.head.appendChild(styleElement);
}
