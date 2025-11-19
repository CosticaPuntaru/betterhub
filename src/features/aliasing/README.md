# Aliasing Feature

Allows users to create custom aliases for GitHub users, projects, and organizations with colors and icons.

## Overview

The aliasing feature provides:
- **Custom aliases** - Replace GitHub usernames/repo names with custom text
- **Visual customization** - Add colors or icons to aliases
- **Auto-harvesting** - Automatically detect and store entities from pages
- **Whitelist control** - Control which organizations/repositories to harvest from
- **Auto-aliasing** - Automatically create aliases with default styling

## Files

- [`index.ts`](./index.ts) - Feature registration and settings schema
- [`content.ts`](./content.ts) - Content script that applies aliases to GitHub pages
- [`alias-manager.ts`](./alias-manager.ts) - Core alias application logic
- [`harvester.ts`](./harvester.ts) - Auto-harvesting functionality
- [`types.ts`](./types.ts) - TypeScript type definitions
- [`utils.ts`](./utils.ts) - Utility functions (color generation, etc.)
- [`styles.css`](./styles.css) - Feature-specific styles

## Settings

See [`index.ts`](./index.ts) for the complete settings schema. Key settings:

- `autoHarvestUsers/Projects/Orgs` - Enable auto-harvesting
- `harvestOrgWhitelist/RepoWhitelist` - Control harvest scope
- `autoAliasUsers/Projects/Orgs` - Enable auto-aliasing
- `users/projects/orgs` - Manual alias lists

## How It Works

1. **Registration** - Feature registers itself in [`index.ts`](./index.ts)
2. **Initialization** - Content script initializes in [`content.ts`](./content.ts)
3. **Harvesting** - If enabled, [`harvester.ts`](./harvester.ts) detects entities
4. **Application** - [`alias-manager.ts`](./alias-manager.ts) applies aliases to DOM
5. **UI** - Options page uses React components (`AliasList`, `HarvestWhitelist`)

## Related Documentation

- [Features Guide](../../docs/features.md) - General feature development
- [Options Components](../../options/components/README.md) - UI components
- [Settings System](../../docs/settings.md) - Settings architecture

