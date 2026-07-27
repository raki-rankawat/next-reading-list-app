# Current Feature

03 — Book Detail Drawer (View Only)

## Status

<!-- Not Started|In Progress|Completed -->

In Progress

## Goals

<!-- Goals & requirements -->

Clicking a row in the table opens a slide-in drawer showing that book's details.
Read-only — no editing or deleting yet. This establishes the drawer's open/close
mechanics in isolation.

### Requirements

- Clicking a table row opens a drawer sliding in from the right, with a backdrop
- Drawer shows: cover image, title, author, link, score, status (as a static badge, not yet editable)
- Drawer can be closed via a close button and via clicking the backdrop
- Only one drawer open at a time; clicking a different row while one is open swaps its content

### Acceptance Criteria

- Drawer opens/closes smoothly with no layout shift in the table behind it
- Correct book data shown for whichever row was clicked
- Works on both desktop and mobile viewport widths per the responsive rules in
  @context/project-overview.md

### Parts

1. Drawer open/close mechanics — row click wiring, backdrop, slide-in transition, close button
2. Drawer content — cover image, title, author, link, score, static status badge
3. Responsive behavior — full-screen overlay under 768px, right-hand panel at desktop widths

## Notes

<!-- Any extra notes -->

- Status is displayed but not editable here — that's feature 04. Delete button
  doesn't exist yet — that's feature 05.
- **The Claude Design file is the source of truth for every UI feature from here
  on, and must be read before building, not after.** Read
  `Reading List.dc.html` from project `529c3d37-dc74-4ef9-8d5a-e758ce3e5835`.
  When the claude-design import tools are not loaded in a session, `DesignSync`
  read methods still reach it (`list_files`, then `get_file`).
- The drawer was first built from feature 02's table styling and diverged from
  the design (bordered header vs. centred cover/title stack, wrong field order,
  400px vs 440px panel); it was re-laid out against the design file before
  commit.
- Deliberate deviations from the design, each scoped by the feature list:
  - Status renders as a static `StatusBadge`, not the design's `<select>` —
    feature 04 owns editing.
  - No Delete button — feature 05 owns it.
  - No Notes / Added / Finished fields — the `Book` model in
    project-overview.md has no such fields and no feature adds them.
  - Mobile is a full-screen overlay rather than the design's `max-width:92vw`,
    because the acceptance criteria cite the responsive rules in
    project-overview.md, which specify full-screen below 768px.

## History

<!-- Keep this updated. Earliest to latest -->

- **00 — Project Init & Boilerplate Cleanup** — Moved the App Router from `app/` to `src/app/` and repointed the `@/*` alias to `./src`, stripped `page.tsx` to a single project-name heading and `globals.css` to the Tailwind import, dropped the Geist fonts, starter metadata, and unused Next/Vercel logos. Merged in `1732bb4`.
- **01 — Project & json-server Setup** — Added `db.seed.json` (6 books, real Open Library keys/covers, all three statuses) as the committed source of truth, with `scripts/reset-db.js` + `db:reset` rebuilding the gitignored `db.json`; installed `json-server` and `concurrently` and added `dev`/`dev:next`/`dev:api`; verified all four CRUD verbs against `:3001`. Corrected the v0.17 `--watch` syntax in the docs and the bare-`olKey` schema example that would have broken feature 07's duplicate detection. Merged in `37e86c0`.
- **02 — Home Page: Read-Only Table** — Added `Book`/`BookStatus` types, `getBooks` in `src/lib/json-server.ts`, a `useBooks` hook, `StatusBadge`/`StarScore` primitives, and `BookTable`; the home page renders the six seeded books with loading, empty, and error states. Status colours became six `@theme` tokens (base + darker `-ink` per status) because the design's tint-under-dark-text pill cannot hit readable contrast from a single hex. Data loads client-side so a real loading state exists and features 04/05 can mutate, leaving `page.tsx` the only server component. Merged in `8c791e1`.
