# Feature: Project & json-server Setup

## Status

Not Started

## Goal

Get the base Next.js/TypeScript/Tailwind project running alongside a seeded json-server instance, with CRUD confirmed working before any UI is built.

## Requirements

- Create `db.json` with a `books` array
- Seed 5-6 sample books covering all three statuses (`read`, `currently_reading`, `want_to_read`), matching the schema in @context/project-overview.md
- Install and configure `json-server`, running on port 3001 (`npx json-server --watch db.json --port 3001`)
- Confirm `GET`, `POST`, `PATCH`, `DELETE` all work against `http://localhost:3001/books` via curl or Postman — before writing any frontend code

## Acceptance Criteria

- `npm run dev` runs the Next.js app on :3000 with no errors
- `npx json-server --watch db.json --port 3001` serves the seeded books
- All four CRUD operations verified manually against json-server (not through the UI, since there is none yet)

## Depends On

- Feature 0 (project must be initialized and boilerplate cleaned up first)

## Notes

This seed data is what feature 2's table will render. No Open Library / real API calls happen until feature 7.
