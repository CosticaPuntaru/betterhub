import type { Settings } from '../../shared/types/settings';

let navigationObserver: MutationObserver | null = null;
let scrollListener: (() => void) | null = null;
let lastUrl = window.location.href;
let floatingButton: HTMLDivElement | null = null;

export function initialize(settings: Settings): void {
    const isEnabled = settings.features['viewed-checkbox'];
    if (!isEnabled) {
        cleanup();
        return;
    }

    // Initial application
    setupFloatingButton();

    // Watch for navigation changes and dynamic content (SPA)
    if (!navigationObserver) {
        navigationObserver = new MutationObserver(() => {
            if (window.location.href !== lastUrl) {
                lastUrl = window.location.href;
                setupFloatingButton();
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

    if (scrollListener) {
        window.removeEventListener('scroll', scrollListener);
        scrollListener = null;
    }

    if (floatingButton && floatingButton.parentNode) {
        floatingButton.parentNode.removeChild(floatingButton);
        floatingButton = null;
    }
}

function setupFloatingButton(): void {
    // Only run on PR files tab
    if (!window.location.pathname.includes('/pull/') || !window.location.pathname.includes('/files')) {
        if (floatingButton && floatingButton.parentNode) {
            floatingButton.parentNode.removeChild(floatingButton);
            floatingButton = null;
        }
        return;
    }

    // Create floating button if it doesn't exist
    if (!floatingButton) {
        floatingButton = createFloatingButton();
        document.body.appendChild(floatingButton);
    }

    // Set up scroll listener to update button visibility and state
    if (!scrollListener) {
        scrollListener = () => updateFloatingButton();
        window.addEventListener('scroll', scrollListener, { passive: true });
    }

    // Initial update
    updateFloatingButton();
}

function createFloatingButton(): HTMLDivElement {
    const container = document.createElement('div');
    container.className = 'betterhub-viewed-checkbox-fab';
    container.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 100;
        display: none;
        background: var(--bgColor-default, #ffffff);
        border: 1px solid var(--borderColor-default, #d0d7de);
        border-radius: 6px;
        padding: 8px 12px;
        box-shadow: 0 8px 24px rgba(140, 149, 159, 0.2);
        cursor: pointer;
        user-select: none;
        transition: all 0.2s ease;
    `;

    container.innerHTML = `
        <label style="display: flex; align-items: center; gap: 8px; margin: 0; cursor: pointer; font-size: 14px; color: var(--fgColor-default, #1f2328);">
            <input type="checkbox" class="betterhub-viewed-checkbox" style="margin: 0; cursor: pointer;">
            <span>Viewed</span>
        </label>
    `;

    const checkbox = container.querySelector('input') as HTMLInputElement;
    checkbox.addEventListener('change', () => {
        const currentFile = getCurrentVisibleFile();
        if (currentFile) {
            const originalCheckbox = currentFile.querySelector('input[name="viewed"]') as HTMLInputElement;
            if (originalCheckbox && originalCheckbox.checked !== checkbox.checked) {
                originalCheckbox.click();
            }
        }
    });

    container.addEventListener('mouseenter', () => {
        container.style.transform = 'scale(1.05)';
        container.style.boxShadow = '0 12px 32px rgba(140, 149, 159, 0.3)';
    });

    container.addEventListener('mouseleave', () => {
        container.style.transform = 'scale(1)';
        container.style.boxShadow = '0 8px 24px rgba(140, 149, 159, 0.2)';
    });

    return container;
}

function getCurrentVisibleFile(): Element | null {
    const files = document.querySelectorAll('.file');
    let mostVisibleFile: Element | null = null;
    let maxVisibleHeight = 0;

    files.forEach((file) => {
        const rect = file.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Calculate how much of the file is visible
        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(viewportHeight, rect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);

        if (visibleHeight > maxVisibleHeight) {
            maxVisibleHeight = visibleHeight;
            mostVisibleFile = file;
        }
    });

    return mostVisibleFile;
}

function updateFloatingButton(): void {
    if (!floatingButton) {
        return;
    }

    const currentFile = getCurrentVisibleFile();

    if (!currentFile) {
        floatingButton.style.display = 'none';
        return;
    }

    // Check if the file header is visible
    const fileHeader = currentFile.querySelector('.file-header');
    if (!fileHeader) {
        floatingButton.style.display = 'none';
        return;
    }

    const headerRect = fileHeader.getBoundingClientRect();
    const isHeaderVisible = headerRect.top >= 0 && headerRect.top < window.innerHeight;

    // Only show floating button if header is not visible
    if (isHeaderVisible) {
        floatingButton.style.display = 'none';
        return;
    }

    // Show button and sync state
    floatingButton.style.display = 'block';

    const originalCheckbox = currentFile.querySelector('input[name="viewed"]') as HTMLInputElement;
    const floatingCheckbox = floatingButton.querySelector('input') as HTMLInputElement;

    if (originalCheckbox && floatingCheckbox) {
        floatingCheckbox.checked = originalCheckbox.checked;
    }
}
