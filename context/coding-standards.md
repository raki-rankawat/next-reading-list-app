# Coding Standards

## TypeScript

- Strict mode enabled
- No `any` types - use proper typing or `unknown`
- Define interfaces for all props, API responses, and data models (`Book`, `BookStatus`, etc.)
- Use type inference where obvious, explicit types where helpful

## React

- Functional components only (no class components)
- Use hooks for state and side effects
- Keep components focused - one job per component
- Extract reusable logic into custom hooks (e.g. a `useBooks` hook wrapping json-server fetches)

## Next.js

- Server components by default
- Only use `'use client'` when needed (interactivity, hooks, browser APIs, drawer/search state)
- Fetch data directly in server components where possible; use client-side fetch for interactive search and mutations
- Dynamic behavior (status update, delete) happens client-side against json-server, not via Server Actions, since there's no real backend to act on

## Tailwind CSS

- No component library (no shadcn/ui) — plain Tailwind utility classes only
- Use CSS custom properties for the three status colors (see `project-overview.md`)
- No inline styles

## Data Layer (json-server, not a database)

- All reading list CRUD goes through `http://localhost:3001/books` via `fetch`
- `GET /books` — list all
- `POST /books` — add a book (default `status: "want_to_read"`, `score: 0`)
- `PATCH /books/:id` — update status
- `DELETE /books/:id` — remove a book, always behind a confirmation step in the UI
- No ORM, no migrations, no schema validation library — `db.json` is hand-shaped to match the `Book` interface

## External API (Open Library)

- `GET https://openlibrary.org/search.json?q={query}` for search
- Cover images via `https://covers.openlibrary.org/b/id/{cover_id}-M.jpg`
- Match "already added" state by comparing Open Library's `key` field against the `olKey` field of existing books — never match on title, since titles collide across editions

## File Organization

- Components: `src/components/[feature]/ComponentName.tsx`
- Pages: `src/app/[route]/page.tsx`
- Types: `src/types/book.ts`
- Lib/Utils: `src/lib/[utility].ts` (e.g. `src/lib/json-server.ts`, `src/lib/open-library.ts`)

## Naming

- Components: PascalCase (`StatusBadge.tsx`)
- Files: match component name or kebab-case
- Functions: camelCase
- Constants: SCREAMING_SNAKE_CASE
- Types/Interfaces: PascalCase (no prefix)

## Error Handling

- Use try/catch around all fetch calls (both json-server and Open Library)
- Show user-friendly error/loading states — don't let a failed fetch silently render nothing

## Code Quality

- No commented-out code unless specified
- No unused imports or variables
- Keep functions under 50 lines when possible
- Make minimal changes to accomplish the task; don't refactor unrelated code

## Explicitly Not Used

- No Prisma, no ORM, no real database
- No NextAuth or any authentication library
- No Zod or other schema validation (no real DB writes to validate against)
- No Stripe, no payments
