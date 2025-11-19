# Architecture

> **See also:** [Documentation Index](./README.md) | [Features Guide](./features.md)

This document describes the system architecture and design patterns used in BetterHub.

## Overview

BetterHub uses a feature-based architecture where each feature is self-contained and can span multiple contexts (content, popup, options).

## Core Components

### Settings Manager
- Location: `src/shared/utils/settings-manager.ts`
- Centralized settings storage using `chrome.storage.sync`
- Real-time synchronization across all contexts
- Observable pattern for settings changes

### Feature Registry
- Location: `src/shared/utils/feature-registry.ts`
- Manages feature lifecycle (enable/disable, initialize, cleanup)
- Features register themselves on import

### Content Script Orchestrator
- Location: `src/content/github.ts`
- Dynamically loads enabled features
- Handles settings changes and feature lifecycle

## Data Flow

1. User changes setting in options page
2. Settings manager updates `chrome.storage.sync`
3. Storage change event fires
4. Background service worker broadcasts to all tabs
5. Content scripts receive message and update features
6. Features apply/remove UI modifications

## Feature Structure

Each feature is self-contained:
- `index.ts` - Registration and settings schema
- `content.ts` - GitHub UI modifications
- `styles.css` - Feature styles
- `types.ts` - Feature types
- `translations.ts` - Translation keys

## References

- See zone-specific `.cursorrules` files for implementation patterns
- See `src/shared/utils/` for core utilities

