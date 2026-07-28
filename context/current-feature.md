# Current Feature

<!-- Feature Name -->

06 — Search View: Open Library Results

## Status

<!-- Not Started|In Progress|Completed -->

In Progress

## Goals

<!-- Goals & requirements -->

Build a search view where the user can search for books via the Open Library API
and see results as a card grid. No "Add" functionality yet — just correct search,
loading, and empty/error states.

Requirements (from `context/features/06-search-open-library.md`):

- Search input, triggers `GET https://openlibrary.org/search.json?q={query}`
- Results shown as a responsive grid (3-4 cards per row), dark themed per `context/project-overview.md`
- Each card shows: cover image (via `https://covers.openlibrary.org/b/id/{cover_id}-M.jpg`), title, author, star rating
- Handle: no query yet (empty state), loading state, no results found, and API error/unreachable

Acceptance criteria:

- Searching a known title (e.g. "Pride and Prejudice") returns and renders results correctly
- Searching a nonsense string shows a clear "no results" state, not a blank grid
- Simulated network failure shows an error state, not a frozen UI

Out of scope: `olKey` matching and the Add button (feature 07).

Parts:

1. Data layer — `src/types/open-library.ts` + `searchBooks` in `src/lib/open-library.ts`, and a `useBookSearch` hook
2. Search route + dark shell — `/search` page, dark theme tokens, back link, heading, search input, and the design's `+ Add Book` entry point on home
3. Results grid + `SearchResultCard`
4. The four states — idle, loading, no results, error

## Notes

<!-- Any extra notes -->

- The bare `search.json?q=` response does not include `ratings_average`, so the
  request adds `fields=` to ask for it — the card's star rating comes from that.

## History

<!-- Keep this updated. Earliest to latest -->

- **00 — Project Init & Boilerplate Cleanup** — Moved the App Router from `app/` to `src/app/` and repointed the `@/*` alias to `./src`, stripped `page.tsx` to a single project-name heading and `globals.css` to the Tailwind import, dropped the Geist fonts, starter metadata, and unused Next/Vercel logos. Merged in `1732bb4`.
- **01 — Project & json-server Setup** — Added `db.seed.json` (6 books, real Open Library keys/covers, all three statuses) as the committed source of truth, with `scripts/reset-db.js` + `db:reset` rebuilding the gitignored `db.json`; installed `json-server` and `concurrently` and added `dev`/`dev:next`/`dev:api`; verified all four CRUD verbs against `:3001`. Corrected the v0.17 `--watch` syntax in the docs and the bare-`olKey` schema example that would have broken feature 07's duplicate detection. Merged in `37e86c0`.
- **02 — Home Page: Read-Only Table** — Added `Book`/`BookStatus` types, `getBooks` in `src/lib/json-server.ts`, a `useBooks` hook, `StatusBadge`/`StarScore` primitives, and `BookTable`; the home page renders the six seeded books with loading, empty, and error states. Status colours became six `@theme` tokens (base + darker `-ink` per status) because the design's tint-under-dark-text pill cannot hit readable contrast from a single hex. Data loads client-side so a real loading state exists and features 04/05 can mutate, leaving `page.tsx` the only server component. Merged in `8c791e1`.
- **03 — Book Detail Drawer: View Only** — Added `BookDrawer`, opened by clicking a table row, showing cover, title, type, author, link, score, and a static status badge; closes via the bare `×` or the backdrop, full-screen below 768px and a 400px right-hand panel above. Selection and open state are separate pieces of state in `ReadingList`, so the panel keeps its content while sliding out and stays on live data for feature 04. Built first from feature 02's table styling and re-laid out against `Reading List.dc.html` before commit; `project-overview.md` now states the design file is the strict source of truth, read before building. Merged in `d834ba8`.
- **04 — Status Editing (Drawer)** — Added `updateBookStatus` (`PATCH /books/:id`), an `updateStatus` mutation on `useBooks`, and `StatusSelect` in place of the drawer's static badge; the table's badge recolours from the server's response with no refetch, and a failed save reports under the control. `updateStatus` rejects rather than setting the hook's `error`, which would swap the whole table for an error state, and the in-flight book and error are keyed by book id so a late rejection isn't reported against whichever book the drawer has moved on to. Labels and the design's option order moved to `src/lib/book-status.ts`. Built first as a tinted pill because the design MCP was unconsented, then rebuilt from `Reading List.dc.html` once `/design consent` was granted — the design specifies a plain full-width white select, not a pill. Merged in `51a89a1`.
- **05 — Delete Flow (Drawer)** — Added `deleteBook` (`DELETE /books/:id`), a `removeBook` mutation on `useBooks`, and the design's `Delete Book` button at the foot of the drawer, behind a confirmation card centred over the panel with the fields dimmed and blurred behind it; confirming clears the book from `db.json` and the table and closes the drawer, cancelling touches nothing. The confirm is the only deviation from the design, which deletes on a single click — it began as an inline swap and became a popup on review. The popup is a sibling of the panel rather than a child, since the panel scrolls and an overlay inside it would scroll away from what it covers, and it reuses the design's two delete reds so the flow adds no new colour. `removeBook` rejects rather than setting the hook's `error` and drops the book from local state instead of refetching, both following feature 04; the armed confirm is keyed by book id, the panel goes `inert` behind the popup, and closing disarms the confirm except mid-request, which is why the success path calls `onClose` rather than the guarded `handleClose`. Merged in `621bbcb`.
