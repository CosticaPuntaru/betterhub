# Feature Request: Sticky File Headers

## High-Level Description
Keep file names visible while scrolling through large diffs in Pull Requests by applying CSS `position: sticky` to the file header elements.

## The Problem
When reviewing long files in a PR, the file header (containing the filename and controls) scrolls off-screen, causing the reviewer to lose context of which file they are currently examining.

## Implementation Details
- **Trigger**: On PR "Files changed" tab load.
- **Action**:
    1. Identify the file header elements (e.g., `.file-header`).
    2. Inject CSS to set `position: sticky`, `top: [header_height]`, and `z-index: [appropriate_value]`.
    3. Ensure it handles the main GitHub header correctly so they don't overlap.
- **Settings**: Toggle to enable/disable.

## How to Use
1.  Enable "Sticky File Headers" in BetterHub options.
2.  Open a Pull Request with a large file (long enough to scroll).
3.  Scroll down the file diff.
4.  The file header (with the filename and "Viewed" checkbox) will stick to the top of the screen.

## Steps to Test
1.  Open a PR with a long file diff (e.g., > 1000 lines).
2.  Scroll down past the initial header position.
3.  Verify that the header bar remains visible at the top of the viewport.
4.  Scroll back up; verify the header returns to its original position.

## Agent Validation
-   **Scroll & Check**:
    1.  Select a file header element.
    2.  Scroll the window down by 500px.
    3.  Check `element.getBoundingClientRect().top`. It should be approximately equal to the sticky offset (e.g., 0 or the height of the global nav bar), not negative.
-   **Computed Style**: Verify `window.getComputedStyle(element).position === 'sticky'`.
