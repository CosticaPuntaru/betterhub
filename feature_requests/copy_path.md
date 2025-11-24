# Feature Request: Copy File Path Button

## High-Level Description
Add a one-click button to copy the relative file path in file headers.

## The Problem
Copying a file path usually involves selecting the text manually or using the "Copy permalink" menu, which gives a full URL. Developers often just need the relative path (e.g., `src/components/Button.tsx`) for terminal commands or imports.

## Implementation Details
- **Trigger**: On file view or PR diff load.
- **Action**:
    1. Find file headers.
    2. Create a "Copy" icon button.
    3. On click, write the file path text to the clipboard.
    4. Show a "Copied!" tooltip feedback.

## How to Use
1.  Navigate to any file view or PR diff.
2.  Locate the file header (where the filename is displayed).
3.  Click the small "Copy" (clipboard) icon next to the filename.
4.  The relative path is now in your clipboard.

## Steps to Test
1.  Open a file.
2.  Click the "Copy Path" button.
3.  Paste into a text field or editor.
4.  Verify the pasted text is the relative path (e.g., `src/index.ts`) and not a full URL.

## Agent Validation
-   **Button Existence**: Query for the button element (e.g., `.betterhub-copy-path`).
-   **Click Action**: Trigger a click event on the button.
-   **Feedback Check**: Verify a tooltip or success message (e.g., "Copied!") appears in the DOM.
