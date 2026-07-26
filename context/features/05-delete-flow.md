# Feature: Delete Flow (Drawer)

## Status

Not Started

## Goal

Add the ability to remove a book from the reading list, with a confirmation step before the delete actually happens.

## Requirements

- Delete button in the drawer
- Clicking it shows a confirmation step (modal or inline confirm) — the delete must never fire on a single click
- On confirmed delete, `DELETE http://localhost:3001/books/:id`
- After a successful delete, close the drawer and refresh the table so the row disappears

## Acceptance Criteria

- Clicking delete without confirming does nothing to the data
- Confirmed delete removes the book from `db.json` and from the table
- Drawer closes automatically after a successful delete

## Depends On

- Feature 3 (drawer must exist)

## Notes

Kept separate from status editing (feature 4) since delete is destructive and deserves its own scrutiny and its own commit, per @context/ai-interaction.md's "never delete files without clarification" spirit — same caution applies to deleting data.
