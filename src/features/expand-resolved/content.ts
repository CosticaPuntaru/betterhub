import type { Settings } from '../../shared/types/settings';

let navigationObserver: MutationObserver | null = null;
let lastUrl = window.location.href;
let expandButton: HTMLButtonElement | null = null;

export function initialize(settings: Settings): void {
    const isEnabled = settings.features['expand-resolved'];
    if (!isEnabled) {
        cleanup();
        return;
    }

    // Initial application
    addExpandButton();

    // Watch for navigation changes
    if (!navigationObserver) {
        navigationObserver = new MutationObserver(() => {
            if (window.location.href !== lastUrl) {
                lastUrl = window.location.href;
                addExpandButton();
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

    if (expandButton && expandButton.parentNode) {
        expandButton.parentNode.removeChild(expandButton);
        expandButton = null;
    }
}

function addExpandButton(): void {
    // Only run on PR conversation pages
    if (!window.location.pathname.includes('/pull/') || window.location.pathname.includes('/files')) {
        if (expandButton && expandButton.parentNode) {
            expandButton.parentNode.removeChild(expandButton);
            expandButton = null;
        }
        return;
    }

    // Check if button already exists
    if (expandButton && document.body.contains(expandButton)) {
        return;
    }

    // Find the discussion timeline header
    const timelineHeader = document.querySelector('.discussion-timeline-actions, .timeline-comment-actions');
    if (!timelineHeader) {
        return;
    }

    // Create the expand button
    expandButton = document.createElement('button');
    expandButton.className = 'btn btn-sm betterhub-expand-resolved';
    expandButton.textContent = 'Expand All Resolved';
    expandButton.type = 'button';
    expandButton.style.cssText = `
        margin-left: 8px;
    `;

    expandButton.addEventListener('click', () => {
        expandAllResolved();
    });

    // Insert button
    if (timelineHeader.firstChild) {
        timelineHeader.insertBefore(expandButton, timelineHeader.firstChild);
    } else {
        timelineHeader.appendChild(expandButton);
    }
}

function expandAllResolved(): void {
    // Find all "Show resolved" buttons
    const resolvedButtons = document.querySelectorAll<HTMLButtonElement>('button[aria-label*="resolved"], details.js-resolvable-timeline-thread-container:not([open]) summary');

    let expandedCount = 0;
    resolvedButtons.forEach((button) => {
        // Check if it's actually a collapsed resolved thread
        const details = button.closest('details');
        if (details && !details.hasAttribute('open')) {
            button.click();
            expandedCount++;
        } else if (button.textContent?.includes('resolved') || button.getAttribute('aria-label')?.includes('resolved')) {
            button.click();
            expandedCount++;
        }
    });

    // Update button text with feedback
    if (expandButton) {
        const originalText = expandButton.textContent;
        expandButton.textContent = `Expanded ${expandedCount} thread${expandedCount !== 1 ? 's' : ''}`;
        expandButton.disabled = true;

        setTimeout(() => {
            if (expandButton) {
                expandButton.textContent = originalText;
                expandButton.disabled = false;
            }
        }, 2000);
    }
}
