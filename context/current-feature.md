# Current Feature

<!-- Feature Name -->

04 — Status Editing (Drawer)

## Status

<!-- Not Started|In Progress|Completed -->

In Progress

## Goals

<!-- Goals & requirements -->

Make the status field in the drawer editable, persisting changes back to json-server and reflecting them in the table.

### Requirements

- Status field in the drawer becomes a dropdown/select with the three status options
- On change, `PATCH http://localhost:3001/books/:id` with the new status
- After a successful PATCH, the table's status badge for that book updates (either via refetch or local state update)
- Handle a failed PATCH with a visible error — don't fail silently

### Acceptance Criteria

- Changing status in the drawer updates `db.json` (verify directly, not just visually)
- Table reflects the new status/color without a full page reload
- A simulated failed request (e.g. json-server stopped) shows an error state, not a blank/frozen UI

## Notes

<!-- Any extra notes -->

### Status control matches the design

`StatusSelect` is the design's drawer `<select>` verbatim: full width, `9px 12px`
padding, `8px` radius, a `1px` border in the shared border tone, 14px ink text
on white, and the platform's own select chrome. Options run in the design's
order — Want to Read, Currently Reading, Read.

Notably it is **not** the table's coloured pill. The first build of this feature
assumed it was, because the design file was unreadable at the time and the
control was extrapolated from feature 03's badge; every dimension of that guess
was wrong. The design was read once `/design consent` was granted and the
control rebuilt from it.

### Deviations

- **Disabled styling on the select** (`disabled:cursor-wait disabled:opacity-60`)
  while a PATCH is in flight. The design's select is synchronous and has no
  notion of a save.
- **Error message under the select.** Required by this feature's spec ("handle a
  failed PATCH with a visible error"); the design has no error state.
- The design's drawer also carries Added/Finished dates, a Notes textarea, and
  the Delete Book button. Dates and notes are absent from the `Book` model in
  `project-overview.md`; delete belongs to feature 05. Both were already out of
  scope in feature 03 and stay so here.

## History

<!-- Keep this updated. Earliest to latest -->

- **00 — Project Init & Boilerplate Cleanup** — Moved the App Router from `app/` to `src/app/` and repointed the `@/*` alias to `./src`, stripped `page.tsx` to a single project-name heading and `globals.css` to the Tailwind import, dropped the Geist fonts, starter metadata, and unused Next/Vercel logos. Merged in `1732bb4`.
- **01 — Project & json-server Setup** — Added `db.seed.json` (6 books, real Open Library keys/covers, all three statuses) as the committed source of truth, with `scripts/reset-db.js` + `db:reset` rebuilding the gitignored `db.json`; installed `json-server` and `concurrently` and added `dev`/`dev:next`/`dev:api`; verified all four CRUD verbs against `:3001`. Corrected the v0.17 `--watch` syntax in the docs and the bare-`olKey` schema example that would have broken feature 07's duplicate detection. Merged in `37e86c0`.
- **02 — Home Page: Read-Only Table** — Added `Book`/`BookStatus` types, `getBooks` in `src/lib/json-server.ts`, a `useBooks` hook, `StatusBadge`/`StarScore` primitives, and `BookTable`; the home page renders the six seeded books with loading, empty, and error states. Status colours became six `@theme` tokens (base + darker `-ink` per status) because the design's tint-under-dark-text pill cannot hit readable contrast from a single hex. Data loads client-side so a real loading state exists and features 04/05 can mutate, leaving `page.tsx` the only server component. Merged in `8c791e1`.
- **03 — Book Detail Drawer: View Only** — Added `BookDrawer`, opened by clicking a table row, showing cover, title, type, author, link, score, and a static status badge; closes via the bare `×` or the backdrop, full-screen below 768px and a 400px right-hand panel above. Selection and open state are separate pieces of state in `ReadingList`, so the panel keeps its content while sliding out and stays on live data for feature 04. Built first from feature 02's table styling and re-laid out against `Reading List.dc.html` before commit; `project-overview.md` now states the design file is the strict source of truth, read before building. Merged in `d834ba8`.
