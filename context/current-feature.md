# Current Feature

<!-- Feature Name -->

07 — Add-to-List + "Already Added" Detection

## Status

<!-- Not Started|In Progress|Completed -->

In Progress

## Goals

<!-- Goals & requirements -->

Let the user add a searched book to their reading list, and correctly show
"Already Added" instead of an Add button for books already in the list.

Requirements:

- "Add" button on each search result card (from feature 6)
- On click, `POST http://localhost:3001/books` with the mapped fields, default
  `status: "want_to_read"`, `score: 0`, and `olKey` set from the Open Library
  result's `key`
- Before rendering each card's button, fetch current `GET /books` and compare
  each search result's `key` against existing `olKey` values — match on `olKey`,
  never on title (titles collide across editions)
- If a match is found, render a disabled "Already Added" label instead of the
  Add button
- After a successful add, that card should immediately flip to "Already Added"
  without requiring a fresh search

Acceptance criteria:

- Adding a new book creates a correct entry in `db.json` with all required fields
- A book already in the list shows "Already Added" on search, not an Add button
- Adding a book updates its card's state immediately, without needing to re-run
  the search

## Notes

<!-- Any extra notes -->

Parts, in order:

1. Data layer — `NewBook` type, `addBook` (`POST /books`) in `json-server.ts`,
   and the Open Library result → new book mapping
2. `useBooks` — an `addBook` mutation appending the created book to local state
3. `SearchResultCard` — the design's Add button / "Already Added" label
4. `SearchBooks` — books fetch, `olKey` matching, add handler, error states

Design reference: `Reading List.dc.html` specifies both card endings — an `Add`
button in the accent colour and, when added, a muted `Already Added` span, both
`align-self:flex-start` under the stars.

## History

<!-- Keep this updated. Earliest to latest -->

- **00 — Project Init & Boilerplate Cleanup** — Moved the App Router from `app/` to `src/app/` and repointed the `@/*` alias to `./src`, stripped `page.tsx` to a single project-name heading and `globals.css` to the Tailwind import, dropped the Geist fonts, starter metadata, and unused Next/Vercel logos. Merged in `1732bb4`.
- **01 — Project & json-server Setup** — Added `db.seed.json` (6 books, real Open Library keys/covers, all three statuses) as the committed source of truth, with `scripts/reset-db.js` + `db:reset` rebuilding the gitignored `db.json`; installed `json-server` and `concurrently` and added `dev`/`dev:next`/`dev:api`; verified all four CRUD verbs against `:3001`. Corrected the v0.17 `--watch` syntax in the docs and the bare-`olKey` schema example that would have broken feature 07's duplicate detection. Merged in `37e86c0`.
- **02 — Home Page: Read-Only Table** — Added `Book`/`BookStatus` types, `getBooks` in `src/lib/json-server.ts`, a `useBooks` hook, `StatusBadge`/`StarScore` primitives, and `BookTable`; the home page renders the six seeded books with loading, empty, and error states. Status colours became six `@theme` tokens (base + darker `-ink` per status) because the design's tint-under-dark-text pill cannot hit readable contrast from a single hex. Data loads client-side so a real loading state exists and features 04/05 can mutate, leaving `page.tsx` the only server component. Merged in `8c791e1`.
- **03 — Book Detail Drawer: View Only** — Added `BookDrawer`, opened by clicking a table row, showing cover, title, type, author, link, score, and a static status badge; closes via the bare `×` or the backdrop, full-screen below 768px and a 400px right-hand panel above. Selection and open state are separate pieces of state in `ReadingList`, so the panel keeps its content while sliding out and stays on live data for feature 04. Built first from feature 02's table styling and re-laid out against `Reading List.dc.html` before commit; `project-overview.md` now states the design file is the strict source of truth, read before building. Merged in `d834ba8`.
- **04 — Status Editing (Drawer)** — Added `updateBookStatus` (`PATCH /books/:id`), an `updateStatus` mutation on `useBooks`, and `StatusSelect` in place of the drawer's static badge; the table's badge recolours from the server's response with no refetch, and a failed save reports under the control. `updateStatus` rejects rather than setting the hook's `error`, which would swap the whole table for an error state, and the in-flight book and error are keyed by book id so a late rejection isn't reported against whichever book the drawer has moved on to. Labels and the design's option order moved to `src/lib/book-status.ts`. Built first as a tinted pill because the design MCP was unconsented, then rebuilt from `Reading List.dc.html` once `/design consent` was granted — the design specifies a plain full-width white select, not a pill. Merged in `51a89a1`.
- **05 — Delete Flow (Drawer)** — Added `deleteBook` (`DELETE /books/:id`), a `removeBook` mutation on `useBooks`, and the design's `Delete Book` button at the foot of the drawer, behind a confirmation card centred over the panel with the fields dimmed and blurred behind it; confirming clears the book from `db.json` and the table and closes the drawer, cancelling touches nothing. The confirm is the only deviation from the design, which deletes on a single click — it began as an inline swap and became a popup on review. The popup is a sibling of the panel rather than a child, since the panel scrolls and an overlay inside it would scroll away from what it covers, and it reuses the design's two delete reds so the flow adds no new colour. `removeBook` rejects rather than setting the hook's `error` and drops the book from local state instead of refetching, both following feature 04; the armed confirm is keyed by book id, the panel goes `inert` behind the popup, and closing disarms the confirm except mid-request, which is why the success path calls `onClose` rather than the guarded `handleClose`. Merged in `621bbcb`.
- **06 — Search View: Open Library Results** — Added `src/types/open-library.ts`, `searchBooks` in `src/lib/open-library.ts`, a debounced `useBookSearch` hook, and a `/search` route rendering the design's dark card grid via `SearchBooks` and `SearchResultCard`; plus five dark `@theme` tokens, a 13px `size` and a `tone` on `StarScore`, and the design's `+ Add Book` button in the home header and empty state. The request adds `fields=` and `limit=24` to the spec's bare `?q=`, since `ratings_average` — the card's stars — is absent from the default response and the API otherwise pages at 100. Search fires on typing behind a 400ms debounce rather than a submit, because the design's input has no submit control; only `author_name[0]` is shown, as Open Library credits narrators and translators in that array. `useBookSearch` stores one record tagged with the query it answered and derives `results` / `isSearching` / `error` from whether that tag still matches the box, so stale results can't be shown as this query's answer and the debounce window itself reads as loading — a shape arrived at because lint's `set-state-in-effect` rejected the stored-state version. Two deviations from the design, which has neither: the four state panels, mirroring the home page's in the dark palette, and the `+ Add Book` entry point, without which `/search` is reachable only by URL. Fixed along the way: a `py-16` written over a shared `py-24` (Tailwind conflicts resolve by stylesheet order, not class order), a `type="search"` input drawing a clear button the design doesn't have, and — on review after the merge — an `aria-live` region wrapping the whole grid, which made every search read out all 24 cards. Merged in `843b23b`, with `b916280` following.
