# BetterHub

GitHub customization extension with feature-based architecture, built with Vite, TypeScript, and Manifest V3.

## Features

- **Feature-based architecture** - Self-contained feature modules
- **Real-time settings sync** - Settings update across all contexts instantly
- **Declarative settings UI** - Features define settings schemas, UI is auto-generated
- **Multi-language support** - i18next with translation harvesting
- **Cross-browser** - Works on Chrome, Firefox, Edge, and Safari

## Current Features

- **PR List Customization** - Hide various elements from GitHub PR listing pages

## Development

### Setup

```bash
pnpm install
```

### Build

```bash
pnpm build
```

### Development

```bash
pnpm dev
```

### Load Extension

1. Build the extension: `pnpm build`
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the `dist` directory

## Scripts

- `pnpm dev` - Build in watch mode
- `pnpm build` - Production build
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm type-check` - Type check without building
- `pnpm harvest:translations` - Extract translation keys from code

## Documentation

Documentation is organized by component, with each document located close to the code it describes.

**Start here:** [Documentation Index](./docs/README.md)

### Quick Links
- [Architecture](./docs/architecture.md) - System architecture and design
- [Features Guide](./docs/features.md) - Feature development guide
- [Settings System](./docs/settings.md) - Settings architecture
- [Development Guide](./docs/development.md) - Development workflow
- [i18n Guide](./docs/i18n.md) - Internationalization

### Feature Documentation
- [Aliasing Feature](./src/features/aliasing/README.md) - User/project/org aliasing
- [PR List Customization](./src/features/pr-list-customization/README.md) - PR list UI customization

### Component Documentation
- [Options Page](./src/options/README.md) - Settings page architecture
- [Options Components](./src/options/components/README.md) - React components
- [Shared Utilities](./src/shared/README.md) - Shared code and utilities

## Project Structure

```
src/
├── features/          # Feature modules (self-contained)
├── shared/            # Shared utilities, types, constants
├── background/        # Service worker
├── content/           # Content scripts
├── popup/             # Extension popup
└── options/           # Settings page
```

## Adding a Feature

1. Create directory: `src/features/feature-name/`
2. Add settings to `src/shared/types/settings.ts`
3. Create `index.ts` with registration and settings schema
4. Create `content.ts` with `initialize()` and `cleanup()` functions
5. Feature automatically appears in options page

See [Features Guide](./docs/features.md) for detailed instructions.

## License

ISC

