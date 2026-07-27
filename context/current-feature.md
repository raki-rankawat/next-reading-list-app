# Current Feature

<!-- Feature Name -->

## Status

<!-- Not Started|In Progress|Completed -->

Completed

## Goals

<!-- Goals & requirements -->

## Notes

<!-- Any extra notes -->

## History

<!-- Keep this updated. Earliest to latest -->

- **00 — Project Init & Boilerplate Cleanup** — Moved the App Router from `app/` to `src/app/` and repointed the `@/*` alias to `./src`, stripped `page.tsx` to a single project-name heading and `globals.css` to the Tailwind import, dropped the Geist fonts, starter metadata, and unused Next/Vercel logos. Merged in `1732bb4`.
- **01 — Project & json-server Setup** — Added `db.seed.json` (6 books, real Open Library keys/covers, all three statuses) as the committed source of truth, with `scripts/reset-db.js` + `db:reset` rebuilding the gitignored `db.json`; installed `json-server` and `concurrently` and added `dev`/`dev:next`/`dev:api`; verified all four CRUD verbs against `:3001`. Corrected the v0.17 `--watch` syntax in the docs and the bare-`olKey` schema example that would have broken feature 07's duplicate detection. Merged in `37e86c0`.
- **02 — Home Page: Read-Only Table** — Added `Book`/`BookStatus` types, `getBooks` in `src/lib/json-server.ts`, a `useBooks` hook, `StatusBadge`/`StarScore` primitives, and `BookTable`; the home page renders the six seeded books with loading, empty, and error states. Status colours became six `@theme` tokens (base + darker `-ink` per status) because the design's tint-under-dark-text pill cannot hit readable contrast from a single hex. Data loads client-side so a real loading state exists and features 04/05 can mutate, leaving `page.tsx` the only server component. Merged in `8c791e1`.
