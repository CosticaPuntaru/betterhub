# Implementation Checklist

This document serves as a master todo list for implementing the requested features. Agents should pick a feature, mark it as in-progress, and complete all sub-tasks before moving to the next.

## 1. Default "Hide Whitespace"
- [x] Read feature request at `feature_requests/hide_whitespace.md`
- [x] Implement core logic in content script
- [x] Add settings to `src/shared/types/settings.ts`
- [x] Add UI schema to `src/features/[feature]/index.ts`
- [x] **Validation**: Verify no TypeScript errors
- [x] **Validation**: Verify no lint errors
- [x] **Validation**: Verify extension builds successfully
- [x] **Validation**: Verify settings appear correctly in Options page
- [x] **Next**: Create implementation plan and start executing next feature

## 2. Sticky File Headers   
- [x] Read feature request at `feature_requests/sticky_headers.md`
- [x] Implement CSS/JS logic for sticky positioning
- [x] Add settings to `src/shared/types/settings.ts`
- [x] Add UI schema to `src/features/[feature]/index.ts`
- [x] Register feature in `src/options/components/AppContent.tsx` (loadAllFeatures)
- [x] **Validation**: Verify no TypeScript errors
- [x] **Validation**: Verify no lint errors
- [x] **Validation**: Verify extension builds successfully
- [x] **Validation**: Verify settings appear correctly in Options page
- [x] **Next**: Create implementation plan and start executing next feature

## 3. NPM/Package Links
- [x] Read feature request at `feature_requests/package_links.md`
- [x] Implement parsing and link injection logic
- [x] Add settings to `src/shared/types/settings.ts`
- [x] Add UI schema to `src/features/[feature]/index.ts`
- [x] Register feature in `src/options/components/AppContent.tsx` (loadAllFeatures)
- [x] **Validation**: Verify no TypeScript errors
- [x] **Validation**: Verify no lint errors
- [x] **Validation**: Verify extension builds successfully
- [x] **Validation**: Verify settings appear correctly in Options page
- [x] **Next**: Create implementation plan and start executing next feature

## 4. Image Size Display
- [x] Read feature request at `feature_requests/image_size.md`
- [x] Implement image metadata fetching and overlay injection
- [x] Add settings to `src/shared/types/settings.ts`
- [x] Add UI schema to `src/features/[feature]/index.ts`
- [x] Register feature in `src/options/components/AppContent.tsx` (loadAllFeatures)
- [x] **Validation**: Verify no TypeScript errors
- [x] **Validation**: Verify no lint errors
- [x] **Validation**: Verify extension builds successfully
- [x] **Validation**: Verify settings appear correctly in Options page
- [x] **Next**: Create implementation plan and start executing next feature

## 5. Copy File Path Button
- [x] Read feature request at `feature_requests/copy_path.md`
- [x] Implement button injection and clipboard logic
- [x] Add settings to `src/shared/types/settings.ts`
- [x] Add UI schema to `src/features/[feature]/index.ts`
- [x] Register feature in `src/options/components/AppContent.tsx` (loadAllFeatures)
- [x] **Validation**: Verify no TypeScript errors
- [x] **Validation**: Verify no lint errors
- [x] **Validation**: Verify extension builds successfully
- [x] **Validation**: Verify settings appear correctly in Options page
- [x] **Next**: Create implementation plan and start executing next feature

## 6. "Viewed" Checkbox Visibility
- [x] Read feature request at `feature_requests/viewed_checkbox.md`
- [x] Implement floating button or sticky checkbox logic
- [x] Add settings to `src/shared/types/settings.ts`
- [x] Add UI schema to `src/features/[feature]/index.ts`
- [x] Register feature in `src/options/components/AppContent.tsx` (loadAllFeatures)
- [x] **Validation**: Verify no TypeScript errors
- [x] **Validation**: Verify no lint errors
- [x] **Validation**: Verify extension builds successfully
- [x] **Validation**: Verify settings appear correctly in Options page
- [x] **Next**: Create implementation plan and start executing next feature

## 7. Auto-Expand Resolved Comments
- [x] Read feature request at `feature_requests/expand_resolved.md`
- [x] Implement auto-expand logic and/or global button
- [x] Add settings to `src/shared/types/settings.ts`
- [x] Add UI schema to `src/features/[feature]/index.ts`
- [x] Register feature in `src/options/components/AppContent.tsx` (loadAllFeatures)
- [x] **Validation**: Verify no TypeScript errors
- [x] **Validation**: Verify no lint errors
- [x] **Validation**: Verify extension builds successfully
- [x] **Validation**: Verify settings appear correctly in Options page
- [x] **Next**: Create implementation plan and start executing next feature

## 8. Prevent Accidental Tab Close
- [x] Read feature request at `feature_requests/prevent_close.md`
- [x] Implement `beforeunload` listener and textarea detection
- [x] Add settings to `src/shared/types/settings.ts`
- [x] Add UI schema to `src/features/[feature]/index.ts`
- [x] Register feature in `src/options/components/AppContent.tsx` (loadAllFeatures)
- [x] **Validation**: Verify no TypeScript errors
- [x] **Validation**: Verify no lint errors
- [x] **Validation**: Verify extension builds successfully
- [x] **Validation**: Verify settings appear correctly in Options page
- [x] **Next**: Create implementation plan and start executing next feature

## 9. Reaction Avatars
- [x] Read feature request at `feature_requests/reaction_avatars.md`
- [x] Implement reaction fetching/parsing and avatar injection
- [x] Add settings to `src/shared/types/settings.ts`
- [x] Add UI schema to `src/features/[feature]/index.ts`
- [x] Register feature in `src/options/components/AppContent.tsx` (loadAllFeatures)
- [x] **Validation**: Verify no TypeScript errors
- [x] **Validation**: Verify no lint errors
- [x] **Validation**: Verify extension builds successfully
- [x] **Validation**: Verify settings appear correctly in Options page
- [x] **Next**: Create implementation plan and start executing next feature

## 10. Build Status Favicon
- [x] Read feature request at `feature_requests/build_favicon.md`
- [x] Implement build status monitoring and favicon replacement
- [x] Add settings to `src/shared/types/settings.ts`
- [x] Add UI schema to `src/features/[feature]/index.ts`
- [x] Register feature in `src/options/components/AppContent.tsx` (loadAllFeatures)
- [x] **Validation**: Verify no TypeScript errors
- [x] **Validation**: Verify no lint errors
- [x] **Validation**: Verify extension builds successfully
- [x] **Validation**: Verify settings appear correctly in Options page
- [x] **Next**: All features complete!
