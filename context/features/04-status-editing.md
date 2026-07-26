# Feature: Status Editing (Drawer)

## Status

Not Started

## Goal

Make the status field in the drawer editable, persisting changes back to json-server and reflecting them in the table.

## Requirements

- Status field in the drawer becomes a dropdown/select with the three status options
- On change, `PATCH http://localhost:3001/books/:id` with the new status
- After a successful PATCH, the table's status badge for that book updates (either via refetch or local state update)
- Handle a failed PATCH with a visible error — don't fail silently

## Acceptance Criteria

- Changing status in the drawer updates `db.json` (verify directly, not just visually)
- Table reflects the new status/color without a full page reload
- A simulated failed request (e.g. json-server stopped) shows an error state, not a blank/frozen UI

## Depends On

- Feature 3 (drawer must exist and display status)

## Notes

This is a separate feature from delete (feature 5) because it's a distinct write operation (PATCH vs DELETE) with its own failure mode and its own commit, per @context/ai-interaction.md.
