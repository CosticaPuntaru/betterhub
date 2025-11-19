# BetterHub Documentation

Welcome to the BetterHub documentation. This documentation is organized by component, with each document located close to the code it describes.

## 📚 Documentation Index

### Core Documentation
- [Architecture](./architecture.md) - System architecture and design patterns
- [Development Guide](./development.md) - Development workflow and setup
- [Settings System](./settings.md) - How the settings system works
- [i18n Guide](./i18n.md) - Internationalization and translations

### Features
- [Features Overview](./features.md) - Feature catalog and development guide
- [Aliasing Feature](../src/features/aliasing/README.md) - User/project/org aliasing
- [PR List Customization](../src/features/pr-list-customization/README.md) - PR list UI customization

### Options Page
- [Options Page Overview](../src/options/README.md) - Settings page architecture
- [Components](../src/options/components/README.md) - React components documentation

### Shared Utilities
- [Shared Utilities](../src/shared/README.md) - Shared code and utilities
- [Feature Registry](../src/shared/utils/feature-registry.md) - Feature registration system
- [Settings Manager](../src/shared/utils/settings-manager.md) - Settings management API

## 🗂️ Documentation Structure

Documentation follows the code structure:

```
docs/                    # High-level architecture docs
src/
  features/
    aliasing/
      README.md         # Feature-specific docs
  options/
    README.md           # Options page docs
    components/
      README.md         # Component docs
  shared/
    README.md           # Shared utilities docs
    utils/
      *.md              # Individual utility docs
```

## 📖 Reading Guide

1. **New to the project?** Start with [Architecture](./architecture.md) and [Development Guide](./development.md)
2. **Adding a feature?** Read [Features Guide](./features.md) and check existing feature READMEs
3. **Working on options page?** See [Options Page Overview](../src/options/README.md)
4. **Using shared utilities?** Check [Shared Utilities](../src/shared/README.md)

## 🔗 Quick Links

- [Main README](../README.md) - Project overview and setup
- [Architecture](./architecture.md) - System design
- [Features Guide](./features.md) - Feature development
