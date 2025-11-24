# Feature Request: Prevent Accidental Tab Close

## High-Level Description
Warn users before closing a tab if they have unsaved/unsubmitted comments using a `beforeunload` listener.

## The Problem
It's easy to accidentally close a tab or navigate away while typing a long comment, potentially losing work if GitHub's auto-save hasn't kicked in or fails.

## Implementation Details
- **Trigger**: Global (on all GitHub pages).
- **Action**:
    1. Add a `window.addEventListener('beforeunload', ...)` handler.
    2. In the handler, check if any `<textarea>` elements on the page have content (`value.length > 0`).
    3. Filter out textareas that are hidden or empty.
    4. If content exists, trigger the standard browser confirmation dialog ("Changes you made may not be saved...").

## How to Use
1.  Start typing a comment in any GitHub text box.
2.  Try to close the browser tab or refresh the page.
3.  A browser alert will appear asking "Leave site? Changes you made may not be saved."
4.  Click "Cancel" to stay and save your work.

## Steps to Test
1.  Go to an issue or PR.
2.  Type "Draft comment" in the comment box.
3.  Try to close the tab (Ctrl+W / Cmd+W).
4.  Verify the browser confirmation dialog appears.

## Agent Validation
-   **Simulation**:
    1.  Inject text into a textarea: `document.querySelector('textarea').value = 'test'`.
    2.  Dispatch event: `window.dispatchEvent(new Event('beforeunload', { cancelable: true }))`.
-   **Check**: Verify if `event.defaultPrevented` is true or if `event.returnValue` is set (this indicates the dialog was triggered).
