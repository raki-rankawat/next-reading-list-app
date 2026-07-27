# Reading List

A personal book reading list tracker — track books you've read, are currently reading, or want to read. No login, no real database.

## Context Files

Read the following to get the full context of the project:

- @context/project-overview.md
- @context/coding-standards.md
- @context/ai-interaction.md
- @context/current-feature.md

## Commands

`npm run dev` runs both the Next.js dev server and json-server together via `concurrently` — no need for two terminals.

```bash
npm run dev       # Next.js (:3000) + json-server on db.json (:3001), together
npm run dev:next  # Next.js only, for isolating a Next.js-specific issue
npm run dev:api   # json-server only, for isolating a data/API issue
npm run db:reset   # restore db.json to the 6 seeded books from db.seed.json
npm run build      # production build
npm start          # serve the production build
npm run lint       # eslint
```

Note: `npm start` serves the built Next.js app only — json-server still needs to be running (`npm run dev:api`) for data to load, since it's not part of the production build.

Note: `npm run db:reset` rewrites `db.json` on disk, but a **running** json-server keeps serving its in-memory copy — it does not reload on an external overwrite. Stop the server, run `db:reset`, then start it again.

`db.json` is gitignored disposable working state. `db.seed.json` is the committed source of truth — edit that if you want to change the starting data.
