# Reading List

A personal book reading list tracker — track books you've read, are currently reading, or want to read. No login, no real database.

## Context Files

Read the following to get the full context of the project:

- @context/project-overview.md
- @context/coding-standards.md
- @context/ai-interaction.md
- @context/current-feature.md

## Commands

Two processes run side by side in development — this app has no real backend, `json-server` is standing in for one.

```bash
npm run dev                                    # Next.js dev server on :3000
npx json-server --watch db.json --port 3001    # fake REST API on :3001, run in a second terminal
npm run build                                   # production build
npm start                                       # serve the production build
npm run lint                                    # eslint
```

Note: `npm start` will serve the Next.js app, but json-server still needs to be running separately for data to load — there is no bundled backend.
