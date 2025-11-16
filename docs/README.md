# BetterHub

GitHub customization extension with feature-based architecture.

## Quick Start

1. Install dependencies: `pnpm install`
2. Build: `pnpm build`
3. Load extension from `dist/` directory in Chrome

## Documentation

- [Architecture](./architecture.md) - System architecture and design
- [Features](./features.md) - Feature catalog and development guide
- [Settings](./settings.md) - Settings system documentation
- [i18n](./i18n.md) - Internationalization guide
- [Development](./development.md) - Development workflow

## Project Structure

- `src/features/` - Feature modules (self-contained)
- `src/shared/` - Shared utilities and types
- `src/background/` - Service worker
- `src/content/` - Content scripts
- `src/popup/` - Extension popup
- `src/options/` - Settings page

## Adding a Feature

See [Features Guide](./features.md) for detailed instructions.

