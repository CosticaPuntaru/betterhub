# Feature Request: Image Size Display

## High-Level Description
Display image dimensions and file size in Pull Request diffs and file views by injecting an overlay or label.

## The Problem
GitHub shows visual diffs for images (side-by-side, swipe, onion skin) but often lacks clear, immediate text displaying the exact dimensions (width x height) and file size, making it hard to verify optimization or layout changes.

## Implementation Details
- **Trigger**: When viewing an image blob or image diff.
- **Action**:
    1. Locate image elements in the DOM.
    2. Read `naturalWidth`, `naturalHeight` properties or fetch file metadata.
    3. Inject a label or overlay on the image (e.g., "800x600 | 45KB").
    4. For diffs, show "Before: 800x600" vs "After: 400x300".

## How to Use
1.  Open an image file in a repository or a PR diff involving an image.
2.  Look for a text label overlaying or next to the image.
3.  Read the dimensions (WxH) and file size.

## Steps to Test
1.  Navigate to a `.png` or `.jpg` file in a repo.
2.  Verify a label appears showing dimensions (e.g., "1024x768").
3.  Open a PR with an image update.
4.  Verify labels show dimensions for both the "before" and "after" versions of the image.

## Agent Validation
-   **Element Search**: Find the `img` element in the file view.
-   **Label Check**: Search for a sibling or child element containing text matching the regex `/\d+\s*x\s*\d+/` (e.g., "100x100").
-   **Content Match**: Verify the text matches the `naturalWidth` and `naturalHeight` of the image.
