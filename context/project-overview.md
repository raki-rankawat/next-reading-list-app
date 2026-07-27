# Reading List - Project Overview

> A minimal personal reading list tracker

---

## Table of Contents

- [Problem Statement](#problem-statement)
- [Features](#features)
- [Data Architecture](#data-architecture)
- [Tech Stack](#tech-stack)
- [UI/UX Guidelines](#uiux-guidelines)
- [Explicit Non-Goals](#explicit-non-goals)

---

## Problem Statement

A simple, no-login way to track personal reading progress — what's been read, what's currently being read, and what's on the to-read list — without needing an account, a real backend, or a database.

---

## Features

### A. Reading List (Home Page)

A table of all saved books with columns: Name, Type, Status, Score, Author, Link.

### B. Status

Every book has exactly one status:

| Status              | Color  |
| ------------------- | ------ |
| `read`               | Green  |
| `currently_reading`   | Orange |
| `want_to_read`        | Blue   |

Status is shown as a colored pill badge in the table and is editable from the book detail drawer.

### C. Book Detail Drawer

Clicking a row in the table opens a slide-in drawer showing: cover image, author, link, score (stars), and an editable status dropdown. Includes a delete button, with a confirmation step before deleting.

### D. Search & Add Book

A search view that queries the Open Library API and displays results as a grid of cards (cover, title, author, star rating). Each card has an "Add" button, unless the book is already in the reading list, in which case it shows a disabled "Already Added" label instead. Matching against the existing list is done via Open Library's stable `key` (stored as `olKey`), not by title string, since titles can collide across editions.

Adding a book POSTs it to json-server with a default status of `want_to_read` and a score of `0`.

### E. Core Features

- Full CRUD on the reading list (add, view, edit status, delete)
- Persisted via json-server (`db.json`), not a real database
- No authentication

---

## Data Architecture

### `db.json`

```json
{
  "books": [
    {
      "id": "1",
      "title": "Pride and Prejudice",
      "author": "Jane Austen",
      "type": "Fiction",
      "status": "read",
      "score": 3,
      "coverUrl": "https://covers.openlibrary.org/b/id/12345-M.jpg",
      "link": "https://openlibrary.org/works/OL...",
      "olKey": "/works/OL66554W"
    }
  ]
}
```

`olKey` stores Open Library's `key` field verbatim, including the `/works/` prefix — that is the exact string the search API returns. Feature 7 compares a search result's `key` against `olKey` directly, so storing it in any other shape would require normalizing on both sides.

`status` must be exactly one of: `"read"`, `"currently_reading"`, `"want_to_read"`.

Seed `db.json` with 5-6 sample books covering all three statuses so the UI isn't empty on first run.

### External API

Open Library, no API key required:

- Search: `https://openlibrary.org/search.json?q={query}`
- Cover images: `https://covers.openlibrary.org/b/id/{cover_id}-M.jpg`

---

## Tech Stack

| Category      | Technology                | Notes                                          |
| ------------- | -------------------------- | ----------------------------------------------- |
| **Framework** | Next.js (App Router)       | Single codebase, server components by default   |
| **Language**  | TypeScript                 | Strict mode                                      |
| **Styling**   | Tailwind CSS                | No component library — plain Tailwind            |
| **Data**      | json-server (`db.json`)     | Fake REST API, standing in for a real backend    |
| **Search**    | Open Library API            | No key required, used for adding new books       |
| **Auth**      | None                        | Fully open, single-user, local use               |

---

## UI/UX Guidelines

### Design Principles

- Minimal and clean — Notion-style table for the home page
- Dark themed card grid for the search/add view (see reference screenshot)
- Generous whitespace, rounded corners, soft shadows
- No component library — hand-built with Tailwind utility classes

### Design Reference

A working prototype exists in Claude Design at:
`https://claude.ai/design/p/529c3d37-dc74-4ef9-8d5a-e758ce3e5835?file=Reading+List.dc.html`

Key file: `Reading List.dc.html` (also reads `support.js`)

This is the source of truth for every UI feature. Match it strictly — layout, element order, sizes, colours, and motion — and **read it before building the component, not after**. Do not approximate a screen from already-built components. It is a design reference rather than implementation code, so translate its inline styles into Tailwind per `coding-standards.md`, but do not restructure what it lays out.

Deviate only where a feature spec explicitly overrides it (typically a control that belongs to a later feature), and record each deviation in `context/current-feature.md`.

Reading it requires the Claude Design MCP server registered in Claude Code:
`claude mcp add --scope user --transport http claude-design https://api.anthropic.com/v1/design/mcp`

A newly registered server's tools only load on the next session. If the import tools are missing, the `DesignSync` read methods reach the same project without them — `list_files`, then `get_file` with `projectId: "529c3d37-dc74-4ef9-8d5a-e758ce3e5835"`.

### Layout Structure

```
Home (/)
┌─────────────────────────────────────────────────┐
│  Reading List                    [ Add Book ]    │
├───────────┬────────┬───────────┬───────┬─────────┤
│  Name     │ Type   │ Status    │ Score │ Author  │
├───────────┼────────┼───────────┼───────┼─────────┤
│  Book A   │ Fiction│ ● Read    │ ★★★   │ Author  │
└───────────┴────────┴───────────┴───────┴─────────┘
   click row → drawer opens on the right
```

### Status Colors (CSS Variables)

```css
:root {
  --color-status-read: #22c55e;             /* Green */
  --color-status-currently-reading: #f97316; /* Orange */
  --color-status-want-to-read: #3b82f6;      /* Blue */
}
```

### Responsive Behavior

| Viewport         | Table                     | Drawer                |
| ---------------- | -------------------------- | ---------------------- |
| Desktop (≥1024px) | Full table                 | Slide-in from right    |
| Mobile (<768px)   | Stacked/simplified rows     | Full-screen overlay     |

---

## Explicit Non-Goals

- No authentication or user accounts
- No real database or ORM
- No state management library
- No test suite unless asked
- No AI features, payments, or file uploads

---

_This document describes the reading list app only. It is not related to any other project referenced during planning._
