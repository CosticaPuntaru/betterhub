# Development Guide

> **See also:** [Documentation Index](./README.md) | [Architecture](./architecture.md)

This guide covers the development workflow, setup, and best practices.

## Setup

1. Install dependencies: `pnpm install`
2. Build: `pnpm build`
3. Load extension from `dist/` in Chrome

## Scripts

- `pnpm dev` - Build in watch mode
- `pnpm build` - Production build
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm type-check` - Type check without building
- `pnpm harvest:translations` - Extract translation keys

## Code Style

- Strict TypeScript (no implicit any)
- ESLint for linting
- Prettier for formatting
- All code must pass linting and type checking

## Adding a Feature

See [Features Guide](./features.md) for detailed instructions.

## Testing

1. Build extension: `pnpm build`
2. Load `dist/` as unpacked extension in Chrome
3. Navigate to GitHub and test features
4. Check options page for settings

## References

- See zone-specific `.cursorrules` files for patterns
- See other documentation files for specific topics

