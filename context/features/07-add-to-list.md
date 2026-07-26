# Feature: Add-to-List + "Already Added" Detection

## Status

Not Started

## Goal

Let the user add a searched book to their reading list, and correctly show "Already Added" instead of an Add button for books already in the list.

## Requirements

- "Add" button on each search result card (from feature 6)
- On click, `POST http://localhost:3001/books` with the mapped fields, default `status: "want_to_read"`, `score: 0`, and `olKey` set from the Open Library result's `key`
- Before rendering each card's button, fetch current `GET /books` and compare each search result's `key` against existing `olKey` values — match on `olKey`, never on title (titles collide across editions)
- If a match is found, render a disabled "Already Added" label instead of the Add button
- After a successful add, that card should immediately flip to "Already Added" without requiring a fresh search

## Acceptance Criteria

- Adding a new book creates a correct entry in `db.json` with all required fields
- A book already in the list shows "Already Added" on search, not an Add button
- Adding a book updates its card's state immediately, without needing to re-run the search

## Depends On

- Feature 6 (search must return results to add)
- Feature 1's schema (fields must match what the table/drawer expect)

## Notes

This is its own feature separate from feature 6 because it cross-references two data sources (Open Library results + the current `books` list), which is a different bug surface than a plain search fetch.
