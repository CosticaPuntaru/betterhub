# Feature Request: Reaction Avatars

## High-Level Description
Display user avatars next to reaction emojis to see who reacted at a glance.

## The Problem
GitHub reactions display a count (e.g., "👍 3"). To see *who* reacted, you must hover over the emoji and wait for the tooltip. This makes it slow to check if a specific person (like a maintainer or product manager) has approved or acknowledged a comment.

## Implementation Details
- **Trigger**: On pages with comments/issues/PRs.
- **Action**:
    1. Find reaction blocks.
    2. Fetch the list of reactors (this might require an API call if not present in DOM, or parsing the tooltip content if available).
    3. If parsing tooltip is possible (often contains "User1, User2, and 3 others"), try to map names to avatars if cached/known.
    4. *Constraint*: Without API, this is hard. A simpler version might just list the names textually next to it or try to find avatars if they are hidden in the DOM.
    5. *Alternative*: If API usage is allowed, fetch reactions and append small avatar `<img>` tags next to the count.

## How to Use
1.  View any comment or description with emoji reactions.
2.  Next to the reaction count (e.g., 👍 2), you will see small circular avatars of the users who reacted.

## Steps to Test
1.  Find a comment with reactions.
2.  Verify that small images (avatars) are displayed next to the reaction pill.
3.  Hover over an avatar to verify the username (alt text or tooltip).

## Agent Validation
-   **DOM Query**: Find the reaction container (e.g., `.comment-reactions`).
-   **Image Check**: Verify it contains `img` elements that are NOT part of the standard GitHub UI (check for specific class like `.betterhub-reaction-avatar`).
-   **Source Check**: Verify `src` attributes point to GitHub user avatars.
