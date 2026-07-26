# Feature: Book Detail Drawer — View Only

## Status

Not Started

## Goal

Clicking a row in the table opens a slide-in drawer showing that book's details. Read-only — no editing or deleting yet. This establishes the drawer's open/close mechanics in isolation.

## Requirements

- Clicking a table row opens a drawer sliding in from the right, with a backdrop
- Drawer shows: cover image, title, author, link, score, status (as a static badge, not yet editable)
- Drawer can be closed via a close button and via clicking the backdrop
- Only one drawer open at a time; clicking a different row while one is open swaps its content

## Acceptance Criteria

- Drawer opens/closes smoothly with no layout shift in the table behind it
- Correct book data shown for whichever row was clicked
- Works on both desktop and mobile viewport widths per the responsive rules in @context/project-overview.md

## Depends On

- Feature 2 (table must exist and be clickable)

## Design Reference

Use the claude-design MCP (must be registered via `claude mcp add --scope user
--transport http claude-design https://api.anthropic.com/v1/design/mcp`) to
import this project:
https://claude.ai/design/p/529c3d37-dc74-4ef9-8d5a-e758ce3e5835?file=Reading+List.dc.html

Focus on:
- `Reading List.dc.html`

Also read the imported file:
- `support.js`

Implement the drawer layout and slide-in behavior shown in
`Reading List.dc.html` for this feature, adapted to the coding standards
in @context/coding-standards.md.

## Notes

Status is displayed but not editable here — that's feature 4. Delete button doesn't exist yet — that's feature 5.
