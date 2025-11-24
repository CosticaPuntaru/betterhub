import type { Settings } from '../../shared/types/settings';

let navigationObserver: MutationObserver | null = null;
let lastUrl = window.location.href;
let processedImages = new WeakSet<HTMLImageElement>();

export function initialize(settings: Settings): void {
    const isEnabled = settings.features['image-size'];
    if (!isEnabled) {
        cleanup();
        return;
    }

    // Initial application
    applyImageSizeOverlays();

    // Watch for navigation changes and dynamic content (SPA)
    if (!navigationObserver) {
        navigationObserver = new MutationObserver(() => {
            if (window.location.href !== lastUrl) {
                lastUrl = window.location.href;
                processedImages = new WeakSet();
            }
            applyImageSizeOverlays();
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
    processedImages = new WeakSet();

    // Remove all existing overlays
    document.querySelectorAll('.betterhub-image-size-overlay').forEach(el => el.remove());
}

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function createOverlay(width: number, height: number, fileSize?: number): HTMLDivElement {
    const overlay = document.createElement('div');
    overlay.className = 'betterhub-image-size-overlay';

    let text = `${width} × ${height}`;
    if (fileSize) {
        text += ` | ${formatFileSize(fileSize)}`;
    }

    overlay.textContent = text;
    overlay.style.cssText = `
        position: absolute;
        top: 8px;
        right: 8px;
        background: rgba(0, 0, 0, 0.75);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
        font-weight: 500;
        z-index: 10;
        pointer-events: none;
        white-space: nowrap;
    `;

    return overlay;
}

function applyImageSizeOverlays(): void {
    // Check if we're on a page that might have images
    const isFilePage = window.location.pathname.includes('/blob/');
    const isPRPage = window.location.pathname.includes('/pull/');

    if (!isFilePage && !isPRPage) {
        return;
    }

    // Find all image elements in file views and PR diffs
    const images = document.querySelectorAll<HTMLImageElement>('img.blob-image, img[data-canonical-src], .image-diff img, .file-diff img');

    images.forEach((img) => {
        if (processedImages.has(img)) {
            return;
        }

        // Wait for image to load to get dimensions
        if (!img.complete) {
            img.addEventListener('load', () => processImage(img), { once: true });
        } else {
            processImage(img);
        }
    });
}

function processImage(img: HTMLImageElement): void {
    if (processedImages.has(img)) {
        return;
    }

    processedImages.add(img);

    const width = img.naturalWidth;
    const height = img.naturalHeight;

    if (width === 0 || height === 0) {
        return; // Image not loaded yet
    }

    // Try to find file size from GitHub's UI
    let fileSize: number | undefined;

    // Look for file size in the file header
    const fileHeader = img.closest('.file')?.querySelector('.file-info');
    if (fileHeader) {
        const sizeText = fileHeader.textContent;
        const sizeMatch = sizeText?.match(/([\d.]+)\s*(KB|MB|B)/i);
        if (sizeMatch) {
            const value = parseFloat(sizeMatch[1]);
            const unit = sizeMatch[2].toUpperCase();
            if (unit === 'B') fileSize = value;
            else if (unit === 'KB') fileSize = value * 1024;
            else if (unit === 'MB') fileSize = value * 1024 * 1024;
        }
    }

    // Create overlay
    const overlay = createOverlay(width, height, fileSize);

    // Find the parent container to position the overlay
    const container = img.closest('.blob-wrapper, .image-diff-container, .file-diff') || img.parentElement;

    if (container) {
        // Ensure container has relative positioning
        const containerEl = container as HTMLElement;
        if (getComputedStyle(containerEl).position === 'static') {
            containerEl.style.position = 'relative';
        }

        containerEl.appendChild(overlay);
    }
}
