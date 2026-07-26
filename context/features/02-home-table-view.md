# Feature: Home Page — Read-Only Table

## Status

Not Started

## Goal

Render the reading list as a table on the home page, reading from the seeded json-server data. No interactivity yet — no click-to-open, no add, no delete.

## Requirements

- Table columns: Name, Type, Status (badge), Score (stars), Author, Link
- Fetch data from `GET http://localhost:3001/books`
- Build `<StatusBadge status={...} />` — single source of truth for status-to-color mapping (green/orange/blue per @context/project-overview.md)
- Build `<StarScore score={...} />` — renders 0-5 stars
- Handle loading state (data hasn't arrived yet) and empty state (no books at all)

## Acceptance Criteria

- Table renders all seeded books from feature 1 with correct columns
- Status badges show the correct color per status
- Scores render as the correct number of filled stars
- Loading and empty states both visually distinct from the populated table

## Depends On

- Feature 1 (json-server must be running with seed data)

## Design Reference

Use the claude-design MCP (must be registered via `claude mcp add --scope user
--transport http claude-design https://api.anthropic.com/v1/design/mcp`) to
import this project:
https://claude.ai/design/p/529c3d37-dc74-4ef9-8d5a-e758ce3e5835?file=Reading+List.dc.html

Focus on:
- `Reading List.dc.html`

Also read the imported file:
- `support.js`

Implement the table layout, spacing, and column structure shown in
`Reading List.dc.html` for this feature, adapted to the coding standards
in @context/coding-standards.md (plain Tailwind, no component library,
TypeScript strict mode).

## Notes

No click behavior on rows yet — that's feature 3.
