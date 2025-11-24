import type { Settings } from '../../shared/types/settings';

let navigationObserver: MutationObserver | null = null;
let lastUrl = window.location.href;
let processedReactions = new WeakSet<Element>();

export function initialize(settings: Settings): void {
    const isEnabled = settings.features['reaction-avatars'];
    if (!isEnabled) {
        cleanup();
        return;
    }

    // Initial application
    addReactionAvatars();

    // Watch for navigation changes and dynamic content
    if (!navigationObserver) {
        navigationObserver = new MutationObserver(() => {
            if (window.location.href !== lastUrl) {
                lastUrl = window.location.href;
                processedReactions = new WeakSet();
            }
            addReactionAvatars();
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
    processedReactions = new WeakSet();

    // Remove all avatar containers
    document.querySelectorAll('.betterhub-reaction-avatars').forEach(el => el.remove());
}

function addReactionAvatars(): void {
    // Find all reaction buttons
    const reactionButtons = document.querySelectorAll('.social-reaction-summary-item, button[value*="react"]');

    reactionButtons.forEach((button) => {
        if (processedReactions.has(button)) {
            return;
        }

        processedReactions.add(button);

        // Try to extract user information from aria-label or title
        const ariaLabel = button.getAttribute('aria-label') || button.getAttribute('title') || '';

        // Parse usernames from the label (e.g., "user1, user2, and 3 others reacted with thumbs up emoji")
        const usernameMatches = ariaLabel.match(/([a-zA-Z0-9-_]+)(?:,|and)/g);

        if (usernameMatches && usernameMatches.length > 0) {
            const usernames = usernameMatches.map(m => m.replace(/,|and/g, '').trim()).filter(Boolean);

            // Create avatar container
            const avatarContainer = document.createElement('span');
            avatarContainer.className = 'betterhub-reaction-avatars';
            avatarContainer.style.cssText = `
                display: inline-flex;
                margin-left: 4px;
                gap: 2px;
            `;

            // Add avatars for first few users
            usernames.slice(0, 3).forEach((username) => {
                const avatar = document.createElement('img');
                avatar.src = `https://github.com/${username}.png?size=20`;
                avatar.alt = username;
                avatar.title = username;
                avatar.className = 'betterhub-reaction-avatar';
                avatar.style.cssText = `
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    border: 1px solid var(--borderColor-default, #d0d7de);
                `;
                avatarContainer.appendChild(avatar);
            });

            // Append to button
            button.appendChild(avatarContainer);
        }
    });
}
