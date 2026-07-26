# Feature: Search View — Open Library Results

## Status

Not Started

## Goal

Build a search view where the user can search for books via the Open Library API and see results as a card grid. No "Add" functionality yet — just correct search, loading, and empty/error states.

## Requirements

- Search input, triggers `GET https://openlibrary.org/search.json?q={query}`
- Results shown as a responsive grid (3-4 cards per row), dark themed per @context/project-overview.md
- Each card shows: cover image (via `https://covers.openlibrary.org/b/id/{cover_id}-M.jpg`), title, author, star rating
- Handle: no query yet (empty state), loading state, no results found, and API error/unreachable

## Acceptance Criteria

- Searching a known title (e.g. "Pride and Prejudice") returns and renders results correctly
- Searching a nonsense string shows a clear "no results" state, not a blank grid
- Simulated network failure shows an error state, not a frozen UI

## Depends On

- Nothing from earlier features functionally, but sits after the CRUD features (2-5) by design, so the app already has a working list to add into once this is done

## Notes

No `olKey` matching or "Add" button logic yet — that's feature 7. This feature is purely about the search fetch and rendering.
