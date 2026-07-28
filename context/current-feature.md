# Current Feature

<!-- Feature Name -->

08 — Polish: Loading/Empty/Error States

## Status

<!-- Not Started|In Progress|Completed -->

In Progress

## Goals

<!-- Goals & requirements -->

Pass over every screen built in features 1-7 and make sure loading, empty, and
error states are consistent and handled everywhere, rather than ad-hoc per
feature. No new functionality — consistency and error handling only.

### Requirements

- Consistent loading indicator pattern (skeleton or spinner) used across table, drawer, and search
- Empty state for a fresh install with zero books in the table
- Clear error states if json-server is unreachable (table, drawer actions) and if Open Library is unreachable (search)
- Quick pass on responsive behavior across all screens per `context/project-overview.md`'s responsive rules

### Acceptance Criteria

- Every fetch in the app (table load, drawer actions, search, add) has a defined loading, success, and error state — none silently do nothing on failure
- Fresh `db.json` with an empty `books` array shows a clear "no books yet" message instead of a blank table
- Manual check on mobile viewport width for table, drawer, and search grid

### Parts

1. **`StatePanel`** — one shell for every loading/empty/error panel, on both the light table and the dark search grid, replacing the two ad-hoc sets.
2. **`Spinner`** — one loading indicator, used by both panels and by the three in-flight controls (status save, delete, add).
3. **Error-state gaps** — a stale add error outliving its search, drawer errors surviving a close, and alert semantics across both surfaces.
4. **Responsive pass** — stacked table rows below 768px per the responsive rules, small-viewport padding, and a manual check of the drawer and search grid.

## Notes

<!-- Any extra notes -->

`Reading List.dc.html` has no loading indicator, no error state, and no
responsive treatment of any kind — its drawer is a fixed 400px panel at
`max-width:92vw` and its table never restacks. Every state in this feature is
therefore a deviation from the design, built against `project-overview.md`'s
responsive rules instead. The design's empty state is the one exception: it
specifies the dashed 96px/24px panel the home page already ships.

## History

<!-- Keep this updated. Earliest to latest -->

