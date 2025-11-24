# Feature Request: "Viewed" Checkbox Visibility

## High-Level Description
Make the "Viewed" checkbox in PR reviews more accessible and prominent, potentially via a floating action button or sticky footer.

## The Problem
The "Viewed" checkbox is located in the file header. As you scroll down a long file, it disappears. To mark a file as viewed, you have to scroll all the way back up, which breaks flow.

## Implementation Details
- **Trigger**: On PR "Files changed" tab.
- **Action**:
    1. Create a floating action button (FAB) or a sticky footer element that contains the "Viewed" toggle for the currently visible file.
    2. Alternatively, make the existing "Viewed" checkbox sticky within the sticky header (if implemented).
    3. Ensure it syncs state with the real checkbox.

## How to Use
1.  Open a PR review.
2.  Scroll down a large file.
3.  Look for a floating "Viewed" button (or sticky header checkbox).
4.  Click it to mark the file as viewed without scrolling back to the top.

## Steps to Test
1.  Open a PR with a long file.
2.  Scroll to the middle of the file.
3.  Click the floating/sticky "Viewed" toggle.
4.  Verify the file collapses (default GitHub behavior when viewed) or the indicator updates.

## Agent Validation
-   **Visibility Check**: Scroll the page so the original header is out of view.
-   **Element Query**: Check if the "Viewed" toggle element is still within the viewport (`getBoundingClientRect`).
-   **State Sync**: Click the custom toggle and verify the original GitHub checkbox state changes.
