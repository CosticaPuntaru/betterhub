# Documentation Structure

This document explains the documentation organization in BetterHub.

## Philosophy

Documentation is **co-located** with the code it describes:
- Feature docs live in `src/features/feature-name/README.md`
- Component docs live in `src/options/components/README.md`
- Utility docs live next to the utility files
- High-level architecture docs live in `docs/`

## Structure

```
docs/                          # High-level architecture docs
├── README.md                  # Documentation index (start here)
├── architecture.md            # System architecture
├── features.md                # Feature development guide
├── settings.md                # Settings system
├── development.md             # Development workflow
└── i18n.md                   # Internationalization

src/
  features/
    aliasing/
      README.md                # Aliasing feature docs
    pr-list-customization/
      README.md                # PR customization feature docs
  
  options/
    README.md                  # Options page overview
    components/
      README.md               # Component documentation
  
  shared/
    README.md                 # Shared utilities overview
    utils/
      feature-registry.md     # Feature registry API
      settings-manager.md     # Settings manager API
```

## Navigation

All documentation files include:
- Links to parent documents
- Links to related documents
- Links to relevant code files

Start at [`docs/README.md`](./README.md) for the full index.

## Adding Documentation

When adding new code:
1. Create a `README.md` in the same directory
2. Link to it from parent documentation
3. Include code examples and usage
4. Reference related documentation

## Best Practices

- **Keep it close** - Documentation lives with the code
- **Link everything** - Each doc links to related docs
- **Code examples** - Show how to use the code
- **Keep it updated** - Update docs when code changes

