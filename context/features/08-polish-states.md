# Feature: Polish — Loading/Empty/Error States

## Status

Not Started

## Goal

Pass over every screen built in features 1-7 and make sure loading, empty, and error states are consistent and handled everywhere, rather than ad-hoc per feature.

## Requirements

- Consistent loading indicator pattern (skeleton or spinner) used across table, drawer, and search
- Empty state for a fresh install with zero books in the table
- Clear error states if json-server is unreachable (table, drawer actions) and if Open Library is unreachable (search)
- Quick pass on responsive behavior across all screens per @context/project-overview.md's responsive rules

## Acceptance Criteria

- Every fetch in the app (table load, drawer actions, search, add) has a defined loading, success, and error state — none silently do nothing on failure
- Fresh `db.json` with an empty `books` array shows a clear "no books yet" message instead of a blank table
- Manual check on mobile viewport width for table, drawer, and search grid

## Depends On

- Features 1 through 7 — this feature only makes sense once everything else exists to polish

## Notes

This is intentionally last since it touches every screen rather than introducing new data flow. Don't add new functionality here — only consistency and error handling for what's already built.
