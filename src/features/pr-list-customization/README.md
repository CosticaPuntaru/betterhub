# PR List Customization Feature

Customizes the GitHub pull request list page by hiding various UI elements.

## Overview

This feature allows users to hide specific elements from GitHub's pull request listing page:
- Labels
- Status badges
- Author avatars
- Descriptions
- Review status
- Merge status
- File change counts
- Comment counts
- Timestamps
- Branch names

## Files

- [`index.ts`](./index.ts) - Feature registration and settings schema
- [`content.ts`](./content.ts) - Content script that applies customizations
- [`types.ts`](./types.ts) - TypeScript type definitions
- [`styles.css`](./styles.css) - CSS for hiding elements
- [`translations.ts`](./translations.ts) - i18n translations

## Settings

All settings are boolean flags in `prList` settings object:
- `hideLabels`
- `hideStatusBadges`
- `hideAuthorAvatars`
- `hideDescriptions`
- `hideReviewStatus`
- `hideMergeStatus`
- `hideFileChangeCounts`
- `hideCommentCounts`
- `hideTimestamps`
- `hideBranchNames`

## How It Works

1. **Registration** - Feature registers in [`index.ts`](./index.ts)
2. **Initialization** - Content script runs on PR list pages
3. **CSS Application** - [`styles.css`](./styles.css) hides elements based on settings
4. **Dynamic Updates** - Settings changes trigger immediate UI updates

## Related Documentation

- [Features Guide](../../docs/features.md) - General feature development
- [Settings System](../../docs/settings.md) - Settings architecture

