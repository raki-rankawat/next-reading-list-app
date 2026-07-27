# Current Feature

02 — Home Page: Read-Only Table

## Status

<!-- Not Started|In Progress|Completed -->

In Progress

## Goals

<!-- Goals & requirements -->

Render the reading list as a table on the home page, reading from the seeded
json-server data. No interactivity yet — no click-to-open, no add, no delete.

### Requirements

- Table columns: Name, Type, Status (badge), Score (stars), Author, Link
- Fetch data from `GET http://localhost:3001/books`
- Build `<StatusBadge status={...} />` — single source of truth for
  status-to-color mapping (green/orange/blue per @context/project-overview.md)
- Build `<StarScore score={...} />` — renders 0-5 stars
- Handle loading state (data hasn't arrived yet) and empty state (no books at all)

### Acceptance Criteria

- Table renders all seeded books from feature 1 with correct columns
- Status badges show the correct color per status
- Scores render as the correct number of filled stars
- Loading and empty states both visually distinct from the populated table

## Notes

<!-- Any extra notes -->

Source spec: @context/features/02-home-table-view.md

Design reference imported from the claude-design project
(`Reading List.dc.html`). Layout tokens taken from it: 1100px max-width
container, `56px 32px 80px` padding, white table card with 12px radius and a
hairline border, uppercase 11.5px muted column headers, 16px/20px cell padding,
pill-shaped status badges, amber stars.

Build order (one part per review pause):

1. `src/types/book.ts` + status colour CSS custom properties in `globals.css`
2. `StatusBadge` + `StarScore` presentational components
3. Data layer — `src/lib/json-server.ts` + `useBooks` hook
4. Home page — table, loading state, empty state

## History

<!-- Keep this updated. Earliest to latest -->

- **00 — Project Init & Boilerplate Cleanup** — Moved the App Router from `app/` to `src/app/` and repointed the `@/*` alias to `./src`, stripped `page.tsx` to a single project-name heading and `globals.css` to the Tailwind import, dropped the Geist fonts, starter metadata, and unused Next/Vercel logos. Merged in `1732bb4`.
- **01 — Project & json-server Setup** — Added `db.seed.json` (6 books, real Open Library keys/covers, all three statuses) as the committed source of truth, with `scripts/reset-db.js` + `db:reset` rebuilding the gitignored `db.json`; installed `json-server` and `concurrently` and added `dev`/`dev:next`/`dev:api`; verified all four CRUD verbs against `:3001`. Corrected the v0.17 `--watch` syntax in the docs and the bare-`olKey` schema example that would have broken feature 07's duplicate detection. Merged in `37e86c0`.
