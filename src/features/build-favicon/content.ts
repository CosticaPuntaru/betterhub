import type { Settings } from '../../shared/types/settings';

let statusObserver: MutationObserver | null = null;
let lastUrl = window.location.href;
let originalFavicon: string | null = null;

type BuildStatus = 'success' | 'failure' | 'pending' | 'none';

export function initialize(settings: Settings): void {
    const isEnabled = settings.features['build-favicon'];
    if (!isEnabled) {
        cleanup();
        return;
    }

    // Store original favicon
    if (!originalFavicon) {
        const link = document.querySelector<HTMLLinkElement>('link[rel*="icon"]');
        if (link) {
            originalFavicon = link.href;
        }
    }

    // Initial update
    updateFavicon();

    // Watch for status changes
    if (!statusObserver) {
        statusObserver = new MutationObserver(() => {
            if (window.location.href !== lastUrl) {
                lastUrl = window.location.href;
            }
            updateFavicon();
        });

        statusObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'data-test-id'],
        });
    }
}

export function cleanup(): void {
    if (statusObserver) {
        statusObserver.disconnect();
        statusObserver = null;
    }

    // Restore original favicon
    if (originalFavicon) {
        setFavicon(originalFavicon);
    }
}

function getBuildStatus(): BuildStatus {
    // Only run on PR pages
    if (!window.location.pathname.includes('/pull/')) {
        return 'none';
    }

    // Look for CI status indicators
    const statusElement = document.querySelector('.merge-status-item, .branch-action-item, [data-test-selector="pr-checks-status"]');

    if (!statusElement) {
        return 'none';
    }

    const text = statusElement.textContent?.toLowerCase() || '';
    const classes = statusElement.className.toLowerCase();

    if (text.includes('success') || text.includes('passed') || text.includes('all checks') || classes.includes('success')) {
        return 'success';
    }

    if (text.includes('fail') || text.includes('error') || classes.includes('fail') || classes.includes('error')) {
        return 'failure';
    }

    if (text.includes('pending') || text.includes('progress') || text.includes('running') || classes.includes('pending')) {
        return 'pending';
    }

    return 'none';
}

function updateFavicon(): void {
    const status = getBuildStatus();

    if (status === 'none') {
        if (originalFavicon) {
            setFavicon(originalFavicon);
        }
        return;
    }

    // Create favicon based on status
    const favicon = createStatusFavicon(status);
    setFavicon(favicon);
}

function createStatusFavicon(status: BuildStatus): string {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        return originalFavicon || '';
    }

    // Draw background circle
    ctx.fillStyle = status === 'success' ? '#2da44e' : status === 'failure' ? '#cf222e' : '#bf8700';
    ctx.beginPath();
    ctx.arc(16, 16, 14, 0, 2 * Math.PI);
    ctx.fill();

    // Draw icon
    ctx.strokeStyle = '#ffffff';
    ctx.fillStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    if (status === 'success') {
        // Draw checkmark
        ctx.beginPath();
        ctx.moveTo(10, 16);
        ctx.lineTo(14, 20);
        ctx.lineTo(22, 12);
        ctx.stroke();
    } else if (status === 'failure') {
        // Draw X
        ctx.beginPath();
        ctx.moveTo(11, 11);
        ctx.lineTo(21, 21);
        ctx.moveTo(21, 11);
        ctx.lineTo(11, 21);
        ctx.stroke();
    } else {
        // Draw dot for pending
        ctx.beginPath();
        ctx.arc(16, 16, 4, 0, 2 * Math.PI);
        ctx.fill();
    }

    return canvas.toDataURL();
}

function setFavicon(href: string): void {
    let link = document.querySelector<HTMLLinkElement>('link[rel*="icon"]');

    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }

    link.href = href;
}
