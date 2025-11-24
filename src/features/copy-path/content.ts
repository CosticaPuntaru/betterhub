import type { Settings } from '../../shared/types/settings';

let navigationObserver: MutationObserver | null = null;
let lastUrl = window.location.href;
let processedHeaders = new WeakSet<Element>();

export function initialize(settings: Settings): void {
    const isEnabled = settings.features['copy-path'];
    if (!isEnabled) {
        cleanup();
        return;
    }

    // Initial application
    addCopyButtons();

    // Watch for navigation changes and dynamic content (SPA)
    if (!navigationObserver) {
        navigationObserver = new MutationObserver(() => {
            if (window.location.href !== lastUrl) {
                lastUrl = window.location.href;
                processedHeaders = new WeakSet();
            }
            addCopyButtons();
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
    processedHeaders = new WeakSet();

    // Remove all existing copy buttons
    document.querySelectorAll('.betterhub-copy-path-btn').forEach(el => el.remove());
}

function extractFilePath(): string | null {
    // Try to get file path from the breadcrumb or file header
    const breadcrumb = document.querySelector('.final-path');
    if (breadcrumb) {
        return breadcrumb.textContent?.trim() || null;
    }

    // Try to get from the file header in PR diffs
    const fileHeader = document.querySelector('.file-header[data-path]');
    if (fileHeader) {
        return fileHeader.getAttribute('data-path');
    }

    // Try to get from the page title
    const titleMatch = document.title.match(/([^/]+\/[^/]+\/blob\/[^/]+\/)(.+)/);
    if (titleMatch) {
        return titleMatch[2];
    }

    return null;
}

function createCopyButton(filePath: string): HTMLButtonElement {
    const button = document.createElement('button');
    button.className = 'betterhub-copy-path-btn btn-octicon';
    button.type = 'button';
    button.title = 'Copy file path';
    button.setAttribute('aria-label', 'Copy file path');

    // Create SVG icon (clipboard icon)
    button.innerHTML = `
        <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" class="octicon">
            <path fill="currentColor" d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path>
            <path fill="currentColor" d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>
        </svg>
    `;

    button.style.cssText = `
        margin-left: 8px;
        padding: 4px 8px;
        border: none;
        background: transparent;
        cursor: pointer;
        color: var(--fgColor-muted, #656d76);
        display: inline-flex;
        align-items: center;
        vertical-align: middle;
    `;

    button.addEventListener('mouseenter', () => {
        button.style.color = 'var(--fgColor-default, #1f2328)';
    });

    button.addEventListener('mouseleave', () => {
        button.style.color = 'var(--fgColor-muted, #656d76)';
    });

    button.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            await navigator.clipboard.writeText(filePath);

            // Show feedback
            const originalTitle = button.title;
            const originalHTML = button.innerHTML;

            button.title = 'Copied!';
            button.innerHTML = `
                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" class="octicon">
                    <path fill="currentColor" d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
                </svg>
            `;
            button.style.color = 'var(--fgColor-success, #1a7f37)';

            setTimeout(() => {
                button.title = originalTitle;
                button.innerHTML = originalHTML;
                button.style.color = 'var(--fgColor-muted, #656d76)';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy file path:', err);
        }
    });

    return button;
}

function addCopyButtons(): void {
    // Check if we're on a file page or PR page
    const isFilePage = window.location.pathname.includes('/blob/');
    const isPRPage = window.location.pathname.includes('/pull/');

    if (!isFilePage && !isPRPage) {
        return;
    }

    if (isFilePage) {
        // Add button to single file view
        const fileHeader = document.querySelector('.file-header, .Box-header');
        if (fileHeader && !processedHeaders.has(fileHeader)) {
            processedHeaders.add(fileHeader);

            const filePath = extractFilePath();
            if (filePath) {
                const button = createCopyButton(filePath);

                // Find the actions container or create one
                const actionsContainer = fileHeader.querySelector('.file-actions, .Box-header .d-flex');
                if (actionsContainer) {
                    actionsContainer.appendChild(button);
                } else {
                    fileHeader.appendChild(button);
                }
            }
        }
    }

    if (isPRPage) {
        // Add buttons to each file in PR diff
        const fileHeaders = document.querySelectorAll('.file-header');
        fileHeaders.forEach((header) => {
            if (processedHeaders.has(header)) {
                return;
            }

            processedHeaders.add(header);

            // Get file path from data attribute or file-info
            const filePath = header.getAttribute('data-path') ||
                header.querySelector('.file-info')?.textContent?.trim();

            if (filePath) {
                const button = createCopyButton(filePath);

                // Find the file actions container
                const actionsContainer = header.querySelector('.file-actions');
                if (actionsContainer) {
                    actionsContainer.insertBefore(button, actionsContainer.firstChild);
                } else {
                    header.appendChild(button);
                }
            }
        });
    }
}