- **00 — Project Init & Boilerplate Cleanup** — Moved the App Router from `app/` to `src/app/` and repointed the `@/*` alias to `./src`, stripped `page.tsx` to a single project-name heading and `globals.css` to the Tailwind import, dropped the Geist fonts, starter metadata, and unused Next/Vercel logos. Merged in `1732bb4`.
- **01 — Project & json-server Setup** — Added `db.seed.json` (6 books, real Open Library keys/covers, all three statuses) as the committed source of truth, with `scripts/reset-db.js` + `db:reset` rebuilding the gitignored `db.json`; installed `json-server` and `concurrently` and added `dev`/`dev:next`/`dev:api`; verified all four CRUD verbs against `:3001`. Corrected the v0.17 `--watch` syntax in the docs and the bare-`olKey` schema example that would have broken feature 07's duplicate detection. Merged in `37e86c0`.
- **02 — Home Page: Read-Only Table** — Added `Book`/`BookStatus` types, `getBooks` in `src/lib/json-server.ts`, a `useBooks` hook, `StatusBadge`/`StarScore` primitives, and `BookTable`; the home page renders the six seeded books with loading, empty, and error states. Status colours became six `@theme` tokens (base + darker `-ink` per status) because the design's tint-under-dark-text pill cannot hit readable contrast from a single hex. Data loads client-side so a real loading state exists and features 04/05 can mutate, leaving `page.tsx` the only server component. Merged in `8c791e1`.
- **03 — Book Detail Drawer: View Only** — Added `BookDrawer`, opened by clicking a table row, showing cover, title, type, author, link, score, and a static status badge; closes via the bare `×` or the backdrop, full-screen below 768px and a 400px right-hand panel above. Selection and open state are separate pieces of state in `ReadingList`, so the panel keeps its content while sliding out and stays on live data for feature 04. Built first from feature 02's table styling and re-laid out against `Reading List.dc.html` before commit; `project-overview.md` now states the design file is the strict source of truth, read before building. Merged in `d834ba8`.
- **04 — Status Editing (Drawer)** — Added `updateBookStatus` (`PATCH /books/:id`), an `updateStatus` mutation on `useBooks`, and `StatusSelect` in place of the drawer's static badge; the table's badge recolours from the server's response with no refetch, and a failed save reports under the control. `updateStatus` rejects rather than setting the hook's `error`, which would swap the whole table for an error state, and the in-flight book and error are keyed by book id so a late rejection isn't reported against whichever book the drawer has moved on to. Labels and the design's option order moved to `src/lib/book-status.ts`. Built first as a tinted pill because the design MCP was unconsented, then rebuilt from `Reading List.dc.html` once `/design consent` was granted — the design specifies a plain full-width white select, not a pill. Merged in `51a89a1`.
- **05 — Delete Flow (Drawer)** — Added `deleteBook` (`DELETE /books/:id`), a `removeBook` mutation on `useBooks`, and the design's `Delete Book` button at the foot of the drawer, behind a confirmation card centred over the panel with the fields dimmed and blurred behind it; confirming clears the book from `db.json` and the table and closes the drawer, cancelling touches nothing. The confirm is the only deviation from the design, which deletes on a single click — it began as an inline swap and became a popup on review. The popup is a sibling of the panel rather than a child, since the panel scrolls and an overlay inside it would scroll away from what it covers, and it reuses the design's two delete reds so the flow adds no new colour. `removeBook` rejects rather than setting the hook's `error` and drops the book from local state instead of refetching, both following feature 04; the armed confirm is keyed by book id, the panel goes `inert` behind the popup, and closing disarms the confirm except mid-request, which is why the success path calls `onClose` rather than the guarded `handleClose`. Merged in `621bbcb`.
- **06 — Search View: Open Library Results** — Added `src/types/open-library.ts`, `searchBooks` in `src/lib/open-library.ts`, a debounced `useBookSearch` hook, and a `/search` route rendering the design's dark card grid via `SearchBooks` and `SearchResultCard`; plus five dark `@theme` tokens, a 13px `size` and a `tone` on `StarScore`, and the design's `+ Add Book` button in the home header and empty state. The request adds `fields=` and `limit=24` to the spec's bare `?q=`, since `ratings_average` — the card's stars — is absent from the default response and the API otherwise pages at 100. Search fires on typing behind a 400ms debounce rather than a submit, because the design's input has no submit control; only `author_name[0]` is shown, as Open Library credits narrators and translators in that array. `useBookSearch` stores one record tagged with the query it answered and derives `results` / `isSearching` / `error` from whether that tag still matches the box, so stale results can't be shown as this query's answer and the debounce window itself reads as loading — a shape arrived at because lint's `set-state-in-effect` rejected the stored-state version. Two deviations from the design, which has neither: the four state panels, mirroring the home page's in the dark palette, and the `+ Add Book` entry point, without which `/search` is reachable only by URL. Fixed along the way: a `py-16` written over a shared `py-24` (Tailwind conflicts resolve by stylesheet order, not class order), a `type="search"` input drawing a clear button the design doesn't have, and — on review after the merge — an `aria-live` region wrapping the whole grid, which made every search read out all 24 cards. Merged in `843b23b`, with `b916280` following.
- **07 — Add-to-List + "Already Added" Detection** — Added `createBook` (`POST /books`), a `NewBook` type, `toNewBook` in `src/lib/open-library.ts`, and an `addBook` mutation on `useBooks`; each search card now ends in the design's `Add` button or its muted `Already Added` label, and adding writes a full record at `want_to_read` / `score: 0` and flips the card with no re-search. `SearchBooks` is where the two halves finally meet — it calls both hooks, and neither learned about the other. Matching is a memoized `Set` of `olKey` and never a title, since a search for "The Hobbit" returns several unrelated works by that name. Three fields have no source in the search response: `type` is `"Unknown"` rather than Open Library's crowd-edited `subject`, `link` is the `olKey` resolved against `openlibrary.org`, and `score` is `0` rather than the card's stars, which are the community rating and not the user's own. `addBook` rejects rather than setting the hook's `error` and appends the created book instead of refetching, both following features 04 and 05, and the in-flight card and its error are keyed by `olKey` for the same reason those key by book id. Three additions the design has no notion of: the disabled `Adding…` state, a per-card failure message, and a notice when `GET /books` itself fails, without which "Already Added" would quietly stop being true. Fixed along the way: a result with no cover stores an empty `coverUrl`, which `next/image` treats as an error — the drawer was the only place still passing it through unguarded. Left for feature 08: a stale add-error outliving its search, and focus dropping to the body when a card flips. Merged in `55df4f2`, with `7f72d03` following.
