# Feature: Project & json-server Setup

## Status

Not Started

## Goal

Get the base Next.js/TypeScript/Tailwind project running alongside a seeded json-server instance, with CRUD confirmed working before any UI is built.

## Requirements

- Create `db.json` with a `books` array
- Seed 5-6 sample books covering all three statuses (`read`, `currently_reading`, `want_to_read`), matching the schema in @context/project-overview.md
- Install `json-server` and `concurrently` as devDependencies
- Add scripts to `package.json`: `dev` (runs Next.js + json-server together via `concurrently`), `dev:next` and `dev:api` (each in isolation, for debugging)
- Confirm `GET`, `POST`, `PATCH`, `DELETE` all work against `http://localhost:3001/books` via curl or Postman — before writing any frontend code

## Acceptance Criteria

- `npm run dev` starts both Next.js (:3000) and json-server (:3001) together, in one command
- `npm run dev:next` and `npm run dev:api` each work in isolation
- All four CRUD operations verified manually against json-server (not through the UI, since there is none yet)

## Depends On

- Feature 0 (project must be initialized and boilerplate cleaned up first)

## Notes

This seed data is what feature 2's table will render. No Open Library / real API calls happen until feature 7.
