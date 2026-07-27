# Current Feature

<!-- Feature Name -->

01 — Project & json-server Setup

## Status

<!-- Not Started|In Progress|Completed -->

In Progress

## Goals

<!-- Goals & requirements -->

Get the base Next.js/TypeScript/Tailwind project running alongside a seeded json-server instance, with CRUD confirmed working before any UI is built.

- Create `db.seed.json` with a `books` array — the untouched source of truth, committed to git
- Seed 5-6 sample books covering all three statuses (`read`, `currently_reading`, `want_to_read`), matching the schema in @context/project-overview.md, inside `db.seed.json`
- Create `scripts/reset-db.js`, which copies `db.seed.json` over `db.json`
- Add a `db:reset` script to `package.json` running `node scripts/reset-db.js`
- Run `db:reset` once to generate the initial `db.json` (the working file json-server reads/writes — gitignored, since it's disposable test state)
- Install `json-server` and `concurrently` as devDependencies
- Add scripts to `package.json`: `dev` (Next.js + json-server together via `concurrently`), `dev:next` and `dev:api` (each in isolation)
- Confirm `GET`, `POST`, `PATCH`, `DELETE` all work against `http://localhost:3001/books` via curl — before writing any frontend code

## Notes

<!-- Any extra notes -->

- Spec: @context/features/01-json-server-setup.md
- `scripts/reset-db.js` already landed in `282861f`; the rest of the feature is unbuilt.

## History

<!-- Keep this updated. Earliest to latest -->

- **00 — Project Init & Boilerplate Cleanup** — Moved the App Router from `app/` to `src/app/` and repointed the `@/*` alias to `./src`, stripped `page.tsx` to a single project-name heading and `globals.css` to the Tailwind import, dropped the Geist fonts, starter metadata, and unused Next/Vercel logos. Merged in `1732bb4`.
