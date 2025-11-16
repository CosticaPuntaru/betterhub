/**
 * PR List Customization Content Script
 * Hides/shows elements on GitHub PR listing pages based on settings
 */

import { settingsManager } from '../../shared/utils/settings-manager';
import type { Settings } from '../../shared/types/settings';
import './styles.css';

let observer: MutationObserver | null = null;
let currentSettings: Settings | null = null;

/**
 * Apply hiding rules based on settings
 */
function applyHidingRules(settings: Settings): void {
  if (!settings.prList) return;

  const prList = settings.prList;
  const container = document.querySelector('[data-testid="pr-list"]') || 
                    document.querySelector('.js-navigation-container');

  if (!container) return;

  // Hide labels
  if (prList.hideLabels) {
    container.querySelectorAll('.IssueLabel, .Label').forEach((el) => {
      (el as HTMLElement).style.display = 'none';
    });
  }

  // Hide status badges
  if (prList.hideStatusBadges) {
    container.querySelectorAll('.State, .State--draft, .State--open, .State--merged').forEach((el) => {
      (el as HTMLElement).style.display = 'none';
    });
  }

  // Hide author avatars
  if (prList.hideAuthorAvatars) {
    container.querySelectorAll('.avatar, img.avatar').forEach((el) => {
      (el as HTMLElement).style.display = 'none';
    });
  }

  // Hide descriptions
  if (prList.hideDescriptions) {
    container.querySelectorAll('.pr-list-item-description, .markdown-title').forEach((el) => {
      (el as HTMLElement).style.display = 'none';
    });
  }

  // Hide review status
  if (prList.hideReviewStatus) {
    container.querySelectorAll('[aria-label*="review"], .review-status').forEach((el) => {
      (el as HTMLElement).style.display = 'none';
    });
  }

  // Hide merge status
  if (prList.hideMergeStatus) {
    container.querySelectorAll('.merge-status, [aria-label*="merge"]').forEach((el) => {
      (el as HTMLElement).style.display = 'none';
    });
  }

  // Hide file change counts
  if (prList.hideFileChangeCounts) {
    container.querySelectorAll('[aria-label*="file"], .file-count').forEach((el) => {
      (el as HTMLElement).style.display = 'none';
    });
  }

  // Hide comment counts
  if (prList.hideCommentCounts) {
    container.querySelectorAll('[aria-label*="comment"], .comment-count').forEach((el) => {
      (el as HTMLElement).style.display = 'none';
    });
  }

  // Hide timestamps
  if (prList.hideTimestamps) {
    container.querySelectorAll('relative-time, time-ago').forEach((el) => {
      (el as HTMLElement).style.display = 'none';
    });
  }

  // Hide branch names
  if (prList.hideBranchNames) {
    container.querySelectorAll('.head-ref, .base-ref, [title*="branch"]').forEach((el) => {
      (el as HTMLElement).style.display = 'none';
    });
  }
}

/**
 * Reset all hiding rules
 */
function resetHidingRules(): void {
  const container = document.querySelector('[data-testid="pr-list"]') || 
                    document.querySelector('.js-navigation-container');
  
  if (!container) return;

  // Reset all hidden elements
  container.querySelectorAll('[style*="display: none"]').forEach((el) => {
    const htmlEl = el as HTMLElement;
    if (htmlEl.style.display === 'none') {
      htmlEl.style.display = '';
    }
  });
}

/**
 * Initialize feature
 */
export async function initialize(settings: Settings): Promise<void> {
  currentSettings = settings;

  // Check if we're on a PR list page
  if (!window.location.pathname.includes('/pulls')) {
    return;
  }

  // Apply initial rules
  applyHidingRules(settings);

  // Observe DOM changes for dynamically loaded content
  observer = new MutationObserver(() => {
    if (currentSettings) {
      applyHidingRules(currentSettings);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Listen for settings changes
  settingsManager.subscribe((updatedSettings) => {
    currentSettings = updatedSettings;
    resetHidingRules();
    applyHidingRules(updatedSettings);
  });
}

/**
 * Cleanup feature
 */
export async function cleanup(): Promise<void> {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  resetHidingRules();
  currentSettings = null;
}

